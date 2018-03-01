/**
 * Created by win7 on 2016/2/6.
 */
var HierFilter = (function(){
    function HierFilter($ctn,projectId,parent,theme){
        this.$ctn = $ctn;
        this.projectId = projectId;
        this.theme = theme;
        this.opt = undefined;
        this.parent = parent;
        this.defaultOpt = {
                title:{
                    show:false
                },
                base:{
                    divideByProject:true
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
                    base:{
                        expandReload:true,
                    },
                    tool:{
                        add:{

                        },
                        beforeAdd:{

                        },
                        edit:{

                        },
                        del:{

                        }
                    },
                    check:{
                        enable:false
                    }
                }
            };
        this.dictClass = {};
        this.store = undefined;
        this.initDeferred = $.Deferred();
        this.$paneClass = undefined;
        this.$paneSearch = undefined;
        this.$paneTree = undefined;
        this.$paneAdd = undefined;

        this.tree = undefined;
        this.setDefault = false;
        this.prevProjId = undefined;
        this.isSearch = false;

        this.showStatus = {'projects':'all','groups':'all','things':'all'};
    }
    HierFilter.prototype = {
        init:function(ctn,theme){
            var _this = this;
            _this.$ctn = ctn?ctn:_this.$ctn;
            _this.theme = theme?theme:_this.theme;
            if(!_this.projectId) {
                if (AppConfig && AppConfig.projectId) {
                    _this.projectId = AppConfig.projectId;
                } else {
                    if (window.parent && window.parent.AppConfig.projectId) {
                        _this.projectId = window.parent.AppConfig.projectId;
                    }
                }
            }
            if(!_this.projectId)_this.projectId = -1;
            WebAPI.get('/static/scripts/iot/hierFilter.html').done(function(resultHTML){
                _this.$ctn.append(resultHTML);
                I18n.fillArea($('#filterWrapper'));
                _this.initAddPane();
                _this.initSearch();
                _this.initDeferred.resolve();
            });
        },
        setOption:function(opt){
            var _this = this;
            _this.initDeferred.done(function() {
                _this.opt = $.extend(true, {}, _this.defaultOpt, opt);
                var postData = {
                    parent: [],
                    projId:[_this.projectId]
                };
                if (!_this.opt.base.divideByProject)delete postData.projId;
                $.when(
                    WebAPI.get('/iot/getClassFamily/group/cn'),
                    WebAPI.get('/iot/getClassFamily/thing/cn'),
                    WebAPI.get('/iot/getClassFamily/project/cn')
                ).done(function (groups,things,projects) {
                    _this.dictClass['groups'] = groups[0];
                    _this.dictClass['things'] = things[0];
                    _this.dictClass['projects'] = projects[0];
                    WebAPI.post('/iot/search', postData).done(function (resultDate) {
                        _this.store = {
                            groups: resultDate.groups,
                            projects: resultDate.projects,
                            things: resultDate.things
                        };
                        _this.isSearch = false;
                        var $Deffer = $.Deferred();
                        if (resultDate.projects.length == 0) {
                            _this.setIotProject().done(function(result){
                                if (result && result.status == 'success') {
                                    _this.store.projects[0]._id = result._id;
                                    $Deffer.resolve();
                                }else{
                                    $Deffer.reject();
                                }
                            }).fail(function(){
                                $Deffer.reject();
                            });
                        }else{
                            $Deffer.resolve();
                        }
                        $Deffer.done(function(){
                            for (var i = 0; i < _this.store.groups.length; i++) {
                                _this.store.groups[i].isParent = true;
                                //_this.store.groups[i].open = true;
                                _this.store.groups[i].baseType = 'groups';
                            }
                            for (var i = 0; i < _this.store.projects.length; i++) {
                                _this.store.projects[i].isParent = true;
                                //_this.store.projects[i].open = true;
                                _this.store.projects[i].baseType = 'projects';
                            }
                            for (var i = 0; i < _this.store.things.length; i++) {
                                _this.store.things[i].baseType = 'things';
                            }
                            for (var type in _this.store) {
                                if (_this.opt.class && _this.opt.class[type] && _this.opt.class[type].class) {
                                    if (_this.dictClass[type][_this.opt.class[type].class] && _this.dictClass[type][_this.opt.class[type].class].parent == 'BaseIOT') {
                                        _this.showStatus[type] = 'all'
                                    } else {
                                        _this.showStatus[type] = _this.opt.class[type].class
                                    }
                                }
                            }
                            _this.initClassPane();
                            //_this.initClassDetail();
                            _this.initTreePane(_this.store);
                            _this.opt.tree.event.afterInit && _this.opt.tree.event.afterInit();
                            var node = _this.tree.getNodes();
                            if (node.length == 0)return;
                            node = node[0];
                            _this.tree.selectNode(node);
                            _this.setDefault = true;
                            _this.tree.setting.callback.onClick({target: document.getElementById(node.tId)}, node['_id'], node);
                        });
                    });
                });
            });
        },
        setIotProject:function(){
            if (!(AppConfig && (AppConfig.projectList instanceof Array)))return;
            if (!this.projectId)return;
            var info;
            for (var i = 0; i < AppConfig.projectList.length ;i++){
                if (AppConfig.projectList[i].id == this.projectId){
                    info = AppConfig.projectList[i];
                    break;
                }
            }
            if (!info)return;

            var postData = {
                '_idMgt':'bbbbbbbbbbbbf32fbc300001',
                codeName:info.name_en,
                dictName:{
                    cn:info.name_cn,
                    en:info.name_en
                },
                latLng:info.latlng,
                arrP:{},
                type:'Project',
                projId:this.projectId
            };
            this.store.projects = [{
                codeName:info.name_en,
                name:info.name_cn,
                latLng:info.latlng,
                arrP:{},
                type:'Project',
                projId:this.projectId
            }];
            return WebAPI.post('/iot/setIotProject',postData)
        },
        refresh:function(){

        },
        dispose:function(){

        },
        close:function(){

        },
        initClassPane:function(){
            var _this = this;
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
                    var $divSelect = $('\
                    <div class="divSelect" value="all">\
                        <span class="spSelRs">'+I18n.resource.iot.TREE_ALL+'</span>\
                        <span class="glyphicon glyphicon-triangle-bottom"></span>\
                    </div>');
                    var selOpt = [];
                    if (_this.opt.class[type].showAll){
                        selOpt.push({
                            value:'all',
                            name:I18n.resource.iot.TREE_ALL
                        })
                    }
                    if (_this.opt.class[type].showNone){
                        selOpt.push({
                            value:'none',
                            name:I18n.resource.iot.TREE_HIDE
                        })
                    }
                    for (var cls in  _this.dictClass[type]){
                        if (_this.dictClass[type][cls].parent == 'BaseIOT')continue;
                        selOpt.push({
                            value:cls,
                            name:_this.dictClass[type][cls].name,
                            parent:_this.dictClass[type][cls].parent,
                        })
                    }
                    var $selector = _this.setSel(selOpt).addClass('selClass');
                    if ($selector.find('li').length == 0)return;
                    $selector.off('click').on('click','li',function(e){
                        e.stopPropagation();
                        var value = $(e.currentTarget).attr('value');
                        $selector.prevAll('.spSelRs').text($(e.currentTarget).children('span').text());
                        $selector.attr('value');
                        var opt = {
                            'type':type,
                            'val': value
                        };
                        _this.showStatus[opt.type] = opt.val;
                        _this.initTreeData(opt);
                        _this.initAttrPane(opt)
                    });
                    $selector.attr('value',_this.showStatus[type]);
                    if (_this.showStatus[type] == 'all'){
                        $divSelect.children('.spSelRs').text(I18n.resource.iot.TREE_ALL);
                    }else if(_this.showStatus[type] == 'none'){
                        $divSelect.children('.spSelRs').text(I18n.resource.iot.TREE_HIDE);
                    }else {
                        var arrKey = Object.keys(_this.dictClass[type]);
                        for (var i = 0; i < arrKey.length; i++) {
                            if (arrKey[i] == _this.showStatus[type]) {
                                $divSelect.children('.spSelRs').text(_this.dictClass[type][arrKey[i]].name);
                                break;
                            }
                        }
                    }
                    $divSelect.append($selector);
                    _this.$paneClass.append($divSelect);
                }
            }
        },
        setSel:function(selOpt){
            var _this = this;
            var $selector = $('<ul>');
            var tempArr = [].concat(selOpt);
            var dictTree = {};
            var level = 0;
            var length = tempArr.length;
            var numLeft = length;
            var isRoot;
            for (var i = 0; i < length; i++) {
                isRoot = true;
                for (var j = 0; j < length; j++) {
                    if (i == j)continue;
                    if (selOpt[j].value == tempArr[i].parent) {
                        isRoot = false;
                        break;
                    }
                }
                if (isRoot){
                    tempArr[i].level = level;
                    if (!dictTree[level])dictTree[level] = [];
                    dictTree[level].push(tempArr[i]);
                    tempArr[i] = null;
                }
            }
            while (numLeft > 0) {
                numLeft = 0;
                level++;
                for (var i = 0; i < length ;i++) {
                    if(!tempArr[i])continue;
                    for (var j = 0; j < dictTree[level-1].length; j++) {
                        if (tempArr[i].parent == dictTree[level-1][j].value){
                            if (!dictTree[level])dictTree[level] = [];
                            dictTree[level].push(tempArr[i]);
                            tempArr[i] = null;
                            break;
                        }
                    }
                }
                for (var i = 0; i < length; i++){
                    if(tempArr[i])numLeft++;
                }
            }
            var $option,$parent = [],$parentTemp = [];
            var $spName;
            for (var i = 0 ; i < dictTree['0'].length ;i++){
                $option = $('<li>');
                $option.addClass('level_0 '+ dictTree['0'][i].value)
                    .attr('value',dictTree['0'][i].value);
                $spName = $('<span>').text(dictTree['0'][i].name);
                $option.append($spName);
                $option.append('<ul>');
                $selector.append($option);
                $parent.push($option);
            }
            for (var ele in dictTree){
                if (ele == '0')continue;
                for (var i = 0 ; i < dictTree[ele].length;i++){
                    $option = $('<li>');
                    $option.addClass('level_'+ ele +' '+ dictTree[ele][i].value)
                        .attr('value',dictTree[ele][i].value);
                    $spName = $('<span>').text(dictTree[ele][i].name);
                    $option.append($spName);
                    $option.append('<ul>');
                    for (var j = 0; j < $parent.length; j++){
                        if ($parent[j].attr('value') == dictTree[ele][i].parent){
                            $parent[j].children('ul').append($option);
                            break;
                        }
                    }
                    $parentTemp.push($option);
                }
                $parent = $parentTemp;
                $parentTemp = [];
            }
            //for (var i = 0 ; i< selOpt.length;i++){
            //    $option = $('<option>').attr('value',selOpt[i].value).text(selOpt[i].name);
            //    $selector.append($option);
            //}
            return $selector
        },
        initAttrPane:function(opt){
            var _this = this;
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
            var _this = this;
            var $iptSearch = $('#paneIotSearch').find('input');
            $iptSearch.next().off('click').on('click',function(){
                if ($iptSearch.val() == '')return;
                $iptSearch.val('');
                clearSearch();
            });
            $iptSearch.on('propertychange input',function(e){
                if ($iptSearch.val() == '') {
                    clearSearch();
                }
            });
            $iptSearch.keyup(function(e){
                if (13 == e.keyCode) {
                    $iptSearch.blur();
                    var projId;
                    var selectNode = _this.tree.getSelectedNodes()[0];
                    if (!selectNode || !selectNode['projId']){
                        projId = _this.prevProjId?_this.prevProjId:_this.projectId;
                    }else{
                        var parentNode = selectNode.getParentNode();
                        while(parentNode) {
                            selectNode = parentNode;
                            parentNode = selectNode.getParentNode();
                        }
                        _this.prevProjId = selectNode['projId'];
                    }
                    var postData;
                    if ($iptSearch.val() == ''){
                        clearSearch();
                    }else {
                        postData = {
                            searchName:$iptSearch.val(),
                            projId:projId?projId:_this.projectId
                        };
                        if (!_this.opt.base.divideByProject)delete postData.projId;
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
                            for (var i = 0; i < _this.store.groups.length; i++) {
                                _this.store.groups[i].isParent = true;
                                //_this.store.groups[i].open = true;
                                _this.store.groups[i].baseType = 'groups';
                            }
                            for (var i = 0; i < _this.store.projects.length; i++) {
                                _this.store.projects[i].isParent = true;
                                //_this.store.projects[i].open = true;
                                _this.store.projects[i].baseType = 'projects';
                            }
                            for (var i = 0; i < _this.store.things.length; i++) {
                                _this.store.things[i].baseType = 'things';
                            }
                            _this.initTreePane(_this.store);
                        })
                    }
                }
            });

            function clearSearch(){
                var postData = {
                    parent: [],
                    projId:[_this.projectId]
                };
                if (!_this.opt.base.divideByProject)delete postData.projId;
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
                        _this.store.groups[i].isParent = true;
                        //_this.store.groups[i].open = true;
                        _this.store.groups[i].baseType = 'groups';
                    }
                    for (var i = 0; i < _this.store.projects.length; i++) {
                        _this.store.projects[i].isParent = true;
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
        },
        searchName:function(name){
            var _this = this;
            for (var type in _this.store.class){
                for( var keyName in _this.store.class[type]){
                    if(keyName == name)return _this.store.class[type][keyName]
                }
            }
        },
        searchDeviceById:function(id,type){
            var _this = this;
            if(!id)return [];
            var arrDevice = [];
            var arrId = [];
            if(type){
                if (id instanceof Array) {
                    for (var i = 0 ; i < id.length; i++){
                        arrId[i] = {id:id[i],index:i}
                    }
                    for (var i = 0; i < _this.store[type].length; i++) {
                        for (var j = 0; j < arrId.length ;j++) {
                            if (_this.store[type][i]['_id'] == arrId[j].id) {
                                arrDevice[arrId[j].index] = _this.store[type][i];
                                arrId.splice(j,1);
                                break;
                            }
                        }
                    }
                }else{
                    for (var i = 0; i < _this.store[type].length; i++) {
                        if (_this.store[type][i]['_id'] == id) {
                            return [_this.store[type][i]]
                        }
                    }
                }
            }else{
                if (id instanceof Array) {
                    for (var i = 0 ; i < id.length; i++){
                        arrId[i] = {id:id[i],index:i}
                    }
                    for (var ele in _this.store) {
                        for (var i = 0; i < _this.store[ele].length; i++) {
                            for (var j = 0; j < arrId.length ;j++) {
                                if (_this.store[ele][i]['_id'] == arrId[j].id) {
                                    arrDevice[arrId[j].index] = _this.store[ele][i];
                                    arrId.splice(j,1);
                                    break;
                                }
                            }
                        }
                    }
                }else{
                    for (var ele in _this.store) {
                        for (var i = 0; i < _this.store[ele].length; i++) {
                            if (_this.store[ele][i]['_id'] == id) {
                                return [_this.store[ele][i]]
                            }
                        }
                    }
                }
            }
            return arrDevice;
        },
        searchClass:function(cls){
            var _this = this;
            for( var type in _this.dictClass) {
                for (var keyCls in _this.dictClass[type]) {
                    if (keyCls == cls)return _this.dictClass[type][keyCls]
                }
            }
        },
        initTreePane:function(opt,parentNode){
            var _this = this;
            if(_this.tree)return;
            _this.$paneTree =$('#paneIotData');
            _this.$paneTree.off('click');
            if(_this.opt.tree && _this.opt.tree.show){

                var setting = {
                    data: {
                        simpleData: {
                            enable: true,
                            idKey: '_id'
                        }
                    },
                    keep: {
                        leaf: true,
                        parent: true
                    },
                    check:{
                        enable: _this.opt.tree.check.enable
                    },
                    //async: {
                    //    enable:true,
                    //    contentType:'application/json',
                    //    diyParam: diyParam,
                    //    dataFilter:dataFilter,
                    //    url:'/iot/search'
                    //},
                    edit: {
                        enable: true,
                        drag:{
                            isCopy:false,
                            isMove:false
                        },
                        showRemoveBtn:false,
                        showRenameBtn:false
                    },
                    view: {
                        addDiyDom:addDiyDom,
                        addHoverDom:addHoverDom,
                        removeHoverDom:removeHoverDom,
                        dblClickExpand:false,
                        showIcon:true,
                        showLine:true
                    },
                    callback: {
                        //onRightClick: function (event, treeId, item) {

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
                        beforeAsync:function(){

                        },
                        onAsyncSuccess:function(){

                        },
                        onDblClick:function (event, treeId, treeNode){
                            if(!_this.opt.tree.event.dblClick)return;
                            _this.opt.tree.event.dblClick.call(_this, event, treeId, treeNode);
                        },
                        onClick: function (event, treeId, treeNode) {
                            //_this.childAppend(treeNode);
                            //return;
                            //if (!(event.target instanceof HTMLElement))return;
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
                                    if(_this.opt.tree.event.click.isDefault === false){
                                        _this.opt.tree.event.click.act.call(that, event, treeId, treeNode);
                                        return;
                                    }
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
                if (_this.opt.tree.extend){
                    $.extend(true,setting,setting,_this.opt.tree.extend)
                }
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
                    var treeNode = _this.tree.getNodeByTId(e.target.parentNode.parentNode.id);
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
                    var treeNode = _this.tree.getNodeByTId(e.target.parentNode.parentNode.id);
                    infoBox.confirm('确认删除节点 ' + treeNode.name +' ? 注意子文件及文件夹也将被删除并不可恢复。',okCallback);
                    function okCallback() {
                        var postData = [{
                            'id': [treeNode['_id']],
                            'type': treeNode['baseType']
                        }];
                        WebAPI.post('/iot/delIotInfo', postData).done(function () {
                            var nodes = _this.tree.getNodesByParam('_id', $(e.target.parentNode.parentNode).attr('ptid'));
                            for (var i = 0; i < nodes.length; i++) {
                                _this.tree.removeNode(nodes[i]);
                            }
                            if (typeof _this.opt.tree.tool.delete == 'function') {
                                _this.opt.tree.tool.delete.call(_this, treeNode)
                            }
                        });
                    }
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
                        });
                    //});
                    $modal.on('hidden.bs.modal',function(){
                        $modalContent.remove();
                    })
                });
                _this.$paneTree.on('click','.projects>.button.switch',function(e){
                    var $target = $(e.currentTarget);
                    var node = _this.tree.getNodeByTId($target.parent().attr('id'));
                    //node.open = !node.open;
                    _this.childAppend(node,function(){});
                    return false;
                });
                _this.$paneTree.on('click','.groups>.button.switch',function(e){
                    var $target = $(e.currentTarget);
                    var node = _this.tree.getNodeByTId($target.parent().attr('id'));
                    //node.open = !node.open;
                    _this.childAppend(node,function(){});
                    return false;
                });
                function diyParam(treeNode){
                    return {
                        parent: [{
                            id: treeNode['_id'],
                            type: treeNode['baseType']
                        }]
                    }
                }

                function dataFilter(treeId, parentNode, resultData){
                    for (var type in resultData.class) {
                        for (var cls in resultData.class[type]) {
                            _this.dictClass[type][cls] = resultData.class[type][cls]
                        }
                    }
                    _this.initClassPane();
                }
                function addDiyDom(treeId,treeNode){
                    var $target = $('#' + treeNode.tId);
                    $target.attr('ptId',treeNode['_id']);
                    $target.addClass(treeNode.baseType);
                    if (treeNode.baseType == 'groups' || treeNode.baseType == 'things') {
                    //    $target.append('\
                    //<span class="btnEdit btnTreeNode glyphicon glyphicon-edit"></span>\
                    //<span class="btnDelete btnTreeNode glyphicon glyphicon-remove-sign"></span>\
                    //<span class="btnTemplate btnTreeNode glyphicon glyphicon-comment"></span>\
                    //');
                        $target.children('a').append('\
                    <span class="btnDelete btnTreeNode glyphicon glyphicon-remove-sign"></span>\
                    <span class="btnEdit btnTreeNode glyphicon glyphicon-edit"></span>\
                    ');
                    }
                    if (_this.opt.tree.drag && _this.opt.tree.drag.enable){
                        $target.attr('draggable',true);
                        if (_this.opt.tree.drag.dragstart) {
                            attachDragEvent('dragstart',$target,treeNode);
                        }
                        if (_this.opt.tree.drag.dragend) {
                            attachDragEvent('dragend',$target.children('a'),treeNode);
                        }
                        if (_this.opt.tree.drag.drop) {
                            attachDragEvent('dragover',$target.children('a'),treeNode);
                            attachDragEvent('dragleave',$target.children('a'),treeNode);
                            attachDragEvent('drop',$target.children('a'),treeNode);
                        }
                    }
                    if (typeof _this.opt.tree.event.addDom == 'function'){
                        _this.opt.tree.event.addDom.call(_this,treeNode,$target);
                    }

                }
                function addHoverDom(treeId,treeNode){
                    if(treeNode.isParent)return;
                    var $target = $('#' + treeNode.tId);
                    $target.css({
                        'background-color': 'rgb(76, 100, 148)'
                    });
                    $target.children('a').css('color','black');
                }
                function removeHoverDom(treeId,treeNode){
                    if(treeNode.isParent)return;
                    var $target = $('#' + treeNode.tId);
                    $target.css({
                        'background-color':'transparent'
                    });
                    $target.children('a').css('color','inherit');
                }
                function attachDragEvent(type,target,treeNode){
                    if (type == 'dragover' || type== 'dragleave'){
                        target.on(type,function (e) {
                            e.preventDefault();
                            _this.opt.tree.drag[type] && _this.opt.tree.drag[type].call(_this,e,treeNode);
                        });
                        return ;
                    }
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
            var _this = this;
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
        getChildren:function(treeNode,func,opt){
            var _this = this;
            var postData = {
                parent: [{
                    id: treeNode['_id'],
                    type: treeNode['baseType']
                }]
            };
            return WebAPI.post('/iot/search', postData).done(function (resultData) {
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
                                //_this.store[ele][j] = resultData[ele][i];
                                break;
                            }
                        }
                        if (resultData[ele][i].icon) {
                            resultData[ele][i].iconSkin = 'iconfont '+resultData[ele][i].icon;
                            delete resultData[ele][i].icon;
                        }
                                if (_this.opt.tree.base.expandReload || !flag) {
                                    if (ele == 'groups' || ele == 'projects') {
                                        resultData[ele][i].isParent = true;
                                    }
                                    resultData[ele][i].baseType = ele;
                                    //resultData[ele][i].open = true;
                                    if (!flag) {
                                        _this.store[ele].push(resultData[ele][i]);
                                    }
                                    tempArr.push(resultData[ele][i]);
                                }
                    }
                }
                if(_this.opt.tree.base.expandReload){
                    _this.tree.removeChildNodes(treeNode);
                }
                if (tempArr.length == 0) {
                    func(resultData);
                    //_this.tree.expandNode(treeNode);
                    return;
                }
                if (!opt || opt.add !== false){
                    _this.tree.addNodes(treeNode, tempArr, true);
                }
                if(!opt || opt.expand !== false){
                    _this.tree.expandNode(treeNode,null,false,true,true);
                }
                //_this.tree.expandNode(treeNode);
                _this.initClassPane();
                func(resultData);
                //_this.initTreePane(_this.store,treeNode)
            })
        },
        childAppend:function(treeNode,func){
            var _this = this;
            if(treeNode.open){
                _this.tree.expandNode(treeNode,null,false,true,true);
                return;
            }else {
                if(treeNode.baseType == 'things') {
                    func();
                    _this.tree.expandNode(treeNode,null,false,true,true);
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
                                if (_this.opt.tree.base.expandReload || !flag) {
                                    if (ele == 'groups' || ele == 'projects') {
                                        resultData[ele][i].isParent = true;
                                    }
                                    resultData[ele][i].baseType = ele;
                                    //resultData[ele][i].open = true;
                                    if (!flag) {
                                        _this.store[ele].push(resultData[ele][i]);
                                    }
                                    tempArr.push(resultData[ele][i]);
                                }
                            }
                        }
                        if(_this.opt.tree.base.expandReload){
                            _this.tree.removeChildNodes(treeNode);
                        }
                        if (tempArr.length == 0) {
                            func();
                            _this.tree.expandNode(treeNode,null,false,true,true);
                            return;
                        }
                        _this.tree.addNodes(treeNode, tempArr, true);
                        for (var base in _this.showStatus){
                            _this.initTreeData({'type':base,'val':_this.showStatus[base]});
                        }
                        _this.tree.expandNode(treeNode,null,false,true,true);
                        _this.initClassPane();
                        func();
                        //_this.initTreePane(_this.store,treeNode)
                    })
                }
            }
        },
        initAddPane:function(){
            var _this = this;
            _this.$paneAdd = $('#paneIotAdd');
            var $btnAdd = $('.btnAddEle');
            $btnAdd.click(function(e){
                var parentNode = _this.tree.getSelectedNodes()[0];
                var callBack;
                if (typeof _this.opt.tree.tool.beforeAdd == 'function'){
                    callBack = _this.opt.tree.tool.beforeAdd.call(_this,parentNode)
                }
                if (typeof _this.opt.tree.tool.beforeAdd.act == 'function'){
                    callBack = _this.opt.tree.tool.beforeAdd.act.call(_this,parentNode)
                }
                if(callBack && callBack.parentNode){
                    parentNode = callBack.parentNode;
                }
                //if (_this.opt.tree.tool.beforeAdd.default || typeof _this.opt.tree.tool.beforeAdd == 'function') {
                    if (parentNode.length == 0) {
                        alert('请选择父节点');
                        return;
                    }
                    if(callBack && callBack.isForbid){
                        alert(callBack.msg);
                        return;
                    }
                    new CreateDeviceModal({
                        mode: 'add',
                        baseType: $(e.currentTarget).attr('typeAdd'),
                        filter: _this,
                        parentNode: parentNode
                    });
                //}
            });
        }
    };
    return HierFilter;
})();
