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