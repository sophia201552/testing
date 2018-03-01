;
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', 'React'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(exports, require('React'));
    } else {
        factory(
            root,
            namespace('beop.strategy.core.constants'),
            namespace('React'),
            namespace('beop.strategy.components.Painter.BatchConfigModal')
        );
    }
}(namespace('beop.strategy.components.Painter'), function(exports, constants, React, BatchConfigModal) {

    var h = React.h;
    var linkEvent = React.linkEvent;

    var actions = {
        dispatch: null,
        dragstart: function(e) {
            var $this = $(e.target);
            var offset = $this.offset();
            var type = $this.data('type');
            var info = {
                x: e.clientX - offset.left,
                y: e.clientY - offset.top,
                w: $this.width(),
                h: $this.height(),
                type: type
            };
            e.dataTransfer.setData("info", JSON.stringify(info));
        }
    };

    var theme = {
        createBtn: function(type, icon, name) {
            return (
                h('button.btn.btn-default', {
                    'data-type': type,
                    draggable: 'true',
                    onDragStart: actions.dragstart
                }, [
                    h('span', {
                        className: 'iconfont ' + icon
                    }),
                    h('span.btnText', {
                        style: {
                            display: 'block'
                        }
                    }, [name])
                ])
            )
        },
        createLi: function(type, icon, name) {
            return (
                h('li', {
                    role: "presentation"
                }, [
                    h('a', {
                        role: "menuitem",
                        tabindex: "-1",
                        'data-type': type,
                        draggable: 'true',
                        onDragStart: actions.dragstart
                    }, [
                        h('span', {
                            className: 'iconfont ' + icon
                        }),
                        name
                    ])
                ])
            )
        },
        Select: function(type, children) {
            return (
                h('div.dropdown', [
                    h('button#dLabel', {
                        className: "btn btn-default fl",
                        type: "button",
                        'data-toggle': "dropdown",
                        'aria-haspopup': 'true',
                        'aria-expanded': "false"
                    }, [
                        type,
                        h('span.caret')
                    ]),
                    h('ul', {
                        className: 'dropdown-menu',
                        role: "menu",
                        'aria-labelledby': "dLabel"
                    }, children)
                ])
            )
        }
    };

    function Toolbar(props, context) {
        actions.dispatch = context.dispatch;
        return (
            h('#toolBarWrap', {
                style: {
                    width: '100%',
                    height: '74px',
                    zIndex: 11
                }
            }, [
                h('div.btnGroup', {}, [
                    h('div.basicBtnGroup.fl', {}, [
                        //基本
                        theme.createBtn('py', 'icon-daima', 'Python'),
                        theme.createBtn('API', 'icon-API offset', '远程API'),
                        theme.createBtn('KPI', 'icon-KPI offset', 'KPI'),
                        theme.createBtn('rule', 'icon-guize offset', '规则'),
                        theme.Select('基本', [
                            theme.createLi('py', 'icon-daima', 'Python'),
                            theme.createLi('API', 'icon-API offset', '远程API'),
                            theme.createLi('KPI', 'icon-KPI offset', 'KPI'),
                            theme.createLi('rule', 'icon-guize offset', '规则')
                        ])
                    ]),
                    h('div.algorithmBtnGroup.fl', {}, [
                        //算法
                        theme.createBtn('diagnose', 'icon-zhenduan1 offset', '诊断'),
                        theme.createBtn('Fa', 'icon-fuliyefenxi offset', '傅里叶分析'),
                        theme.createBtn('Wa', 'icon-xiaobofenxi', '小波分析'),
                        theme.createBtn('Fc', 'icon-nihequxian ', '拟合曲线'),
                        theme.createBtn('return', 'icon-huigui offset', '回归'),
                        theme.createBtn('forecast', 'icon-yuce offset', '预测'),
                        theme.createBtn('fr', 'icon-mohuguize', '模糊规则'),
                        theme.Select('计算', [
                            theme.createLi('diagnose', 'icon-zhenduan1 offset', '诊断'),
                            theme.createLi('Fa', 'icon-fuliyefenxi offset', '傅里叶分析'),
                            theme.createLi('Wa', 'icon-xiaobofenxi', '小波分析'),
                            theme.createLi('Fc', 'icon-nihequxian ', '拟合曲线'),
                            theme.createLi('return', 'icon-huigui offset', '回归'),
                            theme.createLi('forecast', 'icon-yuce offset', '预测'),
                            theme.createLi('fr', 'icon-mohuguize', '模糊规则')
                        ])
                    ]),
                    h('div.showBtnGroup.fl', {}, [
                        //展示
                        theme.createBtn('Hc', 'icon-lishiquxian', '历史曲线'),
                        theme.Select('展示', [
                            theme.createLi('Hc', 'icon-lishiquxian', '历史曲线')
                        ])
                    ])
                ])
            ])
        );
    }

    exports.Toolbar = Toolbar;
}));