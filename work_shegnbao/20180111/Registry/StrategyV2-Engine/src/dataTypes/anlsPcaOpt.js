import I from 'seamless-immutable';

import { dataTypes } from '../enum';
import { DetectResult, isObject, isString, isArray, isNumber } from './common';

export const isPcaOpt = data => {
  if (!isObject(data)) {
    logger.warn('请求参数 应为对象');
    return false;
  }
  return true;
};

const _createFromPlainJsObject = data => {
  if (!isPcaOpt(data)) {
    return I({
      dataType: dataTypes.ANLS_PCA_OPT,
      data: false
    });
  }
  return I({
    dataType: dataTypes.ANLS_PCA_OPT,
    data
  });
};

const _createFromOtherDataTypes = (dataType, data) => {
  if (dataType === dataTypes.ANLS_PCA_OPT) {
    return I({
      dataType,
      data
    });
  }
  return I({
    dataType: dataTypes.ANLS_PCA_OPT,
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
