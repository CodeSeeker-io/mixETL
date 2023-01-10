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

// input: Set of strings ['Company', 'Position', 'Date Applied']
const createMap = async (columns: Set<string>): Promise<MappingType> => {
  const input: { [key: string]: string } = {};
  const map = {} as MappingType;
  const custom: Array<{ [key: string]: string }> = [];
  const rl = readline.createInterface(stdin, stdout);
  const questions = {
    distinct_id: "What is the name of your Mixpanel 'distinct_id' column?",
    eventName: 'What is the name of your event column?',
    timestamp: 'Do you have a custom time column? y/n ',
    custom: [],
    // 'custom' will be an array of objects (key/value pairs of strings)
    // such as:
    // custom: [
    //     { customProp1: 'hasDeclaredMajor' },
    //     { customProp2: 'studentName' },
    //   ],
  } as MappingType;

  const keys = Object.keys(questions);
  // const custom = Array<{ [key: string]: string }>;
  // Loop through the 3 required properties
  for (let i = 0; i < keys.length - 1; i += 1) {
    const key = keys[i];
    // eslint-disable-next-line no-await-in-loop
    input[key] = await rl.question(
      `${questions[key as keyof typeof questions]} \t`
      // If response to timestamp question is NO, then include an empty string as the val for the
      );
    }
    if (input.timestamp === 'y') {
      input.timestamp = await rl.question(
        'What is the name of your time column?'
      );
    } else if (input.timestamp === 'n') {
      input.timestamp = '';
    } else { 
    //refactor to reprompt question if answer is 'y' below
      await rl.question(
        'Please enter answer y/n '
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
      if (customQuestion === 'y') {
        const customInput = await rl.question(
          'What would you like to call this property at the destination?'
        );
        customObj[customInput] = column ;
        columns.delete(column);
      } else if (customQuestion !== 'n' && customQuestion !== 'y'){
        //refactor to reprompt question if answer is 'y' below
        await rl.question( 
          'Please answer y/n '
        )
      }
      // YES or NO
      // If YES, delete the value in the set and ask 'What would you like to call this property
      //  at the destination?'
      // add another custom prop and assign its val to its associated name
      const mappedOutput: Record<string, unknown> = { ...input, custom };
      // console.log('column:', columns);
      // console.log('this is input', input);
      console.log('this is customObj', customObj)
      if (Object.keys(customObj).length > 0) custom.push(customObj);
      console.log('this is mappedOutput', mappedOutput);
      console.log('this is map', map);
    }
    rl.close();
  })();

  // Return the mapped object
  // return mappedOutput;

  // Need to combine contents of input object and contents of custom object
  // return {...input, ...custom };

};

const set: Set<string> = new Set();
set.add('Company');
set.add('Position');
set.add('Date Applied');
console.log('this is the set', set);

createMap(set);

export { authorizeMixpanel, createMap, getSpreadsheet };
