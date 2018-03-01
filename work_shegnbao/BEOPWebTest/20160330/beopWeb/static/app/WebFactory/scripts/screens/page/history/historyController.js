(function (window, $) {
    var _this;

    //////////////
    // REGISTER //
    //////////////
    function OpType(id, name) {
        this.id = id;
        this.name = name;
    }
    
    var opTypes = {
        UNDEFINED: new OpType(0, ''),
        // 创建图层
        CREATE_LAYER: new OpType(100, ''),
        // 删除图层
        DELETE_LAYER: new OpType(101, ''),
        // 修改图层名称
        CHANGE_LAYER_NAME: new OpType(102, ''),
        // 显示图层
        SHOW_LAYER: new OpType(103, ''),
        // 隐藏图层
        HIDE_LAYER: new OpType(104, ''),
        // 锁定图层
        LOCK_LAYER: new OpType(105, ''),
        // 解锁图层
        UNLOCK_LAYER: new OpType(106, ''),
        //导出图层
        EXPORT_LAYER: new OpType(107, ''),
        //导入图层
        IMPORT_LAYER: new OpType(108, ''),
        // 创建控件
        CREATE_WIDGET: new OpType(200, ''),
        // 删除控件
        DELETE_WIDGET: new OpType(201, ''),
        // 移动控件位置
        MOVE_WIDGET: new OpType(300, ''),
        // 调整控件大小
        RESIZE_WIDGET: new OpType(301, ''),
        //移动控件位置或者调整控件大小
        MOVE_WIDGET_OR_RESIZE_WIDGET: new OpType('302', ''),
        // 创建按钮控件
        CREATE_BUTTON_WIDGET: new OpType(400, ''),
        // 删除按钮控件
        DELETE_BUTTON_WIDGET: new OpType(401, ''),
        // 改变按钮控件文字
        CHANGE_BUTTON_WIDGET_TEXT: new OpType(402, ''),
        // 改变按钮控件样式
        CHANGE_BUTTON_WIDGET_STYLE: new OpType(403, ''),
        //给按钮控件添加数据源
        ADD_BUTTON_WIDGET_IDDS: new OpType(404, ''),
        //改变按钮控件枚举
        CHANGE_BUTTON_WIDGET_ENUMERATE: new OpType(405, ''),
        //改变按钮控件数据源
        CHANGE_BUTTON_WIDGET_IDDS: new OpType(406, ''),
        //改变按钮控件自定义样式
        CHANGE_BUTTON_WIDGET_CUSTOMSTYLE: new OpType(407, ''),
        // 创建文本控件
        CREATE_TEXT_WIDGET: new OpType(500, ''),
        // 删除文本控件
        DELETE_TEXT_WIDGET: new OpType(501, ''),
        // 改变文本控件文字
        CHANGE_TEXT_WIDGET_TEXT: new OpType(502, ''),
        // 改变文本控件样式
        CHANGE_TEXT_WIDGET_STYLE: new OpType(503, ''),
        //给文本控件添加数据源
        ADD_TEXT_WIDGET_IDDS: new OpType(504, ''),
        //改变文本控件枚举
        CHANGE_TEXT_WIDGET_ENUMERATE: new OpType(505, ''),
        //改变文本控件数据源
        CHANGE_TEXT_WIDGET_IDDS: new OpType(506, ''),
        //改变文本控件自定义样式
        CHANGE_TEXT_WIDGET_CUSTOMSTYLE: new OpType(507, ''),
        //改变文本控件的数字精确度
        CHANGE_TEXT_WIDGET_PRECISION: new OpType(508, ''),
        // 创建Html容器控件
        CREATE_HTMLCONTAINER_WIDGET: new OpType(600, ''),
        // 删除Html容器控件
        DELETE_HTMLCONTAINER_WIDGET: new OpType(601, ''),
        //改变Html容器控件内容
        CHANGE_HTMLCONTAINER_WIDGET_CONTENT: new OpType(602, ''),
        //导入Html容器控件
        IMPORT_HTMLCONTAINER_WIDGET: new OpType(604, ''),
        // 创建Screen容器控件
        CREATE_HTMLSCREENCONTAINER_WIDGET: new OpType(700, ''),
        // 删除Screen容器控件
        DELETE_HTMLSCREENCONTAINER_WIDGET: new OpType(701, ''),
        //改变Screen容器控件页面内容
        CHANGE_HTMLSCREENCONTAINER_WIDGET_CONTENT: new OpType(702, ''),
        //改变Screen容器控件自定义样式
        CHANGE_HTMLSCREENCONTAINER_WIDGET_CUSTOMSTYLE: new OpType(703, ''),
        // 创建管道控件
        CREATE_PIPE_WIDGET: new OpType(800, ''),
        // 删除管道控件
        DELETE_PIPE_WIDGET: new OpType(801, ''),
        //改变管道控件长度
        CHANGE_PIPE_WIDGET_WIDTH: new OpType(802, ''),
        //改变管道控件颜色
        CHANGE_PIPE_WIDGET_COLOR: new OpType(803, ''),
        //给管道控件添加数据源
        ADD_PIPE_WIDGET_IDDS: new OpType(804, ''),
        //改变管道控件枚举
        CHANGE_PIPE_WIDGET_ENUMERATE: new OpType(805, ''),
        //改变管道控件数据源
        CHANGE_PIPE_WIDGET_IDDS: new OpType(806, ''),
        // 创建图片控件
        CREATE_IMAGE_WIDGET: new OpType(900, ''),
        // 删除图片控件
        DELETE_IMAGE_WIDGET: new OpType(901, ''),
        //改变图片控件内容
        CHANGE_IMAGE_WIDGET_CONTENT: new OpType(902, ''),
        //改变图片控件角度
        CHANGE_IMAGE_WIDGET_ANGLE: new OpType(903, ''),
        //给图片控件添加数据源
        ADD_IMAGE_WIDGET_IDDS: new OpType(904, ''),
        //改变图片控件枚举
        CHANGE_IMAGE_WIDGET_ENUMERATE: new OpType(905, ''),
        //改变图片控件数据源
        CHANGE_IMAGE_WIDGET_IDDS: new OpType(906, '')
    };
    var OP_TYPE = {};

    // 操作类型
    if (!OP_TYPE.__props) OP_TYPE.__props = opTypes;
    Object.keys(opTypes).forEach(function (propName) {
        Object.defineProperty(OP_TYPE, propName, {
            get: function () {
                // I18N 翻译逻辑
                var op = this.__props[propName];
                op.name = I18n.resource.mainPanel.historyPanel[propName];
                return op;
            }
        });
    });
    

    ////////////////////////
    // HISTORY CONTROLLER //
    ////////////////////////
    function HistoryController(page) {
        _this = this;
        this.page = page;
        this.store = {};
        this.store.records = new window.ModelSet();
        this.store.snapshotModelSet = page.store.snapshotModelSet;

        this.state = new Model({
            index: -1,
            snapshotId: -1
        });

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
            'update.x,update.y,update.w,update.h': OP_TYPE.MOVE_WIDGET_OR_RESIZE_WIDGET,
            'update.option': OP_TYPE.UNDEFINED
        };

        switch(type) {
            case 'HtmlButton':
                opMap['update.option.text'] = OP_TYPE.CHANGE_BUTTON_WIDGET_TEXT;
                opMap['update.option.class'] = OP_TYPE.CHANGE_BUTTON_WIDGET_STYLE;
                opMap['update.idDs,update.option.text'] = OP_TYPE.ADD_BUTTON_WIDGET_IDDS;
                opMap['update.option.trigger'] = OP_TYPE.CHANGE_BUTTON_WIDGET_ENUMERATE;
                opMap['update.idDs,update.option.trigger,update.option.text'] = OP_TYPE.CHANGE_BUTTON_WIDGET_IDDS;
                opMap['update.option.style'] = OP_TYPE.CHANGE_BUTTON_WIDGET_CUSTOMSTYLE;
                break;
            case 'HtmlText':
                opMap['update.option.text'] = OP_TYPE.CHANGE_TEXT_WIDGET_TEXT;
                opMap['update.option.class'] = OP_TYPE.CHANGE_TEXT_WIDGET_STYLE;
                opMap['update.idDs,update.option.text'] = OP_TYPE.ADD_TEXT_WIDGET_IDDS;
                opMap['update.option.trigger'] = OP_TYPE.CHANGE_TEXT_WIDGET_ENUMERATE;
                opMap['update.idDs,update.option.trigger,update.option.text'] = OP_TYPE.CHANGE_TEXT_WIDGET_IDDS;
                opMap['update.option.style'] = OP_TYPE.CHANGE_TEXT_WIDGET_CUSTOMSTYLE;
                opMap['update.option.precision'] = OP_TYPE.CHANGE_TEXT_WIDGET_PRECISION;
                break;
            case 'HtmlContainer':
                opMap['update.option'] = OP_TYPE.CHANGE_HTMLCONTAINER_WIDGET_CONTENT;
                opMap['update.option,update.templateId'] = OP_TYPE.IMPORT_HTMLCONTAINER_WIDGET;
                break;
            case 'HtmlScreenContainer':
                opMap['update.option.style'] = OP_TYPE.CHANGE_HTMLSCREENCONTAINER_WIDGET_CUSTOMSTYLE;
                opMap['update.option.pageId,update.option.pageType'] = OP_TYPE.CHANGE_HTMLSCREENCONTAINER_WIDGET_CONTENT;
                break;
            case 'CanvasPipe':
                opMap['update.option.points'] = OP_TYPE.MOVE_WIDGET_OR_RESIZE_WIDGET;
                opMap['update.option.width'] = OP_TYPE.CHANGE_PIPE_WIDGET_WIDTH;
                opMap['update.option.color'] = OP_TYPE.CHANGE_PIPE_WIDGET_COLOR;
                opMap['update.idDs'] = OP_TYPE.ADD_PIPE_WIDGET_IDDS;
                opMap['update.option.trigger'] = OP_TYPE.CHANGE_PIPE_WIDGET_ENUMERATE;
                opMap['update.idDs,update.option.trigger'] = OP_TYPE.CHANGE_PIPE_WIDGET_IDDS;
                break;
            case 'CanvasImage':
                opMap['update.w,update.h,update.option.trigger.default'] = OP_TYPE.CHANGE_IMAGE_WIDGET_CONTENT;
                opMap['update.option.rotate'] = OP_TYPE.CHANGE_IMAGE_WIDGET_ANGLE;
                opMap['update.idDs'] = OP_TYPE.ADD_IMAGE_WIDGET_IDDS;
                opMap['update.option.trigger'] = OP_TYPE.CHANGE_IMAGE_WIDGET_ENUMERATE;
                opMap['update.idDs,update.option.trigger'] = OP_TYPE.CHANGE_IMAGE_WIDGET_IDDS;
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
        var snapshotId = this.state.snapshotId();
        var snapshot = null;

        // 如果为 -1 的话，加载快照
        if (index === -1) {
            // 为 -1 的话，默认加载第一个
            if (snapshotId === -1) {
                snapshot = this.store.snapshotModelSet.get(0);
            } else {
                snapshot = this.store.snapshotModelSet.findByProperty('_id', snapshotId);
            }
            this.update(snapshot.content())
            return;
        }

        this.update(this.get(index).data);
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
            index = Math.min(Math.max(-1, index+1), len-1);
            _this.state.index(index);
        }
        // ctrl+z
        else if (which === 90) {
            index = Math.min(Math.max(-1, index-1), len-1);
            _this.state.index(index);
        }
    };

    HistoryController.prototype.addRecord = function (type, op) {
        var state, data;

        // 冻结期间不添加任何记录
        if (this.frozen) return;

        state = this.state.serialize()

        data = $.deepClone({
            layers: this.page.getLayersData().serialize(),
            widgets: this.page.getWidgetsData().serialize()
        });

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
