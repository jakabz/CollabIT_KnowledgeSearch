import * as React from 'react';
import styles from './KnowledgeSearch.module.scss';
import { IKnowledgeSearchProps } from './IKnowledgeSearchProps';
import { escape } from '@microsoft/sp-lodash-subset';

export default class KnowledgeSearch extends React.Component<IKnowledgeSearchProps, {}> {
  public render(): React.ReactElement<IKnowledgeSearchProps> {
    return (
      <div className={ styles.knowledgeSearch }>
        <div className={ styles.container }>
          <div className={ styles.row }>
            <div className={ styles.column }>
              <span className={ styles.title }>Welcome to SharePoint!</span>
              <p className={ styles.subTitle }>Customize SharePoint experiences using Web Parts.</p>
              <p className={ styles.description }>{escape(this.props.title)}</p>
              <a href="https://aka.ms/spfx" className={ styles.button }>
                <span className={ styles.label }>Learn more</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
