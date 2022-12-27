import { IPropertyPaneConfiguration, PropertyPaneTextField, PropertyPaneChoiceGroup } from '@microsoft/sp-property-pane';
import { AuthMode } from "../Auth/AuthMode";
import * as strings from 'MyPasswordAdaptiveCardExtensionStrings';

export class MyPasswordPropertyPane {
  public getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: { description: strings.PropertyPaneDescription },
          groups: [
            {
              groupFields: [
                PropertyPaneTextField('title', {
                  label: strings.TitleFieldLabel
                }),
                PropertyPaneTextField('days', {
                  label: strings.TitleFieldLabel,
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