(function (exports, Widget, CanvasWidgetMixin) {
    var _this;
    function CanvasPolygon(layer, model) {
        Widget.apply(this, arguments);
        this.children = [];
        this.shape = undefined;
        _this = this;
    }

    CanvasPolygon.prototype = Object.create(Widget.prototype);
    CanvasPolygon.prototype.constructor = CanvasPolygon;

    CanvasPolygon.prototype.init = function () {
        // 兼容一下老数据格式
        this._format();

        Widget.prototype.init.apply(this, arguments);
    };

    CanvasPolygon.prototype._format = function () {
        if(typeof this.store.model.isHide === "undefined"){
            this.store.model.property('isHide',0);
        }
    };

    /** override */
    CanvasPolygon.prototype.show = function (isPreview) {
        //isPreview  是否预览
        var model = this.store.model;
        var option = model.option();
        var id = model._id(),
            points = option.points,
            color = option.color;
        var stroke, strokeWidth, opacity;

        this.shape = new Konva.Line({
            id: id,
            name: 'polygon-line polygon-' + id,
            points: points,
            closed: true,
            stroke: !isPreview ? '#111' : 'transparent',
            strokeWidth: !isPreview ? 2 : 0,
            fill: 'transparent',
            lineJoin: 'bevel'
        });
        
        this.layer.add(this.shape);
        this.layer.draw();
        this.update();

        this.attachEvents();
    };

    /** override */
    CanvasPolygon.prototype.update = function (e, propType) {
        var model = this.store.model;
        var option = model.option();

        // points 更新时，需要重新进行绘制
        if (propType && propType.indexOf('update.option.points') > -1) {
            this.shape.points(option.points);
        }
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

        // 首次在这里无需绘制
        if (e) {
            this.layer.draw();
        }
    };

    CanvasPolygon.prototype.attachEvents = function () {};

    CanvasPolygon.prototype = Mixin(CanvasPolygon.prototype, CanvasWidgetMixin);

    CanvasPolygon.prototype.width = function () {
        return 0;
    };

    CanvasPolygon.prototype.height = function () {
        return 0;
    };

    CanvasPolygon.prototype.position = function () {
        return {
            x: 0,
            y: 0
        };
    };

    CanvasPolygon.prototype.getType = function () {
        return 'Combine';
    };
    CanvasPolygon.prototype.moveToBottom = function () {
        
    };
    CanvasPolygon.prototype.getPoints = function () {
        return this.store.model['option.points']();
    };

    exports.CanvasPolygon = CanvasPolygon;

}(
    namespace('widgets.factory'),
    namespace('widgets.factory.Widget'),
    namespace('mixins.CanvasWidgetMixin')
));