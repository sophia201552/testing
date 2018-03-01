(function (exports) {

    function PagePanel(screen) {
        this.screen = screen;
        this.container = screen.pagePanelCtn;
        this.project = screen.project;

        this.treeView = null;
    }

    PagePanel.prototype.init = function () {
        this.treeView = new TreeView(this);
        this.treeView.show();
    };

    PagePanel.prototype.show = function () {};

    PagePanel.prototype.hide = function () {};

    PagePanel.prototype.save = function (data) {
        this.screen.syncWorker.save(data);
    };

    PagePanel.prototype.getPageList = function () {
        return this.treeView.getPageList();
    };

    PagePanel.prototype.onPageResize = function (width, height) {
        var page = this.screen.page;
        var painter = null;

        if (page) {
            painter = page.painter;
            painter.resizePage(width, height)
        }
    };

    PagePanel.prototype.close = function () {
        this.treeView.close();
        this.container.innerHTML = '';
    };

    exports.PagePanel = PagePanel;

} (window));

(function () {
    var _this;
    function TreeView(screen) {
        _this = this;
        this.screen = screen;
        this.container = screen.container;
        this.treeObj = undefined;
        //this.openPageId = undefined;
        this.projectId = screen.project.id;

        this.init();
    }
    TreeView.prototype.layerTools = [
        {id: 'delGroupPage', name: 'Delete', icon: 'glyphicon glyphicon-trash', iconType: 1},
        {id: 'importPageTemplet', name: 'import', icon: 'glyphicon glyphicon-import', iconType: 1},
        {id: 'exportPageTemplet', name: 'export', icon: 'glyphicon glyphicon-export', iconType: 1},
        // {id: 'lockPage', name: 'Lock', icon: 'glyphicon glyphicon-lock', iconType: 1},
        {id: 'editPage', name: 'Edit', icon: 'glyphicon glyphicon-edit', iconType: 1},
        {id: 'addPage', name: 'Add Page', icon: 'glyphicon glyphicon-file', iconType: 1},
        {id: 'addGroup', name: 'Add Group', icon: 'glyphicon glyphicon-folder-open', iconType: 1}
    ];

    TreeView.prototype.init = function () {
        this.container.innerHTML = '<ul id="treeControl" class="ztree gray-scrollbar"></ul>';
        this.$treeWrap = $('#treeControl',this.container);
    };

    TreeView.prototype.show = function () {
        this.ajaxRequestTree = WebAPI.get('/factory/getPageList/' + _this.projectId+'/1');
        this.ajaxRequestTree.done(function (result) {

            if (result && result.status !== 'OK') {
                alert(result.msg);
                return;
            }
            if (result && result.data) {
                var zSetting = {
                    view: {
                        showIcon:false,
                        showLine: false,
                        fontCss: {
                            color: "#ffffff"
                            //background: "#000000"
                        },
                        //addHoverDom: addHoverDom,
                        //removeHoverDom: removeHoverDom,
                        addDiyDom: addDiyDom
                    },
                    edit: {
                        enable: true,
                        editNameSelectAll: true,
                        showRenameBtn: true,
                        showRemoveBtn: false
                    },
                    data: {
                        keep:{
                            parent: true
                        },
                        simpleData: {
                            enable: true,
                            idKey: 'id',
                            pIdKey: 'pId',
                            rootPId: 0
                        }
                    },
                    callback: {
                        onClick: zTreeOnClick,
                        onDblClick: zTreeOnDblClick.bind(_this),
                        beforeDrop: zTreeBeforeDrop,
                        onDrop:  zTreeOnDrop,
                        onRename: zTreeOnRename,
                        onNodeCreated: zTreeOnNodeCreated
                    }
                };
                function zTreeOnNodeCreated(event, treeId, treeNode){
                    $('#'+ treeNode.tId + '_switch',_this.$treeWrap).prependTo($('#'+ treeNode.tId + '_a',_this.$treeWrap));
                    $("#" + treeNode.tId,_this.$treeWrap).addClass('tree-page-hover');
                    if(treeNode.type != 'DropDownList' && treeNode.iconSkin && treeNode.iconSkin !='') {
                        $("#" + treeNode.tId + "_switch",_this.$treeWrap).removeClass("button").addClass("glyphicon glyphicon-"+treeNode.iconSkin);
                    }else{
                         $("#" + treeNode.tId + "_a",_this.$treeWrap).addClass("isFloder");
                    }
                    if(treeNode.getIndex() === 0 && $("#" + treeNode.tId,_this.$treeWrap).next().children('span').length === 0){
                        var row = $("#" + treeNode.tId,_this.$treeWrap).next().children('a');
                        if(row.length > 0 ){
                            var icon = row.find('span').eq(1).attr('class').split(' ')[1].split('_')[0];
                                if(icon != 'ico' && row.find('span').eq(0).hasClass('button')){
                                row.find('span').eq(0).removeClass("button").addClass("glyphicon glyphicon-"+icon);
                            }
                        }
                    }
                }

                function zTreeOnClick(event, treeId, treeNode) {
                    var $liLayer = $("#" + treeNode.tId);
                    //如果按住Ctrl键,则多选,增加选中样式
                    if(event.ctrlKey){
                        if($liLayer.hasClass('curSelectedNode')){
                            $liLayer.removeClass('curSelectedNode');
                        }else {
                            $liLayer.addClass('curSelectedNode');
                        }
                    }else{
                        $liLayer.addClass('curSelectedNode');
                        $('#treeControl *').not($liLayer).removeClass('curSelectedNode');//去除选中的其他的所有的单机样式
                    }
                };

                function zTreeOnDblClick(event, treeId, treeNode) {
                    $('#declareVariablesModalWrap') && DeclareVariablesModal.hide();//切换页面时变量模板未关闭
                    if (!treeNode.isParent) {
                        if (treeNode && treeNode.id) {
                            var openedNodes = $('#treeControl').find('.curOpenedNode');
                            if (openedNodes) {
                                openedNodes.removeClass('curOpenedNode');
                            }

                            var curNode = $('#' + treeNode.tId);
                            curNode.removeClass('curSelectedNode');
                            curNode.addClass('curOpenedNode');
                            
                            // search layList
                            _this.screen.screen.showPage(treeNode);
                        }
                    }else{
                        //如果是文件夹 icon变化 todo
                        /*if(treeNode.type == "DropDownList"){
                            if(!$("#"+treeNode.tId+"_ico").hasClass("glyphicon-folder-open")){
                                $("#"+treeNode.tId+"_ico").removeClass("glyphicon glyphicon-folder-close").addClass("glyphicon glyphicon-folder-open");
                            }
                        }*/
                    }
                };
                function zTreeOnCollapse(event, treeId, treeNode) {//折叠后
                    $("#"+treeNode.tId+"_ico",_this.$treeWrap).addClass("glyphicon glyphicon-"+treeNode.iconSkin);
                };
                function zTreeOnExpand(event, treeId, treeNode) {//展开后
                    $("#"+treeNode.tId+"_ico",_this.$treeWrap).addClass("glyphicon glyphicon-"+treeNode.iconSkin);
                };
                //点击文件夹 会一闪而过 todo
                /*function zTreeBeforeCollapse(treeId, treeNode){//折叠之前
                    
                };
                function zTreeBeforeExpand(treeId, treeNode){//父节点展开之前
                    
                };*/
                function zTreeBeforeDrop(treeId, treeNodes, targetNode, moveType) {
                    if (!targetNode) { return false; }
                    // 不允许将页面或文件夹拖拽到目标节点上
                    if (!targetNode.isParent && 'inner' == moveType) {
                        return false;
                    }
                    // 对页面的移动不做任何处理
                    else if (treeNodes[0].type !== 'DropDownList') {
                        return true;
                    } else if ('inner' == moveType && targetNode.level >= 1) {//文件夹内子节点没有文件夹
                        alert(I18n.resource.mainPanel.layerPanel.DIRECTORY_STRUCTRUE);
                        return false;
                    } else if (['prev', 'next'].indexOf(moveType) > -1 && targetNode.level >= 2){//文件夹不能移动到文件夹内
                        alert(I18n.resource.mainPanel.layerPanel.DIRECTORY_STRUCTRUE);
                        return false;
                    } else {
                        return true;
                    }
                };
                function  zTreeOnDrop(event, treeId, treeNodes, targetNode, moveType) {
                    treeNodes.forEach(function(row){
                        $('#'+row.tId,_this.$treeWrap).addClass('curSelectedNode').find('#'+row.tId + '_a').removeClass('curSelectedNode');
                        if(row.type !='DropDownList' && row.iconSkin && row.iconSkin !=''){
                            $("#" + row.tId + "_switch",_this.$treeWrap).removeClass("button").addClass("glyphicon glyphicon-"+row.iconSkin);
                        }
                    });
                    var allNode = $(_this.container).find("#treeControl li a");
                    allNode.each(function() {
                        var row = $(this);
                        if(!row.hasClass('isFloder')){
                            var icon = row.find('span').eq(1).attr('class').split(' ')[1].split('_')[0];
                            if(icon != 'ico' && row.find('span').eq(0).hasClass('button')){
                                row.find('span').eq(0).removeClass("button").addClass("glyphicon glyphicon-"+icon);
                            }
                        }
                    });
                    if(moveType === 'inner'){
                        treeNodes.forEach(function(row){
                            var editData = {
                                id:row.id,
                                parent:targetNode.id
                            };
                            _this.operatePage('/factory/page/edit/',editData);
                        })
                    }else{
                        if(!targetNode) return;
                        treeNodes.forEach(function(row){
                            var editData = {
                                id:row.id,
                                parent:targetNode.getParentNode()?targetNode.getParentNode().id:''
                            };
                            _this.operatePage('/factory/page/edit/',editData);
                        })
                    }
                    _this.syncPageList();
                }

                function zTreeOnRename(event, treeId, treeNode, isCancel) {
                    var editData = {
                        id:treeNode.id,
                        text:treeNode.name
                    };
                    _this.operatePage('/factory/page/edit/',editData);
                }
                function addDiyDom(treeId, treeNode) {
                    var aObj = $("#" + treeNode.tId + "_switch");
                    var $divTreeCfg = $('<div class="treeCfg"></div>');
                    var $btnEye = $('<span class="nodeEye glyphicon"></span>');
                    var $btnLock = $('<span class="iconfont"></span>');
                    if (treeNode.isHide) {
                        $btnEye.addClass('glyphicon-eye-close');
                    } else {
                        $btnEye.addClass('glyphicon-eye-open');
                    }
                    //是否锁定
                    if(treeNode.isLock == 1){
                        $btnLock.html("&#xe670;").show();
                    }else{
                        $btnLock.html("&#xe68c;").show();
                    }
                    $divTreeCfg.append($btnEye);
                    $divTreeCfg.append($btnLock);
                    aObj.next('a').after($divTreeCfg);

                    $btnEye[0].onclick = function(){
                        _this.switchEyeState($(this));
                        var curTreeNode = _this.treeObj.getNodeByTId($(this).closest('li').attr('id'));
                        var editData = {
                            id:curTreeNode.id,
                            isHide:curTreeNode.isHide
                        };
                        _this.operatePage('/factory/page/edit/',editData);
                    };
                    $btnLock[0].onclick = function(){
                        _this.switchLockState($(this));
                        var curTreeNode = _this.treeObj.getNodeByTId($(this).closest('li').attr('id'));
                        var editData = {
                            id:curTreeNode.id,
                            isLock:curTreeNode.isLock
                        };
                        _this.operatePage('/factory/page/edit/',editData);
                    };
                };
                var zProjNodes = _this.generateTreeEx(result.data);

                (function () {
                    _this.treeObj = $.fn.zTree.init($('#treeControl'), zSetting, zProjNodes);
 
                    var strHtml = '', $ul = $('<ul class="list-inline treeToolWrap"></ul>');
                    for(var i = 0, tool; i < _this.layerTools.length; i++){
                        tool = _this.layerTools[i];
                        if(tool.iconType == 1) {
                            strHtml += ('<li id="'+ tool.id +'"><span '+ (tool.display ? 'style="display: '+tool.display+';"' : '') +'" class="'+ tool.icon +'" title="' + tool.name + '"></span></li>');
                        }
                    }
                    $ul.html(strHtml);
                    $(_this.screen.container).append($ul);

                    //国际化
                    $('#addGroup',_this.$treeWrap).attr('title', I18n.resource.mainPanel.layerPanel.ADD_GROUP);
                    $('#addPage',_this.$treeWrap).attr('title', I18n.resource.mainPanel.layerPanel.ADD_PAGE);
                    $('#delGroupPage',_this.$treeWrap).attr('title', I18n.resource.mainPanel.layerPanel.DELETE_PAGE);
                    // $('#lockPage').attr('title', I18n.resource.mainPanel.layerPanel.LOCK_PAGE);
                    $('#importPageTemplet',_this.$treeWrap).attr('title', I18n.resource.mainPanel.layerPanel.IMPORT_PAGE_TEMPLET);
                    $('#exportPageTemplet',_this.$treeWrap).attr('title', I18n.resource.mainPanel.layerPanel.EXPORT_PAGE_TEMPLET);
                    $('#editPage',_this.$treeWrap).attr('title', I18n.resource.mainPanel.layerPanel.EDIT_PAGE);

                    //event
                    $('#addGroup')[0].onclick = _this.funcAddGroup;
                    $('#addPage')[0].onclick = _this.funcAddPage;
                    $('#delGroupPage')[0].onclick = _this.funcDelGroupPage;
                    // $('#lockPage')[0].onclick = _this.funcLockPage;
                    $('#importPageTemplet')[0].onclick = _this.importTemplate;
                    $('#exportPageTemplet')[0].onclick = _this.exportTemplate;
                    $('#editPage')[0].onclick = _this.funcEditPage;
                } ());
            }
            }).always(function (e) {
                Spinner.stop();// Spinner.spin()在FactoryScreen.prototype.show处开始
            });
    };

    // 从一个 tree node 中提取出属于 page 的对象
    TreeView.prototype.getPurePageDataFromTreeNode = function (treeNode) {
        var parentTreeNode = this.treeObj.getNodeByTId(treeNode.parentTId);

        return {
            _id: treeNode.id,
            text: treeNode.name,
            type: treeNode.type,
            pic: treeNode.iconSkin,
            parent: parentTreeNode === null ? '' : parentTreeNode.id,
            layerList: treeNode.layerList,
            projId: treeNode.projId,
            isHide: treeNode.isHide,
            isLock: treeNode.isLock,
            width: treeNode.width,
            height: treeNode.height,
            display: treeNode.display,
            option: treeNode.option
        };
    };

    TreeView.prototype.remove = function () {

    };

    TreeView.prototype.generateTreeEx = function (arr) {
        var result = [];
        var params;
        for (var i = 0, len = arr.length; i < len; i++) {
            var item = arr[i];
            params = {projId:item.projId, id:item._id, pId:item.parent, name:item.text +' - '+ item.type, type: item.type};
            if ('DropDownList' == item.type) {
                params = {projId:item.projId, id:item._id, pId:item.parent, name:item.text, type: item.type, iconSkin: item.pic};
                params.isParent = true;
                params.isHide = item.isHide;
                params.isLock = item.isLock;
                result.push(params);
            }
            else if ('PageScreen' == item.type) {
                params.isParent = false;
                params.isHide = item.isHide;
                params.isLock =item.isLock;
                params.width = item.width;
                params.height = item.height;
                params.display = item.display;
                params.iconSkin = item.pic;
                params.option = item.option;
                result.push(params);
            }
            else if(item.type === 'ReportScreen') {
                params.isParent = false;
                params.isHide = item.isHide;
                params.isLock =item.isLock;
                params.reportType = item.reportType;
                params.reportFolder = item.reportFolder;
                params.iconSkin = item.pic;
                result.push(params);
            }
            else {
                params.isParent = false;
                params.isHide = item.isHide;
                params.isLock =item.isLock;
                params.iconSkin = item.pic;
                result.push(params);
            }
        }
        return result;
    };

    TreeView.prototype.generateTree = function (arr) {
        arr.sort(function (a, b) {
            return parseInt(a._id, 16) > parseInt(b._id, 16);
        });

        var dataTree = [];
        for (var i = 0, lenI = arr.length; i < lenI; i++) {
            if ('DropDownList' == arr[i].type && !arr[i].parent) {
                dataTree.push({'id': arr[i]._id, 'name': arr[i].text, 'isParent': true, 'children': []});
            }
        }
        for (var i = 0, lenI = arr.length; i < lenI; i++) {
            if ('DropDownList' == arr[i].type && arr[i].parent) {
                for (var j = 0, lenJ = dataTree.length; j < lenJ; j++) {
                    this.setNode(arr[i], dataTree[j]);
                }
            }
        }
        for (var i = 0, lenI = arr.length; i < lenI; i++) {
            if ('DropDownList' != arr[i].type) {
                if (!arr[i].parent) {
                    dataTree.push({'id': arr[i]._id, 'name': arr[i].text, 'isParent': false});
                }
                else {
                    for (var j = 0, lenJ = dataTree.length; j < lenJ; j++) {
                        this.setLeaf(arr[i], dataTree[j]);
                    }
                }
            }
        }
        return dataTree;
    };

    TreeView.prototype.setNode = function (node, tree) {
        if (node.parent == tree.id && tree.isParent) {
            tree.children.push({'id': node._id, 'name': node.text, 'isParent': true, 'children': []});
            return;
        }
        else {
            for (var i = 0, len = tree.children.length; i < len; i++) {
                this.setNode(node, tree.children[i]);
            }
        }
    };

    TreeView.prototype.setLeaf = function (node, tree) {
        if (tree.children) {
            if (node.parent == tree.id && tree.isParent) {
                tree.children.push({'id': node._id, 'name': node.text, 'isParent': false});
                return;
            }
            else {
                for (var i = 0, len = tree.children.length; i < len; i++) {
                    this.setLeaf(node, tree.children[i]);
                }
            }
        }
    };

    TreeView.prototype.switchLockState = function ($lock) {
        var treeNodeId = $lock.parent().parent().attr('id');
        var model = this.getModelByTreeNode(treeNodeId);
        var html,isLock;
        if(model.isLock == 0){
            isLock = 1;
            html = "&#xe670;";
        }else{
            isLock = 0;
            html = "&#xe68c;";
        }
         /*if(treeNode.isLock == 1){
            $btnLock.html("&#xe670;").show();
        }else{
            $btnLock.html("&#xe68c;").show();
        }*/
        //treeNode的所有子节点
        traverse(model);
        function traverse(model){
            var childNodes = model.children;
            if(!model) return;
            model.isLock = isLock;
            $("#" + model.tId,_this.$treeWrap).find('.iconfont:eq(0)').html(html).show();
            childNodes && childNodes.forEach(function(child){
                child && traverse(child);
            });
        }
    };

    TreeView.prototype.switchEyeState = function ($eye) {
        var treeNodeId = $eye.parent().parent().attr('id');
        var model = this.getModelByTreeNode(treeNodeId);
        var className;
        var isHide;
        if($eye.hasClass('glyphicon-eye-open')){
            isHide = 1;
            className = 'glyphicon glyphicon-eye-close';
        }else{
            isHide = 0;
            className = 'glyphicon glyphicon-eye-open';
        }
        //treeNode的所有子节点
        traverse(model);
        function traverse(model){
            var childNodes = model.children;
            if(!model) return;
            // model.isHide && model.isHide(isHide);
            model.isHide = isHide;
            $("#" + model.tId,_this.$treeWrap).find('.treeCfg').find('.glyphicon:eq(0)').removeClass().addClass(className);
            childNodes && childNodes.forEach(function(child){
                child && traverse(child);
            });
        }
    };

    TreeView.prototype.getModelByTreeNode = function (treeNodeId) {
        return this.treeObj.getNodeByTId(treeNodeId);
    };
    TreeView.prototype.operatePage = function (url,data) {
        return WebAPI.post(url + this.projectId, data).done(function(rs){
            if (rs.status === 'OK'){
                Log.info('sync data success!');
            }
        })
    };

    TreeView.prototype.funcAddGroup = function () {
        if (_this.treeObj) {
            var parentId = null,grandfatherId = null;
            var parentNode = null,grandfatherNode = null;
            var projectId = null,pId = '';
            var index = 0;
            var selectNodes = _this.treeObj.getSelectedNodes();
            if (selectNodes.length > 0) {
                parentId = selectNodes[0].parentTId;
                projectId = selectNodes[0].projId;
                pId = selectNodes[0].pId;
                parentNode = _this.treeObj.getNodeByTId(parentId);
                if(parentNode){
                    grandfatherId = parentNode.parentTId;
                    grandfatherNode = _this.treeObj.getNodeByTId(grandfatherId);
                }
                index = selectNodes[0].getIndex();
            };
            if(grandfatherNode){
                  alert('目录下只支持三级结构！');
            }else{
                var newId = ObjectId();
                var newNode = {projId:_this.projectId , id:newId, pId:parentId, name:'new node', 'isParent':true, 'open':true, type: 'DropDownList', 'isHide': 0, 'isLock': 0, iconSkin: ""};
                var pageData = {id:newId,'isHide': 0, 'isLock': 0,parent:pId,pic:"",projId:_this.projectId,text:'new node',type: 'DropDownList'};
                var ret = _this.treeObj.addNodes(parentNode, index, newNode);

                _this.treeObj.editName(ret[0]);
                var pageList = _this.treeObj.transformToArray(_this.treeObj.getNodes()).map(function (row) {
                    return row.id;
                });
                var saveData = {
                    page:pageData,
                    list:pageList
                };
                _this.operatePage('/factory/page/save/',saveData);
            }
            //_this.syncPageList();
        }
    };

    TreeView.prototype.funcAddPage = function () {
        $(".modal-title").attr("i18n","mainPanel.pageEditModal.ADD_PAGE_TITLE");
        PageEditModal.show({projId:"", name:I18n.resource.mainPanel.pageEditModal.PAGE_NAME, type:'PageScreen', width:1920, height:980,disabled:0,display:0,iconSkin:'',option:{background:{color:'',type:'',url:'',display:''}}}, _this.callbackAddPage);
    };

    TreeView.prototype.callbackAddPage = function (pageCfg) {
        if (_this.treeObj) {
            var parentId = null;
            var parentNode = null;
            var index = 0;
            var selectNodes = _this.treeObj.getSelectedNodes();
            var newNode = {id: pageCfg.id || ObjectId(), pId:null, projId:pageCfg.projId, name:pageCfg.name, isParent:false, isHide:0, isLock:0, type: pageCfg.type, iconSkin:pageCfg.iconSkin, pic:pageCfg.iconSkin};
            if (selectNodes.length > 0) {
                parentId = selectNodes[0].parentTId;
                parentNode = _this.treeObj.getNodeByTId(parentId);
                index = selectNodes[0].getIndex();
            }
            var Data = {id:newNode.id,projId:newNode.projId,text:newNode.name,isHide:0,isLock:0,parent:parentNode?parentNode.id:'',type:newNode.type,pic:newNode.iconSkin};
            var ret,pageData;

            switch (pageCfg.type) {
                case 'PageScreen':
                    newNode = $.extend(false, newNode, {width: pageCfg.width, height: pageCfg.height, display:pageCfg.display, option:pageCfg.option});
                    pageData = $.extend(false,Data,{width: pageCfg.width, height: pageCfg.height, display:pageCfg.display, option:pageCfg.option});
                    break;
                case 'FacReportScreen':
                    newNode.isHide = 1;
                    pageData = $.extend(false,Data,{isHide:1});
                    break;
                case 'ReportScreen':
                    newNode.reportType = pageCfg.reportType;
                    newNode.reportFolder = pageCfg.reportFolder;
                    pageData = $.extend(false,Data,{reportType:pageCfg.reportType,reportFolder:pageCfg.reportFolder});
                    break;
                default:
                    pageData = Data;
                    break;
            }

            ret = _this.treeObj.addNodes(parentNode, index, newNode);
            var pageList = _this.treeObj.transformToArray(_this.treeObj.getNodes()).map(function (row) {
                return row.id;
            });
            var saveDate = {
                page:pageData,
                list:pageList
            };
            _this.operatePage('/factory/page/save/',saveDate).done(function () {
                // 显示类型更新
                if(pageCfg.type === "DropDownList"){
                    $('#'+ret[0].tId+'_span',_this.$treeWrap).text(pageCfg.name);
                }
                $('#'+ret[0].tId+'_span',_this.$treeWrap).text(pageCfg.name + ' - ' + pageCfg.type);
                //同步pageList
                //_this.syncPageList();
                //新建页面，默认进入页面
                $('#'+ret[0].tId+'_a',_this.$treeWrap).dblclick();
            });
        }
    };

    TreeView.prototype.callbackAddPageBatch = function (arrPageCfg,isCopy) {
        var _this = this;
        var arrLayer = [];
        var arrWidget = [];
        var arrPage = [];

        arrPageCfg.forEach(function(pageCfg){
            pageCfg.page.projId = _this.projectId;
            pageCfg.page.type = 'PageScreen';

            arrPage.push(pageCfg.page);
            arrLayer = arrLayer.concat(pageCfg.layers);
            arrWidget = arrWidget.concat(pageCfg.widgets);
            renderPage(pageCfg);
        });
         //同步pageList
        _this.syncPageList();
        // 保存
        this.screen.save({
            pages: arrPage,
            layers: arrLayer,
            widgets: arrWidget
        });
        infoBox.alert(I18n.resource.admin.welcom.addByTpl.PAGESCREEN_ADD_SUCCESS, { delay: 1500 });

        function renderPage(pageCfg){
            if (_this.treeObj) {
                var parentNode = null;
                var index = 0;
                var selectNodes = _this.treeObj.getSelectedNodes();
                var ret;
                var newNode = {
                    projId: pageCfg.page.projId,
                    id: pageCfg.page._id,
                    pId: null,
                    name:pageCfg.page.text,
                    isParent:false,
                    isHide:pageCfg.page.isHide,
                    isLock:pageCfg.page.isLock,
                    iconSkin:pageCfg.page.pic,
                    type: pageCfg.page.type,
                    width: pageCfg.page.width,
                    height: pageCfg.page.height,
                    display:pageCfg.page.display,
                    option:pageCfg.page.option,
                    parent: pageCfg.page.parent
                };

                if (selectNodes.length === 1) {
                    if (selectNodes[0].isParent) {
                        parentNode = selectNodes[0];
                        newNode.pId = parentNode.id;
                        index = -1;
                        pageCfg.page.parent = parentNode.id;
                    } else {
                        parentNode = _this.treeObj.getNodeByTId(selectNodes[0].parentTId);
                        index = selectNodes[0].getIndex();
                        pageCfg.page.parent = !parentNode ? '' : parentNode.id;
                    }
                }

                ret = _this.treeObj.addNodes(parentNode, index, newNode);
                // 显示类型更新
                $('#'+ret[0].tId+'_span',_this.$treeWrap).text(pageCfg.page.text + ' - PageScreen');
            }
        }
    };

    TreeView.prototype.funcDelGroupPage = (function () {
        return function () {
            if (_this.treeObj) {
                var selectNodes = _this.treeObj.getSelectedNodes();
                if (selectNodes.length < 1) {
                    return;
                }

                var show = '';
                for (var i = 0, len = selectNodes.length; i < len; i++) {
                    show += selectNodes[i].name + '\n';
                }
                show += 'Be sure to delete ?';
                //TODO 测试confirm
                confirm(show, function () {
                    var data = {
                        removeNodesIds:[],
                        removePageNodesIds:[]
                    };
                    var newData = getChildrenId(selectNodes,data);
                    //for (var i = 0, len = selectNodes.length; i < len; i++) {
                    //    // 判断 selectNodes[i] 是不是文件夹，如果是，拿到它的所有非文件夹的直接子元素；
                    //    // 如果不是，直接进行删除操作
                    //    if (selectNodes[i].isParent && selectNodes[i].children) {
                    //        // 是文件夹
                    //        removeNodesIds.push(selectNodes[i].id);
                    //        selectNodes[i].children.forEach(function (child) {
                    //            if (!child.isParent) {
                    //                removePageNodesIds.push(child.id);
                    //                removeNodesIds.push(child.id);
                    //            }
                    //        });
                    //    }
                    //    // 不是文件夹
                    //    else {
                    //        removePageNodesIds.push(selectNodes[i].id);
                    //    }
                    //    _this.treeObj.removeNode(selectNodes[i], true);
                    //}

                    if (_this.screen.screen.page) {
                        if (newData.removePageNodesIds.indexOf(_this.screen.screen.page.page.id) > -1 ) {
                            _this.screen.screen.page.close();
                            // 将 factoryScreen 的 page 引用置空
                            _this.screen.screen.page = null;
                        }
                    }
                    var arr = [];
                    selectNodes.forEach(function(row){
                        arr.push(row.id)
                    });
                    var pageList = _this.treeObj.transformToArray(_this.treeObj.getNodes()).map(function (row) {
                        return row.id;
                    });
                    var delData = {
                        page:arr,
                        list:pageList
                    };
                    _this.operatePage('/factory/page/delete/',delData);
                    //_this.syncPageList();
                });
            }
        };
        function getChildrenId(item,data){
            if(item){
                item.forEach(function(row) {
                    _this.treeObj.removeNode(row, true);
                    if (!row.isParent){
                        data.removePageNodesIds.push(row.id);
                        data.removeNodesIds.push(row.id);
                    }else{
                        data.removeNodesIds.push(row.id);
                        return getChildrenId(row.children,data);
                    }
                });
                return data;
            }
        }
    })();

    /*TreeView.prototype.funcLockPage = function () {
        if (_this.treeObj) {
            var selectNodes = _this.treeObj.getSelectedNodes();
            if (selectNodes.length > 0) {
                selectNodes.forEach(function(item) {
                    _this.switchLockState($('#' + item.tId).find('.nodeLock'));
                });
            }
            _this.screen.syncPage();
        }
    };*/

    TreeView.prototype.importTemplate = function () {
        var selected = _this.treeObj.getSelectedNodes();

        MaterialModal.show([{'title':'Template',data:['Page.PageScreen','Page.EnergyScreen','Page.EnergyScreen_M']}], function (data,isCopy) {
            var params;
            if (data.length) {
                _this.callbackAddPageBatch(data, isCopy);
            } else {
                if(data.type.indexOf('ReportScreen') > -1){
                    alert('不支持单个报表导入成页面！');
                    return;
                }
                params = {
                    id: ObjectId(),
                    name: 'Untitled',
                    type: data.type.split('.')[1]
                };
                // EnergyScreen 的保存逻辑
                WebAPI.post('/spring/saveLayout', {
                    creatorId: AppConfig.userId,
                    menuItemId: params.id,
                    isFactory: 1,
                    layout: JSON.parse(data.content.template)
                }).done(function (result) {
                    _this.callbackAddPage(params);
                });
            }
        });
    };

    TreeView.prototype.exportTemplate = function () {
        var selectNodes = _this.treeObj.getSelectedNodes(), node;
        var templateName, data;
        var page;

        if (selectNodes.length !== 1) {
            alert(I18n.resource.mainPanel.layerPanel.EXPORT_PAGE_TEMPLET_INFO);
            return;
        }
        templateName = prompt(I18n.resource.mainPanel.layerPanel.WRITE_TEMPLET_NAME);
        if(!templateName) return;

        node = selectNodes[0];
        data = {
            _id: ObjectId(),
            pageId: node.id,
            name: templateName,
            creator: AppConfig.userProfile.fullname,
            time: new Date().format('yyyy-MM-dd HH:mm:ss'),
            'public': 1,
            isFolder:0,
            group: '',
            content: {}
        };

        if (node.type === 'PageScreen') {
            data.type = 'page.PageScreen';
            data.content = {
                width: node.width,
                height: node.height,
                display: node.display,
                iconSkin: node.iconSkin,
                option: node.option.background?node.option:{background:{}}
            };
            WebAPI.get('factory/getPageDetail/'+ node.id + '/' +AppConfig.isFactory).done(function(result){
                data.content.template = JSON.stringify({
                    list: result.page.layerList,
                    layers: result.data.layers,
                    widgets: result.data.widgets
                });
                _this.savePageTemplateData(data);
            });
        } else if (node.type === 'EnergyScreen' || node.type === 'EnergyScreen_M') {
            data.type = 'page.' + node.type;
            WebAPI.get("/spring/get/" + node.id  + '/' + AppConfig.isFactory).done(function(result){
                data.content.template = JSON.stringify( result.layout );
                _this.savePageTemplateData(data);
            });
        }else if(node.type === 'FacReportWrapScreen'){
            alert('不支持此类型的页面导出！');
            return;
        }else if(node.type === 'FacReportScreen'){
            data.type = 'page.ReportScreen';
            WebAPI.get("/spring/get/" + node.id  + '/' + AppConfig.isFactory).done(function(result){
                data.content.template = JSON.stringify({
                    layout: result.layout[0][0]
                });
                _this.savePageTemplateData(data);
            });
        }
    };
    TreeView.prototype.savePageTemplateData = function (data) {
        WebAPI.post('/factory/material/save', data
            ).done(function(result){
                if(result && result._id){
                    data._id = result._id;
                }
            }).always(function(){});
    };

    TreeView.prototype.funcEditPage = function () {
         $(".modal-title").attr("i18n","mainPanel.pageEditModal.EDIT_PAGE_TITLE");
        var selectNodes = _this.treeObj.getSelectedNodes();
        if (selectNodes && selectNodes.length === 1) {
             /*if(selectNodes[0].type == 'DropDownList'){
                 var $spanLayer = $("#" + selectNodes[0].tId+ "_a");//重命名的对象
                 $spanLayer.children('span.edit').click();//触发ztree控件的一个按钮重命名点击事件
             }else {*/
                 if(!selectNodes[0].display) {
                     selectNodes[0].display = 0;
                 }
                 var src = {projId:selectNodes[0].projId, name:selectNodes[0].name, type:selectNodes[0].type, width:selectNodes[0].width, height:selectNodes[0].height, disabled:1, display:selectNodes[0].display,reportType:selectNodes[0].reportType,reportFolder:selectNodes[0].reportFolder,iconSkin:selectNodes[0].iconSkin, option:selectNodes[0].option};
                 PageEditModal.show(src, _this.callbackEditPage);
             // }
        }else {
            alert(I18n.resource.mainPanel.layerPanel.SELECT_WORD_INFO)
        }
    };

    TreeView.prototype.callbackEditPage = function (pageCfg) {
        var selectNodes = _this.treeObj.getSelectedNodes();
        var editData = {
            id:selectNodes[0].id
        };
        if (selectNodes && selectNodes.length > 0) {
            editData.projId = selectNodes[0].projId = pageCfg.projId;
            editData.text =selectNodes[0].name = pageCfg.name;
            selectNodes[0].type = pageCfg.type;
            if(pageCfg.type === 'PageScreen'){
                editData.width = selectNodes[0].width = pageCfg.width;
                editData.height = selectNodes[0].height = pageCfg.height;
                editData.display = selectNodes[0].display = pageCfg.display;
                editData.option = selectNodes[0].option = pageCfg.option;
            }
            else if(pageCfg.type === 'ReportScreen'){
                editData.reportType = selectNodes[0].reportType = pageCfg.reportType;
                editData.reportFolder = selectNodes[0].reportFolder = pageCfg.reportFolder;
            }
            if(pageCfg.iconSkin == "" || typeof(pageCfg.iconSkin) === "undefined"){
                editData.pic = selectNodes[0].pic = selectNodes[0].iconSkin;
            }else{
                editData.pic = selectNodes[0].pic = pageCfg.iconSkin;
                selectNodes[0].iconSkin = pageCfg.iconSkin;
            }
            _this.treeObj.updateNode(selectNodes[0]);
            _this.operatePage('/factory/page/edit/',editData);

            // 显示类型更新
            if(pageCfg.type === "DropDownList"){
                $('#'+selectNodes[0].tId+'_span').text(pageCfg.name);
            }else{
                $('#'+selectNodes[0].tId+'_span').text(pageCfg.name + ' - ' + pageCfg.type);
            }
            if(selectNodes[0].type != 'DropDownList' && selectNodes[0].iconSkin && selectNodes[0].iconSkin !=''){
                $('#'+selectNodes[0].tId+'_switch').removeClass("button").addClass("glyphicon glyphicon-"+selectNodes[0].iconSkin);
            }
            if(!_this.screen.screen.page || selectNodes[0].id === _this.screen.screen.page.page.id){
                $("#innerBg").css("background","");
                if(typeof(selectNodes[0].option) === "undefined"){
                    $("#innerBg").css({
                            'background':'#e1e3e5'
                        })
                }else if(selectNodes[0].option.background.type == "image"){
                    if(selectNodes[0].option.background.display == "tile"){
                        $("#innerBg").css({
                            'background-image':'url('+selectNodes[0].option.background.url+')',
                            "background-repeat":"repeat",
                            "background-size":"contain"
                        })
                    }else{
                        $("#innerBg").css({
                            'background-image':'url('+selectNodes[0].option.background.url+')',
                            "background-repeat":"no-repeat",
                            "background-size":"100% 100%"
                        })
                    }
                }else if(selectNodes[0].option.background.type == "color"){
                    $("#innerBg").css("background-color",selectNodes[0].option.background.color);
                }
                // 更新页面大小
                if (pageCfg.type === 'PageScreen') {
                    _this.screen.onPageResize(pageCfg.width, pageCfg.height);
                }
            }
        }
    };

    TreeView.prototype.getPageList = function () {
        if (!this.treeObj) return [];

        return this.treeObj.transformToArray(this.treeObj.getNodes()).map(function (row) {
            return {
                _id: row.id,
                text: row.name,
                type: row.type
            };
        })
    };

    TreeView.prototype.syncPageList = function() {
        var pageList = [];
        var nodeArr = []; 

        if (!this.treeObj) return;

        pageList = this.treeObj.transformToArray(this.treeObj.getNodes()).map(function (row) {
            return row.id;
        });

        // 保存页面列表顺序
        WebAPI.post('/factory/modifyPageList/' + this.projectId, {
            pageList: pageList
        }).done(function(result) {
            if(result.status && result.status == "OK"){
                //todo nothing
            }
        });
    };

    TreeView.prototype.close = function () {
        this.treeObj && this.treeObj.destroy();
        if(this.ajaxRequestTree.state() === 'pending'){
            this.ajaxRequestTree.abort();
        }
    };

    window.TreeView = TreeView;
}());