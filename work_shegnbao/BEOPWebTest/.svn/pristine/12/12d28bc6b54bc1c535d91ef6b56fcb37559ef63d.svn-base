/** 
 * Html 图层
 */

(function (GLayer, HtmlWidgetMixin) {

    function GHtmlLayer(painter, model) {
        GLayer.apply(this, arguments);

        this.stage = painter.htmlLayer;
        this.children = [];
    }

    GHtmlLayer.prototype = Object.create(GLayer.prototype);
    GHtmlLayer.prototype.constructor = GHtmlLayer;

    GHtmlLayer.prototype.init = function () {
        GLayer.prototype.init.apply(this, arguments);
    };

    GHtmlLayer.prototype.show = function () {

        this.shape = document.createElement('div');
        this.shape.id = this.store.model._id();
        this.shape.className = 'html-group';

        this.painter.htmlLayer.add(this);

        // 父类方法
        GLayer.prototype.show.apply(this, arguments);
    };

    GHtmlLayer.prototype.showLayer = function () {
        this.shape.style.display = 'block';
    };

    GHtmlLayer.prototype.hideLayer = function () {
        this.shape.style.display = 'none';
    };

    GHtmlLayer.prototype.add = function (shape) {
        this.shape.appendChild(shape);
    };

    /** override */
    GHtmlLayer.prototype.draw = function () {};

    GHtmlLayer.prototype.getLayerType = function () {
        return 'html';
    };

    GHtmlLayer.prototype.close = function () {
        GLayer.prototype.close.call(this);

        // 销毁 shape
        this.shape.parentNode.removeChild(this.shape);
    };

    GHtmlLayer.prototype = Mixin(GHtmlLayer.prototype, HtmlWidgetMixin);

    GHtmlLayer.prototype.type = 'Layer';

    ///////////////////
    // STATIC METHOD //
    ///////////////////
    GHtmlLayer.getEmptyEntity = function () {
        return {
            "_id": ObjectId(),
            "type": "html",
            "name": I18n.resource.mainPanel.layerPanel.HTML_LAYER,//"Html 图层"
            "isLock": 0,
            "isHide": 0,
            "list": [], 
            "option": {}
        };
    };

    window.layers = window.layers || {};
    window.layers.html = GHtmlLayer;
} (window.layers.GLayer, window.mixins.HtmlWidgetMixin));