import path from 'path';

type FSMockType = typeof import('node:fs/promises') & { __setMockFiles: jest.Mock };

const fs = jest.createMockFromModule<FSMockType>('node:fs/promises');

let mockFiles = Object.create(null);

// eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle
const __setMockFiles = (newMockFiles: { [key:string]: string }): void => {
  mockFiles = Object.create(null);
  Object.keys(newMockFiles).forEach((file) => {
    const dir = path.dirname(file);
    mockFiles[dir] = newMockFiles[file];
  });
};

// eslint-disable-next-line no-underscore-dangle
fs.__setMockFiles = __setMockFiles as jest.Mock;
fs.readFile = jest.fn().mockImplementation((filepath: string) => Promise.resolve(mockFiles[filepath] || ''));
fs.writeFile = (
  filepath: string,
  data: string
// eslint-disable-next-line no-underscore-dangle
) => Promise.resolve(fs.__setMockFiles({ filepath: data }));

export default fs;
