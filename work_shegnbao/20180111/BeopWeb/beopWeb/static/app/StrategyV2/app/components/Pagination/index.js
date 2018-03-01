import Pagination from './Pagination';

import en from './en.js';
import zh from './zh.js';
import { I18N, getI18n } from '../I18n';

export default I18N(Pagination, getI18n({ en, zh }));