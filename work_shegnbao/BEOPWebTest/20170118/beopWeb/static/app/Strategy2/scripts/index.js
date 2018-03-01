;
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([
            'exports',
            'React',
            'ReactDOM',
            './components/App/App.js',
            './core/createModel',
            './core/createDispatch'
        ], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(
            exports,
            require('React'),
            require('ReactDOM'),
            require('./components/App/App.js'),
            require('./core/createModel'),
            require('./core/createDispatch')
        );
    } else {
        factory(
            root,
            namespace('React'),
            namespace('ReactDOM'),
            namespace('beop.strategy.components.App'),
            namespace('beop.strategy.components.Painter')
        );
    }
}(namespace('beop.strategy'), function(exports, React, ReactDOM, App, Painter) {

    var h = React.h;

    // 组合 action
    var dispatch = function (action) {
        App.dispatch(action);
        Painter.dispatch(action);
    };

    var render = function() {
        ReactDOM.render(h(App, {
            dispatch: dispatch
        }), document.querySelector('#mainframe'));
    };

    var promise = $.Deferred();
    promise.done(function() {
        render();
    });
    window.initI18n(navigator.language.split('-')[0], false, promise);
}));