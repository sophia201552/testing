// dependencies: ['jQuery']
(function ($) {
    'use strict';

    var localStorage;

    try {
        // 若浏览器不支持则不继续执行
        if ( !this.localStorage || !('setItem' in this.localStorage) ) {
            return;
        }
        localStorage = this.localStorage;
    } catch (e) {
        return;
    }

    function _initStorage(options) {
        this._dbInfo = $.extend({}, options);
        this._dbInfo.keyPrefix = this._dbInfo.name + '/';
    }

    function length(callback) {
        var _this = this;

        var promise = this.keys().then(function (keys) {
            return keys.length;
        });

        excuteCallback(promise, callback);

        return promise;
    }

    function getItem(key, callback) {
        var _this = this;

        if( typeof key !== 'string' ) {
            console.warn('The key is not a string!');
            key = String(key);
        }

        var promise = $.Deferred();
        ( function () {
            var result;
            result = localStorage.getItem( this._dbInfo.keyPrefix+key );
            // json 反序列化
            try { result = JSON.parse(result); } catch(e) {}
            promise.resolve(result);
            
        } ).call(this);

        excuteCallback(promise, callback);

        return promise;
    }

    function getItemList(keyList, callback) {
        var _this = this;

        var promise = $.Deferred();
        (function () {
            var result = {};

            keyList.forEach(function (key, i) {
                if( typeof key !== 'string' ) {
                    console.warn('The key is not a string!');
                    key = String(key);
                }
                result[key] = localStorage.getItem( _this._dbInfo.keyPrefix+key );
                // json 反序列化
                try { result[key] = JSON.parse(result[key]); } catch(e) {}
            });
            promise.resolve(result);

        }).call(this);

        excuteCallback(promise, callback);

        return promise;
    }

    function setItem(key, value, callback) {
        if( typeof key !== 'string' ) {
            console.warn('The key is not a string!');
            key = String(key);
        }

        var promise = $.Deferred();
        (function () {
            var _this = this;
            var result;
            try {
                // json 序列化
                try { value = JSON.stringify(value); } catch(e) {}
                result = localStorage.setItem( _this._dbInfo.keyPrefix+key, value );
                promise.resolve(result);
            } catch(e) {
                result = null;
                if(e.name === 'QuotaExceededError' ||
                    e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
                    promise.reject(e);
                    return;
                }
                promise.reject(e);
            }
        }).call(this);

        excuteCallback(promise, callback);

        return promise;
    }

    // example: [{key: '1', value: 'apple'}, {key: '2', value: 'banana'}]
    function setItemList(kvList, callback) {
        var promise = $.Deferred();
        (function () {
            var _this = this;
            var result = {};

            kvList.forEach(function (kv, i) {
                var value;
                if( typeof kv.key !== 'string' ) {
                    console.warn('The key is not a string!');
                    kv.key = String(kv.key);
                }
                try {
                    // json 序列化
                    try { value = JSON.stringify(kv.value); } catch(e) { value = kv.value; }
                    result[kv.key] = localStorage.setItem( _this._dbInfo.keyPrefix+kv.key, value );
                } catch(e) {
                    console.warn('occur error when set data into storage [key: "'+kv.key+'", value: "'+kv.value+'"]');              
                    result[kv.key] = null;
                    // 缓存溢出
                    if(e.name === 'QuotaExceededError' ||
                        e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
                        promise.reject(e);
                        return;
                    }
                }
            });
            promise.resolve();

        }).call(this);

        excuteCallback(promise, callback);

        return promise;
    }

    function removeItem(key, callback) {

        if( typeof key !== 'string' ) {
            console.warn('The key is not a string!');
            key = String(key);
        }

        var promise = $.Deferred();
        try {
            (function () {
                localStorage.removeItem(this._dbInfo.keyPrefix + key);
                promise.resolve();
            }).call(this);
        } catch(e) {
            promise.reject(e);
        }

        excuteCallback(promise, callback);
        return promise;
    }

    function removeItemList(keyList, callback) {
        var promise = $.Deferred();

        try {
            (function () {
                var _this = this;
                keyList.forEach(function (key, i) {
                    if( typeof key !== 'string' ) {
                        console.warn('The key is not a string!');
                        key = String(key);
                    }
                    localStorage.removeItem(_this._dbInfo.keyPrefix + key);
                });
                promise.resolve();
            }).call(this);
        } catch(e) {
            promise.reject(e);
        }

        excuteCallback(promise, callback);
        return promise;
    }

    function clear(callback) {
        var _this = this;
        var promise = $.Deferred();

        try {
            (function () {
            var keyPrefix = this._dbInfo.keyPrefix;
                var key;
                
                for (var i = localStorage.length-1; i >= 0; i--) {
                    key = localStorage.key(i);
                    if( key.indexOf(keyPrefix) === 0 ) {
                        localStorage.removeItem(key);
                    }
                }
                promise.resolve();
                
            }).call(this);
        } catch(e) {
            proimse.reject(e);
        }

        excuteCallback(promise, callback);

        return promise;
    }

    function key(n, callback) {
        var _this = this;

        var promise = $.Deferred();
        ( function () {
            var result;

            result = localStorage.key(n);
            if(result) {
                result = result.substring(_this._dbInfo.keyPrefix.length);
            }

            promise.resolve(result);
        } ).call(this);

        excuteCallback(promise, callback);

        return promise;
    }

    function keys(callback) {
        var _this = this;

        var promise = $.Deferred();
        ( function () {
            var keyPrefix = this._dbInfo.keyPrefix;
            var length = localStorage.length;
            var keys = [], key;

            for (var i = 0; i < length; i++) {
                key = localStorage.key(i);
                if( key.indexOf(keyPrefix) === 0 ) {
                    keys.push( key.substring(keyPrefix.length) );
                }
            }
            promise.resolve(keys);
        } ).call(this);

        excuteCallback(promise, callback);

        return promise;
    }

    function iterate(iterator, callback) {
        var _this = this;

        var promise = $.Deferred();
        try {
            (function () {
                var keyPrefix = this._dbInfo.keyPrefix;
                var key, value;
                var result;

               for (var i = localStorage.length-1; i >= 0; i--) {
                    key = localStorage.key(i);
                    if( key.indexOf(keyPrefix) === 0 ) {
                        value = localStorage.getItem(key);
                        // JSON 反序列化
                        try { value = JSON.parse(value); } catch(e) {}
                        result = iterator(key.substring(keyPrefix.length), value, i);
                    }
                    if(result === false) {
                        break;
                    }
                }
                promise.resolve();
            }).call(this);
        } catch(e) {
            promise.reject(e);
        }

        excuteCallback(promise, callback);
        return promise;
    }

    function excuteCallback(promise, callback) {
        if( typeof callback === 'function' ) {
            promise.then( function (result) {
                callback(null, result);
            }, function (error) {
                callback(erro);
            } );
        }
    }

    var localStorageWrapper = {
        _driver: 'localStorageWrapper',
        _initStorage: _initStorage,
        length: length,
        getItem: getItem,
        getItemList: getItemList,
        setItem: setItem,
        setItemList: setItemList,
        removeItem: removeItem,
        removeItemList: removeItemList,
        clear: clear,
        key: key,
        keys: keys,
        iterate: iterate
    };

    this.Beop = this.Beop || {};
    this.Beop.cache = this.Beop.cache || {};
    this.Beop.cache.drivers = this.Beop.cache.drivers || {};

    this.Beop.cache.drivers.localStorage = localStorageWrapper;

}).call(this, jQuery);