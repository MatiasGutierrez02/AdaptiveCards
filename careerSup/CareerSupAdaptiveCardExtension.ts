import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { CareerSupPropertyPane } from './CareerSupPropertyPane';
import CareerSupContactsService from '../Services/CareerSupContactsService';

export interface ICareerSupAdaptiveCardExtensionProps {
  title: string;
  iconProperty: string;
  authMode: string;
}

export interface ICareerSupAdaptiveCardExtensionState {
  myContacts: any[];
  serviceUnable: boolean;
  primText: string;
  isLoading: boolean;
}

const CARD_VIEW_REGISTRY_ID: string = 'CareerSup_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'CareerSup_QUICK_VIEW';

export default class CareerSupAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  ICareerSupAdaptiveCardExtensionProps,
  ICareerSupAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: CareerSupPropertyPane | undefined;

    public async onInit(): Promise<void> {
        this.state = {
            myContacts: [],
            serviceUnable: false,
            isLoading: true,
            primText: "See my careers support",
        };
        this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
        this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());

       await  CareerSupContactsService.initialize(this.context, this.authMode).then(() => {
            CareerSupContactsService.getContacts().then((contacts) => {
                this.setState({
                    myContacts: contacts,
                    isLoading: false
                });
            });
        });


    return Promise.resolve();
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'CareerSup-property-pane'*/
      './CareerSupPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.CareerSupPropertyPane();
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
      return this.properties.iconProperty || SITE_URL + "/SiteAssets/ACE/career-icon.svg";
  }
  
  protected get authMode(): string {
    return this.properties.authMode || "Primary";
}

}
