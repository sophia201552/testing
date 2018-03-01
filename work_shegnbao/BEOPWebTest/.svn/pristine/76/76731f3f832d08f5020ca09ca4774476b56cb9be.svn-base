/** 
 * Canvas 图层
 */

(function (GLayer, CanvasWidgetMixin) {

    function GCommLayer() {
        GLayer.apply(this, arguments);

        this.stage = this.painter.staticLayer;
    }

    GCommLayer.prototype = Object.create(GLayer.prototype);
    GCommLayer.prototype.constructor = GCommLayer;

    GCommLayer.prototype.add = function (shape) {
        if (Object.prototype.toString.call(shape) !== '[object Array]') {
            shape = [shape];
        }
        this.shape.add.apply(this.shape, shape);
    };

    GCommLayer.prototype.show = function () {
        var model = this.store.model;
        var width = this.painter.stage.width();
        var height = this.painter.stage.height();

        this.shape = new Konva.Group({
            id: model._id(),
            x: 0,
            y: 0
        });

        this.painter.staticLayer.add(this);

        // 父类方法
        GLayer.prototype.show.apply(this, arguments);
    };

    GCommLayer.prototype.showLayer = function () {
        this.shape.show();
    };

    GCommLayer.prototype.hideLayer = function () {
        this.shape.hide();
    };

    GCommLayer.prototype.getLayerType = function () {
        return 'canvas';
    };

    GCommLayer.prototype = Mixin(GCommLayer.prototype, CanvasWidgetMixin);

    window.layers = window.layers || {};
    window.layers.canvas = GCommLayer;
} (window.layers.GLayer, window.mixins.CanvasWidgetMixin))