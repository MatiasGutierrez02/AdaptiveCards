import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { DashboardPropertyPane } from './DashboardPropertyPane';
import ProfileService from '../Services/ProfileService';
//
import TrackingService from '../Services/TrackingService';
import { location } from '@microsoft/teams-js';
import { UrlString } from '@azure/msal-browser';

export interface IDashboardAdaptiveCardExtensionProps {
  title: string;
  iconProperty: string;
  authMode: string;
}

export interface IDashboardAdaptiveCardExtensionState {
  image: string;
  loadingImage: string;
  welcomeMessage: string;
  serviceUnable: boolean;
}

const CARD_VIEW_REGISTRY_ID: string = 'Dashboard_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'Dashboard_QUICK_VIEW';

export default class DashboardAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IDashboardAdaptiveCardExtensionProps,
  IDashboardAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: DashboardPropertyPane | undefined;

  public async onInit(): Promise<void> {
    this.state = {
      image: SITE_URL + "/SiteAssets/ACE/dashboard.png",
      loadingImage: SITE_URL + "/SiteAssets/ACE/loading.gif",
      welcomeMessage: "",
      serviceUnable: true
    };
    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());
    this.isVisible = true;
    await ProfileService.initialize(this.context, this.authMode);
    ProfileService.get().then((response) => {
      if(response){
        this.setState({
          welcomeMessage: "Welcome back " + response.displayname + "! ",
          serviceUnable: false,
          loadingImage: this.state.image
        });

      }else{
        this.setState({
          welcomeMessage: "Error, please try again later",
          loadingImage: this.state.image
        })
      }

      if(window.location.href.indexOf("SitePages/Dashboard.aspx") > 0){
        this.isVisible = false; //card is hidden when in the dashboard
      }

    });

    await TrackingService.initialize(this.context, this.authMode);
    TrackingService.Track("Login", "Dashboard", "Dashboard Card", "My Dashboard Card ACE");
    
    return Promise.resolve();
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'Dashboard-property-pane'*/
      './DashboardPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.DashboardPropertyPane();
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
      return this.properties.iconProperty || SITE_URL + "/SiteAssets/ACE/dashboard-icon.svg";
  }

  protected get authMode(): string {
        return this.properties.authMode || "Primary";
    }
}
