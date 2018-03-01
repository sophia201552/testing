/**
 * SVM模态框
 * @author ivy
 */

import React from 'react';
import PropTypes from 'prop-types';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { Dropdown } from 'office-ui-fabric-react/lib/Dropdown';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import { SpinButton } from 'office-ui-fabric-react/lib/SpinButton';
import ehcarts from 'echarts';
import ReactEcharts from 'echarts-for-react';
import * as moment from 'moment';

import UnknownTooltip from '../../../components/UnknownTooltip';

import { dataTypes } from '@beopcloud/StrategyV2-Engine/src/enum';

import s from './SVMPanel.css';
import { debug } from 'util';

class SVMType extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      costValue: '',
      epsilonValue: ''
    };
    this._onChange = this._onChange.bind(this);
  }
  render() {
    const { svmType, i18n } = this.props;
    const { costValue, epsilonValue } = this.state;
    return (
      <div className={s['svm-type']}>
        <div className={s['svm-title-text']}>
          <h3>SVM Type</h3>
        </div>
        <div className={s['svm-select-details']}>
          <ul>
            <li className="clear-both">
              <div className={s['svm-item']}>
                <Checkbox
                  className={s['svm-checkbox']}
                  label={svmType.type}
                  checked={true}
                  onChange={(e, checked) =>
                    this._onChange('type', !checked ? svmType.type : '')
                  }
                />
              </div>
            </li>
            <li className="clear-both">
              <div
                className={s['svm-item-spinbutton'] + ' svm-item-spinbutton'}
              >
                <label>
                  {'Cost(C)'}
                  <UnknownTooltip content={i18n.ANNOTATION_COST} />
                </label>
                <input
                  value={costValue !== '' ? costValue : svmType.cost}
                  onChange={this._valueChange.bind(this, 'cost')}
                  onBlur={this._onBlur.bind(this, 'cost')}
                />
              </div>
            </li>
            <li className="clear-both">
              <div
                className={s['svm-item-spinbutton'] + ' svm-item-spinbutton'}
              >
                <label>
                  {'Epsilon'}
                  <UnknownTooltip content={i18n.ANNOTATION_EPSILON} />
                </label>
                <input
                  onBlur={this._onBlur.bind(this, 'epsilon')}
                  onChange={this._valueChange.bind(this, 'epsilon')}
                  value={epsilonValue !== '' ? epsilonValue : svmType.epsilon}
                />
              </div>
            </li>
          </ul>
        </div>
      </div>
    );
  }
  _valueChange(args, e) {
    let value = e.target.value;
    this.setState({
      [`${args}Value`]: value
    });
  }
  _onBlur(args, e) {
    this._onChange(args, e.target.value - 0);
  }
  _onKeyUp(args, e) {
    if (e.key === 'Enter') {
      this._onBlur(args, e);
    }
  }
  _onChange(field, value) {
    this.props.onChange('svmType', this.props.svmType.set(field, value));
  }
}

class Kernel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this._onChange = this._onChange.bind(this);
  }
  render() {
    const { kernel, i18n } = this.props;
    return (
      <div className={s['svm-type']}>
        <div className={s['svm-title-text']}>
          <h3>
            Kernel <UnknownTooltip content={i18n.ANNOTATION_KERNEL} />
          </h3>
        </div>
        <div className={s['svm-select-details']}>
          <ul>
            <li className="clear-both">
              <div className={s['svm-item']}>
                <Checkbox
                  className={s['svm-checkbox']}
                  label={'Linear'}
                  checked={(kernel.type === 'linear' && true) || false}
                  onChange={(e, checked) =>
                    this._onChange('type', checked ? 'linear' : kernel.type)
                  }
                />
                <UnknownTooltip content={i18n.ANNOTATION_LINEAR} />
              </div>
            </li>
            <li className="clear-both">
              <div className={s['svm-item']}>
                <Checkbox
                  className={s['svm-checkbox']}
                  label={'Poly'}
                  checked={kernel.type === 'poly' ? true : false}
                  onChange={(e, checked) =>
                    this._onChange('type', checked ? 'poly' : kernel.type)
                  }
                />
                <UnknownTooltip content={i18n.ANNOTATION_POLY} />
              </div>
            </li>
            <li className="clear-both">
              <div className={s['svm-item']}>
                <Checkbox
                  className={s['svm-checkbox']}
                  label={'RBF'}
                  checked={kernel.type === 'rbf' ? true : false}
                  onChange={(e, checked) =>
                    this._onChange('type', checked ? 'rbf' : kernel.type)
                  }
                />
                <UnknownTooltip content={i18n.ANNOTATION_RBF} />
              </div>
            </li>
            <li className="clear-both">
              <div className={s['svm-item']}>
                <Checkbox
                  className={s['svm-checkbox']}
                  label={'Sigmoid'}
                  checked={kernel.type === 'sigmoid' ? true : false}
                  onChange={(e, checked) =>
                    this._onChange('type', checked ? 'sigmoid' : kernel.type)
                  }
                />
                <UnknownTooltip content={i18n.ANNOTATION_SIFMOID} />
              </div>
            </li>
            <li className="clear-both">
              <div className={s['svm-item']}>
                <Checkbox
                  className={s['svm-checkbox']}
                  label={'Precomputed'}
                  checked={kernel.type === 'precomputed' ? true : false}
                  onChange={(e, checked) =>
                    this._onChange(
                      'type',
                      checked ? 'precomputed' : kernel.type
                    )
                  }
                />
                <UnknownTooltip content={i18n.ANNOTATION_PRECOMPUTED} />
              </div>
            </li>
          </ul>
        </div>
      </div>
    );
  }
  _onChange(field, value) {
    this.props.onChange('kernel', this.props.kernel.set(field, value));
  }
}

