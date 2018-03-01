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