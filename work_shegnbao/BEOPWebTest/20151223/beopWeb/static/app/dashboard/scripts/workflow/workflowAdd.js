/**
 * Created by win7 on 2015/10/27.
 */
var WorkflowAdd = (function(){
    var _this;
    function WorkflowAdd(){
        _this = this;
    }
    WorkflowAdd.navOptions = {
        top: '<div class="topNavTitle" i18n="appDashboard.workflow.CREATE">新建工单</div>',
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
            _this.initExecutor();
            _this.initVerifier();
            _this.initWatcher();
            _this.initTeam();
            _this.initCollection();
            _this.initCreate();
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
            $('wkImg').off('touchstart').on('touchstart','.imgWkImg',function(){
                $(e.currentTarget).parent().remove();
            });
        },
        initExecutor:function(){
            $('#wkExecutor').off('tap').on('tap',function(e){
                var id = $(e.target).find('.inputWkExecutor').attr('user-to');
                _this.initUserSel('Executor',[id]);
                $('#divModal').modal('show');
            });
        },
        initVerifier:function(){
            $('#wkVerifier').off('tap').on('tap',function(e){
                if ($(e.target).hasClass('userRemove')){
                    $(e.target).parent().remove();
                    if($('.inputWkVerifier').length <= 0){
                        $(e.currentTarget).append('<span id="verifierTip" class="inputVerifier" i18n="appDashboard.workflow.NO_CHOICE">未选择</span>')
                    }
                }else {
                    var id = [];
                    var inputVerifier = $('.inputWkVerifier');
                    for (var i = 0; i < inputVerifier.length; i++) {
                        id.push(inputVerifier.eq(i).attr('user-to'))
                    }
                    _this.initUserSel('Verifier', id);
                    $('#divModal').modal('show');
                }
            });
        },
        initWatcher:function(){
            $('#wkWatcher').off('tap').on('tap',function(e){
                if ($(e.target).hasClass('userRemove')){
                    $(e.target).parent().remove();
                    if($('.inputWkWatcher').length <= 0){
                         $(e.currentTarget).append('<span id="watcherTip" class="inputWkWatcher" i18n="appDashboard.workflow.NO_CHOICE">未选择</span>');
                    }
                }else {
                    var id = [];
                    var inputWatcher = $('.inputWkWatcher');
                    for (var i = 0; i < inputWatcher.length; i++) {
                        id.push(inputWatcher.eq(i).attr('user-to'))
                    }
                    _this.initUserSel('Watcher', id);
                    $('#divModal').modal('show');
                }
            });
        },
        initUserShow:function(){
            var $modal = $('#divModal');
            var $divModal = $modal.find('.modal-body');
            $modal.find('.modal-header').html(
                   '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\
                    <h4 class="modal-title" i18n="appDashboard.workflow.PLZ_CHOICE_PEOPLE">Please Choose People</h4>'
            );
            $modal.find('.modal-footer').html(
                     '<div id="divUserSel"></div><button type="button" id="btnSure" class="btn btn-primary zepto-ev" \i18n="appDashboard.workflow.SURE">Sure</button>\
            ');
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
            });
        },
        initUserSel:function(type,id){
            var target;
            var $modal = $('#divModal');
            var $divModal = $modal.find('.modal-body');
            var $bntSure = $('#btnSure');
            $('.divWkMem.selected').removeClass('selected');
            $('.spanUserSel').remove();
            var $divUserSel = $('#divUserSel');
            if(id) {
                for (var j = 0;j<id.length;j++) {
                    for (var i = 0; i < WkConfig.userDialog.length; i++) {
                        target = $('.divWkMem[user-to="' + id[j] + '"]');
                        if (target.length > 0) {
                            $(target).addClass('selected');
                            $divUserSel.append(
                                 '<span class="spanUserSel" user-to="' + id[j] + '">\
                                  <span class="userSel">' + target.find('.nameWkMem').html() +'</span>\
                                  </span>'
                            );
                            break;
                        }
                    }
                }
            }
            $('.divWkMem').off('tap').on('tap',function(e){
                var id = $(e.target).attr('user-to');
                if (type == 'Executor') {
                    if ($(e.target).hasClass('selected'))return;
                    $('.divWkMem.selected').removeClass('selected');
                    $(e.target).addClass('selected');
                    $('#inputWk' + type).html($(e.target).find('.nameWkMem').html()).attr('user-to', id);
                    if ($('.userSel').length == 0){
                    $divUserSel.append(
                           '<span class="spanUserSel zepto-ev">\
                           <span class="userSel"></span>\
                           <span class="tipRemove zepto-ev" class="glyphicon glyphicon-remove"></span>\
                           </span>')
                    }
                    $('.userSel').html($(e.target).find('.nameWkMem').html()).parent().addClass('tipShow').attr('user-to',id);
                }else{
                    if ($(e.target).hasClass('selected')){
                        $(e.target).removeClass('selected');
                        $('.spanUserSel[user-to="' + id + '"]').remove();
                    }else {
                        $(e.target).addClass('selected');
                        var $spanUserSel =$(
                              '<span class="spanUserSel zepto-ev">\
                              <span class="userSel"></span>\
                              <span class="tipRemove zepto-ev" class="glyphicon glyphicon-remove"></span>\
                                                              </span>'
                        );
                        $spanUserSel.find('.userSel').html($(e.target).find('.nameWkMem').html()).parent().addClass('tipShow').attr('user-to',id);
                        $divUserSel.append($spanUserSel);
                    }
                }
            });
            $bntSure.off('tap').on('tap',function(e){
                $('.inputWk' + type).remove();
                $('#' + type.toLowerCase() + 'Tip').remove();
                var $divType = $('#wk' + type);
                var $memSel = $('.divWkMem.selected');
                if ($memSel.length == 0){
                    $divType.append('<span id="'+ type.toLowerCase()+ 'Tip" class="inputWk' + type +'" i18n="appDashboard.workflow.NO_CHOICE">未选择</span>')
                }else {
                    for (var i = 0; i < $memSel.length ; i++){
                        $('#wk' + type).append('<span class="inputWk' + type + '" user-to="' + $memSel.eq(i).attr('user-to') + '">' + $memSel.eq(i).find('.nameWkMem').html() +
                            '<span class="userRemove glyphicon glyphicon-remove">\
                            </span>')
                    }
                }
                $('#divModal').modal('hide');                        
            });
            $modal.find('.modal-footer').off('touchstart').on('touchstart','#spanUserSel',function(e){
                 var id = $(e.target).parent().attr('user-to');
                 $(e.target).parent().remove();
                 $('.divWkMem[user-to="' + id + '"]').removeClass('selected');
            })
        },
        initTeam:function(){
            var $team = $('#inputWkTeam');
            var option;
            for (var i = 0; i< WkConfig.groupList.joined.length;i++){
                option = new Option(WkConfig.groupList.joined[i].name,WkConfig.groupList.joined[i].id);
                $team[0].options.add(option);
            }
            for (var i = 0; i< WkConfig.groupList.created.length;i++){
                option = new Option(WkConfig.groupList.created[i].name,WkConfig.groupList.created[i].id);
                $team[0].options.add(option);
            }
            if($team.find('option').length == 0){
                $team.parent().hide();
            }
        },
        initCollection:function(){
            var $collect = $('#inputWkCollection');
            $collect.off('tap').on('tap',function(){
                if($collect.attr('collect') == 'true'){
                    $collect.attr('collect',false);
                    $collect.removeClass('glyphicon-star').addClass('glyphicon-star-empty');
                }else {
                    $collect.attr('collect',true);
                    $collect.removeClass('glyphicon-star-empty').addClass('glyphicon-star');
                }
            });
        },
        initCreate:function(){
            $('#btnAddWk').off('tap').on('tap',function(){
                var dueData = $('#inputWkDeadline').val();
                if (new Date(dueData) == 'Invalid Date'){
                    new Alert($("#divAlert"), "danger", I18n.resource.appDashboard.project.TIPS2).show().close();
                    return;
                }
                var $inputVerifier = $('.inputWkVerifier'),arrVerifier = [];
                for (var i =0 ;i < $inputVerifier.length; i++){
                    arrVerifier.push($inputVerifier.eq(i).attr('user-to'))
                }
                var $inputWatcher = $('.inputWkWatcher'),arrWatcher= [];
                for (var i =0 ;i < $inputWatcher.length; i++){
                    arrWatcher.push($inputWatcher.eq(i).attr('user-to'))
                }
                var postData = {
                    collection:$('#inputWkCollection').attr('collect'),
                    critical:$('#inputWkImportance').val(),
                    detail:$('#inputWkDetail').val(),
                    dueDate:dueData,
                    'executor[]':[$('#inputWkExecutor').attr('user-to')],
                    groupId:$('#inputWkTeam').val(),
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