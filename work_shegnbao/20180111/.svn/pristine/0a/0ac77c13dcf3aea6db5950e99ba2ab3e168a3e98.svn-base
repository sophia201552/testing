/**
 * Created by win7 on 2016/6/7.
 */
var AssetProjConfig = (function(){
    var _this;
    function AssetProjConfig(screen,$ctn){
        _this = this;
        _this.screen = screen;
        _this.$ctn = $ctn;
        _this.modalDeviceDetail = undefined;
        _this.deviceSelTree = undefined;
        _this.attrSelTree = undefined;
        _this.node = undefined;
        _this.opt = {lang:'cn'};
        _this.store = undefined;

        _this.dictClass = undefined;
        _this.init();
    }
    AssetProjConfig.prototype = {
        arrAttr:[
            {'name':'投入使用',type:'activeTime'},
            {'name':'品牌',type:'brand'},
            {'name':'采购人',type:'buyer'},
            {'name':'购置时间',type:'buyingTime'},
            {'name':'描述',type:'desc'},
            {'name':'过保时间',type:'guaranteeTime'},
            {'name':'型号',type:'model'},
            {'name':'其他',type:'other'},
            {'name':'购置价格',type:'price'},
            {'name':'序列号',type:'sn'},
            {'name':'责任人',type:'manager'},
            {'name':'状态',type:'status'},
            {'name':'供应商',type:'supplier'},
            {'name':'更新日期',type:'updateTime'},
            {'name':'到期时间',type:'endTime'},
            {'name':'图片来源',type:'urlImg'},
            {'name':'产地',type:'productArea'},
            {'name':'出厂时间',type:'productTime'},
            {'name':'使用寿命',type:'serviceLife'},
            {'name':'名称',type:'name'},
            {'name':'资产类型',type:'type'}
        ],
        init:function(){
            _this.attrSelTree = new SelectFilterTree(_this.$ctn.find('#divProjectAttr'),_this);
            _this.deviceSelTree = new SelectFilterTree(_this.$ctn.find('#divProjectDevice'),_this);
            _this.modalDeviceDetail = new ModalDeviceDetail(_this.screen,_this);
        },
        show:function(treeNode,store){
            if (store){
                _this.store = store;
				if (!_this.store) _this.store = {};
                if (!_this.store.arrStick) _this.store.arrStick = [];
                if (!_this.store.dictClass) _this.store.dictClass = {};                _this.setOpt(treeNode);
                _this.$ctn.show();
                _this.attachEvent();
            }else {
                WebAPI.get('/iot/getProjectConfig/' + treeNode['_id']).done(function (result) {
                    _this.store = result.data;
					if (!_this.store) _this.store = {};
                    if (!_this.store.arrStick) _this.store.arrStick = [];
                    if (!_this.store.dictClass) _this.store.dictClass = {};                    _this.setOpt(treeNode);
                    _this.$ctn.show();
                    _this.attachEvent();
                });
            }
        },
        setOpt:function(node){
            _this.node = node;
            _this.setDeviceTree();
            _this.setAttrTree();
        },

        setDeviceTree:function(){
            _this.deviceSelTree.setOpt(_this.opt);
            _this.initBaseInfo();
            $.when(
                WebAPI.get('/iot/getClassFamily/group/' + _this.opt.lang),
                WebAPI.get('/iot/getClassFamily/thing/' + _this.opt.lang),
                WebAPI.get('/iot/getClassFamily/project/' + _this.opt.lang)
            ).done(function (groups,things,projects) {
                    var dictTotal = {};
                    dictTotal['groups'] = groups[0];
                    dictTotal['things'] = things[0];
                    dictTotal['projects'] = projects[0];

                    var totalStore = [];
                    for (var ele in dictTotal) {
                        for (var cls in dictTotal[ele]) {
                            dictTotal[ele][cls].type = cls;
                            totalStore.push(dictTotal[ele][cls]);
                        }
                    }

                    _this.dictClass = totalStore;
                    _this.deviceSelTree.setOpt({
                        total:{
                            click: function (event, treeId, treeNode) {
                                if(!_this.store.dictClass)_this.store.dictClass = {};
                                if (!_this.store.dictClass[treeNode.type]) {
                                    _this.store.dictClass[treeNode.type] = { 'arrModel': [] }
                                }
                            }
                        },
                        result:{
                            beforeDomAdd:function(treeId, treeNode, $target){
                                var $btnModal = $('<span class="glyphicon glyphicon-edit btnModal"></span>');
                                $target.find('>a').append($btnModal);
                                $btnModal.off('click').on('click',function(e){
                                    e.stopPropagation();
                                    _this.modalDeviceDetail.show(treeNode);
                                    return false;
                                })

                            },
                            beforeClick:function(treeId, treeNode,$target){
                                if ($target.hasClass('btnModal')) {
                                    return false
                                }
                            },
                            click: function (event,treeId,treeNode) {
                                if (_this.store.dictClass && _this.store.dictClass[treeNode.type]) {
                                    delete _this.store.dictClass[treeNode.type];
                                }
                            }
                        }
                    });
                    totalStore.forEach(function(ele,index){
                        ele.open = true;
                    });
                    _this.deviceSelTree.setTotalTree(totalStore,
                        {
                            data: {
                                simpleData: {
                                    enable: true,
                                    idKey: 'type',
                                    pIdKey:'parent'
                                }
                            }
                        }
                    );
                    _this.deviceSelTree.setResultTree(_this.getClsTreeNode(_this.store.dictClass));
                });
        },
        setAttrTree:function(){
            _this.attrSelTree.setOpt({
                total:{
                },
                result:{
                    beforeDomAdd:function(){

                    },
                    click:function(){

                    }
                }
            });
            _this.attrSelTree.setResultTree(_this.getAttrTreeNode(_this.store.arrStick));
            _this.attrSelTree.setTotalTree(_this.arrAttr);
        },

        attachEvent:function(){
            _this.$ctn.find('.divFooterGrp>.btnSure').off('click').click(function(){
                var postData = {
                    'arrStick':_this.getAttrData(),
                    'dictClass':_this.getClassData()
                };
                WebAPI.post('/iot/saveProjectConfig/' + _this.node['_id'],postData).done(function(){
                    _this.screen.projectConfig = {
                        'name':document.getElementById('iptProjectName').value,
                        'arrStick':postData.arrStick,
                        'dictClass':postData.dictClass,
                        'projId':_this.node['_id']
                    };
                    var selectNode = _this.screen.filterPanel.tree.getSelectedNodes()[0];
                    if(selectNode && selectNode.getPath()[0]['_id'] == _this.node['_id'] && selectNode.baseType != 'projects'){
                        if (selectNode.baseType == 'groups'){
                            _this.screen.getThingInfoList(selectNode);
                        }else{
                           _this.screen.getThingInfoList(selectNode.getParentNode());
                        }
                    }
                    _this.$ctn.hide();
                });
                if(_this.node.name == document.getElementById('iptProjectName').value)return;
                _this.node.name = document.getElementById('iptProjectName').value;
                WebAPI.post('iot/setIotInfo',[_this.node]).done(function(){
                    _this.screen.filterPanel.tree.updateNode(_this.node)
                });
            });
            _this.$ctn.find('.divFooterGrp>.btnCancel').off('click').click(function(){
                _this.$ctn.hide();
            })
        },
        getAttrTreeNode:function(data){
            if (!data) return;
            var arr = [];
            var cls;
            data.forEach(function(ele){
                cls =  _this.getAttrDetail(ele);
                arr.push({
                    type:ele,
                    name:cls.name
                })
            });
            return arr;
        },
        getClsTreeNode:function(data){
            if (!data) return;
            var arr = [];
            var cls;
            for (var ele in data){
                cls =  _this.getClassDetail(ele);
                arr.push({
                    type:ele,
                    name:cls.name,
                    parent:cls.parent,
                    open:true
                })
            }
            return arr;
        },
        getAttrDetail:function(ele){
            if (!_this.arrAttr)return;
            for (var i = 0; i < _this.arrAttr.length ; i++){
                if (_this.arrAttr[i].type == ele)return _this.arrAttr[i];
            }
        },
        getAttrData:function(){
            var arrNode = _this.attrSelTree.resultTree.transformToArray(_this.attrSelTree.resultTree.getNodes());
            var arrData = [];
            arrNode.forEach(function(ele,index){
                arrData.push(ele.type)
            });
            return arrData;
        },
        getClassData:function(){
            var dictClass = {};
            var arrNode = _this.deviceSelTree.resultTree.transformToArray(_this.deviceSelTree.resultTree.getNodes());
            if(!_this.store.dictClass)_this.store.dictClass = {};
            arrNode.forEach(function(ele,index){
                if(!_this.store.dictClass[ele.type]) {
                    dictClass[ele.type] = {'arrModel':[]}
                }else{
                   dictClass[ele.type] =  _this.store.dictClass[ele.type]
                }
            });
            return dictClass
        },
        getClassDetail:function(type){
            if (!_this.dictClass)return;
            for (var i = 0;i < _this.dictClass.length; i++){
                if(_this.dictClass[i].type == type)return _this.dictClass[i]
            }
        },
        initBaseInfo:function(){
            document.getElementById('iptProjectName').value = _this.node.name?_this.node.name:'';
        }
    };
    return  AssetProjConfig;
})();