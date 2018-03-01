(function () {

    function TShape() {
        TBase.apply(this, arguments);

        this.layer = this.painter.interactiveLayer;
        this.previewRect = null;
    }

    TShape.prototype = Object.create(TBase.prototype);
    TShape.prototype.constructor = TShape;

    TShape.prototype.option = {
        cursor: 'crosshair'
    };

    void function () {

        var mDownX, mDownY;

        this.mouseDownActionPerformed = function (e) {
            var evt = e.evt;

            mDownX = evt.transformedX;
            mDownY = evt.transformedY;

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

            if(mDownX <= evt.transformedX) {
                startX = mDownX;
                endX = evt.transformedX;
            } else {
                startX = evt.transformedX;
                endX = mDownX;
            }

            if(mDownY <= evt.transformedY) {
                startY = mDownY;
                endY = evt.transformedY;
            } else {
                startY = evt.transformedY;
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
            var pos;
            var layer = this.painter.state.activeLayers()[0];
            var widget, entity;
            var gridWidth;

            pos = GUtil.getShapeRect(this.previewRect);
            if (pos.w > 10 && pos.h > 10) {
                gridWidth = this.painter.getGridWidth();

                entity = this.createEntity();
                entity._id = ObjectId();
                entity.layerId = layer?layer.store.model._id():'';
                entity.isHide = 0;
                // 数据格式化，使之吸附到网格上去
                entity.x = pos.x;
                entity.y = pos.y;
                entity.w = pos.w;
                entity.h = pos.h;
                
                // 创建图形
                this.createShape(entity);

                // 切换到箭头工具
                this.toolbar.switchTool('TPointer');
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