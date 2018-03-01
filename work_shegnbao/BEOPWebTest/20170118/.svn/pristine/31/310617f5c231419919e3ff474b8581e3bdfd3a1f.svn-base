(function () {

    function TButton(toolbar, container) {
        TShape.apply(this, arguments);

        this.layer = this.painter.interactiveLayer;
        this.previewRect = undefined;
    }

    TButton.prototype = Object.create(TShape.prototype);
    TButton.prototype.constructor = TButton;

    TButton.prototype.tpl = '\
<button class="btn-switch" title="按钮控件(b)" data-type="btnCtrl">\
    <span class = "iconfont icon-anniugongju"></span>\
</button>';
    
    void function () {

        this.createEntity = function () {
            return {
                option: {
                    text: 'Button',
                    'class': 'default',
                    float: 0,
                    pageId: '',
                    pageType: '',
                    trigger:{},
                    preview:[]
                },
                type: 'HtmlButton',
                idDs: []
            };
        };

    }.call(TButton.prototype);

    TButton.prototype.close = function () {  };

    window.TButton = TButton;
} ());