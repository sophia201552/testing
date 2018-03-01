;(function (exports, SuperClass) {
    // 单独使用一个 spinner，用于数据加载时的 laoding
    var Spinner = new LoadingSpinner({ color: '#00FFFF' });

    function ReportContainer() {
        SuperClass.apply(this, arguments);
    }

    ReportContainer.prototype = Object.create(SuperClass.prototype);
    ReportContainer.prototype.constructor = ReportContainer;

    +function () {
        /** @override */
        this.optionTemplate = Mixin(this.optionTemplate, {
            group: '基本',
            name: 'I18n.resource.report.REPORT_RIGHT_NAME',
            minWidth: 12,
            minHeight: 6,
            maxWidth: 12,
            maxHeight: 6,
            spanC: 12,
            spanR: 12,
            type: 'ReportContainer',
            className: 'chapter-container'
        });

        /** @override */
        this.render = function (isProcessTask) {
            this.registVariableProcessTask(this.entity.modal.variables).done(function (variables) {
                // 保存 variables
                this.variables = variables;
            }.bind(this));

            if (!this.children.length) {
                this.initLayout();
            } else {
                this.children.forEach(function (row) {
                    row.render();
                });
            }

            if (isProcessTask === true) {
                Spinner.spin(document.body);
                this.processTask().always(function () {
                    // 汇总信息需要等到页面数据加载完毕才进行渲染
                    this.refreshSummary();

                    Spinner.stop();
                    // phantom
                    console.info('phantom - render summary complete');
                }.bind(this));
            }

            // 刷新标题
            this.refreshTitle();
        };

    }.call(ReportContainer.prototype);

    exports.ReportContainer = ReportContainer;

} ( namespace('factory.report.components'), 
    namespace('factory.report.components.Container') ));