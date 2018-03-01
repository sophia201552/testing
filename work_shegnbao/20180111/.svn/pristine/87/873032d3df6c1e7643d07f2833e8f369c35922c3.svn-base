(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 8);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
// 模块类型
const moduleTypes = exports.moduleTypes = {
  // ====== 数据接入类 1xx CON ======
  // 数据源
  CON_DATASOURCE: 101,
  // EXCEL文件
  CON_FILE_EXCEL: 102,

  // ====== 数据处理类 2xx PRE ======
  // 模糊规则
  PRE_TRANS_FUZZY: 201,
  // 数据去重
  PRE_DATA_DEDUPLICATION: 202,
  // 数据补齐
  PRE_DATA_COMPLEMENT: 203,
  // 离群点检测
  EXEC_OUTLIER_DETECTION: 204,
  // 数据归一化
  PRE_DATA_NORMALIZATION: 205,
  // 数据监测
  PRE_DATA_MONITORING: 206,
  // PCA
  PCA: 207,
  // featureSelection
  FEATURE_SELECTION: 208,
  //数据整理
  PRE_DATA_SORTING: 209,
  //数据导出
  PRE_DATA_EXPORT: 210,
  // 公式点

  // ====== 方法类 3xx FUNC ======
  // 逻辑分析
  FUNC_LOGIC_BOOLEAN: 301,
  // SVM 深度学习
  SVM: 302,
  // 线性回归

  // ====== 可视化类 4xx VSL======
  // 散点图
  SCATTER: 401,
  VSL_CHART: 402,

  // ====== 输出类 5xx OP ======
  // 诊断项
  OP_DIAGNOSIS_ITEM: 501,
  // 数据源
  OP_DATASOURCE: 502,

  // ====== 功能类 6xx EXEC ======
  // PYTHON 代码
  EXEC_PYTHON: 601,
  // 测试&评估
  EXEC_TEST: 602,
  // 相关性分析
  EXEC_ANLS_CORRELATION: 603,
  // 预测
  EXEC_ANLS_PREDICTION: 604,
  //评价模块
  PRE_DATA_EVALUATE: 605,

  // ====== 预测系列 7xx PDT ======
  // SVM
  PDT_SVM: 701,

  // ====== 聚类系列 8xx CLT ======
  // DB Scan
  CLT_DB_SCAN: 801
};

const dataTypes = exports.dataTypes = {
  MODULE_INFO: 'MODULE_INFO',
  DS_OPT: 'DS_OPT',
  DS_HIS_QUERY: 'DS_HIS_QUERY',
  DS_RT_QUERY: 'DS_RT_QUERY',
  DS_HIS_OUTPUT: 'DS_HIS_OUTPUT',
  DS_RT_OUTPUT: 'DS_RT_OUTPUT',
  DN_INPUT_OPT: 'DN_INPUT_OPT',
  DN_OUTPUT_OPT: 'DN_OUTPUT_OPT',
  DN_ANLS_OUTPUT: 'DN_ANLS_OUTPUT',
  DN_TEST_SCORE_OUTPUT: 'DN_TEST_SCORE_OUTPUT',
  DN_RES_SAVE_OUTPUT: 'DN_RES_SAVE_OUTPUT',
  DN_ANLS_OPT: 'DN_ANLS_OPT',
  ANLS_DEDUPLICATION_OPT: 'ANLS_DEDUPLICATION_OPT',
  ANLS_DEDUPLICATION_OUTPUT: 'ANLS_DEDUPLICATION_OUTPUT',
  ANLS_DATA_COMPLEMENT_OPT: 'ANLS_DATA_COMPLEMENT_OPT',
  ANLS_DATA_COMPLEMENT_OUTPUT: 'ANLS_DATA_COMPLEMENT_OUTPUT',
  ANLS_OUTLIER_DETECTING_OPT: 'ANLS_OUTLIER_DETECTING_OPT',
  ANLS_OUTLIER_DETECTING_OUTPUT: 'ANLS_OUTLIER_DETECTING_OUTPUT',
  ANLS_DATA_NORMALIZATION_OPT: 'ANLS_DATA_NORMALIZATION_OPT',
  ANLS_DATA_NORMALIZATION_OUTPUT: 'ANLS_DATA_NORMALIZATION_OUTPUT',
  ANLS_SVM_OPT: 'ANLS_SVM_OPT',
  ANLS_SVM_OUTPUT: 'ANLS_SVM_OUTPUT',
  ANLS_PREDICT_OPT: 'ANLS_PREDICT_OPT',
  ANLS_PREDICT_OUTPUT: 'ANLS_PREDICT_OUTPUT',
  ANLS_CLUSTERING_OPT: 'ANLS_CLUSTERING_OPT',
  ANLS_CLUSTERING_OUTPUT: 'ANLS_CLUSTERING_OUTPUT',
  PYTHON_OPT: 'PYTHON_OPT',
  PYTHON_OUTPUT: 'PYTHON_OUTPUT',
  ANLS_FEATURE_SELECTION_OPT: 'ANLS_FEATURE_SELECTION_OPT',
  ANLS_FEATURE_SELECTION_OUTPUT: 'ANLS_FEATURE_SELECTION_OUTPUT',
  ANLS_PCA_OPT: 'ANLS_PCA_OPT',
  ANLS_PCA_OUTPUT: 'ANLS_PCA_OUTPUT',
  ANLS_EVALUATE_OPT: 'ANLS_EVALUATE_OPT',
  ANLS_EVALUATE_OUTPUT: 'ANLS_EVALUATE_OUTPUT'
};

