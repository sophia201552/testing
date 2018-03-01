/**
 * 测试评估左侧
 */
import React from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import * as moment from 'moment';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';

import s from './EvaluateSlider.css';

class EvaluateSlider extends React.PureComponent {
  constructor(props) {
    super(props);
    this._onSelectDate = this._onSelectDate.bind(this);
  }
  componentDidMount() {
    this.componentWillReceiveProps(this.props);
  }
  componentWillReceiveProps(nextprops) {
    const { data, i18n } = nextprops;
    if (!data.options.dataset.options.time) {
      let timeStart = moment.default(+new Date());
      this._onSelectDate(timeStart);
    }
  }
  render() {
    const { data, i18n } = this.props;
    let timeStart = moment.default(+new Date());
    let time = moment.default(
      data.options.dataset.options.time ||
        timeStart.format('YYYY-MM-DD HH:mm:00')
    );
    return (
      <div className={s['slider-container']}>
        <div className={s['slider-header-text']}>
          <h3>{i18n.MODULE_NAME}</h3>
        </div>
        <div className={s['timePickerWrap']}>
          <DatePicker
            selected={time}
            onChange={this._onSelectDate}
            showTimeSelect={true}
            timeFormat="HH:mm"
            timeIntervals={5}
            dateFormat="YYYY-MM-DD HH:mm:ss"
          />
        </div>
        <div className={s['slider-assess-ways']}>
          <h4 className={s['slider-title']}>{i18n.METHOD}</h4>
          <div className={s['checkboxWrap']}>
            <Checkbox
              className={s['checkbox']}
              label={i18n.LOGICAL_JUDGMENT}
              checked={true}
              onChange={() => {}}
            />
          </div>
        </div>
        <div className={s['slider-sample']} style={{ display: 'none' }}>
          <h4 className={s['slider-title']}>{i18n.SAMPLE}</h4>
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
        <div />
      </div>
    );
  }
  /** 选中开始时间, 结束时间相应改变 */

  _onSelectDate(date) {
    const { data, updateModule } = this.props;
    updateModule(
      data.setIn(
        ['options', 'dataset', 'options', 'time'],
        date.format('YYYY-MM-DD HH:mm:00')
      )
    );
  }
}

EvaluateSlider.propTypes = {};

export default EvaluateSlider;
