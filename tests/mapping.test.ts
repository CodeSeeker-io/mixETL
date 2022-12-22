/* eslint-disable @typescript-eslint/naming-convention */
import { createInterface } from 'node:readline/promises';
import { join } from 'path';
import * as fsp from 'fs/promises';
import * as fspMockModule from '../__mocks__/fs/promises';
import { authorizeMixpanel, createMap, getSpreadsheet } from '../import/mapping';

// Mock dependencies
jest.mock('node:readline/promises');
jest.mock('fs/promises');

// Declare mock types
type FSPMockType = typeof fspMockModule & typeof fsp;

const mockedCreateInterface = createInterface as jest.Mock;

describe('getSpreadsheet', () => {
  beforeEach(() => {
    // Clear mocked methods before each test
    mockedCreateInterface.mockReset();
  });

  test('generates spreadsheet params object from CLI input', async () => {
    // Implement mocked readline for user input
    mockedCreateInterface.mockReturnValue({
      question: jest.fn()
        .mockImplementationOnce((): Promise<string> => Promise.resolve('mockSpreadsheetId'))
        .mockImplementationOnce((): Promise<string> => Promise.resolve('mockRange')),
      close: jest.fn().mockImplementation(() => undefined),
    });

    // Get spreadsheet params object from user input
    const inputSpreadsheet = getSpreadsheet();

    // Object should be returned when promise resolves
    await expect(inputSpreadsheet).resolves.toBeInstanceOf(Object);

    // Object should have the appropriate shape (sheets_v4.Params$Resource$Spreadsheets$Values$Get)
    await expect(inputSpreadsheet).resolves.toEqual(expect.objectContaining({
      spreadsheetId: 'mockSpreadsheetId',
      range: 'mockRange',
    }));
  });
});

describe('authorizeMixpanel', () => {
  // Store internal mock module method for updating mocked file system
  const { __setMockFiles } = fsp as FSPMockType;

  // Save the current work directory
  const filepath = join(process.cwd(), '.mixpanel');

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
    const credentials = await authorizeMixpanel();

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
    await authorizeMixpanel();

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
    await authorizeMixpanel();

    // Triggers CLI prompts for credentials if file is not saved
    expect(mockedCreateInterface().question).toBeCalledTimes(3);
  });

  xtest('prompts for CLI input again if input has invalid values', async () => {
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
    await authorizeMixpanel();

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
    const credentials = await authorizeMixpanel();

    // Saves credential object to file system
    expect(fsp.writeFile).toBeCalledWith(filepath, JSON.stringify({
      PROJECT_ID: 'mockProjectId',
      SERVICE_ACCOUNT: 'mockServiceAccount',
      SERVICE_ACCOUNT_PASSWORD: 'mockServiceAccountPassword'
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

describe('create mapping from CLI input', () => {
  // const mockData: string[][] = [
  //   ['eventName', 'hasDeclaredMajor', 'major', 'studentName', 'studentId'],
  //   ['paidTuition', 'true', 'cs', 'Jane Smith', 'JaneSmith1050ee42'],
  //   ['graduated', 'true', 'ps', 'Mary Doe', 'MaryDoe1060ee42'],
  //   ['enrolled', 'false', 'li', 'Jon Smythe', 'JonSmythe1070ee42'],
  // ];
  // const userInput: string[] = ['eventName', 'studentId', 'n', 'y', 'n', 'y'];
  // const map = createMap(userInput);

  // it('should map provided string to event key', () => {
  //   expect(map.event).toBe('eventName');
  // });

  // it('should map provided string to distinct_id key', () => {
  //   expect(map.distinct_id).toBe('studentName');
  // });

  // it('should map provided empty string to time key, if none provided', () => {
  //   expect(map.time).toBe('');
  // });

  // it('should map provided string to time key when provided', () => {
  //   const newInput = [...userInput.slice(0, 2), 'timeColumn', ...userInput.slice(2)];
  //   const timedMap = createMap(newInput);
  //   expect(timedMap.time).toBe('timeColumn');
  // });
});
