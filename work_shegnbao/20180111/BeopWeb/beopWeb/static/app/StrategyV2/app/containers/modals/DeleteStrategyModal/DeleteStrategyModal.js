/**
 * @author carol
 */
import React from 'react';
import { connect } from 'react-redux';
import { Modal } from 'office-ui-fabric-react/lib/Modal';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';

import { removeStrategy } from '../../../redux/epics/home.js';

import css from './DeleteStrategyModal.css';
// props
// showModal    是否显示modal
// closeModal   关闭模态框的方法
//selectedItems
class DeleteStrategyModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this._closeModal = this._closeModal.bind(this);
    this._onDeleteRow = this._onDeleteRow.bind(this);
  }
  render() {
    const { showModal, i18n } = this.props;
    if (!showModal) {
      return false;
    }
    return (
      <Modal
        isOpen={showModal}
        onDismiss={this._closeModal}
        isBlocking={false}
        containerClassName={css['modal-container']}
      >
        <div>
          <h3>{i18n.CONFIRM_DELETE}</h3>
          <span>{i18n.DELETE_TOOLTIP}</span>
        </div>
        <div className={css['button-container']}>
          <DefaultButton
            className={css['modal-button']}
            onClick={this._onDeleteRow}
            text={i18n.OK}
            primary={true}
          />
          <DefaultButton
            className={css['modal-button']}
            onClick={this._closeModal}
            text={i18n.CANCEL}
          />
        </div>
      </Modal>
    );
  }
  _closeModal() {
    this.props.closeModal();
  }
  /** 删除选中项 */
  _onDeleteRow() {
    const { selectedItems } = this.props;
    this.props.removeStrategy(
      appConfig.project.id,
      selectedItems.map(v => v._id),
      selectedItems.map(v => v.creatorId)
    );
    this._closeModal();
  }
}
var mapDispatchToProps = {
  removeStrategy
};
var mapStateToProps = function(state) {
  return {};
};
export default connect(mapStateToProps, mapDispatchToProps)(
  DeleteStrategyModal
);
