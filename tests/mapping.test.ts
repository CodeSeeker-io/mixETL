/* eslint-disable @typescript-eslint/naming-convention */
import { createInterface } from 'readline/promises';
import { join } from 'path';
import * as fsp from 'fs/promises';
import * as fspMockModule from '../__mocks__/fs/promises';
import { authorizeMixpanel, createMap, getSpreadsheet } from '../src/digest/mapping';

// Mock dependencies
jest.mock('readline/promises');
jest.mock('fs/promises');

// Declare mock types
type FSPMockType = typeof fspMockModule & typeof fsp;

// Declare label for mocked readline interface constructor
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

describe('create mapping from CLI input', () => {
  const headerRow: Set<string> = new Set([
    'eventName', 'hasDeclaredMajor', 'major', 'studentName', 'eventId',
  ]);

  beforeEach(() => {
    // Clear mocked methods before each test
    mockedCreateInterface.mockReset();
  });

  test('should only allow strings from input set to be used for CLI', async () => {
    // Implement mocked readline for user input
    mockedCreateInterface.mockReturnValue({
      question: jest.fn()
        .mockImplementationOnce((): Promise<string> => Promise.resolve('fakeName'))
        .mockImplementationOnce((): Promise<string> => Promise.resolve('eventName'))
        .mockImplementation((): Promise<string> => Promise.resolve('test')),
      close: jest.fn().mockImplementation(() => undefined),
    });

    // Await mapping object, created with above mock input
    const map = await createMap(headerRow);

    // First user input should be ignored, and user reprompted with question
    expect(Object.keys(map)).not.toContain('fakeName');

    // Acceptable user input should be used for output object
    expect(map.eventName).toBe('eventName');
  });

  test('should include time column name if user indicates there is one', async () => {
    // Implement mocked readline for user input
    mockedCreateInterface.mockReturnValue({
      question: jest.fn()
        .mockImplementationOnce((): Promise<string> => Promise.resolve('eventName'))
        .mockImplementationOnce((): Promise<string> => Promise.resolve('eventId'))
        .mockImplementationOnce((): Promise<string> => Promise.resolve('y'))
        .mockImplementationOnce((): Promise<string> => Promise.resolve('timeColumn')),
      close: jest.fn().mockImplementation(() => undefined),
    });

    // Await mapping object, created with above mock input
    const mapWithTime = await createMap(new Set(['timeColumn', 'eventName', 'eventId']));

    // Time column string should be included on the output object
    expect(mapWithTime.time).toBe('timeColumn');
  });

  test('should include empty string for time key when there is not a time column', async () => {
    // Implement mocked readline for user input
    mockedCreateInterface.mockReturnValue({
      question: jest.fn()
        .mockImplementationOnce((): Promise<string> => Promise.resolve('eventName'))
        .mockImplementationOnce((): Promise<string> => Promise.resolve('eventId'))
        .mockImplementationOnce((): Promise<string> => Promise.resolve('n')),
      close: jest.fn().mockImplementation(() => undefined),
    });

    // Await mapping object, created with above mock input
    const map = await createMap(headerRow);

    // Time key on the outout object should be an empty string
    expect(map.time).toBe('');
  });

  test('should include custom properties with user provided name when provided', async () => {
    // Await mapping object, created with above mock input
    const map = await createMap(headerRow);

    // Implement mocked readline for user input
    mockedCreateInterface.mockReturnValue({
      question: jest.fn()
        .mockImplementationOnce((): Promise<string> => Promise.resolve('eventName'))
        .mockImplementationOnce((): Promise<string> => Promise.resolve('eventId'))
        .mockImplementationOnce((): Promise<string> => Promise.resolve('n'))
        .mockImplementationOnce((): Promise<string> => Promise.resolve('y'))
        .mockImplementationOnce((): Promise<string> => Promise.resolve('customProp1'))
        .mockImplementationOnce((): Promise<string> => Promise.resolve('y'))
        .mockImplementationOnce((): Promise<string> => Promise.resolve('customProp2')),
      close: jest.fn().mockImplementation(() => undefined),
    });

    // Custom key includes the appropriate number of user provided key value pairs
    expect(map.custom).toHaveLength(2);

    // Custom key value pair match the user provided key names
    expect(map.custom).toEqual(expect.objectContaining({
      customProp1: 'hasDeclaredMajor',
      customProp2: 'major',
    }));
  });

  test('should include all user input', async () => {
    // Implement mocked readline for user input
    mockedCreateInterface.mockReturnValue({
      question: jest.fn()
        .mockImplementationOnce((): Promise<string> => Promise.resolve('eventName'))
        .mockImplementationOnce((): Promise<string> => Promise.resolve('eventId'))
        .mockImplementationOnce((): Promise<string> => Promise.resolve('n'))
        .mockImplementationOnce((): Promise<string> => Promise.resolve('y'))
        .mockImplementationOnce((): Promise<string> => Promise.resolve('customProp1'))
        .mockImplementationOnce((): Promise<string> => Promise.resolve('n'))
        .mockImplementationOnce((): Promise<string> => Promise.resolve('y'))
        .mockImplementationOnce((): Promise<string> => Promise.resolve('customProp2')),
      close: jest.fn().mockImplementation(() => undefined),
    });

    // Await mapping object, created with above mock input
    const map = await createMap(headerRow);

    // Mapping object has the appropriate shape and includes expected properties
    expect(map).toEqual(expect.objectContaining({
      distinct_id: 'eventId',
      eventName: 'eventName',
      time: '',
      custom: {
        customProp1: 'hasDeclaredMajor',
        customProp2: 'studentName',
      },
    }));
  });
});
