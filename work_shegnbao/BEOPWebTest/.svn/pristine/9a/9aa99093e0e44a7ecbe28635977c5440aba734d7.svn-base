/**
 * Created by win7 on 2015/10/21.
 */
var WorkflowList = (function(){
    var _this = this;
    function WorkflowList(){
        _this = this;
        _this.wkType = 'working';
        _this.tempWkList = WkConfig.wkList.working;
        _this.tempWkContainer = undefined;
        _this.sortType = true;
    }
    WorkflowList.navOptions = {
        top:
        '<div class="topNavTitle" i18n="appDashboard.workflow.WORKFLOW_LIST"></div>'+
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
                I18n.fillArea($('#workflowTool'));
            });
        },
        init:function(){
            _this.initWkTypeSelect();
            if (!WkConfig.refreshTime || new Date() - WkConfig.refreshTime > WkConfig.refreshInterval || true) {
                _this.initWorkingWorkflow();
                _this.initCreatedWorkflow();
                _this.initFinishedWorkflow();
                _this.initJoinedWorkflow();
                WkConfig.refreshTime = new Date();
            }else{
                _this.initWorkflowList(WkConfig.wkList.working,$('#divWorking'),'working',true);
                _this.initWorkflowList(WkConfig.wkList.created,$('#divCreated'),'created',true);
                _this.initWorkflowList(WkConfig.wkList.finished,$('#divFinished'),'finished',true);
                _this.initWorkflowList(WkConfig.wkList.joined,$('#divJoined'),'joined',true);
            }
            _this.initGroupAndTag();
            _this.initAddWk();
            _this.initSort();
        },
        initWorkingWorkflow:function(){
            SpinnerControl.show();
            WebAPI.post('/workflow/transaction/working/'+AppConfig.userId + '/1/'+ WkConfig.defaultSize).done(function(resultData){
                SpinnerControl.hide();
                _this.initWorkflowList(resultData.data.records,$('#divWorking'),'working');
            });
        },
        initCreatedWorkflow:function(){
            WebAPI.post('/workflow/transaction/created_by/' + AppConfig.userId + '/1/' + WkConfig.defaultSize).done(function(resultData){
                _this.initWorkflowList(resultData.data.records,$('#divCreated'),'created');
            })
        },
        initFinishedWorkflow:function(){
            WebAPI.post('/workflow/transaction/finished_by/' + AppConfig.userId + '/1/' + WkConfig.defaultSize).done(function(resultData){
                _this.initWorkflowList(resultData.data.records,$('#divFinished'),'finished');
            })
        },
        initJoinedWorkflow:function(){
            WebAPI.post('/workflow/transaction/joined_by/' + AppConfig.userId + '/1/' + WkConfig.defaultSize).done(function(resultData){
                _this.initWorkflowList(resultData.data.records,$('#divJoined'),'joined');
            })
        },
        initGroupAndTag:function(){
            WebAPI.get('/workflow/users/group/' + AppConfig.userId).done(function(resultData){
                WkConfig.groupList = {
                    joined:resultData.data.joined,
                    created:resultData.data.created
                }
            });
            WebAPI.get('/workflow/tag/user/'+ AppConfig.userId).done(function(resultData){
                WkConfig.tagList = resultData.data;
            });
        },
        initWorkflowList:function(resultData,container,type,isExist){
            var record = resultData;
            var $container = container;
            var strWorkFlow;
            var tempWkList,tempContainer;
            $container.html('');
            switch (type){
                case 'working':
                    tempWkList = WkConfig.wkList.working;
                    tempContainer = $('#divWorking');
                    break;
                case 'created':
                    tempWkList = WkConfig.wkList.created;
                    tempContainer = $('#divCreated');
                    break;
                case 'finished':
                    tempWkList = WkConfig.wkList.finished;
                    tempContainer = $('#divFinished');
                    break;
                case 'joined':
                    tempWkList = WkConfig.wkList.joined;
                    tempContainer = $('#divJoined');
                    break;
            }
            if(isExist) {
                for (var i = 0; i < record.length; i++) {
                    strWorkFlow = new StringBuilder();
                    strWorkFlow.append('<div class="liWkRecord zepto-ev" id="' + record[i].id + '">');
                    strWorkFlow.append('<div class="wkEmergency wkEmergency_' + record[i].critical + '"></div>');
                    strWorkFlow.append('<div class="wkTitle">' + record[i].title + '</div>');
                    strWorkFlow.append('<div class="wkInfo">' + record[i].detail + '</div>');
                    strWorkFlow.append('<div class="wkUser">' + record[i].executorName + '</div>');
                    strWorkFlow.append('<div class="wkDate">' + record[i].createTime.toDate().format('yyyy-MM-dd') + '</div>');
                    strWorkFlow.append('<div class="wkGetStatus get_' + record[i].status + '"></div>');
                    strWorkFlow.append('</div>');
                    $container.append(strWorkFlow.toString());
                }
            }else{
                for (var i = 0; i < record.length; i++) {
                    record[i].status = false;
                    strWorkFlow = new StringBuilder();
                    strWorkFlow.append('<div class="liWkRecord zepto-ev" id="' + record[i].id + '">');
                    strWorkFlow.append('<div class="wkEmergency wkEmergency_' + record[i].critical + '"></div>');
                    strWorkFlow.append('<div class="wkTitle">' + record[i].title + '</div>');
                    strWorkFlow.append('<div class="wkInfo">' + record[i].detail + '</div>');
                    strWorkFlow.append('<div class="wkUser">' + record[i].executorName + '</div>');
                    strWorkFlow.append('<div class="wkDate">' + record[i].createTime.toDate().format('yyyy-MM-dd') + '</div>');
                    strWorkFlow.append('<div class="wkGetStatus get_' + record[i].status + '"></div>');
                    strWorkFlow.append('</div>');
                    $container.append(strWorkFlow.toString());
                    tempWkList.push(record[i]);
                }
            }
            _this.initWkDetail(tempContainer);
        },
        initWkTypeSelect:function(){
            _this.tempWkContainer = $('#divWorking');
            $('.divWkList').hide();
            _this.tempWkContainer.show();
            _this.sortType = true;
            $('.btnWkSelect').off('tap').on('tap',function(e){
                $('.btnWkSelect').removeClass('selected');
                $(e.currentTarget).addClass('selected');
                var $spanWkType = $('#wkType');
                switch ($(e.currentTarget).attr('id')){
                    case 'btnWorking':
                        _this.wkType = 'working';
                        _this.tempWkList = WkConfig.wkList.working;
                        _this.tempWkContainer = $('#divWorking');
                        $spanWkType.html(I18n.resource.appDashboard.workflow.DOING);
                        break;
                    case 'btnCreated':
                        _this.wkType = 'created';
                        _this.tempWkList = WkConfig.wkList.created;
                        _this.tempWkContainer = $('#divCreated');
                        $spanWkType.html(I18n.resource.appDashboard.workflow.MY_CREATE);
                        break;
                    case 'btnFinished':
                        _this.wkType = 'finished';
                        _this.tempWkList = WkConfig.wkList.finished;
                        _this.tempWkContainer = $('#divFinished');
                        $spanWkType.html(I18n.resource.appDashboard.workflow.MY_FINISH);
                        break;
                    case 'btnJoined':
                        _this.wkType = 'joined';
                        _this.tempWkList = WkConfig.wkList.joined;
                        _this.tempWkContainer = $('#divJoined');
                        $spanWkType.html(I18n.resource.appDashboard.workflow.MY_JOIN);
                        break;
                    default :
                        break;
                }
                $('.divWkList').hide();
                _this.tempWkContainer.show();
            });
        },
        initWkDetail:function(container){
            container.find('.liWkRecord').off('tap').on('tap',function(e){
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
        initSort:function(){
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
                sort('cirtical');
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
                _this.tempWkContainer.html('');
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
                for(var i = 0;i < newWkList.length;i++){
                    strWorkFlow= new StringBuilder();
                    strWorkFlow.append('<div class="liWkRecord" id="' + newWkList[i].id + '">');
                    strWorkFlow.append('<div class="wkEmergency wkEmergency_'+ newWkList[i].critical +'"></div>');
                    strWorkFlow.append('<div class="wkTitle">' + newWkList[i].title + '</div>');
                    strWorkFlow.append('<div class="wkInfo">' + newWkList[i].detail + '</div>');
                    strWorkFlow.append('<div class="wkUser">' + newWkList[i].executorName + '</div>');
                    strWorkFlow.append('<div class="wkDate">' + newWkList[i].createTime.toDate().format('yyyy-MM-dd')+ '</div>');
                    strWorkFlow.append('<div class="wkGetStatus get_' + newWkList[i].status + '"></div>');
                    strWorkFlow.append('</div>');
                    _this.tempWkContainer.append(strWorkFlow.toString());
                }
                _this.sortType = !_this.sortType;
                _this.initWkDetail(_this.tempWkContainer);
            }
        },
        close:function(){
        }
    };
    return WorkflowList;
})();