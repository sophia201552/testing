ModBusInterface = (function (exports) {
    function ModBusInterface(projectId) {
        this.projectId = projectId ? projectId : AppConfig.projectId;
    }

    ModBusInterface.prototype.constructor = ModBusInterface;
    ModBusInterface.prototype = {
        show: function () {
            Spinner.spin(ElScreenContainer);
            exports.dtuStatusTimer = null;
            exports.pointStatusTimer = null;
            exports.pointSearchStatusListTimer = null;
            WebAPI.get("/modbus/").done(function (resultHtml) {
                $(ElScreenContainer).html(resultHtml);
                let $modbusContainer = $('#modbusContainer');
                new exports.ProjectPanel($modbusContainer.find('.left')).init();
                new exports.PointsTable($modbusContainer.find('.content')).init();
                I18n.fillArea($modbusContainer);
            }).always(function () {
                Spinner.stop();
            });
        },
        close: function () {
            exports.dtuStatusTimer && clearInterval(exports.dtuStatusTimer);
            exports.pointStatusTimer && clearInterval(exports.pointStatusTimer);
            exports.pointSearchStatusListTimer && clearInterval(exports.pointSearchStatusListTimer);
            /*for (var prop in exports.pointSearchStatusListTimer) {
                exports.pointSearchStatusListTimer[prop] && clearInterval(exports.pointSearchStatusListTimer[prop]);
            }*/
        }
    };
    return ModBusInterface;
})(namespace('beop.mb'));
//# sourceURL=main.js