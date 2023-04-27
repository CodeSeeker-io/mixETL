import sdk from '@api/mixpaneldevdocs';
import authorize from '../src/export';

// Mock the sdk dependency
jest.mock('@api/mixpaneldevdocs');

// Declare label for mocked sdk methods
const mockedAuth = sdk.auth as jest.Mock;
const mockedImportEvents = sdk.importEvents as jest.Mock;

// Declare mock objects for credentials and event
const mockCredentials = { PROJECT_ID: '', SERVICE_ACCOUNT: '', SERVICE_ACCOUNT_PASSWORD: '' };
const mockEvent = {
  event: 'paidTuition',
  properties: {
    custom1: true,
    custom2: 'Jane Smith',
    time: 1670003123567,
    distinct_id: 'JaneSmith1050ee42',
    $insert_id: '8d45bbb4-c4e9-4a3a-ab22-5935243a94db',
  },
};

describe('authorize method', () => {
  beforeEach(() => {
    // Clear mocked methods before each test
    mockedAuth.mockReset();
    mockedImportEvents.mockReset();
  });

  test('authorize should invoke sdk.auth method', () => {
    // Call the authorize method with mock credentials
    authorize(mockCredentials);

    expect(mockedAuth).toBeCalledTimes(1);
  });

  test('authorize returns object with exportData method', () => {
    // Store the value returned from invoking authorize
    const returnValue = authorize(mockCredentials);

    expect(returnValue).toMatchObject({
      exportData: expect.any(Function),
    });
  });

  test('exportData method that calls sdk.importEvents when invoked', async () => {
    // Destructure the exportData property of authorize invocation
    const { exportData } = authorize(mockCredentials);

    // Await the result of invoking the exportData method with an event argument
    await exportData([mockEvent]);

    expect(mockedImportEvents).toBeCalledTimes(1);
  });
});
