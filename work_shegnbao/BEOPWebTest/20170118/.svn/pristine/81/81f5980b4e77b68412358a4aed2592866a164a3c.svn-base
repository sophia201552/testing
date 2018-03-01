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
            root,
            namespace('beop.strategy.core.constants')
        );
    }
}(namespace('beop.strategy.core'), function(exports, constants) {

    exports.createDispatch = function(present, reducer) {
        return reducer(present);
    }
}));