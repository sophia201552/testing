/// <reference path="../lib/jquery-1.11.1.js" />
var dataEfficiency =[
    {
            "delayedCount": 434,
            "groupName": "HK CR0",
            "totalCount": 442,
            "unFinishedCount": 435,
            "userStatics": [{
                    "delayedCount": 177,
                    "totalCount": 177,
                    "unFinishedCount": 177,
                    "userId": null,
                    "userName": null
                },
                {
                    "delayedCount": 66,
                    "totalCount": 88,
                    "unFinishedCount": 22,
                    "userId": 1,
                    "userName": "admin"
                },
                {
                    "delayedCount": 22,
                    "totalCount": 33,
                    "unFinishedCount": 11,
                    "userId": null,
                    "userName": null
                },
            ]
        },
        {
            "delayedCount": 333,
            "groupName": "HK CR1",
            "totalCount": 350,
            "unFinishedCount": 55,
            "userStatics": [{
                    "delayedCount": 177,
                    "totalCount": 177,
                    "unFinishedCount": 177,
                    "userId": null,
                    "userName": null
                },{
                    "delayedCount": 66,
                    "totalCount": 88,
                    "unFinishedCount": 22,
                    "userId": 1,
                    "userName": "admin"
                }
            ]
        },
        {
            "delayedCount": 222,
            "groupName": "HK CR2",
            "totalCount": 155,
            "unFinishedCount": 55,
            "userStatics": [{
                    "delayedCount": 22,
                    "totalCount": 33,
                    "unFinishedCount": 11,
                    "userId": null,
                    "userName": null
                },
            ]
        }
];

