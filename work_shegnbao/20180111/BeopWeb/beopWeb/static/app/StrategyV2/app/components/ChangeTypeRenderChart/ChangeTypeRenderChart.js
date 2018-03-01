import React from 'react';
import ReactEcharts from 'echarts-for-react';
import { Dropdown } from 'office-ui-fabric-react/lib/Dropdown';
import * as moment from 'moment';

import s from './ChangeTypeRenderChart.css';
// props
// options   下拉框的options
// data      {data:[],time:[]}
// type      折线图异常点类型
// chartType 图表类型 折线图 或者 散点图 默认折线
// onSelect   ()=>{}  切换方法
export default class ChangeTypeRenderChart extends React.Component {
  constructor(props) {
    super(props);
    this.option = {
      xAxis: {
        type: 'category',
        splitLine: { show: false },
        data: []
      },
      yAxis: {
        type: 'value'
      },
      series: [],
      grid: {
        left: 60,
        right: 60,
        bottom: 50
      }
    };
    this.data = { data: [], time: [] };
    this.options = [];
    this.colorArr = [
      ['rgba(170, 170, 255, 1)', '#66ccff'],
      ['rgba(244, 192, 101, 1)', '#ff6666'],
      ['rgba(51, 102, 255, 1)', '#5da9ff'],
      ['rgba(77, 138, 208, 1)', '#75b4fd'],
      ['rgba(213, 129, 252, 1)', '#fc84d3'],
      ['rgba(117, 180, 253, 1)', '#65f2fb'],
      ['rgba(244, 282, 93, 1)', '#f3df5e'],
      ['rgba(153, 53, 204, 1)', '#66ccff']
    ];
    this._changeDropDown = this._changeDropDown.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    const { options, data, type, chartType, toolTipData = [] } = nextProps;
    if (data.data) {
      this.options = options.map(row => ({
        key: row,
        text: row
      }));
      if (data.data.length) {
        if (chartType === 'scatter') {
          (this.labelData = []), (this.xData = []), (this.yData = []);
          data.data.forEach(row => {
            switch (row.name) {
              case 'label':
                this.labelData = row.value;
                break;
              case 'pca_x':
                this.xData = row.value;
                break;
              case 'pca_y':
                this.yData = row.value;
                break;
            }
          });
          this.types = [];
          this.labelData.forEach(row => {
            if (this.types.indexOf(row) === -1) {
              this.types.push(row);
            }
          });
        }
        this.getOption(data, type, chartType, toolTipData);
        this.data = data;
      } else {
        this.option = {
          xAxis: {
            type: 'category',
            splitLine: { show: false },
            data: []
          },
          yAxis: {
            type: 'value'
          },
          series: [],
          grid: {
            left: 60,
            right: 60,
            bottom: 50
          }
        };
        this.data = { data: [], time: [] };
        this.labelData = [];
        this.xData = [];
        this.yData = [];
        this.options = [];
      }
    }
  }
  render() {
    const { type, selectedOption, chartType, i18n } = this.props;
    return (
      <div className={s['ctn']}>
        <div className={s['dropDwonCtn']}>
          <Dropdown
            selectedKey={selectedOption}
            options={this.options}
            onChanged={this._changeDropDown}
          />
        </div>
        <div className={s['chartWrap']}>
          <ReactEcharts
            option={this.option}
            style={{ height: '100%', width: '100%' }}
            className="react_for_echarts"
            notMerge={true}
          />
        </div>
        <div className={s['footTable']}>
          {chartType && chartType === 'scatter' ? (
            <table className={s['operation']}>
              <thead className={s['operation-header']}>
                <tr className={s['thead-row']}>
                  <th>{i18n.DATA}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>( x , y )</td>
                </tr>
                {this.labelData &&
                  this.labelData.map((row, i) => (
                    <tr key={i}>
                      <td>
                        <span
                          key={i}
                          style={{
                            width: '100%',
                            background:
                              row === 1
                                ? ''
                                : this.colorArr[
                                    this.types.indexOf(row) > 7
                                      ? this.types.indexOf(row) % 8
                                      : this.types.indexOf(row)
                                  ][0]
                          }}
                        >
                          {this.xData[i].toFixed(2) +
                            ' , ' +
                            this.yData[i].toFixed(2)}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          ) : (
            <table className={s['operation']}>
              <thead className={s['operation-header']}>
                <tr className={s['thead-row']}>
                  <th>{i18n.TIME}</th>
                  <th>{i18n.DATA}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Time</td>
                  <td>
                    {this.data.data.map((col, index) => (
                      <span
                        key={index}
                        style={{
                          width: 100 / this.data.data.length + '%'
                        }}
                      >
                        {col.name}
                      </span>
                    ))}
                  </td>
                </tr>
                {this.data.time.map((row, i) => (
                  <tr key={i}>
                    <td style={{ width: '200px' }}>{row}</td>
                    <td>
                      {this.data.data.map((col, index) => (
                        <span
                          key={index}
                          className={
                            col.value[i].type === type ? 'highLight' : ''
                          }
                          style={{
                            width: 100 / this.data.data.length + '%'
                          }}
                        >
                          {typeof col.value[i] === 'object'
                            ? col.value[i].value
                            : col.value[i]}
                        </span>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  }
  getOption(data, type, chartType, toolTipData) {
    const { i18n } = this.props;
    if (chartType !== 'scatter') {
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
        let params = value.params;
        let markLineData =
          params &&
          Object.keys(params).map(row => ({
            name: row,
            yAxis: params[row]
          }));
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
          showSymbol: false,
          markLine: { data: markLineData }
        };
        series[count + 1] = {
          name: value.name,
          type: 'line',
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
              color: `${color[index][0]}`
            }
          },
          showSymbol: false,
          markLine: { data: markLineData }
        };
        count = count + 2;
        dataName[index] = {
          name: value.name,
          icon: 'roundRect',
          textStyle: {
            color: '#555'
          }
        };
        cColor[index] = color[index % 9][2];
      });
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
        legend: {
          icon: 'rect',
          textStyle: {
            color: '#1d1d1d',
            fontSize: '14px'
          },
          data: dataName
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
      let seriesDatas = [];
      seriesDatas =
        this.labelData &&
        this.labelData.map((v, index) => ({
          name: index,
          value: [this.xData[index].toFixed(2), this.yData[index].toFixed(2)],
          itemStyle: {
            normal: {
              color:
                v === 1
                  ? {
                      type: 'linear',
                      x: 0,
                      y: 0,
                      x2: 1,
                      y2: 0,
                      colorStops: [
                        {
                          offset: 0,
                          color: '#69bd76' // 0% 处的颜色
                        },
                        {
                          offset: 1,
                          color: '#69bd76'
                        }
                      ]
                    }
                  : {
                      type: 'linear',
                      x: 0,
                      y: 0,
                      x2: 1,
                      y2: 0,
                      colorStops: [
                        {
                          offset: 0,
                          color: this.colorArr[
                            this.types.indexOf(v) > 7
                              ? this.types.indexOf(v) % 8
                              : this.types.indexOf(v)
                          ][1] // 0% 处的颜色
                        },
                        {
                          offset: 1,
                          color: this.colorArr[
                            this.types.indexOf(v) > 7
                              ? this.types.indexOf(v) % 8
                              : this.types.indexOf(v)
                          ][1] // 100% 处的颜色
                        }
                      ],
                      globalCoord: false // 缺省为 false
                    }
            }
          }
        }));
      this.option = {
        tooltip: {
          formatter: function(v) {
            let dataIndex = v.dataIndex;
            return toolTipData
              .map(row => `${row.name}: ${row.value[dataIndex]}`)
              .join('<br />');
          }
        },
        xAxis: {
          splitLine: {
            lineStyle: {
              type: 'dashed'
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#626262'
          },
          axisLine: {
            lineStyle: {
              color: '#ccc'
            }
          }
        },
        yAxis: {
          splitLine: {
            lineStyle: {
              type: 'dashed'
            }
          },
          scale: true,
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#626262'
          },
          axisLine: {
            lineStyle: {
              color: '#ccc'
            }
          }
        },
        grid: {
          left: 60,
          right: 60,
          bottom: 50
        },
        series: [
          {
            type: 'scatter',
            data: seriesDatas
          }
        ]
      };
    }
  }
  _changeDropDown(item) {
    this.props.onSelect(item);
  }
}