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