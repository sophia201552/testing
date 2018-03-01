// factory.js - factory 入口

;(function (exports, screens) {

    var delayTimer = null;
    var DELAY_TIME = 300;

    function FactoryScreen() {
        // 页面面板容器
        this.pagePanelCtn = null;

        // 窗口管理器
        this.layout = {
            dockManager: null,
            documentNode: null,
            pagePanel: null
        }

        this.page = null;
        this.layerPanel = null;
        this.propPanel = null;
        this.historyPanel = null;
        this.windowPanel = null;
        this.pagePanel = null;
        this.dataSourcePanel = null;

        // 项目相关数据
        this.project = {};

        // 数据同步者
        this.syncWorker = null;

        // 初始化
        this.init();
        // 初始化布局
        this.initLayout();
        // 初始化数据同步者
        this.initSyncWorker();
    }

    FactoryScreen.prototype.show = function (item) {
        var _this = this;
        Spinner.spin(document.body);//Spinner.stop()在TreeView.prototype.show处结束
        this.project = AppConfig.project = {
            id: item.id,
            cnName: item.name_cn,
            bindId: item.bindId
        };
        AppConfig.projectTimeFormat = item.bindId?(BEOPUtil.getProjectFromAppConfig(item.bindId)?BEOPUtil.getProjectFromAppConfig(item.bindId).time_format:0):0;
        //显示项目名称
        $('#lkName').text(item.name_cn).attr("data-projId",item.id).attr("title",item.name_cn).closest('#pageNav').show().click(function(e){
            e.stopPropagation();
            $('#userNav li').toggleClass('open')
        });
        // 预加载步骤
        this.preLoad().done(function () {
            // 初始化页面管理面板
            _this.initPagePanel();
            _this.pagePanel.show();
            //Spinner.stop();
            // $("#lkPreviewProject").attr("href",'/factory/previewProject/' + _this.project.id);
        });
    };

    FactoryScreen.prototype.preLoad = function () {
        var promise = $.Deferred();
        
        return promise.resolve().then(function () {
            // 预加载数据源
            return WebAPI.get('/analysis/datasource/getDsItemInfo/' + AppConfig.userId + '/null').done(function (result) {
                AppConfig.datasource = new DataSource({
                    store: {
                        group: result
                    }
                });
            });
        });
    };

    FactoryScreen.prototype.init = function () {
        this.initNav();
    };
    FactoryScreen.prototype.generateTreeEx = function (arr) {
        var result = [];
        var params;
        for (var i = 0, len = arr.length; i < len; i++) {
            var item = arr[i];
            params = {id:item._id, pId:item.parent, name:item.text +' - '+ item.type, type: item.type};
            if ('DropDownList' == item.type) {
                params = {id:item._id, pId:item.parent, name:item.text, type: item.type};
                params.isParent = true;
                params.isHide = item.isHide;
                result.push(params);
            }
            else if ('PageScreen' == item.type) {
                params.isParent = false;
                params.isHide = item.isHide;
                params.isLock =item.isLock;
                params.layerList = item.layerList;
                params.width = item.width;
                params.height = item.height;
                params.display = item.display;
                result.push(params);
            }
            else {
                params.isParent = false;
                params.isHide = item.isHide;
                params.isLock =item.isLock;
                result.push(params);
            }
        }
        return result;
    };
    FactoryScreen.prototype.initNav = function () {
        var _this = this;

        $('#pageNav').hide();
        $('#pageTopTools').hide();

        // 顶部用户菜单的相关操作初始化
        // document.querySelector('#userAccount').innerHTML = window.AppConfig.account;

        // 切换项目
        $('#lkSwitchProject,#lkProjectLogo').off('click').click(function () {
            
            $('#mainframe').hide();
            $('#modalframe').show();
            FactoryLogin.prototype.createPro(AppConfig.userId);
            _this.close();
        });
        // 预览项目
        $('#lkPreviewProject').off('click').click(function () {
            $(this).attr('href','/factory/previewProject/'+AppConfig.userId+'/'+_this.project.id);
        });

        // 发布项目
        $('#lkRelease').off('click').click(function () {
            MergeNavModal.show(AppConfig.project.bindId, AppConfig.project.id, 'publish');
        });
        $('#userNav').show();
    };

    FactoryScreen.prototype.initLayoutDOM = function () {
        // 创建页面管理面板容器
        this.pagePanelCtn = document.createElement('div');
        this.pagePanelCtn.id = 'pagePanel';
        this.pagePanelCtn.setAttribute('caption', I18n.resource.mainPanel.attrPanel.attrTab.PAGE_MANAGE);//'页面管理'
        this.pagePanelCtn.dataset.type = 'PagePanel';
    };

    FactoryScreen.prototype.initLayout = function () {
        var _this = this;
        var divDockManager = document.querySelector('#panels');
        var dockManager = this.layout.dockManager = new dockspawn.DockManager(divDockManager);
        var onResized = function(e) {
            dockManager.resize(window.innerWidth - (divDockManager.clientLeft + divDockManager.offsetLeft), window.innerHeight - (divDockManager.clientTop + divDockManager.offsetTop));

            if (delayTimer) {
                window.clearTimeout(delayTimer);
                delayTimer = null;
            }

            delayTimer = window.setTimeout(function () {
                if(_this.page && typeof _this.page.resize === 'function'){
                    _this.page.resize();
                }
                window.clearTimeout(delayTimer);
                delayTimer = null;
            }, DELAY_TIME);
        };
        var documentNode, pagePanel;

        dockManager.initialize();
        // 自适应
        window.onresize = onResized;
        onResized(null);

        this.initLayoutDOM();

        this.layout.pagePanel = pagePanel = new dockspawn.PanelContainer(this.pagePanelCtn, dockManager);
        this.layout.documentNode = documentNode = dockManager.context.model.documentManagerNode;
        dockManager.dockRight(documentNode, pagePanel, .2);
    };

    FactoryScreen.prototype.initSyncWorker = function () {
        this.syncWorker && this.syncWorker.close();
        this.syncWorker = new SyncWorker(this);
        this.syncWorker.init();
    };

    FactoryScreen.prototype.initPagePanel = function () {
        this.pagePanel && this.pagePanel.close();
        this.pagePanel = new PagePanel(this);
        this.pagePanel.init();
    };

    FactoryScreen.prototype.showPage = function (page) {
        var modalClass;
        if (this.page) {
            this.page.close();
            this.page = null;
        }
        
        modalClass = screens[page.type];

        if (!modalClass) {
            Log.warn('page type not found: "' + page.type + '"');
            return;
        }

        this.page = new modalClass(page, this);
        this.page.show();
    };

    FactoryScreen.prototype.getPageList = function () {
        return this.pagePanel.getPageList();
    };

    FactoryScreen.prototype.getPagesData = function () {
        if (!this.page) return null;
        return this.page.getPagesData();
    };

    FactoryScreen.prototype.getLayersData = function () {
        if (!this.page) return null;
        return this.page.getLayersData();
    };

    FactoryScreen.prototype.getWidgetsData = function () {
        if (!this.page) return null;
        return this.page.getWidgetsData();
    };

    FactoryScreen.prototype.close = function () {
        // 销毁当前页面
        this.page && this.page.close();
        this.page = null;

        // 停止数据同步
        this.syncWorker && this.syncWorker.close();

        // 销毁所有停靠窗口
        this.pagePanel && this.pagePanel.close();
        if (this.layout.pagePanel.floatingDialog) {
            this.layout.pagePanel.floatingDialog.destroy();
        }
        this.layout.dockManager.context.model.rootNode.container.destroy();

        this.layout = {};
    };

    exports.FactoryScreen = FactoryScreen;
} ( namespace('factory'), namespace('factory.screens') ));