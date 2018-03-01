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

        // 图形创建
        this.shape = document.createElement('div');
        this.shape.id = model._id();
        this.shape.className = 'html-group bg-group';

        this.stage.add(this);
        this.update();

        // 父类方法
        GLayer.prototype.show.apply(this, arguments);
    };

    GBgLayer.prototype.update = function (e, propName) {
        var model = this.store.model;
        var options = model.option();
        var isHide = model.isHide();

        if (isHide === 1) {
            this.shape.style.display = 'none';//隐藏背景图层
            return;
        }else {
            this.shape.style.display = 'block';//显示背景图层
        }

        this.shape.style.background = null;
        // 纯色背景
        if (!options.type || options.type === 'color') {
            this.shape.style.backgroundColor = options.color || '#ffffff';
        }
        // 图片背景
        else if (options.type === 'image') {
            if (options.url == ''){
                this.shape.style.backgroundColor = '#ffffff';
            } else {
                this.shape.style.backgroundSize = options.display === 'stretch' ? '100% 100%' : options.display;
                this.shape.style.backgroundImage = 'url('+options.url+')';
            }
        } else if (options.type === 'html') {
            this.shape.style.backgroundColor = '#ffffff';
        }
    };


    GBgLayer.prototype.close = function () {
        GLayer.prototype.close.call(this);

        // 销毁 shape
        this.shape.parentNode.removeChild(this.shape);
    };

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
            "name": I18n.resource.mainPanel.layerPanel.BG_LAYER,//"背景"
            "isLock": 0,
            "isHide": 0,
            "list": [],
            "w": 800,
            "h": 600,
            "option": {
                "type": "color", // color, image
                "color": "#ffffff",
                "display": "",
                "url": ""
            }
        };
    };

    window.layers = window.layers || {};
    window.layers.bg = GBgLayer;
} (window.layers.GLayer, window.mixins.HtmlWidgetMixin));