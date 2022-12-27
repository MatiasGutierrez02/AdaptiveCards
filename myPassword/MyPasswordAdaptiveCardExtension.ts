import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { MyPasswordPropertyPane } from './MyPasswordPropertyPane';
import PswExpService from '../Services/PswdExpService';

export interface IMyPasswordAdaptiveCardExtensionProps {
  title: string;
  iconProperty: string;  
  authMode: string;
}

export interface IMyPasswordAdaptiveCardExtensionState {
  image: string;
  loadingImage: string;
  primText: string;
}

const CARD_VIEW_REGISTRY_ID: string = 'MyPassword_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'MyPassword_QUICK_VIEW';

export default class MyPasswordAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IMyPasswordAdaptiveCardExtensionProps,
  IMyPasswordAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: MyPasswordPropertyPane | undefined;

  public async onInit(): Promise<void> {

    this.state = {
      primText: "",
        image: SITE_URL + "/SiteAssets/ACE/password.png",
        loadingImage: SITE_URL + "/SiteAssets/ACE/loading.gif"
     };

    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());

    await PswExpService.initialize(this.context,this.authMode ).then(() => {
        PswExpService.get().then((expiresInDays) => {
            this.setState({
                loadingImage: this.state.image,
                primText: expiresInDays >= 0 ? "Expires in " + expiresInDays + " days." : "Error, please try again later"
            });
        });
    });
    return Promise.resolve();        
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'MyPassword-property-pane'*/
      './MyPasswordPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.MyPasswordPropertyPane();
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
      return this.properties.iconProperty || SITE_URL + "/SiteAssets/ACE/password-icon.svg";
  }  

  protected get authMode(): string {
    return this.properties.authMode || "Primary";
}

}
