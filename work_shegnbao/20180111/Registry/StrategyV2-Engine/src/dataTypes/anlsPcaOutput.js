import I from 'seamless-immutable';

import { dataTypes } from '../enum';
import { DetectResult, isObject, isString, isArray, isNumber } from './common';

export const isPcaOutput = data => {
  if (!isArray(data)) {
    logger.warn('输出参数 应为数组');
    return false;
  }
  return true;
};

const _createFromPlainJsObject = data => {
  if (!isPcaOutput(data)) {
    return I({
      dataType: dataTypes.ANLS_PCA_OUTPUT,
      data: false
    });
  }
  return I({
    dataType: dataTypes.ANLS_PCA_OUTPUT,
    data
  });
};

const _createFromOtherDataTypes = (dataType, data) => {
  if (dataType === dataTypes.ANLS_PCA_OUTPUT) {
    return I({
      dataType,
      data
    });
  }
  return I({
    dataType: dataTypes.ANLS_PCA_OUTPUT,
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
