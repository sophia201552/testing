import React from 'react';
import $ from 'jquery';
import css from './Confirm.css';

const getNames = (className1, className2 = '') => {
  return className1
    .split(' ')
    .map(v => css[v])
    .concat(className2.split(' '))
    .join(' ')
    .trim();
};

/*
使用方法 Confim(options);
options={
  key:      'id'
  title:    '标题'
  content:  '内容'
  type:     'info|success|warning|error'
  onOk:     点击确定的回调|是否显示确定按钮
  onCancel:     点击取消的回调|是否显示取消按钮
  isShowInput: 是否显示输入框
  value: 传递之后才有默认value值,否则没有
  onChange:  input存在默认value时才有change事件
}
*/
const Confirm = (() => {
  var Confirm = function(options, context) {
    return new Confirm.prototype.init(options);
  };
  Confirm.prototype = {
    init: function(options = {}) {
      this.options = options;
      this.$container = undefined;
      this.createDom();
      this.attachEvents();
      return this;
    },
    createDom() {
      let key =
        this.options.key == undefined
          ? +new Date() + ''
          : this.options.key + '_confirm';
      $(`.confirmWrap.${key}`).remove();
      let classType = 'InfoSolid ';
      switch (this.options.type) {
        case 'info':
          classType = 'InfoSolid';
          break;
        case 'success':
          classType = 'CompletedSolid';
          break;
        case 'warning':
          classType = 'StatusErrorFull';
          break;
        case 'error':
          classType = 'StatusErrorFull';
          break;
      }
      const html = `
      <div class="${getNames('confirmWrap', `confirmWrap ${key}`)}">
        <div class="${css['modalWrap']}">
          <div class="${css['contentWrap']}">
            <div class="${css['content']}">
              <div class="${css['bodyWrap']}">
                <div class="${css['body']}">
                  <div class="${css['top']}">
                    <i class="ms-Icon ms-Icon--${classType} ${
        css[this.options.type || 'info']
      }" />
                    <span class="${css['title']}">
                      ${this.options.title || ''}
                    </span>
                    <div class="${css['msg']}">${
        this.options.isShowInput
          ? `<input autofocus class="${getNames('input', 'input')}" type="text" value= "${
              this.options.value ? this.options.value : ''
            }"
          />`
          : this.options.content || ''
      }</div>
                  </div>
                  <div class="${css['bottom']}">
      
                  ${
                    this.options.onDoNotSave
                      ? `<button type="button" class="${getNames(
                          'btn donotBtn',
                          'doNotBtn'
                        )}">
                        ${appConfig.language == 'zh' ? '不保存' : "Don't Save"}
                </button>`
                      : ``
                  }
                    ${
                      this.options.onCancel
                        ? `<button type="button" class="${getNames(
                            'btn',
                            'cancelBtn'
                          )}">
                          ${appConfig.language == 'zh' ? '取消' : 'Cancel'}
                  </button>`
                        : ``
                    }
                    ${
                      this.options.onSave
                        ? `<button type="button" class="${getNames(
                            'btn primary',
                            'SaveBtn'
                          )}">
                    ${appConfig.language == 'zh' ? '保存' : 'Save'}
                  </button>`
                        : ``
                    }
                    ${
                      this.options.onOk
                        ? `<button type="button" class="${getNames(
                            'btn primary',
                            'OKBtn'
                          )}">
                    ${appConfig.language == 'zh' ? '确认' : 'OK'}
                  </button>`
                        : ``
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
          `;

      $(this.options.contain || 'body').append($(html));
      this.$container = $(`.confirmWrap.${key}`);
    },
    attachEvents() {
      this.$container
        .find('.OKBtn')
        .off('click.OK')
        .on('click.OK', undefined, undefined, () => {
          let val = this.$container.find('input').val();
          let isRemove = this.options.onOk(val);
          isRemove = isRemove == undefined ? true : isRemove;
          if (isRemove) {
            this.$container.remove();
          }
        });
      this.$container
        .find('.SaveBtn')
        .off('click.OK')
        .on('click.OK', undefined, undefined, () => {
          let val = this.$container.find('input').val();
          let isRemove = this.options.onSave(val);
          isRemove = isRemove == undefined ? true : isRemove;
          if (isRemove) {
            this.$container.remove();
          }
        });
      this.$container
        .find('.cancelBtn')
        .off('click')
        .on('click', undefined, undefined, () => {
          this.options.onCancel && this.options.onCancel();
          this.$container.remove();
        });
      this.$container
        .find('.doNotBtn')
        .off('click')
        .on('click', undefined, undefined, () => {
          this.options.onDoNotSave && this.options.onDoNotSave();
          this.$container.remove();
        });
      this.$container
        .find('.input')
        .off('keyup')
        .on('keyup', undefined, undefined, e => {
          if (e.key === 'Enter') {
            let val = $(e.target).val();
            let isRemove = this.options.onOk(val);
            isRemove = isRemove == undefined ? true : isRemove;
            if (isRemove) {
              this.$container.remove();
            }
          }
        });
    }
  };
  Confirm.prototype.init.prototype = Confirm.prototype;
  return Confirm;
})();
export default Confirm;
