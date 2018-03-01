;
(function(exports, SuperClass, VariableProcessMixin) {

    function Container() {
        this.children = [];

        SuperClass.apply(this, arguments);

        this.entity.modal.option = this.entity.modal.option || {};
        this.entity.modal.option.layouts = this.entity.modal.option.layouts || [];
    }

    Container.prototype = Object.create(SuperClass.prototype);
    Container.prototype.constructor = Container;

    +function() {

        this.optionTemplate = {
            group: '基本',
            name: 'I18n.resource.report.REPORT_RIGHT_NAME', //I18n.resource.report.REPORT_RIGHT_NAME
            minWidth: 12,
            minHeight: 6,
            maxWidth: 12,
            maxHeight: 6,
            spanC: 12,
            spanR: 12,
            type: 'Container',
            className: 'chapter-container'
        };

        /** override */
        this.init = function() {
            SuperClass.prototype.init.apply(this, arguments);
            // 初始化 IOC
            this.initIoc();

            this.initDropEvents();
        };

        /** 初始化拖拽事件 */
        this.initDropEvents = function() {
            var _this = this;
            var container = this.wrap;
            // 初始化拖拽添加 modal 的代码
            container.ondragenter = function(e) {
                e.preventDefault();
                e.stopPropagation();
                var tooltip = document.createElement('div');
                tooltip.id = 'divTooltip';
                document.body.appendChild(tooltip);
            };

            container.ondragover = function(e) {
                e.preventDefault();
                e.stopPropagation();
                var $divTooltip = $('#divTooltip');
                if (_this.root.wrap === this) {
                    $divTooltip.html(I18n.resource.report.REPORT);
                } else {
                    $divTooltip.html(I18n.resource.report.optionModal.CHAPTER + _this.chapterNo);
                }
                if (!$(_this.wrap).children().hasClass('borderHover')) {
                    $(_this.wrap).children().addClass('borderHover');
                }
                $divTooltip.css('left', e.clientX - 1.5 * $('.badge').width());
                $divTooltip.css('top', e.clientY - $('#header').height());
            };

            container.ondragleave = function(e) {
                e.preventDefault();
                e.stopPropagation();
                $('#divTooltip').remove();
                if ($(_this.wrap).children().hasClass('borderHover')) {
                    $(_this.wrap).children().removeClass('borderHover');
                }
            };

            container.ondrop = function(e) {
                $('#divTooltip').remove();
                if ($(_this.wrap).children().hasClass('borderHover')) {
                    $(_this.wrap).children().removeClass('borderHover');
                }
                var type = e.dataTransfer.getData('type');
                var parent = e.dataTransfer.getData('parent');
                e.stopPropagation();

                var screen = $(_this.root.wrap); //$('#reportWrap').children('.report-container-wrap');
                var currentY = e.clientY;
                var currentX = e.clientX;
                // 判断是否 drop 在了某个控件上
                // 如果是，则在该控件里面插入新控件
                // 如果不是，则保持插入到鼠标的位置
                var insertIndex = _this.targetDom(screen, currentX, currentY);
                if (type === '') {
                    return;
                }
                // 非模板
                if (type !== 'template') {
                    if (parent !== 'dashboardWidget') {
                        _this.add({
                            modal: {
                                type: type,
                                option: {}
                            }
                        }, insertIndex);
                    } else {
                        _this.add({
                            modal: {
                                type: type,
                            }
                        }, insertIndex);
                    }
                }
                // 模板
                else {
                    Spinner.spin($(_this.root.wrap)[0]);
                    WebAPI.post('/factory/material/getByIds', {
                        ids: [e.dataTransfer.getData('id')]
                    }).done(function(rs) {
                        var data = _this.updateTemplateId(rs[0]);
                        _this.addFromTemplate(data, insertIndex);
                        Spinner.stop();
                    });
                }
            };
        };
        this.targetDom = function($dom, currentX, currentY) {
            if (!$dom || $dom.length === 0) return; //drop 在了某个控件上
            var $domPaddingTop = parseInt($dom.css('padding-top'));
            var $domPaddingBottom = parseInt($dom.css('padding-bottom'));
            var $domPaddingLeft = parseInt($dom.css('padding-left'));
            var $domPaddingRight = parseInt($dom.css('padding-right'));
            var $domY = $dom.offset().top;
            var $domX = $dom.offset().left + $domPaddingLeft;
            var $domPaddingY = $domPaddingTop + $domPaddingBottom;
            var $domPaddingX = $domPaddingLeft + $domPaddingRight;
            if ($domY < currentY) { //竖向递归
                if (($domY + $dom.height() - $domPaddingY) > currentY) {
                    if ($domX < currentX) { //横向递归
                        if (($domX + $dom.width() - $domPaddingX) > currentX) {
                            return this.targetDom($dom.find('.report-content').eq(0).children().eq(0), currentX, currentY);
                        } else {
                            return this.targetDom($dom.next().eq(0), currentX, currentY);
                        }
                    } else {
                        return $dom.index();
                    }
                } else {
                    return this.targetDom($dom.next().eq(0), currentX, currentY);
                }
            } else {
                return $dom.index();
            }
        };
        this.updateTemplateId = (function() {
            function replaceId(templateContent) {
                if (templateContent.id) {
                    templateContent.id = ObjectId();
                }
                var childrenLayout = templateContent.modal.option.layouts;
                if (childrenLayout && childrenLayout.length > 0) {
                    childrenLayout.forEach(function(row) {
                        replaceId(row);
                    })
                }
            }
            return function(data) {
                var templateContent = data.content.layout;
                replaceId(templateContent);
                return templateContent;
            }
        }());
        this.initIoc = function() {
            this.factoryIoC = new FactoryIoC('report');
        };

        /* override */
        this.initResizer = function() {};

        this.initTools = function(tools) {
            tools = tools || ['variable'];
            SuperClass.prototype.initTools.call(this, tools);
        };

        this.add = function(params, idx) {
            var modalClass = this.factoryIoC.getModel(params.modal.type);
            var options = modalClass.prototype.optionTemplate;

            var ins;
            var insertIndex = idx;
            idx = typeof idx === 'undefined' ? this.children.length : idx;

            params.spanC = params.spanC || options.spanC || options.minWidth;
            params.spanR = params.spanR || options.spanR || options.minHeight;
            if (options.group === undefined) { //如果是dashboard的控件
                params.name = 'I18n.resource.' + options.name;
                params.type = 'DashboardWidget';
                params.mode = options.mode;
                modalClass = factory.report.components.DashboardWidget;
            }
            ins = new modalClass(this, params, this.root, insertIndex);

            this.children.splice(idx, 0, ins);
            this.entity.modal.option.layouts.splice(idx, 0, ins.entity);
            if (ins.entity.type === 'DashboardWidget') {
                if (ins.entity.mode === 'noConfigModal'){
                    ins.render(true);
                } else {
                    ins.getClass(true);
                 }
            } else {
                ins.render(true);
            }
            // 如果新增的元素是章节，则更新章节编号和汇总
            if (params.modal.type === 'ChapterContainer') {
                this.refreshTitle(this.chapterNo);
                this.root.refreshSummary();
            }

            return ins;
        };

        // 从模板添加控件
        this.addFromTemplate = function(params, idx) {
            var ins = this.add(params, idx);
            var tplParams = ins.getTplParams();

            if (tplParams.length) {
                ins.showConfigModal(exports.ReportTplParamsConfigModal);
            }
        };

        this.remove = function(id) {
            var idx = -1;
            var removed = null;

            this.children.some(function(row, i) {
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
                this.root.refreshSummary();
                this.entity.modal.option.layouts.splice(idx, 1);
            }

        };

        this.initLayout = function(layouts) {
            layouts = layouts || this.entity.modal.option.layouts;

            if (!layouts || !layouts.length) return;

            try {
                layouts.forEach(function(layout) {
                    var modelClass, ins;
                    var chapterDisplay;
                    var _api;

                    if (!layout.modal.type) { return; }

                    modelClass = this.factoryIoC.getModel(layout.modal.type);
                    if (layout.type === 'DashboardWidget') {
                        modelClass = factory.report.components.DashboardWidget;
                    }
                    if (!modelClass) return;
                    ins = new modelClass(this, layout, this.root);
                    this.children.push(ins);
                    ins.render();

                }.bind(this));
            } catch (e) {
                Log.error(e);
            }
        };

        /** @override */
        this.resize = function() {
            this.container.parentNode.style.height = 'auto';
            this.children.forEach(function(row) {
                row.resize();
            });
        };

        this.refreshTitle = function(chapterNo, isHideNo) {
            // 更新 title
            var containerChildren = [],
                i = 0;

            this.chapterNo = chapterNo = chapterNo || '';

            containerChildren = this.children.filter(function(row) {
                return row instanceof exports.Container;
            });

            chapterNo = chapterNo ? (chapterNo + '.') : chapterNo;
            containerChildren.forEach(function(row) {
                var num;
                if (row.hasChapterNo()) {
                    num = row.refreshTitle(chapterNo + (i + 1), isHideNo);
                } else {
                    num = row.refreshTitle(chapterNo, isHideNo);
                }
                if (num) {
                    i = i + num;
                } else {
                    i = i + 1;
                }
            });
        };

        this.refreshSummary = function() {
            var summary = this.getSummary();
            // 复制一遍数组，不对原数据进行操作
            var list = this.children.concat();
            var row;

            while (row = list.shift()) {
                list = list.concat(row.children || []);
                if (row instanceof exports.Summary) {
                    row.refreshSummary(summary);
                }
            }
        };

        this.getSummary = function() {
            var summary = [];
            for(var i = 0, len = this.children.length; i<len; i++){
                var row = this.children[i];
                if(i==0 && row instanceof exports.Summary && row.entity.modal.option.templateData){
                    summary = summary.concat(row.entity.modal.option.templateData);
                    break;
                }
                if (row instanceof exports.ChapterContainer ||
                    row instanceof exports.Block) {
                    summary = summary.concat(row.getSummary());
                }
            }
            return summary;
        };

        /** @override */
        // 返回值格式： [param1, param2, param3, ...]
        this.getTplParams = function() {
            var params = SuperClass.prototype.getTplParams.call(this);
            var tplParams = this.entity.modal.option.tplParams || {};

            this.children.forEach(function(row) {
                params = params.concat(row.getTplParams());
            });

            // 参数去重
            params = params.sort().filter(function(row, pos, arr) {
                return !pos || row != arr[pos - 1];
            });

            // 参数值的还原
            // 目前只有容器类控件可以进行参数设置，接口的调用最终都会在这里汇合
            // 所以在这里进行一次参数值还原即可
            params = params.map(function(row) {
                return {
                    name: row,
                    value: tplParams[row] || undefined
                };
            });
            return params;
        };
        this.getDeclareVariables = function() {
            this.entity.modal.variables = this.entity.modal.variables || {};
            var v;
            if (this.entity.modal.type.indexOf('Block') > -1) {
                v = [{
                    title: I18n.resource.report.MODULE,
                    val: this.entity.modal.variables
                }];
            } else {
                v = [{
                    title: (I18n.resource.report.optionModal.CHAPTER + this.chapterNo || '') || '' + (this.entity.modal.option.chapterTitle || I18n.resource.report.REPORT),
                    val: this.entity.modal.variables
                }];
            }
            this.children.forEach(function(row) {
                v.push(row.getDeclareVariables() || { title: '', val: {} });
            });
            return v;
        };

        // 用于指示当前容器的孩子节点是否是只读的
        this.isChildrenReadonly = function() {
            if (this === this.root) {
                return false;
            }
            return this.screen.isChildrenReadonly();
        };

        this.destroy = function() {
            this.children.forEach(function(row) {
                row.destroy();
            });
            this.wrap.parentNode.removeChild(this.wrap);
        };

        this.clear = function(){
            this.children.forEach(function(row) {
                row.destroy();
            });
            this.children.length = 0;
        }

    }.call(Container.prototype);

    // 附加特性
    // 给容器类型的控件附加上 “变量处理” 的功能特性
    Container.prototype = Mixin(Container.prototype, new VariableProcessMixin());

    exports.Container = Container;

}(namespace('factory.report.components'),
    namespace('factory.report.components.Base'),
    namespace('factory.report.mixins.VariableProcessMixin')));