import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './TeamsArkanoidWebPart.module.scss';
import * as strings from 'TeamsArkanoidWebPartStrings';

export interface ITeamsArkanoidWebPartProps {
  description: string;
}

export default class TeamsArkanoidWebPart extends BaseClientSideWebPart<ITeamsArkanoidWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  public render(): void {

    let title: string = '';
    let subTitle: string = '';
    let siteTabTitle: string = '';

    if (this.context.sdks.microsoftTeams) {
      this.domElement.innerHTML = `
      <div id="main" class="main">
        <canvas id="playField" width="1000" height="600"></canvas>
        <img id="background" src="${require('./assets/background.png')}"></img>
        <div id="display">
          <div id="score"></div>
          <button id="start">Start</button>
          <div id="info">Press play!</div>
        </div>
      </div>
      <script src="${require('../../index')}"></script>
    <style>
      :root {
        --width: 1000px;
        --height: 650px;
      }
  
      #main {
        position: relative;
        width: 1000px;
        margin: 0 auto;
        width: var(--width);
        height: var(--height);
        font-size: 32px;
        font-family: Arial, Helvetica, sans-serif;
      }
  
      canvas {
        position: absolute;
        left: 0;
        top: 0;
        z-index: 10;
        border-top: 1px solid grey;
        border-left: 1px solid grey;
        border-right: 1px solid grey;
        margin-bottom: 40px;
      }
  
      #display {
        position: absolute;
        bottom: 0;
        display: flex;
        justify-content: space-between;
        width: var(--width);
      }
  
      #score,
      #info {
        width: 200px;
      }
    </style>`;
    }
    else{
    this.domElement.innerHTML = `
    <div id="main" class="main">
      <canvas id="playField" width="1000" height="600"></canvas>
      <img id="background" src="${require('./assets/background.png')}"></img>
      <div id="display">
        <div id="score"></div>
        <button id="start">Start</button>
        <div id="info">Press play!</div>
      </div>
    </div>
    <script src="${require('../../index')}"></script>
  <style>
    :root {
      --width: 1000px;
      --height: 650px;
    }

    #main {
      position: relative;
      width: 1000px;
      margin: 0 auto;
      width: var(--width);
      height: var(--height);
      font-size: 32px;
      font-family: Arial, Helvetica, sans-serif;
    }

    canvas {
      position: absolute;
      left: 0;
      top: 0;
      z-index: 10;
      border-top: 1px solid grey;
      border-left: 1px solid grey;
      border-right: 1px solid grey;
      margin-bottom: 40px;
    }

    #display {
      position: absolute;
      bottom: 0;
      display: flex;
      justify-content: space-between;
      width: var(--width);
    }

    #score,
    #info {
      width: 200px;
    }
  </style>`;
  }
}

  protected onInit(): Promise<void> {
    this._environmentMessage = this._getEnvironmentMessage();

    return super.onInit();
  }



  private _getEnvironmentMessage(): string {
    if (!!this.context.sdks.microsoftTeams) { // running in Teams
      return this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsTabEnvironment;
    }

    return this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment;
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    this._isDarkTheme = !!currentTheme.isInverted;
    const {
      semanticColors
    } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
      this.domElement.style.setProperty('--link', semanticColors.link || null);
      this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || null);
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
