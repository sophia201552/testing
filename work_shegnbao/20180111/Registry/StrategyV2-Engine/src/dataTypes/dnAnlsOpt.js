import I from 'seamless-immutable';

import { dataTypes } from '../enum';
import { isObject, isString, isArray } from './common';

export const isItemArr = data => {
  if (!isArray(data)) {
    return false;
  }
  for (let i = 0, len = data.length; i < len; i += 1) {
    if (!isObject(data[i])) {
      return false;
    }
    if (!isString(data[i].continuity)) {
      return false;
    }
    if (!isString(data[i].name)) {
      return false;
    }
    if (!isString(data[i].judge)) {
      return false;
    }
    if (!isString(data[i].term)) {
      return false;
    }
  }
  return true;
};

export const isRuleBlock = data => {
  if (!isArray(data)) {
    logger.warn('dnAnlsOpt ruleBlock 应为数组');
    return false;
  }

  for (let i = 0, len = data.length; i < len; i += 1) {
    if (!isObject(data[i])) {
      logger.warn('dnAnlsOpt ruleBlock 应为对象数组');
      return false;
    }
    if (!isItemArr(data[i].items)) {
      logger.warn('dnAnlsOpt ruleBlock items格式错误');
      return false;
    }
    if (!isItemArr(data[i].results)) {
      logger.warn('dnAnlsOpt ruleBlock results格式错误');
      return false;
    }
  }
  return true;
};

export const isDnAnlsOpt = data => {
  if (!isObject(data)) {
    logger.warn('dnAnlsOpt 应为对象');
    return false;
  }
  if (!isString(data['rule'])) {
    logger.warn('dnAnlsOpt rule 应为字符串');
    return false;
  }
  if (!isRuleBlock(data['ruleBlock'])) {
    return false;
  }

  return true;
};

const _createFromPlainJsObject = data => {
  if (!isDnAnlsOpt(data)) {
    return I({
      dataType: dataTypes.DN_ANLS_OPT,
      data: false
    });
  }

  return I({
    dataType: dataTypes.DN_ANLS_OPT,
    data
  });
};

const _createFromOtherDataTypes = (dataType, data) => {
  if (dataType === dataTypes.DN_ANLS_OPT) {
    return I({
      dataType,
      data
    });
  }
  return I({
    dataType: dataTypes.DN_ANLS_OPT,
    data: false
  });
};

/** static */
const create = function(data) {
  // 判断是否是单纯的 js 对象
  if (!data.hasOwnProperty('dataType')) {
    return _createFromPlainJsObject(data);
  }
  return _createFromOtherDataTypes(data['dataType'], data['data']);
};

export default {
  create
};
