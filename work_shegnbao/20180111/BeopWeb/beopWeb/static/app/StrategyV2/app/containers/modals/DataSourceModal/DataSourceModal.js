/**
 * 数据集模态框
 * @author ivy
 */
import React from 'react';
import PropTypes from 'prop-types';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { Modal } from 'office-ui-fabric-react/lib/Modal';
import { Nav, INavProps } from 'office-ui-fabric-react/lib/Nav';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { TextField } from 'office-ui-fabric-react/lib/TextField';

import ParametricExampleModal from '../ParametricExampleModal/ParametricExampleModal.js';
import s from './DataSourceModal.css';

/** Details Nav */
let _detailsHeaderList = [
  {
    name: '导入Excel',
    className: 'importExcel',
    iconName: 'ExcelDocument'
  },
  {
    name: '导出Excel',
    className: 'exportExcel',
    iconName: 'ExcelDocument'
  },
  {
    name: '批量',
    className: '批量',
    iconName: 'DocumentManagement'
  },
  {
    name: '查看数据',
    className: 'ChartData',
    iconName: 'Chart'
  }
];
let _argsItems = [
  'HeatingPlantAvaliable',
  'HeatingPlantAvaliableHeatingPlantAvaliable',
  'ntAvaliableHeatingPl',
  'bleHeatingPlantAval',
  'bleHeatingPlantAvalbleHeatingPlantAval'
];

class DataSourceModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.data = undefined;
    this.state = {
      showModal: false,
      detailsHeaderList: _detailsHeaderList,
      argsItems: [],
      items1: [
        {
          时间: '20070101',
          HeatingPlantAvailable: 4,
          OnOffStatus: 0
        },
        {
          时间: '20070101',
          HeatingPlantAvailable: 4,
          OnOffStatus: 0
        },
        {
          时间: '20070101',
          HeatingPlantAvailable: 4,
          OnOffStatus: 0
        }
      ]
    };
    this.showModal = this.showModal.bind(this);
    this._closeModal = this._closeModal.bind(this);
    this._showParamecModal = this._showParamecModal.bind(this);
  }
  render() {
    const {} = this.props;
    let { items, detailsHeaderList, items1, argsItems } = this.state;
    return (
      <div className={s['container']}>
        <ParametricExampleModal ref="ParametricExampleModal" showModal={this.showModal} getData={this.getData.bind(this)}/>
        <div>
          <Modal
            isOpen={this.state.showModal}
            onDismiss={this._closeModal}
            isBlocking={true}
            containerClassName={s['modal-container'] + ' modal-container'}
          >
            <div className={s['slider-container']}>
              <div className={s['slider-header-text']}>
                <h3>数据源</h3>
              </div>
              <div className={s['slider-list']}>
                <div className={s['slider-list-header']}>
                  <div className={s['header-text-container']} onClick={this._showParamecModal}>
                    <span>参数样本</span>
                  </div>
                </div>
                <div className={s['slider-list-content']}>
                  <Nav
                    groups={[
                      {
                        links: [
                          {
                            name: 'AHU01',
                            key: 'AHU01',
                            url: '',
                            icon: 'OpenFile',
                            iconClassName: 'ms-Icon ms-Icon--OpenFile'
                          },
                          {
                            name: 'AHU02',
                            key: 'AHU02',
                            url: '',
                            icon: 'OpenFile',
                            iconClassName: 'ms-Icon ms-Icon--OpenFile'
                          },
                          {
                            name: 'AHU03',
                            key: 'AHU03',
                            url: '',
                            icon: 'OpenFile',
                            iconClassName: 'ms-Icon ms-Icon--OpenFile'
                          },
                          {
                            name: 'AHU04',
                            key: 'AHU04',
                            url: '',
                            icon: 'OpenFile',
                            iconClassName: 'ms-Icon ms-Icon--OpenFile'
                          }
                        ]
                      }
                    ]}
                  />
                </div>
              </div>
            </div>
            <div className="details-container">
              <div className="details-header">
                <ul>
                  {detailsHeaderList.map((item, index) => (
                    <li key={index}>
                      <div className={s[item.className]}>
                        <i className={'ms-Icon ms-Icon--' + item.iconName} />
                        <span className={s['toolName']}>{item.name}</span>
                      </div>
                      {index !== detailsHeaderList.length - 1 && (
                        <span className="details-line">|</span>
                      )}
                    </li>
                  ))}
                  <DefaultButton
                    className="modal-button"
                    onClick={this._closeModal}
                    text="确定"
                  />
                </ul>
              </div>
              <div className={s['details-content']}>
                <div className={s['details-left']}>
                  <div className={s['data-args'] + ' data-args'}>
                    {argsItems.map((value, index) => (
                        <div className={s['args-item']} key={index}>
                          <label>
                            <span>{value.name}</span>
                          </label>
                          <div className={s['args-input']}>
                            <input
                              type="text"
                              value={value.Tag}
                              disabled={true}
                            />
                          </div>
                        </div>
                    ))}
                  </div>
                  <div className={s['data-time']}>
                    <table className={s['operation']}>
                      <thead className={s['operation-header']}>
                        <tr className={s['thead-row']}>
                          {Object.keys(items1[0]).map((item, index) => (
                            <th key={index}>{item}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className={s['operation-body']}>
                        {items1.map((item, index) => (
                          <tr key={index} className={s['operation-row']}>
                            {Object.values(item).map((value, i) => (
                              <td key={i}>{value}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </Modal>
        </div>
      </div>
    );
  }
  showModal(data) {
    this.data = data;
    this.setState({ showModal: true });
  }
  _closeModal() {
    this.setState({ showModal: false });
  }
  _showParamecModal() {
    this._closeModal();
    this.refs.ParametricExampleModal.showModal()
  }
  getData(argsItems) {
    this.setState({
      argsItems
    })
  }
}

DataSourceModal.propTypes = {};

export default DataSourceModal;
