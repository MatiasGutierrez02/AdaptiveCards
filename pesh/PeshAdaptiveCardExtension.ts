import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { PeshPropertyPane } from './PeshPropertyPane';
import PeshService from '../Services/PeshService';

export interface IPeshAdaptiveCardExtensionProps {
  title: string;
  iconProperty: string;
  authMode: string;
}

export interface IPeshAdaptiveCardExtensionState {
  peshItems: any;
  primText: string;
  isLoading: boolean;
  serviceUnable: boolean;
}

const CARD_VIEW_REGISTRY_ID: string = 'Pesh_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'Pesh_QUICK_VIEW';

export default class PeshAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IPeshAdaptiveCardExtensionProps,
  IPeshAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: PeshPropertyPane | undefined;

  public async onInit(): Promise<void> {
    this.state = {
      peshItems: [],
      primText: "See your Items",
      isLoading: true,
      serviceUnable: false
    };

    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());
    
    await PeshService.initialize(this.context, this.authMode).then(() => {
        PeshService.get().then((response) => {
          if(response){
            this.setState({
              peshItems: response.peshItems,
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
      /* webpackChunkName: 'Pesh-property-pane'*/
      "./PeshPropertyPane"
    ).then((component) => {
      this._deferredPropertyPane = new component.PeshPropertyPane();
    });
  }

  protected renderCard(): string | undefined {
    return CARD_VIEW_REGISTRY_ID;
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return this._deferredPropertyPane.getPropertyPaneConfiguration();
  }

  protected get iconProperty(): string {
    return (
        this.properties.iconProperty || SITE_URL + "/SiteAssets/ACE/pesh-icon.svg"
    );
  }
  protected get authMode(): string {
    return this.properties.authMode || "Primary";
  }
}
