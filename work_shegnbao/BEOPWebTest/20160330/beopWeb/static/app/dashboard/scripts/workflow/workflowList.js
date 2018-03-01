/**
 * Created by win7 on 2015/10/21.
 */
var WorkflowList = (function(){
    var _this = this;
    function WorkflowList(){
        _this = this;
        if (!WkConfig.wkType){
            WkConfig.wkType = 'inProgress';
        }
        _this.tempWkList = [].concat(WkConfig.wkList);
        _this.tempWkContainer = undefined;
        _this.sortType = true;
    }
    WorkflowList.navOptions = {
        top:
        '<div class="topNavTitle"></div>'+
        '<span id="btnWorkFlowAdd" class="topNavRight topTool zepto-ev"><span id="iconWorkFlowAdd" class="btnIcon"></span></span>',
        bottom:true,
        backDisable:true,
        module:'workflow'
    };
    WorkflowList.prototype = {
        show:function(){
            $.ajax({url:'static/app/dashboard/views/workflow/workflowList.html'}).done(function(resultHTML){
                $(ElScreenContainer).html(resultHTML);
                $('.navTool .selected').removeClass('selected');
                $('#btnWorkFlow').addClass('selected');
                localStorage.setItem('module','workflow');
                _this.init();
                I18n.fillArea($('#navTop'));
                I18n.fillArea($('#divWorkflowTool'));
            });
        },
        init:function(){
            _this.initWorkflowTool();
            _this.initWkTypeSelect();
            if (!WkConfig.refreshTime || new Date() - WkConfig.refreshTime > WkConfig.refreshInterval || true) {
                _this.initWorkflowList(WkConfig.wkType);
                //_this.initCreatedWorkflow();
                //_this.initFinishedWorkflow();
                //_this.initJoinedWorkflow();
                WkConfig.refreshTime = new Date();
            }else{
                _this.initWorkflowList(WkConfig.wkType);
                //_this.initWorkflowList(WkConfig.wkList.created,$('#divCreated'),'created',true);
                //_this.initWorkflowList(WkConfig.wkList.finished,$('#divFinished'),'finished',true);
                //_this.initWorkflowList(WkConfig.wkList.joined,$('#divJoined'),'joined',true);
            }
            _this.initGroupAndTag();
            _this.initSort();
            _this.initSearch();
            //_this.initRefresh()
        },
        initGroupAndTag:function(){
            $.when(
                WebAPI.get('/workflow/users/group/' + AppConfig.userId).done(function(resultData){
                WkConfig.groupList = {
                    joined:resultData.data.joined,
                    created:resultData.data.created
                }
                }),
                WebAPI.get('/workflow/tag/user/'+ AppConfig.userId).done(function(resultData){
                    WkConfig.tagList = resultData.data;
                })
            ).done(function(){
                    _this.initAddWk();
                })
        },
        initWorkflowList:function(type,isExist){
            var $container = $('#divWkList');
            var $unit;
            var strWorkFlow;
            $container.html('');
            var url ='';
            var record;
            var $navTopTitle = $('.topNavTitle');
            switch (type){
                case 'inProgress':
                    url = '/workflow/transaction/working/'+AppConfig.userId + '/1/'+ WkConfig.defaultSize ;
                    $navTopTitle.html(I18n.resource.appDashboard.workflow.IN_PROGRESS);
                    break;
                case 'created':
                    url = '/workflow/transaction/get_new_created/'+AppConfig.userId + '/1/'+ WkConfig.defaultSize ;
                    $navTopTitle.html(I18n.resource.appDashboard.workflow.HAS_CREATED);
                    break;
                case 'doing':
                    url = '/workflow/transaction/get_started_trans/'+AppConfig.userId + '/1/'+ WkConfig.defaultSize ;
                    $navTopTitle.html(I18n.resource.appDashboard.workflow.IN_DOING);
                    break;
                case 'waitVerifier':
                    url = '/workflow/transaction/get_wait_verify_trans/'+AppConfig.userId + '/1/'+ WkConfig.defaultSize ;
                    $navTopTitle.html(I18n.resource.appDashboard.workflow.WAITING_VERIFIER);
                    break;
                case 'myVerifier':
                    url = '/workflow/transaction/waitMeToVerifier/'+AppConfig.userId + '/1/'+ WkConfig.defaultSize ;
                    $navTopTitle.html(I18n.resource.appDashboard.workflow.MY_VERIFIER);
                    break;
                case 'createdByMe':
                    url = '/workflow/transaction/created_by/' + AppConfig.userId + '/1/' + WkConfig.defaultSize;
                    $navTopTitle.html(I18n.resource.appDashboard.workflow.CREATED_BY_ME);
                    break;
                case 'finishedByMe':
                    url = '/workflow/transaction/finished_by/' + AppConfig.userId + '/1/' + WkConfig.defaultSize;
                    $navTopTitle.html(I18n.resource.appDashboard.workflow.COMPLETE_BY_ME);
                    break;
                case 'involvedByMe':
                    url = '/workflow/transaction/joined_by/' + AppConfig.userId + '/1/' + WkConfig.defaultSize;
                    $navTopTitle.html(I18n.resource.appDashboard.workflow.INVOLVED_BY_ME);
                    break;
                default :
                    break;
            }
            SpinnerControl.show();
            WebAPI.post(url).done(function(resultData) {
                if (resultData.data && resultData.data.records) {
                    record = resultData.data.records;
                    WkConfig.wkList = record;
                    _this.tempWkList = record;
                }else{
                    return;
                }
                if (isExist) {
                    for (var i = 0; i < record.length; i++) {
                        strWorkFlow = new StringBuilder();
                        strWorkFlow.append('<div class="liWkRecord zepto-ev" id="' + record[i].id + '">');
                        strWorkFlow.append('<div class="divHead">');
                        strWorkFlow.append('<div class="wkTitle title">' + record[i].title + '</div>');
                        strWorkFlow.append('<div class="wkDate additionText">' + record[i].dueDate.toDate().format('yyyy-MM-dd') + '</div>');
                        strWorkFlow.append('</div>');
                        strWorkFlow.append('<div class="divDetail">');
                        strWorkFlow.append('<div class="wkEmergency wkEmergency_' + record[i].critical + '">\
                            <svg x="0px" y="0px" width="1024px" height="1024px" viewBox="0 0 1024 1024" enable-background="new 0 0 1024 1024" xml:space="preserve">\
                                <path class="svgpath" data-index="path_0" fill="#272636" d="M123.392 583.232l327.296 0-113.792 427.456 498.944-569.984L508.544 440.704l113.536-427.52L123.392 583.232zM123.392 583.232" />\
                            </svg>\
                        </div>');
                        strWorkFlow.append('<div class="wkInfo text">' + record[i].detail + '</div>');
                        if (record[i].creator_info) {
                            strWorkFlow.append('<div class="wkCreator additionText" i18n="appDashboard.workflow.CREATOR">' + I18n.resource.appDashboard.workflow.CREATOR + ': ' + record[i].creator_info.userfullname + '</div>');
                        }
                        //strWorkFlow.append('<span class="spAssignArrow glyphicon glyphicon-chevron-down" aria-hidden="true"></span>');
                        strWorkFlow.append('<div class="wkExecutor additionText" i18n="appDashboard.workflow.EXECUTOR">' + I18n.resource.appDashboard.workflow.EXECUTOR + ': ' + record[i].executorName + '</div>');
                        strWorkFlow.append('<div class="wkDate additionText">' + record[i].dueDate.toDate().format('yyyy-MM-dd') + '</div>');
                        strWorkFlow.append('<div class="wkGetStatus status_' + record[i].statusId + '">' + _this.initStatus(record[i].statusId) + '</div>');
                        strWorkFlow.append('</div>');
                        strWorkFlow.append('</div>');
                        $unit = $(strWorkFlow.toString());
                        $unit.find('.wkInfo').text(record[i].detail);
                        $container.append($unit);
                    }
                } else {
                    for (var i = 0; i < record.length; i++) {
                        strWorkFlow = new StringBuilder();
                        strWorkFlow.append('<div class="liWkRecord zepto-ev" id="' + record[i].id + '">');
                        strWorkFlow.append('<div class="divHead">');
                        strWorkFlow.append('<div class="wkTitle title">' + record[i].title + '</div>');
                        strWorkFlow.append('<div class="wkDate additionText">' + record[i].dueDate.toDate().format('yyyy-MM-dd') + '</div>');
                        strWorkFlow.append('</div>');
                        strWorkFlow.append('<div class="divDetail">');
                        strWorkFlow.append('<div class="wkEmergency wkEmergency_' + record[i].critical + '">\
                            <svg x="0px" y="0px" width="1024px" height="1024px" viewBox="0 0 1024 1024" enable-background="new 0 0 1024 1024" xml:space="preserve">\
                                <path class="svgpath" data-index="path_0" fill="#272636" d="M123.392 583.232l327.296 0-113.792 427.456 498.944-569.984L508.544 440.704l113.536-427.52L123.392 583.232zM123.392 583.232" />\
                            </svg>\
                        </div>');
                        strWorkFlow.append('<div class="wkInfo text">' + record[i].detail + '</div>');
                        if (record[i].creator_info) {
                            strWorkFlow.append('<div class="wkCreator additionText" i18n="appDashboard.workflow.CREATOR">' + I18n.resource.appDashboard.workflow.CREATOR + ': ' + record[i].creator_info.userfullname + '</div>');
                        }
                        //strWorkFlow.append('<span class="spAssignArrow glyphicon glyphicon-chevron-down" aria-hidden="true"></span>');
                        strWorkFlow.append('<div class="wkExecutor additionText" i18n="appDashboard.workflow.EXECUTOR">' + I18n.resource.appDashboard.workflow.EXECUTOR + ': ' + record[i].executorName + '</div>');
                        strWorkFlow.append('<div class="wkGetStatus status_' + record[i].statusId + '" i18n="appDashboard.workflow.STATUS_' + record[i].statusId + '">' + _this.initStatus(record[i].statusId) + '</div>');
                        strWorkFlow.append('</div>');
                        strWorkFlow.append('</div>');
                        $unit = $(strWorkFlow.toString());
                        $unit.find('.wkInfo').text(record[i].detail);
                        $container.append($unit);
                    }
                }
                _this.initWkDetail();
            }).always(function(){
                SpinnerControl.hide();
            });
        },
        initStatus:function(statusId){
            var strStatus;
            switch (statusId){
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
        initDueDate:function(dueDate){

        },
        initWkTypeSelect:function(){
            var $workflowContainer = $('#containerWorkFlowList');
            var $backDrop = $('.backDrop');
            var $ulWkDropDown = $('.ulWkDropDown');
            var $wkTool = $('.wkTool');
            _this.sortType = true;
            $('.btnWkSelect').off('tap').on('tap',function(e){
                $('.btnWkSelect').removeClass('selected');
                $(e.currentTarget).addClass('selected');
                var $spanWkType = $('.topNavTitle');
                switch ($(e.currentTarget).attr('id')){
                    case 'btnProgress':
                        WkConfig.wkType = 'inProgress';
                        $spanWkType.html(I18n.resource.appDashboard.workflow.IN_PROGRESS);
                        break;
                    case 'btnCreated':
                        WkConfig.wkType = 'created';
                        $spanWkType.html(I18n.resource.appDashboard.workflow.HAS_CREATED);
                        break;
                    case 'btnDoing':
                        WkConfig.wkType = 'doing';
                        $spanWkType.html(I18n.resource.appDashboard.workflow.IN_DOING);
                        break;
                    case 'btnWaitVerifier':
                        WkConfig.wkType = 'waitVerifier';
                        $spanWkType.html(I18n.resource.appDashboard.workflow.WAITING_VERIFIER);
                        break;
                    case 'btnMyVerifier':
                        WkConfig.wkType = 'myVerifier';
                        $spanWkType.html(I18n.resource.appDashboard.workflow.MY_VERIFIER);
                        break;
                    case 'btnCreatedByMe':
                        WkConfig.wkType = 'createdByMe';
                        $spanWkType.html(I18n.resource.appDashboard.workflow.CREATED_BY_ME);
                        break;
                    case 'btnFinishedByMe':
                        WkConfig.wkType = 'completedByMe';
                        $spanWkType.html(I18n.resource.appDashboard.workflow.COMPLETE_BY_ME);
                        break;
                    case 'btnInvolvedByMe':
                        WkConfig.wkType = 'involvedByMe';
                        $spanWkType.html(I18n.resource.appDashboard.workflow.INVOLVED_BY_ME);
                        break;
                    default :
                        break;
                }
                $backDrop.hide();
                $workflowContainer.css('overflow','auto');
                $ulWkDropDown.hide();
                $wkTool.removeClass('on');
                _this.initWorkflowList(WkConfig.wkType);
            });
        },
        initWkDetail:function(){
            $('#divWkList').find('.liWkRecord').off('tap').on('tap',function(e){
                if (!WkConfig.groupList || !WkConfig.tagList){
                    return;
                }
                var wkId,wkDetail;
                wkId = $(e.currentTarget).attr('id');
                for (var i = 0;i < _this.tempWkList.length;i++){
                    if(_this.tempWkList[i].id == wkId){
                        wkDetail = _this.tempWkList[i];
                        _this.tempWkList[i].status = true;
                        break;
                    }
                }
                router.to({
                    typeClass:WorkflowDetail,
                    data:{
                        id:wkId,
                        info:wkDetail
                    }
                })
            });
        },
        initAddWk:function(){
            $('#btnWorkFlowAdd').off('tap').on('tap',function(){
                router.to({
                    typeClass:WorkflowAdd
                })
            });
        },
        initWorkflowTool:function(){
            var $workflowContainer = $('#containerWorkFlowList');
            var $backDrop = $('.backDrop');
            var $ulWkDropDown = $('.ulWkDropDown');
            var $wkTool = $('.wkTool');
            $wkTool.off('tap').on('tap',function(e){
                $ulWkDropDown.hide();
                $wkTool.not($(e.currentTarget)).removeClass('on');
                if(!$(e.currentTarget).hasClass('on')) {
                    $(e.currentTarget).addClass('on');
                    $(e.currentTarget).next().show();
                    $backDrop.show();
                    $workflowContainer.css('overflow','hidden');
                }else{
                    $(e.currentTarget).removeClass('on');
                    $(e.currentTarget).next().hide();
                    $backDrop.hide();
                    $workflowContainer.css('overflow','auto');
                }
                //$('#ulWkSelect').dropdown('toggle');
            });
            //$('#workflowSort').off('tap').on('tap',function(e){
            //    $ulWkDropDown.hide(400);
            //    $wkTool.not($(e.currentTarget)).removeClass('on');
            //    if(!$(e.currentTarget).hasClass('on')) {
            //        $(e.currentTarget).addClass('on');
            //        $('#ulWkSort').show(400);
            //        $backDrop.show();
            //    }else{
            //        $(e.currentTarget).removeClass('on');
            //        $('#ulWkSort').hide(400);
            //        $backDrop.hide();
            //    }
            //    //$('#ulWkSelect').dropdown('toggle');
            //});
            //$('#workflowFilter').off('tap').on('tap',function(e){
            //    $ulWkDropDown.hide(400);
            //    $wkTool.not($(e.currentTarget)).removeClass('on');
            //    if(!$(e.currentTarget).hasClass('on')) {
            //        $(e.currentTarget).addClass('on');
            //        $('#ulWkFilter').show(400);
            //        $backDrop.show();
            //    }else{
            //        $(e.currentTarget).removeClass('on');
            //        $('#ulWkFilter').hide(400);
            //        $backDrop.hide();
            //    }
            //    //$('#ulWkSelect').dropdown('toggle');
            //});
            $backDrop.off('tap').on('tap',function(e){
                $(e.currentTarget).hide();
                $ulWkDropDown.hide();
                $wkTool.removeClass('on');
                $workflowContainer.css('overflow','auto');
            })
        },
        initSort:function(){
            var $workflowContainer = $('#containerWorkFlowList');
            var $backDrop = $('.backDrop');
            var $ulWkDropDown = $('.ulWkDropDown');
            var $wkTool = $('.wkTool');
            $('#idSort').off('tap').on('tap',function(){
                sort('id');
            });
            $('#createTimeSort').off('tap').on('tap',function(){
                sort('createTime','date');
            });
            $('#deadlineSort').off('tap').on('tap',function(){
                sort('dueDate','date');
            });
            $('#emergencySort').off('tap').on('tap',function(){
                sort('critical');
            });
            $('#executorSort').off('tap').on('tap',function(){
                sort('executorId')
            });
            $('#teamSort').off('tap').on('tap',function(){
                sort('groupId')
            });
            $('#collectSort').off('tap').on('tap',function(){
                sort('star');
            });
            function sort(data,type){
                var $ctn = $('#divWkList');
                $ctn.html('');
                //var newWkList = String(_this.tempWkList).split(',');
                var newWkList = _this.tempWkList;
                var low = 0,high = newWkList.length - 1;
                var temp;
                if (type == 'date'){
                    if (_this.sortType) {
                        while (low < high) {
                            for (var i = low; i < high; ++i) {
                                if (newWkList[i][data].toDate() > newWkList[i + 1][data].toDate()) {
                                    temp = newWkList[i];
                                    newWkList[i] = newWkList[i + 1];
                                    newWkList[i + 1] = temp
                                }
                            }
                            --high;
                            for (var i = high; i > low; --i) {
                                if (newWkList[i][data].toDate() < newWkList[i - 1][data].toDate()) {
                                    temp = newWkList[i];
                                    newWkList[i] = newWkList[i - 1];
                                    newWkList[i - 1] = temp
                                }
                            }
                            ++low;
                        }
                    }else{
                        while (low < high) {
                            for (var i = low; i < high; ++i) {
                                if (newWkList[i][data].toDate() < newWkList[i + 1][data].toDate()) {
                                    temp = newWkList[i];
                                    newWkList[i] = newWkList[i + 1];
                                    newWkList[i + 1] = temp
                                }
                            }
                            --high;
                            for (var i = high; i > low; --i) {
                                if (newWkList[i][data].toDate() > newWkList[i - 1][data].toDate()) {
                                    temp = newWkList[i];
                                    newWkList[i] = newWkList[i - 1];
                                    newWkList[i - 1] = temp
                                }
                            }
                            ++low;
                        }
                    }
                }else {
                    if(_this.sortType) {
                        while (low < high) {
                            for (var i = low; i < high; ++i) {
                                if (newWkList[i][data] > newWkList[i + 1][data]) {
                                    temp = newWkList[i];
                                    newWkList[i] = newWkList[i + 1];
                                    newWkList[i + 1] = temp
                                }
                            }
                            --high;
                            for (var i = high; i > low; --i) {
                                if (newWkList[i][data] < newWkList[i - 1][data]) {
                                    temp = newWkList[i];
                                    newWkList[i] = newWkList[i - 1];
                                    newWkList[i - 1] = temp
                                }
                            }
                            ++low;
                        }
                    }else{
                        while (low < high) {
                            for (var i = low; i < high; ++i) {
                                if (newWkList[i][data] < newWkList[i + 1][data]) {
                                    temp = newWkList[i];
                                    newWkList[i] = newWkList[i + 1];
                                    newWkList[i + 1] = temp
                                }
                            }
                            --high;
                            for (var i = high; i > low; --i) {
                                if (newWkList[i][data] > newWkList[i - 1][data]) {
                                    temp = newWkList[i];
                                    newWkList[i] = newWkList[i - 1];
                                    newWkList[i - 1] = temp
                                }
                            }
                            ++low;
                        }
                    }
                }
                var strWorkFlow;
                var $unit;
                for(var i = 0;i < newWkList.length;i++){
                    strWorkFlow = new StringBuilder();
                    strWorkFlow.append('<div class="liWkRecord zepto-ev" id="' + newWkList[i].id + '">');
                    strWorkFlow.append('<div class="divHead">');
                    strWorkFlow.append('<div class="wkTitle title">' + newWkList[i].title + '</div>');
                    strWorkFlow.append('<div class="wkDate additionText">' + newWkList[i].dueDate.toDate().format('yyyy-MM-dd') + '</div>');
                    strWorkFlow.append('</div>');
                    strWorkFlow.append('<div class="divDetail">');
                    strWorkFlow.append('<div class="wkEmergency wkEmergency_' + newWkList[i].critical + '">\
                        <svg x="0px" y="0px" width="1024px" height="1024px" viewBox="0 0 1024 1024" enable-background="new 0 0 1024 1024" xml:space="preserve">\
                            <path class="svgpath" data-index="path_0" fill="#272636" d="M123.392 583.232l327.296 0-113.792 427.456 498.944-569.984L508.544 440.704l113.536-427.52L123.392 583.232zM123.392 583.232" />\
                        </svg>\
                    </div>');
                    strWorkFlow.append('<div class="wkInfo text">' + newWkList[i].detail + '</div>');
                    if (newWkList[i].creator_info) {
                        strWorkFlow.append('<div class="wkCreator additionText" i18n="appDashboard.workflow.CREATOR">' + I18n.resource.appDashboard.workflow.CREATOR + ': ' + newWkList[i].creator_info.userfullname + '</div>');
                    }
                    //strWorkFlow.append('<span class="spAssignArrow glyphicon glyphicon-chevron-down" aria-hidden="true"></span>');
                    strWorkFlow.append('<div class="wkExecutor additionText" i18n="appDashboard.workflow.EXECUTOR">' + I18n.resource.appDashboard.workflow.EXECUTOR + ': ' + newWkList[i].executorName + '</div>');
                    strWorkFlow.append('<div class="wkGetStatus status_' + newWkList[i].statusId + '" i18n="appDashboard.workflow.STATUS_' + newWkList[i].statusId + '">' + _this.initStatus(newWkList[i].statusId) + '</div>');
                    strWorkFlow.append('</div>');
                    strWorkFlow.append('</div>');
                    $unit = $(strWorkFlow.toString());
                    $unit.find('.wkInfo').text(newWkList[i].detail);
                    $ctn.append($unit);
                }
                _this.sortType = !_this.sortType;
                _this.initWkDetail();
                $backDrop.hide();
                $workflowContainer.css('overflow','auto');
                $ulWkDropDown.hide();
                $wkTool.removeClass('on');
            }
        },
        initRefresh:function(){
            var $ctn = $('#outerContainer');
            var $ctnWk = $('#containerWorkFlowList');
            var startTime,evInit,evMove;
            $ctn.off('touchstart').on('touchstart',function(e){
                var evTouch = e.originalEvent.touches[0];
                if($ctnWk[0].scrollTop == 0){
                    e.preventDefault();
                    evInit = {
                        x: evTouch.x,
                        y: evTouch.y
                    };
                }
            });
            $ctn.off('touchmove').on('touchmove',function(e){
                var evTouch = e.originalEvent.touches[0];
                evInit = {
                    x: evTouch.x,
                    y: evTouch.y
                }
            });
            $ctn.off('touchend').on('touchend',function(e){
                var evTouch = e.originalEvent.changedToucher[0];
                evInit = {
                    x: evTouch.x,
                    y: evTouch.y
                };
                console.log(e);
            })
        },
        initSearch:function(){
            $('#btnSearById').off('tap').on('tap',function(){
                var val = parseInt($('#iptSearById').val());
                if (!val){
                    new Alert($(AlertContainer), "danger", '请检查编号格式！').show().close();
                    return;
                }
                SpinnerControl.show();
                WebAPI.post('/workflow/transaction/' + val, {user_id: AppConfig.userId}).done(function(resultData){
                    if (resultData.success && resultData.data) {
                        router.to({
                            typeClass: WorkflowDetail,
                            data: {
                                id: val,
                                detail: resultData.data
                            }
                        })
                    }else{
                        new Alert($(AlertContainer), "danger", '查找不到工单，请重新输入').show().close();
                    }
                }).fail(function(){
                    new Alert($(AlertContainer), "danger", '查找不到工单，请重新输入').show().close();
                }).always(function(){
                    SpinnerControl.hide();
                });
            })
        },
        close:function(){
        }
    };
    return WorkflowList;
})();