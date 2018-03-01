// index.js

+function () {

    function FactoryScreen() {
        this.toolbarCtn = document.querySelector('#toolbar');
        this.layerPanelCtn = document.querySelector('#layerPanel');
        this.propPanelCtn = document.querySelector('#propPanel');
        this.historyPanelCtn = document.querySelector('#historyPanel');
        this.pagePanelCtn = document.querySelector('#pagePanel');
        this.windowCtn = document.querySelector('#windows');
        this.painterCtn = this.windowCtn.querySelector('.window');

        this.page = undefined;
        this.layerPanel = undefined;
        this.propPanel = undefined;
        this.historyPanel = undefined;
        this.windowPanel = undefined;
        this.pagePanel = undefined;

        this.init();
    }

    FactoryScreen.prototype.show = function () {
        
    };

    FactoryScreen.prototype.init = function () {
        this.initLayout();
        
        // 初始化 painter
        this.page = new PageScreen(this.painterCtn);
        this.page.show();

        // 初始化 toolbar
        this.initToolbar();

        // 初始化页面管理面板
        this.initPagePanel();

        // 初始化图层面板
        this.initLayerPanel();

        // 初始化属性面板
        this.initPropPanel();

    };

    FactoryScreen.prototype.initLayout = function () {
        var divDockManager = document.querySelector('#panels');
        var dockManager = new dockspawn.DockManager(divDockManager);
        var onResized = function(e) {
            dockManager.resize(window.innerWidth - (divDockManager.clientLeft + divDockManager.offsetLeft), window.innerHeight - (divDockManager.clientTop + divDockManager.offsetTop));
        };
        var propPanel, layerPanel, historyPanel, windowPanel, toolbarPanel, pagePanel;
        var documentNode, windowNode, layerNode, historyNode;

        dockManager.initialize();
        // 自适应
        window.onresize = onResized;
        onResized(null);

        propPanel = new dockspawn.PanelContainer(this.historyPanelCtn, dockManager);
        layerPanel = new dockspawn.PanelContainer(this.layerPanelCtn, dockManager);
        historyPanel = new dockspawn.PanelContainer(this.propPanelCtn, dockManager);
        windowPanel = new dockspawn.PanelContainer(this.windowCtn, dockManager);
        pagePanel = new dockspawn.PanelContainer(this.pagePanelCtn, dockManager);

        documentNode = dockManager.context.model.documentManagerNode;
        dockManager.dockLeft(documentNode, pagePanel, .2);
        windowNode = dockManager.dockFill(documentNode, windowPanel);
        layerNode = dockManager.dockRight(documentNode, layerPanel, .2);
        historyNode = dockManager.dockDown(layerNode, historyPanel, .3);
        dockManager.dockDown(historyNode, propPanel, .4);
    };

    FactoryScreen.prototype.initToolbar = function () {
        this.toolbar = new Toolbar(this);
        this.toolbar.show();
    };

    FactoryScreen.prototype.initLayerPanel = function () {
        this.layerPanel = new LayerPanel(this);
        this.layerPanel.show();
    };

    FactoryScreen.prototype.initPropPanel = function () {
        this.propPanel = new PropertyPanel(this);
        this.propPanel.show();
    };

    FactoryScreen.prototype.initPagePanel = function () {
        this.pagePanel = new PagePanel(this);
        this.pagePanel.show();
    };

    $(function () {
        new FactoryScreen().show();
    });
}.call(this);

