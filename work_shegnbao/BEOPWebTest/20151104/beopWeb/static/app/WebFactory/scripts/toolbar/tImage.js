(function () {

    var tpl = '\
<button title="Image">\
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0.5 18.5 18 18" width="18px" height="18px">\
        <path stroke="none" d="M3.5,18.5v18l5-7h9L3.5,18.5z"></path>\
    </svg>\
</button>';

    function TImage(toolbar, container) {
        this.toolbar = toolbar;
        this.screen = toolbar.screen;

        this.container = container;

        this.element = undefined;
    }

    TImage.prototype.show = function () {
        this.element = HTMLParser(tpl);
        this.container.appendChild(this.element);

        this.bindEventsToPainter();
    };

    TImage.prototype.bindEventsToPainter = function () {
    };

    TImage.prototype.close = function () {

    };

    window.TImage = TImage;
} ());