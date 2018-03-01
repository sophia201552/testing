(function (exports) {
    var _this;

    function THeatP(toolbar, container) {
        this.toolbar = toolbar;
        this.screen = toolbar.screen;
        this.painter = toolbar.painter;

        this.container = container;
        this.layer = this.painter.interactiveLayer;

        this.polygon = undefined;
        this.tempPoint = undefined;

        this.isMouseOut = true;
        this.objId = ObjectId();
        this.target = undefined;
        this.lastTargetId = undefined;
        this.targetId = undefined;
        this.border = undefined;//高亮边框
        _this = this;
    };

    THeatP.prototype.option = {
        cursor: 'crosshair'
    };

    THeatP.prototype.init = function () {

    };

    THeatP.prototype.show = function () {
        this.removeEvent();
        this.attachEvent();
        this.tempPoint = new TempPoint();
    };

    THeatP.prototype.attachEvent = function () {
        this.painter.mouseDownActionPerformed = this.mouseDown.bind(this);
        this.painter.mouseUpActionPerformed = this.mouseUp.bind(this);
        this.painter.mouseMoveActionPerformed = this.mouseMove.bind(this);
        this.painter.keyDownActionPerformed = this.keyDown.bind(this);
    };

    THeatP.prototype.removeEvent = function () {
        delete this.painter.mouseDownActionPerformed;
        delete this.painter.mouseUpActionPerformed;
        delete this.painter.mouseMoveActionPerformed;
        delete this.painter.keyDownActionPerformed;
    };

    THeatP.prototype.mouseDown = function (e) {
        //鼠标不在图形内点击
        if (this.isMouseOut) return;
        var evt = e.evt;

        var item = [evt.transformedX-5, evt.transformedY-5];
        this.tempPoint.pointArr.push(item);
        
        //取消高亮
        this.border&&this.border.destroy();

        this.layer.draw();
        //喜加一
        var model = this.target.store.model;
        var num = model['option.tempPointNum']()+1,
            tempPointArr = model['option.tempPointArr']().concat(this.tempPoint.pointArr),
            id = model._id(),
            polygonArr = model['option.points']();
        model['option.tempPointNum'](num);
        model['option.tempPointArr'](tempPointArr);
        model['option.tempPointId'](this.objId);
        this.tools._save(item, num, tempPointArr, id, polygonArr);
        //初始化
        this.border = undefined;
        this.removeEvent();
        this.toolbar.switchTool();
        this.tempPoint = undefined;

    };

    THeatP.prototype.mouseUp = function (e) {
        
    };

    THeatP.prototype.mouseMove = function (e) {
        var evt = e.evt;
        this.target = GUtil.getIntersectionByPoint(evt.layerX, evt.layerY, this.painter.getCanvasLayer(), this.painter.getRootLayer());
        if (!this.target || this.target.store.model.type() !== 'CanvasHeat') {
            if (!this.isMouseOut) {
                //鼠标移出区块
                //取消高亮
                this.border&&this.border.destroy();
                this.layer.draw();
            }
            this.isMouseOut = true;
        } else if (this.target && this.target.store.model.type() === 'CanvasHeat') {
            if (this.targetId !== this.lastTargetId) {
                //鼠标移出区块
                //取消高亮
                this.border && this.border.destroy();
                this.layer.draw();
                this.isMouseOut = true;

            }
            if (this.isMouseOut && this.target.store.model['option.tempPointNum']() === 0) {
                //鼠标移入区块
                //区块高亮
                
                var points = this.target.store.model['option.points']();
                this.border = new Konva.Line({
                    points: points,
                    stroke: '#000',
                    strokeWidth: 1,
                    closed: true
                })
                this.layer.add(this.border);
                this.layer.draw();
                this.isMouseOut = false;
            }
            this.lastTargetId = this.target.shape._id
            
        }
        

        
    };

    THeatP.prototype.keyDown = function (e) {
        var code = e.keyCode;
        if (code === 32 || code === 27) {
            //初始化
            this.border && (this.border.destroy(), this.layer.draw());
            this.isMouseOut = true;
            this.border = undefined;
            this.removeEvent();
            this.toolbar.switchTool();
            this.tempPoint = undefined;
        }
    };

    THeatP.prototype.tools = {

        _save: function (item, num, tempPointArr, polygonId, polygonArr) {
            var entity, layerId;
            var activeLayers = _this.painter.state.activeLayers();
            if(activeLayers.length > 0){
                layerId = activeLayers[0].store.model._id();
            }
            entity = this._createEntity(item, num, tempPointArr, polygonId, polygonArr);
            entity.layerId = layerId||'';
            entity.isHide = 0;
            _this.painter.store.widgetModelSet.append(new NestedModel(entity));
        },

        _createEntity: function (tempPoints, num, tempPointArr, polygonId, polygonArr) {
            var entity = {};

            //this.info = GUtil.getPipeRect(points);

            entity.type = 'CanvasHeatP';
            entity._id = _this.objId;
            entity.idDs = [];
            entity.x = tempPoints[0];
            entity.y = tempPoints[1];
            entity.w = 20;
            entity.h = 20;
            entity.option = {
                radius: 10,
                fill: '#000000',
                fontSize: 8,
                unitType: 0,
                num: num,
                tempPointArr: tempPointArr,
                polygonId: polygonId,
                polygonArr: polygonArr,
                preview: []
            };
            return entity;
        }
    };

    window.THeatP = THeatP;
    

    var TempPoint = function () {
        this.pointArr = [];
        this.circle = null;
        this.poly = undefined;
    }

    exports.THeatP = THeatP;
}(namespace('toolbar')))