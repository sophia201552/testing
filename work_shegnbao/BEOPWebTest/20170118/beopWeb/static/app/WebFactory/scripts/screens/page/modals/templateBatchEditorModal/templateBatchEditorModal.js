;(function (exports) {

    function TemplateBatchEditorModal() {
        this.$modalWrap = null;

        this.callback = null;
    }

    +function () {
        
        // 显示组件
        this.show = function (data, callback) {
            var _this = this;
            var promise = $.Deferred();

            // 参数格式化
            data = data || {};
            this.callback = callback;

            // 如果之前实例化过，直接 append 到页面上
            if (this.$modalWrap) {
                this.$modalWrap.appendTo(document.body);
                promise.resolve();
            } else {
                 // 如果没有实例化过，则进行实例化操作
                WebAPI.get('/static/app/WebFactory/scripts/screens/page/modals/templateBatchEditorModal/templateBatchEditorModal.html')
                .done(function (html) {
                    _this.init(html);
                    promise.resolve();
                    I18n.fillArea($('#templateBatchEditorModal'));
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
            this.$modal = $('#templateBatchEditorModal', this.$modalWrap);
            this.$formResult = $('#formResult', this.$modal);
            // textareas
            this.$taDs = $('#idCodeDs', this.$modal);
            this.$taTemplate = $('#idCodeTemplate', this.$modal);
            // 关闭按钮
            this.$btnClose = $('.close', this.$modal);
            // 运行代码按钮
            this.$btnRunCode = $('#btnRunCode', this.$modal);
            // 保存并退出按钮
            this.$btnSaveAndExit = $('#btnSaveAndExit', this.$modal);

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
                }
            }
            // Editor 初始化
            // DataSource
            if (!this.cmDs) {
                this.cmDs = CodeMirror.fromTextArea(this.$taDs[0], $.extend(false, options, {
                    mode: 'application/json'
                }));
            }
            if (data.ds) { this.cmDs.doc.setValue(data.ds); }

            // Template
            if (!this.cmTemplate) {
                this.cmTemplate = CodeMirror.fromTextArea(this.$taTemplate[0], $.extend(false, options, {
                    mode: 'application/json'
                }));
            }
            if (data.template) { this.cmTemplate.doc.setValue(data.template); }
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
            this.$taDataSource.val(code.ds);
            this.$taTemplate.val(code.template);
            this.$taJs.val(code.js);

            // this.$formResult[0].submit();
        };

        this.getCode = function () {
            return {
                ds: this.getDsCode(),
                template: this.getTemplateCode()
            }
        };

        this.getDsCode = function () {
            if (this.cmDs) {
                return this.cmDs.doc.getValue();
            }
            return '';
        };

        this.getTemplateCode = function () {
            if (this.cmTemplate) {
                return this.cmTemplate.doc.getValue();
            }
            return '';
        };

        // 组件状态还原
        this.reset = function () {
            // 重置回调函数
            this.callback = null;
            // 重置编辑器内容
            if (this.cmDs) { this.cmDs.doc.setValue(''); }
            if (this.cmTemplate) { this.cmTemplate.doc.setValue(''); }
        };

        // 隐藏组件
        this.hide = function () {
            if (this.$modalWrap) {
                this.reset();
                this.$modalWrap.detach();
            }
        };

    }.call(TemplateBatchEditorModal.prototype);

    exports.TemplateBatchEditorModal = new TemplateBatchEditorModal();
} (window));