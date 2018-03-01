import React from 'react';
import I from 'seamless-immutable';
import { connect } from 'react-redux';
import * as moment from 'moment';
import ObjectId from '../../common/objectId';

import { diff, merge as mergeDiff } from '@beopcloud/diff';
import {
  getStrategyItem,
  saveStrategyItem,
  clearStrategyItem,
  changeActivePaneKey,
  getHelpInfo
} from '../../redux/epics/painter.js';
import {
  getStrategyList,
  setFilesPanelSpinner
} from '../../redux/epics/home.js';
import { updateStrategy, exportTemplate } from '../../redux/epics/home.js';

import Tab from '../../components/Tab';
import CustomSpinner from '../../components/CustomSpinner';
import Confirm from '../../components/Confirm';
import PanelHeader from './PanelHeader';

import AnalysisCorrelationPanel from '../panels/AnalysisCorrelationPanel';
import DataSourcePanel from '../panels/DataSourcePanel';
import DiagnosisItemPanel from '../panels/DiagnosisItemPanel';
import EvaluatePanel from '../panels/EvaluatePanel';
import ForecastPanel from '../panels/ForecastPanel';
import FuzzyRulesPanel from '../panels/FuzzyRulesPanel';
import SVMPanel from '../panels/SVMPanel';
import PythonPanel from '../panels/PythonPanel';
import PainterPanel from '../panels/PainterPanel';
import DataDeduplicationPanel from '../panels/DataDeduplicationPanel';
import DataComplementPanel from '../panels/DataComplementPanel';
import OutlierRemovingPanel from '../panels/OutlierRemovingPanel';
import DataNormalizationPanel from '../panels/DataNormalizationPanel';
import ClusteringPanel from '../panels/ClusteringPanel';
import OutlierDetectionPanel from '../panels/OutlierDetectionPanel';
import LogicAnalysisPanel from '../panels/LogicAnalysisPanel';
import DataMonitoringPanel from '../panels/DataMonitoringPanel';
import ConfigFileExcel from '../panels/ConfigFileExcel';
import FeatureSelectionPanel from '../panels/FeatureSelectionPanel';
import PCAPanel from '../panels/PCAPanel';
import EvaluateModulePanel from '../panels/EvaluateModulePanel';
import ChartPanel from '../panels/ChartPanel';
import DataSortingPanel from '../panels/DataSortingPanel';
import DataExportPanel from '../panels/DataExportPanel';
import ExportTemplateModal from '../modals/ExportTemplateModal';

import {
  moduleTypes,
  moduleTypeNames
} from '@beopcloud/StrategyV2-Engine/src/enum';
import moduleConfig from '@beopcloud/StrategyV2-Engine/src/moduleConfig';
import dataTypeFunc from '@beopcloud/StrategyV2-Engine/src/dataTypes';
import Engine from '@beopcloud/StrategyV2-Engine';
import { linkTo } from '../../';

import s from './StrategyPanel.css';

let shouldClearTimeOut = undefined;

