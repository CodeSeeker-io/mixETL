/* eslint-disable @typescript-eslint/naming-convention */
import * as fs from 'fs/promises';

// Declare type for mocked fs module, needed to add properties to mocked module
type FSMockType = typeof import('fs/promises') & { __setMockFiles: jest.Mock };

// Declare mockFiles to act as file system storage, inherit from null to avoid prototype properties
let mockFiles = Object.create(null);

// Define the mock implementation logic for fs, should match logic in __mocks__/fs.ts
jest.mock('fs/promises', () => ({
  // Define method for saving a mocked file system
  __setMockFiles: jest.fn().mockImplementation((newMockFiles: { [key:string]: string }) => {
    // Reassign mocked file system storage, inherit from null to avoid prototype properties
    mockFiles = Object.create(null);

    // Iterate through input object keys
    Object.keys(newMockFiles).forEach((filepath) => {
      // Save data for specified key from input object to mocked file system storage
      mockFiles[filepath] = newMockFiles[filepath];
    })
  }),

  // Mock readFile logic to read values from mocked file system
  readFile: jest.fn().mockImplementation((filepath: string) => Promise.resolve(mockFiles[filepath] || '')),

  // Mock writeFile logic to write values to mocked file system
  writeFile: jest.fn().mockImplementation((filepath: string, data: string) => {
    mockFiles[filepath] = data;
    return Promise.resolve();
  }),
}));

// Declare "files" to save to mocked file system storage
const MOCK_FILE_INFO = {
  '/path/to/file1.js': 'console.log("file1 contents");',
  '/path/to/file2.txt': 'file2 contents',
};

beforeAll(async () => {
  // Set up some mocked out file info before each test
  mockFiles = Object.create(null);

  // Import __setMockFiles files from mocked fs module
  const { __setMockFiles } = await import('fs/promises') as Partial<FSMockType>;

  // "Save" MOCK_FILE_INFO to mocked file storage
  __setMockFiles(MOCK_FILE_INFO);
});

test('implementation created by jest.createMockFromModule', async () => {
  // readFile should be a jest mock function
  expect(jest.isMockFunction(fs.readFile)).toBe(true);

  // writeFile should be a jest mock function
  expect(jest.isMockFunction(fs.writeFile)).toBe(true);

  // reading from a non-existant file path in mocked file system should return empty string
  await expect(fs.readFile('/path/to/fakeFile.js')).resolves.toBe('');

  // reading from specified path in mocked file system should return data
  await expect(fs.readFile('/path/to/file1.js')).resolves.toBe('console.log("file1 contents");');

  // writing to existing path in mocked file system should not throw an error
  await expect(fs.writeFile('/path/to/file1.js', 'overwritten content')).resolves.not.toThrow();

  // reading from specified path in mocked file system should return the newly saved data
  await expect(fs.readFile('/path/to/file1.js')).resolves.toBe('overwritten content');
});
