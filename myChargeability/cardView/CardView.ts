import {
  BaseImageCardView,
  IImageCardParameters,
  ICardButton
} from '@microsoft/sp-adaptive-card-extension-base';
import { IMyChargeabilityAdaptiveCardExtensionProps, IMyChargeabilityAdaptiveCardExtensionState } from '../MyChargeabilityAdaptiveCardExtension';


export class CardView extends BaseImageCardView<IMyChargeabilityAdaptiveCardExtensionProps, IMyChargeabilityAdaptiveCardExtensionState> {
  /**
   * Buttons will not be visible if card size is 'Medium' with Image Card View.
   * It will support up to two buttons for 'Large' card size.
   */
   public get cardButtons(): [ICardButton] | [ICardButton, ICardButton] | undefined {
       return;
  }

  public get data(): IImageCardParameters {
    return {
      primaryText: this.state.primText,
      imageUrl: this.state.loadingImage,
      title:  this.state.title
    };
    }

}
