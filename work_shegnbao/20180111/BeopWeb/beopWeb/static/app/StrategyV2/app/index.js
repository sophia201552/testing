/**
 * 应用程序入口
 */
import './appConfig';

import React from 'react';
import './common/fix';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { push } from 'react-router-redux'
import { initializeIcons } from '@uifabric/icons';
import jquery from 'jquery';

/** 国际化处理 */
import { getLang } from './components/I18n';

import Root from './Root';
import configureStore from './redux/store/configureStore';
import history from './redux/history';

/** 日志工具 */
import logger from '@beopcloud/logger';

/** API 接口 */
import { ApiFetch } from './service/apiFetch';
import './service/api';

/** 全局样式 */
import './themes/default/preloader.global.css';
import './themes/default/app.global.css';

/** 引入 SVG Icon */
import './themes/default/iconfont/iconfont.js';

/** 引入 登录 */
import auth from './common/auth';
// 引入 icon 文件
initializeIcons();

window.$ = window.jQuery = jquery;
window.logger = logger;

/** 应用程序数据层初始化 */
export const store = configureStore();
/** api 调用工具类初始化 */
export const apiFetch = window.apiFetch = new ApiFetch();
/** 跳转方法 */
export const linkTo = (url) => {
  store.dispatch(push(url));
}

auth().then((login_result) => {
  render(
    <AppContainer>
      <Root store={store} history={history} />
    </AppContainer>,
    document.getElementById('container')
  );
});

if (module.hot) {
  module.hot.accept('./Root', () => {
    const NextRoot = require('./Root');
    render(
      <AppContainer>
        <NextRoot store={store} history={history} />
      </AppContainer>,
      document.getElementById('container')
    );
  });
}
