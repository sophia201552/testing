(function() {
    var _this;

    function TPointer(toolbar, container) {
        TBase.apply(this, arguments);

        this.painter = this.getPainter();
        this.layer = this.painter.interactiveLayer;
        this.previewRect = undefined;
        //粘贴的次数
        this.pasteNum = 0;
        _this = this;
    }

    TPointer.prototype = Object.create(TBase.prototype);

    +

    function() {
        var mDownX, mDownY;
        var mMoveX, mMoveY;

        this.constructor = TPointer;

        this.tpl = '\
<button class="btn-switch" title="箭头工具(v)" data-type="pointerCtrl">\
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0.5 18.5 18 18" width="18px" height="18px">\
        <path stroke="none" d="M3.5,18.5v18l5-7h9L3.5,18.5z"></path>\
    </svg>\
</button>';

        this.settings = {
            // 单位 px
            keyMoveStep: 1
        };

        this.mouseDownActionPerformed = function(e) {
            var evt = e.evt;
            var hitShape, hitShapeParent, model;
            var layerX = evt.layerX,
                layerY = evt.layerY;
            var activeWidgets = this.painter.state.activeWidgets();
            var idx;

            mDownX = mMoveX = evt.transformedX;
            mDownY = mMoveY = evt.transformedY;

            hitShape = GUtil.getIntersection(layerX, layerY, this.layer);
            // 是否有 hit 到可编辑矩形
            if (hitShape && hitShape.hasName('anchor')) {
                hitShapeParent = hitShape.getParent();
                e.target = hitShape;
                hitShapeParent.onAnchorMouseDownActionPerformed(e);
                this.mouseMoveActionPerformed = hitShapeParent.onResizingShapeActionPerformed;
                this.mouseUpActionPerformed = hitShapeParent.onResizeShapeActionPerformed;
                return;
            }

            hitShape = GUtil.getIntersectionByPoint(layerX, layerY, this.painter.getCanvasLayer(), this.painter.getRootLayer());

            if (hitShape) {
                // 如果 hitShape 是组合控件的一部分，则根据当前是否是场景模式，进行不同的操作
                // 如果不是场景模式，则定位到 hitShape 的 group 对应的控件
                model = hitShape.store.model;
                if (!this.painter.isSceneMode) {
                    if (model.groupId) {
                        hitShape = this.painter.find('#' + model.groupId())[0];
                    }
                } else if (model.type() === 'CanvasDevice') {
                    return;
                }

                // 注册鼠标行为 - 拖拽行为
                this.mouseMoveActionPerformed = this.dragShapeActionPerformed;
                this.mouseUpActionPerformed = this.dropShapeActionPerformed;
                if (evt.ctrlKey) {
                    // 复制数组
                    activeWidgets = activeWidgets.slice();
                    if ((idx = activeWidgets.indexOf(hitShape)) > -1) {
                        // 已经存在则去掉
                        activeWidgets.splice(idx, 1);
                    } else {
                        // 不存在则加上
                        activeWidgets.push(hitShape);
                    }
                    // ctrl 连选
                    this.painter.setActiveWidgets(activeWidgets);
                } else if (activeWidgets.indexOf(hitShape) === -1) {
                    // 单选
                    this.painter.setActiveWidgets(hitShape);
                    this.painter.setActiveLayers();
                }
            } else {
                // 清除可编辑矩形
                this.painter.setActiveWidgets();
                // 注册鼠标行为 - 框选行为
                this.mouseMoveActionPerformed = this.selectingAreaActionPerformed;
                this.mouseUpActionPerformed = this.selectedAreaActionPerformed;

                // 处理某些特殊情况下，预览框没有消失的问题
                if (this.previewRect) {
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
        this.dragShapeActionPerformed = function(e) {
            var evt = e.evt;
            var dx = evt.transformedX - mMoveX;
            var dy = evt.transformedY - mMoveY;
            mMoveX = evt.transformedX;
            mMoveY = evt.transformedY;
            this.layer.find('.resizable-group').each(function(row, i) {
                row.moveShape(dx, dy);
            });

            this.layer.draw();
        };

        this.dropShapeActionPerformed = function(e) {;
            var _this = this;
            
            var evt = typeof e === 'object' ? e.evt : {};
            var shapes = this.layer.find('.resizable-group');
            var isAdsorptive = true;

            if (e === false) {
                isAdsorptive = false;
            }
            // 移动距离小于2，则不做操作
            else if (Math.abs(evt.transformedX - mDownX) < 2 && Math.abs(evt.transformedY - mDownY) < 2) {
                return;
            }

            if (evt && evt.ctrlKey) {
                this.copyShapeActionPerformed(e);
            } else {
                //热力图组合控件  先选中选区再选中标记拖拽 标记不移动bug暂时解决
                var newShapes = shapes.slice();
                for (var i = 0, len = shapes.length; i < len; i++) {
                    if (shapes[i].shapeType && shapes[i].shapeType == 'CanvasHeatP') {
                        newShapes.unshift(newShapes.splice(i, 1)[0]);
                    }
                }
                this.painter.batchDraw(function(){
                    newShapes.forEach(function(shape) {
                        shape.resizeShape(isAdsorptive);
                    });
                });

                this.resetMouseAction();
            }
        };

        //////////////
        // 框选行为 //
        //////////////
        this.selectingAreaActionPerformed = function(e) {
            var evt = e.evt;

            var startX, endX, startY, endY;

            if (mDownX <= evt.transformedX) {
                startX = mDownX;
                endX = evt.transformedX;
            } else {
                startX = evt.transformedX;
                endX = mDownX;
            }

            if (mDownY <= evt.transformedY) {
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

        this.selectedAreaActionPerformed = function(e) {
            var hitShapes = [];
            var r = this.previewRect;
            var rw = r.width(),
                rh = r.height();
            var pos = r.position();
            // 屏蔽一些多余操作
            if (rw < 10 && rh < 10) {
                hitShapes = [];
            } else {
                hitShapes = GUtil.getIntersectionByRect(pos.x, pos.y, rw, rh,
                    this.painter.getRootLayer());
            }

            // 如果是在场景模式中，则将一些禁止选中的控件进行剔除
            if (this.painter.isSceneMode) {
                hitShapes = hitShapes.filter(function(row) {
                    return row.store.model.type() !== 'CanvasDevice';
                });
            }
            // 如果不在场景模式中，将所有组合控件的子控件屏蔽掉
            else {
                hitShapes = hitShapes.filter(function(row) {
                    return !row.store.model.groupId;
                });
            }

            if (hitShapes.length) {
                // 凸显所有选中的图形
                this.painter.setActiveWidgets(hitShapes);
            }

            if (this.previewRect) {
                this.previewRect.destroy();
                this.previewRect = undefined;
            }
            this.layer.draw();
            this.resetMouseAction();
        };

        this.keyDownActionPerformed = function(e) {
            var handler = null,
                code = e.keyCode;
            var step = this.settings.keyMoveStep;
            var shapes;
            // 监控箭头按键(37~40)事件、Delete按键(46)事件
            // 67(Ctrl) 86(v) 8(Backspace)
            if ([37, 38, 39, 40, 46, 67, 86, 8, 27].indexOf(code) === -1) return;
            //ctrl+v
            if (e.ctrlKey && code == 86) {
                this.pasteNum = this.pasteNum + 1;
                this.pasteWidgetShapeActionPerformed();
            }
            shapes = this.layer.find('.resizable-group');

            // 没有选中的元素，不进行任何操作
            if (shapes.length === 0) return;
            //ctrl+c
            if (e.ctrlKey && code == 67) {
                this.pasteNum = 0;
                this.copyWidgetShapeActionPerformed();
                return;
            }

            if (code === 46 || code === 8) {
                e.preventDefault();
                this.removeShapes();
                return;
            }
            if (code === 27) {
                this.painter.setActiveWidgets()
                return;
            }
            switch (code) {
                // left
                case 37:
                    handler = function(row) { row.x(row.x() - step); };
                    break;
                    // top
                case 38:
                    handler = function(row) { row.y(row.y() - step); };
                    break;
                    // right
                case 39:
                    handler = function(row) { row.x(row.x() + step); };
                    break;
                    // bottom
                case 40:
                    handler = function(row) { row.y(row.y() + step); };
                    break;
                default:
                    return;
            }

            shapes.each(handler);
            this.layer.draw();
        };

        //////////////
        // 按键行为 //
        //////////////
        this.keyUpActionPerformed = function(e) {
            // 只监控四个箭头事件
            if ([37, 38, 39, 40].indexOf(e.keyCode) === -1) return;

            this.dropShapeActionPerformed(false);
        };

        //////////////////
        // 拖拽复制行为 //
        //////////////////
        this.copyShapeActionPerformed = function(e) {
            var _this = this;
            var evt = e.evt;
            var shapes = this.layer.find('.resizable-shape');
            var shapeAdded = [],
                shapeAddedIds = [];
            var eDownX = evt.transformedX - mDownX; //结束时距离减去开始的距离除以比例
            var eDownY = evt.transformedY - mDownY;
            var layerX = evt.layerX,
                layerY = evt.layerY;

            if (!shapes.length) {
                return;
            }
            var changeIdArr = getHeatChangeIdArr(shapes);
            shapes.each(function(row) {
                var refid = row.id().split('_')[0];
                var ref = _this.painter.find('#' + refid);
                var pos = row.getParent().getShapeRect();

                ref.forEach(function(row) {
                    var model = row.store.model;
                    var options;
                    var id;

                    // 由于控件组的复制，需要将组内的元素一并复制，所以这里需要做一下支持
                    if (model.type() === 'CanvasDevice') {
                        options = row.getCloneModels({
                            x: pos.x,
                            y: pos.y,
                            dx: eDownX,
                            dy: eDownY
                        });
                        id = options.id;
                        shapeAdded = shapeAdded.concat(options.list);
                    } else {
                        id = ObjectId();
                        options = $.extend(true, {}, model.serialize());
                        //更换Id
                        id = changeId(options, id, changeIdArr);

                        // 管道需要特殊处理
                        if (options.type === 'CanvasPipe' || options.type === 'CanvasCustomLine') {
                            options.option.points[0].x += eDownX;
                            options.option.points[1].x += eDownX;
                            options.option.points[0].y += eDownY;
                            options.option.points[1].y += eDownY;
                        } else if (options.type === 'CanvasHeat' || options.type === 'CanvasPolygon') {
                            for (var i = 0, len = options.option.points.length; i < len; i += 2) {
                                options.option.points[i] += eDownX;
                                options.option.points[i + 1] += eDownY;
                            }
                        } else {
                            options.x = pos.x;
                            options.y = pos.y;
                        }
                        // 将需要添加的图形先放到一个临时数组中，方便后面一次性插入
                        shapeAdded.push(new NestedModel(options));
                    }
                    shapeAddedIds.push(id);
                }, this);
            });

            //热力图选区和标记位置互换
            shapeAdded = changeHeatIndex(shapeAdded);
            // 一次性加入到页面
            this.painter.batchDraw(function(){
                this.painter.store.widgetModelSet.append(shapeAdded);
                // 将当前的选中矩形定位到新增加的图形
                shapeAddedIds.reverse();
                this.painter.setActiveWidgets(shapeAddedIds);
            }.bind(this));
        };

        ////////////
        // Ctrl+C //
        ////////////
        this.copyWidgetShapeActionPerformed = function(e) {
            var _this = this;
            var shapeAdded = [];
            var shapes = this.layer.find('.resizable-shape');
            var scale = this.painter.scale;
            var activeLayers = this.painter.state.activeLayers();
            for (var i = 0, len = activeLayers.length - 1; i < len; i++) {
                if (activeLayers[i].store.model.type() !== activeLayers[i + 1].store.model.type()) {
                    alert('只能在相同类型的同层进行复制操作！');
                    return;
                }
            }
            //热力图选区与标记相互村着id 所以一起改变
            var changeIdArr = getHeatChangeIdArr(shapes);
            shapes.each(function(row) {
                var refid = row.id().split('_')[0];
                var ref = _this.painter.find('#' + refid);
                var pos = _this.painter.transform(row);

                ref.forEach(function(row) {
                    var model = row.store.model;
                    var options;
                    var id;

                    // 由于控件组的复制，需要将组内的元素一并复制，所以这里需要做一下支持
                    if (model.type() === 'CanvasDevice') {
                        options = row.getCloneModels({
                            x: pos.x + 20,
                            y: pos.y + 20,
                            dx: 20,
                            dy: 20
                        });
                        id = options.id;
                        shapeAdded = shapeAdded.concat(options.list.map(function(row) { return row.serialize(); }));
                    } else {
                        id = ObjectId();
                        options = $.extend(true, {}, model.serialize());

                        changeId(options, id, changeIdArr);
                        // 管道和热力图选区需要特殊处理
                        if (options.type === 'CanvasPipe' || options.type === 'CanvasCustomLine') {
                            options.option.points[0].x += 20;
                            options.option.points[1].x += 20;
                            options.option.points[0].y += 20;
                            options.option.points[1].y += 20;
                        } else if (options.type === 'CanvasHeat' || options.type === 'CanvasPolygon') {
                            for (var i = 0, len = options.option.points.length; i < len; i++) {
                                options.option.points[i] += 20;
                            }
                        } else {
                            options.x = pos.x += 20;
                            options.y = pos.y += 20;
                        }
                        // 将需要添加的图形先放到一个临时数组中，方便后面一次性插入
                        shapeAdded.push(options);
                    }
                }, this);
            });
            //热力图选区和标记位置互换
            shapeAdded = changeHeatIndex(shapeAdded);

            sessionStorage.setItem('copy', JSON.stringify(shapeAdded));
        };

        //////////////
        // Ctrl + V //
        //////////////
        this.pasteWidgetShapeActionPerformed = function() {
            var _this = this;
            var addArr = JSON.parse(sessionStorage.getItem('copy'));

            for (var i = 0, len = addArr.length; i < len; i++) {
                addArr[i].pageId = this.screen.page.id;
                if (addArr[i].type === 'CanvasPipe' || addArr[i].type === 'CanvasCustomLine') {
                    addArr[i].option.points[0].x = addArr[i].option.points[0].x + 20 * (this.pasteNum - 1);
                    addArr[i].option.points[0].y = addArr[i].option.points[0].y + 20 * (this.pasteNum - 1);
                    addArr[i].option.points[1].x = addArr[i].option.points[1].x + 20 * (this.pasteNum - 1);
                    addArr[i].option.points[1].y = addArr[i].option.points[1].y + 20 * (this.pasteNum - 1);
                } else if (addArr[i].type === 'CanvasHeat' || addArr[i].type === 'CanvasPolygon') {
                    for (var l = 0, leng = addArr[i].option.points.length; l < leng; l++) {
                        addArr[i].option.points[l] += 20 * (this.pasteNum - 1);
                    }

                } else {
                    addArr[i].x = addArr[i].x + 20 * (this.pasteNum - 1);
                    addArr[i].y = addArr[i].y + 20 * (this.pasteNum - 1);
                }
            }
            var ids = [];
            var exchangeGroupIdMap = {};

            if (!addArr || !addArr.length) return;

            //热力图选区与标记相互村着id 所以一起改变
            var changeIdArr = [];
            addArr.map(function(row) {
                if (row.type === 'CanvasHeatP' || row.type === 'CanvasHeat') {
                    var newId = ObjectId();
                    changeIdArr.push([row._id, newId]);
                }
            });
            addArr.map(function(row) {
                if (row.type === 'CanvasHeat') {
                    for (var i = 0, len = changeIdArr.length; i < len; i++) {
                        if (row.option.tempPointId === changeIdArr[i][0]) {
                            row.option.tempPointId = changeIdArr[i][1];
                        }
                        if (row._id === changeIdArr[i][0]) {
                            row._id = changeIdArr[i][1];
                        }
                    }
                } else if (row.type === 'CanvasHeatP') {
                    for (var i = 0, len = changeIdArr.length; i < len; i++) {
                        if (row.option.polygonId === changeIdArr[i][0]) {
                            row.option.polygonId = changeIdArr[i][1];
                        }
                        if (row._id === changeIdArr[i][0]) {
                            row._id = changeIdArr[i][1];
                        }
                    }
                }
            });
            addArr = addArr.map(function(row) {
                var id = ObjectId();
                var groupId;

                if (row.type === 'CanvasDevice') {
                    exchangeGroupIdMap[row._id] = id;
                }
                if (row.type !== 'CanvasHeatP' && row.type !== 'CanvasHeat') {
                    row._id = id;
                }

                if (row.groupId) {
                    groupId = row.groupId;
                    if (exchangeGroupIdMap[groupId]) {
                        row.groupId = exchangeGroupIdMap[groupId];
                    }
                    if (row.type.indexOf('Html') !== 0) {
                        row.layerId = '';
                    }
                } else {
                    var activeLayers = _this.painter.state.activeLayers(),
                        activeWidgets = _this.painter.state.activeWidgets();
                    var selectedLayers = activeWidgets.map(function(activeWidget){return activeWidget.store.model.layerId()});
                    if (activeLayers.length > 0) {
                        row.layerId = activeLayers[0].store.model._id();
                    } else if(selectedLayers.length==1) {
                        row.layerId = selectedLayers[0];
                    } else {
                        // 判断 row.layerId 是否存在于当前的画布中
                        if (row.layerId) {
                            var result = _this.painter.findByCondition({
                                ids: [row.layerId],
                                type: 'Layer'
                            });
                            if (!result || !result.length) {
                                row.layerId = '';
                            }
                        }
                    }
                    ids.push(row._id);
                }
                return new NestedModel(row);
            });
            // 一次性加入到页面
            this.painter.batchDraw(function(){
                this.painter.store.widgetModelSet.append(addArr);
                // 将当前的选中矩形定位到新增加的图形
                //解决热力图粘贴后拖拽bug
                ids.reverse();
                this.painter.setActiveWidgets(ids);
            }.bind(this));
        }

        /////////////////////////
        // Delete 删除控件行为 //
        /////////////////////////
        this.removeShapes = function() {
            var _this = this;
            var shapes = this.layer.find('.resizable-shape');
            var layerLen = this.screen.layerPanel.treeObj.getSelectedNodes();
            this.painter.batchDraw(function(){
                shapes.each(function(row) {
                    var refid = row.id().split('_')[0];
                    var ref = _this.painter.find('#' + refid);

                    ref.forEach(function(row) {
                        var layer = row.getLayer();
                        var model = _this.painter.store.widgetModelSet.findByProperty('_id', refid);

                        if (model !== null) {
                            var type = model.type();
                            //删除热力图选区时删除标记
                            if (type === 'CanvasHeat') {
                                var tempPointId = model['option.tempPointId']();
                                var tempPoint = _this.painter.store.widgetModelSet.findByProperty('_id', tempPointId);
                                tempPoint && _this.painter.store.widgetModelSet.remove(tempPoint);
                            }
                            //删除热力图标记时更新选区
                            if (type === 'CanvasHeatP') {
                                var polygonId = model['option.polygonId']();
                                var polygon = _this.painter.store.widgetModelSet.findByProperty('_id', polygonId);
                                if (polygon) {
                                    polygon['option.tempPointNum'](Math.max(polygon['option.tempPointNum']() - 1, 0));
                                    polygon['option.tempPointArr']([]);
                                    polygon['option.tempPointId']('');
                                }
                            }
                            _this.painter.store.widgetModelSet.remove(model);
                        }
                    }, this);
                });
                layerLen.forEach(function(row) {
                    var rowParent = row.getParentNode();
                    if (rowParent && rowParent.children && rowParent.children.length == 0) {
                        $('#' + rowParent.tId + '_switch').removeClass('noline_docu').addClass('noline_close');
                        $('#' + rowParent.tId + '_ico').removeClass('ico_docu').addClass('ico_close');
                    }
                })

                this.painter.setActiveWidgets();
            }.bind(this));
        };

        // 重置鼠标行为
        this.resetMouseAction = function() {
            delete this.mouseMoveActionPerformed;
            delete this.mouseUpActionPerformed;
        };

        //////////////////////
        // 双击控件事件处理 //
        //////////////////////
        /** @override */
        this.dblclickActionPerformed = function(e) {
            var evt = e.evt;
            var layerX = evt.layerX,
                layerY = evt.layerY;
            var shape = GUtil.getIntersection(layerX, layerY, this.layer);
            var painter = this.painter;
            var id, widget;

            if (!shape) {
                return;
            }

            id = shape.id();
            // 没有点击到任何东西，直接返回，不需要做任何事
            if (!id || id === '__previewRect') {
                return;
            }

            widget = painter.find('#' + id.split('_')[0])[0];
            if (!widget) return;

            //文本控件的双击事件（实现可编辑）
            if (widget.store.model.type() === 'HtmlText' || widget.store.model.type() === 'HtmlButton') {
                EditorModal.show(widget.store.model.option().text, true, function(newContent) {
                    var opt = widget.store.model.option();
                    opt.text = newContent;
                    widget.store.model.option(opt, 'text');
                });
            } else if (widget.store.model.type() === "HtmlContainer") {
                //html双击事件
                var widgetTpl = widget.store.model.widgetTpl ? widget.store.model.widgetTpl() : undefined;
                if (widgetTpl) {
                    var config = $.extend(true, {}, widgetTpl.config);
                    config.data = {
                        tpl: {
                            config: $.extend(true, {}, widgetTpl.config),
                            tplJs: widgetTpl.tplJs
                        },
                        entity: widget.store.model,
                        painter: widget.painter
                    };
                    (!ConfigTplModal.configPlugin) && ConfigTplModal.initConfigPlugin();
                    ConfigTplModal.configPlugin.setOption(config).init().show();
                } else {
                    CodeEditorModal.show(widget.store.model.option(), function(code) {
                        widget.store.model.option($.extend(false, {}, widget.store.model.option(), {
                            'html': code.html,
                            'css': code.css,
                            'js': code.js
                        }));
                    });
                }
            } else if (widget.store.model.type() === 'CanvasImage') {
                //图片控件的双击事件
                $('#btnChooseImg').trigger('click');
            } else if (widget.store.model.type() === 'HtmlDashboard') {
                widget.showConfigModal();
            } else if (widget.store.model.type() === 'CanvasText') {
                $('#propertyList').find(' .btnEditTxt').trigger('click');
            }
        };

        function getHeatChangeIdArr(shapes) {
            var changeIdArr = [];
            shapes.each(function(row) {
                var refid = row.id().split('_')[0];
                var ref = _this.painter.find('#' + refid);

                ref.forEach(function(row) {
                    var model = row.store.model;
                    var options = $.extend(true, {}, model.serialize());
                    var newId = ObjectId();
                    if (options.type === 'CanvasHeat' || options.type === 'CanvasHeatP') {
                        changeIdArr.push([options._id, newId]);
                    }
                })
            });
            return changeIdArr;
        }

        function changeId(options, id, changeIdArr) {
            if (options.type === 'CanvasHeat') {
                var hasTempPointId = false;
                for (var i = 0, len = changeIdArr.length; i < len; i++) {
                    if (options.option.tempPointId === changeIdArr[i][0]) {
                        options.option.tempPointId = changeIdArr[i][1];
                        hasTempPointId = true;
                    }
                    if (options._id === changeIdArr[i][0]) {
                        options._id = changeIdArr[i][1];
                    }
                }
                //只复制选区
                if (!hasTempPointId) {
                    options.option.tempPointId = '';
                    options.option.tempPointArr = [];
                    options.option.tempPointNum = Math.max(options.option.tempPointNum - 1, 0);
                }
            } else if (options.type === 'CanvasHeatP') {
                var hasPolygonId = false;
                for (var i = 0, len = changeIdArr.length; i < len; i++) {
                    if (options.option.polygonId === changeIdArr[i][0]) {
                        options.option.polygonId = changeIdArr[i][1];
                        hasPolygonId = true;
                    }
                    if (options._id === changeIdArr[i][0]) {
                        options._id = changeIdArr[i][1];
                    }
                }
                //只复制标记
                !hasPolygonId && (options.option.polygonId = '');
            } else {
                options._id = id;
            }
            return options._id;
        }

        function changeHeatIndex(shapeAdded) {
            var newShapeAdded = $.deepClone(shapeAdded);
            if (typeof shapeAdded[0].type == 'function') {
                for (var i = 1, len = shapeAdded.length; i < len; i++) {
                    if (shapeAdded[i].type() === 'CanvasHeat') {
                        var tempPointId = shapeAdded[i].option().tempPointId;
                        var index = shapeAdded.findIndex((v) => v._id() === tempPointId);
                        if (index > -1) {
                            newShapeAdded.splice(i, 1, shapeAdded[index]);
                            newShapeAdded.splice(index, 1, shapeAdded[i]);
                        }
                    }
                }
            } else {
                for (var i = 1, len = shapeAdded.length; i < len; i++) {
                    if (shapeAdded[i].type === 'CanvasHeat') {
                        var tempPointId = shapeAdded[i].option.tempPointId;
                        var index = shapeAdded.findIndex((v) => v._id === tempPointId);
                        if (index > -1) {
                            newShapeAdded.splice(i, 1, shapeAdded[index]);
                            newShapeAdded.splice(index, 1, shapeAdded[i]);
                        }
                    }
                }
            }

            return newShapeAdded;
        }
    }.call(TPointer.prototype);

    window.TPointer = TPointer;
}());