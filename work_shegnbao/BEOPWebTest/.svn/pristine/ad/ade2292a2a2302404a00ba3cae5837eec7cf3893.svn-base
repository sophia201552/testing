/**
 * PageScreen
 */
(function () {
    var _this;

    function PageScreen(page, screen) {
        _this = this;
        this.page = page;
        this.factoryScreen = screen;

        // 工具箱容器
        this.toolbarCtn = null;
        // 图层面板容器
        this.layerPanelCtn = null;
        // 属性面板容器
        this.propPanelCtn = null;
        // 历史记录面板容器
        this.historyPanelCtn = null;
        // 中间内容区域容器
        this.windowCtn = null;
        // 绘图区域容器
        this.painterCtn = null;
        // 数据源面板容器
        this.dataSourcePanelCtn = null;

        this.layout = {
            layerPanel: null,
            propPanel: null,
            historyPanel: null,
            windowPanel: null,
            dataSourcePanel: null
        };

        this.$pageNav = null;

        this.toolbar = null;
        this.painter = null;
        this.layerPanel = null;
        this.propPanel = null;
        this.historyPanel = null;
        this.dataSourcePanel = null;

        this.store = {};
        this.store.layerModelSet = new ModelSet();
        this.store.widgetModelSet = new ModelSet();
        this.store.imageModelSet = new ModelSet();
        this.store.snapshotModelSet = new ModelSet();

        this.historyController = null;
    }

    PageScreen.prototype = {
        show: function () {
            // 初始化 页面导航条 先
            this.initNav();

            if (this.page.layerList.length === 0) {
                this.init();
                // 初始化 worker
                this.initSyncData();
                // 新增 HTML 图层和背景图层
                this.store.layerModelSet.append([
                    new NestedModel( window.layers.html.getEmptyEntity() ),
                    new NestedModel( window.layers.bg.getEmptyEntity() )
                ]);
                // 对于新增的页面，默认添加背景和Html图层，并立即同步一次
                this.factoryScreen.syncWorker.sync();

                // 初始化 "历史记录" 控制器
                this.initHistoryController();
                return;
            }

            WebAPI.get('/factory/getPageDetail/'+this.page.id+'/1').done(function (rs) {
                if(!rs || !rs.data) {
                    Log.error('get page detail faild!');
                }
                // 初始化控件
                this.init();
                // 将数据转换成可监控的数据
                this.updateModelSet(rs.data);
                // 初始化 worker
                this.initSyncData();
                // 初始化 "历史记录" 控制器
                this.initHistoryController();
            }.bind(this));
        },
        initNav: function () {
            this.$pageNav = $('#pageNav');
            // 显示页面名称
            $('#lkName', this.$pageNav).text(this.page.name);
            // 数据同步链接
            $('#lkSync', this.$pageNav).off('click').click(function () {
                _this.factoryScreen.syncWorker.sync();
            });
            // 更新链接
            $('#lkPreview', this.$pageNav).attr('href', '/factory/preview/'+this.page.id);
            // 显示 Nav
            this.$pageNav.show();
        },
        initHistoryController: function () {
            this.historyController = new window.HistoryController(this);
            this.historyController.init();
        },
        initSyncData: function () {
            this.factoryScreen.syncWorker.initLayersData(this.getLayersData());
            this.factoryScreen.syncWorker.initWidgetsData(this.getWidgetsData());
        },
        initLayoutDOM: function () {
            // 创建属性面板容器
            this.propPanelCtn = document.createElement('div');
            this.propPanelCtn.id = 'propPanel';
            this.propPanelCtn.setAttribute('caption', '属性');
            this.propPanelCtn.dataset.type = 'PropPanel';

            // 创建历史记录面板容器
            this.historyPanelCtn = document.createElement('div');
            this.historyPanelCtn.id = 'historyPanel';
            this.historyPanelCtn.setAttribute('caption', '历史记录');
            this.historyPanelCtn.dataset.type = 'HistoryPanel';

            // 创建图层记录面板容器
            this.layerPanelCtn = document.createElement('div');
            this.layerPanelCtn.id = 'layerPanel';
            this.layerPanelCtn.setAttribute('caption', '图层');
            this.layerPanelCtn.dataset.type = 'LayerPanel';

            // 创建数据源面板容器
            this.dataSourcePanelCtn = document.createElement('div');
            this.dataSourcePanelCtn.id = 'dataSourcePanel';
            this.dataSourcePanelCtn.setAttribute('caption', '数据源');
            this.dataSourcePanelCtn.dataset.type = 'DataSourcePanel';

            // 中间内容区域面板容器
            this.windowCtn = document.createElement('div');
            this.windowCtn.id = 'windows';
            
            this.toolbarCtn = document.createElement('div');
            this.toolbarCtn.id = 'toolbar';
            this.toolbarCtn.className = 'toolbar';
            this.windowCtn.appendChild(this.toolbarCtn);

            this.painterCtn = document.createElement('div');
            this.painterCtn.className = 'window';
            this.windowCtn.appendChild(this.painterCtn);
        },
        initLayout: function () {
            var dockManager = this.factoryScreen.layout.dockManager;
            var documentNode = this.factoryScreen.layout.documentNode;
            var pageNode = this.factoryScreen.layout.pageNode;

            var propPanel, layerPanel, historyPanel, windowPanel, dataSourcePanel;
            var windowNode, layerNode, historyNode, dataSourceNode;

            this.initLayoutDOM();

            this.layout.propPanel = propPanel = new dockspawn.PanelContainer(this.propPanelCtn, dockManager);
            this.layout.layerPanel = layerPanel = new dockspawn.PanelContainer(this.layerPanelCtn, dockManager);
            this.layout.historyPanel = historyPanel = new dockspawn.PanelContainer(this.historyPanelCtn, dockManager);
            this.layout.windowPanel = windowPanel = new dockspawn.PanelContainer(this.windowCtn, dockManager);
            this.layout.dataSourcePanel = dataSourcePanel = new dockspawn.PanelContainer(this.dataSourcePanelCtn, dockManager);

            dataSourceNode = dockManager.dockFill(pageNode, dataSourcePanel);
            historyNode = dockManager.dockFill(pageNode, historyPanel);
            layerNode = dockManager.dockFill(pageNode, layerPanel, .2);
            dockManager.dockDown(layerNode, propPanel, .4);
            windowNode = dockManager.dockFill(documentNode, windowPanel);
        },
        init: function () {
            // 初始化布局
            this.initLayout();

            // 初始化 painter
            if(this.painter) {
                this.painter.close();
            }
            window.painter = this.painter = new GPainter(this);
            this.painter.show();

            // 初始化 toolbar
            if(this.toolbar) {
                this.toolbar.close();
            }

            this.toolbar = new Toolbar(this);
            this.toolbar.show();

            // 初始化 图层面板
            this.initLayerPanel();

            // 初始化 属性面板
            this.initPropPanel();

            //初始化 历史记录面板
            this.initHistoryPanel();

            // 初始化 数据源面板
            this.initDataSourcePanel();

            // 绑定图层监控事件
            this.bindLayerModelSetOb();
        },
        initLayerPanel: function () {
            if(this.layerPanel) {
                this.layerPanel.close();
                this.layerPanel = null;
            }
            if( $(this.layerPanelCtn).is(':visible') ) {
                this.layerPanel = new LayerPanel(this);
                this.layerPanel.show();
            }
            this.layerPanelCtn.removeEventListener('dock.tabPage.changed', this.onTabPageChanged);
            this.layerPanelCtn.addEventListener('dock.tabPage.changed', this.onTabPageChanged, false);
        },
        initPropPanel: function () {
            if(this.propPanel) {
                this.propPanel.close();
                this.propPanel = null;
            }
            if( $(this.propPanelCtn).is(':visible') ) {
                this.propPanel = new PropertyPanel(this);
                this.propPanel.show();
            }
            this.propPanelCtn.removeEventListener('dock.tabPage.changed', this.onTabPageChanged);
            this.propPanelCtn.addEventListener('dock.tabPage.changed', this.onTabPageChanged, false);
        },
        initHistoryPanel: function () {
            if(this.historyPanel) {
                this.historyPanel.close();
                this.historyPanel = null;
            }
            if( $(this.historyPanelCtn).is(':visible') ) {
                this.historyPanel = new HistoryPanel(this);
                this.historyPanel.show();
            }
            this.historyPanelCtn.removeEventListener('dock.tabPage.changed', this.onTabPageChanged);
            this.historyPanelCtn.addEventListener('dock.tabPage.changed', this.onTabPageChanged, false);
        },
        initDataSourcePanel: function () {
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
        },
        onTabPageChanged: function (e) {
            var isShow = e.detail;
            var type = e.currentTarget.dataset.type;

            switch(type) {
                case 'LayerPanel':
                    if(isShow) {
                        if(_this.layerPanel === null) {
                            _this.layerPanel = new LayerPanel(_this);
                        }
                        _this.layerPanel.show();
                    } else {
                        _this.layerPanel.hide();
                    }
                    break;
                case 'PropPanel':
                    if(isShow) {
                        if(_this.propPanel === null) {
                            _this.propPanel = new PropPanel(_this);
                        }
                        _this.propPanel.show();
                    } else {
                        _this.propPanel.hide();
                    }                 
                    break;
                case 'HistoryPanel':
                    if(isShow) {
                        if(_this.historyPanel === null) {
                            _this.historyPanel = new HistoryPanel(_this);
                        }
                        _this.historyPanel.show();
                    } else {
                        _this.historyPanel.hide();
                    }
                    break;
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
            }
        },
        updateModelSet: function (data) {
            var layers, widgets, images, snapshots;
            var activeWidgetIds = [], activeLayerIds = [];

            // 删除的时候需要先删除 widgets，再删除 layer
            if (data.widgets) {
                // 保存当前选中的控件
                activeWidgetIds = this.painter.state.activeWidgets().map(function (row) {
                    return row.store.model._id();
                });

                this.painter.setActiveWidgets();
                this.store.widgetModelSet.removeAll();
            }
            if (data.layers) {
                // 保存当前选中的图层
                activeLayerIds = this.painter.state.activeLayers().map(function (row) {
                    return row.store.model._id();
                });
                this.store.layerModelSet.removeAll();
            }

            // 先添加图片，再添加 layers 和 widgets
            if (data.images) {
                images = data.images.map(function (row) {
                    // 创建 Model
                    var model = new Model(row);
                    return model;
                }, this);
                this.store.imageModelSet.removeAll();
                this.store.imageModelSet.append(images);
            }

            // 添加的时候需要先添加 layers，再添加 widgets
            if (data.layers) {
                layers = data.layers.map(function (row) {
                    // 创建 Model
                    var model = new NestedModel(row);
                    return model;
                }, this);
                this.store.layerModelSet.append(layers);

                // 恢复选中的图层
                if (activeLayerIds.length) {
                    this.painter.setActiveLayers(activeLayerIds);
                }
            }
            if (data.widgets) {
                widgets = data.widgets.map(function (row) {
                    // 创建 Model
                    var model = new NestedModel(row);
                    return model;
                }, this);
                this.store.widgetModelSet.append(widgets);
                
                // 恢复选中的控件
                if (activeWidgetIds.length) {
                    this.painter.setActiveWidgets(activeWidgetIds);
                }
            }

            if (data.shots) {
                snapshots = data.shots.map(function (row) {
                    // 创建 Model
                    var model = new Model(row);
                    return model;
                }, this);
                this.store.snapshotModelSet.removeAll();
                // 默认将当前页面添加进去
                this.store.snapshotModelSet.append( new Model({
                    _id: ObjectId(),
                    name: this.page.name,
                    content: $.deepClone({
                        layers: this.store.layerModelSet.serialize(),
                        widgets: this.store.widgetModelSet.serialize()
                    })
                }) );
                this.store.snapshotModelSet.append(snapshots);
            }
        },
        bindLayerModelSetOb: function () {
            this.store.layerModelSet.addEventListener('insert', this.updateLayerList, this);
            this.store.layerModelSet.addEventListener('remove', this.updateLayerList, this);
        },
        updateLayerList: function () {
            this.page.layerList = Object.keys(this.store.layerModelSet.toMap('_id'));
        },
        getLayersData: function () {
            return this.store.layerModelSet;
        },
        getWidgetsData: function () {
            return this.store.widgetModelSet;
        },
        close: function () {
            var dockManager = this.factoryScreen.layout.dockManager;

            // 隐藏 页面导航条
            this.$pageNav.hide();
            
            // 页面关闭时，立即同步一次，防止页面与页面之间的数据互相影响
            this.factoryScreen.syncWorker.sync();

            this.store.layerModelSet.removeAllListeners();
            // 清除历史记录控制器
            this.historyController && this.historyController.close();

            // 销毁 PageScreen 的所有面板
            dockManager.requestUndock(this.layout.propPanel);
            dockManager.requestUndock(this.layout.layerPanel);
            dockManager.requestUndock(this.layout.historyPanel);
            dockManager.requestUndock(this.layout.windowPanel);
            dockManager.requestUndock(this.layout.dataSourcePanel);
            this.layout = {};
        }
    };

    namespace('factory.screens').PageScreen = PageScreen;
} ());