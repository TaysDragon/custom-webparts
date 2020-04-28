import { Version, Environment, EnvironmentType } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';
import {
  SPHttpClient,
  SPHttpClientResponse
} from '@microsoft/sp-http';
import 'swiper/css/swiper.css';
import styles from './SvAnnouncementsCarouselWebPart.module.scss';
import * as strings from 'SvAnnouncementsCarouselWebPartStrings';
import { ISPAnnouncement, ISPAnnouncements, ISPListForms, ISPListForm } from '../reusableCode/spInterfaces';
import MockHttpClient from '../reusableCode/MockHttpClient';
import GlobalFunctions from '../reusableCode/GlobalFunctions';
import { PropertyFieldListPicker, PropertyFieldNumber, PropertyFieldToggleWithCallout, PropertyFieldSliderWithCallout, PropertyFieldListPickerOrderBy } from '@pnp/spfx-property-controls';
import { CalloutTriggers } from '@pnp/spfx-property-controls/lib/common/callout/Callout';
import * as React from 'react';

export interface ISvAnnouncementsCarouselWebPartProps {
  webPartTitle: string;
  announcementsListID: string;
  recordsLimit: number;
  descMaxChar: number;
  dispFormUrl: string;
}

export default class SvAnnouncementsCarouselWebPart extends BaseClientSideWebPart<ISvAnnouncementsCarouselWebPartProps> {

  private _getMockAnnouncementsData(): Promise<ISPAnnouncements> {
    return MockHttpClient.getAnnouncements()
      .then((data: ISPAnnouncement[]) => {
        var announcementsData: ISPAnnouncements = { value: data };
        return announcementsData;
      }) as Promise<ISPAnnouncements>;
  }

