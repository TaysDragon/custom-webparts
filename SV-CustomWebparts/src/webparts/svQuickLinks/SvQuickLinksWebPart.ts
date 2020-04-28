import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';
import { PropertyFieldNumber } from '@pnp/spfx-property-controls';
import { PropertyFieldCollectionData, CustomCollectionFieldType } from '@pnp/spfx-property-controls/lib/PropertyFieldCollectionData';
import { PropertyFieldColorPicker, PropertyFieldColorPickerStyle } from '@pnp/spfx-property-controls/lib/PropertyFieldColorPicker';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './SvQuickLinksWebPart.module.scss';
import * as strings from 'SvQuickLinksWebPartStrings';

import GlobalFunctions from '../reusableCode/GlobalFunctions';

export interface ISvQuickLinksWebPartProps {
  webPartTitle: string;
  linksCollection: any[];
  linksLimit: number;
  wpBkgndColor: string;
  borderColor: string;
  titleBkgndColor: string;
  titleFontColor: string;
  linkFontColor: string;
  linkHoverColor: string;
}

export interface ILink {
  Label: string; 
  Url: string; 
  NewTab: boolean;
}

export default class SvQuickLinksWebPart extends BaseClientSideWebPart<ISvQuickLinksWebPartProps> {

  private _renderLinks(links: ILink[]): void {
    let html: string = "";
    links.forEach((link: ILink) => {
      let target: string = link.NewTab ? `target="_blank"` : "";
      html += `
          <div class="${ styles.linkDiv }" style="color: ${this.properties.linkHoverColor}">
            <a style="color: ${this.properties.linkFontColor}" href="${link.Url}" ${target}>${link.Label}</a>
            <hr>
          </div>
      `;
    });
    const linksContainer: Element = this.domElement.querySelector(`.${styles.linksContainer}`);
    linksContainer.innerHTML += html;
  }

  private _renderBody(): void {
    let html: string = "";
    if(this.properties.webPartTitle && this.properties.webPartTitle.trim() != "") {
      html += `<div class="${styles.title}" style="background-color: ${this.properties.titleBkgndColor}; color: ${this.properties.titleFontColor}">
          ${this.properties.webPartTitle}
        </div>`;
    }
    html += `<div class="${ styles.linksContainer }"></div>`;
    const mainContainer: Element = this.domElement.querySelector(`#${styles.svQuickLinks}`);
    mainContainer.innerHTML = html;

    if(this.properties.linksLimit && this.properties.linksLimit < this.properties.linksCollection.length){
      var mainLinks: ILink[] = this.properties.linksCollection.slice(0,this.properties.linksLimit);
      var moreLinks: ILink[] = this.properties.linksCollection.slice(this.properties.linksLimit);
      this._renderLinks(mainLinks);
      mainContainer.innerHTML += `
        <div class="${ styles.viewMore }" style="color: ${this.properties.linkHoverColor}">
          <a style="color: ${this.properties.linkFontColor}">View More</a>
        </div>
      `;
      var viewMoreLink = this.domElement.querySelector(`.${styles.viewMore}`);
      viewMoreLink.addEventListener('click', () => {
        viewMoreLink.remove();
        this._renderLinks(moreLinks);
      });
    } else {
      this._renderLinks(this.properties.linksCollection);
    }
  }

  public render(): void {
    if(this.properties.linksCollection && this.properties.linksCollection.length) {
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
      this.domElement.innerHTML = `<div id="${ styles.svQuickLinks }" style="border-color: ${this.properties.borderColor}; background-color: ${this.properties.wpBkgndColor}" />`;
      this._renderBody();
    } else {
      GlobalFunctions.displayError(this.domElement, this.context, this.displayMode, "Links collection is empty","Open edit pane and edit links collection.",true);
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
                PropertyFieldCollectionData("linksCollection", {
                  key: "linksCollection",
                  label: strings.linksCollectionLabel,
                  manageBtnLabel: strings.linksCollectionManageBtnLabel,
                  panelHeader: strings.linksCollectionPanelHeader,
                  value: this.properties.linksCollection,
                  fields: [
                    {
                      id: "Label",
                      title: "Label",
                      type: CustomCollectionFieldType.string,
                      required: true
                    },
                    {
                      id: "Url",
                      title: "Url",
                      type: CustomCollectionFieldType.url,
                      required: true
                    },
                    {
                      id: "NewTab",
                      title: "Open in new tab",
                      type: CustomCollectionFieldType.boolean
                    }
                  ]
                }),
                PropertyFieldNumber('linksLimit', {
                  key: "linksLimit",
                  label: strings.linksLimitFieldLabel,
                  description: strings.linksLimitFieldDescription,
                  value: this.properties.linksLimit,
                  maxValue: 30,
                  minValue: 1
                })
              ]
            },
            {
              groupName: strings.colorGroupName,
              groupFields: [
                PropertyFieldColorPicker('wpBkgndColor', {
                  key: 'wpBkgndColor',
                  label: strings.wpBkgndColorFieldLabel,
                  selectedColor: this.properties.wpBkgndColor,
                  style: PropertyFieldColorPickerStyle.Full,
                  iconName: 'Color',
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  properties: this.properties
                }),
                PropertyFieldColorPicker('borderColor', {
                  key: 'borderColor',
                  label: strings.borderColorFieldLabel,
                  selectedColor: this.properties.borderColor,
                  style: PropertyFieldColorPickerStyle.Full,
                  iconName: 'Color',
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  properties: this.properties
                }),
                PropertyFieldColorPicker('titleBkgndColor', {
                  key: 'titleBkgndColor',
                  label: strings.titleBkgndColorFieldLabel,
                  selectedColor: this.properties.titleBkgndColor,
                  style: PropertyFieldColorPickerStyle.Full,
                  iconName: 'Color',
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  properties: this.properties
                }),
                PropertyFieldColorPicker('titleFontColor', {
                  key: 'titleFontColor',
                  label: strings.titleFontColorFieldLabel,
                  selectedColor: this.properties.titleFontColor,
                  style: PropertyFieldColorPickerStyle.Full,
                  iconName: 'Color',
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  properties: this.properties
                }),
                PropertyFieldColorPicker('linkFontColor', {
                  key: 'linkFontColor',
                  label: strings.linkFontColorFieldLabel,
                  selectedColor: this.properties.linkFontColor,
                  style: PropertyFieldColorPickerStyle.Full,
                  iconName: 'Color',
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  properties: this.properties
                }),
                PropertyFieldColorPicker('linkHoverColor', {
                  key: 'linkHoverColor',
                  label: strings.linkHoverColorFieldLabel,
                  selectedColor: this.properties.linkHoverColor,
                  style: PropertyFieldColorPickerStyle.Full,
                  iconName: 'Color',
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  properties: this.properties
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
