window.map = window.map || {};
window.map.controls = window.map.controls || {};

window.map.controls.DataRange = (function (window, $, undefined) {
    'use strict';

    var utils = {
        color: {
            getColorValue: function (arr) {
                if($.type(arr) !== 'array') {
                    arr = [arr];
                }

                return arr.map(function (row, i) {
                    var matches = null;
                    // deal with HEX FORMAT COLOR
                    matches = row.match(/^#(\w{2})(\w{2})(\w{2})$/);
                    return [parseInt(matches[1],16), parseInt(matches[2],16), parseInt(matches[3],16)];
                });

            }
        }
    }

    function DataRange(mapIns, container) {
        this.mapIns        = mapIns;
        this.$container = $(container);
        this.options    = $.extend({}, DEFAULTS);
        
        this.colorsRange = null;
        this.visibleRangeValue = {};
        this.data = null;
        this.$markers = null;

        this.init();
    }

    DataRange.prototype = {
        constructor: DataRange,
        // 初始化
        init: function () {
            this.initColors();
            // buildUI
            this.buildUI();
            // attach events
            this.attachEvents();
        },
        show: function () {
            this.$divWrap.show();
        },
        initColors: function () {
            var colors = utils.color.getColorValue(this.options.colors);
            var optMin = this.options.range.min;
            var optMax = this.options.range.max;
            var range  = optMax - optMin;
            var step = 1 / (colors.length-1);
            var row, prev;
            this.colorsRange = [];

            for (var i = 1, len = colors.length; i < len; i++) {
                row = colors[i];
                prev = colors[i-1];
                this.colorsRange.push({
                    // 对最后一个范围做处理，防止不能除尽的情况
                    from: optMin + range*step*(i-1),
                    to: i === len-1 ? optMax : range*step*i,
                    colorFrom: prev,
                    colorTo: row
                });
            }

        },
        initMarkers: function (data) {
            // format data
            var newData = {}, t;
            var _this = this;
            var $markers = this.$markers;
            var projectId, value, row;

            if(!$markers) $markers = this.$markers = $('.map-marker', this.$container);

            data.forEach(function(row, i) {
                newData[row.projectId] = row.value;
            });
            this.data = newData;

            // init markers color
            ([]).forEach.call( $markers, function (row, i) {
                var $this = $(row), color;
                projectId = $this.attr('data-id');
                value = _this.data[projectId];
                if(value === -1 || value === undefined ) {
                    // 解决高德地图通过隐藏dom来隐藏 marker 时，marker 原位置仍可点击的 bug
                    _this.mapIns.markers[projectId].hide();
                } else {
                    color = _this.getColorByValue(value)
                    $this.css({
                        'background-color': color
                    });
                    _this.mapIns.markers[projectId].show();
                }
            } );

            this.setVisibleMarkers();
        },
        buildUI: function () {
            var halfHeight;
            var options = this.options;
            //////////
            // WRAP //
            //////////
            this.$divWrap = $('<div>').css({
                'width': options.width,
                'height': options.height,
                'position': 'absolute',
                'bottom': 50,
                'left': 40,
                'background-image': 'linear-gradient(to top, '+this.options.colors.join(',')+')',
                // '-webkit-user-select': 'none',
                'border-radius': '2px',
                'z-index': 1,
                'display': 'none',
                'box-shadow': '0 2px 6px rgba(0,0,0,0.4)'
            });

            /////////////////////
            // INNER RANGE DIV //
            /////////////////////
            this.$divRangeCoverUp = $('<div>').css({
                'position': 'absolute',
                'left': 0,
                'top': 0,
                'right': 0,
                'background-color': '#ccc'
            });
            this.$divRangeCoverDown = $('<div>').css({
                'position': 'absolute',
                'left': 0,
                'bottom': 0,
                'right': 0,
                'background-color': '#ccc'
            });
            this.$divRange = $('<div>').css({
                'position': 'absolute',
                'left': 0,
                'top': 0,
                'bottom': 0,
                'right': 0,
                'background-color': 'transparent',
                'font-family': 'Microsoft YaHei',
                'font-weight': 'bold',
                'cursor': 'move'
            });

            ///////////
            // ARROW //
            ///////////
            halfHeight = options.arrowSize/2;
            this.$arrowUp = $('<span>').css({
                'position': 'absolute',
                'left': options.width,
                'top': -halfHeight,
                'width': options.arrowSize,
                'height': options.arrowSize,
                'border-top-width': halfHeight,
                'border-left-width': 0,
                'border-bottom-width': halfHeight,
                'border-right-width': options.arrowSize,
                'border-color': 'transparent #555 transparent transparent',
                'border-style': 'solid'
            });

            this.$arrowDown = $('<span>').css({
                'position': 'absolute',
                'left': options.width,
                'bottom': -halfHeight,
                'width': options.arrowSize,
                'height': options.arrowSize,
                'border-top-width': halfHeight,
                'border-left-width': 0,
                'border-bottom-width': halfHeight,
                'border-right-width': options.arrowSize,
                'border-color': 'transparent #555 transparent transparent',
                'border-style': 'solid'
            });

            this.$labelUp = $('<span>High</span>').css({
                'height': 25,
                'line-height': '25px', 
                'position': 'absolute',
                'left': 0,
                'right': 0,
                'top': -25,
                'font-weight': 'bold'
            });
            this.$labelDown = $('<span>Low</span>').css({
                'height': 25,
                'line-height': '25px', 
                'position': 'absolute',
                'left': 0,
                'right': 0,
                'bottom': -25,
                'font-weight': 'bold'
            });

            this.$arrowLabelUp = $('<span>').css({
                'position': 'absolute',
                'left': this.options.arrowSize + 4,
                'top': -this.options.arrowSize/2,
                'line-height': this.options.arrowSize+'px'
            });

            this.$arrowLableDown = $('<span>').css({
                'position': 'absolute',
                'left': this.options.arrowSize + 4,
                'top': -this.options.arrowSize/2,
                'line-height': this.options.arrowSize+'px'
            })

            this.$arrowUp.append(this.$arrowLabelUp);
            this.$arrowDown.append(this.$arrowLableDown);
            this.$divRange
                .append( this.$arrowUp )
                .append( this.$arrowDown );
            this.$divWrap
                .append( this.$divRangeCoverUp )
                .append( this.$divRangeCoverDown )
                .append( this.$divRange );
                // .append( this.$labelUp )
                // .append( this.$labelDown );
            this.$container.append( this.$divWrap )
        },
        changeColors: function (top, bottom) {
            var height      = _this.options.height;
            var ratioTop    = top / height;
            var ratioBottom = bottom / height;
            var colors      = this.colors;

            // TODO
        },
        // 
        getColorByValue: function (value) {
            var percent, color = [];

            for (var i = 0, row, len = this.colorsRange.length; i < len; i++) {
                row = this.colorsRange[i];
                if(value <= row.to) {
                    percent = (value-row.from) / (row.to-row.from);
                    color.push( (row.colorFrom[0] + (row.colorTo[0]-row.colorFrom[0])*percent)/255 * 100 + '%' );
                    color.push( (row.colorFrom[1] + (row.colorTo[1]-row.colorFrom[1])*percent)/255 * 100 + '%' );
                    color.push( (row.colorFrom[2] + (row.colorTo[2]-row.colorFrom[2])*percent)/255 * 100 + '%' );
                    break;
                }
            }
            return 'rgb('+color.join(',')+')';
        },
        setVisibleMarkers: function (topValue, bottomValue) {
            var _this = this;
            var $markers = this.$markers;
            var projectId, value, row;

            if(!this.data) return;

            topValue = [null, undefined].indexOf(topValue) > -1 ? this.options.range.max : topValue;
            bottomValue = [null, undefined].indexOf(bottomValue) > -1 ? this.options.range.min : bottomValue;

            ([]).forEach.call( $markers, function (row, i) {
                var $this = $(row);
                projectId = $this.attr('data-id');
                value = _this.data[projectId];
                if(value === -1 || value === undefined ||
                    value > topValue || value < bottomValue ) {
                    _this.mapIns.markers[projectId].hide();
                } else {
                    _this.mapIns.markers[projectId].show();
                }
            } );
        },
        // 易混淆：bottom 指代的是 divRange 底边的 top 值
        setVisibleRange: function (top, bottom) {
            var optMin = this.options.range.min === undefined ? DEFAULTS.range.min : this.options.range.min;
            var optMax = this.options.range.max === undefined ? DEFAULTS.range.max : this.options.range.max;
            var range  = optMax - optMin;
            var topRatio, topValue;
            var bottomRatio, bottomValue;

            if(top !== undefined && top !== null) {
                topRatio = 1 - (top-0) / this.options.height;
                topValue = Math.round( (optMin + topRatio*range)*100 )/100;
                this.$arrowLabelUp.text(topValue);
                this.$divRange.css( 'top', top );
                this.$divRangeCoverUp.css('bottom', this.options.height-top);
                this.visibleRangeValue.top = topValue;
            }
            if(bottom !== undefined && bottom !== null) {
                bottomRatio = 1 - (bottom-0) / this.options.height;
                bottomValue = Math.round( (optMin + bottomRatio*range)*100 )/100;
                this.$arrowLableDown.text(bottomValue);
                this.$divRange.css( 'bottom', this.options.height-bottom );
                this.$divRangeCoverDown.css('top', bottom);
                this.visibleRangeValue.bottom = bottomValue;
            }
            this.setVisibleMarkers(this.visibleRangeValue.top, this.visibleRangeValue.bottom);

            typeof this.options.onRangeChange === 'function' &&
                this.options.onRangeChange();

        },
        attachEvents: function () {
            var _this     = this;
            var minHeight = 20;

            // up arrow move events
            this.$arrowUp
            .on('mousedown', function (e) {
                var position    = _this.$divRange.position();
                var delta       = position.top - e.pageY;
                // 这里取的是底边相对于顶部的 top 值，而非 bottom 值
                var mDownBottom = _this.$divRange.height() + position.top;
                _this.$container.on('mousemove', function (e) {
                    var top = delta + e.pageY;
                    // 也可以根据 divRange 的 height 来判断，不过每次都查询 height，不好
                    top = Math.max( 0, Math.min(top, mDownBottom-minHeight) );
                    _this.setVisibleRange(top);
                    e.stopPropagation();
                });
                e.stopPropagation();
            });
            _this.$container.on('mouseup mouseleave', function (e) {
                $(this).off('mousemove');
                e.preventDefault();
            });
            // down arrow move events
            this.$arrowDown
            .on('mousedown', function (e) {
                var position = _this.$divRange.position();
                var mDownTop = position.top;
                // 这里取的是底边相对于顶部的 top 值的偏移量
                var delta    = _this.$divRange.height() + position.top - e.pageY;
                _this.$container.on('mousemove', function (e) {
                    var bottom = delta + e.pageY;
                    bottom = Math.max( mDownTop+minHeight, Math.min(_this.options.height, bottom) );
                    _this.setVisibleRange(null, bottom);
                    e.stopPropagation();
                });
                e.stopPropagation();
            });

            //divRange move events
            _this.$divRange
            .on('mousedown', function (e) {
                var position    = _this.$divRange.position();
                var deltaTop    = position.top - e.pageY;
                var height      = _this.$divRange.height();
                var deltaBottom = height + position.top - e.pageY;
                _this.$container.on('mousemove', function (e) {
                    var top    = deltaTop + e.pageY;
                    var bottom = deltaBottom + e.pageY;

                    if(top < 0) {
                        top = 0;
                        bottom = height;
                    }
                    if(bottom > _this.options.height) {
                        top = _this.options.height - height;
                        bottom = _this.options.height;
                    };
                    _this.setVisibleRange(top, bottom);
                    e.stopPropagation();
                });
                e.stopPropagation();
            });
        },
        setOptions: function (options) {
            var originColors = this.options.colors || [];
            this.options = $.extend({}, this.options, options);
            if( this.options.colors && (originColors.join('') !== this.options.colors.join('') ) ) {
                this.$divWrap.css({
                    'background-image': 'linear-gradient(to top, '+this.options.colors.join(',')+')'
                });
            }
            this.initColors();
            this.setVisibleRange(0, this.options.height);
        }
    }

    var DEFAULTS = {
        width: 20,
        height: 180,
        arrowSize: 12,
        colors: ['#87E034', '#EDE24C', '#F53F52'],
        range: {min: 0, max: 100}
    };

    return DataRange;
}(window, jQuery) );