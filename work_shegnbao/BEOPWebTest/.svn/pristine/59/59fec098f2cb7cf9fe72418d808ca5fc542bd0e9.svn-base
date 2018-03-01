(function () {

    function THand(toolbar, container) {
        TBase.apply(this, arguments);
    }

    THand.prototype = Object.create(TBase.prototype);
    THand.prototype.constructor = THand;

    THand.prototype.option = {
        cursor: 'crosshair'
    };

    THand.prototype.tpl = '\
<button class="btn-switch" title="手型工具(m)" data-type="handCtrl">\
    <span class = "iconfont icon-weibiaoti1"></span>\
</button>';
    
    (function () {
        var mDownX, mDownY;

        THand.prototype.mouseDownActionPerformed = function (e) {
            //鼠标按下时鼠标样式为伸手型
            this.toolbar.cursor('-webkit-grabbing');
            var evt = e.evt;

            mDownX = evt.layerX;
            mDownY = evt.layerY;

            this.painter.setActiveWidgets();
        };

        THand.prototype.mouseMoveActionPerformed = function (e) {
            var evt = e.evt;
            var offsetX = evt.layerX - mDownX;
            var offsetY = evt.layerY - mDownY;
            this.painter.moveLayer(offsetX,offsetY,false);
            mDownX = evt.layerX;
            mDownY = evt.layerY;
        };

        THand.prototype.mouseUpActionPerformed = function (e, cursor) {
            //鼠标松开时鼠标样式为抓手型
            this.toolbar.cursor(cursor || '-webkit-grab');
        };
    } ());

    THand.prototype.close = function () {

    };

    window.THand = THand;
} ());