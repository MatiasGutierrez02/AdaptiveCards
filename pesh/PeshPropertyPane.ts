import { IPropertyPaneConfiguration, PropertyPaneChoiceGroup, PropertyPaneTextField } from '@microsoft/sp-property-pane';
import * as strings from 'PeshAdaptiveCardExtensionStrings';
import { AuthMode } from "../Auth/AuthMode";
export class PeshPropertyPane {
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
