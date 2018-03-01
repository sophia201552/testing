// dashboard 控件适配基类
;
(function(exports, SuperClass, HtmlWidgetMixin) {

    function HtmlDashboard(layer, model) {
        SuperClass.apply(this, arguments);

        this.ins = null;
        this.modalConfigPane = null;
    }

    HtmlDashboard.prototype = Object.create(SuperClass.prototype);
    HtmlDashboard.prototype.constructor = HtmlDashboard;

    HtmlDashboard.prototype.tpl = '<div class="html-widget html-container"></div>';

    HtmlDashboard.prototype.initModalConfigPane = function() {
        var page = this.painter.getPage();
        var container;

        if (page.modalConfigPane) {
            this.modalConfigPane = page.modalConfigPane;
            return;
        }

        if (!(container = page.windowCtn.querySelector('#energyModal'))) {
            container = document.createElement('div');
            container.id = 'energyModal';
            container.style.position = 'absolute';
            container.style.left = 0;
            container.style.top = 0;
            page.windowCtn.appendChild(container);
        }
        this.modalConfigPane = page.modalConfigPane = new modalConfigurePane(container, this, 'dashboard');
        this.modalConfigPane.show();
    };

    HtmlDashboard.prototype.init = function() {
        //兼容一下老数据格式
        this._format();
        SuperClass.prototype.init.apply(this, arguments);
    };

    HtmlDashboard.prototype._format = function() {
        var options = this.store.model.option();
        if (typeof this.store.model.isHide === "undefined") {
            this.store.model.property('isHide', 0);
        }
        if (options.bg == undefined) {
            options.bg = 'blackBg';
        }
        if (options.isDataSource == undefined) {
            options.isDataSource = false;
        }
        if (options.titleName == undefined) {
            options.titleName = '';
        }
        if (options.titleCss == undefined) {
            options.titleCss = '';
        }
        if (options.containerCss == undefined) {
            options.containerCss = '';
        }
        if (options.pointName == undefined) {
            options.pointName = '';
        }
        if (options.router_id == undefined) {
            options.router_id = '';
        }
        if (options.interval_link == undefined) {
            options.interval_link = '';
        }
        if (options.report_link == undefined) {
            options.report_link = '';
        }
        if (options.chapter == undefined) {
            options.chapter = 1;
        }
        if (options.consequenceProp == undefined) {
            options.consequenceProp = [{ type: "Energy waste", title: '' ,status: 1}, { type: "Comfort issue",title:'',status: 1}];
        }
        this.store.model.option(options);
    };

    /** override */
    HtmlDashboard.prototype.show = function() {
        var model = this.store.model;

        SuperClass.prototype.show.apply(this, arguments);

        this.shape = HTMLParser(this.tpl);
        this.shape.id = model._id();
        this.shape.style.position = 'absolute';
        this.shape.style.border = '1px dashed #aaa';
        this.layer.add(this.shape);

        this.update();

        this._initWidget();
    };

    HtmlDashboard.prototype._initWidget = function() {
        var model = this.store.model;
        var options = this.store.model.option();

        var bgClassName = this.store.model.option().bg;
        $(this.shape).addClass(bgClassName);
        //处理 标题 背景色
        var modelType = this.store.model.option().type;
        var allWidgetsStr = 'ModalColdHotAreaSummary,ModalEquipmentPerfectRateCoolSkin,ModalWorkOrderStatistics,ModalPriorityHandlingFaultList,ModalEnergyTrendAnalysisCoolSkin,ModalEquipmentRateAndHistoryData,ModalPriorityHandlingFaultsCoolSkin,modalRealTimeAndHistoryChartCoolSkin';
        if (allWidgetsStr.indexOf(modelType) > -1){
            if (this.store.model.option().titleName !== '') {
                $(this.shape).attr('style', $(this.shape).attr('style') + this.store.model.option().containerCss);
                var dashboardTitle = '<div class="dashboardTitle" style="' + this.store.model.option().titleCss + '">' + this.store.model.option().titleName + '</div>';
                var dashboardCtn = '<div class="dashboardCtn" style="width:100%;height:calc(100% - 50px);"></div>';
                $(this.shape).html(dashboardTitle + dashboardCtn);
            } else if (this.store.model.option().containerCss !== '') {
                $(this.shape).attr('style', $(this.shape).attr('style') + this.store.model.option().containerCss);
            }
        }
        if (!options.type) {
            Log.warn('html dashboard widgets must have a type.');
            return;
        }
        this._getClazzName();
        this.render();
    };
    HtmlDashboard.prototype._getClazzName = function() {
        var clazz, ioc;
        var options = this.store.model.option();
        ioc = this.painter.getPage().factoryIoC();
        if (options.bg === 'coolBg') {
            if (options.type === 'modalRealTimeAndHistoryChartCoolSkin'){
                clazz = ioc.getModel(options.type);
            } else {
                clazz = window[options.type + 'CoolSkin'];
            }
        } else {
            clazz = ioc.getModel(options.type);
        }
        
        if (!clazz) {
            Log.error('Can\' find modal class "' + options.type + '" in factory ioc!');
            return;
        }
        clazz = this._getWrapClazz(clazz);
        this.ins = new clazz(this, {
            modal: options
        });
    };
    HtmlDashboard.prototype._getWrapClazz = function(clazz) {
        var wrapClazz = function F() {
            clazz.apply(this, arguments);
        }

        wrapClazz.prototype = Object.create(clazz.prototype);

        // 重写一些方法，以做到兼容 PageScreen
        wrapClazz.prototype.initContainer = function() {
            this.container = this.screen.shape;
        };

        return wrapClazz;
    };
    /** override */
    HtmlDashboard.prototype.update = function(e, propName) {
        var model = this.store.model;
        var options = model.option();
        var scale;

        if (!propName || propName.indexOf('update.x') > -1 || propName.indexOf('update.y') > -1) {
            this.shape.style.left = model.x() + 'px';
            this.shape.style.top = model.y() + 'px';
        }

        if (!propName || propName.indexOf('update.w') > -1 || propName.indexOf('update.h') > -1) {
            this.shape.style.width = model.w() + 'px';
            this.shape.style.height = model.h() + 'px';
            if (propName) {
                typeof this.ins.resize === 'function' && this.ins.resize();
            }
        }

        if (propName && propName.indexOf('update.option') > -1) {
            this._getClazzName();
            this.render();
        }
        if (!propName || propName.indexOf('update.isHide') > -1) {
            if (this.store.model.isHide()) {
                this.detach();
            } else {
                this.attach();
            }
        }

        if (!propName || propName.indexOf('update.layerId') > -1) {
            this.setParent(model.layerId());
        }

        SuperClass.prototype.update.apply(this, arguments);

        Log.info('html container widget has been updated.');
    };

    HtmlDashboard.prototype.render = function () {
        if (this.ins !== null){
            this.ins.render();
        }
    };

    HtmlDashboard.prototype.showConfigModal = function() {
        this.ins.modalInit();
    };

    /** 适配工作 */
    HtmlDashboard.prototype = Mixin(HtmlDashboard.prototype, HtmlWidgetMixin);
    HtmlDashboard.prototype.type = 'HtmlDashboard';

    exports.HtmlDashboard = HtmlDashboard;
}(
    namespace('widgets.factory'),
    namespace('widgets.factory.HtmlWidget'),
    namespace('mixins.HtmlWidgetMixin')
));