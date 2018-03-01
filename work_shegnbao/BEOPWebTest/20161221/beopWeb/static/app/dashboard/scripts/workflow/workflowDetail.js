/**
 * Created by win7 on 2015/10/29.
 */
var WorkflowDetail = (function(){
    var _this = this;
    function WorkflowDetail(data){
        _this = this;
        _this.SelectPage = undefined;
        if (data && data.id){
            _this.wkId = data.id;
        }
        _this.store = {};
        _this.container = undefined;
    }
    WorkflowDetail.navOptions = {
        top: '<div class="topNavTitle" i18n="appDashboard.workflow.WORKFLOW_DETAIL"></div>',
        bottom:true,
        backDisable:false,
        module:'workflow'
    };
    WorkflowDetail.prototype = {
        show:function(){
            try {
                var storage = JSON.parse(localStorage.getItem('pushWk'));
                storage = storage.filter(function(item){
                    return (item.id != WkConfig.wkId);
                });
                localStorage.setItem('pushWk',storage);
                if(storage.length > 0 ){
                    $('#btnWorkFlow .messageNum').text(storage.length).show();
                }else {
                    $('#btnWorkFlow .messageNum').text(0).hide();
                }
            }catch(e){
                localStorage.setItem('pushWk',[]);
                $('#btnWorkFlow .messageNum').text(0).hide();
            }
            $.ajax({url:'static/app/dashboard/views/workflow/workflowDetail.html'}).done(function(resultHTML){
                $(ElScreenContainer).html(resultHTML);
                _this.container = document.getElementById('containerMain');
                //CssAdapter.setIndexMain();
                _this.init();
                I18n.fillArea($('#navTop'));
                I18n.fillArea($('#divContent'));
                I18n.fillArea($('#wkEdit'));
                I18n.fillArea($('#wkUserDialog'));
            });
        },
        init:function(){
            //_this.SelectPage = new SelectPage({
            //    type:'user',
            //    mode:'radio',
            //    ctn:document.getElementById('ctnUserSel'),
            //    screen:_this
            //});
            SpinnerControl.show();
            WebAPI.get('/workflow/task/'+_this.wkId).done(function (resultData){
                _this.store = resultData.data;
                _this.initWkInfo();
                _this.initOperate();
            }).always(function(){
                SpinnerControl.hide();
            });
            WebAPI.get('/workflow/task/comment/get/'+_this.wkId).done(function(result){
                var comment = result.data && result.data.comment;
                _this.initComment(comment);
            });
            //_this.initAdditionToggle();
        },
        initWkInfo:function(){
            //var process  = this.store.process.nodes[this.store.node_index];
            var store = this.store;

            var title = this.container.querySelector('.divTitle');
            title.innerHTML = store.fields.title;

            var content = this.container.querySelector('.divContent');
            content.innerHTML = store.fields.detail;

            var critical = this.container.querySelector('.spCritical');
            $(critical).addClass('critical-' + store.fields.critical);
            critical.innerHTML = this.getCriticalContent(store.fields.critical);

            var status = this.container.querySelector('.spStatus');
            $(status).addClass('status-' + store.status);
            status.innerHTML = this.getStatusContent(this.store.status);

            var createTime = this.container.querySelector('.divCreateTime>.spDetail');
            createTime.innerHTML = new Date(store.createTime).format('yyyy-MM-dd');

            var dueTime = this.container.querySelector('.divDueTime>.spDetail');
            dueTime.innerHTML = new Date(store.fields.dueDate).format('yyyy-MM-dd') ;

            var executor = this.container.querySelector('.divExecutor>.spDetail');
            //executor.previousSibling.innerHTML = this.getStatusContent(process.behaviour) + '者';
            executor.innerHTML = this.store.executorInfo.userfullname;

            var creator = this.container.querySelector('.divCreator>.spDetail');
            creator.innerHTML = this.store.creatorInfo.userfullname;

            var watcher = this.container.querySelector('.divWatcher>.divDetailContent');
            var arr = this.store.watchersInfo;
            var spWatcher;
            if(!arr || arr.length == 0){
                $(watcher).addClass('none');
            }else {
                for (var i = 0; i < arr.length; i++) {
                    spWatcher = document.createElement('span');
                    spWatcher.className = 'spDetail';
                    spWatcher.innerHTML = '<span>' + arr[i].userfullname + '</span>';
                    watcher.appendChild(spWatcher);
                }
            }

            var team = this.container.querySelector('.divTaskGrp>.spDetail');
            team.innerHTML = this.store.taskGroup.name;

            var tag = this.container.querySelector('.divTaskTag>.divDetailContent');
            arr = this.store.tags;
            var spTag;
            if(!arr || arr.length == 0){
                $(tag).addClass('none')
            }else {
                for (var i = 0; i < arr.length; i++) {
                    spTag = document.createElement('span');
                    spTag.className = 'spDetail';
                    spTag.innerHTML = '<span>' + arr[i] + '</span>';
                    tag.appendChild(spTag);
                }
            }
        },
        initComment:function(comment){
            if(!(comment instanceof Array))return;

            var dom = document.createElement('div');
            dom.className = 'ctnComment';

            comment.forEach(function(ele){
                var item = document.createElement('div');
                item.className = 'divComment';

                var photo = document.createElement('span');
                photo.className = 'spPhoto';
                photo.innerHTML = '<img src = "'+ ele.userInfo.userpic +'">';

                var name = document.createElement('span');
                name.className = 'spName';
                name.innerHTML = ele.userInfo.userfullname;

                var content = document.createElement('span');
                content.className = 'spComment';
                content.innerHTML = ele.content;

                var time = document.createElement('span');
                time.className = 'spTime';
                time.innerHTML = new Date(ele.time).format('yyyy-MM-dd HH:mm:ss');

                item.appendChild(photo);
                item.appendChild(name);
                item.appendChild(time);
                item.appendChild(content);

                dom.appendChild(item);
            });

            this.container.appendChild(dom)
        },
        initOperate:function(){
            if(this.store.node_index == undefined)return;
            if(this.store.executor != AppConfig.userId)return;
            var process  = this.store.process.nodes[this.store.node_index];
            var $btnOperateGrp = $('#btnWkOperateGrp');

            if(process.behaviour == 2){
                $btnOperateGrp.html('<span data-operate="0" class="btnOperate iconfont icon-kaishi1 zepto-ev"></span>');
            }else if(process != undefined){
                $btnOperateGrp.html('<span data-operate="1"class="btnOperate iconfont icon-queding zepto-ev"></span><span data-operate="2" class="zepto-ev btnOperate iconfont icon-cuowu1"></span>');
            }

            $btnOperateGrp.off('tap').on('tap','.btnOperate',function(e){
                var operate = e.currentTarget.dataset.operate;
                var nodeNextId;
                try{
                    nodeNextId = _this.store.process.nodes[_this.store.node_index + 1].members[0].id;
                }catch(e){
                    nodeNextId = ''
                }
                var postData,url,defaultCallback;
                defaultCallback = true;
                switch (parseInt(operate)){
                    case 0:
                        postData = {
                            nextUserId:nodeNextId,
                            taskId:_this.wkId
                        };
                        url = '/workflow/complete/';
                        break;
                    case 1:
                        postData = {
                            nextUserId:nodeNextId,
                            taskId:_this.wkId
                        };
                        url = '/workflow/passTask/';
                        break;
                    case 2:
                        postData = {
                            taskId:_this.wkId
                        };
                        defaultCallback = false;
                        infoBox.confirm('一旦不通过，将会终止整个工单，是否继续',function(){
                            WebAPI.post('/workflow/noPassTask/', postData).done(function () {
                                window.plugins && window.plugins.toast.show('操作成功', 'short', 'center');
                                _this.init();
                            }).fail(function () {
                                window.plugins && window.plugins.toast.show('操作失败', 'short', 'center');
                            });
                        });
                        break;
                }
                if(defaultCallback) {
                    WebAPI.post(url, postData).done(function () {
                        window.plugins && window.plugins.toast.show('操作成功', 'short', 'center');
                        _this.init();
                    }).fail(function () {
                        window.plugins && window.plugins.toast.show('操作失败', 'short', 'center');
                    }).always(function(){

                    });
                }
            })
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
        close:function(){
            //WkConfig.wkInfo = null;
            //CssAdapter.clearIndexMain();
        }
    };
    return WorkflowDetail;
})();