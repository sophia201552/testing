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

        this.initNav = function () {
            SuperClass.prototype.initNav.apply(this, arguments);

            // 重置预览链接
            $('#lkPreview', this.$pageTopTools)
                .attr('href', '/factory/preview/report/' + this.page.id);
        };

        /* override */
        this.initLayoutDOM = function (html) {
            var divMain, stCt;
            // 创建数据源面板容器
            this.dataSourcePanelCtn = document.createElement('div');
            this.dataSourcePanelCtn.id = 'dataSourcePanel';
            this.dataSourcePanelCtn.className = 'factoryDs';
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
            this.reportTplPanelCtn.className = 'gray-scrollbar';
            this.reportTplPanelCtn.setAttribute('caption', I18n.resource.report.REPORT_NAME);//I18n.resource.report.REPORT_NAME
            this.reportTplPanelCtn.dataset.type = 'ReportTplPanelCtn';
            $(this.reportTplPanelCtn).css({ "overflow-y": "auto", "overflow-x": "hidden" });

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
            var dockManager = this.facScreen.layout.dockManager;
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
        this.initModuleLayout = function (type) {
            var layouts = this.store.layout[0] || [];
            var options, Clazz;
            var modal;
            
            if (!type || type === 'Container') {
                type = 'ReportContainer';
            }
            Clazz = namespace('factory.report.components')[type];

            if (layouts.length === 1 && 
                ['Container', 'ReportContainer', 'ChapterContainer'].indexOf(layouts[0].modal.type) > -1 ) {
                modal = $.extend(false, layouts[0].modal, {type: type});
            }
            // 对旧数据和模板做个兼容
            else {
                modal = {
                    option: {
                        layouts: layouts,
                        period: 'day'
                    },
                    type: type
                };
            }

            this.reportEntity = new Clazz(this, {
                spanC: 12,
                spanR: 6,
                modal: modal
            });

            this.reportEntity.render(true);
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
        this.saveLayout = function (callback) {
            var _this = this;

            var data = {
                creatorId: AppConfig.userId,
                menuItemId: this.page.id,
                isFactory: AppConfig.isFactory,
                layout: [[this.reportEntity.entity]]
            };

            if (!this.store.id) {
                Log.warn('do not give an id when save data to spring layout table, will create a new id. If you see this frequently, there must be some thing wrong.');
                this.store.id = ObjectId();
            }
            data.id = this.store.id;

            WebAPI.post('/spring/saveLayout', data).done(function (result) {
                // 更新 storeSerializedStr, 标识存储的数据被更改
                _this.dataSign = _this.getDataSign();
                // 执行成功回调
                typeof callback === 'function' && callback(1);
            }).fail(function () {
                // 执行失败回调
                typeof callback === 'function' && callback(0);
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