(function () {

    function TText() {
        TShape.apply(this, arguments);

        this.layer = this.painter.interactiveLayer;
        this.previewRect = undefined;
    }

    TText.prototype = Object.create(TShape.prototype);
    TText.prototype.constructor = TText;

    TText.prototype.tpl = '\
<button class="btn-switch" title="文本控件(t)" data-type="textCtrl">\
    <span class = "iconfont icon-shujutubiao24"></span>\
</button>';
    
    void function () {

        this.createEntity = function () {
            return {
                option: {
                    text: '<p><span style="font-size: 12px;">&lt;%value%&gt;</span></p>',
                    'class': 'txtStyle1',
                    float: 0,
                    pageId: '',
                    pageType: '',
                    trigger:{},
                    precision: 2,
                    preview:[]
                },
                type: 'HtmlText',
                idDs: []
            };
        };

    }.call(TText.prototype);

    TText.prototype.close = function () {  };

    window.TText = TText;
} ());