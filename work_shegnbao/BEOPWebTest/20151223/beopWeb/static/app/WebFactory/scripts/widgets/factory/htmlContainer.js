(function (Widget, HtmlWidgetMixin) {

    function HtmlContainer(layer, model) {
        Widget.apply(this, arguments);
    }

    HtmlContainer.prototype = Object.create(Widget.prototype);
    HtmlContainer.prototype.constructor = HtmlContainer;

    HtmlContainer.prototype.tpl = '<div class="html-widget html-container"></div>';

    /** override */
    HtmlContainer.prototype.show = function () {
        var model = this.store.model;

        this.shape = HTMLParser(this.tpl);
        this.shape.id = model._id();
        this.shape.style.position = 'absolute';
        this.update();

        this.layer.add(this.shape);
    };

    /** override */
    HtmlContainer.prototype.close = function () {

    };

    /** override */
    HtmlContainer.prototype.update = function () {
        var model = this.store.model;
        var options = model.option();

        this.shape.style.left = model.x() + 'px';
        this.shape.style.top = model.y() + 'px';
        this.shape.style.width = model.w() + 'px';
        this.shape.style.height = model.h() + 'px';
        this.shape.innerHTML = options.html;

        Log.info('html container widget has been updated.');
    };

    /** 适配工作 */
    HtmlContainer.prototype = Mixin(HtmlContainer.prototype, HtmlWidgetMixin);
    HtmlContainer.prototype.type = 'HtmlContainer';

    window.widgets = window.widgets || {};
    window.widgets.factory = window.widgets.factory  || {};
    window.widgets.factory.HtmlContainer = HtmlContainer;

} (window.widgets.factory.Widget, window.mixins.HtmlWidgetMixin));