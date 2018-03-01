;(function (exports, SuperClass, ReportModulePanel, ReportTplPanel) {
    var _this;

    function FacReportScreen() {
        SuperClass.apply(this, arguments);
        _this = this;
        this.layout.reportTplPanel = null;
        this.reportTplPanel = null;
    }

    FacReportScreen.prototype = Object.create(SuperClass.prototype);

    +function () {

        this.htmlUrl = '/static/app/WebFactory/views/reportScreen.html';

        this.initIoc = function() {
            this.factoryIoC = new FactoryIoC('report');
        };

        this.initPanels = function () {
            SuperClass.prototype.initPanels.call(this);

            this.initReportTplPanel();
        };

        /* override */
        this.initLayoutDOM = function (html) {
            var divMain, stCt;
            // 创建数据源面板容器
            this.dataSourcePanelCtn = document.createElement('div');
            this.dataSourcePanelCtn.id = 'dataSourcePanel';
            this.dataSourcePanelCtn.setAttribute('caption', I18n.resource.dataSource.TITLE);
            this.dataSourcePanelCtn.dataset.type = 'DataSourcePanel';

            // 图元面板容器
            this.modulePanelCtn = document.createElement('div');
            this.modulePanelCtn.id = '';
            this.modulePanelCtn.setAttribute('caption', I18n.resource.toolBox.TITLE);
            this.modulePanelCtn.dataset.type = 'ModulePanel';

            // 素材面板容器面板容器
            this.reportTplPanelCtn = document.createElement('div');
            this.reportTplPanelCtn.id = '';
            this.reportTplPanelCtn.setAttribute('caption', '报表模板');
            this.reportTplPanelCtn.dataset.type = 'ReportTplPanelCtn';

            // 中间内容区域面板容器
            this.windowCtn = document.createElement('div');
            this.windowCtn.id = 'windows';
            this.windowCtn.className = 'gray-scrollbar report-wrap';
            // 初始化中间区域的内部 DOM
            this.windowCtn.innerHTML = html;

            this.container = this.windowCtn.querySelector('#reportWrap');
            this.$container = $(this.container);
        };

        /* @override */
        this.initLayout = function () {
            var dockManager = this.factoryScreen.layout.dockManager;
            var nodes = SuperClass.prototype.initLayout.apply(this, arguments);

            this.layout.reportTplPanel = new dockspawn.PanelContainer(this.reportTplPanelCtn, dockManager);
            dockManager.dockFill(nodes.moduleNode, this.layout.reportTplPanel);
        };

        /* @override */
        this.getDataSign = function () {
            // 序列化字符串，用于记录当前数据的状态
            return JSON.stringify(this.reportEntity.entity.modal.option.layouts);
        };

        /* @override */
        this.initConfigModal = function () {};

        /* @override */
        this.initModulePanel = function () {
            if(this.modulePanel) {
                this.modulePanel.close();
                this.modulePanel = null;
            }
            if( $(this.modulePanelCtn).is(':visible') ) {
                this.modulePanel = new ReportModulePanel(this);
                this.modulePanel.show();
            }
            this.modulePanelCtn.removeEventListener('dock.tabPage.changed', this.onTabPageChanged);
            this.modulePanelCtn.addEventListener('dock.tabPage.changed', this.onTabPageChanged, false);
        };  

        /** 初始化报表素材面板 */
        this.initReportTplPanel = function () {
            if(this.reportTplPanel) {
                this.reportTplPanel.close();
                this.reportTplPanel = null;
            }
            if( $(this.reportTplPanelCtn).is(':visible') ) {
                this.reportTplPanel = new ReportTplPanel(this);
                this.reportTplPanel.show();
            }
            this.reportTplPanelCtn.removeEventListener('dock.tabPage.changed', this.onTabPageChanged);
            this.reportTplPanelCtn.addEventListener('dock.tabPage.changed', this.onTabPageChanged, false);
        };

        /* @override */
        this.initModuleLayout = function () {
            var Clazz = namespace('factory.report.components.Container');
            window.reportEntity = this.reportEntity = new Clazz(this, {
                spanC: 12,
                spanR: 6,
                modal: {
                    option: {
                        layouts: this.store.layout[0]
                    }
                },
                type: 'Container'
            });

            this.reportEntity.render();

            this.reportEntity.refreshTitle();
        };

        /* @override */        
        this.onTabPageChanged = function (e) {
            var isShow = e.detail;
            var type = e.currentTarget.dataset.type;

            switch(type) {
                case 'DataSourcePanel':
                    if(isShow) {
                        if(_this.dataSourcePanel === null) {
                            _this.dataSourcePanel = new DataSourcePanel(_this);
                        }
                        _this.dataSourcePanel.show();
                    } else {
                        _this.dataSourcePanel.hide();
                    }
                    break;
                case 'ModulePanel':
                    if(isShow) {
                        if(_this.modulePanel === null) {
                            _this.modulePanel = new ReportModulePanel(_this);
                        }
                        _this.modulePanel.show();
                    } else {
                        _this.modulePanel.hide();
                    }
                    break;
                case 'ReportTplPanel':
                    if(isShow) {
                        if(_this.reportTplPanel === null) {
                            _this.reportTplPanel = new ReportTplPanel(_this);
                        }
                        _this.reportTplPanel.show();
                    } else {
                        _this.reportTplPanel.hide();
                    }
                    break;
                case 'ReportTplParamsPanel':
                    if(isShow) {
                        if(_this.reporTplParamsPanel === null) {
                            _this.reporTplParamsPanel = new ReportTplPanel(_this);
                        }
                        _this.reporTplParamsPanel.show();
                    } else {
                        _this.reporTplParamsPanel.hide();
                    }
                    break;
            }
        };

        /* @override */
        this.saveLayout = function () {
            var _this = this;
            var layouts = this.reportEntity.entity.modal.option.layouts;

            var data = {
                creatorId: AppConfig.userId,
                menuItemId: this.page.id,
                isFactory: AppConfig.isFactory,
                layout: [layouts]
            };
            this.store.id && (data.id = this.store.id);

            WebAPI.post('/spring/saveLayout', data).done(function (result) {
                // 更新 storeSerializedStr, 标识存储的数据被更改
                _this.dataSign = _this.getDataSign();
            });
        };

        /** @override */
        this.showConfigMode = function () {};

    }.call(FacReportScreen.prototype);

    exports.FacReportScreen = FacReportScreen;
} ( namespace('factory.screens'), 
    namespace('factory.screens.EnergyScreen'), 
    namespace('factory.panels.ReportModulePanel'),
    namespace('factory.panels.ReportTplPanel') ));