class Option extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0
    };
    this._onChange = this._onChange.bind(this);
  }
  render() {
    const { value } = this.state;
    const { options, i18n } = this.props;
    return (
      <div className={s['svm-type']}>
        <div className={s['svm-title-text']}>
          <h3>Options</h3>
        </div>
        <div className={s['svm-select-details']}>
          <ul>
            <li className="clear-both">
              <div
                className={s['svm-item-spinbutton'] + ' svm-item-spinbutton'}
              >
                <label>
                  {'CV Split Ratio'}{' '}
                  <UnknownTooltip content={i18n.ANNOTATION_CV_SPLIT_RATIO} />
                </label>
                <input
                  onChange={this._valueChange.bind(this)}
                  onBlur={e => {
                    this._onChange('cvSplitRatio', e.target.value);
                  }}
                  onKeyUp={e => {
                    if (e.key === 'Enter') {
                      this._onChange('cvSplitRatio', e.target.value);
                    }
                  }}
                  value={value !== 0 ? value : options.cvSplitRatio}
                />
              </div>
            </li>
          </ul>
        </div>
      </div>
    );
  }
  _valueChange(e) {
    this.setState({
      value: e.target.value
    });
  }
  _onChange(field, value) {
    this.props.onChange('options', this.props.options.set(field, value - 0));
  }
}
let _inputData = [
  {
    dataType: '',
    data: {
      time: [],
      data: []
    }
  }
];
let _outputData = [
  {
    dataType: '',
    data: {
      data: [],
      time: [],
      model: '',
      evaluation: {}
    }
  }
];

