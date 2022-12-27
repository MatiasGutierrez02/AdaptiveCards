<!--This file is used during the Teams authentication flow to assist with retrieval of the access token.-->
<!--If you're not familiar with this, do not alter or remove this file from your project.-->
<html>
  <head>
    <title>Login End Page</title>
    <meta charset="utf-8" />
  </head>

  <body>
    <script
      src="https://statics.teams.cdn.office.net/sdk/v1.6.0/js/MicrosoftTeams.min.js"
      integrity="sha384-mhp2E+BLMiZLe7rDIzj19WjgXJeI32NkPvrvvZBrMi5IvWup/1NUfS5xuYN5S3VT"
      crossorigin="anonymous"
    ></script>
    <script
      type="text/javascript"
      src="https://alcdn.msauth.net/browser/2.26.0/js/msal-browser.min.js"
      integrity="sha384-VdtLJ4gW9+dszXDbJEzdUFYI+xq4hXfOGntgGlDve3qz/5WEzWjLeN1voiro74af"
      crossorigin="anonymous">
    </script>
    <script type="text/javascript">
      var currentURL = new URL(window.location);
      var clientId = "REPLACE_WITH_CLIENT_ID";
      microsoftTeams.initialize();
      microsoftTeams.getContext(async function (context) {
        const msalConfig = {
          auth: {
            clientId: clientId,
            authority: `https://login.microsoftonline.com/${context.tid}`,
            navigateToLoginRequestUrl: false
          },
          cache: {
            cacheLocation: "sessionStorage",
          },
        }
        const msalInstance = new window.msal.PublicClientApplication(msalConfig);
        msalInstance.handleRedirectPromise()
          .then((tokenResponse) => {            
            if (tokenResponse !== null) {
                microsoftTeams.authentication.notifySuccess(JSON.stringify({
                  sessionStorage: sessionStorage,
                  tokenResponse: tokenResponse                  
                }));
            } else {
              microsoftTeams.authentication.notifyFailure("Get empty response.");
            }
            
          })
          .catch((error) => {
            microsoftTeams.authentication.notifyFailure(JSON.stringify(error));
          });
      })
    </script>
  </body>
</html>
