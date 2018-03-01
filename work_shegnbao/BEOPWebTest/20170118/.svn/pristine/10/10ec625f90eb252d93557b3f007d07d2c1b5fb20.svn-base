/// <reference path="../../core/sprites.js" />
/// <reference path="../../core/commonCanvas.js" />

var ModelText = (function () {
    function ModelText(id, painter, behaviors) {
        Sprite.call(this, id, painter, behaviors);
        if (!(this.painter && this.painter.print)) this.painter = { paint: this.paint };
        if (!(this.behaviors && this.behaviors[0] && this.behaviors[0].execute)) this.behaviors = [{ execute: this.executeAnimation }];

        this.value = undefined;
        this.font = undefined;
        this.color = undefined;
        this.fontSize = undefined;
        this.decimalplace = undefined;
        this.idCom = undefined;
        this.dictBindString = [];
        this.showMode = undefined;
    };

    ModelText.prototype = new Sprite();

    ModelText.prototype.paint = function (ctx) {
        ctx.save();
        var strFont;
        if (this.fontSize) strFont = "bold " + (this.fontSize < 20 ? 20 : this.fontSize) + "px ";
        strFont += this.font ? this.font : "微软雅黑";
        ctx.font = strFont;
        ctx.textBaseline = "middle";

        if (this.color) ctx.fillStyle = this.color;

        var str;
        if (!isNaN(this.value) && this.decimalplace != undefined) {
            str = parseFloat(this.value).toFixed(this.decimalplace);
            if (str == "NaN") str = "--";
        }
        else {
            str = this.value;
        }

        var index = parseInt(this.value);
        if (this.dictBindString[index]) str = this.dictBindString[index];

        if (this.width && ctx.measureText(str).width < this.width) {
            ctx.fillText(str, this.x, this.y);
        } else {
            StringTools.wordWrap(ctx, this.x, this.y - this.height / 2 + 15, this.width, str, null);
        }

        ctx.restore();
    }
    return ModelText;
})();