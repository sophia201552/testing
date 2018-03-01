(function (Widget, HtmlWidgetMixin) {

    function HtmlScreenContainer(layer, model) {
        Widget.apply(this, arguments);
    }

    HtmlScreenContainer.prototype = Object.create(Widget.prototype);
    HtmlScreenContainer.prototype.constructor = HtmlScreenContainer;

    HtmlScreenContainer.prototype.tpl = '<div class="html-screen html-container"></div>';

    /** override */
    HtmlScreenContainer.prototype.show = function () {
        var model = this.store.model;

        this.shape = HTMLParser(this.tpl);
        this.shape.id = model._id();
        this.shape.style.position = 'absolute';
        this.update();

        this.layer.add(this.shape);
    };

    /** override */
    HtmlScreenContainer.prototype.close = function () {

    };

    /** override */
    HtmlScreenContainer.prototype.update = function () {
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
    HtmlScreenContainer.prototype = Mixin(HtmlScreenContainer.prototype, HtmlWidgetMixin);
    HtmlScreenContainer.prototype.type = 'HtmlScreenContainer';

    window.widgets = window.widgets || {};
    window.widgets.factory = window.widgets.factory  || {};
    window.widgets.factory.HtmlScreenContainer = HtmlScreenContainer;

} (window.widgets.factory.Widget, window.mixins.HtmlWidgetMixin));