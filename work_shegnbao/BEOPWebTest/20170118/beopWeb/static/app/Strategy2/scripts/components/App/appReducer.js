;
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([
            'exports'
        ], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(
            exports
        );
    } else {
        factory(
            root,
            namespace('beop.strategy.core.constants')
        );
    }
}(namespace('beop.strategy.reducers'), function(exports, constants) {

    exports.appReducer = {
        create: function (present) {
            return function (action) {
                switch (action.type) {
                    case constants.equipTree.TOGGLE_SHOW_ALL_STRATEGIES_BTN:
                        present({
                            toggleShowAllStrategiesBtn: true
                        });
                        break;
                    case constants.equipTree.SELECT_TREE_NODE:
                        present({
                            selectEquipTreeNode: {
                                _id: action._id,
                                pid: action.pid
                            }
                        });
                        break;
                    case constants.equipTree.ADD_SYNC_DATA:
                        present({
                            addStrategyItems: {
                                items: action.items,
                                nodeId: action.nodeId
                            }
                        });
                        break;
                    case constants.strategyTable.ADD_ITEM:
                        var newData = {
                            '_id': ObjectId(),
                            'nodeId': action.nodeId,
                            'name': 'Untitled',
                            'desc': '暂无描述信息',
                            'userId': AppConfig.userId,
                            'lastTime': (new Date()).format('yyyy-MM-dd hh:mm:ss'),
                            'keywords': [],
                            'type': 0,
                            'interval': 60,
                            'lastRuntime': (new Date()).format('yyyy-MM-dd hh:mm:ss'),
                            'status': 0,
                            'value': []
                        }

                        WebAPI.post('/strategy/item/save', {
                            userId: AppConfig.userId,
                            data: newData
                        }).done(function(result) {
                            if (result.status === 'OK') {
                                alert('新增成功！')
                                present({
                                    addStrategyItems: {
                                        items: newData,
                                        nodeId: action.nodeId
                                    }
                                });
                            } else {
                                alert('新增失败！');
                            }
                        })
                        break;
                    case constants.strategyTable.REMOVE_SELECTED_ITEMS:
                        WebAPI.post('/strategy/item/remove', {
                            userId: AppConfig.userId,
                            ids: action.selectedIds
                        }).done(function(result) {
                            if (result.status === 'OK') {
                                alert('删除成功！');
                                present({
                                    removedStrategiesIds: action.selectedIds
                                });
                            } else {
                                alert('删除失败！');
                            }
                        })
                        break;
                    case constants.strategyTable.CHANGE_SEARCH_FIELD:
                        present({
                            strategySearchKey: action.value
                        });
                        break;
                    case constants.strategyTable.ENABLE_STRATEGIES:
                        WebAPI.post('/strategy/item/save', {
                            userId: AppConfig.userId,
                            ids: action.ids,
                            data: {
                                'status': 1
                            }
                        }).done(function(result) {
                            if (result.status === 'OK') {
                                alert('启用成功');
                                present({
                                    enableStrategies: action.ids
                                });
                            } else {
                                alert('启用失败');
                            }
                        });
                        break;
                    case constants.strategyTable.DISABLE_STRATEGIES:
                        WebAPI.post('/strategy/item/save', {
                            userId: AppConfig.userId,
                            ids: action.ids,
                            data: {
                                'status': 0
                            }
                        }).done(function(result) {
                            if (result.status === 'OK') {
                                alert('禁用成功');
                                present({
                                    disableStrategies: action.ids
                                });
                            } else {
                                alert('禁用失败');
                            }
                        });
                        break;
                    case constants.strategyTable.SELECT_ROWS:
                        present({
                            selectStrategyTableRows: action.selectedIds
                        });
                        break;
                    case constants.strategyTable.OPEN_STRATEGY:
                        WebAPI.get('/strategy/item/get/' + action.strategyId).done(function(rs) {
                            if (rs.status === 'OK') {
                                present({
                                    openStrategy: rs.data
                                });
                            }
                        }).fail(function() {
                            // 获取页面数据失败，回退到策略表格
                        });
                        break;
                        //保存属性
                    case constants.propPanel.SAVE_PROP:
                        var target = action.value.target;
                        var params = $(target).parent().next('form').serialize();
                        params = decodeURIComponent(params, true);
                        var dataArr = params.split('&');
                        var obj = {};
                        for (var i = 0, length = dataArr.length; i < length; i++) {
                            var key = dataArr[i].split('=')[0];
                            var val = dataArr[i].split('=')[1];
                            if (val !== '') {
                                if ( ['status', 'type', 'interval'].indexOf(key) > -1 ) {
                                    val = Number(val);
                                }
                                obj[key] = val;
                            }
                        }
                        obj['lastTime'] = (new Date()).format('yyyy-MM-dd hh:mm:ss');
                        var info = {
                            userId: AppConfig.userId,
                            ids: action.value.selectedIds,
                            data: obj
                        }
                        WebAPI.post('/strategy/item/save', info).done(function(result) {
                            if (result.status === 'OK') {
                                present({
                                    propItemsToItems: {
                                        selectedIds: action.value.selectedIds,
                                        value: obj
                                    }
                                });
                                alert('保存成功');
                            } else {
                                alert('保存失败');
                            }
                        });
                        break;
                        //恢复属性
                    case constants.propPanel.RECOVER_PROP:
                        present({
                            propItemsRecover: {
                                selectedIds: action.value.selectedIds
                            }
                        });
                        break;
                    case constants.toolbar.EXIT_STRATEGY:
                        present({
                            openStrategy: null
                        });
                        break;
                        //转到配置面板
                    case constants.painter.TO_CONFIG:
                        present({
                            toConfig: action.value
                        });
                        break;
                        //转到画板
                    case constants.painter.TO_PAINTER:
                        present({
                            toPainter: true
                        });
                        break;
                        //保存配置
                    case constants.painter.CONFIG_SAVE:
                        present({
                            configSave: true
                        });
                        break;
                    case constants.painter.ADD_MODULE:
                        present({
                            addModule: action.value
                        });
                        break;                
                    default:
                        break;
                }
            };
        }
    }
}));