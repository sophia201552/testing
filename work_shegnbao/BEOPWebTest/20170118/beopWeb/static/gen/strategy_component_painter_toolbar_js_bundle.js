;
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(exports);
    } else {
        factory(
            root
        );
    }
}(namespace('beop.strategy.components.Painter.Toolbar'), function(exports) {

    function State() {
        this.model = null;
        this.view = null;

        this.init();
    }

    // PROTOTYPES
    +

    function() {
        /**
         * Constructor
         */
        this.constructor = State;

        this.init = function(view) {
            this.view = view;
        };

        this.bindModel = function(model) {
            this.model = model;
            return this;
        };

        this.ready = function() {
            return true;
        };

        this.update = function() {
            return false;
        };

        this.nap = function() {
            return function() {
                return undefined;
            }
        };

        // 渲染页面
        this.render = function(model) {
            this.representation(model);
        };

        this.representation = function(model) {
            var representation = 'something was wrong!';
            if (this.ready()) {
                representation = this.view.ready(model);
            }

            if (this.update()) {

            }
            this.view.display(representation);
        };

    }.call(State.prototype);

    exports.State = State;
}));
;
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', 'Inferno'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(
            exports,
            require('Inferno')
        );
    } else {
        factory(
            root,
            namespace('Inferno')
        );
    }
}(namespace('beop.strategy.components.Painter.Toolbar'), function(exports, Inferno) {
    var h = Inferno.h;

    function View(container) {
        this.container = container;
    }

    // PROTOTYPES
    +

    function() {
        /**
         * Constructor
         */
        this.constructor = View;

        this.init = function(actions) {
            this.actions = actions;
        };

        this.ready = function(model) {
            var _this = this;
            var backClick = function(e) {
                    _this.actions['back']({ target: e.target });
                },
                debugClick = function(e) {
                    _this.actions['debug']({ target: e.target });
                },
                saveClick = function(e) {
                    _this.actions['save']({ target: e.target });
                },
                dragstart = function(e) {
                    _this.actions['dragstart'](e);
                };
            var pyBtn = h('button', {
                    class: 'btn btn-default toolsItem',
                    'data-type': 'py',
                    draggable: 'true',
                    onDragstart: dragstart
                }, [
                    h('span', {
                        class: 'iconfont icon-daima'
                    }),
                    'Python'
                ]),
                remoteAPIBtn = h('button.btn.btn-default.fl', {
                    'data-type': 'API',
                    draggable: 'true',
                    onDragstart: dragstart
                }, [
                    h('span', {
                        class: 'iconfont icon-API offset',
                        style: {
                            'top': '2px'
                        }
                    }),
                    '远程API'
                ]),
                KPIBtn = h('button.btn.btn-default.fl', {
                    'data-type': 'KPI',
                    draggable: 'true',
                    onDragstart: dragstart
                }, [
                    h('span', {
                        class: 'iconfont icon-KPI offset'
                    }),
                    'KPI'
                ]),
                diagnoseBtn = h('button.btn.btn-default.fl', {
                    'data-type': 'diagnose',
                    draggable: 'true',
                    onDragstart: dragstart
                }, [
                    h('span', {
                        class: 'iconfont icon-zhenduan1 offset'
                    }),
                    '诊断'
                ]),
                fuzzyRuleBtn = h('button.btn.btn-default.fl', {
                    'data-type': 'fr',
                    draggable: 'true',
                    onDragstart: dragstart
                }, [
                    h('span', {
                        class: 'iconfont icon-mohuguize'
                    }),
                    '模糊规则'
                ]),
                ruleBtn = h('button.btn.btn-default.fl', {
                    'data-type': 'rule',
                    draggable: 'true',
                    onDragstart: dragstart
                }, [
                    h('span', {
                        class: 'iconfont icon-guize offset'
                    }),
                    '规则'
                ]),
                select = h('div.dropdown', [
                    h('button#dLabel', {
                        class: "btn btn-default fl",
                        type: "button",
                        'data-toggle': "dropdown",
                        'aria-haspopup': 'true',
                        'aria-expanded': "false"
                    }, [
                        '模式选择',
                        h('span.caret')
                    ]),
                    h('ul', {
                        class: 'dropdown-menu',
                        role: "menu",
                        'aria-labelledby': "dLabel"
                    }, [
                        h('li', {
                            role: "presentation"
                        }, [
                            h('a', {
                                role: "menuitem",
                                tabindex: "-1",
                                'data-type': 'return',
                                draggable: 'true',
                                onDragstart: dragstart
                            }, [
                                h('span', {
                                    class: 'iconfont icon-huigui offset'
                                }),
                                '回归'
                            ])
                        ]),
                        h('li', {
                            role: "presentation"
                        }, [
                            h('a', {
                                role: "menuitem",
                                tabindex: "-1",
                                'data-type': 'forecast',
                                draggable: 'true',
                                onDragstart: dragstart
                            }, [
                                h('span', {
                                    class: 'iconfont icon-yuce offset'
                                }),
                                '预测'
                            ])
                        ]),
                        h('li', {
                            role: "presentation"
                        }, [
                            h('a', {
                                role: "menuitem",
                                tabindex: "-1",
                                'data-type': 'Fa',
                                draggable: 'true',
                                onDragstart: dragstart
                            }, [
                                h('span', {
                                    class: 'iconfont icon-fuliyefenxi offset'
                                }),
                                '傅里叶分析'
                            ])
                        ]),
                        h('li', {
                            role: "presentation"
                        }, [
                            h('a', {
                                role: "menuitem",
                                tabindex: "-1",
                                'data-type': 'Wa',
                                draggable: 'true',
                                onDragstart: dragstart
                            }, [
                                h('span', {
                                    class: 'iconfont icon-xiaobofenxi'
                                }),
                                '小波分析'
                            ])
                        ]),
                        h('li', {
                            role: "presentation"
                        }, [
                            h('a', {
                                role: "menuitem",
                                tabindex: "-1",
                                'data-type': 'Fc',
                                draggable: 'true',
                                onDragstart: dragstart
                            }, [
                                h('span', {
                                    class: 'iconfont icon-nihequxian'
                                }),
                                '拟合曲线'
                            ])
                        ]),
                        h('li', {
                            role: "presentation"
                        }, [
                            h('a', {
                                role: "menuitem",
                                tabindex: "-1",
                                'data-type': 'Hc',
                                draggable: 'true',
                                onDragstart: dragstart
                            }, [
                                h('span', {
                                    class: 'iconfont icon-lishiquxian'
                                }),
                                '历史曲线'
                            ])
                        ])
                    ])
                ]),
                rect1 = h('div', { class: 'rect1' }),
                rect2 = h('div', { class: 'rect2' }),
                rect3 = h('div', { class: 'rect3' }),
                rect4 = h('div', { class: 'rect4' }),
                rect5 = h('div', { class: 'rect5' }),
                saveAnimate = h('div', { class: 'spCss ' }, [rect1, rect2, rect3, rect4, rect5]),
                debugBtn = h('button', { class: 'btn btn-primary', onClick: debugClick }, ['调试']),
                saveBtn = h('button', { id: 'saveBtn', class: 'btn btn-primary', onClick: saveClick }, ['保存']),
                animateBtn = h('button', { id: 'saveAnimate', class: 'btn btn-primary' }, [saveAnimate]),
                backBtn =h('button', { class: 'btn btn-primary fl', onClick: backClick }, ['返回']),
                rightBtnGroup = Inferno.h('button', { class: 'btn-group fr', style: { border: 'none', padding: '0', position: 'absolute', top: '84px', right: '10px', 'z-index': '1000' } }, [debugBtn, saveBtn, animateBtn, backBtn]),
                group = h('div.btnGroup', {}, [pyBtn, remoteAPIBtn, KPIBtn, diagnoseBtn, fuzzyRuleBtn, ruleBtn, select, rightBtnGroup]);
            return group;
        };

        this.display = function(representation) {
            Inferno.render(representation, this.container);
        };

    }.call(View.prototype);

    +

    function() {

        this.intents = {};

    }.call(View.prototype.theme = {});

    exports.View = View;
}));
;
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', '../../core/Event.js'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(exports, require('../../core/Event.js'));
    } else {
        factory(
            root,
            namespace('beop.strategy.core.Event')
        );
    }
}(namespace('beop.strategy.components.Painter.Toolbar'), function(exports, Event) {

    function Actions() {
        this.present = null;
    }

    // PROTOTYPES
    +

    function() {
        /**
         * Constructor
         */
        this.constructor = Actions;

        this.init = function(present) {
            this.present = present;
        };

        this.back = function(data, present) {
            Event.emit('SHOW_TABLE', {
                action: 'back',
                from: 'Painter',
                id: data.target.dataset.id
            });
        }

        this.dragstart = function(e) {
            var $this = $(e.target);
            var offset = $this.offset();
            var type = $this.data('type');
            var info = {
                x: e.clientX - offset.left,
                y: e.clientY - offset.top,
                w: $this.width(),
                h: $this.height(),
                type: type
            }
            e.dataTransfer.setData("info", JSON.stringify(info));
        }

        this.save = function(data, present) {
            Event.emit('SYNC_MODULES_DATA');
        };

        this.debug = function(data, present) {

        }

        this.recover = function(data, present) {
            present = present || this.present;
            var rs = {
                isRecover: true
            }
            present(rs);
        };

    }.call(Actions.prototype);

    var actions = new Actions();
    var n = "beop.strategy.components.Painter.Toolbar.actions";

    actions.intents = {
        back: 'namespace(\'' + n + '\').' + 'back',
        dragstart: 'namespace(\'' + n + '\').' + 'dragstart',
        save: 'namespace(\'' + n + '\').' + 'save',
        debug: 'namespace(\'' + n + '\').' + 'debug',
        recover: 'namespace(\'' + n + '\').' + 'recover'
    };
    exports.actions = actions;
}));
;
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', '../../core/model.js', './state.js', './view.js', './actions.js'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(exports, require('../core/model.js'), require('./state.js'), require('./view.js'), require('./actions.js'));
    } else {
        factory(
            root,
            namespace('beop.strategy.core.Model'),
            namespace('beop.strategy.components.Painter.Toolbar.State'),
            namespace('beop.strategy.components.Painter.Toolbar.View'),
            namespace('beop.strategy.components.Painter.Toolbar.actions')
        );
    }
}(namespace('beop.strategy.components.Painter.Toolbar'), function(exports, Model, State, View, actions) {

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

            this.model.subscribe(function(state) {
                state.render(_this.model.getStore());
            });
        };

        this.getInitialStore = function() {
            return {};
        };

        /**
         * @description 初始化 model
         */
        this.modelBLCProcessing = function(store, dataset) {

        };

        /**
         * @description 初始化 state
         */
        this.show = function() {
            // this.createState();
            this.model.getState().render(this.model.getStore());
        };

        this.close = function() {};

    }.call(Index.prototype);

    exports.Index = Index;
}));