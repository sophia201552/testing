/**
 * Created by win7 on 2015/10/28.
 */
var WorkflowIndex = (function(){
    var _this;
    function WorkflowIndex(){
        _this = this;

        this.pageNum = 1;
        this.pageSize = 19;

        this.filter = 'inProgress';

        this.store = [];
        this.container = undefined;
    }
    WorkflowIndex.navOptions = {
        top:
        '<span id="btnWorkFlowAdd" class="topNavLeft topTool zepto-ev iconfont icon-tianjia21"></span>' +
        '<div class="topNavTitle"></div>'+
        '<span id="btnAdminConfig" class=""><i class="iconfont">&#xe7e3;</i></span>',
        bottom:true,
        backDisable:true,
        module:'workflow'
    };
    WorkflowIndex.prototype = {
        show:function(){
            localStorage.setItem('pushWk', []);
            $('#btnWorkFlow .messageNum').text(0).hide();
            $.ajax({url:'static/app/dashboard/views/workflow/workflowList.html'}).done(function(resultHTML){
                $(ElScreenContainer).html(resultHTML);
                localStorage.setItem('module','workflow');
                var $adminConfig = $('#btnAdminConfig');
                $adminConfig[0].innerHTML = '<img src="http://images.rnbtech.com.hk'+ AppConfig.userProfile.picture +'">';
                $adminConfig.off('touchstart').on('touchstart', function(e) {
                    var adminConfigNew = new AdminConfigNew();
                    adminConfigNew.show();
                });
                _this.container = document.getElementById('divWkList');
                _this.init();
                I18n.fillArea($('#navTop'));
                I18n.fillArea($('#divWorkflowTool'));
            });
        },
        init:function(){
            _this.initWorkflowTool();
            _this.initAddWk();
            _this.initWkTypeDivide();
            _this.initWorkflowList();
            //_this.initGroupAndTag();
            _this.initSort();
            _this.initSearch();
            _this.attachEvent();
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
        initWorkflowList:function(){
            this.container.innerHTML = '';
            var $navTopTitle = $('.topNavTitle');
            var postData = {};
            switch (this.filter){
                case 'inProgress':
                    postData = {
                        comment:true,
                        pageNumber:this.pageNum,
                        pageSize:this.pageSize,
                        query:'{"executor":'+  AppConfig.userId+',"status":{"$in":[0,1]},"_isDelete":{"$ne":true}}'
                    };
                    $navTopTitle.html(I18n.resource.appDashboard.workflow.IN_PROGRESS);
                    break;
                case 'createdByMe':
                    postData = {
                        pageNumber:this.pageNum,
                        pageSize:this.pageSize,
                        query:'{"creator":'+  AppConfig.userId+',"_isDelete":{"$ne":true}}'
                    };
                    $navTopTitle.html(I18n.resource.appDashboard.workflow.CREATED_BY_ME);
                    break;
                case 'completedByMe':
                    postData = {
                        pageNumber:this.pageNum,
                        pageSize:this.pageSize,
                        query:'{"executor":'+  AppConfig.userId+',"status":2,"_isDelete":{"$ne":true}}'
                    };
                    $navTopTitle.html(I18n.resource.appDashboard.workflow.COMPLETE_BY_ME);
                    break;
                case 'involvedByMe':
                    postData = {
                        pageNumber:this.pageNum,
                        pageSize:this.pageSize,
                        query:'{"or":[{"process.nodes.members":'+ AppConfig.userId +'},{"process.watchers":'+ AppConfig.userId +'}],"_isDelete":{"$ne":true}}'
                    };
                    $navTopTitle.html(I18n.resource.appDashboard.workflow.INVOLVED_BY_ME);
                    break;
                default :
                    break;
            }
            SpinnerControl.show();
            WebAPI.post('/workflow/task/filter',postData).done(function(resultData) {
                if (resultData.data && resultData.data.records) {
                    _this.store = resultData.data.records;
                }else{
                    return;
                }
                _this.store.forEach(function(item){
                    _this.container.appendChild(_this.createIndexItem(item))
                });
            }).always(function(){
                SpinnerControl.hide();
            });
        },
        createIndexItem:function(item){
            var dom = document.createElement('div');
            dom.className = 'divWkItem zepto-ev';
            dom.id = item._id;

            var user_from = document.createElement('span');
            user_from.className = 'spUserFrom';
            try{
                user_from.innerHTML = '<img src="http://images.rnbtech.com.hk/custom/user/portrait/user_' + item.process.nodes[item.node_index].members[0] +'.jpg">';
            }catch(e){
                user_from.innerHTML = '<img src="http://images.rnbtech.com.hk/static/images/avatar/default/1.png">';
            }

            var user_relate = document.createElement('span');
            user_relate.className = 'spUserRelate';
            if(item.watchers instanceof Array) {
                for (var i = 0; i < item.watchers.length; i++) {
                    user_relate.innerHTML += '<img src="http://images.rnbtech.com.hk/custom/user/portrait/user_' + item.watchers[i] + '.jpg">';
                }
            }

            var user_create = document.createElement('span');
            user_create.className = 'spUserCreate';
            if(item.creatorInfo) {
                user_create.innerHTML = '<img src="http://images.rnbtech.com.hk/custom/user/portrait/user_' + item.creatorInfo.id +'.jpg">';
            }else{
                user_create.innerHTML = '<img src="http://images.rnbtech.com.hk/static/images/avatar/default/1.png">';
            }


            var userGroup = document.createElement('span');
            userGroup.className = 'spUserGrp';

            var title = document.createElement('span');
            title.className = 'spTitle';
            title.innerHTML = item.fields.title;

            var content = document.createElement('span');
            content.className = 'spContent';
            content.innerHTML = item.fields.detail;

            var status = document.createElement('span');
            status.className = 'spStatus';
            status.innerHTML = this.getStatusContent(item.process.nodes[item.node_index]?item.process.nodes[item.node_index].behaviour:null);

            var critical = document.createElement('span');
            critical.className = 'spCritical critical-' + item.fields.critical;
            critical.innerHTML = this.getCriticalContent(item.fields.critical);

            var divAddition = document.createElement('div');
            divAddition.className = 'divInfo';

            var dueDate = document.createElement('span');
            dueDate.className = 'spDueDate';
            dueDate.textContent = new Date(item.fields.dueDate).format('yyyy-MM-dd');

            var reply = document.createElement('span');
            reply.className = 'spReply';
            reply.innerHTML = '<span class="spIcon iconfont icon-xinxi"></span><span class="spReplyNum">'+ (item.comment && (item.comment instanceof Array)?item.comment.length:0) +'</span>';

            dom.appendChild(user_from);
            dom.appendChild(title);
            dom.appendChild(content);
            userGroup.appendChild(user_create);
            userGroup.appendChild(user_relate);
            dom.appendChild(userGroup);
            divAddition.appendChild(reply);
            divAddition.appendChild(status);
            divAddition.appendChild(critical);
            divAddition.appendChild(dueDate);
            dom.appendChild(divAddition);

            return dom;
        },
        getCriticalContent:function(id){
            var strCritical;
            switch (parseInt(id)){
                case 0:
                    strCritical = I18n.resource.appDashboard.workflow.NORMAL;
                    break;
                case 1:
                    strCritical = I18n.resource.appDashboard.workflow.SERIOUS;
                    break;
                case 2:
                    strCritical = I18n.resource.appDashboard.workflow.URGENT;
                    break;
                default :
                    strCritical = '';
                    break;
            }
            return strCritical;
        },
        getStatusContent:function(id){
            if(id == null)return;
            var strStatus;
            switch (parseInt(id)){
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
                default :
                    strStatus = '';
                    break;
            }
            return strStatus;
        },
        initWkTypeDivide:function(){
            var $workflowContainer = $('#containerWorkFlowList');
            var $backDrop = $('.backDrop');
            var $ulWkDropDown = $('.ulWkDropDown');
            var $wkTool = $('.wkTool');
            _this.sortType = true;
            $('.btnWkDivide').off('tap').on('tap',function(e){
                $('.btnWkDivide').removeClass('selected');
                $(e.currentTarget).addClass('selected');
                var $spanWkType = $('.topNavTitle');
                switch ($(e.currentTarget).attr('id')){
                    case 'btnProgress':
                        _this.filter = 'inProgress';
                        $spanWkType.html(I18n.resource.appDashboard.workflow.IN_PROGRESS);
                        break;
                    case 'btnCreatedByMe':
                        _this.filter = 'createdByMe';
                        $spanWkType.html(I18n.resource.appDashboard.workflow.CREATED_BY_ME);
                        break;
                    case 'btnFinishedByMe':
                        _this.filter = 'completedByMe';
                        $spanWkType.html(I18n.resource.appDashboard.workflow.COMPLETE_BY_ME);
                        break;
                    case 'btnInvolvedByMe':
                        _this.filter = 'involvedByMe';
                        $spanWkType.html(I18n.resource.appDashboard.workflow.INVOLVED_BY_ME);
                        break;
                    default :
                        break;
                }
                $backDrop.hide();
                $workflowContainer.css('overflow','auto');
                $ulWkDropDown.hide();
                $wkTool.removeClass('on');
                _this.initWorkflowList();
            });
        },
        attachEvent:function(){
            $(this.container).off('tap').on('tap','.divWkItem',function(e){
                router.to({
                    typeClass:WorkflowDetail,
                    data:{
                        id:e.currentTarget.id
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
            });
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
                var newWkList = _this.store;
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
                    //new Alert($(AlertContainer), "danger", '请检查编号格式！').show().close();
                    window.plugins && window.plugins.toast.show(I18n.resource.appDashboard.workflow.CHECK_CODE_FORMAT, 'short', 'center');
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
                        //new Alert($(AlertContainer), "danger", '查找不到工单，请重新输入').show().close();
                        window.plugins && window.plugins.toast.show(I18n.resource.appDashboard.workflow.NO_WORKFLOW_INFO, 'short', 'center');
                    }
                }).fail(function(){
                    //new Alert($(AlertContainer), "danger", '查找不到工单，请重新输入').show().close();
                    window.plugins && window.plugins.toast.show(I18n.resource.appDashboard.workflow.NO_WORKFLOW_INFO, 'short', 'center');
                }).always(function(){
                    SpinnerControl.hide();
                });
            })
        },
        close:function(){
        }
    };
    return WorkflowIndex
})();