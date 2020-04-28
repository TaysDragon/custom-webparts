export interface ISPpages {
    value: ISPpage[];
}
  
export interface ISPpage {
    Id: string;
    Title: string;
    Description: string;
    BannerImageUrl: string;
    BannerThumbnailUrl: string;
    AbsoluteUrl: string;
}

export interface ISPimage {
    UniqueId: string;
    Name: string;
    ServerRelativeUrl: string;
}

export interface ISPEvent {
    Id: string;
    Title: string;
    EventDate: string;
    EndDate: string;
    Description: string;
    fAllDayEvent: string;
    Category: string;
    BannerUrl: {Description: string, Url: string};
    Location: string;
}

export interface ISPEvents {
    value: ISPEvent[];
}

export interface ISPAnnouncement {
    Id: string;
    Title: string;
    Body: string;
    Expires: string;
}

export interface ISPAnnouncements {
    value: ISPAnnouncement[];
}

export interface ISPList {
    Id: string;
    Title: string;
    BaseTemplate: string;
    ParentWebUrl: string;
    ListItemEntityTypeFullName: string;
}

export interface ISPListForm {
    Id: string;
    ResourcePath: {DecodedUrl: string};
    ServerRelativeUrl: string;
    FormType: string;
}

export interface ISPListForms {
    value: ISPListForm[];
}