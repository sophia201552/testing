(function (CanvasWidgetMixin) {

    function CanvasLine(layer, options) {
        this.layer = layer;
        this.shape = new Konva.Line(options);
    }

    CanvasLine.prototype = Mixin({}, CanvasWidgetMixin);
    CanvasLine.prototype.constructor = CanvasLine;

    CanvasLine.prototype.width = function () {
        // 目前先不让管道被选中
        return 0;
    };

    CanvasLine.prototype.height = function () {
        // 目前先不让管道被选中
        return 0;
    };

    window.widgets = window.widgets || {};
    window.widgets.factory = window.widgets.factory  || {};
    window.widgets.factory.CanvasLine = CanvasLine;

} (window.mixins.CanvasWidgetMixin));