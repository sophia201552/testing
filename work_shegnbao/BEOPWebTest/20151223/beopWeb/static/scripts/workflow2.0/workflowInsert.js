/**
 * Created by liqian on 2015/5/20.
 */
var WorkflowInsert = (function () {

    //params: insertData = {
    //    title: 'title test',
    //    detail: 'detail test',
    //    dueDate: '2015-05-29',
    //    critical: 2,
    //    projectId: 18,
    //    chartPointList: '12F_AHU1.AHU_PRSP,12F_AHU1.AHU_PRSP|12F_AHU1_DuctPressure01,12F_AHU1_DuctPressure01|12F_AHU1_SupplyFanVSDFreq,12F_AHU1_SupplyFanVSDFreq|',
    //    chartQueryCircle: 'm5',
    //    chartStartTime: '2015-04-29 09:51:45',
    //    chartEndTime: '2015-04-30 09:51:45',
    //    userId: AppConfig.userId,
    //    groupId: '',
    //    executorId: ''
    //}
    function WorkflowInsert(insertData, submitFunc, cancelFunc, insertFunc) {
        this.$container = $('');
        this.insertData = insertData;
        this.teamList = [];
        this.submitFunc = submitFunc;
        this.cancelFunc = cancelFunc;
        this.insertFunc = insertFunc;
    }

    WorkflowInsert.prototype = {
        show: function () {
            var _this = this;
            Spinner.spin(ElScreenContainer);
            WebAPI.get("/static/views/workflow/insert.html").done(function (resultHtml) {
                $(ElScreenContainer).html(resultHtml);
                Spinner.spin(ElScreenContainer);
                _this.$container = $("#workflow-insert");
                _this.init();
                I18n.fillArea($(ElScreenContainer));
            });
        },

        close: function () {
        },

        init: function () {
            this.loadData();//加载页面数据
            this.attachEvents();//绑定页面点击事件
        },

        setSubmitFunc: function (func) {
            this.submitFunc = func;
        },
        setCancelFunc: function (func) {
            this.cancelFunc = func;
        },
        setInsertFunc: function (func) {
            this.insertFunc = func;
        },

        attachEvents: function () {
            var _this = this;
            this.$container.on('change', '#selectGroup', function () {
                var $this = $(this);
                _this.insertData.groupId = $this.val();
                WebAPI.get('/workflow/getGroupMembers/' + _this.insertData.groupId).done(function (result) {
                    if (result.success) {
                        var selectExecutorHtml = beopTmpl('selectExecutorTmpl', result.data);
                        $('#selectExecutor').replaceWith(selectExecutorHtml);
                    }
                })
            });
            this.$container.on("click", "#workflow-insert-submit", function () {
                if (_this.submitCheck()) {//表单校验
                    Spinner.spin(ElScreenContainer);
                    // 判断用户是否有项目团队
                    if (!_this.teamList.length) {
                        _this.setFloatingWin($("#noTeamHandle"), 500);
                        Spinner.stop();
                        return;
                    }
                    var submitModel = _this.getSubmitModel();
                    $.when(WebAPI.get('/diagnosis/notice/makesure/' + submitModel.projectId + '/' + submitModel.noticeId + '/' + AppConfig.userId),
                        WebAPI.post('/workflow/transaction/add/', submitModel)).done(function (makesureResult, addResult) {
                            if (makesureResult[0] == 'true' && addResult[0].success) {
                                alert('created successfully');
                            } else {
                                alert('created incorrect');
                            }
                            _this.submitFunc && typeof _this.submitFunc === 'function' ? _this.submitFunc(makesureResult[0] == 'true', addResult[0].success) : ScreenManager.show(DiagnosisScreen);
                        }).fail(function () {
                            Alert.danger(ElScreenContainer, 'create workflow failed.').showAtTop(2000);
                        })
                        .always(function () {
                            Spinner.stop();
                        });
                }
            });

            this.$container.on("click", "#workflow-insert-cancel", function () {
                _this.cancelFunc && typeof _this.cancelFunc === 'function' ? _this.cancelFunc() : ScreenManager.show(DiagnosisScreen);
            });

            $("#btn_goto_WorkFlow").click(function () {
                ScreenManager.show(WorkflowMain);
            });
        },

        getSubmitModel: function () {
            return {
                noticeId: this.insertData.noticeId,
                groupId: $('#selectGroup').val(),
                executorId: $('#selectExecutor').val(),
                title: $('#workflow-insert-title').val(),
                detail: $('#workflow-insert-detail').val(),
                dueDate: $('#dueDate').val(),
                critical: $('#critical').val(),
                projectId: this.insertData.projectId,
                chartPointList: this.insertData.chartPointList,
                chartQueryCircle: this.insertData.chartQueryCircle,
                chartStartTime: this.insertData.chartStartTime,
                chartEndTime: this.insertData.chartEndTime,
                userId: AppConfig.userId
            }
        },

        setFloatingWin: function ($win, h) {//设置浮动窗口
            var wh = $(window).height();
            var top = (wh - h) / 2;
            $win.find(".modal-dialog").css({
                'top': top
            });
            $win.modal();
        },

        submitCheck: function () {
            if ($.trim($("#dueDate").val()) === "") {
                $("#insert-errorInfo").text(I18n.resource.workflow.insert.DEADLINE_REQUIRED);
                return false;
            }
            if ($.trim($("#workflow-insert-title").val()) === "") {
                $("#insert-errorInfo").text(I18n.resource.workflow.insert.TITLE_REQUIRED);
                return false;
            }
            return true;
        },

        loadData: function () {
            if ($.isEmptyObject(this.insertData)) {
                return false;
            }
            var _this = this;
            WebAPI.post('/workflow/loadInsertPage', this.insertData).done(function (result) {
                if (result.success) {
                    _this.renderChart(result.data);
                    _this.renderForm({
                        insertData: _this.insertData,
                        groups: result.data.group,
                        groupMembers: result.data.groupMembers
                    });
                    _this.teamList = result.data.group;
                    I18n.fillArea($(ElScreenContainer));
                }
            }).always(function () {
                Spinner.stop();
            })
        },
        renderForm: function (formData) {
            var insertInfoContentHtml = beopTmpl('insertInfoContentTmpl', formData);
            $('#insert-info-content').empty().html(insertInfoContentHtml);
            $("#dueDate").datetimepicker({
                minView: 2,
                format: "yyyy-mm-dd",
                autoclose: true,
                startDate: new Date()
            });
        },

        renderChart: function (record) {
            var list_description = record.list_description,
                list_value = record.list_value,
                arrXAxis;
            if (list_description.length == list_value.length) {
                if (record.list_time.length > 0)
                    arrXAxis = record.list_time[0].split(',');
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
                    title: {
                        text: I18n.resource.workflow.notice.FAULT_CURVE,
                        x: 'left'
                    },
                    tooltip: {
                        trigger: 'axis',
                        formatter: function (params) {
                            var strResult;
                            if (params[0].name.length > 0) {
                                strResult = params[0].name + '<br/>';
                                for (var i = 0; i < params.length; ++i) {
                                    strResult += params[i].seriesName + ' : ' + params[i].value;
                                    if (i != params.length - 1) {
                                        strResult += '<br/>';
                                    }
                                }
                            }
                            return strResult;
                        }
                    },
                    legend: {
                        data: list_description,
                        x: 'center'
                    },
                    toolbox: {
                        show: true
                    },
                    dataZoom: {
                        show: true,
                        realtime: true,
                        start: 0,
                        end: 100
                    },
                    xAxis: [
                        {
                            name: "",
                            type: 'category',
                            boundaryGap: false,
                            axisLine: {onZero: false},
                            data: arrXAxis
                        }
                    ],
                    yAxis: [
                        {
                            name: "",
                            type: 'value',
                            scale: true
                        }
                    ],
                    series: arrSeriesTemp,
                    showLoading: {
                        text: 'loading',
                        effect: 'spin'
                    }
                };
                var myChart = echarts.init($('#insert-chart').get(0));
                myChart.setOption(option);
                window.onresize = myChart.resize;
            }
        }
    };
    return WorkflowInsert;
})();