(function () {

    function TPipe(toolbar, container) {
        TBase.apply(this, arguments);

        this.layer = this.painter.interactiveLayer;
        // 分成两段，方便以后做变化
        this.line = null;
        this.previewLine = null;
        // 自动吸附功能的指示图形
        this.circle = null;
    }

    TPipe.prototype = Object.create(TBase.prototype);
    TPipe.prototype.constructor = TPipe;

    TPipe.prototype.option = {
        cursor: 'crosshair'
    };
    TPipe.prototype.supportLayerType = 'canvas';

    TPipe.prototype.tpl = '\
<button class="btn-switch" title="管道控件(p)" data-type="pipeCtrl">\
    <span class = "iconfont icon-guandaokongjian"></span>\
</button>';
    
    void function () {

        var mDownX, mDownY;
        var points = [];
        var previewPoints = [];
        var hotPoint = null;


        this.setSceneMode = function () {
            this.painter.mouseDownActionPerformed = function(e) {
                var rs = this.mouseDownActionPerformed(e);

                // 没有返回值，或返回值不为 false，则绑定下一步的操作
                if (rs !== false) {
                    this.painter.keyDownActionPerformed = this.keyDownActionPerformed.bind(this);
                    this.painter.customCtrlZKeyUpActionPerformed = this.keyUpActionPerformed.bind(this);
                }
            }.bind(this);

            this.painter.mouseMoveActionPerformed = this.mouseMoveActionPerformed.bind(this);
        };

        this.mouseDownActionPerformed = function (e) {
            var evt = e.evt;
            var layer = this.painter.state.activeLayers()[0];
            var pos = {};
            var targetPipe,hitShape;
            var opt, optPoints, pointsArr, pointsArr2, activeLayers, layerId;
            pos = this._dealWithShiftKey(evt.shiftKey, previewPoints.slice(0, 2), [evt.transformedX, evt.transformedY]);

            // 判断是否在连接点上
            if (hotPoint) {
                hitShape = GUtil.getIntersectionByPoint(evt.layerX, evt.layerY, this.painter.getCanvasLayer(), this.painter.getRootLayer(), ['Pipe']);
                if (hitShape && hitShape.hasName('pipe-line')) {
                    this.painter.setActiveWidgets();
                    targetPipe = GUtil.getIntersectionByPoint(evt.layerX, evt.layerY, this.painter.getCanvasLayer(), this.painter.getRootLayer());
                    opt = targetPipe.store.model.option();
                    //获取原线points
                    optPoints = opt.points;
                    //把原线分成两段
                    pointsArr = [optPoints[0]];
                    pointsArr2 = [optPoints[1]];
                    pointsArr.push({ x: hotPoint.x, y: hotPoint.y });
                    pointsArr2.unshift({ x: hotPoint.x, y: hotPoint.y });
                    //第一段
                    opt.points = pointsArr;
                    targetPipe.store.model.option(opt, 'points');
                    //第二段
                    entity = this.createEntity(pointsArr2);
                    activeLayers = this.painter.state.activeLayers();
                    layerId;
                    if(activeLayers.length > 0){
                        layerId = activeLayers[0].store.model._id();
                    }
                    entity.layerId = layerId?layerId:'';
                    
                    this.painter.store.widgetModelSet.append([new NestedModel(entity)]);
                }
                mDownX = hotPoint.x;
                mDownY = hotPoint.y;
            } else {
                mDownX = pos.x;
                mDownY = pos.y;
            }

            points.push(mDownX);
            points.push(mDownY);

            previewPoints = [mDownX, mDownY];

            if (!this.line) {
                this.line = new Konva.Line({
                    points: points,
                    stroke: '#2780C4',
                    strokeWidth: 2,
                    lineJoin: 'round',
                    dash: [2, 2]
                });
                this.layer.add(this.line);
            } else {
                this.line.points(points);
            }
    
            if (!this.previewLine) {
                this.previewLine = new Konva.Line({
                    points: previewPoints,
                    stroke: '#2780C4',
                    strokeWidth: 2
                });
                this.layer.add(this.previewLine);
            } else {
                this.previewLine.points(previewPoints);
            }

            this.layer.draw();
        };

        this.mouseMoveActionPerformed = function (e) {
            var evt = e.evt;
            var len = previewPoints.length;
            var radius;
            var p = {};
            var points;
            var hitShape;

            mDownX = evt.transformedX;
            mDownY = evt.transformedY;

            p = this._dealWithShiftKey(evt.shiftKey, previewPoints.slice(0, 2), [mDownX, mDownY]);
            mDownX = p.x;
            mDownY = p.y;

            if (previewPoints.length > 0) {
                previewPoints.splice(2, 2, mDownX, mDownY);
                this.previewLine.points(previewPoints);
            }

            // 判断是否在连接点上
            hitShape = GUtil.getIntersectionByPoint(evt.layerX, evt.layerY, this.painter.getCanvasLayer(), this.painter.getRootLayer(), ['Pipe']);

            if (this.circle) {
                this.circle.destroy();
            }

            if (!hitShape || 
                !(hitShape.hasName('pipe-joint-circle') || hitShape.hasName('pipe-line')) ) {
                hotPoint = null;
            } else {
                if ( hitShape.hasName('pipe-joint-circle') ) {
                    radius = hitShape.radius();
                    p = { x: hitShape.x() - hitShape.offsetX(), y: hitShape.y() - hitShape.offsetY() };

                } else if ( hitShape.hasName('pipe-line') ) {
                    radius = hitShape.strokeWidth() / 2;
                    points = hitShape.points();
                    p = GUtil.getPointProjectionOnLine(
                        // p1
                        [points[0], points[1]],
                        // p2
                        [points[2], points[3]],
                        [mDownX, mDownY]
                    );
                } else {
                    hotPoint = null;
                    this.layer.draw();
                    return;
                }
                
                // 显示吸附图形
                this.circle = new Konva.Circle({
                    name: 'preview-pipe-circle',
                    x: p.x,
                    y: p.y,
                    radius: radius,
                    strokeWidth: 2,
                    stroke: '#ff0000'
                });
                hotPoint = {
                    x: p.x,
                    y: p.y
                };
                this.layer.add(this.circle);
            }
            this.layer.draw();
        };

        this.keyDownActionPerformed = function (e) {
            var entity;
            var code = e.keyCode;
            var models = [], entity;

            // ESC，取消当前画的管道
            if (code === 32 || code === 27) {
                // 删除对 move 事件的处理
                delete this.painter.keyDownActionPerformed;

                if (code === 32) {
                    // 管道最少存储 4 个点
                    if (points.length <= 2) return;

                    // 生成分段管道
                    for (var i = 0, len = points.length-2, p; i < len; i += 2) {
                        p = [{
                            x: points[i],
                            y: points[i+1],
                        }, {
                            x: points[i+2],
                            y: points[i+3],
                        }];

                        entity = this.createEntity(p);
                        var activeLayers = this.painter.state.activeLayers();
                        var layerId;
                        if(activeLayers.length > 0){
                            layerId = activeLayers[0].store.model._id();
                        }
                        entity.layerId = layerId?layerId:'';
                        models.push( new NestedModel(entity) );
                    }
                    this.painter.store.widgetModelSet.append(models);
                    // 切换到箭头工具
                    this.toolbar.switchTool('TPointer');
                }

                this.line.destroy();
                this.previewLine.destroy();

                this.line = null;
                this.previewLine = null;
                points = [];
                previewPoints = [];
                xMin = 99999;
                yMin = 99999;
                xMax = 0;
                yMax = 0;

                this.layer.draw();

                delete this.painter.customCtrlZKeyUpActionPerformed;
            }
        };

        this.keyUpActionPerformed = function (e) {
            var which = e.which;
            if (!e.ctrlKey) return;
            // ctrl+z
            if(which === 90){
                var pointsLen = points.length-2;
                if(pointsLen - 2 < 0){
                    return;
                }else{
                    points.splice(pointsLen,2);
                    previewPoints = points.slice(pointsLen - 2);
                    this.line.points(points);
                    this.previewLine.points(previewPoints);
                    this.layer.draw();
                }
            }
        }

        this.createEntity = function (points) {
            var entity = {};
            entity.x = 0;
            entity.y = 0;
            entity.w = 0;
            entity.h = 0;
            entity.type = 'CanvasPipe';
            entity._id = ObjectId();
            entity.idDs = [];
            entity.option = {
                points: points,
                color: '#4C9CD9',
                width: 8,
                direction: 0,
                preview:[],
                logic: 0
            };
            return entity;
        };

        this._dealWithShiftKey = function (shiftKey, lastPos, cursorPos) {
            if (shiftKey && lastPos.length) {
                if (Math.abs(lastPos[0] - cursorPos[0]) < Math.abs(lastPos[1] - cursorPos[1])) {
                    return {
                        x: lastPos[0],
                        y: cursorPos[1]
                    };
                } else {
                    return {
                        x: cursorPos[0],
                        y: lastPos[1]
                    };
                }
            } else {
                return {
                    x: cursorPos[0],
                    y: cursorPos[1]
                };
            }
        };

    }.call(TPipe.prototype);

    window.TPipe = TPipe;
} ());