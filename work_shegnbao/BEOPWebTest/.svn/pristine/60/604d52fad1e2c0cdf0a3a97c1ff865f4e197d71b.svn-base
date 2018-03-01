/** 
 * factory HTML 控件基类
 */

(function () {

    var HtmlWidgetMixin = {
        type: 'html',
        name: '',
        zIndex: 1,
        getType: function () {
            return this.type;
        },
        id: function () {
            return this.shape.id;
        },
        getChildren: function () {
            return this.children;
        },
        getLayer: function () {
            return this.layer;
        },
        getZIndex: function () {
            return this.zIndex;
        },
        getAbsolutePosition: function () {
            var model = this.store.model;
            var style = window.getComputedStyle(this.layer.stage.shape);
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
        setAbsolutePosition: function (pos) {
            var model = this.store.model;
            model.update(pos);
        },
        position: function (pos) {
            var model = this.store.model;

            model.update(pos);
        },
        width: function (val) {
            if(Object.prototype.toString.call(val) === '[object Number]') {
                return this.store.model.w(val);
            }
            return this.store.model.w();
        },
        height: function (val) {
            if(Object.prototype.toString.call(val) === '[object Number]') {
                return this.store.model.h(val);
            }
            return this.store.model.h();
        },
        hasName: function (name) {
            return this.shape.classList.contains(name);
        },
        moveToBottom: function () {},
    };

    window.mixins = window.mixins || {};
    window.mixins.HtmlWidgetMixin = HtmlWidgetMixin;

} ());