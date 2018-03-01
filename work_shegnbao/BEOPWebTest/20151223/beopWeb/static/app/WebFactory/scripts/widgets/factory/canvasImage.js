(function (Widget, CanvasWidgetMixin) {

    function CanvasImage(layer, model) {
        Widget.apply(this, arguments);
    }

    CanvasImage.prototype = Object.create(Widget.prototype);
    CanvasImage.prototype.constructor = CanvasImage;

    /** override */
    CanvasImage.prototype.show = function () {
        var model = this.store.model;

        this.shape = new Konva.Image({
            id: model._id(),
            fill: '#ccc'
        });

        this.layer.add(this.shape);
        
        this.update();
    };

    /** override */
    CanvasImage.prototype.update = function (e, propName) {
        var _this = this;
        var model = this.store.model;
        var options = model.option();
        var imageId, url;

        this.shape.position({
            x: model.x(),
            y: model.y()
        });

        this.shape.width(model.w());
        this.shape.height(model.h());

        if (!propName || propName === 'update.option') {
            //todo 暂时的处理方式
            if(options.text){
                imageId = options.text;
            }else{
                imageId = options.trigger['default'];
            }

            if (imageId) {
                url = this.store.imageModelSet.findByProperty('_id', imageId).url();
                GUtil.loadImage(url, function (image) {
                    _this.shape.setImage(image);
                    _this.layer.draw();
                });
            }
        }
        this.layer.draw();
    };

    CanvasImage.prototype = Mixin(CanvasImage.prototype, CanvasWidgetMixin);

    window.widgets = window.widgets || {};
    window.widgets.factory = window.widgets.factory  || {};
    window.widgets.factory.CanvasImage = CanvasImage;

} (window.widgets.factory.Widget, window.mixins.CanvasWidgetMixin));