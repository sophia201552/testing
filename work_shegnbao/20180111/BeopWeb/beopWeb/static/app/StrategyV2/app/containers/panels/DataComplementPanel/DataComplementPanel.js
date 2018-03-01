/**
 * 数据补齐
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { debug, isArray } from 'util';

import DataSetComponent from '../DataSetComponent';
import ShowDataResult from '../../../components/ShowDataResult';
import UnknownTooltip from '../../../components/UnknownTooltip';

import { dataTypes } from '@beopcloud/StrategyV2-Engine/src/enum';

import s from './DataComplementPanel.css';
const css = (className1, className2 = '') => {
  return className1
    .split(' ')
    .map(v => s[v])
    .concat(className2.split(' '))
    .join(' ')
    .trim();
};

class DataComplementPanel extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: props.data.options.options.maxPaddingInterval || '',
      method: undefined,
      dataSet: [],
      selected: null
    };
    this._items = [];
    this.odata = { data: [], time: [] };
    this.changeMethod = this.changeMethod.bind(this);
    this.changeDataSet = this.changeDataSet.bind(this);
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
        v => v.dataType == dataTypes['ANLS_DATA_COMPLEMENT_OUTPUT']
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
    const { value, dataSet, selected, method } = this.state;
    return (
      <div className={css('dataComplementWrap clear')}>
        <div className={css('left')}>
          <div className={css('title')}>{i18n.MODULE_NAME}</div>
          <div className={css('mWrap')}>
            <div className={css('api')}>
              <DataSetComponent
                title={i18n.METHOD}
                items={[
                  { key: i18n.BACK_FILL, text: i18n.BACK_FILL },
                  { key: i18n.AVERAGE, text: i18n.AVERAGE },
                  { key: i18n.LINEAR_INSERT, text: i18n.LINEAR_INSERT }
                ]}
                isRadio={true}
                selectedKeys={this._getDefault(
                  method || data.options.methods.type
                )}
                onSelect={this.changeMethod}
                isShowTooltip={true}
                content={[
                  i18n.ANNOTATION_BACK_FILL,
                  i18n.ANNOTATION_AVERAGE,
                  i18n.ANNOTATION_LINEAR_INSERT
                ]}
              />
            </div>
            <div className={css('api2')}>
              <label className={css('', 'ms-Label ms-Dropdown-label root-36')}>
                {i18n.MAX_COMPLEMENTAION}
                <UnknownTooltip content={i18n.ANNOTATION_MAX_COMPLEMENTAION} />
              </label>
              <div>
                <input
                  type="text"
                  value={value}
                  onChange={this.changeValue.bind(this)}
                  onBlur={this._onBlur.bind(this, 'maxPaddingInterval')}
                  onKeyUp={this._onKeyUp.bind(this, '')}
                />
                <div>
                  <i
                    className="ms-Icon ms-Icon--CaretSolidUp"
                    onClick={this.BtnChange.bind(this, 'add')}
                  />
                  <i
                    className="ms-Icon ms-Icon--CaretSolidDown"
                    style={{ marginTop: '-4px' }}
                    onClick={this.BtnChange.bind(this, 'delete')}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className={css('bWrap')}>
            <DataSetComponent
              title={i18n.DATA_SET}
              items={this._items}
              isRadio={false}
              onSelect={this.changeDataSet}
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
  /** 改变配置项 */
  _onChange(field, value) {
    if (typeof field === 'string') {
      field = [field];
    }
    this.props.updateModule(
      this.props.data.setIn(['options', ...field], value)
    );
  }
  /* 更新最大补数间隔 */

  _updateValue(field, value) {
    this._onChange(
      'options',
      this.props.data.options.options.set(field, value)
    );
  }
  /* input 值改变*/
  changeValue(e) {
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
      value: newValue
    });
  }
  _onBlur(args, e) {
    this._updateValue(args, e.target.value - 0);
  }
  _onKeyUp(args, e) {
    if (e.key == 'Enter') {
      this._onBlur(args, e);
    }
  }
  BtnChange(e) {
    let { value } = this.state;
    if (e === 'add') {
      value++;
    } else if (e === 'delete') {
      value--;
    }
    this.changeValue(value);
    this._updateValue('toleranceLimits', value);
  }
  /* 获取默认选中补齐方式 */

  _getDefault(type) {
    const { i18n } = this.props;
    let value = '';
    switch (type) {
      case 'BACK_FILL':
        value = i18n.BACK_FILL;
        break;
      case 'AVERAGE':
        value = i18n.AVERAGE;
        break;
      case 'LINEAR_INSERT':
        value = i18n.LINEAR_INSERT;
        break;
    }
    return [value];
  }
  /* 切换补齐方式 */

  changeMethod(data) {
    const { i18n } = this.props;
    const type = data[0];
    let value = '';
    switch (type) {
      case i18n.BACK_FILL:
        value = 'BACK_FILL';
        break;
      case i18n.AVERAGE:
        value = 'AVERAGE';
        break;
      case i18n.LINEAR_INSERT:
        value = 'LINEAR_INSERT';
        break;
    }
    this._onChange(
      'methods',
      this.props.data.options.methods.set('type', value)
    );

    this.setState({
      method: value
    });
  }
  /* 切换数据集展示 */

  changeDataSet(data) {
    this.setState({
      dataSet: data
    });
  }
  /* 获取数据集名称*/

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

  _onChartLegendselectchanged(selected) {
    this.setState({
      selected: selected
    });
  }
}

DataComplementPanel.propTypes = {};

export default DataComplementPanel;
