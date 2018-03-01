'use strict';

if (typeof module !== 'undefined') module.exports = simpleheat;

function simpleheat(canvas) {
    if (!(this instanceof simpleheat)) return new simpleheat(canvas);

    this._canvas = canvas = typeof canvas === 'string' ? document.getElementById(canvas) : canvas;

    this._ctx = canvas.getContext('2d');
    this._width = canvas.width;
    this._height = canvas.height;
    this._ctx .rect(0, 0, this._width, this._height);
    this._ctx .fillStyle = "rgba(255,255,255,1)";
    this._ctx .fill();
    this._max = 27;
    this._data = [];
    this._scale=chroma.scale([ 'blue', 'cyan', 'yellow', 'red']).domain([0, 256]);
    this._fillStyle=null;
}

simpleheat.prototype = {

    defaultRadius: 50,

    defaultGradient: {
        0.2: 'blue',
        0.4: 'cyan',
        0.6: 'lime',
        0.8: 'yellow',
        1.0: 'red'
    },
/*    defaultGradient: {
        1.0: 'blue',
        0.8: 'cyan',
        0.6: 'lime',
        0.4: 'yellow',
        0.2: 'red'
    },*/

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

    radiusBlack: function (r, blur) {
        blur = blur === undefined ? 100 : blur;

        // create a grayscale blurred circle image that we'll use for drawing points
        var circleBlack = this._circleBlack = this._createCanvas(),
            ctx = circleBlack.getContext('2d'),
            r2 = this._r = r + blur;

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
    radiusWhite: function (r, blur) {
        blur = blur === undefined ? 100 : blur;

        // create a grayscale blurred circle image that we'll use for drawing points
        var circleWhite = this._circleWhite = this._createCanvas(),
            ctx = circleWhite.getContext('2d'),
            r2 = this._r = r + blur;

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

    resize: function () {
        this._width = this._canvas.width;
        this._height = this._canvas.height;
    },

    gradient: function (grad) {
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

    draw: function (minOpacity) {
        if (!this._circleBlack) this.radiusBlack(this.defaultRadius);
        if (!this._circleWhite) this.radiusWhite(this.defaultRadius);
        if (!this._grad) this.gradient(this.defaultGradient);

        var ctx = this._ctx;
        ctx.clearRect(0, 0, this._width, this._height);
        var col=parseInt((this._max-20)/10*255);     
        var tem=this._max/30;
        this._fillStyle='rgb('+col+','+col+','+col+')';        
        ctx .rect(0, 0, this._width, this._height);
        ctx.fillStyle = this._fillStyle;
        //ctx.globalAlpha=(this._max-20)/10;
        ctx .fill();
        // draw a grayscale heatmap by putting a blurred circle at each data point

        for (var i = 0, len = this._data.length, p; i < len; i++) {
            p = this._data[i];
            var temp=p[2]-this._max;
            ctx.globalAlpha = Math.max(Math.abs(temp / 10)*3, minOpacity === undefined ? 0.01 : minOpacity);
            if(temp>0){
                ctx.drawImage(this._circleWhite, p[0] - this._r, p[1] - this._r);
            }
            else{
                ctx.drawImage(this._circleBlack, p[0] - this._r, p[1] - this._r);
            }
        }

        // colorize the heatmap, using opacity value of each pixel to get the right color from our gradient
        var colored = ctx.getImageData(0, 0, this._width, this._height);
        //this._colorize(colored.data, this._grad);
        ctx.putImageData(colored, 0, 0);

        return this;
    },
    drawColor:function(minOpacity){
        if (!this._circleBlack) this.radiusBlack(this.defaultRadius);
        if (!this._circleWhite) this.radiusWhite(this.defaultRadius);
        if (!this._grad) this.gradient(this.defaultGradient);

        var ctx = this._ctx;
        ctx.clearRect(0, 0, this._width, this._height);
        var col=parseInt((this._max-20)/10*255);        
        var tem=this._max/30;
        this._fillStyle='rgb('+col+','+col+','+col+')';        
        ctx .rect(0, 0, this._width, this._height);
        ctx.fillStyle = this._fillStyle;
        //ctx.globalAlpha=(this._max-20)/10;
        ctx .fill();
        // draw a grayscale heatmap by putting a blurred circle at each data point

        for (var i = 0, len = this._data.length, p; i < len; i++) {
            p = this._data[i];
            var temp=p[2]-this._max;
            ctx.globalAlpha = Math.max(Math.abs(temp / 10)*5, minOpacity === undefined ? 0.01 : minOpacity);
            if(temp>0){
                ctx.drawImage(this._circleWhite, p[0] - this._r, p[1] - this._r);
            }
            else{
                ctx.drawImage(this._circleBlack, p[0] - this._r, p[1] - this._r);
            }
        }

        // colorize the heatmap, using opacity value of each pixel to get the right color from our gradient
        var colored = ctx.getImageData(0, 0, this._width, this._height);
        this._colorize(colored.data, this._grad);
        ctx.putImageData(colored, 0, 0);

        return this;
    },
    _colorize: function (pixels, gradient) {

/*        for (var i = 0, len = pixels.length, j; i < len; i += 4) {
            j = pixels[i + 3] * 4; // get gradient color from opacity value

            if (j) {
                pixels[i] = gradient[j];
                pixels[i + 1] = gradient[j + 1];
                pixels[i + 2] = gradient[j + 2];

            }
            else{
                pixels[i]=0;
                pixels[i + 1] = 0;
                pixels[i + 2] =255;
                pixels[i + 3] =255;

            }
        }*/
        for (var i = 0, len = pixels.length, j; i < len; i += 4){
            var j=parseInt(pixels[i+1]);
            pixels[i]=this._scale(j).rgb()[0];
            pixels[i+1]=this._scale(j).rgb()[1];
            pixels[i+2]=this._scale(j).rgb()[2];
        }
    },

    _createCanvas:function() {
        if (typeof document !== 'undefined') {
            return document.createElement('canvas');
        } else {
            // create a new canvas instance in node.js
            // the canvas class needs to have a default constructor without any parameter
            return new this._canvas.constructor();
        }
    }
};
function clearCircle(oc,x,y,r){
    for(var i=0; i< Math.round(Math.PI * r); i++){
        var angle = (i / Math.round(Math.PI * r)) * 360;
        oc.clearRect(x, y, Math.sin(angle * (Math.PI / 180)) * r , Math.cos(angle * (Math.PI / 180)) * r);
    }
};
