import * as readline from 'readline/promises';
import { stdin, stdout } from 'node:process';
import { sheets_v4 } from 'googleapis';
import { readFile, writeFile } from 'fs/promises';
import * as path from 'path';

const { readFile, writeFile } = promises;
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

const authorizeMixpanel = async (): Promise<MixpanelCredentials> => {
  /* Reads previously authorized Mixpanel credentials from the saved
  .mixpanel file */
  try {
    const creds = await readFile(MIX_CRED);
    const credentials = JSON.parse(creds.toString());
    const {
      PROJECT_ID,
      SERVICE_ACCOUNT,
      SERVICE_ACCOUNT_PASSWORD,
    } = credentials;
    if (PROJECT_ID
      && SERVICE_ACCOUNT
      && SERVICE_ACCOUNT_PASSWORD) {
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
const getSpreadsheet = async ():
Promise<sheets_v4.Params$Resource$Spreadsheets$Values$Get> => {
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

/* loop through header row and get input from user about what to put where
digest data and export it to mixpanel  */


const createMap = (columns: Set<string>) => {};

// questions = {
//   eventName: 'What is the name of your event column?',
//   distinct_id: 'What is the name of your Mixpanel \'distinct_id\' column?',
// } as MappingType;

export { authorizeMixpanel, createMap, getSpreadsheet };
