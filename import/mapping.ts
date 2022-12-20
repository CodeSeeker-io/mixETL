import * as readline from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import { sheets_v4 } from 'googleapis';

export const createMap = (columns: Set<string>) => {

};

// type Stage = 'Mixpanel' | 'Spreadsheet' | 'Mapping';

type MixpanelCredentials = {
  PROJECT_ID: string,
  SERVICE_ACCOUNT: string,
  SERVICE_ACCOUNT_PASSWORD: string,
};
type MappingType = {
  distinct_id: string,
  eventName: string,
  $insert_id: string,
  timestamp: string,
  custom: string[],
};

// input: headerRow from Google sheet -> [eventName, userName, favoriteSong]
// ask the required questions:
  // name of the event column
    // remove the that item from the input array
    // add key/val pair to mapping object
  // name of disctict id column
    // remove the that item from the input array
    // add key/val pair to mapping object
  // loop through the remaining items in the input array and ask
    // would you like to export this column?
      // if yes, ask what would you like this field to be called at the destination?
      // remove that item from the input array
      // add key/val pair to mapping object
// return the mapping obj

export const authorizeMixpanel = async (): Promise<MixpanelCredentials> => Promise.reject();

export const getSpreadsheet = async ():
Promise<(sheets_v4.Params$Resource$Spreadsheets$Values$Get)> => {
  const input: { [key:string]: string } = {};
  const rl = readline.createInterface(stdin, stdout);
  const questions = {
    spreadsheetId: 'What is your Mixpanel Project ID?',
    range: 'What is your Mixpanel Service Account Username?',
  } as sheets_v4.Params$Resource$Spreadsheets$Values$Get;

  const keys = Object.keys(questions);
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    // eslint-disable-next-line no-await-in-loop
    input[key] = await rl.question(`${questions[key as keyof typeof questions]} \t`);
  }

  return input as typeof questions;
};

// export { createMap, getInput };
