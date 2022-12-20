const readlineMock = jest.createMockFromModule<typeof import('node:readline/promises')>('node:readline/promises');

readlineMock.createInterface = jest.fn();

const mockInterface = readlineMock.createInterface as jest.Mock;
mockInterface.mockReturnValue({
  question: jest.fn().mockImplementationOnce((): Promise<string> => Promise.resolve('resolved string')),
  close: jest.fn().mockImplementation(() => undefined),
});
const rl = mockInterface();

test('implementation created by jest.createMockFromModule', async () => {
  expect(jest.isMockFunction(rl.question)).toBe(true);
  expect(jest.isMockFunction(rl.close)).toBe(true);
  await expect(rl.question()).resolves.toBe('resolved string');
  expect(rl.close()).toBe(undefined);
});
