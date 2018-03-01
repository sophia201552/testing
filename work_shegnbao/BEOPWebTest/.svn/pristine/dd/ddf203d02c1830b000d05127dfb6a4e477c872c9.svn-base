(function (fcHtmlScreenContainer) {

    function HtmlScreenContainer(layer, model) {
        fcHtmlScreenContainer.apply(this, arguments);
    }

    HtmlScreenContainer.prototype = Object.create(fcHtmlScreenContainer.prototype);
    HtmlScreenContainer.prototype.constructor = HtmlScreenContainer;

    /** override */
    HtmlScreenContainer.prototype.show = function () {
        var model = this.store.model;
        var screens = namespace('factory.screens');

        this.shape = HTMLParser(this.tpl);
        this.shape.id = model._id();
        this.shape.style.position = 'absolute';
        this.update();

        this.layer.add(this.shape);

        this.page = new screens.PageScreenView(model.option().pageId, this.shape);
        this.page.show();
    };

    //覆盖window.widgets.factory.HtmlScreenContainer
    window.widgets.factory.HtmlScreenContainer = HtmlScreenContainer;

} (window.widgets.factory.HtmlScreenContainer));