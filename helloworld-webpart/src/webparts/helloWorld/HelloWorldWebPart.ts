//import { Version } from '@microsoft/sp-core-library';
import { UrlQueryParameterCollection, Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './HelloWorldWebPart.module.scss';
import * as strings from 'HelloWorldWebPartStrings';

import { SPComponentLoader } from '@microsoft/sp-loader';

import 'jquery';

require('SwiperMin');
require('MyScript');
require('swiper');


import * as $ from 'jquery';
//require('../../../node_modules/jquery-ui/ui/widgets/accordion');

export interface IHelloWorldWebPartProps {
  description: string;
}

export default class HelloWorldWebPart extends BaseClientSideWebPart <IHelloWorldWebPartProps> {

  public render(): void {
    SPComponentLoader.loadCss('https://use.fontawesome.com/releases/v5.0.9/css/all.css');
    SPComponentLoader.loadCss('https://unpkg.com/swiper/css/swiper.css');
    this.domElement.innerHTML = `
      
      <div class="${ styles["swiper-container"]} ${ styles["gallery-top"]} ">
      <div class="${ styles["swiper-wrapper"]} ">
        <div class="${ styles["swiper-slide"]} " style="background-image:url(https://picsum.photos/1024/768?random=1)"></div>
        <div class="${ styles["swiper-slide"]} " style="background-image:url(https://picsum.photos/1024/768?random=2)"></div>
        <div class="${ styles["swiper-slide"]} " style="background-image:url(https://picsum.photos/1024/768?random=3)"></div>
        <div class="${ styles["swiper-slide"]} " style="background-image:url(https://picsum.photos/1024/768?random=4)"></div>
        <div class="${ styles["swiper-slide"]} " style="background-image:url(https://picsum.photos/1024/768?random=5)"></div>
        <div class="${ styles["swiper-slide"]} " style="background-image:url(https://picsum.photos/1024/768?random=6)"></div>
        <div class="${ styles["swiper-slide"]} " style="background-image:url(https://picsum.photos/1024/768?random=7)"></div>
        <div class="${ styles["swiper-slide"]} " style="background-image:url(https://picsum.photos/1024/768?random=8)"></div>
        <div class="${ styles["swiper-slide"]} " style="background-image:url(https://picsum.photos/1024/768?random=9)"></div>
        <div class="${ styles["swiper-slide"]} " style="background-image:url(https://picsum.photos/1024/768?random=10)"></div>
      </div>
      <!-- Add Arrows -->
      <div class="${ styles["swiper-button-next"]} ${ styles["swiper-button-white"]} swiper-button-next swiper-button-white"></div>
      <div class="${ styles["swiper-button-prev"]} ${ styles["swiper-button-white"]} swiper-button-prev swiper-button-white"></div>
    </div>
    <div class="${ styles["swiper-container"]} ${ styles["gallery-thumbs"]} ">
      <div class="${ styles["swiper-wrapper"]} ">
      <div class="${ styles["swiper-slide"]} swiper-slide" style="background-image:url(https://picsum.photos/1024/768?random=1)">1</div>
      <div class="${ styles["swiper-slide"]} swiper-slide" style="background-image:url(https://picsum.photos/1024/768?random=2)">2</div>
      <div class="${ styles["swiper-slide"]} swiper-slide" style="background-image:url(https://picsum.photos/1024/768?random=3)">3</div>
      <div class="${ styles["swiper-slide"]} swiper-slide" style="background-image:url(https://picsum.photos/1024/768?random=4)">4</div>
      <div class="${ styles["swiper-slide"]} swiper-slide" style="background-image:url(https://picsum.photos/1024/768?random=5)">5</div>
      <div class="${ styles["swiper-slide"]} swiper-slide" style="background-image:url(https://picsum.photos/1024/768?random=6)">6</div>
      <div class="${ styles["swiper-slide"]} swiper-slide" style="background-image:url(https://picsum.photos/1024/768?random=7)">7</div>
      <div class="${ styles["swiper-slide"]} swiper-slide" style="background-image:url(https://picsum.photos/1024/768?random=8)">8</div>
      <div class="${ styles["swiper-slide"]} swiper-slide" style="background-image:url(https://picsum.photos/1024/768?random=9)">9</div>
      <div class="${ styles["swiper-slide"]} swiper-slide" style="background-image:url(https://picsum.photos/1024/768?random=10)">10</div>
      </div>
      
    </div>
    <div class="${styles.linktoviewallnews}" id="_linktoviewallnews">
      <a href="https://taysdragon.sharepoint.com/sites/SPFXProject/SitePages/Forms/News.aspx">View All News</a>
    <div>
    <!-- Initialize Swiper -->
    <script>
      var galleryThumbs = new Swiper('.gallery-thumbs', {
        spaceBetween: 10,
        slidesPerView: 4,
        freeMode: true,
        watchSlidesVisibility: true,
        watchSlidesProgress: true,
      });
      var galleryTop = new Swiper('.gallery-top', {
        spaceBetween: 10,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        thumbs: {
          swiper: galleryThumbs
        }
      });
    </script>
  `;



  $(this.domElement).ready(()=>{
    require('MyScript');
    console.debug(Date.now(), '$(this.domElement).ready executed');
    
  //  alert('corriendo');
  });


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
                label: strings.DescriptionFieldLabel
              })
            ]
          }
        ]
      }
    ]
  };
}
}
