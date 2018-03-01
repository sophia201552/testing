(function (exports, SuperClass) {

    var drawCounter = null;

    function GCanvasStage(painter, model, options) {
        this.options = options || {};

        SuperClass.apply(this, arguments);
    }

    GCanvasStage.prototype = Object.create(SuperClass.prototype);
    GCanvasStage.prototype.constructor = GCanvasStage;

    /** override */
    GCanvasStage.prototype.init = function () {
        this.shape = new Konva.Layer({
            id: '__staticLayer',
            name: '__staticLayer',
            hitGraphEnabled: typeof this.options.hitGraphEnabled === 'undefined' ? true : this.options.hitGraphEnabled
        });
        this.shape.getCanvas()._canvas.style.zIndex = 2;
        this.painter.stage.add(this.shape);
    };

    GCanvasStage.prototype.getChildren = function () {
        return this.children;
    };

    GCanvasStage.prototype.add = function (shape) {
        SuperClass.prototype.add.apply(this, arguments);
        
        if (Object.prototype.toString.call(shape) !== '[object Array]') {
            shape = [shape];
        }

        this.shape.add.apply(this.shape, shape);
    };

    GCanvasStage.prototype.draw = function () {
        var _this = this;
        var drawMode = this.painter.drawMode();

        if (drawMode === 'manual') {
            return;
        }

        // 加载完成后不再使用缓冲，从而增强体验
        if (drawMode === 'normal') {
            this.shape.draw();
            return;
        }

        if (drawMode === 'batch') {
            // 加入缓冲机制
            if (drawCounter) {
                window.clearTimeout(drawCounter);
            }
            drawCounter = window.setTimeout(function () {
                window.clearTimeout(drawCounter);
                drawCounter = null;
                _this.shape.draw();
            }, 500);
            return;
        }
    };

    GCanvasStage.prototype.batchDraw = function () {
        var _this = this;
        // 加入缓冲机制
        if (drawCounter) {
            window.clearTimeout(drawCounter);
        }
        drawCounter = window.setTimeout(function () {
            window.clearTimeout(drawCounter);
            drawCounter = null;
            _this.shape.draw();
        }, 200);
    };

    GCanvasStage.prototype.getTransform = function () {
        return this.shape.getTransform();
    };

    GCanvasStage.prototype.offsetX = function (v) {
        if(v !== undefined) {
            return this.shape.offsetX(v);
        }
        return this.shape.offsetX();
    };

    GCanvasStage.prototype.offsetY = function (v) {
        if(v !== undefined) {
            return this.shape.offsetY(v);
        }
        return this.shape.offsetY();
    };

    GCanvasStage.prototype.x = function () {
        return Konva.Layer.prototype.x.apply(this.shape, arguments);
    };

    GCanvasStage.prototype.y = function () {
        return Konva.Layer.prototype.y.apply(this.shape, arguments);
    };

    GCanvasStage.prototype.width = function () {
        return Konva.Layer.prototype.width.apply(this.shape, arguments);
    };

    GCanvasStage.prototype.height = function () {
        return Konva.Layer.prototype.height.apply(this.shape, arguments);
    };

    GCanvasStage.prototype.scale = function () {
        return Konva.Layer.prototype.scale.apply(this.shape, arguments);
    };

    GCanvasStage.prototype.getType = function () {
        return 'Stage';
    };

    GCanvasStage.prototype.close = function () {
        SuperClass.prototype.close.call(this);
        this.shape.destroy();
    };

    window.GCanvasStage = GCanvasStage;

} (
    window,
    namespace('GStage')
));