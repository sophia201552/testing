/** 
 * factory Html 控件基类
 */

(function (exports, SuperClass) {

    var CHROME_MINIMUM_FONT_SIZE = 12;

    function HtmlWidget() {
        SuperClass.apply(this, arguments);

        // 投影到 canvas 图层的阴影图形
        // 每个 html 控件都会在 canvas 图层上有一个投影
        // 这样可以用 canvas 的逻辑进行统一处理
        this.shadowShape = null;
    }

    HtmlWidget.prototype = Object.create(SuperClass.prototype);
    HtmlWidget.prototype.constructor = HtmlWidget;

    +function () {

        this.getCanvasLayer = function () {
            return this.painter.canvasStage;
        };

        // 首次初始化的时候，进行 shadow shape 的绘制
        this.show = function () {
            var model = this.store.model;

            this.shadowShape = new Konva.Shape({
                id: 'ss_' + model._id(),
                name: GUtil.SHADOW_SHAPE_NAME, 
                hitFunc: function(context) {
                    var width = this.getWidth();
                    var height = this.getHeight();

                    context.beginPath();
                    context.rect(0, 0, width, height);
                    context.closePath();
                    context.fillStrokeShape(this);
                }
            });

            // 将映射图形加到 canvas 图层上去
            this.getCanvasLayer().getShape().add(this.shadowShape);
        };

        this.update = function (e) {
            var model = this.store.model;
            // 根据 x, y, w, h 绘制
            this.shadowShape.x(model.x());
            this.shadowShape.y(model.y());
            this.shadowShape.width(model.w());
            this.shadowShape.height(model.h());

            if (e) {
                this.getCanvasLayer().draw();
            }
        };

        // 设置 z-index
        this.setZIndex = function (zIndex) {
            this.shape.style.zIndex = zIndex;
            // 更新 shadow shape 的 z-index
            this.shadowShape.setZIndex(zIndex);
        };

        this.fixZoom = function () {
            var dpr = window.devicePixelRatio;
            var html, fontSize;
            var pattern, matches;
            var factor;

            // 对于放大，不做处理
            if (dpr >= 1) {
                return;
            }

            html = this.shape.innerHTML;
            pattern = /font-size:\s*(\d+)px/mgi;
            matches = pattern.exec(html);
            fontSize = 12;

            if (matches) {
                fontSize = Math.max( 12, parseFloat(matches[1]) );
            }

            factor = fontSize * dpr / CHROME_MINIMUM_FONT_SIZE;
            if (factor < 1) {
                this.shape.style.width = this.store.model.w() / factor + 'px';
                this.shape.style.height = this.store.model.h() / factor + 'px';
                this.shape.style.transform = 'scale(' + factor + ')';
            }
        };

    }.call(HtmlWidget.prototype);

    exports.HtmlWidget = HtmlWidget;
} (
    namespace('widgets.factory'),
    namespace('widgets.factory.Widget')
));