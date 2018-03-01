/**
 * 自定义汇总控件
 */
;(function (exports, SuperClass, VariableProcessMixin) {

    function CustomSummary() {
        SuperClass.apply(this, arguments);

        this.chapterNo = null;
        options = null;
    }

    CustomSummary.prototype = Object.create(SuperClass.prototype);
    CustomSummary.prototype.constructor = CustomSummary;

    +function () {
        this.getSummaryFromData = (function () {
            function getSummaryList(data, parent) {
                var _this = this;
                var layouts = data.modal.option.layouts || [];
                var summary = [];

                parent = parent || {};

                layouts.forEach(function (row) {
                    summary = summary.concat(getSummary.call(_this, row, parent));
                });
                return summary;
            };

            function getSummary(data, parent) {
                var _this = this;
                var summary = [];
                var o = {
                    variables: {},
                    chapterNo: '',
                    chapterSummary: data.modal.option.chapterSummary || '',
                    screen: parent
                };

                this.registTask(data.modal.variables, o).done(function (rs) {
                    o.variables = _this.createObjectWithChain(rs, o.screen.variables);
                });

                summary.push(o);
                summary.push(getSummaryList.call(this, data, o));
                return [summary];
            };

            return function (data) {
                return getSummaryList.call(this, data);
            };
        } ());

    }.call(CustomSummary.prototype);

    // 附加特性
    // 给自定义汇总控件附加上 “变量处理” 的功能特性
    CustomSummary.prototype = Mixin( CustomSummary.prototype, new VariableProcessMixin() );

    exports.CustomSummary = CustomSummary;

} ( namespace('factory.report.components'),
    namespace('factory.report.components.Summary'),
    namespace('factory.report.mixins.VariableProcessMixin') ));
