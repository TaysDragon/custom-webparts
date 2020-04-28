declare interface ICrmStrings {
  TodoListTitle: string;
  TodoListTabNameAllTasks: string;
  TodoListTabNameCompleted: string;
  TodoListTabNameActive: string;
  AddButton: string;
  InputBoxPlaceholder: string;
  FetchingListsLabel: string;
  FetchingTasksLabel: string;
  TodoItemCreateLabel: string;
  TodoItemCompleteLabel: string;
  TodoItemAriaLabelCheckedState: string;
  TodoItemAriaLabelUncheckedState: string;
  TodoItemAriaLabelTitle: string;
  TodoItemAriaLabelCreator: string;
  TodoItemAriaLabelEditor: string;
  TodoItemAriaLabel: string;
  DeleteItemTitle: string;
  DeleteItemAriaLabel: string;
  WorkingOnSpinnerLabel: string;
  PropertyPaneDescriptionSetProperties: string;
  PropertyPaneHeadingConfigureSoruce: string;
  PropertyPaneHeadingConfigureDisplay: string;
  PropertyPaneDropdownLoadingLabel: string;
  DropdownErrorMessageNoListAvailable: string;
  PropertyPaneDropdownLabelTasksList: string;
  PropertyPaneToggleOnTextShowCompletedTasks: string;
  PropertyPaneToggleOffTextHideCompletedTasks: string;
  PropertyPaneCheckboxGroupLabel: string;
  PropertyPaneCheckboxCreatedByLabel: string;
  PropertyPaneCheckboxCompletedByLabel: string;
  PropertyPaneSliderLabel: string;
  TitleEmptyErrorMessage: string;
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
}

declare module 'crmStrings' {
  const strings: ICrmStrings;
  export = strings;
}
