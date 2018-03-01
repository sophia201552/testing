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
        {id: 'addGroup', name: 'Add Group', icon: 'glyphicon glyphicon-folder-open', iconType: 1},
        {id: 'addPage', name: 'Add Page', icon: 'glyphicon glyphicon-plus', iconType: 1},
        {id: 'delGroupPage', name: 'Delete', icon: 'glyphicon glyphicon-trash', iconType: 1},
        {id: 'editPage', name: 'Edit', icon: 'glyphicon glyphicon-edit', iconType: 1},
        {id: 'lockPage', name: 'Lock', icon: 'glyphicon glyphicon-lock', iconType: 1},
        {id: 'importPageTemplet', name: 'import', icon: 'glyphicon glyphicon-import', iconType: 1},
        {id: 'exportPageTemplet', name: 'export', icon: 'glyphicon glyphicon-export', iconType: 1}
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
                        showRenameBtn: false,
                        showRemoveBtn: false
                    },
                    data: {
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
                        beforeDrop: zTreeBeforeDrop
                    }
                };

                function zTreeOnClick(event, treeId, treeNode) {
                };

                function zTreeOnDblClick(event, treeId, treeNode) {
                    if (!treeNode.isParent) {
                        if (treeNode && treeNode.id) {
                            var openedNodes = $('#treeControl').find('.curOpenedNode');
                            if (openedNodes) {
                                openedNodes.removeClass('curOpenedNode');
                            }

                            var curNode = $('#' + treeNode.tId).children('a');
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
                    }
                    else {
                        return true;
                    }
                };
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

                $(document).ready(function () {
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

                    //event
                    $('#addGroup')[0].onclick = _this.funcAddGroup;
                    $('#addPage')[0].onclick = _this.funcAddPage;
                    $('#delGroupPage')[0].onclick = _this.funcDelGroupPage;
                    $('#lockPage')[0].onclick = _this.funcLockPage;
                    $('#importPageTemplet')[0].onclick = _this.importTemplate;
                    $('#exportPageTemplet')[0].onclick = _this.exportTemplate;
                    $('#editPage')[0].onclick = _this.funcEditPage;
                });
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
            params = {id:item._id, pId:item.parent, name:item.text, type: item.type}
            if ('Folder' == item.type) {
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
                result.push(params);
            }
            else if ('EnergyScreen' == item.type) {
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
            if ('Folder' == arr[i].type && !arr[i].parent) {
                dataTree.push({'id': arr[i]._id, 'name': arr[i].text, 'isParent': true, 'children': []});
            }
        }
        for (var i = 0, lenI = arr.length; i < lenI; i++) {
            if ('Folder' == arr[i].type && arr[i].parent) {
                for (var j = 0, lenJ = dataTree.length; j < lenJ; j++) {
                    this.setNode(arr[i], dataTree[j]);
                }
            }
        }
        for (var i = 0, lenI = arr.length; i < lenI; i++) {
            if ('Folder' != arr[i].type) {
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
            var parentId = null;
            var parentNode = null;
            var index = 0;
            var selectNodes = _this.treeObj.getSelectedNodes();
            if (selectNodes.length > 0) {
                parentId = selectNodes[0].parentTId;
                parentNode = _this.treeObj.getNodeByTId(parentId);
                index = selectNodes[0].getIndex();
            };
            var newId = ObjectId();
            var newNode = {id:newId, pId:parentId, name:'new node', 'isParent':true, 'open':true};
            var ret = _this.treeObj.addNodes(parentNode, index, newNode);
            _this.treeObj.editName(ret[0]);
            _this.screen.syncPage();
        }
    };

    TreeView.prototype.funcAddPage = function () {
        PageEditModal.show({name:'Untitled', type:'PageScreen', width:800, height:600}, _this.callbackAddPage);
    };

    TreeView.prototype.callbackAddPage = function (pageCfg) {
        if (_this.treeObj) {
            var parentId = null;
            var parentNode = null;
            var index = 0;
            var selectNodes = _this.treeObj.getSelectedNodes();
            if (selectNodes.length > 0) {
                parentId = selectNodes[0].parentTId;
                parentNode = _this.treeObj.getNodeByTId(parentId);
                //index = selectNodes[0].getIndex();
            };
            var newId = ObjectId();
            var newNode;
            if ('PageScreen' == pageCfg.type) {
                newNode = {id:newId, pId:null, name:pageCfg.name, isParent:false, isHide:0, isLock:0, layerList:[], type: pageCfg.type, width: pageCfg.width, height: pageCfg.height};
            }
            else if ('EnergyScreen' == pageCfg.type) {
                newNode = {id:newId, pId:null, name:pageCfg.name, isParent:false, isHide:0, isLock:0, type: pageCfg.type};
            }
            else {
                return;
            }
            var ret = _this.treeObj.addNodes(parentNode, -1, newNode);
            //_this.treeObj.editName(ret[0]);
            _this.screen.syncPage();
        }
    };

    TreeView.prototype.funcDelGroupPage = function () {
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
            if (confirm(show)) {
                for (var i = 0, len = selectNodes.length; i < len; i++) {
                    _this.treeObj.removeNode(selectNodes[i], true);
                }
            }
            _this.screen.syncPage();
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
        var templateName = prompt('输入模板名称');
        var data = {
            _id: ObjectId(),
            name: templateName,
            creator: AppConfig.userId,
            time: new Date().format('yyyy-MM-dd HH:mm:ss'),
            public: 1,
            group: '',
            type: 'page',
            content: {
                layers: painter.screen.getLayersData().serialize(),
                widgets: painter.screen.getWidgetsData().serialize()
            }
        };
        WebAPI.post('/factory/material/save', data
        ).done(function(result){
            if(result && result._id){
                data._id = result._id;
            }
        }).always(function(){

        });
    };

    TreeView.prototype.funcEditPage = function () {
        var selectNodes = _this.treeObj.getSelectedNodes();
        if (selectNodes && selectNodes.length > 0) {
            var src = {name:selectNodes[0].name, type:selectNodes[0].type, width:selectNodes[0].width, height:selectNodes[0].height};
            PageEditModal.show(src, _this.callbackEditPage);
        }
    };

    TreeView.prototype.callbackEditPage = function (pageCfg) {
        var selectNodes = _this.treeObj.getSelectedNodes();
        if (selectNodes && selectNodes.length > 0) {
            selectNodes[0].name = pageCfg.name;
            selectNodes[0].type = pageCfg.type;
            selectNodes[0].width = pageCfg.width;
            selectNodes[0].height = pageCfg.height;
            _this.treeObj.updateNode(selectNodes[0]);
            _this.screen.syncPage();
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
            for (var i = 0, len = arr.length; i < len; i++) {
                var item = arr[i];
                pId = '';
                for (var j = 0, len2 = arr.length; j < len2; j++) {
                    if (item.parentTId == arr[j].tId) {
                        pId = arr[j].id;
                        break;
                    }
                }
                if (item.isParent) {
                    ret.push({_id:item.id, parent:pId, text:item.name, type:item.type});
                }
                else {
                    if ('PageScreen' == item.type) {
                        ret.push({_id:item.id, parent:pId, text:item.name, type:item.type, isHide:item.isHide, isLock:item.isLock, layerList:item.layerList, width:item.width, height:item.height});
                    }
                    else if ('EnergyScreen' == item.type) {
                        ret.push({_id:item.id, parent:pId, text:item.name, type:item.type, isHide:item.isHide, isLock:item.isLock});
                    }
                }
            }
            return ret;
        }
    };

    TreeView.prototype.close = function () {
        _this.treeObj && _this.treeObj.destroy();
    };


    window.TreeView = TreeView;

}());