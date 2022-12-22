const readlineMock = jest.createMockFromModule<typeof import('readline/promises')>('readline/promises');

const createInterface = jest.fn();

export { createInterface };
