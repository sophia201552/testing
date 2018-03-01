;(function (exports) {

    function Component() {

    }

    +function () {

        this.onRenderComplete = function () {
            throw new Error('onRenderComplete 方法需要实现才能使用');
        };

        this.render = function () {
            throw new Error('render 方法需要实现才能使用');
        };

        this.destroy = function () {
            throw new Error('destroy 方法需要实现才能使用');
        };
    }.call(Component.prototype);

    exports.Component = Component;

} ( namespace('factory.report.components') ));

;(function (exports, SuperClass) {

    function Base(parent, entity, root) {
        SuperClass.apply(this, arguments);

        this.screen = parent;
        this.entity = entity;
        this.entity.id = ObjectId();

        this.container = null;
        this.spinner = null;

        this.root = root || this;

        this.init();
    }

    Base.prototype = Object.create(SuperClass.prototype);

    +function () {

        this.UNIT_WIDTH = 100/12;

        this.UNIT_HEIGHT = 60;

        this.TPL_PARAMS_PATTERN = /<#\s*(\w*?)\s*#>/mg;

        this.init = function () {
            var _this = this;
            var divWrap, divParent;

            divWrap = document.createElement('div');
            divWrap.id = 'reportContainer_' + this.entity.id;
            divWrap.className = 'report-container-wrap';
            if (this.optionTemplate.className) {
                divWrap.classList.add(this.optionTemplate.className);
            }

            divParent = document.createElement('div');
            divParent.classList.add('report-container');
            
            divWrap.appendChild(divParent);
            this.screen.container.appendChild(divWrap);

            if (AppConfig.isReportConifgMode) {
                // 初始化头部
                this.initHeader();
                // 初始化工具
                this.initTools();
                // 初始化大小调节器
                this.initResizer();
            }

            this.container = document.createElement('div');
            this.container.className = 'report-content clearfix';
            divParent.appendChild(this.container);

            this.resize();

            return this;
        };

        this.initHeader = function () {
            var divWrap = document.querySelector('#reportContainer_' + this.entity.id);
            var divParent = divWrap.querySelector('.report-container');
            // 添加头部
            var divHeader = document.createElement('div');
            divHeader.className = 'report-header';
            divHeader.innerHTML = this.optionTemplate.name;
            divParent.appendChild(divHeader);

            this.initTitle();
        };

        this.initTools = function (tools) {
            var _this = this;
            var divWrap = this.screen.container.querySelector('#reportContainer_'+this.entity.id);
            var divParent = divWrap.querySelector('.report-container');
            //按钮容器
            var divToolWrap = document.createElement('div');
            divToolWrap.className = 'report-tool-wrap';

            // 配置按钮
            var btn, tool, len;

            tools = tools || ['configure', 'remove'];
            // 复制数组
            tools = tools.concat();
            len = tools.length;

            while ( tool = tools.shift() ) {
                switch (tool) {
                    // 配置按钮
                    case 'configure':
                        btn = document.createElement('a');
                        btn.className = 'report-tool-btn ';
                        btn.title = '配置';
                        btn.href = 'javascript:;';
                        btn.innerHTML = '<span class="glyphicon glyphicon-cog"></span>';
                        divToolWrap.appendChild(btn);
                        btn.onclick = function(e) {
                            _this.showConfigModal();
                        };
                        break;
                    // 删除按钮
                    case 'remove':
                        btn = document.createElement('a');
                        btn.className = 'report-tool-btn ';
                        btn.title = '删除控件';
                        btn.innerHTML = '<span class="glyphicon glyphicon-remove"></span>';
                        divToolWrap.appendChild(btn);
                        btn.onclick = function(e){
                            if (_this.chart) _this.chart.clear();
                            _this.screen.remove(_this.entity.id);
                            $('#reportContainer_' + _this.entity.id).remove();
                        };
                        break;
                    // 模板参数配置按钮
                    case 'tplParamsConfigure':
                        btn = document.createElement('a');
                        btn.className = 'report-tool-btn ';
                        btn.title = '配置模板参数';
                        btn.innerHTML = '<span class="glyphicon glyphicon-list-alt"></span>';
                        divToolWrap.appendChild(btn);
                        btn.onclick = function(e){
                            exports.ReportTplParamsConfigModal.setOptions({
                                modalIns: _this,
                                container: 'reportWrap'
                            });
                            exports.ReportTplParamsConfigModal.show();
                        };
                        break;

                }
            }
            if (len > 0) {
                divParent.appendChild(divToolWrap);
            }
        };

        this.initResizer = function () {
            var _this = this;
            var divWrap = this.screen.container.querySelector('#reportContainer_'+this.entity.id);
            var $divParent = $(divWrap.querySelector('.report-container'));
            var iptResizerCol, iptResizerRow;
            var options = this.optionTemplate;
            this.entity.spanC = this.entity.spanC || options.minWidth;
            this.entity.spanR = this.entity.spanR || options.minHeight;

            // 新增宽高的编辑
            var $resizers = $( '<div class="btn-group number-resizer-wrap">\
                <input type="number" class="btn btn-default number-resizer-col" value="{width}" min="{minWidth}" max="{maxWidth}">\
                <input type="number" class="btn btn-default number-resizer-row" value="{height}" min="{minHeight}" max="{maxHeight}">\
            </div>'.formatEL({
                width: this.entity.spanC,
                height: this.entity.spanR,
                minWidth: options.minWidth,
                minHeight: options.minHeight,
                maxWidth: options.maxWidth,
                maxHeight: options.maxHeight
            }) ).appendTo( $divParent );

            iptResizerCol = $resizers[0].querySelector('.number-resizer-col');
            iptResizerRow = $resizers[0].querySelector('.number-resizer-row');

            iptResizerRow.onchange = function () {
                this.value = Math.max( Math.min(options.maxHeight, this.value), options.minHeight );
                _this.entity.spanR = Math.floor(this.value);
                _this.resize();
            };
            iptResizerCol.onchange = function () {
                this.value = Math.max( Math.min(options.maxWidth, this.value), options.minWidth );
                _this.entity.spanC = Math.floor(this.value);
                _this.resize();
            };
        };

        this.initTitle = function () {};

        this.showConfigModal = function () {
            var type = this.entity.modal.type + 'ConfigModal';
            var domWindows = document.querySelector('#windows');

            exports[type].setOptions({
                modalIns: this,
                container: 'reportWrap'
            });
            exports[type].show().done(function () {
                // 设置位置
                exports[type].$modal.css({
                    top: domWindows.scrollTop + 'px',
                    bottom: -domWindows.scrollTop + 'px'
                });
            });
        };

        this.resize = function () {
            $('#reportContainer_' + this.entity.id).css({
                width: this.entity.spanC * this.UNIT_WIDTH + '%',
                height: this.entity.spanR * this.UNIT_HEIGHT + 'px'
            });
        };

        // 获取模板参数
        this.getTplParams = function () { return []; };

        // 应用模板参数
        this.applyTplParams = function (params) {
            this.entity.modal.option.tplParams = params;
        };

        this.destroy = function () {};

    }.call(Base.prototype);

    exports.Base = Base;

} ( namespace('factory.report.components'),
    namespace('factory.report.components.Component') ));
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

