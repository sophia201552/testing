// factoryTpl.js - factory 模板入口
;(function (exports, SuperClass, screens) {

    function FactoryTplScreen() {
        SuperClass.apply(this, arguments);
    }

    FactoryTplScreen.prototype = Object.create(SuperClass.prototype);

    +function () {

        /** @override */
        this.init = function () {
            SuperClass.prototype.init.apply(this, arguments);
        };

        this.initNav = function () {
            // 隐藏 LOGO
            document.querySelector('#divLogoWrap').style.display = 'none';
            // 隐藏用户菜单
            document.querySelector('#pageNav').style.display = 'none';
        };

        /** @override */
        this.show = function (params, type) {
            var _this = this;
            Spinner.spin(document.body);

            // 预加载步骤
            this.preLoad().done(function () {
                this.showTemplatePage(params, type);
                Spinner.stop();
            }.bind(this));
        };

        this.showTemplatePage = function (params, type) {
            if (type === 'report') {
                this.page = new screens.FacReportTplScreen(params, this);
                this.page.show();
            }
        };

        /** @override */
        this.initLayoutDOM = function () {};

        /** @override */
        this.initLayout = function () {
            var divDockManager = document.querySelector('#panels');
            var dockManager = this.layout.dockManager = new dockspawn.DockManager(divDockManager);

            var onResized = function(e) {
                dockManager.resize(window.innerWidth - (divDockManager.clientLeft + divDockManager.offsetLeft), window.innerHeight - (divDockManager.clientTop + divDockManager.offsetTop));
            };

            dockManager.initialize();
            // 自适应
            window.onresize = onResized;
            onResized(null);

            this.layout.documentNode = dockManager.context.model.documentManagerNode;
        };

        this.close = function () {
            this.page = null;

            // 停止数据同步
            this.syncWorker && this.syncWorker.close();

            // 销毁所有停靠窗口
            this.layout.dockManager.context.model.rootNode.container.destroy();

            // 恢复LOGO
            document.querySelector('#divLogoWrap').style.display = '';
            // 恢复用户菜单
            document.querySelector('#pageNav').style.display = '';

            $('#mainframe').hide();
            $('#modalframe').show();
        };

    }.call(FactoryTplScreen.prototype);

    exports.FactoryTplScreen = FactoryTplScreen;

} ( namespace('factory'), namespace('factory.FactoryScreen'), namespace('factory.screens') ));