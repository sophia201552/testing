;
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([
            'exports',
            '../App/actions.js',
            '../../util/layoutBuilder.js',
            '../EquipTree/index.js',
            '../StrategyTable/index.js',
            '../PropPanel/index.js',
            '../Painter/index.js',
            '../Sketchpad/sketchpad.js',
            '../DataSourcePanel/index.js',
            '../ModuleConfigPanel/moduleConfigPanel.js'
        ], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(exports,
            require('../App/actions.js'),
            require('../../util/layoutBuilder.js'),
            require('../EquipTree/index.js'),
            require('../StrategyTable/index.js'),
            require('../PropPanel/index.js'),
            require('../Painter/index.js'),
            require('../Sketchpad/sketchpad.js'),
            require('../DataSourcePanel/index.js'),
            require('../ModuleConfigPanel/moduleConfigPanel.js')
        );
    } else {
        factory(
            root,
            namespace('beop.strategy.components.App.actions'),
            namespace('beop.util.LayoutBuilder'),
            namespace('beop.strategy.components.EquipTree.Index'),
            namespace('beop.strategy.components.StrategyTable.Index'),
            namespace('beop.strategy.components.PropPanel.Index'),
            namespace('beop.strategy.components.StrategyTplTree.Index'),
            namespace('beop.strategy.components.Painter.Index'),
            namespace('beop.strategy.components.Sketchpad.Index'),
            namespace('beop.strategy.components.DataSourcePanel.Index'),
            namespace('beop.strategy.components.ModuleConfigPanel.Index')
        );
    }
}(namespace('beop.strategy.components'), function(
    exports,
    actions,
    LayoutBuilder,
    EquipTree,
    StrategyTable,
    PropPanel,
    StrategyTplTree,
    Painter,
    Sketchpad,
    DataSourcePanel,
    ModuleConfigPanel
) {

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
        this.dataSourcePanel = null;
        this.moduleConfigPanel = null;
        this.strategyTplTree = null;

        this.init();
    }

    // PROTOTYPES
    +

    function() {
        /**
         * Constructor
         */
        this.constructor = App;

        /**
         * initialize app
         */
        this.init = function() {
            actions.init(this.present.bind(this));
        };

        this.show = function() {
            this.initLayout();

            this.initEquipTree();

            this.initPropPanel();

            this.initStrategyTable();
        };

        this.present = function(data) {
            if (data.from) {
                switch (data.from) {
                    case 'StrategyTable':
                        this.destroyPropPanel();
                        if (data.action === 'dblclickRow') {
                            this.initStrategyTplTree();
                            this.initDataSourcePanel();
                            this.initPainter(data.id);
                        }
                        break;
                    case 'Painter':
                        if (data.action === 'back') {
                            this.destroyPainter();
                            this.destroyStrategyTplTree();
                            this.destroyDataSourcePanel();

                            this.initPropPanel();
                        } else if (data.action === 'showModuleConfigPanel') {
                            this.destroyEquipTree();
                            this.initModuleConfigPanel(data.store);
                        } else if (data.action === 'closeModuleConfigPanel') {
                            this.destroyModuleConfigPanel();
                            this.initEquipTree();
                        }
                        break;
                    case 'ModuleConfigPanel':
                        if (data.action === 'quit') {
                            this.destroyModuleConfigPanel();
                            this.initEquipTree();
                            this.painter && this.painter.repaint();
                        }
                        break;
                    default:
                        Log.warn('not supporting type: ' + data.from);
                        break;
                }
            }
        };

        this.close = function() {
            this.destroyEquipTree();
            this.destroyPropPanel();
            this.destroyStrategyTable();
            this.destroySketchpad();
            this.destroyPainter();
            this.destroyStrategyTplTree();
            this.destroyDataSourcePanel();
            this.destroyLayout();
        };

        this.initLayout = function() {
            if (!this.layoutBuilder) {
                this.layoutBuilder = LayoutBuilder.init(this.container);
            }
        };

        this.destroyLayout = function() {
            if (this.layoutBuilder) {
                this.layoutBuilder.destroy();
                this.layoutBuilder = null;
            }
        };

        this.initEquipTree = function() {
            var dom = this.layoutBuilder.dockLeft('equipTree', '设备', .2);

            this.equipTree = new EquipTree(dom);
            this.equipTree.show();
        };

        this.destroyEquipTree = function() {
            if (this.equipTree) {
                this.layoutBuilder.unDock(this.equipTree.container.id);
                this.equipTree.close();
                this.equipTree = null;
            }
        };

        this.initStrategyTable = function() {
            var dom = this.layoutBuilder.dockFill('strategyTable', '策略');

            this.strategyTable = new StrategyTable(dom);
            this.strategyTable.show();
        };

        this.destroyStrategyTable = function() {
            if (this.strategyTable) {
                this.layoutBuilder.unDock(this.strategyTable.container.id);
                this.strategyTable.close();
                this.strategyTable = null;
            }
        };

        this.initPropPanel = function() {
            var dom = this.layoutBuilder.dockRight('propPanel', '属性');

            this.propPanel = new PropPanel(dom);
            this.propPanel.show();
        };

        this.destroyPropPanel = function() {
            if (this.propPanel) {
                this.layoutBuilder.unDock(this.propPanel.container.id);
                this.propPanel.close();
                this.propPanel = null;
            }
        };

        this.initStrategyTplTree = function() {
            var dom = this.layoutBuilder.dockRight('strategyTplTree', '规则');

            this.strategyTplTree = new StrategyTplTree(dom);
            this.strategyTplTree.show();
        };

        this.destroyStrategyTplTree = function() {
            if (this.strategyTplTree) {
                this.layoutBuilder.unDock(this.strategyTplTree.container.id);
                this.strategyTplTree.close();
                this.strategyTplTree = null;
            }
        };

        this.initDataSourcePanel = function() {
            var _this = this;
            var dom = this.layoutBuilder.dockFill('dataSourcePanel', '数据源', this.strategyTplTree.container.id);
            _this.dataSourcePanel = new DataSourcePanel(dom);
            _this.dataSourcePanel.show();

        };

        this.destroyDataSourcePanel = function() {
            if (this.dataSourcePanel) {
                this.layoutBuilder.unDock(this.dataSourcePanel.container.id);
                this.dataSourcePanel.close();
                this.dataSourcePanel = null;
            }
        };

        this.initPainter = function(strategyId) {
            var dom = this.layoutBuilder.dockFill('painter', '策略面板');
            this.painter = new Painter(dom, {
                strategyId: strategyId
            });
            this.painter.show();
        }

        this.destroyPainter = function() {
            if (this.painter) {
                this.layoutBuilder.unDock(this.painter.container.id);
                this.painter.close();
                this.painter = null;
            }
        };

        this.initSketchpad = function() {
            var dom = this.layoutBuilder.dockFill('sketchpad', '策略面板');

            this.sketchpad = new Sketchpad(dom);
        };

        this.destroySketchpad = function() {
            if (this.sketchpad) {
                this.layoutBuilder.unDock(this.sketchpad.container.id);
                this.sketchpad.close();
                this.sketchpad = null;
            }
        };

        this.initModuleConfigPanel = function(data) {
            var dom = this.layoutBuilder.dockFill('moduleConfig', '策略模块配置');

            this.moduleConfigPanel = new ModuleConfigPanel(dom, {
                store: data
            });
            this.moduleConfigPanel.show();
        };

        this.destroyModuleConfigPanel = function() {
            if (this.moduleConfigPanel) {
                this.layoutBuilder.unDock(this.moduleConfigPanel.container.id);
                this.moduleConfigPanel.close();
                this.moduleConfigPanel = null;
            }
        };

    }.call(App.prototype);

    exports.App = App;
}));