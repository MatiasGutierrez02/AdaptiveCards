declare interface IPeshAdaptiveCardExtensionStrings {
  PropertyPaneDescription: string;
  TitleFieldLabel: string;
  Title: string;
  SubTitle: string;
  PrimaryText: string;
  Description: string;
  QuickViewButton: string;
  AuthMode: AuthMode;
}

declare module 'PeshAdaptiveCardExtensionStrings' {
  const strings: IPeshAdaptiveCardExtensionStrings;
  export = strings;
}
