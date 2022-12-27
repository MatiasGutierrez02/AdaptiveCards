import { HttpClient, IHttpClientOptions } from '@microsoft/sp-http';
import { AdaptiveCardExtensionContext } from "@microsoft/sp-adaptive-card-extension-base";
import AuthService from '../Auth/AuthService';
import ProfilePictureService from '../Services/ProfilePictureService';
import ProfileService from '../Services/ProfileService';

export default class CareerSupContactsService {
    private static STORAGE_LIFETIME: number = 24 * 60 * 60 * 1000;
    private static context: AdaptiveCardExtensionContext;
    private static userKey: string; 
    private static authMode: string;

    public static async initialize(context: AdaptiveCardExtensionContext, authMode?: string): Promise<void> {
        this.context = context;
        this.authMode = authMode ? authMode : "Secondary";
        this.userKey = window.btoa(context.pageContext.user.loginName);
        await ProfilePictureService.initialize(context, this.authMode);
        await ProfileService.initialize(context, this.authMode);
        return AuthService.initialize(context);
    }

    public static async getContacts(): Promise<any> {
        const storageKey = 'careersupcontacts:' + this.userKey;
        const storedData = localStorage.getItem(storageKey);
        const myContactsInfo = (null !== storedData && '' !== storedData) ? JSON.parse(storedData) : null;
        
        if (myContactsInfo !== null) {
            return myContactsInfo.list;
        }
        if (null === myContactsInfo || myContactsInfo.timestamp + this.STORAGE_LIFETIME < Date.now()) {
            const token = await this.getAuthorizationToken();
            const profile = await ProfileService.get();
            const params = {
                countryhome: "%" + profile.countryhome + "%",
                spsjobtitle: "%" + profile['sps-jobtitle'] + "%"
            };
            const httpClientOptions: IHttpClientOptions = {
                body: JSON.stringify(params), headers: [
                    ['accept', 'application/json'],
                    ['Authorization', 'Bearer ' + token]
                ]
            };
            
            const res = await this.context.httpClient.post(`${PORTAL_API}/vpc/careersupportcontact/csc`, HttpClient.configurations.v1, httpClientOptions);
            const response = await res.json();
            const ContactsInfoList = response.rows;
            const myContacts = [];
            const supervisorm = profile.supervisorm ? profile.supervisorm : '';
            const manager = profile.manager ? profile.manager : '';
            const talentfulfillmentspecialist = profile.talentfulfillmentspecialist ? profile.talentfulfillmentspecialist : '';
            const peopleAdvisor = profile.hrrepresentativename ? profile.hrrepresentativename : '';
            const trainingApprover = profile.trainingcoordinatornm ? profile.trainingcoordinatornm : '';
            const csc: any = [
                { EnterpriseId: peopleAdvisor, FirstName: '', IsSharedContact: false, LastName: '', PeopleKey: 0, Picture: '', RelationshipTitle: 'People Advisor', Tip: '', Url: '', WorkEmail: '' },
                { EnterpriseId: trainingApprover, FirstName: '', IsSharedContact: false, LastName: '', PeopleKey: 0, Picture: '', RelationshipTitle: 'Training Approver', Tip: '', Url: '', WorkEmail: '' },
                { EnterpriseId: manager, FirstName: '', IsSharedContact: false, LastName: '', PeopleKey: 0, Picture: '', RelationshipTitle: 'People Lead', Tip: '', Url: '', WorkEmail: '' },
                { EnterpriseId: supervisorm, FirstName: '', IsSharedContact: false, LastName: '', PeopleKey: 0, Picture: '', RelationshipTitle: 'Supervisor', Tip: '', Url: '', WorkEmail: '' },
                { EnterpriseId: talentfulfillmentspecialist, FirstName: '', IsSharedContact: false, LastName: '', PeopleKey: 0, Picture: '', RelationshipTitle: 'Talent Fulfillment Specialist', Tip: '', Url: '', WorkEmail: '' }
            ];
                            
            if (csc[2].EnterpriseId === '') {
                csc.splice(2, 1);
                if (csc[3].EnterpriseId === '')
                    csc.splice(3, 1);
            } else {
                csc.splice(3, 1);
            }
                            
            ContactsInfoList.forEach((item) => {
                for (let i = 0; i < csc.length; i++) {
                    if ((item.relationshiptitle === csc[i].RelationshipTitle) &&
                        (item.countries === '' && item.levels === null)) {
                        csc[i].Tip = item.tip;
                        csc[i].Url = item.url;
                        break;
                    } else if (item.relationshiptitle.indexOf('Shared') > -1) {
                        if ((item.relationshiptitle.substring(7)) === csc[i].RelationshipTitle) {
                            csc[i].Tip = item.tip;
                            csc[i].Url = item.url;
                            csc[i].EnterpriseId = '';
                            csc[i].FirstName = item.title;
                            csc[i].IsSharedContact = true;
                            csc[i].LastName = '';
                            csc[i].PeopleKey = 0;
                            csc[i].WorkEmail = '';
                        }
                    }
                }
            });

            for (let i = 0; i < csc.length; i++) {
                const item = csc[i];
                if (item.EnterpriseId) {
                    const info = await this.getContactInfo(item.EnterpriseId);
                    item.PeopleKey = info.PeopleKey;
                    item.FirstName = info.FirstName;
                    item.LastName = info.LastName;
                    item.WorkEmail = info.WorkEmail;
                    item.Picture = await ProfilePictureService.get(item.PeopleKey);
                } else if (item.FirstName) {
                    if (item.IsSharedContact) {
                        if (item.RelationshipTitle === "Training Approver") {
                            item.Picture = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAAEAlgCWAAD/2wBDAAUFBQgFCAwHBwwMCQkJDA0MDAwMDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ3/2wBDAQUICAoHCgwHBwwNDAoMDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ3/wgARCAA8ADwDAREAAhEBAxEB/8QAGwAAAgMBAQEAAAAAAAAAAAAAAAIBAwYEBQf/xAAZAQEBAQEBAQAAAAAAAAAAAAAAAQIDBAX/2gAMAwEAAhADEAAAAdB5/oA000q3MUBVbMjSnm0enMUIFdyEmU3y1eOoQgqXISYzrw2fLsAAiSLWJ6ctxy6ilgeBrHa1m2ObWNVnp55J68vz+4YKsKoBUS3Q50xK3HOto8lVn//EACIQAAICAQMEAwAAAAAAAAAAAAABAgMSBBEgBRMjMBAUJP/aAAgBAQABBQL1IWsql6KZfo50vz8m9il+XhVrozctTCJfYrSt4y+5UT6jFFevUn34GJibfGJiYmxijFGCO2tsUKCHUjBH/8QAHBEAAgICAwAAAAAAAAAAAAAAABEBMBASIjJA/9oACAEDAQE/AfHE8qI7W7DxAxjwhCEIVf8A/8QAHBEAAQQDAQAAAAAAAAAAAAAAEQABEEAgITBB/9oACAECAQE/AZ1n4mY8BWEhCn//xAAiEAABAwMDBQAAAAAAAAAAAAABABEwAiIxEiCBMkBhccH/2gAIAQEABj8Cj0jqg5qg5P2Ae9rVWrKdA+VlWh01VoWR2P8A/8QAIxAAAgEDAwQDAAAAAAAAAAAAAREAICExEEHwUWFxkaHR8f/aAAgBAQABPyFx0uglAYEjKfOCEx6uOOXHDMcccdFgetcBeSpcOb0ph5bSzIX3myilh/nnDzAFMACfEsE7exhBH7jb7PtRJB1Gc+vmbua+YNISGKRVrGVCDRAh6X//2gAMAwEAAgADAAAAEP8Ab/nnDJJfnv51BtOAJokAqzXIlJzmkBP/xAAgEQADAAICAQUAAAAAAAAAAAAAAREQISAx8DBBUXGB/9oACAEDAQE/EKUWGJlLiCI7br4GIpSlE9ng+ilKXPueH4UpSlw3oXZJicFvR2yoXmBCej//xAAcEQACAgMBAQAAAAAAAAAAAAABEQAhECAx8DD/2gAIAQIBAT8QySVbm6euEJe5urhpuOw83AuHmqwVw8yKKOOOPLj+P//EACQQAQACAQMEAgMBAAAAAAAAAAEAESExQVEQcZGhYdEggbHh/9oACAEBAAE/ECCBvTxK24z2NotS+i5ZLIC7ax96rpnbX40jJiPRfUI/dh5/x+YHxO1H5i5cuXL6DUgcoHuVc+/lfcuXF6Z1KYSN9xdoyB1sgordfEGWshk0OAdEBVqUOAiviNJsUwWZ4KzKUEasDXIVAHJIuYnCpYgOAGJh+Im043pKc5PUWJ0qY6bdOGfUecdATfqZNINYZ7zTCovW/X1KAu8cV/JXt/Pqf//Z';
                        } else {
                            item.Picture = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADsAAAA7CAYAAADFJfKzAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABRtJREFUeNrcmz1MFEEUx+cOEEE9FApINHgWNhrhiIWJgQRbJQFLY6F2RAukUmmA0gppDJ1YEEswQVvPYIwWmgMTLUVjIVH0ROMXfs1/M0Pm5vZj9vbN3uJLJgS429vf/t/XPIYUs2Tb77zN8i+9fHXylRNrp89bCnwt87XIV/7LibY89T2lLAAO8TXAVzbi5Yp8zfF1m4PPJQaWQ0LBUaGkDYPiN/m6xsGLVYGNAdJN7UkOPBYbLIdE7N0Q7loNg9LnwsZ1qkI1ZwOSTVwGtx62AstBx4TbJsmQxY+ZxHIqBCjc9ixLpsGtT3LgQmTYhIOqyeuYH3DqPwFVgbs48LLbL9MGMbpZQJlImrOiWpjD8jcMJDAZmVhOlEUzNxZP5iVleWlvqGEX9jWyQ5la1tO8xfnZ62+/2dLaLzbz5hubX/lBDT3M3fmaCewsZcNw9cAOdj7b6PuahQ8/2eXnnx14W/Gb9nBfMtCpjkwgKAxq3z3SzDq48oTxOxEUsxOUip7e02D8+qa6FLt1eKfzlcgGRMdXDst/cZZga7YRo7qicNFTT4psx90VZx28996JV/19I/u3U8buqJeyQ1SfMLJ/Wxno8ccfShIREtTg0hq7xGNVtdO7Gyhhe7mIuRJYIXeO6hN6WraUfH/5xWf2af2v62uvL391wFV31t8f0YZ0Zc9QXh3uqCq4sPrT9/Uzb76XJSxCG9Bhre1NXymqVauzQpVJCxcOGoZFc2muUlCGbW9I235A/WlbqqJJUO1Cdpuvy/e1bi352bO1depb6pWwndRXnn9b2v5d4dnZrea61VbZRhJbNiXc+CVVfVUhHna3lCQqqTgeBICQcVFmdBdHLbbQKzMJ+9dKrLagBdwV6j1oMlB7bVhaDLatGMoNbtyrvsYJKkuPNVgJcPTBqq9bwqXhujZBYbUsBpMwiF+49l4ljudXvttIRtWDVaH1xj9OiwUWaqKx6G6pK2kFAY/m4RlXFupCZdP4ThQsygkaCWzzvLonuLXj2ht9cMaJbWwMgnrpxJQeAGJPGmUTDujBpU+kSpPCym6IascC0FNPi2QqS9h7LOKfHQHqNUNCbEIprCXe86pq4fXd/OH0tdV7PiSUJIrEJmEjTf29QAF1iW/aTW8U8TvVmXGFpmgh5UbgfpSLTHU0lYHixg7m34VSBB5w/NHHsjGN/Ay9zw5peQmbr/QKfa31ztK7JihRaXJBNta7KXgPVI9g9x1YMUguVHIFjEtVQ72kaPvc+mS4d4TZ1Jw6HrhZiaq6a0FRyr5aHwKYDNxdbBl/ylRhQx+/0TfjuLnXxOOUwcW1sgdcQf2eVBOUdOXpsLMlPdZs9NP6RiFkHS9KLr0ojpuWILiv+oSRjJrq0tTz3o15lJrtOzJ1YcrQnDxvUQILdXnNnTYB3ttY41Jrd7E4TJ9EBqg6rNdZXd0iS7C1NxrX20n1FE0ZrIjd8aCrvPpavcH3g1WjMWtBPwnnmdZM+mW5T43Tiut/TBNhl35yxg+W/KhBjIajftNevTFzcWfnXFHS49fFpt1AfWEFcEHNZpsE9JzvFi/IxF/kb2xmUGNYAYxkNZvQGA4EDXRjzaXzIoYLCQMdNgENpayWpXEo42KVIdEPBJ5EjQSruTXiOFsFUDQ9of9fIPKBI5G8RmOCRkkZ9zp1ah1Wg8aplBwxoNyiTVYKSQ6rQENhHFvoZ5WPZwGFhEj2Pz1WYD1iOytWp0fpktPNvGjgrXRt/wQYAORqNODPXZZgAAAAAElFTkSuQmCC';
                        }                        
                    }
                }
                myContacts.push(item);
            }
            const contactsToStorage = {
                list: myContacts,
                timestamp: Date.now()
            };
            localStorage.setItem(storageKey, JSON.stringify(contactsToStorage));
            return myContacts;
        }            
    }

    public static async getContactInfo(enterpriseId: string): Promise<any> {
        const token = await this.getAuthorizationToken();
        const res = await this.context.httpClient.get(`${PORTAL_API}/profile/csc/${enterpriseId}`,
            HttpClient.configurations.v1,
            {
                headers: [
                    ['accept', 'application/json'],
                    ['Authorization', 'Bearer ' + token]
                ]
            });        
        const response = await res.json();        
        const source = response[0]._source;
        return {
            "PeopleKey": source.peoplekey,
            "FirstName": source.firstname,
            "LastName": source.lastname,
            "WorkEmail": source.workemail
        };     
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

