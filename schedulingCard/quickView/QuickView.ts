import { ISPFxAdaptiveCard, BaseAdaptiveCardView } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'SchedulingCardAdaptiveCardExtensionStrings';
import { ISchedulingCardAdaptiveCardExtensionProps, ISchedulingCardAdaptiveCardExtensionState } from '../SchedulingCardAdaptiveCardExtension';
//
import TrackingService from '../../Services/TrackingService';

export interface IQuickViewData {
  subTitle: string;
  title: string;
  projectClient: string;
  projectName: string;
  rollOffDate: string;
  firstAvailableDate: string;
  isLoading: boolean;
}

export class QuickView extends BaseAdaptiveCardView<
  ISchedulingCardAdaptiveCardExtensionProps,
  ISchedulingCardAdaptiveCardExtensionState,
  IQuickViewData
> {
  public get data(): IQuickViewData {
    TrackingService.initialize(this.context);
    TrackingService.Track("click", "Dashboard", "Scheduling Card", "Scheduling ACE Load");
    return {
      subTitle: strings.SubTitle,
      title: strings.Title,
      projectClient: this.state.projectClient,
      projectName: this.state.projectName,
      rollOffDate: this.state.rollOffDate,
      firstAvailableDate: this.state.firstAvailableDate,
      isLoading: this.state.isLoading
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/QuickViewTemplate.json');
  }
}