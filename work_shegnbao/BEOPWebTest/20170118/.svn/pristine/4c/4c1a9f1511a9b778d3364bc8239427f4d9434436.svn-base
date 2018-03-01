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