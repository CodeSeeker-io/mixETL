import sdk, {
  ImportEventsResponse200,
  ImportEventsResponse400,
  ImportEventsResponse401,
  ImportEventsResponse413,
  ImportEventsResponse429,
  ImportEventsBodyParam,
} from '@api/mixpaneldevdocs';
import { MixpanelCredentials } from './digest/mapping';

type SuccessResponse = ImportEventsResponse200;
type ErrorResponse = ImportEventsResponse400
| ImportEventsResponse401
| ImportEventsResponse413
| ImportEventsResponse429;

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

export default authorize;
