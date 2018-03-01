import ConfigFileExcel from './ConfigFileExcel';

import en from './en.js';
import zh from './zh.js';
import { I18N, getI18n } from '../../../components/I18n';

export default I18N(ConfigFileExcel, getI18n({ en, zh }));