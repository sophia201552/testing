import React from 'react';
import $ from 'jquery';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import s from './AsyncButton.css';

// props = {
//   DefaultButtonProps,
//   text,
//   onClick,// ()=>async
// }
export default class CustomSpinner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false,
      visible: false
    };
    this._btnClick = this._btnClick.bind(this);
  }
  render() {
    const { iconProps } = this.props;
    const { disabled, visible } = this.state;
    let props = Object.assign({}, this.props, {
      disabled,
      onClick: this._btnClick,
      iconProps: visible ? undefined : iconProps
    });
    return (
      <div
        className={`${s['buttonWrap']} ${
          visible ? s['loading'] : ''
        }`}
      >
        {visible ? (
          <Spinner size={SpinnerSize.small} className={s['spinner']} />
        ) : null}
        <DefaultButton {...props} />
      </div>
    );
  }
  _btnClick(e) {
    const { onClick = () => {} } = this.props;
    let async = onClick(e);
    if (async) {
      this.spinnerStart();
    }
    async.always && async.always(()=>{
      this.spinnerEnd();
    });
    async.finally && async.finally(()=>{
      this.spinnerEnd();
    });
    async.then && async.then(()=>{
      this.spinnerEnd();
    });
    async.subscribe && async.subscribe({
      next:()=>{},
      error:()=>{},
      complete:()=>{
        this.spinnerEnd();
      }
    });
  }
  spinnerStart(){
    this.setState({
      disabled: true,
      visible: true
    });
  }
  spinnerEnd(){
    this.setState({
      disabled: false,
      visible: false
    });
  }
}
