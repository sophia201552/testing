var ModalAnalysis = (function () {
    var _this = undefined;

    function ModalAnalysis(screen, entityParams) {
        ModalBase.call(this, screen, entityParams, this.renderModal, this.updateModal, this.showConfigMode);
        _this = this;

        this.curModal = this.entity.modal.option.option;
        this.entityAnalysis = undefined;
        this.saveModalJudge = $.Deferred();
    }

    ModalAnalysis.prototype = new ModalBase();

    ModalAnalysis.prototype.optionTemplate = {
        name: 'toolBox.modal.TRANSIT',
        parent: 2,
        mode: ['realTimeWithoutRange'],
        maxNum: 1,
        title: '',
        minHeight: 1,
        minWidth: 1,
        maxHeight: 6,
        maxWidth: 12,
        type: 'ModalAnalysis'
    };

    ModalAnalysis.prototype.renderModal = function () {
        var modalClass = this.screen.factoryIoCAnalysis.getModel(this.entity.modal.option.type);
        this.screen.curModal = this.curModal;
        this.entityAnalysis = new modalClass(this.container, null, this);
        this.entityAnalysis.paneChart = this.container;
        this.entityAnalysis.chartAnimationDuration = 10;
        this.entityAnalysis.show();
    },

    ModalAnalysis.prototype.updateModal = function (points) { };

    ModalAnalysis.prototype.showConfigMode = function () { };

    ModalAnalysis.prototype.setModalOption = function (option) { };

    ModalAnalysis.prototype.alertNoData = function () { };

    ModalAnalysis.prototype.spinnerStop = function () { };
    
    ModalAnalysis.prototype.saveModal = function () { };

    return ModalAnalysis;
})();
