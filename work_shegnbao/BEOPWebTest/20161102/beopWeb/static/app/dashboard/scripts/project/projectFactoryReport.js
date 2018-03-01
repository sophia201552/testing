/**
 * Created by win7 on 2015/10/21.
 */
var ProjectFactoryReport = (function(){
    var _this;
    function ProjectFactoryReport(data){
        _this = this;
        if(data && data.projectId){
            ProjectConfig.projectId = data.projectId;
        }
        if (data && data.reportDate){
            ProjectConfig.reportDate = data.reportDate;
        }else if(ProjectConfig.reportDate instanceof Date){
                     
        }else{
            ProjectConfig.reportDate = new Date();
        }
    }
    ProjectFactoryReport.navOptions = {
        top:
        '<div id="reportSelect" class="topNavTitle dropdown"></div>' +
        '<div id="btnWeChat" class="topNavRight glyphicon glyphicon-share-alt"></div>',
        bottom:true,
        backDisable:false,
        module:'project'
    };
    ProjectFactoryReport.prototype = {
        reportTypeMap: {
            daily: '0',
            monthly: '1',
            weekly: '2'
        },
        show:function(){
            $.ajax({url:'static/app/dashboard/views/project/projectReport.html'}).done(function(resultHTML){
                var $reportSelect = $('#reportSelect');
                var strReportSelect = new StringBuilder();
                strReportSelect.append('<button class="btn btn-default dropdown-toggle" type="button" id="ulReportSelect" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">');
                strReportSelect.append('  <span>' + ProjectConfig.reportDetail.reportName + '</span>');
                strReportSelect.append('  <span class="caret"></span>');
                strReportSelect.append('</button>');
                strReportSelect.append('<ul class="dropdown-menu" aria-labelledby="ulReportSelect">');
                for (var  i = 0;i < ProjectConfig.reportList.length;i++){
                    if (ProjectConfig.reportList[i].reportId == ProjectConfig.reportDetail.reportId)continue;
                    strReportSelect.append('  <li class="zepto-ev" report-to="' + ProjectConfig.reportList[i].reportId + '">' + ProjectConfig.reportList[i].reportName + '</li>');
                }
                strReportSelect.append('</ul>');
                $reportSelect.html(strReportSelect.toString());
                $reportSelect.find('li').off('tap').on('tap',function(e){
                    var id = $(e.currentTarget).attr('report-to');
                    for (var  i = 0;i < ProjectConfig.reportList.length;i++){
                        if (ProjectConfig.reportList[i].reportId == id){
                            ProjectConfig.reportDetail = ProjectConfig.reportList[i];
                            break;
                        }
                    }
                    router.to({
                        typeClass:ProjectFactoryReport
                    })
                });
                $(ElScreenContainer).html(resultHTML);
                _this.init();
            })
        },
        init:function(){
            var $container = $('#containerReport');
            SpinnerControl.show();
            var version = _this.getReportVersion();
            var tempDiv,styleFile;
            this.initFactoryReport();
            _this.initReportSelect();
        },
        initFactoryReport:function(){
            api.report.renderReport(document.getElementById('containerReport'), ProjectConfig.reportDetail.reportId, {onlySummary: false}).done(function(){
                SpinnerControl.hide();
            });
        },
        initReportSelect:function(){
            if (ProjectConfig.reportDate) {
                var date = ProjectConfig.reportDate;
                $('#reportYear').html(new Date(date).getFullYear() + I18n.resource.appDashboard.project.REPORTYEAR);
                if(ProjectConfig.reportDetail.period === 'day' || ProjectConfig.reportDetail.period === 'month') {
                    $('#reportMonth').html((new Date(date).getMonth() + 1) + '<small>' + I18n.resource.appDashboard.project.REPORTMONTH + '</small>');
                }
                if(ProjectConfig.reportDetail.period === 'day') {
                    $('#reportDay').html((new Date(date).getDate()) + '<small>' + I18n.resource.appDashboard.project.REPORTDAY + '</small>');
                }
            }
            $('#divReportTime').off('tap').on('tap',function(){
                if(typeof datePicker == 'undefind')return;
                datePicker.show({
                    date:ProjectConfig.reportDate?ProjectConfig.reportDate:new Date(),
                    mode:'date',
                    todayText:AppConfig.language == 'zh'?'当前日期':'Current Date',
                    okText:AppConfig.language == 'zh'?'确定':'Done',
                    cancelText:AppConfig.language == 'zh'?'取消':'Cancel',
                    allowFutureDates:false,
                    doneButtonLabel:AppConfig.language == 'zh'?'确定':'Done',
                    cancelButtonLabel:AppConfig.language == 'zh'?'取消':'Cancel'
                                },setDate,function(){})
            });
            function setDate(date){
                     if (!date)return;
                ProjectConfig.reportDate = date;
                     if(ProjectConfig.reportDetail.period == 'day'){
                     if(new Date(ProjectConfig.reportDate).format('yyyy/MM/dd') == new Date().format('yyyy/MM/dd')){
                     ProjectConfig.reportDate = new Date(new Date(ProjectConfig.reportDate).setDate(new Date(ProjectConfig.reportDate).getDate() - 1));
                     window.plugins && window.plugins.toast.show(I18n.resource.appDashboard.project.DAILYREPORT_LOST,'long','center')
                     }
                     }else if(ProjectConfig.reportDetail.period == 'month'){
                     if(new Date(ProjectConfig.reportDate).format('yyyy/MM') == new Date().format('yyyy/MM')){
                     ProjectConfig.reportDate = new Date(new Date(ProjectConfig.reportDate).setMonth(new Date(ProjectConfig.reportDate).getMonth() - 1));
                     window.plugins && window.plugins.toast.show(I18n.resource.appDashboard.project.MONTHREPORT_LOST,'long','center')
                     }
                     }

                _this.init();
            }
        },
        getReportVersion:function(){
            var thisDay,version;
            var reportType = ProjectConfig.reportDetail.period;
            var year,month,day;
            //this.reportDate = '2015-12-10';
            if (ProjectConfig.reportDate && new Date(ProjectConfig.reportDate) != 'Invalid Date'){
                //year = this.reportDate.split('-')[0];
                //month = this.reportDate.split('-')[1];
                //day = this.reportDate.split('-')[2];
                thisDay = new Date(ProjectConfig.reportDate);
            }else {
                thisDay = new Date();
            }
            if (reportType === 'day') {
                if (!month || !year || !day) {
                     //thisDay = new Date();
                     if(thisDay.format('yyyy/MM/dd') == new Date().format('yyyy/MM/dd')){
                        thisDay.setDate(thisDay.getDate() - 1);
                     }
                     version = thisDay.format('yyyy-MM-dd');
                     year = thisDay.getFullYear();
                     month = thisDay.getMonth() + 1;
                     day = thisDay.getDate();
                }else {
                     version = year + "-" + StringUtil.padLeft(month, 2, '0') + "-" + StringUtil.padLeft(day, 2, '0');
                }
            }
            else if (reportType === 'month') {
                     if (!month || !year) {
                     //thisDay = new Date();
                     if(thisDay.format('yyyy/MM') == new Date().format('yyyy/MM')){
                     thisDay.setMonth(thisDay.getMonth() - 1);
                     }
                     year = thisDay.getFullYear();
                     month = thisDay.getMonth() + 1;
                }
                version = year + '-' + StringUtil.padLeft(month, 2, '0');
                //TODO 添加周视图请求处理
            } else {
                year = thisDay.getFullYear();
                month = month ? month : (_this.iso8601Week(new Date(year, thisDay.getMonth() - 1)));
                version = year + '-' + month + '-w';
            }
            return version;
        },
        close:function(){

        }
    };
    return ProjectFactoryReport;
})();
