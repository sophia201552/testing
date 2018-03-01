export const getType = data => {
  let typeString = Object.prototype.toString.call(data);
  return typeString.slice(typeString.indexOf(' ') + 1, -1).toLowerCase();
};

export const isObject = data => {
  return getType(data) === 'object';
};

export const isArray = data => {
  return getType(data) === 'array';
};

export const isString = data => {
  return getType(data) === 'string';
};

export const isNumber = data => {
  return getType(data) === 'number';
};

/**
 * 判断是否是时间字符串数组
 * 例如：
 * ['2017-11-11 00:00:00', '2017-11-12 00:00:00']
 */
export const isTimeArray = data => {
  if (!isArray(data)) {
    return false;
  }
  for (let i = 0, len = data.length; i < len; i++) {
    let time = data[i];
    if (!isTimeString(time)) {
      return false;
    }
  }
  return true;
};

/** 
 * 判断是否是时间字符串
 * 例如：'2017-11-11 00:00:00'
 */
export const isTimeString = data => {
  if (!isString(data)) {
    return false;
  }
  return true;
};

/** 
 * 判断是否是合法的"取样间隔"字符串
 * 合法的取样间隔字符串有（不区分大小写）:
 * m1 - 1分钟
 * m5 - 5分钟
 * h1 - 1小时
 * d1 - 1天
 * 1m - 1个月
 * 1y - 1年
 */
export const isTimeFormatString = data => {
  if (!isString(data)) {
    return false;
  }
  return ['m1', 'm5', 'h1', 'd1', '1m', '1y'].indexOf(data.toLowerCase()) > -1;
}

/** 
 * 判断是否是数据源id格式
 * 例如：@72|AHU_OnOff
 */
export const isDataSourceId = data => {
  if (!isString(data)) {
    return false;
  }
  return /^@\d+?\|.+$/.test(data);
};

/** 
 * 判断是否是数据集对象
 * 例如：
 * {
 *   name: 'onoff01',
 *   value: [1, 1, 1, 1, 1, 1, 1]
 * }
 */
export const isDataSet = data => {
  if (!isObject(data)) {
    return false;
  }
  if (!data['name']) {
    return false;
  }
  if (!data['value'] || !isArray(data['value'])) {
    return false;
  }
  return true;
}

/** 
 * 判断是否是数据集数组
 * 例如：
 * [{
 *   name: 'onoff01',
 *   value: [1, 1, 1, 1, 1, 1, 1]
 * }, { ... }]
 */
export const isDataSetArray = data => {
  if (!isArray(data)) {
    return false;
  }
  for (let i = 0, len = data.length; i < len; i += 1) {
    if (!isDataSet(data[i])) {
      return false;
    }
  }
  return true;
};

/**
 * 判断是否是"方法配置"对象
 * 例如：
 * {
 *   'type': 'SVM',
 *   'C':1.0, 
 *   'epsilon':0.2,
 *   'kernel': 'rbf' # string, rbf|linear|poly|sigmoid|precomputed
 * }
 */
export const isMethodOpt = data => {
  if (!isObject(data)) {
    return false;
  }

  let type = data['type'];
  if (!type) {
    return false;
  }

  switch(type) {
    case 'PDT_SVM':
      return _isSvmMethodOpt(data);
    default:
      return false;
  }
}

/**
 * 判断是否是"SVM 方法配置"对象
 * 例如：
 * {
 *   'type': 'SVM',
 *   'C': 1.0, 
 *   'epsilon': 0.2,
 *   'kernel': 'rbf' # string, rbf|linear|poly|sigmoid|precomputed
 * }
 */
const _isSvmMethodOpt = data => {
  if (!data.hasOwnProperty('C') || !isNumber(data['C'])) {
    return false;
  }
  if (!data.hasOwnProperty('epsilon') || !isNumber(data['epsilon'])) {
    return false;
  }
  if (!data.hasOwnProperty('kernel') || !isString(data['kernel'])) {
    return false;
  }
  return true;
}

/**
 * 判断是否是"方法配置"对象数组
 * 例如：
 * [{
 *   'type': 'SVM',
 *   'C':1.0, 
 *   'epsilon':0.2,
 *   'kernel': 'rbf' # string, rbf|linear|poly|sigmoid|precomputed
 * }, { ... }]
 */
export const isMethodOptArray = data => {
  if (!isArray(data)) {
    return false;
  }
  for (let i = 0, len = data.length; i < len; i += 1) {
    if (!isMethodOpt(data[i])) {
      return false;
    }
  }
  return true;
}
