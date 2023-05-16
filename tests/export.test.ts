/* eslint-disable @typescript-eslint/naming-convention */
import { createInterface } from 'readline/promises';
import { join } from 'path';
import sdk from '@api/mixpaneldevdocs';
import * as fsp from 'fs/promises';
import * as fspMockModule from '../__mocks__/fs/promises';
import { authorizeMixpanel, getMixpanelCredentials } from '../src/export/export';

// Mock the dependencies
jest.mock('readline/promises');
jest.mock('fs/promises');
jest.mock('@api/mixpaneldevdocs');

// Declare mock types
type FSPMockType = typeof fspMockModule & typeof fsp;

// Declare label for mocked readline interface constructor
const mockedCreateInterface = createInterface as jest.Mock;

// Declare label for mocked sdk methods
const mockedAuth = sdk.auth as jest.Mock;
const mockedImportEvents = sdk.importEvents as jest.Mock;

describe('authorizeMixpanel', () => {
  // Store internal mock module method for updating mocked file system
  const { __setMockFiles } = fsp as FSPMockType;

  // Save the current work directory
  const filepath = join(process.cwd(), '.SECRET_mixpanel');

  // Save empty credentials to be used in tests
  const emptyCredentials = `{
    "PROJECT_ID": "",
    "SERVICE_ACCOUNT": "",
    "SERVICE_ACCOUNT_PASSWORD": ""
  }`;

  beforeEach(async () => {
    // Clear mocked methods before each test
    mockedCreateInterface.mockReset();

    // Overwrite the mocked file system storage
    __setMockFiles({ './emptyPath': '' });
  });

  test('returns saved credentials object', async () => {
    // Save empty object to be used as mocked file system storage
    const mockFiles: { [key:string]: string } = {};

    // Save test credentials to filepath in the storage object
    mockFiles[filepath] = `{
      "PROJECT_ID": "savedProjectId",
      "SERVICE_ACCOUNT": "savedServiceAccount",
      "SERVICE_ACCOUNT_PASSWORD": "savedServiceAccountPassword"
    }`;

    // Save mocked credential file in the mocked file system
    __setMockFiles(mockFiles);

    // Get credentials object
    const credentials = await getMixpanelCredentials();

    // Reads credential object saved in file system
    expect(fsp.readFile).toBeCalledWith(filepath);

    // Object should be returned when promise resolves
    expect(credentials).toBeInstanceOf(Object);

    // Object should have the appropriate shape (Mixpanel Credentials)
    expect(credentials).toEqual(expect.objectContaining({
      PROJECT_ID: 'savedProjectId',
      SERVICE_ACCOUNT: 'savedServiceAccount',
      SERVICE_ACCOUNT_PASSWORD: 'savedServiceAccountPassword',
    }));
  });

  test('triggers CLI input if credentials file does not exist', async () => {
    // Implement mocked readline for user input
    mockedCreateInterface.mockReturnValue({
      question: jest.fn().mockImplementation((): Promise<string> => Promise.resolve('test')),
      close: jest.fn(),
    });

    // Call method to ensure logic completes
    await getMixpanelCredentials();

    // Triggers CLI prompts for credentials if file is not saved
    expect(mockedCreateInterface().question).toBeCalledTimes(3);
  });

  test('triggers CLI input if credentials file has invalid values', async () => {
    // Implement mocked readline for user input
    mockedCreateInterface.mockReturnValue({
      question: jest.fn().mockImplementation((): Promise<string> => Promise.resolve('test')),
      close: jest.fn(),
    });

    // Save empty credentials in the mocked file system
    __setMockFiles({ './mixpanel': emptyCredentials });

    // Call method to ensure logic completes
    await getMixpanelCredentials();

    // Triggers CLI prompts for credentials if file is not saved
    expect(mockedCreateInterface().question).toBeCalledTimes(3);
  });

  test('prompts for CLI input again if input has invalid values', async () => {
    // Implement mocked readline for user input
    mockedCreateInterface.mockReturnValue({
      question: jest.fn()
        .mockImplementationOnce((): Promise<string> => Promise.resolve(''))
        .mockImplementationOnce((): Promise<string> => Promise.resolve('mockProjectId'))
        .mockImplementationOnce((): Promise<string> => Promise.resolve(''))
        .mockImplementationOnce((): Promise<string> => Promise.resolve('mockServiceAccount'))
        .mockImplementationOnce((): Promise<string> => Promise.resolve(''))
        .mockImplementationOnce((): Promise<string> => Promise.resolve('mockServiceAccountPassword')),
      close: jest.fn(),
    });

    // Save empty credentials in the mocked file system
    __setMockFiles({ './mixpanel': emptyCredentials });

    // Call method to ensure logic completes
    await getMixpanelCredentials();

    // Triggers CLI prompts for credentials again if empty string received
    expect(mockedCreateInterface().question).toBeCalledTimes(6);
  });

  test('generates credentials object from CLI input', async () => {
    // Implement mocked readline for user input
    mockedCreateInterface.mockReturnValue({
      question: jest.fn()
        .mockImplementationOnce((): Promise<string> => Promise.resolve('mockProjectId'))
        .mockImplementationOnce((): Promise<string> => Promise.resolve('mockServiceAccount'))
        .mockImplementationOnce((): Promise<string> => Promise.resolve('mockServiceAccountPassword')),
      close: jest.fn().mockImplementation(() => undefined),
    });

    // Get credentials object
    const credentials = await getMixpanelCredentials();

    // Saves credential object to file system
    expect(fsp.writeFile).toBeCalledWith(filepath, JSON.stringify({
      PROJECT_ID: 'mockProjectId',
      SERVICE_ACCOUNT: 'mockServiceAccount',
      SERVICE_ACCOUNT_PASSWORD: 'mockServiceAccountPassword',
    }));

    // Object should be returned when promise resolves
    expect(credentials).toBeInstanceOf(Object);

    // Object should have the appropriate shape (Mixpanel Credentials)
    expect(credentials).toEqual(expect.objectContaining({
      PROJECT_ID: 'mockProjectId',
      SERVICE_ACCOUNT: 'mockServiceAccount',
      SERVICE_ACCOUNT_PASSWORD: 'mockServiceAccountPassword',
    }));
  });
});

