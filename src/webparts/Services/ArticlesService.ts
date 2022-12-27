import { HttpClient } from '@microsoft/sp-http';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import AuthService from '../Auth/AuthService';

export default class ArticlesService {
    private static context: WebPartContext;
    private static authMode: string;

    public static async initialize(context: WebPartContext, authMode?: string): Promise<void> {
        this.context = context;
        this.authMode = authMode ? authMode : "Primary";
        return AuthService.initialize(context);
    }

    public static async get(): Promise<any> {
        const token = await this.getAuthorizationToken();
        const res = await this.context.httpClient.get(`${PORTAL_API}/articles/raw?pn=1&ps=6`,
            HttpClient.configurations.v1,
            {
                headers: [
                    ['accept', 'application/json'],
                    ['Authorization', 'Bearer '  + token]
                ]
            });

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

