import { ISPFxAdaptiveCard, BaseAdaptiveCardView } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'CareerSupAdaptiveCardExtensionStrings';
import { ICareerSupAdaptiveCardExtensionProps, ICareerSupAdaptiveCardExtensionState } from '../CareerSupAdaptiveCardExtension';
//
import TrackingService from '../../Services/TrackingService';

export interface IQuickViewData {
  subTitle: string;
  title: string;
  myContacts: any[];
  isLoading: boolean;
}

export class QuickView extends BaseAdaptiveCardView<
  ICareerSupAdaptiveCardExtensionProps,
  ICareerSupAdaptiveCardExtensionState,
  IQuickViewData
> {
  public get data(): IQuickViewData {
    TrackingService.initialize(this.context);
    TrackingService.Track("click", "Dashboard", "Carrer Support Card", "Carrer Support ACE Load");
    return {
      subTitle: strings.SubTitle,
      title: strings.Title,
      myContacts: this.state.myContacts,
      isLoading: this.state.isLoading
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/QuickViewTemplate.json');
  }
}