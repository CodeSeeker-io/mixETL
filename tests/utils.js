import { readFileSync } from 'fs';
import { dirname, resolve, relative } from 'path';
import { fileURLToPath } from 'url';
export function base(root, path) {
    return relative(__dirname, relative(root, path));
}
// export const cwd = () => console.log(this);
/**
 * Import from JSON file at given filepath as if it's a module:
 * @example
 * importJSON('./relDirectory/relFilepath', '../rootDir') // => { prop1: val1, prop2: val2 }
 * @param  {string} path relative file path as a string
 * @param  {string} root relative file path to root directory as a string
 * @returns {JSONType}
 */
export var importJSON = function (path, root) {
    try {
        var __dirname_1 = dirname(fileURLToPath(import.meta.url));
        // Try to form relative path from location of the callee
        var relativePath = relative(__dirname_1, relative(root, path));
        // Try to form file path using cwd
        var filepath = resolve(__dirname_1, relativePath);
        // Return JavaScript Object stored in file
        return JSON.parse(readFileSync(filepath).toString());
    }
    catch (err) {
        return err;
    }
};
/**
 * Test if a uuid is a non-NIL v4 UUID:
 * @example
 * isValidUUID('1050ee42-a796-41c8-9087-9fdd08475410') // => true
 * @param  {string} s UUID to be tested
 * @returns {boolean}
 */
export var isValidUUID = function (s) {
    // Check for appropriate argument type
    if (typeof s !== 'string')
        return false;
    // Test input string against RegExp for non-NIL v4 UUID
    return (/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i).test(s);
};
/**
 * Test if a string is a valid timestamp post-ECMAScript epoch:
 * @example
 * isValidTimestamp('January 1, 2000') // => true
 * @param  {string} s timestamp string to be tested
 * @returns {boolean}
 */
export var isValidTimestamp = function (s) {
    // Check for appropriate agrument type
    if (typeof s !== 'string')
        return false;
    // Test to see if timestamp from input number is greater than ECMAScript epoch
    return (new Date(s)).getTime() > 0;
};
