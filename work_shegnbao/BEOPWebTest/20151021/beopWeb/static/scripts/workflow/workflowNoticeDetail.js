/// <reference path="../lib/jquery-1.11.1.js" />
var workflowNoticeDetail = (function () {
    var memberListPromise = {};

    function workflowNoticeDetail(id, backTitle, backContent) {
        this.id = id;
        this.backTitle = backTitle;
        this.backContent = backContent;
        this.model = null;
        this.executorId = null;
        this.isEditable = null;
    }

    workflowNoticeDetail.prototype = {
        show: function () {
            var _this = this;
            WebAPI.get("/static/views/workflow/notice_detail.html").done(function (resultHtml) {
                $(ElScreenContainer).html(resultHtml);
                _this.init();
                I18n.fillArea($(ElScreenContainer));
                $('#notDetDeadline').attr('title', I18n.resource.workflow.notice.DEADLINE);
            });
        },

        close: function () {
            window.onresize = null;
        },
        setBackTitle: function (title) {
            $('.backTitle').text(title ? title : I18n.resource.workflow.notice.BACK);
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
                var myChart = echarts.init($('#error_line').get(0), AppConfig.chartTheme);
                myChart.setOption(option);
                window.onresize = myChart.resize;
            }
        },

        refreshPage: function () {
            Spinner.spin($(".workflow-container")[0]);
            var _this = this;
            WebAPI.get('/workflow/transaction/notice/' + AppConfig['userId'] + '/' + this.id).done(function (result) {
                if (!result.success) {
                    return false;
                }
                _this.model = result;
                _this.model.criticalMap = {
                    0: I18n.resource.workflow.urgencyLevel[0],
                    1: I18n.resource.workflow.urgencyLevel[1],
                    2: I18n.resource.workflow.urgencyLevel[2]
                };
                _this.executorId = result.record_detail.executorId;
                _this.model.record_detail.isEditable = result.isEditable;
                $('#workInfo').empty().replaceWith(beopTmpl('recordDetailTmpl', _this.model));
                if (_this.model.record_detail &&
                    _this.model.record_detail.list_value &&
                    _this.model.record_detail.list_value.length) {
                    $('.breakdown-row').show();
                    _this.renderChart(_this.model.record_detail);
                }

                // 兼容早期工单 早期工单 _this.model.status_flow[0] 可能为null导致报错
                if (_this.model.status_flow && _this.model.status_flow.length && _this.model.status_flow[0]) {
                    _this.refreshProcessRecord();
                }
                _this.refreshOperations();
                _this.refreshReply();
                _this.renderStatus();

            }).always(function () {
                I18n.fillArea($(ElScreenContainer));
                Spinner.stop();
            });

        },
        refreshReply: function () { //话题讨论
            if (this.model.replyList) {
                $('#reply-content').empty().append(beopTmpl('replyContentTmpl', this.model));
            }
        },
        refreshProcessRecord: function () { //工单流程记录
            var _this = this;
            var html = '<li class="leftLi">';
            for (var i = 0; i < this.model.status_flow.length; i++) {
                var data = this.model.status_flow[i];
                if (i == 0) {
                    html += '<dl><dt><img src="' + data.userpic + '" class="processUser processSuccess"></dt><dd class="userName" title="' + data.userfullname + '">' + data.userfullname + '</dd></dl><div class="processInfo"><h4 i18n="workflow.process.ASSIGNMENT_TASK"></h4><img src="http://images.rnbtech.com.hk/static/images/workflow/processNext.png" class="processNext processSuccess"><time></time></div>';
                } else if (i == 1) {
                    if(this.model.status_flow[0].executor_userfullname){
                        html += '<dl><dt><img src="' + this.model.status_flow[0].executor_userpic + '" class="processUser processSuccess"></dt><dd class="userName" title="' + this.model.status_flow[0].executor_userfullname + '">' + this.model.status_flow[0].executor_userfullname + '</dd></dl>';
                    }else{
                        html += '<dl><dt><img src="' + this.model.status_flow[0].userpic + '" class="processUser processSuccess"></dt><dd class="userName" title="' + this.model.status_flow[0].userfullname + '">' + this.model.status_flow[0].userfullname + '</dd></dl>';
                    }
                } else if (i == 2) {
                    if (data.length != 0) {
                        var forwardTime = _this.getRecordTime(this.model.status_flow[0].opTime, this.model.status_flow[2][0].assignTime.new);
                        if (data.length == 1) {
                            html += '<div class="processInfo"><h4 i18n="workflow.process.FORWARD"></h4><img src="http://images.rnbtech.com.hk/static/images/workflow/processNext.png" class="processNext processSuccess"><time></time>' + forwardTime + '</div><dl><dt><img src="' + this.model.status_flow[3].userpic + '" class="processUser processSuccess"></dt><dd class="userName" title="' + data[0].executor.new + '">' + data[0].executor.new + '</dd></dl>';
                        } else if (data.length > 1) {
                            html += '<div class="processInfo"><h4 i18n="workflow.process.FORWARD"></h4><img src="http://images.rnbtech.com.hk/static/images/workflow/processNexts.png" id="assignInfo" class="processNext processSuccess"><time>' + forwardTime + '</time></div><dl><dt><img src="' + this.model.status_flow[3].userpic + '" class="processUser processSuccess"></dt><dd class="userName" title="' + data[0].executor.new + '">' + data[0].executor.new + '</dd></dl>';
                        }
                    }
                } else if (i == 3) {
                    if (data.flowStatus == 1) {
                        if (this.model.status_flow[2].length) {
                            var handleTime = _this.getRecordTime(this.model.status_flow[2][0].assignTime.new, this.model.status_flow[3].opTime);
                        } else {
                            var handleTime = _this.getRecordTime(this.model.status_flow[0].opTime, this.model.status_flow[3].opTime);
                        }
                        html += '<div class="processInfo"><h4 i18n="workflow.process.PROCESSING"></h4><img src="http://images.rnbtech.com.hk/static/images/workflow/processNext.png" class="processNext processSuccess"><time>' + handleTime + '</time></div><dl><dt><img src="http://images.rnbtech.com.hk/static/images/workflow/wf-complete.png" class="processUser processSuccess"></dt><dd class="userName" i18n="workflow.process.COMPLETE"></dd></dl>';
                    } else {
                        html += '<div class="processInfo"><h4 i18n="workflow.process.PROCESSING"></h4><img src="http://images.rnbtech.com.hk/static/images/workflow/processNext.png" class="processNext"><time></time></div><dl><dt><img src="http://images.rnbtech.com.hk/static/images/workflow/wf-complete.png" class="processUser"></dt><dd class="userName" i18n="workflow.process.COMPLETE"></dd></dl>';
                    }
                } else if (i == 4) {
                    if (data.flowStatus == 1) {
                        var authenticationTime = _this.getRecordTime(this.model.status_flow[3].opTime, this.model.status_flow[4].opTime);
                        html += '<div class="processInfo"><h4 i18n="workflow.process.VERIFY"></h4><img src="http://images.rnbtech.com.hk/static/images/workflow/processNext.png" class="processNext processSuccess"><time>' + authenticationTime + '</time></div><dl><dt><img src="http://images.rnbtech.com.hk/static/images/workflow/wf-verified.png" class="processUser processSuccess"/></dt><dd class="userName" i18n="workflow.process.VERIFY"></dd></dl>'
                    } else {
                        html += '<div class="processInfo"><h4 i18n="workflow.process.VERIFY"></h4><img src="http://images.rnbtech.com.hk/static/images/workflow/processNext.png" class="processNext"><time></time></div><dl><dt><img src="http://images.rnbtech.com.hk/static/images/workflow/wf-verified.png" class="processUser"/></dt><dd class="userName" i18n="workflow.process.VERIFY"></dd></dl>'
                    }
                }
            }
            html += '</li>';
            var $processRecordContent = $("#processRecordContent");
            if (this.model.status_flow[2].length) {
                $processRecordContent.css("width", "905px");
            } else {
                $processRecordContent.css("width", "660px");
            }
            $processRecordContent.html(html);
            $("#assignInfo").data('data', this.model.status_flow[2].reverse()).data('createTime', this.model.status_flow[0].opTime);
        },
        refreshOperations: function () { //工单历史记录
            if (this.model.operations && this.model.operations.length) {
                var $workOrderHistoryUl = $("#workOrderHistoryUl");
                $workOrderHistoryUl.html(beopTmpl('workOrderHistoryUlTmpl', this.model));
                if ($workOrderHistoryUl.find("li").length > 1) {
                    var height = $("#workOrderHistoryUl .timeLineIcon:last").offset().top - $("#workOrderHistoryUl .timeLineIcon:first").offset().top;
                    $("#verticalLine").css("height", height + "px");
                }
            }
        },

        addReply: function (detail) {
            var _this = this;
            Spinner.spin($(".workflow-container")[0]);
            var replyTime = new Date().format('yyyy-MM-dd HH:mm:ss');
            return WebAPI.post('/workflow/transaction/insert_reply/', {
                ofTransactionId: this.id,
                replyUserId: AppConfig['userId'],
                replyTime: replyTime,
                detail: detail
            }).done(function (result) {
                if (result) {
                    if (!_this.model.replyList) {
                        _this.model.replyList = [];
                    }
                    _this.model.replyList.push({
                        replyTime: replyTime,
                        detail: detail,
                        userfullname: AppConfig.userProfile.fullname,
                        userpic: AppConfig.userProfile.picture
                    });
                    _this.refreshReply();
                }
            }).always(function () {
                I18n.fillArea($(ElScreenContainer));
                Spinner.stop();
            });
        },
        renderMemberList: function () {
            var $workInfo = $("#workInfo"),
                $assignSelect = $('#assignSelect'),
                groupId = this.model.record_detail.groupid,
                executorId = this.model.record_detail.executorId,
                memPromise;

            memPromise = memberListPromise[groupId];
            if (!memPromise) {
                memPromise = WebAPI.get('/workflow/getTransactionGroupMembers/' + groupId);
                memberListPromise[groupId] = memPromise;
            }
            Spinner.spin($workInfo[0]);
            memPromise.done(function (result) {
                var memberList = JSON.parse(result), memberOptionsHtml = '<option disabled i18n="workflow.main.ASSIGN_AGAIN"></option>';
                for (var i = 0; i < memberList.length; i++) {
                    if (executorId == memberList[i].id) {
                        memberOptionsHtml += '<option value="' + memberList[i].id + '" selected>' + memberList[i].name + '</option>';
                    } else {
                        memberOptionsHtml += '<option value="' + memberList[i].id + '">' + memberList[i].name + '</option>';
                    }
                }
                $assignSelect.empty().append(memberOptionsHtml);
            }).always(function () {
                I18n.fillArea($(ElScreenContainer));
                Spinner.stop();
            })
        },
        renderStatus: function () {
            $('#taskStatusWrapper').html(beopTmpl('taskStatusTmpl', this.model.record_detail));
        },
        getTimeList: function (list) {
            var timeList = [];
            var timeDiffList = [];
            for (var i = 0; i < list.length; i++) {
                var item = list[i];
                if ($.trim(item.opTime) != '') {
                    timeList.push(item.opTime);
                }
            }
            for (var j = 0; j < timeList.length; j++) {
                if (timeList.length > 1) {
                    if (timeList[j] && timeList[j + 1]) {
                        var timeDiff = this.getRecordTime(timeList[j], timeList[j + 1]);
                        timeDiffList.push(timeDiff);
                    }
                }
            }
            return timeDiffList;
        },
        getRecordTime: function (dateStr1, dateStr2) {
            var date1 = new Date(dateStr1);
            var date2 = new Date(dateStr2);
            var date3 = date2.getTime() - date1.getTime();  //时间差的毫秒数
            var days = date3 / (24 * 3600 * 1000);
            var timeStr = '';
            if (days >= 1) {
                timeStr = days.toFixed(1) + "天";
            } else {
                timeStr = (days * 24).toFixed(1) + "小时";
            }
            return timeStr;
        },
        TransTimeFormat: function (date) {
            var timeList = [];
            var dateLists = date.split(" ");
            var dateList = dateLists[0].split("-");
            var timeLists = dateLists[1].split(":");
            timeList = dateList.concat(timeLists);
            return timeList;
        },
        changeStatus: function (url, status, callback) {
            var _this = this;
            Spinner.spin($(".workflow-container")[0]);
            WebAPI.post(url, {
                'trans_id': this.id,
                'user_id': AppConfig.userId
            }).done(function (result) {
                if (result === 'success') {
                    if (callback) {
                        callback.call(_this, status);
                    }
                    if (status != null || status != undefined) {
                        _this.model.record_detail.statusId = status;
                    }
                    _this.renderStatus();
                }
            }).always(function () {
                I18n.fillArea($(ElScreenContainer));
                Spinner.stop();
            })
        },
        resetEditing: function () {
            var $detailEditor = $('#detail-editor'), $titleEditor = $('#title-editor');
            $titleEditor.val(this.model.record_detail.title);
            $detailEditor.val(this.model.record_detail.detail);
            $("#changeDate").val(this.model.record_detail.due_date);
            $("#criticalSelect").val(this.model.record_detail.critical);
        },
        getSaveModel: function () {
            return {
                title: $('#title-editor').val(),
                transId: this.id,
                userId: AppConfig.userId,
                detail: $('#detail-editor').val(),
                executorID: $('#assignSelect option:selected').val() || this.executorId,
                critical: $('#criticalSelect option:selected').val(),
                dueDate: $("#changeDate").val()
            }
        },
        updateViewModel: function () {
            var newModel = this.getSaveModel();
            this.model.record_detail.title = newModel.title;
            this.model.record_detail.detail = newModel.detail;
            this.model.record_detail.executorId = newModel.executorID;
            this.model.record_detail.critical = newModel.critical;
            this.model.record_detail.due_date = newModel.dueDate;
        },
        updateHistory: function (action) {
            var data = this.model.record_detail;
            this.updateViewModel();
            this.model.operations.unshift({
                detail: data.detail,
                op: action,
                opTime: '刚刚',
                title: data.title,
                userfullname: AppConfig.userProfile.fullname,
                userpic: AppConfig.userProfile.picture
            });
            this.refreshOperations();
        },
        showEditable: function (str) {
            var $workInfo = $('#workInfo');
            if (str == 'show') {
                $workInfo.find(".info").removeClass("edit-no-info").addClass("edit-info").show();
                $workInfo.find(".infoNo").removeClass("edit-no-num").addClass("edit-num").show();
            } else if (str == 'hide') {
                $workInfo.find(".info").removeClass("edit-info").addClass("edit-no-info").show();
                $workInfo.find(".infoNo").removeClass("edit-num").addClass("edit-no-num").show();
                $workInfo.find(".edit-no-info").css("opacity", 1);
            }
        },

        init: function () {
            this.refreshPage();
            this.setBackTitle(this.backTitle);
            var _this = this,
                $editor = $('#wf-editor');

            $("#processRecord").on("click", "#assignInfo", function (e) {
                var x = e.clientX - 50;
                var y = e.clientY - 50;
                var $this = $(this);
                var data = $this.data("data");
                var createTime = $this.data("createTime");
                var html = '';

                for (var i = 0; i < data.length; i++) {
                    var item = data[i];
                    if (i == 0) {
                        html += '<li><span class="assignInfoCon ellipsis"><span>' + item.executor.old + '</span><em>转发</em><span>' + item.executor.new + '</span></span><time>' + _this.getRecordTime(createTime, item.assignTime.new) + '</time></li>';
                    } else if (i != data.length - 1) {
                        html += '<li><span class="assignInfoCon ellipsis"><span>' + item.executor.old + '</span><em>转发</em><span>' + item.executor.new + '</span></span><time>' + _this.getRecordTime(data[i - 1].assignTime.new, item.assignTime.new) + '</time></li>';
                    } else {
                        html += '<li><span class="assignInfoCon ellipsis"><span>' + item.executor.old + '</span><em>转发</em><span class="active">' + item.executor.new + '</span></span><time>' + _this.getRecordTime(data[i - 1].assignTime.new, item.assignTime.new) + '</time></li>';
                    }
                }

                $("#reocrdInfoUl").html(html);
                $("#reocrdInfoCon").css({
                    "left": x,
                    "top": y
                }).show();
            });

            $(document).on("click.toolTipsAssigned", function (e) {
                var $target = $(e.target);
                if (!(($target.closest("#reocrdInfoCon").length) || $target.closest("#assignInfo").length)) {
                    $("#reocrdInfoCon").hide();
                }
            });

            $('#notice_detail').on('click', '.btn-reply', function () {
                _this.addReply($editor.html()).done($editor.empty());
            }).on('click', '.star', function () {
                _this.changeStatus('/workflow/transaction/star/', null, function () {
                    this.model.record_detail.star = Math.abs(this.model.record_detail.star - 1);
                });
            }).on('click', '#workflow-finish', function () {
                _this.changeStatus('/workflow/complete/', 4, function () {
                    BackgroundWorkers.schedulerReporter ? BackgroundWorkers.schedulerReporter.postMessage({
                        type: 'fetchWorkflowData',
                        userId: AppConfig.userId
                    }) : $.noop();
                });
                _this.updateHistory('complete');
            }).on('click', '.glyphicon-repeat', function () {
                _this.changeStatus('/workflow/transaction/restart/', 2);
                _this.updateHistory('restart');
            }).on('click', '.glyphicon-play', function () {
                _this.changeStatus('/workflow/transaction/start/', 2);
                _this.updateHistory('start');
            }).on('click', '.glyphicon-pause', function () {
                _this.changeStatus('/workflow/transaction/pause/', 3);
                _this.updateHistory('pause');
            }).on('click', '.glyphicon-notVerified', function () {
                _this.changeStatus('/workflow/transaction/verified/', 5);
                _this.updateHistory('verified');
            }).on('click', '.glyphicon-edit', function () {
                var $workInfo = $("#workInfo").toggleClass('editing'),
                    $detailEditor = $("#detail-editor");
                if ($workInfo.hasClass('editing')) {
                    $detailEditor.height($detailEditor.get(0).scrollHeight)
                }
                _this.renderMemberList();
                _this.showEditable("show");
                $(".edit-info").css("opacity", 0);
            }).on('focus', '#changeDate,#dateIcon', function () {
                $("#changeDate").datetimepicker({
                    minView: "month",
                    autoclose: true,
                    todayBtn: true,
                    format: 'yyyy-mm-dd'
                });
            }).on('click', '#dateIcon', function () {
                $("#changeDate").focus();
            }).on('click', '.edit-btn-delete', function () {
                var wh = $(window).height();
                var top = (wh - 400) / 2;
                $(".modal-dialog").css({
                    'top': top
                });
                $("#isDelWorkflowWin").modal();
            }).on('click', '#wfConfrim', function () {
                WebAPI.post('/workflow/transaction/delete/', {
                    task_id: _this.id
                }).done(function () {
                    $(".description-section").css({
                        "text-align": "center",
                        "color": "red"
                    }).html(I18n.resource.workflow.main.WORK_ORDER_DELETED);
                }).always(function () {
                    I18n.fillArea($(ElScreenContainer));
                    $("#isDelWorkflowWin").modal('hide');
                })
            }).on('click', '.edit-btn-cancel', function () {
                $('#workInfo').removeClass('editing');
                _this.resetEditing();
                _this.showEditable("hide");
            }).on('click', '.edit-btn-save', function () {
                Spinner.spin($(".workflow-container")[0]);
                I18n.fillArea($(ElScreenContainer));
                WebAPI.post('/workflow/transaction/edit', _this.getSaveModel()).done(function (result) {
                    _this.updateViewModel();
                    _this.model.operations = result.operations;
                    _this.refreshOperations();
                    if (result.result === 'deassign') {
                        $('#workInfo').removeClass('editing').replaceWith(beopTmpl('recordDetailTmpl', _this.model));
                    } else if (result.result === 'success') {
                        $('#workInfo').removeClass('editing').replaceWith(beopTmpl('recordDetailTmpl', _this.model));
                        _this.renderStatus();
                    }
                    $(".edit-info").css("opacity", 1);
                }).always(function () {
                    _this.showEditable("hide");
                    I18n.fillArea($(ElScreenContainer));
                    Spinner.stop();
                });
            }).on('click', '#backTo', function () {
                if (!_this.backTitle) {
                    ScreenCurrent.close();
                    ScreenCurrent = new WorkflowNotice(this.id);
                    ScreenCurrent.show();
                } else if (_this.backContent) {
                    if (_this.backTitle == I18n.resource.workflow.pageInfo.TITLE_WO_MY) {
                        var ScreenFactory = WorkflowMine;
                        ScreenCurrent = new ScreenFactory();
                        ScreenCurrent.show();
                    } else {
                        $(ElScreenContainer).empty().append(_this.backContent);
                    }
                }
            });

            $('#wf-editor').wysiwyg();
            I18n.fillArea($(ElScreenContainer));
        }
    };

    return workflowNoticeDetail;
})();