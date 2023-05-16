import { readFile, writeFile, readdir, rename } from 'fs/promises';
import * as path from 'path';
import * as process from 'process';
import { authenticate } from '@google-cloud/local-auth';
import { google, sheets_v4 } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { JSONClient } from 'google-auth-library/build/src/auth/googleauth';

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), '.SECRET_sheetsToken.json');
const CREDENTIALS_FILENAME = '.SECRET_sheets.json'
const CREDENTIALS_PATH = path.join(process.cwd(), CREDENTIALS_FILENAME);

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await readFile(TOKEN_PATH);
    const credentials = JSON.parse(content.toString());
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */

async function saveCredentials(client : OAuth2Client | JSONClient) {
  const content = await readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content.toString());
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await writeFile(TOKEN_PATH, payload);
}

async function handleInitalRun() {
  // Define regex to match downloaded credentials from Google cloud project (OAuth credentials)
  const regex = /^(?=.*client_secret_)(?=.*apps\.googleusercontent\.com\.json).*$/;

  // Store an array of strings representing all files in the root directory
  const files = await readdir(process.cwd());

  // Store an array of files that match the regex
  const regexMatches = files.filter(path => path.match(regex) !== null);

  // Store an array of files that match CREDENTIALS_FILENAME
  const existingCreds = files.filter(name => name === CREDENTIALS_FILENAME);

  // If the target file was found, rename it
  if (regexMatches[0] !== undefined && regexMatches[0] !== CREDENTIALS_PATH) rename(regexMatches[0], CREDENTIALS_PATH);

  // Else if (target not found) and no file matching the CREDENTIAL_PATH is found then throw
  else if (existingCreds[0] === undefined) throw new Error('Google credentials not found');
}

/**
 * Load or request or authorization to call APIs.
 *
 */
export async function authorize() {
  let client: OAuth2Client | JSONClient = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  await handleInitalRun();
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

/**
 * Returns the values of the specificed target spreadsheet:
 * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
export async function getRows(
  auth: OAuth2Client,
  targetSheet: sheets_v4.Params$Resource$Spreadsheets$Values$Get
) {
  const sheets = google.sheets({ version: 'v4', auth });
  const res = await sheets.spreadsheets.values.get(targetSheet);
  return res.data.values;
}
