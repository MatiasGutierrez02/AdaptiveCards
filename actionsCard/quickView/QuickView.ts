import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'ActionsCardAdaptiveCardExtensionStrings';
import { IActionsCardAdaptiveCardExtensionProps, IActionsCardAdaptiveCardExtensionState } from '../ActionsCardAdaptiveCardExtension';
import MarkAsRead from '../../Services/ActAndNotService';


export interface IQuickViewData {
  subTitle: string;
  title: string;
  actions: any [];
  displayMessage: boolean;
}

export class QuickView extends BaseAdaptiveCardView<
  IActionsCardAdaptiveCardExtensionProps,
  IActionsCardAdaptiveCardExtensionState,
  IQuickViewData
> {
  public get data(): IQuickViewData {
    return {
      subTitle: strings.SubTitle,
      title: strings.Title,
      actions: this.state.actions,
      displayMessage: this.state.actionsCount > 0 ? false : true
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/QuickViewTemplate.json');
  }

  public async onAction(action: IActionArguments | any): Promise<void> {
    await MarkAsRead.initialize(this.context);
    MarkAsRead.markAsRead(action.data.TransactionID.toString());

    let actCount = this.state.actionsCount;
    actCount--;

    const items = this.state.actions.filter(item => item.TransactionID !== action.data.TransactionID);
    this.setState({
        actionsCount: actCount,
        actions: items
    });
  }
}