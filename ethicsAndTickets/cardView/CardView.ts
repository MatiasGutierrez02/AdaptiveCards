import {
  BaseImageCardView,
  IImageCardParameters,
  IExternalLinkCardAction,
  IQuickViewCardAction,
  ICardButton
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'EthicsAndTicketsAdaptiveCardExtensionStrings';
import { IEthicsAndTicketsAdaptiveCardExtensionProps, IEthicsAndTicketsAdaptiveCardExtensionState, QUICK_VIEW_REGISTRY_ID } from '../EthicsAndTicketsAdaptiveCardExtension';

export class CardView extends BaseImageCardView<IEthicsAndTicketsAdaptiveCardExtensionProps, IEthicsAndTicketsAdaptiveCardExtensionState> {
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
        imageUrl: SITE_URL + "/SiteAssets/ACE/ethics.png",
      title: "Follow up",
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
