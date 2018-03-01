(function () {

    function TText(toolbar, container) {
        TShape.apply(this, arguments);

        this.layer = this.painter.interactiveLayer;
        this.previewRect = undefined;
    }

    TText.prototype = Object.create(TShape.prototype);
    TText.prototype.constructor = TText;

    TText.prototype.tpl = '\
<button title="文本控件">\
    <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px">\
        <text style="stroke:none; fill: inherit; font-family: Arial; font-size: 18px; text-anchor: middle" x="9" y="15">T</text>\
    </svg>\
</button>';
    
    void function () {

        this.createEntity = function () {
            return {
                option: {
                    text: '请此处输入文本',
                    'class': 'txtStyle1',
                    trigger:{}
                },
                type: 'HtmlText',
                idDs: []
            };
        };

    }.call(TText.prototype);

    TText.prototype.close = function () {  };

    window.TText = TText;
} ());