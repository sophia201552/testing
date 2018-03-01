/** 
 * factory Canvas 控件基类
 */

(function () {

    // 不需要重写，但需要调用的方法
    var methods = [
        'moveToBottom',
        'getType',
        'id',
        'getZIndex',
        'getAbsolutePosition',
        'x',
        'y',
        'offsetX',
        'offsetY',
        'hasName',
        'points',
        'radius',
        'strokeWidth',
        'setZIndex',
        'isVisible'
    ];

    // 需要重写的方法
    var CanvasWidgetMixin = {
        // 获取包含的控件
        getChildren: function () {
            return this.children;
        },
        // 获取被包含的图层
        getLayer: function () {
            return this.layer;
        },
        // 判断是否包含某个图形，一般由图层级别的控件调用
        hasShape: function (shape) {
            return this.shape === shape;
        },
        // 设置控件的绝对位置
        setAbsolutePosition: function (pos) {
            var model = this.store.model;
            model.update(pos);
        },
        // 设置控件的位置
        position: function (pos) {
            var model = this.store.model;
            
            if (!pos) {
                return {
                    x: model.x(),
                    y: model.y()
                };
            }
            return this.store.model.update({
                x: pos.x,
                y: pos.y
            });
        },
        // 设置/获取控件的宽度
        width: function (val) {
            if(Object.prototype.toString.call(val) === '[object Number]') {
                return this.store.model.w(val);
            }
            return this.store.model.w();
        },
        // 设置/获取控件的高度
        height: function (val) {
            if(Object.prototype.toString.call(val) === '[object Number]') {
                return this.store.model.h(val);
            }
            return this.store.model.h();
        },
        scale: function (val) {
            if (Object.prototype.toString.call(val) === '[object Object]') {
                return this.store.model['option.scale'](val);
            }
            return this.store.model['option.scale']();
        },
        attach: function () {
            this.shape.show();
        },
        detach: function () {
            this.shape.hide();
        },
        destroy: function () {
            var _this = this;
            var children = this.getParent().children;
            children.some(function (row, i) {
                if (row === _this) {
                    children.splice(i, 1);
                    return true;
                }
            });
            this.shape.destroy();
        }
    };

    /** 默认方法 */
    methods.forEach(function (m) {
        CanvasWidgetMixin[m] = function () {
            if (typeof this.shape[m] !== 'undefined') {
                return this.shape[m].apply(this.shape, arguments);
            }
        };
    });

    window.mixins = window.mixins || {};
    window.mixins.CanvasWidgetMixin = CanvasWidgetMixin;

} ());