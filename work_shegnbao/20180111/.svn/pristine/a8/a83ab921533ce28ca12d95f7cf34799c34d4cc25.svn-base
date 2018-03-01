/**
 * Created by win7 on 2015/10/21.
 */
var ProjectFactoryReport = (function() {
    var _this;

    function ProjectFactoryReport(data) {
        _this = this;
        AppConfig.isFactory = 0;
        if (data.reportList) {
            this.reportList = data.reportList;
        } else {
            this.reportList = ProjectConfig.reportList;
        }
        if (data.reportDetail) {
            this.reportDetail = data.reportDetail;
        } else {
            if (this.reportList instanceof Array) {
                for (var i = 0; i < this.reportList.length; i++) {
                    if (this.reportList[i].reportId == data.reportId) {
                        this.reportDetail = this.reportList[i];
                        break;
                    }
                }
            }
        }
        if (data.projectId != null) {
            for (var i = 0; i < ProjectConfig.projectList.length; i++) {
                if (data.projectId == ProjectConfig.projectList[i].id) {
                    this.projectInfo = ProjectConfig.projectList[i];
                    break;
                }
            }
        } else {
            this.projectInfo = ProjectConfig.projectInfo;
        }
        this.reportId = data.reportId;
        if (data.reportDate && new Date(data.reportDate) != 'Invalid Date') {
            this.initReportDate = new Date(data.reportDate)
        } else {
            this.initReportDate = new Date();
        }
        if (data.period != null) {
            this.reportDate = this.getReportVersion(data.period, this.initReportDate);
        } else {
            this.reportDate = this.getReportVersion(this.reportDetail.period, this.initReportDate);
        }
        _this.$detailPanel = undefined;
    }
    ProjectFactoryReport.navOptions = {
        top: '<div id="reportSelect" class="navTopItem middle dropdown"></div>',
        bottom: true,
        backDisable: false,
        module: 'report'
    };
    ProjectFactoryReport.prototype = {
        reportTypeMap: {
            daily: '0',
            monthly: '1',
            weekly: '2'
        },
        show: function() {
            var _this = this;

            var msg = [];
            try {
                msg = JSON.parse(localStorage.getItem('pushReport')).filter(function(item) { return item.reportId != _this.reportId });
                if (!msg) msg = [];
            } catch (e) {
                msg = [];
            }
            localStorage.setItem('pushReport', JSON.stringify(msg))
            var reportForCurProject = msg.filter(function(item) { return item.projectId == this.projectId })
            $('#btnReport .pushTip').text(reportForCurProject.length > 99 ? '99+' : reportForCurProject.length).hide();
            if (reportForCurProject.length == 0) {
                $('#btnReport .pushTip').text(0).hide();
            } else {
                $('#btnReport .pushTip').text(reportForCurProject.length > 99 ? '99+' : reportForCurProject.length).show();
            }

            if (!this.projectInfo) {
                //window.plugins && window.plugins.toast.show(I18n.resource.appDashboard.project.NO_REPORT_RIGHT, 'long', 'center')
                document.getElementById('reportSelect').innerHTML = '<button class="btn" style="background: none; border: none;color: #fff;outline-color: transparent;font-size: 1.8rem;box-shadow: none;">' + this.reportDetail.reportName + '</button>';
                ElScreenContainer.innerHTML = '<span style="display:inline-block;margin-top:10px;padding:0.75rem;font-size:1.4rem;color:white">' + I18n.resource.appDashboard.project.NO_REPORT_RIGHT + '</span>'
                    //router.back();
                return;
            }
            $.ajax({ url: 'static/app/dashboard/views/project/projectReport.html' }).done(function(resultHTML) {
                $(ElScreenContainer).html(resultHTML);

                document.getElementById('reportSelect').innerHTML = '<button class="btn btn-default dropdown-toggle" type="button" id="ulReportSelect" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">\
                <span>' + _this.reportDetail.reportName + '</span>\
                </button>';
                if (!_this.reportList || _this.reportList.length == 0) {
                    _this.getReportList().done(function() {
                        _this.setReportList()
                    })
                } else {
                    _this.setReportList()
                }

                _this.init();
            })
        },
        init: function() {
            SpinnerControl.show();
            this.initFactoryReport();
            _this.initReportSelect();
            this.attachEvent();
        },
        initStyle:function(){
            var style = document.createElement('style');
            var msg = AppConfig.language == 'zh'?'点击查看表格详情':'Click for table detail'
            style.innerHTML = '\
            #containerReport table>thead{display:none;}\
            #containerReport table>tbody{display:none;}\
            #containerReport table:after{\
                content:"'+ msg +'";\
                font-size: 14px;\
                font-weight: bold;\
                display: block;\
                text-align: center;\
                width: 90%;\
                position: relative;\
                left: 5%;\
                padding: 5px;\
                box-shadow: 0 0 5px 1px inset;\
            }\
            ';
            document.getElementById('containerReport').appendChild(style)
        },
        setReportList: function() {
            var _this = this;
            var $reportSelect = $('#reportSelect');
            var strReportSelect = new StringBuilder();
            // strReportSelect.append('<button class="btn btn-default dropdown-toggle" type="button" id="ulReportSelect" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">');
            // strReportSelect.append('  <span>' + _this.reportDetail.reportName + '</span>');
            // //strReportSelect.append('  <span class="caret"></span>');
            // strReportSelect.append('</button>');
            strReportSelect.append('<ul class="dropdown-menu" aria-labelledby="ulReportSelect">');
            for (var i = 0; i < _this.reportList.length; i++) {
                if (_this.reportList[i].reportId == _this.reportId) continue;
                if (_this.reportList[i].type == 'ReportScreen') {
                    strReportSelect.append('  <li class="zepto-ev" data-src="traditional" report-to="' + _this.reportList[i].id + '">' + _this.reportList[i].text + '</li>');
                } else {
                    strReportSelect.append('  <li class="zepto-ev" data-src="factory" report-to="' + _this.reportList[i].reportId + '">' + _this.reportList[i].reportName + '</li>');

                }
            }
            strReportSelect.append('</ul>');
            $reportSelect.html($reportSelect.html() + strReportSelect.toString());
            $reportSelect.find('li').off('tap').on('tap', function(e) {
                var id = $(e.currentTarget).attr('report-to');
                if (e.currentTarget.dataset.src == 'factory') {
                    router.to({
                        typeClass: ProjectFactoryReport,
                        data: {
                            reportId: id,
                            reportDate: _this.initReportDate,
                            reportList: _this.reportList,
                            projectId: _this.projectInfo.id
                        }
                    })
                } else {
                    router.to({
                        typeClass: ProjectReport,
                        data: {
                            reportId: id,
                            reportDate: _this.initReportDate,
                            reportList: _this.reportList,
                            projectId: _this.projectInfo.id
                        }
                    })
                }
            });
        },
        getReportList: function() {
            var $promise = $.Deferred();
            WebAPI.get("/get_plant_pagedetails/" + this.projectInfo.id + "/" + AppConfig.userId + "/" + AppConfig.language).done(function(result) {
                if (result.navItems && result.navItems.length > 0) {
                    _this.reportList = [];
                    var factoryReportList = result.navItems.filter(function(item) {
                        return item.type === 'FacReportWrapScreen';
                    });
                    var tranditionalReportList = result.navItems.filter(function(item) {
                        return item.type === 'ReportScreen';
                    });
                    _this.reportList = [].concat(tranditionalReportList);
                    if (factoryReportList.length > 0) {
                        _this.getFactoryReportList(factoryReportList).always(function() {
                            $promise.resolve();
                        });
                    } else {
                        $promise.resolve();
                    }
                } else {
                    $promise.resolve();
                    window.plugins && window.plugins.toast.show(I18n.resource.appDashboard.message.REPORT_ERR, 'short', 'center');
                }
            }).fail(function(e) {
                $promise.reject();
                //new Alert($(AlertContainer), "danger", I18n.resource.appDashboard.message.REPORT_ERR).show().close();
                window.plugins && window.plugins.toast.show(I18n.resource.appDashboard.message.REPORT_ERR, 'short', 'center');
            })
            return $promise.promise();
        },
        getFactoryReportList: function(reportWrapList) {
            var $promise = $.Deferred();
            var _this = this;
            if (!(reportWrapList.length && reportWrapList.length > 0)) {
                $promise.reject();
                return;
            }
            var reportPage;
            var arguments1 = [];
            var dictReportItem = {};
            AppConfig.isFactory = 0;
            for (var i = 0; i < reportWrapList.length; i++) {
                reportPage = reportWrapList[i];
                dictReportItem[reportPage.id] = [];
                arguments1.push(getFactoryReport(reportPage))
            }
            $.when.apply(this, arguments1).always(function() {
                Object.keys(dictReportItem).forEach(function(wrap) {
                    _this.reportList = [].concat(dictReportItem[wrap], _this.reportList);
                });
                $promise.resolve();
            });

            function getFactoryReport(page) {
                return WebAPI.get('/factory/reportWrap/' + AppConfig.isFactory + '/' + page.id).done(function(index) {
                    dictReportItem[page.id] = index.list;
                })
            }
            return $promise.promise();
        },

        initFactoryReport: function() {
            var _this = this;
            api.report.renderReport(document.getElementById('containerReport'), this.reportId, { date: this.reportDate, onlySummary: false }).always(function() {
                $('#containerReport').addClass('isFactory');
                _this.initStyle();
                SpinnerControl.hide();
            });
        },
        initReportSelect: function() {
            var _this = this;
            if (!this.reportDate) return;
            var strDate = this.reportDate;
            if (strDate.split('-').length < 3) strDate += '-01';
            var date = new Date(+moment(strDate));
            if (AppConfig.language == 'en') {
                $('#reportYear').html(date.getFullYear() + I18n.resource.appDashboard.project.REPORTYEAR);
                //if(this.reportDetail.period === 'day' || this.reportDetail.period === 'month') {
                $('#reportMonth').html(date.timeFormat('MM', 'en'));
                //}
                if (this.reportDetail.period != 'month') {
                    $('#reportDay').html((date.getDate()) + '<small>' + I18n.resource.appDashboard.project.REPORTDAY + '</small>');
                }
            } else {
                $('#reportYear').html(date.getFullYear() + I18n.resource.appDashboard.project.REPORTYEAR);
                //if(this.reportDetail.period === 'day' || this.reportDetail.period === 'month') {
                $('#reportMonth').html((date.getMonth() + 1) + '<small>' + I18n.resource.appDashboard.project.REPORTMONTH + '</small>');
                //}
                if (this.reportDetail.period != 'month') {
                    $('#reportDay').html((date.getDate()) + '<small>' + I18n.resource.appDashboard.project.REPORTDAY + '</small>');
                }

            }
            $('#divReportTime').off('tap').on('tap', function() {
                if (typeof datePicker == 'undefined') return;
                datePicker.show({
                        date: date ? date : new Date(),
                        mode: 'date',
                        todayText: AppConfig.language == 'zh' ? '当前日期' : 'Current Date',
                        okText: AppConfig.language == 'zh' ? '确定' : 'Done',
                        cancelText: AppConfig.language == 'zh' ? '取消' : 'Cancel',
                        allowFutureDates: false,
                        doneButtonLabel: AppConfig.language == 'zh' ? '确定' : 'Done',
                        cancelButtonLabel: AppConfig.language == 'zh' ? '取消' : 'Cancel'
                    },
                    setDate,
                    function() {}
                )
            });

            function setDate(date) {
                if (!date) return;
                _this.initReportDate = date;
                if (_this.reportDetail.period == 'day') {
                    if (+new Date(date.format('yyyy/MM/dd 00:00:00')) >= +new Date(new Date().format('yyyy/MM/dd 00:00:00'))) {
                        window.plugins && window.plugins.toast.show(I18n.resource.appDashboard.project.DAILYREPORT_LOST, 'long', 'center')
                    }
                } else if (_this.reportDetail.period == 'month') {
                    if (+new Date(date.format('yyyy/MM/01')) >= +new Date(new Date().format('yyyy/MM/01'))) {
                        window.plugins && window.plugins.toast.show(I18n.resource.appDashboard.project.MONTHREPORT_LOST, 'long', 'center')
                    }
                } else {
                    if (_this.iso8601Week(date) >= _this.iso8601Week(new Date())) {
                        window.plugins && window.plugins.toast.show(I18n.resource.appDashboard.project.WEEKREPORT_LOST, 'long', 'center')
                    }
                }
                _this.reportDate = _this.getReportVersion(_this.reportDetail.period, date);
                _this.init();
            }
        },
        getReportVersion: function(reportInfo, reportDate) {
            var thisDay, version;
            var reportType = reportInfo;
            var year, month, day;
            //this.reportDate = '2015-12-10';
            if (reportDate instanceof Date) {
                thisDay = reportDate;
            } else {
                thisDay = new Date();
            }
            if (reportType === this.reportTypeMap.daily || reportType == 'day') {
                //thisDay = new Date();
                if (+moment(thisDay.format('yyyy-MM-dd 00:00:00')) >= +moment(new Date().format('yyyy-MM-dd 00:00:00'))) {
                    thisDay = new Date();
                    thisDay.setDate(thisDay.getDate() - 1);
                }
                version = thisDay.format('yyyy-MM-dd');
            } else if (reportType === this.reportTypeMap.monthly || reportType == 'month') {
                //thisDay = new Date();
                if (+moment(thisDay.format('yyyy-MM-01')) >= +moment(new Date().format('yyyy-MM-01'))) {
                    thisDay = new Date();
                    thisDay.setMonth(thisDay.getMonth() - 1);
                }
                year = thisDay.getFullYear();
                month = thisDay.getMonth() + 1;
                version = year + '-' + StringUtil.padLeft(month, 2, '0');
            } else {
                var thisWeek = this.iso8601Week(thisDay);
                if (this.iso8601Week(new Date()) <= thisWeek) {
                    thisWeek = this.iso8601Week(new Date()) - 1;
                    thisDay = new Date();
                    thisDay = new Date(thisDay - 7 * 24 * 60 * 60 * 1000);
                }
                year = thisDay.getFullYear();
                version = DateUtil.getFirstDayOfWeek(year, thisWeek).format('yyyy-MM-dd');
            }
            return version;
        },
        iso8601Week: function(date) {
            //现在我们的项目把周日当做第一天,但是iso标准将周一当做一周中的第一天
            //var addOneDayDate = new Date(new Date(date).getTime() + 2 * 24 * 60 * 60 * 1000);
            var addOneDayDate = new Date(date);
            var time,
                checkDate = new Date(addOneDayDate.getTime());

            // Find Thursday of this week starting on Monday
            checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7));

            time = checkDate.getTime();
            checkDate.setMonth(0); // Compare with Jan 1
            checkDate.setDate(1);
            return Math.floor(Math.round((time - checkDate) / 86400000) / 7) + 1;
        },
        attachEvent: function() {
            var _this = this;
            _this.$detailPanel = $('#wrapComponentDetail');
            if (_this.$detailPanel.length == 0) {
                _this.$detailPanel = $('<div id="wrapComponentDetail">\
                    <!--<div class="backdrop zepto-ev"></div>-->\
                    <div class="wrapDetailContent">\
                        <div class="detailContent"></div>\
                    </div>\
                    <div class="btnBlur zepto-ev"><span class="glyphicon glyphicon-remove"></span></div>\
                </div>');
                document.body.appendChild(_this.$detailPanel[0]);
            }
            var container = document.getElementById('containerReport');

            $(container).on('click', 'table', function(e) {
                _this.setDetailPanel(e.currentTarget.outerHTML)
            });

            _this.$detailPanel.find('.btnBlur').on('tap', function(e) {
                e.stopPropagation();
                _this.$detailPanel.removeClass('focus')
            });
            _this.attachDetailPanelEvent();
        },
        setEchartsEvent: function() {
            $('')
        },
        setDetailPanel: function(html) {
            var _this = this;
            var $content = _this.$detailPanel.find('.detailContent');
            $content.html(html).css({ 'left': 0, 'top': 0 ,'transform':'scale(1)'});
            _this.$detailPanel.addClass('focus')
            if ($content.find('thead').length > 0 ){
                var $content = _this.$detailPanel.find('.detailContent');
                var $wrapContent = _this.$detailPanel.find('.wrapDetailContent')
                var border = {
                    x: $wrapContent[0].offsetWidth - $content[0].offsetWidth,
                    y: $wrapContent[0].offsetHeight - $content[0].offsetHeight
                };
                if (border.y > 0 ){
                    $content.find('.theadInView').remove();
                }else{
                    $content[0].innerHTML += ('<table class="theadInView">' + $content.find('table')[0].innerHTML +'</table>')
                }
            }
        },
        attachDetailPanelEvent: function() {
            var $content = _this.$detailPanel.find('.detailContent');
            var $wrapContent = _this.$detailPanel.find('.wrapDetailContent')
            var initPos = {
                x: $content[0].offsetLeft,
                y: $content[0].offsetTop
            };
            var border = {
                x: $wrapContent[0].offsetWidth - $content[0].offsetWidth,
                y: $wrapContent[0].offsetHeight - $content[0].offsetHeight
            };
            var delPos = {
                x: 0,
                y: 0
            };
            var pos = {
                x: initPos.x,
                y: initPos.y
            };
            var firstTouch = {
                x: 0,
                y: 0
            };
            var firstDoubleTouch = {
                x: 0,
                y: 0
            }
            $wrapContent.on('touchstart', function(e) {
                e.preventDefault();
                e.stopPropagation();
                border = {
                    x: $wrapContent[0].offsetWidth - $content[0].offsetWidth,
                    y: $wrapContent[0].offsetHeight - $content[0].offsetHeight
                };
                initPos = {
                    x: $content[0].offsetLeft,
                    y: $content[0].offsetTop
                };
                firstTouch = {
                    x: e.originalEvent.touches[0].clientX,
                    y: e.originalEvent.touches[0].clientY,
                    time: e.originalEvent.timeStamp
                };
                if (e.originalEvent.touches.length > 1) {
                    firstDoubleTouch = {
                        x: Math.abs(e.originalEvent.touches[0].clientX - e.originalEvent.touches[1].clientX),
                        y: Math.abs(e.originalEvent.touches[0].clientY - e.originalEvent.touches[1].clientY)
                    }
                    _this.resizeDetail(e.originalEvent, firstDoubleTouch)
                }
            });
            $wrapContent.on('touchmove', function(e) {
                e.preventDefault();
                e.stopPropagation();
                if (e.originalEvent.touches.length > 1) {
                    _this.resizeDetail(e.originalEvent, firstDoubleTouch)
                } else {
                    delPos = {
                        x: e.originalEvent.touches[0].clientX,
                        y: e.originalEvent.touches[0].clientY
                    };
                    pos = {
                        x: initPos.x + delPos.x - firstTouch.x,
                        y: initPos.y + delPos.y - firstTouch.y
                    };
                }
                _this.setMoveBorder(pos, border);
                _this.setFixedComponent($content.find('.theadInView'),null,pos.y)
                $content[0].style.left = pos.x + 'px';
                $content[0].style.top = pos.y + 'px';
            });
            $wrapContent.on('touchend', function(e) {
                e.preventDefault();
                e.stopPropagation();
                if (e.originalEvent.touches > 0) {
                    _this.resizeDetail(e.originalEvent, firstDoubleTouch)
                } else {
                    pos = {
                        x: initPos.x + delPos.x - firstTouch.x,
                        y: initPos.y + delPos.y - firstTouch.y
                    };
                    initPos = {
                        x: pos.x,
                        y: pos.y
                    };
                    delPos = {
                        x: 0,
                        y: 0
                    };
                    firstTouch = {
                        x: 0,
                        y: 0
                    };
                }
                _this.setMoveBorder(pos, border);
                _this.setFixedComponent($content.find('.theadInView'),null,pos.y)
                $content[0].style.left = pos.x + 'px';
                $content[0].style.top = pos.y + 'px';
            });
            $wrapContent.on('touchcancel', function(e) {
                e.preventDefault();
                e.stopPropagation();
                if (e.originalEvent.touches > 0) {
                    _this.resizeDetail(e.originalEvent, firstDoubleTouch)
                } else {
                    pos = {
                        x: initPos.x + delPos.x - firstTouch.x,
                        y: initPos.y + delPos.y - firstTouch.y
                    };
                    initPos = {
                        x: pos.x,
                        y: pos.y
                    };
                    delPos = {
                        x: 0,
                        y: 0
                    };
                }
                _this.setMoveBorder(pos, border)
                _this.setFixedComponent($content.find('.theadInView'),null,pos.y)
                $content[0].style.left = pos.x + 'px';
                $content[0].style.top = pos.y + 'px';
            })
        },
        resizeDetail: function(ev, first) {
            return;
            var scale = 1;
            var del = {
                x: Math.abs(ev.touches[0].clientX - ev.touches[1].clientX),
                y: Math.abs(ev.touches[0].clientY - ev.touches[1].clientY)
            }
            var cernter = {
                x:del.x / 2,
                y:del.y / 2
            }
            switch (ev.type) {
                case 'touchstart':

                    break;
                case 'touchmove':
                    scale = Math.sqrt(first.x * first.x + first.y * first.y) / Math.sqrt(del.x * del.x + del.y * del.y)
                    break;
                case 'touchend':
                    break;
                case 'touchcancel':
                    break;
            }
            return scale
        },
        setFixedComponent:function($dom,x,y){
            if (!$dom || $dom.length == 0 )return;
            if(!isNaN(x))$dom.css({left:-x + 'px'})
            if(!isNaN(y))$dom.css({top:-y + 'px'})
        },
        setMoveBorder: function(pos, border) {
            if (border.x > 0) {
                pos.x < 0 && (pos.x = 0)
                pos.x > border.x && (pos.x = border.x)
            } else {
                pos.x > 0 && (pos.x = 0)
                pos.x < border.x && (pos.x = border.x)
            }
            if (border.y > 0) {
                pos.y < 0 && (pos.y = 0)
                pos.y > border.y && (pos.y = border.y)
            } else {
                pos.y > 0 && (pos.y = 0)
                pos.y < border.y && (pos.y = border.y)
            }
            return pos;
        },
        close: function() {
            _this.$detailPanel.remove()
        }
    };
    return ProjectFactoryReport;
})();