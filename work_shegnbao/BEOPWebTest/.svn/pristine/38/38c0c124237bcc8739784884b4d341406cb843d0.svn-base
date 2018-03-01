/// <reference path="../lib/jquery-1.11.1.js" />
var workflowNoticeDetail = (function () {
    var memberListPromise = {};
    var i18 = null;

    function workflowNoticeDetail(id, backTitle, backContent) {
        this.id = id;
        this.backTitle = backTitle;
        this.backContent = backContent;
        if (i18 === null) {
            i18 = I18n.resource.workflow.main;
        }
        this.model = null;
    }

    workflowNoticeDetail.prototype = {
        show: function () {
            var _this = this;
            $.get("/static/views/workflow/notice_detail.html").done(function (resultHtml) {
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
                            type: 'value'
                        }
                    ],
                    series: arrSeriesTemp,
                    showLoading: {
                        text: 'loading',
                        effect: 'spin'
                    }
                };
                var myChart = echarts.init($('#error_line').get(0));
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
                    0:I18n.resource.workflow.urgencyLevel[0],
                    1:I18n.resource.workflow.urgencyLevel[1],
                    2:I18n.resource.workflow.urgencyLevel[2]
                };
                $('#workInfo').empty().replaceWith(beopTmpl('recordDetailTmpl', _this.model));
                if (_this.model.record_detail &&
                    _this.model.record_detail.list_value &&
                    _this.model.record_detail.list_value.length) {
                    $('.breakdown-row').show();
                    _this.renderChart(_this.model.record_detail);
                }

                _this.refreshOperations();
                _this.refreshReply();
                _this.renderStatus();

            }).always(function () {
                I18n.fillArea($(ElScreenContainer));
                Spinner.stop();
            });

        },
        refreshReply: function () {
            if (this.model.replyList) {
                $('#reply-content').empty().append(beopTmpl('replyContentTmpl', this.model));
            }
        },
        refreshOperations: function () {
            if (this.model.operations && this.model.operations.length) {
                $("#workOrderHistoryUl").html(beopTmpl('workOrderHistoryUlTmpl', this.model));
            }
        },

        addReply: function (detail) {
            var _this = this;
            Spinner.spin($(".workflow-container")[0]);
            var replyTime = new Date().format('yyyy-MM-dd HH:mm:ss')
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
            $('#taskStatus').replaceWith(beopTmpl('taskStatusTmpl', this.model.record_detail));
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
            $("#changeDate").attr('value', this.model.record_detail.due_date).datetimepicker({
                minView: "month",
                autoclose: true,
                todayBtn: true,
                format: 'yyyy-mm-dd'
            });
        },
        getSaveModel: function () {
            return {
                title: $('#title-editor').val(),
                transId: this.id,
                userId: AppConfig.userId,
                detail: $('#detail-editor').val(),
                executorID: $('#assignSelect option:selected').val(),
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
        showEditperface: function (str) {
            var $workInfo = $('#workInfo');
            if (str == 'show') {
                $workInfo.find(".info").removeClass("edit-no-info").addClass("edit-info");
                $workInfo.find(".infoNo").removeClass("edit-no-num").addClass("edit-num");
            } else if (str == 'hide') {
                $workInfo.find(".info").removeClass("edit-info").addClass("edit-no-info");
                $workInfo.find(".infoNo").removeClass("edit-num").addClass("edit-no-num");
            }
        },

        init: function () {
            this.refreshPage();
            this.setBackTitle(this.backTitle);
            var _this = this;
            var $workInfo = $("#workInfo"), $editor = $('#editor');
            $('#notice_detail').on('click', '.btn-reply', function () {
                _this.addReply($editor.html()).done($editor.empty());
            }).on('click', '.star', function () {
                _this.changeStatus('/workflow/transaction/star/', null, function () {
                    this.model.record_detail.star = Math.abs(this.model.record_detail.star - 1);
                });
            }).on('click', '#workflow-finish', function () {
                _this.changeStatus('/workflow/complete/', 4);
            }).on('click', '.glyphicon-repeat', function () {
                _this.changeStatus('/workflow/transaction/restart/', 2);
            }).on('click', '.glyphicon-play', function () {
                _this.changeStatus('/workflow/transaction/start/', 2);
            }).on('click', '.glyphicon-pause', function () {
                _this.changeStatus('/workflow/transaction/pause/', 3);
            }).on('click', '.glyphicon-edit', function () {
                var $workInfo = $("#workInfo").toggleClass('editing'),
                    $detailEditor = $("#detail-editor");
                if ($workInfo.hasClass('editing')) {
                    $detailEditor.height($detailEditor.get(0).scrollHeight)
                }
                _this.renderMemberList();
                _this.showEditperface("show");
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
                _this.showEditperface("hide");
            }).on('click', '.edit-btn-save', function () {
                Spinner.spin($(".workflow-container")[0]);

                I18n.fillArea($(ElScreenContainer));
                WebAPI.post('/workflow/transaction/edit', _this.getSaveModel()).done(function (result) {
                    if (result === 'deassign') {
                        _this.updateViewModel();
                        $('#workInfo').removeClass('editing').replaceWith(beopTmpl('recordDetailTmpl', _this.model));
                        var wh = $(window).height();
                        var top = (wh - 400) / 2;
                        $(".modal-dialog").css({
                            'top': top
                        });
                        $("#deassignWinInfo").text(i18.ASSIGNED + $("#assignSelect option:selected").text());
                        $("#deassignWin").modal();
                        setTimeout(function () {
                            $("#deassignWin").modal("hide");
                        }, 2000);

                    } else if (result === 'success') {
                        _this.updateViewModel();
                        $('#workInfo').removeClass('editing').replaceWith(beopTmpl('recordDetailTmpl', _this.model));
                        _this.renderStatus();
                    }

                }).always(function () {
                    _this.showEditperface("hide");
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

            $('#editor').wysiwyg();
            I18n.fillArea($(ElScreenContainer));
        }
    };

    return workflowNoticeDetail;
})();