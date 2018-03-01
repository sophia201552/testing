var gPolygonArr = [];

(function (exports, THeatP) {
    var tpl = '<div class="dropdown" id="divHeat">\
    <button class="dropdown-toggle " data-toggle="dropdown" data-type="heatCtrl" title=" ' + '" role="button" aria-expanded="false"><span class="iconfont icon-relitu"></span></button>\
    <ul class="dropdown-menu dropdown-menu-right" style="left:32px;top:-15px;">\
        <li><a href="javascript:;" data-value="constituency"><span class="iconfont icon-relituxuanqu" aria-hidden="true"></span><span class="constituency">热力图选区</span></a></li>\
        <li><a href="javascript:;" data-value="sign"><span class="iconfont icon-relitubiaoji" aria-hidden="true"></span><span class="sign">热力图标记</span></a></li>\
    </ul>\
    </div>';
    var _this;
    function THeat(toolbar, container) {
        this.toolbar = toolbar;
        this.screen = toolbar.screen;
        this.painter = toolbar.painter;

        this.container = container;
        this.layer = this.painter.interactiveLayer;
        this.element = undefined;

        this.polygon = undefined;
        this.pointTarget = undefined;
        this.tHeatP = undefined;
        this.iconArr = ['icon-relitu', 'icon-relituxuanqu', 'icon-relitubiaoji'];
        this.RANGE = 4/this.painter.scale;
        _this = this;
    }

    THeat.prototype.option = {
        cursor: 'crosshair'
    };

    THeat.prototype.init = function () {
        this.element = HTMLParser(tpl);
        this.container.appendChild(this.element);
        $(this.container).find('.constituency').text(I18n.resource.mainPanel.tLayout.HEATAREA);
        $(this.container).find('.sign').text(I18n.resource.mainPanel.tLayout.HEATSOURSE);
    };

    THeat.prototype.show = function () {
        this.init();
        this.attachEvents();
    };

    THeat.prototype.attachEvents = function () {
        $(this.element).children('.dropdown-menu').on('click', 'a', function () {
            var $this = $(this), index;
            $('#toolbar .btn-switch.t-active').removeClass('t-active');
            index = $this.find('.iconfont').index('#divHeat .iconfont');
            $this.closest('.dropdown-menu').siblings('.dropdown-toggle').addClass('btn-switch t-active').find('.iconfont').removeClass(_this.iconArr.join(' ')).addClass(_this.iconArr[index]);
            index===1&&_this.toolbar.cursor('crosshair');
            _this[this.dataset.value]();
            _this.painter.setActiveWidgets();
        })
    };
    //移除事件
    THeat.prototype.initHeatMode = function () {
        delete this.painter.mouseDownActionPerformed;
        delete this.painter.mouseUpActionPerformed;
        delete this.painter.mouseMoveActionPerformed;
        delete this.painter.keyDownActionPerformed;
        delete this.painter.customCtrlZKeyUpActionPerformed;
    };

    //绑定事件
    THeat.prototype.setConstituencyMode = function () {
        this.painter.mouseDownActionPerformed = this.mouseDown.bind(this);
        this.painter.mouseUpActionPerformed = this.mouseUp.bind(this);
        this.painter.mouseMoveActionPerformed = this.mouseMove.bind(this);
        this.painter.keyDownActionPerformed = this.keyDown.bind(this);
        this.painter.customCtrlZKeyUpActionPerformed = this.keyUp.bind(this);
    };

    //选区按钮点击执行
    THeat.prototype.constituency = function () {
        //防止中断
        if (!this.polygon) {
            this.polygon = new Polygon();
        }
        this.pointTarget = this.polygon;
        this.initHeatMode();
        this.setConstituencyMode();
    };

    //标记按钮点击执行  
    THeat.prototype.sign = function () {
        //从另一js执行
        this.tHeatP = new THeatP(this.toolbar, this.container);
        this.tHeatP.show();
    };
    
    THeat.prototype.mouseDown = function (e) {
        var evt = e.evt;
        var pos = {};
        pos = this.tools._dealWithShiftKey(evt.shiftKey, this.polygon.previewPoints.slice(0, 2), [evt.transformedX, evt.transformedY]);
        // 判断是否在起始点上
        if (this.polygon.isFirstP&&!this.polygon.isSameP) {
            pos.x = this.polygon.points[0];
            pos.y = this.polygon.points[1];
            //删除连接标记
            this.polygon.circle.destroy();
        } else if (this.polygon.isSameP) {
            pos.x = this.polygon.circle.x();
            pos.y = this.polygon.circle.y();
            //删除连接标记
            this.polygon.circle.destroy();
        }

        this.polygon.mDownX = pos.x;
        this.polygon.mDownY = pos.y;

        this.polygon.pointArr.push([this.polygon.mDownX, this.polygon.mDownY]);
        
        this.polygon.points.push(this.polygon.mDownX,this.polygon.mDownY);
        
        this.polygon.previewPoints = [this.polygon.mDownX, this.polygon.mDownY];
        if (!this.polygon.line) {
            this.polygon.line = new Konva.Line({
                points: this.polygon.points,
                stroke: '#2780C4',
                strokeWidth: 1,
                lineJoin: 'round',
                visible: true
            });
            this.layer.add(this.polygon.line);
        } else {
            this.polygon.line.points(this.polygon.points);
        }

        if (!this.polygon.previewLine) {
            this.polygon.previewLine = new Konva.Line({
                points: this.polygon.previewPoints,
                stroke: '#2780C4',
                strokeWidth: 1,
                dash: [2, 2]
            });
            this.layer.add(this.polygon.previewLine);
        } else {
            this.polygon.previewLine.points(this.polygon.previewPoints);
        }
        this.layer.draw();
        //如果回到连接点
        if (this.polygon.isFirstP) {
            
            //删除原来连线，创建线多边形
            this.polygon.line.destroy();
            this.polygon.points.pop();
            this.polygon.points.pop();
            this.tools._save();
            //初始化属性
            this.polygon = undefined;
            //this.pointTarget = undefined;
            this.initHeatMode();
            this.toolbar.switchTool();
        }
    };

    THeat.prototype.mouseUp = function (e) {
        var evt = e.evt;
    };

    THeat.prototype.mouseMove = function (e) {
        var evt = e.evt;
        var p = {};
        var points;
        if (!this.polygon) return;
        p = this.tools._dealWithShiftKey(evt.shiftKey, this.polygon.previewPoints.slice(0, 2), [evt.transformedX, evt.transformedY]);
        this.polygon.mDownX = p.x;
        this.polygon.mDownY = p.y;
        if (this.polygon.circle) {
            this.polygon.circle.destroy();
        }
        this.polygon.isFirstP = false;
        this.polygon.isSameP = false;
        //热力图附近点吸附
        var target = GUtil.getIntersectionByPoint(evt.layerX, evt.layerY, this.painter.getCanvasLayer(), this.painter.getRootLayer());
        if (target && target.store.model.type() === 'CanvasHeat') {
            points = target.store.model['option.points']();
            for (var i = 0, len = points.length; i < len; i += 2) {
                this.polygon.isSameP = (Math.abs(points[i] - p.x) <= this.RANGE && Math.abs(points[i + 1] - p.y) <= this.RANGE) ? true : false;
                if (this.polygon.isSameP) {
                    // 显示连接标记
                    this.polygon.circle = new Konva.Circle({
                        name: 'circle',
                        x: points[i],
                        y: points[i+1],
                        radius: this.RANGE,
                        strokeWidth: 2,
                        stroke: '#ff0000'
                    });
                    this.layer.add(this.polygon.circle)
                    break;
                }
            }
        }
        if (this.polygon.previewPoints.length > 0) {
            this.polygon.previewPoints.splice(2, 2, this.polygon.mDownX, this.polygon.mDownY);
            this.polygon.previewLine.points(this.polygon.previewPoints);
        }

        // 判断是否在起始点上
        this.polygon.isFirstP = (Math.abs(this.polygon.points[0] - this.polygon.mDownX) <= this.RANGE && Math.abs(this.polygon.points[1] - this.polygon.mDownY) <= this.RANGE && this.polygon.pointArr.length > 2) ? true : false;

        if (this.polygon.isFirstP&&!this.polygon.isSameP) {
            // 显示连接标记
            this.polygon.circle = new Konva.Circle({
                name: 'circle',
                x: this.polygon.points[0],
                y: this.polygon.points[1],
                radius: this.RANGE,
                strokeWidth: 2,
                stroke: '#ff0000'
            });
            this.layer.add(this.polygon.circle);
        }
        this.layer.draw();
    };

    THeat.prototype.keyDown = function (e) {
        var evt = e.evt;
        var code = e.keyCode;
        // ESC，取消当前画的线
        if (code === 32 || code === 27) {
            // 删除对 move 事件的处理
            this.initHeatMode();
            this.polygon.line && this.polygon.line.destroy();
            this.polygon.previewLine && this.polygon.previewLine.destroy();
            this.polygon.circle && this.polygon.circle.destroy();
            this.polygon = undefined;
            this.pointTarget = undefined;
            this.toolbar.switchTool();
            this.layer.draw();
        }
    };

    THeat.prototype.keyUp = function (e) {
        var which = e.which;
        if (!e.ctrlKey) return;
        // ctrl+z
        if (which === 90 && this.polygon) {
            var pointArr = this.polygon.pointArr;
            var pointArrLen = pointArr.length-2;
            var pointsLen = this.polygon.points.length-2;
            if(pointArrLen < 0 || pointsLen < 0){
                return;
            }else{
                //this.polygon.mDownX = pointArr[pointArrLen].x;
                //this.polygon.mDownY = pointArr[pointArrLen].y;
                this.polygon.pointArr.splice(pointArrLen,1);
                this.polygon.points.splice(pointsLen,2);
                this.polygon.previewPoints = this.polygon.points.slice(pointsLen-2);

                this.polygon.line.points(this.polygon.points);
                this.layer.draw();

                this.polygon.previewLine.points(this.polygon.previewPoints);
                this.layer.draw();
            }
        }
    };

    THeat.prototype.close = function () { };
    
    
    THeat.prototype.tools = {
        //保存
        _save: function () {
            var entity,layerId;
            var models = [];
            // 坐标系转换
            var points = _this.pointTarget.points.concat();
            var activeLayers = _this.painter.state.activeLayers();
            if(activeLayers.length > 0){
                layerId = activeLayers[0].store.model._id();
            }
            entity = this._createEntity(points); 
            entity.layerId = layerId||'';
            entity.isHide = 0;
            models.push(new NestedModel(entity));
            _this.painter.store.widgetModelSet.append(new NestedModel(entity));
        },

        //数据格式
        _createEntity: function (points) {
            var entity = {};
            entity.type = 'CanvasHeat';
            entity._id = ObjectId();
            entity.idDs = [];
            entity.x = points[0][0];
            entity.y = points[0][1];
            entity.w = 20;
            entity.h = 20;
            entity.option = {
                points: points,
                color: '#ccc',
                width: 2,
                closed: true,
                tempPointNum: _this.pointTarget.tepmPointNum,
                tempPointArr: _this.pointTarget.tempPointArr,
                tempPointId: _this.pointTarget.tepmPointId
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

    window.THeat = THeat;

   //多边形相关属性
    var Polygon = function (line, points, tepmPointNum, tempPointArr) {
        this.pointArr = [];
        this.line = line||undefined;
        this.previewLine = undefined;
        this.points = points||[];
        this.previewPoints = [];
        this.circle = null;
        this.mDownX = undefined;
        this.mDownY = undefined;
        this.isFirstP = false;
        this.isSameP = false;
        this.tepmPointNum = tepmPointNum||0;
        this.tempPointArr = tempPointArr || [];
        this.tepmPointId = '';
    };
   exports.THeat = THeat;
}(
    namespace('toolbar'),
    namespace('toolbar.THeatP')
));