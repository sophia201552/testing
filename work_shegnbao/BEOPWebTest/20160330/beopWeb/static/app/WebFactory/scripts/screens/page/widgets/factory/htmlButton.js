(function (Widget, HtmlWidgetMixin) {

    function HtmlButton(layer, model) {
        Widget.apply(this, arguments);
    }

    HtmlButton.prototype = Object.create(Widget.prototype);
    HtmlButton.prototype.constructor = HtmlButton;

    HtmlButton.prototype.tpl = '<button class="html-widget html-btn"></button>';

    /** override */
    HtmlButton.prototype.show = function () {
        var model = this.store.model;

        this.shape = HTMLParser(this.tpl);
        this.shape.id = model._id();
        this.shape.style.position = 'absolute';
        this.update();
        this.layer.add(this.shape);
    };

    /** override */
    HtmlButton.prototype.update = function () {
        var model = this.store.model;
        var options = model.option();
        this.shape.style.left = model.x() + 'px';
        this.shape.style.top = model.y() + 'px';
        this.shape.style.width = model.w() + 'px';
        this.shape.style.height = model.h() + 'px';
        this.shape.innerHTML = options.text;
        this.shape.className = 'html-widget html-btn ' + options['class'];
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
        Log.info('html button widget has been updated.');
    };

    /** 适配工作 */
    HtmlButton.prototype = Mixin(HtmlButton.prototype, HtmlWidgetMixin);
    HtmlButton.prototype.type = 'HtmlButton';

    window.widgets = window.widgets || {};
    window.widgets.factory = window.widgets.factory  || {};
    window.widgets.factory.HtmlButton = HtmlButton;

} (window.widgets.factory.Widget, window.mixins.HtmlWidgetMixin));