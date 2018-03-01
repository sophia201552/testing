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

    TPipe.prototype.supportLayerType = 'canvas';

    TPipe.prototype.tpl = '\
<button class="btn-switch" title="管道控件" data-type="pipeCtrl">\
    <span class="glyphicon glyphicon-random"></span>\
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
                }
            }.bind(this);

            this.painter.mouseMoveActionPerformed = this.mouseMoveActionPerformed.bind(this);
        };

        this.mouseDownActionPerformed = function (e) {
            var evt = e.evt;
            var layers = this.painter.state.activeLayers();
            var pos = {};

            if(layers.length > 1 || layers.length === 0 || 
                layers[0].getLayerType() !== this.supportLayerType) {
                // 删除对 move 事件的处理
                alert('无法完成请求，请先选中canvas图层');
                return false;
            }

            pos = this._dealWithShiftKey(evt.shiftKey, previewPoints.slice(0, 2), [evt.layerX, evt.layerY]);

            // 判断是否在连接点上
            if (hotPoint) {
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

            mDownX = evt.layerX;
            mDownY = evt.layerY;

            p = this._dealWithShiftKey(evt.shiftKey, previewPoints.slice(0, 2), [mDownX, mDownY]);
            mDownX = p.x;
            mDownY = p.y;

            if (previewPoints.length > 0) {
                previewPoints.splice(2, 2, mDownX, mDownY);
                this.previewLine.points(previewPoints);
            }

            // 判断是否在连接点上
            hitShape = GUtil.getIntersectionByPointInCanvasLayers(mDownX, mDownY, this.painter.state.activeLayers(), 'Combine');

            if (this.circle) {
                this.circle.destroy();
            }

            if (hitShape) {
                if ( hitShape.hasName('pipe-joint-circle') ) {
                    radius = hitShape.radius();
                    p = this.painter.inverseTransform({x: hitShape.x()-hitShape.offsetX(), y: hitShape.y()-hitShape.offsetY()})

                } else if ( hitShape.hasName('pipe-line') ) {
                    radius = hitShape.strokeWidth()/2;
                    points = hitShape.points();
                    points = this._transformPoints([points[0], points[1], points[2], points[3]], true);
                    p = GUtil.getPointProjectionOnLine(
                        // p1
                        [points[0], points[1]],
                        // p2
                        [points[2], points[3]],
                        [mDownX, mDownY]
                    );
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
            } else {
                hotPoint = null;
            }

            this.layer.draw();
        };

        this.keyDownActionPerformed = function (e) {
            var layers, entity;
            var code = e.keyCode;
            var info;
            var models = [], entity;

            // ESC，取消当前画的管道
            if (code === 32 || code === 27) {
                // 删除对 move 事件的处理
                delete this.painter.keyDownActionPerformed;

                if (code === 32) {
                    layers = this.painter.state.activeLayers();
                    // 管道最少存储 4 个点
                    if (points.length <= 2) return;

                    // 坐标系转换
                    points = this._transformPoints(points);

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
                        entity.layerId = layers[0].id();
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
            }
        };

        this.createEntity = function (points) {
            var entity = {};

            info = GUtil.getPipeRect(points);

            entity.type = 'CanvasPipe';
            entity._id = ObjectId();
            entity.idDs = [];
            entity.option = {
                points: points,
                color: '#4C9CD9',
                width: 8
            };
            return entity;
        };

        this._transformPoints = function (points, inverse) {
            var p;

            inverse = typeof inverse === 'undefined' ? false : inverse;
            for (var i = 0, len = points.length; i < len; i+=2) {
                p = this.painter[inverse ? 'inverseTransform' : 'transform']({
                    x: points[i],
                    y: points[i+1]
                });
                points[i] = p.x;
                points[i+1] = p.y;
            }
            return points;
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