var TagTree = (function(){
    function TagTree(screen,container,option){
        this.screen = screen;
        this.container = container;
        this.option = option;
        this.settting = undefined;

        this.async = [];
        this.instance = undefined;
        this.store = [];
        this.$initPromise = $.Deferred();
        this.init();
    }
    TagTree.prototype = {
        onNodeCreated:function(e, treeId, treeNode) {
            
            // treeNode.config = {
            //     'energy':'57e1edf6833c974ea4f43a3c',
            //     'cost' :'57b6a4e4833c9749a498c523',
            //     'power':'57a98db41c95477ae88f694c',
            //     'detail':[
            //         {'name':'Ia','point':'57a98db41c95477ae88f694c'},
            //         {'name':'Ib','point':'57a98db41c95477ae88f694c'},
            //         {'name':'Ic','point':'57a98db41c95477ae88f694c'},
            //         {'name':'ua','point':'57a98db41c95477ae88f694c'},
            //         {'name':'ub','point':'57a98db41c95477ae88f694c'},
            //         {'name':'uc','point':'57a98db41c95477ae88f694c'},
            //         {'name':'uab','point':'57a98db41c95477ae88f694c'},
            //         {'name':'ucb','point':'57a98db41c95477ae88f694c'},
            //         {'name':'uac','point':'57a98db41c95477ae88f694c'},
            //         {'name':'fac','point':'57a98db41c95477ae88f694c'},
            //         {'name':'energy','point':'57a98db41c95477ae88f694c'}
            //     ]
            // }
        },
        onNodeClick:function(event, treeId, treeNode, flag) {
            if(flag == 0){
                this.cancelGroup(treeNode);
            }
            this.instance.expandNode(treeNode)
            let selectedNodes = this.instance.getSelectedNodes();
            this.screen.onNodeClick && this.screen.onNodeClick(selectedNodes)
        },
        cancelGroup:function(treeNode) {
            if(!treeNode.isParent){
                return;
            }
            treeNode.children.forEach(node=>{
                this.instance.cancelSelectedNode(node);
                this.cancelGroup(node);
            });
        },
        // addHideIdSet:function(children,idSet,isNeedAdd=false) {
        //     children.forEach(c=>{
        //         if(isNeedAdd){
        //             idSet.add(c.id);
        //         }
        //         if(c.isParent && c.children){
        //             this.addHideIdSet(c.children, idSet, true);
        //         }
        //     });
        // },
        // selectGroup:function(treeNodes, idSet) {
        //     let activeEntities = [];
        //     treeNodes.forEach(node=>{
        //         if(!idSet.has(node.id)){
        //             activeEntities.push(node);
        //         }
        //     });
        //     return activeEntities;
        // },
        init:function(){
            var _this = this;
            this.initSetting();
            this.async.push(this.getData())
            this.async.push(this.getConfigData())
            $.when(...this.async).done((data,config)=>{
                _this.initTagTree(config);
            }).always(()=>{
                this.async = [];
            });
        },
        initSetting:function(){
            this.setting={
                view:{
                    addDiyDom: null,
                    showLine: false,
                    dblClickExpand: false,
                    autoCancelSelected: true,
                    showIcon: true,
                },
                data:{
                    keep:{
                        leaf: true,
                        parent: true
                    },
                    simpleData:{
                        enable: true,
                        pIdKey: 'parent'
                    }
                },
                edit:{
                    enable: true,
                    showRemoveBtn: false,
                    showRenameBtn: false,
                },
                callback:{
                    onNodeCreated: this.onNodeCreated.bind(this),
                    onClick: this.onNodeClick.bind(this)
                }
            }
        },
        getData:function() {
            return $.get('/diagnosis_v2/getEntities',{"projectId": this.option.projectId}).done(rs=>{
                if(rs && rs.status=='OK'){
                    this.store = rs.data;
                }
            })
            // return $.get('/tag/energyConfig/'+ this.option.projectId).done(rs=>{
            //     if(rs && rs.status=='OK'){
            //         this.store = rs.data;
            //     }
            // })
        },
        getConfigData:function() {
            return this.screen.getNodeConfig()
            // return $.get('/tag/energyConfig/'+ this.option.projectId).done(rs=>{
            //     if(rs && rs.status=='OK'){
            //         this.store = rs.data;
            //     }
            // })
        },
        initTagTree:function(configData){
            let $wrap = $(this.container).find('.itemList');
            if($wrap.length == 0){
                $wrap=$(`<ul id="${+new Date()}" class="itemList ztree"></ul>`)
                $(this.container).append($wrap)
            }
            let parentIdSet = new Set();
            this.store.forEach((v)=>{
                parentIdSet.add(v.parent);
            });
            this.store.forEach((v)=>{
                if (configData instanceof Array){
                    for (var j = 0 ; j < configData.length ;j++){
                        if (configData[j].entityId == v.id){
                            v.config = configData[j]
                            break;
                        }
                    }
                }
                if(parentIdSet.has(v.id)){
                    v.iconSkin = `id_${v.id} iconfont icon-xiayiji none`;
                }else{
                    v.iconSkin = `id_${v.id} no-icon none`;
                }
            });
            this.instance = $.fn.zTree.init($wrap, this.setting, this.store);
            this.$initPromise.resolve();
        },
        getRootNode:function(){

        },
        getChildNode:function(node){
            var point = node
            if (typeof point == 'undefined'){
                point = this.screen.store[0]
            }
            if(point && point.hasOwnProperty('id')){
                return this.instance.getNodesByParam('parent',point['id'])
            }else{
                return [];
            }
        },
        attachEvent:function(){

        },
        destory:function(){

        }
    }
    return TagTree
}())