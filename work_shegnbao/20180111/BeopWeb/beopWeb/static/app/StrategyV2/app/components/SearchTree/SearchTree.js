import React from 'react';
import $ from 'jquery';
import Tree from '../Tree';
import SearchInput from '../SearchInput';
import css from './SearchTree.css';

export default class SearchTree extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expandedKeys: [],
      searchValue: '',
      autoExpandParent: true
    };
  }
  componentWillReceiveProps(nextProps) {
    const {
      expandedKeys = []
    } = nextProps;
    
    this.setState({
      expandedKeys: new Set(expandedKeys)
    });
  }
  render() {
    const {
      items,
      folderIconOpen,
      folderIconClose,
      leafIcon,
      selectedKeys,
      indent,
      onExpand,
      onSelect,
      draggable,
      onDragStart,
      onDbClick,
      onMouseOver,
      onMouseOut,
      skin,
      I18nModulePython
    } = this.props;
    const { searchValue, autoExpandParent, expandedKeys } = this.state;
    return (
      <div>
        <SearchInput onChange={this._onChange.bind(this)} skin={skin} I18nModulePython={I18nModulePython} />
        <Tree
          items={items}
          folderIconOpen={folderIconOpen}
          folderIconClose={folderIconClose}
          leafIcon={leafIcon}
          expandedKeys={Array.from(expandedKeys)}
          selectedKeys={selectedKeys}
          indent={indent}
          onExpand={onExpand}
          onSelect={onSelect}
          autoExpandParent={autoExpandParent}
          searchValue={searchValue}
          draggable={draggable}
          onDragStart={onDragStart}
          onDbClick={onDbClick}
          onMouseOver={onMouseOver}
          onMouseOut={onMouseOut}
          skin={skin}
        />
      </div>
    );
  }
  _onChange(searchValue) {
    let { items, autoExpandParent, expandedKeys } = this.props;
    if (searchValue != '') {
      //搜索到的文件父元素展开
      expandedKeys = [];
      items.forEach(it => {
        if (it.name.indexOf(searchValue) > -1) {
          let node = items.find(v => v.id == it.id);
          if (node) {
            expandedKeys.push(node.parent);
          }
        }
      });
      autoExpandParent = true;
    }
    this.setState({
      searchValue,
      autoExpandParent,
      expandedKeys
    });
  }
}
