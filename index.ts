import { OAuth2Client } from 'google-auth-library';
import { sheets_v4 } from 'googleapis';
import { importJSON } from './tests/utils';
// import { getInput } from './import/mapping';
import { authorize, listRows } from './server/index';

const main = () => (async function mixETL(): Promise<void> {
  const { PROJECT_ID, SERVICE_ACCOUNT, SERVICE_ACCOUNT_PASSWORD } = importJSON('./.mixpanel', './');
  // Verifty Mixpanel credentials are saved to .mixpanel file
  if (!PROJECT_ID || !SERVICE_ACCOUNT || !SERVICE_ACCOUNT_PASSWORD) {
    // If credentials are not saved, ask user for them
    // await getInput('Mixpanel');
    // Run main functionality once credentials are saved
    return main();
  }

  const auth = await authorize() as OAuth2Client;
  // const targetSheet = await getInput('Spreadsheet') as sheets_v4.Params$Resource$Spreadsheets$Values$Get;
  // const sheetRows = await listRows(auth, targetSheet);
  // Pass the pass the header row into input function 
  return Promise.resolve();
}());

main();
