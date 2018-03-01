import React from 'react';
import $ from 'jquery';
import s from './Tree.css';
const css = (className1, className2 = '') => {
  return className1
    .split(' ')
    .map(v => s[v])
    .concat(className2.split(' '))
    .join(' ')
    .trim();
};
/*
  items           数据源[{id, name, parent, isParent，tags, render}]
  expandedKeys    展开项id
  selectedKeys    选中项id
  indent          缩进num
  folderIconOpen  文件夹展开图标
  folderIconClose 文件夹关闭图标
  leafIcon        子文件图标
  onExpand        文件展开事件
  onSelect        选中事件
  autoExpandParent是否自动展开文件父级
  searchValue     搜索字段
  draggable       是否可拖拽
  onDragStart     拖拽事件
  skin            皮肤 给最外层一个类名
  onDbClick       双击事件
  onMouseOver     鼠标悬停事件
  onMouseOut      鼠标离开事件
*/
export default class Tree extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expandedKeys: new Set(),
      selectedKeys: new Set(),
      treeMap: new Map()
    };
  }
  componentDidMount() {
    this.componentWillReceiveProps(this.props);
  }
  componentWillReceiveProps(nextProps) {
    const {
      items = [],
      expandedKeys = [],
      selectedKeys = [],
      autoExpandParent = true,
      searchValue = ''
    } = nextProps;
    let treeMap = new Map();
    items.forEach(it => {
      if (treeMap.has(it.parent)) {
        treeMap.get(it.parent).push(it);
      } else {
        treeMap.set(it.parent, [it]);
      }
      // //搜索到的文件父元素展开
      if (searchValue != '' && it.name.indexOf(searchValue) > -1) {
        let node = items.find(v => v.id == it.id);
        if (node) {
          expandedKeys.push(node.parent);
        }
      }
    });
    if (autoExpandParent) {
      //展开的文件夹父元素也展开
      expandedKeys.forEach(id => {
        let node = items.find(it => it.id == id);
        if (node) {
          expandedKeys.push(node.parent);
        }
      });
    }
    this.setState({
      treeMap,
      expandedKeys: new Set(expandedKeys),
      selectedKeys: new Set(selectedKeys)
    });
  }
  render() {
    return this._createGroup(0, '0');
  }
  _createGroup(parentId, key = '0') {
    const { items, skin='' } = this.props;
    const { treeMap } = this.state;
    let children = treeMap.get(parentId),
      childrenNodes = this._createItem(children, key);
    return (
      <ul className={css(`tree ${skin}`)}>
        {childrenNodes}
      </ul>
    );
  }
  _createItem(children, parentKey) {
    if (!children) {
      return null;
    }
    const { expandedKeys, selectedKeys } = this.state;
    const {
      indent = 22,
      folderIconOpen = (
        <i className="ms-Icon ms-Icon--CaretSolidUp" aria-hidden="true" />
      ),
      folderIconClose = (
        <i className="ms-Icon ms-Icon--CaretSolidDown" aria-hidden="true" />
      ),
      leafIcon = null,
      draggable = false
    } = this.props;
    const paddingIndet =
      Math.max(parentKey.split('-').length - 1, 0) * indent + (indent - 2);

    let nodes = [];
    children.forEach((it, i) => {
      let key = parentKey + '-' + i;
      let isOpen = expandedKeys.has(it.id),
        isSelected = selectedKeys.has(it.id);
      let nameDom = this._createNameDom(it.name);
      if (it.isParent) {
        let liClassName =
          it.parent === 0
            ? s['item'] +
              (isSelected ? ' ' + s['selected'] : '') +
              ' ' +
              s['firstGrade']
            : s['item'] + (isSelected ? ' ' + s['selected'] : '');
        //文件夹
        nodes.push(
          <li key={key} className={liClassName}>
            <div
              title={it.name}
              className={
                s['itemContentWrap'] +
                (it.tags ? ' ' + s['itemContentTagWrap'] : '')
              }
              data-id={it.id}
              style={{ paddingLeft: paddingIndet + 'px' }}
              draggable={draggable}
              onDragStart={this._onDragStart.bind(this, it)}
            >
              <button
                className={s['iconButton']}
                onClick={this._extendClick.bind(this, it.id)}
              >
                {isOpen ? folderIconOpen : folderIconClose}
              </button>
              <div
                className={s['itemContent'] + ' ' + s['overflow']}
                onClick={this._selectedClick.bind(this, it.id)}
                onDoubleClick={this._onDbClick.bind(this,it)}
                onMouseOver={this._onMouseOver.bind(this,it)}
                onMouseOut={this._onMouseOut.bind(this,it)}
              >
                {it.render?it.render(nameDom,it,this):nameDom}
              </div>
              <ul className={s['tagsWrap'] + ' ' + s['clear']}>
                {it.tags ? it.tags.map(tag => <li key={tag}>{tag}</li>) : null}
              </ul>
            </div>
            {isOpen ? <div>{this._createGroup(it.id, key)}</div> : null}
          </li>
        );
      } else {
        //普通文件
        nodes.push(
          <li
            key={key}
            className={s['item'] + (isSelected ? ' ' + s['selected'] : '')}
          >
            <div
              title={it.name}
              className={
                s['itemContentWrap'] +
                (it.tags ? ' ' + s['itemContentTagWrap'] : '')
              }
              data-id={it.id}
              style={{ paddingLeft: paddingIndet + 'px' }}
              draggable={draggable}
              onDragStart={this._onDragStart.bind(this, it)}
            >
              <button className={s['iconButton']}>{leafIcon}</button>
              <div
                className={s['itemContent'] + ' ' + s['overflow']}
                onClick={this._selectedClick.bind(this, it.id)}
                onDoubleClick={this._onDbClick.bind(this,it)}
                onMouseOver={this._onMouseOver.bind(this,it)}
                onMouseOut={this._onMouseOut.bind(this,it)}
              >
                {it.render?it.render(nameDom,it,this):nameDom}
              </div>
              <ul className={s['tagsWrap'] + ' ' + s['clear']}>
                {it.tags ? it.tags.map(tag => <li key={tag}>{tag}</li>) : null}
              </ul>
            </div>
          </li>
        );
      }
    });
    return nodes;
  }
  _extendClick(id, ev) {
    const { expandedKeys } = this.state;
    const { onExpand = () => {} } = this.props;
    let expanded = true;
    if (expandedKeys.has(id)) {
      //收起
      expandedKeys.delete(id);
      expanded = false;
    } else {
      //展开
      expandedKeys.add(id);
    }
    this.setState({
      expandedKeys
    });
    onExpand(Array.from(expandedKeys), { expanded, node: ev.target });
  }
  _selectedClick(id, ev) {
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
  _onDragStart(it, ev) {
    const { onDragStart = () => {} } = this.props;
    onDragStart(it, ev);
  }
  _onDbClick(it,e) {
    const {onDbClick=()=>{}} = this.props;
    onDbClick(it.id, it.isParent, it, e);
  }
  _onMouseOver(it,e){
    const {onMouseOver=()=>{}} = this.props;
    onMouseOver(it.id, it.isParent, it, e);
  }
  _onMouseOut(it,e){
    const {onMouseOut=()=>{}} = this.props;
    onMouseOut(it.id, it.isParent, it, e);
  }
  _createNameDom(name) {
    const { searchValue = '' } = this.props;
    const index = name.indexOf(searchValue);
    const beforeStr = name.substr(0, index);
    const afterStr = name.substr(index + searchValue.length);
    const title =
      index > -1 ? (
        <span>
          {beforeStr}
          <span style={{ color: '#f50' }}>{searchValue}</span>
          {afterStr}
        </span>
      ) : (
        <span>{name}</span>
      );
    return title;
  }
}