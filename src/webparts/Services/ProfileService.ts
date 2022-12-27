import { HttpClient } from '@microsoft/sp-http';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import AuthService from '../Auth/AuthService';

export default class ProfileService {
    private static STORAGE_LIFETIME: number = 24 * 60 * 60 * 1000;
    private static context: WebPartContext;
    private static userKey: string;
    private static authMode: string;

    public static async initialize(context: WebPartContext, authMode?: string): Promise<void> {
        this.context = context;
        this.authMode = authMode ? authMode : "Primary";
        this.userKey = window.btoa(context.pageContext.user.loginName);
        return AuthService.initialize(context);
    }

    public static async get(): Promise <any> {
        const storageKey = 'profile:' + this.userKey;
        const storedProfile = localStorage.getItem(storageKey);
        const myInfo = (null !== storedProfile && '' !== storedProfile) ? JSON.parse(storedProfile) : null;
        if (myInfo !== null) {
            return myInfo.profile;
        }
        if (null === myInfo || myInfo.timestamp + this.STORAGE_LIFETIME < Date.now()) {
            try{
                const token = await this.getAuthorizationToken();
                const res = await this.context.httpClient.get(`${PORTAL_API}/vpc/profile/v2`,
                    HttpClient.configurations.v1,
                    {
                        headers: [
                            ['accept', 'application/json'],
                            ['Authorization', 'Bearer '  + token]
                        ]
                    });
                const response = await res.json();
                const profileToStorage = {
                    "profile": {
                        "peoplekey": response.PeopleProperties.peoplekey,
                        "countryhome": response.PeopleProperties.countryhome,
                        "displayname": response.PeopleProperties.displayname,
                        "personnelnumber": response.PeopleProperties.personnelnumber,
                        "standardjobdescr": response.PeopleProperties.standardjobdescr,
                        "facilitycd": response.PeopleProperties.facilitycd,
                        "enterpriseid": response.PeopleProperties.enterpriseid,
                        "sps-jobtitle": response.PeopleProperties['sps-jobtitle'],
                        "supervisorm": response.PeopleProperties.supervisorm,
                        "manager": response.PeopleProperties.manager,
                        "talentfulfillmentspecialist": response.PeopleProperties.talentfulfillmentspecialist,
                        "hrrepresentativename": response.PeopleProperties.hrrepresentativename,
                        "trainingcoordinatornm": response.PeopleProperties.trainingcoordinatornm
                    },
                    "timestamp": Date.now()
                };
                localStorage.setItem(storageKey, JSON.stringify(profileToStorage));
                return profileToStorage.profile;

            }catch{
                 Promise.reject();
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

