;(function (exports, Super) {

    function ReportModulePanel(screen) {
        Super.apply(this, arguments);
    }

    ReportModulePanel.prototype = Object.create(Super.prototype);

    +function () {

        this.tpl = '<div id="modalCt" class="panel-body"></div>';

        this.attachEvents = function () {};

        this.detachEvents = function () {};

        this.initModuleList = (function () {

            function getModuleList(title, group) {
                var _this = this;
                var $ul = $('<ul class="nav nav-list accordion-group">');
                var $liList = $('<li class="rows">').appendTo($ul);

                // 添加组标题
                var $liHd = $('<li class="nav-header">'+title+'</li>');/*I18n.findContent(title)*/
                $ul.prepend($liHd);

                group.forEach(function (row) {
                    var $div = $('<div class="lyrow">'+row.name+'<span draggable="true" class="badge">拖拽</span></div>').attr('data-type', row.type);
                    $div.on('dragstart', function (e) {
                        e.originalEvent.dataTransfer.setData("type", this.dataset.type);
                        e.stopPropagation();
                    });
                    $liList.append($div);
                });
                return $ul;
            }

            return function () {
                var list, groupMap = {};
                var list = this.screen.factoryIoC.getList();

                var $modals = $(this.tpl);

                for (var i = 0, len = list.length, option; i < len; i++) {
                    option = list[i].prototype.optionTemplate;
                    if(option && option.group != null) {
                        groupMap[option.group] = groupMap[option.group] || [];
                        groupMap[option.group].push(option);
                    }
                }

                for (var name in groupMap) {
                    if (groupMap.hasOwnProperty(name)) {
                        $modals.append( getModuleList.call(this, name, groupMap[name]) );
                    }
                }

                $(this.container).append($modals);
            };
        } ());

    }.call(ReportModulePanel.prototype);

    exports.ReportModulePanel = ReportModulePanel;

} ( namespace('factory.panels'), ModulePanel ));
;(function (exports) {

    function ReportTplPanel(screen) {
        this.close();

        this.screen = screen;
        this.container = screen.reportTplPanelCtn;
    }

    +function () {
        
        this.show = function () {
            // 获取模板数据
            this.__loadData().done(function (rs) {
                this.attachEvents();
            }.bind(this));
        };

        this.init = function () {
            var _this = this;
            var arrHtml;

            this.domGroupWrap = document.createElement('div');
            this.domGroupWrap.className = 'report-tpl-wrap';
            // this.domGroupWrap
            
            arrHtml = this.store.map(function (row) {
                return '<div class="report-tpl-item" data-id="'+row._id+'" draggable="true">'+row.name+'</div>';
            });

            this.domGroupWrap.innerHTML = arrHtml.join('');
            this.container.appendChild(this.domGroupWrap);
        };

        this.attachEvents = function () {
            var _this = this;

            $('.report-tpl-item', this.domGroupWrap).off().on('dragstart', function (e) {
                var template = _this.__findItemById(this.dataset.id);
                var dataTransfer = e.originalEvent.dataTransfer;

                dataTransfer.setData('layouts', JSON.stringify(template.content.layouts));
                dataTransfer.setData('type', 'template');
            });
        };

        this.__findItemById = function (id) {
            var rs = null;

            this.store.some(function (row) {
                if (row._id === id) {
                    rs = row;
                    return true;
                }
                return false;
            });

            return rs;
        };

        this.__loadData = function () {
            return WebAPI.get('/factory/material/get/report').then(function (rs) {
                this.store = rs;
                this.init();
            }.bind(this));
        };

        this.reload = function () {
            return this.__loadData();
        };

        this.close = function () {
            this.screen = null;
            this.store = null;
            this.domGroupWrap = null;
            this.container = null;
        };

    }.call(ReportTplPanel.prototype);

    exports.ReportTplPanel = ReportTplPanel;

} ( namespace('factory.panels') ));
;(function (exports) {

    var paramType = {
        TEXT: {
            value: 0,
            name: '文本'
        }
    };

    function ReportTplParamsPanel(screen, container) {
        this.screen = screen;
        this.container = container;
        this.$container = $(this.container);

        this.map = {};
    }

    +function () {

        this.show = function () {
            this.init();
        };

        this.init = function () {
            // 初始化表格
            var tableTpl = '<table class="table table-bordered">\
                <thead>\
                    <tr>\
                        <th>参数名称</th>\
                        <th>类型</th>\
                        <th>值</th>\
                    </tr>\
                </thead>\
                <tbody><tr><td colspan="3">无参数</td></tr></tbody>\
                </table>';

            // 初始化按钮
            var btnsTpl = '<div class="tpl-params-btn-wrap">\
                <a href="javascript:;" id="lkRefreshTplParams"><span class="badge">刷新</span></a>\
                <a href="javascript:;" id="lkApplyTplParams"><span class="badge">应用</span></a>\
            </div>';

            this.container.innerHTML = btnsTpl + tableTpl;

            this.$table = this.$container.children('.table');

            this.attachEvents();
        };

        this.render = (function () {

            function getSelectTpl(type) {
                return '<select>' +
                    Object.keys(paramType).map(function (key) {
                        if (type === paramType[key].value) {
                            return '<option value="{value}" selected>{name}</option>'.formatEL(paramType[key]);
                        } else {
                            return '<option value="{value}">{name}</option>'.formatEL(paramType[key]);
                        }
                    }) + '</select>';
            }

            function getRowTpl(type) {
                return '<tr>\
                        <td>{name}</td>\
                        <td>' + getSelectTpl(type) + '</td>\
                        <td>{value}<button type="button" class="btn btn-default" data-toggle="popover">察看</button></td>\
                    </tr>'
            }

            return function () {
                var _this = this;
                
                var items = Object.keys(this.map).map(function (p) {
                    var row = _this.map[p];

                    return getRowTpl(row.type).formatEL({
                        name: p,
                        value: _this.__getValueTpl(p, row.type, row.value)
                    });
                });

                if (items.length) {
                    $('tbody', this.$table).html(items);
                } else {
                    $('tbody', this.$table).html('<tr><td colspan="3">无参数</td></tr>');
                }
            }

        } ());

        this.attachEvents = function () {
            var _this = this;

            $('#lkRefreshTplParams', this.$container).on('click', function () {
                this.refresh();
            }.bind(this));
            
            $('#lkApplyTplParams', this.$container).on('click', function () {
                this.apply();
            }.bind(this));

            this.$table.on('blur', 'input', function (e) {
                var data = $(this).serializeArray()[0];
                var p = {};
                p[data.name] = data.value;
                
                _this.__setMap(p);
                e.stopPropagation();
            });
            
            // this.$table.on('click', 'button', function (e) {
            //     var value=$(this).prev('input').val();
            //     var $this = $(this);
            //     var options = {
            //         container: 'body',
            //         html:true,
            //         placement:'top'
            //     };
            //     $this.popover(options);
            //     $this.data('bs.popover').options.content = (value || '')+'<button>确定</button>';
            //     e.stopPropagation();
            // });
        };

        this.__setMap = function (params) {
            var _this = this;
            Object.keys(params).forEach(function (key) {
                _this.map[key].value = params[key];
            });
        };

        this.__getValueTpl = function (name, type, value) {
            return '<input type="text" placeholder="请填写值" name="'+name+'" value="'+(value || '')+'" />';
        };

        this.refresh = function () {
            var _this = this;
            var params = this.screen.getTplParams();
            var map = {};

            params.forEach(function (row) {
                if ( _this.map.hasOwnProperty(row) ) {
                    map[row] = _this.map[row];
                } else {
                    map[row] = {
                        type: paramType.TEXT.value,
                        value: ''
                    };
                }
                
            });

            // 更新参数表
            this.map = map;
            // 更新视图
            this.render();
        };

        this.__getTplParams = function () {
            var _this = this;
            var params = {};

            Object.keys(this.map).forEach(function (key) {
                params[key] = _this.map[key].value;
            });

            return params;
        };

        this.apply = function () {
            var params = this.__getTplParams();
            
            this.screen.applyTplParams(params);
        };

        this.close = function () {
            if (this.$container) {
                this.$container.empty();
            }
            this.screen = null;
            this.container = null;
            this.$container = null;

            this.map = null;

            this.$table = null;
            this.$form = null;
        };

    }.call(ReportTplParamsPanel.prototype);

    exports.ReportTplParamsPanel = ReportTplParamsPanel;

} ( namespace('factory.panels') ));
;(function (exports) {

	function ReportConfigPanel(screen) {
		this.screen = screen;
		this.container = screen.reportConfigPanelCtn;

		this.str = undefined;
		//报表列表的数据
		this.reportListDatas = this.screen.screen.pagePanel.getPagesData().serialize();
		//包裹的form
		this.wrapForm=$('<form>');
		//周期
		this.period='<select name="sel_period"><option value="day">日</option><option value="week">周</option><option value="month">月</option><option value="year">年</option></select>';

	}

	ReportConfigPanel.prototype = {
		show: function () {
			this.wrapForm.appendTo( $(this.container) );

			this.init();

			$(this.getSelectAll()).appendTo(this.wrapForm);

			this.attachEvents();
		},

		init: function () {
		},
		//拿到所有的report的text值
		getSelectAll : function () {
			return '<div class="reportListWrap"><select name="sel_report"><option value="">请选择</option>'+
						(function (data){
							for(var i = 0; i<data.length; i++){
								if(data[i].type == 'FacReportScreen'){
									this.str += '<option value="' + data[i]._id + '">'+data[i].text+'</option>';
								}else{
									this.str += '';
								}
							}
							return this.str;
						})(this.reportListDatas)
					+'</select>'+this.period+'<button class="addReportListBtn" onclick ="return false;"> + </button></div>';
		},
		attachEvents: function () {
			var _this=this;
			//点击加号
			$(this.wrapForm).on('click','.addReportListBtn',function(){

				var btnArr = $(".addReportListBtn");
				var index = btnArr.index($(this));

				// console.log($(this).prevAll().find('select[name="sel_report"] option:selected'))
				// alert($(this).prevAll().find('select[name="sel_report"]').text())
				//TO DO
				// if(.text()!="请选择"){

					$(_this.getSelectAll()).appendTo(_this.wrapForm);
					btnArr.eq(index).attr("class","delReportListBtn").text("-");

				// }
			});
			//点击减号
			$(this.wrapForm).on('click','.delReportListBtn',function(){

				$(this).parent("div").remove();
			});
		},
		close : function () {
		}
	};

	exports.ReportConfigPanel = ReportConfigPanel;

} ( namespace('factory.panels') ));
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

    function Modal() {
        SuperClass.apply(this, arguments);
    }

    Modal.prototype = Object.create(SuperClass.prototype);

    +function () {
        this.DEFAULTS = {
            htmlUrl: '/static/app/WebFactory/scripts/screens/report/components/chapterContainer/chapterContainerConfigModal.html'
        };

        this.init = function () {
            this.$modal           = $('.modal', this.$wrap);
            this.$form            = $('#formModal', this.$wrap);
            this.$iptChapterTitle = $('#iptChapterTitle', this.$wrap);
            this.$textareaChapterSummary = $('#textareaChapterSummary', this.$wrap);
            // drop area
            this.$btnSubmit       = $('#btnSubmit', this.$wrap);
            
            this.attachEvents();
        };

        // @override
        this.recoverForm = function(options) {
            var _this = this;
            var form = options.option;
            if (!form) return;

            this._setField('input', this.$iptChapterTitle, form.chapterTitle);
            this._setField('textarea', this.$textareaChapterSummary, form.chapterSummary);
        };

        // @override
        this.reset = function () {
            var _this = this;
            this._setField('input', this.$iptChapterTitle);
            this._setField('textarea', this.$textareaChapterSummary);
        };

        this.attachEvents = function () {
            var _this = this;

            this.$btnSubmit.off().click(function (e) {
                var modalIns = _this.options.modalIns;
                var modal = modalIns.entity.modal;
                var form = {};

                form.chapterTitle = this.$iptChapterTitle.val();
                form.chapterSummary = this.$textareaChapterSummary.val();
                modal.option = $.extend(false, modal.option, form);

                _this.$modal.modal('hide');
                modalIns.refreshTitle();

                e.preventDefault();
            }.bind(this));
        };

    }.call(Modal.prototype);

    exports.ChapterContainerConfigModal = new Modal();

} ( namespace('factory.report.components'), ModalConfig ));
/*---------------------------------------------
 * ReportTplParamsConfigModal 图元配置类定义
 ---------------------------------------------*/
