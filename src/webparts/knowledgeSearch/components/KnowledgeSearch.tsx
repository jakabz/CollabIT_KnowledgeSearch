import * as React from 'react';
import styles from './KnowledgeSearch.module.scss';
import { IKnowledgeSearchProps } from './IKnowledgeSearchProps';
import {  UrlQueryParameterCollection } from '@microsoft/sp-core-library';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox';
import { Dropdown } from 'office-ui-fabric-react/lib/Dropdown';
import Pagination from 'office-ui-fabric-react-pagination';
import {
  Label,
  IComboBoxOption
} from 'office-ui-fabric-react/lib/index';

export interface IKnowledgeSearchState {
  listData: any;
  listItems: any;
  titleFilter: string;
  processFilter: any;
  productFilter: any;
  targetFilter: any;
  keywordsFilter: any;
  filteredList: any;
  actPage: number;
  pageSize: number;
}

const queryParameters = new UrlQueryParameterCollection(window.location.href);

export default class KnowledgeSearch extends React.Component<IKnowledgeSearchProps, IKnowledgeSearchState> {
  constructor(props: IKnowledgeSearchProps) {
    super(props);
    this.state = {
      listData: this.props.list,
      listItems: this.props.listItems,
      filteredList: [],
      titleFilter: queryParameters.getValue("title") ? queryParameters.getValue("title"):'',
      processFilter: "",
      productFilter: "",
      targetFilter: "",
      keywordsFilter: "",
      actPage: 1, 
      pageSize: 10
    };
  }

  private _tagsArray = [{key:'', text:'Select an option'}];

  private tagCloud = this.props.listItems.map(item => {
    item.TaxKeyword.map(elem => {
      this._tagsArray.push(elem.Label);
    });
  }); 

  private _selectedTags: any;
  private _enterTitle: string = '';
  private items: any[] = [];
  
