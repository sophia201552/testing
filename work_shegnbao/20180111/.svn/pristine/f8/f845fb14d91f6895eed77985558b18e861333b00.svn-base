import I from 'seamless-immutable';

import { dataTypes } from '../enum';
import { isObject, isString, isArray } from './common';

const _createFromPlainJsObject = data => {
  if (!isObject(data)) {
    logger('data 应为对象');
    return I({
      dataType: dataTypes.ANLS_DATA_COMPLEMENT_OUTPUT,
      data: false
    });

    return I({
      dataType: dataTypes.ANLS_DATA_COMPLEMENT_OUTPUT,
      data
    });
  }
};

const _createFromOtherDataTypes = (dataType, data) => {
  if (dataType === dataTypes.ANLS_DATA_COMPLEMENT_OUTPUT) {
    return I({
      dataType,
      data
    });
  }
  return I({
    dataType: dataTypes.ANLS_DATA_COMPLEMENT_OUTPUT,
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
