/**
 * 首页
 * @author Peter
 */
import React from 'react';
import PropTypes from 'prop-types';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import {
  DetailsList,
  DetailsListLayoutMode,
  Selection
} from 'office-ui-fabric-react/lib/DetailsList';
import {
  Pivot,
  PivotItem,
  PivotLinkFormat
} from 'office-ui-fabric-react/lib/Pivot';

import s from './EvaluateDetails.css';

// 控制行数
let _items = [
  {
    key: 0,
    name: '回风温度过低',
    grade: '紧急',
    description: 'XXXXXXXXXX',
    type: '能耗浪费',    
    status: '发生',
    time: '12:12',
    user: 'Peter'
  },
  {
    key: 1,
    name: '回风温度过低',
    grade: '紧急',
    description: 'XXXXXXXXXX',
    type: '能耗浪费',    
    status: '发生',
    time: '12:12',
    user: 'Peter'
  },
  {
    key: 2,
    name: '回风温度过低',
    grade: '紧急',
    description: 'XXXXXXXXXX',
    type: '能耗浪费',    
    status: '发生',
    time: '12:12',
    user: 'Peter'
  },
  {
    key: 3,
    name: '回风温度过低',
    grade: '紧急',
    description: 'XXXXXXXXXX',
    type: '能耗浪费',    
    status: '发生',
    time: '12:12',
    user: 'Peter'
  },
];
// 控制列数
let _columns = [
  {
    key: 1,
    name: '故障名',
    fieldName: 'name',
    maxWidth: 130,
  },
  {
    key: 2,
    name: '级别',
    fieldName: 'grade',
    maxWidth: 40,
  },
  {
    key: 3,
    name: '描述',
    fieldName: 'description',
    maxWidth: 100,
  },
  {
    key: 4,
    name: '分类',
    fieldName: 'type',
    maxWidth: 82,
  },
  {
    key: 5,
    name: '状态',
    fieldName: 'status',
    maxWidth: 30,
  },
  {
    key: 6,
    name: '时间',
    fieldName: 'time',
    maxWidth: 30,
  },
  {
    key: 7,
    name: '修改人',
    fieldName: 'user',
  }
];

class EvaluateDetails extends React.PureComponent {
  constructor(props) {
      super(props);
      this.state = {
        value: new Date(),
        items: _items,
        rows: [
          {
            IF: 'GUJHEI HKJHHHGU',
            AND: 'beopweb.oss-cn-hangzhou.aliyuncs.com//stati',
            THEN: 'u.aliyuncs.com//static/images/avatar/default'
          },
          {
            IF: 'GUJHEI HKJHHHGU',
            AND: 'beopweb.oss-cn-hangzhou.aliyuncs.com//stati',
            THEN: 'u.aliyuncs.com//static/images/avatar/default'
          },
          {
            IF: 'GUJHEI HKJHHHGU',
            AND: 'beopweb.oss-cn-hangzhou.aliyuncs.com//stati',
            THEN: 'u.aliyuncs.com//static/images/avatar/default'
          },
        ],
        items1: [
          {
            方法: 'SVM',
            AUC: '1.000',
            F1: '1.000',
            CA: '1.000',
            Precision: '1.000',
            Recall: '1.000'
          },
          {
            方法: '深度学习',
            AUC: 0.932,
            F1: 0.950,
            CA: 0.961,
            Precision: 0.988,
            Recall: 0.985
          },   
        ],
        items2: [
          {
            方法: 'SVM',
            耗时: '1.000',
            结果命中: '1.000',
          }, 
        ]
      }
      this._closeModal = this._closeModal.bind(this);
    }
  render() {
    let {items1, items2, rows, items} = this.state;
    return (
      <div className={s['details-container']}>
         <div className={s['details-button']}>
            <DefaultButton
                  className='modal-button'
                  onClick={this._closeModal}
                  text="确定"
                />
          </div>
          <div className={s['details-navbar']}>
            <Pivot linkFormat={ PivotLinkFormat.tabs }>
              <PivotItem linkText='运行指标'>
                <div className={s['operation-table']}>
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
                        <tr key={index} className={s['operation-row']} >
                          {Object.values(item).map((value, i) => (
                            <td key={i}>{value}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <table className={s['operation']}>
                    <thead className={s['operation-header']}>
                      <tr className={s['thead-row']}>
                        {Object.keys(items2[0]).map((item, index) => (
                            <th key={index}>{item}</th>
                          ))}
                      </tr>
                    </thead>
                    <tbody className={s['operation-body']}>
                      {items2.map((item, index) => (
                        <tr key={index} className={s['operation-row']} >
                          {Object.values(item).map((value, i) => (
                            <td key={i}>{value}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </PivotItem>
              <PivotItem linkText='运行过程'>
                <ul>
                  {rows.map((row, index) => (
                    <div key={index} className={s['process-row']}>
                      <li className={s['item']}>
                          IF
                          <span className={s['item-value']}>{row.IF}</span>
                          ADN
                          <span className={s['item-value']}>{row.AND}</span>
                          THEN
                          <span className={s['item-value']}>{row.THEN}</span>
                      </li>
                    </div>
                  ))}
                </ul>
              </PivotItem>
              <PivotItem linkText='运行结果'>
                <DetailsList
                  className="strategyList"
                  headerClassName="headers"
                  items={items}
                  columns={_columns}
                  groupProps={{
                    showEmptyGroups: true
                  }}
                  setKey="set"
                  layoutMode={DetailsListLayoutMode.fixedColumns}
                  selection={this._selection}
                  onItemInvoked={this._onItemInvoked}
                  compact={true}
                  selectionPreservedOnEmptyClick={false}
              />
              </PivotItem>
            </Pivot>
          </div>
         
      </div>
    );
  }
  _showModal() {
    this.setState({ showModal: true });
  }
  _closeModal() {
    this.props._closeModal(); 
  }
  
}
EvaluateDetails.propTypes = {};

export default EvaluateDetails;


