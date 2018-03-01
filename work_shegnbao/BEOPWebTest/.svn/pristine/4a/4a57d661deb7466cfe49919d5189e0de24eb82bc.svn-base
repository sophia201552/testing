(function () {

    var tpl = '\
<button title="Text">\
    <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px">\
        <text style="stroke:none; fill: inherit; font-family: Arial; font-size: 18px; text-anchor: middle" x="9" y="15">T</text>\
    </svg>\
</button>';

    function TText(toolbar, container) {
        this.toolbar = toolbar;
        this.screen = toolbar.screen;

        this.container = container;

        this.element = undefined;
    }

    TText.prototype.show = function () {
        this.element = HTMLParser(tpl);
        this.container.appendChild(this.element);

        this.bindEventsToPainter();
    };

    TText.prototype.bindEventsToPainter = function () {
        
    };

    TText.prototype.close = function () {

    };

    window.TText = TText;
} ());