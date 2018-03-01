;(function (exports, SuperClass) {

    function ChapterContainer() {
        SuperClass.apply(this, arguments);

        this.chapterNo = null;
    }

    ChapterContainer.prototype = Object.create(SuperClass.prototype);

    +function () {

        /** @override */
        this.optionTemplate = Mixin(this.optionTemplate, {
            name: '章节',
            type: 'ChapterContainer',
            spanC: 12,
            spanR: 4,
            className: 'chapter-container'
        });

        /** @override */
        this.initTools = function (tools) {
            tools = tools || ['tplParamsConfigure', 'configure', 'remove'];
            SuperClass.prototype.initTools.call(this, tools);
        };

        /** @override */
        this.refreshTitle = (function () {

            if (AppConfig.isReportConifgMode) {
                return function (chapterNo) {
                    // 更新 title
                    var divWrap = document.querySelector('#reportContainer_' + this.entity.id);
                    var divTitle = divWrap.querySelector('.report-title');
                    var chapterChildren = [];

                    // 如果没有提供章节编号，则不进行任何处理
                    if (!chapterNo) {
                        divTitle.innerHTML =  (this.chapterNo ? (this.chapterNo + ' ') : '') + (this.entity.modal.option.chapterTitle || '');
                        return;
                    }
                    divTitle.innerHTML =  (chapterNo ? (chapterNo + ' ') : '') + (this.entity.modal.option.chapterTitle || '');
                    
                    SuperClass.prototype.refreshTitle.apply(this, arguments);
                };
            } else {
                return function (chapterNo) {
                    var num = chapterNo.split('.').length;
                    var domTitle = document.createElement('h'+num);
                    var $container = $(this.container);

                    domTitle.innerHTML = (chapterNo ? (chapterNo + ' ') : '') + (this.entity.modal.option.chapterTitle || '');
                    $container.prepend(domTitle);
                    $container.addClass( 'chapter-' + chapterNo.split('.').length );

                    SuperClass.prototype.refreshTitle.apply(this, arguments);
                };
            }

        } ())

        /** @override */
        this.initTitle = function () {
            var divWrap = document.querySelector('#reportContainer_' + this.entity.id);
            var divParent = divWrap.querySelector('.report-container');
            // 添加标题
            var divTitle = document.createElement('div');
            divTitle.className = 'report-title';
            divParent.appendChild(divTitle);
        };

    }.call(ChapterContainer.prototype);

    exports.ChapterContainer = ChapterContainer;

} ( namespace('factory.report.components'), namespace('factory.report.components.Container') ));