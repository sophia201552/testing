;(function (exports, SuperClass) {

    function Modal() {
        SuperClass.apply(this, arguments);
    }

    Modal.prototype = Object.create(SuperClass.prototype);

    +function () {
        this.DEFAULTS = {
            htmlUrl: '/static/app/WebFactory/scripts/screens/report/components/chapterContainer/chapterContainerConfigModal.html'
        };

        this.init = function () {
            this.$modal           = $('.modal', this.$wrap);
            this.$form            = $('#formModal', this.$wrap);
            this.$iptChapterTitle = $('#iptChapterTitle', this.$wrap);
            this.$btnChapterSummary = $('#btnChapterSummary', this.$wrap);
            this.$btnChapterDisplay = $('#btnChapterDisplay', this.$wrap);
            // drop area
            this.$btnSubmit       = $('#btnSubmit', this.$wrap);
            I18n.fillArea(this.$modal);
            this.attachEvents();
        };

        // @override
        this.recoverForm = function(options) {
            var _this = this;
            var form = options.option;
            if (!form) return;

            this._setField('input', this.$iptChapterTitle, form.chapterTitle);
        };

        // @override
        this.reset = function () {
            var _this = this;
            this._setField('input', this.$iptChapterTitle);
        };

        this.attachEvents = function () {
            var _this = this;

            // 确认按钮点击事件
            this.$btnSubmit.off().click(function (e) {
                var modalIns = _this.options.modalIns;
                var modal = modalIns.entity.modal;
                var form = {};

                form.chapterTitle = this.$iptChapterTitle.val();
                modal.option = $.extend(false, modal.option, form);

                _this.$modal.modal('hide');
                modalIns.refreshTitle();

                e.preventDefault();
            }.bind(this));

            // 汇总按钮点击事件
            this.$btnChapterSummary.off().click(function (e) {
                var modal = _this.options.modalIns.entity.modal;

                CodeEditorModal.show(modal.option.chapterSummary, function (code) {
                    modal.option.chapterSummary = code;
                });
                e.preventDefault();
            });

            // 显示/隐藏按钮点击事件
            this.$btnChapterDisplay.off().click(function (e) {
                var modal = _this.options.modalIns.entity.modal;

                CodeEditorModal.show({
                    'js': modal.option.chapterDisplay
                }, function (code) {
                    modal.option.chapterDisplay = code.js;
                }, ['js']);
                e.preventDefault();
            });
        };

    }.call(Modal.prototype);

    exports.ChapterContainerConfigModal = new Modal();

} ( namespace('factory.report.components'), ModalConfig ));