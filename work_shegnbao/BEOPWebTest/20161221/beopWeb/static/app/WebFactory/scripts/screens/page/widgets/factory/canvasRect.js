(function (CanvasWidgetMixin) {

    var methods = [
        'x',
        'y',
        'width',
        'height',
        'offsetY',
        'rotation',
        'fill'
    ];

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

    /** 默认方法 */
    methods.forEach(function (m) {
        CanvasRect.prototype[m] = function () {
            if (typeof this.shape[m] !== 'undefined') {
                return this.shape[m].apply(this.shape, arguments);
            }
        };
    });

    window.widgets = window.widgets || {};
    window.widgets.factory = window.widgets.factory  || {};
    window.widgets.factory.CanvasRect = CanvasRect;

} (window.mixins.CanvasWidgetMixin));