(function () {

    function TScreen() {
        TShape.apply(this, arguments);

        this.layer = this.painter.interactiveLayer;
        this.previewRect = undefined;
    }

    TScreen.prototype = Object.create(TShape.prototype);
    TScreen.prototype.constructor = TScreen;

    TScreen.prototype.tpl = '\
<button class="btn-switch" title="Screen容器控件(s)" data-type="screenCtrl">\
    <strong style="font-size: 20px;margin-left: -2px;">S</strong>\
</button>';
    
    void function () {

        this.createEntity = function () {
            return {
                option: {
                    pageId: '',
                    pageType: ''
                },
                type: 'HtmlScreenContainer'
            };
        };

    }.call(TScreen.prototype);

    window.TScreen = TScreen;
} ());