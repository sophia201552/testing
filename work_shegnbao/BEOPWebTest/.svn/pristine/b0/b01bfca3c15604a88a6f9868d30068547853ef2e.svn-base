/**
 * Created by win7 on 2015/10/29.
 */
var WorkflowDetail = (function(){
    var _this = this;
    function WorkflowDetail(data){
        _this = this;
        if (data && data.id){
            WkConfig.wkId = data.id;
            if (data.detail){
                WkConfig.wkDetail = data.detail;
            }
        }
    }
    WorkflowDetail.navOptions = {
        top: '<div class="topNavTitle">工单详情</div>',
        bottom:false,
        backDisable:false,
        module:'workflow'
    };
    WorkflowDetail.prototype = {
        show:function(){
            $.ajax({url:'static/app/dashboard/views/workflow/workflowDetail.html'}).done(function(resultHTML){
                $(ElScreenContainer).html(resultHTML);
                _this.init();
            });
        },
        init:function(){
            _this.initData();
            _this.initComment();
            _this.initProgress();
            _this.initAdditionToggle();
        },
        initData:function(){
            $('#wkId .partContent').html(WkConfig.wkDetail.id);
            switch (WkConfig.wkDetail.critical){
                case 0 :
                    $('#wkEmergency').html('一般').css('background-color','green');
                    break;
                case 1:
                    $('#wkEmergency').html('严重').css('background-color','organge');
                    break;
                case 2:
                    $('#wkEmergency').html('紧急').css('background-color','red');
                    break;
            }
            $('#wkCreateDate .partContent').html(WkConfig.wkDetail.createTime.toDate().format('yyyy-MM-dd'));
            $('#wkExecutor .partContent').html(WkConfig.wkDetail.executorName);
            $('#detailTitle').html(WkConfig.wkDetail.title);
            $('#detailContent').html(WkConfig.wkDetail.detail);
            $('#wkDeadline .partContent').html(WkConfig.wkDetail.dueDate.toDate().format('yyyy-MM-dd'))
        },
        initComment:function(){
            var $container = $('#wkComment');
            var strReply;
            WebAPI.get('/workflow/transaction/get_reply/' + WkConfig.wkId).done(function(result){
               var replyList = result.data;
                for (var i = 0;i < replyList.length;i++){
                    strReply = new StringBuilder();
                    strReply.append('<div class="divReply">');
                    strReply.append('   <div class="replyPic"><img src="' + replyList[i].userpic + '"></div>');
                    strReply.append('   <div class="replyUser">' + replyList[i].userfullname + '</div>');
                    strReply.append('   <div class="replyTime">' + replyList[i].replyTime + '</div>');
                    strReply.append('   <div class="replyDetail">' + replyList[i].detail + '</div>');
                    strReply.append('</div>');
                    $container.append(strReply.toString());
                }
            });
        },
        initProgress:function(){
            var $container = $('#wkProgress');
            var strProgress,status;
            WebAPI.get('/workflow/transaction/get_progress/' + WkConfig.wkId).done(function(result){
               var progressList = result.data;
                for (var i = 0;i < progressList.length;i++){
                    strProgress = new StringBuilder();
                    switch (progressList[i].op){
                        case 'complete':
                            status = '完成了任务';
                            break;
                        case 'edit':
                            status = '编辑了任务';
                            break;
                        case 'new':
                            status = '创建了任务';
                            break;
                    }
                    strProgress.append('<div class="divProgress">');
                    strProgress.append('   <div class="progressPic"><img src="' + progressList[i].userpic + '"></div>');
                    strProgress.append('   <div class="progressTime">' + progressList[i].opTime.toDate().format('yy:MM:dd') + '</div>');
                    strProgress.append('   <div class="progressUser">' + progressList[i].userfullname + '</div>');
                    strProgress.append('   <div class="progressStatus">' + status + '</div>');
                    //strProgress.append('   <div class="progressDetail">' + progressList[i].detail + '</div>');
                    strProgress.append('</div>');
                    $container.append(strProgress.toString());
                }
            });
        },
        initAdditionToggle:function(){
            $('#wkProgress').hide();
            $('#wkComment').show();
            $('#btnComment').hammer().off('tap').on('tap',function(e){
                if($(e.currentTarget).hasClass('selected')){
                    return;
                }else{
                    $('#wkAddition .partTitle').removeClass('selected');
                    $(e.currentTarget).addClass('selected');
                    $('#wkProgress').hide();
                    $('#wkComment').show();
                }
            });
            $('#btnProgress').hammer().off('tap').on('tap',function(e){
                if($(e.currentTarget).hasClass('selected')){
                    return;
                }else{
                    $('#wkAddition .partTitle').removeClass('selected');
                    $(e.currentTarget).addClass('selected');
                    $('#wkProgress').show();
                    $('#wkComment').hide();
                }
            })
        },
        close:function(){

        }
    };
    return WorkflowDetail;
})();