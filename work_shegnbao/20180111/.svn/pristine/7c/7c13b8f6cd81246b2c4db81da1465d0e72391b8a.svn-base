/**
 * Created by win7 on 2015/10/28.
 */
var WorkflowIndex = (function() {
    var _this;

    function WorkflowIndex() {
        _this = this;

        this.pageNum = 1;
        this.pageSize = 19;

        this.filter = '{}';
        this.sort = undefined;
        this.asc = true;
        this.refreshItem = null;
        this.enableRefresh = false;

        this.store = [];
        this.container = undefined;

        this.taskGrp = [];
        this.tag = [];
        this.userGrp = [];
    }
    WorkflowIndex.navOptions = {
        top: '<span id="btnWorkFlowAdd" class="navTopItem left icon zepto-ev iconfont icon-tianjia21"></span>' +
            '<div id="navTopTitle" class="navTopItem title middle"></div>' +
            '<span id="btnAdminConfig" class="navTopItem right"></span>',
        bottom: true,
        backDisable: true,
        module: 'workflow'
    };
    WorkflowIndex.prototype = {
        show: function() {
            localStorage.setItem('pushWk', []);
            $('#btnWorkFlow .pushTip').text(0).hide();
            $.ajax({ url: 'static/app/dashboard/views/workflow/workflowIndex.html' }).done(function(resultHTML) {
                $(ElScreenContainer).html(resultHTML);
                localStorage.setItem('module', 'workflow');
                var $adminConfig = $('#btnAdminConfig');
                $adminConfig[0].innerHTML = '<img src="https://beopweb.oss-cn-hangzhou.aliyuncs.com' + AppConfig.userProfile.picture + '"><span class="newMessageNum tip"></span>';
                $adminConfig.off('touchstart').on('touchstart', function(e) {
                    var adminConfigNew = new AdminConfigNew();
                    adminConfigNew.show();
                });
                _this.container = document.getElementById('divWkList');
                _this.init();
                _this.messageNumber();
                I18n.fillArea($('#navTop'));
                I18n.fillArea($('#divWorkflowTool'));
            });
        },
        messageNumber:function(){
            //获取消息数量
            if(AppConfig.newMessageNumber) {
                $('.newMessageNum').addClass('active').html(AppConfig.newMessageNumber);
            }
        },
        init: function() {
            SpinnerControl.show();
            // $.when(WebAPI.get('/workflow/taskGroup/'), WebAPI.get('/workflow/tags/')).done(function(taskGrp, tags) {
            //     _this.taskGrp = taskGrp[0].data;
            //     _this.tag = tags[0].data;
            // }).always(function() {
            //     //SpinnerControl.hide()
            // });
            $.when(WebAPI.get('/workflow/teamArch/')).done(function(userGrp) {
                try {
                    _this.userGrp = userGrp.data;
                    if (!(_this.userGrp instanceof Array)) {
                        _this.userGrp = []
                    }
                } catch (e) {
                    _this.userGrp = []
                }
                _this.setWorkflowList();
                _this.attachEvent();
            }).fail(function() {
                _this.userGrp = []
                _this.setWorkflowList();
                _this.attachEvent();
            });
            _this.initToolGrp();
            _this.initAddWk();
        },
        setWorkflowTool: function() {

        },
        setWorkflowList: function(page) {
            _this.enableRefresh = false;
            if (page == null) {
                this.pageNum = 1;
                this.store = [];
                this.container.innerHTML = '';
                SpinnerControl.show();
            }
            var $navTopTitle = $('#navTopTitle');
            var postData = {
                comment: true,
                pageNumber: this.pageNum,
                pageSize: this.pageSize,
                query: _this.filter
            };
            if (_this.sort) {
                postData.orderProperty = _this.sort;
                postData.asc = _this.asc;
            }
            WebAPI.post('/workflow/task/filter', postData).done(function(resultData) {
                if (resultData.data && resultData.data.records) {
                    _this.store = _this.store.concat(resultData.data.records);
                    if (resultData.data.total > _this.store.length) _this.enableRefresh = true;
                } else {
                    return;
                }
                resultData.data.records.forEach(function(item) {
                    _this.container.appendChild(_this.createIndexItem(item))
                });
            }).always(function() {
                SpinnerControl.hide();
            });
        },
        // createIndexItem: function(item) {
        //     switch (item.type) {
        //         case 'default':
        //             break;
        //         case 'repair':
        //             break;
        //         case 'patrol':
        //             break;
        //         default:
        //             break;
        //     }
        // },
        createIndexItem: function(item) {
            var dom = document.createElement('div');
            dom.className = 'divWkItem zepto-ev';
            dom.id = item._id;

            var user_from = document.createElement('span');
            user_from.className = 'spUserFrom';
            var nodeUser = {};
            try {
                if (item.process.nodes[item.node_index]) {
                    nodeUser = item.process.nodes[item.node_index]
                } else {
                    nodeUser = item.process.nodes[item.process.nodes.length - 1]
                }
                user_from.innerHTML = '<img src="https://beopweb.oss-cn-hangzhou.aliyuncs.com/custom/user/portrait/user_' + nodeUser.members[0] + '.jpg">';
            } catch (e) {
                user_from.innerHTML = '<img src="https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png">';
            }

            var userRole = document.createElement('span')
            userRole.className = 'userRole behavior-' + nodeUser.behaviour + ' status-' + item.status;
            userRole.innerHTML = this.getBehaviorContent(nodeUser.behaviour, item.status);

            var user_relate = document.createElement('span');
            user_relate.className = 'spUserRelate';
            var _user_relate_;
            if (item.watchers instanceof Array) {
                for (var i = 0; i < item.watchers.length; i++) {
                    _user_relate_ = this.getUserById(item.watchers[i])
                    if (_user_relate_) {
                        user_relate.innerHTML += '<span>' + _user_relate_.userfullname + '</span>';
                    }
                }
            }

            var user_create = document.createElement('span');
            user_create.className = 'spUserCreate';
            if (item.creatorInfo) {
                // user_create.innerHTML = '<img src="https://beopweb.oss-cn-hangzhou.aliyuncs.com/custom/user/portrait/user_' + item.creatorInfo.id +'.jpg">';
                user_create.innerHTML = item.creator;
            } else {
                //user_create.innerHTML = '<img src="https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png">';
                user_create.innerHTML = item.creator;
            }


            var userGroup = document.createElement('span');
            userGroup.className = 'spUserGrp';

            var userRlt = document.createElement('label');
            userRlt.className = "spUserRlt";
            userRlt.innerHTML = I18n.resource.appDashboard.workflow.PARTICIPANT;

            var title = document.createElement('span');
            title.className = 'spTitle';
            // title.appendChild(userRole);
            title.innerHTML += '<span class="spTitleContent">' + item.fields.title + '</span>';

            var content = document.createElement('pre');
            content.className = 'spContent';
            //var areaContent = document.createElement('pre');
            content.innerHTML = item.fields.detail;
            //areaContent.className = 'txtContent';
            //autoTextarea(areaContent,0,75);
            //content.appendChild(areaContent);

            var status = document.createElement('span');
            status.className = 'spStatus';
            //status.innerHTML = this.getStatusContent(item.process.nodes[item.node_index]?item.process.nodes[item.node_index].behaviour:null);
            status.innerHTML = this.getStatusContent(item.status);

            var divCritical = document.createElement('div');
            divCritical.className = "divCritical";
            var critical = document.createElement('span');
            critical.className = 'spCritical critical-' + item.fields.critical;
            critical.innerHTML = this.getCriticalContent(item.fields.critical);
            // divCritical.appendChild(critical);

            var divAddition = document.createElement('div');
            divAddition.className = 'divInfo';

            var dueDate = document.createElement('span');
            dueDate.className = 'spDueDate';
            try{
                dueDate.textContent = new Date(+moment(item.fields.dueDate)).format('yyyy-MM-dd');
            }catch(e){}

            var reply = document.createElement('span');
            reply.className = 'spReply';
            reply.innerHTML = '<span class="spIcon iconfont icon-xinxi"></span><span class="spReplyNum">' + (item.comment && (item.comment instanceof Array) ? item.comment.length : 0) + '</span>';

            dom.appendChild(user_from);
            dom.appendChild(title);
            dom.appendChild(dueDate);
            dom.appendChild(userGroup);
            dom.appendChild(content);
            userGroup.appendChild(userRlt);
            userGroup.appendChild(user_create);
            userGroup.appendChild(user_relate);
            divAddition.appendChild(reply);
            //divAddition.appendChild(status);
            divAddition.appendChild(userRole);
            divAddition.appendChild(critical);
            dom.appendChild(divAddition);

            return dom;
        },
        getUserById: function(id) {
            var user;
            for (var i = 0; i < this.userGrp.length; i++) {
                if (id == this.userGrp[i].id) {
                    user = this.userGrp[i]
                    break;
                }
            }
            return user
        },
        getBehaviorContent: function(id, status) {
            if (id == null) return '';
            var strBehavior;
            if (status == 2 || status == 3) {
                switch (parseInt(id)) {
                    case 1:
                        if (status == 2) {
                            strBehavior = I18n.resource.appDashboard.workflow.BEHAVIOUR_PASS;
                        } else if (status == 3) {
                            strBehavior = I18n.resource.appDashboard.workflow.BEHAVIOUR_NOT_PASS;
                        }
                        break;
                    case 2:
                        strBehavior = I18n.resource.appDashboard.workflow.BEHAVIOUR_COMPLETE;
                        break;
                    default:
                        strBehavior = '';
                        break;
                }
            } else {
                switch (parseInt(id)) {
                    case 1:
                        strBehavior = I18n.resource.appDashboard.workflow.BEHAVIOUR_REVIEW;
                        break;
                    case 2:
                        strBehavior = I18n.resource.appDashboard.workflow.BEHAVIOUR_EXECUTE;
                        break;
                    default:
                        strBehavior = '';
                        break;
                }
            }
            return strBehavior
        },
        getCriticalContent: function(id) {
            var strCritical;
            switch (parseInt(id)) {
                case 0:
                    strCritical = I18n.resource.appDashboard.workflow.NORMAL;
                    break;
                case 1:
                    strCritical = I18n.resource.appDashboard.workflow.SERIOUS;
                    break;
                case 2:
                    strCritical = I18n.resource.appDashboard.workflow.URGENT;
                    break;
                default:
                    strCritical = '';
                    break;
            }
            return strCritical;
        },
        getStatusContent: function(id) {
            if (id == null) return '';
            var strStatus;
            switch (parseInt(id)) {
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
                default:
                    strStatus = '';
                    break;
            }
            return strStatus;
        },
        initFilter: function() {
            var $workflowContainer = $('#containerWorkFlowList');
            var $backDrop = $('.backDrop');
            var $ulWkDropDown = $('.ulWkDropDown');
            var $wkTool = $('.wkTool');
            var $navTopTitle = $('#navTopTitle');
            $('.btnWkDivide').off('tap').on('tap', function(e) {
                $('.btnWkDivide').removeClass('selected');
                $(e.currentTarget).addClass('selected');
                switch ($(e.currentTarget).attr('id')) {
                    case 'btnProgress':
                        _this.filter = '{"executor":' + AppConfig.userId + ',"status":{"$in":[0,1]},"_isDelete":{"$ne":true}}';
                        $navTopTitle.html(I18n.resource.appDashboard.workflow.IN_PROGRESS);
                        break;
                    case 'btnCreatedByMe':
                        _this.filter = '{"creator":' + AppConfig.userId + ',"_isDelete":{"$ne":true}}';
                        $navTopTitle.html(I18n.resource.appDashboard.workflow.CREATED_BY_ME);
                        break;
                    case 'btnFinishedByMe':
                        _this.filter = '{"executor":' + AppConfig.userId + ',"status":2,"_isDelete":{"$ne":true}}';
                        $navTopTitle.html(I18n.resource.appDashboard.workflow.COMPLETE_BY_ME);
                        break;
                    case 'btnInvolvedByMe':
                        _this.filter = '{"$or":[{"process.nodes.members":' + AppConfig.userId + '},{"watchers":' + AppConfig.userId + '}],"_isDelete":{"$ne":true}}';
                        $navTopTitle.html(I18n.resource.appDashboard.workflow.INVOLVED_BY_ME);
                        break;
                    default:
                        break;
                }
                $backDrop.hide();
                $workflowContainer.css('overflow', 'auto');
                $ulWkDropDown.hide();
                $wkTool.removeClass('on');
                _this.sort = null;
                _this.asc = true;
                _this.setWorkflowList();
            });
            _this.filter = '{"executor":' + AppConfig.userId + ',"status":{"$in":[0,1]},"_isDelete":{"$ne":true}}';
            $navTopTitle.html(I18n.resource.appDashboard.workflow.IN_PROGRESS);
        },
        attachEvent: function() {
            $(this.container).off('tap').on('tap', '.divWkItem', function(e) {
                router.to({
                    typeClass: WorkflowDetail,
                    data: {
                        id: e.currentTarget.id
                    }
                })
            });
            _this.initRefresh();
            /*            $('.ulMenuFilter').off('tap').on('tap','.titleFilter',function(e){
                            var curContainer = e.currentTarget;
                            $(curContainer).find('.rightArrow').toggleClass('rightArrowCur');
                            $(curContainer).siblings().toggleClass('hide');
                        });
                        $('.spanTag').off('tap').on('tap',function(e){
                            $(e.currentTarget).toggleClass('cur');
                        });
                        $('.ulMenuFilter').off('tap').on('tap','.btnSure',function(e){
                            var $ulWkDropDown = $('.ulWkDropDown');
                            _this.filter = '{"creator":'+  AppConfig.userId+',"status":{"$in":[0,1]},"_isDelete":{"$ne":true}}';
                            _this.setWorkflowList();
                            $ulWkDropDown.hide();
                        });*/
        },
        initAddWk: function() {
            $('#btnWorkFlowAdd').off('tap').on('tap', function() {
                router.to({
                    typeClass: WorkflowAdd
                })
            });
        },
        initToolGrp: function() {
            var $workflowContainer = $('#containerWorkFlowList');
            var $backDrop = $('.backDrop');
            var $ulWkDropDown = $('.ulWkDropDown');
            var $wkTool = $('.wkTool');
            $wkTool.off('tap').on('tap', function(e) {
                $ulWkDropDown.hide();
                $wkTool.not($(e.currentTarget)).removeClass('on');
                if (!$(e.currentTarget).hasClass('on')) {
                    $(e.currentTarget).addClass('on');
                    $(e.currentTarget).next().show();
                    $backDrop.show();
                    $workflowContainer.css('overflow', 'hidden');
                } else {
                    $(e.currentTarget).removeClass('on');
                    $(e.currentTarget).next().hide();
                    $backDrop.hide();
                    $workflowContainer.css('overflow', 'auto');
                }
            });
            $backDrop.off('tap').on('tap', function(e) {
                $(e.currentTarget).hide();
                $ulWkDropDown.hide();
                $wkTool.removeClass('on');
                $workflowContainer.css('overflow', 'auto');
            });

            _this.initFilter();
            _this.initSort();
            _this.initSearch();
        },
        initSort: function() {
            var $workflowContainer = $('#containerWorkFlowList');
            var $backDrop = $('.backDrop');
            var $ulWkDropDown = $('.ulWkDropDown');
            var $wkTool = $('.wkTool');
            $('.btnSort').off('tap').on('tap', function(e) {
                _this.sort = e.currentTarget.dataset.sort;
                _this.asc = !!e.currentTarget.dataset.asc;
                if (e.currentTarget.dataset.asc) {
                    delete e.currentTarget.dataset.asc
                } else {
                    $(e.currentTarget).siblings().each(function(index, btn) {
                        delete btn.dataset.asc;
                    });
                    e.currentTarget.dataset.asc = true
                }
                $backDrop.hide();
                $workflowContainer.css('overflow', 'auto');
                $ulWkDropDown.hide();
                $wkTool.removeClass('on');
                _this.setWorkflowList();
            });
        },
        initRefresh: function() {
            //var $ctn = $('#containerWorkFlowList');
            //var evInit;
            //$ctn.off('touchstart').on('touchstart',function(e){
            //    var evTouch = e.originalEvent.touches[0];
            //});
            //$ctn.off('touchmove').on('touchmove',function(e){
            //    var evTouch = e.originalEvent.touches[0];
            //    evInit = {
            //        x: evTouch.x,
            //        y: evTouch.y
            //    };
            //    console.log('touchmove')
            //});
            //$ctn.off('touchend').on('touchend',function(e){
            //    var evTouch = e.originalEvent.changedTouches[0];
            //    evInit = {
            //        x: evTouch.x,
            //        y: evTouch.y
            //    };
            //
            //});
            var container = document.getElementById('containerWorkFlowList');
            var _this = this;
            _this.refreshItem = window.setInterval(function() {
                if(!container)window.clearInterval(_this.refreshItem)
                if (!_this.enableRefresh) return;
                if (container.scrollHeight - container.scrollTop < container.offsetHeight + 10) {
                    _this.setWorkflowList(_this.pageNum++)
                }
            }, 10)
        },
        initSearch: function() {
            $('#btnSearById').off('tap').on('tap', function() {
                var val = parseInt($('#iptSearById').val());
                if (!val) {
                    //new Alert($(AlertContainer), "danger", '请检查编号格式！').show().close();
                    window.plugins && window.plugins.toast.show(I18n.resource.appDashboard.workflow.CHECK_CODE_FORMAT, 'short', 'center');
                    return;
                }
                SpinnerControl.show();
                WebAPI.post('/workflow/transaction/' + val, { user_id: AppConfig.userId }).done(function(resultData) {
                    if (resultData.success && resultData.data) {
                        router.to({
                            typeClass: WorkflowDetail,
                            data: {
                                id: val,
                                detail: resultData.data
                            }
                        })
                    } else {
                        //new Alert($(AlertContainer), "danger", '查找不到工单，请重新输入').show().close();
                        window.plugins && window.plugins.toast.show(I18n.resource.appDashboard.workflow.NO_WORKFLOW_INFO, 'short', 'center');
                    }
                }).fail(function() {
                    //new Alert($(AlertContainer), "danger", '查找不到工单，请重新输入').show().close();
                    window.plugins && window.plugins.toast.show(I18n.resource.appDashboard.workflow.NO_WORKFLOW_INFO, 'short', 'center');
                }).always(function() {
                    SpinnerControl.hide();
                });
            });
        },
        getWorkflowClass: function(type) {

        },
        close: function() {
            this.refreshItem && window.clearInterval(this.refreshItem);
        }
    };
    return WorkflowIndex
})();