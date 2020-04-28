import { Version, Environment, EnvironmentType } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';
import {
  SPHttpClient,
  SPHttpClientResponse
} from '@microsoft/sp-http';
import { PropertyFieldListPicker, PropertyFieldListPickerOrderBy } from '@pnp/spfx-property-controls/lib/PropertyFieldListPicker';
import styles from './SvEventsPageWebPart.module.scss';
import * as strings from 'SvEventsPageWebPartStrings';

import { ISPEvent, ISPEvents } from '../reusableCode/spInterfaces';

import GlobalFunctions from '../reusableCode/GlobalFunctions';

import MockHttpClient from '../reusableCode/MockHttpClient';

export interface ISvEventsPageWebPartProps {
  webPartTitle: string;
  eventListID: string;
  selectedYear: number;
  selectedMonth: number;
  selectedDay: number;
}

export default class SvEventsPageWebPart extends BaseClientSideWebPart<ISvEventsPageWebPartProps> {

  private _getMockEventsData(): Promise<ISPEvents> {
    return MockHttpClient.getEvents()
      .then((data: ISPEvent[]) => {
        var eventsData: ISPEvents = { value: data };
        return eventsData;
      }) as Promise<ISPEvents>;
  }

  private _getEventsData(): Promise<ISPEvents> {
    let filter: string = "";
    if(this.properties.selectedDay){
      let selectedDate: Date = new Date(this.properties.selectedYear,this.properties.selectedMonth,this.properties.selectedDay);
      filter = `\$filter=EventDate le '`+selectedDate.toISOString()+`' and EndDate ge '`+selectedDate.toISOString()+`'`;
    } else {
      let firstDate: Date = GlobalFunctions.firstDayOfMonth(this.properties.selectedYear,this.properties.selectedMonth);
      let lastDate: Date = GlobalFunctions.lastDayOfMonth(this.properties.selectedYear,this.properties.selectedMonth);
      filter = `\$filter=EndDate ge '`+firstDate.toISOString()+`' and EventDate le '`+lastDate.toISOString()+`'`;
    }
    return this.context.spHttpClient.get(this.context.pageContext.web.absoluteUrl + `/_api/Web/Lists(guid'${this.properties.eventListID}')/Items?` + filter + `&\$orderby=EventDate asc`, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        return response.json();
      });
  }

  private _renderEvents(items: ISPEvent[]): void {
    let month: string = GlobalFunctions.months[this.properties.selectedMonth];
    let header: string = `Events for ${month} ${this.properties.selectedYear}`;
    if(this.properties.selectedDay){
      header = `Events for ${month} ${this.properties.selectedDay}, ${this.properties.selectedYear}`; 
    }
    let html: string = `
      <span class="${styles.eventsHeader}">${header}</span>
      <hr class="${styles.topSeparator}">
    `;
    if(items.length){
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
          <div class="${styles.singleEvent}">
            <div class="${styles.eventDate}">${dateString}</div>
            <div class="${styles.eventTitle}"><a href="${url}">${title}</a></div>
            <div class="${styles.eventDescription}">${desc}</div>
            <hr class="${styles.midSeparator}">
          </div>
        `;
      });
    } else {
      html += `<span class="${styles.noEvents}">No events found</span>`;  
    }
    const eventsContainer: Element = this.domElement.querySelector(`.${styles.eventsContainer}`);
    eventsContainer.innerHTML = html;
  }

  private _renderEventsAsync(): void {
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

  private _renderCalendar(): void{
    let month: string = GlobalFunctions.months[this.properties.selectedMonth];
    let html: string = `
      <div class="${styles.calendarHeader}">
        <span>${month} ${this.properties.selectedYear}</span>
        <div class="${styles.calButtonNext}">&gt;</div>
        <div class="${styles.calButtonPrev}">&lt;</div>
      </div>
      <table class="${styles.calendarGrid}">
    `;
    let firstDayOfWeek: number = GlobalFunctions.firstDayOfMonth(this.properties.selectedYear, this.properties.selectedMonth).getDay();
    let lastDay: number = GlobalFunctions.lastDayOfMonth(this.properties.selectedYear, this.properties.selectedMonth).getDate();
    let date = 1;
    for (let i = 0; i < 6; i++) {
      html += `<tr>`;
      for (let j = 0; j < 7; j++) {
        if ((i === 0 && j < firstDayOfWeek) || date > lastDay) {
          html += `<td></td>`;
        } else {
          if(this.properties.selectedDay && date == this.properties.selectedDay){
            html += `<td class="${styles.selected}" data-value="${date}">${date}</td>`;
          } else {
            html += `<td class="${styles.selectable}" data-value="${date}">${date}</td>`;
          }
          date++;
        }
      }
      html += `</tr>`;
      if (date > lastDay){
        break;
      }
    }
    html += `</table>`;
    const calendar: Element = this.domElement.querySelector(`.${styles.calendar}`);
    calendar.innerHTML = html;

    var dayClick = (day,wpThis) => {
      return (e) => {
        wpThis.properties.selectedDay = parseInt(day);
        wpThis._renderCalendar();
        wpThis._renderEventsAsync();
      };
    };

    var allSelectables = this.domElement.querySelectorAll(`.${styles.selectable}`);
    if(allSelectables){
      for (let n = 0; n < allSelectables.length; n++) {
        var val = allSelectables[n].getAttribute("data-value");
        allSelectables[n].addEventListener('click', dayClick(val, this));
      } 
    }
    var headerSpan = this.domElement.querySelector(`.${styles.calendarHeader} span`);
    headerSpan.addEventListener('click', () => {
      this.properties.selectedDay = null;
      this._renderCalendar();
      this._renderEventsAsync();
    });
    var calButtonNext = this.domElement.querySelector(`.${styles.calButtonNext}`);
    calButtonNext.addEventListener('click', () => {
      this.properties.selectedYear = (this.properties.selectedMonth === 11) ? this.properties.selectedYear + 1 : this.properties.selectedYear;
      this.properties.selectedMonth = (this.properties.selectedMonth + 1) % 12;
      this.properties.selectedDay = null;
      this._renderCalendar();
      this._renderEventsAsync();
    });
    var calButtonPrev = this.domElement.querySelector(`.${styles.calButtonPrev}`);
    calButtonPrev.addEventListener('click', () => {
      this.properties.selectedYear = (this.properties.selectedMonth === 0) ? this.properties.selectedYear - 1 : this.properties.selectedYear;
      this.properties.selectedMonth = (this.properties.selectedMonth === 0) ? 11 : this.properties.selectedMonth - 1;
      this.properties.selectedDay = null;
      this._renderCalendar();
      this._renderEventsAsync();    
    });
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
      let html: string = `<div id="${ styles.svEventsPage }">`;
      if(this.properties.webPartTitle && this.properties.webPartTitle.trim() != "") {
        html += `<div class="${styles.webPartTitle}">${this.properties.webPartTitle}</div>`;
      }
      html += `
        <div class="${ styles.webPartBody }">  
          <div class="${ styles.calendarContainer }">
            <div class="${styles.calendar}"></div>
          </div>
          <div class="${ styles.eventsContainer }"></div>
        </div>
      </div>   
      `;
      this.domElement.innerHTML = html;
      let currentDate: Date = new Date();
      this.properties.selectedYear = currentDate.getFullYear();
      this.properties.selectedMonth = currentDate.getMonth();
      this.properties.selectedDay = null;
      this._renderCalendar();
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
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
