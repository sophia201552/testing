(function (CanvasWidgetMixin) {

    var methods = [
        'points',
        'stroke',
        'strokeWidth',
        'opacity'
    ];

    function CanvasLine(layer, options) {
        this.layer = layer;
        this.shape = new Konva.Line(options);
    }
    CanvasLine.prototype = Mixin({}, CanvasWidgetMixin);
    CanvasLine.prototype.constructor = CanvasLine;

    /** 默认方法 */
    methods.forEach(function (m) {
        CanvasLine.prototype[m] = function () {
            if (typeof this.shape[m] !== 'undefined') {
                return this.shape[m].apply(this.shape, arguments);
            }
        };
    });

    window.widgets = window.widgets || {};
    window.widgets.factory = window.widgets.factory  || {};
    window.widgets.factory.CanvasLine = CanvasLine;

} (window.mixins.CanvasWidgetMixin));