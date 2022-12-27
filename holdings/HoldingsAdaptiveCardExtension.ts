import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { HoldingsPropertyPane } from './HoldingsPropertyPane';
import HoldingsService from '../Services/HoldingsService';

export interface IHoldingsAdaptiveCardExtensionProps {
  title: string;
  description: string;
  iconProperty: string;
  authMode: string;
}

export interface IHoldingsAdaptiveCardExtensionState {
  description: string;
  change: any;
  timeStamp: string;
  lastPrice: number;
  shares: number;
  sharesValue: number;
  time: string;
  isLoading: boolean;
  primText: string;
  serviceUnable: boolean;
}

const CARD_VIEW_REGISTRY_ID: string = 'Holdings_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'Holdings_QUICK_VIEW';


export default class HoldingsAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IHoldingsAdaptiveCardExtensionProps,
  IHoldingsAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: HoldingsPropertyPane | undefined;

  public onInit(): Promise<void> {
    this.state = {
      description: this.properties.description,
      change: 0,
      timeStamp: "",
      lastPrice: 0,
      shares: 0,
      sharesValue: 0,
      time: "",
      isLoading: true,
      serviceUnable: false,
      primText: "See my shares"
     };

    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());

    HoldingsService.initialize(this.context, this.authMode).then(() => {
        HoldingsService.getMarketQuote().then((response) => {
          if(response){
            this.setState({
              change: response.change,
              lastPrice: response.lastPrice,
              timeStamp: response.timeStamp,
              time: response.time,
              shares: response.shares,
              sharesValue: response.sharesValue,
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

  public get title(): string {
    return this.properties.title;
  }

  protected get iconProperty(): string {
      return this.properties.iconProperty || SITE_URL + "/SiteAssets/ACE/holdings-icon.svg";
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'Holdings-property-pane'*/
      './HoldingsPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.HoldingsPropertyPane();
        }
      );
  }

  protected renderCard(): string | undefined {
    return CARD_VIEW_REGISTRY_ID;
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return this._deferredPropertyPane.getPropertyPaneConfiguration();
  }

  protected get authMode(): string {
    return this.properties.authMode || "Primary";
}
}