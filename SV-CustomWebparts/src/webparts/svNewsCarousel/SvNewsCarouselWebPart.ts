import { 
  Version, 
  UrlQueryParameterCollection,
  Environment,
  EnvironmentType
} from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';
import { 
  PropertyFieldNumber,
  PropertyFieldSliderWithCallout,
  PropertyFieldToggleWithCallout
} from '@pnp/spfx-property-controls';
import { CalloutTriggers } from '@pnp/spfx-property-controls/lib/PropertyFieldHeader';
import * as React from 'react';
import { escape } from '@microsoft/sp-lodash-subset';
import 'swiper/css/swiper.css';
//import './SvNewsCarouselWebPartSwiperStyles.css';
import 'swiper/js/swiper.js';
import Swiper from 'swiper/js/swiper.min.js';
import styles from './SvNewsCarouselWebPart.module.scss';
import * as strings from 'SvNewsCarouselWebPartStrings';

import {
  SPHttpClient,
  SPHttpClientResponse
} from '@microsoft/sp-http';

import { ISPpage, ISPpages, ISPimage } from '../reusableCode/spInterfaces';

import GlobalFunctions from '../reusableCode/GlobalFunctions';

import MockHttpClient from '../reusableCode/MockHttpClient';

export interface ISvNewsCarouselWebPartProps {
  recordsLimit: number;
  disOnInter: boolean;
  secondsDelay: number;
  showButton: boolean;
}

export default class SvNewsCarouselWebPart extends BaseClientSideWebPart<ISvNewsCarouselWebPartProps> {

  private _getMockPagesData(): Promise<ISPpages> {
    return MockHttpClient.getPages()
      .then((data: ISPpage[]) => {
        var pagesData: ISPpages = { value: data };
        return pagesData;
      }) as Promise<ISPpages>;
  }

  private _getMockImageData(): Promise<ISPimage> {
    return MockHttpClient.getImage()
      .then((data: ISPimage) => {
        var imageData: ISPimage = data;
        return imageData;
      }) as Promise<ISPimage>;
  }

