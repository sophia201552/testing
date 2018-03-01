(function () {

    function TPipeEdit(toolbar, container) {
        TBase.apply(this, arguments);

        this.layer = this.painter.interactiveLayer;

        this.previewLine = null;
        this.previewCircle = null;
    }

    TPipeEdit.prototype = Object.create(TBase.prototype);
    TPipeEdit.prototype.constructor = TPipeEdit;

    TPipeEdit.prototype.tpl = '\
<button class="btn-switch" title="管道编辑工具" data-type="pipeEditCtrl">\
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0.5 18.5 18 18" width="18px" height="18px">\
    <path stroke="none" d="M3.5,18.5v18l5-7h9L3.5,18.5z M7.5,27.5l-3,4.5V20.5l9,7H7.5z"></path>\
    </svg>\
</button>';

    +function () {
        var mDownX, mDownY;
        var offsetX, offsetY;
        var activeJoinInfo = {};

        var CIRCLE_RADIUS = 12;

        TPipeEdit.prototype.setSceneMode = function () {
            this.painter.mouseDownActionPerformed = function(e) {
                this.mouseDownActionPerformed(e);
            }.bind(this);

            this.painter.mouseMoveActionPerformed = function (e) {
                this.mouseMoveActionPerformed(e);
            }.bind(this);

            this.painter.mouseUpActionPerformed = function (e) {
                this.mouseUpActionPerformed(e);
            }.bind(this);
        };

        TPipeEdit.prototype.dragShapeActionPerformed = function (e) {
            var evt = e.evt;
            var hitShape = null;

            mDownX = evt.layerX;
            mDownY = evt.layerY;

            // 判断鼠标落点是否在连接点上
            hitShape = GUtil.getIntersectionByPointEx(mDownX, mDownY, this.painter.state.activeLayers());
            
            if (hitShape && hitShape.hasName('pipe-joint-circle')) {
                p = this.painter.inverseTransform({x: hitShape.x()-hitShape.offsetX(), y: hitShape.y()-hitShape.offsetY()})
                mDownX = p.x;
                mDownY = p.y;
            }

            this.previewCircle.setAbsolutePosition({
                x: mDownX,
                y: mDownY
            });
            points = this.previewLine.points();
            points.splice(2, 2, mDownX, mDownY);
            this.previewLine.points(points);

            this.layer.draw();
        };

        TPipeEdit.prototype.mouseDownActionPerformed = function (e) {
            var evt = e.evt;
            var hitShape;
            var radius;
            var m = this.painter.getTransform();
            var circleId, points, previewPoints = [], circlePoints, idx;
            var tArr = null, p = null;

            mDownX = evt.layerX;
            mDownY = evt.layerY;

            // 判断落点是否在某个图形内
            hitShape = GUtil.getIntersectionByPointInCanvasLayers(mDownX, mDownY, this.painter.state.activeLayers(), m, 'Combine');

            // 清除的可编辑矩形
            this.painter.setActiveWidgets();

            if (this.previewCircle) this.previewCircle.destroy();
            if (this.previewLine) this.previewLine.destroy();

            if(hitShape && hitShape.hasName('pipe-joint-circle')) {
                radius = this.painter.scale * CIRCLE_RADIUS;
                circleId = hitShape.id();
                tArr = circleId.split('_');
                pipe = this.painter.find('#'+tArr[0])[0];
                if (!pipe) return;

                // 找到临近点坐标
                points = pipe.store.model.option().points;
                idx = parseInt(tArr[1])*2;
                
                // 将目前操作的点的相关信息存储起来，方便后续处理时调用
                activeJoinInfo.pipe = pipe;
                activeJoinInfo.idx = idx;

                if (idx - 2 > -1) {
                    p = points.slice(idx-2, idx);
                    p = this.painter.inverseTransform({x: p[0], y: p[1]});
                    previewPoints = previewPoints.concat([p.x, p.y]);
                }
                p = points.slice(idx, idx+2);
                circlePoints = this.painter.inverseTransform({x: p[0], y: p[1]});
                previewPoints = previewPoints.concat([circlePoints.x, circlePoints.y]);
                if (idx + 2 < points.length) {
                    p = points.slice(idx+2, idx+4);
                    p = this.painter.inverseTransform({x: p[0], y: p[1]});
                    // 确保当前选中圆的点始终在下标 2 和 3 的位置
                    previewPoints = idx -2 > -1 ? previewPoints.concat([p.x, p.y]) :
                        [p.x, p.y].concat(previewPoints);
                }

                this.previewCircle = new Konva.Circle({
                    name: 'preview-circle',
                    x: circlePoints.x,
                    y: circlePoints.y,
                    radius: radius,
                    strokeWidth: 2,
                    stroke: '#2aabd2'
                });

                this.previewLine = new Konva.Line({
                    name: 'preview-line',
                    points: previewPoints,
                    stroke: '#2780C4',
                    strokeWidth: 2,
                    lineJoin: 'round',
                    dash: [2, 2]
                });
                this.layer.add(this.previewCircle);
                this.layer.add(this.previewLine);

                // 注册 mouse move 事件
                this.mouseMoveActionPerformed = this.dragShapeActionPerformed;
                // 注册 mouse up 事件
                this.mouseUpActionPerformed = this.dropShapeActionPerformed;
                
                this.layer.draw();
            }
        };

        TPipeEdit.prototype.dropShapeActionPerformed = function (e) {
            var _this = this;
            var pos = this.previewCircle.getAbsolutePosition();
            var options = activeJoinInfo.pipe.store.model.option();
            var idx = activeJoinInfo.idx;

            // 清空预览图形
            this.previewCircle.destroy();
            this.previewLine.destroy();

            // 清除 mousemove 事件
            delete this.mouseMoveActionPerformed;
            // 清除 mouseup 事件
            delete this.mouseUpActionPerformed;

            // 坐标系转换
            pos = this.painter.transform(pos);

            // 将新坐标更新到 points 数组中
            options.points.splice(idx, 2, pos.x, pos.y);
            activeJoinInfo.pipe.store.model.option(options);

            this.layer.draw();
        };
    }();

    TPipeEdit.prototype.removeShapes = function () {
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

    window.TPipeEdit = TPipeEdit;
} ());