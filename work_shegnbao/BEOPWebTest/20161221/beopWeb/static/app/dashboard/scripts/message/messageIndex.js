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
                //$('#btnMessage .messageNum').hide();
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
            var msg;
            if (localStorage.getItem('pushMsg')){
                try {
                    msg = JSON.parse(localStorage.getItem('pushMsg'));
                    msg = msg.filter(function(item){
                        return item.type=='message'
                    });
                }catch(e){
                    msg = null;
                }
                if(msg instanceof Array && msg.length > 0){
                    _this.initMessagePush(msg);
                }
            }
            _this.initMessagePushEvent();
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
                        return item.type === 'FacReportWrapScreen';
                    });
                    if (ProjectConfig.reportList.length == 0) {
                        ProjectConfig.reportList = result.navItems.filter(function (item) {
                            return item.type === 'ReportScreen';
                        });
                    }
                    $liReportMsg.find('.spinner').hide();
                    $liReportMsg.find('.badge').html(ProjectConfig.reportList.length);
                    $liReportMsg.off('tap').on('tap',function(){
                        if (ProjectConfig.reportList.length > 0){
                            if (ProjectConfig.reportList[0].type == 'FacReportWrapScreen'){
                                ProjectConfig.reportPageId = ProjectConfig.reportList[0].id;
                                router.to({
                                    typeClass: MessageFactoryReport
                                })
                            }else {
                                router.to({
                                    typeClass: MessageReport
                                })
                            }
                        }
                    });
                }else{
                    //new Alert($(AlertContainer), "danger", I18n.resource.appDashboard.message.REPORT_ERR).show().close();
                    window.plugins && window.plugins.toast.show(I18n.resource.appDashboard.message.REPORT_ERR, 'short', 'center');
                    //router.to({
                    //    type:ProjectList,
                    //    data:{}
                    //});
                }
            }).fail(function(e){
                //new Alert($(AlertContainer), "danger", I18n.resource.appDashboard.message.REPORT_ERR).show().close();
                $liReportMsg.find('.spinner').hide();
                $liReportMsg.find('.badge').html('0');
                window.plugins && window.plugins.toast.show(I18n.resource.appDashboard.message.REPORT_ERR, 'short', 'center');
            }).always(function(){
                Spinner.stop();
            });
        },
        initSchedule:function(){

        },
        initAffairs:function(){

        },
        initMessagePush:function(msg){
            //var msg = Push.getPushInfo().receiveMessage;
            //var msg = [{
            //    title:"1",
            //    time:"2016-06-29 17:19",
            //    content:"1111111111111111"
            //},{
            //    title:"2",
            //    time:"2016-06-29 17:20",
            //    content:"2222222222222222"
            //},{
            //    title:"3",
            //    time:"2016-06-29 17:19",
            //    content:"33333333333333333"
            //}];
            var $liMsgPush = $('#liMsgPush');
            if (msg && msg.length > 0) {
                $liMsgPush.find('.badge').text(msg.length).css('display','block');
                //触发敲击消息推送的按钮
            }else{
                window.plugins && window.plugins.toast.show(I18n.resource.appDashboard.message.REPORT_ERR, 'short', 'center');
            }

            Spinner.stop();
        },
        initMessagePushEvent:function(){
            var msg;
            var $liMsgPush = $('#liMsgPush');
            //触发敲击消息推送的按钮
            $liMsgPush.off('tap').on('tap',function(){
                try {
                    msg = JSON.parse(localStorage.getItem('pushMsg'));
                    msg = msg.filter(function(item){
                        return item.type=='message'
                    });
                }catch(e){
                    msg = [];
                }
                router.to({
                    typeClass:MessagePush,
                    data:msg
                })
            });
        },
        close:function(){

        }
    };
    return MessageIndex;
})();