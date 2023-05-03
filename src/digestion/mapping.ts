import * as readline from 'readline/promises';
import { stdin, stdout } from 'node:process';
import { sheets_v4 } from 'googleapis';

export type MixpanelCredentials = {
  PROJECT_ID: string;
  SERVICE_ACCOUNT: string;
  SERVICE_ACCOUNT_PASSWORD: string;
};

export type MappingType = {
  distinct_id: string;
  eventName: string;
  time: string;
  custom: { [key: string]: string };
};

/* Gets user's Google Spreadsheet credentials for a specific spreadsheet */
const getSpreadsheet = async (): Promise<sheets_v4.Params$Resource$Spreadsheets$Values$Get> => {
  // Define new object to store user responses from CLI
  const input: { [key: string]: string } = {};

  // Store a reference to new createInterface instance
  const rl = readline.createInterface(stdin, stdout);

  // Define the questions to be presented to the user
  const questions = {
    spreadsheetId: 'What is your spreadsheet id ',
    range: 'What is your spreadsheet name? ',
  } as sheets_v4.Params$Resource$Spreadsheets$Values$Get;

  // Store the keys for the questions to be asked (matches params from sheets_v4)
  const keys = Object.keys(questions);

  // Iterate through the questions, use for loop to await each response
  for (let i = 0; i < keys.length; i += 1) {
    // Store a reference to the current key
    const key = keys[i];

    // Await user response and update input object at associated key
    // eslint-disable-next-line no-await-in-loop
    input[key] = await rl.question(
      `${questions[key as keyof typeof questions]} \t`,
    );
  }

  // Close the readline interface
  rl.close();

  // Return the input as the type of questions obejct (same type as sheets.v4 params)
  return input as typeof questions;
};

/** Maps user's specified source columns to a resolver object (a map) */
const createMap = async (columns: Set<string>): Promise<MappingType> => {
  // Define new object to store user responses from CLI
  const input: { [key: string]: string } = {};

  // Define an object to represent the user's "custom properties", as defined by mixpanel docs
  const custom: { [key: string]: string } = {};

  let map = {} as MappingType;

  // Store a reference to new createInterface instance
  const rl = readline.createInterface(stdin, stdout);

  // Decalre variable to store unvalidated responses
  let unsafeResponse;

  // Define function to validate CLI inputs
  const validate = async (r: string, k: string) => {
    // Define a variable to store the number of user attempts at a valid response
    let retries = 3;
    // Store a reference to the initial response argument
    let response = r;

    while (!columns.has(response) && retries > 0) {
      // Repromt user for a valid response
      // eslint-disable-next-line no-await-in-loop
      response = await rl.question(
        `Spreadsheet does not contain ${response}. Please re-enter\t`,
      );

      // Decrement the variable representing allow attempts by 1
      retries -= 1;
    }

    // If the response is valid (contained in column headers)
    if (columns.has(response)) {
      // Add the value to the input object at the appropriate key
      input[k] = response;

      // Delete the column from the Set of column headers (re-use not allowed)
      columns.delete(response);
    }

    // If a valid response is not entered after 3 attemps, throw error
    if (retries === 0) {
      throw new Error('You have not entered valid responses.\nPlease review your source data and try running the script again.');
    }
  };

  // Function for validating y/n that takes in one string, response
  const validateYN = async (r: string) => {
    // Define a variable to store the number of user attempts at a valid response
    let retries = 3;
    // Store a reference to the initial response argument
    let response = r;

    // Define valid Y/N response strings
    const validResponses = new Set(['y', 'yes', 'n', 'no']);

    // While the the user response is invalid, and retires are left
    while (!validResponses.has(response.toLowerCase()) && retries > 0) {
      // Repromt the use for a response
      // eslint-disable-next-line no-await-in-loop
      response = await rl.question('Please answer y/n \t');

      // Decrement the variable representing allow attempts by 1
      retries -= 1;
    }

    // Ensure response is lowercase
    response = response.toLowerCase();

    // If a valid response is not entered after 3 attemps, throw error
    if (retries === 0 && validResponses.has(response)) {
      throw new Error('You have not entered valid responses. \nValid responses to questions ending with `Y/N` are `yes` or `no`.\nIf you would like to continue, please try running the script again.');
    }

    // Return a Boolean represeting the Y/N value (false for no)
    return response === 'y' || response === 'yes';
  };

  // Prompt user for the event column name
  unsafeResponse = await rl.question(
    'What is the name of your Mixpanel `eventName` column? \t',
  );

  // Await validation of the response, will repromt if response is invalid
  await validate(unsafeResponse, 'eventName');

  // Prompt user for the required destination fields, start with distinct_id
  unsafeResponse = await rl.question(
    'What is the name of your Mixpanel `distinct_id` column? \t',
  );

  // Await validation of the response, will repromt if response is invalid
  await validate(unsafeResponse, 'distinct_id');

  // Prompt user for custom time column
  unsafeResponse = await rl.question(
    'Do you have a custom time column? y/n \t',
  );

  const includeTime = await validateYN(unsafeResponse);

  // If the user has a custom timestamp column
  if (includeTime) {
    // Promp user for the name of time column
    unsafeResponse = await rl.question('What is the name of your time column?');

    // Await validation of response
    await validate(unsafeResponse, 'time');
  } else {
    // Otherwise, add a time key to the input object with empty string as the value
    input.time = '';
  }

  // Store an array of the remaining column headers
  const columnVals = Array.from(columns.values());

  // Iterate over the remaining column headers, use for loop to await response
  for (let j = 0; j < columnVals.length; j += 1) {
    // Store reference to the current column
    const column = columnVals[j];

    // Store the unsafe response from CLI
    // eslint-disable-next-line no-await-in-loop
    unsafeResponse = await rl.question(
      `Would you like to include ${column}? y/n \t`,
    );

    // Await the validation the the response
    // eslint-disable-next-line no-await-in-loop
    const includeColumn = await validateYN(unsafeResponse);

    // If the user would like to include the current column,
    if (includeColumn) {
      // Prompt the user for the property name at the destination
      // eslint-disable-next-line no-await-in-loop
      const customKey = await rl.question(
        'What would you like to call this property at the destination?\t',
      );

      // Add the custom property to the custom obejct, column header is the value
      custom[customKey] = column;
    }
  }

  // Close the readline interface
  rl.close();

  // Return an obejct with the required properties, and the custom properties
  map = { ...input, custom } as MappingType;
  return map;
};

export {
  createMap,
  getSpreadsheet,
};
