import { ISPNew, ISPNews }  from './NewsGalleryWebPart';
export default class MockHttpClient  {
    private static _items: ISPNew[] = [{ Title: 'Mock Pages 1',Description: 'demo 1', Id: '1',AbsoluteUrl:'' ,BannerImageUrl:'https://picsum.photos/1024/768?random=1'},
                                        { Title: 'Mock Pages 2',Description:'demo 2', Id: '2',AbsoluteUrl:'' ,BannerImageUrl:'https://picsum.photos/1024/768?random=2' },
                                        { Title: 'Mock Pages 3',Description: 'demo 3',Id: '3',AbsoluteUrl:'' ,BannerImageUrl:'https://picsum.photos/1024/768?random=3' }];
    public static get(): Promise<ISPNew[]> {
        return new Promise<ISPNew[]>((resolve) => {
                resolve(MockHttpClient._items);
            });
        }
}