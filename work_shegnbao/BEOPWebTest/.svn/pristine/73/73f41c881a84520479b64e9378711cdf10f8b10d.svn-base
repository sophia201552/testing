/////////////////////////////////
/// CanvasPipeShape DEFINITION //
/////////////////////////////////
(function (CanvasLine, CanvasCircle, CanvasRect) {

    function CanvasPipeShape(layer, options) {
        this.layer = layer;
        this.options = options;

        // 当前图形的位置和大小信息
        this.shapeInfo = null;

        this.line = null;
        this.joins = [];
        this.rects = [];

        this.moves = [];
        this.anim = null;
        this.animationOptions = {
            speed: 50
        }
    }

    CanvasPipeShape.prototype.CIRCLE_RADIUS = 10;

    CanvasPipeShape.prototype.paint = function (isActive) {
        var x, y;
        var points = this.options.points;
        var color = this.options.color;
        var width = this.options.width;
        var id = this.options._id;
        var rotation = 0;

        //弯头宽度 = 管道宽度 + 4px;
        if(width && Number(width)){
            this.CIRCLE_RADIUS = Number(width)/2 + 2;
        }

        this.destroy();

        this.line = new CanvasLine(this.layer, {
            id: id,
            name: 'pipe-line pipe-'+id,
            points: points,
            stroke: color ? color : 'rgba(0, 114, 201, .7)',
            strokeWidth: width ? width : 14,
            lineJoin: 'round'
        });

        for (var i = 0, len = points.length; i < len; i+=2) {
            // 添加圆形连接点
            this.joins.push(new CanvasCircle(this.layer, {
                id: id+'_'+i/2,
                name: 'pipe-join pipe-'+id,
                x: points[i] - this.CIRCLE_RADIUS,
                y: points[i+1] - this.CIRCLE_RADIUS,
                offsetX: -this.CIRCLE_RADIUS,
                offsetY: -this.CIRCLE_RADIUS,
                radius: this.CIRCLE_RADIUS,
                fill: '#aaa'
            }));

            // 添加方形管道入口/出口
            if (i - 2 > -1) {
                rotation = Math.atan2(points[i-1]-points[i+1], points[i-2]-points[i]) * GUtil.DEG;
                this.rects.push(new CanvasRect(this.layer, {
                    name: 'pipe-rect',
                    x: points[i],
                    y: points[i+1],
                    width: this.CIRCLE_RADIUS,
                    height: this.CIRCLE_RADIUS*2,
                    offsetY: this.CIRCLE_RADIUS,
                    rotation: rotation,
                    fill: '#aaa'
                }));
            }

            if (i + 2 < len) {
                rotation = Math.atan2(points[i+3]-points[i+1], points[i+2]-points[i]) * GUtil.DEG;
                this.rects.push(new CanvasRect(this.layer, {
                    name: 'pipe-rect',
                    x: points[i],
                    y: points[i+1],
                    width: this.CIRCLE_RADIUS,
                    height: this.CIRCLE_RADIUS*2,
                    offsetY: this.CIRCLE_RADIUS,
                    rotation: rotation,
                    fill: '#aaa'
                }));
            }
        }

        if (isActive) {
            this.addAnimation();
        } else {
            this.removeAnimation();
        }

        this.shapeInfo = GUtil.getPipeRect(this.options.points);
    };

    CanvasPipeShape.prototype.addAnimation = function () {
        var _this = this;
        var points = this.options.points;
        var distance, durations = [];

        // 添加动画
        for (var i = 0, len = points.length; i < len-2; i+=2) {
            this.moves.push(new CanvasCircle(this.layer, {
                name: 'pipe-animation',
                x: points[i] - this.CIRCLE_RADIUS/2,
                y: points[i+1] - this.CIRCLE_RADIUS/2,
                radius: this.CIRCLE_RADIUS/2,
                fill: '#ff0000',
                shadowForStrokeEnabled: false,
                shadowEnabled: false
            }));
            distance = GUtil.getDistance({
                x: points[i],
                y: points[i+1]
            }, {
                x: points[i+2],
                y: points[i+3]
            });
            durations.push(distance/this.animationOptions.speed*1000);
        }

        this.anim = new Konva.Animation(function(frame) {
            _this.moves.forEach(function (row, i) {
                var prograss = (frame.time % durations[i]) / durations[i];
                row.position({
                    x: prograss * (points[i*2+2]-points[i*2]) + points[i*2],
                    y: prograss * (points[i*2+3]-points[i*2+1]) + points[i*2+1]
                });
            });
        }, this.layer.stage.shape);

        this.anim.start();
    };

    CanvasPipeShape.prototype.removeAnimation = function () {
        this.moves.forEach(function (row) {
            row.shape.destroy();
        });
        this.moves = [];
        if (this.anim) this.anim.stop();
    };

    CanvasPipeShape.prototype.updatePoints = function (points) {
        this.options.points = points;
        this.paint();
    };

    CanvasPipeShape.prototype.toArray = function () {
        var shapes = [];
        shapes.push(this.line);
        shapes = shapes.concat(this.moves);
        shapes = shapes.concat(this.rects).concat(this.joins);
        return shapes;
    };

    CanvasPipeShape.prototype.id = function () {
        return this.options._id;
    };

    /** @override */
    CanvasPipeShape.prototype.getZIndex = function () {
        return this.line.getZIndex();
    };

    /** 获取父容器 */
    CanvasPipeShape.prototype.getParent = function () {
        return this.line.getParent();
    };

    /** @override */
    CanvasPipeShape.prototype.getAbsolutePosition = function () {
        var painter = this.layer.painter;
        return painter.inverseTransform({
            x: this.shapeInfo.xMin,
            y: this.shapeInfo.yMin
        });
    };

    CanvasPipeShape.prototype.destroy = function () {
        if (this.line) this.line.shape.destroy();
        this.joins.forEach(function (row) {
            row.shape.destroy();
        });
        this.rects.forEach(function (row) {
            row.shape.destroy();
        });
        this.moves.forEach(function (row) {
            row.shape.destroy();
        });
        this.moves = [];
        this.line = null;
        this.joins = [];
        this.rects = [];

        if (this.anim) this.anim.stop();
    };

    window.widgets = window.widgets || {};
    window.widgets.factory = window.widgets.factory  || {};
    window.widgets.factory.CanvasPipeShape = CanvasPipeShape;
} ( window.widgets.factory.CanvasLine,
    window.widgets.factory.CanvasCircle,
    window.widgets.factory.CanvasRect));