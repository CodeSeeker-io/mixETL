import * as readline from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import { sheets_v4 } from 'googleapis';

const createMap = (columns: Set<string>) => {

};

type Stage = 'Mixpanel' | 'Spreadsheet' | 'Mapping';
// type SpreadsheetProperties = {
//   spreadsheetId: string,
//   range: string,
// };
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

const getInput = async (stage: Stage):
Promise<(sheets_v4.Params$Resource$Spreadsheets$Values$Get | MixpanelCredentials)> => {
  const input: { [key:string]: string } = {};
  const rl = readline.createInterface(stdin, stdout);
  let questions;
  switch (stage) {
    case 'Mixpanel':
      questions = {
        PROJECT_ID: 'What is your Mixpanel Project ID?',
        SERVICE_ACCOUNT: 'What is your Mixpanel Service Account Username?',
        SERVICE_ACCOUNT_PASSWORD: 'What is your Mixpanel Service Account Password?',
      } as MixpanelCredentials;
      break;
    case 'Spreadsheet':
      questions = {
        spreadsheetId: 'What is your Mixpanel Project ID?',
        range: 'What is your Mixpanel Service Account Username?',
      } as sheets_v4.Params$Resource$Spreadsheets$Values$Get;
      break;
    case 'Mapping':
      // questions = {
      //   eventName: 'What is the name of your event column?',
      //   distinct_id: 'What is the name of your Mixpanel \'distinct_id\' column?',
      // } as MappingType;
      break;
    default: {
      rl.close();
      // return {};
    }
  }
  const keys = Object.keys(questions);
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    // eslint-disable-next-line no-await-in-loop
    input[key] = await rl.question(`${questions[key as keyof typeof questions]} \t`);
  }

  // for (let i = 0; i < questions.length; i += 1) {
  //   // eslint-disable-next-line no-await-in-loop
  //   answer = await rl.question(`${questions[i]} \t`);
  //   input.push(answer);
  // }
  rl.close();
  return input as typeof questions;
};

export { createMap, getInput };
