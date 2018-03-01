/**
 * 首页
 * @author Peter
 */
import React from 'react';
import PropTypes from 'prop-types';
import {
  DatePicker,
  DayOfWeek,
  IDatePickerStrings
} from 'office-ui-fabric-react/lib/DatePicker';
import {Checkbox} from 'office-ui-fabric-react/lib/Checkbox';

import s from './EvaluateSlider.css';

class EvaluateSlider extends React.PureComponent {
  constructor(props) {
      super(props);
      this.state = {
        showModal: false,
        value: new Date(),
      }
    }
  render() {
    const {value} = this.state;
    return (
      <div className={s['slider-container']}>
          <div className={s['slider-header-text']}>
              <h3>评估</h3>
          </div>
          <div className={s['slider-time-picker']}>
            <DatePicker 
            highlightCurrentMonth={true}
            isMonthPickerVisible={false}
            allowTextInput={ true }
            value={this.state.value}
            formatDate={(value)=> {
              return this._formatDate(value);
            }}
            showGoToToday={false}/>
            <DatePicker 
            highlightCurrentMonth={true}
            isMonthPickerVisible={false}
            allowTextInput={ true }
            value={this.state.value}
            formatDate={(value)=> {
              return this._formatDate(value);
            }}
            showGoToToday={false}/>
          </div>
          <div className={s['slider-assess-ways']}>
            <h4 className={s['slider-title']}>方法</h4>
            <div>
              <Checkbox label='逻辑判断' />
              <Checkbox label='深度学习'/>
            </div>
          </div>
          <div className={s['slider-sample']}>
            <h4 className={s['slider-title']}>样本</h4>
            <ul className={s['sample-list']}>
              <li className={s['sample-item']}>
                <span>AHU01</span>
              </li>
              <li className={s['sample-item']}>
                <span>AHU02</span>
              </li>
              <li className={s['sample-item']}>
                <span>AHU03</span>
              </li>
            </ul>
          </div>
          <div className={s['slider-run-test']}>
              <span>测试运行</span>
            </div>
      </div>
    );
  }
  _formatDate (value) {
    var fmt = 'yyyy-MM-dd hh:mm:ss';
    var _this = new Date(value);
    var o = {
      "M+": _this.getMonth() + 1, //月份
      "d+": _this.getDate(), //日
      "h+": _this.getHours(), //小时
      "m+": _this.getMinutes(), //分
      "s+": _this.getSeconds(), //秒
      "q+": Math.floor((_this.getMonth() + 3) / 3), //季度
      "S": _this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (_this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  }

}

EvaluateSlider.propTypes = {};

export default EvaluateSlider;


