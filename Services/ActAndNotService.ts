import { HttpClient, IHttpClientOptions } from '@microsoft/sp-http';
import { AdaptiveCardExtensionContext } from "@microsoft/sp-adaptive-card-extension-base";
import AuthService from '../Auth/AuthService';
import * as moment from 'moment';

export default class ActAndNotService {
    private static context: AdaptiveCardExtensionContext;
    private static userKey: string;
    private static authMode: string;

    public static async initialize(context: AdaptiveCardExtensionContext, authMode?: string): Promise<void> {
        this.context = context;
        this.userKey = window.btoa(context.pageContext.user.loginName);
        this.authMode = authMode ? authMode : "Secondary";
        return AuthService.initialize(context);
    }

    public static async getAction(): Promise<any> { 
        try{
            const token = await this.getAuthorizationToken();
            const params = {
                includereadnotifications: false,
                notificationtype: "BothActions",
                ordercolumn: "MailDate",
                ordertype: "Descending",
                pageno: 0, // To get all and not 25 paged
                timezoneOffset: moment().format('Z') 
            };
            const httpClientOptions: IHttpClientOptions = {
                body: JSON.stringify(params), headers:[
                    ['accept', 'application/json'],
                    ['Authorization', 'Bearer ' + token]
                ]
            };
            const res = await this.context.httpClient.post(`${PORTAL_API}/mailerna/GetNonExpiredNotifications`,
                                    HttpClient.configurations.v1, httpClientOptions);
            const response = await res.json();        
            const totalItemsFiltered = response.filter(action => action.TransactionTypeID === 5);
            totalItemsFiltered.sort((a,b) => {
                return a.ExpirationDate.localeCompare(b.ExpirationDate);
            });
            const count = totalItemsFiltered.length;
            const text = count > 0 ? "You have " + count + " new actions" : "You don't have actions";                        
            const dataToStorage = {
                "data": {
                    "text": text,
                    "count": count,
                    "items": totalItemsFiltered,
                    "token": token
                },
            };
            return dataToStorage.data;

        }catch{
            Promise.reject();
        }   
              
    }

    public static async getNotification(): Promise<any> {    
        try{
            const token = await this.getAuthorizationToken();
            const params = {
                includereadnotifications: false,
                notificationtype: "BothActions",
                ordercolumn: "MailDate",
                ordertype: "Descending",
                pageno: 0, // To get all and not 25 paged
                timezoneOffset: moment().format('Z') 
            };
            const httpClientOptions: IHttpClientOptions = {
                body: JSON.stringify(params), headers:[
                    ['accept', 'application/json'],
                    ['Authorization', 'Bearer ' + token]
                ]
            };
            const res = await this.context.httpClient.post(`${PORTAL_API}/mailerna/GetNonExpiredNotifications`,
                HttpClient.configurations.v1, httpClientOptions);
            const response = await res.json();       
            const totalItemsFiltered = response.filter(notification => notification.TransactionTypeID === 6);
            const count = totalItemsFiltered.length;
            totalItemsFiltered.sort((a,b) => {
                return a.ExpirationDate.localeCompare(b.ExpirationDate);
            });                    
            const text = count > 0 ? "You have " + count + " new notifications" : "You don't have notifications";            
            const dataToStorage = {
                "data": {
                    "text": text,
                    "count": count,
                    "items": totalItemsFiltered,
                    "token": token
                },
            };
            return dataToStorage.data;

        }catch{
            Promise.reject();
        }
    }    
        

    public static async markAsRead(transactionID: string): Promise<any> {       
        const token = await this.getAuthorizationToken();
        const params = {
            NotificationIds: transactionID,
            EmailAddress: this.userKey
        };
        const httpClientOptions: IHttpClientOptions = {
            body: JSON.stringify(params), headers:[
                ['accept', 'application/json'],
                ['Authorization', 'Bearer ' + token]
            ]
        };
        const res = await this.context.httpClient.post(`${PORTAL_API}/mailerna/MarkNotificationsAsRead`, HttpClient.configurations.v1, httpClientOptions);
        const response = await res.json();
        return response;        
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

