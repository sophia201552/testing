(function (CanvasWidgetMixin) {
    var methods = [
        'position',
        'x',
        'y',
        'offsetX',
        'offsetY',
        'radius',
        'fill'
    ];

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

    /** 默认方法 */
    methods.forEach(function (m) {
        CanvasCircle.prototype[m] = function () {
            if (typeof this.shape[m] !== 'undefined') {
                return this.shape[m].apply(this.shape, arguments);
            }
        };
    });

    window.widgets = window.widgets || {};
    window.widgets.factory = window.widgets.factory  || {};
    window.widgets.factory.CanvasCircle = CanvasCircle;

} (window.mixins.CanvasWidgetMixin));