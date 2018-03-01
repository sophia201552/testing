// 变量处理特性
(function (exports) {

    function VariableProcessMixin() {
        this.variableProcessTasks = [];
    }

    +function () {

        /**
         * 
         * 对新的 variables 数据格式做兼容
         * @param {any} variables 变量数据
         * @returns 返回旧的数据格式，从而兼容后续逻辑
         */
        this._formatVariables = function (variables) {
            if (typeof variables === 'object') {
                variables = $.extend(false, {}, variables);
                Object.keys(variables).forEach(function (key) {
                    var row = variables[key];

                    if (typeof row === 'object' && typeof row['val'] !== 'undefined') {
                        variables[key] = row['val'];
                    }
                });
            }
            // 异常格式处理
            else {
                return;
            }
            return variables;
        };

        // 注册一个任务
        this.registTask = function (variables, ins) {
            var promise = $.Deferred();

            // 兼容老的数据格式
            variables = this._formatVariables(variables);
            // 对象深拷贝
            variables = $.extend(true, {}, variables);

            this.variableProcessTasks.push({
                variables: variables,
                promise: promise,
                ins: ins
            });

            return promise;
        };

        // 处理任务
        this.processTask = (function () {
            var loadQueue;
            var api = {
                // 一个或多个点的数据总和，返回一个数值
                SUM: function () {
                    var points = Array.prototype.slice.apply(arguments);
                    var total = 0;

                    points.forEach(function (p) {
                        var sum = 0
                        p.data.forEach(function (num) {
                            sum += num;
                        });
                        total += sum;
                    });

                    // 保留两位小数
                    return Math.round(total*100) / 100;
                },
                // 把多个点的值进行合并，返回一个合并点
                SUM_POINT: function() {
                    var points = Array.prototype.slice.apply(arguments);
                    var rs = {
                        data: [],
                        timeShaft: points[0].timeShaft
                    };

                    points[0].data.forEach(function (row, i) {
                        var rowSum = 0;
                        points.forEach(function (p) {
                            rowSum += p.data[i];
                        });
                        rs.data.push(rowSum);
                    });

                    return rs;
                },
                // 非0值的数据平均值
                NONZERO_AVERAGE: function () {
                    var points = Array.prototype.slice.apply(arguments);
                    var total = 0, count = 0;

                    points.forEach(function (p) {
                        p.data.forEach(function (num) {
                            if (num === 0) {
                                return;
                            }
                            total += num;
                            count ++;
                        });
                    });

                    if (count === 0) {
                        return 0;
                    }

                    // 保留两位小数
                    return Math.round(total/count*100) / 100;
                },
                // 一个或多个点的数据平均值，返回一个数值
                AVERAGE: function () {
                    var points = Array.prototype.slice.apply(arguments);
                    var total = 0, count = 0;

                    points.forEach(function (p) {
                        p.data.forEach(function (num) {
                            total += num;
                            count ++;
                        });
                    });

                    if (count === 0) {
                        return 0;
                    }

                    // 保留两位小数
                    return Math.round(total/count*100) / 100;
                },
                // 一个或多个点中的数据的最大值，返回一个数值
                MAX: function () {
                    var points = Array.prototype.slice.apply(arguments);
                    var data = [], timeShaft = [];
                    var max, idx, indices = [];

                    points.forEach(function (p) {
                        data = data.concat(p.data);
                        timeShaft = timeShaft.concat(p.timeShaft);
                    });

                    max = Math.max.apply(null, data);
                    // 获取 max 所在数组的位置的 index 值
                    idx = data.indexOf(max);
                    while(idx !== -1) {
                        indices.push(idx);
                        idx = data.indexOf(max, idx+1);
                    }

                    return {
                        value: max,
                        time: indices.map(function (row) {
                            return timeShaft[row];
                        })
                    }
                },
                // 一个或多个点中的数据的最小值，返回一个数值
                MIN: function () {
                    var points = Array.prototype.slice.apply(arguments);
                    var data = [], timeShaft = [];
                    var min, idx, indices = [];

                    points.forEach(function (p) {
                        data = data.concat(p.data);
                        timeShaft = timeShaft.concat(p.timeShaft);
                    });

                    min = Math.min.apply(null, data);
                    // 获取 min 所在数组的位置的 index 值
                    idx = data.indexOf(min);
                    while(idx !== -1) {
                        indices.push(idx);
                        idx = data.indexOf(min, idx+1);
                    }

                    return {
                        value: min,
                        time: indices.map(function (row) {
                            return timeShaft[row];
                        })
                    };
                },
                // 将一个或多个点历史值数据的转换成累积量数据
                // 若只传入一个点，则直接对该点进行前后差值计算，返回这个点对应的累积量的数据点
                // 若传入多个点，则先执行 SUM_POINT 操作得到合并点，再返回该合并点对应的累积量的数据点
                ACCUM_POINT: function () {
                    var points = Array.prototype.slice.apply(arguments);
                    var rs = {
                        data: [],
                        timeShaft: points[0].timeShaft
                    };

                    // 求和
                    if (points.length) {
                        points[0].data.forEach(function (row, i) {
                            var rowSum = 0;
                            points.forEach(function (p) {
                                rowSum += p.data[i];
                            });
                            rs.data.push(rowSum);
                        });
                    } else {
                        rs = points[0];
                    }
                    
                    // 求累积量
                    rs.data = rs.data.slice(0, rs.data.length-1).map(function (row, i) {
                        return rs.data[i+1] - row;
                    });
                    // 去除最后多的一组数据
                    rs.timeShaft.length = rs.timeShaft.length - 1;

                    return rs;
                }
            };

            function getCalcQueue(dpMap, name, deep) {
                var queue = [];
                var dp = dpMap[name];

                if (!dp) return [];

                deep = deep || 0;
                if (deep > 20) {
                    console.error('递归过深，可能出现了循环依赖，请进行检查！');
                    return [];
                }
                deep += 1;

                dp.forEach(function (row) {
                    queue = queue.concat(getCalcQueue(dpMap, row, deep));
                });
                queue.push(name);

                return queue;
            }

            // 开始进行变量计算
            function calc(info, dsMap, scope) {
                var dpMap = info.dependencies;
                // 以第一个元素为入口开始进行计算
                var start = Object.keys(dpMap)[0];
                var rs = {};

                loadQueue = {};
                Object.keys(dpMap).forEach(function (key) {
                    var calcQueue = getCalcQueue(dpMap, key);

                    calcQueue.forEach(function (name) {
                        if (loadQueue[name] === 'loaded') {
                            return;
                        }

                        // 这里需要注意 extend 操作时覆盖的顺序
                        rs[name] = parse(name, info.variables[name] + '', $.extend(false, scope, rs, dsMap) );
                        loadQueue[name] = 'loaded';
                    });
                });

                return rs;
            }

            function parse(name, codeStr, map) {
                var str = codeStr.replace(/<[%#](.+?)[%#]>/mg, function ($0, $1) {
                    return '_map["' + $1 + '"]';
                });

                // 如果不包含引用，则直接返回
                if (str === codeStr) {
                    return codeStr;
                }

                try {
                    return new Function('SUM', 'SUM_POINT', 'NONZERO_AVERAGE', 'AVERAGE', 'MAX', 'MIN', 'ACCUM_POINT', '_map', 'return ' + str)(
                        api['SUM'],
                        api['SUM_POINT'],
                        api['NONZERO_AVERAGE'],
                        api['AVERAGE'],
                        api['MAX'],
                        api['MIN'],
                        api['ACCUM_POINT'],
                        map
                    );
                } catch(e) {
                    Log.error(e);
                    return codeStr;
                }
            }

            function formatVariables(data) {
                var dsMap = {};
                var dependencies = {};

                if (data) {
                    Object.keys(data).forEach(function (key) {
                        var row = data[key];
                        var patternDs = /<%(.+?)%>/mg;
                        var patternTpl = /<#(.+?)#>/mg;
                        var match;
                        var str, idx, optionStr;

                        while ( match = patternDs.exec(row) ) {
                            str = match[1];
                            idx = str.indexOf(',');

                            if (idx === -1) {
                                // 默认
                                dsMap[str] = {};
                            } else {
                                optionStr = str.substring(idx);
                                dsMap[str] = (function (optionStr) {
                                    var arr = optionStr.split(',');
                                    var opt = {};

                                    arr.forEach(function (kv) {
                                        var kvArr = kv.split('=');
                                        if( kvArr.length === 1 ) {
                                            opt[kv] = 'true';
                                        } else {
                                            opt[kvArr[0]] = kvArr[1];
                                        }
                                    });

                                    return opt;
                                } (optionStr))
                            }
                        }

                        dependencies[key] = [];
                        while ( match = patternTpl.exec(row) ) {
                            dependencies[key].push(match[1]);
                        }
                    });
                }

                return {
                    dsMap: dsMap,
                    dependencies: dependencies
                };
            }

            function format(data) {
                var rs = [];

                data.forEach(function (row) {
                    var info = formatVariables(row.variables);
                    info.variables = row.variables;
                    info.promise = row.promise;
                    info.ins = row.ins;
                    rs.push(info);
                });

                return rs;
            }

            function getPeriodTime(row, timeS, timeE, map) {
                var timeStart = timeS;
                var timeEnd = timeE;
                var p = map[row];
                var dayMs = 24 * 60 * 60 * 1000;

                function add0(v) {
                    return (v < 10 ? '0' + v : v);
                }

                //设置默认timeEnd
                function defaultTimeEnd(y, m, d) {
                    var oldTime = (new Date(y,m-1,d)).getTime() - dayMs,
                        newTime = new Date(oldTime),
                        year = newTime.getFullYear(),
                        month = newTime.getMonth() + 1,
                        dat = newTime.getDate();
                    return (year + '-' + add0(month) + '-' + add0(dat) + ' 23:59:59');
                }

                if (p.period) {
                    var date = new Date(),
                        year = date.getFullYear(),
                        month = date.getMonth() + 1,
                        dat = date.getDate(),
                        hour, min, sec,
                        other = add0(dat)+' 00:00:00',
                        other2 = add0(dat)+' 23:59:59';
                    var reg = /^last(\d+)(days|months|years)$/gm;
                    var arr = reg.exec(p.period);
                    var count, type, oldTime, newTime;
                    var monthCount;
                    if (arr) {
                        count = Number.parseInt(arr[1]);
                        type = arr[2];
                        //"2016-08-01 00:00:00"格式
                        if (type === "days") {
                            timeStart = year + '-' + add0(month) + '-' + other;

                            if (count === 0) {
                                timeEnd = year + '-' + add0(month) + '-' + other2;
                            } else {
                                timeEnd = defaultTimeEnd(year, month, dat);
                            }

                            oldTime = (new Date(timeStart.replace(/-/g, "/"))).getTime() - dayMs * count;
                            newTime = new Date(oldTime);
                            year = newTime.getFullYear();
                            month = newTime.getMonth() + 1;
                            dat = newTime.getDate();
                            hour = newTime.getHours();
                            min = newTime.getMinutes();
                            sec = newTime.getSeconds();
                            other = add0(dat) + ' ' + add0(hour) + ':' + add0(min) + ':' + add0(sec);
                        }

                        if (type === "months") {

                            if (count === 0) {
                                timeEnd = year + '-' + add0(month) + '-' + add0(new Date(year, month-1, 0).getDate()) + ' 23:59:59';
                            } else {
                                timeEnd = defaultTimeEnd(year, month, 1);
                            }

                            other = "01 00:00:00";
                            monthCount = year * 12 + month - count;
                            month = monthCount % 12;
                            year = (monthCount - month) / 12;
                        }

                        if (type === "years") {

                            if (count === 0) {
                                timeEnd = defaultTimeEnd(year+1, 1, 1);
                            } else {
                                timeEnd = defaultTimeEnd(year, 1, 1);
                            }

                            month = 1;
                            other = "01 00:00:00";
                            year -= count; 
                        }
                        
                        timeStart = year + '-' + add0(month) + '-' + other;
                    }
                }
                return {
                    timeStart: timeStart,
                    timeEnd: timeEnd
                };
            }

            function getDelayTime(row, time, map) {
                var timeStart = time.timeStart;
                var timeEnd = time.timeEnd;
                var p = map[row];
                var milliSecond = 0;
                if (!p.delay) {
                    p['delay'] = 0;
                } else {
                    p.delay = Number(p.delay);
                    if (isNaN(p.delay)) {
                        Log.warn('there has one point gave an unsupported delay: ' + p.delay);
                        return;
                    }
                }
                switch (p.tf) {
                    case 'm5':
                        milliSecond = 300000;
                        break;
                    case 'h1':
                        milliSecond = 3600000;
                        break;
                    case 'd1':
                        milliSecond = 86400000;
                        break;
                }
                timeEnd = timeFormat(Date.parse(timeEnd.replace(/-/g, '/')) + milliSecond*p.delay);
                return {
                    timeStart: timeStart,
                    timeEnd: timeEnd
                }
            }

            function formatParamsMap(map, reportOptions) {
                var listMap = {
                    'm5': [],
                    'h1': [],
                    'd1': []
                };
                var defaultTF = reportOptions['timeFormat'];
                var timeStart = reportOptions['startTime'];
                var timeEnd = reportOptions['endTime'];
                //数据顺序
                var listOrder = [];

                Object.keys(map).forEach(function (row) {
                    var p = map[row];
                    if (!p.tf) {
                        p['tf'] = defaultTF;
                    }
                    if (listMap[p.tf]) {
                        var id = row;
                        if (id.indexOf(',') > -1) {
                            id = id.substring(0, id.indexOf(','));
                        }
                        var time = getPeriodTime(row, timeStart, timeEnd, map);
                        time = getDelayTime(row, time, map);
                        listMap[p.tf].push({
                            id: id,
                            timeStart: time.timeStart,
                            timeEnd: time.timeEnd,
                            row: row
                        });
                    }
                    // 不存在的类型直接过滤掉，并给予提示
                    else {
                        Log.warn('there has one point gave an unsupported time format: ' + p.tf);
                    }
                });

                return {
                    listMap: listMap,
                    list: (function () {
                        var list = [];
                        Object.keys(listMap).forEach(function (tf) {
                            var ids = listMap[tf];
                            if (ids.length) {
                                var order = {};
                                var result = (function (arr) {
                                    var n = {};
                                    for (var i = 0; i < arr.length; i++) {
                                        if (!n[arr[i].timeStart + '+' + arr[i].timeEnd]) {
                                            n[arr[i].timeStart + '+' + arr[i].timeEnd] = [arr[i].id];
                                            order[arr[i].timeStart + '+' + arr[i].timeEnd] = [arr[i].row];
                                        } else {
                                            n[arr[i].timeStart + '+' + arr[i].timeEnd].push(arr[i].id);
                                            order[arr[i].timeStart + '+' + arr[i].timeEnd].push(arr[i].row);
                                        }
                                    }
                                    return n;
                                }(ids));
                                for (var k in result) {
                                    var timeArr = k.split('+');
                                    list.push({
                                        dsItemIds: result[k],
                                        timeStart: timeArr[0],
                                        timeEnd: timeArr[1],
                                        timeFormat: tf
                                    });
                                    listOrder.push(order[k]);
                                }
                            }
                        });

                        return list;
                    }()),
                    listOrder:listOrder
                };
            }

            return function (options) {
                var _this = this;
                var infoList = format(this.variableProcessTasks);
                var dsDefineMap = {}, variableList = [];
                var params = [];
                var promise = $.Deferred();

                options = options || {};

                infoList.forEach(function (row) {
                    dsDefineMap = $.extend(false, {}, dsDefineMap, row.dsMap);
                });

                if (!Object.keys(dsDefineMap).length) {
                    // 转换成变量值
                    variableList = infoList.map(function (info) {
                        return calc(info, {}, info.ins.screen.variables || {});
                    });
                    // 执行无需处理变量的逻辑
                    promise.resolve(-1);
                } else {
                    params = formatParamsMap(dsDefineMap, options.reportOptions || this.getReportOptions());
                    $.ajax({
                        type:'post',
                        url: ((AppConfig.isMobile && AppConfig.host && (typeof cordova != 'undefined'))?AppConfig.host:'') + '/analysis/startWorkspaceDataGenHistogramMulti',
                        data: JSON.stringify(params.list),
                        contentType: 'application/json'
                    }).then(function (rs) {
                        
                        if (!rs.length) {
                            Log.warn('get no data for the report.');
                            promise.resolve(-1);
                            return;
                        } else {
                            var dsMap = {};
                            var order = params.list.map(function (row) {
                                return row.timeFormat;
                            });

                            var listOrder = [], data = [];
                            //发送的数据=>有序数组
                            params.listOrder.forEach(function (it) {
                                listOrder = listOrder.concat(it);
                            });
                            //接收的数据=>有序数组
                            rs.forEach(function (it) {
                                var time = it.timeShaft;
                                it.list.forEach(function (item) {
                                    data.push({data:item.data,timeShaft:time});
                                });
                            });
                            //按顺序对接
                            listOrder.forEach(function (it,i) {
                                dsMap[it] = data[i] ? data[i] : {data:[],timeShaft:[]};
                            });

                            // 转换成变量值
                            infoList.map(function (info) {
                                var map = {}, calcRs;
                                Object.keys(dsMap).forEach(function (ds) {
                                    map[ds] = dsMap[ds];
                                });
                                calcRs = calc(info, map, info.ins.screen.variables || {});
                                info.promise.resolve(calcRs);
                            });
                            // 执行完成变量处理的逻辑
                            promise.resolve();
                        }
                    }, function () {
                        promise.resolve(-1);
                    }).always(function () {
                        _this.variableProcessTasks.length = 0;
                        params.list = [];
                    });
                }

                return promise.done(function (status) {
                    var item, i;
                    // 未执行查询操作
                    if (status === -1) {
                        i = 0;
                        while( item = _this.variableProcessTasks.shift() ) {
                            item.promise.resolve(variableList[i]);
                            i++;
                        }
                    }
                });
            };

        } ());

    }.call(VariableProcessMixin.prototype);

    exports.VariableProcessMixin = VariableProcessMixin;
} (
    namespace('factory.report.mixins')
));