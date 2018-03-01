/**
 * Created by win7 on 2015/10/20.
 */
var ProjectSummary = (function(){
    var _this;
    function ProjectSummary(data){
        _this = this;
        if(data && data.id){
            ProjectConfig.projectId = data.id;
            for (var i = 0; i < ProjectConfig.projectList.length;i++){
                if (ProjectConfig.projectList[i].id == data.id){
                    ProjectConfig.projectInfo = ProjectConfig.projectList[i];
                    ProjectConfig.projectIndex = i;
                    break;
                }
            }
        }
        if (data && data.index){
            ProjectConfig.projectId = ProjectConfig.projectList[data.index].id;
            ProjectConfig.projectInfo = ProjectConfig.projectList[data.index];
            ProjectConfig.projectIndex = data.index;
        }
    }
    ProjectSummary.navOptions = {
        top:'<div id="btnProjectMap" class="glyphicon glyphicon-map-marker topNavLeft" aria-hidden="true"></div>' +
        '<div id="projectName" class="topNavTitle"></div>',
        bottom:true,
        backDisable:true,
        module:'project'
    };
    ProjectSummary.prototype ={
        show:function(){
            $.ajax({url:'static/app/dashboard/views/project/projectSummary.html'}).done(function(resultHtml){
                ElScreenContainer.innerHTML = resultHtml;
                $('.navTool .selected').removeClass('selected');
                $('#btnProject').addClass('selected');
                $('#projectName').html(ProjectConfig.projectInfo.name_cn);
                _this.init();
                localStorage.setItem('defaultProjectId',ProjectConfig.projectId);
                localStorage.setItem('module','project');
            })
        },
        init:function(){
            Spinner.spin(ElScreenContainer);
            WebAPI.get('/report/getReportMenu/' + ProjectConfig.projectId).done(function(result){
                if (result.success && result.data.length > 0) {
                    ProjectConfig.reportList = result.data;
                    _this.initReportShow();
                    _this.initDashboardShow();
                }else{
                    //new Alert($("#divAlert"), "danger", '未搜索到报表，请重新选择项目！').show().close();
                    //router.to({
                    //    type:ProjectList,
                    //    data:{}
                    //});
                }
            }).always(function(){
                Spinner.stop();
            });
            _this.initProjectSelect();
            _this.initTopNav();
        },
        initDashboardShow:function(){
            var $divEChart = $('.slideChart');
            var container = $('#containerEChartsSlide .carousel-inner');
            var timeShaft = ['0:00','1:00','2:00','3:00','4:00','5:00','6:00',
                '7:00','8:00','9:00','10:00','11:00','12:00','13:00','14:00','15:00',
                '16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00'
            ];
            var arrSeries = [
                {
                    name: 'KPI运行指标',
                    type: 'line',
                    itemStyle: {
                        normal: {
                            labelLine: {show: true},
                            label: {show: true}
                        },
                        emphasis: {
                            label: {
                                show: true,
                                position: 'inner',
                                formatter: "{d}%"//{b}\n
                            }
                        }
                    },
                    data: [1000,1200,1400,1600,1300,1400,1450,1600,1000,1200,1100,1600,1300,800]
                }
            ];
            var option = {
                color: ['#86b379'],
                title: {
                    text: 'KPI汇总',
                    x: 'left',
                    y: -5,
                    textStyle: {
                        fontSize: 18,
                        fontWeight: 500,
                        fontFamily: 'Microsoft YaHei',
                        color: '#333'
                    }
                },
                tooltip: {
                    show: true
                },
                grid : {
                       x:20,
                       y:20,
                       x2:20,
                       y2:20//,
                },
                xAxis : [
                    {
                        type : 'category',
                        boundaryGap : false,
                        data : timeShaft
                    }
                ],
                yAxis : [
                    {
                        type : 'value'
                    }
                ],
                series: arrSeries
            };
            $divEChart.eq(0).css({
                height:container.height() * 0.85 +'px',
                width:container.width() * 0.9 + 'px',
                top:container.height() * 0.05 + 'px',
                left:container.width() * 0.05 + 'px'
            });
            var myChart = echarts.init($divEChart[0]);
            myChart.setOption(option);
            option = {
                color: ['#a9cba2', '#a0ccf1', '#f7d596'],
                title : {
                    text: '制冷负荷',
                    x: 'left',
                    y: -5,
                    textStyle:{
                        fontSize: 18,
                        fontWeight:500,
                        fontFamily: 'Microsoft YaHei',
                        color: '#333'
                    }
                },
                tooltip : {
                    show:true,
                    formatter: "{b} : ({d}%)"
                },
                //calculable : true,
                series :
                    [
                        {
                            name:'制冷负荷',
                            type:'pie',
                            radius : '80%',
                            center: ['50%', '50%'],
                            itemStyle : {
                                normal : {
                                    areaStyle:{color:'green'},
                                    labelLine : {
                                        show : true
                                    },
                                    label:{
                                        show:true
                                    }
                                },
                                emphasis : {
                                    label : {
                                        show : true,
                                        position : 'inner',
                                        formatter : "{d}%"//{b}\n
                                    }
                                }

                            },
                            data:[
                                {value:670, name:'释冰负荷'},
                                {value:1575, name:'机载主机制冷负荷'},
                                {value:270, name:'双工况主机制冷负荷'}
                            ]
                        }
                    ]
            };
            $divEChart.eq(1).css({
                height:container.height() * 0.85 +'px',
                width:container.width() * 0.9 + 'px',
                top:container.height() * 0.05 + 'px',
                left:container.width() * 0.05 + 'px'
            });
            myChart = echarts.init($divEChart[1]);
            myChart.setOption(option);
            option = {
                title : {
                    text: '平均月温度同比',
                    x: 'left',
                    y: -5,
                    textStyle: {
                        fontSize: 18,
                        fontWeight: 500,
                        fontFamily: 'Microsoft YaHei',
                        color: '#333'
                    }
                },
                tooltip : {
                    trigger: 'axis'
                },
                grid : {
                       x:20,
                       y:20,
                       x2:20,
                       y2:20//,
                },
                legend: {
                    show:false,
                    data:['2014年月平均温度','2015年月平均温度']
                },
                toolbox: {
                    show : false
                },
                calculable : true,
                xAxis : [
                    {
                        type : 'category',
                        data : ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
                    }
                ],
                yAxis : [
                    {
                        type : 'value'
                    }
                ],
                series : [
                    {
                        name:'2014年月平均温度',
                        type:'bar',
                        data:[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
                        markLine : {
                            data : [
                                {type : 'average', name: '平均值'}
                            ]
                        }
                    },
                    {
                        name:'2015年月平均温度',
                        type:'bar',
                        data:[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
                        markLine : {
                            data : [
                                {type : 'average', name : '平均值'}
                            ]
                        }
                    }
                ]
            };
            $divEChart.eq(2).css({
                height:container.height() * 0.85 +'px',
                width:container.width() * 0.9 + 'px',
                top:container.height() * 0.05 + 'px',
                left:container.width() * 0.05 + 'px'
            });
            myChart = echarts.init($divEChart[2]);
            myChart.setOption(option);
            toggle.carousel($('#containerEChartsSlide'));

        },
        initReportShow:function(){
            var $reportContainer = $('#divProjectSummary');
            var postData,reportType,num = 0;
            var strPanelReport;
            ProjectConfig.reportList.forEach(function(val,i){
                postData = {
                    chapter:val.structure?val.structure.data[0].name:'',
                    menuId:val._id,
                    projectId:ProjectConfig.projectId,
                    unit:''
                };
                strPanelReport = new StringBuilder();
                reportType = val.reportFolder;
                strPanelReport.append('<div class="panel panel-primary panel' + reportType + '">');
                strPanelReport.append('    <div class="panel-heading" role="tab" id="reportTitle_' + i + '"> ');
                strPanelReport.append('        <h4 class="panel-title">');
                strPanelReport.append('            <a class="aCollapse collapsed" role="button" data-toggle="collapse" data-parent="#divProjectSummary" href="#divReport_'+ i +'" aria-expanded="false" aria-controls="divReport_' + i + '">');
                strPanelReport.append('                <span class="reportType">' + val.text + '</span>');
                //strPanelReport.append('                <span class="reportDetail" data-detail='+ val._id+'>more</span>');
                strPanelReport.append('                <span class="collapseArrow glyphicon glyphicon-chevron-up" aria-hidden="true"></span>');
                strPanelReport.append('                <span class="collapseArrow glyphicon glyphicon-chevron-down" aria-hidden="true"></span>');
                strPanelReport.append('            </a>');
                strPanelReport.append('        </h4>');
                strPanelReport.append('    </div>');
                strPanelReport.append('    <div id="divReport_'+ i + '" class="panel-collapse collapse div' + reportType + '" role="tabpanel" aria-labelledby="reportTitle_'+ i +'">');
                strPanelReport.append('        <div class="panel-body" id="' + val._id + '">');
                strPanelReport.append('        </div>');
                strPanelReport.append('        <div class="btnDetail" report-to="' + val._id + '">更多详情');
                strPanelReport.append('        </div>');
                strPanelReport.append('    </div>');
                strPanelReport.append('</div>');
                $reportContainer.append(strPanelReport.toString());
                Spinner.spin(ElScreenContainer);
                WebAPI.post('/report/getReportHtml/', postData).done(function (result) {
                    if (result.success) {
                        document.getElementById(val._id).innerHTML = result.data;
                    } else {
                        alert(result.msg);
                    }
                    if (num == ProjectConfig.reportList.length - 1) {
                        var $reportUnit = $('#beopReport .report-unit');
                        $reportUnit.find('.canvas-container').css({
                            height: '300px',
                            width: ($(ElScreenContainer).width() - 60) + 'px'
                        });
                        _this.reportScreen = new ReportScreen();
                        _this.reportScreen.renderCharts($reportUnit);
                        _this.initReportDetail();
                    }
                    num += 1;
                }).always(function () {
                    Spinner.stop();
                });
            })
        },
        initReportDetail:function(){
            var btnReportDetail = $('.panel-collapse .btnDetail');
            btnReportDetail.hammer().off('tap').on('tap',function(e){
                e.preventDefault();
                e.stopPropagation();
                for (var i = 0;i<ProjectConfig.reportList.length; i++){
                    if(ProjectConfig.reportList[i]._id == $(e.currentTarget).attr('report-to')) {
                        ProjectConfig.reportIndex = i;
                        ProjectConfig.reportDetail = ProjectConfig.reportList[i];
                        router.to({
                            typeClass: ProjectReport
                        });
                        break;
                    }
                }
            })
        },
        initProjectSelect:function(){
            //toggle.pageLeft(ProjectSummary,{index:AppConfig.projectIndex + 1});
            //toggle.pageRight(ProjectSummary,{index:AppConfig.projectIndex - 1});
        },
        initTopNav:function(){
            $('#btnProjectMap').hammer().off('tap').on('tap',function(){
                router.to({
                    typeClass:ProjectMap,
                    data:{}
                })
            })
        },
        close:function(){

        }
    };
    return ProjectSummary;
})();