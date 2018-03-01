(function (Group) {

    function GResizableRect(shape, layer) {
        Group.call(this, {
            x: 0,
            y: 0,
            name: 'resizable-group',
            draggable: false
        });

        this.resizableShape = null;
        this.shape = shape;
        this.layer = layer;

        this.shapeType = shape.store.model.type();
        this._silence = 0;
        this.init();
    }

    GResizableRect.prototype = Object.create(Group.prototype);
    GResizableRect.prototype.constructor = GResizableRect;

    GResizableRect.prototype.getPainter = function () {
        return this.layer.getPainter();
    };

    GResizableRect.prototype.init = function () {
        this.bindModelOb();
        this.create();
    };

    GResizableRect.prototype.getTransformedSize = function (size) {
        return size / this.getPainter().getScale();
    };

    GResizableRect.prototype.create = (function () {
        function addAnchor(group, name) {
            var _this = this;
            //特殊處理 CanvasHeatP不需要拉伸塊
            var ANCHOR_SIZE = _this.shapeType === "CanvasHeatP" ? 0 : this.getTransformedSize(6);

            var anchor = new Konva.Rect({
                stroke: '#666',
                fill: '#ddd',
                strokeWidth: this.getTransformedSize(1),
                width: ANCHOR_SIZE,
                height: ANCHOR_SIZE,
                name: name,
                offsetX: ANCHOR_SIZE/2,
                offsetY: ANCHOR_SIZE/2
            });
            var type = name.split(' ')[1];

            group.add(anchor);
        }

        return function () {
            var _this = this;
            var shape, bound;
            var group = this;
            var id = this.shape.id();
            var pos = (function (shape) {
                var position = shape.position();
                return {
                    x: position.x,
                    y: position.y,
                    w: shape.width(),
                    h: shape.height()
                };
            } (this.shape));

            //特殊處理 CanvasHeatP的strokeWidth要寬一點
            var strokeWidth = _this.shapeType === "CanvasHeatP" ? 3 : 1;
            strokeWidth = _this.getTransformedSize(strokeWidth);

            this.resizableShape = shape = new Konva.Rect({
                id: id+'_a',
                name: 'resizable-shape',
                x: pos.x,
                y: pos.y,
                width: pos.w,
                height: pos.h,
                strokeWidth: strokeWidth,
                stroke: '#2aabd2'
            });
            bound = shape.getClientRect();

            group.add(shape);
            addAnchor.call(this, group, 'anchor top-left');
            addAnchor.call(this, group, 'anchor top-middle');
            addAnchor.call(this, group, 'anchor top-right');
            addAnchor.call(this, group, 'anchor right-middle');
            addAnchor.call(this, group, 'anchor bottom-right');
            addAnchor.call(this, group, 'anchor bottom-middle');
            addAnchor.call(this, group, 'anchor bottom-left');
            addAnchor.call(this, group, 'anchor left-middle');

            this.updateAnchorPosition();

            return group;
        };
    }());
    


    // anchor 的鼠标事件处理
    +function () {
        // 鼠标按下时，控件的位置
        var ox, oy;
        // 鼠标按下的位置
        var mDownX, mDownY;
        // 此时活动的 anchor
        var activeAnchor;

        this._updateAnchor = function (shiftKey) {
            var group = activeAnchor.getParent();
            var x, y, ow, oh, width, height;

            var topLeft = group.find('.top-left')[0];
            var topMiddle = group.find('.top-middle')[0];
            var topRight = group.find('.top-right')[0];
            var rightMiddle = group.find('.right-middle')[0];
            var bottomRight = group.find('.bottom-right')[0];
            var bottomMiddle = group.find('.bottom-middle')[0];
            var bottomLeft = group.find('.bottom-left')[0];
            var leftMiddle = group.find('.left-middle')[0];

            var shape = group.find('.resizable-shape')[0];

            var anchorType = activeAnchor.getName().split(' ')[1];

            x = activeAnchor.x();
            y = activeAnchor.y();

            switch (anchorType) {
                case 'top-left':
                    topRight.y(y);
                    bottomLeft.x(x);
                    break;
                case 'top-middle':
                    topLeft.y(y);
                    topRight.y(y);
                    break;
                case 'top-right':
                    topLeft.y(y);
                    bottomRight.x(x);
                    break;
                case 'right-middle':
                    topRight.x(x);
                    bottomRight.x(x);
                    break;
                case 'bottom-right':
                    topRight.x(x);
                    bottomLeft.y(y);
                    break;
                case 'bottom-middle':
                    bottomLeft.y(y);
                    bottomRight.y(y);
                    break;
                case 'bottom-left':
                    topLeft.x(x);
                    bottomRight.y(y);
                    break;
                case 'left-middle':
                    topLeft.x(x);
                    bottomLeft.x(x);
                    break;
            }

            ow = width = topRight.x() - topLeft.x();
            oh = height = bottomLeft.y() - topLeft.y();
            
            // 处理 shift key
            if (shiftKey) {

                (function () {
                    var model = group.shape.store.model;
                    // 原始长宽比
                    var factor = model.w() / model.h();
                    var h;
                    // 判断是 x 方向主导还是 y 方向主导
                    if (['top-middle', 'bottom-middle'].indexOf(anchorType) > -1) {
                        width = height * factor;
                    } else if (['left-middle', 'right-middle'].indexOf(anchorType) > -1) {
                        height = width / factor;
                    } else {
                        h = width / factor;
                        if (h > height) {
                            height = h;
                        } else {
                            width = height * factor;
                        }
                    }
                } ());

                switch (anchorType) {
                    case 'top-left':
                        x = bottomRight.x() - width;
                        y = bottomRight.y() - height;
                        break;
                    case 'top-middle':
                        x = bottomLeft.x() - (width - ow)/2;
                        y = bottomLeft.y() - height;
                        break;
                    case 'top-right':
                        x = bottomLeft.x();
                        y = bottomLeft.y() - height;
                        break;
                    case 'right-middle':
                        x = topLeft.x();
                        y = topLeft.y() - (height - oh)/2;
                        break;
                    case 'bottom-right':
                        x = topLeft.x();
                        y = topLeft.y();
                        break;
                    case 'bottom-middle':
                        x = topLeft.x() - (width - ow)/2;
                        y = topLeft.y();
                        break;
                    case 'bottom-left':
                        x = topRight.x() - width;
                        y = topRight.y();
                        break;
                    case 'left-middle':
                        x = topRight.x() - width;
                        y = topRight.y() - (height - oh)/2;
                        break;
                }
            } else {
                x = topLeft.x();
                y = topLeft.y();
            }

            // 调整图形的位置和大小
            shape.position({
                x: x,
                y: y
            });
            shape.width(width);
            shape.height(height);

            group.updateAnchorPosition();
        };

        this.onAnchorMouseDownActionPerformed = function (e) {
            var evt = e.evt;

            mDownX = evt.transformedX;
            mDownY = evt.transformedY;

            activeAnchor = e.target;

            ox = activeAnchor.x();
            oy = activeAnchor.y();
        };

        this.onResizingShapeActionPerformed = function (e) {
            var evt = e.evt;
            var transformedX = evt.transformedX;
            var transformedY = evt.transformedY;

            var dx = transformedX - mDownX;
            var dy = transformedY - mDownY;

            if (!activeAnchor) {
                return;
            }

            activeAnchor.position({
                x: ox + dx,
                y: oy + dy
            });

            activeAnchor.getParent()._updateAnchor(evt.shiftKey);
            activeAnchor.getLayer().draw();
        };

        this.onResizeShapeActionPerformed = function (e) {
            activeAnchor.getParent().onResizingShapeActionPerformed(e);
            activeAnchor.getParent().resizeShape();

            // 要注意这里的 this 指向的是哪个对象
            this.resetMouseAction();
        };

    }.call(GResizableRect.prototype);

    GResizableRect.prototype.getResizableShape = function () {
        return this.resizableShape;
    };

    GResizableRect.prototype.bindModelOb = function () {
        this.shape.store.model.addEventListener('update', this.update, this);
    };

    GResizableRect.prototype.unbindModelOb = function () {
        this.shape.store.model.removeEventListener('update', this.update);
    };

    GResizableRect.prototype.silence = function (silence) {
        if (typeof silence === 'undefined') {
            return this._silence;
        }
        this._silence = silence;
    };

    GResizableRect.prototype.update = function (e, propName) {
        var _this = this;
        var posOfShape;

        if (this.silence() === 1) {
            return;
        }

        posOfShape = (function (shape) {
            var pos = shape.position();
            var groupPos = _this.position();

            return {
                x: pos.x - groupPos.x,
                y: pos.y - groupPos.y,
                w: shape.width(),
                h: shape.height()
            };
        } (this.shape));
        
        this.resizableShape.position({
            x: posOfShape.x,
            y: posOfShape.y
        });
        this.resize(posOfShape.w, posOfShape.h);
        this.getParent().draw();
    };

    GResizableRect.prototype.getShapeRect = function () {
        var posOfShape = this.resizableShape.position();
        var pos = this.position();

        return {
            x: pos.x + posOfShape.x,
            y: pos.y + posOfShape.y,
            w: this.resizableShape.width(),
            h: this.resizableShape.height()
        };
    };

    GResizableRect.prototype.moveShape = function (dx, dy) {
        var pos = this.position();

        this.position({
            x: pos.x + dx,
            y: pos.y + dy
        });
    };

    /** 调整大小，用于同步那些通过属性面板修改导致的大小调整 */
    GResizableRect.prototype.resize = function (w, h) {
        this.resizableShape.width(w);
        this.resizableShape.height(h);

        this.updateAnchorPosition();
    };

    GResizableRect.prototype.updateAnchorPosition = function () {
        var pos = this.resizableShape.position();
        var w = this.resizableShape.width();
        var h = this.resizableShape.height();

        var topLeft = this.find('.top-left')[0];
        var topMiddle = this.find('.top-middle')[0];
        var topRight = this.find('.top-right')[0];
        var rightMiddle = this.find('.right-middle')[0];
        var bottomRight = this.find('.bottom-right')[0];
        var bottomMiddle = this.find('.bottom-middle')[0];
        var bottomLeft = this.find('.bottom-left')[0];
        var leftMiddle = this.find('.left-middle')[0];

        topLeft.x(pos.x);
        topLeft.y(pos.y);

        topMiddle.x(pos.x + w/2);
        topMiddle.y(pos.y);

        topRight.x(pos.x + w);
        topRight.y(pos.y);

        rightMiddle.x(pos.x + w);
        rightMiddle.y(pos.y + h/2);

        bottomRight.x(pos.x + w);
        bottomRight.y(pos.y + h);

        bottomMiddle.x(pos.x + w/2);
        bottomMiddle.y(pos.y + h);

        bottomLeft.x(pos.x);
        bottomLeft.y(pos.y + h);

        leftMiddle.x(pos.x);
        leftMiddle.y(pos.y + h/2);
    };

    GResizableRect.prototype.resizeShape = function (isAdsorptive) {
        var _this = this;
        var shape = this.shape;
        var model = shape.store.model;
        var pos = _this.getShapeRect();
        var scaleX, scaleY;

        // 停止监控
        this.silence(1);

        shape.position(pos);
        shape.width(Math.abs(pos.w));
        shape.height(Math.abs(pos.h));

        // 恢复监控
        this.silence(0);

        this.layer.draw();
    };

    GResizableRect.prototype.destroy = function () {
        Group.prototype.destroy.call(this);
        this.unbindModelOb();
    };

    window.GResizableRect = GResizableRect;
} (Konva.Group));