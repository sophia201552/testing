(function (FacHtmlScreenContainer) {

    function HtmlScreenContainer(layer, model) {
        FacHtmlScreenContainer.apply(this, arguments);
    }

    HtmlScreenContainer.prototype = Object.create(FacHtmlScreenContainer.prototype);
    HtmlScreenContainer.prototype.constructor = HtmlScreenContainer;

    /** override */
    HtmlScreenContainer.prototype.show = function () {
        var model = this.store.model;
        var screens = namespace('observer.screens');
        var options = model.option();

        FacHtmlScreenContainer.prototype.show.apply(this, arguments);
        this.shape.style.background = 'none';

        var pageId = options.pageId;
        var pageType = options.pageType;

        if (!pageId) {
            return;
        }
        
        this.page = new screens[pageType || 'PageScreen']({
            id: pageId,
            isFactory: AppConfig.isFactory
        }, this.shape);
        this.page.show();
    };

    HtmlScreenContainer.prototype.close = function () {
        FacHtmlScreenContainer.prototype.close.apply(this, arguments);
        if (this.page) {
            this.page.close();
            this.page = null;
        }
    };

    //覆盖window.widgets.factory.HtmlScreenContainer
    window.widgets.factory.HtmlScreenContainer = HtmlScreenContainer;

} (window.widgets.factory.HtmlScreenContainer));