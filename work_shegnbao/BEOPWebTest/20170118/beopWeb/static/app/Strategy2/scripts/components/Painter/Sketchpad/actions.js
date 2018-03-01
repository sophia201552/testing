;
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', '../../core/Event.js'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(exports, require('../../core/Event.js'));
    } else {
        factory(
            root,
            namespace('beop.strategy.core.Event')
        );
    }
}(namespace('beop.strategy.components.Painter.Sketchpad'), function(exports, Event) {

    function Actions() {
        this.present = null;
    }

    // PROTOTYPES
    +

    function() {
        var _this;
        /**
         * Constructor
         */
        this.constructor = Actions;
        this.init = function(present) {
            _this = this;
            this.present = present;

            this.bindOb();
        };

        this.bindOb = function() {
            var _this = this;

            this.unbindOb();

            Event.on('SYNC_MODULES_DATA.Sketchpad', function(type, data) {
                _this.sync();
            });

            Event.on('QUERY_MODULES_OUTPUT_DATA.Sketchpad', function(type, data) {
                _this.queryModulesOutputData(data);
            });

            Event.on('PATCH_MODULES_DATA.Sketchpad', function(type, data) {
                _this.patchModulesData(data);
                _this.sync();
            });

            Event.on('REPAINT.Sketchpad', function(type, data) {
                _this.repaint();
            });
        };

        this.unbindOb = function() {
            Event.off('.Sketchpad');
        };

        this.patchModulesData = function(data) {
            this.present({
                type: 'patchModulesData',
                data: data
            });
        };

        this.queryModulesOutputData = function(data) {
            this.present({
                type: 'queryModulesOutputData',
                exclude: data.exclude
            });
        };

        this.sync = function(data, present) {
            present = present || this.present;

            this.present({
                type: 'sync',
                data: data
            });
        };

        this.repaint = function() {
            this.present({
                type: 'repaint'
            });
        };

        this.dragenter = function(e, view) {
            // if (EventAdapter.getData()) {
            //     view.bd.blocks.forEach((block) => {
            //         block.children.forEach((child) => {
            //             view.layer.find('#' + child.id)[0].find('.dragLayer').stroke('red');
            //             view.layer.draw();
            //         });
            //     });
            // }
        };

        this.dragleave = function(e, view) {
            // if (EventAdapter.getData()) {
            //     view.bd.blocks.forEach((block) => {
            //         block.children.forEach((child) => {
            //             view.layer.find('#' + child.id)[0].find('.dragLayer').stroke('black');
            //             view.layer.draw();
            //         });
            //     });
            // }
        };

        this.drop = function(e, options, view) {
            if (EventAdapter.getData()) {
                //绑定数据源
                var dsItemId = EventAdapter.getData().dsItemId;
                var ds;
                if (AppConfig.datasource.currentObj === 'cloud') {
                    var dragName = $('#tableDsCloud').find('tr[ptid="' + dsItemId + '"]').find('.tabColName').attr('data-value');
                    var currentId = $('#selectPrjName').find('option:selected').val();
                    if (currentId) {
                        dragName = '@' + currentId + '|' + dragName;
                    } else {
                        dragName = dsItemId;
                    }
                    ds = dragName;
                } else {
                    ds = dsItemId;
                }
                var skip = false;
                view.bd.blocks.forEach((block) => {
                    if (skip) return;
                    block.children.forEach((child) => {
                        // view.layer.find('#' + child.id)[0].find('.dragLayer').stroke('black');
                        // view.layer.draw();
                        if (skip || child.child != undefined) {
                            return;
                        }
                        var isOK = view.bd.tools.intersectionByPoint({ x: e.originalEvent.layerX, y: e.originalEvent.layerY }, child);
                        if (isOK) {
                            skip = true;
                            child.opt.type = 0;
                            child.opt.default = ds;
                            var text = view.layer.find('#' + child.id)[0].find('.text')[0];
                            text.text((function(showName) {
                                var maxNum = text.width() / 10;
                                if (showName.length > maxNum) {
                                    return showName.slice(0, maxNum) + '...';
                                }
                                return showName
                            })(ds));
                        }

                    });
                });
            } else {
                //新增
                var present = this.present;
                var $this = $(e.target);
                var offset = $this.offset(),
                    info = JSON.parse(e.originalEvent.dataTransfer.getData('info'));
                var x = e.originalEvent.x - offset.left - info.x,
                    y = e.originalEvent.y - offset.top - info.y;
                var type,name;
                switch (info.type) {
                    case 'py':
                        type = 0;
                        name = "Python";
                        break;
                    case 'API':
                        type = 1;
                        name = "远程API";
                        break;
                    case 'KPI':
                        type = 2;
                        name = "KPI";
                        break;
                    case 'diagnose':
                        type = 3;
                        name = "诊断";
                        break;
                    case 'fr':
                        type = 4;
                        name = "模糊规则";
                        break;
                    case 'return':
                        type = 5;
                        name = "回归";
                        break;
                    case 'forecast':
                        type = 6;
                        name = "预测";
                        break;
                    case 'Fa':
                        type = 7;
                        name = "傅里叶分析";
                        break;
                    case 'Wa':
                        type = 8;
                        name = "小波分析";
                        break;
                    case 'Fc':
                        type = 9;
                        name = "拟合曲线";
                        break;
                    case 'Hc':
                        type = 10;
                        name = "历史曲线";
                        break;
                }

                var opt = { // 无模板引用的模块
                    // 模块编号
                    '_id': ObjectId(),
                    'strategyId': options.strategyId,
                    // 模块调用方式：0，python代码；1，引用模板；2，远程REST服务调用；3，LaTex；4，固有控件
                    'type': type,
                    // 模块名称
                    'name': name,
                    // 模块描述
                    'desc': '高大上的玩意儿，你猜是干嘛的',
                    // 配置项，根据type类型不同，而稍有差别，但都有input、output、content
                    'option': {
                        // 输入参数
                        'input': [],
                        // 输出参数
                        'output': [],
                        // 内容
                        'content': {

                        }
                    },
                    'loc': {
                        'x': x,
                        'y': y,
                        'w': 155,
                        'h': 72
                    }
                };

                var rs = {
                    update: { add: opt }
                }
                present(rs);
            }


        }

        this.onDropDs = function(data, present) {
            var $target = $(data.target),
                ds = data.ds;
            present = present || this.present;
            var rs = {
                update: { module: this.attrs.id }
            };
            _this.present(rs);
        };

        this.moduleClose = function() {
            var rs = {
                update: { destroyId: this.attrs.id }
            };
            _this.present(rs);
        }

        this.moduleConfig = function() {
            Event.emit('SHOW_MODULE_CONFIG', {
                action: 'showModuleConfigPanel',
                from: 'Painter',
                store: this.attrs.store
            });
        }

        this.moduleSelect = function(e) {
            var rs = {
                update: { selectId: this.attrs.id }
            };
            _this.present(rs);
        }

        this.toOutput = function(e) {
            var rs = {
                update: { inputToOutput: e.data }
            };
            _this.present(rs);
        }

        this.recover = function(data, present) {
            present = present || this.present;
            var rs = {
                isRecover: true
            }
            present(rs);
        };

    }.call(Actions.prototype);

    var actions = new Actions();
    var n = "beop.strategy.components.Painter.Sketchpad.actions";

    actions.intents = {
        drop: 'namespace(\'' + n + '\').' + 'drop',
        moduleClose: 'namespace(\'' + n + '\').' + 'moduleClose',
        moduleConfig: 'namespace(\'' + n + '\').' + 'moduleConfig',
        recover: 'namespace(\'' + n + '\').' + 'recover'
    };
    exports.actions = actions;
}));