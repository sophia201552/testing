(function (CanvasWidgetMixin) {

    function CanvasRect(layer, options) {
        this.layer = layer;
        this.options = options;
        this.shape = new Konva.Rect(options);
    }

    CanvasRect.prototype = Mixin({}, CanvasWidgetMixin);
    CanvasRect.prototype.constructor = CanvasRect;

    CanvasRect.prototype.width = function () {
        return this.shape.width();
    };

    CanvasRect.prototype.height = function () {
        return this.shape.height();
    };

    window.widgets = window.widgets || {};
    window.widgets.factory = window.widgets.factory  || {};
    window.widgets.factory.CanvasRect = CanvasRect;

} (window.mixins.CanvasWidgetMixin));