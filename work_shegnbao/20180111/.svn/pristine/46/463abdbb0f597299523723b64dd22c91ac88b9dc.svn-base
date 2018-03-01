import React from 'react';
import s from './RenameInput.css';

const css = (className1, className2 = '') => {
  return className1
    .split(' ')
    .map(v => s[v])
    .concat(className2.split(' '))
    .join(' ')
    .trim();
};


export default class RenameInput extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isError: false,
      errorMsg: ''
    };
    this._renameItem = this._renameItem.bind(this);
    this._onTextBlur = this._onTextBlur.bind(this);
    this._onTextKeyDown = this._onTextKeyDown.bind(this);
    this._onTextClick = this._onTextClick.bind(this);
    this._onTextChanged = this._onTextChanged.bind(this);
  }
  componentDidMount() {
    const { data } = this.props;
    this.refs.input.value = data.name;
    // this.componentDidUpdate();
  }
  componentDidUpdate() {
    
  }
  render() {
    const { dom = [], data } = this.props;
    const { isError,errorMsg } = this.state;
    return (
      <div className={css('RenameText')}>
        <input
          ref="input"
          className={css(`text ${isError ? 'error' : ''}`)}
          onBlur={this._onTextBlur}
          onKeyDown={this._onTextKeyDown}
          onClick={this._onTextClick}
          onChange={this._onTextChanged}
        />
        <label className={css(`errorText ${isError ? '' : 'hide'}`)}>
          {errorMsg}
        </label>
      </div>
    );
  }
  _renameItem(e) {
    e.preventDefault();
    e.stopPropagation();
  }
  _onTextBlur() {
    const {
      data,
      renameItem = () => {},
      verification = () => {
        return { status: true };
      }
    } = this.props;
    let rs = verification(this.refs.input.value);
    if (rs.status) {
      this.setState({ isError: false,errorMsg:'' });
      renameItem(data.key, this.refs.input.value);
    } else {
      this.setState({ isError: true,errorMsg:rs.msg });
    }
  }
  _onTextKeyDown(e) {
    if (e.key == 'Enter') {
      $(this.refs.input).blur();
    }
  }
  _onTextClick(e) {
    e.preventDefault();
    e.stopPropagation();
  }
  _onTextChanged(e){
    this.setState({ isError: false,errorMsg:'' });
  }
}