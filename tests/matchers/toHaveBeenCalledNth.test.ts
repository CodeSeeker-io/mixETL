import { expect, test } from '@jest/globals';
import { spyInvocationOrder } from './toHaveBeenCalledNth';

const mock = jest.fn();
const one = jest.fn();
const two = jest.fn();

beforeEach(() => {
  spyInvocationOrder([mock, one, two]);
});

test('to have been called Nth', () => {
  one();
  two();
  mock();

  expect(mock).toHaveBeenCalledNth(3);
});

test('to NOT have been called Nth', () => {
  one();
  two();
  mock();

  expect(mock).not.toHaveBeenCalledNth(2);
});

test('asymmetric Nth calls', () => {
  one();
  two();
  mock();

  expect({ apples: mock, bananas: mock }).toEqual({
    apples: expect.toHaveBeenCalledNth(3),
    bananas: expect.not.toHaveBeenCalledNth(2),
  });
});

test('arguments are passed to the mock', () => {
  const expectedArguments = [1, 2, 3];
  mock(expectedArguments);
  expect(mock).toBeCalledWith(expectedArguments);
});
