(function () {

    function TPipe(toolbar, container) {
        TBase.apply(this, arguments);

        this.layer = this.painter.interactiveLayer;
        // 分成两段，方便以后做变化
        this.line = null;
        this.previewLine = null;
    }

    TPipe.prototype = Object.create(TBase.prototype);
    TPipe.prototype.constructor = TPipe;

    TPipe.prototype.supportLayerType = 'canvas';

    TPipe.prototype.tpl = '\
<button title="管道控件">\
    <span class="glyphicon glyphicon-random"></span>\
</button>';
    
    void function () {

        var mDownX, mDownY;
        var points = [];
        var previewPoints = [];

        this.setSceneMode = function () {
            this.painter.mouseDownActionPerformed = function(e) {
                var rs = this.mouseDownActionPerformed(e);

                // 没有返回值，或返回值不为 false，则绑定下一步的操作
                if (rs !== false) {
                    this.painter.mouseMoveActionPerformed = this.mouseMoveActionPerformed.bind(this);
                    this.painter.keyDownActionPerformed = this.keyDownActionPerformed.bind(this);
                }
            }.bind(this);
        };

        this.mouseDownActionPerformed = function (e) {
            var evt = e.evt;
            var layers = this.painter.state.activeLayers();
            var pos = {};

            if(layers.length > 1 || layers.length === 0 || 
                layers[0].getLayerType() !== this.supportLayerType) {
                // 删除对 move 事件的处理
                alert('无法完成请求，因为没有选中图层');
                return false;
            }

            pos = this._dealWithShiftKey(evt.shiftKey, previewPoints.slice(0, 2), [evt.layerX, evt.layerY]);
            
            mDownX = pos.x;
            mDownY = pos.y;

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
            var p = {};

            mDownX = evt.layerX;
            mDownY = evt.layerY;

            p = this._dealWithShiftKey(evt.shiftKey, previewPoints.slice(0, 2), [mDownX, mDownY]);

            previewPoints.splice(2, 2, p.x, p.y);
            this.previewLine.points(previewPoints);
            this.layer.draw();
        };

        this.keyDownActionPerformed = function (e) {
            var layers, entity;
            var code = e.keyCode;
            var info;

            // ESC，取消当前画的管道
            if (code === 32 || code === 27) {
                // 删除对 move 事件的处理
                delete this.painter.mouseMoveActionPerformed;
                delete this.painter.keyDownActionPerformed;

                if (code === 32) {
                    layers = this.painter.state.activeLayers();
                    // 管道最少存储两个点
                    if (points.length <= 2) return;

                    // 坐标系转换
                    points = this._transformPoints(points);
                    info = GUtil.getPipeRect(points);

                    entity = {};
                    entity.type = 'CanvasPipe';
                    entity._id = ObjectId();
                    entity.layerId = layers[0].id();
                    entity.idDs = [];
                    entity.x = info.xMin;
                    entity.y = info.yMin;
                    entity.w = info.w;
                    entity.h = info.h;
                    entity.option = {
                        points: points
                    };
                    this.painter.store.widgetModelSet.append(new NestedModel(entity));
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

        this._transformPoints = function (points) {
            var p;
            for (var i = 0, len = points.length; i < len; i+=2) {
                p = this.painter.transform({
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

    TPipe.prototype.close = function () {  };

    window.TPipe = TPipe;
} ());