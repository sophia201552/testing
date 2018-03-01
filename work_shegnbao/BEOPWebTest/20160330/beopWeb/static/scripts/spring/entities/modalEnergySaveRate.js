var ModalEnergySaveRate = (function () {
    function ModalEnergySaveRate(screen, entityParams) {
        ModalBase.call(this, screen, entityParams, this.renderModal, this.updateModal, this.showConfigMode);
    }

    ModalEnergySaveRate.prototype = new ModalBase();
    ModalEnergySaveRate.prototype.optionTemplate = {
        name: 'toolBox.modal.REAL_TIME_ENERGY_SAVE_RATE',
        parent: 0,
        mode: ['realTimeDashboard'],
        maxNum: 1,
        title: '',
        minHeight: 1,
        minWidth: 2,
        maxHeight: 6,
        maxWidth: 12,
        type: 'ModalEnergySaveRate'
    };

    ModalEnergySaveRate.prototype.renderModal = function () {
        var _this = this;

        WebAPI.get('/static/scripts/spring/entities/modalEnergySaveRate.html').done(function (resultHtml) {
            _this.container.innerHTML = resultHtml;
            I18n.fillArea($('#energySaveName').parent());
        });
    },

    ModalEnergySaveRate.prototype.updateModal = function (points) {
        var show = parseFloat(points[0].data).toFixed(1).toString() + '%';
        $('#energySavePerVal').text(show);
        $('#progressItem').css('width', show);
    },

    ModalEnergySaveRate.prototype.showConfigMode = function () {
        var _this = this;
    },

    ModalEnergySaveRate.prototype.setModalOption = function (option) {
        this.entity.modal.interval = 5;
    };

    return ModalEnergySaveRate;
})();