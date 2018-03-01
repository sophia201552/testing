/**
 * Created by win7 on 2015/11/3.
 */
var MessageReport = (function(){
    var _this = this;
    function MessageReport(reportDate){
        _this = this;
        this.reportDate = reportDate;
    }
    MessageReport.navOptions = {
        top: '<div class="topNavTitle" i18n="appDashboard.message.MY_REPORT"></div>',
        bottom:true,
        backDisable:true,
        module:'message'
    };
    MessageReport.prototype = {
        reportTypeMap: {
            daily: '0',
            monthly: '1',
            weekly: '2'
        },

        reportSummaryShow:{
            'KPIReport':{
                'report-unit-1':{
                    'page-header':true,
                    'report-unit-1-1':['well','summary','canvas-container']
                }
            },
            'KPIMonthReport':{
                'report-unit-1':{
                    'page-header':true,
                    'report-unit-1-1':['well','summary','canvas-container']
                },
                'report-unit-2':{
                    'page-header':true,
                    'report-unit-2-1':['well','summary','canvas-container']
                }
            },
            'CostReport':{
                'report-unit-1':{
                    'page-header':true,
                    'report-unit-1-1':['well','summary','canvas-container']
                }
            },
            'MonthPatternReport':{
                'report-unit-1':{
                    'page-header':true,
                    'report-unit-1-1':['well','summary','canvas-container']
                }
            },
            'CostMonthReport':{
                'report-unit-1':{
                    'page-header':true,
                    'report-unit-1-1':['well','summary','canvas-container']
                }
            },
            'DailyReport':{
                'report-unit-1':{
                    'page-header':true,
                    'report-unit-1-1':['well','summary','canvas-container']
                }
            },
            'RunReport':{
                'report-unit-1':{
                    'page-header':true,
                    'report-unit-1-1':['well','summary','canvas-container']
                }
            },
            'DiagnosisReport':{
                'report-unit-1':{
                    'page-header':true,
                    'report-unit-1-1':['well','summary','canvas-container']
                }
            }
        },
        reportSummaryTemplate:'\
        <div style="width: 100%; height: 100%; overflow-x: hidden; overflow-y: hidden;" id="beopReport">\
            <link rel="stylesheet" href="/static/projectReports/report.css"/>\
            <div class="step-container col-xs-12 col-md-8 col-md-offset-2 report-block scrollbar">\
                <div class="step-play-container">\
                    <div class="step-play-list">\
                    </div>\
                </div>\
            </div>\
        </div>',
        show:function(){
            $.ajax({url:'static/app/dashboard/views/message/messageReport.html'}).done(function(resultHTML){
                $(ElScreenContainer).html(resultHTML);
                _this.init();
                I18n.fillArea($('#navTop'));
            });
        },
        init:function(){
            _this.initReportList();
        },
        initReportList:function(){
            var $container = $('#containerMessageReport');
            var num = 0;
            //var strReportType = '';
            ProjectConfig.reportList.forEach(function(val,i){
                var version = _this.getReportVersion(val);
                var reportFolder = val.reportFolder;
                var reportSummaryIndex = _this.reportSummaryShow[reportFolder];
                var strPanelReport = new StringBuilder();
                strPanelReport.append('<div class="panel panel-primary panel' + reportFolder + '">');
                strPanelReport.append('    <div class="panel-heading" role="tab" id="reportTitle_' + i + '"> ');
                strPanelReport.append('        <h4 class="panel-title">');
                strPanelReport.append('            <a class="aCollapse collapsed" role="button" data-toggle="collapse" data-parent="#containerMessageReport" href="#divReport_'+ i +'" aria-expanded="false" aria-controls="divReport_' + i + '">');
                strPanelReport.append('                <span class="reportType">' + val.text + '&nbsp&nbsp&nbsp&nbsp&nbsp' + new Date().format('yyyy-MM-dd') +'</span>');
                //strPanelReport.append('                <span class="reportDetail" data-detail='+ val._id+'>more</span>');
                strPanelReport.append('                <span class="collapseArrow glyphicon glyphicon-chevron-up" aria-hidden="true"></span>');
                strPanelReport.append('                <span class="collapseArrow glyphicon glyphicon-chevron-down" aria-hidden="true"></span>');
                strPanelReport.append('            </a>');
                strPanelReport.append('        </h4>');
                strPanelReport.append('    </div>');
                strPanelReport.append('    <div id="divReport_'+ i + '" class="panel-collapse collapse div' + reportFolder + '" role="tabpanel" aria-labelledby="reportTitle_'+ i +'">');
                strPanelReport.append('        <div class="panel-body" id="' + val.id + '">');
                strPanelReport.append('        </div>');
                strPanelReport.append('        <div class="btnDetail zepto-ev" report-to="' + val.id + '">' + I18n.resource.appDashboard.message.MORE);
                strPanelReport.append('        </div>');
                strPanelReport.append('    </div>');
                strPanelReport.append('</div>');
                $container.append(strPanelReport.toString());
                //if (strReportType.indexOf(val.text) == -1)$container.append(strPanelReport.toString());
                //strReportType = strReportType + val.text;
                SpinnerControl.show();
                WebAPI.get('/report/getReport/' + ProjectConfig.projectInfo.name_en + '/' + reportFolder + '/' + version).done(function (result) {
                    var tempDiv = document.createElement('div');
                    tempDiv.innerHTML = result;
                    var subUnit;
                    var strReportContent = new StringBuilder();
                    strReportContent.append('<div style="width: 100%; height: 100%; overflow-x: hidden; overflow-y: hidden;" id="beopReport">\
                                                <div class="step-container col-xs-12 col-md-8 col-md-offset-2 report-block scrollbar">\
                                                    <div class="step-play-container">\
                                                        <div class="step-play-list">');
                    for (var k in reportSummaryIndex) {
                        strReportContent.append('               <div class="step-item-container" id="' + k + '">');
                        for(var l in reportSummaryIndex[k]){
                            if(l == 'page-header') {
                                strReportContent.append(tempDiv.querySelector('#' + k + '>.' + l).outerHTML);
                            }else{
                                strReportContent.append('<div class="report-unit" id="' + l + '">');
                                for (var m = 0 ; m < reportSummaryIndex[k][l].length ; m ++) {
                                    subUnit = tempDiv.querySelector('#' + k + '>#' + l + '>.' + reportSummaryIndex[k][l][m]);
                                    if(!subUnit)continue;
                                    strReportContent.append(subUnit.outerHTML);
                                }
                                strReportContent.append('</div>');
                            }
                        }
                        strReportContent.append('               </div>');
                    }
                    strReportContent.append('           </div>');
                    strReportContent.append('       </div>');
                    strReportContent.append('   </div>');
                    strReportContent.append('</div>');
                    //for(var k = 0 ; k < _this.reportSummaryShow[reportFolder].unit.length; k++){
                    //    tempDiv = document.createElement('div');
                    //    tempDiv.innerHTML = result;
                    //    tempDiv.querySelector();
                    //    $('#' + val._id).append($(result).find(_this.reportSummaryShow[reportFolder].unit[k]));
                    //}
                    $('#' + val.id).append(strReportContent.toString()).append(tempDiv.querySelector('#tmpl_table'));
                    if (num == ProjectConfig.reportList.length - 1) {
                        var $reportUnit = $('#beopReport .report-unit');
                        $reportUnit.find('.canvas-container').css({
                            height: '300px',
                            width: ($(ElScreenContainer).width() - 60) + 'px'
                        });
                        _this.reportScreen = new ReportScreen();
                        _this.reportScreen.renderCharts($reportUnit);
                        var $table = $('table');
                        for(var  n= 0 ;n < $table.length; n++){
                            $table.eq(n).removeClass('table-striped');
                            $table[n].outerHTML = '<div class="tableContainer">' + $table[n].outerHTML + '</div>'
                        }
                        _this.initReportDetail();
                    }
                    num += 1;
                }).always(function () {
                    SpinnerControl.hide();
                });
            })
        },
        initReportDetail:function(){
            var btnReportDetail = $('.panel-collapse .btnDetail');
            btnReportDetail.off('tap').on('tap',function(e){
                e.preventDefault();
                e.stopPropagation();
                for (var i = 0;i<ProjectConfig.reportList.length; i++){
                    if(ProjectConfig.reportList[i].id == $(e.currentTarget).attr('report-to')) {
                        ProjectConfig.reportIndex = i;
                        ProjectConfig.reportDetail = ProjectConfig.reportList[i];
                        router.to({
                            typeClass: ProjectReport,
                            data:{

                            }
                        });
                        break;
                    }
                }
            })
        },
        getReportVersion:function(reportInfo){
            var thisDay,version;
            var reportType = reportInfo.reportType;
            var year,month,day;
            this.reportDate = '2015-12-10';
            if (this.reportDate){
                year = this.reportDate.split('-')[0];
                month = this.reportDate.split('-')[1];
                day = this.reportDate.split('-')[2];
            }
            if (reportType === this.reportTypeMap.daily) {
                if (!month || !year || !day) {
                    thisDay = new Date();
                    thisDay.setDate(thisDay.getDate() - 1);
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
                    thisDay = new Date();
                    year = thisDay.getFullYear();
                    month = DateUtil.getLastMonth();
                }
                version = year + '-' + StringUtil.padLeft(month, 2, '0');
                //TODO 添加周视图请求处理
            } else {
                thisDay = new Date();
                year = thisDay.getFullYear();
                month = month ? month : (_this.iso8601Week(new Date(year, thisDay.getMonth() - 1)));
                version = year + '-' + month + '-w';
            }
            return version;
        },
        close:function(){

        }
    };
    return MessageReport;
})();