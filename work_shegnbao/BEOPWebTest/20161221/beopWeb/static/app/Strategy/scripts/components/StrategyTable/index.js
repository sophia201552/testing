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