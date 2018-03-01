;(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(exports);
    } else {
        factory(
            root,
            namespace('beop.strategy.enumerators')
        );
    }
}(namespace('beop.strategy.common'), function (exports, enums) {

    const deepClone = $.extend.bind($, true);

    let UUID;

    exports.toFlatArray = function(nestedItems) {
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
    };

    exports.generateObjectByPath = function (path, value) {
        var root = {};
        var obj = root;
        path = path.split('.');

        var len = path.length;
        path.forEach(function(p, i) {
            p = p.trim();
            if (i === len-1) {
                obj = obj[p] = value
            } else {
                obj = obj[p] = {};
            }
        });
        return root;
    }

    const getType = function (obj) {
        return Object.prototype.toString.call(obj);
    }

    exports.merge = function merge(lht, rht) {
        if (getType(rht) === '[object Object]' && 
            getType(lht) === '[object Object]') {
            for (var k in rht) {
                if (rht.hasOwnProperty(k)) {
                    lht[k] = merge(lht[k], rht[k]);
                }
            }
            return lht;
        }
        return rht;
    }

    const uuid16 = exports.uuid16 = () => {
        if (!UUID) {
            UUID = (AppConfig.userId || Math.random().toString().substr(-3)).toString()
                + new Date().valueOf().toString().substr(3) + Math.random().toString().substr(-3);
        } else {
            UUID = (parseInt(UUID) + 1).toString();
        }
        return UUID;
    };

    // 获取某个策略中指定 id 的 value
    exports.getStrategyValueById = function (data, id) {
        let value;
        data.some(function (row) {
            if (row._id === id) {
                value = row;
                return true;
            }
        });
        return value;
    };

    // 对所有模块的某个属性进行遍历
    const modulesSome = function (name, modules, fn) {
        modules = modules || [];

        modules.some(function (mdl) {
            var list = mdl.option[name] || [];
            var _flag = false;

            list.some(
                (p) => {
                    _flag = fn(mdl, p);
                    return _flag;
                }
            );
            return _flag;
        });
    };

    // 所有模块输入 some 方法遍历
    const modulesInputSome = exports.modulesInputSome = function (modules, fn) {
        modulesSome('input', modules, fn);
    };

    // 所有模块输出 some 方法遍历
    const modulesOutputSome = exports.modulesOutputSome = function (modules, fn) {
        modulesSome('output', modules, fn);
    };

    // 策略输入 some 方法遍历（不包括引用来的输入参数）
    const strategyInputSome = exports.strategyInputSome = function (modules, fn) {
        modules = modules || [];
        modulesInputSome(modules, function (mdl, ipt) {
            if ( !ipt.refModuleId && !ipt.refOutputId ) {
                return fn(mdl, ipt);
            }
            return false;
        });
    };

    // 获取一个策略的所有输入参数
    exports.getStrategyInput = function (modules) {
        let rs = [];
        modules = modules || [];
        strategyInputSome(modules, function (mdl, ipt) {
            rs.push(
                Object.assign({}, ipt, {
                    belongModuleId: mdl._id,
                    belongModuleName: mdl.name
                })
            );
        });
        return rs;
    };

    // 获取策略指定类型的输出参数
    const getStrategyOutputByType = exports.getStrategyOutputByType = function (modules=[], type) {
        let list = {};
        modulesOutputSome(modules, function (mdl, output) {
            if (output.type === type) {
                let map = list[mdl._id] || ( list[mdl._id] = {} );
                map[output._id] = output;
            }
        });
        return list;
    };

    // 获取一个策略所有输入的默认值，返回格式同 strategy.value 中的对象
    const getStrategyDefaultInputValue = exports.getStrategyDefaultInputValue = function (modules) {
        let value = {
            _id: 'default',
            name: '默认值',
            list: {}
        };
        strategyInputSome(modules, function (mdl, ipt) {
            let map = value.list[mdl._id] || ( value.list[mdl._id] = {} );
            map[ipt._id] = ipt.default;
        });
        return value;
    };

    // 根据一个数据源的 id，拿到对应的数据源名称/云点名称
    exports.parseDs = function(dsItemId) {
        var result;
        if (AppConfig.datasource.currentObj === 'cloud') {
            var selectedId = $('#dsNavContain>ul.nav-tabs li.active').attr('id');
            var dragName;
            switch(selectedId){
                case 'liCloud':
                    dragName = $('#tableDsCloud').find('tr[ptid="' + dsItemId + '"]').find('.tabColName').attr('data-value');
                    break;
                case 'liTag':
                    dragName = $('#pageTag').find('li[nodeid="' + dsItemId + '"]').find('a').attr('title');
                    break;
            }
            var currentId = $('#selectPrjName').find('option:selected').val();
            if (currentId) {
                dragName = '@' + currentId + '|' + dragName;
            } else {
                dragName = dsItemId;
            }
            result = dragName;
        } else {
            result = dsItemId;
        }
        return result;
    };

    // 获取同步后的 value
    exports.getSyncValue = function (modules, value) {
        let iptMap = getStrategyDefaultInputValue(modules).list;
        let fuzzyOutputMap = getStrategyOutputByType(modules, enums.moduleInputOutputTypes.OUTPUT_DIAGNOSIS);

        // 根据现有参数重新更新 value 中的输入值
        return value.map(
            (row) => {
                let newList = {};
                Object.keys(iptMap).some(
                    (k) => {
                        let paramValueMap = row.list[k] || {};
                        let iptDefaultMap = iptMap[k];
                        let map = newList[k] = {};
                        Object.keys(iptDefaultMap).forEach(
                            (iptId) => {
                                map[iptId] = typeof paramValueMap[iptId] === 'undefined' ?
                                    iptDefaultMap[iptId] : paramValueMap[iptId]
                            }
                        );
                    }
                );

                // 根据现有参数重新更新 value 中的 faultId
                let fuzzyOutputParamsMap = row['params'] || {};
                let faultIdMap = fuzzyOutputParamsMap['faultId'] || {};
                let newFaultIdMap = {};
                Object.keys(fuzzyOutputMap).some(
                    (moduleId) => {
                        let moduleFaultIdMap = faultIdMap[moduleId] || {};
                        let moduleFuzzyOutputMap = fuzzyOutputMap[moduleId];
                        let map = newFaultIdMap[moduleId] = {};
                        Object.keys(moduleFuzzyOutputMap).forEach(
                            outputId => {
                                map[outputId] = moduleFuzzyOutputMap[outputId]['option']['faultId'] || moduleFaultIdMap[outputId]
                            }
                        );
                    }
                )

                return Object.assign({}, row, {
                    list: newList,
                    params: Object.assign({}, fuzzyOutputParamsMap, {
                        'faultId': newFaultIdMap
                    })
                });
            }
        );
    };
}));
