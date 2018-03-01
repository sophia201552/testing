
;(function (exports, SuperClass) {

    function Summary() {
        SuperClass.apply(this, arguments);

        this.chapterNo = null;
    }

    Summary.prototype = Object.create(SuperClass.prototype);

    +function () {
        var DEFAULTS = {
            showTitle: true
        };

        this.optionTemplate = Mixin(this.optionTemplate, {
            name: 'I18n.resource.report.optionModal.SUMMARY',
            type: 'Summary',
            spanC: 12,
            spanR: 4,
            className: 'report-summary-container'
        });

        this.initTools = function (tools) {
            tools = tools ||  ['remove'];
            SuperClass.prototype.initTools.call(this, tools);
        };

        this.refreshSummary = (function () {
            var options, _this;

            function recursion(data, deep) {
                if (!data) return;
                data.forEach(function (row) {
                    var chapterNo = row[0].chapterNo;
                    var chapterSummary = row[0].chapterSummary;
                    var guid = ObjectId();
                    var formattedCode;

                    if (!chapterSummary || 
                        (!chapterSummary.html && !chapterSummary.js && !chapterSummary.css)) {
                        recursion(row[1], deep);
                        return;
                    }

                    formattedCode = _this._getFormattedHtml(chapterSummary, guid);

                    if (formattedCode.html !== '' || formattedCode.css !== '' || formattedCode.js !== '') {
                        options.html += '<div data-deep="' + deep + '" data-chapter-no="' + chapterNo + '" class="chapter-summary-wrap" style="margin-top:5px; margin-left:'+(30 + 20*deep)+'px;">' + formattedCode.html + '</div>';
                        options.css += formattedCode.css;
                        options.js += formattedCode.js;

                        _this.guids.push(guid);
                        namespace('__f_hc')[guid] = {
                            variables: row[0].variables,
                            api: _this.getTemplateAPI(),
                            reportOptions: _this.getReportOptions()
                        };
                    }
                    recursion(row[1], deep+1);
                });
            }

            return function (summary, opt) {
                _this = this;
                arrHtml = [];

                opt = $.extend(false, {}, DEFAULTS, opt);

                options = {
                    html: opt.showTitle ? ('<h1>'+I18n.resource.report.optionModal.SUMMARY+'</h1>') : '',
                    css: '',
                    js: ''
                };

                if (summary) {
                    recursion(summary, 0);
                    this._runCode(options);
                }
            };
        } ());

        /** @override */
        this.render = function () {};

    }.call(Summary.prototype);

    exports.Summary = Summary;

} ( namespace('factory.report.components'),
    namespace('factory.report.components.Html') ));
