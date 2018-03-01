/**
 * Created by win7 on 2015/10/29.
 */
var WorkflowDetail = (function(){
    var _this = this;
    function WorkflowDetail(data){
        _this = this;
        _this.SelectPage = undefined;
        if (data && data.id){
            WkConfig.wkId = data.id;
            if (data.info){
                WkConfig.wkInfo = data.info;
            }
            if (data.detail){
                _this.wkDetail = data.detail;
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
            _this.SelectPage = new SelectPage({
                type:'user',
                mode:'radio',
                ctn:document.getElementById('ctnUserSel'),
                screen:_this
            });
            if(_this.wkDetail){
                WkConfig.wkDetail = _this.wkDetail;
                WkConfig.wkInfo = _this.wkDetail;
                _this.initData(WkConfig.wkDetail);
                _this.initWkOperate();
            }else {
                if (WkConfig.wkInfo) {
                    _this.initData(WkConfig.wkInfo);
                    WebAPI.post('/workflow/transaction/' + WkConfig.wkId, {user_id: AppConfig.userId}).done(function (resultData) {
                        WkConfig.wkDetail = resultData.data;
                        WkConfig.wkInfo = WkConfig.wkDetail;
                        _this.initWkOperate();
                    });
                } else {
                    WebAPI.post('/workflow/transaction/' + WkConfig.wkId, {user_id: AppConfig.userId}).done(function (resultData) {
                        WkConfig.wkDetail = resultData.data;
                        WkConfig.wkInfo = WkConfig.wkDetail;
                        _this.initData(WkConfig.wkDetail);
                        _this.initWkOperate();
                    });
                }
            }
            _this.initComment();
            //_this.initProgress();
            _this.initAdditionToggle();
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
            $('#wkStatus .partContent').html(_this.getStatus(WkConfig.wkInfo.statusId));
            $('#detailTitle').html(detail.title);
            $('#detailContent').text(detail.detail);
            $('#wkDeadline .partContent').html(detail.dueDate.toDate().format('yyyy-MM-dd'));
        },
        getStatus:function(id){
            var strStatus;
            switch (id){
                case 0:
                    strStatus = I18n.resource.appDashboard.workflow.STATUS_0;
                    break;
                case 1:
                    strStatus = I18n.resource.appDashboard.workflow.STATUS_1;
                    break;
                case 2:
                    strStatus = I18n.resource.appDashboard.workflow.STATUS_2;
                    break;
                case 3:
                    strStatus = I18n.resource.appDashboard.workflow.STATUS_3;
                    break;
                case 4:
                    strStatus = I18n.resource.appDashboard.workflow.STATUS_4;
                    break;
                case 5:
                    strStatus = I18n.resource.appDashboard.workflow.STATUS_5;
                    break;
                case 6:
                    strStatus = I18n.resource.appDashboard.workflow.STATUS_6;
                    break;
                case 7:
                    strStatus = I18n.resource.appDashboard.workflow.STATUS_7;
                    break;
                default :
                    strStatus = '';
                    break;
            }
            return strStatus;
        },
        initWkOperate:function(){
            //$('.divBtnWrap').hide();
            if (WkConfig.wkDetail.creatorID == AppConfig.userId){
                switch (WkConfig.wkDetail.statusId) {
                    case 0://新创建
                    case 4://停止后验证不通过
                    case 7://完成验证不通过
                        _this.initWkTransmit();
                        break;
                    case 1://进行中
                        _this.initWkTransmit();
                        break;
                    default:
                        break;
                }
            }
            if (WkConfig.wkDetail.executorID == AppConfig.userId) {
                switch (WkConfig.wkDetail.statusId) {
                    case 0://新创建
                    case 4://停止后验证不通过
                    case 7://完成验证不通过
                        _this.initWkStart();
                        _this.initWkTransmit();
                        break;
                    case 1://进行中
                        _this.initWkClose();
                        _this.initWkComplete();
                        _this.initWkTransmit();
                        break;
                    default:
                        break;
                }
            }
            for (var i = 0;i < WkConfig.wkDetail.verifiers.length;i++){
                if (WkConfig.wkDetail.verifiers[i].id == AppConfig.userId){
                    switch (WkConfig.wkDetail.statusId){
                        case 0://新创建
                        case 4://停止后验证不通过
                        case 7://完成验证不通过
                            _this.initWkStart();
                            _this.initWkTransmit();
                            break;
                        case 1://进行中
                            _this.initWkTransmit();
                            _this.initWkClose();
                            break;
                        case 2://点击结束 已经停止了
                        case 3://完成
                            _this.initWkVerify();
                            break;
                        case 5://完成验证不通过
                        case 6://停止后验证通过
                            _this.initWkVerify();
                            break;
                        default:
                            break;
                    }
                    break;
                }
            }
        },
        initWkStart:function(){
            var $btnWkStart = $('#btnWkStart');
            $btnWkStart.css('display','inline-block').off('tap').on('tap',function(){
                WebAPI.post('/workflow/transaction/start_trans/'+ AppConfig.userId +'/'+ WkConfig.wkDetail.id+'',
                    {user_id:AppConfig.userId}
                ).done(function(result){
                    ScreenManager.show(WorkflowDetail,{id:WkConfig.Id})
                });
            });
        },
        initWkVerify:function(){
            var $btnWkVerifyPass = $('#btnWkVerifyPass');
            var $btnWkVerifyNotPass = $('#btnWkVerifyNotPass');
            if (WkConfig.wkDetail.statusId != 5 && WkConfig.wkDetail.statusId != 6) {
                $btnWkVerifyPass.css('display','inline-block').off('tap').on('tap', function () {
                    WebAPI.post('/workflow/transaction/pass_verify/',
                        {
                            transId: WkConfig.wkId,
                            userId: AppConfig.userId
                        }
                    ).done(function (result) {
                            ScreenManager.show(WorkflowDetail, {id: WkConfig.Id})
                        })
                });
            }
            if (WkConfig.wkDetail.statusId != 4 && WkConfig.wkDetail.statusId != 7) {
                $btnWkVerifyNotPass.css('display','inline-block').off('tap').on('tap', function () {
                    WebAPI.post('/workflow/transaction/not_pass_verify/',
                        {
                            transId: WkConfig.wkId,
                            userId: AppConfig.userId
                        }
                    ).done(function (result) {
                            ScreenManager.show(WorkflowDetail, {id: WkConfig.Id})
                        })
                });
            }
        },
        initWkClose:function(){
            var $btnWkEnd = $('#btnWkEnd');
            $btnWkEnd.css('display','inline-block').off('tap').on('tap',function(){
                WebAPI.post('/workflow/transaction/close_task/' + AppConfig.userId +'/' + WkConfig.wkId,
                    {user_id:AppConfig.userId}
                ).done(function(result){
                        ScreenManager.show(WorkflowDetail,{id:WkConfig.Id})
                    })
            })
        },
        initWkTransmit:function(){
            $('#btnWkTransmit').css('display','inline-block').off('tap').on('tap',function(){
                SpinnerControl.show();
                WebAPI.get('/workflow/group/user_dialog_list/' + AppConfig.userId).done(function(resultData){
                    WkConfig.userDialog = resultData.data;
                    _this.SelectPage.setList(WkConfig.userDialog);
                    _this.SelectPage.setCallBack(transmitSure);
                    _this.SelectPage.show();
                }).always(function(){
                    SpinnerControl.hide();
                });
            });
            function transmitSure(result){
                //var arrVerifier=[],arrWatcher=[];
                //for(var i= 0; i < WkConfig.wkDetail.verifiers.length;i++){
                //    arrVerifier.push(WkConfig.wkDetail.verifiers[i].id);
                //}
                //for(var i= 0; i < WkConfig.wkDetail.watchers.length;i++){
                //    arrWatcher.push(WkConfig.wkDetail.watchers[i].id);
                //}
                var postData = {
                    new:result[0],
                    old:WkConfig.wkDetail.executor
                };
                WebAPI.post('/workflow/transaction/update_executor/'+ AppConfig.userId + '/' + WkConfig.wkId,postData).done(function(resultData){
                    //$modal.modal('hide');
                    $(ElScreenContainer).html('');
                    ScreenManager.show(WorkflowDetail,{id:WkConfig.Id})
                });
            }
        },
        initComment:function(){
            commentShow();
            autoTextarea(document.getElementById('inputInsertComment'));
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
                });
                $('#inputInsertComment').val('');
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
                        strReply.append('   <div class="replyUser text">' + replyList[i].userfullname + '</div>');
                        strReply.append('   <div class="replyTime additionText">' + replyList[i].replyTime + '</div>');
                        strReply.append('   <div class="replyDetail text">' + replyList[i].detail + '</div>');
                        strReply.append('</div>');
                        $container.append(strReply.toString());
                    }
                });
            }
        },
        initProgress:function(){
            var $container = $('#wkProgress').html('');
            var strProgress,status;
            WebAPI.get('/workflow/transaction/get_progress/' + WkConfig.wkId).done(function(result){
               var progressList = result.data;
                for (var i = 0;i < progressList.length;i++){
                    strProgress = new StringBuilder();
                    switch (progressList[i].op){
                        case 'start'://开始了任务
                            status = I18n.resource.appDashboard.workflow.OP_START;
                            break;
                        case 'pause'://开始了任务
                            status = I18n.resource.appDashboard.workflow.OP_PAUSE;
                            break;
                        case 'complete'://完成了任务
                            status = I18n.resource.appDashboard.workflow.OP_COMPLETE;
                            break;
                        case 'restart'://重启了任务
                            status = I18n.resource.appDashboard.workflow.OP_RESTART;
                            break;
                        case 'new'://创建了任务
                            status = I18n.resource.appDashboard.workflow.OP_NEW;
                            break;
                        case 'edit'://编辑了任务
                            status = I18n.resource.appDashboard.workflow.OP_EDIT;
                            break;
                        case 'forward'://转发了任务
                            status = I18n.resource.appDashboard.workflow.OP_FORWARD;
                            if(progressList[i].detail){
                                var detail = JSON.parse(progressList[i].detail);
                                var subStr = I18n.resource.appDashboard.workflow.OP_FORWARD_SUB;
                                if (detail.executor && detail.executor.old && detail.executor.new){
                                    subStr = subStr.replace('<%old%>','<span style="color:darkorange">' + detail.executor.old + '</span>');
                                    subStr = subStr.replace('<%new%>','<span style="color:darkorange">' + detail.executor.new + '</span>');
                                }
                            }
                            status += '</br>' + subStr;
                            break;
                        case 'verified'://验证了任务
                            status = I18n.resource.appDashboard.workflow.OP_VERIFY;
                            break;
                        case 'not_pass'://验证了任务且未通过
                            status = I18n.resource.appDashboard.workflow.OP_NOT_PASS;
                            break;
                        case 'reply'://回复了任务
                            status = I18n.resource.appDashboard.workflow.OP_REPLY;
                            break;
                        case 'delete'://删除了任务
                            status = I18n.resource.appDashboard.workflow.OP_DELETE;
                            break;
                        case 'close'://终止了任务
                            status = I18n.resource.appDashboard.workflow.OP_CLOSE;
                            break;
                        case 'delete_reply'://删除了回复
                            status = I18n.resource.appDashboard.workflow.OP_DELETE_REPLY;
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
                    _this.initComment();
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
                    _this.initProgress();
                }
            })
        },
        initWkComplete:function(){
            var $btnWkComplete = $('#btnWkComplete');
            $btnWkComplete.css('display','inline-block').off('tap').on('tap',function(){
                if (WkConfig.wkDetail.verifiers.length == 0){
                    WebAPI.post('/workflow/transaction/pass_verify/',
                        {
                            transId:WkConfig.wkId,
                            userId:AppConfig.userId
                        }
                    ).done(function(result){
                        ScreenManager.show(WorkflowDetail,{id:WkConfig.Id})
                    })
                }else {
                    var postData = {
                        userId: AppConfig.userId,
                        transId: WkConfig.wkId
                    };
                    WebAPI.post('/workflow/transaction/complete/', postData).done(function (result) {
                        if (result.success) {
                            new Alert($(AlertContainer), "danger", I18n.resource.appDashboard.workflow.COMPLETE_SUCCESS).show().close();
                            ScreenManager.show(WorkflowDetail, {id: WkConfig.Id})
                        } else {
                            new Alert($(AlertContainer), "danger", I18n.resource.appDashboard.workflow.COMPLETE_FAIL).show().close();
                        }
                    }).fail(function () {
                        new Alert($(AlertContainer), "danger", I18n.resource.appDashboard.workflow.COMPLETE_FAIL).show().close();
                    });
                }
            });
        },
        close:function(){
            WkConfig.wkInfo = null;
            //CssAdapter.clearIndexMain();
        }
    };
    return WorkflowDetail;
})();