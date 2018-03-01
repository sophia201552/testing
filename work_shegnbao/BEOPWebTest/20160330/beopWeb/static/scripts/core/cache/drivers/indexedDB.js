// dependencies: ['jQuery']
(function () {
    'use strict';

    var indexedDB = indexedDB || this.indexedDB || this.webkitIndexedDB ||
                    this.mozIndexedDB || this.OIndexedDB ||
                    this.msIndexedDB;

    // 如果当前浏览器不支持 indexDB，则不继续执行
    if (!indexedDB) {
        return;
    }

    function _initStorage(options) {
        var _this = this;
        this._dbInfo = $.extend({db: null}, options);

        var promise = $.Deferred();
        (function () {
            var _this = this;
            var dbInfo = this._dbInfo;
            var openreq = indexedDB.open(dbInfo.name, dbInfo.version);
            // 失败
            openreq.onerror = function () {
                promise.reject(openreq.error);
            };
            // 成功
            openreq.onsuccess = function () {
                dbInfo.db = openreq.result;
                promise.resolve();
            };
            // 版本变化，需要更新数据库
            openreq.onupgradeneeded = function () {
                var names = openreq.result.objectStoreNames;
                var length, key;
                var indexOf = ([]).indexOf;

                if( indexOf.call(names, 'cache') > -1 ) {
                    openreq.result.deleteObjectStore('cache');
                }
                if( indexOf.call(names, 'datasource') > -1 ) {
                    openreq.result.deleteObjectStore('datasource');
                }
                if( indexOf.call(names, 'thumbnail') > -1 ) {
                    openreq.result.deleteObjectStore('thumbnail');
                }
                if( indexOf.call(names, 'buffer') === -1 ) {
                    openreq.result.createObjectStore('buffer');
                }

                openreq.result.createObjectStore('datasource');
                openreq.result.createObjectStore('thumbnail');

                // 让数据分析的缩略图重新从数据库获取
                for (var i = 0, len = localStorage.length; i < len; i++) {
                    key = localStorage.key(i);
                    if( key.indexOf('workSpacePicStorageEnable') === 0 ) {
                        localStorage.removeItem(key);
                    }
                }

            };
        }).call(this);
    }

    function length(callback) {
        var _this = this;

        var promise = $.Deferred();

        try {
            (function () {
                var dbInfo = _this._dbInfo;
                var store = dbInfo.db.transaction(dbInfo.storeName, 'readonly')
                    .objectStore(dbInfo.storeName);
                var req = store.count();

                req.onsuccess = function () {
                    promise.resolve(req.result);
                };
                req.onerror = function () {
                    promise.reject(req.error);
                };
            }).call(this);
        } catch(e) {
            promise.reject(e);
        }

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
        try {
            (function () {
                var dbInfo = this._dbInfo;
                var store = dbInfo.db.transaction(dbInfo.storeName, 'readonly')
                    .objectStore(dbInfo.storeName);
                var req = store.get(key);

                req.onsuccess = function () {
                    var value = req.result;
                    value = value === undefined ? null : value;
                    promise.resolve(value);
                };
                
                req.onerror = function () {
                    promise.reject(req.error);
                };
            }).call(this);
        } catch(e) {
            promise.reject(e);
        }
        
        excuteCallback(promise, callback);

        return promise;
    }

    function getItemList(keyList, callback) {
        var result = {};
        var promise = this.iterate(function (key, value, i) {
            if( keyList.indexOf(key) > -1 ) {
                result[key] = value;
            }
        }).then(function () {
            return result;
        }, function () {
            console.warn('getItemList error!');
        });

        excuteCallback(promise, callback);

        return promise;
    }

    function setItem(key, value, callback) {
        var _this = this;

        if( typeof key !== 'string' ) {
            console.warn('The key is not a string!');
            key = String(key);
        }

        var promise = $.Deferred();

        try {
            (function () {
                var dbInfo = _this._dbInfo;
                var transaction = dbInfo.db.transaction(dbInfo.storeName, 'readwrite');
                var store = transaction.objectStore(dbInfo.storeName);

                var req = store.put(value, key);
                transaction.oncomplete = function () {
                    promise.resolve();
                };
                transaction.onabort = transaction.onerror = function () {
                    var err = req.error ? req.error : req.transaction.error;
                    promise.reject(err);
                };

            }).call(this);
        } catch(e) {
            promise.reject(e);
        }

        excuteCallback(promise, callback);

        return promise;
    }

    function setItemList(kvList, callback) {
        var promise = $.Deferred();
        try {
            (function () {
                var _this = this;
                var dbInfo = this._dbInfo;
                var transaction = dbInfo.db.transaction(dbInfo.storeName, 'readwrite');
                var store = transaction.objectStore(dbInfo.storeName);
                var result = {};
                
                kvList.forEach(function (kv, i) {
                    var key = kv.key, value = kv.value;
                    if( typeof key !== 'string' ) {
                        console.warn('The key is not a string!');
                        key = String(key);
                    }
                    store.put(value, key);
                });

                transaction.oncomplete = function () {
                    promise.resolve();
                };
                transaction.onabort = transaction.onerror = function () {
                    var err = transaction.error;
                    promise.reject(err);
                };
            }).call(this);
        } catch(e) {
            console.warn('setItemList error!');
            promise.reject(e);
        }

        excuteCallback(promise, callback);

        return promise;
    }

    function removeItem(key, callback) {
        var _this = this;

        if( typeof key !== 'string' ) {
            console.warn('The key is not a string!');
            key = String(key);
        }

        var promise = $.Deferred();

        try {
            (function () {
                var dbInfo = this._dbInfo;
                var transaction = dbInfo.db.transaction(dbInfo.storeName, 'readwrite');
                var store = transaction.objectStore(dbInfo.storeName);
                var req = store.delete(key);

                transaction.oncomplete = function () {
                    promise.resolve();
                };
                transaction.onabort = transaction.onerror = function () {
                    var err = req.error ? req.error : req.transaction.error;
                    promise.reject(err);
                };
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
                var dbInfo = this._dbInfo;
                var transaction = dbInfo.db.transaction(dbInfo.storeName, 'readwrite');
                var store = transaction.objectStore(dbInfo.storeName);
                var req = store.openCursor();

                req.onsuccess = function () {
                    var cursor = req.result;
                    var request;

                    if(!cursor) {
                        promise.resolve();
                        return;
                    }
                    if(keyList.indexOf(cursor.key) > -1) {
                        cursor.delete();
                    }
                    cursor.continue();
                };

                req.onerror = function (err) {
                    promise.reject(err);
                };

            }).call(this);
        } catch(e) {
            promise.reject();
        }

        excuteCallback(promise, callback);

        return promise;
    }

    function clear(callback) {
        var _this = this;

        var promise = $.Deferred();

        try {
            (function () {
                var dbInfo = this._dbInfo;
                var transaction = dbInfo.db.transaction(dbInfo.storeName, 'readwrite');
                var store = transaction.objectStore(dbInfo.storeName);
                var req = store.clear();

                transaction.oncomplete = function () {
                    promise.resolve();
                };
                transaction.onabort = transaction.onerror = function () {
                    var err = req.error ? req.error : req.transaction.error;
                    promise.reject(err);
                };

            }).call(this);
        } catch(e) {
            promise.reject(e);
        }

        excuteCallback(promise, callback);

        return promise;
    }

    function key(n, callback) {
        var _this = this;

        var promise = $.Deferred();

        try {
            (function () {
                var dbInfo = this._dbInfo;
                var store = dbInfo.db.transaction(dbInfo.storeName, 'readonly')
                    .objectStore(dbInfo.storeName);
                
                var req = store.openCursor();
                var advanced = false;

                req.onsuccess = function () {
                    var cursor = req.result;

                    if(!cursor) {
                        // 如果没有找到，则返回 null
                        promise.resolve(null);
                        return;
                    }

                    if(n === 0) {
                        promise.resolve(cursor.key);
                    } else {
                        if(!advanced) {
                            advanced = true;
                            cursor.advance(n);
                        } else {
                            promise.resolve(cursor.key);
                        }
                    }
                };

                req.onerror = function () {
                    promise.reject(req.error);
                };

            }).call(this);
        } catch(e) {
            promise.reject(e);
        }

        excuteCallback(promise, callback);

        return promise;
    }

    function keys(callback) {
        var _this = this;

        var promise = $.Deferred();

        try {
            (function () {
                var dbInfo = this._dbInfo;
                var store = dbInfo.db.transaction(dbInfo.storeName, 'readonly')
                    .objectStore(dbInfo.storeName);
                var keys = [];
                var req = store.openCursor();

                req.onsuccess = function () {
                    var cursor = req.result;

                    if(!cursor) {
                        promise.resolve(keys);
                        return;
                    }

                    keys.push(cursor.key);
                    cursor.continue();
                };
                req.onerror = function () {
                    promise.reject(req.error);
                };

            }).call(this);
        } catch(e) {
            promise.reject(e);
        }

        excuteCallback(promise, callback);

        return promise;
    }

    function iterate(iterator, callback) {
        var _this = this;

        var promise = $.Deferred();

        try {
            (function () {
                var dbInfo = this._dbInfo;
                var store = dbInfo.db.transaction(dbInfo.storeName, 'readonly')
                    .objectStore(dbInfo.storeName);
                var req = store.openCursor();
                var index = 0;

                req.onsuccess = function () {
                    var cursor = req.result;
                    var result;

                    if(!cursor) {
                        promise.resolve();
                        return;
                    }

                    result = iterator(cursor.key, cursor.value, index++);

                    if(result === false) {
                        promise.resolve();
                        return;
                    }

                    cursor.continue();

                };
                req.onerror = function () {
                    promise.reject(req.error);
                };

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

    var indexDBWrapper = {
        _driver: 'indexedDBWrapper',
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

    this.Beop.cache.drivers.indexedDB = indexDBWrapper;

}).call(this);