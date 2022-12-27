import { IPropertyPaneConfiguration, PropertyPaneTextField, PropertyPaneChoiceGroup } from '@microsoft/sp-property-pane';
import { AuthMode } from "../Auth/AuthMode";
import * as strings from 'CareerSupAdaptiveCardExtensionStrings';

export class CareerSupPropertyPane {
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
