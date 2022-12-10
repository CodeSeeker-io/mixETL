const readlineMock = jest.createMockFromModule<typeof import('node:readline/promises')>('node:readline/promises');

readlineMock.createInterface = jest.fn().mockReturnValue({
  question: jest.fn().mockImplementationOnce((): Promise<string> => Promise.resolve('resolved string')),
  close: jest.fn().mockImplementation(() => undefined),
});

const mockInterface = readlineMock.createInterface as jest.Mock;
const rl = mockInterface();

test('implementation created by jest.createMockFromModule', () => {
  expect(jest.isMockFunction(rl.question)).toBe(true);
  expect(rl.question).resolves.toBe('resolved string');
});
