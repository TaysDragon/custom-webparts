import { SPComponentLoader } from '@microsoft/sp-loader';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneCheckbox,
  PropertyPaneDropdown,
  PropertyPaneToggle
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';
import{
  SPHttpClient,
  SPHttpClientResponse
} from '@microsoft/sp-http';
import{
  Environment,
  EnvironmentType
} from '@microsoft/sp-core-library';

import styles from './NewsGalleryWebPart.module.scss';
import * as strings from 'NewsGalleryWebPartStrings';
import MockHttpClient from './MockHttpClient';
import MockHttpPages from './MockHttpClient';




export interface INewsGalleryWebPartProps {
  description: string;
  test: string;
  test1: boolean;
  test2: string;
  test3: boolean;
}

export interface ISPPages{
  value: ISPPage[];
}
export interface ISPPage{
  Title:string;
  Description: string;
  Id:string;  
}

export interface ISPNews{
  value:ISPNew[];
}
export interface ISPNew{
  Title:string;
  Description: string;
  Id:string;
  AbsoluteUrl:string;
  BannerImageUrl:string;
}

export default class NewsGalleryWebPart extends BaseClientSideWebPart <INewsGalleryWebPartProps> {


  private _renderNewsPagesAsync(): void {
    // Local environment
    if (Environment.type === EnvironmentType.Local) {
      this._getMockListData().then((response) => {
        this._renderPage(response.value);
      });
    }
    else  if (Environment.type == EnvironmentType.SharePoint ||
              Environment.type == EnvironmentType.ClassicSharePoint) {
    this._getNewsPagesData()
        .then((response) => {
          this._renderPage(response.value);
        });

    }
  }


  private _renderPage(items: ISPNew[]): void {
    let html: string = '';
    let htmlThumb: string = '';
    let idItem: number=1;
    items.forEach((item: ISPNew) => {
      html += `
      <div class="${ styles["swiper-slide"]}" style="background-image:url(${item.BannerImageUrl});"><a href=" ${item.AbsoluteUrl}" target="_blank">${item.Title}</a></div>
      `;
      htmlThumb += `
      <div class="${ styles["swiper-slide"]} " style="background-image:url(${item.BannerImageUrl})"><a href=" ${item.AbsoluteUrl}" target="_blank">${item.Title}</a></div>
      `;
      idItem=idItem+1;
    });
  
    const listContainer: Element = this.domElement.querySelector('#spListContainer');
    const pagesContainer: Element = this.domElement.querySelector('#newsPagesTop');
    listContainer.innerHTML = htmlThumb;    
    pagesContainer.innerHTML = html;    
  }

  //obtener pages
  private _getNewsPagesData():Promise<ISPNews>{
    return this.context.spHttpClient.get(this.context.pageContext.web.absoluteUrl + `/_api/sitepages/pages/feed?promotedstate=2&published=true&$select=*&$expand=CreatedBy,FirstPublishedRelativeTime&$orderby=Modified desc`,SPHttpClient.configurations.v1).then((response: SPHttpClientResponse)=>{
        return response.json();
    });
  }

  //obtener listas
  private _getLibraryData(): Promise<ISPPages>{
    return this.context.spHttpClient.get(this.context.pageContext.web.absoluteUrl + `/_api/web/lists?$filter=Hidden eq false`,SPHttpClient.configurations.v1).then((response: SPHttpClientResponse)=>{
    //For other types of lists, check the base templates here: https://msdn.microsoft.com/en-us/library/microsoft.sharepoint.client.listtemplatetype.aspx
    //return this.context.spHttpClient.get(this.context.pageContext.web.absoluteUrl + `_api/Web/Lists?$filter=BaseTemplate eq 101`,SPHttpClient.configurations.v1).then((response: SPHttpClientResponse)=>{
      return response.json();
    });
  }
  private _getMockListData(): Promise<ISPNews> {
    return MockHttpPages.get()
      .then((data: ISPNew[]) => {
        var listData: ISPNews = { value: data };
        return listData;
      }) as Promise<ISPNews>;
  }

  public render(): void {
    this.domElement.innerHTML = `
    <div class="${ styles["swiper-container"]}  ${ styles["gallery-top"]}" >
      <div class="${ styles["swiper-wrapper"]} row" id="newsPagesTop"></div>
        
    </div>
    <div class="${ styles["swiper-container"]} ${ styles["gallery-thumbs"]}" >
      <div class="${ styles["swiper-wrapper"]} " id="spListContainer" ></div>
      <div class="${ styles["swiper-button-next"]} ${ styles["swiper-button-white"]} swiper-button-next swiper-button-white"></div>
      <div class="${ styles["swiper-button-prev"]} ${ styles["swiper-button-white"]} swiper-button-prev swiper-button-white"></div>
      
    </div>
    <div class="${styles.linktoviewallnews}">
        <a href="${this.context.pageContext.web.absoluteUrl}/SitePages/Forms/News.aspx" target="_blank">View All News</a>
      </div>
    `;


      this._renderNewsPagesAsync();      

    
  }
  

  protected get dataVersion(): Version {
  return Version.parse('1.0');
}

protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
  return {
    pages: [
      {
        header: {
          description: strings.PropertyPaneDescription
        },
        groups: [
          {
            groupName: strings.BasicGroupName,
            groupFields: [
            PropertyPaneTextField('description', {
              label: 'Description'
            }),
            PropertyPaneTextField('test', {
              label: 'Multi-line Text Field',
              multiline: true
            }),
            PropertyPaneCheckbox('test1', {
              text: 'Checkbox'
            }),
            PropertyPaneDropdown('test2', {
              label: 'Dropdown',
              options: [
                { key: '1', text: 'One' },
                { key: '2', text: 'Two' },
                { key: '3', text: 'Three' },
                { key: '4', text: 'Four' }
              ]}),
            PropertyPaneToggle('test3', {
              label: 'Toggle',
              onText: 'On',
              offText: 'Off'
            })
          ]
          }
        ]
      }
    ]
  };
}
}
