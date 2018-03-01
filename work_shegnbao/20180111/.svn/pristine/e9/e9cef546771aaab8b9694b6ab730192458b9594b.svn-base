/**
 * Created by win7 on 2015/10/29.
 */
var WorkflowDetail = (function() {
    var _this = this;

    function WorkflowDetail(data) {
        _this = this;
        _this.SelectPage = undefined;
        if (data && data.id) {
            _this.wkId = data.id;
        }
        _this.store = {};
        _this.container = undefined;
    }
    WorkflowDetail.navOptions = {
        top: '<div class="navTopItem title middle" i18n="appDashboard.workflow.WORKFLOW_DETAIL"></div>',
        bottom: true,
        backDisable: false,
        module: 'workflow'
    };
    WorkflowDetail.prototype = {
        show: function() {
            try {
                var $tipDom = $('#btnWorkFlow .pushTip');
                var storage = JSON.parse(localStorage.getItem('pushWk'));
                storage = storage.filter(function(item) {
                    return (item.id != _this.wkId);
                });
                localStorage.setItem('pushWk', storage);
                if (storage.length > 0) {
                    $tipDom.text(storage.length > 99 ? '99+' : storage.length).show();
                } else {
                    $tipDom.text(0).hide();
                }
            } catch (e) {
                localStorage.setItem('pushWk', JSON.stringify([]));
                $tipDom.text(0).hide();
            }
            $.ajax({ url: 'static/app/dashboard/views/workflow/workflowDetail.html' }).done(function(resultHTML) {
                $(ElScreenContainer).html(resultHTML);
                _this.container = document.getElementById('containerMain');
                //CssAdapter.setIndexMain();
                _this.init();
                I18n.fillArea($('#navTop'));
                I18n.fillArea($('#containerMain'));
            });
        },
        init: function() {
            //_this.SelectPage = new SelectPage({
            //    type:'user',
            //    mode:'radio',
            //    ctn:document.getElementById('ctnUserSel'),
            //    screen:_this
            //});
            SpinnerControl.show();
            WebAPI.get('/workflow/task/' + _this.wkId).done(function(resultData) {
                _this.store = resultData.data;
                _this.initWkInfo();
                _this.initOperate();
            }).always(function() {
                SpinnerControl.hide();
            });
            WebAPI.get('/workflow/task/comment/get/' + _this.wkId).done(function(result) {
                var comment = result.data && result.data.comment;
                _this.initComment(comment);
            });
            _this.attachEvent();
            //_this.initAdditionToggle();
        },
        attachEvent: function() {
            $('#btnCommentTrans').off('tap').on('tap', function(e) {
                var $ipt = $(e.currentTarget).prev();
                var postData = {
                    content: $ipt.val(),
                    taskId: _this.wkId
                };
                WebAPI.post('/workflow/task/comment/add', postData).done(function() {
                    $ipt.val('');
                    //var comment = {
                    //    content:postData.content,
                    //    userInfo:{
                    //        userpic:'https://beopweb.oss-cn-hangzhou.aliyuncs.com/' + AppConfig.userProfile.picture,
                    //        userfullname:AppConfig.userProfile.fullname
                    //    },
                    //    time:new Date().format('yyyy-MM-dd HH:mm:ss')
                    //};
                    //document.getElementById('ctnComment').appendChild(_this.createCommentDom(comment))
                    WebAPI.get('/workflow/task/comment/get/' + _this.wkId).done(function(result) {
                        var comment = result.data && result.data.comment;
                        _this.initComment(comment);
                    });
                }).fail(function() {
                    window.plugins && window.plugins.toast.show(I18n.resource.appDashboard.workflow.COMMENT_FAIL, 'short', 'center');
                })
            });
        },
        initWkInfo: function() {
            try {
                //var process  = this.store.process.nodes[this.store.node_index];
                var store = this.store;

                var title = this.container.querySelector('.divTitle');
                title.innerHTML = store.fields.title;

                // var statusTitle = document.createElement('span');
                // statusTitle.className = 'spStatus';
                // $(statusTitle).addClass('status-' + store.status);
                // if (store.node_index != null && store.process.nodes instanceof Array && store.process.nodes[store.node_index]) {
                //     statusTitle.innerHTML = '(' + this.getBehaviorContent(store.process.nodes[store.node_index].behaviour) + ')';
                // } else {
                //     statusTitle.innerHTML = '(' + this.getStatusContent(store.status) + ')';
                // }
                // title.appendChild(statusTitle);

                var role = this.container.querySelector('.spRole');
                role.className = 'spRole';
                var nodeUser = {};
                try {
                    if (store.process.nodes[store.node_index]) {
                        nodeUser = store.process.nodes[store.node_index]
                    } else {
                        nodeUser = store.process.nodes[store.process.nodes.length - 1]
                    }
                } catch (e) {
                    nodeUser = null;
                }
                if (nodeUser) {
                    role.innerHTML = this.getBehaviorContentInStatus(nodeUser.behaviour, store.status);
                    role.classList.add('behavior-' + nodeUser.behaviour);
                    role.classList.add('status-' + store.status);
                } else {
                    role.innerHTML = this.getStatusContent(store.status);
                    role.classList.add('status-' + store.status)
                }

                var content = this.container.querySelector('.divContent');
                content.innerHTML = store.fields.detail;
                //autoTextarea(content);

                var critical = this.container.querySelector('.spCritical');
                critical.className = 'spCritical';
                $(critical).addClass('critical-' + store.fields.critical);
                critical.innerHTML = this.getCriticalContent(store.fields.critical);

                /*               var status = this.container.querySelector('.spStatus');
                               $(status).addClass('status-' + store.status);
                               if(store.node_index != null && store.process.nodes instanceof Array && store.process.nodes[store.node_index]){
                                   status.innerHTML = this.getBehaviorContent(store.process.nodes[store.node_index].behaviour)
                               }else {
                                   status.innerHTML = this.getStatusContent(store.status);
                               }*/

                var createTime = this.container.querySelector('.divUserInfo .createTime');
                if (store.createTime) {
                    createTime.innerHTML = new Date(store.createTime.replace(/-/g, '/')).format('yyyy-MM-dd HH:mm');
                }
                /*                var woTitle=this.container.querySelector('.woTitle');
                                woTitle.innerHTML = store.fields.title;*/

                var dueTime = this.container.querySelector('.divDueTime>.spDetail');
                dueTime.innerHTML = new Date(store.fields.dueDate.replace(/-/g, '/')).format('yyyy-MM-dd');

                var creator = this.container.querySelector('.divCreator>.spDetail');
                //executor.previousSibling.innerHTML = this.getStatusContent(process.behaviour) + '者';
                creator.innerHTML = this.store.creatorInfo.userfullname;

                /*var creator = this.container.querySelector('.divCreator>.spDetail');
                creator.innerHTML = this.store.creatorInfo.userfullname;*/

                var portrait = this.container.querySelector('#executorInfo img');
                portrait.src = 'https://beopweb.oss-cn-hangzhou.aliyuncs.com' + this.store.executorInfo.userpic;

                var executor = this.container.querySelector('#executorInfo .userName');
                executor.innerHTML = this.store.executorInfo.userfullname;

                var watcher = this.container.querySelector('.divWatcher>.spDetail');
                watcher.innerHTML = '';
                var arr = this.store.watchersInfo;
                var spWatcher;
                if (!arr || arr.length == 0) {
                    $(watcher).addClass('none');
                } else {
                    for (var i = 0; i < arr.length; i++) {
                        spWatcher = document.createElement('span');
                        spWatcher.className = 'spDetailItem';
                        spWatcher.innerHTML = arr[i].userfullname + '';
                        watcher.appendChild(spWatcher);
                    }
                }

                var team = this.container.querySelector('.divTaskGrp>.spDetail');
                team.innerHTML = this.store.taskGroup.name ? this.store.taskGroup.name : I18n.resource.appDashboard.workflow.DEFAULT_PROJECT;

                var tag = this.container.querySelector('.divTaskTag>.spDetail');
                tag.innerHTML = '';
                arr = this.store.tags;
                var spTag;
                if (!arr || arr.length == 0) {
                    $(tag).addClass('none')
                } else {
                    for (var i = 0; i < arr.length; i++) {
                        spTag = document.createElement('span');
                        spTag.className = 'spDetailItem';
                        if (!arr[i]) return;
                        if (typeof arr[i] == 'string') {
                            spTag.innerHTML = arr[i];
                        } else {
                            arr[i].name && (spTag.innerHTML = arr[i]);
                        }
                        tag.appendChild(spTag);
                    }
                }

                var file = this.container.querySelector('.divFile>.spDetail');
                file.innerHTML = ''
                if (this.store.attachment instanceof Array && this.store.attachment.length > 0) {
                    this.store.attachment.forEach(function(item) {
                        var dom = document.createElement('span');
                        dom.className = 'spFile spDetailItem zepto-ev';
                        dom.innerHTML = '\
                        <span class="icon iconfont ' + item.fileClass + '"></span>\
                        <span class="name">' + item.fileName + '</span>\
                        <span class="time">' + item.fileUploadTime + '</span>;'
                        if (item.isImageFile) {
                            dom.querySelector('.icon').style.backgroundImage = 'url("' + item.url + '")';
                        }
                        file.appendChild(dom)
                    });
                }
                $(file).off('tap').on('tap', '.spFile', function(e) {
                    var store = {};
                    try {
                        store = _this.store.attachment[$(e.currentTarget).index()]
                    } catch (e) {
                        store = {};
                    }
                    if (!store.url) return;
                    var bigPic = document.createElement('span');
                    bigPic.className = 'wrapBigPic zepto-ev';
                    if (store.url.split('://')[0] == 'http' || store.url.split('://')[0] == 'https') {
                        bigPic.innerHTML = '<img class="bigPic" src="' + store.url + '">';
                    } else {
                        bigPic.innerHTML = '<img class="bigPic" src="data:image/jpeg;base64,' + store.url + '">';
                    }
                    bigPic.innerHTML += '<span class="name">' + store.fileName + '</span><span class="time">' + store.fileUploadTime + '</span>'
                    bigPic.querySelector('.bigPic').onload = function() {
                        $('body').append(bigPic);
                    };
                    $(bigPic).off('tap').on('tap', function() {
                        $(bigPic).remove();
                    });
                });

                this.initProcess();
            } catch (e) {
                SpinnerControl.hide();
                console.log(e.toString());
            }

            var customField = this.container.querySelector('.containerCustomField');
            customField.innerHTML = '';
            if (store.template && store.template.fields instanceof Array) {
                var fieldItem;
                for (var i = 0; i < store.template.fields.length; i++) {
                    fieldItem = document.createElement('div');
                    fieldItem.className = 'divFieldItem detailItem';
                    fieldItem.innerHTML = '\
                        <label class="labelDetail">' + store.template.fields[i].name + '</label>\
                        <span class="spFieldItem spDetail">' + (store.fields[store.template.fields[i].name] ? store.fields[store.template.fields[i].name] : '') + '</span>';
                    customField.appendChild(fieldItem)
                }
            }
        },
        initProcess: function() {
            var dom = document.querySelector('.divProcess');
            dom.innerHTML = '';
            var process = this.store.process;
            if (!process) return;
            if (process.nodes instanceof Array) {
                var createNode = document.createElement('div');
                createNode.className = 'divNodeBox divCreateNodeBox';
                createNode.innerHTML = '<span class="nodeUserInfo"><img class="imgNodeUser" src="' + 'https://beopweb.oss-cn-hangzhou.aliyuncs.com' + this.store.creatorInfo.userpic + '">\
                        <span class="nodeUser">' + this.store.creatorInfo.userfullname + '</span></span>\
                        <span class="nodeBehavior">' + I18n.resource.appDashboard.workflow.PROCESS_CREATOR + '</span>\
                        <span class="nodeGuideLine"></span>';
                dom.appendChild(createNode);

                // if (this.store.node_index != null) {
                process.nodes.forEach(function(node, index) {
                    var nodeDom = document.createElement('div');
                    var user = node.members[0];
                    if (!user) return;
                    nodeDom.className = 'divNodeBox';
                    if (_this.store.node_index == index) nodeDom.classList.add('active');
                    nodeDom.innerHTML = '<span class="nodeUserInfo"><img class="imgNodeUser" src="' + user.userpic + '">\
                        <span class="nodeUser">' + user.userfullname + '</span></span>\
                        <span class="nodeBehavior">' + _this.getBehaviorContent(node.behaviour) + '</span>\
                        <span class="nodeGuideLine"></span>';
                    dom.appendChild(nodeDom)
                });
                // }

                var completeNode = document.createElement('div');
                completeNode.className = 'divNodeBox divCompleteNodeBox';
                if (this.store.node_index == null) completeNode.classList.add('active');
                completeNode.innerHTML = '<span class="nodeUserInfo">\
                    <span class="nodeUser">' + I18n.resource.appDashboard.workflow.PROCESS_COMPLETE + '</span></span>';
                dom.appendChild(completeNode)
            }
        },
        getBehaviorContentInStatus: function(id, status) {
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
        initComment: function(comment) {
            var dom = document.getElementById('ctnComment');
            if (!(comment instanceof Array)) return;
            if (!dom) {
                dom = document.createElement('div');
                dom.id = 'ctnComment';
                this.container.appendChild(dom)
            } else {
                dom.innerHTML = '';
            }
            if (comment.length == 0) {
                dom.classList.add('hide');
            } else {
                comment.forEach(function(ele) {
                    dom.appendChild(_this.createCommentDom(ele));
                });
                dom.classList.remove('hide');
            }
        },
        createCommentDom: function(comment) {
            var item = document.createElement('div');
            item.className = 'divComment';

            var photo = document.createElement('span');
            photo.className = 'spPhoto';
            photo.innerHTML = '<img src = "' + comment.userInfo.userpic + '"/>';

            var spanNmTm = document.createElement('span');
            spanNmTm.className = 'spUserInfo';

            var name = document.createElement('span');
            name.className = 'spName';
            name.innerHTML = comment.userInfo.userfullname;

            var content = document.createElement('span');
            content.className = 'spComment';
            content.innerHTML = comment.content;

            var time = document.createElement('span');
            time.className = 'spTime time';
            if (comment.time) {
                time.innerHTML = new Date(comment.time.replace(/-/g, '/')).format('yyyy-MM-dd HH:mm:ss');
            }
            spanNmTm.appendChild(name);
            spanNmTm.appendChild(time);
            item.appendChild(photo);
            item.appendChild(spanNmTm);
            item.appendChild(content);
            return item;
        },
        initOperate: function() {
            var $btnOperateGrp = $('#btnWkOperateGrp');
            $btnOperateGrp.html('');
            if (this.store.node_index == undefined) return;
            if (this.store.executor != AppConfig.userId) return;
            var process = this.store.process.nodes[this.store.node_index];
            if (process.behaviour == 2) {
                $btnOperateGrp.html('<span data-operate="0" class="btnOperate glyphicon glyphicon-play zepto-ev"></span>');
            } else if (process != undefined) {
                $btnOperateGrp.html('<span data-operate="1"class="btnOperate glyphicon glyphicon-ok zepto-ev"></span><span data-operate="2" class="zepto-ev btnOperate glyphicon glyphicon-remove"></span>');
            }

            $btnOperateGrp.off('tap').on('tap', '.btnOperate', function(e) {
                var operate = e.currentTarget.dataset.operate;
                var nodeNextId;
                try {
                    nodeNextId = _this.store.process.nodes[_this.store.node_index + 1].members[0].id;
                } catch (e) {
                    nodeNextId = ''
                }
                var postData, url, defaultCallback;
                defaultCallback = true;
                switch (parseInt(operate)) {
                    case 0:
                        postData = {
                            nextUserId: nodeNextId,
                            taskId: _this.wkId
                        };
                        url = '/workflow/task/complete/';
                        break;
                    case 1:
                        postData = {
                            nextUserId: nodeNextId,
                            taskId: _this.wkId
                        };
                        url = '/workflow/passTask/';
                        defaultCallback = false;
                        WebAPI.post(url, postData).done(function() {
                            window.plugins && window.plugins.toast.show(I18n.resource.appDashboard.workflow.REVIEW_SUCCESS, 'short', 'center');
                            _this.init();
                            //router.to({
                            //    typeClass:WorkflowIndex
                            //});
                        }).fail(function() {
                            window.plugins && window.plugins.toast.show(I18n.resource.appDashboard.workflow.REVIEW_FAIL, 'short', 'center');
                        });
                        break;
                    case 2:
                        postData = {
                            taskId: _this.wkId
                        };
                        defaultCallback = false;
                        infoBox.confirm(I18n.resource.appDashboard.workflow.NOT_PASS_SURE, function() {
                            WebAPI.post('/workflow/noPassTask/', postData).done(function() {
                                window.plugins && window.plugins.toast.show(I18n.resource.appDashboard.workflow.OPERATE_SUCCESS, 'short', 'center');
                                _this.init();
                                //router.to({
                                //    typeClass:WorkflowIndex
                                //});
                            }).fail(function() {
                                window.plugins && window.plugins.toast.show(I18n.resource.appDashboard.workflow.OPERATE_FAIL, 'short', 'center');
                            });
                        });
                        break;
                }
                if (defaultCallback) {
                    WebAPI.post(url, postData).done(function() {
                        window.plugins && window.plugins.toast.show(I18n.resource.appDashboard.workflow.OPERATE_SUCCESS, 'short', 'center');
                        _this.init();
                    }).fail(function() {
                        window.plugins && window.plugins.toast.show(I18n.resource.appDashboard.workflow.OPERATE_FAIL, 'short', 'center');
                    }).always(function() {

                    });
                }
            })
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
            if (id == null) return;
            var strStatus;
            switch (parseInt(id)) {
                case 0:
                    strStatus = I18n.resource.appDashboard.workflow.STATUS_0;
                    break;
                case 1: //执行中
                    strStatus = I18n.resource.appDashboard.workflow.STATUS_1;
                    break;
                case 2: //已完成
                    strStatus = I18n.resource.appDashboard.workflow.STATUS_2;
                    break;
                case 3: //不通过
                    strStatus = I18n.resource.appDashboard.workflow.STATUS_3;
                    break;
                default:
                    strStatus = '';
                    break;
            }
            return strStatus;
        },
        getBehaviorContent: function(id) {
            if (id == null) return;
            var strBehavior;
            switch (parseInt(id)) {
                case 1:
                    strBehavior = I18n.resource.appDashboard.workflow.PROCESS_REVIEW;
                    break;
                case 2:
                    strBehavior = I18n.resource.appDashboard.workflow.PROCESS_EXECUTE;
                    break;
                default:
                    strBehavior = '';
                    break;
            }
            return strBehavior
        },
        initProgress: function() {
            var $container = $('#wkProgress').html('');
            var strProgress, status;
            WebAPI.get('/workflow/transaction/get_progress/' + WkConfig.wkId).done(function(result) {
                var progressList = result.data;
                for (var i = 0; i < progressList.length; i++) {
                    strProgress = new StringBuilder();
                    switch (progressList[i].op) {
                        case 'start': //开始了任务
                            status = I18n.resource.appDashboard.workflow.OP_START;
                            break;
                        case 'pause': //开始了任务
                            status = I18n.resource.appDashboard.workflow.OP_PAUSE;
                            break;
                        case 'complete': //完成了任务
                            status = I18n.resource.appDashboard.workflow.OP_COMPLETE;
                            break;
                        case 'restart': //重启了任务
                            status = I18n.resource.appDashboard.workflow.OP_RESTART;
                            break;
                        case 'new': //创建了任务
                            status = I18n.resource.appDashboard.workflow.OP_NEW;
                            break;
                        case 'edit': //编辑了任务
                            status = I18n.resource.appDashboard.workflow.OP_EDIT;
                            break;
                        case 'forward': //转发了任务
                            status = I18n.resource.appDashboard.workflow.OP_FORWARD;
                            if (progressList[i].detail) {
                                var detail = JSON.parse(progressList[i].detail);
                                var subStr = I18n.resource.appDashboard.workflow.OP_FORWARD_SUB;
                                if (detail.executor && detail.executor.old && detail.executor.new) {
                                    subStr = subStr.replace('<%old%>', '<span style="color:darkorange">' + detail.executor.old + '</span>');
                                    subStr = subStr.replace('<%new%>', '<span style="color:darkorange">' + detail.executor.new + '</span>');
                                }
                            }
                            status += '</br>' + subStr;
                            break;
                        case 'verified': //验证了任务
                            status = I18n.resource.appDashboard.workflow.OP_VERIFY;
                            break;
                        case 'not_pass': //验证了任务且未通过
                            status = I18n.resource.appDashboard.workflow.OP_NOT_PASS;
                            break;
                        case 'reply': //回复了任务
                            status = I18n.resource.appDashboard.workflow.OP_REPLY;
                            break;
                        case 'delete': //删除了任务
                            status = I18n.resource.appDashboard.workflow.OP_DELETE;
                            break;
                        case 'close': //终止了任务
                            status = I18n.resource.appDashboard.workflow.OP_CLOSE;
                            break;
                        case 'delete_reply': //删除了回复
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
        close: function() {
            //WkConfig.wkInfo = null;
            //CssAdapter.clearIndexMain();
        }
    };
    return WorkflowDetail;
})();