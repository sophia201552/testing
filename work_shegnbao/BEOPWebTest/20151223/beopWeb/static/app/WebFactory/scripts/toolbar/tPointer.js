(function () {

    function TPointer(toolbar, container) {
        TBase.apply(this, arguments);

        this.layer = this.painter.interactiveLayer;
        this.previewRect = undefined;
    }

    TPointer.prototype = Object.create(TBase.prototype);
    TPointer.prototype.constructor = TPointer;

    TPointer.prototype.tpl = '\
<button title="箭头工具">\
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0.5 18.5 18 18" width="18px" height="18px">\
        <path stroke="none" d="M3.5,18.5v18l5-7h9L3.5,18.5z"></path>\
    </svg>\
</button>';

    TPointer.prototype.settings = {
        // 单位 px
        keyMoveStep: 0.5
    };
    
    +function () {
        var mDownX, mDownY;
        var offsetX, offsetY;

        TPointer.prototype.dragShapeActionPerformed = function (e) {
            var evt = e.evt;

            this.layer.find('.resizable-group').each(function (row, i) {
                row.position({
                    x: row.x() + evt.layerX - mDownX,
                    y: row.y() + evt.layerY - mDownY
                });
            });
            mDownX = evt.layerX;
            mDownY = evt.layerY;

            this.layer.draw();
        };

        TPointer.prototype.dropShapeActionPerformed = function (e) {
            var _this = this;
            var shapes = this.layer.find('.resizable-shape');

            shapes.each(function (shape) {
                var refid = shape.id().split('_')[0];
                var ref = _this.painter.find('#'+refid);
                var pos = _this.painter.transform(shape);

                ref.forEach(function (row) {
                    row.position({
                        x: pos.x,
                        y: pos.y
                    });
                });
            });

            this.painter.draw();
        };

        TPointer.prototype.mouseDownActionPerformed = function (e) {
            var evt = e.evt;
            var hitShape;
            var editableGroups = this.layer.find('.resizable-group');
            var m = this.painter.getTransform();

            mDownX = evt.layerX;
            mDownY = evt.layerY;

            // 判断落点是否在 可编辑组 内
            if(editableGroups.length) {
                hitShape = GUtil.getIntersectionByPoint(mDownX, mDownY, this.layer);
                if( hitShape && (hitShape.hasName('resizable-shape')) ) {
                    // 注册鼠标行为 - 拖拽行为
                    this.mouseMoveActionPerformed = this.dragShapeActionPerformed;
                    if(evt.ctrlKey) {
                        // 拖拽复制
                        this.mouseUpActionPerformed = this.copyShapeActionPerformed;
                    } else {
                        // 拖拽
                        this.mouseUpActionPerformed = this.dropShapeActionPerformed;
                    }
                    return;
                }
            }

            // 判断落点是否在某个图形内
            hitShape = GUtil.getIntersectionByPoint(mDownX, mDownY, this.painter.state.activeLayers(), m);

            // 清除的可编辑矩形
            this.painter.setActiveWidgets();

            if(hitShape) {
                // 注册鼠标行为 - 拖拽行为
                this.mouseMoveActionPerformed = this.dragShapeActionPerformed;
                this.mouseUpActionPerformed = this.dropShapeActionPerformed;

                this.painter.setActiveWidgets(hitShape);
            } else {
                // 注册鼠标行为 - 框选行为
                this.mouseMoveActionPerformed = this.selectingAreaActionPerformed;
                this.mouseUpActionPerformed = this.selectedAreaActionPerformed;

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
            }
            this.layer.draw();
        };

        TPointer.prototype.selectingAreaActionPerformed = function (e) {
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
        TPointer.prototype.selectedAreaActionPerformed = function (e) {
            var hitShapes = [];
            var r = this.previewRect;
            var pos = r.getAbsolutePosition();

            hitShapes = GUtil.getIntersectionByRect(pos.x, pos.y, r.width(), r.height(), this.painter.state.activeLayers(), this.painter.getTransform());

            if(hitShapes.length) {
                // 凸显所有选中的图形
                this.painter.setActiveWidgets(hitShapes);
            }

            if(this.previewRect) {
                this.previewRect.destroy();
                this.previewRect = undefined;
            }
            this.layer.draw();
        };

        TPointer.prototype.keyDownActionPerformed = function (e) {
            var handler = null, code = e.keyCode;
            var step = this.settings.keyMoveStep;
            var shapes;

            // 监控箭头按键(37~40)事件、Delete按键(46)事件
            if( [37, 38, 39, 40, 46].indexOf(code) === -1 ) return;

            shapes = this.layer.find('.resizable-group');
            // 没有选中的元素，不进行任何操作
            if(shapes.length === 0) return;

            if(code === 46) {
                this.removeShapes();
                return;
            }

            switch(code) {
                // left
                case 37:
                    handler = function (row) { row.x(row.x() - step); };
                    break;
                // top
                case 38:
                    handler = function (row) { row.y(row.y() - step); };
                    break;
                // right
                case 39:
                    handler = function (row) { row.x(row.x() + step); };
                    break;
                // bottom
                case 40:
                    handler = function (row) { row.y(row.y() + step); };
                    break;
                default: return;
            }

            shapes.each(handler);
            this.layer.draw();
        };

        TPointer.prototype.keyUpActionPerformed = function (e) {
            // 只监控四个箭头事件
            if( [37, 38, 39, 40].indexOf(e.keyCode) === -1 ) return;

            this.dropShapeActionPerformed();
        };

        TPointer.prototype.copyShapeActionPerformed = function (e) {
            var _this = this;
            var shapes = this.layer.find('.resizable-shape');
            var offset = this.painter.getViewportPosition();
            var scale = this.painter.scale;

            shapes.each(function (row) {
                var refid = row.id().split('_')[0];
                var ref = this.painter.find('#'+refid);
                var pos = _this.painter.transform(row);
                var id = ObjectId();

                row.id(id+'_a');

                ref.forEach(function (row) {
                    var options = $.extend(true, {}, row.store.model.serialize());
                    options._id = id;
                    options.x = pos.x;
                    options.y = pos.y;

                    this.painter.store.widgetModelSet.append(new NestedModel(options));
                }, this);
            });

            this.painter.draw();
        };

    }();

    TPointer.prototype.removeShapes = function () {
        var _this = this;
        var shapes = this.layer.find('.resizable-shape');

        shapes.each(function (row) {
            var refid = row.id().split('_')[0];
            var ref = this.painter.find('#'+refid);

            ref.forEach(function (row) {
                var layer = row.getLayer();
                var model = this.painter.store.widgetModelSet.findByProperty('_id', refid);

                if(model !== null) {
                    this.painter.store.widgetModelSet.remove(model);
                }
            }, this);
        });

        this.painter.setActiveWidgets();
        this.painter.draw();
    };

    window.TPointer = TPointer;
} ());