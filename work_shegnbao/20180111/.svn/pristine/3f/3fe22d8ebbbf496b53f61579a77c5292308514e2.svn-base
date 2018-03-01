import React from 'react';
import $ from 'jquery';
import { ScrollablePane } from 'office-ui-fabric-react/lib/ScrollablePane';
import { Sticky, StickyPositionType } from 'office-ui-fabric-react/lib/Sticky';

import s from './Table.css';

const css = (className1, className2 = '') => {
  return className1
    .split(' ')
    .map(v => s[v])
    .concat(className2.split(' '))
    .join(' ')
    .trim();
};

/*
dataSource          []                                                              数据数组
columns             [{title,key,width,colspan,className,render}]                    列配置
skin                'default'                                                       主题
selectedKeys        []                                                              选中id
onSelect            (selectedKeys,item)=>{}                                          选中事件
*/

class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedKeys: new Set()
    };
    this._onTrClick = this._onTrClick.bind(this);
  }
  componentDidMount() {
    this.componentWillReceiveProps(this.props);
  }
  componentWillReceiveProps(nextProps) {
    const { selectedKeys } = nextProps;
    this.setState({
      selectedKeys: new Set(selectedKeys)
    });
  }
  render() {
    return (
      <ScrollablePane>
        <div className={css('tableWrap')}>
          <Sticky>
            <table>
              <thead className={css('table-header')}>
                <tr>{this._createHeader()}</tr>
              </thead>
            </table>
          </Sticky>
          <table>
            <tbody className={css('table-body')}>{this._createBody()}</tbody>
          </table>
        </div>
      </ScrollablePane>
    );
  }
  _createHeader() {
    const { columns = [] } = this.props;
    return columns.map(col => {
      return (
        <th
          key={col.key}
          className={css('', col.className || '')}
          colSpan={col.colspan || 1}
          style={{
            width:
              col.width[col.width.length - 1] == '%'
                ? col.width
                : parseFloat(col.width) || null
          }}
          data-key={col.key}
        >
          <span>{col.title || ''}</span>
        </th>
      );
    });
  }
  _createBody() {
    const { dataSource = [], columns = [] } = this.props;
    const { selectedKeys } = this.state;
    return dataSource.map((data, i) => {
      let key = data.key == undefined ? i : data.key;
      let isSelected = selectedKeys.has(key);
      return (
        <tr
          key={key}
          className={css(isSelected ? 'active' : '')}
          onClick={this._onTrClick.bind(this, key)}
        >
          {columns.map((col, k) => {
            col.render = col.render || (v => v);
            return (
              <td
                key={`${i}-${k}`}
                className={css('', col.className || '')}
                colSpan={col.colspan || 1}
                style={{
                  width:
                    col.width[col.width.length - 1] == '%'
                      ? col.width
                      : parseFloat(col.width) || null
                }}
              >
                <span>{col.render(data[col.key], data)}</span>
              </td>
            );
          })}
        </tr>
      );
    });
  }
  _onTrClick(id, ev) {
    const { selectedKeys } = this.state;
    const { onSelect = () => {} } = this.props;
    let selected = true;
    if (selectedKeys.has(id)) {
      //取消选中
      selectedKeys.delete(id);
      selected = false;
    } else {
      //选中
      //单选
      selectedKeys.clear();
      selectedKeys.add(id);
    }
    this.setState({
      selectedKeys
    });
    onSelect(Array.from(selectedKeys), {
      selected,
      node: ev.target,
      event: ev
    });
  }
}

export default Table;
