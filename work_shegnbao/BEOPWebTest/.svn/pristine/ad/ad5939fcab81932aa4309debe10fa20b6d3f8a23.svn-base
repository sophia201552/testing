/**
 * FacReportWrapScreen
 */
(function (exports, ReportConfigPanel) {
    var _this;

    function FacReportWrapScreen(page, screen) {
        _this = this;

        this.page = page;
        this.screen = screen;

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
            windowPanel: null
        };
    }

    FacReportWrapScreen.prototype = {
        show: function () {
             Spinner.spin(document.body);

            // 初始化 页面导航条 
            this.initNav();

            // 初始化操作
            this.init();

            Spinner.stop();
        },
        initNav: function () {
            var _this=this;
            // 页面导航条  显示页面名称   保存  预览   管理员 
            this.$pageNav = $('#pageNav');
            this.$pageTopTools = $('#pageTopTools');

            $('a', this.$pageTopTools).hide();
            // 显示页面名称
            $('#lkName', this.$pageNav).text(this.page.name).show();
                
            // 保存
            $('#lkSync', this.$pageTopTools).off('click').click(function () {
                _this.saveLayout();
            }).show();
            // 预览链接
            $('#lkPreview', this.$pageTopTools).off('click').click(function () {
                $(this).attr('href', '/factory/preview/' + AppConfig.userId + '/' + _this.page.id);
            }).show();

            // 显示 Nav
            this.$pageNav.show();
            this.$pageTopTools.show();
            $('[data-toggle="tooltip"]').tooltip({trigger:'hover'});

        },
        init: function () {
            // 初始化布局  面板
            this.initLayout();

            // 初始化 ReportConfigPanel
            this.initReportConfigPanel();
        },

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
        initLayoutDOM: function () {
            //创建中间内容区域
            this.windowCtn = document.createElement('div');
            this.windowCtn.id = 'windowCtn';

            // 创建主面板容器
            this.reportConfigPanelCtn = document.createElement('div');
            this.reportConfigPanelCtn.id = 'reportConfigPanel';
            this.windowCtn.appendChild(this.reportConfigPanelCtn);

        },
        initLayout: function () {
            var dockManager = this.screen.layout.dockManager;
            var documentNode = this.screen.layout.documentNode;

            this.initLayoutDOM();
            
            this.layout.windowPanel = new dockspawn.PanelContainer(this.windowCtn, dockManager);
            
            dockManager.dockFill(documentNode, this.layout.windowPanel);
        },
        saveLayout :function () {
            var fields = $("#reportConfigPanel>form").serializeArray();
            var rs = [];

            for (var i = 0, len = fields.length; i < len; i+=2) {
                if (fields[i].value) {
                    rs.push({
                        reportId: fields[i].value,
                        period: fields[i+1].value
                    });
                }
            };
            
            console.dir(rs);
        },
        close: function(){
            //隐藏导航条
            this.$pageNav.hide();
            this.$pageTopTools.hide();

            // 关闭 reportConfigPanel
            this.reportConfigPanel.close();
            this.reportConfigPanel = null;

            // 删除内容 
            this.windowCtn = null;

            // 销毁 ReprotWrapScreen 的所有面板
            this.screen.layout.dockManager.requestUndock(this.layout.windowPanel);

        }
    };

    exports.FacReportWrapScreen = FacReportWrapScreen;
} ( namespace('factory.screens'),
    namespace('factory.panels.ReportConfigPanel') ));