(function(exports, ReportTplParamsPanel) {
    var _this;

    // 存储当前页面所有可链接的menu的html
    var gMenusHtml;

    function ReportTplParamsConfigModal(options) {
        _this = this;

        ModalConfig.call(this, options);

        this.reportTplParamsPanel = null;
    }

    ReportTplParamsConfigModal.prototype = Object.create(ModalConfig.prototype);
    ReportTplParamsConfigModal.prototype.constructor = ReportTplParamsConfigModal;

    ReportTplParamsConfigModal.prototype.DEFAULTS = {
        htmlUrl: '/static/app/WebFactory/scripts/screens/report/components/chapterContainer/ReportTplParamsConfigModal.html'
    };

    // @override
    ReportTplParamsConfigModal.prototype.init = function() {
        this.$modal     = $('.modal', this.$wrap);
        this.$modalBody = $('.modal-body', this.$wrap);
        this.$btnSubmit = $('.btn-submit', this.$wrap);

        this.attachEvents();
    };

    ReportTplParamsConfigModal.prototype.recoverForm = function () {};

    ReportTplParamsConfigModal.prototype.reset = function () {};

    ReportTplParamsConfigModal.prototype.attachEvents = function () {
        var _this = this;

        //////////////////
        // modal EVENTS //
        //////////////////
        this.$modal.on('show.bs.modal', function () {
            if (_this.reportTplParamsPanel) {
                _this.reportTplParamsPanel.close();
            }
            _this.reportTplParamsPanel = new ReportTplParamsPanel(_this.options.modalIns, _this.$modalBody[0]);
            _this.reportTplParamsPanel.show();
            _this.reportTplParamsPanel.refresh();
        });

        ///////////////////
        // submit EVENTS //
        ///////////////////
        this.$btnSubmit.off().click( function(e) {
            // close modal
            _this.$modal.modal('hide');
            _this.reportTplParamsPanel.apply();
            _this.options.modalIns.render();
            e.preventDefault();
        } );

    };

    exports.ReportTplParamsConfigModal = new ReportTplParamsConfigModal();
} ( namespace('factory.report.components'), 
    namespace('factory.panels.ReportTplParamsPanel') ));

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

    function Modal() {
        SuperClass.apply(this, arguments);
    }

    Modal.prototype = Object.create(SuperClass.prototype);

    +function () {
        var DEFAULT_CHART_OPTIONS = '{\r\n\r\n}';
        
        this.DEFAULTS = {
            htmlUrl: '/static/app/WebFactory/scripts/screens/report/components/chart/chartConfigModal.html'
        };

        this.init = function () {
            this.$modal           = $('.modal', this.$wrap);
            this.$modalCt         = $('.modal-content', this.$wrap);
            this.$formWrap        = $('.form-wrap', this.$wrap);
            this.$iptChartOptions = $('#iptChartOptions', this.$wrap);
            this.$btnChartType    = $('#btnChartType', this.$wrap);
            this.$btnTimeFormat   = $('#btnTimeFormat', this.$wrap);
            this.$btnTimePeriod   = $('#btnTimePeriod',this.$wrap);
            // drop area
            this.$btnSubmit       = $('#btnSubmit', this.$wrap);
            
            this.attachEvents();
        };

        // @override
        this.recoverForm = function(options) {
            var _this = this;
            var form = options.option;
            if (!form) {
                _this.reset();
            } else {
                this._setField('input', this.$iptChartOptions, form.chartOptions);
                this._setField('dropdown', this.$btnTimePeriod, form.timePeriod);
                this._setField('dropdown', this.$btnChartType, form.chartType);
                this._setField('dropdown', this.$btnTimeFormat, form.timeFormat);
            }

            if(options.points) {
                $(options.points).each(function(i, row){
                    if (options.points[i]) {
                        _this._setField('droparea', $($('.drop-area')[i]), options.points[i]);
                        if($('.drop-area', this.$wrap).closest('.col-md-9').children('.noData').length === 0){
                            $('.drop-area', this.$wrap).closest('.col-md-9').append('<div class="col-md-6 noData drop-area-wrap" style="position: relative;padding:0 15px 10px 0;"><div class="drop-area">' +
                            '<span class="glyphicon glyphicon-plus"></span><input value="" type="text" style="display:none;"></div><span class="glyphicon glyphicon-remove spanDataDel"></span></div>'
                            )
                        }
                        $('.drop-area', this.$wrap).next('.spanDataDel').on('click',function(){
                            $(this).closest('.col-md-6').remove();
                        })
                    }
                });
            }
        };

        // @override
        this.reset = function () {
            var _this = this;
            this._setField('input', this.$iptChartOptions);
            this._setField('dropdown', this.$btnChartType);
            this._setField('dropdown', this.$btnTimeFormat);
            this._setField('dropdown', this.$btnTimePeriod);
            $('.divDataSource',this.$wrap).empty().append('<div class="col-md-6 noData drop-area-wrap" style="position: relative;padding:0 15px 10px 0;"><div class="drop-area">' +
                '<span class="glyphicon glyphicon-plus"></span><input value="" type="text" style="display:none;"></div><span class="glyphicon glyphicon-remove spanDataDel"></span></div>'
            )
        };

        this.attachEvents = function () {
            var _this = this;
            var $divDataSource = $('.divDataSource', this.$wrap);
            var $btnChartConfig = $('#btnChartConfig', this.$wrap);

            // 配置按钮事件
            $btnChartConfig.off().on('click', function () {
                var modelIns = _this.options.modalIns;
                var opt =  _this.$iptChartOptions.val() || DEFAULT_CHART_OPTIONS;

                CodeEditorModal.show({
                    js: opt
                }, function (code) {
                    var options = code.js || '';
                    try {
                        // 检测 js 对象的合法性
                        new Function('return ' + options)();
                    } catch (e) {
                        alert('图表配置中含有错误，将不会被保存！');
                    }

                    _this.$iptChartOptions.val(options);
                }, ['js']);
            });

            // 加号的拖拽区域的事件处理
            $divDataSource.on('click', '.noData',function(){
                var $this = $(this);
                $this.find('.glyphicon-plus').hide();
                $this.find('input').show();
                $this.find('input').focus();
            }).on('blur', 'div input',function(){
                var $this = $(this);
                if($this.val() === '' && $this.closest('.col-md-6').hasClass('noData')){
                    $this.hide();
                    $this.prev().show();
                }
                if($this.val() === '' && !$this.closest('.col-md-6').hasClass('noData')){
                    $this.closest('.col-md-6').remove();
                }
            }).on('change', 'div input',function(){
                var $this = $(this);
                if ($this.val() && $this.closest('.col-md-6').hasClass('noData')) {
                    $this.closest('.noData').removeClass('noData');
                    $this.parent().attr({'data-value':$this.val(),'title':$this.val()});
                    $this.closest('.col-md-9').append('<div class="col-md-6 noData drop-area-wrap" style="position: relative;padding:0 15px 10px 0;"><div class="drop-area">' +
                        '<span class="glyphicon glyphicon-plus"></span><input value="" type="text" style="display:none;"></div><span class="glyphicon glyphicon-remove spanDataDel"></span></div>'
                    )
                } else if (!$this.closest('.col-md-6').hasClass('noData')){
                    $this.parent().attr({'data-value':$this.val(),'title':$this.val()});
                } else {
                    $this.hide();
                    $this.prev().show();
                }
            }).on('click', 'div .spanDataDel',function(){
                $(this).closest('.col-md-6').remove();
            });

            // 提交按钮事件
            this.$btnSubmit.off().click(function (e) {
                var modalIns = _this.options.modalIns;
                var modal = modalIns.entity.modal;
                var form = {};
                var chartOptions;

                // 判断 JSON 格式是否正确
                chartOptions = (function (options) {
                    try {
                        new Function('return ' + options)();
                    } catch (e) {
                        return '';
                    }
                    return options;
                } ( this.$iptChartOptions.val().trim() ) );
                // 如果不正确，则不存储
                if (chartOptions) {
                    form.chartOptions = chartOptions;
                };

                form.chartType = this.$btnChartType.attr('data-value');
                form.timeFormat = this.$btnTimeFormat.attr('data-value');
                form.timePeriod = this.$btnTimePeriod.attr('data-value');
                modal.points = Array.prototype.map.call($('.drop-area', this.$wrap), function (row) {
                    return row.dataset.value;
                });
                modal.option = $.extend(false, modal.option, form);

                _this.$modal.modal('hide');
                modalIns.render();

                e.preventDefault();

            }.bind(this));
        };

    }.call(Modal.prototype);

    exports.ChartConfigModal = new Modal();

} ( namespace('factory.report.components'), ModalConfig ));
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
/*--------------------------------
 * ModalHtml 图元配置类定义
 --------------------------------*/
