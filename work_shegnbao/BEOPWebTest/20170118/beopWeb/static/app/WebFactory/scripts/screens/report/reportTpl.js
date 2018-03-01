
;(function (exports, SuperClass, ReportTplParamsPanel) {
    var timer = null;
    var saveTimer;
    function FacReportTplScreen() {
        SuperClass.apply(this, arguments);
    }

    FacReportTplScreen.prototype = Object.create(SuperClass.prototype);

    +function () {

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
                if (rs.content && rs.content.layout) {
                    p.layout = [[rs.content.layout]];
                } else {
                    p.layout = [[]];
                }
                return p;
            });
        };
		this.spinner = function(flag){
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
		};
        /** @override */
        this.initNav = function () {
            var _this = this;

            this.$pageNav = $('#pageNav');
            this.$pageTopTools = $('#pageTopTools');
            this.$userNav = $('#userNav');

            $('a', this.$pageTopTools).hide();
            // 显示页面名称
            $('#lkName', this.$pageNav)
                .text(I18n.resource.report.TEMPLATE_EDIT + ' - ' + this.page.name.split(' - ')[0])
                .attr("title",I18n.resource.report.TEMPLATE_EDIT + ' - ' + this.page.name.split(' - ')[0]).show();
            // 重置预览链接
            $('#lkPreview', this.$pageTopTools)
                .attr('href', '/factory/previewMaterial/report/' + this.page.id);
            // '保存'按钮
            $('#lkSync').off().on('click', function () {
                // TODO 动画开始
                _this.spinner('start');
                _this.saveLayout(function (state) {
                    // TODO 动画结束
	                _this.spinner(state);
                });
            }).show();
            // '预览'按钮
             $('#lkPreview').off().on('click', function () {
                Spinner.spin(document.body);
                _this.saveLayout(function () {
                    // TODO 动画结束
	                Spinner.stop();
                });
             }).show();
            // '退出编辑'按钮
            $('#lkQuit').off().on('click', function () {
                _this.close();
            }).show();

            //左上角的  Webfactory  显示
            $('#divLogoWrap a').attr('id','templateEdit').text('WebFactory '+I18n.resource.report.TEMPLATE_EDIT);
            $('#divLogoWrap #templateEdit').off().on('click', function () {
                _this.close();
            })
            $('#divLogoWrap').show();
            
            this.$pageTopTools.show();
            this.$pageNav.show();
            this.$userNav.hide();
        };

        /** @override */
        this.initLayout = function () {
            var dockManager = this.facScreen.layout.dockManager;
            var documentNode = this.facScreen.layout.documentNode;

            var windowPanel, dataSourcePanel, modulePanel;
            var windowNode, dataSourceNode, moduleNode;

            this.initLayoutDOM.apply(this, arguments);

            this.layout.windowPanel = windowPanel = new dockspawn.PanelContainer(this.windowCtn, dockManager);
            this.layout.dataSourcePanel = dataSourcePanel = new dockspawn.PanelContainer(this.dataSourcePanelCtn, dockManager);
            this.layout.modulePanel = modulePanel = new dockspawn.PanelContainer(this.modulePanelCtn, dockManager);
            this.layout.reportTplPanel = new dockspawn.PanelContainer(this.reportTplPanelCtn, dockManager);

            dataSourceNode = dockManager.dockRight(documentNode, dataSourcePanel, .2);
            moduleNode = dockManager.dockFill(dataSourceNode, modulePanel);
            windowNode = dockManager.dockFill(documentNode, windowPanel);
            dockManager.dockFill(moduleNode, this.layout.reportTplPanel);
        };

        /** @override */
        this.initModuleLayout = function () {
            SuperClass.prototype.initModuleLayout.apply(this, ['ChapterContainer']);

            this.reportEntity.refreshTitle('1');
        };

        /** @override */
        this.saveLayout = function (callback) {
            var _this = this;
            var data = {
                _id: this.page.id,
                content: {
                    layout: this.reportEntity.entity
                }
            };

            WebAPI.post('/factory/material/edit', data).done(function () {
                // 更新 storeSerializedStr, 标识存储的数据被更改
                _this.dataSign = _this.getDataSign();
                // 执行成功回调
                typeof callback === 'function' && callback(1);
            }).fail(function () {
                // 执行失败回调
                typeof callback === 'function' && callback(0);
            });
        };

        // 应用模板参数
        this.applyTplParams = function (params) {
            this.reportEntity.applyTplParams(params);
            this.reportEntity.render(true);
        };

        // 获取模板参数列表
        this.getTplParams = function () {
            return this.reportEntity.getTplParams();
        };

        this.close = function () {
            $('#divLogoWrap #templateEdit').attr('id','lkProjectLogo').text('WebFactory');

            SuperClass.prototype.close.apply(this, arguments);

            // 同时销毁 factory screen
            this.facScreen.close();
        };

    }.call(FacReportTplScreen.prototype);

    exports.FacReportTplScreen = FacReportTplScreen;

} ( namespace('factory.screens'), 
    namespace('factory.screens.FacReportScreen'),
    namespace('factory.panels.ReportTplParamsPanel') ));