;(function (exports) {

    function TemplateEditorModal() {
        this.$modalWrap = null;

        this.callback = null;
    }

    +function () {
        
        // 显示组件
        this.show = function (data, callback) {
            var _this = this;
            var promise = $.Deferred();

            data = data || {};
            this.callback = callback;

            // 如果之前实例化过，直接 append 到页面上
            if (this.$modalWrap) {
                this.$modalWrap.appendTo(document.body);
                promise.resolve();
            } else {
                 // 如果没有实例化过，则进行实例化操作
                WebAPI.get('/static/app/WebFactory/scripts/screens/page/modals/templateEditorModal/templateEditorModal.html')
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
            this.$modal = $('#templateEditorModal', this.$modalWrap);
            this.$formResult = $('#formResult', this.$modal);
            // textareas
            this.$taVar = $('#idCodeVar', this.$modal);
            this.$taTemplate = $('#idCodeTemplate', this.$modal);
            this.$taJs = $('#idCodeJs', this.$modal);
            // 关闭按钮
            this.$btnClose = $('.close', this.$modal);
            // 运行代码按钮
            this.$btnRunCode = $('#btnRunCode', this.$modal);
            // 保存并退出按钮
            this.$btnSaveAndExit = $('#btnSaveAndExit', this.$modal);

            // 刷新模板变量按钮
            this.$btnVarRefresh = $('#btnVarRefresh', this.$modal);

            this.$modalWrap.appendTo('body');

            // 绑定 modal 事件
            this.attachEvents();
        };

        this.initEditor = function (data) {
            var options = {
                    lineNumbers: true,
                    extraKeys: {
                        Tab: function(cm) {
                            var spaces = Array(cm.getOption("indentUnit") + 1).join(" ");
                            cm.replaceSelection(spaces);
                        }
                    },
                    mode: 'application/json'
                },
                variables;

            // Editor 初始化
            // Variables
            if (!this.cmVar)  {
                this.cmVar = CodeMirror.fromTextArea(this.$taVar[0], options);
            }
            // 从模板的代码中提取出模板变量
            this.extractTemplateVariables(data.template);
            
            // Template
            if (!this.cmTemplate) {
                this.cmTemplate = CodeMirror.fromTextArea(this.$taTemplate[0], options);
            }
            if (data.template) { this.cmTemplate.doc.setValue(data.template); }

            // Code
            if (!this.cmJs) {
                this.cmJs = CodeMirror.fromTextArea(this.$taJs[0], $.extend(false, options, {
                    mode: 'text/javascript'
                }));
            }
            if (data.js) { this.cmJs.doc.setValue(data.js); }
        };

        /**
         * 从模板代码中提取模板变量，刷新模板变量代码区域
         * @param  {string} code 模板代码
         */
        this.extractTemplateVariables = function (code) {
            var pattern, match;
            var rs = {};
            var varCode, variables;

            if (!code) return false;

            pattern = /<#\s*(\w*?)\s*#>/img;
            varCode = this.cmVar.doc.getValue();
            variables = varCode ? JSON.parse(varCode) : {};

            // 查找符合 '<#...#>' 模式的字符串片段
            while (match = pattern.exec(code)) {
                // 模板变量的值合并，这样是为了防止用户自己填写的变量值被覆盖
                rs[match[1]] = variables[match[1]] || '';
            }

            // 将变量结果显示到指定代码区域
            this.cmVar.doc.setValue( JSON.stringify(rs) );

            return true;
        };

        // 绑定事件
        this.attachEvents = function () {
            var _this = this;

            // “关闭”按钮事件
            this.$btnClose.off('click').on('click', function () {
                _this.hide();
            });

            // “运行代码”按钮事件
            this.$btnRunCode.off('click').on('click', function () {
                // 代码预览
                _this.preview(_this.getCode());
            });

            // “保存和退出”按钮事件
            this.$btnSaveAndExit.off('click').on('click', function () {
                typeof _this.callback === 'function' && _this.callback(_this.getCode());
                _this.hide();
            });

            // 更新模板变量
            this.$btnVarRefresh.off('click').on('click', function () {
                _this.extractTemplateVariables(_this.getTemplateCode());
            });
        };

        this.preview = function (code) {
            // 表单赋值
            this.$taVar.val(code.variable);
            this.$taTemplate.val(code.template);
            this.$taJs.val(code.js);

            // this.$formResult[0].submit();
        };

        this.getCode = function () {
            return {
                variable: this.getVarCode(),
                js: this.getJsCode(),
                template: this.getTemplateCode()
            }
        };

        this.getVarCode = function () {
            if (this.cmVar) {
                return this.cmVar.doc.getValue();
            }
            return '';
        };

        this.getTemplateCode = function () {
            if (this.cmTemplate) {
                return this.cmTemplate.doc.getValue();
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
            if (this.cmVar) { this.cmVar.doc.setValue(''); }
            if (this.cmTemplate) { this.cmTemplate.doc.setValue(''); }
            if (this.cmJs) { this.cmJs.doc.setValue(''); }
        };

        // 隐藏组件
        this.hide = function () {
            if (this.$modalWrap) {
                this.reset();
                this.$modalWrap.detach();
            }
        };

    }.call(TemplateEditorModal.prototype);

    exports.TemplateEditorModal = new TemplateEditorModal();
} (window));