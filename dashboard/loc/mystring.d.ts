declare interface IDashboardAdaptiveCardExtensionStrings {
  PropertyPaneDescription: string;
  TitleFieldLabel: string;
  Title: string;
  SubTitle: string;
  PrimaryText: string;
  Description: string;
  QuickViewButton: string;
  AuthMode: AuthMode;
}

declare module 'DashboardAdaptiveCardExtensionStrings' {
  const strings: IDashboardAdaptiveCardExtensionStrings;
  export = strings;
}
