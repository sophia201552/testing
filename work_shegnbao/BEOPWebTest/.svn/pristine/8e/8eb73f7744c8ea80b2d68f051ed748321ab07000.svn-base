var ModelTempDistribution = (function () {

    var configMap = {
        heat_radius: 15,
        heat_blur: 40,
        heat_interval_y: 15,
        heat_interval_x: 20,
        TEMP_RANGE: {
            min: null,
            max: null
        }
    };

    function getHeatData(data) {
        var result = [];
        for (var n = 0, len = data.length; n < len; n++) {
            var item = data[n], temp = +item.value;
            result.push([item.x, item.y, temp ? temp : 0])
        }
        return result;
    }

    function getTwoPointDistance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow((Math.abs(x2) - Math.abs(x1)), 2) + Math.pow((Math.abs(y2) - Math.abs(y1)), 2));
    }

    function getArrayMin(arr) {
        return !arr ? null : Math.min.apply(null, arr);
    }

    function getArrayMax(arr) {
        return !arr ? null : Math.max.apply(null, arr);
    }

    function calcPointTemp(x, y, heatData) {
        if (!heatData || heatData.length === 0) {
            return
        }
        var temp = 0, distanceTotal = 0;
        for (var m = 0, mlen = heatData.length; m < mlen; m++) {
            var heatDataItem = heatData[m], distance = getTwoPointDistance(x, y, heatDataItem[0], heatDataItem[1]);
            if (distance === 0) {
                return (Number(heatDataItem[2]) - configMap.TEMP_RANGE.min) * configMap.heat_zoom_rate;
            }
            temp += (heatDataItem[2] && distance) ? heatDataItem[2] / distance : heatDataItem[2];
            distanceTotal += 1 / distance;
        }
        temp = temp / distanceTotal;
        //减去最小值
        return (Number(temp) - configMap.TEMP_RANGE.min);
    }

    function calcAllTempData(rawData, x, y, w, h) {
        var heatData = getHeatData(rawData),
            maxX = x + w,
            maxY = y + h,
            yInterval = configMap.heat_interval_y,
            xInterval = configMap.heat_interval_x,
            allTempPoint = [], rawTempArray, handledTempArray = [];

        rawTempArray = heatData.map(function (item) {
            return item[2];
        });
        if (!configMap.TEMP_RANGE.min) {
            configMap.TEMP_RANGE.min = getArrayMin(rawTempArray);
        }

        for (var m = x - 5 * xInterval; m < maxX + 5 * xInterval; m = m + xInterval) {
            for (var n = y - 5 * yInterval; n < maxY + 5 * yInterval; n = n + yInterval) {
                var temp = calcPointTemp(m, n, heatData);
                temp = Number(temp.toFixed(2));
                if (!temp || temp === 0 || temp < 0) {
                    continue;
                }
                allTempPoint.push([Number(m.toFixed(2)), Number(n.toFixed(2)) - y, temp]);
                handledTempArray.push(temp);
            }
        }
        if (!configMap.TEMP_RANGE.max) {
            configMap.TEMP_RANGE.max = getArrayMax(handledTempArray) + configMap.TEMP_RANGE.min;
        }
        return allTempPoint;
    }

    var simpleheat = (function () {

        function simpleheat(canvas) {
            // jshint newcap: false, validthis: true
            if (!(this instanceof simpleheat)) {
                return new simpleheat(canvas);
            }

            this._canvas = canvas = typeof canvas === 'string' ? document.getElementById(canvas) : canvas;

            this._ctx = canvas.getContext('2d');
            this._width = canvas.width;
            this._height = canvas.height;

            this._max = 1;
            this._data = [];
        }

        simpleheat.prototype = {

            defaultRadius: 25,

            defaultGradient: {
                0.5: 'blue',
                0.6: 'cyan',
                0.7: 'lime',
                0.8: 'yellow',
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

            add: function (point) {
                this._data.push(point);
                return this;
            },

            clear: function () {
                this._data = [];
                return this;
            },

            radius: function (r, blur) {
                blur = blur || 15;

                // create a grayscale blurred circle image that we'll use for drawing points
                var circle = this._circle = document.createElement('canvas'),
                    ctx = circle.getContext('2d'),
                    r2 = this._r = r + blur;

                circle.width = circle.height = r2 * 2;

                ctx.shadowOffsetX = ctx.shadowOffsetY = 200;
                ctx.shadowBlur = blur;
                ctx.shadowColor = 'black';

                ctx.beginPath();
                ctx.arc(r2 - 200, r2 - 200, r, 0, Math.PI * 2, true);
                ctx.closePath();
                ctx.fill();

                return this;
            },

            gradient: function (grad) {
                // create a 256x1 gradient that we'll use to turn a grayscale heatmap into a colored one
                var canvas = document.createElement('canvas'),
                    ctx = canvas.getContext('2d'),
                    gradient = ctx.createLinearGradient(0, 0, 0, 256);

                canvas.width = 1;
                canvas.height = 256;

                for (var i in grad) {
                    gradient.addColorStop(i, grad[i]);
                }

                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, 1, 256);

                this._grad = ctx.getImageData(0, 0, 1, 256).data;

                return this;
            },

            draw: function (minOpacity) {
                if (!this._circle) {
                    this.radius(this.defaultRadius);
                }
                if (!this._grad) {
                    this.gradient(this.defaultGradient);
                }

                var ctx = this._ctx;

                ctx.clearRect(0, 0, this._width, this._height);

                // draw a grayscale heatmap by putting a blurred circle at each data point
                for (var i = 0, len = this._data.length, p; i < len; i++) {
                    p = this._data[i];

                    ctx.globalAlpha = Math.max(p[2] / this._max, minOpacity === undefined ? 0.05 : minOpacity);
                    ctx.drawImage(this._circle, p[0] - this._r, p[1] - this._r);
                }

                // colorize the heatmap, using opacity value of each pixel to get the right color from our gradient
                var colored = ctx.getImageData(0, 0, this._width, this._height);
                this._colorize(colored.data, this._grad);
                ctx.putImageData(colored, 0, 0);

                return this;
            },

            _colorize: function (pixels, gradient) {
                for (var i = 3, len = pixels.length, j; i < len; i += 4) {
                    j = pixels[i] * 4; // get gradient color from opacity value

                    if (j) {
                        pixels[i - 3] = gradient[j];
                        pixels[i - 2] = gradient[j + 1];
                        pixels[i - 1] = gradient[j + 2];
                    }
                }
            }
        };

        return simpleheat;
    })();

    function ModelTempDistribution(id, painter, behaviors) {
        Sprite.call(this, id, painter, behaviors);
        if (!(this.painter && this.painter.print)) this.painter = {
            paint: this.paint
        };
        if (!(this.behaviors && this.behaviors[0] && this.behaviors[0].execute)) this.behaviors = [];

        this.canvasOffline = document.createElement("canvas");
        this.ctxOffline = this.canvasOffline.getContext("2d");

        this.data = [];
    };

    ModelTempDistribution.prototype = new Sprite();
    ModelTempDistribution.prototype.constructor = ModelTempDistribution;

    ModelTempDistribution.prototype.close = function () {
        this.canvasOffline = null;
        this.ctxOffline = null;
        this.data = [];
    };

    ModelTempDistribution.prototype.init = function () {
        this.canvasOffline.width = this.width;
        this.canvasOffline.height = this.height;
        this.loadColorSetting();
    };

    ModelTempDistribution.prototype.loadColorSetting = function () {
        var _this = this;
        this.loadColorSettingPromise = WebAPI.post('/admin/getColorSetting', {userId: AppConfig.userId}).done(function (result) {
            if (result.success) {
                _this.colorSettings = result.data;
            }
        })
    };

    ModelTempDistribution.prototype.setMaxMinTemp = function () {
        if (this.colorSettings) {
            for (var n = 0, length = this.colorSettings.length; n < length; n++) {
                if (this.colorSettings[n].type === 'max') {
                    configMap.TEMP_RANGE.max = +this.colorSettings[n].value;
                } else if (this.colorSettings[n].type === 'min') {
                    configMap.TEMP_RANGE.min = +this.colorSettings[n].value;
                }
            }
        }
    };

    ModelTempDistribution.prototype.paint = function (ctx) {
        ctx.rect(this.x, this.y, this.canvasOffline.width, this.canvasOffline.height);
        ctx.drawImage(this.canvasOffline, this.x, this.y);
    };

    ModelTempDistribution.prototype.update = function (updateData) {
        if (!updateData) {
            return;
        }
        if (!this.width || !this.height) {
            return;
        }
        for (var m = 0; m < this.data.length; m++) {
            for (var n = 0; n < updateData.length; n++) {
                if (this.data[m].idCom === updateData[n].name) {
                    this.data[m].value = updateData[n].value;
                    break;
                }
            }
        }
        this.renderTempDistribution();
    };

    ModelTempDistribution.prototype.renderTempDistribution = function () {
        var _this = this, heat;
        this.loadColorSettingPromise.done(function () {
            _this.setMaxMinTemp();
            var allHeatData = calcAllTempData(_this.data, _this.x, _this.y, _this.width, _this.height);
            if (!allHeatData || !allHeatData.length) {
                return;
            }
            heat = simpleheat(_this.ctxOffline.canvas).data(allHeatData);
            heat.radius(configMap.heat_radius, configMap.heat_blur);
            heat.max((configMap.TEMP_RANGE.max - configMap.TEMP_RANGE.min).toFixed(2));
            heat.draw();
        });
    };

    return ModelTempDistribution;
})();