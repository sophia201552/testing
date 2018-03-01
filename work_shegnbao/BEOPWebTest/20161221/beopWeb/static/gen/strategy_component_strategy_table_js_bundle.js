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
}(namespace('beop.strategy.components.StrategyTable'), function (exports) {

    function Actions() {
        this.present = null;
    }

    // PROTOTYPES
    +function () {
        /**
         * Constructor
         */
        this.constructor = Actions;

        this.init = function (present) {
            this.present = present;
        };

        this.clickAddBtn = function (data, present) {
            present = present || this.present;
            var rs = {
                addTr:{
                    // 编号
                    '_id': ObjectId(),
                    // tag节点Id,
                    'nodeId': '565558adf18a890a24480752',
                    // 名称
                    'name': 'default',
                    // 描述
                    'desc': '描述',
                    // 修改人
                    'userId': 1,
                    // 最后修改时间
                    'lastTime': (new Date()).format('yyyy-MM-dd hh:mm:ss'),
                    // 关键字，便于检索
                    'keywords': ['冷机', '与非', ],
                     // 类型：0，诊断；1，KPI；2，计算点；
                    'type': 0,
                     // 运行间隔, 秒
                    'interval': 60,
                     // 最后运行时间
                    'lastRuntime': (new Date()).format('yyyy-MM-dd hh:mm:ss'),
                     // 状态： 0，未启用；1，启用；
                    'status': 0
                }
            }
            present(rs);
        };

        this.sureAdd = function() {

        };

        this.dblclickRow = function (data, present) {
            var target, _id, rs;

            present = present || this.present ;

            target = data.target;
            _id  = target.dataset.id;
            rs = {
                modifyStrategy: true,
                data: {
                    id: _id
                }
            };

            present(rs);
        };

        this.clickRow = function (data, present) {
            present = present || this.present ;
            var target = data.target;
            var _id  = target.dataset.id;
            var rs = {};

            if ($(target).hasClass('selected')) {
                rs = {
                    select: {
                        type: 'remove',
                        data: _id
                    }
                };
            } else {
                rs = {
                    select: {
                        type: 'add',
                        data: _id
                    }
                };
            }
            present(rs);
        };

        this.removeSelectedRows = function (data, present) {
            present = present || this.present ;
            var rs = {
                    removeTr:true
                };
            present(rs);   
        };

        this.enableStrategy = function (data, present) {
            present = present || this.present ;
            var rs = {};
            var target = data.target;
            if ($(target).prop('disabled')) {//被禁用的状态
                $(target).prop('disabled',false);
                rs = {
                    enableSatus:false
                }
            } else {
                $(target).prop('disabled',true);
                rs = {
                    enableSatus:true
                };
            }
            present(rs);
        };

        this.disableStrategy = function (data, present) {
            present = present || this.present ;
            var rs = {};
            var target = data.target;
            if ($(target).prop('disabled')) {//被禁用的状态
                $(target).prop('disabled',false);
                rs = {
                    enableSatus:true
                }
            } else {
                $(target).prop('disabled',true);
                rs = {
                    enableSatus:false
                };
            }
            present(rs);
        };

        this.search = function (data, present) {
            present = present || this.present ;
            var target = data.target;   
            var rs = {
                        keyWords: data.target.value
                    };
           
            present(rs);
        };

    }.call(Actions.prototype);

    var actions = new Actions();
    var n = "beop.strategy.components.StrategyTable.actions";

    actions.intents = {
        clickAddBtn: 'namespace(\'' + n + '\').' + 'clickAddBtn',
        clickRow: 'namespace(\'' + n + '\').' + 'clickRow',
        dblclickRow: 'namespace(\'' + n + '\').' + 'dblclickRow',
        removeSelectedRows: 'namespace(\'' + n + '\').' + 'removeSelectedRows',
        enableStrategy: 'namespace(\'' + n + '\').' + 'enableStrategy',
        disableStrategy: 'namespace(\'' + n + '\').' + 'disableStrategy',
        search: 'namespace(\'' + n + '\').' + 'search'
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
}(namespace('beop.strategy.components.StrategyTable'), function (exports) {

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
                '<div>' + 
                this.theme.leftBtnGroup(model.selectedIds) +
                this.theme.searchField(model.searchKey) +
                this.theme.rightBtnGroup(model.items, model.selectedIds) +
                '</div><div>' + 
                this.theme.table(model.items, model.selectedIds, model.searchKey) +
                '</div>'+
                this.theme.modalFrame()

            );
        };

        this.display = function (representation) {
            this.container.innerHTML = representation;

            this.attachEvents();
        };

        this.attachEvents = function () {

        };

    }.call(View.prototype);

    +function () {

        this.intents = {};

        this.leftBtnGroup = function (selectedIds) {
            var state = selectedIds.length ? '' : 'disabled';
            return (
                '<div class="navLeftBtn">\
                    <button class="btn btn-default addBtn" onclick="'+this.intents['clickAddBtn']+'()">新增</button>\
                    <button class="btn btn-default removeBtn" '+state+' onclick="'+this.intents['removeSelectedRows']+'({})">删除</button>\
                </div>'
            );
        };

        this.searchField = function (searchKey) {
            var searchKey = searchKey === undefined ? '' : searchKey;
            return (
                '<div class="navSearch">\
                    <input type="text" placeholder="搜索" value="'+searchKey+'" onchange="'+this.intents['search']+'({target:this})">\
                </div>'
            );
        };

        this.rightBtnGroup = function (items, selectedIds) {
            var startBtnState;
            var stopBtnState;
            if(selectedIds.length === 0){
                startBtnState = 'disabled';
                stopBtnState = 'disabled';
            }else{
                var enableArr = [];
                items.forEach(function(row){
                    if(selectedIds.indexOf(row._id) !== -1){
                        if(row.status === 1){//选中的是启用状态
                            enableArr.push(row);
                        }
                    }
                })
                if(enableArr.length === 0){//选中的控件都是未启用的状态
                    startBtnState = '';
                    stopBtnState = 'disabled';
                }else if(enableArr.length === selectedIds.length){//选中的控件都是启用状态
                    startBtnState = 'disabled';
                    stopBtnState = '';
                }else{//都是启用的  或者 有启用的 有未启用的
                    startBtnState = '';
                    stopBtnState = '';
                }
            }
            return (
                '<div class="navRightBtn">\
                    <button class="btn btn-default startBtn" '+startBtnState+' onclick="'+this.intents['enableStrategy']+'({target: this})">启用</button>\
                    <button class="btn btn-default stopBtn" '+stopBtnState+' onclick="'+this.intents['disableStrategy']+'({target: this})">禁用</button>\
                </div>'
            );
        };

        this.table= function(items, selectedIds, searchKey) {
            var _this = this;
            var renderTrDatas = [];
            var tbodyStr;
            if(searchKey !== ''){
                items.forEach(function(row){
                    if($.trim(row.name).indexOf(searchKey) !== -1){
                        renderTrDatas.push( _this.layoutTr(row) );
                    }
                })
            }else{
                if(selectedIds.length === 0){
                    items.forEach(function(row){
                        renderTrDatas.push( _this.layoutTr(row) );
                    })
                } else {
                    items.forEach(function(row){
                        if(selectedIds.indexOf(row._id) !== -1){
                            renderTrDatas.push( _this.layoutTr(row,true) );
                        }else{
                            renderTrDatas.push( _this.layoutTr(row) );
                        }
                    })
                }
            }
            return (
                '<table class="strategyTable">\
                    <thead>\
                        <tr>\
                            <th style="width:12%">名称</th>\
                            <th style="width:12%">从属</th>\
                            <th style="width:5%">状态</th>\
                            <th style="width:12%">上次执行</th>\
                            <th style="width:5%">运行间隔</th>\
                            <th style="width:5%">类型</th>\
                            <th style="width:5%">修改人</th>\
                            <th style="width:12%">修改时间</th>\
                            <th style="width:20%">描述</th>\
                        </tr>\
                    </thead>\
                    <tbody>'+renderTrDatas.join('')+'</tbody>\
                </table>'
            );
        };

        this.layoutTr = function(detail,flag) {
            var type = detail.type === 0 ? '诊断': (detail.type === 1 ? 'KPI' : '计算点' );
            var status = detail.status === 0 ? '未启用' : '启用';
            var className = flag ? 'selected' : '' ;
            return ('<tr data-id="'+detail._id+'" parent-id="'+detail.nodeId+'" ondblclick="'+this.intents['dblclickRow']+'({target: this});" \
                        onclick="'+this.intents['clickRow']+'({target: this});" class="'+className+'">\
                        <td title="'+detail.name+'">'+detail.name+'</td>\
                        <td title="'+detail.nodeId+'">'+detail.nodeId+'</td>\
                        <td>'+status+'</td>\
                        <td>'+detail.lastRuntime+'</td>\
                        <td>'+detail.interval+'</td>\
                        <td>'+type+'</td>\
                        <td>'+detail.userId+'</td>\
                        <td>'+detail.lastTime+'</td>\
                        <td title="'+detail.desc+'">'+detail.desc+'</td>\
                    </tr>')
        };  

        this.modalFrame = function() {
            return ' <div class="modal fade" id="strategyTableModal">\
                        <div class="modal-dialog">\
                        <div class="modal-content">\
                            <div class="modal-header">\
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">\
                                    <span class="glyphicon glyphicon-remove"></span>\
                                </button>\
                                <h4 class="modal-title">新增</h4>\
                            </div>\
                            <div class="modal-body gray-scrollbar" style="height:260px;">\
                                <table id="strategyAddTable">\
                                    <thead>\
                                        <tr>\
                                            <th>名称</th>\
                                            <th>从属</th>\
                                            <th>状态</th>\
                                            <th>上次执行</th>\
                                            <th>运行间隔</th>\
                                            <th>类型</th>\
                                            <th>修改人</th>\
                                            <th>修改时间</th>\
                                            <th>描述</th>\
                                        </tr>\
                                    </thead>\
                                    <tbody>\
                                        <tr>\
                                            <td class="name"></td>\
                                            <td class="nodeId"></td>\
                                                <td class="status"></td>\
                                                <td class="lastRuntime"></td>\
                                                <td class="interval"></td>\
                                                <td class="type"></td>\
                                                <td class="userId"></td>\
                                                <td class="lastTime"></td>\
                                                <td class="desc"></td>\
                                            </tr>\
                                        </tbody>\
                                    </table>\
                            </div>\
                            <div class="modal-footer">\
                                <button type="button" class="btn btn-default">取消</button>\
                                <button type="button" class="btn btn-primary btn-submit" onclick="'+this.intents['sureAdd']+'({})">确定</button>\
                                </div>\
                            </div>\
                        </div>\
                    </div>';
        };

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
}(namespace('beop.strategy.components.StrategyTable'), function (exports) {

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
            namespace('beop.strategy.components.StrategyTable.State'),
            namespace('beop.strategy.components.StrategyTable.View'),
            namespace('beop.strategy.components.StrategyTable.actions')
        );
    }
}(namespace('beop.strategy.components.StrategyTable'), function (exports, Model, State, View, actions) {

    var nop = function () {return undefined;};

    function Index(container, parentActionPresent) {
        if (typeof container === 'string') {
            this.container = document.querySelector(container);
        } else {
            this.container = container;
        }

        this.parentActionPresent = parentActionPresent || nop;

        // model
        this.model = null;

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
            var _this = this;
            var state = new State();
            var view = new View(this.container);
            var model = this.model = new Model(this.modelBLCProcessing.bind(this), state, this.getInitialStore(), state.nap);
            
            state.init(view);
            actions.init(this.model.present.bind(this.model));
            view.init(actions.intents);

            this.model.subscribe(function (state) {
                state.render(_this.model.getStore());
            });
        };

        this.getInitialStore = function () {
            return {
                selectedIds: [],
                searchKey: '',
                items: [{
                     // 编号
                    '_id': '565558adf18a890a2448075b',
                    // tag节点Id,
                    'nodeId': '565558adf18a890a24480752',
                    // 名称
                    'name': '1号供回水温度监测',
                    // 描述
                    'desc': '用神奇的高端洋气算法，对冷机1号初代机供回水温度越界问题进行监测，并发出报警',
                    // 修改人
                    'userId': 1,
                    // 最后修改时间
                    'lastTime': '2016-04-12 19:00:00',
                    // 关键字，便于检索
                    'keywords': ['冷机', '与非', ],
                     // 类型：0，诊断；1，KPI；2，计算点；
                    'type': 0,
                     // 运行间隔, 秒
                    'interval': 60,
                     // 最后运行时间
                    'lastRuntime': '2016-04-12 19:00:00',
                     // 状态： 0，未启用；1，启用；
                    'status': 0,
                },{
                     // 编号
                    '_id': '565558adf18a890a24480751',
                    // tag节点Id,
                    'nodeId': '565558adf18a890a24480752',
                    // 名称
                    'name': '冷机1号供回水温度监测',
                    // 描述
                    'desc': '用神奇的高端洋气算法，对冷机1号初代机供回水温度越界问题进行监测，并发出报警',
                    // 修改人
                    'userId': 1,
                    // 最后修改时间
                    'lastTime': '2016-04-12 19:00:00',
                    // 关键字，便于检索
                    'keywords': ['冷机', '与非', ],
                     // 类型：0，诊断；1，KPI；2，计算点；
                    'type': 0,
                     // 运行间隔, 秒
                    'interval': 60,
                     // 最后运行时间
                    'lastRuntime': '2016-04-12 19:00:00',
                     // 状态： 0，未启用；1，启用；
                    'status': 0,
                },{
                     // 编号
                    '_id': '565558adf18a890a24480752',
                    // tag节点Id,
                    'nodeId': '565558adf18a890a24480752',
                    // 名称
                    'name': '冷机2号供回水温度监测',
                    // 描述
                    'desc': '用神奇的高端洋气算法，对冷机1号初代机供回水温度越界问题进行监测，并发出报警',
                    // 修改人
                    'userId': 1,
                    // 最后修改时间
                    'lastTime': '2016-04-12 19:00:00',
                    // 关键字，便于检索
                    'keywords': ['冷机', '与非', ],
                     // 类型：0，诊断；1，KPI；2，计算点；
                    'type': 0,
                     // 运行间隔, 秒
                    'interval': 60,
                     // 最后运行时间
                    'lastRuntime': '2016-04-12 19:00:00',
                     // 状态： 0，未启用；1，启用；
                    'status': 0,
                },{
                     // 编号
                    '_id': '565558adf18a890a24480753',
                    // tag节点Id,
                    'nodeId': '565558adf18a890a24480752',
                    // 名称
                    'name': '冷机3号供回水温度监测',
                    // 描述
                    'desc': '用神奇的高端洋气算法，对冷机1号初代机供回水温度越界问题进行监测，并发出报警',
                    // 修改人
                    'userId': 1,
                    // 最后修改时间
                    'lastTime': '2016-04-12 19:00:00',
                    // 关键字，便于检索
                    'keywords': ['冷机', '与非', ],
                     // 类型：0，诊断；1，KPI；2，计算点；
                    'type': 0,
                     // 运行间隔, 秒
                    'interval': 60,
                     // 最后运行时间
                    'lastRuntime': '2016-04-12 19:00:00',
                     // 状态： 0，未启用；1，启用；
                    'status': 0,
                },{
                     // 编号
                    '_id': '565558adf18a890a24480754',
                    // tag节点Id,
                    'nodeId': '565558adf18a890a24480752',
                    // 名称
                    'name': '冷机4号供回水温度监测',
                    // 描述
                    'desc': '用神奇的高端洋气算法，对冷机1号初代机供回水温度越界问题进行监测，并发出报警',
                    // 修改人
                    'userId': 1,
                    // 最后修改时间
                    'lastTime': '2016-04-12 19:00:00',
                    // 关键字，便于检索
                    'keywords': ['冷机', '与非', ],
                     // 类型：0，诊断；1，KPI；2，计算点；
                    'type': 0,
                     // 运行间隔, 秒
                    'interval': 60,
                     // 最后运行时间
                    'lastRuntime': '2016-04-12 19:00:00',
                     // 状态： 0，未启用；1，启用；
                    'status': 0,
                },{
                     // 编号
                    '_id': '565558adf18a890a24480755',
                    // tag节点Id,
                    'nodeId': '565558adf18a890a24480752',
                    // 名称
                    'name': '冷机5号供回水温度监测',
                    // 描述
                    'desc': '用神奇的高端洋气算法，对冷机1号初代机供回水温度越界问题进行监测，并发出报警',
                    // 修改人
                    'userId': 1,
                    // 最后修改时间
                    'lastTime': '2016-04-12 19:00:00',
                    // 关键字，便于检索
                    'keywords': ['冷机', '与非', ],
                     // 类型：0，诊断；1，KPI；2，计算点；
                    'type': 0,
                     // 运行间隔, 秒
                    'interval': 60,
                     // 最后运行时间
                    'lastRuntime': '2016-04-12 19:00:00',
                     // 状态： 0，未启用；1，启用；
                    'status': 0,
                }]
            };
        };

        this.modelBLCProcessing = function (store, dataset) {
            //点击单行tr事件
            if (typeof dataset.select !== 'undefined') {
                if (dataset.select.type === 'add'){
                    store.selectedIds.push(dataset.select.data);
                }else{
                    store.selectedIds.splice(store.selectedIds.indexOf(dataset.select.data),1);
                }
            }

            if (dataset.modifyStrategy === true) {
                this.parentActionPresent({
                    from: 'StrategyTable',
                    type: 'dbclickRow'
                });
                return false;
            }
            //启用禁用状态
            if(typeof dataset.enableSatus !== 'undefined'){
                store.items.forEach(function(row){
                    if(store.selectedIds.indexOf(row._id) !== -1){
                        if( dataset.enableSatus ){
                            row.status = 1;
                        }else{
                            row.status = 0;
                        }
                        
                    }
                })
            }
            //删除事件
            if(typeof dataset.removeTr !== 'undefined'){
                var removeTrArr = []
                if(dataset.removeTr){
                    $.each(store.items,function(index,row){
                        if(store.selectedIds.indexOf(row._id) === -1){
                            removeTrArr.push(row);
                        }
                    })
                    store.items = removeTrArr;
                }
            }
            //搜索事件
            if(typeof dataset.keyWords !== 'undefined'){
                store.searchKey = dataset.keyWords;
            }
            //新增事件
            if(typeof dataset.addTr !== 'undefined'){
                store.items.push(dataset.addTr);
                store.selectedIds = [dataset.addTr._id];
            }
            return store;
        };

        /**
         * @description 渲染页面
         */
        this.show = function () {
            // 渲染页面的初始状态
            this.model.getState().render(this.model.getStore());
           
        };

        this.close = function () {};

    }.call(Index.prototype);

    exports.Index = Index;
}));