;(function (exports, SuperClass) {

    function FacReportScreen(options, container) {
        SuperClass.apply(this, arguments);
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
            this.windowCtn.classList.add('report-wrap');
            this.windowCtn.classList.add('gray-scollbar');

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
            var timeFormat = timeFormatChange('yyyy-mm-dd');
            if ( timeFormat === 'dd/mm/yyyy' ) {
                // 交换 dd 和 mm，因为 dd/mm/yyyy 这种格式浏览器不支持
                date = date.replace(/^(\d{2})\/(\d{2})/, function ($0, $1, $2) {
                    return $2 + '/' + $1;
                });
            }
            if (timeFormat !== 'yyyy-mm-dd') {
                date = new Date(date).format('yyyy-MM-dd');
            }
            this.options.date = date;
            if(this.reportEntity.entity.modal.option.layoutScript){//动态dom 需要重新渲染dom
                this.reportEntity.root.clear();
            }
            this.reportEntity.render(true);
        };

        this.resize = function () {
            this.reportEntity.resize();
        };

        /** @override */
        this.close = function () {
            this.reportEntity.destroy();

            this.windowCtn.classList.remove('report-wrap');
            this.windowCtn.classList.remove('gray-scollbar');

            SuperClass.prototype.close.apply(this, arguments);
        };

    }.call(FacReportScreen.prototype);

    exports.FacReportScreen = FacReportScreen;
} ( namespace('observer.screens'), namespace('observer.screens.EnergyScreen') ));