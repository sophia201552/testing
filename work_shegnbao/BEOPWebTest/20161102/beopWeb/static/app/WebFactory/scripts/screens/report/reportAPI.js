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