;
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([
            'exports',
            '../core/model.js',
            '../core/Event.js',
            'Inferno'
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
}(namespace('beop.strategy.components.StrategyTable'), function(
    exports,
    Model,
    Event,
    Inferno
) {

    var h = Inferno.h;

    function Index(container, options) {
        if (typeof container === 'string') {
            this.container = document.querySelector(container);
        } else {
            this.container = container;
        }

        this.options = options || {};
        this.options.store || {};

        this.init();
    }

    var model, state, view, theme, actions;
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

            actions.init( model.present.bind(model) );

            model.subscribe(function (state) {
                state.render(model.getStore());
            });
        };

        this.getInitialStore = function () {
            return {
                selectedIds: [],
                searchKey: '',
                items: [],
                loading: 'Loading'
            };
        };

        this.modelBLCProcessing = function (store, dataset) {
            if (typeof dataset.init !== 'undefined') {
                store.items = dataset.data;
                store.loading = '';
            }

            //点击单行tr事件
            if (typeof dataset.select !== 'undefined') {
                if (dataset.keyboardCode.ctrl) {//17 ctrl键
                    if (!dataset.keyboardCode.shift) {//不是全选的
                        if (dataset.select.type === 'add'){
                            store.selectedIds.push(dataset.select.data);
                        }else{
                            store.selectedIds.splice(store.selectedIds.indexOf(dataset.select.data),1);
                        }
                    }
                }else {
                    if (dataset.select.type === 'add'){
                        store.selectedIds = [];
                        store.selectedIds.push(dataset.select.data);
                    }else{
                        store.selectedIds.splice(store.selectedIds.indexOf(dataset.select.data),1);
                    }
                }
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
                store.searchKey = '';
            }
            //属性面板 保存事件
            if(typeof dataset.selectedItems !== 'undefined'){
                $.each(store.items,function(index,row){
                    for(var i=0,length=dataset.selectedItems.length;i<length;i++){
                        if(row._id === dataset.selectedItems._id){
                            row = dataset.selectedItems[j];
                        }
                    }
                })
            }
            return store;
        };

        this.show = function() {
            state.representation(model.getStore());

            WebAPI.get('/strategy/item/getList/5860dfbd1f03091db8e6eff4').done(function (rs) {
                if (rs.status === 'OK') {
                    // 渲染页面的初始状态
                    model.present({
                        init: true,
                        data: rs.data
                    });
                }
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
                    h('div', {
                        style: {width: '100%', height: '100%'}
                    }, [
                        h('.toolBar', [
                            theme.leftBtnGroup(model.selectedIds),
                            theme.searchField(model.searchKey),
                            theme.rightBtnGroup(model.items, model.selectedIds)
                        ]),
                        h('.detailTable', [
                            theme.table(model.items, model.selectedIds, model.searchKey, model.loading)
                        ])
                    ])
                );
            },
            display: function (representation) {
                Inferno.render(representation, this.container);
            }
        };

        theme = {
            leftBtnGroup: (function () {
                function addBtnClickHandler() {
                    actions.clickAddBtn();
                }

                function removeBtnClickHandler() {
                    actions.removeSelectedRows();
                }

                return function (selectedIds) {
                    var state = selectedIds.length ? '' : 'disabled';
                    return (
                        h('.navLeftBtn', [
                            h('button.btn.btn-default.addBtn', {
                                onclick: addBtnClickHandler
                            }, '新增'),
                            h('button', {
                                class: 'btn btn-default removeBtn',
                                disabled: state,
                                onclick: removeBtnClickHandler
                            }, '删除')
                        ])
                    );
                }
            } ()),
            searchField: (function () {
                function onChangeHandler(e) {
                    actions.searchKey({
                        target: e.currentTarget
                    });
                }

                return function (searchKey) {
                    return (
                        h('.input-group.navSearch',[
                            h('input',{
                                class:'form-control iptSearch',
                                type:'text',
                                value: searchKey || '',
                                onchange: onChangeHandler
                            }),
                            h('span.spanSearch',[
                                h('span',{
                                    class:'glyphicon glyphicon-search',
                                    'aria-hidden':'true'
                                })
                            ])
                        ])
                    );
                }
            } ()),
            rightBtnGroup: (function () {
                function enableBtnClickHandler(e) {
                    actions.enableStrategy({target: e.currentTarget});
                }

                function disableBtnClickHandler(e) {
                    actions.disableStrategy({target: e.currentTarget});
                }

                return function (items, selectedIds) {
                    var startBtnState;
                    var stopBtnState;

                    if(selectedIds.length === 0) {
                        startBtnState = 'disabled';
                        stopBtnState = 'disabled';
                    } else {
                        var enableArr = [];
                        items.forEach(function(row){
                            if(selectedIds.indexOf(row._id) !== -1){
                                if( Number(row.status) === 1){//选中的是启用状态
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
                        h('.navRightBtn', [
                            h('button', {
                                class: 'btn btn-default startBtn',
                                disabled: startBtnState,
                                onclick: enableBtnClickHandler
                            }, '启用'),
                            h('button', {
                                class: 'btn btn-default stopBtn',
                                disabled: stopBtnState,
                                onclick: disableBtnClickHandler
                            }, '禁用')
                        ])
                    );
                }
            } ()),

            table: function(items, selectedIds, searchKey, loading) {
                var _this = this;
                var renderTrDatas = [];
                var tbodyStr;
                var dom;

                if(searchKey !== ''){
                    items.forEach(function(row){
                        if($.trim(row.name).indexOf(searchKey) !== -1){
                            renderTrDatas.push( _this.layoutTr(row) );
                        }
                    })
                    if(renderTrDatas.length === 0){
                        renderTrDatas.push(
                            h('tr', [
                                h('td', {
                                    colspan: 9
                                }, '未找到记录')
                            ])
                        );
                    }
                }else{
                    if(items.length === 0 && loading === 'Loading'){
                        renderTrDatas.push(
                            h('tr', [
                                h('td', {
                                    colspan: 9
                                }, loading)
                            ])
                        );
                    }else{
                        if(items.length === 0){
                            renderTrDatas.push(
                                h('tr', [
                                    h('td', {
                                        colspan: 9
                                    }, '还没有任何策略')
                                ])
                            );
                        }else{
                            if(selectedIds.length === 0){
                                items.forEach(function(row){
                                    renderTrDatas.push( _this.layoutTr(row) );
                                })
                            } else {
                                items.forEach(function(row){
                                    if(selectedIds.indexOf(row._id) !== -1){
                                        renderTrDatas.push( _this.layoutTr(row, true) );
                                    } else {
                                        renderTrDatas.push( _this.layoutTr(row) );
                                    }
                                })
                            }
                        }
                    }
                    
                }
                return (
                    h('table.strategyTable', [
                        h('thead', [
                            h('tr', [
                                h('th', {style: {width: '12%'}}, '名称'),
                                h('th', {style: {width: '12%'}}, '从属'),
                                h('th', {style: {width: '5%'}}, '状态'),
                                h('th', {style: {width: '12%'}}, '上次执行'),
                                h('th', {style: {width: '5%'}}, '运行间隔'),
                                h('th', {style: {width: '5%'}}, '类型'),
                                h('th', {style: {width: '5%'}}, '修改人'),
                                h('th', {style: {width: '12%'}}, '修改时间'),
                                h('th', {style: {width: '20%'}}, '描述')
                            ])
                        ]),
                        h('tbody', renderTrDatas)
                    ])
                );
            },
            layoutTr: (function () {

                function trDblclickHandler (e) {
                    actions.dblclickRow({target: e.currentTarget});
                }

                function trClickHandler(e) {
                    actions.clickRow({target: e.currentTarget});
                }

                return function(detail,flag) {
                    var type = Number(detail.type) === 0 ? '诊断': ( Number(detail.type) === 1 ? 'KPI' : '计算点' );
                    var status = Number(detail.status) === 0 ? '未启用' : '启用';
                    var className = flag ? 'selected' : '' ;

                    return (
                        h('tr', {
                            class: className,
                            'data-id': detail._id,
                            'parent-id': detail.nodeId,
                            ondblclick: trDblclickHandler,
                            onclick: trClickHandler
                        }, [
                            h('td', { title: detail.name }, detail.name),
                            h('td', { title: detail.nodeId }, 'VAV_A_11_01' || detail.nodeId),
                            h('td', status),
                            h('td', detail.lastRuntime),
                            h('td', detail.interval),
                            h('td', type),
                            h('td', 'admin' || detail.userId),
                            h('td', detail.lastTime),
                            h('td', {
                                title: detail.desc
                            }, detail.desc)

                        ])
                    )
                }
            }())
        };

    }());

    // actions
    (function () {
        actions = {
            present: null,
            init: function (present) {
                var _this = this;

                this.present = present;
                this.unbindOb();
                
                Event.on('UPDATE_STRATEGY_TABLE.StrategyTable', function (type, data) {
                    _this.updateStrategyTable(data);
                });
            },
            unbindOb: function () {
                Event.off('.StrategyTable');
            },
            updateStrategyTable: function (data, present) {
                present = present || this.present;
                var data;
                data = {
                    selectedItems: data.item
                }
                present(data);
            },
            clickAddBtn: function (data, present) {
                var _this = this;
                Spinner.spin(view.container); 
                present = present || this.present;
                var rs = {
                    addTr:{
                        '_id': ObjectId(),
                        'nodeId': '5860dfbd1f03091db8e6eff4',
                        'name': 'Untitled',
                        'desc': '暂无描述信息',
                        'userId': 1,
                        'lastTime': (new Date()).format('yyyy-MM-dd hh:mm:ss'),
                        'keywords': [],
                        'type': 0,
                        'interval': 60,
                        'lastRuntime': (new Date()).format('yyyy-MM-dd hh:mm:ss'),
                        'status': 0,
                        'value': []
                    }
                }
                var option = {
                    userId: AppConfig.userId,
                    data: rs.addTr
                }
                WebAPI.post('/strategy/item/save',option).done(function (result) {
                    Spinner.stop();
                    if(result.status === 'OK'){
                        alert('新增成功！')
                        present(rs);
                        Event.emit('STRATEGYTABLE_SHOW_PROPPANEL', {
                            action: 'clickAddBtn',
                            from: 'StrategyTable',
                            selectedIds: result.data._id,
                            items: model.getStore().items
                        });
                    }else{
                        alert('新增失败！');
                    }
                })
            },
            dblclickRow: function (data, present) {
                Event.emit('SHOW_PAINTER', {
                    action: 'dblclickRow',
                    from: 'StrategyTable',
                    id: data.target.dataset.id
                });
            },
            clickRow: function (data, present) {
                present = present || this.present ;
                var target = data.target;
                var _id  = target.dataset.id;
                var rs = {};

                var e = e || window.event;
                e.stopPropagation();
                e.preventDefault();

                if ($(target).hasClass('selected')) {
                    rs = {
                        select: {
                            type: 'remove',
                            data: _id
                        },
                        keyboardCode:{
                            ctrl: e.ctrlKey
                        }
                    };
                } else {
                    rs = {
                        select: {
                            type: 'add',
                            data: _id
                        },
                        keyboardCode:{
                            ctrl: e.ctrlKey
                        }
                    };
                }
                present(rs);

                Event.emit('STRATEGYTABLE_SHOW_PROPPANEL', {
                    action: 'clickRow',
                    from: 'StrategyTable',
                    selectedIds: model.getStore().selectedIds,
                    items: model.getStore().items
                });
            },
            removeSelectedRows: function (data, present) {
                present = present || this.present ;
                var _this = this;

                var option = {
                    userId: AppConfig.userId,
                    ids: model.getStore().selectedIds
                }
                WebAPI.post('/strategy/item/remove',option).done(function (result) {
                    if(result.status === 'OK'){
                        alert('删除成功！');
                        var rs = {
                            removeTr:true
                        };
                        present(rs); 
                        Event.emit('STRATEGYTABLE_SHOW_PROPPANEL', {
                            action: 'removeSelectedRows',
                            from: 'StrategyTable',
                            selectedIds: [],
                            items: model.getStore().items
                        });
                    }else{
                        alert('删除失败！');
                    }
                })
            },
            enableStrategy: function (data, present) {
                var _this = this;
                present = present || this.present ;
                var rs = {};
                var target = data.target;
                
                $(target).prop('disabled',true);
                rs = {
                    enableSatus:true,
                    status: 1
                };

                var info = {
                    userId: AppConfig.userId,
                    ids: model.getStore().selectedIds,
                    data: {
                        'status': rs.status
                    }
                }
                WebAPI.post('/strategy/item/save',info).done(function (result) {
                    if(result.status === 'OK'){
                        alert('启用成功');
                        present(rs);
                        Event.emit('STRATEGYTABLE_SHOW_PROPPANEL', {
                            action: 'enableStrategy',
                            from: 'StrategyTable',
                            selectedIds: model.getStore().selectedIds,
                            items: model.getStore().items
                        });
                    }else{
                        alert('启用失败');
                    }
                });
            },
            disableStrategy: function (data, present) {
                var _this = this;
                present = present || this.present ;
                var rs = {};
                var target = data.target;

                $(target).prop('disabled',true);
                rs = {
                    enableSatus:false,
                    status: 0
                };

                var info = {
                    userId: AppConfig.userId,
                    ids: model.getStore().selectedIds,
                    data: {
                        'status': rs.status
                    }
                }
                WebAPI.post('/strategy/item/save',info).done(function (result) {
                    if(result.status === 'OK'){
                        alert('禁用成功');
                        present(rs);
                        Event.emit('STRATEGYTABLE_SHOW_PROPPANEL', {
                            action: 'enableStrategy',
                            from: 'StrategyTable',
                            selectedIds: model.getStore().selectedIds,
                            items: model.getStore().items
                        });
                    }else{
                        alert('禁用失败');
                    }
                });
            },
            search: function (data, present) {
                present = present || this.present ;
                var target = data.target;   
                var rs = {
                    keyWords: data.target.value
                };
            
                present(rs);

                Event.emit('STRATEGYTABLE_SHOW_PROPPANEL', {
                    action: 'search',
                    from: 'StrategyTable',
                    selectedIds: [],
                    items: model.getStore().items
                });
            }
        };

        exports.actions = actions;
    }());

    exports.Index = Index;
}));