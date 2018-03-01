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
        {id: 'delLayer', name: 'delete', icon: 'glyphicon glyphicon-trash', iconType: 1},
        {id: 'importLayerTemplet', name: 'import', icon: 'glyphicon glyphicon-import', iconType: 1},
        {id: 'exportLayerTemplet', name: 'export', icon: 'glyphicon glyphicon-export', iconType: 1},
        {id: 'lockLayer', name: 'lock', icon: 'glyphicon glyphicon-lock', iconType: 1},
        {id: 'editLayer', name: 'edit', icon: 'glyphicon glyphicon-edit', iconType: 1},
        {id: 'addLayer', name: 'create', icon: 'glyphicon glyphicon-file', iconType: 1}
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
            onClick: zTreeOnClick,
            onDrop: zTreeOnDrop,
            beforeClick: zTreeBeforeClick
        }
    };

    LayerPanel.prototype.init = function () {};

    LayerPanel.prototype.show = function () {
        this.initTools();
        this.store = this.screen.store.layerModelSet;
        this.bindLayerModelInsert();
        this.bindLayerModelRemove();
        this.bindLayerModelSetOb();
        //如果有选中图层,则显示选中图层
        if(this.painter.state.activeLayers().length > 0){
            var layerId = undefined, nodeId = undefined, node;
            //如果只有一个选中图层,触发该图层dom的click事件
            if(this.painter.state.activeLayers().length == 1){
                layerId = this.painter.state.activeLayers()[0].store.model._id();
                layerId && (nodeId = this.treeObj.getNodeByParam('modelId',layerId).tId);
                nodeId && $('#' + nodeId + '_a').click();
            }else{//如果有多个选中图层,增加选中样式
                this.painter.state.activeLayers().forEach(function(layer){
                    layerId = layer.store.model._id();
                    node = _this.treeObj.getNodeByParam('modelId',layerId);
                    if(!node) return;
                    $('#' + node.tId + '_a').addClass('curSelectedNode');
                });
            }
        }else if(this.treeObj.getNodes().length > 0){//选中第一图层
            $('#' + this.treeObj.getNodes()[0].tId + '_a').click();
        }else{
            setTimeout(function(){
                if(_this.treeObj.getNodes().length > 0){
                    $('#' + _this.treeObj.getNodes()[0].tId + '_a').click();
                }
            }, 500)
        }
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
        this.count = 0;//canvas 图层节点在tree的插入位置
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
        if(!data || !data.models) return;
        data.models.forEach(function(model){
            _this.treeObj.removeNode(_this.treeObj.getNodeByParam('modelId',model._id()));
        });
    };

    LayerPanel.prototype.add = function () {
        var layerId = undefined, nodeId = undefined;
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
        _this.store.prepend(new NestedModel(opt));
        //新建图层默认进入图层
        layerId = opt._id;
        layerId && (nodeId = _this.treeObj.getNodeByParam('modelId',layerId).tId);
        nodeId && $('#' + nodeId + '_a').click();

    };

    LayerPanel.prototype.remove = function () {
        var layerLen = _this.treeObj.getSelectedNodes();
        if(layerLen.length < 1) {
            return
        }else {
            confirm('是否要删除所选图层！',function(){
                 _this.painter.setActiveWidgets();
                for(var i = 0, model = undefined; i < layerLen.length; i++){
                    model = _this.store.findByProperty('_id',layerLen[i].modelId);
                    if(model.type() == 'html' || model.type() == 'bg'){
                        alert(I18n.resource.mainPanel.layerPanel.DELETE_INFO);//'Html图层和背景图层不能被删除'
                    }else if(model.isLock() == 1){//被锁定的图层不能删除
                        alert(I18n.resource.mainPanel.layerPanel.DELETE_INFO_TIP);//'不可以删除被锁定的图层'
                    }else{
                        _this.store.remove(model);
                    }
                }
            },function(){
                return;
            });
        };
    };

    //锁定图层
    LayerPanel.prototype.lockLayer = function () {
        if(_this.treeObj.getSelectedNodes().length > 0){
            _this.treeObj.getSelectedNodes().forEach(function(layer){
                //更改isLock字段
                _this.store.findByProperty('_id',layer.modelId).isLock(1);
                _this.switchLockState($('#' + layer.tId + '_a').next('.glyphicon'));
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
            alert(I18n.resource.mainPanel.layerPanel.EXPORT_INFO);//'请选择一个图层!'
            return;
        }

        layer = layer[0];
        if (layer.type !== 'canvas') {
            alert(I18n.resource.mainPanel.layerPanel.EXPORT_INFO_TIP);//'目前只支持 canvas 图层模板的导出'
            return;
        }
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
        this.count = null;
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

        $('#addLayer').attr('title', I18n.resource.mainPanel.layerPanel.ADD_LAYER);
        $('#editLayer').attr('title', I18n.resource.mainPanel.layerPanel.EDIT_LAYER);
        $('#lockLayer').attr('title', I18n.resource.mainPanel.layerPanel.LOCK_LAYER);
        $('#exportLayerTemplet').attr('title', I18n.resource.mainPanel.layerPanel.EXPORT_LAYER_TEMPLET);
        $('#importLayerTemplet').attr('title', I18n.resource.mainPanel.layerPanel.IMPORT_LAYER_TEMPLET);
        $('#delLayer').attr('title', I18n.resource.mainPanel.layerPanel.DELETE_LAYER);

        this.parentTree = $('#parentTree');
        this.treeObj = $.fn.zTree.init(this.parentTree, this.defaultSetting, []);
        //event
        $('#addLayer')[0].onclick = this.add;
        $('#delLayer')[0].onclick = this.remove;
        $('#lockLayer')[0].onclick = this.lockLayer;
        $('#importLayerTemplet')[0].onclick = _this.importTemplate;
        $('#exportLayerTemplet')[0].onclick = _this.exportTemplate;
        $('#editLayer')[0].onclick = _this.editLayer;
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
        }else{
            this.count ++;
            index = this.count;
        }
        _this.treeObj.addNodes(null, index, new Array(zNode));//html图层在最高层
    };
    //判断工具是否可用
    LayerPanel.prototype.toolbarDisable = function (selectedNodes) {
        //判断工具是否可用
        function isDisabled($current, judgeStr) {
            if (judgeStr) {
                $current.removeAttr('disabled').css('color', 'inherit');
            } else {
                $current.attr('disabled', 'disabled').css('color', 'rgba(255, 255, 255, 0.35)');
            }
        }
        var $toolbar = $('#toolbar'); //_this.screen.factoryScreen.page.toolbar.container;_this.screen.factoryScreen.page.toolbar.tools
        var $toolbarText = $toolbar.find('button[data-type="textCtrl"]');
        var $textSvg = $toolbarText.find('text');
        var $toolbarBtn = $toolbar.find('button[data-type="btnCtrl"]');
        var $toolbarHtml = $toolbar.find('button[data-type="htmlCtrl"]');
        var $toolbarScreen = $toolbar.find('button[data-type="screenCtrl"]');
        var $toolbarImg = $toolbar.find('button[data-type="imgeCtrl"]');
        var $toolbarPipe = $toolbar.find('button[data-type="pipeCtrl"]');
        if (selectedNodes.length > 1) {
            $textSvg.css('fill', 'rgba(255, 255, 255, 0.35)');
            isDisabled($toolbarText, false);
            isDisabled($toolbarBtn, false);
            isDisabled($toolbarHtml, false);
            isDisabled($toolbarScreen, false);
            isDisabled($toolbarImg, false);
            isDisabled($toolbarPipe, false);
        } else {
            if (selectedNodes[0].type === 'html') {
                isDisabled($toolbarText, true);
                $textSvg.css('fill', 'inherit');
                isDisabled($toolbarBtn, true);
                isDisabled($toolbarHtml, true);
                isDisabled($toolbarScreen, true);
                isDisabled($toolbarImg, false);
                isDisabled($toolbarPipe, false);
            } else if (selectedNodes[0].type === 'canvas') {
                isDisabled($toolbarText, false);
                $textSvg.css('fill', 'rgba(255, 255, 255, 0.35)');
                isDisabled($toolbarBtn, false);
                isDisabled($toolbarHtml, false);
                isDisabled($toolbarScreen, false);
                isDisabled($toolbarImg, true);
                isDisabled($toolbarPipe, true);
            } else {
                $textSvg.css('fill', 'rgba(255, 255, 255, 0.35)');
                isDisabled($toolbarText, false);
                isDisabled($toolbarBtn, false);
                isDisabled($toolbarHtml, false);
                isDisabled($toolbarScreen, false);
                isDisabled($toolbarImg, false);
                isDisabled($toolbarPipe, false);
            }
        }
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
        var $liLayer = $("#" +treeNode.tId);
        var layerId =[];

            //如果按住Ctrl键,则多选,增加选中样式
        if (event.ctrlKey) {
            if ($liLayer.hasClass('curSelectedNode')) {
                $liLayer.removeClass('curSelectedNode');
            } else {
                $liLayer.addClass('curSelectedNode');
        }
            _this.toolbarDisable(selectedNodes);
        } else {
            $liLayer.addClass('curSelectedNode').siblings('li').removeClass('curSelectedNode');
            //判断特定图层，不可用的工具紧灰
            _this.toolbarDisable(selectedNodes);
        }

        if (selectedNodes instanceof Array && selectedNodes.length >0) {
            selectedNodes.forEach(function (node) {
                layerId.push(node.modelId);
        });
        }
        _this.painter.setActiveLayers(layerId);
    }

    function zTreeOnDrop(event, treeId, treeNodes, targetNode, moveType) {
        var from, to;
        var modelSet;

            // 过滤无效操作
        if (moveType === null || moveType === 'inner') return false;

            // 同一时间，只能拖拽移动一个元素
        if (treeNodes.length > 1) {
            alert(I18n.resource.mainPanel.layerPanel.DRAG_LAYER_INFO); //'请选择一个图层进行拖拽！'
            return false;
        }

        modelSet = _this.screen.store.layerModelSet;
        from = modelSet.indexOf(modelSet.findByProperty('_id', treeNodes[0].modelId));
        to = modelSet.indexOf(modelSet.findByProperty('_id', targetNode.modelId));

            // move operation
        modelSet.move(from, to);
    };

    window.LayerPanel = LayerPanel;

} ());