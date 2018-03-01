;(function (exports, SuperClass) {

    function Modal() {
        SuperClass.apply(this, arguments);

        this.dataList = [];
    }

    Modal.prototype = Object.create(SuperClass.prototype);

    +function () {
        this.DEFAULTS = {
            htmlUrl: '/static/app/WebFactory/scripts/screens/report/components/block/blockConfigModal.html'
        };

        this.init = function () {
            this.$modal      = $('.modal', this.$wrap);
            this.$form       = $('#formModal', this.$wrap);
            
            this.$iptDataId  = $('#iptDataId', this.$wrap);
            this.$ulDataList = $('#ulDataList', this.$wrap);
            
            this.$btnSubmit  = $('#btnSubmit', this.$wrap);
            I18n.fillArea(this.$modal);
            this.attachEvents();
        };

        // @override
        this.recoverForm = function(options) {
            var _this = this;
            var form = options.option;
            if (!form) return;

            this._setField('input', this.$iptDataId, form.dataId);
        };

        // @override
        this.reset = function () {
            var _this = this;
            this._setField('input', this.$iptDataId);
        };

        this.attachEvents = function () {
            var _this = this;

            // 确实按钮点击事件
            this.$btnSubmit.off().click(function (e) {
                var modalIns = _this.options.modalIns;
                var modal = modalIns.entity.modal;
                var form = {};

                form.dataId = this.$iptDataId.val();
                modal.option = $.extend(false, modal.option, form);

                _this.$modal.modal('hide');
                modalIns.render(true);

                e.preventDefault();
            }.bind(this));
        };

    }.call(Modal.prototype);

    exports.BlockConfigModal = new Modal();

} ( namespace('factory.report.components'), ModalConfig ));