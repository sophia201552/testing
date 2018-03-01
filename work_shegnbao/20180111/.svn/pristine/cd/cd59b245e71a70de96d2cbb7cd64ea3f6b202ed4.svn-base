;(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([
            'exports'
        ], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(
            exports
        );
    } else {
        factory(
            root
        );
    }
}(namespace('beop.strategy.core'), function(
    exports
) {
    var history = window.history;
    var pushState = history.pushState;
    var replaceState = history.replaceState;

    // 重写 history.pushState 方法
    history.pushState = function(state, title, url) {
        if (typeof history.onpushstate === "function") {
            history.onpushstate({
                state: state,
                title: title,
                url: url
            });
        }
        return pushState.apply(history, arguments);
    }

    // 重写 history.replaceState 方法
    history.replaceState = function(state, title, url) {
        if (typeof history.onreplacestate === 'function') {
            history.onreplacestate({
                state: state,
                title: title,
                url: url
            });
        }
        return replaceState.apply(history, arguments);
    }

    exports.history = history;
}));