(function () {
    var _this;
    function LayerPanel(screen) {
        _this = this;
        this.screen = screen;
        this.container = screen.layerPanelCtn;
        this.treeObj = undefined;
        this.store = undefined;
        this.parentTree = undefined;

        this.painter = this.screen.painter;
    }
    LayerPanel.prototype.layerTools = [
        {id: 'addLayer', name: 'create', icon: 'glyphicon glyphicon-file', iconType: 1},
        {id: 'delLayer', name: 'delete', icon: 'glyphicon glyphicon-trash', iconType: 1},
        {id: 'lockLayer', name: 'lock', icon: 'glyphicon glyphicon-lock', iconType: 1},
        {id: 'importLayerTemplet', name: 'import', icon: 'glyphicon glyphicon-import', iconType: 1},
        {id: 'exportLayerTemplet', name: 'export', icon: 'glyphicon glyphicon-export', iconType: 1}
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
                isCopy: true,
                isMove: true,
                prev: true,
                inner: false,
                next: true
            }
        },
        callback:{
            beforeDrag: beforeDrag,
            beforeDrop: beforeDrop,
            onRename: zTreeOnRename,
            onClick: zTreeOnClick
        }
    };

    LayerPanel.prototype.init = function () {};

    LayerPanel.prototype.show = function () {
        this.initTools();
        this.store = this.screen.store.layerModelSet;
        this.bindLayerModelInsert();
        this.bindLayerModelRemove();
        this.bindLayerModelSetOb();
    };

    LayerPanel.prototype.hide = function () {
        this.store.removeEventListener('insert', this.bindLayerModelInsert, this);
        this.store.removeEventListener('remove', this.bindLayerModelRemove, this);
        this.treeObj && this.treeObj.destroy();
    };

    LayerPanel.prototype.bindLayerModelOb = function (model) {
        model.addEventListener('update', function (e) {
            Log.info('update values');
        });
    };

    LayerPanel.prototype.bindLayerModelSetOb = function () {
        this.store.addEventListener('insert', this.bindLayerModelInsert, this);
        this.store.addEventListener('remove', this.bindLayerModelRemove, this);
    };

    LayerPanel.prototype.bindLayerModelInsert = function(e, data){
        var arr = undefined;
        if(!e) {
            arr = this.store.models;
        }else{
            arr = data.models;
        }
        arr.forEach(function (model) {
            this.bindLayerModelOb(model);
            this.addZTreeNode(model);
        }, this);
    };

    LayerPanel.prototype.bindLayerModelRemove = function(e, data){
        if(!data) return;
        this.treeObj.removeNode(this.treeObj.getNodeByParam('modelId',data.models[0]._id()));
    };

    LayerPanel.prototype.add = function () {
        var name = _this.generateLayerName();
        var opt = {
            _id: ObjectId(),
            type: "canvas",
            name: name,
            isLock: 0,
            isHide: 0,
            list: [],
            option: {}
        };
        _this.store.append(new NestedModel(opt));
    };

    LayerPanel.prototype.remove = function () {

        if(_this.treeObj.getSelectedNodes().length < 1) return;
        for(var i = 0; i < _this.treeObj.getSelectedNodes().length; i++){
            _this.store.remove(_this.store.findByProperty('_id',_this.treeObj.getSelectedNodes()[i].modelId));
        }
    };

    LayerPanel.prototype.lockLayer = function () {
        if(_this.treeObj.getSelectedNodes().length > 0){
            _this.treeObj.getSelectedNodes().forEach(function(layer){
                _this.switchLockState($('#' + layer.tId + '_a').next('.glyphicon'));
            });
        }
    };

    LayerPanel.prototype.importTemplate = function () {
        MaterialModal.show(['layer'], function (data) {
            var content = data.content;
            var layerId = ObjectId();
            var widgets = [];

            if (_this.treeObj) {
                // 添加新图层
                _this.store.append(new NestedModel({
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
            alert('请选择一个图层!');
            return;
        }

        layer = layer[0];
        templateName = prompt('输入模板名称');
        if(!templateName) return;
        data = {
            _id: ObjectId(),
            name: templateName,
            creator: AppConfig.account,
            time: new Date().format('yyyy-MM-dd HH:mm:ss'),
            'public': 1,
            group: [],
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

    LayerPanel.prototype.switchLockState = function ($lock) {
        var model = this.getModelByTreeNode($lock);
        if(!model) return;
        if($lock.is(':hidden')){
            model.isLock(1);
        }else{
            model.isLock(0);
        }
        $lock.toggle();
    };

    LayerPanel.prototype.switchEyeState = function ($eye) {
        var model = this.getModelByTreeNode($eye);
        if(!model) return;
        if($eye.hasClass('glyphicon-eye-open')){
            model.isHide(1);
            $eye.removeClass('glyphicon-eye-open').addClass('glyphicon-eye-close');
        }else{
            model.isHide(0);
            $eye.removeClass('glyphicon-eye-close').addClass('glyphicon-eye-open');
        }
    };

    LayerPanel.prototype.getModelByTreeNode = function ($obj) {
        var treeNodeId = $obj.parent().attr('id');
        var treeNode = this.treeObj.getNodeByTId(treeNodeId);
        var model = this.store.findByProperty('_id', treeNode.modelId);
        return model;
    }

    LayerPanel.prototype.close = function () {
        this.screen = null;
        this.store = null;
        this.container = null;
        this.painter = null;

        this.treeObj.destroy();
        this.treeObj = null;
        
        this.container.innerHTML = '';
    };

    LayerPanel.prototype.initTools = function () {
        this.parentTree && this.parentTree.remove();
        $('.layerTopToolWrap').remove();
        this.container.innerHTML = '';
        var strHtml = '', $ul = $('<ul class="list-inline layerTopToolWrap toolWrap"></ul>');
        $(this.container).append('<ul id="parentTree" class="ztree"></ul>');
        for(var i = 0, tool; i < this.layerTools.length; i++){
            tool = this.layerTools[i];
            if(tool.iconType == 1){
                strHtml += ('<li><span class="'+ tool.icon +'" id="'+ tool.id +'"></span></li>');
            }
        }
        $ul.html(strHtml);
        $(this.container).append($ul);

        this.parentTree = $('#parentTree');
        this.treeObj = $.fn.zTree.init(this.parentTree, this.defaultSetting, []);
        //event
        $('#addLayer')[0].onclick = this.add;
        $('#delLayer')[0].onclick = this.remove;
        $('#lockLayer')[0].onclick = this.lockLayer;
        $('#importLayerTemplet')[0].onclick = _this.importTemplate;
        $('#exportLayerTemplet')[0].onclick = _this.exportTemplate;
    };

    LayerPanel.prototype.addZTreeNode = function(model){
        var zNode= {}, value = model.serialize(), index = 1;//index 图层层级设置
        zNode.modelId = value._id;
        //是否隐藏
        zNode.isHide = value.isHide;
        //是否锁定
        zNode.isLock = value.isLock;
        // 图层类型
        zNode.type = value.type;
        // option
        zNode.option = value.option;
        // list
        zNode.list = value.list;
        //图层名字
        if(!value.name){
            if(value.type == 'html'){
                zNode.name = 'html';
            }else if(value.type == 'bg'){
                zNode.name = '背景';
            }else{
                zNode.name = this.generateLayerName();
            }
        }else{
            zNode.name = value.name;
        }
        //图层顺序
        if(value.type == 'html'){
            index = 0;
            zNode.drag = false;
            zNode.drop = false;
        }else if(value.type == 'bg'){
            index = -1;
            zNode.drag = false;
            zNode.drop = false;
        }
        _this.treeObj.addNodes(null, index, new Array(zNode));//html图层在最高层
    };

    LayerPanel.prototype.generateLayerName = function(){
        var max = 0, curtOrder = 0;
        this.parentTree.children('li').each(function(){
            curtOrder = $(this).children('a').children('span:nth-child(2)').text().split(' ');
            if(curtOrder.length > 1) {
                curtOrder = parseInt(curtOrder[1]);
                if(curtOrder > max){
                    max = curtOrder;
                }
            }
        });
        return 'layer '+ (max + 1);
    };

    function addDiyDom(treeId, treeNode) {
        var aObj = $("#" + treeNode.tId + "_switch");
        var $btnEye = $('<span class="glyphicon"></span>');
        var $btnLock = $('<span class="glyphicon glyphicon-lock"></span>');
        var $spanLayer = $("#" + treeNode.tId + "_a").children('span:nth-child(2)');
        //是否可见
        if(treeNode.isHide){
            $btnEye.addClass('glyphicon-eye-close');
        }else{
            $btnEye.addClass('glyphicon-eye-open');
        }
        //是否锁定
        if(treeNode.isLock){
            $btnLock.show();
        }else{
            $btnLock.hide();
        }
        aObj.before($btnEye);
        aObj.next('a').after($btnLock);
        $btnEye[0].onclick = function(){
            _this.switchEyeState($(this));
        };
        $btnLock[0].onclick = function(){
            _this.switchLockState($(this))
        };
        $spanLayer[0].ondblclick = function(){
            $(this).next('.button.edit').click();
        }
    };

    function beforeDrag(treeId, treeNodes) {
        for (var i=0,l=treeNodes.length; i<l; i++) {
            if (treeNodes[i].drag === false) {
                return false;
            }
        }
        return true;
    }
    function beforeDrop(treeId, treeNodes, targetNode, moveType) {
        return targetNode ? targetNode.drop !== false : true;
    }

    function zTreeOnRename(event, treeId, treeNode, isCancel){
        var model = _this.store.findByProperty('_id', treeNode.modelId);
        model.name(treeNode.name);
    }

    function zTreeOnClick(event, treeId, treeNode){
        var selectedNodes = _this.treeObj.getSelectedNodes();
        var layerId = []
        if(selectedNodes instanceof Array && selectedNodes.length >0){
            selectedNodes.forEach(function(node){
                layerId.push(node.modelId);
            });
        }
        _this.painter.setActiveLayers(layerId);
    }

    window.LayerPanel = LayerPanel;

} ());