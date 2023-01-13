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
  const custom: Array<{ [key: string]: string }> = [];
  const rl = readline.createInterface(stdin, stdout);
  const questions = {
    distinct_id: 'What is the name of your Mixpanel `distinct_id` column?',
    eventName: 'What is the name of your event column?',
    timestamp: 'Do you have a custom time column? y/n',
    custom: [],
  } as MappingType;

  const keys = Object.keys(questions);
  for (let i = 0; i < keys.length - 1; i += 1) {
    const key = keys[i];
    // eslint-disable-next-line no-await-in-loop
    let res = await rl.question(
      `${questions[key as keyof typeof questions]} \t`
    );
    if (!columns.has(res)) {
      if (key === 'timestamp') {
        if (res === 'y') {
          // eslint-disable-next-line no-await-in-loop
          res = await rl.question('What is the name of your time column?\t');
        } else {
          res = '';
        }
        input[key] = res;
      } else {
        // eslint-disable-next-line no-await-in-loop
        res = await rl.question(
          'Spreadsheet does not contain ' + `${res}.` + 'Please re-enter\t'
        );
        input[key] = res;
        columns.delete(res);
      }
    } else {
      input[key] = res;
      columns.delete(res);
      console.log('this is the set', columns);
    }
  }

  (async () => {
    const columnVals = Array.from(columns.values());
    for (let j = 1; j < columnVals.length; j++) {
      const column = columnVals[j];
      console.log('these are the column vals', columnVals[j]);
      const customObj: { [key: string]: string } = {};
      // eslint-disable-next-line no-await-in-loop
      let customQuestion = await rl.question(
        'Would you like to include ' + `${column}` + '? y/n\t'
      );
      if (customQuestion === 'y') {
        // eslint-disable-next-line no-await-in-loop
        const customInput = await rl.question(
          'What would you like to call this property at the destination?\t'
        );
        customObj[customInput] = column;
        columns.delete(column);
      } else if (customQuestion !== 'n' && customQuestion !== 'y') {
        // eslint-disable-next-line no-await-in-loop
        customQuestion = await rl.question('Please answer y/n\t');
        // refactor so that if answer is 'yes', then ask what to name this prop
      }
      if (Object.keys(customObj).length > 0) custom.push(customObj);
      map = { ...input, custom } as MappingType;
      console.log(map);
    }
    rl.close();
  })();
  return map;
};

const set: Set<string> = new Set();
set.add('distinct_id');
set.add('eventName');
set.add('timestamp');
set.add('Company');
set.add('Position');
set.add('Date Applied');

createMap(set);

export { authorizeMixpanel, createMap, getSpreadsheet };
