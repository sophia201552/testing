/// <reference path="../lib/jquery-1.11.1.js" />


var WorkflowReport = (function () {
    function WorkflowReport() {
        this.projData = undefined;
        this.userData = undefined;
        this.selProj = -1;
        this.selUser = AppConfig.userId;
        this.showProj = 5;
        this.showUser = 5;
        this.nWeekBefore = 0;
    };


    function GetNthWeek(date) {
        var onejan = new Date(date.getFullYear(), 0, 1);
        return Math.ceil((((date - onejan) / 86400000) + ((7 + onejan.getDay() - 1) % 7)) / 7);
        //getDay()  count from Sunday
    }


    WorkflowReport.prototype = {
        show: function () {
            var _this = this;
            $.get("/static/views/workflow/report.html").done(function (resultHtml) {
                $(ElScreenContainer).html(resultHtml);
                _this.init();
                I18n.fillArea($(ElScreenContainer));
            });
        },

        close: function () {
        },

        getData: function () {
            this.projData = {};
            this.userData = {};
            Spinner.spin($("#week-report")[0]);
            var _this = this;

            WebAPI.post("/workflow_get_week_report_statics", {
                projid: _this.selProj,
                userid: _this.selUser,
                weekbefore: _this.nWeekBefore
            }).done(function (result) {
                var data = JSON.parse(result);
                _this.renderData(data);
                Spinner.stop();
            }).done(function () {
                I18n.fillArea($(ElScreenContainer));
            });
        },
        init: function () {
            var _this = this;
            this.getData();

            $(".workflow-efficiency-table-footer").click(function () {
                _this.showProj *= 2;
                _this.getData();
            })

            $(".loading-more").click(function () {
                _this.showUser *= 2;
                _this.getData();
            })

            $(".last-week").click(function () {
                _this.nWeekBefore += 1;
                _this.getData();
            })

            $(".next-week").click(function () {
                if (_this.nWeekBefore > 0) {
                    _this.nWeekBefore -= 1;
                    _this.getData()
                }
            })
        },

        renderData: function (data) {

            var divFdate = $('.report-summary-row .sd-first-date')
            var divSdate = $('.report-summary-row .sd-second-date')

            var now = new Date()
            var weekbefore_ms = this.nWeekBefore * 7 * (24 * 3600 * 1000);
            now = new Date(Date.parse(now) - weekbefore_ms);

            var mili_sec = ((7 + now.getDay() - 1) % 7) * (24 * 3600 * 1000)
            var begin = new Date(now - mili_sec)
            mili_sec = ((7 - now.getDay()) % 7) * (24 * 3600 * 1000);
            var end = new Date(Date.parse(now) + mili_sec);
            if (I18n.type === 'zh') {
                divSdate.text(I18n.resource.workflow.report.TITLE_TIME3.format((begin.getMonth() + 1) + I18n.resource.workflow.report.MONTH,
                    begin.getDate(), (end.getMonth() + 1) + I18n.resource.workflow.report.MONTH, end.getDate()));
            } else {
                divSdate.text(I18n.resource.workflow.report.TITLE_TIME3.format(DateUtil.getMonthName(begin.getMonth(), I18n.type),
                    begin.getDate(), DateUtil.getMonthName(end.getMonth(), I18n.type), end.getDate()));
            }


            var weeknow;
            var nownow = new Date();
            if (nownow.getFullYear() == begin.getFullYear()) {
                weeknow = begin;
            }
            else {
                weeknow = end;
            }
            var year = weeknow.getFullYear();
            var weekth = GetNthWeek(weeknow).toString();
            divFdate.text(I18n.resource.workflow.report.TITLE_TIME2.format(year, weekth))

            var divPrj = $('.workflow-efficiency-table-body')
            divPrj.children().remove();

            var projdata = data['projdata']
            for (var i = 0; i < projdata.length && i < this.showProj; i++) {
                var item = projdata[i]
                var done = parseInt(item[1]);
                var undone = parseInt(item[2]);
                var total = done + undone;
                var percent = done / (done + undone) * 100.0;
                percent = percent.toFixed(1)
                if ($.isArray(item[3])) {
                    var userList = item[3].join('  ');
                } else {
                    var userList = item[3];
                }

                divPrj.append($('<div class="row workflow-report-table-row"><div class="col-xs-3">' + item[0]
                + '</div><div class="col-xs-2">' + total
                + '</div> <div class="col-xs-2">' + undone
                + '</div><div class="col-xs-2">' + percent + '%'
                + '</div> <div class="col-xs-3">' + userList
                + '</div></div>'));
            }

            var divMember = $('.workflow-report-memeber');
            divMember.children().remove();
            var userdata = data['user_data'];
            var transaction = data['transaction'];

            var numUser = 0;
            for (var key in userdata) {
                if (userdata[key]['done'] != 0 || userdata[key]['undone'] != 0) {
                    numUser++;
                    var name = userdata[key]['name']
                    var done = userdata[key]['done']
                    var undone = userdata[key]['undone']
                    var total = undone + done;
                    var divList = $('<div class="col-md-10 col-md-offset-1" id = "week-report-member"><div class="row"><div class="description col-md-11">'
                    + '<div class="icon col-md-1" style="background: url(/static/images/login_feature_icons.jpg) no-repeat 0 0;"></div>'
                    + '<div class="text">' + name
                    + '</div><div class="text"><span i18n="workflow.report.ALL_DEAL_NUM"></span>：' + total
                    + '</div><div class="text"><span i18n="workflow.report.FINISH_NUM"></span>：' + done
                    + '</div><div class="text"><span i18n="workflow.report.UNFINISH"></span>：' + undone
                    + '</div></div></div>');

                    // var d = divMember.find('.selector:n-child(3)')
                    // var divList = $('#week-report-member');
                    //divList = divList.last();
                    var doneList = userdata[key]['donelist'];
                    for (var i = 0; i < doneList.length; i++) {
                        var item = transaction[doneList[i]];
                        divList.append($('<div class="row item-row"><div class="col-md-12 content">'
                        + '<div class="col-md-3 name" title="' + item['title'] + '">' + item['title']
                        + '</div><div class="col-md-5 text item-text-color" title="' + item['detail'] + '">' + item['detail']
                        + '</div><div class="col-md-2 text item-text-color" title="resolved date">' + (item['complete_time'] ? (new Date(item['complete_time']).format('yyyy-MM-dd')).toLocaleString(I18n.type ? I18n.type : 'zh') : '')
                        + '</div><div class="col-md-2 text item-text-color"><span i18n="workflow.report.FINISH"></span></div></div></div>'))
                    }

                    var undoneList = userdata[key]['undonelist'];
                    for (var i = 0; i < undoneList.length; i++) {
                        var item = transaction[undoneList[i]];
                        divList.append($('<div class="row item-row"><div class="col-md-12 content">'
                        + '<div class="col-md-3 name" title="' + item['title'] + '">' + item['title']
                        + '</div><div class="col-md-5 text item-text-color" title="' + item['detail'] + '">' + item['detail']
                        + '</div><div class="col-md-2 text item-text-color" title="deadline">' + (item['duedate'] ? (new Date(item['duedate']).format('yyyy-MM-dd')).toLocaleString(I18n.type ? I18n.type : 'zh') : '')
                        + '</div><div class="col-md-2 text item-text-color"><span i18n="workflow.report.UNFINISH"></span></div></div></div>'))
                    }

                    divMember.append(divList);
                }

                if (numUser >= this.showUser) {
                    break;
                }
            }
        },

        updateSelUser: function (memberid) {
            if (!memberid) {
                memberid = -1;
            }
            this.selUser = memberid;
            this.getData();
        },

        updateSelPrj: function (projid) {
            if (!projid) {
                projid = -1;
            }
            this.selProj = projid;
            this.getData();
        }


    }

    return WorkflowReport;
})();