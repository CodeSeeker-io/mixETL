import * as readline from 'readline/promises';
import { stdin, stdout } from 'node:process';
import { sheets_v4 } from 'googleapis';
import { readFile, writeFile } from 'fs/promises';
import * as path from 'path';

/* The file .mixpanel stores the user's Mixpanel credentials, and is
created automatically when authorizeMixpanel() completes for the first
time. If updating user's Mixpanel credentials, simply delete the .mixpanel
file and run authorizeMixpanel() again.
*/

const MIX_CRED = path.join(process.cwd(), '.mixpanel');
type MixpanelCredentials = {
  PROJECT_ID: string;
  SERVICE_ACCOUNT: string;
  SERVICE_ACCOUNT_PASSWORD: string;
};

type MappingType = {
  distinct_id: string;
  eventName: string;
  $insert_id: string;
  timestamp: string;
  custom: Array<{ [key: string]: string }>;
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
      spreadsheetId: 'What is your spreadsheet id',
      range: 'What is your spreadsheet name?',
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

// input: Set of strings 
const createMap = async (columns: Set<string>): Promise<MappingType> => {
  const input: { [key: string]: string } = {};
  // const map = {} as MappingType;
  const map = {} as MappingType;
  const custom: Array<{ [key: string]: string }> = [];
  const rl = readline.createInterface(stdin, stdout);
  const questions = {
    distinct_id: "What is the name of your Mixpanel 'distinct_id' column?",
    eventName: 'What is the name of your event column?',
    timestamp: 'Do you have a custom time column? y/n ',
    custom: [],
  } as MappingType;

  const keys = Object.keys(questions);
  // Loop through the required properties
  for (let i = 0; i < keys.length - 1; i += 1) {
    const key = keys[i];
    // eslint-disable-next-line no-await-in-loop
    input[key] = await rl.question(
      `${questions[key as keyof typeof questions]} \t`
      );
    }
    if (input.timestamp === 'y') {
      input.timestamp = await rl.question(
        'What is the name of your time column?'
        );
      } else if (input.timestamp === 'n') {
      // If NO, then include an empty string
      input.timestamp = '';
    } else { 
    // if user enters anything other than yes or no
      await rl.question(
        'Please enter answer y/n'
      )
    }

  // Then loop through the custom values that remain in the set
  (async () => {
    for (const column of columns.values()) {
      const customObj: { [key: string]: string } = {};
      // Prompt readline to ask if user wants to include this column
      const customQuestion = await rl.question(
        'Would you like to include ' + `${column}` + '? y/n '
      );
      // If YES
      if (customQuestion === 'y') {
        const customInput = await rl.question(
          'What would you like to call this property at the destination?'
        );
        // add another custom prop and assign its val to its associated name
        customObj[customInput] = column
        // delete the value in the set 
        columns.delete(column);
        // if user enters anything other than yes or no
      } else if (customQuestion !== 'n' && customQuestion !== 'y'){
        await rl.question( 
          'Please answer y/n '
        )
      }
      const mappedOutput: Record<string, unknown> = { ...input, custom };
      if (Object.keys(customObj).length > 0) custom.push(customObj);
      
      // copy enumerable properties of mappedOutput to the map object in the outer scope
      Object.assign(map, mappedOutput)
      console.log(mappedOutput)
    }
    rl.close();
  })();
  // Return the mapped object 
  return map;
};

const set: Set<string> = new Set();
set.add('Company');
set.add('Position');
set.add('Date Applied');

createMap(set);

export { authorizeMixpanel, createMap, getSpreadsheet };
