declare interface ISvQuickLinksWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  webPartTitleFieldLabel: string;
  linksCollectionLabel: string;
  linksCollectionManageBtnLabel: string;
  linksCollectionPanelHeader: string;
  linksLimitFieldLabel: string;
  linksLimitFieldDescription: string;
  colorGroupName: string;
  wpBkgndColorFieldLabel: string;
  borderColorFieldLabel: string;
  titleBkgndColorFieldLabel: string;
  titleFontColorFieldLabel: string;
  linkFontColorFieldLabel: string;
  linkHoverColorFieldLabel: string;
}

declare module 'SvQuickLinksWebPartStrings' {
  const strings: ISvQuickLinksWebPartStrings;
  export = strings;
}
