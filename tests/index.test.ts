/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { expect, test } from '@jest/globals';
import { toHaveBeenCalledNth, spyInvocationOrder } from './matchers/toHaveBeenCalledNth';
import { authorize as authorizeGoolge, getRows } from '../src/import/import';
import {
  createMap,
  getSpreadsheet,
} from '../src/digestion/mapping';
import digest from '../src/digestion/digest';
import { authorizeMixpanel, getMixpanelCredentials } from '../src/export/export';
import main from '../src/index';

expect.extend({
  toHaveBeenCalledNth,
});

// Mock all dependencies
jest.mock('google-auth-library');
jest.mock('../src/import/import');
jest.mock('../src/digestion/mapping');
jest.mock('../src/digestion/digest');
jest.mock('../src/export/export');

// Define mock credentials
const mixpanelCredentials = {
  PROJECT_ID: 'savedProjectId',
  SERVICE_ACCOUNT: 'savedServiceAccount',
  SERVICE_ACCOUNT_PASSWORD: 'savedServiceAccountPassword',
};

// Define a mock spreadsheet params object
const targetSpreadsheet = {
  spreadsheetId: 'testId',
  range: 'testRange',
};

// Set up mock implementations/ return values
(getMixpanelCredentials as jest.Mock)
  .mockReturnValue(Promise.resolve(mixpanelCredentials));
const mockedAuthorize = (authorizeGoolge as jest.Mock)
  .mockReturnValue(Promise.resolve({}));
const mockedGetSpreadsheet = (getSpreadsheet as jest.Mock)
  .mockReturnValue(Promise.resolve(targetSpreadsheet));
const mockedGetRows = (getRows as jest.Mock)
  .mockImplementation((googleAuth, targetSheet) => Promise.resolve([['minimum', 'of', 'three', 'columns']]));
const mockedCreateMap = (createMap as jest.Mock)
  .mockImplementation((columns) => Promise.resolve({}));
const mockedDigest = (digest as jest.Mock).mockImplementation((s, m) => ({}));
const mockedExportData = jest.fn((digested) => 'HTTP Response');
const mockedMixpanelAuth = (authorizeMixpanel as jest.Mock)
  .mockImplementation((credentials) => ({ exportData: mockedExportData }));

