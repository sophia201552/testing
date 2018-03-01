(function ($) {

    function BaseCache(options) {
        this.options = $.extend({}, DEFAULTS, options);
        
        this.storage = Object.create(Beop.cache.drivers[this.options.driver]);

        this.init();
    }

    BaseCache.prototype.init = function () {
        // TODO 浏览器兼容性检测和处理代码
        
        this.storage._initStorage(this.options);
    };

    BaseCache.prototype.length = function () {
        return this.storage.length();
    };

    BaseCache.prototype.key = function (n, callback) {
        return this.storage.key(n, callback);
    };

    BaseCache.prototype.keys = function (callback) {
        return this.storage.keys(callback);
    };

    BaseCache.prototype.getItem = function (key, callback) {
        return this.storage.getItem(key, callback);
    };

    BaseCache.prototype.getItemList = function (keyList, callback) {
        return this.storage.getItemList(keyList, callback);
    };

    BaseCache.prototype.setItem = function (key, value, callback) {
        return this.storage.setItem(key, value, callback);
    };

    BaseCache.prototype.setItemList = function (kvList, callback) {
        return this.storage.setItemList(kvList, callback);
    };

    BaseCache.prototype.removeItem = function (key, callback) {
        return this.storage.removeItem(key, callback);
    };

    BaseCache.prototype.removeItemList = function (keyList, callback) {
        return this.storage.removeItemList(keyList, callback);
    };

    BaseCache.prototype.clear = function (callback) {
        return this.storage.clear(callback);
    };

    BaseCache.prototype.iterate = function (iterator, callback) {
        return this.storage.iterate(iterator, callback);
    };

    var DEFAULTS = {
        // 默认使用 localStorage
        dbType: 'localStorage',
        name: 'beopcache',
        version: 3
    };

    /////////////
    // exports //
    /////////////
    this.Beop = this.Beop || {};
    this.Beop.cache = this.Beop.cache || {};

    this.Beop.cache.BaseCache = BaseCache;
}).call(this, jQuery);