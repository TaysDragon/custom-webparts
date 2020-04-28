import { ISPpage, ISPimage, ISPEvent, ISPAnnouncement, ISPListForm } from './spInterfaces';

export default class MockHttpClient  {

    private static _pages: ISPpage[] = 
        [{  Id: '1', 
            Title: 'Mock News Page 1',
            Description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure d…',
            BannerImageUrl: 'https://storage.googleapis.com/gd-wagtail-prod-assets/images/evolving_google_identity_2x.max-4000x2000.jpegquality-90.jpg',
            BannerThumbnailUrl: 'https://storage.googleapis.com/gd-wagtail-prod-assets/images/evolving_google_identity_2x.max-4000x2000.jpegquality-90.jpg',
            AbsoluteUrl: 'https://google.com' 
        },
         {  Id: '2', 
            Title: 'Mock News Page 2',
            Description: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia v…',
            BannerImageUrl: 'data:image/png;base64,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',
            BannerThumbnailUrl: 'data:image/png;base64,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',
            AbsoluteUrl: 'https://fb.com' 
        },
         {  Id: '3', 
            Title: 'Mock News Page 3',
            Description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure d…',
            BannerImageUrl: 'https://lh3.googleusercontent.com/ob6FsqAa9TBUdjs2piHJl0we1FBbzjk9Bp_1-wwgbB98-qixZrb6nY5j09YkpBIxz4qnLop_Bhy5C2G-L-HVV6ZN5e--SiUUG2Uw',
            BannerThumbnailUrl: 'https://lh3.googleusercontent.com/ob6FsqAa9TBUdjs2piHJl0we1FBbzjk9Bp_1-wwgbB98-qixZrb6nY5j09YkpBIxz4qnLop_Bhy5C2G-L-HVV6ZN5e--SiUUG2Uw',
            AbsoluteUrl: 'https://youtube.com'
        }];

    public static getPages(): Promise<ISPpage[]> {
    return new Promise<ISPpage[]>((resolve) => {
            resolve(MockHttpClient._pages);
        });
    }
    
   private static _image: ISPimage = {  
            UniqueId: '1', 
            Name: 'Mock Image 1',
            ServerRelativeUrl: 'https://storage.googleapis.com/gd-wagtail-prod-assets/images/evolving_google_identity_2x.max-4000x2000.jpegquality-90.jpg'
        };

    public static getImage(): Promise<ISPimage> {
    return new Promise<ISPimage>((resolve) => {
            resolve(MockHttpClient._image);
        });
    }

    private static _events: ISPEvent[] = 
        [{  Id: '1', 
            Title: 'Mock Event 1',            
            EventDate: '2030-12-10T22:00:00Z',
            EndDate: '2030-12-10T23:00:00Z',
            Description: '&lt;p&gt;Lorem ipsum dolor sit amet, consectetur adipiscing elit, (sed do eiusmod) tempor incididunt ut ! <strong>html cleaning</strong> #12345 labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.&lt;/p&gt;',
            fAllDayEvent: 'false',
            Category: 'Meeting',
            BannerUrl: {
                Description: '/sites/SPFXProject/SiteAssets/SitePages/Event/30324-Town-hall-meeting---Wikipedia.jpeg?X=NaN&amp;Y=NaN&amp;Id=b51cb18e-1b74-4854-a1dc-d5460bb1ddf7&amp;listId=c11066f8-57e1-4bfc-b1fa-8380fffad09b', 
                Url: 'https://taysdragon.sharepoint.com/sites/SPFXProject/SiteAssets/SitePages/Event/30324-Town-hall-meeting---Wikipedia.jpeg?X=NaN&amp;Y=NaN&amp;Id=b51cb18e-1b74-4854-a1dc-d5460bb1ddf7&amp;listId=c11066f8-57e1-4bfc-b1fa-8380fffad09b'
            },
            Location: 'Houston, Texas, United States'
        },
         {  Id: '2', 
            Title: 'Mock Event 2',            
            EventDate: '2030-12-17T00:00:00Z',
            EndDate: '2030-12-17T23:59:00Z',
            Description: '&lt;p&gt;Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, something & co, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?&lt;/p&gt;',
            fAllDayEvent: 'true',
            Category: 'Holiday',
            BannerUrl: {
                Description: 'https://taysdragon.sharepoint.com/sites/SPFXProject/SiteAssets/SitePages/Event/34089-Conferences---Arborosa.jpeg?X=50&amp;Y=50&amp;Id=69aebd04-f41d-496e-bbdd-6d38c4cb10a8&amp;listId=c11066f8-57e1-4bfc-b1fa-8380fffad09b', 
                Url: 'https://taysdragon.sharepoint.com/sites/SPFXProject/SiteAssets/SitePages/Event/34089-Conferences---Arborosa.jpeg?X=50&amp;Y=50&amp;Id=69aebd04-f41d-496e-bbdd-6d38c4cb10a8&amp;listId=c11066f8-57e1-4bfc-b1fa-8380fffad09b'
            },
            Location: 'New York, New York, United States' 
        },
         {  Id: '3', 
            Title: 'Mock Event 3',            
            EventDate: '2031-01-14T16:00:00Z',
            EndDate: '2031-01-15T19:00:00Z',
            Description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Formula test 1/2 + 1*8 = %1234 $23 Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure d…',
            fAllDayEvent: 'false',
            Category: null,
            BannerUrl: null,
            Location: null
        }];

