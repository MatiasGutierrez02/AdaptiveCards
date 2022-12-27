import { HttpClient } from '@microsoft/sp-http';
import { AdaptiveCardExtensionContext } from "@microsoft/sp-adaptive-card-extension-base";
import AuthService from '../Auth/AuthService';

export default class EthicsAndTicketsService {
    private static STORAGE_LIFETIME: number = 24 * 60 * 60 * 1000;
    private static context: AdaptiveCardExtensionContext;
    private static userKey: string; 
    private static authMode: string;

    public static async initialize(context: AdaptiveCardExtensionContext, authMode?: string): Promise<void> {
        this.context = context;
        this.userKey = window.btoa(context.pageContext.user.loginName);
        this.authMode = authMode ? authMode : "Secondary";
        return AuthService.initialize(context);
    }

    public static async getTickets(): Promise<any> {
        
        const storageKey = 'ethicsandtickets:' + this.userKey;
        const storedData = localStorage.getItem(storageKey);
        const myTicketsInfo = (null !== storedData && '' !== storedData) ? JSON.parse(storedData) : null;
        if (myTicketsInfo !== null) {
            return myTicketsInfo.data;
        }
        if (null === myTicketsInfo || myTicketsInfo.timestamp + this.STORAGE_LIFETIME < Date.now()) {
            try{
                const token = await this.getAuthorizationToken();
                const res = await this.context.httpClient.get(`${PORTAL_API}/support/GetTickets`, HttpClient.configurations.v1,
                    {
                        headers: [
                            ['accept', 'application/json'],
                            ['Authorization', 'Bearer ' + token]
                        ]
                    });
                const response = await res.json();
                const tickets = response;
                const openTickets = (tickets.totalOpen) ? tickets.totalOpen : tickets.requestOpen + tickets.incidentOpen + tickets.problemOpen + tickets.changeOpen;
                const requireAttentionTickets = tickets.approvalsActive + tickets.contributorUserOpen;
                const dataToStorage = {
                    "data": {
                        "openTickets": openTickets,
                        "requireAttentionTickets": requireAttentionTickets
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

    private static async getAuthorizationToken(): Promise<string> {
        if (this.authMode === "Primary") {
            return AuthService.getToken();
        }
        else {
            return AuthService.waitForToken();
        }
    }
}

