import { Version, Environment, EnvironmentType } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';
import * as strings from 'SvEventsCarouselWebPartStrings';
import { 
  PropertyFieldNumber, 
  PropertyFieldToggleWithCallout, 
  PropertyFieldSliderWithCallout 
} from '@pnp/spfx-property-controls';
import {
  SPHttpClient,
  SPHttpClientResponse
} from '@microsoft/sp-http';
import * as React from 'react';
import { CalloutTriggers } from '@pnp/spfx-property-controls/lib/common/callout/Callout';
import { PropertyFieldListPicker, PropertyFieldListPickerOrderBy } from '@pnp/spfx-property-controls/lib/PropertyFieldListPicker';
import 'swiper/css/swiper.css';
import styles from './SvEventsCarouselWebPart.module.scss';
import Swiper from 'swiper/js/swiper.min.js';

import { ISPEvent, ISPEvents } from '../reusableCode/spInterfaces';

import GlobalFunctions from '../reusableCode/GlobalFunctions';

import MockHttpClient from '../reusableCode/MockHttpClient';

export interface ISvEventsCarouselWebPartProps {
  webPartTitle: string;
  eventListID: string;
  eventsLimit: number;
  disOnInter: boolean;
  secondsDelay: number;
  viewMoreUrl: string;
}

export default class SvEventsCarouselWebPart extends BaseClientSideWebPart<ISvEventsCarouselWebPartProps> {

  private _getMockEventsData(): Promise<ISPEvents> {
    return MockHttpClient.getEvents()
      .then((data: ISPEvent[]) => {
        var eventsData: ISPEvents = { value: data };
        return eventsData;
      }) as Promise<ISPEvents>;
  }

