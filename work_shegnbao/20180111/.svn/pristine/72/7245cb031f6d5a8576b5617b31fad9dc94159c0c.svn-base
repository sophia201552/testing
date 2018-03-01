/**
 * 历史数据配置组件
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'office-ui-fabric-react/lib/Dropdown';
import { Modal } from 'office-ui-fabric-react/lib/Modal';
import DatePicker from 'react-datepicker';
import * as moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';

import Confirm from '../../../components/Confirm';

import s from './HistoryChartConfigModal.css';
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

class HistoryChartConfig extends React.PureComponent {
  constructor(props) {
    super(props);
    this._selection = undefined;
    this.state = {
      timeStart: undefined,
      timeEnd: undefined,
      timeFormat: undefined
    };
    this._timeFormatChange = this._timeFormatChange.bind(this);
    this._timeStartChange = this._timeStartChange.bind(this);
    this._timeEndChange = this._timeEndChange.bind(this);
  }
  componentDidMount() {
    this.componentWillReceiveProps(this.props);
  }
  componentWillReceiveProps(nextProps) {
    const { chartCondition } = nextProps;
    const { timeStart, timeEnd, timeFormat } = chartCondition;
    this.setState({
      timeStart,
      timeEnd,
      timeFormat
    });
  }
  render() {
    const { timeStart, timeEnd, timeFormat } = this.state;
    const { i18n } = this.props;
    return (
      <div className={s['content']}>
        <div className={css('itemWrap clear')}>
          <div className={css('item timeFormat')}>
            <Dropdown
              className={s['dropdown']}
              selectedKey={timeFormat}
              onChanged={this._timeFormatChange}
              label={i18n.SAMPLING_PERIOD}
              options={[
                { key: 'm1', text: i18n.ONE_MINUTE },
                { key: 'm5', text: i18n.FIVE_MINUTES },
                { key: 'h1', text: i18n.ONE_HOUR },
                { key: 'd1', text: i18n.ONE_DAY },
                { key: 'M1', text: i18n.ONE_MONTH }
              ]}
            />
          </div>
          <div className={css('item time')}>
            <label className={css('', 'ms-Label ms-Dropdown-label root-36')}>
              {i18n.START_TIME}
            </label>
            <DatePicker
              customInput={<CustomInput />}
              selected={moment.default(timeStart)}
              onChange={this._timeStartChange}
              showTimeSelect={true}
              timeFormat="HH:mm"
              timeIntervals={5}
              dateFormat="YYYY-MM-DD HH:mm:ss"
            />
          </div>
          <div className={css('item time')}>
            <label className={css('', 'ms-Label ms-Dropdown-label root-36')}>
              {i18n.END_TIME}
            </label>
            <DatePicker
              customInput={<CustomInput />}
              selected={moment.default(timeEnd)}
              onChange={this._timeEndChange}
              showTimeSelect={true}
              timeFormat="HH:mm"
              timeIntervals={5}
              dateFormat="YYYY-MM-DD HH:mm:ss"
            />
          </div>
        </div>
      </div>
    );
  }
  _timeFormatChange(info) {
    const { changeCondition } = this.props;
    const { timeStart, timeEnd, timeFormat } = this.state;
    changeCondition({
      timeStart,
      timeEnd,
      timeFormat: info.key
    });
    this.setState({
      timeFormat: info.key
    });
  }
  _timeStartChange(date) {
    const { changeCondition } = this.props;
    const { timeStart, timeEnd, timeFormat } = this.state;
    changeCondition({
      timeStart: date.format('YYYY-MM-DD HH:mm:00'),
      timeEnd,
      timeFormat
    });
    this.setState({
      timeStart: date.format('YYYY-MM-DD HH:mm:00')
    });
  }
  _timeEndChange(date) {
    const { changeCondition } = this.props;
    const { timeStart, timeEnd, timeFormat } = this.state;
    changeCondition({
      timeStart,
      timeEnd: date.format('YYYY-MM-DD HH:mm:00'),
      timeFormat
    });
    this.setState({
      timeEnd: date.format('YYYY-MM-DD HH:mm:00')
    });
  }
}

export default HistoryChartConfig;
