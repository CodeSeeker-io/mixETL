const readlineMock = jest.createMockFromModule<typeof import('node:readline/promises')>('node:readline/promises');

readlineMock.createInterface = jest.fn()
// .mockImplementation((mockUserInputs: string[]) => {
//   let counter = 0;
//   return {
//     question: jest.fn()
//       .mockImplementation((): Promise<string> => {
//         const mockInput = (mockUserInputs[counter] || '');
//         counter += 1;
//         return Promise.resolve(mockInput);
//       }),
//     close: jest.fn().mockImplementation(() => undefined),
//   };
// });

export default readlineMock;
