;(function (exports, SuperClass) {

    function Html() {
        SuperClass.apply(this, arguments);
    }

    Html.prototype = Object.create(SuperClass.prototype);

    // html container api
    function HCAPI() {}

    +function () {

        this.getHistoryData = function () {
            return WebAPI.post('/analysis/startWorkspaceDataGenHistogram', params);
        };

    }.call(HCAPI.prototype);

    +function () {

        this.optionTemplate =  {
            group: '基本',
            name: '文本',
            minWidth: 2,
            minHeight: 1,
            maxWidth: 12,
            maxHeight: 100,
            type:'Html'
        };

        /** @override */
        this.render = function () {
            var _this = this;
            var options = this.entity.modal.option;
            var formattedCode, html, guid;

            if(!options) {
                $(this.container).html('');
                return;
            }

            guid = ObjectId();
            code = this.__getTplParamsAttachedHtml(options);
            formattedCode = this.__getFormattedHtml(code, guid);
            namespace('__f_hc')[guid] = new HCAPI();

            // 渲染 html
            this.container.innerHTML = [formattedCode.html, formattedCode.css].join('\n');
            // 执行 js
            (function (code) {
                var done = false;
                var script = document.createElement("script");
                var head = document.getElementsByTagName("head")[0];
                script.type = "text\/javascript";
                script.text = code;
                head.appendChild(script);
                head.removeChild(script);
            } (formattedCode.js));
        };

        this.__getFormattedHtml = function (code, guid) {
            var _this = this;
            var patternScript = /(<script\b[^>]*>)([\s\S]*?)(<\/script>)/img;

            var htmlWrapTpl = '<div id="hc_'+guid+'">|code|</div>';

            var jsWrapTpl = (function () {
                return '(function(_api) {'+
                'var _container = document.querySelector("#hc_'+guid+'");' +
                '|code|}).call(null, window.__f_hc["'+guid+'"])';
            } ());

            var cssWrapTpl = '<style>|code|</style>';
            // script 标签处理
            var formatHtml = code.html.replace(patternScript, function($0, $1, $2, $3) {
                return '';
            });
            // 给 css selector 加上 id 的前缀
            // /([,|\}|\r\n][\s]*)([\.#]?-?[_a-zA-Z]+[_a-zA-Z0-9-]*)/mg
            // /([^\r\n,{}]+)(,(?=[^}]*{)|\s*(?={))/mg
            var formatCss = code.css.replace(/([^\r\n,{}]+)(,(?=[^}]*{)|\s*(?={))/mg, function ($0, $1, $2) {
                return '#hc_' + guid + ' ' + $1;
            });
            var formatJs = jsWrapTpl.replace('|code|', code.js);
            formatCss = cssWrapTpl.replace('|code|', formatCss);
            formatHtml = htmlWrapTpl.replace('|code|', formatHtml);

            return {
                html: formatHtml,
                css: formatCss,
                js: formatJs
            }
        };

        // 获取替换模板参数后的 code
        this.__getTplParamsAttachedHtml = function (code) {
            var _this = this;
            var pattern = this.TPL_PARAMS_PATTERN;
            var options = this.entity.modal.option;

            if (!options.tplParams) {
                return code;
            } else {
                return {
                    html: (code.html || '').replace(pattern, function ($0, $1) {
                        return options.tplParams[$1];
                    }),
                    js: (code.js || '').replace(pattern, function ($0, $1) {
                        return options.tplParams[$1];
                    }),
                    css: (code.css || '').replace(pattern, function ($0, $1) {
                        return options.tplParams[$1]; 
                    })
                };
            }
        };

        /** @override */
        this.getTplParams = function () {
            var options = this.entity.modal.option;
            var str = options.html +  options.css + options.js;
            var pattern = this.TPL_PARAMS_PATTERN;
            var match = null;
            var params = [];

            while( match = pattern.exec(str) ) {
                params.push(match[1]);
            }

            return params;
        };

        /** @override */
        this.showConfigModal = function () {
            var _this = this;
            var option = this.entity.modal.option;

            CodeEditorModal.show(option, function (code) {
                _this.entity.modal.option.html = code.html;
                _this.entity.modal.option.js = code.js;
                _this.entity.modal.option.css = code.css;
                _this.render();
            });
        };

    }.call(Html.prototype);

    exports.Html = Html;

} ( namespace('factory.report.components'), namespace('factory.report.components.Base') ));