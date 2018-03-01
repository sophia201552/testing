(function () {

    function TPointer(toolbar, container) {
        TBase.apply(this, arguments);

        this.layer = this.painter.interactiveLayer;
        this.previewRect = undefined;
    }

    TPointer.prototype = Object.create(TBase.prototype);
    TPointer.prototype.constructor = TPointer;

    TPointer.prototype.tpl = '\
<button class="btn-switch" title="箭头工具" data-type="pointerCtrl">\
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0.5 18.5 18 18" width="18px" height="18px">\
        <path stroke="none" d="M3.5,18.5v18l5-7h9L3.5,18.5z"></path>\
    </svg>\
</button>';

    TPointer.prototype.settings = {
        // 单位 px
        keyMoveStep: 1
    };
    
    +function () {
        var mDownX, mDownY;
        var gridInfo = {};

        TPointer.prototype.mouseDownActionPerformed = function (e) {
            var evt = e.evt;
            var hitShape;
            var editableGroups = this.layer.find('.resizable-group');
            var m = this.painter.getTransform();
            var activeWidgets = this.painter.state.activeWidgets().slice();

            mDownX = evt.layerX;
            mDownY = evt.layerY;

            // 判断落点是否在 可编辑组 内
            if(editableGroups.length) {
                hitShape = GUtil.getIntersection(mDownX, mDownY, this.layer);
                //鼠标Ctrl点击事件
                if( hitShape && (hitShape.hasName('resizable-shape')) ) {
                    // 注册鼠标行为 - 拖拽行为
                    this.mouseMoveActionPerformed = this.dragShapeActionPerformed;
                    gridInfo.width = this.painter.getGridWidth() * this.painter.scale;
                    gridInfo.sPos = hitShape.getParent().position();

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
            if(!evt.ctrlKey){
                this.painter.setActiveWidgets();
            }

            if(hitShape) {
                // 注册鼠标行为 - 拖拽行为
                this.mouseMoveActionPerformed = this.dragShapeActionPerformed;
                gridInfo.width = this.painter.getGridWidth() * this.painter.scale;
                gridInfo.sPos = {x: 0 ,y: 0};
                if(evt.ctrlKey) {
                    // 拖拽复制
                    this.mouseUpActionPerformed = this.copyShapeActionPerformed;
                } else {
                    // 拖拽
                    this.mouseUpActionPerformed = this.dropShapeActionPerformed;
                    this.painter.setActiveWidgets(hitShape);
                }
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
                    fill: 'rgba(91, 192, 222, .2)',
                    stroke: 'rgba(48, 114, 171, .9)',
                    strokeWidth: 1
                });
                this.layer.add(this.previewRect);
            }
            this.layer.draw();
        };

        //////////////
        // 拖拽行为 //
        //////////////
        TPointer.prototype.dragShapeActionPerformed = function (e) {
            var evt = e.evt;
            var dx = evt.layerX - mDownX;
            var dy = evt.layerY - mDownY;
            var gridWidth = gridInfo.width;

            this.layer.find('.resizable-group').each(function (row, i) {
                var x = gridInfo.sPos.x + dx;
                var y = gridInfo.sPos.y + dy;
                x = Math.round(x / gridWidth) * gridWidth;
                y = Math.round(y / gridWidth) * gridWidth;

                row.position({
                    x: x,
                    y: y
                });
            });

            this.layer.draw();
        };

        TPointer.prototype.dropShapeActionPerformed = function (e) {
            var _this = this;
            var shapes = this.layer.find('.resizable-group');
            var isAdsorptive = true;

            if (e === false) { 
                isAdsorptive = false; 
            }
            // 取四舍五入的较小值 4
            else if ( Math.abs(e.evt.layerX - mDownX) < 4 && Math.abs(e.evt.layerY - mDownY) < 4 ) {
                return;
            }


            shapes.each(function (shape) {
                shape.resizeShape(isAdsorptive);
            });

            this.painter.draw();

            this.resetMouseAction();
        };

        //////////////
        // 框选行为 //
        //////////////
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
            var rw = r.width(), rh = r.height();
            var pos = r.getAbsolutePosition();

            // 屏蔽一些多余操作
            if (rw < 10 && rh < 10) {
                hitShapes = [];
            } else {
                hitShapes = GUtil.getIntersectionByRect(pos.x, pos.y, rw, rh, this.painter.state.activeLayers(), this.painter.getTransform());
            }


            if(hitShapes.length) {
                // 凸显所有选中的图形
                this.painter.setActiveWidgets(hitShapes);
            }

            if(this.previewRect) {
                this.previewRect.destroy();
                this.previewRect = undefined;
            }
            this.layer.draw();
            this.resetMouseAction();
        };

        TPointer.prototype.keyDownActionPerformed = function (e) {
            var handler = null, code = e.keyCode;
            var step = this.settings.keyMoveStep * this.painter.scale;
            var shapes;

            // 监控箭头按键(37~40)事件、Delete按键(46)事件
            // 67(Ctrl) 86(v) 8(Backspace)
            if( [37, 38, 39, 40, 46, 67, 86, 8].indexOf(code) === -1 ) return;
            //ctrl+v
            if(e.ctrlKey && code == 86){
                this.pasteWidgetShapeActionPerformed();
                return;
            }
            shapes = this.layer.find('.resizable-group');

            // 没有选中的元素，不进行任何操作
            if(shapes.length === 0) return;
            //ctrl+c
            if (e.ctrlKey && code == 67) {
                this.copyWidgetShapeActionPerformed();
                return;
            }

            if (code === 46 || code === 8) {
                e.preventDefault();
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

        //////////////
        // 按键行为 //
        //////////////
        TPointer.prototype.keyUpActionPerformed = function (e) {
            // 只监控四个箭头事件
            if( [37, 38, 39, 40].indexOf(e.keyCode) === -1 ) return;

            this.dropShapeActionPerformed(false);
        };

        //////////////////
        // 拖拽复制行为 //
        //////////////////
        TPointer.prototype.copyShapeActionPerformed = function (e) {
            var _this = this;
            var shapes = this.layer.find('.resizable-shape');
            var offset = this.painter.getViewportPosition();
            var scale = this.painter.scale;
            var shapeAdded = [], shapeAddedIds = [];
            var eDownX = (e.evt.layerX - mDownX)/scale;//结束时距离减去开始的距离除以比例
            var eDownY = (e.evt.layerY - mDownY)/scale;
            if(Math.abs(eDownX) < 10 && Math.abs(eDownY) < 10){
                var hitShape;
                var editableGroups = this.layer.find('.resizable-group');
                var m = this.painter.getTransform();
                var activeWidgets = this.painter.state.activeWidgets().slice();
                if(editableGroups.length) {
                    //Ctrl多次点击同一个的可编辑矩形切换
                    hitShape = GUtil.getIntersection(mDownX, mDownY, this.layer);
                    //鼠标Ctrl点击事件
                    if( hitShape && (hitShape.hasName('resizable-shape')) ) {
                    //Ctrl多次点击同一个的可编辑矩形切换
                        var len = activeWidgets.length;
                        var hitShapeId = hitShape.attrs.id.split('_')[0];
                            for (var i=0;i< len;i++){
                                if( hitShapeId === activeWidgets[i].id()){
                                    activeWidgets.splice(i,1);
                                    break;
                                }
                            }
                        this.painter.setActiveWidgets(activeWidgets);
                    }else{
                        hitShape = GUtil.getIntersectionByPoint(mDownX, mDownY, this.painter.state.activeLayers(), m);
                        if(hitShape) {
                        //Ctrl多选控件
                        activeWidgets.push(hitShape);
                        this.painter.setActiveWidgets(activeWidgets);
                        }
                    }
                    return;
                }
                hitShape = GUtil.getIntersectionByPoint(mDownX, mDownY, this.painter.state.activeLayers(), m);
                if(hitShape) {
                    //Ctrl多选控件
                    activeWidgets.push(hitShape);
                    this.painter.setActiveWidgets(activeWidgets);
                    return;
                }
            }

            shapes.each(function (row) {
                var refid = row.id().split('_')[0];
                var ref = this.painter.find('#'+refid);
                var pos = _this.painter.transform(row);
                var id = ObjectId();

                ref.forEach(function (row) {
                    var options = $.extend(true, {}, row.store.model.serialize());
                    options._id = id;
                    if (options.type === 'CanvasPipe'){
                        options.option.points[0].x += eDownX;
                        options.option.points[1].x += eDownX;
                        options.option.points[0].y += eDownY;
                        options.option.points[1].y += eDownY;
                    } else {
                        options.x = pos.x;
                        options.y = pos.y;
                    }
                    // 将需要添加的图形先放到一个临时数组中，方便后面一次性插入
                    shapeAddedIds.push(id);
                    shapeAdded.push(new NestedModel(options));
                }, this);
            });
            // 一次性加入到页面
            this.painter.store.widgetModelSet.append(shapeAdded);

            // 将当前的选中矩形定位到新增加的图形
            this.painter.setActiveWidgets(shapeAddedIds);

            this.painter.draw();
        };

        ////////////
        // Ctrl+C //
        ////////////
        TPointer.prototype.copyWidgetShapeActionPerformed = function (e) {
            var _this = this;
            var shapes = this.layer.find('.resizable-shape');
            var offset = this.painter.getViewportPosition();
            var scale = this.painter.scale;
            var shapeAdded = [];
            var activeLayers = this.painter.state.activeLayers();
            for (var i = 0, len = activeLayers.length-1; i < len; i++) {
                if (activeLayers[i].store.model.type() !== activeLayers[i+1].store.model.type()) {
                    alert('只能在相同类型的同层进行复制操作！');
                    return;
                }
            }
            shapes.each(function (row) {
                var refid = row.id().split('_')[0];
                var ref = this.painter.find('#'+refid);
                var pos = _this.painter.transform(row);
                ref.forEach(function (row) {
                    var options = $.extend(true, {}, row.store.model.serialize());
                    if (options.type === 'CanvasPipe'){
                        options.option.points[0].x += 20;
                        options.option.points[1].x += 20;
                        options.option.points[0].y += 20;
                        options.option.points[1].y += 20;
                    } else {
                        options.x = pos.x + 20;
                        options.y = pos.y + 20;
                    }
                    // 将需要添加的图形先放到一个临时数组中，方便后面一次性插入
                    shapeAdded.push(options);
                }, this);
            });
            sessionStorage.setItem('copy' ,JSON.stringify(shapeAdded));
        };

        //////////////
        // Ctrl + V //
        //////////////
        TPointer.prototype.pasteWidgetShapeActionPerformed = function(){
            var addArr = JSON.parse(sessionStorage.getItem('copy'));
            var ids = [];

            if (!addArr) return;
            var activeLayerModel = this.painter.state.activeLayers()[0].store.model;
            var activeLayerType = activeLayerModel.type();
            var addLayerType = this.painter.findLayer(addArr[0].layerId).store.model.type();
            if (addLayerType !== activeLayerType) {
                alert('只能在相同类型的图层间进行复制！');
                return;
            }
            addArr = addArr.map(function(row){
                row._id = ObjectId();
                ids.push(row._id);
                row.layerId = activeLayerModel._id();
                return new NestedModel(row);
            });
                // 一次性加入到页面
            this.painter.store.widgetModelSet.append(addArr);

            // 将当前的选中矩形定位到新增加的图形
            this.painter.setActiveWidgets(ids);

            this.painter.draw();            
        }

        /////////////////////////
        // Delete 删除控件行为 //
        /////////////////////////
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

        // 重置鼠标行为
        TPointer.prototype.resetMouseAction = function () {
            delete this.mouseMoveActionPerformed;
            delete this.mouseUpActionPerformed;
        };
    }();

    window.TPointer = TPointer;
} ());