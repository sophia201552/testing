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

    CanvasPipe.prototype.init = function () {
        // 兼容一下老数据格式
        this._format();

        Widget.prototype.init.call(this);
    };

    CanvasPipe.prototype._format = function () {
        var options = this.store.model.option();
        var points = options.points, pArr = [];

        if (typeof points[0] === 'number') {
            for (var i = 0, len = points.length; i < len; i += 2) {
                pArr.push({
                    x: points[i],
                    y: points[i+1],
                    join: 1
                });
            }
            options.points = pArr;
        }
    };

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
    CanvasPipe.prototype.update = function (e, propType) {
        var model = this.store.model;
        var option = model.option();
        var points = option.points;
        var info, dx, dy, pw, ph;

        // x,y 更新时，需要更新 points 数组
        if (propType && (propType.indexOf('update.x') > -1 || propType.indexOf('update.y') > -1 )) {
            info = this.shape.shapeInfo;
            dx = model.x() - info.xMin;
            dy = model.y() - info.yMin;

            for (var i = 0, len = points.length; i < len; i++) {
                points[i].x = points[i].x + dx;
                points[i].y = points[i].y + dy;
            }
            this.shape.options.points = points;
        }

        // w,h 更新时，需要更新 points 数组
        // 按比例增加
        if ( propType && (propType.indexOf('update.w') > -1 || propType.indexOf('update.h') > -1 ) ) {
            info = this.shape.shapeInfo;
            pw = model.w() / info.w;
            ph = model.h() / info.h;

            for (var i = 0, len = points.length; i < len; i++) {
                points[i].x = (points[i].x-info.xMin) * pw + info.xMin;
                points[i].y = (points[i].y-info.yMin) * ph + info.yMin;
            }
            this.shape.options.points = points;
        }

        // 颜色或者宽度更新时, 需要更新 color
        if( propType && propType.indexOf('update.option') > -1 ){
            this.shape.options.color = option.color;
            this.shape.options.width = option.width;
            this.shape.options.points = option.points;
        }

        this.shape.paint();
        this.children = this.shape.toArray();

        this.layer.add(this.children.map(function (row) {
            return row.shape;
        }));

        this.layer.draw();
    };

    CanvasPipe.prototype = Mixin(CanvasPipe.prototype, CanvasWidgetMixin);

    CanvasPipe.prototype.hasShape = function (shape) {
        return this.children.some(function (row) {
            return shape === row.shape;
        });
    };

    CanvasPipe.prototype.width = function () {
        return 0;
    };

    CanvasPipe.prototype.height = function () {
        return 0;
    };

    CanvasPipe.prototype.getType = function () {
        return 'Combine';
    };

    CanvasPipe.prototype.getPoints = function () {
        return this.store.model['option.points']();
    };

    CanvasPipe.prototype.getRadius = function () {
        return this.shape.CIRCLE_RADIUS;
    };

    window.widgets = window.widgets || {};
    window.widgets.factory = window.widgets.factory  || {};
    window.widgets.factory.CanvasPipe = CanvasPipe;

} (window.widgets.factory.Widget, window.mixins.CanvasWidgetMixin,
   window.widgets.factory.CanvasPipeShape));