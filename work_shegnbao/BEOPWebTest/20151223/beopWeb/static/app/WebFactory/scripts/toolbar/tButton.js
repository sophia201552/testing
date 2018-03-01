(function () {

    function TButton(toolbar, container) {
        TShape.apply(this, arguments);

        this.layer = this.painter.interactiveLayer;
        this.previewRect = undefined;
    }

    TButton.prototype = Object.create(TShape.prototype);
    TButton.prototype.constructor = TButton;

    TButton.prototype.tpl = '<button title="按钮控件"><strong style="font-size: 20px;">B</strong></button>';
    
    void function () {

        this.createEntity = function () {
            return {
                option: {
                    text: 'Button',
                    'class': 'default',
                    trigger:{}
                },
                type: 'HtmlButton',
                idDs: []
            };
        };

    }.call(TButton.prototype);

    TButton.prototype.close = function () {  };

    window.TButton = TButton;
} ());