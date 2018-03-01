var ModalCoalSaveTotal = (function () {
    function ModalCoalSaveTotal(screen, entityParams) {
        ModalBase.call(this, screen, entityParams, this.renderModal, this.updateModal, this.showConfigMode);
    }

    ModalCoalSaveTotal.prototype = new ModalBase();
    ModalCoalSaveTotal.prototype.optionTemplate = {
        name:'toolBox.modal.REAL_TIME_COAL_SAVE_TOTAL',
        parent:0,
        mode:['realTimeDashboard'],
        maxNum: 1,
        title:'',
        minHeight:1,
        minWidth:2,
        maxHeight:6,
        maxWidth:12,
        type:'ModalCoalSaveTotal'
    };

    ModalCoalSaveTotal.prototype.renderModal = function () {
        this.container.innerHTML = template;
        I18n.fillArea($('#coalSaveName').parent());
    },

    ModalCoalSaveTotal.prototype.updateModal = function (points) {
        var show = parseFloat(points[0].data).toFixed(1).toString() + ' Ton';
        $('#coalSaveVal').text(show);
    },

    ModalCoalSaveTotal.prototype.showConfigMode = function () {
        var _this = this;
    },

    ModalCoalSaveTotal.prototype.setModalOption = function (option) {
        this.entity.modal.interval = 5;
    };

    var template = '<style type="text/css">\
        .frameCtl {position: relative;height: 100%;}\
        .imgBackground {position: absolute;width: 100%;height: 100%;right: 0;bottom: 0;top: 0;left: 0;z-index: -1;}\
        #coalSaveVal {position: absolute;left: 60px;top: 40px;width: 220px;font-size: 25px;font-weight: 500;color: #eeeeee;}\
        #coalSaveName {position: absolute;left: 60px;top: 80px;width: 220px;font-size: 25px;font-weight: 500;color: #eeeeee;}\
    </style>\
    <div class="frameCtl">\
        <img src="/static/images/spring/entities/modalCoalSaveTotal.png" class="imgBackground" alt="Background image">\
        <div id="coalSaveVal"> Ton</div>\
        <div id="coalSaveName" i18n="dashboard.carbonFootprint.STANDARD_COAL_SAVING"></div>\
    </div>';

    return ModalCoalSaveTotal;
})();