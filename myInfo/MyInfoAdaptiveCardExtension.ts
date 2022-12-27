import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { MyInfoPropertyPane } from './MyInfoPropertyPane';
import ProfileService from '../Services/ProfileService';
import PTOService from '../Services/PTOService';
import ProfilePictureService from '../Services/ProfilePictureService';
import PswdExpService from '../Services/PswdExpService';


export interface IMyInfoAdaptiveCardExtensionProps {
  title: string;
  description: string;
  iconProperty: string;
  authMode: string;
}

export interface IMyInfoAdaptiveCardExtensionState {
  description: string;
  vacationBalance: number;
  asOfDate: string;
  passwordDays: string;
  profilePicture: string;
  chargeability: string;
  countryHome: string;
  displayName: string;
  standardJobDescr: string;
  personnelNumber: string;
  isLoading: boolean;
  primText: string;
  serviceUnable: boolean;
}

const CARD_VIEW_REGISTRY_ID = 'MyInfo_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID = 'MyInfo_QUICK_VIEW';

export default class MyInfoAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IMyInfoAdaptiveCardExtensionProps,
  IMyInfoAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: MyInfoPropertyPane | undefined;

  public async onInit(): Promise<void> {
    this.state = {
      description: this.properties.description,
      vacationBalance: 0,
      asOfDate: "",
      passwordDays: "",
      profilePicture: "",
      chargeability: "",
      countryHome: "",
      displayName: "",
      standardJobDescr: "",
      personnelNumber: "",
      isLoading: true,
      serviceUnable: false,
      primText: "About me"
    };

    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());

    await ProfileService.initialize(this.context, this.authMode);
    await PTOService.initialize(this.context , this.authMode);
    await ProfilePictureService.initialize(this.context , this.authMode);
    await PswdExpService.initialize(this.context , this.authMode);

    ProfileService.get().then((profile) => {
      if(profile){
        const ptoPromise = PTOService.get(profile.countryhome);
        const picturePromise = ProfilePictureService.get(profile.peoplekey);
        const pswdPromise = PswdExpService.get();
        Promise.all([ptoPromise, picturePromise, pswdPromise]).then((results) => {
          this.setState({
            countryHome: profile.countryhome,
            displayName: profile.displayname,
            personnelNumber: profile.personnelnumber,
            standardJobDescr: profile.standardjobdescr,
            vacationBalance: results[0] ? results[0].vacationBalance : "",
            asOfDate: results[0] ? results[0].asOfDate : "-/-/-",
            chargeability: results[0] ? results[0].chargeability : "",
            profilePicture: results[1] ? results[1] : "",
            passwordDays: results[2] ? results[2] + " days." : "-",
            isLoading: false
          });
        });

      }else{
        this.setState({
          primText: "Error, please try again later",
          isLoading: false,
          serviceUnable: true
        });
      }
    });
        
        

      
    
    return Promise.resolve();
  }

  public get title(): string {
    return this.properties.title;
  }

  protected get iconProperty(): string {
      return this.properties.iconProperty || SITE_URL + "/SiteAssets/ACE/myInfo-icon.svg";
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'MyInfo-property-pane'*/
      './MyInfoPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.MyInfoPropertyPane();
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