describe('authorize method', () => {
  // Declare mock objects for credentials and event
  const mockCredentials = { PROJECT_ID: '', SERVICE_ACCOUNT: '', SERVICE_ACCOUNT_PASSWORD: '' };
  const mockEvent = {
    event: 'paidTuition',
    properties: {
      custom1: true,
      custom2: 'Jane Smith',
      time: 1670003123567,
      distinct_id: 'JaneSmith1050ee42',
      $insert_id: '8d45bbb4-c4e9-4a3a-ab22-5935243a94db',
    },
  };

  beforeEach(() => {
    // Clear mocked methods before each test
    mockedAuth.mockReset();
    mockedImportEvents.mockReset();
  });

  test('authorize should invoke sdk.auth method', () => {
    // Call the authorize method with mock credentials
    authorizeMixpanel(mockCredentials);

    expect(mockedAuth).toBeCalledTimes(1);
  });

  test('authorize returns object with exportData method', () => {
    // Store the value returned from invoking authorize
    const returnValue = authorizeMixpanel(mockCredentials);

    expect(returnValue).toMatchObject({
      exportData: expect.any(Function),
    });
  });

  test('exportData method that calls sdk.importEvents when invoked', async () => {
    // Destructure the exportData property of authorize invocation
    const { exportData } = authorizeMixpanel(mockCredentials);

    // Await the result of invoking the exportData method with an event argument
    await exportData([mockEvent]);

    expect(mockedImportEvents).toBeCalledTimes(1);
  });
});