class StrategyPanel extends React.Component {
  constructor(props) {
    super(props);
    this.data = props.strategyItem;
    this.state = {
      spinner: true,
      strategy: this.data.strategy,
      modules: this.data.modules,
      moduleProps: I({}),
      isShowExportModal: false,
      isFirstLoadData: false
    };
    this.isNeedGetStrategyList = true;
    this._engine = undefined;

    this._addModule = this._addModule.bind(this);
    this._removeModule = this._removeModule.bind(this);
    this._addLink = this._addLink.bind(this);
    this._removeLink = this._removeLink.bind(this);
    this._moveModule = this._moveModule.bind(this);
    this._updateModule = this._updateModule.bind(this);
    this._updateModuleData = this._updateModuleData.bind(this);
    this._handleDblClickModule = this._handleDblClickModule.bind(this);
    this._handleEnterModule = this._handleEnterModule.bind(this);
    this._handleLeaveModule = this._handleLeaveModule.bind(this);
    this._clearPainterPanel = this._clearPainterPanel.bind(this);

    this._handleTabChange = this._handleTabChange.bind(this);
    this._onSave = this._onSave.bind(this);
    this._onBack = this._onBack.bind(this);
    this.showExportModal = this.showExportModal.bind(this);
    this.closeExportModal = this.closeExportModal.bind(this);
    this._onExport = this._onExport.bind(this);
  }
  componentDidMount() {
    const {
      strategyItem,
      strategyId,
      activePaneKey,
      changeActivePaneKey
    } = this.props;
    this.props.getStrategyItem(this.props.strategyId);
    if (activePaneKey != 'PainterPanel') {
      changeActivePaneKey('PainterPanel');
    }
  }
  componentWillUnmount() {
    if (this._engine) {
      this._engine.dispose();
      this._engine = undefined;
    }
  }
  componentWillReceiveProps(nextProps) {
    const {
      activePaneKey,
      strategyItem,
      strategyId,
      getStrategyItem,
      changeActivePaneKey,
      getStrategyList,
      setFilesPanelSpinner
    } = nextProps;
    this.setState({
      isFirstLoadData: false
    });

    if (strategyId != this.props.strategyId) {
      //切换策略
      getStrategyItem(strategyId);
      this.isNeedGetStrategyList = false;
      this.setState({
        spinner: true
      });
      if (activePaneKey !== 'PainterPanel') {
        changeActivePaneKey('PainterPanel');
      }
      return;
    } else if (strategyItem && this.props.activePaneKey === activePaneKey) {
      // 更新数据
      let nextState = {
        spinner: false,
        isFirstLoadData: false
      };

      // 首次加载数据
      if (
        !this.state.strategy ||
        (this.state.strategy && this.state.strategy._id != strategyId)
      ) {
        this._engine = new Engine();
        this._engine.setModules(strategyItem.modules.asMutable()).analysis();
        // 初始化 moduleProps
        let moduleProps = {};
        strategyItem.modules.forEach(module => {
          moduleProps[module._id] = {
            status: 0,
            moduleInputData:
              (moduleConfig[module.type] &&
                moduleConfig[module.type].inputs.map(dataType =>
                  dataTypeFunc.createEmpty(dataType)
                )) ||
              [],
            moduleOutputData:
              (moduleConfig[module.type] &&
                moduleConfig[module.type].outputs.map(dataType =>
                  dataTypeFunc.createEmpty(dataType)
                )) ||
              [],
            moduleResponseData:
              (moduleConfig[module.type] &&
                moduleConfig[module.type].response.map(dataType =>
                  dataTypeFunc.createEmpty(dataType)
                )) ||
              []
          };
        });
        nextState.moduleProps = I(moduleProps);
        nextState.isFirstLoadData = true;
      }
      if (
        this.isNeedGetStrategyList &&
        strategyItem &&
        strategyItem.strategy &&
        strategyItem.strategy.projId != appConfig.project.id
      ) {
        this.isNeedGetStrategyList = false;
        setFilesPanelSpinner(true);
        getStrategyList(strategyItem.strategy.projId);
      }
      this.data = strategyItem;
      nextState.strategy = strategyItem.strategy;
      nextState.modules = strategyItem.modules;
      this.setState(nextState);
    }
  }
  _getModuleContent(data, i18n) {
    let ComponentClass;
    switch (data.type) {
      case moduleTypes.CON_DATASOURCE:
        ComponentClass = DataSourcePanel;
        break;
      case moduleTypes.OP_DATASOURCE:
        ComponentClass = DataSourcePanel;
        break;
      case moduleTypes.PRE_TRANS_FUZZY:
        ComponentClass = FuzzyRulesPanel;
        break;
      case moduleTypes.FUNC_LOGIC_BOOLEAN:
        ComponentClass = LogicAnalysisPanel;
        break;
      case moduleTypes.OP_DIAGNOSIS_ITEM:
        ComponentClass = DiagnosisItemPanel;
        break;
      case moduleTypes.OP_DATASOURCE:
        ComponentClass = DataSourcePanel;
        break;
      case moduleTypes.EXEC_PYTHON:
        ComponentClass = PythonPanel;
        break;
      case moduleTypes.EXEC_TEST:
        ComponentClass = EvaluatePanel;
        break;
      case moduleTypes.EXEC_ANLS_CORRELATION:
        ComponentClass = AnalysisCorrelationPanel;
        break;
      case moduleTypes.EXEC_ANLS_PREDICTION:
        ComponentClass = ForecastPanel;
        break;
      case moduleTypes.PDT_SVM:
        ComponentClass = SVMPanel;
        break;
      case moduleTypes.EXEC_OUTLIER_DETECTION:
        ComponentClass = OutlierDetectionPanel;
        break;
      case moduleTypes.PRE_DATA_DEDUPLICATION:
        ComponentClass = DataDeduplicationPanel;
        break;
      case moduleTypes.PRE_DATA_COMPLEMENT:
        ComponentClass = DataComplementPanel;
        break;
      case moduleTypes.PRE_DATA_NORMALIZATION:
        ComponentClass = DataNormalizationPanel;
        break;
      case moduleTypes.CLT_DB_SCAN:
        ComponentClass = ClusteringPanel;
        break;
      case moduleTypes.PRE_TRANS_FUZZY:
        ComponentClass = FuzzyRulesPanel;
        break;
      case moduleTypes.PRE_DATA_MONITORING:
        ComponentClass = DataMonitoringPanel;
        break;
      case moduleTypes.CON_FILE_EXCEL:
        ComponentClass = ConfigFileExcel;
        break;
      case moduleTypes.PCA:
        ComponentClass = PCAPanel;
        break;
      case moduleTypes.FEATURE_SELECTION:
        ComponentClass = FeatureSelectionPanel;
        break;
      case moduleTypes.PRE_DATA_EVALUATE:
        ComponentClass = EvaluateModulePanel;
        break;
      case moduleTypes.VSL_CHART:
        ComponentClass = ChartPanel;
        break;
      case moduleTypes.PRE_DATA_SORTING:
        ComponentClass = DataSortingPanel;
        break;
      case moduleTypes.PRE_DATA_EXPORT:
        ComponentClass = DataExportPanel;
        break;
      default:
        throw new Error(i18n.UNSUPPORTED_MODULE_TYPE);
        break;
    }

    return (
      <ComponentClass
        ref="activeComponent"
        data={data}
        {...this.state.moduleProps[data._id]}
        updateModule={this._updateModuleData}
      />
    );
  }
  _getPanes(i18n) {
    const { modules, strategy, isFirstLoadData } = this.state;
    let panes = modules
      .map(row => ({
        title: row.name,
        key: row._id,
        content: this._getModuleContent(row, i18n)
      }))
      .asMutable();

    if (strategy) {
      panes.unshift({
        title: i18n.MAIN_PAGE,
        key: 'PainterPanel',
        content: (
          <PainterPanel
            strategy={strategy}
            modules={modules}
            updateModule={this._updateModule}
            handleDblClickModule={this._handleDblClickModule}
            handleEnterModule={this._handleEnterModule}
            handleLeaveModule={this._handleLeaveModule}
            isFirstLoadData={isFirstLoadData}
          />
        )
      });
    }

    return panes;
  }
  render() {
    const { spinner, isShowExportModal } = this.state;
    const { activePaneKey, i18n, selectedItems = [] } = this.props;
    const strategy =
      (selectedItems.length !== 0 && selectedItems[0]) || this.state.strategy;
    return (
      <div className={s['container']}>
        <PanelHeader
          key="header"
          onSave={this._onSave}
          onBack={this._onBack}
          showExportModal={this.showExportModal}
          title={strategy ? strategy.name : ''}
          i18n={i18n}
        />
        <Tab
          className={s['tab']}
          key="tab"
          activePaneKey={activePaneKey}
          panes={this._getPanes(i18n)}
          onTabChange={this._handleTabChange}
        />
        <CustomSpinner key="spin" visible={spinner} />
        <ExportTemplateModal
          isShowExportModal={isShowExportModal}
          closeExportModal={this.closeExportModal}
          exportTemplate={this._onExport}
        />
      </div>
    );
  }
  _handleTabChange(key) {
    const { changeActivePaneKey, i18n } = this.props;
    const tabChangeFn = () => {
      /** 清除定时 */
      if (key === 'PainterPanel') {
        changeActivePaneKey(key);
        return;
      }
      this.setState({
        moduleProps: this.state.moduleProps.setIn([key, 'status'], 0)
      });
      clearTimeout(shouldClearTimeOut);
      shouldClearTimeOut = undefined;
      changeActivePaneKey(key);

      let node = this._engine.findNodeByModuleId(key);
      if (!node) {
        throw new Error(
          `${i18n.NODE_WIDTH_ID_NOT_FOUND_ONE} '${key}' ${
            i18n.NODE_WIDTH_ID_NOT_FOUND_TWO
          }`
        );
      }
      Promise.all([
        node.getModuleInputData(),
        node.getResponse(),
        node.getModuleOutputData()
      ])
        .then(
          ([moduleInputData, moduleResponseData, moduleOutputData]) => {
            let moduleProps = this.state.moduleProps.setIn(
              [key, 'moduleInputData'],
              moduleInputData
            );
            moduleProps = moduleProps.setIn(
              [key, 'moduleOutputData'],
              moduleOutputData
            );
            (moduleProps = moduleProps.setIn(
              [key, 'moduleResponseData'],
              moduleResponseData
            )),
              (moduleProps = moduleProps.setIn([key, 'status'], 1));
            this.setState({
              moduleProps: moduleProps
            });
          },
          err => {
            this.setState({
              moduleProps: this.state.moduleProps.setIn([key, 'status'], 1)
            });
          }
        )
        .catch(err => {
          logger.error(err);
        });
    };
    if (
      this.refs.activeComponent &&
      this.refs.activeComponent.getWrappedInstance &&
      this.refs.activeComponent.getWrappedInstance().isStopChangeTab &&
      this.refs.activeComponent
        .getWrappedInstance()
        .isStopChangeTab(tabChangeFn)
    ) {
      return;
    }
    tabChangeFn();
  }
  _onSave() {
    const { saveStrategyItem, updateStrategy, strategyItem } = this.props;
    let diffData = this.getDiff();
    if (diffData) {
      diffData = mergeDiff(diffData);
      saveStrategyItem(diffData, this.state.modules);
    }
    updateStrategy(appConfig.project.id, strategyItem.strategy._id, {
      trigger: strategyItem.strategy.trigger,
      status: strategyItem.strategy.status,
      creatorId: strategyItem.strategy.creatorId,
      lastModifierId: appConfig.user.id,
      modifierFullName: appConfig.userProfile.name,
      syncStatus: 0
    });
  }
  _onBack() {
    const { i18n } = this.props;
    if (this.getDiff()) {
      Confirm({
        title: i18n.TOOLTIP,
        type: 'info',
        content: i18n.UNSAVED_CONTENT_CONFIRM_EXIT,
        onSave: () => {
          this._onSave();
          linkTo('');
          this._clearPainterPanel();
        },
        onDoNotSave: () => {
          linkTo('');
          this._clearPainterPanel();
        },
        onCancel: () => {}
      });
    } else {
      linkTo('');
      this._clearPainterPanel();
    }
  }
  _updateModuleData(module) {
    let moduleId = module._id;
    let modules = this.state.modules.flatMap(row => {
      if (row._id === moduleId) {
        return [module];
      } else {
        return [row];
      }
    });

    let node = this._engine.findNodeByModuleId(module._id);
    node.setModule(module);
    this.setState({
      modules: modules
    });

    Promise.all([node.getResponse(), node.getModuleOutputData()])
      .then(([moduleResponseData, moduleOutputData]) => {
        let moduleProps = this.state.moduleProps.setIn(
          [module._id, 'moduleOutputData'],
          moduleOutputData
        );
        moduleProps = moduleProps.setIn(
          [module._id, 'moduleResponseData'],
          moduleResponseData
        );
        this.setState({
          moduleProps: moduleProps
        });
      })
      .catch(err => {
        logger.error(err);
      });
  }
  /** 画板模块的变更方式 */
  _updateModule(modules, propNames) {
    this.setState({
      modules: I(modules)
    });
    //addModule  removeModule  addLink  removeLink  moveModule
    propNames.forEach(name => {
      this[`_${name}`](modules);
    });
  }
  /* 添加和 PainterPanel 交互部分的方法 */
  _addModule(modules) {
    logger.info('add module');
    // 重新分析
    this._engine.setModules(modules).analysis();
    let moduleProps = this.state.moduleProps;
    let moduleIds = Object.keys(moduleProps);
    let mds = modules.filter(row => moduleIds.indexOf(row._id) === -1);

    if (mds.length == 0) {
      throw new Error(this.props.i18n.NO_NEW_MODULES_FOUND);
    }
    mds.forEach(md => {
      this.setState({
        moduleProps: this.state.moduleProps.set(md._id, {
          status: 0,
          moduleInputData:
            (moduleConfig[md.type] &&
              moduleConfig[md.type].inputs.map(dataType =>
                dataTypeFunc.createEmpty(dataType)
              )) ||
            [],
          moduleOutputData:
            (moduleConfig[md.type] &&
              moduleConfig[md.type].outputs.map(dataType =>
                dataTypeFunc.createEmpty(dataType)
              )) ||
            []
        })
      });
    });
  }
  _removeModule(modules) {
    logger.info('remove module');
    // 重新分析
    this._engine.setModules(modules).analysis();
    let moduleProps = this.state.moduleProps;
    let moduleIds = Object.keys(moduleProps);
    let existModuleIds = modules.map(row => row._id);
    let md = moduleIds.find(row => existModuleIds.indexOf(row._id) === -1);

    if (!md) {
      throw new Error(this.props.mainPage.DELETION_MODULE_NOT_FOUND);
    }

    this.setState({
      moduleProps: this.state.moduleProps.without(md._id)
    });
  }
  _addLink(modules) {
    logger.info('add link');
    this._engine.setModules(modules).analysis();
  }
  _removeLink(modules) {
    logger.info('remove link');
    this._engine.setModules(modules).analysis();
  }
  _moveModule() {
    logger.info('move module');
  }
  _handleDblClickModule(module) {
    logger.info('double click module');
    this._handleTabChange(module._id);
  }
  _clearPainterPanel() {
    const { clearStrategyItem } = this.props;
    clearStrategyItem();
  }
  /** 鼠标移上显示描述标签 */

