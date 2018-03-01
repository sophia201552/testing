/////////////////////////////////
/// CanvasCustomLineShape DEFINITION //
/////////////////////////////////
(function (CanvasLine, CanvasCircle, CanvasRect) {

    function CanvasCustomLineShape(layer, options) {
        this.layer = layer;
        this.options = options;

        // 当前图形的位置和大小信息
        this.shapeInfo = null;
        this.line = null;
    }

    CanvasCustomLineShape.prototype.paint = function (isActive) {
        var x, y;
        var points = this.options.points;
        var color = this.options.color;
        var width = this.options.width;
        var id = this.options._id;
        var style = this.options.style;
        var rotation = 0;

        // 不存在，则进行创建
        if (!this.line) {
            this.line = new CanvasLine(this.layer, {
                id: id,
                name: 'customLine-line customLine-' + id,
                lineJoin: 'round',
                perfectDrawEnabled: false,
                dashEnabled: false,
                dash: [10, 5]
            });
        }

        // 更新 - 开始
        this.line.points( (function (points) {
            var arr = [];
            points.forEach(function (row) {
                arr.push(row.x);
                arr.push(row.y);
            });
            return arr;
        }(points)) );
        this.line.stroke(color ? color : 'rgba(0, 114, 201, .7)');
        this.line.strokeWidth(width ? width : 2);
        this.line.dashEnabled(style!==0);
        this.shapeInfo = GUtil.getPipeRect(points);
    };

    CanvasCustomLineShape.prototype.updatePoints = function (points) {
        this.options.points = points;
        this.paint();
    };

    CanvasCustomLineShape.prototype.toArray = function () {
        var shapes = [];
        shapes.push(this.line);
        return shapes;
    };

    CanvasCustomLineShape.prototype.id = function () {
        return this.options._id;
    };

    CanvasCustomLineShape.prototype.remove = function () {
        this.line.shape.remove();
    };
    /** @override */
    CanvasCustomLineShape.prototype.setZIndex = function (zIndex) {
        this.line&&this.line.shape.setZIndex(zIndex);
        return zIndex;
    };

    /** @override */
    CanvasCustomLineShape.prototype.getZIndex = function () {
        return this.line.getZIndex();
    };

    /** @override */
    CanvasCustomLineShape.prototype.getAbsolutePosition = function () {
        var painter = this.layer.painter;
        return painter.inverseTransform({
            x: this.shapeInfo.xMin,
            y: this.shapeInfo.yMin
        });
    };

    CanvasCustomLineShape.prototype.moveToBottom = function () {};

    CanvasCustomLineShape.prototype.isVisible = function () {
        return this.line.isVisible();
    };

    CanvasCustomLineShape.prototype.show = function () {
        this.line&&this.line.shape.show();
    };

    CanvasCustomLineShape.prototype.hide = function () {
        this.line.shape.hide();
    };

    CanvasCustomLineShape.prototype.destroy = function () {
        this.line && this.line.shape.destroy();
    };

    window.widgets = window.widgets || {};
    window.widgets.factory = window.widgets.factory  || {};
    window.widgets.factory.CanvasCustomLineShape = CanvasCustomLineShape;

} ( window.widgets.factory.CanvasLine,
    window.widgets.factory.CanvasCircle,
    window.widgets.factory.CanvasRect));