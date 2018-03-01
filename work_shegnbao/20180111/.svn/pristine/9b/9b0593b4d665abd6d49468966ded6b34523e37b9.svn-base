import { combineEpics } from 'redux-observable';
import homeEpics from './home';
import painterEpics from './painter';
import templateEpics from './template';
import {} from './painter';

const rootEpic = combineEpics(
  ...Object.values(homeEpics),
  ...Object.values(painterEpics),
  ...Object.values(templateEpics)
);

export default rootEpic;
