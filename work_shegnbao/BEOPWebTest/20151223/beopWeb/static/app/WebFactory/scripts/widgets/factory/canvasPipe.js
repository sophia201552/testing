(function (Widget, CanvasWidgetMixin, CanvasPipeShape) {

    ////////////////////////////
    /// CanvasPipe DEFINITION //
    ////////////////////////////
    function CanvasPipe(layer, model) {
        Widget.apply(this, arguments);

        this.children = [];
    }

    CanvasPipe.prototype = Object.create(Widget.prototype);
    CanvasPipe.prototype.constructor = CanvasPipe;

    /** override */
    CanvasPipe.prototype.show = function () {
        var _this = this;
        var model = this.store.model;
        var initPos = {};
        //var points = model.option().points;
        var option = model.option();

        this.shape = new CanvasPipeShape(this.layer, {
            _id: model._id(),
            points: option.points,
            color: option.color,
            width: option.width
        });

        this.update();
    };

    /** override */
    CanvasPipe.prototype.close = function () {};

    /** override */
    CanvasPipe.prototype.update = function (e, propType) {
        var model = this.store.model;
        var points = model.option().points;
        var option = model.option();
        var info, dx, dy, pw, ph;

        // x,y 更新时，需要更新 points 数组
        if (propType && (propType.indexOf('update.x') > -1 || propType.indexOf('update.y') > -1 )) {
            info = this.shape.shapeInfo;
            dx = model.x() - info.xMin;
            dy = model.y() - info.yMin;

            for (var i = 0, len = points.length; i < len; i+=2) {
                points[i] = points[i] + dx;
                points[i+1] = points[i+1] + dy;
            }
            this.shape.options.points = points;
        }

        // w,h 更新时，需要更新 points 数组
        // 按比例增加
        if ( propType && (propType.indexOf('update.w') > -1 || propType.indexOf('update.h') > -1 ) ) {
            info = this.shape.shapeInfo;
            pw = model.w() / info.w;
            ph = model.h() / info.h;

            for (var i = 0, len = points.length; i < len; i+=2) {
                points[i] = (points[i]-info.xMin) * pw + info.xMin;
                points[i+1] = (points[i+1]-info.yMin) * ph + info.yMin;
            }
            this.shape.options.points = points;
        }

        // 颜色或者宽度更新时, 需要更新 color
        if( propType && propType.indexOf('update.option') > -1 ){
            this.shape.options.color = option.color;
            this.shape.options.width = option.width;
        }

        this.shape.paint();
        this.children = this.shape.toArray();

        this.layer.add(this.children.map(function (row) {
            return row.shape;
        }));

        this.layer.draw();
    };

    CanvasPipe.prototype = Mixin(CanvasPipe.prototype, CanvasWidgetMixin);

    CanvasPipe.prototype.getType = function () {
        return 'Combine';
    };

    CanvasPipe.prototype.destroy = function () {
        this.children.length = 0;
        CanvasWidgetMixin.destroy.call(this);
    };

    window.widgets = window.widgets || {};
    window.widgets.factory = window.widgets.factory  || {};
    window.widgets.factory.CanvasPipe = CanvasPipe;

} (window.widgets.factory.Widget, window.mixins.CanvasWidgetMixin,
   window.widgets.factory.CanvasPipeShape));