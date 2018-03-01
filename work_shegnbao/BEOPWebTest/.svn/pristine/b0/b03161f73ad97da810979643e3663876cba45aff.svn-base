(function () {

    function TBase(toolbar, container) {
        this.toolbar = toolbar;
        this.screen = toolbar.screen;

        this.container = container;

        this.element = undefined;

    }

    TBase.prototype.show = function () {
        this.element = HTMLParser(tpl);
        this.container.appendChild(this.element);

        this.bindEventsToPainter();
    };

    TBase.prototype.bindEventsToPainter = function () {
        this.painter.mouseDownActionPerformed = this.mouseDownActionPerformed;
        this.painter.mouseMoveActionPerformed = this.mouseMoveActionPerformed;
        this.painter.mouseUpActionPerformed = this.mouseUpActionPerformed;
    };

    TBase.prototype.close = function () {

    };

    window.TBase = TBase;
} ());