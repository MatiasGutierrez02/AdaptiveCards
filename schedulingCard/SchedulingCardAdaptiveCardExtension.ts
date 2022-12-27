import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { SchedulingCardPropertyPane } from './SchedulingCardPropertyPane';
import SchedulingService from '../Services/SchedulingService';

export interface ISchedulingCardAdaptiveCardExtensionProps {
  title: string;
  iconProperty: string;
  authMode: string;
}

export interface ISchedulingCardAdaptiveCardExtensionState {
  projectClient: string;
  projectName: string;
  rollOffDate: string;
  firstAvailableDate: string;
  isLoading: boolean;
  serviceUnable: boolean;
  primText: string;
}

const CARD_VIEW_REGISTRY_ID: string = 'SchedulingCard_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'SchedulingCard_QUICK_VIEW';

export default class SchedulingCardAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  ISchedulingCardAdaptiveCardExtensionProps,
  ISchedulingCardAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: SchedulingCardPropertyPane | undefined;

  public async onInit(): Promise<void> {
    this.state = {
      projectClient: "",
      projectName: "",
      rollOffDate: "",
      firstAvailableDate: "",
      isLoading: true,
      serviceUnable: false,
      primText: "My calendar"
     };

    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());

    await SchedulingService.initialize(this.context, this.authMode).then(() => {
      SchedulingService.get().then((response) => {
        if(response){
          this.setState({
            projectClient: response.projectClient,
            projectName: response.projectName,
            rollOffDate: response.rollOffDate,
            firstAvailableDate: response.firstAvailableDate,
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

  protected get iconProperty(): string {
      return this.properties.iconProperty || SITE_URL + "/SiteAssets/ACE/scheduling-icon.svg";
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'SchedulingCard-property-pane'*/
      './SchedulingCardPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.SchedulingCardPropertyPane();
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
