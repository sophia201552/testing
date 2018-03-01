(function (Group) {

    function GResizableLine(shape, transform) {
        Group.call(this, {
            name: 'resizable-group',
            dragable: false
        });

        this.resizableShape = null;

        this.shape = shape;
        this.transform = transform;

        this.init();
    }

    GResizableLine.prototype = Object.create(Group.prototype);
    GResizableLine.prototype.constructor = GResizableLine;

    GResizableLine.prototype.init = function () {
        this.bindModelOb();
        this.create();
    };

    GResizableLine.prototype.create = (function () {

        var ANCHOR_SIZE = 16;

        function update(activeAnchor,joinIndex) {
            var group = activeAnchor.getParent();
            var line = group.find('.resizable-shape')[0];
            var joinStart = group.shape.joinSet[joinIndex * 2];
            var joinEnd = group.shape.joinSet[joinIndex * 2 - 1];
            var arrPoint = line.points();
            var anchorX = activeAnchor.getX();
            var anchorY = activeAnchor.getY();
            arrPoint[joinIndex * 2] = anchorX;
            arrPoint[joinIndex * 2 + 1] = anchorY;
            line.points(arrPoint);
            if(joinStart){
                joinStart.x(anchorX);
                joinStart.y(anchorY);
            }
            if(joinEnd){
                joinEnd.x(anchorX);
                joinEnd.y(anchorY);
            }
            // 调整图形的位置和大小
            //shape.position(topLeft.position());

            //if(width && height) {
            //    shape.width(width);
            //    shape.height(height);
            //}
        }
        
        function addAnchor(group, option) {
            var _this = this;
            var anchor = new Konva.Circle({
                stroke: '#666',
                fill: '#ddd',
                strokeWidth: 1,
                width: ANCHOR_SIZE,
                height: ANCHOR_SIZE,
                x:option.x,
                y:option.y,
                joinIndex:option.joinIndex,
                name:'join-' + option.joinIndex,
                //offsetX: ANCHOR_SIZE/2,
                //offsetY: ANCHOR_SIZE/2,
                draggable: true,
                dragOnTop: true
            });
            //var type = name.split(' ')[1];
            //
            //if(type === 'top-middle' || type === 'bottom-middle') {
            //    // 限制垂直拖动
            //    anchor.dragBoundFunc(function (pos) {
            //        return {
            //            x: this.getAbsolutePosition().x,
            //            y: pos.y
            //        }
            //    });
            //} else if(type === 'left-middle' || type === 'right-middle') {
            //    // 限制水平拖动
            //    anchor.dragBoundFunc(function (pos) {
            //        return {
            //            x: pos.x,
            //            y: this.getAbsolutePosition().y
            //        }
            //    });
            //}

            anchor.on('dragmove', function() {
                var layer = this.getLayer();
                update(this,option.joinIndex);
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

            this.resizableShape = shape = new Konva.Line({
                id: id+'_a',
                name: 'resizable-shape',
                //x: pos.x,
                //y: pos.y,
                //width: pos.w,
                //height: pos.h,
                points:[].concat(this.shape.line.points()),
                strokeWidth: 1,
                stroke: 'black'
                //stroke: '#2aabd2'
            });
            bound = shape.getClientRect();

            group.add(shape);
            for (var i = 0;i < this.shape.line.points().length ;i += 2) {
                addAnchor.call(this, group,
                    {
                        x:this.shape.line.points()[i],
                        y:this.shape.line.points()[i + 1],
                        joinIndex: Math.floor(i / 2)
                    }
                );
            }

            return group;
        };
    }());
        
    GResizableLine.prototype.destroy = function () {
        Group.prototype.destroy.call(this);
        this.unbindModelOb();
    };

    GResizableLine.prototype.bindModelOb = function () {
        this.shape.store.model.addEventListener('update', this.update, this);
    };

    GResizableLine.prototype.unbindModelOb = function () {
        this.shape.store.model.removeEventListener('update', this.update);
    };

    GResizableLine.prototype.update = function () {
        //var posOfResizableShape = GUtil.transform(this.resizableShape, this.transform);
        //var posOfShape = GUtil.transform(this.shape, this.transform);
        //
        //this.position({
        //    x: this.x() + parseInt(posOfShape.x) - posOfResizableShape.x,
        //    y: this.y() + posOfShape.y - posOfResizableShape.y
        //});

        //this.resizableShape.width(posOfShape.w);
        //this.resizableShape.height(posOfShape.h);

        //this.resize();
        //
        //this.getLayer().draw();
    };

    /** 调整大小，用于同步那些通过属性面板修改导致的大小调整 */
    GResizableLine.prototype.resize = function () {
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

    GResizableLine.prototype.resizeShape = function () {
        var shape = this.shape;
        var pos = GUtil.transform(this.resizableShape, this.transform, true);

        shape.setAbsolutePosition({
            x: pos.x,
            y: pos.y
        });
        shape.width(pos.w);
        shape.height(pos.h);

        shape.getLayer().draw();
    };

    window.GResizableLine = GResizableLine;
} (Konva.Group));