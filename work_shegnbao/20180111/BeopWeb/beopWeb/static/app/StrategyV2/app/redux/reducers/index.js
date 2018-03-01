import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import home from './home';
import painter from './painter';
import template from './template';

const rootReducer = combineReducers({
  routing,
  home,
  painter,
  template
});

export default rootReducer;
