import { SPHttpClient, ISPHttpClientOptions } from '@microsoft/sp-http';
import { AdaptiveCardExtensionContext } from "@microsoft/sp-adaptive-card-extension-base";

export default class CacheService {
    private static context: AdaptiveCardExtensionContext;

    public static initialize(context: AdaptiveCardExtensionContext): void {
        this.context = context;
    }

    public static async getData(cacheKey: string): Promise<any> {        
        const response = await this.context.spHttpClient.get(SITE_URL +
                         "/_api/lists/GetByTitle('Cache')/items?$select=Id,status,exp_date,token&$filter=Title%20eq%20%27" + cacheKey + "%27",
                         SPHttpClient.configurations.v1);
        const responseJSON = await response.json();                    
        if (responseJSON.value.length) {            
            return responseJSON.value[0];
        } else {
            return null;
        }
    }

    public static async getStatus(cacheKey: string): Promise<string> {
        const response = await this.context.spHttpClient.get(SITE_URL +
            "/_api/lists/GetByTitle('Cache')/items?$select=Id,status,exp_date&$filter=Title%20eq%20%27" + cacheKey + "%27",
            SPHttpClient.configurations.v1);
        const responseJSON = await response.json();
        if (responseJSON.value.length && responseJSON.value[0].status === "user_is_authenticated") {
            if (new Date().getTime() < responseJSON.value[0].exp_date) {
                return responseJSON.value[0].status;
            }
            else {
                return "token_expired";
            }
        } else {
            return responseJSON.value[0].status;
        }
    }

    public static async saveData(cacheKey: string, status: string, exp_date: number, token: string = ""): Promise<any> {      
        //check existing item
        const headers = [
            ['accept', 'application/json'],
            ['content-type', 'application/json;odata=verbose'],
            ['odata-version', '3.0']
        ];
        let item = "";
        const data = await this.getData(cacheKey);        
        if (data) {
            item = '(' + data.Id.toString() + ')';
            headers.push(['If-Match', "*"]);
            headers.push(['X-HTTP-Method', 'MERGE']);
        }
        const body = {
            "__metadata": {
                "type": "SP.Data.CacheListItem"
            },
            "Title": cacheKey,
            "exp_date": exp_date.toString(),
            "status": status,
            "token": token
        };
        const options: ISPHttpClientOptions = {
            body: JSON.stringify(body), headers: headers
        };
        const path_url = "/_api/web/lists/GetByTitle('Cache')/items" + item;
        const res = await this.context.spHttpClient.post(SITE_URL + path_url,
                    SPHttpClient.configurations.v1, options);
        const response = await res.json();           
        return response;                
    }

}