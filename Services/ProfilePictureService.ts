import { HttpClient } from '@microsoft/sp-http';
import { AdaptiveCardExtensionContext } from "@microsoft/sp-adaptive-card-extension-base";
import AuthService from '../Auth/AuthService';

export default class ProfilePictureService {
    private static STORAGE_LIFETIME: number = 24 * 60 * 60 * 1000;
    private static context: AdaptiveCardExtensionContext;
    private static authMode: string;

    public static async initialize(context: AdaptiveCardExtensionContext, authMode?: string): Promise<void> {
        this.context = context;
        this.authMode = authMode ? authMode : "Secondary";
        return AuthService.initialize(context);
    }

    public static async get(peopleKey: number): Promise<any> {
        const storageKey = 'profilepicture:' + peopleKey;
        const storedData = localStorage.getItem(storageKey);
        const profilePicture = (null !== storedData && '' !== storedData) ? JSON.parse(storedData) : null;
        if (profilePicture !== null) {
            return profilePicture.data;
        }
        if (null === profilePicture || profilePicture.timestamp + this.STORAGE_LIFETIME < Date.now()) {
            try{
                const token = await this.getAuthorizationToken();
                const res = await this.context.httpClient.get(`${PORTAL_API}/wcf/profilepicture?peoplekey=${peopleKey}`,
                    HttpClient.configurations.v1,
                    {
                        headers: [
                            ['accept', 'application/json'],
                            ['Authorization', 'Bearer ' + token]
                        ]
                    });
                const response = await res.json();
                const profilePictureToStore = {
                    data: 'data:image/jpg;base64,' + response,
                    timestamp: Date.now()
                };
                localStorage.setItem(storageKey, JSON.stringify(profilePictureToStore));
                return profilePictureToStore.data;

            }catch{
                return 'data:image/jpg;base64,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';
            }  
        }            
    }

    private static async getAuthorizationToken(): Promise<string> {
        if (this.authMode === "Primary") {
            return AuthService.getToken();
        }
        else {
            return AuthService.waitForToken();
        }
    }
}

