/** 
 * factory Canvas 控件基类
 */

(function () {

    // 不需要重写，但需要调用的方法
    var methods = ['moveToBottom', 'getType', 'id', 'getZIndex', 'getAbsolutePosition', 'x', 'y', 'offsetX', 'offsetY', 'hasName', 'getParent', 'points', 'radius', 'strokeWidth'];

    // 需要重写的方法
    var CanvasWidgetMixin = {
        getChildren: function () {
            return this.children;
        },
        getLayer: function () {
            return this.layer;
        },
        hasShape: function (shape) {
            return this.shape === shape;
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
        }
    };

    /** 默认方法 */
    methods.forEach(function (m) {
        CanvasWidgetMixin[m] = function () {
            return this.shape[m].apply(this.shape, arguments);
        };
    });

    window.mixins = window.mixins || {};
    window.mixins.CanvasWidgetMixin = CanvasWidgetMixin;

} ());