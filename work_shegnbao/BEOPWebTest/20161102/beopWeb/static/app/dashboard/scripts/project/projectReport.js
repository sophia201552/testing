/**
 * Created by win7 on 2015/10/21.
 */
var ProjectReport = (function(){
    var _this;
    function ProjectReport(data){
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
    ProjectReport.navOptions = {
        top:
        '<div id="reportSelect" class="topNavTitle dropdown"></div>' +
        '<div id="btnWeChat" class="topNavRight glyphicon glyphicon-share-alt"></div>',
        bottom:true,
        backDisable:false,
        module:'project'
    };
    ProjectReport.prototype = {
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
                strReportSelect.append('  <span>' + ProjectConfig.reportDetail.text + '</span>');
                strReportSelect.append('  <span class="caret"></span>');
                strReportSelect.append('</button>');
                strReportSelect.append('<ul class="dropdown-menu" aria-labelledby="ulReportSelect">');
                for (var  i = 0;i < ProjectConfig.reportList.length;i++){
                    if (ProjectConfig.reportList[i].id == ProjectConfig.reportDetail.id)continue;
                    strReportSelect.append('  <li class="zepto-ev" report-to="' + ProjectConfig.reportList[i].id + '">' + ProjectConfig.reportList[i].text + '</li>');
                }
                strReportSelect.append('</ul>');
                $reportSelect.html(strReportSelect.toString());
                $reportSelect.find('li').off('tap').on('tap',function(e){
                    var id = $(e.currentTarget).attr('report-to');
                    for (var  i = 0;i < ProjectConfig.reportList.length;i++){
                        if (ProjectConfig.reportList[i].id == id){
                            ProjectConfig.reportDetail = ProjectConfig.reportList[i];
                            break;
                        }
                    }
                    router.to({
                        typeClass:ProjectReport
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
            WebAPI.get('/report/getReport/' + ProjectConfig.projectInfo.name_en + '/' + ProjectConfig.reportDetail.reportFolder + '/' + version).done(function(result){
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
            });
            _this.initReportSelect();
        },
        initFactoryReport:function(){
            api.report.renderReport(dom, ProjectConfig.projectInfo.id, {onlySummary: false})
        },
        initReportSelect:function(){
            if (ProjectConfig.reportDate) {
                var date = ProjectConfig.reportDate;
                $('#reportYear').html(new Date(date).getFullYear() + I18n.resource.appDashboard.project.REPORTYEAR);
                if(ProjectConfig.reportDetail.reportType === this.reportTypeMap.daily || ProjectConfig.reportDetail.reportType === this.reportTypeMap.monthly) {
                    $('#reportMonth').html((new Date(date).getMonth() + 1) + '<small>' + I18n.resource.appDashboard.project.REPORTMONTH + '</small>');
                }
                if(ProjectConfig.reportDetail.reportType === this.reportTypeMap.daily) {
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
                     if(ProjectConfig.reportDetail.reportType == '0'){
                     if(new Date(ProjectConfig.reportDate).format('yyyy/MM/dd') == new Date().format('yyyy/MM/dd')){
                     ProjectConfig.reportDate = new Date(new Date(ProjectConfig.reportDate).setDate(new Date(ProjectConfig.reportDate).getDate() - 1));
                     window.plugins && window.plugins.toast.show(I18n.resource.appDashboard.project.DAILYREPORT_LOST,'long','center')
                     }
                     }else if(ProjectConfig.reportDetail.reportType == '1'){
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
            var reportType = ProjectConfig.reportDetail.reportType;
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
            if (reportType === this.reportTypeMap.daily) {
                     if (!month || !year || !day) {
                     //thisDay = new Date();
                     if(thisDay.format('yyyy/MM/dd') == new Date().format('yyyy/MM/dd')){
                     thisDay.setDate(thisDay.getDate() - 1);
                     }
                     version = thisDay.format('yyyy-MM-dd');
                     year = thisDay.getFullYear();
                     month = thisDay.getMonth() + 1;
                     day = thisDay.getDate();
                     } else {
                     version = year + "-" + StringUtil.padLeft(month, 2, '0') + "-" + StringUtil.padLeft(day, 2, '0');
                     }
                     }
                     else if (reportType === this.reportTypeMap.monthly) {
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
    return ProjectReport;
})();