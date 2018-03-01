;(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', 'React', 'classNames', 'CodeMirror'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(exports, require('React'), require('classNames'), require('CodeMirror'));
    } else {
        factory(
            root,
            root.React,
            root.classNames,
            root.CodeMirror
        );
    }
}(window, function (exports, React, classNames, CodeMirror) {

    var h = React.h;

    function normalizeLineEndings (str) {
        if (!str) return str;
        return str.replace(/\r\n|\r/g, '\n');
    }

    class ReactCodeMirror extends React.Component {

        constructor(props) {
            super(props);

            this.state = {
                isFocused: false,
                preserveScrollPosition: false
            };
        }

        getCodeMirrorInstance () {
            return this.props.codeMirrorInstance || CodeMirror;
        }
        refDefine(name) {
            var refs = this.refs = this.refs || {};

            return function (dom) {
                refs[name] = dom;
            };
        }
        componentDidMount () {
            var textareaNode = this.refs.textarea;
            var codeMirrorInstance = this.getCodeMirrorInstance();

            this.codeMirror = codeMirrorInstance.fromTextArea(textareaNode, this.props.options);
            this.codeMirror.on('change', this.codemirrorValueChanged.bind(this) );
            this.codeMirror.on('focus', this.focusChanged.bind(this, true) );
            this.codeMirror.on('blur', this.focusChanged.bind(this, false) );
            this.codeMirror.on('scroll', this.scrollChanged.bind(this) );
            this.codeMirror.setValue(this.props.value || '');
        }
        componentWillUnmount () {
            // destroy
            if (this.codeMirror) {
                this.codeMirror.toTextArea();
            }
        }
        componentWillReceiveProps (nextProps) {
            if (this.codeMirror && nextProps.value !== undefined && normalizeLineEndings(this.codeMirror.getValue()) !== normalizeLineEndings(nextProps.value)) {
                if (this.props.preserveScrollPosition) {
                    var prevScrollPosition = this.codeMirror.getScrollInfo();
                    this.codeMirror.setValue(nextProps.value);
                    this.codeMirror.scrollTo(prevScrollPosition.left, prevScrollPosition.top);
                } else {
                    this.codeMirror.setValue(nextProps.value);
                }
            }
            if (nextProps.options !== this.props.options && typeof nextProps.options === 'object') {
                for (let optionName in nextProps.options) {
                    if (nextProps.options.hasOwnProperty(optionName)) {
                        this.codeMirror.setOption(optionName, nextProps.options[optionName]);
                    }
                }
            }
        }
        getCodeMirror () {
            return this.codeMirror;
        }
        focus () {
            if (this.codeMirror) {
                this.codeMirror.focus();
            }
        }
        focusChanged (focused) {
            this.setState({
                isFocused: focused,
            });
            this.props.onFocusChange && this.props.onFocusChange(focused);
        }
        scrollChanged (cm) {
            this.props.onScroll && this.props.onScroll(cm.getScrollInfo());
        }
        codemirrorValueChanged (doc, change) {
            if (this.props.onChange && change.origin !== 'setValue') {
                this.props.onChange(doc.getValue(), change);
            }
        }
        render () {
            return (
                h('div', {
                    className: classNames(
                        'React-codemirror',
                        { 'React-codemirror-focused': this.state.isFocused },
                        this.props.className
                    ),
                    style: this.props.style
                }, [
                    h('textarea', {
                        ref: this.refDefine('textarea'),
                        value: this.props.value,
                        autoComplete: 'off'
                    })
                ])
            );
        }
    }

    exports.ReactCodeMirror = ReactCodeMirror;
    
}));