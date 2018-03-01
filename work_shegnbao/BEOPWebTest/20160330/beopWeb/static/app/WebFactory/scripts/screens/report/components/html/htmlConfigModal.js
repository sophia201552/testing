/*--------------------------------
 * ModalHtml 图元配置类定义
 --------------------------------*/
(function(exports) {
    var _this;

    // 存储当前页面所有可链接的menu的html
    var gMenusHtml;

    function HtmlConfigModal(options) {
        _this = this;

        ModalConfig.call(this, options);

        this.cmHtml = null;
    }

    HtmlConfigModal.prototype = Object.create(ModalConfig.prototype);
    HtmlConfigModal.prototype.constructor = HtmlConfigModal;

    HtmlConfigModal.prototype.DEFAULTS = {
        htmlUrl: '/static/app/WebFactory/scripts/screens/report/components/html/HtmlConfigModal.html'
    };

    // @override
    HtmlConfigModal.prototype.init = function() {
        this.$modal          = $('.modal', this.$wrap);
        this.$modalCt        = $('.modal-content', this.$wrap);
        this.$formWrap       = $('.form-wrap', this.$wrap);
        this.$textarea       = $('.form-textarea', this.$formWrap);
        this.$btnSubmit      = $('.btn-submit', this.$wrap);
        
        this.$btnResizeFull  = $('.btn-resize-full', this.$wrap);
        this.$btnResizeSmall = $('.btn-resize-small', this.$wrap);

        // this.initEditor();
        this.attachEvents();
    };

    HtmlConfigModal.prototype.initEditor = function (data) {
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
        // Editor 初始化
        if (!this.cmHtml) {
            this.cmHtml = CodeMirror.fromTextArea(this.$textarea[0], $.extend(false, options, {
                mode: 'text/html'
            }));
        }
    };

    // @override
    HtmlConfigModal.prototype.recoverForm = function(form) {
        var options;
        if(!form || !form.option) {
            return;
        }
        options = form.option;

        // 设置 html 文本
        // if (this.cmHtml) {
        //     this.cmHtml.doc.setValue(options.html);
        // }
        this._setField('textarea', this.$textarea, options.html);
    };

    // @override
    HtmlConfigModal.prototype.reset = function () {
        // if (this.cmHtml) {
        //     this.cmHtml.doc.setValue('');
        // }
        this._setField('textarea', this.$textarea);
    };

    HtmlConfigModal.prototype.attachEvents = function () {
        var _this = this;

        ///////////////////
        // resize EVENTS //
        ///////////////////
        this.$btnResizeFull.off().click(function() {
            var height = _this.$modal.height();
            _this.$modal.addClass('maxium-screen');
            _this.$textarea.height(height-168);
        });

        this.$btnResizeSmall.off().click(function() {
            _this.$modal.removeClass('maxium-screen');
            _this.$textarea.height('auto');
        });

        ///////////////////
        // submit EVENTS //
        ///////////////////
        this.$btnSubmit.off().click( function(e) {
            var modalIns = _this.options.modalIns;
            var modal = modalIns.entity.modal;
            var form = {};
            var html;
            var pattern, match;

            html = form.html = _this.$textarea.val();

            // 初始化 points
            modal.points = [];

            // 以上是老版本的数据源提取逻辑，下面是新版本的数据源提取逻辑
            // 为 <%数据源id%> 的形式添加数据源提取逻辑
            pattern = new RegExp('<%([^,<>%]+).*?%>', 'mg');
            while ( (match = pattern.exec(html)) !== null ) {
                if (modal.points.indexOf(match[1]) === -1) {
                    modal.points.push(match[1]);
                }
            }

            // save to modal
            modal.option = form;
            modal.dsChartCog = [{accuracy: 2}];
            modal.interval = 60000;

            // close modal
            _this.$modal.modal('hide');
            // render the modal
            modalIns.render();
            e.preventDefault();
        } );

        this.$textarea[0].addEventListener("dragover", function(event) {
            event.preventDefault();
        });
        this.$textarea[0].addEventListener("drop", function(event) {
            event.preventDefault();
            var text = '<%' + EventAdapter.getData().dsItemId + '%>';
            insertText(event.target, text);
            _this.$wrap.find('.drop-area[data-value=""]').trigger('drop', true);
        });

        //在光标位置插入拖入的数据源
        function insertText(obj,str) {
            if (typeof obj.selectionStart === 'number' && typeof obj.selectionEnd === 'number') {
                var startPos = obj.selectionStart,
                    endPos = obj.selectionEnd,
                    cursorPos = startPos,
                    tmpStr = obj.value;
                obj.value = tmpStr.substring(0, startPos) + str + tmpStr.substring(endPos, tmpStr.length);
                cursorPos += str.length;
                obj.selectionStart = obj.selectionEnd = cursorPos;
            } else {
                obj.value += str;
            }
        }

    };

    exports.HtmlConfigModal = new HtmlConfigModal();
} ( namespace('factory.report.components') ));