import {
  BaseImageCardView,
  IImageCardParameters,
  IExternalLinkCardAction,
  IQuickViewCardAction,
  ICardButton
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'CareerSupAdaptiveCardExtensionStrings';
import { ICareerSupAdaptiveCardExtensionProps, ICareerSupAdaptiveCardExtensionState, QUICK_VIEW_REGISTRY_ID } from '../CareerSupAdaptiveCardExtension';

export class CardView extends BaseImageCardView<ICareerSupAdaptiveCardExtensionProps, ICareerSupAdaptiveCardExtensionState> {
  /**
   * Buttons will not be visible if card size is 'Medium' with Image Card View.
   * It will support up to two buttons for 'Large' card size.
   */
  public get cardButtons(): [ICardButton] | [ICardButton, ICardButton] | undefined {
    return [
      {
        title: strings.QuickViewButton,
        action: {
          type: 'QuickView',
          parameters: {
            view: QUICK_VIEW_REGISTRY_ID
          }
        }
      }
    ];
  }

  public get data(): IImageCardParameters {
    return {
      primaryText: this.state.primText,
        imageUrl: SITE_URL + "/SiteAssets/ACE/career.jpg",
      title: "Career Support"
    };
  }

  public get onCardSelection(): IQuickViewCardAction | IExternalLinkCardAction | undefined {
    if(!this.state.serviceUnable){
      return {
        type: 'QuickView',
        parameters: {
          view: QUICK_VIEW_REGISTRY_ID
        }
      };
    }
  }
}
