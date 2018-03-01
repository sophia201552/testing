/** 简化版的 painter，不可修改，不包含交互 */
(function () {

    var class2type = Object.prototype.toString;

    var DEFAULT_PAGE_WIDTH = 800;
    var DEFAULT_PAGE_HEIGHT = 600;

    function GReadonlyPainter(screen) {
        this.screen = screen;
        this.domContainer = screen.painterCtn;
        
        this.domCanvas = undefined;
        this.context2d = undefined;
        this.scaleX = undefined;
        this.scaleY = undefined;

        this.stage = undefined;
        this.staticLayer = undefined;
        this.interactiveLayer = undefined;
        this.htmlLayer = undefined;
        this.bgLayer = undefined;

        this.pageWidth = DEFAULT_PAGE_WIDTH;
        this.pageHeight = DEFAULT_PAGE_HEIGHT;

        // Model
        this.store = {};
        this.store.layerModelSet = screen.store.layerModelSet;
        this.store.widgetModelSet = screen.store.widgetModelSet;

        // bind observer
        this.bindLayerModelSetOb();
        this.bindWidgetModelSetOb();
    }

    GReadonlyPainter.prototype = {
        constructor: GReadonlyPainter,
            
        init: function () {},

        show: function () {
            var styles = window.getComputedStyle(this.domContainer);
            var width = parseInt(styles.width);
            var height = parseInt(styles.height);

            // 舞台创建
            this.stage = new Konva.Stage({
                container: this.domContainer,
                width: width,
                height: height
            });

            // 静态图层创建
            this.staticLayer = new GCanvasStage(this, {
                hitGraphEnabled: false
            });

            // html 图层创建
            this.htmlLayer = new GHtmlStage(this);

            // bg 图层创建
            this.bgLayer = new GHtmlStage(this);
            this.bgLayer.setZIndex(1);

            // 默认显示比例为 1
            this.scaleTo(1, 1);

            this.initOnResize();
        },

        addWidget: function (model) {
            var ModalClass = null;
            var widget = null;
            var layer, layerId = model.layerId();


            if ( !(ModalClass = window.widgets.factory[model.type()]) ) {
                Log.error('Class not found: ' + model.type());
                return;
            }

            layer = this.findLayer(layerId);
            if (layer === null) {
                Log.warn('one widget that has no parent layer.');
                return;
            }

            model.x(model.x()*this.scaleX);
            model.y(model.y()*this.scaleY);
            if (model.type() === 'CanvasPipe') {
                model['option.points'](model['option.points']().map(function (p, i) {
                    return i % 2 === 0 ? p*this.scaleX : p*this.scaleY;
                }, this));
            }

            widget = new ModalClass(layer, model);
            widget.show();
        },

        addLayer: function (model) {
            var ModalClass;
            if ( !(ModalClass = window.layers[model.type()]) ) {
                Log.error('Class not found: ' + model.type());
                return;
            }

            new ModalClass(this, model).show();
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
            window.onresize = function () {
                var styles = window.getComputedStyle(_this.domContainer);
                var width = parseInt(styles.width);
                var height = parseInt(styles.height);

                _this.stage.width(width);
                _this.stage.height(height);
                _this.resizePage(width, height);
            };
        },

        resizePage: function (width, height) {
            var tW = this.stage.width();
            var tH = this.stage.height();

            this.pageWidth = parseFloat(width);
            this.pageHeight = parseFloat(height);

            this.scaleTo(tW/this.pageWidth, tH/this.pageHeight);
        },

        getViewportPosition: function () {
            var w = this.stage.width();
            var h = this.stage.height();
            var vw = this.pageWidth * this.scaleX;
            var vh = this.pageHeight * this.scaleY;

            return {
                x: (w-vw)/2,
                y: (h-vh)/2
            }
        },

        // 根据 layer id 查找 layer
        findLayer: function (layerId) {
            var selector = '#' + layerId;
            // 先在 canvas layer 中查找
            var layer = this.staticLayer.findOne(selector);
            if (!!layer) {
                return layer;
            }

            // 再在 html layer 中查找
            layer = this.htmlLayer.findOne(selector);
            if (!!layer) {
                return layer;
            }
            return null;
        },

        scaleTo: function (scaleX, scaleY) {
            var width = this.staticLayer.width();
            var height = this.staticLayer.height();
            var offset;

            this.scaleX = scaleX;
            this.scaleY = scaleY;

            offset = this.getViewportPosition();
            this.staticLayer.offsetX(-offset.x/scaleX);
            this.staticLayer.offsetY(-offset.y/scaleY);

            this.staticLayer.draw();

            // 处理 html layer 的缩放
            this.htmlLayer.viewScale(scaleX, scaleY);

            // 处理 html layer 的缩放
            this.bgLayer.viewScale(scaleX, scaleY);
        },

        draw: function () {
            this.staticLayer.draw();
            this.htmlLayer.draw();
            this.bgLayer.draw();
        },

        close: function () {
            window.onresize = null;
        }
    };

    window.GReadonlyPainter = GReadonlyPainter;

} ());