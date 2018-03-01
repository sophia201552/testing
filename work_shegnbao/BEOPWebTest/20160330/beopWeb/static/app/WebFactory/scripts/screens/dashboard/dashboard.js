(function () {
    var _this;

    function EnergyScreen(page, screen) {
        _this = this;

        this.page = page;
        this.factoryScreen = screen;

        // 中间内容区域容器
        this.windowCtn = null;
        // 数据源面板容器
        this.dataSourcePanelCtn = null;
        // 可选模块面板容器
        this.modulePanelCtn = null;

        this.layout = {
            windowPanel: null,
            dataSourcePanel: null,
            modulePanel: null
        };

        // 可选模块面板
        this.modulePanel = null;
        // 数据源面板
        this.dataSourcePanel = null;
        // dashboard 配置框
        this.modalConfigPane = null;
        
        // dashboard 实际的显示区域
        this.container = null;
        this.$pageNav = null;

        this.store = {};
        this.listEntity = [];
        this.arrEntityOrder = [];
    }

    EnergyScreen.prototype.htmlUrl = '/static/app/WebFactory/views/energyScreen.html';

    EnergyScreen.prototype.show = function () {
        var _this = this;

        WebAPI.get(this.htmlUrl).done(function (html) {
            // 初始化布局
            _this.initLayout(html);
            // 初始化操作
            _this.init();
        });
    };

    EnergyScreen.prototype.onTabPageChanged = function (e) {
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
                        _this.modulePanel = new ModulePanel(_this);
                    }
                    _this.modulePanel.show();
                } else {
                    _this.modulePanel.hide();
                }
                break;
        }
    };

    EnergyScreen.prototype.getPageData = function () {
        // loading
        Spinner.spin(this.windowCtn);
        return WebAPI.get("/spring/get/" + this.page.id + '/' + AppConfig.isFactory)
            .always(function (e) {
                Spinner.stop();
            });
    };

    EnergyScreen.prototype.init = function () {
        var promise = this.getPageData();

        promise.done(function (rs) {
            this.store = rs;

            // 初始化导航条
            this.initNav();

            // 初始化配置模态框
            this.initConfigModal();

            // 初始化 可选模块 工厂类
            this.initIoc();

            // 初始化面板
            this.initPanels();

            // 初始化图元数据
            this.initModuleLayout();

            // 显示图元的配置模式
            this.showConfigMode();

            // 初始化同步机制
            this.initSync();

            // 设置一个记录点
            this.dataSign = this.getDataSign();

        }.bind(this));
    };

    EnergyScreen.prototype.getDataSign = function () {
        // 序列化字符串，用于记录当前数据的状态
        return JSON.stringify(this.listEntity) + JSON.stringify(this.arrEntityOrder);
    };

    EnergyScreen.prototype.initPanels = function () {
        // 初始化 数据源面板
        this.initDataSourcePanel();
        // 初始化 可选模块面板
        this.initModulePanel();
    };

    EnergyScreen.prototype.initSync = function () {
        // 注册 ctrl+s 保存事件
        window.addEventListener('keydown', this.onKeyDownActionPerformed, false);
        // 注册 beforeunload 事件
        window.addEventListener('beforeunload', this.onBeforeUnloadActionPerformed, false);
    };

    EnergyScreen.prototype.initNav = function () {
        var _this = this;

        this.$pageNav = $('#pageNav');
        this.$pageTopTools = $('#pageTopTools');

        $('a', this.$pageTopTools).hide();

        // 显示页面名称
        $('#lkName', this.$pageNav).text(this.page.name);
        // 数据同步链接
        $('#lkSync', this.$pageTopTools).off('click').click(function () {
            _this.saveLayout();
        }).show();
        // 更新链接
        $('#lkPreview', this.$pageTopTools).off('click').click(function () {
            $('#lkPreview').attr('href', '/factory/preview/' + _this.page.id);
        }).show();
        // 显示 Nav
        this.$pageNav.show();
        this.$pageTopTools.show();
    },

    /** 初始化 可选模块面板 */
    EnergyScreen.prototype.initModulePanel = function () {
        if(this.modulePanel) {
            this.modulePanel.close();
            this.modulePanel = null;
        }
        if( $(this.modulePanelCtn).is(':visible') ) {
            this.modulePanel = new ModulePanel(this);
            this.modulePanel.show();
        }
        this.modulePanelCtn.removeEventListener('dock.tabPage.changed', this.onTabPageChanged);
        this.modulePanelCtn.addEventListener('dock.tabPage.changed', this.onTabPageChanged, false);
    };

    EnergyScreen.prototype.initDataSourcePanel = function () {
        if(this.dataSourcePanel) {
            this.dataSourcePanel.close();
            this.dataSourcePanel = null;
        }
        if( $(this.dataSourcePanelCtn).is(':visible') ) {
            this.dataSourcePanel = new DataSourcePanel(this);
            this.dataSourcePanel.show();
        }
        this.dataSourcePanelCtn.removeEventListener('dock.tabPage.changed', this.onTabPageChanged);
        this.dataSourcePanelCtn.addEventListener('dock.tabPage.changed', this.onTabPageChanged, false);
    };

    EnergyScreen.prototype.initIoc = function () {
        this.factoryIoC = new FactoryIoC('dashboard');
    };

    EnergyScreen.prototype.initConfigModal = function () {
        this.modalConfigPane = new modalConfigurePane(this.windowCtn.querySelector('#energyModal'), this, 'dashboard');
        this.modalConfigPane.show();
    };

    EnergyScreen.prototype.initLayoutDOM = function (html) {
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

        // 中间内容区域面板容器
        this.windowCtn = document.createElement('div');
        this.windowCtn.id = 'windows';

        // 初始化中间区域的内部 DOM
        divMain = document.createElement('div');
        divMain.className = 'indexContent st-pusher';
        divMain.innerHTML = html;

        stCt = $('<div id="st-container" class="st-container gray-scrollbar">')[0];
        stCt.appendChild(divMain);
        this.windowCtn.appendChild(stCt);

        this.container = divMain.querySelector('#paneCenter');
        this.$container = $(_this.container);
    };

    EnergyScreen.prototype.initLayout = function (html) {
        var dockManager = this.factoryScreen.layout.dockManager;
        var documentNode = this.factoryScreen.layout.documentNode;
        var pageNode = this.factoryScreen.layout.pageNode;

        var windowPanel, dataSourcePanel, modulePanel;
        var windowNode, dataSourceNode, moduleNode;

        this.initLayoutDOM(html);

        this.layout.windowPanel = windowPanel = new dockspawn.PanelContainer(this.windowCtn, dockManager);
        this.layout.dataSourcePanel = dataSourcePanel = new dockspawn.PanelContainer(this.dataSourcePanelCtn, dockManager);
        this.layout.modulePanel = modulePanel = new dockspawn.PanelContainer(this.modulePanelCtn, dockManager);

        dataSourceNode = dockManager.dockFill(pageNode, dataSourcePanel);
        moduleNode = dockManager.dockFill(dataSourceNode, modulePanel);
        windowNode = dockManager.dockFill(documentNode, windowPanel);

        return {
            dataSourceNode: dataSourceNode,
            moduleNode: moduleNode,
            windowNode: windowNode
        };
    };

    EnergyScreen.prototype.initModuleLayout = function () {
        if (!(this.store && this.store.layout)) return;
        for (var i = 0, item; i < this.store.layout.length; i++) {
            for (var j = 0; j < this.store.layout[i].length; j++) {
                item = this.store.layout[i][j];
                var modelClass,entity;
                if (item.modal.type) {
                    //regist IoC
                    modelClass = this.factoryIoC.getModel(item.modal.type);
                    if(!modelClass) continue;
                    if (item.isNotRender) continue;
                    entity = new modelClass(this, item);
                    this.listEntity[item.id] = entity;
                    this.arrEntityOrder.push(item.id);
                }
            }
        }
        //如果一个页面只有entity且 spanR=6,spanC=12
        var $springCtn = $('#paneCenter').children('.springContainer');
        if($springCtn.length == 1 && parseFloat($springCtn[0].style.height) >= parseFloat("99%") && parseFloat($springCtn[0].style.width) >= parseFloat("99%")){
            $springCtn.children('.panel-default').css({border: 'none'});
        }
    };

    EnergyScreen.prototype.onKeyDownActionPerformed = function (e) {
        if (e.which === 83 && e.ctrlKey) {
            e.stopPropagation();
            e.preventDefault();
            try {
                _this.saveLayout();
            } catch (e) {
                Log.exception(e);
            }
        }
    };

    EnergyScreen.prototype.onBeforeUnloadActionPerformed = function (e) {
        // 判断是否有数据没有提交
        if ( _this.dataSign !== _this.getDataSign() ) {
            e.returnValue = I18n.resource.screen.UNSAVED_PAGE_TIP;
            return e.returnValue;
        }
    };

    EnergyScreen.prototype.showConfigMode = function () {
        Spinner.spin(document.getElementById('paneCenter'));
        for (var key in this.listEntity) {
            this.listEntity[key].configure();
        }
        Spinner.stop();
    };

    EnergyScreen.prototype.setEntity = function () {};

    EnergyScreen.prototype.removeEntity = function (id) {
        this.listEntity[id] = null;
        delete this.listEntity[id];
        this.arrEntityOrder.splice(this.arrEntityOrder.indexOf(id), 1);
    };

    EnergyScreen.prototype.rebornEntity = function (entityParams, tragetType, targetTitle, modalNoneEdit) {
        this.removeEntity(entityParams.id);

        entityParams.modal.type = tragetType;
        entityParams.modal.title = '';
        var modelClass = this.factoryIoC.getModel(tragetType);
        if ((!entityParams.isNotRender) && !modalNoneEdit) {
            if ('ModalInteract' == entityParams.modal.type) {
                entityParams.spanC = 9;
                entityParams.spanR = 3;
            }
            else if (entityParams.modal.type !== 'ModalMix') {
                entityParams.spanC = modelClass.prototype.optionTemplate.minWidth;
                entityParams.spanR = modelClass.prototype.optionTemplate.minHeight;
            }
        }
        var entity = new modelClass(this, entityParams);
        this.listEntity[entity.entity.id] = entity;
        this.arrEntityOrder.push(entity.entity.id);
        entity.configure();
    };

    EnergyScreen.prototype.saveLayout = function () {
        var _this = this;
        var arrEntity = [];
        var entity = null;

        for (var i = 0; i < this.arrEntityOrder.length; i++) {
            entity = this.listEntity[this.arrEntityOrder[i]].entity;
            if ( ['ModalObserver', 'ModalNote', 'ModalMix', 'ModalHtml', 'ModalChartCustom', 'ModalWeather'].indexOf(entity.modal.type) > -1 ) {
                arrEntity.push(entity);
            }else if(entity.modal.type == 'ModalPointKPI'){
                arrEntity.push(this.dealWithEntity(entity));
            }else if(entity.modal.type == 'ModalReportChapter'){
                if(entity.modal.option && entity.modal.option.menuId && entity.modal.option.menuId != ''){
                    arrEntity.push(entity);
                }
            }else {
                if (entity.modal.type != 'ModalNone' && (!entity.modal.points || entity.modal.points.length == 0)) continue;
                arrEntity.push(entity);
            }
        }
        var data = {
            creatorId: AppConfig.userId,
            menuItemId: this.page.id,
            isFactory: AppConfig.isFactory,
            layout: [arrEntity]
        };
        this.store.id && (data.id = this.store.id);

        WebAPI.post('/spring/saveLayout', data).done(function (result) {
            // 更新 storeSerializedStr, 标识存储的数据被更改
            _this.dataSign = _this.getDataSign();
        });
    };

    EnergyScreen.prototype.dealWithEntity = function(entity){
        entity.modal.points = [];
        entity.modal.interval = 5;
        entity.modal.option && entity.modal.option.kpiList && entity.modal.option.kpiList.forEach(function(kpiItem){
            traverseTree(kpiItem);
        });
        function traverseTree(tree) {
            dealWithNode(tree);
            traverse(tree, 0);
        }
        function traverse(node, i) {//广度优先遍历
            var children = node.list;
            if (children != null && children.length > 0) {
                dealWithNode(children[i]);
                if (i == children.length - 1) {
                    for(var j = 0; j < children.length; j++){
                        traverse(children[j], 0);
                    }
                } else {
                    traverse(node, i + 1);
                }
            }
        }
        function dealWithNode(child){
            delete child.pointPassData;
            delete child.show;
            if(child.pointKPI){
                entity.modal.points.push(child.pointKPI);
            }
            if(child.pointGrade){
                entity.modal.points.push(child.pointGrade);
            }
            if(child.pointPass){
                entity.modal.points.push(child.pointPass);
            }
        }
        return entity;
    };

    EnergyScreen.prototype.destroyLayouts = function () {
        var dockManager = this.factoryScreen.layout.dockManager;
        // 销毁所有面板
        for (var layout in this.layout) {
            dockManager.requestUndock(this.layout[layout]);
        }

        this.layout = {};
    };

    EnergyScreen.prototype.close = function () {
        // 隐藏 页面导航条
        this.$pageNav.hide();
        this.$pageTopTools.hide();
        $('#lkSync', this.$pageNav).off();

        // 清除 ctrl+s 保存事件
        window.removeEventListener('keydown', this.onKeyDownActionPerformed);
        // 清除 beforeunload 事件
        window.removeEventListener('beforeunload', this.onBeforeUnloadActionPerformed);

        // 销毁配置窗口
        if (this.modalConfigPane) {
            this.modalConfigPane.close();
        }
        // 销毁遗留的异常DOM
        $('.datetimepicker').remove();
        // 销毁布局
        this.destroyLayouts();
    };

    namespace('factory.screens').EnergyScreen = EnergyScreen;
})();
