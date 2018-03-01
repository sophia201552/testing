(function (exports, Widget, CanvasWidgetMixin, CanvasHeatC) {
    var _this;
    function CanvasHeat(layer, model) {
        Widget.apply(this, arguments);
        this.children = [];
        this.shape = undefined;
        _this = this;
    }

    CanvasHeat.prototype = Object.create(Widget.prototype);
    CanvasHeat.prototype.constructor = CanvasHeat;

    CanvasHeat.prototype.init = function () {
        // 兼容一下老数据格式
        this._format();

        Widget.prototype.init.apply(this, arguments);
    };

    CanvasHeat.prototype._format = function () {
        if(typeof this.store.model.isHide === "undefined"){
            this.store.model.property('isHide',0);
        }
    };

    /** override */
    CanvasHeat.prototype.show = function (isS) {
        //isS  true表示预览  false表示非预览
        var _this = this;
        var model = this.store.model;
        var option = model.option();
        var id = model._id(),
            points = option.points,
            color = option.color;

        if (isS) {
            var num = 0;
            var isNoOne = true;
            this.shape = new Konva.Line({
                id: id,
                name: 'heat-line heat-' + id,
                points: points,
                closed: true,
                stroke: '#fff',
                strokeWidth: 0.1,
                opacity: 0.1,
                lineJoin: 'bevel',
                visible: true,
                perfectDrawEnabled: false
            });
            this.layer.add(this.shape);
            this.layer.draw();

        } else {
            this.shape = new Konva.Line({
                id: id,
                name: 'heat-line heat-' + id,
                points: points,
                closed: true,
                stroke: '#111',
                strokeWidth: 1,
                lineJoin: 'bevel',
                visible: true
            });
            this.layer.add(this.shape);
        }

        this.update();
    };

    /** override */
    CanvasHeat.prototype.update = function (e, propType) {
        var model = this.store.model;
        var option = model.option();
        var tempPointId = option.tempPointId;
        // points 更新时，需要重新进行绘制
        if (propType && (propType.indexOf('update.option.points') > -1 || propType.indexOf('update.option') > -1)) {
            this.shape.points(option.points);
            var heatPoint = this.painter.store.widgetModelSet.findByProperty('_id', tempPointId);

            heatPoint&&heatPoint['option.polygonArr'](option.points);
        }
        if (propType && propType.indexOf('update.option.color') > -1) {
            this.shape.fill(option.color);
            this.shape.opacity(0.6);
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

        this.layer.draw();   
    };

    CanvasHeat.prototype = Mixin(CanvasHeat.prototype, CanvasWidgetMixin);

    CanvasHeat.prototype.width = function () {
        return 0;
    };

    CanvasHeat.prototype.height = function () {
        return 0;
    };

    CanvasHeat.prototype.position = function () {
        return {
            x: 0,
            y: 0
        };
    };

    CanvasHeat.prototype.getType = function () {
        return 'Combine';
    };
    CanvasHeat.prototype.moveToBottom = function () {
        
    };
    CanvasHeat.prototype.getPoints = function () {
        return this.store.model['option.points']();
    };

    CanvasHeat.prototype.tools = {
        //坐标系转换
        _transformPoints: function (points, inverse) {
            var p;
            inverse = typeof inverse === 'undefined' ? false : inverse;
            for (var i = 0, len = points.length; i < len; i += 2) {
                p = _this.painter[inverse ? 'inverseTransform' : 'transform']({
                    x: points[i],
                    y: points[i + 1]
                });
                points[i] = p.x;
                points[i + 1] = p.y;
            }
            return points;
        }
    };

    exports.CanvasHeat = CanvasHeat;

}(
    namespace('widgets.factory'),
    namespace('widgets.factory.Widget'),
    namespace('mixins.CanvasWidgetMixin'),
    namespace('widgets.factory.CanvasHeatC')
));