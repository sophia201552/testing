/**
 * 特征选择
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { Dropdown } from 'office-ui-fabric-react/lib/Dropdown';

import { moduleTypes, dataTypes } from '@beopcloud/StrategyV2-Engine/src/enum';

import DataSetComponent from '../DataSetComponent';
import ShowDataChart from '../../../components/ShowDataChart';
import UnknownTooltip from '../../../components/UnknownTooltip';

import s from './FeatureSelectionPanel.css';
const css = (className1, className2 = '') => {
  return className1
    .split(' ')
    .map(v => s[v])
    .concat(className2.split(' '))
    .join(' ')
    .trim();
};

class FeatureSelectionPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataset: [],
      spinner: false
    };
    this._onChangeMethod = this._onChangeMethod.bind(this);
    this._onCheckboxChange = this._onCheckboxChange.bind(this);
    this._onChangeDataSet = this._onChangeDataSet.bind(this);
    this.options = [
      {
        key: 'f_classif',
        text: props.i18n.SELECT_F_CLASSIF
      },
      {
        key: 'chi2',
        text: props.i18n.SELECT_CHI1
      },
      {
        key: 'f_regression',
        text: props.i18n.SELECT_F_REGRESSION
      }
    ];
  }
  componentDidMount() {
    this.componentWillReceiveProps(this.props);
  }
  componentWillReceiveProps(nextProps) {
    const { moduleInputData } = nextProps;
    let { dataset } = this.state;
    let datasetItems = this._getDatasetItems(nextProps);
    this.setState({
      dataset: datasetItems.map(v => v.key)
    });
  }
  render() {
    const { dataset } = this.state;
    const { data, updateModule, moduleInputData, i18n } = this.props;
    let ds_history_output = moduleInputData.find(
        v => v.dataType == dataTypes.DS_HIS_OUTPUT
      ) || { data: false },
      hisData = ds_history_output.data || { data: [], time: [] };
    let nameOptions = [];
    hisData.data.forEach(v => {
      nameOptions.push({ key: v.name, text: v.name });
    });
    let VARIANCE = data.options.methods.find(v => v.type == 'VARIANCE'),
      KBEST = data.options.methods.find(v => v.type == 'KBEST'),
      PERCENTILEBEST = data.options.methods.find(
        v => v.type == 'PERCENTILEBEST'
      );
    return (
      <div className={css('FeatureSelectionPanel clear')}>
        <div className={css('left-panel fl')}>
          <div className={css('title')}>{i18n.MODULE_NAME}</div>
          <div className={css('methodsWrap')}>
            <div className={css('title')}>{i18n.METHOD}</div>
            <div className={css('contentWrap')}>
              <div className={css('item ')}>
                <div className={css('checkboxWrap clear')}>
                  <Checkbox
                    label={i18n.VARIANCE}
                    className={s['checkbox']}
                    onChange={this._onCheckboxChange.bind(this, 'VARIANCE')}
                    ariaDescribedBy={'descriptionID'}
                    checked={
                      data.options.options.selectedTypes.indexOf('VARIANCE') >
                      -1
                    }
                  />
                  <UnknownTooltip content={i18n.ANNOTATION_VARIANCE} />
                </div>
                <div className={css('inputWrap')}>
                  <TextField
                    onRenderLabel={() => {
                      return (
                        <div className={css('labelWrap')}>
                          <span>{i18n.VARIANCE_THRESHOLD}</span>
                          <UnknownTooltip
                            content={i18n.ANNOTATION_VARIANCE_THRESHOLD}
                          />
                        </div>
                      );
                    }}
                    value={VARIANCE.thresh}
                    onBlur={this._onBlur.bind(this, 'VARIANCE', 'thresh')}
                    onKeyUp={this._onKeyUp.bind(this, 'VARIANCE', 'thresh')}
                  />
                </div>
              </div>
              <div className={css('item clear')}>
                <Checkbox
                  label={i18n.FEATURE_NUMBER}
                  className={s['checkbox']}
                  onChange={this._onCheckboxChange.bind(this, 'KBEST')}
                  ariaDescribedBy={'descriptionID'}
                  checked={
                    data.options.options.selectedTypes.indexOf('KBEST') > -1
                  }
                />

                <div className={css('inputWrap')}>
                  <TextField
                    value={KBEST.k}
                    onBlur={this._onBlur.bind(this, 'KBEST', 'k')}
                    onKeyUp={this._onKeyUp.bind(this, 'KBEST', 'k')}
                    onRenderLabel={() => {
                      return (
                        <div className={css('labelWrap')}>
                          <span>{i18n.SELECT_THE_NUMBER_OF}</span>
                          <UnknownTooltip
                            content={i18n.ANNOTATION_DEPENDENT_VARIABLE}
                          />
                        </div>
                      );
                    }}
                  />
                  <label className={css('labelWrap')}>
                    {i18n.DEPENDENT_VARIABLE}
                    <UnknownTooltip
                      content={i18n.ANNOTATION_DEPENDENT_VARIABLE}
                    />
                  </label>
                  <Dropdown
                    ariaLabel="y"
                    options={nameOptions}
                    onChanged={v => {
                      this._onChangeMethod('KBEST', 'y', v.key);
                    }}
                    selectedKey={KBEST.y}
                  />
                  <label className={css('labelWrap')}>
                    {i18n.EVALUATION_FUNCTION}
                    <UnknownTooltip
                      content={i18n.ANNOTATION_EVALUATION_FUNCTION}
                    />
                  </label>
                  <Dropdown
                    ariaLabel="score_func"
                    options={this.options}
                    onChanged={v => {
                      this._onChangeMethod('KBEST', 'score_func', v.key);
                    }}
                    selectedKey={KBEST.score_func}
                  />
                </div>
              </div>
              <div className={css('item')}>
                <Checkbox
                  label={i18n.PERCENTAGE_OF_FEATURES}
                  className={s['checkbox']}
                  onChange={this._onCheckboxChange.bind(this, 'PERCENTILEBEST')}
                  ariaDescribedBy={'descriptionID'}
                  checked={
                    data.options.options.selectedTypes.indexOf(
                      'PERCENTILEBEST'
                    ) > -1
                  }
                />
                <div className={css('inputWrap')}>
                  <TextField
                    label={i18n.PERCENTAGE}
                    value={PERCENTILEBEST.percentile}
                    onBlur={this._onBlur.bind(
                      this,
                      'PERCENTILEBEST',
                      'percentile'
                    )}
                    onKeyUp={this._onKeyUp.bind(
                      this,
                      'PERCENTILEBEST',
                      'percentile'
                    )}
                  />
                  <Dropdown
                    label={i18n.DEPENDENT_VARIABLE}
                    ariaLabel="y"
                    options={nameOptions}
                    onChanged={v => {
                      this._onChangeMethod('PERCENTILEBEST', 'y', v.key);
                    }}
                    selectedKey={PERCENTILEBEST.y}
                  />
                  <Dropdown
                    label={i18n.EVALUATION_FUNCTION}
                    ariaLabel="score_func"
                    options={this.options}
                    onChanged={v => {
                      this._onChangeMethod(
                        'PERCENTILEBEST',
                        'score_func',
                        v.key
                      );
                    }}
                    selectedKey={PERCENTILEBEST.score_func}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className={css('datasetWrap')}>
            <DataSetComponent
              title={i18n.DATA_SET}
              items={this._getDatasetItems()}
              isRadio={false}
              onSelect={this._onChangeDataSet.bind(this)}
              selectedKeys={dataset}
            />
          </div>
        </div>
        <div className={css('right-panel fr')}>
          <div className={css('right-panel-top')}>
            <ShowDataChart data={hisData} />
          </div>
          <div className={css('right-panel-bottom')}>{this._createTable()}</div>
        </div>
      </div>
    );
  }
  _createTable() {
    const { data, moduleInputData, moduleResponseData = [], i18n } = this.props;
    let VARIANCE = data.options.methods.find(v => v.type == 'VARIANCE'),
      KBEST = data.options.methods.find(v => v.type == 'KBEST'),
      PERCENTILEBEST = data.options.methods.find(
        v => v.type == 'PERCENTILEBEST'
      );
    let { dataset } = this.state;
    const paramsMap = {
      VARIANCE: {
        selected: i18n.IS_SELECTED,
        variance: i18n.VARIANCE
      },
      KBEST: {
        selected: i18n.IS_SELECTED,
        score: i18n.SCORT,
        pvalue: i18n.P_VALUE
      },
      PERCENTILEBEST: {
        selected: i18n.IS_SELECTED,
        score: i18n.SCORT,
        pvalue: i18n.P_VALUE
      }
    };
    let anls_feature_selection_output = moduleResponseData.find(
        v => v.dataType == dataTypes.ANLS_FEATURE_SELECTION_OUTPUT
      ) || { data: false },
      fsData = anls_feature_selection_output.data || [];
    let ds_opt = moduleInputData.find(v => v.dataType == dataTypes.DS_OPT) || {
        data: false
      },
      dsData = ds_opt.data || [];

    const thAnnotation = {
      VARIANCE: i18n.VARIANCE,
      KBEST: i18n.ANNOTATION_KBEST,
      PERCENTILEBEST: i18n.ANNOTATION_PERCENTIEBEST
    };
    let methodsThs = [],
      paramsThs = [],
      tbodyTrs = [],
      dsTdsMap = {};
    data.options.options.selectedTypes.forEach((v, i) => {
      let fs = fsData.find(f => f.method == v) || { data: [] };
      dataset.forEach(ds => {
        dsTdsMap[ds] = dsTdsMap[ds] || [];
        let data = fs.data.find(f => f.name == ds) || { params: {} };
        Object.keys(paramsMap[v]).forEach((p, pi) => {
          if (p == 'selected') {
            let isSelected = data.params[p] ? true : false;
            dsTdsMap[ds].push(
              <div key={`${v}_${ds}_${p}_${pi}`} className={css('td bd-l')}>
                <span className={isSelected ? css('green') : css('red')}>
                  {isSelected ? '√' : 'X'}
                </span>
              </div>
            );
          } else {
            dsTdsMap[ds].push(
              <div key={`${v}_${ds}_${p}_${pi}`} className={css('td')}>
                {data.params[p] == undefined
                  ? ''
                  : typeof data.params[p] == 'number'
                    ? data.params[p].toFixed(2)
                    : data.params[p]}
              </div>
            );
          }
        });
      });
      methodsThs.push(
        <div
          key={`method_${i}`}
          className={css(`th col-${Object.keys(paramsMap[v]).length} bd-l`)}
        >
          {v} <UnknownTooltip content={thAnnotation[v]} />
        </div>
      );
      Object.keys(paramsMap[v]).forEach((p, pi) => {
        paramsThs.push(
          <div
            key={`params_${i}_${pi}`}
            className={css(`th ${p == 'selected' ? 'bd-l' : ''}`)}
          >
            {paramsMap[v][p]}
          </div>
        );
      });
    });
    dataset.forEach((ds, i) => {
      tbodyTrs.push(
        <div
          key={`tr_${i}`}
          className={css(
            `tr ${ds == KBEST.y || ds == PERCENTILEBEST.y ? 'bgLight' : ''}`
          )}
        >
          <div className={css('td')}>{ds}</div>
          {dsTdsMap[ds]}
        </div>
      );
    });
    let width = 120;
    Object.keys(paramsMap)
      .filter(v => data.options.options.selectedTypes.indexOf(v) > -1)
      .forEach(v => {
        width += Object.keys(paramsMap[v]).length * 120;
      });
    width += 'px';
    return (
      <div className={css('tableWrap')}>
        <div
          style={{
            width: width
          }}
          className={css('thead')}
        >
          <div className={css('tr clear')}>
            <div className={css('th')}>{i18n.FEATURE_WAYS}</div>
            {methodsThs}
          </div>
          <div className={css('tr clear')}>
            <div className={css('th')}>{i18n.FEATURE_RESULT}</div>
            {paramsThs}
          </div>
        </div>
        <div
          style={{
            width: width
          }}
          className={css('tbody')}
        >
          {tbodyTrs}
        </div>
      </div>
    );
  }
  _getDatasetItems(props) {
    const { moduleInputData } = props || this.props;
    let ds_opt = moduleInputData.find(
        v => v.dataType == dataTypes.DS_HIS_OUTPUT
      ) || {
        data: false
      },
      dsData = (ds_opt.data && ds_opt.data.data) || [];
    let items = [];
    dsData.forEach(v => {
      items.push({
        key: v.name,
        text: v.name
      });
    });
    return items;
  }
  _onCheckboxChange(key, e, isSelected) {
    const { data, updateModule } = this.props;
    let set = new Set(data.options.options.selectedTypes);
    if (isSelected) {
      set.add(key);
    } else {
      set.delete(key);
    }
    updateModule(
      data.setIn(['options', 'options', 'selectedTypes'], Array.from(set))
    );
  }
  _onBlur(args1, args2, e) {
    let value = Number(e.target.value);
    this._onChangeMethod(args1, args2, value);
  }
  _onKeyUp(args1, args2, e) {
    if (e.key === 'Enter') {
      this._onBlur(args1, args2, e);
    }
  }
  _onChangeMethod(key1, key2, v) {
    const { data, updateModule } = this.props;
    updateModule(
      data.setIn(
        ['options', 'methods'],
        data.options.methods.flatMap(function(method) {
          if (method.type === key1) {
            return method.set(key2, v);
          } else {
            return method;
          }
        })
      )
    );
  }
  _onChangeDataSet(dataset) {
    this.setState({
      dataset
    });
  }
}
export default FeatureSelectionPanel;
