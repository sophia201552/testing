import React from 'react';
import { connect } from 'react-redux';
import I from 'seamless-immutable';
import DropdownList from '../../../components/DropdownList';
import Tree from '../../../components/Tree';
import Pagination from '../../../components/Pagination';
import { Tabs, TabPane } from '../../../components/Tabs';
import SearchInput from '../../../components/SearchInput';
import Select from '../../../components/Select';
import CustomSpinner from '../../../components/CustomSpinner';
import { ApiFetch } from '../../../service/apiFetch';
import { getDataSourceList, getTagDict } from '../../../redux/epics/home.js';

import s from './DataSourcePane.css';
const css = (className1, className2 = '') => {
  return className1
    .split(' ')
    .map(v => s[v])
    .concat(className2.split(' '))
    .join(' ')
    .trim();
};

class TagSearchInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValues: []
    };
    this._onVlaueChange = this._onVlaueChange.bind(this);
    this._onSearch = this._onSearch.bind(this);
  }
  componentDidMount() {
    this.componentWillReceiveProps(this.props);
  }

  componentWillReceiveProps(nextProps) {
    const { searchValue } = nextProps;
  }
  render() {
    const { tagDict, height = 42, searchValue = [], i18n } = this.props;
    let tags = [],tagParents=new Set(['Custom']);
    tagDict.forEach(v => {
      tags.push(v.groupNm);
      tagParents.add(v.groupNm);
      tags = tags.concat(v.tags.map(t => t.name));
    });
    let selectedTags = Array.isArray(searchValue)?searchValue:[];
    let customTags = selectedTags.filter(v=>tags.indexOf(v)<0);
    tags = tags.concat(['Custom',...customTags]);
    let options = I.asMutable(
      Array.from(new Set(tags)).map(
        v => ({ key: v, text: v, type:tagParents.has(v)?'header':'item'})
      )
    );
    return (
      <div
        style={{ height: `${height}px`, lineHeight: `${height}px` }}
        className={css('clear tagSearchWrap')}
      >
        <div className={css('searchContent')}>
          <Select
            selectedKeys={searchValue}
            onChanged={this._onVlaueChange}
            options={options}
            skin={'black'}
          />
        </div>
        <div className={css('searchBtn')} onClick={this._onSearch}>
          {i18n.SEARCH}
        </div>
      </div>
    );
  }
  _onVlaueChange(selectedKeys, isAdd, item, items) {
    const { onChange = () => {} } = this.props;
    onChange(items.map(v => v.text));
  }
  _onSearch() {
    const { onSearch = () => {} } = this.props;
    onSearch();
  }
}
class DataSourcePane extends React.Component {
  constructor(props) {
    super(props);
    this.activePanel = 'tag';
    this.getDataSourceGroupAsync = undefined;
    this.getTagDictAsync = undefined;
    this.state = {
      selectedProjectId: undefined,
      projectList: [],
      spinner: true,
      //tag面板相关
      treeItems: [],
      parentsMap: {},
      expandedKeys: [],
      searchTagVal: [],
      searchTagRs: undefined,
      //tag搜索分页相关
      searchTagCurrentPage: 1,
      //数据源面板相关
      currentPage: 1,
      pageSize: 20,
      dataSourceMap: {},
      searchDataVal: '',
      searchSourceMap: {},
      total: {}
    };
    this._onChangeProjectId = this._onChangeProjectId.bind(this);
    this._onTabChange = this._onTabChange.bind(this);
    this._onDragStartTag = this._onDragStartTag.bind(this);
    this._onDragStartData = this._onDragStartData.bind(this);
    this._onPageChange = this._onPageChange.bind(this);
    this._onDataSearch = this._onDataSearch.bind(this);
    this._onTagSearch = this._onTagSearch.bind(this);
    this._onTagSearchChange = this._onTagSearchChange.bind(this);
    this._onTagDbClick = this._onTagDbClick.bind(this);
    this._onSearchTagPageChange = this._onSearchTagPageChange.bind(this);
  }
  componentDidMount() {
    this.componentWillReceiveProps(this.props);
  }

