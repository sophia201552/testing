/**
 * Created by win7 on 2015/10/29.
 */
var WorkflowDetail = (function(){
    var _this = this;
    function WorkflowDetail(data){
        _this = this;
        if (data && data.id){
            WkConfig.wkId = data.id;
            if (data.info){
                WkConfig.wkInfo = data.info;
            }
        }
    }
    WorkflowDetail.navOptions = {
        top: '<div class="topNavTitle" i18n="appDashboard.workflow.WORKFLOW_DETAIL"></div>',
        bottom:true,
        backDisable:false,
        module:'workflow'
    };
    WorkflowDetail.prototype = {
        show:function(){
            $.ajax({url:'static/app/dashboard/views/workflow/workflowDetail.html'}).done(function(resultHTML){
                $(ElScreenContainer).html(resultHTML);
                //CssAdapter.setIndexMain();
                _this.init();
                I18n.fillArea($('#navTop'));
                I18n.fillArea($('#divContent'));
                I18n.fillArea($('#wkEdit'));
                I18n.fillArea($('#wkUserDialog'));
            });
        },
        init:function(){
            if(WkConfig.wkInfo) {
                _this.initData(WkConfig.wkInfo);
                WebAPI.post('/workflow/transaction/' + WkConfig.wkId, {user_id: AppConfig.userId}).done(function (resultData) {
                    WkConfig.wkDetail = resultData.data;
                });
            }else {
                WebAPI.post('/workflow/transaction/' + WkConfig.wkId, {user_id: AppConfig.userId}).done(function (resultData) {
                    WkConfig.wkDetail = resultData.data;
                    _this.initData(WkConfig.wkDetail);
                });
            }
            _this.initComment();
            _this.initProgress();
            _this.initTransmit();
            _this.initAdditionToggle();
            _this.initComplete();
        },
        initData:function(detail){
            $('#wkId .partContent').html(detail.id);
            switch (detail.critical) {
                case 0 :
                    $('#wkEmergency').html(I18n.resource.appDashboard.workflow.NORMAL).css('background-color', '#38C663');
                    break;
                case 1:
                    $('#wkEmergency').html(I18n.resource.appDashboard.workflow.SERIOUS).css('background-color', '#fead21');
                    break;
                case 2:
                    $('#wkEmergency').html(I18n.resource.appDashboard.workflow.URGENT).css('background-color', 'red');
                    break;
            }
            $('#wkCreateDate .partContent').html(detail.createTime.toDate().format('yyyy-MM-dd'));
            $('#wkExecutor .partContent').html(detail.executorName);
            $('#detailTitle').html(detail.title);
            $('#detailContent').html(detail.detail);
            $('#wkDeadline .partContent').html(detail.dueDate.toDate().format('yyyy-MM-dd'));
        },
        initTransmit:function(){
            var $modal = $('#divModal');
            var $divModal = $modal.find('.modal-body');
            $modal.find('.modal-header').append(
            '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\
             <h4 class="modal-title" i18n="appDashboard.workflow.PLZ_CHOICE_PEOPLE">Please Choose People</h4>'
            )
            $modal.find('.modal-footer').append(
                '<span id="spanUserSel" class="zepto-ev">\
                <span id="userSel"></span>\
                <span id="tipRemove" class="glyphicon glyphicon-remove zepto-ev"></span>\
                </span>\
                <button type="button" id="btnWkTransmitSure" class="btn btn-primary zepto-ev" \i18n="appDashboard.workflow.SURE">Sure</button>\
            ')
            WebAPI.get('/workflow/group/user_dialog_list/' + AppConfig.userId).done(function(resultData){
                var userList = resultData.data;
                WkConfig.userDialog = userList;
                var strDivUser;
                for (var i = 0; i < userList.length; i++){
                    strDivUser = new StringBuilder();
                    strDivUser.append('<div class="divWkMem zepto-ev" user-to="' + userList[i].id + '">');
                    strDivUser.append('   <div class="checkWkMem"><span class="glyphicon glyphicon-ok"></span></div>');
                    strDivUser.append('   <div class="nameWkMem">' + userList[i].userfullname + '</div>');
                    strDivUser.append('   <div class="imgWkMem"><img src="' + userList[i].userpic + '"></div>');
                    strDivUser.append('</div>');
                    $divModal.append(strDivUser.toString());
                }
                $('.divWkMem').off('tap').on('tap',function(e){
                    var id = $(e.target).attr('user-to');
                    $('.divWkMem.selected').removeClass('selected');
                    $(e.target).addClass('selected');
                    $('#userSel').html($(e.target).find('.nameWkMem').html()).parent().addClass('tipShow').attr('user-to',id);
                })
            });

            $('#btnWkTransmit').off('click').on('click',function(){
                $modal.modal('show');
            });
            $('#btnWkTransmitSure').off('tap').on('tap',function(){
                var arrVerifier=[],arrWatcher=[];
                for(var i= 0; i < WkConfig.wkDetail.verifiers.length;i++){
                    arrVerifier.push(WkConfig.wkDetail.verifiers[i].id);
                }
                for(var i= 0; i < WkConfig.wkDetail.watchers.length;i++){
                    arrWatcher.push(WkConfig.wkDetail.watchers[i].id);
                }
                var postData = {
                    collection:WkConfig.wkDetail.star?'1':'0',
                    creator:WkConfig.wkDetail.creatorID,
                    critical:WkConfig.wkDetail.critical,
                    detail:WkConfig.wkDetail.detail,
                    dueDate:WkConfig.wkDetail.dueDate,
                    'executor[]':[$('#spanUserSel').attr('user-to')],
                    groupId:WkConfig.wkDetail.groupid,
                    title:WkConfig.wkDetail.title,
                    transId:WkConfig.wkDetail.id,
                    userId:AppConfig.userId,
                    'verifiers[]':arrVerifier,
                    'watchers[]':arrWatcher
                };
                WebAPI.post('/workflow/transaction/update/',postData).done(function(resultData){
                    $containerUserDialog.modal('hide');
                    $(ElScreenContainer).html('');
                    router.to({
                        typeClass:WorkflowDetail,
                        data:{
                            id:WkConfig.wkId
                        }
                    })
                });
            });
            $('#spanUserSel').off('tap').on('tap',function(){
                $('.divWkMem .selected').removeClass('selected');
                $('#spanUserSel').removeClass('tipShow');
                $('#userSel').html('')
            });
        },
        initComment:function(){
            commentShow();
            $('#btnCommentSure').off('tap').on('tap',function(){
                var postData = {
                    detail:$('#inputInsertComment').val(),
                    ofTransactionId:WkConfig.wkId,
                    userId:AppConfig.userId
                };
                WebAPI.post('/workflow/insert/reply',postData).done(function(resultData){
                    if(resultData.success){
                        commentShow();
                    }
                })
            });
            function commentShow(){
                var $container = $('#divWkComment');
                $container.html('');
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
            }
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
                    strProgress.append('   <div class="progressTime">' + progressList[i].opTime.toDate().format('yyyy-MM-dd') + '</div>');
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
            $('#btnComment').addClass('selected');
            $('#btnComment').off('tap').on('tap',function(e){
                if($(e.currentTarget).hasClass('selected')){
                    return;
                }else{
                    $('#wkAddition .partTitle').removeClass('selected');
                    $(e.currentTarget).addClass('selected');
                    $('#wkProgress').hide();
                    $('#wkComment').show();
                }
            });
            $('#btnProgress').off('tap').on('tap',function(e){
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
        initComplete:function(){
            $('#btnWkComplete').off('tap').on('tap',function(){
                var postData = {
                    userId:AppConfig.userId,
                    transId:WkConfig.wkId
                };
                WebAPI.post('/workflow/transaction/complete/',postData).done(function(){
                    if (result.success){
                        alert('edit success!')
                    }
                });
            });
        },
        close:function(){
            WkConfig.wkInfo = null;
            //CssAdapter.clearIndexMain();
        }
    };
    return WorkflowDetail;
})();