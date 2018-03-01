;(function (exports) {

    function Tab(screen, container, options) {
        this.container = container;
        this.domWrap = this.container.parentNode.parentNode;
        this.$domCache = null;

        this.screen = screen;

        this.options = options;

        this.toolCtn = null;
        this.itemCtn = null;

        this.store = null;
        this.search = {};
        this.list = [];
        this.treeObj = null;
        this.currentRequest = null;
    }

    +function () {
        this.tabOptions = {
            title: '',
            toolsTpl: '',
            itemTpl:'',
            dataUrl: ''
        };

        // 将原始数据转换成显示需要的 View Object
        this.format2VO = function (data) {
            return data;
        };

        /**
         * 显示 Tab
         * @param  {boolean} fromCache 是否从缓存读取数据，此举旨在防止无意义的加载，缺省时为 true
         */
        this.show = function (fromCache) {
            var _this = this;

            // fromCache = typeof fromCache === 'undefined' ? true : fromCache;
            fromCache = false;

            if (fromCache && this.$domCache) {
                // 尝试从缓存读取
                this.$domCache.appendTo(_this.container);
                return;
            }

            // 获取数据
            this.getData().done(function () {
                _this.treeTemplate();
                _this.render();
                _this.commonEvents();
                _this.attachEvents();
            });
        };

        this.getData = function () {
            var _this = this;
            var url = this.tabOptions.dataUrl;

            if (typeof url === 'function') {
                url = url.call(this);
            }
            if(this.currentRequest){
                this.currentRequest.abort();
            }
            if(url.indexOf("Recycle") > -1){
                this.currentRequest = WebAPI.get(url).done(function (rs) {
                    if(_this.currentRequest && _this.currentRequest.status === 200){
                        _this.store = rs.data;
                    }
                });
            }else{
                if(url.indexOf("image") > -1 && this.options.showEnumerationImgId){
                    //特殊处理vivi的枚举图片需求-我靠，靠，靠
                    url = "/factory/material/groupByimage/" + this.options.showEnumerationImgId;
                    this.currentRequest = WebAPI.post(url,{userList:AppConfig.templateUserList}).done(function (rs) {
                        if(_this.currentRequest && _this.currentRequest.status === 200){
                            _this.store = rs.data.data;
                            if(rs.data.list.length > 0){
                                _this.list = rs.data.list.reverse();
                            }                           
                        }
                    });
                }else{
                    this.currentRequest = WebAPI.post(url,{userList:AppConfig.templateUserList}).done(function (rs) {
                        if(_this.currentRequest && _this.currentRequest.status === 200){
                            _this.store = rs.data;
                        }
                    });
                }               
            }
            return this.currentRequest;
        };
        //树结构
        this.treeTemplate = function (){
            var zSetting = {
                view: {
                    showIcon:false,
                    showLine: false,
                    fontCss: {
                        color: "#ffffff"
                    }
                },
                edit: {
                    enable: true,
                    editNameSelectAll: true,
                    showRenameBtn: false,
                    showRemoveBtn: false
                },
                data: {
                    keep:{
                        leaf: true,
                        parent: true
                    },
                    simpleData: {
                        enable: true,
                        idKey: 'id',
                        pIdKey: 'pId',
                        rootPId: ''
                    }
                },
                callback: {
                    onClick: zTreeOnClick,
                    onDrop:  zTreeOnDrop,
                    onNodeCreated: zTreeOnNodeCreated,
                    beforeExpand: zTreeBeforeExpand,
                    onExpand: zTreeOnExpand
                }
            };
            var zProjNodes = this.generateTreeEx(this.store);
            var obj = $(this.screen.leftCtn).find('#tree'+$('.divCheck',this.screen.leftCtn).parent('.tab-item').attr('data-type')+'Template');
            this.treeObj = $.fn.zTree.init(obj, zSetting, zProjNodes);
            var _this = this;

            function zTreeOnClick(event, treeId, treeNode){
                var leftCtn = $(_this.screen.leftCtn);
                var rightCtn = $(_this.screen.rightCtn);
                if(!$.isEmptyObject(_this.screen.activeTabIns.search) && rightCtn.find('.spanSearch').find('.glyphicon-remove').css('display') != 'none'){
                    rightCtn.find('.spanSearch').click();
                }
                if(event.ctrlKey){
                    leftCtn.find('#'+ treeNode.tId + '_a').addClass('treeNodeCheck');
                }else{
                    leftCtn.find('.treeNodeCheck').removeClass('treeNodeCheck');
                    leftCtn.find('#'+ treeNode.tId + '_a').addClass('treeNodeCheck');
                }
                if(treeNode.isParent){
                    var upGroupData = {
                        _id: '...',
                        group: treeNode.id,
                        parentGroupId: treeNode.pId,
                        type: treeNode.type
                    };
                    var list = _this.getList(treeNode,[treeNode.id]);
                    _this.list = list;
                    WebAPI.post('/factory/material/group/'+treeNode.type+'/'+treeNode.id,{userList:AppConfig.templateUserList}).done(function(result){
                        if(!treeNode.children){
                            var newNodes = _this.generateTreeEx(result.data);
                            _this.treeObj.addNodes(treeNode, newNodes,true);
                        }
                        $('#tabName', this.domWrap).find('.focusOnSelf').show();
                        $('#tabName', this.domWrap).find('.showAll').hide();
                        _this.downFolder(result,upGroupData);
                    });
                }
                 
            }
            function zTreeOnDrop (event, treeId, treeNodes, targetNode, moveType){
                var $current = $(event.target);
                var $curTreeNode = treeNodes[0];
                var $panelBody = $('#tabContent', _this.domWrap);
                var params,targetItem,$curItem;
                var notDrog = false;
                if($current.hasClass('group-item') || $current.closest('.group-item').length > 0){
                    $curItem = $current.hasClass('group-item')?$current:$current.closest('.group-item');
                    if($curItem.attr('id') === $curTreeNode.id) return;
                    targetItem = _this.treeObj.getNodeByParam('id',$curItem.attr('id'));
                    notDrog = _this.isChildren(targetItem,$curTreeNode,notDrog);
                    if(notDrog){
                        alert(I18n.resource.admin.templateTooltip.DRAGE_INFO);//'目标文件夹是拖拽文件夹的子元素！'
                        return;
                    }
                    $curTreeNode.pId = $curItem.attr('id');
                    _this.treeObj.updateNode($curTreeNode);
                    params = {
                        _id: treeNodes[0].id,
                        group:$curItem.attr('id')
                    };
                    _this.treeObj.moveNode(targetItem,$curTreeNode,'inner');
                    $('#'+$curTreeNode.id).remove();
                }else if($current.hasClass('upGroup') || $current.closest('.upGroup').length > 0){
                    $curItem = $current.hasClass('upGroup')?$current:$current.closest('.upGroup');
                    if($curItem.attr('data-parent-group-id') === $curTreeNode.pId) return;
                    targetItem = _this.treeObj.getNodeByParam('id',$curItem.attr('data-groupid'));
                    notDrog = _this.isChildren(targetItem,$curTreeNode,notDrog);
                    if(notDrog){
                        alert(I18n.resource.admin.templateTooltip.DRAGE_INFO);
                        return;
                    }
                    $curTreeNode.pId = $curItem.attr('data-parent-group-id');
                    _this.treeObj.updateNode($curTreeNode);
                    params = {
                        _id: treeNodes[0].id,
                        group:$curItem.attr('data-parent-group-id')
                    };
                    _this.treeObj.moveNode(targetItem.getParentNode(),$curTreeNode,'inner');
                    $('#'+$curTreeNode.id).remove();
                }else if($current.attr('id') === 'tabContent'){
                    if($panelBody.find('.upGroup').length > 0){
                        var $upGroup = $panelBody.find('.upGroup');
                        if($upGroup.attr('data-groupid') === treeNodes[0].pId) return;
                        targetItem = _this.treeObj.getNodeByParam('id',$upGroup.attr('data-groupid'));
                        notDrog = _this.isChildren(targetItem,$curTreeNode,notDrog);
                        if(notDrog){
                            alert(I18n.resource.admin.templateTooltip.DRAGE_INFO);
                            return;
                        }
                        params = {
                            _id: treeNodes[0].id,
                            group:$upGroup.attr('data-groupid')
                        };
                    }else{
                        if(treeNodes[0].pId === '') return;
                        targetItem = null;
                        params = {
                            _id: treeNodes[0].id,
                            group:''
                        };
                    }
                    var data = {
                        _id: treeNodes[0].id,
                        name: treeNodes[0].name,
                        group:params.group,
                        creator : treeNodes[0].creator,
                        time: treeNodes[0].time,
                        type:treeNodes[0].type
                    };
                    var $item = $(_this.groupItemGroup.formatEL(data));
                    $panelBody.append($item);
                    _this.treeObj.moveNode(targetItem,$curTreeNode,'inner');
                }else if($current.closest('.ztree').length > 0){
                    if(!targetNode) return;
                    var pageGroupId = $panelBody.find('.upGroup').length > 0?$panelBody.find('.upGroup').attr('data-groupid'):'';
                    if(moveType === 'inner'){
                        params = {
                            _id: treeNodes[0].id,
                            group:targetNode.id
                        };
                        $('#'+treeNodes[0].id).remove();
                        if(pageGroupId === targetNode.id){
                            $panelBody.append($(_this.groupItemGroup.formatEL({
                                _id: treeNodes[0].id,
                                name: treeNodes[0].name,
                                group:params.group,
                                creator : treeNodes[0].creator,
                                time: treeNodes[0].time,
                                type:treeNodes[0].type
                            })))
                        }
                    }else{
                        params = {
                            _id: treeNodes[0].id,
                            group:targetNode.pId
                        };
                        $('#'+treeNodes[0].id).remove();
                        if(pageGroupId === targetNode.pId ){
                            $panelBody.append($(_this.groupItemGroup.formatEL({
                                _id: treeNodes[0].id,
                                name: treeNodes[0].name,
                                group:params.group,
                                creator : treeNodes[0].creator,
                                time: treeNodes[0].time,
                                type:treeNodes[0].type
                            })))
                        }
                    }
                }else{
                    return;
                }

                WebAPI.post('/factory/material/edit', params).done(function (result) {
                    //if(result.status === 'OK'){
                    //    treeNodes[0].pId = targetNode.id;
                    //    _this.treeObj.updateNode(treeNodes);
                    //}
                });
            }
            function zTreeOnNodeCreated (event, treeId, treeNode){
                //$('#'+ treeNode.tId).attr('draggable',true);
                $('#'+ treeNode.tId + '_switch').prependTo($('#'+ treeNode.tId + '_a'));
            }
            function zTreeBeforeExpand (treeId, treeNode){
                _this.treeObj.removeChildNodes(treeNode);
            }
            function zTreeOnExpand (event, treeId, treeNode){
                WebAPI.post('/factory/material/group/'+treeNode.type+'/'+treeNode.id,{userList:AppConfig.templateUserList}).done(function(result){
                    var newNodes = _this.generateTreeEx(result.data);
                    _this.treeObj.addNodes(treeNode, newNodes);
                })
            }
        };
        //获取树结构数据
        this.generateTreeEx = function (data) {
            var result = [];
            var params;
            for (var i = 0, len = data.length; i < len; i++) {
                var item = data[i];
                params = {id:item._id, pId:item.group, name:item.name, type: item.type, time:item.time, creator:item.creator};
                if (item.isFolder === 1) {
                    params.isParent = true;
                    result.push(params);
                }
            }
            return result;
        };
        //是否是子节点
        this.isChildren = function (targetNode,parentNode,notDrog){
            var _this = this;
            if(targetNode.getParentNode()){
                if(targetNode.getParentNode().id === parentNode.id){
                    notDrog = true;
                    return notDrog;
                }else{
                    return _this.isChildren(targetNode.getParentNode(),parentNode,notDrog);
                }
            }
        };
        //list更新
        this.getList = function (treeNode,arr){
            var _this = this;
            if(treeNode.getParentNode()){
                arr.unshift(treeNode.getParentNode().id);
                return _this.getList(treeNode.getParentNode(),arr);
            }else{
                return arr;
            }
        };
        // 渲染
        this.render = function () {
            this.renderTools();
            this.renderItems(this.store);
        };

        this.renderTools = function () {
            $('#tabName', this.domWrap).empty().append(this.tabOptions.toolsTpl);
        };

        // 渲染模板项
        this.renderItems = function (data) {
            var _this = this;
            var arrHtml = [];
            if(data){
                data.forEach(function (row) {
                    var rowData = _this.format2VO(row);
                    if(!rowData.isFolder){
                        rowData.isFolder = 0;
                    }
                    rowData['creator'] = rowData.creator?rowData.creator:I18n.resource.admin.templateTooltip.UNKNOWN;
                    if(rowData.isFolder === 0){
                        if(_this.screen.options.showTemplateType && _this.screen.options.showTemplateType.length > 0){
                            _this.screen.options.showTemplateType.forEach(function(row){
                                var rowDataType;
                                if(rowData.type.split('.')[1]){
                                    rowDataType = rowData.type.split('.')[1];
                                }else{
                                    if(rowData.type === 'page'){
                                        rowDataType = "PageScreen";
                                    }
                                }
                                if(rowDataType.toLowerCase() === row.toLowerCase()){
                                    arrHtml.push(_this.tabOptions.itemTpl.formatEL(rowData));
                                }
                            })
                        }else{
                            arrHtml.push(_this.tabOptions.itemTpl.formatEL(rowData));
                        }
                    }else{
                        arrHtml.push(_this.groupItemGroup.formatEL(rowData));
                    }
                });
            }
            this.container.innerHTML = arrHtml.join('');
            this.store = data;
            this.initTooltip();
        };
        this.showInfo = function(materialInfo,userName){
            var contentInfo = '';
            var contentTime = materialInfo.time ? materialInfo.time : I18n.resource.admin.templateTooltip.UNKNOWN;
            var contentName = materialInfo.name ? materialInfo.name : I18n.resource.admin.templateTooltip.UNKNOWN;
            var materialType =  materialInfo.type ? materialInfo.type : I18n.resource.admin.templateTooltip.UNKNOWN;
            var nameTime = '<div class="col-xs-4 item-nameF" i18n="admin.templateTooltip.CREATEROR">创建人:</div><div class="item-name col-xs-8" title="'+userName+'">' + userName + '</div>'+
                '<div class="col-xs-4 item-nameF" i18n="admin.templateTooltip.CREATE_TIME">创建时间:</div><div class="col-xs-8 item-name" title="'+contentTime+'">' + contentTime + '</div>';
            contentInfo += '<div class="col-xs-4 item-nameF" i18n="admin.templateTooltip.NAME">名称:</div><div class="col-xs-8 item-name" title="'+contentName+'">' + contentName + '</div>';
            if (materialType.indexOf('image')>=0) {
                var contentW = materialInfo.content ? materialInfo.content.w : 'xx';
                var contentH = materialInfo.content ? materialInfo.content.h : 'xx';
                var contentIterval = materialInfo.content ? materialInfo.content.interval : '';
                contentInfo += '<div class="col-xs-4 item-nameF" i18n="admin.templateTooltip.SIZE">大小:</div><div class="col-xs-8 item-name" title="'+contentW+'*'+contentH+'">' + contentW+'*'+contentH + '</div>';
                if(contentIterval&&parseInt(contentIterval)!==0){
                    var titleVal = I18n.resource.admin.templateTooltip.ONE_SECOND+(1000/parseInt(contentIterval)).toFixed(2)+I18n.resource.admin.templateTooltip.FRAME;
                    contentInfo += '<div class="col-xs-4 item-nameF" i18n="admin.templateTooltip.SPEED">速度:</div><div class="col-xs-8 item-name" title="'+titleVal+'">' + titleVal + '</div>';
                    contentInfo+=nameTime;
                    contentInfo+='<div class="col-xs-12 itemAnimation"><div class="displayAnamition"></div></div>';
                }else{
                    contentInfo+=nameTime;
                }
            } else if(materialType.indexOf('page')>=0) {
                var pageType = '';
                if(materialType==='page'||materialType==='page.PageScreen'){
                    pageType = 'PageScreen';
                }else if(materialType==='page.EnergyScreen'){
                    pageType = 'Dashboard';
                }else if(materialType==='page.ReportScreen'){
                    pageType = 'Report';
                }else{
                    pageType = I18n.resource.admin.templateTooltip.UNKNOWN;
                }
                contentInfo += '<div class="col-xs-4 item-nameF" i18n="admin.templateTooltip.TYPE">类型:</div><div class="col-xs-8 item-name" title="'+pageType+'">'+pageType+'</div>';
                contentInfo+=nameTime;
                contentInfo += '<div class="col-xs-12 item-previewImg"><div class="previewImg"></div></div>';
            }else if(materialType.indexOf('widget')>=0){
                var widgetType = '';
                if(materialType==='widget'||materialType==='widget.HtmlContainer'){
                    widgetType = 'Html Container';
                }else if(materialType==='widget.HtmlText'){
                    widgetType = 'Html Text';
                }else if(materialType==='widget.HtmlButton'){
                    widgetType = 'Html Button';
                }else{
                    widgetType = I18n.resource.admin.templateTooltip.UNKNOWN;
                }
                contentInfo += '<div class="col-xs-4 item-nameF" i18n="admin.templateTooltip.TYPE">类型:</div><div class="col-xs-8 item-name" title="'+widgetType+'">'+widgetType+'</div>';
                contentInfo+=nameTime;
                contentInfo += '<div class="col-xs-12 item-previewImg"><div class="previewImg"></div></div>';
            }else{
                contentInfo+=nameTime;
                contentInfo += '<div class="col-xs-12 item-previewImg"><div class="previewImg"></div></div>';
            }
            return contentInfo;
        };
        this.initTooltip = function(){
            var $tabContent = $('#tabContent', this.domWrap);
            var animation;
            var _this = this;
            $tabContent.find(".tpl-item:not('.group-item ')").each(function(){
                var $tplItemHover = $(this);
                if($tplItemHover.hasClass('upGroup')) return;
                var tooltipTemplate = '<div class="tooltip tplItemTooltip" role="tooltip">' +
                        '<div class="tooltip-arrow"></div>'+
                       // '<div class="tooltip-inner tooltipTitle">预览</div>' +
                        '<div class="tooltipContent clearfix">'+
                        '</div>' +
                        '</div>';
                var options = {
                    placement:'auto right',
                    title:I18n.resource.admin.templateTooltip.PREVIEW,
                    delay:{ show: 1500, hide: 0 },
                    template:tooltipTemplate
                };
                $tplItemHover.tooltip(options);
            });
            //$tabContent.off('mouseenter',".tpl-item:not('.group-item')").on('mouseenter',".tpl-item:not('.group-item')",function(){
            //    var $tplItemHover = $(this);
            //    if($tplItemHover.hasClass('upGroup')) return;
            //    $tplItemHover.tooltip('show');
            //});
            $tabContent.off('mouseleave',".tpl-item:not('.group-item')").on('mouseleave',".tpl-item:not('.group-item')",function(){
                 var $tplItemHover = $(this);
                 if($tplItemHover.hasClass('upGroup')) return;
                 //$tplItemHover.tooltip('hide');
                 var interval = Number($tplItemHover.find(".bgImg").attr("data_interval"));
                 if(interval!== 0){
                     $tabContent.find(".itemAnimation .displayAnamition").css("background-position","0");
                     clearInterval(animation);
                 }
                 $tabContent.find('.tooltipContent').html('');
            });
            $tabContent.find(".tpl-item:not('.group-item')").off('shown.bs.tooltip').on('shown.bs.tooltip',function() {
                var $tplItemHover = $(this);
                var target = $tabContent.find('.tooltipContent')[0];
                Spinner.spin(target);
                var id = $tplItemHover.attr('id');
                var creator = $tplItemHover.attr('data-creator') ? $tplItemHover.attr('data-creator') : $tplItemHover.find('.pageCreator span.pageText').html();
                var postData = {
                    userId: creator,
                    id: id
                };
                WebAPI.post('/factory/material/showInfo', postData).done(function (result) {
                    var tooltipContent = _this.showInfo(result.materialInfo,result.userName);
                    $tabContent.find('.tooltipContent').html('').append(tooltipContent);
                    I18n.fillArea($tabContent);
                    if($tplItemHover.hasClass('photoItem')){
                        var w = $tplItemHover.find(".bgImg").width();
                        var h = $tplItemHover.find(".bgImg").height();
                        var img = $tplItemHover.find(".bgImg").css('backgroundImage');
                        var interval = Number($tplItemHover.find(".bgImg").attr("data_interval"));
                        var pf = Number($tplItemHover.find(".bgImg").attr("data_pf"));
                        $tabContent.find(".itemAnimation .displayAnamition").width(w);
                        $tabContent.find(".itemAnimation .displayAnamition").height(h);
                        $tabContent.find(".itemAnimation .displayAnamition").css('backgroundImage',img);

                        if(interval!== 0){
                            animation = setInterval(autoplay,interval);
                            var i=0;
                            function autoplay(){
                                if(i===pf){
                                    i=-1;
                                }
                                i=i+1;
                                var position = -w*i;
                                if(position<-w*(pf-1)){
                                    autoplay()
                                }else{
                                    $tabContent.find(".itemAnimation .displayAnamition").css("background-position",position+"px");
                                }
                            }
                        }
                    }else{
                        loadImage(result.materialInfo);
                        function loadImage(result){
                            if(result.previewUrl){
                                var imgLoad = new window.Image();
                                imgLoad.src = 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/' +result.previewUrl;
                                //当图片成功加载到浏览器缓存
                                imgLoad.onload =function(e){
                                    if (typeof imgLoad.readyState == 'undefined') {
                                        imgLoad.readyState = 'undefined';
                                    }
                                    if ((imgLoad.readyState == 'complete' || imgLoad.readyState == 'loaded') || imgLoad.complete) {
                                        var url = 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/'+result.previewUrl;
                                        GUtil.loadImage(url,function(image){
                                            //图片加载回调函数
                                            loadResult({ 'id': result._id, 'src': image.src, 'msg': 'ok','pw': image.width})
                                        });
                                    } else {
                                        //imgLoad.onreadystatechange(e);ie8及以下版本会出现
                                    }
                                };
                                imgLoad.onerror = function (e) {
                                    loadResult({ 'id': result._id, 'msg': 'error' });
                                };
                            }else{
                                loadResult({ 'id': result._id, 'msg': 'error' });
                            }
                        }
                        function loadResult(data){
                            var currentObj = $tabContent.find('.previewImg')[0];
                            if (typeof (data.msg) != 'undefined') {
                                if (data.msg == 'ok') {
                                    if (currentObj) {
                                        $(currentObj).addClass('imgLoad');
                                        currentObj.style.backgroundImage = 'url('+data.src+'?'+new Date().getTime()+')';
                                        var boxW = $(currentObj).parent(".item-previewImg").width();//136px
                                        if(data.pw > boxW){
                                            currentObj.style.backgroundSize= 'contain';
                                        }
                                    }
                                } else {
                                    if (currentObj) {
                                        $(currentObj).addClass('noImg imgLoad');
                                        if(AppConfig.language === "zh"){
                                            currentObj.style.backgroundImage = 'url('+'static/app/WebFactory/themes/default/images/null.png'+')';
                                        }else{
                                            currentObj.style.backgroundImage = 'url('+'static/app/WebFactory/themes/default/images/enNull.png'+')';
                                        }
                                        currentObj.style.backgroundSize= 'contain';
                                    }
                                }
                                if (currentObj) {
                                    currentObj.style.backgroundRepeat= 'no-repeat';
                                    currentObj.style.height= '100%';
                                    currentObj.style.width= '100%';
                                    currentObj.style.backgroundPosition = 'center';
                                }
                            }
                        }
                    }
                    Spinner.stop();
                })
            });
        };
        this.commonEvents = function(){
            var _this = this;
            var $tabName = $('#tabName', this.domWrap);
            var $tabContent = $('#tabContent', this.domWrap);
            var $templateTabs = $('#templateTabs', this.domWrap);
            //_this.initTooltip();
            $tabName.find('.spanSearch').off().on('click',function(){
                if($(this).find('.glyphicon-search').css('display') != 'none'){
                    var searchVal = $(this).prev('input').val();
                    if(searchVal === ''){alert(' Please enter search keyword！');return;}
                    var data = {
                        name:searchVal,
                        userList:AppConfig.templateUserList
                    };
                    WebAPI.post('/factory/material/search',data).done(function(result){
                        _this.searchRenderItems(result.data);
                    }).always(function(){
                        $tabName.find('.addTempate').hide();
                        $tabName.find('.addGroup').hide();
                        $tabName.find('.spanSearch').find('.glyphicon-search').hide();
                        $tabName.find('.spanSearch').find('.glyphicon-remove').show();
                    })
                }else{
                    if(_this.search.list.length === 0){
                        $(_this.container).empty();
                        _this.renderItems(_this.search.store);
                    }else{
                        var upGroupData = {
                             _id: '...',
                            group: _this.search.list[_this.search.list.length-1],
                            parentGroupId: _this.search.list.length-2>0?_this.search.list[_this.search.list.length-2]:'',
                            type: $templateTabs.find('.divCheck').parent('.tab-item').attr('data-type').toLowerCase()
                        };
                        _this.downFolder({data:_this.search.store},upGroupData);
                    }
                    _this.search = {};
                    $tabName.find('.iptSearch').val('');
                    $tabName.find('.addTempate').show();
                    $tabName.find('.addGroup').show();
                    $tabName.find('.divEdit').hide();
                    $tabName.find('.divBatchApply').hide();
                    $tabName.find('.spanSearch').find('.glyphicon-search').show();
                    $tabName.find('.spanSearch').find('.glyphicon-remove').hide();
                }
            });
            $tabName.find('.iptSearch').off().on('keyup',function(e){
                if (e.which === 13) {
                    $tabName.find('.spanSearch').click();
                }
            });
            var start = null;
            $tabContent.off('click',".tpl-item:not('.upGroup ')").on('click',".tpl-item:not('.upGroup ')",function (e) {
                var e = e || window.event;
                e.stopPropagation();
                e.preventDefault();
                var $target = $(e.currentTarget);
                var allPageBox = $tabContent.children('.tpl-item');
                //var $currentPageBox = $target.parents('.tpl-item');
                if (e.ctrlKey) {//17
                    //ctrl键
                    if (!e.shiftKey) {
                        if ($target.hasClass('active')) {
                            $target.removeClass('active');
                        } else {
                            $target.addClass('active');
                        }
                        start = this;
                    } else {//ctrl+shift多选
                        var startIndex = $(start).index(), lastIndex = $target.index();
                        var selPageBox = allPageBox.slice(Math.min(startIndex, lastIndex), Math.max(startIndex, lastIndex) + 1);
                        //多选或反选
                        if ($(start).hasClass('active')) {
                            selPageBox.addClass('active');
                        } else {
                            selPageBox.removeClass('active');
                        }
                    }
                } else if (e.shiftKey) {//16
                    //shift键
                    if ($tabContent.find('.active').length !== 0) {
                        var startIndex = $(start).index(), lastIndex = $target.index();
                        var selPageBox = allPageBox.slice(Math.min(startIndex, lastIndex), Math.max(startIndex, lastIndex) + 1);
                        selPageBox.addClass('active');
                        allPageBox.not(selPageBox).removeClass('active');
                    } else {
                        $target.addClass('active');
                    }
                } else {
                    allPageBox.removeClass('active');
                    $target.addClass('active');
                    start = this;
                }
                _this.toolsTpl();
            });
            //删除页面
            $tabName.find('.divDelete').off('click').on('click',function () {
                var $active;
                var type = $templateTabs.find('.divCheck').parent('.tab-item').attr('data-type').toLowerCase();
                $active = $tabContent.find('.active');
                if ($active.length <= 0) {
                    alert('Please choose Template!');
                    return;
                }
                if(typeof _this.permission($active) === 'object'){
                    var pubMateId = _this.permission($active);
                    confirm('Sure to delete the template!',function(){
                        WebAPI.post('/factory/material/remove',pubMateId).done(function (result) {
                            if (result.status === 'OK') {
                                $active.remove();
                                if(type != 'report'){
                                    $tabName.find('.divEdit').hide();
                                    $tabName.find('.divDelete').hide();
                                    $tabName.find('.divBatchApply').hide();
                                }
                                var data = [];
                                pubMateId.ids.forEach(function(row){
                                    data.push(_this.treeObj.getNodeByParam('id',row));
                                });
                                data.forEach(function(row){
                                    _this.treeObj.removeNode(row);
                                });
                                alert('Deleted Successfully!');
                            }
                        });
                    })
                }else{
                    alert(_this.permission($active));
                }
            });
            //上传模板预览图
            $tabName.find('.uploadImg').off('click').on('click',function(){
                var data=$tabContent.find('.active');
                if(typeof _this.permission(data) === 'object'){
                    $tabName.find('.fileInput').click();
                }else{
                    alert(_this.permission(data));
                }
            });
            $tabName.find('.fileInput').off('change').on('change',function (e) {
                var imgCheck = e.target.files || e.dataTransfer.files;
                filterImg(imgCheck);
                //readImage(imgStandardArr);
                //筛选符合规则的图片
                function filterImg(files) {
                    if(files.length > 1){
                        alert('Can only upload a picture!');
                    }else{
                        var file = files[0];
                        if (!/(gif|jpg|png|jpeg)$/i.test(file.type)) {
                            alert('Image format should be gif, jpg, png or jpeg!');
                        } else {
                            if (file.size > 614400) {
                                alert('Picture is too large!');
                            }
                        }
                        //return file;
                        imgsLoadSuccess(file);
                    }
                }
                function imgsLoadSuccess(file){
                    var formData = new FormData();
                    var id = $tabContent.find('.active').attr('id');
                    formData.append('_id', id);
                    formData.append('name', '_P.' + file.type.substring(6));
                    //formData.append('creator', AppConfig.userId);
                    //formData.append('time', new Date().format('yyyy-MM-dd HH:mm:ss'));
                    //formData.append('content', JSON.stringify(imgInfo));
                    formData.append('image', file);
                    $.ajax({
                        type: 'POST',
                        url: '/factory/material/saveTemplateImage',
                        data: formData,
                        cache: false,
                        processData: false,  // 告诉jQuery不要去处理发送的数据
                        contentType: false,// 告诉jQuery不要去设置Content-Type请求头
                        success: function(result){
                            if(result.status === 'OK'){
                                alert('Image upload success!');
                            }else{
                                alert('Image upload failed!');
                            }
                        }
                    })
                }
            });
            //分享链接
            $tabName.find('.shareLink').off('click').click(function () {
                _this.shareLink();
            });
            //导入链接
            $tabName.find('.importLink').off('click').click(function () {
                _this.importLink();
            });
        };
        //权限管理
        this.permission = function (data){
            var pubMateId = { 'ids': [] };
            var userName = [];
            var _this = this;
            data.each(function(){
                pubMateId.ids.push($(this).attr('data-id'));
                for(var i = 0,len = _this.store.length;i<len;i++){
                    if(_this.store[i]._id === $(this).attr('data-id')){
                        if(!_this.store[i].creator){
                            _this.store[i].creator = 'admin';
                        }
                        if(userName.indexOf(_this.store[i].creator)<0){
                            userName.push(_this.store[i].creator);
                        }
                    }
                }
            });
            if(AppConfig.userProfile.fullname === 'admin'){
                return pubMateId;
            }else{
                if(userName.length > 0){
                    var noPermission = [];
                    userName.forEach(function(row){
                        if(!isNaN(parseInt(row))){
                            if(AppConfig.userId != row){
                                noPermission.push(row);
                            }
                        }else{
                            if(row.split('@').length > 1){
                                if(AppConfig.userProfile.email != row){
                                    noPermission.push(row);
                                }
                            }else{
                                if(AppConfig.userProfile.fullname != row){
                                    noPermission.push(row);
                                }
                            }
                        }
                    });
                    if(noPermission.length > 0 ){
                        return I18n.resource.admin.templateTooltip.TEMPLATE_IS_YOUR;
                    }else{
                        return pubMateId;
                    }
                }else{
                    return I18n.resource.admin.templateTooltip.ADMIN_CAN_OPERATION;
                }
            }
        };
        //搜索渲染
        this.searchRenderItems = function(data){
            var _this = this;
            if(data){
                var type = $('#templateTabs', this.domWrap).find('.divCheck').parent('.tab-item').attr('data-type');
                var searchData = [];
                data.forEach(function(row){
                    if(row.type && row.type.toLowerCase().indexOf(type.toLowerCase()) > -1){
                        row.group = '';
                        searchData.push(row);
                    }
                });
                _this.search.data =  searchData;
                _this.search.store = _this.store.slice();
                _this.search.list = _this.list.slice();
                _this.search.searchList = [];
                $(_this.container).empty();
                if(searchData.length>0){
                    _this.renderItems(_this.search.data);
                    _this.attachEvents();
                }
            }else{
                $(_this.container).empty();
            }
        };
        //拖拽事件
        this.drag = function () {
            var _this = this;
            var _start = function (e) {
                var ev = e || window.event;
                var $tabContent = $('#tabContent', _this.domWrap);
                var dataTransfer = ev.originalEvent.dataTransfer;
                var idArr = [],groupIdArr = [];
                if($tabContent.find('.active').length===1){
                    idArr.push(this.dataset.id);
                }else if($tabContent.find('.active').length>1){
                    $tabContent.find('.active').each(function(){
                        idArr.push(this.dataset.id);
                        //groupIdArr.push(this.dataset.groupid);
                    });
                }else{
                    idArr.push(this.dataset.id);
                    //groupIdArr.push(this.dataset.groupid);
                }
                dataTransfer.setData('id', idArr);
                //dataTransfer.setData('groupId', groupIdArr);
            };
            var _end = function (e) {
                $(this).parents().children().find('.tpl-item').removeClass('hove');
            };
            var _over = function (e) {
                var ev = e || window.event;
                ev.preventDefault();
            };
            var _enter = function (e) {
                $(this).addClass('hove');
                e.preventDefault();
            };
            var _drop = function (e) {
                var $this = $(this);
                $this.addClass('act');
                var ev = e || window.event;
                var dataTransfer = ev.originalEvent.dataTransfer;
                var idArr = dataTransfer.getData('id').split(',');
                var curTreeNode = _this.treeObj.getNodeByParam('id',$this.attr('id'));
                //var groupIdArr = dataTransfer.getData('groupId');
                var elTarget = [];
                for(var i = 0,len = idArr.length;i<len;i++){
                    if (this.dataset.id === idArr[i]) {
                        $this.removeClass('act');
                        return;
                    }
                    elTarget.push($('.tpl-item[data-id="' + idArr[i] + '"]', _this.container)[0]);
                }
                //var elTarget = $('.tpl-item[data-id="' + id + '"]', _this.container)[0];
                if (elTarget.length>0) {
                    var r = 0;
                    for(var j = 0,len = elTarget.length;j < len;j++ ){
                        var params = {};
                        params = {
                            _id: elTarget[j].dataset.id
                        };
                        if (this.dataset.id === '...') {
                            params['group'] = this.dataset.parentGroupId || '';
                        } else {
                            params['group'] = this.dataset.id || '';
                        }
                        WebAPI.post('/factory/material/edit', params).done(function () {
                            if($(elTarget[r]).hasClass('group-item')){
                                var treeNode = _this.treeObj.getNodeByParam('id',$(elTarget[r]).attr('id'));
                                if(treeNode){
                                    treeNode.pId = params.group;
                                    _this.treeObj.updateNode(treeNode);
                                    _this.treeObj.moveNode(curTreeNode,treeNode,'inner');
                                }
                            }
                            r++;
                            if(r === elTarget.length){
                                elTarget.forEach(function(row){
                                    $(row).remove();
                                })
                            }
                        });
                    }
                }
            };
            var _leave = function (e){
                $(this).removeClass('hove');
                e.preventDefault();
            };

            return {
                start: _start,
                end: _end,
                over: _over,
                enter: _enter,
                drop: _drop,
                leave:_leave
            }
        };
        //互拖事件
        this.drog = function () {
            var _this = this;
            var _over = function(e){
                e.preventDefault();
            };
            var _enter = function (e) {
                $(this).addClass('drog');
                e.preventDefault();
            };
            var _drop = function (e){
                var $this = $(this);
                $this.removeClass('drog');
                var ev = e || window.event;
                var dataTransfer = ev.originalEvent.dataTransfer;
                var idArr = dataTransfer.getData('id').split(',');
                var curTreeNode = _this.treeObj.getNodeByTId($this.parent().attr('id'));
                var r = 0;
                var notDrog;
                idArr.forEach(function(row){
                    if(row === curTreeNode.id) {
                        notDrog = true;
                    }else{
                        var item = _this.treeObj.getNodeByParam('id',row);
                        if(item){
                           notDrog = _this.isChildren(curTreeNode,item,notDrog);
                        }
                    }
                    if(notDrog) return;
                });
                if(notDrog){
                    alert('目标文件夹是拖拽文件夹的子元素！');
                    return;
                }
                idArr.forEach(function(row){
                    var params = {
                        _id:row,
                        group:curTreeNode.id
                    };
                    WebAPI.post('/factory/material/edit', params).done(function () {
                        r++;
                        var treeNode = _this.treeObj.getNodeByParam('id',row);
                        if(treeNode){
                            treeNode.pId = params.group;
                            _this.treeObj.updateNode(treeNode);
                            _this.treeObj.moveNode(curTreeNode,treeNode,'inner');
                        }
                        if(r === idArr.length){
                            idArr.forEach(function(item){
                                $('#'+item).remove();
                            });
                        }
                    });
                })
            };
            var _leave = function (e){
                $(this).removeClass('drog');
                e.preventDefault();
            };
            var _end = function(){};
            return {
                over: _over,
                enter: _enter,
                drop: _drop,
                leave:_leave,
                end:_end
            }
        };
        // 事件绑定
        this.attachEvents = function () {
            var $itemCtn = $('#tabContent', this.container);
            // 先清空已有事件
            $itemCtn.off();
        };
        //工具按钮的显示隐藏
        this.toolsTpl = function () {
            var $tabName = $('#tabName', this.domWrap);
            var $tabContent = $('#tabContent', this.domWrap);
            var $templateTabs = $('#templateTabs', this.domWrap);
            var type = $templateTabs.find('.divCheck').parent('.tab-item').attr('data-type');
            if($tabContent.find('.active').length === 0){
                $tabName.find('.divEdit').hide();
                $tabName.find('.uploadImg').hide();
                $tabName.find('.divBatchApply').hide();
                $tabName.find('.divDelete').hide();
                $tabName.find('.shareLink').hide();
            }else if($tabContent.find('.active').length === 1){
                if($tabContent.find('.active').hasClass('group-item')){
                    $tabName.find('.divEdit').hide();
                    $tabName.find('.uploadImg').hide();
                    $tabName.find('.divBatchApply').hide();
                    $tabName.find('.divDelete').show();
                    $tabName.find('.shareLink').hide();
                }else{
                    $tabName.find('.divEdit').show();
                    $tabName.find('.uploadImg').show();
                    $tabName.find('.divBatchApply').show();
                    $tabName.find('.divDelete').show();
                    $tabName.find('.shareLink').show();
                }
            }else{
                if(type === 'Image'){
                    $tabName.find('.divEdit').show();
                    $tabName.find('.divDelete').show();
                    $tabContent.find('.active').each(function(){
                        if($(this).hasClass('group-item')){
                            $tabName.find('.divEdit').hide();
                        }
                    })
                }else{
                    $tabName.find('.divEdit').hide();
                    $tabName.find('.uploadImg').hide();
                    $tabName.find('.divBatchApply').hide();
                    $tabName.find('.divDelete').show();
                }
                $tabContent.find('.active').each(function(){
                    if($(this).hasClass('group-item')){
                        $tabName.find('.shareLink').hide();
                    }
                })
            }
            //主界面下隐藏批量处理按钮
            if($('#materialModal').length<1){
                $tabName.find('.divBatchApply').hide();
            }
        };
        //分享链接
        this.shareLink = function(){
            var $shareModal = $("#shareModal");
            var $tabContent = $('#tabContent', this.domWrap);
            var $selectItems = $tabContent.find('.active');
            var arr = [];
            $selectItems.each(function(i){
                var linkContent = $(this).data("id") + "_" + $(this).data("type");
                arr.push(linkContent);
            })
            var tpl = arr.join(",");
            $shareModal.find("#linkArea").val(tpl);
            $("#btnLink").text("Copy Link");
            $shareModal.off('shown.bs.modal').on('shown.bs.modal',function(){
                $("#btnLink").off("click").on("click",function(){
                    document.getElementById("linkArea").select();
                    var copySuccessful = document.execCommand("copy",false,null);
                    if(copySuccessful){
                        alert("Copy successful!");
                        $shareModal.modal("hide");
                    }else{
                        alert("Copy fail!");
                    }
                })
            })
            $shareModal.modal("show");
        }
        //导入链接
        this.importLink = function(){
            var _this = this;
            var $shareModal = $("#shareModal");
            var $tabContent = $('#tabContent', this.domWrap);
            var $linkArea = $shareModal.find("#linkArea");
            $linkArea.val("");
            $("#btnLink").text("Import Link");
            $shareModal.off('shown.bs.modal').on('shown.bs.modal',function(){               
                $("#btnLink").off("click").on("click",function(){
                    var linkList = $linkArea.val();
                    var curGroupId = $tabContent.find(".upGroup").length === 0? "" : $tabContent.find(".upGroup").data("groupid");
                    var type = $('#templateTabs', this.domWrap).find('.divCheck').parent('.tab-item').attr('data-type').toLocaleLowerCase();
                    var arr = [];
                    var typeError = false;
                    linkList.split(",").some(function(row){
                        var items = row.split("_");
                        if(items[1] !== type){
                            typeError = true;
                            return true;
                        }else{
                            arr.push(items[0])
                        }
                    });
                    if(typeError){
                        alert("The imported link is not correct!");
                        return;
                    }
                    var postData = {
                        type:type,
                        creator:AppConfig.userId,
                        groupId:curGroupId,
                        linkList:arr
                    }
                    Spinner.spin($shareModal.find(".modal-content")[0]);
                    WebAPI.post('/factory/material/copy',postData).done(function(result){
                        if (result.status === 'OK'){
                            var data = result.data;
                            data.forEach(function(row){                                                               
                                _this.store.push(row);
                                _this.treeObj.addNodes(_this.treeObj.getNodeByParam('id',row.group),_this.generateTreeEx([row]),true);
                                if(type === "image"){
                                    _this.photoCell(row, 'tpl-item photoItem');
                                    _this.loadImage(row, _this.loadResult);
                                }else{
                                    $tabContent.append($(_this.tabOptions.itemTpl.formatEL(row)));
                                } 
                                _this.initTooltip();
                            })
                            $('#' + data[data.length-1]._id)[0].scrollIntoView(false);
                            $shareModal .modal("hide");
                        }else{
                            alert('Failed to generate file!')
                        }                        
                    }).always(function(){
                        Spinner.stop();
                    })
                })
            })
            $shareModal .modal("show");
        }

        // 隐藏 Tab
        this.hide = function () {
            // 没有数据就不缓存
            // if (this.store) {
            //     this.$domCache = $(this.container).children().detach();
            // }
            $(this.container).off('click dblclick','.tpl-item');
            this.container.innerHTML = '';
            this.treeObj = null;
            $(this.screen.leftCtn).find('.treeTemplate').empty();
        };

        // 关闭 Tab
        this.close = function () {
            if (this.$domCache) {
                this.$domCache.remove();
                this.$domCache = null;
            }
            this.store = null;
            this.search = null;
            this.list = null;
            this.treeObj = null;
            this.container.innerHTML = '';
        };

    }.call(Tab.prototype);

    exports.Tab = Tab;
} (
    namespace('factory.components.template.tabs')
));