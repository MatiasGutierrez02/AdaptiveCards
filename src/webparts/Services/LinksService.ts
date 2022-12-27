import { HttpClient } from '@microsoft/sp-http';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { INavLinkCategory, INavLinkSite, INavLinkTop } from '../allaccenturelinks/components/INavLink';
import AuthService from '../Auth/AuthService';
//import {IQuickLink} from '../allaccenturelinks/components/IQuickLink';

export default class LinksService {
    private static STORAGE_LIFETIME: number = 24 * 60 * 60 * 1000;
    private static context: WebPartContext;
    private static authMode: string;
    private static userKey: string;

    public static async initialize(context: WebPartContext, authMode?: string): Promise<void> {
        this.context = context;
        this.authMode = authMode ? authMode : "Primary";
        this.userKey = window.btoa(context.pageContext.user.loginName);
        return AuthService.initialize(context);
    }

    public static async getLinks(typeLinks: string): Promise<Array<any>> {
        return this.getProfileData().then((profile) => {
            if (typeLinks === "QUICK"){
                return this.getQuickLinks(profile).then((links) => {
                    return links;
                });
            }
            else {
                return this.getNavLinks(profile).then((links) => {
                    return links;
                });
            }
        });
    }

    public static async getProfileData(): Promise <any> {
        const storageKey = 'profileLinks:' + this.userKey;
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
                        "countryhomenumber": response.PeopleProperties.countryhomenumber,
                        "companycd": response.PeopleProperties.companycd,
                        "DeliveryCenterOrganizationId": response.PeopleProperties.DeliveryCenterOrganizationId,
                        "orglevel3id": response.PeopleProperties.orglevel3id,
                        "metrocitycd": response.PeopleProperties.metrocitycd,
                        "industrycapabilitydescrnodeid": response.PeopleProperties.industrycapabilitydescrnodeid,
                        "level": response.PeopleProperties['sps-jobtitle'] ,
                        "appliedintelligenceflag": response.PeopleProperties.appliedintelligenceflag,
                        "functionalflag": response.PeopleProperties.functionalflag,
                        "industryflag": response.PeopleProperties.industryflag,
                        "industryx0flag": response.PeopleProperties.industryx0flag,
                        "operationsflag": response.PeopleProperties.operationsflag,
                        "serviceflag": response.PeopleProperties.serviceflag,
                        "technicalflag": response.PeopleProperties.technicalflag
                    },
                    "timestamp": Date.now()
                };
                localStorage.setItem(storageKey, JSON.stringify(profileToStorage));
                return profileToStorage.profile;

            }catch{
                 return null;
            }
                                  
        }            
    }

    public static async getQuickLinks(profile: { [x: string]: string; countryhomenumber: string; companycd: string; DeliveryCenterOrganizationId: string; orglevel3id: string; metrocitycd: string; industrycapabilitydescrnodeid: string; appliedintelligenceflag: string; functionalflag: string; industryflag: string; industryx0flag: string; operationsflag: string; serviceflag: string; technicalflag: string; }): Promise <any> {
        const storageKey = 'linksList:' + this.userKey;
        const storedProfile = localStorage.getItem(storageKey);
        const myInfo = (null !== storedProfile && '' !== storedProfile) ? JSON.parse(storedProfile) : null;
        if (myInfo !== null) {
            return myInfo.links;
        }
        if (null === myInfo || myInfo.timestamp + this.STORAGE_LIFETIME < Date.now()) {
            try{
                const token = await this.getAuthorizationToken();

                const urlLinks = `${PORTAL_API}/vpc/quicklinks/?country=` + encodeURIComponent('%' + profile.countryhomenumber + '%') +
                                '&companycode=' + profile.companycd +
                                '&orglevel3id=' + (profile.DeliveryCenterOrganizationId === "51780883" ? encodeURIComponent('%' + profile.DeliveryCenterOrganizationId + '%') : encodeURIComponent('%' + profile.orglevel3id + '%')) +
                                '&city=' + encodeURIComponent('%' +  profile.metrocitycd + '%') +
                                '&industry=' + encodeURIComponent('%' + profile.industrycapabilitydescrnodeid + '%') +
                                '&level=' + encodeURIComponent('%' + profile['sps-jobtitle'] + '%') +
                                '&appliedintelligenceflag=' + (profile.appliedintelligenceflag ? encodeURIComponent('%' + profile.appliedintelligenceflag + '%') : '') +

                                '&functionalflag=' + (profile.functionalflag ? encodeURIComponent('%' + profile.functionalflag + '%') : null) +
                                '&industryflag=' + (profile.industryflag ? encodeURIComponent('%' + profile.industryflag + '%') : null) +
                                '&industryx0flag=' + (profile.industryx0flag ? encodeURIComponent('%' + profile.industryx0flag + '%') : null) +
                                '&operationsflag=' + (profile.operationsflag ? encodeURIComponent('%' + profile.operationsflag + '%') : null) +
                                '&serviceflag=' + (profile.serviceflag ? encodeURIComponent('%' + profile.serviceflag + '%') : null) +
                                '&technicalflag=' + (profile.technicalflag ? encodeURIComponent('%' + profile.technicalflag + '%') : null)


                const res = await this.context.httpClient.get(urlLinks,
                    HttpClient.configurations.v1,
                    {
                        headers: [
                            ['accept', 'application/json'],
                            ['Authorization', 'Bearer '  + token]
                        ]
                    });
                const response = await res.json();
                if (response.rowCount > 0) {
                    const quicklinks = this.mapQuickLinks(response.rows);
                    const linksToStorage = {
                        "links": quicklinks,
                        "timestamp": Date.now()
                    };

                    localStorage.setItem(storageKey, JSON.stringify(linksToStorage));
                    return linksToStorage.links;
                }

            }catch(err){
                return null;
            }
                                  
        }            
    }

    public static async getNavLinks(profile: { [x: string]: string; countryhomenumber: string; companycd: string; DeliveryCenterOrganizationId: string; orglevel3id: string; metrocitycd: string; industrycapabilitydescrnodeid: string; appliedintelligenceflag: string; functionalflag: string; industryflag: string; industryx0flag: string; operationsflag: string; serviceflag: string; technicalflag: string; }): Promise <any> {
        const storageKey = 'navLinksList:' + this.userKey;
        const storedProfile = localStorage.getItem(storageKey);
        const myInfo = (null !== storedProfile && '' !== storedProfile) ? JSON.parse(storedProfile) : null;
        if (myInfo !== null) {
            return myInfo.links;
        }
        if (null === myInfo || myInfo.timestamp + this.STORAGE_LIFETIME < Date.now()) {
            try{
                const token = await this.getAuthorizationToken();

                const urlLinks = `${PORTAL_API}/vpc/navLinks/?country=` + encodeURIComponent('%' + profile.countryhomenumber + '%') +
                                '&companycode=' + profile.companycd +
                                '&orglevel3id=' + (profile.DeliveryCenterOrganizationId === "51780883" ? encodeURIComponent('%' + profile.DeliveryCenterOrganizationId + '%') : encodeURIComponent('%' + profile.orglevel3id + '%')) +
                                '&city=' + encodeURIComponent('%' +  profile.metrocitycd + '%') +
                                '&industry=' + encodeURIComponent('%' + profile.industrycapabilitydescrnodeid + '%') +
                                '&level=' + encodeURIComponent('%' + profile['sps-jobtitle'] + '%') +
                                '&appliedintelligenceflag=' + (profile.appliedintelligenceflag ? encodeURIComponent('%' + profile.appliedintelligenceflag + '%') : '') +

                                '&functionalflag=' + (profile.functionalflag ? encodeURIComponent('%' + profile.functionalflag + '%') : null) +
                                '&industryflag=' + (profile.industryflag ? encodeURIComponent('%' + profile.industryflag + '%') : null) +
                                '&industryx0flag=' + (profile.industryx0flag ? encodeURIComponent('%' + profile.industryx0flag + '%') : null) +
                                '&operationsflag=' + (profile.operationsflag ? encodeURIComponent('%' + profile.operationsflag + '%') : null) +
                                '&serviceflag=' + (profile.serviceflag ? encodeURIComponent('%' + profile.serviceflag + '%') : null) +
                                '&technicalflag=' + (profile.technicalflag ? encodeURIComponent('%' + profile.technicalflag + '%') : null)


                const res = await this.context.httpClient.get(urlLinks,
                    HttpClient.configurations.v1,
                    {
                        headers: [
                            ['accept', 'application/json'],
                            ['Authorization', 'Bearer '  + token]
                        ]
                    });
                const categories = await res.json();
                if (categories) {
                    // categories = self.updateProperties(categories);
                    // self.tabs.push.apply(self.tabs, categories);
                    // self.navlinks.push.apply(self.navlinks, categories);

                    const toplinks = this.getTopLinks(categories);
                    debugger;
                    return toplinks;
                    // This is used for lazy loading the subcategories
                    // self.loader.quicklinks = 'quicklinks';
                    // self.loader.categories = 'menuCategory';

                    // // Select category
                    // if (self.currentCategory != '') self.selectCategory(self.currentCategory);

                    // // Add A to Z
                    // self.getAtoZ(self.tabs);
                }
                return null;

            }catch(err){
                return null;
            }
                                  
        }            
    }

    public static sortLinks(array: any[]): any {
        array.sort(function (a,b){
            if(a.TopLinkTitle === null || a.TopLinkTitle === undefined) a.TopLinkTitle = a.Title;
            if(b.TopLinkTitle === null || b.TopLinkTitle === undefined) b.TopLinkTitle = b.Title;
            if(a.TopLinkTitle.toLowerCase() < b.TopLinkTitle.toLowerCase()) return -1;
            if(a.TopLinkTitle.toLowerCase() > b.TopLinkTitle.toLowerCase()) return 1;
            return 0;
        });
    }

    public static mapQuickLinks(array: string | any[]): any {
        const mappedList = [];
        for (let index = 0; index < array.length; index++) {
            const element = {
                Id: array[index].id,
                Title: array[index].title,
                Url: array[index].url,
                ClickCount: array[index].clickcount,
                Country: array[index].country,
                Level: array[index].level,
                CompanyCode: array[index].companycode,
                City: array[index].city,
                Industry: array[index].industry,
                Organization: array[index].organization,
                Description: array[index].description
            }
            mappedList.push(element);
        }
        return mappedList;
    }

    public static getTopLinks(navLinks: INavLinkCategory[]): Array<INavLinkTop> {
        const topLinks = [];
                
        for (let i=0; i < navLinks.length; i++) {
            //const categoryTitle = navLinks[i].Title.replace(/[^a-zA-Z]/g, "").toLowerCase();
            const categoryTitle = navLinks[i].Title;
            const element = {
                Title: categoryTitle,
                TopLinks: this.getSites(navLinks[i]),
            }
            topLinks.push(element);
            //this.sortLinks(topLinks[categoryTitle]);
        }

        return topLinks;
    }

    public static getSites(category: INavLinkCategory): INavLinkSite[] {
        const toplinks: any[] = [];
        if (category.SubCategories !== null) {
            for (let i=0; i < category.SubCategories.length; i++) {
                const subcategory = category.SubCategories[i];
                if (subcategory.Groups) {
                    // subcategory.Groups.sort(function(a,b){
                    //     if (a.SortOrder - b.SortOrder === 0){
                    //         return a.Title > b.Title;
                    //     }
                    //     return a.SortOrder - b.SortOrder;
                    // })
                    for (let j=0; j<subcategory.Groups.length; j++) {
                        const group = subcategory.Groups[j];
                        if (group.Sites) {
                            const sites = group.Sites.filter(function(el) {
                                return el.IsTopLink === true;
                            });
                            // eslint-disable-next-line prefer-spread
                            toplinks.push.apply(toplinks, sites);
                        }
                    }
                }
            }
        }
        return toplinks;
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



// import { HttpClient } from '@microsoft/sp-http';
// /* import { AdaptiveCardExtensionContext } from "@microsoft/sp-adaptive-card-extension-base"; */
// import { WebPartContext } from '@microsoft/sp-webpart-base';
// import AuthService from '../Auth/AuthService';

// export default class ProfileService {
//     private static STORAGE_LIFETIME: number = 24 * 60 * 60 * 1000;
//     private static context: WebPartContext;
//     private static userKey: string;
//     private static authMode: string;

//     public static async initialize(context: WebPartContext, authMode?: string): Promise<void> {
//         this.context = context;
//         this.authMode = authMode ? authMode : "Primary";
//         this.userKey = window.btoa(context.pageContext.user.loginName);
//         return AuthService.initialize(context);
//     }

//     public static async get(): Promise<any> {
//         const storageKey = 'profile:' + this.userKey;
//         const storedProfile = localStorage.getItem(storageKey);
//         const myInfo = (null !== storedProfile && '' !== storedProfile) ? JSON.parse(storedProfile) : null;
//         if (myInfo !== null) {
//             return myInfo.profile;
//         }
//         if (null === myInfo || myInfo.timestamp + this.STORAGE_LIFETIME < Date.now()) {
//             try{
//                 //const token = await this.getAuthorizationToken();
//                 // const res = await this.context.httpClient.get
//                 // (`${PORTAL_API}'/vpc/quicklinks/?country=` + '' +
//                 // '&companycode=' + '' +
//                 // '&orglevel3id=' + "51780883" +
//                 // '&city=' + ''+
//                 // '&industry=' + '' +
//                 // '&level=' + '' +
//                 // '&appliedintelligenceflag=' + ''+
//                 // '&functionalflag=' + null +
//                 // '&industryflag=' + null +
//                 // '&industryx0flag=' + null +
//                 // '&operationsflag=' + null +
//                 // '&serviceflag=' +  null +
//                 // '&technicalflag=' + null
//                 // );
//                 // (`${PORTAL_API}'/vpc/quicklinks/?country=` + encodeURIComponent('%' + data.PeopleProperties.countryhomenumber + '%') +
//                 // '&companycode=' + data.PeopleProperties.companycd +
//                 // '&orglevel3id=' + (data.PeopleProperties.DeliveryCenterOrganizationId == "51780883" ? encodeURIComponent('%' + data.PeopleProperties.DeliveryCenterOrganizationId + '%') : encodeURIComponent('%' + data.PeopleProperties.orglevel3id + '%')) +
//                 // '&city=' + encodeURIComponent('%' +  data.PeopleProperties.metrocitycd + '%') +
//                 // '&industry=' + encodeURIComponent('%' + data.PeopleProperties.industrycapabilitydescrnodeid + '%') +
//                 // '&level=' + encodeURIComponent('%' + data.PeopleProperties['sps-jobtitle'] + '%') +
//                 // '&appliedintelligenceflag=' + (data.PeopleProperties.appliedintelligenceflag ? encodeURIComponent('%' + data.PeopleProperties.appliedintelligenceflag + '%') : '') +

//                 // '&functionalflag=' + (data.PeopleProperties.functionalflag ? encodeURIComponent('%' + data.PeopleProperties.functionalflag + '%') : null) +
//                 // '&industryflag=' + (data.PeopleProperties.industryflag ? encodeURIComponent('%' + data.PeopleProperties.industryflag + '%') : null) +
//                 // '&industryx0flag=' + (data.PeopleProperties.industryx0flag ? encodeURIComponent('%' + data.PeopleProperties.industryx0flag + '%') : null) +
//                 // '&operationsflag=' + (data.PeopleProperties.operationsflag ? encodeURIComponent('%' + data.PeopleProperties.operationsflag + '%') : null) +
//                 // '&serviceflag=' + (data.PeopleProperties.serviceflag ? encodeURIComponent('%' + data.PeopleProperties.serviceflag + '%') : null) +
//                 // '&technicalflag=' + (data.PeopleProperties.technicalflag ? encodeURIComponent('%' + data.PeopleProperties.technicalflag + '%') : null)
//                 // );
//                 //const response = await res.json();
//                 const response = {PeopleProperties:{peoplekey:1}}
//                 const profileToStorage = {
//                     "profile": {
//                         "peoplekey": response.PeopleProperties.peoplekey,
//                         // "countryhome": response.PeopleProperties.countryhome,
//                         // "displayname": response.PeopleProperties.displayname,
//                         // "personnelnumber": response.PeopleProperties.personnelnumber,
//                         // "standardjobdescr": response.PeopleProperties.standardjobdescr,
//                         // "facilitycd": response.PeopleProperties.facilitycd,
//                         // "enterpriseid": response.PeopleProperties.enterpriseid,
//                         // "sps-jobtitle": response.PeopleProperties['sps-jobtitle'],
//                         // "supervisorm": response.PeopleProperties.supervisorm,
//                         // "manager": response.PeopleProperties.manager,
//                         // "talentfulfillmentspecialist": response.PeopleProperties.talentfulfillmentspecialist,
//                         // "hrrepresentativename": response.PeopleProperties.hrrepresentativename,
//                         // "trainingcoordinatornm": response.PeopleProperties.trainingcoordinatornm
//                     },
//                     "timestamp": Date.now()
//                 };
//                 localStorage.setItem(storageKey, JSON.stringify(profileToStorage));
//                 return profileToStorage.profile;

//             }catch{
//                 Promise.reject();
//             }
                                  
//         }            
//     }

//     private static async getAuthorizationToken(): Promise<string> {
//         if (this.authMode === "Primary") {
//             return AuthService.getToken();
//         }
//         else {
//             return AuthService.waitForToken();
//         }
//     }
// }

