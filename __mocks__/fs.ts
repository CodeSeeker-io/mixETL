/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/naming-convention */

// Declare type for mocked fs module, needed to add properties to mocked module
type FSMockType = typeof import('node:fs/promises') & { __setMockFiles: jest.Mock };

// Mock the entire promises object from fs module
const fs = jest.createMockFromModule<FSMockType>('node:fs/promises');

// Declare mockFiles to act as file system storage, inherit from null to avoid prototype properties
let mockFiles = Object.create(null);

// Define method for saving a mocked file system
const __setMockFiles = (newMockFiles: { [key:string]: string }): void => {
  // Reassign mocked file system storage, inherit from null to avoid prototype properties
  mockFiles = Object.create(null);

  // Iterate through input object keys
  Object.keys(newMockFiles).forEach((filepath) => {
    // Save data for specified key from input object to mocked file system storage
    mockFiles[filepath] = newMockFiles[filepath];
  });
};

// Save the __setMockFiles method on the exported (mocked) module
fs.__setMockFiles = __setMockFiles as jest.Mock;

// Mock readFile logic to read values from mocked file system
fs.readFile = jest.fn().mockImplementation((filepath: string) => Promise.resolve(mockFiles[filepath] || ''));

// Mock writeFile logic to write values to mocked file system
fs.writeFile = (filepath: string, data: string) => {
  mockFiles[filepath] = data;
  return Promise.resolve();
};

export default fs;
