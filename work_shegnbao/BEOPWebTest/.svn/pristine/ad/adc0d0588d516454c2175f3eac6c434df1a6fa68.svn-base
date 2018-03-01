// dashboard 控件适配基类
;(function (exports, SuperClass, HtmlWidgetMixin) {

    function HtmlDashboard(layer, model) {
        SuperClass.apply(this, arguments);

        this.ins = null;
        this.modalConfigPane = null;
    }

    HtmlDashboard.prototype = Object.create(SuperClass.prototype);
    HtmlDashboard.prototype.constructor = HtmlDashboard;

    HtmlDashboard.prototype.tpl = '<div class="html-widget html-container"></div>';

    HtmlDashboard.prototype.initModalConfigPane = function () {
        var page = this.painter.getPage();
        var container;

        if (page.modalConfigPane) {
            this.modalConfigPane = page.modalConfigPane;
            return;
        }

        if ( !(container = page.windowCtn.querySelector('#energyModal')) ) {
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

    HtmlDashboard.prototype.init = function () {
        //兼容一下老数据格式
        this._format();

        SuperClass.prototype.init.apply(this, arguments);
    };

    HtmlDashboard.prototype._format = function () {
        
    };

    /** override */
    HtmlDashboard.prototype.show = function () {
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

    HtmlDashboard.prototype._initWidget = function () {
        var model = this.store.model;
        var options = this.store.model.option();
        var clazz, ioc;

        if (!options.type) {
            Log.warn('html dashboard widgets must have a type.');
            return;
        }

        ioc = this.painter.getPage().factoryIoC();
        clazz = ioc.getModel(options.type);

        if (!clazz) {
            Log.error('Can\' find modal class "' + options.type + '" in factory ioc!');
            return;
        }
        clazz = this._getWrapClazz(clazz);
        this.ins = new clazz(this, {
            modal: options
        });

        this.render();
    };

    HtmlDashboard.prototype._getWrapClazz = function (clazz) {
        var wrapClazz = function F() {
            clazz.apply(this, arguments);
        }

        wrapClazz.prototype = Object.create(clazz.prototype);

        // 重写一些方法，以做到兼容 PageScreen
        wrapClazz.prototype.initContainer = function () {
            this.container = this.screen.shape;
        };

        return wrapClazz;
    };

    /** override */
    HtmlDashboard.prototype.update = function (e, propName) {
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
            this.render();
        }

        SuperClass.prototype.update.apply(this, arguments);

        Log.info('html container widget has been updated.');
    };

    HtmlDashboard.prototype.render = function () {
        this.ins.render();
    };

    HtmlDashboard.prototype.showConfigModal = function () {
        this.ins.modalInit();
    };

    /** 适配工作 */
    HtmlDashboard.prototype = Mixin(HtmlDashboard.prototype, HtmlWidgetMixin);
    HtmlDashboard.prototype.type = 'HtmlDashboard';

    exports.HtmlDashboard = HtmlDashboard;
} (
    namespace('widgets.factory'),
    namespace('widgets.factory.HtmlWidget'),
    namespace('mixins.HtmlWidgetMixin')
));