(function () {
    var _this;
    function LayerPanel(screen) {
        _this = this;
        this.screen = screen;
        this.container = screen.layerPanelCtn;
        this.treeObj = undefined;
        this.parentTree = undefined;
        this.startNode = undefined;
        this.painter = this.getPainter();

        this.store = {
            layers: this.painter.store.layerModelSet,
            widgets: this.painter.store.widgetModelSet,
            page: this.painter.store.pageModel
        };

        this.init();
    }

    LayerPanel.prototype.layerTools = [
        {id: 'delLayer', name: 'delete', icon: 'glyphicon glyphicon-trash', iconType: 1},
        //{id: 'importLayerTemplet', name: 'import', icon: 'glyphicon glyphicon-import', iconType: 1},
        //{id: 'exportLayerTemplet', name: 'export', icon: 'glyphicon glyphicon-export', iconType: 1},
        {id: 'editLayer', name: 'edit', icon: 'glyphicon glyphicon-edit', iconType: 1},
        {id: 'addGroup', name: 'create layer', icon: 'glyphicon glyphicon-folder-open', iconType: 1}
    ];

    LayerPanel.prototype.defaultSetting = {
        view:{
            fontCss:{
                color: '#fff'
            },
            addDiyDom: addDiyDom,
            showLine: false
        },
        edit:{
            enable: true,
            showRemoveBtn: false,
            showRenameBtn: true,
            drag:{
                isCopy: false,//防止ctrl拖拽时复制节点
                isMove: true,
                prev: dropPrev,
                inner: dropInner,
                next: dropNext
            }
        },
        callback:{
            onNodeCreated: zTreeOnNodeCreated,
            beforeDrag: beforeDrag,
            beforeDrop: beforeDrop,
            onRename: zTreeOnRename,
            onClick: zTreeOnClick,
            onDrop: zTreeOnDrop,
            beforeClick: zTreeBeforeClick
        }
    };

    LayerPanel.prototype.getPage = function () {
        return this.screen;
    };

    LayerPanel.prototype.getPainter = function () {
        return this.getPage().getPainter();
    };

    LayerPanel.prototype.init = function () {
        this.initTools();
    };

    LayerPanel.prototype.show = function () {
        var layerId, nodeId, node;

        this.bindLayerModelInsert();
        
        this.bindLayerModelSetOb();
        this.bindWidgetModelSetOb();
        //如果有选中图层,则显示选中图层
        if(this.painter.state.activeLayers().length > 0) {
            //如果只有一个选中图层,触发该图层dom的click事件
            if(this.painter.state.activeLayers().length == 1) {
                layerId = this.painter.state.activeLayers()[0].store.model._id();
                layerId && (nodeId = this.treeObj.getNodeByParam('modelId',layerId).tId);
                nodeId && $('#' + nodeId + '_a').click();
            } else {//如果有多个选中图层,增加选中样式
                this.painter.state.activeLayers().forEach(function(layer){
                    layerId = layer.store.model._id();
                    node = _this.treeObj.getNodeByParam('modelId',layerId);
                    if(!node) return;
                    $('#' + node.tId + '_a').addClass('curSelectedNode');
                });
            }
        }
        this.bindStateOb();
    };

    LayerPanel.prototype.hide = function () {
        this.store.layers.removeEventListener('insert', this.bindLayerModelInsert, this);
        this.store.layers.removeEventListener('remove', this.bindLayerModelRemove, this);

        this.store.widgets.removeEventListener('insert', this.bindLayerModelInsert, this);
        this.store.widgets.removeEventListener('remove', this.bindLayerModelRemove, this);
    };

    LayerPanel.prototype.bindLayerModelSetOb = function () {
        this.store.layers.addEventListener('insert', this.bindLayerModelInsert, this);
        this.store.layers.addEventListener('remove', this.bindLayerModelRemove, this);
    };

    LayerPanel.prototype.bindWidgetModelSetOb = function () {
        this.store.widgets.addEventListener('insert', this.bindLayerModelInsert, this);
        this.store.widgets.addEventListener('remove', this.bindLayerModelRemove, this);
    };

    LayerPanel.prototype.bindLayerModelInsert = function(e, data) {
        var arr = undefined, firstNode;
        this.count = 0;//canvas 图层节点在tree的插入位置
        if (!e) {
            this.buildTreeByOrder(_this.screen.page.layerList, true);
        } else {
            arr = data.models;
            if (arr.length === 1) {
                //单个节点且已知父节点
                _this.addZTreeNode(arr[0], false);
            } else if (arr.length > 1) {
                this.buildTreeByOrder(_this.screen.page.layerList, false);
            }
        }

        var layerLen = _this.treeObj.getSelectedNodes();
        if (layerLen.length < 1) {
            return
        } else {
            layerLen.forEach(function(row){
                var rowParent = row.getParentNode();
                if(rowParent&&rowParent.children&&rowParent.children.length === 0){
                    $('#'+rowParent.tId+'_switch').removeClass('noline_docu').addClass('noline_close');
                    $('#'+rowParent.tId+'_ico').removeClass('ico_docu').addClass('ico_close');
                }
            })
        }
    };

    LayerPanel.prototype.bindLayerModelRemove = function(e, data){
        if(!data || !data.models) return;
        data.models.forEach(function(model){
            _this.treeObj.removeNode(_this.treeObj.getNodeByParam('modelId',model._id()));
        });

        var layerLen = _this.treeObj.getSelectedNodes();
        if (layerLen.length < 1) {
            return
        } else {
            layerLen.forEach(function(row){
                var rowParent = row.getParentNode();
                if(rowParent&&rowParent.children&&rowParent.children.length === 0){
                    $('#'+rowParent.tId+'_switch').removeClass('noline_docu').addClass('noline_close');
                    $('#'+rowParent.tId+'_ico').removeClass('ico_docu').addClass('ico_close');
                }
            })
        }
    };

    //根据page.layerList或者layer.list的顺序生成树
    LayerPanel.prototype.buildTreeByOrder = function(arrId, isRefresh){
        var modelList;
        if(!arrId || !(arrId instanceof Array)){
            arrId = this.screen.page.layerList;
            isRefresh = true;
        }
        //清空所有的节点
        if(isRefresh && arrId && arrId.length > 0){
            var nodes = $.deepClone(this.treeObj.getNodes());
            nodes.forEach(function(node){
                _this.treeObj.removeChildNodes(node);
                _this.treeObj.removeNode(node);
            });
        }

        if(!arrId || arrId.length == 0) return;
        arrId.forEach(function(id){
            var model = _this.findModelById(id);
            if(model){
                _this.addZTreeNode(model, true);
                if(!model.list) return;
                modelList = model.list();
                if(modelList && modelList.length > 0){
                    _this.buildTreeByOrder(model.list(), false);
                }
            }
        });
    };

    LayerPanel.prototype.findModelById = function(id){
        var model = _this.store.layers.findByProperty('_id', id);
        if(!model){
            model = _this.store.widgets.findByProperty('_id', id);
        }
        return model;
    };

    LayerPanel.prototype.addGroup = function () {
        var info = _this.getParentFolder();
        var opt = {
            "_id" : ObjectId(),
            "w" : 800,
            "h" : 600,
            "type" : "layer",
            "isHide" : 0,
            "isLock" : 0,
            "name" : info.name,
            "list" : [],
            "option" : {},
            "parentId" : info.parentId,             //20160704, 新增, 父元素ID, 为空则为根目录显示
            "pageId": _this.screen.page.id             //20160704, 新增, 所在页面ID
        }
        _this.store.layers.append(new NestedModel(opt));
    };

    //获取父节点id和生成名字
    LayerPanel.prototype.getParentFolder = function(){
        var selectedNodes = _this.treeObj.getSelectedNodes();
        var info = {parentId: '', name: 'layer-'}, parentNode, rootNodes, selectNode, max = 0, num = 0;

        if(selectedNodes.length > 0){
            selectNode = selectedNodes[0];
            if(selectNode.dropInner){//layer
                parentNode = selectNode;
            }else{//widget
                parentNode = selectedNodes[0].getParentNode();
            }
            if(parentNode){
                info.parentId = parentNode.modelId;
                info.name = parentNode.name + '-';
                getName(parentNode.children)
            }else{
                rootNodes = this.treeObj.getNodes();
                getName(rootNodes);
            }
        }else{
            rootNodes = this.treeObj.getNodes();
            getName(rootNodes);
        }
        return info;

        function getName(nodes){
            nodes && nodes.forEach(function(node){
                if(node.dropInner){
                    num = node.name.split(info.name);
                    if(num.length === 2 && !isNaN(parseInt(num[1]))){
                        num = parseInt(num[1]);
                    }else{
                        num = 0;
                    }
                    if(num > max){
                        max = num;
                    }
                }
            });
            info.name = info.name + (max + 1);
        }
    }

    LayerPanel.prototype.remove = function () {
        var layerLen = _this.treeObj.getSelectedNodes();
        if(layerLen.length < 1) {
            return
        }else {
            confirm(I18n.resource.mainPanel.layerPanel.DELETE_LAYER_INFO, function () {
                 _this.painter.setActiveWidgets();
                for(var i = 0; i < layerLen.length; i++){
                    removeModel(layerLen[i].modelId)
                }
                layerLen.forEach(function(row){
                    var rowParent = row.getParentNode();
                    if(rowParent&&rowParent.children&&rowParent.children.length === 0){
                        $('#'+rowParent.tId+'_switch').removeClass('noline_docu').addClass('noline_close');
                        $('#'+rowParent.tId+'_ico').removeClass('ico_docu').addClass('ico_close');
                    }
                })
                _this.painter.setActiveLayers();
            },function(){
                return;
            });
        };

        function removeModel(modelId){
            var list;
            var model = _this.store.layers.findByProperty('_id',modelId);
            !model && (model = _this.store.widgets.findByProperty('_id',modelId));
            if(!model) return;
            if(model.list && model.list()){//layer, 如果有子节点,先删除子节点
                list = model.list();
                if(list && list.length > 0){
                    list.forEach(function(id){
                        removeModel(id)
                    });
                }
                _this.store.layers.remove(model);
            }else{
                _this.store.widgets.remove(model);
            }
        }
    };

    //锁定图层
    LayerPanel.prototype.lockLayer = function () {
        if(_this.treeObj.getSelectedNodes().length > 0){
            _this.treeObj.getSelectedNodes().forEach(function(layer){
                //更改isLock字段
                _this.store.layers.findByProperty('_id',layer.modelId).isLock(1);
                _this.switchLockState(layer);
            });
        }
    };
    //重命名函数
    LayerPanel.prototype.editLayer = function () {
        if(_this.treeObj.getSelectedNodes().length === 1){//只有选中一个才能触发
            var $spanLayer = $("#" + _this.treeObj.getSelectedNodes()[0].tId+ "_a");//重命名的对象
            $spanLayer.children('.button.edit').click();//触发ztree控件的一个按钮重命名点击事件
        }
    };
    LayerPanel.prototype.importTemplate = function () {
        MaterialModal.show([{'title':'Template',data:['Layer']}], function (data) {
            var content = data.content;
            var layerId = ObjectId();
            var widgets = [];

            if (_this.treeObj) {
                // 添加新图层
                _this.store.layers.append(new NestedModel({
                    _id: layerId,
                    isHide: 0,
                    isLock: 0,
                    list: [],
                    name: data.name,
                    option: {},
                    type: content.type
                }));
                // 添加新控件
                // 更新 layerId
                widgets = content.widgets.map(function (row) {
                    row._id = ObjectId();
                    row.layerId = layerId;
                    return new NestedModel(row);
                });
                _this.screen.store.widgetModelSet.append(widgets);
            }
        });
    };

    LayerPanel.prototype.exportTemplate = function () {
        var layer = _this.treeObj.getSelectedNodes();
        var templateName, data;

        if (layer.length !== 1) {
            alert(I18n.resource.mainPanel.layerPanel.EXPORT_INFO);//'请选择一个图层!'
            return;
        }

        layer = layer[0];
        if (layer.type !== 'canvas') {
            alert(I18n.resource.mainPanel.layerPanel.EXPORT_INFO_TIP);//'目前只支持 canvas 图层模板的导出'
            return;
        }
        templateName = prompt(I18n.resource.mainPanel.layerPanel.WRITE_TEMPLET_NAME);
        if(!templateName) return;
        data = {
            _id: ObjectId(),
            name: templateName,
            creator: AppConfig.userProfile.fullname,
            time: new Date().format('yyyy-MM-dd HH:mm:ss'),
            'public': 1,
            isFolder:0,
            group: '',
            type: 'layer',
            content: {
                isHide: layer.isHide,
                isLock: layer.isLock,
                list: layer.list,
                name: layer.name,
                option: layer.option || {},
                type: layer.type,
                widgets: (function (widgetModelSet) {
                    var widgets = widgetModelSet.findListByProperty('layerId', layer.modelId) || [];
                    return widgets.map(function (row) {
                        return row.serialize();
                    });
                } (painter.screen.getWidgetsData()))
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
    //切换锁的状态
    LayerPanel.prototype.switchLockState = function (treeNode) {
        var model = this.getModelByTreeNode(treeNode);
        if(!model) return;
        if(treeNode.isLock == 0){
            model.isLock(1);
            treeNode.isLock = 1;
            $("#" + treeNode.tId).find('.iconfont').html("&#xe670;").show();
        }else{
            model.isLock(0);
            treeNode.isLock = 0;
            $("#" + treeNode.tId).find('.iconfont').html("&#xe68c;").show();
        }
        
    };
    //切换可见不可见
    LayerPanel.prototype.switchEyeState = function (treeNode) {
        var className = '';
        var isHide = null;
        if(treeNode.isHide == 0){
            isHide = 1;
            className = 'glyphicon glyphicon-eye-close';
        }else{
            isHide = 0;
            className = 'glyphicon glyphicon-eye-open';
        }

        var parentNode = treeNode.getParentNode();
        if (parentNode && parentNode.isHide==1) {
            return;
        }
        
        //文件夹 不在文件夹下的文件
        traverse(treeNode);
        this.painter.setActiveWidgets();

        function traverse(treeNode){
            var childNodes = treeNode.children;//子元素
            var mode = _this.getModelByTreeNode(treeNode);
            if(!mode) return;
            mode.isHide && mode.isHide(isHide);
            treeNode.isHide = isHide;
            $("#" + treeNode.tId).children('.treeCfg').children('.glyphicon:eq(0)').removeClass().addClass(className);
            childNodes && childNodes.forEach(function(child){
                child && traverse(child);
            });
        }
    };

    LayerPanel.prototype.getModelByTreeNode = function (treeNode) {
        if(treeNode.type == "layer"){
            var model = this.store.layers.findByProperty('_id', treeNode.modelId);
        }else{
            var model = this.store.widgets.findByProperty('_id', treeNode.modelId); 
        }
        return model;
    }

    LayerPanel.prototype.close = function () {
        this.screen = null;
        this.store = null;
        this.container = null;
        this.painter = null;

        this.treeObj.destroy();
        this.treeObj = null;
        this.count = null;
        this.container.innerHTML = '';
    };

    LayerPanel.prototype.initTools = function () {
        this.parentTree && this.parentTree.remove();
        $('.layerTopToolWrap').remove();
        this.container.innerHTML = '';
        var strHtml = '', $ul = $('<ul class="list-inline layerTopToolWrap toolWrap"></ul>');
        $(this.container).append('<ul id="parentTree" class="ztree gray-scrollbar"></ul>');
        for(var i = 0, tool; i < this.layerTools.length; i++){
            tool = this.layerTools[i];
            if(tool.iconType == 1){
                strHtml += ('<li id="'+ tool.id +'"><span class="'+ tool.icon +'"></span></li>');
            }
        }
        $ul.html(strHtml);
        $(this.container).append($ul);

        $('#addGroup').attr('title', I18n.resource.mainPanel.layerPanel.ADD_GROUP);
        $('#editLayer').attr('title', I18n.resource.mainPanel.layerPanel.EDIT_LAYER);
        $('#exportLayerTemplet').attr('title', I18n.resource.mainPanel.layerPanel.EXPORT_LAYER_TEMPLET);
        $('#importLayerTemplet').attr('title', I18n.resource.mainPanel.layerPanel.IMPORT_LAYER_TEMPLET);
        $('#delLayer').attr('title', I18n.resource.mainPanel.layerPanel.DELETE_LAYER);

        this.parentTree = $('#parentTree');
        this.treeObj = $.fn.zTree.init(this.parentTree, this.defaultSetting, []);
        //event
        $('#addGroup')[0].onclick = this.addGroup;
        $('#delLayer')[0].onclick = this.remove;
        //$('#importLayerTemplet')[0].onclick = _this.importTemplate;
        //$('#exportLayerTemplet')[0].onclick = _this.exportTemplate;
        $('#editLayer')[0].onclick = _this.editLayer;
    };

    LayerPanel.prototype.addZTreeNode = function(model, isSilent){
        var value = model.serialize(), parentModel, parentId, parentNode = undefined, newNode, list = [], index;
        if(value.type == 'layer'){
            parentId = value.parentId;
            parentNode = this.treeObj.getNodeByParam('modelId',parentId);
            if(!this.treeObj.getNodeByParam('modelId',value._id)){
                newNode = {modelId: value._id, pId: parentId, name: value.name ? value.name : 'new Layer', 'isParent':true, 'open':false, type: 'layer', 'isHide': value.isHide ? value.isHide : 0, 'isLock': value.isLock ? value.isLock : 0,dropInner: true};
            }
        } else {  
            parentId = value.layerId;
            parentNode = this.treeObj.getNodeByParam('modelId',parentId);
            if(!this.treeObj.getNodeByParam('modelId',value._id)){
                newNode = { modelId: value._id, pId: parentId, name: value.name ? value.name : value.type, type: value.type, 'isHide': value.isHide ? value.isHide : 0, 'isLock': 0, dropInner: false };
                //newNode.icon = '/static/app/WebFactory/themes/default/images/demo/arrow_green.png';
                var nameStr;
                switch (value.type) {
                    case 'HtmlText':
                        nameStr = I18n.resource.mainPanel.layerName.TEXT;
                        newNode.iconSkin = 'iconfont icon-shujutubiao24 toolBar';
                        break;
                    case 'CanvasText':
                        nameStr = I18n.resource.mainPanel.layerName.TEXT;
                        newNode.iconSkin = 'iconfont icon-wenzigongju toolBar';
                        break;
                    case 'HtmlButton':
                        nameStr = I18n.resource.mainPanel.layerName.BUTTON;
                        newNode.iconSkin = 'iconfont icon-anniugongju toolBar';
                        break;
                    case 'HtmlContainer':
                        nameStr = I18n.resource.mainPanel.layerName.HTML;
                        newNode.iconSkin = 'iconfont icon-htmlkongjian toolBar';
                        break;
                    case 'HtmlScreenContainer':
                        nameStr = I18n.resource.mainPanel.layerName.SCREEN;
                        newNode.iconSkin = 'iconfont icon-screenrongqikongjian toolBar';
                        break;
                    case 'HtmlDashboard':
                        nameStr = I18n.resource.mainPanel.layerName.DASHBOARD;
                        newNode.iconSkin = 'iconfont icon-h5 toolBar';
                        break;
                    case 'CanvasImage':
                        nameStr = I18n.resource.mainPanel.layerName.IMAGE;
                        newNode.iconSkin = 'iconfont icon-tianjiatupian toolBar';
                        break;
                    case 'CanvasPipe':
                        nameStr = I18n.resource.mainPanel.layerName.PIPE;
                        newNode.iconSkin = 'iconfont icon-guandaokongjian toolBar';
                        break;
                    case 'CanvasDevice':
                        nameStr = I18n.resource.mainPanel.layerName.DEVICE;
                        newNode.iconSkin = 'iconfont icon-shebeikongjian toolBar';
                        break;
                    case 'CanvasHeat':
                        nameStr = I18n.resource.mainPanel.layerName.HEAT;
                        newNode.iconSkin = 'iconfont icon-relituxuanqu toolBar';
                        break;
                    case 'CanvasHeatP':
                        nameStr = I18n.resource.mainPanel.layerName.HEATP;
                        newNode.iconSkin = 'iconfont icon-relitubiaoji toolBar';
                        break;
                    case 'CanvasPolygon':
                        nameStr = I18n.resource.mainPanel.layerName.POLYGON;
                        newNode.iconSkin = 'iconfont icon-relituxuanqu toolBar';
                        break;
                    case 'HtmlDashboard':
                        nameStr = I18n.resource.mainPanel.layerName.HTML_DASHBOARD;
                        newNode.iconSkin = 'iconfont icon-taizhangjilu toolBar';
                        break;
                }
                newNode.name = (value.idDs && value.idDs.length > 0) ? (value.idDs[0]) : (value.name ? value.name : nameStr);
            }
        }

        //获取在父级节点list的位置
        if(newNode){
            if(parentNode){
                parentModel = this.store.layers.findByProperty('_id', parentId);
                if(parentModel && parentModel.list){
                    list = parentModel.list();
                }
            }else{
                list = this.store.page.list();
            }
            index = list.indexOf(value._id);
            _this.treeObj.addNodes(parentNode, index, newNode,isSilent);//isSilent=true不展开父节点
        }
    };

    //获取treeNode的子节点ids赋值对应的model给的list
    LayerPanel.prototype.getLayerList = function(treeNode){//获取节点列表
        var model = undefined;
        if(treeNode){
            model = this.store.layers.findByProperty('_id', treeNode.modelId);
            if(model){
                model.list(getList(treeNode.children));
            }
        }else{//根节点
            _this.store.page.list(getList(this.treeObj.getNodes()));
        }

        function getList(nodes){
            var arr = [];
            if(!nodes || !(arr instanceof Array)) return;
            nodes.forEach(function(node){
                arr.push(node.modelId);
            });
            return arr;
        }
    };

    LayerPanel.prototype.updateLayerList = function (oldParentNode,newParentNode,targetModel,targetId) {
        var model,model2;
        var list, list2;
        if(oldParentNode){
            model = this.store.layers.findByProperty('_id', oldParentNode.modelId);
            if (model) {
                list = getList(oldParentNode.children);
            }
        } else {//根节点
            model = _this.store.page;
            list = getList(this.treeObj.getNodes());
        }

        if(newParentNode){
            model2 = this.store.layers.findByProperty('_id', newParentNode.modelId);
            if (model2) {
                list2 = getList(newParentNode.children);
            }
        } else {//根节点
            model2 = _this.store.page;
            list2 = getList(this.treeObj.getNodes());
        }

        if (model && model2) {
            model.compose(model2).update('nodeMove', function () {
                model.list(list);
                model2.list(list2);
                //更新父节点
                if (targetModel.parentId) {
                    targetModel.parentId(targetId);
                } else {
                    targetModel.layerId(targetId);
                }
            });
        }

        function getList(nodes){
            var arr = [];
            if(!nodes || !(arr instanceof Array)) return;
            nodes.forEach(function(node){
                arr.push(node.modelId);
            });
            return arr;
        }
    };

    // 绑定当前图层选中状态的数据
    LayerPanel.prototype.bindStateOb = function () {
        var ctnHeight = $(this.container).height();
        var parentTreeId = this.parentTree.attr('id');
        var $target, top, activeWidgets, activeLayers, activeCount = 0;
        this.painter.state.addEventListener('update.activeWidgets', function (e) {
            var tempArr = _this.treeObj.getSelectedNodes();
            
            for (var i = 0, len = tempArr.length; i < len; i++) {
                if (tempArr[i].type !== 'layer') {
                    _this.treeObj.cancelSelectedNode(tempArr[i]);
                    $('#' + tempArr[i].tId).removeClass('curSelectedNodeA');
                }
            }
            top = 0;
            activeWidgets = this.painter.state.activeWidgets();
            activeCount = activeWidgets.length;
            activeWidgets.forEach(function (row) {
                //对应的widget高亮
                var treeNode = this.treeObj.getNodeByParam('modelId', row.store.model._id());
                if(!treeNode) return;
                this.treeObj.selectNode(treeNode, activeCount > 0 ? true : false);//true 代表追加
                $target = $('#' + treeNode.tId).addClass('curSelectedNodeA');

                //进入观众视线
                while($target.parent().length === 1 && ($target.parent().attr('id') != parentTreeId)){
                    top = top + $target.parent()[0].offsetTop;
                    $target = $target.parent();
                }
                $('#' + treeNode.tId).scrollTop(top - ctnHeight);
            }, this);
        }, this);
        this.painter.state.addEventListener('update.activeLayers', function (e) {
            var tempArr = _this.treeObj.getSelectedNodes();
            for (var i = 0, len = tempArr.length; i < len; i++) {
                if (tempArr[i].type === 'layer') {
                    _this.treeObj.cancelSelectedNode(tempArr[i]);
                    $('#' + tempArr[i].tId).removeClass('curSelectedNodeA');
                }
            }

            activeLayers = this.painter.state.activeLayers();
            activeCount = activeLayers.length;
            activeLayers.forEach(function (row) {
                //对应的layer高亮
                var treeNode = this.treeObj.getNodeByParam('modelId', row.store.model._id());
                if(!treeNode) return;
                this.treeObj.selectNode(treeNode, activeCount > 0 ? true : false);//true 代表追加
                $target = $('#' + treeNode.tId).addClass('curSelectedNodeA');
            }, this);
        }, this);
    };

    function addDiyDom(treeId, treeNode) {
        // var aObj = $("#" + treeNode.tId + "_switch");
        var $a = $("#" + treeNode.tId+"_a");
        var $divTreeCfg = $('<div class="treeCfg" style="width:40px"></div>');
        var $btnEye = $('<span class="glyphicon"></span>');
        var $btnLock = $('<span class="iconfont"></span>');
        var $spanLayer = $("#" + treeNode.tId + "_a").children('span:nth-child(2)');
        //是否可见
        if(treeNode.isHide){
            $btnEye.addClass('glyphicon-eye-close');
        }else{
            $btnEye.addClass('glyphicon-eye-open');
        }
        
        //是否锁定
        if(treeNode.isLock == 1){
            $btnLock.html("&#xe670;").show();
        }else{
            $btnLock.html("&#xe68c;").show();
        }
        /*aObj.before($btnEye);
        aObj.next('a').after($btnLock);*/
        if(treeNode.type === "layer"){
            $divTreeCfg.append($btnEye);
            $divTreeCfg.append($btnLock);
        }else{
            $divTreeCfg.append($btnEye);
        }
        $btnEye[0].onclick = function(){
            _this.switchEyeState(treeNode);
        };
        $a.after($divTreeCfg);
        $btnLock[0].onclick = function(){
            _this.switchLockState(treeNode);
        };
        $spanLayer[0].ondblclick = function(){
            $(this).next('.button.edit').click();
        }
        $('#'+ treeNode.tId)[0].scrollIntoView(false);//自动跳转
    };

    var curDragNodes = [];
    function zTreeOnNodeCreated(event, treeId, treeNode){
        if(treeNode.type === 'layer') {
            $('#'+ treeNode.tId + '_switch').prependTo($('#'+ treeNode.tId + '_a'));
            $("#" + treeNode.tId + '_ico').css({'width':0,'height':0});
        }
    }
    function beforeDrag(treeId, treeNodes) {
        curDragNodes = treeNodes;
        return true;
    }
    function beforeDrop(treeId, treeNodes, targetNode, moveType) {
        return targetNode ? targetNode.drop !== false : true;
    }

    function zTreeOnRename(event, treeId, treeNode, isCancel){
        var model = _this.store.layers.findByProperty('_id', treeNode.modelId);
        model && model.name(treeNode.name);
    }
    function zTreeBeforeClick() {
        if (arguments[2] === 0) {
            var selectedNodes = _this.treeObj.getSelectedNodes();
            if (selectedNodes.length === 1) {
                return false;
            }
        }
    }
    function zTreeOnClick(event, treeId, treeNode) {
        var selectedNodes = _this.treeObj.getSelectedNodes();
        var $liLayer = $("#" + treeNode.tId);
        var parentNode = treeNode.getParentNode();
        var index = _this.treeObj.getNodeIndex(treeNode);
        var layerId = [], widgetId = [];
        var click = function () {
            $('li.curSelectedNodeA').not($liLayer).removeClass('curSelectedNodeA');
            $liLayer.toggleClass('curSelectedNodeA');

            //判断特定图层，不可用的工具紧灰
            if ($liLayer.hasClass('curSelectedNodeA')) {

            } else {
                //treeNode的子节点也要
                if (treeNode.children && treeNode.children) {
                    treeNode.children.forEach(function (node) {
                        if (!node || !node.tId) return;
                        $("#" + node.tId).removeClass('curSelectedNodeA');
                    });
                }
                _this.treeObj.cancelSelectedNode();
            }
        };

        var ctrlClick = function () {
            $liLayer.toggleClass('curSelectedNodeA');
        };

        var shiftClick = function () {
            if (_this.startNode && parentNode === _this.startNode.parentNode) {
                $('.curSelectedNodeA').removeClass('curSelectedNodeA');
                var count = index - _this.startNode.index;
                var nodeNew = _this.startNode.treeNode;

                if (count > 0) {
                    for (var i = 0; i <= count; i++) {
                        var $node = $("#" + nodeNew.tId);
                        if (!$node.hasClass('curSelectedNodeA')) {
                            $node.addClass('curSelectedNodeA');
                        }
                        _this.treeObj.selectNode(nodeNew, true);
                        nodeNew = nodeNew.getNextNode();
                        
                    }
                } else {
                    for (var j = 0; j <= (-count) ; j++) {
                        var $node = $("#" + nodeNew.tId);
                        if (!$node.hasClass('curSelectedNodeA')) {
                            $node.addClass('curSelectedNodeA');
                        }
                        _this.treeObj.selectNode(nodeNew, true);
                        nodeNew = nodeNew.getPreNode();
                    }
                }
            } else {
                click();
                _this.startNode = {
                    treeNode: treeNode,
                    parentNode: parentNode,
                    index: index
                }
            }
        }

        if (event.ctrlKey) {
            ctrlClick();
        } else if (event.shiftKey) {
            shiftClick();
        } else {
            click();
        }
        if (!event.shiftKey) {
            _this.startNode = {
                treeNode: treeNode,
                parentNode: parentNode,
                index: index
            }
        }

        selectedNodes = _this.treeObj.getSelectedNodes();
        if (selectedNodes instanceof Array && selectedNodes.length >0) {
            selectedNodes.forEach(function (node) {
                if(node.dropInner){
                    layerId.push(node.modelId);
                }else{
                    widgetId.push(node.modelId);
                }
            });
        }
        _this.painter.setActiveLayers(layerId);
        _this.painter.setActiveWidgets(widgetId);
    }

    function zTreeOnDrop(event, treeId, treeNodes, targetNode, moveType) {
        if (!targetNode) return;
        var allNode = $(_this.container).find("#parentTree li a>.noline_docu");
        allNode.each(function(){
            $(this).removeClass('noline_docu').addClass('noline_close');
            $(this).next().removeClass('ico_docu').addClass('ico_close');
        });
        var model, targetId = '', oldParentId, nodeType, parentNode, layerId, nodeId, $target;
        for (var i = 0, len = treeNodes.length; i < len;i++){
            nodeType = treeNodes[i].dropInner ? 'layers' : 'widgets';
            model = _this.store[nodeType].findByProperty('_id', treeNodes[i].modelId);
            if (!model) return;
            parentNode = treeNodes[i].getParentNode();
            if (parentNode) {
                targetId = parentNode.modelId;
            }
            treeNodes[i].pId = targetId;
            oldParentId = model.parentId ? model.parentId() : model.layerId();//旧的父节点, layer

            //新旧父节点对应的list更新 父节点更新
            _this.updateLayerList(_this.treeObj.getNodeByParam('modelId', oldParentId),parentNode,model,targetId);
        }
        
        //单个拖拽后选定
        if (treeNodes.length === 1) {
            nodeType = treeNodes[0].dropInner ? 'layers' : 'widgets';
            model = _this.store[nodeType].findByProperty('_id', treeNodes[0].modelId);
            layerId = model._id();
            layerId && (nodeId = _this.treeObj.getNodeByParam('modelId', layerId).tId);
            nodeId && ($target = $('#' + nodeId));
            $target && !$target.hasClass('curSelectedNodeA') && $('#' + nodeId + '_a', $target).click();
        }
    };

    function dropPrev(treeId, nodes, targetNode) {
        var pNode = targetNode.getParentNode();
        if (pNode && pNode.dropInner === false) {
            return false;
        } else {
            for (var i=0,l=curDragNodes.length; i<l; i++) {
                var curPNode = curDragNodes[i].getParentNode();
                if (curPNode && curPNode !== targetNode.getParentNode() && curPNode.childOuter === false) {
                    return false;
                }
            }
        }
        return true;
    }
    function dropInner(treeId, nodes, targetNode) {
        //layer拖拽到根节点
        var model,oldParentId,oldParentModel,list;
        if (targetNode && targetNode.dropInner === false) {
            return false;
        } else {
            for (var i=0,l=curDragNodes.length; i<l; i++) {
                if (!targetNode && curDragNodes[i].dropRoot === false) {//=== false 允许放到根节点
                    return false;
                } else if (curDragNodes[i].parentTId && curDragNodes[i].getParentNode() !== targetNode && curDragNodes[i].getParentNode().childOuter === false) {
                    return false;
                }
            }
        }
        return true;
    }
    function dropNext(treeId, nodes, targetNode) {
        var pNode = targetNode.getParentNode();
        if (pNode && pNode.dropInner === false) {
            return false;
        } else {
            for (var i=0,l=curDragNodes.length; i<l; i++) {
                var curPNode = curDragNodes[i].getParentNode();
                if (curPNode && curPNode !== targetNode.getParentNode() && curPNode.childOuter === false) {
                    return false;
                }
            }
        }
        return true;
    }
    window.LayerPanel = LayerPanel;
} ());