  public render(): React.ReactElement<IKnowledgeSearchProps> {
    console.info(this.state);
    
    let OptionsProcess: IComboBoxOption[] = this.props.list[0].Choices.map((item,i) => {
      return { key: item, text: item };
    });
    let OptionsProduct: IComboBoxOption[] = this.props.list[1].Choices.map((item,i) => {
      return { key: item, text: item };
    });
    let OptionsTarget: IComboBoxOption[] = this.props.list[2].Choices.map((item,i) => {
      return { key: item, text: item };
    });
    let OptionsTagsArr = [];
    let OptionsTags: IComboBoxOption[] = [];
    
    this.props.listItems.map((item,i) => {
      item.TaxKeyword.map((elem,e) => {
        if(OptionsTagsArr.indexOf(elem.Label) == -1){
          OptionsTags.push({ key: elem.Label, text: elem.Label });
          OptionsTagsArr.push(elem.Label);
        }
      });
    });
    OptionsProcess = [{key:'',text:'Select an option'}, ...OptionsProcess];
    OptionsProduct = [{key:'',text:'Select an option'}, ...OptionsProduct];
    OptionsTarget = [{key:'',text:'Select an option'}, ...OptionsTarget];
    OptionsTags = [{key:'',text:'Select an option'}, ...OptionsTags];


    let filteredList = this.props.listItems
      .filter(item => item.Title.toLowerCase().indexOf(this.state.titleFilter.toLowerCase()) > -1)
      .filter(item => this.state.processFilter == "" ? 1==1 : item.Process == this.state.processFilter)
      .filter(item => this.state.productFilter == "" ? 1==1 : item.Product == this.state.productFilter)
      .filter(item => this.state.targetFilter == "" ? 1==1 : item.TargetAudience == this.state.targetFilter)
      .filter(item => this.state.keywordsFilter == "" ? 1==1 : checkTaxKeyword(item,this.state.keywordsFilter));

    function checkTaxKeyword(item,filter):boolean {
      var result = false;
      item.TaxKeyword.map((elem) => {
        if(elem.Label == filter){
          result = true;
        }
      });
      return result;
    }

    function getTaxKeyword(item):string {
      var result = '';
      item.TaxKeyword.map((elem) => {
          result += elem.Label+', ';
      });
      result = result.slice(0,-2);
      return result;
    }

    this.items = filteredList.map((item, key) => {
      var tags = getTaxKeyword(item);
      if(key < this.state.actPage * this.state.pageSize && key >= (this.state.actPage-1) * this.state.pageSize)
      return <div className={styles.resultItem} onClick={() => location.href = item.FileRef}>
        <div className={styles.resultItemIconDiv} style={item.BannerImageUrl?{backgroundImage: `url(${item.BannerImageUrl.Url})`}:{}}>
          {item.BannerImageUrl? '' : <Icon iconName={'KnowledgeArticle'} className={styles.resultItemIcon} />}
        </div>
        <div className={styles.resultItemDesc}>
          <h4 className={styles.resultItemTitle}>{item.Title}</h4>
          <div className={styles.resultItemProps}><i>Process:</i> <strong>{item.Process}</strong></div>
          <div className={styles.resultItemProps}><i>Product:</i> <strong>{item.Product}</strong></div>
          <div className={styles.resultItemProps}><i>Target audience:</i> <strong>{item.TargetAudience}</strong></div>
          <div className={styles.resultItemProps}><i>Enterprise Keywords:</i> <strong>{tags}</strong></div>
        </div>
        <div className={styles.clear}></div>
      </div>
    });

    return (
      <div className={ styles.knowledgeSearch }>
        <div className={styles.wptitle}>
          <Icon iconName={'PageListFilter'} className={styles.wptitleIcon} />
          <span>{this.props.title}</span>
        </div>
        <div className={ styles.searchBar }>
          <div className={ styles.titleSearch }>
            <Label htmlFor={"titleFilter"}>Title</Label>
            <SearchBox
              id={"titleFilter"}
              placeholder="Search in Title"
              value={this.state.titleFilter} 
              onChange={(value) => this.setState({titleFilter: value, actPage:1})}
            />
          </div>
          <div className={ styles.dropdown }>
            <Dropdown
              label="Process"
              selectedKey={this.state.processFilter}
              onChange={(event, item) => this.setState({processFilter: item.key, actPage:1})}
              placeholder="Select an option"
              options={OptionsProcess}
              styles={{ dropdown: { width: '100%' } }}
            />
          </div>
          <div className={ styles.dropdown }>
            <Dropdown
              label="Product"
              selectedKey={this.state.productFilter}
              onChange={(event, item) => this.setState({productFilter: item.key, actPage:1})}
              placeholder="Select an option"
              options={OptionsProduct}
              styles={{ dropdown: { width: '100%' } }}
            />
          </div>
          <div className={ styles.dropdown }>
            <Dropdown
              label="Target audience"
              selectedKey={this.state.targetFilter}
              onChange={(event, item) => this.setState({targetFilter: item.key, actPage:1})}
              placeholder="Select an option"
              options={OptionsTarget}
              styles={{ dropdown: { width: '100%' } }}
            />
          </div>
          <div className={ styles.dropdown }>
            <Dropdown
              label="Enterprise Keywords"
              selectedKey={this.state.keywordsFilter}
              onChange={(event, item) => this.setState({keywordsFilter: item.key, actPage:1})}
              placeholder="Select an option"
              options={OptionsTags}
              styles={{ dropdown: { width: '100%' } }}
            />
          </div>
        </div>
        <div className={ styles.details }>
          {this.items}
        </div>
        {this.items.length > this.state.pageSize ? 
        <div className={ styles.paginator }>
          <Pagination
            currentPage={this.state.actPage}
            totalPages={this.items.length % this.state.pageSize != 0 ? Math.round(this.items.length / this.state.pageSize)+1: this.items.length / this.state.pageSize}
            hidePreviousAndNextPageLinks={true}
            hideFirstAndLastPageLinks={true}
            onChange={(page) => this.setState({ actPage: page })}
          />
        </div>
        : ''}
      </div>
    );
  }
}
