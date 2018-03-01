(function () {

    var tpl = '\
<button title="Pointer">\
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0.5 18.5 18 18" width="18px" height="18px">\
        <path stroke="none" d="M3.5,18.5v18l5-7h9L3.5,18.5z"></path>\
    </svg>\
</button>';

    function TPointer(toolbar, container) {
        this.toolbar = toolbar;
        this.screen = toolbar.screen;

        this.container = container;

        this.element = undefined;

    }

    TPointer.prototype.show = function () {
        this.element = HTMLParser(tpl);
        this.container.appendChild(this.element);

        this.attachEvents();
    };

    TPointer.prototype.attachEvents = function () {
        var _this = this;
        $(this.element).on('click', function () {
            _this.bindEventsToPainter();
        });
    };

    TPointer.prototype.bindEventsToPainter = function () {
        this.painter.mouseDownActionPerformed = this.mouseDownActionPerformed;
        this.painter.mouseMoveActionPerformed = this.mouseMoveActionPerformed;
        this.painter.mouseUpActionPerformed = this.mouseUpActionPerformed;
    };

    TPointer.prototype.mouseDownActionPerformed = function () {

    };
    TPointer.prototype.mouseMoveActionPerformed = function () {};
    TPointer.prototype.mouseUpActionPerformed = function () {};

    TPointer.prototype.close = function () {

    };

    window.TPointer = TPointer;
} ());