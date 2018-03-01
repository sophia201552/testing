;(function (exports) {

    var MODE_HTML = 'html';
    var MODE_CSS = 'css';
    var MODE_JS = 'js';

    function CodeEditorModal() {
        this.$modalWrap = null;

        this.modes = [];
        this.callback = null;
    }

    +function () {
        
        // 显示组件
        this.show = function (data, callback, modes) {
            var _this = this;
            var promise = $.Deferred();

            data = data || {};
            this.modes = modes || [MODE_HTML, MODE_CSS, MODE_JS];
            this.callback = callback;

            // 如果之前实例化过，直接 append 到页面上
            if (this.$modalWrap) {
                this.$modalWrap.appendTo(document.body);
                promise.resolve();
            } else {
                 // 如果没有实例化过，则进行实例化操作
                WebAPI.get('/static/app/WebFactory/scripts/modals/codeEditorModal/codeEditorModal.html')
                .done(function (html) {
                    _this.init(html);
                    promise.resolve();
                });
            }

            promise.done(function () {
                // 初始化编辑器
                _this.initEditor(data);
            });
        };

        // 组件初始化
        this.init = function (html) {
            var element = HTMLParser(html);
            
            this.$modalWrap = $(element);
            this.$modal = $('#codeEditorModal', this.$modalWrap);
            this.$formResult = $('#formResult', this.$modal);
            // textareas
            this.$taHtml = $('#idCodeHtml', this.$modal);
            this.$taCss = $('#idCodeCss', this.$modal);
            this.$taJs = $('#idCodeJs', this.$modal);
            // 关闭按钮
            this.$btnClose = $('.close', this.$modal);
            // 运行代码按钮
            this.$btnRunCode = $('#btnRunCode', this.$modal);
            // 保存并退出按钮
            this.$btnSaveAndExit = $('#btnSaveAndExit', this.$modal);

            this.$modalWrap.appendTo('body');
            I18n.fillArea(this.$modalWrap);

            // 绑定 modal 事件
            this.attachEvents();
        };

        this.initEditor = function (data) {
            var options = {
                lineNumbers: true,
                extraKeys: {
                    Tab: function(cm) {
                        if (cm.getSelection().length) {
                            CodeMirror.commands.indentMore(cm);
                        } else {
                            cm.replaceSelection("  ");
                        }
                    }
                }
            }

            // 初始化布局
            this.initLayout();

            // Editor 初始化
            // html
            if (this.modes.indexOf(MODE_HTML) > -1) {
                if (!this.cmHtml) {
                    this.cmHtml = CodeMirror.fromTextArea(this.$taHtml[0], $.extend(false, options, {
                        mode: 'text/html'
                    }));
                }
                if (data.html) { this.cmHtml.doc.setValue(data.html); }
            }

            // css
            if (this.modes.indexOf(MODE_CSS) > -1) {
                if (!this.cmCss) {
                    this.cmCss = CodeMirror.fromTextArea(this.$taCss[0], $.extend(false, options, {
                        mode: 'text/css'
                    }));
                }
                if (data.css) { this.cmCss.doc.setValue(data.css); }
            }

            // js
            if (this.modes.indexOf(MODE_JS) > -1) {
                if (!this.cmJs) {
                    this.cmJs = CodeMirror.fromTextArea(this.$taJs[0], $.extend(false, options, {
                        mode: 'text/javascript'
                    }));
                }
                if (data.js) { this.cmJs.doc.setValue(data.js); }
            }
        };

        // 初始化布局
        this.initLayout = function () {
            var cssArr = [];

            if (this.modes.indexOf(MODE_HTML) > -1) {
                cssArr.push('html');
            }
            if (this.modes.indexOf(MODE_CSS) > -1) {
                cssArr.push('css');
            }
            if (this.modes.indexOf(MODE_JS) > -1) {
                cssArr.push('js');
            }

            // 如果都有，则不做任何事情，因为默认就是这样
            this.$modal.removeClass();
            if (cssArr.length >= 3) {
                return;
            }

            this.$modal.addClass(cssArr.join('-') + '-only');
        };

        // 绑定事件
        this.attachEvents = function () {
            var _this = this;

            // 关闭按钮事件
            this.$btnClose.off('click').on('click', function () {
                _this.hide();
            });

            // 运行代码按钮事件
            this.$btnRunCode.off('click').on('click', function () {
                // 代码预览
                _this.preview(_this.getCode());
            });

            this.$btnSaveAndExit.off('click').on('click', function () {
                typeof _this.callback === 'function' && _this.callback(_this.getCode());
                _this.hide();
            });

        };

        this.preview = function (code) {
            // 表单赋值
            this.$taHtml.val(code.html);
            this.$taCss.val(code.css);
            this.$taJs.val(code.js);

            this.$formResult[0].submit();
        };

        this.getCode = function () {
            return {
                html: this.getHtmlCode(),
                css: this.getCssCode(),
                js: this.getJsCode()
            }
        };

        this.getHtmlCode = function () {
            if (this.cmHtml) {
                return this.cmHtml.doc.getValue();
            }
            return '';
        };

        this.getCssCode = function () {
            if (this.cmCss) {
                return this.cmCss.doc.getValue();
            }
            return '';
        };

        this.getJsCode = function () {
            if (this.cmJs) {
                return this.cmJs.doc.getValue();
            }
            return '';
        };

        // 组件状态还原
        this.reset = function () {
            // 重置回调函数
            this.callback = null;
            // 重置编辑器内容
            if (this.cmHtml) { this.cmHtml.doc.setValue(''); }
            if (this.cmCss) { this.cmCss.doc.setValue(''); }
            if (this.cmJs) { this.cmJs.doc.setValue(''); }
        };

        // 隐藏组件
        this.hide = function () {
            if (this.$modalWrap) {
                this.reset();
                this.$modalWrap.detach();
            }
        };

    }.call(CodeEditorModal.prototype);

    exports.CodeEditorModal = new CodeEditorModal();
} (window))