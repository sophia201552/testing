(function () {

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

    PagePanel.prototype.initSyncWorker = function () {
        this.screen.syncWorker.initPagesData(this.getPagesData());
    };

    PagePanel.prototype.syncPage = function () {
        this.screen.syncWorker.syncPage();
    };

    PagePanel.prototype.getPagesData = function () {
        var data = this.treeView.getTreeData().map(function (o) {
            return new Model(o);
        });

        return new ModelSet(data);
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

    window.PagePanel = PagePanel;

} ());

(function () {
    var _this;
    function TreeView(screen) {
        _this = this;
        this.screen = screen;
        this.container = screen.container;
        this.treeObj = undefined;
        this.openPageId = undefined;
        this.projectId = screen.project.id;

        this.init();
    }
    TreeView.prototype.layerTools = [
        {id: 'delGroupPage', name: 'Delete', icon: 'glyphicon glyphicon-trash', iconType: 1},
        {id: 'importPageTemplet', name: 'import', icon: 'glyphicon glyphicon-import', iconType: 1},
        {id: 'exportPageTemplet', name: 'export', icon: 'glyphicon glyphicon-export', iconType: 1},
        {id: 'lockPage', name: 'Lock', icon: 'glyphicon glyphicon-lock', iconType: 1},
        {id: 'editPage', name: 'Edit', icon: 'glyphicon glyphicon-edit', iconType: 1},
        {id: 'addPage', name: 'Add Page', icon: 'glyphicon glyphicon-file', iconType: 1},
        {id: 'addGroup', name: 'Add Group', icon: 'glyphicon glyphicon-folder-open', iconType: 1}
    ];

    TreeView.prototype.init = function () {
        this.container.innerHTML = '<ul id="treeControl" class="ztree"></ul>';
    };

    TreeView.prototype.show = function () {
        WebAPI.get('/factory/getPageList/' + _this.projectId+'/1').done(function (result) {
            if (result && result.data) {
                var zSetting = {
                    view: {
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
                            parent: true,
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
                    if(treeNode.type != 'DropDownList') {
                        $("#" + treeNode.tId).addClass('tree-page-hover');
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
                    if (!treeNode.isParent) {
                        if (treeNode && treeNode.id) {
                            var openedNodes = $('#treeControl').find('.curOpenedNode');
                            if (openedNodes) {
                                openedNodes.removeClass('curOpenedNode');
                            }

                            var curNode = $('#' + treeNode.tId);
                            curNode.removeClass('curSelectedNode');
                            curNode.addClass('curOpenedNode');
                            _this.openPageId = treeNode.id;
                            // search layList
                            _this.screen.screen.showPage(treeNode);
                        }
                    }
                };

                function zTreeBeforeDrop(treeId, treeNodes, targetNode, moveType) {
                    if (!targetNode.isParent && 'inner' == moveType) {
                        return false;
                    }else if('inner' == moveType && treeNodes[0].type == 'DropDownList' && targetNode.getParentNode()){//文件夹内子节点没有文件夹
                        alert('目录下只支持三级结构！');
                        return false;
                    }else if('prev' == moveType && treeNodes[0].type == 'DropDownList' && targetNode.getParentNode().getParentNode()){//文件夹不能移动到文件夹内
                        alert('目录下只支持三级结构！');
                        return false;
                    }else if('next' == moveType && treeNodes[0].type == 'DropDownList' && targetNode.getParentNode().getParentNode()){//文件夹不能移动到文件夹内
                        alert('目录下只支持三级结构！');
                        return false;
                    }else {
                        return true;
                    }
                };
                function  zTreeOnDrop(event, treeId, treeNodes, targetNode, moveType) {
                    _this.syncPageList();
                    _this.screen.syncPage();
                }

                function zTreeOnRename(event, treeId, treeNode, isCancel) {
                    _this.screen.syncPage();
                }
/*
                function addHoverDom(treeId, treeNode) {
                    if (treeNode.isParent) {
                        var sObj = $("#" + treeNode.tId + "_span");
                        if (treeNode.editNameFlag) {
                            return;
                        }
                        if (0 == $("#addBtnPage_"+treeNode.tId).length) {
                            var addStr = "<span class='button addPage' id='addBtnPage_" + treeNode.tId + "' title='add page' onfocus='this.blur();'></span>";
                            sObj.after(addStr);
                            var btnPage = $("#addBtnPage_" + treeNode.tId);
                            if (btnPage) btnPage.bind("click", function () {
                                if (_this.treeObj) {
                                    _this.treeObj.addNodes(treeNode, {
                                        id: (100 + _this.nNodeCount),
                                        pId: treeNode.id,
                                        name: "new node" + (_this.nNodeCount++),
                                        'isParent': false
                                    });
                                }
                                return false;
                            });
                        }
                        if (0 == $("#addBtnGroup_"+treeNode.tId).length) {
                            var addStr = "<span class='button addGroup' id='addBtnGroup_" + treeNode.tId + "' title='add group' onfocus='this.blur();'></span>";
                            sObj.after(addStr);
                            var btnGroup = $("#addBtnGroup_"+treeNode.tId);
                            if (btnGroup) btnGroup.bind("click", function() {
                                if (_this.treeObj) {
                                    _this.treeObj.addNodes(treeNode, {id:(100 + _this.nNodeCount), pId:treeNode.id, name:"new node" + (_this.nNodeCount++), 'isParent':true});
                                }
                                return false;
                            });
                        }
                    }
                };
                function removeHoverDom(treeId, treeNode) {
                    if (treeNode.isParent) {
                        $("#addBtnGroup_" + treeNode.tId).unbind().remove();
                        $("#addBtnPage_" + treeNode.tId).unbind().remove();
                    }
                };
*/
                function addDiyDom(treeId, treeNode) {
                    if (treeNode.isParent) {
                        return;
                    }

                    var aObj = $("#" + treeNode.tId + "_switch");
                    var $divTreeCfg = $('<div class="treeCfg"></div>');
                    var $btnEye = $('<span class="nodeEye glyphicon"></span>');
                    var $btnLock = $('<span class="nodeLock glyphicon glyphicon-lock"></span>');
                    if (treeNode.isHide) {
                        $btnEye.addClass('glyphicon-eye-close');
                    } else {
                        $btnEye.addClass('glyphicon-eye-open');
                    }
                    if (treeNode.isLock) {
                        $btnLock.show();
                    } else {
                        $btnLock.hide();
                    }
                    $divTreeCfg.append($btnLock);
                    $divTreeCfg.append($btnEye);
                    aObj.next('a').after($divTreeCfg);
                    //aObj.next('a').after($btnEye);
                    //aObj.next('a').after($btnLock);
                    $btnEye[0].onclick = function(){
                        _this.switchEyeState($(this));
                        _this.screen.syncPage();
                    };
                    $btnLock[0].onclick = function(){
                        _this.switchLockState($(this));
                        _this.screen.syncPage();
                    };
                };

                var zProjNodes = _this.generateTreeEx(result.data);

                (function () {
                    _this.treeObj = $.fn.zTree.init($('#treeControl'), zSetting, zProjNodes);

                    var strHtml = '', $ul = $('<ul class="list-inline treeToolWrap"></ul>');
                    for(var i = 0, tool; i < _this.layerTools.length; i++){
                        tool = _this.layerTools[i];
                        if(tool.iconType == 1){
                            strHtml += ('<li><span class="'+ tool.icon +'" id="'+ tool.id +'" title="' + tool.name + '"></span></li>');
                        }
                    }
                    $ul.html(strHtml);
                    $(_this.screen.container).append($ul);

                    //国际化
                    $('#addGroup').attr('title', I18n.resource.mainPanel.layerPanel.ADD_GROUP);
                    $('#addPage').attr('title', I18n.resource.mainPanel.layerPanel.ADD_PAGE);
                    $('#delGroupPage').attr('title', I18n.resource.mainPanel.layerPanel.DELETE_PAGE);
                    $('#lockPage').attr('title', I18n.resource.mainPanel.layerPanel.LOCK_PAGE);
                    $('#importPageTemplet').attr('title', I18n.resource.mainPanel.layerPanel.IMPORT_PAGE_TEMPLET);
                    $('#exportPageTemplet').attr('title', I18n.resource.mainPanel.layerPanel.EXPORT_PAGE_TEMPLET);
                    $('#editPage').attr('title', I18n.resource.mainPanel.layerPanel.EDIT_PAGE);

                    //event
                    $('#addGroup')[0].onclick = _this.funcAddGroup;
                    $('#addPage')[0].onclick = _this.funcAddPage;
                    $('#delGroupPage')[0].onclick = _this.funcDelGroupPage;
                    $('#lockPage')[0].onclick = _this.funcLockPage;
                    $('#importPageTemplet')[0].onclick = _this.importTemplate;
                    $('#exportPageTemplet')[0].onclick = _this.exportTemplate;
                    $('#editPage')[0].onclick = _this.funcEditPage;
                } ());
            }
        }).always(function (e) {
            _this.screen.initSyncWorker();
        });
    };

    TreeView.prototype.remove = function () {

    };

    TreeView.prototype.generateTreeEx = function (arr) {
        var result = [];
        var params;
        for (var i = 0, len = arr.length; i < len; i++) {
            var item = arr[i];
            params = {id:item._id, pId:item.parent, name:item.text +' - '+ item.type, type: item.type};
            if ('DropDownList' == item.type) {
                params = {id:item._id, pId:item.parent, name:item.text, type: item.type};
                params.isParent = true;
                result.push(params);
            }
            else if ('PageScreen' == item.type) {
                params.isParent = false;
                params.isHide = item.isHide;
                params.isLock =item.isLock;
                params.layerList = item.layerList;
                params.width = item.width;
                params.height = item.height;
                params.display = item.display;
                result.push(params);
            }
            else {
                params.isParent = false;
                params.isHide = item.isHide;
                params.isLock =item.isLock;
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
        var model = this.getModelByTreeNode($lock);
        if(!model) return;
        if($lock.is(':hidden')){
            model.isLock = 1;
        }else{
            model.isLock = 0;
        }
        $lock.toggle();
    };

    TreeView.prototype.switchEyeState = function ($eye) {
        var model = this.getModelByTreeNode($eye);
        if(!model) return;
        if($eye.hasClass('glyphicon-eye-open')){
            model.isHide = 1;
            $eye.removeClass('glyphicon-eye-open').addClass('glyphicon-eye-close');
        }else{
            model.isHide = 0;
            $eye.removeClass('glyphicon-eye-close').addClass('glyphicon-eye-open');
        }
    };

    TreeView.prototype.getModelByTreeNode = function ($obj) {
        var treeNodeId = $obj.parent().parent().attr('id');
        return this.treeObj.getNodeByTId(treeNodeId);
    };

    TreeView.prototype.funcAddGroup = function () {
        if (_this.treeObj) {
            var parentId = null,grandfatherId = null;
            var parentNode = null,grandfatherNode = null;
            var index = 0;
            var selectNodes = _this.treeObj.getSelectedNodes();
            if (selectNodes.length > 0) {
                parentId = selectNodes[0].parentTId;
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
                var newNode = {id:newId, pId:parentId, name:'new node', 'isParent':true, 'open':true, type: 'DropDownList'};
                var ret = _this.treeObj.addNodes(parentNode, index, newNode);
                _this.treeObj.editName(ret[0]);
                _this.screen.syncPage();
            }
            _this.syncPageList();
        }
    };

    TreeView.prototype.funcAddPage = function () {
        $(".modal-title").html("Add Page")
        PageEditModal.show({name:'Untitled', type:'PageScreen', width:1366, height:650,disabled:0,display:0}, _this.callbackAddPage);
    };

    TreeView.prototype.callbackAddPage = function (pageCfg) {
        if (_this.treeObj) {
            var parentId = null;
            var parentNode = null;
            var index = 0;
            var selectNodes = _this.treeObj.getSelectedNodes();
            var newNode = {id: ObjectId(), pId:null, name:pageCfg.name, isParent:false, isHide:0, isLock:0, type: pageCfg.type};
            var ret;

            switch (pageCfg.type) {
                case 'PageScreen':
                    newNode = $.extend(false, newNode, {layerList:[], width: pageCfg.width, height: pageCfg.height, display:pageCfg.display});
                    break;
                case 'EnergyScreen':
                case 'FacReportScreen':
                case 'FacReportWrapScreen':
                    break;
                default: return;
            }

            if (selectNodes.length > 0) {
                parentId = selectNodes[0].parentTId;
                parentNode = _this.treeObj.getNodeByTId(parentId);
                index = selectNodes[0].getIndex();
            };
            
            ret = _this.treeObj.addNodes(parentNode, index, newNode);
            _this.screen.syncPage();

            // 显示类型更新
            $('#'+ret[0].tId+'_span').text(pageCfg.name + ' - ' + pageCfg.type);
            //同步pageList
            _this.syncPageList();
            //新建页面，默认进入页面
            $('#'+ret[0].tId+'_a').dblclick();
        }
    };

    TreeView.prototype.funcDelGroupPage = function () {
        var removeNodesIds = [];
        if (_this.treeObj) {
            var selectNodes = _this.treeObj.getSelectedNodes();
            if (selectNodes.length < 1) {
                return;
            };

            var show = '';
            for (var i = 0, len = selectNodes.length; i < len; i++) {
                show += selectNodes[i].name + '\n';
            }
            show += 'Be sure to delete ?';
            //TODO 测试confirm
            confirm(show, function () {
                for (var i = 0, len = selectNodes.length; i < len; i++) {
                    // 判断 selectNodes[i] 是不是文件夹，如果是，拿到它的所有非文件夹的直接子元素；
                    // 如果不是，直接进行删除操作
                    if (selectNodes[i].isParent && selectNodes[i].children) {
                        // 是文件夹
                        selectNodes[i].children.forEach(function (child) {
                            if (!child.isParent) {
                                removeNodesIds.push(child.id);
                            }
                        });
                    }
                    // 不是文件夹
                    else {
                        removeNodesIds.push(selectNodes[i].id);
                    }
                    _this.treeObj.removeNode(selectNodes[i], true);
                }

                if (_this.screen.screen.page) {
                    if (removeNodesIds.indexOf(_this.openPageId) > -1 ) {
                        _this.screen.screen.page.close();
                    }
                }
                _this.screen.syncPage();
                _this.syncPageList();
            });
        }
    };

    TreeView.prototype.funcLockPage = function () {
        if (_this.treeObj) {
            var selectNodes = _this.treeObj.getSelectedNodes();
            if (selectNodes.length > 0) {
                selectNodes.forEach(function(item) {
                    _this.switchLockState($('#' + item.tId).find('.nodeLock'));
                });
            }
            _this.screen.syncPage();
        }
    };

    TreeView.prototype.importTemplate = function () {
        //todo
        MaterialModal.show(['page'], function (data) {
            console.log(data);
        });
        // setTimeout(function(){
        //     $('#materiaModal .pageBox').dblclick(function(){
        //         var id = this.id;
        //         if (_this.treeObj) {
        //             var parentId = null;
        //             var parentNode = null;
        //             var index = 0;
        //             var selectNodes = _this.treeObj.getSelectedNodes();
        //             if (selectNodes.length > 0) {
        //                 parentId = selectNodes[0].parentTId;
        //                 parentNode = _this.treeObj.getNodeByTId(parentId);
        //                 index = selectNodes[0].getIndex();
        //             };
        //             var newId = ObjectId();
        //             var newNode = {id:newId, pId:null, name:'new node', 'isParent':false, 'isHide':0, 'isLock':0, 'layerList':[]};
        //             var ret = _this.treeObj.addNodes(parentNode, index, newNode);
        //             //_this.treeObj.editName(ret[0]);
        //         }
        //     });
        // }, 1500);

    };

    TreeView.prototype.exportTemplate = function () {
        var selectNodes = _this.treeObj.getSelectedNodes();
        var templateName, data;
        if (selectNodes.length <= 0) {
            alert('请选择一个需要导出的页面！');
            return;
        }
        templateName = prompt('输入模板名称');
        if(!templateName) return;

        data = {
            _id: ObjectId(),
            pageId: selectNodes[0].id,
            name: templateName,
            creator: AppConfig.userId,
            time: new Date().format('yyyy-MM-dd HH:mm:ss'),
            'public': 1,
            group: '',
            type: 'page',
            content: {
                width: selectNodes[0].width,
                height: selectNodes[0].height,
                display: selectNodes[0].display
            }
        }

        // 如果 page 存在，则不用去后台查找
        if(_this.screen.screen.page) {
            data.content.template = JSON.stringify({
                layers: painter.screen.getLayersData().serialize(),
                widgets: painter.screen.getWidgetsData().serialize()
            })
        }
        WebAPI.post('/factory/material/save', data
            ).done(function(result){
                if(result && result._id){
                    data._id = result._id;
                }
            }).always(function(){});
    };

    TreeView.prototype.funcEditPage = function () {
        $(".modal-title").html("Edit Page");
        var selectNodes = _this.treeObj.getSelectedNodes();
        if (selectNodes && selectNodes.length === 1 ) {
             if(selectNodes[0].type == 'DropDownList'){
                 var $spanLayer = $("#" + selectNodes[0].tId+ "_a");//重命名的对象
                 $spanLayer.children('span.edit').click();//触发ztree控件的一个按钮重命名点击事件
             }else {
                 if(!selectNodes[0].display) {
                     selectNodes[0].display = 0;
                 }
                 var src = {name:selectNodes[0].name, type:selectNodes[0].type, width:selectNodes[0].width, height:selectNodes[0].height, disabled:1, display:selectNodes[0].display};
                 PageEditModal.show(src, _this.callbackEditPage);
             }
        }else {
            alert('必须选中或者不能同时改多个文件的name！')
        }
    };

    TreeView.prototype.callbackEditPage = function (pageCfg) {
        var selectNodes = _this.treeObj.getSelectedNodes();
        if (selectNodes && selectNodes.length > 0) {
            selectNodes[0].name = pageCfg.name;
            selectNodes[0].type = pageCfg.type;
            selectNodes[0].width = pageCfg.width;
            selectNodes[0].height = pageCfg.height;
            selectNodes[0].display = pageCfg.display;
            _this.treeObj.updateNode(selectNodes[0]);
            _this.screen.syncPage();

            // 显示类型更新
            $('#'+selectNodes[0].tId+'_span').text(pageCfg.name + ' - ' + pageCfg.type);

            // 更新页面大小
            _this.screen.onPageResize(pageCfg.width, pageCfg.height);
        }
    };

    TreeView.prototype.getTreeData = function () {
        if (!_this.treeObj) {
            return null;
        }
        else {
            var arr = _this.treeObj.transformToArray(_this.treeObj.getNodes());
            var ret = [];
            var type = '';
            var pId = '';
            for (var i = 0, len = arr.length, item, p; i < len; i++) {
                item = arr[i];
                pId = '';
                for (var j = 0, len2 = arr.length; j < len2; j++) {
                    if (item.parentTId === arr[j].tId) {
                        pId = arr[j].id;
                        break;
                    }
                }
                p = {_id:item.id, parent:pId, text:item.name, type:item.type}

                switch(item.type) {
                    case 'PageScreen':
                        ret.push( $.extend(false, p, {isHide:item.isHide, isLock:item.isLock, layerList:item.layerList, width:item.width, height:item.height, display:item.display}) );
                        break;
                    default:
                        ret.push( $.extend(false, p, {isHide:item.isHide, isLock:item.isLock}) );
                        break;
                };
            }
            return ret;
        }
    };

    TreeView.prototype.close = function () {
        _this.treeObj && _this.treeObj.destroy();
    };

    TreeView.prototype.syncPageList = function(){
        var pageList = [];
        var treeData = this.getTreeData();
        if(!treeData || treeData.length == 0) return;
        treeData.forEach(function(data){
            pageList.push(data._id);
        });
        // 保存页面列表顺序
        WebAPI.post('/factory/modifyPageList/' + AppConfig.project.id, {pageList: pageList}).done(function(result){
            if(result.status && result.status == "OK"){
                //todo nothing
            }
        });
    }

    window.TreeView = TreeView;

}());