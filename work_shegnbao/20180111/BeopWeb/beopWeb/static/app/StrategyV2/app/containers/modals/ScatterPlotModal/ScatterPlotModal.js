/**
 * 散点图模态框
 * @author ivy
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'office-ui-fabric-react/lib/Modal';
import { Dropdown } from 'office-ui-fabric-react/lib/Dropdown';
import { Slider } from 'office-ui-fabric-react/lib/Slider';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import ehcarts from 'echarts';
import ReactEcharts from 'echarts-for-react';

import s from './ScatterPlotModal.css';

class ScatterPlotModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false
    };
    this._closeModal = this._closeModal.bind(this);
    this._getOption = this._getOption.bind(this);
    this.showModal = this.showModal.bind(this);
  }
  render() {
    return (
      <div>
        <Modal
          isOpen={this.state.showModal}
          onDismiss={this._closeModal}
          isBlocking={false}
          containerClassName={s['modal-container'] + ' scatter-plot-modal'}
        >
          <div className={s['slider']}>
            <div className={s['settings-container']}>
              <h3>Axis Data</h3>
              <ul>
                <li>
                  <Dropdown
                    label="Axis x"
                    className={s['Dropdown-svm']}
                    defaultSelectedKey="AxisX"
                    options={[{ key: 'AxisX', text: 'pelete length' }]}
                    disabled={true}
                  />
                </li>
                <li>
                  <Dropdown
                    label="Axis y"
                    className={s['Dropdown-svm']}
                    defaultSelectedKey="AxisY"
                    options={[{ key: 'AxisY', text: 'pelete length' }]}
                    disabled={true}
                  />
                </li>
                <li className="clear-both">
                  <div className={s['button']}>
                    <span> Find Infomative Project </span>
                  </div>
                </li>
                <li>
                  <Slider
                    label="Jittering"
                    min={50}
                    max={500}
                    step={50}
                    defaultValue={300}
                    showValue={true}
                    disabled={true}
                  />
                </li>
                <li>
                  <Checkbox
                    className={s['svm-checkbox']}
                    label="SVM"
                    onChange={this._onCheckboxChange}
                    ariaDescribedBy={'descriptionID'}
                  />
                </li>
              </ul>
            </div>
            <div className={s['settings-container']}>
              <h3>Points</h3>
              <ul>
                <li>
                  <Dropdown
                    label="Axis x"
                    className={s['Dropdown-svm']}
                    defaultSelectedKey="AxisX"
                    options={[{ key: 'AxisX', text: 'pelete length' }]}
                    disabled={true}
                  />
                </li>
                <li>
                  <Dropdown
                    label="Axis y"
                    className={s['Dropdown-svm']}
                    defaultSelectedKey="AxisY"
                    options={[{ key: 'AxisY', text: 'pelete length' }]}
                    disabled={true}
                  />
                </li>
                <li>
                  <Dropdown
                    label="Axis x"
                    className={s['Dropdown-svm']}
                    defaultSelectedKey="AxisX"
                    options={[{ key: 'AxisX', text: 'pelete length' }]}
                    disabled={true}
                  />
                </li>
                <li>
                  <Dropdown
                    label="Axis y"
                    className={s['Dropdown-svm']}
                    defaultSelectedKey="AxisY"
                    options={[{ key: 'AxisY', text: 'pelete length' }]}
                    disabled={true}
                  />
                </li>
                <li>
                  <Slider
                    label="Jittering"
                    min={50}
                    max={500}
                    step={50}
                    defaultValue={300}
                    showValue={false}
                    disabled={true}
                  />
                </li>
                <li>
                  <Slider
                    label="Jittering"
                    min={50}
                    max={500}
                    step={50}
                    defaultValue={300}
                    showValue={false}
                    disabled={true}
                  />
                </li>
              </ul>
            </div>
            <div className={s['settings-container']}>
              <h3>Plot properties</h3>
              <ul>
                <li>
                  <Checkbox
                    className={s['svm-checkbox']}
                    label="SVM"
                    onChange={this._onCheckboxChange}
                    ariaDescribedBy={'descriptionID'}
                  />
                </li>
                <li>
                  <Checkbox
                    className={s['svm-checkbox']}
                    label="SVM"
                    onChange={this._onCheckboxChange}
                    ariaDescribedBy={'descriptionID'}
                  />
                </li>
                <li>
                  <Checkbox
                    className={s['svm-checkbox']}
                    label="SVM"
                    onChange={this._onCheckboxChange}
                    ariaDescribedBy={'descriptionID'}
                  />
                </li>
                <li>
                  <Checkbox
                    className={s['svm-checkbox']}
                    label="SVM"
                    onChange={this._onCheckboxChange}
                    ariaDescribedBy={'descriptionID'}
                  />
                </li>
                <li>
                  <Checkbox
                    className={s['svm-checkbox']}
                    label="SVM"
                    onChange={this._onCheckboxChange}
                    ariaDescribedBy={'descriptionID'}
                  />
                </li>
                <li>
                  <Checkbox
                    className={s['svm-checkbox']}
                    label="SVM"
                    onChange={this._onCheckboxChange}
                    ariaDescribedBy={'descriptionID'}
                  />
                </li>
              </ul>
            </div>
            <div className={s['settings-container']}>
              <h3>zoom/select</h3>
              <ul>
                <li>
                  <span className={s['icon-container']}>
                    <i className="ms-Icon ms-Icon--Zoom" aria-hidden="true" />
                  </span>
                  <span className={s['icon-container']}>
                    <i className="ms-Icon ms-Icon--Zoom" aria-hidden="true" />
                  </span>
                  <span className={s['icon-container']}>
                    <i className="ms-Icon ms-Icon--Zoom" aria-hidden="true" />
                  </span>
                  <span className={s['icon-container']}>
                    <i className="ms-Icon ms-Icon--Zoom" aria-hidden="true" />
                  </span>
                </li>
                <li>
                  <Checkbox
                    className={s['svm-checkbox']}
                    label="SVM"
                    onChange={this._onCheckboxChange}
                    ariaDescribedBy={'descriptionID'}
                  />
                </li>
                <li className="clear-both">
                  <div className={s['save-button']}>
                    <span> save </span>
                  </div>
                  <div className={s['report-button']}>
                    <span> report </span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div className={s['chart']}>
            <div className={s['close']}>
              <span className={s['cancel-icon']} onClick={this._closeModal}>
                <i className="ms-Icon ms-Icon--Cancel" aria-hidden="true" />
              </span>
            </div>
            <div className={s['chart-show']}>
              <div>
                <ReactEcharts
                  ehcarts={ehcarts}
                  option={this._getOption()}
                  style={{ height: '100%', width: '100%' }}
                  className="react_for_echarts"
                />
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
  _closeModal() {
    this.setState({
      showModal: false
    });
  }
  _getOption() {
    const dataAll = [[], [[4.0, 5], [4.0, 3]]];
    const hours = [
      '00:00',
      '01:00',
      '02:00',
      '03:00',
      '04:00',
      '05:00',
      '06:00',
      '07:00',
      '08:00',
      '09:00',
      '10:00',
      '11:00'
    ];
    const sums = ['10k', '20k', '30k', '40k', '50k', '60k', '70k'];

    const markLineOpt = {
      animation: false,
      lineStyle: {
        normal: {
          type: 'solid',
          color: '#d8d8d8'
        }
      },
      tooltip: {},
      data: [
        [
          {
            coord: [1, 6],
            symbol: 'none'
          },
          {
            coord: [8, 2],
            symbol: 'none'
          }
        ],
        [
          {
            coord: [2, 4],
            symbol: 'none'
          },
          {
            coord: [7, 1],
            symbol: 'none'
          }
        ]
      ]
    };
    const option = {
      color: ['#0a97ff', '#fcd341'],
      tooltip: {},
      legend: {
        itemWidth: 8,
        itemHeight: 8,
        data: ['板块2供水温度达标日'],
        left: 'center',
        top: '54',
        data: [
          {
            name: '板块2供水温度达标日',
            icon: 'roundRect',
            textStyle: {
              color: '#555'
            }
          },
          {
            name: '板块4供水温度达标日',
            icon: 'roundRect',
            textStyle: {
              color: '#555'
            }
          }
        ]
      },
      xAxis: {
        type: 'category',
        data: hours,
        axisTick: {
          show: false
        },
        axisLine: {
          lineStyle: {
            color: '#d8d8d8',
            width: 2
          }
        },
        axisLabel: {
          color: '#666',
          margin: 23
        },
        gridIndex: 0,
        min: 0,
        max: 11
      },

      yAxis: {
        type: 'category',
        data: sums,
        axisTick: {
          show: false
        },
        axisLine: {
          lineStyle: {
            color: '#d8d8d8',
            width: 2
          }
        },
        axisLabel: {
          color: '#666',
          margin: 23
        },
        gridIndex: 0,
        min: 0,
        max: 7
      },
      series: [
        {
          name: '板块4供水温度达标日',
          type: 'scatter',
          data: dataAll[0],
          symbolSize: 17,
          markLine: markLineOpt
        },
        {
          name: '板块2供水温度达标日',
          type: 'scatter',
          data: dataAll[1],
          symbolSize: 17,
          markLine: markLineOpt
        }
      ]
    };
    return option;
  }
  showModal() {
    this.setState({
      showModal: true
    });
  }
}
export default ScatterPlotModal;
