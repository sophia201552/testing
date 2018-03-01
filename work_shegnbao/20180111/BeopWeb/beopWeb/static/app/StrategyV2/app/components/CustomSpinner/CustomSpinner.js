import React from 'react';
import $ from 'jquery';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import css from './CustomSpinner.css';

export default class CustomSpinner extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { visible, zIndex = 'auto', backgroundColor="rgba(0, 0, 0, 0.4)", label } = this.props;
    return (
      <div
        style={{ display: visible ? 'block' : 'none' , zIndex: zIndex, backgroundColor: backgroundColor}}
        className={css['spinnerWrap']}
      >
        <Spinner size={SpinnerSize.large} className={css['spinner']} label={label}/>
      </div>
    );
  }
}