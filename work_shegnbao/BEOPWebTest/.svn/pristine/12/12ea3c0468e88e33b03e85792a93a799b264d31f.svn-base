(function () {

    function TImage(toolbar, container) {
        TBase.apply(this, arguments);

        this.layer = this.painter.interactiveLayer;
        this.previewRect = undefined;
        this.supportLayerType = 'canvas';
    }
    TImage.prototype = Object.create(TBase.prototype);
    //TImage.prototype = Object.create(TShape.prototype);
    TImage.prototype.constructor = TImage;

    TImage.prototype.tpl = '<button class="btn-trigger" title="图片控件" data-type="imgeCtrl"><span class="glyphicon glyphicon-picture"></span></button>';
    TImage.prototype.onTrigger = function () {
        var _this = this;
        MaterialModal.show(['pic','img'], function (data) {
            var entity = {
                _id: ObjectId(),
                layerId: _this.painter.state.activeLayers()[0].store.model._id(),
                option: {
                    "trigger": {
                        'default': data._id
                    },
                    rotate: 0
                },
                x: 10,
                y: 10,
                w: data.w,
                h: data.h,
                type: 'CanvasImage',
                idDs: []
            };
            _this.painter.screen.store.imageModelSet.append( new Model(data) );
            _this.painter.store.widgetModelSet.append( new NestedModel(entity) );
            _this.painter.setActiveWidgets(entity._id);

        });
    };
    void function () {

         this.createEntity = function () {
            return {
                option: {
                    "trigger": {
                        'default': ''
                    },
                    rotate: 0
                },
                type: 'CanvasImage',
                idDs: []
            }
        }

    }.call(TImage.prototype);

    window.TImage = TImage;
} ());