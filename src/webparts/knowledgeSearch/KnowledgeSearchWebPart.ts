import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'KnowledgeSearchWebPartStrings';
import KnowledgeSearch from './components/KnowledgeSearch';
import { IKnowledgeSearchProps } from './components/IKnowledgeSearchProps';

export interface IKnowledgeSearchWebPartProps {
  title: string;
}

export default class KnowledgeSearchWebPart extends BaseClientSideWebPart<IKnowledgeSearchWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IKnowledgeSearchProps > = React.createElement(
      KnowledgeSearch,
      {
        title: this.properties.title
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          groups: [
            {
              groupFields: [
                PropertyPaneTextField('title', {
                  label: strings.TitleFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
