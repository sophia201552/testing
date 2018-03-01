(function () {

    function TGridLine() {
        TBase.apply(this, arguments);
    }

    TGridLine.prototype = Object.create(TBase.prototype);
    TGridLine.prototype.constructor = TGridLine;

    TGridLine.prototype.tpl = '\
<button class="btn-trigger" data-type="gridLineCtrl" title="显示网格线">\
    <span class="glyphicon glyphicon-th"></span>\
</button>';

    TGridLine.prototype.onTrigger = function () {
        var $gridLine = $('.html-group.bg-group.gridLine');
        var $bg = $('.html-group.bg-group');
        if($gridLine.length < 1){
            $bg.after('<div class="html-group bg-group gridLine"></div>')
        }else{
            $gridLine.remove();
        }
    };

    window.TGridLine = TGridLine;
} ());