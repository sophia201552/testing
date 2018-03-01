import React from 'react';
import { locale } from 'moment';
let lang = undefined;

export const setLang = function(resource) {
  if(resource) {
    localStorage.setItem('language', resource);
  } else {
    localStorage.setItem('language', 'zh');
  }
  lang = undefined

};

// 全局判断语言方法
export const getLang = function() {
  if (!lang) {
    lang = localStorage.getItem('language');
    if (lang === null) {
      lang = 'zh';
    }
  }
  return lang;
};

export const getI18n = function(resource) {
  let data = resource[getLang()];
  if (!data) {
    console.warn(`${getLang()} 未被支持`);
    return {};
  }
  return data;
};

export const I18N = (Component, i18n) => {
  return class newComponent extends React.PureComponent {
    static getComponent(){
      return Component
    }
    constructor(props) {
      super(props);
      this.getWrappedInstance = this.getWrappedInstance.bind(this);
    }
    getWrappedInstance(){
      return this.refs.Component;
    }
    render() {
      return <Component ref="Component" {...this.props} i18n={i18n} />;
    }
  };
};

window.I18n = {};
window.I18n.type = getLang();