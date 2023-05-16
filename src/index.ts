import { OAuth2Client } from 'google-auth-library';
import { authorize as authorizeGoolge, getRows } from './import/import.js';
import {
  createMap,
  getSpreadsheet,
} from './digestion/mapping.js';
import digest from './digestion/digest.js';
import {
  authorizeMixpanel,
  getMixpanelCredentials,
  SuccessResponse,
  ErrorResponse,
} from './export/export.js';

export default function main() {
  return (async function mixETL(): Promise<SuccessResponse | ErrorResponse | Error> {
    try {
    // Retrieve saved credentials or save Mixpanel credentials from user input
      const mixpanelCredentials = await getMixpanelCredentials();

      // Authorize Google Sheets API
      const googleAuth = await authorizeGoolge() as OAuth2Client;

      // Get the target speadsheet parameters from user input
      const targetSheet = await getSpreadsheet();

      // Load the data from the target spreadsheet
      const sourceData = await getRows(googleAuth, targetSheet);

      // Pass the header row of target spreadsheet to create mapping with user input
      const map = await createMap(new Set(sourceData[0]));

      // Pass the map object and loaded spreadsheet data to digest prior to export
      const digested = digest(sourceData, map);

      // Save the object exposing Mixpanel SDK instance after adding the credentials to it
      const mixpanelSDK = authorizeMixpanel(mixpanelCredentials);

      // Export the source data to the destination using Mixpanel SDK
      const mixpanelResponse = await mixpanelSDK.exportData(digested);

      // Log the Mixpanel respnonse for the user
      // eslint-disable-next-line no-console
      console.log(mixpanelResponse);
      return mixpanelResponse;
    } catch (err) {
    // eslint-disable-next-line no-console
      console.error(err);

      return err;
    }
  }());
}

main();
