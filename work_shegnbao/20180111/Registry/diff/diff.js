/** 对象 diff 方法 */
/**
 * 四种差异类型：
 * 新增 - N
 * 删除 - D
 * 修改 - E
 * 数组变动 - A
 */
var class2type = {};
[
  'Boolean',
  'Number',
  'String',
  'Array',
  'Function',
  'Object',
  'Date',
  'RegExp',
  'Error'
].forEach(function(type) {
  class2type['[object ' + type + ']'] = type.toLowerCase();
});

function Diff(kind, path) {
  this.kind = kind;
  this.path = path || [];
}

/** 差异类型 - 新增 */
function DiffNew(path, value) {
  Diff.call(this, 'N', path);
  this.rhs = value;
}

/** 差异类型 - 删除 */
function DiffDelete(path, value) {
  Diff.call(this, 'D', path);
  this.lhs = value;
}

/** 差异类型 - 修改 */
function DiffEdit(path, origin, value) {
  Diff.call(this, 'E', path);
  this.lhs = origin;
  this.rhs = value;
}

/** 差异类型 - 数组变动 */
function DiffArray(path, index, item) {
  Diff.call(this, 'A', path);
  this.index = index;
  this.item = item;
}

function realTypeOf(subject) {
  // 处理 null 和 undefined
  if (subject == null) {
    return subject + '';
  }

  var type = Object.prototype.toString.call(subject);
  return class2type[type] || 'object';
}

function deepDiff(lhs, rhs, changes, process, path, key) {
  var currentPath;
  var ltype, rtype;
  var lkeys, rkeys;
  var rs;

  path = path || [];
  currentPath = path.slice(0);
  if (typeof key !== 'undefined') {
    currentPath.push(key);
  }

  ltype = realTypeOf(lhs);
  rtype = realTypeOf(rhs);
  if (typeof process === 'function') {
    rs = process(lhs, rhs, currentPath);
    if (rs === true) {
      if (ltype !== 'undefined' && rtype !== 'undefined') {
        changes(new DiffEdit(currentPath, lhs, rhs));
        return;
      }
    } else if (rs === false) {
      return;
    }
  }

  if (ltype === 'undefined') {
    if (rtype !== 'undefined') {
      changes(new DiffNew(currentPath, rhs));
    }
  } else if (rtype === 'undefined') {
    changes(new DiffDelete(currentPath, lhs));
  } else if (ltype !== rtype) {
    changes(new DiffEdit(currentPath, lhs, rhs));
  } else if (ltype === 'object') {
    lkeys = Object.keys(lhs);
    rkeys = Object.keys(rhs);

    lkeys.forEach(function(k) {
      var other = rkeys.indexOf(k);
      if (other >= 0) {
        deepDiff(lhs[k], rhs[k], changes, process, currentPath, k);
        rkeys.splice(rkeys.indexOf(k), 1);
      } else {
        deepDiff(lhs[k], undefined, changes, process, currentPath, k);
      }
    });

    rkeys.forEach(function(k) {
      deepDiff(undefined, rhs[k], changes, process, currentPath, k);
    });
  } else if (ltype === 'array') {
    for (var i = 0, len = lhs.length; i < len; i++) {
      if (i >= rhs.length) {
        changes(
          new DiffArray(currentPath, i, new DiffDelete(undefined, lhs[i]))
        );
      } else {
        deepDiff(lhs[i], rhs[i], changes, process, currentPath, i);
      }
    }

    while (i < rhs.length) {
      changes(new DiffArray(currentPath, i, new DiffNew(undefined, rhs[i++])));
    }
  } else if (lhs !== rhs) {
    changes(new DiffEdit(currentPath, lhs, rhs));
  }
}

function diff(lhs, rhs, process, format, accum) {
  var accum = accum || [];
  deepDiff(
    lhs,
    rhs,
    function(d) {
      if (d) {
        typeof format === 'function' && format(d);
        accum.push(d);
      }
    },
    process
  );
  return accum.length ? accum : null;
}
export default diff;
