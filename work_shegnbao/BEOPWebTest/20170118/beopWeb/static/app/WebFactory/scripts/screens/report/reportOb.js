;(function (exports, SuperClass) {

    function FacReportScreen(options, container) {
        SuperClass.apply(this, arguments);

        this.reportDate = options.date;
    }

    FacReportScreen.prototype = Object.create(SuperClass.prototype);

    +function () {

        this.htmlUrl = '/static/app/WebFactory/views/reportScreen.html';

        this.initIoc = function() {
            this.factoryIoC = new FactoryIoC('report');
        };

        this.initLayoutDOM = function (html) {
            var domCtn;
            var divMain, stCt;

            this.windowCtn.innerHTML = html;
            this.windowCtn.classList.add('report-wrap', 'gray-scollbar');

            this.container = this.windowCtn.querySelector('#reportWrap');
            this.$container = $(this.container);
            this.container.classList.remove('report');
            this.container.classList.add('report-ob');
        };

        this.initWorkerForUpdating = function () {};

        this.initModuleLayout = function (type) {
            var layouts = this.store.layout[0] || [];
            var options, Clazz;
            
            if (!type || type === 'Container') {
                type = 'ReportContainer';
            }
            Clazz = namespace('factory.report.components')[type];

            // 对旧数据做个兼容
            if (layouts.length === 1 && ['Container', 'ReportContainer'].indexOf(layouts[0].modal.type) > -1 ) {
                options = layouts[0].modal.option;
            } else {
                options = {
                    layouts: layouts,
                    period: 'day'
                };
            }

            this.reportEntity = new Clazz(this, {
                spanC: 12,
                spanR: 6,
                modal: {
                    option: $.extend(false, options, {
                        period: this.options.period
                    }),
                    type: type
                }
            });

            this.reportEntity.render(true);
        };

        this.setReportDate = function (date) {
            this.reportDate = date;
            this.reportEntity.render(true);
        };

        this.resize = function () {
            this.reportEntity.resize();
        };

        /** @override */
        this.close = function () {
            this.reportEntity.destroy();

            this.windowCtn.classList.remove('report-wrap', 'gray-scollbar');

            SuperClass.prototype.close.apply(this, arguments);
        };

    }.call(FacReportScreen.prototype);

    exports.FacReportScreen = FacReportScreen;
} ( namespace('observer.screens'), namespace('observer.screens.EnergyScreen') ));