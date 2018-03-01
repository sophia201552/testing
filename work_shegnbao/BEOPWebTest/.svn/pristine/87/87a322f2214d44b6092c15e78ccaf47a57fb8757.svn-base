(function () {

    function TImage(toolbar, container) {
        TBase.apply(this, arguments);

        this.layer = this.painter.interactiveLayer;
        this.previewRect = undefined;
    }
    TImage.prototype = Object.create(TBase.prototype);
    TImage.prototype.constructor = TImage;

    TImage.prototype.option = {
        cursor: 'crosshair'
    };

    TImage.prototype.tpl = '<button class="btn-trigger" title="图片控件(i)" data-type="imgeCtrl"><span class = "iconfont icon-tianjiatupian"></span></button>';
    TImage.prototype.onTrigger = function () {
        
        var _this = this;
        MaterialModal.show([{'title':'Template',data:['Image']}], function (data) {
            var actualW, actualH;
            var entity;
            if(data.interval === 0) {
                actualW = data.w;
            } else {
                actualW = data.w/data.pf;
            }
            entity = $.extend( false, {
                _id: ObjectId(),
                name: data.name,
                layerId: '',
                x: 10,
                y: 10,
                w: actualW,
                h: data.h
            }, _this.createEntity() );
            entity.option.trigger.default = data._id;
            entity.isHide = 0;
            _this.painter.screen.store.imageModelSet.append( new Model(data) );
            _this.painter.store.widgetModelSet.append(new NestedModel(entity));
            _this.painter.setActiveWidgets(entity._id);

        });
    };
    void function () {

        this.createEntity = function () {
            var activeLayers = this.painter.state.activeLayers();
            var layerId;
            if(activeLayers.length > 0){
                layerId = activeLayers[0].store.model._id();
            }
            return {
                option: {
                    "trigger": {
                        'default': ''
                    },
                    rotate: 0,
                    scale: {
                        x: 1,
                        y: 1
                    },
                    preview:[]
                },
                layerId: layerId,
                type: 'CanvasImage',
                idDs: []
            }
        }

    }.call(TImage.prototype);

    window.TImage = TImage;
} ());