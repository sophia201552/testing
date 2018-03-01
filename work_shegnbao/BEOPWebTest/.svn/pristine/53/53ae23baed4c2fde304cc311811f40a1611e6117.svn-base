/** 
 * 背景图层
 */

(function (GLayer, HtmlWidgetMixin) {

    function GBgLayer(painter, model) {
        GLayer.apply(this, arguments);

        this.stage = this.painter.bgLayer;
        this.imageModelSet = this.painter.screen.store.imageModelSet;
    }

    GBgLayer.prototype = Object.create(GLayer.prototype);
    GBgLayer.prototype.constructor = GBgLayer;

    GBgLayer.prototype.add = function () {};

    GBgLayer.prototype.show = function () {
        var model = this.store.model;
        var vw = this.painter.pageWidth;
        var vh = this.painter.pageHeight;

        // 图形创建
        this.shape = document.createElement('div');
        this.shape.id = model._id();
        this.shape.className = 'html-group';

        this.update();

        this.stage.add(this);

        // 父类方法
        GLayer.prototype.show.apply(this, arguments);
    };

    GBgLayer.prototype.update = function (e, propName) {
        var model = this.store.model;
        var options = model.option();

        // 纯色背景
        if (!options.type || options.type === 'color') {
            this.shape.style.background = options.color || '#fff';
            this.painter.resizePage(model.property('w'), model.property('h'));
        }
        // 图片背景
        else if (options.type === 'image') {
            this.shape.style.background = 'url('+options.url+')';
            this.painter.resizePage(model.property('w'), model.property('h'), options.display || 'center');
        }
    };

    GBgLayer.prototype.close = function () { };

    GBgLayer.prototype.getLayerType = function () {
        return 'bg';
    };

    GBgLayer.prototype = Mixin(GBgLayer.prototype, HtmlWidgetMixin);

    /** @override */
    GBgLayer.prototype.type = 'Layer';

    ///////////////////
    // STATIC METHOD //
    ///////////////////
    GBgLayer.getEmptyEntity = function () {
        return {
            "_id": ObjectId(),
            "type": "bg",
            "name": "背景",
            "isLock": 0,
            "isHide": 0,
            "list": [],
            "w": 800,
            "h": 600,
            "option": {
                "type": "color", // color, image
                "color": "#fff",
                "display": "",
                "url": ""
            }
        };
    };

    window.layers = window.layers || {};
    window.layers.bg = GBgLayer;
} (window.layers.GLayer, window.mixins.HtmlWidgetMixin))