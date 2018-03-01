/**
 * Created by win7 on 2016/2/6.
 */
var HierFilter = (function(){
    var _this;
    function HierFilter($ctn,theme,parent){
        _this = this;
        _this.$ctn = $ctn;
        _this.theme = theme;
        _this.opt = undefined;
        _this.parent = parent;
        _this.defaultOpt = {
                title:{
                    show:false
                },
                search:{
                    show:true
                },
                class: {
                    show:true,
                    projects: {
                        show: true,
                        class: 'all',
                        showAll: true,
                        showNone: true,
                        add:true,
                        delete:true
                    },
                    groups: {
                        show: true,
                        class: 'all',
                        showAll: true,
                        showNone: true,
                        add:true,
                        delete:true
                    },
                    things: {
                        show: true,
                        class: 'all',
                        showAll: true,
                        showNone: true,
                        add:true,
                        delete:true
                    }
                },
                tree:{
                    show:true,
                    event:{},
                    drag:{
                        enable:true
                    },
                    tool:{
                        add:{

                        },
                        edit:{

                        },
                        del:{

                        }
                    }
                }
            };
        _this.dictClass = {};
        _this.store = undefined;
        _this.initDeferred = $.Deferred();
        _this.$paneClass = undefined;
        _this.$paneSearch = undefined;
        _this.$paneTree = undefined;
        _this.$paneAdd = undefined;

        _this.tree = undefined;
        _this.setDefault = false;
        _this.prevProjId = undefined;
        _this.isSearch = false;
    }
    HierFilter.prototype = {
        init:function(ctn,theme){
            _this.$ctn = ctn?ctn:_this.$ctn;
            _this.theme = theme?theme:_this.theme;
            WebAPI.get('/static/scripts/iot/hierFilter.html').done(function(resultHTML){
                _this.$ctn.append(resultHTML);
                _this.initAddPane();
                _this.initSearch();
                _this.initDeferred.resolve();
            });
        },
        setOption:function(opt){
            _this.initDeferred.done(function() {
                _this.opt = $.extend(true, {}, _this.defaultOpt, opt);
                var postData = {
                    parent: []
                };
                WebAPI.get('/iot/getClassFamily/group/cn').done(function (result) {
                    _this.dictClass['groups'] = result;
                });
                WebAPI.get('/iot/getClassFamily/thing/cn').done(function (result) {
                    _this.dictClass['things'] = result;
                });
                WebAPI.get('/iot/getClassFamily/project/cn').done(function (result) {
                    _this.dictClass['projects'] = result;
                });
                WebAPI.post('/iot/search', postData).done(function (resultDate) {
                    _this.isSearch = false;
                    _this.store = {
                        groups: resultDate.groups,
                        projects: resultDate.projects,
                        things: resultDate.things
                    };
                    for (var i = 0; i < _this.store.groups.length; i++) {
                        _this.store.groups[i].isParents = true;
                        //_this.store.groups[i].open = true;
                        _this.store.groups[i].baseType = 'groups';
                    }
                    for (var i = 0; i < _this.store.projects.length; i++) {
                        _this.store.projects[i].isParents = true;
                        //_this.store.projects[i].open = true;
                        _this.store.projects[i].baseType = 'projects';
                    }
                    for (var i = 0; i < _this.store.things.length; i++) {
                        _this.store.things[i].baseType = 'things';
                    }
                    _this.initClassPane();
                    //_this.initClassDetail();
                    _this.initTreePane(_this.store);
                    var node = _this.tree.getNodes();
                    if (node.length == 0)return;
                    node = node[0];
                    _this.tree.selectNode(node);
                    _this.setDefault = true;
                    _this.tree.setting.callback.onClick({target:document.getElementById(node.tId)}, node['_id'], node);
                    //var treeNode = {
                    //    _id: "ddddddddddddf32fbc300001",
                    //    _idProj: "aaaaaaaaabaaf32fbc300001",
                    //    baseType: "groups",
                    //    check_Child_State: 0,
                    //    check_Focus: false,
                    //    checked: false,
                    //    checkedOld: false,
                    //    chkDisabled: false,
                    //    editNameFlag: false,
                    //    halfCheck: false,
                    //    isAjaxing: false,
                    //    isFirstNode: true,
                    //    isHover: true,
                    //    isLastNode: false,
                    //    isParent: true,
                    //    level: 1,
                    //    name: "冷冻水系统",
                    //    nocheck: false,
                    //    open: true,
                    //    pId: "aaaaaaaaabaaf32fbc300001",
                    //    parentTId: "paneIotData_4",
                    //    prefix: "",
                    //    tId: "paneIotData_5",
                    //    type: "Group",
                    //    weight: 0,
                    //    zAsync: true
                    //};
                    //Spinner.spin($('#paneAssetList')[0]);
                    //WebAPI.get('/asset/getThingInfoList/' + treeNode['_id']).done(function (result) {
                    //    WebAPI.post('/iot/search',{parent:[{id:treeNode['_id'],type:treeNode['baseType']}]}).done(function(subRes){
                    //        //拼接数据
                    //        treeNode.children = [];
                    //        for (var ele in subRes){
                    //            if (ele == 'class')continue;
                    //            for (var i = 0 ; i < subRes[ele].length; ++i){
                    //                treeNode.children.push(subRes[ele][i])
                    //            }
                    //        }
                    //        if (result.data && result.data.length > 0 && treeNode.children && treeNode.children.length > 0) {
                    //            result.data.forEach(function (data) {
                    //                treeNode.children.forEach(function (node) {
                    //                    if (data._id == node._id) {
                    //                        data.name = node.name;
                    //                        data.type = node.type;
                    //                    }
                    //                });
                    //            });
                    //        }
                    //
                    //        //渲染到页面
                    //        _this.parent.listPanel.render(result.data, treeNode);
                    //        //默认选中第一个
                    //        $('#assetTable tr:eq(0)').click();
                    //    });
                    //});
                });
            });
        },
        refresh:function(){

        },
        dispose:function(){

        },
        close:function(){

        },
        initClassPane:function(){
            if(!(_this.opt.class && _this.opt.class.show ))return;
            _this.$paneClass = $('#paneIotType');
            _this.$paneClass.html('');
            setClassSel('projects');
            setClassSel('groups');
            setClassSel('things');
            function setClassSel(type){
                if(_this.opt.class && _this.opt.class[type] && _this.opt.class[type].show){
                    var strType = type.slice(0,type.length - 1);
                    strType = strType[0].toLocaleUpperCase() + strType.slice(1);
                    var $divSelect = $('<div class="divSelect">');
                    var selOpt = [];
                    if (_this.opt.class[type].showAll){
                        selOpt.push({
                            value:'all',
                            name:'全部'
                        })
                    }
                    if (_this.opt.class[type].showNone){
                        selOpt.push({
                            value:'none',
                            name:'隐藏'
                        })
                    }
                    for (var cls in  _this.dictClass[type]){
                        if (_this.dictClass[type][cls].parent == 'BaseIOT')continue;
                        selOpt.push({
                            value:cls,
                            name:_this.dictClass[type][cls].name
                        })
                    }
                    var $selector = _this.setSel(selOpt).addClass('selClass');
                    if ($selector.children('option').length == 0)return;
                    $selector.off('change').on('change',function(e){
                        var opt = {
                            'type':type,
                            'val': $(e.target).val()
                        };
                        _this.initTreeData(opt);
                        _this.initAttrPane(opt)
                    });
                    $divSelect.append($selector);
                    _this.$paneClass.append($divSelect);
                }
            }
        },
        setSel:function(selOpt){
            var $selector = $('<select>');
            var $option;
            for (var i = 0 ; i< selOpt.length;i++){
                $option = $('<option>').attr('value',selOpt[i].value).text(selOpt[i].name);
                $selector.append($option);
            }
            return $selector
        },
        initAttrPane:function(opt){
            var $paneClass,cls,type,clsStore,$divAttr,attrStore,$selAttr,parentStore;
            cls = opt.val;
            type = opt.type;
            clsStore = _this.searchClass(cls);
            $paneClass = $('#paneIot-' + type).html('').removeClass('on');
            if(!clsStore)return;
            $paneClass.append('<div class="className">' + clsStore.name + '</div>');
            parentStore = _this.searchClass(clsStore.parent);
            if(parentStore && parentStore.name) {
                $paneClass.append('<div class="classParentName">' + parentStore.name + '</div>');
            }
            $divAttr = $('<div class="divAttr">');
            for (var attr in clsStore.attrs) {
                attrStore = clsStore.attrs[attr];
                setAttr(attrStore, $divAttr);
                $paneClass.find('.className').after($divAttr);
            }
            if($paneClass.find('select').length > 0) {
                $paneClass.addClass('on');
            }
            function setAttr(attrStore,$divAttr){
                if (attrStore.filter){
                    $divAttr.append('<span class="label">' + attrStore.name +'</span>');
                    $selAttr = $('<select class="filterAttr">').addClass('attr').attr('filterMode',attrStore.filter.t);
                    if (attrStore.filter.t = 'enum'){
                        for (var attrOpt in attrStore.filter.opt){
                            $selAttr.append('<option value="' + attrOpt + '">' + attrStore.filter.opt[attrOpt] + '</option>')
                        }
                    }else if(attrStore.filter.t = 'range'){
                        for (var j = 0 ; j < attrStore.filter.opt.length; j++){
                            $selAttr.append('<option value="' + attrStore.filter.opt[j] + '">' + attrStore.filter.opt[j] + '</option>')
                        }
                    }
                    $divAttr.append($selAttr);
                }
            }
        },
        initSearch:function(){
            var $iptSearch = $('#paneIotSearch').find('input');
            $iptSearch.on('propertychange input',function(e){
                if ($iptSearch.val() == '') {
                    var postData = {
                        parent: []
                    };
                    WebAPI.post('/iot/search', postData).done(function (result) {
                        if (!result)return;
                        _this.isSearch = false;
                        $.fn.zTree.destroy('paneIotData');
                        _this.store = {
                            projects: [],
                            groups: [],
                            things: []
                        };
                        _this.tree = null;
                        _this.store = {
                            groups: result.groups,
                            projects: result.projects,
                            things: result.things
                        };
                        for (var i = 0; i < _this.store.groups.length; i++) {
                            _this.store.groups[i].isParents = true;
                            //_this.store.groups[i].open = true;
                            _this.store.groups[i].baseType = 'groups';
                        }
                        for (var i = 0; i < _this.store.projects.length; i++) {
                            _this.store.projects[i].isParents = true;
                            //_this.store.projects[i].open = true;
                            _this.store.projects[i].baseType = 'projects';
                        }
                        for (var i = 0; i < _this.store.things.length; i++) {
                            _this.store.things[i].baseType = 'things';
                        }
                        _this.initClassPane();
                        //_this.initClassDetail();
                        _this.initTreePane(_this.store);
                    })
                }
            })
            $iptSearch.keyup(function(e){
                if (13 == e.keyCode) {
                    $iptSearch.blur();
                    var projId;
                    var selectNode = _this.tree.getSelectedNodes()[0];
                    if (!selectNode || !selectNode['projId']){
                        projId = _this.prevProjId
                    }else{
                        projId = selectNode['projId'];
                        _this.prevProjId = projId;
                    }
                    var postData
                    if ($iptSearch.val() == ''){
                        postData = {
                            parent: []
                        };
                        WebAPI.post('/iot/search', postData).done(function (result) {
                            if(!result )return;
                            _this.isSearch = false;
                            $.fn.zTree.destroy('paneIotData');
                            _this.store = {
                                projects:[],
                                groups:[],
                                things:[]
                            };
                            _this.tree = null;
                            _this.store = {
                                groups: result.groups,
                                projects: result.projects,
                                things: result.things
                            };
                            for (var i = 0; i < _this.store.groups.length; i++) {
                                _this.store.groups[i].isParents = true;
                                //_this.store.groups[i].open = true;
                                _this.store.groups[i].baseType = 'groups';
                            }
                            for (var i = 0; i < _this.store.projects.length; i++) {
                                _this.store.projects[i].isParents = true;
                                //_this.store.projects[i].open = true;
                                _this.store.projects[i].baseType = 'projects';
                            }
                            for (var i = 0; i < _this.store.things.length; i++) {
                                _this.store.things[i].baseType = 'things';
                            }
                            _this.initClassPane();
                            //_this.initClassDetail();
                            _this.initTreePane(_this.store);
                        })
                    }else {
                        postData = {
                            searchName:$iptSearch.val(),
                            projId:projId
                        };
                        WebAPI.post('/iot/fuzzysearch', postData).done(function (result) {
                            if(!result || !result.data)return;
                            _this.isSearch = true;
                            $.fn.zTree.destroy('paneIotData');
                            _this.store = {
                                projects:[],
                                groups:[],
                                things:[]
                            };
                            _this.tree = null;
                            for (var i = 0 ; i < result.data.length;i++){
                                result.data[i].pId = result.data[i]['_idPrt'];
                                _this.store[result.data[i].baseType].push(result.data[i])
                            }
                            //for (var i = 0; i < _this.store.groups.length; i++) {
                            //    _this.store.groups[i].isParents = true;
                            //    //_this.store.groups[i].open = true;
                            //    _this.store.groups[i].baseType = 'groups';
                            //}
                            //for (var i = 0; i < _this.store.projects.length; i++) {
                            //    _this.store.projects[i].isParents = true;
                            //    //_this.store.projects[i].open = true;
                            //    _this.store.projects[i].baseType = 'projects';
                            //}
                            //for (var i = 0; i < _this.store.things.length; i++) {
                            //    _this.store.things[i].baseType = 'things';
                            //}
                            _this.initTreePane(_this.store);
                        })
                    }
                }
            })
        },
        searchName:function(name){
            for (var type in _this.store.class){
                for( var keyName in _this.store.class[type]){
                    if(keyName == name)return _this.store.class[type][keyName]
                }
            }
        },
        searchClass:function(cls){
            for( var type in _this.dictClass) {
                for (var keyCls in _this.dictClass[type]) {
                    if (keyCls == cls)return _this.dictClass[type][keyCls]
                }
            }
        },
        initTreePane:function(opt,parentNode){
            if(_this.tree)return;
            _this.$paneTree =$('#paneIotData');
            if(_this.opt.tree && _this.opt.tree.show){

                var setting = {
                    data: {
                        simpleData: {
                            enable: true,
                            idKey: '_id'
                        }
                    },
                    edit: {
                        enable: true,
                        drag:{
                            isCopy:false,
                            isMove:false
                        }
                    },
                    view: {
                        addDiyDom:addDiyDom,
                        addHoverDom:addHoverDom,
                        removeHoverDom:removeHoverDom,
                        dblClickExpand:false
                    },
                    callback: {
                        //onRightClick: function (event, treeId, item) {
                        //    var cls = {};
                        //    for (var type in _this.dictClass) {
                        //        var dictClass = _this.dictClass[type];
                        //        if (dictClass) {
                        //            for (var keyCls in dictClass) {
                        //                if (keyCls == item.type) {
                        //                    cls = dictClass[keyCls];
                        //                    break;
                        //                }
                        //            }
                        //        }
                        //    }
                        //
                        //    var str = '', i = 0;
                        //
                        //    for (var attr in cls.attrs) {
                        //        str += cls.attrs[attr].name + ": " + item.arrP[i++] + ";  \n";
                        //    }
                        //
                        //    alert(str);
                        //},
                        //beforeExpand:function(event, treeId, treeNode){
                        //    _this.childAppend(treeNode);
                        //},
                        beforeRename:function(){
                            return false;
                        },
                        beforeRemove:function(){
                        },
                        beforeDrag:function(){
                            return false;
                        },
                        onDblClick:function (event, treeId, treeNode){
                            if(!_this.opt.tree.event.dblClick)return;
                            _this.opt.tree.event.dblClick.call(_this, event, treeId, treeNode);
                        },
                        onClick: function (event, treeId, treeNode) {
                            //_this.childAppend(treeNode);
                            if(!_this.opt.tree.event.click)return;
                            var that = this;
                            var dblFlag = false;
                            var clkInterval;
                            if(typeof  treeNode.clickTime =='undefined'){
                                clkInterval = Infinity;
                            }else{
                                clkInterval = new Date() - treeNode.clickTime;
                            }
                            treeNode.clickTime = new Date();
                            $(event.target).on('click.judgeDbl',function(){
                                dblFlag = true;
                            });
                            var dblJudge = window.setInterval(function(){
                                $(event.target).off('click.judgeDbl');
                                window.clearInterval(dblJudge);
                                if(!dblFlag && clkInterval > 200) {
                                    _this.childAppend(treeNode, function () {
                                        if (_this.opt.tree.event.click){
                                            if (!_this.opt.tree.event.click instanceof Array) {
                                                _this.opt.tree.event.click.call(that, event, treeId, treeNode);
                                            }else{
                                                for (var i = 0; i < _this.opt.tree.event.click.length ;i++){
                                                    if (_this.opt.tree.event.click[i].tar.toString().indexOf(treeNode.baseType) > -1 || _this.opt.tree.event.click[i].tar == 'all'){
                                                        _this.opt.tree.event.click[i].act.call(that, event, treeId, treeNode)
                                                    }
                                                }
                                            }
                                        }
                                    });
                                    //_this.opt.tree.event.click.call(that, event, treeId, treeNode);
                                }
                            },200);
                        }
                    }
                };
                var zNodes = _this.initTreeData(opt);
                _this.tree = $.fn.zTree.init(this.$paneTree, setting, zNodes);
                //if (_this.opt.tree.drag && _this.opt.tree.drag.enable){
                //    _this.$paneTree.attr('draggable',true);
                //    if (_this.opt.tree.drag.dragstart) {
                //        attachDragEvent('dragstart');
                //    }
                //    if (_this.opt.tree.drag.drop) {
                //        attachDragEvent('drop');
                //    }
                //}
                _this.$paneTree.on('click','.btnEdit',function(e){
                    e.stopPropagation();
                    var treeNode = _this.tree.getNodeByTId(e.target.parentNode.id);
                    var parentNode = treeNode.getParentNode();
                    new CreateDeviceModal({
                        mode: 'edit',
                        baseType: treeNode.baseType,
                        filter: _this,
                        parentNode: parentNode,
                        treeNode: treeNode
                    });
                });
                _this.$paneTree.on('click','.btnDelete',function(e){
                    e.stopPropagation();
                    var treeNode = _this.tree.getNodeByTId(e.target.parentNode.id);
                    var postData = [{
                        'id':[treeNode['_id']],
                        'type':treeNode['baseType']
                    }];
                    WebAPI.post('/iot/delIotInfo',postData).done(function(){
                        var nodes = _this.tree.getNodesByParam('_id',$(e.target.parentNode).attr('ptid'));
                        for (var i = 0 ;i < nodes.length ;i++){
                            _this.tree.removeNode(nodes[i]);
                        }
                        if(typeof _this.opt.tree.tool.delete == 'function'){
                            _this.opt.tree.tool.delete.call(_this,treeNode)
                        }
                    });
                });
                _this.$paneTree.on('click','.btnTemplate',function(e){
                    e.stopPropagation();
                    var treeNode = _this.tree.getNodeByTId(e.target.parentNode.id);
                    var strModalContent = new StringBuilder();
                    //strModalContent.append('<div class="modal fade">');
                    //strModalContent.append('   <div class="modal-dialog">');
                    //strModalContent.append('       <div class="modal-content">');
                    //strModalContent.append('           <div class="modal-header">');
                    //strModalContent.append('               <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>');
                    //strModalContent.append('               <h4 class="modal-title">Modal title</h4>');
                    //strModalContent.append('           </div>');
                    //strModalContent.append('           <div class="modal-body">');
                    strModalContent.append('               <iframe style="width:100%;height:100%;" name="ifram_factory" sandbox="allow-forms allow-popups allow-scripts allow-same-origin allow-modals" frameborder="0"></iframe>');
                    //strModalContent.append('           </div>');
                    //strModalContent.append('           <div class="modal-footer">');
                    //strModalContent.append('               <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>');
                    //strModalContent.append('               <button type="button" class="btn btn-primary">Save changes</button>');
                    //strModalContent.append('           </div>');
                    //strModalContent.append('       </div>');
                    //strModalContent.append('   </div>');
                    //strModalContent.append('</div>');
                    var $modalContent = $(strModalContent.toString());
                    var $modal = $('#templateModal');
                    $modal.find('.modal-content').append($modalContent);
                    $modal.modal('show');
                    $modal.off().on('shown.bs.modal',function(){
                        //WebAPI.get('/asset/getThingDetail/'+ treeNode['_id']).done(function(result){
                            var form, ipt;
                            //postData = {};
                            //for (var ele in treeNode.arrP){
                            //    postKey = _this.dictClass[treeNode.baseType][treeNode.type].attrs[ele].name;
                            //    if (postKey) {
                            //        postData[postKey] = treeNode.arrP[ele]
                            //    }
                            //}
                            //if (result.data) {
                                // 动态创建表单
                                // iframe 的 name 不能用大小写驼峰，否则 form 的 target 属性链接会失败
                                // 按照官方的说法，“iframe 需要一个明确的名称”
                                form = document.createElement('form');
                                form.action = '/factory/preview/8f54051d0011456903054765';
                                form.method = 'post';
                                form.target = 'ifram_factory';

                                ipt = document.createElement('input');
                                ipt.type = 'hidden';
                                ipt.name = 'params';
                                ipt.value = JSON.stringify(treeNode.arrP);

                                form.appendChild(ipt);
                                document.body.appendChild(form);
                                form.submit();
                                document.body.removeChild(form);
                            //}
                        })
                    //});
                    $modal.on('hidden.bs.modal',function(){
                        $modalContent.remove();
                    })
                });
                function addDiyDom(treeId,treeNode){
                    var $target = $('#' + treeNode.tId);
                    $target.attr('ptId',treeNode['_id']);
                    $target.addClass(treeNode.baseType);
                    if (typeof _this.opt.tree.event.addDom == 'function'){
                        _this.opt.tree.event.addDom.call(_this,treeNode,$target);
                    }else {
                        if (treeNode.baseType == 'groups' || treeNode.baseType == 'things') {
                            $target.append('\
                        <span class="btnEdit btnTreeNode glyphicon glyphicon-edit"></span>\
                        <span class="btnDelete btnTreeNode glyphicon glyphicon-remove-sign"></span>\
                        <span class="btnTemplate btnTreeNode glyphicon glyphicon-comment"></span>\
                        ');
                        }
                    }
                    if (_this.opt.tree.drag && _this.opt.tree.drag.enable){
                        $target.attr('draggable',true);
                        if (_this.opt.tree.drag.dragstart) {
                            attachDragEvent('dragstart',$target,treeNode);
                        }
                        if (_this.opt.tree.drag.dragend) {
                            attachDragEvent('dragend',$target,treeNode);
                        }
                        if (_this.opt.tree.drag.drop) {
                            attachDragEvent('drop',$target,treeNode);
                        }
                    }
                }
                function addHoverDom(treeId,treeNode){
                    var $target = $('#' + treeNode.tId);
                }
                function removeHoverDom(treeId,treeNode){
                    var $target = $('#' + treeNode.tId);
                }
                function attachDragEvent(type,target,treeNode){
                    if (_this.opt.tree.drag[type]) {
                        if (_this.opt.tree.drag[type] instanceof Function){
                            target.on(type,function (e) {
                                e.preventDefault();
                                _this.opt.tree.drag[type].call(_this,e,treeNode);
                            });
                        }else if(_this.opt.tree.drag[type].act instanceof Function && _this.opt.tree.drag[type].tar == treeNode.baseType){
                            target.on(type,function (e) {
                                _this.opt.tree.drag[type].act.call(_this,e,treeNode);
                            });
                        }else if(_this.opt.tree.drag[type] instanceof Array){
                            _this.opt.tree.drag[type].forEach(function(event,i){
                                if (event.act instanceof Function && event.tar == treeNode.baseType) {
                                    target.on(type,function (e) {
                                        e.stopPropagation();
                                        event.act.call(_this, e, treeNode);
                                    });
                                }
                            })
                        }
                    }
                }
                //function attachDragEvent(type){
                //    if (_this.opt.tree.drag[type]) {
                //        if (_this.opt.tree.drag[type] instanceof Function){
                //            _this.$paneTree.on('dragstart', 'li', function (e) {
                //                var treeNode = _this.tree.getNodeByTId($(e.target).attr('id'));
                //                _this.opt.tree.drag[type].call(_this,e,treeNode);
                //            });
                //        }else if(_this.opt.tree.drag[type].act instanceof Function && _this.opt.tree.drag[type].tar){
                //            _this.$paneTree.on(type, _this.opt.tree.drag[type].tar == 'all'?null:'.'+ _this.opt.tree.drag[type].tar, function (e) {
                //                var treeNode = _this.tree.getNodeByTId($(e.target).attr('id'));
                //                _this.opt.tree.drag[type].act.call(_this,e,treeNode);
                //            });
                //        }else if(_this.opt.tree.drag[type] instanceof Array){
                //            _this.opt.tree.drag[type].forEach(function(event,i){
                //                if (event.act instanceof Function && event.tar) {
                //                    _this.$paneTree.on('dragstart', event.tar == 'all'?null:'.'+ event.tar, function (e) {
                //                        e.stopPropagation();
                //                        var treeNode = _this.tree.getNodeByTId($(e.currentTarget).attr('id'));
                //                        event.act.call(_this, e, treeNode);
                //                    });
                //                }
                //            })
                //        }
                //    }
                //}
            }
        },
        initTreeData: function (option) {
            if (!_this.tree) {
                var data = [];
                data = data.concat(this.store.projects);
                data = data.concat(this.store.groups);
                data = data.concat(this.store.things);
            }else{
                var root = _this.tree.getNodes();
                var data = _this.tree.transformToArray(root);
                for (var i = 0;i < data.length;i++){
                    if (data[i].baseType == option.type){
                        _this.tree.showNode(data[i]);
                        if (option.val == 'all'){
                            continue;
                        }else if(option.val =='none'){
                            //data[i].isHidden = true;
                            //_this.tree.updateNode(data[i]);
                            _this.tree.hideNode(data[i]);
                        }else if (data[i].type != option.val) {
                            //data[i].isHidden = true;
                            //_this.tree.updateNode(data[i]);
                            _this.tree.hideNode(data[i]);
                        }
                    }
                }
            }
            //var length;
            //if (option.type == 'groups') {
            //    if (option.val != 'all'){
            //        length = arrGroups.length;
            //        for (var i = 0; i < length;i++){
            //            if (arrGroups[i].type != option.val){
            //                arrGroups.splice(i,1);
            //                length--;
            //                i--
            //            }
            //        }
            //    }
            //}
            //else if (option.type == 'things') {
            //    if (option.val != 'all') {
            //        length = arrThings.length;
            //        for (var i = 0; i < length; i++) {
            //            if (arrThings[i].type != option.val) {
            //                arrThings.splice(i, 1);
            //                length--;
            //                i--
            //            }
            //        }
            //    }
            //} else if (option.type == 'projects'){
            //    if (option.val != 'all'){
            //        length = arrProjects.length;
            //        for (var i = 0; i < length;i++){
            //            if (arrProjects[i].type != option.val){
            //                arrProjects.splice(i,1);
            //                length--;
            //                i--
            //            }
            //        }
            //    }
            //}
            //data = data.concat(arrProjects);
            //data = data.concat(arrGroups);
            //data = data.concat(arrThings);
            if (typeof _this.opt.tree.data == 'function'){
                _this.opt.tree.data.call(_this,data)
            }
            return data;
        },
        childAppend:function(treeNode,func){
            if(treeNode.open || _this.isSearch){
                _this.tree.expandNode(treeNode);
                return;
            }else {
                if(treeNode.baseType == 'things') {
                    func();
                    _this.tree.expandNode(treeNode);
                    return;
                }else {
                    var postData = {
                        parent: [{
                            id: treeNode['_id'],
                            type: treeNode['baseType']
                        }]
                    };
                    WebAPI.post('/iot/search', postData).done(function (resultData) {
                        for (var type in resultData.class) {
                            for (var cls in resultData.class[type]) {
                                _this.dictClass[type][cls] = resultData.class[type][cls]
                            }
                        }
                        var tempArr = [];
                        for (var ele in resultData) {
                            if (ele == 'class')continue;
                            if (typeof _this.opt.tree.data == 'function'){
                                _this.opt.tree.data.call(_this,resultData[ele],ele)
                            }
                            var flag;
                            for (var i = 0; i < resultData[ele].length; i++) {
                                for (var j = 0; j < _this.store[ele].length; j++) {
                                    if (_this.store[ele][j]['_id'] == resultData[ele][i]['_id']) {
                                        if (ele == 'groups' && !resultData[ele][i].pId) {
                                            resultData[ele][i].pId = resultData[ele][i]['_idProj'];
                                        }
                                        if (_this.store[ele][j]['pId'] == resultData[ele][i]['pId']) {
                                            flag = true;
                                        } else {
                                            if (treeNode.children) {
                                                for (var k = 0; k < treeNode.children.length; k++) {
                                                    if (resultData[ele][i]['_id'] == treeNode.children[k]['_id']) {
                                                        flag = true;
                                                        break;
                                                    }
                                                }
                                            }
                                        }
                                        _this.store[ele][j] = resultData[ele][i];
                                        break;
                                    }
                                }
                                if (!flag) {
                                    resultData[ele][i].baseType = ele;
                                    //resultData[ele][i].open = true;
                                    _this.store[ele].push(resultData[ele][i]);
                                    tempArr.push(resultData[ele][i]);
                                }
                            }
                        }
                        if (tempArr.length == 0) {
                            func();
                            _this.tree.expandNode(treeNode);
                            return;
                        }
                        _this.tree.addNodes(treeNode, tempArr, true);
                        _this.tree.expandNode(treeNode);
                        _this.initClassPane();
                        func();
                        //_this.initTreePane(_this.store,treeNode)
                    })
                }
            }
        },
        initAddPane:function(){
            _this.$paneAdd = $('#paneIotAdd');
            var $btnAdd = $('.btnAddEle');
            $btnAdd.click(function(e){
                var parentNode = _this.tree.getSelectedNodes()[0];
                if (typeof _this.opt.tree.tool.add == 'function'){
                    _this.opt.tree.tool.add.call(_this,parentNode)
                }
                if (typeof _this.opt.tree.tool.add.act == 'function'){
                    _this.opt.tree.tool.add.act.call(_this,parentNode)
                }
                if (_this.opt.tree.tool.add.default || typeof _this.opt.tree.tool.add == 'function') {
                    if (parentNode.length == 0) {
                        alert('请选择父节点');
                        return;
                    }
                    new CreateDeviceModal({
                        mode: 'add',
                        baseType: $(e.currentTarget).attr('typeAdd'),
                        filter: _this,
                        parentNode: parentNode
                    });
                }
            });
        }
    };
    return HierFilter;
})();