class SVMPanel extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      defaultSelectedKey: ''
    };

    this._onChange = this._onChange.bind(this);
    this._selectChange = this._selectChange.bind(this);
    this._getDropdownOption = this._getDropdownOption.bind(this);
    this._getOption = this._getOption.bind(this);
    this._getDefaultSelectKey = this._getDefaultSelectKey.bind(this);
  }
  render() {
    const {
      moduleInputData = _inputData,
      moduleOutputData = _outputData,
      i18n
    } = this.props;
    const { svmType, kernel, options } = this.props.data.options;
    let { defaultSelectedKey } = this.state;
    const inputData = moduleInputData.find(
      v => v.dataType == dataTypes['DS_HIS_OUTPUT']
    );
    const outputData = moduleOutputData.find(
      v => v.dataType == dataTypes['ANLS_SVM_OUTPUT']
    );
    defaultSelectedKey =
      (defaultSelectedKey !== '' && defaultSelectedKey) ||
      ((options && options.dependenVariables[0]) || '');
    const idata = (inputData && inputData.data) || { data: [], time: [] };
    const odata = (outputData && outputData.data) || { data: [] };
    const { data } = idata;
    return (
      <div className={s['container'] + ' svm-modal-container'}>
        <div className={s['svm-slider']}>
          <div>
            <div className={s['panelTitle']}>
              <span>SVR</span>
            </div>
            <div className={s['svm-select']}>
              <div className={s['svm-select-name']}>
                <h3>Base Param</h3>
              </div>
              <Dropdown
                className={s['Dropdown-svm']}
                placeHolder="Select an Option"
                onChanged={dropOption => {
                  this._selectChange(dropOption, idata, moduleOutputData);
                }}
                selectedKey={this._getDefaultSelectKey(
                  defaultSelectedKey,
                  data
                )}
                options={this._getDropdownOption(data)}
              />
            </div>
            <SVMType svmType={svmType} onChange={this._onChange} i18n={i18n} />
            <Kernel kernel={kernel} onChange={this._onChange} i18n={i18n} />
            <Option options={options} onChange={this._onChange} i18n={i18n} />
          </div>
        </div>
        <div className={s['svm-content']}>
          <div className={s['svm-echart']}>
            <div className={s['chart']}>
              <ReactEcharts
                ehcarts={ehcarts}
                option={this._getOption(
                  defaultSelectedKey,
                  moduleInputData,
                  moduleOutputData
                )}
                style={{ height: '100%', width: '100%' }}
                className="react_for_echarts"
              />
            </div>
          </div>
          <div className={s['tableWrap']}>
            <table className={s['operation']}>
              <thead className={s['operation-header']}>
                <tr className={s['thead-row']}>
                  <td>{i18n.TIME}</td>
                  <td>{i18n.HISTORY_VALUE}</td>
                  <td>{i18n.PREDICTED_VALUE}</td>
                </tr>
              </thead>
              {data && (
                <tbody>
                  <tr>
                    <td />
                    <td>
                      {data.map((a, i) => {
                        return (
                          <span
                            key={i}
                            style={{ width: `calc(100%/${data.length})` }}
                          >
                            {a.name}
                          </span>
                        );
                      })}
                    </td>
                    <td>
                      {odata.data[0] !== undefined &&
                        `${i18n.PREDICTED_VALUE}${odata.data[0].name}`}
                    </td>
                  </tr>
                  {data[0] &&
                    data[0].value.map((v, index) => {
                      return (
                        <tr key={index}>
                          <td>{idata.time[index] || ''}</td>
                          <td>
                            {data.map((a, i) => {
                              return (
                                <span
                                  key={i}
                                  style={{ width: `calc(100%/${data.length})` }}
                                >
                                  {typeof a.value[index] === 'number'
                                    ? Math.round(a.value[index] * 100) / 100
                                    : typeof a.value[index] === 'object'
                                      ? a.value[index].value
                                      : a.value[index]}
                                </span>
                              );
                            })}
                          </td>
                          <td>
                            {odata.data[0] !== undefined &&
                              odata.data[0].value[index].toFixed(2)}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              )}
            </table>
          </div>
        </div>
      </div>
    );
  }
  _getDefaultSelectKey(key, data) {
    let defaultSelectedKey = '';
    if (key === '') {
      defaultSelectedKey = (data[0] && data[0].name) || '';
    } else {
      defaultSelectedKey = key;
    }
    return defaultSelectedKey;
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
  /** 根据数据获取下拉项 */
  _getDropdownOption(res) {
    let dropdownOpt = [];
    res.forEach((item, index) => {
      dropdownOpt.push({
        key: item.name,
        text: item.name
      });
    });
    return dropdownOpt;
  }

  /** 获取基准值及绘制关系图表 */
  _selectChange(dropOption, res, moduleOutputData) {
    let dependenVariables = [];
    let independenVariables = [];
    res.data.forEach((item, index) => {
      if (dropOption.key === item.name) {
        dependenVariables.push(item.name);
      } else {
        independenVariables.push(item.name);
      }
    });
    this._onChange(
      ['options'],
      this.props.data.options.options
        .set('independenVariables', independenVariables)
        .set('dependenVariables', dependenVariables)
    );
    this.setState({
      defaultSelectedKey: dependenVariables[0]
    });
    this._getOption(dropOption, [res], moduleOutputData);
  }
  _getOption(dropOption, res, moduleOutputData) {
    const { i18n } = this.props;
    res = res.find(v => v.dataType == dataTypes['DS_HIS_OUTPUT']) || {
      data: { time: [], data: [] }
    };
    res = res.data || { time: [], data: [] };
    /** 以基准值建立关系数据 */
    let series = [],
      dataName = [];
    res.data.forEach((item, index) => {
      series[index] = {
        areaStyle: { normal: {} },
        name: item.name,
        type: 'line',
        data: item.value,
        animationEasing: 'cubicOut'
      };
      dataName[index] = {
        name: item.name,
        icon: 'roundRect',
        textStyle: {
          color: '#555'
        }
      };
    });
    moduleOutputData = moduleOutputData.find(
      v => v.dataType == dataTypes['ANLS_SVM_OUTPUT']
    ) || { data: { time: [], data: [], model: '', evaluation: {} } };
    if (moduleOutputData !== undefined && moduleOutputData.data) {
      moduleOutputData.data.data.forEach((item, index) => {
        series[series.length] = {
          areaStyle: { normal: {} },
          name: `${i18n.PREDICTED_VALUE}__${item.name}`,
          type: 'line',
          data: item.value
        };
        dataName[dataName.length] = {
          name: `${i18n.PREDICTED_VALUE}__${item.name}`,
          icon: 'roundRect',
          textStyle: {
            color: '#555'
          }
        };
      });
    }

    let option = {
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        itemWidth: 9,
        itemHeight: 8,
        left: 'center',
        top: '20',
        data: dataName
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: res.time,
          axisLabel: {
            formatter: function(value, index) {
              return moment.default(value).format('MM-DD HH:ss');
            }
          },
          axisTick: {
            show: false
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          axisTick: {
            show: false
          }
        }
      ],
      series: series
    };
    return option;
  }
}

SVMPanel.propTypes = {};

export default SVMPanel;
