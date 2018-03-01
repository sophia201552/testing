/** 
 * factory 控件基类
 */

(function () {

    function Widget(layer, model) {
        this.layer = layer;

        this.store = {};
        this.store.model = model;
        this.store.imageModelSet = this.layer.painter.screen.store.imageModelSet;

        this.shape = null;


        this.init();
    }

    Widget.prototype.init = function () {
        this.layer.children.push(this);
        this.bindModelOb();
    };
    
    Widget.prototype.bindModelOb = function () {
        this.store.model.addEventListener('update', this.update, this);
    };

    Widget.prototype.update = function (e) {
        // 更新交互图层图形的位置和大小
        var layer = this.layer.painter.interactiveLayer;
        var id = this.id();
        var shape = layer.findOne('#'+id);
    };

    Widget.prototype.show = function () {};

    Widget.prototype.close = function () {};

    window.widgets = window.widgets || {};
    window.widgets.factory = window.widgets.factory  || {};
    window.widgets.factory.Widget = Widget;
} ())