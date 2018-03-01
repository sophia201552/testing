;(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([
            'exports', 
            '../../util/layoutBuilder.js',
            '../EquipTree/index.js',
            '../StrategyTable/index.js',
            '../PropPanel/index.js',
            '../Sketchpad/sketchpad.js'
        ], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(exports, 
            require('../../util/layoutBuilder.js'),
            require('../EquipTree/index.js'),
            require('../StrategyTable/index.js'),
            require('../PropPanel/index.js'),
            require('../Sketchpad/sketchpad.js')
        );
    } else {
        factory(
            root,
            namespace('beop.util.LayoutBuilder'),
            namespace('beop.strategy.components.EquipTree.Index'),
            namespace('beop.strategy.components.StrategyTable.Index'),
            namespace('beop.strategy.components.PropPanel.Index'),
            namespace('beop.strategy.components.StrategyTplTree.Index'),
            namespace('beop.strategy.components.Sketchpad.Index'),
            namespace('beop.strategy.components.StrategyTplPanel.Index')
        );
    }
}(namespace('beop.strategy.components'), function (exports, LayoutBuilder, EquipTree, StrategyTable, PropPanel, StrategyTplTree, Sketchpad, StrategyTplPanel) {

    function App(container) {
        if (typeof container === 'string') {
            this.container = document.querySelector(container);
        } else {
            this.container = container;
        }

        // utils and sub components
        this.layoutBuilder = null;
        this.equipTree = null;
        this.strategyTable = null;
        this.propPanel = null;
        this.sketchpad = null;
        this.strategyTplPanel = null;

        this.init();
    }

    // PROTOTYPES
    +function () {
        /**
         * Constructor
         */
        this.constructor = App;

        /**
         * initialize app
         */
        this.init = function () {
        };

        this.show = function () {
            this.initLayout();

            this.initEquipTree();

            this.initPropPanel();

            this.initStrategyTable();
        };

        this.present = function (data) {
            if (data.from) {
                switch(data.from) {
                    case 'StrategyTable':
                        this.destroyStrategyTable();
                        if (data.type === 'dbclickRow') {
                            this.initStrategyTplTree();
                            this.initSketchpad();
                        }
                        break;
                    default:
                        Log.warn('not supporting type: ' + data.from);
                        break;
                }
            }
        };

        this.close = function () {

            this.destroyEquipTree();
            this.destroyPropPanel();
            this.destroyStrategyTable();
            this.destroySketchpad();

            this.destroyLayout();
        };

        this.initLayout = function () {
            if (!this.layoutBuilder) {
                this.layoutBuilder = LayoutBuilder.init(this.container);
            }
        };

        this.destroyLayout = function () {
            if (this.layoutBuilder) {
                this.layoutBuilder.destroy();
                this.layoutBuilder = null;
            }
        };

        this.initEquipTree = function () {
            var dom = this.layoutBuilder.dockLeft('equipTree', '设备', .2);

            this.equipTree = new EquipTree(dom, this.present.bind(this));
            this.equipTree.show();
        };

        this.destroyEquipTree = function () {
            if (this.equipTree) {
                this.layoutBuilder.unDock(this.equipTree.container.id);
                this.equipTree.close();
                this.equipTree = null;
            }
        };

        this.initStrategyTable = function () {
            var dom = this.layoutBuilder.dockFill('strategyTable', '策略');

            this.strategyTable = new StrategyTable(dom, this.present.bind(this));
            this.strategyTable.show();
        };

        this.destroyStrategyTable = function () {
            if (this.strategyTable) {
                this.layoutBuilder.unDock(this.strategyTable.container.id);
                this.strategyTable.close();
                this.strategyTable = null;
            }
        };

        this.initPropPanel = function () {
            var dom = this.layoutBuilder.dockRight('propPanel', '属性');

            this.propPanel = new PropPanel(dom, this.present.bind(this));
            this.propPanel.show();
        };

        this.destroyPropPanel = function () {
            if (this.propPanel) {
                this.layoutBuilder.unDock(this.propPanel.container.id);
                this.propPanel.close();
                this.propPanel = null;
            }
        };

        this.initStrategyTplTree = function () {
            var dom = this.layoutBuilder.dockFill('strategyTplTree', '规则', this.propPanel.container.id);

            this.strategyTplTree = new StrategyTplTree(dom, this.present.bind(this));
            this.strategyTplTree.show();
        };

        this.destroyStrategyTplTree = function () {
            if (this.strategyTplTree) {
                this.layoutBuilder.unDock(this.strategyTplTree.container.id);
                this.strategyTplTree.close();
                this.strategyTplTree = null;
            }
        };

        this.initSketchpad = function () {
            var dom = this.layoutBuilder.dockFill('sketchpad', '策略面板');

            this.sketchpad = new Sketchpad(dom, this.present.bind(this));
        };

        this.destroySketchpad = function () {
            if (this.sketchpad) {
                this.layoutBuilder.unDock(this.sketchpad.container.id);
                this.sketchpad.close();
                this.sketchpad = null;
            }
        };

    }.call(App.prototype);

    exports.App = App;
}));