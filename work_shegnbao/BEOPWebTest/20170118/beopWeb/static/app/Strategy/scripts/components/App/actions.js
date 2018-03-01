;
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([
            'exports',
            '../../core/event.js'
        ], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(
            exports,
            require('../../core/event.js')
        );
    } else {
        factory(
            root,
            namespace('beop.strategy.core.Event')
        );
    }
}(namespace('beop.strategy.components.App'), function(exports, Event) {

    function Actions() {
        this.present = null;
    }

    // PROTOTYPES
    +function() {
        /**
         * Constructor
         */
        this.constructor = Actions;

        this.init = function(present) {
            this.present = present;

            this.bindOb();
        };

        this.bindOb = function() {
            var _this = this;

            this.unbindOb();

            Event.on('SHOW_PAINTER.App', function(type, data) {
                _this.showPainter(data);
            });

            Event.on('SHOW_TABLE.App', function(type, data) {
                _this.showTable(data);
            });

            Event.on('SHOW_MODULE_CONFIG.App', function (type, data) {
                _this.showModalConfig(data);
            });
            
            Event.on('QUIT_MODULE_CONFIG.App', function (type, data) {
                _this.quitModalConfig(data);
            });
        };

        this.unbindOb = function () {
            Event.off('SHOW_PAINTER.App SHOW_TABLE.App SHOW_MODULE_CONFIG.App QUIT_MODULE_CONFIG.App');
        };

        /**
         * 进入策略编辑页面
         * 
         * @param {any} data 待处理的数据
         * @param {any} present model 的 present 方法
         */
        this.showPainter = function(data, present) {
            present = present || this.present;

            present(data);
        };
        
        /**
         * 进入表格页面
         * 
         * @param {any} data 待处理的数据
         * @param {any} present model 的 present 方法
         */
        this.showTable = function(data, present) {
            present = present || this.present;

            present(data);
        };

        this.showModalConfig = function (data, present) {
            present = present || this.present;

            present(data);
        };

        this.quitModalConfig = function (data, present) {
            present = present || this.present;

            present(data);
        };

    }.call(Actions.prototype);

    var actions = new Actions();
    var n = "beop.strategy.components.StrategyTable.actions";

    actions.intents = {
    };

    exports.actions = actions;
}));