  private _getAnnouncementsData(): Promise<ISPAnnouncements> {
    var today = new Date();
    today.setHours(0,0,0,0);
    return this.context.spHttpClient.get(this.context.pageContext.web.absoluteUrl + `/_api/Web/Lists(guid'${this.properties.announcementsListID}')/Items?\$filter=Expires ge '`+today.toISOString()+`' or Expires  eq null&\$orderby=Expires,ID asc&\$top=` + this.properties.recordsLimit.toString(), SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        return response.json();
      });
  }

  private _getMockListFormsData(): Promise<ISPListForms> {
    return MockHttpClient.getListForms()
      .then((data: ISPListForm[]) => {
        var listFormsData: ISPListForms = { value: data };
        return listFormsData;
      }) as Promise<ISPListForms>;
  }

  private _getListFormsData(): Promise<ISPListForms> {
    return this.context.spHttpClient.get(this.context.pageContext.web.absoluteUrl + `/_api/Web/Lists(guid'${this.properties.announcementsListID}')/Forms?$filter=FormType eq 4`, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        return response.json();
      });
  }

  private _renderAnnouncements(items: ISPAnnouncement[]): void {
    let maxChar = this.properties.descMaxChar;
    let html: string = "";
    if(this.properties.webPartTitle && this.properties.webPartTitle.trim() != "") {
      html += `<div class="${styles.webPartTitle}">${this.properties.webPartTitle}</div>`;
    }
    html += `
      <div class="${styles.webPartBody}">
    `;
    items.forEach((item: ISPAnnouncement) => {
      let itemUrl: string = this.context.pageContext.web.absoluteUrl + '/' + this.properties.dispFormUrl + '?ID=' + item.Id;
      let title: string = item.Title ? item.Title : "";
      html += `<div class="${styles.announceTitle}"><a href="${itemUrl}">${title}</a></div>`;
      if(maxChar > 0){
        let body: string = item.Body ? item.Body : "";
        body = GlobalFunctions.stripHtmlFromString(body);
        if(body.length > maxChar)
        {
          body = body.slice(0, maxChar) + `... <a class="${styles.readMoreLink}" href="${itemUrl}">read more</a>`;
        }
        html += `<div class="${styles.announceDescription}">${body}</div>`;
      }
      html += `<hr class="${styles.midSeparator}">`;
    });
    /*
    html += `
          </div>
          <div class="swiper-pagination ${styles.swiperPagination}"></div>
        </div>
      </div>
    `;
    */
    html += `
        </div>
      </div>
    `;
    const mainContainer: Element = this.domElement.querySelector(`#${styles.svAnnouncementsCarousel}`);
    mainContainer.innerHTML = html;
    var startx, starty, diffx, diffy, drag;
    var webPartBody = this.domElement.querySelector(`.${styles.webPartBody}`);
    webPartBody.addEventListener('mousedown', (e: MouseEvent) => {
      webPartBody.setAttribute("style","cursor: grab;");
      startx = e.clientX + webPartBody.scrollLeft;
      starty = e.clientY + webPartBody.scrollTop;
      diffx = 0;
      diffy = 0;
      drag = true;
    });
    webPartBody.addEventListener('mousemove', (e: MouseEvent) => {
      if (drag === true) {
        diffx = (startx - (e.clientX + webPartBody.scrollLeft));
        diffy = (starty - (e.clientY + webPartBody.scrollTop));
        webPartBody.scrollLeft += diffx;
        webPartBody.scrollTop += diffy;
      }
    });
    webPartBody.addEventListener('mouseup', (e: MouseEvent) => {
      webPartBody.setAttribute("style","");
      drag = false;
      var start = 1;
      var request;
      var animate = function () {
          var step = Math.sin(start);
          if (step <= 0) {
              window.cancelAnimationFrame(request);
          } else {
              webPartBody.scrollLeft += diffx * step;
              webPartBody.scrollTop += diffy * step;
              start -= 0.02;
              request = window.requestAnimationFrame(animate);
          }
      };
      animate();
    });
  }

  private _renderEventsAsync(): void {
    // Local environment
    if (Environment.type === EnvironmentType.Local) {
      this._getMockListFormsData().then((listFormsResponse) => {
        let forms: ISPListForm[] =  listFormsResponse.value;
        this.properties.dispFormUrl = forms[0].ResourcePath.DecodedUrl;
        this._getMockAnnouncementsData().then((announceResponse) => {
          this._renderAnnouncements(announceResponse.value);
        });
      });
    }
    else if (Environment.type == EnvironmentType.SharePoint ||
              Environment.type == EnvironmentType.ClassicSharePoint) {
      this._getListFormsData().then((listFormsResponse) => {
        let forms: ISPListForm[] =  listFormsResponse.value;
        this.properties.dispFormUrl = forms[0].ResourcePath.DecodedUrl;
        this._getAnnouncementsData().then((announceResponse) => {
          this._renderAnnouncements(announceResponse.value);
        });
      });
    }
  }

  public render(): void {
    if(this.properties.announcementsListID) {
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
      this.domElement.innerHTML = `<div id="${ styles.svAnnouncementsCarousel }" />`;
      this._renderEventsAsync();
    } else {
      GlobalFunctions.displayError(this.domElement, this.context, this.displayMode, "Announcement's list is not selected","Open edit pane and select an announcements list.",true);
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
                PropertyFieldListPicker('announcementsListID', {
                  key: 'announcementsListID',
                  label: strings.announcementsListIDFieldLabel,
                  selectedList: this.properties.announcementsListID,
                  includeHidden: false,
                  orderBy: PropertyFieldListPickerOrderBy.Title,
                  onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
                  properties: this.properties,
                  context: this.context,
                  onGetErrorMessage: null,
                  deferredValidationTime: 0,
                  baseTemplate: 104
                }),
                PropertyFieldNumber('recordsLimit', {
                  key: "recordsLimit",
                  label: strings.recordsLimitFieldLabel,
                  description: strings.recordsLimitFieldDescription,
                  value: this.properties.recordsLimit,
                  maxValue: 30,
                  minValue: 1
                }),
                PropertyFieldNumber('descMaxChar', {
                  key: "descMaxChar",
                  label: strings.descMaxCharFieldLabel,
                  description: strings.descMaxCharFieldDescription,
                  value: this.properties.descMaxChar,
                  maxValue: 2048,
                  minValue: -1
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
