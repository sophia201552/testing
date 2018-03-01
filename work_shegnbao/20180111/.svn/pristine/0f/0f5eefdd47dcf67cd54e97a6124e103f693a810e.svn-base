import cx from 'classnames';
import ObjectId from '../../common/objectId.js';
import s from './StageContextMenu.css';
// option = {
//   items: [{ key, value, type, onClick, render, disabled,children }]
//   onClick:()=>{}
// };
export default class StageContextMenu {
  constructor(container, option = {}) {
    this.container = container || document.querySelector('body');
    this.key = ObjectId();
    this.option = option;
    this.ev = undefined;
    this.menuWrap = undefined;
    this.menu = undefined;
    this.childrenMenu = {};
    this._init();
  }
  show(ev) {
    this.ev = ev;
    $(this.menuWrap).show();
    let $menu = $(this.menu),
      $container = $(this.container);
    let wrapOffset = $container.offset();
    let menuHeight = $menu.height(),
      wrapHeight = $container.height() + wrapOffset.top,
      menuWidth = $menu.width(),
      wrapWidth = $container.width() + wrapOffset.left;
    let x = ev.clientX,
      y = ev.clientY;
    if (y + menuHeight >= wrapHeight) {
      y = y - menuHeight;
    }
    if (x + menuWidth >= wrapWidth) {
      x = wrapWidth - menuWidth;
    }
    $menu.css({
      left: x + 'px',
      top: y + 'px'
    });
  }
  hide() {
    this._hideChildrenMenu();
    $(this.menuWrap).hide();
    $(this.menu).css({
      left: '-1000px',
      top: '-1000px'
    });
    this.ev = undefined;
  }
  destroy() {
    this.menuWrap && this.menuWrap.remove();
  }
  setOption(option = {}) {
    Object.assign(this.option, option);
    if (Reflect.has(option, 'items')) {
      this._init();
    }
  }
  get items() {
    return this.option.items.concat();
  }
  _init() {
    this._createDom();
    this._createChildrenMenu();
    this._attachEvents();
  }
  _createDom() {
    if (this.menuWrap) {
      this.menuWrap.remove();
    }
    const { items = [] } = this.option;
    let itemsHtml = this._createItems(items);
    let html = `<div id="stageContextMenuWrap${this.key}" class="${
      s['stageContextMenuWrap']
    }">
      <div class="${s['stageContextMenu']}" data-key="0">
        ${itemsHtml}
      </div>
    </div>`;
    $('body').append(html);
    this.menuWrap = document.querySelector(`#stageContextMenuWrap${this.key}`);
    this.menu = this.menuWrap.querySelector(
      `.${s['stageContextMenu']}[data-key="0"]`
    );
  }
  _createChildrenMenu() {
    this.childrenMenu = {};
    let $menuWrap = $(this.menuWrap);
    const { items = [] } = this.option;
    const create = (items, id) => {
      $menuWrap.append(`<div class="${s['stageContextMenu']}" data-key="${id}">
        ${this._createItems(items)}
      </div>`);
      this.childrenMenu[id] = $menuWrap.find(
        `.${s['stageContextMenu']}[data-key="${id}"]`
      )[0];
    };
    const loop = (items, id) => {
      items.forEach((it, i) => {
        if (it.children) {
          loop(it.children, id + '-' + i);
        }
      });
      if (id.split('-').length > 1) {
        create(items, id);
      }
    };
    loop(items, '0');
  }
  _createItems(items) {
    let itemsHtml = '';
    items.forEach((it, i) => {
      const {
        key,
        value,
        type = 'item',
        onClick,
        render,
        disabled = false,
        children
      } = it;
      let itemHtml = '';
      switch (type) {
        case 'item':
          itemHtml += `<button class="${s['item']} ${
            disabled ? s['disabled'] : ''
          } ${
            children ? s['parent'] : ''
          }" data-key="${key}">${value}${children ?`<span class="${s['icon']} ms-Icon ms-Icon--CaretRightSolid8"></span>`:''}</button>`;
          break;
        case 'header':
          if (i != 0) {
            itemHtml += `<div class="${s['separator']}"></div>`;
          }
          itemHtml += `<div class="${
            s['header']
          }" data-key="${key}">${value}</div>`;
          break;
      }
      itemsHtml += render ? render(it) : itemHtml;
    });
    return itemsHtml;
  }
  _showChildrenMenu($target) {
    let key = `${$target
      .closest(`.${s['stageContextMenu']}`)
      .data('key')}-${$target.index()}`;
    let menuDom = this.childrenMenu[key];
    if (!menuDom) {
      return;
    }
    $target.addClass(s['hover']);
    let maxLevel = Math.max(
        ...Object.keys(this.childrenMenu).map(k => k.split('-').length)
      ),
      keyArr = key.split('-'),
      level = keyArr.length;
    let $menu = $(menuDom),
      $container = $(this.container),
      $parentMenu = $(
        `.${s['stageContextMenu']}[data-key="${keyArr
          .slice(0, level - 1)
          .join('-')}"]`,this.menuWrap
      ),
      $mainMenu = $(this.menu);

    let wrapOffset = $container.offset();
    let menuHeight = $menu.height(),
      wrapHeight = $container.height() + wrapOffset.top,
      menuWidth = $menu.width(),
      wrapWidth = $container.width() + wrapOffset.left;

    let x = $parentMenu.offset().left + $parentMenu.width(),
      y = $target.offset().top,
      mainX = $mainMenu.offset().left + $mainMenu.width();
    if (y + menuHeight >= wrapHeight) {
      y = wrapHeight - menuHeight;
    }
    if (mainX + menuWidth * (maxLevel - 1) >= wrapWidth) {
      x = $parentMenu.offset().left - menuWidth;
    }
    $menu.css({
      left: x + 'px',
      top: y + 'px'
    });
  }
  _hideChildrenMenu($target) {
    let key='';
    if($target==undefined){//清除全部
      $(`.${s['item']}`).removeClass(s['hover']);
      key = '0-0';
    }else{
      $target.removeClass(s['hover']).siblings().removeClass(s['hover']);
      key = `${$target
        .closest(`.${s['stageContextMenu']}`)
        .data('key')}-${$target.index()}`;
    }
    let level = key.split('-').length;
    Object.keys(this.childrenMenu).forEach(k => {
      if (k.split('-').length >= level) {
        $(this.childrenMenu[k])
          .css({
            left: '-1000px',
            top: '-1000px'
          })
          .find(`.${s['item']}`)
          .removeClass(s['hover']);
      }
    });
  }
  _attachEvents() {
    const _this = this;
    let $menuWrap = $(this.menuWrap);
    const getItemByKey = key => {
      let keyArr = key.split('-');
      let loop = (items, n, num) => {
        if (num < 2) {
          return items;
        } else {
          return loop(items[keyArr[n]].children, n + 1, num - 1);
        }
      };
      if (keyArr.length > 1) {
        return loop(_this.option.items, 1, keyArr.length);
      } else {
        return _this.option.items;
      }
    };
    $menuWrap
      .off('contextmenu')
      .on('contextmenu', function(e) {
        e.preventDefault();
        e.stopPropagation();
      })
      .off('mousedown')
      .on('mousedown', function(e) {
        if ($(e.target).closest(`.${s['item']}`).length > 0) {
          return;
        }
        _this.hide();
      });
    $menuWrap
      .off('click', `.${s['item']}`)
      .on('click', `.${s['item']}`, function(e) {
        e.preventDefault();
        e.stopPropagation();
        let $this = $(this);
        if ($this.hasClass(s['disabled']) || $this.hasClass(s['parent'])) {
          return;
        }
        let key = $this.closest(`.${s['stageContextMenu']}`).data('key') + '';
        let index = $this.index();
        let target = getItemByKey(key)[index];
        target.onClick && target.onClick({ item: target, ev: _this.ev });
        _this.option.onClick &&
          _this.option.onClick({ item: target, ev: _this.ev });
        _this.hide();
      });
    $menuWrap
      .off('mouseenter', `.${s['item']}`)
      .on('mouseenter', `.${s['item']}`, function(e) {
        e.preventDefault();
        e.stopPropagation();
        let $this = $(this);
        _this._hideChildrenMenu($this);
        if ($this.hasClass(s['parent'])) {
          _this._showChildrenMenu($this);
        }
      });
  }
}
