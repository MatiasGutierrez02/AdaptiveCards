declare interface IMyPasswordAdaptiveCardExtensionStrings {
  PropertyPaneDescription: string;
  TitleFieldLabel: string;
  Title: string;
  SubTitle: string;
  PrimaryText: string;
  Description: string;
  QuickViewButton: string;
  AuthMode: AuthMode;
}

declare module 'MyPasswordAdaptiveCardExtensionStrings' {
  const strings: IMyPasswordAdaptiveCardExtensionStrings;
  export = strings;
}
