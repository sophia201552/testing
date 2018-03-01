;
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', 'React'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(exports, require('React'));
    } else {
        factory(
            root,
            namespace('React'),
            namespace('antd'),
            namespace('beop.strategy.enumerators')
        );
    }
}(namespace('beop.strategy.components'), function(exports, React, antd, enumerators) {

    var h = React.h;
    var linkEvent = React.linkEvent;

    var { Tooltip } = antd;

    var action = {
        dragStart: function(e) {
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
        createBtn: function(type, icon, name,disabled) {
            if(disabled){
                return (
                    h('button.btn.btn-default', {
                        'data-type': type,
                        disabled: true
                    }, [
                        h('span', {
                            className: 'iconfont ' + icon
                        }),
                        h('span.btnText', [name])
                    ])
                )
            }else{
                return (
                    h(Tooltip, {
                        title: name
                    }, [
                        h('button.btn.btn-default', {
                            'data-type': type,
                            draggable: 'true',
                            onDragStart: action.dragStart,
                        }, [
                            h('span', {
                                className: 'iconfont ' + icon
                            }),
                            h('span.btnText', [name])
                        ])
                    ])
                )
            }
            
        },
        createLi: function(type, icon, name) {
            return (
                h('li', {
                    role: "presentation"
                }, [
                    h('a', {
                        role: "menuitem",
                        tabIndex: "-1",
                        'data-type': type,
                        draggable: 'true'
                    }, [
                        h('span', {
                            className: 'iconfont ' + icon
                        }),
                        name
                    ])
                ])
            )
        }
    };

    function SketchpadToolbar(props, context) {
        return (
            h('#toolBarWrap', {
                style: {
                    width: '100%',
                    height: '65px',
                    zIndex: 11,
                    overflow: 'hidden'
                }
            }, [
                h('div.btnGroup', {}, [
                    h('div.basicBtnGroup.fl', {}, [
                        //基本
                        theme.createBtn(enumerators.moduleTypes.PYTHON, 'icon-daima', enumerators.moduleTypeNames[enumerators.moduleTypes.PYTHON]),
                        theme.createBtn(enumerators.moduleTypes.REMOTE_API, 'icon-API offset', enumerators.moduleTypeNames[enumerators.moduleTypes.REMOTE_API],true),
                        theme.createBtn(enumerators.moduleTypes.KPI, 'icon-KPI offset', enumerators.moduleTypeNames[enumerators.moduleTypes.KPI],true),
                        theme.createBtn(enumerators.moduleTypes.RULE, 'icon-guize offset',enumerators.moduleTypeNames[enumerators.moduleTypes.RULE],true)
                    ]),
                    h('div.algorithmBtnGroup.fl', {}, [
                        //算法
                        theme.createBtn(enumerators.moduleTypes.DIAGNOSIS, 'icon-zhenduan1 offset', enumerators.moduleTypeNames[enumerators.moduleTypes.DIAGNOSIS],true),
                        theme.createBtn(enumerators.moduleTypes.FOURIER_ANALYSIS, 'icon-fuliyefenxi offset', enumerators.moduleTypeNames[enumerators.moduleTypes.FOURIER_ANALYSIS],true),
                        theme.createBtn(enumerators.moduleTypes.WAVELET_ANALYSIS, 'icon-xiaobofenxi', enumerators.moduleTypeNames[enumerators.moduleTypes.WAVELET_ANALYSIS],true),
                        theme.createBtn(enumerators.moduleTypes.FITTED_CURVE, 'icon-nihequxian ', enumerators.moduleTypeNames[enumerators.moduleTypes.FITTED_CURVE],true),
                        theme.createBtn(enumerators.moduleTypes.FLYBACK, 'icon-huigui offset', enumerators.moduleTypeNames[enumerators.moduleTypes.FLYBACK],true),
                        theme.createBtn(enumerators.moduleTypes.CORRELATION_ANALYSIS, 'icon-shujufenxi offset', enumerators.moduleTypeNames[enumerators.moduleTypes.CORRELATION_ANALYSIS]),
                        theme.createBtn(enumerators.moduleTypes.FORECAST, 'icon-yuce offset', enumerators.moduleTypeNames[enumerators.moduleTypes.FORECAST]),
                        theme.createBtn(enumerators.moduleTypes.FUZZY_RULE, 'icon-mohuguize', enumerators.moduleTypeNames[enumerators.moduleTypes.FUZZY_RULE])
                    ]),
                    h('div.showBtnGroup.fl', {}, [
                        //展示
                        theme.createBtn(enumerators.moduleTypes.HISTORICAL_CURVE, 'icon-lishiquxian', enumerators.moduleTypeNames[enumerators.moduleTypes.HISTORICAL_CURVE]),
                        theme.createBtn(enumerators.moduleTypes.TABLE, 'icon-wanggexian offset', enumerators.moduleTypeNames[enumerators.moduleTypes.TABLE]),
                        theme.createBtn(enumerators.moduleTypes.THREE_DIMENSIONS_VIEW, 'icon-xiangmusucai offset', enumerators.moduleTypeNames[enumerators.moduleTypes.THREE_DIMENSIONS_VIEW])
                    ]),
                ])
            ])
        );
    }

    exports.SketchpadToolbar = SketchpadToolbar;
}));