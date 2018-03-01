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
            this.$textareaChapterSummary = $('#textareaChapterSummary', this.$wrap);
            // drop area
            this.$btnSubmit       = $('#btnSubmit', this.$wrap);
            
            this.attachEvents();
        };

        // @override
        this.recoverForm = function(options) {
            var _this = this;
            var form = options.option;
            if (!form) return;

            this._setField('input', this.$iptChapterTitle, form.chapterTitle);
            this._setField('textarea', this.$textareaChapterSummary, form.chapterSummary);
        };

        // @override
        this.reset = function () {
            var _this = this;
            this._setField('input', this.$iptChapterTitle);
            this._setField('textarea', this.$textareaChapterSummary);
        };

        this.attachEvents = function () {
            var _this = this;

            this.$btnSubmit.off().click(function (e) {
                var modalIns = _this.options.modalIns;
                var modal = modalIns.entity.modal;
                var form = {};

                form.chapterTitle = this.$iptChapterTitle.val();
                form.chapterSummary = this.$textareaChapterSummary.val();
                modal.option = $.extend(false, modal.option, form);

                _this.$modal.modal('hide');
                modalIns.refreshTitle();

                e.preventDefault();
            }.bind(this));
        };

    }.call(Modal.prototype);

    exports.ChapterContainerConfigModal = new Modal();

} ( namespace('factory.report.components'), ModalConfig ));