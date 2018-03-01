import I from 'seamless-immutable';

import { dataTypes } from '../enum';
import { isObject, isString, isArray } from './common';

export const isDsOptObject = data => {
  if (!isObject(data)) {
    logger.warn('dsOptObject 应为对象');
    return false;
  }
  if (!isString(data['name'])) {
    logger.warn('name 应为字符串');
    return false;
  }
  if (!isString(data['dsId'])) {
    logger.warn('dsId 应为字符串');
    return false;
  }
  return true;
};

export const isDsOpt = data => {
  if (!isArray(data)) {
    logger.warn('dsOpt 应为数组');
    return false;
  }
  for (let i = 0, len = data.length; i < len; i += 1) {
    if (!isDsOptObject(data[i])) {
      return false;
    }
  }
  return true;
};

const _createFromPlainJsObject = data => {
  if (!isDsOpt(data)) {
    return I({
      dataType: dataTypes.DS_OPT,
      data: false
    });
  }
  return I({
    dataType: dataTypes.DS_OPT,
    data
  });
};

const _createFromOtherDataTypes = (dataType, data) => {
  if (dataType === dataTypes.DS_OPT) {
    return I({
      dataType,
      data
    });
  }
  return I({
    dataType: dataTypes.DS_OPT,
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
