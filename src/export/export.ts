import * as readline from 'readline/promises';
import { stdin, stdout } from 'node:process';
import { readFile, writeFile } from 'fs/promises';
import * as path from 'path';
import sdk from '@api/mixpaneldevdocs';
import {
  ImportEventsResponse200,
  ImportEventsResponse400,
  ImportEventsResponse401,
  ImportEventsResponse413,
  ImportEventsResponse429,
  ImportEventsBodyParam,
} from '@api/mixpaneldevdocs/types';
import { MixpanelCredentials } from '../digestion/mapping';

export type SuccessResponse = ImportEventsResponse200;
export type ErrorResponse = ImportEventsResponse400
| ImportEventsResponse401
| ImportEventsResponse413
| ImportEventsResponse429;

/* The file .mixpanel stores the user's Mixpanel credentials, and is
created automatically when authorizeMixpanel() is called for the first
time. If updating user's Mixpanel credentials, simply delete the .mixpanel
file and run authorizeMixpanel() again.
*/

// Store the path of the .mixpanel file
const MIX_CRED = path.join(process.cwd(), '.mixpanel');


/* Returns the user's Mixpanel Credentials saved in fs,
or prompts user for the credentials, saves them to fs, then returns them */
const getCredentials = async (): Promise<MixpanelCredentials> => {
  try {
    /* Reads previously authorized Mixpanel credentials from the saved
    .mixpanel file */
    const savedCredentials = await readFile(MIX_CRED);

    // Store the credentials as an object
    const credentials = JSON.parse(savedCredentials.toString());

    // Destructure the required properties
    const { PROJECT_ID, SERVICE_ACCOUNT, SERVICE_ACCOUNT_PASSWORD } = credentials;

    // If all required properties are not null-ish, return the credentials object
    if (PROJECT_ID && SERVICE_ACCOUNT && SERVICE_ACCOUNT_PASSWORD) {
      return credentials;
    }
    throw new Error();
  } catch (err) {
    /* Creates a new .mixpanel file containing user's Mixpanel credentials using
    CLI user input */

    // Define new object to store user responses from CLI
    const input: { [key: string]: string } = {};

    // Store a reference to new createInterface instance
    const rl = readline.createInterface(stdin, stdout);

    // Define function to validate CLI inputs
    const validate = async (r: string, k: string) => {
    // Define a variable to store the number of user attempts at a valid response
      let retries = 3;
      // Store a reference to the initial response argument
      let response = r;

      while (!response && retries > 0) {
      // Repromt user for a valid response
      // eslint-disable-next-line no-await-in-loop
        response = await rl.question(
          'Credentials cannot be empty. Please re-enter\t',
        );

        // Decrement the variable representing allow attempts by 1
        retries -= 1;
      }

      // If a valid response is not entered after 3 attemps, throw error
      if (retries === 0 && !response) {
        throw new Error('You have not entered valid responses.\nPlease review your credentials and try running the script again.');
      }

      input[k] = response;
    };

    // Define the questions to ask user
    const questions = {
      PROJECT_ID: 'What is your Mixpanel Project ID?',
      SERVICE_ACCOUNT: 'What is your Mixpanel Service Account Username?',
      SERVICE_ACCOUNT_PASSWORD:
        'What is your Mixpanel Service Account Password?',
    } as MixpanelCredentials;

    // Store the keys from the questions (associated with credentials keys)
    const credKeys = Object.keys(questions);

    // Iterate through the questions, use for loop to await CLI
    for (let i = 0; i < credKeys.length; i += 1) {
      // Store the current credential key (see questions object)
      const credKey = credKeys[i];

      // Await user response
      // eslint-disable-next-line no-await-in-loop
      const unsafeResponse = await rl.question(
        `${questions[credKey as keyof typeof questions]} \t`,
      );

      // Await validation of the response, if valid input object will be updated
      // eslint-disable-next-line no-await-in-loop
      await validate(unsafeResponse, credKey);
    }

    // Close the readline interface
    rl.close();

    // Await writing the credentials to fs
    await writeFile(MIX_CRED, JSON.stringify(input));

    // Return the CLI input as the credentials
    return input as typeof questions;
  }
};

// Declare a method to authorize SDK and scope credentials to function
const authorize = ({
  SERVICE_ACCOUNT,
  SERVICE_ACCOUNT_PASSWORD,
  PROJECT_ID
}: MixpanelCredentials) => {
  // Add authorization credentials to the sdk instance
  sdk.auth(SERVICE_ACCOUNT, SERVICE_ACCOUNT_PASSWORD);

  // Declare new method to export events and create a closure over sdk instance
  const exportData = async (
    events: ImportEventsBodyParam
  ): Promise<SuccessResponse | ErrorResponse> => {
    try {
      // Await response from importing event data
      const { data } = await sdk.importEvents(events, {
        strict: '1',
        project_id: PROJECT_ID,
        'content-encoding': 'gzip',
      });

      // Return the response from Mixpanel
      return data;
    } catch (err) {
      // Return the error response from Mixpanel
      return err;
    }
  };
  // Return a new object with one method used to interact with the SDK
  return { exportData };
};

export {
  authorize as authorizeMixpanel,
  getCredentials as getMixpanelCredentials,
};
