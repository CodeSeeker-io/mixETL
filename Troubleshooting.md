## GaxiosErrors:
### Permission
```
GaxiosError: The caller does not have permission
    at Gaxios._request (.../MixETL/node_modules/gaxios/build/src/gaxios.js:130:23)
    at processTicksAndRejections (node:internal/process/task_queues:96:5)
```
There may be an issue with the Google setup. Make sure to follow the steps in outlined in [Google Setup](https://github.com/CodeSeeker-io/MixETL/blob/main/README.md#google-credentials).

After completing those steps, try running the script `npm run main`.

If you see the error message again, try waiting 5 mins (Google Cloud may still be propegating your credential changes).

If the issue persists, try runing `npm run clean` (this will restore mixETL to downloaded state), then start at Step 2 under [To Use](https://github.com/CodeSeeker-io/MixETL/blob/main/README.md#to-use)

### Range
```
GaxiosError: Unable to parse range: Sheeeeet
    at Gaxios._request (.../MixETL/node_modules/gaxios/build/src/gaxios.js:130:23)
    at processTicksAndRejections (node:internal/process/task_queues:96:5)
```
This error message happens when the spreadsheet name entered does not exist in the workbook associated with the spreadsheet id. Example, my spreadsheet with id 12345 has two sheets, Sheet1 and Sheet2, but I entered the name of the spreadsheet as 'Sheeeeet' instead of 'Sheet1'. 

After verifying the name of the sheet you are working with, run `npm run main` to start the CLI program again.

## FetchErrors:
### Unauthorized
```
FetchError: Unauthorized
    at new FetchError (.../MixETL/node_modules/api/dist/core/errors/fetchError.js:21:28)
    at APICore.<anonymous> (.../MixETL/node_modules/api/dist/core/index.js:152:51)
    at step (.../MixETL/node_modules/api/dist/core/index.js:44:23)
    at Object.next (.../MixETL/node_modules/api/dist/core/index.js:25:53)
    at fulfilled (.../MixETL/node_modules/api/dist/core/index.js:16:58)
    at processTicksAndRejections (node:internal/process/task_queues:96:5) {
  status: 401,
  data: { error: 'Invalid service account credentials', status: 0 },
```
There may be an issue with your Mixpanel credentials. You can manually edit the .mixpanel file to correct them OR delete the file and run `npm run main` to restart the CLI program.
### Bad Request
```
FetchError: Bad Request
    at new FetchError (.../MixETL/node_modules/api/dist/core/errors/fetchError.js:21:28)
    at APICore.<anonymous> (.../MixETL/node_modules/api/dist/core/index.js:152:51)
    at step (.../MixETL/node_modules/api/dist/core/index.js:44:23)
    at Object.next (.../MixETL/node_modules/api/dist/core/index.js:25:53)
    at fulfilled (.../MixETL/node_modules/api/dist/core/index.js:16:58)
    at processTicksAndRejections (node:internal/process/task_queues:96:5) {
  status: 400,
  data: {
    code: 400,
    error: 'some data points in the request failed validation',
```
There may be an issue with the source data. This message indicates the received data could not be validated. Verify that your data matches the Mixpanel requirements. For more information on these requirements see [the Mixpanel Dev Docs](https://developer.mixpanel.com/reference/import-events#example-of-an-event)

## Spiders in the machine
If you found a bug, please feel free to report an issue so that we can fix it! 
