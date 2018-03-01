'use strict';

if (typeof module !== 'undefined') module.exports = simpleheat;

function simpleheat(canvas, option) {
  if (!(this instanceof simpleheat)) return new simpleheat(canvas, option);

  this._canvas = canvas =
    typeof canvas === 'string' ? document.getElementById(canvas) : canvas;

  this._ctx = canvas.getContext('2d');
  this._width = canvas.width;
  this._height = canvas.height;
  this._ctx.rect(0, 0, this._width, this._height);
  this._ctx.fillStyle = 'rgba(255,255,255,1)';
  this._ctx.fill();
  this.max(option.max);
  this.min(option.min);
  this.radius(option.radius);
  this.setIsGradient(option.isGradient);
  this._data = [];
  this._colorArr = [];
  this._scale = {};
  this.gradientColor(option.gradient);
  this._fillStyle = null;
}

simpleheat.prototype = {
  radius: function(radius) {
    this._radius = radius == undefined ? 50 : Number(radius);
    return this;
  },

  data: function(data) {
    this._data = data;
    return this;
  },

  max: function(max) {
    this._max = max == undefined ? 40 : max;
    return this;
  },

  min: function(min) {
    this._min = min == undefined ? 10 : min;
    return this;
  },
  setIsGradient: function(isGradient) {
    this._isGradient = isGradient == undefined ? true : isGradient;
    return this;
  },

  gradientColor: function(gradientColor) {
    var _this = this;
    gradientColor =
      gradientColor ||
      '10,#3434ff;15,#35ffff;20,#36fe94;25,#6ff71c;30,#9fff39;35,#ffa922;40,#ff2323';
    var newGradientColor = '';
    gradientColor
      .split(';')
      .filter(function(v) {
        return v !== '';
      })
      .forEach(function(v, index) {
        var temp = v.split(',');
        var num = (Number(temp[0]) - _this._min) / (_this._max - _this._min);
        newGradientColor += num + ',' + temp[1].trim() + ';';
      });

    var values = newGradientColor.split(';').filter(function(v) {
      return v !== '';
    });
    var colorArr = [],
      defaultGradient = {},
      numArr = [];
    values.forEach(function(v) {
      var arr = v.split(',');
      colorArr.push(arr[1]);
      numArr.push(Number((Number(arr[0]) * 256).toFixed(0)));
      defaultGradient[arr[0]] = arr[1];
    });
    this._colorArr = colorArr;
    for (var i = 0, len = numArr.length - 1; i < len; i++) {
      var _scale = chroma
        .scale([colorArr[i], colorArr[i + 1]])
        .domain([numArr[i], numArr[i + 1]]);
      for (var l = numArr[i], len2 = numArr[i + 1]; l <= len2; l++) {
        this._scale[l] = _scale;
      }
    }
    this._gradient = defaultGradient;
    return this;
  },

  add: function(point) {
    this._data.push(point);
    return this;
  },

  clear: function() {
    this._data = [];
    return this;
  },

  radiusBlack: function(r, blur) {
    blur = blur === undefined ? 100 : blur;

    // create a grayscale blurred circle image that we'll use for drawing points
    var circleBlack = (this._circleBlack = this._createCanvas()),
      ctx = circleBlack.getContext('2d'),
      r2 = (this._r = r + blur);

    circleBlack.width = circleBlack.height = r2 * 2;

    ctx.shadowOffsetX = ctx.shadowOffsetY = r2 * 2;
    ctx.shadowBlur = blur;
    ctx.shadowColor = 'black';

    ctx.beginPath();
    ctx.arc(-r2, -r2, r, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();

    return this;
  },
  radiusWhite: function(r, blur) {
    blur = blur === undefined ? 100 : blur;

    // create a grayscale blurred circle image that we'll use for drawing points
    var circleWhite = (this._circleWhite = this._createCanvas()),
      ctx = circleWhite.getContext('2d'),
      r2 = (this._r = r + blur);

    circleWhite.width = circleWhite.height = r2 * 2;

    ctx.shadowOffsetX = ctx.shadowOffsetY = r2 * 2;
    ctx.shadowBlur = blur;
    ctx.shadowColor = 'white';

    ctx.beginPath();
    ctx.arc(-r2, -r2, r, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();

    return this;
  },

  resize: function() {
    this._width = this._canvas.width;
    this._height = this._canvas.height;
  },

  gradient: function(grad) {
    // create a 256x1 gradient that we'll use to turn a grayscale heatmap into a colored one

    var canvas = this._createCanvas(),
      ctx = canvas.getContext('2d'),
      gradient = ctx.createLinearGradient(0, 0, 0, 256);

    canvas.width = 1;
    canvas.height = 256;

    for (var i in grad) {
      gradient.addColorStop(+i, grad[i]);
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1, 256);
    this._grad = ctx.getImageData(0, 0, 1, 256).data;
    return this;
  },

  draw: function(minOpacity) {
    if (!this._circleBlack) this.radiusBlack(this._radius);
    if (!this._circleWhite) this.radiusWhite(this._radius);
    if (!this._grad) this.gradient(this._gradient);

    var ctx = this._ctx;
    ctx.clearRect(0, 0, this._width, this._height);
    var col = parseInt((this._max - 20) / 10 * 255);
    this._fillStyle = 'rgb(' + col + ',' + col + ',' + col + ')';
    ctx.rect(0, 0, this._width, this._height);
    ctx.fillStyle = this._fillStyle;
    ctx.fill();

    for (var i = 0, len = this._data.length, p; i < len; i++) {
      p = this._data[i];
      var temp = p[2] - this._max;
      ctx.globalAlpha = Math.max(
        Math.abs(temp / 10) * 3,
        minOpacity === undefined ? 0.01 : minOpacity
      );
      if (temp > 0) {
        ctx.drawImage(this._circleWhite, p[0] - this._r, p[1] - this._r);
      } else {
        ctx.drawImage(this._circleBlack, p[0] - this._r, p[1] - this._r);
      }
    }

    var colored = ctx.getImageData(0, 0, this._width, this._height);
    ctx.putImageData(colored, 0, 0);

    return this;
  },
  drawColor: function(minOpacity) {
    if (!this._circleBlack) this.radiusBlack(this._radius);
    if (!this._circleWhite) this.radiusWhite(this._radius);
    if (!this._grad) this.gradient(this._gradient);
    var dTemp = this._max - this._min;
    var avg = this._min + dTemp / 2;
    var ctx = this._ctx;
    ctx.clearRect(0, 0, this._width, this._height);
    var col = parseInt(0.5 * 255);
    this._fillStyle = 'rgb(' + col + ',' + col + ',' + col + ')';
    // this._fillStyle = this._colorArr[2];
    ctx.rect(0, 0, this._width, this._height);
    ctx.fillStyle = this._fillStyle;
    ctx.fill();

    for (var i = 0, len = this._data.length, p; i < len; i++) {
      p = this._data[i];
      var temp = p[2] - avg;
      if (temp > 0) {
        var value = temp / (this._max - avg);
        // ctx.globalAlpha = Math.max(0,Math.min(1,0.5*(1+value)));
        ctx.globalAlpha = Math.min(1, value);
        ctx.drawImage(this._circleWhite, p[0] - this._r, p[1] - this._r);
      } else {
        var value = -temp / (avg - this._min);
        // ctx.globalAlpha = Math.max(0,Math.min(1,0.5*(1+value)));
        ctx.globalAlpha = Math.min(1, value);
        ctx.drawImage(this._circleBlack, p[0] - this._r, p[1] - this._r);
      }
    }

    // colorize the heatmap, using opacity value of each pixel to get the right color from our gradient
    var colored = ctx.getImageData(0, 0, this._width, this._height);
    this._colorize(colored.data, this._grad);
    ctx.putImageData(colored, 0, 0);

    return this;
  },
  _colorize: function(pixels, gradient) {
    var temp = {};
    for (var i = 0, len = pixels.length, j; i < len; i += 4) {
      var j = parseInt(pixels[i + 1]);
      temp[j] = temp[j] || this._scale[j](j).rgb();
      var color = temp[j];
      pixels[i] = color[0];
      pixels[i + 1] = color[1];
      pixels[i + 2] = color[2];
    }
  },

  _createCanvas: function() {
    if (typeof document !== 'undefined') {
      return document.createElement('canvas');
    } else {
      // create a new canvas instance in node.js
      // the canvas class needs to have a default constructor without any parameter
      return new this._canvas.constructor();
    }
  }
};

function clearCircle(oc, x, y, r) {
  for (var i = 0; i < Math.round(Math.PI * r); i++) {
    var angle = i / Math.round(Math.PI * r) * 360;
    oc.clearRect(
      x,
      y,
      Math.sin(angle * (Math.PI / 180)) * r,
      Math.cos(angle * (Math.PI / 180)) * r
    );
  }
}