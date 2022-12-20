import * as readline from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import { sheets_v4 } from 'googleapis';
import * as fs from 'node:fs';
import { promises } from 'fs';
import * as path from 'path'; 
// import fs from '../__mocks__/fs';

const { readFile, writeFile } = promises;

const createMap = (columns: Set<string>) => {

};

// type Stage = 'Mixpanel' | 'Spreadsheet' | 'Mapping';

type MixpanelCredentials = {
  PROJECT_ID: string;
  SERVICE_ACCOUNT: string;
  SERVICE_ACCOUNT_PASSWORD: string;
};

const MIX_CRED = path.join(process.cwd(), '.mixpanel');

const authorizeMixpanel = async (): Promise<MixpanelCredentials> => {
  const mixpanel = './mixpanel';
  if (fs.existsSync(mixpanel)) {
    console.log('file exists')
    const creds = await readFile(mixpanel);
    const credentials = JSON.parse(creds.toString());
    if (!Object.values(credentials).includes('')) { 
      console.log('this is credentials', credentials);
    }
  } else {
    const input: { [key: string]: string } = {};
    const rl = readline.createInterface(stdin, stdout);
    const questions = {
      PROJECT_ID: 'What is your Mixpanel Project ID?',
      SERVICE_ACCOUNT: 'What is your Mixpanel Service Account Username?',
      SERVICE_ACCOUNT_PASSWORD: 'What is your Mixpanel Service Account Password?',
    } as MixpanelCredentials;
    const keys = Object.keys(questions);
    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      // eslint-disable-next-line no-await-in-loop
      input[key] = await rl.question(`${questions[key as keyof typeof questions]} \t`);
    }
    rl.close();
    await writeFile(MIX_CRED, JSON.stringify(input));
    // console.log('this is input', input)
    return input as typeof questions;
  }
};
authorizeMixpanel();

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
      input[key] = await rl.question(`${questions[key as keyof typeof questions]} \t`);
    }
    rl.close();
    console.log(input)
    return input as typeof questions;
  };

// getSpreadsheet();
// type MappingType = {
//   distinct_id: string,
  // eventName: string,
//   $insert_id: string,
//   timestamp: string,
//   custom: string[],
// };


//   case 'Mapping':
//     // questions = {
//     //   eventName: 'What is the name of your event column?',
//     //   distinct_id: 'What is the name of your Mixpanel \'distinct_id\' column?',
//     // } as MappingType;
//     break;
//   default: {
//     rl.close();
//     // return {};
//   }
// }

export { authorizeMixpanel, createMap, getSpreadsheet };
