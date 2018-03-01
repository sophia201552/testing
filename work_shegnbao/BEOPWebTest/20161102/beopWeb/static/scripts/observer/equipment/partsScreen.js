/// <reference path="../lib/jquery-2.1.4.js" />
/// <reference path="../core/common.js" />

var PartsScreen = (function (window) {

    function PartsScreen() {

    }

    PartsScreen.prototype = {
        show: function () {
            Spinner.spin(ElScreenContainer);
            WebAPI.get("/static/views/observer/equipment/partsManage.html").done(function (resultHtml) {
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

    return PartsScreen;
})(window);
