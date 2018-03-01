/**
 * 首页策略详情列表页
 */

/**
 * State
 *
 * items: strageyList数组
 * showDeleteModal: 是否显示删除的模态框
 * selectedItems: 选中的行
 */

/**
 * Event
 *
 * _onClick: 阻止 Toggle 按钮冒泡
 * _onChanged: 搜索策略
 * _selection: 获取当前选中行
 * showModal   显示添加 修改 删除模态框
 */

import React from 'react';
import $ from 'jquery';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import cx from 'classnames';
import { Sticky } from 'office-ui-fabric-react/lib/Sticky';

import {
  DetailsList,
  DetailsListLayoutMode,
  CheckboxVisibility,
  Selection
} from 'office-ui-fabric-react/lib/DetailsList';

import { ScrollablePane } from 'office-ui-fabric-react/lib/ScrollablePane';

import { Modal } from 'office-ui-fabric-react/lib/Modal';
import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { TextField } from 'office-ui-fabric-react/lib/TextField';

import { linkTo } from '../../../';
import { strategyTypeNames } from '../../../common/enum';
import {
  searchStrategyItem,
  updateStrategy,
  publishStrategyItem
} from '../../../redux/epics/home.js';

import CustomSpinner from '../../../components/CustomSpinner/CustomSpinner.js';
import Confirm from '../../../components/Confirm';

import TextToggle from '../../../components/TextToggle';

import CreateStrategyPanel from '../../CreateStrategyPanel';
import NoStrategyPromptPanel from '../../panels/NoStrategyPromptPanel';

import CreateStrategyModal from '../../modals/CreateStrategyModal';
import DeleteStrategyModal from '../../modals/DeleteStrategyModal';

import css from './StrategyList.css';
import { setLang } from '../../../components/I18n';
import { divProperties } from 'office-ui-fabric-react/lib/Utilities';

const columnStyles = {
  lineHeight: '40px'
};

