(function (Group) {

    function GResizableLine(shape, layer) {
        Group.call(this, {
            name: 'resizable-group',
            dragable: false
        });

        this.resizableShape = null;
        this.anchorStart = null;
        this.anchorEnd = null;

        this.shape = shape;
        this.layer = layer;
        this.painter = this.layer.painter;
        this.transform = layer.getTransform().m;

        this.init();
    }

    GResizableLine.prototype = Object.create(Group.prototype);
    GResizableLine.prototype.constructor = GResizableLine;

    GResizableLine.prototype.init = function () {
        this.create();
    };

    GResizableLine.prototype.create = (function () {

        var ANCHOR_SIZE = 12;

        function addAnchor(group, pos) {
            var _this = this;
            var anchor = new Konva.Circle({
                stroke: '#666',
                fill: '#ddd',
                strokeWidth: 1,
                radius: ANCHOR_SIZE/2,
                x: pos.x,
                y: pos.y,
                draggable: true,
                dragOnTop: true
            });

            anchor.on('dragmove', function(e) {
                var layer = this.getLayer();
                _this.resize();
                layer.draw();
            });
            anchor.on('mouseup', function(e) {
                if(e.evt.shiftKey){
                    var shiftY = _this.shape.store.model._values.option.points[0].y;
                    if(e.target === _this.anchorStart){//以左边点按住shift移动
                        var shiftAnchorStart = _this.anchorEnd;
                        var shiftAnchorEnd = _this.anchorStart;
                    }
                    _this.resize(shiftY,shiftAnchorStart,shiftAnchorEnd);
                }
            });
            anchor.on('mousedown touchstart', function (e) {
                this.moveToTop();
                e.cancelBubble = true;
            });
            anchor.on('dragend', function() {
                _this.resizeShape();
            });
            // 鼠标悬浮样式定义
            anchor.on('mouseover', function(e) {
                var layer = this.getLayer();
                this.setStrokeWidth(2);
                layer.draw();
                e.cancelBubble = true;
            });
            anchor.on('mouseout', function() {
                var layer = this.getLayer();
                this.setStrokeWidth(1);
                layer.draw();
            });

            group.add(anchor);

            return anchor;
        }

        return function () {
            var group;
            var _this = group = this;
            var id = this.shape.store.model._id();
            var points = (function (points) {
                var p1 = this.painter.inverseTransform(points[0]);
                var p2 = this.painter.inverseTransform(points[1]);
                return [p1, p2];
            }).call(this, this.shape.store.model['option.points']());

            this.resizableShape = new Konva.Line({
                id: id+'_a',
                name: 'resizable-shape',
                points: [points[0].x, points[0].y, points[1].x, points[1].y],
                strokeWidth: 4,
                stroke: '#2aabd2'
            });

            group.add(this.resizableShape);
            this.anchorStart = addAnchor.call(this, group, points[0]);
            this.anchorEnd = addAnchor.call(this, group, points[1]);

            return group;
        };
    }());
        
    GResizableLine.prototype.destroy = function () {
        Group.prototype.destroy.call(this);
    };

    /** 调整大小，用于同步那些通过属性面板修改导致的大小调整 */
    GResizableLine.prototype.resize = function (shiftY,shiftAnchorStart,shiftAnchorEnd) {
        var line = this.resizableShape;
        var anchorStart = this.anchorStart;
        var anchorEnd = this.anchorEnd;
        var lastPosX = this.anchorStart.getX();
        var cursorPosX = this.anchorEnd.getX();
        var lastPosY = this.anchorStart.getY();
        var cursorPosY = this.anchorEnd.getY();
        var x,y;
        if(shiftY){//按住shift垂直调整管道
            if(shiftAnchorStart && shiftAnchorEnd){
                anchorStart = this.anchorEnd;
                anchorEnd = this.anchorStart;
                cursorPosX = this.anchorStart.getX();
                lastPosX = this.anchorEnd.getX();
                cursorPosY = this.anchorStart.getY();
                lastPosY = this.anchorEnd.getY();
            }
            if (anchorStart) {
                if (Math.abs(lastPosX - cursorPosX) < Math.abs(lastPosY - cursorPosY)) {
                    x = lastPosX;
                    y = cursorPosY;
                } else {
                    x = cursorPosX;
                    y = lastPosY;
                }
            } else {
                x = cursorPosX;
                y = cursorPosY;
            }
            line.points([anchorStart.getX(), anchorStart.getY(), x,y]);
            anchorEnd.setAbsolutePosition({x:x,y:y});
        } else {
            line.points([anchorStart.getX(), anchorStart.getY(), anchorEnd.getX(), anchorEnd.getY()]);
        }
    };

    GResizableLine.prototype.resizeShape = function () {
        var shape = this.shape;
        var points = shape.store.model['option.points']();
        var startPoint = this.anchorStart.getAbsolutePosition();
        var endPoint = this.anchorEnd.getAbsolutePosition();

        startPoint = this.painter.transform(startPoint);
        endPoint = this.painter.transform(endPoint);

        shape.store.model['option.points']([startPoint, endPoint]);

        this.layer.draw();
    };

    window.GResizableLine = GResizableLine;
} (Konva.Group));