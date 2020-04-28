//import { Version } from '@microsoft/sp-core-library';
import { UrlQueryParameterCollection, Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';


import styles from './HelloWorldWebPart.module.scss';
import * as strings from 'HelloWorldWebPartStrings';
import * as marked from 'marked';

import { SPComponentLoader } from '@microsoft/sp-loader';

//import 'jquery';
import * as js_swiper from 'swiper';



import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';

require('SwiperMin');
require('MyScript');
require('swiper');
//require('bootstrap');
/*
require('sp-init');
require('microsoft-ajax');
require('sp-runtime');
require('sharepoint');
*/


import * as $ from 'jquery';
//require('../../../node_modules/jquery-ui/ui/widgets/accordion');

export interface IHelloWorldWebPartProps {
  description: string;
}

export default class HelloWorldWebPart extends BaseClientSideWebPart <IHelloWorldWebPartProps> {


  public render(): void {
    SPComponentLoader.loadCss('https://use.fontawesome.com/releases/v5.0.9/css/all.css');
    SPComponentLoader.loadCss('https://unpkg.com/swiper/css/swiper.css');
    //SPComponentLoader.loadCss("https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css");
    
    //SPComponentLoader.loadScript('HelloWorldWebPart.src');
    

    var currentPageUrl = this.context.pageContext.site.serverRequestPath;
    var html:string='';
    html=`
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
    <a href="${this.context.pageContext.site.absoluteUrl}/SitePages/Forms/News.aspx" target="_blank">View All News</a>
  <div>
`;
    this.domElement.innerHTML = html;



  $(this.domElement).ready(()=>{
    console.debug(Date.now(), '$(this.domElement).ready executed');
    //js_swiper.greeting();
    LoadImages();
  //  alert('corriendo');
  });
 //inicio
 function LoadImages(){
  $.ajax({
          url: this.context.pageContext.web + 
          "/_api/web/lists/getByTitle('imageSliderLib')/Items?$select=Title,FileLeafRef,FileDirRef,Description0",
          type: "GET",
          headers: {              
          "accept": "application/json;odata=verbose",         
          },
          success:  this.success,
          error: this.failed 
      }
      );
}           

function success(data, args)
{
  var pictureArray = new Array();
  var pictureCount = 0;
  var descCount = 0;
  var descriptionArray = new Array();
  var results = data.d.results;
  
  for(var i=0; i<results.length; i++) { 

      var filename = results[i].FileLeafRef  ;

      var fullFileURL=this.context.pageContext.web +"/imageSliderLib/"+filename;

      pictureArray[pictureCount++] = fullFileURL;
descriptionArray[descCount++] = results[i].Description0;

  }
  var newHtml = '';
 
  for(i=0; i<pictureArray.length; i++) 
  
  {
      
      if(i==0)
      {
          $('#img1').attr('src',pictureArray[i]);
          $('#desc1').text(descriptionArray[i]);
      }
      else if(i==1)
      {
          $('#img2').attr('src',pictureArray[i]);
          $('#desc2').text(descriptionArray[i]);
      }
      else if(i==2)
      {
          $('#img3').attr('src',pictureArray[i]);
          $('#desc3').text(descriptionArray[i]);
      }
      else if(i==3)
      {
          $('#img4').attr('src',pictureArray[i]);
          $('#desc4').text(descriptionArray[i]);
      }
      else if(i==4)
      {
          $('#img5').attr('src',pictureArray[i]);
          $('#desc5').text(descriptionArray[i]);
      }            
  }             
}

function failed(sender, args) {
  alert('failed');
}
 //fin

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
