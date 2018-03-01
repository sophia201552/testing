;(function (exports) {

    function ReportAPI() {}

    +function () {
        // 在指定的dom容器中，渲染出指定报表的指定章节或者其汇总信息
        // 参数重载：
        //   container,reportId[,chapterId][,options]
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
                var period;

                // 获取报表的周期类型
                if (layouts[0]) {
                    period = layouts[0].modal.option.period;
                } else {
                    Log.error('报表数据为空！');
                    return;
                }

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
                    Log.error('没有找到指定报表/章节');
                    return;
                }

                // 清空容器
                container.innerHTML = '';
                // 给容器加上类型
                container.classList.add('report-ob', 'report-wrap', 'report-ref-external');

                // 根据找到的数据进行报表显示
                return (function (container, data, period, options) {
                    var Clazz;
                    var report;
                    var promise = $.Deferred();
                    var entity;

                    // 判断是否只显示摘要
                    if (options.onlySummary) {
                        Clazz = namespace('factory.report.components')['CustomSummary'];
                        entity = {
                            spanC: 12,
                            spanR: 6,
                            modal: {
                                option: {},
                                type: 'CustomSummary'
                            }
                        };

                        // 渲染摘要
                        promise.resolve();
                    } else {
                        Clazz = namespace('factory.report.components')[data.modal.type];
                        entity = data;
                        promise.reject();
                    }

                    entity.modal.option.period = period || 'day';
                    report = new Clazz({
                        container: container,
                        reportDate: options.date
                    }, entity);

                    // 如果设置了只显示摘要，则在这里进行渲染摘要的操作
                    return promise.then(function () {
                        var summary = [];
                        var o = null;
                        // 获取一个章节的摘要
                        if (data.modal.type === 'ChapterContainer') {
                            o = {
                                variables: {},
                                chapterNo: '',
                                chapterSummary: data.modal.option.chapterSummary,
                                screen: {}
                            };
                            summary = [[o,[]]];

                            // 添加变量处理
                            report.registTask(data.modal.variables, o).done(function (rs) {
                                o.variables = report._createObjectWithChain(rs, o.screen.variables);
                            });
                        }
                        // 获取所有的摘要信息
                        else {
                            summary = report.getSummaryFromData(data);
                        }
                        // 处理参数
                        return report.processTask().then(function () {
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
                } (container, match, period, options));
            });
        };

    }.call(ReportAPI.prototype);

    exports.report = new ReportAPI();
} (
    namespace('api')
));