/**
 * 首页
 * @author carol
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'office-ui-fabric-react/lib/Modal';

import EvaluateSlider from './EvaluateSlider';
import EvaluateDetails from './EvaluateDetails';

let _items;
class EvaluateModal extends React.PureComponent {
  constructor(props) {
    super(props);
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
        <div>
          <Modal
            isOpen={ this.state.showModal}
            onDismiss={ this._closeModal }
            isBlocking={true}
            containerClassName='modal-container'
          >
            <EvaluateSlider />
            <EvaluateDetails _closeModal={this._closeModal} />
          </Modal>
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
}

EvaluateModal.propTypes = {};

export default EvaluateModal;
