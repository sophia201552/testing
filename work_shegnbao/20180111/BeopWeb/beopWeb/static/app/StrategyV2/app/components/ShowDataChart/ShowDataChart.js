import React from 'react';
import ReactEcharts from 'echarts-for-react';
import * as moment from 'moment';
import s from './ShowDataChart.css';
// props
// data
// type 异常点类型
// isScatte 是否是散点图
// onChartLegendselectchanged: ()=>{} legend改变时间
// selected: {} lengend是否选中
export default class ShowDataChart extends React.Component {
  constructor(props) {
    super(props);
    this.getOption(props);
    this._onChartLegendselectchanged = this._onChartLegendselectchanged.bind(
      this
    );
  }
  componentDidMount() {
    this.componentWillReceiveProps(this.props);
  }
  componentWillReceiveProps(nextProps) {
    const { data = { data: [], time: [] } } = nextProps;
    if (data.data) {
      this.getOption(nextProps);
    }
  }
  render() {
    let onEvents = {
      legendselectchanged: this._onChartLegendselectchanged
    };
    return (
      <div className={s['chartWrap']}>
        <ReactEcharts
          option={this.option}
          style={{ height: '100%', width: '100%' }}
          className="react_for_echarts"
          notMerge={true}
          onEvents={onEvents}
        />
      </div>
    );
  }
  _onChartLegendselectchanged(legendInfo, ec) {
    const { onChartLegendselectchanged = () => {} } = this.props;
    onChartLegendselectchanged(legendInfo.selected);
  }
  getOption(props) {
    const {
      data = { data: [], time: [] },
      type = 'DUPLICATED',
      isScatte = false,
      selected = {}
    } = props;
    if (!isScatte) {
      let series = [],
        dataName = [];
      let indexArr = [];
      let color = [
          ['#aaaaff1a', '#66ccff', '#aaaaff'],
          ['#69bd761a', '#edff9b', '#69bd76'],
          ['#f4c0651a', '#ff6666', '#f4c065'],
          ['#3366ff1a', '#5da9ff', '#3366ff'],
          ['#4d8ad01a', '#75b4fd', '#4d8ad0'],
          ['#d581fc1a', '#fc84d3', '#d581fc'],
          ['#75b4fd1a', '#65f2fb', '#75b4fd'],
          ['#f4ff5d1a', '#f3df5e', '#f4ff5d'],
          ['#9935cc1a', '#66ccff', '#9935cc']
        ],
        cColor = [];
      let count = 0; // 每遍历一次生成两个series
      data.data.forEach((value, index) => {
        let v = value.value;
        series[count] = {
          name: value.name,
          type: 'line',
          data: (v => {
            let data = [];
            v.forEach((item, i) => {
              if (item.type === type) {
                data.push('');
                indexArr.push(i);
              } else {
                data.push(item);
              }
            });
            return data;
          })(v),
          smooth: true,
          lineStyle: {
            normal: {
              type: 'solid'
            }
          },
          areaStyle: {
            normal: {
              color: color[index % 9][0]
            }
          },
          showSymbol: false
        };
        series[count + 1] = {
          name: value.name,
          type: 'line',
          color: cColor,
          data: (v => {
            let data = [];
            v.forEach((item, i) => {
              if (item.type === type) {
                if (i !== 0) {
                  if (v[i - 1].type === type) {
                    data[i - 1] = item.value;
                  } else {
                    data[i - 1] = v[i - 1];
                  }
                }
                data[i + 1] = v[i + 1];
                data[i] = item.value;
              } else {
                if (i !== 0) {
                  if (v[i - 1]['type'] === type) {
                    data[i] = item;
                  } else {
                    data[i] = '';
                  }
                } else {
                  data[i] = '';
                }
              }
            });
            return data;
          })(v),
          lineStyle: {
            normal: {
              type: 'dotted'
            }
          },
          areaStyle: {
            normal: {
              color: color[index % 9][0]
            }
          },
          showSymbol: false
        };
        dataName[index] = {
          name: value.name,
          icon: 'roundRect',
          textStyle: {
            color: '#555'
          }
        };
        count = count + 2;
        cColor[index] = color[index % 9][2];
      });

      this.option = {
        tooltip: {
          trigger: 'axis',
          formatter: function(params) {
            let res = `${params[0].axisValue} <br/>`;
            for (let i = 0; i < params.length; i += 2) {
              if (params[i].data !== '') {
                res += `${params[i].seriesName} : ${params[i].data}  <br/>`;
              } else {
                res += `${params[i].seriesName} : ${params[i + 1].data}  <br/>`;
              }
            }
            return res;
          }
        },
        color: cColor,
        legend: {
          icon: 'rect',
          textStyle: {
            color: '#1d1d1d',
            fontSize: '14px'
          },
          data: dataName,
          selected: selected
        },
        grid: {
          left: 60,
          right: 60,
          bottom: 50
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: data.time,
          axisLabel: {
            color: '#626262',
            formatter: function(value, index) {
              return moment.default(value).format('MM-DD HH:ss');
            }
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          splitLine: { show: false }
        },
        yAxis: {
          type: 'value',
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          splitLine: {
            show: false
          },
          axisLabel: {
            color: '#626262',
            formatter: (value, index) => {
              if (value > 1000 /*&& value < 1000000*/) {
                value = value / 1000 + 'k';
                // } else if (value > 1000000) {
                //   value = value / 1000000 + 'MILL';
              }
              return value;
            }
          }
        },
        series: series
      };
    } else {
      this.option = {
        tooltip: {
          formatter: 'Group {a}: ({c})'
        },
        xAxis: [{ gridIndex: 0, min: 0, max: 20 }],
        yAxis: [{ gridIndex: 0, min: 0, max: 15 }],
        series: [
          {
            name: 'I',
            type: 'scatter',
            data: [
              [10.0, 8.04],
              [8.0, 6.95],
              [13.0, 7.58],
              [9.0, 8.81],
              [11.0, 8.33],
              [14.0, 9.96],
              [6.0, 7.24],
              [4.0, 4.26],
              [12.0, 10.84],
              [7.0, 4.82],
              [5.0, 5.68]
            ]
          }
        ]
      };
    }
  }
}