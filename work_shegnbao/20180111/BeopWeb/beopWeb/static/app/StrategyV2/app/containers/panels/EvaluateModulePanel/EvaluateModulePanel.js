import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import ReactEcharts from 'echarts-for-react';
import * as moment from 'moment';
import { moduleTypes, dataTypes } from '@beopcloud/StrategyV2-Engine/src/enum';
import DataSetComponent from '../DataSetComponent';
import HistoryChartConfig from '../HistoryChartConfigModal';
import s from './EvaluateModulePanel.css';
const css = (className1, className2 = '') => {
  return className1
    .split(' ')
    .map(v => s[v])
    .concat(className2.split(' '))
    .join(' ')
    .trim();
};

class EvaluateModulePanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = { dataset: [] };
    this._onChangeDataSet = this._onChangeDataSet.bind(this);
    this._setChartCondition = this._setChartCondition.bind(this);
  }
  componentDidMount() {}
  componentDidUpdate() {}
  componentWillUnmount() {}
  componentWillReceiveProps(nextProps) {}
  render() {
    const {
      data,
      moduleInputData,
      moduleResponseData = [],
      i18n
    } = this.props;
    const keyMap = {
      'mean_squared_error':i18n.SQUARE_ERROR,
      'mean_absolute_error':i18n.ABSOLUTE_ERROR,
      'r2_score':'r2_score'
    };
    const { dataset } = this.state;
   
    let anls_svm_output = moduleInputData.find(
        input => input.dataType == dataTypes.ANLS_SVM_OUTPUT
      ) || { data: false },
      anlsSvmOutputData = anls_svm_output.data;
    let SVROption = this._getSVROption(this.props);
    return (
      <div className={css('EvaluateModulePanel clear')}>
        <div className={css('left-panel fl')}>
          <div className={css('title')}>{i18n.MODULE_NAME}</div>
          <div className={css('methodsWrap')}>
            <div className={css('title')}>{i18n.TIME}</div>
            <div className={css('item')}>
              <HistoryChartConfig
                chartCondition={data.options.timeConfig}
                changeCondition={this._setChartCondition}
              />
            </div>
            <div className={css('title')}>{i18n.METHOD}</div>
            {anlsSvmOutputData ? (
              <div className={css('item')}>
                <Checkbox
                  label="SVR"
                  className={s['checkbox']}
                  onChange={this._onCheckboxChange.bind(
                    this,
                    dataTypes['ANLS_SVM_OUTPUT']
                  )}
                  ariaDescribedBy={'descriptionID'}
                  checked={
                    data.options.selectedMethods.indexOf(
                      dataTypes['ANLS_SVM_OUTPUT']
                    ) > -1
                  }
                />
              </div>
            ) : null}
          </div>
          {/* <div className={css('datasetWrap')}>
            <DataSetComponent
              title={'���ݼ�'}
              items={this._getDatasetItems()}
              isRadio={false}
              onSelect={this._onChangeDataSet.bind(this)}
              selectedKeys={dataset}
            />
          </div> */}
        </div>
        <div className={css('right-panel fr')}>
          {new Set(data.options.selectedMethods).has(
            dataTypes['ANLS_SVM_OUTPUT']
          ) && SVROption.chart ? (
            <div className={css('item clear', 'ms-fadeIn100')}>
              <div className={css('chartWrap fl')}>
                <ReactEcharts
                  option={SVROption.chart}
                  style={{ height: '100%', width: '100%' }}
                  className="react_for_echarts"
                  notMerge={true}
                />
              </div>
              <div className={css('infoWrap fl clear')}>
                {Object.keys(SVROption.evaluation).map(key=>(<div key={key} className={css('info fl')}>
                  <label
                    className={css('infoTitle')}
                  >
                    {keyMap[key]}
                  </label>
                  <label
                    className={css('infoValue')}
                  >
                    {SVROption.evaluation[key]}
                  </label>
                </div>))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
  _getDatasetItems() {
    const { moduleInputData } = this.props;
    let ds_opt = moduleInputData.find(v => v.dataType == dataTypes.DS_HIS_OUTPUT) || {
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
  _onChangeDataSet(dataset) {
    this.setState({
      dataset
    });
  }
  _onCheckboxChange(key) {
    const { data, updateModule } = this.props;
    let set = new Set(data.options.selectedMethods);
    if (set.has(key)) {
      set.delete(key);
    } else {
      set.add(key);
    }
    updateModule(data.setIn(['options', 'selectedMethods'], Array.from(set)));
  }
  _setChartCondition(conditions) {
    const { updateModule, data } = this.props;
    let timeConfig = Object.assign(
      {},
      data.options.timeConfig || {},
      conditions
    );
    updateModule(data.setIn(['options', 'timeConfig'], timeConfig));
  }
  _getSVROption(props) {
    const { moduleResponseData = [] } = props;
    let anls_evaluate_output = moduleResponseData.find(
        v => v.dataType == dataTypes.ANLS_EVALUATE_OUTPUT
      ) || { data: false },
      evaluateOutputData = anls_evaluate_output.data || {
        data: [],
        time: [],
        evaluation: {}
      };
    return {
      chart: this._getChartOption(evaluateOutputData),
      evaluation: evaluateOutputData.evaluation
    };
  }
  _getChartOption(data) {
    let datas = data.data;
    let option = {};
    let y_pred = datas.find(v => v.name == 'y_pred'),
      y_actual = datas.find(v => v.name == 'y_actual');
    if (datas.length < 2 || !y_pred || !y_actual) {
      return null;
    }
    let seriesData = data.time.map((v, i) => [
      y_actual.value[i],
      y_pred.value[i]
    ]);
    let lineData = y_actual.value.map(v => [v, v]);
    option = {
      tooltip: {
        trigger: 'item',
        axisPointer: {
          type: 'cross'
        }
      },
      xAxis: {
        name: 'y_actual',
        type: 'value',
        splitLine: {
          lineStyle: {
            type: 'dashed'
          }
        }
      },
      yAxis: {
        name: 'y_pred',
        type: 'value',
        splitLine: {
          lineStyle: {
            type: 'dashed'
          }
        }
      },
      series: [
        {
          name: 'scatter',
          type: 'scatter',
          data: seriesData
        },
        {
          name: 'line',
          type: 'line',
          showSymbol: false,
          smooth: true,
          data: lineData
        }
      ]
    };
    return option;
  }
}
export default EvaluateModulePanel;