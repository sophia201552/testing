/**
 * 相关性分析
 */
import React from 'react';
import PropTypes from 'prop-types';

import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import * as moment from 'moment';
import {
  DatePicker,
  DayOfWeek,
  IDatePickerStrings
} from 'office-ui-fabric-react/lib/DatePicker';

import ReactEcharts from 'echarts-for-react';

import s from './AnalysisCorrelationPanel.css';
// props
// timeStart
// endTime
// timeFormat
//historyData
class RenderLineEcharts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      options: undefined
    };
  }
  render() {
    const {} = this.props;
    if (!this.state.options) {
      return null;
    }
    return (
      <ReactEcharts
        option={this.state.options}
        style={{ height: '100%', width: '100%' }}
      />
    );
  }
  componentWillMount(nextProps) {
    if (
      nextProps &&
      JSON.stringify(this.props.dsItemInfo) ===
        JSON.stringify(nextProps.dsItemInfo)
    ) {
      return;
    }
    const { dsItemInfo, timeShaft } = nextProps ? nextProps : this.props;
    let seriesArr = [],
      legendArr = [];
    dsItemInfo.forEach(row => {
      seriesArr.push({
        name: row.dsName,
        data: row.historyData,
        type: 'line',
        showSymbol: false
      });
      legendArr.push(row.dsName);
    });
    this.getOptions(seriesArr, legendArr, timeShaft, false);
  }
  componentWillReceiveProps(nextProps) {
    this.componentWillMount(nextProps);
  }
  getOptions(seriesArr, legendArr, timeArr, isSHowLine) {
    let option = {
      color: ['#fbd245', '#71d268', '#49acf3', '#4f81eb'],
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: legendArr,
        top: 20
      },
      xAxis: {
        type: 'category',
        splitLine: { show: false },
        data: timeArr,
        boundaryGap: false,
        axisTick: {
          show: false
        },
        axisLine: {
          show: isSHowLine
        },
        axisLabel: {
          color: '#808fa3'
        }
      },
      grid: {
        left: '5%',
        right: '4%',
        bottom: '5%',
        containLabel: true
      },
      yAxis: {
        type: 'value',
        nam: 'y',
        splitLine: {
          show: true,
          lineStyle: {
            color: '#dfe2e5'
          }
        },
        axisTick: {
          show: false
        },
        axisLine: {
          show: isSHowLine
        },
        axisLabel: {
          color: '#808fa3',
          formatter: function(value) {
            if (value > 1000000) {
              return value / 1000000 + 'M';
            } else if (value > 1000) {
              return value / 1000 + 'K';
            } else {
              return value;
            }
          }
        }
      },
      series: seriesArr
    };
    this.setState({
      options: option
    });
  }
}
//props
//dsItemInfo
//关系图
class RendergGaphEcharts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      options: undefined
    };
  }
  componentWillMount(nextProps) {
    const { dsItemInfo } = nextProps ? nextProps : this.props;
    if (
      nextProps &&
      JSON.stringify(this.props.dsItemInfo) ===
        JSON.stringify(nextProps.dsItemInfo)
    ) {
      return;
    }
    let seriesArr = [],
      legendData = [];
    if (dsItemInfo.length === 0) {
      seriesArr = [
        {
          type: 'graph',
          layout: 'circular',
          animation: false,
          data: [
            { id: 0 },
            { id: 1 },
            { id: 2 },
            { id: 3 },
            { id: 4 },
            { id: 5 },
            { id: 6 },
            { id: 7 },
            { id: 8 },
            { id: 9 },
            { id: 10 }
          ],
          force: {
            repulsion: 60,
            edgeLength: 2
          },
          edges: [
            {
              source: 0,
              target: 1
            },
            {
              source: 1,
              target: 2
            },
            {
              source: 2,
              target: 3
            },
            {
              source: 3,
              target: 4
            },
            {
              source: 4,
              target: 5
            },
            {
              source: 5,
              target: 6
            },
            {
              source: 6,
              target: 7
            },
            {
              source: 7,
              target: 8
            },
            {
              source: 8,
              target: 9
            },
            {
              source: 9,
              target: 10
            },
            {
              source: 10,
              target: 0
            }
          ]
        }
      ];
    } else {
      let categories = dsItemInfo.map(row => {
        return { name: row.dsName };
      });
      legendData = categories.map(function(a) {
        return a.name;
      });
      let data = [],
        edges = [];
      let yIndex,
        edgesArr = [];
      dsItemInfo.forEach((row, index) => {
        data.push({
          id: index,
          name: row.dsName,
          symbolSize: row.weight * 16,
          label: { normal: { show: true } },
          category: index
        });
        if (row.name !== 'y') {
          edgesArr.push({
            index: index,
            width: row.weight * 8
          });
        } else {
          yIndex = index;
        }
      });
      edges = edgesArr.map(row => ({
        source: yIndex,
        target: row.index,
        lineStyle: {
          normal: {
            width: row.width
          }
        }
      }));
      seriesArr = [
        {
          name: '关系图',
          type: 'graph',
          layout: 'circular',
          width: '50%',
          left: '10%',
          right: '40%',
          circular: {
            rotateLabel: true
          },
          data: data,
          links: edges,
          categories: categories,
          roam: true,
          label: {
            normal: {
              position: 'right',
              formatter: '{b}'
            }
          },
          lineStyle: {
            normal: {
              color: 'source',
              curveness: 0.3
            }
          }
        }
      ];
    }

    let option = {
      color: ['#fcd341', '#73d366', '#48acf5', '#4e81ed'],
      legend: [
        {
          x: 'right',
          orient: 'vertical',
          itemWidth: 8,
          itemHeight: 8,
          left: '60%',
          top: 'middle',
          textStyle: {
            color: '#666666'
          },
          data: legendData
        }
      ],
      animationDurationUpdate: 1500,
      animationEasingUpdate: 'quinticInOut',
      series: seriesArr
    };
    this.setState({
      options: option
    });
  }
  componentWillUpdate(nextProps) {
    this.componentWillMount(nextProps);
  }
  render() {
    const { options } = this.state;
    if (!options) {
      return null;
    }
    return (
      <ReactEcharts
        option={options}
        style={{ height: '100%', width: '100%' }}
      />
    );
  }
}
//props
//dsItemInfo
// 右侧上半部分 相关性分析
class TopDataRender extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { dsItemInfo, mod, i18n } = this.props;
    const modName = [
      {
        name: i18n.DATA_SOURCE,
        str: 'org'
      },
      {
        name: i18n.FITTING_OBJECT,
        str: 'target'
      },
      {
        name: i18n.R,
        str: 'R'
      },
      {
        name: i18n.MODEL_DESCRIPTION,
        str: 'info'
      }
    ];
    return (
      <div className={s['details-echart']}>
        <div className={s['echart-content']}>
          <div className={s['content-left-table']}>
            <table className={s['operation']}>
              <thead className={s['operation-header']}>
                <tr className={s['thead-row']}>
                  <th>{i18n.SORT}</th>
                  <th>{i18n.RELEVANT_PARAMETER}</th>
                  <th>{i18n.WEIGHT}</th>
                </tr>
              </thead>
              <tbody className={s['operation-body']}>
                {dsItemInfo.length === 0 ? (
                  <tr className={s['operation-row']}>
                    <td>1</td>
                    <td>--</td>
                    <td>--</td>
                  </tr>
                ) : (
                  dsItemInfo.map((row, index) => (
                    <tr key={index} className={s['operation-row']}>
                      <td>{index + 1}</td>
                      <td>{row.dsName}</td>
                      <td
                        title={row.weight.toFixed(2)}
                        style={{
                          width: '35px',
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                          textOverflow: 'ellipsis',
                          display: 'block'
                        }}
                      >
                        {row.weight.toFixed(2)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className={s['content-center-miserables']}>
            <RendergGaphEcharts dsItemInfo={dsItemInfo} />
          </div>
          <div className={s['content-right-list']}>
            <ul>
              {mod
                ? Object.keys(mod).map((value, index) => (
                    <li key={index} className={s['list-rows']}>
                      <span className={s['key']}>
                        {
                          modName.find(v => {
                            return v.str === value;
                          }).name
                        }
                      </span>
                      <span className={s['value']}>
                        {value === 'target'
                          ? mod[value].name
                          : value === 'info'
                            ? mod['target'].ds
                            : value === 'R'
                              ? mod[value].toFixed(5)
                              : mod[value]}
                      </span>
                    </li>
                  ))
                : modName.map((row, index) => (
                    <li key={index} className={s['list-rows']}>
                      <span className={s['key']}>{row.name}</span>
                      <span className={s['value']}>--</span>
                    </li>
                  ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}
class AnalysisCorrelationPanel extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      startTime: moment.default().subtract(7, 'd')._d,
      endTime: moment.default()._d,
      selectedItems: [0, 1, 2, 3],
      isDisabled: false,
      items: [],
      mod: undefined,
      timeShaft: []
    };
    this.showModal = this.showModal.bind(this);
    this._closeModal = this._closeModal.bind(this);
    this.changeMode = this.changeMode.bind(this);
    this.changeModel = this.changeModel.bind(this);
  }
  componentWillMount(nextProps) {
    let props = nextProps ? nextProps : this.props;
    const { data, moduleInputData, moduleOutputData } = props;
    const { dataset } = data.options;
    const mode = dataset.mode;
    if (mode === 'datasource') {
      this.setState({
        isDisabled: false
      });
    }
    if (moduleOutputData && Object.keys(moduleOutputData).length !== 0) {
      this.setState({
        mod: moduleOutputData.res[0].data
      });
    }
    if (moduleInputData && moduleInputData[0] && moduleInputData[1]) {
      let prevProps = sessionStorage.getItem('prevProps');
      let cacheData = JSON.parse(sessionStorage.getItem('analysisPanelData'));
      if (prevProps && JSON.stringify(props) === prevProps) {
        this.setState({
          items: cacheData.items,
          timeShaft: cacheData.timeShaft
        });
      } else {
        let historyData = moduleInputData[0].res[0].data;
        let weightData = moduleInputData[1].res[0].data;
        let timeShaft = moduleInputData[0].res[0].timeShaft;
        let dsItemsIds = historyData.map(row => {
          return row.ds;
        });
        apiFetch.getDsItemsById(dsItemsIds).subscribe(resp => {
          let items = [];
          resp.forEach((v, index) => {
            if (v.value === historyData[index].ds.split('|')[1]) {
              items.push({
                name: historyData[index].name,
                dsName: v.alias,
                historyData: historyData[index].data
              });
            }
            if (v.alias === 'not found') {
              items.push({
                name: historyData[index].name,
                dsName: historyData[index].ds,
                historyData: historyData[index].data
              });
            }
          });
          items.forEach(row => {
            let singleWeight = weightData.find(w => {
              return w.name === row.name;
            });
            if (singleWeight) {
              row.weight = singleWeight.data;
            }
            if (row.name === 'y') {
              row.weight = 1;
            }
          });
          this.setState({
            items: items,
            timeShaft: timeShaft
          });
          sessionStorage.setItem('prevProps', JSON.stringify(this.props));
          sessionStorage.setItem(
            'analysisPanelData',
            JSON.stringify({ items: items, timeShaft: timeShaft })
          );
        });
      }
    }
  }
  componentWillReceiveProps(nextProps) {
    this.componentWillMount(nextProps);
  }
  render() {
    const { i18n, data } = this.props;
    const { dataset, model } = data.options;
    const {
      startTime,
      endTime,
      selectedItems,
      isDisabled,
      items,
      mod,
      historyData,
      timeShaft
    } = this.state;
    let mode = dataset.mode;
    let realStartTime, realEndTime;
    if (mode === 'datasource') {
      (realStartTime = dataset.options.startTime),
        (realEndTime = dataset.options.endTime);
      realStartTime = realStartTime !== '' ? realStartTime : startTime;
      realEndTime = realEndTime !== '' ? realEndTime : endTime;
    } else {
      (realStartTime = startTime), (realEndTime = endTime);
    }
    let dsItemInfo = [];
    if (items.length !== 0) {
      items.forEach((row, index) => {
        if (selectedItems.indexOf(index) !== -1) {
          dsItemInfo.push(row);
        }
      });
    }
    // if (dsItemInfo.length === 0) {
    //   return null;
    // }
    return (
      <div className={s['container']}>
        <div className={s['dependence-slider']}>
          <div className={s['panelTitle']}>
            <span>{i18n.MODULE_NAME}</span>
          </div>
          <div className={s['dependence-select-data']}>
            <h3>{i18n.DATA_RANGE}</h3>
            <div className={s['checkBoxCtn']}>
              <div className={s['check_tick_ctn']}>
                <div>
                  <input
                    className={s['check_tick']}
                    type="radio"
                    id="time"
                    name="dataRange"
                    onChange={this.changeMode}
                    defaultChecked={mode === 'datasource' ? true : false}
                    value="datasource"
                  />
                  <label htmlFor="time" />
                </div>
                <label htmlFor="time" className={s['labelName']}>
                  {i18n.TIME}
                </label>
              </div>
            </div>
            <div className={s['date-picker-start']}>
              <DatePicker
                highlightCurrentMonth={true}
                isMonthPickerVisible={false}
                allowTextInput={true}
                value={realStartTime}
                formatDate={value => {
                  return moment.default(value).format('YYYY-MM-DD');
                }}
                showGoToToday={false}
                onSelectDate={this.updateStartTime.bind(this)}
                disabled={isDisabled}
              />
            </div>
            <div className={s['date-picker-end']}>
              <DatePicker
                highlightCurrentMonth={true}
                isMonthPickerVisible={false}
                allowTextInput={true}
                value={realEndTime}
                formatDate={value => {
                  return moment.default(value).format('YYYY-MM-DD');
                }}
                showGoToToday={false}
                onSelectDate={this.updateEndTime.bind(this)}
                disabled={isDisabled}
              />
            </div>
            <div className={s['selected-data']}>
              <div className={s['checkBoxCtn']}>
                <div className={s['check_tick_ctn']}>
                  <div>
                    <input
                      className={s['check_tick']}
                      type="radio"
                      id="selectedData"
                      name="dataRange"
                      onChange={this.changeMode}
                      defaultChecked={
                        mode === 'selected dataset' ? true : false
                      }
                      value="selected dataset"
                    />
                    <label htmlFor="selectedData" />
                  </div>
                  <label htmlFor="selectedData" className={s['labelName']}>
                    {i18n.SELECTED_DATA}
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className={s['dependence-ways']}>
            <h3>{i18n.METHOD}</h3>
            <div className={s['checkBoxCtn']}>
              <div className={s['check_tick_ctn']}>
                <div>
                  <input
                    className={s['check_tick']}
                    type="checkBox"
                    id="svm"
                    onChange={this.changeModel}
                    defaultChecked={mode === 'SVM' ? true : false}
                    value="SVM"
                  />
                  <label htmlFor="svm" />
                </div>
                <label htmlFor="svm" className={s['labelName']}>
                  SVM
                </label>
              </div>
            </div>
          </div>
          <div className={s['dependence-args']}>
            <h3>{i18n.PARAMETER}</h3>
            <ul>
              {items.length === 0 ? (
                <li className={s['args-item']}>
                  <span>--</span>
                </li>
              ) : (
                items.map((item, index) => (
                  <li
                    key={index}
                    className={
                      selectedItems.indexOf(index) !== -1
                        ? s['args-item'] + ' ' + s['selected']
                        : s['args-item']
                    }
                    onClick={this.isSelected.bind(this, index)}
                  >
                    <span>{item.dsName}</span>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
        <div className={s['dependence-details']}>
          <div className={s['details-container']}>
            <TopDataRender dsItemInfo={dsItemInfo} mod={mod} i18n={i18n} />
            <div className={s['echart-footer']}>
              <RenderLineEcharts
                timeStart={realStartTime}
                timeEnd={realEndTime}
                dsItemInfo={dsItemInfo}
                timeShaft={timeShaft}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
  showModal(data) {
    this.data = data;
    this.setState({
      // items: ['板换4供水温度日达标率', '板换2供水温度日达标率', '冷冻水A供水达标率', '冷冻水B供水达标率'],
      showModal: true,
      startTime: moment.default().subtract(7, 'd')._d,
      endTime: moment.default()._d,
      selectedItems: [0, 1, 2, 3]
    });
  }
  _closeModal() {
    this.setState({ showModal: false });
  }
  updateStartTime(date) {
    this.setState({
      startTime: date
    });
    let mode = this.props.data.options.dataset.mode;
    if (mode === 'datasource') {
      this.updateModule(['options', 'dataset', 'options', 'startTime'], date);
    }
  }
  updateEndTime(date) {
    this.setState({
      endTime: date
    });
    let mode = this.props.data.options.dataset.mode;
    if (mode === 'datasource') {
      this.updateModule(['options', 'dataset', 'options', 'endTime'], date);
    }
  }
  isSelected(index) {
    let indexArr = this.state.selectedItems.concat();
    let isHasIndex = indexArr.findIndex(v => {
      return v === index;
    });
    if (isHasIndex === -1) {
      indexArr.push(index);
    } else {
      indexArr.splice(isHasIndex, 1);
      indexArr = indexArr;
    }
    this.setState({
      selectedItems: indexArr
    });
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
  changeModel(e) {
    let value;
    if (e.target.checked) {
      value = e.target.value;
    } else {
      value = '';
    }
    this.updateModule(['options', 'model'], value);
  }
}

AnalysisCorrelationPanel.propTypes = {};

export default AnalysisCorrelationPanel;
