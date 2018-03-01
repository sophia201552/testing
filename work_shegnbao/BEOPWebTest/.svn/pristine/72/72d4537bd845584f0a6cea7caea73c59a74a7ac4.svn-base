;(function (exports, SuperClass) {

    function Container() {
        this.children = [];

        SuperClass.apply(this, arguments);

        this.entity.modal.option = this.entity.modal.option || {};
        this.entity.modal.option.layouts = this.entity.modal.option.layouts || [];
    }

    Container.prototype = Object.create(SuperClass.prototype);

    +function () {

        this.optionTemplate = Mixin(this.optionTemplate, {
            group: '基本',
            name: '容器',
            minWidth: 12,
            minHeight: 6,
            maxWidth: 12,
            maxHeight: 6,
            spanC: 12,
            spanR: 12,
            type: 'Container',
            className: 'report-root-container'
        });

        this.init = function () {
            var _this = this;
            var container;

            SuperClass.prototype.init.apply(this, arguments);

            container = $('#reportContainer_'+this.entity.id)[0];

            // 初始化 IOC
            this.initIoc();

            // 初始化拖拽添加 modal 的代码
            container.ondragenter = function (e) {
                e.preventDefault();
                e.stopPropagation();
            };

            container.ondragover = function (e) {
                e.preventDefault();
                e.stopPropagation();
            };

            container.ondrop = function (e) {
                var type = e.dataTransfer.getData('type');

                e.stopPropagation();
                // 非模板
                if (type !== 'template') {
                    _this.add({
                        modal: {
                            type: e.dataTransfer.getData('type'),
                            option: {}
                        }
                    });
                }
                // 模板
                else {
                    _this.add({
                        modal: {
                            type: exports.ChapterContainer.prototype.optionTemplate.type,
                            option: {
                                layouts: JSON.parse( e.dataTransfer.getData('layouts') )
                            }
                        }
                    });
                }
            };
        };

        this.initIoc = function() {
            this.factoryIoC = new FactoryIoC('report');
        };

        /* override */
        this.initResizer = function () {};

        this.initTools = function (tools) {
            tools = tools || [];
            SuperClass.prototype.initTools.call(this, tools);
        };

        this.add = function (params, isRenderAfterCreate) {
            var modalClass = this.factoryIoC.getModel(params.modal.type);
            var options = modalClass.prototype.optionTemplate;
            var ins;

            isRenderAfterCreate = typeof isRenderAfterCreate === 'undefined' ? true : isRenderAfterCreate;

            params.spanC = params.spanC || options.spanC || options.minWidth;
            params.spanR = params.spanR || options.spanR || options.minHeight;
            ins = new modalClass(this, params, this.root);

            this.children.push(ins);
            this.entity.modal.option.layouts.push(ins.entity);

            // 如果新增的元素是章节，则更新章节编号
            this.refreshTitle(this.chapterNo);

            isRenderAfterCreate && this.render();

            return ins;
        };

        this.remove = function (id) {
            var idx = -1;
            var removed = null;

            this.children.some(function (row, i) {
                if (row.entity.id === id) {
                    idx = i;
                    return true;
                }
                return false;
            });

            if (idx > -1) {
                removed = this.children.splice(idx, 1);
                removed[0].destroy();
                this.refreshTitle(this.chapterNo);
                this.entity.modal.option.layouts.splice(idx, 1);
            }

        };

        this.initLayout = function () {
            var layouts = this.entity.modal.option.layouts;

            if (!layouts || !layouts.length) return;

            layouts.forEach(function (layout) {
                var modelClass, ins;
                if (layout.modal.type) {
                    modelClass = this.factoryIoC.getModel(layout.modal.type);
                    if(!modelClass) return;
                    ins = new modelClass(this, layout, this.root);
                    this.children.push(ins);
                    ins.render();
                }
            }.bind(this));
        };

        this.resize = function () {
            
            var ele = this.container.parentNode;

            ele.style.minHeight = this.entity.spanR * this.UNIT_HEIGHT + 'px';

            this.children.forEach(function (row) {
                row.resize();
            });
        };

        this.render = function () {
            if (!this.children.length) {
                this.initLayout();
            } else {
                this.children.forEach(function (row) {
                    row.render();
                });
            }
        };

        this.refreshTitle = function (chapterNo) {
            // 更新 title
            var chapterChildren = [];

            if (chapterNo) { this.chapterNo = chapterNo || ''; }

            chapterChildren = this.children.filter(function (row) {
                return row instanceof exports.ChapterContainer;
            });

            chapterNo = chapterNo ? (chapterNo + '.') : '';
            chapterChildren.forEach(function (row, i) {
                row.refreshTitle( chapterNo + (i+1) );
            });
        };

        this.refreshSummary = function () {
            var summary = this.getSummary();

            this.children.forEach(function (row) {
                if (row instanceof exports.Summary ) {
                    row.render(summary);
                }
            });
        };

        this.getSummary = function () {
            var summary = [];

            var chapterChildren = this.children.filter(function (row) {
                return row instanceof exports.ChapterContainer;
            });

            if (chapterChildren.length) {
                chapterChildren.forEach(function (row) {
                    summary.push( row.getSummary() );
                });
            } else {
                summary.push(this.entity.modal.option.chapterSummary);
            }

            return summary;
        };

        /** @override */
        // 返回值格式： [params1, params2, params3, ...]
        this.getTplParams = function () {
            var paramsArr = [];

            this.children.forEach(function (row) {
                paramsArr = paramsArr.concat( row.getTplParams() );
            });

            // 参数去重
            paramsArr = paramsArr.sort().filter(function (row, pos, arr) {
                return !pos || row != arr[pos - 1];
            });
            return paramsArr;
        };

        /** @override */
        this.applyTplParams = function (params) {
            this.children.forEach(function (row) {
                row.applyTplParams(params);
            });
        };

        this.destroy = function () {
            this.children.forEach(function (row) {
                row.destroy();
            });
            this.container.parentNode.removeChild(this.container);
        };

    }.call(Container.prototype);

    exports.Container = Container;

} ( namespace('factory.report.components'), 
    namespace('factory.report.components.Base') ));
