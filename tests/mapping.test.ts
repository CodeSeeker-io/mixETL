import { createInterface } from 'readline/promises';
import { createMap, getSpreadsheet } from '../src/digestion/mapping';

// Mock dependencies
jest.mock('readline/promises');
jest.mock('fs/promises');

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

describe('create mapping from CLI input', () => {
  const headerRow = [
    'eventName', 'hasDeclaredMajor', 'major', 'studentName', 'eventId',
  ];

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
        .mockImplementationOnce((): Promise<string> => Promise.resolve('eventId'))
        .mockImplementation((): Promise<string> => Promise.resolve('n')),
      close: jest.fn().mockImplementation(() => undefined),
    });

    // Await mapping object, created with above mock input
    const map = await createMap(new Set(headerRow));

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
        .mockImplementationOnce((): Promise<string> => Promise.resolve('n'))
        .mockImplementation((): Promise<string> => Promise.resolve('n')),
      close: jest.fn().mockImplementation(() => undefined),
    });

    // Await mapping object, created with above mock input
    const map = await createMap(new Set(headerRow));

    // Time key on the outout object should be an empty string
    expect(map.time).toBe('');
  });

  test('should include custom properties with user provided name when provided', async () => {
    // Implement mocked readline for user input
    mockedCreateInterface.mockReturnValue({
      question: jest.fn()
        .mockImplementationOnce((): Promise<string> => Promise.resolve('eventName'))
        .mockImplementationOnce((): Promise<string> => Promise.resolve('eventId'))
        .mockImplementationOnce((): Promise<string> => Promise.resolve('n'))
        .mockImplementationOnce((): Promise<string> => Promise.resolve('y'))
        .mockImplementationOnce((): Promise<string> => Promise.resolve('customProp1'))
        .mockImplementationOnce((): Promise<string> => Promise.resolve('y'))
        .mockImplementationOnce((): Promise<string> => Promise.resolve('customProp2'))
        .mockImplementation((): Promise<string> => Promise.resolve('n')),
      close: jest.fn().mockImplementation(() => undefined),
    });

    // Await mapping object, created with above mock input
    const map = await createMap(new Set(headerRow));

    // Custom key includes the appropriate number of user provided key value pairs
    expect(Object.keys(map.custom)).toHaveLength(2);

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
    const map = await createMap(new Set(headerRow));

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
