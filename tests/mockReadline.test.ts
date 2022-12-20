// Create mock of the readline module using jest
const readlineMock = jest.createMockFromModule<typeof import('node:readline/promises')>('node:readline/promises');

// Defined createInterface method as jest function, should match logic in __mocks__/readline.ts
readlineMock.createInterface = jest.fn();

// Save mocked method, needed for TS typing
const mockInterface = readlineMock.createInterface as jest.Mock;

// Define the mock implementation logic for createInterface method
mockInterface.mockReturnValue({
  question: jest.fn().mockImplementationOnce((): Promise<string> => Promise.resolve('resolved string')),
  close: jest.fn().mockImplementation(() => undefined),
});

// Save instance of mocked readline interface
const rl = mockInterface();

test('implementation created by jest.createMockFromModule', async () => {
  // Mocked readline interface should have a mocked question method
  expect(jest.isMockFunction(rl.question)).toBe(true);

  // Mocked readline interface should have a mocked close method
  expect(jest.isMockFunction(rl.close)).toBe(true);

  // Mocked readline question method should return mocked input
  await expect(rl.question()).resolves.toBe('resolved string');

  // Mocked readline close method should return undefined from mocked implementation definition
  expect(rl.close()).toBe(undefined);
});
