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
            namespace('React')
        );
    }
}(namespace('beop.strategy.components.Painter'), function(exports, constants, React) {

    var h = React.h;
    var linkEvent = React.linkEvent;

    var actions = {
        dispatch: null,
        debug: function(id) {

        },
        closeModal: function() {
            actions.dispatch({
                type: constants.modal.HIDE_MODAL,
                modalType: null,
                props: {}
            });
        }
    };

    var theme = {
        height: undefined,
        left: function(data) {
            var _this = this;
            return h('div', {
                style: {
                    width: '50%',
                    float: 'left',
                    paddingRight: '10px'
                }
            }, theme.createItem(data));
        },
        right: function(data) {
            var _this = this;
            return h('div', {
                style: {
                    float: 'left',
                    width: '50%',
                    paddingLeft: '10px'
                }
            }, [h('textarea', {
                style: {
                    height: theme.height + 'px',
                    width: '100%',
                    margin:"5px auto"
                }
            })]);
        },
        createItem: function(data) {
            var result = [];
            if (data && data.length) {
                data.forEach(function(v) {
                    for (k in v) {
                        result.push(h('div', {
                            style: {
                                height: '50px',
                                width: '100%',
                                padding:'5px'
                            }
                        }, [h('label', {
                            style: {
                                height: '30px',
                                lineHeight: '30px',
                                width: '40%',
                                overFlow: 'hidden',
                                float: 'left'
                            }
                        }, [k]), h('input', {
                            style: {
                                width: '60%',
                                lineHeight: '30px',
                                float: 'left'
                            },
                            value: v[k],
                            readOnly: true
                        })]));
                    }
                });
            }
            theme.height = (result.length + 1) * 40;
            return result;
        }
    };

    class DebugModal extends React.Component {
        constructor(props, context) {
            super(props, context);

            actions.dispatch = this.context.dispatch;
        }


        render() {
            return (
                h('div', {
                    className: "modal",
                    style: {
                        width: '60%',
                        marginTop: '60px',
                        marginLeft: '20%'
                    },
                    id: "debugModal"
                }, [

                    h('div.modal-content', {}, [
                        h('div.modal-header', {}, [
                            h('button', {
                                className: "close",
                                onClick: actions.closeModal
                            }, [
                                h('span', ["×"])
                            ]),
                            h('h4.modal-title', [
                                "调试"
                            ])
                        ]),
                        h('div.modal-body', {
                            className:"gray-scrollbar",
                            style:{
                                'max-height':'350px',
                                overflow:"auto"
                            }
                        }, [
                            theme.left(this.props.strategy.value),
                            theme.right(),
                            h('div', {
                                style: {
                                    clear: 'both'
                                }
                            })
                        ]),
                        h('div.modal-footer', {}, [
                            h('button', {
                                className: "btn btn-default defHover",
                                onClick: actions.closeModal
                            }, ["关闭"]),
                            h('button', {
                                className: "btn btn-primary defHover",
                                onClick: actions.debug
                            }, ["调试"])
                        ])
                    ])

                ])
            );
        }
    }

    exports.DebugModal = DebugModal;
}));