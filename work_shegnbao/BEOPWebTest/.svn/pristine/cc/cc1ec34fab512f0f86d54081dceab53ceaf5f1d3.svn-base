 /* Created by win7 on 2015/10/27.
 */
var WorkflowAdd = (function(){
    var _this;
    function WorkflowAdd(){
        _this = this;
        _this.$wrapBg = undefined;

        _this.teamId = undefined;
        _this.taskGrp = [];
        _this.tag= [];
        _this.curProcess ={};

        _this.opt = {
            attachMent:[],
            fields:{
                critical:0,
                detail:null,
                dueDate:new Date(+new Date() + 86400000).format('yyyy-MM-dd'),
                process:null,
                taskGroup:null,
                template_id:null,
                title:null
            },
            processMember:{

            },
            tags:[],
            watchers:[]
        };

        _this.userPage = undefined;
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
                _this.$wrapBg = $(document.getElementById('wrapBg'));
                _this.init();
                I18n.fillArea($('#navTop'));
                I18n.fillArea($('#wkAddInfo'));
                I18n.fillArea($('#workflowAddBtn'));
                I18n.fillArea($('#wkUserDialog'));
            });
        },
        init:function(){
            //_this.initUploadImg();
            //_this.initUserShow();
            SpinnerControl.show();
            $.when(WebAPI.get('/workflow/taskGroup/'),WebAPI.get('/workflow/tags/')).done(function(taskGrp,tags){
                _this.taskGrp = taskGrp[0].data;
                _this.tag = tags[0].data;
                _this.initUserSelectPage();
                _this.initDeadline();
                _this.initCritical();
                _this.initWatcher();
                _this.initTeam();
                _this.initTag();
                _this.initCreate();
                _this.attachEvent();
            }).always(function(){
                SpinnerControl.hide()
            });
        },
        attachEvent:function(){
            var _this = this;
            $('.panelEdit').parent().not('.disableDefault').off('touchend').on('touchend',function(e){
                $(e.currentTarget).find('.panelEdit').addClass('focus');
                _this.$wrapBg.addClass('focus');
            });
            this.$wrapBg.off('tap').on('tap',function(){
                var panelForTag = $('#wkTag .panelEdit');
                if(panelForTag.hasClass('focus')){
                    panelForTag.find('spItem').removeClass('selected');
                    for (var i = 0 ; i < _this.opt.tags.length ;i++){
                        panelForTag.find('data-value=["' + _this.opt.tags[i] + '"]').addClass('selected')
                    }
                }
                $('.panelEdit').removeClass('focus');
                _this.$wrapBg.removeClass('focus');
            })
        },
        initUserSelectPage:function(){
            this.userPage = new SelectPage({
                    type:'user',
                    mode:'radio',
                    ctn:document.getElementById('ctnUserSel'),
                    teamId:_this.opt.fields.taskGroup,
                    screen:_this
                });
        },
        initDeadline:function(){
            var $ctn = $('#wkDeadline');
            var $content = $ctn.find('.spContent');
            $content.text(new Date(+new Date() + 86400000).format('yyyy-MM-dd'));
            $content.off('tap').on('tap',function(){
                if(typeof datePicker == 'undefined')return;
                datePicker.show(
                    {
                        date:date?date:new Date(),
                        minDate:new Date(),
                        mode:'date',
                        okText:AppConfig.language == 'zh'?'确定':'Done',
                        cancelText:AppConfig.language == 'zh'?'取消':'Cancel',
                        allowFutureDates:false,
                        doneButtonLabel:AppConfig.language == 'zh'?'确定':'Done',
                        cancelButtonLabel:AppConfig.language == 'zh'?'取消':'Cancel'
                    },
                    setDate,
                    function(){}
                );
            });
            function setDate(date){
                if (!date)return;
                var strDate = new (date).format('yyyy-MM-dd');
                $content.textContent = strDate;
                _this.opt.fields.dueDate = strDate;
            }
        },
        initCritical:function(){
            var $ctn = $('#wkCritical');
            var $content = $ctn.find('.spContent');
            var $list = $ctn.find('.panelEdit');
            $list.off('tap').on('tap','.spItem',function(e){
                var $target = $(e.currentTarget);
                $list.removeClass('focus');
                _this.$wrapBg.removeClass('focus');
                if($target.hasClass('selected'))return;
                $target.siblings().removeClass('selected');
                $target.addClass('selected');
                _this.opt.fields.critical = e.currentTarget.dataset.value;
                $content.text(e.currentTarget.textContent);
                $content.removeClass('critical-0 critical-1 critical-2').addClass('critical-' + _this.opt.fields.critical)
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
        initWatcher:function(){
            var $ctn = $('#wkWatcher');
            var $content = $ctn.find('.spContent');
            $ctn.off('tap').on('tap',function(e){
                _this.userPage.list = null;
                _this.userPage.selectList = _this.opt.watchers;
                _this.userPage.mode = 'check';
                _this.userPage.teamId = null;
                _this.userPage.callback = function(result){
                    $content.html('');
                    if (result.length == 0){
                        $content.text(I18n.resource.appDashboard.workflow.NO_CHOICE);
                    }else {
                        $content.html(result.map(function(user){return '<span>' + user.userfullname + '</span>'}).join(''));
                    }
                    _this.opt.watchers = result.map(function(user){return user.id})
                };
                _this.userPage.show();
            });
        },
        initTeam:function(){
            var $ctn = $('#wkTeam');
            var $content = $ctn.find('.spContent');
            var $list = $ctn.find('.panelEdit');
            var item;
            for (var i = 0; i < this.taskGrp.length ;i++){
                item = document.createElement('span');
                item.className = 'spItem zepto-ev';
                item.dataset.value = this.taskGrp[i]._id;
                item.textContent = this.taskGrp[i].name;
                $list.append(item)
            }
            $list.off('tap').on('tap','.spItem',function(e){
                var $target = $(e.currentTarget);
                $list.removeClass('focus');
                _this.$wrapBg.removeClass('focus');
                if($target.hasClass('selected'))return;
                $target.siblings().removeClass('selected');
                $target.addClass('selected');
                _this.opt.fields.taskGroup = e.currentTarget.dataset.value;
                $content.text(e.currentTarget.textContent);
                _this.initProcess();
            });
            $list.find('.spItem').first().trigger('tap');
        },
        initTag:function(){
            var $ctn = $('#wkTag');
            var $content = $ctn.find('.spContent');
            var $list = $ctn.find('.panelEdit');
            var item;
            for (var i = 0; i < this.tag.length ;i++){
                item = document.createElement('span');
                item.className = 'spItem zepto-ev';
                item.dataset.value = this.tag[i].type;
                item.textContent = this.tag[i].name;
                $list.append(item)
            }
            $list.off('tap').on('tap','.spItem',function(e){
                var $target = $(e.currentTarget);
                $target.toggleClass('selected');
            });
            $list.on('tap','.btnSure',function(){
                var $selTag = $list.find('.spItem.selected');
                var arrTagText = [];
                var arrTagValue = [];
                for (var i = 0; i <$selTag.length ;i++){
                    arrTagText.push('<span>'+ $selTag[i].textContent + '</span>');
                    arrTagValue.push($selTag[i].textContent);
                }
                _this.opt.tags = arrTagValue;
                if(_this.opt.tags.length == 0){
                    $content.html(I18n.resource.appDashboard.workflow.NO_CHOICE);
                }else {
                    $content.html(arrTagText.join(''));
                }
                $list.removeClass('focus');
                _this.$wrapBg.removeClass('focus');
            })
        },
        initCreate:function(){
            $('#btnAddWk').off('tap').on('tap',function(){
                if(!_this.opt.processMember){
                    window.plugins && window.plugins.toast.show('请选择流程！', 'short', 'center');
                    return;
                }else {
                    for (var i = 0 ; i < _this.curProcess.nodes.length ;i++){
                        if(!(_this.opt.processMember[_this.curProcess.nodes[i]._id] instanceof Array && _this.opt.processMember[_this.curProcess.nodes[i]._id].length > 0)){
                            window.plugins && window.plugins.toast.show('部分节点人员未选择，请检查！', 'short', 'center');
                            return ;
                        }
                    }
                }
                _this.opt.fields.detail = document.getElementById('inputWkDetail').value;
                _this.opt.fields.title = document.getElementById('inputWkTitle').value;
                var postData = _this.opt;
                SpinnerControl.show();
                WebAPI.post('/workflow/task/save/',postData).done(function(resultData){
                    if(resultData.success) {
                        window.plugins && window.plugins.toast.show('创建成功，为您跳转', 'short', 'center');
                        router.to({
                            typeClass: WorkflowDetail,
                            data: {
                                id: resultData.data
                            }
                        })
                    }
                }).fail(function(){
                    window.plugins && window.plugins.toast.show('创建失败，请稍后再试', 'short', 'center');
                }).always(function() {
                        SpinnerControl.hide();
                    }
                );
            });
        },
        initProcess:function(){
            if(!_this.opt.fields.taskGroup)return;
            var $ctn = $('#wkProcess');
            var $content = $ctn.find('.spContent');
            var $list = $ctn.find('.panelEdit');
            var curGrp = _this.taskGrp.filter(function(item){return item._id == _this.opt.fields.taskGroup})[0];
            var process = curGrp.process;
            var spItem;
            $list.html('<span class="panelTtl">流程</span>');
            $content.html('');
            for (var i = 0; i < process.length ;i++){
                spItem = document.createElement('span');
                spItem.className ='spItem zepto-ev';
                spItem.dataset.value = process[i]._id;
                spItem.dataset.template = process[i].template._id;
                spItem.textContent = process[i].name?process[i].name:'默认流程';
                $list.append(spItem)
            }

            if(process && process.length >0) {
                $list.off('tap').on('tap', '.spItem', function (e) {
                    var $target = $(e.currentTarget);
                    $list.removeClass('focus');
                    _this.$wrapBg.removeClass('focus');
                    if ($target.hasClass('selected'))return;
                    $target.siblings().removeClass('selected');
                    $target.addClass('selected');
                    _this.opt.fields.process = e.currentTarget.dataset.value;
                    _this.opt.fields.template_id = e.currentTarget.dataset.template;
                    _this.curProcess = process.filter(function(item){return item._id ==_this.opt.fields.process})[0];
                    _this.opt.processMember = {};
                    if(_this.curProcess) {
                        for (var i = 0; i < _this.curProcess.nodes.length; i++) {
                            _this.opt.processMember[_this.curProcess.nodes[i]._id] = []
                        }
                    }
                    $content.text(e.currentTarget.textContent);
                    _this.initProcessUser();
                });

                $list.find('.spItem').first().trigger('tap')
            }else{
                $list.off('tap');
                _this.opt.fields.process = '';
                _this.opt.fields.template_id = '';
                $content.text(I18n.resource.appDashboard.workflow.NO_CHOICE);
                this.initProcessUser()
            }
        },
        initProcessUser:function(){
            if(!_this.opt.fields.taskGroup)return;
            var $ctn = $('#wkProcessUser');
            var $content = $ctn.find('.spContent');
            var curGrp = _this.taskGrp.filter(function(item){return item._id == _this.opt.fields.taskGroup})[0];
            var process = curGrp.process.filter(function(item){return item._id == _this.opt.fields.process})[0];
            $content.html('');
            $ctn.removeClass('focus');
            if(process) {
                var nodes = process.nodes;

                var node;
                $ctn.addClass('focus');
                $content.append(this.createNodeDom());
                for (var i = 0; i < nodes.length; i++) {
                    node = this.createNodeDom(nodes[i],i);
                    $content.append(node);
                }
                $ctn.off('tap').on('tap', '.spProcessNode', function (e) {
                    var $target = $(e.currentTarget);
                    var index = $target.parent().index() - 1;
                    if ($target.parent().hasClass('creator'))return;
                    _this.userPage.selectList = _this.opt.processMember[process.nodes[index]._id];
                    _this.userPage.list = process.nodes[index].members;
                    _this.userPage.mode = 'radio';
                    _this.userPage.teamId = _this.opt.fields.taskGroup;
                    _this.userPage.callback = function (result) {
                        if (result.length > 0) {
                            $target[0].style.backgroundImage = 'url("'+ result[0].userpic + '")';
                            $target.children().html(result.map(function (user) {
                                return '<span>' + user.userfullname + '</span>'
                            }).join(''));
                            _this.opt.processMember[process.nodes[index]._id] = [result[0]]
                        }else{
                            $target[0].style.backgroundImage = 'url("http://images.rnbtech.com.hk/static/images/avatar/user/default_group.png")';
                            $target.text('未选择');
                            _this.opt.processMember[process.nodes[index]._id] = []
                        }
                        _this.opt.processMemeber = {}
                    };
                    _this.userPage.show();
                });
                var finishNode = document.createElement('span');
                finishNode.className = 'completeNode';
                finishNode.textContent = '完成';
                $content.append(finishNode);
            }
        },
        createNodeDom:function(node,index){
            var dom = document.createElement('div');
            dom.className = 'divProcessNode';
            if(!node) {
                node = {
                    behaviour: '0',
                    members: [
                        {
                            userfullname: AppConfig.userProfile.fullname,
                            userpic: 'http://images.rnbtech.com.hk/' + AppConfig.userProfile.picture
                        }
                    ]
                };
                dom.className += ' creator';
            }

            var process = document.createElement('span');
            process.className = 'spProcessNode zepto-ev';
            if(node.archType == 4){
                process.style.backgroundImage = 'url("http://images.rnbtech.com.hk/static/images/avatar/user/default_group.png")';
            }else{
                process.style.backgroundImage = 'url("' + node.members[0].userpic +'")';
            }

            var user = document.createElement('span');
            user.className = 'spProcessUser';
            if(index != null && node.members instanceof Array && node.members.length == 1){
                user.textContent = node.members[0].userfullname;
                _this.opt.processMember[node._id] = [node.members[0]]
            }else {
                if (node.archType == 4) {
                    user.textContent = '全体成员';
                } else if (node.archType == 3 && node.archName) {
                    user.textContent = node.archName;
                } else {
                    user.textContent = node.members[0].userfullname
                }
            }

            var behavior = document.createElement('span');
            behavior.className = 'spBehavior';
            switch (parseInt(node.behaviour)){
                case 0:
                    behavior.textContent = '发起人';
                    break;
                case 1:
                    behavior.textContent = '审核';
                    break;
                case 2:
                    behavior.textContent = '执行';
                    break;
            }

            var guide = document.createElement('span');
            guide.className = 'spGuide';

            process.appendChild(user);
            dom.appendChild(process);
            dom.appendChild(behavior);
            dom.appendChild(guide);

            return dom;
        },
        close:function(){

        }
    };
    return WorkflowAdd;
})();