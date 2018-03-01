var ModalCo2SaveTotal = (function () {
    function ModalCo2SaveTotal(screen, entityParams) {
        ModalBase.call(this, screen, entityParams, this.renderModal, this.updateModal, this.showConfigMode);
    }

    ModalCo2SaveTotal.prototype = new ModalBase();

    ModalCo2SaveTotal.prototype.optionTemplate = {
        name: 'toolBox.modal.REAL_TIME_CO2_SAVE_TOTAL',
        parent:0,
        mode:['realTimeDashboard'],
        maxNum: 1,
        title:'',
        minHeight:1,
        minWidth:2,
        maxHeight:6,
        maxWidth:12,
        type:'ModalCo2SaveTotal'
    };

    ModalCo2SaveTotal.prototype.renderModal = function() {
        this.container.innerHTML = template;
        I18n.fillArea($('#co2Name').parent());
    },

    ModalCo2SaveTotal.prototype.updateModal= function (points) {
        var show = parseFloat(points[0].data).toFixed(1).toString() + ' Ton';
        $('#co2SaveVal').text(show);
    },

    ModalCo2SaveTotal.prototype.showConfigMode = function() {
        var _this = this;
    },

    ModalCo2SaveTotal.prototype.setModalOption = function (option) {
        this.entity.modal.interval = 5;
    };

    var template = '<style type="text/css">\
        .frameCtl {position: relative;height: 100%;}\
        .imgBackground {position: absolute;width: 100%;height: 100%;right: 0;bottom: 0;top: 0;left: 0;z-index: -1;}\
        #co2SaveVal {position: absolute;left: 60px;top: 40px;width: 220px;font-size: 25px;font-weight: 500;color: #eeeeee;}\
        #co2Name {position: absolute;left: 60px;top: 80px;width: 220px;font-size: 25px;font-weight: 500;color: #eeeeee;}\
    </style>\
    <div class="frameCtl">\
        <img src="/static/images/spring/entities/modalCo2SaveTotal.png" class="imgBackground" alt="Background image">\
        <div id="co2SaveVal"></div>\
        <div id="co2Name" i18n="dashboard.carbonFootprint.CO2_SAVING"></div>\
    </div>';

    return ModalCo2SaveTotal;
})();
