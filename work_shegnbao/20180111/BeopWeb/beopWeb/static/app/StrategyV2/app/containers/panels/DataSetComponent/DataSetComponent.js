import React from 'react';
import PropTypes from 'prop-types';
import UnknownTooltip from '../../../components/UnknownTooltip';

import s from './DataSetComponent.css';
const css = (className1, className2 = '') => {
  return className1
    .split(' ')
    .map(v => s[v])
    .concat(className2.split(' '))
    .join(' ');
};
/*
  title               ''
  items               [{key:text}],
  selectedKeys        []
  onSelect            (selectedKeys)=>{}
  isRadio             true/false 是否单选
  extra               [{name,onClick=()=>{}}]
  isShowTooltip       true/false是否显示提示
  content             提示内容
*/
class DataSetComponent extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedKeys: new Set()
    };
    this._onSelected = this._onSelected.bind(this);
    this.clearInterval = undefined;
  }
  componentDidMount() {
    this.componentWillReceiveProps(this.props);
  }
  componentWillReceiveProps(nextProps) {
    const { selectedKeys = [] } = nextProps;
    this.setState({
      selectedKeys: new Set(selectedKeys)
    });
  }
  render() {
    const {
      items = [],
      title = '',
      extra = [],
      isRadio = true,
      isShowTooltip = false,
      content
    } = this.props;
    const { selectedKeys } = this.state;
    let extraItem = extra.map(v => (
      <div
        key={v.name}
        className={css('item')}
        onClick={() => {
          v.onClick(Array.from(selectedKeys), items);
        }}
      >
        {v.name}
      </div>
    ));
    let item = items.map((it, index) => {
      let className = 'item';
      if (selectedKeys.has(it.key)) {
        className += ' active';
      }
      return (
        <div
          key={it.key}
          className={css(className)}
          onClick={this._onSelected.bind(this, [it.key])}
        >
          {it.text}
          {isShowTooltip && <UnknownTooltip content={content[index]} />}
        </div>
      );
    });
    return (
      <div className={css('datasetWrap')}>
        <div className={css('title')}>
          <span>{title}</span>
          {isRadio ? null : (
            <span onClick={this._onSelected.bind(this, items.map(v => v.key))}>
              All
            </span>
          )}
        </div>
        <div className={css('content clear')}>{[...extraItem, ...item]}</div>
      </div>
    );
  }
  _onSelected(ids, ev) {
    if (this.clearInterval) {
      clearInterval(this.clearInterval);
    }
    let { selectedKeys } = this.state;
    const {
      onSelect = () => {},
      isRadio = true,
      items = [],
      time = 500
    } = this.props;
    let selected = true;
    if (isRadio) {
      if (selectedKeys.has(ids[0])) {
        selectedKeys.clear();
        selected = false;
      } else {
        selectedKeys.clear();
        selectedKeys.add(ids[0]);
      }
    } else {
      if (ids.length > 1) {
        if (selectedKeys.size == items.length) {
          selectedKeys.clear();
        } else {
          selectedKeys = new Set(ids);
        }
      } else {
        if (selectedKeys.has(ids[0])) {
          selectedKeys.delete(ids[0]);
          selected = false;
        } else {
          selectedKeys.add(ids[0]);
        }
      }
    }
    this.setState({
      selectedKeys: new Set(selectedKeys)
    });
    if (!isRadio) {
      this.clearInterval = setInterval(() => {
        onSelect(Array.from(selectedKeys));
        clearInterval(this.clearInterval);
      }, time);
    } else {
      onSelect(Array.from(selectedKeys));
    }
  }
}

DataSetComponent.propTypes = {};

export default DataSetComponent;