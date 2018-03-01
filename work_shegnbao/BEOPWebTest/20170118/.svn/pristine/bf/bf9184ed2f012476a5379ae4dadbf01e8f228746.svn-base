;(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([
            'exports',
            '../../core/Event.js'
            ], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(
                exports,
                require('../../core/Event.js')
            );
    } else {
        factory(
            root,
            namespace('beop.strategy.core.Event')
        );
    }
}(namespace('beop.strategy.components.PropPanel'), function (exports, Event) {

    function Actions() {
        this.present = null;
    }

    // PROTOTYPES
    +function () {
        /**
         * Constructor
         */
        this.constructor = Actions;

        this.init = function (present, store) {
            this.present = present;
            this.store = store;
            this.initOb();
        };

        this.initOb = function () {
            var _this = this;

            this.unbindOb();

            Event.on('STRATEGYTABLE_SHOW_PROPPANEL.PropPanel', function (type, data) {
                _this.showPropanel(data);
                _this.selectedIds = data.selectedIds;
            });
        };

        this.unbindOb = function () {
            Event.off('STRATEGYTABLE_SHOW_PROPPANEL.PropPanel');
        };

        this.showPropanel = function (data, present) {
            present = present || this.present;
            var data;
            data = {
                selectedIds: data.selectedIds,
                items: data.items
            }
            present(data);
        };

        this.save = function (data, present) {
            present = present || this.present;

            var target = data.target;
            var params = $(target).closest('.propTopBtn').next('form').serialize(); 
            params = decodeURIComponent(params,true);
            var dataArr = params.split('&');
            var obj={};
            for(var i=0,length=dataArr.length;i<length;i++){
                var key = dataArr[i].split('=')[0];
                var val = dataArr[i].split('=')[1];
                if(val !== ''){
                    if(key==='status' || key==='type'){
                        val = Number(val);
                    }
                    obj[key] = val;
                }
            }
            obj['lastTime'] = (new Date()).format('yyyy-MM-dd hh:mm:ss');
            var info = {
                userId: AppConfig.userId,
                ids: this.selectedIds,
                data: obj
            }
            WebAPI.post('/strategy/item/save',info).done(function (result) {
                if(result.status === 'OK'){
                    alert('保存成功');
                    var rs = {
                        isSave:true,
                        dataJson:obj
                    }
                    present(rs);

                    Event.emit('UPDATE_STRATEGY_TABLE', {
                        action: 'save',
                        from: 'PropPanel',
                        item: obj
                    });
                }else{
                    alert('保存失败');
                }
            });
            
        };

        this.recover = function (data, present) {
            present = present || this.present;
            var rs = {
                isRecover:true
            }
            present(rs);
        };

    }.call(Actions.prototype);

    var actions = new Actions();
    var n = "beop.strategy.components.PropPanel.actions";

    actions.intents = {
        save: 'namespace(\'' + n + '\').' + 'save',
        recover: 'namespace(\'' + n + '\').' + 'recover'
    };
    exports.actions = actions;
}));
;(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(exports);
    } else {
        factory(
            root
        );
    }
}(namespace('beop.strategy.components.PropPanel'), function (exports) {

    function View(container) {
        this.container = container;
    }

    // PROTOTYPES
    +function () {
        /**
         * Constructor 
         */
        this.constructor = View;

        this.init = function (intents) {
            this.theme.intents = intents;
        };

        this.ready = function (model) {

            return (
                 this.theme.topBtn(model.isShow)+this.theme.renderPanel(model.items)
            );
        };

        this.display = function (representation) {
            this.container.innerHTML = representation;
        };

    }.call(View.prototype);

    +function () {

        this.intents = {};

        this.topBtn = function(isShow) {
            if(isShow){
                return (
                    '<div class="propTopBtn">\
                        <button class="btn btn-default save" onclick="'+this.intents['save']+'({target:this})">保存</button>\
                        <button class="btn btn-default recover" onclick="'+this.intents['recover']+'()">恢复</button>\
                    </div>'
                );
            }else{
                return '';
            }
        };

        this.renderPanel = function(items){
            if(items.length === 1){
                var enable='',disable='';
                var diagnosis='',kpi='',point='';
                if( Number(items[0].status) === 0 ){//未启用
                    enable='';
                    disable='selected';
                }else{//启用
                    enable='selected';
                    disable='';
                }

                if( Number(items[0].type)=== 0 ){
                    diagnosis='selected';
                    kpi='';
                    point='';
                }else if( Number(items[0].type) === 1 ){
                    diagnosis='';
                    kpi='selected';
                    point='';
                }else{
                    diagnosis='';
                    kpi='';
                    point='selected';
                }
                return (
                    '<form class="form-inline">\
                        <div class="form-group">\
                            <label>名字</label>\
                            <input type="text" name="name" value="'+items[0].name+'">\
                        </div>\
                        <div class="form-group">\
                            <label>状态</label>\
                            <select value="'+items[0].status+'" name="status">\
                                <option value="1" '+enable+'>启用</option>\
                                <option value="0" '+disable+'>未启用</option>\
                            </select>\
                        </div>\
                        <div class="form-group">\
                            <label>运行间隔</label>\
                            <input type="text" value="'+items[0].interval+'" name="interval">\
                        </div>\
                        <div class="form-group">\
                            <label>类型</label>\
                            <select value="'+items[0].type+'" name="type">\
                                <option value="0" '+diagnosis+'>诊断</option>\
                                <option value="1" '+kpi+'>KPI</option>\
                                <option value="2" '+point+'>计算点</option>\
                            </select>\
                        </div>\
                        <div class="form-group">\
                            <label>ID</label>\
                            <input type="text" value="'+items[0]._id+'" disabled>\
                        </div>\
                        <div class="form-group">\
                            <label>描述</label>\
                            <input type="text" value="'+items[0].desc+'" title="'+items[0].desc+'" name="desc">\
                        </div>\
                        <div class="form-group">\
                            <label>从属</label>\
                            <input type="text" value="'+items[0].nodeId+'" disabled>\
                        </div>\
                        <div class="form-group">\
                            <label>最后运行时间</label>\
                            <input type="text" value="'+items[0].lastRuntime+'" disabled>\
                        </div>\
                        <div class="form-group">\
                            <label>修改人</label>\
                            <input type="text" value="'+items[0].userId+'" disabled>\
                        </div>\
                        <div class="form-group">\
                            <label>最后修改时间</label>\
                            <input type="text" value="'+items[0].lastTime+'" disabled name="lastTime">\
                        </div>\
                    </form>'
                );
            }else if(items.length === 0){
                return '';
            }else{
                var keys = Object.keys(items[0]);
                var obj = {};
                keys.forEach(function(key){
                    obj[key] = new Set(items.map((item)=>{return item[key]})).size>1?'':items[0][key];
                })
                var enable='',disable='';
                var diagnosis='',kpi='',point='';
                if( Number(obj.status) === 0 ){//未启用
                    enable='';
                    disable='selected';
                }else{//启用
                    enable='selected';
                    disable='';
                }

                if( Number(obj.type)=== 0 ){
                    diagnosis='selected';
                    kpi='';
                    point='';
                }else if( Number(obj.type) === 1 ){
                    diagnosis='';
                    kpi='selected';
                    point='';
                }else{
                    diagnosis='';
                    kpi='';
                    point='selected';
                }
                
                return (
                '<form class="form-inline">\
                    <div class="form-group">\
                        <label>名字</label>\
                        <input type="text" value="'+obj.name+'" name="name">\
                    </div>\
                    <div class="form-group">\
                        <label>状态</label>\
                        <select value="'+items[0].status+'" name="status">\
                            <option value="1" '+enable+'>启用</option>\
                            <option value="0" '+disable+'>未启用</option>\
                        </select>\
                    </div>\
                    <div class="form-group">\
                        <label>频率</label>\
                        <input type="text" value="'+obj.interval+'" name="interval">\
                    </div>\
                    <div class="form-group">\
                        <label>类型</label>\
                        <select value="'+items[0].type+'" name="type">\
                            <option value="0" '+diagnosis+'>诊断</option>\
                            <option value="1" '+kpi+'>KPI</option>\
                            <option value="2" '+point+'>计算点</option>\
                        </select>\
                    </div>\
                    <div class="form-group">\
                        <label>描述</label>\
                        <input type="text" value="'+obj.desc+'" title="'+obj.desc+'" name="desc">\
                    </div>\
                    <div class="form-group">\
                        <label>最后修改时间</label>\
                        <input type="text" value="'+items[0].lastTime+'" disabled name="lastTime">\
                    </div>\
                </form>'
                );
            }
        }

    }.call(View.prototype.theme = {});

    exports.View = View;
}));
;(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(exports);
    } else {
        factory(
            root
        );
    }
}(namespace('beop.strategy.components.PropPanel'), function (exports) {

    function State() {
        this.model = null;
        this.view = null;

        this.init();
    }

    // PROTOTYPES
    +function () {
        /**
         * Constructor
         */
        this.constructor = State;

        this.init = function (view) {
            this.view = view;
        };

        this.bindModel = function (model) {
            this.model = model;
            return this;
        };

        this.ready = function () {
            return true;
        };

        this.nap = function () {
            return function () {
                return undefined;
            }
        };

        // 渲染页面
        this.render = function (model) {
            this.representation(model);
        };

        this.representation = function (model) {
            var representation = 'something was wrong!';
            if (this.ready()) {
                representation = this.view.ready(model);
            }
            this.view.display(representation) ;
        };

    }.call(State.prototype);

    exports.State = State;
}));
;(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', '../../core/model.js', './state.js','./view.js', './actions.js'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(exports, require('../core/model.js'), require('./state.js'), require('./view.js'), require('./actions.js'));
    } else {
        factory(
            root,
            namespace('beop.strategy.core.Model'),
            namespace('beop.strategy.components.PropPanel.State'),
            namespace('beop.strategy.components.PropPanel.View'),
            namespace('beop.strategy.components.PropPanel.actions')
        );
    }
}(namespace('beop.strategy.components.PropPanel'), function (exports, Model, State, View, actions) {

    function Index(container) {
        if (typeof container === 'string') {
            this.container = document.querySelector(container);
        } else {
            this.container = container;
        }
        // model
        this.model = null;
        // state
        this.state = null;

        this.init();
    }

    // PROTOTYPES
    +function () {
        /**
         * Constructor
         */
        this.constructor = Index;

        /**
         * Initialize
         */
        this.init = function () {
            // this.initState();
            // this.initModel();
            var _this = this;
            var state = new State();
            var view = new View(this.container);
            var model = this.model = new Model(this.modelBLCProcessing.bind(this), state, this.getInitialStore(), state.nap);
            
            state.init(view);
            actions.init(this.model.present.bind(this.model), this.model.store);
            view.init(actions.intents);

            this.model.subscribe(function (state) {
                state.render(_this.model.getStore());
            });
        };

        this.getInitialStore = function () {
            return {
                isSave: false,
                isRecover: false,
                isShow: false,
                items: []
            };
        };

        /**
         * @description 初始化 model
         */
        this.modelBLCProcessing = function (store, dataset) {
            if(typeof dataset.selectedIds !== 'undefined'){
                var itemsArr = [];
                if(dataset.selectedIds.length === 0){
                    itemsArr = [];
                    store.isShow = false;
                }else{
                    for(var i=0,length=dataset.items.length;i<length;i++){
                        for(var j=0,jLength=dataset.selectedIds.length;j<jLength;j++){
                            if(dataset.items[i]._id === dataset.selectedIds[j]){
                                itemsArr.push(dataset.items[i]);
                            }
                        }
                    }
                    store.isShow = true;
                }
                store.items = itemsArr;
            }
            if (typeof dataset.isSave !== 'undefined') {
                if (dataset.isSave){//保存
                    store.items.forEach(function(row){
                        var allKeys = Object.keys(row);
                        $.each(Object.keys(dataset.dataJson),function(index,key){
                            if(allKeys.indexOf(key) !== -1){
                                row[key] = dataset.dataJson[key];
                            }
                        })
                    })
                }
            }
            if (typeof dataset.isRecover !== 'undefined') {
                if (dataset.isRecover){//恢复
                    store.items = this.model.store.items;
                }
            }
            return store;
        };

        /**
         * @description 初始化 state
         */
        this.show = function () {
             
        };

        this.close = function () {};

    }.call(Index.prototype);

    exports.Index = Index;
}));