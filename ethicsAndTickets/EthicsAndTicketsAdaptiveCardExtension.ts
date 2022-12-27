import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { EthicsAndTicketsPropertyPane } from './EthicsAndTicketsPropertyPane';
import EthicsAndTicketsService from '../Services/EthicsAndTicketsService';

export interface IEthicsAndTicketsAdaptiveCardExtensionProps {
  title: string;
  ticketsOpen: string;
  requireAttention: string;
  iconProperty: string;  
  authMode: string;
}

export interface IEthicsAndTicketsAdaptiveCardExtensionState {
  ticketsOpen: string;
  requireAttention: string;
  trainingsToComplete: string;
  isLoading: boolean;
  serviceUnable:boolean;
  primText: string;
}

const CARD_VIEW_REGISTRY_ID: string = 'EthicsAndTickets_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'EthicsAndTickets_QUICK_VIEW';

export default class EthicsAndTicketsAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IEthicsAndTicketsAdaptiveCardExtensionProps,
  IEthicsAndTicketsAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: EthicsAndTicketsPropertyPane | undefined;

  public onInit(): Promise<void> {
    this.state = {
      ticketsOpen: "",
      requireAttention: "",
      trainingsToComplete: "0",
      isLoading: true,
      serviceUnable: false,
      primText: "Tickets & Trainings"
    };

    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());

    EthicsAndTicketsService.initialize(this.context , this.authMode).then(() => {
        EthicsAndTicketsService.getTickets().then((response) => {
          if(response){
            this.setState({
              ticketsOpen: response.openTickets,
              requireAttention: response.requireAttentionTickets,
              isLoading: false
            });

          }else{
            this.setState({
              primText: "Error, please try again later",
              isLoading: false,
              serviceUnable: true
            })
          }
            
        });
    });

    return Promise.resolve();
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'EthicsAndTickets-property-pane'*/
      './EthicsAndTicketsPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.EthicsAndTicketsPropertyPane();
        }
      );
  }

  /*
  // Disabled for the moment

  public async getTokenMyLearning(): Promise<any> {
    let self = this;
    return new Promise((resolve, reject) =>{
      if(self.state.tokenMyLearning != "")
        resolve(self.state.tokenMyLearning);
      else {
        self.context.spHttpClient.get(config.SP_SITE() + 
          "/_api/lists/GetByTitle('TokenCache')/items?$select=AccessToken&$filter=Title%20eq%20%27" + "myLearning" + "%27", SPHttpClient.configurations.v1)
          .then((response) => {
            response.json().then((responseJSON) => {
              if(responseJSON.value.length) {
                
                self.setState({
                  tokenMyLearning: responseJSON.value[0].AccessToken
                });   
                resolve(responseJSON.value[0].AccessToken);
              }
            });
          });
      }
    });
  }

  // Disabled for the moment

  public async getEthicsAndCompliance(tokenMyLearning: string): Promise<any> {
    const STORAGE_LIFETIME = 24 * 60 * 60 * 1000;
    let self = this;
    let trainings;
    let email = this.state.userEmail;
    let storageKey = 'profile:trainings:' + email;
    let storedAllTrainings = localStorage.getItem(storageKey);
    let allTrainings;


    if (null !== storedAllTrainings && '' !== storedAllTrainings) {
      allTrainings = JSON.parse(storedAllTrainings);
      trainings = allTrainings.trainingsStoraged;
  
      self.setState({
        trainingsToComplete: trainings,
      });
      
    }else if (null == allTrainings || allTrainings.timestamp + STORAGE_LIFETIME < Date.now()) {
      return new Promise((resolve, reject) =>{
        const params = {token :tokenMyLearning};
        const httpClientOptions: IHttpClientOptions = {
          body: JSON.stringify(params), headers:[
            ['accept', 'application/json'],
            ['Authorization', 'Bearer ' + self.state.token]
          ]
        };
        return self.context.httpClient
          .post(`${PORTAL_API}/ethicscompliance/mylearning`, HttpClient.configurations.v1, httpClientOptions)
            
          .then((res: HttpClientResponse): Promise<any> => {
            return res.json();
          })
          .then((response: any): void => {
            trainings = response.Content;
            self.setState({
              trainingsToComplete: trainings,
            }); 

            let allTrainingsToStorage = {
              trainingsStoraged: trainings,
              userEmail : email,
              timestamp: Date.now()
            };
            localStorage.setItem(storageKey, JSON.stringify(allTrainingsToStorage));
            resolve(response);   

        });
      }); 
    }
  }
  */

  protected renderCard(): string | undefined {
    return CARD_VIEW_REGISTRY_ID;
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return this._deferredPropertyPane.getPropertyPaneConfiguration();
  }

  protected get iconProperty(): string {
      return this.properties.iconProperty || SITE_URL + "/SiteAssets/ACE/ethics-icon.svg";
  }
  protected get authMode(): string {
    return this.properties.authMode || "Primary";
}
  
}
