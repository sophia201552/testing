/// <reference path="../../core/sprites.js" />

var ModelButton = (function () {
    function ModelButton(id, painter, behaviors) {
        Sprite.call(this, id, painter, behaviors);
        if (!(this.painter && this.painter.print)) this.painter = { paint: this.paint };
        if (!(this.behaviors && this.behaviors[0] && this.behaviors[0].execute)) this.behaviors = [];

        this.image = undefined;
        this.imageComm = undefined;
        this.imageOver = undefined;
        this.imageDown = undefined;
        this.imageDisable = undefined;
        this.url = undefined;
        this.idCom = undefined;
        this.text = undefined;
        this.link = undefined;
        this.description = undefined;

        this.idCom = undefined;
        this.setValue = undefined;

        this.status = undefined;
        this.history = undefined;
    };

    ModelButton.prototype = new Sprite();

    ModelButton.prototype.paint = function (ctx) {
        if (this.image !== undefined) {
            if (this.image.complete) {
                this.drawImage(this, ctx);
            } else {
                var _this = this;
                this.image.onload = function (e) {
                    _this.drawImage(_this, ctx)
                };
            }
        }
    },

    ModelButton.prototype.drawImage = function (_this, ctx) {
        ctx.save();
        if ((!_this.width) || (!_this.height)) {
            _this.width = _this.image.width;
            _this.height = _this.image.height;
        }

        ctx.drawImage(_this.image, _this.x, _this.y, _this.width, _this.height);

        if (_this.text) {
            ctx.fillStyle = "#333333";
            ctx.textBaseline = "middle";
            ctx.textAlign = "center";
            ctx.font = "bold 18px 微软雅黑";
            ctx.fillText(_this.text, _this.x + _this.width / 2, _this.y + _this.height / 2);
        }

        ctx.restore();
    },

    ModelButton.prototype.mouseEnter = function () {
        if (this.status == "down") return;
        this.image = this.imageOver;
    },

    ModelButton.prototype.mouseOut = function () {
        this.image = this.imageComm;
        this.status = undefined;
    }

    ModelButton.prototype.mouseDown = function () {
        this.image = this.imageDown;
        this.status = "down";
    }

    return ModelButton;
})();