(function (exports) {

    function GStage(painter) {
        this.painter = painter;

        this.shape = null;
        this.children = [];

        this.init();
    }

    GStage.prototype.init = function () {
        throw new Error('method "init" need to be implemented.');
    };

    GStage.prototype.add = function (layer) {};

    GStage.prototype.getShape = function () {
        return this.shape;
    };

    GStage.prototype.getPainter = function () {
        return this.painter;
    };

    GStage.prototype.close = function () {
        this.painter = null;
        this.children.forEach(function (row) {
            child.close();
        });
        this.children = null;
    };

    exports.GStage = GStage;
} (window));