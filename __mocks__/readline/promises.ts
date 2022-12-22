const readlineMock = jest.createMockFromModule<typeof import('readline/promises')>('readline/promises');

export const createInterface = jest.fn();

export default readlineMock;
