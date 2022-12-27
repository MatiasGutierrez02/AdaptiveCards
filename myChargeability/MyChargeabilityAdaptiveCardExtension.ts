import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { MyChargeabilityPropertyPane } from './MyChargeabilityPropertyPane';
import PTOService from '../Services/PTOService';

export interface IMyChargeabilityAdaptiveCardExtensionProps {
  title: string;
  iconProperty: string;  
  authMode: string
}

export interface IMyChargeabilityAdaptiveCardExtensionState {
  title:string;
  chargeabilityBalance: string;
  image: string;
  loadingImage: string;
  primText: string;
}

const CARD_VIEW_REGISTRY_ID: string = 'MyChargeability_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'MyChargeability_QUICK_VIEW';

export default class MyChargeabilityAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IMyChargeabilityAdaptiveCardExtensionProps,
  IMyChargeabilityAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: MyChargeabilityPropertyPane | undefined;

  public async onInit(): Promise<void> {
    this.state = {
      title: "Chargeability",
      chargeabilityBalance: "0",
      primText: "",
        image: SITE_URL + "/SiteAssets/ACE/chargeability.png",
        loadingImage: SITE_URL + "/SiteAssets/ACE/loading.gif"
    };

    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());

    await PTOService.initialize(this.context, this.authMode).then(() => {
        PTOService.get(null).then((response) => {
            this.setState({
                loadingImage: this.state.image,
                primText: response ? response.chargeability : "Error, please try again later"
            });
        });
    });

    return Promise.resolve();
  }



  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'MyChargeability-property-pane'*/
      './MyChargeabilityPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.MyChargeabilityPropertyPane();
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
      return this.properties.iconProperty || SITE_URL + "/SiteAssets/ACE/chargeability-icon.svg";
  }

  protected get authMode(): string {
    return this.properties.authMode || "Primary";
}
}
