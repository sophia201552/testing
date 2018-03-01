;
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([
            'exports',
            '../core/model.js',
            '../core/Event.js',
            'Inferno',
        ], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(
            exports,
            require('../core/model.js'),
            require('../core/Event.js'),
            require('Inferno')
        );
    } else {
        factory(
            root,
            namespace('beop.strategy.core.Model'),
            namespace('beop.strategy.core.Event'),
            namespace('Inferno')
        );
    }
}(namespace('beop.strategy.components.VariablePanel'), function(
    exports,
    Model,
    Event,
    Inferno
) {

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
    var h = Inferno.h;
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

            actions.init(model.present.bind(model));
            model.subscribe(function (state) {
                state.render(model.getStore());
            });
            
        };

        this.getData = function () {
            var store = model.getStore();
            
            return {
                input: store.inputItms,
                output: store.outputItems
            };
        };

        this.getInitialStore = function () {
            return {
                isInput: true,
                inputItms: this.store.input || [],
                outputItems: this.store.output || [],
                modulesOutputList: [],
                errorInfo:[]
            };
        };  

        this.hasError = function (store, dataset, nameArr) {
            var reg= /^[A-Za-z]+$/;
            if(dataset.value === ''){//判断是否是 空
                var obj = {
                    type: '变量名不能为空',
                    index: dataset.index
                }
                store.errorInfo.push(obj);

            }else if( dataset.value.charAt(0) !== '_'  && !reg.test(dataset.value.charAt(0)) ){//判断开始是否是 _ 和 字母
                var obj = {
                    type: '变量名必须是以 _ 或者 字母开头',
                    index: dataset.index
                }
                store.errorInfo.push(obj);
            }else if(nameArr.indexOf(dataset.value) !== -1){//判断重名否
                var obj = {
                    type: '变量名重复',
                    index: dataset.index
                }
                store.errorInfo.push(obj);  
            }else{
                var arr = [];
                for(var i=0,length=store.errorInfo.length;i<length;i++){
                    if(store.errorInfo[i] !== dataset.index){
                        arr.push(store.errorInfo[i]);
                    }
                }
                store.errorInfo = arr;

            }
            return store.errorInfo;
        }
        this.modelBLCProcessing = function (store, dataset) {
            if (typeof dataset.init !== 'undefined') {
                store.items = dataset.data;
            }

            var nameArr = [],actualItems=[];
            if(store.isInput){
                actualItems = store.inputItms;
            }else{
                actualItems = store.outputItems;
            }
            for(var i=0,length=actualItems.length;i<length;i++){
                nameArr.push(actualItems[i].name);
            }

            if(typeof dataset.type !== 'undefined'){

                if (dataset.type === 'updateModulesOutputList') {
                    store.modulesOutputList = dataset.data.list;
                    return store;
                }

                if (dataset.type === 'selectOtherModuleOutput') {
                    var findItem, mId;
                    actualItems.some(function (row, i) {
                        if (i === dataset.index) {
                            findItem = actualItems[i];
                            return true;
                        }
                    });

                    if (!dataset.data) {
                        findItem['refId'] = '';
                        findItem['name'] = '';
                        findItem['default'] = '';
                    } else {
                        findItem['refId'] = dataset.data.moduleId;
                        findItem['name'] = dataset.data.paramName;
                        store.modulesOutputList.some(function (row) {
                            if (row._id === dataset.data.moduleId) {
                                row.output.forEach(function (o) {
                                    if (o.name === dataset.data.paramName) {
                                        findItem['default'] = o.default;
                                    }
                                });
                            } 
                        });
                    }
                }

                //删除
                if(dataset.type === 'remove'){
                    var arr = [];
                    for(var i =0,length=actualItems.length;i<length;i++){
                        if(i !== dataset.index){
                            arr.push(actualItems[i]);
                        }
                    }
                    actualItems = arr;
                }
                //新增
                if(dataset.type === 'add'){
                    if(actualItems.length === 0){
                        actualItems.push(dataset.data);
                    }else{
                        actualItems.push(dataset.data);
                        if(nameArr.indexOf(dataset.data.name) !== -1){
                            var obj = {
                                type: '重名',
                                index: actualItems.length-1
                            }
                            store.errorInfo.push(obj);
                        }
                    }
                }
                //切换tab
                if(dataset.type === 'switchTab'){
                    if(dataset.index === 0){
                        store.isInput = true;
                        actualItems = store.inputItms;
                    }else{
                        store.isInput = false;
                        actualItems = store.outputItems;
                    }
                }
                //update
                if(dataset.type === 'update'){
                    for(var i=0,length=actualItems.length;i<length;i++){
                        if(i === dataset.index){
                            actualItems[i][dataset.name] = dataset.value;
                            break;
                        }
                    }
                    if(dataset.name === 'name'){//名字判断是否有误
                        var arr = [];
                        for(var i=0,length=store.errorInfo.length;i<length;i++){
                            if(store.errorInfo[i].index !== dataset.index){
                                arr.push(store.errorInfo[i]);
                            }
                        }
                        store.errorInfo = arr;
                        store.errorInfo = this.hasError(store, dataset, nameArr);
                    }
                }
                //选中 引用其他模块 
                if(dataset.type === 'updateType'){
                    for(var i=0,length=actualItems.length;i<length;i++){
                        if(i === dataset.index){
                            actualItems[i][dataset.name] = dataset.value;
                            if (dataset.value === 100) {
                                actualItems[i].refId = '';
                                actualItems[i].name = '';
                                actualItems[i].default = '';
                            }
                            break;
                        }
                    }
                }
                if (dataset.type === 'updateDs') {
                    actualItems.some(function (row, i) {
                        if (i === dataset.index) {
                            actualItems[i][dataset.name] = dataset.value;
                            return true;
                        }
                    });
                }
                //重新赋值
                if(store.isInput){
                    store.inputItms = actualItems;
                }else{
                    store.outputItems = actualItems;
                }
            }
            return store;
        };

        this.show = function() {
            var _this = this;

            Event.once('SEND_MODULES_OUTPUT_DATA.VariablePanel', function (type, data) {
                model.present({
                    type: 'updateModulesOutputList',
                    data: data
                });
            });
            Event.emit('QUERY_MODULES_OUTPUT_DATA', {
                exclude: [this.store.moduleId]
            });
        };

        this.close = function() {
            
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
                var representation = '';

                if (this.ready()) {
                    representation = view.ready(model,actions);
                    view.display(representation);
                }
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
                    h('div',[
                        theme.tabTitle(model.isInput),
                        h('div.variablesType',[
                            theme.toolBar(),
                            h('div.variables.gray-scrollbar.scrollable-y',[
                                    theme.variablesRender(model)
                                ])
                        ])
                    ])
                );
            },
            display: function (representation) {
                Inferno.render(representation,this.container);
            }
        };

        theme = {
            tabTitle: function (isInput) {
                var inputActive,outputActive;
                if(isInput){
                    inputActive = "active";
                    outputActive = ""
                }else{
                    inputActive = "";
                    outputActive = "active"
                }
                return (
                    h('ul.tabTitle',[
                        h('li',{class:inputActive,'data-index':"0",onclick:function(){actions.switchTab({target:this})}},['输入']),
                        h('li',{class:outputActive,'data-index':"1",onclick:function(){actions.switchTab({target:this})}},['输出'])
                    ])
                );
            },

            toolBar: function () {
                return (
                    h('.topBtn',[
                        h('span.glyphicon.glyphicon-plus',{onclick:function(){actions.clickAdd()}})
                    ])
                );
            },
        
            variablesRender: function (model) {
                if(model.isInput){
                    var variables = model.inputItms;
                }else{
                    var variables = model.outputItems;
                }
                var _this = this;
                var variableName,variableType,variableDefaultVal,variableDebug;
                var arr=[];

                return (
                    h('div', variables.map(function (row,i) {
                        return _this.singleVariable(row,i,model);
                    }))
                );
            },

            singleVariable: function(singleVariable,index,model){
                variableName = singleVariable.name;
                variableDebug = singleVariable.debug;
                var isShow = 'none',errorInformation;
                if(model.errorInfo.length !== 0){
                    for(var i=0,length=model.errorInfo.length;i<length;i++){
                        if(model.errorInfo[i].index === index){
                            errorInformation = model.errorInfo[i].type;
                            isShow = 'block';
                        }
                    }
                }
                var names,dataSourceLayout;
                var names = h('input',{
                                name:'name',
                                type:'text',
                                value:variableName,
                                oninput: function(e){
                                    actions.oninputVal({target:e.target})
                                }
                            });
                dataSourceLayout = h('input',{
                                name:'default',
                                type:'text',
                                value:singleVariable.default,
                                oninput: function(e){
                                    actions.oninputVal({target:e.target})
                                }
                            })
                var variableType;
                var dataSource='',
                    message='',
                    mail='',
                    num='';
                    str='';
                    time='';
                    json='';
                    otherModal='';
                switch(Number(singleVariable.type)){
                    case 0:
                        variableType = '数据源';
                        dataSource='true';
                        dataSourceLayout = h('div.dataSource', {
                            ondragover: function (e) {
                                e.preventDefault();
                            },
                            ondragEnter: function (e) {
                                e.preventDefault();
                            },
                            ondrop: function (e) {
                                var dsItemId = EventAdapter.getData().dsItemId;
                                if (AppConfig.datasource.currentObj === 'cloud') {
                                    var dragName = $('#tableDsCloud').find('tr[ptid="' + dsItemId + '"]').find('.tabColName').attr('data-value');
                                    var currentId = $('#selectPrjName').find('option:selected').val();
                                    if (currentId) {
                                        dragName = '@' + currentId + '|' + dragName;
                                    } else {
                                        dragName = dsItemId;
                                    }
                                    actions.onDropDs({target: e.currentTarget, ds: dragName});
                                } else {
                                    actions.onDropDs({target: e.currentTarget, ds: dsItemId});
                                }
                            }
                        }, singleVariable.default || [h('span.glyphicon.glyphicon-plus')])
                        break;
                    case 1:
                        variableType = '短信';
                        message='true';
                        break;
                    case 2:
                        variableType = '邮件';
                        mail='true';
                        break;
                    case 10:
                        variableType = '数值';
                        num='true';
                        break;
                    case 11:
                        variableType = '字符串';
                        str='true';
                        break;
                    case 12:
                        variableType = '时间';
                        time='true';
                        break;
                    case 13:
                        variableType = 'JSON';
                        json='true';
                        break;
                    case 100:
                        variableType = '引用其他模块';
                        otherModal='true';
                        names = h('select', {
                            name:'name',
                            value:variableName,
                            onChange: function (e) {
                                actions.selectOtherModuleOutput({target: e.currentTarget});
                            }
                        }, [
                            h('option', {
                                value: '',
                                selected: !singleVariable.refId
                            }, '请选择')
                        ].concat(model.modulesOutputList.map(function (m) {
                            return (
                                h('optgroup', {
                                    label: m.name
                                }, m.output.map(function (o) {
                                    return (
                                        h('option', {
                                            value: m._id + '|' + o.name,
                                            selected: singleVariable.refId === m._id && singleVariable.name === o.name
                                        }, o.name)
                                    );
                                }))
                            );
                        })));
                        break;
                }
                return (
                    h('div',{class:'singleVariable','data-name':variableName,'data-index':index},[
                        h('span.warn',{style:{display: isShow }},[ errorInformation ]),
                        h('span.remove.glyphicon.glyphicon-remove-circle',{onclick:function(){actions.clickRemove({target:this})}}),
                        h('div',[
                            h('label',['类型']),
                            h('select',{
                                name:'type',
                                value:variableType,
                                onchange: function(e){
                                    actions.selectType({target:e.target});
                                }
                            },[
                                h('option',{
                                    value: 0,
                                    selected: dataSource
                                },['数据源']),
                                h('option',{
                                    value: 1,
                                    selected: message
                                },['短信']),
                                h('option',{
                                    value: 2,
                                    selected: mail
                                },['邮件']),
                                h('option',{
                                    value: 10,
                                    selected: num
                                },['数值']),
                                h('option',{
                                    value: 11,
                                    selected: str
                                },['字符串']),
                                h('option',{
                                    value: 12,
                                    selected: time
                                },['时间']),
                                h('option',{
                                    value: 13,
                                    selected: json
                                },['JSON']),
                                h('option',{
                                    value: 100,
                                    selected: otherModal
                                },['引用其他模块']),
                            ])
                        ]),
                        h('div',[
                            h('label',['变量名']),
                            names
                        ])
                    ].concat(singleVariable.type === 100 ? [] : [
                        h('div',[
                            h('label',['默认值']),
                            dataSourceLayout
                        ])
                    ]))
                );
            }
        };

    }());

    // actions
    (function () {
        actions = {
            present: null,
            init: function (present) {
                this.present = present;

                this.bindOb();
            },
            bindOb: function () {
                var _this = this;

                this.unbindOb();
            },
            unbindOb: function () {
                Event.off('.VariablePanel');
            },
            switchTab: function (data, present) {
                present = present || actions.present ;
                var target = data.target;
                var index = Number($(target).attr("data-index"));
                var rs={
                    type:'switchTab',
                    index: index
                }
                present(rs);
            },

            clickRemove: function (data, present) {
                present = present || actions.present ;
                var target = data.target;
                var index = Number($(target).closest('.singleVariable').attr("data-index"));
                var rs={
                    type:'remove',
                    index:index
                }
                present(rs);
            },

            clickAdd: function (data, present) {
                present = present || actions.present ;
                var rs={
                    type:'add',
                    data:{
                        name:'Untitled',
                        type: 0,
                        default: '20',
                        debug: ''
                    }
                }
                present(rs);
            },

            selectType: function (data, present) {
                present = present || actions.present ;
                var target = data.target;
                var value = Number($(target).val());
                var name = $(target).attr('name');
                var index = $(target).closest('.singleVariable').attr('data-index');
                var rs = {
                    type:'updateType',
                    name:name,
                    value:value,
                    index:Number(index)
                }
                present(rs);
            },
            
            oninputVal: function(data, present){
                present = present || actions.present ;
                var target = data.target;
                var val = target.value;
                var name = $(target).attr('name');
                var index = $(target).closest('.singleVariable').attr('data-index');
                var rs = {
                    type:'update',
                    name:name,
                    value:val,
                    index:Number(index)
                }
                present(rs);
            },

            onDropDs: function (data, present) {
                var $target = $(data.target), ds = data.ds;

                present = present || this.present;
                present({
                    type: 'updateDs',
                    name: 'default',
                    value: ds,
                    index: parseInt($target.closest('.singleVariable')[0].dataset.index)
                });
            },

            selectOtherModuleOutput: function (data, present) {
                var $target = $(data.target);
                var arr = $target.val().split('|');

                present = present || this.present;
                present({
                    type: 'selectOtherModuleOutput',
                    index: parseInt($target.closest('.singleVariable')[0].dataset.index),
                    data: arr.length <= 1 ? 
                    // 处理选择为空的情况
                    null 
                    : 
                    {
                        moduleId: arr[0],
                        paramName: arr[1]
                    }
                });
            }
        };
    }());

    exports.Index = Index;
}));