  private _getEventsData(): Promise<ISPEvents> {
    var today = new Date();
    today.setHours(0,0,0,0);
    return this.context.spHttpClient.get(this.context.pageContext.web.absoluteUrl + `/_api/Web/Lists(guid'${this.properties.eventListID}')/Items?\$filter=EventDate ge '`+today.toISOString()+`' or EndDate ge '`+today.toISOString()+`'&\$orderby=EventDate asc&\$top=` + this.properties.eventsLimit.toString(), SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        return response.json();
      });
  }

  private _renderEvents(items: ISPEvent[]): void {
    let html: string = "";
    if(this.properties.webPartTitle && this.properties.webPartTitle.trim() != "") {
      html += `<div class="${styles.webPartTitle}">${this.properties.webPartTitle}</div>`;
    }
    html += `
      <div class="${styles.webPartBody}">
        <div class="swiper-container ${styles.swiperContainer}">
          <div class="swiper-wrapper">
    `;

    items.forEach((item: ISPEvent) => {
      let url: string = this.context.pageContext.web.absoluteUrl + `/_layouts/15/Event.aspx?ListGuid=${this.properties.eventListID}&ItemId=` + item.Id;
      let title: string = item.Title ? item.Title : "";
      let desc: string = item.Description ? item.Description : "";
      desc = GlobalFunctions.stripHtmlFromString(desc);
      let allday: string = item.fAllDayEvent ? "AllDay" : "";
      let startDate: Date = item.EventDate ? new Date(item.EventDate) : null;
      let endDate: Date = item.EndDate ? new Date(item.EndDate) : null;
      if(item.fAllDayEvent){
        if(startDate && startDate.toISOString().indexOf("T00:00:00.000Z") != -1){
          startDate = new Date(startDate.toISOString().replace(".000Z",""));
        }
        if(endDate && endDate.toISOString().indexOf("T23:59:00.000Z") != -1){
          endDate = new Date(endDate.toISOString().replace(".000Z",""));
        }
      }
      let sDstring: string = startDate ? (startDate.getMonth()+1) + "."+startDate.getDate()+"."+startDate.getFullYear() : null;
      let eDstring: string = endDate ? (endDate.getMonth()+1) + "."+endDate.getDate()+"."+endDate.getFullYear() : null;
      if(startDate){
        startDate.setHours(0,0,0,0);
      }
      if(endDate){
        endDate.setHours(0,0,0,0);
      }
      let dateString: string = "";
      if(sDstring){
        dateString = eDstring && startDate < endDate ? sDstring+" - "+eDstring : sDstring;
      }
      html += `
        <div class="swiper-slide ${styles.swiperSlide}">
          <div class="${styles.eventDate}">${dateString}</div>
          <div class="${styles.eventTitle}"><a href="${url}">${title}</a></div>
          <div class="${styles.eventDescription}">${desc}</div>
        </div>
      `;
    });     
    let viewMoreLink: string = this.properties.viewMoreUrl && this.properties.viewMoreUrl.trim() != "" ? this.properties.viewMoreUrl : this.context.pageContext.web.absoluteUrl + "/_layouts/15/Events.aspx?ListGuid=" + this.properties.eventListID;
    html += `
          </div>
        </div>
        <div class="swiper-button-next ${styles.swiperButtonNext}"></div>
        <div class="swiper-button-prev ${styles.swiperButtonPrev}"></div>
        <hr>
        <div class="${styles.viewMoreDiv}"><a class="${styles.viewMoreLink}" href="${viewMoreLink}">View More Events</a></div>
      </div>
    `;

    const mainContainer: Element = this.domElement.querySelector(`#${styles.svEventsCarousel}`);
    mainContainer.innerHTML = html;

    var secDel = this.properties.secondsDelay * 1000;

    var swiper = new Swiper(`.${styles.swiperContainer}`, {
      slidesPerView: 1,
      spaceBetween: 10,
      autoplay: {
        delay: secDel,
        disableOnInteraction: this.properties.disOnInter,
      },
      navigation: {
        nextEl: `.${styles.swiperButtonNext}`,
        prevEl: `.${styles.swiperButtonPrev}`,
      },
      breakpoints: {
        640: {
          slidesPerView: 2,
          spaceBetween: 10,
        },
        768: {
          slidesPerView: 3,
          spaceBetween: 10,
        },
        1024: {
          slidesPerView: 2,
          spaceBetween: 10,
        },
        1366: {
          slidesPerView: 3,
          spaceBetween: 10,
        },
      }
    });
  }

  private _renderEventsAsync(): void {
    // Local environment
    if (Environment.type === EnvironmentType.Local) {
      this._getMockEventsData().then((response) => {
        this._renderEvents(response.value);
      });
    }
    else if (Environment.type == EnvironmentType.SharePoint ||
              Environment.type == EnvironmentType.ClassicSharePoint) {
      this._getEventsData()
        .then((response) => {
          this._renderEvents(response.value);
        });
    }
  }

  public render(): void {
    if(this.properties.eventListID) {
      const controlZone: Element = document.querySelector(`div.ControlZone[data-sp-a11y-id="ControlZone_${this.context.instanceId}"]`);
      if(controlZone){
        const controlZoneEmphasisBackground_a: Element = controlZone.querySelector(`div.ControlZoneEmphasisBackground`);
        const controlZoneEmphasisBackground_b: Element = controlZone.querySelector(`div.ControlZone--emphasisBackground`);
        if(controlZoneEmphasisBackground_a){
          controlZoneEmphasisBackground_a.setAttribute("style", "background: transparent");
        } else if(controlZoneEmphasisBackground_b){
          controlZoneEmphasisBackground_b.setAttribute("style", "background: transparent");
        }
      }
      this.domElement.innerHTML = `<div id="${ styles.svEventsCarousel }" />`;
      this._renderEventsAsync();
    } else {
      GlobalFunctions.displayError(this.domElement, this.context, this.displayMode, "Event's list is not selected","Open edit pane and select an events list.",true);
    }
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
                PropertyPaneTextField('webPartTitle', {
                  label: strings.webPartTitleFieldLabel
                }),
                PropertyFieldListPicker('eventListID', {
                  key: 'eventListID',
                  label: strings.eventListIDFieldLabel,
                  selectedList: this.properties.eventListID,
                  includeHidden: false,
                  orderBy: PropertyFieldListPickerOrderBy.Title,
                  onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
                  properties: this.properties,
                  context: this.context,
                  onGetErrorMessage: null,
                  deferredValidationTime: 0,
                  baseTemplate: 106
                }),
                PropertyFieldNumber('eventsLimit', {
                  key: "eventsLimit",
                  label: strings.eventsLimitFieldLabel,
                  description: strings.eventsLimitFieldDescription,
                  value: this.properties.eventsLimit,
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
                PropertyPaneTextField('viewMoreUrl', {
                  label: strings.viewMoreUrlFieldLabel,
                  description: strings.viewMoreUrlFieldDescription
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
