var IotFilter = (function () {
    function IotFilter(screen,ctn,opt) {
        this.screen = screen;
        this.ctn = ctn;
        this.$ctn = $(this.ctn);

        this.body = undefined;
        this.spinner = undefined;
        this.opt = opt?opt:{};

        this.store = {};
        this.dictClass = {};

        this.indexTree = undefined;
    }

    IotFilter.prototype = {
        defaultOpt:{
            content:['search','selFilter','tabFilter','indexTree','toolBar'],
            module:{
                search:{
                    type:'search'
                },
                selFilter:{
                    type:'selFilter',
                    content:['groups','things'],
                    option:{
                        'groups':{
                            type:'groups'
                        },
                        'things':{
                            type:'things'
                        },
                        'projects':{
                            type:'projects'
                        }
                    }
                },
                tabFilter:{
                    type:'tabFilter'
                },
                indexTree:{
                    type:'indexTree'
                },
                toolBar:{
                    type:'toolBar'
                }
            },
            theme:null,
            projId:null,
            id:null
        },
        init: function () {
            var _this = this;
            _this.initOpt();
            WebAPI.get("/static/scripts/iot/iotFilter.html").done(function (resultHtml) {
                _this.$ctn.append(resultHtml);
                _this.body = _this.ctn.querySelector('.panelBody');
                _this.initTheme();
                $.when(
                    WebAPI.get('/iot/getClassFamily/group/cn'),
                    WebAPI.get('/iot/getClassFamily/thing/cn'),
                    WebAPI.get('/iot/getClassFamily/project/cn')
                ).done(function(groups,things,projects){
                        _this.dictClass['groups'] = groups[0];
                        _this.dictClass['things'] = things[0];
                        _this.dictClass['projects'] = projects[0];
                        _this.initModule();
                    });
            });
        },

        initOpt:function(){
            this.opt = $.extend(true,{},this.defaultOpt,this.opt);
        },
        initTheme:function(){
            if(this.opt.theme){
                this.$ctn.addClass('theme-' + this.opt.theme);
            }
        },
        destroy: function () {
            this.store = undefined;
            this.$ctn.html('');
        },

        initModule: function () {
            var module,opt;
            for(var i = 0; i < this.opt.content.length ;i++){
                module = this.opt.content[i].type?this.opt.content[i].type:this.opt.content[i];
                opt = this.opt.content[i].opt?this.opt.content[i].opt:{};
                switch (module){
                    case 'search':
                        this.initSearchModule(opt);
                        break;
                    case 'selFilter':
                        this.initSelFilterModule(opt);
                        break;
                    case 'tabFilter':
                        this.initTabFilterModule(opt);
                        break;
                    case 'indexTree':
                        this.initIndexTreeModule(opt);
                        break;
                    case 'toolBar':
                        this.initToolBarModule(opt);
                        break;
                    default :
                        break;
                }
            }
        },

        initSearchModule:function(option){
            var opt = $.extend(true,{},this.opt.module.search,option);
            var dom = document.createElement('div');
            dom.className = 'divIotModule divSearch';

            //var label = document.createElement('label');
            //label.className = 'labelSearch';
            //label.textContent = '搜索：';

            var ipt = document.createElement('input');
            ipt.className = 'iptSearch form-control';
            ipt.setAttribute('type','text');
            ipt.setAttribute('placeholder','搜索');

            var btn = document.createElement('span');
            btn.className = 'iconSearch glyphicon glyphicon-search form-control-feedback';

            //dom.appendChild(label);
            dom.appendChild(ipt);
            dom.appendChild(btn);
            this.body.appendChild(dom);
        },

        initSelFilterModule:function(option){
            var opt = $.extend(true,{},this.opt.module.selFilter,option);
            var dom = document.createElement('div');
            dom.className = 'divIotModule divSelFilter';

            //var label = document.createElement('label');
            //label.className = 'labelSearch';
            //label.textContent = '筛选';
            //
            //dom.appendChild(label);
            for (var i = 0 ;i < opt.content.length ;i++){
                dom.appendChild(this.createSelFilter(opt.option[opt.content[i]]));
            }

            this.body.appendChild(dom);
        },
        initTabFilterModule:function(option){
            var opt = $.extend(true,{},this.opt.module.tabFilter,option);
            var dom = document.createElement('div');
            dom.className = 'divIotModule divTabFilter';

            var tabDom;
            for (var i = 0 ;i < opt.content.length ;i++){
                tabDom = document.createElement('div');
                tabDom.className = 'divTabBox';
                tabDom.textContent = opt.option[opt.content[i]].name;
                tabDom.dataset.type = opt.option[opt.content[i]].type;

                dom.appendChild(tabDom);
            }

            var _this = this;
            $(dom).off('click').on('click','.divTabBox',function(e){
                var $target = $(e.currentTarget);
                if($target.hasClass('focus'))return;
                _this.$ctn.find('.divTabBox.focus').removeClass('focus');
                $target.addClass('focus');
                opt.option[$target[0].dataset.type].click();
            });
            this.body.appendChild(dom);
        },
        initIndexTreeModule:function(option){
            var opt = $.extend(true,{},this.opt.module.selFilter,option);
            var dom = document.createElement('div');
            dom.className = 'divIotModule divIndexTree';
            dom.id = this.opt.id?(this.opt.id + 'IndexTree'):'iotFilterIndexTree';

            this.body.appendChild(dom,option);

            this.initIndexTree(dom);
        },
        initIndexTree:function(ctn){
            var _this = this;
            if(this.opt.module.indexTree.event.beforeInit && this.opt.module.indexTree.event.beforeInit() === false){
                return;
            }
            var postData = {
                parent:[],
                projId:[this.opt.projId?this.opt.projId:null]
            };
            WebAPI.post('/iot/search', postData).done(function (resultData) {
                _this.store = {
                    groups: resultData.groups,
                    projects: resultData.projects,
                    things: resultData.things
                };
                for (var i = 0; i < _this.store.groups.length; i++) {
                    _this.store.groups[i].isParent = true;
                    _this.store.groups[i].baseType = 'groups';
                }
                for (var i = 0; i < _this.store.projects.length; i++) {
                    _this.store.projects[i].isParent = true;
                    _this.store.projects[i].baseType = 'projects';
                }
                for (var i = 0; i < _this.store.things.length; i++) {
                    _this.store.things[i].baseType = 'things';
                }
                _this.renderIndexTree(ctn);
                _this.opt.module.indexTree.event.afterInit && _this.opt.module.indexTree.event.afterInit()
            });
        },
        renderIndexTree:function(ctn){
            var _this = this;
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
                    enable: true
                },
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
                    addDiyDom:function(treeId,node){
                        _this.opt.module.indexTree.event.onNodeRender && _this.opt.module.indexTree.event.onNodeRender(node);
                    },
                    addHoverDom:function(){},
                    removeHoverDom:function(){},
                    dblClickExpand:false,
                    showIcon:true,
                    showLine:true
                },
                callback: {
                    beforeRename: function () {
                        return false;
                    },
                    beforeRemove: function () {
                    },
                    beforeDrag: function () {
                        return false;
                    },
                    beforeAsync: function () {

                    },
                    onAsyncSuccess: function () {

                    },
                    onDblClick: function (event, treeId, treeNode) {
                        console.log('dblClick');
                    },
                    onClick: function (event, treeId, treeNode) {
                        var $target = $('#' + treeNode.tId);
                        if($target.hasClass('focus')){
                            $target.removeClass('focus')
                        }else {
                            $('[treeNode]').removeClass('focus');
                            $target.addClass('focus');
                        }
                        _this.opt.module.indexTree.event.onClick && _this.opt.module.indexTree.event.onClick(event,treeNode);
                    }
                }
            };
            var data = [].concat(this.store.projects,this.store.groups,this.store.things);
            _this.indexTree = $.fn.zTree.init($(ctn), setting, data);
        },

        getChildrenNode:function(treeNode,opt){
            var _this = this;
            var postData = {
                parent: [{
                    id: treeNode['_id'],
                    type: treeNode['baseType']
                }]
            };
            WebAPI.post('/iot/search', postData).done(function (resultData) {
                Object.keys(resultData).forEach(function(type){
                    if(type == 'class')return;
                    for (var i = 0; i < resultData[type].length;i++){
                        resultData[type][i].baseType = type;
                        if(opt.hide)resultData[type][i].isHidden = true;
                        _this.store[type].push(resultData[type][i])
                    }
                });
                opt.callback && opt.callback();
            })
        },
        updateIndexTree:function(){

        },
        initToolBarModule:function(){

        },
        createSelFilter:function(opt){
            var _this = this;
            var select = document.createElement('select');
            select.dataset.type = opt.type;
            select.className = 'form-control';
            var selOpt = [{
                value:'all',
                name:I18n.resource.iot.TREE_ALL
            },
            {
                value:'none',
                name:I18n.resource.iot.TREE_HIDE
            }];
            if (this.dictClass[opt.type]){
                Object.keys(this.dictClass[opt.type]).forEach(function(cls){
                    if(['Group','Thing'].indexOf(cls)> -1)return;
                    selOpt.push({
                        value:cls,
                        name:_this.dictClass[opt.type][cls].name
                    })
                })
            }else if(opt.option instanceof Array){
                if(opt.needDefaultSel){
                    selOpt = selOpt.concat(opt.option);
                }else{
                    selOpt = opt.option;
                }
            }
            var option;
            for (var i = 0 ; i < selOpt.length ;i++){
                option = new Option(selOpt[i].name,selOpt[i].value);
                select.add(option)
            }
            return select
        }
    };
    return IotFilter;
})();