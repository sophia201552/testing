import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware, push } from 'react-router-redux';
import { createLogger } from 'redux-logger';
import { createEpicMiddleware } from 'redux-observable';
import rootReducer from '../reducers';
import rootEpic from '../epics';
import history from '../history';

// 调试中可用的 actionCreators
const actionCreators = {
  push
};

const epicMiddleware = createEpicMiddleware(rootEpic);

// redux 日志扩展
const logger = createLogger({
  level: 'info',
  collapsed: true
});

// redux-react-router 扩展
const router = routerMiddleware(history);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      actionCreators
    })
  : compose;

const enhancer = composeEnhancers(applyMiddleware(router, epicMiddleware, logger));

export default function configureStore(initialState) {
  const store = createStore(rootReducer, initialState, enhancer);

  if (module.hot) {
    module.hot.accept('../reducers', () =>
      store.replaceReducer(require('../reducers'))
    );
  }

  return store;
}
