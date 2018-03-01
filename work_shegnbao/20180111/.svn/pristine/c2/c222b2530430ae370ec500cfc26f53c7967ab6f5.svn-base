/**
 * FacReportWrapScreen
 */
(function (exports, ReportConfigPanel) {
    var _this;
    var timer;
    var saveTimer;
    function FacReportWrapScreen(page, screen, options) {
        _this = this;

        this.page = page;
        this.screen = screen;
        this.options = options || {};
        // 中间内容区域容器
        this.windowCtn = null;
        // 数据源面板容器
        this.dataSourcePanelCtn = null;
        // 可选模块面板容器
        this.modulePanelCtn = null;

        //导航条区域
        this.$pageNav = null;
        //中间内容区域
        this.windowCtn = null;
        this.reportConfigPanelCtn = null;
        //主面板区域
        this.reportConfigPanel = null;
        //页面管理区域
        this.pageControl = null;

        this.layout = {
            windowLeftPanel: null,
            windowRightPanel: null,
            reportTplPanel:null
        };

        this.store = {};

        this.reportTplPanel = null;

        // 可选模块面板
        this.modulePanel = null;
        // 数据源面板
        this.dataSourcePanel = null;
        // dashboard 配置框
        this.modalConfigPane = null;
    }

    FacReportWrapScreen.prototype = {
        show: function () {
            Spinner.spin(document.body);

            // 初始化 页面导航条 
            this.initNav();

            // 获取数据
            WebAPI.get( '/factory/reportWrap/'+[AppConfig.isFactory, this.page.id].join('/') ).done(function (rs) {
                var _this = this;
                this.store = rs;
                WebAPI.get('/static/app/WebFactory/views/reportScreen.html').done(function(html){
                    // 初始化操作
                    _this.init(html);
                    // 初始化 可选模块 工厂类
                    _this.initIoc();
                    //初始化面板
                    _this.initDataSourcePanel();
                    _this.initModulePanel();
                    _this.initReportTplPanel();
                    // 初始化 worker
                    _this.initSync();
                    // 设置一个记录点
                    //_this.dataSign = _this.getDataSign();
                })
            }.bind(this)).always(function () {
                Spinner.stop();
            });
        },
        spinner:function(flag){
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
            var _this = this;
            // 页面导航条  显示页面名称   保存  预览   管理员 
            this.$pageNav = $('#pageNav');
            this.$pageTopTools = $('#pageTopTools');
            this.$userNav = $('#userNav');

            $('a', this.$pageTopTools).hide();
            // 显示页面名称
            $('#lkName', this.$pageNav).text(this.screen.project.cnName + " > " + this.page.name.split(' - ')[0])
            .attr("title",this.screen.project.cnName + ">" + this.page.name.split(' - ')[0]).show();

            //锁定时修改显示样式
            var $pageNameBox = $('#lkName');
            if (this.page.isLock === 1) {
                $pageNameBox.addClass('locked');
                $pageNameBox.prepend('<span class="glyphicon glyphicon-lock lockedImage"></span>');
                $pageNameBox.append('<span class="lockedText">(已锁定)</span>');
            } else {
                $pageNameBox.removeClass('locked');
            }

            // 保存
            $('#lkSync', this.$pageTopTools).off('click').click(function () {
                if (_this.page.isLock === 1) {
                    alert('页面已经锁定，保存失败！');
                    return;
                }
                _this.spinner('start');
                _this.autoSave(true, function (state) {
		            _this.spinner(state);
                });
            }).show();
            // 预览链接
            $('#lkPreview', this.$pageTopTools).off('click').click(function () {
                if (_this.page.isLock === 1) {
                    return;
                }
                Spinner.spin(document.body);
                _this.autoSave(true, function () {
                    Spinner.stop();
                });
            })
            .show()
            .attr('href', '/factory/preview/reportWrap/' + _this.page.id);
            //发布页面
            $('#lkReleasePage', this.$pageTopTools).off('click').click(function () {
                ReleaseModal.show(_this.screen, _this.page.id);
            }).show();

            // 显示 Nav
            this.$pageNav.show();
            this.$pageTopTools.show();
            this.$userNav.show();

            $('[data-toggle="tooltip"]').tooltip({trigger:'hover'});

        },
        init: function (html) {
            // 初始化布局  面板
            this.initLayout(html);

            // 初始化 ReportConfigPanel
            this.initReportConfigPanel();
        },
        initSync: function () {
            if (this.page.isLock === 1) return;
            // 注册 ctrl+s 保存事件
            window.addEventListener('keydown', this.onKeyDownActionPerformed, false);
            // 注册 beforeunload 事件
            window.addEventListener('beforeunload', this.onBeforeUnloadActionPerformed, false);
            //自动保存事件
            this.autoSave(false);
        },
        /* @override */
        //getDataSign : function () {
        //    // 序列化字符串，用于记录当前数据的状态
        //    return JSON.stringify(this.reportEntity.entity.modal.option.layouts);
        //},
        initReportConfigPanel: function () {
            if(this.reportConfigPanel) {
                this.reportConfigPanel.close();
                this.reportConfigPanel = null;
            }
            if( $(this.reportConfigPanelCtn).is(':visible') ) {
                this.reportConfigPanel = new ReportConfigPanel(this);
                this.reportConfigPanel.show();
            }
        },
        initLayoutDOM: function (html) {
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

            //创建中间区域左边内容区域
            this.windowLeftPanelCtn = document.createElement('div');
            this.windowLeftPanelCtn.id = 'windowLeftPanel';
            //this.windowLeftPanelCtn.className = 'gray-scrollbar';
            this.windowLeftPanelCtn.setAttribute('caption', I18n.resource.report.REPORT_LIST);
            // 创建中间区域左边主面板容器
            this.reportConfigPanelCtn = document.createElement('div');
            this.reportConfigPanelCtn.id = 'reportConfigPanel';
            this.windowLeftPanelCtn.appendChild(this.reportConfigPanelCtn);
            // 中间内容右边区域面板容器
            this.windowRightPanelCtn = document.createElement('div');
            this.windowRightPanelCtn.id = 'windowRightPanel';
            this.windowRightPanelCtn.className = 'gray-scrollbar report-wrap';
            // 初始化中间右边区域的内部 DOM
            this.windowRightPanelCtn.innerHTML = html;
            this.container = this.windowRightPanelCtn.querySelector('#reportWrap');
            this.$container = $(this.container);
        },
        initLayout: function (html) {
            var dockManager = this.screen.layout.dockManager;
            var documentNode = this.screen.layout.documentNode;
            var dataSourcePanel, modulePanel, reportTplPanel;
            var dataSourceNode, moduleNode;
            var pagePanel = this.screen.layout.pagePanel;
            var pageNode;

            this.initLayoutDOM(html);

            this.layout.windowLeftPanel = new dockspawn.PanelContainer(this.windowLeftPanelCtn, dockManager);
            this.layout.windowRightPanel = new dockspawn.PanelContainer(this.windowRightPanelCtn, dockManager);
            this.layout.dataSourcePanel = dataSourcePanel = new dockspawn.PanelContainer(this.dataSourcePanelCtn, dockManager);
            this.layout.modulePanel = modulePanel = new dockspawn.PanelContainer(this.modulePanelCtn, dockManager);
            this.layout.reportTplPanel = reportTplPanel = new dockspawn.PanelContainer(this.reportTplPanelCtn, dockManager);

            // 判断 pagePanel 是否在浮动窗口中
            if (pagePanel.floatingDialog) {
                dataSourceNode = dockManager.dockRight(documentNode, dataSourcePanel, .2);
            } else {
                pageNode = dockManager._findNodeFromContainer(pagePanel);
                dataSourceNode = dockManager.dockFill(pageNode, dataSourcePanel);
            }

            moduleNode = dockManager.dockFill(dataSourceNode, modulePanel);
            dockManager.dockFill(moduleNode, reportTplPanel);
            dockManager.dockLeft(documentNode, this.layout.windowLeftPanel,.16);
            dockManager.dockFill(documentNode, this.layout.windowRightPanel);
        },
        initIoc : function() {
            this.factoryIoC = new FactoryIoC('report');
        },
        initModulePanel : function () {
            if(this.modulePanel) {
                this.modulePanel.close();
                this.modulePanel = null;
            }
            if( $(this.modulePanelCtn).is(':visible') ) {
                var ReportModulePanel = namespace('factory.panels').ReportModulePanel;
                this.modulePanel = new ReportModulePanel(this);
                this.modulePanel.show();
            }
            this.modulePanelCtn.removeEventListener('dock.tabPage.changed', this.onTabPageChanged);
            this.modulePanelCtn.addEventListener('dock.tabPage.changed', this.onTabPageChanged, false);
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
        initReportTplPanel : function () {
            if(this.reportTplPanel) {
                this.reportTplPanel.close();
                this.reportTplPanel = null;
            }
            if( $(this.reportTplPanelCtn).is(':visible') ) {
                var ReportTplPanel = namespace('factory.panels').ReportTplPanel;
                this.reportTplPanel = new ReportTplPanel(this);
                this.reportTplPanel.show();
            }
            this.reportTplPanelCtn.removeEventListener('dock.tabPage.changed', this.onTabPageChanged);
            this.reportTplPanelCtn.addEventListener('dock.tabPage.changed', this.onTabPageChanged, false)
        },
        /* @override */
        onTabPageChanged : function (e) {
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
                            var ReportModulePanel = namespace('factory.panels').ReportModulePanel;
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
                            var ReportTplPanel = namespace('factory.panels').ReportTplPanel;
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
                            var ReportTplPanel = namespace('factory.panels').ReportTplPanel;
                            _this.reporTplParamsPanel = new ReportTplPanel(_this);
                        }
                        _this.reporTplParamsPanel.show();
                    } else {
                        _this.reporTplParamsPanel.hide();
                    }
                    break;
            }
        },
        save: function (callback,saveData) {
            if(!saveData){
                if(!_this.reportConfigPanel.openReport){
                    typeof callback === 'function' && callback(0);
                    return;
                }
                var data = {
                    id:_this.reportConfigPanel.openReport.dataId || _this.reportConfigPanel.openReport.reportId,
                    creatorId: _this.reportConfigPanel.openReport.creatorId || AppConfig.userId,
                    menuItemId:_this.reportConfigPanel.openReport.reportId,
                    isFactory: AppConfig.isFactory,
                    layout: [[this.reportEntity.entity]]
                };
                saveData = {
                    pageId: this.page.id,
                    list: _this.store.list,
                    data: data
                }
            }
            WebAPI.post('/factory/reportWrap/' + AppConfig.isFactory, saveData).done(function () {
                typeof callback === 'function' && callback(1);
            }).fail(function () {
                typeof callback === 'function' && callback(0);
            });
        },
        autoSave: function(isImmediatelyRun, callback,saveData){
            if(timer){
                clearTimeout(timer);
            }
            if(isImmediatelyRun) {
                _this.save(callback,saveData);
            }
            timer = window.setTimeout(function() {
                //默认不开启自动保存
                var isAutoSave = localStorage.getItem('isAutoSave_' + AppConfig.userId);
                if(isAutoSave == 'true'){
                    _this.autoSave(true);
                }else{
                    _this.autoSave(false);
                }
            }, AppConfig.syncInterval);
        },

        close: function() {
            var _this = this;
            //隐藏导航条
            $('#lkName', this.$pageNav).text(this.screen.pagePanel.project.cnName);
            //this.$pageNav.hide();
            this.$pageTopTools.hide();

            // 关闭 reportConfigPanel
            if(this.reportConfigPanel){
                this.reportConfigPanel.close();
                this.reportConfigPanel = null;
            }

            // 销毁 ReprotWrapScreen 的所有面板
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

            // 删除内容
            this.windowLeftPanelCtn = null;
            this.windowRightPanelCtn = null;
            //清除timer
            if(timer){
                clearTimeout(timer);
                timer = null;
            }
        }
    };

    exports.FacReportWrapScreen = FacReportWrapScreen;
} ( namespace('factory.screens'),
    namespace('factory.panels.ReportConfigPanel') ));