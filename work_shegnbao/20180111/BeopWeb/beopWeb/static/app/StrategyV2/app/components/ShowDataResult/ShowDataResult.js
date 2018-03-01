import React from 'react';
import ReactEcharts from 'echarts-for-react';
import * as moment from 'moment';
import { Dropdown } from 'office-ui-fabric-react/lib/Dropdown';

import { isDataMissing } from '../../common/utils';

import ShowDataChart from '../ShowDataChart/ShowDataChart.js';

import s from './ShowDataResult.css';
// props
// data: [data: [], time: []] 处理后的
// idata: [data: [], time: []] 处理前数据
//        该数据传递决定是否显示处理前和处理后的数据
// selectedOption: {key:'', text:''} 下拉框默认选项
// onChartLegendselectchanged: ()=>{} legend改变时间
// selected: {} lengend是否选中
// options: [ {key:'', text:''}] 下拉框的选项
// changeDropDown: ()=>{} 改变下拉框事件
// type 异常点类型
// isScatte 是否是散点图

export default class ShowDataResult extends React.Component {
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
      series: []
    };
    this._changeDropDown = this._changeDropDown.bind(this);
    this._onChartLegendselectchanged = this._onChartLegendselectchanged.bind(
      this
    );
  }
  render() {
    const {
      data = { data: [], time: [] },
      options,
      idata,
      selectedOption = { key: '' },
      selected = {},
      i18n
    } = this.props;
    return (
      <div className={s['ctn']}>
        {options && (
          <div className={s['dropDwonCtn']}>
            <Dropdown
              selectedKey={selectedOption.key}
              options={options}
              onChanged={this._changeDropDown}
            />
          </div>
        )}
        <div className={s['chartWrap']}>
          <ShowDataChart
            data={data}
            onChartLegendselectchanged={this._onChartLegendselectchanged}
            selected={selected}
            type="COMPLEMENTARY"
          />
        </div>
        <div className={s['footTable']}>
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
                  {data.data.map((col, index) => {
                    return (
                      <span
                        key={index}
                        style={{
                          width: `calc(100%/${data.data.length})`
                        }}
                      >
                        {col.name}
                      </span>
                    );
                  })}
                </td>
              </tr>
              {idata && (
                <tr>
                  <td>Time</td>
                  <td>
                    {data.data.map((col, index) => {
                      return (
                        <span
                          key={index}
                          style={{
                            width: `calc(100%/${data.data.length})`
                          }}
                        >
                          <span>{i18n.BEFORE_NORMALIZATION}</span>
                          <span>{i18n.NORMALIZED}</span>
                        </span>
                      );
                    })}
                  </td>
                </tr>
              )}
              {data.time.map((row, i) => {
                return (
                  <tr key={i}>
                    <td style={{ width: '200px' }}>{row}</td>
                    <td>
                      {idata &&
                        data.data.map((col, index) => {
                          let value = col.value[i];
                          let typeOfValue = typeof value;
                          return (
                            <span
                              key={index}
                              className={
                                typeOfValue === 'object' &&
                                (value.type === 'DUPLICATED' ||
                                  value.type === 'COMPLEMENTARY')
                                  ? 'highLight'
                                  : ''
                              }
                              style={{
                                width: `calc(100%/${data.data.length})`
                              }}
                            >
                              <span>
                                {idata.data[index].value[i].toFixed(2)}
                              </span>
                              <span>
                                {typeOfValue === 'object'
                                  ? Math.round(value.value * 100) / 100
                                  : typeOfValue === 'string'
                                    ? value
                                    : Math.round(value * 100) / 100}
                              </span>
                            </span>
                          );
                        })}
                      {!idata &&
                        data.data.map((col, index) => {
                          let value = col.value[i];
                          let typeOfValue = typeof value;
                          return (
                            <span
                              key={index}
                              className={
                                typeOfValue === 'object' &&
                                (value.type === 'DUPLICATED' ||
                                  value.type === 'COMPLEMENTARY')
                                  ? 'highLight'
                                  : ''
                              }
                              style={{
                                width: `calc(100%/${data.data.length})`
                              }}
                            >
                              {typeOfValue === 'object'
                                ? Math.round(value.value * 100) / 100
                                : typeOfValue === 'string'
                                  ? value
                                  : Math.round(value * 100) / 100}
                            </span>
                          );
                        })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  _changeDropDown(dropOpt) {
    this.props.changeDropDown(dropOpt);
  }
  _onChartLegendselectchanged(selected) {
    const { onChartLegendselectchanged = () => {} } = this.props;
    onChartLegendselectchanged(selected);
  }
}
