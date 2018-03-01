import StrategyTemplate from './StrategyTemplate';

import en from './en.js';
import zh from './zh.js';
import { I18N, getI18n } from '../../../components/I18n';

export default I18N(StrategyTemplate, getI18n({ en, zh }));