(function(exports) {
    var _this;

    // 存储当前页面所有可链接的menu的html
    var gMenusHtml;

    function HtmlConfigModal(options) {
        _this = this;

        ModalConfig.call(this, options);

        this.cmHtml = null;
    }

    HtmlConfigModal.prototype = Object.create(ModalConfig.prototype);
    HtmlConfigModal.prototype.constructor = HtmlConfigModal;

    HtmlConfigModal.prototype.DEFAULTS = {
        htmlUrl: '/static/app/WebFactory/scripts/screens/report/components/html/HtmlConfigModal.html'
    };

    // @override
    HtmlConfigModal.prototype.init = function() {
        this.$modal          = $('.modal', this.$wrap);
        this.$modalCt        = $('.modal-content', this.$wrap);
        this.$formWrap       = $('.form-wrap', this.$wrap);
        this.$textarea       = $('.form-textarea', this.$formWrap);
        this.$btnSubmit      = $('.btn-submit', this.$wrap);
        
        this.$btnResizeFull  = $('.btn-resize-full', this.$wrap);
        this.$btnResizeSmall = $('.btn-resize-small', this.$wrap);

        // this.initEditor();
        this.attachEvents();
    };

    HtmlConfigModal.prototype.initEditor = function (data) {
        var options = {
            lineNumbers: true,
            extraKeys: {
                Tab: function(cm) {
                    if (cm.getSelection().length) {
                        CodeMirror.commands.indentMore(cm);
                    } else {
                        cm.replaceSelection("  ");
                    }
                }
            }
        }
        // Editor 初始化
        if (!this.cmHtml) {
            this.cmHtml = CodeMirror.fromTextArea(this.$textarea[0], $.extend(false, options, {
                mode: 'text/html'
            }));
        }
    };

    // @override
    HtmlConfigModal.prototype.recoverForm = function(form) {
        var options;
        if(!form || !form.option) {
            return;
        }
        options = form.option;

        // 设置 html 文本
        // if (this.cmHtml) {
        //     this.cmHtml.doc.setValue(options.html);
        // }
        this._setField('textarea', this.$textarea, options.html);
    };

    // @override
    HtmlConfigModal.prototype.reset = function () {
        // if (this.cmHtml) {
        //     this.cmHtml.doc.setValue('');
        // }
        this._setField('textarea', this.$textarea);
    };

    HtmlConfigModal.prototype.attachEvents = function () {
        var _this = this;

        ///////////////////
        // resize EVENTS //
        ///////////////////
        this.$btnResizeFull.off().click(function() {
            var height = _this.$modal.height();
            _this.$modal.addClass('maxium-screen');
            _this.$textarea.height(height-168);
        });

        this.$btnResizeSmall.off().click(function() {
            _this.$modal.removeClass('maxium-screen');
            _this.$textarea.height('auto');
        });

        ///////////////////
        // submit EVENTS //
        ///////////////////
        this.$btnSubmit.off().click( function(e) {
            var modalIns = _this.options.modalIns;
            var modal = modalIns.entity.modal;
            var form = {};
            var html;
            var pattern, match;

            html = form.html = _this.$textarea.val();

            // 初始化 points
            modal.points = [];

            // 以上是老版本的数据源提取逻辑，下面是新版本的数据源提取逻辑
            // 为 <%数据源id%> 的形式添加数据源提取逻辑
            pattern = new RegExp('<%([^,<>%]+).*?%>', 'mg');
            while ( (match = pattern.exec(html)) !== null ) {
                if (modal.points.indexOf(match[1]) === -1) {
                    modal.points.push(match[1]);
                }
            }

            // save to modal
            modal.option = form;
            modal.dsChartCog = [{accuracy: 2}];
            modal.interval = 60000;

            // close modal
            _this.$modal.modal('hide');
            // render the modal
            modalIns.render();
            e.preventDefault();
        } );

        this.$textarea[0].addEventListener("dragover", function(event) {
            event.preventDefault();
        });
        this.$textarea[0].addEventListener("drop", function(event) {
            event.preventDefault();
            var text = '<%' + EventAdapter.getData().dsItemId + '%>';
            insertText(event.target, text);
            _this.$wrap.find('.drop-area[data-value=""]').trigger('drop', true);
        });

        //在光标位置插入拖入的数据源
        function insertText(obj,str) {
            if (typeof obj.selectionStart === 'number' && typeof obj.selectionEnd === 'number') {
                var startPos = obj.selectionStart,
                    endPos = obj.selectionEnd,
                    cursorPos = startPos,
                    tmpStr = obj.value;
                obj.value = tmpStr.substring(0, startPos) + str + tmpStr.substring(endPos, tmpStr.length);
                cursorPos += str.length;
                obj.selectionStart = obj.selectionEnd = cursorPos;
            } else {
                obj.value += str;
            }
        }

    };

    exports.HtmlConfigModal = new HtmlConfigModal();
} ( namespace('factory.report.components') ));

