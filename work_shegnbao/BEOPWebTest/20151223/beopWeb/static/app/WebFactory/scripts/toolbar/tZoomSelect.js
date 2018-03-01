(function () {

    var tpl = '<div class="dropdown">\
    <button class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"><span class="glyphicon glyphicon-search"></span></button>\
    <ul class="dropdown-menu dropdown-menu-right" style="left:32px;top:-50px;">\
        <li><a href="javascript:;" data-value="0.25">25%</a></li>\
        <li><a href="javascript:;" data-value="0.5">50%</a></li>\
        <li><a href="javascript:;" data-value="0.75">75%</a></li>\
        <li><a href="javascript:;" data-value="1">100%</a></li>\
        <li><a href="javascript:;" data-value="1.5">150%</a></li>\
        <li><a href="javascript:;" data-value="2">200%</a></li>\
        <li><a href="javascript:;" data-value="5">500%</a></li>\
        <li><a href="javascript:;" data-value="10">1000%</a></li>\
    </ul>\
    </div>';

    function TZoomSelect(toolbar, container) {
        this.toolbar = toolbar;
        this.screen = toolbar.screen;
        this.painter = toolbar.painter;

        this.container = container;

        this.element = undefined;

        this.init();
    }

    TZoomSelect.prototype.init = function () {
        this.element = HTMLParser(tpl);
        this.container.appendChild(this.element);
    };

    TZoomSelect.prototype.show = function () {
        this.attachEvents();
        this.bindEventsToPainter();
    };

    TZoomSelect.prototype.attachEvents = function () {
        var _this = this;
        $(this.element).children('.dropdown-menu').on('click', 'a', function () {
            var value = parseFloat(this.dataset.value);
            _this.painter.setActiveWidgets();
            _this.painter.scaleTo(value);
            _this.painter.interactiveLayer.draw();
        });
    };

    TZoomSelect.prototype.bindEventsToPainter = function () {
    };

    TZoomSelect.prototype.mouseDownActionPerformed = function () {
    };

    TZoomSelect.prototype.mouseMoveActionPerformed = function () {
    };

    TZoomSelect.prototype.mouseUpActionPerformed = function () {

    };

    TZoomSelect.prototype.close = function () {

    };

    window.TZoomSelect = TZoomSelect;
} ());