
/*
 * Konva JavaScript Framework v0.10.0
 * http://konvajs.github.io/
 * Licensed under the MIT or GPL Version 2 licenses.
 * Date: Tue Oct 27 2015
 *
 * Original work Copyright (C) 2011 - 2013 by Eric Rowell (KineticJS)
 * Modified work Copyright (C) 2014 - 2015 by Anton Lavrenov (Konva)
 *
 * @license
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
/**
 * @namespace Konva
 */
var Konva = {};
(function(root) {
    'use strict';
    var PI_OVER_180 = Math.PI / 180;

    Konva = {
        // public
        version: '0.10.0',

        // private
        stages: [],
        idCounter: 0,
        ids: {},
        names: {},
        shapes: {},
        listenClickTap: false,
        inDblClickWindow: false,

        // configurations
        enableTrace: false,
        traceArrMax: 100,
        dblClickWindow: 400,
        /**
         * Global pixel ratio configuration. KonvaJS automatically detect pixel ratio of current device.
         * But you may override such property, if you want to use your value.
         * @property pixelRatio
         * @default undefined
         * @memberof Konva
         * @example
         * Konva.pixelRatio = 1;
         */
        pixelRatio: undefined,
        /**
         * Drag distance property. If you start to drag a node you may want to wait until pointer is moved to some distance from start point,
         * only then start dragging.
         * @property dragDistance
         * @default 0
         * @memberof Konva
         * @example
         * Konva.dragDistance = 10;
         */
        dragDistance: 0,
        /**
         * Use degree values for angle properties. You may set this property to false if you want to use radiant values.
         * @property angleDeg
         * @default true
         * @memberof Konva
         * @example
         * node.rotation(45); // 45 degrees
         * Konva.angleDeg = false;
         * node.rotation(Math.PI / 2); // PI/2 radian
         */
        angleDeg: true,
         /**
         * Show different warnings about errors or wrong API usage
         * @property showWarnings
         * @default true
         * @memberof Konva
         * @example
         * Konva.showWarnings = false;
         */
        showWarnings: true,



        /**
         * @namespace Filters
         * @memberof Konva
         */
        Filters: {},

        /**
         * returns whether or not drag and drop is currently active
         * @method
         * @memberof Konva
         */
        isDragging: function() {
            var dd = Konva.DD;

            // if DD is not included with the build, then
            // drag and drop is not even possible
            if (dd) {
                return dd.isDragging;
            }
            return false;
        },
        /**
        * returns whether or not a drag and drop operation is ready, but may
        *  not necessarily have started
        * @method
        * @memberof Konva
        */
        isDragReady: function() {
            var dd = Konva.DD;

            // if DD is not included with the build, then
            // drag and drop is not even possible
            if (dd) {
                return !!dd.node;
            }
            return false;
        },
        _addId: function(node, id) {
            if(id !== undefined) {
                this.ids[id] = node;
            }
        },
        _removeId: function(id) {
            if(id !== undefined) {
                delete this.ids[id];
            }
        },
        _addName: function(node, name) {
            if(name) {
                if(!this.names[name]) {
                    this.names[name] = [];
                }
                this.names[name].push(node);
            }
        },
        _removeName: function(name, _id) {
            if(!name) {
                return;
            }
            var nodes = this.names[name];
            if(!nodes) {
                return;
            }
            for(var n = 0; n < nodes.length; n++) {
                var no = nodes[n];
                if(no._id === _id) {
                    nodes.splice(n, 1);
                }
            }
            if(nodes.length === 0) {
                delete this.names[name];
            }
        },
        getAngle: function(angle) {
            return this.angleDeg ? angle * PI_OVER_180 : angle;
        },
        _parseUA: function(userAgent) {
            var ua = userAgent.toLowerCase(),
                // jQuery UA regex
                match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
                /(webkit)[ \/]([\w.]+)/.exec( ua ) ||
                /(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
                /(msie) ([\w.]+)/.exec( ua ) ||
                ua.indexOf('compatible') < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
                [],

                // adding mobile flag as well
                mobile = !!(userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i)),
                ieMobile = !!(userAgent.match(/IEMobile/i));

            return {
                browser: match[ 1 ] || '',
                version: match[ 2 ] || '0',

                // adding mobile flab
                mobile: mobile,
                ieMobile: ieMobile  // If this is true (i.e., WP8), then Konva touch events are executed instead of equivalent Konva mouse events
            };
        },
        // user agent
        UA: undefined
    };

    Konva.UA = Konva._parseUA((root.navigator && root.navigator.userAgent) || '');

})(this);

// Uses Node, AMD or browser globals to create a module.

// If you want something that will work in other stricter CommonJS environments,
// or if you need to create a circular dependency, see commonJsStrict.js

// Defines a module "returnExports" that depends another module called "b".
// Note that the name of the module is implied by the file name. It is best
// if the file name and the exported global have matching names.

// If the 'b' module also uses this type of boilerplate, then
// in the browser, it will create a global .b that is used below.

// If you do not want to support the browser global path, then you
// can remove the `root` use and the passing `this` as the first arg to
// the top function.

// if the module has no dependencies, the above pattern can be simplified to
( function(root, factory) {
    'use strict';
    if( typeof exports === 'object') {
        var KonvaJS = factory();
        // runtime-check for browserify and nw.js (node-webkit)
        if(global.window && global.window.document) {
            Konva.document = global.window.document;
            Konva.window = global.window;
        } else {
            // Node. Does not work with strict CommonJS, but
            // only CommonJS-like enviroments that support module.exports,
            // like Node.
            var Canvas = require('canvas');
            var jsdom = require('jsdom').jsdom;

            Konva.document = jsdom('<!DOCTYPE html><html><head></head><body></body></html>');
            Konva.window = Konva.document.parentWindow;
            Konva.window.Image = Canvas.Image;
            Konva._nodeCanvas = Canvas;
        }

        Konva.root = root;
        module.exports = KonvaJS;
        return;
    }
    else if( typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(factory);
    }
    Konva.document = document;
    Konva.window = window;
    Konva.root = root;
}(this, function() {
    'use strict';
    // Just return a value to define the module export.
    // This example returns an object, but the module
    // can return a function as the exported value.
    return Konva;
}));

/*eslint-disable  eqeqeq, no-cond-assign, no-empty*/
(function() {
    'use strict';
    /**
     * Collection constructor.  Collection extends
     *  Array.  This class is used in conjunction with {@link Konva.Container#get}
     * @constructor
     * @memberof Konva
     */
    Konva.Collection = function() {
        var args = [].slice.call(arguments), length = args.length, i = 0;

        this.length = length;
        for(; i < length; i++) {
            this[i] = args[i];
        }
        return this;
    };
    Konva.Collection.prototype = [];
    /**
     * iterate through node array and run a function for each node.
     *  The node and index is passed into the function
     * @method
     * @memberof Konva.Collection.prototype
     * @param {Function} func
     * @example
     * // get all nodes with name foo inside layer, and set x to 10 for each
     * layer.get('.foo').each(function(shape, n) {
     *   shape.setX(10);
     * });
     */
    Konva.Collection.prototype.each = function(func) {
        for(var n = 0; n < this.length; n++) {
            func(this[n], n);
        }
    };
    /**
     * convert collection into an array
     * @method
     * @memberof Konva.Collection.prototype
     */
    Konva.Collection.prototype.toArray = function() {
        var arr = [],
            len = this.length,
            n;

        for(n = 0; n < len; n++) {
            arr.push(this[n]);
        }
        return arr;
    };
    /**
     * convert array into a collection
     * @method
     * @memberof Konva.Collection
     * @param {Array} arr
     */
    Konva.Collection.toCollection = function(arr) {
        var collection = new Konva.Collection(),
            len = arr.length,
            n;

        for(n = 0; n < len; n++) {
            collection.push(arr[n]);
        }
        return collection;
    };

    // map one method by it's name
    Konva.Collection._mapMethod = function(methodName) {
        Konva.Collection.prototype[methodName] = function() {
            var len = this.length,
                i;

            var args = [].slice.call(arguments);
            for(i = 0; i < len; i++) {
                this[i][methodName].apply(this[i], args);
            }

            return this;
        };
    };

    Konva.Collection.mapMethods = function(constructor) {
        var prot = constructor.prototype;
        for(var methodName in prot) {
            Konva.Collection._mapMethod(methodName);
        }
    };

    /*
    * Last updated November 2011
    * By Simon Sarris
    * www.simonsarris.com
    * sarris@acm.org
    *
    * Free to use and distribute at will
    * So long as you are nice to people, etc
    */

    /*
    * The usage of this class was inspired by some of the work done by a forked
    * project, KineticJS-Ext by Wappworks, which is based on Simon's Transform
    * class.  Modified by Eric Rowell
    */

    /**
     * Transform constructor
     * @constructor
     * @param {Array} [m] Optional six-element matrix
     * @memberof Konva
     */
    Konva.Transform = function(m) {
        this.m = (m && m.slice()) || [1, 0, 0, 1, 0, 0];
    };

    Konva.Transform.prototype = {
        /**
         * Copy Konva.Transform object
         * @method
         * @memberof Konva.Transform.prototype
         * @returns {Konva.Transform}
         */
        copy: function() {
            return new Konva.Transform(this.m);
        },
        /**
         * Transform point
         * @method
         * @memberof Konva.Transform.prototype
         * @param {Object} point 2D point(x, y)
         * @returns {Object} 2D point(x, y)
         */
        point: function(point) {
            var m = this.m;
            return {
                x: m[0] * point.x + m[2] * point.y + m[4],
                y: m[1] * point.x + m[3] * point.y + m[5]
            };
        },
        /**
         * Apply translation
         * @method
         * @memberof Konva.Transform.prototype
         * @param {Number} x
         * @param {Number} y
         * @returns {Konva.Transform}
         */
        translate: function(x, y) {
            this.m[4] += this.m[0] * x + this.m[2] * y;
            this.m[5] += this.m[1] * x + this.m[3] * y;
            return this;
        },
        /**
         * Apply scale
         * @method
         * @memberof Konva.Transform.prototype
         * @param {Number} sx
         * @param {Number} sy
         * @returns {Konva.Transform}
         */
        scale: function(sx, sy) {
            this.m[0] *= sx;
            this.m[1] *= sx;
            this.m[2] *= sy;
            this.m[3] *= sy;
            return this;
        },
        /**
         * Apply rotation
         * @method
         * @memberof Konva.Transform.prototype
         * @param {Number} rad  Angle in radians
         * @returns {Konva.Transform}
         */
        rotate: function(rad) {
            var c = Math.cos(rad);
            var s = Math.sin(rad);
            var m11 = this.m[0] * c + this.m[2] * s;
            var m12 = this.m[1] * c + this.m[3] * s;
            var m21 = this.m[0] * -s + this.m[2] * c;
            var m22 = this.m[1] * -s + this.m[3] * c;
            this.m[0] = m11;
            this.m[1] = m12;
            this.m[2] = m21;
            this.m[3] = m22;
            return this;
        },
        /**
         * Returns the translation
         * @method
         * @memberof Konva.Transform.prototype
         * @returns {Object} 2D point(x, y)
         */
        getTranslation: function() {
            return {
                x: this.m[4],
                y: this.m[5]
            };
        },
        /**
         * Apply skew
         * @method
         * @memberof Konva.Transform.prototype
         * @param {Number} sx
         * @param {Number} sy
         * @returns {Konva.Transform}
         */
        skew: function(sx, sy) {
            var m11 = this.m[0] + this.m[2] * sy;
            var m12 = this.m[1] + this.m[3] * sy;
            var m21 = this.m[2] + this.m[0] * sx;
            var m22 = this.m[3] + this.m[1] * sx;
            this.m[0] = m11;
            this.m[1] = m12;
            this.m[2] = m21;
            this.m[3] = m22;
            return this;
         },
        /**
         * Transform multiplication
         * @method
         * @memberof Konva.Transform.prototype
         * @param {Konva.Transform} matrix
         * @returns {Konva.Transform}
         */
        multiply: function(matrix) {
            var m11 = this.m[0] * matrix.m[0] + this.m[2] * matrix.m[1];
            var m12 = this.m[1] * matrix.m[0] + this.m[3] * matrix.m[1];

            var m21 = this.m[0] * matrix.m[2] + this.m[2] * matrix.m[3];
            var m22 = this.m[1] * matrix.m[2] + this.m[3] * matrix.m[3];

            var dx = this.m[0] * matrix.m[4] + this.m[2] * matrix.m[5] + this.m[4];
            var dy = this.m[1] * matrix.m[4] + this.m[3] * matrix.m[5] + this.m[5];

            this.m[0] = m11;
            this.m[1] = m12;
            this.m[2] = m21;
            this.m[3] = m22;
            this.m[4] = dx;
            this.m[5] = dy;
            return this;
        },
        /**
         * Invert the matrix
         * @method
         * @memberof Konva.Transform.prototype
         * @returns {Konva.Transform}
         */
        invert: function() {
            var d = 1 / (this.m[0] * this.m[3] - this.m[1] * this.m[2]);
            var m0 = this.m[3] * d;
            var m1 = -this.m[1] * d;
            var m2 = -this.m[2] * d;
            var m3 = this.m[0] * d;
            var m4 = d * (this.m[2] * this.m[5] - this.m[3] * this.m[4]);
            var m5 = d * (this.m[1] * this.m[4] - this.m[0] * this.m[5]);
            this.m[0] = m0;
            this.m[1] = m1;
            this.m[2] = m2;
            this.m[3] = m3;
            this.m[4] = m4;
            this.m[5] = m5;
            return this;
        },
        /**
         * return matrix
         * @method
         * @memberof Konva.Transform.prototype
         */
        getMatrix: function() {
            return this.m;
        },
        /**
         * set to absolute position via translation
         * @method
         * @memberof Konva.Transform.prototype
         * @returns {Konva.Transform}
         * @author ericdrowell
         */
        setAbsolutePosition: function(x, y) {
            var m0 = this.m[0],
                m1 = this.m[1],
                m2 = this.m[2],
                m3 = this.m[3],
                m4 = this.m[4],
                m5 = this.m[5],
                yt = ((m0 * (y - m5)) - (m1 * (x - m4))) / ((m0 * m3) - (m1 * m2)),
                xt = (x - m4 - (m2 * yt)) / m0;

            return this.translate(xt, yt);
        }
    };

    // CONSTANTS
    var CONTEXT_2D = '2d',
        OBJECT_ARRAY = '[object Array]',
        OBJECT_NUMBER = '[object Number]',
        OBJECT_STRING = '[object String]',
        PI_OVER_DEG180 = Math.PI / 180,
        DEG180_OVER_PI = 180 / Math.PI,
        HASH = '#',
        EMPTY_STRING = '',
        ZERO = '0',
        KONVA_WARNING = 'Konva warning: ',
        KONVA_ERROR = 'Konva error: ',
        RGB_PAREN = 'rgb(',
        COLORS = {
            aliceblue: [240, 248, 255],
            antiquewhite: [250, 235, 215],
            aqua: [0, 255, 255],
            aquamarine: [127, 255, 212],
            azure: [240, 255, 255],
            beige: [245, 245, 220],
            bisque: [255, 228, 196],
            black: [0, 0, 0],
            blanchedalmond: [255, 235, 205],
            blue: [0, 0, 255],
            blueviolet: [138, 43, 226],
            brown: [165, 42, 42],
            burlywood: [222, 184, 135],
            cadetblue: [95, 158, 160],
            chartreuse: [127, 255, 0],
            chocolate: [210, 105, 30],
            coral: [255, 127, 80],
            cornflowerblue: [100, 149, 237],
            cornsilk: [255, 248, 220],
            crimson: [220, 20, 60],
            cyan: [0, 255, 255],
            darkblue: [0, 0, 139],
            darkcyan: [0, 139, 139],
            darkgoldenrod: [184, 132, 11],
            darkgray: [169, 169, 169],
            darkgreen: [0, 100, 0],
            darkgrey: [169, 169, 169],
            darkkhaki: [189, 183, 107],
            darkmagenta: [139, 0, 139],
            darkolivegreen: [85, 107, 47],
            darkorange: [255, 140, 0],
            darkorchid: [153, 50, 204],
            darkred: [139, 0, 0],
            darksalmon: [233, 150, 122],
            darkseagreen: [143, 188, 143],
            darkslateblue: [72, 61, 139],
            darkslategray: [47, 79, 79],
            darkslategrey: [47, 79, 79],
            darkturquoise: [0, 206, 209],
            darkviolet: [148, 0, 211],
            deeppink: [255, 20, 147],
            deepskyblue: [0, 191, 255],
            dimgray: [105, 105, 105],
            dimgrey: [105, 105, 105],
            dodgerblue: [30, 144, 255],
            firebrick: [178, 34, 34],
            floralwhite: [255, 255, 240],
            forestgreen: [34, 139, 34],
            fuchsia: [255, 0, 255],
            gainsboro: [220, 220, 220],
            ghostwhite: [248, 248, 255],
            gold: [255, 215, 0],
            goldenrod: [218, 165, 32],
            gray: [128, 128, 128],
            green: [0, 128, 0],
            greenyellow: [173, 255, 47],
            grey: [128, 128, 128],
            honeydew: [240, 255, 240],
            hotpink: [255, 105, 180],
            indianred: [205, 92, 92],
            indigo: [75, 0, 130],
            ivory: [255, 255, 240],
            khaki: [240, 230, 140],
            lavender: [230, 230, 250],
            lavenderblush: [255, 240, 245],
            lawngreen: [124, 252, 0],
            lemonchiffon: [255, 250, 205],
            lightblue: [173, 216, 230],
            lightcoral: [240, 128, 128],
            lightcyan: [224, 255, 255],
            lightgoldenrodyellow: [250, 250, 210],
            lightgray: [211, 211, 211],
            lightgreen: [144, 238, 144],
            lightgrey: [211, 211, 211],
            lightpink: [255, 182, 193],
            lightsalmon: [255, 160, 122],
            lightseagreen: [32, 178, 170],
            lightskyblue: [135, 206, 250],
            lightslategray: [119, 136, 153],
            lightslategrey: [119, 136, 153],
            lightsteelblue: [176, 196, 222],
            lightyellow: [255, 255, 224],
            lime: [0, 255, 0],
            limegreen: [50, 205, 50],
            linen: [250, 240, 230],
            magenta: [255, 0, 255],
            maroon: [128, 0, 0],
            mediumaquamarine: [102, 205, 170],
            mediumblue: [0, 0, 205],
            mediumorchid: [186, 85, 211],
            mediumpurple: [147, 112, 219],
            mediumseagreen: [60, 179, 113],
            mediumslateblue: [123, 104, 238],
            mediumspringgreen: [0, 250, 154],
            mediumturquoise: [72, 209, 204],
            mediumvioletred: [199, 21, 133],
            midnightblue: [25, 25, 112],
            mintcream: [245, 255, 250],
            mistyrose: [255, 228, 225],
            moccasin: [255, 228, 181],
            navajowhite: [255, 222, 173],
            navy: [0, 0, 128],
            oldlace: [253, 245, 230],
            olive: [128, 128, 0],
            olivedrab: [107, 142, 35],
            orange: [255, 165, 0],
            orangered: [255, 69, 0],
            orchid: [218, 112, 214],
            palegoldenrod: [238, 232, 170],
            palegreen: [152, 251, 152],
            paleturquoise: [175, 238, 238],
            palevioletred: [219, 112, 147],
            papayawhip: [255, 239, 213],
            peachpuff: [255, 218, 185],
            peru: [205, 133, 63],
            pink: [255, 192, 203],
            plum: [221, 160, 203],
            powderblue: [176, 224, 230],
            purple: [128, 0, 128],
            rebeccapurple: [102, 51, 153],
            red: [255, 0, 0],
            rosybrown: [188, 143, 143],
            royalblue: [65, 105, 225],
            saddlebrown: [139, 69, 19],
            salmon: [250, 128, 114],
            sandybrown: [244, 164, 96],
            seagreen: [46, 139, 87],
            seashell: [255, 245, 238],
            sienna: [160, 82, 45],
            silver: [192, 192, 192],
            skyblue: [135, 206, 235],
            slateblue: [106, 90, 205],
            slategray: [119, 128, 144],
            slategrey: [119, 128, 144],
            snow: [255, 255, 250],
            springgreen: [0, 255, 127],
            steelblue: [70, 130, 180],
            tan: [210, 180, 140],
            teal: [0, 128, 128],
            thistle: [216, 191, 216],
            transparent: [255, 255, 255, 0],
            tomato: [255, 99, 71],
            turquoise: [64, 224, 208],
            violet: [238, 130, 238],
            wheat: [245, 222, 179],
            white: [255, 255, 255],
            whitesmoke: [245, 245, 245],
            yellow: [255, 255, 0],
            yellowgreen: [154, 205, 5]
        },

        RGB_REGEX = /rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\)/;

    /**
     * @namespace Util
     * @memberof Konva
     */
    Konva.Util = {
        /*
         * cherry-picked utilities from underscore.js
         */
        _isElement: function(obj) {
            return !!(obj && obj.nodeType == 1);
        },
        _isFunction: function(obj) {
            return !!(obj && obj.constructor && obj.call && obj.apply);
        },
        _isObject: function(obj) {
            return (!!obj && obj.constructor === Object);
        },
        _isArray: function(obj) {
            return Object.prototype.toString.call(obj) === OBJECT_ARRAY;
        },
        _isNumber: function(obj) {
            return Object.prototype.toString.call(obj) === OBJECT_NUMBER;
        },
        _isString: function(obj) {
            return Object.prototype.toString.call(obj) === OBJECT_STRING;
        },
        // Returns a function, that, when invoked, will only be triggered at most once
        // during a given window of time. Normally, the throttled function will run
        // as much as it can, without ever going more than once per `wait` duration;
        // but if you'd like to disable the execution on the leading edge, pass
        // `{leading: false}`. To disable execution on the trailing edge, ditto.
        _throttle: function(func, wait, opts) {
            var context, args, result;
            var timeout = null;
            var previous = 0;
            var options = opts || {};
            var later = function() {
                previous = options.leading === false ? 0 : new Date().getTime();
                timeout = null;
                result = func.apply(context, args);
                context = args = null;
            };
            return function() {
                var now = new Date().getTime();
                if (!previous && options.leading === false) {
                    previous = now;
                }
                var remaining = wait - (now - previous);
                context = this;
                args = arguments;
                if (remaining <= 0) {
                  clearTimeout(timeout);
                  timeout = null;
                  previous = now;
                  result = func.apply(context, args);
                  context = args = null;
                } else if (!timeout && options.trailing !== false) {
                  timeout = setTimeout(later, remaining);
                }
                return result;
            };
        },
        /*
         * other utils
         */
        _hasMethods: function(obj) {
            var names = [],
                key;

            for(key in obj) {
                if (!obj.hasOwnProperty(key)) {
                    continue;
                }
                if(this._isFunction(obj[key])) {
                    names.push(key);
                }
            }
            return names.length > 0;
        },
        createCanvasElement: function() {
            var canvas = Konva.document.createElement('canvas');
            // on some environments canvas.style is readonly
            try {
                canvas.style = canvas.style || {};
            } catch (e) {
            }
            return canvas;
        },
        isBrowser: function() {
            return (typeof exports !== 'object');
        },
        _isInDocument: function(el) {
            while(el = el.parentNode) {
                if(el == Konva.document) {
                    return true;
                }
            }
            return false;
        },
        _simplifyArray: function(arr) {
            var retArr = [],
                len = arr.length,
                util = Konva.Util,
                n, val;

            for (n = 0; n < len; n++) {
                val = arr[n];
                if (util._isNumber(val)) {
                    val = Math.round(val * 1000) / 1000;
                }
                else if (!util._isString(val)) {
                    val = val.toString();
                }

                retArr.push(val);
            }

            return retArr;
        },
        /*
         * arg can be an image object or image data
         */
        _getImage: function(arg, callback) {
            var imageObj, canvas;

            // if arg is null or undefined
            if(!arg) {
                callback(null);
            }

            // if arg is already an image object
            else if(this._isElement(arg)) {
                callback(arg);
            }

            // if arg is a string, then it's a data url
            else if(this._isString(arg)) {
                imageObj = new Konva.window.Image();
                imageObj.onload = function() {
                    callback(imageObj);
                };
                imageObj.src = arg;
            }

            //if arg is an object that contains the data property, it's an image object
            else if(arg.data) {
                canvas = Konva.Util.createCanvasElement();
                canvas.width = arg.width;
                canvas.height = arg.height;
                var _context = canvas.getContext(CONTEXT_2D);
                _context.putImageData(arg, 0, 0);
                this._getImage(canvas.toDataURL(), callback);
            }
            else {
                callback(null);
            }
        },
        _getRGBAString: function(obj) {
            var red = obj.red || 0,
                green = obj.green || 0,
                blue = obj.blue || 0,
                alpha = obj.alpha || 1;

            return [
                'rgba(',
                red,
                ',',
                green,
                ',',
                blue,
                ',',
                alpha,
                ')'
            ].join(EMPTY_STRING);
        },
        _rgbToHex: function(r, g, b) {
            return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        },
        _hexToRgb: function(hex) {
            hex = hex.replace(HASH, EMPTY_STRING);
            var bigint = parseInt(hex, 16);
            return {
                r: (bigint >> 16) & 255,
                g: (bigint >> 8) & 255,
                b: bigint & 255
            };
        },
        /**
         * return random hex color
         * @method
         * @memberof Konva.Util.prototype
         */
        getRandomColor: function() {
            var randColor = (Math.random() * 0xFFFFFF << 0).toString(16);
            while (randColor.length < 6) {
                randColor = ZERO + randColor;
            }
            return HASH + randColor;
        },
        /**
         * return value with default fallback
         * @method
         * @memberof Konva.Util.prototype
         */
        get: function(val, def) {
            if (val === undefined) {
                return def;
            }
            else {
                return val;
            }
        },
        /**
         * get RGB components of a color
         * @method
         * @memberof Konva.Util.prototype
         * @param {String} color
         * @example
         * // each of the following examples return {r:0, g:0, b:255}
         * var rgb = Konva.Util.getRGB('blue');
         * var rgb = Konva.Util.getRGB('#0000ff');
         * var rgb = Konva.Util.getRGB('rgb(0,0,255)');
         */
        getRGB: function(color) {
            var rgb;
            // color string
            if (color in COLORS) {
                rgb = COLORS[color];
                return {
                    r: rgb[0],
                    g: rgb[1],
                    b: rgb[2]
                };
            }
            // hex
            else if (color[0] === HASH) {
                return this._hexToRgb(color.substring(1));
            }
            // rgb string
            else if (color.substr(0, 4) === RGB_PAREN) {
                rgb = RGB_REGEX.exec(color.replace(/ /g, ''));
                return {
                    r: parseInt(rgb[1], 10),
                    g: parseInt(rgb[2], 10),
                    b: parseInt(rgb[3], 10)
                };
            }
            // default
            else {
                return {
                    r: 0,
                    g: 0,
                    b: 0
                };
            }
        },
        // convert any color string to RGBA object
        // from https://github.com/component/color-parser
        colorToRGBA: function(str) {
            str = str || 'black';
            return Konva.Util._namedColorToRBA(str)
                || Konva.Util._hex3ColorToRGBA(str)
                || Konva.Util._hex6ColorToRGBA(str)
                || Konva.Util._rgbColorToRGBA(str)
                || Konva.Util._rgbaColorToRGBA(str);
        },
        // Parse named css color. Like "green"
        _namedColorToRBA: function(str) {
            var c = COLORS[str.toLowerCase()];
            if (!c) {
                return null;
            }
            return {
                r: c[0],
                g: c[1],
                b: c[2],
                a: 1
            };
        },
        // Parse rgb(n, n, n)
        _rgbColorToRGBA: function(str) {
            if (str.indexOf('rgb(') === 0) {
                str = str.match(/rgb\(([^)]+)\)/)[1];
                var parts = str.split(/ *, */).map(Number);
                return {
                    r: parts[0],
                    g: parts[1],
                    b: parts[2],
                    a: 1
                };
            }
        },
        // Parse rgba(n, n, n, n)
        _rgbaColorToRGBA: function(str) {
            if (str.indexOf('rgba(') === 0) {
                str = str.match(/rgba\(([^)]+)\)/)[1];
                var parts = str.split(/ *, */).map(Number);
                return {
                    r: parts[0],
                    g: parts[1],
                    b: parts[2],
                    a: parts[3]
                };
            }

        },
        // Parse #nnnnnn
        _hex6ColorToRGBA: function(str) {
            if ((str[0] === '#') && (str.length === 7)) {
                return {
                    r: parseInt(str.slice(1, 3), 16),
                    g: parseInt(str.slice(3, 5), 16),
                    b: parseInt(str.slice(5, 7), 16),
                    a: 1
                };
            }
        },
        // Parse #nnn
        _hex3ColorToRGBA: function(str) {
            if ((str[0] === '#') && (str.length === 4)) {
                return {
                    r: parseInt(str[1] + str[1], 16),
                    g: parseInt(str[2] + str[2], 16),
                    b: parseInt(str[3] + str[3], 16),
                    a: 1
                };
            }
        },
        // o1 takes precedence over o2
        _merge: function(o1, o2) {
            var retObj = this._clone(o2);
            for(var key in o1) {
                if(this._isObject(o1[key])) {
                    retObj[key] = this._merge(o1[key], retObj[key]);
                }
                else {
                    retObj[key] = o1[key];
                }
            }
            return retObj;
        },
        cloneObject: function(obj) {
            var retObj = {};
            for(var key in obj) {
                if(this._isObject(obj[key])) {
                    retObj[key] = this.cloneObject(obj[key]);
                }
                else if (this._isArray(obj[key])) {
                    retObj[key] = this.cloneArray(obj[key]);
                } else {
                    retObj[key] = obj[key];
                }
            }
            return retObj;
        },
        cloneArray: function(arr) {
            return arr.slice(0);
        },
        _degToRad: function(deg) {
            return deg * PI_OVER_DEG180;
        },
        _radToDeg: function(rad) {
            return rad * DEG180_OVER_PI;
        },
        _capitalize: function(str) {
            return str.charAt(0).toUpperCase() + str.slice(1);
        },
        throw: function(str) {
            throw new Error(KONVA_ERROR + str);
        },
        error: function(str) {
          console.error(KONVA_ERROR + str);
        },
        warn: function(str) {
            /*
             * IE9 on Windows7 64bit will throw a JS error
             * if we don't use window.console in the conditional
             */
            if(Konva.root.console && console.warn && Konva.showWarnings) {
                console.warn(KONVA_WARNING + str);
            }
        },
        extend: function(child, parent) {
            function Ctor() {
                this.constructor = child;
            }
            Ctor.prototype = parent.prototype;
            var oldProto = child.prototype;
            child.prototype = new Ctor();
            for (var key in oldProto) {
                if (oldProto.hasOwnProperty(key)) {
                    child.prototype[key] = oldProto[key];
                }
            }
            child.__super__ = parent.prototype;
            // create reference to parent
            child.super = parent;
        },
        /**
         * adds methods to a constructor prototype
         * @method
         * @memberof Konva.Util.prototype
         * @param {Function} constructor
         * @param {Object} methods
         */
        addMethods: function(constructor, methods) {
            var key;

            for (key in methods) {
                constructor.prototype[key] = methods[key];
            }
        },
        _getControlPoints: function(x0, y0, x1, y1, x2, y2, t) {
            var d01 = Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2)),
                d12 = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)),
                fa = t * d01 / (d01 + d12),
                fb = t * d12 / (d01 + d12),
                p1x = x1 - fa * (x2 - x0),
                p1y = y1 - fa * (y2 - y0),
                p2x = x1 + fb * (x2 - x0),
                p2y = y1 + fb * (y2 - y0);

            return [p1x, p1y, p2x, p2y];
        },
        _expandPoints: function(p, tension) {
            var len = p.length,
                allPoints = [],
                n, cp;

            for (n = 2; n < len - 2; n += 2) {
                cp = Konva.Util._getControlPoints(p[n - 2], p[n - 1], p[n], p[n + 1], p[n + 2], p[n + 3], tension);
                allPoints.push(cp[0]);
                allPoints.push(cp[1]);
                allPoints.push(p[n]);
                allPoints.push(p[n + 1]);
                allPoints.push(cp[2]);
                allPoints.push(cp[3]);
            }

            return allPoints;
        },
        _removeLastLetter: function(str) {
            return str.substring(0, str.length - 1);
        },
        each: function(obj, func) {
            for (var key in obj) {
                func(key, obj[key]);
            }
        },
        _getProjectionToSegment: function(x1, y1, x2, y2, x3, y3) {
            var x, y, dist;

            var pd2 = (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);
            if(pd2 == 0) {
                x = x1;
                y = y1;
                dist = (x3 - x2) * (x3 - x2) + (y3 - y2) * (y3 - y2);
            } else {
                var u = ((x3 - x1) * (x2 - x1) + (y3 - y1) * (y2 - y1)) / pd2;
                if(u < 0) {
                    x = x1;
                    y = y1;
                    dist = (x1 - x3) * (x1 - x3) + (y1 - y3) * (y1 - y3);
                } else if (u > 1.0) {
                    x = x2;
                    y = y2;
                    dist = (x2 - x3) * (x2 - x3) + (y2 - y3) * (y2 - y3);
                } else {
                    x = x1 + u * (x2 - x1);
                    y = y1 + u * (y2 - y1);
                    dist = (x - x3) * (x - x3) + (y - y3) * (y - y3);
                }
            }
            return [x, y, dist];
        },
        // line as array of points.
        // line might be closed
        _getProjectionToLine: function(pt, line, isClosed) {
            var pc = Konva.Util.cloneObject(pt);
            var dist = Number.MAX_VALUE;
            line.forEach(function(p1, i) {
                if (!isClosed && i === line.length - 1) {
                    return;
                }
                var p2 = line[(i + 1) % line.length];
                var proj = Konva.Util._getProjectionToSegment(p1.x, p1.y, p2.x, p2.y, pt.x, pt.y);
                var px = proj[0], py = proj[1], pdist = proj[2];
                if (pdist < dist) {
                    pc.x = px;
                    pc.y = py;
                    dist = pdist;
                }
            });
            return pc;
        },
        _prepareArrayForTween: function(startArray, endArray, isClosed) {
            var n, start = [], end = [];
            if (startArray.length > endArray.length) {
                var temp = endArray;
                endArray = startArray;
                startArray = temp;
            }
            for (n = 0; n < startArray.length; n += 2) {
                start.push({
                    x: startArray[n],
                    y: startArray[n + 1]
                });
            }
            for (n = 0; n < endArray.length; n += 2) {
                end.push({
                    x: endArray[n],
                    y: endArray[n + 1]
                });
            }


            var newStart = [];
            end.forEach(function(point) {
                var pr = Konva.Util._getProjectionToLine(point, start, isClosed);
                newStart.push(pr.x);
                newStart.push(pr.y);
            });
            return newStart;
        }
    };
})();

(function() {
    'use strict';
    // calculate pixel ratio
    var canvas = Konva.Util.createCanvasElement(),
        context = canvas.getContext('2d'),
        _pixelRatio = (function(){
            var devicePixelRatio = Konva.window.devicePixelRatio || 1,
            backingStoreRatio = context.webkitBackingStorePixelRatio
                || context.mozBackingStorePixelRatio
                || context.msBackingStorePixelRatio
                || context.oBackingStorePixelRatio
                || context.backingStorePixelRatio
                || 1;
            return devicePixelRatio / backingStoreRatio;
        })();

    /**
     * Canvas Renderer constructor
     * @constructor
     * @abstract
     * @memberof Konva
     * @param {Object} config
     * @param {Number} config.width
     * @param {Number} config.height
     * @param {Number} config.pixelRatio KonvaJS automatically handles pixel ratio adjustments in order to render crisp drawings
     *  on all devices. Most desktops, low end tablets, and low end phones, have device pixel ratios
     *  of 1.  Some high end tablets and phones, like iPhones and iPads (not the mini) have a device pixel ratio
     *  of 2.  Some Macbook Pros, and iMacs also have a device pixel ratio of 2.  Some high end Android devices have pixel
     *  ratios of 2 or 3.  Some browsers like Firefox allow you to configure the pixel ratio of the viewport.  Unless otherwise
     *  specified, the pixel ratio will be defaulted to the actual device pixel ratio.  You can override the device pixel
     *  ratio for special situations, or, if you don't want the pixel ratio to be taken into account, you can set it to 1.
     */
    Konva.Canvas = function(config) {
        this.init(config);
    };

    Konva.Canvas.prototype = {
        init: function(config) {
            var conf = config || {};

            var pixelRatio = conf.pixelRatio || Konva.pixelRatio || _pixelRatio;

            this.pixelRatio = pixelRatio;
            this._canvas = Konva.Util.createCanvasElement();

            // set inline styles
            this._canvas.style.padding = 0;
            this._canvas.style.margin = 0;
            this._canvas.style.border = 0;
            this._canvas.style.background = 'transparent';
            this._canvas.style.position = 'absolute';
            this._canvas.style.top = 0;
            this._canvas.style.left = 0;
        },
        /**
         * get canvas context
         * @method
         * @memberof Konva.Canvas.prototype
         * @returns {CanvasContext} context
         */
        getContext: function() {
            return this.context;
        },
        /**
         * get pixel ratio
         * @method
         * @memberof Konva.Canvas.prototype
         * @returns {Number} pixel ratio
         */
        getPixelRatio: function() {
            return this.pixelRatio;
        },
        /**
         * get pixel ratio
         * @method
         * @memberof Konva.Canvas.prototype
         * @param {Number} pixelRatio KonvaJS automatically handles pixel ratio adustments in order to render crisp drawings
         *  on all devices. Most desktops, low end tablets, and low end phones, have device pixel ratios
         *  of 1.  Some high end tablets and phones, like iPhones and iPads have a device pixel ratio
         *  of 2.  Some Macbook Pros, and iMacs also have a device pixel ratio of 2.  Some high end Android devices have pixel
         *  ratios of 2 or 3.  Some browsers like Firefox allow you to configure the pixel ratio of the viewport.  Unless otherwise
         *  specificed, the pixel ratio will be defaulted to the actual device pixel ratio.  You can override the device pixel
         *  ratio for special situations, or, if you don't want the pixel ratio to be taken into account, you can set it to 1.
         */
        setPixelRatio: function(pixelRatio) {
            var previousRatio = this.pixelRatio;
            this.pixelRatio = pixelRatio;
            this.setSize(this.getWidth() / previousRatio, this.getHeight() / previousRatio);
        },
        /**
         * set width
         * @method
         * @memberof Konva.Canvas.prototype
         * @param {Number} width
         */
        setWidth: function(width) {
            // take into account pixel ratio
            this.width = this._canvas.width = width * this.pixelRatio;
            this._canvas.style.width = width + 'px';

            var pixelRatio = this.pixelRatio,
                _context = this.getContext()._context;
            _context.scale(pixelRatio, pixelRatio);
        },
        /**
         * set height
         * @method
         * @memberof Konva.Canvas.prototype
         * @param {Number} height
         */
        setHeight: function(height) {
            // take into account pixel ratio
            this.height = this._canvas.height = height * this.pixelRatio;
            this._canvas.style.height = height + 'px';
            var pixelRatio = this.pixelRatio,
                _context = this.getContext()._context;
            _context.scale(pixelRatio, pixelRatio);
        },
        /**
         * get width
         * @method
         * @memberof Konva.Canvas.prototype
         * @returns {Number} width
         */
        getWidth: function() {
            return this.width;
        },
        /**
         * get height
         * @method
         * @memberof Konva.Canvas.prototype
         * @returns {Number} height
         */
        getHeight: function() {
            return this.height;
        },
        /**
         * set size
         * @method
         * @memberof Konva.Canvas.prototype
         * @param {Number} width
         * @param {Number} height
         */
        setSize: function(width, height) {
            this.setWidth(width);
            this.setHeight(height);
        },
        /**
         * to data url
         * @method
         * @memberof Konva.Canvas.prototype
         * @param {String} mimeType
         * @param {Number} quality between 0 and 1 for jpg mime types
         * @returns {String} data url string
         */
        toDataURL: function(mimeType, quality) {
            try {
                // If this call fails (due to browser bug, like in Firefox 3.6),
                // then revert to previous no-parameter image/png behavior
                return this._canvas.toDataURL(mimeType, quality);
            }
            catch(e) {
                try {
                    return this._canvas.toDataURL();
                }
                catch(err) {
                    Konva.Util.warn('Unable to get data URL. ' + err.message);
                    return '';
                }
            }
        }
    };

    Konva.SceneCanvas = function(config) {
        var conf = config || {};
        var width = conf.width || 0,
            height = conf.height || 0;

        Konva.Canvas.call(this, conf);
        this.context = new Konva.SceneContext(this);
        this.setSize(width, height);
    };

    Konva.Util.extend(Konva.SceneCanvas, Konva.Canvas);

    Konva.HitCanvas = function(config) {
        var conf = config || {};
        var width = conf.width || 0,
            height = conf.height || 0;

        Konva.Canvas.call(this, conf);
        this.context = new Konva.HitContext(this);
        this.setSize(width, height);
        this.hitCanvas = true;
    };
    Konva.Util.extend(Konva.HitCanvas, Konva.Canvas);

})();

(function() {
    'use strict';
    var COMMA = ',',
        OPEN_PAREN = '(',
        CLOSE_PAREN = ')',
        OPEN_PAREN_BRACKET = '([',
        CLOSE_BRACKET_PAREN = '])',
        SEMICOLON = ';',
        DOUBLE_PAREN = '()',
        // EMPTY_STRING = '',
        EQUALS = '=',
        // SET = 'set',
        CONTEXT_METHODS = [
            'arc',
            'arcTo',
            'beginPath',
            'bezierCurveTo',
            'clearRect',
            'clip',
            'closePath',
            'createLinearGradient',
            'createPattern',
            'createRadialGradient',
            'drawImage',
            'fill',
            'fillText',
            'getImageData',
            'createImageData',
            'lineTo',
            'moveTo',
            'putImageData',
            'quadraticCurveTo',
            'rect',
            'restore',
            'rotate',
            'save',
            'scale',
            'setLineDash',
            'setTransform',
            'stroke',
            'strokeText',
            'transform',
            'translate'
        ];

    var CONTEXT_PROPERTIES = ['fillStyle', 'strokeStyle', 'shadowColor', 'shadowBlur', 'shadowOffsetX',
        'shadowOffsetY', 'lineCap', 'lineJoin', 'lineWidth', 'miterLimit', 'font', 'textAlign', 'textBaseline',
        'globalAlpha', 'globalCompositeOperation'];

    /**
     * Canvas Context constructor
     * @constructor
     * @abstract
     * @memberof Konva
     */
    Konva.Context = function(canvas) {
        this.init(canvas);
    };

    Konva.Context.prototype = {
        init: function(canvas) {
            this.canvas = canvas;
            this._context = canvas._canvas.getContext('2d');

            if (Konva.enableTrace) {
                this.traceArr = [];
                this._enableTrace();
            }
        },
        /**
         * fill shape
         * @method
         * @memberof Konva.Context.prototype
         * @param {Konva.Shape} shape
         */
        fillShape: function(shape) {
            if(shape.getFillEnabled()) {
                this._fill(shape);
            }
        },
        /**
         * stroke shape
         * @method
         * @memberof Konva.Context.prototype
         * @param {Konva.Shape} shape
         */
        strokeShape: function(shape) {
            if(shape.getStrokeEnabled()) {
                this._stroke(shape);
            }
        },
        /**
         * fill then stroke
         * @method
         * @memberof Konva.Context.prototype
         * @param {Konva.Shape} shape
         */
        fillStrokeShape: function(shape) {
            var fillEnabled = shape.getFillEnabled();
            if(fillEnabled) {
                this._fill(shape);
            }
            if(shape.getStrokeEnabled()) {
                this._stroke(shape);
            }
        },
        /**
         * get context trace if trace is enabled
         * @method
         * @memberof Konva.Context.prototype
         * @param {Boolean} relaxed if false, return strict context trace, which includes method names, method parameters
         *  properties, and property values.  If true, return relaxed context trace, which only returns method names and
         *  properites.
         * @returns {String}
         */
        getTrace: function(relaxed) {
            var traceArr = this.traceArr,
                len = traceArr.length,
                str = '',
                n, trace, method, args;

            for (n = 0; n < len; n++) {
                trace = traceArr[n];
                method = trace.method;

                // methods
                if (method) {
                    args = trace.args;
                    str += method;
                    if (relaxed) {
                        str += DOUBLE_PAREN;
                    }
                    else {
                        if (Konva.Util._isArray(args[0])) {
                            str += OPEN_PAREN_BRACKET + args.join(COMMA) + CLOSE_BRACKET_PAREN;
                        }
                        else {
                            str += OPEN_PAREN + args.join(COMMA) + CLOSE_PAREN;
                        }
                    }
                }
                // properties
                else {
                    str += trace.property;
                    if (!relaxed) {
                        str += EQUALS + trace.val;
                    }
                }

                str += SEMICOLON;
            }

            return str;
        },
        /**
         * clear trace if trace is enabled
         * @method
         * @memberof Konva.Context.prototype
         */
        clearTrace: function() {
            this.traceArr = [];
        },
        _trace: function(str) {
            var traceArr = this.traceArr,
                len;

            traceArr.push(str);
            len = traceArr.length;

            if (len >= Konva.traceArrMax) {
                traceArr.shift();
            }
        },
        /**
         * reset canvas context transform
         * @method
         * @memberof Konva.Context.prototype
         */
        reset: function() {
            var pixelRatio = this.getCanvas().getPixelRatio();
            this.setTransform(1 * pixelRatio, 0, 0, 1 * pixelRatio, 0, 0);
        },
        /**
         * get canvas
         * @method
         * @memberof Konva.Context.prototype
         * @returns {Konva.Canvas}
         */
        getCanvas: function() {
            return this.canvas;
        },
        /**
         * clear canvas
         * @method
         * @memberof Konva.Context.prototype
         * @param {Object} [bounds]
         * @param {Number} [bounds.x]
         * @param {Number} [bounds.y]
         * @param {Number} [bounds.width]
         * @param {Number} [bounds.height]
         */
        clear: function(bounds) {
            var canvas = this.getCanvas();

            if (bounds) {
                this.clearRect(bounds.x || 0, bounds.y || 0, bounds.width || 0, bounds.height || 0);
            }
            else {
                this.clearRect(0, 0, canvas.getWidth() / canvas.pixelRatio, canvas.getHeight() / canvas.pixelRatio);
            }
        },
        _applyLineCap: function(shape) {
            var lineCap = shape.getLineCap();
            if(lineCap) {
                this.setAttr('lineCap', lineCap);
            }
        },
        _applyOpacity: function(shape) {
            var absOpacity = shape.getAbsoluteOpacity();
            if(absOpacity !== 1) {
                this.setAttr('globalAlpha', absOpacity);
            }
        },
        _applyLineJoin: function(shape) {
            var lineJoin = shape.getLineJoin();
            if(lineJoin) {
                this.setAttr('lineJoin', lineJoin);
            }
        },
        setAttr: function(attr, val) {
            this._context[attr] = val;
        },

        // context pass through methods
        arc: function() {
            var a = arguments;
            this._context.arc(a[0], a[1], a[2], a[3], a[4], a[5]);
        },
        beginPath: function() {
            this._context.beginPath();
        },
        bezierCurveTo: function() {
            var a = arguments;
            this._context.bezierCurveTo(a[0], a[1], a[2], a[3], a[4], a[5]);
        },
        clearRect: function() {
            var a = arguments;
            this._context.clearRect(a[0], a[1], a[2], a[3]);
        },
        clip: function() {
            this._context.clip();
        },
        closePath: function() {
            this._context.closePath();
        },
        createImageData: function() {
            var a = arguments;
            if(a.length === 2) {
                return this._context.createImageData(a[0], a[1]);
            }
            else if(a.length === 1) {
                return this._context.createImageData(a[0]);
            }
        },
        createLinearGradient: function() {
            var a = arguments;
            return this._context.createLinearGradient(a[0], a[1], a[2], a[3]);
        },
        createPattern: function() {
            var a = arguments;
            return this._context.createPattern(a[0], a[1]);
        },
        createRadialGradient: function() {
            var a = arguments;
            return this._context.createRadialGradient(a[0], a[1], a[2], a[3], a[4], a[5]);
        },
        drawImage: function() {
            var a = arguments,
                _context = this._context;

            if(a.length === 3) {
                _context.drawImage(a[0], a[1], a[2]);
            }
            else if(a.length === 5) {
                _context.drawImage(a[0], a[1], a[2], a[3], a[4]);
            }
            else if(a.length === 9) {
                _context.drawImage(a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7], a[8]);
            }
        },
        isPointInPath: function(x, y) {
            return this._context.isPointInPath(x, y);
        },
        fill: function() {
            this._context.fill();
        },
        fillRect: function(x, y, width, height) {
            this._context.fillRect(x, y, width, height);
        },
        strokeRect: function(x, y, width, height) {
            this._context.strokeRect(x, y, width, height);
        },
        fillText: function() {
            var a = arguments;
            this._context.fillText(a[0], a[1], a[2]);
        },
        measureText: function(text) {
            return this._context.measureText(text);
        },
        getImageData: function() {
            var a = arguments;
            return this._context.getImageData(a[0], a[1], a[2], a[3]);
        },
        lineTo: function() {
            var a = arguments;
            this._context.lineTo(a[0], a[1]);
        },
        moveTo: function() {
            var a = arguments;
            this._context.moveTo(a[0], a[1]);
        },
        rect: function() {
            var a = arguments;
            this._context.rect(a[0], a[1], a[2], a[3]);
        },
        putImageData: function() {
            var a = arguments;
            this._context.putImageData(a[0], a[1], a[2]);
        },
        quadraticCurveTo: function() {
            var a = arguments;
            this._context.quadraticCurveTo(a[0], a[1], a[2], a[3]);
        },
        restore: function() {
            this._context.restore();
        },
        rotate: function() {
            var a = arguments;
            this._context.rotate(a[0]);
        },
        save: function() {
            this._context.save();
        },
        scale: function() {
            var a = arguments;
            this._context.scale(a[0], a[1]);
        },
        setLineDash: function() {
            var a = arguments,
                _context = this._context;

            // works for Chrome and IE11
            if(this._context.setLineDash) {
                _context.setLineDash(a[0]);
            }
            // verified that this works in firefox
            else if('mozDash' in _context) {
                _context.mozDash = a[0];
            }
            // does not currently work for Safari
            else if('webkitLineDash' in _context) {
                _context.webkitLineDash = a[0];
            }

            // no support for IE9 and IE10
        },
        getLineDash: function() {
            return this._context.getLineDash();
        },
        setTransform: function() {
            var a = arguments;
            this._context.setTransform(a[0], a[1], a[2], a[3], a[4], a[5]);
        },
        stroke: function() {
            this._context.stroke();
        },
        strokeText: function() {
            var a = arguments;
            this._context.strokeText(a[0], a[1], a[2]);
        },
        transform: function() {
            var a = arguments;
            this._context.transform(a[0], a[1], a[2], a[3], a[4], a[5]);
        },
        translate: function() {
            var a = arguments;
            this._context.translate(a[0], a[1]);
        },
        _enableTrace: function() {
            var that = this,
                len = CONTEXT_METHODS.length,
                _simplifyArray = Konva.Util._simplifyArray,
                origSetter = this.setAttr,
                n, args;

            // to prevent creating scope function at each loop
            var func = function(methodName) {
                    var origMethod = that[methodName],
                        ret;

                    that[methodName] = function() {
                        args = _simplifyArray(Array.prototype.slice.call(arguments, 0));
                        ret = origMethod.apply(that, arguments);

                        if (methodName === 'clearRect') {
                            args[2] = args[2] / that.canvas.getPixelRatio();
                            args[3] = args[3] / that.canvas.getPixelRatio();
                        }
                        that._trace({
                            method: methodName,
                            args: args
                        });

                        return ret;
                    };
            };
            // methods
            for (n = 0; n < len; n++) {
                func(CONTEXT_METHODS[n]);
            }

            // attrs
            that.setAttr = function() {
                origSetter.apply(that, arguments);
                that._trace({
                    property: arguments[0],
                    val: arguments[1]
                });
            };
        }
    };

    CONTEXT_PROPERTIES.forEach(function(prop) {
        Object.defineProperty(Konva.Context.prototype, prop, {
            get: function () {
                return this._context[prop];
            },
            set: function (val) {
                this._context[prop] = val;
            }
        });
    });

    Konva.SceneContext = function(canvas) {
        Konva.Context.call(this, canvas);
    };

    Konva.SceneContext.prototype = {
        _fillColor: function(shape) {
            var fill = shape.fill();

            this.setAttr('fillStyle', fill);
            shape._fillFunc(this);
        },
        _fillPattern: function(shape) {
            var fillPatternX = shape.getFillPatternX(),
                fillPatternY = shape.getFillPatternY(),
                fillPatternScale = shape.getFillPatternScale(),
                fillPatternRotation = Konva.getAngle(shape.getFillPatternRotation()),
                fillPatternOffset = shape.getFillPatternOffset();

            if(fillPatternX || fillPatternY) {
                this.translate(fillPatternX || 0, fillPatternY || 0);
            }
            if(fillPatternRotation) {
                this.rotate(fillPatternRotation);
            }
            if(fillPatternScale) {
                this.scale(fillPatternScale.x, fillPatternScale.y);
            }
            if(fillPatternOffset) {
                this.translate(-1 * fillPatternOffset.x, -1 * fillPatternOffset.y);
            }

            this.setAttr('fillStyle', this.createPattern(shape.getFillPatternImage(), shape.getFillPatternRepeat() || 'repeat'));
            this.fill();
        },
        _fillLinearGradient: function(shape) {
            var start = shape.getFillLinearGradientStartPoint(),
                end = shape.getFillLinearGradientEndPoint(),
                colorStops = shape.getFillLinearGradientColorStops(),
                grd = this.createLinearGradient(start.x, start.y, end.x, end.y);

            if (colorStops) {
                // build color stops
                for(var n = 0; n < colorStops.length; n += 2) {
                    grd.addColorStop(colorStops[n], colorStops[n + 1]);
                }
                this.setAttr('fillStyle', grd);
                shape._fillFunc(this);
            }
        },
        _fillRadialGradient: function(shape) {
            var start = shape.getFillRadialGradientStartPoint(),
                end = shape.getFillRadialGradientEndPoint(),
                startRadius = shape.getFillRadialGradientStartRadius(),
                endRadius = shape.getFillRadialGradientEndRadius(),
                colorStops = shape.getFillRadialGradientColorStops(),
                grd = this.createRadialGradient(start.x, start.y, startRadius, end.x, end.y, endRadius);

            // build color stops
            for(var n = 0; n < colorStops.length; n += 2) {
                grd.addColorStop(colorStops[n], colorStops[n + 1]);
            }
            this.setAttr('fillStyle', grd);
            this.fill();
        },
        _fill: function(shape) {
            var hasColor = shape.fill(),
                hasPattern = shape.getFillPatternImage(),
                hasLinearGradient = shape.getFillLinearGradientColorStops(),
                hasRadialGradient = shape.getFillRadialGradientColorStops(),
                fillPriority = shape.getFillPriority();

            // priority fills
            if(hasColor && fillPriority === 'color') {
                this._fillColor(shape);
            }
            else if(hasPattern && fillPriority === 'pattern') {
                this._fillPattern(shape);
            }
            else if(hasLinearGradient && fillPriority === 'linear-gradient') {
                this._fillLinearGradient(shape);
            }
            else if(hasRadialGradient && fillPriority === 'radial-gradient') {
                this._fillRadialGradient(shape);
            }
            // now just try and fill with whatever is available
            else if(hasColor) {
                this._fillColor(shape);
            }
            else if(hasPattern) {
                this._fillPattern(shape);
            }
            else if(hasLinearGradient) {
                this._fillLinearGradient(shape);
            }
            else if(hasRadialGradient) {
                this._fillRadialGradient(shape);
            }
        },
        _stroke: function(shape) {
            var dash = shape.dash(),
                // ignore strokeScaleEnabled for Text
                strokeScaleEnabled = (shape.getStrokeScaleEnabled() || (shape instanceof Konva.Text));

            if(shape.hasStroke()) {
                if (!strokeScaleEnabled) {
                    this.save();
                    this.setTransform(1, 0, 0, 1, 0, 0);
                }

                this._applyLineCap(shape);
                if(dash && shape.dashEnabled()) {
                    this.setLineDash(dash);
                }

                this.setAttr('lineWidth', shape.strokeWidth());
                this.setAttr('strokeStyle', shape.stroke());

                if (!shape.getShadowForStrokeEnabled()) {
                    this.setAttr('shadowColor', 'rgba(0,0,0,0)');
                }
                shape._strokeFunc(this);

                if (!strokeScaleEnabled) {
                    this.restore();
                }
            }
        },
        _applyShadow: function(shape) {
            var util = Konva.Util,
                color = util.get(shape.getShadowRGBA(), 'black'),
                blur = util.get(shape.getShadowBlur(), 5),
                offset = util.get(shape.getShadowOffset(), {
                    x: 0,
                    y: 0
                }),
                m = shape.getAbsoluteTransform().m,
                scaleX = m[0],
                scaleY = m[3];

            this.setAttr('shadowColor', color);
            this.setAttr('shadowBlur', blur);
            this.setAttr('shadowOffsetX', offset.x * scaleX);
            this.setAttr('shadowOffsetY', offset.y * scaleY);
        }
    };
    Konva.Util.extend(Konva.SceneContext, Konva.Context);

    Konva.HitContext = function(canvas) {
        Konva.Context.call(this, canvas);
    };

    Konva.HitContext.prototype = {
        _fill: function(shape) {
            this.save();
            this.setAttr('fillStyle', shape.colorKey);
            shape._fillFuncHit(this);
            this.restore();
        },
        _stroke: function(shape) {
            if(shape.hasStroke() && shape.strokeHitEnabled()) {
                // ignore strokeScaleEnabled for Text
                var strokeScaleEnabled = (shape.getStrokeScaleEnabled() || (shape instanceof Konva.Text));
                if (!strokeScaleEnabled) {
                    this.save();
                    this.setTransform(1, 0, 0, 1, 0, 0);
                }
                this._applyLineCap(shape);
                this.setAttr('lineWidth', shape.strokeWidth());
                this.setAttr('strokeStyle', shape.colorKey);
                shape._strokeFuncHit(this);
                if (!strokeScaleEnabled) {
                    this.restore();
                }
            }
        }
    };
    Konva.Util.extend(Konva.HitContext, Konva.Context);
})();

(function() {
    'use strict';
    // CONSTANTS
    var GET = 'get',
        SET = 'set';

    Konva.Factory = {
        addGetterSetter: function(constructor, attr, def, validator, after) {
            this.addGetter(constructor, attr, def);
            this.addSetter(constructor, attr, validator, after);
            this.addOverloadedGetterSetter(constructor, attr);
        },
        addGetter: function(constructor, attr, def) {
            var method = GET + Konva.Util._capitalize(attr);

            constructor.prototype[method] = function() {
                var val = this.attrs[attr];
                return val === undefined ? def : val;
            };
        },
        addSetter: function(constructor, attr, validator, after) {
            var method = SET + Konva.Util._capitalize(attr);

            constructor.prototype[method] = function(val) {
                if (validator) {
                    val = validator.call(this, val);
                }

                this._setAttr(attr, val);

                if (after) {
                    after.call(this);
                }

                return this;
            };
        },
        addComponentsGetterSetter: function(constructor, attr, components, validator, after) {
            var len = components.length,
                capitalize = Konva.Util._capitalize,
                getter = GET + capitalize(attr),
                setter = SET + capitalize(attr),
                n, component;

            // getter
            constructor.prototype[getter] = function() {
                var ret = {};

                for (n = 0; n < len; n++) {
                    component = components[n];
                    ret[component] = this.getAttr(attr + capitalize(component));
                }

                return ret;
            };

            // setter
            constructor.prototype[setter] = function(val) {
                var oldVal = this.attrs[attr],
                    key;

                if (validator) {
                    val = validator.call(this, val);
                }

                for (key in val) {
                    if (!val.hasOwnProperty(key)) {
                        continue;
                    }
                    this._setAttr(attr + capitalize(key), val[key]);
                }

                this._fireChangeEvent(attr, oldVal, val);

                if (after) {
                    after.call(this);
                }

                return this;
            };

            this.addOverloadedGetterSetter(constructor, attr);
        },
        addOverloadedGetterSetter: function(constructor, attr) {
            var capitalizedAttr = Konva.Util._capitalize(attr),
                setter = SET + capitalizedAttr,
                getter = GET + capitalizedAttr;

            constructor.prototype[attr] = function() {
                // setting
                if (arguments.length) {
                    this[setter](arguments[0]);
                    return this;
                }
                // getting
                return this[getter]();
            };
        },
        addDeprecatedGetterSetter: function(constructor, attr, def, validator) {
            var method = GET + Konva.Util._capitalize(attr);
            var message = attr + ' property is deprecated and will be removed soon. Look at Konva change log for more information.';
            constructor.prototype[method] = function() {
                Konva.Util.error(message);
                var val = this.attrs[attr];
                return val === undefined ? def : val;
            };
            this.addSetter(constructor, attr, validator, function() {
              Konva.Util.error(message);
            });
            this.addOverloadedGetterSetter(constructor, attr);
        },
        backCompat: function(constructor, methods) {
            Konva.Util.each(methods, function(oldMethodName, newMethodName) {
                var method = constructor.prototype[newMethodName];
                constructor.prototype[oldMethodName] = function(){
                    method.apply(this, arguments);
                    Konva.Util.error(oldMethodName + ' method is deprecated and will be removed soon. Use ' + newMethodName + ' instead');
                };
            });
        },
        afterSetFilter: function() {
            this._filterUpToDate = false;
        }
    };

    Konva.Validators = {
        /**
         * @return {number}
         */
        RGBComponent: function(val) {
            if (val > 255) {
                return 255;
            } else if (val < 0) {
                return 0;
            }
            return Math.round(val);
        },
        alphaComponent: function(val) {
            if (val > 1) {
                return 1;
            }
            // chrome does not honor alpha values of 0
            else if (val < 0.0001) {
                return 0.0001;
            }

            return val;
        }
    };
})();

(function(Konva) {
    'use strict';
    // CONSTANTS
    var ABSOLUTE_OPACITY = 'absoluteOpacity',
        ABSOLUTE_TRANSFORM = 'absoluteTransform',
        CHANGE = 'Change',
        CHILDREN = 'children',
        DOT = '.',
        EMPTY_STRING = '',
        GET = 'get',
        ID = 'id',
        KONVA = 'konva',
        LISTENING = 'listening',
        MOUSEENTER = 'mouseenter',
        MOUSELEAVE = 'mouseleave',
        NAME = 'name',
        SET = 'set',
        SHAPE = 'Shape',
        SPACE = ' ',
        STAGE = 'stage',
        TRANSFORM = 'transform',
        UPPER_STAGE = 'Stage',
        VISIBLE = 'visible',
        CLONE_BLACK_LIST = ['id'],

        TRANSFORM_CHANGE_STR = [
            'xChange.konva',
            'yChange.konva',
            'scaleXChange.konva',
            'scaleYChange.konva',
            'skewXChange.konva',
            'skewYChange.konva',
            'rotationChange.konva',
            'offsetXChange.konva',
            'offsetYChange.konva',
            'transformsEnabledChange.konva'
        ].join(SPACE);

    /**
     * Node constructor. Nodes are entities that can be transformed, layered,
     * and have bound events. The stage, layers, groups, and shapes all extend Node.
     * @constructor
     * @memberof Konva
     * @abstract
     * @param {Object} config
     * @param {Number} [config.x]
     * @param {Number} [config.y]
     * @param {Number} [config.width]
     * @param {Number} [config.height]
     * @param {Boolean} [config.visible]
     * @param {Boolean} [config.listening] whether or not the node is listening for events
     * @param {String} [config.id] unique id
     * @param {String} [config.name] non-unique name
     * @param {Number} [config.opacity] determines node opacity.  Can be any number between 0 and 1
     * @param {Object} [config.scale] set scale
     * @param {Number} [config.scaleX] set scale x
     * @param {Number} [config.scaleY] set scale y
     * @param {Number} [config.rotation] rotation in degrees
     * @param {Object} [config.offset] offset from center point and rotation point
     * @param {Number} [config.offsetX] set offset x
     * @param {Number} [config.offsetY] set offset y
     * @param {Boolean} [config.draggable] makes the node draggable.  When stages are draggable, you can drag and drop
     *  the entire stage by dragging any portion of the stage
     * @param {Number} [config.dragDistance]
     * @param {Function} [config.dragBoundFunc]
     */
    Konva.Node = function(config) {
        this._init(config);
    };

    Konva.Util.addMethods(Konva.Node, {
        _init: function(config) {
            var that = this;
            this._id = Konva.idCounter++;
            this.eventListeners = {};
            this.attrs = {};
            this._cache = {};
            this._filterUpToDate = false;
            this.setAttrs(config);

            // event bindings for cache handling
            this.on(TRANSFORM_CHANGE_STR, function() {
                this._clearCache(TRANSFORM);
                that._clearSelfAndDescendantCache(ABSOLUTE_TRANSFORM);
            });
            this.on('visibleChange.konva', function() {
                that._clearSelfAndDescendantCache(VISIBLE);
            });
            this.on('listeningChange.konva', function() {
                that._clearSelfAndDescendantCache(LISTENING);
            });
            this.on('opacityChange.konva', function() {
                that._clearSelfAndDescendantCache(ABSOLUTE_OPACITY);
            });
        },
        _clearCache: function(attr){
            if (attr) {
                delete this._cache[attr];
            }
            else {
                this._cache = {};
            }
        },
        _getCache: function(attr, privateGetter){
            var cache = this._cache[attr];

            // if not cached, we need to set it using the private getter method.
            if (cache === undefined) {
                this._cache[attr] = privateGetter.call(this);
            }

            return this._cache[attr];
        },
        /*
         * when the logic for a cached result depends on ancestor propagation, use this
         * method to clear self and children cache
         */
        _clearSelfAndDescendantCache: function(attr) {
            this._clearCache(attr);

            if (this.children) {
                this.getChildren().each(function(node) {
                    node._clearSelfAndDescendantCache(attr);
                });
            }
        },
        /**
        * clear cached canvas
        * @method
        * @memberof Konva.Node.prototype
        * @returns {Konva.Node}
        * @example
        * node.clearCache();
        */
        clearCache: function() {
            delete this._cache.canvas;
            this._filterUpToDate = false;
            return this;
        },
        /**
        *  cache node to improve drawing performance, apply filters, or create more accurate
        *  hit regions. For all basic shapes size of cache canvas will be automatically detected.
        *  If you need to cache your custom `Konva.Shape` instance you have to pass shape's bounding box
        *  properties. Look at [link to demo page](link to demo page) for more information.
        * @method
        * @memberof Konva.Node.prototype
        * @param {Object} [config]
        * @param {Number} [config.x]
        * @param {Number} [config.y]
        * @param {Number} [config.width]
        * @param {Number} [config.height]
        * @param {Number} [config.offset]  increase canvas size by `offset` pixel in all directions.
        * @param {Boolean} [config.drawBorder] when set to true, a red border will be drawn around the cached
        *  region for debugging purposes
        * @returns {Konva.Node}
        * @example
        * // cache a shape with the x,y position of the bounding box at the center and
        * // the width and height of the bounding box equal to the width and height of
        * // the shape obtained from shape.width() and shape.height()
        * image.cache();
        *
        * // cache a node and define the bounding box position and size
        * node.cache({
        *   x: -30,
        *   y: -30,
        *   width: 100,
        *   height: 200
        * });
        *
        * // cache a node and draw a red border around the bounding box
        * // for debugging purposes
        * node.cache({
        *   x: -30,
        *   y: -30,
        *   width: 100,
        *   height: 200,
        *   offset : 10,
        *   drawBorder: true
        * });
        */
        cache: function(config) {
            var conf = config || {},
                rect = this.getClientRect(true),
                width = conf.width || rect.width,
                height = conf.height || rect.height,
                x = conf.x || rect.x,
                y = conf.y || rect.y,
                offset = conf.offset || 0,
                drawBorder = conf.drawBorder || false;

            if (!width || !height) {
                throw new Error('Width or height of caching configuration equals 0.');
            }

            width += offset * 2;
            height += offset * 2;

            x -= offset;
            y -= offset;


            var cachedSceneCanvas = new Konva.SceneCanvas({
                width: width,
                height: height
            }),
            cachedFilterCanvas = new Konva.SceneCanvas({
                width: width,
                height: height
            }),
            cachedHitCanvas = new Konva.HitCanvas({
                pixelRatio: 1,
                width: width,
                height: height
            }),
            sceneContext = cachedSceneCanvas.getContext(),
            hitContext = cachedHitCanvas.getContext();

            cachedHitCanvas.isCache = true;

            this.clearCache();

            sceneContext.save();
            hitContext.save();

            sceneContext.translate(-x, -y);
            hitContext.translate(-x, -y);

            this.drawScene(cachedSceneCanvas, this, true);
            this.drawHit(cachedHitCanvas, this, true);

            sceneContext.restore();
            hitContext.restore();

            // this will draw a red border around the cached box for
            // debugging purposes
            if (drawBorder) {
                sceneContext.save();
                sceneContext.beginPath();
                sceneContext.rect(0, 0, width, height);
                sceneContext.closePath();
                sceneContext.setAttr('strokeStyle', 'red');
                sceneContext.setAttr('lineWidth', 5);
                sceneContext.stroke();
                sceneContext.restore();
            }

            this._cache.canvas = {
                scene: cachedSceneCanvas,
                filter: cachedFilterCanvas,
                hit: cachedHitCanvas,
                x: x,
                y: y
            };

            return this;
        },
        /**
         * Return client rectangle {x, y, width, height} of node. This rectangle also include all styling (strokes, shadows, etc).
         * The rectangle position is relative to parent container.
         * @method
         * @memberof Konva.Node.prototype
         * @param {Boolean} [skipTransform] flag should we skip transformation to rectangle
         * @returns {Object} rect with {x, y, width, height} properties
         * @example
         * var rect = new Konva.Rect({
         *      width : 100,
         *      height : 100,
         *      x : 50,
         *      y : 50,
         *      strokeWidth : 4,
         *      stroke : 'black',
         *      offsetX : 50,
         *      scaleY : 2
         * });
         *
         * // get client rect without think off transformations (position, rotation, scale, offset, etc)
         * rect.getClientRect(true);
         * // returns {
         * //     x : -2,   // two pixels for stroke / 2
         * //     y : -2,
         * //     width : 104, // increased by 4 for stroke
         * //     height : 104
         * //}
         *
         * // get client rect with transformation applied
         * rect.getClientRect();
         * // returns Object {x: -2, y: 46, width: 104, height: 208}
         */
        getClientRect: function() {
            // abstract method
            // redefine in Container and Shape
            throw new Error('abstract "getClientRect" method call');
        },
        _transformedRect: function(rect) {
            var points = [
                {x: rect.x, y: rect.y},
                {x: rect.x + rect.width, y: rect.y},
                {x: rect.x + rect.width, y: rect.y + rect.height},
                {x: rect.x, y: rect.y + rect.height}
            ];
            var minX, minY, maxX, maxY;
            var trans = this.getTransform();
            points.forEach(function(point) {
                var transformed = trans.point(point);
                if (minX === undefined) {
                    minX = maxX = transformed.x;
                    minY = maxY = transformed.y;
                }
                minX = Math.min(minX, transformed.x);
                minY = Math.min(minY, transformed.y);
                maxX = Math.max(maxX, transformed.x);
                maxY = Math.max(maxY, transformed.y);
            });
            return {
                x: Math.round(minX),
                y: Math.round(minY),
                width: Math.round(maxX - minX),
                height: Math.round(maxY - minY)
            };
        },
        _drawCachedSceneCanvas: function(context) {
            context.save();
            context._applyOpacity(this);
            context.translate(
                this._cache.canvas.x,
                this._cache.canvas.y
            );

            var cacheCanvas = this._getCachedSceneCanvas();
            var ratio = cacheCanvas.pixelRatio;

            context.drawImage(cacheCanvas._canvas, 0, 0, cacheCanvas.width / ratio, cacheCanvas.height / ratio);
            context.restore();
        },
        _drawCachedHitCanvas: function(context) {
            var cachedCanvas = this._cache.canvas,
                hitCanvas = cachedCanvas.hit;
            context.save();
            context.translate(
                this._cache.canvas.x,
                this._cache.canvas.y
            );
            context.drawImage(hitCanvas._canvas, 0, 0);
            context.restore();
        },
        _getCachedSceneCanvas: function() {
            var filters = this.filters(),
                cachedCanvas = this._cache.canvas,
                sceneCanvas = cachedCanvas.scene,
                filterCanvas = cachedCanvas.filter,
                filterContext = filterCanvas.getContext(),
                len, imageData, n, filter;

            if (filters) {
                if (!this._filterUpToDate) {
                    var ratio = sceneCanvas.pixelRatio;

                    try {
                        len = filters.length;
                        filterContext.clear();

                        // copy cached canvas onto filter context
                        filterContext.drawImage(sceneCanvas._canvas, 0, 0, sceneCanvas.getWidth() / ratio, sceneCanvas.getHeight() / ratio);
                        imageData = filterContext.getImageData(0, 0, filterCanvas.getWidth(), filterCanvas.getHeight());

                        // apply filters to filter context
                        for (n = 0; n < len; n++) {
                            filter = filters[n];
                            filter.call(this, imageData);
                            filterContext.putImageData(imageData, 0, 0);
                        }
                    }
                    catch(e) {
                        Konva.Util.warn('Unable to apply filter. ' + e.message);
                    }

                    this._filterUpToDate = true;
                }

                return filterCanvas;
            }
            return sceneCanvas;
        },
        /**
         * bind events to the node. KonvaJS supports mouseover, mousemove,
         *  mouseout, mouseenter, mouseleave, mousedown, mouseup, mousewheel, click, dblclick, touchstart, touchmove,
         *  touchend, tap, dbltap, dragstart, dragmove, and dragend events. The Konva Stage supports
         *  contentMouseover, contentMousemove, contentMouseout, contentMousedown, contentMouseup,
         *  contentClick, contentDblclick, contentTouchstart, contentTouchmove, contentTouchend, contentTap,
         *  and contentDblTap.  Pass in a string of events delimmited by a space to bind multiple events at once
         *  such as 'mousedown mouseup mousemove'. Include a namespace to bind an
         *  event by name such as 'click.foobar'.
         * @method
         * @memberof Konva.Node.prototype
         * @param {String} evtStr e.g. 'click', 'mousedown touchstart', 'mousedown.foo touchstart.foo'
         * @param {Function} handler The handler function is passed an event object
         * @returns {Konva.Node}
         * @example
         * // add click listener
         * node.on('click', function() {
         *   console.log('you clicked me!');
         * });
         *
         * // get the target node
         * node.on('click', function(evt) {
         *   console.log(evt.target);
         * });
         *
         * // stop event propagation
         * node.on('click', function(evt) {
         *   evt.cancelBubble = true;
         * });
         *
         * // bind multiple listeners
         * node.on('click touchstart', function() {
         *   console.log('you clicked/touched me!');
         * });
         *
         * // namespace listener
         * node.on('click.foo', function() {
         *   console.log('you clicked/touched me!');
         * });
         *
         * // get the event type
         * node.on('click tap', function(evt) {
         *   var eventType = evt.type;
         * });
         *
         * // get native event object
         * node.on('click tap', function(evt) {
         *   var nativeEvent = evt.evt;
         * });
         *
         * // for change events, get the old and new val
         * node.on('xChange', function(evt) {
         *   var oldVal = evt.oldVal;
         *   var newVal = evt.newVal;
         * });
         */
        on: function(evtStr, handler) {
            var events = evtStr.split(SPACE),
                len = events.length,
                n, event, parts, baseEvent, name;

             /*
             * loop through types and attach event listeners to
             * each one.  eg. 'click mouseover.namespace mouseout'
             * will create three event bindings
             */
            for(n = 0; n < len; n++) {
                event = events[n];
                parts = event.split(DOT);
                baseEvent = parts[0];
                name = parts[1] || EMPTY_STRING;

                // create events array if it doesn't exist
                if(!this.eventListeners[baseEvent]) {
                    this.eventListeners[baseEvent] = [];
                }

                this.eventListeners[baseEvent].push({
                    name: name,
                    handler: handler
                });
            }

            return this;
        },
        /**
         * remove event bindings from the node. Pass in a string of
         *  event types delimmited by a space to remove multiple event
         *  bindings at once such as 'mousedown mouseup mousemove'.
         *  include a namespace to remove an event binding by name
         *  such as 'click.foobar'. If you only give a name like '.foobar',
         *  all events in that namespace will be removed.
         * @method
         * @memberof Konva.Node.prototype
         * @param {String} evtStr e.g. 'click', 'mousedown touchstart', '.foobar'
         * @returns {Konva.Node}
         * @example
         * // remove listener
         * node.off('click');
         *
         * // remove multiple listeners
         * node.off('click touchstart');
         *
         * // remove listener by name
         * node.off('click.foo');
         */
        off: function(evtStr) {
            var events = (evtStr || '').split(SPACE),
                len = events.length,
                n, t, event, parts, baseEvent, name;

            if (!evtStr) {
                // remove all events
                for(t in this.eventListeners) {
                    this._off(t);
                }
            }
            for(n = 0; n < len; n++) {
                event = events[n];
                parts = event.split(DOT);
                baseEvent = parts[0];
                name = parts[1];

                if(baseEvent) {
                    if(this.eventListeners[baseEvent]) {
                        this._off(baseEvent, name);
                    }
                }
                else {
                    for(t in this.eventListeners) {
                        this._off(t, name);
                    }
                }
            }
            return this;
        },
        // some event aliases for third party integration like HammerJS
        dispatchEvent: function(evt) {
            var e = {
              target: this,
              type: evt.type,
              evt: evt
            };
            this.fire(evt.type, e);
        },
        addEventListener: function(type, handler) {
            // we have to pass native event to handler
            this.on(type, function(evt){
                handler.call(this, evt.evt);
            });
        },
        removeEventListener: function(type) {
            this.off(type);
        },
        /**
         * remove self from parent, but don't destroy
         * @method
         * @memberof Konva.Node.prototype
         * @returns {Konva.Node}
         * @example
         * node.remove();
         */
        remove: function() {
            var parent = this.getParent();

            if(parent && parent.children) {
                parent.children.splice(this.index, 1);
                parent._setChildrenIndices();
                delete this.parent;
            }

            // every cached attr that is calculated via node tree
            // traversal must be cleared when removing a node
            this._clearSelfAndDescendantCache(STAGE);
            this._clearSelfAndDescendantCache(ABSOLUTE_TRANSFORM);
            this._clearSelfAndDescendantCache(VISIBLE);
            this._clearSelfAndDescendantCache(LISTENING);
            this._clearSelfAndDescendantCache(ABSOLUTE_OPACITY);

            return this;
        },
        /**
         * remove and destroy self
         * @method
         * @memberof Konva.Node.prototype
         * @example
         * node.destroy();
         */
        destroy: function() {
            // remove from ids and names hashes
            Konva._removeId(this.getId());
            Konva._removeName(this.getName(), this._id);

            this.remove();
        },
        /**
         * get attr
         * @method
         * @memberof Konva.Node.prototype
         * @param {String} attr
         * @returns {Integer|String|Object|Array}
         * @example
         * var x = node.getAttr('x');
         */
        getAttr: function(attr) {
            var method = GET + Konva.Util._capitalize(attr);
            if(Konva.Util._isFunction(this[method])) {
                return this[method]();
            }
            // otherwise get directly
            return this.attrs[attr];
        },
        /**
        * get ancestors
        * @method
        * @memberof Konva.Node.prototype
        * @returns {Konva.Collection}
        * @example
        * shape.getAncestors().each(function(node) {
        *   console.log(node.getId());
        * })
        */
        getAncestors: function() {
            var parent = this.getParent(),
                ancestors = new Konva.Collection();

            while (parent) {
                ancestors.push(parent);
                parent = parent.getParent();
            }

            return ancestors;
        },
        /**
         * get attrs object literal
         * @method
         * @memberof Konva.Node.prototype
         * @returns {Object}
         */
        getAttrs: function() {
            return this.attrs || {};
        },
        /**
         * set multiple attrs at once using an object literal
         * @method
         * @memberof Konva.Node.prototype
         * @param {Object} config object containing key value pairs
         * @returns {Konva.Node}
         * @example
         * node.setAttrs({
         *   x: 5,
         *   fill: 'red'
         * });
         */
        setAttrs: function(config) {
            var key, method;

            if(!config) {
                return this;
            }
            for(key in config) {
                if (key === CHILDREN) {
                    continue;
                }
                method = SET + Konva.Util._capitalize(key);
                // use setter if available
                if(Konva.Util._isFunction(this[method])) {
                    this[method](config[key]);
                }
                // otherwise set directly
                else {
                    this._setAttr(key, config[key]);
                }
            }
            return this;
        },
        /**
         * determine if node is listening for events by taking into account ancestors.
         *
         * Parent    | Self      | isListening
         * listening | listening |
         * ----------+-----------+------------
         * T         | T         | T
         * T         | F         | F
         * F         | T         | T
         * F         | F         | F
         * ----------+-----------+------------
         * T         | I         | T
         * F         | I         | F
         * I         | I         | T
         *
         * @method
         * @memberof Konva.Node.prototype
         * @returns {Boolean}
         */
        isListening: function() {
            return this._getCache(LISTENING, this._isListening);
        },
        _isListening: function() {
            var listening = this.getListening(),
                parent = this.getParent();

            // the following conditions are a simplification of the truth table above.
            // please modify carefully
            if (listening === 'inherit') {
                if (parent) {
                    return parent.isListening();
                }
                else {
                    return true;
                }
            }
            else {
                return listening;
            }
        },
        /**
         * determine if node is visible by taking into account ancestors.
         *
         * Parent    | Self      | isVisible
         * visible   | visible   |
         * ----------+-----------+------------
         * T         | T         | T
         * T         | F         | F
         * F         | T         | T
         * F         | F         | F
         * ----------+-----------+------------
         * T         | I         | T
         * F         | I         | F
         * I         | I         | T

         * @method
         * @memberof Konva.Node.prototype
         * @returns {Boolean}
         */
        isVisible: function() {
            return this._getCache(VISIBLE, this._isVisible);
        },
        _isVisible: function() {
            var visible = this.getVisible(),
                parent = this.getParent();

            // the following conditions are a simplification of the truth table above.
            // please modify carefully
            if (visible === 'inherit') {
                if (parent) {
                    return parent.isVisible();
                }
                else {
                    return true;
                }
            }
            else {
                return visible;
            }
        },
        /**
         * determine if listening is enabled by taking into account descendants.  If self or any children
         * have _isListeningEnabled set to true, then self also has listening enabled.
         * @method
         * @memberof Konva.Node.prototype
         * @returns {Boolean}
         */
        shouldDrawHit: function(canvas) {
            var layer = this.getLayer();
            return (canvas && canvas.isCache) || (layer && layer.hitGraphEnabled())
                && this.isListening() && this.isVisible();
        },
        /**
         * show node
         * @method
         * @memberof Konva.Node.prototype
         * @returns {Konva.Node}
         */
        show: function() {
            this.setVisible(true);
            return this;
        },
        /**
         * hide node.  Hidden nodes are no longer detectable
         * @method
         * @memberof Konva.Node.prototype
         * @returns {Konva.Node}
         */
        hide: function() {
            this.setVisible(false);
            return this;
        },
        /**
         * get zIndex relative to the node's siblings who share the same parent
         * @method
         * @memberof Konva.Node.prototype
         * @returns {Integer}
         */
        getZIndex: function() {
            return this.index || 0;
        },
        /**
         * get absolute z-index which takes into account sibling
         *  and ancestor indices
         * @method
         * @memberof Konva.Node.prototype
         * @returns {Integer}
         */
        getAbsoluteZIndex: function() {
            var depth = this.getDepth(),
                that = this,
                index = 0,
                nodes, len, n, child;

            function addChildren(children) {
                nodes = [];
                len = children.length;
                for(n = 0; n < len; n++) {
                    child = children[n];
                    index++;

                    if(child.nodeType !== SHAPE) {
                        nodes = nodes.concat(child.getChildren().toArray());
                    }

                    if(child._id === that._id) {
                        n = len;
                    }
                }

                if(nodes.length > 0 && nodes[0].getDepth() <= depth) {
                    addChildren(nodes);
                }
            }
            if(that.nodeType !== UPPER_STAGE) {
                addChildren(that.getStage().getChildren());
            }

            return index;
        },
        /**
         * get node depth in node tree.  Returns an integer.
         *  e.g. Stage depth will always be 0.  Layers will always be 1.  Groups and Shapes will always
         *  be >= 2
         * @method
         * @memberof Konva.Node.prototype
         * @returns {Integer}
         */
        getDepth: function() {
            var depth = 0,
                parent = this.parent;

            while(parent) {
                depth++;
                parent = parent.parent;
            }
            return depth;
        },
        setPosition: function(pos) {
            this.setX(pos.x);
            this.setY(pos.y);
            return this;
        },
        getPosition: function() {
            return {
                x: this.getX(),
                y: this.getY()
            };
        },
        /**
         * get absolute position relative to the top left corner of the stage container div
         * @method
         * @memberof Konva.Node.prototype
         * @returns {Object}
         */
        getAbsolutePosition: function() {
            var absoluteMatrix = this.getAbsoluteTransform().getMatrix(),
                absoluteTransform = new Konva.Transform(),
                offset = this.offset();

            // clone the matrix array
            absoluteTransform.m = absoluteMatrix.slice();
            absoluteTransform.translate(offset.x, offset.y);

            return absoluteTransform.getTranslation();
        },
        /**
         * set absolute position
         * @method
         * @memberof Konva.Node.prototype
         * @param {Object} pos
         * @param {Number} pos.x
         * @param {Number} pos.y
         * @returns {Konva.Node}
         */
        setAbsolutePosition: function(pos) {
            var origTrans = this._clearTransform(),
                it;

            // don't clear translation
            this.attrs.x = origTrans.x;
            this.attrs.y = origTrans.y;
            delete origTrans.x;
            delete origTrans.y;

            // unravel transform
            it = this.getAbsoluteTransform();

            it.invert();
            it.translate(pos.x, pos.y);
            pos = {
                x: this.attrs.x + it.getTranslation().x,
                y: this.attrs.y + it.getTranslation().y
            };

            this.setPosition({x: pos.x, y: pos.y});
            this._setTransform(origTrans);

            return this;
        },
        _setTransform: function(trans) {
            var key;

            for(key in trans) {
                this.attrs[key] = trans[key];
            }

            this._clearCache(TRANSFORM);
            this._clearSelfAndDescendantCache(ABSOLUTE_TRANSFORM);
        },
        _clearTransform: function() {
            var trans = {
                x: this.getX(),
                y: this.getY(),
                rotation: this.getRotation(),
                scaleX: this.getScaleX(),
                scaleY: this.getScaleY(),
                offsetX: this.getOffsetX(),
                offsetY: this.getOffsetY(),
                skewX: this.getSkewX(),
                skewY: this.getSkewY()
            };

            this.attrs.x = 0;
            this.attrs.y = 0;
            this.attrs.rotation = 0;
            this.attrs.scaleX = 1;
            this.attrs.scaleY = 1;
            this.attrs.offsetX = 0;
            this.attrs.offsetY = 0;
            this.attrs.skewX = 0;
            this.attrs.skewY = 0;

            this._clearCache(TRANSFORM);
            this._clearSelfAndDescendantCache(ABSOLUTE_TRANSFORM);

            // return original transform
            return trans;
        },
        /**
         * move node by an amount relative to its current position
         * @method
         * @memberof Konva.Node.prototype
         * @param {Object} change
         * @param {Number} change.x
         * @param {Number} change.y
         * @returns {Konva.Node}
         * @example
         * // move node in x direction by 1px and y direction by 2px
         * node.move({
         *   x: 1,
         *   y: 2)
         * });
         */
        move: function(change) {
            var changeX = change.x,
                changeY = change.y,
                x = this.getX(),
                y = this.getY();

            if(changeX !== undefined) {
                x += changeX;
            }

            if(changeY !== undefined) {
                y += changeY;
            }

            this.setPosition({x: x, y: y});
            return this;
        },
        _eachAncestorReverse: function(func, top) {
            var family = [],
                parent = this.getParent(),
                len, n;

            // if top node is defined, and this node is top node,
            // there's no need to build a family tree.  just execute
            // func with this because it will be the only node
            if (top && top._id === this._id) {
                func(this);
                return true;
            }

            family.unshift(this);

            while(parent && (!top || parent._id !== top._id)) {
                family.unshift(parent);
                parent = parent.parent;
            }

            len = family.length;
            for(n = 0; n < len; n++) {
                func(family[n]);
            }
        },
        /**
         * rotate node by an amount in degrees relative to its current rotation
         * @method
         * @memberof Konva.Node.prototype
         * @param {Number} theta
         * @returns {Konva.Node}
         */
        rotate: function(theta) {
            this.setRotation(this.getRotation() + theta);
            return this;
        },
        /**
         * move node to the top of its siblings
         * @method
         * @memberof Konva.Node.prototype
         * @returns {Boolean}
         */
        moveToTop: function() {
            if (!this.parent) {
                Konva.Util.warn('Node has no parent. moveToTop function is ignored.');
                return false;
            }
            var index = this.index;
            this.parent.children.splice(index, 1);
            this.parent.children.push(this);
            this.parent._setChildrenIndices();
            return true;
        },
        /**
         * move node up
         * @method
         * @memberof Konva.Node.prototype
         * @returns {Boolean} flag is moved or not
         */
        moveUp: function() {
            if (!this.parent) {
                Konva.Util.warn('Node has no parent. moveUp function is ignored.');
                return false;
            }
            var index = this.index,
                len = this.parent.getChildren().length;
            if(index < len - 1) {
                this.parent.children.splice(index, 1);
                this.parent.children.splice(index + 1, 0, this);
                this.parent._setChildrenIndices();
                return true;
            }
            return false;
        },
        /**
         * move node down
         * @method
         * @memberof Konva.Node.prototype
         * @returns {Boolean}
         */
        moveDown: function() {
            if (!this.parent) {
                Konva.Util.warn('Node has no parent. moveDown function is ignored.');
                return false;
            }
            var index = this.index;
            if(index > 0) {
                this.parent.children.splice(index, 1);
                this.parent.children.splice(index - 1, 0, this);
                this.parent._setChildrenIndices();
                return true;
            }
            return false;
        },
        /**
         * move node to the bottom of its siblings
         * @method
         * @memberof Konva.Node.prototype
         * @returns {Boolean}
         */
        moveToBottom: function() {
            if (!this.parent) {
                Konva.Util.warn('Node has no parent. moveToBottom function is ignored.');
                return false;
            }
            var index = this.index;
            if(index > 0) {
                this.parent.children.splice(index, 1);
                this.parent.children.unshift(this);
                this.parent._setChildrenIndices();
                return true;
            }
            return false;
        },
        /**
         * set zIndex relative to siblings
         * @method
         * @memberof Konva.Node.prototype
         * @param {Integer} zIndex
         * @returns {Konva.Node}
         */
        setZIndex: function(zIndex) {
            if (!this.parent) {
                Konva.Util.warn('Node has no parent. zIndex parameter is ignored.');
                return false;
            }
            var index = this.index;
            this.parent.children.splice(index, 1);
            this.parent.children.splice(zIndex, 0, this);
            this.parent._setChildrenIndices();
            return this;
        },
        /**
         * get absolute opacity
         * @method
         * @memberof Konva.Node.prototype
         * @returns {Number}
         */
        getAbsoluteOpacity: function() {
            return this._getCache(ABSOLUTE_OPACITY, this._getAbsoluteOpacity);
        },
        _getAbsoluteOpacity: function() {
            var absOpacity = this.getOpacity();
            if(this.getParent()) {
                absOpacity *= this.getParent().getAbsoluteOpacity();
            }
            return absOpacity;
        },
        /**
         * move node to another container
         * @method
         * @memberof Konva.Node.prototype
         * @param {Container} newContainer
         * @returns {Konva.Node}
         * @example
         * // move node from current layer into layer2
         * node.moveTo(layer2);
         */
        moveTo: function(newContainer) {
            // do nothing if new container is already parent
            if (this.getParent() !== newContainer) {
                this.remove();
                newContainer.add(this);
            }
            return this;
        },
        /**
         * convert Node into an object for serialization.  Returns an object.
         * @method
         * @memberof Konva.Node.prototype
         * @returns {Object}
         */
        toObject: function() {
            var obj = {},
                attrs = this.getAttrs(),
                key, val, getter, defaultValue;

            obj.attrs = {};

            for(key in attrs) {
                val = attrs[key];
                // serialize only attributes that are not function, image, DOM, or objects with methods
                if (Konva.Util._isFunction(val) || Konva.Util._isElement(val) ||
                    (Konva.Util._isObject(val) || Konva.Util._hasMethods(val))) {
                    continue;
                }
                getter = this[key];
                // remove attr value so that we can extract the default value from the getter
                delete attrs[key];
                defaultValue = getter ? getter.call(this) : null;
                // restore attr value
                attrs[key] = val;
                if (defaultValue !== val) {
                    obj.attrs[key] = val;
                }
            }

            obj.className = this.getClassName();
            return obj;
        },
        /**
         * convert Node into a JSON string.  Returns a JSON string.
         * @method
         * @memberof Konva.Node.prototype
         * @returns {String}}
         */
        toJSON: function() {
            return JSON.stringify(this.toObject());
        },
        /**
         * get parent container
         * @method
         * @memberof Konva.Node.prototype
         * @returns {Konva.Node}
         */
        getParent: function() {
            return this.parent;
        },
        /**
         * get layer ancestor
         * @method
         * @memberof Konva.Node.prototype
         * @returns {Konva.Layer}
         */
        getLayer: function() {
            var parent = this.getParent();
            return parent ? parent.getLayer() : null;
        },
        /**
         * get stage ancestor
         * @method
         * @memberof Konva.Node.prototype
         * @returns {Konva.Stage}
         */
        getStage: function() {
            return this._getCache(STAGE, this._getStage);
        },
        _getStage: function() {
            var parent = this.getParent();
            if(parent) {
                return parent.getStage();
            }
            else {
                return undefined;
            }
        },
        /**
         * fire event
         * @method
         * @memberof Konva.Node.prototype
         * @param {String} eventType event type.  can be a regular event, like click, mouseover, or mouseout, or it can be a custom event, like myCustomEvent
         * @param {Event} [evt] event object
         * @param {Boolean} [bubble] setting the value to false, or leaving it undefined, will result in the event
         *  not bubbling.  Setting the value to true will result in the event bubbling.
         * @returns {Konva.Node}
         * @example
         * // manually fire click event
         * node.fire('click');
         *
         * // fire custom event
         * node.fire('foo');
         *
         * // fire custom event with custom event object
         * node.fire('foo', {
         *   bar: 10
         * });
         *
         * // fire click event that bubbles
         * node.fire('click', null, true);
         */
        fire: function(eventType, evt, bubble) {
            // bubble
            if (bubble) {
                this._fireAndBubble(eventType, evt || {});
            }
            // no bubble
            else {
                this._fire(eventType, evt || {});
            }
            return this;
        },
        /**
         * get absolute transform of the node which takes into
         *  account its ancestor transforms
         * @method
         * @memberof Konva.Node.prototype
         * @returns {Konva.Transform}
         */
        getAbsoluteTransform: function(top) {
            // if using an argument, we can't cache the result.
            if (top) {
                return this._getAbsoluteTransform(top);
            }
            // if no argument, we can cache the result
            else {
                return this._getCache(ABSOLUTE_TRANSFORM, this._getAbsoluteTransform);
            }
        },
        _getAbsoluteTransform: function(top) {
            var at = new Konva.Transform(),
                transformsEnabled, trans;

            // start with stage and traverse downwards to self
            this._eachAncestorReverse(function(node) {
                transformsEnabled = node.transformsEnabled();
                trans = node.getTransform();

                if (transformsEnabled === 'all') {
                    at.multiply(trans);
                }
                else if (transformsEnabled === 'position') {
                    at.translate(node.x(), node.y());
                }
            }, top);
            return at;
        },
        /**
         * get transform of the node
         * @method
         * @memberof Konva.Node.prototype
         * @returns {Konva.Transform}
         */
        getTransform: function() {
            return this._getCache(TRANSFORM, this._getTransform);
        },
        _getTransform: function() {
            var m = new Konva.Transform(),
                x = this.getX(),
                y = this.getY(),
                rotation = Konva.getAngle(this.getRotation()),
                scaleX = this.getScaleX(),
                scaleY = this.getScaleY(),
                skewX = this.getSkewX(),
                skewY = this.getSkewY(),
                offsetX = this.getOffsetX(),
                offsetY = this.getOffsetY();

            if(x !== 0 || y !== 0) {
                m.translate(x, y);
            }
            if(rotation !== 0) {
                m.rotate(rotation);
            }
            if(skewX !== 0 || skewY !== 0) {
                m.skew(skewX, skewY);
            }
            if(scaleX !== 1 || scaleY !== 1) {
                m.scale(scaleX, scaleY);
            }
            if(offsetX !== 0 || offsetY !== 0) {
                m.translate(-1 * offsetX, -1 * offsetY);
            }

            return m;
        },
        /**
         * clone node.  Returns a new Node instance with identical attributes.  You can also override
         *  the node properties with an object literal, enabling you to use an existing node as a template
         *  for another node
         * @method
         * @memberof Konva.Node.prototype
         * @param {Object} obj override attrs
         * @returns {Konva.Node}
         * @example
         * // simple clone
         * var clone = node.clone();
         *
         * // clone a node and override the x position
         * var clone = rect.clone({
         *   x: 5
         * });
         */
        clone: function(obj) {
            // instantiate new node
            var attrs = Konva.Util.cloneObject(this.attrs),
                key, allListeners, len, n, listener;
            // filter black attrs
            for (var i in CLONE_BLACK_LIST) {
                var blockAttr = CLONE_BLACK_LIST[i];
                delete attrs[blockAttr];
            }
            // apply attr overrides
            for (key in obj) {
                attrs[key] = obj[key];
            }

            var node = new this.constructor(attrs);
            // copy over listeners
            for(key in this.eventListeners) {
                allListeners = this.eventListeners[key];
                len = allListeners.length;
                for(n = 0; n < len; n++) {
                    listener = allListeners[n];
                    /*
                     * don't include konva namespaced listeners because
                     *  these are generated by the constructors
                     */
                    if(listener.name.indexOf(KONVA) < 0) {
                        // if listeners array doesn't exist, then create it
                        if(!node.eventListeners[key]) {
                            node.eventListeners[key] = [];
                        }
                        node.eventListeners[key].push(listener);
                    }
                }
            }
            return node;
        },
        /**
         * Creates a composite data URL. If MIME type is not
         * specified, then "image/png" will result. For "image/jpeg", specify a quality
         * level as quality (range 0.0 - 1.0)
         * @method
         * @memberof Konva.Node.prototype
         * @param {Object} config
         * @param {String} [config.mimeType] can be "image/png" or "image/jpeg".
         *  "image/png" is the default
         * @param {Number} [config.x] x position of canvas section
         * @param {Number} [config.y] y position of canvas section
         * @param {Number} [config.width] width of canvas section
         * @param {Number} [config.height] height of canvas section
         * @param {Number} [config.quality] jpeg quality.  If using an "image/jpeg" mimeType,
         *  you can specify the quality from 0 to 1, where 0 is very poor quality and 1
         *  is very high quality
         * @paremt {Number} [config.pixelRatio] pixelRatio of ouput image url. Default is 1
         * @returns {String}
         */
        toDataURL: function(config) {
            config = config || {};

            var mimeType = config.mimeType || null,
                quality = config.quality || null,
                stage = this.getStage(),
                x = config.x || 0,
                y = config.y || 0,
                pixelRatio = config.pixelRatio || 1,
                canvas = new Konva.SceneCanvas({
                    width: config.width || this.getWidth() || (stage ? stage.getWidth() : 0),
                    height: config.height || this.getHeight() || (stage ? stage.getHeight() : 0),
                    pixelRatio: pixelRatio
                }),
                context = canvas.getContext();

            context.save();

            if(x || y) {
                context.translate(-1 * x, -1 * y);
            }

            this.drawScene(canvas);
            context.restore();

            return canvas.toDataURL(mimeType, quality);
        },
        /**
         * converts node into an image.  Since the toImage
         *  method is asynchronous, a callback is required.  toImage is most commonly used
         *  to cache complex drawings as an image so that they don't have to constantly be redrawn
         * @method
         * @memberof Konva.Node.prototype
         * @param {Object} config
         * @param {Function} config.callback function executed when the composite has completed
         * @param {String} [config.mimeType] can be "image/png" or "image/jpeg".
         *  "image/png" is the default
         * @param {Number} [config.x] x position of canvas section
         * @param {Number} [config.y] y position of canvas section
         * @param {Number} [config.width] width of canvas section
         * @param {Number} [config.height] height of canvas section
         * @param {Number} [config.quality] jpeg quality.  If using an "image/jpeg" mimeType,
         *  you can specify the quality from 0 to 1, where 0 is very poor quality and 1
         *  is very high quality
         * @paremt {Number} [config.pixelRatio] pixelRatio of ouput image.  Default is 1.
         * @example
         * var image = node.toImage({
         *   callback: function(img) {
         *     // do stuff with img
         *   }
         * });
         */
        toImage: function(config) {
            if (!config || !config.callback) {
                throw 'callback required for toImage method config argument';
            }
            Konva.Util._getImage(this.toDataURL(config), function(img) {
                config.callback(img);
            });
        },
        setSize: function(size) {
            this.setWidth(size.width);
            this.setHeight(size.height);
            return this;
        },
        getSize: function() {
            return {
                width: this.getWidth(),
                height: this.getHeight()
            };
        },
        getWidth: function() {
            return this.attrs.width || 0;
        },
        getHeight: function() {
            return this.attrs.height || 0;
        },
        /**
         * get class name, which may return Stage, Layer, Group, or shape class names like Rect, Circle, Text, etc.
         * @method
         * @memberof Konva.Node.prototype
         * @returns {String}
         */
        getClassName: function() {
            return this.className || this.nodeType;
        },
        /**
         * get the node type, which may return Stage, Layer, Group, or Node
         * @method
         * @memberof Konva.Node.prototype
         * @returns {String}
         */
        getType: function() {
            return this.nodeType;
        },
        getDragDistance: function() {
            // compare with undefined because we need to track 0 value
            if (this.attrs.dragDistance !== undefined) {
                return this.attrs.dragDistance;
            } else if (this.parent) {
                return this.parent.getDragDistance();
            } else {
                return Konva.dragDistance;
            }
        },
        _get: function(selector) {
            return this.className === selector || this.nodeType === selector ? [this] : [];
        },
        _off: function(type, name) {
            var evtListeners = this.eventListeners[type],
                i, evtName;

            for(i = 0; i < evtListeners.length; i++) {
                evtName = evtListeners[i].name;
                // the following two conditions must be true in order to remove a handler:
                // 1) the current event name cannot be konva unless the event name is konva
                //    this enables developers to force remove a konva specific listener for whatever reason
                // 2) an event name is not specified, or if one is specified, it matches the current event name
                if((evtName !== 'konva' || name === 'konva') && (!name || evtName === name)) {
                    evtListeners.splice(i, 1);
                    if(evtListeners.length === 0) {
                        delete this.eventListeners[type];
                        break;
                    }
                    i--;
                }
            }
        },
        _fireChangeEvent: function(attr, oldVal, newVal) {
            this._fire(attr + CHANGE, {
                oldVal: oldVal,
                newVal: newVal
            });
        },
        setId: function(id) {
            var oldId = this.getId();

            Konva._removeId(oldId);
            Konva._addId(this, id);
            this._setAttr(ID, id);
            return this;
        },
        setName: function(name) {
            var oldNames = (this.getName() || '').split(/\s/g);
            var newNames = (name || '').split(/\s/g);
            var subname, i;
            // remove all subnames
            for(i = 0; i < oldNames.length; i++) {
                subname = oldNames[i];
                if ((newNames.indexOf(subname)) === -1 && subname) {
                    Konva._removeName(subname, this._id);
                }
            }

            // add new names
            for(i = 0; i < newNames.length; i++) {
                subname = newNames[i];
                if ((oldNames.indexOf(subname) === -1) && subname) {
                    Konva._addName(this, subname);
                }
            }

            this._setAttr(NAME, name);
            return this;
        },
        // naming methods
        /**
         * add name to node
         * @method
         * @memberof Konva.Node.prototype
         * @param {String} name
         * @returns {Konva.Node}
         * @example
         * node.name('red');
         * node.addName('selected');
         * node.name(); // return 'red selected'
         */
        addName: function(name) {
            if (!this.hasName(name)) {
                var oldName = this.name();
                var newName = oldName ? (oldName + ' ' + name) : name;
                this.setName(newName);
            }
            return this;
        },
        /**
         * check is node has name
         * @method
         * @memberof Konva.Node.prototype
         * @param {String} name
         * @returns {Boolean}
         * @example
         * node.name('red');
         * node.hasName('red');   // return true
         * node.hasName('selected'); // return false
         */
        hasName: function(name) {
            var names = (this.name() || '').split(/\s/g);
            return names.indexOf(name) !== -1;
        },
        /**
         * remove name from node
         * @method
         * @memberof Konva.Node.prototype
         * @param {String} name
         * @returns {Konva.Node}
         * @example
         * node.name('red selected');
         * node.removeName('selected');
         * node.hasName('selected'); // return false
         * node.name(); // return 'red'
         */
        removeName: function(name) {
            var names = (this.name() || '').split(/\s/g);
            var index = names.indexOf(name);
            if (index !== -1) {
                names.splice(index, 1);
                this.setName(names.join(' '));
            }
        },
        /**
         * set attr
         * @method
         * @memberof Konva.Node.prototype
         * @param {String} attr
         * @param {*} val
         * @returns {Konva.Node}
         * @example
         * node.setAttr('x', 5);
         */
        setAttr: function(attr, val) {
            var method = SET + Konva.Util._capitalize(attr),
                func = this[method];

            if(Konva.Util._isFunction(func)) {
                func.call(this, val);
            }
            // otherwise set directly
            else {
                this._setAttr(attr, val);
            }
            return this;
        },
        _setAttr: function(key, val) {
            var oldVal;
            if(val !== undefined) {
                oldVal = this.attrs[key];
                this.attrs[key] = val;
                this._fireChangeEvent(key, oldVal, val);
            }
        },
        _setComponentAttr: function(key, component, val) {
            var oldVal;
            if(val !== undefined) {
                oldVal = this.attrs[key];

                if (!oldVal) {
                    // set value to default value using getAttr
                    this.attrs[key] = this.getAttr(key);
                }

                this.attrs[key][component] = val;
                this._fireChangeEvent(key, oldVal, val);
            }
        },
        _fireAndBubble: function(eventType, evt, compareShape) {
            var okayToRun = true;

            if(evt && this.nodeType === SHAPE) {
                evt.target = this;
            }

            if(eventType === MOUSEENTER && compareShape && (this._id === compareShape._id || (this.isAncestorOf && this.isAncestorOf(compareShape)))) {
                okayToRun = false;
            }
            else if(eventType === MOUSELEAVE && compareShape && (this._id === compareShape._id || (this.isAncestorOf && this.isAncestorOf(compareShape)))) {
                okayToRun = false;
            }
            if(okayToRun) {
                this._fire(eventType, evt);

                // simulate event bubbling
                var stopBubble = (eventType === MOUSEENTER || eventType === MOUSELEAVE) && ((compareShape && compareShape.isAncestorOf && compareShape.isAncestorOf(this)) || !!(compareShape && compareShape.isAncestorOf));
                if(evt && !evt.cancelBubble && this.parent && this.parent.isListening() && (!stopBubble)) {
                    if(compareShape && compareShape.parent) {
                        this._fireAndBubble.call(this.parent, eventType, evt, compareShape.parent);
                    }
                    else {
                        this._fireAndBubble.call(this.parent, eventType, evt);
                    }
                }
            }
        },
        _fire: function(eventType, evt) {
            var events = this.eventListeners[eventType],
                i;

            evt.type = eventType;

            if (events) {
                for(i = 0; i < events.length; i++) {
                    events[i].handler.call(this, evt);
                }
            }
        },
        /**
         * draw both scene and hit graphs.  If the node being drawn is the stage, all of the layers will be cleared and redrawn
         * @method
         * @memberof Konva.Node.prototype
         * @returns {Konva.Node}
         */
        draw: function() {
            this.drawScene();
            this.drawHit();
            return this;
        }
    });

    /**
     * create node with JSON string or an Object.  De-serializtion does not generate custom
     *  shape drawing functions, images, or event handlers (this would make the
     *  serialized object huge).  If your app uses custom shapes, images, and
     *  event handlers (it probably does), then you need to select the appropriate
     *  shapes after loading the stage and set these properties via on(), setDrawFunc(),
     *  and setImage() methods
     * @method
     * @memberof Konva.Node
     * @param {String|Object} json string or object
     * @param {Element} [container] optional container dom element used only if you're
     *  creating a stage node
     */
    Konva.Node.create = function(data, container) {
        if (Konva.Util._isString(data)) {
            data = JSON.parse(data);
        }
        return this._createNode(data, container);
    };
    Konva.Node._createNode = function(obj, container) {
        var className = Konva.Node.prototype.getClassName.call(obj),
            children = obj.children,
            no, len, n;

        // if container was passed in, add it to attrs
        if(container) {
            obj.attrs.container = container;
        }

        no = new Konva[className](obj.attrs);
        if(children) {
            len = children.length;
            for(n = 0; n < len; n++) {
                no.add(this._createNode(children[n]));
            }
        }

        return no;
    };


    // =========================== add getters setters ===========================

    Konva.Factory.addOverloadedGetterSetter(Konva.Node, 'position');
    /**
     * get/set node position relative to parent
     * @name position
     * @method
     * @memberof Konva.Node.prototype
     * @param {Object} pos
     * @param {Number} pos.x
     * @param {Number} pos.y
     * @returns {Object}
     * @example
     * // get position
     * var position = node.position();
     *
     * // set position
     * node.position({
     *   x: 5
     *   y: 10
     * });
     */

    Konva.Factory.addGetterSetter(Konva.Node, 'x', 0);

    /**
     * get/set x position
     * @name x
     * @method
     * @memberof Konva.Node.prototype
     * @param {Number} x
     * @returns {Object}
     * @example
     * // get x
     * var x = node.x();
     *
     * // set x
     * node.x(5);
     */

    Konva.Factory.addGetterSetter(Konva.Node, 'y', 0);

    /**
     * get/set y position
     * @name y
     * @method
     * @memberof Konva.Node.prototype
     * @param {Number} y
     * @returns {Integer}
     * @example
     * // get y
     * var y = node.y();
     *
     * // set y
     * node.y(5);
     */

    Konva.Factory.addGetterSetter(Konva.Node, 'opacity', 1);

    /**
     * get/set opacity.  Opacity values range from 0 to 1.
     *  A node with an opacity of 0 is fully transparent, and a node
     *  with an opacity of 1 is fully opaque
     * @name opacity
     * @method
     * @memberof Konva.Node.prototype
     * @param {Object} opacity
     * @returns {Number}
     * @example
     * // get opacity
     * var opacity = node.opacity();
     *
     * // set opacity
     * node.opacity(0.5);
     */

    Konva.Factory.addGetter(Konva.Node, 'name');
    Konva.Factory.addOverloadedGetterSetter(Konva.Node, 'name');

    /**
     * get/set name
     * @name name
     * @method
     * @memberof Konva.Node.prototype
     * @param {String} name
     * @returns {String}
     * @example
     * // get name
     * var name = node.name();
     *
     * // set name
     * node.name('foo');
     *
     * // also node may have multiple names (as css classes)
     * node.name('foo bar');
     */

    Konva.Factory.addGetter(Konva.Node, 'id');
    Konva.Factory.addOverloadedGetterSetter(Konva.Node, 'id');

    /**
     * get/set id. Id is global for whole page.
     * @name id
     * @method
     * @memberof Konva.Node.prototype
     * @param {String} id
     * @returns {String}
     * @example
     * // get id
     * var name = node.id();
     *
     * // set id
     * node.id('foo');
     */

    Konva.Factory.addGetterSetter(Konva.Node, 'rotation', 0);

    /**
     * get/set rotation in degrees
     * @name rotation
     * @method
     * @memberof Konva.Node.prototype
     * @param {Number} rotation
     * @returns {Number}
     * @example
     * // get rotation in degrees
     * var rotation = node.rotation();
     *
     * // set rotation in degrees
     * node.rotation(45);
     */

    Konva.Factory.addComponentsGetterSetter(Konva.Node, 'scale', ['x', 'y']);

    /**
     * get/set scale
     * @name scale
     * @param {Object} scale
     * @param {Number} scale.x
     * @param {Number} scale.y
     * @method
     * @memberof Konva.Node.prototype
     * @returns {Object}
     * @example
     * // get scale
     * var scale = node.scale();
     *
     * // set scale
     * shape.scale({
     *   x: 2
     *   y: 3
     * });
     */

    Konva.Factory.addGetterSetter(Konva.Node, 'scaleX', 1);

    /**
     * get/set scale x
     * @name scaleX
     * @param {Number} x
     * @method
     * @memberof Konva.Node.prototype
     * @returns {Number}
     * @example
     * // get scale x
     * var scaleX = node.scaleX();
     *
     * // set scale x
     * node.scaleX(2);
     */

    Konva.Factory.addGetterSetter(Konva.Node, 'scaleY', 1);

    /**
     * get/set scale y
     * @name scaleY
     * @param {Number} y
     * @method
     * @memberof Konva.Node.prototype
     * @returns {Number}
     * @example
     * // get scale y
     * var scaleY = node.scaleY();
     *
     * // set scale y
     * node.scaleY(2);
     */

    Konva.Factory.addComponentsGetterSetter(Konva.Node, 'skew', ['x', 'y']);

    /**
     * get/set skew
     * @name skew
     * @param {Object} skew
     * @param {Number} skew.x
     * @param {Number} skew.y
     * @method
     * @memberof Konva.Node.prototype
     * @returns {Object}
     * @example
     * // get skew
     * var skew = node.skew();
     *
     * // set skew
     * node.skew({
     *   x: 20
     *   y: 10
     * });
     */

    Konva.Factory.addGetterSetter(Konva.Node, 'skewX', 0);

    /**
     * get/set skew x
     * @name skewX
     * @param {Number} x
     * @method
     * @memberof Konva.Node.prototype
     * @returns {Number}
     * @example
     * // get skew x
     * var skewX = node.skewX();
     *
     * // set skew x
     * node.skewX(3);
     */

    Konva.Factory.addGetterSetter(Konva.Node, 'skewY', 0);

    /**
     * get/set skew y
     * @name skewY
     * @param {Number} y
     * @method
     * @memberof Konva.Node.prototype
     * @returns {Number}
     * @example
     * // get skew y
     * var skewY = node.skewY();
     *
     * // set skew y
     * node.skewY(3);
     */

    Konva.Factory.addComponentsGetterSetter(Konva.Node, 'offset', ['x', 'y']);

    /**
     * get/set offset.  Offsets the default position and rotation point
     * @method
     * @memberof Konva.Node.prototype
     * @param {Object} offset
     * @param {Number} offset.x
     * @param {Number} offset.y
     * @returns {Object}
     * @example
     * // get offset
     * var offset = node.offset();
     *
     * // set offset
     * node.offset({
     *   x: 20
     *   y: 10
     * });
     */

    Konva.Factory.addGetterSetter(Konva.Node, 'offsetX', 0);

    /**
     * get/set offset x
     * @name offsetX
     * @method
     * @memberof Konva.Node.prototype
     * @param {Number} x
     * @returns {Number}
     * @example
     * // get offset x
     * var offsetX = node.offsetX();
     *
     * // set offset x
     * node.offsetX(3);
     */

    Konva.Factory.addGetterSetter(Konva.Node, 'offsetY', 0);

    /**
     * get/set offset y
     * @name offsetY
     * @method
     * @memberof Konva.Node.prototype
     * @param {Number} y
     * @returns {Number}
     * @example
     * // get offset y
     * var offsetY = node.offsetY();
     *
     * // set offset y
     * node.offsetY(3);
     */

    Konva.Factory.addSetter(Konva.Node, 'dragDistance');
    Konva.Factory.addOverloadedGetterSetter(Konva.Node, 'dragDistance');

    /**
     * get/set drag distance
     * @name dragDistance
     * @method
     * @memberof Konva.Node.prototype
     * @param {Number} distance
     * @returns {Number}
     * @example
     * // get drag distance
     * var dragDistance = node.dragDistance();
     *
     * // set distance
     * // node starts dragging only if pointer moved more then 3 pixels
     * node.dragDistance(3);
     * // or set globally
     * Konva.dragDistance = 3;
     */


    Konva.Factory.addSetter(Konva.Node, 'width', 0);
    Konva.Factory.addOverloadedGetterSetter(Konva.Node, 'width');
    /**
     * get/set width
     * @name width
     * @method
     * @memberof Konva.Node.prototype
     * @param {Number} width
     * @returns {Number}
     * @example
     * // get width
     * var width = node.width();
     *
     * // set width
     * node.width(100);
     */

    Konva.Factory.addSetter(Konva.Node, 'height', 0);
    Konva.Factory.addOverloadedGetterSetter(Konva.Node, 'height');
    /**
     * get/set height
     * @name height
     * @method
     * @memberof Konva.Node.prototype
     * @param {Number} height
     * @returns {Number}
     * @example
     * // get height
     * var height = node.height();
     *
     * // set height
     * node.height(100);
     */

    Konva.Factory.addGetterSetter(Konva.Node, 'listening', 'inherit');
    /**
     * get/set listenig attr.  If you need to determine if a node is listening or not
     *   by taking into account its parents, use the isListening() method
     * @name listening
     * @method
     * @memberof Konva.Node.prototype
     * @param {Boolean|String} listening Can be "inherit", true, or false.  The default is "inherit".
     * @returns {Boolean|String}
     * @example
     * // get listening attr
     * var listening = node.listening();
     *
     * // stop listening for events
     * node.listening(false);
     *
     * // listen for events
     * node.listening(true);
     *
     * // listen to events according to the parent
     * node.listening('inherit');
     */

    Konva.Factory.addGetterSetter(Konva.Node, 'filters', undefined, function(val) {this._filterUpToDate = false; return val; });
    /**
     * get/set filters.  Filters are applied to cached canvases
     * @name filters
     * @method
     * @memberof Konva.Node.prototype
     * @param {Array} filters array of filters
     * @returns {Array}
     * @example
     * // get filters
     * var filters = node.filters();
     *
     * // set a single filter
     * node.cache();
     * node.filters([Konva.Filters.Blur]);
     *
     * // set multiple filters
     * node.cache();
     * node.filters([
     *   Konva.Filters.Blur,
     *   Konva.Filters.Sepia,
     *   Konva.Filters.Invert
     * ]);
     */

    Konva.Factory.addGetterSetter(Konva.Node, 'visible', 'inherit');
    /**
     * get/set visible attr.  Can be "inherit", true, or false.  The default is "inherit".
     *   If you need to determine if a node is visible or not
     *   by taking into account its parents, use the isVisible() method
     * @name visible
     * @method
     * @memberof Konva.Node.prototype
     * @param {Boolean|String} visible
     * @returns {Boolean|String}
     * @example
     * // get visible attr
     * var visible = node.visible();
     *
     * // make invisible
     * node.visible(false);
     *
     * // make visible
     * node.visible(true);
     *
     * // make visible according to the parent
     * node.visible('inherit');
     */

    Konva.Factory.addGetterSetter(Konva.Node, 'transformsEnabled', 'all');

    /**
     * get/set transforms that are enabled.  Can be "all", "none", or "position".  The default
     *  is "all"
     * @name transformsEnabled
     * @method
     * @memberof Konva.Node.prototype
     * @param {String} enabled
     * @returns {String}
     * @example
     * // enable position transform only to improve draw performance
     * node.transformsEnabled('position');
     *
     * // enable all transforms
     * node.transformsEnabled('all');
     */



    /**
     * get/set node size
     * @name size
     * @method
     * @memberof Konva.Node.prototype
     * @param {Object} size
     * @param {Number} size.width
     * @param {Number} size.height
     * @returns {Object}
     * @example
     * // get node size
     * var size = node.size();
     * var x = size.x;
     * var y = size.y;
     *
     * // set size
     * node.size({
     *   width: 100,
     *   height: 200
     * });
     */
    Konva.Factory.addOverloadedGetterSetter(Konva.Node, 'size');

    Konva.Factory.backCompat(Konva.Node, {
        rotateDeg: 'rotate',
        setRotationDeg: 'setRotation',
        getRotationDeg: 'getRotation'
    });

    Konva.Collection.mapMethods(Konva.Node);
})(Konva);

(function() {
    'use strict';
    /**
    * Grayscale Filter
    * @function
    * @memberof Konva.Filters
    * @param {Object} imageData
    * @example
    * node.cache();
    * node.filters([Konva.Filters.Grayscale]);
    */
    Konva.Filters.Grayscale = function(imageData) {
        var data = imageData.data,
            len = data.length,
            i, brightness;

        for(i = 0; i < len; i += 4) {
            brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
            // red
            data[i] = brightness;
            // green
            data[i + 1] = brightness;
            // blue
            data[i + 2] = brightness;
        }
    };
})();

(function() {
    'use strict';
    /**
     * Brighten Filter.
     * @function
     * @memberof Konva.Filters
     * @param {Object} imageData
     * @example
     * node.cache();
     * node.filters([Konva.Filters.Brighten]);
     * node.brightness(0.8);
     */
    Konva.Filters.Brighten = function(imageData) {
        var brightness = this.brightness() * 255,
            data = imageData.data,
            len = data.length,
            i;

        for(i = 0; i < len; i += 4) {
            // red
            data[i] += brightness;
            // green
            data[i + 1] += brightness;
            // blue
            data[i + 2] += brightness;
        }
    };

    Konva.Factory.addGetterSetter(Konva.Node, 'brightness', 0, null, Konva.Factory.afterSetFilter);
    /**
    * get/set filter brightness.  The brightness is a number between -1 and 1.&nbsp; Positive values
    *  brighten the pixels and negative values darken them. Use with {@link Konva.Filters.Brighten} filter.
    * @name brightness
    * @method
    * @memberof Konva.Node.prototype
    * @param {Number} brightness value between -1 and 1
    * @returns {Number}
    */

})();

(function() {
    'use strict';
    /**
    * Invert Filter
    * @function
    * @memberof Konva.Filters
    * @param {Object} imageData
    * @example
    * node.cache();
    * node.filters([Konva.Filters.Invert]);
    */
    Konva.Filters.Invert = function(imageData) {
        var data = imageData.data,
            len = data.length,
            i;

        for(i = 0; i < len; i += 4) {
            // red
            data[i] = 255 - data[i];
            // green
            data[i + 1] = 255 - data[i + 1];
            // blue
            data[i + 2] = 255 - data[i + 2];
        }
    };
})();

/*
 the Gauss filter
 master repo: https://github.com/pavelpower/kineticjsGaussFilter
*/
(function() {
    'use strict';
    /*

     StackBlur - a fast almost Gaussian Blur For Canvas

     Version:   0.5
     Author:    Mario Klingemann
     Contact:   mario@quasimondo.com
     Website:   http://www.quasimondo.com/StackBlurForCanvas
     Twitter:   @quasimondo

     In case you find this class useful - especially in commercial projects -
     I am not totally unhappy for a small donation to my PayPal account
     mario@quasimondo.de

     Or support me on flattr:
     https://flattr.com/thing/72791/StackBlur-a-fast-almost-Gaussian-Blur-Effect-for-CanvasJavascript

     Copyright (c) 2010 Mario Klingemann

     Permission is hereby granted, free of charge, to any person
     obtaining a copy of this software and associated documentation
     files (the "Software"), to deal in the Software without
     restriction, including without limitation the rights to use,
     copy, modify, merge, publish, distribute, sublicense, and/or sell
     copies of the Software, and to permit persons to whom the
     Software is furnished to do so, subject to the following
     conditions:

     The above copyright notice and this permission notice shall be
     included in all copies or substantial portions of the Software.

     THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
     EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
     OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
     NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
     HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
     WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
     FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
     OTHER DEALINGS IN THE SOFTWARE.
     */

    function BlurStack() {
        this.r = 0;
        this.g = 0;
        this.b = 0;
        this.a = 0;
        this.next = null;
    }

    var mul_table = [
        512, 512, 456, 512, 328, 456, 335, 512, 405, 328, 271, 456, 388, 335, 292, 512,
        454, 405, 364, 328, 298, 271, 496, 456, 420, 388, 360, 335, 312, 292, 273, 512,
        482, 454, 428, 405, 383, 364, 345, 328, 312, 298, 284, 271, 259, 496, 475, 456,
        437, 420, 404, 388, 374, 360, 347, 335, 323, 312, 302, 292, 282, 273, 265, 512,
        497, 482, 468, 454, 441, 428, 417, 405, 394, 383, 373, 364, 354, 345, 337, 328,
        320, 312, 305, 298, 291, 284, 278, 271, 265, 259, 507, 496, 485, 475, 465, 456,
        446, 437, 428, 420, 412, 404, 396, 388, 381, 374, 367, 360, 354, 347, 341, 335,
        329, 323, 318, 312, 307, 302, 297, 292, 287, 282, 278, 273, 269, 265, 261, 512,
        505, 497, 489, 482, 475, 468, 461, 454, 447, 441, 435, 428, 422, 417, 411, 405,
        399, 394, 389, 383, 378, 373, 368, 364, 359, 354, 350, 345, 341, 337, 332, 328,
        324, 320, 316, 312, 309, 305, 301, 298, 294, 291, 287, 284, 281, 278, 274, 271,
        268, 265, 262, 259, 257, 507, 501, 496, 491, 485, 480, 475, 470, 465, 460, 456,
        451, 446, 442, 437, 433, 428, 424, 420, 416, 412, 408, 404, 400, 396, 392, 388,
        385, 381, 377, 374, 370, 367, 363, 360, 357, 354, 350, 347, 344, 341, 338, 335,
        332, 329, 326, 323, 320, 318, 315, 312, 310, 307, 304, 302, 299, 297, 294, 292,
        289, 287, 285, 282, 280, 278, 275, 273, 271, 269, 267, 265, 263, 261, 259
    ];

    var shg_table = [
        9, 11, 12, 13, 13, 14, 14, 15, 15, 15, 15, 16, 16, 16, 16, 17,
        17, 17, 17, 17, 17, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19,
        19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 20, 20,
        20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 21,
        21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21,
        21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 22, 22, 22, 22, 22, 22,
        22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22,
        22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 23,
        23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
        23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
        23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
        23, 23, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
        24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
        24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
        24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
        24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24
    ];

    function filterGaussBlurRGBA( imageData, radius) {

        var pixels = imageData.data,
            width = imageData.width,
            height = imageData.height;

        var x, y, i, p, yp, yi, yw, r_sum, g_sum, b_sum, a_sum,
            r_out_sum, g_out_sum, b_out_sum, a_out_sum,
            r_in_sum, g_in_sum, b_in_sum, a_in_sum,
            pr, pg, pb, pa, rbs;

        var div = radius + radius + 1,
            widthMinus1 = width - 1,
            heightMinus1 = height - 1,
            radiusPlus1 = radius + 1,
            sumFactor = radiusPlus1 * ( radiusPlus1 + 1 ) / 2,
            stackStart = new BlurStack(),
            stackEnd = null,
            stack = stackStart,
            stackIn = null,
            stackOut = null,
            mul_sum = mul_table[radius],
            shg_sum = shg_table[radius];

        for ( i = 1; i < div; i++ ) {
            stack = stack.next = new BlurStack();
            if ( i === radiusPlus1 ){
                stackEnd = stack;
            }
        }

        stack.next = stackStart;

        yw = yi = 0;

        for ( y = 0; y < height; y++ )
        {
            r_in_sum = g_in_sum = b_in_sum = a_in_sum = r_sum = g_sum = b_sum = a_sum = 0;

            r_out_sum = radiusPlus1 * ( pr = pixels[yi] );
            g_out_sum = radiusPlus1 * ( pg = pixels[yi + 1] );
            b_out_sum = radiusPlus1 * ( pb = pixels[yi + 2] );
            a_out_sum = radiusPlus1 * ( pa = pixels[yi + 3] );

            r_sum += sumFactor * pr;
            g_sum += sumFactor * pg;
            b_sum += sumFactor * pb;
            a_sum += sumFactor * pa;

            stack = stackStart;

            for( i = 0; i < radiusPlus1; i++ )
            {
                stack.r = pr;
                stack.g = pg;
                stack.b = pb;
                stack.a = pa;
                stack = stack.next;
            }

            for( i = 1; i < radiusPlus1; i++ )
            {
                p = yi + (( widthMinus1 < i ? widthMinus1 : i ) << 2 );
                r_sum += ( stack.r = ( pr = pixels[p])) * ( rbs = radiusPlus1 - i );
                g_sum += ( stack.g = ( pg = pixels[p + 1])) * rbs;
                b_sum += ( stack.b = ( pb = pixels[p + 2])) * rbs;
                a_sum += ( stack.a = ( pa = pixels[p + 3])) * rbs;

                r_in_sum += pr;
                g_in_sum += pg;
                b_in_sum += pb;
                a_in_sum += pa;

                stack = stack.next;
            }


            stackIn = stackStart;
            stackOut = stackEnd;
            for ( x = 0; x < width; x++ )
            {
                pixels[yi + 3] = pa = (a_sum * mul_sum) >> shg_sum;
                if ( pa !== 0 )
                {
                    pa = 255 / pa;
                    pixels[yi] = ((r_sum * mul_sum) >> shg_sum) * pa;
                    pixels[yi + 1] = ((g_sum * mul_sum) >> shg_sum) * pa;
                    pixels[yi + 2] = ((b_sum * mul_sum) >> shg_sum) * pa;
                } else {
                    pixels[yi] = pixels[yi + 1] = pixels[yi + 2] = 0;
                }

                r_sum -= r_out_sum;
                g_sum -= g_out_sum;
                b_sum -= b_out_sum;
                a_sum -= a_out_sum;

                r_out_sum -= stackIn.r;
                g_out_sum -= stackIn.g;
                b_out_sum -= stackIn.b;
                a_out_sum -= stackIn.a;

                p = (yw + ( ( p = x + radius + 1 ) < widthMinus1 ? p : widthMinus1 ) ) << 2;

                r_in_sum += ( stackIn.r = pixels[p]);
                g_in_sum += ( stackIn.g = pixels[p + 1]);
                b_in_sum += ( stackIn.b = pixels[p + 2]);
                a_in_sum += ( stackIn.a = pixels[p + 3]);

                r_sum += r_in_sum;
                g_sum += g_in_sum;
                b_sum += b_in_sum;
                a_sum += a_in_sum;

                stackIn = stackIn.next;

                r_out_sum += ( pr = stackOut.r );
                g_out_sum += ( pg = stackOut.g );
                b_out_sum += ( pb = stackOut.b );
                a_out_sum += ( pa = stackOut.a );

                r_in_sum -= pr;
                g_in_sum -= pg;
                b_in_sum -= pb;
                a_in_sum -= pa;

                stackOut = stackOut.next;

                yi += 4;
            }
            yw += width;
        }


        for ( x = 0; x < width; x++ )
        {
            g_in_sum = b_in_sum = a_in_sum = r_in_sum = g_sum = b_sum = a_sum = r_sum = 0;

            yi = x << 2;
            r_out_sum = radiusPlus1 * ( pr = pixels[yi]);
            g_out_sum = radiusPlus1 * ( pg = pixels[yi + 1]);
            b_out_sum = radiusPlus1 * ( pb = pixels[yi + 2]);
            a_out_sum = radiusPlus1 * ( pa = pixels[yi + 3]);

            r_sum += sumFactor * pr;
            g_sum += sumFactor * pg;
            b_sum += sumFactor * pb;
            a_sum += sumFactor * pa;

            stack = stackStart;

            for( i = 0; i < radiusPlus1; i++ )
            {
                stack.r = pr;
                stack.g = pg;
                stack.b = pb;
                stack.a = pa;
                stack = stack.next;
            }

            yp = width;

            for( i = 1; i <= radius; i++ )
            {
                yi = ( yp + x ) << 2;

                r_sum += ( stack.r = ( pr = pixels[yi])) * ( rbs = radiusPlus1 - i );
                g_sum += ( stack.g = ( pg = pixels[yi + 1])) * rbs;
                b_sum += ( stack.b = ( pb = pixels[yi + 2])) * rbs;
                a_sum += ( stack.a = ( pa = pixels[yi + 3])) * rbs;

                r_in_sum += pr;
                g_in_sum += pg;
                b_in_sum += pb;
                a_in_sum += pa;

                stack = stack.next;

                if( i < heightMinus1 )
                {
                    yp += width;
                }
            }

            yi = x;
            stackIn = stackStart;
            stackOut = stackEnd;
            for ( y = 0; y < height; y++ )
            {
                p = yi << 2;
                pixels[p + 3] = pa = (a_sum * mul_sum) >> shg_sum;
                if ( pa > 0 )
                {
                    pa = 255 / pa;
                    pixels[p] = ((r_sum * mul_sum) >> shg_sum ) * pa;
                    pixels[p + 1] = ((g_sum * mul_sum) >> shg_sum ) * pa;
                    pixels[p + 2] = ((b_sum * mul_sum) >> shg_sum ) * pa;
                } else {
                    pixels[p] = pixels[p + 1] = pixels[p + 2] = 0;
                }

                r_sum -= r_out_sum;
                g_sum -= g_out_sum;
                b_sum -= b_out_sum;
                a_sum -= a_out_sum;

                r_out_sum -= stackIn.r;
                g_out_sum -= stackIn.g;
                b_out_sum -= stackIn.b;
                a_out_sum -= stackIn.a;

                p = ( x + (( ( p = y + radiusPlus1) < heightMinus1 ? p : heightMinus1 ) * width )) << 2;

                r_sum += ( r_in_sum += ( stackIn.r = pixels[p]));
                g_sum += ( g_in_sum += ( stackIn.g = pixels[p + 1]));
                b_sum += ( b_in_sum += ( stackIn.b = pixels[p + 2]));
                a_sum += ( a_in_sum += ( stackIn.a = pixels[p + 3]));

                stackIn = stackIn.next;

                r_out_sum += ( pr = stackOut.r );
                g_out_sum += ( pg = stackOut.g );
                b_out_sum += ( pb = stackOut.b );
                a_out_sum += ( pa = stackOut.a );

                r_in_sum -= pr;
                g_in_sum -= pg;
                b_in_sum -= pb;
                a_in_sum -= pa;

                stackOut = stackOut.next;

                yi += width;
            }
        }
    }

    /**
     * Blur Filter
     * @function
     * @name Blur
     * @memberof Konva.Filters
     * @param {Object} imageData
     * @example
     * node.cache();
     * node.filters([Konva.Filters.Blur]);
     * node.blurRadius(10);
     */
    Konva.Filters.Blur = function Blur(imageData) {
        var radius = Math.round(this.blurRadius());

        if (radius > 0) {
            filterGaussBlurRGBA(imageData, radius);
        }
    };

    Konva.Factory.addGetterSetter(Konva.Node, 'blurRadius', 0, null, Konva.Factory.afterSetFilter);

    /**
    * get/set blur radius. Use with {@link Konva.Filters.Blur} filter
    * @name blurRadius
    * @method
    * @memberof Konva.Node.prototype
    * @param {Integer} radius
    * @returns {Integer}
    */
})();

/*eslint-disable  max-depth */
(function() {
	'use strict';
	function pixelAt(idata, x, y) {
		var idx = (y * idata.width + x) * 4;
		var d = [];
		d.push(idata.data[idx++], idata.data[idx++], idata.data[idx++], idata.data[idx++]);
		return d;
	}

	function rgbDistance(p1, p2) {
		return Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2) + Math.pow(p1[2] - p2[2], 2));
	}

	function rgbMean(pTab) {
		var m = [0, 0, 0];

		for (var i = 0; i < pTab.length; i++) {
			m[0] += pTab[i][0];
			m[1] += pTab[i][1];
			m[2] += pTab[i][2];
		}

		m[0] /= pTab.length;
		m[1] /= pTab.length;
		m[2] /= pTab.length;

		return m;
	}

	function backgroundMask(idata, threshold) {
		var rgbv_no = pixelAt(idata, 0, 0);
		var rgbv_ne = pixelAt(idata, idata.width - 1, 0);
		var rgbv_so = pixelAt(idata, 0, idata.height - 1);
		var rgbv_se = pixelAt(idata, idata.width - 1, idata.height - 1);


		var thres = threshold || 10;
		if (rgbDistance(rgbv_no, rgbv_ne) < thres && rgbDistance(rgbv_ne, rgbv_se) < thres && rgbDistance(rgbv_se, rgbv_so) < thres && rgbDistance(rgbv_so, rgbv_no) < thres) {

			// Mean color
			var mean = rgbMean([rgbv_ne, rgbv_no, rgbv_se, rgbv_so]);

			// Mask based on color distance
			var mask = [];
			for (var i = 0; i < idata.width * idata.height; i++) {
				var d = rgbDistance(mean, [idata.data[i * 4], idata.data[i * 4 + 1], idata.data[i * 4 + 2]]);
				mask[i] = (d < thres) ? 0 : 255;
			}

			return mask;
		}
	}

	function applyMask(idata, mask) {
		for (var i = 0; i < idata.width * idata.height; i++) {
			idata.data[4 * i + 3] = mask[i];
		}
	}

	function erodeMask(mask, sw, sh) {

		var weights = [1, 1, 1, 1, 0, 1, 1, 1, 1];
		var side = Math.round(Math.sqrt(weights.length));
		var halfSide = Math.floor(side / 2);

		var maskResult = [];
		for (var y = 0; y < sh; y++) {
			for (var x = 0; x < sw; x++) {

				var so = y * sw + x;
				var a = 0;
				for (var cy = 0; cy < side; cy++) {
					for (var cx = 0; cx < side; cx++) {
						var scy = y + cy - halfSide;
						var scx = x + cx - halfSide;

						if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {

							var srcOff = scy * sw + scx;
							var wt = weights[cy * side + cx];

							a += mask[srcOff] * wt;
						}
					}
				}

				maskResult[so] = (a === 255 * 8) ? 255 : 0;
			}
		}

		return maskResult;
	}

	function dilateMask(mask, sw, sh) {

		var weights = [1, 1, 1, 1, 1, 1, 1, 1, 1];
		var side = Math.round(Math.sqrt(weights.length));
		var halfSide = Math.floor(side / 2);

		var maskResult = [];
		for (var y = 0; y < sh; y++) {
			for (var x = 0; x < sw; x++) {

				var so = y * sw + x;
				var a = 0;
				for (var cy = 0; cy < side; cy++) {
					for (var cx = 0; cx < side; cx++) {
						var scy = y + cy - halfSide;
						var scx = x + cx - halfSide;

						if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {

							var srcOff = scy * sw + scx;
							var wt = weights[cy * side + cx];

							a += mask[srcOff] * wt;
						}
					}
				}

				maskResult[so] = (a >= 255 * 4) ? 255 : 0;
			}
		}

		return maskResult;
	}

	function smoothEdgeMask(mask, sw, sh) {

		var weights = [1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9];
		var side = Math.round(Math.sqrt(weights.length));
		var halfSide = Math.floor(side / 2);

		var maskResult = [];
		for (var y = 0; y < sh; y++) {
			for (var x = 0; x < sw; x++) {

				var so = y * sw + x;
				var a = 0;
				for (var cy = 0; cy < side; cy++) {
					for (var cx = 0; cx < side; cx++) {
						var scy = y + cy - halfSide;
						var scx = x + cx - halfSide;

						if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {

							var srcOff = scy * sw + scx;
							var wt = weights[cy * side + cx];

							a += mask[srcOff] * wt;
						}
					}
				}

				maskResult[so] = a;
			}
		}

		return maskResult;
	}

	/**
	 * Mask Filter
	 * @function
	 * @name Mask
	 * @memberof Konva.Filters
	 * @param {Object} imageData
	 * @example
     * node.cache();
     * node.filters([Konva.Filters.Mask]);
     * node.threshold(200);
	 */
	Konva.Filters.Mask = function(imageData) {
		// Detect pixels close to the background color
		var threshold = this.threshold(),
        mask = backgroundMask(imageData, threshold);
		if (mask) {
			// Erode
			mask = erodeMask(mask, imageData.width, imageData.height);

			// Dilate
			mask = dilateMask(mask, imageData.width, imageData.height);

			// Gradient
			mask = smoothEdgeMask(mask, imageData.width, imageData.height);

			// Apply mask
			applyMask(imageData, mask);

			// todo : Update hit region function according to mask
		}

		return imageData;
	};

	Konva.Factory.addGetterSetter(Konva.Node, 'threshold', 0, null, Konva.Factory.afterSetFilter);
})();

(function () {
    'use strict';
    /**
     * RGB Filter
     * @function
     * @name RGB
     * @memberof Konva.Filters
     * @param {Object} imageData
     * @author ippo615
     * @example
     * node.cache();
     * node.filters([Konva.Filters.RGB]);
     * node.blue(120);
     * node.green(200);
     */
    Konva.Filters.RGB = function (imageData) {
        var data = imageData.data,
            nPixels = data.length,
            red = this.red(),
            green = this.green(),
            blue = this.blue(),
            i, brightness;

        for (i = 0; i < nPixels; i += 4) {
            brightness = (0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2]) / 255;
            data[i] = brightness * red; // r
            data[i + 1] = brightness * green; // g
            data[i + 2] = brightness * blue; // b
            data[i + 3] = data[i + 3]; // alpha
        }
    };

    Konva.Factory.addGetterSetter(Konva.Node, 'red', 0, function(val) {
        this._filterUpToDate = false;
        if (val > 255) {
            return 255;
        }
        else if (val < 0) {
            return 0;
        }
        else {
            return Math.round(val);
        }
    });
    /**
    * get/set filter red value. Use with {@link Konva.Filters.RGB} filter.
    * @name red
    * @method
    * @memberof Konva.Node.prototype
    * @param {Integer} red value between 0 and 255
    * @returns {Integer}
    */

    Konva.Factory.addGetterSetter(Konva.Node, 'green', 0, function(val) {
        this._filterUpToDate = false;
        if (val > 255) {
            return 255;
        }
        else if (val < 0) {
            return 0;
        }
        else {
            return Math.round(val);
        }
    });
    /**
    * get/set filter green value. Use with {@link Konva.Filters.RGB} filter.
    * @name green
    * @method
    * @memberof Konva.Node.prototype
    * @param {Integer} green value between 0 and 255
    * @returns {Integer}
    */

    Konva.Factory.addGetterSetter(Konva.Node, 'blue', 0, Konva.Validators.RGBComponent, Konva.Factory.afterSetFilter);
    /**
    * get/set filter blue value. Use with {@link Konva.Filters.RGB} filter.
    * @name blue
    * @method
    * @memberof Konva.Node.prototype
    * @param {Integer} blue value between 0 and 255
    * @returns {Integer}
    */
})();

(function () {
    'use strict';
    /**
     * RGBA Filter
     * @function
     * @name RGBA
     * @memberof Konva.Filters
     * @param {Object} imageData
     * @author codefo
     * @example
     * node.cache();
     * node.filters([Konva.Filters.RGBA]);
     * node.blue(120);
     * node.green(200);
     * node.alpha(0.3);
     */
    Konva.Filters.RGBA = function (imageData) {
        var data = imageData.data,
            nPixels = data.length,
            red = this.red(),
            green = this.green(),
            blue = this.blue(),
            alpha = this.alpha(),
            i, ia;

        for (i = 0; i < nPixels; i += 4) {
            ia = 1 - alpha;

            data[i] = red * alpha + data[i] * ia; // r
            data[i + 1] = green * alpha + data[i + 1] * ia; // g
            data[i + 2] = blue * alpha + data[i + 2] * ia; // b
        }
    };

    Konva.Factory.addGetterSetter(Konva.Node, 'red', 0, function(val) {
        this._filterUpToDate = false;
        if (val > 255) {
            return 255;
        }
        else if (val < 0) {
            return 0;
        }
        else {
            return Math.round(val);
        }
    });
    /**
    * get/set filter red value. Use with {@link Konva.Filters.RGBA} filter.
    * @name red
    * @method
    * @memberof Konva.Node.prototype
    * @param {Integer} red value between 0 and 255
    * @returns {Integer}
    */

    Konva.Factory.addGetterSetter(Konva.Node, 'green', 0, function(val) {
        this._filterUpToDate = false;
        if (val > 255) {
            return 255;
        }
        else if (val < 0) {
            return 0;
        }
        else {
            return Math.round(val);
        }
    });
    /**
    * get/set filter green value. Use with {@link Konva.Filters.RGBA} filter.
    * @name green
    * @method
    * @memberof Konva.Node.prototype
    * @param {Integer} green value between 0 and 255
    * @returns {Integer}
    */

    Konva.Factory.addGetterSetter(Konva.Node, 'blue', 0, Konva.Validators.RGBComponent, Konva.Factory.afterSetFilter);
    /**
    * get/set filter blue value. Use with {@link Konva.Filters.RGBA} filter.
    * @name blue
    * @method
    * @memberof Konva.Node.prototype
    * @param {Integer} blue value between 0 and 255
    * @returns {Integer}
    */

    Konva.Factory.addGetterSetter(Konva.Node, 'alpha', 1, function(val) {
        this._filterUpToDate = false;
        if (val > 1) {
            return 1;
        }
        else if (val < 0) {
            return 0;
        }
        else {
            return val;
        }
    });
    /**
     * get/set filter alpha value. Use with {@link Konva.Filters.RGBA} filter.
     * @name alpha
     * @method
     * @memberof Konva.Node.prototype
     * @param {Float} alpha value between 0 and 1
     * @returns {Float}
     */
})();

(function () {
    'use strict';
    /**
    * HSV Filter. Adjusts the hue, saturation and value
    * @function
    * @name HSV
    * @memberof Konva.Filters
    * @param {Object} imageData
    * @author ippo615
    * @example
    * image.filters([Konva.Filters.HSV]);
    * image.value(200);
    */

    Konva.Filters.HSV = function (imageData) {
        var data = imageData.data,
            nPixels = data.length,
            v = Math.pow(2, this.value()),
            s = Math.pow(2, this.saturation()),
            h = Math.abs((this.hue()) + 360) % 360,
            i;

        // Basis for the technique used:
        // http://beesbuzz.biz/code/hsv_color_transforms.php
        // V is the value multiplier (1 for none, 2 for double, 0.5 for half)
        // S is the saturation multiplier (1 for none, 2 for double, 0.5 for half)
        // H is the hue shift in degrees (0 to 360)
        // vsu = V*S*cos(H*PI/180);
        // vsw = V*S*sin(H*PI/180);
        //[ .299V+.701vsu+.168vsw    .587V-.587vsu+.330vsw    .114V-.114vsu-.497vsw ] [R]
        //[ .299V-.299vsu-.328vsw    .587V+.413vsu+.035vsw    .114V-.114vsu+.292vsw ]*[G]
        //[ .299V-.300vsu+1.25vsw    .587V-.588vsu-1.05vsw    .114V+.886vsu-.203vsw ] [B]

        // Precompute the values in the matrix:
        var vsu = v * s * Math.cos(h * Math.PI / 180),
            vsw = v * s * Math.sin(h * Math.PI / 180);
        // (result spot)(source spot)
        var rr = 0.299 * v + 0.701 * vsu + 0.167 * vsw,
            rg = 0.587 * v - 0.587 * vsu + 0.330 * vsw,
            rb = 0.114 * v - 0.114 * vsu - 0.497 * vsw;
        var gr = 0.299 * v - 0.299 * vsu - 0.328 * vsw,
            gg = 0.587 * v + 0.413 * vsu + 0.035 * vsw,
            gb = 0.114 * v - 0.114 * vsu + 0.293 * vsw;
        var br = 0.299 * v - 0.300 * vsu + 1.250 * vsw,
            bg = 0.587 * v - 0.586 * vsu - 1.050 * vsw,
            bb = 0.114 * v + 0.886 * vsu - 0.200 * vsw;

        var r, g, b, a;

        for (i = 0; i < nPixels; i += 4) {
            r = data[i + 0];
            g = data[i + 1];
            b = data[i + 2];
            a = data[i + 3];

            data[i + 0] = rr * r + rg * g + rb * b;
            data[i + 1] = gr * r + gg * g + gb * b;
            data[i + 2] = br * r + bg * g + bb * b;
            data[i + 3] = a; // alpha
        }

    };

    Konva.Factory.addGetterSetter(Konva.Node, 'hue', 0, null, Konva.Factory.afterSetFilter);
    /**
    * get/set hsv hue in degrees. Use with {@link Konva.Filters.HSV} or {@link Konva.Filters.HSL} filter.
    * @name hue
    * @method
    * @memberof Konva.Node.prototype
    * @param {Number} hue value between 0 and 359
    * @returns {Number}
    */

    Konva.Factory.addGetterSetter(Konva.Node, 'saturation', 0, null, Konva.Factory.afterSetFilter);
    /**
    * get/set hsv saturation. Use with {@link Konva.Filters.HSV} or {@link Konva.Filters.HSL} filter.
    * @name saturation
    * @method
    * @memberof Konva.Node.prototype
    * @param {Number} saturation 0 is no change, -1.0 halves the saturation, 1.0 doubles, etc..
    * @returns {Number}
    */

    Konva.Factory.addGetterSetter(Konva.Node, 'value', 0, null, Konva.Factory.afterSetFilter);
    /**
    * get/set hsv value. Use with {@link Konva.Filters.HSV} filter.
    * @name value
    * @method
    * @memberof Konva.Node.prototype
    * @param {Number} value 0 is no change, -1.0 halves the value, 1.0 doubles, etc..
    * @returns {Number}
    */

})();

(function () {
    'use strict';

    Konva.Factory.addGetterSetter(Konva.Node, 'hue', 0, null, Konva.Factory.afterSetFilter);
    /**
    * get/set hsv hue in degrees. Use with {@link Konva.Filters.HSV} or {@link Konva.Filters.HSL} filter.
    * @name hue
    * @method
    * @memberof Konva.Node.prototype
    * @param {Number} hue value between 0 and 359
    * @returns {Number}
    */

    Konva.Factory.addGetterSetter(Konva.Node, 'saturation', 0, null, Konva.Factory.afterSetFilter);
    /**
    * get/set hsv saturation. Use with {@link Konva.Filters.HSV} or {@link Konva.Filters.HSL} filter.
    * @name saturation
    * @method
    * @memberof Konva.Node.prototype
    * @param {Number} saturation 0 is no change, -1.0 halves the saturation, 1.0 doubles, etc..
    * @returns {Number}
    */

    Konva.Factory.addGetterSetter(Konva.Node, 'luminance', 0, null, Konva.Factory.afterSetFilter);
    /**
    * get/set hsl luminance. Use with {@link Konva.Filters.HSL} filter.
    * @name value
    * @method
    * @memberof Konva.Node.prototype
    * @param {Number} value 0 is no change, -1.0 halves the value, 1.0 doubles, etc..
    * @returns {Number}
    */

    /**
    * HSL Filter. Adjusts the hue, saturation and luminance (or lightness)
    * @function
    * @memberof Konva.Filters
    * @param {Object} imageData
    * @author ippo615
    * @example
    * image.filters([Konva.Filters.HSL]);
    * image.luminance(200);
    */

    Konva.Filters.HSL = function (imageData) {
        var data = imageData.data,
            nPixels = data.length,
            v = 1,
            s = Math.pow(2, this.saturation()),
            h = Math.abs((this.hue()) + 360) % 360,
            l = this.luminance() * 127,
            i;

        // Basis for the technique used:
        // http://beesbuzz.biz/code/hsv_color_transforms.php
        // V is the value multiplier (1 for none, 2 for double, 0.5 for half)
        // S is the saturation multiplier (1 for none, 2 for double, 0.5 for half)
        // H is the hue shift in degrees (0 to 360)
        // vsu = V*S*cos(H*PI/180);
        // vsw = V*S*sin(H*PI/180);
        //[ .299V+.701vsu+.168vsw    .587V-.587vsu+.330vsw    .114V-.114vsu-.497vsw ] [R]
        //[ .299V-.299vsu-.328vsw    .587V+.413vsu+.035vsw    .114V-.114vsu+.292vsw ]*[G]
        //[ .299V-.300vsu+1.25vsw    .587V-.588vsu-1.05vsw    .114V+.886vsu-.203vsw ] [B]

        // Precompute the values in the matrix:
        var vsu = v * s * Math.cos(h * Math.PI / 180),
            vsw = v * s * Math.sin(h * Math.PI / 180);
        // (result spot)(source spot)
        var rr = 0.299 * v + 0.701 * vsu + 0.167 * vsw,
            rg = 0.587 * v - 0.587 * vsu + 0.330 * vsw,
            rb = 0.114 * v - 0.114 * vsu - 0.497 * vsw;
        var gr = 0.299 * v - 0.299 * vsu - 0.328 * vsw,
            gg = 0.587 * v + 0.413 * vsu + 0.035 * vsw,
            gb = 0.114 * v - 0.114 * vsu + 0.293 * vsw;
        var br = 0.299 * v - 0.300 * vsu + 1.250 * vsw,
            bg = 0.587 * v - 0.586 * vsu - 1.050 * vsw,
            bb = 0.114 * v + 0.886 * vsu - 0.200 * vsw;

        var r, g, b, a;

        for (i = 0; i < nPixels; i += 4) {
            r = data[i + 0];
            g = data[i + 1];
            b = data[i + 2];
            a = data[i + 3];

            data[i + 0] = rr * r + rg * g + rb * b + l;
            data[i + 1] = gr * r + gg * g + gb * b + l;
            data[i + 2] = br * r + bg * g + bb * b + l;
            data[i + 3] = a; // alpha
        }
    };
})();

(function () {
    'use strict';
    /**
     * Emboss Filter.
     * Pixastic Lib - Emboss filter - v0.1.0
     * Copyright (c) 2008 Jacob Seidelin, jseidelin@nihilogic.dk, http://blog.nihilogic.dk/
     * License: [http://www.pixastic.com/lib/license.txt]
     * @function
     * @memberof Konva.Filters
     * @param {Object} imageData
     * @example
     * node.cache();
     * node.filters([Konva.Filters.Emboss]);
     * node.embossStrength(0.8);
     * node.embossWhiteLevel(0.3);
     * node.embossDirection('right');
     * node.embossBlend(true);
     */
    Konva.Filters.Emboss = function (imageData) {

        // pixastic strength is between 0 and 10.  I want it between 0 and 1
        // pixastic greyLevel is between 0 and 255.  I want it between 0 and 1.  Also,
        // a max value of greyLevel yields a white emboss, and the min value yields a black
        // emboss.  Therefore, I changed greyLevel to whiteLevel
        var strength = this.embossStrength() * 10,
            greyLevel = this.embossWhiteLevel() * 255,
            direction = this.embossDirection(),
            blend = this.embossBlend(),
            dirY = 0,
            dirX = 0,
            data = imageData.data,
            w = imageData.width,
            h = imageData.height,
            w4 = w * 4,
            y = h;

        switch (direction) {
            case 'top-left':
                dirY = -1;
                dirX = -1;
                break;
            case 'top':
                dirY = -1;
                dirX = 0;
                break;
            case 'top-right':
                dirY = -1;
                dirX = 1;
                break;
            case 'right':
                dirY = 0;
                dirX = 1;
                break;
            case 'bottom-right':
                dirY = 1;
                dirX = 1;
                break;
            case 'bottom':
                dirY = 1;
                dirX = 0;
                break;
            case 'bottom-left':
                dirY = 1;
                dirX = -1;
                break;
            case 'left':
                dirY = 0;
                dirX = -1;
                break;
        }

        do {
            var offsetY = (y - 1) * w4;

            var otherY = dirY;
            if (y + otherY < 1){
                otherY = 0;
            }
            if (y + otherY > h) {
                otherY = 0;
            }

            var offsetYOther = (y - 1 + otherY) * w * 4;

            var x = w;
            do {
                var offset = offsetY + (x - 1) * 4;

                var otherX = dirX;
                if (x + otherX < 1){
                    otherX = 0;
                }
                if (x + otherX > w) {
                    otherX = 0;
                }

                var offsetOther = offsetYOther + (x - 1 + otherX) * 4;

                var dR = data[offset] - data[offsetOther];
                var dG = data[offset + 1] - data[offsetOther + 1];
                var dB = data[offset + 2] - data[offsetOther + 2];

                var dif = dR;
                var absDif = dif > 0 ? dif : -dif;

                var absG = dG > 0 ? dG : -dG;
                var absB = dB > 0 ? dB : -dB;

                if (absG > absDif) {
                    dif = dG;
                }
                if (absB > absDif) {
                    dif = dB;
                }

                dif *= strength;

                if (blend) {
                    var r = data[offset] + dif;
                    var g = data[offset + 1] + dif;
                    var b = data[offset + 2] + dif;

                    data[offset] = (r > 255) ? 255 : (r < 0 ? 0 : r);
                    data[offset + 1] = (g > 255) ? 255 : (g < 0 ? 0 : g);
                    data[offset + 2] = (b > 255) ? 255 : (b < 0 ? 0 : b);
                } else {
                    var grey = greyLevel - dif;
                    if (grey < 0) {
                        grey = 0;
                    } else if (grey > 255) {
                        grey = 255;
                    }

                    data[offset] = data[offset + 1] = data[offset + 2] = grey;
                }

            } while (--x);
        } while (--y);
    };

    Konva.Factory.addGetterSetter(Konva.Node, 'embossStrength', 0.5, null, Konva.Factory.afterSetFilter);
    /**
    * get/set emboss strength. Use with {@link Konva.Filters.Emboss} filter.
    * @name embossStrength
    * @method
    * @memberof Konva.Node.prototype
    * @param {Number} level between 0 and 1.  Default is 0.5
    * @returns {Number}
    */

    Konva.Factory.addGetterSetter(Konva.Node, 'embossWhiteLevel', 0.5, null, Konva.Factory.afterSetFilter);
    /**
    * get/set emboss white level. Use with {@link Konva.Filters.Emboss} filter.
    * @name embossWhiteLevel
    * @method
    * @memberof Konva.Node.prototype
    * @param {Number} embossWhiteLevel between 0 and 1.  Default is 0.5
    * @returns {Number}
    */

    Konva.Factory.addGetterSetter(Konva.Node, 'embossDirection', 'top-left', null, Konva.Factory.afterSetFilter);
    /**
    * get/set emboss direction. Use with {@link Konva.Filters.Emboss} filter.
    * @name embossDirection
    * @method
    * @memberof Konva.Node.prototype
    * @param {String} embossDirection can be top-left, top, top-right, right, bottom-right, bottom, bottom-left or left
    *   The default is top-left
    * @returns {String}
    */

    Konva.Factory.addGetterSetter(Konva.Node, 'embossBlend', false, null, Konva.Factory.afterSetFilter);
    /**
    * get/set emboss blend. Use with {@link Konva.Filters.Emboss} filter.
    * @name embossBlend
    * @method
    * @memberof Konva.Node.prototype
    * @param {Boolean} embossBlend
    * @returns {Boolean}
    */
})();

(function () {
    'use strict';
    function remap(fromValue, fromMin, fromMax, toMin, toMax) {
        // Compute the range of the data
        var fromRange = fromMax - fromMin,
          toRange = toMax - toMin,
          toValue;

        // If either range is 0, then the value can only be mapped to 1 value
        if (fromRange === 0) {
            return toMin + toRange / 2;
        }
        if (toRange === 0) {
            return toMin;
        }

        // (1) untranslate, (2) unscale, (3) rescale, (4) retranslate
        toValue = (fromValue - fromMin) / fromRange;
        toValue = (toRange * toValue) + toMin;

        return toValue;
    }


    /**
    * Enhance Filter. Adjusts the colors so that they span the widest
    *  possible range (ie 0-255). Performs w*h pixel reads and w*h pixel
    *  writes.
    * @function
    * @name Enhance
    * @memberof Konva.Filters
    * @param {Object} imageData
    * @author ippo615
    * @example
    * node.cache();
    * node.filters([Konva.Filters.Enhance]);
    * node.enhance(0.4);
    */
    Konva.Filters.Enhance = function (imageData) {
        var data = imageData.data,
            nSubPixels = data.length,
            rMin = data[0], rMax = rMin, r,
            gMin = data[1], gMax = gMin, g,
            bMin = data[2], bMax = bMin, b,
            i;

        // If we are not enhancing anything - don't do any computation
        var enhanceAmount = this.enhance();
        if( enhanceAmount === 0 ){ return; }

        // 1st Pass - find the min and max for each channel:
        for (i = 0; i < nSubPixels; i += 4) {
            r = data[i + 0];
            if (r < rMin) { rMin = r; }
            else if (r > rMax) { rMax = r; }
            g = data[i + 1];
            if (g < gMin) { gMin = g; } else
            if (g > gMax) { gMax = g; }
            b = data[i + 2];
            if (b < bMin) { bMin = b; } else
            if (b > bMax) { bMax = b; }
            //a = data[i + 3];
            //if (a < aMin) { aMin = a; } else
            //if (a > aMax) { aMax = a; }
        }

        // If there is only 1 level - don't remap
        if( rMax === rMin ){ rMax = 255; rMin = 0; }
        if( gMax === gMin ){ gMax = 255; gMin = 0; }
        if( bMax === bMin ){ bMax = 255; bMin = 0; }

        var rMid, rGoalMax, rGoalMin,
            gMid, gGoalMax, gGoalMin,
            bMid, bGoalMax, bGoalMin;

        // If the enhancement is positive - stretch the histogram
        if ( enhanceAmount > 0 ){
            rGoalMax = rMax + enhanceAmount * (255 - rMax);
            rGoalMin = rMin - enhanceAmount * (rMin - 0);
            gGoalMax = gMax + enhanceAmount * (255 - gMax);
            gGoalMin = gMin - enhanceAmount * (gMin - 0);
            bGoalMax = bMax + enhanceAmount * (255 - bMax);
            bGoalMin = bMin - enhanceAmount * (bMin - 0);
        // If the enhancement is negative -   compress the histogram
        } else {
            rMid = (rMax + rMin) * 0.5;
            rGoalMax = rMax + enhanceAmount * (rMax - rMid);
            rGoalMin = rMin + enhanceAmount * (rMin - rMid);
            gMid = (gMax + gMin) * 0.5;
            gGoalMax = gMax + enhanceAmount * (gMax - gMid);
            gGoalMin = gMin + enhanceAmount * (gMin - gMid);
            bMid = (bMax + bMin) * 0.5;
            bGoalMax = bMax + enhanceAmount * (bMax - bMid);
            bGoalMin = bMin + enhanceAmount * (bMin - bMid);
        }

        // Pass 2 - remap everything, except the alpha
        for (i = 0; i < nSubPixels; i += 4) {
            data[i + 0] = remap(data[i + 0], rMin, rMax, rGoalMin, rGoalMax);
            data[i + 1] = remap(data[i + 1], gMin, gMax, gGoalMin, gGoalMax);
            data[i + 2] = remap(data[i + 2], bMin, bMax, bGoalMin, bGoalMax);
            //data[i + 3] = remap(data[i + 3], aMin, aMax, aGoalMin, aGoalMax);
        }
    };

    Konva.Factory.addGetterSetter(Konva.Node, 'enhance', 0, null, Konva.Factory.afterSetFilter);

    /**
    * get/set enhance. Use with {@link Konva.Filters.Enhance} filter.
    * @name enhance
    * @method
    * @memberof Konva.Node.prototype
    * @param {Float} amount
    * @returns {Float}
    */
})();

(function () {
    'use strict';
    /**
     * Posterize Filter. Adjusts the channels so that there are no more
     *  than n different values for that channel. This is also applied
     *  to the alpha channel.
     * @function
     * @name Posterize
     * @author ippo615
     * @memberof Konva.Filters
     * @param {Object} imageData
     * @example
     * node.cache();
     * node.filters([Konva.Filters.Posterize]);
     * node.levels(0.8);
     */

    Konva.Filters.Posterize = function (imageData) {
        // level must be between 1 and 255
        var levels = Math.round(this.levels() * 254) + 1,
            data = imageData.data,
            len = data.length,
            scale = (255 / levels),
            i;

        for (i = 0; i < len; i += 1) {
            data[i] = Math.floor(data[i] / scale) * scale;
        }
    };

    Konva.Factory.addGetterSetter(Konva.Node, 'levels', 0.5, null, Konva.Factory.afterSetFilter);

    /**
    * get/set levels.  Must be a number between 0 and 1.  Use with {@link Konva.Filters.Posterize} filter.
    * @name levels
    * @method
    * @memberof Konva.Node.prototype
    * @param {Number} level between 0 and 1
    * @returns {Number}
    */
})();

(function () {
    'use strict';

    /**
     * Noise Filter. Randomly adds or substracts to the color channels
     * @function
     * @name Noise
     * @memberof Konva.Filters
     * @param {Object} imageData
     * @author ippo615
     * @example
     * node.cache();
     * node.filters([Konva.Filters.Noise]);
     * node.noise(0.8);
     */
    Konva.Filters.Noise = function (imageData) {
        var amount = this.noise() * 255,
            data = imageData.data,
            nPixels = data.length,
            half = amount / 2,
            i;

        for (i = 0; i < nPixels; i += 4) {
            data[i + 0] += half - 2 * half * Math.random();
            data[i + 1] += half - 2 * half * Math.random();
            data[i + 2] += half - 2 * half * Math.random();
        }
    };

    Konva.Factory.addGetterSetter(Konva.Node, 'noise', 0.2, null, Konva.Factory.afterSetFilter);

    /**
    * get/set noise amount.  Must be a value between 0 and 1. Use with {@link Konva.Filters.Noise} filter.
    * @name noise
    * @method
    * @memberof Konva.Node.prototype
    * @param {Number} noise
    * @returns {Number}
    */
})();

/*eslint-disable max-depth */
(function () {
    'use strict';
    /**
     * Pixelate Filter. Averages groups of pixels and redraws
     *  them as larger pixels
     * @function
     * @name Pixelate
     * @memberof Konva.Filters
     * @param {Object} imageData
     * @author ippo615
     * @example
     * node.cache();
     * node.filters([Konva.Filters.Pixelate]);
     * node.pixelSize(10);
     */

    Konva.Filters.Pixelate = function (imageData) {

        var pixelSize = Math.ceil(this.pixelSize()),
            width = imageData.width,
            height = imageData.height,
            x, y, i,
            //pixelsPerBin = pixelSize * pixelSize,
            red, green, blue, alpha,
            nBinsX = Math.ceil(width / pixelSize),
            nBinsY = Math.ceil(height / pixelSize),
            xBinStart, xBinEnd, yBinStart, yBinEnd,
            xBin, yBin, pixelsInBin;
        imageData = imageData.data;

        for (xBin = 0; xBin < nBinsX; xBin += 1) {
            for (yBin = 0; yBin < nBinsY; yBin += 1) {

                // Initialize the color accumlators to 0
                red = 0;
                green = 0;
                blue = 0;
                alpha = 0;

                // Determine which pixels are included in this bin
                xBinStart = xBin * pixelSize;
                xBinEnd = xBinStart + pixelSize;
                yBinStart = yBin * pixelSize;
                yBinEnd = yBinStart + pixelSize;

                // Add all of the pixels to this bin!
                pixelsInBin = 0;
                for (x = xBinStart; x < xBinEnd; x += 1) {
                    if( x >= width ){ continue; }
                    for (y = yBinStart; y < yBinEnd; y += 1) {
                        if( y >= height ){ continue; }
                        i = (width * y + x) * 4;
                        red += imageData[i + 0];
                        green += imageData[i + 1];
                        blue += imageData[i + 2];
                        alpha += imageData[i + 3];
                        pixelsInBin += 1;
                    }
                }

                // Make sure the channels are between 0-255
                red = red / pixelsInBin;
                green = green / pixelsInBin;
                blue = blue / pixelsInBin;

                // Draw this bin
                for (x = xBinStart; x < xBinEnd; x += 1) {
                    if( x >= width ){ continue; }
                    for (y = yBinStart; y < yBinEnd; y += 1) {
                        if( y >= height ){ continue; }
                        i = (width * y + x) * 4;
                        imageData[i + 0] = red;
                        imageData[i + 1] = green;
                        imageData[i + 2] = blue;
                        imageData[i + 3] = alpha;
                    }
                }
            }
        }

    };

    Konva.Factory.addGetterSetter(Konva.Node, 'pixelSize', 8, null, Konva.Factory.afterSetFilter);

    /**
    * get/set pixel size. Use with {@link Konva.Filters.Pixelate} filter.
    * @name pixelSize
    * @method
    * @memberof Konva.Node.prototype
    * @param {Integer} pixelSize
    * @returns {Integer}
    */
})();

(function () {
    'use strict';
    /**
     * Threshold Filter. Pushes any value above the mid point to
     *  the max and any value below the mid point to the min.
     *  This affects the alpha channel.
     * @function
     * @name Threshold
     * @memberof Konva.Filters
     * @param {Object} imageData
     * @author ippo615
     * @example
     * node.cache();
     * node.filters([Konva.Filters.Threshold]);
     * node.threshold(0.1);
     */

    Konva.Filters.Threshold = function (imageData) {
        var level = this.threshold() * 255,
            data = imageData.data,
            len = data.length,
            i;

        for (i = 0; i < len; i += 1) {
            data[i] = data[i] < level ? 0 : 255;
        }
    };

    Konva.Factory.addGetterSetter(Konva.Node, 'threshold', 0.5, null, Konva.Factory.afterSetFilter);

    /**
    * get/set threshold.  Must be a value between 0 and 1. Use with {@link Konva.Filters.Threshold} or {@link Konva.Filters.Mask} filter.
    * @name threshold
    * @method
    * @memberof Konva.Node.prototype
    * @param {Number} threshold
    * @returns {Number}
    */
})();

(function() {
    'use strict';
    /**
     * Sepia Filter
     * Based on: Pixastic Lib - Sepia filter - v0.1.0
     * Copyright (c) 2008 Jacob Seidelin, jseidelin@nihilogic.dk, http://blog.nihilogic.dk/
     * @function
     * @name Sepia
     * @memberof Konva.Filters
     * @param {Object} imageData
     * @author Jacob Seidelin <jseidelin@nihilogic.dk>
     * @license MPL v1.1 [http://www.pixastic.com/lib/license.txt]
     * @example
     * node.cache();
     * node.filters([Konva.Filters.Sepia]);
     */
    Konva.Filters.Sepia = function (imageData) {
        var data = imageData.data,
            w = imageData.width,
            y = imageData.height,
            w4 = w * 4,
            offsetY, x, offset, or, og, ob, r, g, b;

        do {
            offsetY = (y - 1) * w4;
            x = w;
            do {
                offset = offsetY + (x - 1) * 4;

                or = data[offset];
                og = data[offset + 1];
                ob = data[offset + 2];

                r = or * 0.393 + og * 0.769 + ob * 0.189;
                g = or * 0.349 + og * 0.686 + ob * 0.168;
                b = or * 0.272 + og * 0.534 + ob * 0.131;

                data[offset] = r > 255 ? 255 : r;
                data[offset + 1] = g > 255 ? 255 : g;
                data[offset + 2] = b > 255 ? 255 : b;
                data[offset + 3] = data[offset + 3];
            } while (--x);
        } while (--y);
    };
})();

(function () {
    'use strict';
    /**
     * Solarize Filter
     * Pixastic Lib - Solarize filter - v0.1.0
     * Copyright (c) 2008 Jacob Seidelin, jseidelin@nihilogic.dk, http://blog.nihilogic.dk/
     * License: [http://www.pixastic.com/lib/license.txt]
     * @function
     * @name Solarize
     * @memberof Konva.Filters
     * @param {Object} imageData
     * @example
     * node.cache();
     * node.filters([Konva.Filters.Solarize]);
     */
    Konva.Filters.Solarize = function (imageData) {
        var data = imageData.data,
            w = imageData.width,
            h = imageData.height,
            w4 = w * 4,
            y = h;

        do {
            var offsetY = (y - 1) * w4;
            var x = w;
            do {
                var offset = offsetY + (x - 1) * 4;
                var r = data[offset];
                var g = data[offset + 1];
                var b = data[offset + 2];

                if (r > 127) {
                    r = 255 - r;
                }
                if (g > 127) {
                    g = 255 - g;
                }
                if (b > 127) {
                    b = 255 - b;
                }

                data[offset] = r;
                data[offset + 1] = g;
                data[offset + 2] = b;
            } while (--x);
        } while (--y);
    };
})();



(function () {
    'use strict';

  /*
   * ToPolar Filter. Converts image data to polar coordinates. Performs
   *  w*h*4 pixel reads and w*h pixel writes. The r axis is placed along
   *  what would be the y axis and the theta axis along the x axis.
   * @function
   * @author ippo615
   * @memberof Konva.Filters
   * @param {ImageData} src, the source image data (what will be transformed)
   * @param {ImageData} dst, the destination image data (where it will be saved)
   * @param {Object} opt
   * @param {Number} [opt.polarCenterX] horizontal location for the center of the circle,
   *  default is in the middle
   * @param {Number} [opt.polarCenterY] vertical location for the center of the circle,
   *  default is in the middle
   */

    var ToPolar = function(src, dst, opt){

        var srcPixels = src.data,
            dstPixels = dst.data,
            xSize = src.width,
            ySize = src.height,
            xMid = opt.polarCenterX || xSize / 2,
            yMid = opt.polarCenterY || ySize / 2,
            i, x, y, r = 0, g = 0, b = 0, a = 0;

        // Find the largest radius
        var rad, rMax = Math.sqrt( xMid * xMid + yMid * yMid );
        x = xSize - xMid;
        y = ySize - yMid;
        rad = Math.sqrt( x * x + y * y );
        rMax = (rad > rMax) ? rad : rMax;

        // We'll be uisng y as the radius, and x as the angle (theta=t)
        var rSize = ySize,
            tSize = xSize,
            radius, theta;

        // We want to cover all angles (0-360) and we need to convert to
        // radians (*PI/180)
        var conversion = 360 / tSize * Math.PI / 180, sin, cos;

        // var x1, x2, x1i, x2i, y1, y2, y1i, y2i, scale;

        for( theta = 0; theta < tSize; theta += 1 ){
            sin = Math.sin(theta * conversion);
            cos = Math.cos(theta * conversion);
            for( radius = 0; radius < rSize; radius += 1 ){
                x = Math.floor(xMid + rMax * radius / rSize * cos);
                y = Math.floor(yMid + rMax * radius / rSize * sin);
                i = (y * xSize + x) * 4;
                r = srcPixels[i + 0];
                g = srcPixels[i + 1];
                b = srcPixels[i + 2];
                a = srcPixels[i + 3];

                // Store it
                //i = (theta * xSize  +  radius) * 4;
                i = (theta + radius * xSize) * 4;
                dstPixels[i + 0] = r;
                dstPixels[i + 1] = g;
                dstPixels[i + 2] = b;
                dstPixels[i + 3] = a;

            }
        }
    };

    /*
     * FromPolar Filter. Converts image data from polar coordinates back to rectangular.
     *  Performs w*h*4 pixel reads and w*h pixel writes.
     * @function
     * @author ippo615
     * @memberof Konva.Filters
     * @param {ImageData} src, the source image data (what will be transformed)
     * @param {ImageData} dst, the destination image data (where it will be saved)
     * @param {Object} opt
     * @param {Number} [opt.polarCenterX] horizontal location for the center of the circle,
     *  default is in the middle
     * @param {Number} [opt.polarCenterY] vertical location for the center of the circle,
     *  default is in the middle
     * @param {Number} [opt.polarRotation] amount to rotate the image counterclockwis,
     *  0 is no rotation, 360 degrees is a full rotation
     */

    var FromPolar = function(src, dst, opt){

        var srcPixels = src.data,
            dstPixels = dst.data,
            xSize = src.width,
            ySize = src.height,
            xMid = opt.polarCenterX || xSize / 2,
            yMid = opt.polarCenterY || ySize / 2,
            i, x, y, dx, dy, r = 0, g = 0, b = 0, a = 0;


        // Find the largest radius
        var rad, rMax = Math.sqrt( xMid * xMid + yMid * yMid );
        x = xSize - xMid;
        y = ySize - yMid;
        rad = Math.sqrt( x * x + y * y );
        rMax = (rad > rMax) ? rad : rMax;

        // We'll be uisng x as the radius, and y as the angle (theta=t)
        var rSize = ySize,
        tSize = xSize,
        radius, theta,
        phaseShift = opt.polarRotation || 0;

        // We need to convert to degrees and we need to make sure
        // it's between (0-360)
        // var conversion = tSize/360*180/Math.PI;
        //var conversion = tSize/360*180/Math.PI;

        var x1, y1;

        for( x = 0; x < xSize; x += 1 ){
            for( y = 0; y < ySize; y += 1 ){
                dx = x - xMid;
                dy = y - yMid;
                radius = Math.sqrt(dx * dx + dy * dy) * rSize / rMax;
                theta = (Math.atan2(dy, dx) * 180 / Math.PI + 360 + phaseShift) % 360;
                theta = theta * tSize / 360;
                x1 = Math.floor(theta);
                y1 = Math.floor(radius);
                i = (y1 * xSize + x1) * 4;
                r = srcPixels[i + 0];
                g = srcPixels[i + 1];
                b = srcPixels[i + 2];
                a = srcPixels[i + 3];

                // Store it
                i = (y * xSize + x) * 4;
                dstPixels[i + 0] = r;
                dstPixels[i + 1] = g;
                dstPixels[i + 2] = b;
                dstPixels[i + 3] = a;
            }
        }

    };

    //Konva.Filters.ToPolar = Konva.Util._FilterWrapDoubleBuffer(ToPolar);
    //Konva.Filters.FromPolar = Konva.Util._FilterWrapDoubleBuffer(FromPolar);

    // create a temporary canvas for working - shared between multiple calls
    var tempCanvas = Konva.Util.createCanvasElement();

    /*
     * Kaleidoscope Filter.
     * @function
     * @name Kaleidoscope
     * @author ippo615
     * @memberof Konva.Filters
     * @example
     * node.cache();
     * node.filters([Konva.Filters.Kaleidoscope]);
     * node.kaleidoscopePower(3);
     * node.kaleidoscopeAngle(45);
     */
    Konva.Filters.Kaleidoscope = function(imageData){
        var xSize = imageData.width,
            ySize = imageData.height;

        var x, y, xoff, i, r, g, b, a, srcPos, dstPos;
        var power = Math.round( this.kaleidoscopePower() );
        var angle = Math.round( this.kaleidoscopeAngle() );
        var offset = Math.floor(xSize * (angle % 360) / 360);

        if( power < 1 ){return; }

        // Work with our shared buffer canvas
        tempCanvas.width = xSize;
        tempCanvas.height = ySize;
        var scratchData = tempCanvas.getContext('2d').getImageData(0, 0, xSize, ySize);

        // Convert thhe original to polar coordinates
        ToPolar( imageData, scratchData, {
            polarCenterX: xSize / 2,
            polarCenterY: ySize / 2
        });

        // Determine how big each section will be, if it's too small
        // make it bigger
        var minSectionSize = xSize / Math.pow(2, power);
        while( minSectionSize <= 8){
            minSectionSize = minSectionSize * 2;
            power -= 1;
        }
        minSectionSize = Math.ceil(minSectionSize);
        var sectionSize = minSectionSize;

        // Copy the offset region to 0
        // Depending on the size of filter and location of the offset we may need
        // to copy the section backwards to prevent it from rewriting itself
        var xStart = 0,
          xEnd = sectionSize,
          xDelta = 1;
        if( offset + minSectionSize > xSize ){
            xStart = sectionSize;
            xEnd = 0;
            xDelta = -1;
        }
        for( y = 0; y < ySize; y += 1 ){
            for( x = xStart; x !== xEnd; x += xDelta ){
                xoff = Math.round(x + offset) % xSize;
                srcPos = (xSize * y + xoff) * 4;
                r = scratchData.data[srcPos + 0];
                g = scratchData.data[srcPos + 1];
                b = scratchData.data[srcPos + 2];
                a = scratchData.data[srcPos + 3];
                dstPos = (xSize * y + x) * 4;
                scratchData.data[dstPos + 0] = r;
                scratchData.data[dstPos + 1] = g;
                scratchData.data[dstPos + 2] = b;
                scratchData.data[dstPos + 3] = a;
            }
        }

        // Perform the actual effect
        for( y = 0; y < ySize; y += 1 ){
            sectionSize = Math.floor( minSectionSize );
            for( i = 0; i < power; i += 1 ){
                for( x = 0; x < sectionSize + 1; x += 1 ){
                    srcPos = (xSize * y + x) * 4;
                    r = scratchData.data[srcPos + 0];
                    g = scratchData.data[srcPos + 1];
                    b = scratchData.data[srcPos + 2];
                    a = scratchData.data[srcPos + 3];
                    dstPos = (xSize * y + sectionSize * 2 - x - 1) * 4;
                    scratchData.data[dstPos + 0] = r;
                    scratchData.data[dstPos + 1] = g;
                    scratchData.data[dstPos + 2] = b;
                    scratchData.data[dstPos + 3] = a;
                }
                sectionSize *= 2;
            }
        }

        // Convert back from polar coordinates
        FromPolar(scratchData, imageData, {polarRotation: 0});
    };

    /**
    * get/set kaleidoscope power. Use with {@link Konva.Filters.Kaleidoscope} filter.
    * @name kaleidoscopePower
    * @method
    * @memberof Konva.Node.prototype
    * @param {Integer} power of kaleidoscope
    * @returns {Integer}
    */
    Konva.Factory.addGetterSetter(Konva.Node, 'kaleidoscopePower', 2, null, Konva.Factory.afterSetFilter);

    /**
    * get/set kaleidoscope angle. Use with {@link Konva.Filters.Kaleidoscope} filter.
    * @name kaleidoscopeAngle
    * @method
    * @memberof Konva.Node.prototype
    * @param {Integer} degrees
    * @returns {Integer}
    */
    Konva.Factory.addGetterSetter(Konva.Node, 'kaleidoscopeAngle', 0, null, Konva.Factory.afterSetFilter);

})();

(function() {
    'use strict';

    function isValidSelector(selector) {
        if (typeof selector !== 'string') {
            return false;
        }
        var firstChar = selector[0];
        return firstChar === '#' || firstChar === '.' || firstChar === firstChar.toUpperCase();
    }
    /**
     * Container constructor.&nbsp; Containers are used to contain nodes or other containers
     * @constructor
     * @memberof Konva
     * @augments Konva.Node
     * @abstract
     * @param {Object} config
     * @param {Number} [config.x]
     * @param {Number} [config.y]
     * @param {Number} [config.width]
     * @param {Number} [config.height]
     * @param {Boolean} [config.visible]
     * @param {Boolean} [config.listening] whether or not the node is listening for events
     * @param {String} [config.id] unique id
     * @param {String} [config.name] non-unique name
     * @param {Number} [config.opacity] determines node opacity.  Can be any number between 0 and 1
     * @param {Object} [config.scale] set scale
     * @param {Number} [config.scaleX] set scale x
     * @param {Number} [config.scaleY] set scale y
     * @param {Number} [config.rotation] rotation in degrees
     * @param {Object} [config.offset] offset from center point and rotation point
     * @param {Number} [config.offsetX] set offset x
     * @param {Number} [config.offsetY] set offset y
     * @param {Boolean} [config.draggable] makes the node draggable.  When stages are draggable, you can drag and drop
     *  the entire stage by dragging any portion of the stage
     * @param {Number} [config.dragDistance]
     * @param {Function} [config.dragBoundFunc]
     * * @param {Object} [config.clip] set clip
     * @param {Number} [config.clipX] set clip x
     * @param {Number} [config.clipY] set clip y
     * @param {Number} [config.clipWidth] set clip width
     * @param {Number} [config.clipHeight] set clip height

     */
    Konva.Container = function(config) {
        this.__init(config);
    };

    Konva.Util.addMethods(Konva.Container, {
        __init: function(config) {
            this.children = new Konva.Collection();
            Konva.Node.call(this, config);
        },
        /**
         * returns a {@link Konva.Collection} of direct descendant nodes
         * @method
         * @memberof Konva.Container.prototype
         * @param {Function} [filterFunc] filter function
         * @returns {Konva.Collection}
         * @example
         * // get all children
         * var children = layer.getChildren();
         *
         * // get only circles
         * var circles = layer.getChildren(function(node){
         *    return node.getClassName() === 'Circle';
         * });
         */
        getChildren: function(filterFunc) {
            if (!filterFunc) {
                return this.children;
            }

            var results = new Konva.Collection();
            this.children.each(function(child){
                if (filterFunc(child)) {
                    results.push(child);
                }
            });
            return results;
        },
        /**
         * determine if node has children
         * @method
         * @memberof Konva.Container.prototype
         * @returns {Boolean}
         */
        hasChildren: function() {
            return this.getChildren().length > 0;
        },
        /**
         * remove all children
         * @method
         * @memberof Konva.Container.prototype
         */
        removeChildren: function() {
            var children = Konva.Collection.toCollection(this.children);
            var child;
            for (var i = 0; i < children.length; i++) {
                child = children[i];
                // reset parent to prevent many _setChildrenIndices calls
                delete child.parent;
                child.index = 0;
                if (child.hasChildren()) {
                    child.removeChildren();
                }
                child.remove();
            }
            children = null;
            this.children = new Konva.Collection();
            return this;
        },
        /**
         * destroy all children
         * @method
         * @memberof Konva.Container.prototype
         */
        destroyChildren: function() {
           var children = Konva.Collection.toCollection(this.children);
            var child;
            for (var i = 0; i < children.length; i++) {
                child = children[i];
                // reset parent to prevent many _setChildrenIndices calls
                delete child.parent;
                child.index = 0;
                child.destroy();
            }
            children = null;
            this.children = new Konva.Collection();
            return this;
        },
        /**
         * Add node or nodes to container.
         * @method
         * @memberof Konva.Container.prototype
         * @param {...Konva.Node} child
         * @returns {Container}
         * @example
         * layer.add(shape1, shape2, shape3);
         */
        add: function(child) {
            if (arguments.length > 1) {
                for (var i = 0; i < arguments.length; i++) {
                    this.add(arguments[i]);
                }
                return this;
            }
            if (child.getParent()) {
                child.moveTo(this);
                return this;
            }
            var children = this.children;
            this._validateAdd(child);
            child.index = children.length;
            child.parent = this;
            children.push(child);
            this._fire('add', {
                child: child
            });

            // if node under drag we need to update drag animation
            if (Konva.DD && child.isDragging()) {
                Konva.DD.anim.setLayers(child.getLayer());
            }

            // chainable
            return this;
        },
        destroy: function() {
            // destroy children
            if (this.hasChildren()) {
                this.destroyChildren();
            }
            // then destroy self
            Konva.Node.prototype.destroy.call(this);
        },
        /**
         * return a {@link Konva.Collection} of nodes that match the selector.  Use '#' for id selections
         * and '.' for name selections.  You can also select by type or class name. Pass multiple selectors
         * separated by a space.
         * @method
         * @memberof Konva.Container.prototype
         * @param {String} selector
         * @returns {Collection}
         * @example
         * // select node with id foo
         * var node = stage.find('#foo');
         *
         * // select nodes with name bar inside layer
         * var nodes = layer.find('.bar');
         *
         * // select all groups inside layer
         * var nodes = layer.find('Group');
         *
         * // select all rectangles inside layer
         * var nodes = layer.find('Rect');
         *
         * // select node with an id of foo or a name of bar inside layer
         * var nodes = layer.find('#foo, .bar');
         */
        find: function(selector) {
            var retArr = [],
                selectorArr = selector.replace(/ /g, '').split(','),
                len = selectorArr.length,
                n, i, sel, arr, node, children, clen;

            for (n = 0; n < len; n++) {
                sel = selectorArr[n];
                if (!isValidSelector(sel)) {
                    Konva.Util.warn('Selector "' + sel + '" is invalid. Allowed selectors examples are "#foo", ".bar" or "Group".');
                    Konva.Util.warn('If you have a custom shape with such className, please change it to start with upper letter like "Triangle".');
                    Konva.Util.warn('Konva is awesome, right?');
                }
                // id selector
                if(sel.charAt(0) === '#') {
                    node = this._getNodeById(sel.slice(1));
                    if(node) {
                        retArr.push(node);
                    }
                }
                // name selector
                else if(sel.charAt(0) === '.') {
                    arr = this._getNodesByName(sel.slice(1));
                    retArr = retArr.concat(arr);
                }
                // unrecognized selector, pass to children
                else {
                    children = this.getChildren();
                    clen = children.length;
                    for(i = 0; i < clen; i++) {
                        retArr = retArr.concat(children[i]._get(sel));
                    }
                }
            }

            return Konva.Collection.toCollection(retArr);
        },
        /**
         * return a first node from `find` method
         * @method
         * @memberof Konva.Container.prototype
         * @param {String} selector
         * @returns {Konva.Node}
         * @example
         * // select node with id foo
         * var node = stage.findOne('#foo');
         *
         * // select node with name bar inside layer
         * var nodes = layer.findOne('.bar');
         */
        findOne: function(selector) {
            return this.find(selector)[0];
        },
        _getNodeById: function(key) {
            var node = Konva.ids[key];

            if(node !== undefined && this.isAncestorOf(node)) {
                return node;
            }
            return null;
        },
        _getNodesByName: function(key) {
            var arr = Konva.names[key] || [];
            return this._getDescendants(arr);
        },
        _get: function(selector) {
            var retArr = Konva.Node.prototype._get.call(this, selector);
            var children = this.getChildren();
            var len = children.length;
            for(var n = 0; n < len; n++) {
                retArr = retArr.concat(children[n]._get(selector));
            }
            return retArr;
        },
        // extenders
        toObject: function() {
            var obj = Konva.Node.prototype.toObject.call(this);

            obj.children = [];

            var children = this.getChildren();
            var len = children.length;
            for(var n = 0; n < len; n++) {
                var child = children[n];
                obj.children.push(child.toObject());
            }

            return obj;
        },
        _getDescendants: function(arr) {
            var retArr = [];
            var len = arr.length;
            for(var n = 0; n < len; n++) {
                var node = arr[n];
                if(this.isAncestorOf(node)) {
                    retArr.push(node);
                }
            }

            return retArr;
        },
        /**
         * determine if node is an ancestor
         * of descendant
         * @method
         * @memberof Konva.Container.prototype
         * @param {Konva.Node} node
         */
        isAncestorOf: function(node) {
            var parent = node.getParent();
            while(parent) {
                if(parent._id === this._id) {
                    return true;
                }
                parent = parent.getParent();
            }

            return false;
        },
        clone: function(obj) {
            // call super method
            var node = Konva.Node.prototype.clone.call(this, obj);

            this.getChildren().each(function(no) {
                node.add(no.clone());
            });
            return node;
        },
        /**
         * get all shapes that intersect a point.  Note: because this method must clear a temporary
         * canvas and redraw every shape inside the container, it should only be used for special sitations
         * because it performs very poorly.  Please use the {@link Konva.Stage#getIntersection} method if at all possible
         * because it performs much better
         * @method
         * @memberof Konva.Container.prototype
         * @param {Object} pos
         * @param {Number} pos.x
         * @param {Number} pos.y
         * @returns {Array} array of shapes
         */
        getAllIntersections: function(pos) {
            var arr = [];

            this.find('Shape').each(function(shape) {
                if(shape.isVisible() && shape.intersects(pos)) {
                    arr.push(shape);
                }
            });

            return arr;
        },
        _setChildrenIndices: function() {
            this.children.each(function(child, n) {
                child.index = n;
            });
        },
        drawScene: function(can, top, caching) {
            var layer = this.getLayer(),
                canvas = can || (layer && layer.getCanvas()),
                context = canvas && canvas.getContext(),
                cachedCanvas = this._cache.canvas,
                cachedSceneCanvas = cachedCanvas && cachedCanvas.scene;

            if (this.isVisible()) {
                if (!caching && cachedSceneCanvas) {
                    context.save();
                    layer._applyTransform(this, context, top);
                    this._drawCachedSceneCanvas(context);
                    context.restore();
                }
                else {
                    this._drawChildren(canvas, 'drawScene', top, false, caching);
                }
            }
            return this;
        },
        drawHit: function(can, top, caching) {
            var layer = this.getLayer(),
                canvas = can || (layer && layer.hitCanvas),
                context = canvas && canvas.getContext(),
                cachedCanvas = this._cache.canvas,
                cachedHitCanvas = cachedCanvas && cachedCanvas.hit;

            if (this.shouldDrawHit(canvas)) {
                if (layer) {
                    layer.clearHitCache();
                }
                if (!caching && cachedHitCanvas) {
                    context.save();
                    layer._applyTransform(this, context, top);
                    this._drawCachedHitCanvas(context);
                    context.restore();
                }
                else {
                    this._drawChildren(canvas, 'drawHit', top);
                }
            }
            return this;
        },
        _drawChildren: function(canvas, drawMethod, top, caching, skipBuffer) {
            var layer = this.getLayer(),
                context = canvas && canvas.getContext(),
                clipWidth = this.getClipWidth(),
                clipHeight = this.getClipHeight(),
                hasClip = clipWidth && clipHeight,
                clipX, clipY;

            if (hasClip && layer) {
                clipX = this.getClipX();
                clipY = this.getClipY();

                context.save();
                layer._applyTransform(this, context);
                context.beginPath();
                context.rect(clipX, clipY, clipWidth, clipHeight);
                context.clip();
                context.reset();
            }

            this.children.each(function(child) {
                child[drawMethod](canvas, top, caching, skipBuffer);
            });

            if (hasClip) {
                context.restore();
            }
        },
        shouldDrawHit: function(canvas) {
            var layer = this.getLayer();
            var dd = Konva.DD;
            var layerUnderDrag = dd && Konva.isDragging() && (Konva.DD.anim.getLayers().indexOf(layer) !== -1);
            return (canvas && canvas.isCache) || (layer && layer.hitGraphEnabled())
                && this.isVisible() && !layerUnderDrag;
        },
        getClientRect: function(skipTransform) {
            var minX, minY, maxX, maxY;
            var selfRect = {
                x: 0,
                y: 0,
                width: 0,
                height: 0
            };
            this.children.each(function(child) {
                var rect = child.getClientRect();

                // skip invisible children (like empty groups)
                // or don't skip... hmmm...
                // if (rect.width === 0 && rect.height === 0) {
                //     return;
                // }

                if (minX === undefined) { // initial value for first child
                    minX = rect.x;
                    minY = rect.y;
                    maxX = rect.x + rect.width;
                    maxY = rect.y + rect.height;
                } else {
                    minX = Math.min(minX, rect.x);
                    minY = Math.min(minY, rect.y);
                    maxX = Math.max(maxX, rect.x + rect.width);
                    maxY = Math.max(maxY, rect.y + rect.height);
                }

            });

            if (this.children.length !== 0) {
                selfRect = {
                    x: minX,
                    y: minY,
                    width: maxX - minX,
                    height: maxY - minY
                };
            }

            if (!skipTransform) {
                return this._transformedRect(selfRect);
            }
            return selfRect;
        }
    });

    Konva.Util.extend(Konva.Container, Konva.Node);
    // deprecated methods
    Konva.Container.prototype.get = Konva.Container.prototype.find;

    // add getters setters
    Konva.Factory.addComponentsGetterSetter(Konva.Container, 'clip', ['x', 'y', 'width', 'height']);
    /**
     * get/set clip
     * @method
     * @name clip
     * @memberof Konva.Container.prototype
     * @param {Object} clip
     * @param {Number} clip.x
     * @param {Number} clip.y
     * @param {Number} clip.width
     * @param {Number} clip.height
     * @returns {Object}
     * @example
     * // get clip
     * var clip = container.clip();
     *
     * // set clip
     * container.setClip({
     *   x: 20,
     *   y: 20,
     *   width: 20,
     *   height: 20
     * });
     */

    Konva.Factory.addGetterSetter(Konva.Container, 'clipX');
    /**
     * get/set clip x
     * @name clipX
     * @method
     * @memberof Konva.Container.prototype
     * @param {Number} x
     * @returns {Number}
     * @example
     * // get clip x
     * var clipX = container.clipX();
     *
     * // set clip x
     * container.clipX(10);
     */

    Konva.Factory.addGetterSetter(Konva.Container, 'clipY');
    /**
     * get/set clip y
     * @name clipY
     * @method
     * @memberof Konva.Container.prototype
     * @param {Number} y
     * @returns {Number}
     * @example
     * // get clip y
     * var clipY = container.clipY();
     *
     * // set clip y
     * container.clipY(10);
     */

    Konva.Factory.addGetterSetter(Konva.Container, 'clipWidth');
    /**
     * get/set clip width
     * @name clipWidth
     * @method
     * @memberof Konva.Container.prototype
     * @param {Number} width
     * @returns {Number}
     * @example
     * // get clip width
     * var clipWidth = container.clipWidth();
     *
     * // set clip width
     * container.clipWidth(100);
     */

    Konva.Factory.addGetterSetter(Konva.Container, 'clipHeight');
    /**
     * get/set clip height
     * @name clipHeight
     * @method
     * @memberof Konva.Container.prototype
     * @param {Number} height
     * @returns {Number}
     * @example
     * // get clip height
     * var clipHeight = container.clipHeight();
     *
     * // set clip height
     * container.clipHeight(100);
     */

    Konva.Collection.mapMethods(Konva.Container);
})();

(function(Konva) {
    'use strict';
    var HAS_SHADOW = 'hasShadow';
    var SHADOW_RGBA = 'shadowRGBA';

    function _fillFunc(context) {
        context.fill();
    }
    function _strokeFunc(context) {
        context.stroke();
    }
    function _fillFuncHit(context) {
        context.fill();
    }
    function _strokeFuncHit(context) {
        context.stroke();
    }

    function _clearHasShadowCache() {
        this._clearCache(HAS_SHADOW);
    }

    function _clearGetShadowRGBACache() {
        this._clearCache(SHADOW_RGBA);
    }

    /**
     * Shape constructor.  Shapes are primitive objects such as rectangles,
     *  circles, text, lines, etc.
     * @constructor
     * @memberof Konva
     * @augments Konva.Node
     * @param {Object} config
     * @param {String} [config.fill] fill color
     * @param {Image} [config.fillPatternImage] fill pattern image
     * @param {Number} [config.fillPatternX]
     * @param {Number} [config.fillPatternY]
     * @param {Object} [config.fillPatternOffset] object with x and y component
     * @param {Number} [config.fillPatternOffsetX] 
     * @param {Number} [config.fillPatternOffsetY] 
     * @param {Object} [config.fillPatternScale] object with x and y component
     * @param {Number} [config.fillPatternScaleX]
     * @param {Number} [config.fillPatternScaleY]
     * @param {Number} [config.fillPatternRotation]
     * @param {String} [config.fillPatternRepeat] can be "repeat", "repeat-x", "repeat-y", or "no-repeat".  The default is "no-repeat"
     * @param {Object} [config.fillLinearGradientStartPoint] object with x and y component
     * @param {Number} [config.fillLinearGradientStartPointX]
     * @param {Number} [config.fillLinearGradientStartPointY]
     * @param {Object} [config.fillLinearGradientEndPoint] object with x and y component
     * @param {Number} [config.fillLinearGradientEndPointX]
     * @param {Number} [config.fillLinearGradientEndPointY]
     * @param {Array} [config.fillLinearGradientColorStops] array of color stops
     * @param {Object} [config.fillRadialGradientStartPoint] object with x and y component
     * @param {Number} [config.fillRadialGradientStartPointX]
     * @param {Number} [config.fillRadialGradientStartPointY]
     * @param {Object} [config.fillRadialGradientEndPoint] object with x and y component
     * @param {Number} [config.fillRadialGradientEndPointX] 
     * @param {Number} [config.fillRadialGradientEndPointY] 
     * @param {Number} [config.fillRadialGradientStartRadius]
     * @param {Number} [config.fillRadialGradientEndRadius]
     * @param {Array} [config.fillRadialGradientColorStops] array of color stops
     * @param {Boolean} [config.fillEnabled] flag which enables or disables the fill.  The default value is true
     * @param {String} [config.fillPriority] can be color, linear-gradient, radial-graident, or pattern.  The default value is color.  The fillPriority property makes it really easy to toggle between different fill types.  For example, if you want to toggle between a fill color style and a fill pattern style, simply set the fill property and the fillPattern properties, and then use setFillPriority('color') to render the shape with a color fill, or use setFillPriority('pattern') to render the shape with the pattern fill configuration
     * @param {String} [config.stroke] stroke color
     * @param {Number} [config.strokeWidth] stroke width
     * @param {Boolean} [config.strokeHitEnabled] flag which enables or disables stroke hit region.  The default is true
     * @param {Boolean} [config.perfectDrawEnabled] flag which enables or disables using buffer canvas.  The default is true
     * @param {Boolean} [config.shadowForStrokeEnabled] flag which enables or disables shasow for stroke.  The default is true
     * @param {Boolean} [config.strokeScaleEnabled] flag which enables or disables stroke scale.  The default is true
     * @param {Boolean} [config.strokeEnabled] flag which enables or disables the stroke.  The default value is true
     * @param {String} [config.lineJoin] can be miter, round, or bevel.  The default
     *  is miter
     * @param {String} [config.lineCap] can be butt, round, or sqare.  The default
     *  is butt
     * @param {String} [config.shadowColor]
     * @param {Number} [config.shadowBlur]
     * @param {Object} [config.shadowOffset] object with x and y component
     * @param {Number} [config.shadowOffsetX]
     * @param {Number} [config.shadowOffsetY]
     * @param {Number} [config.shadowOpacity] shadow opacity.  Can be any real number
     *  between 0 and 1
     * @param {Boolean} [config.shadowEnabled] flag which enables or disables the shadow.  The default value is true
     * @param {Array} [config.dash]
     * @param {Boolean} [config.dashEnabled] flag which enables or disables the dashArray.  The default value is true
     * @param {Number} [config.x]
     * @param {Number} [config.y]
     * @param {Number} [config.width]
     * @param {Number} [config.height]
     * @param {Boolean} [config.visible]
     * @param {Boolean} [config.listening] whether or not the node is listening for events
     * @param {String} [config.id] unique id
     * @param {String} [config.name] non-unique name
     * @param {Number} [config.opacity] determines node opacity.  Can be any number between 0 and 1
     * @param {Object} [config.scale] set scale
     * @param {Number} [config.scaleX] set scale x
     * @param {Number} [config.scaleY] set scale y
     * @param {Number} [config.rotation] rotation in degrees
     * @param {Object} [config.offset] offset from center point and rotation point
     * @param {Number} [config.offsetX] set offset x
     * @param {Number} [config.offsetY] set offset y
     * @param {Boolean} [config.draggable] makes the node draggable.  When stages are draggable, you can drag and drop
     *  the entire stage by dragging any portion of the stage
     * @param {Number} [config.dragDistance]
     * @param {Function} [config.dragBoundFunc]
     * @example
     * var customShape = new Konva.Shape({
         *   x: 5,
         *   y: 10,
         *   fill: 'red',
         *   // a Konva.Canvas renderer is passed into the drawFunc function
         *   drawFunc: function(context) {
         *     context.beginPath();
         *     context.moveTo(200, 50);
         *     context.lineTo(420, 80);
         *     context.quadraticCurveTo(300, 100, 260, 170);
         *     context.closePath();
         *     context.fillStrokeShape(this);
         *   }
         *});
     */
    Konva.Shape = function(config) {
        this.__init(config);
    };

    Konva.Util.addMethods(Konva.Shape, {
        __init: function(config) {
            this.nodeType = 'Shape';
            this._fillFunc = _fillFunc;
            this._strokeFunc = _strokeFunc;
            this._fillFuncHit = _fillFuncHit;
            this._strokeFuncHit = _strokeFuncHit;

            // set colorKey
            var shapes = Konva.shapes;
            var key;

            while(true) {
                key = Konva.Util.getRandomColor();
                if(key && !( key in shapes)) {
                    break;
                }
            }

            this.colorKey = key;
            shapes[key] = this;

            // call super constructor
            Konva.Node.call(this, config);

            this.on('shadowColorChange.konva shadowBlurChange.konva shadowOffsetChange.konva shadowOpacityChange.konva shadowEnabledChange.konva', _clearHasShadowCache);

            this.on('shadowColorChange.konva shadowOpacityChange.konva shadowEnabledChange.konva', _clearGetShadowRGBACache);
        },
        hasChildren: function() {
            return false;
        },
        getChildren: function() {
            return [];
        },
        /**
         * get canvas context tied to the layer
         * @method
         * @memberof Konva.Shape.prototype
         * @returns {Konva.Context}
         */
        getContext: function() {
            return this.getLayer().getContext();
        },
        /**
         * get canvas renderer tied to the layer.  Note that this returns a canvas renderer, not a canvas element
         * @method
         * @memberof Konva.Shape.prototype
         * @returns {Konva.Canvas}
         */
        getCanvas: function() {
            return this.getLayer().getCanvas();
        },
        /**
         * returns whether or not a shadow will be rendered
         * @method
         * @memberof Konva.Shape.prototype
         * @returns {Boolean}
         */
        hasShadow: function() {
            return this._getCache(HAS_SHADOW, this._hasShadow);
        },
        _hasShadow: function() {
            return this.getShadowEnabled() && (this.getShadowOpacity() !== 0 && !!(this.getShadowColor() || this.getShadowBlur() || this.getShadowOffsetX() || this.getShadowOffsetY()));
        },
        getShadowRGBA: function() {
            return this._getCache(SHADOW_RGBA, this._getShadowRGBA);
        },
        _getShadowRGBA: function() {
            if (this.hasShadow()) {
                var rgba = Konva.Util.colorToRGBA(this.shadowColor());
                return 'rgba(' + rgba.r + ',' + rgba.g + ',' + rgba.b + ',' + (rgba.a * (this.getShadowOpacity() || 1)) + ')';
            }
        },
        /**
         * returns whether or not the shape will be filled
         * @method
         * @memberof Konva.Shape.prototype
         * @returns {Boolean}
         */
        hasFill: function() {
            return !!(this.getFill() || this.getFillPatternImage() || this.getFillLinearGradientColorStops() || this.getFillRadialGradientColorStops());
        },
        /**
         * returns whether or not the shape will be stroked
         * @method
         * @memberof Konva.Shape.prototype
         * @returns {Boolean}
         */
        hasStroke: function() {
            return !!(this.stroke());
        },
        /**
         * determines if point is in the shape, regardless if other shapes are on top of it.  Note: because
         *  this method clears a temporary canvas and then redraws the shape, it performs very poorly if executed many times
         *  consecutively.  Please use the {@link Konva.Stage#getIntersection} method if at all possible
         *  because it performs much better
         * @method
         * @memberof Konva.Shape.prototype
         * @param {Object} point
         * @param {Number} point.x
         * @param {Number} point.y
         * @returns {Boolean}
         */
        intersects: function(point) {
            var stage = this.getStage(),
                bufferHitCanvas = stage.bufferHitCanvas,
                p;

            bufferHitCanvas.getContext().clear();
            this.drawScene(bufferHitCanvas);
            p = bufferHitCanvas.context.getImageData(Math.round(point.x), Math.round(point.y), 1, 1).data;
            return p[3] > 0;
        },
        // extends Node.prototype.destroy
        destroy: function() {
            Konva.Node.prototype.destroy.call(this);
            delete Konva.shapes[this.colorKey];
        },
        _useBufferCanvas: function(caching) {
            return !caching && (this.perfectDrawEnabled() && (this.getAbsoluteOpacity() !== 1) && this.hasFill() && this.hasStroke() && this.getStage()) ||
                   (this.perfectDrawEnabled() && this.hasShadow() && (this.getAbsoluteOpacity() !== 1) && this.hasFill() && this.hasStroke() && this.getStage());
        },
        /**
         * return self rectangle (x, y, width, height) of shape.
         * This method are not taken into account transformation and styles.
         * @method
         * @memberof Konva.Node.prototype
         * @returns {Object} rect with {x, y, width, height} properties
         * @example
         *
         * rect.getSelfRect();  // return {x:0, y:0, width:rect.width(), height:rect.height()}
         * circle.getSelfRect();  // return {x: - circle.width() / 2, y: - circle.height() / 2, width:circle.width(), height:circle.height()}
         *
         */
        getSelfRect: function() {
            var size = this.getSize();
            return {
                x: this._centroid ? Math.round(-size.width / 2) : 0,
                y: this._centroid ? Math.round(-size.height / 2) : 0,
                width: size.width,
                height: size.height
            };
        },
        getClientRect: function(skipTransform) {
            var fillRect = this.getSelfRect();

            var strokeWidth = (this.hasStroke() && this.strokeWidth()) || 0;
            var fillAndStrokeWidth = fillRect.width + strokeWidth;
            var fillAndStrokeHeight = fillRect.height + strokeWidth;

            var shadowOffsetX = this.shadowOffsetX();
            var shadowOffsetY = this.shadowOffsetY();

            var preWidth = fillAndStrokeWidth + Math.abs(shadowOffsetX);
            var preHeight = fillAndStrokeHeight + Math.abs(shadowOffsetY);

            var blurRadius = (this.hasShadow() && this.shadowBlur() || 0);

            var width = preWidth + blurRadius * 2;
            var height = preHeight + blurRadius * 2;

            // if stroke, for example = 3
            // we need to set x to 1.5, but after Math.round it will be 2
            // as we have additional offset we need to increase width and height by 1 pixel
            var roundingOffset = 0;
            if (Math.round(strokeWidth / 2) !== strokeWidth / 2) {
                roundingOffset = 1;
            }
            var rect = {
                width: width + roundingOffset,
                height: height + roundingOffset,
                x: -Math.round(strokeWidth / 2 + blurRadius) + Math.min(shadowOffsetX, 0) + fillRect.x,
                y: -Math.round(strokeWidth / 2 + blurRadius) + Math.min(shadowOffsetY, 0) + fillRect.y
            };
            if (!skipTransform) {
                return this._transformedRect(rect);
            }
            return rect;
        },
        drawScene: function(can, top, caching, skipBuffer) {
            var layer = this.getLayer(),
                canvas = can || layer.getCanvas(),
                context = canvas.getContext(),
                cachedCanvas = this._cache.canvas,
                drawFunc = this.sceneFunc(),
                hasShadow = this.hasShadow(),
                hasStroke = this.hasStroke(),
                stage, bufferCanvas, bufferContext;

            if(!this.isVisible()) {
                return this;
            }
            if (cachedCanvas) {
                context.save();
                layer._applyTransform(this, context, top);
                this._drawCachedSceneCanvas(context);
                context.restore();
                return this;
            }
            if (!drawFunc) {
                return this;
            }
            context.save();
            // if buffer canvas is needed
            if (this._useBufferCanvas(caching) && !skipBuffer) {
                stage = this.getStage();
                bufferCanvas = stage.bufferCanvas;
                bufferContext = bufferCanvas.getContext();
                bufferContext.clear();
                bufferContext.save();
                bufferContext._applyLineJoin(this);
                // layer might be undefined if we are using cache before adding to layer
                if (!caching) {
                    if (layer) {
                        layer._applyTransform(this, bufferContext, top);
                    } else {
                        var m = this.getAbsoluteTransform(top).getMatrix();
                        context.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
                    }
                }

                drawFunc.call(this, bufferContext);
                bufferContext.restore();

                if (hasShadow && !canvas.hitCanvas) {
                        context.save();
                        context._applyShadow(this);
                        context._applyOpacity(this);
                        context.drawImage(bufferCanvas._canvas, 0, 0);
                        context.restore();
                } else {
                    context._applyOpacity(this);
                    context.drawImage(bufferCanvas._canvas, 0, 0);
                }
            }
            // if buffer canvas is not needed
            else {
                context._applyLineJoin(this);
                // layer might be undefined if we are using cache before adding to layer
                if (!caching) {
                    if (layer) {
                        layer._applyTransform(this, context, top);
                    } else {
                        var o = this.getAbsoluteTransform(top).getMatrix();
                        context.transform(o[0], o[1], o[2], o[3], o[4], o[5]);
                    }
                }

                if (hasShadow && hasStroke && !canvas.hitCanvas) {
                    context.save();
                    // apply shadow
                    if (!caching) {
                        context._applyOpacity(this);
                    }
                    context._applyShadow(this);
                    drawFunc.call(this, context);
                    context.restore();
                    // if shape has stroke we need to redraw shape
                    // otherwise we will see a shadow under stroke (and over fill)
                    // but I think this is unexpected behavior
                    if (this.hasFill() && this.getShadowForStrokeEnabled()) {
                        drawFunc.call(this, context);
                    }
                } else if (hasShadow && !canvas.hitCanvas) {
                    context.save();
                    if (!caching) {
                        context._applyOpacity(this);
                    }
                    context._applyShadow(this);
                    drawFunc.call(this, context);
                    context.restore();
                } else {
                    if (!caching) {
                        context._applyOpacity(this);
                    }
                    drawFunc.call(this, context);
                }
            }
            context.restore();
            return this;
        },
        drawHit: function(can, top, caching) {
            var layer = this.getLayer(),
                canvas = can || layer.hitCanvas,
                context = canvas.getContext(),
                drawFunc = this.hitFunc() || this.sceneFunc(),
                cachedCanvas = this._cache.canvas,
                cachedHitCanvas = cachedCanvas && cachedCanvas.hit;

            if(!this.shouldDrawHit(canvas)) {
                return this;
            }
            if (layer) {
                layer.clearHitCache();
            }
            if (cachedHitCanvas) {
                context.save();
                layer._applyTransform(this, context, top);
                this._drawCachedHitCanvas(context);
                context.restore();
                return this;
            }
            if (!drawFunc) {
                return this;
            }
            context.save();
            context._applyLineJoin(this);
            if (!caching) {
                if (layer) {
                    layer._applyTransform(this, context, top);
                } else {
                    var o = this.getAbsoluteTransform(top).getMatrix();
                    context.transform(o[0], o[1], o[2], o[3], o[4], o[5]);
                }
            }
            drawFunc.call(this, context);
            context.restore();
            return this;
        },
        /**
        * draw hit graph using the cached scene canvas
        * @method
        * @memberof Konva.Shape.prototype
        * @param {Integer} alphaThreshold alpha channel threshold that determines whether or not
        *  a pixel should be drawn onto the hit graph.  Must be a value between 0 and 255.
        *  The default is 0
        * @returns {Konva.Shape}
        * @example
        * shape.cache();
        * shape.drawHitFromCache();
        */
        drawHitFromCache: function(alphaThreshold) {
            var threshold = alphaThreshold || 0,
                cachedCanvas = this._cache.canvas,
                sceneCanvas = this._getCachedSceneCanvas(),
                hitCanvas = cachedCanvas.hit,
                hitContext = hitCanvas.getContext(),
                hitWidth = hitCanvas.getWidth(),
                hitHeight = hitCanvas.getHeight(),
                hitImageData, hitData, len, rgbColorKey, i, alpha;

            hitContext.clear();
            hitContext.drawImage(sceneCanvas._canvas, 0, 0, hitWidth, hitHeight);

            try {
                hitImageData = hitContext.getImageData(0, 0, hitWidth, hitHeight);
                hitData = hitImageData.data;
                len = hitData.length;
                rgbColorKey = Konva.Util._hexToRgb(this.colorKey);

                // replace non transparent pixels with color key
                for(i = 0; i < len; i += 4) {
                    alpha = hitData[i + 3];
                    if (alpha > threshold) {
                        hitData[i] = rgbColorKey.r;
                        hitData[i + 1] = rgbColorKey.g;
                        hitData[i + 2] = rgbColorKey.b;
                        hitData[i + 3] = 255;
                    }
                    else {
                        hitData[i + 3] = 0;
                    }
                }
                hitContext.putImageData(hitImageData, 0, 0);
            }
            catch(e) {
                Konva.Util.error('Unable to draw hit graph from cached scene canvas. ' + e.message);
            }

            return this;
        }
    });
    Konva.Util.extend(Konva.Shape, Konva.Node);

    // add getters and setters
    Konva.Factory.addGetterSetter(Konva.Shape, 'stroke');

    /**
     * get/set stroke color
     * @name stroke
     * @method
     * @memberof Konva.Shape.prototype
     * @param {String} color
     * @returns {String}
     * @example
     * // get stroke color
     * var stroke = shape.stroke();
     *
     * // set stroke color with color string
     * shape.stroke('green');
     *
     * // set stroke color with hex
     * shape.stroke('#00ff00');
     *
     * // set stroke color with rgb
     * shape.stroke('rgb(0,255,0)');
     *
     * // set stroke color with rgba and make it 50% opaque
     * shape.stroke('rgba(0,255,0,0.5');
     */

    Konva.Factory.addDeprecatedGetterSetter(Konva.Shape, 'strokeRed', 0, Konva.Validators.RGBComponent);
    Konva.Factory.addDeprecatedGetterSetter(Konva.Shape, 'strokeGreen', 0, Konva.Validators.RGBComponent);
    Konva.Factory.addDeprecatedGetterSetter(Konva.Shape, 'strokeBlue', 0, Konva.Validators.RGBComponent);
    Konva.Factory.addDeprecatedGetterSetter(Konva.Shape, 'strokeAlpha', 1, Konva.Validators.alphaComponent);


    Konva.Factory.addGetterSetter(Konva.Shape, 'strokeWidth', 2);

    /**
     * get/set stroke width
     * @name strokeWidth
     * @method
     * @memberof Konva.Shape.prototype
     * @param {Number} strokeWidth
     * @returns {Number}
     * @example
     * // get stroke width
     * var strokeWidth = shape.strokeWidth();
     *
     * // set stroke width
     * shape.strokeWidth();
     */

    Konva.Factory.addGetterSetter(Konva.Shape, 'strokeHitEnabled', true);

    /**
     * get/set strokeHitEnabled property. Useful for performance optimization.
     * You may set `shape.strokeHitEnabled(false)`. In this case stroke will be no draw on hit canvas, so hit area
     * of shape will be decreased (by lineWidth / 2). Remember that non closed line with `strokeHitEnabled = false`
     * will be not drawn on hit canvas, that is mean line will no trigger pointer events (like mouseover)
     * Default value is true
     * @name strokeHitEnabled
     * @method
     * @memberof Konva.Shape.prototype
     * @param {Boolean} strokeHitEnabled
     * @returns {Boolean}
     * @example
     * // get strokeHitEnabled
     * var strokeHitEnabled = shape.strokeHitEnabled();
     *
     * // set strokeHitEnabled
     * shape.strokeHitEnabled();
     */

    Konva.Factory.addGetterSetter(Konva.Shape, 'perfectDrawEnabled', true);

    /**
     * get/set perfectDrawEnabled. If a shape has fill, stroke and opacity you may set `perfectDrawEnabled` to improve performance.
     * See http://konvajs.github.io/docs/performance/Disable_Perfect_Draw.html for more information.
     * Default value is true
     * @name perfectDrawEnabled
     * @method
     * @memberof Konva.Shape.prototype
     * @param {Boolean} perfectDrawEnabled
     * @returns {Boolean}
     * @example
     * // get perfectDrawEnabled
     * var perfectDrawEnabled = shape.perfectDrawEnabled();
     *
     * // set perfectDrawEnabled
     * shape.perfectDrawEnabled();
     */

    Konva.Factory.addGetterSetter(Konva.Shape, 'shadowForStrokeEnabled', true);

    /**
     * get/set shadowForStrokeEnabled. Useful for performance optimization.
     * You may set `shape.shadowForStrokeEnabled(false)`. In this case stroke will be no draw shadow for stroke.
     * Remember if you set `shadowForStrokeEnabled = false` for non closed line - that line with have no shadow!.
     * Default value is true
     * @name shadowForStrokeEnabled
     * @method
     * @memberof Konva.Shape.prototype
     * @param {Boolean} shadowForStrokeEnabled
     * @returns {Boolean}
     * @example
     * // get shadowForStrokeEnabled
     * var shadowForStrokeEnabled = shape.shadowForStrokeEnabled();
     *
     * // set shadowForStrokeEnabled
     * shape.shadowForStrokeEnabled();
     */

    Konva.Factory.addGetterSetter(Konva.Shape, 'lineJoin');

    /**
     * get/set line join.  Can be miter, round, or bevel.  The
     *  default is miter
     * @name lineJoin
     * @method
     * @memberof Konva.Shape.prototype
     * @param {String} lineJoin
     * @returns {String}
     * @example
     * // get line join
     * var lineJoin = shape.lineJoin();
     *
     * // set line join
     * shape.lineJoin('round');
     */

    Konva.Factory.addGetterSetter(Konva.Shape, 'lineCap');

    /**
     * get/set line cap.  Can be butt, round, or square
     * @name lineCap
     * @method
     * @memberof Konva.Shape.prototype
     * @param {String} lineCap
     * @returns {String}
     * @example
     * // get line cap
     * var lineCap = shape.lineCap();
     *
     * // set line cap
     * shape.lineCap('round');
     */

    Konva.Factory.addGetterSetter(Konva.Shape, 'sceneFunc');

    /**
     * get/set scene draw function
     * @name sceneFunc
     * @method
     * @memberof Konva.Shape.prototype
     * @param {Function} drawFunc drawing function
     * @returns {Function}
     * @example
     * // get scene draw function
     * var sceneFunc = shape.sceneFunc();
     *
     * // set scene draw function
     * shape.sceneFunc(function(context) {
     *   context.beginPath();
     *   context.rect(0, 0, this.width(), this.height());
     *   context.closePath();
     *   context.fillStrokeShape(this);
     * });
     */

    Konva.Factory.addGetterSetter(Konva.Shape, 'hitFunc');

    /**
     * get/set hit draw function
     * @name hitFunc
     * @method
     * @memberof Konva.Shape.prototype
     * @param {Function} drawFunc drawing function
     * @returns {Function}
     * @example
     * // get hit draw function
     * var hitFunc = shape.hitFunc();
     *
     * // set hit draw function
     * shape.hitFunc(function(context) {
     *   context.beginPath();
     *   context.rect(0, 0, this.width(), this.height());
     *   context.closePath();
     *   context.fillStrokeShape(this);
     * });
     */

    Konva.Factory.addGetterSetter(Konva.Shape, 'dash');

    /**
     * get/set dash array for stroke.
     * @name dash
     * @method
     * @memberof Konva.Shape.prototype
     * @param {Array} dash
     * @returns {Array}
     * @example
     *  // apply dashed stroke that is 10px long and 5 pixels apart
     *  line.dash([10, 5]);
     *  // apply dashed stroke that is made up of alternating dashed
     *  // lines that are 10px long and 20px apart, and dots that have
     *  // a radius of 5px and are 20px apart
     *  line.dash([10, 20, 0.001, 20]);
     */


    Konva.Factory.addGetterSetter(Konva.Shape, 'shadowColor');

    /**
     * get/set shadow color
     * @name shadowColor
     * @method
     * @memberof Konva.Shape.prototype
     * @param {String} color
     * @returns {String}
     * @example
     * // get shadow color
     * var shadow = shape.shadowColor();
     *
     * // set shadow color with color string
     * shape.shadowColor('green');
     *
     * // set shadow color with hex
     * shape.shadowColor('#00ff00');
     *
     * // set shadow color with rgb
     * shape.shadowColor('rgb(0,255,0)');
     *
     * // set shadow color with rgba and make it 50% opaque
     * shape.shadowColor('rgba(0,255,0,0.5');
     */

    Konva.Factory.addDeprecatedGetterSetter(Konva.Shape, 'shadowRed', 0, Konva.Validators.RGBComponent);
    Konva.Factory.addDeprecatedGetterSetter(Konva.Shape, 'shadowGreen', 0, Konva.Validators.RGBComponent);
    Konva.Factory.addDeprecatedGetterSetter(Konva.Shape, 'shadowBlue', 0, Konva.Validators.RGBComponent);
    Konva.Factory.addDeprecatedGetterSetter(Konva.Shape, 'shadowAlpha', 1, Konva.Validators.alphaComponent);

    Konva.Factory.addGetterSetter(Konva.Shape, 'shadowBlur');

    /**
     * get/set shadow blur
     * @name shadowBlur
     * @method
     * @memberof Konva.Shape.prototype
     * @param {Number} blur
     * @returns {Number}
     * @example
     * // get shadow blur
     * var shadowBlur = shape.shadowBlur();
     *
     * // set shadow blur
     * shape.shadowBlur(10);
     */

    Konva.Factory.addGetterSetter(Konva.Shape, 'shadowOpacity');

    /**
     * get/set shadow opacity.  must be a value between 0 and 1
     * @name shadowOpacity
     * @method
     * @memberof Konva.Shape.prototype
     * @param {Number} opacity
     * @returns {Number}
     * @example
     * // get shadow opacity
     * var shadowOpacity = shape.shadowOpacity();
     *
     * // set shadow opacity
     * shape.shadowOpacity(0.5);
     */

    Konva.Factory.addComponentsGetterSetter(Konva.Shape, 'shadowOffset', ['x', 'y']);

    /**
     * get/set shadow offset
     * @name shadowOffset
     * @method
     * @memberof Konva.Shape.prototype
     * @param {Object} offset
     * @param {Number} offset.x
     * @param {Number} offset.y
     * @returns {Object}
     * @example
     * // get shadow offset
     * var shadowOffset = shape.shadowOffset();
     *
     * // set shadow offset
     * shape.shadowOffset({
     *   x: 20
     *   y: 10
     * });
     */

    Konva.Factory.addGetterSetter(Konva.Shape, 'shadowOffsetX', 0);

     /**
     * get/set shadow offset x
     * @name shadowOffsetX
     * @method
     * @memberof Konva.Shape.prototype
     * @param {Number} x
     * @returns {Number}
     * @example
     * // get shadow offset x
     * var shadowOffsetX = shape.shadowOffsetX();
     *
     * // set shadow offset x
     * shape.shadowOffsetX(5);
     */

    Konva.Factory.addGetterSetter(Konva.Shape, 'shadowOffsetY', 0);

     /**
     * get/set shadow offset y
     * @name shadowOffsetY
     * @method
     * @memberof Konva.Shape.prototype
     * @param {Number} y
     * @returns {Number}
     * @example
     * // get shadow offset y
     * var shadowOffsetY = shape.shadowOffsetY();
     *
     * // set shadow offset y
     * shape.shadowOffsetY(5);
     */

    Konva.Factory.addGetterSetter(Konva.Shape, 'fillPatternImage');

    /**
     * get/set fill pattern image
     * @name fillPatternImage
     * @method
     * @memberof Konva.Shape.prototype
     * @param {Image} image object
     * @returns {Image}
     * @example
     * // get fill pattern image
     * var fillPatternImage = shape.fillPatternImage();
     *
     * // set fill pattern image
     * var imageObj = new Image();
     * imageObj.onload = function() {
     *   shape.fillPatternImage(imageObj);
     * };
     * imageObj.src = 'path/to/image/jpg';
     */

    Konva.Factory.addGetterSetter(Konva.Shape, 'fill');

    /**
     * get/set fill color
     * @name fill
     * @method
     * @memberof Konva.Shape.prototype
     * @param {String} color
     * @returns {String}
     * @example
     * // get fill color
     * var fill = shape.fill();
     *
     * // set fill color with color string
     * shape.fill('green');
     *
     * // set fill color with hex
     * shape.fill('#00ff00');
     *
     * // set fill color with rgb
     * shape.fill('rgb(0,255,0)');
     *
     * // set fill color with rgba and make it 50% opaque
     * shape.fill('rgba(0,255,0,0.5');
     *
     * // shape without fill
     * shape.fill(null);
     */

    Konva.Factory.addDeprecatedGetterSetter(Konva.Shape, 'fillRed', 0, Konva.Validators.RGBComponent);
    Konva.Factory.addDeprecatedGetterSetter(Konva.Shape, 'fillGreen', 0, Konva.Validators.RGBComponent);
    Konva.Factory.addDeprecatedGetterSetter(Konva.Shape, 'fillBlue', 0, Konva.Validators.RGBComponent);
    Konva.Factory.addDeprecatedGetterSetter(Konva.Shape, 'fillAlpha', 1, Konva.Validators.alphaComponent);

    Konva.Factory.addGetterSetter(Konva.Shape, 'fillPatternX', 0);

    /**
     * get/set fill pattern x
     * @name fillPatternX
     * @method
     * @memberof Konva.Shape.prototype
     * @param {Number} x
     * @returns {Number}
     * @example
     * // get fill pattern x
     * var fillPatternX = shape.fillPatternX();
     * // set fill pattern x
     * shape.fillPatternX(20);
     */

    Konva.Factory.addGetterSetter(Konva.Shape, 'fillPatternY', 0);

    /**
     * get/set fill pattern y
     * @name fillPatternY
     * @method
     * @memberof Konva.Shape.prototype
     * @param {Number} y
     * @returns {Number}
     * @example
     * // get fill pattern y
     * var fillPatternY = shape.fillPatternY();
     * // set fill pattern y
     * shape.fillPatternY(20);
     */

    Konva.Factory.addGetterSetter(Konva.Shape, 'fillLinearGradientColorStops');

    /**
     * get/set fill linear gradient color stops
     * @name fillLinearGradientColorStops
     * @method
     * @memberof Konva.Shape.prototype
     * @param {Array} colorStops
     * @returns {Array} colorStops
     * @example
     * // get fill linear gradient color stops
     * var colorStops = shape.fillLinearGradientColorStops();
     *
     * // create a linear gradient that starts with red, changes to blue
     * // halfway through, and then changes to green
     * shape.fillLinearGradientColorStops(0, 'red', 0.5, 'blue', 1, 'green');
     */

    Konva.Factory.addGetterSetter(Konva.Shape, 'fillRadialGradientStartRadius', 0);

    /**
     * get/set fill radial gradient start radius
     * @name fillRadialGradientStartRadius
     * @method
     * @memberof Konva.Shape.prototype
     * @param {Number} radius
     * @returns {Number}
     * @example
     * // get radial gradient start radius
     * var startRadius = shape.fillRadialGradientStartRadius();
     *
     * // set radial gradient start radius
     * shape.fillRadialGradientStartRadius(0);
     */

    Konva.Factory.addGetterSetter(Konva.Shape, 'fillRadialGradientEndRadius', 0);

    /**
     * get/set fill radial gradient end radius
     * @name fillRadialGradientEndRadius
     * @method
     * @memberof Konva.Shape.prototype
     * @param {Number} radius
     * @returns {Number}
     * @example
     * // get radial gradient end radius
     * var endRadius = shape.fillRadialGradientEndRadius();
     *
     * // set radial gradient end radius
     * shape.fillRadialGradientEndRadius(100);
     */

    Konva.Factory.addGetterSetter(Konva.Shape, 'fillRadialGradientColorStops');

    /**
     * get/set fill radial gradient color stops
     * @name fillRadialGradientColorStops
     * @method
     * @memberof Konva.Shape.prototype
     * @param {Number} colorStops
     * @returns {Array}
     * @example
     * // get fill radial gradient color stops
     * var colorStops = shape.fillRadialGradientColorStops();
     *
     * // create a radial gradient that starts with red, changes to blue
     * // halfway through, and then changes to green
     * shape.fillRadialGradientColorStops(0, 'red', 0.5, 'blue', 1, 'green');
     */

    Konva.Factory.addGetterSetter(Konva.Shape, 'fillPatternRepeat', 'repeat');

    /**
     * get/set fill pattern repeat.  Can be 'repeat', 'repeat-x', 'repeat-y', or 'no-repeat'.  The default is 'repeat'
     * @name fillPatternRepeat
     * @method
     * @memberof Konva.Shape.prototype
     * @param {String} repeat
     * @returns {String}
     * @example
     * // get fill pattern repeat
     * var repeat = shape.fillPatternRepeat();
     *
     * // repeat pattern in x direction only
     * shape.fillPatternRepeat('repeat-x');
     *
     * // do not repeat the pattern
     * shape.fillPatternRepeat('no repeat');
     */

    Konva.Factory.addGetterSetter(Konva.Shape, 'fillEnabled', true);

    /**
     * get/set fill enabled flag
     * @name fillEnabled
     * @method
     * @memberof Konva.Shape.prototype
     * @param {Boolean} enabled
     * @returns {Boolean}
     * @example
     * // get fill enabled flag
     * var fillEnabled = shape.fillEnabled();
     *
     * // disable fill
     * shape.fillEnabled(false);
     *
     * // enable fill
     * shape.fillEnabled(true);
     */

    Konva.Factory.addGetterSetter(Konva.Shape, 'strokeEnabled', true);

    /**
     * get/set stroke enabled flag
     * @name strokeEnabled
     * @method
     * @memberof Konva.Shape.prototype
     * @param {Boolean} enabled
     * @returns {Boolean}
     * @example
     * // get stroke enabled flag
     * var strokeEnabled = shape.strokeEnabled();
     *
     * // disable stroke
     * shape.strokeEnabled(false);
     *
     * // enable stroke
     * shape.strokeEnabled(true);
     */

    Konva.Factory.addGetterSetter(Konva.Shape, 'shadowEnabled', true);

    /**
     * get/set shadow enabled flag
     * @name shadowEnabled
     * @method
     * @memberof Konva.Shape.prototype
     * @param {Boolean} enabled
     * @returns {Boolean}
     * @example
     * // get shadow enabled flag
     * var shadowEnabled = shape.shadowEnabled();
     *
     * // disable shadow
     * shape.shadowEnabled(false);
     *
     * // enable shadow
     * shape.shadowEnabled(true);
     */

    Konva.Factory.addGetterSetter(Konva.Shape, 'dashEnabled', true);

    /**
     * get/set dash enabled flag
     * @name dashEnabled
     * @method
     * @memberof Konva.Shape.prototype
     * @param {Boolean} enabled
     * @returns {Boolean}
     * @example
     * // get dash enabled flag
     * var dashEnabled = shape.dashEnabled();
     *
     * // disable dash
     * shape.dashEnabled(false);
     *
     * // enable dash
     * shape.dashEnabled(true);
     */

    Konva.Factory.addGetterSetter(Konva.Shape, 'strokeScaleEnabled', true);

    /**
     * get/set strokeScale enabled flag
     * @name strokeScaleEnabled
     * @method
     * @memberof Konva.Shape.prototype
     * @param {Boolean} enabled
     * @returns {Boolean}
     * @example
     * // get stroke scale enabled flag
     * var strokeScaleEnabled = shape.strokeScaleEnabled();
     *
     * // disable stroke scale
     * shape.strokeScaleEnabled(false);
     *
     * // enable stroke scale
     * shape.strokeScaleEnabled(true);
     */

    Konva.Factory.addGetterSetter(Konva.Shape, 'fillPriority', 'color');

    /**
     * get/set fill priority.  can be color, pattern, linear-gradient, or radial-gradient.  The default is color.
     *   This is handy if you want to toggle between different fill types.
     * @name fillPriority
     * @method
     * @memberof Konva.Shape.prototype
     * @param {String} priority
     * @returns {String}
     * @example
     * // get fill priority
     * var fillPriority = shape.fillPriority();
     *
     * // set fill priority
     * shape.fillPriority('linear-gradient');
     */

    Konva.Factory.addComponentsGetterSetter(Konva.Shape, 'fillPatternOffset', ['x', 'y']);

    /**
     * get/set fill pattern offset
     * @name fillPatternOffset
     * @method
     * @memberof Konva.Shape.prototype
     * @param {Object} offset
     * @param {Number} offset.x
     * @param {Number} offset.y
     * @returns {Object}
     * @example
     * // get fill pattern offset
     * var patternOffset = shape.fillPatternOffset();
     *
     * // set fill pattern offset
     * shape.fillPatternOffset({
     *   x: 20
     *   y: 10
     * });
     */


    Konva.Factory.addGetterSetter(Konva.Shape, 'fillPatternOffsetX', 0);
    /**
     * get/set fill pattern offset x
     * @name fillPatternOffsetX
     * @method
     * @memberof Konva.Shape.prototype
     * @param {Number} x
     * @returns {Number}
     * @example
     * // get fill pattern offset x
     * var patternOffsetX = shape.fillPatternOffsetX();
     *
     * // set fill pattern offset x
     * shape.fillPatternOffsetX(20);
     */

    Konva.Factory.addGetterSetter(Konva.Shape, 'fillPatternOffsetY', 0);
    /**
     * get/set fill pattern offset y
     * @name fillPatternOffsetY
     * @method
     * @memberof Konva.Shape.prototype
     * @param {Number} y
     * @returns {Number}
     * @example
     * // get fill pattern offset y
     * var patternOffsetY = shape.fillPatternOffsetY();
     *
     * // set fill pattern offset y
     * shape.fillPatternOffsetY(10);
     */

    Konva.Factory.addComponentsGetterSetter(Konva.Shape, 'fillPatternScale', ['x', 'y']);

    /**
     * get/set fill pattern scale
     * @name fillPatternScale
     * @method
     * @memberof Konva.Shape.prototype
     * @param {Object} scale
     * @param {Number} scale.x
     * @param {Number} scale.y
     * @returns {Object}
     * @example
     * // get fill pattern scale
     * var patternScale = shape.fillPatternScale();
     *
     * // set fill pattern scale
     * shape.fillPatternScale({
     *   x: 2
     *   y: 2
     * });
     */


    Konva.Factory.addGetterSetter(Konva.Shape, 'fillPatternScaleX', 1);
    /**
     * get/set fill pattern scale x
     * @name fillPatternScaleX
     * @method
     * @memberof Konva.Shape.prototype
     * @param {Number} x
     * @returns {Number}
     * @example
     * // get fill pattern scale x
     * var patternScaleX = shape.fillPatternScaleX();
     *
     * // set fill pattern scale x
     * shape.fillPatternScaleX(2);
     */

    Konva.Factory.addGetterSetter(Konva.Shape, 'fillPatternScaleY', 1);
    /**
     * get/set fill pattern scale y
     * @name fillPatternScaleY
     * @method
     * @memberof Konva.Shape.prototype
     * @param {Number} y
     * @returns {Number}
     * @example
     * // get fill pattern scale y
     * var patternScaleY = shape.fillPatternScaleY();
     *
     * // set fill pattern scale y
     * shape.fillPatternScaleY(2);
     */

    Konva.Factory.addComponentsGetterSetter(Konva.Shape, 'fillLinearGradientStartPoint', ['x', 'y']);

    /**
     * get/set fill linear gradient start point
     * @name fillLinearGradientStartPoint
     * @method
     * @memberof Konva.Shape.prototype
     * @param {Object} startPoint
     * @param {Number} startPoint.x
     * @param {Number} startPoint.y
     * @returns {Object}
     * @example
     * // get fill linear gradient start point
     * var startPoint = shape.fillLinearGradientStartPoint();
     *
     * // set fill linear gradient start point
     * shape.fillLinearGradientStartPoint({
     *   x: 20
     *   y: 10
     * });
     */

    Konva.Factory.addGetterSetter(Konva.Shape, 'fillLinearGradientStartPointX', 0);
    /**
     * get/set fill linear gradient start point x
     * @name fillLinearGradientStartPointX
     * @method
     * @memberof Konva.Shape.prototype
     * @param {Number} x
     * @returns {Number}
     * @example
     * // get fill linear gradient start point x
     * var startPointX = shape.fillLinearGradientStartPointX();
     *
     * // set fill linear gradient start point x
     * shape.fillLinearGradientStartPointX(20);
     */

    Konva.Factory.addGetterSetter(Konva.Shape, 'fillLinearGradientStartPointY', 0);
    /**
     * get/set fill linear gradient start point y
     * @name fillLinearGradientStartPointY
     * @method
     * @memberof Konva.Shape.prototype
     * @param {Number} y
     * @returns {Number}
     * @example
     * // get fill linear gradient start point y
     * var startPointY = shape.fillLinearGradientStartPointY();
     *
     * // set fill linear gradient start point y
     * shape.fillLinearGradientStartPointY(20);
     */

    Konva.Factory.addComponentsGetterSetter(Konva.Shape, 'fillLinearGradientEndPoint', ['x', 'y']);

    /**
     * get/set fill linear gradient end point
     * @name fillLinearGradientEndPoint
     * @method
     * @memberof Konva.Shape.prototype
     * @param {Object} endPoint
     * @param {Number} endPoint.x
     * @param {Number} endPoint.y
     * @returns {Object}
     * @example
     * // get fill linear gradient end point
     * var endPoint = shape.fillLinearGradientEndPoint();
     *
     * // set fill linear gradient end point
     * shape.fillLinearGradientEndPoint({
     *   x: 20
     *   y: 10
     * });
     */

    Konva.Factory.addGetterSetter(Konva.Shape, 'fillLinearGradientEndPointX', 0);
    /**
     * get/set fill linear gradient end point x
     * @name fillLinearGradientEndPointX
     * @method
     * @memberof Konva.Shape.prototype
     * @param {Number} x
     * @returns {Number}
     * @example
     * // get fill linear gradient end point x
     * var endPointX = shape.fillLinearGradientEndPointX();
     *
     * // set fill linear gradient end point x
     * shape.fillLinearGradientEndPointX(20);
     */

    Konva.Factory.addGetterSetter(Konva.Shape, 'fillLinearGradientEndPointY', 0);
    /**
     * get/set fill linear gradient end point y
     * @name fillLinearGradientEndPointY
     * @method
     * @memberof Konva.Shape.prototype
     * @param {Number} y
     * @returns {Number}
     * @example
     * // get fill linear gradient end point y
     * var endPointY = shape.fillLinearGradientEndPointY();
     *
     * // set fill linear gradient end point y
     * shape.fillLinearGradientEndPointY(20);
     */

    Konva.Factory.addComponentsGetterSetter(Konva.Shape, 'fillRadialGradientStartPoint', ['x', 'y']);

    /**
     * get/set fill radial gradient start point
     * @name fillRadialGradientStartPoint
     * @method
     * @memberof Konva.Shape.prototype
     * @param {Object} startPoint
     * @param {Number} startPoint.x
     * @param {Number} startPoint.y
     * @returns {Object}
     * @example
     * // get fill radial gradient start point
     * var startPoint = shape.fillRadialGradientStartPoint();
     *
     * // set fill radial gradient start point
     * shape.fillRadialGradientStartPoint({
     *   x: 20
     *   y: 10
     * });
     */

    Konva.Factory.addGetterSetter(Konva.Shape, 'fillRadialGradientStartPointX', 0);
    /**
     * get/set fill radial gradient start point x
     * @name fillRadialGradientStartPointX
     * @method
     * @memberof Konva.Shape.prototype
     * @param {Number} x
     * @returns {Number}
     * @example
     * // get fill radial gradient start point x
     * var startPointX = shape.fillRadialGradientStartPointX();
     *
     * // set fill radial gradient start point x
     * shape.fillRadialGradientStartPointX(20);
     */

    Konva.Factory.addGetterSetter(Konva.Shape, 'fillRadialGradientStartPointY', 0);
    /**
     * get/set fill radial gradient start point y
     * @name fillRadialGradientStartPointY
     * @method
     * @memberof Konva.Shape.prototype
     * @param {Number} y
     * @returns {Number}
     * @example
     * // get fill radial gradient start point y
     * var startPointY = shape.fillRadialGradientStartPointY();
     *
     * // set fill radial gradient start point y
     * shape.fillRadialGradientStartPointY(20);
     */

    Konva.Factory.addComponentsGetterSetter(Konva.Shape, 'fillRadialGradientEndPoint', ['x', 'y']);

    /**
     * get/set fill radial gradient end point
     * @name fillRadialGradientEndPoint
     * @method
     * @memberof Konva.Shape.prototype
     * @param {Object} endPoint
     * @param {Number} endPoint.x
     * @param {Number} endPoint.y
     * @returns {Object}
     * @example
     * // get fill radial gradient end point
     * var endPoint = shape.fillRadialGradientEndPoint();
     *
     * // set fill radial gradient end point
     * shape.fillRadialGradientEndPoint({
     *   x: 20
     *   y: 10
     * });
     */

    Konva.Factory.addGetterSetter(Konva.Shape, 'fillRadialGradientEndPointX', 0);
    /**
     * get/set fill radial gradient end point x
     * @name fillRadialGradientEndPointX
     * @method
     * @memberof Konva.Shape.prototype
     * @param {Number} x
     * @returns {Number}
     * @example
     * // get fill radial gradient end point x
     * var endPointX = shape.fillRadialGradientEndPointX();
     *
     * // set fill radial gradient end point x
     * shape.fillRadialGradientEndPointX(20);
     */

    Konva.Factory.addGetterSetter(Konva.Shape, 'fillRadialGradientEndPointY', 0);
    /**
     * get/set fill radial gradient end point y
     * @name fillRadialGradientEndPointY
     * @method
     * @memberof Konva.Shape.prototype
     * @param {Number} y
     * @returns {Number}
     * @example
     * // get fill radial gradient end point y
     * var endPointY = shape.fillRadialGradientEndPointY();
     *
     * // set fill radial gradient end point y
     * shape.fillRadialGradientEndPointY(20);
     */

    Konva.Factory.addGetterSetter(Konva.Shape, 'fillPatternRotation', 0);

    /**
     * get/set fill pattern rotation in degrees
     * @name fillPatternRotation
     * @method
     * @memberof Konva.Shape.prototype
     * @param {Number} rotation
     * @returns {Konva.Shape}
     * @example
     * // get fill pattern rotation
     * var patternRotation = shape.fillPatternRotation();
     *
     * // set fill pattern rotation
     * shape.fillPatternRotation(20);
     */


    Konva.Factory.backCompat(Konva.Shape, {
        dashArray: 'dash',
        getDashArray: 'getDash',
        setDashArray: 'getDash',

        drawFunc: 'sceneFunc',
        getDrawFunc: 'getSceneFunc',
        setDrawFunc: 'setSceneFunc',

        drawHitFunc: 'hitFunc',
        getDrawHitFunc: 'getHitFunc',
        setDrawHitFunc: 'setHitFunc'
    });

    Konva.Collection.mapMethods(Konva.Shape);
})(Konva);

(function() {
    'use strict';
    // CONSTANTS
    var STAGE = 'Stage',
        STRING = 'string',
        PX = 'px',

        MOUSEOUT = 'mouseout',
        MOUSELEAVE = 'mouseleave',
        MOUSEOVER = 'mouseover',
        MOUSEENTER = 'mouseenter',
        MOUSEMOVE = 'mousemove',
        MOUSEDOWN = 'mousedown',
        MOUSEUP = 'mouseup',
        CLICK = 'click',
        DBL_CLICK = 'dblclick',
        TOUCHSTART = 'touchstart',
        TOUCHEND = 'touchend',
        TAP = 'tap',
        DBL_TAP = 'dbltap',
        TOUCHMOVE = 'touchmove',
        DOMMOUSESCROLL = 'DOMMouseScroll',
        MOUSEWHEEL = 'mousewheel',
        WHEEL = 'wheel',

        CONTENT_MOUSEOUT = 'contentMouseout',
        CONTENT_MOUSEOVER = 'contentMouseover',
        CONTENT_MOUSEMOVE = 'contentMousemove',
        CONTENT_MOUSEDOWN = 'contentMousedown',
        CONTENT_MOUSEUP = 'contentMouseup',
        CONTENT_CLICK = 'contentClick',
        CONTENT_DBL_CLICK = 'contentDblclick',
        CONTENT_TOUCHSTART = 'contentTouchstart',
        CONTENT_TOUCHEND = 'contentTouchend',
        CONTENT_DBL_TAP = 'contentDbltap',
        CONTENT_TOUCHMOVE = 'contentTouchmove',

        DIV = 'div',
        RELATIVE = 'relative',
        KONVA_CONTENT = 'konvajs-content',
        SPACE = ' ',
        UNDERSCORE = '_',
        CONTAINER = 'container',
        EMPTY_STRING = '',
        EVENTS = [MOUSEDOWN, MOUSEMOVE, MOUSEUP, MOUSEOUT, TOUCHSTART, TOUCHMOVE, TOUCHEND, MOUSEOVER, DOMMOUSESCROLL, MOUSEWHEEL, WHEEL],

        // cached variables
        eventsLength = EVENTS.length;

    function addEvent(ctx, eventName) {
        ctx.content.addEventListener(eventName, function(evt) {
            ctx[UNDERSCORE + eventName](evt);
        }, false);
    }

    /**
     * Stage constructor.  A stage is used to contain multiple layers
     * @constructor
     * @memberof Konva
     * @augments Konva.Container
     * @param {Object} config
     * @param {String|Element} config.container Container id or DOM element
     * @param {Number} [config.x]
     * @param {Number} [config.y]
     * @param {Number} [config.width]
     * @param {Number} [config.height]
     * @param {Boolean} [config.visible]
     * @param {Boolean} [config.listening] whether or not the node is listening for events
     * @param {String} [config.id] unique id
     * @param {String} [config.name] non-unique name
     * @param {Number} [config.opacity] determines node opacity.  Can be any number between 0 and 1
     * @param {Object} [config.scale] set scale
     * @param {Number} [config.scaleX] set scale x
     * @param {Number} [config.scaleY] set scale y
     * @param {Number} [config.rotation] rotation in degrees
     * @param {Object} [config.offset] offset from center point and rotation point
     * @param {Number} [config.offsetX] set offset x
     * @param {Number} [config.offsetY] set offset y
     * @param {Boolean} [config.draggable] makes the node draggable.  When stages are draggable, you can drag and drop
     *  the entire stage by dragging any portion of the stage
     * @param {Number} [config.dragDistance]
     * @param {Function} [config.dragBoundFunc]
     * @example
     * var stage = new Konva.Stage({
         *   width: 500,
         *   height: 800,
         *   container: 'containerId'
         * });
     */
    Konva.Stage = function(config) {
        this.___init(config);
    };

    Konva.Util.addMethods(Konva.Stage, {
        ___init: function(config) {
            this.nodeType = STAGE;
            // call super constructor
            Konva.Container.call(this, config);
            this._id = Konva.idCounter++;
            this._buildDOM();
            this._bindContentEvents();
            this._enableNestedTransforms = false;
            Konva.stages.push(this);
        },
        _validateAdd: function(child) {
            if (child.getType() !== 'Layer') {
                Konva.Util.throw('You may only add layers to the stage.');
            }
        },
        /**
         * set container dom element which contains the stage wrapper div element
         * @method
         * @memberof Konva.Stage.prototype
         * @param {DomElement} container can pass in a dom element or id string
         */
        setContainer: function(container) {
            if( typeof container === STRING) {
                var id = container;
                container = Konva.document.getElementById(container);
                if (!container) {
                    throw 'Can not find container in document with id ' + id;
                }
            }
            this._setAttr(CONTAINER, container);
            return this;
        },
        shouldDrawHit: function() {
            return true;
        },
        draw: function() {
            Konva.Node.prototype.draw.call(this);
            return this;
        },
        /**
         * draw layer scene graphs
         * @name draw
         * @method
         * @memberof Konva.Stage.prototype
         */

        /**
         * draw layer hit graphs
         * @name drawHit
         * @method
         * @memberof Konva.Stage.prototype
         */

        /**
         * set height
         * @method
         * @memberof Konva.Stage.prototype
         * @param {Number} height
         */
        setHeight: function(height) {
            Konva.Node.prototype.setHeight.call(this, height);
            this._resizeDOM();
            return this;
        },
        /**
         * set width
         * @method
         * @memberof Konva.Stage.prototype
         * @param {Number} width
         */
        setWidth: function(width) {
            Konva.Node.prototype.setWidth.call(this, width);
            this._resizeDOM();
            return this;
        },
        /**
         * clear all layers
         * @method
         * @memberof Konva.Stage.prototype
         */
        clear: function() {
            var layers = this.children,
                len = layers.length,
                n;

            for(n = 0; n < len; n++) {
                layers[n].clear();
            }
            return this;
        },
        clone: function(obj) {
            if (!obj) {
                obj = {};
            }
            obj.container = Konva.document.createElement(DIV);
            return Konva.Container.prototype.clone.call(this, obj);
        },
        /**
         * destroy stage
         * @method
         * @memberof Konva.Stage.prototype
         */
        destroy: function() {
            var content = this.content;
            Konva.Container.prototype.destroy.call(this);

            if(content && Konva.Util._isInDocument(content)) {
                this.getContainer().removeChild(content);
            }
            var index = Konva.stages.indexOf(this);
            if (index > -1) {
                Konva.stages.splice(index, 1);
            }
        },
        /**
         * get pointer position which can be a touch position or mouse position
         * @method
         * @memberof Konva.Stage.prototype
         * @returns {Object}
         */
        getPointerPosition: function() {
            return this.pointerPos;
        },
        getStage: function() {
            return this;
        },
        /**
         * get stage content div element which has the
         *  the class name "konvajs-content"
         * @method
         * @memberof Konva.Stage.prototype
         */
        getContent: function() {
            return this.content;
        },
        /**
         * Creates a composite data URL
         * @method
         * @memberof Konva.Stage.prototype
         * @param {Object} config
         * @param {Function} [config.callback] function executed when the composite has completed. Deprecated as method is sync now.
         * @param {String} [config.mimeType] can be "image/png" or "image/jpeg".
         *  "image/png" is the default
         * @param {Number} [config.x] x position of canvas section
         * @param {Number} [config.y] y position of canvas section
         * @param {Number} [config.width] width of canvas section
         * @param {Number} [config.height] height of canvas section
         * @param {Number} [config.quality] jpeg quality.  If using an "image/jpeg" mimeType,
         *  you can specify the quality from 0 to 1, where 0 is very poor quality and 1
         *  is very high quality
         */
        toDataURL: function(config) {
            config = config || {};

            var mimeType = config.mimeType || null,
                quality = config.quality || null,
                x = config.x || 0,
                y = config.y || 0,
                canvas = new Konva.SceneCanvas({
                    width: config.width || this.getWidth(),
                    height: config.height || this.getHeight(),
                    pixelRatio: config.pixelRatio
                }),
                _context = canvas.getContext()._context,
                layers = this.children;

            if(x || y) {
                _context.translate(-1 * x, -1 * y);
            }


            layers.each(function(layer) {
                var width = layer.getCanvas().getWidth();
                var height = layer.getCanvas().getHeight();
                var ratio = layer.getCanvas().getPixelRatio();
                _context.drawImage(layer.getCanvas()._canvas, 0, 0, width / ratio, height / ratio);
            });
            var src = canvas.toDataURL(mimeType, quality);

            if (config.callback) {
                config.callback(src);
            }

            return src;
        },
        /**
         * converts stage into an image.
         * @method
         * @memberof Konva.Stage.prototype
         * @param {Object} config
         * @param {Function} config.callback function executed when the composite has completed
         * @param {String} [config.mimeType] can be "image/png" or "image/jpeg".
         *  "image/png" is the default
         * @param {Number} [config.x] x position of canvas section
         * @param {Number} [config.y] y position of canvas section
         * @param {Number} [config.width] width of canvas section
         * @param {Number} [config.height] height of canvas section
         * @param {Number} [config.quality] jpeg quality.  If using an "image/jpeg" mimeType,
         *  you can specify the quality from 0 to 1, where 0 is very poor quality and 1
         *  is very high quality
         */
        toImage: function(config) {
            var cb = config.callback;

            config.callback = function(dataUrl) {
                Konva.Util._getImage(dataUrl, function(img) {
                    cb(img);
                });
            };
            this.toDataURL(config);
        },
        /**
         * get visible intersection shape. This is the preferred
         *  method for determining if a point intersects a shape or not
         * @method
         * @memberof Konva.Stage.prototype
         * @param {Object} pos
         * @param {Number} pos.x
         * @param {Number} pos.y
         * @returns {Konva.Shape}
         */
        getIntersection: function(pos) {
            var layers = this.getChildren(),
                len = layers.length,
                end = len - 1,
                n, shape;

            for(n = end; n >= 0; n--) {
                shape = layers[n].getIntersection(pos);
                if (shape) {
                    return shape;
                }
            }

            return null;
        },
        _resizeDOM: function() {
            if(this.content) {
                var width = this.getWidth(),
                    height = this.getHeight(),
                    layers = this.getChildren(),
                    len = layers.length,
                    n, layer;

                // set content dimensions
                this.content.style.width = width + PX;
                this.content.style.height = height + PX;

                this.bufferCanvas.setSize(width, height);
                this.bufferHitCanvas.setSize(width, height);

                // set layer dimensions
                for(n = 0; n < len; n++) {
                    layer = layers[n];
                    layer.setSize(width, height);
                    layer.draw();
                }
            }
        },
        /**
         * add layer or layers to stage
         * @method
         * @memberof Konva.Stage.prototype
         * @param {...Konva.Layer} layer
         * @example
         * stage.add(layer1, layer2, layer3);
         */
        add: function(layer) {
            if (arguments.length > 1) {
                for (var i = 0; i < arguments.length; i++) {
                    this.add(arguments[i]);
                }
                return this;
            }
            Konva.Container.prototype.add.call(this, layer);
            layer._setCanvasSize(this.width(), this.height());

            // draw layer and append canvas to container
            layer.draw();
            this.content.appendChild(layer.canvas._canvas);

            // chainable
            return this;
        },
        getParent: function() {
            return null;
        },
        getLayer: function() {
            return null;
        },
        /**
         * returns a {@link Konva.Collection} of layers
         * @method
         * @memberof Konva.Stage.prototype
         */
        getLayers: function() {
            return this.getChildren();
        },
        _bindContentEvents: function() {
            for (var n = 0; n < eventsLength; n++) {
                addEvent(this, EVENTS[n]);
            }
        },
        _mouseover: function(evt) {
            if (!Konva.UA.mobile) {
                this._setPointerPosition(evt);
                this._fire(CONTENT_MOUSEOVER, {evt: evt});
            }
        },
        _mouseout: function(evt) {
            if (!Konva.UA.mobile) {
                this._setPointerPosition(evt);
                var targetShape = this.targetShape;

                if(targetShape && !Konva.isDragging()) {
                    targetShape._fireAndBubble(MOUSEOUT, {evt: evt});
                    targetShape._fireAndBubble(MOUSELEAVE, {evt: evt});
                    this.targetShape = null;
                }
                this.pointerPos = undefined;

                this._fire(CONTENT_MOUSEOUT, {evt: evt});
            }
        },
        _mousemove: function(evt) {
            // workaround for mobile IE to force touch event when unhandled pointer event elevates into a mouse event
            if (Konva.UA.ieMobile) {
                return this._touchmove(evt);
            }
            // workaround fake mousemove event in chrome browser https://code.google.com/p/chromium/issues/detail?id=161464
            if ((typeof evt.movementX !== 'undefined' || typeof evt.movementY !== 'undefined') && evt.movementY === 0 && evt.movementX === 0) {
                return null;
            }
            if (Konva.UA.mobile) {
                return null;
            }
            this._setPointerPosition(evt);
            var shape;

            if (!Konva.isDragging()) {
                shape = this.getIntersection(this.getPointerPosition());
                if(shape && shape.isListening()) {
                    if(!Konva.isDragging() && (!this.targetShape || this.targetShape._id !== shape._id)) {
                        if(this.targetShape) {
                            this.targetShape._fireAndBubble(MOUSEOUT, {evt: evt}, shape);
                            this.targetShape._fireAndBubble(MOUSELEAVE, {evt: evt}, shape);
                        }
                        shape._fireAndBubble(MOUSEOVER, {evt: evt}, this.targetShape);
                        shape._fireAndBubble(MOUSEENTER, {evt: evt}, this.targetShape);
                        this.targetShape = shape;
                    }
                    else {
                        shape._fireAndBubble(MOUSEMOVE, {evt: evt});
                    }
                }
                /*
                 * if no shape was detected, clear target shape and try
                 * to run mouseout from previous target shape
                 */
                else {
                    if(this.targetShape && !Konva.isDragging()) {
                        this.targetShape._fireAndBubble(MOUSEOUT, {evt: evt});
                        this.targetShape._fireAndBubble(MOUSELEAVE, {evt: evt});
                        this.targetShape = null;
                    }

                }

                // content event
                this._fire(CONTENT_MOUSEMOVE, {evt: evt});
            }

            // always call preventDefault for desktop events because some browsers
            // try to drag and drop the canvas element
            //if (evt.preventDefault) {
            //    evt.preventDefault();
            //}
        },
        _mousedown: function(evt) {
            // workaround for mobile IE to force touch event when unhandled pointer event elevates into a mouse event
            if (Konva.UA.ieMobile) {
                return this._touchstart(evt);
            }
            if (!Konva.UA.mobile) {
                this._setPointerPosition(evt);
                var shape = this.getIntersection(this.getPointerPosition());

                Konva.listenClickTap = true;

                if (shape && shape.isListening()) {
                    this.clickStartShape = shape;
                    shape._fireAndBubble(MOUSEDOWN, {evt: evt});
                }

                // content event
                this._fire(CONTENT_MOUSEDOWN, {evt: evt});
            }

            // always call preventDefault for desktop events because some browsers
            // try to drag and drop the canvas element
            //if (evt.preventDefault) {
            //    evt.preventDefault();
            //}
        },
        _mouseup: function(evt) {

            // workaround for mobile IE to force touch event when unhandled pointer event elevates into a mouse event
            if (Konva.UA.ieMobile) {
                return this._touchend(evt);
            }
            if (!Konva.UA.mobile) {
                this._setPointerPosition(evt);
                var shape = this.getIntersection(this.getPointerPosition()),
                    clickStartShape = this.clickStartShape,
                    fireDblClick = false,
                    dd = Konva.DD;

                if(Konva.inDblClickWindow) {
                    fireDblClick = true;
                    Konva.inDblClickWindow = false;
                }
                // don't set inDblClickWindow after dragging
                else if (!dd || !dd.justDragged) {
                    Konva.inDblClickWindow = true;
                } else if (dd) {
                    dd.justDragged = false;
                }

                setTimeout(function() {
                    Konva.inDblClickWindow = false;
                }, Konva.dblClickWindow);

                if (shape && shape.isListening()) {
                    shape._fireAndBubble(MOUSEUP, {evt: evt});

                    // detect if click or double click occurred
                    if(Konva.listenClickTap && clickStartShape && clickStartShape._id === shape._id) {
                        shape._fireAndBubble(CLICK, {evt: evt});

                        if(fireDblClick) {
                            shape._fireAndBubble(DBL_CLICK, {evt: evt});
                        }
                    }
                }
                // content events
                this._fire(CONTENT_MOUSEUP, {evt: evt});
                if (Konva.listenClickTap) {
                    this._fire(CONTENT_CLICK, {evt: evt});
                    if(fireDblClick) {
                        this._fire(CONTENT_DBL_CLICK, {evt: evt});
                    }
                }

                Konva.listenClickTap = false;
            }

            // always call preventDefault for desktop events because some browsers
            // try to drag and drop the canvas element
            //if (evt.preventDefault) {
            //    evt.preventDefault();
            //}
        },
        _touchstart: function(evt) {
            this._setPointerPosition(evt);
            var shape = this.getIntersection(this.getPointerPosition());

            Konva.listenClickTap = true;

            if (shape && shape.isListening()) {
                this.tapStartShape = shape;
                shape._fireAndBubble(TOUCHSTART, {evt: evt});

                // only call preventDefault if the shape is listening for events
                if (shape.isListening() && evt.preventDefault) {
                    evt.preventDefault();
                }
            }
            // content event
            this._fire(CONTENT_TOUCHSTART, {evt: evt});
        },
        _touchend: function(evt) {
            this._setPointerPosition(evt);
            var shape = this.getIntersection(this.getPointerPosition()),
                fireDblClick = false;

            if(Konva.inDblClickWindow) {
                fireDblClick = true;
                Konva.inDblClickWindow = false;
            }
            else {
                Konva.inDblClickWindow = true;
            }

            setTimeout(function() {
                Konva.inDblClickWindow = false;
            }, Konva.dblClickWindow);

            if (shape && shape.isListening()) {
                shape._fireAndBubble(TOUCHEND, {evt: evt});

                // detect if tap or double tap occurred
                if(Konva.listenClickTap && shape._id === this.tapStartShape._id) {
                    shape._fireAndBubble(TAP, {evt: evt});

                    if(fireDblClick) {
                        shape._fireAndBubble(DBL_TAP, {evt: evt});
                    }
                }
                // only call preventDefault if the shape is listening for events
                if (shape.isListening() && evt.preventDefault) {
                    evt.preventDefault();
                }
            }
            // content events
            if (Konva.listenClickTap) {
                this._fire(CONTENT_TOUCHEND, {evt: evt});
                if(fireDblClick) {
                    this._fire(CONTENT_DBL_TAP, {evt: evt});
                }
            }

            Konva.listenClickTap = false;
        },
        _touchmove: function(evt) {
            this._setPointerPosition(evt);
            var dd = Konva.DD,
                shape;
            if (!Konva.isDragging()) {
                shape = this.getIntersection(this.getPointerPosition());
                if (shape && shape.isListening()) {
                    shape._fireAndBubble(TOUCHMOVE, {evt: evt});
                    // only call preventDefault if the shape is listening for events
                    if (shape.isListening() && evt.preventDefault) {
                        evt.preventDefault();
                    }
                }
                this._fire(CONTENT_TOUCHMOVE, {evt: evt});
            }
            if(dd) {
                if (Konva.isDragging()) {
                    evt.preventDefault();
                }
            }
        },
        _DOMMouseScroll: function(evt) {
            this._mousewheel(evt);
        },
        _mousewheel: function(evt) {
            this._setPointerPosition(evt);
            var shape = this.getIntersection(this.getPointerPosition());

            if (shape && shape.isListening()) {
                shape._fireAndBubble(MOUSEWHEEL, {evt: evt});
            }
        },
        _wheel: function(evt) {
            this._mousewheel(evt);
        },
        _setPointerPosition: function(evt) {
            var contentPosition = this._getContentPosition(),
                x = null,
                y = null;
            evt = evt ? evt : window.event;

            // touch events
            if(evt.touches !== undefined) {
                // currently, only handle one finger
                if (evt.touches.length > 0) {

                    var touch = evt.touches[0];
                    // get the information for finger #1
                    x = touch.clientX - contentPosition.left;
                    y = touch.clientY - contentPosition.top;
                }
            }
            // mouse events
            else {
                if (!contentPosition) {
                    x = evt.offsetX;
                    y = evt.offetY;
                }
                // we unfortunately have to use UA detection here because accessing
                // the layerX or layerY properties in newer versions of Chrome
                // throws a JS warning.  layerX and layerY are required for FF
                // when the container is transformed via CSS.
                else if (Konva.UA.browser === 'mozilla') {
                    x = evt.layerX || (evt.clientX - contentPosition.left);
                    y = evt.layerY || (evt.clientY - contentPosition.top);
                } else {
                    x = evt.clientX - contentPosition.left;
                    y = evt.clientY - contentPosition.top;
                }
            }

            if (x !== null && y !== null) {
                this.pointerPos = {
                    x: x,
                    y: y
                };
            }
        },
        _getContentPosition: function() {
            var rect = this.content.getBoundingClientRect ? this.content.getBoundingClientRect() : { top: 0, left: 0 };
            return {
                top: rect.top,
                left: rect.left
            };
        },
        _buildDOM: function() {
            var container = this.getContainer();
            if (!container) {
                if (Konva.Util.isBrowser()) {
                    throw 'Stage has no container. A container is required.';
                } else {
                    // automatically create element for jsdom in nodejs env
                    container = Konva.document.createElement(DIV);
                }
            }
            // clear content inside container
            container.innerHTML = EMPTY_STRING;

            // content
            this.content = Konva.document.createElement(DIV);
            this.content.style.position = RELATIVE;
            this.content.className = KONVA_CONTENT;
            this.content.setAttribute('role', 'presentation');
            container.appendChild(this.content);

            // the buffer canvas pixel ratio must be 1 because it is used as an
            // intermediate canvas before copying the result onto a scene canvas.
            // not setting it to 1 will result in an over compensation
            this.bufferCanvas = new Konva.SceneCanvas({
                pixelRatio: 1
            });
            this.bufferHitCanvas = new Konva.HitCanvas();

            this._resizeDOM();
        },
        _onContent: function(typesStr, handler) {
            var types = typesStr.split(SPACE),
                len = types.length,
                n, baseEvent;

            for(n = 0; n < len; n++) {
                baseEvent = types[n];
                this.content.addEventListener(baseEvent, handler, false);
            }
        },
        // currently cache function is now working for stage, because stage has no its own canvas element
        // TODO: may be it is better to cache all children layers?
        cache: function() {
            Konva.Util.warn('Cache function is not allowed for stage. You may use cache only for layers, groups and shapes.');
        },
        clearCache: function() {
        }
    });
    Konva.Util.extend(Konva.Stage, Konva.Container);

    // add getters and setters
    Konva.Factory.addGetter(Konva.Stage, 'container');
    Konva.Factory.addOverloadedGetterSetter(Konva.Stage, 'container');

    /**
     * get container DOM element
     * @name container
     * @method
     * @memberof Konva.Stage.prototype
     * @returns {DomElement} container
     * @example
     * // get container
     * var container = stage.container();
     * // set container
     * var container = document.createElement('div');
     * body.appendChild(container);
     * stage.container(container);
     */

})();

(function() {
    'use strict';
    /**
     * BaseLayer constructor.
     * @constructor
     * @memberof Konva
     * @augments Konva.Container
     * @param {Object} config
     * @param {Boolean} [config.clearBeforeDraw] set this property to false if you don't want
     * to clear the canvas before each layer draw.  The default value is true.
     * @param {Number} [config.x]
     * @param {Number} [config.y]
     * @param {Number} [config.width]
     * @param {Number} [config.height]
     * @param {Boolean} [config.visible]
     * @param {Boolean} [config.listening] whether or not the node is listening for events
     * @param {String} [config.id] unique id
     * @param {String} [config.name] non-unique name
     * @param {Number} [config.opacity] determines node opacity.  Can be any number between 0 and 1
     * @param {Object} [config.scale] set scale
     * @param {Number} [config.scaleX] set scale x
     * @param {Number} [config.scaleY] set scale y
     * @param {Number} [config.rotation] rotation in degrees
     * @param {Object} [config.offset] offset from center point and rotation point
     * @param {Number} [config.offsetX] set offset x
     * @param {Number} [config.offsetY] set offset y
     * @param {Boolean} [config.draggable] makes the node draggable.  When stages are draggable, you can drag and drop
     *  the entire stage by dragging any portion of the stage
     * @param {Number} [config.dragDistance]
     * @param {Function} [config.dragBoundFunc]
     * * @param {Object} [config.clip] set clip
     * @param {Number} [config.clipX] set clip x
     * @param {Number} [config.clipY] set clip y
     * @param {Number} [config.clipWidth] set clip width
     * @param {Number} [config.clipHeight] set clip height

     * @example
     * var layer = new Konva.Layer();
     */
    Konva.BaseLayer = function(config) {
        this.___init(config);
    };

    Konva.Util.addMethods(Konva.BaseLayer, {
        ___init: function(config) {
            this.nodeType = 'Layer';
            Konva.Container.call(this, config);
        },
        createPNGStream: function() {
            return this.canvas._canvas.createPNGStream();
        },
        /**
         * get layer canvas
         * @method
         * @memberof Konva.BaseLayer.prototype
         */
        getCanvas: function() {
            return this.canvas;
        },
        /**
         * get layer hit canvas
         * @method
         * @memberof Konva.BaseLayer.prototype
         */
        getHitCanvas: function() {
            return this.hitCanvas;
        },
        /**
         * get layer canvas context
         * @method
         * @memberof Konva.BaseLayer.prototype
         */
        getContext: function() {
            return this.getCanvas().getContext();
        },
        /**
         * clear scene and hit canvas contexts tied to the layer
         * @method
         * @memberof Konva.BaseLayer.prototype
         * @param {Object} [bounds]
         * @param {Number} [bounds.x]
         * @param {Number} [bounds.y]
         * @param {Number} [bounds.width]
         * @param {Number} [bounds.height]
         * @example
         * layer.clear();
         * layer.clear({
         *   x : 0,
         *   y : 0,
         *   width : 100,
         *   height : 100
         * });
         */
        clear: function(bounds) {
            this.getContext().clear(bounds);
            return this;
        },
        clearHitCache: function() {
            this._hitImageData = undefined;
        },
        // extend Node.prototype.setZIndex
        setZIndex: function(index) {
            Konva.Node.prototype.setZIndex.call(this, index);
            var stage = this.getStage();
            if(stage) {
                stage.content.removeChild(this.getCanvas()._canvas);

                if(index < stage.getChildren().length - 1) {
                    stage.content.insertBefore(this.getCanvas()._canvas, stage.getChildren()[index + 1].getCanvas()._canvas);
                }
                else {
                    stage.content.appendChild(this.getCanvas()._canvas);
                }
            }
            return this;
        },
        // extend Node.prototype.moveToTop
        moveToTop: function() {
            Konva.Node.prototype.moveToTop.call(this);
            var stage = this.getStage();
            if(stage) {
                stage.content.removeChild(this.getCanvas()._canvas);
                stage.content.appendChild(this.getCanvas()._canvas);
            }
        },
        // extend Node.prototype.moveUp
        moveUp: function() {
            var moved = Konva.Node.prototype.moveUp.call(this);
            if (!moved){
                return;
            }
            var stage = this.getStage();
            if(!stage) {
                return;
            }
            stage.content.removeChild(this.getCanvas()._canvas);

            if(this.index < stage.getChildren().length - 1) {
                stage.content.insertBefore(this.getCanvas()._canvas, stage.getChildren()[this.index + 1].getCanvas()._canvas);
            } else {
                stage.content.appendChild(this.getCanvas()._canvas);
            }
        },
        // extend Node.prototype.moveDown
        moveDown: function() {
            if(Konva.Node.prototype.moveDown.call(this)) {
                var stage = this.getStage();
                if(stage) {
                    var children = stage.getChildren();
                    stage.content.removeChild(this.getCanvas()._canvas);
                    stage.content.insertBefore(this.getCanvas()._canvas, children[this.index + 1].getCanvas()._canvas);
                }
            }
        },
        // extend Node.prototype.moveToBottom
        moveToBottom: function() {
            if(Konva.Node.prototype.moveToBottom.call(this)) {
                var stage = this.getStage();
                if(stage) {
                    var children = stage.getChildren();
                    stage.content.removeChild(this.getCanvas()._canvas);
                    stage.content.insertBefore(this.getCanvas()._canvas, children[1].getCanvas()._canvas);
                }
            }
        },
        getLayer: function() {
            return this;
        },
        remove: function() {
            var _canvas = this.getCanvas()._canvas;

            Konva.Node.prototype.remove.call(this);

            if(_canvas && _canvas.parentNode && Konva.Util._isInDocument(_canvas)) {
                _canvas.parentNode.removeChild(_canvas);
            }
            return this;
        },
        getStage: function() {
            return this.parent;
        },
        setSize: function(width, height) {
            this.canvas.setSize(width, height);
        },
        /**
         * get/set width of layer.getter return width of stage. setter doing nothing.
         * if you want change width use `stage.width(value);`
         * @name width
         * @method
         * @memberof Konva.BaseLayer.prototype
         * @returns {Number}
         * @example
         * var width = layer.width();
         */
        getWidth: function() {
            if (this.parent) {
                return this.parent.getWidth();
            }
        },
        setWidth: function() {
            Konva.Util.warn('Can not change width of layer. Use "stage.width(value)" function instead.');
        },
        /**
         * get/set height of layer.getter return height of stage. setter doing nothing.
         * if you want change height use `stage.height(value);`
         * @name height
         * @method
         * @memberof Konva.BaseLayer.prototype
         * @returns {Number}
         * @example
         * var height = layer.height();
         */
        getHeight: function() {
            if (this.parent) {
                return this.parent.getHeight();
            }
        },
        setHeight: function() {
            Konva.Util.warn('Can not change height of layer. Use "stage.height(value)" function instead.');
        },
        // the apply transform method is handled by the Layer and FastLayer class
        // because it is up to the layer to decide if an absolute or relative transform
        // should be used
        _applyTransform: function(shape, context, top) {
            var m = shape.getAbsoluteTransform(top).getMatrix();
            context.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
        }
    });
    Konva.Util.extend(Konva.BaseLayer, Konva.Container);

    // add getters and setters
    Konva.Factory.addGetterSetter(Konva.BaseLayer, 'clearBeforeDraw', true);
    /**
     * get/set clearBeforeDraw flag which determines if the layer is cleared or not
     *  before drawing
     * @name clearBeforeDraw
     * @method
     * @memberof Konva.BaseLayer.prototype
     * @param {Boolean} clearBeforeDraw
     * @returns {Boolean}
     * @example
     * // get clearBeforeDraw flag
     * var clearBeforeDraw = layer.clearBeforeDraw();
     *
     * // disable clear before draw
     * layer.clearBeforeDraw(false);
     *
     * // enable clear before draw
     * layer.clearBeforeDraw(true);
     */

    Konva.Collection.mapMethods(Konva.BaseLayer);
})();

(function() {
    'use strict';
    // constants
    var HASH = '#',
        BEFORE_DRAW = 'beforeDraw',
        DRAW = 'draw',

        /*
         * 2 - 3 - 4
         * |       |
         * 1 - 0   5
         *         |
         * 8 - 7 - 6
         */
        INTERSECTION_OFFSETS = [
            {x: 0, y: 0},  // 0
            {x: -1, y: 0}, // 1
            {x: -1, y: -1}, // 2
            {x: 0, y: -1}, // 3
            {x: 1, y: -1}, // 4
            {x: 1, y: 0}, // 5
            {x: 1, y: 1}, // 6
            {x: 0, y: 1}, // 7
            {x: -1, y: 1}  // 8
        ],
        INTERSECTION_OFFSETS_LEN = INTERSECTION_OFFSETS.length;

    /**
     * Layer constructor.  Layers are tied to their own canvas element and are used
     * to contain groups or shapes.
     * @constructor
     * @memberof Konva
     * @augments Konva.BaseLayer
     * @param {Object} config
     * @param {Boolean} [config.clearBeforeDraw] set this property to false if you don't want
     * to clear the canvas before each layer draw.  The default value is true.
     * @param {Number} [config.x]
     * @param {Number} [config.y]
     * @param {Number} [config.width]
     * @param {Number} [config.height]
     * @param {Boolean} [config.visible]
     * @param {Boolean} [config.listening] whether or not the node is listening for events
     * @param {String} [config.id] unique id
     * @param {String} [config.name] non-unique name
     * @param {Number} [config.opacity] determines node opacity.  Can be any number between 0 and 1
     * @param {Object} [config.scale] set scale
     * @param {Number} [config.scaleX] set scale x
     * @param {Number} [config.scaleY] set scale y
     * @param {Number} [config.rotation] rotation in degrees
     * @param {Object} [config.offset] offset from center point and rotation point
     * @param {Number} [config.offsetX] set offset x
     * @param {Number} [config.offsetY] set offset y
     * @param {Boolean} [config.draggable] makes the node draggable.  When stages are draggable, you can drag and drop
     *  the entire stage by dragging any portion of the stage
     * @param {Number} [config.dragDistance]
     * @param {Function} [config.dragBoundFunc]
     * * @param {Object} [config.clip] set clip
     * @param {Number} [config.clipX] set clip x
     * @param {Number} [config.clipY] set clip y
     * @param {Number} [config.clipWidth] set clip width
     * @param {Number} [config.clipHeight] set clip height

     * @example
     * var layer = new Konva.Layer();
     */
    Konva.Layer = function(config) {
        this.____init(config);
    };

    Konva.Util.addMethods(Konva.Layer, {
        ____init: function(config) {
            this.nodeType = 'Layer';
            this.canvas = new Konva.SceneCanvas();
            this.hitCanvas = new Konva.HitCanvas({
                pixelRatio: 1
            });
            // call super constructor
            Konva.BaseLayer.call(this, config);
        },
        _setCanvasSize: function(width, height) {
            this.canvas.setSize(width, height);
            this.hitCanvas.setSize(width, height);
        },
        _validateAdd: function(child) {
            var type = child.getType();
            if (type !== 'Group' && type !== 'Shape') {
                Konva.Util.throw('You may only add groups and shapes to a layer.');
            }
        },
        /**
         * get visible intersection shape. This is the preferred
         * method for determining if a point intersects a shape or not
         * @method
         * @memberof Konva.Layer.prototype
         * @param {Object} pos
         * @param {Number} pos.x
         * @param {Number} pos.y
         * @returns {Konva.Shape}
         */
        getIntersection: function(pos) {
            var obj, i, intersectionOffset, shape;

            if(!this.hitGraphEnabled() || !this.isVisible()) {
                return null;
            }
            // in some cases antialiased area may be bigger than 1px
            // it is possible if we will cache node, then scale it a lot
            // TODO: check { 0; 0 } point before loop, and remove it from INTERSECTION_OFFSETS.
            var spiralSearchDistance = 1;
            var continueSearch = false;
            while (true) {
                for (i = 0; i < INTERSECTION_OFFSETS_LEN; i++) {
                    intersectionOffset = INTERSECTION_OFFSETS[i];
                    obj = this._getIntersection({
                        x: pos.x + intersectionOffset.x * spiralSearchDistance,
                        y: pos.y + intersectionOffset.y * spiralSearchDistance
                    });
                    shape = obj.shape;
                    if (shape) {
                        return shape;
                    }
                    // we should continue search if we found antialiased pixel
                    // that means our node somewhere very close
                    continueSearch = !!obj.antialiased;
                    // stop search if found empty pixel
                    if (!obj.antialiased) {
                        break;
                    }
                }
                // if no shape, and no antialiased pixel, we should end searching
                if (continueSearch) {
                    spiralSearchDistance += 1;
                } else {
                    return null;
                }
            }
        },
        _getImageData: function(x, y) {
            var width = this.hitCanvas.width || 1,
                height = this.hitCanvas.height || 1,
                index = (Math.round(y) * width ) + Math.round(x);

            if (!this._hitImageData) {
                this._hitImageData = this.hitCanvas.context.getImageData(0, 0, width, height);
            }

            return [
                this._hitImageData.data[4 * index + 0], // Red
                this._hitImageData.data[4 * index + 1], // Green
                this._hitImageData.data[4 * index + 2], // Blue
                this._hitImageData.data[4 * index + 3] // Alpha
            ];
        },
        _getIntersection: function(pos) {
            var ratio = this.hitCanvas.pixelRatio;
            var p = this.hitCanvas.context.getImageData(Math.round(pos.x * ratio), Math.round(pos.y * ratio), 1, 1).data,
                p3 = p[3],
                colorKey, shape;
            // fully opaque pixel
            if(p3 === 255) {
                colorKey = Konva.Util._rgbToHex(p[0], p[1], p[2]);
                shape = Konva.shapes[HASH + colorKey];
                if (shape) {
                    return {
                        shape: shape
                    };
                }
                return {
                    antialiased: true
                };
            }
            // antialiased pixel
            else if(p3 > 0) {
                return {
                    antialiased: true
                };
            }
            // empty pixel
            return {};
        },
        drawScene: function(can, top) {
            var layer = this.getLayer(),
                canvas = can || (layer && layer.getCanvas());

            this._fire(BEFORE_DRAW, {
                node: this
            });

            if(this.getClearBeforeDraw()) {
                canvas.getContext().clear();
            }

            Konva.Container.prototype.drawScene.call(this, canvas, top);

            this._fire(DRAW, {
                node: this
            });

            return this;
        },
        drawHit: function(can, top) {
            var layer = this.getLayer(),
                canvas = can || (layer && layer.hitCanvas);

            if(layer && layer.getClearBeforeDraw()) {
                layer.getHitCanvas().getContext().clear();
            }

            Konva.Container.prototype.drawHit.call(this, canvas, top);
            this.imageData = null; // Clear imageData cache
            return this;
        },
        clear: function(bounds) {
            Konva.BaseLayer.prototype.clear.call(this, bounds);
            this.getHitCanvas().getContext().clear(bounds);
            this.imageData = null; // Clear getImageData cache
            return this;
        },
        // extend Node.prototype.setVisible
        setVisible: function(visible) {
            Konva.Node.prototype.setVisible.call(this, visible);
            if(visible) {
                this.getCanvas()._canvas.style.display = 'block';
                this.hitCanvas._canvas.style.display = 'block';
            }
            else {
                this.getCanvas()._canvas.style.display = 'none';
                this.hitCanvas._canvas.style.display = 'none';
            }
            return this;
        },
        /**
         * enable hit graph
         * @name enableHitGraph
         * @method
         * @memberof Konva.Layer.prototype
         * @returns {Layer}
         */
        enableHitGraph: function() {
            this.setHitGraphEnabled(true);
            return this;
        },
        /**
         * disable hit graph
         * @name disableHitGraph
         * @method
         * @memberof Konva.Layer.prototype
         * @returns {Layer}
         */
        disableHitGraph: function() {
            this.setHitGraphEnabled(false);
            return this;
        },
        setSize: function(width, height) {
            Konva.BaseLayer.prototype.setSize.call(this, width, height);
            this.hitCanvas.setSize(width, height);
        }
    });
    Konva.Util.extend(Konva.Layer, Konva.BaseLayer);

    Konva.Factory.addGetterSetter(Konva.Layer, 'hitGraphEnabled', true);
    /**
     * get/set hitGraphEnabled flag.  Disabling the hit graph will greatly increase
     *  draw performance because the hit graph will not be redrawn each time the layer is
     *  drawn.  This, however, also disables mouse/touch event detection
     * @name hitGraphEnabled
     * @method
     * @memberof Konva.Layer.prototype
     * @param {Boolean} enabled
     * @returns {Boolean}
     * @example
     * // get hitGraphEnabled flag
     * var hitGraphEnabled = layer.hitGraphEnabled();
     *
     * // disable hit graph
     * layer.hitGraphEnabled(false);
     *
     * // enable hit graph
     * layer.hitGraphEnabled(true);
     */
    Konva.Collection.mapMethods(Konva.Layer);
})();

(function() {
    'use strict';
    /**
     * FastLayer constructor. Layers are tied to their own canvas element and are used
     * to contain shapes only.  If you don't need node nesting, mouse and touch interactions,
     * or event pub/sub, you should use FastLayer instead of Layer to create your layers.
     * It renders about 2x faster than normal layers.
     * @constructor
     * @memberof Konva
     * @augments Konva.BaseLayer
     * @param {Object} config
     * @param {Boolean} [config.clearBeforeDraw] set this property to false if you don't want
     * to clear the canvas before each layer draw.  The default value is true.
     * @param {Boolean} [config.visible]
     * @param {String} [config.id] unique id
     * @param {String} [config.name] non-unique name
     * @param {Number} [config.opacity] determines node opacity.  Can be any number between 0 and 1
     * * @param {Object} [config.clip] set clip
     * @param {Number} [config.clipX] set clip x
     * @param {Number} [config.clipY] set clip y
     * @param {Number} [config.clipWidth] set clip width
     * @param {Number} [config.clipHeight] set clip height

     * @example
     * var layer = new Konva.FastLayer();
     */
    Konva.FastLayer = function(config) {
        this.____init(config);
    };

    Konva.Util.addMethods(Konva.FastLayer, {
        ____init: function(config) {
            this.nodeType = 'Layer';
            this.canvas = new Konva.SceneCanvas();
            // call super constructor
            Konva.BaseLayer.call(this, config);
        },
        _validateAdd: function(child) {
            var type = child.getType();
            if (type !== 'Shape') {
                Konva.Util.throw('You may only add shapes to a fast layer.');
            }
        },
        _setCanvasSize: function(width, height) {
            this.canvas.setSize(width, height);
        },
        hitGraphEnabled: function() {
            return false;
        },
        getIntersection: function() {
            return null;
        },
        drawScene: function(can) {
            var layer = this.getLayer(),
                canvas = can || (layer && layer.getCanvas());

            if(this.getClearBeforeDraw()) {
                canvas.getContext().clear();
            }

            Konva.Container.prototype.drawScene.call(this, canvas);

            return this;
        },
        draw: function() {
            this.drawScene();
            return this;
        },
        // extend Node.prototype.setVisible
        setVisible: function(visible) {
            Konva.Node.prototype.setVisible.call(this, visible);
            if(visible) {
                this.getCanvas()._canvas.style.display = 'block';
            }
            else {
                this.getCanvas()._canvas.style.display = 'none';
            }
            return this;
        }
    });
    Konva.Util.extend(Konva.FastLayer, Konva.BaseLayer);

    Konva.Collection.mapMethods(Konva.FastLayer);
})();

(function() {
    'use strict';
    /**
     * Group constructor.  Groups are used to contain shapes or other groups.
     * @constructor
     * @memberof Konva
     * @augments Konva.Container
     * @param {Object} config
     * @param {Number} [config.x]
     * @param {Number} [config.y]
     * @param {Number} [config.width]
     * @param {Number} [config.height]
     * @param {Boolean} [config.visible]
     * @param {Boolean} [config.listening] whether or not the node is listening for events
     * @param {String} [config.id] unique id
     * @param {String} [config.name] non-unique name
     * @param {Number} [config.opacity] determines node opacity.  Can be any number between 0 and 1
     * @param {Object} [config.scale] set scale
     * @param {Number} [config.scaleX] set scale x
     * @param {Number} [config.scaleY] set scale y
     * @param {Number} [config.rotation] rotation in degrees
     * @param {Object} [config.offset] offset from center point and rotation point
     * @param {Number} [config.offsetX] set offset x
     * @param {Number} [config.offsetY] set offset y
     * @param {Boolean} [config.draggable] makes the node draggable.  When stages are draggable, you can drag and drop
     *  the entire stage by dragging any portion of the stage
     * @param {Number} [config.dragDistance]
     * @param {Function} [config.dragBoundFunc]
     * * @param {Object} [config.clip] set clip
     * @param {Number} [config.clipX] set clip x
     * @param {Number} [config.clipY] set clip y
     * @param {Number} [config.clipWidth] set clip width
     * @param {Number} [config.clipHeight] set clip height

     * @example
     * var group = new Konva.Group();
     */
    Konva.Group = function(config) {
        this.___init(config);
    };

    Konva.Util.addMethods(Konva.Group, {
        ___init: function(config) {
            this.nodeType = 'Group';
            // call super constructor
            Konva.Container.call(this, config);
        },
        _validateAdd: function(child) {
            var type = child.getType();
            if (type !== 'Group' && type !== 'Shape') {
                Konva.Util.throw('You may only add groups and shapes to groups.');
            }
        }
    });
    Konva.Util.extend(Konva.Group, Konva.Container);

    Konva.Collection.mapMethods(Konva.Group);
})();

(function(Konva) {
    'use strict';
    var BATCH_DRAW_STOP_TIME_DIFF = 500;

    var now = (function() {
        if (Konva.root.performance && Konva.root.performance.now) {
            return function() {
                return Konva.root.performance.now();
            };
        }

        return function() {
            return new Date().getTime();
        };
    })();

    function FRAF(callback) {
        setTimeout(callback, 1000 / 60);
    }

    var RAF = (function(){
        return Konva.root.requestAnimationFrame
            || Konva.root.webkitRequestAnimationFrame
            || Konva.root.mozRequestAnimationFrame
            || Konva.root.oRequestAnimationFrame
            || Konva.root.msRequestAnimationFrame
            || FRAF;
    })();



    function requestAnimFrame() {
        return RAF.apply(Konva.root, arguments);
    }

    /**
     * Animation constructor.  A stage is used to contain multiple layers and handle
     * @constructor
     * @memberof Konva
     * @param {Function} func function executed on each animation frame.  The function is passed a frame object, which contains
     *  timeDiff, lastTime, time, and frameRate properties.  The timeDiff property is the number of milliseconds that have passed
     *  since the last animation frame.  The lastTime property is time in milliseconds that elapsed from the moment the animation started
     *  to the last animation frame.  The time property is the time in milliseconds that ellapsed from the moment the animation started
     *  to the current animation frame.  The frameRate property is the current frame rate in frames / second. Return false from function,
     *  if you don't need to redraw layer/layers on some frames.
     * @param {Konva.Layer|Array} [layers] layer(s) to be redrawn on each animation frame. Can be a layer, an array of layers, or null.
     *  Not specifying a node will result in no redraw.
     * @example
     * // move a node to the right at 50 pixels / second
     * var velocity = 50;
     *
     * var anim = new Konva.Animation(function(frame) {
     *   var dist = velocity * (frame.timeDiff / 1000);
     *   node.move(dist, 0);
     * }, layer);
     *
     * anim.start();
     */
    Konva.Animation = function(func, layers) {
        var Anim = Konva.Animation;
        this.func = func;
        this.setLayers(layers);
        this.id = Anim.animIdCounter++;
        this.frame = {
            time: 0,
            timeDiff: 0,
            lastTime: now()
        };
    };
    /*
     * Animation methods
     */
    Konva.Animation.prototype = {
        /**
         * set layers to be redrawn on each animation frame
         * @method
         * @memberof Konva.Animation.prototype
         * @param {Konva.Layer|Array} [layers] layer(s) to be redrawn.&nbsp; Can be a layer, an array of layers, or null.  Not specifying a node will result in no redraw.
         * @return {Konva.Animation} this
         */
        setLayers: function(layers) {
            var lays = [];
            // if passing in no layers
            if (!layers) {
                lays = [];
            }
            // if passing in an array of Layers
            // NOTE: layers could be an array or Konva.Collection.  for simplicity, I'm just inspecting
            // the length property to check for both cases
            else if (layers.length > 0) {
                lays = layers;
            }
            // if passing in a Layer
            else {
                lays = [layers];
            }

            this.layers = lays;
            return this;
        },
        /**
         * get layers
         * @method
         * @memberof Konva.Animation.prototype
         * @return {Array} Array of Konva.Layer
         */
        getLayers: function() {
            return this.layers;
        },
        /**
         * add layer.  Returns true if the layer was added, and false if it was not
         * @method
         * @memberof Konva.Animation.prototype
         * @param {Konva.Layer} layer to add
         * @return {Bool} true if layer is added to animation, otherwise false
         */
        addLayer: function(layer) {
            var layers = this.layers,
                len = layers.length, n;

            // don't add the layer if it already exists
            for (n = 0; n < len; n++) {
                if (layers[n]._id === layer._id){
                    return false;
                }
            }

            this.layers.push(layer);
            return true;
        },
        /**
         * determine if animation is running or not.  returns true or false
         * @method
         * @memberof Konva.Animation.prototype
         * @return {Bool} is animation running?
         */
        isRunning: function() {
            var a = Konva.Animation,
                animations = a.animations,
                len = animations.length,
                n;

            for(n = 0; n < len; n++) {
                if(animations[n].id === this.id) {
                    return true;
                }
            }
            return false;
        },
        /**
         * start animation
         * @method
         * @memberof Konva.Animation.prototype
         * @return {Konva.Animation} this
         */
        start: function() {
            var Anim = Konva.Animation;
            this.stop();
            this.frame.timeDiff = 0;
            this.frame.lastTime = now();
            Anim._addAnimation(this);
            return this;
        },
        /**
         * stop animation
         * @method
         * @memberof Konva.Animation.prototype
         * @return {Konva.Animation} this
         */
        stop: function() {
            Konva.Animation._removeAnimation(this);
            return this;
        },
        _updateFrameObject: function(time) {
            this.frame.timeDiff = time - this.frame.lastTime;
            this.frame.lastTime = time;
            this.frame.time += this.frame.timeDiff;
            this.frame.frameRate = 1000 / this.frame.timeDiff;
        }
    };
    Konva.Animation.animations = [];
    Konva.Animation.animIdCounter = 0;
    Konva.Animation.animRunning = false;

    Konva.Animation._addAnimation = function(anim) {
        this.animations.push(anim);
        this._handleAnimation();
    };
    Konva.Animation._removeAnimation = function(anim) {
        var id = anim.id,
            animations = this.animations,
            len = animations.length,
            n;

        for(n = 0; n < len; n++) {
            if(animations[n].id === id) {
                this.animations.splice(n, 1);
                break;
            }
        }
    };

    Konva.Animation._runFrames = function() {
        var layerHash = {},
            animations = this.animations,
            anim, layers, func, n, i, layersLen, layer, key, needRedraw;
        /*
         * loop through all animations and execute animation
         *  function.  if the animation object has specified node,
         *  we can add the node to the nodes hash to eliminate
         *  drawing the same node multiple times.  The node property
         *  can be the stage itself or a layer
         */
        /*
         * WARNING: don't cache animations.length because it could change while
         * the for loop is running, causing a JS error
         */

        for(n = 0; n < animations.length; n++) {
            anim = animations[n];
            layers = anim.layers;
            func = anim.func;


            anim._updateFrameObject(now());
            layersLen = layers.length;

            // if animation object has a function, execute it
            if (func) {
                // allow anim bypassing drawing
                needRedraw = (func.call(anim, anim.frame) !== false);
            } else {
                needRedraw = true;
            }
            if (!needRedraw) {
                continue;
            }
            for (i = 0; i < layersLen; i++) {
                layer = layers[i];

                if (layer._id !== undefined) {
                    layerHash[layer._id] = layer;
                }
            }
        }

        for (key in layerHash) {
            if (!layerHash.hasOwnProperty(key)) {
                continue;
            }
            layerHash[key].draw();
        }
    };
    Konva.Animation._animationLoop = function() {
        var Anim = Konva.Animation;
        if(Anim.animations.length) {
            requestAnimFrame(Anim._animationLoop);
            Anim._runFrames();
        }
        else {
            Anim.animRunning = false;
        }
    };
    Konva.Animation._handleAnimation = function() {
        if(!this.animRunning) {
            this.animRunning = true;
            this._animationLoop();
        }
    };

    var moveTo = Konva.Node.prototype.moveTo;
    Konva.Node.prototype.moveTo = function(container) {
        moveTo.call(this, container);
    };

    /**
     * batch draw
     * @method
     * @return {Konva.Layer} this
     * @memberof Konva.Base.prototype
     */
    Konva.BaseLayer.prototype.batchDraw = function() {
        var that = this,
            Anim = Konva.Animation;

        if (!this.batchAnim) {
            this.batchAnim = new Anim(function() {
                if (that.lastBatchDrawTime && now() - that.lastBatchDrawTime > BATCH_DRAW_STOP_TIME_DIFF) {
                    that.batchAnim.stop();
                }
            }, this);
        }

        this.lastBatchDrawTime = now();

        if (!this.batchAnim.isRunning()) {
            this.draw();
            this.batchAnim.start();
        }
        return this;
    };

    /**
     * batch draw
     * @method
     * @return {Konva.Stage} this
     * @memberof Konva.Stage.prototype
     */
    Konva.Stage.prototype.batchDraw = function() {
        this.getChildren().each(function(layer) {
            layer.batchDraw();
        });
        return this;
    };
})(Konva);

(function() {
    'use strict';
    var blacklist = {
        node: 1,
        duration: 1,
        easing: 1,
        onFinish: 1,
        yoyo: 1
    },

    PAUSED = 1,
    PLAYING = 2,
    REVERSING = 3,

    idCounter = 0,
    colorAttrs = ['fill', 'stroke', 'shadowColor'];

    var Tween = function(prop, propFunc, func, begin, finish, duration, yoyo) {
        this.prop = prop;
        this.propFunc = propFunc;
        this.begin = begin;
        this._pos = begin;
        this.duration = duration;
        this._change = 0;
        this.prevPos = 0;
        this.yoyo = yoyo;
        this._time = 0;
        this._position = 0;
        this._startTime = 0;
        this._finish = 0;
        this.func = func;
        this._change = finish - this.begin;
        this.pause();
    };
    /*
     * Tween methods
     */
    Tween.prototype = {
        fire: function(str) {
            var handler = this[str];
            if (handler) {
                handler();
            }
        },
        setTime: function(t) {
            if(t > this.duration) {
                if(this.yoyo) {
                    this._time = this.duration;
                    this.reverse();
                }
                else {
                    this.finish();
                }
            }
            else if(t < 0) {
                if(this.yoyo) {
                    this._time = 0;
                    this.play();
                }
                else {
                    this.reset();
                }
            }
            else {
                this._time = t;
                this.update();
            }
        },
        getTime: function() {
            return this._time;
        },
        setPosition: function(p) {
            this.prevPos = this._pos;
            this.propFunc(p);
            this._pos = p;
        },
        getPosition: function(t) {
            if(t === undefined) {
                t = this._time;
            }
            return this.func(t, this.begin, this._change, this.duration);
        },
        play: function() {
            this.state = PLAYING;
            this._startTime = this.getTimer() - this._time;
            this.onEnterFrame();
            this.fire('onPlay');
        },
        reverse: function() {
            this.state = REVERSING;
            this._time = this.duration - this._time;
            this._startTime = this.getTimer() - this._time;
            this.onEnterFrame();
            this.fire('onReverse');
        },
        seek: function(t) {
            this.pause();
            this._time = t;
            this.update();
            this.fire('onSeek');
        },
        reset: function() {
            this.pause();
            this._time = 0;
            this.update();
            this.fire('onReset');
        },
        finish: function() {
            this.pause();
            this._time = this.duration;
            this.update();
            this.fire('onFinish');
        },
        update: function() {
            this.setPosition(this.getPosition(this._time));
        },
        onEnterFrame: function() {
            var t = this.getTimer() - this._startTime;
            if(this.state === PLAYING) {
                this.setTime(t);
            }
            else if (this.state === REVERSING) {
                this.setTime(this.duration - t);
            }
        },
        pause: function() {
            this.state = PAUSED;
            this.fire('onPause');
        },
        getTimer: function() {
            return new Date().getTime();
        }
    };

    /**
     * Tween constructor.  Tweens enable you to animate a node between the current state and a new state.
     *  You can play, pause, reverse, seek, reset, and finish tweens.  By default, tweens are animated using
     *  a linear easing.  For more tweening options, check out {@link Konva.Easings}
     * @constructor
     * @memberof Konva
     * @example
     * // instantiate new tween which fully rotates a node in 1 second
     * var tween = new Konva.Tween({
     *   node: node,
     *   rotationDeg: 360,
     *   duration: 1,
     *   easing: Konva.Easings.EaseInOut
     * });
     *
     * // play tween
     * tween.play();
     *
     * // pause tween
     * tween.pause();
     */
    Konva.Tween = function(config) {
        var that = this,
            node = config.node,
            nodeId = node._id,
            duration,
            easing = config.easing || Konva.Easings.Linear,
            yoyo = !!config.yoyo,
            key;

        if (typeof config.duration === 'undefined') {
            duration = 1;
        } else if (config.duration === 0) {  // zero is bad value for duration
            duration = 0.001;
        } else {
            duration = config.duration;
        }
        this.node = node;
        this._id = idCounter++;

        this.anim = new Konva.Animation(function() {
            that.tween.onEnterFrame();
        }, node.getLayer() || ((node instanceof Konva.Stage) ? node.getLayers() : null));

        this.tween = new Tween(key, function(i) {
            that._tweenFunc(i);
        }, easing, 0, 1, duration * 1000, yoyo);

        this._addListeners();

        // init attrs map
        if (!Konva.Tween.attrs[nodeId]) {
            Konva.Tween.attrs[nodeId] = {};
        }
        if (!Konva.Tween.attrs[nodeId][this._id]) {
            Konva.Tween.attrs[nodeId][this._id] = {};
        }
        // init tweens map
        if (!Konva.Tween.tweens[nodeId]) {
            Konva.Tween.tweens[nodeId] = {};
        }

        for (key in config) {
            if (blacklist[key] === undefined) {
                this._addAttr(key, config[key]);
            }
        }

        this.reset();

        // callbacks
        this.onFinish = config.onFinish;
        this.onReset = config.onReset;
    };

    // start/diff object = attrs.nodeId.tweenId.attr
    Konva.Tween.attrs = {};
    // tweenId = tweens.nodeId.attr
    Konva.Tween.tweens = {};

    Konva.Tween.prototype = {
        _addAttr: function(key, end) {
            var node = this.node,
                nodeId = node._id,
                start, diff, tweenId, n, len, trueEnd, trueStart;

            // remove conflict from tween map if it exists
            tweenId = Konva.Tween.tweens[nodeId][key];

            if (tweenId) {
                delete Konva.Tween.attrs[nodeId][tweenId][key];
            }

            // add to tween map
            start = node.getAttr(key);

            if (Konva.Util._isArray(end)) {
                diff = [];
                len = Math.max(end.length, start.length);

                if (key === 'points' && end.length !== start.length) {
                    // before tweening points we need to make sure that start.length === end.length
                    // Konva.Util._prepareArrayForTween thinking that end.length > start.length

                    if (end.length > start.length) {
                        // so in this case we will increase number of starting points
                        trueStart = start;
                        start = Konva.Util._prepareArrayForTween(start, end, node.closed());
                    } else {
                        // in this case we will increase number of eding points
                        trueEnd = end;
                        end = Konva.Util._prepareArrayForTween(end, start, node.closed());
                    }
                }

                for (n = 0; n < len; n++) {
                    diff.push((end[n]) - (start[n]));
                }

            } else if (colorAttrs.indexOf(key) !== -1) {
                start = Konva.Util.colorToRGBA(start);
                var endRGBA = Konva.Util.colorToRGBA(end);
                diff = {
                    r: endRGBA.r - start.r,
                    g: endRGBA.g - start.g,
                    b: endRGBA.b - start.b,
                    a: endRGBA.a - start.a
                };
            } else {
                diff = end - start;
            }

            Konva.Tween.attrs[nodeId][this._id][key] = {
                start: start,
                diff: diff,
                end: end,
                trueEnd: trueEnd,
                trueStart: trueStart
            };
            Konva.Tween.tweens[nodeId][key] = this._id;
        },
        _tweenFunc: function(i) {
            var node = this.node,
                attrs = Konva.Tween.attrs[node._id][this._id],
                key, attr, start, diff, newVal, n, len, end;

            for (key in attrs) {
                attr = attrs[key];
                start = attr.start;
                diff = attr.diff;
                end = attr.end;

                if (Konva.Util._isArray(start)) {
                    newVal = [];
                    len = Math.max(start.length, end.length);
                    for (n = 0; n < len; n++) {
                        newVal.push((start[n] || 0) + (diff[n] * i));
                    }
                } else if (colorAttrs.indexOf(key) !== -1) {
                    newVal = 'rgba(' +
                            Math.round(start.r + diff.r * i) + ',' +
                            Math.round(start.g + diff.g * i) + ',' +
                            Math.round(start.b + diff.b * i) + ',' +
                            (start.a + diff.a * i) + ')';
                } else {
                    newVal = start + (diff * i);
                }

                node.setAttr(key, newVal);
            }
        },
        _addListeners: function() {
            var that = this;

            // start listeners
            this.tween.onPlay = function() {
                that.anim.start();
            };
            this.tween.onReverse = function() {
                that.anim.start();
            };

            // stop listeners
            this.tween.onPause = function() {
                that.anim.stop();
            };
            this.tween.onFinish = function() {
                var node = that.node;

                // after tweening  points of line we need to set original end
                var attrs = Konva.Tween.attrs[node._id][that._id];
                if (attrs.points && attrs.points.trueEnd) {
                    node.points(attrs.points.trueEnd);
                }

                if (that.onFinish) {
                    that.onFinish.call(that);
                }
            };
            this.tween.onReset = function() {
                var node = that.node;
                // after tweening  points of line we need to set original start
                var attrs = Konva.Tween.attrs[node._id][that._id];
                if (attrs.points && attrs.points.trueStart) {
                    node.points(attrs.points.trueStart);
                }

                if (that.onReset) {
                    that.onReset();
                }
            };
        },
        /**
         * play
         * @method
         * @memberof Konva.Tween.prototype
         * @returns {Tween}
         */
        play: function() {
            this.tween.play();
            return this;
        },
        /**
         * reverse
         * @method
         * @memberof Konva.Tween.prototype
         * @returns {Tween}
         */
        reverse: function() {
            this.tween.reverse();
            return this;
        },
        /**
         * reset
         * @method
         * @memberof Konva.Tween.prototype
         * @returns {Tween}
         */
        reset: function() {
            this.tween.reset();
            return this;
        },
        /**
         * seek
         * @method
         * @memberof Konva.Tween.prototype
         * @param {Integer} t time in seconds between 0 and the duration
         * @returns {Tween}
         */
        seek: function(t) {
            this.tween.seek(t * 1000);
            return this;
        },
        /**
         * pause
         * @method
         * @memberof Konva.Tween.prototype
         * @returns {Tween}
         */
        pause: function() {
            this.tween.pause();
            return this;
        },
        /**
         * finish
         * @method
         * @memberof Konva.Tween.prototype
         * @returns {Tween}
         */
        finish: function() {
            this.tween.finish();
            return this;
        },
        /**
         * destroy
         * @method
         * @memberof Konva.Tween.prototype
         */
        destroy: function() {
            var nodeId = this.node._id,
                thisId = this._id,
                attrs = Konva.Tween.tweens[nodeId],
                key;

            this.pause();

            for (key in attrs) {
                delete Konva.Tween.tweens[nodeId][key];
            }

            delete Konva.Tween.attrs[nodeId][thisId];
        }
    };

    /**
     * Tween node properties. Shorter usage of {@link Konva.Tween} object.
     *
     * @method Konva.Node#to
     * @memberof Konva.Node
     * @param {Object} [params] tween params
     * @example
     *
     * circle.to({
     *  x : 50,
     *  duration : 0.5
     * });
     */
    Konva.Node.prototype.to = function(params) {
        var onFinish = params.onFinish;
        params.node = this;
        params.onFinish = function() {
            this.destroy();
            if (onFinish) {
                onFinish();
            }
        };
        var tween = new Konva.Tween(params);
        tween.play();
    };

    /*
    * These eases were ported from an Adobe Flash tweening library to JavaScript
    * by Xaric
    */

    /**
     * @namespace Easings
     * @memberof Konva
     */
    Konva.Easings = {
        /**
        * back ease in
        * @function
        * @memberof Konva.Easings
        */
        'BackEaseIn': function(t, b, c, d) {
            var s = 1.70158;
            return c * (t /= d) * t * ((s + 1) * t - s) + b;
        },
        /**
        * back ease out
        * @function
        * @memberof Konva.Easings
        */
        'BackEaseOut': function(t, b, c, d) {
            var s = 1.70158;
            return c * (( t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
        },
        /**
        * back ease in out
        * @function
        * @memberof Konva.Easings
        */
        'BackEaseInOut': function(t, b, c, d) {
            var s = 1.70158;
            if((t /= d / 2) < 1) {
                return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
            }
            return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
        },
        /**
        * elastic ease in
        * @function
        * @memberof Konva.Easings
        */
        'ElasticEaseIn': function(t, b, c, d, a, p) {
            // added s = 0
            var s = 0;
            if(t === 0) {
                return b;
            }
            if((t /= d) === 1) {
                return b + c;
            }
            if(!p) {
                p = d * 0.3;
            }
            if(!a || a < Math.abs(c)) {
                a = c;
                s = p / 4;
            }
            else {
                s = p / (2 * Math.PI) * Math.asin(c / a);
            }
            return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        },
        /**
        * elastic ease out
        * @function
        * @memberof Konva.Easings
        */
        'ElasticEaseOut': function(t, b, c, d, a, p) {
            // added s = 0
            var s = 0;
            if(t === 0) {
                return b;
            }
            if((t /= d) === 1) {
                return b + c;
            }
            if(!p) {
                p = d * 0.3;
            }
            if(!a || a < Math.abs(c)) {
                a = c;
                s = p / 4;
            }
            else {
                s = p / (2 * Math.PI) * Math.asin(c / a);
            }
            return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
        },
        /**
        * elastic ease in out
        * @function
        * @memberof Konva.Easings
        */
        'ElasticEaseInOut': function(t, b, c, d, a, p) {
            // added s = 0
            var s = 0;
            if(t === 0) {
                return b;
            }
            if((t /= d / 2) === 2) {
                return b + c;
            }
            if(!p) {
                p = d * (0.3 * 1.5);
            }
            if(!a || a < Math.abs(c)) {
                a = c;
                s = p / 4;
            }
            else {
                s = p / (2 * Math.PI) * Math.asin(c / a);
            }
            if(t < 1) {
                return -0.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
            }
            return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * 0.5 + c + b;
        },
        /**
        * bounce ease out
        * @function
        * @memberof Konva.Easings
        */
        'BounceEaseOut': function(t, b, c, d) {
            if((t /= d) < (1 / 2.75)) {
                return c * (7.5625 * t * t) + b;
            }
            else if(t < (2 / 2.75)) {
                return c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75) + b;
            }
            else if(t < (2.5 / 2.75)) {
                return c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375) + b;
            }
            else {
                return c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375) + b;
            }
        },
        /**
        * bounce ease in
        * @function
        * @memberof Konva.Easings
        */
        'BounceEaseIn': function(t, b, c, d) {
            return c - Konva.Easings.BounceEaseOut(d - t, 0, c, d) + b;
        },
        /**
        * bounce ease in out
        * @function
        * @memberof Konva.Easings
        */
        'BounceEaseInOut': function(t, b, c, d) {
            if(t < d / 2) {
                return Konva.Easings.BounceEaseIn(t * 2, 0, c, d) * 0.5 + b;
            }
            else {
                return Konva.Easings.BounceEaseOut(t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;
            }
        },
        /**
        * ease in
        * @function
        * @memberof Konva.Easings
        */
        'EaseIn': function(t, b, c, d) {
            return c * (t /= d) * t + b;
        },
        /**
        * ease out
        * @function
        * @memberof Konva.Easings
        */
        'EaseOut': function(t, b, c, d) {
            return -c * (t /= d) * (t - 2) + b;
        },
        /**
        * ease in out
        * @function
        * @memberof Konva.Easings
        */
        'EaseInOut': function(t, b, c, d) {
            if((t /= d / 2) < 1) {
                return c / 2 * t * t + b;
            }
            return -c / 2 * ((--t) * (t - 2) - 1) + b;
        },
        /**
        * strong ease in
        * @function
        * @memberof Konva.Easings
        */
        'StrongEaseIn': function(t, b, c, d) {
            return c * (t /= d) * t * t * t * t + b;
        },
        /**
        * strong ease out
        * @function
        * @memberof Konva.Easings
        */
        'StrongEaseOut': function(t, b, c, d) {
            return c * (( t = t / d - 1) * t * t * t * t + 1) + b;
        },
        /**
        * strong ease in out
        * @function
        * @memberof Konva.Easings
        */
        'StrongEaseInOut': function(t, b, c, d) {
            if((t /= d / 2) < 1) {
                return c / 2 * t * t * t * t * t + b;
            }
            return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
        },
        /**
        * linear
        * @function
        * @memberof Konva.Easings
        */
        'Linear': function(t, b, c, d) {
            return c * t / d + b;
        }
    };
})();

(function() {
    'use strict';
    Konva.DD = {
        // properties
        anim: new Konva.Animation(function() {
            var b = this.dirty;
            this.dirty = false;
            return b;
        }),
        isDragging: false,
        justDragged: false,
        offset: {
            x: 0,
            y: 0
        },
        node: null,

        // methods
        _drag: function(evt) {
            var dd = Konva.DD,
                node = dd.node;

            if(node) {
               if(!dd.isDragging) {
                    var pos = node.getStage().getPointerPosition();
                    var dragDistance = node.dragDistance();
                    var distance = Math.max(
                        Math.abs(pos.x - dd.startPointerPos.x),
                        Math.abs(pos.y - dd.startPointerPos.y)
                    );
                    if (distance < dragDistance) {
                        return;
                    }
                }


                node.getStage()._setPointerPosition(evt);
                node._setDragPosition(evt);
                if(!dd.isDragging) {
                    dd.isDragging = true;
                    node.fire('dragstart', {
                        type: 'dragstart',
                        target: node,
                        evt: evt
                    }, true);
                }

                // execute ondragmove if defined
                node.fire('dragmove', {
                    type: 'dragmove',
                    target: node,
                    evt: evt
                }, true);
            }
        },
        _endDragBefore: function(evt) {
            var dd = Konva.DD,
                node = dd.node,
                layer;

            if(node) {
                layer = node.getLayer();
                dd.anim.stop();

                // only fire dragend event if the drag and drop
                // operation actually started.
                if(dd.isDragging) {
                    dd.isDragging = false;
                    dd.justDragged = true;
                    Konva.listenClickTap = false;

                    if (evt) {
                        evt.dragEndNode = node;
                    }
                }

                delete dd.node;

                (layer || node).draw();
            }
        },
        _endDragAfter: function(evt) {
            evt = evt || {};
            var dragEndNode = evt.dragEndNode;

            if (evt && dragEndNode) {
                dragEndNode.fire('dragend', {
                    type: 'dragend',
                    target: dragEndNode,
                    evt: evt
                }, true);
            }
        }
    };

    // Node extenders

    /**
     * initiate drag and drop
     * @method
     * @memberof Konva.Node.prototype
     */
    Konva.Node.prototype.startDrag = function() {
        var dd = Konva.DD,
            stage = this.getStage(),
            layer = this.getLayer(),
            pos = stage.getPointerPosition(),
            ap = this.getAbsolutePosition();

        if(pos) {
            if (dd.node) {
                dd.node.stopDrag();
            }

            dd.node = this;
            dd.startPointerPos = pos;
            dd.offset.x = pos.x - ap.x;
            dd.offset.y = pos.y - ap.y;
            dd.anim.setLayers(layer || this.getLayers());
            dd.anim.start();

            this._setDragPosition();
        }
    };

    Konva.Node.prototype._setDragPosition = function(evt) {
        var dd = Konva.DD,
            pos = this.getStage().getPointerPosition(),
            dbf = this.getDragBoundFunc();
        if (!pos) {
            return;
        }
        var newNodePos = {
            x: pos.x - dd.offset.x,
            y: pos.y - dd.offset.y
        };

        if(dbf !== undefined) {
            newNodePos = dbf.call(this, newNodePos, evt);
        }
        this.setAbsolutePosition(newNodePos);

        if (!this._lastPos || this._lastPos.x !== newNodePos.x ||
            this._lastPos.y !== newNodePos.y) {
            dd.anim.dirty = true;
        }

        this._lastPos = newNodePos;
    };

    /**
     * stop drag and drop
     * @method
     * @memberof Konva.Node.prototype
     */
    Konva.Node.prototype.stopDrag = function() {
        var dd = Konva.DD,
            evt = {};
        dd._endDragBefore(evt);
        dd._endDragAfter(evt);
    };

    Konva.Node.prototype.setDraggable = function(draggable) {
        this._setAttr('draggable', draggable);
        this._dragChange();
    };

    var origDestroy = Konva.Node.prototype.destroy;

    Konva.Node.prototype.destroy = function() {
        var dd = Konva.DD;

        // stop DD
        if(dd.node && dd.node._id === this._id) {

            this.stopDrag();
        }

        origDestroy.call(this);
    };

    /**
     * determine if node is currently in drag and drop mode
     * @method
     * @memberof Konva.Node.prototype
     */
    Konva.Node.prototype.isDragging = function() {
        var dd = Konva.DD;
        return !!(dd.node && dd.node._id === this._id && dd.isDragging);
    };

    Konva.Node.prototype._listenDrag = function() {
        var that = this;

        this._dragCleanup();

        if (this.getClassName() === 'Stage') {
            this.on('contentMousedown.konva contentTouchstart.konva', function(evt) {
                if(!Konva.DD.node) {
                    that.startDrag(evt);
                }
            });
        }
        else {
            this.on('mousedown.konva touchstart.konva', function(evt) {
                // ignore right and middle buttons
                if (evt.evt.button === 1 || evt.evt.button === 2) {
                    return;
                }
                if(!Konva.DD.node) {
                    that.startDrag(evt);
                }
            });
        }

        // listening is required for drag and drop
        /*
        this._listeningEnabled = true;
        this._clearSelfAndAncestorCache('listeningEnabled');
        */
    };

    Konva.Node.prototype._dragChange = function() {
        if(this.attrs.draggable) {
            this._listenDrag();
        }
        else {
            // remove event listeners
            this._dragCleanup();

            /*
             * force drag and drop to end
             * if this node is currently in
             * drag and drop mode
             */
            var stage = this.getStage();
            var dd = Konva.DD;
            if(stage && dd.node && dd.node._id === this._id) {
                dd.node.stopDrag();
            }
        }
    };

    Konva.Node.prototype._dragCleanup = function() {
        if (this.getClassName() === 'Stage') {
            this.off('contentMousedown.konva');
            this.off('contentTouchstart.konva');
        } else {
            this.off('mousedown.konva');
            this.off('touchstart.konva');
        }
    };

    Konva.Factory.addGetterSetter(Konva.Node, 'dragBoundFunc');

    /**
     * get/set drag bound function.  This is used to override the default
     *  drag and drop position
     * @name dragBoundFunc
     * @method
     * @memberof Konva.Node.prototype
     * @param {Function} dragBoundFunc
     * @returns {Function}
     * @example
     * // get drag bound function
     * var dragBoundFunc = node.dragBoundFunc();
     *
     * // create vertical drag and drop
     * node.dragBoundFunc(function(pos){
     *   return {
     *     x: this.getAbsolutePosition().x,
     *     y: pos.y
     *   };
     * });
     */

    Konva.Factory.addGetter(Konva.Node, 'draggable', false);
    Konva.Factory.addOverloadedGetterSetter(Konva.Node, 'draggable');

     /**
     * get/set draggable flag
     * @name draggable
     * @method
     * @memberof Konva.Node.prototype
     * @param {Boolean} draggable
     * @returns {Boolean}
     * @example
     * // get draggable flag
     * var draggable = node.draggable();
     *
     * // enable drag and drop
     * node.draggable(true);
     *
     * // disable drag and drop
     * node.draggable(false);
     */

    var html = Konva.document.documentElement;
    html.addEventListener('mouseup', Konva.DD._endDragBefore, true);
    html.addEventListener('touchend', Konva.DD._endDragBefore, true);

    html.addEventListener('mousemove', Konva.DD._drag);
    html.addEventListener('touchmove', Konva.DD._drag);

    html.addEventListener('mouseup', Konva.DD._endDragAfter, false);
    html.addEventListener('touchend', Konva.DD._endDragAfter, false);

})();

(function() {
    'use strict';
    /**
     * Rect constructor
     * @constructor
     * @memberof Konva
     * @augments Konva.Shape
     * @param {Object} config
     * @param {Number} [config.cornerRadius]
     * @param {String} [config.fill] fill color
     * @param {Image} [config.fillPatternImage] fill pattern image
     * @param {Number} [config.fillPatternX]
     * @param {Number} [config.fillPatternY]
     * @param {Object} [config.fillPatternOffset] object with x and y component
     * @param {Number} [config.fillPatternOffsetX] 
     * @param {Number} [config.fillPatternOffsetY] 
     * @param {Object} [config.fillPatternScale] object with x and y component
     * @param {Number} [config.fillPatternScaleX]
     * @param {Number} [config.fillPatternScaleY]
     * @param {Number} [config.fillPatternRotation]
     * @param {String} [config.fillPatternRepeat] can be "repeat", "repeat-x", "repeat-y", or "no-repeat".  The default is "no-repeat"
     * @param {Object} [config.fillLinearGradientStartPoint] object with x and y component
     * @param {Number} [config.fillLinearGradientStartPointX]
     * @param {Number} [config.fillLinearGradientStartPointY]
     * @param {Object} [config.fillLinearGradientEndPoint] object with x and y component
     * @param {Number} [config.fillLinearGradientEndPointX]
     * @param {Number} [config.fillLinearGradientEndPointY]
     * @param {Array} [config.fillLinearGradientColorStops] array of color stops
     * @param {Object} [config.fillRadialGradientStartPoint] object with x and y component
     * @param {Number} [config.fillRadialGradientStartPointX]
     * @param {Number} [config.fillRadialGradientStartPointY]
     * @param {Object} [config.fillRadialGradientEndPoint] object with x and y component
     * @param {Number} [config.fillRadialGradientEndPointX] 
     * @param {Number} [config.fillRadialGradientEndPointY] 
     * @param {Number} [config.fillRadialGradientStartRadius]
     * @param {Number} [config.fillRadialGradientEndRadius]
     * @param {Array} [config.fillRadialGradientColorStops] array of color stops
     * @param {Boolean} [config.fillEnabled] flag which enables or disables the fill.  The default value is true
     * @param {String} [config.fillPriority] can be color, linear-gradient, radial-graident, or pattern.  The default value is color.  The fillPriority property makes it really easy to toggle between different fill types.  For example, if you want to toggle between a fill color style and a fill pattern style, simply set the fill property and the fillPattern properties, and then use setFillPriority('color') to render the shape with a color fill, or use setFillPriority('pattern') to render the shape with the pattern fill configuration
     * @param {String} [config.stroke] stroke color
     * @param {Number} [config.strokeWidth] stroke width
     * @param {Boolean} [config.strokeHitEnabled] flag which enables or disables stroke hit region.  The default is true
     * @param {Boolean} [config.perfectDrawEnabled] flag which enables or disables using buffer canvas.  The default is true
     * @param {Boolean} [config.shadowForStrokeEnabled] flag which enables or disables shasow for stroke.  The default is true
     * @param {Boolean} [config.strokeScaleEnabled] flag which enables or disables stroke scale.  The default is true
     * @param {Boolean} [config.strokeEnabled] flag which enables or disables the stroke.  The default value is true
     * @param {String} [config.lineJoin] can be miter, round, or bevel.  The default
     *  is miter
     * @param {String} [config.lineCap] can be butt, round, or sqare.  The default
     *  is butt
     * @param {String} [config.shadowColor]
     * @param {Number} [config.shadowBlur]
     * @param {Object} [config.shadowOffset] object with x and y component
     * @param {Number} [config.shadowOffsetX]
     * @param {Number} [config.shadowOffsetY]
     * @param {Number} [config.shadowOpacity] shadow opacity.  Can be any real number
     *  between 0 and 1
     * @param {Boolean} [config.shadowEnabled] flag which enables or disables the shadow.  The default value is true
     * @param {Array} [config.dash]
     * @param {Boolean} [config.dashEnabled] flag which enables or disables the dashArray.  The default value is true
     * @param {Number} [config.x]
     * @param {Number} [config.y]
     * @param {Number} [config.width]
     * @param {Number} [config.height]
     * @param {Boolean} [config.visible]
     * @param {Boolean} [config.listening] whether or not the node is listening for events
     * @param {String} [config.id] unique id
     * @param {String} [config.name] non-unique name
     * @param {Number} [config.opacity] determines node opacity.  Can be any number between 0 and 1
     * @param {Object} [config.scale] set scale
     * @param {Number} [config.scaleX] set scale x
     * @param {Number} [config.scaleY] set scale y
     * @param {Number} [config.rotation] rotation in degrees
     * @param {Object} [config.offset] offset from center point and rotation point
     * @param {Number} [config.offsetX] set offset x
     * @param {Number} [config.offsetY] set offset y
     * @param {Boolean} [config.draggable] makes the node draggable.  When stages are draggable, you can drag and drop
     *  the entire stage by dragging any portion of the stage
     * @param {Number} [config.dragDistance]
     * @param {Function} [config.dragBoundFunc]
     * @example
     * var rect = new Konva.Rect({
     *   width: 100,
     *   height: 50,
     *   fill: 'red',
     *   stroke: 'black',
     *   strokeWidth: 5
     * });
     */
    Konva.Rect = function(config) {
        this.___init(config);
    };

    Konva.Rect.prototype = {
        ___init: function(config) {
            Konva.Shape.call(this, config);
            this.className = 'Rect';
            this.sceneFunc(this._sceneFunc);
        },
        _sceneFunc: function(context) {
            var cornerRadius = this.getCornerRadius(),
                width = this.getWidth(),
                height = this.getHeight();

            context.beginPath();

            if(!cornerRadius) {
                // simple rect - don't bother doing all that complicated maths stuff.
                context.rect(0, 0, width, height);
            } else {
                // arcTo would be nicer, but browser support is patchy (Opera)
                cornerRadius = Math.min(cornerRadius, width / 2, height / 2);
                context.moveTo(cornerRadius, 0);
                context.lineTo(width - cornerRadius, 0);
                context.arc(width - cornerRadius, cornerRadius, cornerRadius, Math.PI * 3 / 2, 0, false);
                context.lineTo(width, height - cornerRadius);
                context.arc(width - cornerRadius, height - cornerRadius, cornerRadius, 0, Math.PI / 2, false);
                context.lineTo(cornerRadius, height);
                context.arc(cornerRadius, height - cornerRadius, cornerRadius, Math.PI / 2, Math.PI, false);
                context.lineTo(0, cornerRadius);
                context.arc(cornerRadius, cornerRadius, cornerRadius, Math.PI, Math.PI * 3 / 2, false);
            }
            context.closePath();
            context.fillStrokeShape(this);
        }
    };

    Konva.Util.extend(Konva.Rect, Konva.Shape);

    Konva.Factory.addGetterSetter(Konva.Rect, 'cornerRadius', 0);
    /**
     * get/set corner radius
     * @name cornerRadius
     * @method
     * @memberof Konva.Rect.prototype
     * @param {Number} cornerRadius
     * @returns {Number}
     * @example
     * // get corner radius
     * var cornerRadius = rect.cornerRadius();
     *
     * // set corner radius
     * rect.cornerRadius(10);
     */

    Konva.Collection.mapMethods(Konva.Rect);
})();

(function() {
    'use strict';
    // the 0.0001 offset fixes a bug in Chrome 27
    var PIx2 = (Math.PI * 2) - 0.0001,
        CIRCLE = 'Circle';

    /**
     * Circle constructor
     * @constructor
     * @memberof Konva
     * @augments Konva.Shape
     * @param {Object} config
     * @param {Number} config.radius
     * @param {String} [config.fill] fill color
     * @param {Image} [config.fillPatternImage] fill pattern image
     * @param {Number} [config.fillPatternX]
     * @param {Number} [config.fillPatternY]
     * @param {Object} [config.fillPatternOffset] object with x and y component
     * @param {Number} [config.fillPatternOffsetX] 
     * @param {Number} [config.fillPatternOffsetY] 
     * @param {Object} [config.fillPatternScale] object with x and y component
     * @param {Number} [config.fillPatternScaleX]
     * @param {Number} [config.fillPatternScaleY]
     * @param {Number} [config.fillPatternRotation]
     * @param {String} [config.fillPatternRepeat] can be "repeat", "repeat-x", "repeat-y", or "no-repeat".  The default is "no-repeat"
     * @param {Object} [config.fillLinearGradientStartPoint] object with x and y component
     * @param {Number} [config.fillLinearGradientStartPointX]
     * @param {Number} [config.fillLinearGradientStartPointY]
     * @param {Object} [config.fillLinearGradientEndPoint] object with x and y component
     * @param {Number} [config.fillLinearGradientEndPointX]
     * @param {Number} [config.fillLinearGradientEndPointY]
     * @param {Array} [config.fillLinearGradientColorStops] array of color stops
     * @param {Object} [config.fillRadialGradientStartPoint] object with x and y component
     * @param {Number} [config.fillRadialGradientStartPointX]
     * @param {Number} [config.fillRadialGradientStartPointY]
     * @param {Object} [config.fillRadialGradientEndPoint] object with x and y component
     * @param {Number} [config.fillRadialGradientEndPointX] 
     * @param {Number} [config.fillRadialGradientEndPointY] 
     * @param {Number} [config.fillRadialGradientStartRadius]
     * @param {Number} [config.fillRadialGradientEndRadius]
     * @param {Array} [config.fillRadialGradientColorStops] array of color stops
     * @param {Boolean} [config.fillEnabled] flag which enables or disables the fill.  The default value is true
     * @param {String} [config.fillPriority] can be color, linear-gradient, radial-graident, or pattern.  The default value is color.  The fillPriority property makes it really easy to toggle between different fill types.  For example, if you want to toggle between a fill color style and a fill pattern style, simply set the fill property and the fillPattern properties, and then use setFillPriority('color') to render the shape with a color fill, or use setFillPriority('pattern') to render the shape with the pattern fill configuration
     * @param {String} [config.stroke] stroke color
     * @param {Number} [config.strokeWidth] stroke width
     * @param {Boolean} [config.strokeHitEnabled] flag which enables or disables stroke hit region.  The default is true
     * @param {Boolean} [config.perfectDrawEnabled] flag which enables or disables using buffer canvas.  The default is true
     * @param {Boolean} [config.shadowForStrokeEnabled] flag which enables or disables shasow for stroke.  The default is true
     * @param {Boolean} [config.strokeScaleEnabled] flag which enables or disables stroke scale.  The default is true
     * @param {Boolean} [config.strokeEnabled] flag which enables or disables the stroke.  The default value is true
     * @param {String} [config.lineJoin] can be miter, round, or bevel.  The default
     *  is miter
     * @param {String} [config.lineCap] can be butt, round, or sqare.  The default
     *  is butt
     * @param {String} [config.shadowColor]
     * @param {Number} [config.shadowBlur]
     * @param {Object} [config.shadowOffset] object with x and y component
     * @param {Number} [config.shadowOffsetX]
     * @param {Number} [config.shadowOffsetY]
     * @param {Number} [config.shadowOpacity] shadow opacity.  Can be any real number
     *  between 0 and 1
     * @param {Boolean} [config.shadowEnabled] flag which enables or disables the shadow.  The default value is true
     * @param {Array} [config.dash]
     * @param {Boolean} [config.dashEnabled] flag which enables or disables the dashArray.  The default value is true
     * @param {Number} [config.x]
     * @param {Number} [config.y]
     * @param {Number} [config.width]
     * @param {Number} [config.height]
     * @param {Boolean} [config.visible]
     * @param {Boolean} [config.listening] whether or not the node is listening for events
     * @param {String} [config.id] unique id
     * @param {String} [config.name] non-unique name
     * @param {Number} [config.opacity] determines node opacity.  Can be any number between 0 and 1
     * @param {Object} [config.scale] set scale
     * @param {Number} [config.scaleX] set scale x
     * @param {Number} [config.scaleY] set scale y
     * @param {Number} [config.rotation] rotation in degrees
     * @param {Object} [config.offset] offset from center point and rotation point
     * @param {Number} [config.offsetX] set offset x
     * @param {Number} [config.offsetY] set offset y
     * @param {Boolean} [config.draggable] makes the node draggable.  When stages are draggable, you can drag and drop
     *  the entire stage by dragging any portion of the stage
     * @param {Number} [config.dragDistance]
     * @param {Function} [config.dragBoundFunc]
     * @example
     * // create circle
     * var circle = new Konva.Circle({
     *   radius: 40,
     *   fill: 'red',
     *   stroke: 'black'
     *   strokeWidth: 5
     * });
     */
    Konva.Circle = function(config) {
        this.___init(config);
    };

    Konva.Circle.prototype = {
        _centroid: true,
        ___init: function(config) {
            // call super constructor
            Konva.Shape.call(this, config);
            this.className = CIRCLE;
            this.sceneFunc(this._sceneFunc);
        },
        _sceneFunc: function(context) {
            context.beginPath();
            context.arc(0, 0, this.getRadius(), 0, PIx2, false);
            context.closePath();
            context.fillStrokeShape(this);
        },
        // implements Shape.prototype.getWidth()
        getWidth: function() {
            return this.getRadius() * 2;
        },
        // implements Shape.prototype.getHeight()
        getHeight: function() {
            return this.getRadius() * 2;
        },
        // implements Shape.prototype.setWidth()
        setWidth: function(width) {
            Konva.Node.prototype.setWidth.call(this, width);
            if (this.radius() !== width / 2) {
                this.setRadius(width / 2);
            }
        },
        // implements Shape.prototype.setHeight()
        setHeight: function(height) {
            Konva.Node.prototype.setHeight.call(this, height);
            if (this.radius() !== height / 2) {
                this.setRadius(height / 2);
            }
        }
    };
    Konva.Util.extend(Konva.Circle, Konva.Shape);

    // add getters setters
    Konva.Factory.addGetterSetter(Konva.Circle, 'radius', 0);
    Konva.Factory.addOverloadedGetterSetter(Konva.Circle, 'radius');

    /**
     * get/set radius
     * @name radius
     * @method
     * @memberof Konva.Circle.prototype
     * @param {Number} radius
     * @returns {Number}
     * @example
     * // get radius
     * var radius = circle.radius();
     *
     * // set radius
     * circle.radius(10);
     */

    Konva.Collection.mapMethods(Konva.Circle);
})();

(function() {
    'use strict';
    // the 0.0001 offset fixes a bug in Chrome 27
    var PIx2 = (Math.PI * 2) - 0.0001,
        ELLIPSE = 'Ellipse';

    /**
     * Ellipse constructor
     * @constructor
     * @augments Konva.Shape
     * @param {Object} config
     * @param {Object} config.radius defines x and y radius
     * @param {String} [config.fill] fill color
     * @param {Image} [config.fillPatternImage] fill pattern image
     * @param {Number} [config.fillPatternX]
     * @param {Number} [config.fillPatternY]
     * @param {Object} [config.fillPatternOffset] object with x and y component
     * @param {Number} [config.fillPatternOffsetX] 
     * @param {Number} [config.fillPatternOffsetY] 
     * @param {Object} [config.fillPatternScale] object with x and y component
     * @param {Number} [config.fillPatternScaleX]
     * @param {Number} [config.fillPatternScaleY]
     * @param {Number} [config.fillPatternRotation]
     * @param {String} [config.fillPatternRepeat] can be "repeat", "repeat-x", "repeat-y", or "no-repeat".  The default is "no-repeat"
     * @param {Object} [config.fillLinearGradientStartPoint] object with x and y component
     * @param {Number} [config.fillLinearGradientStartPointX]
     * @param {Number} [config.fillLinearGradientStartPointY]
     * @param {Object} [config.fillLinearGradientEndPoint] object with x and y component
     * @param {Number} [config.fillLinearGradientEndPointX]
     * @param {Number} [config.fillLinearGradientEndPointY]
     * @param {Array} [config.fillLinearGradientColorStops] array of color stops
     * @param {Object} [config.fillRadialGradientStartPoint] object with x and y component
     * @param {Number} [config.fillRadialGradientStartPointX]
     * @param {Number} [config.fillRadialGradientStartPointY]
     * @param {Object} [config.fillRadialGradientEndPoint] object with x and y component
     * @param {Number} [config.fillRadialGradientEndPointX] 
     * @param {Number} [config.fillRadialGradientEndPointY] 
     * @param {Number} [config.fillRadialGradientStartRadius]
     * @param {Number} [config.fillRadialGradientEndRadius]
     * @param {Array} [config.fillRadialGradientColorStops] array of color stops
     * @param {Boolean} [config.fillEnabled] flag which enables or disables the fill.  The default value is true
     * @param {String} [config.fillPriority] can be color, linear-gradient, radial-graident, or pattern.  The default value is color.  The fillPriority property makes it really easy to toggle between different fill types.  For example, if you want to toggle between a fill color style and a fill pattern style, simply set the fill property and the fillPattern properties, and then use setFillPriority('color') to render the shape with a color fill, or use setFillPriority('pattern') to render the shape with the pattern fill configuration
     * @param {String} [config.stroke] stroke color
     * @param {Number} [config.strokeWidth] stroke width
     * @param {Boolean} [config.strokeHitEnabled] flag which enables or disables stroke hit region.  The default is true
     * @param {Boolean} [config.perfectDrawEnabled] flag which enables or disables using buffer canvas.  The default is true
     * @param {Boolean} [config.shadowForStrokeEnabled] flag which enables or disables shasow for stroke.  The default is true
     * @param {Boolean} [config.strokeScaleEnabled] flag which enables or disables stroke scale.  The default is true
     * @param {Boolean} [config.strokeEnabled] flag which enables or disables the stroke.  The default value is true
     * @param {String} [config.lineJoin] can be miter, round, or bevel.  The default
     *  is miter
     * @param {String} [config.lineCap] can be butt, round, or sqare.  The default
     *  is butt
     * @param {String} [config.shadowColor]
     * @param {Number} [config.shadowBlur]
     * @param {Object} [config.shadowOffset] object with x and y component
     * @param {Number} [config.shadowOffsetX]
     * @param {Number} [config.shadowOffsetY]
     * @param {Number} [config.shadowOpacity] shadow opacity.  Can be any real number
     *  between 0 and 1
     * @param {Boolean} [config.shadowEnabled] flag which enables or disables the shadow.  The default value is true
     * @param {Array} [config.dash]
     * @param {Boolean} [config.dashEnabled] flag which enables or disables the dashArray.  The default value is true
     * @param {Number} [config.x]
     * @param {Number} [config.y]
     * @param {Number} [config.width]
     * @param {Number} [config.height]
     * @param {Boolean} [config.visible]
     * @param {Boolean} [config.listening] whether or not the node is listening for events
     * @param {String} [config.id] unique id
     * @param {String} [config.name] non-unique name
     * @param {Number} [config.opacity] determines node opacity.  Can be any number between 0 and 1
     * @param {Object} [config.scale] set scale
     * @param {Number} [config.scaleX] set scale x
     * @param {Number} [config.scaleY] set scale y
     * @param {Number} [config.rotation] rotation in degrees
     * @param {Object} [config.offset] offset from center point and rotation point
     * @param {Number} [config.offsetX] set offset x
     * @param {Number} [config.offsetY] set offset y
     * @param {Boolean} [config.draggable] makes the node draggable.  When stages are draggable, you can drag and drop
     *  the entire stage by dragging any portion of the stage
     * @param {Number} [config.dragDistance]
     * @param {Function} [config.dragBoundFunc]
     * @example
     * var ellipse = new Konva.Ellipse({
     *   radius : {
     *     x : 50,
     *     y : 50
     *   },
     *   fill: 'red'
     * });
     */
    Konva.Ellipse = function(config) {
        this.___init(config);
    };

    Konva.Ellipse.prototype = {
        _centroid: true,
        ___init: function(config) {
            // call super constructor
            Konva.Shape.call(this, config);
            this.className = ELLIPSE;
            this.sceneFunc(this._sceneFunc);
        },
        _sceneFunc: function(context) {
            var rx = this.getRadiusX(),
                ry = this.getRadiusY();

            context.beginPath();
            context.save();
            if(rx !== ry) {
                context.scale(1, ry / rx);
            }
            context.arc(0, 0, rx, 0, PIx2, false);
            context.restore();
            context.closePath();
            context.fillStrokeShape(this);
        },
        // implements Shape.prototype.getWidth()
        getWidth: function() {
            return this.getRadiusX() * 2;
        },
        // implements Shape.prototype.getHeight()
        getHeight: function() {
            return this.getRadiusY() * 2;
        },
        // implements Shape.prototype.setWidth()
        setWidth: function(width) {
            Konva.Node.prototype.setWidth.call(this, width);
            this.setRadius({
                x: width / 2
            });
        },
        // implements Shape.prototype.setHeight()
        setHeight: function(height) {
            Konva.Node.prototype.setHeight.call(this, height);
            this.setRadius({
                y: height / 2
            });
        }
    };
    Konva.Util.extend(Konva.Ellipse, Konva.Shape);

    // add getters setters
    Konva.Factory.addComponentsGetterSetter(Konva.Ellipse, 'radius', ['x', 'y']);

    /**
     * get/set radius
     * @name radius
     * @method
     * @memberof Konva.Ellipse.prototype
     * @param {Object} radius
     * @param {Number} radius.x
     * @param {Number} radius.y
     * @returns {Object}
     * @example
     * // get radius
     * var radius = ellipse.radius();
     *
     * // set radius
     * ellipse.radius({
     *   x: 200,
     *   y: 100
     * });
     */

    Konva.Factory.addGetterSetter(Konva.Ellipse, 'radiusX', 0);
    /**
     * get/set radius x
     * @name radiusX
     * @method
     * @memberof Konva.Ellipse.prototype
     * @param {Number} x
     * @returns {Number}
     * @example
     * // get radius x
     * var radiusX = ellipse.radiusX();
     *
     * // set radius x
     * ellipse.radiusX(200);
     */

    Konva.Factory.addGetterSetter(Konva.Ellipse, 'radiusY', 0);
    /**
     * get/set radius y
     * @name radiusY
     * @method
     * @memberof Konva.Ellipse.prototype
     * @param {Number} y
     * @returns {Number}
     * @example
     * // get radius y
     * var radiusY = ellipse.radiusY();
     *
     * // set radius y
     * ellipse.radiusY(200);
     */

    Konva.Collection.mapMethods(Konva.Ellipse);

})();

(function() {
    'use strict';
    // the 0.0001 offset fixes a bug in Chrome 27
    var PIx2 = (Math.PI * 2) - 0.0001;
    /**
     * Ring constructor
     * @constructor
     * @augments Konva.Shape
     * @param {Object} config
     * @param {Number} config.innerRadius
     * @param {Number} config.outerRadius
     * @param {Boolean} [config.clockwise]
     * @param {String} [config.fill] fill color
     * @param {Image} [config.fillPatternImage] fill pattern image
     * @param {Number} [config.fillPatternX]
     * @param {Number} [config.fillPatternY]
     * @param {Object} [config.fillPatternOffset] object with x and y component
     * @param {Number} [config.fillPatternOffsetX] 
     * @param {Number} [config.fillPatternOffsetY] 
     * @param {Object} [config.fillPatternScale] object with x and y component
     * @param {Number} [config.fillPatternScaleX]
     * @param {Number} [config.fillPatternScaleY]
     * @param {Number} [config.fillPatternRotation]
     * @param {String} [config.fillPatternRepeat] can be "repeat", "repeat-x", "repeat-y", or "no-repeat".  The default is "no-repeat"
     * @param {Object} [config.fillLinearGradientStartPoint] object with x and y component
     * @param {Number} [config.fillLinearGradientStartPointX]
     * @param {Number} [config.fillLinearGradientStartPointY]
     * @param {Object} [config.fillLinearGradientEndPoint] object with x and y component
     * @param {Number} [config.fillLinearGradientEndPointX]
     * @param {Number} [config.fillLinearGradientEndPointY]
     * @param {Array} [config.fillLinearGradientColorStops] array of color stops
     * @param {Object} [config.fillRadialGradientStartPoint] object with x and y component
     * @param {Number} [config.fillRadialGradientStartPointX]
     * @param {Number} [config.fillRadialGradientStartPointY]
     * @param {Object} [config.fillRadialGradientEndPoint] object with x and y component
     * @param {Number} [config.fillRadialGradientEndPointX] 
     * @param {Number} [config.fillRadialGradientEndPointY] 
     * @param {Number} [config.fillRadialGradientStartRadius]
     * @param {Number} [config.fillRadialGradientEndRadius]
     * @param {Array} [config.fillRadialGradientColorStops] array of color stops
     * @param {Boolean} [config.fillEnabled] flag which enables or disables the fill.  The default value is true
     * @param {String} [config.fillPriority] can be color, linear-gradient, radial-graident, or pattern.  The default value is color.  The fillPriority property makes it really easy to toggle between different fill types.  For example, if you want to toggle between a fill color style and a fill pattern style, simply set the fill property and the fillPattern properties, and then use setFillPriority('color') to render the shape with a color fill, or use setFillPriority('pattern') to render the shape with the pattern fill configuration
     * @param {String} [config.stroke] stroke color
     * @param {Number} [config.strokeWidth] stroke width
     * @param {Boolean} [config.strokeHitEnabled] flag which enables or disables stroke hit region.  The default is true
     * @param {Boolean} [config.perfectDrawEnabled] flag which enables or disables using buffer canvas.  The default is true
     * @param {Boolean} [config.shadowForStrokeEnabled] flag which enables or disables shasow for stroke.  The default is true
     * @param {Boolean} [config.strokeScaleEnabled] flag which enables or disables stroke scale.  The default is true
     * @param {Boolean} [config.strokeEnabled] flag which enables or disables the stroke.  The default value is true
     * @param {String} [config.lineJoin] can be miter, round, or bevel.  The default
     *  is miter
     * @param {String} [config.lineCap] can be butt, round, or sqare.  The default
     *  is butt
     * @param {String} [config.shadowColor]
     * @param {Number} [config.shadowBlur]
     * @param {Object} [config.shadowOffset] object with x and y component
     * @param {Number} [config.shadowOffsetX]
     * @param {Number} [config.shadowOffsetY]
     * @param {Number} [config.shadowOpacity] shadow opacity.  Can be any real number
     *  between 0 and 1
     * @param {Boolean} [config.shadowEnabled] flag which enables or disables the shadow.  The default value is true
     * @param {Array} [config.dash]
     * @param {Boolean} [config.dashEnabled] flag which enables or disables the dashArray.  The default value is true
     * @param {Number} [config.x]
     * @param {Number} [config.y]
     * @param {Number} [config.width]
     * @param {Number} [config.height]
     * @param {Boolean} [config.visible]
     * @param {Boolean} [config.listening] whether or not the node is listening for events
     * @param {String} [config.id] unique id
     * @param {String} [config.name] non-unique name
     * @param {Number} [config.opacity] determines node opacity.  Can be any number between 0 and 1
     * @param {Object} [config.scale] set scale
     * @param {Number} [config.scaleX] set scale x
     * @param {Number} [config.scaleY] set scale y
     * @param {Number} [config.rotation] rotation in degrees
     * @param {Object} [config.offset] offset from center point and rotation point
     * @param {Number} [config.offsetX] set offset x
     * @param {Number} [config.offsetY] set offset y
     * @param {Boolean} [config.draggable] makes the node draggable.  When stages are draggable, you can drag and drop
     *  the entire stage by dragging any portion of the stage
     * @param {Number} [config.dragDistance]
     * @param {Function} [config.dragBoundFunc]
     * @example
     * var ring = new Konva.Ring({
     *   innerRadius: 40,
     *   outerRadius: 80,
     *   fill: 'red',
     *   stroke: 'black',
     *   strokeWidth: 5
     * });
     */
    Konva.Ring = function(config) {
        this.___init(config);
    };

    Konva.Ring.prototype = {
        _centroid: true,
        ___init: function(config) {
            // call super constructor
            Konva.Shape.call(this, config);
            this.className = 'Ring';
            this.sceneFunc(this._sceneFunc);
        },
        _sceneFunc: function(context) {
            context.beginPath();
            context.arc(0, 0, this.getInnerRadius(), 0, PIx2, false);
            context.moveTo(this.getOuterRadius(), 0);
            context.arc(0, 0, this.getOuterRadius(), PIx2, 0, true);
            context.closePath();
            context.fillStrokeShape(this);
        },
        // implements Shape.prototype.getWidth()
        getWidth: function() {
            return this.getOuterRadius() * 2;
        },
        // implements Shape.prototype.getHeight()
        getHeight: function() {
            return this.getOuterRadius() * 2;
        },
        // implements Shape.prototype.setWidth()
        setWidth: function(width) {
            Konva.Node.prototype.setWidth.call(this, width);
            if (this.outerRadius() !== width / 2) {
                this.setOuterRadius(width / 2);
            }
        },
        // implements Shape.prototype.setHeight()
        setHeight: function(height) {
            Konva.Node.prototype.setHeight.call(this, height);
            if (this.outerRadius() !== height / 2) {
                this.setOuterRadius(height / 2);
            }
        },
        setOuterRadius: function(val) {
            this._setAttr('outerRadius', val);
            this.setWidth(val * 2);
            this.setHeight(val * 2);
        }
    };
    Konva.Util.extend(Konva.Ring, Konva.Shape);

    // add getters setters
    Konva.Factory.addGetterSetter(Konva.Ring, 'innerRadius', 0);

    /**
     * get/set innerRadius
     * @name innerRadius
     * @method
     * @memberof Konva.Ring.prototype
     * @param {Number} innerRadius
     * @returns {Number}
     * @example
     * // get inner radius
     * var innerRadius = ring.innerRadius();
     *
     * // set inner radius
     * ring.innerRadius(20);
     */
    Konva.Factory.addGetter(Konva.Ring, 'outerRadius', 0);
    Konva.Factory.addOverloadedGetterSetter(Konva.Ring, 'outerRadius');

    /**
     * get/set outerRadius
     * @name outerRadius
     * @method
     * @memberof Konva.Ring.prototype
     * @param {Number} outerRadius
     * @returns {Number}
     * @example
     * // get outer radius
     * var outerRadius = ring.outerRadius();
     *
     * // set outer radius
     * ring.outerRadius(20);
     */

    Konva.Collection.mapMethods(Konva.Ring);
})();

(function() {
    'use strict';
    /**
     * Wedge constructor
     * @constructor
     * @augments Konva.Shape
     * @param {Object} config
     * @param {Number} config.angle in degrees
     * @param {Number} config.radius
     * @param {Boolean} [config.clockwise]
     * @param {String} [config.fill] fill color
     * @param {Image} [config.fillPatternImage] fill pattern image
     * @param {Number} [config.fillPatternX]
     * @param {Number} [config.fillPatternY]
     * @param {Object} [config.fillPatternOffset] object with x and y component
     * @param {Number} [config.fillPatternOffsetX] 
     * @param {Number} [config.fillPatternOffsetY] 
     * @param {Object} [config.fillPatternScale] object with x and y component
     * @param {Number} [config.fillPatternScaleX]
     * @param {Number} [config.fillPatternScaleY]
     * @param {Number} [config.fillPatternRotation]
     * @param {String} [config.fillPatternRepeat] can be "repeat", "repeat-x", "repeat-y", or "no-repeat".  The default is "no-repeat"
     * @param {Object} [config.fillLinearGradientStartPoint] object with x and y component
     * @param {Number} [config.fillLinearGradientStartPointX]
     * @param {Number} [config.fillLinearGradientStartPointY]
     * @param {Object} [config.fillLinearGradientEndPoint] object with x and y component
     * @param {Number} [config.fillLinearGradientEndPointX]
     * @param {Number} [config.fillLinearGradientEndPointY]
     * @param {Array} [config.fillLinearGradientColorStops] array of color stops
     * @param {Object} [config.fillRadialGradientStartPoint] object with x and y component
     * @param {Number} [config.fillRadialGradientStartPointX]
     * @param {Number} [config.fillRadialGradientStartPointY]
     * @param {Object} [config.fillRadialGradientEndPoint] object with x and y component
     * @param {Number} [config.fillRadialGradientEndPointX] 
     * @param {Number} [config.fillRadialGradientEndPointY] 
     * @param {Number} [config.fillRadialGradientStartRadius]
     * @param {Number} [config.fillRadialGradientEndRadius]
     * @param {Array} [config.fillRadialGradientColorStops] array of color stops
     * @param {Boolean} [config.fillEnabled] flag which enables or disables the fill.  The default value is true
     * @param {String} [config.fillPriority] can be color, linear-gradient, radial-graident, or pattern.  The default value is color.  The fillPriority property makes it really easy to toggle between different fill types.  For example, if you want to toggle between a fill color style and a fill pattern style, simply set the fill property and the fillPattern properties, and then use setFillPriority('color') to render the shape with a color fill, or use setFillPriority('pattern') to render the shape with the pattern fill configuration
     * @param {String} [config.stroke] stroke color
     * @param {Number} [config.strokeWidth] stroke width
     * @param {Boolean} [config.strokeHitEnabled] flag which enables or disables stroke hit region.  The default is true
     * @param {Boolean} [config.perfectDrawEnabled] flag which enables or disables using buffer canvas.  The default is true
     * @param {Boolean} [config.shadowForStrokeEnabled] flag which enables or disables shasow for stroke.  The default is true
     * @param {Boolean} [config.strokeScaleEnabled] flag which enables or disables stroke scale.  The default is true
     * @param {Boolean} [config.strokeEnabled] flag which enables or disables the stroke.  The default value is true
     * @param {String} [config.lineJoin] can be miter, round, or bevel.  The default
     *  is miter
     * @param {String} [config.lineCap] can be butt, round, or sqare.  The default
     *  is butt
     * @param {String} [config.shadowColor]
     * @param {Number} [config.shadowBlur]
     * @param {Object} [config.shadowOffset] object with x and y component
     * @param {Number} [config.shadowOffsetX]
     * @param {Number} [config.shadowOffsetY]
     * @param {Number} [config.shadowOpacity] shadow opacity.  Can be any real number
     *  between 0 and 1
     * @param {Boolean} [config.shadowEnabled] flag which enables or disables the shadow.  The default value is true
     * @param {Array} [config.dash]
     * @param {Boolean} [config.dashEnabled] flag which enables or disables the dashArray.  The default value is true
     * @param {Number} [config.x]
     * @param {Number} [config.y]
     * @param {Number} [config.width]
     * @param {Number} [config.height]
     * @param {Boolean} [config.visible]
     * @param {Boolean} [config.listening] whether or not the node is listening for events
     * @param {String} [config.id] unique id
     * @param {String} [config.name] non-unique name
     * @param {Number} [config.opacity] determines node opacity.  Can be any number between 0 and 1
     * @param {Object} [config.scale] set scale
     * @param {Number} [config.scaleX] set scale x
     * @param {Number} [config.scaleY] set scale y
     * @param {Number} [config.rotation] rotation in degrees
     * @param {Object} [config.offset] offset from center point and rotation point
     * @param {Number} [config.offsetX] set offset x
     * @param {Number} [config.offsetY] set offset y
     * @param {Boolean} [config.draggable] makes the node draggable.  When stages are draggable, you can drag and drop
     *  the entire stage by dragging any portion of the stage
     * @param {Number} [config.dragDistance]
     * @param {Function} [config.dragBoundFunc]
     * @example
     * // draw a wedge that's pointing downwards
     * var wedge = new Konva.Wedge({
     *   radius: 40,
     *   fill: 'red',
     *   stroke: 'black'
     *   strokeWidth: 5,
     *   angleDeg: 60,
     *   rotationDeg: -120
     * });
     */
    Konva.Wedge = function(config) {
        this.___init(config);
    };

    Konva.Wedge.prototype = {
        _centroid: true,
        ___init: function(config) {
            // call super constructor
            Konva.Shape.call(this, config);
            this.className = 'Wedge';
            this.sceneFunc(this._sceneFunc);
        },
        _sceneFunc: function(context) {
            context.beginPath();
            context.arc(0, 0, this.getRadius(), 0, Konva.getAngle(this.getAngle()), this.getClockwise());
            context.lineTo(0, 0);
            context.closePath();
            context.fillStrokeShape(this);
        },
        // implements Shape.prototype.getWidth()
        getWidth: function() {
            return this.getRadius() * 2;
        },
        // implements Shape.prototype.getHeight()
        getHeight: function() {
            return this.getRadius() * 2;
        },
        // implements Shape.prototype.setWidth()
        setWidth: function(width) {
            Konva.Node.prototype.setWidth.call(this, width);
            if (this.radius() !== width / 2) {
                this.setRadius(width / 2);
            }
        },
        // implements Shape.prototype.setHeight()
        setHeight: function(height) {
            Konva.Node.prototype.setHeight.call(this, height);
            if (this.radius() !== height / 2) {
                this.setRadius(height / 2);
            }
        }
    };
    Konva.Util.extend(Konva.Wedge, Konva.Shape);

    // add getters setters
    Konva.Factory.addGetterSetter(Konva.Wedge, 'radius', 0);

    /**
     * get/set radius
     * @name radius
     * @method
     * @memberof Konva.Wedge.prototype
     * @param {Number} radius
     * @returns {Number}
     * @example
     * // get radius
     * var radius = wedge.radius();
     *
     * // set radius
     * wedge.radius(10);
     */

    Konva.Factory.addGetterSetter(Konva.Wedge, 'angle', 0);

    /**
     * get/set angle in degrees
     * @name angle
     * @method
     * @memberof Konva.Wedge.prototype
     * @param {Number} angle
     * @returns {Number}
     * @example
     * // get angle
     * var angle = wedge.angle();
     *
     * // set angle
     * wedge.angle(20);
     */

    Konva.Factory.addGetterSetter(Konva.Wedge, 'clockwise', false);

    /**
     * get/set clockwise flag
     * @name clockwise
     * @method
     * @memberof Konva.Wedge.prototype
     * @param {Number} clockwise
     * @returns {Number}
     * @example
     * // get clockwise flag
     * var clockwise = wedge.clockwise();
     *
     * // draw wedge counter-clockwise
     * wedge.clockwise(false);
     *
     * // draw wedge clockwise
     * wedge.clockwise(true);
     */

    Konva.Factory.backCompat(Konva.Wedge, {
        angleDeg: 'angle',
        getAngleDeg: 'getAngle',
        setAngleDeg: 'setAngle'
    });

    Konva.Collection.mapMethods(Konva.Wedge);
})();

(function() {
    'use strict';
    /**
     * Arc constructor
     * @constructor
     * @augments Konva.Shape
     * @param {Object} config
     * @param {Number} config.angle in degrees
     * @param {Number} config.innerRadius
     * @param {Number} config.outerRadius
     * @param {Boolean} [config.clockwise]
     * @param {String} [config.fill] fill color
     * @param {Image} [config.fillPatternImage] fill pattern image
     * @param {Number} [config.fillPatternX]
     * @param {Number} [config.fillPatternY]
     * @param {Object} [config.fillPatternOffset] object with x and y component
     * @param {Number} [config.fillPatternOffsetX] 
     * @param {Number} [config.fillPatternOffsetY] 
     * @param {Object} [config.fillPatternScale] object with x and y component
     * @param {Number} [config.fillPatternScaleX]
     * @param {Number} [config.fillPatternScaleY]
     * @param {Number} [config.fillPatternRotation]
     * @param {String} [config.fillPatternRepeat] can be "repeat", "repeat-x", "repeat-y", or "no-repeat".  The default is "no-repeat"
     * @param {Object} [config.fillLinearGradientStartPoint] object with x and y component
     * @param {Number} [config.fillLinearGradientStartPointX]
     * @param {Number} [config.fillLinearGradientStartPointY]
     * @param {Object} [config.fillLinearGradientEndPoint] object with x and y component
     * @param {Number} [config.fillLinearGradientEndPointX]
     * @param {Number} [config.fillLinearGradientEndPointY]
     * @param {Array} [config.fillLinearGradientColorStops] array of color stops
     * @param {Object} [config.fillRadialGradientStartPoint] object with x and y component
     * @param {Number} [config.fillRadialGradientStartPointX]
     * @param {Number} [config.fillRadialGradientStartPointY]
     * @param {Object} [config.fillRadialGradientEndPoint] object with x and y component
     * @param {Number} [config.fillRadialGradientEndPointX] 
     * @param {Number} [config.fillRadialGradientEndPointY] 
     * @param {Number} [config.fillRadialGradientStartRadius]
     * @param {Number} [config.fillRadialGradientEndRadius]
     * @param {Array} [config.fillRadialGradientColorStops] array of color stops
     * @param {Boolean} [config.fillEnabled] flag which enables or disables the fill.  The default value is true
     * @param {String} [config.fillPriority] can be color, linear-gradient, radial-graident, or pattern.  The default value is color.  The fillPriority property makes it really easy to toggle between different fill types.  For example, if you want to toggle between a fill color style and a fill pattern style, simply set the fill property and the fillPattern properties, and then use setFillPriority('color') to render the shape with a color fill, or use setFillPriority('pattern') to render the shape with the pattern fill configuration
     * @param {String} [config.stroke] stroke color
     * @param {Number} [config.strokeWidth] stroke width
     * @param {Boolean} [config.strokeHitEnabled] flag which enables or disables stroke hit region.  The default is true
     * @param {Boolean} [config.perfectDrawEnabled] flag which enables or disables using buffer canvas.  The default is true
     * @param {Boolean} [config.shadowForStrokeEnabled] flag which enables or disables shasow for stroke.  The default is true
     * @param {Boolean} [config.strokeScaleEnabled] flag which enables or disables stroke scale.  The default is true
     * @param {Boolean} [config.strokeEnabled] flag which enables or disables the stroke.  The default value is true
     * @param {String} [config.lineJoin] can be miter, round, or bevel.  The default
     *  is miter
     * @param {String} [config.lineCap] can be butt, round, or sqare.  The default
     *  is butt
     * @param {String} [config.shadowColor]
     * @param {Number} [config.shadowBlur]
     * @param {Object} [config.shadowOffset] object with x and y component
     * @param {Number} [config.shadowOffsetX]
     * @param {Number} [config.shadowOffsetY]
     * @param {Number} [config.shadowOpacity] shadow opacity.  Can be any real number
     *  between 0 and 1
     * @param {Boolean} [config.shadowEnabled] flag which enables or disables the shadow.  The default value is true
     * @param {Array} [config.dash]
     * @param {Boolean} [config.dashEnabled] flag which enables or disables the dashArray.  The default value is true
     * @param {Number} [config.x]
     * @param {Number} [config.y]
     * @param {Number} [config.width]
     * @param {Number} [config.height]
     * @param {Boolean} [config.visible]
     * @param {Boolean} [config.listening] whether or not the node is listening for events
     * @param {String} [config.id] unique id
     * @param {String} [config.name] non-unique name
     * @param {Number} [config.opacity] determines node opacity.  Can be any number between 0 and 1
     * @param {Object} [config.scale] set scale
     * @param {Number} [config.scaleX] set scale x
     * @param {Number} [config.scaleY] set scale y
     * @param {Number} [config.rotation] rotation in degrees
     * @param {Object} [config.offset] offset from center point and rotation point
     * @param {Number} [config.offsetX] set offset x
     * @param {Number} [config.offsetY] set offset y
     * @param {Boolean} [config.draggable] makes the node draggable.  When stages are draggable, you can drag and drop
     *  the entire stage by dragging any portion of the stage
     * @param {Number} [config.dragDistance]
     * @param {Function} [config.dragBoundFunc]
     * @example
     * // draw a Arc that's pointing downwards
     * var arc = new Konva.Arc({
     *   innerRadius: 40,
     *   outerRadius: 80,
     *   fill: 'red',
     *   stroke: 'black'
     *   strokeWidth: 5,
     *   angle: 60,
     *   rotationDeg: -120
     * });
     */
    Konva.Arc = function(config) {
        this.___init(config);
    };

    Konva.Arc.prototype = {
        _centroid: true,
        ___init: function(config) {
            // call super constructor
            Konva.Shape.call(this, config);
            this.className = 'Arc';
            this.sceneFunc(this._sceneFunc);
        },
        _sceneFunc: function(context) {
            var angle = Konva.getAngle(this.angle()),
                clockwise = this.clockwise();

            context.beginPath();
            context.arc(0, 0, this.getOuterRadius(), 0, angle, clockwise);
            context.arc(0, 0, this.getInnerRadius(), angle, 0, !clockwise);
            context.closePath();
            context.fillStrokeShape(this);
        },
        // implements Shape.prototype.getWidth()
        getWidth: function() {
            return this.getOuterRadius() * 2;
        },
        // implements Shape.prototype.getHeight()
        getHeight: function() {
            return this.getOuterRadius() * 2;
        },
        // implements Shape.prototype.setWidth()
        setWidth: function(width) {
            Konva.Node.prototype.setWidth.call(this, width);
            if (this.getOuterRadius() !== width / 2) {
                this.setOuterRadius(width / 2);
            }
        },
        // implements Shape.prototype.setHeight()
        setHeight: function(height) {
            Konva.Node.prototype.setHeight.call(this, height);
            if (this.getOuterRadius() !== height / 2) {
                this.setOuterRadius(height / 2);
            }
        }
    };
    Konva.Util.extend(Konva.Arc, Konva.Shape);

    // add getters setters
    Konva.Factory.addGetterSetter(Konva.Arc, 'innerRadius', 0);

    /**
     * get/set innerRadius
     * @name innerRadius
     * @method
     * @memberof Konva.Arc.prototype
     * @param {Number} innerRadius
     * @returns {Number}
     * @example
     * // get inner radius
     * var innerRadius = arc.innerRadius();
     *
     * // set inner radius
     * arc.innerRadius(20);
     */

    Konva.Factory.addGetterSetter(Konva.Arc, 'outerRadius', 0);

    /**
     * get/set outerRadius
     * @name outerRadius
     * @method
     * @memberof Konva.Arc.prototype
     * @param {Number} outerRadius
     * @returns {Number}
     * @example
     * // get outer radius
     * var outerRadius = arc.outerRadius();
     *
     * // set outer radius
     * arc.outerRadius(20);
     */

    Konva.Factory.addGetterSetter(Konva.Arc, 'angle', 0);

    /**
     * get/set angle in degrees
     * @name angle
     * @method
     * @memberof Konva.Arc.prototype
     * @param {Number} angle
     * @returns {Number}
     * @example
     * // get angle
     * var angle = arc.angle();
     *
     * // set angle
     * arc.angle(20);
     */

    Konva.Factory.addGetterSetter(Konva.Arc, 'clockwise', false);

    /**
     * get/set clockwise flag
     * @name clockwise
     * @method
     * @memberof Konva.Arc.prototype
     * @param {Boolean} clockwise
     * @returns {Boolean}
     * @example
     * // get clockwise flag
     * var clockwise = arc.clockwise();
     *
     * // draw arc counter-clockwise
     * arc.clockwise(false);
     *
     * // draw arc clockwise
     * arc.clockwise(true);
     */

    Konva.Collection.mapMethods(Konva.Arc);
})();

(function() {
    'use strict';
    // CONSTANTS
    var IMAGE = 'Image';

    /**
     * Image constructor
     * @constructor
     * @memberof Konva
     * @augments Konva.Shape
     * @param {Object} config
     * @param {Image} config.image
     * @param {Object} [config.crop]
     * @param {String} [config.fill] fill color
     * @param {Image} [config.fillPatternImage] fill pattern image
     * @param {Number} [config.fillPatternX]
     * @param {Number} [config.fillPatternY]
     * @param {Object} [config.fillPatternOffset] object with x and y component
     * @param {Number} [config.fillPatternOffsetX] 
     * @param {Number} [config.fillPatternOffsetY] 
     * @param {Object} [config.fillPatternScale] object with x and y component
     * @param {Number} [config.fillPatternScaleX]
     * @param {Number} [config.fillPatternScaleY]
     * @param {Number} [config.fillPatternRotation]
     * @param {String} [config.fillPatternRepeat] can be "repeat", "repeat-x", "repeat-y", or "no-repeat".  The default is "no-repeat"
     * @param {Object} [config.fillLinearGradientStartPoint] object with x and y component
     * @param {Number} [config.fillLinearGradientStartPointX]
     * @param {Number} [config.fillLinearGradientStartPointY]
     * @param {Object} [config.fillLinearGradientEndPoint] object with x and y component
     * @param {Number} [config.fillLinearGradientEndPointX]
     * @param {Number} [config.fillLinearGradientEndPointY]
     * @param {Array} [config.fillLinearGradientColorStops] array of color stops
     * @param {Object} [config.fillRadialGradientStartPoint] object with x and y component
     * @param {Number} [config.fillRadialGradientStartPointX]
     * @param {Number} [config.fillRadialGradientStartPointY]
     * @param {Object} [config.fillRadialGradientEndPoint] object with x and y component
     * @param {Number} [config.fillRadialGradientEndPointX] 
     * @param {Number} [config.fillRadialGradientEndPointY] 
     * @param {Number} [config.fillRadialGradientStartRadius]
     * @param {Number} [config.fillRadialGradientEndRadius]
     * @param {Array} [config.fillRadialGradientColorStops] array of color stops
     * @param {Boolean} [config.fillEnabled] flag which enables or disables the fill.  The default value is true
     * @param {String} [config.fillPriority] can be color, linear-gradient, radial-graident, or pattern.  The default value is color.  The fillPriority property makes it really easy to toggle between different fill types.  For example, if you want to toggle between a fill color style and a fill pattern style, simply set the fill property and the fillPattern properties, and then use setFillPriority('color') to render the shape with a color fill, or use setFillPriority('pattern') to render the shape with the pattern fill configuration
     * @param {String} [config.stroke] stroke color
     * @param {Number} [config.strokeWidth] stroke width
     * @param {Boolean} [config.strokeHitEnabled] flag which enables or disables stroke hit region.  The default is true
     * @param {Boolean} [config.perfectDrawEnabled] flag which enables or disables using buffer canvas.  The default is true
     * @param {Boolean} [config.shadowForStrokeEnabled] flag which enables or disables shasow for stroke.  The default is true
     * @param {Boolean} [config.strokeScaleEnabled] flag which enables or disables stroke scale.  The default is true
     * @param {Boolean} [config.strokeEnabled] flag which enables or disables the stroke.  The default value is true
     * @param {String} [config.lineJoin] can be miter, round, or bevel.  The default
     *  is miter
     * @param {String} [config.lineCap] can be butt, round, or sqare.  The default
     *  is butt
     * @param {String} [config.shadowColor]
     * @param {Number} [config.shadowBlur]
     * @param {Object} [config.shadowOffset] object with x and y component
     * @param {Number} [config.shadowOffsetX]
     * @param {Number} [config.shadowOffsetY]
     * @param {Number} [config.shadowOpacity] shadow opacity.  Can be any real number
     *  between 0 and 1
     * @param {Boolean} [config.shadowEnabled] flag which enables or disables the shadow.  The default value is true
     * @param {Array} [config.dash]
     * @param {Boolean} [config.dashEnabled] flag which enables or disables the dashArray.  The default value is true
     * @param {Number} [config.x]
     * @param {Number} [config.y]
     * @param {Number} [config.width]
     * @param {Number} [config.height]
     * @param {Boolean} [config.visible]
     * @param {Boolean} [config.listening] whether or not the node is listening for events
     * @param {String} [config.id] unique id
     * @param {String} [config.name] non-unique name
     * @param {Number} [config.opacity] determines node opacity.  Can be any number between 0 and 1
     * @param {Object} [config.scale] set scale
     * @param {Number} [config.scaleX] set scale x
     * @param {Number} [config.scaleY] set scale y
     * @param {Number} [config.rotation] rotation in degrees
     * @param {Object} [config.offset] offset from center point and rotation point
     * @param {Number} [config.offsetX] set offset x
     * @param {Number} [config.offsetY] set offset y
     * @param {Boolean} [config.draggable] makes the node draggable.  When stages are draggable, you can drag and drop
     *  the entire stage by dragging any portion of the stage
     * @param {Number} [config.dragDistance]
     * @param {Function} [config.dragBoundFunc]
     * @example
     * var imageObj = new Image();
     * imageObj.onload = function() {
     *   var image = new Konva.Image({
     *     x: 200,
     *     y: 50,
     *     image: imageObj,
     *     width: 100,
     *     height: 100
     *   });
     * };
     * imageObj.src = '/path/to/image.jpg'
     */
    Konva.Image = function(config) {
        this.___init(config);
    };

    Konva.Image.prototype = {
        ___init: function(config) {
            // call super constructor
            Konva.Shape.call(this, config);
            this.className = IMAGE;
            this.sceneFunc(this._sceneFunc);
            this.hitFunc(this._hitFunc);
        },
        _useBufferCanvas: function() {
            return (this.hasShadow() || this.getAbsoluteOpacity() !== 1) && this.hasStroke() && this.getStage();
        },
        _sceneFunc: function(context) {
            var width = this.getWidth(),
                height = this.getHeight(),
                image = this.getImage(),
                cropWidth, cropHeight, params;

            if (image) {
                cropWidth = this.getCropWidth();
                cropHeight = this.getCropHeight();
                if (cropWidth && cropHeight) {
                    params = [image, this.getCropX(), this.getCropY(), cropWidth, cropHeight, 0, 0, width, height];
                } else {
                    params = [image, 0, 0, width, height];
                }
            }

            if (this.hasFill() || this.hasStroke()) {
                context.beginPath();
                context.rect(0, 0, width, height);
                context.closePath();
                context.fillStrokeShape(this);
            }

            if (image) {
                context.drawImage.apply(context, params);
            }
        },
        _hitFunc: function(context) {
            var width = this.getWidth(),
                height = this.getHeight();

            context.beginPath();
            context.rect(0, 0, width, height);
            context.closePath();
            context.fillStrokeShape(this);
        },
        getWidth: function() {
            var image = this.getImage();
            return this.attrs.width || (image ? image.width : 0);
        },
        getHeight: function() {
            var image = this.getImage();
            return this.attrs.height || (image ? image.height : 0);
        }
    };
    Konva.Util.extend(Konva.Image, Konva.Shape);

    // add getters setters
    Konva.Factory.addGetterSetter(Konva.Image, 'image');

    /**
     * set image
     * @name setImage
     * @method
     * @memberof Konva.Image.prototype
     * @param {Image} image
     */

    /**
     * get image
     * @name getImage
     * @method
     * @memberof Konva.Image.prototype
     * @returns {Image}
     */

    Konva.Factory.addComponentsGetterSetter(Konva.Image, 'crop', ['x', 'y', 'width', 'height']);
    /**
     * get/set crop
     * @method
     * @name crop
     * @memberof Konva.Image.prototype
     * @param {Object} crop
     * @param {Number} crop.x
     * @param {Number} crop.y
     * @param {Number} crop.width
     * @param {Number} crop.height
     * @returns {Object}
     * @example
     * // get crop
     * var crop = image.crop();
     *
     * // set crop
     * image.crop({
     *   x: 20,
     *   y: 20,
     *   width: 20,
     *   height: 20
     * });
     */

    Konva.Factory.addGetterSetter(Konva.Image, 'cropX', 0);
    /**
     * get/set crop x
     * @method
     * @name cropX
     * @memberof Konva.Image.prototype
     * @param {Number} x
     * @returns {Number}
     * @example
     * // get crop x
     * var cropX = image.cropX();
     *
     * // set crop x
     * image.cropX(20);
     */

    Konva.Factory.addGetterSetter(Konva.Image, 'cropY', 0);
    /**
     * get/set crop y
     * @name cropY
     * @method
     * @memberof Konva.Image.prototype
     * @param {Number} y
     * @returns {Number}
     * @example
     * // get crop y
     * var cropY = image.cropY();
     *
     * // set crop y
     * image.cropY(20);
     */

    Konva.Factory.addGetterSetter(Konva.Image, 'cropWidth', 0);
    /**
     * get/set crop width
     * @name cropWidth
     * @method
     * @memberof Konva.Image.prototype
     * @param {Number} width
     * @returns {Number}
     * @example
     * // get crop width
     * var cropWidth = image.cropWidth();
     *
     * // set crop width
     * image.cropWidth(20);
     */

    Konva.Factory.addGetterSetter(Konva.Image, 'cropHeight', 0);
    /**
     * get/set crop height
     * @name cropHeight
     * @method
     * @memberof Konva.Image.prototype
     * @param {Number} height
     * @returns {Number}
     * @example
     * // get crop height
     * var cropHeight = image.cropHeight();
     *
     * // set crop height
     * image.cropHeight(20);
     */

    Konva.Collection.mapMethods(Konva.Image);

    /**
     * load image from given url and create `Konva.Image` instance
     * @method
     * @memberof Konva.Image
     * @param {String} url image source
     * @param {Function} callback with Konva.Image instance as first argument
     * @example
     *  Konva.Image.fromURL(imageURL, function(image){
     *    // image is Konva.Image instance
     *    layer.add(image);
     *    layer.draw();
     *  });
     */
    Konva.Image.fromURL = function(url, callback) {
        var img = new Image();
        img.onload = function() {
          var image = new Konva.Image({
            image: img
          });
          callback(image);
        };
        img.src = url;
    };
})();

/*eslint-disable max-depth */
(function() {
    'use strict';
    // constants
    var AUTO = 'auto',
        //CANVAS = 'canvas',
        CENTER = 'center',
        CHANGE_KONVA = 'Change.konva',
        CONTEXT_2D = '2d',
        DASH = '-',
        EMPTY_STRING = '',
        LEFT = 'left',
        TEXT = 'text',
        TEXT_UPPER = 'Text',
        MIDDLE = 'middle',
        NORMAL = 'normal',
        PX_SPACE = 'px ',
        SPACE = ' ',
        RIGHT = 'right',
        WORD = 'word',
        CHAR = 'char',
        NONE = 'none',
        ATTR_CHANGE_LIST = ['fontFamily', 'fontSize', 'fontStyle', 'fontVariant', 'padding', 'align', 'lineHeight', 'text', 'width', 'height', 'wrap'],

        // cached variables
        attrChangeListLen = ATTR_CHANGE_LIST.length,
        dummyContext = Konva.Util.createCanvasElement().getContext(CONTEXT_2D);

    /**
     * Text constructor
     * @constructor
     * @memberof Konva
     * @augments Konva.Shape
     * @param {Object} config
     * @param {String} [config.fontFamily] default is Arial
     * @param {Number} [config.fontSize] in pixels.  Default is 12
     * @param {String} [config.fontStyle] can be normal, bold, or italic.  Default is normal
     * @param {String} [config.fontVariant] can be normal or small-caps.  Default is normal
     * @param {String} config.text
     * @param {String} [config.align] can be left, center, or right
     * @param {Number} [config.padding]
     * @param {Number} [config.width] default is auto
     * @param {Number} [config.height] default is auto
     * @param {Number} [config.lineHeight] default is 1
     * @param {String} [config.wrap] can be word, char, or none. Default is word
     * @param {String} [config.fill] fill color
     * @param {Image} [config.fillPatternImage] fill pattern image
     * @param {Number} [config.fillPatternX]
     * @param {Number} [config.fillPatternY]
     * @param {Object} [config.fillPatternOffset] object with x and y component
     * @param {Number} [config.fillPatternOffsetX] 
     * @param {Number} [config.fillPatternOffsetY] 
     * @param {Object} [config.fillPatternScale] object with x and y component
     * @param {Number} [config.fillPatternScaleX]
     * @param {Number} [config.fillPatternScaleY]
     * @param {Number} [config.fillPatternRotation]
     * @param {String} [config.fillPatternRepeat] can be "repeat", "repeat-x", "repeat-y", or "no-repeat".  The default is "no-repeat"
     * @param {Object} [config.fillLinearGradientStartPoint] object with x and y component
     * @param {Number} [config.fillLinearGradientStartPointX]
     * @param {Number} [config.fillLinearGradientStartPointY]
     * @param {Object} [config.fillLinearGradientEndPoint] object with x and y component
     * @param {Number} [config.fillLinearGradientEndPointX]
     * @param {Number} [config.fillLinearGradientEndPointY]
     * @param {Array} [config.fillLinearGradientColorStops] array of color stops
     * @param {Object} [config.fillRadialGradientStartPoint] object with x and y component
     * @param {Number} [config.fillRadialGradientStartPointX]
     * @param {Number} [config.fillRadialGradientStartPointY]
     * @param {Object} [config.fillRadialGradientEndPoint] object with x and y component
     * @param {Number} [config.fillRadialGradientEndPointX] 
     * @param {Number} [config.fillRadialGradientEndPointY] 
     * @param {Number} [config.fillRadialGradientStartRadius]
     * @param {Number} [config.fillRadialGradientEndRadius]
     * @param {Array} [config.fillRadialGradientColorStops] array of color stops
     * @param {Boolean} [config.fillEnabled] flag which enables or disables the fill.  The default value is true
     * @param {String} [config.fillPriority] can be color, linear-gradient, radial-graident, or pattern.  The default value is color.  The fillPriority property makes it really easy to toggle between different fill types.  For example, if you want to toggle between a fill color style and a fill pattern style, simply set the fill property and the fillPattern properties, and then use setFillPriority('color') to render the shape with a color fill, or use setFillPriority('pattern') to render the shape with the pattern fill configuration
     * @param {String} [config.stroke] stroke color
     * @param {Number} [config.strokeWidth] stroke width
     * @param {Boolean} [config.strokeHitEnabled] flag which enables or disables stroke hit region.  The default is true
     * @param {Boolean} [config.perfectDrawEnabled] flag which enables or disables using buffer canvas.  The default is true
     * @param {Boolean} [config.shadowForStrokeEnabled] flag which enables or disables shasow for stroke.  The default is true
     * @param {Boolean} [config.strokeScaleEnabled] flag which enables or disables stroke scale.  The default is true
     * @param {Boolean} [config.strokeEnabled] flag which enables or disables the stroke.  The default value is true
     * @param {String} [config.lineJoin] can be miter, round, or bevel.  The default
     *  is miter
     * @param {String} [config.lineCap] can be butt, round, or sqare.  The default
     *  is butt
     * @param {String} [config.shadowColor]
     * @param {Number} [config.shadowBlur]
     * @param {Object} [config.shadowOffset] object with x and y component
     * @param {Number} [config.shadowOffsetX]
     * @param {Number} [config.shadowOffsetY]
     * @param {Number} [config.shadowOpacity] shadow opacity.  Can be any real number
     *  between 0 and 1
     * @param {Boolean} [config.shadowEnabled] flag which enables or disables the shadow.  The default value is true
     * @param {Array} [config.dash]
     * @param {Boolean} [config.dashEnabled] flag which enables or disables the dashArray.  The default value is true
     * @param {Number} [config.x]
     * @param {Number} [config.y]
     * @param {Number} [config.width]
     * @param {Number} [config.height]
     * @param {Boolean} [config.visible]
     * @param {Boolean} [config.listening] whether or not the node is listening for events
     * @param {String} [config.id] unique id
     * @param {String} [config.name] non-unique name
     * @param {Number} [config.opacity] determines node opacity.  Can be any number between 0 and 1
     * @param {Object} [config.scale] set scale
     * @param {Number} [config.scaleX] set scale x
     * @param {Number} [config.scaleY] set scale y
     * @param {Number} [config.rotation] rotation in degrees
     * @param {Object} [config.offset] offset from center point and rotation point
     * @param {Number} [config.offsetX] set offset x
     * @param {Number} [config.offsetY] set offset y
     * @param {Boolean} [config.draggable] makes the node draggable.  When stages are draggable, you can drag and drop
     *  the entire stage by dragging any portion of the stage
     * @param {Number} [config.dragDistance]
     * @param {Function} [config.dragBoundFunc]
     * @example
     * var text = new Konva.Text({
     *   x: 10,
     *   y: 15,
     *   text: 'Simple Text',
     *   fontSize: 30,
     *   fontFamily: 'Calibri',
     *   fill: 'green'
     * });
     */
    Konva.Text = function(config) {
        this.___init(config);
    };
    function _fillFunc(context) {
        context.fillText(this.partialText, 0, 0);
    }
    function _strokeFunc(context) {
        context.strokeText(this.partialText, 0, 0);
    }

    Konva.Text.prototype = {
        ___init: function(config) {
            config = config || {};

            // set default color to black
            if (!config.fillLinearGradientColorStops && !config.fillRadialGradientColorStops) {
                config.fill = config.fill || 'black';
            }

            if (config.width === undefined) {
                config.width = AUTO;
            }
            if (config.height === undefined) {
                config.height = AUTO;
            }

            // call super constructor
            Konva.Shape.call(this, config);

            this._fillFunc = _fillFunc;
            this._strokeFunc = _strokeFunc;
            this.className = TEXT_UPPER;

            // update text data for certain attr changes
            for(var n = 0; n < attrChangeListLen; n++) {
                this.on(ATTR_CHANGE_LIST[n] + CHANGE_KONVA, this._setTextData);
            }

            this._setTextData();
            this.sceneFunc(this._sceneFunc);
            this.hitFunc(this._hitFunc);
        },
        _sceneFunc: function(context) {
            var p = this.getPadding(),
                textHeight = this.getTextHeight(),
                lineHeightPx = this.getLineHeight() * textHeight,
                textArr = this.textArr,
                textArrLen = textArr.length,
                totalWidth = this.getWidth(),
                n;

            context.setAttr('font', this._getContextFont());

            context.setAttr('textBaseline', MIDDLE);
            context.setAttr('textAlign', LEFT);
            context.save();
            if (p) {
                context.translate(p, 0);
                context.translate(0, p + textHeight / 2);
            } else {
                context.translate(0, textHeight / 2);
            }


            // draw text lines
            for(n = 0; n < textArrLen; n++) {
                var obj = textArr[n],
                    text = obj.text,
                    width = obj.width;

                // horizontal alignment
                context.save();
                if(this.getAlign() === RIGHT) {
                    context.translate(totalWidth - width - p * 2, 0);
                }
                else if(this.getAlign() === CENTER) {
                    context.translate((totalWidth - width - p * 2) / 2, 0);
                }

                this.partialText = text;

                context.fillStrokeShape(this);
                context.restore();
                context.translate(0, lineHeightPx);
            }
            context.restore();
        },
        _hitFunc: function(context) {
            var width = this.getWidth(),
                height = this.getHeight();

            context.beginPath();
            context.rect(0, 0, width, height);
            context.closePath();
            context.fillStrokeShape(this);
        },
        setText: function(text) {
            var str = Konva.Util._isString(text) ? text : text.toString();
            this._setAttr(TEXT, str);
            return this;
        },
        /**
         * get width of text area, which includes padding
         * @method
         * @memberof Konva.Text.prototype
         * @returns {Number}
         */
        getWidth: function() {
            return this.attrs.width === AUTO ? this.getTextWidth() + this.getPadding() * 2 : this.attrs.width;
        },
        /**
         * get the height of the text area, which takes into account multi-line text, line heights, and padding
         * @method
         * @memberof Konva.Text.prototype
         * @returns {Number}
         */
        getHeight: function() {
            return this.attrs.height === AUTO ? (this.getTextHeight() * this.textArr.length * this.getLineHeight()) + this.getPadding() * 2 : this.attrs.height;
        },
        /**
         * get text width
         * @method
         * @memberof Konva.Text.prototype
         * @returns {Number}
         */
        getTextWidth: function() {
            return this.textWidth;
        },
        /**
         * get text height
         * @method
         * @memberof Konva.Text.prototype
         * @returns {Number}
         */
        getTextHeight: function() {
            return this.textHeight;
        },
        _getTextSize: function(text) {
            var _context = dummyContext,
                fontSize = this.getFontSize(),
                metrics;

            _context.save();
            _context.font = this._getContextFont();

            metrics = _context.measureText(text);
            _context.restore();
            return {
                width: metrics.width,
                height: parseInt(fontSize, 10)
            };
        },
        _getContextFont: function() {
            return this.getFontStyle() + SPACE + this.getFontVariant() + SPACE + this.getFontSize() + PX_SPACE + this.getFontFamily();
        },
        _addTextLine: function (line, width) {
            return this.textArr.push({text: line, width: width});
        },
        _getTextWidth: function (text) {
            return dummyContext.measureText(text).width;
        },
        _setTextData: function () {
            var lines = this.getText().split('\n'),
                fontSize = +this.getFontSize(),
                textWidth = 0,
                lineHeightPx = this.getLineHeight() * fontSize,
                width = this.attrs.width,
                height = this.attrs.height,
                fixedWidth = width !== AUTO,
                fixedHeight = height !== AUTO,
                padding = this.getPadding(),
                maxWidth = width - padding * 2,
                maxHeightPx = height - padding * 2,
                currentHeightPx = 0,
                wrap = this.getWrap(),
                shouldWrap = wrap !== NONE,
                wrapAtWord = wrap !== CHAR && shouldWrap;

            this.textArr = [];
            dummyContext.save();
            dummyContext.font = this._getContextFont();
            for (var i = 0, max = lines.length; i < max; ++i) {
                var line = lines[i],
                    lineWidth = this._getTextWidth(line);
                if (fixedWidth && lineWidth > maxWidth) {
                    /*
                     * if width is fixed and line does not fit entirely
                     * break the line into multiple fitting lines
                     */
                    while (line.length > 0) {
                        /*
                         * use binary search to find the longest substring that
                         * that would fit in the specified width
                         */
                        var low = 0, high = line.length,
                            match = '', matchWidth = 0;
                        while (low < high) {
                            var mid = (low + high) >>> 1,
                                substr = line.slice(0, mid + 1),
                                substrWidth = this._getTextWidth(substr);
                            if (substrWidth <= maxWidth) {
                                low = mid + 1;
                                match = substr;
                                matchWidth = substrWidth;
                            } else {
                                high = mid;
                            }
                        }
                        /*
                         * 'low' is now the index of the substring end
                         * 'match' is the substring
                         * 'matchWidth' is the substring width in px
                         */
                        if (match) {
                            // a fitting substring was found
                            if (wrapAtWord) {
                                // try to find a space or dash where wrapping could be done
                                var wrapIndex = Math.max(match.lastIndexOf(SPACE),
                                                          match.lastIndexOf(DASH)) + 1;
                                if (wrapIndex > 0) {
                                    // re-cut the substring found at the space/dash position
                                    low = wrapIndex;
                                    match = match.slice(0, low);
                                    matchWidth = this._getTextWidth(match);
                                }
                            }
                            this._addTextLine(match, matchWidth);
                            textWidth = Math.max(textWidth, matchWidth);
                            currentHeightPx += lineHeightPx;
                            if (!shouldWrap ||
                                (fixedHeight && currentHeightPx + lineHeightPx > maxHeightPx)) {
                                /*
                                 * stop wrapping if wrapping is disabled or if adding
                                 * one more line would overflow the fixed height
                                 */
                                break;
                            }
                            line = line.slice(low);
                            if (line.length > 0) {
                                // Check if the remaining text would fit on one line
                                lineWidth = this._getTextWidth(line);
                                if (lineWidth <= maxWidth) {
                                    // if it does, add the line and break out of the loop
                                    this._addTextLine(line, lineWidth);
                                    currentHeightPx += lineHeightPx;
                                    textWidth = Math.max(textWidth, lineWidth);
                                    break;
                                }
                            }
                        } else {
                            // not even one character could fit in the element, abort
                            break;
                        }
                    }
                } else {
                    // element width is automatically adjusted to max line width
                    this._addTextLine(line, lineWidth);
                    currentHeightPx += lineHeightPx;
                    textWidth = Math.max(textWidth, lineWidth);
                }
                // if element height is fixed, abort if adding one more line would overflow
                if (fixedHeight && currentHeightPx + lineHeightPx > maxHeightPx) {
                    break;
                }
            }
            dummyContext.restore();
            this.textHeight = fontSize;
            this.textWidth = textWidth;
        }
    };
    Konva.Util.extend(Konva.Text, Konva.Shape);

    // add getters setters
    Konva.Factory.addGetterSetter(Konva.Text, 'fontFamily', 'Arial');

    /**
     * get/set font family
     * @name fontFamily
     * @method
     * @memberof Konva.Text.prototype
     * @param {String} fontFamily
     * @returns {String}
     * @example
     * // get font family
     * var fontFamily = text.fontFamily();
     *
     * // set font family
     * text.fontFamily('Arial');
     */

    Konva.Factory.addGetterSetter(Konva.Text, 'fontSize', 12);

    /**
     * get/set font size in pixels
     * @name fontSize
     * @method
     * @memberof Konva.Text.prototype
     * @param {Number} fontSize
     * @returns {Number}
     * @example
     * // get font size
     * var fontSize = text.fontSize();
     *
     * // set font size to 22px
     * text.fontSize(22);
     */

    Konva.Factory.addGetterSetter(Konva.Text, 'fontStyle', NORMAL);

    /**
     * set font style.  Can be 'normal', 'italic', or 'bold'.  'normal' is the default.
     * @name fontStyle
     * @method
     * @memberof Konva.Text.prototype
     * @param {String} fontStyle
     * @returns {String}
     * @example
     * // get font style
     * var fontStyle = text.fontStyle();
     *
     * // set font style
     * text.fontStyle('bold');
     */

    Konva.Factory.addGetterSetter(Konva.Text, 'fontVariant', NORMAL);

    /**
     * set font variant.  Can be 'normal' or 'small-caps'.  'normal' is the default.
     * @name fontVariant
     * @method
     * @memberof Konva.Text.prototype
     * @param {String} fontVariant
     * @returns {String}
     * @example
     * // get font variant
     * var fontVariant = text.fontVariant();
     *
     * // set font variant
     * text.fontVariant('small-caps');
     */

    Konva.Factory.addGetterSetter(Konva.Text, 'padding', 0);

    /**
     * set padding
     * @name padding
     * @method
     * @memberof Konva.Text.prototype
     * @param {Number} padding
     * @returns {Number}
     * @example
     * // get padding
     * var padding = text.padding();
     *
     * // set padding to 10 pixels
     * text.padding(10);
     */

    Konva.Factory.addGetterSetter(Konva.Text, 'align', LEFT);

    /**
     * get/set horizontal align of text.  Can be 'left', 'center', or 'right'
     * @name align
     * @method
     * @memberof Konva.Text.prototype
     * @param {String} align
     * @returns {String}
     * @example
     * // get text align
     * var align = text.align();
     *
     * // center text
     * text.align('center');
     *
     * // align text to right
     * text.align('right');
     */

    Konva.Factory.addGetterSetter(Konva.Text, 'lineHeight', 1);

    /**
     * get/set line height.  The default is 1.
     * @name lineHeight
     * @method
     * @memberof Konva.Text.prototype
     * @param {Number} lineHeight
     * @returns {Number}
     * @example
     * // get line height
     * var lineHeight = text.lineHeight();
     *
     * // set the line height
     * text.lineHeight(2);
     */

    Konva.Factory.addGetterSetter(Konva.Text, 'wrap', WORD);

    /**
     * get/set wrap.  Can be word, char, or none. Default is word.
     * @name wrap
     * @method
     * @memberof Konva.Text.prototype
     * @param {String} wrap
     * @returns {String}
     * @example
     * // get wrap
     * var wrap = text.wrap();
     *
     * // set wrap
     * text.wrap('word');
     */

    Konva.Factory.addGetter(Konva.Text, 'text', EMPTY_STRING);
    Konva.Factory.addOverloadedGetterSetter(Konva.Text, 'text');

    /**
     * get/set text
     * @name getText
     * @method
     * @memberof Konva.Text.prototype
     * @param {String} text
     * @returns {String}
     * @example
     * // get text
     * var text = text.text();
     *
     * // set text
     * text.text('Hello world!');
     */

    Konva.Collection.mapMethods(Konva.Text);
})();

(function () {
    'use strict';
    /**
     * Line constructor.&nbsp; Lines are defined by an array of points and
     *  a tension
     * @constructor
     * @memberof Konva
     * @augments Konva.Shape
     * @param {Object} config
     * @param {Array} config.points
     * @param {Number} [config.tension] Higher values will result in a more curvy line.  A value of 0 will result in no interpolation.
     *   The default is 0
     * @param {Boolean} [config.closed] defines whether or not the line shape is closed, creating a polygon or blob
     * @param {String} [config.fill] fill color
     * @param {Image} [config.fillPatternImage] fill pattern image
     * @param {Number} [config.fillPatternX]
     * @param {Number} [config.fillPatternY]
     * @param {Object} [config.fillPatternOffset] object with x and y component
     * @param {Number} [config.fillPatternOffsetX] 
     * @param {Number} [config.fillPatternOffsetY] 
     * @param {Object} [config.fillPatternScale] object with x and y component
     * @param {Number} [config.fillPatternScaleX]
     * @param {Number} [config.fillPatternScaleY]
     * @param {Number} [config.fillPatternRotation]
     * @param {String} [config.fillPatternRepeat] can be "repeat", "repeat-x", "repeat-y", or "no-repeat".  The default is "no-repeat"
     * @param {Object} [config.fillLinearGradientStartPoint] object with x and y component
     * @param {Number} [config.fillLinearGradientStartPointX]
     * @param {Number} [config.fillLinearGradientStartPointY]
     * @param {Object} [config.fillLinearGradientEndPoint] object with x and y component
     * @param {Number} [config.fillLinearGradientEndPointX]
     * @param {Number} [config.fillLinearGradientEndPointY]
     * @param {Array} [config.fillLinearGradientColorStops] array of color stops
     * @param {Object} [config.fillRadialGradientStartPoint] object with x and y component
     * @param {Number} [config.fillRadialGradientStartPointX]
     * @param {Number} [config.fillRadialGradientStartPointY]
     * @param {Object} [config.fillRadialGradientEndPoint] object with x and y component
     * @param {Number} [config.fillRadialGradientEndPointX] 
     * @param {Number} [config.fillRadialGradientEndPointY] 
     * @param {Number} [config.fillRadialGradientStartRadius]
     * @param {Number} [config.fillRadialGradientEndRadius]
     * @param {Array} [config.fillRadialGradientColorStops] array of color stops
     * @param {Boolean} [config.fillEnabled] flag which enables or disables the fill.  The default value is true
     * @param {String} [config.fillPriority] can be color, linear-gradient, radial-graident, or pattern.  The default value is color.  The fillPriority property makes it really easy to toggle between different fill types.  For example, if you want to toggle between a fill color style and a fill pattern style, simply set the fill property and the fillPattern properties, and then use setFillPriority('color') to render the shape with a color fill, or use setFillPriority('pattern') to render the shape with the pattern fill configuration
     * @param {String} [config.stroke] stroke color
     * @param {Number} [config.strokeWidth] stroke width
     * @param {Boolean} [config.strokeHitEnabled] flag which enables or disables stroke hit region.  The default is true
     * @param {Boolean} [config.perfectDrawEnabled] flag which enables or disables using buffer canvas.  The default is true
     * @param {Boolean} [config.shadowForStrokeEnabled] flag which enables or disables shasow for stroke.  The default is true
     * @param {Boolean} [config.strokeScaleEnabled] flag which enables or disables stroke scale.  The default is true
     * @param {Boolean} [config.strokeEnabled] flag which enables or disables the stroke.  The default value is true
     * @param {String} [config.lineJoin] can be miter, round, or bevel.  The default
     *  is miter
     * @param {String} [config.lineCap] can be butt, round, or sqare.  The default
     *  is butt
     * @param {String} [config.shadowColor]
     * @param {Number} [config.shadowBlur]
     * @param {Object} [config.shadowOffset] object with x and y component
     * @param {Number} [config.shadowOffsetX]
     * @param {Number} [config.shadowOffsetY]
     * @param {Number} [config.shadowOpacity] shadow opacity.  Can be any real number
     *  between 0 and 1
     * @param {Boolean} [config.shadowEnabled] flag which enables or disables the shadow.  The default value is true
     * @param {Array} [config.dash]
     * @param {Boolean} [config.dashEnabled] flag which enables or disables the dashArray.  The default value is true
     * @param {Number} [config.x]
     * @param {Number} [config.y]
     * @param {Number} [config.width]
     * @param {Number} [config.height]
     * @param {Boolean} [config.visible]
     * @param {Boolean} [config.listening] whether or not the node is listening for events
     * @param {String} [config.id] unique id
     * @param {String} [config.name] non-unique name
     * @param {Number} [config.opacity] determines node opacity.  Can be any number between 0 and 1
     * @param {Object} [config.scale] set scale
     * @param {Number} [config.scaleX] set scale x
     * @param {Number} [config.scaleY] set scale y
     * @param {Number} [config.rotation] rotation in degrees
     * @param {Object} [config.offset] offset from center point and rotation point
     * @param {Number} [config.offsetX] set offset x
     * @param {Number} [config.offsetY] set offset y
     * @param {Boolean} [config.draggable] makes the node draggable.  When stages are draggable, you can drag and drop
     *  the entire stage by dragging any portion of the stage
     * @param {Number} [config.dragDistance]
     * @param {Function} [config.dragBoundFunc]
     * @example
     * var line = new Konva.Line({
     *   x: 100,
     *   y: 50,
     *   points: [73, 70, 340, 23, 450, 60, 500, 20],
     *   stroke: 'red',
     *   tension: 1
     * });
     */
    Konva.Line = function (config) {
        this.___init(config);
    };

    Konva.Line.prototype = {
        ___init: function (config) {
            // call super constructor
            Konva.Shape.call(this, config);
            this.className = 'Line';

            this.on('pointsChange.konva tensionChange.konva closedChange.konva', function () {
                this._clearCache('tensionPoints');
            });

            this.sceneFunc(this._sceneFunc);
        },
        _sceneFunc: function (context) {
            var points = this.getPoints(),
                length = points.length,
                tension = this.getTension(),
                closed = this.getClosed(),
                tp, len, n;

            if (!length) {
                return;
            }

            context.beginPath();
            context.moveTo(points[0], points[1]);

            // tension
            if (tension !== 0 && length > 4) {
                tp = this.getTensionPoints();
                len = tp.length;
                n = closed ? 0 : 4;

                if (!closed) {
                    context.quadraticCurveTo(tp[0], tp[1], tp[2], tp[3]);
                }

                while (n < len - 2) {
                    context.bezierCurveTo(tp[n++], tp[n++], tp[n++], tp[n++], tp[n++], tp[n++]);
                }

                if (!closed) {
                    context.quadraticCurveTo(tp[len - 2], tp[len - 1], points[length - 2], points[length - 1]);
                }
            }
            // no tension
            else {
                for (n = 2; n < length; n += 2) {
                    context.lineTo(points[n], points[n + 1]);
                }
            }

            // closed e.g. polygons and blobs
            if (closed) {
                context.closePath();
                context.fillStrokeShape(this);
            }
            // open e.g. lines and splines
            else {
                context.strokeShape(this);
            }
        },
        getTensionPoints: function () {
            return this._getCache('tensionPoints', this._getTensionPoints);
        },
        _getTensionPoints: function () {
            if (this.getClosed()) {
                return this._getTensionPointsClosed();
            } else {
                return Konva.Util._expandPoints(this.getPoints(), this.getTension());
            }
        },
        _getTensionPointsClosed: function () {
            var p = this.getPoints(),
                len = p.length,
                tension = this.getTension(),
                util = Konva.Util,
                firstControlPoints = util._getControlPoints(
                    p[len - 2],
                    p[len - 1],
                    p[0],
                    p[1],
                    p[2],
                    p[3],
                    tension
                ),
                lastControlPoints = util._getControlPoints(
                    p[len - 4],
                    p[len - 3],
                    p[len - 2],
                    p[len - 1],
                    p[0],
                    p[1],
                    tension
                ),
                middle = Konva.Util._expandPoints(p, tension),
                tp = [
                    firstControlPoints[2],
                    firstControlPoints[3]
                ]
                .concat(middle)
                .concat([
                    lastControlPoints[0],
                    lastControlPoints[1],
                    p[len - 2],
                    p[len - 1],
                    lastControlPoints[2],
                    lastControlPoints[3],
                    firstControlPoints[0],
                    firstControlPoints[1],
                    p[0],
                    p[1]
                ]);

            return tp;
        },
        getWidth: function () {
            return this.getSelfRect().width;
        },
        getHeight: function () {
            return this.getSelfRect().height;
        },
        // overload size detection
        getSelfRect: function () {
            var points;
            if (this.getTension() !== 0) {
                points = this._getTensionPoints();
            } else {
                points = this.getPoints();
            }
            var minX = points[0];
            var maxX = points[0];
            var minY = points[1];
            var maxY = points[1];
            var x, y;
            for (var i = 0; i < points.length / 2; i++) {
                x = points[i * 2];
                y = points[i * 2 + 1];
                minX = Math.min(minX, x);
                maxX = Math.max(maxX, x);
                minY = Math.min(minY, y);
                maxY = Math.max(maxY, y);
            }
            return {
                x: Math.round(minX),
                y: Math.round(minY),
                width: Math.round(maxX - minX),
                height: Math.round(maxY - minY)
            };
        }
    };
    Konva.Util.extend(Konva.Line, Konva.Shape);

    // add getters setters
    Konva.Factory.addGetterSetter(Konva.Line, 'closed', false);

    /**
     * get/set closed flag.  The default is false
     * @name closed
     * @method
     * @memberof Konva.Line.prototype
     * @param {Boolean} closed
     * @returns {Boolean}
     * @example
     * // get closed flag
     * var closed = line.closed();
     *
     * // close the shape
     * line.closed(true);
     *
     * // open the shape
     * line.closed(false);
     */

    Konva.Factory.addGetterSetter(Konva.Line, 'tension', 0);

    /**
     * get/set tension
     * @name tension
     * @method
     * @memberof Konva.Line.prototype
     * @param {Number} Higher values will result in a more curvy line.  A value of 0 will result in no interpolation.
     *   The default is 0
     * @returns {Number}
     * @example
     * // get tension
     * var tension = line.tension();
     *
     * // set tension
     * line.tension(3);
     */

    Konva.Factory.addGetterSetter(Konva.Line, 'points', []);
    /**
     * get/set points array
     * @name points
     * @method
     * @memberof Konva.Line.prototype
     * @param {Array} points
     * @returns {Array}
     * @example
     * // get points
     * var points = line.points();
     *
     * // set points
     * line.points([10, 20, 30, 40, 50, 60]);
     *
     * // push a new point
     * line.points(line.points().concat([70, 80]));
     */

    Konva.Collection.mapMethods(Konva.Line);
})();

(function() {
    'use strict';
    /**
     * Sprite constructor
     * @constructor
     * @memberof Konva
     * @augments Konva.Shape
     * @param {Object} config
     * @param {String} config.animation animation key
     * @param {Object} config.animations animation map
     * @param {Integer} [config.frameIndex] animation frame index
     * @param {Image} config.image image object
     * @param {String} [config.fill] fill color
     * @param {Image} [config.fillPatternImage] fill pattern image
     * @param {Number} [config.fillPatternX]
     * @param {Number} [config.fillPatternY]
     * @param {Object} [config.fillPatternOffset] object with x and y component
     * @param {Number} [config.fillPatternOffsetX] 
     * @param {Number} [config.fillPatternOffsetY] 
     * @param {Object} [config.fillPatternScale] object with x and y component
     * @param {Number} [config.fillPatternScaleX]
     * @param {Number} [config.fillPatternScaleY]
     * @param {Number} [config.fillPatternRotation]
     * @param {String} [config.fillPatternRepeat] can be "repeat", "repeat-x", "repeat-y", or "no-repeat".  The default is "no-repeat"
     * @param {Object} [config.fillLinearGradientStartPoint] object with x and y component
     * @param {Number} [config.fillLinearGradientStartPointX]
     * @param {Number} [config.fillLinearGradientStartPointY]
     * @param {Object} [config.fillLinearGradientEndPoint] object with x and y component
     * @param {Number} [config.fillLinearGradientEndPointX]
     * @param {Number} [config.fillLinearGradientEndPointY]
     * @param {Array} [config.fillLinearGradientColorStops] array of color stops
     * @param {Object} [config.fillRadialGradientStartPoint] object with x and y component
     * @param {Number} [config.fillRadialGradientStartPointX]
     * @param {Number} [config.fillRadialGradientStartPointY]
     * @param {Object} [config.fillRadialGradientEndPoint] object with x and y component
     * @param {Number} [config.fillRadialGradientEndPointX] 
     * @param {Number} [config.fillRadialGradientEndPointY] 
     * @param {Number} [config.fillRadialGradientStartRadius]
     * @param {Number} [config.fillRadialGradientEndRadius]
     * @param {Array} [config.fillRadialGradientColorStops] array of color stops
     * @param {Boolean} [config.fillEnabled] flag which enables or disables the fill.  The default value is true
     * @param {String} [config.fillPriority] can be color, linear-gradient, radial-graident, or pattern.  The default value is color.  The fillPriority property makes it really easy to toggle between different fill types.  For example, if you want to toggle between a fill color style and a fill pattern style, simply set the fill property and the fillPattern properties, and then use setFillPriority('color') to render the shape with a color fill, or use setFillPriority('pattern') to render the shape with the pattern fill configuration
     * @param {String} [config.stroke] stroke color
     * @param {Number} [config.strokeWidth] stroke width
     * @param {Boolean} [config.strokeHitEnabled] flag which enables or disables stroke hit region.  The default is true
     * @param {Boolean} [config.perfectDrawEnabled] flag which enables or disables using buffer canvas.  The default is true
     * @param {Boolean} [config.shadowForStrokeEnabled] flag which enables or disables shasow for stroke.  The default is true
     * @param {Boolean} [config.strokeScaleEnabled] flag which enables or disables stroke scale.  The default is true
     * @param {Boolean} [config.strokeEnabled] flag which enables or disables the stroke.  The default value is true
     * @param {String} [config.lineJoin] can be miter, round, or bevel.  The default
     *  is miter
     * @param {String} [config.lineCap] can be butt, round, or sqare.  The default
     *  is butt
     * @param {String} [config.shadowColor]
     * @param {Number} [config.shadowBlur]
     * @param {Object} [config.shadowOffset] object with x and y component
     * @param {Number} [config.shadowOffsetX]
     * @param {Number} [config.shadowOffsetY]
     * @param {Number} [config.shadowOpacity] shadow opacity.  Can be any real number
     *  between 0 and 1
     * @param {Boolean} [config.shadowEnabled] flag which enables or disables the shadow.  The default value is true
     * @param {Array} [config.dash]
     * @param {Boolean} [config.dashEnabled] flag which enables or disables the dashArray.  The default value is true
     * @param {Number} [config.x]
     * @param {Number} [config.y]
     * @param {Number} [config.width]
     * @param {Number} [config.height]
     * @param {Boolean} [config.visible]
     * @param {Boolean} [config.listening] whether or not the node is listening for events
     * @param {String} [config.id] unique id
     * @param {String} [config.name] non-unique name
     * @param {Number} [config.opacity] determines node opacity.  Can be any number between 0 and 1
     * @param {Object} [config.scale] set scale
     * @param {Number} [config.scaleX] set scale x
     * @param {Number} [config.scaleY] set scale y
     * @param {Number} [config.rotation] rotation in degrees
     * @param {Object} [config.offset] offset from center point and rotation point
     * @param {Number} [config.offsetX] set offset x
     * @param {Number} [config.offsetY] set offset y
     * @param {Boolean} [config.draggable] makes the node draggable.  When stages are draggable, you can drag and drop
     *  the entire stage by dragging any portion of the stage
     * @param {Number} [config.dragDistance]
     * @param {Function} [config.dragBoundFunc]
     * @example
     * var imageObj = new Image();
     * imageObj.onload = function() {
     *   var sprite = new Konva.Sprite({
     *     x: 200,
     *     y: 100,
     *     image: imageObj,
     *     animation: 'standing',
     *     animations: {
     *       standing: [
     *         // x, y, width, height (6 frames)
     *         0, 0, 49, 109,
     *         52, 0, 49, 109,
     *         105, 0, 49, 109,
     *         158, 0, 49, 109,
     *         210, 0, 49, 109,
     *         262, 0, 49, 109
     *       ],
     *       kicking: [
     *         // x, y, width, height (6 frames)
     *         0, 109, 45, 98,
     *         45, 109, 45, 98,
     *         95, 109, 63, 98,
     *         156, 109, 70, 98,
     *         229, 109, 60, 98,
     *         287, 109, 41, 98
     *       ]
     *     },
     *     frameRate: 7,
     *     frameIndex: 0
     *   });
     * };
     * imageObj.src = '/path/to/image.jpg'
     */
    Konva.Sprite = function(config) {
        this.___init(config);
    };

    Konva.Sprite.prototype = {
        ___init: function(config) {
            // call super constructor
            Konva.Shape.call(this, config);
            this.className = 'Sprite';

            this._updated = true;
            var that = this;
            this.anim = new Konva.Animation(function() {
                // if we don't need to redraw layer we should return false
                var updated = that._updated;
                that._updated = false;
                return updated;
            });
            this.on('animationChange.konva', function() {
                // reset index when animation changes
                this.frameIndex(0);
            });
            this.on('frameIndexChange.konva', function() {
                this._updated = true;
            });
            // smooth change for frameRate
            this.on('frameRateChange.konva', function() {
                if (!this.anim.isRunning()) {
                    return;
                }
                clearInterval(this.interval);
                this._setInterval();
            });

            this.sceneFunc(this._sceneFunc);
            this.hitFunc(this._hitFunc);
        },
        _sceneFunc: function(context) {
            var anim = this.getAnimation(),
                index = this.frameIndex(),
                ix4 = index * 4,
                set = this.getAnimations()[anim],
                offsets = this.frameOffsets(),
                x = set[ix4 + 0],
                y = set[ix4 + 1],
                width = set[ix4 + 2],
                height = set[ix4 + 3],
                shapeWidth = this.width(),
                shapeHeight = this.height(),
                image = this.getImage();

            if (this.hasFill() || this.hasStroke()) {
                context.beginPath();
                context.rect(0, 0, shapeWidth, shapeHeight);
                context.closePath();
                context.fillStrokeShape(this);
            }

            if(image) {
                if (offsets) {
                    var offset = offsets[anim],
                    ix2 = index * 2;
                    context.drawImage(image, x, y, width, height, offset[ix2 + 0], offset[ix2 + 1], shapeWidth, shapeHeight);
                } else {
                    context.drawImage(image, x, y, width, height, 0, 0, shapeWidth, shapeHeight);
                }
            }
        },
        _hitFunc: function(context) {
            var anim = this.getAnimation(),
                index = this.frameIndex(),
                ix4 = index * 4,
                set = this.getAnimations()[anim],
                offsets = this.frameOffsets(),
                shapeWidth = this.width(),
                shapeHeight = this.height();

            context.beginPath();
            if (offsets) {
                var offset = offsets[anim];
                var ix2 = index * 2;
                context.rect(offset[ix2 + 0], offset[ix2 + 1], shapeWidth, shapeHeight);
            } else {
                context.rect(0, 0, shapeWidth, shapeHeight);
            }
            context.closePath();
            context.fillShape(this);
        },
        _useBufferCanvas: function() {
            return (this.hasShadow() || this.getAbsoluteOpacity() !== 1) && this.hasStroke();
        },
        _setInterval: function() {
            var that = this;
            this.interval = setInterval(function() {
                that._updateIndex();
            }, 1000 / this.getFrameRate());
        },
        /**
         * start sprite animation
         * @method
         * @memberof Konva.Sprite.prototype
         */
        start: function() {
            var layer = this.getLayer();

            /*
             * animation object has no executable function because
             *  the updates are done with a fixed FPS with the setInterval
             *  below.  The anim object only needs the layer reference for
             *  redraw
             */
            this.anim.setLayers(layer);
            this._setInterval();
            this.anim.start();
        },
        /**
         * stop sprite animation
         * @method
         * @memberof Konva.Sprite.prototype
         */
        stop: function() {
            this.anim.stop();
            clearInterval(this.interval);
        },
        /**
         * determine if animation of sprite is running or not.  returns true or false
         * @method
         * @memberof Konva.Animation.prototype
         * @returns {Boolean}
         */
        isRunning: function() {
            return this.anim.isRunning();
        },
        _updateIndex: function() {
            var index = this.frameIndex(),
                animation = this.getAnimation(),
                animations = this.getAnimations(),
                anim = animations[animation],
                len = anim.length / 4;

            if(index < len - 1) {
                this.frameIndex(index + 1);
            }
            else {
                this.frameIndex(0);
            }
        }
    };
    Konva.Util.extend(Konva.Sprite, Konva.Shape);

    // add getters setters
    Konva.Factory.addGetterSetter(Konva.Sprite, 'animation');

    /**
     * get/set animation key
     * @name animation
     * @method
     * @memberof Konva.Sprite.prototype
     * @param {String} anim animation key
     * @returns {String}
     * @example
     * // get animation key
     * var animation = sprite.animation();
     *
     * // set animation key
     * sprite.animation('kicking');
     */

    Konva.Factory.addGetterSetter(Konva.Sprite, 'animations');

    /**
     * get/set animations map
     * @name animations
     * @method
     * @memberof Konva.Sprite.prototype
     * @param {Object} animations
     * @returns {Object}
     * @example
     * // get animations map
     * var animations = sprite.animations();
     *
     * // set animations map
     * sprite.animations({
     *   standing: [
     *     // x, y, width, height (6 frames)
     *     0, 0, 49, 109,
     *     52, 0, 49, 109,
     *     105, 0, 49, 109,
     *     158, 0, 49, 109,
     *     210, 0, 49, 109,
     *     262, 0, 49, 109
     *   ],
     *   kicking: [
     *     // x, y, width, height (6 frames)
     *     0, 109, 45, 98,
     *     45, 109, 45, 98,
     *     95, 109, 63, 98,
     *     156, 109, 70, 98,
     *     229, 109, 60, 98,
     *     287, 109, 41, 98
     *   ]
     * });
     */

    Konva.Factory.addGetterSetter(Konva.Sprite, 'frameOffsets');

    /**
    * get/set offsets map
    * @name offsets
    * @method
    * @memberof Konva.Sprite.prototype
    * @param {Object} offsets
    * @returns {Object}
    * @example
    * // get offsets map
    * var offsets = sprite.offsets();
    *
    * // set offsets map
    * sprite.offsets({
    *   standing: [
    *     // x, y (6 frames)
    *     0, 0,
    *     0, 0,
    *     5, 0,
    *     0, 0,
    *     0, 3,
    *     2, 0
    *   ],
    *   kicking: [
    *     // x, y (6 frames)
    *     0, 5,
    *     5, 0,
    *     10, 0,
    *     0, 0,
    *     2, 1,
    *     0, 0
    *   ]
    * });
    */

    Konva.Factory.addGetterSetter(Konva.Sprite, 'image');

    /**
     * get/set image
     * @name image
     * @method
     * @memberof Konva.Sprite.prototype
     * @param {Image} image
     * @returns {Image}
     * @example
     * // get image
     * var image = sprite.image();
     *
     * // set image
     * sprite.image(imageObj);
     */

    Konva.Factory.addGetterSetter(Konva.Sprite, 'frameIndex', 0);

    /**
     * set/set animation frame index
     * @name frameIndex
     * @method
     * @memberof Konva.Sprite.prototype
     * @param {Integer} frameIndex
     * @returns {Integer}
     * @example
     * // get animation frame index
     * var frameIndex = sprite.frameIndex();
     *
     * // set animation frame index
     * sprite.frameIndex(3);
     */

    Konva.Factory.addGetterSetter(Konva.Sprite, 'frameRate', 17);

    /**
     * get/set frame rate in frames per second.  Increase this number to make the sprite
     *  animation run faster, and decrease the number to make the sprite animation run slower
     *  The default is 17 frames per second
     * @name frameRate
     * @method
     * @memberof Konva.Sprite.prototype
     * @param {Integer} frameRate
     * @returns {Integer}
     * @example
     * // get frame rate
     * var frameRate = sprite.frameRate();
     *
     * // set frame rate to 2 frames per second
     * sprite.frameRate(2);
     */

    Konva.Factory.backCompat(Konva.Sprite, {
        index: 'frameIndex',
        getIndex: 'getFrameIndex',
        setIndex: 'setFrameIndex'
    });

    Konva.Collection.mapMethods(Konva.Sprite);
})();

/*eslint-disable  no-shadow, max-len, max-depth */
(function () {
    'use strict';
    /**
     * Path constructor.
     * @author Jason Follas
     * @constructor
     * @memberof Konva
     * @augments Konva.Shape
     * @param {Object} config
     * @param {String} config.data SVG data string
     * @param {String} [config.fill] fill color
     * @param {Image} [config.fillPatternImage] fill pattern image
     * @param {Number} [config.fillPatternX]
     * @param {Number} [config.fillPatternY]
     * @param {Object} [config.fillPatternOffset] object with x and y component
     * @param {Number} [config.fillPatternOffsetX] 
     * @param {Number} [config.fillPatternOffsetY] 
     * @param {Object} [config.fillPatternScale] object with x and y component
     * @param {Number} [config.fillPatternScaleX]
     * @param {Number} [config.fillPatternScaleY]
     * @param {Number} [config.fillPatternRotation]
     * @param {String} [config.fillPatternRepeat] can be "repeat", "repeat-x", "repeat-y", or "no-repeat".  The default is "no-repeat"
     * @param {Object} [config.fillLinearGradientStartPoint] object with x and y component
     * @param {Number} [config.fillLinearGradientStartPointX]
     * @param {Number} [config.fillLinearGradientStartPointY]
     * @param {Object} [config.fillLinearGradientEndPoint] object with x and y component
     * @param {Number} [config.fillLinearGradientEndPointX]
     * @param {Number} [config.fillLinearGradientEndPointY]
     * @param {Array} [config.fillLinearGradientColorStops] array of color stops
     * @param {Object} [config.fillRadialGradientStartPoint] object with x and y component
     * @param {Number} [config.fillRadialGradientStartPointX]
     * @param {Number} [config.fillRadialGradientStartPointY]
     * @param {Object} [config.fillRadialGradientEndPoint] object with x and y component
     * @param {Number} [config.fillRadialGradientEndPointX] 
     * @param {Number} [config.fillRadialGradientEndPointY] 
     * @param {Number} [config.fillRadialGradientStartRadius]
     * @param {Number} [config.fillRadialGradientEndRadius]
     * @param {Array} [config.fillRadialGradientColorStops] array of color stops
     * @param {Boolean} [config.fillEnabled] flag which enables or disables the fill.  The default value is true
     * @param {String} [config.fillPriority] can be color, linear-gradient, radial-graident, or pattern.  The default value is color.  The fillPriority property makes it really easy to toggle between different fill types.  For example, if you want to toggle between a fill color style and a fill pattern style, simply set the fill property and the fillPattern properties, and then use setFillPriority('color') to render the shape with a color fill, or use setFillPriority('pattern') to render the shape with the pattern fill configuration
     * @param {String} [config.stroke] stroke color
     * @param {Number} [config.strokeWidth] stroke width
     * @param {Boolean} [config.strokeHitEnabled] flag which enables or disables stroke hit region.  The default is true
     * @param {Boolean} [config.perfectDrawEnabled] flag which enables or disables using buffer canvas.  The default is true
     * @param {Boolean} [config.shadowForStrokeEnabled] flag which enables or disables shasow for stroke.  The default is true
     * @param {Boolean} [config.strokeScaleEnabled] flag which enables or disables stroke scale.  The default is true
     * @param {Boolean} [config.strokeEnabled] flag which enables or disables the stroke.  The default value is true
     * @param {String} [config.lineJoin] can be miter, round, or bevel.  The default
     *  is miter
     * @param {String} [config.lineCap] can be butt, round, or sqare.  The default
     *  is butt
     * @param {String} [config.shadowColor]
     * @param {Number} [config.shadowBlur]
     * @param {Object} [config.shadowOffset] object with x and y component
     * @param {Number} [config.shadowOffsetX]
     * @param {Number} [config.shadowOffsetY]
     * @param {Number} [config.shadowOpacity] shadow opacity.  Can be any real number
     *  between 0 and 1
     * @param {Boolean} [config.shadowEnabled] flag which enables or disables the shadow.  The default value is true
     * @param {Array} [config.dash]
     * @param {Boolean} [config.dashEnabled] flag which enables or disables the dashArray.  The default value is true
     * @param {Number} [config.x]
     * @param {Number} [config.y]
     * @param {Number} [config.width]
     * @param {Number} [config.height]
     * @param {Boolean} [config.visible]
     * @param {Boolean} [config.listening] whether or not the node is listening for events
     * @param {String} [config.id] unique id
     * @param {String} [config.name] non-unique name
     * @param {Number} [config.opacity] determines node opacity.  Can be any number between 0 and 1
     * @param {Object} [config.scale] set scale
     * @param {Number} [config.scaleX] set scale x
     * @param {Number} [config.scaleY] set scale y
     * @param {Number} [config.rotation] rotation in degrees
     * @param {Object} [config.offset] offset from center point and rotation point
     * @param {Number} [config.offsetX] set offset x
     * @param {Number} [config.offsetY] set offset y
     * @param {Boolean} [config.draggable] makes the node draggable.  When stages are draggable, you can drag and drop
     *  the entire stage by dragging any portion of the stage
     * @param {Number} [config.dragDistance]
     * @param {Function} [config.dragBoundFunc]
     * @example
     * var path = new Konva.Path({
     *   x: 240,
     *   y: 40,
     *   data: 'M12.582,9.551C3.251,16.237,0.921,29.021,7.08,38.564l-2.36,1.689l4.893,2.262l4.893,2.262l-0.568-5.36l-0.567-5.359l-2.365,1.694c-4.657-7.375-2.83-17.185,4.352-22.33c7.451-5.338,17.817-3.625,23.156,3.824c5.337,7.449,3.625,17.813-3.821,23.152l2.857,3.988c9.617-6.893,11.827-20.277,4.935-29.896C35.591,4.87,22.204,2.658,12.582,9.551z',
     *   fill: 'green',
     *   scale: 2
     * });
     */
    Konva.Path = function (config) {
        this.___init(config);
    };

    Konva.Path.prototype = {
        ___init: function (config) {
            this.dataArray = [];
            var that = this;

            // call super constructor
            Konva.Shape.call(this, config);
            this.className = 'Path';

            this.dataArray = Konva.Path.parsePathData(this.getData());
            this.on('dataChange.konva', function () {
                that.dataArray = Konva.Path.parsePathData(this.getData());
            });

            this.sceneFunc(this._sceneFunc);
        },
        _sceneFunc: function(context) {
            var ca = this.dataArray,
                closedPath = false;

            // context position
            context.beginPath();
            for (var n = 0; n < ca.length; n++) {
                var c = ca[n].command;
                var p = ca[n].points;
                switch (c) {
                    case 'L':
                        context.lineTo(p[0], p[1]);
                        break;
                    case 'M':
                        context.moveTo(p[0], p[1]);
                        break;
                    case 'C':
                        context.bezierCurveTo(p[0], p[1], p[2], p[3], p[4], p[5]);
                        break;
                    case 'Q':
                        context.quadraticCurveTo(p[0], p[1], p[2], p[3]);
                        break;
                    case 'A':
                        var cx = p[0], cy = p[1], rx = p[2], ry = p[3], theta = p[4], dTheta = p[5], psi = p[6], fs = p[7];

                        var r = (rx > ry) ? rx : ry;
                        var scaleX = (rx > ry) ? 1 : rx / ry;
                        var scaleY = (rx > ry) ? ry / rx : 1;

                        context.translate(cx, cy);
                        context.rotate(psi);
                        context.scale(scaleX, scaleY);
                        context.arc(0, 0, r, theta, theta + dTheta, 1 - fs);
                        context.scale(1 / scaleX, 1 / scaleY);
                        context.rotate(-psi);
                        context.translate(-cx, -cy);

                        break;
                    case 'z':
                        context.closePath();
                        closedPath = true;
                        break;
                }
            }

            if (closedPath) {
                context.fillStrokeShape(this);
            }
            else {
                context.strokeShape(this);
            }
        },
        getSelfRect: function() {
            var points = [];
            this.dataArray.forEach(function(data) {
                points = points.concat(data.points);
            });
            var minX = points[0];
            var maxX = points[0];
            var minY = points[0];
            var maxY = points[0];
            var x, y;
            for (var i = 0; i < points.length / 2; i++) {
                x = points[i * 2]; y = points[i * 2 + 1];
                minX = Math.min(minX, x);
                maxX = Math.max(maxX, x);
                minY = Math.min(minY, y);
                maxY = Math.max(maxY, y);
            }
            return {
                x: Math.round(minX),
                y: Math.round(minY),
                width: Math.round(maxX - minX),
                height: Math.round(maxY - minY)
            };
        }
    };
    Konva.Util.extend(Konva.Path, Konva.Shape);

    Konva.Path.getLineLength = function(x1, y1, x2, y2) {
        return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    };
    Konva.Path.getPointOnLine = function(dist, P1x, P1y, P2x, P2y, fromX, fromY) {
        if(fromX === undefined) {
            fromX = P1x;
        }
        if(fromY === undefined) {
            fromY = P1y;
        }

        var m = (P2y - P1y) / ((P2x - P1x) + 0.00000001);
        var run = Math.sqrt(dist * dist / (1 + m * m));
        if(P2x < P1x) {
            run *= -1;
        }
        var rise = m * run;
        var pt;

        if (P2x === P1x) { // vertical line
            pt = {
                x: fromX,
                y: fromY + rise
            };
        } else if((fromY - P1y) / ((fromX - P1x) + 0.00000001) === m) {
            pt = {
                x: fromX + run,
                y: fromY + rise
            };
        }
        else {
            var ix, iy;

            var len = this.getLineLength(P1x, P1y, P2x, P2y);
            if(len < 0.00000001) {
                return undefined;
            }
            var u = (((fromX - P1x) * (P2x - P1x)) + ((fromY - P1y) * (P2y - P1y)));
            u = u / (len * len);
            ix = P1x + u * (P2x - P1x);
            iy = P1y + u * (P2y - P1y);

            var pRise = this.getLineLength(fromX, fromY, ix, iy);
            var pRun = Math.sqrt(dist * dist - pRise * pRise);
            run = Math.sqrt(pRun * pRun / (1 + m * m));
            if(P2x < P1x) {
                run *= -1;
            }
            rise = m * run;
            pt = {
                x: ix + run,
                y: iy + rise
            };
        }

        return pt;
    };

    Konva.Path.getPointOnCubicBezier = function(pct, P1x, P1y, P2x, P2y, P3x, P3y, P4x, P4y) {
        function CB1(t) {
            return t * t * t;
        }
        function CB2(t) {
            return 3 * t * t * (1 - t);
        }
        function CB3(t) {
            return 3 * t * (1 - t) * (1 - t);
        }
        function CB4(t) {
            return (1 - t) * (1 - t) * (1 - t);
        }
        var x = P4x * CB1(pct) + P3x * CB2(pct) + P2x * CB3(pct) + P1x * CB4(pct);
        var y = P4y * CB1(pct) + P3y * CB2(pct) + P2y * CB3(pct) + P1y * CB4(pct);

        return {
            x: x,
            y: y
        };
    };
    Konva.Path.getPointOnQuadraticBezier = function(pct, P1x, P1y, P2x, P2y, P3x, P3y) {
        function QB1(t) {
            return t * t;
        }
        function QB2(t) {
            return 2 * t * (1 - t);
        }
        function QB3(t) {
            return (1 - t) * (1 - t);
        }
        var x = P3x * QB1(pct) + P2x * QB2(pct) + P1x * QB3(pct);
        var y = P3y * QB1(pct) + P2y * QB2(pct) + P1y * QB3(pct);

        return {
            x: x,
            y: y
        };
    };
    Konva.Path.getPointOnEllipticalArc = function(cx, cy, rx, ry, theta, psi) {
        var cosPsi = Math.cos(psi), sinPsi = Math.sin(psi);
        var pt = {
            x: rx * Math.cos(theta),
            y: ry * Math.sin(theta)
        };
        return {
            x: cx + (pt.x * cosPsi - pt.y * sinPsi),
            y: cy + (pt.x * sinPsi + pt.y * cosPsi)
        };
    };
    /*
     * get parsed data array from the data
     *  string.  V, v, H, h, and l data are converted to
     *  L data for the purpose of high performance Path
     *  rendering
     */
    Konva.Path.parsePathData = function(data) {
        // Path Data Segment must begin with a moveTo
        //m (x y)+  Relative moveTo (subsequent points are treated as lineTo)
        //M (x y)+  Absolute moveTo (subsequent points are treated as lineTo)
        //l (x y)+  Relative lineTo
        //L (x y)+  Absolute LineTo
        //h (x)+    Relative horizontal lineTo
        //H (x)+    Absolute horizontal lineTo
        //v (y)+    Relative vertical lineTo
        //V (y)+    Absolute vertical lineTo
        //z (closepath)
        //Z (closepath)
        //c (x1 y1 x2 y2 x y)+ Relative Bezier curve
        //C (x1 y1 x2 y2 x y)+ Absolute Bezier curve
        //q (x1 y1 x y)+       Relative Quadratic Bezier
        //Q (x1 y1 x y)+       Absolute Quadratic Bezier
        //t (x y)+    Shorthand/Smooth Relative Quadratic Bezier
        //T (x y)+    Shorthand/Smooth Absolute Quadratic Bezier
        //s (x2 y2 x y)+       Shorthand/Smooth Relative Bezier curve
        //S (x2 y2 x y)+       Shorthand/Smooth Absolute Bezier curve
        //a (rx ry x-axis-rotation large-arc-flag sweep-flag x y)+     Relative Elliptical Arc
        //A (rx ry x-axis-rotation large-arc-flag sweep-flag x y)+  Absolute Elliptical Arc

        // return early if data is not defined
        if(!data) {
            return [];
        }

        // command string
        var cs = data;

        // command chars
        var cc = ['m', 'M', 'l', 'L', 'v', 'V', 'h', 'H', 'z', 'Z', 'c', 'C', 'q', 'Q', 't', 'T', 's', 'S', 'a', 'A'];
        // convert white spaces to commas
        cs = cs.replace(new RegExp(' ', 'g'), ',');
        // create pipes so that we can split the data
        for(var n = 0; n < cc.length; n++) {
            cs = cs.replace(new RegExp(cc[n], 'g'), '|' + cc[n]);
        }
        // create array
        var arr = cs.split('|');
        var ca = [];
        // init context point
        var cpx = 0;
        var cpy = 0;
        for( n = 1; n < arr.length; n++) {
            var str = arr[n];
            var c = str.charAt(0);
            str = str.slice(1);
            // remove ,- for consistency
            str = str.replace(new RegExp(',-', 'g'), '-');
            // add commas so that it's easy to split
            str = str.replace(new RegExp('-', 'g'), ',-');
            str = str.replace(new RegExp('e,-', 'g'), 'e-');
            var p = str.split(',');
            if(p.length > 0 && p[0] === '') {
                p.shift();
            }
            // convert strings to floats
            for(var i = 0; i < p.length; i++) {
                p[i] = parseFloat(p[i]);
            }
            while(p.length > 0) {
                if(isNaN(p[0])) {// case for a trailing comma before next command
                    break;
                }

                var cmd = null;
                var points = [];
                var startX = cpx, startY = cpy;
                // Move var from within the switch to up here (jshint)
                var prevCmd, ctlPtx, ctlPty;     // Ss, Tt
                var rx, ry, psi, fa, fs, x1, y1; // Aa


                // convert l, H, h, V, and v to L
                switch (c) {

                    // Note: Keep the lineTo's above the moveTo's in this switch
                    case 'l':
                        cpx += p.shift();
                        cpy += p.shift();
                        cmd = 'L';
                        points.push(cpx, cpy);
                        break;
                    case 'L':
                        cpx = p.shift();
                        cpy = p.shift();
                        points.push(cpx, cpy);
                        break;

                    // Note: lineTo handlers need to be above this point
                    case 'm':
                        var dx = p.shift();
                        var dy = p.shift();
                        cpx += dx;
                        cpy += dy;
                        cmd = 'M';
                        // After closing the path move the current position
                        // to the the first point of the path (if any).
                        if(ca.length > 2 && ca[ca.length - 1].command === 'z'){
                            for(var idx = ca.length - 2; idx >= 0; idx--){
                                if(ca[idx].command === 'M'){
                                    cpx = ca[idx].points[0] + dx;
                                    cpy = ca[idx].points[1] + dy;
                                    break;
                                }
                            }
                        }
                        points.push(cpx, cpy);
                        c = 'l';
                        // subsequent points are treated as relative lineTo
                        break;
                    case 'M':
                        cpx = p.shift();
                        cpy = p.shift();
                        cmd = 'M';
                        points.push(cpx, cpy);
                        c = 'L';
                        // subsequent points are treated as absolute lineTo
                        break;

                    case 'h':
                        cpx += p.shift();
                        cmd = 'L';
                        points.push(cpx, cpy);
                        break;
                    case 'H':
                        cpx = p.shift();
                        cmd = 'L';
                        points.push(cpx, cpy);
                        break;
                    case 'v':
                        cpy += p.shift();
                        cmd = 'L';
                        points.push(cpx, cpy);
                        break;
                    case 'V':
                        cpy = p.shift();
                        cmd = 'L';
                        points.push(cpx, cpy);
                        break;
                    case 'C':
                        points.push(p.shift(), p.shift(), p.shift(), p.shift());
                        cpx = p.shift();
                        cpy = p.shift();
                        points.push(cpx, cpy);
                        break;
                    case 'c':
                        points.push(cpx + p.shift(), cpy + p.shift(), cpx + p.shift(), cpy + p.shift());
                        cpx += p.shift();
                        cpy += p.shift();
                        cmd = 'C';
                        points.push(cpx, cpy);
                        break;
                    case 'S':
                        ctlPtx = cpx;
                        ctlPty = cpy;
                        prevCmd = ca[ca.length - 1];
                        if(prevCmd.command === 'C') {
                            ctlPtx = cpx + (cpx - prevCmd.points[2]);
                            ctlPty = cpy + (cpy - prevCmd.points[3]);
                        }
                        points.push(ctlPtx, ctlPty, p.shift(), p.shift());
                        cpx = p.shift();
                        cpy = p.shift();
                        cmd = 'C';
                        points.push(cpx, cpy);
                        break;
                    case 's':
                        ctlPtx = cpx;
                        ctlPty = cpy;
                        prevCmd = ca[ca.length - 1];
                        if(prevCmd.command === 'C') {
                            ctlPtx = cpx + (cpx - prevCmd.points[2]);
                            ctlPty = cpy + (cpy - prevCmd.points[3]);
                        }
                        points.push(ctlPtx, ctlPty, cpx + p.shift(), cpy + p.shift());
                        cpx += p.shift();
                        cpy += p.shift();
                        cmd = 'C';
                        points.push(cpx, cpy);
                        break;
                    case 'Q':
                        points.push(p.shift(), p.shift());
                        cpx = p.shift();
                        cpy = p.shift();
                        points.push(cpx, cpy);
                        break;
                    case 'q':
                        points.push(cpx + p.shift(), cpy + p.shift());
                        cpx += p.shift();
                        cpy += p.shift();
                        cmd = 'Q';
                        points.push(cpx, cpy);
                        break;
                    case 'T':
                        ctlPtx = cpx;
                        ctlPty = cpy;
                        prevCmd = ca[ca.length - 1];
                        if(prevCmd.command === 'Q') {
                            ctlPtx = cpx + (cpx - prevCmd.points[0]);
                            ctlPty = cpy + (cpy - prevCmd.points[1]);
                        }
                        cpx = p.shift();
                        cpy = p.shift();
                        cmd = 'Q';
                        points.push(ctlPtx, ctlPty, cpx, cpy);
                        break;
                    case 't':
                        ctlPtx = cpx;
                        ctlPty = cpy;
                        prevCmd = ca[ca.length - 1];
                        if(prevCmd.command === 'Q') {
                            ctlPtx = cpx + (cpx - prevCmd.points[0]);
                            ctlPty = cpy + (cpy - prevCmd.points[1]);
                        }
                        cpx += p.shift();
                        cpy += p.shift();
                        cmd = 'Q';
                        points.push(ctlPtx, ctlPty, cpx, cpy);
                        break;
                    case 'A':
                        rx = p.shift();
                        ry = p.shift();
                        psi = p.shift();
                        fa = p.shift();
                        fs = p.shift();
                        x1 = cpx;
                        y1 = cpy;
                        cpx = p.shift();
                        cpy = p.shift();
                        cmd = 'A';
                        points = this.convertEndpointToCenterParameterization(x1, y1, cpx, cpy, fa, fs, rx, ry, psi);
                        break;
                    case 'a':
                        rx = p.shift();
                        ry = p.shift();
                        psi = p.shift();
                        fa = p.shift();
                        fs = p.shift();
                        x1 = cpx;
                        y1 = cpy; cpx += p.shift();
                        cpy += p.shift();
                        cmd = 'A';
                        points = this.convertEndpointToCenterParameterization(x1, y1, cpx, cpy, fa, fs, rx, ry, psi);
                        break;
                }

                ca.push({
                    command: cmd || c,
                    points: points,
                    start: {
                        x: startX,
                        y: startY
                    },
                    pathLength: this.calcLength(startX, startY, cmd || c, points)
                });
            }

            if(c === 'z' || c === 'Z') {
                ca.push({
                    command: 'z',
                    points: [],
                    start: undefined,
                    pathLength: 0
                });
            }
        }

        return ca;
    };
    Konva.Path.calcLength = function(x, y, cmd, points) {
        var len, p1, p2, t;
        var path = Konva.Path;

        switch (cmd) {
            case 'L':
                return path.getLineLength(x, y, points[0], points[1]);
            case 'C':
                // Approximates by breaking curve into 100 line segments
                len = 0.0;
                p1 = path.getPointOnCubicBezier(0, x, y, points[0], points[1], points[2], points[3], points[4], points[5]);
                for( t = 0.01; t <= 1; t += 0.01) {
                    p2 = path.getPointOnCubicBezier(t, x, y, points[0], points[1], points[2], points[3], points[4], points[5]);
                    len += path.getLineLength(p1.x, p1.y, p2.x, p2.y);
                    p1 = p2;
                }
                return len;
            case 'Q':
                // Approximates by breaking curve into 100 line segments
                len = 0.0;
                p1 = path.getPointOnQuadraticBezier(0, x, y, points[0], points[1], points[2], points[3]);
                for( t = 0.01; t <= 1; t += 0.01) {
                    p2 = path.getPointOnQuadraticBezier(t, x, y, points[0], points[1], points[2], points[3]);
                    len += path.getLineLength(p1.x, p1.y, p2.x, p2.y);
                    p1 = p2;
                }
                return len;
            case 'A':
                // Approximates by breaking curve into line segments
                len = 0.0;
                var start = points[4];
                // 4 = theta
                var dTheta = points[5];
                // 5 = dTheta
                var end = points[4] + dTheta;
                var inc = Math.PI / 180.0;
                // 1 degree resolution
                if(Math.abs(start - end) < inc) {
                    inc = Math.abs(start - end);
                }
                // Note: for purpose of calculating arc length, not going to worry about rotating X-axis by angle psi
                p1 = path.getPointOnEllipticalArc(points[0], points[1], points[2], points[3], start, 0);
                if(dTheta < 0) {// clockwise
                    for( t = start - inc; t > end; t -= inc) {
                        p2 = path.getPointOnEllipticalArc(points[0], points[1], points[2], points[3], t, 0);
                        len += path.getLineLength(p1.x, p1.y, p2.x, p2.y);
                        p1 = p2;
                    }
                }
                else {// counter-clockwise
                    for( t = start + inc; t < end; t += inc) {
                        p2 = path.getPointOnEllipticalArc(points[0], points[1], points[2], points[3], t, 0);
                        len += path.getLineLength(p1.x, p1.y, p2.x, p2.y);
                        p1 = p2;
                    }
                }
                p2 = path.getPointOnEllipticalArc(points[0], points[1], points[2], points[3], end, 0);
                len += path.getLineLength(p1.x, p1.y, p2.x, p2.y);

                return len;
        }

        return 0;
    };
    Konva.Path.convertEndpointToCenterParameterization = function(x1, y1, x2, y2, fa, fs, rx, ry, psiDeg) {
        // Derived from: http://www.w3.org/TR/SVG/implnote.html#ArcImplementationNotes
        var psi = psiDeg * (Math.PI / 180.0);
        var xp = Math.cos(psi) * (x1 - x2) / 2.0 + Math.sin(psi) * (y1 - y2) / 2.0;
        var yp = -1 * Math.sin(psi) * (x1 - x2) / 2.0 + Math.cos(psi) * (y1 - y2) / 2.0;

        var lambda = (xp * xp) / (rx * rx) + (yp * yp) / (ry * ry);

        if(lambda > 1) {
            rx *= Math.sqrt(lambda);
            ry *= Math.sqrt(lambda);
        }

        var f = Math.sqrt((((rx * rx) * (ry * ry)) - ((rx * rx) * (yp * yp)) - ((ry * ry) * (xp * xp))) / ((rx * rx) * (yp * yp) + (ry * ry) * (xp * xp)));

        if(fa === fs) {
            f *= -1;
        }
        if(isNaN(f)) {
            f = 0;
        }

        var cxp = f * rx * yp / ry;
        var cyp = f * -ry * xp / rx;

        var cx = (x1 + x2) / 2.0 + Math.cos(psi) * cxp - Math.sin(psi) * cyp;
        var cy = (y1 + y2) / 2.0 + Math.sin(psi) * cxp + Math.cos(psi) * cyp;

        var vMag = function(v) {
            return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
        };
        var vRatio = function(u, v) {
            return (u[0] * v[0] + u[1] * v[1]) / (vMag(u) * vMag(v));
        };
        var vAngle = function(u, v) {
            return (u[0] * v[1] < u[1] * v[0] ? -1 : 1) * Math.acos(vRatio(u, v));
        };
        var theta = vAngle([1, 0], [(xp - cxp) / rx, (yp - cyp) / ry]);
        var u = [(xp - cxp) / rx, (yp - cyp) / ry];
        var v = [(-1 * xp - cxp) / rx, (-1 * yp - cyp) / ry];
        var dTheta = vAngle(u, v);

        if(vRatio(u, v) <= -1) {
            dTheta = Math.PI;
        }
        if(vRatio(u, v) >= 1) {
            dTheta = 0;
        }
        if(fs === 0 && dTheta > 0) {
            dTheta = dTheta - 2 * Math.PI;
        }
        if(fs === 1 && dTheta < 0) {
            dTheta = dTheta + 2 * Math.PI;
        }
        return [cx, cy, rx, ry, theta, dTheta, psi, fs];
    };
    // add getters setters
    Konva.Factory.addGetterSetter(Konva.Path, 'data');

    /**
     * set SVG path data string.  This method
     *  also automatically parses the data string
     *  into a data array.  Currently supported SVG data:
     *  M, m, L, l, H, h, V, v, Q, q, T, t, C, c, S, s, A, a, Z, z
     * @name setData
     * @method
     * @memberof Konva.Path.prototype
     * @param {String} SVG path command string
     */

    /**
     * get SVG path data string
     * @name getData
     * @method
     * @memberof Konva.Path.prototype
     */

    Konva.Collection.mapMethods(Konva.Path);
})();

(function() {
    'use strict';
    var EMPTY_STRING = '',
        //CALIBRI = 'Calibri',
        NORMAL = 'normal';

    /**
     * Path constructor.
     * @author Jason Follas
     * @constructor
     * @memberof Konva
     * @augments Konva.Shape
     * @param {Object} config
     * @param {String} [config.fontFamily] default is Calibri
     * @param {Number} [config.fontSize] default is 12
     * @param {String} [config.fontStyle] can be normal, bold, or italic.  Default is normal
     * @param {String} [config.fontVariant] can be normal or small-caps.  Default is normal
     * @param {String} config.text
     * @param {String} config.data SVG data string
     * @param {String} [config.fill] fill color
     * @param {Image} [config.fillPatternImage] fill pattern image
     * @param {Number} [config.fillPatternX]
     * @param {Number} [config.fillPatternY]
     * @param {Object} [config.fillPatternOffset] object with x and y component
     * @param {Number} [config.fillPatternOffsetX] 
     * @param {Number} [config.fillPatternOffsetY] 
     * @param {Object} [config.fillPatternScale] object with x and y component
     * @param {Number} [config.fillPatternScaleX]
     * @param {Number} [config.fillPatternScaleY]
     * @param {Number} [config.fillPatternRotation]
     * @param {String} [config.fillPatternRepeat] can be "repeat", "repeat-x", "repeat-y", or "no-repeat".  The default is "no-repeat"
     * @param {Object} [config.fillLinearGradientStartPoint] object with x and y component
     * @param {Number} [config.fillLinearGradientStartPointX]
     * @param {Number} [config.fillLinearGradientStartPointY]
     * @param {Object} [config.fillLinearGradientEndPoint] object with x and y component
     * @param {Number} [config.fillLinearGradientEndPointX]
     * @param {Number} [config.fillLinearGradientEndPointY]
     * @param {Array} [config.fillLinearGradientColorStops] array of color stops
     * @param {Object} [config.fillRadialGradientStartPoint] object with x and y component
     * @param {Number} [config.fillRadialGradientStartPointX]
     * @param {Number} [config.fillRadialGradientStartPointY]
     * @param {Object} [config.fillRadialGradientEndPoint] object with x and y component
     * @param {Number} [config.fillRadialGradientEndPointX] 
     * @param {Number} [config.fillRadialGradientEndPointY] 
     * @param {Number} [config.fillRadialGradientStartRadius]
     * @param {Number} [config.fillRadialGradientEndRadius]
     * @param {Array} [config.fillRadialGradientColorStops] array of color stops
     * @param {Boolean} [config.fillEnabled] flag which enables or disables the fill.  The default value is true
     * @param {String} [config.fillPriority] can be color, linear-gradient, radial-graident, or pattern.  The default value is color.  The fillPriority property makes it really easy to toggle between different fill types.  For example, if you want to toggle between a fill color style and a fill pattern style, simply set the fill property and the fillPattern properties, and then use setFillPriority('color') to render the shape with a color fill, or use setFillPriority('pattern') to render the shape with the pattern fill configuration
     * @param {String} [config.stroke] stroke color
     * @param {Number} [config.strokeWidth] stroke width
     * @param {Boolean} [config.strokeHitEnabled] flag which enables or disables stroke hit region.  The default is true
     * @param {Boolean} [config.perfectDrawEnabled] flag which enables or disables using buffer canvas.  The default is true
     * @param {Boolean} [config.shadowForStrokeEnabled] flag which enables or disables shasow for stroke.  The default is true
     * @param {Boolean} [config.strokeScaleEnabled] flag which enables or disables stroke scale.  The default is true
     * @param {Boolean} [config.strokeEnabled] flag which enables or disables the stroke.  The default value is true
     * @param {String} [config.lineJoin] can be miter, round, or bevel.  The default
     *  is miter
     * @param {String} [config.lineCap] can be butt, round, or sqare.  The default
     *  is butt
     * @param {String} [config.shadowColor]
     * @param {Number} [config.shadowBlur]
     * @param {Object} [config.shadowOffset] object with x and y component
     * @param {Number} [config.shadowOffsetX]
     * @param {Number} [config.shadowOffsetY]
     * @param {Number} [config.shadowOpacity] shadow opacity.  Can be any real number
     *  between 0 and 1
     * @param {Boolean} [config.shadowEnabled] flag which enables or disables the shadow.  The default value is true
     * @param {Array} [config.dash]
     * @param {Boolean} [config.dashEnabled] flag which enables or disables the dashArray.  The default value is true
     * @param {Number} [config.x]
     * @param {Number} [config.y]
     * @param {Number} [config.width]
     * @param {Number} [config.height]
     * @param {Boolean} [config.visible]
     * @param {Boolean} [config.listening] whether or not the node is listening for events
     * @param {String} [config.id] unique id
     * @param {String} [config.name] non-unique name
     * @param {Number} [config.opacity] determines node opacity.  Can be any number between 0 and 1
     * @param {Object} [config.scale] set scale
     * @param {Number} [config.scaleX] set scale x
     * @param {Number} [config.scaleY] set scale y
     * @param {Number} [config.rotation] rotation in degrees
     * @param {Object} [config.offset] offset from center point and rotation point
     * @param {Number} [config.offsetX] set offset x
     * @param {Number} [config.offsetY] set offset y
     * @param {Boolean} [config.draggable] makes the node draggable.  When stages are draggable, you can drag and drop
     *  the entire stage by dragging any portion of the stage
     * @param {Number} [config.dragDistance]
     * @param {Function} [config.dragBoundFunc]
     * @example
     * var textpath = new Konva.TextPath({
     *   x: 100,
     *   y: 50,
     *   fill: '#333',
     *   fontSize: '24',
     *   fontFamily: 'Arial',
     *   text: 'All the world\'s a stage, and all the men and women merely players.',
     *   data: 'M10,10 C0,0 10,150 100,100 S300,150 400,50'
     * });
     */
    Konva.TextPath = function(config) {
        this.___init(config);
    };

    function _fillFunc(context) {
        context.fillText(this.partialText, 0, 0);
    }
    function _strokeFunc(context) {
        context.strokeText(this.partialText, 0, 0);
    }

    Konva.TextPath.prototype = {
        ___init: function(config) {
            var that = this;
            this.dummyCanvas = Konva.Util.createCanvasElement();
            this.dataArray = [];

            // call super constructor
            Konva.Shape.call(this, config);

            // overrides
            // TODO: shouldn't this be on the prototype?
            this._fillFunc = _fillFunc;
            this._strokeFunc = _strokeFunc;
            this._fillFuncHit = _fillFunc;
            this._strokeFuncHit = _strokeFunc;

            this.className = 'TextPath';

            this.dataArray = Konva.Path.parsePathData(this.attrs.data);
            this.on('dataChange.konva', function() {
                that.dataArray = Konva.Path.parsePathData(this.attrs.data);
            });

            // update text data for certain attr changes
            this.on('textChange.konva textStroke.konva textStrokeWidth.konva', that._setTextData);
            that._setTextData();
            this.sceneFunc(this._sceneFunc);
        },
        _sceneFunc: function(context) {
            context.setAttr('font', this._getContextFont());
            context.setAttr('textBaseline', 'middle');
            context.setAttr('textAlign', 'left');
            context.save();

            var glyphInfo = this.glyphInfo;
            for(var i = 0; i < glyphInfo.length; i++) {
                context.save();

                var p0 = glyphInfo[i].p0;

                context.translate(p0.x, p0.y);
                context.rotate(glyphInfo[i].rotation);
                this.partialText = glyphInfo[i].text;

                context.fillStrokeShape(this);
                context.restore();

                //// To assist with debugging visually, uncomment following
                // context.beginPath();
                // if (i % 2)
                // context.strokeStyle = 'cyan';
                // else
                // context.strokeStyle = 'green';
                // var p1 = glyphInfo[i].p1;
                // context.moveTo(p0.x, p0.y);
                // context.lineTo(p1.x, p1.y);
                // context.stroke();
            }
            context.restore();
        },
        /**
         * get text width in pixels
         * @method
         * @memberof Konva.TextPath.prototype
         */
        getTextWidth: function() {
            return this.textWidth;
        },
        /**
         * get text height in pixels
         * @method
         * @memberof Konva.TextPath.prototype
         */
        getTextHeight: function() {
            return this.textHeight;
        },
        /**
         * set text
         * @method
         * @memberof Konva.TextPath.prototype
         * @param {String} text
         */
        setText: function(text) {
            Konva.Text.prototype.setText.call(this, text);
        },
        _getTextSize: function(text) {
            var dummyCanvas = this.dummyCanvas;
            var _context = dummyCanvas.getContext('2d');

            _context.save();

            _context.font = this._getContextFont();
            var metrics = _context.measureText(text);

            _context.restore();

            return {
                width: metrics.width,
                height: parseInt(this.attrs.fontSize, 10)
            };
        },
        _setTextData: function() {

            var that = this;
            var size = this._getTextSize(this.attrs.text);
            this.textWidth = size.width;
            this.textHeight = size.height;

            this.glyphInfo = [];

            var charArr = this.attrs.text.split('');

            var p0, p1, pathCmd;

            var pIndex = -1;
            var currentT = 0;

            var getNextPathSegment = function() {
                currentT = 0;
                var pathData = that.dataArray;

                for(var j = pIndex + 1; j < pathData.length; j++) {
                    if(pathData[j].pathLength > 0) {
                        pIndex = j;

                        return pathData[j];
                    }
                    else if(pathData[j].command === 'M') {
                        p0 = {
                            x: pathData[j].points[0],
                            y: pathData[j].points[1]
                        };
                    }
                }

                return {};
            };
            var findSegmentToFitCharacter = function(c) {

                var glyphWidth = that._getTextSize(c).width;

                var currLen = 0;
                var attempts = 0;

                p1 = undefined;
                while(Math.abs(glyphWidth - currLen) / glyphWidth > 0.01 && attempts < 25) {
                    attempts++;
                    var cumulativePathLength = currLen;
                    while(pathCmd === undefined) {
                        pathCmd = getNextPathSegment();

                        if(pathCmd && cumulativePathLength + pathCmd.pathLength < glyphWidth) {
                            cumulativePathLength += pathCmd.pathLength;
                            pathCmd = undefined;
                        }
                    }

                    if(pathCmd === {} || p0 === undefined) {
                        return undefined;
                    }

                    var needNewSegment = false;

                    switch (pathCmd.command) {
                        case 'L':
                            if(Konva.Path.getLineLength(p0.x, p0.y, pathCmd.points[0], pathCmd.points[1]) > glyphWidth) {
                                p1 = Konva.Path.getPointOnLine(glyphWidth, p0.x, p0.y, pathCmd.points[0], pathCmd.points[1], p0.x, p0.y);
                            }
                            else {
                                pathCmd = undefined;
                            }
                            break;
                        case 'A':

                            var start = pathCmd.points[4];
                            // 4 = theta
                            var dTheta = pathCmd.points[5];
                            // 5 = dTheta
                            var end = pathCmd.points[4] + dTheta;

                            if(currentT === 0){
                                currentT = start + 0.00000001;
                            }
                            // Just in case start is 0
                            else if(glyphWidth > currLen) {
                                currentT += (Math.PI / 180.0) * dTheta / Math.abs(dTheta);
                            }
                            else {
                                currentT -= Math.PI / 360.0 * dTheta / Math.abs(dTheta);
                            }

                            // Credit for bug fix: @therth https://github.com/ericdrowell/KonvaJS/issues/249
                            // Old code failed to render text along arc of this path: "M 50 50 a 150 50 0 0 1 250 50 l 50 0"
                            if(dTheta < 0 && currentT < end || dTheta >= 0 && currentT > end) {
                                currentT = end;
                                needNewSegment = true;
                            }
                            p1 = Konva.Path.getPointOnEllipticalArc(pathCmd.points[0], pathCmd.points[1], pathCmd.points[2], pathCmd.points[3], currentT, pathCmd.points[6]);
                            break;
                        case 'C':
                            if(currentT === 0) {
                                if(glyphWidth > pathCmd.pathLength) {
                                    currentT = 0.00000001;
                                }
                                else {
                                    currentT = glyphWidth / pathCmd.pathLength;
                                }
                            }
                            else if(glyphWidth > currLen) {
                                currentT += (glyphWidth - currLen) / pathCmd.pathLength;
                            }
                            else {
                                currentT -= (currLen - glyphWidth) / pathCmd.pathLength;
                            }

                            if(currentT > 1.0) {
                                currentT = 1.0;
                                needNewSegment = true;
                            }
                            p1 = Konva.Path.getPointOnCubicBezier(currentT, pathCmd.start.x, pathCmd.start.y, pathCmd.points[0], pathCmd.points[1], pathCmd.points[2], pathCmd.points[3], pathCmd.points[4], pathCmd.points[5]);
                            break;
                        case 'Q':
                            if(currentT === 0) {
                                currentT = glyphWidth / pathCmd.pathLength;
                            }
                            else if(glyphWidth > currLen) {
                                currentT += (glyphWidth - currLen) / pathCmd.pathLength;
                            }
                            else {
                                currentT -= (currLen - glyphWidth) / pathCmd.pathLength;
                            }

                            if(currentT > 1.0) {
                                currentT = 1.0;
                                needNewSegment = true;
                            }
                            p1 = Konva.Path.getPointOnQuadraticBezier(currentT, pathCmd.start.x, pathCmd.start.y, pathCmd.points[0], pathCmd.points[1], pathCmd.points[2], pathCmd.points[3]);
                            break;

                    }

                    if(p1 !== undefined) {
                        currLen = Konva.Path.getLineLength(p0.x, p0.y, p1.x, p1.y);
                    }

                    if(needNewSegment) {
                        needNewSegment = false;
                        pathCmd = undefined;
                    }
                }
            };
            for(var i = 0; i < charArr.length; i++) {

                // Find p1 such that line segment between p0 and p1 is approx. width of glyph
                findSegmentToFitCharacter(charArr[i]);

                if(p0 === undefined || p1 === undefined) {
                    break;
                }

                var width = Konva.Path.getLineLength(p0.x, p0.y, p1.x, p1.y);

                // Note: Since glyphs are rendered one at a time, any kerning pair data built into the font will not be used.
                // Can foresee having a rough pair table built in that the developer can override as needed.

                var kern = 0;
                // placeholder for future implementation

                var midpoint = Konva.Path.getPointOnLine(kern + width / 2.0, p0.x, p0.y, p1.x, p1.y);

                var rotation = Math.atan2((p1.y - p0.y), (p1.x - p0.x));
                this.glyphInfo.push({
                    transposeX: midpoint.x,
                    transposeY: midpoint.y,
                    text: charArr[i],
                    rotation: rotation,
                    p0: p0,
                    p1: p1
                });
                p0 = p1;
            }
        },
        getSelfRect: function() {
            var points = [];
            var fontSize = this.fontSize();

            this.glyphInfo.forEach(function(info) {
                points.push(info.p0.x);
                points.push(info.p0.y);
                points.push(info.p1.x);
                points.push(info.p1.y);
            });
            var minX = points[0];
            var maxX = points[0];
            var minY = points[0];
            var maxY = points[0];
            var x, y;
            for (var i = 0; i < points.length / 2; i++) {
                x = points[i * 2]; y = points[i * 2 + 1];
                minX = Math.min(minX, x);
                maxX = Math.max(maxX, x);
                minY = Math.min(minY, y);
                maxY = Math.max(maxY, y);
            }
            return {
                x: Math.round(minX) - fontSize,
                y: Math.round(minY) - fontSize,
                width: Math.round(maxX - minX) + fontSize * 2,
                height: Math.round(maxY - minY) + fontSize * 2
            };
        }
    };

    // map TextPath methods to Text
    Konva.TextPath.prototype._getContextFont = Konva.Text.prototype._getContextFont;

    Konva.Util.extend(Konva.TextPath, Konva.Shape);

    // add setters and getters
    Konva.Factory.addGetterSetter(Konva.TextPath, 'fontFamily', 'Arial');

    /**
     * set font family
     * @name setFontFamily
     * @method
     * @memberof Konva.TextPath.prototype
     * @param {String} fontFamily
     */

     /**
     * get font family
     * @name getFontFamily
     * @method
     * @memberof Konva.TextPath.prototype
     */

    Konva.Factory.addGetterSetter(Konva.TextPath, 'fontSize', 12);

    /**
     * set font size
     * @name setFontSize
     * @method
     * @memberof Konva.TextPath.prototype
     * @param {int} fontSize
     */

     /**
     * get font size
     * @name getFontSize
     * @method
     * @memberof Konva.TextPath.prototype
     */

    Konva.Factory.addGetterSetter(Konva.TextPath, 'fontStyle', NORMAL);

    /**
     * set font style.  Can be 'normal', 'italic', or 'bold'.  'normal' is the default.
     * @name setFontStyle
     * @method
     * @memberof Konva.TextPath.prototype
     * @param {String} fontStyle
     */

     /**
     * get font style
     * @name getFontStyle
     * @method
     * @memberof Konva.TextPath.prototype
     */

    Konva.Factory.addGetterSetter(Konva.TextPath, 'fontVariant', NORMAL);

    /**
     * set font variant.  Can be 'normal' or 'small-caps'.  'normal' is the default.
     * @name setFontVariant
     * @method
     * @memberof Konva.TextPath.prototype
     * @param {String} fontVariant
     */

    /**
     * @get font variant
     * @name getFontVariant
     * @method
     * @memberof Konva.TextPath.prototype
     */

    Konva.Factory.addGetter(Konva.TextPath, 'text', EMPTY_STRING);

    /**
     * get text
     * @name getText
     * @method
     * @memberof Konva.TextPath.prototype
     */

    Konva.Collection.mapMethods(Konva.TextPath);
})();

(function() {
    'use strict';
    /**
     * RegularPolygon constructor.&nbsp; Examples include triangles, squares, pentagons, hexagons, etc.
     * @constructor
     * @memberof Konva
     * @augments Konva.Shape
     * @param {Object} config
     * @param {Number} config.sides
     * @param {Number} config.radius
     * @param {String} [config.fill] fill color
     * @param {Image} [config.fillPatternImage] fill pattern image
     * @param {Number} [config.fillPatternX]
     * @param {Number} [config.fillPatternY]
     * @param {Object} [config.fillPatternOffset] object with x and y component
     * @param {Number} [config.fillPatternOffsetX] 
     * @param {Number} [config.fillPatternOffsetY] 
     * @param {Object} [config.fillPatternScale] object with x and y component
     * @param {Number} [config.fillPatternScaleX]
     * @param {Number} [config.fillPatternScaleY]
     * @param {Number} [config.fillPatternRotation]
     * @param {String} [config.fillPatternRepeat] can be "repeat", "repeat-x", "repeat-y", or "no-repeat".  The default is "no-repeat"
     * @param {Object} [config.fillLinearGradientStartPoint] object with x and y component
     * @param {Number} [config.fillLinearGradientStartPointX]
     * @param {Number} [config.fillLinearGradientStartPointY]
     * @param {Object} [config.fillLinearGradientEndPoint] object with x and y component
     * @param {Number} [config.fillLinearGradientEndPointX]
     * @param {Number} [config.fillLinearGradientEndPointY]
     * @param {Array} [config.fillLinearGradientColorStops] array of color stops
     * @param {Object} [config.fillRadialGradientStartPoint] object with x and y component
     * @param {Number} [config.fillRadialGradientStartPointX]
     * @param {Number} [config.fillRadialGradientStartPointY]
     * @param {Object} [config.fillRadialGradientEndPoint] object with x and y component
     * @param {Number} [config.fillRadialGradientEndPointX] 
     * @param {Number} [config.fillRadialGradientEndPointY] 
     * @param {Number} [config.fillRadialGradientStartRadius]
     * @param {Number} [config.fillRadialGradientEndRadius]
     * @param {Array} [config.fillRadialGradientColorStops] array of color stops
     * @param {Boolean} [config.fillEnabled] flag which enables or disables the fill.  The default value is true
     * @param {String} [config.fillPriority] can be color, linear-gradient, radial-graident, or pattern.  The default value is color.  The fillPriority property makes it really easy to toggle between different fill types.  For example, if you want to toggle between a fill color style and a fill pattern style, simply set the fill property and the fillPattern properties, and then use setFillPriority('color') to render the shape with a color fill, or use setFillPriority('pattern') to render the shape with the pattern fill configuration
     * @param {String} [config.stroke] stroke color
     * @param {Number} [config.strokeWidth] stroke width
     * @param {Boolean} [config.strokeHitEnabled] flag which enables or disables stroke hit region.  The default is true
     * @param {Boolean} [config.perfectDrawEnabled] flag which enables or disables using buffer canvas.  The default is true
     * @param {Boolean} [config.shadowForStrokeEnabled] flag which enables or disables shasow for stroke.  The default is true
     * @param {Boolean} [config.strokeScaleEnabled] flag which enables or disables stroke scale.  The default is true
     * @param {Boolean} [config.strokeEnabled] flag which enables or disables the stroke.  The default value is true
     * @param {String} [config.lineJoin] can be miter, round, or bevel.  The default
     *  is miter
     * @param {String} [config.lineCap] can be butt, round, or sqare.  The default
     *  is butt
     * @param {String} [config.shadowColor]
     * @param {Number} [config.shadowBlur]
     * @param {Object} [config.shadowOffset] object with x and y component
     * @param {Number} [config.shadowOffsetX]
     * @param {Number} [config.shadowOffsetY]
     * @param {Number} [config.shadowOpacity] shadow opacity.  Can be any real number
     *  between 0 and 1
     * @param {Boolean} [config.shadowEnabled] flag which enables or disables the shadow.  The default value is true
     * @param {Array} [config.dash]
     * @param {Boolean} [config.dashEnabled] flag which enables or disables the dashArray.  The default value is true
     * @param {Number} [config.x]
     * @param {Number} [config.y]
     * @param {Number} [config.width]
     * @param {Number} [config.height]
     * @param {Boolean} [config.visible]
     * @param {Boolean} [config.listening] whether or not the node is listening for events
     * @param {String} [config.id] unique id
     * @param {String} [config.name] non-unique name
     * @param {Number} [config.opacity] determines node opacity.  Can be any number between 0 and 1
     * @param {Object} [config.scale] set scale
     * @param {Number} [config.scaleX] set scale x
     * @param {Number} [config.scaleY] set scale y
     * @param {Number} [config.rotation] rotation in degrees
     * @param {Object} [config.offset] offset from center point and rotation point
     * @param {Number} [config.offsetX] set offset x
     * @param {Number} [config.offsetY] set offset y
     * @param {Boolean} [config.draggable] makes the node draggable.  When stages are draggable, you can drag and drop
     *  the entire stage by dragging any portion of the stage
     * @param {Number} [config.dragDistance]
     * @param {Function} [config.dragBoundFunc]
     * @example
     * var hexagon = new Konva.RegularPolygon({
     *   x: 100,
     *   y: 200,
     *   sides: 6,
     *   radius: 70,
     *   fill: 'red',
     *   stroke: 'black',
     *   strokeWidth: 4
     * });
     */
    Konva.RegularPolygon = function(config) {
        this.___init(config);
    };

    Konva.RegularPolygon.prototype = {
        _centroid: true,
        ___init: function(config) {
            // call super constructor
            Konva.Shape.call(this, config);
            this.className = 'RegularPolygon';
            this.sceneFunc(this._sceneFunc);
        },
        _sceneFunc: function(context) {
            var sides = this.attrs.sides,
                radius = this.attrs.radius,
                n, x, y;

            context.beginPath();
            context.moveTo(0, 0 - radius);

            for(n = 1; n < sides; n++) {
                x = radius * Math.sin(n * 2 * Math.PI / sides);
                y = -1 * radius * Math.cos(n * 2 * Math.PI / sides);
                context.lineTo(x, y);
            }
            context.closePath();
            context.fillStrokeShape(this);
        },
        getWidth: function() {
            return this.getRadius() * 2;
        },
        // implements Shape.prototype.getHeight()
        getHeight: function() {
            return this.getRadius() * 2;
        },
        // implements Shape.prototype.setWidth()
        setWidth: function(width) {
            Konva.Node.prototype.setWidth.call(this, width);
            if (this.radius() !== width / 2) {
                this.setRadius(width / 2);
            }
        },
        // implements Shape.prototype.setHeight()
        setHeight: function(height) {
            Konva.Node.prototype.setHeight.call(this, height);
            if (this.radius() !== height / 2) {
                this.setRadius(height / 2);
            }
        }
    };
    Konva.Util.extend(Konva.RegularPolygon, Konva.Shape);

    // add getters setters
    Konva.Factory.addGetterSetter(Konva.RegularPolygon, 'radius', 0);

    /**
     * set radius
     * @name setRadius
     * @method
     * @memberof Konva.RegularPolygon.prototype
     * @param {Number} radius
     */

     /**
     * get radius
     * @name getRadius
     * @method
     * @memberof Konva.RegularPolygon.prototype
     */

    Konva.Factory.addGetterSetter(Konva.RegularPolygon, 'sides', 0);

    /**
     * set number of sides
     * @name setSides
     * @method
     * @memberof Konva.RegularPolygon.prototype
     * @param {int} sides
     */

    /**
     * get number of sides
     * @name getSides
     * @method
     * @memberof Konva.RegularPolygon.prototype
     */

    Konva.Collection.mapMethods(Konva.RegularPolygon);
})();

(function() {
    'use strict';
    /**
     * Star constructor
     * @constructor
     * @memberof Konva
     * @augments Konva.Shape
     * @param {Object} config
     * @param {Integer} config.numPoints
     * @param {Number} config.innerRadius
     * @param {Number} config.outerRadius
     * @param {String} [config.fill] fill color
     * @param {Image} [config.fillPatternImage] fill pattern image
     * @param {Number} [config.fillPatternX]
     * @param {Number} [config.fillPatternY]
     * @param {Object} [config.fillPatternOffset] object with x and y component
     * @param {Number} [config.fillPatternOffsetX] 
     * @param {Number} [config.fillPatternOffsetY] 
     * @param {Object} [config.fillPatternScale] object with x and y component
     * @param {Number} [config.fillPatternScaleX]
     * @param {Number} [config.fillPatternScaleY]
     * @param {Number} [config.fillPatternRotation]
     * @param {String} [config.fillPatternRepeat] can be "repeat", "repeat-x", "repeat-y", or "no-repeat".  The default is "no-repeat"
     * @param {Object} [config.fillLinearGradientStartPoint] object with x and y component
     * @param {Number} [config.fillLinearGradientStartPointX]
     * @param {Number} [config.fillLinearGradientStartPointY]
     * @param {Object} [config.fillLinearGradientEndPoint] object with x and y component
     * @param {Number} [config.fillLinearGradientEndPointX]
     * @param {Number} [config.fillLinearGradientEndPointY]
     * @param {Array} [config.fillLinearGradientColorStops] array of color stops
     * @param {Object} [config.fillRadialGradientStartPoint] object with x and y component
     * @param {Number} [config.fillRadialGradientStartPointX]
     * @param {Number} [config.fillRadialGradientStartPointY]
     * @param {Object} [config.fillRadialGradientEndPoint] object with x and y component
     * @param {Number} [config.fillRadialGradientEndPointX] 
     * @param {Number} [config.fillRadialGradientEndPointY] 
     * @param {Number} [config.fillRadialGradientStartRadius]
     * @param {Number} [config.fillRadialGradientEndRadius]
     * @param {Array} [config.fillRadialGradientColorStops] array of color stops
     * @param {Boolean} [config.fillEnabled] flag which enables or disables the fill.  The default value is true
     * @param {String} [config.fillPriority] can be color, linear-gradient, radial-graident, or pattern.  The default value is color.  The fillPriority property makes it really easy to toggle between different fill types.  For example, if you want to toggle between a fill color style and a fill pattern style, simply set the fill property and the fillPattern properties, and then use setFillPriority('color') to render the shape with a color fill, or use setFillPriority('pattern') to render the shape with the pattern fill configuration
     * @param {String} [config.stroke] stroke color
     * @param {Number} [config.strokeWidth] stroke width
     * @param {Boolean} [config.strokeHitEnabled] flag which enables or disables stroke hit region.  The default is true
     * @param {Boolean} [config.perfectDrawEnabled] flag which enables or disables using buffer canvas.  The default is true
     * @param {Boolean} [config.shadowForStrokeEnabled] flag which enables or disables shasow for stroke.  The default is true
     * @param {Boolean} [config.strokeScaleEnabled] flag which enables or disables stroke scale.  The default is true
     * @param {Boolean} [config.strokeEnabled] flag which enables or disables the stroke.  The default value is true
     * @param {String} [config.lineJoin] can be miter, round, or bevel.  The default
     *  is miter
     * @param {String} [config.lineCap] can be butt, round, or sqare.  The default
     *  is butt
     * @param {String} [config.shadowColor]
     * @param {Number} [config.shadowBlur]
     * @param {Object} [config.shadowOffset] object with x and y component
     * @param {Number} [config.shadowOffsetX]
     * @param {Number} [config.shadowOffsetY]
     * @param {Number} [config.shadowOpacity] shadow opacity.  Can be any real number
     *  between 0 and 1
     * @param {Boolean} [config.shadowEnabled] flag which enables or disables the shadow.  The default value is true
     * @param {Array} [config.dash]
     * @param {Boolean} [config.dashEnabled] flag which enables or disables the dashArray.  The default value is true
     * @param {Number} [config.x]
     * @param {Number} [config.y]
     * @param {Number} [config.width]
     * @param {Number} [config.height]
     * @param {Boolean} [config.visible]
     * @param {Boolean} [config.listening] whether or not the node is listening for events
     * @param {String} [config.id] unique id
     * @param {String} [config.name] non-unique name
     * @param {Number} [config.opacity] determines node opacity.  Can be any number between 0 and 1
     * @param {Object} [config.scale] set scale
     * @param {Number} [config.scaleX] set scale x
     * @param {Number} [config.scaleY] set scale y
     * @param {Number} [config.rotation] rotation in degrees
     * @param {Object} [config.offset] offset from center point and rotation point
     * @param {Number} [config.offsetX] set offset x
     * @param {Number} [config.offsetY] set offset y
     * @param {Boolean} [config.draggable] makes the node draggable.  When stages are draggable, you can drag and drop
     *  the entire stage by dragging any portion of the stage
     * @param {Number} [config.dragDistance]
     * @param {Function} [config.dragBoundFunc]
     * @example
     * var star = new Konva.Star({
     *   x: 100,
     *   y: 200,
     *   numPoints: 5,
     *   innerRadius: 70,
     *   outerRadius: 70,
     *   fill: 'red',
     *   stroke: 'black',
     *   strokeWidth: 4
     * });
     */
    Konva.Star = function(config) {
        this.___init(config);
    };

    Konva.Star.prototype = {
        _centroid: true,
        ___init: function(config) {
            // call super constructor
            Konva.Shape.call(this, config);
            this.className = 'Star';
            this.sceneFunc(this._sceneFunc);
        },
        _sceneFunc: function(context) {
            var innerRadius = this.innerRadius(),
                outerRadius = this.outerRadius(),
                numPoints = this.numPoints();

            context.beginPath();
            context.moveTo(0, 0 - outerRadius);

            for(var n = 1; n < numPoints * 2; n++) {
                var radius = n % 2 === 0 ? outerRadius : innerRadius;
                var x = radius * Math.sin(n * Math.PI / numPoints);
                var y = -1 * radius * Math.cos(n * Math.PI / numPoints);
                context.lineTo(x, y);
            }
            context.closePath();

            context.fillStrokeShape(this);
        },
        // implements Shape.prototype.getWidth()
        getWidth: function() {
            return this.getOuterRadius() * 2;
        },
        // implements Shape.prototype.getHeight()
        getHeight: function() {
            return this.getOuterRadius() * 2;
        },
        // implements Shape.prototype.setWidth()
        setWidth: function(width) {
            Konva.Node.prototype.setWidth.call(this, width);
            if (this.outerRadius() !== width / 2) {
                this.setOuterRadius(width / 2);
            }
        },
        // implements Shape.prototype.setHeight()
        setHeight: function(height) {
            Konva.Node.prototype.setHeight.call(this, height);
            if (this.outerRadius() !== height / 2) {
                this.setOuterRadius(height / 2);
            }
        }
    };
    Konva.Util.extend(Konva.Star, Konva.Shape);

    // add getters setters
    Konva.Factory.addGetterSetter(Konva.Star, 'numPoints', 5);

    /**
     * set number of points
     * @name setNumPoints
     * @method
     * @memberof Konva.Star.prototype
     * @param {Integer} points
     */

     /**
     * get number of points
     * @name getNumPoints
     * @method
     * @memberof Konva.Star.prototype
     */

    Konva.Factory.addGetterSetter(Konva.Star, 'innerRadius', 0);

    /**
     * set inner radius
     * @name setInnerRadius
     * @method
     * @memberof Konva.Star.prototype
     * @param {Number} radius
     */

     /**
     * get inner radius
     * @name getInnerRadius
     * @method
     * @memberof Konva.Star.prototype
     */

    Konva.Factory.addGetterSetter(Konva.Star, 'outerRadius', 0);

    /**
     * set outer radius
     * @name setOuterRadius
     * @method
     * @memberof Konva.Star.prototype
     * @param {Number} radius
     */

     /**
     * get outer radius
     * @name getOuterRadius
     * @method
     * @memberof Konva.Star.prototype
     */

    Konva.Collection.mapMethods(Konva.Star);
})();

(function() {
    'use strict';
    // constants
    var ATTR_CHANGE_LIST = ['fontFamily', 'fontSize', 'fontStyle', 'padding', 'lineHeight', 'text'],
        CHANGE_KONVA = 'Change.konva',
        NONE = 'none',
        UP = 'up',
        RIGHT = 'right',
        DOWN = 'down',
        LEFT = 'left',
        LABEL = 'Label',

     // cached variables
     attrChangeListLen = ATTR_CHANGE_LIST.length;

    /**
     * Label constructor.&nbsp; Labels are groups that contain a Text and Tag shape
     * @constructor
     * @memberof Konva
     * @param {Object} config
     * @param {Number} [config.x]
     * @param {Number} [config.y]
     * @param {Number} [config.width]
     * @param {Number} [config.height]
     * @param {Boolean} [config.visible]
     * @param {Boolean} [config.listening] whether or not the node is listening for events
     * @param {String} [config.id] unique id
     * @param {String} [config.name] non-unique name
     * @param {Number} [config.opacity] determines node opacity.  Can be any number between 0 and 1
     * @param {Object} [config.scale] set scale
     * @param {Number} [config.scaleX] set scale x
     * @param {Number} [config.scaleY] set scale y
     * @param {Number} [config.rotation] rotation in degrees
     * @param {Object} [config.offset] offset from center point and rotation point
     * @param {Number} [config.offsetX] set offset x
     * @param {Number} [config.offsetY] set offset y
     * @param {Boolean} [config.draggable] makes the node draggable.  When stages are draggable, you can drag and drop
     *  the entire stage by dragging any portion of the stage
     * @param {Number} [config.dragDistance]
     * @param {Function} [config.dragBoundFunc]
     * @example
     * // create label
     * var label = new Konva.Label({
     *   x: 100,
     *   y: 100,
     *   draggable: true
     * });
     *
     * // add a tag to the label
     * label.add(new Konva.Tag({
     *   fill: '#bbb',
     *   stroke: '#333',
     *   shadowColor: 'black',
     *   shadowBlur: 10,
     *   shadowOffset: [10, 10],
     *   shadowOpacity: 0.2,
     *   lineJoin: 'round',
     *   pointerDirection: 'up',
     *   pointerWidth: 20,
     *   pointerHeight: 20,
     *   cornerRadius: 5
     * }));
     *
     * // add text to the label
     * label.add(new Konva.Text({
     *   text: 'Hello World!',
     *   fontSize: 50,
     *   lineHeight: 1.2,
     *   padding: 10,
     *   fill: 'green'
     *  }));
     */
    Konva.Label = function(config) {
        this.____init(config);
    };

    Konva.Label.prototype = {
        ____init: function(config) {
            var that = this;

            Konva.Group.call(this, config);
            this.className = LABEL;

            this.on('add.konva', function(evt) {
                that._addListeners(evt.child);
                that._sync();
            });
        },
        /**
         * get Text shape for the label.  You need to access the Text shape in order to update
         * the text properties
         * @name getText
         * @method
         * @memberof Konva.Label.prototype
         */
        getText: function() {
            return this.find('Text')[0];
        },
        /**
         * get Tag shape for the label.  You need to access the Tag shape in order to update
         * the pointer properties and the corner radius
         * @name getTag
         * @method
         * @memberof Konva.Label.prototype
         */
        getTag: function() {
            return this.find('Tag')[0];
        },
        _addListeners: function(text) {
            var that = this,
                n;
            var func = function(){
                    that._sync();
                };

            // update text data for certain attr changes
            for(n = 0; n < attrChangeListLen; n++) {
                text.on(ATTR_CHANGE_LIST[n] + CHANGE_KONVA, func);
            }
        },
        getWidth: function() {
            return this.getText().getWidth();
        },
        getHeight: function() {
            return this.getText().getHeight();
        },
        _sync: function() {
            var text = this.getText(),
                tag = this.getTag(),
                width, height, pointerDirection, pointerWidth, x, y, pointerHeight;

            if (text && tag) {
                width = text.getWidth();
                height = text.getHeight();
                pointerDirection = tag.getPointerDirection();
                pointerWidth = tag.getPointerWidth();
                pointerHeight = tag.getPointerHeight();
                x = 0;
                y = 0;

                switch(pointerDirection) {
                    case UP:
                        x = width / 2;
                        y = -1 * pointerHeight;
                        break;
                    case RIGHT:
                        x = width + pointerWidth;
                        y = height / 2;
                        break;
                    case DOWN:
                        x = width / 2;
                        y = height + pointerHeight;
                        break;
                    case LEFT:
                        x = -1 * pointerWidth;
                        y = height / 2;
                        break;
                }

                tag.setAttrs({
                    x: -1 * x,
                    y: -1 * y,
                    width: width,
                    height: height
                });

                text.setAttrs({
                    x: -1 * x,
                    y: -1 * y
                });
            }
        }
    };

    Konva.Util.extend(Konva.Label, Konva.Group);

    Konva.Collection.mapMethods(Konva.Label);

    /**
     * Tag constructor.&nbsp; A Tag can be configured
     *  to have a pointer element that points up, right, down, or left
     * @constructor
     * @memberof Konva
     * @param {Object} config
     * @param {String} [config.pointerDirection] can be up, right, down, left, or none; the default
     *  is none.  When a pointer is present, the positioning of the label is relative to the tip of the pointer.
     * @param {Number} [config.pointerWidth]
     * @param {Number} [config.pointerHeight]
     * @param {Number} [config.cornerRadius]
     */
    Konva.Tag = function(config) {
        this.___init(config);
    };

    Konva.Tag.prototype = {
        ___init: function(config) {
            Konva.Shape.call(this, config);
            this.className = 'Tag';
            this.sceneFunc(this._sceneFunc);
        },
        _sceneFunc: function(context) {
            var width = this.getWidth(),
                height = this.getHeight(),
                pointerDirection = this.getPointerDirection(),
                pointerWidth = this.getPointerWidth(),
                pointerHeight = this.getPointerHeight(),
                cornerRadius = this.getCornerRadius();

            context.beginPath();
            context.moveTo(0, 0);

            if (pointerDirection === UP) {
                context.lineTo((width - pointerWidth) / 2, 0);
                context.lineTo(width / 2, -1 * pointerHeight);
                context.lineTo((width + pointerWidth) / 2, 0);
            }

            if(!cornerRadius) {
                context.lineTo(width, 0);
            } else {
                context.lineTo(width - cornerRadius, 0);
                context.arc(width - cornerRadius, cornerRadius, cornerRadius, Math.PI * 3 / 2, 0, false);
            }

            if (pointerDirection === RIGHT) {
                context.lineTo(width, (height - pointerHeight) / 2);
                context.lineTo(width + pointerWidth, height / 2);
                context.lineTo(width, (height + pointerHeight) / 2);
            }

            if(!cornerRadius) {
                context.lineTo(width, height);
            } else {
                context.lineTo(width, height - cornerRadius);
                context.arc(width - cornerRadius, height - cornerRadius, cornerRadius, 0, Math.PI / 2, false);
            }

            if (pointerDirection === DOWN) {
                context.lineTo((width + pointerWidth) / 2, height);
                context.lineTo(width / 2, height + pointerHeight);
                context.lineTo((width - pointerWidth) / 2, height);
            }

            if(!cornerRadius) {
                context.lineTo(0, height);
            } else {
                context.lineTo(cornerRadius, height);
                context.arc(cornerRadius, height - cornerRadius, cornerRadius, Math.PI / 2, Math.PI, false);
            }

            if (pointerDirection === LEFT) {
                context.lineTo(0, (height + pointerHeight) / 2);
                context.lineTo(-1 * pointerWidth, height / 2);
                context.lineTo(0, (height - pointerHeight) / 2);
            }

            if(cornerRadius) {
                context.lineTo(0, cornerRadius);
                context.arc(cornerRadius, cornerRadius, cornerRadius, Math.PI, Math.PI * 3 / 2, false);
            }

            context.closePath();
            context.fillStrokeShape(this);
        },
        getSelfRect: function() {
            var x = 0,
                y = 0,
                pointerWidth = this.getPointerWidth(),
                pointerHeight = this.getPointerHeight(),
                direction = this.pointerDirection(),
                width = this.getWidth(),
                height = this.getHeight();

            if (direction === UP) {
                y -= pointerHeight;
                height += pointerHeight;
            } else if (direction === DOWN) {
                height += pointerHeight;
            } else if (direction === LEFT) {
                // ARGH!!! I have no idea why should I used magic 1.5!!!!!!!!!
                x -= pointerWidth * 1.5;
                width += pointerWidth;
            } else if (direction === RIGHT) {
                width += pointerWidth * 1.5;
            }
            return {
                x: x,
                y: y,
                width: width,
                height: height
            };
        }
    };

    Konva.Util.extend(Konva.Tag, Konva.Shape);
    Konva.Factory.addGetterSetter(Konva.Tag, 'pointerDirection', NONE);

    /**
     * set pointer Direction
     * @name setPointerDirection
     * @method
     * @memberof Konva.Tag.prototype
     * @param {String} pointerDirection can be up, right, down, left, or none.  The
     *  default is none
     */

     /**
     * get pointer Direction
     * @name getPointerDirection
     * @method
     * @memberof Konva.Tag.prototype
     */

    Konva.Factory.addGetterSetter(Konva.Tag, 'pointerWidth', 0);

    /**
     * set pointer width
     * @name setPointerWidth
     * @method
     * @memberof Konva.Tag.prototype
     * @param {Number} pointerWidth
     */

     /**
     * get pointer width
     * @name getPointerWidth
     * @method
     * @memberof Konva.Tag.prototype
     */

    Konva.Factory.addGetterSetter(Konva.Tag, 'pointerHeight', 0);

    /**
     * set pointer height
     * @name setPointerHeight
     * @method
     * @memberof Konva.Tag.prototype
     * @param {Number} pointerHeight
     */

     /**
     * get pointer height
     * @name getPointerHeight
     * @method
     * @memberof Konva.Tag.prototype
     */

    Konva.Factory.addGetterSetter(Konva.Tag, 'cornerRadius', 0);

    /**
     * set corner radius
     * @name setCornerRadius
     * @method
     * @memberof Konva.Tag.prototype
     * @param {Number} corner radius
     */

    /**
     * get corner radius
     * @name getCornerRadius
     * @method
     * @memberof Konva.Tag.prototype
     */

    Konva.Collection.mapMethods(Konva.Tag);
})();

(function() {
    'use strict';
    /**
     * Arrow constructor
     * @constructor
     * @memberof Konva
     * @augments Konva.Shape
     * @param {Object} config
     * @param {Array} config.points
     * @param {Number} [config.tension] Higher values will result in a more curvy line.  A value of 0 will result in no interpolation.
     *   The default is 0
     * @param {Number} config.pointerLength
     * @param {Number} config.pointerWidth
     * @param {String} [config.fill] fill color
     * @param {Image} [config.fillPatternImage] fill pattern image
     * @param {Number} [config.fillPatternX]
     * @param {Number} [config.fillPatternY]
     * @param {Object} [config.fillPatternOffset] object with x and y component
     * @param {Number} [config.fillPatternOffsetX] 
     * @param {Number} [config.fillPatternOffsetY] 
     * @param {Object} [config.fillPatternScale] object with x and y component
     * @param {Number} [config.fillPatternScaleX]
     * @param {Number} [config.fillPatternScaleY]
     * @param {Number} [config.fillPatternRotation]
     * @param {String} [config.fillPatternRepeat] can be "repeat", "repeat-x", "repeat-y", or "no-repeat".  The default is "no-repeat"
     * @param {Object} [config.fillLinearGradientStartPoint] object with x and y component
     * @param {Number} [config.fillLinearGradientStartPointX]
     * @param {Number} [config.fillLinearGradientStartPointY]
     * @param {Object} [config.fillLinearGradientEndPoint] object with x and y component
     * @param {Number} [config.fillLinearGradientEndPointX]
     * @param {Number} [config.fillLinearGradientEndPointY]
     * @param {Array} [config.fillLinearGradientColorStops] array of color stops
     * @param {Object} [config.fillRadialGradientStartPoint] object with x and y component
     * @param {Number} [config.fillRadialGradientStartPointX]
     * @param {Number} [config.fillRadialGradientStartPointY]
     * @param {Object} [config.fillRadialGradientEndPoint] object with x and y component
     * @param {Number} [config.fillRadialGradientEndPointX] 
     * @param {Number} [config.fillRadialGradientEndPointY] 
     * @param {Number} [config.fillRadialGradientStartRadius]
     * @param {Number} [config.fillRadialGradientEndRadius]
     * @param {Array} [config.fillRadialGradientColorStops] array of color stops
     * @param {Boolean} [config.fillEnabled] flag which enables or disables the fill.  The default value is true
     * @param {String} [config.fillPriority] can be color, linear-gradient, radial-graident, or pattern.  The default value is color.  The fillPriority property makes it really easy to toggle between different fill types.  For example, if you want to toggle between a fill color style and a fill pattern style, simply set the fill property and the fillPattern properties, and then use setFillPriority('color') to render the shape with a color fill, or use setFillPriority('pattern') to render the shape with the pattern fill configuration
     * @param {String} [config.stroke] stroke color
     * @param {Number} [config.strokeWidth] stroke width
     * @param {Boolean} [config.strokeHitEnabled] flag which enables or disables stroke hit region.  The default is true
     * @param {Boolean} [config.perfectDrawEnabled] flag which enables or disables using buffer canvas.  The default is true
     * @param {Boolean} [config.shadowForStrokeEnabled] flag which enables or disables shasow for stroke.  The default is true
     * @param {Boolean} [config.strokeScaleEnabled] flag which enables or disables stroke scale.  The default is true
     * @param {Boolean} [config.strokeEnabled] flag which enables or disables the stroke.  The default value is true
     * @param {String} [config.lineJoin] can be miter, round, or bevel.  The default
     *  is miter
     * @param {String} [config.lineCap] can be butt, round, or sqare.  The default
     *  is butt
     * @param {String} [config.shadowColor]
     * @param {Number} [config.shadowBlur]
     * @param {Object} [config.shadowOffset] object with x and y component
     * @param {Number} [config.shadowOffsetX]
     * @param {Number} [config.shadowOffsetY]
     * @param {Number} [config.shadowOpacity] shadow opacity.  Can be any real number
     *  between 0 and 1
     * @param {Boolean} [config.shadowEnabled] flag which enables or disables the shadow.  The default value is true
     * @param {Array} [config.dash]
     * @param {Boolean} [config.dashEnabled] flag which enables or disables the dashArray.  The default value is true
     * @param {Number} [config.x]
     * @param {Number} [config.y]
     * @param {Number} [config.width]
     * @param {Number} [config.height]
     * @param {Boolean} [config.visible]
     * @param {Boolean} [config.listening] whether or not the node is listening for events
     * @param {String} [config.id] unique id
     * @param {String} [config.name] non-unique name
     * @param {Number} [config.opacity] determines node opacity.  Can be any number between 0 and 1
     * @param {Object} [config.scale] set scale
     * @param {Number} [config.scaleX] set scale x
     * @param {Number} [config.scaleY] set scale y
     * @param {Number} [config.rotation] rotation in degrees
     * @param {Object} [config.offset] offset from center point and rotation point
     * @param {Number} [config.offsetX] set offset x
     * @param {Number} [config.offsetY] set offset y
     * @param {Boolean} [config.draggable] makes the node draggable.  When stages are draggable, you can drag and drop
     *  the entire stage by dragging any portion of the stage
     * @param {Number} [config.dragDistance]
     * @param {Function} [config.dragBoundFunc]
     * @example
     * var line = new Konva.Line({
     *   points: [73, 70, 340, 23, 450, 60, 500, 20],
     *   stroke: 'red',
     *   tension: 1,
     *   pointerLength : 10,
     *   pointerWidth : 12
     * });
     */
    Konva.Arrow = function(config) {
        this.____init(config);
    };

    Konva.Arrow.prototype = {
        ____init: function(config) {
            // call super constructor
            Konva.Line.call(this, config);
            this.className = 'Arrow';
        },
        _sceneFunc: function(ctx) {
            var PI2 = Math.PI * 2;
            var points = this.points();
            var n = points.length;
            var dx = points[n - 2] - points[n - 4];
            var dy = points[n - 1] - points[n - 3];
            var radians = (Math.atan2(dy, dx) + PI2) % PI2;
            var length = this.pointerLength();
            var width = this.pointerWidth();

            ctx.save();
            ctx.beginPath();
            ctx.translate(points[n - 2], points[n - 1]);
            ctx.rotate(radians);
            ctx.moveTo(0, 0);
            ctx.lineTo(-length, width / 2);
            ctx.lineTo(-length, -width / 2);
            ctx.closePath();
            ctx.restore();

            if (this.pointerAtBeginning()) {
                ctx.save();
                ctx.translate(points[0], points[1]);
                dx = points[2] - points[0];
                dy = points[3] - points[1];
                ctx.rotate((Math.atan2(-dy, -dx) + PI2) % PI2);
                ctx.moveTo(0, 0);
                ctx.lineTo(-10, 6);
                ctx.lineTo(-10, -6);
                ctx.closePath();
                ctx.restore();
            }

            ctx.fillStrokeShape(this);
            Konva.Line.prototype._sceneFunc.apply(this, arguments);
        }
    };

    Konva.Util.extend(Konva.Arrow, Konva.Line);
    /**
     * get/set pointerLength
     * @name pointerLength
     * @method
     * @memberof Konva.Arrow.prototype
     * @param {Number} Length of pointer of arrow.
     *   The default is 10.
     * @returns {Number}
     * @example
     * // get tension
     * var pointerLength = line.pointerLength();
     *
     * // set tension
     * line.pointerLength(15);
     */

    Konva.Factory.addGetterSetter(Konva.Arrow, 'pointerLength', 10);
    /**
     * get/set pointerWidth
     * @name pointerWidth
     * @method
     * @memberof Konva.Arrow.prototype
     * @param {Number} Width of pointer of arrow.
     *   The default is 10.
     * @returns {Number}
     * @example
     * // get tension
     * var pointerWidth = line.pointerWidth();
     *
     * // set tension
     * line.pointerWidth(15);
     */

    Konva.Factory.addGetterSetter(Konva.Arrow, 'pointerWidth', 10);
    /**
     * get/set pointerAtBeginning
     * @name pointerAtBeginning
     * @method
     * @memberof Konva.Arrow.prototype
     * @param {Number} Should pointer displayed at beginning of arrow.
     *   The default is false.
     * @returns {Boolean}
     * @example
     * // get tension
     * var pointerAtBeginning = line.pointerAtBeginning();
     *
     * // set tension
     * line.pointerAtBeginning(true);
     */

    Konva.Factory.addGetterSetter(Konva.Arrow, 'pointerAtBeginning', false);
    Konva.Collection.mapMethods(Konva.Arrow);

})();


(function () {
    // 将 html 代码转换成 dom 对象（html 代码必须包含一个根节点）
    function HTMLParser(htmlString){
        var div = document.createElement('div');
        div.innerHTML = htmlString;
        return div.firstChild;
    }

    if (window.$) {
        $.extend({
            deepClone: function (obj) {
                var type = $.type(obj);
                // object
                if (type === 'object') {
                    // 深度拷贝
                    return $.extend(true, {}, obj);
                }
                // array
                else if (type === 'array') {
                    // 数组深度拷贝
                    return $.extend(true, [], obj);
                }
                // number, string, boolean, error, regexp, date, function
                else {
                    // 不做处理
                    return obj;
                }
            }
        });
    }

    if (!String.prototype.toHexString) {
        String.prototype.toHexString = function () {
            return this.split('').map(function (row) {
                return '\\' + row.charCodeAt(0).toString(16);
            }).join('');
        };
    }

    if (!Array.toMap) {
        Array.toMap = function (arr, key) {
            var map = {};
            arr.forEach(function (row, i) {
                map[row[key]] = row;
            });
            return map;
        };
    }

    if (echarts) {                  
        //TODO: to be removed
        echarts.config = echarts.config || { color: ['#E2583A','#FD9F08','#1D74A9','#04A0D6','#689C0F','#109d83','#FEC500'] };
    }

    window.HTMLParser = HTMLParser;
} ());
/*
    core.js
 */
(function (exports) {

    var Events = {
        /**
         * 添加事件订阅
         * @param {string}   events  需要订阅的事件，多个事件之间用' '隔开
         * @param {Function} fn      事件处理函数
         * @param {object}   context fn执行时的上下文环境
         */
        addEventListener: function (events, fn, context) {
            var _this = this;
            var e = this.__info || (this.__info = {});

            events = events.split(' ');
            events.forEach(function (event) {
                var evt;
                event = 'event:' + event;
                evt = e[event] || (e[event] = []);
                // (fn, context) 为一组
                evt.push(fn, context);
            });
        },
        /**
         * addEventListener 方法的别名
         */
        on: function (events, fn, context) {
            return this.addEventListener(events, fn, context);
        },
        /**
         * 添加一个一次性的事件订阅
         */
        once: function (event, fn, context) {
            var _this = this;
            this.addEventListener(event, function ofn() {
                _this.removeEventListener(event, ofn);
                fn.apply(context, arguments);
            }, context);
        },
        /**
         * 删除事件订阅
         */
        removeEventListener: function (events, fn) {
            var e = this.__info;
            var rs = null;

            if(e) {
                events = events.split(' ');
                events.forEach(function (event) {
                    var i;
                    event = e['event:'+event];
                    if(event) {
                        i = event.indexOf(fn);
                        if(i > -1) {
                            rs = event.splice(i, 2)[0] || null;
                        }
                    }
                });
            }

            return rs;
        },
        /**
         * 删除某个事件的所有处理方法
         */
        removeAllListeners: function (event) {
            var e = this.__info;
            if(e) {
                delete e['event:' + event];
            }
        },
        /** 
         * 获取某个事件的所有处理方法
         */
        listeners: function (event) {
            var e = this.__info;
            if(e) {
                return e['event:' + event] || [];
            }
            return [];
        },
        /**
         * 发布某个事件
         * @param  {string} event 需要发布的事件名称
         */
        emit: function (event /*, arguments ... */) {
            var e = this.__info;
            if(e) {
                e = e['event:'+event];
                if(e && e.length) {
                    for(var i = 0, len = e.length; i < len; i += 2) {
                        try {
                            e[i].apply(e[i+1], arguments);
                        } catch(_) {
                            Log.exception('emit', _);
                        }
                    }
                    return true;
                }
            }
            return false;
        }
    };

    exports.Events = Events;

} (window));

/** 数据模型 - 单个对象 */
(function (exports) {

    function Model(values) {
        this._values = values || {};

        this.initialize(this._values);
    }

    Model.prototype = Object.create(Events);

    void function () {
        this.constructor = Model;

        this.initialize = function (o) {
            for (var p in o) {
                if (o.hasOwnProperty(p)) {
                    this.property(p);
                }
            }
        };

        this.property = function (name, value) {
            // 若没有这个属性，则创建
            if (!(name in this)) {
                this[name] = this._makeProperty(name);
            }
            return arguments.length === 1 ? this[name]() : this[name](value);
        };

        this.removeProperty = function (name) {
            var arr, obj, p, lp;

            if (!(name in this)) {
                return false;
            }
            delete this[name];

            // 删除对应的值
            arr = name.split('.');
            lp = arr.pop();
            obj = this._values;
            while(p = arr.shift()) obj = obj[p];
            delete obj[lp];

            // 如果父对象被删除了，子对象应该相应的被删除
            for (var p in this) {
                if (!this.hasOwnProperty(p) || p.indexOf(name) !== 0) continue;
                delete this[p];
            }

            return true;
        };

        this.emit = function (event) {
            Events.emit.apply(this, arguments);
        };

        // 等所有的属性都赋值完毕，再触发 update 事件
        this.delayUpdate = function (fn) {
            var pending = false;
            var propsPathArr = [];

            // 如果 emit 方法已经被覆盖了，则控制权外移，让外界来控制何时更新
            // 例如：在组合更新中，进行 update 操作时，何时 emit 应该由组合更新的方法决定
            if (this.hasOwnProperty('emit')) {
                try {
                    fn.call(this);
                } catch(e) {
                    Log.error(e);
                }
                return;
            }

            try {
                
                this.emit = function (event) {
                    if (event === 'update') {
                        pending = true;
                    } else {
                        this.__proto__.emit.apply(this, arguments);
                    }
                };
                propsPathArr = fn.call(this);
            } finally {
                delete this.emit;
                if(pending) {
                    this.emit('update', propsPathArr.join(','));
                }
            }
        };

        this.update = function (props) {
            var _this = this;
            
            this.delayUpdate(function () {
                var propsPathArr = [];
                for (var prop in props) {
                    if(!(prop in this)) {
                        throw new Error('没有找到这个属性：'+prop);
                    }
                    _this[prop](props[prop]);
                    propsPathArr.push('update.'+prop);
                }
                return propsPathArr;
            });
        };

        this.serialize = function () {
            return this._values;
        };

        this._makeProperty = function (prop) {
            var body = 'var ov = this._values.{p};if(arguments.length && (v !== ov || Object.prototype.toString.call(v) === "[object Object]") ) {this._values.{p}=v; this.emit("update.{p}"); this.emit("update", \'update.{p}\'); } return ov;'
            return new Function('v', body.replace(/\{p\}/g, prop) );
        };

    }.call(Model.prototype);

    
    /**
     * 组合更新的方法
     * @returns {function} 
     */
    Model.prototype.compose = function () {
        var models = Array.prototype.slice.apply(arguments).concat(this);

        return {
            /**
             * 
             * 执行用户自定义的更新操作，完成后只发送用户的自定义操作事件（可以理解为替换掉原有model的事件）
             * @param {any} customEventName 自定义事件标识
             * @param {any} fn 操作方法
             * @returns
             */
            updateAsReplace: function (customEventName, fn) {
                if (typeof fn !== 'function') {
                    return;
                }
                customEventName = customEventName || 'customEvent';

                // 屏蔽model的emit事件
                models.forEach(function (model) {
                    model.emit = function () {/** empty method */};
                });

                fn.call(this);

                // 解除屏蔽
                models.forEach(function (model) {
                    delete model.emit;
                });

                this.emit(customEventName, models);
            }.bind(this),
            /**
             * 
             * 执行用户自定义的更新操作，完成后额外发送用户的自定义操作事件
             * @param {any} customEventName 自定义事件标识
             * @param {any} fn 操作方法
             * @returns
             */
            update: function (customEventName, fn) {
                if (typeof fn !== 'function') {
                    return;
                }
                customEventName = customEventName || 'customEvent';

                fn.call(this);

                this.emit(customEventName, models);
            }.bind(this)
        };
    };

    exports.Model = Model;
    
} (window));

(function (exports, Model) {
    var class2type = {};
    ['Boolean', 'Number', 'String', 'Array', 'Function', 'Object', 'Date', 'RegExp', 'Error'].forEach(function (type) {
        class2type['[object ' + type + ']'] = type.toLowerCase();
    });

    function getType(o) {
        // 处理 null 和 undefined
        if(o == null) {
            return o + '';
        }

        var type = Object.prototype.toString.call(o);
        return class2type[type] || 'object';
    }

    function NestedModel() {
        Model.apply(this, arguments);
    }

    NestedModel.prototype = Object.create(Model.prototype);

    void function () {
        this.constructor = NestedModel;

        this.initialize = function (o, path, k) {
            var keys, currentPath;
            
            path = path || [];
            // 复制一份
            currentPath = path.slice(0);

            if (typeof k !== 'undefined') {
                currentPath.push(k);
            }

            if (currentPath.length > 0) {
                this.property(currentPath.join('.'));
            }

            // 如果是 object，则进入下次循环
            if (getType(o) === 'object') {
                keys = Object.keys(o);
                keys.forEach(function (p) {
                    this.initialize(o[p], currentPath, p);
                }, this);
            }
        };

        this._makeProperty = function (prop) {
            var body = 'var o = this._values, isObj = Object.prototype.toString.call(v) === \'[object Object]\', arr = \'{p}\'.split(\'.\'), n = arr.splice(arr.length-1, 1)[0], path = arr.length ? arr.slice(0) : [], row, ov; while(row = arr.shift()) { o = o[row]; }; ov = o[n]; if(arguments.length && (v !== ov || isObj )) {o[n]=v; if(isObj){this.initialize(v,path,n)};this.emit("update.{p}"); this.emit("update", \'update.{p}\'); } return ov;';
            return new Function('v', body.replace(/\{p\}/g, prop) );
        };
    }.call(NestedModel.prototype);

    exports.NestedModel = NestedModel;
}(window, window.Model));

/** 数据模型 - 对象列表 */
(function (exports) {

    function ModelSet(models) {
        this.models = models || [];
    }

    ModelSet.prototype = Object.create(Model.prototype);

    void function () {
        this.constructor = ModelSet;

        this.length = function () {
            return this.models.length;
        };

        this.get = function (index) {
            return this.models[index];
        };

        this.forEach = function (fn, ctx) {
            return this.models.forEach(fn, ctx);
        };

        this.indexOf = function (model) {
            return this.models.indexOf(model);
        };

        this.findByProperty = function (name, value) {
            var models = this.models;
            for (var i = 0, len = models.length; i < len; i++) {
                if( models[i][name]() === value ) {
                    return models[i];
                }
            }
            return null;
        };

        this.findListByProperty = function (name, value) {
            var models = this.models;
            var rs;

            rs = models.filter(function (row) {
                if(row[name]() === value) {
                    return true;
                }
                return false;
            });

            return rs;
        };

        this.insertAt = function (idx, model) {
            var count;
            // 小于0，则从后向前计算
            if(idx < 0) {
                idx += this.models.length + 1;
            }
            if(Array.isArray(model)) {
                this.models.splice.apply( this.models, [idx, 0].concat(model) );
                count = model.length;
            } else {
                this.models.splice(idx, 0, model);
                count = 1;
                model = [model];
            }
             this.emit('insert', {
                index: idx,
                count: count,
                models: model
            });
            return count;
        };

        this.emit = function (evt) {
            Model.prototype.emit.apply(this, arguments);
        };

        /** 列表前插 */
        this.prepend = function (model) {
            return this.insertAt(0, model);
        };

        /** 列表追加 */
        this.append = function (model) {
            return this.insertAt(-1, model);
        };

        this.remove = function (model) {
            var fidx = -1;
            var count = 0;
            var total = 0;
            var removed = [];

            if(Array.isArray(model)) {
                model.forEach(function (m) {
                    var idx = this.indexOf(m);

                    if(idx === -1) return;

                    total ++;
                    if(fidx === -1) {
                        fidx = idx;
                        count ++;
                    } else if(idx === fidx + count) {
                        count ++;
                    } else {
                        removed = removed.concat(this.models.splice(fidx, count));
                        fidx = idx < fidx ? idx : idx - count;
                        count = 1;
                    }
                }, this);
                if(count) {
                    removed = removed.concat(this.models.splice(fidx, count));
                    this.emit('remove', {
                        count: count,
                        models: removed
                    });
                }
            } else {
                var idx = this.indexOf(model);
                if(idx !== -1) {
                    this.models.splice(idx, 1);
                    this.emit('remove', {
                        count: 1,
                        models: [model]
                    });
                    total = 1;
                }
            }
            return total;
        };


        /** 删除所有元素 */
        this.removeAll = function () {
            var len = this.models.length;
            var removed;
            if(len) {
                removed = this.models.splice(0, len);
                this.emit('remove', {
                    count: len,
                    models: removed
                });
                return true;
            } else {
                return false;
            }
        };

        /** 将数组中的某个元素从下标 'from' 位置移动到下标 'to' 位置 */
        this.move = function (from, to) {
            var len = this.models.length;
            var moved = null;
            // 对负数的兼容
            while (from < 0) {
                from += len;
            }
            while (to < 0) {
                from += len;
            }

            // 如果 to 大于数组的长度，这里我们用 undefined 来填充空缺的部分
            if (to >= len) {
                while ( (len++) <= to ) {
                    this.models.push(undefined);
                }
            }

            // 开始元素移动逻辑
            moved = this.models.splice(from, 1);
            this.models.splice(to, 0, moved[0]);

            this.emit('move', {
                from: from,
                to: to,
                // 数组
                models: moved
            });

            return true;
        };

        this.serialize = function () {
            var ms = [];
            this.forEach(function (row) {
                ms.push( row.serialize() );
            });
            return ms;
        };

        /**
         * 针对于对象数组，根据数组中每个对象中的 key 属性，生成一个 Map
         * @param  {string} key 指定的对象数组中的 key 属性
         * @param  {Boolean} returnModelFormat 是否返回 value 为 Mode 格式的数据
         * @return {object} 最终生成的 Map
         */
        this.toMap = function (key, returnModelFormat) {
            var map = {};

            for (var i = 0, len = this.models.length; i < len; i++) {
                map[this.models[i][key]()] = returnModelFormat ? this.models[i] : this.models[i].serialize();
            }
            return map;
        };

    }.call(ModelSet.prototype);

    exports.ModelSet = ModelSet;
    
} (window));
/** 
 * factory Canvas 控件基类
 */

(function () {

    // 不需要重写，但需要调用的方法
    var methods = [
        'moveToBottom',
        'getType',
        'id',
        'getZIndex',
        'getAbsolutePosition',
        'x',
        'y',
        'offsetX',
        'offsetY',
        'hasName',
        'points',
        'radius',
        'strokeWidth',
        'setZIndex',
        'isVisible'
    ];

    // 需要重写的方法
    var CanvasWidgetMixin = {
        // 获取包含的控件
        getChildren: function () {
            return this.children;
        },
        // 获取被包含的图层
        getLayer: function () {
            return this.layer;
        },
        // 判断是否包含某个图形，一般由图层级别的控件调用
        hasShape: function (shape) {
            return this.shape === shape;
        },
        // 设置控件的绝对位置
        setAbsolutePosition: function (pos) {
            var model = this.store.model;
            model.update(pos);
        },
        // 设置控件的位置
        position: function (pos) {
            var model = this.store.model;
            
            if (!pos) {
                return {
                    x: model.x(),
                    y: model.y()
                };
            }
            return this.store.model.update({
                x: pos.x,
                y: pos.y
            });
        },
        // 设置/获取控件的宽度
        width: function (val) {
            if(Object.prototype.toString.call(val) === '[object Number]') {
                return this.store.model.w(val);
            }
            return this.store.model.w();
        },
        // 设置/获取控件的高度
        height: function (val) {
            if(Object.prototype.toString.call(val) === '[object Number]') {
                return this.store.model.h(val);
            }
            return this.store.model.h();
        },
        scale: function (val) {
            if (Object.prototype.toString.call(val) === '[object Object]') {
                return this.store.model['option.scale'](val);
            }
            return this.store.model['option.scale']();
        },
        attach: function () {
            this.shape.show();
        },
        detach: function () {
            this.shape.hide();
        },
        destroy: function () {
            var _this = this;
            var children = this.getParent().children;
            children.some(function (row, i) {
                if (row === _this) {
                    children.splice(i, 1);
                    return true;
                }
            });
            this.shape.destroy();
        }
    };

    /** 默认方法 */
    methods.forEach(function (m) {
        CanvasWidgetMixin[m] = function () {
            if (typeof this.shape[m] !== 'undefined') {
                return this.shape[m].apply(this.shape, arguments);
            }
        };
    });

    window.mixins = window.mixins || {};
    window.mixins.CanvasWidgetMixin = CanvasWidgetMixin;

} ());
/** 
 * factory HTML 控件基类
 */

(function () {

    var HtmlWidgetMixin = {
        // 默认的控件类别
        type: 'html',
        // 控件名称
        name: '',
        // 控件在 Z 轴上的层级数
        zIndex: 1,
        // 获取控件的类型
        getType: function () {
            return this.type;
        },
        // 获取控件的 id
        id: function () {
            return this.shape.id;
        },
        // 获取包含的控件
        getChildren: function () {
            return this.children;
        },
        // 获取被包含的图层
        getLayer: function () {
            return this.layer;
        },
        // 获取当前控件的层级
        getZIndex: function () {
            return this.zIndex;
        },
        hasShape: function (shape) {
            var id = this.store.model._id();
            var shapeId = shape.id().split('_')[1];

            return id === shapeId;
        },
        // 获取控件的绝对位置
        getAbsolutePosition: function () {
            var model = this.store.model;
            var style = window.getComputedStyle(this.layer.shape);
            var left = parseFloat(style.left);
            var top = parseFloat(style.top);
            var scale = this.layer.painter.scale;

            return {
                x: model.x() * scale + left,
                y: model.y() * scale + top,
                width: model.w(),
                height: model.h()
            };
        },
        // 获取/设置控件的绝对位置
        setAbsolutePosition: function (pos) {
            var model = this.store.model;
            model.update(pos);
        },
        // 获取/设置控件的位置
        position: function (pos) {
            var model = this.store.model;
            if (!pos) {
                return {
                    x: model.x(),
                    y: model.y()
                };
            }
            return model.update(pos);
        },
        // 获取/设置控件的宽度
        width: function (val) {
            if(Object.prototype.toString.call(val) === '[object Number]') {
                return this.store.model.w(val);
            }
            return this.store.model.w();
        },
        // 获取/设置控件的高度
        height: function (val) {
            if(Object.prototype.toString.call(val) === '[object Number]') {
                return this.store.model.h(val);
            }
            return this.store.model.h();
        },
        // 判断控件的图形是否包含某个 css 类名
        hasName: function (name) {
            return this.shape.classList.contains(name);
        },
        // 将当前控件移动到整个画布的最底层
        moveToBottom: function () {},
        isVisible: function () {
            return (this.shape.offsetParent !== null);
        },
        attach: function () {
            this.shape.style.display = '';
            this.shadowShape.show()
        },
        detach: function () {
            this.shape.style.display = 'none';
            this.shadowShape.hide();
        },
        destroy: function () {
            var _this = this;
            var children = this.getParent().children;

            children.some(function (row, i) {
                if (row === _this) {
                    children.splice(i, 1);
                    return true;
                }
            });
            this.getLayer().shape.removeChild(this.shape);
            // 销毁影子图形
            this.shadowShape.destroy();
        }

    };

    window.mixins = window.mixins || {};
    window.mixins.HtmlWidgetMixin = HtmlWidgetMixin;

} ());
/**
 * tooltip 扩展模块
 */
(function (exports) {
    /////////////
    // TOOLTIP //
    /////////////
    var configMap = {
        // delay to load
        textTooltipTemplate: '<div class="tooltip observer-text-tooltip observer-text-editor" draggable="true" data-h5-draggable-node="true" data-ds-id="">\
        <div class="tooltip-inner">\
        <div>\
        <span id="pointName"></span>\
        <span class="label" style="font-weight:500;margin-left:5px;padding:1px 3px;color:#000;background-color:#c7c7c7;">Copy</span>\
        </div>\
        <div id="pointAlias">12312312</div><div><a class="lkAddToDS" href="javascript:;">\
        {interAnalysis}</a></div></div></div>',
        textEditorZIndex: 2200,
        textEditorOpacity: 0.8,
        textTooltipBackgroundColor: '#1A1A1A',
        textEditorIdPrefix: 'observer-text-editor-'
    };
    var TOOLTIP_DELAY = 1000;
    var $tooltip = null;
    var tooltipTimer = null;
    var tooltip = {
        show: function () {
            $tooltip.css('display', '');
            $tooltip.css('opacity', configMap.textEditorOpacity);
            if (tooltipTimer) { window.clearTimeout(tooltipTimer); tooltipTimer = null; }
        },
        hide: function () {
            if (!tooltipTimer) {
                tooltipTimer = window.setTimeout(function () {
                    $tooltip !== null && $tooltip.css('opacity', 0);
                    tooltipTimer = null;
                }, TOOLTIP_DELAY);
            }
        }
    };
    var dsLoadPromise = null;
    // 记录一下上一次加载的数据源，用于连续两次查询相同数据源的优化
    var lastQueryDs = null;

    var TooltipMixin = {
        enableTooltip: true,
        isInMouseOver: false,
        initTooltip: function (opt) {
            var _this, shape, ds, clickable;
            var container, shapeItem;
            // 容器的偏移量
            var offset;

            opt = $.extend(false, {}, opt);
            _this = this;
            shape = opt.shape || this.shape;
            ds = opt.ds || this.store.model.idDs()[0];
            clickable = typeof opt.clickable === 'undefined' ? false : opt.clickable;
            container = opt.container || this.page.painterCtn;

            if (shape.nodeType === 'Shape'){
                shapeItem = shape;
            } else {
                shapeItem = $(shape);
            }

            offset = $(container).offset();
            shapeItem.on('mouseenter',function(event){
                if (_this.isInMouseOver) return;
                $tooltip = _this.createTooltip(container, {
                    ds: ds,
                    clickable: clickable
                });
                tooltip.show();
                if (event.evt) {
                    container.style.cursor = 'pointer';
                    _this.checkPopoverBoundary(container, $tooltip, event.evt.pageX - offset.left, event.evt.pageY - offset.top);
                } else {
                    this.style.cursor = 'pointer';
                    _this.checkPopoverBoundary(container, $tooltip, event.pageX - offset.left, event.pageY - offset.top);
                }
                _this.isInMouseOver = true;
            });
            shapeItem.on('mouseleave ',function(e){
                if (e.evt) {
                    container.style.cursor = 'auto';
                } else {
                    this.style.cursor = 'auto';
                }
                tooltip.hide();
                _this.isInMouseOver = false;
            });
        },
        createTooltip: function (container, params) {
            var _this = this;
            var template, $template = $tooltip;
            var ds = params.ds;
            var clickable = params.clickable;
            var $pointName;
            // 是否是老式的数据源使用格式，即：纯数据源ID 的格式
            var isOldDsFormat = false;

            if (!$template || !$template.length) {
                template = configMap.textTooltipTemplate.formatEL({
                    interAnalysis:I18n.resource.observer.observerScreen.TEXT_ADD_TO_DATASOURCE
                });
                $template = $(template);
                $template.on('mouseenter', function () {
                    tooltip.show();
                }).on('mouseleave', function () {
                    tooltip.hide();
                }).on('transitionend', function (e) {
                    e = e.originalEvent;
                    if (e.propertyName === 'opacity' && e.target.style.opacity === '0') {
                        e.target.style.display = 'none';
                    }
                    e.stopPropagation();
                }).css({
                    'display': 'block',
                    'max-width': 'none',
                    'opacity': configMap.textEditorOpacity,
                    'z-index': configMap.textEditorZIndex - 1
                }).find('.tooltip-inner').css({
                    'background-color': configMap.textTooltipBackgroundColor,
                    'opacity': configMap.textEditorOpacity,
                    'max-width': 'none'
                });

                // 点名复制逻辑
                $template.find('.label').click(function (e) {
                    var input = document.createElement('textarea');

                    document.body.appendChild(input);
                    input.value = $template.find('#pointName').text();
                    input.focus();
                    input.select();
                    document.execCommand('Copy');
                    input.remove();
                    e.preventDefault();
                    e.stopPropagation();
                });

                if (clickable) {
                    $template.find('.lkAddToDS').click(function (e) {
                        var pointName = $(this).parents('.tooltip-inner').find('#pointName').text();
                        new ModalAppendPointToDs(false, null, [pointName]).show();
                        e.preventDefault();
                    });
                }
            }

            if (!$.contains(container, $template[0])) {
                $(container).append($template);
            }

            $template[0].dataset.dsId = ds;
            
            // 如果本次请求的数据源信息和上一次一致，则沿用上一次查询的结果
            if (lastQueryDs === ds) {
                return $template;
            }

            if (dsLoadPromise && dsLoadPromise.state() === 'pending') {
                // 中止上一次的请求
                dsLoadPromise.abort();
            }
            dsLoadPromise = WebAPI.post('/analysis/datasource/getDsItemsById', [ds]);
            lastQueryDs = ds;

            if (ds.indexOf('|') > -1) {
                ds = ds.split('|')[1];
            } else {
                isOldDsFormat = true;
            }
            $template.find('#pointName').text(ds);
            $template.find('#pointAlias').text('loading');

            dsLoadPromise.done(function (rs) {
                var alias;
                if (rs && rs.length) {
                    alias = rs[0].alias;
                }

                if (isOldDsFormat) {
                    $template.find('#pointName').text(rs[0].value);
                }

                if (alias && alias !== rs[0].value) {
                    $template.find('#pointAlias').text(rs[0].alias).show();
                }
                // 如果 alias 不存在 或 alias 和 value 一致，则隐藏 alias
                else {
                    $template.find('#pointAlias').text('').hide();
                }
            });

            return $template;
        },
        checkPopoverBoundary: function (container, $popover, pageX, pageY) {
            var $container = $(container),
                offsetX = 10,
                offsetY = 0,
                popoverWidth = $popover.width(),
                popoverHeight = $popover.height(),
                rightX = Math.min(pageX + popoverWidth + offsetX, $container.width() - 5),
                rightY = Math.min(pageY + popoverHeight + offsetY, $container.height() - 5);

            $popover.css({
                left: rightX - popoverWidth + offsetX,
                top: rightY - popoverHeight + offsetY
            })
        }
    };


    exports.TooltipMixin = TooltipMixin;
} (
    namespace('mixins')
));
/** 
 * factory 控件基类
 */

(function (exports) {

    function Widget(parent, layer, model) {
        this.parent = parent;
        this.layer = layer;
        this.painter = this.getPainter();
        this.page = this.getPage();

        this.store = {};
        this.store.model = model;
        this.store.imageModelSet = this.layer.painter.screen.store.imageModelSet;

        this.shape = null;

        this.init();
    }

    Widget.prototype.init = function () {
        this.parent.children.push(this);
        this.bindModelOb();
    };
    
    Widget.prototype.bindModelOb = function () {
        this.store.model.addEventListener('update', this.update, this);
    };

    Widget.prototype.unbindModelOb = function () {
        this.store.model.removeEventListener('update', this.update);
    };

    Widget.prototype.update = function () {};

    Widget.prototype.attach = function () {};
    
    Widget.prototype.detach = function () {};

    Widget.prototype.show = function () {};

    Widget.prototype.getShape = function () {
        return this.shape;
    };

    Widget.prototype.getPage = function () {
        return this.getPainter().getPage();
    };

    Widget.prototype.getPainter = function () {
        return this.layer.painter;
    };

    Widget.prototype.getParent = function () {
        return this.parent;
    };

    Widget.prototype.setParent = function (id) {
        if (id === '') {
            this.parent = this.painter.getRootLayer();
        } else {
            var parent = this.painter.find('#' + id);
            if (parent&&parent.length>0) {
                this.parent = parent[0];
            }
        } 
    };
    Widget.prototype.getTplParams = function(){};
    Widget.prototype.applyTplParams = function(){};

    Widget.prototype.close = function () {
        var groupId;

        // 如果是存在于某个控件组内的，则需要将其从这个控件组内删除掉
        if (typeof this.store.model.groupId === 'function') {
            groupId = this.store.model.groupId();
            if (groupId) {
                group = this.layer.painter.find('#'+groupId)[0];
                if (group) {
                    group.remove(this.store.model);
                }
            }
        }

        this.destroy();
    };

    exports.Widget = Widget;
} (
    namespace('widgets.factory')
));
/** 
 * factory Html 控件基类
 */

(function (exports, SuperClass) {

    var CHROME_MINIMUM_FONT_SIZE = 12;

    function HtmlWidget() {
        SuperClass.apply(this, arguments);

        // 投影到 canvas 图层的阴影图形
        // 每个 html 控件都会在 canvas 图层上有一个投影
        // 这样可以用 canvas 的逻辑进行统一处理
        this.shadowShape = null;
    }

    HtmlWidget.prototype = Object.create(SuperClass.prototype);
    HtmlWidget.prototype.constructor = HtmlWidget;

    +function () {

        this.getCanvasLayer = function () {
            return this.painter.canvasStage;
        };

        // 首次初始化的时候，进行 shadow shape 的绘制
        this.show = function () {
            var model = this.store.model;

            this.shadowShape = new Konva.Shape({
                id: 'ss_' + model._id(),
                name: GUtil.SHADOW_SHAPE_NAME, 
                hitFunc: function(context) {
                    var width = this.getWidth();
                    var height = this.getHeight();

                    context.beginPath();
                    context.rect(0, 0, width, height);
                    context.closePath();
                    context.fillStrokeShape(this);
                }
            });

            // 将映射图形加到 canvas 图层上去
            this.getCanvasLayer().getShape().add(this.shadowShape);
        };

        this.update = function (e) {
            var model = this.store.model;
            // 根据 x, y, w, h 绘制
            this.shadowShape.x(model.x());
            this.shadowShape.y(model.y());
            this.shadowShape.width(model.w());
            this.shadowShape.height(model.h());

            if (e) {
                this.getCanvasLayer().draw();
            }
        };

        // 设置 z-index
        this.setZIndex = function (zIndex) {
            this.shape.style.zIndex = zIndex;
            // 更新 shadow shape 的 z-index
            this.shadowShape.setZIndex(zIndex);
        };

        this.fixZoom = function () {
            var dpr = window.devicePixelRatio;
            var html, fontSize;
            var pattern, matches;
            var factor;

            // 对于放大，不做处理
            if (dpr >= 1) {
                return;
            }

            html = this.shape.innerHTML;
            pattern = /font-size:\s*(\d+)px/mgi;
            matches = pattern.exec(html);
            fontSize = 12;

            if (matches) {
                fontSize = Math.max( 12, parseFloat(matches[1]) );
            }

            factor = fontSize * dpr / CHROME_MINIMUM_FONT_SIZE;
            if (factor < 1) {
                this.shape.style.width = this.store.model.w() / factor + 'px';
                this.shape.style.height = this.store.model.h() / factor + 'px';
                this.shape.style.transform = 'scale(' + factor + ')';
            }
        };

    }.call(HtmlWidget.prototype);

    exports.HtmlWidget = HtmlWidget;
} (
    namespace('widgets.factory'),
    namespace('widgets.factory.Widget')
));
(function (CanvasWidgetMixin) {

    var methods = [
        'points',
        'stroke',
        'strokeWidth',
        'opacity'
    ];

    function CanvasLine(layer, options) {
        this.layer = layer;
        this.shape = new Konva.Line(options);
    }
    CanvasLine.prototype = Mixin({}, CanvasWidgetMixin);
    CanvasLine.prototype.constructor = CanvasLine;

    /** 默认方法 */
    methods.forEach(function (m) {
        CanvasLine.prototype[m] = function () {
            if (typeof this.shape[m] !== 'undefined') {
                return this.shape[m].apply(this.shape, arguments);
            }
        };
    });

    window.widgets = window.widgets || {};
    window.widgets.factory = window.widgets.factory  || {};
    window.widgets.factory.CanvasLine = CanvasLine;

} (window.mixins.CanvasWidgetMixin));
(function (CanvasWidgetMixin) {
    var methods = [
        'position',
        'x',
        'y',
        'offsetX',
        'offsetY',
        'radius',
        'fill'
    ];

    function CanvasCircle(layer, options) {
        this.layer = layer;
        this.options = options;
        this.shape = new Konva.Circle(options);
    }

    CanvasCircle.prototype = Mixin({}, CanvasWidgetMixin);
    CanvasCircle.prototype.constructor = CanvasCircle;

    CanvasCircle.prototype.width = function () {
        return this.options.radius*2;
    };

    CanvasCircle.prototype.height = function () {
        return this.options.radius * 2;
    };

    /** 默认方法 */
    methods.forEach(function (m) {
        CanvasCircle.prototype[m] = function () {
            if (typeof this.shape[m] !== 'undefined') {
                return this.shape[m].apply(this.shape, arguments);
            }
        };
    });

    window.widgets = window.widgets || {};
    window.widgets.factory = window.widgets.factory  || {};
    window.widgets.factory.CanvasCircle = CanvasCircle;

} (window.mixins.CanvasWidgetMixin));
(function (CanvasWidgetMixin) {

    var methods = [
        'x',
        'y',
        'width',
        'height',
        'offsetY',
        'rotation',
        'fill'
    ];

    function CanvasRect(layer, options) {
        this.layer = layer;
        this.options = options;
        this.shape = new Konva.Rect(options);
    }

    CanvasRect.prototype = Mixin({}, CanvasWidgetMixin);
    CanvasRect.prototype.constructor = CanvasRect;

    CanvasRect.prototype.width = function () {
        return this.shape.width();
    };

    CanvasRect.prototype.height = function () {
        return this.shape.height();
    };

    /** 默认方法 */
    methods.forEach(function (m) {
        CanvasRect.prototype[m] = function () {
            if (typeof this.shape[m] !== 'undefined') {
                return this.shape[m].apply(this.shape, arguments);
            }
        };
    });

    window.widgets = window.widgets || {};
    window.widgets.factory = window.widgets.factory  || {};
    window.widgets.factory.CanvasRect = CanvasRect;

} (window.mixins.CanvasWidgetMixin));
(function (Widget, CanvasWidgetMixin) {

    function CanvasImage(layer, model) {
        Widget.apply(this, arguments);
    }

    CanvasImage.prototype = Object.create(Widget.prototype);
    CanvasImage.prototype.constructor = CanvasImage;

    CanvasImage.prototype.init = function () {
        // 兼容一下老数据格式
        this._format();

        Widget.prototype.init.apply(this, arguments);
    };

    CanvasImage.prototype._format = function () {
        //兼容老数据
        var options = this.store.model.option();
        if(typeof this.store.model.isHide === "undefined"){
            this.store.model.property('isHide',0);
        }
        if (options.rotate == undefined) {
            options.rotate = 0;
        }
        if (options.pageId === undefined) {
            options.pageId = '';
        }
        if (options.pageType === undefined) {
            options.pageType = '';
        }
        if (options.float === undefined) {
            options.float = '';
        }
        if(!options.preview){
            options.preview = [];
        }
        this.store.model.option(options);
    };

    CanvasImage.prototype.defaultColor = '#ddd';

    /** override */
    CanvasImage.prototype.show = function () {
        var model = this.store.model;

        this.shape = new Konva.Sprite({
            id: model._id(),
            animations: {
                main: [0, 0, model.w(), model.h()]
            },
            animation: 'main',
            perfectDrawEnabled: false
        });

        this.layer.add(this.shape);

        // 如果图片有链接页面，才绑定事件
        if (model['option.pageId']()) {
            // 添加事件
            this.addEvents();
        }
        
        this.update();
    };

    /** override */
    CanvasImage.prototype.update = function (e, propName) {
        var _this = this;
        var model = this.store.model;
        var options = model.option();
        var imageModel, imageModelId;

        // 坐标变化
        if ( !propName || propName.indexOf('update.x') > -1 ||
            propName.indexOf('update.y') ) {
            this.shape.position({
                x: model.x() + model.w() / 2,
                y: model.y() + model.h() / 2
            });
        }

        // 大小变化
        if ( !propName || propName.indexOf('update.w') > -1 ||
            propName.indexOf('update.h') > -1 ) {
            this.shape.position({
                x: model.x() + model.w() / 2,
                y: model.y() + model.h() / 2
            });
            this.shape.offset({
                x: model.w() / 2,
                y: model.h() / 2
            });
            this.shape.width(model.w());
            this.shape.height(model.h());
        }

        // 图片或枚举更改
        if ( !propName || propName.indexOf('update.option.trigger') > -1 ) {
            imageModelId = options.trigger['default'];
            imageModel = this.store.imageModelSet.findByProperty('_id', imageModelId);
            this.loadImg(imageModel, imageModelId);
        }

        // 图片方向更改
        if ( !propName || propName.indexOf('update.option.rotate') > -1 ) {
            this.shape.rotation(options.rotate);
        }

        // 更新时候的图片变化
        if ( propName && propName.indexOf('update.option.text') > -1 ) {
            if ( this.shape.isRunning() ) {
                this.shape.stop();
                // 这里停止动画后，需要重新置回第一帧
                // 否则在由动画变为图片时，可能会出现图片看不见的问题
                this.shape.frameIndex(0);
            }
            // 如果值为空的话，默认显示透明图片
            if (options.text.value && options.text.value.trim() === '') {
                this.loadImg('transparent');
            } else {
                imageModelId = options.text.value;
                // 判断是否是 object id
                // 这里只简单的判断是否是 24 位
                imageModelId = imageModelId.length === 24 ? imageModelId : options.trigger['default'];
                imageModel = this.store.imageModelSet.findByProperty('_id', imageModelId);
                this.loadImg(imageModel, imageModelId);
            }
        }
        //隐藏与否
        if (!propName || propName.indexOf('update.isHide') > -1) {
            if(this.store.model.isHide()){
                this.detach();
            }else{
                this.attach();
            }
        }

        if (!propName || propName.indexOf('update.layerId') > -1) {
            this.setParent(model.layerId());
        }

        // 仅更新的时候需要再次进行绘制
        if (e) {
            this.layer.draw();
        }
    };

    CanvasImage.prototype.loadImg = function (imageModel, imageModelId) {
        var _this = this;
        var model = this.store.model;
        var options = model.option();
        var promise;

        if (imageModel === 'transparent') {
            _this.shape.image(null);
            return;
        }

        promise = $.Deferred();

        // 没有在项目中找到该图片，需要去服务端重新获取一下
        if (!imageModel) {
            WebAPI.post('/factory/material/getByIds', {
                ids: [imageModelId]
            }).done(function (rs) {
                if (!rs.length) {
                    if (model['option.trigger.default']) {
                        console.warn('can not find material. id: ' + model['option.trigger.default']())
                    } else {
                        console.warn('can not find material. trigger.default is undefined ')
                    }
                    promise.reject();
                    return;
                }
                imageModel = new Model( $.extend(false, {
                    _id: rs[0]._id
                }, rs[0].content) );

                // 加入到 imageModelSet 中去
                _this.store.imageModelSet.append(imageModel);
                promise.resolve();
            });
        } else {
            promise.resolve();
        }

        promise.done(function () {
           GUtil.loadImage(imageModel.url(), function (image) {
                if (imageModel.interval() > 0) {
                    _this.shape.image(image);
                    _this.shape.animations({
                        main: [0, 0, imageModel.pw(), imageModel.h()]
                    });
                    _this.startAnimation(imageModel);
                }
                //如果是普通图片
                else {
                    _this.shape.image(image);
                    _this.shape.animations({
                        main: [0, 0, imageModel.w(), imageModel.h()]
                    });
                }

                _this.shape.rotation(typeof options.rotate !== 'number' ? 0 : options.rotate);
                _this.layer.batchDraw();
            }); 
        });
    };
    // 获取模板中的模板参数
    CanvasImage.prototype.getTplParams = function (data){
        if(data){
            var pattern = /<#\s*(\w*?)\s*#>/mg;
            var match = null;
            var params = [];
            var str = data.option.pageId;
            while( match = pattern.exec(str) ) {
                params.push({
                    name: match[1],
                    value: ''
                });
            }
            return params;
        }
    };
    // 应用
    CanvasImage.prototype.applyTplParams = function (data){
        if(data){
            var reg = data.reg;
            var strNew = data.strNew;
            var widget = data.widget;
            widget.option.pageId = widget.option.pageId.replace(reg, strNew);
            return widget;
        }
    };

    CanvasImage.prototype.transparent = function () {};

    CanvasImage.prototype.startAnimation = function () {};

    CanvasImage.prototype.stopAnimation = function () {};

    CanvasImage.prototype.addEvents = function () {};

    CanvasImage.prototype = Mixin(CanvasImage.prototype, CanvasWidgetMixin);

    // 图片控件需要支持旋转，所以中心点是图片的重心，不再是左上角，这里需要标识一下
    CanvasImage.prototype.isOffsetCenter = true;

    window.widgets = window.widgets || {};
    window.widgets.factory = window.widgets.factory  || {};
    window.widgets.factory.CanvasImage = CanvasImage;

} (window.widgets.factory.Widget, window.mixins.CanvasWidgetMixin));
(function (facCanvasImage) {

    function CanvasImage(layer, model) {
        facCanvasImage.apply(this, arguments);
    }

    CanvasImage.prototype = Object.create(facCanvasImage.prototype);
    CanvasImage.prototype.constructor = CanvasImage;

    CanvasImage.prototype.defaultColor = 'transparent';

    CanvasImage.prototype.transparent = function (imageModel) {
        imageModel.url('');
    };

    /** @override */
    CanvasImage.prototype.startAnimation = function (imageModel) {
        this.shape.animations({
            main: imageModel.list()
        });
        this.shape.frameRate( Math.round(1000/imageModel.interval()) );
        this.shape.start();
    };

    /** @override */
    CanvasImage.prototype.stopAnimation = function () {
        this.shape.stop();
    };

    CanvasImage.prototype.showS3dbModal = function (pageId, title) {
        if (ScreenModal) ScreenModal.close();
        ScreenModal = new ObserverScreen(pageId);
        title && (ScreenModal.title = title);
        ScreenModal.isDetailPage = true;
        ScreenModal.show();
    };

    CanvasImage.prototype.addEvents = function () {
        var _this = this;
        var tpl = '<div class="modal fade" id="buttonModal" style="display:none;">\
            <div class="modal-dialog" style="width: 80%; height: calc(100% - 60px);">\
                <div class="modal-content" style="width: 100%;height: 100%;border: none;">\
                    <div class="modal-header" style="border-bottom:0;height:0;min-height: 0;padding:0;">\
                        <button type="button" class="close" data-dismiss="modal" style="position:absolute;top:7px;\
                        right:5px;z-index:2;width:25px;height:25px;border-radius:12.5px;background:#fff;padding-bottom:2px;">\
                        <span aria-hidden="true">&times;</span></button>\
                    </div>\
                    <div class="modal-body" style="padding:0;width: 100%;height: 100%;overflow:hidden;z-index:1;"></div>\
                </div>\
            </div>\
        </div>';

        var w = this.shape.attrs.width;
        var h = this.shape.attrs.height;
        var x = this.shape.attrs.x;
        var y = this.shape.attrs.y;
        
        this.shape.on('mouseover', function () {
            _this.page.painterCtn.style.cursor = 'pointer';
            _this.shape.scale({
                x: 1.1,
                y: 1.1
            });

            _this.layer.draw();
        });

        this.shape.on('mouseout', function () {
            _this.page.painterCtn.style.cursor = 'default';
            _this.shape.scale({
                x: 1,
                y: 1
            });

            _this.layer.draw();
        });

        this.shape.on('click', function () {
            var options = _this.store.model.option();
            var pageId = options.pageId;
            var pageType = options.pageType;
            var screens = namespace('observer.screens');
            var $modal;
            var floatScreen;
            var v = localStorage.getItem('preview');
            if (!pageId || (pageId.indexOf('<#')>-1 && pageId.indexOf('#>')>-1)) {
                return;
            }
            //点名预览模式下  先清掉click事件
            if(v==='2'){
                return;
            }
            if (pageType === 's3db') {
                // 处理 s3db 页面
                if (AppConfig.isFactory) {
                    alert('s3db 页面只支持在主网站中进行查看!');
                } else {
                    // 重置一下鼠标，因为页面切换的时候，可能图片的 mouseout 事件不会被触发，导致鼠标未还原
                    _this.page.painterCtn.style.cursor = 'default';
                    if (options.float === 1) {
                        _this.showS3dbModal(pageId);
                    } else {
                        _this.page.close();
                        Spinner.spin(ElScreenContainer);
                        ScreenManager.goTo({
                            page: 'ObserverScreen',
                            id: pageId
                        }); 
                    }
                }
                return;
            } else {
                if (options.float === 1) {
                    $modal = $(tpl);
                    $modal.appendTo(document.body);

                    $modal.one('shown.bs.modal',function () {
                        floatScreen = new screens[pageType || 'PageScreen']({
                            id: pageId,
                            isFactory: AppConfig.isFactory
                        }, $('.modal-body', $modal)[0]);

                        floatScreen.show();
                    });
                    $modal.one('hidden.bs.modal',function () {
                        floatScreen && floatScreen.close();
                        $modal.remove();
                    });

                    WebAPI.get('/factory/page/'+pageId).done(function (rs) {
                        var $modalDialog = $modal.find('.modal-dialog');
                        var page;
                        if (rs.status !== 'OK') {
                            return;
                        }
                        page = rs.data;
                        if (page.display === 1) {
                            $modalDialog.width(page.width);
                            $modalDialog.height(page.height+30);
                        }
                        $modal.modal('show');
                    });
                    
                } else {
                    floatScreen = new screens[pageType || 'PageScreen']({
                        id: pageId,
                        isFactory: AppConfig.isFactory
                    }, _this.page.painterCtn);

                    // 重置一下鼠标，因为页面切换的时候，可能图片的 mouseout 事件不会被触发，导致鼠标未还原
                    _this.page.painterCtn.style.cursor = 'default';

                    // 辞旧迎新
                    _this.page.close();
                    floatScreen.show();
                }
            }
        });
    };

    //覆盖window.widgets.factory.CanvasImage
    window.widgets.factory.CanvasImage = CanvasImage;

} (window.widgets.factory.CanvasImage));
/////////////////////////////////
/// CanvasPipeShape DEFINITION //
/////////////////////////////////
(function (CanvasLine, CanvasCircle, CanvasRect) {

    function CanvasPipeShape(layer, options) {
        this.layer = layer;
        this.options = options;

        // 当前图形的位置和大小信息
        this.shapeInfo = null;

        this.line = null;
        this.joins = [];
        this.rects = [];
        this.rectsEx = [];

        this.moves = [];
        this.anim = null;
        this.animationOptions = {
            speed: 50
        }
    }

    CanvasPipeShape.prototype.CIRCLE_RADIUS = 10;
    CanvasPipeShape.prototype.BEND_Length = 17;

    CanvasPipeShape.prototype.paint = function (isActive) {
        var x, y;
        var points = this.options.points;
        var color = this.options.color;
        var width = this.options.width;
        var id = this.options._id;
        var rotation = 0;
        //节点颜色处理
        var deepColor = (function (rgb) {
            var r, g, b, ds;
            if (rgb.charAt(0) == '#') {
                r = rgb.substring(1, 3);
                g = rgb.substring(3, 5);
                b = rgb.substring(5, 7);
                r = parseInt(r, 16);
                g = parseInt(g, 16);
                b = parseInt(b, 16);
            } else {
                ds = rgb.split(/\D+/);
                r = Number(ds[1]);
                g = Number(ds[2]);
                b = Number(ds[3]);
            }
            r = Math.round(0.8 * r);
            g = Math.round(0.8 * g);
            b = Math.round(0.8 * b);

            return 'rgb('+r+','+g+','+b+')';
        })(color);
        //弯头宽度 = 管道宽度 + 4px;
        if(width && Number(width)){
            this.CIRCLE_RADIUS = Number(width) / 2;
            this.BEND_Length = this.CIRCLE_RADIUS * 1.4;
        }

        // 不存在，则进行创建
        if (!this.line) {
            this.line = new CanvasLine(this.layer, {
                id: id,
                name: 'pipe-line pipe-' + id,
                lineJoin: 'round',
                perfectDrawEnabled: false
                        
                //20160526 Neil: 谁搞定渐变，我请吃饭
                //fillLinearGradientStartPoint: { x: this.options.points[0].x, y: this.options.points[0].y },
                //fillLinearGradientEndPoint: { x: this.options.points[0].x, y: this.options.points[1].y },
                //fillLinearGradientColorStops: [0, 'red', 0.5, 'blue', 1, 'green'],
                //fillPriority: 'linear-gradient',
            });

            for (var i = 0, len = points.length; i < len; i+=1) {
                // 添加圆形连接点
                this.joins.push(new CanvasCircle(this.layer, {
                    id: 'pipejoin_'+id,
                    name: 'pipe-joint pipe-joint-circle pipe-'+id,
                    fill: '#888',
                    perfectDrawEnabled: false
                }));

                // 添加方形管道入口/出口
                if (i - 1 > -1) {
                    this.rects.push(new CanvasRect(this.layer, {
                        id: id+'_r_f_'+i,
                        name: 'pipe-joint pipe-joint-rect',
                        fill: '#888',
                        perfectDrawEnabled: false
                    }));
                    this.rectsEx.push(new CanvasRect(this.layer, {
                        id: id+'_r_e_f_'+i,
                        name: 'pipe-joint pipe-joint-rectEx',
                        fill: '#888',
                        perfectDrawEnabled: false
                    }));
                }

                if (i + 1 < len) {
                    this.rects.push(new CanvasRect(this.layer, {
                        id: id+'_r_b_'+i,
                        name: 'pipe-joint-rect',
                        fill: '#888',
                        perfectDrawEnabled: false
                    }));
                    this.rectsEx.push(new CanvasRect(this.layer, {
                        id: id+'_r_e_f_'+i,
                        name: 'pipe-joint pipe-joint-rectEx',
                        fill: '#888',
                        perfectDrawEnabled: false
                    }));
                }
            }
        }

        // 更新 - 开始
        this.line.points( (function (points) {
            var arr = [];
            points.forEach(function (row) {
                arr.push(row.x);
                arr.push(row.y);
            });
            return arr;
        }(points)) );
        this.line.stroke(color ? color : 'rgba(0, 114, 201, .7)');
        this.line.strokeWidth(width ? width : 14);
        this.line.opacity(isActive===undefined ? 1 : (isActive?1:0.7));

        for (var i = 0, len = points.length; i < len; i += 1) {
            // 圆形连接点
            this.joins[i].x(points[i].x - this.CIRCLE_RADIUS);
            this.joins[i].y(points[i].y - this.CIRCLE_RADIUS);
            this.joins[i].offsetX(-this.CIRCLE_RADIUS);
            this.joins[i].offsetY(-this.CIRCLE_RADIUS);
            this.joins[i].radius(this.CIRCLE_RADIUS);
            this.joins[i].fill(deepColor ? deepColor : 'rgba(0, 114, 201, .7)');

            // 方形管道入口/出口
            if (i - 1 > -1) {
                rotation = Math.atan2(points[i-1].y-points[i].y, points[i-1].x-points[i].x) * GUtil.DEG;
                this.rects[i].x(points[i].x);
                this.rects[i].y(points[i].y);
                this.rects[i].width(this.BEND_Length*1.5);
                this.rects[i].height(this.CIRCLE_RADIUS * 2);
                this.rects[i].offsetY(this.CIRCLE_RADIUS);
                this.rects[i].rotation(rotation);
                this.rects[i].fill(deepColor ? deepColor : 'rgba(0, 114, 201, .7)');

                this.rectsEx[i].x(points[i].x);
                this.rectsEx[i].y(points[i].y);
                this.rectsEx[i].width(this.BEND_Length/2.2);
                this.rectsEx[i].height(this.CIRCLE_RADIUS * 2 * 1.2);
                this.rectsEx[i].offsetY(this.CIRCLE_RADIUS * 1.2);
                this.rectsEx[i].offsetX(-this.BEND_Length*1.1);
                this.rectsEx[i].rotation(rotation);
                this.rectsEx[i].fill(deepColor ? deepColor : 'rgba(0, 114, 201, .7)');
            }

            if (i + 1 < len) {
                rotation = Math.atan2(points[i+1].y-points[i].y, points[i+1].x-points[i].x) * GUtil.DEG;
                this.rects[i].x(points[i].x);
                this.rects[i].y(points[i].y);
                this.rects[i].width(this.BEND_Length*1.5);
                this.rects[i].height(this.CIRCLE_RADIUS * 2);
                this.rects[i].offsetY(this.CIRCLE_RADIUS);
                this.rects[i].rotation(rotation);
                this.rects[i].fill(deepColor ? deepColor : 'rgba(0, 114, 201, .7)');

                this.rectsEx[i].x(points[i].x);
                this.rectsEx[i].y(points[i].y);
                this.rectsEx[i].width(this.BEND_Length/2.2);
                this.rectsEx[i].height(this.CIRCLE_RADIUS * 2 * 1.2);
                this.rectsEx[i].offsetY(this.CIRCLE_RADIUS * 1.2);
                this.rectsEx[i].offsetX(-this.BEND_Length*1.1);
                this.rectsEx[i].rotation(rotation);
                this.rectsEx[i].fill(deepColor ? deepColor : 'rgba(0, 114, 201, .7)');
            }
        }

        if (isActive) {
            this.addAnimation();
        } else {
            this.removeAnimation();
        }

        this.shapeInfo = GUtil.getPipeRect(points);
    };

    CanvasPipeShape.prototype.addAnimation = function () {
        var _this = this;
        var options = this.options;
        var points = options.points;
        var pipeAnimation = options.pipeAnimation;
        var distance;

        // 若已存在，则不再继续
        if (this.moves && this.moves.length) {
            return;
        }

        distance = GUtil.getDistance(points[0], points[1]);
        var w,s;
        var direction = (options.direction === 0 ? 1 : -1);
        // 添加动画
        this.anim = new Konva.Animation(function (frame) {
            var item = _this.moves[0];
            var prograss = (frame.time % s) / s;
            var d = w * prograss * direction;

            item.fillPatternX(d);
        }, _this.layer.shape);

        GUtil.loadImage('/static/images/factory/widget/pop_'+(pipeAnimation+1)+'.png', function (image) {
            var scale = options.width / image.height;
            w = image.width*scale;
            s = w / _this.animationOptions.speed * 1000;
            var radian = Math.atan2(points[1].y - points[0].y, points[1].x - points[0].x);
            var widget = new Konva.Image({
                //x、y坐标为 {x + (管道以中轴定点旋转/图片以左下角旋转 的差值) - 弯头长度}
                x: points[0].x + options.width * Math.cos(radian - Math.PI / 2) / 2 + _this.BEND_Length * Math.cos(radian)*1.8,//*1.8是为了让动画的初出点在接口处
                y: points[0].y + options.width * Math.sin(radian - Math.PI / 2) / 2 + _this.BEND_Length * Math.sin(radian)*1.8,//*1.8是为了让动画的初出点在接口处
                fillPatternImage: image,
                width: distance - 2 * _this.BEND_Length*1.8,//*1.8是为了让动画的消失点在接口处
                height: options.width-1,
                fillPatternScale: { x: scale, y: scale },//*缩放图片
                fillPatternRepeat: 'repeat-x',
                fillPriority: 'pattern',
                rotation: radian * 180 / Math.PI,
                perfectDrawEnabled: false
            });

            _this.moves.push(widget);
            _this.layer.add(widget);
            //_this.layer.draw();
            _this.anim.start();
        });
    };

    CanvasPipeShape.prototype.removeAnimation = function () {
        this.moves.forEach(function (row) {
            row.destroy();
        });
        this.moves = [];
        if (this.anim) this.anim.stop();
    };

    CanvasPipeShape.prototype.updatePoints = function (points) {
        this.options.points = points;
        this.paint();
    };

    CanvasPipeShape.prototype.toArray = function () {
        var shapes = [];
        shapes.push(this.line);
        shapes = shapes.concat(this.moves);
        shapes = shapes.concat(this.rects).concat(this.joins).concat(this.rectsEx);
        return shapes;
    };

    CanvasPipeShape.prototype.id = function () {
        return this.options._id;
    };

    CanvasPipeShape.prototype.remove = function () {
        this.joins.forEach(function(row){
            row.shape.remove();
        });
        this.rects.forEach(function(row){
            row.shape.remove();
        });
        this.rectsEx.forEach(function(row){
            row.shape.remove();
        });
        this.line.shape.remove();
    };
    /** @override */
    CanvasPipeShape.prototype.setZIndex = function (zIndex) {
        this.line.shape.setZIndex(zIndex++);
        this.moves.forEach(function (row) {
            row.setZIndex(zIndex++);
        });
        this.rects.forEach(function (row) {
            row.shape.setZIndex(zIndex++);
        });
        this.joins.forEach(function (row) {
            row.shape.setZIndex(zIndex++);
        });
        this.rectsEx.forEach(function (row) {
            row.shape.setZIndex(zIndex++);
        });
        return zIndex;
    };

    /** @override */
    CanvasPipeShape.prototype.getZIndex = function () {
        return this.line.getZIndex();
    };

    /** @override */
    CanvasPipeShape.prototype.getAbsolutePosition = function () {
        var painter = this.layer.painter;
        return painter.inverseTransform({
            x: this.shapeInfo.xMin,
            y: this.shapeInfo.yMin
        });
    };

    CanvasPipeShape.prototype.moveToBottom = function () {};

    CanvasPipeShape.prototype.isVisible = function () {
        return this.line.isVisible();
    };

    CanvasPipeShape.prototype.show = function () {
        this.joins.forEach(function(row){
            row.shape.show();
        });
        this.rects.forEach(function(row){
            row.shape.show();
        });
        this.rectsEx.forEach(function(row){
            row.shape.show();
        });
        this.line&&this.line.shape.show();
    };

    CanvasPipeShape.prototype.hide = function () {
        this.joins.forEach(function(row){
            row.shape.hide();
        });
        this.rects.forEach(function(row){
            row.shape.hide();
        });
        this.rectsEx.forEach(function(row){
            row.shape.hide();
        });
        this.line.shape.hide();
    };

    CanvasPipeShape.prototype.destroy = function () {
        if (this.line) this.line.shape.destroy();
        this.joins.forEach(function (row) {
            row.shape.destroy();
        });
        
        this.rects.forEach(function (row) {
            row.shape.destroy();
        });

        this.rectsEx.forEach(function (row) {
            row.shape.destroy();
        });

        this.moves.forEach(function (row) {
            row.destroy();
        });
        this.moves = [];
        this.line = null;
        this.joins = [];
        this.rects = [];

        if (this.anim) this.anim.stop();
    };

    window.widgets = window.widgets || {};
    window.widgets.factory = window.widgets.factory  || {};
    window.widgets.factory.CanvasPipeShape = CanvasPipeShape;

} ( window.widgets.factory.CanvasLine,
    window.widgets.factory.CanvasCircle,
    window.widgets.factory.CanvasRect));
(function (exports, Widget, CanvasWidgetMixin, CanvasPipeShape) {

    ////////////////////////////
    /// CanvasPipe DEFINITION //
    ////////////////////////////
    function CanvasPipe(layer, model) {
        Widget.apply(this, arguments);

        this.children = [];
    }

    CanvasPipe.prototype = Object.create(Widget.prototype);
    CanvasPipe.prototype.constructor = CanvasPipe;

    CanvasPipe.prototype.init = function () {
        // 兼容一下老数据格式
        this._format();

        Widget.prototype.init.call(this);
    };

    CanvasPipe.prototype._format = function () {
        var options = this.store.model.option();
        var points = options.points, pArr = [];
        if(typeof this.store.model.isHide === "undefined"){
            this.store.model.property('isHide',0);
        }
        if (typeof points[0] === 'number') {
            for (var i = 0, len = points.length; i < len; i += 2) {
                pArr.push({
                    x: points[i],
                    y: points[i+1],
                    join: 1
                });
            }
            options.points = pArr;
        }
        if(!options.direction){
            options.direction = 0;
        }
        if(!options.preview){
            options.preview = [];
            var arr = this.store.model.idDs();
            for(var i = 0,len = arr.length;i<len;i++){
                options.preview.push('');
            }
        }
        if(!options.logic){
            options.logic = 0;
        }

        if (!options.pipeAnimation) {
            options.pipeAnimation = 0;
        }

        this.store.model.option(options);
    };

    /** override */
    CanvasPipe.prototype.show = function () {
        var _this = this;
        var model = this.store.model;
        var initPos = {};
        //var points = model.option().points;
        var option = model.option();
        this.shape = new CanvasPipeShape(this.layer, {
            _id: model._id(),
            points: option.points,
            color: option.color,
            width: option.width,
            direction: option.direction,
            pipeAnimation: option.pipeAnimation
        });
        this.update();
        this.children = this.shape.toArray();
        this.layer.add(this.children.map(function (row) {
            return row.shape;
        }));
    };

    /** override */
    CanvasPipe.prototype.update = function (e, propType) {
        var model = this.store.model;
        var option = model.option();
        var points = option.points;
        var info, dx, dy, pw, ph;

        if (!propType || propType.indexOf('update.idDs') > -1) {
            if ($.fn.zTree) {
                var treeObj = $.fn.zTree.getZTreeObj('parentTree');
            }
            if (treeObj) {
                var node = treeObj.getNodeByParam('modelId', model._id());
                if (node && model.idDs) {
                    var idDs = model.idDs();
                    var name;
                    if (idDs.length > 0) {
                        name = idDs[0];
                        name !== node.name && (node.name = name, treeObj.updateNode(node));
                    } else {
                        node.name = I18n.resource.mainPanel.layerName.PIPE;
                        treeObj.updateNode(node);
                    }
                }
            }
        }
        // 颜色或者宽度更新时, 需要更新 color
        if( propType && propType.indexOf('update.option') > -1 ){
            this.shape.options.color = option.color;
            this.shape.options.pipeAnimation = option.pipeAnimation;
            this.shape.options.width = option.width;
            this.shape.options.points = option.points;
        }
        this.shape.paint();
        //更新 isHide
        if (!propType || propType.indexOf('update.isHide') > -1) {
            if(this.store.model.isHide()){
                this.detach();
            }else{
                this.attach();
            }
        }
        if (!propType || propType.indexOf('update.layerId') > -1) {
            this.setParent(model.layerId());
        }
        // 仅更新的时候需要再次进行绘制
        if (e) {
            this.layer.draw();
        }
    };

    CanvasPipe.prototype = Mixin(CanvasPipe.prototype, CanvasWidgetMixin);

    CanvasPipe.prototype.hasShape = function (shape) {
        return this.children.some(function (row) {
            return shape === row.shape;
        });
    };

    CanvasPipe.prototype.width = function () {
        return 0;
    };

    CanvasPipe.prototype.height = function () {
        return 0;
    };

    /** override */
    CanvasPipe.prototype.position = function () {
        return {
            x: 0,
            y: 0
        };
    };

    CanvasPipe.prototype.getType = function () {
        return 'Pipe';
    };

    CanvasPipe.prototype.getPoints = function () {
        return this.store.model['option.points']();
    };

    CanvasPipe.prototype.getRadius = function () {
        return this.shape.CIRCLE_RADIUS;
    };

    exports.CanvasPipe = CanvasPipe;
} (
    namespace('widgets.factory'),
    namespace('widgets.factory.Widget'),
    namespace('mixins.CanvasWidgetMixin'),
    namespace('widgets.factory.CanvasPipeShape') ));
﻿(function (exports) {

    function CanvasHeatC() {
        this.canvsdpalette = undefined;
        this._max = 1;
        this._data = undefined;
    }

    CanvasHeatC.prototype = {

        defaultRadius: 8,

        defaultGradient: {
            //0: 'blue',
            //0.25: 'cyan',
            //0.5: 'lime',
            //0.75: 'yellow',
            //1.0: 'red'
            0: '#016600',
            1.0: '#e19f20'
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

        color: function () {
            if (!this._grad) {
                this.gradient(this.defaultGradient);
            }

            var pAlpha, shadowColor;

            var a = 1 / (this._max - this._min),
                b = this._min / (this._min - this._max),
                c = (this._max - this._min) / 2;

            // draw a grayscale heatmap by putting a blurred circle at each data point
            var temp = this._data;

            //if (temp < this._max && temp > this._min) {
            //    pAlpha = (c - Math.abs(temp - this._min - c)) / c;
            //    pAlpha = pAlpha < 0.5 ? pAlpha * 0.4 : pAlpha * 0.9;
            //} else {
            //    pAlpha = 0.9;
            //}
            var intTemp = parseInt(temp), x = intTemp - this._min, j, color;
            j = x < 0 ? 0 : parseInt(256 * a * x) * 4;
            if (j >= 1024) j = 1020;

            //var a = this._max - this._min;
            //this._max += a/2;
            //this._min -= a/2;
            //var j;
            //if (temp <= this._min) {
            //    j = 0;
            //} else if (temp >= this._max) {
            //    j = 1020;
            //} else {
            //    var b = (temp-this._min) / (a * 2);
            //    j = parseInt(b * 256) * 4;
            //}
            //console.log(j)
            

            // create a grayscale blurred circle image that we'll use for drawing points
            shadowColor = 'rgb(' + this._grad[j] + ', ' + this._grad[j + 1] + ', ' + this._grad[j + 2]+ ')';

            return shadowColor;
        },
        destroy: function () {
            this._data = null;
            this._canvas = null;
        }
    };
    exports.CanvasHeatC = CanvasHeatC;
    
}(namespace('widgets.factory')));


//(function (exports) {

//    function CanvasHeatC(canvas) {
//        if (canvas) {
//            if (!(this instanceof CanvasHeatC)) {
//                return new CanvasHeatC(canvas);
//            }

//            this._canvas = canvas = typeof canvas === 'string' ? document.getElementById(canvas) : canvas;
//            this.canvsdpalette = undefined;
//            this._ctx = canvas.getContext('2d');
//            this._width = canvas.width;
//            this._height = canvas.height;

//            this._max = 1;
//            this._data = [];
//        }
//    }

//    CanvasHeatC.prototype = {

//        defaultRadius: 100,

//        defaultGradient: {
//            0: 'blue',
//            0.25: 'cyan',
//            0.5: 'lime',
//            0.75: 'yellow',
//            1.0: 'red'
//        },

//        data: function (data) {
//            this._data = data;
//            return this;
//        },

//        max: function (max) {
//            this._max = max;
//            return this;
//        },

//        min: function (min) {
//            this._min = min;
//            return this;
//        },

//        add: function (point) {
//            this._data.push(point);
//            return this;
//        },

//        showColor: function (data, minOpacity) {
//            return this.getColor(data, minOpacity);
//        },

//        clear: function () {
//            this._data = [];
//            return this;
//        },

//        gradient: function (grad) {
//            // create a 256x1 gradient that we'll use to turn a grayscale heatmap into a colored one
//            this.canvsdpalette = document.createElement('canvas');
//            var ctx = this.canvsdpalette.getContext('2d');
//            this.canvsdpalette.width = 1;
//            this.canvsdpalette.height = 256;

//            var gradient = ctx.createLinearGradient(0, 0, 0, 256);
//            for (var i in grad) {
//                gradient.addColorStop(i, grad[i]);
//            }
//            ctx.save();
//            ctx.globalAlpha = 1;
//            ctx.fillStyle = gradient;
//            ctx.fillRect(0, 0, 1, 256);
//            ctx.restore();

//            this._grad = ctx.getImageData(0, 0, 1, 256).data;
            
//            return this;
//        },

//        draw: function (minOpacity) {
//            if (!this._grad) {
//                this.gradient(this.defaultGradient);
//            }

//            var ctx = this._ctx, pAlpha;

//            //ctx.clearRect(0, 0, this._width, this._height);
//            var a = 1 / (this._max - this._min), b = this._min / (this._min - this._max), c = (this._max - this._min) / 2;

//            // draw a grayscale heatmap by putting a blurred circle at each data point
//            for (var i = 0, len = this._data.length, p, temp; i < len; i++) {
//                p = this._data[i], temp = p[2];
//                if (temp == 0) continue;

//                if (temp < this._max && temp > this._min) {
//                    pAlpha = (c - Math.abs(temp - this._min - c)) / c;
//                    pAlpha = pAlpha < 0.5 ? pAlpha * 0.4 : pAlpha * 0.9;
//                } else {
//                    pAlpha = 0.9;
//                }

//                var r = this.defaultRadius;
//                var blur = blur || 30;

//                // create a grayscale blurred circle image that we'll use for drawing points
//                var circle = document.createElement('canvas'),
//                    ctxCircle = circle.getContext('2d'),
//                    r2 = this._r = r + blur;

//                circle.width = circle.height = r2 * 2;

//                ctxCircle.save();
//                ctxCircle.shadowOffsetX = ctxCircle.shadowOffsetY = 200;
//                ctxCircle.shadowBlur = blur;

//                var intTemp = parseInt(temp), x = intTemp - this._min, j, color;
//                j = x < 0 ? 0 : parseInt(256 * a * x) * 4;
//                if (j >= 1024) j = 1020;

//                ctxCircle.shadowColor = ctxCircle.fillStyle = 'rgba(' + this._grad[j] + ', ' + this._grad[j + 1] + ', ' + this._grad[j + 2] + ', ' + Math.max(minOpacity, pAlpha) + ')';

//                ctxCircle.beginPath();
//                ctxCircle.arc(r2 - 200, r2 - 200, r, 0, Math.PI * 2, true);
//                ctxCircle.closePath();
//                ctxCircle.fill();
//                ctxCircle.restore();

//                //ctx.globalAlpha = Math.max(minOpacity, pAlpha);
//                ctx.drawImage(circle, p[0] - this._r, p[1] - this._r);

//                ctxCircle = null;
//                circle = null;
//            }

//            return this;
//        },

//        getColor: function (data,minOpacity) {
//            if (!this._grad) {
//                this.gradient(this.defaultGradient);
//            }

//            var pAlpha, color;

//            var a = 1 / (this._max - this._min),
//                b = this._min / (this._min - this._max),
//                c = (this._max - this._min) / 2;
//            var temp = data;

//            if (temp < this._max && temp > this._min) {
//                pAlpha = (c - Math.abs(temp - this._min - c)) / c;
//                pAlpha = pAlpha < 0.5 ? pAlpha * 0.4 : pAlpha * 0.9;
//            } else {
//                pAlpha = 0.9;
//            }
//            var intTemp = parseInt(temp), x = intTemp - this._min, j;
//            j = x < 0 ? 0 : parseInt(256 * a * x) * 4;
//            if (j >= 1024) j = 1020;

//            color = 'rgba(' + this._grad[j] + ', ' + this._grad[j + 1] + ', ' + this._grad[j + 2] + ', ' + Math.max(minOpacity, pAlpha) + ')';

//            return color;
//        },
        
//        destroy: function () {
//            this._data = null;
//            this._canvas = null;
//        }
//    };
//    window.CanvasHeatC = CanvasHeatC
//    exports.CanvasHeatC = CanvasHeatC;
//}(namespace('widgets.factory')));
﻿(function (exports, Widget, CanvasWidgetMixin, CanvasHeatC) {
    var _this;
    function CanvasHeat(layer, model) {
        Widget.apply(this, arguments);
        this.children = [];
        this.shape = undefined;
        _this = this;
    }

    CanvasHeat.prototype = Object.create(Widget.prototype);
    CanvasHeat.prototype.constructor = CanvasHeat;

    CanvasHeat.prototype.init = function () {
        // 兼容一下老数据格式
        this._format();

        Widget.prototype.init.apply(this, arguments);
    };

    CanvasHeat.prototype._format = function () {
        if(typeof this.store.model.isHide === "undefined"){
            this.store.model.property('isHide',0);
        }
    };

    /** override */
    CanvasHeat.prototype.show = function (isS) {
        //isS  true表示预览  false表示非预览
        var _this = this;
        var model = this.store.model;
        var option = model.option();
        var id = model._id(),
            points = option.points,
            color = option.color;

        if (isS) {
            var num = 0;
            var isNoOne = true;
            this.shape = new Konva.Line({
                id: id,
                name: 'heat-line heat-' + id,
                points: points,
                closed: true,
                stroke: '#fff',
                strokeWidth: 0.1,
                opacity: 0.1,
                lineJoin: 'bevel',
                visible: true,
                perfectDrawEnabled: false
            });
            this.layer.add(this.shape);
            this.layer.draw();

        } else {
            this.shape = new Konva.Line({
                id: id,
                name: 'heat-line heat-' + id,
                points: points,
                closed: true,
                stroke: '#111',
                strokeWidth: 1,
                lineJoin: 'bevel',
                visible: true
            });
            this.layer.add(this.shape);
        }

        this.update();
    };

    /** override */
    CanvasHeat.prototype.update = function (e, propType) {
        var model = this.store.model;
        var option = model.option();
        var tempPointId = option.tempPointId;
        // points 更新时，需要重新进行绘制
        if (propType && propType.indexOf('update.option.points') > -1) {
            this.shape.points(option.points);
            var heatPoint = this.painter.store.widgetModelSet.findByProperty('_id', tempPointId);

            heatPoint&&heatPoint['option.polygonArr'](option.points);
        }
        if (propType && propType.indexOf('update.option.color') > -1) {
            this.shape.fill(option.color);
            this.shape.opacity(0.5);
        }
        //更新 isHide
        if (!propType || propType.indexOf('update.isHide') > -1) {
            if(this.store.model.isHide()){
                this.detach();
            }else{
                this.attach();
            }
        }

        if (!propType || propType.indexOf('update.layerId') > -1) {
            this.setParent(model.layerId());
        }

        this.layer.draw();   
    };

    CanvasHeat.prototype = Mixin(CanvasHeat.prototype, CanvasWidgetMixin);

    CanvasHeat.prototype.width = function () {
        return 0;
    };

    CanvasHeat.prototype.height = function () {
        return 0;
    };

    CanvasHeat.prototype.position = function () {
        return {
            x: 0,
            y: 0
        };
    };

    CanvasHeat.prototype.getType = function () {
        return 'Combine';
    };
    CanvasHeat.prototype.moveToBottom = function () {
        
    };
    CanvasHeat.prototype.getPoints = function () {
        return this.store.model['option.points']();
    };

    CanvasHeat.prototype.tools = {
        //坐标系转换
        _transformPoints: function (points, inverse) {
            var p;
            inverse = typeof inverse === 'undefined' ? false : inverse;
            for (var i = 0, len = points.length; i < len; i += 2) {
                p = _this.painter[inverse ? 'inverseTransform' : 'transform']({
                    x: points[i],
                    y: points[i + 1]
                });
                points[i] = p.x;
                points[i + 1] = p.y;
            }
            return points;
        }
    };

    exports.CanvasHeat = CanvasHeat;

}(
    namespace('widgets.factory'),
    namespace('widgets.factory.Widget'),
    namespace('mixins.CanvasWidgetMixin'),
    namespace('widgets.factory.CanvasHeatC')
));
﻿(function (exports, Widget, CanvasWidgetMixin, CanvasHeatC,TooltipMixin) {
    var _this;
    function CanvasHeatP(layer, model) {
        Widget.apply(this, arguments);
        this.text = undefined;
        this.children = [];
        this.rect = undefined;
        _this = this;
        //this.init();
    }

    CanvasHeatP.prototype = Object.create(Widget.prototype);
    CanvasHeatP.prototype.constructor = CanvasHeatP;

    CanvasHeatP.prototype.init = function () {
        this._format();
        Widget.prototype.init.apply(this, arguments);
    };
    CanvasHeatP.prototype._format = function () {
        //兼容老数据
        var options = this.store.model.option();
        if(typeof this.store.model.isHide === "undefined"){
            this.store.model.property('isHide',0);
        }
        if (!options.preview) {
            options.preview = [];
        }
        this.store.model.option(options);
    };
    /** override */
    CanvasHeatP.prototype.show = function (isS) {
        //isS  true表示预览  false表示非预览
        _this = this;
        var model = this.store.model;
        var option = model.option();
        
        var width = height = option.radius * 2,
            color = option.fill,
            id = model._id(),
            x = model.x(),
            y = model.y();

        if (isS) {
            var fontSize = option.fontSize,
                unitType = option.unitType;
            width = width * 2 + Number(fontSize);
            var polygonArr = option.polygonArr;
            var polygonId = option.polygonId;
            
            this.shape = new Konva.Text({
                id: id,
                name: 'heat-circle hc_' + id,
                text: '--',
                fontSize: fontSize,
                fontFamily: 'Calibri',
                fill: color,
                fontStyle: 'bold',
                width: width,
                height: fontSize,
                x: x-fontSize/2,
                y: y,
                align: 'center',
                stroke: 'black',
                strokeEnabled: false,
                strokeWidth: 0,
                align: 'center',
                padding: (height - fontSize) / 2
            });
            
        } else {
            this.shape = new Konva.Rect({
                id: id,
                name: 'heat-circle hc_' + id,
                x: x,
                y: y,
                width: width,
                height: height,
                fill: 'green',
                stroke: 'black',
                strokeWidth: 4
            });
        };
        if (model.idDs().length) {
            this.enableTooltip && this.initTooltip({
                clickable: AppConfig.isFactory === 0
            });
        }
        this.layer.add(this.shape);
        this.shape.moveToTop();
        this.update();
    };

    /** override */
    CanvasHeatP.prototype.update = function (e, propType) {
        
        var model = this.store.model;
        var option = model.option();
        var polygonId = option.polygonId;
        var temp;
        if (!propType || propType.indexOf('update.idDs') > -1) {
            if ($.fn.zTree) {
                var treeObj = $.fn.zTree.getZTreeObj('parentTree');
            }
            if (treeObj) {
                var node = treeObj.getNodeByParam('modelId', model._id());
                if (node && model.idDs) {
                    var idDs = model.idDs();
                    var name;
                    if (idDs.length > 0) {
                        name = idDs[0];
                        name !== node.name && (node.name = name, treeObj.updateNode(node));
                    } else {
                        node.name = I18n.resource.mainPanel.layerName.HEATP;
                        treeObj.updateNode(node);
                    } 
                }
            }
        }

        if (option.text && propType && (propType.indexOf('update.option.text') > -1)) {
            temp = option.text.value;//接受的温度
            temp = Number(temp).toFixed(1);
            this.shape.text(temp);
            var ca = new CanvasHeatC();
            ca.data(temp);
            if (window.colorGettings) {
                ca.max(window.colorGettings.max);
                ca.min(window.colorGettings.min);
            } else {
                ca.max(30);
                ca.min(20);
            }
            
            var polygonColor = ca.color();

            var heatPolygon = this.painter.store.widgetModelSet.findByProperty('_id', polygonId);
            heatPolygon&&heatPolygon.update({
                            'option.color': polygonColor
                        });
        }
        if (propType && (propType.indexOf('update.x') > -1 || propType.indexOf('update.y') > -1)) {

            this.shape.x(model.x());
            this.shape.y(model.y());
           
        }
        if (propType && (propType.indexOf('update.option.fill') > -1)) {
            
        }
        
        if (propType && (propType.indexOf('update.option.polygonId') > -1)) {

        }

        //更新 isHide
        if (!propType || propType.indexOf('update.isHide') > -1) {
            if(this.store.model.isHide()){
                this.detach();
            }else{
                this.attach();
            }
        }

        if (!propType || propType.indexOf('update.layerId') > -1) {
            this.setParent(model.layerId());
        }

        this.layer.draw();
    };
    CanvasHeatP.prototype = Mixin(CanvasHeatP.prototype, CanvasWidgetMixin);

    CanvasHeatP.prototype.x = function () {
        var model = this.store.model;
        return model.x() - model['option.radius']()*2;
    };

    CanvasHeatP.prototype.y = function () {
        var model = this.store.model;
        return model.y() - model['option.radius']();
    };

    CanvasHeatP.prototype.width = function () {
        return this.store.model['option.radius']() * 2;
    };

    CanvasHeatP.prototype.height = function () {
        return this.store.model['option.radius']() * 2;
    };

    CanvasHeatP.prototype.getType = function () {
        return 'Combine';
    }
    CanvasHeatP.prototype.moveToBottom = function () {
       
    }

    CanvasHeatP.prototype = Mixin(CanvasHeatP.prototype, TooltipMixin);

    exports.CanvasHeatP = CanvasHeatP;
}(
    namespace('widgets.factory'),
    namespace('widgets.factory.Widget'),
    namespace('mixins.CanvasWidgetMixin'),
    namespace('widgets.factory.CanvasHeatC'),
    namespace('mixins.TooltipMixin')
));

(function (CanvasPipe) {

    ////////////////////////////
    /// CanvasPipeWithAnimation DEFINITION //
    ////////////////////////////
    function CanvasPipeWithAnimation(layer, model) {
        CanvasPipe.apply(this, arguments);
    }

    CanvasPipeWithAnimation.prototype = Object.create(CanvasPipe.prototype);
    CanvasPipeWithAnimation.prototype.constructor = CanvasPipeWithAnimation;

    /** override */
    CanvasPipeWithAnimation.prototype.update = function () {
        var model = this.store.model;
        var options = model.option();
        var isActive = 0;     
        if (options.text && options.text.value) {
            for (var k in options.text.value) {
                if (parseInt(options.text.value[k]) === 1) {
                    isActive = 1;
                }
            }
            
        }
        // 根据 isActive,判断是否需要动画
        // 0: 无动画,1: 有动画
        this.shape.paint(isActive === 1);

        this.layer.draw();
    };

    window.widgets = window.widgets || {};
    window.widgets.factory = window.widgets.factory  || {};
    window.widgets.factory.CanvasPipe = CanvasPipeWithAnimation;

} (window.widgets.factory.CanvasPipe));
﻿(function (exports, Widget, CanvasWidgetMixin) {
    var _this;
    function CanvasPolygon(layer, model) {
        Widget.apply(this, arguments);
        this.children = [];
        this.shape = undefined;
        _this = this;
    }

    CanvasPolygon.prototype = Object.create(Widget.prototype);
    CanvasPolygon.prototype.constructor = CanvasPolygon;

    CanvasPolygon.prototype.init = function () {
        // 兼容一下老数据格式
        this._format();

        Widget.prototype.init.apply(this, arguments);
    };

    CanvasPolygon.prototype._format = function () {
        if(typeof this.store.model.isHide === "undefined"){
            this.store.model.property('isHide',0);
        }
    };

    /** override */
    CanvasPolygon.prototype.show = function (isPreview) {
        //isPreview  是否预览
        var model = this.store.model;
        var option = model.option();
        var id = model._id(),
            points = option.points,
            color = option.color;
        var stroke, strokeWidth, opacity;

        this.shape = new Konva.Line({
            id: id,
            name: 'polygon-line polygon-' + id,
            points: points,
            closed: true,
            stroke: !isPreview ? '#111' : 'transparent',
            strokeWidth: !isPreview ? 2 : 0,
            fill: 'transparent',
            lineJoin: 'bevel'
        });
        
        this.layer.add(this.shape);
        this.layer.draw();
        this.update();

        this.attachEvents();
    };

    /** override */
    CanvasPolygon.prototype.update = function (e, propType) {
        var model = this.store.model;
        var option = model.option();

        // points 更新时，需要重新进行绘制
        if (propType && propType.indexOf('update.option.points') > -1) {
            this.shape.points(option.points);
        }
        //更新 isHide
        if (!propType || propType.indexOf('update.isHide') > -1) {
            if(this.store.model.isHide()){
                this.detach();
            }else{
                this.attach();
            }
        }

        if (!propType || propType.indexOf('update.layerId') > -1) {
            this.setParent(model.layerId());
        }

        // 首次在这里无需绘制
        if (e) {
            this.layer.draw();
        }
    };

    CanvasPolygon.prototype.attachEvents = function () {};

    CanvasPolygon.prototype = Mixin(CanvasPolygon.prototype, CanvasWidgetMixin);

    CanvasPolygon.prototype.width = function () {
        return 0;
    };

    CanvasPolygon.prototype.height = function () {
        return 0;
    };

    CanvasPolygon.prototype.position = function () {
        return {
            x: 0,
            y: 0
        };
    };

    CanvasPolygon.prototype.getType = function () {
        return 'Combine';
    };
    CanvasPolygon.prototype.moveToBottom = function () {
        
    };
    CanvasPolygon.prototype.getPoints = function () {
        return this.store.model['option.points']();
    };

    exports.CanvasPolygon = CanvasPolygon;

}(
    namespace('widgets.factory'),
    namespace('widgets.factory.Widget'),
    namespace('mixins.CanvasWidgetMixin')
));
;(function (exports, SuperClass) {

    function CanvasPolygon() {
        SuperClass.apply(this, arguments);

        this.tween = null;
    }

    CanvasPolygon.prototype = Object.create(SuperClass.prototype);

    +function () {

        this.constructor = CanvasPolygon;

        this.show = function () {
            var model = this.store.model;
            var events = model['option.events'](), event = events[0];

            SuperClass.prototype.show.apply(this, arguments);

            // 注册自动播放
            if (event && event.type === 'hover') {
                this._addToCarousel();
            }
        };

        this._addToCarousel = function () {
            if (this.painter._registerCarousel) {
                this.painter._registerCarousel(this);
            }
        };

        this._disableCarousel = function () {};

        this._enableCarousel = function () {};

        this._fillImage = function (url) {
            var _this = this;

            GUtil.loadImage(url, function (image) {
                var page = _this.painter.getPageSize();

                _this.shape.fillPriority('pattern');
                _this.shape.fillPatternImage(image);
                _this.shape.fillPatternScaleX(page.w/image.width);
                _this.shape.fillPatternScaleY(page.h/image.height);
                _this.shape.cache();
                _this.shape.filters([Konva.Filters.Brighten]);
            });
        };

        this.playUp = function () {
            this.shape.fire('mouseenter');
        };

        this.playDown = function () {
            this.shape.fire('mouseleave');
        };

        /**
         * @override
         */
        this.attachEvents = function () {
            var _this = this;
            var model = this.store.model;
            var events = model['option.events']();
            var event;
            // 备份当前的图层状态
            var layerStatus;
            var background;

            if (!events || !events.length) {
                return;
            }

            background = this.painter.getBgLayer().getBackground();
            if (background && background.type === 'image') {
                this._fillImage( background.url );
            }

            // 目前只支持一种事件
            event = events[0];
            // 处理 hover 和 click 类型的触发事件
            if (event.type === 'hover') {
                this.shape.on('mouseenter', function (e) {
                    var status = event.layerMap;
                    var maskShape;

                    if (e.target) {
                        _this._disableCarousel();
                    }

                    // 将当前图形 z-index 提升到顶层
                    _this.shape.moveToTop();
                    // 获取遮罩层
                    maskShape = _this.painter.getMaskShape();
                    maskShape.setZIndex(_this.shape.getZIndex() - 1);
                    maskShape.show();

                    // 加亮
                    _this.shape.brightness(0.1);
                    // 获取默认的图层状态
                    if (!layerStatus) {
                        layerStatus = _this.painter.getLayerStatus();
                    }
                    _this.painter.displayLayerByStatusMap(status);

                    if (_this.tween) {
                        _this.tween.destroy();
                        _this.tween = null;
                    }
                    _this.tween = new Konva.Tween({
                        node: maskShape,
                        duration: .2,
                        opacity: .4
                    });
                    _this.tween.play();
                });
                this.shape.on('mouseleave', function (e) {
                    var maskShape = _this.painter.getMaskShape();

                    if (e.target) {
                        _this._enableCarousel();
                    }

                    maskShape.hide();
                    maskShape.opacity(0);
                    // 恢复亮度
                    _this.shape.brightness(0);
                    _this.painter.displayLayerByStatusMap(layerStatus);
                });
            } else if (event.type === 'click') {
                // TODO
            }

        };

        this.close = function () {
            SuperClass.prototype.close.apply(this, arguments);
            if (this.tween) {
                this.tween.destroy();
                this.tween = null;
            }
        };

    }.call(CanvasPolygon.prototype);

    exports.CanvasPolygon = CanvasPolygon;

} (
    namespace('widgets.factory'),
    namespace('widgets.factory.CanvasPolygon')
));
(function (exports, Widget, CanvasWidgetMixin) {

    function CanvasText(layer, model) {
        Widget.apply(this, arguments);
    }

    CanvasText.prototype = Object.create(Widget.prototype);
    CanvasText.prototype.constructor = CanvasText;

    CanvasText.prototype.init = function () {
        // 兼容一下老数据格式
        this._format();

        Widget.prototype.init.apply(this, arguments);
    };

    CanvasText.prototype._format = function () {
        //兼容老数据
        var options = this.store.model.option();
        if(typeof this.store.model.isHide === "undefined"){
            this.store.model.property('isHide',0);
        }
        if(!options.lineHeight) {
            options.lineHeight = 1;
        }
        this.store.model.option(options);
    };

    /** override */
    CanvasText.prototype.show = function () {
        var model = this.store.model;

        this.shape = new Konva.Text({
            id: model._id(),
            x: model.x(),
            y: model.y(),
            text: model['option.text'](),
            fontSize: model['option.fontSize'](),
            fontFamily: model['option.fontFamily'](),
            fill: model['option.fontColor'](),
            width:model.w(),
            align:model['option.textAlign']()
        });

        this.update();

        this.layer.add(this.shape);
    };

    /** override */
    CanvasText.prototype.update = function (e, propName) {
        var model = this.store.model;
        var options = model.option();

        if (!propName || propName.indexOf('update.idDs') > -1) {
            if ($.fn.zTree) {
                var treeObj = $.fn.zTree.getZTreeObj('parentTree');
            }

            if (treeObj) {
                var node = treeObj.getNodeByParam('modelId', model._id());
                if (node && model.idDs) {
                    var idDs = model.idDs();
                    var name;
                    if (idDs.length > 0) {
                        name = idDs[0];
                        name !== node.name && (node.name = name, treeObj.updateNode(node));
                    } else {
                        node.name = I18n.resource.mainPanel.layerName.TEXT;
                        treeObj.updateNode(node);
                    }
                }
            }
        }

        if (!propName || propName.indexOf('update.x') > -1 || propName.indexOf('update.y') > -1) {
            this.shape.position({
                x: model.x() + model.w() / 2,
                y: model.y() + model.h() / 2
            });
        }

        if (!propName || propName.indexOf('update.w') > -1 || propName.indexOf('update.h') > -1) {
            this.shape.position({
                x: model.x() + model.w() / 2,
                y: model.y() + model.h() / 2
            });
            if(model['option.verticalAlign']() === 'top'){
                this.shape.offset({
                    x: model.w() / 2,
                    y: model.h() / 2
                });
            }else if(model['option.verticalAlign']() === 'middle'){
                this.shape.offset({
                    x: model.w() / 2,
                    y: model.h()/2 - (model.h() - model['option.fontSize']()*model['option.lineHeight']())/2
                });
            }else{
                this.shape.offset({
                    x: model.w() / 2,
                    y: model.h()/2 - model.h() + model['option.fontSize']()*model['option.lineHeight']()
                });
            }

            this.shape.width(model.w());
            this.shape.height(model.h());
        }
        //更新 isHide
        if (!propName || propName.indexOf('update.isHide') > -1) {
            if(this.store.model.isHide()){
                this.detach();
            }else{
                this.attach();
            }
        }

        if (!propName || propName.indexOf('update.layerId') > -1) {
            this.setParent(model.layerId());
        }

        //字体,字号,类型更改
        if(!propName || propName.indexOf('update.option.fontFamily') > -1){
            this.shape.fontFamily(options.fontFamily);
        }
        if(!propName || propName.indexOf('update.option.fontSize') > -1){
            this.shape.fontSize(options.fontSize);
        }
        if(!propName || propName.indexOf('update.option.fontStyle') > -1){
            this.shape.fontStyle(options.fontStyle);
        }

        //对齐
        var changeX,changeY;
        if(!propName || propName.indexOf('update.option.textAlign') > -1){
            this.shape.align(options.textAlign);
        }
        if(!propName || propName.indexOf('update.option.verticalAlign') > -1){
            if(options.verticalAlign === 'top'){
                changeX = model.w()/2;
                changeY = model.h()/2;
            }else if(options.verticalAlign === 'middle'){
                changeX = model.w()/2;
                changeY = model.h()/2 - (model.h() - model['option.fontSize']()*model['option.lineHeight']())/2;
            }else if(options.verticalAlign === 'bottom'){
                changeX = model.w()/2;
                changeY = model.h()/2 - model.h() + model['option.fontSize']()*model['option.lineHeight']();
            }
            this.shape.offset({x:changeX,y:changeY})
        }

        //颜色
        if(!propName || propName.indexOf('update.option.fontColor') > -1){
            this.shape.fill(options.fontColor);
        }
        //if(!propName || propName.indexOf('update.option.bgColor') > -1){
        //    this.shape.fillLinearGradientStartPoint({x:model.x(),y:model.y()});
        //    this.shape.fillLinearGradientEndPoint({x:model.x() + model.w(),y:model.y() + model.h()});
        //    this.shape.fillLinearGradientColorStops([0, options.bgColor, 1, options.bgColor]);
        //}

        //间距
        if(!propName || propName.indexOf('update.option.lineHeight') > -1){
            this.shape.lineHeight(options.lineHeight);
        }

        var value;
        // options.text 为 string 类型，说明是在编辑 模式下
        if (typeof options.text === 'string') {
            this.shape.text(options.text);
        }
        // options.text 为 object 类型，说明是在预览模式下
        else if (typeof options.text === 'object') {
            if (options.text.value !== '' && !isNaN(options.text.value)) {
                value = parseFloat(options.text.value).toFixed(options.precision == undefined?2:options.precision);
            } else {
                value = options.text.value;
            }
            // 判断是否有 <%value%> 占位符，如果没有，则整体替换
            if (options.text.content.indexOf('<%value%>') === -1) {
                this.shape.text(value);
            } else {
                this.shape.text(options.text.content.replace('<%value%>', value));
            }
        }

        // 仅更新的时候需要再次进行绘制
        if (e) {
            this.layer.draw();
        }
    };
    // 获取模板中的模板参数
    CanvasText.prototype.getTplParams = function (data){
        if(data){
            var pattern = /<#\s*(\w*?)\s*#>/mg;
            var match = null;
            var params = [];
            var str = data.option.text + data.option.pageId;
            while( match = pattern.exec(str) ) {
                params.push({
                    name: match[1],
                    value: ''
                });
            }
            return params;
        }
    };
    // 应用
    CanvasText.prototype.applyTplParams = function (data){
        if(data){
            var reg = data.reg;
            var strNew = data.strNew;
            var widget = data.widget;
            widget.option.text = widget.option.text.replace(reg, strNew);
            widget.option.pageId = widget.option.pageId.replace(reg, strNew);
            return widget;
        }
    };

    CanvasText.prototype = Mixin(CanvasText.prototype, CanvasWidgetMixin);

    CanvasText.prototype.type = 'CanvasText';

    exports.CanvasText = CanvasText;

} (namespace('widgets.factory'),
    namespace('widgets.factory.Widget'),
    namespace('mixins.CanvasWidgetMixin')));

(function (exports,facCanvasText, TooltipMixin) {

    function CanvasText(layer, model) {
        facCanvasText.apply(this, arguments);
    }

    CanvasText.prototype = Object.create(facCanvasText.prototype);
    CanvasText.prototype.constructor = CanvasText;

    /** override */
    CanvasText.prototype.show = function () {
        var _this = this;
        var model = this.store.model;
        var screens = namespace('observer.screens');
        var options = model.option();
        var pageId = options.pageId;
        var pageType = options.pageType;
        var tpl = '<div class="modal fade" id="buttonModal" style="display:none;">\
            <div class="modal-dialog" style="width: 80%; height: calc(100% - 60px);">\
                <div class="modal-content" style="width: 100%;height: 100%;border: none;">\
                    <div class="modal-header" style="border-bottom:0;height:0;min-height: 0;padding:0;">\
                        <button type="button" class="close" data-dismiss="modal" style="position:absolute;top:7px;\
                        right:5px;z-index:2;width:25px;height:25px;border-radius:12.5px;background:#fff;padding-bottom:2px;">\
                        <span aria-hidden="true">&times;</span></button>\
                    </div>\
                    <div class="modal-body" style="padding:0;width: 100%;height: 100%;overflow:hidden;z-index:1;"></div>\
                </div>\
            </div>\
        </div>';

        facCanvasText.prototype.show.apply(this, arguments);

        if (model.idDs().length) {
            this.enableTooltip && this.initTooltip({
                clickable: AppConfig.isFactory === 0
            });
        }

        if(pageId && pageId != ''){
            this.shape.on('mouseover', function () {
                _this.page.painterCtn.style.cursor = 'pointer';
            });

            this.shape.on('mouseout', function () {
                _this.page.painterCtn.style.cursor = 'auto';
            });
        }
        this.shape.on('click',function(e){
            var $modal;
            var floatScreen;

            if (!pageId || (pageId.indexOf('<#')>-1 && pageId.indexOf('#>')>-1)) {
                return;
            }

            if (options.float === 1) {
                $modal = $(tpl);
                $modal.appendTo(document.body);

                $modal.one('shown.bs.modal',function () {
                    floatScreen = new screens[pageType || 'PageScreen']({
                        id: pageId,
                        isFactory: AppConfig.isFactory
                    }, $('.modal-body', $modal)[0]);

                    floatScreen.show();
                });
                $modal.one('hidden.bs.modal',function () {
                    floatScreen && floatScreen.close();
                    $modal.remove();
                });

                WebAPI.get('/factory/page/'+pageId).done(function (rs) {
                    var $modalDialog = $modal.find('.modal-dialog');
                    var page;
                    if (rs.status !== 'OK') {
                        return;
                    }
                    page = rs.data;
                    if (page.display === 1) {
                        $modalDialog.width(page.width);
                        $modalDialog.height(page.height+30);
                    }
                    $modal.modal('show');
                });
                
            } else {
                floatScreen = new screens[pageType || 'PageScreen']({
                    id: pageId,
                    isFactory: AppConfig.isFactory
                }, _this.page.painterCtn);

                // 重置一下鼠标，因为页面切换的时候，可能图片的 mouseout 事件不会被触发，导致鼠标未还原
                _this.page.painterCtn.style.cursor = 'default';

                // 辞旧迎新
                _this.page.close();
                floatScreen.show();
            }
        });
    };

    CanvasText.prototype = Mixin(CanvasText.prototype, TooltipMixin);

    //覆盖
    exports.CanvasText = CanvasText;
} (
    namespace('widgets.factory'),
    namespace('widgets.factory.CanvasText'),
    namespace('mixins.TooltipMixin')
));
(function (exports, SuperClass, HtmlWidgetMixin) {

    function HtmlContainer(layer, model) {
        SuperClass.apply(this, arguments);
    }

    HtmlContainer.prototype = Object.create(SuperClass.prototype);
    HtmlContainer.prototype.constructor = HtmlContainer;

    HtmlContainer.prototype.tpl = '<div class="html-widget html-container"></div>';

    HtmlContainer.prototype.CSS_FORMAT_PATTERN = /([^\r\n,{}]+)(,(?=[^}]*{)|\s*(?={))/mg;

    HtmlContainer.prototype.JS_FORMAT_PATTERN = /(<script\b[^>]*>)([\s\S]*?)(<\/script>)/img;

    HtmlContainer.prototype.init = function () {
        //兼容一下老数据格式
        this._format();

        SuperClass.prototype.init.apply(this, arguments);
    };

    HtmlContainer.prototype._format = function () {
        var options = this.store.model.option();
        if(typeof this.store.model.isHide === "undefined"){
            this.store.model.property('isHide',0);
        }
        if(!options.css) {
            options.css = '';
        }
        if(!options.js) {
            options.js = '';
        }
        if(!options.display){
            options.display = 0;
        }

        this.store.model.option(options);
    };

    /** override */
    HtmlContainer.prototype.show = function () {
        var model = this.store.model;

        SuperClass.prototype.show.apply(this, arguments);

        this.shape = HTMLParser(this.tpl);
        this.shape.id = model._id();
        this.shape.style.position = 'absolute';
        this.shape.style.border = '1px dashed #aaa';
        this.update();

        this.layer.add(this.shape);
    };

    /** override */
    HtmlContainer.prototype.update = function (e, propName) {
        var model = this.store.model;
        var options = model.option();

        if (!propName || propName.indexOf('update.x') > -1 || propName.indexOf('update.y') > -1) {
            this.shape.style.left = model.x() + 'px';
            this.shape.style.top = model.y() + 'px';
        }

        if (!propName || propName.indexOf('update.w') > -1 || propName.indexOf('update') > -1) {
            this.shape.style.width = model.w() + 'px';
            this.shape.style.height = model.h() + 'px';
        }

        if (!propName || propName.indexOf('update.option') > -1) {
            this.preview();
        }

        if (!propName || propName.indexOf('update.isHide') > -1) {
            if(this.store.model.isHide()){
                this.detach();
            }else{
                this.attach();
            }
        }

        if (!propName || propName.indexOf('update.layerId') > -1) {
            this.setParent(model.layerId());
        }

        SuperClass.prototype.update.apply(this, arguments);

        Log.info('html container widget has been updated.');
    };

    HtmlContainer.prototype.preview = function () {
        var options = this.store.model.option();
        var formatCss, guid;
        
        if (options.html || options.css) {
            guid = ObjectId();
            this.shape.style.background = 'none';
            formatCss = (options.css || '').replace(this.CSS_FORMAT_PATTERN, function ($0, $1, $2) {
                return '#hc_' + guid + ' ' + $0;
            }).replace('__container__', '');
            this.shape.innerHTML = ['<div class="ps-w-html-contaienr" id="hc_' + guid + '">', options.html || '', '</div>',
                 '<style>', formatCss, '</style>'].join('');
        } else {
            this.shape.innerHTML = '';
            this.shape.style.backgroundImage = 'url("/static/app/WebFactory/themes/default/images/demo/htmlContainer.png")';
            this.shape.style.backgroundSize = '100% 100%';
            this.shape.style.backgroundColor = 'rgba(243, 219, 202, 0.35)';
        }
    };
    // 获取模板中的模板参数
    HtmlContainer.prototype.getTplParams = function (data){
        if(data){
            var pattern = /<#\s*(\w*?)\s*#>/mg;
            var match = null;
            var params = [];
            var str = data.option.html +  data.option.css + data.option.js;
            while( match = pattern.exec(str) ) {
                params.push({
                    name: match[1],
                    value: ''
                });
            }
            return params;
        }
    };
    // 应用
    HtmlContainer.prototype.applyTplParams = function (data){
        if(data){
            var reg = data.reg;
            var strNew = data.strNew;
            var widget = data.widget;
            widget.option.html = widget.option.html.replace(reg, strNew);
            widget.option.css = widget.option.css.replace(reg, strNew);
            widget.option.js = widget.option.js.replace(reg, strNew);
            return widget;
        }
    };

    /** 适配工作 */
    HtmlContainer.prototype = Mixin(HtmlContainer.prototype, HtmlWidgetMixin);
    HtmlContainer.prototype.type = 'HtmlContainer';

    exports.HtmlContainer = HtmlContainer;
} (
    namespace('widgets.factory'),
    namespace('widgets.factory.HtmlWidget'),
    namespace('mixins.HtmlWidgetMixin')
));
(function (exports, FacHtmlContainer, ToolTipMixin) {

    function HtmlContainer() {
        FacHtmlContainer.apply(this, arguments);

        this.instance = null;
    }

    HtmlContainer.prototype = Object.create(FacHtmlContainer.prototype);
    HtmlContainer.prototype.constructor = HtmlContainer;

    /** override */
    HtmlContainer.prototype.show = function () {
        var model = this.store.model;
        var options = model.option();

        FacHtmlContainer.prototype.show.apply(this, arguments);
        this.shape.style.border = 'none';

        HtmlContainer.templateHelper.ins = this;
        this.instance = HtmlContainer.templateHelper.render(this.shape, options, this.page.options.params);
        this.store.model.serialize().idDs = this.instance.defer;

        this.attachCustomEvents();
    };

    /** @override */
    HtmlContainer.prototype.preview = function () {};

    /** override */
    HtmlContainer.prototype.update = function (e, propName) {
        var model = this.store.model;
        var scale;

        FacHtmlContainer.prototype.update.apply(this, arguments);

        if (!propName || propName.indexOf('update.option.display') > -1) {
            if (model['option.display']() === 1) {
                scale = this.painter.getScale();
                this.shape.style.left = model.x() * scale.x + 'px';
                this.shape.style.top = model.y() * scale.y + 'px';
                this.shape.style.width = model.w() * scale.x + 'px';
                this.shape.style.height = model.h() * scale.y + 'px';
            }
        }

        if (propName && propName.indexOf('update.option.text') > -1) {
            // 更新模板
            this.instance && this.instance.update(this.store.model.option().text.value);
        }
    };

    HtmlContainer.prototype.attachCustomEvents = function () {
        var _this = this;

        $(this.shape).off('click').on('click', '[data-link-to]', function (e) {
            var linkType = this.dataset['linkType'];
            var ctnSelector = this.dataset['linkTarget'];
            var menuId = this.dataset['linkTo'];
            var linkName = this.dataset['linkName'];
            var linkParams = this.dataset['linkParams'];

            try{
                linkParams = JSON.parse(linkParams);
            } catch (e){}
            // 跳转
            _this.instance.methods.linkTo(menuId, ctnSelector, linkType, linkName, linkParams);
            e.preventDefault();
        });
    };

    HtmlContainer.prototype.reload = function (params) {
        var options = this.store.model.option();

        this.instance && this.instance.close();
        this.instance = HtmlContainer.templateHelper.render(this.shape, options, params);
        this.store.model.serialize().idDs = this.instance.defer;
    };

    HtmlContainer.prototype.close = function () {
        this.instance && this.instance.close();
        FacHtmlContainer.prototype.close.apply(this, arguments);
    };

    HtmlContainer.prototype = Mixin(HtmlContainer.prototype, ToolTipMixin);

    /*----------------
     * STATIC METHODS
     * ---------------*/
    // Html 控件渲染核心方法
    // 该方法暴露为 static 对象，是为了让模板中的代码也可以调用到
    HtmlContainer.templateHelper = {
        ins: null,
        // rootGuid - 根模板的 guid
        render: function (container, code, params, rootGuid) {
            var _this = this;
            var guid = ObjectId();
            var formattedCode, _api;

            // 默认为 guid
            rootGuid = typeof rootGuid === 'undefined' ? guid : rootGuid;

            _api = namespace('__f_hc')[guid] = new TemplateAPI(guid, rootGuid, params);
            // 如果是根模板
            if (rootGuid !== guid) {
                namespace('__f_hc')[rootGuid].children.push(guid);
            }

            // 1、格式化代码
            formattedCode = (function (_api, container, code, params, guid) {
                var scriptContent = [];
                var templateParseInfo = _this.getAttachedTemplate(code.html, params);
                var html = templateParseInfo.template;

                var htmlWrapTpl = '<div class="ps-w-html-contaienr" id="hc_'+guid+'">|code|</div>';

                var jsWrapTpl = (function () {
                    return '(function(_api) {'+
                    'var _params = _api.params, _container = _api.container = document.querySelector("#hc_'+guid+'");\ntry{\n' +
                    '|code|\n}catch(e){console.error(e);};_api.__run(_container);}).call(null, window.__f_hc["'+guid+'"])';
                } ());

                var cssWrapTpl = '<style>|code|</style>';
                // script 标签处理
                var formatHtml = html.replace(_this.ins.JS_FORMAT_PATTERN, function($0, $1, $2, $3) {
                    if( $2.trim() !== '') scriptContent.push( $2 );
                    return '';
                });
                // 给 css selector 加上 id 的前缀
                // /([,|\}|\r\n][\s]*)([\.#]?-?[_a-zA-Z]+[_a-zA-Z0-9-]*)/mg
                // /([^\r\n,{}]+)(,(?=[^}]*{)|\s*(?={))/mg
                var formatCss = code.css.replace(_this.ins.CSS_FORMAT_PATTERN, function ($0, $1, $2) {
                    // 屏蔽一些特殊情况
                    // @keyframes、百分比
                    if (/@\S+|\d+?%/mg.exec($0) !== null) {
                        return $0;
                    }
                    return '#hc_' + guid + ' ' + $0;
                }).replace(/\s+__container__/gm, '');
                var formatJs = jsWrapTpl.replace('|code|', code.js);
                formatCss = cssWrapTpl.replace('|code|', formatCss);
                formatHtml = htmlWrapTpl.replace('|code|', formatHtml);

                _api.tplParamList = templateParseInfo.list;

                return {
                    html: formatHtml,
                    css: formatCss,
                    js: formatJs
                };
            } (_api, container, code, params, guid));

            // 2、预处理数据源标签
            (function (code, dsNameList, dsIdGrouped) {
                var parser = TextTemplateParser;
                // $0: 属性+值
                // $1: 属性名
                // $2: 属性值
                code.html = code.html.replace(/([\w-]+?)="([^"]*<%[^<>]+?%>[^"]*)"/mg, function ($0, $1, $2) {
                    var tokens = parser.parse($2, ['<%', '%>']);
                    var infoStr;
                    tokens.forEach(function (row) {
                        var dsId;
                        if(row.type === parser.types.binding) {
                            row.content = '';
                            if (dsNameList.indexOf(row.value) === -1) {
                                dsNameList.push(row.value);
                                if (row.value.indexOf(',') > -1) {
                                    dsId = row.value.split(',')[0].trim();
                                } else {
                                    dsId = row.value;
                                }
                                dsIdGrouped[dsId] = dsIdGrouped[dsId] || [];
                                dsIdGrouped[dsId].push(row.value);
                            }
                        }
                    });
                    infoStr = window.encodeURIComponent(JSON.stringify(tokens));

                    return $1+'="" data-inner-ds-info="'+infoStr+'" data-inner-ds-attr="'+$1+'"';
                });
                // 整理出数据源的数据
                code.html = code.html.replace(/<%([^<>]+?)%>/mg, function($0, $1) {
                    var dsId;
                    if (dsNameList.indexOf($1) === -1) {
                        dsNameList.push($1);
                        if ($1.indexOf(',') > -1) {
                            dsId = $1.split(',')[0].trim();
                        } else {
                            dsId = $1;
                        }
                        dsIdGrouped[dsId] = dsIdGrouped[dsId] || [];
                        dsIdGrouped[dsId].push($1);
                    }
                    return '<span class="text-node-placeholder" data-name="'+$1+'">'+$1+'</span>';
                });
            } (formattedCode, _api.dsNameList, _api.dsIdGrouped));
            
            // 3、渲染 html
            container.innerHTML = [formattedCode.html, formattedCode.css].join('\n');

            // 4、执行 js
            (function (code) {
                var done = false;
                var script = document.createElement("script");
                var head = document.getElementsByTagName("head")[0];
                script.type = "text\/javascript";
                script.text = code;
                head.appendChild(script);
                head.removeChild(script);
            } (formattedCode.js));

            return {
                methods: {
                    linkTo: _api.linkTo
                },
                defer: _api.defer,
                close: function () {
                    _api.close();
                    window.__f_hc[guid] = null;
                },
                update: function (data) {
                    _api.update(data);
                },
                reload: function (data) {}
            }
        },
        bindDs: function (container, guid) {
            var _api = namespace('__f_hc.' + guid);
            var childrenGuid = _api.children || [];
            var dsIdList = [];
            var dsNameList = [];
            var dataMap = {};
            var templates = [_api];

            childrenGuid.forEach(function (id) {
                templates.push( namespace('__f_hc.' + id) );
            });

            templates.forEach(function (row) {
                dsIdList = dsIdList.concat( Object.keys(row.dsIdGrouped) );
                dsNameList = dsNameList.concat(row.dsNameList);
            });

            // 绑定数据源
            this.createDsBinding(container, dsNameList, dataMap = {});

            return {
                screen: {
                    close: function () {
                        window.__f_hc[guid] = null;
                    }
                },
                dsList: dsIdList,
                dataMap: dataMap
            };
        },
        createDsBinding: function (container, dsNameList, ds) {
            var _this = this;
            var $container = $(container);
            var textNodeMap = {}, attrNodeMap = {};
            var $textNodes = $container.find('.text-node-placeholder');
            var $attrNodes = $container.find('[data-inner-ds-info]');

            dsNameList.forEach(function(name) {
                var $nodes;

                /** 数据源在文本节点中使用 */
                if( ($nodes = $textNodes.filter('[data-name="'+name+'"]')).length ) {
                    $nodes.each(function () {
                        var text = document.createTextNode('');
                        if(!textNodeMap[name]) {
                            textNodeMap[name] = [{
                                name: this.getAttribute('data-name'),
                                node: text
                            }];   
                        } else {
                            textNodeMap[name].push({
                                name: this.getAttribute('data-name'),
                                node: text
                            });
                        }
                        this.parentNode.replaceChild(text, this);
                    });
                } else {
                    textNodeMap[name] = [];
                }

                /** 数据源在属性节点中使用 */
                if( ($nodes = $attrNodes.filter('[data-inner-ds-info="'+name+'"]')).length ) {
                    $nodes.each(function () {
                        var $this = $(this);
                        var attr = $this.data('ds.attr');
                        var info = $this.data('ds.info');

                        if(attr === undefined) {
                            $this.data('ds.attr', (attr = this.getAttribute('data-inner-ds-attr')) );
                        }
                        if(info === undefined) {
                            info = window.decodeURIComponent(this.getAttribute('data-inner-ds-info') );
                            $this.data('ds.info', (info = JSON.parse(info)) );
                        }

                        if(!attrNodeMap[name]) {
                            attrNodeMap[name] = [{
                                node: this.getAttributeNode(attr),
                                info: info
                            }]
                        } else {
                            attrNodeMap[name].push({
                                node: this.getAttributeNode(attr),
                                info: info
                            });
                        }
                    });
                } else {
                    attrNodeMap[name] = [];
                }

                if(!ds.__observerProps) ds.__observerProps = {};
                if(!ds.__observerProps.hasOwnProperty(name)) {
                    ds.__observerProps[name] = null;
                    Object.defineProperty(ds, name, {
                        get: function () {
                            return this.__observerProps[name];
                        },
                        set: function (value) {
                            if(value === this.__observerProps[name]) return;
                            this.__observerProps[name] = value;
                            // 更新对应的 text node
                            textNodeMap[name].forEach(function (row) {
                                var content = row.name;
                                var node = row.node;
                                var idx = content.indexOf(',');
                                var options;

                                if(idx > -1) {
                                    options = _this._parseOptionStr( content.substr(idx+1) );
                                    node.data = _this._formatNumber(value, options);
                                    _this._formatNode(node, options, {
                                        dsId: content.substr(0, idx)
                                    });
                                } else {
                                    node.data =  isNaN(value) ? _this._decodeHtml(value) : parseFloat(value).toString();
                                }
                            });
                            attrNodeMap[name].forEach(function (row) {
                                var info = row.info;
                                var str = '';

                                info.forEach(function (row) {
                                    var idx;

                                    if(row.type === TextTemplateParser.types.text) {
                                        str += row.value;
                                    } else if(row.type === TextTemplateParser.types.binding) {
                                        if( row.value.indexOf(name) > -1 ) {
                                            idx = row.value.indexOf(',');
                                            if(idx > -1) {
                                                row.content = _this._formatNumber( value, _this._parseOptionStr(row.value.substr(idx+1)) );
                                            } else {
                                                row.content = isNaN(value) ? value : parseFloat(value).toString();
                                            }
                                        }
                                        str += row.content;
                                    }
                                });
                                row.node.value = str;
                            });
                        }
                    });
                }
            });

            // 删除不需要的属性
            $attrNodes.each(function () {
                this.removeAttribute('data-inner-ds-info');
                this.removeAttribute('data-inner-ds-attr');
            });
        },
        _parseOptionStr: function (optionStr) {
            var arr = optionStr.split(',');
            var opt = {};

            arr.forEach(function (kv) {
                var kvArr = kv.split('=');
                if( kvArr.length === 1 ) {
                    opt[kv] = 'true';
                } else {
                    opt[kvArr[0]] = kvArr[1];
                }
            });

            return opt;
        },
        _formatNumber: function (num, options) {
            var rs = '';
            var toString = Object.prototype.toString;
            var decimalPortion;
            var numstr, isNegative;

            if( isNaN(num) ) return num;
            num = parseFloat(num);
            isNegative = num < 0;
            // 去除负号
            num = Math.abs(num);

            // 处理小数精度
            if( !isNaN(options.p) ) {
                options.p = parseInt(options.p);
                num = num.toFixed(options.p);
            }

            // 小数部分不考虑
            decimalPortion = (num + '').split('.')[1] || '';
            num = parseInt(num);

            // 处理千分位字符
            if(options.ts === 'true') {
                numstr = num + '';
                while( numstr.length > 3 ) {
                    rs = ',' + numstr.substr(-3, 3) + rs;
                    numstr = numstr.substr(0, numstr.length - 3);
                }
                rs = numstr + rs;
            } else {
                rs = num + '';
            }

            rs = decimalPortion === '' ? rs : (rs + '.' + decimalPortion);
            // 结果为0，不管是否负数，不需要返回负号
            if (parseFloat(rs) === 0) { return rs; }

            // 处理负号
            return (isNegative ? '-' : '') + rs;
        },
        _formatNode: function (node, options, params) {
            var domWrap;

            // 如果已经包裹过，则不再包裹
            if (options.draggable && !node.parentNode.dataset.h5DraggableNode) {
                domWrap = document.createElement('span');
                node.parentNode.insertBefore(domWrap, node);
                domWrap.appendChild(node);

                this.ins.enableTooltip && this.ins.initTooltip({
                    shape: domWrap,
                    ds: params.dsId,
                    container: this.ins.page.painterCtn,
                    clickable: AppConfig.isFactory === 0
                });
            }
        },
        _decodeHtml: function (html) {
            var txt = document.createElement("textarea");
            txt.innerHTML = html;
            return txt.value;
        },
        getAttachedTemplate: function (template, params) {
            var pattern = /<#\s*(\w*?)\s*#>/mg;
            var list = [];

            if (params) {
                template = template.replace(pattern, function ($0, $1) {
                    list.push($1);
                    if (!params[$1]) {
                        return $0;
                    }
                    return params[$1];
                });
            }

            return {
                template: template,
                list: list
            };
        },
        getTemplateParamList: function (template) {
            var pattern = /<#\s*(\w*?)\s*#>/mg;
            var match, list = [];

            while( match = pattern.exec(template) ) {
                list.push(match[1]);
            }

            return list;
        }
    };

    // 暴露到模板中的 api
    var TemplateAPI = (function () {

        // 记录处于加载状态的模板
        var templateLoading = {};
        // 存储模板缓存
        var templateCache = {};

        function TemplateAPI(guid, rootGuid, params) {
            this.dataMap = {};
            this.obDataMap = {};
            this.dsIdGrouped = {};

            // 模板请求集合
            this.__tplRequests = [];
            // 根模板的 guid
            this.rootGuid = rootGuid;
            // 全局唯一 id
            this.guid = guid;
            // 模板参数
            this.params = params;
            // 模板参数列表
            this.tplParamList = [];
            // 存储实时数据源列表
            this.dsNameList = [];
            // 该模板中包含的子模板 guid 集合
            this.children = [];
            // 跟踪该模板的加载情况
            this.defer = $.Deferred();
            // 内部引用别的 screen 时保留的实例
            this.refScreen = null;
        }

        +function () {
            this.__getTemplate = function (templateId) {
                var promise;
                // 先查看缓存是否有匹配
                if (templateCache[templateId]) {
                    promise = $.Deferred();
                    promise.resolve(templateCache[templateId]);
                    return promise;
                }
                // 再判断该模板是否正在加载
                else if (templateLoading[templateId]) {
                    // 如果是，则返回正在加载的 promise 对象
                    return templateLoading[templateId];
                }
                // 都没有匹配到，说明是第一次加载该模板，需要发一个请求
                else {
                    promise = WebAPI.get('/factory/template/' + templateId);
                    templateLoading[templateId] = promise;
                    promise.done(function (data) {
                        templateCache[templateId] = data;
                    }).always(function () {
                        templateLoading[templateId] = null;
                    });
                    return promise;
                }
            };

            /** 开始处理动态加载的模板 */
            this.__run = function () {
                var _this = this;
                var promise = $.Deferred();
                var requests = this.__tplRequests;
                var requestMap = {};
                var defers = [];
                var templateHelper = namespace('widgets.factory.HtmlContainer.templateHelper');

                if (!requests.length) {
                    promise.resolve();
                } else {
                    // 处理模板，将需要加载的模板按照 模板id 进行分类
                    requests.forEach(function (req) {
                        if ( !requestMap.hasOwnProperty(req.templateId) ) {
                            requestMap[req.templateId] = []
                        }
                        requestMap[req.templateId].push(req);
                    });

                    // 开始加载模板
                    Object.keys(requestMap).forEach(function (templateId) {
                        var row = requestMap[templateId];
                        // 从服务端拉取模板信息
                        var d = _this.__getTemplate(templateId);

                        var defer = d.then(function (data) {
                            var type = data.type;
                            var content = data.content;
                            var deferArr = [];

                            deferArr = row.map(function (item) {
                                var container = item['container'];
                                var params = item['params'];
                                var screen = $(container).data('f.hc');
                                var html;

                                if (screen) screen.close();
                                // 页面模板
                                if (type === 'page') {
                                    if (params) content.template = templateHelper.getAttachedTemplate(content.template, params)['template'];
                                    screen = new (namespace('observer.screens').PageScreen)({
                                        params: params,
                                        template: {
                                            page: {
                                                width: content.width,
                                                height: content.height,
                                                display: content.display
                                            },
                                            data: JSON.parse(content.template)
                                        }
                                    }, container);
                                    screen.show();
                                    // 将 screen 的引用存入到容器 dom 中，方便需要的时候拿到
                                    $(container).data('f.hc', screen);
                                    return;
                                }
                                // Html 容器控件模板
                                else if (type === 'widget.HtmlContainer') {
                                    if (params) html = templateHelper.getAttachedTemplate(content.html, params)['template'];
                                    screen = namespace('widgets.factory.HtmlContainer.templateHelper').render(container, {
                                        html: html,
                                        css: content.css,
                                        js: content.js
                                    }, params, _this.rootGuid);
                                    // 将 screen 的引用存入到容器 dom 中，方便需要的时候拿到
                                    $(container).data('f.hc', screen);
                                    return screen.defer;
                                }
                            }).filter(function (row) {
                                return !!row;
                            });

                            return $.when.apply($, deferArr);
                        });

                        defers.push(defer);
                    });

                    // 等待所有
                    $.when.apply($, defers).fail(function () {
                        console.error('有模板加载失败！');
                    }).always(function () {
                        promise.resolve();
                    });
                }

                return promise.then(function () {
                    var rs;
                    // 对根模板进行 绑定动态数据源，开启 worker 线程 的操作
                    if (_this.rootGuid !== _this.guid) {
                        return;
                    }
                    // 数据源处理，仅根模板需要进行，子模板由根模板统一处理
                    rs = namespace('widgets.factory.HtmlContainer.templateHelper').bindDs(_this.container, _this.guid);
                    // 将 screen 的引用存入到容器 dom 中，方便需要的时候拿到
                    $(_this.container).data('f.hc', rs.screen);
                    // 将模板缓存清空
                    templateCache = {};

                    _this.obDataMap = rs.dataMap;
                    return rs.dsList;
                }).always(function (dsList) {
                    _this.defer.resolve(dsList);
                });
            };

            this.render = function (container, templateId, params) {
                var _this = this;

                this.__tplRequests.push({
                    container: container,
                    templateId: templateId,
                    params: params
                });
                return;
            };

            this.update = function (data) {
                var _this = this;
                var childrenGuid = this.children || [];
                var templates = [this];

                // 非顶层模板无法调用 update 方法
                if (this.guid !== this.rootGuid) {
                    Log.warn('Only the top-level template in a "HtmlContainer" can use "_api.update" method!');
                    return;
                }

                childrenGuid.forEach(function (id) {
                    templates.push( namespace('__f_hc.' + id) );
                });

                templates.forEach(function (row) {
                    Object.keys(row.dsIdGrouped).forEach(function (key) {
                        var dsIds = row.dsIdGrouped[key];
                        var dsVal = data[key];

                        dsIds.forEach(function (dsName) {
                            _this.obDataMap[dsName] = dsVal;
                        });
                        
                        row.dataMap[key] = dsVal;
                        // 调用自定义更新事件
                        typeof row.onUpdated === 'function' && row.onUpdated.call(null, row.dataMap);
                    });
                });
                
            };

            this.getHistoryData = function (params) {
                return WebAPI.post('/analysis/startWorkspaceDataGenHistogram', params);
            };

            // 初始化一些内置方法
            // linkTo: 跳转到指定页面
            this.linkTo = function (menuId, ctnSelector, linkType, linkName, linkParams) {
                var $ev, ctn;

                // 如果是链接到容器
                if(ctnSelector) {
                    // 如果需要限制为在本容器中查找，写成如下方式即可
                    // container.querySelector(ctnSelector);
                    ctn = document.querySelector(ctnSelector);
                    // 不存在此容器，不做任何事
                    if(!ctn) return;

                    // 初始化 dashboard
                    ctn.innerHTML = '';
                    if(this.refScreen) {
                        this.refScreen.close();
                        this.refScreen = null;
                    }
                }

                linkType = linkType || 'EnergyScreen';
                switch(linkType) {
                    case 'EnergyScreen_M':
                    case 'EnergyScreen':
                        if(!ctn) {
                            if(!AppConfig.isMobile) {
                                ScreenManager.goTo({
                                    page: linkType,
                                    id: menuId
                                });
                            }else{
                                var isIndex = linkType == 'EnergyScreen_M';
                                router.to({
                                    typeClass: ProjectDashboard,
                                    data: {
                                        menuId:menuId,
                                        isIndex:isIndex,
                                        name:linkName
                                    }
                                })
                            }
                        } else {
                            this.refScreen = new EnergyScreen();
                            this.refScreen.id = menuId;
                            this.refScreen.container = ctn;
                            this.refScreen.isForBencMark = true;
                            this.refScreen.init();
                        }
                        break;
                    case 'ObserverScreen':
                        if(!ctn) {
                            ScreenManager.goTo({
                                page: linkType,
                                id: menuId
                            });
                        } else {
                            this.refScreen = new ObserverScreen(menuId);
                            ctn.innerHTML = '<div class="divMain" style="width: 100%; height: 100%;">\
                                    <div class="div-canvas-ctn" style="padding: 0; margin: 0 auto; height: 100%; width: 100%;">\
                                        <canvas class="canvas-ctn" style="width: 100%; height: 100%;">浏览器不支持</canvas>\
                                    </div>\
                                    <div id="divObserverTools" style="height: 0"></div>\
                                </div>';
                            this.refScreen.isInDashBoard = true;
                            this.refScreen.show(ctn);
                        }
                        break;
                    case 'FacReportScreen':
                        if (!ctn) {
                            ScreenManager.goTo({
                                page: 'observer.screens.FacReportScreen',
                                options: {
                                    id: menuId
                                },
                                container: 'indexMain'
                            });
                        }
                        break;
                    case 'FacReportWrapScreen':
                        if (!ctn) {
                            if(AppConfig.isMobile){
                                router.to(
                                    {
                                        typeClass: MessageFactoryReport,
                                        data: {
                                        }
                                    }
                                )
                            }else {
                                ScreenManager.goTo({
                                    page: 'observer.screens.FacReportWrapScreen',
                                    options: {
                                        id: menuId
                                    },
                                    container: 'indexMain',
                                    response: linkParams
                                });
                            }
                        }
                        break;
                    // 系统诊断
                    case 'DiagnosisScreen':
                        // 系统诊断目前不支持在特定容器中显示
                        if (!ctn) {
                            ScreenManager.goTo({
                                page: linkType,
                                options: {
                                    defaultMenuId: menuId
                                }
                            });
                        }
                        break;
                    // 不识别的类型不做处理
                    default: return;
                }
            };

            this.close = function () {
                var _this = this;
                var childrenGuid = this.children || [];
                var templates = [this];

                childrenGuid.forEach(function (id) {
                    templates.push( namespace('__f_hc.' + id) );
                });

                templates.forEach(function (row) {
                    // 调用自定义销毁事件
                    typeof row.onBeforeClose === 'function' && row.onBeforeClose.call(null);
                });

                // 销毁容器
                if (this.container) {
                    this.container.innerHTML = '';
                }
            };

        }.call(TemplateAPI.prototype);

        return TemplateAPI;
    } ());

    var TextTemplateParser = (function() {
        function TextTemplateParser() {}

        TextTemplateParser.types = {
            text: 0,
            binding: 1
        };

        TextTemplateParser.parse = function(template, delimiters) {
            var index, lastIndex, lastToken, length, substring, tokens, value;
            tokens = [];
            length = template.length;
            index = lastIndex = 0;

            while (lastIndex < length) {
                index = template.indexOf(delimiters[0], lastIndex);
                if (index < 0) {
                    tokens.push({
                        type: this.types.text,
                        value: template.slice(lastIndex)
                    });
                    break;
                } else {
                    if (index > 0 && lastIndex < index) {
                        tokens.push({
                            type: this.types.text,
                            value: template.slice(lastIndex, index)
                        });
                    }
                    lastIndex = index + delimiters[0].length;
                    index = template.indexOf(delimiters[1], lastIndex);
                    if (index < 0) {
                        substring = template.slice(lastIndex - delimiters[0].length);
                        lastToken = tokens[tokens.length - 1];
                        if ((lastToken !== undefined ? lastToken.type : void 0) === this.types.text) {
                            lastToken.value += substring;
                        } else {
                            tokens.push({
                                type: this.types.text,
                                value: substring
                            });
                        }
                        break;
                    }
                    value = template.slice(lastIndex, index).trim();
                    tokens.push({
                        type: this.types.binding,
                        value: value
                    });
                    lastIndex = index + delimiters[1].length;
                }
            }
            return tokens;
        };

        return TextTemplateParser;
    }());

    exports.HtmlContainer = HtmlContainer;
} (
    namespace('widgets.factory'),
    namespace('widgets.factory.HtmlContainer'),
    namespace('mixins.TooltipMixin')
));
(function (exports, SuperClass, HtmlWidgetMixin) {

    function HtmlButton(layer, model) {
        SuperClass.apply(this, arguments);
    }

    HtmlButton.prototype = Object.create(SuperClass.prototype);
    HtmlButton.prototype.constructor = HtmlButton;

    HtmlButton.prototype.tpl = '<button class="html-widget html-btn"></button>';

    HtmlButton.prototype.init = function () {
        // 兼容一下老数据格式
        this._format();

        SuperClass.prototype.init.apply(this, arguments);
    };

    HtmlButton.prototype._format = function () {
        //兼容老数据
        var options = this.store.model.option();
        if(typeof this.store.model.isHide === "undefined"){
            this.store.model.property('isHide',0);
        }
        if(options.pageId == undefined) {
            options.pageId = '';
        }
        if(options.pageType == undefined) {
            options.pageType = '';
        }
        if(!options.float){
            options.float = 0;
        }
        if(!options.preview){
            options.preview = [];
        }
        this.store.model.option(options);
    };

    /** override */
    HtmlButton.prototype.show = function () {
        var model = this.store.model;

        SuperClass.prototype.show.apply(this, arguments);

        this.shape = HTMLParser(this.tpl);
        this.shape.id = model._id();
        this.shape.style.position = 'absolute';
        this.update();
        this.layer.add(this.shape);

        this.fixZoom();
    };

    /** override */
    HtmlButton.prototype.update = function (e, propName) {
        var model = this.store.model;
        var options = model.option();

        if (!propName || propName.indexOf('update.x') > -1 || propName.indexOf('update.y') > -1) {
            this.shape.style.left = model.x() + 'px';
            this.shape.style.top = model.y() + 'px';
        }

        if (!propName || propName.indexOf('update.w') > -1 || propName.indexOf('update.h') > -1) {
            this.shape.style.width = model.w() + 'px';
            this.shape.style.height = model.h() + 'px';
        }

        this.shape.classList.add(options.class === '' ? undefined : options.class);
        
        this.shape.innerHTML = options.text;
        
        if (!propName || propName.indexOf('update.idDs') > -1) {
            if ($.fn.zTree) {
                var treeObj = $.fn.zTree.getZTreeObj('parentTree');
            }
            if (treeObj) {
                var node = treeObj.getNodeByParam('modelId', model._id());
                if (node && model.idDs) {
                    var idDs = model.idDs();
                    var name;
                    if (idDs.length > 0) {
                        name = idDs[0];
                        name !== node.name && (node.name = name, treeObj.updateNode(node));
                    } else {
                        node.name = I18n.resource.mainPanel.layerName.BUTTON;
                        treeObj.updateNode(node);
                    }
                }
            }
        }
        if (!propName || propName.indexOf('update.isHide') > -1) {
            if(this.store.model.isHide()){
                this.detach();
            }else{
                this.attach();
            }
        }

        if (!propName || propName.indexOf('update.layerId') > -1) {
            this.setParent(model.layerId());
        }

        // options.text 为 object 类型，说明是在预览模式下
        // options.text 为 string 类型，说明是在编辑 模式下
        if (typeof options.text === 'string') {
            this.shape.innerHTML = options.text;
        } else if (typeof options.text === 'object') {
            // 判断是否有 <%value%> 占位符，如果没有，则整体替换
            if (options.text.content.indexOf('<%value%>') === -1) {
                this.shape.innerHTML = options.text.value;
            } else {
                this.shape.innerHTML = options.text.content.replace('<%value%>', options.text.value);
            }
        }

        if(options.style) {
            var initStyle = options.style;
            var normalStyle = initStyle.replace(/.Normal/g, '#' + model._id().toHexString());
            var head = document.head || document.getElementsByTagName('head')[0],
                style = document.createElement('style');
            //style.type = 'text/css';
            style.id = 'style-' + model._id();
            if (style.stylesheet) {
                style.stylesheet.cssText = normalStyle;
            } else {
                style.appendChild(document.createTextNode(normalStyle))
            }
            if (document.getElementById(style.id)) {
                $('#' + style.id).remove();
            }
            head.appendChild(style);
        }else{
            $('#style-' + model._id()).remove();
        }

        SuperClass.prototype.update.apply(this, arguments);
        Log.info('html button widget has been updated.');
    };
    // 获取模板中的模板参数
    HtmlButton.prototype.getTplParams = function (data){
        if(data){
            var pattern = /<#\s*(\w*?)\s*#>/mg;
            var match = null;
            var params = [];
            var str = data.option.text + data.option.pageId;
            while( match = pattern.exec(str) ) {
                params.push({
                    name: match[1],
                    value: ''
                });
            }
            return params;
        }
    };
    // 应用
    HtmlButton.prototype.applyTplParams = function (data){
        if(data){
            var reg = data.reg;
            var strNew = data.strNew;
            var widget = data.widget;
            widget.option.text = widget.option.text.replace(reg, strNew);
            widget.option.pageId = widget.option.pageId.replace(reg, strNew);
            return widget;
        }
    };

    /** 适配工作 */
    HtmlButton.prototype = Mixin(HtmlButton.prototype, HtmlWidgetMixin);
    HtmlButton.prototype.type = 'HtmlButton';

    exports.HtmlButton = HtmlButton;
} (
    namespace('widgets.factory'),
    namespace('widgets.factory.HtmlWidget'),
    namespace('mixins.HtmlWidgetMixin')
));
(function (FacHtmlButton) {

    function HtmlButton(layer, model) {
        FacHtmlButton.apply(this, arguments);
    }

    HtmlButton.prototype = Object.create(FacHtmlButton.prototype);
    HtmlButton.prototype.constructor = HtmlButton;

    HtmlButton.prototype.showS3dbModal = function (pageId, title) {
        if (ScreenModal) ScreenModal.close();
        ScreenModal = new ObserverScreen(pageId);
        title && (ScreenModal.title = title);
        ScreenModal.isDetailPage = true;
        ScreenModal.show();
    };

    /** override */
    HtmlButton.prototype.show = function () {
        var _this = this;
        var model = this.store.model;
        var screens = namespace('observer.screens');
        var options = model.option();
        var pageId = options.pageId;
        var pageType = options.pageType;
        var tpl;

        FacHtmlButton.prototype.show.apply(this, arguments);

        if (!pageId) {
            return;
        }

        tpl = '<div class="modal fade" id="buttonModal" style="display:none;">\
            <div class="modal-dialog" style="width: 80%; height: calc(100% - 60px);">\
                <div class="modal-content" style="width: 100%;height: 100%;border: none;">\
                    <div class="modal-header" style="border-bottom:0;height:0;min-height: 0;padding:0;">\
                        <button type="button" class="close" data-dismiss="modal" style="position:absolute;top:7px;\
                        right:5px;z-index:2;width:25px;height:25px;border-radius:12.5px;background:#fff;padding-bottom:2px;">\
                        <span aria-hidden="true">&times;</span></button>\
                    </div>\
                    <div class="modal-body" style="padding:0;width: 100%;height: 100%;overflow:hidden;z-index:1;"></div>\
                </div>\
            </div>\
        </div>';
        
        $(this.shape).off('click').on('click',function() {
            var $modal;
            var floatScreen;

            if (!pageId || (pageId.indexOf('<#')>-1 && pageId.indexOf('#>')>-1)) {
                return;
            }

            if (pageType === 's3db') {
                // 处理 s3db 页面
                if (AppConfig.isFactory) {
                    alert('s3db 页面只支持在主网站中进行查看!');
                } else {
                    // 重置一下鼠标，因为页面切换的时候，可能图片的 mouseout 事件不会被触发，导致鼠标未还原
                    _this.page.painterCtn.style.cursor = 'default';
                    if (options.float === 1) {
                        _this.showS3dbModal(pageId);
                    } else {
                        _this.page.close(); 
                        Spinner.spin(ElScreenContainer);
                        ScreenManager.goTo({
                            page: 'ObserverScreen',
                            id: pageId
                        });
                    }
                }
                return;
            } else {
                if (options.float === 1) {
                    $modal = $(tpl);
                    $modal.appendTo(document.body);

                    $modal.one('shown.bs.modal',function () {
                        floatScreen = new screens[pageType || 'PageScreen']({
                            id: pageId,
                            isFactory: AppConfig.isFactory
                        }, $('.modal-body', $modal)[0]);

                        floatScreen.show();
                    });
                    $modal.one('hidden.bs.modal',function () {
                        floatScreen && floatScreen.close();
                        $modal.remove();
                    });

                    WebAPI.get('/factory/page/'+pageId).done(function (rs) {
                        var $modalDialog = $modal.find('.modal-dialog');
                        var page;
                        if (rs.status !== 'OK') {
                            return;
                        }
                        page = rs.data;
                        if (page.display === 1) {
                            $modalDialog.width(page.width);
                            $modalDialog.height(page.height+30);
                        }
                        $modal.modal('show');
                    });
                    
                } else {
                    floatScreen = new screens[pageType || 'PageScreen']({
                        id: pageId,
                        isFactory: AppConfig.isFactory
                    }, _this.page.painterCtn);

                    // 重置一下鼠标，因为页面切换的时候，可能图片的 mouseout 事件不会被触发，导致鼠标未还原
                    _this.page.painterCtn.style.cursor = 'default';

                    // 辞旧迎新
                    _this.page.close();
                    floatScreen.show();
                } 
            }
        });
    };

    //覆盖window.widgets.factory.HtmlButton
    window.widgets.factory.HtmlButton = HtmlButton;

} (window.widgets.factory.HtmlButton));
(function (exports, Widget, CanvasWidgetMixin) {

    function CanvasDevice(layer, model) {
        Widget.apply(this, arguments);

        this.painter = layer.painter;
        
        this.text = [];
        this.image = null;
        this.lastInfo = {
            x: null,
            y: null,
            w: null,
            h: null
        };
    }

    CanvasDevice.prototype = Object.create(Widget.prototype);
    CanvasDevice.prototype.constructor = CanvasDevice;

    CanvasDevice.prototype.tpl = '<div class="html-widget html-device"></div>';

    CanvasDevice.prototype.init = function () {
        // 兼容一下老数据格式
        this._format();

        Widget.prototype.init.apply(this, arguments);
    };

    CanvasDevice.prototype._format = function () {};

    /** override */
    CanvasDevice.prototype.show = function () {
        var model = this.store.model;

        this.lastInfo.x = model.x();
        this.lastInfo.y = model.y();
        this.lastInfo.w = model.w();
        this.lastInfo.h = model.h();

        this.shape = new Konva.Rect({
            id: model._id(),
            fill: 'transparent'
        });
        this.update();

        this.layer.add(this.shape);
    };

    CanvasDevice.prototype.updateChildren = function () {
        var model = this.store.model;

        var dx = model.x() - this.lastInfo.x;
        var dy = model.y() - this.lastInfo.y;
        var sW = model.w() / this.lastInfo.w;
        var sH = model.h() / this.lastInfo.h;

        this.text.forEach(function (row) {
            row.update({
                x: dx + ( row.x() - model.x() ) * sW + model.x(),
                y: dy + ( row.y() - model.y() ) * sH + model.y()
            });
        });

        if (this.image) {
            this.image && this.image.update({
                x: dx + ( this.image.x() - model.x() ) * sW + model.x(),
                y: dy + ( this.image.y() - model.y() ) * sH + model.y()
            });
        }
    };

    /** override */
    CanvasDevice.prototype.update = function (e, propName) {
        var _this = this;
        var model = this.store.model;
        var options = model.option();
        var modelsNeedBeAdded = [], modelsNeedBeRemoved = [];
        var map;

        if (!propName || propName.indexOf('update.idDs') > -1) {
            if ($.fn.zTree) {
                var treeObj = $.fn.zTree.getZTreeObj('parentTree');
            }
            if (treeObj) {
                var node = treeObj.getNodeByParam('modelId', model._id());
                if (node && model.idDs) {
                    var idDs = model.idDs();
                    var name;
                    if (idDs.length > 0) {
                        name = idDs[0];
                        name !== node.name && (node.name = name, treeObj.updateNode(node));
                    } else {
                        node.name = I18n.resource.mainPanel.layerName.DEVICE;
                        treeObj.updateNode(node);
                    }
                }
            }
        }

        // 更新位置
        this.shape.position({
            x: model.x(),
            y: model.y()
        });

        this.shape.width( model.w() );
        this.shape.height( model.h() );

        this.updateChildren();

        this.lastInfo.x = model.x();
        this.lastInfo.y = model.y();
        this.lastInfo.w = model.w();
        this.lastInfo.h = model.h();

        if ( propName && propName.indexOf('update.option.tag') > -1 ) {
            map = (function () {
                var map = {};
                _this.text.forEach(function (row) {
                    var type = row.option().attrType;
                    if (typeof type !== 'undefined') {
                        map[type] = row;
                    }
                });
                return map;
            } ());

            // 更新文本控件
            Object.keys(options.tag).forEach(function (row) {
                var opt;
                if (!map[row]) {
                    // 没有的进行新增
                    opt = window.TText.prototype.createEntity();
                    opt._id = ObjectId();
                    opt.x = 10 + model.x();
                    opt.y = 10 + model.y();
                    opt.w = 100;
                    opt.h = 50;
                    opt.option.text = row;
                    opt.option.attrType = row;
                    opt.groupId = model._id();
                    opt.layerId = '';
                    // 如果当前设备支持这个属性，则进行绑点
                    if (options.tag[row].ds) {
                        opt.idDs = [options.tag[row].ds];
                    }
                    
                    modelsNeedBeAdded.push( new Model(opt) );
                } else {
                    map[row] = null;
                }
            });

            // map 中剩下的不为 null 的元素是需要删除的控件
            Object.keys(map).forEach(function (row) {
                if (map[row] !== null) {
                    modelsNeedBeRemoved.push(map[row]);
                }
            });

            this.getPainter().store.widgetModelSet.remove(modelsNeedBeRemoved);
            this.getPainter().store.widgetModelSet.append(modelsNeedBeAdded);
        }

        if ( propName && propName.indexOf('update.option.skin') > -1 ) {
            WebAPI.get('/iot/getClassDetail/'+ options.iotStore.type +'/cn').done(function (rs) {
                var index = options.skin.index;
                var skin = rs.skin[0]['list'][index];
                var imageModel, imageId;
                var promise = $.Deferred();
                var actualW;

                if (!skin) {
                    Log.warn('has not found skin in ' + options.iotStore.type + '\'s skins at index '+ index);
                    return;
                }

                imageId = skin.content.trigger['default'];
                imageModel = _this.store.imageModelSet.findByProperty('_id', imageId);

                if (!imageModel) {
                    WebAPI.post('/factory/material/getByIds', {
                        ids: [imageId]
                    }).done(function (rs) {
                        imageModel = new Model( $.extend(false, {
                            _id: rs[0]._id,
                            groupId: model._id(),
                        }, rs[0].content) );
                        _this.store.imageModelSet.append(imageModel);
                        promise.resolve();
                    });
                } else {
                    promise.resolve();
                }

                promise.done(function () {
                    var params;
                    var imageW = imageModel.interval() === 0 ? imageModel.w() : imageModel.w()/imageModel.pf();
                    var imageH = imageModel.h();
                    var x = model.x() + (model.w() - imageW)/2 ;
                    var y = model.y() + (model.h() - imageModel.h())/2;

                    params = $.extend(false, {
                        _id: ObjectId(),
                        layerId: '',
                        groupId: model._id(),
                        x: x,
                        y: y,
                        w: imageW,
                        h: imageH
                    }, window.TImage.prototype.createEntity());

                    params.option.trigger = skin.content.trigger;

                    if (!_this.image) {
                        _this.getPainter().store.widgetModelSet.append( new NestedModel(params) );
                    } else {
                        _this.image.update({
                            x: params.x,
                            y: params.y,
                            w: params.w,
                            h: params.h,
                            'option.trigger': params.option.trigger
                        });
                    }
                });
            });
        }
    };

    // 用户进行该类控件的复制时会调用此方法
    CanvasDevice.prototype.getCloneModels = function (pos,_id) {
        var arr = [];
        var options, id;
        var model = this.store.model;

        options = $.extend(true, {}, model.serialize());
        options._id = id = _id == undefined ? ObjectId() : _id;
        options.x = pos.x;
        options.y = pos.y;
        arr.push( new NestedModel(options) );

        arr = arr.concat( this.text.map(function (row) {
            var options = $.extend(true, {}, row.serialize());
            options._id = ObjectId();
            options.x += pos.dx;
            options.y += pos.dy;
            options.groupId = id;

            return new NestedModel(options);
        }) );

        options = $.extend(true, {}, this.image.serialize());
        options._id = ObjectId();
        options.x += pos.dx;
        options.y += pos.dy;
        options.groupId = id;
        arr.push( new NestedModel(options) );

        return {
            id: id,
            list: arr
        };
    };

    CanvasDevice.prototype.add = function (model) {
        var type = model.type();
        // 如果是 Html 类型的控件
        if (type === 'HtmlText') {
            this.text.push(model);
        } else if (type === 'CanvasImage') {
            this.image = model;
        }
    };

    CanvasDevice.prototype.remove = function (model) {
        var type = model.type();
        // 如果是 Html 类型的控件
        if (type === 'HtmlText') {
            for (var i = 0, len = this.text.length; i < len; i+=1) {
                if (this.text[i] === model) {
                    return this.text.splice(i, 1);
                }
            }
        } else if (type === 'CanvasImage') {
            this.image = null;
        }
    };

    CanvasDevice.prototype.close = function () {
        var modelSet = this.painter.store.widgetModelSet;

        Widget.prototype.close.apply(this, arguments);

        // 删除相应的文本控件
        modelSet.remove(this.text);

        // 删除相应的图片控件
        modelSet.remove(this.image);
    };

    /** 适配工作 */
    CanvasDevice.prototype = Mixin(CanvasDevice.prototype, CanvasWidgetMixin);
    CanvasDevice.prototype.type = 'CanvasDevice';

    exports.CanvasDevice = CanvasDevice;
} (
    namespace('widgets.factory'),
    namespace('widgets.factory.Widget'),
    namespace('mixins.CanvasWidgetMixin')
));
(function (exports, SuperClass) {

    function CanvasDevice(layer, model) {
        SuperClass.apply(this, arguments);
    }

    CanvasDevice.prototype = Object.create(SuperClass.prototype);
    CanvasDevice.prototype.constructor = CanvasDevice;

    /** override */
    CanvasDevice.prototype.show = function () {
        var options = _this.store.model.option();
    };

    exports.CanvasDevice = CanvasDevice;
} (
    namespace('widgets.observer'),
    namespace('widgets.factory.CanvasDevice') ));
(function (exports, SuperClass, HtmlWidgetMixin) {

    function HtmlText(layer, model) {
        SuperClass.apply(this, arguments);
    }

    HtmlText.prototype = Object.create(SuperClass.prototype);
    HtmlText.prototype.constructor = HtmlText;

    HtmlText.prototype.tpl = '<p class="html-widget html-text"></p>';

    HtmlText.prototype.init = function () {
        //兼容一下老数据格式
        this._format();

        SuperClass.prototype.init.apply(this, arguments);
    };

    //兼容老数据
    HtmlText.prototype._format = function () {
        var model = this.store.model;
        var options = model.option();
        if(typeof this.store.model.isHide === "undefined"){
            this.store.model.property('isHide',0);
        }
        if(options.pageId == undefined) {
            options.pageId = '';
        }
        if(options.pageType == undefined) {
            options.pageType = '';
        }
        if(!options.float) {
            options.float = 0;
        }
        if(!options.preview){
            options.preview = [];
        }
        if(typeof options.precision === 'string'){
            options.precision = parseInt(options.precision);
        }
        if(!options.equipments){
            options.equipments = [];
        }
        this.store.model.option(options);
    };

    /** override */
    HtmlText.prototype.show = function () {
        var model = this.store.model;

        SuperClass.prototype.show.apply(this, arguments);

        this.shape = HTMLParser(this.tpl);
        this.shape.id = model._id();
        this.shape.style.position = 'absolute';
        this.update();

        this.layer.add(this.shape);

        this.fixZoom();
    };

    /** override */
    HtmlText.prototype.update = function (e, propName) {
        var model = this.store.model;
        var options = model.option();
        var value;

        if (!propName || propName.indexOf('update.idDs') > -1) {
            if ($.fn.zTree) {
                var treeObj = $.fn.zTree.getZTreeObj('parentTree');
            }
        
            if (treeObj) {
                var node = treeObj.getNodeByParam('modelId', model._id());
                if (node && model.idDs) {
                    var idDs = model.idDs();
                    var name;
                    if (idDs.length > 0) {
                        name = idDs[0];
                        name !== node.name && (node.name = name, treeObj.updateNode(node));
                    } else {
                        node.name = I18n.resource.mainPanel.layerName.TEXT;
                        treeObj.updateNode(node);
                    }
                }
            }
        }
        
        if (!propName || propName.indexOf('update.x') > -1 || propName.indexOf('update.y') > -1) {
            this.shape.style.left = model.x() + 'px';
            this.shape.style.top = model.y() + 'px';
        }

        if (!propName || propName.indexOf('update.w') > -1 || propName.indexOf('update.h') > -1) {
            this.shape.style.width = model.w() + 'px';
            this.shape.style.height = model.h() + 'px';
        }

        if (!propName || propName.indexOf('update.isHide') > -1) {
            if(this.store.model.isHide()){
                this.detach();
            }else{
                this.attach();
            }
        }

        if (!propName || propName.indexOf('update.layerId') > -1) {
            this.setParent(model.layerId());
        }

        // options.text 为 string 类型，说明是在编辑 模式下
        if (typeof options.text === 'string') {
            this.shape.innerHTML = options.text;
        }
        // options.text 为 object 类型，说明是在预览模式下
        else if (typeof options.text === 'object') {
            if (options.text.value !== '' && !isNaN(options.text.value)) {
                value = parseFloat(options.text.value).toFixed(options.precision == undefined?2:options.precision);
            } else {
                value = options.text.value;
            }
            // 判断是否有 <%value%> 占位符，如果没有，则整体替换
            if (options.text.content.indexOf('<%value%>') === -1) {
                this.shape.innerHTML = value;
            } else {
                this.shape.innerHTML = options.text.content.replace('<%value%>', value);
            }
        }
        this.shape.classList.add(options.class === '' ? undefined : options.class);

        if(options.style) {
            var initStyle = options.style;
            var normalStyle = initStyle.replace(/.Normal/g, '#' + model._id().toHexString());
            var head = document.head || document.getElementsByTagName('head')[0],
                style = document.createElement('style');

            style.id = 'style-' + model._id();
            if (style.stylesheet) {
                style.stylesheet.cssText = normalStyle;
            } else {
                style.appendChild(document.createTextNode(normalStyle))
            }
            if (document.getElementById(style.id)) {
                $('#' + style.id).remove();
            }
            head.appendChild(style);
        } else {
            $('#style-' + model._id()).remove();
        }

        SuperClass.prototype.update.apply(this, arguments);
        Log.info('html text widget has been updated.');
    };
    // 获取模板中的模板参数
    HtmlText.prototype.getTplParams = function (data){
        if(data){
            var pattern = /<#\s*(\w*?)\s*#>/mg;
            var match = null;
            var params = [];
            var str = data.option.text;
            while( match = pattern.exec(str) ) {
                params.push({
                    name: match[1],
                    value: ''
                });
            }
            return params;
        }
    };
    // 应用
    HtmlText.prototype.applyTplParams = function (data){
        if(data){
            var reg = data.reg;
            var strNew = data.strNew;
            var widget = data.widget;
            widget.option.text = widget.option.text.replace(reg, strNew);
            return widget;
        }
    };

    HtmlText.prototype = Mixin(HtmlText.prototype, HtmlWidgetMixin);

    HtmlText.prototype.type = 'HtmlText';

    exports.HtmlText = HtmlText;
} (
    namespace('widgets.factory'),
    namespace('widgets.factory.HtmlWidget'),
    namespace('mixins.HtmlWidgetMixin')
));
(function (exports, FacHtmlText, TooltipMixin) {

    ///////////////
    // ERROR TIP //
    ///////////////
    var ERRTIP_DELAY = 1000;
    var $errTip = null;
    var errTipTimer = null;
    var errTip = {
        show: function () {
            $errTip && $errTip.css({
                'display': '',
                'opacity': 1
            });
            if (errTipTimer) { window.clearTimeout(errTipTimer); errTipTimer = null; }
        },
        hide: function () {
            if (!errTipTimer) {
                errTipTimer = window.setTimeout(function () {
                    $errTip && $errTip.css('opacity', 0);
                    errTipTimer = null;
                }, ERRTIP_DELAY);
            }
        }
    };
    var errTipTemplate = '<div class="gray-scrollbar" id="errTip"></div>';

    function HtmlText(layer, model) {
        FacHtmlText.apply(this, arguments);
    }

    HtmlText.prototype = Object.create(FacHtmlText.prototype);
    HtmlText.prototype.constructor = HtmlText;

    /** override */
    HtmlText.prototype.show = function () {
        var _this = this;
        var model = this.store.model;
        var screens = namespace('observer.screens');
        var options = model.option();
        var pageId = options.pageId;
        var pageType = options.pageType;
        var tpl = '<div class="modal fade" id="buttonModal" style="display:none;">\
            <div class="modal-dialog" style="width: 80%; height: calc(100% - 60px);">\
                <div class="modal-content" style="width: 100%;height: 100%;border: none;">\
                    <div class="modal-header" style="border-bottom:0;height:0;min-height: 0;padding:0;">\
                        <button type="button" class="close" data-dismiss="modal" style="position:absolute;top:7px;\
                        right:5px;z-index:2;width:25px;height:25px;border-radius:12.5px;background:#fff;padding-bottom:2px;">\
                        <span aria-hidden="true">&times;</span></button>\
                    </div>\
                    <div class="modal-body" style="padding:0;width: 100%;height: 100%;overflow:hidden;z-index:1;"></div>\
                </div>\
            </div>\
        </div>';

        // 初始化所有绑定事件
        $(this.shape).off();

        FacHtmlText.prototype.show.apply(this, arguments);

        if (model.idDs().length) {
            this.enableTooltip && this.initTooltip({
                clickable: AppConfig.isFactory === 0
            });
        }

        if (pageId && pageId != '') {
            this.shape.style.cursor = 'pointer';
        }
        $(this.shape).on('click',function() {
            var $modal;
            var floatScreen;

            if (!pageId) {
                return;
            }

            if (options.float === 1) {
                $modal = $(tpl);
                $modal.appendTo(document.body);

                $modal.one('shown.bs.modal',function () {
                    floatScreen = new screens[pageType || 'PageScreen']({
                        id: pageId,
                        isFactory: AppConfig.isFactory
                    }, $('.modal-body', $modal)[0]);

                    floatScreen.show();
                });
                $modal.one('hidden.bs.modal',function () {
                    floatScreen && floatScreen.close();
                    $modal.remove();
                });

                WebAPI.get('/factory/page/'+pageId).done(function (rs) {
                    var $modalDialog = $modal.find('.modal-dialog');
                    var page;
                    if (rs.status !== 'OK') {
                        return;
                    }
                    page = rs.data;
                    if (page.display === 1) {
                        $modalDialog.width(page.width);
                        $modalDialog.height(page.height+30);
                    }
                    $modal.modal('show');
                });
                
            } else {
                floatScreen = new screens[pageType || 'PageScreen']({
                    id: pageId,
                    isFactory: AppConfig.isFactory
                }, _this.page.painterCtn);

                // 重置一下鼠标，因为页面切换的时候，可能图片的 mouseout 事件不会被触发，导致鼠标未还原
                _this.page.painterCtn.style.cursor = 'default';

                // 辞旧迎新
                _this.page.close();
                floatScreen.show();
            }
        });
    };

    /**
     * @override
     */
    HtmlText.prototype.update = function (e, propName) {
        var model = this.store.model;
        var faults;
        var maxGrade;

        if (propName && propName.indexOf('update.option.faults') > -1) {
            faults = model['option.faults']();
            this.shape.classList.remove('level-normal', 'level-warn', 'level-danger');
            if (faults.length) {
                faults.forEach(function (row) {
                    if (typeof maxGrade === 'undefined' || row.grade > maxGrade) {
                        maxGrade = row.grade;
                    }
                });
                if (maxGrade > 1) {
                    // danger
                    this.shape.classList.add('level-danger');
                } else if (maxGrade > 0) {
                    this.shape.classList.add('level-warn');
                } else {
                    this.shape.classList.add('level-normal');
                }
            }
            this._attachHoverEvents();
        }

        FacHtmlText.prototype.update.apply(this, arguments);
    };

    // 绑定鼠标 hover 事件
    HtmlText.prototype._attachHoverEvents = function () {
        var _this = this;
        // 获取最新的 faults 信息
        var faults = this.store.model['option.faults']();
        var $shape = $(this.shape);

        $shape.off('hover');

        if (!faults.length) {
            errTip.hide();
            return;
        }

        // fault tip 的显示隐藏
        $shape.hover(function (e) {
            var container = _this.painter.domContainer;
            var offset = $(container).offset();
            _this._createErrTip();
            _this.checkPopoverBoundary(container, $errTip, e.pageX - offset.left, e.pageY - offset.top);
            errTip.show();
            e.stopPropagation();
        }, function (e) {
            errTip.hide();
            e.stopPropagation();
        });
    };

    HtmlText.prototype._returnToMoment = function (date) {
        this.painter.getPage().enterReplayMode(new Date(date));
    };

    HtmlText.prototype._createErrTip = function () {
        var $find = $(), $each, _this = this;
        var faults = this.store.model['option.faults']();

        if (!$errTip || $errTip.length === 0) {
            $errTip = $(errTipTemplate);
            $errTip.on('mouseenter', function (e) {
                errTip.show();
                e.stopPropagation();
            }).on('mouseleave', function (e) {
                errTip.hide();
                e.stopPropagation();
            }).on('transitionend', function (e) {
                e = e.originalEvent;
                if (e.propertyName === 'opacity' && e.target.style.opacity === '0') {
                    e.target.style.display = 'none';
                }
                e.stopPropagation();
            }).on('click', '.err-replay', function () {
                var $this = $(this);
                var date = $this.siblings('span[data-time]')[0].dataset.time;

                _this._returnToMoment(date);
            });
        }

        if (!$.contains(this.painter.domContainer, errTip[0])) {
            $(this.painter.domContainer).append($errTip);
        }

        for (var i = 0, len = faults.length; i < len; i++) {
            $each = $('#divPaneNotice').find('[faultid="' + faults[i].faultId + '"]').clone(true);
            // 去除 mouseenter 和 mouseleave 事件
            $each.each(function () {
                this.onmouseenter = null;
                this.onmouseleave = null;
            });
            $('<span class="glyphicon glyphicon-play span-hover-pointer grow err-replay"></span>').appendTo($each.children('div')[0]);
            $find = $find.add($each);
        }

        $errTip.html($find);

        return $errTip;
    };

    HtmlText.prototype._checkPopoverBoundary = function (container, $popover, pageX, pageY) {
        var $container = $(container),
            offsetX = 10,
            offsetY = 0,
            popoverWidth = $popover.width(),
            popoverHeight = $popover.height(),
            rightX = Math.min(pageX + popoverWidth + offsetX, $container.width() - 5),
            rightY = Math.min(pageY + popoverHeight + offsetY, $container.height() - 5);

        $popover.css({
            left: rightX - popoverWidth + offsetX,
            top: rightY - popoverHeight + offsetY
        })
    };

    HtmlText.prototype = Mixin(HtmlText.prototype, TooltipMixin);

    //覆盖
    exports.HtmlText = HtmlText;
} (
    namespace('widgets.factory'),
    namespace('widgets.factory.HtmlText'),
    namespace('mixins.TooltipMixin')
));
(function (exports, SuperClass, HtmlWidgetMixin) {

    function HtmlScreenContainer(layer, model) {
        SuperClass.apply(this, arguments);
    }

    HtmlScreenContainer.prototype = Object.create(SuperClass.prototype);
    HtmlScreenContainer.prototype.constructor = HtmlScreenContainer;

    HtmlScreenContainer.prototype.tpl = '<div class="html-widget html-screen"></div>';
    HtmlScreenContainer.prototype.init = function () {
        //兼容一下老数据格式
        this._format();

        SuperClass.prototype.init.apply(this, arguments);
    };

    HtmlScreenContainer.prototype._format = function () {
        if(typeof this.store.model.isHide === "undefined"){
            this.store.model.property('isHide',0);
        }
    };
    /** override */
    HtmlScreenContainer.prototype.show = function () {
        var model = this.store.model;

        SuperClass.prototype.show.apply(this, arguments);

        this.shape = HTMLParser(this.tpl);
        this.shape.id = model._id();
        this.shape.style.position = 'absolute';
        this.shape.style.backgroundImage = 'url("/static/app/WebFactory/themes/default/images/demo/htmlScreen.png")';
        this.shape.style.backgroundSize = '100% 100%';
        this.shape.style.backgroundColor = 'rgba(238, 238, 238,0.6)';
        //this.shape.style.border = '1px dashed #aaa';
        this.update();

        this.layer.add(this.shape);
    };

    /** override */
    HtmlScreenContainer.prototype.update = function (e, propName) {
        var model = this.store.model;
        var options = model.option();

        this.shape.style.left = model.x() + 'px';
        this.shape.style.top = model.y() + 'px';
        this.shape.style.width = model.w() + 'px';
        this.shape.style.height = model.h() + 'px';
        //this.shape.innerHTML = options.html;
        if(!model.option().pageId){model.option().pageId = ''}
        if(!model.option().pageType){model.option().pageType = ''}
        if (options.style) {
            var initStyle = options.style;
            var normalStyle = initStyle.replace(/.Normal/g, '#' + model._id().toHexString());
            var head = document.head || document.getElementsByTagName('head')[0],
                style = document.createElement('style');
            //style.type = 'text/css';
            style.id = 'style-' + model._id();
            if (style.stylesheet) {
                style.stylesheet.cssText = normalStyle;
            } else {
                style.appendChild(document.createTextNode(normalStyle));
            }
            if (document.getElementById(style.id)) {
                $('#' + style.id).remove();
            }
            head.appendChild(style);
        } else {
            $('#style-' + model._id()).remove();
        }
        if (!propName || propName.indexOf('update.isHide') > -1) {
            if(this.store.model.isHide()){
                this.detach();
            }else{
                this.attach();
            }
        }

        if (!propName || propName.indexOf('update.layerId') > -1) {
            this.setParent(model.layerId());
        }

        SuperClass.prototype.update.apply(this, arguments);
        Log.info('html container widget has been updated.');
    };

    /** 适配工作 */
    HtmlScreenContainer.prototype = Mixin(HtmlScreenContainer.prototype, HtmlWidgetMixin);
    HtmlScreenContainer.prototype.type = 'HtmlScreenContainer';

    exports.HtmlScreenContainer = HtmlScreenContainer;
} (
    namespace('widgets.factory'),
    namespace('widgets.factory.HtmlWidget'),
    namespace('mixins.HtmlWidgetMixin')
));
(function (FacHtmlScreenContainer) {

    function HtmlScreenContainer(layer, model) {
        FacHtmlScreenContainer.apply(this, arguments);
    }

    HtmlScreenContainer.prototype = Object.create(FacHtmlScreenContainer.prototype);
    HtmlScreenContainer.prototype.constructor = HtmlScreenContainer;

    /** override */
    HtmlScreenContainer.prototype.show = function () {
        var model = this.store.model;
        var screens = namespace('observer.screens');
        var options = model.option();

        FacHtmlScreenContainer.prototype.show.apply(this, arguments);
        this.shape.style.background = 'none';

        var pageId = options.pageId;
        var pageType = options.pageType;

        if (!pageId) {
            return;
        }
        
        this.page = new screens[pageType || 'PageScreen']({
            id: pageId,
            isFactory: AppConfig.isFactory
        }, this.shape);
        this.page.show();
    };

    HtmlScreenContainer.prototype.close = function () {
        FacHtmlScreenContainer.prototype.close.apply(this, arguments);
        if (this.page) {
            this.page.close();
            this.page = null;
        }
    };

    //覆盖window.widgets.factory.HtmlScreenContainer
    window.widgets.factory.HtmlScreenContainer = HtmlScreenContainer;

} (window.widgets.factory.HtmlScreenContainer));
// dashboard 控件适配基类
;(function (exports, SuperClass, HtmlWidgetMixin) {

    function HtmlDashboard(layer, model) {
        SuperClass.apply(this, arguments);

        this.ins = null;
        this.modalConfigPane = null;
    }

    HtmlDashboard.prototype = Object.create(SuperClass.prototype);
    HtmlDashboard.prototype.constructor = HtmlDashboard;

    HtmlDashboard.prototype.tpl = '<div class="html-widget html-container"></div>';

    HtmlDashboard.prototype.initModalConfigPane = function () {
        var page = this.painter.getPage();
        var container;

        if (page.modalConfigPane) {
            this.modalConfigPane = page.modalConfigPane;
            return;
        }

        if ( !(container = page.windowCtn.querySelector('#energyModal')) ) {
            container = document.createElement('div');
            container.id = 'energyModal';
            container.style.position = 'absolute';
            container.style.left = 0;
            container.style.top = 0;
            page.windowCtn.appendChild(container);
        }
        this.modalConfigPane = page.modalConfigPane = new modalConfigurePane(container, this, 'dashboard');
        this.modalConfigPane.show();
    };

    HtmlDashboard.prototype.init = function () {
        //兼容一下老数据格式
        this._format();

        SuperClass.prototype.init.apply(this, arguments);
    };

    HtmlDashboard.prototype._format = function () {
        var options = this.store.model.option();
        if(typeof this.store.model.isHide === "undefined"){
            this.store.model.property('isHide',0);
        }
        if (options.bg == undefined) {
            options.bg = 'blackBg';
        }
        this.store.model.option(options);
    };

    /** override */
    HtmlDashboard.prototype.show = function () {
        var model = this.store.model;

        SuperClass.prototype.show.apply(this, arguments);

        this.shape = HTMLParser(this.tpl);
        this.shape.id = model._id();
        this.shape.style.position = 'absolute';
        this.shape.style.border = '1px dashed #aaa';
        this.layer.add(this.shape);

        this.update();

        this._initWidget();
    };

    HtmlDashboard.prototype._initWidget = function () {
        var model = this.store.model;
        var options = this.store.model.option();
        var clazz, ioc;

        var bgClassName = this.store.model.option().bg;
        $(this.shape).addClass(bgClassName);
        
        if (!options.type) {
            Log.warn('html dashboard widgets must have a type.');
            return;
        }

        ioc = this.painter.getPage().factoryIoC();
        clazz = ioc.getModel(options.type);

        if (!clazz) {
            Log.error('Can\' find modal class "' + options.type + '" in factory ioc!');
            return;
        }
        clazz = this._getWrapClazz(clazz);
        this.ins = new clazz(this, {
            modal: options
        });

        this.render();
    };

    HtmlDashboard.prototype._getWrapClazz = function (clazz) {
        var wrapClazz = function F() {
            clazz.apply(this, arguments);
        }

        wrapClazz.prototype = Object.create(clazz.prototype);

        // 重写一些方法，以做到兼容 PageScreen
        wrapClazz.prototype.initContainer = function () {
            this.container = this.screen.shape;
        };

        return wrapClazz;
    };

    /** override */
    HtmlDashboard.prototype.update = function (e, propName) {
        var model = this.store.model;
        var options = model.option();
        var scale;

        if (!propName || propName.indexOf('update.x') > -1 || propName.indexOf('update.y') > -1) {
            this.shape.style.left = model.x() + 'px';
            this.shape.style.top = model.y() + 'px';
        }

        if (!propName || propName.indexOf('update.w') > -1 || propName.indexOf('update.h') > -1) {
            this.shape.style.width = model.w() + 'px';
            this.shape.style.height = model.h() + 'px';
            if (propName) {
                typeof this.ins.resize === 'function' && this.ins.resize();
            }
        }

        if (propName && propName.indexOf('update.option') > -1) {
            this.render();
        }
        if (!propName || propName.indexOf('update.isHide') > -1) {
            if(this.store.model.isHide()){
                this.detach();
            }else{
                this.attach();
            }
        }

        if (!propName || propName.indexOf('update.layerId') > -1) {
            this.setParent(model.layerId());
        }

        SuperClass.prototype.update.apply(this, arguments);

        Log.info('html container widget has been updated.');
    };

    HtmlDashboard.prototype.render = function () {
        this.ins.render();
    };

    HtmlDashboard.prototype.showConfigModal = function () {
        this.ins.modalInit();
    };

    /** 适配工作 */
    HtmlDashboard.prototype = Mixin(HtmlDashboard.prototype, HtmlWidgetMixin);
    HtmlDashboard.prototype.type = 'HtmlDashboard';

    exports.HtmlDashboard = HtmlDashboard;
} (
    namespace('widgets.factory'),
    namespace('widgets.factory.HtmlWidget'),
    namespace('mixins.HtmlWidgetMixin')
));
// dashboard 控件适配基类
;(function (exports, SuperClass) {

    function HtmlDashboard(layer, model) {
        SuperClass.apply(this, arguments);
    }

    HtmlDashboard.prototype = Object.create(SuperClass.prototype);
    HtmlDashboard.prototype.constructor = HtmlDashboard;
    
    /**
     * @override
     */
    HtmlDashboard.prototype.show = function () {
        SuperClass.prototype.show.apply(this, arguments);

        // 预览时不显示边框
        this.shape.style.border = 'none';
    };

    /**
     * @override
     */
    HtmlDashboard.prototype.update = function (e, propName) {
        var model = this.store.model;
        var scale;
        var dataMap;

        SuperClass.prototype.update.apply(this, arguments);

        if (!propName || propName.indexOf('update.option.display') > -1) {
            if (model['option.display']() === 1) {
                scale = this.painter.getScale();
                this.shape.style.left = model.x() * scale.x + 'px';
                this.shape.style.top = model.y() * scale.y + 'px';
                this.shape.style.width = model.w() * scale.x + 'px';
                this.shape.style.height = model.h() * scale.y + 'px';
            }
        }

        // 更新时候的图片变化
        if ( propName && propName.indexOf('update.option.text') > -1 ) {
            dataMap = model['option.text.value']();
            this.ins.update(Object.keys(dataMap).map(function(dsId) {
                return {
                    dsItemId: dsId,
                    data: dataMap[dsId]
                };
            }));
        }
    };

    exports.HtmlDashboard = HtmlDashboard;
} (
    namespace('widgets.factory'),
    namespace('widgets.factory.HtmlDashboard')
));
(function () {

    window.GUtil = {
        DEG: 180 / Math.PI,
        SHADOW_SHAPE_NAME: '__shadowShape',
        isPointInRect: function (x, y, rx, ry, rw, rh) {
            return x>rx && x<(rx+rw) && y>ry && y<(ry+rh);
        },
        isIntersect: function (a, b) {
            return !(
                b.left > a.right ||
                b.right < a.left ||
                b.top > a.bottom ||
                b.bottom < a.top
            );
        },
        getIntersection: function (x, y, layer) {
            return layer.getIntersection({
                x: x,
                y: y
            });
        },
        /**
         * 返回给定的点在指定 Html 图层的哪个图形范围中
         * @deprecated html图层和canvas图层进行合并后，此方法不再使用 20160707
         * @param  {Number} x          给定点的横坐标
         * @param  {Number} y          给定点的纵坐标
         * @param  {Array|Object} layer      指定的容器
         * @param  {Array} metrix      当前的转换矩阵，表示当前页面的缩放和偏移量
         * @return {Object} 若不在任何图形中，则返回 null，否则返回找到的图形
         */
        getIntersectionByPointInHtmlLayers: function (x, y, layer, metrix) {
            var children, pos;
            var stack = [];
            metrix = metrix || [1, 0, 0, 1, 0, 0];

            if( Object.prototype.toString.call(layer) === '[object Array]' ) {
                this.sortShapesByZIndex(layer);
                stack = stack.concat(layer);
                layer = stack.pop();
            }

            if(!layer) return null;

            do {
                /** 判断有没有子节点 */
                /** 如果有子节点，则加入栈中进行循环 */
                if( ['Layer', 'Group'].indexOf(layer.getType()) > -1 ) {
                    children = layer.getChildren();
                    // children 数组按照 z-index 排序
                    this.sortShapesByZIndex(children);
                    stack = stack.concat(Array.prototype.slice.call(children));
                    continue;
                }
                
                pos = getShapeRect(layer);
                if( this.isPointInRect(x, y, pos.x, pos.y, pos.w, pos.h) ) {
                    return layer;
                }
                
            } while(layer = stack.pop());

            return null;
        },
        /**
         * 返回给定的点在指定 Canvas 图层的哪个图形范围中
         * @deprecated html图层和canvas图层进行合并后，此方法不再使用 20160707
         * @param  {Number} x          给定点的横坐标
         * @param  {Number} y          给定点的纵坐标
         * @param  {Array|Object} layer      指定的 Factory Canvas 图层对象
         * @return {Object} 若不在任何图形中，则返回 null，否则返回找到的图形
         */
        getIntersectionByPointInCanvasLayers: function (x, y, layer, ignoreType) {
            var layerShape = null;
            var findShape = null;
            var shape = null;
            var stack = [], s;

            ignoreType = typeof ignoreType === 'undefined' ? [] : [ignoreType];
            ignoreType = ['Layer', 'Group'].concat(ignoreType);

            if ( Object.prototype.toString.call(layer) !== '[object Array]' ) {
                layer = [layer];
            }

            // 过滤掉非 canvas 图层
            layer = layer.filter(function (row) {
                return row.getLayerType() === 'canvas';
            });

            // 如果没有找到，则返回 null
            if (layer.length === 0) return null;

            // 获取 Layer 图层
            layerShape = layer[0].shape.getLayer();
            // 在 Layer 图层中查找指定位置有无图形
            // 注意，这里返回的 findShape 是 Konva 对象
            findShape = layerShape.getIntersection({
                x: x,
                y: y
            });

            if (!findShape) return null;

            // 深度搜索
            stack = stack.concat(layer);
            while ( s = stack.pop() ) {
                if (ignoreType.indexOf(s.getType()) > -1 ) {
                    stack = stack.concat(s.children);
                    continue;
                }

                if (s.hasShape(findShape)) {
                    shape = s;
                    break;
                }
            }

            return shape;
        },
        /**
         * 返回给定的点在指定图层的哪个图形范围中
         */
        getIntersectionByPoint: function (x, y, canvasLayer, rootLayer, ignoreType) {
            var layerShape = null;
            var shape = null;
            var stack = [], s;

            ignoreType = ignoreType || [];

            // 获取 canvas 图层对应的 Konva 图层对象
            layerShape = canvasLayer.getShape().getLayer();
            // 在 canvas 图层中查找指定位置有无图形
            // 注意，这里返回的 shape 是 Konva 对象
            shape = layerShape.getIntersection({
                x: x,
                y: y
            });

            if (!shape) return null;

            // 深度搜索
            rootLayer.getWidgets(true).some(function (row) {
                if (ignoreType.indexOf(row.getType()) > -1) {
                    return false;
                }
                if (row.hasShape(shape)) {
                    shape = row;
                    return true;
                }
            });
            return shape;
        },
        getIntersectionByRect: function (x, y, w, h, rootLayer) {
            var hitShapes = [];
            var isHit;
            var stack = [];
            var pos;
            var shape;
            var point, p1, p2;

            if(!rootLayer) return [];

            stack = rootLayer.getWidgets(true).filter(function (row) {
                return row.isVisible();
            });
            
            while (shape = stack.pop()) {
                pos = this.getShapeRect(shape);
                if (shape.store.model.type() === 'CanvasPipe') {
                    point = shape.store.model['option.points']();
                    //坐标转换
                    p1 = point[0];
                    p2 = point[1];
                    //判断线和方形有无重合：先判断线和四边有无交叉，有则有重合，无则判断线的一端点是否在方形内，是则有重合，否则无重合。
                    isHit = this.getIntersectionByLine(p1, p2, {
                        x: x,
                        y: y,
                        w: w,
                        h: h
                    });
                } else if (shape.store.model.type() === 'CanvasHeat'||shape.store.model.type() === 'CanvasPolygon') {
                    var point = (function (points) {
                        var arr = [];
                        for (var i = 0, len = points.length; i < len; i += 2) {
                            arr.push({
                                x: points[i],
                                y: points[i + 1]
                            })
                        }
                        return arr;
                    })(shape.store.model['option.points']());
                    
                    for (var i = 0, len = point.length; i < len; i++) {
                        //坐标转换
                        var p1 = point[i%(len)],
                            p2 = point[(i+1)%(len)];
                        //判断线和方形有无重合：先判断线和四边有无交叉，有则有重合，无则判断线的一端点是否在方形内，是则有重合，否则无重合。
                        isHit = this.getIntersectionByLine(p1, p2, {
                            x: x,
                            y: y,
                            w: w,
                            h: h
                        });
                        if (isHit) {
                            break;
                        }
                    }
                } else {
                    isHit = this.isIntersect({
                        left: pos.x,
                        top: pos.y,
                        right: pos.x+pos.w,
                        bottom: pos.y+pos.h
                    }, {
                        left: x,
                        top: y,
                        right: x+w,
                        bottom: y+h
                    });
                }
                

                if(isHit) {
                    hitShapes.push(shape);
                }
            }

            return hitShapes;
        },
        // 判断线和方形4边是否相交
        getIntersectionByLine: (function () {
            // 获取 v1 向量到 v2 向量，是顺时针，还是逆时针
            // 返回值大于0为逆时针
            // 返回值小于0为顺时针
            function getDirection(v1, v2) {
                return v1.x * v2.y - v1.y * v2.x;
            }

            return function (p1, p2, rect) {
                //方形4端点
                var rectPoints = [{
                    x:rect.x,
                    y:rect.y
                }, {
                    x:rect.x+rect.w,
                    y:rect.y
                }, {
                    x:rect.x+rect.w,
                    y:rect.y+rect.h
                }, {
                    x:rect.x,
                    y:rect.y+rect.h
                }];

                //取方形四边与线比较 判断有无交叉
                for (var i = 0; i < 4; i++) {
                    var p3 = rectPoints[i],
                        p4 = rectPoints[(i+1)%4];
                    //以两条线的一端点各取3条向量
                    var vector12 = { x: p2.x - p1.x, y: p2.y - p1.y },
                        vector13 = { x: p3.x - p1.x, y: p3.y - p1.y },
                        vector14 = { x: p4.x - p1.x, y: p4.y - p1.y };

                    var vector34 = { x: p4.x - p3.x, y: p4.y - p3.y },
                        vector31 = { x: p1.x - p3.x, y: p1.y - p3.y },
                        vector32 = { x: p2.x - p3.x, y: p2.y - p3.y };

                    if ( getDirection(vector12, vector13) * getDirection(vector12, vector14) < 0 && 
                        getDirection(vector34, vector31) * getDirection(vector34 , vector32) < 0) {
                        return true;
                    }
                }

                // 在这里处理线段在矩形内部的情况
                // 这里只要判断一个点即可
                if ( p1.x > rect.x && p1.x < (rect.x + rect.w) && 
                    p1.y > rect.y && p1.y < (rect.y + rect.h)) {
                    return true;
                }

                return false;
            };
        } ()),

        sortShapesByZIndex: function (shapes) {
            /** Konva 的 Collection 使用 sort 按照 index 排序时会有问题 */
            if(shapes instanceof Konva.Collection) return;
            shapes.sort(function (first, second) {
                return first.getZIndex() > second.getZIndex();
            });
        },
        getPipeRect: function (points) {
            var xMin, xMax, yMin, yMax;
            var pArr = [];
            
            // 先进行一次格式转换
            points.forEach(function (row) {
                if (typeof row !== 'number') {
                    pArr.push(row.x);
                    pArr.push(row.y);
                    return;
                }
                pArr.push(row);
            });

            for (var i = 0, len = pArr.length; i < len ; i += 2){
                if (typeof xMin === 'undefined' || pArr[i] < xMin) {
                    xMin = pArr[i];
                }
                if (typeof xMax === 'undefined' || pArr[i] > xMax) {
                    xMax = pArr[i];
                }
            }
            for (var i = 1, len = pArr.length; i < len ; i += 2){
                if (typeof yMin === 'undefined' || pArr[i] < yMin) {
                    yMin = pArr[i];
                }
                if (typeof yMax === 'undefined' || pArr[i] > yMax) {
                    yMax = pArr[i];
                }
            }
            return {
                xMin: xMin,
                yMin: yMin,
                xMax: xMax,
                yMax: yMax,
                w: Math.max(xMax - xMin, 10),
                h: Math.max(yMax - yMin, 10)
            }
        },
        /** 坐标转换 */
        transform: function () {
            var x, y, w, h, m, inverse;
            var pos;
            if(arguments.length > 3) {
                x = arguments[0];
                y = arguments[1];
                w = arguments[2];
                h = arguments[3];
                m = arguments[4];
                inverse = arguments[5];
            } else {
                pos = arguments[0].getAbsolutePosition();
                x = pos.x;
                y = pos.y;
                w = arguments[0].width();
                h = arguments[0].height();
                m = arguments[1];
                inverse = arguments[2];
            }

            /** 
             * 处理 width 和 height 为负数的情况
             * width 和 height 为负数是允许存在的
             * width 为负数，相当于做垂直翻转
             * height 为负数，相当于做水平翻转
             */
            if(w < 0) {
                w = Math.abs(w);
                x = x - w;
            }
            if(h < 0) {
                h = Math.abs(h);
                y = y - h;
            }

            return inverse === true ? {
                x: x,
                y: y,
                w: w / m[0],
                h: h / m[3]
            } : {
                x: x,
                y: y,
                w: w * m[0],
                h: h * m[3]
            };
        },
        getDistance: function (p1, p2) {
            var dx = Math.abs(p1.x - p2.x);
            var dy = Math.abs(p1.y - p2.y);

            return Math.sqrt(dx*dx+dy*dy);
        },
        /**
         * 计算点 p3 在线段 (p1, p2) 上的投影
         * 额外规则：若最终计算出的投影点 p0 在线段 (p1, p2) 之外，
         * 则返回超出方向的最大点（在这里为 p1 或 p2）
         * 计算公式
         * y = ((x2-x1)(y2-y1)(x3-x1)+(y2-y1)(y2-y1)y3+(x2-x1)(x2-x1)y1) / ((x2-x1)(x2-x1)+(y2-y1)(y2-y1))
         * x = x3 - (y2-y1)(y-y3)/(x2-x1);
         * 计算公式由算法组-张文博提供，感谢文博
         * @param  {Array} p1 线段的一个端点
         * @param  {Array} p2 线段的另一个端点
         * @param  {Array} p3 线段外一点
         * @return {Array}    投影点
         */
        getPointProjectionOnLine: function (p1, p2, p3) {
            // p[0]
            var x;
            // p[1]
            var y;
            // x2 - x1
            var a;
            // a * a
            var a2;
            // y2 - y1
            var b;
            // b * b
            var b2;
            // 是否在矩形内
            var isInRect = false;

            // 如果 x2 等于 x1，则说明 (p1, p2) 垂直于 x 轴，斜率不存在
            // 这里可以之间换算出结果
            if (p1[0] === p2[0]) {
                x = p1[0];
                y = p3[1];
            } else {
                a = p2[0] - p1[0];
                a2 = a * a;
                b = p2[1] - p1[1];
                b2 = b * b;
                // 直接套公式
                y = (a*b*(p3[0]-p1[0])+b2*p3[1]+a2*p1[1]) / (a2+b2);
                x = p3[0] - b*(y-p3[1]) / a;
            }

            // 处理投影不在线段上的情况
            if (p1[0] < p2[0]) {
                if (x < p1[0]) {
                    x = p1[0];
                    y = p1[1];
                } else if (x > p2[0]) {
                    x = p2[0];
                    y = p2[1];
                }
            } else {
                if (x < p2[0]) {
                    x = p2[0];
                    y = p2[1];
                } else if (x > p1[0]) {
                    x = p1[0];
                    y = p1[1];
                }
            }

            return {
                x: x,
                y: y
            };
        },
        getShapeRect: function (shape) {
            var pos = shape.position();

            return {
                x: pos.x,
                y: pos.y,
                w: shape.width(),
                h: shape.height()
            };
        },
        loadImage: (function () {
            var cacheMap = {};

            return function (url, callback, crossOrigin) {
                var image = new Image();

                // 如果缓存中有该图片，则无需重新加载
                if (cacheMap[url]) {
                    cacheMap[url].done(callback);
                    return;
                }

                cacheMap[url] = $.Deferred();
                cacheMap[url].done(callback);

                if (crossOrigin) {
                    image.crossOrigin = crossOrigin;
                }
                image.src = url;
                image.onload = function () {
                    cacheMap[url].resolve(this)
                };
            };
        }())
    };
} ());
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
(function (exports, SuperClass) {

    function GHtmlStage() {
        SuperClass.apply(this, arguments);

        this.store = {};
        this.store.background = null;
    }

    GHtmlStage.prototype = Object.create(SuperClass.prototype);
    GHtmlStage.prototype.constructor = GHtmlStage;

    /** override */
    GHtmlStage.prototype.init = function () {
        var w = this.painter.stage.width();
        var h = this.painter.stage.height();
        var pageWidth = this.painter.pageWidth;
        var pageHeight = this.painter.pageHeight;
        
        this.shape = document.createElement('div');
        this.shape.className = 'html-layer';
        this.shape.style.width = pageWidth + 'px';
        this.shape.style.height = pageHeight + 'px';
        this.shape.style.left = (w - pageWidth) / 2 + 'px';
        this.shape.style.top = (h - pageHeight) / 2 + 'px';
        this.shape.style.zIndex = 3;

        this.painter.stage.getContent().appendChild(this.shape);
    };

    GHtmlStage.prototype.setZIndex = function (zIndex) {
        this.shape.style.zIndex = zIndex;
    };
    GHtmlStage.prototype.setBackground = function (background) {
        var $bgShape = $(this.shape);
        var $userBgShape = $bgShape.find(".html-inner-bg");

        this.store.background = background;

        if($userBgShape.length === 0) {
            this.shape.style.backgroundImage = 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAIAAABLbSncAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAChJREFUeNpiPHPmDAMMGBsbw9lMDDgA6RKM%2F%2F%2F%2Fh3POnj1LCzsAAgwAQtYIcFfEyzkAAAAASUVORK5CYII%3D)';
            
            $bgShape.html('<div style="width:100%;height:100%" class="html-inner-bg" id="innerBg"></div>');
            $userBgShape = $bgShape.find(".html-inner-bg");
        }

        // 添加默认值
        if (!background) {
            background = {
                type: 'color',
                color: '#e1e3e5'
            };
        }

        if (background.type == "image") {
            if(background.display == "tile") {
                $userBgShape.css({
                    'background-image':'url('+background.url+')',
                    "background-repeat":"repeat",
                    "background-size":"contain"
                });
            }else{
                $userBgShape.css({
                    'background-image':'url('+background.url+')',
                    "background-repeat":"no-repeat",
                    "background-size":"100% 100%"
                });
            }
        } else {
            $userBgShape.css("background-color", background.color);
        }
    };


    GHtmlStage.prototype.getBackground = function () {
        return this.store.background;
    };

    GHtmlStage.prototype.getChildren = function () {
        return this.children;
    };

    GHtmlStage.prototype.add = function (shape) {
        this.shape.appendChild(shape);
    };

    GHtmlStage.prototype.draw = function () { /** 不需要做任何事 */ };

    GHtmlStage.prototype.position = function (params) {
        if(typeof params !== 'undefined') {
            this.x(params.x);
            this.y(params.y);
            return true;
        }

        return {
            x: this.x(),
            y: this.y()
        };
    };

    GHtmlStage.prototype.x = function (val) {
        if(Object.prototype.toString.call(val) === '[object Number]') {
            return this.shape.style.left = val + 'px';
        }
        return parseFloat(this.shape.style.left || 0);
    };

    GHtmlStage.prototype.y = function (val) {
        if(Object.prototype.toString.call(val) === '[object Number]') {
            return this.shape.style.top = val + 'px';
        }
        return parseFloat(this.shape.style.top || 0);
    };

    GHtmlStage.prototype.offsetX = function (v) {
        var style;
        if(v !== undefined) {
            return this.shape.style.left = v + 'px';
        }
        style = window.getComputedStyle(this.shape);
        return parseFloat(style.left);
    };

    GHtmlStage.prototype.offsetY = function (v) {
        var style;
        if(v !== undefined) {
            return this.shape.style.top = v + 'px';
        }
        style = window.getComputedStyle(this.shape);
        return parseFloat(style.top);
    };

    GHtmlStage.prototype.width = function () {};

    GHtmlStage.prototype.height = function () {};

    GHtmlStage.prototype.getType = function () {
        return 'Stage';
    };

    GHtmlStage.prototype.scale = function (scaleX, scaleY) {
        var tW = this.painter.stage.width();
        var tH = this.painter.stage.height();
        var w = parseFloat(this.painter.pageWidth);
        var h = parseFloat(this.painter.pageHeight);

        if (typeof scaleY === 'undefined') {
            scaleY = scaleX;
        }

        this.shape.style.transform = 'scale('+scaleX+', '+scaleY+')';
        this.shape.style.width = w + 'px';
        this.shape.style.height = h + 'px';
        this.shape.style.left = (tW - w*scaleX)/2 + 'px';
        this.shape.style.top = (tH - h*scaleY)/2 + 'px';
    };

    GHtmlStage.prototype.scaleBound = function (scaleX, scaleY) {
        var tW = this.painter.stage.width();
        var tH = this.painter.stage.height();
        var w = parseFloat(this.painter.pageWidth)*scaleX;
        var h = parseFloat(this.painter.pageHeight)*scaleY;

        this.shape.style.width = w + 'px';
        this.shape.style.height = h + 'px';
        this.shape.style.left = (tW - w)/2 + 'px';
        this.shape.style.top = (tH - h)/2 + 'px';

        this.painter.getRootLayer().findByCondition(function (row) {
            var model = row.store.model;
            if (model.type() === 'HtmlDashboard' && model['option.display'] !== 0) {
                row.update();
            }
        });
    };

    GHtmlStage.prototype.fixZoom = function () {
        var types = ['HtmlButton', 'HtmlText'];
        var widgets = this.painter.getAllWidgets();

        widgets.forEach(function (row) {
            if (types.indexOf( row.store.model.type() ) > -1) {
                row.fixZoom();
            }
        });
    };

    GHtmlStage.prototype.close = function () {
        SuperClass.prototype.close.call(this);
        this.shape.parentNode.removeChild(this.shape);
    };

    exports.GHtmlStage = GHtmlStage;

} (
    window,
    namespace('GStage')
));
/** 
 * 图层基类
 */

(function (exports) {

    function GLayer(painter, parent, model) {
        this.painter = painter;
        this.store = {};
        this.store.model = model;

        this.parent = parent;
        this.shape = null;
        this.children = [];

        this.init();
    }

    GLayer.prototype.init = function () {
        this._format();
        if (this.parent) {
            this.parent.children.push(this);
        }
        this.bindModelOb();
    };

    /**
     * 兼容老数据
     */
    GLayer.prototype._format = function () {
        // 为了处理图层合并而做的，对老数据的兼容
        this.store.model.property('type', 'layer');
    };

    GLayer.prototype.show = function () {
        if (this.store.model.isHide() === 1) {
            this.update(null, 'update.isHide');
        }
    };

    GLayer.prototype.bindModelOb = function () {
        this.store.model.addEventListener('update', this.update, this);
    };

    GLayer.prototype.update = function (e, propName) {
        var model = this.store.model;

        if (propName && propName.indexOf('isHide') > -1) {
            if (model.isHide() === 1) {
                this.hideLayer();
            } else {
                this.showLayer();
            }
        }

        if (propName && propName.indexOf('list') > -1) {
            // 更新 this.children
            this.children = this.painter.findByIds(model.list());

            this.painter.updateLayerOrder();
        }

        if (propName && propName.indexOf('parentId') > -1) {
            // 更新 this.parent
            var parent = this.painter.findByIds([model.parentId()]);
            if(parent.length>0){
                this.parent = parent[0];
            }
        }
    };

    GLayer.prototype.add = function () {};

    GLayer.prototype.isVisible = function () {
        var isParentVisible = this.parent ? this.parent.isVisible() : true;

        return isParentVisible && this.store.model.isHide() === 0;
    };

    GLayer.prototype.displayLayer = function (isRoot) {
        var _this= this;
        this.getChildren().forEach(function (row) {
            // 若是图层的话，则继续递归
            if (row.getType() === 'Layer') {
                row.displayLayer();
            }
            // 若是控件的话，则做实事
            else {
                var action = !this.isVisible() || row.store.model.isHide() === 1 ? 'detach' : 'attach';
                row[action]();
            }
        }, this);

        if (isRoot) {
            this.draw();
        }
    };

    GLayer.prototype.showLayer = function () {
        this.getChildren(true).forEach(function (row) {
            // 若是图层的话，则继续递归
            if (row.getType() === 'Layer') {
                row.store.model.isHide(0);
            }
            // 若是控件的话，则做实事
            else {
                row.attach();
            }
        });

        this.draw();
    };

    GLayer.prototype.hideLayer = function () {
        this.getChildren(true).forEach(function (row) {
            // 若是图层的话，则继续递归
            if (row.getType() === 'Layer') {
                row.store.model.isHide(1);
            }
            // 若是控件的话，则做实事
            else {
                row.detach();
            }
        });

        // TODO: 从 activeWidgets 中剔除隐藏控件

        this.draw();
    };

    GLayer.prototype.getPainter = function () {
        return this.painter;
    };

    GLayer.prototype.getShape = function () {
        return this.shape;
    };

    GLayer.prototype.getChildren = function (deep) {
        var rs;
        if (!deep) {
            return this.children;
        }

        // 深度搜索
        rs = [];
        this.children.forEach(function (row) {
            rs.push(row);
            if (row.getType() === 'Layer') {
                rs = rs.concat(row.getChildren(deep));
            }
        });

        return rs;
    };

    GLayer.prototype.getWidgets = function (deep) {
        var children = this.getChildren(deep);

        return children.filter(function (row) {
            return row.getType() !== 'Layer';
        });
    };

    GLayer.prototype.getLayers = function (deep) {
        var children = this.getChildren(deep);

        return children.filter(function (row) {
            return row.getType() === 'Layer';
        });
    };

    GLayer.prototype.findByCondition = function (cond) {
        var ids, type;
        var argsType = typeof cond;

        if (argsType === 'function') {
            return this.getChildren(true).filter(cond);
        } else {
            cond = cond || {};
            ids = cond['ids'];
            type = cond['type'];

            return this.getChildren(true).filter(function (row) {
                var model = row.store.model;
                var flag = true;

                if (type) {
                    if (type === 'Layer') {
                        flag = row.getType() === 'Layer';
                    } else {
                        falg = row.getType() !== 'Layer';
                    }
                }
                if (flag && ids) {
                    flag = ids.indexOf( row.store.model._id() ) > -1;
                }
                return flag;
            });
        }
    };

    GLayer.prototype.find = function (selector) {
        var type = selector[0];
        var rs;

        selector = selector.substr(1);
        rs = this.getChildren(true).filter(function (row) {
            switch(type) {
                case '#':
                    if(row.store.model._id() === selector) {
                        return true;
                    }
                    break;
                case '.':
                    if( row.shape.hasName(selector) ) {
                        return true;
                    }
                    break;
                case '*':
                    return true;
            }
            return false;
        });

        return rs;
    };

    GLayer.prototype.hasName = function (name) {
        return this.store.model.name().indexOf(name) > -1;
    };

    GLayer.prototype.getType = function () {
        return 'Layer';
    };

    GLayer.prototype.draw = function () {
        this.painter.getCanvasLayer().draw();
    };

    GLayer.prototype.setZIndex = function (zIndex) {
        // do nothing
    };

    GLayer.prototype.removeChild = function (id) {
        var children = this.children;
        var removed = [];
        var idx, list;

        for (var i = 0, len = children.length; i < len; i++) {
            if( children[i].id() === id ) {
                removed = children.splice(i, 1);
                break;
            }
        }

        if(removed.length === 0) return false;
        return true;
    };

    GLayer.prototype.destroy = function () {
        var children = this.parent.children;
        var removed = [];
        var id = this.store.model._id();

        for (var i = 0, len = children.length; i < len; i++) {
            if( children[i].id && children[i].id() === id ) {
                removed = children.splice(i, 1);
                break;
            }
        }

        if(removed.length === 0) return false;

        return true;
    };

    GLayer.prototype.close = function () {
        // 将 layer 中包含的 widget 全部销毁
        this.children.forEach(function (row) {
            row.close();
        });

        if (this.parent) {
            this.destroy();
        }
    };

    exports.GLayer = GLayer;
} (
    namespace('layers')
));
/** 简化版的 painter，不可修改，不包含交互 */
(function () {

    var class2type = Object.prototype.toString;

    var DEFAULT_PAGE_WIDTH = 800;
    var DEFAULT_PAGE_HEIGHT = 600;

    var dpr = window.devicePixelRatio;

    var carouselTimer = null, carouselDelayTimer = null, carouselIdx, carouselEnabled = true;

    function GReadonlyPainter(screen, options) {
        this.screen = screen;
        this.domContainer = screen.painterCtn;
        
        this.domCanvas = undefined;
        this.context2d = undefined;
        this.scaleX = undefined;
        this.scaleY = undefined;

        this.stage = undefined;
        this.canvasStage = undefined;
        this.interactiveLayer = undefined;
        this.htmlStage = undefined;
        this.noScaledHtmlStage = undefined;
        this.bgStage = undefined;
        this.rootLayer = undefined;

        this.options = options;
        this.pageWidth = options.pageWidth || DEFAULT_PAGE_WIDTH;
        this.pageHeight = options.pageHeight || DEFAULT_PAGE_HEIGHT;

        // Model
        this.store = {};
        this.store.layerModelSet = screen.store.layerModelSet;
        this.store.widgetModelSet = screen.store.widgetModelSet;
        this.store.pageModel = new Model({
            id: this.screen.page.id,
            isHide: 0,
            isLock: 0,
            list: this.screen.page.layerList
        });

        // bind observer
        this.bindLayerModelSetOb();
        this.bindWidgetModelSetOb();

        this._drawMode = 'normal';

        // 遮罩图形
        this._maskShape = undefined;
        // 自动播放的存储对象
        this._carousel = [];
    }

    GReadonlyPainter.prototype = {
        constructor: GReadonlyPainter,

        init: function () {},

        show: function () {
            var styles = window.getComputedStyle(this.domContainer);
            var width = parseInt(styles.width);
            var height = parseInt(styles.height);
            var GLayer = namespace('layers.GLayer');

            // 舞台创建
            this.stage = new Konva.Stage({
                container: this.domContainer,
                width: width,
                height: height,
                draggable: false
            });

            // 根图层创建
            this.rootLayer = new GLayer(this, null, this.store.pageModel);

            // 静态图层创建
            this.canvasStage = new GCanvasStage(this);

            // html 图层创建
            this.htmlStage = new GHtmlStage(this);

            // html 图层（无需缩放）创建
            this.noScaledHtmlStage = new GHtmlStage(this);
            this.noScaledHtmlStage.setZIndex('');

            // bg 图层创建
            this.bgStage = new GHtmlStage(this);
            this.bgStage.setZIndex(1);
            this.bgStage.setBackground(
                this.screen.page.option ? this.screen.page.option.background : null
            );
            
            // 默认显示比例为 1
            this.scaleX = this.scaleY = 1;
            this.resizePage(width, height);

            this.initOnResize();
        },

        /**
         * 获取/设置画布的绘制频率
         * @param {string} mode 有三种
         *     normal - 正常的绘制频率，默认为此模式
         *     batch - 隔 500ms 的时间进行一次绘制
         *     manual - 设置为该模式后，在下一次切换回 normal 或 batch 之前，将不会进行任何绘制
         */
        drawMode: function (mode) {
            var lastMode = this._drawMode;

            if (typeof mode === 'undefined') {
                return lastMode;
            }

            mode = mode || 'normal';
            this._drawMode = mode;

            if (mode !== 'manual' && lastMode === 'manual') {
                // 从 manual 模式中退出时，自动触发一次绘制
                this.getCanvasLayer().draw();
            }
        },

        // 页面（包括所有控件）加载完成时的回调
        onLoad: function () {
            var _this = this;

            if (this._carousel && this._carousel.length) {
                this.stage.on('contentMousemove', function (e) {
                    if (carouselDelayTimer) {
                        window.clearTimeout(carouselDelayTimer);
                        carouselDelayTimer = null;
                    }
                    if (carouselTimer) {
                        window.clearTimeout(carouselTimer);
                        carouselTimer = null;
                        if (typeof carouselIdx !== 'undefined') {
                            _this._carousel[carouselIdx].playDown();
                        }
                    }
                    carouselDelayTimer = window.setTimeout(function(){
                        // 开始进行自动播放
                        _this.carousel();
                    }, _this.options.carouselDelay || 5000);
                });
                // 首次触发一次
                this.stage.fire('contentMousemove');
            }
        },

        // 加载数据完成时的回调
        onUpdated: function () {},

        // 自动播放
        carousel: function (idx) {
            var _this = this;
            var len = this._carousel.length;
            var lastIdx;

            if (typeof idx === 'undefined') {
                idx = 0;
            } else {
                lastIdx = (idx + len -1) % len;
            }

            if (typeof lastIdx !== 'undefined') {
                this._carousel[lastIdx].playDown();
            }
            this._carousel[idx].playUp();
            carouselIdx = idx;

            carouselTimer = window.setTimeout(function () {
                _this.carousel( (idx + 1) % len );
            }, this.options.carouselInterval || 5000);
        },

        addWidget: function (model) {
            var ModalClass = null;
            var widget = null;
            var layerId = model.layerId(), parent;
            var group, groupId = typeof model.groupId === 'function' ? model.groupId() : null;
            var layer = this.getParentByWidgetType(model.type(), model);
            
            if ( !(ModalClass = namespace('widgets.factory')[model.type()]) ) {
                Log.error('Class not found: ' + model.type());
                return;
            }

            // layerId 为空或不存在，则添加到根图层上
            if (!layerId) {
                parent = this.getRootLayer();
            } else {
                parent = this.find('#' + layerId)[0];
                if (!parent) {
                    Log.warn('one widget that has no parent layer.');
                    return;
                }
            }

            var isS = true;//是否预览
            // 如果存在组 id，则将其加入到其组中
            if (groupId) {
                group = this.find('#'+groupId)[0];
                if (!group) {
                    Log.warn('widget group not found!');
                    return;
                }
                group.add(model);
            }

            widget = new ModalClass(parent, layer, model);
            // 渲染控件
            widget.show(isS);
        },

        removeWidget: function (model) {
            var widget;

            widget = this.find('#'+model._id());

            if (widget.length === 0) {
                Log.error('Can\'t find the widget in page when remove the widget.');
                return;
            }

            // 从画板中删除该元素
            widget[0].close();
        },

        addLayer: function (model) {
            var ModalClass = namespace('layers.GLayer');
            var parentId = model.parentId();
            var parent;

            // 不存在 parentId，说明是在根目录
            if (!parentId) {
                parent = this.getRootLayer();
            } else {
                parent = this.find('#' + parentId)[0];
                if (!parent) {
                    Log.warn('one widget that has no parent layer.');
                    return;
                }
            }

            new ModalClass(this, parent, model).show();
        },

        removeLayer: function (model) {
            var layer;

            layer = this.find('#' + model._id())[0];
            if (!layer) {
                Log.error('Can\'t find the layer in page when remove the layer.');
                return;
            }

            // 从画板上删除该图层
            layer.close();
        },

        // 更新图层顺序
        updateLayerOrder: function () {
            var layerList = this.store.pageModel.list().slice();
            var widgets = this.find('*');
            var map = {};
            var item, id;
            var zIndex = 11, idx;

            // 更新图层层叠顺序
            this.getRootLayer().displayLayer(true);

            // 转换成 map
            widgets.forEach(function (row) {
                var model = row.store.model;
                map[model._id()] = row;
            });

            while (id = layerList.pop()) {
                item = map[id];
                if (!item) {
                    continue;
                }
                if (item.getType() === 'Layer') {
                    layerList = layerList.concat(item.store.model.list());
                } else {
                    idx = item.setZIndex(zIndex++);
                    if (typeof idx === 'number') {
                        zIndex = idx + 1;
                    }
                }
            }
            this.getCanvasLayer().draw();
        },

        bindWidgetModelSetOb: function () {
            this.store.widgetModelSet.addEventListener('insert', function (e, data) {
                data.models.forEach(function (model) {
                    this.addWidget(model);
                }, this);
                this.stage.draw();
                Log.info('insert {count} widget(s) at index {index}'.formatEL(data));
            }, this);

            this.store.widgetModelSet.addEventListener('remove', function (e, data) {
                data.models.forEach(function (model) {
                    this.removeWidget(model);
                }, this);
                this.stage.draw();

                Log.info('remove {count} widget(s)'.formatEL(data));
            }, this);
        },

        bindLayerModelSetOb: function () {
            this.store.layerModelSet.addEventListener('insert', function (e, data) {
                data.models.forEach(function (model) {
                    this.addLayer(model);
                }, this);
                this.stage.draw();

                Log.info('insert {count} layer(s) at index {index}'.formatEL(data));
            }, this);
            this.store.layerModelSet.addEventListener('remove', function (e, data) {
                data.models.forEach(function (model) {
                    this.removeLayer(model);
                }, this);
                this.stage.draw();

                Log.info('remove {count} layer(s)'.formatEL(data));
            }, this);
        },

        initOnResize: function () {
            var _this = this;

            window.onresize = function (e) {
                var styles = window.getComputedStyle(_this.domContainer);
                var width = parseInt(styles.width);
                var height = parseInt(styles.height);

                _this.resizePage(width, height);
                
                _this.fixZoom();
            };
        },

        resizePage: function (width, height) {
            width = parseFloat(width);
            height = parseFloat(height);
            this.stage.width(width);
            this.stage.height(height);

            if(this.options.display === 0){
                this.scaleTo(width/this.pageWidth, height/this.pageHeight);
            }else {
                this.scaleTo(1,1);
            }
        },

        getViewportPosition: function () {
            var w = this.stage.width();
            var h = this.stage.height();
            var vw = this.pageWidth * this.scaleX;
            var vh = this.pageHeight * this.scaleY;

            if (this.options.display === 0) {
                return {
                    x: 0,
                    y: 0
                };
            }

            return {
                x: (w-vw)/2,
                y: (h-vh)/2
            }
        },

        getPage: function () {
            return this.screen;
        },

        getPageSize: function () {
            return {
                w: this.pageWidth,
                h: this.pageHeight
            };
        },

        getAllLayers: function () {
            return this.getRootLayer().getLayers('*');
        },

        getAllWidgets: function () {
            return this.getRootLayer().getWidgets('*');
        },

        getRootLayer: function () {
            return this.rootLayer;
        },

        getCanvasLayer: function () {
            return this.canvasStage;
        },

        getHtmlLayer: function () {
            return this.htmlStage;
        },

        getBgLayer: function () {
            return this.bgStage;
        },

        getNoScaledHtmlLayer: function () {
            return this.noScaledHtmlStage;
        },

        // 获取图层的状态信息
        getLayerStatus: function () {
            var map = {};
            // 只取根目录下的图层
            var layers = this.getRootLayer().getLayers(false);

            layers.forEach(function (row) {
                map[row.store.model._id()] = 1 - row.store.model.isHide();
            });

            return map;
        },

        displayLayerByStatusMap: function (statusMap) {
            var layers = this.findByCondition({
                ids: Object.keys(statusMap),
                type: 'Layer'
            });

            layers.forEach(function (layer) {
                var model = layer.store.model;
                model.isHide(1 - statusMap[model._id()]);
            });
        },

        getScale: function () {
            return {
                x: this.scaleX,
                y: this.scaleY
            };
        },

        // 根据控件的类型，判断控件所属的图层
        getParentByWidgetType: function (widgetType, model) {
            switch(widgetType) {
                case 'HtmlText':
                case 'HtmlButton':
                case 'HtmlScreenContainer':
                case 'HtmlDashboard':
                case 'HtmlContainer':
                    if (!model['option.display'] || model['option.display']() === 0) {
                        return this.getHtmlLayer();
                    } else {
                        return this.getNoScaledHtmlLayer();
                    }
                default:
                    return this.getCanvasLayer();
            }
        },

        // 根据子图层的类型，判断子图层所属的根图层
        getParentByLayerType: function (layerType) {
            switch(layerType) {
                case 'canvas':
                    return this.getCanvasLayer();
                default:
                    return this.getHtmlLayer();
            }
        },

        getMaskShape: function () {
            if (this._maskShape) {
                return this._maskShape;
            }

            this._maskShape = new Konva.Rect({
                width: this.pageWidth,
                height: this.pageHeight,
                fill: '#000',
                opacity: 0,
                visible: false,
                perfectDrawEnabled: false
            });
            this.getCanvasLayer().add(this._maskShape);

            return this._maskShape;
        },

        // 在图层中查找指定的图形
        find: function (selector) {
            return this.getRootLayer().find(selector);
        },

        findByCondition: function (cond) {
            return this.getRootLayer().findByCondition(cond);
        },

        scaleTo: function (scaleX, scaleY) {
            var offset;

            this.scaleX = scaleX;
            this.scaleY = scaleY;

            offset = this.getViewportPosition();
            this.canvasStage.offsetX(-offset.x/scaleX);
            this.canvasStage.offsetY(-offset.y/scaleY);
            this.canvasStage.scale({
                x: scaleX,
                y: scaleY
            });

            this.canvasStage.draw();

            // 处理 html layer 的缩放
            this.htmlStage.scale(scaleX, scaleY);

            // 处理内容不缩放的 html layer 的缩放
            this.noScaledHtmlStage.scaleBound(scaleX, scaleY);

            // 处理 html layer 的缩放
            this.bgStage.scale(scaleX, scaleY);
        },

        fixZoom: function () {
            // 如果修改了浏览器的缩放比例，这里需要修复一下 chrome 浏览器
            // 字体最小只能缩放到 12px 的问题
            if (dpr < 1 && window.devicePixelRatio !== dpr) {
                dpr = window.devicePixelRatio;
                this.htmlStage.fixZoom();
            }
        },

        _registerCarousel: function (data) {
            this._carousel.push(data);
        },

        draw: function () {
            this.canvasStage.draw();
            this.htmlStage.draw();
            this.bgStage.draw();
        },

        close: function () {
            window.onresize = null;

            // 销毁“自动播放”延时定时器
            if (carouselDelayTimer) {
                window.clearTimeout(carouselDelayTimer);
                carouselDelayTimer = null;
            }
            // 销毁“自动播放”定时器
            if (carouselTimer) {
                window.clearTimeout(carouselTimer);
                carouselTimer = null;
            }

            /** 删除所有图层和控件 */
            this.rootLayer.close();

            /** 删除所有舞台 */
            this.htmlStage.close();
            this.bgStage.close();
            this.canvasStage.close();

            // Konva 对象的销毁和普通的不一样，有所区别
            this.stage.destroy();

            /** 将所有变量引用置为 null */
            this.store = null;

            /** 删除DOM */
            this.domContainer.innerHTML = '';
        }
    };

    window.GReadonlyPainter = GReadonlyPainter;

} ());
/**
 * PageScreen
 */
(function () {
    var _this;
    var Spinner = new LoadingSpinner({ color: '#00FFFF' });

    function PageScreen(options, container, params) {
        _this = this;
        this.options = options;
        this.page = null;
        this.preview = '';
        this.lastDate = undefined;
        this.painterCtn = (function (container) {
            if (typeof container === 'string') {
                return document.querySelector('#' + container);
            } else if (container instanceof HTMLElement) {
                return container;
            } else {
                return null;
            }
        } (container));
        this.painterCtn.classList.add('web-factory-container');

        this.painter = null;

        this.store = {};
        this.store.layerModelSet = new ModelSet();
        this.store.widgetModelSet = new ModelSet();
        this.store.imageModelSet = new ModelSet();
        this.store.dictPoints = {};
        this.store.dictTexts = {};

        // 判断是否是数据回放模式
        this.isReplay = false;
        this.replayCtn = null;

        this._factoryIoC = null;

        // 记录初始化过程的进度的 promise 对象
        this.loadPromise = $.Deferred();
        //记录 显示的状态
        this.showStatusWidgets = [];
        //将所有控件按类型分类 储存
        this.typeGrouping = [];
        //所有控件的宽高 临时储存容器
        this.temporaryCtn = [];
    }

    PageScreen.prototype = {
        show: function () {
            var _this = this;
            var promise = $.Deferred();

            if (typeof this.options.template !== 'undefined') {
                // template data 的处理方式
                promise.resolveWith(this, [this.options.template]);
                
            } else if (typeof this.options.templateId !== 'undefined') {
                // template id 的处理方式
                WebAPI.get('/factory/template/' + this.options.templateId).done(function (rs) {
                    rs = rs.content;
                    this.options.template = {
                        page: {
                            width: rs.width,
                            height: rs.height,
                            display: rs.display
                        },
                        data: JSON.parse(rs.template)
                    };
                    promise.resolveWith(this, [this.options.template]);
                }.bind(this));
            } else {
                WebAPI.get('/factory/getPageDetail/'+this.options.id+'/'+AppConfig.isFactory).done(function (rs) {
                    promise.resolveWith(this, [rs]);
                }.bind(this));
            }

            return promise.done(function (rs) {
                var modelIds = [], defers = [];
                var dictPoints = this.store.dictPoints;
                var paramList = [];
                var _this = this;
                if(!rs || !rs.data || !rs.page) {
                    Log.error('get page detail faild!');
                }
                rs.data.list = rs.page.layerList;

                this.page = rs.page;
                //模式初始化
                this.modelInt();
                // 初始化控件
                this.init();
                // 将数据转换成可监控的数据
                this.updateModelSet(rs.data);
                
                // 如果是预览模式，则无需去遍历出数据源，这里直接返回
                if (this.preview === '1' && AppConfig.isFactory === 1) {
                    this.store.widgetModelSet.forEach(function (model) {
                        // 这里将控件id作为数据源，因为控件id是唯一的
                        dictPoints[model._id()] = [model._id()];
                    });
                    this.startDebugWorker();
                    return;
                }else if(this.preview === '2' && AppConfig.isFactory === 1){//如果是 预览的 points view模式  默认只显示点名 
                    var widgets = this.painter.getAllWidgets();
                    this.typeGrouping = this.widgetsTypeGrouping(widgets);
                    widgets.forEach(function (row) {
                        var model = row.store.model;
                        model.isHide(1);
                        row.detach();
                    });

                }   
                // 整理出 数据源 数组 和 模板参数 数组
                this.store.widgetModelSet.forEach(function (model) {
                    var dsId = model.property('idDs');
                    var options = model.option();
                    var id = model._id();

                    // 提取 faults 映射关系
                    if (AppConfig.isFactory !== 1 &&
                        model.type() === 'HtmlText' &&
                        options.equipments && 
                        options.equipments.length) {
                        options.equipments.forEach(function (row) {
                            _this.store.dictTexts[id] = _this.store.dictTexts[id] || [];
                            _this.store.dictTexts[id].push(row);
                        });
                    }

                    // HtmlDashboard 控件的取点是在其包含的 dashbaord 控件中
                    // 比较特殊，所以这里单独处理
                    if (model.type() === 'HtmlDashboard' &&
                        options.interval > 0 && 
                        options.points && 
                        options.points.length > 0) {
                        dictPoints[id] = dictPoints[id] || [];
                        dictPoints[id] = dictPoints[id].concat(options.points);
                        return;
                    }

                    if (!dsId) {
                        return;
                    }
                    if(this.preview === '2' && dsId.length !== 0){
                        var id = model._id();
                        var type = model.type();
                        var x = model.x();
                        var y = model.y();
                        if(type === "CanvasPipe"){
                            x = model.option().points[0].x;
                            y = model.option().points[0].y;
                        }
                        var str = '<div style="top:'+y+'px;left:'+x+'px;" class="pointNameLabel" data-id="'+id+'" data-type="'+type+'">\
                                        <span class="pointName">'+dsId+'</span>\
                                    </div>';
                        $(this.painter.getHtmlLayer().shape).append($(str));
                        $(this.painterCtn).off().on('click.pointNameLabel','.pointNameLabel',function(){
                            if($(this).css('background').indexOf('rgb(255, 255, 255)') !==-1){
                                $(this).css('background','rgb(255,0,0)');
                            }else{
                                $(this).css('background','rgb(255,255,255)');
                            }
                            
                        })
                    }
                    // 处理 HtmlContainer 模板中的数据源
                    if (typeof dsId.length === 'undefined') {
                        modelIds.push(model._id());
                        defers.push(dsId);
                    } else if (dsId.length > 0) {
                        dictPoints[id] = dictPoints[id] || [];
                        dictPoints[id] = dictPoints[id].concat(dsId);
                    }
                }.bind(this));

                $.when.apply($, defers).done(function () {
                    var args = Array.prototype.slice.call(arguments);
                    args.forEach(function (dsIds, i) {
                        var id = modelIds[i];
                        if (!dsIds || !dsIds.length) {
                            return;
                        }
                        dictPoints[id] = dictPoints[id] || [];
                        dictPoints[id] = dictPoints[id].concat(dsIds);
                    }.bind(this));

                    this.startWorker();
                }.bind(this));
                
            }).always(function () {
                this.painter.onLoad();
                this.loadPromise.resolve();
            }.bind(this));
        },
        factoryIoC: function () {
            if (!this._factoryIoC) {
                this._factoryIoC = new FactoryIoC('dashboard');
            }
            return this._factoryIoC;
        },
        showColorSetBtn: function (isShow) {
            if (AppConfig.isFactory == 1) return;
            if (isShow) {
                var tempDistribution = new ModelTempDistribution(this.options.id, null, null ,_this);
                tempDistribution.init();
                $("#btnTemperatureSetting").show().eventOff('click').eventOn('click', function (e) {
                    new TemperatureSetting('co',true).show();
                });
            } else {
                $("#btnTemperatureSetting").hide().eventOff('click');
                window.colorGettings && delete window.colorGettings;
            }
        },
        // 刷新某个控件
        reloadWidgetById: function (modelId, data) {
            var widget = this.painter.find('#'+modelId)[0];
            widget.reload(data);
        },
        /**
         * 拿到指定类型的控件的 model集合
         * @param  {object|array} types 指定的类型，可以为数组
         * @return {[type]}      [description]
         */
        getModelsByType: function (types) {
            var matches = [];

            // type 转换成数组
            if (typeof types === 'string') {
                types = [types];
            }

            this.store.widgetModelSet.forEach(function (model) {
                if ( types.indexOf( model.type()) > -1 ) {
                    matches.push(model);
                }
            });

            return matches;
        },
        startWorker: function () {
            var dsIds = [], dsMap = {};
            // 获取需要查询的数据源列表
            Object.keys(this.store.dictPoints).forEach(function (id) {
                dsIds = dsIds.concat(this.store.dictPoints[id]);
            }.bind(this));

            // 数组去重
            dsIds.forEach(function (dsId) {
                dsMap[dsId] = null;
            });
            dsIds = Object.keys(dsMap);

            if ( dsIds.length === 0 ) {
                return ;
            }
            this.workerUpdate = new Worker("/static/views/js/worker/workerUpdate.js");
            this.workerUpdate.self = this;
            Spinner.spin(this.painterCtn);
            this.workerUpdate.addEventListener("message", this.onUpdateCallback, true);
            this.workerUpdate.addEventListener("error", function (e) {
                Log.error(e);
            }, true);

            this.workerUpdate.postMessage({pointList: dsIds, type: "datasourceRealtime"});
        },
        startDebugWorker: function () {
            var _this = this;
            var fakeData = [];
            var keys = Object.keys(this.store.dictPoints);

            this.store.widgetModelSet.forEach(function (model) { 
                if ( model['option.preview'] && typeof model['option.preview']() !== 'undefined' &&
                    keys.indexOf(model._id()) > -1 ) {
                    var previewData = model['option.preview']();

                    fakeData.push({
                        data: previewData[0],
                        dsItemId: model._id()
                    });
                }
            });
            
            // 延迟一秒执行
            window.setTimeout(function () {
                _this.onUpdateCallback({
                    data: {
                        dsItemList: fakeData
                    }
                });
            }, 1000);
            
        },
        stopWorker: function () {
            if (_this.workerUpdate) {
                _this.workerUpdate.terminate();
                _this.workerUpdate = null;
            }
        },
        init: function () {
            // 初始化 painter
            if(this.painter) {
                this.painter.close();
            }
            this.painter = new GReadonlyPainter(this, {
                pageWidth: this.page.width,
                pageHeight: this.page.height,
                // 0 - full screen
                // 1 - show in center
                display: this.page.display,
                carouselInterval: this.page.option ? this.page.option.carouselInterval : null,
                carouselDelay: this.page.option ? this.page.option.carouselDelay : null
            });
            //显示热图设置
            this.showColorSetBtn(true);
            this.painter.show();

            if (!AppConfig.isFactory) {
                this.initReplay();
            }
           
        },
        modelInt: function () {
            var _this = this;
            var $checkPreviewPattern = $('#checkPreviewPattern');
            var $pointViewModal = $('#pointViewModal');
            var v = localStorage.getItem('preview');
            var modal;
            if(v === '0'){
                modal = 'Real';
                this.preview = '0';
            }else if(v === '1'){
                modal = 'Debug';
                this.preview = '1';
            }else if(v === '2'){
                modal = 'Points View';
                this.preview = '2';
                $('.pointsViewBtn').css('display','inline-block');
            }else{
                modal = 'Real';
                this.preview = '0';
            }
            var text = modal+'<span class="caret"></span>';
            $('.dropdown-toggle', $checkPreviewPattern).html(text);

            if (this.page.type === 'PageScreen') {
                $checkPreviewPattern.css('display', 'block');
            } else {
                this.preview = '0';
            }
            //选择预览模式
            $('li', $checkPreviewPattern).off('click').on('click', function () {
                var $this = $(this);
                $this.parent().siblings('.dropdown-toggle').html($this.text() + '<span class="caret"></span>');
                localStorage.setItem('preview', this.dataset.checkvalue);
                $('.pointsViewBtn').hide();
                window.location.reload();
            })
            //在 point view模式下 点击配置按钮
            $('.pointViewConfig', $checkPreviewPattern).off('click').on('click',function(){
                $('.scalePercentage').hide();
                $('#pointViewModal table').html('');
                var str,flag,tableTypes=[];
                var allWidgets = _this.store.widgetModelSet.models;
                if(_this.showStatusWidgets.length === 0){
                    _this.typeGrouping.forEach(function(row){
                        var obj = {
                            type:row.type,
                            showWidget:false,
                            showPoint:true,
                            noShow:false
                        }
                        str = _this.pageWidgetsType(obj);
                        $('#pointViewModal table').append($(str));
                        _this.showStatusWidgets.push(obj);
                    })
                }else{
                    for(var j=0,jLength=_this.showStatusWidgets.length;j<jLength;j++){
                        var currentWidget = _this.showStatusWidgets[j];
                        str = _this.pageWidgetsType(currentWidget);
                        $('#pointViewModal table').append($(str));
                    }
                }
                $('#pointViewModal').modal('show');
            })  
            //在 point view模式下 点击缩放按钮
            $('.pointViewScale .glyphicon', $checkPreviewPattern).off('click').on('click',function(){
                if($('.scalePercentage').css('display') === 'block'){
                    $('.scalePercentage').hide();
                }else{
                    $('.scalePercentage').show();
                }
            })
            $('.pointViewScale input', $checkPreviewPattern).off('blur').on('blur',function(){
                var value = $(this).val();
                if(value.indexOf('%') !== -1){
                    value = Math.abs(value.split('%')[0]/100);
                    _this.scalePointsView(value,value);
                }
            })
            //点击缩放的具体比例
            $('.scalePercentage li', $checkPreviewPattern).off('click').on('click',function(){
                $('.pointViewScale input').val($(this).text());
                var value = $(this).text().split('%')[0]/100;
                _this.scalePointsView(value,value);
                $('.scalePercentage').hide();
            })

            //弹出框的取消按钮
            $('#pointViewModal').on('hide.bs.modal', function () {
                $('#pointViewModal table').html('');
            })
            //弹出框的点击button事件
            $pointViewModal.off('click.showBtn').on('click.showBtn','.showBtn',function(){
                if($(this).hasClass('btn-default')){
                    $(this).removeClass('btn-default').addClass('btn-success');
                    if($(this).hasClass('noShow')){
                        $(this).siblings().removeClass('btn-success').addClass('btn-default');
                    }else{
                        $(this).closest('tr').find('.noShow').removeClass('btn-success').addClass('btn-default');
                    }
                }else{
                    $(this).removeClass('btn-success').addClass('btn-default');
                    if(($(this).hasClass('showWidget') && $(this).closest('tr').find('.showPoint').hasClass('btn-success')) || ($(this).hasClass('showPoint') && $(this).closest('tr').find('.showWidget').hasClass('btn-success'))){
                        $(this).closest('tr').find('.noShow').removeClass('btn-success').addClass('btn-default');
                    }else if($(this).hasClass('noShow')){
                        $(this).closest('tr').find('.showWidget').removeClass('btn-default').addClass('btn-success');
                    }else if(($(this).hasClass('showWidget') && $(this).closest('tr').find('.showPoint').hasClass('btn-default')) || ($(this).hasClass('showPoint') && $(this).closest('tr').find('.showWidget').hasClass('btn-default'))){
                        $(this).closest('tr').find('.noShow').removeClass('btn-default').addClass('btn-success');
                    }
                }
            })
            //弹出框的确定按钮
            $('#btnTypeSure').off('click').on('click',function(){
                var $trs = $('#pointViewModal tr');
                $('#pointViewModal').modal('hide');
                Spinner.spin(_this.painterCtn);
                var widgets = _this.painter.getAllWidgets();
                var $pointsNameTooltip = $('.pointNameLabel');
                _this.showStatusWidgets = [];
                var $noShowBtns = $pointViewModal.find(".noShow.btn-success");//不显示
                if($noShowBtns.length === widgets.length){//所有的控件 点名 都不显示
                    $('.pointNameLabel').hide();
                }
                _this.painter.drawMode('manual');
                $trs.each(function(){
                    var type = $(this).attr('data-type');
                    var showWidgetStatus = $(this).find('.showWidget').hasClass('btn-success');
                    var showPointStatus = $(this).find('.showPoint').hasClass('btn-success');
                    var noShowStatus = $(this).find('.noShow').hasClass('btn-success');
                    var obj = {
                            type:type,
                            showWidget:showWidgetStatus,
                            showPoint:showPointStatus,
                            noShow:noShowStatus
                        }
                    _this.showStatusWidgets.push(obj);

                    var models;
                    function condition(widgetType) {
                        models = widgetType.models;
                        return widgetType.type === type;
                    }
                    if (_this.typeGrouping.some(condition)) {
                        for(var i=0,length=models.length;i<length;i++){
                            var model = models[i].store.model;
                            if(showWidgetStatus){
                                model.isHide(0);
                                models[i].attach();
                            }else{
                                model.isHide(1);
                                models[i].detach();
                            }   
                        }
                    }
                    
                    $pointsNameTooltip.each(function(){//遍历所有的点名label
                        if($(this).attr('data-type') === type){
                            if(showPointStatus){//显示
                                $(this).show();
                            }else{
                                $(this).hide();
                            }
                        }
                    })
                });
                _this.painter.drawMode('normal');
                $('#pointViewModal table').html('');
                Spinner.stop();
            })
        },
        pageWidgetsType:function(obj){
            var modalType,noSupportPoint='';
            switch (obj.type){
                case 'CanvasText':
                  modalType="简单文本";
                  break;
                case 'HtmlText':
                  modalType="文本控件";
                  break;
                case 'HtmlButton':
                  modalType="按钮控件";
                  break;
                case 'HtmlContainer':
                  modalType="Html 容器控件";
                  noSupportPoint = 'disabled'
                  break;
                case 'HtmlScreenContainer':
                  modalType="Screen 容器控件";
                  noSupportPoint = 'disabled'
                  break;
                case 'CanvasImage':
                  modalType="图片控件";
                  break;
                case 'CanvasPipe':
                  modalType="管道控件";
                  break;
                case 'CanvasHeat':
                  modalType="热力图选区控件";
                  noSupportPoint = 'disabled'
                  break;
                case 'CanvasHeatP':
                  modalType="热力图标记控件";
                  break;
                case 'HtmlDashboard':
                  modalType="Dashboard 控件";
                  noSupportPoint = 'disabled'
                  break;
                case 'CanvasPolygon':
                  modalType="多边形控件";
                  noSupportPoint = 'disabled'
                  break;
            }
            var swClassName = obj.showWidget ? 'btn-success' : 'btn-default';
            var spClassName = obj.showPoint ? 'btn-success' : 'btn-default';
            var nsClassName = obj.noShow ? 'btn-success' : 'btn-default';

            var str = '<tr data-type="'+obj.type+'">\
                        <td><span>'+modalType+'</span></td>\
                        <td>\
                            <button type="button" class="btn '+swClassName+' showBtn showWidget">显示画面</button>\
                            <button type="button" class="btn '+spClassName+' showBtn showPoint" '+noSupportPoint+'>显示点名</button>\
                            <button type="button" class="btn '+nsClassName+' showBtn noShow">不显示</button>\
                        </td>\
                    </tr>';
            
            return str;
        },
        widgetsTypeGrouping:function(widgets){
            var typeGrouping = [];
            var types = [];
            widgets.forEach(function (row) {
                var model = row.store.model;
                if(types.indexOf(model.type()) !== -1){//没有一样的
                    var index = types.indexOf(model.type());
                    typeGrouping[index].models.push(row);
                }else{
                    var arr = [];
                    var obj = {
                        type:model.type(),
                        models:[]
                    }
                    obj.models.push(row);
                    typeGrouping.push(obj);
                    types.push(model.type());
                }
            });
            return typeGrouping;
        },
        scalePointsView:function(scaleX,scaleY){
            var _this = this; 
            $('.pointNameLabel').css('transform','scale('+scaleX+','+scaleY+')');
            // var widgets = this.painter.getAllWidgets();
            // if(_this.temporaryCtn.length === 0){
            //     _this.painter.drawMode('manual');
            //     $.each(widgets,function(index,row){
            //         var model = row.store.model;
            //         if(model.type() === 'CanvasPipe'){
            //             // var x1 = model.option().points[0].x;
            //             // var x2 = model.option().points[1].x;
            //             // var y1 = model.option().points[0].y;
            //             // var y2 = model.option().points[1].y;
            //             // var width = model.option().width;

            //             // _this.temporaryCtn.push([{x:x1,y:y1},{x:x2,y:y2},{w:width}]);
            //             // var nowW = x2 - x1; 
            //             // var nowH = y2 - y1;
            //             // var w = nowW * scaleX;
            //             // var h = nowH * scaleX;
            //             // var pipeW = width * scaleX;

            //             // var arr = [{
            //             //     x: model.option().points[0].x,
            //             //     y: model.option().points[0].y
            //             // },{
            //             //     x: model.option().points[0].x + w,
            //             //     y: model.option().points[0].y + h
            //             // }];
            //             // row.shape.options.points = arr;
            //             // row.shape.options.width = pipeW;
            //             // model.option(row.shape.options);
                        
            //         }else if(model.type === 'CanvasHeat'){

            //         }else{
            //             _this.temporaryCtn.push({w:model.w(),h:model.h(),x:model.x(),y:model.y()});

            //             // var w = model.w()/_this.painter.pageWidth  * (_this.painter.pageWidth*scaleX);
            //             // var h = model.h()/_this.painter.pageHeight * (_this.painter.pageHeight*scaleX);

            //             var x = model.x()/_this.painter.pageWidth * (_this.painter.pageWidth*scaleX);
            //             var y = model.y()/_this.painter.pageHeight * (_this.painter.pageHeight*scaleX);
            //             // model.w(w);
            //             // model.h(h);
            //             model.x(x);
            //             model.y(y);
            //         }
            //     });
            //     _this.painter.drawMode('normal');
            // }else{
            //     _this.painter.drawMode('manual');
            //     $.each(widgets,function(index,row){
            //         var model = row.store.model;
            //         if(model.type() === 'CanvasPipe'){
            //             // var x1 = _this.temporaryCtn[index][0].x;
            //             // var x2 = _this.temporaryCtn[index][1].x;
            //             // var y1 = _this.temporaryCtn[index][0].y;
            //             // var y2 = _this.temporaryCtn[index][1].y;
            //             // var width = _this.temporaryCtn[index][2].w;
                        
            //             // var nowW = x2 - x1; 
            //             // var nowH = y2 - y1;
            //             // var w = nowW * scaleX;
            //             // var h = nowH * scaleX;
            //             // var pipeW = width * scaleX;
            //             // var arr = [{
            //             //     x: x1,
            //             //     y: y1
            //             // },{
            //             //     x: x1 + w,
            //             //     y: y1 + h  
            //             // }];
            //             // row.shape.options.points = arr;
            //             // row.shape.options.width = pipeW;
            //             // model.option(row.shape.options);
            //         }else if(model.type === 'CanvasHeat'){

            //         }else{
            //             var w = _this.temporaryCtn[index].w* scaleX;
            //             var h = _this.temporaryCtn[index].h * scaleX;
            //             var x = _this.temporaryCtn[index].x* scaleX;
            //             var y = _this.temporaryCtn[index].y * scaleX;
            //             model.w(w);
            //             model.h(h);
            //             model.x(x);
            //             model.y(y);
            //         } 
            //     });
            //     _this.painter.drawMode('normal');
            // }
        },
        // 初始化数据回放
        initReplay: function () {
            // 新增"数据回放"按钮
            var _this = this;
            var $btnTimeShaft = $('#btnDropdownNavList').find('.toolBacktrace');
            if ($btnTimeShaft.length > 0) {
                $btnTimeShaft.remove();
            }

            $btnTimeShaft = $('<li class="iconWrap"><a><span class="glyphicon glyphicon-play-circle"></span><span class="dropdownNav"></span></a></li>').addClass('toolBacktrace');
            $btnTimeShaft.find('.dropdownNav').text(I18n.resource.observer.widgets.BACKTRACE);
            $('#right-nav').find('#btnOperatingRecord').after($btnTimeShaft);

            $btnTimeShaft.eventOn('click', function (e) {
                if (_this.isReplay) {
                    // 调整按钮状态和文字
                    this.classList.remove('selected');
                    _this.quitReplayMode();
                } else {
                    // 调整按钮状态和文字
                    this.classList.add('selected');
                    _this.enterReplayMode();
                }
            }, ['navTool-backTrace', 'btnBackTrace', AppConfig.projectShowName, AppConfig.projectId]);

            // 创建容器
            this.replayCtn = document.createElement('div');
            this.replayCtn.id = 'replayCtn';
            this.replayCtn.style.width = '100%';
            this.replayCtn.style.height = '0px';
            this.painterCtn.appendChild(this.replayCtn);
        },
        // 进入数据回放模式
        enterReplayMode: function (d) {
            var styles = window.getComputedStyle( this.painterCtn );
            var width = parseInt(styles.width);
            var height = parseInt(styles.height);
            var promise = $.Deferred();

            // 关闭原有的刷新机制
            this.stopWorker();
            // 状态位更新
            this.isReplay = true;
            // 显示回放控件
            if (!this.replayTool) {
                this.replayTool = new TimeShaftPageScreen(this);
                promise = this.replayTool.show();
            } else {
                promise.resolve();
            }
            promise.done(function () {
                var time;
                if (d) {
                    this.replayTool.showFramePane();
                    time = d.valueOf();
                    this.replayTool.requestData(new Date(time - 7200000), new Date(time + 7200000), null, true);
                }
            }.bind(this));
            // 调整页面高度
            this.painter.resizePage(width, height - 100);
        },
        // 退出数据回放模式
        quitReplayMode: function () {
            var styles = window.getComputedStyle( this.painterCtn );
            var width = parseInt(styles.width);
            var height = parseInt(styles.height);
            // 开启原有的刷新机制
            this.startWorker();
            // 状态位更新
            this.isReplay = false;
            // 关闭回放控件
            this.replayTool.close();
            this.replayTool = null;
            // 还原页面高度
            this.painter.resizePage(width, height);
        },
        // 数据更新回调
        onUpdateCallback: function (e) {
            var _this = this.self ? this.self : this;
            Spinner.stop();
            if (e.data.error || !e.data.dsItemList) {
                Log.error('Refresh Data Failed!');
                return;
            }
            _this.renderData(e.data.dsItemList);
            _this.lastDate = e.data.dsItemList;
 
        },
        // 设备 错误/警告 信息更新回调
        onUpdateFaultsCallback: function (faults) {
            var _this = this;

            this.loadPromise.done(function () {
                var dictTexts = this.store.dictTexts;
                var faultMap = {};

                if (Object.keys(dictTexts).length === 0) {
                    return;
                }
                faults = faults || [];

                // 生成以 equipmentId 为 key 的 map
                faults.forEach(function (row) {
                    faultMap[row.equipmentId] = faultMap[row.equipmentId] || [];
                    faultMap[row.equipmentId].push({
                        faultId: row.faultId,
                        grade: row.grade
                    });
                });

                Object.keys(dictTexts).forEach(function (modelId) {
                    var textFaults = [];
                    var equipments = dictTexts[modelId];
                    var model = _this.store.widgetModelSet.findByProperty('_id', modelId);

                    equipments.forEach(function (row) {
                        if (faultMap[row]) {
                            textFaults = textFaults.concat(faultMap[row]);
                        }
                    });

                    if (!model['option.faults']) {
                        model.property('option.faults', textFaults);
                    } else {
                        model['option.faults'](textFaults);
                    }

                });
            }.bind(this));
        },
        renderLastData: function () {
            _this.lastDate && _this.renderData(_this.lastDate);
        },
        renderData: function(data) {
            var _this = this.self ? this.self : this;
            var arrModel, model, options, text;
            var dataMap = {};
            // 把返回的数据转换成 map
            data.forEach(function (row) {
                dataMap[row.dsItemId] = row.data;
            });

            this.painter.drawMode('manual');
            Object.keys(this.store.dictPoints).forEach(function (modelId) {
                var data;
                var model = _this.store.widgetModelSet.findByProperty('_id', modelId);
                var options = model.option(), type = model.type();
                var dsIds = type === 'HtmlDashboard' ? options.points : _this.store.dictPoints[modelId];
                var options = model.option();

                if (type === 'HtmlContainer') {
                    text = {};
                    dsIds.forEach(function (dsId) {
                        text[dsId] = dataMap[dsId];
                    });
                } else if (type === 'CanvasPipe') {
                    text = {};
                    dsIds.forEach(function (dsId) { 
                        data = parseFloat(dataMap[dsId]).toFixed(0);
                        if (options.trigger && typeof options.trigger[data] !== 'undefined') {
                            text[dsId] = options.trigger[data];
                        } else {
                            text[dsId] = dataMap[dsId];
                        }
                    });
                } else if (type === 'HtmlDashboard') {
                    text = {};
                    dsIds.forEach(function (dsId) {
                        text[dsId] = dataMap[dsId];
                    });
                } else {
                    data = parseFloat(dataMap[dsIds[0]]).toFixed(0);
                    if(options.trigger && typeof options.trigger[data] !== 'undefined'){
                        text = options.trigger[data];
                    } else {
                        text = dataMap[dsIds[0]];
                    }
                }

                if (typeof options.text === 'undefined') {
                    options.text = '';
                }

                // 兼容一下编辑模式下的数据
                if (typeof options.text === 'string') {
                    // 触发控件更新
                    model.property('option.text', {
                        content: options.text,
                        value: text
                    });
                } else {
                    model['option.text.value'](text);
                }
            });
            this.painter.drawMode('normal');
            this.painter.onUpdated();

        },

        resize: function () {
            var styles = window.getComputedStyle(this.painter.domContainer);
            var width = parseInt(styles.width);
            var height = parseInt(styles.height);

            this.painter.resizePage(width, height);
        },

        // 获取有序的数据
        getSortedData: function (data) {
            var stack = data.list.slice();
            var layerMap = Array.toMap(data.layers, '_id');
            var widgetMap = Array.toMap(data.widgets, '_id');
            var viewedIds = [];
            var id, item;
            var rs = [];

            while(id = stack.pop()) {
                item = layerMap[id];
                if (item) {
                    if (viewedIds.indexOf(id) > -1) {
                        Log.error('factory 图层出现嵌套循环，id：' + id);
                        continue;
                    }
                    viewedIds.push(id);
                    stack = item['list'].concat(stack);
                    // 兼容老数据
                    item.type = 'layer';
                    rs.push(item);
                } 
                // 若是控件
                else {
                    item = widgetMap[id];
                    if (item) {
                        if (viewedIds.indexOf(id) > -1) {
                            Log.error('factory 控件出现嵌套循环，id：' + id);
                            continue;
                        }
                        viewedIds.push(id);
                        rs.push(item);
                    } else {
                        Log.warn('未找到图层/控件，id：' + id);
                    }
                }
            }
            return rs;
        },

        updateModelSet: function (data) {
            var layers, widgets, images;
            var sortedData = [];
            var set = [], lastInsertType;

            this.painter.drawMode('manual');
            // 排序
            if (data.list) {
                sortedData = this.getSortedData(data);
            }

            data.images = data.images || [];
            images = data.images.map(function (row) {
                // 创建 Model
                var model = new NestedModel(row);
                return model;
            }, this);
            this.store.imageModelSet.append(images);

            // 开始添加图层和控件
            if (sortedData && sortedData.length) {
                sortedData.forEach(function (row, i, arr) {
                    // 判断出是图层还是控件
                    var type = row.type === 'layer' ? 'layer' : 'widget';
                    var model;
                    
                    if (lastInsertType && lastInsertType !== type) {
                        lastInsertType === 'layer' ? this.store.layerModelSet.append(set) : this.store.widgetModelSet.append(set);
                        set = [];
                    }
                    lastInsertType = type;

                    // 创建 Model
                    model = new NestedModel(row);
                    set.push(model);

                }, this);

                lastInsertType === 'layer' ? this.store.layerModelSet.append(set) : this.store.widgetModelSet.append(set);
                set = null;
            }

            // 更新图层显示顺序
            this.painter.updateLayerOrder();
            
            this.painter.drawMode('normal');
        },
        close: function () {
            if (this.painter) {
                this.painter.close();
                this.painter = null;
            }

            if (this.painterCtn) {
                this.painterCtn.classList.remove('web-factory-container');
                this.painterCtn.innerHTML = '';
                this.painterCtn = null;
            }

            this.page = null;
            this.store = null;
            //隐藏热图设置
            this.showColorSetBtn(false);

            if (this.workerUpdate) {
                this.workerUpdate.terminate();
                this.workerUpdate = null;
            }
        }
    };

    namespace('observer.screens').PageScreen = PageScreen;
} ());