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
            root
        );
    }
}(namespace('beop.strategy.containers'), function(exports) {

    var deepClone = $.extend.bind(true);

    var container = function(store, dataset) {
        store = store || {};
        dataset = dataset || {};

        if (dataset.addModule) {
            store.painter.openStrategy = deepClone({}, store.painter.openStrategy);
            store.painter.openStrategy.modules.push(dataset.addModule);
        }
        if (dataset.changeConfigVal) {
            store.painter.openStrategy.strategy.value = dataset.changeConfigVal.props;
        }

        if (dataset.selectedModuleIds) {
            store.painter.selectedModulesIds = dataset.selectedModuleIds;
        }

        if (dataset.modal) {
            store.modal = dataset.modal;
        }

        if (dataset.updateLoc) {
            store.painter.openStrategy = deepClone({}, store.painter.openStrategy);
            var target;
            store.painter.openStrategy.modules.forEach(function(module) {
                if (module._id == dataset.updateLoc.id) {
                    if (dataset.updateLoc.type == 'input') {
                        module.option.input.forEach(function(input) {
                            if (input.name == dataset.updateLoc.name) {
                                target = input;
                            }
                        });
                    } else if (dataset.updateLoc.type == 'output') {
                        module.option.output.forEach(function(output) {
                            if (output.name == dataset.updateLoc.name) {
                                target = output;
                            }
                        });
                    } else {
                        target = module;
                    }
                }
            });
            if (target) {
                target.loc.x = dataset.updateLoc.loc.x;
                target.loc.y = dataset.updateLoc.loc.y;
                target.loc.w = dataset.updateLoc.loc.w;
                target.loc.h = dataset.updateLoc.loc.h;
            }
        }

        if (dataset.removeModuleId) {
            store.painter.openStrategy = deepClone({}, store.painter.openStrategy);
            var index = store.painter.openStrategy.modules.findIndex(function(module) {
                return module._id == dataset.removeModuleId;
            });
            store.painter.openStrategy.strategy.value.splice(index, 1);
            var target = store.painter.openStrategy.modules.splice(index, 1)[0];
            store.painter.openStrategy.modules.forEach(function(module) {
                var index = module.option.input.findIndex(function(input) {
                    return input.type == 100 && input.refId == target._id;
                });
                if (index > -1) {
                    module.option.input.splice(index, 1);
                }

            });

        }

        if (dataset.mergeInputOutput) {
            store.painter.openStrategy = deepClone({}, store.painter.openStrategy);
            store.painter.openStrategy.modules.forEach(function(module) {
                if (module._id == dataset.mergeInputOutput.id) {
                    module.option.input.forEach(function(input) {
                        if (input.name == dataset.mergeInputOutput.name) {
                            input.type = 100;
                            input.name = dataset.mergeInputOutput.newName;
                            input.refId = dataset.mergeInputOutput.refId;
                        }
                    });
                }
            });
        }

        if (dataset.modalConfigPanel) {
            store.modalConfigPanel = deepClone({}, store.modalConfigPanel, dataset.modalConfigPanel);
        }

        if (dataset.configPanelSave) {
            var idx = -1;
            store.painter.openStrategy.modules.some(function(row, i) {
                if (row._id === dataset.configPanelSave._id) {
                    idx = i;
                    return true;
                }
            });

            if (idx > -1) {
                store.painter.openStrategy.modules.splice(idx, 1, dataset.configPanelSave);
            }
        }

        if (dataset.selectedModuleItems) {
            store.painter.openStrategy.modules.forEach(function(row) {
                if (dataset.selectedModuleItems[0]._id === row._id) {
                    dataset.selectedModuleItems[0] = row;
                }
            })
        }

        if (dataset.changeInputDs) {
            var index;
            store.painter.openStrategy = deepClone({}, store.painter.openStrategy);
            store.painter.openStrategy.modules.forEach(function(module, i) {
                if (module._id == dataset.changeInputDs.id) {
                    module.option.input.forEach(function(input) {
                        if (input.name == dataset.changeInputDs.name) {
                            index = i;
                            input.type = dataset.changeInputDs.type;
                            input.default = dataset.changeInputDs.default;
                        }
                    });
                }
            });
            if (index && store.painter.openStrategy.strategy.value) {
                store.painter.openStrategy.strategy.value[index] = store.painter.openStrategy.strategy.value[index] || {};
                store.painter.openStrategy.strategy.value[index][dataset.changeInputDs.name] = dataset.changeInputDs.default;
            }

        }

        if ('newActiveSiderIndex' in dataset) {
            store.painter.activeSiderIndex = dataset.newActiveSiderIndex;
        }

        return store;
    };

    exports.painterContainer = container;
}));