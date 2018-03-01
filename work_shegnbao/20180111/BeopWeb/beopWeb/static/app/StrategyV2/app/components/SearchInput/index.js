import SearchInput from './SearchInput';

import en from './en.js';
import zh from './zh.js';
import { I18N, getI18n } from '../I18n';

export default I18N(SearchInput, getI18n({ en, zh }));