import React from 'react';
import $ from 'jquery';
import s from './Select.css';
const css = (className1, className2 = '') => {
  return className1
    .split(' ')
    .map(v => s[v])
    .concat(className2.split(' '))
    .join(' ')
    .trim();
};
export default //props
//selectedKeys 选中的项key
//onChanged   更改选中触发的回掉
//options     [{key:'id',text:'文字',type:'item||header'}],
//mode        'startWith'||'contains'
class Select extends React.Component {
  constructor(props) {
    super(props);
    this.container = undefined;
    this.downlist = undefined;
    this.background = undefined;
    this.childParentMap = {};
    this.state = {
      selectedKeys: new Set(),
      options: []
    };
    this._inputClick = this._inputClick.bind(this);
    this._inputChange = this._inputChange.bind(this);
    this._inputBlur = this._inputBlur.bind(this);
    this._inputKeyDown = this._inputKeyDown.bind(this);
    this._downlistClick = this._downlistClick.bind(this);
    this._backgroundClick = this._backgroundClick.bind(this);
  }
  componentDidMount() {
    this.container = this.refs.wrap;
    this.componentWillReceiveProps(this.props);
  }
  componentWillUnmount() {
    this.downlist && this.downlist.remove();
    this.background && this.background.remove();
  }
  componentWillReceiveProps(nextProps) {
    const { selectedKeys, options } = nextProps;
    this.setState({
      selectedKeys: new Set(selectedKeys.map(v => v + '')),
      options
    });
  }
  shouldComponentUpdate() {
    return true;
  }
  componentDidUpdate() {}
  render() {
    this._createDropdown(this.props);
    const { skin = '' } = this.props;
    return (
      <div
        ref={'wrap'}
        className={css(`selectWrap ${skin}`)}
        onClick={this._inputClick}
      >
        <div className={css('selectBox','custom-selectBox')}>
          <div className={s['rendered']}>
            <ul>
              {this._createTags()}
              <li className={s['searchLi']}>
                <div className={s['searchLiBox']}>
                  <input
                    ref="input"
                    style={{padding:0}}
                    onChange={this._inputChange}
                    onBlur={this._inputBlur}
                    onKeyDown={this._inputKeyDown}
                  />
                  <span ref="fontWrap" />
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
  _createTags() {
    const { selectedKeys, options } = this.state;
    let selectedItems = [];
    selectedKeys.forEach(v => {
      let item = options.find(o => '' + o.key == v);
      if (item) {
        selectedItems.push(item);
      }
    });
    return selectedItems.map(option => {
      return (
        <li key={option.key} data-id={option.key} className={s['item']}>
          <div className={s['itemContent']}>{option.text}</div>
          <span className={s['remove']}>x</span>
        </li>
      );
    });
  }
  _createDropdown(props) {
    const { selectedKeys, options } = this.state;
    const { skin = '' } = props;
    this.downlist && this.downlist.remove();
    this.background && this.background.remove();
    let background = (this.background = document.createElement('DIV'));
    background.classList.add(s['background']);
    let downlistWrap = (this.downlist = document.createElement('DIV'));
    downlistWrap.classList.add(s['dropdownUl']);
    downlistWrap.classList.add(s[skin]);
    let downlist = document.createElement('DIV');
    downlist.classList.add(s['dropdownLiWrap']);

    downlist.onclick = this._downlistClick;
    let currentParent = undefined;
    options.forEach(info => {
      let dv = document.createElement('DIV');
      if(info.type=='header'){
        currentParent = info.key;
        dv.classList.add(s['dropdownHeader']);
      }else{
        this.childParentMap[info.key] = currentParent;
        dv.classList.add(s['dropdownLi']);
      }
      dv.dataset.id = info.key;
      dv.innerHTML = info.text;
      if (selectedKeys.has(info.key + '')) {
        dv.classList.add(s['selected']);
      }
      downlist.appendChild(dv);
    });
    downlistWrap.appendChild(downlist);

    background.appendChild(downlistWrap);
    background.onclick = this._backgroundClick;
    document.body.appendChild(background);
  }
  _inputKeyDown(ev) {
    const { options, selectedKeys } = this.state;
    const { onChanged = () => {} } = this.props;
    const keyboard = ['Enter', 'Backspace', 'ArrowUp', 'ArrowDown'];
    if (keyboard.indexOf(ev.key) < 0) {
      return;
    }
    let shouldChange = false;
    let key = undefined;
    let target = this.downlist.querySelector(
      `.${s['dropdownLiWrap']} .${s['dropdownLi']}.${s['active']}`
    );
    if (ev.key == 'Enter') {
      key = target.dataset.id;
      let value = target.innerHTML;
      if (selectedKeys.has(key)) {
        selectedKeys.delete(key);
      } else {
        options.push({
          key,
          text: value
        });
        selectedKeys.add(key);
      }

      ev.target.value = '';
      this.setState({
        options,
        selectedKeys
      });
      shouldChange = true;
    }
    if (ev.key == 'Backspace' && ev.target.value == '') {
      let keysArr = Array.from(selectedKeys);
      key = keysArr[keysArr.length - 1];
      selectedKeys.delete(key);
      this.setState({
        selectedKeys
      });
      shouldChange = true;
    }
    if (
      (ev.key == 'ArrowDown' || ev.key == 'ArrowUp') &&
      this.background.classList.contains(s['show'])
    ) {
      let allLis = this.downlist.querySelectorAll(
        `.${s['dropdownLiWrap']} .${s['dropdownLi']}`
      );
      let length = allLis.length,
        index = Array.from(allLis).findIndex(
          v => target.dataset.id == v.dataset.id
        );
      if (ev.key == 'ArrowDown') {
        index++;
        index = index >= length ? 0 : index;
      } else {
        index--;
        index = index < 0 ? length - 1 : index;
      }
      target.classList.remove(s['active']);
      allLis[index].classList.add(s['active']);
      allLis[index].scrollIntoView();
    }
    if (shouldChange) {
      let item = options.find(v => '' + v.key == key),
        items = this._sortItems(
          options.filter(v => selectedKeys.has(v.key + '')),
          Array.from(selectedKeys)
        );
      onChanged(Array.from(selectedKeys), true, item, items);
    }
  }
  _inputBlur(ev) {
    ev.target.value = '';
  }
  _inputChange(ev) {
    this.refs.fontWrap.innerHTML = ev.target.value;
    let width = this.refs.fontWrap.offsetWidth;
    this.refs.input.style.width = width + 'px';
    this._onlyChangeSearch(ev.target.value);
  }
  _inputClick(e) {
    const { onChanged = () => {} } = this.props;
    const { selectedKeys, options } = this.state;
    if (e.target.classList.contains(s['remove'])) {
      let li = e.target.parentNode,
        id = li.dataset.id;
      selectedKeys.delete(id);
      this.setState({
        selectedKeys
      });
      let item = options.find(v => '' + v.key == id),
        items = this._sortItems(
          options.filter(v => selectedKeys.has(v.key + '')),
          Array.from(selectedKeys)
        );
      onChanged(Array.from(selectedKeys), false, item, items);
      return false;
    }
    this.refs.input.focus();
    this._onlyChangeSearch('');
    this._showList();
  }
  _downlistClick(ev) {
    let target = ev.target.closest(`.${s['dropdownLi']}`);
    let id = target && target.dataset.id;
    if (!id) {
      return;
    }
    const { onChanged = () => {} } = this.props;
    const { selectedKeys, options } = this.state;
    let isAdd = false;
    if (selectedKeys.has(id)) {
      selectedKeys.delete(id);
    } else {
      selectedKeys.add(id);
      isAdd = true;
    }
    this.setState({
      selectedKeys
    });
    let item = options.find(v => '' + v.key == id),
      items = this._sortItems(
        options.filter(v => selectedKeys.has(v.key + '')),
        Array.from(selectedKeys)
      );
    onChanged(Array.from(selectedKeys), isAdd, item, items);
  }
  _backgroundClick(ev) {
    this.background.classList.remove(s['show']);
  }
  _showList() {
    let $targetDom = $(this.container),
      listDom = this.downlist,
      background = this.background,
      listWrap = listDom.querySelector(`.${s['dropdownLiWrap']}`);
    listDom.style.width = $targetDom.width() + 'px';
    listDom.style.left = $targetDom.offset().left + 'px';
    listDom.style.top = $targetDom.offset().top + $targetDom.height() + 'px';
    let maxHeight =
      document.body.offsetHeight -
      $targetDom.offset().top -
      $targetDom.height();
    listDom.style.maxHeight = maxHeight + 'px';
    background.classList.add(s['show']);
  }
  _onlyChangeSearch(value) {
    const { mode = 'startWith' } = this.props;
    const { selectedKeys, options } = this.state;
    let searchKey = value;
    if (this.downlist) {
      let listWrap = this.downlist.querySelector(`.${s['dropdownLiWrap']}`);
      listWrap.innerHTML = '';
      let filterResults = [];
      if (value && !options.find(v => v.text == value)) {
        filterResults.push({
          key: value,
          text: value
        });
      }
      if (mode == 'startWith') {
        filterResults = filterResults.concat(
          options.filter(v =>
            v.type != 'header' && v.text.toLocaleUpperCase().startsWith(searchKey.toLocaleUpperCase())
          )
        );
      } else {
        filterResults = filterResults.concat(
          options.filter(
            v =>
              v.type != 'header' && v.text
                .toLocaleUpperCase()
                .indexOf(searchKey.toLocaleUpperCase()) > -1
          )
        );
      }
      // if (value != '') {
      //   filterResults.sort((a, b) => {
      //     return a.text.length - b.text.length;
      //   });
      // }
      let currentParent = undefined;
      filterResults.forEach((info, index) => {
        if(currentParent != this.childParentMap[info.key]){
          let dvHeader = document.createElement('DIV');
          currentParent = this.childParentMap[info.key];
          let parentInfo = options.find(v=>v.key==currentParent);
          dvHeader.classList.add(s['dropdownHeader']);
          dvHeader.dataset.id = parentInfo.key;
          dvHeader.innerHTML = parentInfo.text;
          listWrap.appendChild(dvHeader);
        }
        let dv = document.createElement('DIV');
        dv.classList.add(s['dropdownLi']);
        dv.dataset.id = info.key;
        dv.innerHTML = info.text;
        if (index == 0) {
          dv.classList.add(s['active']);
        }
        
        if (selectedKeys.has(info.key + '')) {
          dv.classList.add(s['selected']);
        }
        listWrap.appendChild(dv);
      });
      this._showList();
    }
  }
  _sortItems(items, selectedKeys) {
    return selectedKeys.map(k => items.find(v => v.key == k));
  }
}
