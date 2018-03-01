// 变量处理特性
;(function (exports) {

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
                var newTimeStart,newTimeEnd;
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
                // timeEnd = timeFormat(Date.parse(timeEnd.replace(/-/g, '/')) + milliSecond*p.delay);
                timeEnd = moment(+moment(timeEnd) + milliSecond * p.delay).format('YYYY-MM-DD HH:mm:ss');
                if(p.from){                   
                    newTimeStart = moment(moment(timeStart) + moment.duration(p.from)).format('YYYY-MM-DD HH:mm:ss');
                }else if(p.from_e){
                    newTimeStart = moment(moment(timeEnd) + moment.duration(p.from_e)).format('YYYY-MM-DD HH:mm:ss');
                }else{
                    newTimeStart = timeStart;
                }
                if(p.to){
                    newTimeEnd = moment(moment(timeStart) + moment.duration(p.to)).format('YYYY-MM-DD HH:mm:ss');
                }else if(p.to_e){
                    newTimeEnd = moment(moment(timeEnd) + moment.duration(p.to_e)).format('YYYY-MM-DD HH:mm:ss');
                }else{
                    newTimeEnd = timeEnd;
                }
                if(p.etaas){
                    newTimeEnd = timeFormat(Date.parse(timeEnd.replace(/-/g, '/')) + 1000); 
                }
                return {
                    timeStart: newTimeStart,
                    timeEnd: newTimeEnd
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
                        var time = getPeriodTime(row, p.timeStart||timeStart, p.timeEnd||timeEnd, map);
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
                                        var timeSolt = arr[i].timeStart + '+' + arr[i].timeEnd;
                                        if(map[arr[i].row].dac){
                                            n[timeSolt +",dac_"+i] = [arr[i].id];
                                            order[timeSolt +",dac_"+i] = [arr[i].row];
                                        } else {
                                            if(map[arr[i].row].str){
                                                var curProjectId = arr[i].id.split("|").length > 1 ? arr[i].id.split("|")[0].slice(1) : AppConfig.projectId;
                                                if(!(n[timeSolt +",str_"+curProjectId])){
                                                    n[timeSolt +",str_"+curProjectId] = [arr[i].id];
                                                    order[timeSolt +",str_"+curProjectId] = [arr[i].row];
                                                } else {
                                                    n[timeSolt +",str_"+curProjectId].push(arr[i].id);
                                                    order[timeSolt +",str_"+curProjectId].push(arr[i].row);
                                                }
                                            } else {
                                                if(!n[timeSolt]){
                                                    n[timeSolt] = [arr[i].id];
                                                    order[timeSolt] = [arr[i].row];
                                                } else {
                                                    n[timeSolt].push(arr[i].id);
                                                    order[timeSolt].push(arr[i].row);
                                                }
                                            }
                                        }                                    
                                    }
                                    return n;
                                }(ids));
                                for (var k in result) {
                                    var label = k.split(',').length > 1 ? k.split(',')[1] : null;
                                    var timeArr = k.split(',')[0].split("+");
                                    var listData = {
                                        dsItemIds: result[k],
                                        timeStart: timeArr[0],
                                        timeEnd: timeArr[1],
                                        timeFormat: tf
                                    }
                                    if(label){
                                        let projectId;
                                        listData.dsItemIds.forEach(function(row,i){
                                            if(i === 0){
                                                projectId = row.split("|").length > 1 ? row.split("|")[0].slice(1) : AppConfig.projectId;
                                            }
                                            listData.dsItemIds[i] = row.split("|").length > 1 ? row.split("|")[1] : row;
                                        })
                                        listData.projectId = parseInt(projectId);
                                        if(label){
                                            if(label.indexOf("dac") > -1){
                                                listData.noAutoComplete = true; 
                                            }else if(label.indexOf("str") > -1){
                                                listData.strHistorical = true; 
                                            }
                                        }
                                    }
                                    list.push(listData);
                                    
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
                //切换报表时的处理
                $('#loadBar').remove();//删除加载进度条
                if(this.loadingArr){//取消未完成的请求
                    this.loadingArr.forEach(function(loading){
                        loading.abort&&loading.abort();
                    });
                    this.loadingArr = undefined;
                }
                
                var layoutMap = {},//父子对应关系
                    level = {};//数据层级
                this.loadingArr = [];//请求集合
                this.anyoneFailed = false;//报表缺失
                var moduleMap = {};
                var allPromise =  $.Deferred();//最后的请求
                var chunkLevel;
                var setLayoutMap = function(parentId,index,container){//生成layoutMap和level
                    var $nodes;
                    if(container){
                        $nodes = $('[id]', container);
                        parentId = container.id || parentId;
                    } else {
                        $nodes = $('#'+ parentId +' [id]');
                    }
                    level[index] = level[index]||[];
                    level[index].push(parentId);
                    if($nodes.length>0){
                        var children = layoutMap[parentId] || [];
                        children.push($nodes[0].id);
                        $nodes.eq(0).siblings('[id]').each(function(i, it){
                            children.push(it.id);
                        });
                        layoutMap[parentId] = children;
                        index+=1;
                        children.forEach(function(child){setLayoutMap(child, index)});
                    } else {
                        return;
                    }
                };
                var getChildren = function(id){//根据ID获取所有子级
                    var result = [];
                    var children = layoutMap[id];
                    if(children){
                        result =  result.concat(children);
                        children.forEach(function(child){
                            result = result.concat(getChildren(child));
                        });
                    }
                    return result;
                };
                var getParent = function(id,deep,step){//根据ID获取所有父级 deep为向上搜索的深度
                    var result = [];
                    if(step<deep){
                        for(var k in layoutMap){

                            var parent = k,
                                children = layoutMap[k];
                            if(children.indexOf(id)>-1){
                                result.push(parent);
                                result = result.concat(getParent(parent,deep,++step));
                                return result;
                            }
                        }
                    }
                    return result;
                };
                var getDate = function(chunkLevel,level,layoutMap){//根据chunkLevel获取最底层子级
                    var targetArr = level[chunkLevel];
                    if(chunkLevel<0){
                        return [];
                    }
                    if(!targetArr||targetArr.length==0){
                        return getDate(--chunkLevel,level,layoutMap)
                    }
                    if(chunkLevel==0||chunkLevel==1||chunkLevel==2){
                        return targetArr;
                    } else {
                        var parentsWithoutChild = [];
                        var maxStep = chunkLevel-2;
                        var loop = function(step){
                            level[2+step]&&level[2+step].forEach(function(parentId,i){
                                var children = layoutMap[parentId];
                                if(!children||children.length==0){
                                    parentsWithoutChild.push(parentId);
                                }else if(++step<maxStep){
                                    loop(step);
                                }
                            });
                        }
                        loop(0);
                        return targetArr.concat(parentsWithoutChild);
                    }
                };

                var getSomeVariableProcessTasks = function(ids){//获取对应variableProcessTasks
                    var result = [];
                    if(chunkLevel==1){
                        result = _this.variableProcessTasks;
                    } else {
                        var flag = false;
                        _this.variableProcessTasks.forEach(function(o){
                            if(!o.ins.wrap){
                                flag = true;
                            }
                            if(o.ins.wrap&&ids.indexOf(o.ins.wrap.id)>-1){
                                result.push(o);
                            }
                        });
                        if(flag&&result.length==0){
                            result = _this.variableProcessTasks;
                        }
                    }
                    return result;
                };

                var setActive = function(scrollTop){//根据scrollTop加载模块
                    var height = scrollTop+$('body').height();
                    for(var id in moduleMap){
                        var item = moduleMap[id];
                        if(item.isLoad==0 && item.top<height){
                            item.isLoad = 1;
                            item.startSpin();
                            loadOne(id);
                        }
                    }
                };
                this.setActive = setActive;
                var loadOneEnd = function(id){
                    var keys = [];
                    for(var k in moduleMap){
                        keys.push(k);
                    }
                    keys.forEach(function(id){
                        var $target = $('#'+id);
                        if($target.length==0){
                            return;
                        }
                        moduleMap[id].top = 0;
                    });
                    moduleMap[id].isLoad = 2;
                    moduleMap[id].stopSpin();
                    var okLength = 0;
                    var statesLength = 0;
                    for(var k in moduleMap){
                        var state = moduleMap[k];
                        if(state.isLoad == 2){
                            okLength++;
                        }
                        statesLength++;
                    }
                    var $loadBar = $('#loadBar div');
                    if(statesLength==okLength){
                        $loadBar.stop().animate({'width':'100%'},800,function(){
                            $('#loadBar').remove();
                        });
                        allPromise.resolve();
                    } else {
                        $loadBar.stop().animate({'width':okLength/(statesLength+1)*100+'%'},800);
                    }
                };
                var loadOne = function(id){
                    var parentIds = getParent(id,999,0);
                    var childrenIds = getChildren(id);
                    var ajax = loadDate(getSomeVariableProcessTasks(parentIds.concat([id].concat(childrenIds))));
                    if(ajax){
                        _this.loadingArr.push(ajax);
                        return ajax.done(function(){
                            loadOneEnd(id);
                        }).fail(function(){
                            _this.anyoneFailed = true;
                            loadOneEnd(id);
                        });
                    } else {
                        loadOneEnd(id);
                    }
                };
                

                var failVariableProcessTasks = [];
                var variableList = {};
                var loadDate = function(someVariableProcessTasks){
                    var infoList = format(someVariableProcessTasks);
                    var dsDefineMap = {};
                    var params = [];
                    var promise = $.Deferred().done(function(status){
                        if(status == -1){
                            failVariableProcessTasks = failVariableProcessTasks.concat(someVariableProcessTasks);
                        }
                    });
                    options = options || {};

                    infoList.forEach(function (row) {
                        dsDefineMap = $.extend(false, {}, dsDefineMap, row.dsMap);
                    });

                    if (!Object.keys(dsDefineMap).length) {
                        // 转换成变量值
                        infoList.forEach(function(info){
                            variableList[info.ins.wrap&&info.ins.wrap.id] = calc(info, {}, info.ins.screen.variables || {});
                        });
                        // 执行无需处理变量的逻辑
                        promise.resolve(-1);
                    } else {
                        params = formatParamsMap(dsDefineMap, options.reportOptions || _this.getReportOptions());
                        var ajax = $.ajax({
                            type:'post',
                            url: ((AppConfig.isMobile && AppConfig.host && (typeof cordova != 'undefined'))?AppConfig.host:'') + '/factory/getHistoryData',
                            data: JSON.stringify(params.list),
                            contentType: 'application/json'
                        });
                        ajax.then(function (rs) {
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
                        });

                        return ajax;
                    }
                }

                setLayoutMap('reportWrap',0,_this.root.screen.container);
                chunkLevel = this.entity&&this.entity.modal&&this.entity.modal.option&&this.entity.modal.option.chunkLevel||AppConfig.isReportConifgMode?0:2;
                chunkLevel+=1;
                getDate(chunkLevel,level,layoutMap).forEach(function(id){
                    var $target = $('#'+id);
                    var spinner = new LoadingSpinner({color: '#00FFFF'});
                    var startSpin =  function(){
                        var height = $target.height();
                        height && height > 9 && spinner.spin($target[0]);
                    };
                    var stopSpin = function(){
                        $target[0]&&spinner.stop()
                    };
                    moduleMap[id] = {
                        startSpin: startSpin,
                        stopSpin: stopSpin,
                        top: 0,//$target.offset().top,
                        isLoad: 0
                    };
                });
                $('.report-wrap.gray-scollbar').append($('<div id="loadBar"><div style="width:0%;height:100%;background:red;"></div></div>'));
                $('.reportContainer.scrollable-y.gray-scrollbar').scrollTop(0);
                setActive($('#reportWrap').height());
                
                return allPromise.done(function(){
                    if(failVariableProcessTasks.length>0){
                        var item;
                        // 未执行查询操作
                        while( item = _this.variableProcessTasks.shift() ) {
                            item.promise.resolve(variableList[item.ins.wrap&&item.ins.wrap.id]);
                        }
                    }
                }).always(function () {
                    _this.loadingArr = undefined;
                    _this.variableProcessTasks.length = 0;
                });;
                
            };

        } ());

    }.call(VariableProcessMixin.prototype);

    exports.VariableProcessMixin = VariableProcessMixin;
} (
    namespace('factory.report.mixins')
));