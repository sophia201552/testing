(function (exports, SuperClass) {

    function CanvasDevice(layer, model) {
        SuperClass.apply(this, arguments);
    }

    CanvasDevice.prototype = Object.create(SuperClass.prototype);
    CanvasDevice.prototype.constructor = CanvasDevice;

    /** override */
    CanvasDevice.prototype.show = function () {
        var options = _this.store.model.option();
    };

    exports.CanvasDevice = CanvasDevice;
} (
    namespace('widgets.observer'),
    namespace('widgets.factory.CanvasDevice') ));