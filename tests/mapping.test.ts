// import * as readline from 'node:readline/promises';
import {createMap, getInput} from '../import/mapping';

jest.mock('node:readline/promises');

describe('generate array of strings from CLI input', () => {
  // const readlineInterfaceStub = {
  //   question: jest.fn()
  //     .mockImplementationOnce((questionText: string, cb) => cb('eventName'))
  //     .mockImplementationOnce((questionText: string, cb) => cb('studentId'))
  //     .mockImplementationOnce((questionText, cb) => cb('n'))
  //     .mockImplementationOnce((questionText, cb) => cb('y'))
  //     .mockImplementationOnce((questionText, cb) => cb('n'))
  //     .mockImplementationOnce((questionText, cb) => cb('y')),
  //   close: jest.fn().mockImplementationOnce(() => undefined),
  // };
  // const mockReadline = jest.spyOn(readline, 'createInterface').mockImplementation(() => readlineInterfaceStub as any);
});

describe('create mapping from CLI input', () => {
  console.error('hi')
  const mockData: string[][] = [
    ['eventName', 'hasDeclaredMajor', 'major', 'studentName', 'studentId'],
    ['paidTuition', 'true', 'cs', 'Jane Smith', 'JaneSmith1050ee42'],
    ['graduated', 'true', 'ps', 'Mary Doe', 'MaryDoe1060ee42'],
    ['enrolled', 'false', 'li', 'Jon Smythe', 'JonSmythe1070ee42'],
  ];
  const userInput: string[] = ['eventName', 'studentId', 'n', 'y', 'n', 'y'];
  const map = createMap(userInput);

  it('should map provided string to event key', () => {
    expect(map.event).toBe('eventName');
  });

  it('should map provided string to distinct_id key', () => {
    expect(map.distinct_id).toBe('studentName');
  });

  it('should map provided empty string to time key, if none provided', () => {
    expect(map.time).toBe('');
  });

  it('should map provided string to time key when provided', () => {
    const newInput = [...userInput.slice(0, 2), 'timeColumn', ...userInput.slice(2)];
    const timedMap = createMap(newInput);
    expect(timedMap.time).toBe('timeColumn');
  });
});
