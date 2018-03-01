;(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([
            'exports',
            'React'
        ], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(
            exports,
            require('React'),
            require('ReactCodeMirror'),
            require('CodeMirror')
        );
    } else {
        factory(
            root,
            namespace('React'),
            namespace('antd'),
            namespace('ReactCodeMirror'),
            namespace('CodeMirror')
        );
    }
}(namespace('beop.common.components'), function(
    exports,
    React,
    antd,
    ReactCodeMirror,
    CodeMirror
) {
    var h = React.h;

    const codeMirrorOptions = {
        lineNumbers: true,
        extraKeys: {
            Tab: function(cm) {
                if (cm.getSelection().length) {
                    CodeMirror.commands.indentMore(cm);
                } else {
                    cm.replaceSelection("    ")
                }
            }
        },
        theme:"blackboard",
        mode: 'python'
    };
    class CodeEditor extends React.Component {
        constructor(props) {
            super(props);

            this.state = {
                code: this.props.value || ''
            };

            this.handleChange = this.handleChange.bind(this);
        }

        handleChange(value) {
            const onChange = this.props.onChange;

            if (!('value' in this.props)) {
                this.setState({
                    code: value
                });
            }

            if (onChange) {
                onChange( value );
            }
        }

        componentWillReceiveProps(nextProps) {
            if ('value' in nextProps) {
                this.setState({
                    code: nextProps.value
                });
            }
        }

        render() {
            return (
                h('div#codeMirrorBox', {
                    style: {
                        height: (this.props.style && this.props.style.height) || '100%'
                    }
                }, [
                    h(ReactCodeMirror, {
                        value: this.state.code,
                        options: codeMirrorOptions,
                        onChange: this.handleChange,
                        style: {
                            height: '100%'
                        }
                    })
                ])
            );
        }
    }

    exports.CodeEditor = CodeEditor;
}));