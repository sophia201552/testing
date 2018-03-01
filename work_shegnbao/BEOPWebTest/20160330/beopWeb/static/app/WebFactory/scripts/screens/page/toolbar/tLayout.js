(function(){

    var tpl ='<div class="dropdown" id="divWrench">\
    <button class="dropdown-toggle" data-toggle="dropdown" title="格式化" role="button" aria-expanded="false"><span class="glyphicon glyphicon-wrench"></span></button>\
    <ul class="dropdown-menu dropdown-menu-right" style="left:32px;top:-50px;">\
        <li><a href="javascript:;" data-value="top"><span class="glyphicon glyphicon-arrow-up" aria-hidden="true"></span>上端对齐</a></li>\
        <li><a href="javascript:;" data-value="right"><span class="glyphicon glyphicon-arrow-right" aria-hidden="true"></span>右端对齐</a></li>\
        <li><a href="javascript:;" data-value="down"><span class="glyphicon glyphicon-arrow-down" aria-hidden="true"></span>下端对齐</a></li>\
        <li><a href="javascript:;" data-value="left"><span class="glyphicon glyphicon-arrow-left" aria-hidden="true"></span>左端对齐</a></li>\
        <li><a href="javascript:;" data-value="level"><span class="glyphicon glyphicon-option-horizontal" aria-hidden="true"></span>水平等间距</a></li>\
        <li><a href="javascript:;" data-value="vertical"><span class="glyphicon glyphicon-option-vertical" aria-hidden="true"></span>垂直等间距</a></li>\
    </ul>\
    </div>';
    function TLayout(toolbar, container) {
        this.toolbar = toolbar;
        this.screen = toolbar.screen;
        this.painter = toolbar.painter;

        this.container = container;

        this.element = undefined;

        this.init();
    }
    TLayout.prototype.init = function () {
        this.element = HTMLParser(tpl);
        this.container.appendChild(this.element);
    };
    TLayout.prototype.show = function () {
        this.attachEvents();
    };
    TLayout.prototype.attachEvents = function () {
        var _this = this;
        $(this.element).children('.dropdown-menu').on('click', 'a', function () {
            var value = this.dataset.value;
            var activeWidgets = _this.painter.state.activeWidgets();
            var len = activeWidgets.length;
            var activeWidgetsArrY = [];
            var activeWidgetsArrXW = [];
            var activeWidgetsArrX = [];
            var activeWidgetsArrYH = [];
            if(len > 1){
                for(var i=0;i<len;i++){
                    if(activeWidgets[i].store.model.type() == 'CanvasPipe'){
                        return;
                    }
                }
                for(var i=0;i<len;i++){
                    var x = activeWidgets[i].store.model.x();
                    var xaddw = x + activeWidgets[i].store.model.w();
                    activeWidgetsArrX.push(x);
                    activeWidgetsArrXW.push(xaddw);
                }
                var maxInNumbersXW = Math.max.apply(Math, activeWidgetsArrXW);
                var maxInNumbersX = Math.max.apply(Math, activeWidgetsArrX);
                var minInNumbersX = Math.min.apply(Math, activeWidgetsArrX);
                for(var i=0;i<len;i++){
                    var y = activeWidgets[i].store.model.y();
                    var yaddh = y + activeWidgets[i].store.model.h();
                    activeWidgetsArrY.push(y);
                    activeWidgetsArrYH.push(yaddh);
                }
                var maxInNumbersYH = Math.max.apply(Math, activeWidgetsArrYH);
                var maxInNumbersY = Math.max.apply(Math, activeWidgetsArrY);
                var minInNumbersY = Math.min.apply(Math, activeWidgetsArrY);
                //上对齐
                if(value == "top"){
                    _this.top(minInNumbersY);
                }
                //右对齐
                if(value == "right"){
                    _this.right(maxInNumbersXW);
                }
                //下对齐
                if(value == "down"){
                    _this.down(maxInNumbersYH);
                }
                //左对齐
                if(value == "left"){
                    _this.left(minInNumbersX);
                }
                //水平等间距
                if(value == "level"){
                    _this.level(maxInNumbersX,minInNumbersX);
                }
                //垂直等间距
                if(value == "vertical"){
                    _this.vertical(maxInNumbersY,minInNumbersY);
                }
            }
            _this.painter.setActiveWidgets();
            _this.painter.setActiveWidgets(activeWidgets);
        })
    };
    TLayout.prototype.top = function (minInNumbersY) {
        var _this = this;
        var activeWidgets = _this.painter.state.activeWidgets();
        var len = activeWidgets.length;
        for(var i=0;i<len;i++) {
            activeWidgets[i].store.model.y(minInNumbersY);
        }
    };
    TLayout.prototype.right = function (maxInNumbersXW) {
        var _this = this;
        var activeWidgets = _this.painter.state.activeWidgets();
        var len = activeWidgets.length;
        for(var i=0;i<len;i++) {
            activeWidgets[i].store.model.x(maxInNumbersXW - activeWidgets[i].store.model.w() );
        }
    };
    TLayout.prototype.down = function (maxInNumbersYH){
        var _this = this;
        var activeWidgets = _this.painter.state.activeWidgets();
        var len = activeWidgets.length;
        for(var i=0;i<len;i++) {
            activeWidgets[i].store.model.y(maxInNumbersYH - activeWidgets[i].store.model.h());
        }
    };
    TLayout.prototype.left = function (minInNumbersX){
        var _this = this;
        var activeWidgets = _this.painter.state.activeWidgets();
        var len = activeWidgets.length;
        for(var i=0;i<len;i++) {
            activeWidgets[i].store.model.x(minInNumbersX);
        }
    };
    TLayout.prototype.level = function (maxInNumbersX,minInNumbersX) {
        var _this = this;
        var activeWidgets = _this.painter.state.activeWidgets();
        var allactiveWidgetsW = 0;
        var len = activeWidgets.length;
        activeWidgets.sort(function (a, b) {
            return a.store.model.x() > b.store.model.x();
        });
        for(var i = 0;i<len - 1;i++){
            allactiveWidgetsW += activeWidgets[i].store.model.w();
        }
        var differenceX = maxInNumbersX - minInNumbersX - allactiveWidgetsW;
        var averageX = differenceX/(len-1);
        for(var i=1;i<len - 1;i++){
            var nowactiveWidgetsX = activeWidgets[i-1].store.model.x() + activeWidgets[i-1].store.model.w() + averageX;
            activeWidgets[i].store.model.x(nowactiveWidgetsX);
        }
    };
    TLayout.prototype.vertical = function (maxInNumbersY,minInNumbersY){
        var _this = this;
        var activeWidgets = _this.painter.state.activeWidgets();
        var allactiveWidgetsH = 0;
        var len = activeWidgets.length;
        activeWidgets.sort(function (a, b) {
            return a.store.model.y() > b.store.model.y();
        });
        for(var i = 0;i<len - 1;i++){
            allactiveWidgetsH += activeWidgets[i].store.model.h();
        }
        var differenceY = maxInNumbersY - minInNumbersY - allactiveWidgetsH;
        var averageY = differenceY/(len-1);
        for(var i=1;i<len - 1;i++){
            var nowactiveWidgetsY = activeWidgets[i-1].store.model.y() + activeWidgets[i-1].store.model.h() + averageY;
            activeWidgets[i].store.model.y(nowactiveWidgetsY);
        }
    };
    TLayout.prototype.close = function () {};

    window.TLayout = TLayout;
} ());