/**
 * 离群点检测
 *
 */
import React from 'react';
import ReactEcharts from 'echarts-for-react';
import PropTypes from 'prop-types';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import { Dropdown } from 'office-ui-fabric-react/lib/Dropdown';

import { dataTypes } from '@beopcloud/StrategyV2-Engine/src/enum';

import UnknownTooltip from '../../../components/UnknownTooltip';
import DataSetComponent from '../DataSetComponent';
import ChangeTypeRenderChart from '../../../components/ChangeTypeRenderChart';

import s from './OutlierDetectionPanel.css';

class OutlierDetectionPanel extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: undefined
    };
    this.historyData = {
      data: [],
      time: []
    };
    this.dataSet = [];
    this.chartType = undefined;
    this.dropDownOptions = [];
    this.defaultSelectedKeys = [];
    this._selectedItem = this._selectedItem.bind(this);
    this._changeOption = this._changeOption.bind(this);
  }
  componentWillMount() {
    const { data } = this.props;
  }
  componentWillReceiveProps(nextProps) {
    const { data, moduleInputData, moduleResponseData } = nextProps;
    this.chartType = undefined;
    this.dropDownOptions = [];
    let inputData = moduleInputData.find(
      row => row.dataType === dataTypes['DS_HIS_OUTPUT']
    );
    if (inputData.data) {
      let dataSet = inputData.data.data.map(row => {
        return { key: row.name, text: row.name };
      });
      this.dataSet = dataSet;
    }
    if (data.options) {
      this.defaultSelectedKeys =
        data.options.selectedDs || this.dataSet.map(v => v.key);
    }
    if (moduleResponseData) {
      let historyData = moduleResponseData.find(
        row => row.dataType === dataTypes['ANLS_OUTLIER_DETECTING_OUTPUT']
      );
      if (
        historyData.data &&
        historyData.data.length &&
        this.defaultSelectedKeys.length !== 0
      ) {
        this.dropDownOptions = historyData.data.map(row => row.method);
        this.historyData = historyData.data[0];
        if (
          historyData.data.length &&
          historyData.data[0].method === 'IFOREST'
        ) {
          this.historyData = Object.assign({}, this.historyData, {
            data: this.historyData.multiDimensionResult
          });
          this.chartType = 'scatter';
        }
      } else {
        this.historyData = {
          data: [],
          time: []
        };
      }
    }
  }
  componentWillUpdate(nextProps, nextState) {
    const { moduleResponseData } = nextProps;
    const { selectedOption } = nextState;
    this.chartType = undefined;
    if (moduleResponseData) {
      let historyData = moduleResponseData.find(
        row => row.dataType === dataTypes['ANLS_OUTLIER_DETECTING_OUTPUT']
      );
      if (
        historyData.data &&
        historyData.data.length &&
        this.defaultSelectedKeys.length !== 0
      ) {
        let data = [];
        this.historyData = historyData.data[0];
        if (selectedOption) {
          this.historyData =
            historyData.data.find(row => row.method === selectedOption) || [];
        }
        if (historyData.data.length && this.historyData.method === 'IFOREST') {
          this.historyData = Object.assign({}, this.historyData, {
            data: this.historyData.multiDimensionResult
          });
          this.chartType = 'scatter';
        }
      } else {
        this.historyData = {
          data: [],
          time: []
        };
      }
    }
  }
  render() {
    const { data, moduleInputData, moduleResponseData, i18n } = this.props;
    const { selectedOption } = this.state;
    let options = data.options;
    let rangeChecked = false,
      minMaxDataChecked = false,
      quantileChecked = false,
      iforestChecked = false;
    let rangeData =
        (options.methods &&
          options.methods.find(row => row.type === 'RANGE')) ||
        {},
      minMaxData =
        (options.methods &&
          options.methods.find(row => row.type === 'MIN_MAX')) ||
        {},
      quantileData =
        (options.methods &&
          options.methods.find(row => row.type === 'QUANTILE')) ||
        {},
      iforestData =
        (options.methods &&
          options.methods.find(row => row.type === 'IFOREST')) ||
        {};
    if (JSON.stringify(rangeData) !== '{}') {
      rangeChecked = true;
    }
    if (JSON.stringify(minMaxData) !== '{}') {
      minMaxDataChecked = true;
    }
    if (JSON.stringify(quantileData) !== '{}') {
      quantileChecked = true;
    }
    if (JSON.stringify(iforestData) !== '{}') {
      iforestChecked = true;
    }
    let isShouldRemove = false;
    if (options.options && options.options.shouldRemoveOutliers === 1) {
      isShouldRemove = true;
    }
    return (
      <div className={s['OutlierDetectionWrap']}>
        <div className={s['slider']}>
          <div className={s['panelTitle']}>
            <span>
              {i18n.MODULE_NAME}{' '}
              <UnknownTooltip content={i18n.ANNOTATION_MODULE_NAME} />
            </span>
          </div>
          <div className={s['methodWrap']}>
            <h3>{i18n.METHOD}</h3>
            <div>
              <div>
                <div className={s['checkboxWrap'] + ' clear-both'}>
                  <Checkbox
                    className={s['checkbox']}
                    label={i18n.RANGE}
                    checked={rangeChecked}
                    onChange={this._changeCheckBox.bind(this, 'RANGE')}
                  />
                </div>
                <div className={s['labelInputWrap']}>
                  <div className={s['labelInput']}>
                    <label>
                      {i18n.THRESHOLD_VALUE}{' '}
                      <UnknownTooltip
                        content={i18n.ANNOTATION_THRESHOLD_VALUE}
                      />
                    </label>
                    <input
                      name="RANGE_thresh"
                      disabled={rangeChecked ? false : true}
                      value={
                        rangeChecked &&
                        (this.state['RANGE_thresh'] ||
                          this.state['RANGE_thresh'] === '')
                          ? this.state['RANGE_thresh']
                          : rangeData.thresh ? rangeData.thresh : ''
                      }
                      onBlur={this._changeValue.bind(this)}
                      onKeyUp={this._onKeyUp.bind(this)}
                      onChange={this._changeInput.bind(this)}
                    />
                  </div>
                  <div className={s['labelInput']}>
                    <label>
                      {i18n.MEASUREMENT}{' '}
                      <UnknownTooltip content={i18n.ANNOTATION_MEASUREMENT} />
                    </label>
                    <Dropdown
                      placeHolder={i18n.SELECT_MEASUREMENT}
                      name="RANGE_meassure"
                      selectedKey={rangeChecked && rangeData.meassure}
                      options={[
                        { key: 'abs', text: 'abs' },
                        { key: 'percentage', text: 'percentage' }
                      ]}
                      onChanged={this._changeDropDown.bind(
                        this,
                        'RANGE_meassure'
                      )}
                      disabled={rangeChecked ? false : true}
                    />
                  </div>
                </div>
              </div>
              <div>
                <div className={s['checkboxWrap'] + ' clear-both'}>
                  <Checkbox
                    className={s['checkbox']}
                    label={i18n.BOUND}
                    checked={minMaxDataChecked}
                    onChange={this._changeCheckBox.bind(this, 'MIN_MAX')}
                  />
                  <UnknownTooltip content={i18n.ANNOTATION_BOUND} />
                </div>
                <div className={s['labelInputWrap']}>
                  <div className={s['labelInput']}>
                    <label>Min</label>
                    <input
                      name="MIN_MAX_min"
                      value={
                        minMaxDataChecked &&
                        (this.state['MIN_MAX_min'] ||
                          this.state['MIN_MAX_min'] === '')
                          ? this.state['MIN_MAX_min']
                          : minMaxData.min ? minMaxData.min : ''
                      }
                      disabled={minMaxDataChecked ? false : true}
                      onBlur={this._changeValue.bind(this)}
                      onKeyUp={this._onKeyUp.bind(this)}
                      onChange={this._changeInput.bind(this)}
                    />
                  </div>
                  <div className={s['labelInput']}>
                    <label>Max</label>
                    <input
                      name="MIN_MAX_max"
                      value={
                        minMaxDataChecked &&
                        (this.state['MIN_MAX_max'] ||
                          this.state['MIN_MAX_max'] === '')
                          ? this.state['MIN_MAX_max']
                          : minMaxData.max ? minMaxData.max : ''
                      }
                      disabled={minMaxDataChecked ? false : true}
                      onBlur={this._changeValue.bind(this)}
                      onKeyUp={this._onKeyUp.bind(this)}
                      onChange={this._changeInput.bind(this)}
                    />
                  </div>
                </div>
              </div>
              <div>
                <div className={s['checkboxWrap'] + ' clear-both'}>
                  <Checkbox
                    className={s['checkbox']}
                    label={i18n.FRACTILE}
                    checked={quantileChecked}
                    onChange={this._changeCheckBox.bind(this, 'QUANTILE')}
                  />
                </div>
                <div className={s['labelInputWrap']}>
                  <div className={s['labelInput']}>
                    <label>{i18n.SPECIFIED_DOT}</label>
                    <input
                      name="QUANTILE_q"
                      value={
                        quantileChecked &&
                        (this.state['QUANTILE_q'] ||
                          this.state['QUANTILE_q'] === '')
                          ? this.state['QUANTILE_q']
                          : quantileData.q ? quantileData.q : ''
                      }
                      disabled={quantileChecked ? false : true}
                      onBlur={this._changeValue.bind(this)}
                      onKeyUp={this._onKeyUp.bind(this)}
                      onChange={this._changeInput.bind(this)}
                    />
                  </div>
                </div>
              </div>
              <div>
                <div className={s['checkboxWrap'] + ' clear-both'}>
                  <Checkbox
                    className={s['checkbox']}
                    label="IFOREST"
                    checked={iforestChecked}
                    onChange={this._changeCheckBox.bind(this, 'IFOREST')}
                  />
                </div>
                <div className={s['labelInputWrap']}>
                  <div className={s['labelInput']}>
                    <label>
                      {i18n.CONTAMINATION_RATE}
                      <UnknownTooltip
                        content={i18n.ANNOTATION_CONTAMINATION_RATE}
                      />
                    </label>
                    <input
                      name="IFOREST_contamination"
                      value={
                        iforestChecked &&
                        (this.state['IFOREST_contamination'] ||
                          this.state['IFOREST_contamination'] === '')
                          ? this.state['IFOREST_contamination']
                          : iforestData.contamination
                            ? iforestData.contamination
                            : ''
                      }
                      disabled={iforestChecked ? false : true}
                      onBlur={this._changeValue.bind(this)}
                      onKeyUp={this._onKeyUp.bind(this)}
                      onChange={this._changeInput.bind(this)}
                    />
                  </div>
                  <div className={s['labelInput']}>
                    <label>
                      {i18n.MARKER_ALGORITHM}
                      <UnknownTooltip
                        content={i18n.ANNOTATION_MARKER_ALGORITHM}
                      />
                    </label>
                    <Dropdown
                      placeHolder={i18n.SELECT_MARKER_ALGORITHM}
                      name="IFOREST_labeling"
                      selectedKey={iforestChecked && iforestData.labeling}
                      options={[
                        { key: 'default', text: 'default' },
                        { key: 'iqr', text: 'iqr' },
                        { key: 'mad', text: 'mad' },
                        { key: 'cart', text: 'cart' }
                      ]}
                      onChanged={this._changeDropDown.bind(
                        this,
                        'IFOREST_labeling'
                      )}
                      disabled={iforestChecked ? false : true}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={s['optionWrap']}>
            <h3>{i18n.CONFIGURATION}</h3>
            <div>
              <Checkbox
                label={i18n.DELET_OUTLIER}
                className={s['checkbox']}
                name="shouldRemoveOutliers"
                checked={isShouldRemove}
                onChange={this._changeCheckBox.bind(
                  this,
                  'shouldRemoveOutliers'
                )}
              />
            </div>
          </div>
          <div className={s['datasetWrap']}>
            <DataSetComponent
              title={i18n.DATA_SET}
              items={this.dataSet}
              onSelect={this._selectedItem}
              isRadio={false}
              selectedKeys={this.defaultSelectedKeys}
            />
          </div>
        </div>
        <div className={s['rightCtn']}>
          <ChangeTypeRenderChart
            options={this.dropDownOptions}
            data={this.historyData}
            type="OUTLIERS"
            selectedOption={selectedOption || this.dropDownOptions[0]}
            onSelect={this._changeOption}
            chartType={this.chartType}
          />
        </div>
      </div>
    );
  }
  _selectedItem(items) {
    const { data } = this.props;
    let newData = Object.assign({}, data.options, {
      selectedDs: items
    });
    this.updateModule(newData);
    this.defaultSelectedKeys = newData;
  }
  _changeCheckBox(name, e) {
    const { data } = this.props;
    const { selectedOption } = this.state;
    let newSelectedOption;
    let options = data.options;
    let newData;
    let checked = e.currentTarget.checked;
    if (name === 'shouldRemoveOutliers') {
      newData = Object.assign({}, options, {
        options: {
          shouldRemoveOutliers: checked ? 0 : 1
        }
      });
    } else {
      let newMethods = options.methods ? options.methods.concat([]) : [];
      if (!checked) {
        let object = {};
        switch (name) {
          case 'RANGE':
            object = {
              type: 'RANGE',
              thresh: 10,
              meassure: 'abs'
            };
            break;
          case 'MIN_MAX':
            object = {
              type: 'MIN_MAX',
              min: 10,
              max: 100
            };
            break;
          case 'QUANTILE':
            object = {
              type: 'QUANTILE',
              q: 25
            };
            break;
          case 'IFOREST':
            object = {
              type: 'IFOREST',
              contamination: '',
              labeling: 'default'
            };
            break;
        }
        newMethods = newMethods.concat(object);
        newSelectedOption = name;
      } else {
        newMethods = newMethods.filter(row => row.type !== name);
        newSelectedOption = newMethods.length && newMethods[0].type;
      }
      newData = Object.assign({}, options, {
        methods: newMethods
      });
    }
    this.updateModule(newData);
    this.setState({
      selectedOption: newSelectedOption
    });
  }
  _changeDropDown(nameStr, item) {
    const { data } = this.props;
    let options = data.options;
    let value = item.key;
    let index = nameStr.lastIndexOf('_');
    let typeName = nameStr.substr(0, index);
    let name = nameStr.substr(index + 1, nameStr.length);
    if (options.methods && options.methods.length) {
      let newMethods = options.methods.map(row => {
        if (row.type === typeName) {
          row = Object.assign({}, row, {
            [name]: value
          });
        }
        return row;
      });
      let newData = Object.assign({}, options, {
        methods: newMethods
      });
      this.updateModule(newData);
    }
  }
  _changeValue(item) {
    const { data } = this.props;
    let options = data.options;
    let nameStr = item.target.name;
    let value = item.target.value !== '' ? Number(item.target.value) : '';
    let index = nameStr.lastIndexOf('_');
    let typeName = nameStr.substr(0, index);
    let name = nameStr.substr(index + 1, nameStr.length);
    if (options.methods && options.methods.length) {
      let newMethods = options.methods.map(row => {
        if (row.type === typeName) {
          row = Object.assign({}, row, {
            [name]: value
          });
        }
        return row;
      });
      let newData = Object.assign({}, options, {
        methods: newMethods
      });
      this.updateModule(newData);
    }
  }
  _onKeyUp(e) {
    if (e.key == 'Enter') {
      this._changeValue(e);
    }
  }
  _changeOption(item) {
    this.setState({
      selectedOption: item.key
    });
  }
  _changeInput(e) {
    let name = e.target.name;
    let value = e.target.value;
    this.setState({
      [name]: value
    });
  }
  updateModule(newData) {
    const { data } = this.props;
    let url = ['options'];
    let propsData = data.setIn(url, newData);
    this.props.updateModule(propsData);
  }
}

OutlierDetectionPanel.propTypes = {};

export default OutlierDetectionPanel;
