 /* Created by win7 on 2015/10/27.
 */
var WorkflowAdd = (function(){
    var _this;
    function WorkflowAdd(){
        _this = this;
    }
    WorkflowAdd.navOptions = {
        top: '<div class="topNavTitle" i18n="appDashboard.workflow.WORKFLOW_CREATE"></div>',
        bottom:true,
        backDisable:false,
        module:'workflow'
    };
    WorkflowAdd.prototype = {
        show:function(){
            $.ajax({url:'static/app/dashboard/views/workflow/workflowAdd.html'}).done(function(resultHTML){
                $(ElScreenContainer).html(resultHTML);
                _this.init();
                I18n.fillArea($('#navTop'));
                I18n.fillArea($('#wkAddInfo'));
                I18n.fillArea($('#workflowAddBtn'));
                I18n.fillArea($('#wkUserDialog'));
            });
        },
        init:function(){
            //_this.initUploadImg();
            _this.initUserShow();
            _this.initDeadline();
            _this.initImportance();
            _this.initExecutor();
            _this.initVerifier();
            _this.initWatcher();
            _this.initTeam();
            _this.initCollection();
            _this.initCreate();
        },
        initDeadline:function(){
            var $ctnWkDeadline = $('#wkDeadline');
            var $iptWkDeadline = $('#inputWkDeadline');
            var $ulWkDeadlinSel = $ctnWkDeadline.find('.dropdown-menu');
            $iptWkDeadline.val(new Date(new Date().valueOf() + 604800000).format('yyyy-MM-dd'));
            var offsetTime = 0;
            $ulWkDeadlinSel.on('tap',function(e){
                switch ($(e.target).attr('value')){
                    case 'd1':
                        offsetTime = 86400000;
                        break;
                    case 'd3':
                        offsetTime = 259200000;
                        break;
                    case 'w1':
                        offsetTime = 604800000;
                        break;
                    case 'w2':
                        offsetTime = 1209600000;
                        break;
                    default :
                        break;
                }
                $iptWkDeadline.val(new Date(new Date().valueOf() + offsetTime).format('yyyy-MM-dd'))
            })
        },
        initImportance:function(){
            var $ctnWkImportance = $('#wkImportance');
            var $iptWkImportance = $('#inputWkImportance');
            var $ulWkImportanceSel = $ctnWkImportance.find('.dropdown-menu');
            $iptWkImportance.attr('value','0').text(I18n.resource.appDashboard.workflow.NORMAL);
            var importance = {
                value:0,
                name:I18n.resource.appDashboard.workflow.NORMAL
            };
            $ulWkImportanceSel.on('tap',function(e){
                var target= $(e.target);
                $iptWkImportance.attr('value',target.attr('value')).text(target.text());
            })
        },
        initUploadImg:function(){
            var $inputWkImg = $('#inputWkImg');
            $('#spanWkImg').off('tap').on('tap',function(e){
                e.stopPropagation();
                $inputWkImg.trigger('click');
            });
            var file,fileType,reader,strDivWkImg;
            fileType = /image*/;
            $inputWkImg.off('change').on('change',function(e){
                file = e.currentTarget.files[0];
                if (!file.type.match(fileType)) {
                    return;
                }
                reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function(e){
                    strDivWkImg = new StringBuilder();
                    strDivWkImg.append('<div class="divWkImg">');
                    strDivWkImg.append('    <img class="imgWkImg" src=" + e.target.result + ">');
                    strDivWkImg.append('    <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>');
                    strDivWkImg.append('</div>')
                };
            });
            $('wkImg').off('touchstart').on('touchstart','.imgWkImg',function(e){
                $(e.currentTarget).parent().remove();
            });
        },
        initExecutor:function(){
            $('#wkExecutor').off('tap').on('tap',function(e){
                if($(e.target).hasClass('inputWkExecutor')){
                    $(e.target).remove();
                    if ($(e.currentTarget).find('.inputWkExecutor').length ==0 ){
                        $(e.currentTarget).find('.ctnUserShow').append('<span id="executorTip" class="inputWkExecutor" i18n="appDashboard.workflow.NO_CHOICE">'+ I18n.resource.appDashboard.workflow.NO_CHOICE + '</span>')
                    }
                }else if($(e.target).hasClass('btnSel')){
                    var id = $('.inputWkExecutor').attr('user-to');
                    var selectList = [];
                    if (!document.getElementById('executorTip')) {
                        for (var i = 0; i < WkConfig.userDialog.length; i++) {
                            if (WkConfig.userDialog[i].id == id) {
                                WkConfig.userDialog[i].index = i;
                                selectList.push(WkConfig.userDialog[i]);
                                break;
                            }
                        }
                    }
                    var selPage = new SelectPage({
                        type:'user',
                        mode:'radio',
                        ctn:document.getElementById('ctnUserSel'),
                        list:WkConfig.userDialog,
                        screen:_this,
                        selectList:selectList,
                        callBack:function(result){
                            $('#ctnWkExecutor').html('');
                            if (result.length == 0){
                                $('#ctnWkExecutor').append('<span id="executorTip" class="inputWkExecutor" i18n="appDashboard.workflow.NO_CHOICE">未选择</span>')
                            }else {
                                for (var i = 0; i < result.length ; i++){
                                    $('#ctnWkExecutor').append('<span class="zepto-ev inputWkExecutor" user-to="' + result[i].id + '">' + result[i].userfullname +
                                        '</span>')
                                }
                            }
                        }
                    })
                    selPage.show();
                }
            });
        },
        initVerifier:function(){
            $('#wkVerifier').off('tap').on('tap',function(e){
                //if ($(e.target).hasClass('userRemove')){
                //    $(e.target).parent().remove();
                //    if($('.inputWkVerifier').length <= 0){
                //        $(e.currentTarget).append('<span id="verifierTip" class="inputVerifier" i18n="appDashboard.workflow.NO_CHOICE">未选择</span>')
                //    }
                //}else {
                if($(e.target).hasClass('inputWkVerifier')){
                    $(e.target).remove();
                    if ($(e.currentTarget).find('.inputWkVerifier').length ==0 ){
                        $(e.currentTarget).find('.ctnUserShow').append('<span id="verifierTip" class="inputWkVerifier" i18n="appDashboard.workflow.NO_CHOICE">'+ I18n.resource.appDashboard.workflow.NO_CHOICE + '</span>')
                    }
                }else if($(e.target).hasClass('btnSel')) {
                    var id = [];
                    var inputVerifier = $('.inputWkVerifier');
                    for (var i = 0; i < inputVerifier.length; i++) {
                        id.push(inputVerifier.eq(i).attr('user-to'))
                    }
                    var selectList = [];
                    if (!document.getElementById('verifierTip')) {
                        for (var i = 0; i < WkConfig.userDialog.length; i++) {
                            for (var j = 0; j < id.length; j++) {
                                if (WkConfig.userDialog[i].id == id[j]) {
                                    WkConfig.userDialog[i].index = i;
                                    selectList.push(WkConfig.userDialog[i]);
                                    break;
                                }
                            }
                        }
                    }
                    var selPage = new SelectPage({
                        type:'user',
                        mode:'check',
                        ctn:document.getElementById('ctnUserSel'),
                        list:WkConfig.userDialog,
                        screen:_this,
                        selectList:selectList,
                        callBack:function(result){
                            $('#ctnWkVerifier').html('');
                            if (result.length == 0){
                                $('#ctnWkVerifier').append('<span id="verifierTip" class="inputWkVerifier" i18n="appDashboard.workflow.NO_CHOICE">未选择</span>')
                            }else {
                                for (var i = 0; i < result.length ; i++){
                                    $('#ctnWkVerifier').append('<span class="zepto-ev inputWkVerifier" user-to="' + result[i].id + '">' + result[i].userfullname +
                                        '</span>')
                                }
                            }
                        }
                    });
                    selPage.show();
                }
                //}
            });
        },
        initWatcher:function(){
            $('#wkWatcher').off('tap').on('tap',function(e){
                //if ($(e.target).hasClass('userRemove')){
                //    $(e.target).parent().remove();
                //    if($('.inputWkWatcher').length <= 0){
                //         $(e.currentTarget).append('<span id="watcherTip" class="inputWkWatcher" i18n="appDashboard.workflow.NO_CHOICE">未选择</span>');
                //    }
                //}else {
                if($(e.target).hasClass('inputWkWatcher')){
                    $(e.target).remove();
                    if ($(e.currentTarget).find('.inputWkWatcher').length ==0 ){
                        $(e.currentTarget).find('.ctnUserShow').append('<span id="watcherTip" class="inputWkWatcher" i18n="appDashboard.workflow.NO_CHOICE">'+ I18n.resource.appDashboard.workflow.NO_CHOICE + '</span>')
                    }
                }else  if($(e.target).hasClass('btnSel')){
                    var id = [];
                    var inputWatcher = $('.inputWkWatcher');
                    for (var i = 0; i < inputWatcher.length; i++) {
                        id.push(inputWatcher.eq(i).attr('user-to'))
                    }
                    var selectList = [];
                    if (!document.getElementById('watcherTip')) {
                        for (var i = 0; i < WkConfig.userDialog.length; i++) {
                            for (var j = 0; j < id.length; j++) {
                                if (WkConfig.userDialog[i].id == id[j]) {
                                    WkConfig.userDialog[i].index = i;
                                    selectList.push(WkConfig.userDialog[i]);
                                    break;
                                }
                            }
                        }
                    }
                    var selPage = new SelectPage({
                        type:'user',
                        mode:'check',
                        ctn:document.getElementById('ctnUserSel'),
                        list:WkConfig.userDialog,
                        screen:_this,
                        selectList:selectList,
                        callBack:function(result){
                            $('#ctnWkWatcher').html('');
                            if (result.length == 0){
                                $('#ctnWkWatcher').append('<span id="watcherTip" class="inputWkWatcher" i18n="appDashboard.workflow.NO_CHOICE">未选择</span>')
                            }else {
                                for (var i = 0; i < result.length ; i++){
                                    $('#ctnWkWatcher').append('<span class="zepto-ev inputWkWatcher" user-to="' + result[i].id + '">' + result[i].userfullname +
                                        '</span>')
                                }
                            }
                        }
                    });
                    selPage.show();
                }
                //}
            });
        },
        initUserShow:function(){
            WebAPI.get('/workflow/group/user_dialog_list/' + AppConfig.userId).done(function(resultData){
                var userList = resultData.data;
                WkConfig.userDialog = userList;
            });
        },
        initUserSel:function(type,id){

        },
        initTeam:function(){
            var $team = $('#inputWkTeam');
            var $ulWkTeam = $('#wkTeam').find('.dropdown-menu');
            var option;
            for (var i = 0; i< WkConfig.groupList.joined.length;i++){
                if(!WkConfig.groupList.joined)break;
                $ulWkTeam.append('<li class="zepto-ev" groupId="' + WkConfig.groupList.joined[i].id + '">' + WkConfig.groupList.joined[i].name + '</li>');
            }
            for (var i = 0; i< WkConfig.groupList.created.length;i++){
                $ulWkTeam.append('<li class="zepto-ev" groupId="' + WkConfig.groupList.created[i].id + '">' + WkConfig.groupList.created[i].name + '</li>');
            }
            var groupId;
            $ulWkTeam.off('tap').on('tap',function(e){
                groupId = $(e.target).attr('groupId');
                if(groupId){
                    $team.attr('value',groupId).text($(e.target).text())
                }
            });
            if($ulWkTeam.find('li').length == 0){
                $team.parent().hide();
            }
        },
        initCollection:function(){
            var $collect = $('#wkCollection');
            var $iptCollect = $('#inputWkCollection');
            $collect.off('tap').on('tap',function(){
                if($iptCollect.attr('collect') == 'true'){
                    $iptCollect.attr('collect',false);
                    $iptCollect.removeClass('isCollect');
                }else {
                    $iptCollect.attr('collect',true);
                    $iptCollect.addClass('isCollect');
                }
            });
        },
        initCreate:function(){
            $('#btnAddWk').off('tap').on('tap',function(){
                var dueData = $('#inputWkDeadline').val();
                if (new Date(dueData) == 'Invalid Date'){
                    //new Alert($("#divAlert"), "danger", I18n.resource.appDashboard.project.TIPS2).show().close();
                    window.plugins && window.plugins.toast.show(I18n.resource.appDashboard.project.TIPS2, 'short', 'center');
                    return;
                }
                var $inputVerifier = $('.inputWkVerifier'),arrVerifier = [];
                for (var i =0 ;i < $inputVerifier.length; i++){
                    arrVerifier.push($inputVerifier.eq(i).attr('user-to'))
                }
                var $inputWatcher = $('.inputWkWatcher'),arrWatcher= [];
                for (var i =0 ;i < $inputWatcher.length; i++){
                    if($inputWatcher.eq(i).attr('user-to')) {
                        arrWatcher.push($inputWatcher.eq(i).attr('user-to'))
                    }
                }
                var postData = {
                    collection:$('#inputWkCollection').attr('collect'),
                    critical:$('#inputWkImportance').attr('value'),
                    detail:$('#inputWkDetail').val(),
                    dueDate:dueData,
                    'executor[]':[$('.inputWkExecutor').attr('user-to')],
                    groupId:$('#inputWkTeam').attr('value'),
                    title:$('#inputWkTitle').val(),
                    userId:AppConfig.userId,
                    'verifiers[]':arrVerifier,
                    'watchers[]':arrWatcher
                };
                SpinnerControl.show();
                WebAPI.post('/workflow/transaction/new/',postData).done(function(resultData){
                    if(resultData.success) {
                        WkConfig.refreshTime = new Date(0);
                        router.to({
                            typeClass: WorkflowList,
                            data: {
                                id: resultData.data
                            }
                        })
                    }
                }).always(function() {
                        SpinnerControl.hide();
                    }
                );
            });

        },
        close:function(){

        }
    };
    return WorkflowAdd;
})();