class StrategyList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      items: props._items,
      showDeleteModal: false,
      selectedItems: [],
      showAddModal: false,
      spinner: false,
      isShowselectLan: false,
      showStrategyPanel: true
    };
    this.isShowStrategyPanel = this.isShowStrategyPanel.bind(this);
    this._onClick = this._onClick.bind(this);
    this._onChanged = this._onChanged.bind(this);
    this._onSearch = this._onSearch.bind(this);
    this._onRowDblClick = this._onRowDblClick.bind(this);
    this._publishStrategyItem = this._publishStrategyItem.bind(this);
    this.showModal = this.showModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.changetTabId = this.changetTabId.bind(this);
    this._changeLanguage = this._changeLanguage.bind(this);
    this._selection = new Selection({
      onSelectionChanged: () => {
        this.setState({
          selectedItems: this._selection.getSelection()
        });
        props.selectedItems(this._selection.getSelection());
      }
    });
    this._columns = [
      {
        key: 'name',
        name: props.i18n.NAME,
        minWidth: 120,
        onRender: item => <div style={columnStyles}>{item['name']}</div>
      },
      {
        key: 'status',
        name: props.i18n.STATE,
        minWidth: 100,
        maxWidth: 100,
        onRender: (item, index) => {
          return (
            <div
              onClick={this._onClick}
              style={{
                lineHeight: '36px'
              }}
            >
              <TextToggle
                defaultChecked={!!item.status}
                data-id={index}
                onClick={() =>
                  this._updateStrategy(item._id, item.status, item.creatorId)
                }
                offText="OFF"
                onText="ON"
                checked={item.status ? true : false}
              />
            </div>
          );
        }
      },
      {
        key: 'trigger',
        name: props.i18n.EXECUTION_CYCLE,
        minWidth: 120,
        maxWidth: 120,
        onRender: item => {
          return (
            <div style={columnStyles}>
              {item['trigger'].length == 0
                ? '--'
                : item['trigger'][0].type === 'once'
                  ? props.i18n.ONCE
                  : props.i18n.CYCLICAL}
            </div>
          );
        }
      },
      {
        key: 'lastRuntime',
        name: props.i18n.LAST_EXECUTION_TIME,
        minWidth: 150,
        maxWidth: 150,
        onRender: item => (
          <div style={columnStyles}>
            {item['lastRuntime'] === ''
              ? props.i18n.NEVER_EXECUTED
              : item['lastRuntime']}
          </div>
        )
      },
      {
        key: 'userFullName',
        name: props.i18n.MODIFIER,
        minWidth: 80,
        maxWidth: 80,
        onRender: item => <div style={columnStyles}>{item['userFullName']}</div>
      },
      {
        key: 'desc',
        name: props.i18n.DESCRIPTION,
        minWidth: 150,
        maxWidth: 150,
        onRender: item => (
          <div style={columnStyles}>
            {item['desc'] || props.i18n.NO_DESCRIPTION}
          </div>
        )
      },
      {
        key: 'syncStatus',
        name: props.i18n.PUBLISH_STATUS,
        minWidth: 120,
        maxWidth: 120,
        onRender: item => (
          <div style={columnStyles}>
            <span className={css['sync-status']}>
              {item.syncStatus === 0
                ? props.i18n.NO_PUBLISHED
                : props.i18n.PUBLISHED}
            </span>
          </div>
        )
      }
    ];
  }
  componentWillReceiveProps(nextProps) {
    const { selectedItems } = this.state;
    let realSelectedItem =
      selectedItems.length && selectedItems[0] !== undefined
        ? nextProps._items.find(row => {
            return row._id === selectedItems[0]._id;
          })
        : [];
    this.setState({
      items: nextProps._items,
      selectedItems: [realSelectedItem]
    });
    if (selectedItems.length && selectedItems[0] !== undefined) {
      this.setState({
        spinner: false
      });
    }
  }
  render(props) {
    let {
      items,
      showDeleteModal,
      showModal,
      showAddModal,
      selectedItems,
      spinner,
      isShowselectLan,
      showStrategyPanel
    } = this.state;
    const { i18n } = this.props;
    return (
      <div className={css['strategy-list-container']}>
        <div className={css['strategy-list-header']}>
          {/* <div
            className={css['add']}
            onClick={this.showModal.bind(this, 'add')}
          >
            <span>{i18n.ADD_STRATEGY}</span>
          </div> */}

          {/* <div 
            className={css['edit']}
            onClick={this.showModal.bind(this, 'edit')}
            >
            <div>
              <i className={'ms-Icon ms-Icon--Edit'} />
            </div>
          </div>
          <div className={css['icon-line']} /> */}

          <div
            className={css['toolName']}
            onClick={this.showModal.bind(this, 'delete')}
            title={i18n.DELETE}
          >
            <div>
              <i className={'ms-Icon ms-Icon--Delete'} />
            </div>
          </div>
          <div className={css['icon-line']} />
          <div
            className={css['toolName']}
            onClick={this._publishStrategyItem}
            title={i18n.PUBLISH}
          >
            <div className={css['publish']}>
              <i className={'ms-Icon ms-Icon--Send'} />
            </div>
          </div>
          <div className={css['language']}>
            <div onClick={this._selectedLanguage.bind(this)}>
              <span>
                {localStorage.getItem('language') == 'en'
                  ? i18n.ENGLISH
                  : i18n.CHINESE}
              </span>
              <i
                className={
                  'ms-Icon ms-Icon--ChevronDown ' + css['iconLanguage']
                }
              />
            </div>
            {isShowselectLan && (
              <div className={css['selectLan']} onClick={this._changeLanguage}>
                <span>
                  {localStorage.getItem('language') == 'en'
                    ? i18n.CHINESE
                    : i18n.ENGLISH}
                </span>
              </div>
            )}
          </div>
          <div className={css['search']}>
            <SearchBox onSearch={this._onSearch} onChange={this._onChanged} />
          </div>
        </div>
        <div className={css['strategy-list-content']}>
          <div style={{ position: 'relative', height: '100%' }}>
            <div className={css['add-strategy-panel']} style={{height: showStrategyPanel ? '250px' : '72px' }}>
              <CreateStrategyPanel changetTabId={this.changetTabId} showStrategyPanel={showStrategyPanel} isShowStrategyPanel={this.isShowStrategyPanel}/>
            </div>
            <div
              className={css['strategy-list']}
              style={{height: showStrategyPanel ? 'calc(100% - 280px)' : 'calc(100% - 102px)' }}
            >
            <ScrollablePane>
              <DetailsList
                headerClassName="strategy-list-header"
                items={items.asMutable()}
                columns={this._columns}
                setKey="_id"
                layoutMode={DetailsListLayoutMode.justified}
                selection={this._selection}
                selectionPreservedOnEmptyClick={true}
                onItemInvoked={this._onRowDblClick}
                checkboxVisibility={CheckboxVisibility.always}
                onRenderDetailsHeader={
                    (detailsHeaderProps, defaultRender) => (
                      <Sticky>
                        { defaultRender({
                          ...detailsHeaderProps,
                        }) }
                      </Sticky>
                    ) }
              />
                <NoStrategyPromptPanel items={items} />
            </ScrollablePane>

              
            </div>
          </div>
          <CustomSpinner visible={spinner} />
        </div>

        {/* <CreateStrategyModal
          showModal={showAddModal}
          closeModal={this.closeModal}
          changetTabId={this.changetTabId}
        /> */}

        <DeleteStrategyModal
          showModal={showDeleteModal}
          closeModal={this.closeModal}
          selectedItems={selectedItems}
        />
      </div>
    );
  }
  _changeLanguage() {
    appConfig.language = localStorage.getItem('language') == 'en' ? 'zh' : 'en';
    setLang(appConfig.language);
    location.reload(true);
  }
  _selectedLanguage() {
    this.setState({
      isShowselectLan: !this.state.isShowselectLan
    });
  }

  /** 切换状态时阻止冒泡 */
  _onClick(ev) {
    ev.preventDefault();
    ev.stopPropagation();
  }

  _onRowDblClick(event) {
    linkTo(`/painter/${event._id}`);
  }

  /** 搜索策略  */
  _onSearch(text) {
    this.props.searchStrategyItem(appConfig.project.id, text);
  }
  _onChanged(text) {
    if (text == '') {
      this.props.searchStrategyItem(appConfig.project.id, text);
    }
  }
  /** 切换状态 */
  _updateStrategy(id, status, creatorId) {
    this.props.updateStrategy(appConfig.project.id, id, {
      status: status === 1 ? 0 : 1,
      creatorId,
      lastModifierId: appConfig.user.id,
      userFullName: appConfig.userProfile.fullname,
      syncStatus: 0
    });
  }
  // 显示添加 修改 删除的模态框
  showModal(target) {
    const { i18n } = this.props;
    if (target === 'add') {
      this.setState({
        showAddModal: true
      });
    } else if (target === 'delete') {
      let selectedItems = this._selection.getSelection();
      if (selectedItems.length !== 0 && selectedItems[0] !== undefined) {
        this.setState({
          showDeleteModal: true,
          selectedItems
        });
      } else {
        Confirm({
          title: i18n.DELETE_TOOLTIP,
          type: 'info',
          onOk: () => {}
        });
        return;
      }
    }
  }

  isShowStrategyPanel(state){
    this.setState({
        showStrategyPanel: state =='hide' ? false : true 
    });
    //切换显隐 ==> table标题bug原生方法处理.
    $('.stickyContainer_c36881cb').css('top', state =='hide' ? '72px' : '250px');
  }

  // 点击修改发布状态
  _publishStrategyItem(e) {
    const { updateStrategy, publishStrategyItem, i18n } = this.props;
    let selectedItems = this._selection.getSelection(),
      ids = selectedItems.map(v => v._id),
      isFalse = selectedItems.every(v => v.syncStatus === 0);
    if (selectedItems.length <= 0 || !isFalse) {
      Confirm({
        title: i18n.IS_SYNCHRONIZATION,
        type: 'info',
        onOk: () => {}
      });
      return;
    } else {
      Confirm({
        title: i18n.PUBLISH_STRETEGY,
        content: i18n.CONFIRM_PUBLISH.replace(
          '{num}',
          selectedItems.map(v => v.name).join(', ')
        ),
        type: 'info',
        onOk: () => {
          updateStrategy(appConfig.project.id, ids, {
            creatorId: appConfig.user.id,
            userFullName: appConfig.userProfile.fullname,
            lastPublishtime: moment().format('YYYY-MM-DD HH:mm:ss')
          });
          this._spinner();
          publishStrategyItem(appConfig.project.id, ids);
        },
        onCancel: () => {}
      });
    }
  }
  _spinner() {
    this.setState({
      spinner: true
    });
  }
  closeModal() {
    this.setState({
      showAddModal: false,
      showDeleteModal: false
    });
  }
  changetTabId(tabId) {
    this.props.changeTabId(tabId);
  }
}

var mapDispatchToProps = {
  searchStrategyItem,
  updateStrategy,
  publishStrategyItem
};

var mapStateToProps = function(state) {
  return {
    _items: state.home.strategyList
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(StrategyList);
