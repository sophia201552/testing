/** 
 * factory HTML 控件基类
 */

(function () {

    var HtmlWidgetMixin = {
        // 默认的控件类别
        type: 'html',
        // 控件名称
        name: '',
        // 控件在 Z 轴上的层级数
        zIndex: 1,
        // 获取控件的类型
        getType: function () {
            return this.type;
        },
        // 获取控件的 id
        id: function () {
            return this.shape.id;
        },
        // 获取包含的控件
        getChildren: function () {
            return this.children;
        },
        // 获取被包含的图层
        getLayer: function () {
            return this.layer;
        },
        // 获取当前控件的层级
        getZIndex: function () {
            return this.zIndex;
        },
        hasShape: function (shape) {
            var id = this.store.model._id();
            var shapeId = shape.id().split('_')[1];

            return id === shapeId;
        },
        // 获取控件的绝对位置
        getAbsolutePosition: function () {
            var model = this.store.model;
            var style = window.getComputedStyle(this.layer.shape);
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
        // 获取/设置控件的绝对位置
        setAbsolutePosition: function (pos) {
            var model = this.store.model;
            model.update(pos);
        },
        // 获取/设置控件的位置
        position: function (pos) {
            var model = this.store.model;
            if (!pos) {
                return {
                    x: model.x(),
                    y: model.y()
                };
            }
            return model.update(pos);
        },
        // 获取/设置控件的宽度
        width: function (val) {
            if(Object.prototype.toString.call(val) === '[object Number]') {
                return this.store.model.w(val);
            }
            return this.store.model.w();
        },
        // 获取/设置控件的高度
        height: function (val) {
            if(Object.prototype.toString.call(val) === '[object Number]') {
                return this.store.model.h(val);
            }
            return this.store.model.h();
        },
        // 判断控件的图形是否包含某个 css 类名
        hasName: function (name) {
            return this.shape.classList.contains(name);
        },
        // 将当前控件移动到整个画布的最底层
        moveToBottom: function () {},
        isVisible: function () {
            return (this.shape.offsetParent !== null);
        },
        attach: function () {
            this.shape.style.display = '';
            this.shadowShape.show()
        },
        detach: function () {
            this.shape.style.display = 'none';
            this.shadowShape.hide();
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
            this.getLayer().shape.removeChild(this.shape);
            // 销毁影子图形
            this.shadowShape.destroy();
        }

    };

    window.mixins = window.mixins || {};
    window.mixins.HtmlWidgetMixin = HtmlWidgetMixin;

} ());