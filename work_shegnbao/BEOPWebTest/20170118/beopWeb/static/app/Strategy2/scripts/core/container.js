;(function(root, factory) {
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
            root
        );
    }
}(namespace('beop.strategy.core'), function(exports) {

    var deepClone = function(obj) {
        var type = $.type(obj);
        if (type === 'object') {
            return $.extend(true, {}, obj);
        } else if (type === 'array') {
            return $.extend(true, [], obj);
        } else {
            return obj;
        }
    };

    var getFlatItems = function (nestedItems) {
        var shadow = nestedItems.slice();
        var rs = [];
        var item;

        while( item = shadow.shift()) {
            rs.push(item);
            if (item.children) {
                shadow = shadow.concat(item.children);
            }
        }

        return rs;
    }

    var removeItems = function (items, removedIds) {
        return items.filter(function (row) {
            if (row.children) {
                row.children = removeItems(row.children, removedIds);
            }
            return removedIds.indexOf(row._id) === -1;
        });
    }

    var container = function(store, dataset) {
        store = store || {};
        dataset = dataset || {};

        if (dataset.toggleShowAllStrategiesBtn) {
            store.equipTree.bShowChildStrategies = !store.equipTree.bShowChildStrategies;
        }

        if (dataset.selectEquipTreeNode) {
            store.equipTree.selectedNode = dataset.selectEquipTreeNode;
        }

        // 新增策略
        if (dataset.addStrategyItems) {
            var node = null,
                stack = store.equipTree.items.slice();
            while (node = stack.shift()) {
                if (node._id === dataset.addStrategyItems.nodeId) {
                    break;
                }
                if (node.children && node.children.length) {
                    stack = stack.concat(node.children);
                }
            }

            if (node) {
                if (dataset.addStrategyItems.items instanceof Array) {
                    node.children = dataset.addStrategyItems.items;
                } else {
                    node.children.push(dataset.addStrategyItems.items);
                }
            }
        }

        // 删除策略
        if (dataset.removedStrategiesIds) {
            store.equipTree.items = removeItems(store.equipTree.items, dataset.removedStrategiesIds);
        }

        if ('strategySearchKey' in dataset) {
            store.strategyTable.searchKey = dataset.strategySearchKey;
        }

        if (dataset.enableStrategies) {
            getFlatItems(store.equipTree.items).forEach(function(row) {
                if (dataset.enableStrategies.indexOf(row._id) > -1) {
                    row.status = 1;
                }
            });
        }

        if (dataset.disableStrategies) {
            getFlatItems(store.equipTree.items).forEach(function(row) {
                if (dataset.disableStrategies.indexOf(row._id) > -1) {
                    row.status = 0;
                }
            });
        }

        if (dataset.selectStrategyTableRows) {
            store.strategyTable.selectedIds = dataset.selectStrategyTableRows;
        }

        if ('openStrategy' in dataset) {
            store.painter.openStrategy = dataset.openStrategy;
            //编辑的临时变量
            store.painter.tempStrategy = deepClone(store.painter.openStrategy);
        }

        if (dataset.propItemsToItems) {
            getFlatItems(store.equipTree.items).forEach(function(item) {
                if (dataset.propItemsToItems.selectedIds.indexOf(item['_id']) > -1) {
                    for (var k in dataset.propItemsToItems.value) {
                        item[k] = dataset.propItemsToItems.value[k];
                    }
                }
            });
        }

        if (dataset.toConfig) {
            store.painter.configIds = dataset.toConfig;
        }

        if (dataset.toPainter) {
            store.painter.configIds = [];
        }

        if (dataset.configSave) {
            store.painter.configIds = [];
        }
        if(dataset.modal){
            store.modal = dataset.modal;
        }

        if (dataset.addModule) {
            store.painter.tempStrategy.modules.push(dataset.addModule);
        }

        return store;
    };

    exports.container = container;
}));