/**
 * 聚类
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';

import { dataTypes } from '@beopcloud/StrategyV2-Engine/src/enum';
import DataSetComponent from '../DataSetComponent';
import ChangeTypeRenderChart from '../../../components/ChangeTypeRenderChart';
import UnknownTooltip from '../../../components/UnknownTooltip';

import s from './ClusteringPanel.css';

class CheckNav extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      DB_SCAN_showInput: true,
      K_MEAN_showInput: true
    };
  }
  render() {
    const { DB_SCAN_showInput, K_MEAN_showInput } = this.state;
    const { options, i18n } = this.props;
    let DB_SCAN_Checked = false,
      K_MEAN_Checked = false;
    let DB_SCAN_Data =
      (options.methods &&
        options.methods.find(row => row.type === 'DB-SCAN')) ||
      {};
    let K_MEAN_Data =
      (options.methods && options.methods.find(row => row.type === 'K-MEAN')) ||
      {};
    if (JSON.stringify(DB_SCAN_Data) !== '{}') {
      DB_SCAN_Checked = true;
    }
    if (JSON.stringify(K_MEAN_Data) !== '{}') {
      K_MEAN_Checked = true;
    }
    return (
      <ul>
        <li className={s['item']}>
          <div className={s['checkboxWrap']}>
            <Checkbox
              className={s['checkbox']}
              label={'DB-SCAN'}
              checked={DB_SCAN_Checked}
              onChange={this._changeCheckBox.bind(this, 'DB-SCAN')}
            />
            <UnknownTooltip content={i18n.ANNOTATION_DB_SCAN} />
            <div className={s['arrowWrap']}>
              <i
                className={`ms-Icon ms-Icon--${
                  DB_SCAN_showInput ? 'ChevronDown' : 'ChevronUp'
                }`}
                onClick={this._shouldShowInput.bind(this, 'DB_SCAN_showInput')}
              />
            </div>
          </div>
          <div
            style={
              DB_SCAN_showInput ? { display: 'block' } : { display: 'none' }
            }
          >
            <div className={s['inputWrap']}>
              <label>
                eps <UnknownTooltip content={i18n.ANNOTATION_EPS} />
              </label>
              <input
                disabled={DB_SCAN_Checked ? false : true}
                value={
                  DB_SCAN_Checked &&
                  (this.state['DB-SCAN>eps'] ||
                    this.state['DB-SCAN>eps'] === '')
                    ? this.state['DB-SCAN>eps']
                    : DB_SCAN_Data.eps ? DB_SCAN_Data.eps : ''
                }
                name="DB-SCAN>eps"
                onBlur={this._changeValue.bind(this)}
                onChange={this._changeInput.bind(this)}
                onKeyUp={this._onKeyUp.bind(this)}
              />
            </div>
            <div className={s['inputWrap']}>
              <label>
                min_samples{' '}
                <UnknownTooltip content={i18n.ANNOTATION_MIN_SAMPLES} />
              </label>
              <input
                disabled={DB_SCAN_Checked ? false : true}
                value={
                  DB_SCAN_Checked &&
                  (this.state['DB-SCAN>min_samples'] ||
                    this.state['DB-SCAN>min_samples'] === '')
                    ? this.state['DB-SCAN>min_samples']
                    : DB_SCAN_Data.min_samples ? DB_SCAN_Data.min_samples : ''
                }
                name="DB-SCAN>min_samples"
                onBlur={this._changeValue.bind(this)}
                onChange={this._changeInput.bind(this)}
                onKeyUp={this._onKeyUp.bind(this)}
              />
            </div>
          </div>
        </li>
        <li className={s['item']}>
          <div className={s['checkboxWrap']}>
            <Checkbox
              className={s['checkbox']}
              label={'K-MEAN'}
              checked={K_MEAN_Checked}
              onChange={this._changeCheckBox.bind(this, 'K-MEAN')}
            />
            <UnknownTooltip content={i18n.ANNOTATION_K_MEAN} />
            <div className={s['arrowWrap']}>
              <i
                className={`ms-Icon ms-Icon--${
                  K_MEAN_showInput ? 'ChevronDown' : 'ChevronUp'
                }`}
                onClick={this._shouldShowInput.bind(this, 'K_MEAN_showInput')}
              />
            </div>
          </div>
          <div
            style={
              K_MEAN_showInput ? { display: 'block' } : { display: 'none' }
            }
          >
            <div className={s['inputWrap']}>
              <label>
                n_clusters{' '}
                <UnknownTooltip content={i18n.ANNOTATION_N_CLUSTERS} />
              </label>
              <input
                disabled={K_MEAN_Checked ? false : true}
                value={
                  K_MEAN_Checked &&
                  (this.state['K-MEAN>n_clusters'] ||
                    this.state['K-MEAN>n_clusters'] === '')
                    ? this.state['K-MEAN>n_clusters']
                    : K_MEAN_Data.n_clusters ? K_MEAN_Data.n_clusters : ''
                }
                name="K-MEAN>n_clusters"
                onBlur={this._changeValue.bind(this)}
                onChange={this._changeInput.bind(this)}
                onKeyUp={this._onKeyUp.bind(this)}
              />
            </div>
          </div>
        </li>
      </ul>
    );
  }
  _shouldShowInput(labelName) {
    this.setState({
      [labelName]: this.state[labelName] ? false : true
    });
  }
  _changeCheckBox(name, e) {
    let options = this.props.options;
    let newData, newSelectedOption;
    let checked = e.currentTarget.checked;
    let newMethods = options.methods ? options.methods.concat([]) : [];
    if (!checked) {
      let object = {};
      switch (name) {
        case 'DB-SCAN':
          object = {
            type: 'DB-SCAN',
            eps: 1.5,
            min_samples: 12
          };
          break;
        case 'K-MEAN':
          object = {
            type: 'K-MEAN',
            n_clusters: 3
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
    this.props.updateModule(newData);
    this.props._changeOption(newSelectedOption);
  }
  _changeValue(item) {
    let options = this.props.options;
    let nameStr = item.target.name;
    let value = item.target.value === '' ? '' : Number(item.target.value);
    let index = nameStr.lastIndexOf('>');
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
      this.props.updateModule(newData);
    }
  }
  _onKeyUp(ev) {
    if (ev.key == 'Enter') {
      this._changeValue(ev);
    }
  }
  _changeInput(e) {
    let name = e.target.name;
    let value = e.target.value;
    this.setState({
      [name]: value
    });
  }
}
class ClusteringPanel extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this.dataSet = [];
    this.responseResult = {
      data: []
    };
    this.toolTipData = [];
    this.dropDownList = [];
    this.defaultSelectedKeys = [];
    this.updateModule = this.updateModule.bind(this);
    this._selectedItem = this._selectedItem.bind(this);
    this._changeOption = this._changeOption.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    const { data, moduleInputData, moduleResponseData } = nextProps;
    let inputData = moduleInputData.find(
      row => row.dataType === dataTypes['DS_HIS_OUTPUT']
    );
    if (inputData.data) {
      this.toolTipData = inputData.data.data;
      let dataSet = inputData.data.data.map(row => {
        return { key: row.name, text: row.name };
      });
      this.dataSet = dataSet;
      if (data.options) {
        this.defaultSelectedKeys =
          data.options.selectedDs || this.dataSet.map(v => v.key);
      }
    }
  }
  componentWillUpdate(nextProps, nextState) {
    const { data, moduleInputData, moduleResponseData } = nextProps;

    if (moduleResponseData) {
      let responseData = moduleResponseData.find(
        row => row.dataType === dataTypes['ANLS_CLUSTERING_OUTPUT']
      );
      if (responseData.data && responseData.data.length) {
        this.responseResult = responseData.data[0];
        if (data.options.methods) {
          this.dropDownList = data.options.methods.map(row => row.type);
        } else {
          this.dropDownList = responseData.data.map(row => row.method);
        }
      }
    }
  }
  render() {
    const { data, moduleInputData, moduleResponseData, i18n } = this.props;
    const { selectedOption } = this.state;
    let options = data.options || {};
    if (moduleResponseData) {
      let responseData = moduleResponseData.find(
        row => row.dataType === dataTypes['ANLS_CLUSTERING_OUTPUT']
      );
      if (
        responseData.data &&
        responseData.data.length &&
        this.defaultSelectedKeys.length !== 0
      ) {
        if (selectedOption) {
          this.responseResult = responseData.data.find(
            row => row.method === selectedOption
          );
          this.responseResult = this.responseResult
            ? this.responseResult
            : responseData.data[0] || {
                data: []
              };
        }
      } else {
        this.responseResult = {
          data: []
        };
      }
    }
    return (
      <div className={s['clusteringWrap'] + ' ' + s['clear']}>
        <div className={s['left']}>
          <div className={s['title']}>
            <span>{i18n.MODULE_NAME}</span>
          </div>
          <div className={s['mWrap']}>
            <h3>{i18n.METHOD}</h3>
            <CheckNav
              options={options}
              updateModule={this.updateModule}
              _changeOption={this._changeOption}
              i18n={i18n}
            />
          </div>
          <div className={s['bWrap']}>
            <DataSetComponent
              title={i18n.DATA_SET}
              items={this.dataSet}
              onSelect={this._selectedItem}
              isRadio={false}
              selectedKeys={this.defaultSelectedKeys}
            />
          </div>
        </div>
        <div className={s['showDataCtn']}>
          <ChangeTypeRenderChart
            data={this.responseResult}
            toolTipData={this.toolTipData}
            chartType="scatter"
            onSelect={this._changeOption}
            options={this.dropDownList}
            selectedOption={selectedOption || this.dropDownList[0]}
          />
        </div>
      </div>
    );
  }
  updateModule(newData) {
    const { data } = this.props;
    let url = ['options'];
    let propsData = data.setIn(url, newData);
    this.props.updateModule(propsData);
  }
  _selectedItem(items) {
    const { data } = this.props;
    let newData = Object.assign({}, data.options, {
      selectedDs: items
    });
    this.updateModule(newData);
    this.defaultSelectedKeys = newData;
  }
  _changeOption(item) {
    this.setState({
      selectedOption: item.key ? item.key : item
    });
  }
}

ClusteringPanel.propTypes = {};

export default ClusteringPanel;
