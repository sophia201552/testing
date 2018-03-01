;
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([
            'exports',
            '../core/model.js',
            '../core/Event.js',
            'Inferno',
            '/static/scripts/dataManage/dm.tag.tree.js'

        ], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(
            exports,
            require('../core/model.js'),
            require('../core/Event.js'),
            require('Inferno'),
            require('/static/scripts/dataManage/dm.tag.tree.js')
        );
    } else {
        factory(
            root,
            namespace('beop.strategy.core.Model'),
            namespace('beop.strategy.core.Event'),
            namespace('Inferno'),
            namespace('beop.tag.tree')
        );
    }
}(namespace('beop.strategy.components.EquipTree'), function(
    exports,
    Model,
    Event,
    Inferno,
    TagTree
) {

    var h = Inferno.h;

    function Index(container, options) {
        if (typeof container === 'string') {
            this.container = document.querySelector(container);
        } else {
            this.container = container;
        }

        this.options = options || {};
        this.store = this.options.store || {};

        this.init();
    }

    var model, state, view, theme, actions;
    // child components
    var child;
    // PROTOTYPES
    +function() {
        /**
         * Constructor
         */
        this.constructor = Index;

        /**
         * initialize app
         */
        this.init = function() {
            view.container = this.container;
            model = new Model(this.modelBLCProcessing.bind(this), state, this.getInitialStore(), state.nap);
            actions.present = model.present.bind(model);

            model.subscribe(function (state) {
                state.render(model.getStore());
            });
        };

        this.getInitialStore = function () {
            return {
                // 是否在右侧显示子设备的策略
                isShowSubEquipStrategy: false,
                // 是否在 tree 中显示策略叶子节点
                isShowStrategy: false,
                // 选中的设备id
                selectedEquipIds: [],
                // 设备树的数据
                data: []
            };
        };

        this.modelBLCProcessing = function (store, dataset) {
            if (typeof dataset.isShowSubEquipStrategy !== 'undefined') {
                store.isShowSubEquipStrategy = dataset.isShowSubEquipStrategy;
            }
            if (typeof dataset.isShowStrategy !== 'undefined') {
                store.isShowStrategy = dataset.isShowStrategy;
            }
            if (typeof dataset.selectedEquipIds !== 'undefined') {
                store.selectedEquipIds = dataset.selectedEquipIds;
            }
            return store;
        };

        this.show = function() {
            model.updateState();
        };

        this.close = function() {
            child && child.close();
            child = null;
        };

    }.call(Index.prototype);

    // state
    (function () {
        state = {
            bindModel: function () {
                return this;
            },
            nap: function () {
                return function () {
                    return undefined;
                }
            },
            ready: function () {
                return true;
            },
            representation: function (model) {
                var representation = 'something was wrong!';
                if (this.ready()) {
                    representation = view.ready(model);
                }
                view.display(representation) ;
            },
            render: function (model) {
                this.representation(model);
            }
        };
    }());

    // view
    (function () {
        view = {
            container: null,
            ready: function (model,actions) {
                return (
                    h('div.equipTreeBox',[
                        theme.topBox(),
                        h('.equipTreeContent.gray-scrollbar', [
                            h('#equipTreeCtn.ztree'),
                            theme.bottomBox(model.isShowSubEquipStrategy, model.isShowStrategy)
                        ])
                    ])
                );
            },
            display: function (representation) {
                Inferno.render(representation, this.container);
                this.renderTree();
            },
            generateTreeEx:function (data,rt){
                var _this = this;
                if(data){
                    var result = rt || [];
                    var param;
                    data.forEach(function(item){
                        param ={id:item._id,name:item.name,pId:item.prt||''};
                        if(item.type === 'group'){
                            param.type = 'group';
                            param.isParent = true;
                        }
                        result.push(param);
                        if(item.children && item.children.length>0){
                            result = _this.generateTreeExChild(item.children,result);
                        }
                    });
                    return result;
                }
            },
            generateTreeExChild:function(data,rt){
                var _this = this;
                if(data){
                    var result = rt || [];
                    var param;
                    data.forEach(function(item){
                        param ={id:item._id,name:item.name,pId:item.prt||''};
                        if(item.type === 'group'){
                            param.type = 'group';
                            param.isParent = true;
                        }
                        result.push(param);
                        if(item.children && item.children.length>0){
                            result = _this.generateTreeEx(item.children,result);
                        }
                    });
                    return result;
                }
            },
            expendFirst:function(treeNode){
                if(treeNode.children){
                    this.treeObj.expandNode(treeNode.children[0], true, false, true, true);
                    this.expendFirst(treeNode.children[0]);
                }
            },
            renderTree: (function () {

                function getTreeRootData(projectList){
                    if(projectList){
                        var result = [];
                        var param;
                        projectList.forEach(function(item){
                            param ={id:item.id,name:item.name_cn,pId:0,isParent:true};
                            result.push(param);
                        });
                        return result;
                    }
                }

                function zTreeOnClick(event, treeId, treeNode){

                }

                function zTreeOnNodeCreated (event, treeId, treeNode){
                    var $span_switch = $('#'+ treeNode.tId + '_switch');
                    $span_switch.prependTo($('#'+ treeNode.tId + '_a'));
                    $span_switch.closest('a').addClass('cursorDefault');
                }

                function zTreeOnExpand(event, treeId, treeNode){
                    var _this = this;
                    //var Spinner = new LoadingSpinner({ color: '#666',length:4,width:1,radius:3,lines:9,left:'8%'});
                    if(treeNode.level === 0 && !treeNode.children) {
                    //    WebAPI.post('/tag/getThingTree', {
                    //        'projId': treeNode.id,
                    //        'isOnlyGroup': true
                    //    }).done(function(result){
                    //        if(result.success){
                    //            var newNodes = _this.generateTreeEx(result.data);
                    //            _this.treeObj.addNodes(treeNode, newNodes);
                    //        }
                    //    })
                    //}
                        var data = [{
                            _id: '586f2659ae440a47b42732bd',
                            name: 'HVAC',
                            type: 'group',
                            children: [{
                                _id: '586f2659ae440a47b42732be',
                                name: 'AHU',
                                type: 'group',
                                prt: '586f2659ae440a47b42732bd',
                                children: [{
                                    _id: '586f2659ae440a47b42732bg',
                                    prt: '586f2659ae440a47b42732be',
                                    name: 'VAV_A_11_01',
                                    type: 'group',
                                    children: [{
                                        _id: '586f2659ae440a47b42732bl',
                                        prt: '586f2659ae440a47b42732bg',
                                        name: 'VAV（变风量）诊断策略'
                                    }, {
                                        _id: '586f2659ae440a47b42732bm',
                                        prt: '586f2659ae440a47b42732bg',
                                        name: '房间温度预处理策略'
                                    }, {
                                        _id: '586f2659ae440a47b42732bn',
                                        prt: '586f2659ae440a47b42732bg',
                                        name: '房间温度自动设定策略'
                                    }]
                                }, {
                                    _id: '586f2659ae440a47b42732bh',
                                    prt: '586f2659ae440a47b42732be',
                                    name: 'VAV_A_11_02',
                                    type: 'group'
                                }, {
                                    _id: '586f2659ae440a47b42732bi',
                                    prt: '586f2659ae440a47b42732be',
                                    name: 'VAV_A_11_03',
                                    type: 'group'
                                }, {
                                    _id: '586f2659ae440a47b42732bk',
                                    prt: '586f2659ae440a47b42732be',
                                    name: 'VAV_A_11_04',
                                    type: 'group'
                                }]
                            }, {
                                _id: '586f2659ae440a47b42732bo',
                                prt: '586f2659ae440a47b42732bf',
                                type: 'group',
                                name: 'Chilter'
                            }]
                        }];
                        var newNodes = this.generateTreeEx(data);
                        _this.treeObj.addNodes(treeNode, newNodes);
                        if(treeNode.tId === 'equipTreeCtn_1'){
                            this.expendFirst(treeNode);
                        }
                    }
                }

                return function () {
                    var zSetting = {
                        view: {
                            showIcon:false,
                            showLine: false,
                            fontCss: {
                                color: "#cadee5"
                            }
                        },
                        edit: {
                            enable: false,
                            editNameSelectAll: true,
                            showRenameBtn: false,
                            showRemoveBtn: false
                        },
                        data: {
                            keep:{
                                leaf: true,
                                parent: true
                            },
                            simpleData: {
                                enable: true,
                                idKey: 'id',
                                pIdKey: 'pId',
                                rootPId: ''
                            }
                        },
                        callback: {
                            onClick: zTreeOnClick,
                            onNodeCreated: zTreeOnNodeCreated,
                            onExpand: zTreeOnExpand.bind(this)
                        }
                    };
                    var zProjNodes = getTreeRootData(AppConfig.projectList);
                    var obj = $(this.container).find('#equipTreeCtn');
                    this.treeObj = $.fn.zTree.init(obj, zSetting, zProjNodes);
                    //默认展开
                    this.treeObj.expandNode(this.treeObj.getNodesByParam("tId", "equipTreeCtn_1")[0], true, false, true, true);
                };
            }())
        };

        theme = {
            topBox:function(){
                return (
                    h('.input-group.divSearch',[
                        h('input',{
                            class:'form-control iptSearch',
                            type:'text'
                        }),
                        h('span.spanSearch',[
                            h('span',{
                                class:'glyphicon glyphicon-search',
                                'aria-hidden':'true'
                            })
                        ])
                    ])
                )
            },
            bottomBox: function (isShowSubEquipStrategy, isShowStrategy) {
                var showAllStrategy = isShowSubEquipStrategy ? 'active' : '' ;
                var showTreeStategy = isShowStrategy ? 'active' : '' ;
                return (
                    h('.bottomBox', [
                        h('div', {
                            class: 'showAllStrategy ' + showAllStrategy,
                            onclick: function () {
                                actions.showAllStrategy({target: this});
                            }
                        }, '显示所有子策略')
                    ])
                );
            }
        };

    }());

    // actions
    (function () {
        actions = {
            present: null,
            showAllStrategy: function(data, present){
                var target,rs;
                present = present || this.present ;
                target = data.target;
                if($(target).hasClass("active")){
                    rs = {
                        isShowSubEquipStrategy: false
                    }
                }else{
                    rs = {
                        isShowSubEquipStrategy: true
                    }
                }
                present(rs);
            },

            showTreeStategy: function(data,present) {
                var target,rs;
                present = present || this.present ;
                target = data.target;
                if($(target).hasClass("active")){
                    rs = {
                        isShowStrategy: false
                    }
                }else{
                    rs = {
                        isShowStrategy: true
                    }
                }
                present(rs);
            }
        };

        exports.actions = actions;
    }());

    exports.Index = Index;
}));