(function () {

    function THtml(toolbar, container) {
        TShape.apply(this, arguments);

        this.layer = this.painter.interactiveLayer;
        this.previewRect = undefined;
    }

    THtml.prototype = Object.create(TShape.prototype);
    THtml.prototype.constructor = THtml;

    THtml.prototype.tpl = '<button class="btn-switch" title="Html容器控件(h)" data-type="htmlCtrl">' +
        '<strong style="font-size: 20px;margin-left: -2px;">H</strong>' +
        '</button>';
    void function () {

        this.createEntity = function () {
            return {
                option: {
                    html: '',
                    css: '',
                    js: '',
                    display: 0
                },
                type: 'HtmlContainer',
                templateId: ''
            };
        };

    }.call(THtml.prototype);

    window.THtml = THtml;
} ());