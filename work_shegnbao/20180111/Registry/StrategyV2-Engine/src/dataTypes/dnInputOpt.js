import I from 'seamless-immutable';

import { dataTypes } from '../enum';
import { DetectResult, isObject, isString, isArray, isNumber } from './common';

export const isStringType = data => {
  if (!isString(data['name'])) {
    logger.warn('name 应为字符串');
    return false;
  }
  if (!isString(data['alias'])) {
    logger.warn('alias 应为字符串');
    return false;
  }
  return true;
};

export const isNumberType = data => {
  if (!(isNumber(data['type']) || data['type'] == '')) {
    logger.warn('type 应为数字');
    return false;
  }
  if (!(isNumber(data['status']) || data['status'] == '')) {
    logger.warn('status 应为数字');
    return false;
  }
  if (!(isNumber(data['check']) || data['check'] == '')) {
    logger.warn('check 应为数字');
    return false;
  }
  if (!(isNumber(data['enabled']) || data['enabled'] == '')) {
    logger.warn('enabled 应为数字');
    return false;
  }
  if (!(isNumber(data['min']) || data['min'] == '')) {
    logger.warn('min 应为数字');
    return false;
  }
  if (!(isNumber(data['max']) || data['max'] == '')) {
    logger.warn('max 应为数字');
    return false;
  }
  if (!(isNumber(data['precision']) || data['precision'] == '')) {
    logger.warn('precision 应为数字');
    return false;
  }
  return true;
};

export const isTerm = data => {
  if (!isArray(data['terms'])) {
    logger.warn('terms 应为数组');
    return false;
  }
  for (let i = 0, len = data['terms'].length; i < len; i += 1) {
    let row = data['terms'][i];
    if (!isString(row['name'])) {
      logger.warn('name 应为字符串');
      return false;
    }
    if (!isNumber(row['type'])) {
      logger.warn('type 应为数字');
      return false;
    }
    if (!isArray(row['points'])) {
      logger.warn('points 应为数组');
      return false;
    }
  }
  return true;
};

export const isInputOptions = data => {
  if (!isArray(data)) {
    logger.warn('params 应为数组');
    return false;
  }
  for (let i = 0, len = data.length; i < len; i += 1) {
    if (!isObject(data[i])) {
      logger.warn('params数组里应为对象');
      return false;
    }
    if (!isStringType(data[i])) {
      return false;
    }
    if (!isNumberType(data[i])) {
      return false;
    }
    if (!isTerm(data[i])) {
      return false;
    }
  }
  return true;
};

const _createFromPlainJsObject = data => {
  if (!isInputOptions(data)) {
    return I({
      dataType: dataTypes.DN_INPUT_OPT,
      data: false
    });
  }
  return I({
    dataType: dataTypes.DN_INPUT_OPT,
    data
  });
};

const _createFromOtherDataTypes = (dataType, data) => {
  if (dataType === dataTypes.DN_INPUT_OPT) {
    return I({
      dataType,
      data
    });
  }
  return I({
    dataType: dataTypes.DN_INPUT_OPT,
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
