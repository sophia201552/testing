var DiagnosisLogHistory = (function () {
    var _this = undefined;

    function DiagnosisLogHistory(parent) {
        _this = this;
        this.parent = parent;
        this.m_tableInfo = [];
        this.m_bSortTimeAscend = false;
        this.m_bSortGradeAscend = false;
        this.m_bSortEquipAscend = false;
        this.m_bSortZoneAscend = false;
        this.m_bSortFaultAscend = false;
        this.m_bSortStatusAscend = false;
        this.isModal = false; //是否是控件
    }

    DiagnosisLogHistory.prototype = {
        show: function () {
            var _this = this;
            window.ElScreenContainer && Spinner.spin(ElScreenContainer);

            WebAPI.get("/static/views/observer/diagnosis/paneHistory.html").done(function (resultHtml) {
                trackEvent('诊断历史显示', 'Diagnosis.History.Show')
                var dialog = $('#dialogModal');
                //页面上没有dialog摸态框
                if (dialog.length < 1) {
                    $('body').append('<div class="modal fade" id="dialogModal" tabindex="-1" data-backdrop="static" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"><div class="modal-dialog modal-lg" id="dialogContent"></div></div>');
                    dialog = $('#dialogModal');
                }
                var $dialogContent = dialog.find('#dialogContent');
                $dialogContent.addClass('historyQueryModel').html(resultHtml).find('.modal-content').css({'height': document.body.scrollHeight - 40});
                //缓兵之计
                if (_this.parent && _this.parent.optionCss) {
                    $dialogContent.find('.modal-content,#btnDownload,#btnDownloadPDF').css(_this.parent.optionCss);
                }
                dialog.off('hidden.bs.modal').on('hidden.bs.modal', function (e) {
                    _this.close();
                    ScreenModal = null;
                    Spinner.stop();
                    $dialogContent.removeClass('historyQueryModel')
                    trackEvent('诊断历史隐藏', 'Diagnosis.History.Hide')
                }).modal({});
                Spinner.spin(dialog.find('.modal-body')[0]);

                _this.init();

                //init event 无需升级
                $("#datePickerLog").datetimepicker({
                    minView: "month",
                    autoclose: true,
                    todayBtn: true,
                    initialDate: new Date()
                });
                //下载excel和下载pdf按钮国际化
                $('#btnDownload').attr('title', i18n_resource.diagnosis.historyLog.DOWNLOAD_EXCEL);
                $('#btnDownloadPDF').attr('title', i18n_resource.diagnosis.historyLog.DOWNLOAD_PDF);

                var date = new Date();
                $("#txtLogDate").val(date.timeFormat(timeFormatChange('yyyy-mm-dd')));

                $('#thTime').click(function (e) {
                    _this.sortTable(0);
                });

                $('#thGrade').click(function (e) {
                    _this.sortTable(1);
                });

                $('#thEquip').click(function (e) {
                    _this.sortTable(2);
                });

                $('#thZone').click(function (e) {
                    _this.sortTable(3);
                });

                $('#thFault').click(function (e) {
                    _this.sortTable(4);
                });

                $('#thStatus').click(function (e) {
                    _this.sortTable(5);
                });

                $('#btnSearchFault').eventOn('click', function (e) {
                    trackEvent('诊断历史搜索', 'Diagnosis.History.Search')
                    _this.searchFaultInfo();
                }, '诊断历史记录搜索');

                $('#inputSearchFault').keyup(function (e) {
                    trackEvent('诊断历史搜索', 'Diagnosis.History.Search')
                    if (13 === e.keyCode) {
                        _this.searchFaultInfo();
                    }
                });

                $('#inputSearchFault').on('keydown keyup', function (e) {
                    _this.searchFaultChange();
                });

                $('#btnSearchDel').on('click', function (e) {
                    _this.removeSearchFault();
                });
                _this.attachEvent();
            });
        },

        close: function () {
            _this.m_tableInfo.forEach(function (m_tableInfo) {
                m_tableInfo && m_tableInfo.dispose && m_tableInfo.dispose();
                m_tableInfo = null;
            });

            _this.m_tableInfo = [];
            $('#dialogContent').empty();
        },

        init: function () {
            var _this = this;
            var now = new Date();
            var startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            this.refreshData(startTime, now);
            var timeFormat = timeFormatChange('yyyy-mm-dd');
            $("#datePickerLog").attr('data-date-format', timeFormat);
            $("#txtLogDate").eventOn('change', function (e) {
                var startTime = ($(this).val() + ' 00:00:00').toDate();
                var endTime = new Date(+startTime + 86400000);
                _this.refreshData(startTime, endTime);
                trackEvent('诊断历史时间切换', 'Diagnosis.History.Time.Toggle')
            }, '诊断历史记录切换时间');

            EventAdapter.on($("#btnLogPre"), 'click', function (e) {
                var endTime = ($("#txtLogDate").val() + ' 00:00:00').toDate();
                var preDay = new Date(+endTime - 86400000);
                $("#txtLogDate").val(preDay.timeFormat(timeFormat));
                _this.refreshData(preDay, endTime);
                trackEvent('诊断历史时间切换', 'Diagnosis.History.Time.Toggle')
            }, '诊断历史记录切换时间');

            $("#btnLogNext").eventOff('click').eventOn('click', function (e) {
                var startTime = ($("#txtLogDate").val() + ' 00:00:00').toDate();
                var nextDay = new Date(+startTime + 86400000);
                $("#txtLogDate").val(nextDay.timeFormat(timeFormat));
                startTime = ($("#txtLogDate").val() + ' 00:00:00').toDate();
                nextDay = new Date(+startTime + 86400000);
                _this.refreshData(startTime, nextDay);
            }, '诊断历史记录切换时间');

            $("#btnDownload").eventOff('click').eventOn('click', function () {
                //如果没有历史记录,不可以下载
                if ($('#tableNoticeHistory tbody tr').length === 0) {
                    alert(i18n_resource.diagnosis.historyLog.NO_LOG_HISTORY);
                    return;
                }
                var logTime = ($("#txtLogDate").val() + ' 00:00:00').toDate();
                var startTime = logTime.format("yyyy-MM-dd HH:mm:ss");
                //var endTime=now.format("yyyy-MM-dd HH:mm:ss");
                var endTime = new Date(+logTime + 86400000).format("yyyy-MM-dd HH:mm:ss");
                var language = localStorage.getItem('language');
                window.open('/diagnosis/downloadHistoryFault/' + AppConfig.projectId + '/' + startTime + '/' + endTime + '/' + language);
                trackEvent('诊断历史下载-Excel', 'Diagnosis.History.Download.Excel.Click')
            }, '诊断历史记录下载excel');

            $("#btnDownloadPDF").eventOff('click').eventOn('click', function () {
                if ($('#tableNoticeHistory tbody tr').length === 0) {
                    alert(i18n_resource.diagnosis.historyLog.NO_LOG_HISTORY);
                    return;
                }
                var reportTitle = i18n_resource.diagnosis.historyLog.TITLE;
                Spinner.spin(document.body);
                var arrHtml = [];
                //下载的时候隐藏掉处理人，响应时间，分享三列
                $('#tableNoticeHistory').find('.removeNode').hide();
                arrHtml.push($('#tableWrap').html());
                var promise = WebAPI.get('/static/views/share/reportWrap/pdfTemplate.html');
                // 在这里定义成功事件
                promise.done(function (html) {
                    var xhr, formData;
                    // 生成最终的 html
                    html = html.formatEL({
                        cover: BEOPUtil.getProjectImgByType(AppConfig.projectId, BEOPUtil.projectImgType.pdfCover),
                        title: reportTitle,
                        encoding: 'UTF-8',
                        entitiesHtml: arrHtml[0],
                        projName: AppConfig.projectShowName,
                        logo: BEOPUtil.getProjectImgByType(AppConfig.projectId, BEOPUtil.projectImgType.logo),
                        date: $('#txtLogDate').val(),
                        footerLeft: i18n_resource.report.reportWrap.GENERATED_BY_BEOP,
                        footerRight: localStorage.getItem("language") === "zh" ? "第 [page] 页 共[topage]页" : "Page [page] of [topage]"
                    });

                    // 表单数据
                    formData = new FormData();
                    formData.append('html', html);
                    formData.append('skin', 'default');

                    xhr = new XMLHttpRequest();
                    xhr.open('POST', '/admin/getShareReportWrapPDF');
                    xhr.responseType = 'arraybuffer';
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
                            lkPdfFile.download = reportTitle + ' ' + $('#txtLogDate').val() + '.pdf';

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

                }).fail(function (e) {
                    throw e;
                });
                $('#tableNoticeHistory').find('.removeNode').show();
                trackEvent('诊断历史下载-Pdf', 'Diagnosis.History.Download.Pdf.Click')
            }, '诊断历史记录下载PDF');
        },

        createWorkflowOrder: function (notice) {
            var wiInstance;
            var momentTime = notice.time.toDate();
            var back = function () {
                wiInstance = null;
            };
            trackEvent('诊断历史工单点击', 'Diagnosis.History.Workflow.Click')
            var insertCallback = function (taskModelInfo) {
                var taskTitle = (taskModelInfo && taskModelInfo.fields) ? taskModelInfo.fields.title : '';
                Alert.success(ElScreenContainer, I18n.resource.workflow.main.THE_WORK_ORDER + ' ' + taskTitle + ' ' + I18n.resource.workflow.main.IS_CREATED_SUCCESSFULLY).showAtTop(2000);
                var $faultCount = $('#btnWarningLog .badge');
                var faultCount = (function (txt) {
                    if (parseInt(txt).toString() != "NaN") {
                        return parseInt(txt);
                    }
                    return 0;
                }($faultCount.text()));
                //诊断故障信息个数减一, 同时楼层导航的故障个数减一
                if (faultCount > 0) {
                    var count = faultCount - 1;
                    count = count > 0 ? count : '';
                    $faultCount.text(count);
                    //诊断故障信息remove
                    $('[noticeid="' + notice.id + '"]').remove();
                    //楼层故障个数更新
                    if (notice.grade === 1) {
                        var $warningCount = $('#navFloor-' + AppConfig.zoneId).next('.warningCount');
                        $warningCount.text($warningCount.text() - 1);
                    } else if (notice.grade === 2) {
                        var $alertCount = $('#navFloor-' + AppConfig.zoneId).siblings('.alertCount');
                        $alertCount.text($alertCount.text() - 1);
                    }
                }
            };

            var equipmentName, zone, diagnosisZones, zoneID, equipmentsArr,
                chartEndTime;
            //报警后6小时的时间;
            var sixChartTime = new Date(new Date(momentTime).getTime() + 6 * 60 * 60 * 1000);

            if (sixChartTime.getTime() > new Date().getTime()) {
                chartEndTime = new Date().format('yyyy-MM-dd HH:mm:ss');
            } else {
                chartEndTime = new Date(sixChartTime).format('yyyy-MM-dd HH:mm:ss');
            }

            if (!_this.parent.result) {
                WebAPI.get('/diagnosis/getStruct/' + AppConfig.projectId).done(function (result) {
                    _this.parent.result = result;
                    equipmentsArr = _this.parent.result.equipments;
                    diagnosisZones = _this.parent.result.zones;

                    for (var i = 0; i < equipmentsArr.length; i++) {
                        if (notice.equipmentId === equipmentsArr[i].id) {
                            equipmentName = equipmentsArr[i].name;
                            zoneID = equipmentsArr[i].zoneId;
                            break;
                        }
                    }

                    for (var k = 0; k < diagnosisZones.length; k++) {
                        if (zoneID === diagnosisZones[k].id) {
                            zone = diagnosisZones[k].subBuildingName;
                            break;
                        }
                    }
                    wiInstance = new WorkflowInsert({
                        zone: zone,
                        equipmentName: equipmentName,
                        noticeId: notice.id,
                        title: notice.name,
                        detail: notice.description,
                        dueDate: new Date(+new Date() + 172800000).format('yyyy-MM-dd'), //结束时间为两天后
                        critical: notice.grade,
                        projectId: Number(notice.project),
                        chartPointList: notice.points,
                        chartQueryCircle: 'm5',
                        description: notice.description,
                        name: notice.name,
                        time: new Date(momentTime).format('yyyy-MM-dd HH:mm:ss'),
                        chartStartTime: new Date(new Date(momentTime).getTime() - 6 * 60 * 60 * 1000).format('yyyy-MM-dd HH:mm:ss'), //报警发生前半天
                        chartEndTime: chartEndTime  //报警发生六小时
                    });
                    wiInstance.show().submitSuccess(function (taskModelInfo, uploadFiles) {
                        insertCallback(taskModelInfo);
                        _this.close();
                        back();
                    }).cancel(function () {
                        back();
                    }).fail(function () {
                        Alert.danger(ElScreenContainer, I18n.resource.workflow.main.CREATE_WORKFLOW_FAILED).showAtTop(2000);
                    });
                    return true;
                })
            } else {
                equipmentsArr = _this.parent.result.equipments;
                diagnosisZones = _this.parent.result.zones;

                for (var i = 0; i < equipmentsArr.length; i++) {
                    if (notice.equipmentId === equipmentsArr[i].id) {
                        equipmentName = equipmentsArr[i].name;
                        zoneID = equipmentsArr[i].zoneId;
                        break;
                    }
                }

                for (var k = 0; k < diagnosisZones.length; k++) {
                    if (zoneID === diagnosisZones[k].id) {
                        zone = diagnosisZones[k].subBuildingName;
                        break;
                    }
                }
                wiInstance = new WorkflowInsert({
                    zone: zone,
                    equipmentName: equipmentName,
                    noticeId: notice.id,
                    title: notice.name,
                    detail: notice.description,
                    dueDate: new Date(+new Date() + 172800000).format('yyyy-MM-dd'), //结束时间为两天后
                    critical: notice.grade,
                    projectId: Number(notice.project),
                    chartPointList: notice.points,
                    chartQueryCircle: 'm5',
                    description: notice.description,
                    name: notice.name,
                    time: new Date(momentTime).format('yyyy-MM-dd HH:mm:ss'),
                    chartStartTime: new Date(new Date(momentTime).getTime() - 6 * 60 * 60 * 1000).format('yyyy-MM-dd HH:mm:ss'), //报警发生前六小时
                    chartEndTime: chartEndTime  //报警发生六小时
                });
                wiInstance.show().submitSuccess(function (taskModelInfo, uploadFiles) {
                    insertCallback(taskModelInfo);
                    this.close();
                    back();
                }).cancel(function () {
                    back();
                }).fail(function () {
                    Alert.danger(ElScreenContainer, I18n.resource.workflow.main.CREATE_WORKFLOW_FAILED).showAtTop(2000);
                });
                return true;
            }
        },

        refreshData: function (startTime, endTime) {
            var _this = this;

            startTime = startTime.format("yyyy-MM-dd HH:mm:ss");
            endTime = endTime.format("yyyy-MM-dd HH:mm:ss");

            WebAPI.get('/diagnosis/getHistoryFault/' + AppConfig.projectId + '/' + startTime + '/' + endTime).done(function (result) {
                _this.m_tableInfo = result;
                _this.data = result;
                _this.initTable(result);
            }).error(function (result) {
                var dialog = $('#dialogModal');
                dialog.find('.modal-body').html('Error query.');
            }).always(function () {

            });
        },

        initTable: function (data) {
            Spinner.spin(document.getElementById('tableNoticeHistory'));
            $('#tableNoticeHistory tbody').remove();
            var tbody = document.createElement('tbody');
            var $spanPoint;
            var feedbackComment;

            $('#tableNoticeHistory').append(tbody);
            if (data.length == 0) tbody.innerHTML = 'no history data';

            var tr, td, item, sb, equipment, zone, timeDif, strDesc, consequence;
            for (var i = 0, len = data.length; i < len; i++) {
                item = data[i];
                strDesc = item.description;
                consequence = item.Consequence ? item.Consequence : '';
                equipment = this.parent.dictEquipment[item.equipmentId];
                if (!equipment) continue;
                zone = this.parent.dictZone[equipment.zoneId];

                tr = document.createElement('tr');
                tr.id = 'diagHistory_' + item.id;
                tr.title = strDesc;
                //tr.innerHTML = sb.toString();
                tbody.appendChild(tr);

                //sb = new StringBuilder();
                //sb.append('<td>').append(item.time.toDate().format("yyyy-MM-dd HH:mm:ss")).append('</td>');
                $(tr).append($('<td></td>').html(item.time.toDate().timeFormat(timeFormatChange("yyyy-mm-dd hh:ii"))));
                switch (item.grade) {
                    case 0:
                        $(tr).append('<td><span class="badge" style="background-color: #5bc0de;" title="Grade">Normal</span></td>');
                        break; //sb.append
                    case 1:
                        $(tr).append('<td><span class="badge" style="background-color: #f0ad4e;" title="Grade">Alert</span></td>');
                        break; //sb.append
                    case 2:
                        $(tr).append('<td><span class="badge" style="background-color: #d9534f;" title="Grade">Fault</span></td>');
                        break; //sb.append
                    default:
                        $(tr).append('<td><span class="badge" style="background-color: #d9534f;" title="Grade">Unknown</span></td>');
                        break; //sb.append
                }
                $(tr).append($('<td></td>').html(equipment.name));
                $(tr).append($('<td></td>').html(zone.subBuildingName));
                $(tr).append($('<td></td>').html(item.name));
                $(tr).append($('<td></td>').html(consequence));
/*                switch (item.status) {
                    case '0':
                        $(tr).append('<td>Disable</td>');
                        break; //sb.append
                    case '1':
                        $(tr).append('<td>Delayed</td>');
                        break; //sb.append
                    case '2':
                        $(tr).append('<td>Realtime</td>');
                        break; //sb.append
                    default:
                        $(tr).append('<td></td>');
                        break;
                }*/

                //新版诊断只有两种状态1是发生，10是结束
                switch (item.status) {
                    case '1':
                        $(tr).append('<td></td>');
                        break; //sb.append
                    case '10':
                        $(tr).append('<td>Closed</td>');
                        break; //sb.append
                    default:
                        $(tr).append('<td></td>');
                        break;
                }                
                if (!item.resTime || item.resTime == null) {
                    $(tr).append($('<td class="removeNode" colspan="2" style="text-align:center;" i18n="diagnosis.historyLog.RESPONSE_CONTENT"></td>'));
                    switch (item.FeedBack) {
                        case 0:
                            feedbackComment = '<td class="removeNode"><i class="glyphicon glyphicon-comment feedbackComment unhandled" data-id="' + item.id + '"style="color: #909090";></i></td>';
                            break;
                        case 1:
                        case 2:
                            feedbackComment = '<td class="removeNode"><i class="glyphicon glyphicon-comment feedbackComment" data-id="' + item.id + '"style="color: #0078DC";></i></td>';
                            break;
                        case 3:
                            feedbackComment = '<td class="removeNode"><i class="glyphicon glyphicon-comment feedbackComment" data-id="' + item.id + '"style="color: #29BB4F";></i></td>';
                            break;
                        default:
                            break;
                    }
                    $(tr).append(feedbackComment);
                    $spanPoint = pointerClick(item);
                    $(tr).append($('<td class="removeNode someHide"></td>').append($spanPoint));
                } else {
                    timeDif = Math.floor(((new Date(item.resTime)).getTime() - (new Date(item.time)).getTime()) / (3600 * 1000)); //小時为单位 如果以天就*24
                    $(tr).append($('<td class="removeNode"></td>').html(item.executor));
                    $(tr).append($('<td class="removeNode"></td>').html(timeDif));

                    $(tr).append($('<td class="removeNode"></td>').html(''));
                }

                var arr = item.detail.toString().split(',');
                for (var j = 0; j < arr.length; j++) {
                    strDesc = strDesc.replace('{' + j.toString() + '}', '<span class="variable">' + arr[j] + '</span>');
                }

                function pointerClick(item) {
                    var $pointeer;
                    $pointeer = $('<span class="glyphicon glyphicon-share grow span-hover-pointer" data-toggle="modal" data-target="#my_fault_modal_"></span>').off('click').on('click', function () {
                        var equipment = _this.parent.dictEquipment[item.equipmentId];
                        var postItem = $.deepClone(item);
                        if (equipment && equipment.name) {
                            postItem.name = postItem.name + I18n.resource.diagnosis.LEFT_PARENTHESIS + equipment.name + I18n.resource.diagnosis.RIGHT_PARENTHESIS;
                        }
                        _this.createWorkflowOrder(postItem);
                    });
                    return $pointeer;
                }
            }
            Spinner.stop();
        },
        getItemById: function (id) {
            for (var i = 0, iLen = _this.data.length; i < iLen; i++) {
                if (_this.data[i].id === id) {
                    return _this.data[i];
                }
            }
        },
        attachEvent: function () {
            var projectName = localStorage.getItem('language') == 'zh' ? AppConfig.projectShowName : AppConfig.projectEnName;
            var detailPrefix = I18n.resource.workflow.main.PROJECT_NAME + projectName + "\n" +
                I18n.resource.workflow.main.ORDER_FEEDBACK_MSG;

            $('body').off('click.comment').on('click.comment', '.feedbackComment', function () {
                var item = _this.getItemById($(this).data('id'));
                var chartEndTime;
                //报警后6小时的时间;
                var sixChartTime = new Date(new Date(item.time).getTime() + 6 * 60 * 60 * 1000);

                if (sixChartTime.getTime() > new Date().getTime()) {
                    chartEndTime = new Date().format('yyyy-MM-dd HH:mm:ss');
                } else {
                    chartEndTime = new Date(sixChartTime).format('yyyy-MM-dd HH:mm:ss');
                }
                var obj = {
                    id: item.id,
                    FeedBackId: item.FeedBackId,
                    feedback: item.FeedBack,
                    commentRecord: true,
                    faultId: item.faultId,
                    title: I18n.resource.workflow.main.FEEDBACK_TITLE + item.name,
                    description: item.description,
                    detailPrefix: detailPrefix,
                    dueDate: new Date((new Date().getTime() + 2592000000 /*1000*60*60*24*30*/ )).format('yyyy-MM-dd HH:mm:ss'),
                    critical: item.grade,
                    projectId: Number(item.project),
                    chartPointList: item.points,
                    chartQueryCircle: 'm5',
                    chartStartTime: new Date(new Date(item.time.toDate()).getTime() - 6 * 60 * 60 * 1000).format('yyyy-MM-dd HH:mm:ss'),
                    chartEndTime: chartEndTime
                };
                if ($(this).hasClass('unhandled')) {
                    obj.feedbackUnhandled = true;
                }
                new WorkflowFeedBack(obj).show();
            })
        },
        fbCommentModalShow: function () {
            $('#dm-comment-modal').html(beopTmpl('point_reply_comment'));
            $('#dm-detail-funUl').hide();
            $('#showEditComment').hide();
            beop.model.dmModel.setPointId(stateMap.pointId);
            beop.view.replyList.configModel({
                reply_mode: beop.model.dmModel
            });
            beop.view.replyList.init($("#task-reply-list"))
        },

        sortTable: function (type) {
            $('#tableNoticeHistory tbody').html('');
            if (0 === type) {
                if (!_this.m_bSortTimeAscend) {
                    _this.m_tableInfo.sort(_this.sortTimeAscending);
                } else {
                    _this.m_tableInfo.sort(_this.sortTimeDescending);
                }
                _this.m_bSortTimeAscend = !_this.m_bSortTimeAscend;
            } else if (1 === type) {
                if (!_this.m_bSortGradeAscend) {
                    _this.m_tableInfo.sort(_this.sortGradeAscending);
                } else {
                    _this.m_tableInfo.sort(_this.sortGradeDescending);
                }
                _this.m_bSortGradeAscend = !_this.m_bSortGradeAscend;
            } else if (2 === type) {
                if (!_this.m_bSortEquipAscend) {
                    _this.m_tableInfo.sort(_this.sortEquipAscending);
                } else {
                    _this.m_tableInfo.sort(_this.sortEquipDescending);
                }
                _this.m_bSortEquipAscend = !_this.m_bSortEquipAscend;
            } else if (3 === type) {
                if (!_this.m_bSortZoneAscend) {
                    _this.m_tableInfo.sort(_this.sortZoneAscending);
                } else {
                    _this.m_tableInfo.sort(_this.sortZoneDescending);
                }
                _this.m_bSortZoneAscend = !_this.m_bSortZoneAscend;
            } else if (4 === type) {
                if (!_this.m_bSortFaultAscend) {
                    _this.m_tableInfo.sort(_this.sortFaultAscending);
                } else {
                    _this.m_tableInfo.sort(_this.sortFaultDescending);
                }
                _this.m_bSortFaultAscend = !_this.m_bSortFaultAscend;
            } else if (5 === type) {
                if (!_this.m_bSortStatusAscend) {
                    _this.m_tableInfo.sort(_this.sortStatusAscending);
                } else {
                    _this.m_tableInfo.sort(_this.sortStatusDescending);
                }
                _this.m_bSortStatusAscend = !_this.m_bSortStatusAscend;
            }
            _this.initTable(_this.m_tableInfo);
        },

        sortTimeAscending: function (a, b) {
            return new Date(a.time) - new Date(b.time);
        },

        sortTimeDescending: function (a, b) {
            return new Date(b.time) - new Date(a.time);
        },

        sortGradeAscending: function (a, b) {
            return a.grade - b.grade;
        },

        sortGradeDescending: function (a, b) {
            return b.grade - a.grade;
        },

        sortEquipAscending: function (a, b) {
            var equipA = _this.parent.dictEquipment[a.equipmentId];
            var equipB = _this.parent.dictEquipment[b.equipmentId];
            return (equipA.name).localeCompare(equipB.name);
        },

        sortEquipDescending: function (a, b) {
            var equipA = _this.parent.dictEquipment[a.equipmentId];
            var equipB = _this.parent.dictEquipment[b.equipmentId];
            return (equipB.name).localeCompare(equipA.name);
        },

        sortZoneAscending: function (a, b) {
            var equip = _this.parent.dictEquipment[a.equipmentId];
            var zoneA = _this.parent.dictZone[equip.zoneId];

            equip = _this.parent.dictEquipment[b.equipmentId];
            var zoneB = _this.parent.dictZone[equip.zoneId];

            return (zoneA.subBuildingName).localeCompare(zoneB.subBuildingName);
        },

        sortZoneDescending: function (a, b) {
            var equip = _this.parent.dictEquipment[a.equipmentId];
            var zoneA = _this.parent.dictZone[equip.zoneId];

            equip = _this.parent.dictEquipment[b.equipmentId];
            var zoneB = _this.parent.dictZone[equip.zoneId];

            return (zoneB.subBuildingName).localeCompare(zoneA.subBuildingName);
        },

        sortFaultAscending: function (a, b) {
            return (a.name).localeCompare(b.name);
        },

        sortFaultDescending: function (a, b) {
            return (a.name).localeCompare(b.name);
        },

        sortStatusAscending: function (a, b) {
            return a.status - b.status;
        },

        sortStatusDescending: function (a, b) {
            return b.status - a.status;
        },

        searchFaultInfo: function () {
            var searchVal = $('#inputSearchFault').val();
            if (null == searchVal || undefined == searchVal) {
                return;
            }

            $('#tableNoticeHistory tbody').html('');
            if ('' == searchVal) {
                _this.initTable(_this.m_tableInfo);
                return;
            }

            var item, equipment;
            var arrSuit = [];
            searchVal = searchVal.toLowerCase();
            for (var i = 0, len = _this.m_tableInfo.length; i < len; i++) {
                item = _this.m_tableInfo[i];
                equipment = this.parent.dictEquipment[item.equipmentId];
                if ((item.name && -1 != item.name.toLowerCase().indexOf(searchVal)) || (equipment && equipment.name && -1 != equipment.name.toLowerCase().indexOf(searchVal))) {
                    arrSuit.push(item);
                }
            }
            _this.initTable(arrSuit);
        },
        searchFaultChange: function () {
            var searchVal = $('#inputSearchFault').val();
            var delSearchVal = $('#btnSearchDel');
            if (!searchVal) {
                _this.removeSearchFault();
            } else {
                delSearchVal.show();
            }
        },
        removeSearchFault: function () {
            $('#inputSearchFault').val('');
            $('#tableNoticeHistory tbody').html('');
            $('#btnSearchDel').hide();
            _this.initTable(_this.m_tableInfo);
        },
        setIsModal: function (boolean) {
            this.isModal = boolean;
        },

        renderChart: function (record) {
            Spinner.spin($("#wf-add-person")[0]);
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

                        arrSeriesTemp.push({
                            name: list_description[i],
                            type: 'line',
                            itemStyle: {normal: {lineStyle: {type: 'solid'}}},
                            data: arrDatas
                        });
                    }
                }
                var option = {
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
                    xAxis: [{
                        name: "",
                        type: 'category',
                        boundaryGap: false,
                        axisLine: {onZero: false},
                        data: arrXAxis
                    }],
                    yAxis: [{
                        name: "",
                        type: 'value',
                        scale: true
                    }],
                    series: arrSeriesTemp,
                    showLoading: {
                        text: 'loading',
                        effect: 'spin'
                    }
                };
                var myChart = echarts.init($('#wf-fault-curve').get(0));
                myChart.setOption(option);
                window.onresize = myChart.resize;
                Spinner.stop();
            }
        }
    };
    return DiagnosisLogHistory;
})();