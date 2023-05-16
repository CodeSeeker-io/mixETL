## Architecture

mixETL is a blend of 3rd party APIs and custom interface to ingest, digest and export pre-cleaned event data to Mixpanel. The current structure does not contain a traditional UI and offers a means for users to quickly send data to Mixpanel without passing credentials through a 3rd party. In order to accomplish this, the code has dependencies for the source data (Google Sheets) and the destination (Mixpanel).

### Prepare
To prepare your machine for development, use the `npm run build` command, which will install all the dependencies. You should see a .api directory which contains the Mixpanel API code when this step completes.

Ensure that you have a Mixpanel project you can use for dev work, and that you have already established a [service account](https://developer.mixpanel.com/reference/service-accounts) for that project.

Also ensure that you have your Google cloud [credentials](https://developers.google.com/workspace/guides/create-credentials#oauth-client-id) handy. You will need to add your downloaded credential json file and add it to the mixETL root directory. Dragging the file downloaded from Google workspace into your IDE is the easiest way to accomplish this step.

## Tests
### Running tests
**To run all tests:** `npm run test` 

**To run a specific test:** `npx jest tests/testPath.ts`  

If you would like **to enable TypeScript type checking** inside individual tests, you can do so by commenting out the line containing ```isolatedModules: true,``` in `jest.config.ts`. 

**A word of caution:** running all tests without ```isolatedModules: true,``` present in `jest.config.ts` will make tests take a very long time to complete, and may even cause your dev environment to run out of memory. We recommend only using `npm run test` with ```isolatedModules: true,``` present in `jest.config.ts`, and commiting code prior to running tests.

### Writing tests
Currently all tests are written in TypeScript. All dependencies are mocked, including Node.js modules (which have their own custom mock implementations in `__mocks__`. The test suite is primarily comprised of unit tests and current coverage is nearly 100% as the codebase was written while trying to adhrer to TDD.

When resolving issues or working on new features, please be sure to include appropriate test files.

## Contributions
If you find something broken, or that could be done better, we'd love for you to help us fix it!
