/**
 * 模糊规则面板
 */
/**
 * State:
 * selectedItems: 选中的行
 * isShowConfigModal: 是否显示配置模态框
 *
 */
/**
 * Event
 *
 * addRow: 添加一行图形 x 轴配置
 * deleteRow: 删除一行图形 x 轴配置
 * _confirmRowArgs: 确认当前图形配置
 * _closeConfigModal: 关闭图形配置模态框
 * _inputValueChanged: 图形配置 input 轴值变化
 * _dropselectChange: 下拉
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';
import {
  DetailsList,
  DetailsListLayoutMode,
  CheckboxVisibility,
  Selection
} from 'office-ui-fabric-react/lib/DetailsList';
import { Modal } from 'office-ui-fabric-react/lib/Modal';
import { Dropdown } from 'office-ui-fabric-react/lib/Dropdown';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';

import { dataTypes } from '@beopcloud/StrategyV2-Engine/src/enum.js';

import {
  fuzzyRuleUnitNames,
  fuzzyRuleUnit,
  fuzzyRuleInputOutputTypes,
  fuzzyRuleInputOutputTypeNames
} from '../../../common/enum.js';
import TextToggle from '../../../components/TextToggle/TextToggle.js';
import Confirm from '../../../components/Confirm/Confirm.js';
import UnknownTooltip from '../../../components/UnknownTooltip';
import FuzzyRuleChartView from '../../../components/FuzzyRuleChartView';

import FuzzyRulesModalView from './FuzzyRuleModalView.js';
import s from './FuzzyRulesPanel.css';

// 单位下拉框
let unit_options = [
  {
    key: fuzzyRuleUnit.NONE,
    text: fuzzyRuleUnitNames[fuzzyRuleUnit.NONE]
  },
  {
    key: fuzzyRuleUnit.TEMPERATURE,
    text: fuzzyRuleUnitNames[fuzzyRuleUnit.TEMPERATURE]
  },
  {
    key: fuzzyRuleUnit.TEMPERATURE_F,
    text: fuzzyRuleUnitNames[fuzzyRuleUnit.TEMPERATURE_F]
  },
  {
    key: fuzzyRuleUnit.WEIGHT,
    text: fuzzyRuleUnitNames[fuzzyRuleUnit.WEIGHT]
  },
  {
    key: fuzzyRuleUnit.ENERGY,
    text: fuzzyRuleUnitNames[fuzzyRuleUnit.ENERGY]
  },
  {
    key: fuzzyRuleUnit.K_ENERGY,
    text: fuzzyRuleUnitNames[fuzzyRuleUnit.K_ENERGY]
  },
  {
    key: fuzzyRuleUnit.M_ENERGY,
    text: fuzzyRuleUnitNames[fuzzyRuleUnit.M_ENERGY]
  },
  {
    key: fuzzyRuleUnit.POWER,
    text: fuzzyRuleUnitNames[fuzzyRuleUnit.POWER]
  },
  {
    key: fuzzyRuleUnit.ELECTRIC,
    text: fuzzyRuleUnitNames[fuzzyRuleUnit.ELECTRIC]
  },
  {
    key: fuzzyRuleUnit.FREQUENCY,
    text: fuzzyRuleUnitNames[fuzzyRuleUnit.FREQUENCY]
  },
  {
    key: fuzzyRuleUnit.FREQUENCY_P,
    text: fuzzyRuleUnitNames[fuzzyRuleUnit.FREQUENCY_P]
  },
  {
    key: fuzzyRuleUnit.FLOW_S,
    text: fuzzyRuleUnitNames[fuzzyRuleUnit.FLOW_S]
  },
  {
    key: fuzzyRuleUnit.FLOW_H,
    text: fuzzyRuleUnitNames[fuzzyRuleUnit.FLOW_H]
  },
  {
    key: fuzzyRuleUnit.FLOW_M,
    text: fuzzyRuleUnitNames[fuzzyRuleUnit.FLOW_M]
  },
  {
    key: fuzzyRuleUnit.LEVEL,
    text: fuzzyRuleUnitNames[fuzzyRuleUnit.LEVEL]
  },
  {
    key: fuzzyRuleUnit.LEVEL_C,
    text: fuzzyRuleUnitNames[fuzzyRuleUnit.LEVEL_C]
  },
  {
    key: fuzzyRuleUnit.WATER_LEVEL,
    text: fuzzyRuleUnitNames[fuzzyRuleUnit.WATER_LEVEL]
  },
  {
    key: fuzzyRuleUnit.WATER_LEVEL_C,
    text: fuzzyRuleUnitNames[fuzzyRuleUnit.WATER_LEVEL_C]
  },
  {
    key: fuzzyRuleUnit.HIGHT,
    text: fuzzyRuleUnitNames[fuzzyRuleUnit.HIGHT]
  },
  {
    key: fuzzyRuleUnit.HIGHT_C,
    text: fuzzyRuleUnitNames[fuzzyRuleUnit.HIGHT_C]
  },
  {
    key: fuzzyRuleUnit.HIGHT_D,
    text: fuzzyRuleUnitNames[fuzzyRuleUnit.HIGHT_D]
  },
  {
    key: fuzzyRuleUnit.HIGHT_M,
    text: fuzzyRuleUnitNames[fuzzyRuleUnit.HIGHT_M]
  },
  {
    key: fuzzyRuleUnit.SPEED,
    text: fuzzyRuleUnitNames[fuzzyRuleUnit.SPEED]
  },
  {
    key: fuzzyRuleUnit.SPEED_K,
    text: fuzzyRuleUnitNames[fuzzyRuleUnit.SPEED_K]
  },
  {
    key: fuzzyRuleUnit.RADIATION,
    text: fuzzyRuleUnitNames[fuzzyRuleUnit.RADIATION]
  },
  {
    key: fuzzyRuleUnit.ILLUMINATION,
    text: fuzzyRuleUnitNames[fuzzyRuleUnit.ILLUMINATION]
  },
  {
    key: fuzzyRuleUnit.PRESSURE,
    text: fuzzyRuleUnitNames[fuzzyRuleUnit.PRESSURE]
  },
  {
    key: fuzzyRuleUnit.K_PRESSURE,
    text: fuzzyRuleUnitNames[fuzzyRuleUnit.K_PRESSURE]
  },
  {
    key: fuzzyRuleUnit.B_PRESSURE,
    text: fuzzyRuleUnitNames[fuzzyRuleUnit.B_PRESSURE]
  },
  {
    key: fuzzyRuleUnit.LOAD,
    text: fuzzyRuleUnitNames[fuzzyRuleUnit.LOAD]
  },
  {
    key: fuzzyRuleUnit.LOAD_H,
    text: fuzzyRuleUnitNames[fuzzyRuleUnit.LOAD_H]
  },
  {
    key: fuzzyRuleUnit.RATIO_E,
    text: fuzzyRuleUnitNames[fuzzyRuleUnit.RATIO_E]
  },
  {
    key: fuzzyRuleUnit.RATIO_O,
    text: fuzzyRuleUnitNames[fuzzyRuleUnit.RATIO_O]
  },
  {
    key: fuzzyRuleUnit.CONCENTRATION,
    text: fuzzyRuleUnitNames[fuzzyRuleUnit.CONCENTRATION]
  },
  {
    key: fuzzyRuleUnit.REN_MIN_BI,
    text: fuzzyRuleUnitNames[fuzzyRuleUnit.REN_MIN_BI]
  },
  {
    key: fuzzyRuleUnit.DOLLAR,
    text: fuzzyRuleUnitNames[fuzzyRuleUnit.DOLLAR]
  },
  {
    key: fuzzyRuleUnit.STATUS,
    text: fuzzyRuleUnitNames[fuzzyRuleUnit.STATUS]
  },
  {
    key: fuzzyRuleUnit.COMMOND,
    text: fuzzyRuleUnitNames[fuzzyRuleUnit.COMMOND]
  }
];
// 类型下拉框
let type_options = [
  {
    key: 'UNDEFINED',
    text: fuzzyRuleInputOutputTypeNames[fuzzyRuleInputOutputTypes.UNDEFINED]
  },
  {
    key: 'CONTINUOUS',
    text: fuzzyRuleInputOutputTypeNames[fuzzyRuleInputOutputTypes.CONTINUOUS]
  },
  {
    key: 'BOOL',
    text: fuzzyRuleInputOutputTypeNames[fuzzyRuleInputOutputTypes.BOOL]
  },
  {
    key: 'SETPOINT',
    text: fuzzyRuleInputOutputTypeNames[fuzzyRuleInputOutputTypes.SETPOINT]
  },
  {
    key: 'FORMULA',
    text: fuzzyRuleInputOutputTypeNames[fuzzyRuleInputOutputTypes.FORMULA]
  },
  {
    key: 'CONTINUOUSWITHSETPOINT',
    text:
      fuzzyRuleInputOutputTypeNames[
        fuzzyRuleInputOutputTypes.CONTINUOUSWITHSETPOINT
      ]
  },
  {
    key: 'SERIESANALYSISCODE',
    text:
      fuzzyRuleInputOutputTypeNames[
        fuzzyRuleInputOutputTypes.SERIESANALYSISCODE
      ]
  },
  {
    key: 'CUSTORMIZEDCONTINUOUS',
    text:
      fuzzyRuleInputOutputTypeNames[
        fuzzyRuleInputOutputTypes.CUSTORMIZEDCONTINUOUS
      ]
  }
];

class DiagnosisRelatedModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      alias: '',
      status: 0,
      unit: fuzzyRuleUnit.NONE,
      type: 0,
      check: 0,
      precision: 0
    };
  }
  render() {
    const { params, index, selItem, i18n } = this.props;
    let { alias, status, precision, unit, check, type } =
      params[index] || selItem[0];
    return (
      <form className={s['formWrap']}>
        <ul>
          <li className={s['listWrap'] + ' clear-both'}>
            <div className={s['listName']}>
              <label>
                <span>{i18n.ALIAS}</span>
                <UnknownTooltip content={i18n.ANNOTATION_ALIAS} />
              </label>
              <div>
                <input
                  value={alias}
                  placeholder={i18n.ENTER_ALIAS}
                  onChange={this._valueChange.bind(this, 'alias')}
                  onKeyUp={this._onKeyUp.bind(this, 'alias')}
                />
              </div>
            </div>
            <div className={s['listdropDown']}>
              <label>
                <span>{i18n.UNIT}</span>
                <UnknownTooltip content={i18n.ANNOTATION_UNIT} />
              </label>
              <div>
                <Dropdown
                  className={s['Dropdown']}
                  onChanged={drop => {
                    this._dropdownChange(drop, 'unit');
                  }}
                  placeHolder={i18n.SELECT_UNIT}
                  options={unit_options}
                  selectedKey={unit}
                />
              </div>
            </div>
          </li>
          <li className={s['listWrap'] + ' clear-both'}>
            <div style={{ width: '100%' }}>
              <label>
                <span>{i18n.TYPE}</span>
                <UnknownTooltip content={i18n.ANNOTATION_ALIAS} />
              </label>
              <div>
                <Dropdown
                  className={s['Dropdown']}
                  onChanged={drop => {
                    this._dropdownChange(drop, 'type');
                  }}
                  options={type_options}
                  selectedKey={
                    typeof type !== 'number'
                      ? type
                      : type_options[type] ? type_options[type].key : 'BOOL'
                  }
                />
              </div>
            </div>
          </li>
          <li className={s['listWrap'] + ' clear-both'}>
            <div>
              <label>
                <span>{i18n.TIME_CHECK}</span>
                <UnknownTooltip content={i18n.ANNOTATION_TIME_CHECK} />
              </label>
              <div>
                <Dropdown
                  className={s['Dropdown']}
                  onChanged={drop => {
                    this._dropdownChange(drop, 'check');
                  }}
                  placeHolder={i18n.SELECT_UNIT}
                  options={[
                    {
                      key: 'YES',
                      text: i18n.YES
                    },
                    {
                      key: 'NO',
                      text: i18n.NO
                    }
                  ]}
                  selectedKey={
                    typeof check !== 'number'
                      ? check
                      : check === 1 ? 'YES' : 'NO'
                  }
                />
              </div>
            </div>
            <div className={s['listName']}>
              <label>
                <span>{i18n.SENSING_ACCURACY}</span>
                <UnknownTooltip content={i18n.ANNOTATION_SENSING_ACCURACY} />
              </label>
              <div>
                <input
                  value={precision}
                  placeholder={i18n.ENTER_NUMERIC_VALUE}
                  onChange={this._valueChange.bind(this, 'precision')}
                  onKeyUp={this._onKeyUp.bind(this, 'precision')}
                />
              </div>
            </div>
          </li>
          <li className={s['listWrap'] + ' clear-both'} />
          <li className={s['listWrap'] + ' clear-both'}>
            <div className={s['status']}>
              <label>
                <span>{i18n.STATE}</span>
              </label>
              <div>
                <TextToggle
                  defaultChecked={status}
                  offText="OFF"
                  onText="ON"
                  onClick={this._statusUpdate.bind(this, status)}
                />
              </div>
            </div>
          </li>
        </ul>
      </form>
    );
  }
  // 输入框值改变
  _valueChange(args, e) {
    let newValue = e.currentTarget.value;
    switch (args) {
      case 'precision':
        this.setState({
          precision: newValue
        });
        break;
      case 'alias':
        this.setState({
          alias: newValue
        });
        break;
    }
    this._onChange(args, args == 'precision' ? Number(newValue) : newValue);
  }
  _onKeyUp(args, e) {
    if (e.key === 'Enter') {
      this._valueChange(args, e);
      e.target.blur();
    }
  }

  _onChange(field, value) {
    const { index, onChange, params } = this.props;
    onChange('params', params.set(index, params[index].set(field, value)));
  }
  // 状态图表切换
  _statusUpdate(status) {
    this.setState({
      status: 1 - status
    });
    this._onChange('status', 1 - status);
  }
  // 下拉选项改变
  _dropdownChange(dropOpt, value) {
    const key = dropOpt.key;
    let newValue;
    switch (value) {
      case 'unit':
        this.setState({
          unit: key
        });
        newValue = key;
        break;
      case 'type':
        this.setState({
          type: key
        });
        newValue =
          typeof key === 'number'
            ? key
            : type_options.findIndex(row => row.key === key);
        break;
      case 'check':
        this.setState({
          check: key
        });
        newValue = typeof key === 'number' ? key : key === 'YES' ? 1 : 0;
        break;
    }
    this._onChange(value, newValue);
  }
}

class FuzzyRulesPanel extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedItems: [],
      items: [],
      isShowConfigModal: false,
      isShowDiagnosisModal: false,
      selItem: [],
      isShowAddModal: false,
      addNewName: '',
      isSelected: 'termConfig'
    };

    this._selection = new Selection({
      onSelectionChanged: () => {
        const selectedItems = this._selection.getSelection();
        this.setState({ selectedItems });
      }
    });
    this._columns = [
      {
        key: 'name',
        name: this.props.i18n.FUZZY_PARAM_NAME,
        minWidth: 140,
        maxWidth: 200,
        onRender: item => <div>{item['name']}</div>
      },
      {
        key: 'fuzzyView',
        name: this.props.i18n.FUZZY_VIEW,
        minWidth: 350,
        maxWidth: 350,
        onRender: (item, index) => {
          return (
            <div className={s['fuzzy_view']}>
              <FuzzyRuleChartView
                terms={item.terms}
                pos={item.pos}
                min={item.min}
                max={item.max}
                isDrawReact={false}
              />
            </div>
          );
        }
      },
      {
        key: 'realtimeValue',
        name: this.props.i18n.REAL_TIME_VALUE,
        minWidth: 80,
        maxWidth: 180,
        onRender: item => <div>{item['realtimeValue']}</div>
      },
      {
        key: 'results',
        name: this.props.i18n.RESULT,
        minWidth: 80,
        maxWidth: 140,
        onRender: item => <div>{item['results']}</div>
      }
    ];
    this.showAddModal = this.showAddModal.bind(this);
    this._closeModal = this._closeModal.bind(this);
    this._addItem = this._addItem.bind(this);
    this.changeName = this.changeName.bind(this);
    this._addNameKeyUp = this._addNameKeyUp.bind(this);
  }
  componentWillMount() {
    const { selectedItems } = this.state;
    if (selectedItems.length !== 0 && selectedItems[0] !== undefined) {
      this._selection.setIndexSelected(0, true, false);
    }
  }
  componentWillReceiveProps(nextProps) {
    const { data, moduleInputData, updateModule } = nextProps;
    const { params } = data.options;
    const { selectedItems } = this.state;
    let inputData = moduleInputData.find(
      row => row.dataType === dataTypes['DS_OPT']
    );
    let newItems = [];
    if (params) {
      params.forEach(row => newItems.push(row));
    }
    let newSelectedItems = [];
    if (inputData.data) {
      inputData.data.forEach(row => {
        if (newItems.findIndex(v => v.name === row.name) === -1) {
          let singleItem = {
            name: row.name,
            type: 0,
            alias: '',
            status: 1,
            unit: fuzzyRuleUnit.NONE,
            check: 0,
            enabled: 1,
            min: 0,
            max: 100,
            precision: 0,
            pos: [0, 0],
            type: 0,
            terms: []
          };
          newItems.push(singleItem);
          let tmp = data.setIn(['options', 'params'], newItems);
          updateModule(tmp);
        }
      });
      newItems.forEach((row, index) => {
        if (inputData.data.findIndex(v => v.name === row.name) === -1) {
          newItems.splice(index, 1);
          let { data, updateModule } = nextProps;
          data = data.setIn(['options', 'params'], newItems);
          updateModule(data);
        }
      });
    }
    if (selectedItems.length == 0 || selectedItems[0] == undefined) {
      this._selection.setIndexSelected(0, true, false);
    } else {
      let index = newItems.findIndex(v => v.name == selectedItems[0].name);
      this._selection.setIndexSelected(index, true, false);
    }
    newSelectedItems =
      selectedItems.length !== 0 && selectedItems[0] !== undefined
        ? selectedItems
        : [newItems[0]];
    this.setState({
      items: newItems,
      selectedItems: newSelectedItems || []
    });
  }

  render() {
    let {
      items,
      selItem,
      selectedItems,
      isShowConfigModal,
      isShowDiagnosisModal,
      isShowAddModal,
      addNewName,
      isSelected
    } = this.state;
    const { i18n, data } = this.props;
    let { params } = data.options;
    const paramsIndex =
      items.length !== 0 &&
      selectedItems.length !== 0 &&
      selectedItems[0] !== undefined
        ? items.findIndex(v => v.name == selectedItems[0].name)
        : 0;
    return (
      <div className={s['container']}>
        <div
          className={s['leftWrap']}
          style={{
            width:
              items.length == 0 || selectedItems.length == 0
                ? '100%'
                : 'calc(100% - 300px)'
          }}
        >
          <div className={s['toolsWrap'] + ' clear-both'}>
            <div className={s['fuzzy_text']}>
              <span>
                {i18n.MODULE_NAME}{' '}
                <UnknownTooltip content={i18n.ANNOTATION_MODULE_NAME} />
              </span>
            </div>
            <div className={s['tools'] + ' clear-both'}>
              <div className={s['toolItem']} onClick={this.showAddModal}>
                <i className={'ms-Icon ms-Icon--AddEvent'} />
                <span className={s['toolName']}>{i18n.ADD}</span>
              </div>
              <div className={s['icon-line']} />
              <div
                className={s['toolItem']}
                onClick={this._deleteItem.bind(this)}
              >
                <i className={'ms-Icon ms-Icon--Delete'} />
                <span className={s['toolName']}>{i18n.DELETE}</span>
              </div>
            </div>
          </div>
          <div className={s['list']}>
            <DetailsList
              headerClassName="strategy-list-header"
              items={items}
              columns={this._columns}
              setKey="set"
              layoutMode={DetailsListLayoutMode.justified}
              selection={this._selection}
              selectionMode={1}
              selectionPreservedOnEmptyClick={true}
              checkboxVisibility={CheckboxVisibility.always}
            />
            <Modal
              isOpen={isShowAddModal}
              onDismiss={this._closeModal}
              isBlocking={false}
            >
              <div className={s['addModal']}>
                <div className={s['modal-title']}>{i18n.ADD}</div>
                <div className={s['modal-body']}>
                  <label>Name:</label>
                  <input
                    type="text"
                    value={addNewName}
                    onChange={this.changeName}
                    onBlur={this.changeName}
                    onKeyUp={this._addNameKeyUp}
                  />
                </div>
                <div className={s['modal-footer']}>
                  <DefaultButton
                    onClick={this._addItem}
                    text={i18n.OK}
                    primary={true}
                  />
                  <DefaultButton
                    onClick={this._closeModal}
                    text={i18n.CANCEL}
                  />
                </div>
              </div>
            </Modal>
          </div>
        </div>
        {items.length !== 0 && selectedItems.length !== 0 ? (
          <div className={s['rightWrap']}>
            <ul>
              <li
                className={`${s['item']} ${isSelected === 'termConfig' &&
                  ' selected'}`}
                onClick={this._changeSelected.bind(this, 'termConfig')}
              >
                <button>
                  <i className={'ms-Icon ms-Icon--Diagnostic'} />
                  <span>{i18n.TERM_CONFIG}</span>
                </button>
              </li>
              <li
                className={`${s['item']} ${isSelected === 'Diagnosis' &&
                  ' selected'}`}
                onClick={this._changeSelected.bind(this, 'Diagnosis')}
              >
                <button>
                  <i className={'ms-Icon ms-Icon--Questionnaire'} />
                  <span>{i18n.DIAGNOSIS_RELATED}</span>
                </button>
              </li>
            </ul>
            {isSelected === 'termConfig' && (
              <div>
                <FuzzyRulesModalView
                  selItem={selectedItems}
                  onChange={this._onChange.bind(this)}
                  params={params}
                  index={paramsIndex == -1 ? 0 : paramsIndex}
                  i18n={i18n}
                />
              </div>
            )}
            {isSelected === 'Diagnosis' && (
              <div>
                <DiagnosisRelatedModal
                  selItem={selectedItems}
                  onChange={this._onChange.bind(this)}
                  params={params}
                  index={paramsIndex == -1 ? 0 : paramsIndex}
                  i18n={i18n}
                />
              </div>
            )}
          </div>
        ) : (
          undefined
        )}
      </div>
    );
  }
  _changeSelected(target) {
    let { selectedItems, items } = this.state;
    const index = items.findIndex(v => v.name == selectedItems[0].name);
    const newSelectedItems = Object.assign(
      {},
      selectedItems[0],
      this.props.data.options.params[index]
    );
    this.setState({
      selectedItems: [newSelectedItems],
      isSelected: target
    });
  }
  // 删除
  _deleteItem() {
    let { selectedItems, items } = this.state;
    const { moduleInputData, i18n } = this.props;
    let inputData = moduleInputData.find(
      row => row.dataType === dataTypes['DS_OPT']
    ) || { data: false };
    let dsoptData = inputData.data || [],
      dsoptDataNamesSet = new Set(dsoptData.map(v => v.name));
    if (selectedItems.length <= 0) {
      Confirm({
        title: i18n.SELECT_DELETE_OF_THE_CONFIG,
        type: 'warning',
        onOk: () => {},
        onCancel: () => {}
      });
      return;
    }
    if (
      selectedItems.filter(item => dsoptDataNamesSet.has(item.name)).length > 0
    ) {
      Confirm({
        title: i18n.UNABLE_DELETE_DEFAULT_CONFIG,
        type: 'warning',
        onOk: () => {},
        onCancel: () => {}
      });
      return;
    }
    let newItems = [];
    if (selectedItems.length == 1) {
      newItems = items.filter(v => v.name !== selectedItems[0].name);
    } else {
      newItems = items.concat([]);
      for (var i = 0; i < selectedItems.length; i++) {
        newItems = newItems.filter(v => v.name !== selectedItems[i].name);
      }
    }
    this.setState({
      items: newItems
    });
    let propsData = this.props.data;
    propsData = propsData.setIn(['options', 'params'], newItems);
    this.props.updateModule(propsData);
  }
  showAddModal() {
    this.setState({
      isShowAddModal: true
    });
  }
  _closeModal() {
    this.setState({
      isShowAddModal: false,
      addNewName: ''
    });
  }
  changeName(e) {
    this.setState({
      addNewName: e.target.value
    });
  }
  _addNameKeyUp(e) {
    if (e.key == 'Enter') {
      e.target.blur();
      this.changeName(e);
    }
  }
  // 添加
  _addItem() {
    let items = this.state.items.concat([]);
    const { addNewName } = this.state;
    let sameNameItem = items.find(row => {
      return row.name === addNewName;
    });
    if (!addNewName || sameNameItem) {
      Confirm({
        title: this.props.i18n.REQUIRED_NAME,
        type: 'warning',
        onOk: () => {},
        onCancel: () => {}
      });
      return;
    }
    let item = {
      name: addNewName,
      type: 0,
      alias: '',
      status: 1,
      unit: fuzzyRuleUnit.NONE,
      check: 0,
      enabled: 1,
      min: 0,
      max: 100,
      precision: 0,
      pos: [0, 0],
      type: 0,
      terms: []
    };
    items.push(item);
    this.setState({
      items
    });
    let propsData = this.props.data;
    propsData = propsData.setIn(['options', 'params'], items);
    this.props.updateModule(propsData);
    this._closeModal();
  }
  /** 改变配置项 */
  _onChange(field, value) {
    if (typeof field === 'string') {
      field = [field];
    }
    this.props.updateModule(
      this.props.data.setIn(['options', ...field], value)
    );
  }
}
FuzzyRulesPanel.propTypes = {};

export default FuzzyRulesPanel;
