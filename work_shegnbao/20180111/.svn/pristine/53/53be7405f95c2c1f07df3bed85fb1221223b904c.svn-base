/**
 * @author carol
 */
import React from 'react';
import { connect } from 'react-redux';
import { Modal } from 'office-ui-fabric-react/lib/Modal';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { TextField } from 'office-ui-fabric-react/lib/TextField';

import en from './en.js';
import zh from './zh.js';
import { I18N, getI18n } from '../../../components/I18n';

import { getStrategyList } from '../../../redux/epics/home.js';

import css from './UpdateStrategyModal.css';
// props
// showModal    是否显示modal
//saveInfo      更新name desc字段
// closeModal   关闭模态框的方法
//selectedItem  选中要修改的项
class UpdateStrategyModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      name:  '',
      desc: ''
    };
    this.closeModal = this.closeModal.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    let {selectedItem} = nextProps;
    if(selectedItem[0] !== undefined) {
      this.setState({
        name: selectedItem[0].name,
        desc: selectedItem[0].desc
      })
    }
  }
  render() {
    const { showModal, selectedItem, i18n } = this.props;
    const { name, desc } = this.state;
    return (
      <Modal
        isOpen={showModal}
        onDismiss={this.closeModal}
        containerClassName={css['updateModal']}
      >
        <div className={css['title']}>
          <span className={css['titeleName']}>{i18n.MODIFY_STRATE}</span>
          <span onClick={this.closeModal}>
            <i className="ms-Icon ms-Icon--ChromeClose" aria-hidden="true" />
          </span>
        </div>
        <div className={css['container']}>
          <TextField
            label={i18n.MODIFY_STRATE_NAME}
            value={name}
            onChanged={this.changeName.bind(this)}
          />
          <TextField
            label={i18n.MODIFY_STRATE_DESC}
            value={desc}
            onChanged={this.changeDescription.bind(this)}
          />
        </div>
        <div className={css['footer']}>
          <div>
            <div>
              <DefaultButton text={i18n.CANCEL} onClick={this.closeModal} />
            </div>
            <div>
              <DefaultButton
                text={i18n.OK}
                primary={true}
                onClick={this.saveInfo.bind(this)}
              />
            </div>
          </div>
        </div>
      </Modal>
    );
  }
  changeName(value) {
    this.setState({
      name: value
    });
  }
  changeDescription(value) { 
    this.setState({
      desc: value
    });
  }
  saveInfo() {
    const { name, desc } = this.state;
    const { selectedItem } = this.props;
    let itemId = selectedItem[0]._id;
    this.closeModal();
    this.props.spinner();
    this.props.saveInfo([itemId], name, desc, 0);
  }
  closeModal() {
    this.setState({
      name: undefined,
      desc: undefined
    });
    this.props.closeModal();
  }
}
var mapDispatchToProps = {
  getStrategyList
};
var mapStateToProps = function(state) {
  return {};
};
export default connect(mapStateToProps, mapDispatchToProps)(
  I18N(UpdateStrategyModal, getI18n({ en, zh }))
);

