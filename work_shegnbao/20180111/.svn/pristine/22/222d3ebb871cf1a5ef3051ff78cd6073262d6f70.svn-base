/**
 * 首页
 * @author carol
 */
import React from 'react';
import PropTypes from 'prop-types';

import { Modal } from 'office-ui-fabric-react/lib/Modal';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';

import s from './FileImportModal.css';

let _items;
class FileImportModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      items: _items,
      showModal: false
    };
    this.showModal = this.showModal.bind(this);
    this._closeModal = this._closeModal.bind(this);
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
            <div>
               <div className={s['import-file']}>
                 <input type="radio" /> 
                 <span> File: </span> 
                 <input type="text" />
               </div>
               <div className={s['import-url']}>
                <input type="radio" />
                <span> URL: </span> 
                <input type="text" />
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


}

FileImportModal.propTypes = {};

export default FileImportModal;

