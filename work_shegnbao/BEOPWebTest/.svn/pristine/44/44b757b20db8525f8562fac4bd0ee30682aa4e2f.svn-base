/////////////////////////////////
/// CanvasPipeShapeWithAnimation DEFINITION //
/////////////////////////////////
(function (CanvasPipeShape, CanvasCircle) {
    
    function CanvasPipeShapeWithAnimation() {
        CanvasPipeShape.apply(this, arguments);

        this.moves = [];
        this.lineLen = [];
        this.anim = null;
        this.animationOptions = {
            speed: 50
        }
    }

    CanvasPipeShapeWithAnimation.prototype = Object.create(CanvasPipeShape.prototype);

    CanvasPipeShapeWithAnimation.prototype.paint = function () {
        var _this = this;
        var points = this.options.points;
        var distance, durations = [];

        CanvasPipeShape.prototype.paint.call(this);

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

    CanvasPipeShapeWithAnimation.prototype.toArray = function () {
        var shapes = [];
        shapes.push(this.line);
        shapes = shapes.concat(this.moves);
        shapes = shapes.concat(this.rects).concat(this.joins);

        return shapes;
    };

    CanvasPipeShapeWithAnimation.prototype.destroy = function () {
        CanvasPipeShape.prototype.destroy.call(this);

        this.moves.forEach(function (row) {
            row.destroy();
        });
        if (this.anim) this.anim.stop();
    };

    // 覆盖
    window.widgets = window.widgets || {};
    window.widgets.factory = window.widgets.factory  || {};
    window.widgets.factory.CanvasPipeShape = CanvasPipeShapeWithAnimation;

} ( window.widgets.factory.CanvasPipeShape,
    window.widgets.factory.CanvasCircle ));