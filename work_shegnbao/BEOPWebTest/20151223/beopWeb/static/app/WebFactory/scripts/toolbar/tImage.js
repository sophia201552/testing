(function () {

    function TImage(toolbar, container) {
        TShape.apply(this, arguments);

        this.layer = this.painter.interactiveLayer;
        this.previewRect = undefined;
        this.supportLayerType = 'canvas';
    }

    TImage.prototype = Object.create(TShape.prototype);
    TImage.prototype.constructor = TImage;

    TImage.prototype.tpl = '<button title="图片控件"><span class="glyphicon glyphicon-picture"></span></button>';
    
    void function () {

        this.createEntity = function () {
            return {
                option: {
                    "trigger": {
                        'default': ''
                    }
                },
                type: 'CanvasImage',
                idDs: []
            }
        };

    }.call(TImage.prototype);

    TImage.prototype.close = function () {  };

    window.TImage = TImage;
} ());