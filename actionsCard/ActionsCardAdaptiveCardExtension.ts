import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { ActionsCardPropertyPane } from './ActionsCardPropertyPane';
import ActionService from '../Services/ActAndNotService';


export interface IActionsCardAdaptiveCardExtensionProps {
  title: string;
  iconProperty: string;
  authMode: string;
}

export interface IActionsCardAdaptiveCardExtensionState {
  actionsCount: number;
  actions: any [];
  image: string;
  loadingImage: string;
  primText: string;
  serviceUnable: boolean;
}

const CARD_VIEW_REGISTRY_ID: string = 'ActionsCard_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'ActionsCard_QUICK_VIEW';

export default class ActionsCardAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IActionsCardAdaptiveCardExtensionProps,
  IActionsCardAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: ActionsCardPropertyPane | undefined;

  public async onInit(): Promise<void> {
    this.state = {
      actionsCount: 0,
      actions: [],
      primText: "",
      image: SITE_URL + "/SiteAssets/ACE/actions.jpg",
      loadingImage: SITE_URL + "/SiteAssets/ACE/loading.gif",
      serviceUnable: false
     };

    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());

    ActionService.initialize(this.context,this.authMode).then(() => {
        ActionService.getAction().then((response) => {
          if(response){
            this.setState({
              primText: response.text,
              actionsCount: response.count,
              actions: response.items,
              loadingImage: this.state.image
            });

          }else{
            this.setState({
              loadingImage: this.state.image,
              primText: "Error, please try again later",
              serviceUnable: true
            });
          }
            
        });
    });



    return Promise.resolve();
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'ActionsCard-property-pane'*/
      './ActionsCardPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.ActionsCardPropertyPane();
        }
      );
  }

  protected renderCard(): string | undefined {
    return CARD_VIEW_REGISTRY_ID;
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return this._deferredPropertyPane.getPropertyPaneConfiguration();
  }

  protected get iconProperty(): string {
      return this.properties.iconProperty || SITE_URL + "/SiteAssets/ACE/actions-icon.svg";
  }

  protected get authMode(): string {
    return this.properties.authMode || "Primary";
}


}
