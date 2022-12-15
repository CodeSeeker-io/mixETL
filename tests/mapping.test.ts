import * as readline from 'node:readline/promises';
import { createMap, getInput } from '../import/mapping.js';

jest.mock('node:readline/promises');

const mockedCreateInterface = readline.createInterface as jest.Mock;

describe('generate object from CLI input', () => {
  beforeEach(() => {
    // Clear mocked methods before each test
    mockedCreateInterface.mockReset();
  });

  test('includes all input from readline in the result object values', () => {
    mockedCreateInterface.mockImplementation(() => {
      let counter = 0;
      return {
        question: jest.fn().mockImplementation((): Promise<string> => {
          counter += 1;
          return Promise.resolve(`mockInput ${counter}`);
        }),
        close: jest.fn().mockImplementation(() => undefined),
      };
    });
    const questions: string[] = [
      'What is the name of your event column?',
      'What is the name of your distinct_id column?',
      'Do you have a time column?',
      'What is the name of your event column?',
    ]
    const input = getInput(questions);
    expect(input).resolves.toHaveLength(4);
    expect(input).resolves.toEqual(expect.objectContaining({
      spreadsheetId: expect.any(String),
      range: expect.any(String),
    }));
    // expect(input).resolves.toBe(['eventName', 'distinct_id', 'n', 'eventName']);
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
