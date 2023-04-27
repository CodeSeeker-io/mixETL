import * as readline from 'readline/promises';
import { stdin, stdout } from 'node:process';
import { randomUUID } from 'crypto';
import { sheets_v4 } from 'googleapis';
import { readFile, writeFile } from 'fs/promises';
import * as path from 'path';
import { ImportEventsBodyParam } from '@api/mixpaneldevdocs/types';

/* The file .mixpanel stores the user's Mixpanel credentials, and is
created automatically when authorizeMixpanel() completes for the first
time. If updating user's Mixpanel credentials, simply delete the .mixpanel
file and run authorizeMixpanel() again.
*/

const MIX_CRED = path.join(process.cwd(), '.mixpanel');

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

type MixpanelEventType = {
  properties: {
    [x: string]: unknown;
    time: number;
    $insert_id: string;
    distinct_id: string;
  };
  event: string;
};
/** Refactor to fix arrow function return */
const authorizeMixpanel = async (): Promise<MixpanelCredentials> => {
  /* Reads previously authorized Mixpanel credentials from the saved
  .mixpanel file */
  try {
    const creds = await readFile(MIX_CRED);
    const credentials = JSON.parse(creds.toString());
    const { PROJECT_ID, SERVICE_ACCOUNT, SERVICE_ACCOUNT_PASSWORD } =
      credentials;
    if (PROJECT_ID && SERVICE_ACCOUNT && SERVICE_ACCOUNT_PASSWORD) {
      return credentials;
    }
    /* Creates a new .mixpanel file containing user's Mixpanel credentials using
  CLI user input */
  } catch (err) {
    const input: { [key: string]: string } = {};
    const rl = readline.createInterface(stdin, stdout);
    const questions = {
      PROJECT_ID: 'What is your Mixpanel Project ID?',
      SERVICE_ACCOUNT: 'What is your Mixpanel Service Account Username?',
      SERVICE_ACCOUNT_PASSWORD:
        'What is your Mixpanel Service Account Password?',
    } as MixpanelCredentials;
    const keys = Object.keys(questions);
    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      // eslint-disable-next-line no-await-in-loop
      input[key] = await rl.question(
        `${questions[key as keyof typeof questions]} \t`
      );
    }
    rl.close();
    await writeFile(MIX_CRED, JSON.stringify(input));
    return input as typeof questions;
  }
};

/* Gets user's Google Spreadsheet credentials for a specific spreadsheet */
const getSpreadsheet =
  async (): Promise<sheets_v4.Params$Resource$Spreadsheets$Values$Get> => {
    const input: { [key: string]: string } = {};
    const rl = readline.createInterface(stdin, stdout);
    const questions = {
      spreadsheetId: 'What is your spreadsheet id ',
      range: 'What is your spreadsheet name? ',
    } as sheets_v4.Params$Resource$Spreadsheets$Values$Get;
    const keys = Object.keys(questions);
    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      // eslint-disable-next-line no-await-in-loop
      input[key] = await rl.question(
        `${questions[key as keyof typeof questions]} \t`
      );
    }
    rl.close();
    return input as typeof questions;
  };

/** Maps user's specified columns */
const createMap = async (columns: Set<string>): Promise<MappingType> => {
  const input: { [key: string]: string } = {};
  let map = {} as MappingType;
  const custom: { [key: string]: string } = {};
  const rl = readline.createInterface(stdin, stdout);
  let unsafeResponse;

  const validate = async (r: string, k: string) => {
    let retries = 3;
    let response = r;
    while (!columns.has(response) && retries > 0) {
      // eslint-disable-next-line no-await-in-loop
      response = await rl.question(
        `Spreadsheet does not contain ${response}. Please re-enter\t`
      );
      retries -= 1;
    }
    if (columns.has(response)) {
      input[k] = response;
      columns.delete(response);
      return response;
    }
    throw new Error();
  };

  // Function for validating y/n that takes in one string, response
  const validateYN = async (r: string) => {
    let retries = 3;
    let response = r;
    const validResponses = new Set(['y', 'yes', 'n', 'no']);
    while (!validResponses.has(response.toLowerCase()) && retries > 0) {
      // eslint-disable-next-line no-await-in-loop
      response = await rl.question('Please answer y/n \t');
      retries -= 1;
    }
    if (validResponses.has(response.toLowerCase())) {
      return response === 'y' || response === 'yes';
    }
    throw new Error();
  };

  // Prompt user for the required destination fields, start with distinct_id
  unsafeResponse = await rl.question(
    'What is the name of your Mixpanel `distinct_id` column? \t'
  );
  await validate(unsafeResponse, 'distinct_id');

  // Prompt user for the event column name
  unsafeResponse = await rl.question(
    'What is the name of your Mixpanel `eventName` column? \t'
  );
  await validate(unsafeResponse, 'eventName');

  // Prompt user for custom time column
  unsafeResponse = await rl.question(
    'Do you have a custom time column? y/n \t'
  );
  if (
    unsafeResponse.toLowerCase() === 'y' ||
    unsafeResponse.toLowerCase() === 'yes'
  ) {
    unsafeResponse = await rl.question('What is the name of your time column?');
    await validate(unsafeResponse, 'timestamp');
  } else {
    input.time = '';
  }

  const columnVals = Array.from(columns.values());
  for (let j = 0; j < columnVals.length; j += 1) {
    const column = columnVals[j];
    // eslint-disable-next-line no-await-in-loop
    unsafeResponse = await rl.question(
      `Would you like to include ${column}? y/n \t`
    );
    // eslint-disable-next-line no-await-in-loop
    const includeColumn = await validateYN(unsafeResponse);
    if (includeColumn) {
      // eslint-disable-next-line no-await-in-loop
      const customKey = await rl.question(
        'What would you like to call this property at the destination?\t'
      );
      custom[customKey] = column;
    }
  }
  map = { ...input, custom } as MappingType;
  rl.close();
  console.log(map);
  return map;
};

const digest = (data: string[][], map: MappingType) => {
  // Define an empty obejct to serve as a map of indexes
  const hash: { [key: string]: number } = {};

  // Store the header row for reference
  const headerRow = data[0];

  // Iterate over each col in header row, and add its index to the hash map
  headerRow.forEach((col, index) => {
    hash[col] = index;
  });

  // Define an array of events that will be returned
  const events: ImportEventsBodyParam = [];

  // Iterate over all not header rows
  for (let i = 1; i < data.length; i += 1) {
    // Copy the row reference
    const row = data[i];

    // Define the event object with the required fields
    const eventObject: MixpanelEventType = {
      event: row[hash[map.eventName]],
      properties: {
        $insert_id: randomUUID(),
        distinct_id: row[hash[map.distinct_id]],
        time: (map.time !== '' ? row[hash[map.time]] as unknown as number : Date.now()),
      },
    };

    // Add the custom properties to the event object
    Object.entries(map.custom).forEach(([prop, col]) => {
      eventObject.properties[prop] = row[hash[col]];
    });

    // Push the current event object into the events array
    events.push(eventObject);
  }

  // Return the events array
  return events;
};

// const set: Set<string> = new Set();
// set.add('distinct_id');
// set.add('eventName');
// set.add('timestamp');
// set.add('Company');
// set.add('Position');
// set.add('Date Applied');

// createMap(set);

export { authorizeMixpanel, createMap, digest, getSpreadsheet };
