/**
 * 列表页
 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as moment from 'moment';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox';
import { Callout } from 'office-ui-fabric-react/lib/Callout';
import { Modal } from 'office-ui-fabric-react/lib/Modal';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { Dropdown } from 'office-ui-fabric-react/lib/Dropdown';

import ObjectId from './../../../common/objectId.js';
import Tree from '../../../components/Tree';
import {
  addNewFile,
  getTemplateTree,
  getTemplates,
  setCondition,
  deleteTemplate,
  updateTemplate
} from './../../../redux/epics/template.js';
import { copyTemplateAddNew } from './../../../redux/epics/home.js';

import s from './StrategyTemplate.css';
// Nav
let _detailsHeaderList = [
  {
    name: '新建',
    className: 'add',
    iconName: 'AddEvent'
  },
  {
    name: '新建文件夹',
    className: 'new-team-project',
    iconName: 'NewTeamProject'
  },
  {
    name: '批量',
    className: 'document-management',
    iconName: 'DocumentManagement'
  },
  {
    name: '更多',
    className: 'caret-solid-down',
    iconName: 'CaretSolidDown'
  }
];
// props
// templateList
//中间那个白条
class TreeList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedKeys: [],
      expandedKeys: []
    };
  }
  componentDidMount() {
    this.componentWillReceiveProps(this.props);
  }
  componentWillReceiveProps(nextProps) {
    const { templateList, selectedId } = nextProps;
    let id;
    if (!selectedId) {
      id = 1;
    } else {
      id = selectedId;
    }
    this.setState({
      expandedKeys: [id],
      selectedKeys: [id]
    });
    this.props.selectedNav([id]);
  }
  render() {
    const { templateList, i18n } = this.props;
    const { selectedKeys, expandedKeys } = this.state;
    return (
      <div>
        <Tree
          items={templateList}
          folderIconOpen={
            <i
              className="ms-Icon ms-Icon--OpenFolderHorizontal"
              aria-hidden="true"
            />
          }
          folderIconClose={
            <i
              className="ms-Icon ms-Icon--OpenFolderHorizontal"
              aria-hidden="true"
            />
          }
          leafIcon={
            <i className="ms-Icon ms-Icon--Questionnaire" aria-hidden="true" />
          }
          skin={'blueSkin'}
          onSelect={this.selectedNav.bind(this)}
          selectedKeys={selectedKeys}
          expandedKeys={expandedKeys}
          indent={10}
        />
      </div>
    );
  }
  selectedNav(selectedId) {
    this.props.selectedNav(selectedId);
    this.setState({
      selectedKeys: selectedId
    });
  }
}
// props
// isShow     是否展示模态框
// isParent   是否是新建文件夹
//新建文件弹出框
class AddNewFileModal extends React.Component {
  constructor(props) {
    super(props);
    this.options = [
      { key: 'A', text: 'AHU' },
      { key: 'B', text: 'PAU' },
      { key: 'C', text: 'Pump' },
      { key: 'D', text: 'Chiller' },
      { key: 'E', text: 'CoolingTower' },
      { key: 'F', text: 'CWP' },
      { key: 'G', text: 'ChWP' },
      { key: 'H', text: 'Temperature' },
      { key: 'I', text: 'Supply' },
      { key: 'J', text: 'Fan' }
    ];
    this.state = {
      name: '',
      desc: '',
      selectedItems: []
    };
    this.closeModal = this.closeModal.bind(this);
  }
  componentWillMount() {
    this.componentWillReceiveProps(this.props);
  }
  componentWillReceiveProps(nextProps) {
    const { editInfo } = nextProps;
    if (!editInfo) {
      this.setState({
        name: '',
        desc: '',
        selectedItems: []
      });
      return false;
    }
    let realSelectedItem = [];
    for (let i = 0; i < this.options.length; i++) {
      let row = this.options[i];
      if (editInfo && editInfo.tagArr.indexOf(row.text) !== -1) {
        realSelectedItem.push(row);
      }
    }
    this.setState({
      name: editInfo.name,
      desc: editInfo.desc,
      selectedItems: realSelectedItem
    });
  }
  render() {
    const { isShow, isParent, editInfo, i18n } = this.props;
    const { name, desc, selectedItems } = this.state;
    let realSelectedItem = selectedItems.map(row => row.key);
    return (
      <Modal
        isOpen={isShow}
        onDismiss={this.closeModal}
        containerClassName={s['addModal']}
      >
        <div className={s['modal-title']}>
          <span>
            {editInfo
              ? i18n.EDIT
              : isParent == 0 ? i18n.NEW_FILE : i18n.NEW_FOLDER}
          </span>
        </div>
        <div className={s['modal-body']}>
          <div>
            <label htmlFor="">{i18n.NAME}: </label>
            <input
              type="text"
              name=""
              value={name}
              placeholder={
                isParent == 0 ? i18n.ENTER_FILE_NAME : i18n.ENTER_FOLDER_NAME
              }
              onChange={this.changeName.bind(this)}
            />
          </div>
          {isParent ? (
            ''
          ) : (
            <div className={s['fileContainer']}>
              <div className={s['tagsDropdown']}>
                <label>Tags: </label>
                <Dropdown
                  selectedKey={realSelectedItem}
                  onChanged={this.changeState.bind(this)}
                  defaultSelectedKeys={realSelectedItem}
                  placeHolder="Select Tags"
                  multiSelect
                  options={this.options}
                />
              </div>
              <div>
                <label htmlFor="">{i18n.DESC}: </label>
                <input
                  type="text"
                  name=""
                  value={desc}
                  placeholder={i18n.ENTER_FILE_DESC}
                  onChange={this.changeDesc.bind(this)}
                />
              </div>
            </div>
          )}
        </div>
        <div className={s['modal-footer']}>
          <div>
            <DefaultButton
              primary={true}
              text={i18n.OK}
              onClick={this.add.bind(this)}
            />
            <DefaultButton text={i18n.CLOSE} onClick={this.closeModal} />
          </div>
        </div>
      </Modal>
    );
  }
  closeModal() {
    this.props.closeModal();
    this.setState({
      name: '',
      desc: '',
      selectedItems: []
    });
  }
  changeName(e) {
    let name = e.currentTarget.value;
    this.setState({
      name: name
    });
  }
  changeDesc(e) {
    let value = e.currentTarget.value;
    this.setState({
      desc: value
    });
  }
  changeState(item) {
    let updatedSelectedItem = this.state.selectedItems
      ? this.state.selectedItems.slice(0)
      : [];
    if (item.selected) {
      // add the option if it's checked
      updatedSelectedItem.push(item);
    } else {
      // remove the option if it's unchecked
      let currIndex = updatedSelectedItem.findIndex(
        row => row.key === item.key
      );
      if (currIndex > -1) {
        updatedSelectedItem.splice(currIndex, 1);
      }
    }
    this.setState({
      selectedItems: updatedSelectedItem
    });
  }
  //新建文件 新建文件夹
  add() {
    const { isParent, selectedNav, editInfo } = this.props;
    const { name, desc, selectedItems } = this.state;
    let selectedTexts = selectedItems.map(row => row.text);
    if (editInfo) {
      let id = editInfo.id;
      let info = {
        name: name,
        lastTime: moment.default().format('YYYY-MM-DD HH:mm:ss'),
        desc: desc,
        tagArr: selectedTexts
      };
      this.props.update(id, info);
    } else {
      let parentId;
      if (selectedNav) {
        if (selectedNav.isParent) {
          parentId = selectedNav.id;
        } else {
          parentId = selectedNav.parent ? selectedNav.parent : 1;
        }
      } else {
        parentId = 1;
      }
      let data = {
        id: ObjectId(''),
        name: name,
        isParent: isParent,
        parent: parentId,
        createTime: moment.default().format('YYYY-MM-DD HH:mm:ss'),
        lastTime: moment.default().format('YYYY-MM-DD HH:mm:ss'),
        desc: desc,
        tagArr: selectedTexts,
        grade: 'strategyTemplate', //策略模板 widgetTemplate控件模板
        creatorId: appConfig.user.id,
        imgUrl: isParent
          ? ''
          : 'https://beopweb.oss-cn-hangzhou.aliyuncs.com//static/images/avatar/default/4.png'
      };
      this.props.add(data);
    }
    this.closeModal();
  }
}
//导航视图 和 搜索视图
// props
// condition {grade:'',source:'',tags:[]}
// key
// selectedNav
class LayoutView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showMore: false,
      selectedIndex: undefined,
      showModal: false
    };
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (
      JSON.stringify(nextProps.viewList) !==
        JSON.stringify(this.props.viewList) ||
      JSON.stringify(nextState) !== JSON.stringify(this.state)
    ) {
      return true;
    } else {
      return false;
    }
  }
  render() {
    const { viewList, selectedNav, i18n } = this.props;
    const { showMore, selectedIndex, showModal } = this.state;
    return (
      <div>
        <ul className={'clear-both'}>
          {selectedNav && selectedNav.id !== 1 ? (
            <li
              className={s['filelist']}
              data-file-id={selectedNav.id}
              onClick={this.back.bind(this, selectedNav.parent)}
            >
              <div className={s['template-Image']}>
                <span className={s['folder-icon-container']}>
                  <i className="ms-Icon ms-Icon--PageLeft" />
                </span>
              </div>
              <div className={s['template-content']}>
                <div className={s['template-nav']}>
                  <h3 title={selectedNav.name}>{selectedNav.name}</h3>
                </div>
                <div className={s['template-text']} />
                <div className={s['template-user']}>
                  <span>{selectedNav.creatorId}</span>
                </div>
              </div>
            </li>
          ) : (
            ''
          )}
          {viewList.map((item, index) => (
            <li
              key={index}
              className={s['filelist']}
              data-id={index}
              data-file-id={item.id}
              onDoubleClick={
                item.isParent
                  ? this.openFolder.bind(this, item.id)
                  : this.linkToPainter.bind(this, item)
              }
            >
              <div className={s['template-Image']}>
                {item.isParent ? (
                  <span className={s['folder-icon-container']}>
                    <i className="ms-Icon ms-Icon--FabricFolderFill" />
                  </span>
                ) : (
                  <img src={item.imgUrl} />
                )}
              </div>
              <div className={s['template-content']}>
                <div className={s['template-nav']}>
                  <h3
                    className={
                      item.isParent ? undefined : 'file ' + s['file-title']
                    }
                    title={item.name}
                  >
                    {item.name}
                  </h3>
                  {!item.isParent && (
                    <ul>
                      <li className={s['template-list']}>
                        <div>
                          <i className="ms-Icon ms-Icon--Comment" />
                          <span className={s['toolName']}>0</span>
                        </div>
                      </li>
                      <li className={s['template-list']}>
                        <div>
                          <i className="ms-Icon ms-Icon--CloudDownload" />
                          <span className={s['toolName']}>0</span>
                        </div>
                      </li>
                      <li className={s['template-list']}>
                        <div>
                          <i className="ms-Icon ms-Icon--FavoriteStarFill" />
                          <span className={s['toolName']}>0</span>
                        </div>
                      </li>
                      <li className={s['template-list']}>
                        <div
                          className={`${s['more-vertical']}${
                            selectedIndex === index && showMore
                              ? ' showMore'
                              : ''
                          }`}
                          onClick={this.showMore.bind(this, index)}
                        >
                          <div>
                            <i className="ms-Icon ms-Icon--MoreVertical" />
                          </div>
                          {selectedIndex === index && showMore ? (
                            <div>
                              <div className={s['callout-visible']}>
                                <ul>
                                  {/* <li
                                    className={s['callout-list']}
                                    onClick={this.import.bind(this, item)}
                                  >
                                    导入
                                  </li> */}
                                  <li
                                    className={s['callout-list']}
                                    onClick={this.delete.bind(this, item.id)}
                                  >
                                    {i18n.DELETE}
                                  </li>
                                  <li className={s['callout-list']}>
                                    {i18n.SHARE}
                                  </li>
                                  <li
                                    className={s['callout-list']}
                                    onClick={this.edit.bind(this, item.id)}
                                  >
                                    {i18n.EDIT}
                                  </li>
                                  <li className={s['callout-list']}>
                                    {i18n.COLLECT}
                                  </li>
                                </ul>
                              </div>
                            </div>
                          ) : (
                            ''
                          )}
                        </div>
                      </li>
                    </ul>
                  )}
                </div>
                <div className={s['template-text']}>
                  {!item.isParent && <p>{item.desc}</p>}
                </div>
                <div className={s['template-user']}>
                  <span>{item.modifierFullName}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  showMore(index) {
    this.setState({
      showMore: this.state.showMore ? false : true,
      selectedIndex: index
    });
  }
  openFolder(parentId) {
    this.props.back(parentId);
  }
  delete(id) {
    this.props.delete(id);
  }
  edit(id) {
    const { viewList } = this.props;
    let data = viewList.find(row => row.id === id);
    this.props.showEditModal(data);
  }
  back(parentId) {
    this.props.back(parentId);
  }
  import(item, exportItem) {
    const { name, desc } = item;
    const { applicationItem } = exportItem || this.state;
    let data = {
      // # 编号
      _id: ObjectId(''),
      // # 父节点 id,
      parentId: '',
      // # 所属项目Id
      projId: appConfig.project.id,
      // # 名称
      name: name,
      // # 描述
      desc: desc,
      // # 创建人
      creatorId: 1,
      // # 创建时间
      createTime: '2017-01-01 00:00:00',
      // # 最后修改人
      lastModifierId: 1,
      // # 最后修改时间
      lastModifyTime: '2016-04-12 19:00:00',
      // # 关键字，便于检索
      keywords: [],
      // # 类型：0，诊断；1，KPI；2，计算点；
      type: 0,
      // # 触发器，用于配置策略何时执行
      trigger: [],
      // # 最后运行时间
      lastRuntime: '2016-04-12 19:00:00',
      // # 状态： 0，未启用；1，启用；
      status: 0,
      // # 是否同步:  0，未同步；1，已同步；
      syncStatus: 0,
      // # 策略其他配置
      options: {
        // # 策略自定义参数
        config: {}
      },
      // # 前置任务
      preTasks: [
        // # 策略 id
        ObjectId('')
      ]
    };
    let idDatas = [],
      modules = [];
    if (applicationItem.modules) {
      modules = applicationItem.modules.map(row => {
        let oldId = row._id;
        let newId = ObjectId('');
        idDatas.push({
          oldId: oldId,
          newId: newId
        });
        row = Object.assign({}, row, {
          _id: newId,
          strategyId: data._id
        });
        return row;
      });
      modules = modules.map(row => {
        let outputs = row.outputs.map(j => {
          let idData = idDatas.find(i => i.oldId === j._id);
          return {
            _id: idData.newId
          };
        });
        row = Object.assign({}, row, {
          outputs: outputs
        });
        return row;
      });
    }
    this.props.import(data, modules);
  }
  linkToPainter(item) {
    this.import({ name: 'Untitle', desc: '' }, {applicationItem:  item});
  }
}
class StrategyTemplate extends React.Component {
  constructor(props) {
    super(props);
    this.shouldGetList = true;
    this.state = {
      detailsHeaderList: _detailsHeaderList,
      isShowAddNewModal: false,
      selectedNav: undefined,
      isParent: 0,
      editInfo: undefined
    };
    this.showEditModal = this.showEditModal.bind(this);
    this.update = this.update.bind(this);
    this.back = this.back.bind(this);
    this.import = this.import.bind(this);
  }
  componentDidMount() {
    this.props.getTemplateTree();
    this.getViewList(this.props);
  }
  componentWillReceiveProps(nextProps) {
    if (
      JSON.stringify(this.props.condition) ==
      JSON.stringify(nextProps.condition)
    ) {
      this.shouldGetList = false;
    } else {
      this.shouldGetList = true;
      this.getViewList(nextProps);
    }
    if (
      this.props.templateList.length != nextProps.templateList.length ||
      JSON.stringify(this.props.viewList) != JSON.stringify(nextProps.viewList)
    ) {
      this.shouldGetList = true;
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (JSON.stringify(this.state) == JSON.stringify(nextState)) {
      return this.shouldGetList;
    } else {
      return true;
    }
  }
  render() {
    let {
      detailsHeaderList,
      isShowAddNewModal,
      selectedNav,
      isParent,
      editInfo
    } = this.state;
    const { templateList, condition, viewList, i18n } = this.props;
    return (
      <div className={s['container']}>
        <div className={s['slider']}>
          <TreeList
            templateList={templateList}
            selectedNav={this.selectedNav.bind(this)}
            selectedId={selectedNav ? selectedNav.id : undefined}
          />
        </div>
        <div className={s['diagnosis-panel-container']}>
          <div className={s['diagnosis-details-header']}>
            <div className={s['headers-nav']}>
              <div
                className={s['navTool']}
                onClick={this.showModal.bind(this, 0)}
                title={i18n.NEW_FILE}
              >
                <div>
                  <i className={'ms-Icon ms-Icon--AddEvent'} />
                </div>
              </div>
              <div
                className={s['navTool']}
                onClick={this.showModal.bind(this, 1)}
                title={i18n.NEW_FOLDER}
              >
                <div>
                  <i className={'ms-Icon ms-Icon--NewTeamProject'} />
                </div>
              </div>
              <div
                className={s['navTool']}
                onClick={this._showDeleteModal}
                title={i18n.A_BATCH_OF_NEW}
              >
                <div>
                  <i className={'ms-Icon ms-Icon--DocumentManagement'} />
                </div>
              </div>
              <div className={s['icon-line']} />
              <div
                className={s['navTool']}
                onClick={this._showDeleteModal}
                title={i18n.MORE}
              >
                <div>
                  <i className={'ms-Icon ms-Icon--CaretSolidDown'} />
                </div>
              </div>
            </div>
            <div className={s['search']}>
              <SearchBox
                onChange={this.changeSearchValue.bind(this)}
                value={condition.key}
              />
            </div>
          </div>
          <div className={s['diagnosis-detials-content']}>
            <div className={s['diagnosis-template']}>
              <LayoutView
                viewList={viewList}
                delete={this.delete.bind(this)}
                showEditModal={this.showEditModal}
                selectedNav={selectedNav}
                back={this.back}
                import={this.import}
                i18n={i18n}
              />
            </div>
          </div>
          <AddNewFileModal
            isShow={isShowAddNewModal}
            closeModal={this.closeModal.bind(this)}
            add={this.add.bind(this)}
            isParent={isParent}
            selectedNav={selectedNav}
            editInfo={editInfo}
            update={this.update}
            i18n={i18n}
          />
        </div>
      </div>
    );
  }
  showModal(isParent) {
    this.setState({
      isShowAddNewModal: true,
      isParent: isParent,
      editInfo: undefined
    });
  }
  showEditModal(data) {
    this.setState({
      isShowAddNewModal: true,
      editInfo: data
    });
  }
  closeModal() {
    this.setState({
      isShowAddNewModal: false
    });
  }
  add(data) {
    this.props.addNewFile(data);
  }
  selectedNav(selectedIds) {
    this.props.setCondition({
      selectedIds: selectedIds
    });
    const { templateList } = this.props;
    let selectedNav = templateList.find(row => {
      return row.id === selectedIds[0];
    });
    this.setState({
      selectedNav: selectedNav
    });
  }
  getViewList(props) {
    const { condition } = props;
    //to do 筛选数据
    if (condition.selectedIds.length === 0) {
      return false;
    }
    let selectedIds = condition.selectedIds;
    let tags = condition.tags;
    let value = condition.key ? condition.key : '';
    let grade = condition.grade ? condition.grade : '';
    let source = condition.source ? condition.source : '';
    let user = appConfig.user.id;
    props.getTemplates(selectedIds, grade, source, tags, value, user);
  }
  delete(id) {
    this.props.deleteTemplate(id);
  }
  changeSearchValue(value) {
    this.props.setCondition({
      key: value
    });
  }
  update(id, info) {
    this.props.updateTemplate(id, info);
  }
  back(parentId) {
    let user = appConfig.user.id;
    this.setState({
      selectedNav: {
        id: parentId
      }
    });
    if (parentId !== 1) {
      this.props.getTemplates([parentId], '', '', [], '', user);
    }
  }
  import(data, modules) {
    this.props.copyTemplateAddNew(data, modules);
  }
}
var mapDispatchToProps = {
  addNewFile,
  getTemplateTree,
  getTemplates,
  setCondition,
  deleteTemplate,
  updateTemplate,
  copyTemplateAddNew
};

var mapStateToProps = function(state) {
  return {
    templateList: state.template.templateList,
    viewList: state.template.viewList,
    condition: state.template.condition
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(StrategyTemplate);