// 模块类型对应中文
const moduleTypeNames = exports.moduleTypeNames = Object.defineProperties({}, {
  [moduleTypes.CON_DATASOURCE]: {
    enumerable: true,
    get() {
      return I18n && I18n.type === 'zh' ? '数据源' : 'DataSource';
    }
  },
  [moduleTypes.PRE_TRANS_FUZZY]: {
    enumerable: true,
    get() {
      return I18n && I18n.type === 'zh' ? '模糊集合' : 'Fuzzy Set';
    }
  },
  [moduleTypes.PRE_DATA_DEDUPLICATION]: {
    enumerable: true,
    get() {
      return I18n && I18n.type === 'zh' ? '数据去重' : 'Data Deduplication';
    }
  },
  [moduleTypes.PRE_DATA_COMPLEMENT]: {
    enumerable: true,
    get() {
      return I18n && I18n.type === 'zh' ? '数据补齐' : 'Data Complement';
    }
  },
  [moduleTypes.PRE_DATA_NORMALIZATION]: {
    enumerable: true,
    get() {
      return I18n && I18n.type === 'zh' ? '数据归一化' : 'Data Normalization';
    }
  },
  [moduleTypes.PRE_DATA_MONITORING]: {
    enumerable: true,
    get() {
      return I18n && I18n.type === 'zh' ? '数据诊断' : 'Data Monitoring';
    }
  },
  [moduleTypes.PRE_DATA_EVALUATE]: {
    enumerable: true,
    get() {
      return I18n && I18n.type === 'zh' ? '评价' : 'Evaluate';
    }
  },
  [moduleTypes.PCA]: {
    enumerable: true,
    get() {
      return I18n && I18n.type === 'zh' ? 'PCA' : 'PCA';
    }
  },
  [moduleTypes.FEATURE_SELECTION]: {
    enumerable: true,
    get() {
      return I18n && I18n.type === 'zh' ? 'Feature Selection' : 'Feature Selection';
    }
  },
  [moduleTypes.PRE_DATA_SORTING]: {
    enumerable: true,
    get() {
      return I18n && I18n.type === 'zh' ? '数据整理' : 'Data Sorting';
    }
  },
  [moduleTypes.PRE_DATA_EXPORT]: {
    enumerable: true,
    get() {
      return I18n && I18n.type === 'zh' ? '数据导出' : 'Data Export';
    }
  },
  [moduleTypes.CLT_DB_SCAN]: {
    enumerable: true,
    get() {
      return I18n && I18n.type === 'zh' ? '聚类' : 'Clustering';
    }
  },
  [moduleTypes.EXEC_OUTLIER_DETECTION]: {
    enumerable: true,
    get() {
      return I18n && I18n.type === 'zh' ? '离群点' : 'Outliers';
    }
  },
  [moduleTypes.FUNC_LOGIC_BOOLEAN]: {
    enumerable: true,
    get() {
      return I18n && I18n.type === 'zh' ? '逻辑分析' : 'Logic Analysis';
    }
  },
  [moduleTypes.OP_DIAGNOSIS_ITEM]: {
    enumerable: true,
    get() {
      return I18n && I18n.type === 'zh' ? '诊断项' : 'Diagnosis Items';
    }
  },
  [moduleTypes.OP_DATASOURCE]: {
    enumerable: true,
    get() {
      return I18n && I18n.type === 'zh' ? '数据源' : 'DataSource';
    }
  },
  [moduleTypes.EXEC_PYTHON]: {
    enumerable: true,
    get() {
      return I18n && I18n.type === 'zh' ? 'Python' : 'Python';
    }
  },
  [moduleTypes.EXEC_TEST]: {
    enumerable: true,
    get() {
      return I18n && I18n.type === 'zh' ? '测试&评估' : 'Test&Evaluate';
    }
  },
  [moduleTypes.EXEC_ANLS_CORRELATION]: {
    enumerable: true,
    get() {
      return I18n && I18n.type === 'zh' ? '相关性分析' : 'Correlation Analysis';
    }
  },
  [moduleTypes.EXEC_ANLS_PREDICTION]: {
    enumerable: true,
    get() {
      return I18n && I18n.type === 'zh' ? '预测' : 'Prediction';
    }
  },
  [moduleTypes.CON_FILE_EXCEL]: {
    enumerable: true,
    get() {
      return I18n && I18n.type === 'zh' ? '文件导入' : 'Import File';
    }
  },
  [moduleTypes.DEEP_STUDY]: {
    enumerable: true,
    get() {
      return I18n && I18n.type === 'zh' ? '深度学习' : 'Deep Study';
    }
  },
  [moduleTypes.SVM]: {
    enumerable: true,
    get() {
      return I18n && I18n.type === 'zh' ? 'SVM' : 'SVM';
    }
  },
  [moduleTypes.SCATTER]: {
    enumerable: true,
    get() {
      return I18n && I18n.type === 'zh' ? '散点图' : 'Scatter Plot';
    }
  },
  [moduleTypes.PDT_SVM]: {
    enumerable: true,
    get() {
      return I18n && I18n.type === 'zh' ? 'SVR' : 'SVR';
    }
  },
  [moduleTypes.VSL_CHART]: {
    enumerable: true,
    get() {
      return I18n && I18n.type === 'zh' ? '图表' : 'Chart';
    }
  }
});

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;(function() {
  "use strict";

function immutableInit(config) {

  // https://github.com/facebook/react/blob/v15.0.1/src/isomorphic/classic/element/ReactElement.js#L21
  var REACT_ELEMENT_TYPE = typeof Symbol === 'function' && Symbol.for && Symbol.for('react.element');
  var REACT_ELEMENT_TYPE_FALLBACK = 0xeac7;

  var globalConfig = {
    use_static: false
  };
  if (isObject(config)) {
      if (config.use_static !== undefined) {
          globalConfig.use_static = Boolean(config.use_static);
      }
  }

  function isObject(data) {
    return (
      typeof data === 'object' &&
      !Array.isArray(data) &&
      data !== null
    );
  }

  function instantiateEmptyObject(obj) {
      var prototype = Object.getPrototypeOf(obj);
      if (!prototype) {
          return {};
      } else {
          return Object.create(prototype);
      }
  }

  function addPropertyTo(target, methodName, value) {
    Object.defineProperty(target, methodName, {
      enumerable: false,
      configurable: false,
      writable: false,
      value: value
    });
  }

  function banProperty(target, methodName) {
    addPropertyTo(target, methodName, function() {
      throw new ImmutableError("The " + methodName +
        " method cannot be invoked on an Immutable data structure.");
    });
  }

  var immutabilityTag = "__immutable_invariants_hold";

  function addImmutabilityTag(target) {
    addPropertyTo(target, immutabilityTag, true);
  }

  function isImmutable(target) {
    if (typeof target === "object") {
      return target === null || Boolean(
        Object.getOwnPropertyDescriptor(target, immutabilityTag)
      );
    } else {
      // In JavaScript, only objects are even potentially mutable.
      // strings, numbers, null, and undefined are all naturally immutable.
      return true;
    }
  }

  function isEqual(a, b) {
    // Avoid false positives due to (NaN !== NaN) evaluating to true
    return (a === b || (a !== a && b !== b));
  }

  function isMergableObject(target) {
    return target !== null && typeof target === "object" && !(Array.isArray(target)) && !(target instanceof Date);
  }

  var mutatingObjectMethods = [
    "setPrototypeOf"
  ];

  var nonMutatingObjectMethods = [
    "keys"
  ];

  var mutatingArrayMethods = mutatingObjectMethods.concat([
    "push", "pop", "sort", "splice", "shift", "unshift", "reverse"
  ]);

  var nonMutatingArrayMethods = nonMutatingObjectMethods.concat([
    "map", "filter", "slice", "concat", "reduce", "reduceRight"
  ]);

  var mutatingDateMethods = mutatingObjectMethods.concat([
    "setDate", "setFullYear", "setHours", "setMilliseconds", "setMinutes", "setMonth", "setSeconds",
    "setTime", "setUTCDate", "setUTCFullYear", "setUTCHours", "setUTCMilliseconds", "setUTCMinutes",
    "setUTCMonth", "setUTCSeconds", "setYear"
  ]);

  function ImmutableError(message) {
    this.name = 'MyError';
    this.message = message;
    this.stack = (new Error()).stack;
  }
  ImmutableError.prototype = new Error();
  ImmutableError.prototype.constructor = Error;

  function makeImmutable(obj, bannedMethods) {
    // Tag it so we can quickly tell it's immutable later.
    addImmutabilityTag(obj);

    if (true) {
      // Make all mutating methods throw exceptions.
      for (var index in bannedMethods) {
        if (bannedMethods.hasOwnProperty(index)) {
          banProperty(obj, bannedMethods[index]);
        }
      }

      // Freeze it and return it.
      Object.freeze(obj);
    }

    return obj;
  }

  function makeMethodReturnImmutable(obj, methodName) {
    var currentMethod = obj[methodName];

    addPropertyTo(obj, methodName, function() {
      return Immutable(currentMethod.apply(obj, arguments));
    });
  }

  function arraySet(idx, value, config) {
    var deep          = config && config.deep;

    if (idx in this) {
      if (deep && this[idx] !== value && isMergableObject(value) && isMergableObject(this[idx])) {
        value = Immutable.merge(this[idx], value, {deep: true, mode: 'replace'});
      }
      if (isEqual(this[idx], value)) {
        return this;
      }
    }

    var mutable = asMutableArray.call(this);
    mutable[idx] = Immutable(value);
    return makeImmutableArray(mutable);
  }

  var immutableEmptyArray = Immutable([]);

  function arraySetIn(pth, value, config) {
    var head = pth[0];

    if (pth.length === 1) {
      return arraySet.call(this, head, value, config);
    } else {
      var tail = pth.slice(1);
      var thisHead = this[head];
      var newValue;

      if (typeof(thisHead) === "object" && thisHead !== null) {
        // Might (validly) be object or array
        newValue = Immutable.setIn(thisHead, tail, value);
      } else {
        var nextHead = tail[0];
        // If the next path part is a number, then we are setting into an array, else an object.
        if (nextHead !== '' && isFinite(nextHead)) {
          newValue = arraySetIn.call(immutableEmptyArray, tail, value);
        } else {
          newValue = objectSetIn.call(immutableEmptyObject, tail, value);
        }
      }

      if (head in this && thisHead === newValue) {
        return this;
      }

      var mutable = asMutableArray.call(this);
      mutable[head] = newValue;
      return makeImmutableArray(mutable);
    }
  }

  function makeImmutableArray(array) {
    // Don't change their implementations, but wrap these functions to make sure
    // they always return an immutable value.
    for (var index in nonMutatingArrayMethods) {
      if (nonMutatingArrayMethods.hasOwnProperty(index)) {
        var methodName = nonMutatingArrayMethods[index];
        makeMethodReturnImmutable(array, methodName);
      }
    }

    if (!globalConfig.use_static) {
      addPropertyTo(array, "flatMap",  flatMap);
      addPropertyTo(array, "asObject", asObject);
      addPropertyTo(array, "asMutable", asMutableArray);
      addPropertyTo(array, "set", arraySet);
      addPropertyTo(array, "setIn", arraySetIn);
      addPropertyTo(array, "update", update);
      addPropertyTo(array, "updateIn", updateIn);
      addPropertyTo(array, "getIn", getIn);
    }

    for(var i = 0, length = array.length; i < length; i++) {
      array[i] = Immutable(array[i]);
    }

    return makeImmutable(array, mutatingArrayMethods);
  }

  function makeImmutableDate(date) {
    if (!globalConfig.use_static) {
      addPropertyTo(date, "asMutable", asMutableDate);
    }

    return makeImmutable(date, mutatingDateMethods);
  }

  function asMutableDate() {
    return new Date(this.getTime());
  }

  /**
   * Effectively performs a map() over the elements in the array, using the
   * provided iterator, except that whenever the iterator returns an array, that
   * array's elements are added to the final result instead of the array itself.
   *
   * @param {function} iterator - The iterator function that will be invoked on each element in the array. It will receive three arguments: the current value, the current index, and the current object.
   */
  function flatMap(iterator) {
    // Calling .flatMap() with no arguments is a no-op. Don't bother cloning.
    if (arguments.length === 0) {
      return this;
    }

    var result = [],
        length = this.length,
        index;

    for (index = 0; index < length; index++) {
      var iteratorResult = iterator(this[index], index, this);

      if (Array.isArray(iteratorResult)) {
        // Concatenate Array results into the return value we're building up.
        result.push.apply(result, iteratorResult);
      } else {
        // Handle non-Array results the same way map() does.
        result.push(iteratorResult);
      }
    }

    return makeImmutableArray(result);
  }

  /**
   * Returns an Immutable copy of the object without the given keys included.
   *
   * @param {array} keysToRemove - A list of strings representing the keys to exclude in the return value. Instead of providing a single array, this method can also be called by passing multiple strings as separate arguments.
   */
  function without(remove) {
    // Calling .without() with no arguments is a no-op. Don't bother cloning.
    if (typeof remove === "undefined" && arguments.length === 0) {
      return this;
    }

    if (typeof remove !== "function") {
      // If we weren't given an array, use the arguments list.
      var keysToRemoveArray = (Array.isArray(remove)) ?
         remove.slice() : Array.prototype.slice.call(arguments);

      // Convert numeric keys to strings since that's how they'll
      // come from the enumeration of the object.
      keysToRemoveArray.forEach(function(el, idx, arr) {
        if(typeof(el) === "number") {
          arr[idx] = el.toString();
        }
      });

      remove = function(val, key) {
        return keysToRemoveArray.indexOf(key) !== -1;
      };
    }

    var result = instantiateEmptyObject(this);

    for (var key in this) {
      if (this.hasOwnProperty(key) && remove(this[key], key) === false) {
        result[key] = this[key];
      }
    }

    return makeImmutableObject(result);
  }

  function asMutableArray(opts) {
    var result = [], i, length;

    if(opts && opts.deep) {
      for(i = 0, length = this.length; i < length; i++) {
        result.push(asDeepMutable(this[i]));
      }
    } else {
      for(i = 0, length = this.length; i < length; i++) {
        result.push(this[i]);
      }
    }

    return result;
  }

  /**
   * Effectively performs a [map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) over the elements in the array, expecting that the iterator function
   * will return an array of two elements - the first representing a key, the other
   * a value. Then returns an Immutable Object constructed of those keys and values.
   *
   * @param {function} iterator - A function which should return an array of two elements - the first representing the desired key, the other the desired value.
   */
  function asObject(iterator) {
    // If no iterator was provided, assume the identity function
    // (suggesting this array is already a list of key/value pairs.)
    if (typeof iterator !== "function") {
      iterator = function(value) { return value; };
    }

    var result = {},
        length = this.length,
        index;

    for (index = 0; index < length; index++) {
      var pair  = iterator(this[index], index, this),
          key   = pair[0],
          value = pair[1];

      result[key] = value;
    }

    return makeImmutableObject(result);
  }

  function asDeepMutable(obj) {
    if (
      (!obj) ||
      (typeof obj !== 'object') ||
      (!Object.getOwnPropertyDescriptor(obj, immutabilityTag)) ||
      (obj instanceof Date)
    ) { return obj; }
    return Immutable.asMutable(obj, {deep: true});
  }

  function quickCopy(src, dest) {
    for (var key in src) {
      if (Object.getOwnPropertyDescriptor(src, key)) {
        dest[key] = src[key];
      }
    }

    return dest;
  }

  /**
   * Returns an Immutable Object containing the properties and values of both
   * this object and the provided object, prioritizing the provided object's
   * values whenever the same key is present in both objects.
   *
   * @param {object} other - The other object to merge. Multiple objects can be passed as an array. In such a case, the later an object appears in that list, the higher its priority.
   * @param {object} config - Optional config object that contains settings. Supported settings are: {deep: true} for deep merge and {merger: mergerFunc} where mergerFunc is a function
   *                          that takes a property from both objects. If anything is returned it overrides the normal merge behaviour.
   */
  function merge(other, config) {
    // Calling .merge() with no arguments is a no-op. Don't bother cloning.
    if (arguments.length === 0) {
      return this;
    }

    if (other === null || (typeof other !== "object")) {
      throw new TypeError("Immutable#merge can only be invoked with objects or arrays, not " + JSON.stringify(other));
    }

    var receivedArray = (Array.isArray(other)),
        deep          = config && config.deep,
        mode          = config && config.mode || 'merge',
        merger        = config && config.merger,
        result;

    // Use the given key to extract a value from the given object, then place
    // that value in the result object under the same key. If that resulted
    // in a change from this object's value at that key, set anyChanges = true.
    function addToResult(currentObj, otherObj, key) {
      var immutableValue = Immutable(otherObj[key]);
      var mergerResult = merger && merger(currentObj[key], immutableValue, config);
      var currentValue = currentObj[key];

      if ((result !== undefined) ||
        (mergerResult !== undefined) ||
        (!currentObj.hasOwnProperty(key)) ||
        !isEqual(immutableValue, currentValue)) {

        var newValue;

        if (mergerResult) {
          newValue = mergerResult;
        } else if (deep && isMergableObject(currentValue) && isMergableObject(immutableValue)) {
          newValue = Immutable.merge(currentValue, immutableValue, config);
        } else {
          newValue = immutableValue;
        }

        if (!isEqual(currentValue, newValue) || !currentObj.hasOwnProperty(key)) {
          if (result === undefined) {
            // Make a shallow clone of the current object.
            result = quickCopy(currentObj, instantiateEmptyObject(currentObj));
          }

          result[key] = newValue;
        }
      }
    }

    function clearDroppedKeys(currentObj, otherObj) {
      for (var key in currentObj) {
        if (!otherObj.hasOwnProperty(key)) {
          if (result === undefined) {
            // Make a shallow clone of the current object.
            result = quickCopy(currentObj, instantiateEmptyObject(currentObj));
          }
          delete result[key];
        }
      }
    }

    var key;

    // Achieve prioritization by overriding previous values that get in the way.
    if (!receivedArray) {
      // The most common use case: just merge one object into the existing one.
      for (key in other) {
        if (Object.getOwnPropertyDescriptor(other, key)) {
          addToResult(this, other, key);
        }
      }
      if (mode === 'replace') {
        clearDroppedKeys(this, other);
      }
    } else {
      // We also accept an Array
      for (var index = 0, length = other.length; index < length; index++) {
        var otherFromArray = other[index];

        for (key in otherFromArray) {
          if (otherFromArray.hasOwnProperty(key)) {
            addToResult(result !== undefined ? result : this, otherFromArray, key);
          }
        }
      }
    }

    if (result === undefined) {
      return this;
    } else {
      return makeImmutableObject(result);
    }
  }

  function objectReplace(value, config) {
    var deep          = config && config.deep;

    // Calling .replace() with no arguments is a no-op. Don't bother cloning.
    if (arguments.length === 0) {
      return this;
    }

    if (value === null || typeof value !== "object") {
      throw new TypeError("Immutable#replace can only be invoked with objects or arrays, not " + JSON.stringify(value));
    }

    return Immutable.merge(this, value, {deep: deep, mode: 'replace'});
  }

  var immutableEmptyObject = Immutable({});

  function objectSetIn(path, value, config) {
    if (!(path instanceof Array) || path.length === 0) {
      throw new TypeError("The first argument to Immutable#setIn must be an array containing at least one \"key\" string.");
    }

    var head = path[0];
    if (path.length === 1) {
      return objectSet.call(this, head, value, config);
    }

    var tail = path.slice(1);
    var newValue;
    var thisHead = this[head];

    if (this.hasOwnProperty(head) && typeof(thisHead) === "object" && thisHead !== null) {
      // Might (validly) be object or array
      newValue = Immutable.setIn(thisHead, tail, value);
    } else {
      newValue = objectSetIn.call(immutableEmptyObject, tail, value);
    }

    if (this.hasOwnProperty(head) && thisHead === newValue) {
      return this;
    }

    var mutable = quickCopy(this, instantiateEmptyObject(this));
    mutable[head] = newValue;
    return makeImmutableObject(mutable);
  }

  function objectSet(property, value, config) {
    var deep          = config && config.deep;

    if (this.hasOwnProperty(property)) {
      if (deep && this[property] !== value && isMergableObject(value) && isMergableObject(this[property])) {
        value = Immutable.merge(this[property], value, {deep: true, mode: 'replace'});
      }
      if (isEqual(this[property], value)) {
        return this;
      }
    }

    var mutable = quickCopy(this, instantiateEmptyObject(this));
    mutable[property] = Immutable(value);
    return makeImmutableObject(mutable);
  }

  function update(property, updater) {
    var restArgs = Array.prototype.slice.call(arguments, 2);
    var initialVal = this[property];
    return Immutable.set(this, property, updater.apply(initialVal, [initialVal].concat(restArgs)));
  }

  function getInPath(obj, path) {
    /*jshint eqnull:true */
    for (var i = 0, l = path.length; obj != null && i < l; i++) {
      obj = obj[path[i]];
    }

    return (i && i == l) ? obj : undefined;
  }

  function updateIn(path, updater) {
    var restArgs = Array.prototype.slice.call(arguments, 2);
    var initialVal = getInPath(this, path);

    return Immutable.setIn(this, path, updater.apply(initialVal, [initialVal].concat(restArgs)));
  }

  function getIn(path, defaultValue) {
    var value = getInPath(this, path);
    return value === undefined ? defaultValue : value;
  }

  function asMutableObject(opts) {
    var result = instantiateEmptyObject(this), key;

    if(opts && opts.deep) {
      for (key in this) {
        if (this.hasOwnProperty(key)) {
          result[key] = asDeepMutable(this[key]);
        }
      }
    } else {
      for (key in this) {
        if (this.hasOwnProperty(key)) {
          result[key] = this[key];
        }
      }
    }

    return result;
  }

  // Creates plain object to be used for cloning
  function instantiatePlainObject() {
    return {};
  }

  // Finalizes an object with immutable methods, freezes it, and returns it.
  function makeImmutableObject(obj) {
    if (!globalConfig.use_static) {
      addPropertyTo(obj, "merge", merge);
      addPropertyTo(obj, "replace", objectReplace);
      addPropertyTo(obj, "without", without);
      addPropertyTo(obj, "asMutable", asMutableObject);
      addPropertyTo(obj, "set", objectSet);
      addPropertyTo(obj, "setIn", objectSetIn);
      addPropertyTo(obj, "update", update);
      addPropertyTo(obj, "updateIn", updateIn);
      addPropertyTo(obj, "getIn", getIn);
    }

    return makeImmutable(obj, mutatingObjectMethods);
  }

  // Returns true if object is a valid react element
  // https://github.com/facebook/react/blob/v15.0.1/src/isomorphic/classic/element/ReactElement.js#L326
  function isReactElement(obj) {
    return typeof obj === 'object' &&
           obj !== null &&
           (obj.$$typeof === REACT_ELEMENT_TYPE_FALLBACK || obj.$$typeof === REACT_ELEMENT_TYPE);
  }

  function isFileObject(obj) {
    return typeof File !== 'undefined' &&
           obj instanceof File;
  }

  function isPromise(obj) {
    return typeof obj === 'object' &&
           typeof obj.then === 'function';
  }

  function isError(obj) {
    return obj instanceof Error;
  }

  function Immutable(obj, options, stackRemaining) {
    if (isImmutable(obj) || isReactElement(obj) || isFileObject(obj) || isError(obj)) {
      return obj;
    } else if (isPromise(obj)) {
      return obj.then(Immutable);
    } else if (Array.isArray(obj)) {
      return makeImmutableArray(obj.slice());
    } else if (obj instanceof Date) {
      return makeImmutableDate(new Date(obj.getTime()));
    } else {
      // Don't freeze the object we were given; make a clone and use that.
      var prototype = options && options.prototype;
      var instantiateEmptyObject =
        (!prototype || prototype === Object.prototype) ?
          instantiatePlainObject : (function() { return Object.create(prototype); });
      var clone = instantiateEmptyObject();

      if (true) {
        /*jshint eqnull:true */
        if (stackRemaining == null) {
          stackRemaining = 64;
        }
        if (stackRemaining <= 0) {
          throw new ImmutableError("Attempt to construct Immutable from a deeply nested object was detected." +
            " Have you tried to wrap an object with circular references (e.g. React element)?" +
            " See https://github.com/rtfeldman/seamless-immutable/wiki/Deeply-nested-object-was-detected for details.");
        }
        stackRemaining -= 1;
      }

      for (var key in obj) {
        if (Object.getOwnPropertyDescriptor(obj, key)) {
          clone[key] = Immutable(obj[key], undefined, stackRemaining);
        }
      }

      return makeImmutableObject(clone);
    }
  }

  // Wrapper to allow the use of object methods as static methods of Immutable.
  function toStatic(fn) {
    function staticWrapper() {
      var args = [].slice.call(arguments);
      var self = args.shift();
      return fn.apply(self, args);
    }

    return staticWrapper;
  }

  // Wrapper to allow the use of object methods as static methods of Immutable.
  // with the additional condition of choosing which function to call depending
  // if argument is an array or an object.
  function toStaticObjectOrArray(fnObject, fnArray) {
    function staticWrapper() {
      var args = [].slice.call(arguments);
      var self = args.shift();
      if (Array.isArray(self)) {
          return fnArray.apply(self, args);
      } else {
          return fnObject.apply(self, args);
      }
    }

    return staticWrapper;
  }

  // Wrapper to allow the use of object methods as static methods of Immutable.
  // with the additional condition of choosing which function to call depending
  // if argument is an array or an object or a date.
  function toStaticObjectOrDateOrArray(fnObject, fnArray, fnDate) {
    function staticWrapper() {
      var args = [].slice.call(arguments);
      var self = args.shift();
      if (Array.isArray(self)) {
          return fnArray.apply(self, args);
      } else if (self instanceof Date) {
          return fnDate.apply(self, args);
      } else {
          return fnObject.apply(self, args);
      }
    }

    return staticWrapper;
  }

  // Export the library
  Immutable.from           = Immutable;
  Immutable.isImmutable    = isImmutable;
  Immutable.ImmutableError = ImmutableError;
  Immutable.merge          = toStatic(merge);
  Immutable.replace        = toStatic(objectReplace);
  Immutable.without        = toStatic(without);
  Immutable.asMutable      = toStaticObjectOrDateOrArray(asMutableObject, asMutableArray, asMutableDate);
  Immutable.set            = toStaticObjectOrArray(objectSet, arraySet);
  Immutable.setIn          = toStaticObjectOrArray(objectSetIn, arraySetIn);
  Immutable.update         = toStatic(update);
  Immutable.updateIn       = toStatic(updateIn);
  Immutable.getIn          = toStatic(getIn);
  Immutable.flatMap        = toStatic(flatMap);
  Immutable.asObject       = toStatic(asObject);
  if (!globalConfig.use_static) {
      Immutable.static = immutableInit({
          use_static: true
      });
  }

  Object.freeze(Immutable);

  return Immutable;
}

  var Immutable = immutableInit();
  /* istanbul ignore if */
  if (true) {
    !(__WEBPACK_AMD_DEFINE_RESULT__ = (function() {
      return Immutable;
    }).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else if (typeof module === "object") {
    module.exports = Immutable;
  } else if (typeof exports === "object") {
    exports.Immutable = Immutable;
  } else if (typeof window === "object") {
    window.Immutable = Immutable;
  } else if (typeof global === "object") {
    global.Immutable = Immutable;
  }
})();


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
const getType = exports.getType = data => {
  let typeString = Object.prototype.toString.call(data);
  return typeString.slice(typeString.indexOf(' ') + 1, -1).toLowerCase();
};

const isObject = exports.isObject = data => {
  return getType(data) === 'object';
};

const isArray = exports.isArray = data => {
  return getType(data) === 'array';
};

const isString = exports.isString = data => {
  return getType(data) === 'string';
};

const isNumber = exports.isNumber = data => {
  return getType(data) === 'number';
};

/**
 * 判断是否是时间字符串数组
 * 例如：
 * ['2017-11-11 00:00:00', '2017-11-12 00:00:00']
 */
const isTimeArray = exports.isTimeArray = data => {
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
const isTimeString = exports.isTimeString = data => {
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
const isTimeFormatString = exports.isTimeFormatString = data => {
  if (!isString(data)) {
    return false;
  }
  return ['m1', 'm5', 'h1', 'd1', '1m', '1y'].indexOf(data.toLowerCase()) > -1;
};

/** 
 * 判断是否是数据源id格式
 * 例如：@72|AHU_OnOff
 */
const isDataSourceId = exports.isDataSourceId = data => {
  if (!isString(data)) {
    return false;
  }
  return (/^@\d+?\|.+$/.test(data)
  );
};

/** 
 * 判断是否是数据集对象
 * 例如：
 * {
 *   name: 'onoff01',
 *   value: [1, 1, 1, 1, 1, 1, 1]
 * }
 */
const isDataSet = exports.isDataSet = data => {
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
};

/** 
 * 判断是否是数据集数组
 * 例如：
 * [{
 *   name: 'onoff01',
 *   value: [1, 1, 1, 1, 1, 1, 1]
 * }, { ... }]
 */
const isDataSetArray = exports.isDataSetArray = data => {
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
const isMethodOpt = exports.isMethodOpt = data => {
  if (!isObject(data)) {
    return false;
  }

  let type = data['type'];
  if (!type) {
    return false;
  }

  switch (type) {
    case 'PDT_SVM':
      return _isSvmMethodOpt(data);
    default:
      return false;
  }
};

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
};

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
const isMethodOptArray = exports.isMethodOptArray = data => {
  if (!isArray(data)) {
    return false;
  }
  for (let i = 0, len = data.length; i < len; i += 1) {
    if (!isMethodOpt(data[i])) {
      return false;
    }
  }
  return true;
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _seamlessImmutable = __webpack_require__(1);

var _seamlessImmutable2 = _interopRequireDefault(_seamlessImmutable);

var _enum = __webpack_require__(0);

var _dsOpt = __webpack_require__(16);

var _dsOpt2 = _interopRequireDefault(_dsOpt);

var _dsHisOutput = __webpack_require__(17);

var _dsHisOutput2 = _interopRequireDefault(_dsHisOutput);

var _dsHisQuery = __webpack_require__(18);

var _dsHisQuery2 = _interopRequireDefault(_dsHisQuery);

var _dsRtQuery = __webpack_require__(19);

var _dsRtQuery2 = _interopRequireDefault(_dsRtQuery);

var _dsRtOutput = __webpack_require__(20);

var _dsRtOutput2 = _interopRequireDefault(_dsRtOutput);

var _anlsSvmOpt = __webpack_require__(23);

var _anlsSvmOpt2 = _interopRequireDefault(_anlsSvmOpt);

var _anlsSvmOutput = __webpack_require__(24);

var _anlsSvmOutput2 = _interopRequireDefault(_anlsSvmOutput);

var _anlsPredictOpt = __webpack_require__(25);

var _anlsPredictOpt2 = _interopRequireDefault(_anlsPredictOpt);

var _anlsPredictOutput = __webpack_require__(26);

var _anlsPredictOutput2 = _interopRequireDefault(_anlsPredictOutput);

var _pythonOpt = __webpack_require__(27);

var _pythonOpt2 = _interopRequireDefault(_pythonOpt);

var _pythonOutput = __webpack_require__(28);

var _pythonOutput2 = _interopRequireDefault(_pythonOutput);

var _dnInputOpt = __webpack_require__(29);

var _dnInputOpt2 = _interopRequireDefault(_dnInputOpt);

var _dnOutputOpt = __webpack_require__(30);

var _dnOutputOpt2 = _interopRequireDefault(_dnOutputOpt);

var _dnAnlsOpt = __webpack_require__(31);

var _dnAnlsOpt2 = _interopRequireDefault(_dnAnlsOpt);

var _dnTestScoreOutput = __webpack_require__(32);

var _dnTestScoreOutput2 = _interopRequireDefault(_dnTestScoreOutput);

var _anlsDeduplicationOpt = __webpack_require__(33);

var _anlsDeduplicationOpt2 = _interopRequireDefault(_anlsDeduplicationOpt);

var _anlsDeduplicationOutput = __webpack_require__(34);

var _anlsDeduplicationOutput2 = _interopRequireDefault(_anlsDeduplicationOutput);

var _anlsDataComplementOpt = __webpack_require__(35);

var _anlsDataComplementOpt2 = _interopRequireDefault(_anlsDataComplementOpt);

var _anlsDataComplementOutput = __webpack_require__(36);

var _anlsDataComplementOutput2 = _interopRequireDefault(_anlsDataComplementOutput);

var _anlsOutlierDetectingOpt = __webpack_require__(37);

var _anlsOutlierDetectingOpt2 = _interopRequireDefault(_anlsOutlierDetectingOpt);

var _anlsOutlierDetectingOutput = __webpack_require__(38);

var _anlsOutlierDetectingOutput2 = _interopRequireDefault(_anlsOutlierDetectingOutput);

var _anlsClusteringOpt = __webpack_require__(39);

var _anlsClusteringOpt2 = _interopRequireDefault(_anlsClusteringOpt);

var _anlsClusteringOutput = __webpack_require__(40);

var _anlsClusteringOutput2 = _interopRequireDefault(_anlsClusteringOutput);

var _anlsFeatureSelectionOpt = __webpack_require__(41);

var _anlsFeatureSelectionOpt2 = _interopRequireDefault(_anlsFeatureSelectionOpt);

var _anlsFeatureSelectionOutput = __webpack_require__(42);

var _anlsFeatureSelectionOutput2 = _interopRequireDefault(_anlsFeatureSelectionOutput);

var _anlsPcaOpt = __webpack_require__(43);

var _anlsPcaOpt2 = _interopRequireDefault(_anlsPcaOpt);

var _anlsPcaOutput = __webpack_require__(44);

var _anlsPcaOutput2 = _interopRequireDefault(_anlsPcaOutput);

var _anlsDataNormalizationOpt = __webpack_require__(45);

var _anlsDataNormalizationOpt2 = _interopRequireDefault(_anlsDataNormalizationOpt);

var _anlsDataNormalizationOutput = __webpack_require__(46);

var _anlsDataNormalizationOutput2 = _interopRequireDefault(_anlsDataNormalizationOutput);

var _anlsEvaluateOpt = __webpack_require__(47);

var _anlsEvaluateOpt2 = _interopRequireDefault(_anlsEvaluateOpt);

var _anlsEvaluateOutput = __webpack_require__(48);

var _anlsEvaluateOutput2 = _interopRequireDefault(_anlsEvaluateOutput);

var _moduleInfo = __webpack_require__(49);

var _moduleInfo2 = _interopRequireDefault(_moduleInfo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const map = {
  [_enum.dataTypes.DS_OPT]: _dsOpt2.default,
  [_enum.dataTypes.DS_HIS_OUTPUT]: _dsHisOutput2.default,
  [_enum.dataTypes.DS_HIS_QUERY]: _dsHisQuery2.default,
  [_enum.dataTypes.DS_RT_QUERY]: _dsRtQuery2.default,
  [_enum.dataTypes.DS_RT_OUTPUT]: _dsRtOutput2.default,
  [_enum.dataTypes.ANLS_SVM_OPT]: _anlsSvmOpt2.default,
  [_enum.dataTypes.ANLS_SVM_OUTPUT]: _anlsSvmOutput2.default,
  [_enum.dataTypes.ANLS_PREDICT_OPT]: _anlsPredictOpt2.default,
  [_enum.dataTypes.ANLS_PREDICT_OUTPUT]: _anlsPredictOutput2.default,
  [_enum.dataTypes.PYTHON_OPT]: _pythonOpt2.default,
  [_enum.dataTypes.PYTHON_OUTPUT]: _pythonOutput2.default,
  [_enum.dataTypes.DN_INPUT_OPT]: _dnInputOpt2.default,
  [_enum.dataTypes.DN_OUTPUT_OPT]: _dnOutputOpt2.default,
  [_enum.dataTypes.DN_ANLS_OPT]: _dnAnlsOpt2.default,
  [_enum.dataTypes.DN_TEST_SCORE_OUTPUT]: _dnTestScoreOutput2.default,
  [_enum.dataTypes.ANLS_DEDUPLICATION_OPT]: _anlsDeduplicationOpt2.default,
  [_enum.dataTypes.ANLS_DEDUPLICATION_OUTPUT]: _anlsDeduplicationOutput2.default,
  [_enum.dataTypes.ANLS_DATA_COMPLEMENT_OPT]: _anlsDataComplementOpt2.default,
  [_enum.dataTypes.ANLS_DATA_COMPLEMENT_OUTPUT]: _anlsDataComplementOutput2.default,
  [_enum.dataTypes.ANLS_OUTLIER_DETECTING_OPT]: _anlsOutlierDetectingOpt2.default,
  [_enum.dataTypes.ANLS_OUTLIER_DETECTING_OUTPUT]: _anlsOutlierDetectingOutput2.default,
  [_enum.dataTypes.ANLS_CLUSTERING_OPT]: _anlsClusteringOpt2.default,
  [_enum.dataTypes.ANLS_CLUSTERING_OUTPUT]: _anlsClusteringOutput2.default,
  [_enum.dataTypes.ANLS_FEATURE_SELECTION_OPT]: _anlsFeatureSelectionOpt2.default,
  [_enum.dataTypes.ANLS_FEATURE_SELECTION_OUTPUT]: _anlsFeatureSelectionOutput2.default,
  [_enum.dataTypes.ANLS_PCA_OPT]: _anlsPcaOpt2.default,
  [_enum.dataTypes.ANLS_PCA_OUTPUT]: _anlsPcaOutput2.default,
  [_enum.dataTypes.ANLS_DATA_NORMALIZATION_OPT]: _anlsDataNormalizationOpt2.default,
  [_enum.dataTypes.ANLS_DATA_NORMALIZATION_OUTPUT]: _anlsDataNormalizationOutput2.default,
  [_enum.dataTypes.ANLS_EVALUATE_OPT]: _anlsEvaluateOpt2.default,
  [_enum.dataTypes.ANLS_EVALUATE_OUTPUT]: _anlsEvaluateOutput2.default,
  [_enum.dataTypes.MODULE_INFO]: _moduleInfo2.default
};

exports.default = {
  map,
  get: function (type) {
    let dtFactory = map[type];
    if (!dtFactory) {
      throw new Error(`未找到 ${type} 类型的构造方法.`);
    }
    return dtFactory;
  },
  createEmpty: function (type) {
    return (0, _seamlessImmutable2.default)({
      dataType: type,
      data: false
    });
  }
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _moduleConfig = __webpack_require__(5);

var _moduleConfig2 = _interopRequireDefault(_moduleConfig);

var _enum = __webpack_require__(0);

var _dataTypes = __webpack_require__(3);

var _dataTypes2 = _interopRequireDefault(_dataTypes);

var _diff = __webpack_require__(7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

let ChainNode = function () {
  function ChainNode(module) {
    _classCallCheck(this, ChainNode);

    this._in = [];
    this._out = [];
    this._module = module;
    this._chain = undefined;
    this._moduleInputData = [];
    this._moduleOutputData = [];
    this._moduleInfo = [];
    this._query = [];
    // 存储上一次的 query，用于做借口缓存
    this._lastQuery = this._query;
    this._response = [];

    this._fetchQueryPromise = undefined;
    this._fetchResponsePromise = undefined;
    this._fetchModuleInputDataPromise = undefined;
    this._fetchModuleOutputDataPromise = undefined;

    this._ignoreResponseCache = false;

    this.setModuleInfo();
  }

  _createClass(ChainNode, [{
    key: 'getInNodes',
    value: function getInNodes() {
      return this._in;
    }
  }, {
    key: 'getOutNodes',
    value: function getOutNodes() {
      return this._out;
    }
  }, {
    key: 'getModule',
    value: function getModule() {
      return this._module;
    }
  }, {
    key: 'getQuery',
    value: function getQuery() {
      if (this._fetchQueryPromise) {
        return this._fetchQueryPromise;
      }
      let supportDataTypes = _moduleConfig2.default[this._module.type];
      if (!supportDataTypes.query || !supportDataTypes.query.length) {
        return this._fetchQueryPromise = Promise.resolve().then(() => {
          this._fetchQueryPromise = undefined;
          return this._query = [];
        });
      }
      return this._fetchQueryPromise = Promise.all([this.getModule(), this.getModuleInputData()]).then(([md, mdInputData]) => {
        this._fetchQueryPromise = undefined;
        let query = [];
        let supportDataTypes = _moduleConfig2.default[this._module.type];
        // 获取最新的 query
        supportDataTypes.query.forEach(row => {
          query.push(this.createQueryData(row));
        });

        let diffRes = (0, _diff.diff)(this._query, query);
        if (!diffRes) {
          return this._query;
        }
        this._query = query;
        return query;
      }).catch(err => {
        this._fetchQueryPromise = undefined;
        logger.error(err);
      });
    }
  }, {
    key: 'getResponse',
    value: function getResponse() {
      if (this._fetchResponsePromise) {
        return this._fetchResponsePromise;
      }
      let supportDataTypes = _moduleConfig2.default[this._module.type];
      if (!supportDataTypes.response || !supportDataTypes.response.length) {
        return this._fetchResponsePromise = Promise.resolve().then(() => {
          this._fetchResponsePromise = undefined;
          return this._response = [];
        });
      }
      return this._fetchResponsePromise = Promise.all([this.getQuery()]).then(([query]) => {
        this._fetchResponsePromise = undefined;
        if (this._lastQuery === this._query) {
          return this._response;
        }

        return new Promise((resolve, reject) => {
          apiFetch.debugModule({
            type: this._module.type,
            data: query
          }).subscribe({
            next: resp => {
              let response = [];
              let supportDataTypes = _moduleConfig2.default[this._module.type];

              try {
                if (!resp.success) {
                  reject('接口调用失败');
                  return;
                }

                supportDataTypes.response.forEach(type => {
                  resp['data'].some(p => {
                    let rs = this.createResponseData(type, p);
                    if (rs.data === false) {
                      return false;
                    }
                    response.push(rs);
                    return true;
                  }); // params.some
                }); // response.forEach
                // 只有接口请求返回，并处理成功，才更新 _lastQuery
                this._lastQuery = this._query;
              } catch (err) {
                logger.warn(err);
                supportDataTypes.response.forEach(type => {
                  response.push(_dataTypes2.default.createEmpty(type));
                }); // response.forEach
              }

              let diffRes = (0, _diff.diff)(this._response, response);
              if (!diffRes) {
                resolve(this._response);
                return;
              }
              this._response = response;
              resolve(response);
            },
            error: err => {
              reject(err);
            }
          });
        });
      }).catch(err => {
        this._fetchResponsePromise = undefined;
        logger.error(err);
      });
    }
  }, {
    key: 'getModuleInputData',
    value: function getModuleInputData() {
      if (this._fetchModuleInputDataPromise) {
        return this._fetchModuleInputDataPromise;
      }
      let supportDataTypes = _moduleConfig2.default[this._module.type];
      if (!supportDataTypes.inputs || !supportDataTypes.inputs.length) {
        return this._fetchModuleInputDataPromise = Promise.resolve().then(() => {
          this._fetchModuleInputDataPromise = undefined;
          return this._moduleInputData = [];
        });
      }
      return this._fetchModuleInputDataPromise = Promise.all([...this._in.map(row => row.getModuleOutputData())]).then(params => {
        this._fetchModuleInputDataPromise = undefined;
        let moduleInputData = [];
        let supportDataTypes = _moduleConfig2.default[this._module.type];

        supportDataTypes.inputs.forEach(type => {
          let rs = params.some(p => {
            return p.some(arg => {
              let rs = this.createModuleInputData(type, arg);
              if (rs.data === false) {
                return false;
              }
              moduleInputData.push(rs);
              return true;
            }); // p.some
          }); // params.some
          if (!rs) {
            moduleInputData.push(_dataTypes2.default.createEmpty(type));
          }
        }); // inputs.forEach

        // diff
        let diffRes = (0, _diff.diff)(this._moduleInputData, moduleInputData);
        if (!diffRes) {
          return this._moduleInputData;
        }
        this._moduleInputData = moduleInputData;
        return moduleInputData;
      } // then
      ).catch(err => {
        this._fetchModuleInputDataPromise = undefined;
        logger.error(err);
      });
    }
  }, {
    key: 'getModuleOutputData',
    value: function getModuleOutputData() {
      if (this._fetchModuleOutputDataPromise) {
        return this._fetchModuleOutputDataPromise;
      }
      let supportDataTypes = _moduleConfig2.default[this._module.type];
      if (!supportDataTypes.outputs || !supportDataTypes.outputs.length) {
        return this._fetchModuleOutputDataPromise = Promise.resolve().then(() => {
          this._fetchModuleOutputDataPromise = undefined;
          return this._moduleOutputData = [];
        });
      }
      return this._fetchModuleOutputDataPromise = Promise.all([this.getModule(), this.getModuleInputData(), this.getResponse()]).then(() => {
        this._fetchModuleOutputDataPromise = undefined;
        let moduleOutputData = [];
        let supportDataTypes = _moduleConfig2.default[this._module.type];

        supportDataTypes.outputs.forEach(type => {
          moduleOutputData.push(this.createModuleOutputData(type));
        }); // forEach

        let diffRes = (0, _diff.diff)(this._moduleOutputData, moduleOutputData);
        if (!diffRes) {
          return this._moduleOutputData;
        }
        this._moduleOutputData = moduleOutputData;
        return moduleOutputData;
      }).catch(err => {
        this._fetchModuleOutputDataPromise = undefined;
        logger.error(err);
      });
    }
  }, {
    key: 'setModule',
    value: function setModule(module) {
      this._module = module;
      return this;
    }
  }, {
    key: 'setModuleInputData',
    value: function setModuleInputData(moduleInputData) {
      this._moduleInputData = moduleInputData;
      return this;
    }
  }, {
    key: 'setModuleOutputData',
    value: function setModuleOutputData(moduleOutputData) {
      this._moduleOutputData = moduleOutputData;
      return this;
    }
  }, {
    key: 'setResponse',
    value: function setResponse(response) {
      this._response = response;
      return this;
    }
  }, {
    key: 'setQuery',
    value: function setQuery(query) {
      this._query = query;
      return this;
    }
  }, {
    key: 'setModuleInfo',
    value: function setModuleInfo(moduleInfo) {
      if (!moduleInfo) {
        moduleInfo = _dataTypes2.default.get(_enum.dataTypes.MODULE_INFO).create({
          id: this._module._id,
          name: this._module.name || '',
          type: this._module.type
        });
      }
      this._moduleInfo = moduleInfo;
      return this;
    }
  }, {
    key: 'getChain',
    value: function getChain() {
      return this._chain;
    }
  }, {
    key: 'setChain',
    value: function setChain(chain) {
      this._chain = chain;
      return this;
    }
  }, {
    key: '_hasNode',
    value: function _hasNode(type, node) {
      let nodes = type === 'in' ? this._in : this._out;
      return !!nodes.find(n => n === node);
    }
  }, {
    key: 'hasInNode',
    value: function hasInNode(node) {
      return this._hasNode('in', node);
    }
  }, {
    key: 'hasOutNode',
    value: function hasOutNode(node) {
      return this._hasNode('out', node);
    }
  }, {
    key: 'chainTo',
    value: function chainTo(node) {
      if (!this.hasOutNode(node)) {
        this._out.push(node);
      }
      node._in.push(this);
      return this;
    }
  }, {
    key: 'chainedFrom',
    value: function chainedFrom(node) {
      if (!this.hasInNode(node)) {
        this._in.push(node);
      }
      node._out.push(this);
      return this;
    }
  }, {
    key: 'unchainTo',
    value: function unchainTo(node) {
      if (this.hasOutNode(node)) {
        this._out.splice(this._out.indexOf(node), 1);
      }
      node.unchainFrom(this);
      return this;
    }
  }, {
    key: 'unchainFrom',
    value: function unchainFrom(node) {
      if (this.hasInNode(node)) {
        this._in.splice(this._in.indexOf(node), 1);
      }
      node.unchainTo(this);
      return this;
    }
  }, {
    key: 'copy',
    value: function copy() {
      // TODO
    }
  }, {
    key: '_createData',
    value: function _createData(type, datalist) {
      let dtFactory = _dataTypes2.default.get(type);
      // 优先匹配 dataType 相同的
      let data = datalist.find(row => row.dataType === type);
      if (data) {
        return data;
      }

      // 如果没有 dataType 相同的，则尝试从其他类型的 dataType 进行转换
      datalist.some(row => {
        data = dtFactory.create(row);
        if (data.data === false) {
          return false;
        }
        return true;
      });

      if (!data) {
        return _dataTypes2.default.createEmpty(type);
      }
      return data;
    }
  }, {
    key: 'createModuleInputData',
    value: function createModuleInputData(type, data) {
      let dtFactory = _dataTypes2.default.get(type);
      return dtFactory.create(data);
    }
  }, {
    key: 'createModuleOutputData',
    value: function createModuleOutputData(type) {
      return this._createData(type, this._response.concat(this._moduleInputData).concat(this._moduleInfo));
    }
  }, {
    key: 'createQueryData',
    value: function createQueryData(type) {
      return this._createData(type, this._moduleInputData);
    }
  }, {
    key: 'createResponseData',
    value: function createResponseData(type, data) {
      let dtFactory = _dataTypes2.default.get(type);
      return dtFactory.create(data);
    }
  }]);

  return ChainNode;
}();

exports.default = ChainNode;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _enum = __webpack_require__(0);

/**
 * 一些原则
 * 1、response 和 inputs 中不要有重复类型的数据。
 * 如果实在需要重复，则需要在子类的 node 类中重写 createModuleOutputData 方法
 * 2、createModuleInputData 和 createResponseData 方法一般情况下不需要在 子类 中重写。
 * 如果需要重写，你要清楚你在干什么
 * 3、两个 dataType 不一样的数据单元，有可能可以互相转换
 */

exports.default = {
  [_enum.moduleTypes.CON_DATASOURCE]: {
    inputs: [],
    outputs: [_enum.dataTypes.DS_OPT, _enum.dataTypes.DS_HIS_OUTPUT, _enum.dataTypes.MODULE_INFO],
    query: [_enum.dataTypes.DS_OPT, _enum.dataTypes.DS_HIS_QUERY],
    response: [_enum.dataTypes.DS_OPT, _enum.dataTypes.DS_HIS_OUTPUT]
  },
  [_enum.moduleTypes.PRE_DATA_DEDUPLICATION]: {
    inputs: [_enum.dataTypes.DS_OPT, _enum.dataTypes.DS_HIS_OUTPUT],
    outputs: [_enum.dataTypes.DS_OPT, _enum.dataTypes.DS_HIS_OUTPUT],
    query: [_enum.dataTypes.ANLS_DEDUPLICATION_OPT],
    response: [_enum.dataTypes.ANLS_DEDUPLICATION_OUTPUT]
  },
  [_enum.moduleTypes.PRE_DATA_COMPLEMENT]: {
    inputs: [_enum.dataTypes.DS_OPT, _enum.dataTypes.DS_HIS_OUTPUT],
    outputs: [_enum.dataTypes.DS_OPT, _enum.dataTypes.DS_HIS_OUTPUT],
    query: [_enum.dataTypes.ANLS_DATA_COMPLEMENT_OPT],
    response: [_enum.dataTypes.ANLS_DATA_COMPLEMENT_OUTPUT]
  },
  [_enum.moduleTypes.PDT_SVM]: {
    inputs: [_enum.dataTypes.DS_OPT, _enum.dataTypes.DS_HIS_OUTPUT],
    outputs: [_enum.dataTypes.DS_OPT, _enum.dataTypes.ANLS_SVM_OUTPUT],
    query: [_enum.dataTypes.ANLS_SVM_OPT],
    response: [_enum.dataTypes.ANLS_SVM_OUTPUT]
  },
  [_enum.moduleTypes.EXEC_ANLS_PREDICTION]: {
    inputs: [_enum.dataTypes.DS_OPT, _enum.dataTypes.ANLS_SVM_OUTPUT],
    outputs: [_enum.dataTypes.DS_OPT, _enum.dataTypes.ANLS_PREDICT_OUTPUT],
    query: [_enum.dataTypes.DS_OPT, _enum.dataTypes.ANLS_PREDICT_OPT],
    response: [_enum.dataTypes.ANLS_PREDICT_OUTPUT]
  },
  [_enum.moduleTypes.EXEC_PYTHON]: {
    inputs: [],
    outputs: [_enum.dataTypes.PYTHON_OUTPUT],
    query: [_enum.dataTypes.PYTHON_OPT],
    response: [_enum.dataTypes.PYTHON_OUTPUT]
  },
  [_enum.moduleTypes.PRE_TRANS_FUZZY]: {
    inputs: [_enum.dataTypes.DS_OPT],
    outputs: [_enum.dataTypes.DN_INPUT_OPT],
    query: [],
    response: []
  },
  [_enum.moduleTypes.OP_DIAGNOSIS_ITEM]: {
    inputs: [_enum.dataTypes.DN_INPUT_OPT],
    outputs: [_enum.dataTypes.DN_OUTPUT_OPT],
    query: [],
    response: []
  },
  [_enum.moduleTypes.FUNC_LOGIC_BOOLEAN]: {
    inputs: [_enum.dataTypes.DN_INPUT_OPT, _enum.dataTypes.DN_OUTPUT_OPT],
    outputs: [_enum.dataTypes.DN_INPUT_OPT, _enum.dataTypes.DN_OUTPUT_OPT, _enum.dataTypes.DN_ANLS_OPT],
    query: [],
    response: []
  },
  [_enum.moduleTypes.EXEC_TEST]: {
    inputs: [_enum.dataTypes.DS_OPT, _enum.dataTypes.DN_INPUT_OPT, _enum.dataTypes.DN_OUTPUT_OPT, _enum.dataTypes.DN_ANLS_OPT],
    outputs: [_enum.dataTypes.DN_TEST_SCORE_OUTPUT],
    query: [_enum.dataTypes.DS_OPT, _enum.dataTypes.DN_INPUT_OPT, _enum.dataTypes.DN_OUTPUT_OPT, _enum.dataTypes.DN_ANLS_OPT],
    response: [_enum.dataTypes.DN_TEST_SCORE_OUTPUT]
  },
  [_enum.moduleTypes.EXEC_OUTLIER_DETECTION]: {
    inputs: [_enum.dataTypes.DS_OPT, _enum.dataTypes.DS_HIS_OUTPUT],
    outputs: [_enum.dataTypes.DS_OPT, _enum.dataTypes.DS_HIS_OUTPUT],
    query: [_enum.dataTypes.ANLS_OUTLIER_DETECTING_OPT],
    response: [_enum.dataTypes.ANLS_OUTLIER_DETECTING_OUTPUT]
  },
  [_enum.moduleTypes.CLT_DB_SCAN]: {
    inputs: [_enum.dataTypes.DS_OPT, _enum.dataTypes.DS_HIS_OUTPUT],
    outputs: [_enum.dataTypes.DS_OPT, _enum.dataTypes.DS_HIS_OUTPUT],
    query: [_enum.dataTypes.ANLS_CLUSTERING_OPT],
    response: [_enum.dataTypes.ANLS_CLUSTERING_OUTPUT]
  },
  [_enum.moduleTypes.CON_FILE_EXCEL]: {
    inputs: [],
    outputs: [_enum.dataTypes.DS_OPT, _enum.dataTypes.DS_HIS_OUTPUT],
    query: [],
    response: []
  },
  [_enum.moduleTypes.PCA]: {
    inputs: [_enum.dataTypes.DS_HIS_OUTPUT],
    outputs: [_enum.dataTypes.DS_OPT, _enum.dataTypes.DS_HIS_OUTPUT],
    query: [_enum.dataTypes.ANLS_PCA_OPT],
    response: [_enum.dataTypes.ANLS_PCA_OUTPUT]
  },
  [_enum.moduleTypes.FEATURE_SELECTION]: {
    inputs: [_enum.dataTypes.DS_OPT, _enum.dataTypes.DS_HIS_OUTPUT],
    outputs: [_enum.dataTypes.DS_OPT, _enum.dataTypes.DS_HIS_OUTPUT],
    query: [_enum.dataTypes.ANLS_FEATURE_SELECTION_OPT],
    response: [_enum.dataTypes.ANLS_FEATURE_SELECTION_OUTPUT]
  },
  [_enum.moduleTypes.PRE_DATA_SORTING]: {
    inputs: [_enum.dataTypes.DS_OPT, _enum.dataTypes.DS_HIS_OUTPUT, _enum.dataTypes.MODULE_INFO],
    outputs: [_enum.dataTypes.DS_OPT, _enum.dataTypes.DS_HIS_OUTPUT],
    query: [],
    response: []
  },
  [_enum.moduleTypes.PRE_DATA_EXPORT]: {
    inputs: [_enum.dataTypes.DS_OPT, _enum.dataTypes.DS_HIS_OUTPUT, _enum.dataTypes.MODULE_INFO],
    outputs: [_enum.dataTypes.DS_OPT, _enum.dataTypes.DS_HIS_OUTPUT],
    query: [],
    response: []
  },
  [_enum.moduleTypes.PRE_DATA_NORMALIZATION]: {
    inputs: [_enum.dataTypes.DS_OPT, _enum.dataTypes.DS_HIS_OUTPUT],
    outputs: [_enum.dataTypes.DS_OPT, _enum.dataTypes.DS_HIS_OUTPUT],
    query: [_enum.dataTypes.ANLS_DATA_NORMALIZATION_OPT],
    response: [_enum.dataTypes.ANLS_DATA_NORMALIZATION_OUTPUT]
  },
  [_enum.moduleTypes.PRE_DATA_MONITORING]: {
    inputs: [],
    outputs: [],
    query: [],
    response: []
  },
  [_enum.moduleTypes.PRE_DATA_EVALUATE]: {
    inputs: [_enum.dataTypes.DS_OPT, _enum.dataTypes.ANLS_SVM_OUTPUT],
    outputs: [],
    query: [_enum.dataTypes.ANLS_EVALUATE_OPT, _enum.dataTypes.DS_OPT],
    response: [_enum.dataTypes.ANLS_EVALUATE_OUTPUT]
  },
  [_enum.moduleTypes.VSL_CHART]: {
    inputs: [_enum.dataTypes.DS_HIS_OUTPUT],
    outputs: [_enum.dataTypes.DS_HIS_OUTPUT],
    query: [],
    response: []
  }
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, process) {// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = __webpack_require__(21);

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = __webpack_require__(22);

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(9), __webpack_require__(10)))

/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__diff__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__merge__ = __webpack_require__(51);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "diff", function() { return __WEBPACK_IMPORTED_MODULE_0__diff__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "merge", function() { return __WEBPACK_IMPORTED_MODULE_1__merge__["a"]; });





/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dataTypeFactory = exports.moduleConfig = exports.nodes = undefined;

var _logger = __webpack_require__(12);

var _logger2 = _interopRequireDefault(_logger);

var _analysis = __webpack_require__(13);

var _analysis2 = _interopRequireDefault(_analysis);

var _nodes = __webpack_require__(11);

var _nodes2 = _interopRequireDefault(_nodes);

var _moduleConfig = __webpack_require__(5);

var _moduleConfig2 = _interopRequireDefault(_moduleConfig);

var _dataTypes = __webpack_require__(3);

var _dataTypes2 = _interopRequireDefault(_dataTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (typeof window === "object") {
  window.logger = _logger2.default;
} else if (typeof global === "object") {
  global.logger = _logger2.default;
}

exports.default = _analysis2.default;
exports.nodes = _nodes2.default;
exports.moduleConfig = _moduleConfig2.default;
exports.dataTypeFactory = _dataTypes2.default;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(9)))

/***/ }),
/* 9 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 10 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _datasource = __webpack_require__(15);

var _datasource2 = _interopRequireDefault(_datasource);

var _analysisCorrelation = __webpack_require__(52);

var _analysisCorrelation2 = _interopRequireDefault(_analysisCorrelation);

var _prediction = __webpack_require__(53);

var _prediction2 = _interopRequireDefault(_prediction);

var _svm = __webpack_require__(54);

var _svm2 = _interopRequireDefault(_svm);

var _python = __webpack_require__(55);

var _python2 = _interopRequireDefault(_python);

var _fuzzy = __webpack_require__(56);

var _fuzzy2 = _interopRequireDefault(_fuzzy);

var _diagnosis = __webpack_require__(57);

var _diagnosis2 = _interopRequireDefault(_diagnosis);

var _logic = __webpack_require__(58);

var _logic2 = _interopRequireDefault(_logic);

var _execTest = __webpack_require__(59);

var _execTest2 = _interopRequireDefault(_execTest);

var _dataDeduplication = __webpack_require__(60);

var _dataDeduplication2 = _interopRequireDefault(_dataDeduplication);

var _dataComplement = __webpack_require__(61);

var _dataComplement2 = _interopRequireDefault(_dataComplement);

var _outlierDetection = __webpack_require__(62);

var _outlierDetection2 = _interopRequireDefault(_outlierDetection);

var _clustering = __webpack_require__(63);

var _clustering2 = _interopRequireDefault(_clustering);

var _fileExcel = __webpack_require__(64);

var _fileExcel2 = _interopRequireDefault(_fileExcel);

var _featureSelection = __webpack_require__(65);

var _featureSelection2 = _interopRequireDefault(_featureSelection);

var _pca = __webpack_require__(66);

var _pca2 = _interopRequireDefault(_pca);

var _normalization = __webpack_require__(67);

var _normalization2 = _interopRequireDefault(_normalization);

var _dataEvaluate = __webpack_require__(68);

var _dataEvaluate2 = _interopRequireDefault(_dataEvaluate);

var _dataMonitoring = __webpack_require__(69);

var _dataMonitoring2 = _interopRequireDefault(_dataMonitoring);

var _evaluate = __webpack_require__(70);

var _evaluate2 = _interopRequireDefault(_evaluate);

var _dataSorting = __webpack_require__(71);

var _dataSorting2 = _interopRequireDefault(_dataSorting);

var _dataExport = __webpack_require__(72);

var _dataExport2 = _interopRequireDefault(_dataExport);

var _chart = __webpack_require__(73);

var _chart2 = _interopRequireDefault(_chart);

var _enum = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  [_enum.moduleTypes.CON_DATASOURCE]: _datasource2.default,
  [_enum.moduleTypes.EXEC_ANLS_CORRELATION]: _analysisCorrelation2.default,
  [_enum.moduleTypes.EXEC_ANLS_PREDICTION]: _prediction2.default,
  [_enum.moduleTypes.PDT_SVM]: _svm2.default,
  [_enum.moduleTypes.EXEC_PYTHON]: _python2.default,
  [_enum.moduleTypes.PRE_TRANS_FUZZY]: _fuzzy2.default,
  [_enum.moduleTypes.OP_DIAGNOSIS_ITEM]: _diagnosis2.default,
  [_enum.moduleTypes.FUNC_LOGIC_BOOLEAN]: _logic2.default,
  [_enum.moduleTypes.EXEC_TEST]: _execTest2.default,
  [_enum.moduleTypes.PRE_DATA_DEDUPLICATION]: _dataDeduplication2.default,
  [_enum.moduleTypes.PRE_DATA_COMPLEMENT]: _dataComplement2.default,
  [_enum.moduleTypes.EXEC_OUTLIER_DETECTION]: _outlierDetection2.default,
  [_enum.moduleTypes.CLT_DB_SCAN]: _clustering2.default,
  [_enum.moduleTypes.CON_FILE_EXCEL]: _fileExcel2.default,
  [_enum.moduleTypes.FEATURE_SELECTION]: _featureSelection2.default,
  [_enum.moduleTypes.PCA]: _pca2.default,
  [_enum.moduleTypes.PRE_DATA_NORMALIZATION]: _normalization2.default,
  [_enum.moduleTypes.PRE_DATA_EVALUATE]: _dataEvaluate2.default,
  [_enum.moduleTypes.PRE_DATA_MONITORING]: _dataMonitoring2.default,
  [_enum.moduleTypes.PRE_DATA_EVALUATE]: _evaluate2.default,
  [_enum.moduleTypes.VSL_CHART]: _chart2.default,
  [_enum.moduleTypes.PRE_DATA_SORTING]: _dataSorting2.default,
  [_enum.moduleTypes.PRE_DATA_EXPORT]: _dataExport2.default
};

/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* WEBPACK VAR INJECTION */(function(process) {const LEVEL = {
  LOG: 1,
  INFO: 2,
  WARN: 3,
  ERROR: 4,
  EXCEPTION: 5
};

const envify = () => {
  const env = (process && process.env && "production") || 'production';
  switch (env) {
    case 'production':
      return LEVEL.ERROR;
    case 'development':
      return LEVEL.LOG;
    default:
      return LEVEL.ERROR;
  }
};

class Logger {
  constructor(level=LEVEL.ERROR) {
    this._level = level;
  }
  log() {
    if (this._level > LEVEL.LOG) return;
    this._out('log', arguments);
  }
  info() {
    if (this._level > LEVEL.INFO) return;
    this._out('info', arguments);
  }
  warn() {
    if (this._level > LEVEL.WARN) return;
    this._out('warn', arguments);
  }
  error() {
    if (this._level > LEVEL.ERROR) return;
    this._out('error', arguments);
  }
  exception(message, exception) {
    if (this._level > LEVEL.EXCEPTION) return;
    if (exception) {
      this.error('Exception: ', message, exception.stack || exception);
    } else {
      this.error('Exception: ', message);
    }
  }
  _out(type, args) {
    if (args) {
      args = Array.prototype.slice.call(args);
    }
    console[type].apply(console, args);
  }
}

/* harmony default export */ __webpack_exports__["default"] = (new Logger(envify()));

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(10)))

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _chain = __webpack_require__(14);

var _chain2 = _interopRequireDefault(_chain);

var _nodes = __webpack_require__(11);

var _nodes2 = _interopRequireDefault(_nodes);

var _chainNode = __webpack_require__(4);

var _chainNode2 = _interopRequireDefault(_chainNode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

let _class = function () {
  function _class() {
    _classCallCheck(this, _class);

    this._modules = undefined;
    this._chain = new _chain2.default();
  }

  _createClass(_class, [{
    key: 'setModules',
    value: function setModules(modules) {
      this._modules = modules;
      return this;
    }
  }, {
    key: 'findNodeByModuleId',
    value: function findNodeByModuleId(moduleId) {
      return this._chain.findNodeByModuleId(moduleId);
    }
    // 分析模块间关系

  }, {
    key: 'analysis',
    value: function analysis() {
      this._chain.clear();

      let nodes = this._modules.map(m => {
        let Clazz = _nodes2.default[m.type];
        if (!Clazz) {
          logger.warn(`不支持的模块类型'${m.type}'`);
          Clazz = _chainNode2.default;
        }
        let node = new Clazz(m);
        this._chain.add(node);
        return node;
      });
      let tailNodes = nodes.filter(n => {
        let m = n.getModule();
        return !m.outputs || m.outputs.length === 0;
      });

      let tailNode;
      while (tailNode = tailNodes.shift()) {
        let tailNodeModuleId = tailNode.getModule()._id;
        nodes.forEach(n => {
          let m = n.getModule();
          let outputs = (m.outputs || []).map(row => row._id);

          if (outputs.indexOf(tailNodeModuleId) > -1) {
            this._chain.chain(n, tailNode);
            tailNodes.push(n);
          }
        });
      }
      return this;
    }
  }, {
    key: 'dispose',
    value: function dispose() {}
  }]);

  return _class;
}();

exports.default = _class;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

let Chain = function () {
  function Chain() {
    _classCallCheck(this, Chain);

    this._heads = [];
    this._tails = [];
    this._nodes = [];
  }

  _createClass(Chain, [{
    key: "getHeads",
    value: function getHeads() {
      return this._heads;
    }
  }, {
    key: "getTails",
    value: function getTails() {
      return this._tails;
    }
  }, {
    key: "has",
    value: function has(node) {
      return this._nodes.indexOf(node);
    }
  }, {
    key: "findNodeByModuleId",
    value: function findNodeByModuleId(mid) {
      let node = this._nodes.find(n => n.getModule()._id === mid);
      return node;
    }
  }, {
    key: "add",
    value: function add(node) {
      node.setChain(this);
      this._nodes.push(node);
      this._refreshHeadTail();
      return this;
    }
  }, {
    key: "remove",
    value: function remove(node) {
      node.setChain();
      let idx = this._nodes.indexOf(node);
      if (idx === -1) {
        return this;
      }
      this._nodes.splice(idx, 1);
      this._refreshHeadTail();
      return this;
    }
  }, {
    key: "_refreshHeadTail",
    value: function _refreshHeadTail() {
      this._heads.length = 0;
      this._tails.length = 0;
      this._nodes.forEach(n => {
        if (n.getInNodes().length === 0) {
          this._heads.push(n);
        }
        if (n.getOutNodes().length === 0) {
          this._tails.push(n);
        }
      });
      return this;
    }
  }, {
    key: "chain",
    value: function chain(srcNode, destNode) {
      srcNode.chainTo(destNode);
      this._refreshHeadTail();
      return this;
    }
  }, {
    key: "unchain",
    value: function unchain(srcNode, destNode) {
      srcNode.unchainFrom(destNode);
      this._refreshHeadTail();
      return this;
    }
  }, {
    key: "createSubChainFromNode",
    value: function createSubChainFromNode(node) {}
  }, {
    key: "clear",
    value: function clear() {
      this._heads.length = 0;
      this._tails.length = 0;
      this._nodes.length = 0;
    }
  }]);

  return Chain;
}();

exports.default = Chain;

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _chainNode = __webpack_require__(4);

var _chainNode2 = _interopRequireDefault(_chainNode);

var _enum = __webpack_require__(0);

var _dataTypes = __webpack_require__(3);

var _dataTypes2 = _interopRequireDefault(_dataTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

let DataSourceChainNode = function (_ChainNode) {
  _inherits(DataSourceChainNode, _ChainNode);

  function DataSourceChainNode() {
    _classCallCheck(this, DataSourceChainNode);

    return _possibleConstructorReturn(this, (DataSourceChainNode.__proto__ || Object.getPrototypeOf(DataSourceChainNode)).apply(this, arguments));
  }

  _createClass(DataSourceChainNode, [{
    key: 'createQueryData',
    value: function createQueryData(type) {
      let data = _get(DataSourceChainNode.prototype.__proto__ || Object.getPrototypeOf(DataSourceChainNode.prototype), 'createQueryData', this).call(this, type);
      if (data.data !== false) {
        return data;
      }
      let options = this._module.options;
      let dtFactory;

      switch (type) {
        case _enum.dataTypes.DS_OPT:
          data = [];
          let group = options.groups.find(g => g._id === (options.activedGroup || 'Default'));
          if (!group) {
            logger.error('未在 groups 中找到对应的组.');
            return {};
          }
          options.params.forEach(row => {
            data.push({
              name: row.name,
              dsId: group.data[row.name]
            });
          });
          dtFactory = _dataTypes2.default.get(type);
          return dtFactory.create(data);
        case _enum.dataTypes.DS_HIS_QUERY:
          data = {};
          dtFactory = _dataTypes2.default.get(type);
          let timeConfig = options.timeConfig;

          return dtFactory.create({
            startTime: timeConfig.timeStart,
            endTime: timeConfig.timeEnd,
            timeFormat: timeConfig.timeFormat,
            completing: options.completing
          });
        default:
          logger.warn(`数据源 模块不支持创建'${type}'类型的 Query 数据`);
          return _dataTypes2.default.createEmpty(type);
      }
    }
  }]);

  return DataSourceChainNode;
}(_chainNode2.default);

exports.default = DataSourceChainNode;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isDsOpt = exports.isDsOptObject = undefined;

var _seamlessImmutable = __webpack_require__(1);

var _seamlessImmutable2 = _interopRequireDefault(_seamlessImmutable);

var _enum = __webpack_require__(0);

var _common = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const isDsOptObject = exports.isDsOptObject = data => {
  if (!(0, _common.isObject)(data)) {
    logger.warn('dsOptObject 应为对象');
    return false;
  }
  if (!(0, _common.isString)(data['name'])) {
    logger.warn('name 应为字符串');
    return false;
  }
  if (!(0, _common.isString)(data['dsId'])) {
    logger.warn('dsId 应为字符串');
    return false;
  }
  return true;
};

const isDsOpt = exports.isDsOpt = data => {
  if (!(0, _common.isArray)(data)) {
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
    return (0, _seamlessImmutable2.default)({
      dataType: _enum.dataTypes.DS_OPT,
      data: false
    });
  }
  return (0, _seamlessImmutable2.default)({
    dataType: _enum.dataTypes.DS_OPT,
    data
  });
};

const _createFromOtherDataTypes = (dataType, data) => {
  if (dataType === _enum.dataTypes.DS_OPT) {
    return (0, _seamlessImmutable2.default)({
      dataType,
      data
    });
  }
  return (0, _seamlessImmutable2.default)({
    dataType: _enum.dataTypes.DS_OPT,
    data: false
  });
};

/** static */
const create = function (data) {
  // 判断是否是单纯的 js 对象
  if (!data.hasOwnProperty('dataType')) {
    return _createFromPlainJsObject(data);
  }
  return _createFromOtherDataTypes(data['dataType'], data['data']);
};

exports.default = {
  create
};

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isHisOutput = exports.isHisOutputDataArray = exports.isHisOutputDataObject = undefined;

var _seamlessImmutable = __webpack_require__(1);

var _seamlessImmutable2 = _interopRequireDefault(_seamlessImmutable);

var _enum = __webpack_require__(0);

var _common = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const isHisOutputDataObject = exports.isHisOutputDataObject = data => {
  if (!(0, _common.isObject)(data)) {
    logger.warn('dsOptObject 应为对象');
    return false;
  }
  if (!(0, _common.isString)(data['name'])) {
    logger.warn('name 应为字符串');
    return false;
  }
  if (!(0, _common.isArray)(data['value'])) {
    logger.warn('value 格式有误');
    return false;
  }
  return true;
};

const isHisOutputDataArray = exports.isHisOutputDataArray = data => {
  if (!(0, _common.isArray)(data)) {
    logger.warn('HisOutputData 应为数组');
    return false;
  }
  for (let i = 0, len = data.length; i < len; i += 1) {
    if (!isHisOutputDataObject(data[i])) {
      return false;
    }
  }
  return true;
};

const isHisOutput = exports.isHisOutput = data => {
  if (!(0, _common.isObject)(data)) {
    logger.warn('hisOutput 应为对象');
    return false;
  }
  if (!(0, _common.isTimeArray)(data['time'])) {
    logger.warn('time 应为时间字符串数组');
    return false;
  }
  if (!isHisOutputDataArray(data['data'])) {
    return false;
  }
  return true;
};

const _createFromPlainJsObject = data => {
  if (!isHisOutput(data)) {
    return (0, _seamlessImmutable2.default)({
      dataType: _enum.dataTypes.DS_HIS_OUTPUT,
      data: false
    });
  }
  return (0, _seamlessImmutable2.default)({
    dataType: _enum.dataTypes.DS_HIS_OUTPUT,
    data
  });
};

const _createFromOtherDataTypes = (dataType, data) => {
  if (dataType === _enum.dataTypes.DS_HIS_OUTPUT) {
    return (0, _seamlessImmutable2.default)({
      dataType,
      data
    });
  }

  if (!data) {
    return (0, _seamlessImmutable2.default)({
      dataType: _enum.dataTypes.DS_HIS_OUTPUT,
      data: false
    });
  }

  // 从其他类型转换过来
  switch (dataType) {
    case _enum.dataTypes.ANLS_DEDUPLICATION_OUTPUT:
      return (0, _seamlessImmutable2.default)({
        dataType: _enum.dataTypes.DS_HIS_OUTPUT,
        data: {
          time: data.time,
          data: data.data.map(row => Object.assign({}, row, {
            value: row.value.map(v => (0, _common.isObject)(v) && v.type === 'DUPLICATED' ? '-' : v)
          }))
        }
      });
    case _enum.dataTypes.ANLS_DATA_COMPLEMENT_OUTPUT:
      return (0, _seamlessImmutable2.default)({
        dataType: _enum.dataTypes.DS_HIS_OUTPUT,
        data: {
          time: data.time,
          data: data.data.map(row => Object.assign({}, row, {
            value: row.value.map(v => (0, _common.isObject)(v) && v.type === 'COMPLETED' ? v.value : v)
          }))
        }
      });
    default:
      break;
  }

  return (0, _seamlessImmutable2.default)({
    dataType: _enum.dataTypes.DS_HIS_OUTPUT,
    data: false
  });
};

/** static */
const create = function (data) {
  // 判断是否是单纯的 js 对象
  if (!data.hasOwnProperty('dataType')) {
    return _createFromPlainJsObject(data);
  }
  return _createFromOtherDataTypes(data['dataType'], data['data']);
};

exports.default = {
  create
};

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isDsHisQueryObject = undefined;

var _seamlessImmutable = __webpack_require__(1);

var _seamlessImmutable2 = _interopRequireDefault(_seamlessImmutable);

var _enum = __webpack_require__(0);

var _common = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const isDsHisQueryObject = exports.isDsHisQueryObject = data => {
  if (!(0, _common.isObject)(data)) {
    logger.warn('dsHisQueryObject 应为对象');
    return false;
  }
  if (!(0, _common.isString)(data['startTime'])) {
    logger.warn('startTime 应为字符串');
    return false;
  }
  if (!(0, _common.isString)(data['endTime'])) {
    logger.warn('endTime 应为字符串');
    return false;
  }
  if (!(0, _common.isString)(data['timeFormat'])) {
    logger.warn('timeFormat 应为字符串');
    return false;
  }
  return true;
};

const _createFromPlainJsObject = data => {
  if (!isDsHisQueryObject(data)) {
    return (0, _seamlessImmutable2.default)({
      dataType: _enum.dataTypes.DS_HIS_QUERY,
      data: false
    });
  }
  return (0, _seamlessImmutable2.default)({
    dataType: _enum.dataTypes.DS_HIS_QUERY,
    data
  });
};

const _createFromOtherDataTypes = (dataType, data) => {
  if (dataType === _enum.dataTypes.DS_HIS_QUERY) {
    return (0, _seamlessImmutable2.default)({
      dataType,
      data
    });
  }
  return (0, _seamlessImmutable2.default)({
    dataType: _enum.dataTypes.DS_HIS_QUERY,
    data: false
  });
};

const create = function (data) {
  // 判断是否是单纯的 js 对象
  if (!data.hasOwnProperty('dataType')) {
    return _createFromPlainJsObject(data);
  }
  return _createFromOtherDataTypes(data['dataType'], data['data']);
};

exports.default = {
  create
};

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isDsRtQueryObject = undefined;

var _seamlessImmutable = __webpack_require__(1);

var _seamlessImmutable2 = _interopRequireDefault(_seamlessImmutable);

var _enum = __webpack_require__(0);

var _common = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const isDsRtQueryObject = exports.isDsRtQueryObject = data => {
  if (!(0, _common.isObject)(data)) {
    logger.warn('dsRtQueryObject 应为对象');
    return false;
  }
  return true;
};

const _createFromPlainJsObject = data => {
  if (!isDsRtQueryObject(data)) {
    return (0, _seamlessImmutable2.default)({
      dataType: _enum.dataTypes.DS_RT_QUERY,
      data: false
    });
  }
  return (0, _seamlessImmutable2.default)({
    dataType: _enum.dataTypes.DS_RT_QUERY,
    data
  });
};

const _createFromOtherDataTypes = (dataType, data) => {
  if (dataType === _enum.dataTypes.DS_RT_QUERY) {
    return (0, _seamlessImmutable2.default)({
      dataType,
      data
    });
  }
  return (0, _seamlessImmutable2.default)({
    dataType: _enum.dataTypes.DS_RT_QUERY,
    data: false
  });
};

const create = function (data) {
  // 判断是否是单纯的 js 对象
  if (!data.hasOwnProperty('dataType')) {
    return _createFromPlainJsObject(data);
  }
  return _createFromOtherDataTypes(data['dataType'], data['data']);
};

exports.default = {
  create
};

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isDsRtOutput = undefined;

var _seamlessImmutable = __webpack_require__(1);

var _seamlessImmutable2 = _interopRequireDefault(_seamlessImmutable);

var _enum = __webpack_require__(0);

var _common = __webpack_require__(2);

var _util = __webpack_require__(6);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const isDsRtOutput = exports.isDsRtOutput = data => {
  if (!(0, _common.isArray)(data)) {
    logger.warn('dsRtOutput 应为数组');
    return false;
  }
  for (let i = 0, len = data.length; i < len; i += 1) {
    if (!(0, _common.isObject)(data[i])) {
      logger.warn('dsRtOutput 应为对象数组');
      return false;
    }
    if (!(0, _common.isString)(data[i].name)) {
      logger.warn('dsRtOutput name 应为字符串');
      return false;
    }
    if (!(0, _common.isString)(data[i].value)) {
      logger.warn('dsRtOutput value 应为字符串');
      return false;
    }
  }

  return true;
};

const _createFromPlainJsObject = data => {
  if (!isDsRtOutput(data)) {
    return (0, _seamlessImmutable2.default)({
      dataType: _enum.dataTypes.DS_RT_OUTPUT,
      data: false
    });
  }

  return (0, _seamlessImmutable2.default)({
    dataType: _enum.dataTypes.DS_RT_OUTPUT,
    data
  });
};

const _createFromOtherDataTypes = (dataType, data) => {
  if (dataType === _enum.dataTypes.DS_RT_OUTPUT) {
    return (0, _seamlessImmutable2.default)({
      dataType,
      data
    });
  }
  return (0, _seamlessImmutable2.default)({
    dataType: _enum.dataTypes.DS_RT_OUTPUT,
    data: false
  });
};

/** static */
const create = function (data) {
  // 判断是否是单纯的 js 对象
  if (!data.hasOwnProperty('dataType')) {
    return _createFromPlainJsObject(data);
  }
  return _createFromOtherDataTypes(data['dataType'], data['data']);
};

exports.default = {
  create
};

/***/ }),
/* 21 */
/***/ (function(module, exports) {

module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}

/***/ }),
/* 22 */
/***/ (function(module, exports) {

if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isAnlsSvmOpt = exports.isOptions = undefined;

var _seamlessImmutable = __webpack_require__(1);

var _seamlessImmutable2 = _interopRequireDefault(_seamlessImmutable);

var _enum = __webpack_require__(0);

var _common = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const isOptions = exports.isOptions = data => {
  if (!(0, _common.isObject)(data)) {
    logger.warn('data 应为对象');
    return false;
  }
  if (!(0, _common.isArray)(data['independentVariables'])) {
    logger.warn('independentVariables 应为数组');
    return false;
  }
  if (!(0, _common.isArray)(data['dependentVariables'])) {
    logger.warn('dependentVariables 应为数组');
    return false;
  }
  if (!(0, _common.isNumber)(data['cvSplitRatio'])) {
    logger.warn('cvSplitRatio 应为数字');
    return false;
  }
  return true;
};

const isAnlsSvmOpt = exports.isAnlsSvmOpt = data => {
  if (!(0, _common.isObject)(data)) {
    logger.warn('anlsSvmOpt 应为对象');
    return false;
  }
  if (!(0, _common.isTimeArray)(data['time'])) {
    logger.warn('time 应为时间数组');
    return false;
  }
  if (!(0, _common.isMethodOptArray)(data['methods'])) {
    logger.warn('methods 应为相关的方法配置数组');
    return false;
  }
  if (!isOptions(data['options'])) {
    return false;
  }
  if (!(0, _common.isDataSetArray)(data['data'])) {
    logger.warn('data 应为数据集数组');
    return false;
  }
  return true;
};

const _createFromPlainJsObject = data => {
  if (!isAnlsSvmOpt(data)) {
    return (0, _seamlessImmutable2.default)({
      dataType: _enum.dataTypes.ANLS_SVM_OPT,
      data: false
    });
  }
  return (0, _seamlessImmutable2.default)({
    dataType: _enum.dataTypes.ANLS_SVM_OPT,
    data
  });
};

const _createFromOtherDataTypes = (dataType, data) => {
  if (dataType === _enum.dataTypes.ANLS_SVM_OPT) {
    return (0, _seamlessImmutable2.default)({
      dataType,
      data
    });
  }
  return (0, _seamlessImmutable2.default)({
    dataType: _enum.dataTypes.ANLS_SVM_OPT,
    data: false
  });
};

/** static */
const create = function (data) {
  // 判断是否是单纯的 js 对象
  if (!data.hasOwnProperty('dataType')) {
    return _createFromPlainJsObject(data);
  }
  return _createFromOtherDataTypes(data['dataType'], data['data']);
};

exports.default = {
  create
};

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isAnlsSvmOutput = exports.isEvaluation = undefined;

var _seamlessImmutable = __webpack_require__(1);

var _seamlessImmutable2 = _interopRequireDefault(_seamlessImmutable);

var _enum = __webpack_require__(0);

var _common = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const isEvaluation = exports.isEvaluation = data => {
  let evaluation = data['evaluation'];
  if (!(0, _common.isObject)(evaluation)) {
    logger.warn('evaluation 应为对象');
    return false;
  }
  let train = evaluation['train'];
  if (!(0, _common.isObject)(train)) {
    logger.warn('train 应为对象');
    return false;
  }
  if (!(0, _common.isNumber)(train['mean_squared_error'])) {
    logger.warn('mean_squared_error 应为数字');
    return false;
  }
  if (!(0, _common.isNumber)(train['mean_absolute_error'])) {
    logger.warn('mean_absolute_error 应为数字');
    return false;
  }
  if (!(0, _common.isNumber)(train['r2_score'])) {
    logger.warn('r2_score 应为数字');
    return false;
  }
  return true;
};

const isAnlsSvmOutput = exports.isAnlsSvmOutput = data => {
  if (!(0, _common.isObject)(data)) {
    logger.warn('anlsSvmOutput 应为对象');
    return false;
  }
  if (!(0, _common.isTimeArray)(data['time'])) {
    logger.warn('time 应为时间数组');
    return false;
  }
  if (!(0, _common.isString)(data['model'])) {
    logger.warn('model 应为字符串');
    return false;
  }
  if (!isEvaluation(data['evaluation'])) {
    return false;
  }
  if (!(0, _common.isDataSetArray)(data['data'])) {
    logger.warn('data 应为数据集数组');
    return false;
  }
  return true;
};

const _createFromPlainJsObject = data => {
  if (!isAnlsSvmOutput(data)) {
    return (0, _seamlessImmutable2.default)({
      dataType: _enum.dataTypes.ANLS_SVM_OUTPUT,
      data: false
    });
  }
  return (0, _seamlessImmutable2.default)({
    dataType: _enum.dataTypes.ANLS_SVM_OUTPUT,
    data
  });
};

const _createFromOtherDataTypes = (dataType, data) => {
  if (dataType === _enum.dataTypes.ANLS_SVM_OUTPUT) {
    return (0, _seamlessImmutable2.default)({
      dataType,
      data
    });
  }
  return (0, _seamlessImmutable2.default)({
    dataType: _enum.dataTypes.ANLS_SVM_OUTPUT,
    data: false
  });
};

/** static */
const create = function (data) {
  // 判断是否是单纯的 js 对象
  if (!data.hasOwnProperty('dataType')) {
    return _createFromPlainJsObject(data);
  }
  return _createFromOtherDataTypes(data['dataType'], data['data']);
};

exports.default = {
  create
};

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isAnlsPredictOpt = exports.isOptions = undefined;

var _seamlessImmutable = __webpack_require__(1);

var _seamlessImmutable2 = _interopRequireDefault(_seamlessImmutable);

var _ = __webpack_require__(3);

var _2 = _interopRequireDefault(_);

var _enum = __webpack_require__(0);

var _common = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const isOptions = exports.isOptions = data => {
  let options = data['options'];
  if (!(0, _common.isObject)(options)) {
    logger.warn('options 应为对象');
    return false;
  }
  if (!(0, _common.isString)(options['model'])) {
    logger.warn('model 应为字符串');
    return false;
  }
  if (!(0, _common.isArray)(options['dependentVariables'])) {
    logger.warn('dependentVariables 应为数组');
    return false;
  }
  if (!(0, _common.isArray)(options['independentVariables'])) {
    logger.warn('independentVariables 应为数组');
    return false;
  }
  if (!(0, _common.isTimeString)(options['startTime'])) {
    logger.warn('startTime 应为时间字符串');
    return false;
  }
  if (!(0, _common.isTimeString)(options['endTime'])) {
    logger.warn('endTime 应为时间字符串');
    return false;
  }
  if (!(0, _common.isTimeFormatString)(options['timeFormat'])) {
    logger.warn('timeFormat 应为取样间隔字符串');
    return false;
  }
  return true;
};

const isAnlsPredictOpt = exports.isAnlsPredictOpt = data => {
  if (!(0, _common.isObject)(data)) {
    logger.warn('anlsPredictOpt 应为对象');
    return false;
  }
  if (!isOptions(data)) {
    return false;
  }
  return true;
};

const _createFromPlainJsObject = data => {
  if (!isAnlsPredictOpt(data)) {
    return _2.default.createEmpty(_enum.dataTypes.ANLS_PREDICT_OPT);
  }
  return (0, _seamlessImmutable2.default)({
    dataType: _enum.dataTypes.ANLS_PREDICT_OPT,
    data
  });
};

const _createFromOtherDataTypes = (dataType, data) => {
  if (dataType === _enum.dataTypes.ANLS_PREDICT_OPT) {
    return (0, _seamlessImmutable2.default)({
      dataType,
      data
    });
  }
  return _2.default.createEmpty(_enum.dataTypes.ANLS_PREDICT_OPT);
};

/** static */
const create = function (data) {
  // 判断是否是单纯的 js 对象
  if (!data.hasOwnProperty('dataType')) {
    return _createFromPlainJsObject(data);
  }
  return _createFromOtherDataTypes(data['dataType'], data['data']);
};

exports.default = {
  create
};

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isAnlsPredictOutput = exports.isEvaluation = undefined;

var _seamlessImmutable = __webpack_require__(1);

var _seamlessImmutable2 = _interopRequireDefault(_seamlessImmutable);

var _enum = __webpack_require__(0);

var _common = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const isEvaluation = exports.isEvaluation = data => {
  let evaluation = data['evaluation'];
  if (!(0, _common.isObject)(evaluation)) {
    logger.warn('evaluation 应为对象');
    return false;
  }
  let train = evaluation['train'];
  if (!(0, _common.isObject)(train)) {
    logger.warn('train 应为对象');
    return false;
  }
  if (!(0, _common.isNumber)(train['mean_squared_error'])) {
    logger.warn('mean_squared_error 应为数字');
    return false;
  }
  if (!(0, _common.isNumber)(train['mean_absolute_error'])) {
    logger.warn('mean_absolute_error 应为数字');
    return false;
  }
  if (!(0, _common.isNumber)(train['r2_score'])) {
    logger.warn('r2_score 应为数字');
    return false;
  }
  return true;
};

const isAnlsPredictOutput = exports.isAnlsPredictOutput = data => {
  if (!(0, _common.isObject)(data)) {
    logger.warn('anlsPredictOutput 应为对象');
    return false;
  }
  if (!(0, _common.isTimeArray)(data['time'])) {
    logger.warn('time 应为时间数组');
    return false;
  }
  if (!isEvaluation(data)) {
    return false;
  }
  if (!(0, _common.isDataSetArray)(data['data'])) {
    logger.warn('data 应为数据集数组');
    return false;
  }
  return true;
};

const _createFromPlainJsObject = data => {
  if (!isAnlsPredictOutput(data)) {
    return (0, _seamlessImmutable2.default)({
      dataType: _enum.dataTypes.ANLS_PREDICT_OUTPUT,
      data: false
    });
  }
  return (0, _seamlessImmutable2.default)({
    dataType: _enum.dataTypes.ANLS_PREDICT_OUTPUT,
    data
  });
};

const _createFromOtherDataTypes = (dataType, data) => {
  if (dataType === _enum.dataTypes.ANLS_PREDICT_OUTPUT) {
    return (0, _seamlessImmutable2.default)({
      dataType,
      data
    });
  }
  return (0, _seamlessImmutable2.default)({
    dataType: _enum.dataTypes.ANLS_PREDICT_OUTPUT,
    data: false
  });
};

/** static */
const create = function (data) {
  // 判断是否是单纯的 js 对象
  if (!data.hasOwnProperty('dataType')) {
    return _createFromPlainJsObject(data);
  }
  return _createFromOtherDataTypes(data['dataType'], data['data']);
};

exports.default = {
  create
};

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isPythonOpt = exports.isParamsArray = undefined;

var _seamlessImmutable = __webpack_require__(1);

var _seamlessImmutable2 = _interopRequireDefault(_seamlessImmutable);

var _enum = __webpack_require__(0);

var _common = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const isParamsArray = exports.isParamsArray = data => {
  if (!(0, _common.isArray)(data)) {
    logger.warn('params 应为数组');
    return false;
  }

  for (let i = 0, len = data.length; i < len; i += 1) {
    if (!(0, _common.isString)(data[i].name)) {
      logger.warn('name 应为字符串');
      return false;
    }
    if (!(0, _common.isString)(data[i].value)) {
      logger.warn('value 应为字符串');
      return false;
    }
  }
  return true;
};

const isPythonOpt = exports.isPythonOpt = data => {
  if (!(0, _common.isObject)(data)) {
    logger.warn('pythonOpt 应为对象');
    return false;
  }
  if (!isParamsArray(data['params'])) {
    return false;
  }
  if (!(0, _common.isString)(data['code'])) {
    return false;
  }
  return true;
};

const _createFromPlainJsObject = data => {
  if (!isPythonOpt(data)) {
    return (0, _seamlessImmutable2.default)({
      dataType: _enum.dataTypes.PYTHON_OPT,
      data: false
    });
  }

  return (0, _seamlessImmutable2.default)({
    dataType: _enum.dataTypes.PYTHON_OPT,
    data
  });
};

const _createFromOtherDataTypes = (dataType, data) => {
  if (dataType === _enum.dataTypes.PYTHON_OPT) {
    return (0, _seamlessImmutable2.default)({
      dataType,
      data
    });
  }
  return (0, _seamlessImmutable2.default)({
    dataType: _enum.dataTypes.PYTHON_OPT,
    data: false
  });
};

/** static */
const create = function (data) {
  // 判断是否是单纯的 js 对象
  if (!data.hasOwnProperty('dataType')) {
    return _createFromPlainJsObject(data);
  }
  return _createFromOtherDataTypes(data['dataType'], data['data']);
};

exports.default = {
  create
};

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _seamlessImmutable = __webpack_require__(1);

var _seamlessImmutable2 = _interopRequireDefault(_seamlessImmutable);

var _enum = __webpack_require__(0);

var _common = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const _createFromPlainJsObject = data => {
  if (!(0, _common.isObject)(data)) {
    logger('data 应为对象');
    return (0, _seamlessImmutable2.default)({
      dataType: _enum.dataTypes.PYTHON_OUTPUT,
      data: false
    });

    return (0, _seamlessImmutable2.default)({
      dataType: _enum.dataTypes.PYTHON_OUTPUT,
      data
    });
  }
};

const _createFromOtherDataTypes = (dataType, data) => {
  if (dataType === _enum.dataTypes.PYTHON_OUTPUT) {
    return (0, _seamlessImmutable2.default)({
      dataType,
      data
    });
  }
  return (0, _seamlessImmutable2.default)({
    dataType: _enum.dataTypes.PYTHON_OUTPUT,
    data: false
  });
};

/** static */
const create = function (data) {
  // 判断是否是单纯的 js 对象
  if (!data.hasOwnProperty('dataType')) {
    return _createFromPlainJsObject(data);
  }
  return _createFromOtherDataTypes(data['dataType'], data['data']);
};

exports.default = {
  create
};

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isInputOptions = exports.isTerm = exports.isNumberType = exports.isStringType = undefined;

var _seamlessImmutable = __webpack_require__(1);

var _seamlessImmutable2 = _interopRequireDefault(_seamlessImmutable);

var _enum = __webpack_require__(0);

var _common = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const isStringType = exports.isStringType = data => {
  if (!(0, _common.isString)(data['name'])) {
    logger.warn('name 应为字符串');
    return false;
  }
  if (!(0, _common.isString)(data['alias'])) {
    logger.warn('alias 应为字符串');
    return false;
  }
  return true;
};

const isNumberType = exports.isNumberType = data => {
  if (!((0, _common.isNumber)(data['type']) || data['type'] == '')) {
    logger.warn('type 应为数字');
    return false;
  }
  if (!((0, _common.isNumber)(data['status']) || data['status'] == '')) {
    logger.warn('status 应为数字');
    return false;
  }
  if (!((0, _common.isNumber)(data['check']) || data['check'] == '')) {
    logger.warn('check 应为数字');
    return false;
  }
  if (!((0, _common.isNumber)(data['enabled']) || data['enabled'] == '')) {
    logger.warn('enabled 应为数字');
    return false;
  }
  if (!((0, _common.isNumber)(data['min']) || data['min'] == '')) {
    logger.warn('min 应为数字');
    return false;
  }
  if (!((0, _common.isNumber)(data['max']) || data['max'] == '')) {
    logger.warn('max 应为数字');
    return false;
  }
  if (!((0, _common.isNumber)(data['precision']) || data['precision'] == '')) {
    logger.warn('precision 应为数字');
    return false;
  }
  return true;
};

const isTerm = exports.isTerm = data => {
  if (!(0, _common.isArray)(data['terms'])) {
    logger.warn('terms 应为数组');
    return false;
  }
  for (let i = 0, len = data['terms'].length; i < len; i += 1) {
    let row = data['terms'][i];
    if (!(0, _common.isString)(row['name'])) {
      logger.warn('name 应为字符串');
      return false;
    }
    if (!(0, _common.isNumber)(row['type'])) {
      logger.warn('type 应为数字');
      return false;
    }
    if (!(0, _common.isArray)(row['points'])) {
      logger.warn('points 应为数组');
      return false;
    }
  }
  return true;
};

const isInputOptions = exports.isInputOptions = data => {
  if (!(0, _common.isArray)(data)) {
    logger.warn('params 应为数组');
    return false;
  }
  for (let i = 0, len = data.length; i < len; i += 1) {
    if (!(0, _common.isObject)(data[i])) {
      logger.warn('params数组里应为对象');
      return false;
    }
    if (!isStringType(data[i])) {
      return false;
    }
    if (!isNumberType(data[i])) {
      return false;
    }
    if (!isTerm(data[i])) {
      return false;
    }
  }
  return true;
};

const _createFromPlainJsObject = data => {
  if (!isInputOptions(data)) {
    return (0, _seamlessImmutable2.default)({
      dataType: _enum.dataTypes.DN_INPUT_OPT,
      data: false
    });
  }
  return (0, _seamlessImmutable2.default)({
    dataType: _enum.dataTypes.DN_INPUT_OPT,
    data
  });
};

const _createFromOtherDataTypes = (dataType, data) => {
  if (dataType === _enum.dataTypes.DN_INPUT_OPT) {
    return (0, _seamlessImmutable2.default)({
      dataType,
      data
    });
  }
  return (0, _seamlessImmutable2.default)({
    dataType: _enum.dataTypes.DN_INPUT_OPT,
    data: false
  });
};

/** static */
const create = function (data) {
  // 判断是否是单纯的 js 对象
  if (!data.hasOwnProperty('dataType')) {
    return _createFromPlainJsObject(data);
  }
  return _createFromOtherDataTypes(data['dataType'], data['data']);
};

exports.default = {
  create
};

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isOutputOptions = exports.isNullObject = exports.isEnergyConfig = exports.isChart = exports.isNumberType = exports.isStringType = undefined;

var _seamlessImmutable = __webpack_require__(1);

var _seamlessImmutable2 = _interopRequireDefault(_seamlessImmutable);

var _enum = __webpack_require__(0);

var _common = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const isStringType = exports.isStringType = data => {
  if (!(0, _common.isString)(data['name'])) {
    logger.warn('name 应为字符串');
    return false;
  }
  if (!(0, _common.isString)(data['targetGroup'])) {
    logger.warn('targetGroup 应为字符串');
    return false;
  }
  if (!(0, _common.isString)(data['faultTypeGroup'])) {
    logger.warn('faultTypeGroup 应为字符串');
    return false;
  }
  return true;
};
const isNumberType = exports.isNumberType = data => {
  if (!((0, _common.isNumber)(data['faultId']) || data['faultId'] == '')) {
    logger.warn('faultId 应为数字');
    return false;
  }
  if (!((0, _common.isNumber)(data['faultTag']) || data['faultTag'] == '')) {
    logger.warn('faultTag 应为数字');
    return false;
  }
  if (!(0, _common.isNumber)(data['runDay'])) {
    logger.warn('runDay 应为数字');
    return false;
  }
  if (!(0, _common.isNumber)(data['runMonth'])) {
    logger.warn('runMonth 应为数字');
    return false;
  }
  if (!(0, _common.isNumber)(data['runWeek'])) {
    logger.warn('runWeek 应为数字');
    return false;
  }
  if (!(0, _common.isNumber)(data['runYear'])) {
    logger.warn('runYear 应为数字');
    return false;
  }
  if (!(0, _common.isNumber)(data['status'])) {
    logger.warn('status 应为数字');
    return false;
  }
  if (!((0, _common.isNumber)(data['targetExecutor']) || data['faultTag'] == '')) {
    logger.warn('targetExecutor 应为数字');
    return false;
  }
  return true;
};
const isChart = exports.isChart = data => {
  if (!(0, _common.isArray)(data['chart'])) {
    logger.warn('chart 应为数组');
    return false;
  }
  for (let j = 0, len = data['chart'].length; j < len; j += 1) {
    if (!(0, _common.isObject)(data['chart'][j])) {
      logger.warn('chart数组里应为对象');
      return false;
    }
    if (!(0, _common.isString)(data['chart'][j]['name'])) {
      logger.warn('chart下的name 应为字符串');
      return false;
    }
    if (!(0, _common.isNumber)(data['chart'][j]['type'])) {
      logger.warn('chart下的type 应为数字');
      return false;
    }
  }
  return true;
};
const isEnergyConfig = exports.isEnergyConfig = data => {
  if (!(0, _common.isObject)(data['energyConfig'])) {
    logger.warn('energyConfig 应为对象');
    return false;
  }
  // if (!isNullObject(data['energyConfig'])) {
  //   if (!isString(data['energyConfig']['name'])) {
  //     logger.warn('energyConfig name 应为字符串');
  //     return false;
  //   }
  //   if (!isObject(data['energyConfig']['parameters'])) {
  //     logger.warn('energyConfig parameters 应为对象');
  //     return false;
  //   }
  //   for (let key in data['energyConfig']['parameters']) {
  //     if (!isNumber(data['energyConfig']['parameters'][key])) {
  //       logger.warn('energyConfig  parameters 应为数字');
  //       return false;
  //     }
  //   }
  // }
  return true;
};
const isNullObject = exports.isNullObject = data => {
  if (JSON.stringify(data) === '{}') {
    return true;
  } else {
    return false;
  }
};
const isOutputOptions = exports.isOutputOptions = data => {
  if (!(0, _common.isArray)(data)) {
    logger.warn('params 应为数组');
    return false;
  }
  for (let i = 0, len = data.length; i < len; i += 1) {
    if (!(0, _common.isObject)(data[i])) {
      logger.warn('params数组里应为对象');
      return false;
    }
    if (!isStringType(data[i])) {
      return false;
    }
    if (!isNumberType(data[i])) {
      return false;
    }
    if (!isChart(data[i])) {
      return false;
    }
    if (!isEnergyConfig(data[i])) {
      return false;
    }
  }
  return true;
};

const _createFromPlainJsObject = data => {
  if (!isOutputOptions(data)) {
    return (0, _seamlessImmutable2.default)({
      dataType: _enum.dataTypes.DN_OUTPUT_OPT,
      data: false
    });
  }
  return (0, _seamlessImmutable2.default)({
    dataType: _enum.dataTypes.DN_OUTPUT_OPT,
    data
  });
};

const _createFromOtherDataTypes = (dataType, data) => {
  if (dataType === _enum.dataTypes.DN_OUTPUT_OPT) {
    return (0, _seamlessImmutable2.default)({
      dataType,
      data
    });
  }
  return (0, _seamlessImmutable2.default)({
    dataType: _enum.dataTypes.DN_OUTPUT_OPT,
    data: false
  });
};

/** static */
const create = function (data) {
  // 判断是否是单纯的 js 对象
  if (!data.hasOwnProperty('dataType')) {
    return _createFromPlainJsObject(data);
  }
  return _createFromOtherDataTypes(data['dataType'], data['data']);
};

exports.default = {
  create
};

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isDnAnlsOpt = exports.isRuleBlock = exports.isItemArr = undefined;

var _seamlessImmutable = __webpack_require__(1);

var _seamlessImmutable2 = _interopRequireDefault(_seamlessImmutable);

var _enum = __webpack_require__(0);

var _common = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const isItemArr = exports.isItemArr = data => {
  if (!(0, _common.isArray)(data)) {
    return false;
  }
  for (let i = 0, len = data.length; i < len; i += 1) {
    if (!(0, _common.isObject)(data[i])) {
      return false;
    }
    if (!(0, _common.isString)(data[i].continuity)) {
      return false;
    }
    if (!(0, _common.isString)(data[i].name)) {
      return false;
    }
    if (!(0, _common.isString)(data[i].judge)) {
      return false;
    }
    if (!(0, _common.isString)(data[i].term)) {
      return false;
    }
  }
  return true;
};

const isRuleBlock = exports.isRuleBlock = data => {
  if (!(0, _common.isArray)(data)) {
    logger.warn('dnAnlsOpt ruleBlock 应为数组');
    return false;
  }

  for (let i = 0, len = data.length; i < len; i += 1) {
    if (!(0, _common.isObject)(data[i])) {
      logger.warn('dnAnlsOpt ruleBlock 应为对象数组');
      return false;
    }
    if (!isItemArr(data[i].items)) {
      logger.warn('dnAnlsOpt ruleBlock items格式错误');
      return false;
    }
    if (!isItemArr(data[i].results)) {
      logger.warn('dnAnlsOpt ruleBlock results格式错误');
      return false;
    }
  }
  return true;
};

const isDnAnlsOpt = exports.isDnAnlsOpt = data => {
  if (!(0, _common.isObject)(data)) {
    logger.warn('dnAnlsOpt 应为对象');
    return false;
  }
  if (!(0, _common.isString)(data['rule'])) {
    logger.warn('dnAnlsOpt rule 应为字符串');
    return false;
  }
  if (!isRuleBlock(data['ruleBlock'])) {
    return false;
  }

  return true;
};

const _createFromPlainJsObject = data => {
  if (!isDnAnlsOpt(data)) {
    return (0, _seamlessImmutable2.default)({
      dataType: _enum.dataTypes.DN_ANLS_OPT,
      data: false
    });
  }

  return (0, _seamlessImmutable2.default)({
    dataType: _enum.dataTypes.DN_ANLS_OPT,
    data
  });
};

const _createFromOtherDataTypes = (dataType, data) => {
  if (dataType === _enum.dataTypes.DN_ANLS_OPT) {
    return (0, _seamlessImmutable2.default)({
      dataType,
      data
    });
  }
  return (0, _seamlessImmutable2.default)({
    dataType: _enum.dataTypes.DN_ANLS_OPT,
    data: false
  });
};

/** static */
const create = function (data) {
  // 判断是否是单纯的 js 对象
  if (!data.hasOwnProperty('dataType')) {
    return _createFromPlainJsObject(data);
  }
  return _createFromOtherDataTypes(data['dataType'], data['data']);
};

exports.default = {
  create
};

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isDnTestScoreOutput = undefined;

var _seamlessImmutable = __webpack_require__(1);

var _seamlessImmutable2 = _interopRequireDefault(_seamlessImmutable);

var _enum = __webpack_require__(0);

var _common = __webpack_require__(2);

var _util = __webpack_require__(6);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const isDnTestScoreOutput = exports.isDnTestScoreOutput = data => {
  if (!(0, _common.isArray)(data)) {
    logger.warn('dnTestScoreOutput 应为数组');
    return false;
  }
  for (let i = 0, len = data.length; i < len; i += 1) {
    if (!(0, _common.isObject)(data[i])) {
      logger.warn('dnTestScoreOutput 应为对象数组');
      return false;
    }
    if (!(0, _common.isString)(data[i].faultName)) {
      logger.warn('dnTestScoreOutput faultName 应为字符串');
      return false;
    }
    if (!(0, _util.isNumber)(data[i].occtimes)) {
      logger.warn('dnTestScoreOutput occtimes 应为数字');
      return false;
    }
    if (!(0, _util.isNumber)(data[i].status)) {
      logger.warn('dnTestScoreOutput status 应为数字');
      return false;
    }
    if (!(0, _common.isString)(data[i].errorMsg)) {
      logger.warn('dnTestScoreOutput errorMsg 应为字符串');
      return false;
    }
    if (!(0, _common.isArray)(data[i].breakingRules)) {
      logger.warn('dnTestScoreOutput breakingRules 应为数组');
      return false;
    }
  }

  return true;
};

const _createFromPlainJsObject = data => {
  if (!isDnTestScoreOutput(data)) {
    return (0, _seamlessImmutable2.default)({
      dataType: _enum.dataTypes.DN_TEST_SCORE_OUTPUT,
      data: false
    });
  }

  return (0, _seamlessImmutable2.default)({
    dataType: _enum.dataTypes.DN_TEST_SCORE_OUTPUT,
    data
  });
};

const _createFromOtherDataTypes = (dataType, data) => {
  if (dataType === _enum.dataTypes.DN_TEST_SCORE_OUTPUT) {
    return (0, _seamlessImmutable2.default)({
      dataType,
      data
    });
  }
  return (0, _seamlessImmutable2.default)({
    dataType: _enum.dataTypes.DN_TEST_SCORE_OUTPUT,
    data: false
  });
};

/** static */
const create = function (data) {
  // 判断是否是单纯的 js 对象
  if (!data.hasOwnProperty('dataType')) {
    return _createFromPlainJsObject(data);
  }
  return _createFromOtherDataTypes(data['dataType'], data['data']);
};

exports.default = {
  create
};

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isAnlsDeduplicationOpt = exports.isMethods = undefined;

var _seamlessImmutable = __webpack_require__(1);

var _seamlessImmutable2 = _interopRequireDefault(_seamlessImmutable);

var _enum = __webpack_require__(0);

var _common = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const isMethods = exports.isMethods = data => {
  if (!(0, _common.isArray)(data)) {
    logger.warn('anlsDeduplicationOpt methods 应为数组');
    return false;
  }

  for (let i = 0, len = data.length; i < len; i += 1) {
    if (!(0, _common.isObject)(data[i])) {
      logger.warn('anlsDeduplicationOpt methods 应为对象数组');
      return false;
    }
    if (!(0, _common.isString)(data[i].type)) {
      logger.warn('anlsDeduplicationOpt methods type格式错误');
      return false;
    }
    if (!(0, _common.isNumber)(data[i].toleranceLimits)) {
      logger.warn('anlsDeduplicationOpt methods toleranceLimits格式错误');
      return false;
    }
  }
  return true;
};

const isAnlsDeduplicationOpt = exports.isAnlsDeduplicationOpt = data => {
  if (!(0, _common.isObject)(data)) {
    logger.warn('anlsDeduplicationOpt 应为对象');
    return false;
  }
  if (!isMethods(data['methods'])) {
    return false;
  }

  return true;
};
const _createFromPlainJsObject = data => {
  if (!isAnlsDeduplicationOpt(data)) {
    return (0, _seamlessImmutable2.default)({
      dataType: _enum.dataTypes.ANLS_DEDUPLICATION_OPT,
      data: false
    });
  }

  return (0, _seamlessImmutable2.default)({
    dataType: _enum.dataTypes.ANLS_DEDUPLICATION_OPT,
    data
  });
};

const _createFromOtherDataTypes = (dataType, data) => {
  if (dataType === _enum.dataTypes.ANLS_DEDUPLICATION_OPT) {
    return (0, _seamlessImmutable2.default)({
      dataType,
      data
    });
  }
  return (0, _seamlessImmutable2.default)({
    dataType: _enum.dataTypes.ANLS_DEDUPLICATION_OPT,
    data: false
  });
};

/** static */
const create = function (data) {
  // 判断是否是单纯的 js 对象
  if (!data.hasOwnProperty('dataType')) {
    return _createFromPlainJsObject(data);
  }
  return _createFromOtherDataTypes(data['dataType'], data['data']);
};

exports.default = {
  create
};

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _seamlessImmutable = __webpack_require__(1);

var _seamlessImmutable2 = _interopRequireDefault(_seamlessImmutable);

var _enum = __webpack_require__(0);

var _common = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const _createFromPlainJsObject = data => {
  if (!(0, _common.isObject)(data)) {
    logger('data 应为对象');
    return (0, _seamlessImmutable2.default)({
      dataType: _enum.dataTypes.ANLS_DEDUPLICATION_OUTPUT,
      data: false
    });

    return (0, _seamlessImmutable2.default)({
      dataType: _enum.dataTypes.ANLS_DEDUPLICATION_OUTPUT,
      data
    });
  }
};

const _createFromOtherDataTypes = (dataType, data) => {
  if (dataType === _enum.dataTypes.ANLS_DEDUPLICATION_OUTPUT) {
    return (0, _seamlessImmutable2.default)({
      dataType,
      data
    });
  }
  return (0, _seamlessImmutable2.default)({
    dataType: _enum.dataTypes.ANLS_DEDUPLICATION_OUTPUT,
    data: false
  });
};

/** static */
const create = function (data) {
  // 判断是否是单纯的 js 对象
  if (!data.hasOwnProperty('dataType')) {
    return _createFromPlainJsObject(data);
  }
  return _createFromOtherDataTypes(data['dataType'], data['data']);
};

exports.default = {
  create
};

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isAnlsDeduplicationOpt = exports.isOptions = exports.isMethods = undefined;

var _seamlessImmutable = __webpack_require__(1);

var _seamlessImmutable2 = _interopRequireDefault(_seamlessImmutable);

var _enum = __webpack_require__(0);

var _common = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const isMethods = exports.isMethods = data => {
  if (!(0, _common.isArray)(data)) {
    logger.warn('anlsDeduplicationOpt methods 应为数组');
    return false;
  }

  for (let i = 0, len = data.length; i < len; i += 1) {
    if (!(0, _common.isObject)(data[i])) {
      logger.warn('anlsDeduplicationOpt methods 应为对象数组');
      return false;
    }
    if (!(0, _common.isString)(data[i].type)) {
      logger.warn('anlsDeduplicationOpt methods type格式错误');
      return false;
    }
  }
  return true;
};

const isOptions = exports.isOptions = data => {
  if (!(0, _common.isObject)(data)) {
    logger.warn('anlsDeduplicationOpt options 应为对象');
    return false;
  }
  if (!(0, _common.isNumber)(data.maxPaddingInterval)) {
    logger.warn('anlsDeduplicationOpt options maxPaddingInterval格式错误');
    return false;
  }

  return true;
};

const isAnlsDeduplicationOpt = exports.isAnlsDeduplicationOpt = data => {
  if (!(0, _common.isObject)(data)) {
    logger.warn('anlsDeduplicationOpt 应为对象');
    return false;
  }
  if (!isMethods(data['methods'])) {
    return false;
  }
  if (!isOptions(data['options'])) {
    return false;
  }

  return true;
};
const _createFromPlainJsObject = data => {
  if (!isAnlsDeduplicationOpt(data)) {
    return (0, _seamlessImmutable2.default)({
      dataType: _enum.dataTypes.ANLS_DATA_COMPLEMENT_OPT,
      data: false
    });
  }

  return (0, _seamlessImmutable2.default)({
    dataType: _enum.dataTypes.ANLS_DATA_COMPLEMENT_OPT,
    data
  });
};

const _createFromOtherDataTypes = (dataType, data) => {
  if (dataType === _enum.dataTypes.ANLS_DATA_COMPLEMENT_OPT) {
    return (0, _seamlessImmutable2.default)({
      dataType,
      data
    });
  }
  return (0, _seamlessImmutable2.default)({
    dataType: _enum.dataTypes.ANLS_DATA_COMPLEMENT_OPT,
    data: false
  });
};

/** static */
const create = function (data) {
  // 判断是否是单纯的 js 对象
  if (!data.hasOwnProperty('dataType')) {
    return _createFromPlainJsObject(data);
  }
  return _createFromOtherDataTypes(data['dataType'], data['data']);
};

exports.default = {
  create
};

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _seamlessImmutable = __webpack_require__(1);

var _seamlessImmutable2 = _interopRequireDefault(_seamlessImmutable);

var _enum = __webpack_require__(0);

var _common = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const _createFromPlainJsObject = data => {
  if (!(0, _common.isObject)(data)) {
    logger('data 应为对象');
    return (0, _seamlessImmutable2.default)({
      dataType: _enum.dataTypes.ANLS_DATA_COMPLEMENT_OUTPUT,
      data: false
    });

    return (0, _seamlessImmutable2.default)({
      dataType: _enum.dataTypes.ANLS_DATA_COMPLEMENT_OUTPUT,
      data
    });
  }
};

const _createFromOtherDataTypes = (dataType, data) => {
  if (dataType === _enum.dataTypes.ANLS_DATA_COMPLEMENT_OUTPUT) {
    return (0, _seamlessImmutable2.default)({
      dataType,
      data
    });
  }
  return (0, _seamlessImmutable2.default)({
    dataType: _enum.dataTypes.ANLS_DATA_COMPLEMENT_OUTPUT,
    data: false
  });
};

/** static */
const create = function (data) {
  // 判断是否是单纯的 js 对象
  if (!data.hasOwnProperty('dataType')) {
    return _createFromPlainJsObject(data);
  }
  return _createFromOtherDataTypes(data['dataType'], data['data']);
};

exports.default = {
  create
};

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isOutlierDetectingOpt = undefined;

var _seamlessImmutable = __webpack_require__(1);

var _seamlessImmutable2 = _interopRequireDefault(_seamlessImmutable);

var _enum = __webpack_require__(0);

var _common = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const isOutlierDetectingOpt = exports.isOutlierDetectingOpt = data => {
  if (!(0, _common.isObject)(data)) {
    logger.warn('请求参数 应为对象');
    return false;
  }
  return true;
};

const _createFromPlainJsObject = data => {
  if (!isOutlierDetectingOpt(data)) {
    return (0, _seamlessImmutable2.default)({
      dataType: _enum.dataTypes.ANLS_OUTLIER_DETECTING_OPT,
      data: false
    });
  }
  return (0, _seamlessImmutable2.default)({
    dataType: _enum.dataTypes.ANLS_OUTLIER_DETECTING_OPT,
    data
  });
};

const _createFromOtherDataTypes = (dataType, data) => {
  if (dataType === _enum.dataTypes.ANLS_OUTLIER_DETECTING_OPT) {
    return (0, _seamlessImmutable2.default)({
      dataType,
      data
    });
  }
  return (0, _seamlessImmutable2.default)({
    dataType: _enum.dataTypes.ANLS_OUTLIER_DETECTING_OPT,
    data: false
  });
};

/** static */
const create = function (data) {
  // 判断是否是单纯的 js 对象
  if (!data.hasOwnProperty('dataType')) {
    return _createFromPlainJsObject(data);
  }
  return _createFromOtherDataTypes(data['dataType'], data['data']);
};

exports.default = {
  create
};

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isOutlierDetectingOutput = undefined;

var _seamlessImmutable = __webpack_require__(1);

var _seamlessImmutable2 = _interopRequireDefault(_seamlessImmutable);

var _enum = __webpack_require__(0);

var _common = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const isOutlierDetectingOutput = exports.isOutlierDetectingOutput = data => {
  if (!(0, _common.isArray)(data)) {
    logger.warn('输出参数 应为数组');
    return false;
  }
  return true;
};

const _createFromPlainJsObject = data => {
  if (!isOutlierDetectingOutput(data)) {
    return (0, _seamlessImmutable2.default)({
      dataType: _enum.dataTypes.ANLS_OUTLIER_DETECTING_OUTPUT,
      data: false
    });
  }
  return (0, _seamlessImmutable2.default)({
    dataType: _enum.dataTypes.ANLS_OUTLIER_DETECTING_OUTPUT,
    data
  });
};

const _createFromOtherDataTypes = (dataType, data) => {
  if (dataType === _enum.dataTypes.ANLS_OUTLIER_DETECTING_OUTPUT) {
    return (0, _seamlessImmutable2.default)({
      dataType,
      data
    });
  }
  return (0, _seamlessImmutable2.default)({
    dataType: _enum.dataTypes.ANLS_OUTLIER_DETECTING_OUTPUT,
    data: false
  });
};

/** static */
const create = function (data) {
  // 判断是否是单纯的 js 对象
  if (!data.hasOwnProperty('dataType')) {
    return _createFromPlainJsObject(data);
  }
  return _createFromOtherDataTypes(data['dataType'], data['data']);
};

exports.default = {
  create
};

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isAnlsDeduplicationOpt = exports.isMethods = undefined;

var _seamlessImmutable = __webpack_require__(1);

var _seamlessImmutable2 = _interopRequireDefault(_seamlessImmutable);

var _enum = __webpack_require__(0);

var _common = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const isMethods = exports.isMethods = data => {
  if (!(0, _common.isArray)(data)) {
    logger.warn('anlsClusteringOpt methods 应为数组');
    return false;
  }

  for (let i = 0, len = data.length; i < len; i += 1) {
    if (!(0, _common.isObject)(data[i])) {
      logger.warn('anlsClusteringOpt methods 应为对象数组');
      return false;
    }
    if (!(0, _common.isString)(data[i].type)) {
      logger.warn('anlsClusteringOpt methods type格式错误');
      return false;
    }
  }
  return true;
};

const isAnlsDeduplicationOpt = exports.isAnlsDeduplicationOpt = data => {
  if (!(0, _common.isObject)(data)) {
    logger.warn('anlsClusteringOpt 应为对象');
    return false;
  }
  if (!isMethods(data['methods'])) {
    return false;
  }

  return true;
};
const _createFromPlainJsObject = data => {
  if (!isAnlsDeduplicationOpt(data)) {
    return (0, _seamlessImmutable2.default)({
      dataType: _enum.dataTypes.ANLS_CLUSTERING_OPT,
      data: false
    });
  }

  return (0, _seamlessImmutable2.default)({
    dataType: _enum.dataTypes.ANLS_CLUSTERING_OPT,
    data
  });
};

const _createFromOtherDataTypes = (dataType, data) => {
  if (dataType === _enum.dataTypes.ANLS_CLUSTERING_OPT) {
    return (0, _seamlessImmutable2.default)({
      dataType,
      data
    });
  }
  return (0, _seamlessImmutable2.default)({
    dataType: _enum.dataTypes.ANLS_CLUSTERING_OPT,
    data: false
  });
};

/** static */
const create = function (data) {
  // 判断是否是单纯的 js 对象
  if (!data.hasOwnProperty('dataType')) {
    return _createFromPlainJsObject(data);
  }
  return _createFromOtherDataTypes(data['dataType'], data['data']);
};

exports.default = {
  create
};

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _seamlessImmutable = __webpack_require__(1);

var _seamlessImmutable2 = _interopRequireDefault(_seamlessImmutable);

var _enum = __webpack_require__(0);

var _common = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const _createFromPlainJsObject = data => {
  if (!(0, _common.isObject)(data)) {
    logger('data 应为对象');
    return (0, _seamlessImmutable2.default)({
      dataType: _enum.dataTypes.ANLS_CLUSTERING_OUTPUT,
      data: false
    });

    return (0, _seamlessImmutable2.default)({
      dataType: _enum.dataTypes.ANLS_CLUSTERING_OUTPUT,
      data
    });
  }
};

const _createFromOtherDataTypes = (dataType, data) => {
  if (dataType === _enum.dataTypes.ANLS_CLUSTERING_OUTPUT) {
    return (0, _seamlessImmutable2.default)({
      dataType,
      data
    });
  }
  return (0, _seamlessImmutable2.default)({
    dataType: _enum.dataTypes.ANLS_CLUSTERING_OUTPUT,
    data: false
  });
};

/** static */
const create = function (data) {
  // 判断是否是单纯的 js 对象
  if (!data.hasOwnProperty('dataType')) {
    return _createFromPlainJsObject(data);
  }
  return _createFromOtherDataTypes(data['dataType'], data['data']);
};

exports.default = {
  create
};

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isAnlsFeatureSelectionOpt = exports.isMethods = undefined;

var _seamlessImmutable = __webpack_require__(1);

var _seamlessImmutable2 = _interopRequireDefault(_seamlessImmutable);

var _enum = __webpack_require__(0);

var _common = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const isMethods = exports.isMethods = data => {
  if (!(0, _common.isArray)(data)) {
    logger.warn('anlsFeatureSelectionOpt methods 应为数组');
    return false;
  }

  for (let i = 0, len = data.length; i < len; i += 1) {
    if (!(0, _common.isObject)(data[i])) {
      logger.warn('anlsFeatureSelectionOpt methods 应为对象数组');
      return false;
    }
    if (!(0, _common.isString)(data[i].type)) {
      logger.warn('anlsFeatureSelectionOpt methods type格式错误');
      return false;
    }
  }
  return true;
};

const isAnlsFeatureSelectionOpt = exports.isAnlsFeatureSelectionOpt = data => {
  if (!(0, _common.isObject)(data)) {
    logger.warn('anlsFeatureSelectionOpt 应为对象');
    return false;
  }
  if (!isMethods(data['methods'])) {
    return false;
  }
  if (!(0, _common.isDataSetArray)(data['data'])) {
    logger.warn('anlsFeatureSelectionOpt data 应为数据集数组');
  }
  if (!(0, _common.isTimeArray)(data['time'])) {
    logger.warn('anlsFeatureSelectionOpt time 应为时间数组');
  }
  return true;
};
const _createFromPlainJsObject = data => {
  if (!isAnlsFeatureSelectionOpt(data)) {
    return (0, _seamlessImmutable2.default)({
      dataType: _enum.dataTypes.ANLS_FEATURE_SELECTION_OPT,
      data: false
    });
  }

  return (0, _seamlessImmutable2.default)({
    dataType: _enum.dataTypes.ANLS_FEATURE_SELECTION_OPT,
    data
  });
};

const _createFromOtherDataTypes = (dataType, data) => {
  if (dataType === _enum.dataTypes.ANLS_FEATURE_SELECTION_OPT) {
    return (0, _seamlessImmutable2.default)({
      dataType,
      data
    });
  }
  return (0, _seamlessImmutable2.default)({
    dataType: _enum.dataTypes.ANLS_FEATURE_SELECTION_OPT,
    data: false
  });
};

/** static */
const create = function (data) {
  // 判断是否是单纯的 js 对象
  if (!data.hasOwnProperty('dataType')) {
    return _createFromPlainJsObject(data);
  }
  return _createFromOtherDataTypes(data['dataType'], data['data']);
};

exports.default = {
  create
};

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isAnlsFeatureSelectionOutput = exports.isAnlsFeatureSelectionOutputData = undefined;

var _seamlessImmutable = __webpack_require__(1);

var _seamlessImmutable2 = _interopRequireDefault(_seamlessImmutable);

var _enum = __webpack_require__(0);

var _common = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const isAnlsFeatureSelectionOutputData = exports.isAnlsFeatureSelectionOutputData = data => {
  if (!(0, _common.isArray)(data)) {
    logger.warn('isAnlsFeatureSelectionOutput data 应为数组');
    return false;
  }
  for (let i = 0, len = data.length; i < len; i += 1) {
    let o = data[i];
    if (!(0, _common.isObject)(o)) {
      logger.warn('isAnlsFeatureSelectionOutput data 应为对象数组');
      return false;
    }
    if (!(0, _common.isString)(o.name)) {
      logger.warn('isAnlsFeatureSelectionOutput methods 应为字符串');
      return false;
    }
    if (!(0, _common.isObject)(o.params)) {
      logger.warn('isAnlsFeatureSelectionOutput params 应为对象');
      return false;
    }
    if (!(0, _common.isArray)(o.value)) {
      logger.warn('isAnlsFeatureSelectionOutput value 应为数组');
      return false;
    }
  }
  return true;
};

const isAnlsFeatureSelectionOutput = exports.isAnlsFeatureSelectionOutput = data => {
  if (!(0, _common.isArray)(data)) {
    logger.warn('isAnlsFeatureSelectionOutput 应为数组');
    return false;
  }
  for (let i = 0, len = data.length; i < len; i += 1) {
    let o = data[i];
    if (!(0, _common.isObject)(o)) {
      logger.warn('isAnlsFeatureSelectionOutput 应为对象数组');
      return false;
    }
    if (!(0, _common.isString)(o.method)) {
      logger.warn('isAnlsFeatureSelectionOutput methods 应为字符串');
      return false;
    }
    if (!isAnlsFeatureSelectionOutputData(o.data)) {
      return false;
    }
  }
  return true;
};
const _createFromPlainJsObject = data => {
  if (!isAnlsFeatureSelectionOutput(data)) {
    return (0, _seamlessImmutable2.default)({
      dataType: _enum.dataTypes.ANLS_FEATURE_SELECTION_OUTPUT,
      data: false
    });
  }

  return (0, _seamlessImmutable2.default)({
    dataType: _enum.dataTypes.ANLS_FEATURE_SELECTION_OUTPUT,
    data
  });
};

const _createFromOtherDataTypes = (dataType, data) => {
  if (dataType === _enum.dataTypes.ANLS_FEATURE_SELECTION_OUTPUT) {
    return (0, _seamlessImmutable2.default)({
      dataType,
      data
    });
  }
  return (0, _seamlessImmutable2.default)({
    dataType: _enum.dataTypes.ANLS_FEATURE_SELECTION_OUTPUT,
    data: false
  });
};

/** static */
const create = function (data) {
  // 判断是否是单纯的 js 对象
  if (!data.hasOwnProperty('dataType')) {
    return _createFromPlainJsObject(data);
  }
  return _createFromOtherDataTypes(data['dataType'], data['data']);
};

exports.default = {
  create
};

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isPcaOpt = undefined;

var _seamlessImmutable = __webpack_require__(1);

var _seamlessImmutable2 = _interopRequireDefault(_seamlessImmutable);

var _enum = __webpack_require__(0);

var _common = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const isPcaOpt = exports.isPcaOpt = data => {
  if (!(0, _common.isObject)(data)) {
    logger.warn('请求参数 应为对象');
    return false;
  }
  return true;
};

const _createFromPlainJsObject = data => {
  if (!isPcaOpt(data)) {
    return (0, _seamlessImmutable2.default)({
      dataType: _enum.dataTypes.ANLS_PCA_OPT,
      data: false
    });
  }
  return (0, _seamlessImmutable2.default)({
    dataType: _enum.dataTypes.ANLS_PCA_OPT,
    data
  });
};

const _createFromOtherDataTypes = (dataType, data) => {
  if (dataType === _enum.dataTypes.ANLS_PCA_OPT) {
    return (0, _seamlessImmutable2.default)({
      dataType,
      data
    });
  }
  return (0, _seamlessImmutable2.default)({
    dataType: _enum.dataTypes.ANLS_PCA_OPT,
    data: false
  });
};

/** static */
const create = function (data) {
  // 判断是否是单纯的 js 对象
  if (!data.hasOwnProperty('dataType')) {
    return _createFromPlainJsObject(data);
  }
  return _createFromOtherDataTypes(data['dataType'], data['data']);
};

exports.default = {
  create
};

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isPcaOutput = undefined;

var _seamlessImmutable = __webpack_require__(1);

var _seamlessImmutable2 = _interopRequireDefault(_seamlessImmutable);

var _enum = __webpack_require__(0);

var _common = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const isPcaOutput = exports.isPcaOutput = data => {
  if (!(0, _common.isArray)(data)) {
    logger.warn('输出参数 应为数组');
    return false;
  }
  return true;
};

const _createFromPlainJsObject = data => {
  if (!isPcaOutput(data)) {
    return (0, _seamlessImmutable2.default)({
      dataType: _enum.dataTypes.ANLS_PCA_OUTPUT,
      data: false
    });
  }
  return (0, _seamlessImmutable2.default)({
    dataType: _enum.dataTypes.ANLS_PCA_OUTPUT,
    data
  });
};

const _createFromOtherDataTypes = (dataType, data) => {
  if (dataType === _enum.dataTypes.ANLS_PCA_OUTPUT) {
    return (0, _seamlessImmutable2.default)({
      dataType,
      data
    });
  }
  return (0, _seamlessImmutable2.default)({
    dataType: _enum.dataTypes.ANLS_PCA_OUTPUT,
    data: false
  });
};

/** static */
const create = function (data) {
  // 判断是否是单纯的 js 对象
  if (!data.hasOwnProperty('dataType')) {
    return _createFromPlainJsObject(data);
  }
  return _createFromOtherDataTypes(data['dataType'], data['data']);
};

exports.default = {
  create
};

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isanlsDataNormalizationOpt = exports.isMethods = undefined;

var _seamlessImmutable = __webpack_require__(1);

var _seamlessImmutable2 = _interopRequireDefault(_seamlessImmutable);

var _enum = __webpack_require__(0);

var _common = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const isMethods = exports.isMethods = data => {
  if (!(0, _common.isArray)(data)) {
    logger.warn('anlsDataNormalizationOpt methods 应为数组');
    return false;
  }

  for (let i = 0, len = data.length; i < len; i += 1) {
    if (!(0, _common.isObject)(data[i])) {
      logger.warn('anlsDataNormalizationOpt methods 应为对象数组');
      return false;
    }
    if (!(0, _common.isString)(data[i].type)) {
      logger.warn('anlsDataNormalizationOpt methods type格式错误');
      return false;
    }
  }
  return true;
};

const isanlsDataNormalizationOpt = exports.isanlsDataNormalizationOpt = data => {
  if (!(0, _common.isObject)(data)) {
    logger.warn('anlsDataNormalizationOpt 应为对象');
    return false;
  }
  if (!isMethods(data['methods'])) {
    return false;
  }
  return true;
};
const _createFromPlainJsObject = data => {
  if (!isanlsDataNormalizationOpt(data)) {
    return (0, _seamlessImmutable2.default)({
      dataType: _enum.dataTypes.ANLS_DATA_NORMALIZATION_OPT,
      data: false
    });
  }

  return (0, _seamlessImmutable2.default)({
    dataType: _enum.dataTypes.ANLS_DATA_NORMALIZATION_OPT,
    data
  });
};

const _createFromOtherDataTypes = (dataType, data) => {
  if (dataType === _enum.dataTypes.ANLS_DATA_NORMALIZATION_OPT) {
    return (0, _seamlessImmutable2.default)({
      dataType,
      data
    });
  }
  return (0, _seamlessImmutable2.default)({
    dataType: _enum.dataTypes.ANLS_DATA_NORMALIZATION_OPT,
    data: false
  });
};

/** static */
const create = function (data) {
  // 判断是否是单纯的 js 对象
  if (!data.hasOwnProperty('dataType')) {
    return _createFromPlainJsObject(data);
  }
  return _createFromOtherDataTypes(data['dataType'], data['data']);
};

exports.default = {
  create
};

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _seamlessImmutable = __webpack_require__(1);

var _seamlessImmutable2 = _interopRequireDefault(_seamlessImmutable);

var _enum = __webpack_require__(0);

var _common = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const _createFromPlainJsObject = data => {
  if (!(0, _common.isObject)(data)) {
    logger('data 应为对象');
    return (0, _seamlessImmutable2.default)({
      dataType: _enum.dataTypes.ANLS_DATA_NORMALIZATION_OUTPUT,
      data: false
    });

    return (0, _seamlessImmutable2.default)({
      dataType: _enum.dataTypes.ANLS_DATA_NORMALIZATION_OUTPUT,
      data
    });
  }
};

const _createFromOtherDataTypes = (dataType, data) => {
  if (dataType === _enum.dataTypes.ANLS_DATA_NORMALIZATION_OUTPUT) {
    return (0, _seamlessImmutable2.default)({
      dataType,
      data
    });
  }
  return (0, _seamlessImmutable2.default)({
    dataType: _enum.dataTypes.ANLS_DATA_NORMALIZATION_OUTPUT,
    data: false
  });
};

/** static */
const create = function (data) {
  // 判断是否是单纯的 js 对象
  if (!data.hasOwnProperty('dataType')) {
    return _createFromPlainJsObject(data);
  }
  return _createFromOtherDataTypes(data['dataType'], data['data']);
};

exports.default = {
  create
};

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isAnlsEvaluateOpt = undefined;

var _seamlessImmutable = __webpack_require__(1);

var _seamlessImmutable2 = _interopRequireDefault(_seamlessImmutable);

var _enum = __webpack_require__(0);

var _common = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const isAnlsEvaluateOpt = exports.isAnlsEvaluateOpt = data => {
  if (!(0, _common.isObject)(data)) {
    logger.warn('anlsEvaluateOpt 应为对象');
    return false;
  }

  return true;
};
const _createFromPlainJsObject = data => {
  if (!isAnlsEvaluateOpt(data)) {
    return (0, _seamlessImmutable2.default)({
      dataType: _enum.dataTypes.ANLS_EVALUATE_OPT,
      data: false
    });
  }

  return (0, _seamlessImmutable2.default)({
    dataType: _enum.dataTypes.ANLS_EVALUATE_OPT,
    data
  });
};

const _createFromOtherDataTypes = (dataType, data) => {
  if (dataType === _enum.dataTypes.ANLS_EVALUATE_OPT) {
    return (0, _seamlessImmutable2.default)({
      dataType,
      data
    });
  }
  return (0, _seamlessImmutable2.default)({
    dataType: _enum.dataTypes.ANLS_EVALUATE_OPT,
    data: false
  });
};

/** static */
const create = function (data) {
  // 判断是否是单纯的 js 对象
  if (!data.hasOwnProperty('dataType')) {
    return _createFromPlainJsObject(data);
  }
  return _createFromOtherDataTypes(data['dataType'], data['data']);
};

exports.default = {
  create
};

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isAnlsEvaluateOutput = undefined;

var _seamlessImmutable = __webpack_require__(1);

var _seamlessImmutable2 = _interopRequireDefault(_seamlessImmutable);

var _enum = __webpack_require__(0);

var _common = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const isAnlsEvaluateOutput = exports.isAnlsEvaluateOutput = data => {
  if (!(0, _common.isObject)(data)) {
    logger.warn('anlsEvaluateOutput 应为对象');
    return false;
  }
  if (!(0, _common.isDataSetArray)(data['data'])) {
    logger.warn('anlsEvaluateOutput data 应为数据集数组');
  }
  if (!(0, _common.isTimeArray)(data['time'])) {
    logger.warn('anlsEvaluateOutput time 应为时间数组');
  }
  return true;
};
const _createFromPlainJsObject = data => {
  if (!isAnlsEvaluateOutput(data)) {
    return (0, _seamlessImmutable2.default)({
      dataType: _enum.dataTypes.ANLS_EVALUATE_OUTPUT,
      data: false
    });
  }

  return (0, _seamlessImmutable2.default)({
    dataType: _enum.dataTypes.ANLS_EVALUATE_OUTPUT,
    data
  });
};

const _createFromOtherDataTypes = (dataType, data) => {
  if (dataType === _enum.dataTypes.ANLS_EVALUATE_OUTPUT) {
    return (0, _seamlessImmutable2.default)({
      dataType,
      data
    });
  }
  return (0, _seamlessImmutable2.default)({
    dataType: _enum.dataTypes.ANLS_EVALUATE_OUTPUT,
    data: false
  });
};

/** static */
const create = function (data) {
  // 判断是否是单纯的 js 对象
  if (!data.hasOwnProperty('dataType')) {
    return _createFromPlainJsObject(data);
  }
  return _createFromOtherDataTypes(data['dataType'], data['data']);
};

exports.default = {
  create
};

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isModuleInfo = undefined;

var _seamlessImmutable = __webpack_require__(1);

var _seamlessImmutable2 = _interopRequireDefault(_seamlessImmutable);

var _enum = __webpack_require__(0);

var _common = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const isModuleInfo = exports.isModuleInfo = data => {
  if (!(0, _common.isObject)(data)) {
    logger.warn('moduleInfo 应为对象');
    return false;
  }
  return true;
};

const _createFromPlainJsObject = data => {
  if (!isModuleInfo(data)) {
    return (0, _seamlessImmutable2.default)({
      dataType: _enum.dataTypes.MODULE_INFO,
      data: false
    });
  }
  return (0, _seamlessImmutable2.default)({
    dataType: _enum.dataTypes.MODULE_INFO,
    data
  });
};

const _createFromOtherDataTypes = (dataType, data) => {
  if (dataType === _enum.dataTypes.MODULE_INFO) {
    return (0, _seamlessImmutable2.default)({
      dataType,
      data
    });
  }
  return (0, _seamlessImmutable2.default)({
    dataType: _enum.dataTypes.MODULE_INFO,
    data: false
  });
};

/** static */
const create = function (data) {
  // 判断是否是单纯的 js 对象
  if (!data.hasOwnProperty('dataType')) {
    return _createFromPlainJsObject(data);
  }
  return _createFromOtherDataTypes(data['dataType'], data['data']);
};

exports.default = {
  create
};

/***/ }),
/* 50 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
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
/* harmony default export */ __webpack_exports__["a"] = (diff);


/***/ }),
/* 51 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/** 将最终输出结果格式化成想要的方式 */
function mergeGroup(id, group) {
  var rs = {
    _id: id,
    v: {},
    k: 'E'
  };
  var newDiff = null;

  // 合并所有编辑类的操作
  group.forEach(function(d) {
    var len = d.path.length;
    var kv = {};

    // 如果在这里发现有对象级别的操作，则说明随着业务逻辑的扩展，有一些新的情况没有被考虑到
    if (d.length === 1) {
      console.log(
        'root object "' +
          d.path[0] +
          '" has an unexpected operation that has not been considered, we will ignore it.'
      );
      return;
    }

    // 属性的新增操作
    if (d.kind === 'N') {
      // 将此新增操作合并到编辑操作中
      if (len === 2) {
        rs.v[d.path[1]] = d.rhs;
      } else {
        console.log(
          'property "' +
            d.path.join('.') +
            '" is a object, expect not a object, will ignore it and do not upload to the server.'
        );
      }
    } else if (d.kind === 'E') {
      // 编辑操作
      // 合并编辑操作
      if (len === 2) {
        rs._id = d.path[0];
        kv[d.path[1]] = d.rhs;
        rs.v = Object.assign({}, rs.v, kv);
      } else {
        console.log(
          'property "' +
            d.path.join('.') +
            '" is a object, expect not a object, will ignore it and do not upload to the server.'
        );
      }
    } else if (d.kind === 'D') {
      // 删除操作
      // 将此删除操作合并到编辑操作中
      if (len === 2) {
        if (rs.v.hasOwnProperty(d.path[1])) {
          delete rs.v[d.path[1]];
        }
      } else {
        console.log(
          'property "' +
            d.path.join('.') +
            '" is a object, expect not a object, will ignore it and do not upload to the server.'
        );
      }
    } else {
        console.log(
        "there shouldn't have any type except 'N', 'E' or 'D' in the group diffs, unusual type: " +
          d.kind
      );
    }
  });

  return rs;
}

function mergeDiff(diffs) {
  // 先按照 _id 进行分类
  var map = {};
  var rs = [];

  // 转换成 map
  diffs.forEach(function(d) {
    var id = d.path[0];
    map[id] = map[id] || [];

    // 若操作为对象层级的操作，则后续所有操作均被忽略
    if (map[id].length === 1 && map[id][0].path.length === 1) return;

    // 若为对象层级的操作，则覆盖所有其他操作
    if (d.path.length === 1) {
      map[id] = [d];
      return;
    }

    map[id].push(d);
  }, this);

  // 格式化和合并
  for (var id in map) {
    if (!map.hasOwnProperty(id)) continue;

    // 若为对象层级的操作，则跳过进一步的合并操作
    if (map[id].length === 1 && map[id][0].path.length === 1) {
      // 格式化对象
      if (map[id][0].kind === 'D') {
        rs.push({
          k: 'D',
          _id: map[id][0].lhs['_id']
        });
      } else if (map[id][0].kind === 'N') {
        rs.push({
          k: 'N',
          v: map[id][0].rhs
        });
      }
      continue;
    }
    // 能走到这一步的，说明都是属性级别的操作，对象层级的操作在这之前已经全部过滤掉了
    rs.push(mergeGroup(id, map[id]));
  }

  return rs;
}
/* harmony default export */ __webpack_exports__["a"] = (mergeDiff);


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _chainNode = __webpack_require__(4);

var _chainNode2 = _interopRequireDefault(_chainNode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

let AnalysisCorrelationChainNode = function (_ChainNode) {
  _inherits(AnalysisCorrelationChainNode, _ChainNode);

  function AnalysisCorrelationChainNode() {
    _classCallCheck(this, AnalysisCorrelationChainNode);

    return _possibleConstructorReturn(this, (AnalysisCorrelationChainNode.__proto__ || Object.getPrototypeOf(AnalysisCorrelationChainNode)).apply(this, arguments));
  }

  return AnalysisCorrelationChainNode;
}(_chainNode2.default);

exports.default = AnalysisCorrelationChainNode;

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _chainNode = __webpack_require__(4);

var _chainNode2 = _interopRequireDefault(_chainNode);

var _enum = __webpack_require__(0);

var _dataTypes = __webpack_require__(3);

var _dataTypes2 = _interopRequireDefault(_dataTypes);

var _moduleConfig = __webpack_require__(5);

var _moduleConfig2 = _interopRequireDefault(_moduleConfig);

var _diff = __webpack_require__(7);

var _index = __webpack_require__(8);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

let PredictionChainNode = function (_ChainNode) {
  _inherits(PredictionChainNode, _ChainNode);

  function PredictionChainNode() {
    _classCallCheck(this, PredictionChainNode);

    return _possibleConstructorReturn(this, (PredictionChainNode.__proto__ || Object.getPrototypeOf(PredictionChainNode)).apply(this, arguments));
  }

  _createClass(PredictionChainNode, [{
    key: 'createQueryData',
    value: function createQueryData(type) {
      let data = _get(PredictionChainNode.prototype.__proto__ || Object.getPrototypeOf(PredictionChainNode.prototype), 'createQueryData', this).call(this, type);
      if (data.data !== false) {
        return data;
      }
      let options = this._module.options;
      let inputData = this._moduleInputData;

      switch (type) {
        case _enum.dataTypes.ANLS_PREDICT_OPT:
          let svmOutput = inputData.find(input => input.dataType == _enum.dataTypes['ANLS_SVM_OUTPUT']);
          let svmOutputOptions = svmOutput.data.options || {};
          data = {
            options: {
              model: svmOutput && svmOutput.data.model || '',
              dependentVariables: svmOutputOptions['dependentVariables'],
              independentVariables: svmOutputOptions['independentVariables'],
              startTime: options.dataset.options.startTime,
              endTime: options.dataset.options.endTime,
              timeFormat: options.dataset.options.timeFormat
            }
          };
          let dtFactory = _dataTypes2.default.get(type);
          return dtFactory.create(data);
        default:
          logger.warn(`Prediction 模块不支持创建'${type}'类型的 Query 数据`);
          return _dataTypes2.default.createEmpty(type);
      }
    }
  }]);

  return PredictionChainNode;
}(_chainNode2.default);

exports.default = PredictionChainNode;

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _chainNode = __webpack_require__(4);

var _chainNode2 = _interopRequireDefault(_chainNode);

var _enum = __webpack_require__(0);

var _dataTypes = __webpack_require__(3);

var _dataTypes2 = _interopRequireDefault(_dataTypes);

var _moduleConfig = __webpack_require__(5);

var _moduleConfig2 = _interopRequireDefault(_moduleConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

let SVMChainNode = function (_ChainNode) {
  _inherits(SVMChainNode, _ChainNode);

  function SVMChainNode() {
    _classCallCheck(this, SVMChainNode);

    return _possibleConstructorReturn(this, (SVMChainNode.__proto__ || Object.getPrototypeOf(SVMChainNode)).apply(this, arguments));
  }

  _createClass(SVMChainNode, [{
    key: 'createQueryData',
    value: function createQueryData(type) {
      let data = _get(SVMChainNode.prototype.__proto__ || Object.getPrototypeOf(SVMChainNode.prototype), 'createQueryData', this).call(this, type);
      if (data.data !== false) {
        return data;
      }
      let options = this._module.options,
          inputData = this._moduleInputData;

      switch (type) {
        case _enum.dataTypes.ANLS_SVM_OPT:
          let dsHisOutput = inputData.find(input => input.dataType == _enum.dataTypes['DS_HIS_OUTPUT']);
          data = {
            data: dsHisOutput && dsHisOutput.data.data || [],
            time: dsHisOutput && dsHisOutput.data.time || [],
            methods: [{
              type: options.svmType.type,
              C: options.svmType.cost,
              epsilon: options.svmType.epsilon,
              kernel: options.kernel.type
            }],
            options: {
              independentVariables: options.options.independenVariables,
              dependentVariables: options.options.dependenVariables,
              cvSplitRatio: options.options.cvSplitRatio
            }
          };
          let dtFactory = _dataTypes2.default.get(type);
          return dtFactory.create(data);
        default:
          logger.warn(`SVM 模块不支持创建'${type}'类型的 Query 数据`);
          return {};
      }
    }
  }, {
    key: 'createModuleOutputData',
    value: function createModuleOutputData(type) {
      return this._createData(type, this._response.concat(this._moduleInputData));
    }
  }]);

  return SVMChainNode;
}(_chainNode2.default);

exports.default = SVMChainNode;

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _chainNode = __webpack_require__(4);

var _chainNode2 = _interopRequireDefault(_chainNode);

var _enum = __webpack_require__(0);

var _dataTypes = __webpack_require__(3);

var _dataTypes2 = _interopRequireDefault(_dataTypes);

var _moduleConfig = __webpack_require__(5);

var _moduleConfig2 = _interopRequireDefault(_moduleConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

let PythonChainNode = function (_ChainNode) {
  _inherits(PythonChainNode, _ChainNode);

  function PythonChainNode() {
    _classCallCheck(this, PythonChainNode);

    return _possibleConstructorReturn(this, (PythonChainNode.__proto__ || Object.getPrototypeOf(PythonChainNode)).apply(this, arguments));
  }

  _createClass(PythonChainNode, [{
    key: 'createQueryData',
    value: function createQueryData(type) {
      let data = _get(PythonChainNode.prototype.__proto__ || Object.getPrototypeOf(PythonChainNode.prototype), 'createQueryData', this).call(this, type);
      if (data.data !== false) {
        return data;
      }
      let options = this._module.options;

      switch (type) {
        case _enum.dataTypes.PYTHON_OPT:
          data = {
            params: [],
            code: options.content || ''
          };
          let dtFactory = _dataTypes2.default.get(type);
          return dtFactory.create(data);
        default:
          logger.warn(`Python 模块不支持创建'${type}'类型的 Query 数据`);
          return _dataTypes2.default.createEmpty(type);
      }
    }
  }]);

  return PythonChainNode;
}(_chainNode2.default);

exports.default = PythonChainNode;

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _chainNode = __webpack_require__(4);

var _chainNode2 = _interopRequireDefault(_chainNode);

var _enum = __webpack_require__(0);

var _dataTypes = __webpack_require__(3);

var _dataTypes2 = _interopRequireDefault(_dataTypes);

var _moduleConfig = __webpack_require__(5);

var _moduleConfig2 = _interopRequireDefault(_moduleConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

let FuzzyChainNode = function (_ChainNode) {
  _inherits(FuzzyChainNode, _ChainNode);

  function FuzzyChainNode() {
    _classCallCheck(this, FuzzyChainNode);

    return _possibleConstructorReturn(this, (FuzzyChainNode.__proto__ || Object.getPrototypeOf(FuzzyChainNode)).apply(this, arguments));
  }

  _createClass(FuzzyChainNode, [{
    key: 'createModuleOutputData',
    value: function createModuleOutputData(type) {
      let options = this._module.options;

      switch (type) {
        case _enum.dataTypes.DN_INPUT_OPT:
          let data = options.params || [];
          let dtFactory = _dataTypes2.default.get(type);
          return dtFactory.create(data);
        default:
          logger.warn(`模糊规则 模块不支持创建'${type}'类型的 Output 数据`);
          return {};
      }
    }
  }]);

  return FuzzyChainNode;
}(_chainNode2.default);

exports.default = FuzzyChainNode;

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _chainNode = __webpack_require__(4);

var _chainNode2 = _interopRequireDefault(_chainNode);

var _enum = __webpack_require__(0);

var _dataTypes = __webpack_require__(3);

var _dataTypes2 = _interopRequireDefault(_dataTypes);

var _moduleConfig = __webpack_require__(5);

var _moduleConfig2 = _interopRequireDefault(_moduleConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

let DiagnosisChainNode = function (_ChainNode) {
  _inherits(DiagnosisChainNode, _ChainNode);

  function DiagnosisChainNode() {
    _classCallCheck(this, DiagnosisChainNode);

    return _possibleConstructorReturn(this, (DiagnosisChainNode.__proto__ || Object.getPrototypeOf(DiagnosisChainNode)).apply(this, arguments));
  }

  _createClass(DiagnosisChainNode, [{
    key: 'createModuleOutputData',
    value: function createModuleOutputData(type) {
      let options = this._module.options;

      switch (type) {
        case _enum.dataTypes.DN_OUTPUT_OPT:
          let data = options.params || [];
          let dtFactory = _dataTypes2.default.get(type);
          return dtFactory.create(data);
        default:
          logger.warn(`诊断项 模块不支持创建'${type}'类型的 Output 数据`);
          return {};
      }
    }
  }]);

  return DiagnosisChainNode;
}(_chainNode2.default);

exports.default = DiagnosisChainNode;

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _chainNode = __webpack_require__(4);

var _chainNode2 = _interopRequireDefault(_chainNode);

var _enum = __webpack_require__(0);

var _dataTypes = __webpack_require__(3);

var _dataTypes2 = _interopRequireDefault(_dataTypes);

var _moduleConfig = __webpack_require__(5);

var _moduleConfig2 = _interopRequireDefault(_moduleConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

let LogicChainNode = function (_ChainNode) {
  _inherits(LogicChainNode, _ChainNode);

  function LogicChainNode() {
    _classCallCheck(this, LogicChainNode);

    return _possibleConstructorReturn(this, (LogicChainNode.__proto__ || Object.getPrototypeOf(LogicChainNode)).apply(this, arguments));
  }

  _createClass(LogicChainNode, [{
    key: 'createModuleOutputData',
    value: function createModuleOutputData(type) {
      let data = _get(LogicChainNode.prototype.__proto__ || Object.getPrototypeOf(LogicChainNode.prototype), 'createModuleOutputData', this).call(this, type);
      if (data.data !== false) {
        return data;
      }
      let options = this._module.options;

      switch (type) {
        case _enum.dataTypes.DN_ANLS_OPT:
          data = {
            rule: options.rule || '',
            ruleBlock: options.ruleBlock
          };
          let dtFactory = _dataTypes2.default.get(type);
          return dtFactory.create(data);
        default:
          logger.warn(`逻辑分析 模块不支持创建'${type}'类型的 Output 数据`);
          return {};
      }
    }
  }]);

  return LogicChainNode;
}(_chainNode2.default);

exports.default = LogicChainNode;

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _chainNode = __webpack_require__(4);

var _chainNode2 = _interopRequireDefault(_chainNode);

var _enum = __webpack_require__(0);

var _dataTypes = __webpack_require__(3);

var _dataTypes2 = _interopRequireDefault(_dataTypes);

var _moduleConfig = __webpack_require__(5);

var _moduleConfig2 = _interopRequireDefault(_moduleConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

let ExecTestChainNode = function (_ChainNode) {
  _inherits(ExecTestChainNode, _ChainNode);

  function ExecTestChainNode() {
    _classCallCheck(this, ExecTestChainNode);

    return _possibleConstructorReturn(this, (ExecTestChainNode.__proto__ || Object.getPrototypeOf(ExecTestChainNode)).apply(this, arguments));
  }

  return ExecTestChainNode;
}(_chainNode2.default);

exports.default = ExecTestChainNode;

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _chainNode = __webpack_require__(4);

var _chainNode2 = _interopRequireDefault(_chainNode);

var _enum = __webpack_require__(0);

var _dataTypes = __webpack_require__(3);

var _dataTypes2 = _interopRequireDefault(_dataTypes);

var _moduleConfig = __webpack_require__(5);

var _moduleConfig2 = _interopRequireDefault(_moduleConfig);

var _util = __webpack_require__(6);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

let DataDeduplicationChainNode = function (_ChainNode) {
  _inherits(DataDeduplicationChainNode, _ChainNode);

  function DataDeduplicationChainNode() {
    _classCallCheck(this, DataDeduplicationChainNode);

    return _possibleConstructorReturn(this, (DataDeduplicationChainNode.__proto__ || Object.getPrototypeOf(DataDeduplicationChainNode)).apply(this, arguments));
  }

  _createClass(DataDeduplicationChainNode, [{
    key: 'createQueryData',
    value: function createQueryData(type) {
      let data = _get(DataDeduplicationChainNode.prototype.__proto__ || Object.getPrototypeOf(DataDeduplicationChainNode.prototype), 'createQueryData', this).call(this, type);
      if (data.data !== false) {
        return data;
      }
      let options = this._module.options;
      let inputData = this._moduleInputData;

      switch (type) {
        case _enum.dataTypes.ANLS_DEDUPLICATION_OPT:
          let dsHisOutput = inputData.find(input => input.dataType == _enum.dataTypes['DS_HIS_OUTPUT']) || { data: false };
          let dsHisOutputData = dsHisOutput.data || {};
          data = {
            data: dsHisOutputData.data || [],
            time: dsHisOutputData.time || [],
            methods: [{
              type: options.methods.type,
              toleranceLimits: options.methods.toleranceLimits
            }]
          };
          let dtFactory = _dataTypes2.default.get(type);
          return dtFactory.create(data);
        default:
          logger.warn(`数据去重 模块不支持创建'${type}'类型的 Query 数据`);
          return _dataTypes2.default.createEmpty(type);
      }
    }
  }, {
    key: 'createModuleOutputData',
    value: function createModuleOutputData(type) {
      switch (type) {
        case _enum.dataTypes.DS_OPT:
          return this._createData(type, this._moduleInputData);
        case _enum.dataTypes.DS_HIS_OUTPUT:
          return this._createData(type, this._response);
      }
    }
  }]);

  return DataDeduplicationChainNode;
}(_chainNode2.default);

exports.default = DataDeduplicationChainNode;

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _chainNode = __webpack_require__(4);

var _chainNode2 = _interopRequireDefault(_chainNode);

var _enum = __webpack_require__(0);

var _dataTypes = __webpack_require__(3);

var _dataTypes2 = _interopRequireDefault(_dataTypes);

var _moduleConfig = __webpack_require__(5);

var _moduleConfig2 = _interopRequireDefault(_moduleConfig);

var _util = __webpack_require__(6);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

let DataComplementChainNode = function (_ChainNode) {
  _inherits(DataComplementChainNode, _ChainNode);

  function DataComplementChainNode() {
    _classCallCheck(this, DataComplementChainNode);

    return _possibleConstructorReturn(this, (DataComplementChainNode.__proto__ || Object.getPrototypeOf(DataComplementChainNode)).apply(this, arguments));
  }

  _createClass(DataComplementChainNode, [{
    key: 'createQueryData',
    value: function createQueryData(type) {
      let data = _get(DataComplementChainNode.prototype.__proto__ || Object.getPrototypeOf(DataComplementChainNode.prototype), 'createQueryData', this).call(this, type);
      if (data.data !== false) {
        return data;
      }
      let options = this._module.options;
      let inputData = this._moduleInputData;

      switch (type) {
        case _enum.dataTypes.ANLS_DATA_COMPLEMENT_OPT:
          let dsHisOutput = inputData.find(input => input.dataType == _enum.dataTypes['DS_HIS_OUTPUT']) || { data: false };
          let dsHisOutputData = dsHisOutput.data || {};
          data = {
            data: dsHisOutputData.data || [],
            time: dsHisOutputData.time || [],
            methods: [{
              type: options.methods.type
            }],
            options: {
              maxPaddingInterval: options.options.maxPaddingInterval
            }
          };
          let dtFactory = _dataTypes2.default.get(type);
          return dtFactory.create(data);
        default:
          logger.warn(`数据补齐 模块不支持创建'${type}'类型的 Query 数据`);
          return _dataTypes2.default.createEmpty(type);
      }
    }
  }, {
    key: 'createModuleOutputData',
    value: function createModuleOutputData(type) {
      switch (type) {
        case _enum.dataTypes.DS_OPT:
          return this._createData(type, this._moduleInputData);
        case _enum.dataTypes.DS_HIS_OUTPUT:
          return this._createData(type, this._response);
      }
    }
  }]);

  return DataComplementChainNode;
}(_chainNode2.default);

exports.default = DataComplementChainNode;

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _chainNode = __webpack_require__(4);

var _chainNode2 = _interopRequireDefault(_chainNode);

var _enum = __webpack_require__(0);

var _dataTypes = __webpack_require__(3);

var _dataTypes2 = _interopRequireDefault(_dataTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

let OutlierDetectionChainNode = function (_ChainNode) {
  _inherits(OutlierDetectionChainNode, _ChainNode);

  function OutlierDetectionChainNode() {
    _classCallCheck(this, OutlierDetectionChainNode);

    return _possibleConstructorReturn(this, (OutlierDetectionChainNode.__proto__ || Object.getPrototypeOf(OutlierDetectionChainNode)).apply(this, arguments));
  }

  _createClass(OutlierDetectionChainNode, [{
    key: 'createQueryData',

    /** @override */
    value: function createQueryData(type) {
      let inputData = this._moduleInputData;
      let options = this._module.options;

      switch (type) {
        case _enum.dataTypes.ANLS_OUTLIER_DETECTING_OPT:
          let data = options;
          let historyData = inputData.find(row => row.dataType === _enum.dataTypes['DS_HIS_OUTPUT']);
          let value = historyData.data ? historyData.data.data.map(row => ({
            name: row.name,
            value: row.value
          })) : [];
          let time = historyData.data ? historyData.data.time : [];
          let newData = data.selectedDs && data.selectedDs.length ? value.filter(row => data.selectedDs.indexOf(row.name) !== -1) : value;
          data = data.selectedDs ? data.without('selectedDs') : data;
          data = Object.assign({}, data, {
            data: newData,
            time: time
          });
          let dtFactory = _dataTypes2.default.get(type);
          return dtFactory.create(data);
        default:
          logger.warn(`OutlierDetection 模块不支持创建'${type}'类型的 Query 数据`);
          return _dataTypes2.default.createEmpty(type);
      }
    }
  }]);

  return OutlierDetectionChainNode;
}(_chainNode2.default);

exports.default = OutlierDetectionChainNode;

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _seamlessImmutable = __webpack_require__(1);

var _seamlessImmutable2 = _interopRequireDefault(_seamlessImmutable);

var _chainNode = __webpack_require__(4);

var _chainNode2 = _interopRequireDefault(_chainNode);

var _enum = __webpack_require__(0);

var _dataTypes = __webpack_require__(3);

var _dataTypes2 = _interopRequireDefault(_dataTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

let Clustering = function (_ChainNode) {
  _inherits(Clustering, _ChainNode);

  function Clustering() {
    _classCallCheck(this, Clustering);

    return _possibleConstructorReturn(this, (Clustering.__proto__ || Object.getPrototypeOf(Clustering)).apply(this, arguments));
  }

  _createClass(Clustering, [{
    key: 'createQueryData',

    /** @override */
    value: function createQueryData(type) {
      let inputData = this._moduleInputData;
      let options = this._module.options;

      switch (type) {
        case _enum.dataTypes.ANLS_CLUSTERING_OPT:
          let data = options;
          let historyData = inputData.find(row => row.dataType === _enum.dataTypes['DS_HIS_OUTPUT']);
          let value = historyData.data ? historyData.data.data.map(row => ({
            name: row.name,
            value: row.value
          })) : [];
          let time = historyData.data ? historyData.data.time : [];
          let newData = data.selectedDs && data.selectedDs.length ? value.filter(row => data.selectedDs.indexOf(row.name) !== -1) : value;
          data = data.selectedDs ? data.without('selectedDs') : data;
          data = Object.assign({}, data, {
            data: newData,
            time: time
          });
          let dtFactory = _dataTypes2.default.get(type);
          return dtFactory.create(data);
        default:
          logger.warn(`Clustering 模块不支持创建'${type}'类型的 Query 数据`);
          return _dataTypes2.default.createEmpty(type);
      }
    }
  }]);

  return Clustering;
}(_chainNode2.default);

exports.default = Clustering;

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _chainNode = __webpack_require__(4);

var _chainNode2 = _interopRequireDefault(_chainNode);

var _enum = __webpack_require__(0);

var _dataTypes = __webpack_require__(3);

var _dataTypes2 = _interopRequireDefault(_dataTypes);

var _moduleConfig = __webpack_require__(5);

var _moduleConfig2 = _interopRequireDefault(_moduleConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

let FileExcelChainNode = function (_ChainNode) {
  _inherits(FileExcelChainNode, _ChainNode);

  function FileExcelChainNode() {
    _classCallCheck(this, FileExcelChainNode);

    return _possibleConstructorReturn(this, (FileExcelChainNode.__proto__ || Object.getPrototypeOf(FileExcelChainNode)).apply(this, arguments));
  }

  _createClass(FileExcelChainNode, [{
    key: 'createModuleOutputData',
    value: function createModuleOutputData(type) {
      let data = _get(FileExcelChainNode.prototype.__proto__ || Object.getPrototypeOf(FileExcelChainNode.prototype), 'createModuleOutputData', this).call(this, type);
      if (data.data !== false) {
        return data;
      }
      let options = this._module.options;
      let dtFactory;
      switch (type) {
        case _enum.dataTypes.DS_HIS_OUTPUT:
          data = options.data ? {
            dataType: 'DS_HIS_OUTPUT',
            data: options.data
          } : {
            dataType: 'DS_HIS_OUTPUT',
            data: false
          };
          dtFactory = _dataTypes2.default.get(type);
          return dtFactory.create(data);
        case _enum.dataTypes.DS_OPT:
          data = options.data.data;
          let newData = {
            dataType: 'DS_OPT',
            data: data.map(row => ({
              name: row.name,
              dsId: ''
            }))
          };
          dtFactory = _dataTypes2.default.get(type);
          return dtFactory.create(newData);
        default:
          logger.warn(`excel 模块不支持创建'${type}'类型的 OutPut 数据`);
          return _dataTypes2.default.createEmpty(type);
      }
    }
  }]);

  return FileExcelChainNode;
}(_chainNode2.default);

exports.default = FileExcelChainNode;

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _chainNode = __webpack_require__(4);

var _chainNode2 = _interopRequireDefault(_chainNode);

var _enum = __webpack_require__(0);

var _dataTypes = __webpack_require__(3);

var _dataTypes2 = _interopRequireDefault(_dataTypes);

var _moduleConfig = __webpack_require__(5);

var _moduleConfig2 = _interopRequireDefault(_moduleConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

let FeatureSelectionChainNode = function (_ChainNode) {
  _inherits(FeatureSelectionChainNode, _ChainNode);

  function FeatureSelectionChainNode() {
    _classCallCheck(this, FeatureSelectionChainNode);

    return _possibleConstructorReturn(this, (FeatureSelectionChainNode.__proto__ || Object.getPrototypeOf(FeatureSelectionChainNode)).apply(this, arguments));
  }

  _createClass(FeatureSelectionChainNode, [{
    key: 'createQueryData',
    value: function createQueryData(type) {
      let data = _get(FeatureSelectionChainNode.prototype.__proto__ || Object.getPrototypeOf(FeatureSelectionChainNode.prototype), 'createQueryData', this).call(this, type);
      if (data.data !== false) {
        return data;
      }
      let options = this._module.options;
      let inputData = this._moduleInputData;

      switch (type) {
        case _enum.dataTypes.ANLS_FEATURE_SELECTION_OPT:
          let dsHisOutput = inputData.find(input => input.dataType == _enum.dataTypes['DS_HIS_OUTPUT']) || { data: false };
          let dsHisOutputData = dsHisOutput.data || {};
          data = {
            data: dsHisOutputData.data || [],
            time: dsHisOutputData.time || [],
            methods: options.methods.filter(v => options.options.selectedTypes.indexOf(v.type) > -1),
            options: options.options
          };
          let dtFactory = _dataTypes2.default.get(type);
          return dtFactory.create(data);
        default:
          logger.warn(`特征选择 模块不支持创建'${type}'类型的 Query 数据`);
          return _dataTypes2.default.createEmpty(type);
      }
    }
  }]);

  return FeatureSelectionChainNode;
}(_chainNode2.default);

exports.default = FeatureSelectionChainNode;

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _chainNode = __webpack_require__(4);

var _chainNode2 = _interopRequireDefault(_chainNode);

var _enum = __webpack_require__(0);

var _dataTypes = __webpack_require__(3);

var _dataTypes2 = _interopRequireDefault(_dataTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

let PcaChainNode = function (_ChainNode) {
  _inherits(PcaChainNode, _ChainNode);

  function PcaChainNode() {
    _classCallCheck(this, PcaChainNode);

    return _possibleConstructorReturn(this, (PcaChainNode.__proto__ || Object.getPrototypeOf(PcaChainNode)).apply(this, arguments));
  }

  _createClass(PcaChainNode, [{
    key: 'createModuleOutputData',

    /** @override  */
    value: function createModuleOutputData(type) {
      let response = this._response;

      let pcaOutput = response.find(row => row.dataType === _enum.dataTypes['ANLS_PCA_OUTPUT']);
      let pcaOutputData = pcaOutput.data[0];

      if (type === _enum.dataTypes.DS_HIS_OUTPUT) {
        try {
          let data = {};
          data.data = pcaOutputData.data.map(row => ({
            name: row.name,
            value: row.value
          }));
          data.time = pcaOutputData.time;
          let dtFactory = _dataTypes2.default.get(type);
          return dtFactory.create(data);
        } catch (e) {
          logger.error(e);
          return _dataTypes2.default.createEmpty(type);
        }
      } else if (type === _enum.dataTypes.DS_OPT) {
        try {
          let dtFactory = _dataTypes2.default.get(type);
          return dtFactory.create(pcaOutputData.data.map(row => ({
            name: row.name,
            dsId: ''
          })));
        } catch (e) {
          logger.error(e);
          return _dataTypes2.default.createEmpty(type);
        }
      }
      logger.warn(`PCA 模块不支持创建'${type}'类型的 Response 数据`);
      return _dataTypes2.default.createEmpty(type);
    }
    /** @override */

  }, {
    key: 'createQueryData',
    value: function createQueryData(type) {
      let inputData = this._moduleInputData;
      let options = this._module.options;

      switch (type) {
        case _enum.dataTypes.ANLS_PCA_OPT:
          let data = options;
          let historyData = inputData.find(row => row.dataType === _enum.dataTypes['DS_HIS_OUTPUT']);
          let value = historyData.data ? historyData.data.data.map(row => ({
            name: row.name,
            value: row.value
          })) : [];
          let time = historyData.data ? historyData.data.time : [];
          let newData = data.selectedDs && data.selectedDs.length ? value.filter(row => data.selectedDs.indexOf(row.name) !== -1) : value;
          data = data.selectedDs ? data.without('selectedDs') : data;
          data = Object.assign({}, data, {
            data: newData,
            time: time
          });
          let dtFactory = _dataTypes2.default.get(type);
          return dtFactory.create(data);
        default:
          logger.warn(`PCA 模块不支持创建'${type}'类型的 Query 数据`);
          return _dataTypes2.default.createEmpty(type);
      }
    }
  }]);

  return PcaChainNode;
}(_chainNode2.default);

exports.default = PcaChainNode;

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _chainNode = __webpack_require__(4);

var _chainNode2 = _interopRequireDefault(_chainNode);

var _enum = __webpack_require__(0);

var _dataTypes = __webpack_require__(3);

var _dataTypes2 = _interopRequireDefault(_dataTypes);

var _moduleConfig = __webpack_require__(5);

var _moduleConfig2 = _interopRequireDefault(_moduleConfig);

var _util = __webpack_require__(6);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

let DataDeduplicationChainNode = function (_ChainNode) {
  _inherits(DataDeduplicationChainNode, _ChainNode);

  function DataDeduplicationChainNode() {
    _classCallCheck(this, DataDeduplicationChainNode);

    return _possibleConstructorReturn(this, (DataDeduplicationChainNode.__proto__ || Object.getPrototypeOf(DataDeduplicationChainNode)).apply(this, arguments));
  }

  _createClass(DataDeduplicationChainNode, [{
    key: 'createQueryData',
    value: function createQueryData(type) {
      let data = _get(DataDeduplicationChainNode.prototype.__proto__ || Object.getPrototypeOf(DataDeduplicationChainNode.prototype), 'createQueryData', this).call(this, type);
      if (data.data !== false) {
        return data;
      }
      let options = this._module.options;
      let inputData = this._moduleInputData;

      switch (type) {
        case _enum.dataTypes.ANLS_DATA_NORMALIZATION_OPT:
          let dsHisOutput = inputData.find(input => input.dataType == _enum.dataTypes['DS_HIS_OUTPUT']) || { data: false };
          let dsHisOutputData = dsHisOutput.data || {};
          data = {
            data: dsHisOutputData.data || [],
            time: dsHisOutputData.time || [],
            methods: options.methods
          };
          let dtFactory = _dataTypes2.default.get(type);
          return dtFactory.create(data);
        default:
          logger.warn(`数据归一化 模块不支持创建'${type}'类型的 Query 数据`);
          return _dataTypes2.default.createEmpty(type);
      }
    }
  }, {
    key: 'createModuleOutputData',
    value: function createModuleOutputData(type) {
      switch (type) {
        case _enum.dataTypes.DS_OPT:
          return this._createData(type, this._moduleInputData);
        case _enum.dataTypes.DS_HIS_OUTPUT:
          let findResp = this._response.find(resp => resp.dataType == _enum.dataTypes['ANLS_DATA_NORMALIZATION_OUTPUT']) || { data: false };
          let findData = findResp.data || {};
          let data = {
            data: findData[0].data || [],
            time: findData[0].time || []
          };
          let dtFactory = _dataTypes2.default.get(type);
          return dtFactory.create(data);
        default:
          logger.warn(`数据归一化 模块不支持创建'${type}'类型的 Response 数据`);
          return _dataTypes2.default.createEmpty(type);
      }
    }
  }]);

  return DataDeduplicationChainNode;
}(_chainNode2.default);

exports.default = DataDeduplicationChainNode;

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _chainNode = __webpack_require__(4);

var _chainNode2 = _interopRequireDefault(_chainNode);

var _enum = __webpack_require__(0);

var _dataTypes = __webpack_require__(3);

var _dataTypes2 = _interopRequireDefault(_dataTypes);

var _moduleConfig = __webpack_require__(5);

var _moduleConfig2 = _interopRequireDefault(_moduleConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

let DataEvaluateChainNode = function (_ChainNode) {
  _inherits(DataEvaluateChainNode, _ChainNode);

  function DataEvaluateChainNode() {
    _classCallCheck(this, DataEvaluateChainNode);

    return _possibleConstructorReturn(this, (DataEvaluateChainNode.__proto__ || Object.getPrototypeOf(DataEvaluateChainNode)).apply(this, arguments));
  }

  _createClass(DataEvaluateChainNode, [{
    key: 'createQueryData',
    value: function createQueryData(type) {
      let data = _get(DataEvaluateChainNode.prototype.__proto__ || Object.getPrototypeOf(DataEvaluateChainNode.prototype), 'createQueryData', this).call(this, type);
      if (data.data !== false) {
        return data;
      }
      let options = this._module.options;
      let inputData = this._moduleInputData;

      switch (type) {
        default:
          logger.warn(`评价 模块不支持创建'${type}'类型的 Query 数据`);
          return _dataTypes2.default.createEmpty(type);
      }
    }
  }]);

  return DataEvaluateChainNode;
}(_chainNode2.default);

exports.default = DataEvaluateChainNode;

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _chainNode = __webpack_require__(4);

var _chainNode2 = _interopRequireDefault(_chainNode);

var _enum = __webpack_require__(0);

var _dataTypes = __webpack_require__(3);

var _dataTypes2 = _interopRequireDefault(_dataTypes);

var _moduleConfig = __webpack_require__(5);

var _moduleConfig2 = _interopRequireDefault(_moduleConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

let DataMonitoringChainNode = function (_ChainNode) {
  _inherits(DataMonitoringChainNode, _ChainNode);

  function DataMonitoringChainNode() {
    _classCallCheck(this, DataMonitoringChainNode);

    return _possibleConstructorReturn(this, (DataMonitoringChainNode.__proto__ || Object.getPrototypeOf(DataMonitoringChainNode)).apply(this, arguments));
  }

  _createClass(DataMonitoringChainNode, [{
    key: 'createQueryData',
    value: function createQueryData(type) {
      let data = _get(DataMonitoringChainNode.prototype.__proto__ || Object.getPrototypeOf(DataMonitoringChainNode.prototype), 'createQueryData', this).call(this, type);
      if (data.data !== false) {
        return data;
      }
      let options = this._module.options;
      let inputData = this._moduleInputData;

      switch (type) {
        default:
          logger.warn(`数据监测 模块不支持创建'${type}'类型的 Query 数据`);
          return _dataTypes2.default.createEmpty(type);
      }
    }
  }, {
    key: 'createModuleOutputData',
    value: function createModuleOutputData(type) {}
  }]);

  return DataMonitoringChainNode;
}(_chainNode2.default);

exports.default = DataMonitoringChainNode;

/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _chainNode = __webpack_require__(4);

var _chainNode2 = _interopRequireDefault(_chainNode);

var _enum = __webpack_require__(0);

var _dataTypes = __webpack_require__(3);

var _dataTypes2 = _interopRequireDefault(_dataTypes);

var _moduleConfig = __webpack_require__(5);

var _moduleConfig2 = _interopRequireDefault(_moduleConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

let EvaluateChainNode = function (_ChainNode) {
  _inherits(EvaluateChainNode, _ChainNode);

  function EvaluateChainNode() {
    _classCallCheck(this, EvaluateChainNode);

    return _possibleConstructorReturn(this, (EvaluateChainNode.__proto__ || Object.getPrototypeOf(EvaluateChainNode)).apply(this, arguments));
  }

  _createClass(EvaluateChainNode, [{
    key: 'createQueryData',
    value: function createQueryData(type) {
      let data = _get(EvaluateChainNode.prototype.__proto__ || Object.getPrototypeOf(EvaluateChainNode.prototype), 'createQueryData', this).call(this, type);
      if (data.data !== false) {
        return data;
      }
      let options = this._module.options;
      let inputData = this._moduleInputData;

      switch (type) {
        case _enum.dataTypes.ANLS_EVALUATE_OPT:
          let anlsSvmOutput = inputData.find(input => input.dataType == _enum.dataTypes['ANLS_SVM_OUTPUT']) || { data: false },
              anlsSvmOutputData = anlsSvmOutput.data;
          let queryOptions = {};
          if (options.selectedMethods.indexOf(_enum.dataTypes['ANLS_SVM_OUTPUT']) > -1 && anlsSvmOutputData) {
            queryOptions['independentVariables'] = anlsSvmOutputData.options.independentVariables;
            queryOptions['dependentVariables'] = anlsSvmOutputData.options.dependentVariables;
            queryOptions['model'] = anlsSvmOutputData.model;
          }
          let timeConfig = options.timeConfig;
          data = {
            startTime: timeConfig.timeStart,
            endTime: timeConfig.timeEnd,
            timeFormat: timeConfig.timeFormat,
            methods: [],
            options: queryOptions
          };
          let dtFactory = _dataTypes2.default.get(type);
          return dtFactory.create(data);

        default:
          logger.warn(`评价 模块不支持创建'${type}'类型的 Query 数据`);
          return _dataTypes2.default.createEmpty(type);
      }
    }
  }]);

  return EvaluateChainNode;
}(_chainNode2.default);

exports.default = EvaluateChainNode;

/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _chainNode = __webpack_require__(4);

var _chainNode2 = _interopRequireDefault(_chainNode);

var _moduleConfig = __webpack_require__(5);

var _moduleConfig2 = _interopRequireDefault(_moduleConfig);

var _enum = __webpack_require__(0);

var _dataTypes = __webpack_require__(3);

var _dataTypes2 = _interopRequireDefault(_dataTypes);

var _diff = __webpack_require__(7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

let DataSortingChainNode = function (_ChainNode) {
  _inherits(DataSortingChainNode, _ChainNode);

  function DataSortingChainNode() {
    _classCallCheck(this, DataSortingChainNode);

    return _possibleConstructorReturn(this, (DataSortingChainNode.__proto__ || Object.getPrototypeOf(DataSortingChainNode)).apply(this, arguments));
  }

  _createClass(DataSortingChainNode, [{
    key: 'getModuleInputData',
    value: function getModuleInputData() {
      if (this._fetchModuleInputDataPromise) {
        return this._fetchModuleInputDataPromise;
      }
      let supportDataTypes = _moduleConfig2.default[this._module.type];
      if (!supportDataTypes.inputs || !supportDataTypes.inputs.length) {
        return this._fetchModuleInputDataPromise = Promise.resolve().then(() => {
          this._fetchModuleInputDataPromise = undefined;
          return this._moduleInputData = [];
        });
      }
      return this._fetchModuleInputDataPromise = Promise.all([...this._in.map(row => row.getModuleOutputData())]).then(params => {
        this._fetchModuleInputDataPromise = undefined;
        let moduleInputData = [];
        let supportDataTypes = _moduleConfig2.default[this._module.type];

        supportDataTypes.inputs.forEach(type => {
          let isOK = false;
          params.forEach(p => {
            isOK = p.some(arg => {
              let rs = this.createModuleInputData(type, arg);
              if (rs.data === false) {
                return false;
              }
              moduleInputData.push(rs);
              return true;
            }); // p.some
          }); // params.some
          if (!isOK) {
            moduleInputData.push(_dataTypes2.default.createEmpty(type));
          }
        }); // inputs.forEach
        moduleInputData = this.mergeData(moduleInputData);
        // diff
        let diffRes = (0, _diff.diff)(this._moduleInputData, moduleInputData);
        if (!diffRes) {
          return this._moduleInputData;
        }
        this._moduleInputData = moduleInputData;
        return moduleInputData;
      } // then
      ).catch(err => {
        this._fetchModuleInputDataPromise = undefined;
        logger.error(err);
      });
    }
  }, {
    key: 'mergeData',
    value: function mergeData(moduleInputData) {
      return moduleInputData;
    }
  }, {
    key: 'createModuleOutputData',
    value: function createModuleOutputData(type) {
      let data = [];
      let options = this._module.options;
      let inputData = this._moduleInputData;
      let dtFactory;
      switch (type) {
        case _enum.dataTypes.DS_OPT:
          //TODO 筛选合并
          return _get(DataSortingChainNode.prototype.__proto__ || Object.getPrototypeOf(DataSortingChainNode.prototype), 'createQueryData', this).call(this, type);
        case _enum.dataTypes.DS_HIS_OUTPUT:
          //TODO 筛选合并
          return _get(DataSortingChainNode.prototype.__proto__ || Object.getPrototypeOf(DataSortingChainNode.prototype), 'createQueryData', this).call(this, type);
        default:
          logger.warn(`数据整理 模块不支持创建'${type}'类型的 Output 数据`);
          return _dataTypes2.default.createEmpty(type);
      }
    }
  }]);

  return DataSortingChainNode;
}(_chainNode2.default);

exports.default = DataSortingChainNode;

/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _chainNode = __webpack_require__(4);

var _chainNode2 = _interopRequireDefault(_chainNode);

var _moduleConfig = __webpack_require__(5);

var _moduleConfig2 = _interopRequireDefault(_moduleConfig);

var _enum = __webpack_require__(0);

var _dataTypes = __webpack_require__(3);

var _dataTypes2 = _interopRequireDefault(_dataTypes);

var _diff = __webpack_require__(7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

let DataExportChainNode = function (_ChainNode) {
  _inherits(DataExportChainNode, _ChainNode);

  function DataExportChainNode() {
    _classCallCheck(this, DataExportChainNode);

    return _possibleConstructorReturn(this, (DataExportChainNode.__proto__ || Object.getPrototypeOf(DataExportChainNode)).apply(this, arguments));
  }

  _createClass(DataExportChainNode, [{
    key: 'getModuleInputData',
    value: function getModuleInputData() {
      if (this._fetchModuleInputDataPromise) {
        return this._fetchModuleInputDataPromise;
      }
      let supportDataTypes = _moduleConfig2.default[this._module.type];
      if (!supportDataTypes.inputs || !supportDataTypes.inputs.length) {
        return this._fetchModuleInputDataPromise = Promise.resolve().then(() => {
          this._fetchModuleInputDataPromise = undefined;
          return this._moduleInputData = [];
        });
      }
      return this._fetchModuleInputDataPromise = Promise.all([...this._in.map(row => row.getModuleOutputData())]).then(params => {
        this._fetchModuleInputDataPromise = undefined;
        let moduleInputData = [];
        let supportDataTypes = _moduleConfig2.default[this._module.type];

        supportDataTypes.inputs.forEach(type => {
          let isOK = false;
          params.forEach(p => {
            isOK = p.some(arg => {
              let rs = this.createModuleInputData(type, arg);
              if (rs.data === false) {
                return false;
              }
              moduleInputData.push(rs);
              return true;
            }); // p.some
          }); // params.some
          if (!isOK) {
            moduleInputData.push(_dataTypes2.default.createEmpty(type));
          }
        }); // inputs.forEach
        moduleInputData = this.mergeData(moduleInputData);
        // diff
        let diffRes = (0, _diff.diff)(this._moduleInputData, moduleInputData);
        if (!diffRes) {
          return this._moduleInputData;
        }
        this._moduleInputData = moduleInputData;
        return moduleInputData;
      } // then
      ).catch(err => {
        this._fetchModuleInputDataPromise = undefined;
        logger.error(err);
      });
    }
  }, {
    key: 'mergeData',
    value: function mergeData(moduleInputData) {
      return moduleInputData;
    }
  }, {
    key: 'createModuleOutputData',
    value: function createModuleOutputData(type) {
      let data = [];
      let options = this._module.options;
      let inputData = this._moduleInputData;
      let dtFactory;
      switch (type) {
        case _enum.dataTypes.DS_OPT:
          //TODO 筛选合并
          return _get(DataExportChainNode.prototype.__proto__ || Object.getPrototypeOf(DataExportChainNode.prototype), 'createQueryData', this).call(this, type);
        case _enum.dataTypes.DS_HIS_OUTPUT:
          //TODO 筛选合并
          return _get(DataExportChainNode.prototype.__proto__ || Object.getPrototypeOf(DataExportChainNode.prototype), 'createQueryData', this).call(this, type);
        default:
          logger.warn(`数据导出 模块不支持创建'${type}'类型的 Output 数据`);
          return _dataTypes2.default.createEmpty(type);
      }
    }
  }]);

  return DataExportChainNode;
}(_chainNode2.default);

exports.default = DataExportChainNode;

/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _chainNode = __webpack_require__(4);

var _chainNode2 = _interopRequireDefault(_chainNode);

var _enum = __webpack_require__(0);

var _dataTypes = __webpack_require__(3);

var _dataTypes2 = _interopRequireDefault(_dataTypes);

var _moduleConfig = __webpack_require__(5);

var _moduleConfig2 = _interopRequireDefault(_moduleConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

let DiagnosisChainNode = function (_ChainNode) {
  _inherits(DiagnosisChainNode, _ChainNode);

  function DiagnosisChainNode() {
    _classCallCheck(this, DiagnosisChainNode);

    return _possibleConstructorReturn(this, (DiagnosisChainNode.__proto__ || Object.getPrototypeOf(DiagnosisChainNode)).apply(this, arguments));
  }

  _createClass(DiagnosisChainNode, [{
    key: 'createQueryData',
    value: function createQueryData(type) {
      let data = _get(DiagnosisChainNode.prototype.__proto__ || Object.getPrototypeOf(DiagnosisChainNode.prototype), 'createQueryData', this).call(this, type);
      if (data.data !== false) {
        return data;
      }
      let options = this._module.options;
      let inputData = this._moduleInputData;

      switch (type) {
        default:
          logger.warn(`图表 模块不支持创建'${type}'类型的 Query 数据`);
          return _dataTypes2.default.createEmpty(type);
      }
    }
  }, {
    key: 'createModuleOutputData',
    value: function createModuleOutputData(type) {
      let options = this._module.options;
      let inputData = this._moduleInputData;
      switch (type) {
        case _enum.dataTypes.DS_HIS_OUTPUT:
          return this._createData(type, this._response);
      }
    }
  }]);

  return DiagnosisChainNode;
}(_chainNode2.default);

exports.default = DiagnosisChainNode;

/***/ })
/******/ ]);
});