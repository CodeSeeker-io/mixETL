import * as readline from 'node:readline/promises';
import { createMap, getInput } from '../import/mapping.js';

// jest.mock('node:readline/promises', () => ({
//   createInterface: jest.fn(),
// }));

jest.mock('node:readline/promises');

// jest.mock('node:readline/promises', () => ({
//   createInterface: jest.fn().mockReturnValue({
//     question: jest.fn()
//       .mockImplementationOnce((_questionText: string): Promise<any> => Promise.resolve('eventName'))
//       .mockImplementationOnce((_questionText: string): Promise<any> => Promise.resolve('distinct_id'))
//       .mockImplementationOnce((_questionText: string): Promise<any> => Promise.resolve('n'))
//       .mockImplementationOnce((_questionText: string): Promise<any> => Promise.resolve('eventName')),
//     close: jest.fn().mockImplementationOnce(() => undefined),
//   }),
// }));

// const mockReadline = readline as jest.Mocked<typeof readline>;
const mockedCreateInterface = readline.createInterface as jest.Mock;

describe('mapping getInput', () => {
  beforeEach(() => {
    // Clear mocked methods before each test
    // mockedCreateInterface.mockReset();
  });

  test('includes all input from readline in the summary array', () => {
    // mockedCreateInterface.mockReturnValue({
    //   question: jest.fn()
    //     .mockImplementationOnce((): Promise<string> => Promise.resolve('eventName'))
    //     .mockImplementationOnce((): Promise<string> => Promise.resolve('distinct_id'))
    //     .mockImplementationOnce((): Promise<string> => Promise.resolve('n'))
    //     .mockImplementationOnce((): Promise<string> => Promise.resolve('eventName')),
    //   close: jest.fn().mockImplementationOnce(() => undefined),
    mockedCreateInterface.mockImplementation(() => {
      let counter = 0;
      return {
        question: jest.fn()
          .mockImplementation((): Promise<string> => {
            // const mockInput = (mockUserInputs[counter] || '');
            counter += 1;
            return Promise.resolve(`mockInput ${counter}`);
          }),
        close: jest.fn().mockImplementation(() => undefined),
      };
    });
    const input = getInput();
    expect(input).resolves.toHaveLength(4);
    // expect(input).resolves.toBe(['eventName', 'distinct_id', 'n', 'eventName']);
  });
});
