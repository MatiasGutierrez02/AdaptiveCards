declare interface IMyInfoAdaptiveCardExtensionStrings {
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

declare module 'MyInfoAdaptiveCardExtensionStrings' {
  const strings: IMyInfoAdaptiveCardExtensionStrings;
  export = strings;
}
