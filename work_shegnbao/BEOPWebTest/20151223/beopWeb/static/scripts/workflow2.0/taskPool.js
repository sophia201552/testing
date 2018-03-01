var TaskPool = (function () {

    function TaskPool() {
        this.urlMap = {
            htmlTemplateURL: 'static/views/workflow/taskPoolTemplate.html'
        };
        this.apiMap = {
            getHtmlTemplate: '',
            testJSON: 'static/notices.json',
            getDiagnosisAll: 'diagnosis/getRealtimeFault/',
            getStruct: '/diagnosis/getStruct/'
        };
        this.configMap = {
            faultsHtmlTemplateId: 'task_pool_faults_list'
        };
        this.jqueryMap = {};
        this.noticeList = [];
        this.query = {
            overDueTime: ['oneMonth', 'twoMonth', 'threeMonth', 'halfYear'],
            emergencyLevel: ['general', 'emergency', 'serious'],
            faultsTime: ['today', 'yesterday', 'thisYear', 'thisWeek', 'thisMonth', 'thisSeason']
        };
        this.timer = null;
        this.echarts = null;
    }

    TaskPool.prototype = {
        //调用show方法 需要传过来一个 $container 和 projectId
        show: function ($container, projectID) {

            var _this = this;
            var $currentContainer = $container ? $container : $(ElScreenContainer);

            //如果不需要再new出一个Spinner对象可以去掉这一句
            var Spinner = new LoadingSpinner({color: '#00FFFF'});

            Spinner.spin($currentContainer.get(0));

            //先读取html模板然后读取数据
            this.init($currentContainer).done(function () {
                Spinner.spin(_this.jqueryMap.taskPool.get(0));

                $.getJSON(_this.apiMap.getDiagnosisAll + projectID).done(function (faults) {
                    //处理数据
                    if (faults) {
                        _this.renderFaultsList(faults, projectID).done(function () {
                            Spinner.stop();
                        });
                    } else {
                        $('.taskPoolInfoTxt').show();
                        Spinner.stop();
                    }

                }).fail(function () {
                    alert('读取数据失败');
                })
            }).always(function () {
                I18n.fillArea($currentContainer);
            }).fail(function () {
                alert('读取html模板失败');
                Spinner.stop();
            })

        },
        init: function ($container) {
            var _this = this;
            //加载html模板
            return WebAPI.get(this.urlMap.htmlTemplateURL + '?=' + new Date().getTime()).done(function (html) {
                $container.html(html);
                _this.setJqueryMap();
            })
        },
        setJqueryMap: function () {
            this.jqueryMap = {
                faultsContainer: '.task_pool_container',
                faultsContent: '<div id="task_pool_content"></div>',
                taskPool: $('#task_pool'),
                taskPoolTips: $('#taskPool_toolTip'),
                toolTipsFaultsTime: $('#taskPool_faults_Time'),
                toolTipsFaultsDetail: $('#taskPool_faults_Detail'),
                toolTipsFaultsTitle: $('#taskPool_faults_Title'),
                taskPoolSelectorInfo: $('.task_pool_selectorInfo')
            }
        },
        attachEvent: function () {

            var $taskPoolDropDownList = this.jqueryMap.taskPool.find('.dropdown li'), _this = this;
            //绑定切换
            $taskPoolDropDownList.off().on('click', function () {
                var $this = $(this), paramType = $this.parent().data('param-type'), param = $this.data('param');
                if (param == -1) {
                    _this.toggleFaultsStatus('all');
                } else {
                    try {
                        var values = _this.query[paramType][param];
                        if (!!values && values !== null && values !== 'undefined') {
                            _this.toggleFaultsStatus(paramType, values);
                        } else {
                            _this.toggleFaultsStatus('all');
                        }
                    } catch (ex) {
                        _this.toggleFaultsStatus('all');
                    }
                }
                //检查是否有空任务
                _this.checkEmptyTasks();
                $taskPoolDropDownList.removeClass('active');
                $this.addClass('active');

                //状态框的显示和隐藏
                var emergencyLevelColor = '', taskPoolSelectorInfo = $this.text();
                if (paramType == 'emergencyLevel') {
                    switch (param) {
                        case 0:
                            emergencyLevelColor = '#3a87ad';
                            break;
                        case 1:
                            emergencyLevelColor = '#ed7a3a';
                            break;
                        case 2:
                            emergencyLevelColor = '#fdbb4a';
                            break;
                    }
                }
                _this.jqueryMap.taskPoolSelectorInfo.show().find('section').css('backgroundColor', 'transparent').each(function () {
                    var $this = $(this);
                    if ($this.attr('data-param-type') == paramType) {
                        if (!emergencyLevelColor) {
                            $this.css('backgroundColor', '#428bca').show().find('span').text(taskPoolSelectorInfo);
                        } else {
                            $this.css('backgroundColor', emergencyLevelColor).show().find('span').text(taskPoolSelectorInfo);
                        }
                    }
                });


            });
            //绑定 hover
            this.jqueryMap.taskPool.off().on("mouseover", '.faults', function () {
                _this.showToolTips($(this));
            }).on('mouseout', '.faults', function () {
                _this.hideToolTips($(this));
            })
        },
        showToolTips: function ($this) {
            var dataEvent = $this.data().event,
                _this = this;
            var $taskPoolInfo = $("#taskPool_toolTip");
            this.jqueryMap.toolTipsFaultsTitle.text(dataEvent.title);
            this.jqueryMap.toolTipsFaultsDetail.text(dataEvent.description);
            this.jqueryMap.toolTipsFaultsTime.text(dataEvent.startTime);

            var wh = $(window).height();
            var x = this.jqueryMap.taskPoolTips.outerWidth();
            var y = $this.offset().top + $taskPoolInfo.height();
            //这里的高度是css里面写好的，可以自定义,区其余地方不要动
            var echartsHeight = 200;
            if (y > wh) {
                y = $this.offset().top - $this.height() * 3;
                $taskPoolInfo.find('.tooltip-arrow').css('top', '70%');
            } else {
                y = $this.offset().top - $this.height() * 2.5;
                $taskPoolInfo.find('.tooltip-arrow').css('top', '45px');
            }
            $taskPoolInfo.css({
                "left": -x,
                "top": y
            }).toggleClass('wf-bounceleft').show();
            clearTimeout(this.timer);
            this.timer = setTimeout(function () {
                if (y > 360) {
                    $taskPoolInfo.animate({top: y - echartsHeight + 'px'}, 'fast');
                    $taskPoolInfo.find('.tooltip-arrow').css('top', 45 + echartsHeight + 'px');
                }
                _this.jqueryMap.taskPoolTips.find('.taskPoolInfoEcharts').slideDown();
                _this.getEcharts.call(_this, dataEvent, _this.jqueryMap.taskPool.find('.taskPoolInfoEcharts').get(0));
            }, 2000);
        },
        hideToolTips: function ($this) {
            this.jqueryMap.toolTipsFaultsTitle.text('');
            this.jqueryMap.toolTipsFaultsDetail.text('');
            this.jqueryMap.toolTipsFaultsTime.text('');
            $("#taskPool_toolTip").toggleClass('wf-bounceleft').hide().find('.taskPoolInfoEcharts').empty().hide();
            clearTimeout(this.timer);
            this.timer = null;
            this.echarts = null;
        },
        getEcharts: function (event, echartContainer) {
            $(echartContainer).empty();
            var _this = this;
            var momentTime = event.content.time.toDate();
            var Spinner = new LoadingSpinner({color: '#00FFFF'});
            Spinner.spin(echartContainer);
            WebAPI.post('workflow/transaction/fault_curve_data/', {
                projectId: event.content.project,
                chartPointList: event.content.fault.points,
                chartQueryCircle: 'm5',
                chartStartTime: new Date(momentTime - 3600000).format('yyyy-MM-dd HH:mm:ss'), //报警发生前半天
                chartEndTime: new Date(momentTime + 3600000).format('yyyy-MM-dd HH:mm:ss')   //报警发生后半天
            }).done(function (result) {
                if (result.success) {
                    _this.renderChart(result.data, echartContainer);
                }
            }).always(function () {
                Spinner.stop();
                Spinner = null;
            })
        },
        renderChart: function (record, echartContainer) {
            var list_description = record.description,
                list_value = record.value,
                arrXAxis;
            if (record.time.length > 0)
                arrXAxis = record.time[0].split(',');
            var arrSeriesTemp = [];
            for (var i = 0; i < list_value.length; i++) {
                var arrDatas = [];
                if (i < 8) {
                    var item = list_value[i];
                    if (item) {
                        var strDatas = item.split(",");
                        for (var j = 0; j < strDatas.length; ++j) {
                            arrDatas.push(parseFloat(strDatas[j]).toFixed(1));
                        }
                    }

                    arrSeriesTemp.push(
                        {
                            name: list_description[i],
                            type: 'line',
                            itemStyle: {normal: {lineStyle: {type: 'solid'}}},
                            data: arrDatas
                        });
                }
            }
            var option =
            {
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: list_description,
                    x: 'center'
                },
                toolbox: {
                    show: true
                },
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        axisLine: {onZero: false},
                        data: arrXAxis
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        scale: true
                    }
                ],
                series: arrSeriesTemp
            };
            var myChart = echarts.init(echartContainer);
            myChart.setOption(option);
            this.echarts = myChart;
        },
        toggleFaultsStatus: function (queryType, values) {
            var $faultsList = $('#task_pool_content').find('.faults');

            if (arguments.length == 2) {
                $faultsList.each(function () {
                    var $this = $(this);
                    $this.hide();
                    try {
                        if ($this.data().query[queryType][values]) {
                            $this.show();
                        }
                    } catch (ex) {

                    }
                })
            } else {
                if (arguments.length == 1 && arguments[0] == 'all') {
                    $faultsList.show();
                }
            }

        },
        checkEmptyTasks: function () {
            var $taskPoolInfoTxt = this.jqueryMap.taskPool.find('.taskPoolInfoTxt');
            if (!(this.jqueryMap.taskPool.find('.faults:visible').length)) {
                $taskPoolInfoTxt.show();
            } else {
                $taskPoolInfoTxt.hide();
            }
        },
        detachEvents: function () {
        },
        renderFaultsList: function (faults, projectID) {
            var _this = this;
            var dealFaults = function () {
                var dfd = $.Deferred();
                //返回一个dfd对象
                if (Array.isArray(faults)) {
                    if (faults.length) {
                        //1、如果有faults的话再去请求另外一个接口返回equipment和zones，没有则返回
                        $.getJSON(_this.apiMap.getStruct + projectID).done(function (data) {
                            var noticesList = [];
                            //2、遍历所有的faults
                            faults.forEach(function (faultsItem, index, array) {
                                //equipment 和 zone 和 zoneId 做了初始化
                                var equipment = {}, zone = {}, zoneId = undefined;
                                var equipmentId = faultsItem.equipmentId;
                                data.equipments.forEach(function (equipments, index, array) {
                                    //3、找到 data.equipments 里面对应的 equipmentId
                                    if (equipmentId == equipments.id) {
                                        equipment = equipments;
                                        zoneId = equipment.zoneId;
                                        //4、如果找到equipment，根据 equipments 的 zoneId 找相应的 zones
                                        data.zones.forEach(function (zones, index, array) {
                                            if (zoneId == zones.id) {
                                                zone = zones;
                                            }
                                        });
                                        //5、跳出第二层forEach循环，继续循环最外层的 faults
                                        return true;
                                    }
                                });
                                //6、第二层forEach循环跳出后就添加数据
                                //按照原来的获取属性的格式添加
                                noticesList.push({
                                    project: projectID,
                                    id: faultsItem.id,
                                    equipmentId: equipmentId,
                                    zoneId: zoneId,
                                    time: faultsItem.time,
                                    fault: {
                                        points: faultsItem.points,
                                        name: faultsItem.name,
                                        userFaultGrade: faultsItem.grade,
                                        description: faultsItem.description,
                                        equipment: equipment ? $.extend(true, {}, equipment, {zone: zone}) : {}
                                    }
                                });
                            });
                            _this.noticeList = noticesList;
                            dfd.resolve();
                        }).fail(function () {
                            dfd.reject();
                        });
                    } else {
                        _this.noticeList = [];
                        dfd.resolve();
                    }
                } else {
                    _this.noticeList = [];
                    dfd.resolve();
                }
                return dfd;
            };

            return dealFaults().done(function () {
                _this.setDataOnFaults().done(function () {
                    _this.attachEvent();
                });
            }).fail(function () {
                _this.setDataOnFaults().done(function () {
                    _this.attachEvent();
                });
            });
        },
        setDataOnFaults: function () {
            $(this.jqueryMap.faultsContainer).empty();
            var i = 0,
                notice,
                $faultsItem, _this = this,
                $events = $(this.jqueryMap.faultsContent),
                data = this.noticeList;

            for (i; i < data.length; i++) {
                notice = data[i];
                $faultsItem = $('<div class="ellipsis faults" title="fault info">' +
                    '<span class="zoneInfo">' +
                    '<em class="mr20" title="equipment name">' + notice.fault.equipment.name + '</em>' +
                    '</span>' +
                    '<span class="itemPoolTitle" title="fault name">' + notice.fault.name + '</span>' +
                    '<span class="itemTime" title="time">' + notice.time + '</span>' +
                    '</div>');

                var dateNow = new Date(), date = new Date(notice.time);
                var queryObject = {
                    userFaultGrade: _this.noticeList[i].fault.userFaultGrade,
                    //逾期时间
                    overDueTime: {
                        oneMonth: false,
                        twoMonth: false,
                        threeMonth: false,
                        halfYear: false
                    },
                    //紧急程度
                    emergencyLevel: {
                        general: false,
                        emergency: false,
                        serious: false
                    },
                    //故障时间
                    faultsTime: {
                        today: false,
                        yesterday: false,
                        thisYear: false,
                        thisWeek: false,
                        thisMonth: false,
                        thisSeason: false
                    }
                };
                //判断故障时间
                //-------------------------------------------------------
                //当日
                if (date.getDate() == dateNow.getDate()) {
                    queryObject.faultsTime.today = true;
                }
                //昨日
                if (date.getDate() == (dateNow.getDate() - 1)) {
                    queryObject.faultsTime.yesterday = true;
                }
                //当周 判断日期和今天的日期相减是否小于或等于7 而且 是本月
                if (this.getThisWeek().some(function (item) {
                        return (item == date.getDate())
                    })) {
                    queryObject.faultsTime.thisWeek = true;
                }
                //判断是否是这个季度
                if (_this.getQuarterSeason(dateNow.getMonth() + 1).filter(function (element) {
                        return element == (date.getMonth() + 1)
                    }).length !== 0) {
                    queryObject.faultsTime.thisSeason = true;
                }
                //当月 判断月份 是否 等于 当前月份
                if (date.getMonth() == dateNow.getMonth()) {
                    queryObject.faultsTime.thisMonth = true;
                }
                //当年 判断年份 是否 等于当前年
                if (date.getFullYear() == dateNow.getFullYear()) {
                    queryObject.faultsTime.thisYear = true;
                }
                //-------------------------------------------------------
                //判断逾期
                //-------------------------------------------------------
                switch (Math.abs((date.getMonth() + 1) - (dateNow.getMonth() + 1))) {
                    case 1:
                        queryObject.overDueTime.oneMonth = true;
                        $faultsItem.attr('data-overDueTime', '1');
                        break;
                    case 2:
                        queryObject.overDueTime.threeMonth = true;
                        break;
                    case 3:
                        queryObject.overDueTime.threeMonth = true;
                        break;
                    case 6:
                        queryObject.overDueTime.halfYear = true;
                        break;
                }
                //-------------------------------------------------------
                //错误等级和添加class
                var grade = _this.noticeList[i].fault.userFaultGrade;
                switch (grade) {
                    case 0:
                        queryObject.emergencyLevel.general = true;
                        break;
                    case 1:
                        queryObject.emergencyLevel.emergency = true;
                        break;
                    case 2:
                        queryObject.emergencyLevel.serious = true;
                        break;
                    default :
                        break;
                }
                $faultsItem.addClass('fault_grade_' + grade);
                //-------------------------------------------------------
                //最后给 $faultsItem 设置 data
                var dataObj = {
                    query: queryObject,
                    event: {
                        id: this.noticeList[i].id,
                        title: notice.fault.name,
                        startTime: notice.time,
                        description: notice.fault.description,
                        userFaultGrade: notice.fault.userFaultGrade,
                        content: notice
                    }
                };
                $faultsItem.data(dataObj);
                //加入
                $events.append($faultsItem);
            }

            //加入DOM
            $(this.jqueryMap.faultsContainer).html($events);

            return $.Deferred().resolve();
        },
        getQuarterSeason: function (month) {
            if (month < 3) {
                return [1, 2, 3]
            } else if (month <= 4 && month <= 6) {
                return [4, 5, 6]
            } else if (month >= 7 && month <= 9) {
                return [7, 8, 9]
            } else if (month >= 10 && month <= 12) {
                return [10, 11, 12]
            }
        },
        getThisWeek: function () {
            var dateNow = new Date(),
                dayNow = dateNow.getDate(),
                daysTotalMonth = new Date(dateNow.getFullYear(), dateNow.getMonth(), 0).getDate(),
                result = [], i;
            if (daysTotalMonth - dayNow >= 7) {
                for (i = 0; i <= 7; i++) {
                    result.push(dayNow++);
                }
            } else {
                var length = daysTotalMonth - dayNow;
                for (i = 0; i <= length; i++) {
                    result.push(dayNow++);
                }
                for (i = 1; i <= 7 - length; i++) {
                    result.push(i);
                }
            }
            return result;
        },
        close: function () {

        }
    };

    return TaskPool;
})
();