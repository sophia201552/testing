import React from 'react';
import $ from 'jquery';
import css from './SearchInput.css';
/*
onClick  搜索按钮点击事件
onChange 搜索值改变触发的事件
skin     皮肤
*/

export default class SearchInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this._onClick = this._onClick.bind(this);
    this._onChange = this._onChange.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
  }
  render() {
    const { skin = '', i18n } = this.props;
    let wrapClass = `${css['searchInputWrap']}${skin ? ` ${css[skin]}` : ''}`;
    return (
      <div className={wrapClass}>
        {/* <label className={css['searchLabel']}>{i18n.SEARCH}</label> */}
        <div className={css['searchInput']}>
          <input
            ref={'input'}
            placeholder="Search..."
            onChange={this._onChange}
            onBlur={this._onClick}
            onKeyDown={this._onKeyDown}
          />
          <button onClick={this._onClick}>
            <i className="ms-Icon ms-Icon--Search" aria-hidden="true" />
          </button>
        </div>
      </div>
    );
  }
  _onClick() {
    const { onClick = () => {} } = this.props;
    onClick(this.refs.input.value);
  }
  _onChange() {
    const { onChange = () => {} } = this.props;
    onChange(this.refs.input.value);
  }
  _onKeyDown(e) {
    if (e.key == 'Enter') {
      this._onClick();
    }
  }
}
