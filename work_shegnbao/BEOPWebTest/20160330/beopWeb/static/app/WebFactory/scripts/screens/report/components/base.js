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