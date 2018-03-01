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