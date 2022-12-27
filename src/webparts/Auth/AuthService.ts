import * as msal from "@azure/msal-browser";
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { app, authentication } from "@microsoft/teams-js";

export default class AuthService {
    private static isTeamsDesktop: boolean;
    private static loginUser: string;
    private static accessToken: string;
    private static expiresOn: number;
    private static msalInstance: msal.PublicClientApplication;
    private static currentAccount: msal.AccountInfo = null;
    private static promise: Promise<string> = null;
    private static context: WebPartContext;
    private static tokenrequest: msal.SilentRequest = {
      scopes: [SCOPES],
      account: null,
    };
    private static msalConfig: msal.Configuration = {
        auth: {
            clientId: CLIENT_ID,
            authority: `https://login.microsoftonline.com/${TENANT_ID}`,
            navigateToLoginRequestUrl: false,
            redirectUri: `${SITE_URL}/${REDIRECT_URI}`
        },
        cache: {
            cacheLocation: "sessionStorage",
        }
    };
    private static SESSION_KEY = "msal." + CLIENT_ID + ".isUserAuthenticated";
    public static async initialize(context: WebPartContext): Promise<void> { 
        AuthService.context = context;
        AuthService.loginUser = AuthService.context.pageContext.user.loginName;
        AuthService.isTeamsDesktop = false;
        if (AuthService.isTeamsDesktop) {
            await app.initialize();
            this.msalConfig.cache.cacheLocation = "localStorage";
        }
        this.msalInstance = new msal.PublicClientApplication(this.msalConfig);
        return;
    }

    private static setCurrentAccount(): void {
      const currentAccounts: msal.AccountInfo[] = this.msalInstance.getAllAccounts();
      if (currentAccounts !== null || currentAccounts.length > 1) {
          this.currentAccount = this.msalInstance.getAccountByUsername(this.loginUser);
      } else if (currentAccounts.length === 1) {
          this.currentAccount = currentAccounts[0];
      } else if (currentAccounts.length === 0) {
          this.currentAccount = null;
      }
      this.tokenrequest.account = this.currentAccount;
    }

    private static interactionRequired(): Promise<string> {
      const loginPopupRequest: msal.PopupRequest = this.tokenrequest;
      loginPopupRequest.loginHint = this.loginUser;
      return this.msalInstance
        .acquireTokenPopup(loginPopupRequest)
          .then((tokenResponse) => {
              this.setLoginStatus("user_is_authenticated");
              return tokenResponse.accessToken;
        })
        .catch(() => {
            this.setLoginStatus("authentication_failed");
            console.log("Authentication failed, please try again!");
          return null;
        });
    }

  public static async getAccessToken(scopes?: string[]): Promise<string> {
    this.setCurrentAccount();
    if (scopes) {
        this.tokenrequest.scopes = scopes;
    }
    else {
        this.tokenrequest.scopes = [SCOPES];
    }
    return this.msalInstance
      .acquireTokenSilent(this.tokenrequest)
        .then((tokenResponse) => {
            this.setLoginStatus("user_is_authenticated");
            return tokenResponse.accessToken;
      })
      .catch((err) => {
            console.log(err);
            this.setLoginStatus("login_in_progress");
            return this.interactionRequired();
      });
  }

    public static async msTeamsAuthenticate(): Promise<void> {
        this.setLoginStatus("login_in_progress");
        const authorizationUrl = `https://login.microsoftonline.com/${TENANT_ID}`;
        const scope = SCOPES;
        const authenticationUrl = `${SITE_URL}/${AUTH_URL}`;
        const url = `${authenticationUrl}?clientId=${CLIENT_ID}&authorizationUrl=${authorizationUrl}&scope=${scope}&loginHint=${this.loginUser}`;

        // Open Authentication pop-up    
        return authentication.authenticate({
            url,
            width: 500,
            height: 600,
            successCallback: (result: string ) => {
                const info = JSON.parse(result);
                this.accessToken = info.tokenResponse.accessToken;
                this.expiresOn = new Date(info.tokenResponse.expiresOn).getTime();
                this.setLoginStatus("user_is_authenticated", this.expiresOn);
                return result;
            },
            failureCallback: (reason : string) => {
                console.log("Authentication failed, please try again!");
                this.setLoginStatus("authentication_failed");
                return reason;
            }
        });
    }

    public static isInteractionInProgress(): boolean {
        const sessionKey = "msal." + this.msalConfig.auth.clientId + ".interaction.status";
        const status = sessionStorage.getItem(sessionKey);
        if (status === "interaction_in_progress")
            return true;
        else return false;
    }


    public static async isUserAuthenticated(): Promise<boolean> {        
        const status = sessionStorage.getItem(this.SESSION_KEY);
        return status === "user_is_authenticated" ? true : false;            
    }

    private static setLoginStatus(status: string, exp_date: number = 0): void {
            sessionStorage.setItem(this.SESSION_KEY, status);
        
    }

    public static async getToken(): Promise<string> {        
        if (this.isTeamsDesktop) {
            if (this.accessToken !== "" && this.expiresOn > new Date().getTime()) {
                return this.accessToken;
            }
            return AuthService.msTeamsAuthenticate()
                .then(() => {
                    if (this.accessToken !== "" && this.expiresOn > new Date().getTime()) {
                        return this.accessToken;
                    }
                })
                .catch((error) => {
                    return error;
                });
        }
        else {
            if (!this.promise) {
                this.promise = this.getAccessToken();
            }
            return this.promise;
        }              
    }

    public static async waitForToken(): Promise<string> {
        if (await this.isUserAuthenticated()) {
            return this.getToken();
        }
        else {
            do {
                console.log("waiting for token...");
                await this.waitFor(1000);
            } while (!(await this.isUserAuthenticated()));
            return this.getToken();
        }
    }

    private static async  waitFor(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
