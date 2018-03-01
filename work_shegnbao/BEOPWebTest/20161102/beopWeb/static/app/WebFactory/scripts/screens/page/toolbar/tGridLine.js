(function () {

    function TGridLine() {
        TBase.apply(this, arguments);
    }

    TGridLine.prototype = Object.create(TBase.prototype);
    TGridLine.prototype.constructor = TGridLine;

    TGridLine.prototype.tpl = '\
<button class="btn-trigger" data-type="gridLineCtrl" title="显示网格线">\
    <span class = "iconfont icon-wanggexian"></span>\
</button>';

    TGridLine.prototype.onTrigger = function () {
        var $gridLine = $('.html-group.bg-group.gridLine');
        var $bg = $('#innerBg');
        if(!$gridLine.length){
            $bg.after('<div class="html-group bg-group gridLine"></div>');
            this.painter.setGridWidth(10);
        }else{
            $gridLine.remove();
            this.painter.setGridWidth(1);
        }
    };

    window.TGridLine = TGridLine;
} ());