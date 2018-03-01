/**
 * 数据去重
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { debug, isArray } from 'util';

import DataSetComponent from '../DataSetComponent';
import ShowDataResult from '../../../components/ShowDataResult';
import UnknownTooltip from '../../../components/UnknownTooltip';

import { dataTypes } from '@beopcloud/StrategyV2-Engine/src/enum';

import s from './DataDeduplicationPanel.css';

const css = (className1, className2 = '') => {
  return className1
    .split(' ')
    .map(v => s[v])
    .concat(className2.split(' '))
    .join(' ')
    .trim();
};

class DataDeduplicationPanel extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: props.data.options.methods.toleranceLimits || '',
      errMsg: '',
      dataSet: [],
      selected: null
    };
    this._items = [];
    this.odata = { data: [], time: [] };
    this._onChartLegendselectchanged = this._onChartLegendselectchanged.bind(
      this
    );
  }
  componentWillReceiveProps(nextProps) {
    const { moduleInputData } = nextProps;
    let idata = moduleInputData.find(
      v => v.dataType == dataTypes['DS_HIS_OUTPUT']
    ) || {
      data: false
    };
    idata = (idata && idata.data) || { data: [], time: [] };
    this._items = this._getItems(idata.data);
    this.setState({
      dataSet: this._items.map(v => v.text)
    });
  }
  componentWillUpdate(nextProps, nextState) {
    let { dataSet } = nextState;
    const { moduleResponseData } = nextProps;
    let odata = (moduleResponseData &&
      moduleResponseData.find(
        v => v.dataType == dataTypes['ANLS_DEDUPLICATION_OUTPUT']
      )) || {
      data: false
    };
    odata = (odata && odata.data) || { data: [], time: [] };
    let tmp = [];
    dataSet.forEach((value, i) => {
      if (value !== 'ALL') {
        tmp.push(odata.data.filter(v => v.name.indexOf(value) !== -1)[0]);
      }
    });
    this.odata = (tmp.length !== 0 && {
      data: tmp[0] !== undefined ? tmp : [],
      time: odata.time
    }) || { data: [], time: [] };
  }
  render() {
    const { data, i18n } = this.props;
    let { inputValue, errMsg, dataSet, selected } = this.state;
    return (
      <div className={css('deduplicationWrap clear')}>
        <div className={css('left')}>
          <div className={css('title')}>{i18n.MODULE_NAME}</div>
          <div className={css('mWrap')}>
            <div className={s['inputWrap']}>
              <label className={css('', 'ms-Label ms-Dropdown-label root-36')}>
                {i18n.TOLERANCE}
                <UnknownTooltip content={i18n.ANNOTATION_TOLERANCE} />
              </label>
              <input
                id="input"
                placeholder={i18n.ENTER_NAMBER}
                onChange={this._valueChange.bind(this)}
                value={inputValue}
                onBlur={this._onBlur.bind(this, 'toleranceLimits')}
                onKeyUp={this._onKeyUp.bind(this, 'toleranceLimits')}
              />
              <span className={errMsg !== '' ? 'errMsg' : ''}>{errMsg}</span>
              <label
                className={s['ChevronUp']}
                onClick={this._btnValueChange.bind(this, 'ChevronUp')}
              >
                <i
                  className="ms-Icon ms-Icon--CaretSolidUp"
                  aria-hidden="true"
                />
              </label>
              <label
                className={s['ChevronDown']}
                onClick={this._btnValueChange.bind(this, 'ChevronDown')}
              >
                <i
                  className="ms-Icon ms-Icon--CaretSolidDown"
                  aria-hidden="true"
                />
              </label>
            </div>
          </div>
          <div className={css('bWrap')}>
            <DataSetComponent
              title={i18n.DATA_SET}
              items={this._items}
              isRadio={false}
              onSelect={this.changeDataSet.bind(this)}
              isRadio={false}
              selectedKeys={dataSet}
            />
          </div>
        </div>
        <div className={s['showDataCtn']}>
          <ShowDataResult
            data={this.odata}
            onChartLegendselectchanged={this._onChartLegendselectchanged}
            selected={selected}
          />
        </div>
      </div>
    );
  }
  _valueChange(e) {
    let newValue;
    if (e.currentTarget) {
      newValue = e.currentTarget.value;
    } else {
      newValue = e;
    }
    if (isNaN(newValue - 0)) {
      return;
    }
    this.setState({
      inputValue: newValue
    });
  }
  _onBlur(args, e) {
    this._updateValue(args, e.target.value - 0);
  }
  _onKeyUp(args, e) {
    if (e.key === 'Enter') {
      this._onBlur(args, e);
    }
  }
  _updateValue(field, value) {
    this._onChange(
      'methods',
      this.props.data.options.methods.set(field, value)
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
  _btnValueChange(args) {
    let { inputValue } = this.state;
    if (args === 'ChevronDown') {
      inputValue--;
    } else if (args === 'ChevronUp') {
      inputValue++;
    }
    this._valueChange(inputValue);
    this._updateValue('toleranceLimits', inputValue);
  }

  _getItems(idata) {
    let items = [];
    idata.forEach(v => {
      items.push({
        key: v.name,
        text: v.name
      });
    });
    return items;
  }
  /* 切换数据集展示 */

  changeDataSet(data) {
    this.setState({
      dataSet: data
    });
  }

  _onChartLegendselectchanged(selected) {
    this.setState({
      selected
    });
  }
}

DataDeduplicationPanel.propTypes = {};

export default DataDeduplicationPanel;