/**
 * 首页
 * @author carol
 */
import React from 'react';
import PropTypes from 'prop-types';
import { List } from 'office-ui-fabric-react/lib/List';
import { Modal } from 'office-ui-fabric-react/lib/Modal';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import {
  DetailsList,
  DetailsRow,
  IDetailsRowProps,
  IDetailsRowCheckProps
} from 'office-ui-fabric-react/lib/DetailsList';

import s from './FuzzyRulesModal.css';

let _items;
class FuzzyRulesModal extends React.PureComponent {
  constructor(props) {
    super(props);

    _items = [
      {
        key: 1,
        name: '名称',
      },
      {
        key: 2,
        name: '状态',
      },
      {
        key: 3,
        name: '执行参数',
      }
    ];
    this.showModal = this.showModal.bind(this);
    this._closeModal = this._closeModal.bind(this);
    this.state = {
      items: _items,
      showModal: false
    };
    this.data = undefined;
  }
  render() {
    const {} = this.props;
    let { items } = this.state;
    return (
      <div className={s['container']}>
        <div>
          <Modal
            isOpen={ this.state.showModal}
            onDismiss={ this._closeModal }
            isBlocking={true}
            containerClassName={s['modal-container']}
          >
            <div className={s['modal-header']}>
              <h3 className={s['modal-title']}>模糊规则</h3>
              <DefaultButton
                className='modal-button'
                onClick={this._closeModal}
                text="确定"
              />
            </div>
            <div className={s['modal-body']}>
              <div className={s['list-header']}>
                <span className={s['args']}>参数</span>
                <span className={s['fuzzy-views']}>模糊视图(单击编辑)</span>
                <span className={s['other-config']}>其他配置</span>
              </div>
              <div className={s['list-content']}>
                <List items={items} onRenderCell={this._onRenderCell} />
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

  _onRenderCell(item, index) {
    return (
      <div className={s['list-item']}>
        <span className={s['args']}>{item.key}</span>
        <span className={s['fuzzy-views']}>{item.name}</span>
        <span className={s['other-config']}>诊断相关</span>
      </div>
    );
  }
}

FuzzyRulesModal.propTypes = {};

export default FuzzyRulesModal;
