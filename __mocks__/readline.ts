const readlineMock = jest.createMockFromModule<typeof import('node:readline/promises')>('node:readline/promises');

readlineMock.createInterface = jest.fn();

export default readlineMock;
