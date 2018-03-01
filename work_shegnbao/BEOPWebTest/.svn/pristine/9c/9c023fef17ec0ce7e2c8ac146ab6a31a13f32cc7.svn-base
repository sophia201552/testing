(function (CanvasWidgetMixin) {
    var methods = ['position'];

    function CanvasCircle(layer, options) {
        this.layer = layer;
        this.options = options;
        this.shape = new Konva.Circle(options);
    }

    CanvasCircle.prototype = Mixin({}, CanvasWidgetMixin);
    CanvasCircle.prototype.constructor = CanvasCircle;

    CanvasCircle.prototype.width = function () {
        return this.options.radius*2;
    };

    CanvasCircle.prototype.height = function () {
        return this.options.radius * 2;
    };

    methods.forEach(function (m) {
        this[m] = function () {
            Konva.Circle.prototype[m].apply(this.shape, arguments);   
        };
    }, CanvasCircle.prototype);

    window.widgets = window.widgets || {};
    window.widgets.factory = window.widgets.factory  || {};
    window.widgets.factory.CanvasCircle = CanvasCircle;

} (window.mixins.CanvasWidgetMixin));