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

/* loop through header row and get input from user about what to put where
digest data and export it to mixpanel  */
// take in a set of
// the column header
// event anme and sinstinct id column
// do you have a custom time column?
// if yes, then ask the title of that column is
// if they response 'no', then we should include an empty string under the key on the final output object for 'time'
// we'd still expect hte final output object to have a time key but the value would just bbe an empty string

//when the user gives a response in the command line, it has to be one of the values in that set
//reprompt them if invalid response

//delete the values in the set as the user specifies them
//if they specify event is the name of the event column, check if it's the set so we knowif its a valid response,and if it is in the
//set then we delete it and add it to the mapping output object
// const createMap = (columns: Set<string>) => {
// };
const createMap = async (columns: Set<string>): Promise<MappingType> => {
  const input: { [key: string]: string } = {};
  const rl = readline.createInterface(stdin, stdout);
  const questions = {
    distinct_id: "What is the name of your Mixpanel 'distinct_id' column?",
    eventName: 'What is the name of your event column?',
    timestamp: 'Do you have a custom time column? ',
  } as MappingType;

  // custom will be an array of objects (key/value pairs) where the key is a string and the val
  // is a string 
  const customQuestion = {
    custom: 'Would you like to include' + `${}` ,
  }; 

  const keys = Object.keys(questions);
  // Loop through the 3 required properties
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    // eslint-disable-next-line no-await-in-loop
    input[key] = await rl.question(
      `${questions[key as keyof typeof questions]} \t`
    );
    // Then loop through the custom values that remain in the set
    // Ask if the user wants to include these properties yes/no
    // If YES, add a follow-up question to ask what that property should be called
    // at the destination (Mixpanel)
  }
  rl.close();
  // Return the output object (with updated properties)
  return input as typeof questions;
};

export { authorizeMixpanel, createMap, getSpreadsheet };
