/**
 * 数据源模态框
 * @author ivy
 */
/**
 * State
 * 
 * items: 列表详情
 * showModal: 作为打开自己必备条件
 * deleteItemModal: 删除某项的模态框
 * selectedItems: 双击得到item数据
 * selected: 单击获取选中的行
 * addItemModal: 添加和编辑模态框
 * 
*/
/**
 * Event
 * 
 * showModal, _closeModal: 关闭和打开自己的方法
 * _showdeleteItemModal, _closedeleteItemModal: 关闭,显示删除弹框
 * _delete: 确定是否删除
 * _addEvent: 确定是否编辑和添加
 * _edit: 打开编辑弹框
 * __closeAddItemModal,_showAddItemModal: 打开,关闭添加和编辑弹框
 * _onChangeValue: 获取修改 form 表单的值
 * selectedItems: 传递 selectedItems 给父元素 DateStore
 * 
 * 不变的属性
 * _selection: 获取可选中状态的 item
 * _columns: 列的展示方式
 * _keys: 每一列的名字
 * 
*/

import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'office-ui-fabric-react/lib/Modal';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import {
  DetailsList,
  DetailsListLayoutMode,
  Selection,
  IColumn
} from 'office-ui-fabric-react/lib/DetailsList';
import { MarqueeSelection } from 'office-ui-fabric-react/lib/MarqueeSelection';
import {
  PrimaryButton,
  DefaultButton
} from 'office-ui-fabric-react/lib/Button';
import {
  Dialog,
  DialogType,
  DialogFooter
} from 'office-ui-fabric-react/lib/Dialog';

import s from './ParametricExampleModal.css';

// 控制行数
let _items = [
  {
    id: '1',
    name: 'AHU-Power',
    desc: '功率',
    example: '能耗浪费',
    Tag: '发生'
  },
  {
    id: '2',
    name: 'AHU-Power',
    desc: '功率',
    example: '能耗浪费',
    Tag: '发生'
  },
  {
    id: '3',
    name: 'AHU-Power',
    desc: '功率',
    example: '能耗浪费',
    Tag: '发生'
  }
];

class ParametricExampleModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      items: _items,
      showModal: false,
      deleteItemModal: false,
      selectedItems: [],
      selected: [],
      addItemModal: false
    };
    this.showModal = this.showModal.bind(this);
    this._closeModal = this._closeModal.bind(this);
    this._returnDateSource = this._returnDateSource.bind(this);

    this._delete = this._delete.bind(this);
    this._showdeleteItemModal = this._showdeleteItemModal.bind(this);
    this._closedeleteItemModal = this._closedeleteItemModal.bind(this);
    
    this._addEvent = this._addEvent.bind(this);
    this._edit = this._edit.bind(this);
    this._showAddItemModal = this._showAddItemModal.bind(this);
    this._closeAddItemModal = this._closeAddItemModal.bind(this);
    this._onChangeValue = this._onChangeValue.bind(this);

    this._selection = new Selection({
      onSelectionChanged: () => {
        this.setState({
          selected:this._getSelectionDetails(),
        })
      }
    });
    this._getSelectionDetails = this._getSelectionDetails.bind(this);
    this._keys = ['name', 'desc', 'example', 'Tag'];
    this._columns = [
      {
        key: 'name',
        name: '参数名',
        fieldName: 'name',
        maxWidth: 160
      },
      {
        key: 'desc',
        name: '描述',
        fieldName: 'desc',
        maxWidth: 160
      },
      {
        key: 'example',
        name: '示例点',
        fieldName: 'example',
        maxWidth: 160
      },
      {
        key: 'tag',
        name: 'Tag',
        fieldName: 'tag',
        className: 'modal-tag',
        maxWidth: 200,
        onRender: (item, index) => {
          return <span>{item.Tag}</span>;
        }
      }
    ];
    this.selectedItems = this.state.selectedItems;
  }
  render() {
    const {} = this.props;
    let {
      items,
      selectedItems,
      deleteItemModal,
      showModal,
      addItemModal
    } = this.state;
    return (
      <div className={s['container']}>
        <div>
          <Modal
            isOpen={showModal}
            onDismiss={this._closeModal}
            isBlocking={true}
            containerClassName="modal-container"
            items={items}
          >
            <div className={s['modal-header']}>
              <h3 className={s['modal-title']}>参数样本</h3>
              <div className={s['close']}>
                <span className={s['cancel-icon']} onClick={this._closeModal}>
                  <i className="ms-Icon ms-Icon--Cancel" aria-hidden="true" />
                </span>
              </div>
              <div className={s['return']}>
                <span className={s['return-icon']} onClick={this._returnDateSource} >
                  <i
                    className="ms-Icon ms-Icon--ReturnToSession"
                    aria-hidden="true"
                  />
                </span>
              </div>
            </div>
            <div className={s['modal-body']}>
              <div className={s['params-nav'] + ' details-header'}>
                <ul>
                  <li>
                    <div
                      className={s['addEvent']}
                      data-id="addEvent"
                      onClick={this._showAddItemModal}
                    >
                      <i className={'ms-Icon ms-Icon--AddEvent'} />
                      <span className={s['toolName']}>添加</span>
                    </div>
                    <span className="details-line">|</span>
                  </li>
                  <li>
                    <div
                      className={s['delete']}
                      data-id="delete"
                      onClick={this._showdeleteItemModal}
                    >
                      <i className={'ms-Icon ms-Icon--Delete'} />
                      <span className={s['toolName']}>删除</span>
                    </div>
                  </li>
                </ul>
              </div>
                <DetailsList
                  items={items}
                  columns={this._columns}
                  selection={this._selection}
                  groupProps={{
                    showEmptyGroups: true
                  }}
                  setKey="set"
                  layoutMode={DetailsListLayoutMode.fixedColumns}
                  onItemInvoked={this._onItemInvoked}
                  onItemInvoked={this._edit}
                  compact={true}
                  selectionPreservedOnEmptyClick={true}
                />
              <Modal
                isOpen={deleteItemModal}
                isBlocking={true}
                containerClassName={s['delete-item-modal']}
              >
                <div className={s['delete-text']}>您确定要删除吗?</div>
                <div className={s['footer']}>
                  <PrimaryButton
                    className={s['button']}
                    onClick={this._delete}
                    text="确定"
                  />
                  <DefaultButton
                    className={s['button']}
                    onClick={this._closedeleteItemModal}
                    text="取消"
                  />
                </div>
              </Modal>
              <Modal
                isOpen={addItemModal}
                isBlocking={true}
                containerClassName={s['add-item-modal']}
              >
                <form>
                  {this._columns.map((value, index) => (
                    <div className={s['form-item']} key={index}>
                      <label>{value.name}</label>
                      <div className={s['form-input']}>
                        <input
                          type="text"
                          ref={this._keys[index]}
                          data-id={this._keys[index]}
                          onChange={this._onChangeValue}
                          value={selectedItems[this._keys[index]]}
                        />
                      </div>
                    </div>
                  ))}
                </form>
                <div className={s['footer']}>
                  <PrimaryButton
                    className={s['button']}
                    onClick={this._addEvent}
                    text="确定"
                  />
                  <DefaultButton
                    className={s['button']}
                    onClick={this._closeAddItemModal}
                    text="取消"
                  />
                </div>
              </Modal>
            </div>
          </Modal>
        </div>
      </div>
    );
  }

  /** 显示编辑模态框 */

  _edit() {
    let selectedItems = this._selection.getSelection()[0];
    this.setState({
      selectedItems
    });
    this._showAddItemModal();
  }

  _getSelectionDetails() {
    return this._selection.getSelection();
  }

  /** form表单值改变事件 */

  _onChangeValue(e) {
    var target = e.target.getAttribute('data-id');
    let newValue = e.target.value;
    let selectedItems = JSON.parse(JSON.stringify(this.state.selectedItems));
    selectedItems[target] = newValue;
    this.setState({
      selectedItems
    });
  }

  /** 添加和编辑事件 */
  _addEvent() {
    let selectedItems = JSON.parse(JSON.stringify(this.state.selectedItems)),
      items = JSON.parse(JSON.stringify(this.state.items));
    if (selectedItems.id) {
      items.forEach((v, i)=> (
        items[i] =  v.id === selectedItems.id ?  selectedItems : items[i]
      ))
    } else {
      selectedItems.id = items.length + 1 + '';
      selectedItems.name = this.refs.name.value;
      selectedItems.Tag = this.refs.Tag.value;
      selectedItems.desc = this.refs.desc.value;
      selectedItems.example = this.refs.example.value;
      items.push(selectedItems);
    }
    this.setState({
      items
    });
    this._closeAddItemModal();
    this.props.getData(items);
  }

  /** 显示添加模态框 */
  _showAddItemModal() {
    this.setState({
      addItemModal: true
    });
  }

  /** 关闭添加模态框 */
  _closeAddItemModal() {
    this.setState({
      addItemModal: false,
      selectedItems: {
        name: '',
        Tag: '',
        example: '',
        desc: ''
      }
    });
  }

  /** 显示删除模态框 */
  _showdeleteItemModal() {
    this.setState({
      deleteItemModal: true,
      selected: this._selection.getSelection()
    });
  }

  /** 关闭删除模态框 */
  _closedeleteItemModal() {
    this.setState({
      deleteItemModal: false
    });
  }
  /** 删除事件 */

  _delete() {
    let selectedArr = this.state.selected[0];
    let items = this.state.items.filter(
      v => v.id.indexOf(selectedArr.id) == -1
    );
    this.setState({
      items: items
    });
    this._closedeleteItemModal();
    this.props.getData(items);
  }

  /** 显示参数样本 */

  showModal() {
    this.setState({ showModal: true });
  }

  /** 关闭参数样本 */

  _closeModal() {
    this.setState({ showModal: false });
  }

  _returnDateSource() {
    this._closeModal();
    this.props.showModal();
  }
}

ParametricExampleModal.propTypes = {};

export default ParametricExampleModal;
