import { OAuth2Client } from 'google-auth-library';
import { authorize, listRows } from './import';
import { authorizeMixpanel, getSpreadsheet, createMap } from './digest/mapping';
import mixpanelAuth from './export';

const main = () => (async function mixETL(): Promise<void> {
  try {
    // Retrieve saved credentials or save Mixpanel credentials from user input
    const mixpanelCredentials = await authorizeMixpanel();

    // Authorize Google Sheets API
    const googleAuth = await authorize() as OAuth2Client;

    // Get the target speadsheet parameters from user input
    const targetSheet = await getSpreadsheet();

    // Load the data from the target spreadsheet
    const sourceData = await listRows(googleAuth, targetSheet);

    // Pass the header row of target spreadsheet to create mapping with user input
    const map = await createMap(new Set(sourceData[0]));

    // Pass the map object and loaded spreadsheet data and digest prior to export
    const digested = digest(map, sourceData);

    // Save the Mixpanel SDK instance  after adding the credentials to it
    const mixpanelSDK = mixpanelAuth(mixpanelCredentials);

    // Export the source data to the destination using Mixpanel SDK
    const mixpanelResponse = await mixpanelSDK.exportData(digested);

    // Log the Mixpanel respnonse for the user
    // eslint-disable-next-line no-console
    console.log(mixpanelResponse);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
}());

main();