  componentWillReceiveProps(nextProps) {
    const {
      getDataSourceList,
      getTagDict,
      selectedDataSourceProjectId,
      dataSourceList,
      tagDict
    } = nextProps;
    let nextState = {};
    let projectList = window.appConfig.projectList
        .map(v => ({
          key: v.id,
          text: v.name_cn + ' #' + v.id
        })),
      selectedProjectId =
        this.state.selectedProjectId || selectedDataSourceProjectId;

    nextState.projectList = projectList;
    nextState.spinner = true;
    this.setState(nextState);
    if (tagDict.length == 0 && this.getTagDictAsync == undefined) {
      this.getTagDictAsync = getTagDict();
    } else {
      this.getTagDictAsync = undefined;
      this.changeProject(nextProps, selectedProjectId);
    }
  }
  componentWillUpdate(nextProps, nextState) {}
  shouldComponentUpdate() {
    return true;
  }

  render() {
    const {
      treeItems,
      projectList,
      selectedProjectId,
      expandedKeys,
      spinner,
      currentPage,
      pageSize,
      dataSourceMap,
      total,
      searchDataVal,
      searchTagVal,
      searchTagRs,
      searchTagCurrentPage
    } = this.state;
    const { tagDict, i18n } = this.props;
    let dataFlag = `${selectedProjectId}_${searchDataVal}`;
    return (
      <div id="dataSourcePanel" className={s['dataSourcePanel']}>
        <Tabs onChange={this._onTabChange}>
          <TabPane tab={i18n.TAG} keyId="tag">
            <div style={{ width: '100%', height: '32px' }}>
              <DropdownList
                selectedKey={selectedProjectId}
                onChanged={this._onChangeProjectId}
                placeHolder="No Selected"
                options={projectList}
                search={true}
              />
            </div>
            <div
              style={{
                width: '100%',
                height: '42px'
              }}
            >
              <TagSearchInput
                searchValue={searchTagVal}
                tagDict={tagDict}
                onSearch={this._onTagSearch}
                onChange={this._onTagSearchChange}
                i18n={i18n}
              />
            </div>
            {searchTagRs ? (
              <div
                style={{
                  width: '100%',
                  height: 'calc(100% - 74px)',
                  overflowY: 'hidden'
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: 'calc(100% - 32px)',
                    overflowY: 'auto'
                  }}
                >
                  <Tree
                    items={searchTagRs
                      .filter(
                        (v, i) =>
                          i >= (searchTagCurrentPage - 1) * pageSize &&
                          i < searchTagCurrentPage * pageSize
                      )
                      .map(v => ({
                        id: v._id,
                        name: v.name,
                        parent: 0,
                        isParent: 0,
                        tags: v.tag,
                        info: v
                      }))}
                    leafIcon={
                      <i
                        className="ms-Icon ms-Icon--Questionnaire"
                        aria-hidden="true"
                      />
                    }
                    draggable={true}
                    skin={'color-white'}
                    onDragStart={this._onDragStartTag}
                  />
                </div>
                <div style={{ width: '100%', height: '32px' }}>
                  <Pagination
                    current={searchTagCurrentPage}
                    pageSize={pageSize}
                    total={searchTagRs.length}
                    onChange={this._onSearchTagPageChange}
                    continuityNum={0}
                    localText={{  prev: i18n.PREVIOUS_PAGE, next: i18n.NEXT_PAGE}}
                    skin={'blackSkin'}
                  />
                </div>
              </div>
            ) : (
              <div
                style={{
                  width: '100%',
                  height: 'calc(100% - 74px)',
                  overflowY: 'auto'
                }}
              >
                <Tree
                  indent={8}
                  items={treeItems}
                  folderIconOpen={
                    <i
                      className="ms-Icon ms-Icon--OpenFolderHorizontal"
                      aria-hidden="true"
                    />
                  }
                  folderIconClose={
                    <i
                      className="ms-Icon ms-Icon--FabricFolder"
                      aria-hidden="true"
                    />
                  }
                  leafIcon={
                    <i
                      className="ms-Icon ms-Icon--Questionnaire"
                      aria-hidden="true"
                    />
                  }
                  expandedKeys={expandedKeys}
                  draggable={true}
                  onDragStart={this._onDragStartTag}
                  onExpand={this._onExpand.bind(this)}
                  onDbClick={this._onTagDbClick}
                  skin={'color-white'}
                />
              </div>
            )}

            <CustomSpinner visible={spinner} />
          </TabPane>
          <TabPane tab={i18n.DATA_SOURCE} keyId="source">
            <div style={{ width: '100%', height: '32px' }}>
              <DropdownList
                selectedKey={selectedProjectId}
                onChanged={this._onChangeProjectId}
                placeHolder="No Selected"
                options={projectList}
                search={true}
              />
            </div>
            <SearchInput height={42} onClick={this._onDataSearch} />
            <div
              style={{
                width: '100%',
                height: 'calc(100% - 106px)',
                overflowY: 'auto'
              }}
            >
              <Tree
                items={
                  (dataSourceMap[dataFlag] &&
                    dataSourceMap[dataFlag][currentPage]) ||
                  []
                }
                leafIcon={
                  <i
                    className="ms-Icon ms-Icon--Questionnaire"
                    aria-hidden="true"
                  />
                }
                draggable={true}
                skin={'color-white'}
                onDragStart={this._onDragStartData}
              />
            </div>
            <div style={{ width: '100%', height: '32px' }}>
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={total[dataFlag] || 1}
                onChange={this._onPageChange}
                continuityNum={0}
                localText={{ prev: i18n.PREVIOUS_PAGE, next: i18n.NEXT_PAGE }}
                skin={'blackSkin'}
              />
            </div>
            <CustomSpinner visible={spinner} />
          </TabPane>
        </Tabs>
      </div>
    );
  }
  _getTagSearchList(selectedProjectId, tags) {
    const { getTagSearchList } = this.props;
    if (this.activePanel == 'tag') {
      if (tags.length == 0) {
        this.setState({
          searchTagRs: undefined,
          searchTagCurrentPage: 1
        });
        return;
      }
      this.setState({
        spinner: true,
        searchTagCurrentPage: 1
      });
      apiFetch.getTagSearchList(selectedProjectId, tags).subscribe({
        fail: rs => {
          console.log(rs);
        },
        next: rs => {
          this.setState({
            spinner: false,
            searchTagRs: rs.data
          });
        }
      });
    }
  }
  _getDataSourceGroup(selectedProjectId, currentPage, searchDataVal) {
    const { pageSize, dataSourceMap, total } = this.state;
    if (this.activePanel == 'source') {
      let dataFlag = `${selectedProjectId}_${searchDataVal}`;
      if (!dataSourceMap[dataFlag] || !dataSourceMap[dataFlag][currentPage]) {
        this.setState({
          spinner: true
        });
        this.getDataSourceGroupAsync = apiFetch
          .getDataSourceGroup(
            selectedProjectId,
            currentPage,
            pageSize,
            searchDataVal
          )
          .subscribe({
            fail: rs => {
              this.getDataSourceGroupAsync = undefined;
              console.log(rs);
            },
            next: rs => {
              this.getDataSourceGroupAsync = undefined;
              let newMap = Object.assign({}, dataSourceMap, {
                [dataFlag]: Object.assign(dataSourceMap[dataFlag] || {}, {
                  [currentPage]: rs.data.pointTable.map(v => ({
                    id: v._id,
                    name: v.value,
                    parent: 0,
                    isParent: 0,
                    info: v
                  }))
                })
              });
              this.setState({
                spinner: false,
                dataSourceMap: newMap,
                total: Object.assign({}, total, {
                  [dataFlag]: rs.data.pointTotal
                })
              });
            }
          });
      }
    }
  }
  _onChangeProjectId(info) {
    let id = info.key;
    this.changeProject(this.props, id);
  }
  _onExpand(expandedKeys) {
    const {
      getDataSourceList,
      selectedDataSourceProjectId,
      dataSourceList
    } = this.props;
    const { parentsMap, selectedProjectId } = this.state;
    let spinner = false;
    expandedKeys.forEach(key => {
      if (!parentsMap[key]) {
        getDataSourceList(selectedProjectId, key);
        spinner = true;
      }
    });
    this.setState({
      expandedKeys,
      spinner
    });
  }
  _onTagDbClick(id, isParent, item) {
    const { expandedKeys } = this.state;
    if (isParent) {
      let set = new Set(expandedKeys);
      if (set.has(id)) {
        set.delete(id);
      } else {
        set.add(id);
      }
      this._onExpand(Array.from(set));
    }
  }
  _onDragStartTag(it, ev) {
    const { selectedProjectId } = this.state;
    let target = ev.target;

    let info = {};
    if (it.isParent == 0) {
      info.id = `@${selectedProjectId}|${it.info.name}`;
      info.name = it.info.name;
      info.tags = it.tags;
      ev.dataTransfer.setData('dragTagInfo', JSON.stringify(info));
    }else{
      ev.dataTransfer.setData('dragTagGroupInfo', JSON.stringify(it.info));
    }

    
  }
  _onDragStartData(it, ev) {
    const { selectedProjectId } = this.state;
    let target = ev.target;

    let info = {};
    info.id = `@${selectedProjectId}|${it.info.value}`;
    info.name = it.info.value;
    info.tags = [];
    ev.dataTransfer.setData('dragDsInfo', JSON.stringify(info));
  }
  _onTabChange(keyId) {
    this.activePanel = keyId;
    this.changeProject(this.props);
  }
  _onPageChange(num) {
    const { dataSourceMap, selectedProjectId, searchDataVal } = this.state;
    this._getDataSourceGroup(selectedProjectId, num, searchDataVal);
    this.setState({
      currentPage: num
    });
  }
  _onSearchTagPageChange(num) {
    this.setState({
      searchTagCurrentPage: num
    });
  }
  _onDataSearch(val) {
    const { searchDataVal, selectedProjectId, dataSourceMap } = this.state;
    if (searchDataVal != val) {
      this._getDataSourceGroup(selectedProjectId, 1, val);
      this.setState({
        searchDataVal: val,
        currentPage: 1
      });
    }
  }
  _onTagSearch() {
    const { searchTagVal, selectedProjectId } = this.state;
    this._getTagSearchList(selectedProjectId, searchTagVal);
  }
  _onTagSearchChange(selectedKeys) {
    this.setState({
      searchTagVal: selectedKeys
    });
  }
  changeProject(props, selectedProjectId) {
    selectedProjectId = selectedProjectId || this.state.selectedProjectId;
    const { getDataSourceList, dataSourceList, searchDataVal } = props;
    const { currentPage, pageSize, dataSourceMap } = this.state;
    let nextState = {};
    nextState.selectedProjectId = selectedProjectId;
    nextState.spinner = false;
    nextState.searchTagVal = [];
    nextState.searchTagRs = undefined;
    nextState.searchDataVal = '';
    nextState.currentPage = 1;
    nextState.searchTagCurrentPage = 1;
    if (this.activePanel == 'tag') {
      let treeItems = [],
        parentsMap = {};
      if (!dataSourceList[selectedProjectId]) {
        getDataSourceList(selectedProjectId);
        nextState.spinner = true;
      } else {
        treeItems = dataSourceList[selectedProjectId].map(v => {
          let obj = {
            id: v._id,
            name: `${v.name}${v.type == 'group' ? ` (${v.pointCount})` : ``}`,
            parent: v.prt || 0,
            isParent: v.type == 'group' ? 1 : 0,
            tags: v.tag,
            info: v
          };
          parentsMap[v.prt || 0] = parentsMap[v.prt || 0] || [];
          parentsMap[v.prt || 0].push(v._id);
          return obj;
        });
        nextState.spinner = false;
      }
      nextState.treeItems = treeItems;
      nextState.parentsMap = parentsMap;
    }
    this.setState(nextState);
    this._getDataSourceGroup(selectedProjectId, 1, '');
  }
}
let mapDispatchToProps = {
  getDataSourceList,
  getTagDict
};

let mapStateToProps = function(state) {
  return {
    dataSourceList: state.home.dataSourceList,
    selectedDataSourceProjectId: state.home.selectedDataSourceProjectId,
    tagDict: state.home.tagDict
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DataSourcePane);
