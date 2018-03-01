/**
 * Created by win7 on 2015/10/21.
 */
var ProjectReport = (function(){
    var _this;
    function ProjectReport(data){
        _this = this;
        if(data && data.projectId){
            ProjectConfig.projectId = data.projectId
        }
    }
    ProjectReport.navOptions = {
        top:
        '<div id="reportSelect" class="topNavTitle dropdown"></div>' +
        '<div id="btnWeChat" class="topNavRight glyphicon glyphicon-share-alt"></div>',
        bottom:false,
        backDisable:false,
        module:'project'
    };
    ProjectReport.prototype = {
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
                    if (ProjectConfig.reportList[i]._id == ProjectConfig.reportDetail._id)continue;
                    strReportSelect.append('  <li report-to="' + ProjectConfig.reportList[i]._id + '">' + ProjectConfig.reportList[i].text + '</li>');
                }
                strReportSelect.append('</ul>');
                $reportSelect.html(strReportSelect.toString());
                $reportSelect.find('li').hammer().off('tap').on('tap',function(e){
                    var id = $(e.currentTarget).attr('report-to');
                    for (var  i = 0;i < ProjectConfig.reportList.length;i++){
                        if (ProjectConfig.reportList[i]._id == id){
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
            var postData={
                    projectId:ProjectConfig.projectId,
                    menuId:ProjectConfig.reportDetail._id,
                    chapter:'',
                    unit:''
                };
            Spinner.spin(ElScreenContainer);
            WebAPI.post('/report/getReportHtml/', postData).done(function(result){
                $container.html(result.data);
                var $reportUnit = $('#beopReport .report-unit');
                $reportUnit.find('.canvas-container').css({
                    height: '300px',
                    width: ($(ElScreenContainer).width() - 30) + 'px'
                });
                _this.reportScreen = new ReportScreen();
                _this.reportScreen.renderCharts($reportUnit);
            }).always(function(){
                Spinner.stop();
            });
            _this.initReportSelect();
        },
        initReportSelect:function(){
            if (ProjectConfig.reportDetail.structure) {
                var date = ProjectConfig.reportDetail.structure.updateTime;
                $('#reportYear').html(new Date(date).getFullYear() + '年');
                $('#reportMonth').html(new Date(date).getMonth() + '<small>月</small>');
            }
        },
        close:function(){

        }
    };
    return ProjectReport;
})();
