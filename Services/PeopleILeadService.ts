import { HttpClient } from '@microsoft/sp-http';
import { AdaptiveCardExtensionContext } from "@microsoft/sp-adaptive-card-extension-base";
import AuthService from '../Auth/AuthService';
import ProfilePictureService from '../Services/ProfilePictureService';

export default class PeopleILeadService {
    private static context: AdaptiveCardExtensionContext;
    private static userKey: string; 
    private static authMode: string;

    public static async initialize(context: AdaptiveCardExtensionContext, authMode?: string): Promise<void> {
        this.context = context;
        this.userKey = window.btoa(context.pageContext.user.loginName);
        this.authMode = authMode ? authMode : "Secondary";
        await ProfilePictureService.initialize(context, this.authMode);
        return AuthService.initialize(context);
    }

    public static async getCounselees(): Promise<any> {
        const STORAGE_LIFETIME = 24 * 60 * 60 * 1000;
        const storageKey = 'counselees:' + this.userKey;
        const storedData = localStorage.getItem(storageKey);
        const myCounselees = (null !== storedData && '' !== storedData) ? JSON.parse(storedData) : null;
        if (myCounselees !== null) {
            return myCounselees.list;
        }
        if (null === myCounselees || myCounselees.timestamp + STORAGE_LIFETIME < Date.now()) {
            const token = await this.getAuthorizationToken();
            const res = await this.context.httpClient.get(`${PORTAL_API}/vpc/peopleilead/getcounselees`,
                HttpClient.configurations.v1,
                {
                    headers: [
                        ['accept', 'application/json'],
                        ['Authorization', 'Bearer ' + token]
                    ]
                });
            const response = await res.json();
            const counseleesInfo = response.hits.hits.map(hit => {
                const counseleesData = hit._source;
                counseleesData.image = null;
                counseleesData.category = "Career Counselee";
                return counseleesData;
            });
            const counselees = [];
            for (let i = 0; i < counseleesInfo.length; i++) {
                const item = counseleesInfo[i];
                const peopleKey = item.peoplekey.toString();
                item.image = await ProfilePictureService.get(peopleKey);
                counselees.push(item);
            }
            const dataToStorage = {
                "list": counselees,
                timestamp: Date.now()
            };
            localStorage.setItem(storageKey, JSON.stringify(dataToStorage));
            return counselees;
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

