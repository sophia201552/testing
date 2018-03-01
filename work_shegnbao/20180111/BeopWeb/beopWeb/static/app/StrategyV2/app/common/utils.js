// 深度冻结对象
export function deepFreeze(obj) {
  let propNames = Object.getOwnPropertyNames(obj);
  propNames.forEach(name => {
    let prop = obj[name];
    if (typeof prop === 'object' && prop !== null) {
      deepFreeze(prop);
    }
  });
  return Object.freeze(obj);
}

export function downloadUrl(url) {
  var link = document.createElement('a');
  link.download = name;
  link.href = url;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  link = null;
}

export function headers2Object(headers) {
  const retHeaders = {};
  headers.forEach((val, key) => (retHeaders[key] = val));
  return retHeaders;
}

export function isDataMissing(data) {
  return data === '-'
}

export function tagMatch(srcArr, destArr) {
  if (!srcArr.length) {
      return 0;
  }

  let srcArrLen = srcArr.length;
  let destArrLen = destArr.length;
  // shadow copy
  srcArr = srcArr.slice();
  destArr = destArr.slice();

  let item, i = 0;
  while ( item = srcArr[i] ) {
      if (destArr.indexOf(item) > -1) {
          srcArr = srcArr.filter(row => row !== item);
          destArr = destArr.filter(row => row !== item);
      } else {
          i += 1;
      }
  }

  return Math.min(
      (srcArrLen - srcArr.length) / srcArrLen,
      (destArrLen - destArr.length) / destArrLen 
  );
}
