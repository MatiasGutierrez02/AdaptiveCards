import { ISPFxAdaptiveCard, BaseAdaptiveCardView } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'MyInfoAdaptiveCardExtensionStrings';
import { IMyInfoAdaptiveCardExtensionProps, IMyInfoAdaptiveCardExtensionState } from '../MyInfoAdaptiveCardExtension';
//
import TrackingService from '../../Services/TrackingService';

export interface IQuickViewData {
  subTitle: string;
  title: string;
  description: string;
  profilePicture: string;
  passwordDays: string;
  chargeability: string;
  asOfDate: string;
  vacationBalance: string;
  displayName: string;
  personnelNumber: string;
  standardJobDescr: string;
  isLoading: boolean;
}

export class QuickView extends BaseAdaptiveCardView<
  IMyInfoAdaptiveCardExtensionProps,
  IMyInfoAdaptiveCardExtensionState,
  IQuickViewData
> {
  public get data(): IQuickViewData {
    TrackingService.initialize(this.context);
    TrackingService.Track("click", "Dashboard", "MyInfo Card", "MyInfo Quickview ACE Load");

    // console.log("this MyInfo QView: ", this);
    // setTimeout(function () {
    //   var el = document.getElementsByClassName("ac-pushButton")[0];
    //   var lala = document.getElementsByClassName("ac-pushButton")[0]["ariaLabel"];
    //   console.log("lala: ", lala);
    //   el.addEventListener("click", function (e: Event) {
    //     /*
    //      *  Llamado a tracking
    //      */
    //     TrackingService.Track(e.type, "Dashboard", "Update", "Update Password Button");
    //   });
    // }, 300);
    // debugger;

    return {
      subTitle: strings.SubTitle,
      title: strings.Title,
      description: this.properties.description,
      profilePicture: this.state.profilePicture,
      passwordDays: this.state.passwordDays,
      chargeability: this.state.chargeability,
      vacationBalance: this.state.vacationBalance.toString(),
      asOfDate: this.state.asOfDate,
      displayName: this.state.displayName,
      personnelNumber: this.state.personnelNumber,
      standardJobDescr: this.state.standardJobDescr,
      isLoading: this.state.isLoading
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/QuickViewTemplate.json');
  }
}