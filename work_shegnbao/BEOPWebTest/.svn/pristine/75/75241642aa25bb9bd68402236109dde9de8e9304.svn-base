(function (Layer) {

    function GCanvasStage(painter, options) {
        this.painter = painter;
        this.options = options || {};

        this.shape = null;
        this.children = [];

        this.init();
    }

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

    GCanvasStage.prototype.findOne = function (selector) {
        var id = selector.substr(1).trim();
        var rs = [];
        rs = this.children.filter(function (row) {
            return row.store.model._id() === id;
        });
        return rs.length > 0 ? rs[0] : null;
    };

    GCanvasStage.prototype.add = function (layer) {
        this.children.push(layer);
        this.shape.add(layer.shape);
    };

    GCanvasStage.prototype.draw = function () {
        this.shape.draw();
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
        return Layer.prototype.x.apply(this.shape, arguments);
    };

    GCanvasStage.prototype.y = function () {
        return Layer.prototype.y.apply(this.shape, arguments);
    };

    GCanvasStage.prototype.width = function () {
        return Layer.prototype.width.apply(this.shape, arguments);
    };

    GCanvasStage.prototype.height = function () {
        return Layer.prototype.height.apply(this.shape, arguments);
    };

    GCanvasStage.prototype.scale = function () {
        return Layer.prototype.scale.apply(this.shape, arguments);
    };

    window.GCanvasStage = GCanvasStage;

} (Konva.Layer))