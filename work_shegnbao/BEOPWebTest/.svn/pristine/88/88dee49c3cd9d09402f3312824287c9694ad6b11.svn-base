var simpleHeat = (function () {

    function simpleHeat(canvas) {
        if (!(this instanceof simpleHeat)) {
            return new simpleHeat(canvas);
        }

        this._canvas = canvas = typeof canvas === 'string' ? document.getElementById(canvas) : canvas;
        this.canvsdpalette = undefined;
        this._ctx = canvas.getContext('2d');
        this._width = canvas.width;
        this._height = canvas.height;

        this._max = 1;
        this._data = [];
    }

    simpleHeat.prototype = {

        defaultRadius: 8,

        defaultGradient: {
            0: 'blue',
            0.25: 'cyan',
            0.5: 'lime',
            0.75: 'yellow',
            1.0: 'red'
        },

        data: function (data) {
            this._data = data;
            return this;
        },

        max: function (max) {
            this._max = max;
            return this;
        },

        min: function (min) {
            this._min = min;
            return this;
        },

        add: function (point) {
            this._data.push(point);
            return this;
        },

        clear: function () {
            this._data = [];
            return this;
        },

        gradient: function (grad) {
            // create a 256x1 gradient that we'll use to turn a grayscale heatmap into a colored one
            this.canvsdpalette = document.createElement('canvas');
            var ctx = this.canvsdpalette.getContext('2d');
            this.canvsdpalette.width = 1;
            this.canvsdpalette.height = 256;

            var gradient = ctx.createLinearGradient(0, 0, 0, 256);
            for (var i in grad) {
                gradient.addColorStop(i, grad[i]);
            }

            ctx.save();
            ctx.globalAlpha = 1;
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 1, 256);
            ctx.restore();

            this._grad = ctx.getImageData(0, 0, 1, 256).data;

            return this;
        },

        draw: function (minOpacity) {
            if (!this._grad) {
                this.gradient(this.defaultGradient);
            }

            var ctx = this._ctx, pAlpha;

            ctx.clearRect(0, 0, this._width, this._height);
            var a = 1 / (this._max - this._min), b = this._min / (this._min - this._max), c = (this._max - this._min) / 2;

            // draw a grayscale heatmap by putting a blurred circle at each data point
            for (var i = 0, len = this._data.length, p, temp; i < len; i++) {
                p = this._data[i], temp = p[2];
                if (temp == 0) continue;

                if (temp < this.max && temp > this._min) {
                    pAlpha = (c - Math.abs(temp - this._min - c)) / c;
                    pAlpha = pAlpha < 0.5 ? pAlpha * 0.4 : pAlpha * 0.9;
                } else {
                    pAlpha = 0.9;
                }

                var r = this.defaultRadius;
                var blur = blur || 30;

                // create a grayscale blurred circle image that we'll use for drawing points
                var circle = document.createElement('canvas'),
                    ctxCircle = circle.getContext('2d'),
                    r2 = this._r = r + blur;
                
                circle.width = circle.height = r2 * 2;

                ctxCircle.save();
                ctxCircle.shadowOffsetX = ctxCircle.shadowOffsetY = 200;
                ctxCircle.shadowBlur = blur;

                var intTemp = parseInt(temp), x = intTemp - this._min, j, color;
                j = x < 0 ? 0 : parseInt(256 * a * x) * 4;
                if (j >= 1024) j = 1020;
                
                ctxCircle.shadowColor = ctxCircle.fillStyle = 'rgb(' + this._grad[j] + ', ' + this._grad[j + 1] + ', ' + this._grad[j + 2] + ')';

                ctxCircle.beginPath();
                ctxCircle.arc(r2 - 200, r2 - 200, r, 0, Math.PI * 2, true);
                ctxCircle.closePath();
                ctxCircle.fill();
                ctxCircle.restore();

                ctx.globalAlpha = pAlpha;
                ctx.drawImage(circle, p[0] - this._r, p[1] - this._r);

                ctxCircle = null;
                circle = null;

                //测试用，显示温度
                //ctx.save();
                //ctx.globalAlpha = 1;

                //ctx.fillStyle = '#e55';
                //ctx.font = '10px Arial';
                //ctx.fillText(parseFloat(temp).toFixed(0), p[0], p[1]);
                //ctx.restore();
            }

            return this;
        },
    };

    return simpleHeat;
})();