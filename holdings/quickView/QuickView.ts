import { ISPFxAdaptiveCard, BaseAdaptiveCardView } from '@microsoft/sp-adaptive-card-extension-base';
import { IHoldingsAdaptiveCardExtensionProps, IHoldingsAdaptiveCardExtensionState } from '../HoldingsAdaptiveCardExtension';
import TrackingService from '../../Services/TrackingService';

export interface IQuickViewData {
  lastPrice: number;
  change: number;
  symbol: string;
  timestamp: string;
  shares: string;
  sharesValue: string;
  isLoading: boolean;
}

export class QuickView extends BaseAdaptiveCardView<
  IHoldingsAdaptiveCardExtensionProps,
  IHoldingsAdaptiveCardExtensionState,
  IQuickViewData
> {
  public get data(): IQuickViewData {
    /*
    *  Llamado a tracking
    */
    TrackingService.initialize(this.context);
    TrackingService.Track("click", "Dashboard", "My Holdings Card", "My Holdings ACE Load");
    return {
      lastPrice: this.state.lastPrice,
      change: this.state.change,
      symbol: 'ACN',
      timestamp: this.state.timeStamp,
      shares: this.state.shares.toString(),
      sharesValue: this.state.sharesValue.toString(),
      isLoading: this.state.isLoading
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/QuickViewTemplate.json');
  }
}