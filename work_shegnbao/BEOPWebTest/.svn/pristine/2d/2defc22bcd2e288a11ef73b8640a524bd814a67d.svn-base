(function (exports) {
    var _this;
    function TPolygon(toolbar, container) {
        this.toolbar = toolbar;
        this.screen = toolbar.screen;
        this.painter = toolbar.painter;

        this.container = container;
        this.layer = this.painter.interactiveLayer;

        this.element = undefined;
        this.pointArr = [];
        this.line = undefined;
        this.previewLine = undefined;
        this.points = [];
        this.previewPoints = [];
        this.circle = undefined;
        this.mDownX = undefined;
        this.mDownY = undefined;
        this.isFirstP = false;
        this.isSameP = false;
        this.RANGE = 4 / this.painter.scale;

        _this = this;  
    }

    TPolygon.prototype.option = {
        cursor: 'crosshair'
    };

    TPolygon.prototype.init = function () {
        var tpl = '\
<button class="btn-switch" title="'+I18n.resource.mainPanel.toolbar.POLYGON_TOOL+'" data-type="polygonCtrl">\
    <span class = "iconfont icon-duobianxing"></span>\
</button>';
        this.element = HTMLParser(tpl);
        this.container.appendChild(this.element);
        this.attachEvents();
    };

    TPolygon.prototype.show = function () {
        this.init();  
    };

    TPolygon.prototype.attachEvents = function () {
        $(this.element).off('click').on('click', function () {
            var $this = $(this);
            $('#toolbar .btn-switch.t-active').removeClass('t-active');
            $this.addClass('t-active');
            _this.painter.setActiveWidgets();
            _this.offMode();
            _this.onMode();
        })
    };
    //移除事件
    TPolygon.prototype.offMode = function () {
        delete this.painter.mouseDownActionPerformed;
        delete this.painter.mouseUpActionPerformed;
        delete this.painter.mouseMoveActionPerformed;
        delete this.painter.keyDownActionPerformed;
        delete this.painter.customCtrlZKeyUpActionPerformed;
    };

    //绑定事件
    TPolygon.prototype.onMode = function () {
        this.painter.mouseDownActionPerformed = this.mouseDown.bind(this);
        this.painter.mouseUpActionPerformed = this.mouseUp.bind(this);
        this.painter.mouseMoveActionPerformed = this.mouseMove.bind(this);
        this.painter.keyDownActionPerformed = this.keyDown.bind(this);
        this.painter.customCtrlZKeyUpActionPerformed = this.keyUp.bind(this);
    };

    
    TPolygon.prototype.mouseDown = function (e) {
        var evt = e.evt;
        var pos = {};
        pos = this.tools._dealWithShiftKey(evt.shiftKey, this.previewPoints.slice(0, 2), [evt.transformedX, evt.transformedY]);

        // 判断是否在起始点上
        if (this.isFirstP&&!this.isSameP) {
            this.mDownX = this.points[0];
            this.mDownY = this.points[1];
            //删除连接标记
            this.circle.destroy();
        } else if (this.isSameP) {
            this.mDownX = this.circle.x();
            this.mDownY = this.circle.y();
            this.pointArr.push([this.mDownX, this.mDownY]);
            this.points.push(this.mDownX,this.mDownY);
            //删除连接标记
            this.circle.destroy();
        } else {
            this.mDownX = pos.x;
            this.mDownY = pos.y;
            this.pointArr.push([this.mDownX, this.mDownY]);
            this.points.push(this.mDownX,this.mDownY);
        }

        this.previewPoints = [this.mDownX, this.mDownY];
        if (!this.line) {
            this.line = new Konva.Line({
                points: this.points,
                stroke: '#2780C4',
                strokeWidth: 1,
                lineJoin: 'round'
            });
            this.layer.add(this.line);
        } else {
            this.line.points(this.points);
        }
        if (!this.previewLine) {
            this.previewLine = new Konva.Line({
                points: this.previewPoints,
                stroke: '#2780C4',
                strokeWidth: 1,
                dash: [2, 2]
            });
            this.layer.add(this.previewLine);
        } else {
            this.previewLine.points(this.previewPoints);
        }
        this.layer.draw();
        //如果回到连接点
        if (this.isFirstP) {
            //删除原来连线，创建线多边形
            this.line.destroy();
            this.tools._save();
            //初始化属性
            this.element = undefined;
            this.pointArr = [];
            this.line = undefined;
            this.previewLine = undefined;
            this.points = [];
            this.previewPoints = [];
            this.circle = undefined;
            this.mDownX = undefined;
            this.mDownY = undefined;
            this.isFirstP = false;
            this.isSameP = false;
            this.offMode();
            this.toolbar.switchTool();
        }
    };

    TPolygon.prototype.mouseUp = function (e) {
        var evt = e.evt;
    };

    TPolygon.prototype.mouseMove = function (e) {
        var evt = e.evt;
        var pos = {};
        pos = this.tools._dealWithShiftKey(evt.shiftKey, this.previewPoints.slice(0, 2), [evt.transformedX, evt.transformedY]);
        this.mDownX = pos.x;
        this.mDownY = pos.y;
        if (this.circle) {
            this.circle.destroy();
            this.layer.draw();
        }
        this.isFirstP = false;
        this.isSameP = false;
        //多边形附近点吸附
        var target = GUtil.getIntersectionByPoint(evt.layerX, evt.layerY, this.painter.getCanvasLayer(), this.painter.getRootLayer());
        if (target && target.store.model.type() === 'CanvasPolygon') {
            var points = target.store.model['option.points']();
            for (var i = 0, len = points.length; i < len; i += 2) {
                this.isSameP = (Math.abs(points[i] - pos.x) <= this.RANGE && Math.abs(points[i + 1] - pos.y) <= this.RANGE) ? true : false;
                if (this.isSameP) {
                    // 显示连接标记
                    this.circle = new Konva.Circle({
                        name: 'circle',
                        x: points[i],
                        y: points[i+1],
                        radius: this.RANGE,
                        strokeWidth: 2,
                        stroke: '#ff0000'
                    });
                    this.layer.add(this.circle)
                    this.layer.draw();
                    break;
                }
            }
        }
        if (!this.line) return;
        if (this.previewPoints.length > 0) {
            this.previewPoints.splice(2, 2, this.mDownX, this.mDownY);
            this.previewLine.points(this.previewPoints);
        }

        // 判断是否在起始点上
        this.isFirstP = (Math.abs(this.points[0] - this.mDownX) <= this.RANGE && Math.abs(this.points[1] - this.mDownY) <= this.RANGE && this.pointArr.length > 2) ? true : false;

        if (this.isFirstP&&!this.isSameP) {
            // 显示连接标记
            this.circle = new Konva.Circle({
                name: 'circle',
                x: this.points[0],
                y: this.points[1],
                radius: this.RANGE,
                strokeWidth: 2,
                stroke: '#ff0000'
            });
            this.layer.add(this.circle);
        }
        this.layer.draw();
    };

    TPolygon.prototype.keyDown = function (e) {
        var evt = e.evt;
        var code = e.keyCode;
        // ESC，取消当前画的线
        if (code === 32 || code === 27) {
            this.line && this.line.destroy();
            this.previewLine && this.previewLine.destroy();
            this.circle && this.circle.destroy();
            //初始化属性
            this.element = undefined;
            this.pointArr = [];
            this.line = undefined;
            this.previewLine = undefined;
            this.points = [];
            this.previewPoints = [];
            this.circle = undefined;
            this.mDownX = undefined;
            this.mDownY = undefined;
            this.isFirstP = false;
            this.isSameP = false;
            this.offMode();
            this.toolbar.switchTool();
            this.layer.draw();
        }
    };

    TPolygon.prototype.keyUp = function (e) {
        var which = e.which;
        if (!e.ctrlKey) return;
        // ctrl+z
        if (which === 90 && this.line) {
            var pointArr = this.pointArr;
            var pointArrLen = pointArr.length-2;
            var pointsLen = this.points.length-2;
            if(pointArrLen < 0 || pointsLen < 0){
                return;
            }else{
                this.pointArr.splice(pointArrLen,1);
                this.points.splice(pointsLen,2);
                this.previewPoints = this.points.slice(pointsLen-2);

                this.line.points(this.points);
                this.layer.draw();

                this.previewLine.points(this.previewPoints);
                this.layer.draw();
            }
        }
    };

    TPolygon.prototype.close = function () { };
    
    
    TPolygon.prototype.tools = {
        //保存
        _save: function () {
            var entity;
            var models = [];
            // 坐标系转换
            var points = _this.points;
            entity = this._createEntity(points);
            entity.layerId = '';
            models.push(new NestedModel(entity));
            _this.painter.store.widgetModelSet.append(new NestedModel(entity));
        },

        //数据格式
        _createEntity: function (points) {
            var entity = {};
            entity.type = 'CanvasPolygon';
            entity._id = ObjectId();
            entity.idDs = [];
            entity.x = 0;
            entity.y = 0;
            entity.w = 0;
            entity.h = 0;
            entity.option = {
                points: points,
                color: '#ccc',
                width: 2,
                events: []
            };
            return entity;
        },

        //按住shift时的坐标
        _dealWithShiftKey: function (shiftKey, lastPos, cursorPos) {
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
        }
    };

    window.TPolygon = TPolygon;

   exports.TPolygon = TPolygon;
}(
    namespace('toolbar')
));