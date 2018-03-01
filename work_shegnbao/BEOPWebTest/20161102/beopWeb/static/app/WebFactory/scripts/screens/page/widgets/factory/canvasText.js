(function (exports, Widget, CanvasWidgetMixin) {

    function CanvasText(layer, model) {
        Widget.apply(this, arguments);
    }

    CanvasText.prototype = Object.create(Widget.prototype);
    CanvasText.prototype.constructor = CanvasText;

    CanvasText.prototype.init = function () {
        // 兼容一下老数据格式
        this._format();

        Widget.prototype.init.apply(this, arguments);
    };

    CanvasText.prototype._format = function () {
        //兼容老数据
        var options = this.store.model.option();
        //
        this.store.model.option(options);
    };

    /** override */
    CanvasText.prototype.show = function () {
        var model = this.store.model;

        this.shape = new Konva.Text({
            id: model._id(),
            x: model.x(),
            y: model.y(),
            text: model['option.text'](),
            fontSize: model['option.fontSize'](),
            fontFamily: model['option.fontFamily'](),
            fill: model['option.fontColor'](),
            width:model.w(),
            align:model['option.textAlign']()
        });

        this.update();

        this.layer.add(this.shape);
    };

    /** override */
    CanvasText.prototype.update = function (e, propName) {
        var model = this.store.model;
        var options = model.option();

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
                        node.name = I18n.resource.mainPanel.layerName.TEXT;
                        treeObj.updateNode(node);
                    }
                }
            }
        }

        if (!propName || propName.indexOf('update.x') > -1 || propName.indexOf('update.y') > -1) {
            this.shape.position({
                x: model.x() + model.w() / 2,
                y: model.y() + model.h() / 2
            });
        }

        if (!propName || propName.indexOf('update.w') > -1 || propName.indexOf('update.h') > -1) {
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

        //字体,字号,类型更改
        if(!propName || propName.indexOf('update.option.fontFamily') > -1){
            this.shape.fontFamily(options.fontFamily);
        }
        if(!propName || propName.indexOf('update.option.fontSize') > -1){
            this.shape.fontSize(options.fontSize);
        }
        if(!propName || propName.indexOf('update.option.fontStyle') > -1){
            this.shape.fontStyle(options.fontStyle);
        }

        //对齐
        var changePadding;
        if(!propName || propName.indexOf('update.option.textAlign') > -1){
            this.shape.align(options.textAlign);
        }
        //if(!propName || propName.indexOf('update.option.verticalAlign') > -1){
        //    if(options.verticalAlign === 'top'){
        //        changePadding = 0;
        //    }else if(options.verticalAlign === 'middle'){
        //        changePadding = (model.h() - model['option.fontSize']())/2;
        //    }else if(options.verticalAlign === 'bottom'){
        //        changePadding = model.h() - model['option.fontSize']();
        //    }
        //    this.shape.padding(changePadding);
        //}

        //颜色
        if(!propName || propName.indexOf('update.option.fontColor') > -1){
            this.shape.fill(options.fontColor);
        }
        //if(!propName || propName.indexOf('update.option.bgColor') > -1){
        //
        //}

        var value;
        // options.text 为 string 类型，说明是在编辑 模式下
        if (typeof options.text === 'string') {
            this.shape.text(options.text);
        }
        // options.text 为 object 类型，说明是在预览模式下
        else if (typeof options.text === 'object') {
            if (options.text.value !== '' && !isNaN(options.text.value)) {
                value = parseFloat(options.text.value).toFixed(options.precision || 2);
            } else {
                value = options.text.value;
            }
            // 判断是否有 <%value%> 占位符，如果没有，则整体替换
            if (options.text.content.indexOf('<%value%>') === -1) {
                this.shape.text(value);
            } else {
                this.shape.text(options.text.content.replace('<%value%>', value));
            }
        }

        // 仅更新的时候需要再次进行绘制
        if (e) {
            this.layer.draw();
        }
    };

    CanvasText.prototype = Mixin(CanvasText.prototype, CanvasWidgetMixin);

    CanvasText.prototype.type = 'CanvasText';

    exports.CanvasText = CanvasText;

} (namespace('widgets.factory'),
    namespace('widgets.factory.Widget'),
    namespace('mixins.CanvasWidgetMixin')));
