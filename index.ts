import { OAuth2Client } from 'google-auth-library';
import { authorize, listRows } from './server/index';
import { authorizeMixpanel, getSpreadsheet, createMap } from './import/mapping';

const main = () => (async function mixETL(): Promise<void> {
  // Retrieve saved credentials or save Mixpanel credentials from user input
  const mixpanelCredentials = await authorizeMixpanel();

  // Authorize Google Sheets API
  const auth = await authorize() as OAuth2Client;

  // Get the target speadsheet parameters from user input
  const targetSheet = await getSpreadsheet();

  // Load the data from the target spreadsheet
  const sheetRows = await listRows(auth, targetSheet);

  // Pass the header row of target spreadsheet to create mapping with user input
  const map = await createMap(new Set(sheetRows[0]));

  // Pass the map object and loaded spreadsheet data and digest prior to export
  // const digested = digest(map, sheetRows);

  // Save the Mixpanel credentials to the Mixpanel SDK instance

  // Export the source data to the destination using Mixpanel SDK

  return Promise.resolve();
}());

main();