;(function (exports, SuperClass) {

    function Chart() {
        SuperClass.apply(this, arguments);

        this.store = null;
    }

    Chart.prototype = Object.create(SuperClass.prototype);

    +function () {

        var DEFAULT_CHART_OPTIONS = {
                title : {
                    text: '',
                    subtext: '',
                    x:'center'
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    orient: 'horizontal',
                    x: 'center',
                    y: 'top',
                    data: []
                },
                grid: {
                    y: 50,
                    x2: 30,
                    y2: 25
                },
                toolbox: {
                    show: false
                },
                color: ['#e84c3d', '#1abc9c', '#B5C334', '#FCCE10', '#E87C25', '#27727B',
                        '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
                        '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'],
                xAxis: [{
                    type: 'category',
                    axisTick: {
                        show: false
                    }
                }],
                yAxis: [{
                    type: 'value'
                }]
            };

        /** @override */
        this.optionTemplate = Mixin(this.optionTemplate, {
            group: '基本',
            name: '图表',
            minWidth: 3,
            minHeight: 2,
            maxWidth: 12,
            maxHeight: 15,
            type: 'Chart'
        });

        /** @override */
        this.resize = function () {
            SuperClass.prototype.resize.call(this);
            if (this.chart) {
                this.__renderChart();
            }
        };

        this.__renderChart = function () {
            var options = this.entity.modal.option;
            var series = [];
            var rs = this.store;
            var chartOptions = this.__getChartOptions();

            rs.list.forEach(function (row) {
                series.push({
                    type: options.chartType,
                    data: row.data
                });
            });
            // 默认显示昨天24小时的数据
            if (this.chart) {
                this.chart.dispose();
            }

            // 加上数据
            chartOptions['xAxis'][0].data = rs.timeShaft;
            chartOptions['series'] = series;

            this.chart = echarts.init(this.container);
            this.chart.setOption( chartOptions );
        };

        this.__getChartOptions = function () {
            var options = DEFAULT_CHART_OPTIONS;
            var userOptions = new Function ('return ' + this.entity.modal.option.chartOptions)();

            return $.extend(true, options, userOptions);
        };

        /** @override */
        this.getTplParams = function () {
            var str = (this.entity.modal.points || []).join(',');
            var pattern = this.TPL_PARAMS_PATTERN;
            var match = null;
            var params = [];

            while( match = pattern.exec(str) ) {
                params.push(match[1]);
            }

            return params;
        };

        /** @override */
        this.render = function () {
            var options = this.entity.modal.option;

            if (!this.entity.modal.points || !this.entity.modal.points.length) {
                return;
            }
            WebAPI.post('/analysis/startWorkspaceDataGenHistogram', {
                dsItemIds: this.__getTplParamsAttachedPoints(),
                timeStart: '2016-03-10 00:00:00',
                timeEnd: '2016-03-11 00:00:00',
                timeFormat: options.timeFormat
            }).done(function (rs) {
                this.store = rs;
                this.__renderChart();
            }.bind(this));
        };

        // 获取替换模板参数后的 points
        this.__getTplParamsAttachedPoints = function () {
            var _this = this;
            var points = this.entity.modal.points;
            var pattern = this.TPL_PARAMS_PATTERN;

            if (!this.entity.modal.option.tplParams || points.length <= 0) {
                return points;
            } else {
                return points.join(',').replace(pattern, function ($0, $1) {
                    return _this.tplParams[$1] || '';
                }).split(',');
            }
        };

    }.call(Chart.prototype);

    exports.Chart = Chart;

} ( namespace('factory.report.components'), namespace('factory.report.components.Base') ));
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
            this.windowCtn.className = 'report-wrap gray-scollbar';

            this.container = this.windowCtn.querySelector('#reportWrap');
            this.$container = $(this.container);
            this.container.classList.remove('report');
            this.container.classList.add('report-ob');
        };

        this.initWorkerForUpdating = function () {};

        this.initModuleLayout = function () {
            var Clazz = namespace('factory.report.components.Container');
            this.reportEntity = new Clazz(this, {
                spanC: 12,
                spanR: 6,
                modal: {
                    option: {
                        layouts: this.store.layout[0]
                    }
                },
                type: 'Container'
            });

            this.reportEntity.render();
            this.reportEntity.refreshTitle();
        };

    }.call(FacReportScreen.prototype);

    exports.FacReportScreen = FacReportScreen;
} ( namespace('observer.screens'), namespace('observer.screens.EnergyScreen') ));
