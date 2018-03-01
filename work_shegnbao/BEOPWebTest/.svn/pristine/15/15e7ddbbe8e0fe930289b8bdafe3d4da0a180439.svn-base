(function () {

    function TShape() {
        TBase.apply(this, arguments);

        this.layer = this.painter.interactiveLayer;
        this.previewRect = null;
        this.supportLayerType = 'html';
    }

    TShape.prototype = Object.create(TBase.prototype);
    TShape.prototype.constructor = TShape;

    void function () {

        var mDownX, mDownY;

        this.mouseDownActionPerformed = function (e) {
            var evt = e.evt;

            mDownX = evt.layerX;
            mDownY = evt.layerY;

            // 处理某些特殊情况下，预览框没有消失的问题
            if(this.previewRect) {
                this.previewRect.destroy();
            }
            this.previewRect = new Konva.Rect({
                id: '__previewRect',
                name: '__previewRect',
                x: mDownX,
                y: mDownY,
                width: 1,
                height: 1,
                stroke: '#2aabd2',
                strokeWidth: 2
            });
            this.layer.add(this.previewRect);

            this.layer.draw();
        };

        this.mouseMoveActionPerformed = function (e) {
            var evt = e.evt;

            var startX, endX, startY, endY;

            if(mDownX <= evt.layerX) {
                startX = mDownX;
                endX = evt.layerX;
            } else {
                startX = evt.layerX;
                endX = mDownX;
            }

            if(mDownY <= evt.layerY) {
                startY = mDownY;
                endY = evt.layerY;
            } else {
                startY = evt.layerY;
                endY = mDownY;
            }

            this.previewRect.position({
                x: startX,
                y: startY
            });
            this.previewRect.width(endX - startX);
            this.previewRect.height(endY - startY);

            this.layer.draw();
        };

        this.mouseUpActionPerformed = function (e) {
            var pos, id;
            var layers = this.painter.state.activeLayers(), layer;
            var widget, entity;
            var gridWidth;

            if(layers.length > 1 || layers.length === 0 
                || layers[0].getLayerType() !== this.supportLayerType) {
                alert('无法完成请求，请先选中'+this.supportLayerType+'图层');
            } else {
                pos = this.painter.transform(this.previewRect);
                if (pos.w > 10 && pos.h > 10) {
                    gridWidth = this.painter.getGridWidth();
                    layer = layers[0];
                    id = ObjectId();

                    entity = this.createEntity();
                    entity._id = id;
                    entity.layerId = layer.id();

                    // 数据格式化，使之吸附到网格上去
                    entity.x = Math.round(pos.x / gridWidth) * gridWidth;
                    entity.y = Math.round(pos.y / gridWidth) * gridWidth;
                    entity.w = Math.round(pos.w / gridWidth) * gridWidth;
                    entity.h = Math.round(pos.h / gridWidth) * gridWidth;
                    
                    // 创建图形
                    this.createShape(entity);

                    // 切换到箭头工具
                    this.toolbar.switchTool('TPointer');
                }
            }

            if(this.previewRect) {
                this.previewRect.destroy();
                this.previewRect = undefined;
            }
            this.layer.draw();
        };

        this.createShape = function (entity) {
            this.painter.store.widgetModelSet.append( new NestedModel(entity) );
            // 选中生成的 widget
            this.painter.setActiveWidgets(entity._id);
        };

        this.createEntity = function () {
            return {};
        };

    }.call(TShape.prototype);

    window.TShape = TShape;
} ());