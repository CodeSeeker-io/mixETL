import * as fs from 'node:fs/promises';

let mockFiles = Object.create(null);

jest.mock('node:fs/promises', () => ({
  writeFile: jest.fn().mockImplementation(
    (filepath: string, data: string) => {
      mockFiles[filepath] = data;
      // eslint-disable-next-line no-underscore-dangle
      return Promise.resolve();
    }
  ),
  readFile: jest.fn().mockImplementation((filepath: string) => Promise.resolve(mockFiles[filepath] || '')),
  __setMockFiles: jest.fn().mockImplementation((newMockFiles: { [key:string]: string }) => {
    const files = Object.create(null);
    Object.keys(newMockFiles).forEach((filepath) => {
      files[filepath] = newMockFiles[filepath];
    });
    mockFiles = files;
  }),
}));

type FSMockType = typeof import('node:fs/promises') & { __setMockFiles: jest.Mock };

const MOCK_FILE_INFO = {
  '/path/to/file1.js': 'console.log("file1 contents");',
  '/path/to/file2.txt': 'file2 contents',
};

beforeAll(async () => {
  // Set up some mocked out file info before each test
  mockFiles = Object.create(null);
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { __setMockFiles } = await import('node:fs/promises') as Partial<FSMockType>;
  __setMockFiles(MOCK_FILE_INFO);
});

test('implementation created by jest.createMockFromModule', async () => {
  expect(jest.isMockFunction(fs.readFile)).toBe(true);
  expect(jest.isMockFunction(fs.writeFile)).toBe(true);
  await expect(fs.readFile('/path/to/fakeFile.js')).resolves.toBe('');
  await expect(fs.readFile('/path/to/file1.js')).resolves.toBe('console.log("file1 contents");');
  await expect(fs.writeFile('/path/to/file1.js', 'overwritten content')).resolves.not.toThrow();
  await expect(fs.readFile('/path/to/file1.js')).resolves.toBe('overwritten content');
});
