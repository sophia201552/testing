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
            namespace('beop.strategy.components.ModuleConfigPanel.Python'),
            namespace('React')
        );
    }
}(namespace('beop.strategy.components.ModuleConfigPanel'), function(exports, constants, Python, React) {

    var h = React.h;
    var linkEvent = React.linkEvent;
    var deepClone = $.extend.bind($, true);
    
    var actions = {
        dispatch: null,
        clickQuit: function()　 {
            actions.dispatch({
                type: constants.painter.CLOSR_CONFIG_PANEL,
                value: null
            });
        },

        clickSaveQuit: function(module) {
            actions.dispatch({
                type: constants.painter.CONFIG_PANEL_SAVE_AND_CLOSE,
                module: module
            });
            actions.clickQuit();
        }
    };
    var theme = {
        toolbar: function(title) {
            return (
                h('.toolBar', {
                    style: {
                        height: '50px',
                        position: 'relative',
                        lineHeight: '50px',
                        background: '#34393c',
                        color: '#cadee5'
                    }
                }, [
                    h('.title', {
                        style: {
                            width: '300px',
                            float: 'left',
                            fontSize: '20px',
                            marginLeft: '15px',
                        }
                    }, title),
                    h('.btns', {
                        style: {
                            position: 'absolute',
                            right: '15px'
                        }
                    }, [
                        h('button.btn.btn-default', {
                            style: {
                                marginLeft: '15px',
                                color: '#cadee5',
                                outline: 'none',
                                borderRadius: '17px',
                                borderColor: '#4b5252'
                            },
                            onClick: linkEvent(this.state.module, actions.clickSaveQuit)
                        }, '确定'),
                        h('button.btn.btn-default', {
                            style: {
                                marginLeft: '15px',
                                color: '#cadee5',
                                outline: 'none',
                                borderRadius: '17px',
                                borderColor: '#4b5252'
                            },
                            onClick: actions.clickQuit
                        }, '取消')
                    ])
                ])
            );
        },
        createChild: function(module, moduleOutputs) {
            switch (module.type) {
                case 0: // Python
                default:
                    return h(Python, {
                        module: module,
                        moduleOutputs: moduleOutputs,
                        handleUpdate: this.handleUpdate
                    });
            }
        }
    };

    class ModuleConfigPanel extends React.Component {

        constructor(props, context) {
            super(props, context);

            actions.dispatch = actions.dispatch || context.dispatch;

            this.state = {
                module: deepClone({}, this.props.configModule),
                moduleOutputs: deepClone([], this.props.moduleOutputs)
            };

            this.handleUpdate = this.handleUpdate.bind(this);
        }

        handleUpdate(data) {
            var module = deepClone({}, this.state.module);

            if (data.code) {
                module.option.content = {
                    code: data.code
                };
            }
            if (data.input) {
                module.option.input = data.input;
            }
            if (data.output) {
                module.option.output = data.output;
            }

            this.setState({
                module: module
            });
        }

        componentWillUpdate() {
            return false;
        }

        render() {
            var title = (function(type) {
                switch (type) {
                    case 0:
                        return 'Python ';
                    default:
                        return '';
                }
            }(this.state.module.type)) + '模块编辑';

            return (
                h('div', { 'className': 'pyVariable', style: { height: '100%', background: '#2b3034' } }, [
                    theme.toolbar.call(this, title),
                    h('#configPanelContent', [
                        theme.createChild.call(this, this.state.module, this.state.moduleOutputs)
                    ])
                ])
            );
        }
    }

    exports.Index = ModuleConfigPanel;
}));