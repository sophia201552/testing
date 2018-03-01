/**
 * Created by win7 on 2015/10/21.
 */
var ProjectReport = (function(){
    var _this;
    function ProjectReport(data){
        _this = this;
        for (var i = 0;i <ProjectConfig.reportList.length; i++) {
            if (ProjectConfig.reportList[i].id == data.reportId) {
                this.reportDetail = ProjectConfig.reportList[i];
                break;
            }
        }
        this.initReportDate = data.reportDate?data.reportDate:new Date();
        this.reportDate = this.getReportVersion(this.reportDetail.reportType,this.initReportDate);
    }
    ProjectReport.navOptions = {
        top:
        '<div id="reportSelect" class="topNavTitle dropdown"></div>' +
        '<div id="btnWeChat" class="topNavRight glyphicon glyphicon-share-alt"></div>',
        bottom:true,
        backDisable:false,
        module:'report'
    };
    ProjectReport.prototype = {
        reportTypeMap: {
            daily: '0',
            monthly: '1',
            weekly: '2'
        },
        show:function(){
            var _this = this;
            $.ajax({url:'static/app/dashboard/views/project/projectReport.html'}).done(function(resultHTML){
                var $reportSelect = $('#reportSelect');
                var strReportSelect = new StringBuilder();
                strReportSelect.append('<button class="btn btn-default dropdown-toggle" type="button" id="ulReportSelect" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">');
                strReportSelect.append('  <span>' + _this.reportDetail.text + '</span>');
                //strReportSelect.append('  <span class="caret"></span>');
                strReportSelect.append('</button>');
                strReportSelect.append('<ul class="dropdown-menu" aria-labelledby="ulReportSelect">');
                for (var  i = 0;i < ProjectConfig.reportList.length;i++) {
                    if (ProjectConfig.reportList[i].id == _this.reportDetail.id)continue;
                    if (ProjectConfig.reportList[i].type == 'ReportScreen') {
                        strReportSelect.append('  <li class="zepto-ev" data-src="traditional" report-to="' + ProjectConfig.reportList[i].id + '">' + ProjectConfig.reportList[i].text + '</li>');
                    }else{
                        strReportSelect.append('  <li class="zepto-ev" data-src="factory" report-to="' + ProjectConfig.reportList[i].reportId + '">' + ProjectConfig.reportList[i].reportName + '</li>');

                    }
                }
                strReportSelect.append('</ul>');
                $reportSelect.html(strReportSelect.toString());
                $reportSelect.find('li').off('tap').on('tap',function(e){
                    var id = $(e.currentTarget).attr('report-to');
                    if(e.currentTarget.dataset.src == 'factory') {
                        router.to({
                            typeClass: ProjectFactoryReport,
                            data:{
                                reportId:id,
                                reportDate:_this.initReportDate
                            }
                        })
                    }else{
                        router.to({
                            typeClass: ProjectReport,
                            data:{
                                reportId:id,
                                reportDate:_this.initReportDate
                            }
                        })
                    }
                });
                $(ElScreenContainer).html(resultHTML);
                _this.init();
            })
        },
        init:function(){
            var _this = this;
            var $container = $('#containerReport');
            SpinnerControl.show();
            var tempDiv,styleFile,version;
            if(_this.reportDetail.reportType == _this.reportTypeMap.weekly){
                version = this.getWeekVersion();
            }else{
                version = _this.reportDate;
            }
            $container[0].innerHTML = '';
            WebAPI.get('/report/getReport/' + ProjectConfig.projectInfo.name_en + '/' + _this.reportDetail.reportFolder + '/' + version).done(function(result){
                tempDiv = document.createElement('div');
                tempDiv.innerHTML = result;
                styleFile = tempDiv.querySelector('link');
                tempDiv.querySelector('#beopReport').removeChild(styleFile);
                $container.html(tempDiv.innerHTML);
                var $reportUnit = $('#beopReport .report-unit');
                $reportUnit.find('.canvas-container').css({
                    height: '300px',
                    width: ($(ElScreenContainer).width() - 30) + 'px'
                });
                _this.reportScreen = new ReportScreen();
                _this.reportScreen.renderCharts($reportUnit);
                var $table = $('table');
                for(var  i= 0 ;i < $table.length; i++){
                    $table.eq(i).removeClass('table-striped');
                    $table[i].outerHTML = '<div class="tableContainer">' + $table[i].outerHTML + '</div>'
                }
            }).always(function(){
                SpinnerControl.hide();
            }).fail(function(){
                window.plugins && window.plugins.toast.show(I18n.resource.appDashboard.project.REPORT_AVAILABLE,'long','center')
            });
            _this.initReportSelect();
        },
        initReportSelect:function(){
            var _this = this;
            if (!this.reportDate)return;
            var strDate = this.reportDate.replace(/-/g,'/');
            if(strDate.split('/').length < 3)strDate+='/01';
            var date = new Date(strDate);
            $('#reportYear').html(date.getFullYear() + I18n.resource.appDashboard.project.REPORTYEAR);
            //if(this.reportDetail.reportType === this.reportTypeMap.daily || this.reportDetail.reportType === this.reportTypeMap.monthly) {
                $('#reportMonth').html((date.getMonth() + 1) + '<small>' + I18n.resource.appDashboard.project.REPORTMONTH + '</small>');
            //}
            if(this.reportDetail.reportType !== this.reportTypeMap.monthly) {
                $('#reportDay').html((date.getDate()) + '<small>' + I18n.resource.appDashboard.project.REPORTDAY + '</small>');
            }
            $('#divReportTime').off('tap').on('tap',function(){
                if(typeof datePicker == 'undefined')return;
                datePicker.show(
                    {
                        date:date?date:new Date(),
                        mode:'date',
                        todayText:AppConfig.language == 'zh'?'当前日期':'Current Date',
                        okText:AppConfig.language == 'zh'?'确定':'Done',
                        cancelText:AppConfig.language == 'zh'?'取消':'Cancel',
                        allowFutureDates:false,
                        doneButtonLabel:AppConfig.language == 'zh'?'确定':'Done',
                        cancelButtonLabel:AppConfig.language == 'zh'?'取消':'Cancel'
                    },
                    setDate,
                    function(){}
                )
            });
            function setDate(date){
                if (!date)return;
                _this.initReportDate = date;
                if(_this.reportDetail.reportType == _this.reportTypeMap.daily){
                     if(+new Date(date.format('yyyy/MM/dd 00:00:00')) >= +new Date(new Date().format('yyyy/MM/dd 00:00:00'))){
                        window.plugins && window.plugins.toast.show(I18n.resource.appDashboard.project.DAILYREPORT_LOST,'long','center');
                     }
                }else if(_this.reportDetail.reportType == _this.reportTypeMap.monthly){
                     if(+new Date(date.format('yyyy/MM/01')) >= +new Date(new Date().format('yyyy/MM/01'))){
                        window.plugins && window.plugins.toast.show(I18n.resource.appDashboard.project.MONTHREPORT_LOST,'long','center')
                     }
                }else{
                    if(_this.iso8601Week(date) >= _this.iso8601Week(new Date())){
                        window.plugins && window.plugins.toast.show(I18n.resource.appDashboard.project.WEEKREPORT_LOST,'long','center')
                    }
                }
                _this.reportDate = _this.getReportVersion(_this.reportDetail.reportType,date);
                _this.init();
            }
        },
        getReportVersion:function(reportInfo,reportDate){
            var thisDay,version;
            var reportType = reportInfo;
            var year,month,day;
            //this.reportDate = '2015-12-10';
            if(reportDate instanceof Date) {
                thisDay = reportDate;
            }else{
                thisDay = new Date();
            }
            if (reportType === this.reportTypeMap.daily || reportType == 'day') {
                //thisDay = new Date();
                if(+new Date(thisDay.format('yyyy/MM/dd 00:00:00')) >= +new Date(new Date().format('yyyy/MM/dd 00:00:00'))){
                    thisDay = new Date();
                    thisDay.setDate(thisDay.getDate() - 1);
                }
                version = thisDay.format('yyyy-MM-dd');
            }
            else if (reportType === this.reportTypeMap.monthly || reportType == 'month') {
                //thisDay = new Date();
                if(+new Date(thisDay.format('yyyy/MM/01')) >= +new Date(new Date().format('yyyy/MM/01'))){
                    thisDay = new Date();
                    thisDay.setMonth(thisDay.getMonth() - 1);
                }
                year = thisDay.getFullYear();
                month = thisDay.getMonth() + 1;
                version = year + '-' + StringUtil.padLeft(month, 2, '0');
            }else{
                var thisWeek = this.iso8601Week(thisDay);
                if (this.iso8601Week(new Date()) <= thisWeek) {
                    thisWeek = this.iso8601Week(new Date()) - 1;
                    thisDay = new Date();
                    thisDay = new Date(thisDay - 7 * 24 * 60 * 60 * 1000);
                }
                year = thisDay.getFullYear();
                version = DateUtil.getFirstDayOfWeek(year,thisWeek).format('yyyy-MM-dd');
            }
            return version;
        },
        getWeekVersion:function(){
            var thisDay = this.initReportDate;
            var thisWeek = this.iso8601Week(thisDay);
            if (this.iso8601Week(new Date()) <= thisWeek) {
                thisWeek = this.iso8601Week(new Date()) - 1;
                thisDay = new Date();
                thisDay = new Date(thisDay - 7 * 24 * 60 * 60 * 1000);
            }
            return thisDay.getFullYear() + '-' +thisWeek + '-w';
        },
        iso8601Week: function (date) {
            //现在我们的项目把周日当做第一天,所以iso标准将周一当做一周中的第一天
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
        close:function(){

        }
    };
    return ProjectReport;
})();