  _handleEnterModule(info) {
    const { getHelpInfo = () => {} } = this.props;
    getHelpInfo([moduleTypeNames[info.type], moduleTypeNames[info.type]]);
  }
  /** 鼠标离开隐藏描述标签 */

  _handleLeaveModule(info) {
    const { getHelpInfo = () => {} } = this.props;
    getHelpInfo(['', '']);
  }
  //导出模态框
  showExportModal() {
    this.setState({
      isShowExportModal: true
    });
  }
  closeExportModal() {
    this.setState({
      isShowExportModal: false
    });
  }
  _onExport(strategyData) {
    const { modules, strategy } = this.state;
    const { _id } = strategy;
    const { name, desc, tags } = strategyData;
    let strategyInfo = {
      id: ObjectId(''),
      name: name,
      isParent: 0,
      parent: 1,
      createTime: moment.default().format('YYYY-MM-DD HH:mm:ss'),
      lastTime: moment.default().format('YYYY-MM-DD HH:mm:ss'),
      desc: desc,
      tagArr: tags,
      grade: 'strategyTemplate', //策略模板 widgetTemplate控件模板
      creatorId: appConfig.user.id,
      imgUrl:
        'https://beopweb.oss-cn-hangzhou.aliyuncs.com//static/images/avatar/default/4.png'
    };
    let idDatas = [];
    let newModules = modules.map(row => {
      let oldId = row._id;
      let newId = ObjectId('');
      idDatas.push({
        oldId: oldId,
        newId: newId
      });
      row = Object.assign({}, row, {
        _id: newId,
        strategyId: strategyInfo.id
      });
      return row;
    });
    newModules = newModules.map(row => {
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
    this.props.exportTemplate(strategyInfo, newModules);
  }
  getDiff() {
    let oldModulesMap = {},
      newModulesMap = {};
    this.data.modules.forEach(v => {
      oldModulesMap[v._id] = v;
    });
    this.state.modules.forEach(v => {
      newModulesMap[v._id] = v;
    });
    let diffData = diff(oldModulesMap, newModulesMap, (lhs, rhs, path) => {
      let cmp;
      if (path.length !== 2 || ['options', 'outputs'].indexOf(path[1]) === -1)
        return;
      cmp = diff(lhs, rhs);
      return cmp !== null;
    });
    return diffData;
  }
}

const mapDispatchToProps = {
  getStrategyItem,
  saveStrategyItem,
  updateStrategy,
  exportTemplate,
  clearStrategyItem,
  changeActivePaneKey,
  getStrategyList,
  setFilesPanelSpinner,
  getHelpInfo
};

const mapStateToProps = function(state) {
  return {
    strategyItem: state.painter.strategyItem,
    activePaneKey: state.painter.activePaneKey
  };
};

export default connect(mapStateToProps, mapDispatchToProps, null, {
  withRef: true
})(StrategyPanel);
