import {
  BaseImageCardView,
  IImageCardParameters,
  ICardButton
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'MyPasswordAdaptiveCardExtensionStrings';
import { IMyPasswordAdaptiveCardExtensionProps, IMyPasswordAdaptiveCardExtensionState, QUICK_VIEW_REGISTRY_ID } from '../MyPasswordAdaptiveCardExtension';

export class CardView extends BaseImageCardView<IMyPasswordAdaptiveCardExtensionProps, IMyPasswordAdaptiveCardExtensionState> {
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
      title: "My Password",
      primaryText: this.state.primText,      
      imageUrl: this.state.loadingImage,
    };      
  }

  // public get onCardSelection(): IQuickViewCardAction | IExternalLinkCardAction | undefined {
  //   return {
  //     type: 'QuickView',
  //     parameters: {
  //       view: QUICK_VIEW_REGISTRY_ID
  //     }
  //   };
  // }
}
