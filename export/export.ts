import sdk, {
  ImportEventsResponse200,
  ImportEventsResponse400,
  ImportEventsResponse401,
  ImportEventsResponse413,
  ImportEventsResponse429,
  ImportEventsBodyParam,
} from '@api/mixpaneldevdocs';
import { importJSON } from '../tests/utils';

const { PROJECT_ID, SERVICE_ACCOUNT, SERVICE_ACCOUNT_PASSWORD } = importJSON('../.mixpanel', '../');
const { events } = importJSON('./transformed.json', '../');

// Add authorization credentials to sdk instance
sdk.auth(SERVICE_ACCOUNT as string, SERVICE_ACCOUNT_PASSWORD as string);
// Import event data from digested source data in transform.json file
sdk.importEvents(events as ImportEventsBodyParam, {
  strict: '1',
  project_id: PROJECT_ID as string,
  'content-encoding': 'gzip',
})
  .then(({ data } : { data: ImportEventsResponse200 }) => console.log(data))
  .catch((err: (
    ImportEventsResponse400 |
    ImportEventsResponse401 |
    ImportEventsResponse413 |
    ImportEventsResponse429)) => console.error(err));
