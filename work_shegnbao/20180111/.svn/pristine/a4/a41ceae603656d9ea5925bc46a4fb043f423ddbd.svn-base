// @flow
import { createStore, applyMiddleware } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import { createEpicMiddleware } from 'redux-observable';

import history from '../history';
import rootReducer from '../reducers';
import rootEpic from '../epics';

const router = routerMiddleware(history);

const epicMiddleware = createEpicMiddleware(rootEpic);

const enhancer = applyMiddleware(router, epicMiddleware);

export default function configureStore(initialState) {
    return createStore(rootReducer, initialState, enhancer);
}
