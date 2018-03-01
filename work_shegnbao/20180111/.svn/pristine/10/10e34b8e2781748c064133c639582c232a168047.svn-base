;
(function(exports, SuperClass, ChartThemeConfig) {

    function DashboardWidget() {
        SuperClass.apply(this, arguments);

        this.ins = null;
        this.modalConfigPane = null;
        this.store = null;
    }

    DashboardWidget.prototype = Object.create(SuperClass.prototype);

    +

    function() {
        /** @override */
        this.optionTemplate = Mixin(this.optionTemplate, {
            type: "DashboardWidget",
            maxHeight: 15,
            maxWidth: 12,
            minHeight: 5,
            minWidth: 6,
        });

        this.initTools = function(tools) {
            tools = tools || ['configure', 'remove'];
            SuperClass.prototype.initTools.call(this, tools);
        };
        /** @override */
        this.resize = function () {
            SuperClass.prototype.resize.call(this);
            if (this.ins){
                this.ins.render();
            }
        };
        /** @override */
        this.getClass = function (isProcessTask) { 
            var listClass = this.root.factoryIoC.listClass;
            var typeName = this.entity.modal.type;
            var clazz;
            for (var i = 0, len = listClass.length; i < len; i++) {
                if (typeName.toLowerCase() == listClass[i].name.toLowerCase()) {
                    clazz = listClass[i];
                }
            }

            if (!clazz) {
                Log.error('Can\' find modal class "' + options.type + '" in factory ioc!');
                return;
            }
            clazz = this._getWrapClazz(clazz);
            this.ins = new clazz(this, {
                modal: this.entity.modal
            });
        };
        this.render = function () {
            if (this.ins === null){ 
                this.getClass(true);
            }
            this.ins.render();
        };
        this._getWrapClazz = function(clazz) {
            var wrapClazz = function F() {
                clazz.apply(this, arguments);
            }
            wrapClazz.prototype = Object.create(clazz.prototype);
            wrapClazz.prototype.initContainer = function() {
                this.container = this.screen.container;
            };
            return wrapClazz;
        };
        this.initModalConfigPane = function() {
            if (!this.modalConfigPane) {
                if ($(this.screen.container).find('#reportDashboardModelContainer').length === 0) {
                    var modelContainer = '<div id="reportDashboardModelContainer" style="position:absolute;top:0;left:0;"></div>';
                    $(this.screen.container).css({ position: 'relative' }).append($(modelContainer));
                }
                this.modalConfigPane = new modalConfigurePane(document.getElementById('reportDashboardModelContainer'), this.ins, 'dashboard');
                this.modalConfigPane.show();
            }
        };
        this.showConfigModal = function() {
            this.ins.modalInit();
        };
        /** @override */
        this.destroy = function() {
            SuperClass.prototype.destroy.apply(this, arguments);

            if (this.chart) {
                this.chart.dispose();
            }
            this.wrap.parentNode.removeChild(this.wrap);
        };

    }.call(DashboardWidget.prototype);

    exports.DashboardWidget = DashboardWidget;

}(namespace('factory.report.components'),
    namespace('factory.report.components.Base'),
    namespace('factory.report.config.ChartThemeConfig')));