import { createInterface } from 'node:readline/promises';
import { authorizeMixpanel, createMap, getSpreadsheet } from '../import/mapping';

jest.mock('node:readline/promises');

const mockedCreateInterface = createInterface as jest.Mock;

describe('generate spreadsheet params object from CLI input', () => {
  beforeEach(() => {
    // Clear mocked methods before each test
    mockedCreateInterface.mockReset();
  });

  test('includes all input from readline in the result object values', async () => {
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
