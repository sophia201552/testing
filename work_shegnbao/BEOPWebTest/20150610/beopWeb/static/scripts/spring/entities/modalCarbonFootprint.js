/// <reference path="../../lib/jquery-1.11.1.min.js" />
var ModalCarbonFootprint = (function () {
    function ModalCarbonFootprint(containerId, entityParams) {
        ModalBase.call(this, containerId, entityParams, this.renderModal, this.updateModal, this.showConfigMode);
        this.isFirstTime = true;
        this.widthRuler = undefined;
        this.$elMask = undefined;
        this.elPaneValue = undefined;
        this.elPaneTitle = undefined;
        this.maxValue = undefined;
    };

    ModalCarbonFootprint.prototype = new ModalBase();
    ModalCarbonFootprint.prototype.optionTemplate = {
        name:'toolBox.modal.REAL_TIME_CARBON_FOOTPRINT',
        parent:0,
        mode:['realTimeDashboard'],
        maxNum: 1,
        title:'',
        minHeight:3,
        minWidth:4,
        maxHeight:6,
        maxWidth:12,
        type:'ModalCarbonFootprint'
    };


    ModalCarbonFootprint.prototype.renderModal = function () {
        if (this.isFirstTime) this.init();
    },

    ModalCarbonFootprint.prototype.init = function () {
        var _this = this;
        WebAPI.get('/static/scripts/spring/entities/modalCarbonFootprint.html').done(function (resultHTML) {
            _this.container.innerHTML = resultHTML;
            _this.initStandard();
            _this.isFirstTime = false;
            I18n.fillArea($('.divCFTitle').parent());
        });
    },

    ModalCarbonFootprint.prototype.initStandard = function () {
        $divMain = $(this.container);
        this.widthRuler = $divMain.find('.cfProcessScale').width();
        this.$elMask = $divMain.find('.cfProcessMask');
        this.elPaneValue = document.getElementById('cfFootprintDashboardCurrent');
        this.elPaneTitle = document.getElementById('divCFTitle');

        var unitValue = this.entity.modal.option.valueStandard / 4;
        this.maxValue = unitValue * 5;

        //init scale numbers of ruler
        var tdScaleNums = this.container.getElementsByClassName('cfProcessScaleNum');
        for (var i = 0, len = tdScaleNums.length; i < len; i++) {
            tdScaleNums[i].textContent = parseInt(unitValue * i).toString();
        }

        //init warning field
        $divMain.find('.cfLegendBarWarning').animate({ width: this.widthRuler * 0.2 + 'px' }, 1000);
        document.getElementById('cfFootprintDashboardStandard').textContent = this.entity.modal.option.valueStandard;
    },

    ModalCarbonFootprint.prototype.updateModal = function (points) {
        var value = parseFloat(points[0].data).toFixed(1).toString();
        this.elPaneValue.textContent = value;
        this.elPaneTitle.textContent = value;
        this.$elMask.animate({ width: this.widthRuler - value * this.widthRuler / this.maxValue + 'px' }, 1000);
    },

    ModalCarbonFootprint.prototype.showConfigMode = function () {
    };

    ModalCarbonFootprint.prototype.setModalOption = function (option) {
        this.entity.modal.option = {};
        //TODO
        this.entity.modal.option.valueStandard = 3500;
    };

    return ModalCarbonFootprint;
})();