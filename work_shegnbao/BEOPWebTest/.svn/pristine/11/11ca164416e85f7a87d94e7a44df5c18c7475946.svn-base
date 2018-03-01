(function (Widget, CanvasWidgetMixin) {

    function CanvasImage(layer, model) {
        Widget.apply(this, arguments);
        this.imageModel = null;
    }

    CanvasImage.prototype.init = function () {
        // 兼容一下老数据格式
        this._format();
    };

    CanvasImage.prototype._format = function () {
        //兼容老数据
        var options = this.store.model.option();
        if(options.rotate == undefined) {
            options.rotate = 0;
            this.store.model.option(options);
        }
    };

    CanvasImage.prototype = Object.create(Widget.prototype);
    CanvasImage.prototype.constructor = CanvasImage;

    CanvasImage.prototype.defaultColor = '#ddd';

    /** override */
    CanvasImage.prototype.show = function () {
        var model = this.store.model;

        this.shape = new Konva.Image({
            id: model._id(),
            fill: this.defaultColor
        });

        this.layer.add(this.shape);
        
        this.update();
    };

    /** override */
    CanvasImage.prototype.update = function (e, propName) {
        var _this = this;
        var model = this.store.model;
        var options = model.option();
        var imageModel;

        this.shape.position({
            x: model.x(),
            y: model.y()
        });

        this.shape.width(model.w());
        this.shape.height(model.h());
        if (options.text){
                imageModel = this.store.imageModelSet.findByProperty('_id', options.text);
            } else {
                imageModel = this.store.imageModelSet.findByProperty('_id', options.trigger['default']);
            }
        if (!propName || propName === 'update.option'|| propName === 'update.w,update.h,update.option.trigger.default' || propName === 'update.idDs,update.option.trigger') {
            //todo 暂时的处理方式
            if (imageModel) {
                GUtil.loadImage(imageModel.url(), function (image) {
                    _this.shape.destroy();
                    if (imageModel.interval() > 0) {
                        _this.shape = new Konva.Sprite({
                            id: model._id(),
                            x: model.x(),
                            y: model.y(),
                            width: model.w(),
                            height: model.h(),
                            image: image,
                            animations: {
                                main: [0, 0, imageModel.pw(), imageModel.h()]
                            },
                            animation: 'main'
                        });
                        _this.layer.add(_this.shape);
                        _this.startAnimation(imageModel);
                    }
                     //如果是普通图片
                    else {
                        _this.shape = new Konva.Image({
                            id: model._id(),
                            x: model.x(),
                            y: model.y(),
                            width: model.w(),
                            height: model.h(),
                            image: image
                        });
                        _this.layer.add(_this.shape);
                    }
                    _this.shape.rotation(options.rotate);
                    _this.layer.draw();
                });
            }
        }
        this.shape.rotation(options.rotate);
        this.layer.draw();
    };

    CanvasImage.prototype.startAnimation = function () {};

    CanvasImage.prototype.stopAnimation = function () {};

    CanvasImage.prototype = Mixin(CanvasImage.prototype, CanvasWidgetMixin);

    window.widgets = window.widgets || {};
    window.widgets.factory = window.widgets.factory  || {};
    window.widgets.factory.CanvasImage = CanvasImage;

} (window.widgets.factory.Widget, window.mixins.CanvasWidgetMixin));