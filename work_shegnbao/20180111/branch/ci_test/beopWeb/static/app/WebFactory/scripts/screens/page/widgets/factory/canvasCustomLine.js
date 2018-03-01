(function (exports, Widget, CanvasWidgetMixin, CanvasCustomLineShape) {

    ////////////////////////////
    /// CanvasPipe DEFINITION //
    ////////////////////////////
    function CanvasCustomLine(layer, model) {
        Widget.apply(this, arguments);

        this.children = [];
    }

    CanvasCustomLine.prototype = Object.create(Widget.prototype);
    CanvasCustomLine.prototype.constructor = CanvasCustomLine;

    CanvasCustomLine.prototype.init = function () {
        // 兼容一下老数据格式
        this._format();

        Widget.prototype.init.call(this);
    };

    CanvasCustomLine.prototype._format = function () {
        var options = this.store.model.option();
        var points = options.points, pArr = [];
        if(typeof this.store.model.isHide === "undefined"){
            this.store.model.property('isHide',0);
        }

        this.store.model.option(options);
    };

    /** override */
    CanvasCustomLine.prototype.show = function () {
        var _this = this;
        var model = this.store.model;
        var option = model.option();
        this.shape = new CanvasCustomLineShape(this.layer, {
            _id: model._id(),
            points: option.points,
            color: option.color,
            width: option.width,
            style: option.style
        });
        this.update();
        this.children = this.shape.toArray();
        this.layer.add(this.children.map(function (row) {
            return row.shape;
        }));
    };

    /** override */
    CanvasCustomLine.prototype.update = function (e, propType) {
        var model = this.store.model;
        var option = model.option();
        var points = option.points;
        var info, dx, dy, pw, ph;

        // 颜色或者宽度更新时, 需要更新 color
        if( propType && propType.indexOf('update.option') > -1 ){
            this.shape.options.color = option.color;
            this.shape.options.width = option.width;
            this.shape.options.points = option.points;
            this.shape.options.style = option.style;
        }
        this.shape.paint();
        //更新 isHide
        if (!propType || propType.indexOf('update.isHide') > -1) {
            if(this.store.model.isHide()){
                this.detach();
            }else{
                this.attach();
            }
        }
        if (!propType || propType.indexOf('update.layerId') > -1) {
            this.setParent(model.layerId());
        }
        // 仅更新的时候需要再次进行绘制
        if (e) {
            this.layer.draw();
        }
    };

    CanvasCustomLine.prototype = Mixin(CanvasCustomLine.prototype, CanvasWidgetMixin);

    CanvasCustomLine.prototype.hasShape = function (shape) {
        return this.children.some(function (row) {
            return shape === row.shape;
        });
    };

    CanvasCustomLine.prototype.width = function () {
        return 0;
    };

    CanvasCustomLine.prototype.height = function () {
        return 0;
    };

    /** override */
    CanvasCustomLine.prototype.position = function () {
        return {
            x: 0,
            y: 0
        };
    };

    CanvasCustomLine.prototype.getType = function () {
        return 'CustomLine';
    };

    CanvasCustomLine.prototype.getPoints = function () {
        return this.store.model['option.points']();
    };

    CanvasCustomLine.prototype.getRadius = function () {
        return this.shape.CIRCLE_RADIUS;
    };

    exports.CanvasCustomLine = CanvasCustomLine;
} (
    namespace('widgets.factory'),
    namespace('widgets.factory.Widget'),
    namespace('mixins.CanvasWidgetMixin'),
    namespace('widgets.factory.CanvasCustomLineShape') ));