(function (window, $) {
    var _this;

    //////////////
    // REGISTER //
    //////////////
    function OpType(id, name) {
        this.id = id;
        this.name = name;
    }

    // 操作类型
    var OP_TYPE = {
        UNDEFINED: new OpType(0, '未定义的操作'),
        // 创建图层
        CREATE_LAYER: new OpType(100, '创建图层'),
        // 删除图层
        DELETE_LAYER: new OpType(101, '删除图层'),
        // 修改图层名称
        CHANGE_LAYER_NAME: new OpType(102, '修改图层名称'),
        // 显示图层
        SHOW_LAYER: new OpType(103, '显示图层'),
        // 隐藏图层
        HIDE_LAYER: new OpType(104, '隐藏图层'),
        // 锁定图层
        LOCK_LAYER: new OpType(105, '锁定图层'),
        // 解锁图层
        UNLOCK_LAYER: new OpType(106, '解锁图层'),
        // 创建控件
        CREATE_WIDGET: new OpType(200, '创建控件'),
        // 删除控件
        DELETE_WIDGET: new OpType(201, '删除控件'),
        // 移动控件位置
        MOVE_WIDGET: new OpType(300, '移动位置'),
        // 调整控件大小
        RESIZE_WIDGET: new OpType(301, '调整大小'),
        // 创建按钮控件
        CREATE_BUTTON_WIDGET: new OpType(400, '创建按钮控件'),
        // 删除按钮控件
        DELETE_BUTTON_WIDGET: new OpType(401, '删除按钮控件'),
        // 改变按钮控件文字
        CHANGE_BUTTON_WIDGET_TEXT: new OpType(402, '改变按钮文字'),
        // 改变按钮控件样式
        CHANGE_BUTTON_WIDGET_STYLE: new OpType(403, '改变按钮样式'),
        // 创建文本控件
        CREATE_TEXT_WIDGET: new OpType(500, '创建文本控件'),
        // 删除文本控件
        DELETE_TEXT_WIDGET: new OpType(501, '删除文本控件'),
        // 改变文本控件文字
        CHANGE_TEXT_WIDGET_TEXT: new OpType(502, '改变文本文字'),
        // 改变文本控件样式
        CHANGE_TEXT_WIDGET_STYLE: new OpType(503, '改变文本样式')
    };

    ////////////////////////
    // HISTORY CONTROLLER //
    ////////////////////////
    function HistoryController(page) {
        _this = this;
        this.page = page;
        this.store = {};
        this.store.records = new window.ModelSet();
        this.store.snapshotModelSet = page.store.snapshotModelSet;

        this.state = new Model({index: -1});

        this.frozen = false;
    }

    HistoryController.prototype.init = function (page) {
        this.bindOb();
        // 绑定 ctrl+z 和 ctrl+y 事件
        window.addEventListener('keyup', this.onKeyUpActionPerformed, false);
    };

    HistoryController.prototype.bindOb = function () {
        this.bindOpOb();
        this.state.addEventListener('update.index', this.to, this);
    };

    HistoryController.prototype.bindOpOb = function () {
        var layerModelSet = this.page.getLayersData();
        var widgetModelSet = this.page.getWidgetsData();

        // layer 增和删
        layerModelSet.addEventListener('insert', function (e, data) {
            data.models.forEach(function (model) {
                this.bindLayerOpOb(model);
            }, this);
            this.addRecord('layer', OP_TYPE.CREATE_LAYER);
        }, this);
        layerModelSet.addEventListener('remove', this._getOpHandler('layer', OP_TYPE.DELETE_LAYER), this);
        // layer models
        layerModelSet.forEach(function (model) {
            this.bindLayerOpOb(model);
        }, this);

        // widget 增和删
        widgetModelSet.addEventListener('insert', function (e, data) {
            data.models.forEach(function (model) {
                this.bindWidgetOpOb(model);
            }, this);
            this.addRecord('widget', OP_TYPE.CREATE_WIDGET)   
        }, this);
        widgetModelSet.addEventListener('remove', this._getOpHandler('widget', OP_TYPE.DELETE_WIDGET), this);
        // widget models
        widgetModelSet.forEach(function (model) {
            this.bindWidgetOpOb(model);
        }, this);
    };

    // 绑定 layer 的行为记录事件
    HistoryController.prototype.bindLayerOpOb = function (model) {
        // 只对 canvas 图层做处理
        if (model.type() !== 'canvas') return;

        var opMap = {
            'update.name': OP_TYPE.CHANGE_LAYER_NAME,
            'update.isLock': function () {
                if(model.isLock() === 1) {
                    return OP_TYPE.LOCK_LAYER;
                } else {
                    return OP_TYPE.UNLOCK_LAYER;
                }
            },
            'update.isHide': function () {
                if (model.isHide() === 1) {
                    return OP_TYPE.HIDE_LAYER;
                } else {
                    return OP_TYPE.SHOW_LAYER;
                }
            }
        };

        // 格式化一下，将空格的多个事件分开
        this._formatOpMap(opMap);
        model.addEventListener('update', function (e, type) {
            var op = opMap[type];

            if (!op) {
                this.addRecord('layer', OP_TYPE.UNDEFINED);
            } else {
                this.addRecord('layer', $.type(op) === 'function' ? op() : op);
            }
        }, this);
    };

    // 绑定 widget 的行为记录事件
    HistoryController.prototype.bindWidgetOpOb = function (model) {
        var type = model.type();
        var opMap = {
            'update.x update.y update.x,update.y': OP_TYPE.MOVE_WIDGET,
            'update.w update.h update.w,update.h': OP_TYPE.RESIZE_WIDGET,
            'update.option': OP_TYPE.UNDEFINED
        };

        switch(type) {
            case 'HtmlButton':
                opMap['update.option.text'] = OP_TYPE.CHANGE_BUTTON_WIDGET_TEXT;
                opMap['update.option.class'] = OP_TYPE.CHANGE_BUTTON_WIDGET_STYLE;
                break;
            case 'HtmlText':
                opMap['update.option.text'] = OP_TYPE.CHANGE_TEXT_WIDGET_TEXT;
                opMap['update.option.class'] = OP_TYPE.CHANGE_TEXT_WIDGET_STYLE;
                break;
            default:
                break;
        }

        // 格式化一下，将空格的多个事件分开
        this._formatOpMap(opMap);
        model.addEventListener('update', function (e, type) {
            var op = opMap[type];

            if (!op) {
                this.addRecord('widget', OP_TYPE.UNDEFINED);
            } else {
                this.addRecord('widget', $.type(op) === 'function' ? op() : op);
            }
        }, this);
    };

    HistoryController.prototype._formatOpMap = function (opMap) {
        Object.keys(opMap).forEach(function (row) {
            var arr, v;
            if(row.indexOf(' ') > 0) {
                arr = row.split(' ');
                v = opMap[row];
                arr.forEach(function (t) {
                    opMap[t] = v;
                });
                delete opMap[row];
            }
        });
    };

    HistoryController.prototype._getOpHandler = function (type, op) {
        return function () {
            this.addRecord(type, op);
        }.bind(this);
    };

    HistoryController.prototype.set = function (index, actionName, data) {
        var len = this.store.records.length();

        if( index < len ){
            //在某一条非最后历史记录的基础上发生了改动,该历史记录后面的数据都删除
            for(var i = len - 1; i >= index; i--){
                this.store.records.remove(this.store.records.models[i]);
            }
        }

        this.store.records.append(new Model({
            id: new Date().valueOf(),
            name: actionName,
            data: data
        }));

        if (this.store.records.length() > 20) {
            this.store.records.remove(this.store.records.models[0]);
        }
    };

    HistoryController.prototype.get = function (index) {
        var arr = [];
        var set = this.store.records.serialize();
        var len = set.length;

        if (index < 0 || index >= len) {
            // 超出边界，直接返回空数组
            return null;
        }

        return set[index];
    };

    HistoryController.prototype.to = function () {
        var index = this.state.index();

        if (index === -1) return; 

        this.update(this.get(this.state.index()).data);
    };

    HistoryController.prototype.update = function (data) {
        this.frozen = true;
        this.page.updateModelSet($.deepClone(data));
        this.frozen = false;
    };

    HistoryController.prototype.onKeyUpActionPerformed = function (e) {
        var which = e.which;
        var index, len;
        // 只处理 ctrl+z 和 ctrl+y 事件
        if (!e.ctrlKey) return;

        index = _this.state.index();
        len = _this.store.records.length();
        // ctrl+y
        if (which === 89) {
            index = Math.min(Math.max(0, index+1), len);
            _this.state.index(index);
        }
        // ctrl+z
        else if (which === 90) {
            index = Math.min(Math.max(0, index-1), len);
            _this.state.index(index);
        }
    };

    HistoryController.prototype.addRecord = function (type, op) {
        var state, data;

        // 冻结期间不添加任何记录
        if (this.frozen) return;

        state = this.state.serialize()

        if (type === 'layer') {
            data = $.deepClone({
                layers: this.page.getLayersData().serialize(),
                widgets: this.page.getWidgetsData().serialize()
            });
        } else if (type === 'widget') {
            data = $.deepClone({widgets: this.page.getWidgetsData().serialize()});
        } else {
            data = $.deepClone({
                layers: this.page.getLayersData().serialize(),
                widgets: this.page.getWidgetsData().serialize()
            });
        }

        this.set(state.index+1, op.name, data);

        // 只更改，不触发事件
        state.index = this.store.records.length() - 1;
    };


    HistoryController.prototype.close = function () {
        this.frozen = true;
        window.removeEventListener('onkeyup', this.onKeyUpActionPerformed);
    };

    window.HistoryController = HistoryController;
    
} (window, jQuery));
