/// <reference path="../lib/jquery-2.1.4.js" />
/// <reference path="../core/common.js" />

var PartsPurchaseScreen = (function (window) {

    function PartsPurchaseScreen() {

    }

    PartsPurchaseScreen.prototype = {
        show: function () {
            Spinner.spin(ElScreenContainer);
            WebAPI.get("/static/views/observer/equipment/partsPurchaseManage.html").done(function (resultHtml) {
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

    return PartsPurchaseScreen;
})(window);
