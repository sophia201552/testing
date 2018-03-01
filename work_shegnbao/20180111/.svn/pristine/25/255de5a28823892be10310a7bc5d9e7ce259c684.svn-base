var ModalAnalysis = (function () {
    var _this = undefined;

    function ModalAnalysis(screen, entityParams) {
        entityParams.spanR = 6;
        entityParams.spanC = 12;
        ModalBase.call(this, screen, entityParams, this.renderModal, this.updateModal, this.showConfigMode);
        // 为了适配 Docker，这里包一层
        this.spinner.stop();
        this.container = $('<div style="padding: 20px;position: absolute;left:0;top:0;right:0;bottom:0; z-index: 102; overflow-y: auto;"></div>')
        .appendTo(this.container)[0];

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
        this.entityAnalysis = new modalClass(this.container, this.curModal, this);
        this.entityAnalysis.isShareMode = 1;
        this.entityAnalysis.paneChart = null;//this.container;
        this.entityAnalysis.chartAnimationDuration = 500;
        this.entityAnalysis.animation = false;
        this.entityAnalysis.show();
    };

    ModalAnalysis.prototype.onresize = function () {
        if (this.entityAnalysis.chart) this.entityAnalysis.chart.resize();
    };

    ModalAnalysis.prototype.updateModal = function (points) { };

    ModalAnalysis.prototype.showConfigMode = function () { };

    ModalAnalysis.prototype.setModalOption = function (option) { };

    ModalAnalysis.prototype.alertNoData = function () { };

    ModalAnalysis.prototype.spinnerStop = function () { };
    
    ModalAnalysis.prototype.saveModal = function () { };

    return ModalAnalysis;
})();