describe('main script', () => {
  // Save references to the original log and error methods from console
  const { log, error } = console;

  beforeAll(() => {
    // Replaces log and error methods on console (disables )
    console.log = jest.fn();
    console.error = jest.fn();
  });

  beforeEach(() => {
    // Clear mock calls and instances for all mocks
    jest.clearAllMocks();
  });

  afterAll(() => {
    // Restores the log and error methods on console
    console.log = log;
    console.error = error;
  });

  test('retrieves Mixpanel credentials by invoking authorizeMixpanel', async () => {
    // Call method to ensure logic completes
    await main();

    // Method should only execute once
    expect(getMixpanelCredentials).toBeCalledTimes(1);
  });

  test('authorizes Google Sheets API by invoking authorize', async () => {
    // Call method to ensure logic completes
    await main();

    // Method should only execute once
    expect(authorizeGoolge).toBeCalledTimes(1);
  });

  test('gets target speadsheet parameters from user input by invoking getSpreadsheet', async () => {
    // Call method to ensure logic completes
    await main();

    // Method should only execute once
    expect(getSpreadsheet).toBeCalledTimes(1);
  });

  test('loads the data from the target spreadsheet by calling getRows with googleAuth and targetSheet', async () => {
    // Store the return object resulting from authorize invocation
    const googleAuth = await mockedAuthorize();

    // Store the return object resulting from getSpredsheet invocation
    const targetSheet = await mockedGetSpreadsheet();

    // Call method to ensure logic completes
    await main();

    // Method should only execute once
    expect(getRows).toBeCalledTimes(1);

    // Method should be called with the correct arguments
    expect(getRows).toBeCalledWith(googleAuth, targetSheet);
  });

  test('passes header row of target spreadsheet to createMap with user input', async () => {
    // Store the return object resulting from getRows invocation
    const sourceData = await mockedGetRows({}, {});

    // Store a new Set resulting from passing the first row of source data (header row)
    const columns = new Set(sourceData[0]);

    // Call method to ensure logic completes
    await main();

    // Method should only execute once
    expect(createMap).toBeCalledTimes(1);

    // Method should be called with the correct arguments
    expect(createMap).toBeCalledWith(columns);
  });

  test('passes the map object and loaded spreadsheet data to digest fn', async () => {
    // Store the return object resulting from getRows invocation
    const sourceData = await mockedGetRows({}, {});

    // Store the return object resulting createMap call (createMap expects a Set as argument)
    const map = await mockedCreateMap(new Set(sourceData[0]));

    // Call method to ensure logic completes
    await main();

    // Method should only execute once
    expect(digest).toBeCalledTimes(1);

    // Method should be called with the correct arguments
    expect(digest).toBeCalledWith(sourceData, map);
  });

  test('passed Mixpanel credentials to the invocation of mixpanelAuth', async () => {
    // Call method to ensure logic completes
    await main();

    // Method should only execute once
    expect(authorizeMixpanel).toBeCalledTimes(1);

    // Method should be called with the correct arguments
    expect(authorizeMixpanel).toBeCalledWith(mixpanelCredentials);
  });

  test('exports the digested data to the destination using Mixpanel SDK', async () => {
    // Store the exportData method by desturcting the result of mixpanelAuth invocation
    const { exportData } = mockedMixpanelAuth(mixpanelCredentials);

    // Store the result of digest invocation
    const digestedData = mockedDigest({}, {});

    // Call method to ensure logic completes
    await main();

    // Method should only execute once
    expect(exportData).toBeCalledTimes(1);

    // Method should be called with the correct arguments
    expect(exportData).toBeCalledWith(digestedData);
  });

  test('logs response to the console', async () => {
    // Store a reference to jest spy for console.log method
    const logSpy = jest.spyOn(console, 'log');

    // Call method to ensure logic completes
    await main();

    // console.log should only execute once
    expect(logSpy).toBeCalledTimes(1);

    // Argument passed to console.log should be the value returned from exportData invocation
    expect(logSpy).toBeCalledWith('HTTP Response');
  });

  test('catches thrown errors and prints them to the console', async () => {
    // Clear the mixpanelAuth mock fn
    mockedMixpanelAuth.mockClear();

    // Define a new mock implementation for mixpanelAuth
    (authorizeMixpanel as jest.Mock)
      .mockImplementation((credentials) => ({ exportData: jest.fn(() => { throw new Error('This is an error'); }) }));

    // Store a reference to jest spy for console.error method
    const errorSpy = jest.spyOn(console, 'error');

    // Await function execution (for errorSpy assertion)
    await main();

    // console.error should only execute once
    expect(errorSpy).toBeCalledTimes(1);

    // Await assertion that new call resolves returned promise to an error (fn returned from main())
    await expect(main()).resolves.toThrowError('This is an error');
  });

  test('calls functions in the correct order', async () => {
    // Clear the mixpanelAuth mock data
    mockedMixpanelAuth.mockClear();

    // Define export data as a jest mock fn (Note: this setup does not call mixpanelAuth)
    const exportData = jest.fn();

    // Define the mock implementation of mixpanelAuth (Note: this setup does not call mixpanelAuth)
    (authorizeMixpanel as jest.Mock)
      .mockImplementation((credentials) => ({ exportData }));

    // Pass mock functions to spyInvocationOrder (required step to use .toHaveBeenCalledNth matcher)
    spyInvocationOrder([
      getMixpanelCredentials,
      authorizeGoolge,
      getSpreadsheet,
      getRows,
      createMap,
      digest,
      authorizeMixpanel,
      exportData,
    ]);

    // Await funciton execution with mocked functions
    await main();

    // Functions should be called in the expected order
    expect(getMixpanelCredentials).toHaveBeenCalledNth(1);
    expect(authorizeGoolge).toHaveBeenCalledNth(2);
    expect(getSpreadsheet).toHaveBeenCalledNth(3);
    expect(getRows).toHaveBeenCalledNth(4);
    expect(createMap).toHaveBeenCalledNth(5);
    expect(digest).toHaveBeenCalledNth(6);
    expect(authorizeMixpanel).toHaveBeenCalledNth(7);
    expect(exportData).toHaveBeenCalledNth(8);
  });
});
