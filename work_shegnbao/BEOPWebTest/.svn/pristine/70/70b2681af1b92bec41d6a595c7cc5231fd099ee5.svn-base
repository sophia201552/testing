/// <reference path="../lib/jquery-1.11.1.js" />


var workflowNoticeDetail = (function () {
    var colorList = ["#660099", "#0033FF", "#33FF00", "#FF3333", "#FFD306", "#FF00FF", "#8FB7B7", "#AFAF61"]

    function CurrentTime() {
        var now = new Date();

        var year = now.getFullYear();
        var month = now.getMonth() + 1;
        var day = now.getDate();

        var hh = now.getHours();
        var mm = now.getMinutes();
        var ss = now.getSeconds();

        var clock = year + "-";

        if (month < 10)
            clock += "0";

        clock += month + "-";

        if (day < 10)
            clock += "0";

        clock += day + " ";

        if (hh < 10)
            clock += "0";

        clock += hh + ":";
        if (mm < 10) clock += '0';
        clock += mm;

        clock += ":";
        if (ss < 10) clock += '0';
        clock += ss;

        return (clock);
    }

    function render_template_reply(replyUser, replyContent, replyTime) {
        WorkflowTool.getWorkflowTemplate('#wf-notice-detail-reply').done(function (template) {
            template.find('.avatar-name').text(replyUser);
            template.find('.latest-info-description').html(replyContent);
            template.find('.reply-date').text(replyTime);
            $('.discussion-content').append(template);
        })
    }

    function workflowNoticeDetail(id, backTitle, backContent) {
        this.id = id;
        this.backTitle = backTitle;
        this.backContent = backContent;
        this.idname_mapping;
    };
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

        refreshPage: function () {
            Spinner.spin($(".workflow-container")[0]);
            var _this = this;
            WebAPI.get('/workflow/transaction/notice/' + AppConfig['userId'] + '/' + this.id).done(function (result) {
                if (!result) {
                    return;
                }
                try {
                    var result_obj = JSON.parse(result);
                    var detail_reply = result_obj["detail_reply"];
                    var record_info = result_obj["list_record"];
                    var idname_mapping = result_obj["list_idname_maping"];
                    _this.idname_mapping = idname_mapping;
                    var notice_detail = $('#notice_detail');
                    if (record_info.length === 1) {
                        var record = record_info[0];
                        if (record.star === 1) {
                            $(".star", notice_detail).addClass('icon-star');
                        } else {
                            $(".star", notice_detail).addClass('icon-star-empty');
                        }
                        $(".notice", notice_detail).text(record.groupName);
                        $(".content", notice_detail).text(record.title);
                        $(".detail", notice_detail).text(record.detail);
                        $(".opteration-msg", notice_detail).text(WorkflowTool.getStatusText(record.statusValue));

                        $(".due-date", notice_detail).text(record.due_date);
                        var list_description = record.list_description;
                        var list_value = record.list_value;

                        if (!list_value || list_value.length === 0) {
                            $(".breakdown-row", notice_detail).hide();
                        } else {
                            if (list_description.length == list_value.length) {
                                var arrXAxis;
                                if (record.list_time.length > 0)
                                    arrXAxis = record.list_time[0].split(',');
                                var arrLegend = new Array();
                                var arrColor = new Array();
                                var arrSeriesTemp = new Array();
                                for (var i = 0; i < list_value.length; i++) {
                                    if (i < 8) {
                                        var item = list_value[i];
                                        var color = colorList[i];
                                        var itemName = list_description[i];
                                        arrLegend.push(itemName);
                                        arrColor.push(color);
                                        var arrDatas = new Array();
                                        var strDatas = item.split(",");
                                        for (var j = 0; j < strDatas.length; ++j) {
                                            arrDatas.push(parseFloat(strDatas[j]).toFixed(1));
                                        }
                                        arrSeriesTemp.push(
                                            {
                                                name: itemName,
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
                                    series: arrSeriesTemp
                                };
                                var myChart = echarts.init($('#error_line', notice_detail).get(0));
                                myChart.setOption(option);
                                window.onresize = myChart.resize;
                                //new Chart(ctx).Line(data, {pointDot: false});//生成图表
                            }
                        }


                    }
                    else {
                        $(".notice", notice_detail).text("no title");
                        $(".content", notice_detail).text("no detail");
                        $(".opteration-msg", notice_detail).text("no statusValue");
                        $(".assign-time", notice_detail)[0].innerHTML = "no assign time"
                    }
                    for (var n = 0, nLen = detail_reply.length; n < nLen; n++) {
                        for (var m = 0; m < idname_mapping.length; ++m) {
                            if (idname_mapping[m]['userid'] == detail_reply[n]['replyUserId']) {
                                render_template_reply(idname_mapping[m]['username'], detail_reply[n]['detail'], detail_reply[n]['replyTime']);
                                break;
                            }
                        }
                    }
                }
                catch (e) {

                }
            }).always(function () {
                Spinner.stop();
            });

        },

        init: function () {
            this.refreshPage();
            this.setBackTitle(this.backTitle);
            var _this = this;
            $('#notice_detail').on('click', '.btn-reply', function () {
                var reply_content = $('#editor').html();
                var user_id = AppConfig['userId'];
                Spinner.spin($(".workflow-container")[0]);
                for (var m = 0; m < _this.idname_mapping.length; ++m) {
                    if (_this.idname_mapping[m]['userid'] == user_id) {
                        //replytoid这一块没有设计，也不知道怎么实现，暂时用0替代
                        WebAPI.post('/workflow/transaction/insert_reply/', {
                            ofTransactionId: _this.id,
                            replyUserId: user_id,
                            replyTime: CurrentTime(),
                            detail: reply_content,
                            replyToId: 0
                        }).done(function (result) {
                            if (result) {
                                try {
                                    //var result_obj = JSON.parse(result);
                                    render_template_reply(_this.idname_mapping[m]['username'], reply_content, CurrentTime());
                                    $('#editor').html('');
                                } catch (e) {
                                    return false;
                                }
                            }
                            else {
                                return false;
                            }
                        }).always(function () {
                            Spinner.stop();
                        })
                        break;
                    }
                }
            }).on('click', '.star', function () {
                Spinner.spin($(".workflow-container")[0]);
                WebAPI.post('/workflow/transaction/star/', {
                    'trans_id': _this.id,
                    'user_id': AppConfig['userId']
                }).done(function (result) {
                    if (result === 'success') {
                        $('.star').toggleClass('icon-star').toggleClass('icon-star-empty ');
                    }
                }).always(function () {
                    Spinner.stop();
                })
            }).on('click', '#backTo', function () {
                if (!_this.backTitle) {
                    ScreenCurrent.close();
                    ScreenCurrent = new WorkflowNotice(this.id);
                    ScreenCurrent.show()
                } else if (_this.backContent) {
                    $(ElScreenContainer).empty().append(_this.backContent);
                }
            })

            $('#editor').wysiwyg();
        }
    }

    return workflowNoticeDetail;
})();