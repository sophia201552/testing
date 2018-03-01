import LogicAnalysisPanel from './LogicAnalysisPanel';

import en from './en.js';
import zh from './zh.js';
import { I18N, getI18n } from '../../../components/I18n';
import WarnWrap from '../HOC/WarnWrap';


export default I18N(WarnWrap(LogicAnalysisPanel), getI18n({ en, zh }));

