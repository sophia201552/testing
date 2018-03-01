/**
 * 首页
 * @author carol
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'office-ui-fabric-react/lib/Modal';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import {
  DetailsList,
  DetailsListLayoutMode
} from 'office-ui-fabric-react/lib/DetailsList';

import s from './DiagnosisItemModal.css';
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
  }
];
// 控制列数
let _columns = [
  {
    key: 1,
    name: '故障名',
    fieldName: 'name',
    maxWidth: 130
  },
  {
    key: 2,
    name: '级别',
    fieldName: 'grade',
    maxWidth: 40
  },
  {
    key: 3,
    name: '描述',
    fieldName: 'description',
    maxWidth: 100
  },
  {
    key: 4,
    name: '分类',
    fieldName: 'type',
    maxWidth: 82
  },
  {
    key: 5,
    name: '状态',
    fieldName: 'status',
    maxWidth: 30
  },
  {
    key: 6,
    name: '时间',
    fieldName: 'time',
    maxWidth: 30
  },
  {
    key: 7,
    name: '修改人',
    fieldName: 'user'
  }
];
//slider list

let _sliderList = [
  {
    name: '类型',
    className:'list-type',
    sliderListItem: [
      {
        itemType: 'AHU',
        itemNum: 4
      },
      {
        itemType: 'AHU',
        itemNum: 4
      },
      {
        itemType: 'AHU',
        itemNum: 4
      },
    ]
  },
  {
    name: '影响',
    className:'list-affect',
    sliderListItem: [
      {
        itemType: 'AHU',
        itemNum: 4
      },
      {
        itemType: 'AHU',
        itemNum: 4
      },
      {
        itemType: 'AHU',
        itemNum: 4
      },
    ]
  },
  {
    name: '能耗浪费',
    className:'list-energy',
    sliderListItem: [
      {
        itemType: 'AHU',
        itemNum: 4
      },
      {
        itemType: 'AHU',
        itemNum: 4
      },
      {
        itemType: 'AHU',
        itemNum: 4
      },
    ]
  },
  {
    name: '级别',
    className:'list-grade',
    sliderListItem: [
      {
        itemType: 'AHU',
        itemNum: 4
      },
      {
        itemType: 'AHU',
        itemNum: 4
      },
      {
        itemType: 'AHU',
        itemNum: 4
      },
    ]
  },
]

// Nav
let _detailsHeaderList = [
  {
    name: '添加',
    className: 'add',
    iconName: 'AddEvent',
  },
  {
    name: '编辑',
    className: 'edit',
    iconName: 'SingleColumnEdit',
  },
  {
    name: '模板',
    className: 'template',
    iconName: 'AssessmentGroupTemplate',
  },
  {
    name: '删除',
    className: 'delete',
    iconName: 'Delete',
  },
  {
    name: '另存为',
    className: 'save',
    iconName: 'SaveAs'
  }
]
class DiagnosisItemModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      items: _items,
      sliderList: _sliderList,
      detailsHeaderList: _detailsHeaderList,
      showModal: false
    };
    this.showModal = this.showModal.bind(this);
    this._closeModal = this._closeModal.bind(this);
    this.data = undefined;
  }
  render() {
    const {} = this.props;
    let { items, sliderList, detailsHeaderList } = this.state;
    return (
      <div className={s['container']}>
        <div>
          <Modal
            isOpen={this.state.showModal}
            onDismiss={this._closeModal}
            isBlocking={true}
            containerClassName={s['modal-container'] + ' modal-container'}
          >
            <div className={s['slider-container']}>
              <div className={s['slider-header-text']}>
                <h3>诊断项</h3>
              </div>
              <div className={s['slider-list']}>
                <ul>
                  {sliderList.map((listItem, index) => (
                    <li className={s[listItem.className]} key={index}>
                      <div>
                        <h4>{listItem.name}</h4>
                      </div>
                      <div>
                        <ul>
                          {listItem.sliderListItem.map((item, inx) => (
                            <li className={s['slider-list-item']} key={inx}>
                              <span className={s['item-type']}>{item.itemType}</span>
                              <span className={s['item-num']}>{item.itemNum}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className='details-container'>
              <div className='details-header'>
                <ul>
                  {detailsHeaderList.map((item, index) => (
                    <li key={index}>
                     <div className={s[item.className]}>
                       <i
                         className={'ms-Icon ms-Icon--'+ item.iconName }
                       />
                       <span className={s['toolName']}>{item.name}</span>
                     </div>
                     {index !== detailsHeaderList.length-1 && <span className='details-line'>|</span>}
                    </li>
                  ))}
                  <DefaultButton
                    className="modal-button"
                    onClick={this._closeModal}
                    text="确定"
                  />
                </ul>
              </div>
              <div className={s['detaild-content']}>
                <DetailsList
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
  _formatDate (value) {
    var fmt = 'yyyy-MM-dd hh:mm:ss';
    var _this = new Date(value);
    var o = {
      "M+": _this.getMonth() + 1, //月份
      "d+": _this.getDate(), //日
      "h+": _this.getHours(), //小时
      "m+": _this.getMinutes(), //分
      "s+": _this.getSeconds(), //秒
      "q+": Math.floor((_this.getMonth() + 3) / 3), //季度
      "S": _this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (_this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  }
}

DiagnosisItemModal.propTypes = {};

export default DiagnosisItemModal;
