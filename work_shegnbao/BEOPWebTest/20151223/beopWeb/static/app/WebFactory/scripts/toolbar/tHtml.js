(function () {

    function THtml(toolbar, container) {
        TShape.apply(this, arguments);

        this.layer = this.painter.interactiveLayer;
        this.previewRect = undefined;
    }

    THtml.prototype = Object.create(TShape.prototype);
    THtml.prototype.constructor = THtml;

    THtml.prototype.tpl = '<button title="Html容器控件"><strong style="font-size: 20px;">H</strong></button>';
    
    void function () {

        this.createEntity = function () {
            return {
                option: {
                    html: '<img style="width:100%;height:100%;" src="/static/app/WebFactory/themes/default/images/demo/chart.png"/>'
                },
                type: 'HtmlContainer'
            };
        };

    }.call(THtml.prototype);

    THtml.prototype.close = function () {  };

    window.THtml = THtml;
} ());