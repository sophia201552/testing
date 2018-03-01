/**
 * 数据归一化
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';

import ShowDataResult from '../../../components/ShowDataResult';
import UnknownTooltip from '../../../components/UnknownTooltip';
import DataSetComponent from '../DataSetComponent';

import { dataTypes } from '@beopcloud/StrategyV2-Engine/src/enum';

import s from './DataNormalizationPanel.css';
const css = (className1, className2 = '') => {
  return className1
    .split(' ')
    .map(v => s[v])
    .concat(className2.split(' '))
    .join(' ')
    .trim();
};
class DataNormalizationPanel extends React.PureComponent {
  constructor(props) {
    super(props);
    const { methods } = this.props.data.options;
    this.state = {
      dataSet: ['CLEAR'],
      minValue: 0,
      maxValue: 0,
      selectedOption: undefined,
      selectedZeroOne: methods.find(v => v.type == '0-1') ? true : false,
      selectedMinMax: methods.find(v => v.type == 'MIN_MAX') ? true : false
    };
    this.options = [];
    this._items = [];
    this.odata = { data: [], time: [] };
    this._getItems = this._getItems.bind(this);
    this._changeDataSet = this._changeDataSet.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    const { moduleInputData } = nextProps;
    let idata = moduleInputData.find(
      v => v.dataType == dataTypes['DS_HIS_OUTPUT']
    ) || {
      data: false
    };
    this.idatat = idata = (idata && idata.data) || { data: [], time: [] };
    this._items = this._getItems(idata.data);
    this.setState({
      dataSet: this._items.map(v => v.text)
    });
  }
  componentWillUpdate(nextProps, nextState) {
    let { dataSet, selectedOption } = nextState;
    const { moduleResponseData, data } = nextProps;
    const { methods } = data.options;
    let odata = (moduleResponseData &&
      moduleResponseData.find(
        v => v.dataType == dataTypes['ANLS_DATA_NORMALIZATION_OUTPUT']
      )) || { data: [] };
    if (selectedOption || methods[0]) {
      selectedOption = selectedOption ? selectedOption.key : methods[0].type;
      odata = (odata.data &&
        odata.data.find(row => row.method == selectedOption)) || {
        data: [],
        time: []
      };
    } else {
      odata = { data: [], time: [] };
    }
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
    const {
      dataSet,
      minValue,
      maxValue,
      selectedZeroOne,
      selectedMinMax,
      selectedOption
    } = this.state;
    const methods = data.options.methods || [];
    let tmp = [];
    methods.forEach(v => {
      tmp.push({
        key: v.type,
        text: v.type
      });
    });
    this.options = tmp;
    return (
      <div className={css('dataComplementWrap clear')}>
        <div className={css('left')}>
          <div className={css('title')}>{i18n.MODULE_NAME}</div>
          <div className={css('mWrap')}>
            <div className={css('api2')}>
              <label>{i18n.METHOD}</label>
              <div className={css('checkboxWrap clear')}>
                <Checkbox
                  className={s['checkbox']}
                  label="0-1"
                  checked={selectedZeroOne}
                  onChange={(e, checked) => {
                    this.setState({
                      selectedZeroOne: checked
                    });
                    this._onChange(['0-1'], selectedZeroOne);
                  }}
                />
                <UnknownTooltip content={i18n.ANNOTATION_MIN_MAX} />
              </div>
              <div className={css('checkboxWrap clear')}>
                <Checkbox
                  className={s['checkbox']}
                  label="Min Max"
                  checked={selectedMinMax}
                  onChange={(e, checked) => {
                    this.setState({
                      selectedMinMax: checked
                    });
                    this._onChange(['MIN_MAX'], !checked);
                  }}
                />
                <UnknownTooltip content={i18n.ANNOTATION_0_1} />
              </div>
            </div>
          </div>
          <div className={css('bWrap')}>
            <DataSetComponent
              title={i18n.DATA_SET}
              items={this._items}
              isRadio={false}
              onSelect={this._changeDataSet}
              selectedKeys={dataSet}
              onChange={items => {
                this.setState({
                  dataSet: items
                });
              }}
            />
          </div>
        </div>
        <div className={s['showDataCtn']}>
          <ShowDataResult
            data={this.odata}
            idata={this.idatat}
            options={this.options}
            selectedOption={selectedOption || this.options[0]}
            changeDropDown={this._changeDropDown.bind(this)}
          />
        </div>
      </div>
    );
  }
  /* 切换数据集展示 */
  _changeDataSet(data) {
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
  _changeDropDown(selectedOption) {
    this.setState({
      selectedOption
    });
  }
  /** 改变配置项 */
  _onChange(field, checked) {
    if (typeof field === 'string') {
      field = [field];
    }
    let newMethods = [];
    const { methods } = this.props.data.options;
    let index = methods.findIndex(v => v.type === field[0]);

    if (!checked) {
      if (index == -1) {
        newMethods = methods.concat([
          {
            type: field[0]
          }
        ]);
      } else {
        newMethods = methods.concat([]);
      }
    } else {
      newMethods = methods.filter(row => row.type !== field[0]);
    }
    this.props.updateModule(
      this.props.data.setIn(['options', 'methods'], newMethods)
    );
  }
}

DataNormalizationPanel.propTypes = {};

export default DataNormalizationPanel;