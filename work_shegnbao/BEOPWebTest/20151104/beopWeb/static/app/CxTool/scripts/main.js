(function () {
    var init, show, close;

    show = function () {
        beop.main.prototype.init($('.content'));
    };

    init = function ($container) {
        //------------configure and initialize Models
        beop.ctModel.init();
        //------------configure and initialize views
        beop.view.sheet.configModel({
            sheetModel: beop.ctModel.sheetModel
        });

        beop.view.sheet.init($container);
    };

    var _main = function () {

    };
    _main.prototype = {
        init: init,
        show: show
    };

    beop.main = _main;
}(beop || (beop = {})));
var beop = beop || {};
beop.main.prototype.show();

var spinner = new LoadingSpinner({color: '#00FFFF'});
