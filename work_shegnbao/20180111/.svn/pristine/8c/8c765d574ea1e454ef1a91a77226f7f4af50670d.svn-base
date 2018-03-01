/**
 * HOC - 附加警告提示
 */
import React from 'react';
import PropTypes from 'prop-types';
import {
  MessageBar,
  MessageBarType
} from 'office-ui-fabric-react/lib/MessageBar';
import CustomSpinner from '../../../../components/CustomSpinner';
import en from './en.js';
import zh from './zh.js';
import { getI18n } from '../../../../components/I18n';

import s from './WarnWrap.css';

export default Component => {
  return class newComponent extends React.PureComponent {
    constructor(props) {
      super(props);
      this.state = {
        inputDataError: [],
        outputDataError: [],
        shouldshowErrorMsg: true,
        spinner: false
      };
    }
    componentDidMount() {
      this._validata();
    }
    componentWillReceiveProps(nextProps) {
      this._validata(nextProps);
    }
    _validata(props) {
      const { moduleInputData, moduleOutputData, status } = props || this.props;
      let inputDataError = [],
        outputDataError = [];
        moduleInputData &&  moduleInputData.forEach(function(data) {
        if (data.data === false) {
          inputDataError.push(data.dataType);
        }
      });
      moduleOutputData &&　moduleOutputData.forEach(function(data) {
        if (data.data === false) {
          outputDataError.push(data.dataType);
        }
      });
      if (status === 0) {
        this.setState({
          spinner:
            Component.isNeedWranWrapSpinner == undefined
              ? true
              : Component.isNeedWranWrapSpinner
        });
      } else {
        this.setState({
          spinner: false
        });
      }
      this.setState({
        inputDataError,
        outputDataError
      });
    }
    render() {
      const {
        shouldshowErrorMsg,
        inputDataError,
        outputDataError,
        spinner
      } = this.state;
      const { status } = this.props;
      const i18n = getI18n({zh, en})
      return (
        <div className={s['container']}>
          <Component {...this.props} />
          {status !== 0 &&
            (inputDataError.length !== 0 || outputDataError.length !== 0) && (
              <div className={shouldshowErrorMsg ? '' : ' cancle'}>
                <div className={s['message-bar-container']}>
                  <span className={s['ErrorBadgeWrap']}>
                    <i
                      className="ms-Icon ms-Icon--Warning"
                      aria-hidden="true"
                    />
                  </span>
                  <span className={s['errorMsgWrap']}>
                    {inputDataError.length === 0
                      ? ''
                      : `${inputDataError.join(', ')}${
                          i18n.INPUT_MODULE_WAEM_INFO
                        }`}
                    {outputDataError.length === 0
                      ? ''
                      : `${outputDataError.join(', ')}${
                          i18n.OUTPUT_MODULE_WAEM_INFO
                        }`}
                  </span>
                  <span
                    className={s['cancleWrap']}
                    onClick={this._closeErrorMsg.bind(this)}
                  >
                    <i className="ms-Icon ms-Icon--Cancel" aria-hidden="true" />
                  </span>
                </div>
              </div>
            )}
          <CustomSpinner visible={spinner} zIndex={999} />
        </div>
      );
    }
    _closeErrorMsg() {
      this.setState({
        shouldshowErrorMsg: false
      });
    }
  };
};
