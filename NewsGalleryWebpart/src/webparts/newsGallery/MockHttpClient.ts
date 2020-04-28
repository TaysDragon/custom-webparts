import { ISPPage, ISPPages } from './NewsGalleryWebPart';

export default class MockHttpClient  {

    private static _items: ISPPage[] = [{ Title: 'Mock Pages 1',Description: 'demo 1', Id: '1' },
                                        { Title: 'Mock Pages 2',Description:'demo 2', Id: '2' },
                                        { Title: 'Mock Pages 3',Description: 'demo 3',Id: '3' }];

    public static get(): Promise<ISPPage[]> {
    return new Promise<ISPPage[]>((resolve) => {
            resolve(MockHttpClient._items);
        });
    }
}