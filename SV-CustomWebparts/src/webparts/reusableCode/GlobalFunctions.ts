import { Environment, EnvironmentType, UrlQueryParameterCollection, DisplayMode } from '@microsoft/sp-core-library';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import {
    SPHttpClient,
    SPHttpClientResponse
} from '@microsoft/sp-http';
import gStyles from './GlobalStyles.module.scss';

export default class GlobalFunctions {
    public static months: string[] = ["January","February","March","April","May","June","July","August","September","October","November","December"];

    public static days: string[] = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

    public static firstDayOfMonth(year: number, month: number): Date {
        return new Date(year, month, 1);
    }

    public static lastDayOfMonth(year: number, month: number): Date {
        return new Date(year, month + 1, 0);
    }

    public static getQueryStringParameter(theUrl: string, paramToRetrieve: string): string {
        if(theUrl.indexOf("?") != -1){
            var params = theUrl.split("?")[1].split("&");
            for (var i = 0; i < params.length; i = i + 1) {
                var singleParam = params[i].split("=");
                if (singleParam[0] == paramToRetrieve) {
                    return singleParam[1];
                }
            }
        }
        return '';
    }

    public static addDashesToGUID(theGUID: string): string{
        if(theGUID && theGUID.indexOf("-") == -1 && theGUID.length ==32){
            theGUID = theGUID.toLowerCase();
            return theGUID.substr(0,8)+"-"+theGUID.substr(8,4)+"-"+theGUID.substr(12,4)+"-"+theGUID.substr(16,4)+"-"+theGUID.substr(20);
        } else {
            return '';
        }
    }

    public static stripHtmlFromString(html){
        var doc = new DOMParser().parseFromString(html, 'text/html');
        var result = html;
        if(doc.body.textContent){
            result = doc.body.textContent;
        } else if (doc.body.innerText) {
            result = doc.body.innerText;
        }
        result = result.replace(/(<([^>]+)>)/ig,"");
        return result;
     }

     public static displayError(domElement: HTMLElement, context: WebPartContext, mode: DisplayMode, title: string, message: string, showButton: boolean): void {
        let html: string = `
            <div class="${gStyles.errorContainer}">
                <p class="${gStyles.errorTitle}">${title}</p>
                <p class="${gStyles.errorMessage}">${message}</p>
        `;
        if(showButton && mode == DisplayMode.Edit){
            html +=`<a class="${gStyles.errorButton}"><span>Edit web part</span></a>`;
        }
        html +=`
            </div>
        `; 
        
        domElement.innerHTML = html;
        if(showButton && mode == DisplayMode.Edit) {
            domElement.querySelector(`.${gStyles.errorButton}`).addEventListener('click', () => {
                if(!context.propertyPane.isPropertyPaneOpen())
                    context.propertyPane.open();
            });
        }
    }
}