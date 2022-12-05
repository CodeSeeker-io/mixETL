import sdk, {
  ImportEventsResponse200,
  ImportEventsResponse400,
  ImportEventsResponse401,
  ImportEventsResponse413,
  ImportEventsResponse429,
} from '@api/mixpaneldevdocs';
import { readFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

// eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle
const __dirname = dirname(fileURLToPath(import.meta.url));

const { PROJECT_ID, SERVICE_ACCOUNT, SERVICE_ACCOUNT_PASSWORD } = JSON.parse(readFileSync(resolve(__dirname, '../.mixpanel')).toString());
const { events } = JSON.parse(readFileSync(resolve(__dirname, './transformed.json')).toString());

// Add authorization credentials to skd instance
sdk.auth(SERVICE_ACCOUNT, SERVICE_ACCOUNT_PASSWORD);
// Import event data from source service
sdk.importEvents(events, {
  strict: '1',
  project_id: PROJECT_ID,
  'content-encoding': 'gzip',
})
  .then(({ data } : { data: ImportEventsResponse200 }) => console.log(data))
  .catch((err: (
    ImportEventsResponse400 |
    ImportEventsResponse401 |
    ImportEventsResponse413 |
    ImportEventsResponse429)) => console.error(err));
