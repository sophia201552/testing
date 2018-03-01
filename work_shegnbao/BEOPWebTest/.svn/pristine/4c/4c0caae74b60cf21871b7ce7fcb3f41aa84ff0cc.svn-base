/**
 * Created by win7 on 2015/10/21.
 */
var MessageIndex = (function(){
    var _this = this;
    function MessageIndex(){
        _this = this;
    }
    MessageIndex.navOptions = {
        top: '<div class="topNavTitle">消息中心</div>',
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
            //router.to({
            //    typeClass:MessageReport
            //})
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