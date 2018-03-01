(function (Widget, CanvasWidgetMixin) {

    function CanvasImage(layer, model) {
        Widget.apply(this, arguments);
    }

    CanvasImage.prototype = Object.create(Widget.prototype);
    CanvasImage.prototype.constructor = CanvasImage;

    CanvasImage.prototype.init = function () {
        // 兼容一下老数据格式
        this._format();

        Widget.prototype.init.apply(this, arguments);
    };

    CanvasImage.prototype._format = function () {
        //兼容老数据
        var options = this.store.model.option();
        if(typeof this.store.model.isHide === "undefined"){
            this.store.model.property('isHide',0);
        }
        if (options.rotate == undefined) {
            options.rotate = 0;
        }
        if (options.pageId === undefined) {
            options.pageId = '';
        }
        if (options.pageType === undefined) {
            options.pageType = '';
        }
        if (options.float === undefined) {
            options.float = '';
        }
        if(!options.preview){
            options.preview = [];
        }
        this.store.model.option(options);
    };

    CanvasImage.prototype.defaultColor = '#ddd';

    /** override */
    CanvasImage.prototype.show = function () {
        var model = this.store.model;

        this.shape = new Konva.Sprite({
            id: model._id(),
            animations: {
                main: [0, 0, model.w(), model.h()]
            },
            animation: 'main',
            perfectDrawEnabled: false
        });

        this.layer.add(this.shape);

        // 如果图片有链接页面，才绑定事件
        if (model['option.pageId']()) {
            // 添加事件
            this.addEvents();
        }
        
        this.update();
    };

    /** override */
    CanvasImage.prototype.update = function (e, propName) {
        var _this = this;
        var model = this.store.model;
        var options = model.option();
        var imageModel, imageModelId;

        // 坐标变化
        if ( !propName || propName.indexOf('update.x') > -1 ||
            propName.indexOf('update.y') > -1 ) {
            this.shape.position({
                x: model.x() + model.w() / 2,
                y: model.y() + model.h() / 2
            });
        }

        // 大小变化
        if ( !propName || propName.indexOf('update.w') > -1 ||
            propName.indexOf('update.h') > -1 ) {
            this.shape.position({
                x: model.x() + model.w() / 2,
                y: model.y() + model.h() / 2
            });
            this.shape.offset({
                x: model.w() / 2,
                y: model.h() / 2
            });
            this.shape.width(model.w());
            this.shape.height(model.h());
        }

        // 图片或枚举更改
        if ( !propName || propName.indexOf('update.option.trigger') > -1 ) {
            imageModelId = options.trigger['default'];
            imageModel = this.store.imageModelSet.findByProperty('_id', imageModelId);
            this.loadImg(imageModel, imageModelId);
        }

        // 图片方向更改
        if ( !propName || propName.indexOf('update.option.rotate') > -1 ) {
            this.shape.rotation(options.rotate);
        }

        // 更新时候的图片变化
        if ( propName && propName.indexOf('update.option.text') > -1 ) {
            if ( this.shape.isRunning() ) {
                this.shape.stop();
                // 这里停止动画后，需要重新置回第一帧
                // 否则在由动画变为图片时，可能会出现图片看不见的问题
                this.shape.frameIndex(0);
            }
            // 如果值为空的话，默认显示透明图片
            if (typeof options.text.value !== 'undefined' && options.text.value.trim() === '') {
                this.loadImg('transparent');
            } else {
                imageModelId = options.text.value;
                // 判断是否是 object id
                // 这里只简单的判断是否是 24 位
                imageModelId = (imageModelId && imageModelId.length === 24) ? imageModelId : options.trigger['default'];
                imageModel = this.store.imageModelSet.findByProperty('_id', imageModelId);
                this.loadImg(imageModel, imageModelId);
            }
        }
        //隐藏与否
        if (!propName || propName.indexOf('update.isHide') > -1) {
            if(this.store.model.isHide()){
                this.detach();
            }else{
                this.attach();
            }
        }

        if (!propName || propName.indexOf('update.layerId') > -1) {
            this.setParent(model.layerId());
        }

        // 仅更新的时候需要再次进行绘制
        if (e) {
            this.layer.draw();
        }
    };

    CanvasImage.prototype.loadImg = function (imageModel, imageModelId) {
        var _this = this;
        var model = this.store.model;
        var options = model.option();
        var promise;

        if (imageModel === 'transparent') {
            _this.shape.image(null);
            return;
        }

        promise = $.Deferred();

        // 没有在项目中找到该图片，需要去服务端重新获取一下
        if (!imageModel) {
            WebAPI.post('/factory/material/getByIds', {
                ids: [imageModelId]
            }).done(function (rs) {
                if (!rs.length) {
                    if (model['option.trigger.default']) {
                        console.warn('can not find material. id: ' + model['option.trigger.default']())
                    } else {
                        console.warn('can not find material. trigger.default is undefined ')
                    }
                    promise.reject();
                    return;
                }
                imageModel = new Model( $.extend(false, {
                    _id: rs[0]._id
                }, rs[0].content) );

                // 加入到 imageModelSet 中去
                _this.store.imageModelSet.append(imageModel);
                promise.resolve();
            });
        } else {
            promise.resolve();
        }

        promise.done(function () {
           GUtil.loadImage(imageModel.url(), function (image) {
                if (imageModel.interval() > 0) {
                    _this.shape.image(image);
                    _this.shape.animations({
                        main: [0, 0, imageModel.pw(), imageModel.h()]
                    });
                    _this.startAnimation(imageModel);
                }
                //如果是普通图片
                else {
                    _this.shape.image(image);
                    _this.shape.animations({
                        main: [0, 0, imageModel.w(), imageModel.h()]
                    });
                }

                _this.shape.rotation(typeof options.rotate !== 'number' ? 0 : options.rotate);
                _this.layer.batchDraw();
            }); 
        });
    };
    // 获取模板中的模板参数
    CanvasImage.prototype.getTplParams = function (data){
        if(data){
            var pattern = /<#\s*(\w*?)\s*#>/mg;
            var match = null;
            var params = [];
            var str = data.option.pageId;
            while( match = pattern.exec(str) ) {
                params.push({
                    name: match[1],
                    value: ''
                });
            }
            return params;
        }
    };
    // 应用
    CanvasImage.prototype.applyTplParams = function (data){
        if(data){
            var reg = data.reg;
            var strNew = data.strNew;
            var widget = data.widget;
            widget.option.pageId = widget.option.pageId.replace(reg, strNew);
            return widget;
        }
    };

    CanvasImage.prototype.transparent = function () {};

    CanvasImage.prototype.startAnimation = function () {};

    CanvasImage.prototype.stopAnimation = function () {};

    CanvasImage.prototype.addEvents = function () {};

    CanvasImage.prototype = Mixin(CanvasImage.prototype, CanvasWidgetMixin);

    // 图片控件需要支持旋转，所以中心点是图片的重心，不再是左上角，这里需要标识一下
    CanvasImage.prototype.isOffsetCenter = true;

    window.widgets = window.widgets || {};
    window.widgets.factory = window.widgets.factory  || {};
    window.widgets.factory.CanvasImage = CanvasImage;

} (window.widgets.factory.Widget, window.mixins.CanvasWidgetMixin));