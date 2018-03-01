(function () {
    var _this;
    var timer;
    var saveTimer;
    function EnergyScreen(page, screen, opt) {
        _this = this;


        this.page = page;
        this.facScreen = screen;

        // 中间内容区域
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

        this.options = opt?opt:{};
        this.options.isConfig = true;
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
        Spinner.spin(this.windowCtn);
        promise.done(function (rs) {
            if (!rs.id) {
                // 首次创建页面后，传回的数据没有 id 字段，这里手动建立 id 字段，
                // 否则第一次进入保存时会不停创建新的记录
                rs.id = ObjectId();
            }
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

        }.bind(this)).always(function () {
            Spinner.stop();
        });
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
        if (this.page.isLock === 1) return;
        // 注册 ctrl+s 保存事件
        window.addEventListener('keydown', this.onKeyDownActionPerformed, false);
        // 注册 beforeunload 事件
        window.addEventListener('beforeunload', this.onBeforeUnloadActionPerformed, false);
        //自动保存事件
        this.autoSaveLayout(false);
    };
    EnergyScreen.prototype.spinner = function (flag) {
        saveTimer && clearTimeout(saveTimer), saveTimer=null;
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
	};
    EnergyScreen.prototype.initNav = function () {
        var _this = this;

        this.$pageNav = $('#pageNav');
        this.$pageTopTools = $('#pageTopTools');
        this.$userNav = $('#userNav');

        // 隐藏所有 id
        $('a', this.$pageTopTools).hide();

        // 显示页面名称
        $('#lkName', this.$pageNav).text(this.facScreen.project.cnName + " > " + this.page.name.split(' - ')[0])
        .attr("title",this.facScreen.project.cnName + ">" + this.page.name.split(' - ')[0]);

        //锁定时修改显示样式
        var $pageNameBox = $('#lkName');
        if (this.page.isLock === 1) {
            $pageNameBox.addClass('locked');
            $pageNameBox.prepend('<span class="glyphicon glyphicon-lock lockedImage"></span>');
            $pageNameBox.append('<span class="lockedText">(已锁定)</span>');
        } else {
            $pageNameBox.removeClass('locked');
        }
        // 数据同步链接
        $('#lkSync', this.$pageTopTools).off('click').click(function () {
            if (_this.page.isLock === 1) {
                alert('页面已经锁定，保存失败！');
                return;
            }
            // TODO 动画开始
            _this.spinner('start');
            _this.autoSaveLayout(true, function (state) {
                // TODO 动画结束
                _this.spinner(state);
            });
        }).show();
        // 更新链接
        $('#lkPreview', this.$pageTopTools).off('click').click(function () {
            if (_this.page.isLock === 1) {
                return;
            }
            Spinner.spin(document.body);
            _this.autoSaveLayout(true, function () {
                Spinner.stop();
            });
        })
        .show()
        .attr('href', '/factory/preview/dashboard/' + _this.page.id);
        
        // 显示 Nav
        this.$pageNav.show();
        this.$pageTopTools.show();
        this.$userNav.show();
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
        var dockManager = this.facScreen.layout.dockManager;
        var documentNode = this.facScreen.layout.documentNode;
        var pagePanel = this.facScreen.layout.pagePanel;
        var pageNode;

        var windowPanel, dataSourcePanel, modulePanel;
        var windowNode, dataSourceNode, moduleNode;

        this.initLayoutDOM(html);

        this.layout.windowPanel = windowPanel = new dockspawn.PanelContainer(this.windowCtn, dockManager);
        this.layout.dataSourcePanel = dataSourcePanel = new dockspawn.PanelContainer(this.dataSourcePanelCtn, dockManager);
        this.layout.modulePanel = modulePanel = new dockspawn.PanelContainer(this.modulePanelCtn, dockManager);

        // 判断 pagePanel 是否在浮动窗口中
        if (pagePanel.floatingDialog) {
            dataSourceNode = dockManager.dockRight(documentNode, dataSourcePanel, .2);
        } else {
            pageNode = dockManager._findNodeFromContainer(pagePanel);
            dataSourceNode = dockManager.dockFill(pageNode, dataSourcePanel);
        }
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
        if(this.options.isForMobile)this.$container.addClass('forMobile');
        for (var i = 0, item; i < this.store.layout.length; i++) {
            for (var j = 0; j < this.store.layout[i].length; j++) {
                item = this.store.layout[i][j];
                var modelClass,entity;
                if (item.modal.type) {
                    //regist IoC
                    modelClass = this.factoryIoC.getModel(item.modal.type);
                    if(!modelClass) continue;
                    //if (item.isNotRender) continue;
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

    EnergyScreen.prototype.replaceEntity = function (sourceId, targetId, parentId) {
        if (sourceId == targetId) return;

        var _this = this;
        var source = this.listEntity[sourceId];
        var target = this.listEntity[targetId];

        source.entity.id = (+new Date()).toString();

        target.entity.id = (+new Date() + 1).toString();

        this.listEntity[source.entity.id] = source;
        this.listEntity[target.entity.id] = target;

        delete this.listEntity[sourceId];
        delete this.listEntity[targetId];

        source.initContainer(targetId).configure();
        target.initContainer(sourceId).configure();


        this.arrEntityOrder[this.arrEntityOrder.indexOf(targetId)] = source.entity.id;
        this.arrEntityOrder[this.arrEntityOrder.indexOf(sourceId)] = target.entity.id;

        //如果是组合图内部交换位置,则组合图的subChartIds更新
        if (parentId) {
            this.listEntity[parentId].entity.modal.option.subChartIds.forEach(function (i) {
                if (i.id == sourceId) {
                    i.id = target.entity.id;
                }
            });
            this.listEntity[parentId].entity.modal.option.subChartIds.forEach(function (i) {
                if (i.id == targetId) {
                    i.id = source.entity.id;
                }
            });
        }
        if (source.entity.modal.type == 'ModalMix') {
            source.entity.modal.option && source.entity.modal.option.subChartIds && source.entity.modal.option.subChartIds.forEach(function (i) {
                var entity = _this.listEntity[i.id].entity, modelClass, item;
                modelClass = _this.factoryIoC.getModel(entity.modal.type);
                _this.container = $('#divContainer_' + source.entity.id).find('.chartsCt')[0];
                item = new modelClass(_this, entity);
                item.configure()
            });
        }
        if (target.entity.modal.type == 'ModalMix' && target.entity.modal.option && target.entity.modal.option.subChartIds) {
            target.entity.modal.option.subChartIds.forEach(function (i) {
                var entity = _this.listEntity[i.id].entity, modelClass, item;
                modelClass = _this.factoryIoC.getModel(entity.modal.type);
                _this.container = $('#divContainer_' + target.entity.id).find('.chartsCt')[0];
                item = new modelClass(_this, entity);
                item.configure()
            });
        }
    };

    EnergyScreen.prototype.rebornEntity = function (entityParams, tragetType, targetTitle, modalNoneEdit) {
        var oldIndex = this.arrEntityOrder.indexOf(entityParams.id);
        this.removeEntity(entityParams.id);

        entityParams.modal.type = tragetType;
        entityParams.modal.title = '';
        var modelClass = this.factoryIoC.getModel(tragetType);
        if ((!entityParams.isNotRender) && !modalNoneEdit) {
            if ('ModalInteract' == entityParams.modal.type) {
                entityParams.spanC = 9;
                entityParams.spanR = 3;
            }
            else if (entityParams.modal.type !== 'ModalMix'&&entityParams.modal.type !== 'ModalAppBlind') {
                entityParams.spanC = modelClass.prototype.optionTemplate.defaultWidth?modelClass.prototype.optionTemplate.defaultWidth:modelClass.prototype.optionTemplate.minWidth;
                entityParams.spanR = modelClass.prototype.optionTemplate.defaultHeight?modelClass.prototype.optionTemplate.defaultHeight:modelClass.prototype.optionTemplate.minHeight;
            }else if(entityParams.modal.type === 'ModalAppBlind'){
				entityParams.spanC = 3;
                entityParams.spanR = 4.5;
			}
        }
        //防止超出界限
        entityParams.spanC = Math.min(entityParams.spanC,modelClass.prototype.optionTemplate.maxWidth);
        entityParams.spanR = Math.min(entityParams.spanR, modelClass.prototype.optionTemplate.maxHeight);

        var entity = new modelClass(this, entityParams);
        this.listEntity[entity.entity.id] = entity;
        this.arrEntityOrder.splice(oldIndex,0,entity.entity.id);
        entity.configure();
    };

    EnergyScreen.prototype.getLayoutData = function () {
        var entity = null;
        var arrEntity = [];
        
        for (var i = 0; i < this.arrEntityOrder.length; i++) {
            entity = this.listEntity[this.arrEntityOrder[i]].entity;

            //对entity过滤,判断是否存在于modalMix, 如果是,isNotRender=true
            if(entity.modal.type != 'ModalMix'){
                for(var m in this.listEntity){
                    var en = this.listEntity[m].entity;
                    if(en.modal.type === 'ModalMix' && en.modal.option && en.modal.option.subChartIds && en.modal.option.subChartIds.length > 0){
                        for(var n = 0; n < en.modal.option.subChartIds.length; n++){
                            if(en.modal.option.subChartIds[n]){
                                if(entity.id === en.modal.option.subChartIds[n].id && $('#divContainer_'+entity.id).closest('#divContainer_'+en.id).length == 1){
                                    entity.isNotRender = true;
                                }
                            }
                        }
                    }
                }
            }

            if(this.listEntity[this.arrEntityOrder[i]].optionTemplate.needRefresh === false){
                arrEntity.push(entity);
            }else if(entity.modal.type == 'ModalPointKPI'){
                arrEntity.push(this.dealWithEntity(entity));
            }else if(entity.modal.type == 'ModalReportChapter'){
                if(entity.modal.option && entity.modal.option.menuId && entity.modal.option.menuId != ''){
                    arrEntity.push(entity);
                }
            }else if(entity.modal.type == 'ModalDiagnosisPanelHtml'){
                if (!entity.modal.option) {
                    entity.modal.option = {
                        html: '<div id="modalDiagnosisPanel'+i+'" style="height:100%;"></div>↵<script>new ModalDiagnosisPanel(document.getElementById("modalDiagnosisPanel'+i+'")).show()</script>'
                    };
                    entity.modal.dsChartCog = [{ accuracy: 2 }];
                    entity.modal.interval = 60000;
                    entity.modal.points = [];
                }
                arrEntity.push(entity);
            }else if(entity.modal.type == 'ModalAppBlind'){
                //删除被删除的entity
                if(entity.modal.option && entity.modal.option.length > 0){
                    for(var j = 0; j < entity.modal.option.length; j++){
                        if(entity.modal.option[j] && entity.modal.option[j].subChartIds && entity.modal.option[j].subChartIds[0].id){
                            var id = entity.modal.option[j].subChartIds[0].id;
                            if(!this.listEntity[id]){
                                entity.modal.option.splice(j,1);
                                break;
                            }
                        }
                    }
                }
                arrEntity.push(entity);
            }else {
                arrEntity.push(entity);
            }
        }
        return [arrEntity];
    };

    EnergyScreen.prototype.saveLayout = function (callback) {
        var _this = this;
        
        var data = {
            creatorId: AppConfig.userId,
            menuItemId: this.page.id,
            isFactory: AppConfig.isFactory,
            layout: this.getLayoutData()
        };
        this.store.id && (data.id = this.store.id);

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
        var _this = this;
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
    };

    EnergyScreen.prototype.autoSaveLayout = function (isImmediatelyRun, callback) {
        // 重置计时器
        if (timer) {
            clearTimeout(timer);
        }
        timer = window.setTimeout(function() {
            _this.autoSaveLayout(true);
        }, AppConfig.syncInterval);

        if (isImmediatelyRun) {
            _this.saveLayout(callback);
        }
    };

    EnergyScreen.prototype.close = function () {
        // 隐藏 页面导航条
        if(this.facScreen.pagePanel){
            $('#lkName', this.$pageNav).text(this.facScreen.pagePanel.project.cnName);
        }else{
            this.$pageNav.hide();
        }

        this.$pageTopTools.hide();
        $('#lkSync', this.$pageNav).off();

        // 清除 ctrl+s 保存事件
        window.removeEventListener('keydown', this.onKeyDownActionPerformed);
        // 清除 beforeunload 事件
        window.removeEventListener('beforeunload', this.onBeforeUnloadActionPerformed);

        // 销毁配置窗口
        if (this.modalConfigPane) {
            this.modalConfigPane.close();
            this.modalConfigPane = null;
        }
        // 销毁遗留的异常DOM
        $('.datetimepicker').remove();
        // 销毁布局
        this.destroyLayouts();
        //清除timer
        if(timer){
            clearTimeout(timer);
            timer = null;
        }
    };

    namespace('factory.screens').EnergyScreen = EnergyScreen;
})();
