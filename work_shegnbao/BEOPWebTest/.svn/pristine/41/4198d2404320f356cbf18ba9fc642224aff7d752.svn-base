(function (exports, Widget, CanvasWidgetMixin, CanvasHeatC,TooltipMixin) {
    var _this;
    function CanvasHeatP(layer, model) {
        Widget.apply(this, arguments);
        this.text = undefined;
        this.children = [];
        this.rect = undefined;
        _this = this;
        //this.init();
    }

    CanvasHeatP.prototype = Object.create(Widget.prototype);
    CanvasHeatP.prototype.constructor = CanvasHeatP;

    CanvasHeatP.prototype.init = function () {
        this._format();
        Widget.prototype.init.apply(this, arguments);
    };
    CanvasHeatP.prototype._format = function () {
        //兼容老数据
        var options = this.store.model.option();
        if (!options.preview) {
            options.preview = [];
        }
        this.store.model.option(options);
    };
    /** override */
    CanvasHeatP.prototype.show = function (isS) {
        //isS  true表示预览  false表示非预览
        _this = this;
        var model = this.store.model;
        var option = model.option();
        
        var width = height = option.radius * 2,
            color = option.fill,
            id = model._id(),
            x = model.x(),
            y = model.y();

        if (isS) {
            var fontSize = option.fontSize,
                unitType = option.unitType;
            width = width * 2 + Number(fontSize);
            var polygonArr = option.polygonArr;
            var polygonId = option.polygonId;
            
            this.shape = new Konva.Text({
                id: id,
                name: 'heat-circle hc_' + id,
                text: '--',
                fontSize: fontSize,
                fontFamily: 'Calibri',
                fill: color,
                fontStyle: 'bold',
                width: width,
                height: fontSize,
                x: x-fontSize/2,
                y: y,
                align: 'center',
                stroke: 'black',
                strokeEnabled: false,
                strokeWidth: 0,
                align: 'center',
                padding: (height - fontSize) / 2
            });
            
        } else {
            this.shape = new Konva.Rect({
                id: id,
                name: 'heat-circle hc_' + id,
                x: x,
                y: y,
                width: width,
                height: height,
                fill: 'green',
                stroke: 'black',
                strokeWidth: 4
            });
        };
        if (model.idDs().length) {
            this.enableTooltip && this.initTooltip({
                clickable: AppConfig.isFactory === 0
            });
        }
        this.layer.add(this.shape);
        this.shape.moveToTop();
        this.update();
    };

    /** override */
    CanvasHeatP.prototype.update = function (e, propType) {
        
        var model = this.store.model;
        var option = model.option();
        var polygonId = option.polygonId;
        var temp;
        if (!propType || propType.indexOf('update.idDs') > -1) {
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
                        node.name = I18n.resource.mainPanel.layerName.HEATP;
                        treeObj.updateNode(node);
                    } 
                }
            }
        }

        if (option.text && propType && (propType.indexOf('update.option.text') > -1)) {
            temp = option.text.value;//接受的温度
            temp = Number(temp).toFixed(1);
            this.shape.text(temp);
            var ca = new CanvasHeatC();
            ca.data(temp);
            if (window.colorGettings) {
                ca.max(window.colorGettings.max);
                ca.min(window.colorGettings.min);
            } else {
                ca.max(30);
                ca.min(20);
            }
            
            var polygonColor = ca.color();

            var heatPolygon = this.painter.store.widgetModelSet.findByProperty('_id', polygonId);
            heatPolygon&&heatPolygon.update({
                            'option.color': polygonColor
                        });
        }
        if (propType && (propType.indexOf('update.x') > -1 || propType.indexOf('update.y') > -1)) {

            this.shape.x(model.x());
            this.shape.y(model.y());
           
        }
        if (propType && (propType.indexOf('update.option.fill') > -1)) {
            
        }
        
        if (propType && (propType.indexOf('update.option.polygonId') > -1)) {

        }
        this.layer.draw();
    };
    CanvasHeatP.prototype = Mixin(CanvasHeatP.prototype, CanvasWidgetMixin);

    CanvasHeatP.prototype.x = function () {
        var model = this.store.model;
        return model.x() - model['option.radius']()*2;
    };

    CanvasHeatP.prototype.y = function () {
        var model = this.store.model;
        return model.y() - model['option.radius']();
    };

    CanvasHeatP.prototype.width = function () {
        return this.store.model['option.radius']() * 2;
    };

    CanvasHeatP.prototype.height = function () {
        return this.store.model['option.radius']() * 2;
    };

    CanvasHeatP.prototype.getType = function () {
        return 'Combine';
    }
    CanvasHeatP.prototype.moveToBottom = function () {
       
    }

    CanvasHeatP.prototype = Mixin(CanvasHeatP.prototype, TooltipMixin);

    exports.CanvasHeatP = CanvasHeatP;
}(
    namespace('widgets.factory'),
    namespace('widgets.factory.Widget'),
    namespace('mixins.CanvasWidgetMixin'),
    namespace('widgets.factory.CanvasHeatC'),
    namespace('mixins.TooltipMixin')
));
