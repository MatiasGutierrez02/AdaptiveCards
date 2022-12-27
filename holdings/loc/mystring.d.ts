declare interface IHoldingsAdaptiveCardExtensionStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  TitleFieldLabel: string;
  IconPropertyFieldLabel: string;
  Title: string;
  SubTitle: string;
  Description: string;
  PrimaryText: string;
  QuickViewButton: string;
  AuthMode: AuthMode;

}

declare module 'HoldingsAdaptiveCardExtensionStrings' {
  const strings: IHoldingsAdaptiveCardExtensionStrings;
  export = strings;
}
