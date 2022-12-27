import { HttpClient } from '@microsoft/sp-http';
import { AdaptiveCardExtensionContext } from "@microsoft/sp-adaptive-card-extension-base";
import AuthService from '../Auth/AuthService';
import ProfileService from '../Services/ProfileService';

export default class OfficeService {
    private static STORAGE_LIFETIME: number = 24 * 60 * 60 * 1000;
    private static context: AdaptiveCardExtensionContext;
    private static userKey: string; 
    private static authMode: string;

    public static async initialize(context: AdaptiveCardExtensionContext, authMode?: string): Promise<void> {
        this.context = context;
        this.userKey = window.btoa(context.pageContext.user.loginName);
        this.authMode = authMode ? authMode : "Secondary";
        await ProfileService.initialize(context, this.authMode);
        return AuthService.initialize(context);
    }

    public static async get(): Promise<any> {
        const storageKey = 'profile:userInfo:' + this.userKey;
        const storedData = localStorage.getItem(storageKey);
        const myPTOInfo = (null !== storedData && '' !== storedData) ? JSON.parse(storedData) : null;
        if (myPTOInfo !== null) {
            return myPTOInfo.data;
        }
        if (null === myPTOInfo || myPTOInfo.timestamp + this.STORAGE_LIFETIME < Date.now()) {
            try{
                const token = await this.getAuthorizationToken();
                const res = await this.context.httpClient.get(`${PORTAL_API}/vpc/profile/v2`, HttpClient.configurations.v1,
                    {
                        headers: [
                            ['accept', 'application/json'],
                            ['Authorization', 'Bearer ' + token]
                        ]
                    });
                const response = await res.json();
                const dataToStorage = {
                    "data": {                                    
                        "facilitycd": response.PeopleProperties.facilitycd.toString(),
                        "mycity":response.PeopleProperties.homecity.toString()
                    },
                    "timestamp": Date.now()
                };
                localStorage.setItem(storageKey, JSON.stringify(dataToStorage));
                return dataToStorage.data; 

            }catch{
                Promise.reject();
            }                          
        }         
    }

    public static async getLocationData(facilityCd): Promise<any> {
        const storageKey = 'profile:locationData:' + this.userKey;
        const storedData = localStorage.getItem(storageKey);
        const myLocationInfo = (null !== storedData && '' !== storedData) ? JSON.parse(storedData) : null;
        if (myLocationInfo !== null) {
            return myLocationInfo.data;
        }
        if (null === myLocationInfo || myLocationInfo.timestamp + this.STORAGE_LIFETIME < Date.now()) {
            try{
                const token = await this.getAuthorizationToken();
                const res = await this.context.httpClient
                    .get(`${PORTAL_API}/officesearch/myoffice?st=` + encodeURIComponent(facilityCd), HttpClient.configurations.v1,
                        {
                            headers: [
                                ['accept', 'application/json'],
                                ['Authorization', 'Bearer ' + token]
                            ]
                        });
                      
                const response = await res.json();
                const office = response.d.results[0];
                const dataToStorage = {
                    "data": OfficeService.formatDataLocation(office),
                    "timestamp": Date.now()
                };
                localStorage.setItem(storageKey, JSON.stringify(dataToStorage));
                return dataToStorage.data;  

            }catch{
                const dataNull = {
                    "titleLocation":"",
                    "address": "",
                    "officeStatus": "",
                    "covidTesting": "",
                    "faceMask": "",
                    "officeEmail": "",
                    "isLoading": false
                };
                return dataNull;
            }
                          
        }            
    }

    public static async getNearLocationData(facilityCd): Promise<any> {
        const storageKey = 'profile:NearlocationData:' + this.userKey;
        const storedData = localStorage.getItem(storageKey);
        const myLocationInfo = (null !== storedData && '' !== storedData) ? JSON.parse(storedData) : null;
        if (myLocationInfo !== null) {
            return myLocationInfo.data;
        }
        if (null === myLocationInfo || myLocationInfo.timestamp + this.STORAGE_LIFETIME < Date.now()) {
            try{
                const token = await this.getAuthorizationToken();
                const res = await this.context.httpClient
                    .get(`${PORTAL_API}/officesearch?st=` + encodeURIComponent(facilityCd) + '&from=' + 0 + '&size=' + 10, HttpClient.configurations.v1,
                        {
                            headers: [
                                ['accept', 'application/json'],
                                ['Authorization', 'Bearer ' + token]
                            ]
                        });
                const response = await res.json();
                const locations = [];
                let ind = 0;
                for (const x of response.d.results) {
                    locations[ind] = OfficeService.formatDataLocation(x);
                    ind++;
                }
                const dataToStorage = {
                    "data": locations,
                    "timestamp": Date.now()
                };
                localStorage.setItem(storageKey, JSON.stringify(dataToStorage));
                return dataToStorage.data;                       

            }catch{
                const locations = [OfficeService.formatDataLocation(null)];
                // locations[0] = OfficeService.formatDataLocation(null);

                return locations;
            } 
        }            
    }

    public static formatDataLocation(office): any{
        if(office !== null){
            let officeJson = {
                "titleLocation":office.Title,
                "address": office.Street_x0020_Address_x0020_1.replace(/<[^>]*>?/gm, ''),
                "officeStatus": office.Office_x0020_Status_x003a_,
                "covidTesting": office.COVID_x0020_Testing,
                "faceMask": office.Face_x0020_Masks_x003a_,
                "officeEmail": office.Office_x0020_Support.results[0].Title,
                "isLoading": false
            };
        
            officeJson = JSON.parse(JSON.stringify(officeJson).replace(/:null/gi, ":\"\"")); 
            return officeJson;
            
        }else{
            const dataNull = {
                "titleLocation":"",
                "address": "",
                "officeStatus": "",
                "covidTesting": "",
                "faceMask": "",
                "officeEmail": "",
                "isLoading": false
            };
            return dataNull;
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
  

