/*---------------------------------------------
 * ReportTplParamsConfigModal 图元配置类定义
 ---------------------------------------------*/
(function(exports, ReportTplParamsPanel) {
    var _this;

    // 存储当前页面所有可链接的menu的html
    var gMenusHtml;

    function ReportTplParamsConfigModal(options) {
        _this = this;

        ModalConfig.call(this, options);

        this.reportTplParamsPanel = null;
    }

    ReportTplParamsConfigModal.prototype = Object.create(ModalConfig.prototype);
    ReportTplParamsConfigModal.prototype.constructor = ReportTplParamsConfigModal;

    ReportTplParamsConfigModal.prototype.DEFAULTS = {
        htmlUrl: '/static/app/WebFactory/scripts/screens/report/components/chapterContainer/reportTplParamsConfigModal.html'
    };

    // @override
    ReportTplParamsConfigModal.prototype.init = function() {
        this.$modal     = $('.modal', this.$wrap);
        this.$modalBody = $('.modal-body', this.$wrap);
        this.$btnSubmit = $('.btn-submit', this.$wrap);
        I18n.fillArea(this.$modal);
        this.attachEvents();
    };

    ReportTplParamsConfigModal.prototype.recoverForm = function () {};

    ReportTplParamsConfigModal.prototype.reset = function () {};

    ReportTplParamsConfigModal.prototype.attachEvents = function () {
        var _this = this;

        //////////////////
        // modal EVENTS //
        //////////////////
        this.$modal.on('show.bs.modal', function () {
            if (_this.reportTplParamsPanel) {
                _this.reportTplParamsPanel.close();
            }
            _this.reportTplParamsPanel = new ReportTplParamsPanel(_this.options.modalIns, _this.$modalBody[0]);
            _this.reportTplParamsPanel.show();
            _this.reportTplParamsPanel.refresh();
        });

        ///////////////////
        // submit EVENTS //
        ///////////////////
        this.$btnSubmit.off().click( function(e) {
            // close modal
            _this.$modal.modal('hide');
            _this.reportTplParamsPanel.apply();
            _this.options.modalIns.render(true);
            e.preventDefault();
        } );
    };

    exports.ReportTplParamsConfigModal = new ReportTplParamsConfigModal();
} ( namespace('factory.report.components'), 
    namespace('factory.panels.ReportTplParamsPanel') ));