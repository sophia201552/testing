// 报表中的图表样式配置
;(function (exports) {

    exports.ChartThemeConfig = exports.ChartThemeConfig || {};
    
    // 非移动端
    +function () {
        var DEFAULT_CHART_OPTIONS = {
            title: {
                textStyle: {
                    fontWeight: 'normal',
                    color: '#000'
                },
                left: 'center'
            },
            toolbox: {
                showTitle:false
            },
            grid: {
                borderWidth: 0,
                left:80,
                bottom:40,
                right:80,
                top:80
            },
            series: [],
            color: ['#E2583A','#FD9F08','#1D74A9','#04A0D6','#689C0F','#109d83','#FEC500'],
            animation:false
        };

        // 饼图默认图表配置
        this.PIE_CHART_OPTIONS = $.extend(false, {}, DEFAULT_CHART_OPTIONS, {
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'horizontal',
                left:50,
                data: []
            }
        });

        // 直角系（带轴）默认图表配置
        this.AXIS_CHART_OPTIONS = $.extend(false, {}, DEFAULT_CHART_OPTIONS, {
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(0,0,0,0.6)',
                axisPointer : {
                    type : 'line',
                    lineStyle : {
                        color: '#aaa'
                    },
                    crossStyle: {
                        color: '#aaa'
                    },
                    shadowStyle : {
                        color: 'rgba(200,200,200,0.2)'
                    }
                },
                textStyle: {
                    color: '#ffffff'
                }
            },
            legend: {
                textStyle: {
                    color: '#999999'
                },
                top:30,
                data: []
            },
            valueAxis:{
                axisLine: {
                    show:false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    textStyle: {
                        color: '#8c97aa'
                    },
                    margin:10
                },
                splitLine: {
                    lineStyle: {
                        color: ['#999999'],
                        type:"solid",
                        opacity:0.4
                    }
                },
                nameTextStyle:{
                    color:'#000000'
                }
            },
            categoryAxis: {
                axisLine: {
                    lineStyle:{
                        color:'#333333',
                        opacity:0.6
                    }
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    textStyle: {
                        color: '#8c97aa'
                    },
                    margin:10
                },
                splitLine: {
                    show: false,
                },
                nameTextStyle:{
                    color:'#000000'
                }
            },
            xAxis:[{
                axisLine: {
                    lineStyle:{
                        color:'#333333',
                        opacity:0.6
                    }
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    textStyle: {
                        color: '#8c97aa'
                    },
                    margin:10
                },
                splitLine: {
                    show: false,
                },
                nameTextStyle:{
                    color:'#000000'
                }
            }],
            yAxis:[{
                axisLine: {
                        show:false
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#8c97aa'
                        },
                        margin:10
                    },
                    splitLine: {
                        lineStyle: {
                            color: ['#999999'],
                            type:"solid",
                            opacity:0.4
                        }
                    },
                    nameTextStyle:{
                        color:'#000000'
                    }
                }]

        });

    }.call(exports.ChartThemeConfig);

    // 移动端
    if (AppConfig && AppConfig.isMobile) {
        +function () {
            //移动端饼图默认配置
            this.PIE_CHART_OPTIONS = $.extend(false, {}, this.PIE_CHART_OPTIONS, {
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    orient: 'horizontal',
                    left:50,
                    data: []
                }
            });

            //移动端直角系（带轴）默认图表配置
            this.AXIS_CHART_OPTIONS = $.extend(false, {}, this.AXIS_CHART_OPTIONS, {
                grid:{
                    left:60,
                    bottom:40,
                    right:20,
                    top:130
                },
                yAxis: [{
                    type: 'value',
                    axisTick: {
                        show: false
                      },
                    axisLine: {
                        show:false
                    },
                    nameGap:45
                }]
            });

        }.call(exports.ChartThemeConfig);
    }

} (
    namespace('factory.report.config')
));
// 变量处理特性
(function (exports) {

    function VariableProcessMixin() {
        this.variableProcessTasks = [];
    }

    +function () {

        // 注册一个任务
        this.registTask = function (variables, ins) {
            var promise = $.Deferred();
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
                    return new Function('SUM', 'SUM_POINT', 'NONZERO_AVERAGE', 'AVERAGE', 'MAX', 'MIN', '_map', 'return ' + str)(
                        api['SUM'],
                        api['SUM_POINT'],
                        api['NONZERO_AVERAGE'],
                        api['AVERAGE'],
                        api['MAX'],
                        api['MIN'],
                        map
                    );
                } catch(e) {
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

                            oldTime = (new Date(timeStart)).getTime() - dayMs * count;
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

            function formatParamsMap(map, reportOptions) {
                var listMap = {
                    'm5': [],
                    'h1': [],
                    'd1': []
                };
                var defaultTF = reportOptions['timeFormat'];
                var timeStart = reportOptions['startTime'];
                var timeEnd = reportOptions['endTime'];

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
                        var time = getPeriodTime(row, timeStart, timeEnd, map)
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
                                var result = (function (arr) {
                                    var n = {};
                                    for (var i = 0; i < arr.length; i++) {
                                        if (!n[arr[i].timeStart + '+' + arr[i].timeEnd]) {
                                            n[arr[i].timeStart + '+' + arr[i].timeEnd] = [arr[i].id];
                                        } else {
                                            n[arr[i].timeStart + '+' + arr[i].timeEnd].push(arr[i].id);
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
                                }
                            }
                        });

                        return list;
                    } ())
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
                            rs.forEach(function (row, i) {
                                var list = params.listMap[order[i]];
                                var dsDataMap = Array.toMap(row.list, 'dsItemId');

                                list.forEach(function (l) {
                                    dsMap[l.row] = {
                                        data: dsDataMap[l.id].data,
                                        timeShaft: row.timeShaft
                                    };
                                });
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
;(function (exports) {

    function Component() {

    }

    +function () {

        this.onRenderComplete = function () {
            throw new Error('onRenderComplete 方法需要实现才能使用');
        };

        /**
         * 控件的渲染方法
         */
        this.render = function () {
            throw new Error('render 方法需要实现才能使用');
        };

        /**
         * 控件的销毁方法
         */
        this.destroy = function () {
            throw new Error('destroy 方法需要实现才能使用');
        };

    }.call(Component.prototype);

    exports.Component = Component;

} ( namespace('factory.report.components') ));

;(function (exports, SuperClass, DateUtil) {

    function Base(parent, entity, root, idx) {
        SuperClass.apply(this, arguments);

        this.screen = parent;
        this.entity = entity;
        this.entity.id = this.entity.id || ObjectId();

        this.wrap = null;
        this.container = null;
        this.spinner = null;

        this.variables = null;

        this.root = root || this;

        this.initEntity();

        this.init(idx);
    }

    Base.prototype = Object.create(SuperClass.prototype);
    Base.prototype.constructor = Base;

    +function () {

        this.UNIT_WIDTH = 100/12;

        this.UNIT_HEIGHT = 60;

        this.TPL_PARAMS_PATTERN = /<#\s*(\w*?)\s*#>/mg;

        this.TPL_PARAMS_IN_VARIABLES_PATTERN = /<@\s*(\w*?)\s*@>/mg;

        // 初始化 entity 数据结构
        this.initEntity = function () {};

        /**
         * @override
         */
        this.render = function () {};

        /**
         * 初始化控件容器
         * @param  {number} insertIdx 容器待插入的位置下标
         */
        this.init = function (insertIdx) {
            var _this = this;
            var divWrap, divParent;

            this.wrap = divWrap = document.createElement('div');
            divWrap.id = 'reportContainer_' + this.entity.id;
            divWrap.className = 'report-container-wrap';
            if (this.optionTemplate.className) {
                divWrap.classList.add(this.optionTemplate.className);
            }

            divParent = document.createElement('div');
            divParent.classList.add('report-container');
            
            divWrap.appendChild(divParent);

            if (typeof insertIdx === 'undefined') {
                this.screen.container.appendChild(divWrap);
            }
            // 插入到指定的位置下标
            else{
                this.screen.container.insertBefore(divWrap, this.screen.container.childNodes[insertIdx]);
            }

            // 如果是在动态报表块中，则不添加任何配置按钮
            if (AppConfig.isReportConifgMode) {
                // 初始化头部
                this.initHeader();
                if ( !this.isIn('Block') ) {
                    // 初始化工具
                    this.initTools();
                    // 初始化大小调节器
                    this.initResizer();
                }
            }

            this.container = document.createElement('div');
            this.container.className = 'report-content clearfix';
            divParent.appendChild(this.container);

            this.resize();

            return this;
        };

        /** 初始化控件头部 */
        this.initHeader = function () {
            var divWrap = this.wrap;
            var divParent = divWrap.querySelector('.report-container');
            // 添加头部
            var divTop, divHeader;

            divTop = document.createElement('div');
            divTop.classList.add('report-top-box');
            divTop.classList.add('clearfix');
            divParent.appendChild(divTop);

            divHeader = document.createElement('div');
            divHeader.className = 'report-header';
            divHeader.innerHTML = eval(this.optionTemplate.name);
            divTop.appendChild(divHeader);

            this.initTitle();
        };

        this.initTools = function (tools) {
            var _this = this;
            // 控件最外层包裹层
            var divWrap;
            // 控件最外层
            var divTop;
            //按钮容器
            var divToolWrap;
            // 配置按钮
            var btn, tool, len;

            divWrap = this.wrap;
            divTop = divWrap.querySelector('.report-top-box');
            divToolWrap = document.createElement('div');
            divToolWrap.className = 'report-tool-wrap';

            // 控件默认的按钮
            tools = tools || ['variable', 'configure', 'remove'];

            // 复制数组
            tools = tools.concat();
            len = tools.length;

            while ( tool = tools.shift() ) {
                switch (tool) {
                    // 变量声明
                    case 'variable':
                        btn = document.createElement('a');
                        btn.className = 'report-tool-btn';
                        btn.title = I18n.resource.report.VAR_DECLARATION;
                        btn.href = 'javascript:;';
                        btn.innerHTML = '<span class="glyphicon glyphicon-th-large"></span>';
                        divToolWrap.appendChild(btn);
                        btn.onclick = function(e) {
                            DeclareVariablesModal.show({
                                js: JSON.stringify(_this.entity.modal.variables) || ''
                            }, function (code) {
                                var rs = '';
                                try {
                                    rs = new Function('return ' + code.js)();
                                } catch(e) {
                                    alert(I18n.resource.report.VAR_DECLARATION_INFO);
                                    rs = code.js;
                                }
                                _this.entity.modal.variables = rs;
                                _this.render(true);
                            }, ['js']);
                        };
                        break;
                    // 配置按钮
                    case 'configure':
                        btn = document.createElement('a');
                        btn.className = 'report-tool-btn ';
                        btn.title = I18n.resource.report.chapterConfig.CONFIG;
                        btn.href = 'javascript:;';
                        btn.innerHTML = '<span class="glyphicon glyphicon-cog"></span>';
                        divToolWrap.appendChild(btn);
                        btn.onclick = function(e) {
                            _this.showConfigModal();
                        };
                        break;
                    // 删除按钮
                    case 'remove':
                        btn = document.createElement('a');
                        btn.className = 'report-tool-btn ';
                        btn.title = I18n.resource.report.REMOVE_BTN;
                        btn.innerHTML = '<span class="glyphicon glyphicon-remove"></span>';
                        divToolWrap.appendChild(btn);
                        btn.onclick = function(e){
                            confirm(I18n.resource.report.CONFIRM_DELETE, function(){
                                if (_this.chart) _this.chart.clear();
                                _this.screen.remove(_this.entity.id);
                                $(_this.wrap).remove();
                            });
                        };
                        break;
                    // 模板参数配置按钮
                    case 'tplParamsConfigure':
                        btn = document.createElement('a');
                        btn.className = 'report-tool-btn ';
                        btn.title = I18n.resource.report.CONFIG_TEMPLATE_PRAM;
                        btn.innerHTML = '<span class="glyphicon glyphicon-list-alt"></span>';
                        divToolWrap.appendChild(btn);
                        btn.onclick = function(e){
                            _this.showConfigModal(exports.ReportTplParamsConfigModal);
                        };
                        break;

                }
            }
            if (len > 0) {
                //divParent.appendChild(divToolWrap);
                divTop.appendChild(divToolWrap);
            }
        };

        this.initResizer = function () {
            var _this = this;
            var divWrap = this.wrap;
            var $divTop = $(divWrap.querySelector('.report-top-box'));
            var iptResizerCol, iptResizerRow;
            var options = this.optionTemplate;
            this.entity.spanC = this.entity.spanC || options.minWidth;
            this.entity.spanR = this.entity.spanR || options.minHeight;

            // 新增宽高的编辑
            var $resizers = $( ('<div class="btn-group number-resizer-wrap">\
                <label class="control-label">'+ I18n.resource.report.LABEL_WIDTH +':</label><input type="number" class="btn btn-default number-resizer-col" value="{width}" min="{minWidth}" max="{maxWidth}">\
                <label class="control-label">'+ I18n.resource.report.LABEL_HEIGHT +':</label><input type="number" class="btn btn-default number-resizer-row" value="{height}" min="{minHeight}" max="{maxHeight}">\
            </div>').formatEL({
                width: this.entity.spanC,
                height: this.entity.spanR,
                minWidth: options.minWidth,
                minHeight: options.minHeight,
                maxWidth: options.maxWidth,
                maxHeight: options.maxHeight
            })).appendTo($divTop);

            iptResizerCol = $resizers[0].querySelector('.number-resizer-col');
            iptResizerRow = $resizers[0].querySelector('.number-resizer-row');

            iptResizerRow.onchange = function () {
                this.value = Math.max( Math.min(options.maxHeight, this.value), options.minHeight );
                _this.entity.spanR = Math.floor(this.value);
                _this.resize();
            };
            iptResizerCol.onchange = function () {
                this.value = Math.max( Math.min(options.maxWidth, this.value), options.minWidth );
                _this.entity.spanC = Math.floor(this.value);
                _this.resize();
            };
             _this.divResizeByMouseInit();
        };
        this.divResizeByMouseInit = function (){
            var _this = this;
            var divContainer = $(this.wrap).get(0);
            var resizeOnRight = document.createElement('div');
            resizeOnRight.className = 'resizeOnRight';
            divContainer.appendChild(resizeOnRight);
            var resizeOnBottom = document.createElement('div');
            resizeOnBottom.className = 'resizeOnBottom';
            divContainer.appendChild(resizeOnBottom);
            var resizeOnCorner = document.createElement('div');
            resizeOnCorner.className = 'resizeOnCorner';
            divContainer.appendChild(resizeOnCorner);
            var mouseStart = {};
            var containerStart = {};
            var w, h,tempSpanR,tempSpanC;
            resizeOnBottom.onmousedown = function(e){
                e.stopPropagation();
                var $reportWrap = $('#reportWrap');
                var oEvent = e || event;
                mouseStart.y = oEvent.clientY;
                containerStart.h = $(divContainer).height();
                doResizeOnType(e,'bottom');
                $reportWrap.off('mousemove').on('mousemove',function(e){
                    doResizeOnType(e,'bottom');
                });
                $reportWrap.off('mouseup').on('mouseup',function(e){
                    stopResizeOnType(e,'bottom');
                    $reportWrap.off('mousemove mouseup');
                    $(resizeOnBottom).off('mousedown');
                });
            };
            resizeOnRight.onmousedown = function(e){
                e.stopPropagation();
                var $panels = $('#panels');
                var oEvent = e || event;
                mouseStart.x = oEvent.clientX;
                containerStart.w = $(divContainer).width();
                var minSpanC;
                if(_this.entity.modal.type === "Table"){
                    minSpanC = 6;
                }else{
                    minSpanC = 3;
                }
                containerStart.minW = $(divContainer).parent().width()*(minSpanC*_this.UNIT_WIDTH/100)-parseInt($(divContainer).css('padding-left'))-parseInt($(divContainer).css('padding-right'));
                doResizeOnType(e,'right');
                $panels.off('mousemove').on('mousemove',function(e){
                    doResizeOnType(e,'right');
                });
                $panels.off('mouseup').on('mouseup',function(e){
                    stopResizeOnType(e,'right');
                    $panels.off('mousemove mouseup');
                    $(resizeOnRight).off('mousedown');
                });
            };
            resizeOnCorner.onmousedown = function(e){
                e.stopPropagation();
                var $panels = $('#panels');
                var oEvent = e || event;
                mouseStart.x = oEvent.clientX;
                mouseStart.y = oEvent.clientY;
                containerStart.w = $(divContainer).width();
                containerStart.h = $(divContainer).height();
                doResizeOnType(e,'corner');
                $panels.off('mousemove').on('mousemove',function(e){
                    doResizeOnType(e,'corner');
                });
                $panels.off('mouseup').on('mouseup',function(e){
                    stopResizeOnType(e,'corner');
                    $panels.off('mousemove mouseup');
                    $(resizeOnCorner).off('mousedown');
                });
            };
            function doResizeOnType(e,type){
                var oEvent = e || event;
                var differenceX,differenceY;
                switch (type){
                    case 'bottom':
                        //if(oEvent.clientY - containerStart.h < $(divContainer).offset().top){
                        //    return;
                        //}
                        differenceY = oEvent.clientY - mouseStart.y;
                        h = differenceY + containerStart.h;
                        divContainer.style.height = h + "px";
                        break;
                    case 'right':
                        if((oEvent.clientX - containerStart.minW) < ($(divContainer).offset().left+parseInt($(divContainer).css('padding-left')))){
                            return;
                        }
                        differenceX = oEvent.clientX - mouseStart.x;
                        w = differenceX + containerStart.w;
                        $(divContainer).width(w);
                        break;
                    case 'corner':
                        differenceX = oEvent.clientX - mouseStart.x;
                        w = differenceX + containerStart.w;
                        $(divContainer).width(w);
                        differenceY = oEvent.clientY - mouseStart.y;
                        h = differenceY + containerStart.h;
                        divContainer.style.height = h + "px";
                        break;
                }
            }
            function stopResizeOnType (e,type){
                var oEvent = e || event;
                var differenceX,differenceY;
                switch (type) {
                    case 'bottom':
                        differenceY = oEvent.clientY - mouseStart.y;
                        h = differenceY + containerStart.h;
                        tempSpanR = Math.round(h/_this.UNIT_HEIGHT);
                        $(divContainer).find('.number-resizer-row').val(tempSpanR).trigger('change');
                        break;
                    case 'right':
                        differenceX = oEvent.clientX - mouseStart.x;
                        w = differenceX + containerStart.w;
                        tempSpanC = Math.round(w*100/($(divContainer).parent().width()*_this.UNIT_WIDTH));
                        $(divContainer).find('.number-resizer-col').val(tempSpanC).trigger('change');
                        break;
                    case 'corner':
                        differenceX = oEvent.clientX - mouseStart.x;
                        w = differenceX + containerStart.w;
                        tempSpanC = Math.round(w*100/($(divContainer).parent().width()*_this.UNIT_WIDTH));
                        differenceY = oEvent.clientY - mouseStart.y;
                        h = differenceY + containerStart.h;
                        tempSpanR = Math.round(h/_this.UNIT_HEIGHT);
                        $(divContainer).find('.number-resizer-row').val(tempSpanR).trigger('change');
                        $(divContainer).find('.number-resizer-col').val(tempSpanC).trigger('change');
                        break;
                }
            }
        };

        this.initTitle = function () {};

        this.showConfigModal = function (modal) {
            var domWindows = document.querySelector('#windowRightPanel');

            if (!modal) {
                modal = exports[this.entity.modal.type + 'ConfigModal'];
            }

            modal.setOptions({
                modalIns: this,
                container: 'reportWrap'
            });

            modal.show().done(function () {
                // 设置位置
                modal.$modal.css({
                    top: domWindows.scrollTop + 'px',
                    bottom: -domWindows.scrollTop + 'px'
                });
            });
        };

        this.resize = function () {
            $(this.wrap).css({
                width: this.entity.spanC * this.UNIT_WIDTH + '%',
                height: this.entity.spanR * this.UNIT_HEIGHT + 'px'
            });
        };

        // 获取模板参数
        this.getTplParams = function () {
            var str = (function () {
                var variables = this.entity.modal.variables;
                var str = '';
                if (!variables) {
                    return '';
                }
                Object.keys(variables).forEach(function (k) {
                    str += variables[k];
                });

                return str;
            }.call(this));
            var pattern = this.TPL_PARAMS_IN_VARIABLES_PATTERN;
            var match = null;
            var params = [];

            while( match = pattern.exec(str) ) {
                params.push(match[1]);
            }

            return params;
        };

        // 从本身开始，逐级向上级匹配，返回匹配到的某个控件
        this.closest = function (cond) {
            var parent = this;
            var tmp;

            while(parent && parent !== this.root) {
                // 判断类型
                if (cond['type']) {
                    tmp = Object.prototype.toString.call(cond['type']) === '[object Array]' ? 
                        cond['type'] : [cond['type']];
                    if ( tmp.indexOf(parent.entity.modal.type) > -1 ) {
                        return parent;
                    }
                }
                parent = parent.screen;
            }

            return null;
        };

        // 获取指定容器的模板参数值
        this.getTplParamsValue = function () {
            return (this.closest({type: 'ChapterContainer'}) || this).entity.modal.option.tplParams;
        };

        // 应用模板参数
        this.applyTplParams = function (params) {
            this.entity.modal.option.tplParams = params;
        };

        // 获取报表全局配置的时间
        this.getReportDate = function () {
            return this.root.screen.reportDate;
        };

        // 获取报表全局配置
        this.getReportOptions = function () {
            var options = this.root.entity.modal.option;
            var periodStartTime = typeof options.periodStartTime !== 'undefined' ? options.periodStartTime : 0;
            var date = this.root.screen.reportDate;
            var params = {};
            var dStart, dEnd, month, year, day;
            var now = new Date();

             if (!date) {
                switch(options.period) {
                    case 'day':
                        dStart = new Date( (Math.floor(now.valueOf()/86400000) - 1) * 86400000 );
                        break;
                    case 'week':
                        var weekDay = now.getDay() === 0 ? 13 : 7 + (now.getDay()-1);
                        dStart =  new Date( (Math.floor(now.valueOf()/86400000) - weekDay) * 86400000 );
                        break;
                    case 'month':
                        year = now.getFullYear();
                        month = now.getMonth() + 1;
                        month = month < 10 ? ('0' + month) : month;

                        dStart = new Date( [year, month].join('-') );
                        break;
                    case 'year':
                        year = now.getFullYear();
                        dStart = new Date( year - 1 + '' );
                        break;
                }
            } else {
                dStart = new Date(date);
            }

            // 处理时间周期的偏移量
            switch(options.period || 'day') {
                // 天
                case 'day':
                    // 偏移单位为：小时
                    dStart = new Date(dStart.valueOf() + periodStartTime * 3600000);
                    dEnd = new Date(dStart.valueOf() + 86400000);
                    params['timeFormat'] = 'm5';
                    break;
                // 周
                case 'week':
                    dStart = new Date(dStart.valueOf() + periodStartTime * 86400000);
                    dEnd = new Date(dStart.valueOf() + 86400000 * 7 );
                    params['timeFormat'] = 'd1';
                    break;
                // 月
                case 'month':
                    // 偏移单位为：天
                    dStart = new Date(dStart.valueOf() + periodStartTime * 86400000);
                    dEnd = new Date(dStart.valueOf() + DateUtil.daysInMonth(dStart) * 86400000);
                    params['timeFormat'] = 'd1';
                    break;
                // 年
                case 'year':
                    // 如果偏移量大于 12，则追加到 “年” 上
                    year = dStart.getFullYear() + Math.floor(periodStartTime / 12);
                    periodStartTime = periodStartTime % 12;
                    month = dStart.getMonth() + periodStartTime + 1;
                    month = month < 10 ? ('0' + month) : month;

                    dStart = new Date([year, month].join('-'));
                    dEnd = new Date(dStart.valueOf() + (DateUtil.isLeapYear(year) ? 366 : 365) * 86400000);
                    params['timeFormat'] = 'd1';
                    break;
            }
            // 处理时区
            dStart = new Date(dStart.valueOf() + dStart.getTimezoneOffset()*60000);
            // 最后减去 1s 是为了回到上一天，否则查询结果会多一天
            dEnd = new Date(dEnd.valueOf() + dEnd.getTimezoneOffset()*60000 - 1000);
            params['startTime'] = dStart.format('yyyy-MM-dd HH:mm:ss');
            params['endTime'] = dEnd.format('yyyy-MM-dd HH:mm:ss');

            return params;
        };

        // 注册一个处理变量的任务
        this.registVariableProcessTask = function (variables) {
            // 处理 variables 中的模板参数
            variables = this._getTplParamsAttachedVariables(variables);

            return this.root.registTask(variables, this).then(function (rs) {
                this.variables = this.createObjectWithChain(rs);
            }.bind(this));
        };

        // 将变量定义字符串中的模板参数用真实的参数替换掉
        this._getTplParamsAttachedVariables = function (variables) {
            var params = this.getTplParamsValue();
            var pattern = this.TPL_PARAMS_IN_VARIABLES_PATTERN;
            var obj = {};

            if (!params || !variables) {
                return variables;
            }

            Object.keys(variables).forEach(function (k) {
                var row = variables[k];
                obj[k] = row.replace(pattern, function ($0, $1) {
                    // 如果不是云点
                    return params[$1] || '';
                });
            });
            return obj;
        };

        this.createObjectWithChain = (function () {
            function PropFunction(props) {
                var _this = this;
                for (var p in props) {
                    // 这里需要去访问继承链上的属性，所以不用 hasOwnProperty
                     _this[p] = props[p];
                }
            }

            return function (props) {
                PropFunction.prototype = this.screen.variables || {};
                return new PropFunction(props);
            }
        } ());

        // 判断某个控件是否在某种类型的容器内
        // 示例：判断某个控件是否在章节容器中 - isIn('ChapterContainer')
        this.isIn = function (type) {
            var parent, find;

            if (typeof type !== 'string') {
                return false;
            }

            if (this === this.root) {
                return false;
            }

            find = false;
            parent = this.screen;

            while (parent !== null) {
                if (parent.optionTemplate.type === type) {
                    find = true;
                    break;
                }
                if (parent === this.root) {
                    return false;
                }
                parent = parent.screen;
            }

            return find;
        };

        /**
         * 指示当前是否有章节号，默认为有
         * @return {Boolean} true 为有，false为无
         */
        this.hasChapterNo = function () {
            return true;
        };

        this.destroy = function () {};

    }.call(Base.prototype);

    exports.Base = Base;

} ( namespace('factory.report.components'),
    namespace('factory.report.components.Component'),
    DateUtil ));
;(function (exports, SuperClass, VariableProcessMixin) {

    function Container() {
        this.children = [];

        SuperClass.apply(this, arguments);

        this.entity.modal.option = this.entity.modal.option || {};
        this.entity.modal.option.layouts = this.entity.modal.option.layouts || [];
    }

    Container.prototype = Object.create(SuperClass.prototype);
    Container.prototype.constructor = Container;

    +function () {

        this.optionTemplate = {
            group: '基本',
            name: 'I18n.resource.report.REPORT_RIGHT_NAME',//I18n.resource.report.REPORT_RIGHT_NAME
            minWidth: 12,
            minHeight: 6,
            maxWidth: 12,
            maxHeight: 6,
            spanC: 12,
            spanR: 12,
            type: 'Container',
            className: 'chapter-container'
        };

        /** override */
        this.init = function () {
            SuperClass.prototype.init.apply(this, arguments);
            // 初始化 IOC
            this.initIoc();
            
            this.initDropEvents();            
        };

        /** 初始化拖拽事件 */
        this.initDropEvents = function () {
            var _this = this;
            var container = this.wrap;
            // 初始化拖拽添加 modal 的代码
            container.ondragenter = function (e) {
                e.preventDefault();
                e.stopPropagation();
                var tooltip = document.createElement('div');
                tooltip.id = 'divTooltip';
                document.body.appendChild(tooltip);
            };

            container.ondragover = function (e) {
                e.preventDefault();
                e.stopPropagation();
                var $divTooltip = $('#divTooltip');
                if(_this.root.wrap === this){
                    $divTooltip.html('报表');
                }else{
                    $divTooltip.html('章节' + _this.chapterNo);
                }
                if(!$(_this.wrap).children().hasClass('borderHover')){
                    $(_this.wrap).children().addClass('borderHover');
                }
                $divTooltip.css('left', e.clientX - 1.5*$('.badge').width());
                $divTooltip.css('top', e.clientY - $('#header').height());
            };

            container.ondragleave = function (e) {
                e.preventDefault();
                e.stopPropagation();
                $('#divTooltip').remove();
                if($(_this.wrap).children().hasClass('borderHover')){
                    $(_this.wrap).children().removeClass('borderHover');
                }
            };

            container.ondrop = function (e) {
                $('#divTooltip').remove();
                if($(_this.wrap).children().hasClass('borderHover')){
                    $(_this.wrap).children().removeClass('borderHover');
                }
                var type = e.dataTransfer.getData('type');
                e.stopPropagation();

                var screen = $(_this.root.wrap);//$('#reportWrap').children('.report-container-wrap');
                var currentY = e.clientY;
                var currentX = e.clientX;
                // 判断是否 drop 在了某个控件上
                // 如果是，则在该控件里面插入新控件
                // 如果不是，则保持插入到鼠标的位置
                var insertIndex = _this.targetDom(screen,currentX,currentY);

                // 非模板
                if (type !== 'template') {
                    _this.add({
                        modal: {
                            type: type,
                            option: {}
                        }
                    },insertIndex);
                }
                // 模板
                else {
                    Spinner.spin($(_this.root.wrap)[0]);
                    WebAPI.post('/factory/material/getByIds', {
                        ids: [e.dataTransfer.getData('id')]
                    }).done(function (rs) {
                        var data = _this.updateTemplateId(rs[0]);
                        _this.addFromTemplate(data, insertIndex);
                        Spinner.stop();
                    });
                }
            };
        };
        this.targetDom = function($dom,currentX,currentY) {
            if(!$dom || $dom.length === 0) return;//drop 在了某个控件上
            var $domPaddingTop = parseInt($dom.css('padding-top'));
            var $domPaddingBottom = parseInt($dom.css('padding-bottom'));
            var $domPaddingLeft = parseInt($dom.css('padding-left'));
            var $domPaddingRight = parseInt($dom.css('padding-right'));
            var $domY = $dom.offset().top;
            var $domX = $dom.offset().left + $domPaddingLeft;
            var $domPaddingY = $domPaddingTop + $domPaddingBottom;
            var $domPaddingX = $domPaddingLeft + $domPaddingRight;
            if($domY < currentY){//竖向递归
                if(($domY + $dom.height() - $domPaddingY) > currentY){
                    if($domX < currentX){//横向递归
                        if(($domX + $dom.width() - $domPaddingX) > currentX){
                            return this.targetDom($dom.find('.report-content').eq(0).children().eq(0),currentX,currentY);
                        }else{
                            return this.targetDom($dom.next().eq(0),currentX,currentY);
                        }
                    }else{
                        return $dom.index();
                    }
                }else{
                    return this.targetDom($dom.next().eq(0),currentX,currentY);
                }
            }else{
                return $dom.index();
            }
        };
        this.updateTemplateId = (function () {
            function replaceId (templateContent){
                if(templateContent.id){
                    templateContent.id =  ObjectId();
                }
                var childrenLayout = templateContent.modal.option.layouts;
                if(childrenLayout && childrenLayout.length > 0){
                    childrenLayout.forEach(function(row){
                        replaceId(row);
                    })
                }
            }
            return function  (data) {
                var templateContent = data.content.layout;
                replaceId(templateContent);
                return templateContent;
            }
        }());
        this.initIoc = function() {
            this.factoryIoC = new FactoryIoC('report');
        };

        /* override */
        this.initResizer = function () {};

        this.initTools = function (tools) {
            tools = tools || [];
            SuperClass.prototype.initTools.call(this, tools);
        };

        this.add = function (params,idx) {
            var modalClass = this.factoryIoC.getModel(params.modal.type);
            var options = modalClass.prototype.optionTemplate;
            var ins;
            var insertIndex = idx;
            idx = typeof idx === 'undefined' ? this.children.length : idx;

            params.spanC = params.spanC || options.spanC || options.minWidth;
            params.spanR = params.spanR || options.spanR || options.minHeight;
            ins = new modalClass(this, params, this.root,insertIndex);

            this.children.splice(idx, 0, ins);
            this.entity.modal.option.layouts.splice(idx, 0, ins.entity);

            ins.render(true);

            // 如果新增的元素是章节，则更新章节编号和汇总
            if (params.modal.type === 'ChapterContainer') {
                this.refreshTitle(this.chapterNo);
                this.root.refreshSummary();
            }

            return ins;
        };

        // 从模板添加控件
        this.addFromTemplate = function (params, idx) {
            var ins = this.add(params, idx);
            var tplParams = ins.getTplParams();

            if (tplParams.length) {
                ins.showConfigModal(exports.ReportTplParamsConfigModal);
            }
        };

        this.remove = function (id) {
            var idx = -1;
            var removed = null;

            this.children.some(function (row, i) {
                if (row.entity.id === id) {
                    idx = i;
                    return true;
                }
                return false;
            });

            if (idx > -1) {
                removed = this.children.splice(idx, 1);
                removed[0].destroy();
                this.refreshTitle(this.chapterNo);
                this.root.refreshSummary();
                this.entity.modal.option.layouts.splice(idx, 1);
            }

        };

        this.initLayout = function (layouts) {
            layouts = layouts || this.entity.modal.option.layouts;

            if (!layouts || !layouts.length) return;

            layouts.forEach(function (layout) {
                var modelClass, ins;
                var chapterDisplay;
                var _api;

                if (!layout.modal.type) { return; }

                modelClass = this.factoryIoC.getModel(layout.modal.type);
                if(!modelClass) return;
                ins = new modelClass(this, layout, this.root);
                this.children.push(ins);
                ins.render();

            }.bind(this));
        };

        /** @override */
        this.resize = function () {
            var ele = this.container.parentNode;

            ele.style.minHeight = this.entity.spanR * this.UNIT_HEIGHT + 'px';
            this.children.forEach(function (row) {
                row.resize();
            });
        };

        this.refreshTitle = function (chapterNo) {
            // 更新 title
            var containerChildren = [], i = 0;

            this.chapterNo = chapterNo = chapterNo || '';

            containerChildren = this.children.filter(function (row) {
                return row instanceof exports.Container;
            });

            chapterNo = chapterNo ? (chapterNo + '.') : chapterNo;
            containerChildren.forEach(function (row) {
                var num;
                if (row.hasChapterNo()) {
                    num = row.refreshTitle( chapterNo + (i+1) );
                } else {
                    num = row.refreshTitle( chapterNo );
                }
                if (num) {
                    i = i+num;
                } else {
                    i = i+1;
                }
            });
        };

        this.refreshSummary = function () {
            var summary = this.getSummary();
            // 复制一遍数组，不对原数据进行操作
            var list = this.children.concat();
            var row;

            while( row = list.shift() ) {
                list = list.concat(row.children || []);
                if (row instanceof exports.Summary) {
                    row.refreshSummary(summary);
                }
            }
        };

        this.getSummary = function () {
            var summary = [];

            this.children.forEach(function (row) {
                if (row instanceof exports.ChapterContainer || 
                    row instanceof exports.Block) {
                    summary = summary.concat( row.getSummary() );
                }
            });
            return summary;
        };
        
        /** @override */
        // 返回值格式： [param1, param2, param3, ...]
        this.getTplParams = function () {
            var params = SuperClass.prototype.getTplParams.call(this);
            var tplParams = this.entity.modal.option.tplParams || {};

            this.children.forEach(function (row) {
                params = params.concat( row.getTplParams() );
            });

            // 参数去重
            params = params.sort().filter(function (row, pos, arr) {
                return !pos || row != arr[pos - 1];
            });

            // 参数值的还原
            // 目前只有容器类控件可以进行参数设置，接口的调用最终都会在这里汇合
            // 所以在这里进行一次参数值还原即可
            params = params.map(function (row) {
                return {
                    name: row,
                    value: tplParams[row] || undefined
                };
            });
            return params;
        };

        this.destroy = function () {
            this.children.forEach(function (row) {
                row.destroy();
            });
            this.wrap.parentNode.removeChild(this.wrap);
        };

    }.call(Container.prototype);

    // 附加特性
    // 给容器类型的控件附加上 “变量处理” 的功能特性
    Container.prototype = Mixin( Container.prototype, new VariableProcessMixin() );

    exports.Container = Container;

} ( namespace('factory.report.components'), 
    namespace('factory.report.components.Base'),
    namespace('factory.report.mixins.VariableProcessMixin') ));

;(function (exports, SuperClass) {
    // 单独使用一个 spinner，用于数据加载时的 laoding
    var Spinner = new LoadingSpinner({ color: '#00FFFF' });

    function ReportContainer() {
        SuperClass.apply(this, arguments);
    }

    ReportContainer.prototype = Object.create(SuperClass.prototype);
    ReportContainer.prototype.constructor = ReportContainer;

    +function () {
        /** @override */
        this.optionTemplate = Mixin(this.optionTemplate, {
            group: '基本',
            name: 'I18n.resource.report.REPORT_RIGHT_NAME',
            minWidth: 12,
            minHeight: 6,
            maxWidth: 12,
            maxHeight: 6,
            spanC: 12,
            spanR: 12,
            type: 'ReportContainer',
            className: 'chapter-container'
        });

        /** @override */
        this.render = function (isProcessTask) {
            this.registVariableProcessTask(this.entity.modal.variables).done(function (variables) {
                // 保存 variables
                this.variables = variables;
            }.bind(this));

            if (!this.children.length) {
                this.initLayout();
            } else {
                this.children.forEach(function (row) {
                    row.render();
                });
            }

            if (isProcessTask === true) {
                Spinner.spin(document.body);
                this.processTask().always(function () {
                    // 汇总信息需要等到页面数据加载完毕才进行渲染
                    this.refreshSummary();

                    Spinner.stop();
                    // phantom
                    console.info('phantom - render summary complete');
                }.bind(this));
            }

            // 刷新标题
            this.refreshTitle();
        };

    }.call(ReportContainer.prototype);

    exports.ReportContainer = ReportContainer;

} ( namespace('factory.report.components'), 
    namespace('factory.report.components.Container') ));
;(function (exports, SuperClass) {

    var Spinner = new LoadingSpinner({ color: '#00FFFF' });
    function ChapterContainer() {
        SuperClass.apply(this, arguments);

        this.chapterNo = null;
        this.taskPromise = null;
    }

    ChapterContainer.prototype = Object.create(SuperClass.prototype);
    ChapterContainer.prototype.constructor = ChapterContainer;

    +function () {

        var HtmlAPI = (function () {
            function HtmlAPI() {
                this.promise = $.Deferred();
            }

            HtmlAPI.prototype.show = function () {
                this.promise.resolve();
            };

            HtmlAPI.prototype.hide = function () {
                this.promise.reject();
            };

            return HtmlAPI;
        } ());

        /** @override */
        this.optionTemplate = Mixin(this.optionTemplate, {
            name: 'I18n.resource.report.optionModal.CHAPTER',
            type: 'ChapterContainer',
            spanC: 12,
            spanR: 4,
            className: 'chapter-container'
        });

        /** @override */
        this.render = function (isProcessTask) {
            this.taskPromise = this.registVariableProcessTask(this.entity.modal.variables).fail(function () {
                this.destroy();
            }.bind(this));

            if (!this.children.length) {
                this.initLayout();
            } else {
                this.children.forEach(function (row) {
                    row.render();
                });
            }

            if (isProcessTask === true) {
                Spinner.spin(document.body);
                this.root.processTask().always(function(){
                    Spinner.stop();
                });
            }
        };

        /** @override */
        this.initEntity = function () {
            // 兼容老数据
            var options = this.entity.modal.option;
            if ( typeof options.chapterSummary === 'undefined' ||
                 typeof options.chapterSummary === 'string') {
                options.chapterSummary = {
                    html: options.chapterSummary || '',
                    css: '',
                    js: ''
                };
            }

            if ( typeof options.chapterDisplay === 'undefined' ) {
                options.chapterDisplay = '';
            }
        };

        /** @override */
        this.initTools = function (tools) {
            tools = tools || ['variable', 'tplParamsConfigure', 'configure', 'remove'];
            SuperClass.prototype.initTools.call(this, tools);
        };

        /** @override */
        this.refreshTitle = (function () {

            if (AppConfig.isReportConifgMode) {
                return function (chapterNo) {
                    // 更新 title
                    var divWrap = this.wrap;
                    var divTitle = divWrap.querySelector('.report-title');
                    var chapterChildren = [];

                    // 如果没有提供章节编号，则不进行任何处理
                    if (!chapterNo) {
                        divTitle.innerHTML =  (this.chapterNo ? (this._formatChapterNo(this.chapterNo) + ' ') : '') + (this.entity.modal.option.chapterTitle || '');
                        return;
                    }
                    divTitle.innerHTML =  (chapterNo ? (this._formatChapterNo(chapterNo) + ' ') : '') + (this.entity.modal.option.chapterTitle || '');
                    
                    SuperClass.prototype.refreshTitle.apply(this, arguments);
                };
            } else {
                return function (chapterNo) {
                    var num = chapterNo.split('.').length;
                    var domTitle = document.createElement('h'+num);
                    var $container = $(this.container);

                    // 添加锚点
                    domTitle.classList.add('headline');
                    domTitle.id = 'headline_' + chapterNo.replace(/\./g, '-');
                    
                    domTitle.innerHTML = (chapterNo ? (this._formatChapterNo(chapterNo) + ' ') : '') + (this.entity.modal.option.chapterTitle || '');
                    $container.children('.headline').remove();
                    $container.prepend(domTitle);
                    $container.addClass( 'chapter-' + chapterNo.split('.').length );

                    SuperClass.prototype.refreshTitle.apply(this, arguments);
                };
            }

        } ());

        this._formatChapterNo = function (chapterNo) {
            // 只对一级章节做处理
            if (chapterNo.indexOf('.') === -1) {
                return I18n.resource.report.chapterConfig.NUMBER + chapterNo + I18n.resource.report.chapterConfig.CHAPTER;
            }
            return chapterNo;
        };

        /** @override */
        this.initTitle = function () {
            var divWrap = this.wrap;
            //var divParent = divWrap.querySelector('.report-container
            var divTOP = divWrap.querySelector('.report-top-box');
            // 添加标题
            var divTitle = document.createElement('div');
            divTitle.className = 'report-title';
            //divParent.appendChild(divTitle);
            divTOP.appendChild(divTitle);
        };

        /** @override */
        this.getSummary = function () {
            var summary = [];

            summary.push({
                variables: this.variables,
                chapterNo: this.chapterNo,
                chapterSummary: this.entity.modal.option.chapterSummary || ''
            });

            summary.push(SuperClass.prototype.getSummary.apply(this, arguments));

            return [summary];
        };
        // 注册一个处理变量的任务
        this.registVariableProcessTask = function (variables) {
            var promise = this.root.registTask(variables, this);
            return promise.then(function (rs) {
                this.variables = this.createObjectWithChain(rs);
                return this.isShow();
            }.bind(this));
        };

        // 判断当前控件是否需要显示
        this.isShow = function () {
            var layout = this.entity;
            var options = layout.modal.option;
            var _api;

            if(options){
                chapterDisplay = layout.modal.option.chapterDisplay;
            }

            if ( !AppConfig.isReportConifgMode && chapterDisplay ) {
                // 进行显示/隐藏的判断
                _api = new HtmlAPI();
                // 执行用户的判断逻辑
                new Function('_api', '_reportOptions', '_variables', chapterDisplay)(_api, this.getReportOptions(), this.variables);
                // 返回一个 promise 对象
                return _api.promise;
            }
        };

    }.call(ChapterContainer.prototype);

    exports.ChapterContainer = ChapterContainer;

} ( namespace('factory.report.components'), 
    namespace('factory.report.components.Container') ));
;(function (exports, SuperClass, ChartThemeConfig) {

    function Chart() {
        SuperClass.apply(this, arguments);

        this.store = null;
        this.chart = null;
    }

    Chart.prototype = Object.create(SuperClass.prototype);

    +function () {
        /** @override */
        this.optionTemplate = Mixin(this.optionTemplate, {
            group: '基本',
            name: 'I18n.resource.report.optionModal.ECHARTS',
            minWidth: 3,
            minHeight: 2,
            maxWidth: 12,
            maxHeight: 15,
            type: 'Chart'
        });

        /** @override */
        this.resize = function () {
            SuperClass.prototype.resize.call(this);
            if (this.chart) {
                this.__renderChart({
                    animation: false
                });
            }
        };

        this.__renderChart = function (extendOptions) {
            var rs = this.store;
            var chartOptions = $.extend(false, this.__getChartOptions(), extendOptions);

            if (this.chart) {
                this.chart.dispose();
            }

            if (chartOptions.series.length === 0) {
                return;
            }

            this.chart = echarts.init(this.container);
            this.chart.setOption( chartOptions );
        };

        this.__getChartOptions = function () {
            var _this = this;
            var options;
            var moduleOptions = this.entity.modal.option;
            var data = this.store;
            var legend, series;

            if (moduleOptions.chartType === 'pie') {
                options = $.extend(true, {}, ChartThemeConfig.PIE_CHART_OPTIONS, new Function('return ' + this.entity.modal.option.chartOptions)());
            } else {
                options = $.extend(true, {}, ChartThemeConfig.AXIS_CHART_OPTIONS, new Function('return ' + this.entity.modal.option.chartOptions)());
                
                options.xAxis.forEach(function (row) {
                    if (typeof row.data === 'function') {
                        try {
                            row.data = row.data.call(null, data, _this.variables);
                        } catch(e) {
                            row.data = [];
                        }
                    }
                });
                // 处理纵坐标
                options.yAxis.forEach(function (row) {
                    if (typeof row.data === 'function') {
                        try {
                            row.data = row.data.call(null, data, _this.variables);
                        } catch(e) {
                            row.data = [];
                        }
                    }
                });  
            }

            // 处理图例
            if (typeof options.legend.data === 'function') {
                try {
                    options.legend.data = options.legend.data.call(null, data, _this.variables);
                } catch(e) {
                    options.legend.data = [];
                }
            }
            // 处理 series
            options.series.forEach(function (row) {
                if (typeof row.data === 'function') {
                    try {
                        row.data = row.data.call(null, data, _this.variables);
                    } catch(e) {
                        row.data = [];                        
                    }
                }
            });

            // 直角系的数据填充
            if (moduleOptions.chartType !== 'pie') {
                // 部分重要配置没有时，进行默认的数据填充
                if (options.series.length === 0) {
                    series = [];
                    Object.keys(data.list).forEach(function (id) {
                        var row = data.list[id];
                        series.push({
                            type: moduleOptions.chartType,
                            data: row.data
                        });
                    });
                    // 数据填充
                    options['xAxis'][0].data = data.timeShaft;
                    options['series'] = series;
                }
                if (options.legend.data.length === 0) {
                    var dsInfo, legend = [];
                    if (moduleOptions.legend && moduleOptions.legend.length) {
                        legend = moduleOptions.legend;
                        // 处理 series 中的 name
                        moduleOptions.legend.forEach(function (row, i) {
                            options['series'][i].name = row;
                        });
                    } else {
                        dsInfo = AppConfig.datasource.getDSItemById( Object.keys(data.list) );
                        // 为防止返回数组 dsInfoArr 的顺序和请求时发送的数据源 id 数组不一致，做以下处理
                        dsInfo = Array.toMap(dsInfo, 'id');
                        Object.keys(data.list).forEach(function (dsId, i) {
                            var alias = dsInfo[dsId] ? (dsInfo[dsId].alias || dsId) : dsId;
                            options['series'][i].name = alias;
                            legend.push(alias);
                        });
                    }
                    options['legend'].data = legend;
                }
            }

            return options;
        };

        /** @override */
        this.getTplParams = function () {
            var str = (this.entity.modal.points || []).join(',');
            var pattern = this.TPL_PARAMS_PATTERN;
            var match = null;
            var params = SuperClass.prototype.getTplParams.call(this);

            while( match = pattern.exec(str) ) {
                params.push(match[1]);
            }
            return params;
        };

        /** @override */
        this.render = function (isProcessTask) {
            var promise = $.Deferred();

            this.registVariableProcessTask(this.entity.modal.variables).done(function () {
                promise.resolve();
            }.bind(this));

            promise.done(function () {
                var options = this.entity.modal.option;
                var reportOptions = this.getReportOptions();

                if (!this.entity.modal.points || !this.entity.modal.points.length) {
                    this.store = {
                        list: {},
                        timeStart: []
                    };
                    this.__renderChart();
                    return;
                }

                WebAPI.post('/analysis/startWorkspaceDataGenHistogram', {
                    dsItemIds: this.__getTplParamsAttachedPoints(),
                    timeStart: reportOptions.startTime,
                    timeEnd: reportOptions.endTime,
                    timeFormat: options.timeFormat || reportOptions.timeFormat
                }).done(function (rs) {
                    if (!rs.list) {
                        Log.warn('chart has no data.');
                        return;
                    }
                    rs.list = Array.toMap(rs.list, 'dsItemId');
                    this.store = rs;
                    this.__renderChart();
                }.bind(this)); 
            }.bind(this));

            if (isProcessTask === true) {
                this.root.processTask();
            }
        };

        // 获取替换模板参数后的 points
        this.__getTplParamsAttachedPoints = function () {
            var _this = this;
            var points = this.entity.modal.points;
            var pattern = this.TPL_PARAMS_PATTERN;
            var params = this.getTplParamsValue();

            if (!params || points.length <= 0) {
                return points;
            } else {
                return points.join(',').replace(pattern, function ($0, $1) {
                    // 如果不是云点
                    // if (params[0] !== '@')
                    return params[$1] || '';
                }).split(',');
            }
        };

        /** @override */
        this.destroy = function () {
            SuperClass.prototype.destroy.apply(this, arguments);

            if (this.chart) {
                this.chart.dispose();
            }
            this.wrap.parentNode.removeChild(this.wrap);
        };

    }.call(Chart.prototype);

    exports.Chart = Chart;

} ( namespace('factory.report.components'), 
    namespace('factory.report.components.Base'),
    namespace('factory.report.config.ChartThemeConfig') ));
;(function (exports, SuperClass) {

    function Text() {
        SuperClass.apply(this, arguments);
    }

    Text.prototype = Object.create(SuperClass.prototype);

    +function () {

        this.optionTemplate =  {
            group: '基本',
            name: 'I18n.resource.report.optionModal.TEXT',
            minWidth: 3,
            minHeight: 1,
            maxWidth: 12,
            maxHeight: 100,
            type:'Text',
            className: 'report-module-text'
        };

        /** @override */
        this.initEntity = function () {
            var options = this.entity.modal.option;

            options.text = options.text || '';
        };

        /** @override */
        this.render = function (isProcessTask) {
            this.registVariableProcessTask(this.entity.modal.variables).done(function () {
                var options = this.entity.modal.option;
                if(!options || !options.text) {
                    $(this.container).html('');
                    return;
                }
                this.__renderText();
            }.bind(this));

            if (isProcessTask === true) {
                this.root.processTask();
            }
        };

        this.__renderText = function () {
            var options = this.entity.modal.option;

            this.container.innerHTML = this.__getTplParamsAttachedHtml(options.text);
        };

        // 获取替换模板参数后的 code
        this.__getTplParamsAttachedHtml = function (code) {
            var pattern = this.TPL_PARAMS_PATTERN;
            var params = this.getTplParamsValue();
            var match;
            
            params = $.extend(false, {}, params, this.variables);
            code = code.replace(pattern, function ($0, $1) {
                if (!params[$1]) {
                    return $0;
                }
                return params[$1];
            });

            return code;
        };

        /** @override */
        this.getTplParams = function () {
            var str = this.entity.modal.option.text;
            var pattern = this.TPL_PARAMS_PATTERN;
            var match = null;
            var params = [];

            while( match = pattern.exec(str) ) {
                params.push(match[1]);
            }

            return params;
        };

        /** @override */
        this.showConfigModal = function () {
            var _this = this;
            var option = this.entity.modal.option;

            EditorModal.show(option.text, true, function (content) {
                option.text = content;
                _this.__renderText();
            });
        };

        /** @override */
        this.destroy = function () {
            SuperClass.prototype.destroy.apply(this, arguments);

            this.wrap.parentNode.removeChild(this.wrap);
        };

    }.call(Text.prototype);

    exports.Text = Text;

} ( namespace('factory.report.components'), namespace('factory.report.components.Base') ));
;(function (exports, SuperClass, ChartThemeConfig) {

    function Html() {
        SuperClass.apply(this, arguments);

        this.guids = [];
    }

    Html.prototype = Object.create(SuperClass.prototype);

    // html container api
    function HCAPI() {}

    +function () {

        this.getHistoryData = function (params) {
            return WebAPI.post('/analysis/startWorkspaceDataGenHistogram', params);
        };

        this.getChartThemes = function () {
            // 复制一份，防止用户覆盖
            return $.extend(true, {}, ChartThemeConfig);
        };

    }.call(HCAPI.prototype);

    +function () {

        this.optionTemplate =  {
            group: '基本',
            name: 'I18n.resource.report.optionModal.HTML',
            minWidth: 3,
            minHeight: 1,
            maxWidth: 12,
            maxHeight: 100,
            type:'Html',
            className: 'report-module-text'
        };

        /** @override */
        this.initEntity = function () {
            var options = this.entity.modal.option;

            options.html = options.html || '';
            options.css = options.css || '';
            options.js = options.js || '';
        };

        this.getTemplateAPI = function () {
            return new HCAPI();
        };

        /* override */
        this.initResizer = function () {};

        /** @override */
        this.render = function (isProcessTask) {
            this.registVariableProcessTask(this.entity.modal.variables).done(function () {
                var options = this.entity.modal.option;
                var formattedCode, html, guid;
                
                if(!options) {
                    $(this.container).html('');
                    return;
                }
                guid = ObjectId();
                this.guids.push( guid );
                code = this.__getTplParamsAttachedHtml(options);
                formattedCode = this._getFormattedHtml(code, guid);
                namespace('__f_hc')[guid] = {
                    api: this.getTemplateAPI(),
                    reportOptions: this.getReportOptions(),
                    variables: this.variables
                };

                this._runCode(formattedCode);
            }.bind(this));

            if (isProcessTask === true) {
                this.root.processTask();
            }
        };

        this._runCode = function (code) {
            // 渲染 html
            this.container.innerHTML = [code.html, code.css].join('\n');
            // 执行 js
            (function (code) {
                var done = false;
                var script = document.createElement("script");
                var head = document.getElementsByTagName("head")[0];
                script.type = "text\/javascript";
                script.text = code;
                head.appendChild(script);
                head.removeChild(script);
            } (code.js));
        };

        this._getFormattedHtml = function (code, guid) {
            var _this = this;
            var patternScript = /(<script\b[^>]*>)([\s\S]*?)(<\/script>)/img;

            var htmlWrapTpl = '<div id="hc_'+guid+'">|code|</div>';

            var jsWrapTpl = (function () {
                return '(function(_data) {'+
                'var _api = _data.api, _reportOptions = _data.reportOptions, _variables = _data.variables, _container = document.querySelector("#hc_'+guid+'"); if(!_container) {return;}' +
                '|code|}).call(null, window.__f_hc["'+guid+'"]);';
            } ());

            var cssWrapTpl = '<style>|code|</style>';
            // script 标签处理
            var formatHtml = code.html.replace(patternScript, function($0, $1, $2, $3) {
                return '';
            });
            // 给 css selector 加上 id 的前缀
            // /([,|\}|\r\n][\s]*)([\.#]?-?[_a-zA-Z]+[_a-zA-Z0-9-]*)/mg
            // /([^\r\n,{}]+)(,(?=[^}]*{)|\s*(?={))/mg
            var formatCss = code.css.replace(/([^\r\n,{}]+)(,(?=[^}]*{)|\s*(?={))/mg, function ($0, $1, $2) {
                return '#hc_' + guid + ' ' + $1;
            });
            var formatJs = jsWrapTpl.replace('|code|', code.js);
            formatCss = cssWrapTpl.replace('|code|', formatCss);
            formatHtml = htmlWrapTpl.replace('|code|', formatHtml);

            return {
                html: formatHtml,
                css: formatCss,
                js: formatJs
            };
        };

        // 获取替换模板参数后的 code
        this.__getTplParamsAttachedHtml = function (code) {
            var _this = this;
            var pattern = this.TPL_PARAMS_PATTERN;
            var params = this.getTplParamsValue();

            if (!params || Object.keys(params).length === 0) {
                return code;
            } else {
                return {
                    html: (code.html || '').replace(pattern, function ($0, $1) {
                        return params[$1];
                    }),
                    js: (code.js || '').replace(pattern, function ($0, $1) {
                        return params[$1];
                    }),
                    css: (code.css || '').replace(pattern, function ($0, $1) {
                        return params[$1];
                    })
                };
            }
        };

        /** @override */
        this.getTplParams = function () {
            var options = this.entity.modal.option;
            var str = options.html +  options.css + options.js;
            var pattern = this.TPL_PARAMS_PATTERN;
            var match = null;
            var params = [];

            while( match = pattern.exec(str) ) {
                params.push(match[1]);
            }

            return params;
        };

        /** @override */
        this.resize = function () {
            var ele = this.container.parentNode;
            ele.style.height = 'auto';
        };

        /** @override */
        this.showConfigModal = function () {
            var _this = this;
            var option = this.entity.modal.option;

            CodeEditorModal.show(option, function (code) {
                _this.entity.modal.option.html = code.html;
                _this.entity.modal.option.js = code.js;
                _this.entity.modal.option.css = code.css;
                _this.render(true);
            });
        };

        /** @override */
        this.destroy = function () {
            SuperClass.prototype.destroy.apply(this, arguments);

            this.guids.forEach(function (guid) {
                namespace('__f_hc')[guid] = null;
            });

            this.wrap.parentNode.removeChild(this.wrap);
        };

    }.call(Html.prototype);

    exports.Html = Html;

} ( namespace('factory.report.components'), 
    namespace('factory.report.components.Base'),
    namespace('factory.report.config.ChartThemeConfig') ));

;(function (exports, SuperClass) {

    function Summary() {
        SuperClass.apply(this, arguments);

        this.chapterNo = null;
        options = null;
    }

    Summary.prototype = Object.create(SuperClass.prototype);

    +function () {
        var DEFAULTS = {
            showTitle: true
        };

        this.optionTemplate = Mixin(this.optionTemplate, {
            name: 'I18n.resource.report.optionModal.SUMMARY',
            type: 'Summary',
            spanC: 12,
            spanR: 4,
            className: 'report-summary-container'
        });

        this.initTools = function (tools) {
            tools = tools ||  ['remove'];
            SuperClass.prototype.initTools.call(this, tools);
        };

        this.refreshSummary = (function () {
            var options, _this;

            function recursion(data, deep) {
                if (!data) return;
                data.forEach(function (row) {
                    var chapterNo = row[0].chapterNo;
                    var chapterSummary = row[0].chapterSummary;
                    var guid = ObjectId();
                    var formattedCode;

                    if (!chapterSummary || 
                        (!chapterSummary.html && !chapterSummary.js && !chapterSummary.css)) {
                        recursion(row[1], deep);
                        return;
                    }

                    formattedCode = _this._getFormattedHtml(chapterSummary, guid);

                    if (formattedCode.html !== '' || formattedCode.css !== '' || formattedCode.js !== '') {
                        options.html += '<div data-deep="' + deep + '" data-chapter-no="' + chapterNo + '" class="chapter-summary-wrap" style="margin-top:5px; margin-left:'+(30 + 20*deep)+'px;">' + formattedCode.html + '</div>';
                        options.css += formattedCode.css;
                        options.js += formattedCode.js;

                        _this.guids.push(guid);
                        namespace('__f_hc')[guid] = {
                            variables: row[0].variables,
                            api: _this.getTemplateAPI(),
                            reportOptions: _this.getReportOptions()
                        };
                    }
                    recursion(row[1], deep+1);
                });
            }

            return function (summary, opt) {
                _this = this;
                arrHtml = [];

                opt = $.extend(false, {}, DEFAULTS, opt);

                options = {
                    html: opt.showTitle ? ('<h1>'+I18n.resource.report.optionModal.SUMMARY+'</h1>') : '',
                    css: '',
                    js: ''
                };

                if (summary) {
                    recursion(summary, 0);
                    this._runCode(options);
                }
            };

        } ());

        /** @override */
        this.render = function () {};

    }.call(Summary.prototype);

    exports.Summary = Summary;

} ( namespace('factory.report.components'),
    namespace('factory.report.components.Html') ));

;(function (exports, SuperClass) {

    function Block() {
        SuperClass.apply(this, arguments);

        this.store = null;
    }

    Block.prototype = Object.create(SuperClass.prototype);
    Block.prototype.constructor = Block;

    +function () {

        /** @override */
        this.optionTemplate = Mixin(this.optionTemplate, {
            name: 'I18n.resource.report.optionModal.BLOCK',
            type: 'Block',
            spanC: 12,
            spanR: 4,
            className: 'block-container'
        });

        /** @override */
        this.initEntity = function () {
            var options = this.entity.modal.option;
            if ( typeof options.dataId === 'undefined') {
                options.dataId = '';
            }
        };

        /** @override */
        this.initTools = function (tools) {
            tools = tools || ['tplParamsConfigure', 'configure', 'remove'];
            SuperClass.prototype.initTools.call(this, tools);
        };

        /** @override */
        this.initDropEvents = function () { /** 不需要 drop */ };

        /** @override */
        this.render = function (isProcessTask) {
            var _this = this;
            var promise = $.Deferred();
            var dataId = this.entity.modal.option.dataId;
            var date;

            while (row = _this.children.pop()) {
                row.destroy();
            }

            if (!dataId || dataId === '-1') {
                return;
            }

            date = (function () {
                var now = new Date();
                var reportDate = _this.getReportDate();
                var formatStr;

                switch(reportDate) {
                    case 'month':
                        formatStr = 'yyyy-MM';
                        break;
                    case 'year':
                        formatStr = 'yyyy';
                        break;
                    case 'day':
                    default:
                        formatStr = 'yyyy-MM-dd';
                        break;
                }
                return new Date().format(formatStr);
            } ());

            // 同步拉数据
            $.ajax({
                type:'get',
                url: '/factory/reportData/' + dataId + '/' + date,
                contentType: 'application/json',
                async: false
            }).done(function (rs) {
                var row;
                if (rs.status !== 'OK') {
                    alert(rs.msg);
                    return;
                }
                _this.store = JSON.parse(rs.data.content);

                _this.initLayout(_this.store || []);

                if (isProcessTask === true) {
                    _this.root.processTask();
                }

                _this.root.refreshTitle();
                _this.root.refreshSummary();
            });
        };

        /** @override */
        this.refreshTitle = function (chapterNo) {
            // 更新 title
            var containerChildren = [], i = 0;

            containerChildren = this.children.filter(function (row) {
                return row instanceof exports.Container;
            });

            // 将章节号后退一级（忽视掉 Block 本身）
            // chapterNo = chapterNo ? chapterNo.substring(0, chapterNo.length-2) : '';
            chapterNo = chapterNo ? (chapterNo + '.') : chapterNo;
            containerChildren.forEach(function (row) {
                var num = row.refreshTitle( chapterNo + (i+1) );
                if (num) {
                    i = i+num;
                } else {
                    i = i+1;
                }
            });

            return i;
        };

        /**
         * @override
         */
        this.hasChapterNo = function () {
            return false;
        };

    }.call(Block.prototype);

    exports.Block = Block;

} ( namespace('factory.report.components'),
    namespace('factory.report.components.Container') ));
;(function (exports, SuperClass) {

    function Table() {
        SuperClass.apply(this, arguments);

        this.store = null;
    }

    Table.prototype = Object.create(SuperClass.prototype);

    +function () {
        this.constructor = Table;

        this.optionTemplate =  Mixin(this.optionTemplate, {
            group: '基本',
            name: 'I18n.resource.report.optionModal.TABLE',
            minWidth: 6,
            minHeight: 5,
            maxWidth: 12,
            maxHeight: 15,
            type: 'Table'
        });

        /** @override */
        this.render = function () {
            var $table = $('<table></table>');
            var $thead = $('<thead></thead>');
            var $tbody = $('<tbody></tbody>');
            //var $header = $('<h3 style="width: 80%;margin-left: auto;margin-right: auto;"></h3>');
            var option = this.entity.modal.option;
            var strTbody = '', strThead = '';
            $(this.container).empty();
            if($.isEmptyObject(option)) return;

            //$header.append('<div><span style="font-size: 14px;color: #888;">Start time :  </span>' + option.start + '</div><div><span style="font-size: 14px;color: #888;">End &nbsp;time :  </span>' + option.end + '</div>');
            //如果行:数据源 列:日期
            if(option.isSwap){
                //thead
                strThead = '<th>Time</th>';
                for(var i = 0; i < option.dataSrc.length; i++){
                    strThead += ('<th>'+ option.dataSrc[i].title +'</th>');
                }
                $thead.append('<tr>'+ strThead +'</tr>');
                //tbody, 需要根据返回的数据绘制
                this.getData(option, function (result) {
                    if(result.timeShaft && result.timeShaft.length > 0){
                        var listLen = result.list.length;
                        var list = result.list;
                        result.timeShaft.forEach(function(time, index){
                            var strTd = '';
                            for(var m = 0; m < listLen; m++){
                                strTd += ('<td>'+ list[m].data[index] +'</td>');
                            }
                            strTbody += ('<tr><td>'+ getFormatTime(time, option.interval) +'</td>'+ strTd +'</tr>');
                        });
                    }
                    $tbody.append(strTbody);
                });
            }else{
                this.getData(option, function (result) {
                    //thead
                    strThead = '<th>Time</th>';
                    for(var i = 0; i < result.timeShaft.length; i++){
                        strThead += ('<th>'+ getFormatTime(result.timeShaft[i], option.interval) +'</th>');
                    }
                    $thead.append('<tr>'+ strThead +'</tr>');
                    //tbody
                    for(var i = 0, list; i < option.dataSrc.length; i++){
                        var strTd = '';
                        list = (function(list, id){
                            for(var k = 0; k < list.length; k++){
                                if(list[k].dsItemId == id){
                                    return list[k]
                                }
                            }
                        }(result.list, option.dataSrc[i].dsId));

                        for(var j = 0; j < list.data.length; j++){
                            strTd += ('<td>'+ list.data[j] +'</td>');
                        }
                        strTbody += ('<tr><td>'+ option.dataSrc[i].title +'</td>'+ strTd +'</tr>');
                    }
                    $tbody.append(strTbody);
                });
            }

            $table.append($thead).append($tbody);
            $(this.container).css({overflow: 'auto'}).append($table);

            function getFormatTime(time, interval){
                var formatTime = '';
                switch (interval){
                    case 'm5'://时间间隔为5分钟/1小时, 显示月-日 时:分
                    case 'h1':
                        formatTime = time.replace(/^\d{4}-/,'').replace(/:\d{2}$/,'');
                        break;
                    case 'd1'://时间间隔为1天,显示月-日
                    case 'd7':
                        formatTime = time.replace(/^\d{4}-/,'').replace(/\d{2}:\d{2}:\d{2}/,'');
                        break;
                }
                return formatTime;
            }
        };

        /** @override */
        this.initTools = function (tools) {
            tools = tools || ['configure', 'remove'];
            SuperClass.prototype.initTools.call(this, tools);
        };

        /** @override */
        this.destroy = function () {
            
        };

        this.getData = function(params, callback){
            Spinner.spin(this.container);
            var postData = {dsItemIds: (function(arrdataSrc){
                    var arr = [];
                    arrdataSrc.forEach(function(i){
                        i.dsId && arr.push(i.dsId);
                    });
                    return arr;
                }(params.dataSrc)) };
            if(params.y == 'default'){//时间随日历变化
                var options = this.getReportOptions();
                postData.timeStart = options.startTime;//params.startTime,
                postData.timeEnd = options.endTime;//params.endTime,
                postData.timeFormat = params.interval ? params.interval : options.timeFormat;//以选择的时间间隔为主
            }else{//时间由配置页面配置
                postData.timeStart = new Date(params.start).format('yyyy-MM-dd HH:mm:ss');//params.startTime,
                postData.timeEnd = new Date(params.end).format('yyyy-MM-dd HH:mm:ss');//params.endTime,
                postData.timeFormat = params.interval;
            }

            WebAPI.post('/analysis/startWorkspaceDataGenHistogram', postData).done(function(result){
                if(result && result.timeShaft){
                    callback(result);
                }
            }).always(function(){
                Spinner.stop();
            });
        }

    }.call(Table.prototype);

    exports.Table = Table;

} ( namespace('factory.report.components'),
    namespace('factory.report.components.Base') ));
;(function (exports, SuperClass) {

    function FacReportScreen(options, container) {
        SuperClass.apply(this, arguments);

        this.reportDate = options.date;
    }

    FacReportScreen.prototype = Object.create(SuperClass.prototype);

    +function () {

        this.htmlUrl = '/static/app/WebFactory/views/reportScreen.html';

        this.initIoc = function() {
            this.factoryIoC = new FactoryIoC('report');
        };

        this.initLayoutDOM = function (html) {
            var domCtn;
            var divMain, stCt;

            this.windowCtn.innerHTML = html;
            this.windowCtn.classList.add('report-wrap', 'gray-scollbar');

            this.container = this.windowCtn.querySelector('#reportWrap');
            this.$container = $(this.container);
            this.container.classList.remove('report');
            this.container.classList.add('report-ob');
        };

        this.initWorkerForUpdating = function () {};

        this.initModuleLayout = function (type) {
            var layouts = this.store.layout[0] || [];
            var options, Clazz;
            
            if (!type || type === 'Container') {
                type = 'ReportContainer';
            }
            Clazz = namespace('factory.report.components')[type];

            // 对旧数据做个兼容
            if (layouts.length === 1 && ['Container', 'ReportContainer'].indexOf(layouts[0].modal.type) > -1 ) {
                options = layouts[0].modal.option;
            } else {
                options = {
                    layouts: layouts,
                    period: 'day'
                };
            }

            this.reportEntity = new Clazz(this, {
                spanC: 12,
                spanR: 6,
                modal: {
                    option: $.extend(false, options, {
                        period: this.options.period
                    }),
                    type: type
                }
            });

            this.reportEntity.render(true);
        };

        this.setReportDate = function (date) {
            this.reportDate = date;
            this.reportEntity.render(true);
        };

        this.resize = function () {
            this.reportEntity.resize();
        };

        /** @override */
        this.close = function () {
            this.reportEntity.destroy();

            this.windowCtn.classList.remove('report-wrap', 'gray-scollbar');

            SuperClass.prototype.close.apply(this, arguments);
        };

    }.call(FacReportScreen.prototype);

    exports.FacReportScreen = FacReportScreen;
} ( namespace('observer.screens'), namespace('observer.screens.EnergyScreen') ));
;(function (exports, VariableProcessMixin) {

    function ReportAPI() {}

    +function () {
        // 在指定的dom容器中，渲染出指定报表的指定章节或者其汇总信息
        // 参数重载：
        //   reportId[,chapterId][,options]
        this.renderReport = function(container, reportId, chapterId, options) {
            var _this = this;
            // 参数重载处理
            if (arguments.length === 3) {
                if (typeof chapterId === 'object') {
                    options = chapterId;
                    chapterId = null;
                }
            }

            options = options || {};

            return WebAPI.get("/spring/get/" + reportId + '/' + AppConfig.isFactory).then(function (rs) {
                var layouts = rs.layout[0];
                var layout, modal, match;
                var ins;

                // 如果没有 chapterId，则直接显示整张报表
                if (!chapterId) {
                    match = layouts[0];
                } else {
                    // 在报表中查找出指定的章节 id
                    while (layout = layouts.shift()) {
                        modal = layout.modal;

                        // 忽略非容器类控件
                        if (!modal.option.layouts) {
                            continue;
                        }

                        if (layout.id === chapterId) {
                            match = layout;
                            break;
                        }
                        // 将子元素进行追加
                        layouts = layouts.concat(modal.option.layouts);
                    }
                }

                if (!match) {
                    console.error('没有找到指定报表/章节');
                    return;
                }

                // 清空容器
                container.innerHTML = '';

                // 根据找到的数据进行报表显示
                return (function (container, data) {
                    var Clazz;
                    var report;
                    var promise = $.Deferred();
                    var entity;

                    // 判断是否只显示摘要
                    if (options.onlySummary) {
                        Clazz = namespace('factory.report.components')['Summary'];
                        entity = {
                            spanC: 12,
                            spanR: 6,
                            modal: {
                                option: {},
                                type: 'Summary'
                            }
                        };

                        // 渲染摘要
                        promise.resolve();
                    } else {
                        Clazz = namespace('factory.report.components')[data.modal.type];
                        entity = data;
                        promise.reject();
                    }

                    entity.modal.option.period = 'day';
                    report = new Clazz({
                        container: container
                    }, entity);

                    // 如果设置了只显示摘要，则在这里进行渲染摘要的操作
                    return promise.then(function () {
                        var summary = [];
                        var o = null;
                        // 获取摘要
                        if (data.modal.type === 'ChapterContainer') {
                            o = {
                                variables: {},
                                chapterNo: '',
                                chapterSummary: data.modal.option.chapterSummary,
                                screen: {}
                            };
                            summary = [[o,[]]];

                            // 添加变量处理
                            _this.registTask(data.modal.variables, o).done(function (rs) {
                                o.variables = _this._createObjectWithChain(rs, o.screen.variables);
                            });
                        }
                        // 获取所有的摘要信息
                        else {
                            summary = (function (data) {
                                var summary = [];

                                var getSummaryList = function (data, parent) {
                                    var layouts = data.modal.option.layouts || [];
                                    var summary = [];

                                    parent = parent || {};

                                    layouts.forEach(function (row) {
                                        summary = summary.concat(getSummary(row, parent));
                                    });
                                    return summary;
                                };

                                var getSummary = function (data, parent) {
                                    var summary = [];
                                    var o = {
                                        variables: {},
                                        chapterNo: '',
                                        chapterSummary: data.modal.option.chapterSummary || '',
                                        screen: parent
                                    };

                                    _this.registTask(data.modal.variables, o).done(function (rs) {
                                        o.variables = _this._createObjectWithChain(rs, o.screen.variables);
                                    });

                                    summary.push(o);
                                    summary.push(getSummaryList(data, o));
                                    return [summary];
                                };

                                return getSummaryList(data);
                            } (data));
                        }
                        // 处理参数
                        return _this.processTask({
                            reportOptions: _this._getReportOptionsByType(options.cycleTime)
                        }).then(function () {
                            // 显示摘要
                            report.refreshSummary(summary, {
                                showTitle: false
                            });

                            return report;
                        });
                    }, function () {
                        // 显示报表
                        report.render(true);

                        return report;
                    });
                } (container, match));
            });
        };

        this._getReportOptionsByType = function (type) {
            var now = new Date();
            var params = {};
            var d, year, month, day;

            switch(type || 'type') {
                case 'month':
                    d = new Date( now.valueOf() - now.getDate()*86400000 );

                    year = d.getFullYear();
                    month = d.getMonth() + 1;
                    day = DateUtil.daysInMonth( d );

                    month = month < 10 ? ('0' + month)  : ('' + month);
                    day = day < 10 ? ('0' + day)  : ('' + day);
                    params['startTime'] = [year, month, '01'].join('-') + ' 00:00:00';
                    params['endTime'] = [year, month, day].join('-') + ' 23:59:59';
                    params['timeFormat'] = 'd1';
                    break;
                case 'year':
                    d = new Date(new Date( now.getFullYear() + '' ).valueOf() - 86400000);

                    year = d.getFullYear();
                    params['startTime'] = [year, '01', '01'].join('-') + ' 00:00:00';
                    params['endTime'] = [year, '12', '31'].join('-') + ' 23:59:59';
                    params['timeFormat'] = 'd1';
                    break;
                case 'day':
                case 'week':
                default:
                    d = new Date( now.valueOf() - 86400000 );

                    year = d.getFullYear();
                    month = d.getMonth() + 1;
                    day = d.getDate();

                    month = month < 10 ? ('0' + month) : ('' + month);
                    day = day < 10 ? ('0' + day) : ('' + day);
                    params['startTime'] = [year, month, day].join('-') + ' 00:00:00';
                    params['endTime'] = [year, month, day].join('-') + ' 23:59:59';
                    params['timeFormat'] = 'm5';
                    break;
            }
            return params;
        };

        this._createObjectWithChain = (function () {
            function PropFunction(props) {
                var _this = this;
                for (var p in props) {
                    // 这里需要去访问继承链上的属性，所以不用 hasOwnProperty
                     _this[p] = props[p];
                }
            }

            return function (props, parent) {
                PropFunction.prototype = parent || {};
                return new PropFunction(props);
            }
        } ());


    }.call(ReportAPI.prototype);

    // 附加特性
    // 给容器类型的控件附加上 “变量处理” 的功能特性
    ReportAPI.prototype = Mixin( ReportAPI.prototype, new VariableProcessMixin() );

    exports.report = new ReportAPI();
} (
    namespace('api'), 
    namespace('factory.report.mixins.VariableProcessMixin')
));
;(function (exports, FacReportScreen) {
    var Spinner = new LoadingSpinner({color: '#00FFFF'});

    function FacReportWrapScreen(options, container) {
        this.container = (function (container) {
            if (typeof container === 'string') {
                return document.querySelector('#' + container);
            } else if (container instanceof HTMLElement) {
                return container;
            } else {
                return null;
            }
        } (container));
        this.container.innerHTML = '';

        this.options = options;

        this.store = null;
        //类名为row的包裹层
        this.row = null;
        //左边报表名
        this.leftCtn = null;
        //中间部分
        this.centerCtn = null;
        //右边部分
        this.rightCtn = null;

        // 当前显示的报表实例
        this.report = null;
    }

    +function () {

        this.show = function () {
            Spinner.spin(document.body);

            // 给 body 加上滚动样式
            this.container.classList.add('scrollable-y', 'gray-scrollbar');

            // 获取数据
            WebAPI.get( '/factory/reportWrap/' + [AppConfig.isFactory, this.options.id].join('/') ).done(function (rs) {
                this.store = rs;
                // 初始化操作
                this.init();

            }.bind(this)).always(function () {
                Spinner.stop();
            });
        };

        this.init = function () {
            var reportWrap, hash, dataArr, idx = 0, $eles;
            //初始化元素
            this.initLayoutDOM();
            // 事件
            this.attachEvents();
            //中间的容器
            reportWrap = document.querySelector("#centerCtn");

            this.setTreeOptions({
                container:reportWrap
            });

            // 是否有指定默认打开哪张报表
            if (typeof this.options.default !== 'undefined') {
                idx = this.options.default - 0; // 装换成 number
            } else {
                hash = window.location.hash;
                if(hash && hash.indexOf("response=") > -1) {
                    dataArr = hash.split("&");
                    for(var i=0, len = dataArr.length;i < len; i++) {
                        if(dataArr[i].indexOf("response=") !== -1) {
                            idx = dataArr[i].split("=")[1] - 1;
                            break;
                        }
                    } 
                }
            }
            $eles = this.leftCtn.find('.report-item');
            // 做防止越界的处理
            idx = Math.min(Math.max(0, idx), $eles.length - 1);
            
            $eles.eq(idx).trigger('click');
        };

        this.attachEvents = function () {
            var _this = this;

            var leftCtnTopDivs= $('.leftCtnTop').find("div");
            // 划过报表名字
            $('.reportListName').hover(function(){
                $(this).find(".report-item").addClass("in");
                $(this).find("span.copyUrl").show().attr("title",I18n.resource.report.chartConfig.COPY_LINK);
            },function(){
                $(this).find(".report-item").removeClass("in");
                $(this).find("span.copyUrl").hide();
            });
            // 点击报表名字
            this.leftCtn.on('click', '.report-item', function () { 
                var period;
                var $iptDate;
                var options, date, now;

                _this.destroyTree();
                $('.report-item').removeClass("selected");
                //章节名字后面的箭头
                if($(this).siblings("img").attr("src")=="/static/app/WebFactory/themes/default/images/down.svg"){
                    $(this).siblings("img").attr("src","/static/app/WebFactory/themes/default/images/left.svg");
                } else {
                    $(".report-item").siblings("img").attr("src","/static/app/WebFactory/themes/default/images/left.svg");
                    $(this).siblings("img").attr("src","/static/app/WebFactory/themes/default/images/down.svg");
                    $(this).addClass("selected");
                    $("<div>").addClass("navTree").appendTo($(this).parent());
                
                    period = this.dataset.period;
                    $iptDate = $(".form_datetime");
                    now = new Date();

                    switch (period) {
                        // 默认显示昨天的数据
                        case 'day':
                            var formatStr = timeFormatChange('yyyy-mm-dd');
                            date = new Date( now.valueOf() - 86400000 ).format('yyyy-MM-dd');
                            $iptDate.val( timeFormat(date,formatStr) );
                            options = {
                                format: formatStr,
                                minView: 'month',
                                startView: 'month',
                                forceParse: false
                            };
                            break;
                            // 默认显示上一周的数据
                        case 'week':
                            var formatStr = timeFormatChange('yyyy-mm-dd');
                            var weekDay = now.getDay()===0?13:7+(now.getDay()-1);
                            date =  new Date( now.valueOf() - 86400000 * weekDay);
                            date = date.format(timeFormat(date,formatStr));
                            $iptDate.val(date);
                            // var weekNum = DateUtil.getWeekNumber(new Date());
                            // $iptDate.val( weekNum[0]+'-'+ weekNum[1] + '-week');
                            options = {
                                format: formatStr,
                                minView: 'month',
                                startView: 'month',
                                forceParse: false
                            };
                            break;
                        // 默认显示上个月的数据
                        case 'month':
                            var formatStr = timeFormatChange('yyyy-mm');
                            date = new Date( now.valueOf() - now.getDate()*86400000 ).format('yyyy-MM');
                            $iptDate.val( timeFormat(date,formatStr) );
                            options = {
                                format: formatStr,
                                minView: 'year',
                                startView: 'year',
                                forceParse: false
                            };
                            break;
                        // 默认显示去年的数据
                        case 'year':
                            date = new Date( new Date( now.getFullYear() + '' ).valueOf() - 86400000 ).format('yyyy');
                            $iptDate.val( date );
                            options = {
                                format: 'yyyy',
                                minView: 'decade',
                                startView: 'decade'
                            };
                            break;
                    }

                    $iptDate.datetimepicker('remove');
                    window.setTimeout( function () {
                        $iptDate.datetimepicker( $.extend(false, options, {
                            autoclose: true,
                            endDate: function () {
                                var date = new Date().format('yyyy-MM-dd')
                                return date
                            }()
                        }) );
                    }, 0)

                    _this._showReport(this.dataset.id, period, date).always(function () {
                        _this.renderTree();
                    })
                }
            });
            //点击报表名字后面的箭头
            $(".reportListName").off("click.arrow").on("click.arrow",".arrow",function(){
                $(this).siblings(".report-item").trigger("click");
            })
            //单击复制链接按钮
            $(".reportListName").off("click.copyUrl").on("click.copyUrl",".copyUrl",function(){
                var reportChaptId = $(this).siblings(".report-item").attr("data-id");
                var isFactory = window.location.href.indexOf("factory") === -1 ?0:1;
                var input = document.createElement('textarea');
                var successful;

                document.body.appendChild(input);
                input.value = window.location.origin+'/factory/preview/report/'+reportChaptId+'/'+AppConfig.isFactory+'?projectId='+AppConfig.projectId;
                input.focus();
                input.select();
                successful = document.execCommand('Copy');
                
                input.remove();
                if(successful) {
                    alert(I18n.resource.report.chartConfig.COPY_LINK_SUCCESS);
                } else {
                    alert(I18n.resource.report.chartConfig.COPY_LINK_FAILED);
                }
            })
            $('.form_datetime').off('changeDate').on('changeDate', function(ev) {
                if (!_this.report) return;

                Spinner.spin(document.body);
                // 将代码放入到当前 js 线程队列的最后面执行
                // 从而回避卡住 UI 的问题
                window.setTimeout(function () {
                    _this.report.setReportDate(this.value);
                    Spinner.stop();
                }.bind(this), 0);
            });
            $('.pdfDownCtn').off('click').on('click',function(){
                if(!_this.report){return;}
                var checkReportId = _this.report.options.id;
                for(var j = 0;j<_this.store.list.length;j++){
                    if(_this.store.list[j].reportId === checkReportId){
                        var reportTitle = _this.store.list[j].reportName;
                        var period = _this.store.list[j].period;
                        var reportPeriod;
                        switch (period) {
                            case 'week':
                                reportPeriod = "周报";
                                break;
                            case 'day':
                                reportPeriod = "日报";
                                break;
                            case 'month':
                                reportPeriod = "月报";
                                break;
                            case 'year':
                                reportPeriod = "年报";
                                break;
                        }
                        break;
                    }
                }
                var arrHtml = [];
                arrHtml.push($('#centerCtn').html());
                var promise;
                var cover;
                // 显示 loading
                Spinner.spin(document.body);
                WebAPI.get("/project/getinfo/"+AppConfig.projectId).done(function (rs) {
                        //该报表所属项目信息
                        var projectInfo = rs.projectinfo;
                        WebAPI.get('/static/views/share/reportWrap/coverPage.html').done(function (result) {
                            result = result.formatEL({
                                projectImg: BEOPUtil.getProjectImgByType(AppConfig.projectId, BEOPUtil.projectImgType.pdfCover),
                                title: reportTitle,
                                logo: BEOPUtil.getProjectImgByType(AppConfig.projectId, BEOPUtil.projectImgType.logo),
                                date: $('.calendarCtn').children('input').val(),
                                projName: localStorage.getItem("language") === "zh"?projectInfo.name_cn:projectInfo.name_english
                            })
                            
                            //处理echart的数据var pageHeight = 750;
                            var allEchartsArr = Array.prototype.map.call($('[_echarts_instance_]'), function (row) { return echarts.getInstanceByDom(row); });
                            var allEchartsDom = $('[_echarts_instance_]');
                            for(var i = 0,len = allEchartsArr.length;i<len;i++){
                                var echartsId = allEchartsArr[i].id;
                                var echartsDom = allEchartsDom.filter('div[_echarts_instance_ = '+ echartsId +']');
                                var echartsHtml = echartsDom.html();
                                var imgWidth = 210*(echartsDom.width()/$('#centerCtn').width());
                                var imgUrl = allEchartsArr[i].getDataURL({backgroundColor: '#fff'});
                                var img;
                                if(imgUrl){
                                    img = '<img src="'+imgUrl+'" style=" width:'+ imgWidth +'mm;"/>';
                                }else{
                                    img = '<h4 style="width:'+ imgWidth +'px; height: 20px;">This chart has no data.</h4>';
                                }
                                arrHtml[0] = arrHtml[0].replace(echartsHtml,img);
                            }

                            // 先去服务端拉打印需要的模板
                            promise = WebAPI.get('/static/views/share/reportWrap/pdfTemplate.html');

                            // 在这里定义成功事件
                            promise.done(function (html) {
                                    var xhr, formData;
                                    // 生成最终的 html
                                    html = html.formatEL({
                                        projectImg: BEOPUtil.getProjectImgByType(AppConfig.projectId, BEOPUtil.projectImgType.pdfCover),
                                        title: reportTitle,
                                        encoding: 'UTF-8',
                                        entitiesHtml: arrHtml[0],
                                        projName: localStorage.getItem("language") === "zh"?projectInfo.name_cn:projectInfo.name_english,
                                        logo: BEOPUtil.getProjectImgByType(AppConfig.projectId, BEOPUtil.projectImgType.logo),
                                        date: $('.calendarCtn').children('input').val(),
                                        footerLeft: i18n_resource.report.reportWrap.GENERATED_BY_BEOP,
                                        footerRight: localStorage.getItem("language") === "zh"?"第 [page] 页 共[topage]页":"Page [page] of [topage]"
                                    });

                                    // 表单数据
                                    formData = new FormData();
                                    formData.append('html', html);
                                    formData.append('cover', result);
                                    formData.append('skin', 'default');

                                    xhr = new XMLHttpRequest();
                                    xhr.responseType = 'arraybuffer';
                                    xhr.open('POST', '/admin/getShareReportWrapPDF');
                                    xhr.onload = function () {
                                        var blob, url, lkPdfFile;
                                        if (this.status === 200) {
                                            blob = new Blob([xhr.response], {type: "application/pdf"});
                                            url = URL.createObjectURL(blob);

                                            // 这里用 a 标签来模拟下载，而不直接使用 window.open
                                            // 是因为 window.open 不能自定义下载文件的名称
                                            // 而 a 标签可以通过设置 download 属性来自定义下载文件的名称
                                            lkPdfFile = document.createElement('a');
                                            lkPdfFile.style = "display: none";
                                            lkPdfFile.id = "lkPdfFile";
                                            lkPdfFile.href = url;
                                            lkPdfFile.download = reportTitle + ' ' + $('.calendarCtn').children('input').val() +'.pdf';

                                            document.body.appendChild(lkPdfFile);
                                            lkPdfFile.click();
                                            window.URL.revokeObjectURL(url);
                                            window.setTimeout(function () {
                                                lkPdfFile.parentNode.removeChild(lkPdfFile);
                                            }, 0);
                                        } else {
                                            alert('Generate report failed, please try it again soon!');
                                        }
                                        // 隐藏 loading
                                        Spinner.stop();
                                    };
                                    xhr.send(formData);
                                // })

                            }).fail(function (e) {
                                throw e;
                            });

                        })
                })
            })
        };

        this._showReport = function (reportId, period, date) {
            if (this.report) {
                this.report.close();
            }

            this.report = new FacReportScreen({
                id: reportId,
                period: period,
                date: date
            }, this.centerCtn.children('div')[1] );
            
            return this.report.show();
        };
        this.initLayoutDOM = function () {
            $(this.container).removeClass("scrollable-y gray-scrollbar");
            this.row = $('<div class="reportContainer">').addClass("scrollable-y gray-scrollbar").css({"width":"100%",height:"100%"});
            this.row.appendTo(this.container);
            //创建左边内容
            var link = window.location.href;
            if(link.indexOf("externalChainPage") !== -1){
                this.leftCtn = $('<div id="leftCtn" class="externalChainStyle"></div>');
            }else{
                this.leftCtn = $('<div id="leftCtn"></div>');
            }
            this.leftCtn.appendTo(this.row);
            this.getReportList();

            //创建中间内容
            this.centerCtn = $('<div id="centerCtn"><div class="top"></div><div class="center"></div></div>');
            this.centerCtn.appendTo(this.row);
            this.centerCtnCon();
        };

        this.getReportList = function () {
            var arrHtml = ['<div class="leftCtnTop"></div>','<ul class="repotChapList">'];
            for(var i = 0, row, len = this.store.list.length;i < len; i++) {
                row = this.store.list[i];
                arrHtml.push('<li title="'+row.reportName+'" class="reportListName"><img class="arrow" src="/static/app/WebFactory/themes/default/images/left.svg"><span class="copyUrl"></span><a href="javascript:;" class="report-item" data-id="'+ row.reportId +'" data-period="'+ row.period +'">'+row.reportName+'</a></li>');
            }
            arrHtml.push('</ul>');
            return this.leftCtn.html(arrHtml.join(''));
        };
        this.centerCtnCon = function (){
            //pdf下载
            var pdfDownCtn = $('<div class="pdfDownCtn in"></div>');
            var pdfDownCon = '<span class="pdf_text">'+ I18n.resource.report.reportWrap.PDFDOWNLOAD +'</span>';
            pdfDownCtn.html(pdfDownCon);
            pdfDownCtn.appendTo($(".leftCtnTop"));
            
            //日历
            var newDate = new Date().format("yyyy-MM-dd");
            var calendarCtn = $('<div class="calendarCtn"></div>');
            calendarCtn.html('<input type="text" value="'+newDate+'" readonly class="form_datetime calendar_date">');
            calendarCtn.appendTo($(".leftCtnTop"));


            // 无需升级
            $(".form_datetime").datetimepicker({
                format: 'yyyy-mm-dd',
                minView: 'month',
                autoclose: true
            });
        };
        ///////////////////
        // tree - start ///
        ///////////////////
        +function () {
            // 报表导航树的默认配置
            var DEFAULT_TREE_OPTIONS = {
                container: document.body
            };

            this.optionsArr = [];

            this.treeOptions = {};
            //获取到的报表数据
            this.option = {};

            // 配置导航树
            this.setTreeOptions = function (options) {
                this.treeOptions = $.extend(false, DEFAULT_TREE_OPTIONS, options);
            };
            //渲染导航树
            this.renderTree = function () {
                var _this=this;
                var container = this.treeOptions.container;
                var $headline = $(container).find(".headline");

                var navTreeArr = ['<ul>'];
                Array.prototype.forEach.call($headline, function (row) {
                    var id = row.id;
                    var title = row.innerHTML;
                    // 章节的级别
                    var level = id.split('_')[1].split('-').length;
                    navTreeArr.push('<li><a href="#'+ id +'" title="'+title+'" class="col-xs-offset-'+(level-1)+' ">'+title+'</a></li>');
                    
                });
                navTreeArr.push("</ul>");
                $(".navTree").html(navTreeArr.join(''));
                //划过章节列表
                $('.navTree').find("li").hover(function(){
                    $(this).addClass("in");
                },function(){
                    $(this).removeClass("in");
                });
                //点击章节列表
                $('.navTree').find("li").click(function(){
                    $('.navTree').find("li").removeClass("selected")
                    $(this).addClass("selected");
                });
            };
            //销毁导航树
            this.destroyTree = function () {
                $(".navTree").empty().remove();
            };

        }.call(this);
        ///////////////////
        // tree - end ///
        ///////////////////
        this.close = function () {
            if (this.report) {
                this.report.close();
            }
            //清除数据
            this.store = null;
            //清空dom
            this.row = null;
            //清除左边报表名
            this.leftCtn = null;
            //清除中间部分
            this.centerCtn = null;
            //清除右边部分
            this.rightCtn = null;

            this.container.innerHTML = '';

            this.container.classList.remove('scrollable-y', 'gray-scrollbar');
        };

    }.call(FacReportWrapScreen.prototype);

    exports.FacReportWrapScreen = FacReportWrapScreen;
} ( namespace('observer.screens'), 
    namespace('observer.screens.FacReportScreen') ));
