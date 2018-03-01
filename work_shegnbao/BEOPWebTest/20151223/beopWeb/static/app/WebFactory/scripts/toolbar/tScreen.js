(function () {

    function TScreen(toolbar, container) {
        TShape.apply(this, arguments);

        this.layer = this.painter.interactiveLayer;
        this.previewRect = undefined;
    }

    TScreen.prototype = Object.create(TShape.prototype);
    TScreen.prototype.constructor = TScreen;

    TScreen.prototype.tpl = '<button title="Screen容器控件"><strong style="font-size: 20px;">S</strong></button>';
    
    void function () {

        this.createEntity = function () {
            return {
                option: {
                    //html: '<img style="width:100%;height:100%;" src="/static/app/WebFactory/themes/default/images/demo/chart.png"/>'
                },
                type: 'HtmlScreenContainer'
            };
        };

    }.call(TScreen.prototype);

    TScreen.prototype.close = function () {  };

    window.TScreen = TScreen;
} ());