import { ISPFxAdaptiveCard, BaseAdaptiveCardView } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'EthicsAndTicketsAdaptiveCardExtensionStrings';
import { IEthicsAndTicketsAdaptiveCardExtensionProps, IEthicsAndTicketsAdaptiveCardExtensionState } from '../EthicsAndTicketsAdaptiveCardExtension';
//
import TrackingService from '../../Services/TrackingService';
export interface IQuickViewData {
  subTitle: string;
  title: string;
  requireAttention: string;
  openTickets: string;
  trainingsToComplete:string;
  isLoading: boolean;
}

export class QuickView extends BaseAdaptiveCardView<
  IEthicsAndTicketsAdaptiveCardExtensionProps,
  IEthicsAndTicketsAdaptiveCardExtensionState,
  IQuickViewData
> {
  public get data(): IQuickViewData {
    TrackingService.initialize(this.context);
    TrackingService.Track("click", "Dashboard", "Tickets & Training Card", "Tickets & Training ACE Load");
    return {
      subTitle: strings.SubTitle,
      title: strings.Title,
      requireAttention: this.state.requireAttention,
      openTickets: this.state.ticketsOpen,
      trainingsToComplete: this.state.trainingsToComplete,
      isLoading: this.state.isLoading
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/QuickViewTemplate.json');
  }
}