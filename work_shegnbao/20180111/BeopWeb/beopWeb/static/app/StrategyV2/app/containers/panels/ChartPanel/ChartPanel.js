/**
 * 图表
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { debug, isArray } from 'util';
import ReactEcharts from 'echarts-for-react';
import * as moment from 'moment';
import { Dropdown } from 'office-ui-fabric-react/lib/Dropdown';

import DataSetComponent from '../DataSetComponent';
import ShowDataResult from '../../../components/ShowDataResult';
import UnknownTooltip from '../../../components/UnknownTooltip';

import { dataTypes } from '@beopcloud/StrategyV2-Engine/src/enum';

import s from './ChartPanel.css';
const css = (className1, className2 = '') => {
  return className1
    .split(' ')
    .map(v => s[v])
    .concat(className2.split(' '))
    .join(' ')
    .trim();
};

class ChartView extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this._getOption(props);
    this._getOption = this._getOption.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    const { data = { data: [], time: [] } } = nextProps;
    if (data.data) {
      this._getOption(nextProps);
    }
  }
  render() {
    return (
      <div style={{ height: '100%', width: '100%' }}>
        <ReactEcharts
          option={this.option}
          style={{ height: '100%', width: '100%' }}
          notMerge={true}
        />
      </div>
    );
  }

  _getOption(props) {
    const { data, type = 'line', chartConfig = {} } = props;
    const color = [
      ['#aaaaff1a', '#66ccff', '#aaaaff'],
      ['#69bd761a', '#edff9b', '#69bd76'],
      ['#f4c0651a', '#ff6666', '#f4c065'],
      ['#3366ff1a', '#5da9ff', '#3366ff'],
      ['#4d8ad01a', '#75b4fd', '#4d8ad0'],
      ['#d581fc1a', '#fc84d3', '#d581fc'],
      ['#75b4fd1a', '#65f2fb', '#75b4fd'],
      ['#f4ff5d1a', '#f3df5e', '#f4ff5d'],
      ['#9935cc1a', '#66ccff', '#9935cc']
    ];
    let series = [],
      cColor = [],
      dataName = [];
    if (type !== 'scatter') {
      data.data.forEach((item, index) => {
        switch (type) {
          case 'line':
            series[index] = {
              areaStyle: {
                normal: {
                  color: color[index % 9][0]
                }
              },
              name: item.name,
              type: type,
              data: item.value,
              animationEasing: 'cubicOut'
            };
            break;
          case 'bar':
            series[index] = {
              itemStyle: {
                normal: {},
                emphasis: {
                  barBorderWidth: 1,
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowOffsetY: 0,
                  shadowColor: 'rgba(0,0,0,0.5)'
                }
              },
              name: item.name,
              type: type,
              strack: item.name,
              data: item.value
            };
        }

        dataName[index] = {
          name: item.name,
          icon: 'roundRect',
          textStyle: {
            color: '#555'
          }
        };
        cColor[index] = color[index % 9][2];
      });
      this.option = {
        tooltip: {
          trigger: 'axis',
          axisPointer:
            type == 'bar'
              ? {
                  type: 'shadow'
                }
              : {}
        },
        color: cColor,
        legend: {
          icon: 'rect',
          textStyle: {
            color: '#1d1d1d',
            fontSize: '14px'
          },
          data: dataName
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: type == 'line' ? false : true,
            data: data.time,
            axisLabel: {
              formatter: function(value, index) {
                return moment.default(value).format('MM-DD HH:ss');
              }
            },
            axisTick: {}
          }
        ],
        dataZoom: [
          {
            start: 0,
            end: type == 'bar' ? 5 : 100
          },
          {
            type: 'inside'
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: series
      };
    } else {
      let baseIndex = data.data.findIndex(
        v => v.name == chartConfig.selectedkey
      );
      if (baseIndex !== -1) {
        let count = 0;
        data.data.forEach((item, index) => {
          if (item.name !== chartConfig.selectedkey) {
            let temp = [];
            item.value.forEach((row, inx) => {
              temp.push([data.data[baseIndex]['value'][inx], row]);
            });
            series[count] = {
              name: index,
              type: 'scatter',
              data: temp
            };
            cColor[count] = color[count % 9][2];
            count++;
          }
        });
      }
      this.option = {
        tooltip: {
          formatter: function(v) {
            let dataIndex = v.dataIndex;
            return data.data
              .map(row => `${row.name}: ${row.value[dataIndex]}`)
              .join('<br />');
          }
        },
        color: cColor,
        xAxis: {
          splitLine: {
            lineStyle: {
              type: 'dashed'
            }
          }
        },
        yAxis: {
          splitLine: {
            lineStyle: {
              type: 'dashed'
            }
          },
          scale: true
        },
        dataZoom: [
          {
            start: 0,
            end: 100
          },
          {
            type: 'inside'
          }
        ],
        series: series,
        symbolSize: 20
      };
    }
  }
}

class ChartPanel extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      method: undefined,
      dataSet: [],
      selectedkey: undefined
    };
    this._items = [];
    this.changeMethod = this.changeMethod.bind(this);
    this._getDefault = this._getDefault.bind(this);
    this._onChange = this._onChange.bind(this);
    this._getDropdownOption = this._getDropdownOption.bind(this);
    this.idata = { data: [], time: [] };
  }
  componentWillReceiveProps(nextProps) {
    this._items = this._getItems(nextProps);
    this.setState({
      dataSet: this._items.map(v => v.key)
    });
  }
  componentWillUpdate(nextProps, nextState) {
    let { dataSet } = nextState;
    const { moduleInputData } = nextProps;
    let idata = (moduleInputData &&
      moduleInputData.find(v => v.dataType === dataTypes['DS_HIS_OUTPUT'])) || {
      data: false
    };
    idata = (idata && idata.data) || { data: [], time: [] };
    let tmp = [];
    dataSet = dataSet.length == 0 ? this._items : dataSet;
    dataSet.forEach((value, i) => {
      if (value !== 'ALL') {
        tmp.push(idata.data.filter(v => v.name.indexOf(value) !== -1)[0]);
      }
    });
    this.idata = (tmp.length !== 0 && {
      data: tmp[0] !== undefined ? tmp : [],
      time: idata.time
    }) || { data: [], time: [] };
  }
  render() {
    const { i18n, data } = this.props;
    const { dataSet, method, selectedkey } = this.state;
    return (
      <div className={css('dataComplementWrap clear')}>
        <div className={css('left')}>
          <div className={css('title')}>{i18n.MODULE_NAME}</div>
          <div className={css('mWrap')}>
            <div className={css('api')}>
              <DataSetComponent
                title={i18n.STYLE}
                items={[
                  { key: i18n.LINE, text: i18n.LINE },
                  { key: i18n.BAR, text: i18n.BAR },
                  { key: i18n.SCATTER, text: i18n.SCATTER }
                ]}
                isRadio={true}
                selectedKeys={this._getDefault(data.options.methods.type)}
                onSelect={this.changeMethod}
              />
            </div>
            <div className={css('api2')}>
              <label>{i18n.CONFIGURATION}</label>
              {data.options.methods.type == 'scatter' && (
                <Dropdown
                  label="Base Param"
                  className={s['Dropdown']}
                  placeHolder="Select an Option"
                  onChanged={dropOption => {
                    this.setState({
                      selectedkey: dropOption.key
                    });
                  }}
                  options={this._getDropdownOption(this.idata.data || [])}
                />
              )}
            </div>
          </div>
          <div className={css('bWrap')}>
            <DataSetComponent
              title={i18n.DATA_SET}
              items={this._items}
              isRadio={false}
              onSelect={this.changeDataSet.bind(this)}
              selectedKeys={dataSet}
            />
          </div>
        </div>
        <div className={s['showDataCtn']}>
          <div>
            <ChartView
              type={data.options.methods.type}
              data={this.idata}
              chartConfig={{ selectedkey }}
            />
          </div>
          <div className={s['tableWrap']}>
            <table>
              <thead>
                <tr>
                  <td>{i18n.TIME}</td>
                  <td>{i18n.DATA}</td>
                </tr>
              </thead>
              {this.idata.data.length !== 0 && (
                <tbody>
                  <tr>
                    <td />
                    <td>
                      {this.idata.data.map((a, i) => {
                        return (
                          <span
                            key={i}
                            style={{
                              width: `calc(100%/${this.idata.data.length})`
                            }}
                          >
                            {a.name}
                          </span>
                        );
                      })}
                    </td>
                  </tr>
                  {this.idata.time &&
                    this.idata.time.map((v, index) => {
                      return (
                        <tr key={index}>
                          <td>{v || ''}</td>
                          <td>
                            {this.idata.data.map((a, i) => {
                              return (
                                <span
                                  key={i}
                                  style={{
                                    width: `calc(100%/${
                                      this.idata.data.length
                                    })`
                                  }}
                                >
                                  {typeof a.value[index] === 'number'
                                    ? Math.round(a.value[index] * 100) / 100
                                    : a.value[index]}
                                </span>
                              );
                            })}
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
  /** 改变配置项 */
  _onChange(field, value) {
    if (typeof field === 'string') {
      field = [field];
    }
    this.props.updateModule(
      this.props.data.setIn(['options', ...field], value)
    );
  }
  /* 获取默认选中图表展示方式 */
  _getDefault(type) {
    const { i18n } = this.props;
    let value = '';
    switch (type) {
      case 'line':
        value = i18n.LINE;
        break;
      case 'bar':
        value = i18n.BAR;
        break;
      case 'scatter':
        value = i18n.SCATTER;
        break;
    }
    return [value];
  }
  /* 切图表展示方式 */
  changeMethod(data) {
    const { i18n } = this.props;
    const type = data[0];
    let value = '';
    switch (type) {
      case i18n.LINE:
        value = 'line';
        break;
      case i18n.BAR:
        value = 'bar';
        break;
      case i18n.SCATTER:
        value = 'scatter';
        break;
    }
    this._onChange(
      'methods',
      this.props.data.options.methods.set('type', value)
    );
    this.setState({
      method: value,
      dataTypes: this._items
    });
  }
  /* 切换数据集展示 */
  changeDataSet(data) {
    this.setState({
      dataSet: data
    });
  }
  /* 获取数据集名称*/
  _getItems(props) {
    const { moduleInputData } = props || this.props;
    let ds_opt = moduleInputData.find(
        v => v.dataType == dataTypes.DS_HIS_OUTPUT
      ) || {
        data: false
      },
      dsData = (ds_opt.data && ds_opt.data.data) || [];
    let items = [];
    dsData.forEach(v => {
      items.push({
        key: v.name,
        text: v.name
      });
    });
    return items;
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
}
export default ChartPanel;
