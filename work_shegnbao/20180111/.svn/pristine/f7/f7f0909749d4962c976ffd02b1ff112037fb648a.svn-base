import I from 'seamless-immutable';

import { dataTypes } from '../enum';
import { DetectResult, isObject, isString, isArray } from './common';

export const isDsHisQueryObject = data => {
  if (!isObject(data)) {
    logger.warn('dsHisQueryObject 应为对象');
    return false;
  }
  if (!isString(data['startTime'])) {
    logger.warn('startTime 应为字符串');
    return false;
  }
  if (!isString(data['endTime'])) {
    logger.warn('endTime 应为字符串');
    return false;
  }
  if (!isString(data['timeFormat'])) {
    logger.warn('timeFormat 应为字符串');
    return false;
  }
  return true;
};

const _createFromPlainJsObject = data => {
  if (!isDsHisQueryObject(data)) {
    return I({
      dataType: dataTypes.DS_HIS_QUERY,
      data: false
    });
  }
  return I({
    dataType: dataTypes.DS_HIS_QUERY,
    data
  });
};

const _createFromOtherDataTypes = (dataType, data) => {
  if (dataType === dataTypes.DS_HIS_QUERY) {
    return I({
      dataType,
      data
    });
  }
  return I({
    dataType: dataTypes.DS_HIS_QUERY,
    data: false
  });
};

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
