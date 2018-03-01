/// <reference path="../lib/jquery-2.1.4.js" />
/// <reference path="../core/common.js" />

var EquipmentScreen = (function (window) {

    function EquipmentScreen() {

    }

    EquipmentScreen.prototype = {
        show: function () {
            Spinner.spin(ElScreenContainer);
            WebAPI.get("/static/views/observer/equipment/equipmentManage.html").done(function (resultHtml) {
                Spinner.stop();
                $(ElScreenContainer).html(resultHtml);
            });
        },

        close: function () {
            $(ElScreenContainer).empty();
        },

        init: function(){

        }
    }

    return EquipmentScreen;
})(window);
