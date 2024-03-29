<h1 align="center">
    <img width="540" height="160" src="assets/logo.png" alt=""><br>
</h1>

*mixETL is a simple reverse ETL tool that takes clean, processed data from Google Sheets and imports it into Mixpanel.*

- - -

This tool is currently only intended for users to import "events" into Mixpanel. If you are looking to stream events live or import User Profiles, you will need to find an alternative solution. We hope to add support for Mixpanel User Profiles in the future.

## Quick Start 
1. Download the code
2. Add your Google credentials file to the mixETL project folder (see [Google credentials](https://github.com/CodeSeeker-io/MixETL/blob/main/README.md#google-credentials))
3. Run `npm run mixetl`

That's it! Follow the terminal instructions and you'll be walked through the workflow:
- Enter your Mixpanel service account credentials
- Authorize your local machine to access your Google account
- Answer the questions about your source data and desired property names

## See it in action
![run mixetl command, and follow the prompts to complete your import](/assets/mixetl.gif)

## Setup
The architecture of this app means that all requests are processed on your machine, directly between you and Google. Likewise, all Mixpanel requests are sent directly between you and Mixpanel. This architecture ensures users' privacy and keeps the tool free because there are no server hosting costs. The trade-off with this approach is that it requires users to ensure their Google Workspace and Mixpanel Project are both prepped to handle these requests. This section will help you with the setup. 
### Google credentials
To use mixETL, you will need to set up a Google Cloud project so that you can be verifed via OAuth. In order to accomplish this, users are required to have a Google Workspace and OAuth credentials set up to authorize their local machine. To set up your credentials:
1. Create OAuth credentials.

  If you aren't sure where to start, see [this section](https://developers.google.com/workspace/guides/create-credentials#oauth-client-id) of the Google Cloud docs and click the Go to Credentials button
    - If you do not have a Google cloud project, you should see a **Create Project** button. Click on it and fill in the required fields before proceeding.
  - In the Google Cloud console, go to **Menu > APIs & Services > Credentials**
  - Click **Create Credentials** > **OAuth client ID**
  - Type a **name** for the credential (it can be anything you want)
  - Click **Create**
  
2. Configure OAuth consent (you may be asked to complete this step in the OAuth credentials workflow)
  - Enter an **App** name (it can be anything. We use 'mixETL' so we know what is making the OAuth request when we see it)
  - Enter your **gmail address** in the **User support email** field
  - Skip down to the Developer contact info section, enter the same gmail address into the email addresses field
  - Click **Save and Continue**
  - On the Scopes screen, click **Add or Remove scopes**
  - Scroll to the **Manually add scopes** field, and enter ```https://www.googleapis.com/auth/spreadsheets.readonly```
  You can read more about what this is [here](https://developers.google.com/identity/protocols/oauth2/scopes)
  - Click **Add to Table**, and then click **Update**
  - **Save and Continue**, and then **Save and Continue** again. Now you can download your credentials.
3. Download your credentials, add the downloaded file to your mixETL project folder

Note: the crendential file will be renamed to **'.SECRET_sheets.json'** after running `npm run mixetl` the first time.
You will need to allow your local machine to access this Google workspace via your browser when prompted (only on the first run)

![grant access to Google when prompted](/assets/oauth.gif)

For more detailed instructions on signing up and obtaining your credentials, check out [this section](https://developers.google.com/workspace/guides/get-started) of the Google dev docs. See the **'Develop on Google Workspace'** section and review steps 1 and 2 under '5 steps to get started.'

### Mixpanel service account
If you do not already have a Mixpanel service account for your Mixpanel project, you will need to set one up. To do so:
1. Navigate to your **'Organization Settings'** or **'Project settings'**
2. Select **'Service Accounts' > '+ Add Service Account'**
3. **Save your credential** from the Create Service Account modal (you won't have access to the password after closing the modal)

For more details on setting up a Mixpanel service account, see [Service Accounts](https://developer.mixpanel.com/reference/service-accounts) 

### Data format
Data in your sheet should contain a header row, where each cell describes the column. You should have a column that identifies your distinct id and event name. To learn more about required properties and preparing data for import to Mixpanel, check out their docs [here](https://developer.mixpanel.com/reference/import-events). Limitation: mixETL does not currently support user provided **'$insert_id'**.  

## Troubleshooting
For some common errors, checkout [Troubleshooting.md](https://github.com/CodeSeeker-io/MixETL/blob/main/Troubleshooting.md)

## Contributing
mixETL is a tool built by [volunteers](https://github.com/CodeSeeker-io/MixETL/graphs/contributors) to make importing existing event data into Mixpanel easier. We welcome contributions to the project and look forward to supporting additional data sources in the future. If you would like to help develop mixETL, please visit [Contributions.md](https://github.com/CodeSeeker-io/MixETL/blob/main/Contributions.md).
