;(function (exports, SuperClass) {

    var Spinner = new LoadingSpinner({ color: '#00FFFF' });
    function ChapterContainer() {
        SuperClass.apply(this, arguments);

        this.chapterNo = null;
        this.taskPromise = null;
    }

    ChapterContainer.prototype = Object.create(SuperClass.prototype);
    ChapterContainer.prototype.constructor = ChapterContainer;

    +function () {

        var HtmlAPI = (function () {
            function HtmlAPI() {
                this.promise = $.Deferred();
            }

            HtmlAPI.prototype.show = function () {
                this.promise.resolve();
            };

            HtmlAPI.prototype.hide = function () {
                this.promise.reject();
            };

            return HtmlAPI;
        } ());

        /** @override */
        this.optionTemplate = Mixin(this.optionTemplate, {
            name: 'I18n.resource.report.optionModal.CHAPTER',
            type: 'ChapterContainer',
            spanC: 12,
            spanR: 4,
            className: 'chapter-container'
        });

        /** override */
        this.init = function () {
            this.initPageBreak();
            SuperClass.prototype.init.apply(this, arguments);           
        };

        this.initPageBreak = function() {
            if(this.entity.modal.option.isPageBreak == undefined){
                if(this.screen.children && this.screen.children.length == 0){
                    this.entity.modal.option.isPageBreak = false;
                }else{
                    this.entity.modal.option.isPageBreak = true;
                }
            }
        };

        /** @override */
        this.render = function (isProcessTask) {
            this.taskPromise = this.registVariableProcessTask(this.entity.modal.variables).fail(function () {
                this.destroy();
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
                this.root.processTask().always(function(){
                    Spinner.stop();
                });
            }
        };

        /** @override */
        this.initEntity = function () {
            // 兼容老数据
            var options = this.entity.modal.option;
            if ( typeof options.chapterSummary === 'undefined' ||
                 typeof options.chapterSummary === 'string') {
                options.chapterSummary = {
                    html: options.chapterSummary || '',
                    css: '',
                    js: ''
                };
            }

            if ( typeof options.chapterDisplay === 'undefined' ) {
                options.chapterDisplay = '';
            }
        };

        /** @override */
        this.initTools = function (tools) {
            tools = tools || ['pageBreak', 'export', 'variable', 'configure', 'remove'];
            SuperClass.prototype.initTools.call(this, tools);
        };

        /** @override */
        this.refreshTitle = (function () {

            if (AppConfig.isReportConifgMode) {
                return function (chapterNo, isHideNo) {
                    // 更新 title
                    var divWrap = this.wrap;
                    var divTitle = divWrap.querySelector('.report-title');
                    var chapterChildren = [];

                    // 如果没有提供章节编号，则不进行任何处理
                    if (!chapterNo) {
                        divTitle.innerHTML = (this.chapterNo && !isHideNo ? (this._formatChapterNo(this.chapterNo) + ' ') : '') + (this.entity.modal.option.chapterTitle || '');
                        return;
                    }
                    divTitle.innerHTML =  (chapterNo && !isHideNo ? (this._formatChapterNo(chapterNo) + ' ') : '') + (this.entity.modal.option.chapterTitle || '');
                    
                    SuperClass.prototype.refreshTitle.apply(this, arguments);
                };
            } else {
                return function (chapterNo, isHideNo) {
                    var num = chapterNo.split('.').length;
                    var domTitle = document.createElement('h'+num);
                    var $container = $(this.container);

                    // 添加锚点
                    domTitle.classList.add('headline');
                    domTitle.id = 'headline_' + chapterNo.replace(/\./g, '-');
                    
                    domTitle.innerHTML = (chapterNo && !isHideNo ? (this._formatChapterNo(chapterNo) + ' ') : '') + (this.entity.modal.option.chapterTitle || '');
                    $container.children('.headline').remove();
                    $container.prepend(domTitle);
                    $container.addClass( 'chapter-' + chapterNo.split('.').length );

                    SuperClass.prototype.refreshTitle.apply(this, arguments);
                };
            }

        } ());

        this._formatChapterNo = function (chapterNo) {
            // 只对一级章节做处理
            if (chapterNo.indexOf('.') === -1) {
                return I18n.resource.report.chapterConfig.NUMBER + chapterNo + I18n.resource.report.chapterConfig.CHAPTER;
            }
            return chapterNo;
        };

        /** @override */
        this.initTitle = function () {
            var divWrap = this.wrap;
            //var divParent = divWrap.querySelector('.report-container
            var divTOP = divWrap.querySelector('.report-top-box');
            // 添加标题
            var divTitle = document.createElement('div');
            divTitle.className = 'report-title';
            //divParent.appendChild(divTitle);
            divTOP.appendChild(divTitle);
        };

        /** @override */
        this.getSummary = function () {
            var summary = [];

            summary.push({
                variables: this.variables,
                chapterNo: this.chapterNo,
                chapterSummary: this.entity.modal.option.chapterSummary || ''
            });

            summary.push(SuperClass.prototype.getSummary.apply(this, arguments));

            return [summary];
        };
        // 注册一个处理变量的任务
        this.registVariableProcessTask = function (variables) {
            var promise = this.root.registTask(variables, this);
            return promise.then(function (rs) {
                this.variables = this.createObjectWithChain(rs);
                return this.isShow();
            }.bind(this));
        };

        // 判断当前控件是否需要显示
        this.isShow = function () {
            var layout = this.entity;
            var options = layout.modal.option;
            var _api;

            if(options){
                chapterDisplay = layout.modal.option.chapterDisplay;
            }

            if ( !AppConfig.isReportConifgMode && chapterDisplay ) {
                // 进行显示/隐藏的判断
                _api = new HtmlAPI();
                // 执行用户的判断逻辑
                new Function('_api', '_reportOptions', '_variables', chapterDisplay)(_api, this.getReportOptions(), this.variables);
                // 返回一个 promise 对象
                return _api.promise;
            }
        };

        /**
         * @override
         */
        this.export = function (name) {
            return WebAPI.post('/factory/material/edit', {
                _id: ObjectId(),
                content: {layout: this.entity},
                creator: AppConfig.userProfile.id,
                group: '',
                isFolder: 0,
                name: name,
                time: new Date().format('yyyy-MM-dd HH:mm:ss'),
                type: 'report'
            });
        };

    }.call(ChapterContainer.prototype);

    exports.ChapterContainer = ChapterContainer;

} ( namespace('factory.report.components'), 
    namespace('factory.report.components.Container') ));