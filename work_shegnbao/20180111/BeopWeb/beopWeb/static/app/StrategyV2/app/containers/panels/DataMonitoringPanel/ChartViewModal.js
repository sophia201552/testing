/**
 * 图表模态框
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'office-ui-fabric-react/lib/Modal';
import ReactEcharts from 'echarts-for-react';
import moment from 'moment';
import { Dropdown } from 'office-ui-fabric-react/lib/Dropdown';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import CustomSpinner from '../../../components/CustomSpinner/CustomSpinner.js';
import { ApiFetch } from '../../../service/api.js';

import s from './ChartViewModal.css';
// ids: [] 点名
// isOpen: ture|false 打开模态框
// onCancel: () => {} 关闭模态框
const css = (className1, className2 = '') => {
  return className1
    .split(' ')
    .map(v => s[v])
    .concat(className2.split(' '))
    .join(' ')
    .trim();
};
class CustomInput extends React.Component {
  render() {
    let { wrapClass } = this.props;
    return (
      <div
        className={css('CustomInput' + (wrapClass ? ' ' + wrapClass : ''))}
        onClick={this.props.onClick}
      >
        {this.props.value}
      </div>
    );
  }
}

CustomInput.propTypes = {
  onClick: PropTypes.func,
  value: PropTypes.string
};


class ChartViewModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      // 周期类型默认选项
      selectedKey: 'latelyOption',
      // 固定周期默认选项
      fixedSelectedKey: 'm1',
      // 最近周期默认选项
      latelySelectKey: 'h1',
      // 历史数据
      historyData: [],
      startTime: moment()
        .subtract(1, 'h')
        .toDate(),
      endTime: moment().toDate(),
      timeFormat: 'm1',
      // 图表初始化
      option: this._renderEchart(),
      spinner: false
    };
    this.fixedOption = [
      { key: 'm1', text: props.i18n.ONE_MINUTE },
      { key: 'm5', text: props.i18n.FIVE_MINUTES },
      { key: 'h1', text: props.i18n.ONE_HOUR },
      { key: 'd1', text: props.i18n.ONE_DAY },
      { key: 'M1', text: props.i18n.ONE_MONTH }
    ];
    this.latelyOption = [
      { key: 'h1', text: props.i18n.THE_PAST_1_HOURS },
      { key: 'h24', text: props.i18n.THE_PAST_24_HOURS },
      { key: 'd7', text: props.i18n.THE_PAST_24_HOURS },
      { key: 'd30', text: props.i18n.THE_PAST_30_DAYS },
      { key: 'd90', text: props.i18n.THE_PAST_90_DAYS }
    ];
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.isOpen) {
      this._searchHistryData(nextProps);
    }
  }
  render() {
    const {
      selectedKey,
      latelySelectKey,
      fixedSelectedKey,
      startTime,
      endTime,
      option,
      spinner
    } = this.state;
    const { ids = [], i18n } = this.props;
    return (
      <Modal
        isOpen={this.props.isOpen}
        onDismiss={this.props.onCancel}
        containerClassName={s['chartViewModal']}
      >
        <div className={s['modal-header']}>
          <span>HistoryData Chart View </span>
          <div className={s['iconWrap']} onClick={this.props.onCancel}>
            <i className="ms-Icon ms-Icon--Cancel" aria-hidden="true" />
          </div>
        </div>
        <div className={s['modal-body']}>
          <div className={s['timeFormatWrap']}>
            <div className={s['dropDownWrap']}>
              <Dropdown
                className={s['Dropdown']}
                placeHolder="Select an Option"
                onChanged={dropOpt => {
                  this._selectChange(dropOpt, 'Dropdown');
                }}
                defaultSelectedKey={selectedKey}
                options={[
                  { key: 'latelyOption', text: i18n.RECENT_CYCLE },
                  { key: 'fixedOption', text: i18n.FIXED_CYCLE }
                ]}
              />
            </div>
            <div
              className={
                s[
                  selectedKey === 'fixedOption'
                    ? 'fixedDropDown'
                    : 'latelyDropDown'
                ]
              }
            >
              <Dropdown
                className={s['Dropdown']}
                onChanged={dropOpt => {
                  this._selectChangeOpt(
                    dropOpt,
                    selectedKey === 'fixedOption'
                      ? 'fixedOption'
                      : 'latelyOption'
                  );
                }}
                defaultSelectedKey={
                  selectedKey === 'fixedOption'
                    ? fixedSelectedKey
                    : latelySelectKey
                }
                options={
                  selectedKey === 'fixedOption' ? this.fixedOption : this.latelyOption
                }
              />
            </div>
            {selectedKey === 'fixedOption' && (
              <div className={s['timePickerWrap']}>
                <DatePicker
                  customInput={<CustomInput />}
                  selected={moment(startTime)}
                  onChange={date => this._onSelectDate(date, 'startTime')}
                  showTimeSelect={true}
                  timeFormat="HH:mm"
                  timeIntervals={5}
                  dateFormat="YYYY-MM-DD HH:mm:ss"
                />
                <div className={s['toTime']}>
                  <span>to</span>
                </div>
                <DatePicker
                  customInput={<CustomInput />}
                  selected={moment(endTime)}
                  onChange={date => this._onSelectDate(date, 'endTime')}
                  showTimeSelect={true}
                  timeFormat="HH:mm"
                  timeIntervals={5}
                  dateFormat="YYYY-MM-DD HH:mm:ss"
                />
              </div>
            )}
            <div
              className={s['searchBtn']}
              onClick={this._searchHistryData.bind(this)}
            >
              <span>{i18n.SEARCH}</span>
            </div>
          </div>
          <div>
            <div className={s['pointNameList']}>
              <ul>
                <li className={s['item']}>
                  <span>{i18n.POINT_NAME}</span>
                  <div
                    className={s['iconWrap']}
                    onClick={() => {
                      this.props.onDelete([]);
                    }}
                    title={i18n.DELETE_CURRENT_POINT}
                  >
                     
                    <i className="ms-Icon ms-Icon--Delete" aria-hidden="true" />
                    <span>{i18n.CLEAR}</span>
                  </div>
                </li>
                {ids.map((value, i) => {
                  return (
                    <li className={s['item']} key={i} title={value}>
                      <span>{value}</span>
                      <div
                        className={s['iconWrap']}
                        onClick={() => {
                          this.props.onDelete(ids.filter(v => value !== v));
                        }}
                        title={i18n.CLEAR_ALL_POINT}
                      >
                        <i
                          className="ms-Icon ms-Icon--Cancel"
                          aria-hidden="true"
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className={s['chartViewWrap']}>
              <ReactEcharts
                option={this._getOption() || option}
                style={{ height: '100%', width: '100%' }}
                className="react_for_echarts"
                notMerge={true}
              />
            </div>
          </div>
        </div>
        <CustomSpinner visible={spinner} />
      </Modal>
    );
  }

  /* 切换查询数据的方式 */

  _selectChange(dropOpt) {
    if (dropOpt.key === 'latelyOption') {
      this.setState({
        selectedKey: 'latelyOption',
        latelySelectKey: 'h1',
        startTime: moment()
          .subtract(1, 'h')
          .toDate(),
        endTime: moment().toDate(),
        timeFormat: 'm1'
      });
    } else {
      this.setState({
        selectedKey: 'fixedOption',
        fixedSelectedKey: 'm1',
        startTime: moment()
          .subtract(1, 'm')
          .toDate(),
        endTime: moment().toDate(),
        timeFormat: 'm1'
      });
    }
  }
  /* 切换timeFormat */

  _selectChangeOpt(dropOpt, args) {
    if (args === 'latelyOption') {
      switch (dropOpt.key) {
        case 'h1':
          this.setState({
            startTime: moment()
              .subtract(1, 'h')
              .toDate(),
            endTime: moment().toDate(),
            timeFormat: 'm1'
          });
          break;
        case 'h24':
          this.setState({
            startTime: moment()
              .subtract(1, 'd')
              .toDate(),
            endTime: moment().toDate(),
            timeFormat: 'h1'
          });
          break;
        case 'd7':
          this.setState({
            startTime: moment()
              .subtract(7, 'd')
              .toDate(),
            endTime: moment().toDate(),
            timeFormat: 'd1'
          });
          break;
        case 'd30':
          this.setState({
            startTime: moment()
              .subtract(30, 'd')
              .toDate(),
            endTime: moment().toDate(),
            timeFormat: 'd1'
          });
          break;
        case 'd90':
          this.setState({
            startTime: moment()
              .subtract(90, 'd')
              .toDate(),
            endTime: moment().toDate(),
            timeFormat: '1M'
          });
          break;
      }
      this.setState({
        latelySelectKey: dropOpt.key
      });
    } else {
      switch (dropOpt.key) {
        case 'm1':
          this.setState({
            startTime: moment()
              .subtract(1, 'm')
              .toDate(),
            endTime: moment().toDate(),
            timeFormat: 'm1'
          });
          break;
        case 'm5':
          this.setState({
            startTime: moment()
              .subtract(5, 'm')
              .toDate(),
            endTime: moment().toDate(),
            timeFormat: 'm5'
          });
          break;
        case 'h1':
          this.setState({
            startTime: moment()
              .subtract(1, 'h')
              .toDate(),
            endTime: moment().toDate(),
            timeFormat: 'h1'
          });
          break;
        case 'd1':
          this.setState({
            startTime: moment()
              .subtract(1, 'd')
              .toDate(),
            endTime: moment().toDate(),
            timeFormat: 'd1'
          });
          break;
        case 'M1':
          this.setState({
            startTime: moment()
              .subtract(30, 'd')
              .toDate(),
            endTime: moment().toDate(),
            timeFormat: 'M1'
          });
          break;
      }
      this.setState({
        fixedSelectedKey: dropOpt.key
      });
    }
  }
  /* 时间改变*/

  _onSelectDate(date, timeType) {
    if (timeType == 'startTime') {
      this.setState({
        startTime: date
      });
    } else {
      this.setState({
        endTime: date
      });
    }
  }
  // 获取历史数据
  _getHistryData(ids, timeStart, timeEnd, timeFormat) {
    if (this.getDsHistoryAsync) {
      return;
    }
    this.getDsHistoryAsync = apiFetch
      .getHistoryData(ids.filter(v => v != ''), timeStart, timeEnd, timeFormat)
      .subscribe({
        fail: rs => {
          console.log(rs);
        },
        next: rs => {
          if (rs.error || !rs.list) {
            rs = {
              list: [],
              timeShaft: []
            };
          }
          this.getDsHistoryAsync = undefined;
          this.setState({
            historyData: rs,
            spinner: false
          });
        }
      });
  }
  // 查询历史
  _searchHistryData(props) {
    let { startTime, endTime, timeFormat } = this.state;
    const { ids = [] } = props.target ? this.props : props || this.props;
    startTime = moment(startTime).format('YYYY-MM-DD HH:mm:ss');
    endTime = moment(endTime).format('YYYY-MM-DD HH:mm:ss');
    this.setState({
      spinner: true
    });
    this._getHistryData(
      ids,
      startTime,
      endTime,
      timeFormat
    );
  }
  /*根据历史渲染图表*/
  _getOption() {
    const { historyData } = this.state;
    if (historyData.list === undefined || historyData.list.length === 0) {
      return;
    }
    let series = [],
      dataName = [];
    historyData.list.forEach((item, index) => {
      series[index] = {
        areaStyle: { normal: {} },
        name: item.dsItemId,
        type: 'line',
        data: item.data,
      };
      dataName[index] = {
        name: item.dsItemId,
        icon: 'roundRect',
        textStyle: {
          color: '#555'
        }
      };
    });
    let option = this._renderEchart(dataName, historyData.timeShaft, series);
    return option;
  }
  // 初始化图表
  _renderEchart(dataName, timeShaft, series) {
    dataName = dataName || [];
    timeShaft = timeShaft || [];
    series = series || [];
    let option = {
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        show: false,
        itemWidth: 9,
        itemHeight: 8,
        left: 'center',
        top: '20',
        data: dataName
      },
      grid: {
        left: 60,
        right: 12,
        bottom: 50,
        top: 20,
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
      axisLabel: {
        color: '#626262',
        formatter: (value, index) => {
          if (value > 1000 /*&& value < 1000000*/) {
            value = value / 1000 + 'k';
          }
          return value;
        }
      },
      series: series
    };
    return option;
  }
}

ChartViewModal.propTypes = {};

export default ChartViewModal;
