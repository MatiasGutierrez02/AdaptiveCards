import { ISPFxAdaptiveCard, BaseAdaptiveCardView } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'PeshAdaptiveCardExtensionStrings';
import { IPeshAdaptiveCardExtensionProps, IPeshAdaptiveCardExtensionState } from '../PeshAdaptiveCardExtension';
//
import TrackingService from '../../Services/TrackingService';

export interface IQuickViewData {
  subTitle: string;
  title: string;
  peshItems: any;
  isLoading: boolean;
}

export class QuickView extends BaseAdaptiveCardView<
  IPeshAdaptiveCardExtensionProps,
  IPeshAdaptiveCardExtensionState,
  IQuickViewData
> {
  public get data(): IQuickViewData {
    TrackingService.initialize(this.context);
    TrackingService.Track("click", "Dashboard", "Pesh Card", "Pesh ACE Load");
    return {
      subTitle: strings.SubTitle,
      title: strings.Title,
      peshItems: this.state.peshItems,
      isLoading: this.state.isLoading
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/QuickViewTemplate.json');
  }
}