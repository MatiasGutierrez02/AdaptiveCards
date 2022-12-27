import {
  BaseImageCardView,
  IImageCardParameters,
  ICardButton
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'DashboardAdaptiveCardExtensionStrings';
import { IDashboardAdaptiveCardExtensionProps, IDashboardAdaptiveCardExtensionState } from '../DashboardAdaptiveCardExtension';

export class CardView extends BaseImageCardView<IDashboardAdaptiveCardExtensionProps, IDashboardAdaptiveCardExtensionState> {
  /**
   * Buttons will not be visible if card size is 'Medium' with Image Card View.
   * It will support up to two buttons for 'Large' card size.
   */
  public get cardButtons(): [ICardButton] | [ICardButton, ICardButton] | undefined {
    if(!this.state.serviceUnable){
      return [
        {
          title: strings.QuickViewButton,
          action: {
            type: 'ExternalLink',
         parameters: {
          target: SITE_URL + '/SitePages/Dashboard.aspx'
            }
          }
        }
      ];
    }
    
  }

  public get data(): IImageCardParameters {
    return {
      primaryText: this.state.welcomeMessage ,
      imageUrl: this.state.loadingImage,
      title: "Viva Connections"
    };
  }

}
