(function () {

    var tpl = '<div class="dropdown">\
    <button class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false" data-type="zoomCtr"><span class = "iconfont icon-huamiansuofang"></span></button>\
    <ul class="dropdown-menu dropdown-menu-right" style="left:32px;top:-50px;">\
        <li><a href="javascript:;" data-value="0.25">25%</a></li>\
        <li><a href="javascript:;" data-value="0.5">50%</a></li>\
        <li><a href="javascript:;" data-value="0.75">75%</a></li>\
        <li><a href="javascript:;" data-value="1" class="curSelectedScale">100%</a></li>\
        <li><a href="javascript:;" data-value="1.5">150%</a></li>\
        <li><a href="javascript:;" data-value="2">200%</a></li>\
        <li><a href="javascript:;" data-value="5">500%</a></li>\
        <li><a href="javascript:;" data-value="10">1000%</a></li>\
    </ul>\
    </div>';

    function TZoomSelect(toolbar, container) {
        this.toolbar = toolbar;
        this.screen = toolbar.screen;
        this.painter = toolbar.painter;

        this.container = container;

        this.element = undefined;

        this.SCALE = this.painter.scale;
        this.center = undefined;
        this.init();
    }

    TZoomSelect.prototype.init = function () {
        this.element = HTMLParser(tpl);
        this.container.appendChild(this.element);
    };

    TZoomSelect.prototype.show = function () {
        this.attachEvents();
        this.bindEventsToPainter();
    };

    TZoomSelect.prototype.attachEvents = function () {
        var _this = this;
        //var isAltKey = false;
        this.scale = 1;
        $(this.element).children('.dropdown-menu').on('click', 'a', function () {
            var value = parseFloat(this.dataset.value);
            _this.painter.setActiveWidgets();
            _this.painter.scaleTo(value);
            _this.painter.interactiveLayer.draw();
            _this.scale = value;

            //当前比例选中
            $('.curSelectedScale').removeClass('curSelectedScale');
            $(this).addClass('curSelectedScale');

            _this.painter.offsetRestore();
        });

        // alt + 鼠标滚轮 控制缩放比例
        this.painter.domContainer.onmousewheel = function (e) {
            if (e && e.preventDefault)
                e.preventDefault();

            var canvasLayer = _this.painter.canvasStage;
            var $win = $('.window');
            if (!_this.center) {
                _this.center = {
                    x: $win.width() / 2,
                    y: $win.height() / 2
                }
            }

            var beforeScaleX = e.layerX - _this.center.x;
            var beforeScaleY = e.layerY - _this.center.y;
            var proportionX = beforeScaleX / (canvasLayer.width() * _this.painter.scale);
            var proportionY = beforeScaleY / (canvasLayer.height() * _this.painter.scale);
            var num = 0;

            if (e.wheelDelta > 0) {
                num = 1
            } else {
                num = -1
            }

            var scale = _this.painter.scale + 0.05 * num;
            if (scale > 0) {
                _this.painter.setActiveWidgets();
                _this.painter.scaleTo(scale);
                _this.painter.interactiveLayer.draw();
            } 

            if (_this.SCALE < scale) {
                var afterScaleX = (canvasLayer.width() * _this.painter.scale) * proportionX;
                var afterScaleY = (canvasLayer.height() * _this.painter.scale) * proportionY;
                var offsetX = beforeScaleX - afterScaleX,
                    offsetY = beforeScaleY - afterScaleY;

                _this.painter.moveLayer(offsetX,offsetY,true);
            } else {
                _this.painter.offsetRestore();
            }
        }
    };

    TZoomSelect.prototype.bindEventsToPainter = function () {
    };

    TZoomSelect.prototype.mouseDownActionPerformed = function () {
    };

    TZoomSelect.prototype.mouseMoveActionPerformed = function () {
    };

    TZoomSelect.prototype.mouseUpActionPerformed = function () {

    };

    TZoomSelect.prototype.close = function () {
        document.onmousewheel = null;
    };

    window.TZoomSelect = TZoomSelect;
} ());