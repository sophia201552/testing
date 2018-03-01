;(function (exports, SuperClass, ReportTplParamsPanel) {

    function FacReportTplScreen() {
        SuperClass.apply(this, arguments);
    }

    FacReportTplScreen.prototype = Object.create(SuperClass.prototype);

    +function () {

        /** @override */
        this.initPanels = function () {
            SuperClass.prototype.initPanels.call(this);

            this.initReportTplParamsPanel();
        };

        /** @override */
        this.getPageData = function () {
            var promise = null;
            // loading
            Spinner.spin(this.windowCtn);
            promise = WebAPI.get("/factory/template/" + this.page.id);
            promise.always(function () {
                Spinner.stop();
            });
            return promise.then(function (rs) {
                var p = {};
                if (rs.content) {
                    p.layout = [rs.content.layouts];
                } else {
                    p.layout = [[]];
                }
                return p;
            });
        };

        /** @override */
        this.initNav = function () {
            var _this = this;

            this.$pageNav = $('#pageNav');
            this.$pageTopTools = $('#pageTopTools');

            $('a', this.$pageTopTools).hide();
            // 显示页面名称
            $('#lkName', this.$pageNav)
                .text('模板编辑 - ' + this.page.name).show();
            // '保存'按钮
            $('#lkSync').off().on('click', function () {
                _this.saveLayout();
            }).show();
            // '预览'按钮
            // $('#lkPreview').off().on('click', function () {

            // }).show();
            // '退出编辑'按钮
            $('#lkQuit').off().on('click', function () {
                _this.close();
            }).show();

            this.$pageTopTools.show();
            this.$pageNav.show();
        };

        // 初始化报表参数 Panel
        this.initReportTplParamsPanel = function () {
            if(this.reportTplParamsPanel) {
                this.reportTplParamsPanel.close();
                this.reportTplParamsPanel = null;
            }
            if( $(this.reportTplParamsPanelCtn).is(':visible') ) {
                this.reportTplParamsPanel = new ReportTplParamsPanel(this, this.reportTplParamsPanelCtn);
                this.reportTplParamsPanel.show();
            }
            this.reportTplParamsPanelCtn.removeEventListener('dock.tabPage.changed', this.onTabPageChanged);
            this.reportTplParamsPanelCtn.addEventListener('dock.tabPage.changed', this.onTabPageChanged, false);
        };

        /** @override */
        this.initLayoutDOM = function () {
            SuperClass.prototype.initLayoutDOM.apply(this, arguments);

            // 添加参数配置 Panel
            this.reportTplParamsPanelCtn = document.createElement('div');
            this.reportTplParamsPanelCtn.setAttribute('caption', '模板参数配置');
            this.reportTplParamsPanelCtn.dataset.type = 'ReportTplParamsPanelCtn';
        };

        /** @override */
        this.initLayout = function () {
            var dockManager = this.factoryScreen.layout.dockManager;
            var documentNode = this.factoryScreen.layout.documentNode;

            var windowPanel, dataSourcePanel, modulePanel;
            var windowNode, dataSourceNode, moduleNode;

            this.initLayoutDOM.apply(this, arguments);

            this.layout.windowPanel = windowPanel = new dockspawn.PanelContainer(this.windowCtn, dockManager);
            this.layout.dataSourcePanel = dataSourcePanel = new dockspawn.PanelContainer(this.dataSourcePanelCtn, dockManager);
            this.layout.modulePanel = modulePanel = new dockspawn.PanelContainer(this.modulePanelCtn, dockManager);
            this.layout.reportTplPanel = new dockspawn.PanelContainer(this.reportTplPanelCtn, dockManager);
            this.layout.reportTplParamsPanel = new dockspawn.PanelContainer(this.reportTplParamsPanelCtn, dockManager);

            dataSourceNode = dockManager.dockRight(documentNode, dataSourcePanel, .2);
            moduleNode = dockManager.dockFill(dataSourceNode, modulePanel);
            windowNode = dockManager.dockFill(documentNode, windowPanel);
            dockManager.dockFill(moduleNode, this.layout.reportTplPanel);
            dockManager.dockDown(moduleNode, this.layout.reportTplParamsPanel, .5);

        };

        this.initModuleLayout = function () {
            SuperClass.prototype.initModuleLayout.apply(this, arguments);

            this.reportTplParamsPanel.refresh();
        };

        /** @override */
        this.saveLayout = function () {
            var _this = this;
            var layouts = this.reportEntity.entity.modal.option.layouts;

            var data = {
                _id: this.page.id,
                content: {
                    layouts: layouts
                }
            };

            WebAPI.post('/factory/material/edit', data).done(function (result) {
                // 更新 storeSerializedStr, 标识存储的数据被更改
                _this.dataSign = _this.getDataSign();
            });
        };

        // 应用模板参数
        this.applyTplParams = function (params) {
            this.reportEntity.applyTplParams(params);
            this.reportEntity.render();
        };

        // 获取模板参数列表
        this.getTplParams = function () {
            return this.reportEntity.getTplParams();
        };

        this.close = function () {
            SuperClass.prototype.close.apply(this, arguments);

            this.reportTplParamsPanel = null;
            this.reportTplParamsPanelCtn = null;

            // 同时销毁 factory screen
            this.factoryScreen.close();
        };

    }.call(FacReportTplScreen.prototype);

    exports.FacReportTplScreen = FacReportTplScreen;

} ( namespace('factory.screens'), 
    namespace('factory.screens.FacReportScreen'),
    namespace('factory.panels.ReportTplParamsPanel') ));