var WorkflowEfficiency = (function () {
    function WorkflowEfficiency() {
        this.listGroupStatics = undefined;
        this.listUserStatics = undefined;
        this.maxNum=10;
        this.i18=I18n.resource.workflow.efficiency;
    }

    WorkflowEfficiency.prototype = {
        show: function () {
            var _this = this;
            $.get("/static/views/workflow/efficiency.html").done(function (resultHtml) {
                $(ElScreenContainer).html(resultHtml);
                _this.init();
                I18n.fillArea($("#workflow-efficiency"));
            });
        },

        close: function () {
        },

        init: function () {
            var _this = this;

            function getData() {
                _this.listGroupStatics = {};
                _this.listUserStatics = {};
                Spinner.spin($("#GroupStatics")[0]);
                WebAPI.post("/workflow_get_user_statics", {user_id: AppConfig.userId}).done(function (result) {
                    //var data = JSON.parse(result);
                    var data = dataEfficiency;
                    _this.renderData(data);
                    Spinner.stop();
                });
            }

            getData();

            $(".workflow-efficiency-table-footer").click(function () {
                getData();
            });

            $("#thisMonth,#cumulative,#lastMonth").click(function () {
                var $o=$(this);
                var btnId=$o.attr("id");
                var isClickFlag= $o.hasClass("btn-success");
                if(isClickFlag){
                    return;
                }
                $o.removeClass("btn-default").addClass("btn-success").css("cursor","default").siblings("button").removeClass("btn-success").addClass("btn-default").css("cursor","pointer");

                if(btnId=="thisMonth"){


                }else if(btnId=="cumulative"){

                }else if(btnId=="lastMonth"){

                }
                _this.updateStaticsChart(0);

            });

            $("#divGroupStatics").on("click",".isSeeChart",function(){
                var $o=$(this);
                var $op= $o.parents(".recordCon");
                var $nextChart=$op.next(".divUserStatics");
                var hiddenFlag=$nextChart.is(':hidden');
                if(hiddenFlag){
                    //$o.text('隐藏图表');
                    $o.text(_this.i18.HIDE);
                    //$o.text(I18n.resource.workflow.efficiency.HIDE);
                    $nextChart.slideDown(300);
                }else{
                    //$o.text('查看图表');
                    $o.text(_this.i18.VIEW);
                    //$o.text(I18n.resource.workflow.efficiency.VIEW);
                    $nextChart.slideUp(300);
                }
            });

        },

        //得到统计图的字符串
        getStaticsChartStr: function(staticsArr){//统计图数组
            var staticsStr="";
            var staticsArrL=staticsArr.length;
            var maxNum=this.maxNum;
                for (var i=0;i<staticsArrL;i++) {
                    var staticsObj=staticsArr[i];
                    var userName=staticsObj.userName;//用户
                    var total=staticsObj.totalCount;//统计图总量
                    var unfinished=staticsObj.unFinishedCount;//统计图未完成量
                    var finished=total - unfinished;//统计图完成量
                    var finishedPercentage = ((finished / maxNum) * 100.0).toFixed(1);//统计图完成量进度条显示百分比
                    var unFinishedPercentage = ((unfinished / maxNum) * 100.0).toFixed(1);//统计图未完成量进度条显示百分比
                    var finishedRate = ((finished/total) * 100.0).toFixed(1);//统计图完成率
                    staticsStr+='<div class="col-xs-3" style="height:35px;text-indent:10px;">' + userName +
                    '</div><div class="col-xs-6" style="height:35px;"><div> <div class="progress-bar progress-bar-success progress-bar-striped active" role="progressbar" aria-valuenow="" aria-valuemin="0" aria-valuemax="100" style="width: ' + finishedPercentage + '%;min-width:20px;border-radius:4px 0 0 4px"><span style="float:left;margin-left:6px;">'
                    + finished + '</span></div><div class="progress-bar progress-bar-danger progress-bar-striped active" style="width: ' + unFinishedPercentage + '%;min-width:20px;max-width:95%;border-radius:0 4px 4px 0"><span>' +
                    unfinished + '</span></div></div></div><div class="col-xs-2" style="height:35px;text-align:center;">' + finishedRate + '%' + '</div>';
                }
                return staticsStr;
        },

        //点击本月，累计，上月按钮更新统计图
        updateStaticsChart: function(num){//num为0更新统计图，num为1更新统计图和统计表
            var _this = this;
            Spinner.spin($("#GroupStatics")[0]);
            WebAPI.post("/workflow_get_user_statics", {user_id: AppConfig.userId}).done(function (result) {
                //var data = JSON.parse(result);
                var data = dataEfficiency;
                if(num==0){
                    var dataL=data.length;
                    this.maxNum=data[0].userStatics[0].totalCount;
                    var maxNum=this.maxNum;
                    var $staticsObj= $(".divUserStatics");
                    var $staticsObjL=$staticsObj.length;
                    for(i=0;i<$staticsObjL;i++){
                            var $obj=$staticsObj.eq(i);
                            var dataObj=data[i];
                            var staticsArr=dataObj.userStatics;
                            var staticsStr=_this.getStaticsChartStr(staticsArr);
                            $obj.html(staticsStr);
                    }
                }else if(num==1){
                     _this.renderData(data);
                }
                Spinner.stop();
            });
        },

        renderData: function (data) {
            var _this = this;
            var dataL=data.length;
            divGroupStatics = $('#divGroupStatics');
            divGroupStatics.children().remove();
            var tableHtml="";
            this.maxNum=data[0].userStatics[0].totalCount;
            var maxNum=this.maxNum;
            for (var i=0;i<dataL;i++) {
                var dataObj=data[i];
                var staticsArr=dataObj.userStatics;
                var groupName = dataObj.groupName;
                var fTotal = parseFloat(dataObj.totalCount);//统计表总任务量
                var fUnFished = parseFloat(dataObj.unFinishedCount);//统计表延误任务量
                var fDelayedPercentage = ((fUnFished / fTotal) * 100.0).toFixed(1);//统计表延误率
                tableHtml+='<div class="row" style="padding:5px;border-bottom:1px inset #ccc"><div class="recordCon" style="overflow:hidden;height: 37px;line-height: 36px;"><div class="col-xs-3">' + groupName + '</div><div class="col-xs-2">' + fTotal + '</div> <div class="col-xs-2">' + fUnFished + '</div> <div class="col-xs-2">' + (Number(fDelayedPercentage) ? fDelayedPercentage + '%' : '--') + '</div>' + '<div class="col-xs-2" style="text-align:center;"><button type="button" class="btn btn-primary isSeeChart" i18n="workflow.efficiency.VIEW"></button></div></div><div class="row divUserStatics" style="margin: 10px 0px 0px 0px; padding: 15px 5px 5px 5px; border-top: 1px dashed #ccc;display: none;">';
                var staticsChartStr = _this.getStaticsChartStr(staticsArr);
                tableHtml+=staticsChartStr+'</div></div>';
            }
            divGroupStatics.append(tableHtml);
            I18n.fillArea($("#workflow-efficiency"));
        }
    }

    return WorkflowEfficiency;
})();