;(function (exports, SuperClass) {

    function Summary() {
         SuperClass.apply(this, arguments);

        this.chapterNo = null;
    }

    Summary.prototype = Object.create(SuperClass.prototype);

    +function () {

        this.optionTemplate = Mixin(this.optionTemplate, {
            name: '汇总',
            type: 'Summary',
            spanC: 12,
            spanR: 4
        });

        this.initTools = function (tools) {
            tools = tools ||  ['remove'];
            SuperClass.prototype.initTools.call(this, tools);
        };

        this.refreshSummary = (function(){
            if (AppConfig.isReportConifgMode){
                return function(chapterNo){
                    
                }
            }
        }())

    }.call(Summary.prototype);

    exports.Summary = Summary;

} ( namespace('factory.report.components'),
    namespace('factory.report.components.Container') ));

;(function (exports, SuperClass, ReportModulePanel, ReportTplPanel) {
    var _this;

    function FacReportScreen() {
        SuperClass.apply(this, arguments);
        _this = this;
        this.layout.reportTplPanel = null;
        this.reportTplPanel = null;
    }

    FacReportScreen.prototype = Object.create(SuperClass.prototype);

    +function () {

        this.htmlUrl = '/static/app/WebFactory/views/reportScreen.html';

        this.initIoc = function() {
            this.factoryIoC = new FactoryIoC('report');
        };

        this.initPanels = function () {
            SuperClass.prototype.initPanels.call(this);

            this.initReportTplPanel();
        };

        /* override */
        this.initLayoutDOM = function (html) {
            var divMain, stCt;
            // 创建数据源面板容器
            this.dataSourcePanelCtn = document.createElement('div');
            this.dataSourcePanelCtn.id = 'dataSourcePanel';
            this.dataSourcePanelCtn.setAttribute('caption', I18n.resource.dataSource.TITLE);
            this.dataSourcePanelCtn.dataset.type = 'DataSourcePanel';

            // 图元面板容器
            this.modulePanelCtn = document.createElement('div');
            this.modulePanelCtn.id = '';
            this.modulePanelCtn.setAttribute('caption', I18n.resource.toolBox.TITLE);
            this.modulePanelCtn.dataset.type = 'ModulePanel';

            // 素材面板容器面板容器
            this.reportTplPanelCtn = document.createElement('div');
            this.reportTplPanelCtn.id = '';
            this.reportTplPanelCtn.setAttribute('caption', '报表模板');
            this.reportTplPanelCtn.dataset.type = 'ReportTplPanelCtn';

            // 中间内容区域面板容器
            this.windowCtn = document.createElement('div');
            this.windowCtn.id = 'windows';
            this.windowCtn.className = 'gray-scrollbar report-wrap';
            // 初始化中间区域的内部 DOM
            this.windowCtn.innerHTML = html;

            this.container = this.windowCtn.querySelector('#reportWrap');
            this.$container = $(this.container);
        };

        /* @override */
        this.initLayout = function () {
            var dockManager = this.factoryScreen.layout.dockManager;
            var nodes = SuperClass.prototype.initLayout.apply(this, arguments);

            this.layout.reportTplPanel = new dockspawn.PanelContainer(this.reportTplPanelCtn, dockManager);
            dockManager.dockFill(nodes.moduleNode, this.layout.reportTplPanel);
        };

        /* @override */
        this.getDataSign = function () {
            // 序列化字符串，用于记录当前数据的状态
            return JSON.stringify(this.reportEntity.entity.modal.option.layouts);
        };

        /* @override */
        this.initConfigModal = function () {};

        /* @override */
        this.initModulePanel = function () {
            if(this.modulePanel) {
                this.modulePanel.close();
                this.modulePanel = null;
            }
            if( $(this.modulePanelCtn).is(':visible') ) {
                this.modulePanel = new ReportModulePanel(this);
                this.modulePanel.show();
            }
            this.modulePanelCtn.removeEventListener('dock.tabPage.changed', this.onTabPageChanged);
            this.modulePanelCtn.addEventListener('dock.tabPage.changed', this.onTabPageChanged, false);
        };  

        /** 初始化报表素材面板 */
        this.initReportTplPanel = function () {
            if(this.reportTplPanel) {
                this.reportTplPanel.close();
                this.reportTplPanel = null;
            }
            if( $(this.reportTplPanelCtn).is(':visible') ) {
                this.reportTplPanel = new ReportTplPanel(this);
                this.reportTplPanel.show();
            }
            this.reportTplPanelCtn.removeEventListener('dock.tabPage.changed', this.onTabPageChanged);
            this.reportTplPanelCtn.addEventListener('dock.tabPage.changed', this.onTabPageChanged, false);
        };

        /* @override */
        this.initModuleLayout = function () {
            var Clazz = namespace('factory.report.components.Container');
            window.reportEntity = this.reportEntity = new Clazz(this, {
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

        /* @override */        
        this.onTabPageChanged = function (e) {
            var isShow = e.detail;
            var type = e.currentTarget.dataset.type;

            switch(type) {
                case 'DataSourcePanel':
                    if(isShow) {
                        if(_this.dataSourcePanel === null) {
                            _this.dataSourcePanel = new DataSourcePanel(_this);
                        }
                        _this.dataSourcePanel.show();
                    } else {
                        _this.dataSourcePanel.hide();
                    }
                    break;
                case 'ModulePanel':
                    if(isShow) {
                        if(_this.modulePanel === null) {
                            _this.modulePanel = new ReportModulePanel(_this);
                        }
                        _this.modulePanel.show();
                    } else {
                        _this.modulePanel.hide();
                    }
                    break;
                case 'ReportTplPanel':
                    if(isShow) {
                        if(_this.reportTplPanel === null) {
                            _this.reportTplPanel = new ReportTplPanel(_this);
                        }
                        _this.reportTplPanel.show();
                    } else {
                        _this.reportTplPanel.hide();
                    }
                    break;
                case 'ReportTplParamsPanel':
                    if(isShow) {
                        if(_this.reporTplParamsPanel === null) {
                            _this.reporTplParamsPanel = new ReportTplPanel(_this);
                        }
                        _this.reporTplParamsPanel.show();
                    } else {
                        _this.reporTplParamsPanel.hide();
                    }
                    break;
            }
        };

        /* @override */
        this.saveLayout = function () {
            var _this = this;
            var layouts = this.reportEntity.entity.modal.option.layouts;

            var data = {
                creatorId: AppConfig.userId,
                menuItemId: this.page.id,
                isFactory: AppConfig.isFactory,
                layout: [layouts]
            };
            this.store.id && (data.id = this.store.id);

            WebAPI.post('/spring/saveLayout', data).done(function (result) {
                // 更新 storeSerializedStr, 标识存储的数据被更改
                _this.dataSign = _this.getDataSign();
            });
        };

        /** @override */
        this.showConfigMode = function () {};

    }.call(FacReportScreen.prototype);

    exports.FacReportScreen = FacReportScreen;
} ( namespace('factory.screens'), 
    namespace('factory.screens.EnergyScreen'), 
    namespace('factory.panels.ReportModulePanel'),
    namespace('factory.panels.ReportTplPanel') ));
;(function (exports, SuperClass, ReportTplParamsPanel) {

    function FacReportTplScreen() {
        SuperClass.apply(this, arguments);
    }

    FacReportTplScreen.prototype = Object.create(SuperClass.prototype);

    +function () {

        /** @override */
        this.initPanels = function () {
            SuperClass.prototype.initPanels.call(this);

            this.initReportTplParamsPanel();
        };

        /** @override */
        this.getPageData = function () {
            var promise = null;
            // loading
            Spinner.spin(this.windowCtn);
            promise = WebAPI.get("/factory/template/" + this.page.id);
            promise.always(function () {
                Spinner.stop();
            });
            return promise.then(function (rs) {
                var p = {};
                if (rs.content) {
                    p.layout = [rs.content.layouts];
                } else {
                    p.layout = [[]];
                }
                return p;
            });
        };

        /** @override */
        this.initNav = function () {
            var _this = this;

            this.$pageNav = $('#pageNav');
            this.$pageTopTools = $('#pageTopTools');

            $('a', this.$pageTopTools).hide();
            // 显示页面名称
            $('#lkName', this.$pageNav)
                .text('模板编辑 - ' + this.page.name).show();
            // '保存'按钮
            $('#lkSync').off().on('click', function () {
                _this.saveLayout();
            }).show();
            // '预览'按钮
            // $('#lkPreview').off().on('click', function () {

            // }).show();
            // '退出编辑'按钮
            $('#lkQuit').off().on('click', function () {
                _this.close();
            }).show();

            this.$pageTopTools.show();
            this.$pageNav.show();
        };

        // 初始化报表参数 Panel
        this.initReportTplParamsPanel = function () {
            if(this.reportTplParamsPanel) {
                this.reportTplParamsPanel.close();
                this.reportTplParamsPanel = null;
            }
            if( $(this.reportTplParamsPanelCtn).is(':visible') ) {
                this.reportTplParamsPanel = new ReportTplParamsPanel(this, this.reportTplParamsPanelCtn);
                this.reportTplParamsPanel.show();
            }
            this.reportTplParamsPanelCtn.removeEventListener('dock.tabPage.changed', this.onTabPageChanged);
            this.reportTplParamsPanelCtn.addEventListener('dock.tabPage.changed', this.onTabPageChanged, false);
        };

        /** @override */
        this.initLayoutDOM = function () {
            SuperClass.prototype.initLayoutDOM.apply(this, arguments);

            // 添加参数配置 Panel
            this.reportTplParamsPanelCtn = document.createElement('div');
            this.reportTplParamsPanelCtn.setAttribute('caption', '模板参数配置');
            this.reportTplParamsPanelCtn.dataset.type = 'ReportTplParamsPanelCtn';
        };

        /** @override */
        this.initLayout = function () {
            var dockManager = this.factoryScreen.layout.dockManager;
            var documentNode = this.factoryScreen.layout.documentNode;

            var windowPanel, dataSourcePanel, modulePanel;
            var windowNode, dataSourceNode, moduleNode;

            this.initLayoutDOM.apply(this, arguments);

            this.layout.windowPanel = windowPanel = new dockspawn.PanelContainer(this.windowCtn, dockManager);
            this.layout.dataSourcePanel = dataSourcePanel = new dockspawn.PanelContainer(this.dataSourcePanelCtn, dockManager);
            this.layout.modulePanel = modulePanel = new dockspawn.PanelContainer(this.modulePanelCtn, dockManager);
            this.layout.reportTplPanel = new dockspawn.PanelContainer(this.reportTplPanelCtn, dockManager);
            this.layout.reportTplParamsPanel = new dockspawn.PanelContainer(this.reportTplParamsPanelCtn, dockManager);

            dataSourceNode = dockManager.dockRight(documentNode, dataSourcePanel, .2);
            moduleNode = dockManager.dockFill(dataSourceNode, modulePanel);
            windowNode = dockManager.dockFill(documentNode, windowPanel);
            dockManager.dockFill(moduleNode, this.layout.reportTplPanel);
            dockManager.dockDown(moduleNode, this.layout.reportTplParamsPanel, .5);

        };

        this.initModuleLayout = function () {
            SuperClass.prototype.initModuleLayout.apply(this, arguments);

            this.reportTplParamsPanel.refresh();
        };

        /** @override */
        this.saveLayout = function () {
            var _this = this;
            var layouts = this.reportEntity.entity.modal.option.layouts;

            var data = {
                _id: this.page.id,
                content: {
                    layouts: layouts
                }
            };

            WebAPI.post('/factory/material/edit', data).done(function (result) {
                // 更新 storeSerializedStr, 标识存储的数据被更改
                _this.dataSign = _this.getDataSign();
            });
        };

        // 应用模板参数
        this.applyTplParams = function (params) {
            this.reportEntity.applyTplParams(params);
            this.reportEntity.render();
        };

        // 获取模板参数列表
        this.getTplParams = function () {
            return this.reportEntity.getTplParams();
        };

        this.close = function () {
            SuperClass.prototype.close.apply(this, arguments);

            this.reportTplParamsPanel = null;
            this.reportTplParamsPanelCtn = null;

            // 同时销毁 factory screen
            this.factoryScreen.close();
        };

    }.call(FacReportTplScreen.prototype);

    exports.FacReportTplScreen = FacReportTplScreen;

} ( namespace('factory.screens'), 
    namespace('factory.screens.FacReportScreen'),
    namespace('factory.panels.ReportTplParamsPanel') ));
/**
 * FacReportWrapScreen
 */
(function (exports, ReportConfigPanel) {
    var _this;

    function FacReportWrapScreen(page, screen) {
        _this = this;

        this.page = page;
        this.screen = screen;

        //导航条区域
        this.$pageNav = null;
        //中间内容区域
        this.windowCtn = null;
        this.reportConfigPanelCtn = null;
        //主面板区域
        this.reportConfigPanel = null;
        //页面管理区域
        this.pageControl = null;

        this.layout = {
            windowPanel: null
        };
    }

    FacReportWrapScreen.prototype = {
        show: function () {
             Spinner.spin(document.body);

            // 初始化 页面导航条 
            this.initNav();

            // 初始化操作
            this.init();

            Spinner.stop();
        },
        initNav: function () {
            var _this=this;
            // 页面导航条  显示页面名称   保存  预览   管理员 
            this.$pageNav = $('#pageNav');
            this.$pageTopTools = $('#pageTopTools');

            $('a', this.$pageTopTools).hide();
            // 显示页面名称
            $('#lkName', this.$pageNav).text(this.page.name).show();
                
            // 保存
            $('#lkSync', this.$pageTopTools).off('click').click(function () {
                _this.saveLayout();
            }).show();
            // 预览链接
            $('#lkPreview', this.$pageTopTools).off('click').click(function () {
                $(this).attr('href', '/factory/preview/' + AppConfig.userId + '/' + _this.page.id);
            }).show();

            // 显示 Nav
            this.$pageNav.show();
            this.$pageTopTools.show();
            $('[data-toggle="tooltip"]').tooltip({trigger:'hover'});

        },
        init: function () {
            // 初始化布局  面板
            this.initLayout();

            // 初始化 ReportConfigPanel
            this.initReportConfigPanel();
        },

        initReportConfigPanel: function () {
            if(this.reportConfigPanel) {
                this.reportConfigPanel.close();
                this.reportConfigPanel = null;
            }
            if( $(this.reportConfigPanelCtn).is(':visible') ) {
                this.reportConfigPanel = new ReportConfigPanel(this);
                this.reportConfigPanel.show();
            }
        },
        initLayoutDOM: function () {
            //创建中间内容区域
            this.windowCtn = document.createElement('div');
            this.windowCtn.id = 'windowCtn';

            // 创建主面板容器
            this.reportConfigPanelCtn = document.createElement('div');
            this.reportConfigPanelCtn.id = 'reportConfigPanel';
            this.windowCtn.appendChild(this.reportConfigPanelCtn);

        },
        initLayout: function () {
            var dockManager = this.screen.layout.dockManager;
            var documentNode = this.screen.layout.documentNode;

            this.initLayoutDOM();
            
            this.layout.windowPanel = new dockspawn.PanelContainer(this.windowCtn, dockManager);
            
            dockManager.dockFill(documentNode, this.layout.windowPanel);
        },
        saveLayout :function () {
            var fields = $("#reportConfigPanel>form").serializeArray();
            var rs = [];

            for (var i = 0, len = fields.length; i < len; i+=2) {
                if (fields[i].value) {
                    rs.push({
                        reportId: fields[i].value,
                        period: fields[i+1].value
                    });
                }
            };
            
            console.dir(rs);
        },
        close: function(){
            //隐藏导航条
            this.$pageNav.hide();
            this.$pageTopTools.hide();

            // 关闭 reportConfigPanel
            this.reportConfigPanel.close();
            this.reportConfigPanel = null;

            // 删除内容 
            this.windowCtn = null;

            // 销毁 ReprotWrapScreen 的所有面板
            this.screen.layout.dockManager.requestUndock(this.layout.windowPanel);

        }
    };

    exports.FacReportWrapScreen = FacReportWrapScreen;
} ( namespace('factory.screens'),
    namespace('factory.panels.ReportConfigPanel') ));