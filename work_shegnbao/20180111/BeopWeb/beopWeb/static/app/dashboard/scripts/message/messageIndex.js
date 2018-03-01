/**
 * Created by win7 on 2015/10/21.
 */
var MessageIndex = (function(){
    var _this = this;
    function MessageIndex(){
        _this = this;
        this.store = {
            list:[],
            //total:0
        };
        this.focusNode = {};
        this.selectNode = [];
        this.isLoading = false;
        this.query = {
                filter:{
                    status:-1,
                    userId:AppConfig.userId,
                    type:''//工单筛选种类，空对象代表不限
                },
                asc:false,//排序方式
                start:0,//开始位置
                limit:10 //记录长度，-1代表不限
            };
        this.isEditMode = false;
    }
    MessageIndex.navOptions = {
        top: '<span class="navTopItem title middle" i18n="appDashboard.message.MESSAGE_CENTER"></span>\
            <span id="btnMsgEdit" class="navTopItem right zepto-ev" i18n="appDashboard.message.MODE_EDIT"></span>',
        bottom: true,
        backDisable: false
    };
    MessageIndex.prototype = {
        show:function(){
            WebAPI.get("/static/app/dashboard/views/message/messageIndex.html").done(function(resultHtml){
                $('#indexMain').html(resultHtml);
                _this.init();
                _this.attachEvent();
                I18n.fillArea($('#navTop'));
                I18n.fillArea($(ElScreenContainer));
            })
        },
        init:function(forMore){
            var $messageCenter = $('#messageCenter');
            if(!forMore){
               this.query.start = 0 ;
                $('.messageInfoBox').html('');
                SpinnerControl.show();
                _this.store.list = [];
            }
            this.isLoading = true;
            WebAPI.post("/appCommon/pushNotification/getMessageList",_this.query).done(function(result){
                //console.log(result);
                var tempStore = [];
                if(result.data&&result.data.length!=0){
                    tempStore = result.data;
                    _this.store = {
                        list:_this.store.list.concat(tempStore),
                        //total:Math.max(result.data.length,(result.total?result.total:0))
                    };
                    _this.query.start = _this.query.start + _this.query.limit;
                }else{
                    //_this.store = {
                    //    list:[],
                    //    //total:0
                    //}
                    _this.query.start = -1;
                }
                //_this.query.start = Math.min(_this.query.start + _this.query.limit,_this.store.total);
                _this.renderMessage(tempStore);
            }).always(function(){
                SpinnerControl.hide();
                _this.isLoading = false;
            });
        },
        showDetail:function(msg){
            this.focusNode = msg;
            var container = document.getElementById('panelMsgDetail');
            container.innerHTML = '\
            <div class="icon '+ className(msg.type) +'"></div>\
            <div class="title">' + msg.title +'</div>\
            <div class="createTime">'+ I18n.resource.appDashboard.message.MESSAGE_PUSH_TIME +'：' + new Date(+moment(msg.createTime,'MM/DD/YY HH:mm:ss')).format('yyyy-MM-dd HH:mm:ss') +'</div>\
            <div class="description">' + msg.alert +'</div>\
            ';
            if(msg.type && msg.type != 'default'){
                container.innerHTML +='<div class="btnGrp"><span class="btnTool btnLink glyphicon glyphicon-share-alt"></span><span class="btnTool btnClose glyphicon glyphicon-remove"></span></div>'
            }else{
                container.innerHTML +='<div class="btnGrp"><span class="btnTool btnClose glyphicon glyphicon-remove"></span></div>'
            }
            container.classList.remove('hide');
            $('.wrapDropdownBg').removeClass('hide');

            function className(type){
                var classList = '';
                if(type=='workflow'){
                    classList = 'iconfont icon-gongdan';
                }else if(type=='report'){
                    classList = 'icon iconfont icon-baobiao1';
                }else if(type=='dashboard'){
                    classList = 'glyphicon glyphicon-stats';
                }else if(type=='default'){
                    classList = 'glyphicon glyphicon-envelope';
                }
                return classList;
            }
        },
        hideDetail:function(){
            _this.focusNode = {};
            $('#panelMsgDetail').addClass('hide');
            $('.wrapDropdownBg').addClass('hide')
        },
        loadMoreList:function(){
            var _this = this;
            var container = $('.messageInfoBox')[0];
            _this.loadMoreListTimer = window.setInterval(function() {
                if (!container){
                    window.clearInterval(_this.loadMoreListTimer);
                    return;
                }
                if (_this.query.start == -1 || _this.isLoading) return;
                if (container.scrollHeight - container.scrollTop < container.offsetHeight + 10) {
                    //if(_this.store.total <= (_this.query.start)){
                    //    _this.query.start = -1
                    //}else{
                        _this.init(true)
                    //}
                }
            }, 10);
        },
        renderMessage:function(store){
            var temptpl = '<div class="messageInfos clearfix zepto-ev" data-status="{status}" data-id="{id}" data-type="{type}">\
                <div class="readTip"></div>\
                <div class="messageInfo clearfix">\
                    <div class="checkbox iconfont icon-xuanze" ></div>\
                    <div class="messageContentBox clearfix">\
                        <div class="typeImg"><span class="{classList}"></span></div>\
                        <div class="messageContent">\
                            <div class="messageTitle"><span class="title">{title}</span><span class="messageTime">{time}</span></div>\
                            <div class="content">{content}</div>\
                        </div>\
                    </div>\
                </div>\
                <!--<div class="btnBoxMessage">\
                    <div class="messageBtn" id="deleteBtn">删除</div>\
                    <div class="messageBtn" id="alreadyRead">已读</div>\
                </div>-->\
                </div>';
            var strHtml = '';
            var j = 0;
            for(var i = 0;i<store.length;i++){
                var item = store[i];
                var classList = className(item.type);
                strHtml += temptpl.formatEL({
                    status:item.status,
                    id:item.msgId,
                    type:item.type,
                    title:item.title,
                    time:DateUtil.getRelativeDateInfo(new Date(),new Date(+moment(item.createTime,'MM/DD/YY HH:mm:ss'))),
                    content:item.alert,
                    classList:'icon ' + classList
                });
            }
            $('.messageInfoBox')[0].innerHTML +=strHtml;

            //不同类型对应不同标志图片
            function className(type){
                var classList = '';
                if(type=='workflow'){
                    classList = 'iconfont icon-gongdan';
                }else if(type=='report'){
                    classList = 'iconfont icon-baobiao1';
                }else if(type=='dashboard'){
                    classList = 'glyphicon glyphicon-stats';
                }else if(type=='default'){
                    classList = 'glyphicon glyphicon-envelope';
                }
                return classList;
            }
        },
        attachEvent: function () {
            this.initNav();
            this.loadMoreList()
            //左拉显示按钮事件
            function prevent_default(e) {
                e.preventDefault();
            }

            function disable_scroll() {
                $(document).on('touchmove', prevent_default);
            }

            function enable_scroll() {
                $(document).unbind('touchmove', prevent_default)
            }
            var $downUpdate = $('#downUpdate');
            var $messageCenter = $('#wrapMessageList');
            var $messageEdit = $('#messageEdit');
            var $messageListBox = $('.messageInfoBox');
            //var startY, endY, touchHeight;
            //$messageCenter.off('touchstart').on('touchstart', function (e) {
            //    var touch = e.originalEvent.targetTouches[0];
            //    startY = touch.pageY;
            //});
            //$messageCenter.off('touchmove').on('touchmove', function (e) {
            //    var touch = e.originalEvent.targetTouches[0];
            //    endY = touch.pageY;
            //    touchHeight = endY - startY;
            //    if(!($messageListBox[0].scrollTop <= 0 &&touchHeight> 0) )return;
            //    e.preventDefault();
            //    if (touchHeight > 5 && touchHeight < 100) {
            //        $downUpdate.addClass('cur');
            //        $downUpdate.css({
            //            'height': touchHeight
            //        });
            //    }
            //    if(touchHeight > 100){
            //        $downUpdate.find('.updateTitile').html('释放更新');
            //        $downUpdate.find('#icon').removeClass("down").addClass('up');
            //    }
            //});
            //
            //$messageCenter.off('touchend').on('touchend', function () {
            //    if (touchHeight > 5) {
            //        _this.init();
            //    }
            //    $downUpdate.find('.updateTitile').html('下拉更新');
            //    $downUpdate.find('#icon').removeClass("up").addClass('down');
            //    $downUpdate.removeClass('cur');
            //    $downUpdate.css({
            //        'height': 0 + 'px'
            //    });
            //});

            //var x;
            //$messageCenter
            //    .on('touchstart', '.messageInfo',function (e) {
            //        $('.open').css('left', '0px') // close em all
            //        $(e.currentTarget).addClass('open')
            //        x = e.originalEvent.targetTouches[0].pageX // anchor point
            //    })
            //    .on('touchmove', function (e) {
            //        var changeNum = e.originalEvent.targetTouches[0].pageX - x;
            //        changeNum = Math.min(Math.max(-160, changeNum), 0) // restrict to -160px left, 0px right
            //        e.currentTarget.style.left = changeNum + 'px'
            //        if (changeNum < -10) disable_scroll() // disable scroll once we hit 10px horizontal slide
            //    })
            //    .on('touchend', function (e) {
            //        var left = parseInt(e.currentTarget.style.left);
            //        var new_left;
            //        if (left < -35) {
            //            new_left = '-160px'
            //        } else if (left > 35) {
            //            new_left = '160px'
            //        } else {
            //            new_left = '0px'
            //        }
            //        $(e.currentTarget).animate({
            //            left: new_left
            //        }, 200)
            //        enable_scroll()
            //    })
            //    //删除事件
            //$('#deleteBtn').on('touchstart', function () {
            //    var $currentParent = $(this).parents('.messageInfos');
            //    var id = $currentParent.attr('data-id');
            //    _this.deleteItems([id]);
            //})

            $('#btnMsgSelectAll').off('tap').on('tap',function(){
                _this.selectNode = [];
                $('.messageInfos').addClass('selected').each(function(i,dom){
                    _this.selectNode.push(dom.dataset.id)
                })
            });
            $('#btnMsgSelectReverse').off('tap').on('tap',function(){
                _this.selectNode = [];
                $('.messageInfos').toggleClass('selected');
                $('.messageInfos .selected').each(function(i,dom){
                    _this.selectNode.push(dom.dataset.id)
                })
            });
            $('#btnMsgRead').off('tap').on('tap',function(){
                _this.readItems(_this.selectNode);
            });
            $('#btnMsgDelete').off('tap').on('tap',function(){
                _this.deleteItems(_this.selectNode).done(function(){_this.selectNode = [];})
                //var postData = _this.selectNode;
                //for(var i = 0;i<postData.length;i++){
                //    var $dom = $('.messageInfos[data-id="'+postData[i]+'"]');
                //    _this.store.list.splice($dom.index(),1);
                //    _this.store.total--;
                //    _this.query.start-- ;
                //    if(_this.query.start <0) _this.query.start = 0;
                //    $dom.remove()
                //}
                //var container = $('.messageInfoBox')[0];
                //if (container.scrollHeight == container.offsetHeight) {
                //    _this.init(true)
                //}
            });
            $('.messageInfoBox ').off('tap').on('tap','.messageInfos',function(e){
                var $box = $(e.currentTarget);
                if(_this.isEditMode) {
                    if ($box.hasClass('selected')) {
                        $box.removeClass('selected');
                        _this.selectNode.splice($box.index(), 1);
                    } else {
                        $box.addClass('selected');
                        _this.selectNode.push($box[0].dataset.id);
                    }
                }else{
                    if ($box[0].dataset.status != 2) {
                        _this.readItems([parseInt($box[0].dataset.id)],true);
                    }
                    _this.showDetail(_this.store.list[$box.index()])
                }
            });
            var $dropdown = $('.wrapDropdownBg');
            $('.messageNavTool .navItem').off('click').on('click',function(e){
                _this.hideDetail()
                var target = e.currentTarget.dataset.target;
                var $targetList = $('.subItemList[data-target="'+ target +'"]');
                if(!$targetList.hasClass('hide')){
                    $targetList.addClass('hide');
                    $dropdown.addClass('hide')
                }else {
                    $('.subItemList').addClass('hide');
                    $targetList.removeClass('hide');
                    $dropdown.removeClass('hide')
                }
            });
            $dropdown.off('tap').on('tap',function(e){
                $('.subItemList').addClass('hide');
                document.getElementById('panelMsgDetail').classList.add('hide');
                e.currentTarget.classList.add('hide')
            });
            $('.subItemList').off('click','.rowType').on('click','.rowType',function(e){
                var type = e.currentTarget.parentNode.dataset.target;
                switch (type){
                    case 'template':
                        _this.setTemplateSel(e.currentTarget);
                        break;
                    case 'filter':
                        _this.setFilterSel(e.currentTarget);
                        break;
                    case 'sort':
                        _this.setSortSel(e.currentTarget);
                        break;
                }
                $(this).parent().addClass('hide');
                $dropdown.addClass('hide');
                _this.query.start = 0;
                _this.selectNode = [];
                _this.init();
            })

            var $panelDetail = $('#panelMsgDetail');
            $panelDetail.off('click').on('click','.btnLink',function(){
                _this.skipToTemplatePage(_this.focusNode)
            }).on('click','.btnClose',function(){
                _this.hideDetail()
            })
        },
        skipToTemplatePage:function(msg){
            if(!msg.option)return;
            switch(msg.type){
                case 'workflow':
                    router.to({
                        typeClass: WorkflowDetail,
                        data: { id: msg.option.id }
                    });
                    break;
                case 'report':
                    if (msg.option.isFactory) {
                        router.to({
                            typeClass: ProjectFactoryReport,
                            data: {
                                projectId: msg.option.projectId,
                                reportDetail: msg.option.reportDetail,
                                reportList: [],
                                reportId: msg.option.reportId,
                                reportDate: msg.option.reportDate ? msg.option.reportDate : null
                            }
                        });
                    } else {
                        router.to({
                            typeClass: ProjectReport,
                            data: {
                                projectId: msg.option.projectId,
                                reportDetail: msg.option.reportDetail,
                                reportList: [],
                                reportId: msg.option.reportId,
                                reportDate: msg.option.reportDate ? msg.option.reportDate : null
                            }
                        });
                    }
                    break;
                case 'dashboard':
                    if (!msg.option.projectId) {
                        window.plugins && window.plugins.toast.show(I18n.resource.appDashboard.project.PUSH_PAGE_ERROR1, 'short', 'center');
                        return;
                    }
                    var projectInfo;
                    for (var i = 0; i < ProjectConfig.projectList.length; i++) {
                        if (msg.option.projectId == ProjectConfig.projectList[i].id) {
                            projectInfo = ProjectConfig.projectList[i];
                        }
                    }
                    if (!projectInfo) {
                        window.plugins && window.plugins.toast.show(I18n.resource.appDashboard.project.PUSH_PAGE_ERROR2, 'short', 'center');
                        return;
                    }
                    router.to({
                        typeClass: ProjectDashboard,
                        data: {
                            menuId: msg.option.id,
                            name: msg.option.name,
                            projectInfo: projectInfo
                        }
                    });
                    break;
                default:
                    break;
            }
        },
        setTemplateSel:function(dom){
            var val = '';
            if (dom.classList.contains('selected')) {
                dom.classList.remove('selected');
                $(dom).parent().children().eq(0).addClass('selected')
            } else {
                $(dom).siblings().removeClass('selected');
                dom.classList.add('selected');
                val = dom.dataset.type;
            }
            _this.query.filter.type =val;
        },
        setFilterSel:function(dom){
            var val = -1;
            if (dom.classList.contains('selected')) {
                dom.classList.remove('selected');
            } else {
                $(dom).siblings().removeClass('selected');
                dom.classList.add('selected');
                val = parseInt(dom.dataset.type);
            }
            _this.query.filter.status =val;
        },
        setSortSel:function(dom){
            dom.classList.toggle('asc');
            _this.query.asc = dom.classList.contains('asc');
        },
        topItems:function(){

        },
        readItems:function(list,isBackground){
            if(!isBackground) {
                SpinnerControl.show();
            }
            var postData = list;
            var _this = this;
            var $promise = $.Deferred();
            WebAPI.post("/appCommon/pushNotification/updateMessage/"+AppConfig.userId + '/2',postData).done(function(result){
                if(result.success){
                    var $dom,store;
                    for(var i = 0;i<postData.length;i++){
                        $dom = $('.messageInfos[data-id="'+postData[i]+'"]');
                        $dom[0].dataset.status = 2;
                        AppConfig.newMessageNumber && AppConfig.newMessageNumber--

                        store = _this.store.list[$dom.index()];
                        store.status = 2;
                        store.readTime = new Date()
                    }
                    if(!isBackground) infoBox.alert(I18n.resource.appDashboard.message.UPDATE_SUCCESS);
                    $promise.resolve();
                }else{
                    if(!isBackground) infoBox.alert(I18n.resource.appDashboard.message.UPDATE_FAIL);
                    $promise.reject();
                }
            }).fail(function(){
                if(!isBackground) infoBox.alert(I18n.resource.appDashboard.message.UPDATE_FAIL);
                $promise.reject();
            }).always(function(){
                SpinnerControl.hide();
            });
            return $promise
        },
        deleteItems:function(list){
            SpinnerControl.show();
            var postData = list;
            var _this = this;
            var $promise = $.Deferred();
            WebAPI.post("/appCommon/pushNotification/deleteMessage/"+AppConfig.userId,postData).done(function(result){
                if(result.success){
                    for(var i = 0;i<postData.length;i++){
                        var $dom = $('.messageInfos[data-id="'+postData[i]+'"]');
                        if($dom[0].dataset.status != 2){
                            AppConfig.newMessageNumber && AppConfig.newMessageNumber--
                        }
                        _this.store.list.splice($dom.index(),1);
                        //_this.store.total--;
                        if(_this.query.start != -1) {
                            _this.query.start--;
                            if (_this.query.start < 0) _this.query.start = 0;
                        }
                        $dom.remove()
                    }
                    var container = $('.messageInfoBox')[0];
                    if (container.scrollHeight == container.offsetHeight) {
                        _this.init(true)
                    }
                    infoBox.alert(I18n.resource.appDashboard.message.DELETE_SUCCESS);
                    $promise.resolve();
                }else{
                    infoBox.alert(I18n.resource.appDashboard.message.DELETE_FAIL);
                    $promise.reject();
                }
            }).fail(function(){
                infoBox.alert(I18n.resource.appDashboard.message.DELETE_FAIL);
                $promise.reject();
            }).always(function(){
                SpinnerControl.hide();
            });
            return $promise
        },
        resetOption:function(){

        },
        initNav:function(){
            var $wrap = $('#messageCenter');
            $('#btnMsgEdit').off('tap').on('tap',function(e){
                if($wrap.hasClass('editMode')){
                    e.currentTarget.innerHTML = I18n.resource.appDashboard.message.MODE_EDIT;
                    _this.selectNode = [];
                    $('.messageInfos').removeClass('selected')
                    _this.isEditMode = false;
                }else{
                    e.currentTarget.innerHTML = I18n.resource.appDashboard.message.MODE_SHOW;
                    _this.isEditMode = true;
                }
                $wrap.toggleClass('editMode')
            })
        },
		close:function(){
            IndexScreen.prototype.getNewMessageNumber();
            this.sotre = null;
            window.clearInterval(this.loadMoreListTimer)
        }
    };
    return MessageIndex;
})();