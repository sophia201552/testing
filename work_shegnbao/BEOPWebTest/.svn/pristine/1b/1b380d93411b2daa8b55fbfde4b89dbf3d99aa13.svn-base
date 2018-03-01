/** 
 * factory Canvas 控件基类
 */

(function () {

    // 不需要重写，但需要调用的方法
    var methods = ['getType', 'id', 'getZIndex', 'getAbsolutePosition', 'offsetX', 'offsetY', 'hasName', 'getParent'];

    // 需要重写的方法
    var CanvasWidgetMixin = {
        getChildren: function () {
            return this.children;
        },
        getLayer: function () {
            return this.layer;
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
        destroy: function () {
            var children = [];
            var removed = [];

            // 如果是 layer 的删除
            if (this.getType() === 'Group') {
                children = this.stage.getChildren();
            }
            // 如果是 widget 的删除
            else {
                children = this.layer.getChildren();
            }

            for (var i = 0, len = children.length; i < len; i++) {
                if( children[i].id() === this.store.model._id() ) {
                    removed = children.splice(i, 1);
                    break;
                }
            }
            if(removed.length === 0) return;
            return this.shape.destroy();
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