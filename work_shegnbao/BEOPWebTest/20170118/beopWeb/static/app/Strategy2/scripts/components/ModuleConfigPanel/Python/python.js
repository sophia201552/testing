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
            namespace('beop.strategy.components.VariablePanel'),
            namespace('React'),
            namespace('ReactCodeMirror')
        );
    }
}(namespace('beop.strategy.components.ModuleConfigPanel'), function(exports, constants, VariablePanel, React, ReactCodeMirror) {

    var h = React.h;

    var actions = {
        dispatch: null,
    };

    var codeMirrorOptions = {
        lineNumbers: true,
        theme: 'monokai',
        extraKeys: {
            Tab: function(cm) {
                if (cm.getSelection().length) {
                    CodeMirror.commands.indentMore(cm);
                } else {
                    cm.replaceSelection("  ")
                }
            }
        },
        mode: 'python'
    };

    var theme = {
        codeMirror: function(code) {
            return h('div#codeMirrorBox', {
                style: {
                    minHeight: '100%',
                    background: '#2b3034',
                    overflow: 'auto',
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    right: '300px'
                }
            }, [
                h(ReactCodeMirror, {
                    onChange: this.handleCodeChange,
                    value: code,
                    options: codeMirrorOptions,
                    style: {
                        height: '100%'
                    },
                    className: 'gray-scrollbar'
                })
            ]);
        },
        variablePanel: function(module, moduleOutputs) {
            return h(VariablePanel, {
                input: module.option.input,
                output: module.option.output,
                moduleId: module._id,
                moduleOutputs: moduleOutputs,
                handleUpdate: this.props.handleUpdate
            });
        }
    };

    class Python extends React.Component {

        constructor(props, context) {
            super(props, context);

            actions.dispatch = actions.dispatch || context.dispatch;

            this.state = {
                code: props.module.option.content && props.module.option.content.code || ''
            };

            this.handleCodeChange = this.handleCodeChange.bind(this);
        }
        
        handleCodeChange(code) {
            this.setState({
                code: code
            });

            this.props.handleUpdate({
                code: code
            });
        }

        render() {
            return (
                h('div', {
                    style: {
                        'margin-top': '2px'
                    }
                }, [
                    theme.codeMirror.call(this, this.state.code),
                    h('#variablePanel', [
                        theme.variablePanel.call(this, this.props.module, this.props.moduleOutputs)
                    ])
                ])
            );
        }
    }

    exports.Python = Python;
}));