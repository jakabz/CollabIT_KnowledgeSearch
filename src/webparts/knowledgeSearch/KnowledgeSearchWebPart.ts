import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';
import { sp } from "@pnp/sp";

import * as strings from 'KnowledgeSearchWebPartStrings';
import KnowledgeSearch from './components/KnowledgeSearch';
import { IKnowledgeSearchProps } from './components/IKnowledgeSearchProps';

export interface IKnowledgeSearchWebPartProps {
  title: string;
}

export default class KnowledgeSearchWebPart extends BaseClientSideWebPart<IKnowledgeSearchWebPartProps> {

  public render(): void {
    sp.setup({
      spfxContext: this.context
    });
    const includeFields = [ 'Process', 'Product', 'Target audience', 'Enterprise Keywords' ];
    let filter = `${includeFields.map(field => `Title eq '${field}'`).join(' or ')}`;
    sp.web.lists.getByTitle('Knowledge base').fields.filter(filter).get().then((listData: any[]) => {
      sp.web.lists.getByTitle('Knowledge base').items.filter('FSObjType ne 1').select("Title", "Process", "Product", "TargetAudience", "TaxKeyword", "FileRef", "BannerImageUrl").get().then((listItems: any[]) => {
        const element: React.ReactElement<IKnowledgeSearchProps > = React.createElement(
          KnowledgeSearch,
          {
            title: this.properties.title,
            listItems: listItems,
            list: listData
          }
        );

        ReactDom.render(element, this.domElement);
      });
    });
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
