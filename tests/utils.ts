/**
 * Test if a uuid is a non-NIL v4 UUID:
 * @example
 * isValidUUID('1050ee42-a796-41c8-9087-9fdd08475410') // => true
 * @param  {string} s UUID to be tested
 * @returns {boolean}
 */
export const isValidUUID = (s: string): boolean => {
  // Check for appropriate argument type
  if (typeof s !== 'string') return false;
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
export const isValidTimestamp = (s: string): boolean => {
  // Check for appropriate agrument type
  if (typeof s !== 'string') return false;
  // Test to see if timestamp from input number is greater than ECMAScript epoch
  return (new Date(s)).getTime() > 0;
};
