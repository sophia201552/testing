/// <reference path="../../core/sprites.js" />

var ModelCheckbox = (function () {
    function ModelCheckbox(id, painter, behaviors) {
        Sprite.call(this, id, painter, behaviors);
        if (!(this.painter && this.painter.print)) this.painter = { paint: this.paint };
        if (!(this.behaviors && this.behaviors[0] && this.behaviors[0].execute)) this.behaviors = [];

        this.idCom = undefined;
        this.type = undefined;
        this.fontColor = undefined;
        this.fontSize = undefined;
        this.setValue = undefined;
        this.unsetValue = undefined;
        this.text = undefined;
        this.idGroup = undefined;
        this.expression = undefined;
    };

    ModelCheckbox.prototype = new Sprite();

    ModelCheckbox.prototype.paint = function (ctx) {

    },

    ModelCheckbox.prototype.update = function (_this, ctx) {

    }

    return ModelCheckbox;
})();