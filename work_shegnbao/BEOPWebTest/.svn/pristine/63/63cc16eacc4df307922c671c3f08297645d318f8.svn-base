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
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0.5 18.5 18 18" width="18px" height="18px">\
<path stroke="none" d="M13.7,22.6C10.3,19,7.9,19,7,19.2l-0.4-0.4c-0.1,0-0.5-0.3-1.1-0.3c-0.4,0-0.7,0.1-1,0.4\
C4.2,19,4.1,19.2,4,19.4c-0.6-0.3-1.3-0.3-1.8,0.2c-0.3,0.3-0.5,0.7-0.5,1.1c0,0.1,0,0.3,0.1,0.4c-0.2,0.1-0.5,0.2-0.7,0.4\
c-0.9,0.7-0.5,1.7-0.2,2.3c2.7,2.6,5.6,5.8,6.1,7c-0.5-0.2-1.4-0.9-1.9-1.4c-1.7-1.4-2.8-2.2-3.6-1.7c-0.6,0.3-0.7,0.8-0.8,1.1\
c-0.4,1.5,3.4,5.2,3.6,5.4c1.2,1.3,8.9,2.4,8.9,2.4c0.1,0,0.2,0,0.3-0.1l4.8-3.3c0.1-0.1,0.2-0.2,0.2-0.4\
C18.5,32.5,18.7,27.8,13.7,22.6z M13.1,35.5L13.1,35.5c-2.9-0.4-7.4-1.3-8.1-2.1c0,0-0.1-0.1-0.2-0.2c-2.6-2.7-3.6-4.1-3.1-4.6\
c0.1-0.1,0.2-0.1,0.4-0.1c0.5,0,1.4,0.7,2.1,1.3L4.4,30c1,0.8,2.1,1.6,2.8,1.6c0.2,0,0.4-0.1,0.5-0.2c0.1-0.1,0.1-0.2,0.1-0.3\
c0-1.3-3.2-5.1-6.3-8c-0.2-0.3-0.3-0.7,0-1C1.8,22,2,21.9,2.2,21.9c0.2,0,0.3,0.1,0.4,0.1l4.5,4.3c0.2,0.1,0.4,0.1,0.6,0\
c0.1-0.1,0.1-0.1,0.1-0.2c0-0.1-0.1-0.3-0.1-0.3l-4.5-4.3c0,0-0.5-0.4-0.5-0.9c0-0.2,0.1-0.3,0.2-0.4c0.1-0.1,0.3-0.2,0.4-0.2\
c0.4,0,0.9,0.4,1.1,0.7L9,25.2c0.2,0.1,0.4,0.1,0.6,0c0.1-0.1,0.1-0.1,0.1-0.2c0-0.1-0.1-0.3-0.1-0.3l-4.6-4.4\
c-0.1-0.1-0.1-0.4,0.1-0.6c0.1-0.1,0.3-0.2,0.5-0.2c0.2,0,0.4,0.1,0.4,0.2h0l5,4.3c0.2,0.1,0.4,0.1,0.6,0c0.1-0.1,0.1-0.2,0.1-0.3\
c0-0.1-0.1-0.2-0.1-0.3L7.8,20l0.5,0.1c1,0.2,2.6,0.9,4.7,3.1c4,4.2,4.5,8.1,4.5,9.2l0,0.1L13.1,35.5z"></path>\
</svg>\
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