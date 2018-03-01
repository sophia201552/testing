(function (exports, SuperClass, HtmlWidgetMixin) {

    function HtmlScreenContainer(layer, model) {
        SuperClass.apply(this, arguments);
    }

    HtmlScreenContainer.prototype = Object.create(SuperClass.prototype);
    HtmlScreenContainer.prototype.constructor = HtmlScreenContainer;

    HtmlScreenContainer.prototype.tpl = '<div class="html-widget html-screen"></div>';

    /** override */
    HtmlScreenContainer.prototype.show = function () {
        var model = this.store.model;

        SuperClass.prototype.show.apply(this, arguments);

        this.shape = HTMLParser(this.tpl);
        this.shape.id = model._id();
        this.shape.style.position = 'absolute';
        this.shape.style.backgroundImage = 'url("/static/app/WebFactory/themes/default/images/demo/htmlScreen.png")';
        this.shape.style.backgroundSize = '100% 100%';
        this.shape.style.backgroundColor = 'rgba(238, 238, 238,0.6)';
        //this.shape.style.border = '1px dashed #aaa';
        this.update();

        this.layer.add(this.shape);
    };

    /** override */
    HtmlScreenContainer.prototype.update = function () {
        var model = this.store.model;
        var options = model.option();

        this.shape.style.left = model.x() + 'px';
        this.shape.style.top = model.y() + 'px';
        this.shape.style.width = model.w() + 'px';
        this.shape.style.height = model.h() + 'px';
        //this.shape.innerHTML = options.html;
        if(!model.option().pageId){model.option().pageId = ''}
        if(!model.option().pageType){model.option().pageType = ''}
        if (options.style) {
            var initStyle = options.style;
            var normalStyle = initStyle.replace(/.Normal/g, '#' + model._id().toHexString());
            var head = document.head || document.getElementsByTagName('head')[0],
                style = document.createElement('style');
            //style.type = 'text/css';
            style.id = 'style-' + model._id();
            if (style.stylesheet) {
                style.stylesheet.cssText = normalStyle;
            } else {
                style.appendChild(document.createTextNode(normalStyle));
            }
            if (document.getElementById(style.id)) {
                $('#' + style.id).remove();
            }
            head.appendChild(style);
        } else {
            $('#style-' + model._id()).remove();
        }

        SuperClass.prototype.update.apply(this, arguments);
        Log.info('html container widget has been updated.');
    };

    /** 适配工作 */
    HtmlScreenContainer.prototype = Mixin(HtmlScreenContainer.prototype, HtmlWidgetMixin);
    HtmlScreenContainer.prototype.type = 'HtmlScreenContainer';

    exports.HtmlScreenContainer = HtmlScreenContainer;
} (
    namespace('widgets.factory'),
    namespace('widgets.factory.HtmlWidget'),
    namespace('mixins.HtmlWidgetMixin')
));