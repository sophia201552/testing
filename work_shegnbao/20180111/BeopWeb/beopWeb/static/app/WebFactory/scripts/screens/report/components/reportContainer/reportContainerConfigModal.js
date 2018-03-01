;(function (exports, SuperClass) {

    function Modal() {
        SuperClass.apply(this, arguments);
    }

    Modal.prototype = Object.create(SuperClass.prototype);

    +function () {
        this.DEFAULTS = {
            htmlUrl: '/static/app/WebFactory/scripts/screens/report/components/reportContainer/reportContainerConfigModal.html'
        };

        this.init = function () {
            this.$modal           = $('.modal', this.$wrap);
            this.$form            = $('#formModal', this.$wrap);
            this.$btnReportPeriod = $('#btnReportPeriod', this.$wrap);
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

            this._setField('dropdown', this.$btnReportPeriod, form.period);
        };

        // @override
        this.reset = function () {
            var _this = this;
            this._setField('dropdown', this.$btnReportPeriod);
        };

        this.attachEvents = function () {
            var _this = this;

            this.$btnSubmit.off().click(function (e) {
                var modalIns = _this.options.modalIns;
                var modal = modalIns.entity.modal;
                var form = {};

                form.period = this.$btnReportPeriod.attr('data-value');

                modal.option = $.extend(false, modal.option, form);

                _this.$modal.modal('hide');
                modalIns.render(true);

                e.preventDefault();
            }.bind(this));
        };

    }.call(Modal.prototype);

    exports.ReportContainerConfigModal = new Modal();

} ( namespace('factory.report.components'), ModalConfig ));