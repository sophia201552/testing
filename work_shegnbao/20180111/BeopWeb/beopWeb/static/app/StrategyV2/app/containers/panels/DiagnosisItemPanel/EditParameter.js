/**
 * 诊断项面板
 */

import React from 'react';
import { connect } from 'react-redux';
import I from 'seamless-immutable';
import {
  Dropdown,
  IDropdown,
  DropdownMenuItemType,
  IDropdownOption
} from 'office-ui-fabric-react/lib/Dropdown';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { Modal } from 'office-ui-fabric-react/lib/Modal';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';

import Select from '../../../components/Select';

import Confirm from '../../../components/Confirm';
import { getTagDict } from '../../../redux/epics/home.js';
import s from './EditParameter.css';
import EvaluateDetails from '../EvaluatePanel/EvaluateDetails';
import EvaluateSlider from '../EvaluatePanel/EvaluateSlider';
//输出参数编辑页面
//props
// updateModule          更新module的方法
// selectedItem          选中的fault
// inputData             上个模块传过去的inputData 处理chart
// params                本身上次配置的在options下存的
// showEditParameter     是否显示编辑模态框
// closeEditParameter    关闭模态框的方法
class EditParameter extends React.Component {
  constructor(props) {
    super(props);
    this.itemInfo = {
      name: '',
      description: '',
      faultName: '',
      faultTypeGroup: [],
      targetGroup: '',
      targetExecutor: '',
      runDay: 12,
      runMonth: 240,
      runWeek: 60,
      runYear: 2400,
      unit: 'kWh',
      energyConfig: {},
      faultTag: '',
      chart: []
    };
    this.energyConfig = undefined;
    this.energyConfigArr = [];
    this.chartOptions = [];
    this.faultInfo = {
      name: '',
      description: '',
      grade: '',
      suggestion: ''
    };

    this.state = {
      itemInfo: this.itemInfo,
      requiredTooltip: false,
      inputValue: ''
    };
    this._basicDropdown = null;
    this.addChartInfo = this.addChartInfo.bind(this);
    this.updateModule = this.updateModule.bind(this);
    this._onTextDrop = this._onTextDrop.bind(this);
  }
  componentWillMount() {
    const { i18n, tagDict, getTagDict } = this.props;
    if (tagDict.length === 0) {
      getTagDict();
    }
    apiFetch.getEnergyConfig().subscribe(resp => {
      this.energyConfig = resp;
      let arr = Object.keys(resp).map((value, index) => ({
        key: value,
        text: value
      }));
      this.energyConfigArr = [
        {
          itemType: 0,
          key: 'null',
          text: i18n.NONE
        }
      ].concat(arr);
    });
  }
  componentWillReceiveProps(nextProps) {
    const { selectedItem, inputData, params } = nextProps;
    this.chartOptions = [];
    inputData.forEach(row => {
      this.chartOptions.push({
        key: row.name,
        text: row.name
      });
    });
    if (selectedItem) {
      let itemInfo = params.find(row => row.faultId === selectedItem.id);
      if (itemInfo) {
        this.setState({
          itemInfo: itemInfo
        });
      } else {
        this.setState({
          itemInfo: this.itemInfo
        });
      }
      this.faultInfo = {
        name: selectedItem.name,
        description: selectedItem.description,
        grade: selectedItem.grade,
        suggestion: selectedItem.suggestion
      };
    }
  }
  render() {
    const {
      name,
      description,
      faultName,
      faultTypeGroup,
      targetGroup,
      targetExecutor,
      runDay,
      runMonth,
      runWeek,
      runYear,
      unit,
      energyConfig,
      faultTag,
      chart
    } = this.state.itemInfo;
    const { requiredTooltip, inputValue } = this.state;
    const { selectedItem, showEditParameter, tagDict, i18n } = this.props;
    let tags = [],
      tagParents = new Set(['Custom']);
    tagDict.forEach(v => {
      tags.push(v.groupNm);
      tagParents.add(v.groupNm);
      tags = tags.concat(v.tags.map(t => t.name));
    });
    let selectedTags =
      (faultTypeGroup.split && faultTypeGroup.split(',')) || faultTypeGroup; //老数据兼容
    let customTags = selectedTags.filter(v => tags.indexOf(v) < 0);
    tags = tags.concat(['Custom', ...customTags]);
    let style = { display: 'none' };
    if (showEditParameter) {
      style = { display: 'block' };
    }
    return (
      <Panel
        isOpen={showEditParameter}
        onDismiss={this.props.closeEditParameter}
        type={PanelType.smallFluid}
        className={s['editParameterModal']}
        forceFocusInsideTrap={false}
        ignoreExternalFocusing={true}
        isBlocking={false}
        isLightDismiss={true}
        isHiddenOnDismiss={true}
        hasCloseButton={false}
      >
        <div className={s['modal-title']}>
          <span>{i18n.PARAM_CONFIG}</span>
          <div className={s['buttonCtn']}>
            <div onClick={this.updateModule}>{i18n.OK}</div>
            <div onClick={this.props.closeEditParameter}>{i18n.CANCEL}</div>
          </div>
        </div>
        <div className={s['modal-body']}>
          <div className={s['bodyLeft']}>
            <div className={s['flexCtn']}>
              <div className={s['item']}>
                <label htmlFor="">{i18n.PARAM_NAME}：</label>
                <div>
                  <input
                    type="text"
                    name="name"
                    placeholder={i18n.ENTER_PARAM_NAME}
                    value={name}
                    onChange={this.changeValue.bind(this)}
                    onKeyUp={this.valueKeyUp.bind(this)}
                  />
                </div>
              </div>
              <div className={s['item']}>
                <label htmlFor="">{i18n.FAULT_SOURCE}：</label>
                <Dropdown
                  className={s['dropdown']}
                  placeHolder={i18n.DIAGNOSIS}
                  name="faultTag"
                  options={[
                    { key: '0', text: i18n.DIAGNOSIS },
                    { key: '1', text: 'BA' },
                    { key: '2', text: 'Cloud' }
                  ]}
                  onChanged={this.changeFaultTag.bind(this)}
                  selectedKey={'' + faultTag}
                />
              </div>
            </div>
            <div className={s['item']}>
              <label htmlFor="">{i18n.DESCRIPTION}：</label>
              <div>
                <textarea
                  type="text"
                  name="description"
                  placeholder={i18n.ENTER_DESCRIPTION}
                  onChange={this.changeValue.bind(this)}
                  value={description}
                />
              </div>
            </div>
            <div className={s['item']}>
              <label htmlFor="">{i18n.FAULT_TEMPLATE}</label>
              <div className={s['faultModalInfo']}>
                <span>
                  {i18n.NAME}：{this.faultInfo.name}
                </span>
                <span>
                  {i18n.DESCRIPTION}：{this.faultInfo.description}
                </span>
                <span>
                  {i18n.PRIORITY_LEVEL}：{this.faultInfo.grade}
                </span>
                <span>
                  {i18n.RECOMMENDATIONS}：{this.faultInfo.suggestion}
                </span>
              </div>
            </div>
            <div className={s['flexCtn']}>
              <div className={s['item']}>
                <label htmlFor="">{i18n.FAULT_TYPES_GROUPED}：</label>
                <div>
                  <Select
                    onChanged={keys => {
                      this.changeValue({
                        target: { name: 'faultTypeGroup', value: keys }
                      });
                    }}
                    options={I.asMutable(
                      Array.from(new Set(tags)).map(v => ({
                        key: v,
                        text: v,
                        type: tagParents.has(v) ? 'header' : 'item'
                      }))
                    )}
                    selectedKeys={selectedTags}
                  />
                </div>
              </div>
              <div className={s['item']}>
                <label htmlFor="">{i18n.PEOPLE_GROUP}：</label>
                <div>
                  <input
                    type="text"
                    placeholder={i18n.ENTER_PEOPLE_GROUP}
                    name="targetGroup"
                    value={targetGroup}
                    onChange={this.changeValue.bind(this)}
                    onKeyUp={this.valueKeyUp.bind(this)}
                  />
                </div>
              </div>
              <div className={s['item']}>
                <label htmlFor="">{i18n.PERFORM_STAFF}：</label>
                <div>
                  <input
                    type="text"
                    placeholder={i18n.ENTER_PERFORM_STAFF}
                    name="targetExecutor"
                    value={targetExecutor}
                    onChange={this.changeValue.bind(this)}
                    onKeyUp={this.valueKeyUp.bind(this)}
                  />
                </div>
              </div>
            </div>
            <div className={s['flexCtn']}>
              <div className={s['item']}>
                <label htmlFor="" className={s['requiredName']}>
                  {i18n.ENERGY_CONSUMPTION_OF_THE_DAY}：
                </label>
                <div className={s['inputWidth']}>
                  <input
                    type="text"
                    value={runDay}
                    name="runDay"
                    className={
                      requiredTooltip && runDay === '' ? 'warning' : ''
                    }
                    onChange={this.changeValue.bind(this)}
                    onKeyUp={this.valueKeyUp.bind(this)}
                  />
                  <span>{i18n.HOUR}</span>
                  {requiredTooltip &&
                    runDay === '' && (
                      <span className={s['warning']}>
                        {i18n.ENERGY_CONSUMPTION_OF_THE_DAY}
                      </span>
                    )}
                </div>
              </div>
              <div className={s['item']}>
                <label htmlFor="" className={s['requiredName']}>
                  {i18n.ENERGY_CONSUMPTION_OF_THE_WEEK}：
                </label>
                <div className={s['inputWidth']}>
                  <input
                    type="text"
                    value={runWeek}
                    name="runWeek"
                    className={
                      requiredTooltip && runWeek === '' ? 'warning' : ''
                    }
                    onChange={this.changeValue.bind(this)}
                    onKeyUp={this.valueKeyUp.bind(this)}
                  />
                  <span>{i18n.HOUR}</span>
                  {requiredTooltip &&
                    runWeek === '' && (
                      <span className={s['warning']}>
                        {i18n.ENERGY_CONSUMPTION_OF_THE_WEEK}
                      </span>
                    )}
                </div>
              </div>
              <div className={s['item']}>
                <label htmlFor="" className={s['requiredName']}>
                  {i18n.ENERGY_CONSUMPTION_OF_THE_MONTH}：
                </label>
                <div className={s['inputWidth']}>
                  <input
                    type="text"
                    value={runMonth}
                    name="runMonth"
                    onChange={this.changeValue.bind(this)}
                    onKeyUp={this.valueKeyUp.bind(this)}
                  />
                  <span>{i18n.HOUR}</span>
                </div>
              </div>
            </div>
            <div className={s['flexCtn']}>
              <div className={s['item']}>
                <label htmlFor="" className={s['requiredName']}>
                  {i18n.ENERGY_CONSUMPTION_OF_THE_YEAR}：
                </label>
                <div className={s['inputWidth']}>
                  <input
                    type="text"
                    value={runYear}
                    name="runYear"
                    className={
                      requiredTooltip && runYear === '' ? 'warning' : ''
                    }
                    onChange={this.changeValue.bind(this)}
                    onKeyUp={this.valueKeyUp.bind(this)}
                  />
                  <span>{i18n.HOUR}</span>
                  {requiredTooltip &&
                    runYear === '' && (
                      <span className={s['warning']}>
                        {i18n.ENERGY_CONSUMPTION_OF_THE_YEAR}
                      </span>
                    )}
                </div>
              </div>
              <div className={s['item']}>
                <label htmlFor="">
                  {i18n.ENERGY_CONSUMPTION_OF_THE_UNIT}：
                </label>
                <Dropdown
                  className={s['dropdown']}
                  placeHolder="kWh"
                  name="unit"
                  options={[
                    { key: '0', text: 'kWh' },
                    { key: '1', text: 'kJ' }
                  ]}
                  onChanged={this.changeUnit.bind(this)}
                  selectedKey={unit === 'kWh' ? '0' : '1'}
                />
              </div>
            </div>
          </div>
          <div className={s['bodyRight']}>
            <div className={s['item']}>
              <label htmlFor="">
                {i18n.ENERGY_CONSUMPTION_OF_THE_CONFIGURATION}：
              </label>
              <div className={s['energyConfigDropDwon']}>
                <Dropdown
                  className={s['dropdown']}
                  placeHolder={i18n.SELECT_CONSUMPTION_WAY}
                  options={this.energyConfigArr}
                  onChanged={this.changeEnergyConfig.bind(this, 'name')}
                  selectedKey={energyConfig.name || 'null'}
                />
                {energyConfig.name !== 'null' && energyConfig.parameters ? (
                  <div className={s['energyConfigCtn']}>
                    {Object.keys(energyConfig.parameters).map((row, index) => (
                      <div key={index}>
                        <span title={row}>{row}</span>
                        <div style={{ display: 'inline-block' }}>
                          <input
                            type="text"
                            value={energyConfig.parameters[row]}
                            placeholder={
                              this.energyConfig[energyConfig.name][row]
                            }
                            onDrop={this._onTextDrop}
                            onDragEnter={this.onClick.bind(this)}
                            onDragOver={this.onClick.bind(this)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  ''
                )}
              </div>
            </div>
            <div className={s['item']}>
              <label htmlFor="">{i18n.CHART_LEGEND}：</label>
              <div>
                <div className={s['chartInfo']} id="chartInfo">
                  {chart
                    ? chart.map((row, index) => (
                        <div key={index}>
                          <Dropdown
                            className={s['dropdown']}
                            options={this.chartOptions}
                            onChanged={this.changeChart.bind(
                              this,
                              index,
                              'name'
                            )}
                            selectedKey={row.name}
                          />
                          <Dropdown
                            className={s['dropdown']}
                            placeholder={i18n.SELECT_AXIS}
                            options={[
                              { key: '0', text: i18n.PRIMARY_AXIS },
                              { key: '1', text: i18n.DEPUTY_AXIS }
                            ]}
                            selectedKey={'' + row.type}
                            v
                            onChanged={this.changeChart.bind(
                              this,
                              index,
                              'type'
                            )}
                          />
                          <span>
                            <i
                              className="ms-Icon ms-Icon--Cancel"
                              onClick={this.delete.bind(this, index)}
                            />
                          </span>
                        </div>
                      ))
                    : ''}
                </div>
                <div className={s['addChartCtn']} onClick={this.addChartInfo}>
                  <i className="ms-Icon ms-Icon--AddTo" />
                  <span>{i18n.ADD_CHART_LEGEND}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Panel>
    );
  }

  onClick(ev) {
    ev.preventDefault();
    ev.stopPropagation();
  }
  _onTextDrop(ev) {
    this.onClick(ev);
    let dragTagInfo = ev.dataTransfer.getData('dragTagInfo'),
      dragDsInfo = ev.dataTransfer.getData('dragDsInfo'),
      dragInfo = dragTagInfo || dragDsInfo;
    if (dragInfo) {
      let info = JSON.parse(dragInfo);
      ev.target.value = info.id;
      $(ev.target)
        .focus()
        .blur();
    }
  }
  addChartInfo() {
    const { itemInfo } = this.state;
    let chart = itemInfo.chart;
    let newChart = chart.concat([
      {
        name: '',
        type: 0
      }
    ]);
    this.updateState('chart', newChart);
  }
  delete(index) {
    const { itemInfo } = this.state;
    let chart = itemInfo.chart;
    let newChart = chart.filter((row, i) => i !== index);
    this.updateState('chart', newChart);
  }
  changeChart(index, type, value) {
    const { itemInfo } = this.state;
    let chart = itemInfo.chart;
    let key = value.key;
    type == 'type' && (key = Number(key));
    let newChart = chart.map((row, i) => {
      if (index === i) {
        row = Object.assign({}, row, {
          [type]: key
        });
      }
      return row;
    });
    this.updateState('chart', newChart);
  }
  _energyConfigParamKeyUp(e) {
    if (e.key === 'Enter') {
      this.changeEnergyConfigParams(e);
    }
  }
  changeEnergyConfigParams(e) {
    const { itemInfo } = this.state;
    let energyConfig = itemInfo.energyConfig;
    let name = e.target.name;
    let value = e.target.value;
    let parameters = Object.assign({}, energyConfig.parameters, {
      [name]: value
    });
    let newData = Object.assign({}, energyConfig, {
      parameters: parameters
    });
    this.updateState('energyConfig', newData);
  }
  changeEnergyConfig(type, value) {
    const { itemInfo } = this.state;
    let energyConfig = itemInfo.energyConfig;
    let newData = {};
    if (type === 'name') {
      let val = value.key;
      if (val !== 'null') {
        let params = this.energyConfig[val];
        let newParams = {};
        Object.keys(params).forEach(row => (newParams[row] = ''));
        newData = {
          name: val,
          parameters: newParams
        };
      }
    }
    this.updateState('energyConfig', newData);
  }
  changeUnit(value) {
    this.updateState('unit', value.text);
  }
  changeFaultTag(value) {
    this.updateState('faultTag', Number(value.key));
  }
  changeValue(e, a) {
    const { itemInfo } = this.state;
    let changeData;
    if (e.target) {
      let name = e.target.name;
      let value = e.target.value;
      let numberType = [
        'faultId',
        'faultTag',
        'runDay',
        'runWeek',
        'runMonth',
        'runYear',
        'targetExecutor'
      ];
      if (numberType.indexOf(name) !== -1) {
        value = value;
      }
      this.updateState(name, value);
    } else {
      let name = e;
      this.updateState(name, a);
    }
  }
  valueKeyUp(e) {
    if (e.key === 'Enter') {
      this.changeValue(e);
    }
  }

  updateState(name, value) {
    const { itemInfo } = this.state;
    let newData = Object.assign({}, itemInfo, {
      [name]: value
    });
    this.setState({
      itemInfo: newData
    });
  }
  updateModule() {
    const { itemInfo, requiredTooltip } = this.state;
    const {
      name,
      description,
      faultTypeGroup,
      targetGroup,
      targetExecutor,
      runDay,
      runMonth,
      runWeek,
      runYear,
      unit,
      energyConfig,
      faultTag,
      chart
    } = itemInfo;
    const { selectedItem, i18n } = this.props;
    if (runDay && runMonth && runWeek && runYear) {
      let newData = Object.assign({}, itemInfo, {
        faultId: selectedItem.id,
        status: 1,
        runDay: Number(runDay),
        runWeek: Number(runWeek),
        runMonth: Number(runMonth),
        runYear: Number(runYear)
      });
      this.props.updateParameters(newData);
    } else {
      Confirm({
        title: i18n.TOOLTIP,
        type: 'info',
        content: i18n.NOT_REQUIRED_FILL,
        onOk: () => {}
      });
      this.setState({
        requiredTooltip: true
      });
    }
  }
}

var mapDispatchToProps = {
  getTagDict
};

var mapStateToProps = function(state) {
  return {
    tagDict: state.home.tagDict
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditParameter);