    public static getEvents(): Promise<ISPEvent[]> {
    return new Promise<ISPEvent[]>((resolve) => {
            resolve(MockHttpClient._events);
        });
    }

    private static _announcements: ISPAnnouncement[] = 
        [{  Id: '1', 
            Title: 'Mock Announcement 1',
            Body: '&lt;p&gt;Lorem ipsum dolor sit amet, consectetur adipiscing elit, (sed do eiusmod) tempor incididunt ut ! <strong>html cleaning</strong> #12345 labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.&lt;/p&gt;',
            Expires: '2020-02-22T16:00:00Z'
        },
         {  Id: '2', 
            Title: 'Mock Announcement 2',
            Body: '&lt;p&gt;Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, something & co, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?&lt;/p&gt;',
            Expires: '2020-02-23T16:00:00Z'
        },
         {  Id: '3', 
            Title: 'Mock Announcement 3',
            Body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Formula test 1/2 + 1*8 = %1234 $23 Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure d',
            Expires: '2020-02-24T16:00:00Z' 
        },
        {  Id: '4', 
            Title: 'Mock Announcement 4',
            Body: '&lt;p&gt;Lorem ipsum dolor sit amet, consectetur adipiscing elit, (sed do eiusmod) tempor incididunt ut ! <strong>html cleaning</strong> #12345 labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.&lt;/p&gt;',
            Expires: '2020-02-22T16:00:00Z'
        },
         {  Id: '5', 
            Title: 'Mock Announcement 5',
            Body: '&lt;p&gt;Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, something & co, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?&lt;/p&gt;',
            Expires: '2020-02-23T16:00:00Z'
        },
         {  Id: '6', 
            Title: 'Mock Announcement 6',
            Body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Formula test 1/2 + 1*8 = %1234 $23 Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure d',
            Expires: '2020-02-24T16:00:00Z' 
        }];

    public static getAnnouncements(): Promise<ISPAnnouncement[]> {
        return new Promise<ISPAnnouncement[]>((resolve) => {
            resolve(MockHttpClient._announcements);
        });
    }

    private static _listforms: ISPListForm[] = 
        [{  Id: 'f202853d-83e1-44f0-9eda-f960fb0ce64a', 
            ResourcePath: {DecodedUrl: 'Lists/Announcements/DispForm.aspx'},
            ServerRelativeUrl: '/sites/SPFXProject/Lists/Announcements/DispForm.aspx',
            FormType: '4'
        }];

    public static getListForms(): Promise<ISPListForm[]> {
        return new Promise<ISPListForm[]>((resolve) => {
            resolve(MockHttpClient._listforms);
        });
    }
}