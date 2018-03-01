/**
 * PCA 模块
 */
import React from 'react';
import PropTypes from 'prop-types';
import ReactEcharts from 'echarts-for-react';

import { dataTypes } from '@beopcloud/StrategyV2-Engine/src/enum';

import DataSetComponent from '../DataSetComponent';
import UnknownTooltip from '../../../components/UnknownTooltip';

import s from './PCAPanel.css';
const css = (className1, className2 = '') => {
  return className1
    .split(' ')
    .map(v => s[v])
    .concat(className2.split(' '))
    .join(' ')
    .trim();
};
class ScatterEcharts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.option = {
      xAxis: {
        type: 'category',
        splitLine: { show: false },
        data: []
      },
      yAxis: {
        type: 'value'
      },
      series: [],
      grid: {
        left: 60,
        right: 60,
        bottom: 50
      }
    };
    let colorArr = [
      ['rgba(170, 170, 255, ', '#66ccff'],
      ['rgba(105, 189, 118, ', '#edff9b'],
      ['rgba(244, 192, 101, ', '#ff6666'],
      ['rgba(51, 102, 255, ', '#5da9ff'],
      ['rgba(77, 138, 208, ', '#75b4fd'],
      ['rgba(213, 129, 252, ', '#fc84d3'],
      ['rgba(117, 180, 253, ', '#65f2fb'],
      ['rgba(244, 282, 93, ', '#f3df5e'],
      ['rbga(153, 53, 204, ', '#66ccff']
    ];
    this.lineColor = colorArr.map(row => ({
      type: 'linear',
      x: 0,
      y: 0,
      x2: 1,
      y2: 0,
      colorStops: [
        {
          offset: 0,
          color: row[0] + '1' // 0% 处的颜色
        },
        {
          offset: 1,
          color: row[1] // 100% 处的颜色
        }
      ],
      globalCoord: false // 缺省为 false
    }));
    this.areaColor = colorArr.map(row => row[0] + '.1');
  }
  componentWillReceiveProps(nextProps) {
    const { data } = nextProps;
    if (data.data.length) {
      this.getOption(data);
    }
  }
  render() {
    return (
      <ReactEcharts
        option={this.option}
        style={{ height: '100%', width: '100%' }}
        className="react_for_echarts"
        notMerge={true}
      />
    );
  }
  getOption(reponseData) {
    let seriesDatas = [],
      legendData = [];
    reponseData.data &&
      reponseData.data.forEach((v, index) => {
        seriesDatas.push({
          type: 'line',
          name: v.name,
          data: v.value,
          areaStyle: {
            normal: {
              color: this.areaColor[index]
            }
          }
        });
        legendData.push(v.name);
      });
    this.option = {
      color: this.lineColor,
      legend: {
        icon: 'roundRect',
        textStyle: {
          color: '#1d1d1d',
          fontSize: '14px'
        },
        data: legendData
      },
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        splitLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          color: '#626262'
        },
        axisLine: {
          lineStyle: {
            color: '#ccc'
          }
        },
        data: reponseData.time
      },
      yAxis: {
        splitLine: {
          show: false
        },
        scale: true,
        axisTick: {
          show: false
        },
        axisLabel: {
          color: '#626262'
        },
        axisLine: {
          lineStyle: {
            color: '#ccc'
          }
        }
      },
      grid: {
        left: 60,
        right: 60,
        bottom: 50
      },
      series: seriesDatas
    };
  }
}
class FooterInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentWillReceiveProps(nextProps) {
    const { data } = nextProps;
  }
  render() {
    const { data } = this.props;
    let matrixData = data.matrix;
    let paramesData = data.data;
    let length = 1;
    Object.keys(matrixData).forEach(v => length++);
    let width = 100 / length + '%';
    return (
      <div className={css('footerInfoCtn')}>
        <div className={css('matrixCtn')}>
          <div className={css('tableCtn')}>
            <div className={css('tableHeader')}>
              <span style={{ width: width }} />
              {Object.keys(matrixData).map((row, index) => (
                <span key={index} style={{ width: width }}>
                  {row}
                </span>
              ))}
            </div>
            <div className={css('tableBody')}>
              {Object.keys(matrixData).map((row, i) => (
                <div key={i}>
                  <span style={{ width: width }}>{row}</span>
                  {Object.keys(matrixData[row]).map((v, index) => (
                    <span key={index} style={{ width: width }}>
                      {matrixData[row][v]}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className={css('paramesCtn')}>
          <div>
            {paramesData.map((row, index) => (
              <div key={index}>
                <span>{row.name}</span>
                <span>{row.params.explain_ratio}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}
class PCAPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showWarn: false,
      showWarnTwo: false
    };
    this.dataSet = [];
    this.defaultSelectedKeys = [];
    this.responseResult = {
      data: [],
      time: [],
      matrix: {}
    };
    this._blurUpdate = this._blurUpdate.bind(this);
    this._selectedItem = this._selectedItem.bind(this);
    this._changeValue = this._changeValue.bind(this);
    this._onKeyUp = this._onKeyUp.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    const { moduleInputData, data, moduleResponseData } = nextProps;
    let inputData = moduleInputData.find(
      row => row.dataType === dataTypes['DS_HIS_OUTPUT']
    );
    if (inputData.data) {
      let dataSet = inputData.data.data.map(row => {
        return { key: row.name, text: row.name };
      });
      this.dataSet = dataSet;
    }
    this.defaultSelectedKeys =
      data.options.selectedDs || this.dataSet.map(v => v.key);
  }
  componentWillUpdate(nextProps, nextState) {
    const { moduleInputData, data, moduleResponseData } = nextProps;
    if (moduleResponseData && moduleResponseData.length) {
      let responseData = moduleResponseData.find(
        row => row.dataType === dataTypes['ANLS_PCA_OUTPUT']
      );
      if (
        responseData.data &&
        responseData.data.length &&
        this.defaultSelectedKeys.length !== 0
      ) {
        this.responseResult = responseData.data[0];
      } else {
        this.responseResult = {
          data: [],
          time: [],
          matrix: {}
        };
      }
    }
  }

  render() {
    const { showWarn, showWarnTwo } = this.state;
    const { moduleInputData, data, i18n } = this.props;
    return (
      <div className={css('PCAPanel')}>
        <div className={css('panelLeft')}>
          <div className={css('panelTitle')}>
            <span>
              {i18n.MODULE_NAME}{' '}
              <UnknownTooltip content={i18n.ANNOTATION_PCA} />
            </span>
          </div>
          <div className={css('slider')}>
            <div className={css('methodCtn')}>
              <h3>{i18n.METHOD}</h3>
              <div>
                <div className={css('labelInput')}>
                  <label>
                    {i18n.DIMENSIONALITY}{' '}
                    <UnknownTooltip content={i18n.ANNOTATION_DIMENSIONALITY} />
                  </label>
                  <input
                    type="text"
                    name="n_comp"
                    value={
                      this.state['n_comp'] || this.state['n_comp'] === ''
                        ? this.state['n_comp']
                        : data.options.methods[0].n_comp
                          ? data.options.methods[0].n_comp
                          : ''
                    }
                    onChange={this._changeValue}
                    onBlur={this._blurUpdate}
                    onKeyUp={this._onKeyUp}
                  />
                  {showWarn ? (
                    <span
                      style={{
                        color: 'red',
                        display: 'inline-block',
                        marginTop: '4px'
                      }}
                    >
                      {i18n.NOT_GREATER_INCOMING_DATA}
                    </span>
                  ) : (
                    ''
                  )}
                </div>
                <div className={css('labelInput')}>
                  <label>
                    {i18n.VARIANCE_INTERPRETATION_RATE}{' '}
                    <UnknownTooltip
                      content={i18n.ANNOTATION_VARIANCE_INTERPRETATION_RATE}
                    />
                  </label>
                  <input
                    type="text"
                    name="explain_ratio"
                    placeholder={i18n.ALLOWING_TEO_DECIMAL}
                    value={
                      this.state['explain_ratio'] ||
                      this.state['explain_ratio'] === ''
                        ? this.state['explain_ratio']
                        : data.options.methods[0].explain_ratio
                          ? data.options.methods[0].explain_ratio
                          : ''
                    }
                    onChange={this._changeValue}
                    onBlur={this._blurUpdate}
                    onKeyUp={this._onKeyUp}
                  />
                  {showWarnTwo ? (
                    <span
                      style={{
                        color: 'red',
                        display: 'inline-block',
                        marginTop: '4px'
                      }}
                    >
                      {i18n.ALLOWING_TEO_DECIMAL}
                    </span>
                  ) : (
                    ''
                  )}
                </div>
              </div>
            </div>
            <div className={css('dataSetCtn')}>
              <DataSetComponent
                title={i18n.DATA_SET}
                onSelect={this._selectedItem}
                isRadio={false}
                selectedKeys={this.defaultSelectedKeys}
                items={this.dataSet}
              />
            </div>
          </div>
        </div>
        <div className={css('panelRight')}>
          <div className={css('echrtasCtn')}>
            <ScatterEcharts data={this.responseResult} />
          </div>
          <div className={css('footer')}>
            <FooterInfo data={this.responseResult} />
          </div>
        </div>
      </div>
    );
  }
  _changeValue(e) {
    const { moduleInputData } = this.props;
    let name = e.target.name;
    let value = e.target.value;
    if (name === 'n_comp') {
      let inputData = moduleInputData.find(
        row => row.dataType === dataTypes['DS_HIS_OUTPUT']
      );
      if (inputData.data && inputData.data.data) {
        let length = inputData.data.data.length;
        if (Number(value) > length) {
          this.setState({
            showWarn: true
          });
        } else {
          this.setState({
            showWarn: false
          });
        }
      }
    } else {
      let numValue = Number(value);
      if (!(numValue > 0 && numValue < 1 && value.split('.')[1].length < 3)) {
        this.setState({
          showWarnTwo: true
        });
      } else {
        this.setState({
          showWarnTwo: false
        });
      }
    }
    this.setState({
      [name]: value
    });
  }
  _blurUpdate(e) {
    const { data } = this.props;
    const { showWarn, showWarnTwo } = this.state;
    let name = e.target.name;
    let value = Number(e.target.value);
    if (name === 'n_comp' && showWarn) {
      value = data.options.methods[0][name];
    }
    if (name === 'explain_ratio' && showWarnTwo) {
      value = data.options.methods[0][name];
    }
    let newMethods = Object.assign({}, data.options.methods[0], {
      [name]: value
    });
    let newData = Object.assign({}, data.options, {
      methods: [newMethods]
    });
    this.updateModule(newData);
  }
  _onKeyUp(e) {
    if (e.key == 'Enter') {
      this._blurUpdate(e);
    }
  }
  _selectedItem(items) {
    const { data } = this.props;
    let newData = Object.assign({}, data.options, {
      selectedDs: items
    });
    this.updateModule(newData);
    this.defaultSelectedKeys = newData;
  }

  updateModule(newData) {
    const { data } = this.props;
    let url = ['options'];
    let propsData = data.setIn(url, newData);
    this.props.updateModule(propsData);
  }
}
export default PCAPanel;