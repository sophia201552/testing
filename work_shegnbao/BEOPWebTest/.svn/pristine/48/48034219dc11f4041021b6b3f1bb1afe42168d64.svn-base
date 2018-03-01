/**
 * Created by win7 on 2015/10/21.
 */
var MessageIndex = (function(){
    var _this = this;
    function MessageIndex(){
        _this = this;
    }
    MessageIndex.navOptions = {
        top: '<div class="topNavTitle" i18n="appDashboard.message.MESSAGE_CENTER"></div>',
        bottom:true,
        backDisable:true,
        module:'message'
    };
    MessageIndex.prototype = {
        show:function(){
            $.ajax({url:'static/app/dashboard/views/message/messageIndex.html'}).done(function(resultHTML){
                $(ElScreenContainer).html(resultHTML);
                _this.init();
                localStorage.setItem('module','message');
                I18n.fillArea($('#navTop'));
                I18n.fillArea($('#ulMessageDivide'));
            });
        },
        init:function(){
            _this.initWorkflow();
            _this.initReport();
            _this.initSchedule();
            _this.initAffairs();
        },
        initWorkflow:function(){
            //router.to({
            //    typeClass:MessageWorkflow
            //})
        },
        initReport:function(){
            var $liReportMsg = $('#liReportMsg');
            WebAPI.get("/get_plant_pagedetails/" + ProjectConfig.projectId + "/" + AppConfig.userId).done(function(result){
                if (result.navItems && result.navItems.length > 0) {
                    ProjectConfig.reportList = result.navItems.filter(function (item) {
                        return item.type === 'ReportScreen';
                    });
                    $liReportMsg.find('.spinner').hide();
                    $liReportMsg.find('.badge').html(ProjectConfig.reportList.length);
                    $liReportMsg.off('tap').on('tap',function(){
                        router.to({
                            typeClass:MessageReport
                        })
                    });
                }else{
                    new Alert($(AlertContainer), "danger", '未搜索到报表，请重新选择项目！').show().close();
                    //router.to({
                    //    type:ProjectList,
                    //    data:{}
                    //});
                }
            }).always(function(){
                Spinner.stop();
            });
        },
        initSchedule:function(){

        },
        initAffairs:function(){

        },
        close:function(){

        }
    };
    return MessageIndex;
})();