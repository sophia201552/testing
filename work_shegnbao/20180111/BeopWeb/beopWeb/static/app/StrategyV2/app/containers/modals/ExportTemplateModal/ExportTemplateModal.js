/**
 * 首页
 * @author carol
 */
import React from 'react';
import { connect } from 'react-redux';

import { Modal } from 'office-ui-fabric-react/lib/Modal';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { Dropdown } from 'office-ui-fabric-react/lib/Dropdown';

import s from './ExportTemplateModal.css';

class ExportTemplateModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedItems: [],
      name: '',
      desc: ''
    };
    this.closeModal = this.closeModal.bind(this);
    this.exportTemplate = this.exportTemplate.bind(this);
    this.changeState = this.changeState.bind(this);
  }
  render() {
    const { isShowExportModal, i18n } = this.props;
    const { name, desc, selectedItems } = this.state;
    return (
      <Modal
        isOpen={isShowExportModal}
        onDismiss={this.closeModal}
        containerClassName={s['modal-container']}
      >
        <div className={s['modal-title']}>
          <span>{i18n.EXPORT_AS_TEMPLATE}</span>
        </div>
        <div className={s['modal-body']}>
          <div>
            <label htmlFor="">{i18n.NAME} </label>
            <input
              type="text"
              name=""
              value={name}
              placeholder={i18n.ENTER_TEMPLATE_NAME}
              onChange={this.changeName.bind(this)}
            />
          </div>
          <div className={s['tagsDropdown']}>
            <label>Tags </label>
            <Dropdown
              selectedKey={selectedItems.map(row => selectedItems.key)}
              onChanged={this.changeState}
              placeHolder="Select Tags"
              multiSelect
              options={[
                { key: 'A', text: 'AHU' },
                { key: 'B', text: 'PAU' },
                { key: 'C', text: 'Pump' },
                { key: 'D', text: 'Chiller' },
                { key: 'E', text: 'CoolingTower' },
                { key: 'F', text: 'CWP' },
                { key: 'G', text: 'ChWP' },
                { key: 'H', text: 'Temperature' },
                { key: 'I', text: 'Supply' },
                { key: 'J', text: 'Fan' }
              ]}
            />
          </div>
          <div>
            <label htmlFor="" title={i18n.DESC}>
              {i18n.DESC}{' '}
            </label>
            <input
              type="text"
              name=""
              value={desc}
              placeholder={i18n.ENTER_TEMPLATE_DESC}
              onChange={this.changeDesc.bind(this)}
            />
          </div>
        </div>
        <div className={s['modal-footer']}>
          <div className={s['buttonGroup']}>
            <DefaultButton
              primary={true}
              text={i18n.EXPORT}
              onClick={this.exportTemplate}
            />
            <DefaultButton text={i18n.CLOSE} onClick={this.closeModal} />
          </div>
        </div>
      </Modal>
    );
  }
  closeModal() {
    this.props.closeExportModal();
    this.setState({
      selectedItems: [],
      name: '',
      desc: ''
    });
  }
  changeName(e) {
    let name = e.currentTarget.value;
    this.setState({
      name: name
    });
  }
  changeDesc(e) {
    let value = e.currentTarget.value;
    this.setState({
      desc: value
    });
  }
  changeState(item) {
    let updatedSelectedItem = this.state.selectedItems
      ? this.state.selectedItems.slice(0)
      : [];
    if (item.selected) {
      // add the option if it's checked
      updatedSelectedItem.push(item);
    } else {
      // remove the option if it's unchecked
      let currIndex = updatedSelectedItem.findIndex(
        row => row.key === item.key
      );
      if (currIndex > -1) {
        updatedSelectedItem.splice(currIndex, 1);
      }
    }
    this.setState({
      selectedItems: updatedSelectedItem
    });
  }
  exportTemplate() {
    const { name, desc, selectedItems } = this.state;
    let tags = selectedItems.map(row => row.text);
    this.props.exportTemplate({
      name: name,
      desc: desc,
      tags: tags
    });
    this.closeModal();
  }
}

ExportTemplateModal.propTypes = {};

export default ExportTemplateModal;