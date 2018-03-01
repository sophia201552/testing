(function (exports, Widget, CanvasWidgetMixin) {

    function CanvasDevice(layer, model) {
        Widget.apply(this, arguments);

        this.painter = layer.painter;
        
        this.text = [];
        this.image = null;
        this.lastInfo = {
            x: null,
            y: null,
            w: null,
            h: null
        };
    }

    CanvasDevice.prototype = Object.create(Widget.prototype);
    CanvasDevice.prototype.constructor = CanvasDevice;

    CanvasDevice.prototype.tpl = '<div class="html-widget html-device"></div>';

    CanvasDevice.prototype.init = function () {
        // 兼容一下老数据格式
        this._format();

        Widget.prototype.init.apply(this, arguments);
    };

    CanvasDevice.prototype._format = function () {};

    /** override */
    CanvasDevice.prototype.show = function () {
        var model = this.store.model;

        this.lastInfo.x = model.x();
        this.lastInfo.y = model.y();
        this.lastInfo.w = model.w();
        this.lastInfo.h = model.h();

        this.shape = new Konva.Rect({
            id: model._id(),
            fill: 'transparent'
        });
        this.update();

        this.layer.add(this.shape);
    };

    CanvasDevice.prototype.updateChildren = function () {
        var model = this.store.model;

        var dx = model.x() - this.lastInfo.x;
        var dy = model.y() - this.lastInfo.y;
        var sW = model.w() / this.lastInfo.w;
        var sH = model.h() / this.lastInfo.h;

        this.text.forEach(function (row) {
            row.update({
                x: dx + ( row.x() - model.x() ) * sW + model.x(),
                y: dy + ( row.y() - model.y() ) * sH + model.y()
            });
        });

        if (this.image) {
            this.image && this.image.update({
                x: dx + ( this.image.x() - model.x() ) * sW + model.x(),
                y: dy + ( this.image.y() - model.y() ) * sH + model.y()
            });
        }
    };

    /** override */
    CanvasDevice.prototype.update = function (e, propName) {
        var _this = this;
        var model = this.store.model;
        var options = model.option();
        var modelsNeedBeAdded = [], modelsNeedBeRemoved = [];
        var map;

        if (!propName || propName.indexOf('update.idDs') > -1) {
            if ($.fn.zTree) {
                var treeObj = $.fn.zTree.getZTreeObj('parentTree');
            }
            if (treeObj) {
                var node = treeObj.getNodeByParam('modelId', model._id());
                if (node && model.idDs) {
                    var idDs = model.idDs();
                    var name;
                    if (idDs.length > 0) {
                        name = idDs[0];
                        name !== node.name && (node.name = name, treeObj.updateNode(node));
                    } else {
                        node.name = I18n.resource.mainPanel.layerName.DEVICE;
                        treeObj.updateNode(node);
                    }
                }
            }
        }

        // 更新位置
        this.shape.position({
            x: model.x(),
            y: model.y()
        });

        this.shape.width( model.w() );
        this.shape.height( model.h() );

        this.updateChildren();

        this.lastInfo.x = model.x();
        this.lastInfo.y = model.y();
        this.lastInfo.w = model.w();
        this.lastInfo.h = model.h();

        if ( propName && propName.indexOf('update.option.tag') > -1 ) {
            map = (function () {
                var map = {};
                _this.text.forEach(function (row) {
                    var type = row.option().attrType;
                    if (typeof type !== 'undefined') {
                        map[type] = row;
                    }
                });
                return map;
            } ());

            // 更新文本控件
            Object.keys(options.tag).forEach(function (row) {
                var opt;
                if (!map[row]) {
                    // 没有的进行新增
                    opt = window.TText.prototype.createEntity();
                    opt._id = ObjectId();
                    opt.x = 10 + model.x();
                    opt.y = 10 + model.y();
                    opt.w = 100;
                    opt.h = 50;
                    opt.option.text = row;
                    opt.option.attrType = row;
                    opt.groupId = model._id();
                    opt.layerId = '';
                    // 如果当前设备支持这个属性，则进行绑点
                    if (options.tag[row].ds) {
                        opt.idDs = [options.tag[row].ds];
                    }
                    
                    modelsNeedBeAdded.push( new Model(opt) );
                } else {
                    map[row] = null;
                }
            });

            // map 中剩下的不为 null 的元素是需要删除的控件
            Object.keys(map).forEach(function (row) {
                if (map[row] !== null) {
                    modelsNeedBeRemoved.push(map[row]);
                }
            });

            this.getPainter().store.widgetModelSet.remove(modelsNeedBeRemoved);
            this.getPainter().store.widgetModelSet.append(modelsNeedBeAdded);
        }

        if ( propName && propName.indexOf('update.option.skin') > -1 ) {
            WebAPI.get('/iot/getClassDetail/'+ options.iotStore.type +'/cn').done(function (rs) {
                var index = options.skin.index;
                var skin = rs.skin[0]['list'][index];
                var imageModel, imageId;
                var promise = $.Deferred();
                var actualW;

                if (!skin) {
                    Log.warn('has not found skin in ' + options.iotStore.type + '\'s skins at index '+ index);
                    return;
                }

                imageId = skin.content.trigger['default'];
                imageModel = _this.store.imageModelSet.findByProperty('_id', imageId);

                if (!imageModel) {
                    WebAPI.post('/factory/material/getByIds', {
                        ids: [imageId]
                    }).done(function (rs) {
                        imageModel = new Model( $.extend(false, {
                            _id: rs[0]._id,
                            groupId: model._id(),
                        }, rs[0].content) );
                        _this.store.imageModelSet.append(imageModel);
                        promise.resolve();
                    });
                } else {
                    promise.resolve();
                }

                promise.done(function () {
                    var params;
                    var imageW = imageModel.interval() === 0 ? imageModel.w() : imageModel.w()/imageModel.pf();
                    var imageH = imageModel.h();
                    var x = model.x() + (model.w() - imageW)/2 ;
                    var y = model.y() + (model.h() - imageModel.h())/2;

                    params = $.extend(false, {
                        _id: ObjectId(),
                        layerId: '',
                        groupId: model._id(),
                        x: x,
                        y: y,
                        w: imageW,
                        h: imageH
                    }, window.TImage.prototype.createEntity());

                    params.option.trigger = skin.content.trigger;

                    if (!_this.image) {
                        _this.getPainter().store.widgetModelSet.append( new NestedModel(params) );
                    } else {
                        _this.image.update({
                            x: params.x,
                            y: params.y,
                            w: params.w,
                            h: params.h,
                            'option.trigger': params.option.trigger
                        });
                    }
                });
            });
        }
    };

    // 用户进行该类控件的复制时会调用此方法
    CanvasDevice.prototype.getCloneModels = function (pos,_id) {
        var arr = [];
        var options, id;
        var model = this.store.model;

        options = $.extend(true, {}, model.serialize());
        options._id = id = _id == undefined ? ObjectId() : _id;
        options.x = pos.x;
        options.y = pos.y;
        arr.push( new NestedModel(options) );

        arr = arr.concat( this.text.map(function (row) {
            var options = $.extend(true, {}, row.serialize());
            options._id = ObjectId();
            options.x += pos.dx;
            options.y += pos.dy;
            options.groupId = id;

            return new NestedModel(options);
        }) );

        options = $.extend(true, {}, this.image.serialize());
        options._id = ObjectId();
        options.x += pos.dx;
        options.y += pos.dy;
        options.groupId = id;
        arr.push( new NestedModel(options) );

        return {
            id: id,
            list: arr
        };
    };

    CanvasDevice.prototype.add = function (model) {
        var type = model.type();
        // 如果是 Html 类型的控件
        if (type === 'HtmlText') {
            this.text.push(model);
        } else if (type === 'CanvasImage') {
            this.image = model;
        }
    };

    CanvasDevice.prototype.remove = function (model) {
        var type = model.type();
        // 如果是 Html 类型的控件
        if (type === 'HtmlText') {
            for (var i = 0, len = this.text.length; i < len; i+=1) {
                if (this.text[i] === model) {
                    return this.text.splice(i, 1);
                }
            }
        } else if (type === 'CanvasImage') {
            this.image = null;
        }
    };

    CanvasDevice.prototype.close = function () {
        var modelSet = this.painter.store.widgetModelSet;

        Widget.prototype.close.apply(this, arguments);

        // 删除相应的文本控件
        modelSet.remove(this.text);

        // 删除相应的图片控件
        modelSet.remove(this.image);
    };

    /** 适配工作 */
    CanvasDevice.prototype = Mixin(CanvasDevice.prototype, CanvasWidgetMixin);
    CanvasDevice.prototype.type = 'CanvasDevice';

    exports.CanvasDevice = CanvasDevice;
} (
    namespace('widgets.factory'),
    namespace('widgets.factory.Widget'),
    namespace('mixins.CanvasWidgetMixin')
));