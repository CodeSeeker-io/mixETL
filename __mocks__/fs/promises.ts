// Declare type for mocked fs module, needed to add properties to mocked module
type FSMockType = typeof import('fs/promises') & { __setMockFiles: jest.Mock };

// Mock the entire promises object from fs module
const fsp = jest.createMockFromModule<FSMockType>('fs/promises');

// Declare mockFiles to act as file system storage, inherit from null to avoid prototype properties
let mockFiles = Object.create(null);

// Define method for saving a mocked file system
const __setMockFiles = ((newMockFiles: { [key:string]: string }): void => {
  // Reassign mocked file system storage, inherit from null to avoid prototype properties
  mockFiles = Object.create(null);

  // Iterate through input object keys
  Object.keys(newMockFiles).forEach((filepath) => {
    // Save data for specified key from input object to mocked file system storage
    mockFiles[filepath] = newMockFiles[filepath];
  });
}) as jest.Mock;

// Mock readFile logic to read values from mocked file system
const readFile = jest.fn().mockImplementation((filepath: string) => Promise.resolve(mockFiles[filepath] || ''));

// Mock writeFile logic to write values to mocked file system
const writeFile = jest.fn().mockImplementation((filepath: string, data: string) => {
  mockFiles[filepath] = data;
  return Promise.resolve();
});

export { __setMockFiles, readFile, writeFile };
// export default fsp;
