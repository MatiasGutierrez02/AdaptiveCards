import { HttpClient } from '@microsoft/sp-http';
import { AdaptiveCardExtensionContext } from "@microsoft/sp-adaptive-card-extension-base";
import AuthService from '../Auth/AuthService';

export default class HoldingsService {
    private static context: AdaptiveCardExtensionContext;
    private static userKey: string; 
    private static authMode: string;
    private static STORAGE_LIFETIME: number = 60 * 1000;

    public static async initialize(context: AdaptiveCardExtensionContext, authMode?: string): Promise<void> {
        this.context = context;
        this.userKey = window.btoa(context.pageContext.user.loginName);
        this.authMode = authMode ? authMode : "Secondary";
        return AuthService.initialize(context);
    }

    public static async getMarketQuote(): Promise<any> {
        const storageKey = 'myholdings:' + this.userKey;
        const storedData = localStorage.getItem(storageKey);
        const myHoldingsInfo = (null !== storedData && '' !== storedData) ? JSON.parse(storedData) : null;
        if (myHoldingsInfo !== null) {
            return myHoldingsInfo.data;
        }
        if (null === myHoldingsInfo || myHoldingsInfo.timestamp + this.STORAGE_LIFETIME < Date.now()) {
            try{
                const token = await this.getAuthorizationToken();
                const res = await this.context.httpClient.get(`${MY_HOLDINGS_API}/getMarketQuote`, HttpClient.configurations.v1,
                    {
                        headers: [
                            ['accept', 'application/json'],
                            ['Authorization', 'Bearer ' + token]
                        ]
                    });
                const response = await res.json();
                const dataMarketQuote = {
                    "change": response.Change,
                    "lastPrice": response.LastPrice,
                    "timeStamp": response.Timestamp.replace(".000Z", "Z"),
                    "time": "",
                    "shares": 0,
                    "sharesValue": 0
                };
                const programSummData = await this.getProgramSummary(token, dataMarketQuote.timeStamp, dataMarketQuote.lastPrice);
                dataMarketQuote.time = programSummData.time;
                dataMarketQuote.shares = programSummData.shares;
                dataMarketQuote.sharesValue = programSummData.sharesValue;
                const dataToStorage = {
                    "data": dataMarketQuote,
                    "timestamp": Date.now()
                };
                localStorage.setItem(storageKey, JSON.stringify(dataToStorage));
                return dataMarketQuote;

            }catch{
                Promise.reject();
            }
            
        }
    }

    public static async getProgramSummary(token: string, lDate: string, lastPrice: number): Promise<any> {
        try{
            const res = await this.context.httpClient.get(`${MY_HOLDINGS_API}/getProgramSummary`, HttpClient.configurations.v1,
            {
                headers: [
                    ['accept', 'application/json'],
                    ['Authorization', 'Bearer ' + token]
                ]
            });
            const response = await res.json();
            return this.formatGetProgramSumary(response, lDate, lastPrice);

        }catch{
            Promise.reject();
        }
        
    }

    public static formatGetProgramSumary(programSummaryResult: any, lDate: string, lastPrice: number) :any {
        let cantProgramSummarys = programSummaryResult.length;
        let shares, sharesValue = 0;
        let time = "";
        if (lDate !== "") {
            const d = new Date(lDate);
            time = d.toLocaleDateString([], {
                hour: "2-digit",
                minute: "2-digit"
            });
        }
    
        if (cantProgramSummarys === undefined) {
            cantProgramSummarys = 1;
        }
    
        let partialSharedValueAmount = 0;
    
        if (cantProgramSummarys === 1) {
            shares = (programSummaryResult[0][0].Outstanding !== undefined) ? programSummaryResult[0][0].Outstanding : 0;
            sharesValue = shares * lastPrice;    
        } else {
            for (let i = 0; i < programSummaryResult.length; i++) {
                for (
                    let j = 0;
                    j < programSummaryResult[i].length;
                    j++
                ) {
                    if (programSummaryResult[i][j].HoldingsTypeGroup !== undefined &&
                        programSummaryResult[i][j].HoldingsTypeGroup !== "") {
                        partialSharedValueAmount += programSummaryResult[i][j].Outstanding;
                    }
                }
            }
            shares = partialSharedValueAmount;
            sharesValue = shares * lastPrice;
        }
        const programSummaryInfo = {
            "time": time,
            "shares": shares,
            "sharesValue": sharesValue
        };
        return programSummaryInfo;
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

