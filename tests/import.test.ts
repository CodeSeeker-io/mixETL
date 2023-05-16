import { google, sheets_v4 } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { getRows } from '../src/import/import';

// Mock the google dependency
jest.mock('googleapis');

// Declare label for mocked google methods
const mockedSheets = google.sheets as jest.Mock;

// Declare mock objects for spreadsheet params object
const sheetParamsObject = {
  spreadsheetId: '',
  range: '',
} as sheets_v4.Params$Resource$Spreadsheets$Values$Get;

describe('listRows method', () => {
  beforeEach(() => {
    // Clear mocked methods before each test
    mockedSheets.mockReset();

    // Set up mockedSheets return value (and nested get fn implementation)
    mockedSheets.mockReturnValue({
      spreadsheets: {
        values: {
          get: jest.fn()
            .mockImplementation(
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              (_targetSheet: sheets_v4.Params$Resource$Spreadsheets$Values$Get) => Promise.resolve({
                data: {
                  values: [
                    ['headerCol1', 'headerCol2', 'headerCol3'],
                    ['Col1Row1', 'Col2Row1', 'Col3Row1'],
                  ],
                },
              }),
            ),
        },
      },
    });
  });

  test('listRows should invoke google.sheets', () => {
    // Invoke listRows with mock auth arg, and mock targetSheet arg
    getRows({} as OAuth2Client, sheetParamsObject);

    // google.sheets (mock) should be invoked once
    expect(mockedSheets).toBeCalledTimes(1);
  });

  test('listRows should invoke spreadsheets.values.get method on return value from google.sheets invocation', () => {
    // Invoke listRows with mock auth arg, and mock targetSheet arg
    getRows({} as OAuth2Client, sheetParamsObject);

    // Nested get method on the Sheets object returned from google.sheets should be invoked
    expect(mockedSheets().spreadsheets.values.get).toBeCalledTimes(1);
  });

  test('listRows should spreadsheet data', async () => {
    // Store the resulting promise from invoking listRows method
    const rows = getRows({} as OAuth2Client, sheetParamsObject);

    // Await the result of rows promise, should match expected return value
    await expect(rows).resolves.toEqual(expect.arrayContaining([
      ['headerCol1', 'headerCol2', 'headerCol3'],
      ['Col1Row1', 'Col2Row1', 'Col3Row1'],
    ]));
  });
});
