/**
 * PageScreen
 */
(function () {
    var _this;
    var timer;
    var saveTimer;

    function PageScreen(page, screen) {
        _this = this;
        this.page = page;
        this.screen = screen;

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

        this._factoryIoC = null;
        this.modalConfigPane = null;
    }

    PageScreen.prototype = {
        show: function () {
            var _this = this;
            // 处理是否需要去服务端拉页面数据的 promise
            var promise = $.Deferred();

            Spinner.spin(document.body);
            // 初始化 页面导航条 先
            this.initNav();
            if(typeof this.page.option === "undefined"){
                var bgOption = {
                    color:"#ffffff",
                    type:"color",
                    image:"",
                    display:"" 
                }
                this.page.option = bgOption;
            }
            if (this.page.layerList.length === 0) {
                this.init();
                // 初始化 worker
                this.initSync();
                //默认新建一个空的图层
                this.store.layerModelSet.append([
                    new NestedModel({
                        "_id" : ObjectId(),
                        "type" : "layer",
                        "isHide" : 0,
                        "isLock" : 0,
                        "name" : 'default',
                        "list" : [],
                        "option" : {},
                        "parentId" : '',             //20160704, 新增, 父元素ID, 为空则为根目录显示
                        "pageId": _this.page.id             //20160704, 新增, 所在页面ID
                    })
                ]);
                //选中新建的图层
                this.layerPanel.treeObj.getNodes().length > 0 && $('#'+ this.layerPanel.treeObj.getNodes()[0].tId +'_a').click();
                // 初始化 "历史记录" 控制器
                this.initHistoryController();
                // 清除 Spinner
                Spinner.stop();
                // 无需去服务端拉取页面数据
                promise.reject();
                return;
            }

            if (this.screen.syncWorker.state() === 'pending') {
                this.screen.syncWorker.promise.always(function () {
                    promise.resolve();
                });
            } else {
                promise.resolve();
            }

            promise.then(function () {
                return WebAPI.get('/factory/getPageDetail/'+this.page.id+'/1').done(function (rs) {
                    // 这里用不到 rs.page
                    if(!rs || !rs.data) {
                        Log.error('get page detail faild!');
                        return;
                    }
                    rs.data.list = this.page.layerList;
                    // 初始化控件
                    this.init();
                    // 将数据转换成可监控的数据
                    try {
                        this.updateModelSet(rs.data);
                    } catch (e) {
                        Log.error('update model set error!');
                    }
                    // 初始化 worker
                    this.initSync();
                    // 初始化 "历史记录" 控制器
                    this.initHistoryController();
                    // 清除 Spinner
                    Spinner.stop();
                }.bind(this));
            }.bind(this)).always(function () {
                this.painter.onLoad();
            }.bind(this));
        },
        factoryIoC: function () {
            if (!this._factoryIoC) {
                this._factoryIoC = new FactoryIoC('dashboard');
            }
            return this._factoryIoC;
        },
        // 处理数据
        formatData: function (data) {
            var formattedData = this.getSortedData({
                list: this.page.layerList,
                layers: data.layers,
                widgets: data.widgets
            });

            data.layers = formattedData.layers;
            data.widgets = formattedData.widgets;
        },
        spinner: function(flag){
            saveTimer && clearTimeout(saveTimer), saveTimer = null;
            var $spinner = $('#mainframe .spinner');
            if (flag === "start") {
                $spinner.css('display', 'block')
                    .siblings('span')
                    .css('display', 'none');
            } else if (flag === 1) {
                $spinner.css('display', 'none')
                    .siblings('span:eq(0)')
                    .attr('class', 'glyphicon glyphicon-ok')
                    .css('display', 'inline-block')
                    .next()
                    .css('display', 'inline-block');
                saveTimer = setTimeout(function () {
                    $spinner.siblings('span:eq(0)')
                        .attr('class', 'glyphicon glyphicon-floppy-disk');
                }, 2000)
            } else if (flag === 0) {
                $spinner.css('display', 'none')
                    .siblings('span:eq(0)')
                    .attr('class', 'glyphicon glyphicon-remove')
                    .css('display', 'inline-block')
                    .next()
                    .css('display', 'inline-block');
                saveTimer = setTimeout(function () {
                    $spinner.siblings('span:eq(0)')
                        .attr('class', 'glyphicon glyphicon-floppy-disk');
                }, 2000)
            }
		},
        initNav: function () {
            this.$pageNav = $('#pageNav');
            this.$pageTopTools = $('#pageTopTools');
            this.$userNav = $('#userNav');
            var _this = this;
            $('a', this.$pageTopTools).hide();
            // 显示页面名称
            $('#lkName', this.$pageNav)
                .text(this.screen.project.cnName + ' > ' + this.page.name.split(' - ')[0])
                .attr("title",this.screen.project.cnName + ' > ' + this.page.name.split(' - ')[0]).show();
            var $pageNameBox = $('#lkName');
            if (this.page.isLock === 1) {
                $pageNameBox.addClass('locked');
                $pageNameBox.prepend('<span class="glyphicon glyphicon-lock lockedImage"></span>');
                $pageNameBox.append('<span class="lockedText">(已锁定)</span>');
            } else {
                $pageNameBox.removeClass('locked');
            }
            // 数据同步链接
            $('#lkSync', this.$pageTopTools)
                .off('click')
                .click(function () {
                    if (_this.page.isLock === 1) {
                        alert('页面已经锁定，保存失败！');
                        return;
                    }
                    _this.spinner('start');
                    _this.autoSaveSync(true, function (state) {
		                _this.spinner(state);
                    });
            }).show();
            //撤销
            $('#lkUndo').off('click').click(function() {
                var index, len;
                index = _this.historyController.state.index();
                len = _this.historyController.store.records.length();
                index = Math.min(Math.max(0, index-1), len-1);
                _this.historyController.state.index(index);
            }).show();
            //重做
            $('#lkRedo').off('click').click(function() {
                var index, len;
                index = _this.historyController.state.index();
                len = _this.historyController.store.records.length();
                index = Math.min(Math.max(0, index + 1), len -1);
                _this.historyController.state.index(index);
            }).show();
            //发布页面
            $('#lkReleasePage')
                .off('click')
                .click(function () {
                    ReleaseModal.show(_this.screen, _this.page.id);
            }).show();
            // 预览链接
            $('#lkPreview', this.$pageTopTools).off('click').click(function () {
                if (_this.page.isLock === 1) {
                    return;
                }
                Spinner.spin(document.body);
                _this.autoSaveSync(true, function () {
                    Spinner.stop();
                });
            })
            .attr('href', '/factory/preview/page/' + _this.page.id)
            .show();

            $('#lkQuitSceneMode', this.$pageTopTools).off('click').click(function () {
                _this.quitSceneMode(this.dataset.widgetId);
            }).hide();

            // 显示 Nav
            this.$pageNav.show();
            this.$pageTopTools.show();
            this.$userNav.show();

            $('[data-toggle="tooltip"]').tooltip({trigger:'hover'});
        },
        initHistoryController: function () {
            this.historyController = new window.HistoryController(this);
            this.historyController.init();
        },
        initSync: function () {
            if (this.page.isLock === 1) return;
            // 注册 ctrl+s 保存事件
            window.addEventListener('keydown', this.onKeyDownActionPerformed, false);
            // 注册 beforeunload 事件
            window.addEventListener('beforeunload', this.onBeforeUnloadActionPerformed, false);

            this.screen.syncWorker.initPagesData(this.getPagesData());
            this.screen.syncWorker.initLayersData(this.getLayersData());
            this.screen.syncWorker.initWidgetsData(this.getWidgetsData());
            this.autoSaveSync(false);
        },
        initLayoutDOM: function () {
            // 创建属性面板容器
            this.propPanelCtn = document.createElement('div');
            this.propPanelCtn.id = 'propPanel';
            this.propPanelCtn.setAttribute('caption', I18n.resource.mainPanel.attrPanel.attrTab.TITLE); //'属性'
            this.propPanelCtn.dataset.type = 'PropPanel';

            // 创建历史记录面板容器
            this.historyPanelCtn = document.createElement('div');
            this.historyPanelCtn.id = 'historyPanel';
            this.historyPanelCtn.setAttribute('caption', I18n.resource.mainPanel.attrPanel.attrTab.HISTORY_RECORD);//'历史记录'
            this.historyPanelCtn.dataset.type = 'HistoryPanel';

            // 创建图层记录面板容器
            this.layerPanelCtn = document.createElement('div');
            this.layerPanelCtn.id = 'layerPanel';
            this.layerPanelCtn.setAttribute('caption', I18n.resource.mainPanel.layerPanel.TITLE);//'图层'
            this.layerPanelCtn.dataset.type = 'LayerPanel';

            // 创建数据源面板容器
            this.dataSourcePanelCtn = document.createElement('div');
            this.dataSourcePanelCtn.id = 'dataSourcePanel';
            this.dataSourcePanelCtn.setAttribute('caption', I18n.resource.mainPanel.attrPanel.attrTab.DATA_SOURCE);//'数据源'
            this.dataSourcePanelCtn.dataset.type = 'DataSourcePanel';

            // 中间内容区域面板容器
            this.windowCtn = document.createElement('div');
            this.windowCtn.tabIndex = 0;
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
            var dockManager = this.screen.layout.dockManager;
            var documentNode = this.screen.layout.documentNode;
            var pagePanel = this.screen.layout.pagePanel;
            var pageNode;

            var propPanel, layerPanel, historyPanel, windowPanel, dataSourcePanel;
            var windowNode, layerNode, historyNode, dataSourceNode;

            this.initLayoutDOM();

            this.layout.propPanel = propPanel = new dockspawn.PanelContainer(this.propPanelCtn, dockManager);
            this.layout.layerPanel = layerPanel = new dockspawn.PanelContainer(this.layerPanelCtn, dockManager);
            this.layout.historyPanel = historyPanel = new dockspawn.PanelContainer(this.historyPanelCtn, dockManager);
            this.layout.windowPanel = windowPanel = new dockspawn.PanelContainer(this.windowCtn, dockManager);
            this.layout.dataSourcePanel = dataSourcePanel = new dockspawn.PanelContainer(this.dataSourcePanelCtn, dockManager);

            // 判断 pagePanel 是否在浮动窗口中
            if (pagePanel.floatingDialog) {
                dataSourceNode = dockManager.dockRight(documentNode, dataSourcePanel, .2);
            } else {
                pageNode = dockManager._findNodeFromContainer(pagePanel);
                dataSourceNode = dockManager.dockFill(pageNode, dataSourcePanel);
            }
            historyNode = dockManager.dockFill(dataSourceNode, historyPanel);
            layerNode = dockManager.dockFill(historyNode, layerPanel, .2);
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
            this.painter = new GPainter(this, {
                pageWidth: this.page.width,
                pageHeight: this.page.height,
                // 0 - full screen
                // 1 - show in center
                display: this.page.display
            });
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
        onKeyDownActionPerformed: function (e) {
            if(e.which === 83 && e.ctrlKey) {
                e.stopPropagation();
                e.preventDefault();
                try {
                    _this.screen.syncWorker.sync();
                } catch (e) {
                    Log.exception(e);                
                }
            }
        },
        onBeforeUnloadActionPerformed: function (e) {
            if (_this.screen.syncWorker.hasChange()) {
                e.returnValue = I18n.resource.screen.UNSAVED_PAGE_TIP;
                return e.returnValue;
            }
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
        preLoadImage: function () {

        },
        updateModelSet: function (data) {
            var layers, widgets, images, snapshots;
            var activeWidgetIds = [], activeLayerIds = [];
            var sortedData;

            this.painter.drawMode('manual');

            // 排序
            if (data.list) {
                sortedData = this.getSortedData(data);
                data.layers = sortedData.layers;
                data.widgets = sortedData.widgets;
            }

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
            } else {
                this.preLoadImage(data.widgets);
            }

            // 添加的时候需要先添加 layers，再添加 widgets
            if (data.layers && data.layers.length) {
                layers = data.layers.map(function (row) {
                    // 为了处理图层合并而做的，对老数据的兼容
                    row.type = 'layer';
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
            if (data.widgets && data.widgets.length) {
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
                    name: "默认快照",
                    content: $.deepClone({
                        list: this.page.layerList,
                        layers: this.store.layerModelSet.serialize(),
                        widgets: this.store.widgetModelSet.serialize()
                    })
                }) );
                this.store.snapshotModelSet.append(snapshots);
            }

            this.painter.updateLayerOrder();
            this.painter.drawMode('normal');
        },
        resize: function() {
            var styles = window.getComputedStyle(this.painter.domContainer);
            var width = parseInt(this.painter.pageWidth);
            var height = parseInt(this.painter.pageHeight);

            this.painter.stage.width(parseInt(styles.width));
            this.painter.stage.height(parseInt(styles.height));
            this.painter.resizePage(width, height);

            this.painter.fixZoom();
        },
        // 获取根目录的 layerList
        getLayerList: function () {
            return this.page.layerList;            
        },
        getPagesData: function () {
            // 兼容以前的格式
            return [{
                _id: this.page.id,
                layerList: this.page.layerList
            }];
        },
        // 获取所有图层的数据
        getLayersData: function () {
            return this.store.layerModelSet;
        },
        // 获取所有控件的数据
        getWidgetsData: function () {
            return this.store.widgetModelSet;
        },
        autoSaveSync: function(isImmediatelyRun, callback) {
            // 重置计时器
            if (timer) {
                clearTimeout(timer);
            }

            if (isImmediatelyRun) {
                _this.screen.syncWorker.sync(callback);
            }

            timer = window.setTimeout(function() {
                _this.autoSaveSync(true);
            }, AppConfig.syncInterval);
        },
        /**
         * 拿到指定类型的控件的 model集合
         * @param  {object|array} types 指定的类型，可以为数组
         * @return {[type]}      [description]
         */
        getModelsByType: function (types) {
            var matches = [];

            // type 转换成数组
            if (typeof types === 'string') {
                types = [types];
            }

            this.store.widgetModelSet.forEach(function (model) {
                if ( types.indexOf( model.type()) > -1 ) {
                    matches.push(model);
                }
            });

            return matches;
        },
        // 进入场景模式
        enterSceneMode: function (widgetId) {
            var domTopTools = document.querySelector('#pageTopTools');
            var domLkReleasePage = domTopTools.querySelector('#lkReleasePage');
            var domLkQuitSceneMode = domTopTools.querySelector('#lkQuitSceneMode');

            this.painter.enterSceneMode(widgetId);

            domLkQuitSceneMode.dataset.widgetId = widgetId;

            // 更新菜单按钮
            domLkReleasePage.style.display = 'none';
            domLkQuitSceneMode.style.display = 'block';
        },
        // 退出场景模式
        quitSceneMode: function (widgetId,htmlX,htmlY,optionClass) {
            var domTopTools = document.querySelector('#pageTopTools');
            var domLkReleasePage = domTopTools.querySelector('#lkReleasePage');
            var domLkQuitSceneMode = domTopTools.querySelector('#lkQuitSceneMode');

            this.painter.quitSceneMode(widgetId);

            domLkQuitSceneMode.dataset.widgetId = '';

            // 更新菜单按钮
            domLkReleasePage.style.display = 'block';
            domLkQuitSceneMode.style.display = 'none';
        },
        // painter
        getPainter: function () {
            return this.painter;
        },

        // 获取有序的数据
        getSortedData: function (data) {
            var stack = data.list.slice();
            var layerMap = Array.toMap(data.layers, '_id');
            var widgetMap = Array.toMap(data.widgets, '_id');
            var viewedLayerIds = [], viewedWidgetIds = [];
            var id, item;
            var rs = {
                layers: [],
                widgets: []
            };

            while(id = stack.pop()) {
                item = layerMap[id];
                // 若是图层
                if (item) {
                    if (viewedLayerIds.indexOf(id) > -1) {
                        Log.error('factory 图层出现嵌套循环，id：' + id);
                        continue;
                    }
                    viewedLayerIds.push(id);
                    stack = item['list'].concat(stack);
                    rs.layers.push(item);
                }
                // 若是控件
                else {
                    item = widgetMap[id];
                    if (item) {
                        if (viewedWidgetIds.indexOf(id) > -1) {
                            Log.error('factory 控件出现嵌套循环，id：' + id);
                            continue;
                        }
                        viewedWidgetIds.push(id);
                        rs.widgets.push(item);
                    } else {
                        Log.warn('未找到控件，id：' + id);
                    }
                }
            }

            return rs;
        },

        close: function () {
            var _this = this;
            var dockManager = this.screen.layout.dockManager;
            var syncWorker = this.screen.syncWorker;

            // 隐藏 页面导航条
            $('#lkName', this.$pageNav).text(this.screen.pagePanel.project.cnName);
            //this.$pageNav.hide();
            this.$pageTopTools.hide();

            // 清除数据同步的 timer
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }

            // 页面关闭时，立即同步一次，防止页面与页面之间的数据互相影响
            syncWorker.sync();
            if (syncWorker.state() === 'pending') {
                syncWorker.promise.done(function () {
                    syncWorker.reset();
                });
            } else {
                syncWorker.reset();
            }
            // 清除 ctrl+s 保存事件
            window.removeEventListener('keydown', this.onKeyDownActionPerformed);

            // 清除同步 layerList 的事件,注意此事件必须在 painter.close 前被清除,否则会出现 layerList 被清空的问题
            this.store.layerModelSet.removeAllListeners('insert');
            this.store.layerModelSet.removeAllListeners('remove');
            this.store.layerModelSet.removeAllListeners('move');
            
            // 清除历史记录控制器
            this.historyController && this.historyController.close();
            
            // 删除 toolbar
            this.toolbar.close();
            this.toolbar = null;
            this.toolbarCtn.innerHTML = '';

            // 删除 painter
            this.painter.close();
            this.painter = null;
            this.painterCtn.innerHTML = '';

            // 销毁 PageScreen 的所有面板
            Object.keys(this.layout).forEach(function (k) {
                var panel = _this.layout[k];
                // 判断是否为浮动窗口
                if (panel.floatingDialog) {
                    // 存在，则使用浮动窗口的销毁方式
                    panel.floatingDialog.destroy();
                } else {
                    // 不存在，则使用固定停靠窗口的销毁方式
                    panel.performUndock();
                }
                _this.layout[k] = null;
            });
            this.layout = null;

            // 将 factoryScreen 的 page 引用置空
            this.screen.page = null;

        }
    };

    namespace('factory.screens').PageScreen = PageScreen;
} ());