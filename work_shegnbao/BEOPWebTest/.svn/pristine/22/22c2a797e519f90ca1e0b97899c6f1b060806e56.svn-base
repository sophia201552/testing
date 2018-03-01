(function (CanvasWidgetMixin) {

    function CanvasLine(layer, options) {
        this.layer = layer;
        this.shape = new Konva.Line(options);
    }

    CanvasLine.prototype = Mixin({}, CanvasWidgetMixin);
    CanvasLine.prototype.constructor = CanvasLine;

    window.widgets = window.widgets || {};
    window.widgets.factory = window.widgets.factory  || {};
    window.widgets.factory.CanvasLine = CanvasLine;

} (window.mixins.CanvasWidgetMixin));