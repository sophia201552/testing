/**
 * 预测模块
 */
import React from 'react';
import PropTypes from 'prop-types';
import {
  DatePicker,
  DayOfWeek,
  IDatePickerStrings
} from 'office-ui-fabric-react/lib/DatePicker';
import moment from 'moment';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import ReactEcharts from 'echarts-for-react';
import { Dropdown } from 'office-ui-fabric-react/lib/Dropdown';
import { debug } from 'util';

import { dataTypes } from '@beopcloud/StrategyV2-Engine/src/enum';

import s from './ForecastPanel.css';

class ForecastPanel extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isDisabled: false,
      startTime: moment()
        .subtract(30, 'd')
        .toDate(),
      endTime: moment().toDate(),
      historyData: [],
      chartOptions: this._renderEchart(),
      defaultSelectedKey: 'd1'
    };
    this.changeMode = this.changeMode.bind(this);
    this.changeMethod = this.changeMethod.bind(this);
    this._selectChange = this._selectChange.bind(this);
  }
  componentWillMount() {
    const { dataset } = this.props.data.options;
    const mode = dataset.mode;
    if (mode === 'datasource') {
      this.setState({
        isDisabled: false
      });
    }
  }
  componentDidMount() {
    let { startTime, endTime, defaultSelectedKey } = this.state;
    let options = this.props.data.options.dataset.options;
    startTime = moment(startTime).format('YYYY-MM-DD HH:mm:ss');
    endTime = moment(endTime).format('YYYY-MM-DD HH:mm:ss');
    if (options.startTime === '' || options.endTime == '') {
      this._onChange(
        ['dataset', 'options'],
        this.props.data.options.dataset.options
          .set('startTime', startTime)
          .set('endTime', endTime)
          .set('timeFormat', defaultSelectedKey)
      );
    }
  }
  render() {
    let { moduleInputData, moduleOutputData, i18n } = this.props;
    const { dataset, methods } = this.props.data.options;
    let {
      startTime,
      endTime,
      isDisabled,
      historyData,
      chartOptions,
      defaultSelectedKey
    } = this.state;
    let svmOutputData = moduleOutputData.find(
      v => v.dataType == dataTypes['ANLS_PREDICT_OUTPUT']
    );
    startTime =
      dataset.options.startTime === ''
        ? startTime
        : moment(dataset.options.startTime).toDate();
    endTime =
      dataset.options.endTime === ''
        ? endTime
        : moment(dataset.options.endTime).toDate();
    defaultSelectedKey =
      dataset.options.timeFormat == ''
        ? defaultSelectedKey
        : dataset.options.timeFormat;
    svmOutputData = (svmOutputData && svmOutputData.data) || { data: [] };
    return (
      <div className={s['forecastPanel']}>
        <div className={s['leftCtn']}>
          <div className={s['panelTitle']}>
            <span>{i18n.MODULE_NAME}</span>
          </div>
          <div className={s['topCtn']}>
            <h3>{i18n.DATA_RANGE}</h3>
            <div className={s['checkBoxCtn']}>
              <div className={s['check_tick_ctn']}>
                <div>
                  <input
                    className={s['check_tick']}
                    type="radio"
                    id="time"
                    name="dataRange"
                    checked={true}
                    onChange={(e, checked) =>
                      methods.indexOf('SVM') !== -1 ? true : false
                    }
                  />
                  <label htmlFor="time" />
                </div>
                <label htmlFor="time" className={s['labelName']}>
                  {i18n.DATA}
                </label>
              </div>
            </div>
            <div className={s['slider-time-picker']}>
              <DatePicker
                highlightCurrentMonth={true}
                isMonthPickerVisible={false}
                allowTextInput={true}
                value={startTime}
                formatDate={value => {
                  return moment(value).format('YYYY-MM-DD');
                }}
                showGoToToday={false}
                disableAutoFocus={true}
                onSelectDate={this.updateStartTime.bind(this)}
              />
              <DatePicker
                highlightCurrentMonth={true}
                isMonthPickerVisible={false}
                allowTextInput={true}
                value={endTime}
                disabled={false}
                formatDate={value => {
                  return moment(value).format('YYYY-MM-DD');
                }}
                showGoToToday={false}
                disableAutoFocus={true}
                onSelectDate={this.updateEndTime.bind(this)}
              />
            </div>
            <Dropdown
              className={s['Dropdown']}
              placeHolder=""
              onChanged={dropOption => {
                this._selectChange(dropOption);
              }}
              options={[
                { key: 'm1', text: i18n.ONE_MINUTE },
                { key: 'm5', text: i18n.FIVE_MINUTES },
                { key: 'h1', text: i18n.ONE_HOUR },
                { key: 'd1', text: i18n.ONE_DAY },
                { key: '1M', text: i18n.ONE_MONTH },
                { key: '1y', text: i18n.ONE_YEAR }
              ]}
              selectedKey={defaultSelectedKey}
            />
          </div>
          <div className={s['middleCtn']} id="methodsCtn">
            <h3>{i18n.METHOD}</h3>
            <div className={s['checkBoxCtn']}>
              <div className={s['check_tick_ctn']}>
                <div>
                  <input
                    className={s['check_tick']}
                    type="checkBox"
                    id="linear"
                    checked={true}
                    onChange={(e, checked) =>
                      methods.indexOf('SVM') !== -1 ? true : false
                    }
                    value="SVM"
                  />
                  <label htmlFor="linear" />
                </div>
                <label htmlFor="linear" className={s['labelName']}>
                  SVM
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className={s['rightCtn']}>
          <div className={s['details-container']}>
            <div className={s['echartsCtn']}>
              <ReactEcharts
                option={this._getOptions(moduleOutputData) || chartOptions}
                style={{ height: '100%', width: '100%' }}
                className="react_for_echarts"
              />
            </div>
            <div className={s['footTable']}>
              <table className={s['operation']}>
                <thead className={s['operation-header']}>
                  <tr className={s['thead-row']}>
                    <td>{i18n.TIME}</td>
                    <td>{i18n.HISTORY_VALUE}</td>
                    <td>{i18n.PREDICTED_VALUE}</td>
                  </tr>
                </thead>
                {svmOutputData.data.length !== 0 && (
                  <tbody>
                    <tr>
                      <td />
                      <td>
                        {svmOutputData.data.map((a, i) => {
                          return (
                            a.dsId !== undefined && (
                              <span
                                key={i}
                                style={{
                                  width: `calc(100%/${svmOutputData.data
                                    .length - 1})`
                                }}
                              >
                                {a.name}
                              </span>
                            )
                          );
                        })}
                      </td>
                      <td>
                        {' '}
                        {svmOutputData.data.map((a, i) => {
                          return (
                            a.dsId === undefined && (
                              <span
                                key={i}
                                style={{
                                  width: `calc(100%/${svmOutputData.data
                                    .length - 1})`
                                }}
                              >
                                {a.name}
                              </span>
                            )
                          );
                        })}
                      </td>
                    </tr>
                    {svmOutputData.data[0].value.map((v, index) => {
                      return (
                        <tr key={index}>
                          <td>{svmOutputData.time[index]}</td>
                          <td>
                            {svmOutputData.data.map((a, i) => {
                              return (
                                a.dsId !== undefined && (
                                  <span
                                    key={i}
                                    style={{
                                      width: `calc(100%/${svmOutputData.data
                                        .length - 1})`
                                    }}
                                  >
                                    {typeof a.value[index] === 'number'
                                      ? Math.round(a.value[index] * 100) / 100
                                      : a.value[index].toString()}
                                  </span>
                                )
                              );
                            })}
                          </td>
                          <td>
                            {svmOutputData.data.map((a, i) => {
                              return (
                                a.dsId === undefined && (
                                  <span
                                    key={i}
                                    style={{
                                      width: `calc(100%/${svmOutputData.data
                                        .length - 1})`
                                    }}
                                  >
                                    {a.value[index].toFixed(2)}
                                  </span>
                                )
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
  _selectChange(timeFormat) {
    this._onChange(
      ['dataset', 'options'],
      this.props.data.options.dataset.options.set('timeFormat', timeFormat.key)
    );
    this.setState({
      defaultSelectedKey: timeFormat.key
    });
  }
  /** 获取 ehcarts 图表配置*/
  _getOptions(moduleOutputData) {
    let series = [],
      dataName = [];
    let svmOutputData = moduleOutputData.find(
      v => v.dataType == 'ANLS_PREDICT_OUTPUT'
    ).data || { data: [] };
    svmOutputData.data.forEach((item, i) => {
      series[i] = {
        areaStyle: { normal: {} },
        name: item.name,
        type: 'line',
        data: item.value
      };
      dataName[i] = {
        name: item.name,
        icon: 'roundRect',
        textStyle: {
          color: '#555'
        }
      };
    });
    let option = this._renderEchart(dataName, svmOutputData.time || [], series);
    return option;
  }
  _renderEchart(dataName, timeShaft, series) {
    dataName = dataName || [];
    timeShaft = timeShaft || [];
    series = series || [];
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
          data: timeShaft,
          axisLabel: {
            formatter: function(value, index) {
              return moment(value).format('MM-DD HH:ss');
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
  updateStartTime(date) {
    this.setState({
      startTime: date
    });
    date = moment(date).format('YYYY-MM-DD HH:mm:ss');
    let mode = this.props.data.options.dataset.mode;
    if (mode === 'datasource') {
      this._onChange(
        ['dataset', 'options'],
        this.props.data.options.dataset.options.set('startTime', date)
      );
    }
  }
  updateEndTime(date) {
    this.setState({
      endTime: date
    });
    date = moment(date).format('YYYY-MM-DD HH:mm:ss');
    let mode = this.props.data.options.dataset.mode;
    if (mode === 'datasource') {
      this._onChange(
        ['dataset', 'options'],
        this.props.data.options.dataset.options.set('endTime', date)
      );
    }
  }
  updateModule(url, value) {
    let data = this.props.data;
    data = data.setIn(url, value);
    this.props.updateModule(data);
  }
  changeMode(e) {
    this.updateModule(['options', 'dataset', 'mode'], e.target.value);
    if (e.target.value === 'datasource') {
      this.setState({
        isDisabled: false
      });
    } else {
      this.setState({
        isDisabled: true
      });
    }
  }
  changeMethod(e) {
    let ctn = document.getElementById('methodsCtn');
    let inputArr = ctn.getElementsByTagName('input');
    let methodArr = [];
    for (let i = 0; i < inputArr.length; i++) {
      if (inputArr[i].checked) {
        methodArr.push(inputArr[i].value);
      }
    }
    this.updateModule(['options', 'methods'], methodArr);
  }
}

ForecastPanel.propTypes = {};

export default ForecastPanel;
