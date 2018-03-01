import React from 'react';
import { connect } from 'react-redux';

import Tree from '../../../components/Tree';
import { Tabs, TabPane } from '../../../components/Tabs';
import DropdownList from '../../../components/DropdownList';

import OperateTree from '../../../components/OperateTree';

import Confirm from '../../../components/Confirm';
import {
  getStrategyList,
  getTagDict,
  setFilesPanelSpinner
} from '../../../redux/epics/home.js';
import { clearStrategyItem } from '../../../redux/epics/painter.js';
import { linkTo } from '../../../';
import CustomSpinner from '../../../components/CustomSpinner';

import css from './FilesTabPane.css';

class FilesTabPane extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      treeItems: [],
      projectList: []
    };
    this._clearPainterPanel = this._clearPainterPanel.bind(this);
  }
  componentDidMount() {
    const {
      getStrategyList,
      selectedProjId,
      strategyList,
      tagDict,
      getTagDict,
      setFilesPanelSpinner,
      strategyId,
      selectedItems
    } = this.props;

    let projectList = window.appConfig.projectList.map(v => ({
        key: v.id,
        text: v.name_cn + ' #' + v.id
      })),
      selectedProjectId = selectedProjId || projectList[0].key;
    let treeItems = strategyList.map(v => ({
      id: v._id,
      name: v.name,
      parent: 0,
      isParent: 0
    }));
    if (!treeItems.length && !strategyId) {
      setFilesPanelSpinner(true);
      getStrategyList(selectedProjectId);
    }
    if (tagDict.length === 0) {
      getTagDict();
    }

    this.setState({
      treeItems,
      projectList
    });
  }
  componentWillReceiveProps(nextProps) {
    const { strategyList, selectedProjId } = nextProps;
    let treeItems = strategyList.map(v => ({
      id: v._id,
      name: v.name,
      parent: 0,
      isParent: 0
    }));
    this.setState({
      treeItems
    });
  }
  render() {
    const { selectedItems, strategyId, i18n, strategyPanelFn, selectedProjId, changeStateFn } = this.props;
    const { treeItems, projectList } = this.state;
    const isOperate = false;
    return (
      <Tabs>
        <TabPane tab={i18n.PROGRAM} keyId="2">
          <DropdownList
            selectedKey={selectedProjId}
            onChanged={this._onChangeProjectId.bind(this)}
            placeHolder="No Selected"
            options={projectList}
            search={true}
            skin="h32"
          />
          <div style={{height:'calc(100% - 74px)',overflowY:'auto'}}>
          <Tree
            items={treeItems}
            selectedKeys={[strategyId]}
            skin="color-white h40"
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
              <i
                className="ms-Icon ms-Icon--Questionnaire"
                aria-hidden="true"
              />
            }
            onSelect={ids => {
              if (ids.length > 0) {
                if (strategyId) {
                  if (strategyPanelFn && strategyPanelFn.getDiff()) {
                    Confirm({
                      title: i18n.TOOLTIP,
                      type: 'info',
                      content: i18n.UNSAVED_CONTENT_CONFIRM_EXIT,
                      onSave: () => {
                        strategyPanelFn.onSave();
                        linkTo(`/painter/${ids[0]}`);
                      },
                      onDoNotSave: () => {
                        linkTo(`/painter/${ids[0]}`);
                      },
                      onCancel: () => {
                        this.setState({});
                      }
                    });
                  } else {
                    linkTo(`/painter/${ids[0]}`);
                  }
                } else {
                  linkTo(`/painter/${ids[0]}`);
                }
              }
            }}
          />
          </div>
          <CustomSpinner visible={this.props.filePanelSpinner} />
          <OperateTree selectedItems={selectedItems} selectedKeys={[strategyId]} changeStateFn={changeStateFn}/>
        </TabPane>
        {/* <TabPane tab={i18n.PRIVATE} keyId="1" /> */}
      </Tabs>
    );
  }
  _onChangeProjectId(it, id) {
    const {
      getStrategyList,
      setFilesPanelSpinner,
      strategyId,
      strategyPanelFn,
      i18n
    } = this.props;
    setFilesPanelSpinner(true);
    if (strategyId) {
      if (strategyPanelFn && strategyPanelFn.getDiff()) {
        Confirm({
          title: i18n.TOOLTIP,
          content: i18n.UNSAVED_CONTENT_CONFIRM_EXIT_STRATEGY,
          type: 'info',
          onSave: () => {
            strategyPanelFn.onSave();
            linkTo(``);
            getStrategyList(id);
            this._clearPainterPanel();
          },
          onDoNotSave: () => {
            linkTo(``);
            getStrategyList(id);
            this._clearPainterPanel();
          },
          onCancel: () => {}
        });
      } else {
        Confirm({
          title: i18n.TOOLTIP,
          content: i18n.CONFIRM_EXIT_STRATEGY,
          type: 'info',
          onOk: () => {
            linkTo(``);
            getStrategyList(id);
            this._clearPainterPanel();
          },
          onCancel: () => {}
        });
      }
    } else {
      getStrategyList(id);
    }
  }
  _clearPainterPanel() {
    const { clearStrategyItem } = this.props;
    clearStrategyItem();
  }
}
let mapDispatchToProps = {
  getStrategyList,
  getTagDict,
  setFilesPanelSpinner,
  clearStrategyItem
};

let mapStateToProps = function(state) {
  return {
    strategyList: state.home.strategyList,
    selectedProjId: state.home.selectedProjectId,
    tagDict: state.home.tagDict,
    filePanelSpinner: state.home.filePanelSpinner
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FilesTabPane);
