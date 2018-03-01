(function (exports, Widget, CanvasWidgetMixin, CanvasPipeShape) {

    ////////////////////////////
    /// CanvasPipe DEFINITION //
    ////////////////////////////
    function CanvasPipe(layer, model) {
        Widget.apply(this, arguments);

        this.children = [];
    }

    CanvasPipe.prototype = Object.create(Widget.prototype);
    CanvasPipe.prototype.constructor = CanvasPipe;

    CanvasPipe.prototype.init = function () {
        // 兼容一下老数据格式
        this._format();

        Widget.prototype.init.call(this);
    };

    CanvasPipe.prototype._format = function () {
        var options = this.store.model.option();
        var points = options.points, pArr = [];
        if(typeof this.store.model.isHide === "undefined"){
            this.store.model.property('isHide',0);
        }
        if (typeof points[0] === 'number') {
            for (var i = 0, len = points.length; i < len; i += 2) {
                pArr.push({
                    x: points[i],
                    y: points[i+1],
                    join: 1
                });
            }
            options.points = pArr;
        }
        if(!options.direction){
            options.direction = 0;
        }
        if(!options.preview){
            options.preview = [];
            var arr = this.store.model.idDs();
            for(var i = 0,len = arr.length;i<len;i++){
                options.preview.push('');
            }
        }
        if(!options.logic){
            options.logic = 0;
        }

        if (!options.pipeAnimation) {
            options.pipeAnimation = 0;
        }

        this.store.model.option(options);
    };

    /** override */
    CanvasPipe.prototype.show = function () {
        var _this = this;
        var model = this.store.model;
        var initPos = {};
        //var points = model.option().points;
        var option = model.option();
        this.shape = new CanvasPipeShape(this.layer, {
            _id: model._id(),
            points: option.points,
            color: option.color,
            width: option.width,
            direction: option.direction,
            pipeAnimation: option.pipeAnimation
        });
        this.update();
        this.children = this.shape.toArray();
        this.layer.add(this.children.map(function (row) {
            return row.shape;
        }));
    };

    /** override */
    CanvasPipe.prototype.update = function (e, propType) {
        var model = this.store.model;
        var option = model.option();
        var points = option.points;
        var info, dx, dy, pw, ph;

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
                        node.name = I18n.resource.mainPanel.layerName.PIPE;
                        treeObj.updateNode(node);
                    }
                }
            }
        }
        // 颜色或者宽度更新时, 需要更新 color
        if( propType && propType.indexOf('update.option') > -1 ){
            this.shape.options.color = option.color;
            this.shape.options.pipeAnimation = option.pipeAnimation;
            this.shape.options.width = option.width;
            this.shape.options.points = option.points;
        }
        this.shape.paint();
        //更新 isHide
        if (!propType || propType.indexOf('update.isHide') > -1) {
            if(this.store.model.isHide()){
                this.detach();
            }else{
                this.attach();
            }
        }
        if (!propType || propType.indexOf('update.layerId') > -1) {
            this.setParent(model.layerId());
        }
        // 仅更新的时候需要再次进行绘制
        if (e) {
            this.layer.draw();
        }
    };

    CanvasPipe.prototype = Mixin(CanvasPipe.prototype, CanvasWidgetMixin);

    CanvasPipe.prototype.hasShape = function (shape) {
        return this.children.some(function (row) {
            return shape === row.shape;
        });
    };

    CanvasPipe.prototype.width = function () {
        return 0;
    };

    CanvasPipe.prototype.height = function () {
        return 0;
    };

    /** override */
    CanvasPipe.prototype.position = function () {
        return {
            x: 0,
            y: 0
        };
    };

    CanvasPipe.prototype.getType = function () {
        return 'Pipe';
    };

    CanvasPipe.prototype.getPoints = function () {
        return this.store.model['option.points']();
    };

    CanvasPipe.prototype.getRadius = function () {
        return this.shape.CIRCLE_RADIUS;
    };

    exports.CanvasPipe = CanvasPipe;
} (
    namespace('widgets.factory'),
    namespace('widgets.factory.Widget'),
    namespace('mixins.CanvasWidgetMixin'),
    namespace('widgets.factory.CanvasPipeShape') ));