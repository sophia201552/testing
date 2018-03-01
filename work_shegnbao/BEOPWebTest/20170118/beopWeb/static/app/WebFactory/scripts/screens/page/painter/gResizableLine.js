(function (Group) {
    var _this;
    function GResizableLine(shape, layer) {
        Group.call(this, {
            x: 0,
            y: 0,
            name: 'resizable-group',
            draggable: false
        });

        this.resizableShape = null;
        this.anchorStart = null;
        this.anchorEnd = null;

        this.shape = shape;
        this.layer = layer;
        this.painter = this.layer.painter;
        this.circle = undefined;
        _this = this;

        this.init();
    }

    GResizableLine.prototype = Object.create(Group.prototype);
    GResizableLine.prototype.constructor = GResizableLine;

    GResizableLine.prototype.getPainter = function () {
        return this.layer.getPainter();
    };

    GResizableLine.prototype.getTransformedSize = function (size) {
        return size / this.getPainter().getScale();
    };

    GResizableLine.prototype.getShapeRect = function () {
        var posOfShape = this.resizableShape.position();
        var pos = this.position();

        return {
            x: pos.x + posOfShape.x,
            y: pos.y + posOfShape.y,
        };
    };

    GResizableLine.prototype.init = function () {
        this.create();
    };

    GResizableLine.prototype.create = (function () {

        function addAnchor(group, pos, name) {
            var _this = this;
            var ANCHOR_SIZE = this.getTransformedSize(12);

            var anchor = new Konva.Circle({
                name: name,
                stroke: '#666',
                fill: '#ddd',
                strokeWidth: this.getTransformedSize(1),
                radius: ANCHOR_SIZE/2,
                x: pos.x,
                y: pos.y
            });

            group.add(anchor);

            return anchor;
        }

        return function () {
            var group;
            var _this = group = this;
            var id = this.shape.store.model._id();
            var points = this.shape.store.model['option.points']();

            this.resizableShape = new Konva.Line({
                id: id+'_a',
                name: 'resizable-shape',
                x: 0,
                y: 0,
                points: [points[0].x, points[0].y, points[1].x, points[1].y],
                strokeWidth: this.getTransformedSize(4),
                stroke: '#2aabd2'
            });

            group.add(this.resizableShape);
            this.anchorStart = addAnchor.call(this, group, points[0], 'anchor anchor-start');
            this.anchorEnd = addAnchor.call(this, group, points[1], 'anchor anchor-end');

            return group;
        };
    }());

    // anchor 的鼠标事件处理
    // 主要供 TPinter 类调用，所以这里的 this 都指向 TPinter 类对象
    +function () {
        // 鼠标按下时，控件的位置
        var ox, oy;
        // 鼠标按下的位置
        var mDownX, mDownY;
        // 此时活动的 anchor
        var activeAnchor;
        // 此时不活动的 anchor
        var inactiveAnchor;
        //距activeAnchor中心点距离
        var cdx, cdy;
        this._updateAnchor = function (shiftKey) {
            var factor;

            // shift 键拖动逻辑处理
            if (shiftKey) {
                // 判断是 x 方向主导，还是 y 方向主导
                factor = Math.abs(activeAnchor.y() - inactiveAnchor.y()) / Math.abs(activeAnchor.x() - inactiveAnchor.x());
                if (factor > 1) {
                    // y 方向主导
                    activeAnchor.x(inactiveAnchor.x());
                } else {
                    // x 方向主导
                    activeAnchor.y(inactiveAnchor.y());
                }
            }
            // 非 shift 键拖动逻辑处理
            else {
                // 暂时不需要做什么事
            }
        };

        this.onAnchorMouseDownActionPerformed = function (e) {
            var evt = e.evt;

            mDownX = evt.transformedX;
            mDownY = evt.transformedY;

            activeAnchor = e.target;

            ox = activeAnchor.x();
            oy = activeAnchor.y();
            cdx = mDownX - ox;
            cdy = mDownY - oy;
            if (activeAnchor.hasName('anchor-start')) {
                inactiveAnchor = activeAnchor.getParent().anchorEnd;
            } else {
                inactiveAnchor = activeAnchor.getParent().anchorStart;
            }
        };

        this.onResizingShapeActionPerformed = function (e) {
            var evt = e.evt;
            var transformedX = evt.transformedX;
            var transformedY = evt.transformedY;

            var dx = transformedX - mDownX;
            var dy = transformedY - mDownY;

            var group = activeAnchor.getParent();

            var hitShape, targetPipe, points;
            var radius,p;

            if (!activeAnchor) {
                return;
            }

            if (_this.circle) {
                _this.circle.destroy();
                _this.layer.draw();
            }
            //管道吸附
            hitShape = GUtil.getIntersectionByPoint(evt.layerX, evt.layerY, this.painter.getCanvasLayer(), this.painter.getRootLayer(), ['Pipe']);
            if(hitShape){
                targetPipe = GUtil.getIntersectionByPoint(evt.layerX, evt.layerY, this.painter.getCanvasLayer(), this.painter.getRootLayer());
                if (targetPipe.store.model._id() != _this.shape.store.model._id()) {
                    //连接点在线上还是头上区别处理
                    if (hitShape.hasName('pipe-line')) {
                        radius = hitShape.strokeWidth() / 2;
                        points = hitShape.points();
                        p = GUtil.getPointProjectionOnLine(
                            // p1
                            [points[0], points[1]],
                            // p2
                            [points[2], points[3]],
                            [transformedX, transformedY]
                        );
                    }
                    if (hitShape.hasName('pipe-joint-circle')) {
                        radius = hitShape.radius();
                        p = { x: hitShape.x() - hitShape.offsetX(), y: hitShape.y() - hitShape.offsetY() };
                    }
                    
                    _this.circle = new Konva.Circle({
                        name: 'preview-pipe-circle',
                        x: p.x,
                        y: p.y,
                        radius: radius*2,
                        strokeWidth: 2,
                        stroke: '#ff0000'
                    });
                    _this.layer.add(_this.circle);
                    _this.layer.draw();

                    transformedX = p.x;
                    transformedY = p.y;
                        
                    dx = transformedX - mDownX + cdx;
                    dy = transformedY - mDownY + cdy;
                    
                };  
            }
            activeAnchor.position({
                x: ox + dx,
                y: oy + dy
            });

            group._updateAnchor(evt.shiftKey);
            group.resize();
            activeAnchor.getLayer().draw();
        };

        this.onResizeShapeActionPerformed = function (e) {
            var evt = e.evt;
            var transformedX = evt.transformedX;
            var transformedY = evt.transformedY;
            var hitShape, targetPipe, points;
            var radius, p;
            var opt, optPoints, pointsArr, pointsArr2, entity, activeLayers, layerId;
            if (_this.circle) {
                _this.circle.destroy();
                _this.layer.draw();
            }
            //在另一条管道上形成多叉
            hitShape = GUtil.getIntersectionByPoint(evt.layerX, evt.layerY, this.painter.getCanvasLayer(), this.painter.getRootLayer(), ['Pipe']);
            if(hitShape){
                targetPipe = GUtil.getIntersectionByPoint(evt.layerX, evt.layerY, this.painter.getCanvasLayer(), this.painter.getRootLayer());
                if (targetPipe.store.model._id() != _this.shape.store.model._id()) {
                    //连接点在线上还是头上区别处理
                    if (hitShape.hasName('pipe-line')) {
                        radius = hitShape.strokeWidth() / 2;
                        points = hitShape.points();
                        //使点在线中心
                        p = GUtil.getPointProjectionOnLine(
                            // p1
                            [points[0], points[1]],
                            // p2
                            [points[2], points[3]],
                            [transformedX, transformedY]
                        );

                        opt = targetPipe.store.model.option();
                        //获取原线points
                        optPoints = opt.points;
                        //把原线分成两段
                        pointsArr = [optPoints[0]];
                        pointsArr2 = [optPoints[1]];
                        pointsArr.push({ x: p.x, y: p.y });
                        pointsArr2.unshift({ x: p.x, y: p.y });
                        //第一段
                        opt.points = pointsArr;
                        targetPipe.store.model.option(opt, 'points');
                        //第二段
                        entity = (function (points) {
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
                        })(pointsArr2);
                        activeLayers = this.painter.state.activeLayers();
                        layerId;
                        if(activeLayers.length > 0){
                            layerId = activeLayers[0].store.model._id();
                        }
                        entity.layerId = layerId?layerId:'';
                    
                        this.painter.store.widgetModelSet.append([new NestedModel(entity)]);
                               
                    }
                };  
            }
            activeAnchor.getParent().onResizingShapeActionPerformed(e);
            activeAnchor.getParent().resizeShape();

            if (_this.circle) {
                _this.circle.destroy();
                _this.layer.draw();
            }
            // 要注意这里的 this 指向的是哪个对象
            this.resetMouseAction();
        };
    }.call(GResizableLine.prototype);

    GResizableLine.prototype.getShapePosition = function () {
        var points = this.resizableShape.points();
    };

    GResizableLine.prototype.moveShape = function (dx, dy) {
        var pos = this.position();

        this.position({
            x: pos.x + dx,
            y: pos.y + dy
        });
    };

    GResizableLine.prototype.resize = function () {
        var line = this.resizableShape;
        var anchorStart = this.anchorStart;
        var anchorEnd = this.anchorEnd;
        
        line.points([anchorStart.x(), anchorStart.y(), anchorEnd.x(), anchorEnd.y()]);
    };

    GResizableLine.prototype.resizeShape = function () {
        var startPoint = this.anchorStart.position();
        var endPoint = this.anchorEnd.position();
        var gpPos = this.position();

        this.shape.store.model['option.points']([{
            x: startPoint.x + gpPos.x,
            y: startPoint.y + gpPos.y
        }, {
            x: endPoint.x + gpPos.x,
            y: endPoint.y + gpPos.y
        }]);
        this.layer.draw();
    };

    GResizableLine.prototype.destroy = function () {
        Group.prototype.destroy.call(this);
    };

    window.GResizableLine = GResizableLine;
} (Konva.Group));