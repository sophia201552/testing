import I from 'seamless-immutable';

import { dataTypes } from '../enum';
import { isObject, isString, isArray } from './common';
import { isNumber } from 'util';

export const isDsRtOutput = data => {
  if (!isArray(data)) {
    logger.warn('dsRtOutput 应为数组');
    return false;
  }
  for (let i = 0, len = data.length; i < len; i += 1) {
    if (!isObject(data[i])) {
      logger.warn('dsRtOutput 应为对象数组');
      return false;
    }
    if(!isString(data[i].name)){
        logger.warn('dsRtOutput name 应为字符串');
        return false;
    }
    if(!isString(data[i].value)){
        logger.warn('dsRtOutput value 应为字符串');
        return false;
    }
  }

  return true;
};

const _createFromPlainJsObject = data => {
  if (!isDsRtOutput(data)) {
    return I({
      dataType: dataTypes.DS_RT_OUTPUT,
      data: false
    });
  }

  return I({
    dataType: dataTypes.DS_RT_OUTPUT,
    data
  });
};

const _createFromOtherDataTypes = (dataType, data) => {
  if (dataType === dataTypes.DS_RT_OUTPUT) {
    return I({
      dataType,
      data
    });
  }
  return I({
    dataType: dataTypes.DS_RT_OUTPUT,
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
