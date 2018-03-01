;
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([
            'exports',
            '../../core/model.js',
            './state.js',
            './view.js',
            './actions.js',
            'diff',
            '../../util/mergeDiff.js',
            '../core/Event.js'
        ], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(
            exports,
            require('../core/model.js'),
            require('./state.js'),
            require('./view.js'),
            require('./actions.js'),
            require('diff'),
            require('../../util/mergeDiff.js'),
            require('../core/Event.js')
        );
    } else {
        factory(
            root,
            namespace('beop.strategy.core.Model'),
            namespace('beop.strategy.components.Painter.Sketchpad.State'),
            namespace('beop.strategy.components.Painter.Sketchpad.View'),
            namespace('beop.strategy.components.Painter.Sketchpad.actions'),
            namespace('diff'),
            namespace('beop.util.MergeDiff'),
            namespace('beop.strategy.core.Event')
        );
    }
}(namespace('beop.strategy.components.Painter.Sketchpad'), function(exports, Model, State, View, actions, diff, MergeDiff, Event) {

    function Index(container) {
        if (typeof container === 'string') {
            this.container = document.querySelector(container);
        } else {
            this.container = container;
        }

        // model
        this.model = null;
        // state
        this.state = null;

        // snapshot 用于同步数据时进行比对
        this.snapshot = null;

        this.init();
    }

    // PROTOTYPES
    +

    function() {
        /**
         * Constructor
         */
        this.constructor = Index;

        /**
         * Initialize
         */
        this.init = function() {
            var _this = this;
            var state = new State();
            var view = new View(this.container);
            var model = this.model = new Model(this.modelBLCProcessing.bind(this), state, this.getInitialStore(), state.nap);

            state.init(view);
            actions.init(this.model.present.bind(this.model));
            view.init(actions);

            this.dragenterEvent = function(e) {
                actions.dragenter(e, view);
            }

            this.dragleaveEvent = function(e) {
                actions.dragleave(e, view);
            }

            this.dropEvent = function(e, opt) {
                actions.drop(e, opt, view);
            }

            this.model.subscribe(function(state) {
                state.render(_this.model.getStore());
            });

        };

        this.repaint = function() {
            actions.repaint();
        };

        this.getInitialStore = function() {
            return {
                modules: [],
                update: null,
                selectIds: []
            };
        };

        this.getData = function() {
            return this.model.getStore().modules;
        };

        this.getSnapshot = function() {
            return this.snapshot;
        };

        this.setSnapshot = function(data) {
            this.snapshot = $.extend(true, {}, Array.toMap(data, '_id'));
        };

        this.diff = function(data) {
            var snapshot = this.getSnapshot();

            return diff(snapshot, data, function(lhs, rhs, path) {
                var cmp;
                if (path.length !== 2 || ['option', 'loc'].indexOf(path[1]) === -1) return;
                cmp = window.diff(lhs, rhs);
                return cmp !== null;
            });
        };

        this.sync = function(dataset) {
            var _this = this;
            var data = this.getData();
            var diffData = this.diff(Array.toMap(data, '_id'));

            if (diffData) {
                diffData = MergeDiff(diffData);
                WebAPI.post('/strategy/modules/sync', {
                    modules: diffData
                }).done(function(rs) {
                    if (rs.status === 'OK') {
                        // 同步数据成功
                        _this.setSnapshot(data);
                    } else {
                        // 同步数据失败
                    }

                }).fail(function() {
                    // 服务端报错或通讯失败
                });
            } else {
                // 没有需要同步的数据
            }
        };

        /**
         * @description 初始化 model
         */
        this.modelBLCProcessing = function(store, dataset) {
            var list;

            if (dataset && dataset.type === 'patchModulesData') {
                $.extend(true, Array.toMap(store.modules, '_id'), Array.toMap(dataset.data.modules, '_id'));
                return;
            }

            if (dataset && dataset.type === 'sync') {
                this.sync();
                return;
            }

            if (dataset && dataset.type === 'repaint') {
                store.selectIds = [];
                store.update = null;
            }

            if (dataset && dataset.type === 'queryModulesOutputData') {
                list = [];
                store.modules.forEach(function(row) {
                    if (dataset.exclude.indexOf(row._id) === -1) {
                        list.push({
                            _id: row._id,
                            name: row.name,
                            output: row.option.output
                        });
                    }
                });
                Event.emit('SEND_MODULES_OUTPUT_DATA', {
                    list: list
                });
                return;
            }

            store.modules = dataset.modules || store.modules;
            store.update = dataset.update;
            return store;
        };

        /**
         * @description 初始化 state
         */
        this.show = function(options) {
            var _this = this;

            WebAPI.get('/strategy/item/get/' + options.strategyId).done(function(rs) {
                if (rs.status === 'OK') {
                    _this.setSnapshot(rs.data.modules);
                    _this.model.present({
                        modules: rs.data.modules,
                        update: null,
                        selectIds: []
                    });
                }
            }).fail(function() {
                // 获取页面数据失败，回退到策略表格
            });
        };

        this.close = function() {};

    }.call(Index.prototype);

    exports.Index = Index;
}));