  private _getPagesData(): Promise<ISPpages> {
    return this.context.spHttpClient.get(this.context.pageContext.web.absoluteUrl + `/_api/sitepages/pages/feed?promotedstate=2&published=true&\$orderby=FirstPublished desc&\$top=` + this.properties.recordsLimit.toString(), SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        return response.json();
      });
  }

  private _getImageData(guidFile: string): Promise<ISPimage> {
    return this.context.spHttpClient.get(this.context.pageContext.web.absoluteUrl + `/_api/Web/GetFileById('${guidFile}')`, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        return response.json();
      });
  }

  private _renderPages(items: ISPpage[]): void {
    let htmlComplete: string = '';
    let htmlTop: string = '';
    let htmlThumb: string = '';
    var uniqueString = Date.now().toString();
    var siteRelativeUrl = this.context.pageContext.site.serverRelativeUrl;
    var siteAbsoluteUrl = this.context.pageContext.site.absoluteUrl;
    var viewMoreLink = siteAbsoluteUrl + "/_layouts/15/news.aspx";
    var rootUrl = siteAbsoluteUrl.replace(siteRelativeUrl,"");
    var pcount = 1;
    var validImages: {guidFile: string, imageClass: string}[] = [];
    let displayButton = this.properties.showButton ? "" : "display:none";
    htmlTop = `
    <div class="swiper-container gallery-top ${styles.swiperContainer} ${styles.galleryTop}">
      <div class="swiper-wrapper">`;
    htmlThumb = `
    <div class="swiper-container gallery-thumbs ${styles.swiperContainer} ${styles.galleryThumbs}">
      <div class="swiper-wrapper">`;
    items.forEach((item: ISPpage) => {
      var queryParms = new UrlQueryParameterCollection(item.BannerImageUrl);
      var guidFile = queryParms.getValue("guidFile");
      guidFile = GlobalFunctions.addDashesToGUID(guidFile);
      var imageClass = `sv-news-img-${uniqueString}-${pcount}`;
     htmlTop += `<div class="swiper-slide ${styles.swiperSlide}">`;
      if (guidFile && guidFile.length == 36){  
        htmlTop += `<img class="${imageClass}" alt="${item.Title}">`;
        validImages.push({guidFile: guidFile, imageClass: imageClass});
      } else {
        htmlTop += `<img src="${item.BannerThumbnailUrl}" alt="${item.Title}">`;
      }
      htmlTop += `
        <div class="${styles.slideTextArea}">
          <span class="${styles.sliderTitle}"><a href="${item.AbsoluteUrl}">${item.Title}</a></span>
          <span class="${styles.sliderDescription}">${item.Description}</span>
          <a href="${item.AbsoluteUrl}" class="${ styles.button }" style="${displayButton}">
            <span class="${ styles.label }">Details &gt;</span>
          </a>
        </div>
      </div>`;
      htmlThumb += `
          <div class="swiper-slide ${styles.swiperSlide}">
            <div class="thumb-wrapper ${styles.thumbWrapper}">
              <img src="${item.BannerThumbnailUrl}" alt="${item.Title}">
              <div class="${styles.thumbTitle}"><span>${item.Title}</span></div>
            </div>
          </div>`;
      pcount++; 
    });
    htmlTop += `
      </div>
      <div class="swiper-button-next swiper-button-white ${styles.swiperButtonNext}"></div>
      <div class="swiper-button-prev swiper-button-white ${styles.swiperButtonPrev}"></div>
    </div>`;
    htmlThumb += `
      </div>
    </div>`;
    htmlComplete = `<div class="${styles.webPartBody}"> 
    ${htmlTop} 
    ${htmlThumb}
    </div>
    <div class="${styles.viewMoreDiv}"><a class="${styles.viewMoreLink}" href="${viewMoreLink}">View All News</a></div>`;
    const mainContainer: Element = this.domElement.querySelector(`#${styles.svNewsCarousel}`);
    mainContainer.innerHTML = htmlComplete;

    validImages.forEach((image: {guidFile: string, imageClass: string}) => {
      this._renderImageAsync(image.guidFile, image.imageClass, rootUrl);
    });

    var galleryThumbs = new Swiper(`.${styles.galleryThumbs}`, {
      spaceBetween: 10,
      slidesPerView: 4,
      freeMode: true,
      watchSlidesVisibility: true,
      watchSlidesProgress: true,
    });

    var secDel = this.properties.secondsDelay * 1000;
    var galleryTop = new Swiper(`.${styles.galleryTop}`, {
      spaceBetween: 10,
      autoplay: {
        delay: secDel,
        disableOnInteraction: this.properties.disOnInter,
      },
      navigation: {
        nextEl: `.${styles.swiperButtonNext}`,
        prevEl: `.${styles.swiperButtonPrev}`,
      },
      thumbs: {
        swiper: galleryThumbs,
      },
    });
  }

  private _renderImage(item: ISPimage, imageClass: string, rootUrl: string): void {
    var imgElement: Element = this.domElement.querySelector(`.${imageClass}`);
    imgElement.setAttribute("src", rootUrl + item.ServerRelativeUrl);
  }

  private _renderPagesAsync(): void {
    // Local environment
    if (Environment.type === EnvironmentType.Local) {
      this._getMockPagesData().then((response) => {
        this._renderPages(response.value);
      });
    }
    else if (Environment.type == EnvironmentType.SharePoint ||
              Environment.type == EnvironmentType.ClassicSharePoint) {
      this._getPagesData()
        .then((response) => {
          this._renderPages(response.value);
        });
    }
  }

  private _renderImageAsync(guidFile: string, imageClass: string, rootUrl: string): void {
    // Local environment
    if (Environment.type === EnvironmentType.Local) {
      this._getMockImageData().then((response) => {
        this._renderImage(response, imageClass, "");
      });
    }
    else if (Environment.type == EnvironmentType.SharePoint ||
              Environment.type == EnvironmentType.ClassicSharePoint) {
      this._getImageData(guidFile)
        .then((response) => {
          this._renderImage(response, imageClass, rootUrl);
        });
    }
  }

  public render(): void {
    this.domElement.innerHTML = `<div id="${styles.svNewsCarousel}" />`;
    this._renderPagesAsync();
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
                PropertyFieldNumber('recordsLimit', {
                  key: "recordsLimit",
                  label: strings.recordsLimitFieldLabel,
                  description: strings.recordsLimitFieldDescription,
                  value: this.properties.recordsLimit,
                  maxValue: 30,
                  minValue: 1
                }),
                PropertyFieldToggleWithCallout('disOnInter', {
                  key: 'disOnInter',
                  label: strings.disOnInterFieldLabel,
                  onText: 'ON',
                  offText: 'OFF',
                  checked: this.properties.disOnInter,
                  calloutContent: React.createElement('p', {}, strings.disOnInterFieldDescription),
                  calloutTrigger: CalloutTriggers.Click
                }),
                PropertyFieldSliderWithCallout('secondsDelay', {
                  key: 'secondsDelay',
                  label: strings.secondsDelayFieldLabel,
                  max: 10,
                  min: 1,
                  step: 1,
                  showValue: true,
                  value: this.properties.secondsDelay,
                  calloutContent: React.createElement('div', {}, strings.secondsDelayFieldDescription),
                  calloutTrigger: CalloutTriggers.Click,
                  calloutWidth: 200
                }),
                PropertyFieldToggleWithCallout('showButton', {
                  key: 'showButton',
                  label: strings.showButtonFieldLabel,
                  onText: 'ON',
                  offText: 'OFF',
                  checked: this.properties.showButton,
                  calloutContent: React.createElement('p', {}, strings.showButtonFieldDescription),
                  calloutTrigger: CalloutTriggers.Click
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
