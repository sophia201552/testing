(function (CanvasWidgetMixin) {

    function CanvasBlock(layer, options) {
        this.layer = layer;
        this.shape = new Konva.Shape(options);
    }

    CanvasBlock.prototype = Mixin({}, CanvasWidgetMixin);
    CanvasBlock.prototype.constructor = CanvasBlock;

    window.widgets = window.widgets || {};
    window.widgets.factory = window.widgets.factory || {};
    window.widgets.factory.CanvasBlock = CanvasBlock;

}(window.mixins.CanvasWidgetMixin));