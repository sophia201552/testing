;
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([
            'exports',
            '../core/model.js',
            '../../VariablePanel/variablePanel.js',
            'Inferno'
        ], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(
            exports,
            require('../core/model.js'),
            require('../../VariablePanel/index.js'),
            require('Inferno')
        );
    } else {
        factory(
            root,
            namespace('beop.strategy.core.Model'),
            namespace('beop.strategy.components.VariablePanel.Index'),
            namespace('Inferno')
        );
    }
}(namespace('beop.strategy.components.ModuleConfigPanel.Python'), function(
    exports,
    Model,
    VariablePanel,
    Inferno
) {

    var h = Inferno.h;

    function Index(container, options) {
        if (typeof container === 'string') {
            this.container = document.querySelector(container);
        } else {
            this.container = container;
        }

        this.options = options || {};
        this.store = this.options.store || {};

        this.init();
    }

    var model, state, view, theme, codeEditor;
    // child components
    var child;
    // PROTOTYPES
    +function() {
        /**
         * Constructor
         */
        this.constructor = Index;

        /**
         * initialize app
         */
        this.init = function() {
            view.container = this.container;
            model = new Model(this.modelBLCProcessing.bind(this), state, this.getInitialStore(), state.nap);

            model.subscribe(function (state) {
                state.render(model.getStore());
            });
        };

        this.getInitialStore = function () {
            var _this = this;

            return {
                data: this.store
            };
        };

        this.getData = function () {
            var data = model.getStore().data;
            var childData;

            data.option.content.code = codeEditor.cmPy.getValue();
            if (child) {
                childData = child.getData();
                data.option.input = childData.input;
                data.option.output = childData.output;
            }

            return data;
        };

        this.modelBLCProcessing = function (store, dataset) {
            return store;
        };

        this.show = function() {
            model.updateState();
        };

        this.close = function() {
            codeEditor.cmPy = null;
            child && child.close();
            child = null;
        };

    }.call(Index.prototype);

    // state
    (function () {
        state = {
            bindModel: function () {
                return this;
            },
            nap: function () {
                return function () {
                    if (!child) {
                        var data = model.getStore().data;
                        child = new VariablePanel(view.domVariablePanel, {
                            store: {
                                input: data.option.input,
                                output: data.option.output,
                                moduleId: data._id
                            }
                        });
                    }
                    child && child.show();
                };
            },
            ready: function () {
                return true;
            },
            representation: function (model) {
                var representation = '';
                if (this.ready()) {
                    representation = view.ready(model)
                }
                view.display(representation);
            },
            render: function (model) {
                this.representation(model);
            }
        };

    }());

    // view
    (function () {
        view = {
            container: null,
            domVariablePanel: null,
            domConfigContent: null,
            refDefine: function (name) {
                var _this = this;
                return function (dom) {
                    _this[name] = dom;
                };
            },
            ready: function (model) {
                var content = model.data.option.content;
                return (
                    h('div', {
                        style:{
                            'margin-top': '2px'
                        }
                    },[
                        h('#configContent', {ref: this.refDefine('domConfigContent')}, [theme.form( content && content.code || '')]),
                        h('#variablePanel', {ref: this.refDefine('domVariablePanel')})
                    ])
                );
            },
            display: function (representation) {
                Inferno.render(representation, this.container);
                codeEditor.init();
            }
        };

        theme = {
            form: function (code) {
                return (
                    h('.col-md-12#codeMirrorBox', [
                        h('textarea#codeEditor.form-control.dn.col-md-8', {
                            style: {
                                display: 'none'
                            }
                        }, code)
                    ])
                );
            }
        };
        codeEditor = {
            cmPy: null,
            init:function(container, data){
                var options;

                data = data || '';
                //python
                if (!this.cmPy) {
                    options = {
                        lineNumbers: true,
                        theme:'monokai',
                        extraKeys: {
                            Tab: function(cm) {
                                if (cm.getSelection().length) {
                                    CodeMirror.commands.indentMore(cm);
                                } else {
                                    cm.replaceSelection("  ");
                                }
                            }
                        }
                    };
                    this.cmPy = CodeMirror.fromTextArea(
                        document.getElementById('codeEditor'), $.extend(false, options, {mode: 'python'}
                    ));
                }
            }
        };

    }());

    // actions
    (function () {
        actions = {
            
        };
    }());

    exports.Index = Index;
}));