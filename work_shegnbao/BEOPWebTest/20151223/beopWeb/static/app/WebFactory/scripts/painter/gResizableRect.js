(function (Group) {

    function GResizableRect(shape, transform) {
        Group.call(this, {
            name: 'resizable-group',
            dragable: false
        });

        this.resizableShape = null;

        this.shape = shape;
        this.transform = transform;

        this.init();
    }

    GResizableRect.prototype = Object.create(Group.prototype);
    GResizableRect.prototype.constructor = GResizableRect;

    GResizableRect.prototype.init = function () {
        this.bindModelOb();
        this.create();
    };

    GResizableRect.prototype.create = (function () {

        var ANCHOR_SIZE = 4;

        function update(activeAnchor) {
            var group = activeAnchor.getParent();
            var x, y, width, height;

            var topLeft = group.find('.top-left')[0];
            var topMiddle = group.find('.top-middle')[0];
            var topRight = group.find('.top-right')[0];
            var rightMiddle = group.find('.right-middle')[0];
            var bottomRight = group.find('.bottom-right')[0];
            var bottomMiddle = group.find('.bottom-middle')[0];
            var bottomLeft = group.find('.bottom-left')[0];
            var leftMiddle = group.find('.left-middle')[0];

            var shape = group.find('.resizable-shape')[0];

            var anchorX = activeAnchor.getX();
            var anchorY = activeAnchor.getY();

            switch (activeAnchor.getName().split(' ')[1]) {
                case 'top-left':
                    topRight.setY(anchorY);
                    bottomLeft.setX(anchorX);
                    break;
                case 'top-middle':
                    topLeft.setY(anchorY);
                    topRight.setY(anchorY);
                    break;
                case 'top-right':
                    topLeft.setY(anchorY);
                    bottomRight.setX(anchorX);
                    break;
                case 'right-middle':
                    topRight.setX(anchorX);
                    bottomRight.setX(anchorX);
                    break;
                case 'bottom-right':
                    topRight.setX(anchorX);
                    bottomLeft.setY(anchorY);
                    break;
                case 'bottom-middle':
                    bottomLeft.setY(anchorY);
                    bottomRight.setY(anchorY);
                    break;
                case 'bottom-left':
                    topLeft.setX(anchorX);
                    bottomRight.setY(anchorY);
                    break;
                case 'left-middle':
                    topLeft.setX(anchorX);
                    bottomLeft.setX(anchorX);
                    break;
            }

            width = topRight.getX() - topLeft.getX();
            height = bottomLeft.getY() - topLeft.getY();

            // 调整 4 个中点的位置
            x = topLeft.getX() + width/2;
            y = topLeft.getY() + height/2;
            topMiddle.setX(x);
            topMiddle.setY(topLeft.getY());
            rightMiddle.setX(topRight.getX());
            rightMiddle.setY(y);
            bottomMiddle.setX(x);
            bottomMiddle.setY(bottomLeft.getY());
            leftMiddle.setX(topLeft.getX());
            leftMiddle.setY(y);

            // 调整图形的位置和大小
            shape.position(topLeft.position());

            if(width && height) {
                shape.width(width);
                shape.height(height);
            }
        }
        
        function addAnchor(group, name) {
            var _this = this;
            var anchor = new Konva.Rect({
                stroke: '#666',
                fill: '#ddd',
                strokeWidth: 1,
                width: ANCHOR_SIZE,
                height: ANCHOR_SIZE,
                name: name,
                offsetX: ANCHOR_SIZE/2,
                offsetY: ANCHOR_SIZE/2,
                draggable: true,
                dragOnTop: true
            });
            var type = name.split(' ')[1];

            if(type === 'top-middle' || type === 'bottom-middle') {
                // 限制垂直拖动
                anchor.dragBoundFunc(function (pos) {
                    return {
                        x: this.getAbsolutePosition().x,
                        y: pos.y
                    }
                });
            } else if(type === 'left-middle' || type === 'right-middle') {
                // 限制水平拖动
                anchor.dragBoundFunc(function (pos) {
                    return {
                        x: pos.x,
                        y: this.getAbsolutePosition().y
                    }
                });
            }

            anchor.on('dragmove', function() {
                var layer = this.getLayer();
                update(this);
                layer.draw();
            });
            anchor.on('mousedown touchstart', function (e) {
                this.moveToTop();
                e.cancelBubble = true;
            });
            anchor.on('mouseup', function (e) {
                e.cancelBubble = true;
            });
            anchor.on('dragend', function() {
                var shape = this.getParent().findOne('.resizable-shape');
                _this.resizeShape();
            });
            // 鼠标悬浮样式定义
            anchor.on('mouseover', function() {
                var layer = this.getLayer();
                this.setStrokeWidth(2);
                layer.draw();
            });
            anchor.on('mouseout', function() {
                var layer = this.getLayer();
                this.setStrokeWidth(1);
                layer.draw();
            });

            group.add(anchor);
        }

        return function () {
            var _this = this;
            var shape, bound;
            var group = this;
            var id = this.shape.id();
            var pos = GUtil.transform(this.shape, this.transform);

            this.resizableShape = shape = new Konva.Rect({
                id: id+'_a',
                name: 'resizable-shape',
                x: pos.x,
                y: pos.y,
                width: pos.w,
                height: pos.h,
                strokeWidth: 1,
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

            group.find('.anchor').each(function (anchor, i) {
                switch (anchor.getName().split(' ')[1]) {
                    case 'top-left':
                        anchor.setX(bound.x);
                        anchor.setY(bound.y);
                        break;
                    case 'top-middle':
                        anchor.setX(bound.x + bound.width / 2);
                        anchor.setY(bound.y);
                        break;
                    case 'top-right':
                        anchor.setX(bound.x + bound.width);
                        anchor.setY(bound.y);
                        break;
                    case 'right-middle':
                        anchor.setX(bound.x + bound.width);
                        anchor.setY(bound.y + bound.height / 2);
                        break;
                    case 'bottom-right':
                        anchor.setX(bound.x + bound.width);
                        anchor.setY(bound.y + bound.height);
                        break;
                    case 'bottom-middle':
                        anchor.setX(bound.x + bound.width / 2);
                        anchor.setY(bound.y + bound.height);
                        break;
                    case 'bottom-left':
                        anchor.setX(bound.x);
                        anchor.setY(bound.y + bound.height);
                        break;
                    case 'left-middle':
                        anchor.setX(bound.x);
                        anchor.setY(bound.y + bound.height / 2);
                        break;
                }

            });

            return group;
        };
    }());
        
    GResizableRect.prototype.destroy = function () {
        Group.prototype.destroy.call(this);
        this.unbindModelOb();
    };

    GResizableRect.prototype.bindModelOb = function () {
        this.shape.store.model.addEventListener('update', this.update, this);
    };

    GResizableRect.prototype.unbindModelOb = function () {
        this.shape.store.model.removeEventListener('update', this.update);
    };

    GResizableRect.prototype.update = function () {
        var posOfResizableShape = GUtil.transform(this.resizableShape, this.transform);
        var posOfShape = GUtil.transform(this.shape, this.transform);

        this.position({
            x: this.x() + parseInt(posOfShape.x) - posOfResizableShape.x,
            y: this.y() + posOfShape.y - posOfResizableShape.y
        });

        this.resizableShape.width(posOfShape.w);
        this.resizableShape.height(posOfShape.h);

        this.resize();

        this.getLayer().draw();
    };

    /** 调整大小，用于同步那些通过属性面板修改导致的大小调整 */
    GResizableRect.prototype.resize = function () {
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

        topMiddle.x(pos.x + w/2);
        topRight.x(pos.x + w);
        rightMiddle.x(pos.x + w);
        rightMiddle.y(pos.y + h/2);
        bottomRight.x(pos.x + w);
        bottomRight.y(pos.y + h);
        bottomMiddle.x(pos.x + w/2);
        bottomMiddle.y(pos.y + h);
        bottomLeft.y(pos.y + h);
        leftMiddle.y(pos.y + h/2);
    };

    GResizableRect.prototype.resizeShape = function () {
        var shape = this.shape;
        var pos = shape.layer.painter.transform(this.resizableShape, this.transform, true);

        shape.setAbsolutePosition({
            x: pos.x,
            y: pos.y
        });
        shape.width(pos.w);
        shape.height(pos.h);

        shape.getLayer().draw();
    };

    window.GResizableRect = GResizableRect;
} (Konva.Group));