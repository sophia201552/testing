import I from 'seamless-immutable';

import { dataTypes } from '../enum';
import {
  isObject,
  isString,
  isNumber,
  isArray,
  isDataSetArray,
  isTimeArray
} from './common';
export const isAnlsEvaluateOutput = data => {
  if (!isObject(data)) {
    logger.warn('anlsEvaluateOutput 应为对象');
    return false;
  }
  if (!isDataSetArray(data['data'])) {
    logger.warn('anlsEvaluateOutput data 应为数据集数组');
  }
  if (!isTimeArray(data['time'])) {
    logger.warn('anlsEvaluateOutput time 应为时间数组');
  }
  return true;
};
const _createFromPlainJsObject = data => {
  if (!isAnlsEvaluateOutput(data)) {
    return I({
      dataType: dataTypes.ANLS_EVALUATE_OUTPUT,
      data: false
    });
  }

  return I({
    dataType: dataTypes.ANLS_EVALUATE_OUTPUT,
    data
  });
};

const _createFromOtherDataTypes = (dataType, data) => {
  if (dataType === dataTypes.ANLS_EVALUATE_OUTPUT) {
    return I({
      dataType,
      data
    });
  }
  return I({
    dataType: dataTypes.ANLS_EVALUATE_OUTPUT,
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
