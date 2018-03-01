import React from 'react';
import $ from 'jquery';
import s from './DropdownList.css';
const css = (className1, className2 = '') => {
  return className1
    .split(' ')
    .map(v => s[v])
    .concat(className2.split(' '))
    .join(' ')
    .trim();
};
export default //props
//selectedKey 选中的项key
//onChanged   更改选中触发的回掉
//placeHolder 未选中时的显示
//options     [{key:'id',text:'文字'}]
//search      是否显示搜索框
//height      输入框高度
//skin        主题
//caretDown   {iconName: 'icon名', className: '类名' }

class DropdownList extends React.Component {
  constructor(props) {
    super(props);
    this.container = undefined;
    this.downlist = undefined;
    this.background = undefined;
    this.state = {
      searchKey: '',
      selectedKey: undefined
    };
    this._showDropdownList = this._showDropdownList.bind(this);
    this._clickDropdownList = this._clickDropdownList.bind(this);
    this._searchChange = this._searchChange.bind(this);
    this._searchClick = this._searchClick.bind(this);
    this._clickBackground = this._clickBackground.bind(this);
  }
  componentDidMount() {
    this.container = this.refs.wrap;
    this.componentWillReceiveProps(this.props);
  }
  componentWillUnmount() {
    this.downlist && this.downlist.remove();
    this.background && this.downlist.remove();
  }
  componentWillReceiveProps(nextProps) {
    const { selectedKey } = nextProps;
    this.setState({
      selectedKey
    });
    this._createDropdownList(nextProps);
  }
  componentDidUpdate() {
    const { options = [], search = false } = this.props;
    const { searchKey, selectedKey } = this.state;
    if (search && this.downlist) {
      let listWrap = this.downlist.querySelector(`.${s['dropdownLiWrap']}`);
      listWrap.innerHTML = '';
      options
        .filter(v => v.text.indexOf(searchKey) > -1)
        .forEach((info, index) => {
          let dv = document.createElement('DIV');
          dv.classList.add(s['dropdownLi']);
          dv.dataset.id = info.key;
          dv.innerHTML = info.text;
          if (/**info.key == selectedKey ||**/ index === 0) {
            dv.classList.add(s['selected']);
          }
          listWrap.appendChild(dv);
        });
    }
    if (searchKey == '') {
      this._scrollTo();
    }
  }
  render() {
    const {
      placeHolder = 'Not Selected',
      options = [],
      height = 32,
      skin = '',
      caretDown = { iconName: 'ChevronUnfold10', className: '' }
    } = this.props;
    const { selectedKey } = this.state;
    let lineHeight = height;
    let selectedItem = options.find(v => v.key == selectedKey);
    return (
      <div ref={'wrap'} className={css(`dropdownWrap ${skin}`)}>
        <span
          className={s['dropdownTitle']}
          onClick={this._showDropdownList}
          style={{
            height: height + 'px',
            lineHeight: lineHeight + 'px'
          }}
        >
          <span>{selectedItem ? selectedItem.text : placeHolder}</span>
        </span>
        <i
          className={
            `ms-Icon ms-Icon--${caretDown.iconName} ` +
            css(`caretDown ${caretDown.className}`)
          }
          aria-hidden="true"
          style={{ lineHeight: lineHeight + 'px' }}
        />
      </div>
    );
  }
  _createDropdownList(props) {
    const { options = [], selectedKey, search = false, skin = '' } = props;

    this.downlist && this.downlist.remove();
    this.background && this.background.remove();
    let dom = (this.downlist = document.createElement('DIV'));
    dom.classList.add(s['dropdownUl']);
    skin.split(' ').forEach(v => {
      dom.classList.add(s[v]);
    });

    if (search) {
      let searchInput = document.createElement('DIV'),
        input = document.createElement('INPUT');
      searchInput.classList.add(s['dropdownSearch']);
      input.onkeyup = this._searchChange;
      input.onclick = this._searchClick;
      input.placeholder = 'Search';
      searchInput.appendChild(input);
      dom.appendChild(searchInput);
    }
    let wrap = document.createElement('DIV');
    wrap.classList.add(s['dropdownLiWrap']);
    wrap.onclick = this._clickDropdownList;

    options.forEach(info => {
      let dv = document.createElement('DIV');
      dv.classList.add(s['dropdownLi']);
      dv.dataset.id = info.key;
      dv.innerHTML = info.text;
      if (info.key == selectedKey) {
        dv.classList.add(s['selected']);
      }
      wrap.appendChild(dv);
    });
    dom.appendChild(wrap);
    let background = (this.background = document.createElement('DIV'));
    background.classList.add(s['background']);
    background.onclick = this._clickBackground;
    background.appendChild(dom);
    document.body.appendChild(background);
  }
  _showDropdownList(e) {
    const { search = false } = this.props;

    let $targetDom = $(this.container),
      listDom = this.downlist,
      background = this.background,
      listWrap = listDom.querySelector(`.${s['dropdownLiWrap']}`),
      searchInput = listDom.querySelector(`.${s['dropdownSearch']}`);

    listDom.style.width = $targetDom.width() + 'px';
    listDom.style.left = $targetDom.offset().left + 'px';
    listDom.style.top = $targetDom.offset().top + $targetDom.height() + 'px';
    let maxHeight =
      document.body.offsetHeight -
      $targetDom.offset().top -
      $targetDom.height();
    listDom.style.maxHeight = maxHeight + 'px';
    background.classList.add(s['show']);
    if (search) {
      listWrap.style.height = maxHeight - searchInput.offsetHeight + 'px';
      searchInput.querySelector('input').value = '';
      this.setState({
        searchKey: ''
      });
    }
    this._scrollTo();
  }
  _clickDropdownList(e) {
    if (e.target.dataset.id == undefined) {
      return false;
    }
    let target = e.target;
    const { onChanged = () => {}, options = [] } = this.props;
    target.classList.add(s['selected']);
    let item = options.find(v => v.key == target.dataset.id);
    onChanged(item, target.dataset.id);
  }
  _searchChange(e) {
    let value = e.target.value;
    if (e.keyCode === 27) {
      value = '';
      const listDom = this.downlist,
        searchInput = listDom.querySelector(`.${s['dropdownSearch']}`);
      searchInput.querySelector('input').value = '';
    }
    if (e.keyCode === 13) {
      const { onChanged = () => {}, options = [] } = this.props;
      const selectedKey = options.filter(v => v.text.indexOf(value) > -1)[0]
        .key;
      let target = $(`[data-id="${selectedKey}"]`)[0];
      target.classList.add(s['selected']);
      let item = options.find(v => v.key == target.dataset.id);
      onChanged(item, target.dataset.id);
    }
    this.setState({
      searchKey: value
    });
  }
  _searchClick(e) {
    e.stopPropagation();
  }
  _clickBackground() {
    this.background.classList.remove(s['show']);
  }
  _scrollTo() {
    const { selectedKey } = this.state;
    let target = $(`[data-id="${selectedKey}"]`)[0];
    target && target.scrollIntoView();
  }
}
