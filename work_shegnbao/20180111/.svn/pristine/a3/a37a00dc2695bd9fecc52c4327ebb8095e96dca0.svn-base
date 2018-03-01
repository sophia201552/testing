(function (Group) {
    var _this;
    function GResizablePolygon(shape, layer) {
        Group.call(this, {
            name: 'resizable-group',
            draggable: false
        });
        // 顶点
        this.vertexes = [];
        // 多边形
        this.polygon = null;

        this.shape = shape;
        this.layer = layer;
        this.painter = this.layer.painter;
        this.init();
        _this = this;
    }

    GResizablePolygon.prototype = Object.create(Group.prototype);
    GResizablePolygon.prototype.constructor = GResizablePolygon;

    GResizablePolygon.prototype.getPainter = function () {
        return this.layer.getPainter();
    };

    GResizablePolygon.prototype.getTransformedSize = function (size) {
        return size / this.getPainter().getScale();
    };

    GResizablePolygon.prototype.getShapeRect = function () {
        var posOfShape = this.polygon.position();
        var pos = this.position();
        return {
            x: pos.x + posOfShape.x,
            y: pos.y + posOfShape.y
        };
    };

    GResizablePolygon.prototype.init = function () {
        this.create();
    };

    GResizablePolygon.prototype.create = (function () {
        

        function addAnchor(group, pos) {
            var _this = this;
            var ANCHOR_SIZE = this.getTransformedSize(8);

            var anchor = new Konva.Rect({
                name:'anchor',
                stroke: '#666',
                fill: '#ddd',
                strokeWidth: this.getTransformedSize(1),
                x: pos.x,
                y: pos.y,
                width: ANCHOR_SIZE,
                height: ANCHOR_SIZE,
                offsetX: ANCHOR_SIZE/2,
                offsetY: ANCHOR_SIZE/2,
            });

            group.add(anchor);

            return anchor;
        }

        return function () {
            var group;
            var _this = group = this;
            var id = this.shape.store.model._id();
            // data format
            var points = (function (points) {
                var arr = [];

                for(var i = 0, len = points.length; i < len; i += 2) {
                    arr.push({
                        x: points[i],
                        y: points[i+1]
                    });
                }
                return arr;
            }).call(this, this.shape.store.model['option.points']());

            this.polygon = new Konva.Line({
                id: id+'_a',
                name: 'resizable-shape',
                points: (function (points) {
                    var arr = [];
                    points.forEach(function (p) {
                        arr.push(p.x);
                        arr.push(p.y);
                    });
                    return arr;
                } (points)),
                closed: true,
                strokeWidth: this.getTransformedSize(1),
                stroke: '#2aabd2'
            });

            group.add(this.polygon);

            points.forEach(function (p) {
                var anchor = addAnchor.call(this, group, p);
                this.vertexes.push(anchor);
            }, this);

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
                    activeAnchor.x(inactiveAnchor.x());
                } else {
                    activeAnchor.y(inactiveAnchor.y());
                }
            }
            // 非 shift 键拖动逻辑处理
            else {
                // 暂时不需要做什么事
            }
        };

        this.onAnchorMouseDownActionPerformed = function (e) {
            
            this.moveToTop();
            var evt = e.evt;

            mDownX = evt.transformedX;
            mDownY = evt.transformedY;

            activeAnchor = e.target;
            var x = activeAnchor.x();
            var y = activeAnchor.y();
            cdx = mDownX - x;
            cdy = mDownY - y;
            //选上个点和下个点中最近的点为基点
            var index = activeAnchor.index;
            var children = activeAnchor.parent.children;
            var prer = (index - 1) < 1 ? (children.length - 1) : index - 1;
            var next = index === (children.length - 1) ? 1 : index + 1;
            var ax = activeAnchor.x();
            var ay = activeAnchor.y();
            var pdy = Math.abs(ay - children[prer].y());
            var pdx = Math.abs(ax - children[prer].x());
            var ndy = Math.abs(ay - children[next].y());
            var ndx = Math.abs(ax - children[next].x());
            if (Math.sqrt(pdy * pdy + pdx * pdx) < Math.sqrt(ndy * ndy + ndx * ndx)) {
                inactiveAnchor = children[prer];
            } else {
                inactiveAnchor = children[next];
            }
            
            ox = activeAnchor.x();
            oy = activeAnchor.y();
        };

        this.onResizingShapeActionPerformed = function (e) {
            var evt = e.evt;
            var transformedX = evt.transformedX;
            var transformedY = evt.transformedY;

            var dx = transformedX - mDownX;
            var dy = transformedY - mDownY;
            var circle;
            var group = activeAnchor.getParent();            
            if (!activeAnchor) {
                return;
            }
            if (circle) circle.destroy();
            //热力图附近点吸附
            var target = GUtil.getIntersectionByPoint(evt.layerX, evt.layerY, this.painter.getCanvasLayer(), this.painter.getRootLayer());
            if (target && (target.store.model.type() === 'CanvasHeat'||target.store.model.type() === 'CanvasPolygon') && target.store.model._id()!==_this.shape.store.model._id()) {
                var points = target.store.model['option.points']();
                var gridWidth = 8/this.painter.scale;
                for (var i = 0, len = points.length; i < len; i += 2) {
                    var isSameP = (Math.abs(points[i] - transformedX) <= gridWidth && Math.abs(points[i + 1] - transformedY) <= gridWidth) ? true : false;
                    if (isSameP) {
                        transformedX = points[i];
                        transformedY = points[i + 1];
                        
                        dx = transformedX - mDownX + cdx;
                        dy = transformedY - mDownY + cdy;
                        break;
                    }
                }
            }
            activeAnchor.x(transformedX);
            activeAnchor.y(transformedY);
            activeAnchor.position({
                x: ox + dx,
                y: oy + dy
            });
            group._updateAnchor(evt.shiftKey);
            group.resize();
            activeAnchor.getLayer().draw();
        };

        this.onResizeShapeActionPerformed = function (e) {
            activeAnchor.getParent().onResizingShapeActionPerformed(e);
            activeAnchor.getParent().resizeShape();
            // 要注意这里的 this 指向的是哪个对象
            this.resetMouseAction();
        };
    }.call(GResizablePolygon.prototype);

    // 获取图形的位置信息
    GResizablePolygon.prototype.getShapePosition = function () {
        return [];
    };
    
    GResizablePolygon.prototype.moveShape = function (dx, dy) {
        var pos = this.position();
        this.position({
            x: pos.x + dx,
            y: pos.y + dy
        });
    };

    GResizablePolygon.prototype.destroy = function () {
        Group.prototype.destroy.call(this);
    };

    /** 调整大小，用于同步那些通过属性面板修改导致的大小调整 */
    GResizablePolygon.prototype.resize = function () {
        var points = [];

        this.vertexes.forEach(function (v) {
            points.push(v.x());
            points.push(v.y());
        });

        this.polygon.points(points);
    };

    GResizablePolygon.prototype.resizeShape = function () {
        var shape = this.shape;
        var gpPos = this.position();
        var points = [];
        this.vertexes.forEach(function (v) {
            var p = v.position();

            points.push(p.x + gpPos.x);
            points.push(p.y + gpPos.y);
        }, this);


        shape.store.model['option.points'](points);

        this.layer.draw();
    };

    window.GResizablePolygon = GResizablePolygon;
} (Konva.Group));