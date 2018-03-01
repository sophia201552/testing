/**
 * 兼容 Inferno.linkEvent 方法
 * @author Peter peter.zhao@rnbtech.com.hk
 */

;(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(exports);
    } else {
        factory(
            root
        );
    }
}(window.React, function(exports) {

    var cachedHandlerList = [];
    var cachedWrapFuncList = [];

    exports.linkEvent = function (data, handler) {
        var idx, wrapFunc;

        if ( (idx = cachedHandlerList.indexOf(handler)) > -1 ) {
            wrapFunc = cachedWrapFuncList[idx];
        } else {
            idx = cachedHandlerList.length;
        }

        if (!wrapFunc) {
            wrapFunc = function (e) { handler(data, e); };
            cachedWrapFuncList[idx] = wrapFunc;
        }

        return wrapFunc;
    };
}));