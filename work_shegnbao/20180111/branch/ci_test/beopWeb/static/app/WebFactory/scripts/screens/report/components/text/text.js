;(function (exports, SuperClass) {

    function Text() {
        SuperClass.apply(this, arguments);
    }

    Text.prototype = Object.create(SuperClass.prototype);

    +function () {

        this.optionTemplate =  {
            group: '基本',
            name: 'I18n.resource.report.optionModal.TEXT',
            minWidth: 3,
            minHeight: 1,
            maxWidth: 12,
            maxHeight: 100,
            type:'Text',
            className: 'report-module-text'
        };

        /** @override */
        this.initEntity = function () {
            var options = this.entity.modal.option;

            options.text = options.text || '';
        };

        /** @override */
        this.render = function (isProcessTask) {
            this.registVariableProcessTask(this.entity.modal.variables).done(function () {
                var options = this.entity.modal.option;
                if(!options || !options.text) {
                    $(this.container).html('');
                    return;
                }
                this.__renderText();
            }.bind(this));

            if (isProcessTask === true) {
                this.root.processTask();
            }
        };

        this.__renderText = function () {
            var options = this.entity.modal.option;

            this.container.innerHTML = this.__getTplParamsAttachedHtml(options.text);
        };

        // 获取替换模板参数后的 code
        this.__getTplParamsAttachedHtml = function (code) {
            var pattern = this.TPL_PARAMS_PATTERN;
            var params = this.getTplParamsValue();
            var match;
            
            params = $.extend(false, {}, params, this.variables);
            code = code.replace(pattern, function ($0, $1) {
                if (!params[$1]) {
                    return $0;
                }
                return params[$1];
            });

            return code;
        };

        /** @override */
        this.getTplParams = function () {
            var str = this.entity.modal.option.text;
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

            EditorModal.show(option.text, true, function (content) {
                option.text = content;
                _this.__renderText();
            });
        };

        /** @override */
        this.destroy = function () {
            SuperClass.prototype.destroy.apply(this, arguments);

            this.wrap.parentNode.removeChild(this.wrap);
        };

    }.call(Text.prototype);

    exports.Text = Text;

} ( namespace('factory.report.components'), namespace('factory.report.components.Base') ));