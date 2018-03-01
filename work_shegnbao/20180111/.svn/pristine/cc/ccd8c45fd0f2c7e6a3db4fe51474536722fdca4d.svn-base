/**
 * 诊断项
 */
import React from 'react';
import PropTypes from 'prop-types';
import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox';
import { Modal } from 'office-ui-fabric-react/lib/Modal';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';

import { dataTypes } from '@beopcloud/StrategyV2-Engine/src/enum';

import EditParameter from './EditParameter.js';
import FaultsManage from './FaultsManage.js';
import s from './DiagnosisItemPanel.css';

//props
class DiagnosisItemPanel extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedItem: undefined,
      showEditParameter: false
    };
    this.updateModule = this.updateModule.bind(this);
    this.showConfigModal = this.showConfigModal.bind(this);
    this.closeEditParameter = this.closeEditParameter.bind(this);
    this.updateParameters = this.updateParameters.bind(this);

    this.inputData = [];
    this.params = [];
  }
  componentWillReceiveProps(nextProps, nextState) {
    const { data, moduleInputData } = nextProps;
    const { selectedItem } = this.state;
    let inputData = moduleInputData.find(
      row => row.dataType === dataTypes['DN_INPUT_OPT']
    );
    if (inputData.data) {
      this.inputData = inputData.data.concat([]);
    }
    this.params = data.options.params;
  }
  render() {
    const { i18n, data } = this.props;
    const { params } = data.options;
    const { selectedItem, showEditParameter } = this.state;
    const itemsList = params ? params : [];
    return (
      <div className={s['diagnosisItemPanel']}>
        <FaultsManage
          showConfigModal={this.showConfigModal}
          params={this.params}
          updateModule={this.updateModule}
          i18n={i18n}
        />
        <EditParameter
          updateParameters={this.updateParameters}
          selectedItem={selectedItem}
          inputData={this.inputData}
          params={this.params}
          showEditParameter={showEditParameter}
          closeEditParameter={this.closeEditParameter}
          i18n={i18n}
        />
      </div>
    );
  }
  showConfigModal(item) {
    this.setState({
      showEditParameter: true,
      selectedItem: item
    });
  }
  closeEditParameter(item) {
    this.setState({
      showEditParameter: false
    });
  }
  updateParameters(data) {
    let propsData = this.props.data;
    let oldData = propsData.options.params;
    let index = oldData.findIndex(row => row.faultId === data.faultId);
    let newData;
    if (index !== -1) {
      newData = oldData.map(row => {
        if (row.faultId === data.faultId) {
          return data;
        } else {
          return row;
        }
      });
    } else {
      newData = oldData.concat(data);
    }
    this.updateModule(newData);
  }
  updateModule(newData) {
    let propsData = this.props.data;
    let url = ['options', 'params'];
    propsData = propsData.setIn(url, newData);
    this.props.updateModule(propsData);
    this.setState({
      showEditParameter: false
    });
  }
}
DiagnosisItemPanel.propTypes = {};

export default DiagnosisItemPanel;
