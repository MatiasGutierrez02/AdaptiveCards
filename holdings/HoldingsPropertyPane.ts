import { IPropertyPaneConfiguration, PropertyPaneTextField, PropertyPaneChoiceGroup } from '@microsoft/sp-property-pane';
import { AuthMode } from "../Auth/AuthMode";
import * as strings from 'HoldingsAdaptiveCardExtensionStrings';

export class HoldingsPropertyPane {
  public getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: { description: strings.PropertyPaneDescription },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('title', {
                  label: strings.TitleFieldLabel
                }),
                PropertyPaneTextField('iconProperty', {
                  label: strings.IconPropertyFieldLabel
                }),
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel,
                  multiline: true
                })
              ]
            },
            {
              groupFields: [
                PropertyPaneChoiceGroup('authMode', {
                    label: strings.AuthMode,
                    options: [
                        { key: AuthMode.Primary, text: "Primary" },
                        { key: AuthMode.Secondary, text: "Secondary" },
                    ]
                })
              ]
        }
          ]
        }
      ]
    };
  }
}
