;
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([
            'exports',
            '../core/model.js',
            './Python/python.js',
            '../core/Event.js',
            'Inferno'
        ], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(
            exports,
            require('../core/model.js'),
            require('./Python/python.js'),
            require('../core/Event.js'),
            require('Inferno')
        );
    } else {
        factory(
            root,
            namespace('beop.strategy.core.Model'),
            namespace('beop.strategy.components.ModuleConfigPanel.Python.Index'),
            namespace('beop.strategy.core.Event'),
            namespace('Inferno')
        );
    }
}(namespace('beop.strategy.components.ModuleConfigPanel'), function(
    exports,
    Model,
    Python,
    Event,
    Inferno
) {

    var h = Inferno.h;

    function Index(container, options) {
        if (typeof container === 'string') {
            this.container = document.querySelector(container);
        } else {
            this.container = container;
        }

        this.options = options || {};
        this.store = this.options.store || {};

        this.init();
    }

    var model, state, view, theme, actions;
    // child components
    var child;
    // PROTOTYPES
    +function() {
        /**
         * Constructor
         */
        this.constructor = Index;

        /**
         * initialize app
         */
        this.init = function() {
            view.container = this.container;
            model = new Model(this.modelBLCProcessing.bind(this), state, this.getInitialStore(), state.nap);

            model.subscribe(function (state) {
                state.render(model.getStore());
            });
        };

        this.getInitialStore = function () {
            var _this = this;

            return {
                title: (function () {
                    switch(_this.store.type) {
                        case 0:
                            return 'Python ';
                        default:
                            return '';
                    }
                } ()) + '模块编辑',
                data: _this.store
            };
        };

        this.modelBLCProcessing = function (store, dataset) {
            return store;
        };

        this.show = function() {
            model.updateState();
        };

        this.close = function() {
            child.close();
            child = null;
        };

    }.call(Index.prototype);

    // state
    (function () {
        state = {
            bindModel: function () {
                return this;
            },
            nap: function () {
                return function () {
                    if (!child) {
                        var dom = document.querySelector('#configPanelContent');
                        var data = model.getStore().data;
                        switch(data.type) {
                            case 0:
                                child = new Python(dom, {
                                    store: data
                                });
                                break;
                            default:
                                child = new Python(dom, {
                                    store: data
                                });
                                break;
                        }
                    }
                    child && child.show();
                }
            },
            ready: function () {
                return true;
            },
            representation: function (model) {
                var representation = '';

                if (this.ready()) {
                    representation = view.ready(model,actions);
                    view.display(representation);
                }
            },
            render: function (model) {
                this.representation(model);
            }
        };

    }());

    // view
    (function () {
        view = {
            container: null,
            ready: function (model,actions) {
                return (
                    h('.pyVariable', [
                        theme.toolbar(model.title,actions),
                        h('#configPanelContent')
                    ])
                );
            },
            display: function (representation) {
                Inferno.render(representation, this.container);
            }
        };

        theme = {
            toolbar: function (title,actions) {
                return (
                    h('.toolBar', [
                        h('.title', title),
                        h('.btns', [
                            h('buttons.btn.btn-default', {
                                onclick: function () {
                                    actions.clickSaveQuit();
                                }
                            }, '保存并退出'),
                            h('buttons.btn.btn-default', {
                                onclick: function () {
                                    actions.clickSave();
                                }
                            }, '保存'),
                            h('buttons.btn.btn-default', {
                                onclick: function () {
                                    actions.clickQuit();
                                }
                            }, '退出')
                        ])
                    ])
                );
            }
        };

    }());

    // actions
    (function () {
        actions = {
            clickSave: function () {
                if (child) {
                    data = child.getData();
                    // 交由 sketchpad 进行数据同步处理
                    Event.emit('PATCH_MODULES_DATA', {
                        modules: [data]
                    });
                }
            },

            clickQuit: function ()　{
                Event.emit('QUIT_MODULE_CONFIG', {
                    action: 'quit',
                    from: 'ModuleConfigPanel',
                    data: {}
                });
            },

            clickSaveQuit : function () {
                this.clickSave();
                this.clickQuit();
            }
        };

        exports.actions = actions;
    }());

    exports.Index = Index;
}));