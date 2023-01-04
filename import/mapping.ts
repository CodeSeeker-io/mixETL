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
  distinct_id: string,
  eventName: string,
  $insert_id: string,
  timestamp: string,
  custom: Array<{[key:string]: string}>,
};

/** Refactor to fix arrow function return */
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
// take in a set of
// the column header 
// event anme and sinstinct id column 
// do you have a custom time column? 
// if yes, then ask the title of that column is 
// if they response 'no', then we should incloude an empty string under the key on the final output object for 'time' 
// we'd still expect hte final output object to have a time key but the valoue would just bbe an empty string 

//when the user gives a response int eh command line, it has to be one of the valoues in that set 
//repromt them if invalid response 


//after we go thru reaquired properties (3), then we should loop thru all remaining (custom vals remaaining in the set and ask  if they w
// want to include these properties yes/ no 
//if yes, then we'd need a follow up question to ask what they'd want to call that property at the destination (mixpanel)
// once done, we hshould be able to return an input object  (with added props in objet)
// get columns from ...; 
// use readline to ask user questions 
//insert id
//custom an array of objects (key/value pairs) 

// an array of objecfts where the key is a string and the value is a stirng 

//delete the valuesi nt he set as the user specifies them
//if they specify event is thename of th event column, check if it's the set so we knowif its a valid response,and if it is in the 
//set then we delete it and add it to the mapping output object 

const createMap = (columns: Set<string>) => {};

// const questions = {
//   eventName: 'What is the name of your event column?',
//   distinct_id: 'What is the name of your Mixpanel \'distinct_id\' column?',
// } as MappingType;

export { authorizeMixpanel, createMap, getSpreadsheet };
