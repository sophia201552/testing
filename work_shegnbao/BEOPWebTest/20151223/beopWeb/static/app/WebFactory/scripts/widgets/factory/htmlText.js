(function (Widget, HtmlWidgetMixin) {

    function HtmlText(layer, model) {
        Widget.apply(this, arguments);
    }

    HtmlText.prototype = Object.create(Widget.prototype);
    HtmlText.prototype.constructor = HtmlText;

    HtmlText.prototype.tpl = '<p class="html-widget html-text"></p>';

    /** override */
    HtmlText.prototype.show = function () {
        var model = this.store.model;

        this.shape = HTMLParser(this.tpl);
        this.shape.id = model._id();
        this.shape.style.position = 'absolute';
        this.update();

        this.layer.add(this.shape);
    };

    /** override */
    HtmlText.prototype.close = function () {

    };

    /** override */
    HtmlText.prototype.update = function (e) {
        var model = this.store.model;
        var options = model.option();
        this.shape.style.left = model.x() + 'px';
        this.shape.style.top = model.y() + 'px';
        this.shape.style.width = model.w() + 'px';
        this.shape.style.height = model.h() + 'px';
        this.shape.innerHTML = options.text;
        this.shape.className = 'html-widget html-text' + (options.class ? ' '+options.class : '');
        if(options.style) {
            var initStyle = options.style;
            var normalStyle = initStyle.replace(/.Normal/g, '#' + model._id().toHexString());
            var head = document.head || document.getElementsByTagName('head')[0],
                style = document.createElement('style');
            //style.type = 'text/css';
            style.id = 'style-' + model._id();
            if (style.stylesheet) {
                style.stylesheet.cssText = normalStyle;
            } else {
                style.appendChild(document.createTextNode(normalStyle))
            }
            if (document.getElementById(style.id)) {
                $('#' + style.id).remove();
            }
            head.appendChild(style);
        }else{
            $('#style-' + model._id()).remove();
        }
        Log.info('html text widget has been updated.');
    };

    HtmlText.prototype = Mixin(HtmlText.prototype, HtmlWidgetMixin);

    HtmlText.prototype.type = 'HtmlText';

    window.widgets = window.widgets || {};
    window.widgets.factory = window.widgets.factory  || {};
    window.widgets.factory.HtmlText = HtmlText;

} (window.widgets.factory.Widget, window.mixins.HtmlWidgetMixin));