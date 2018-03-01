// 报表中的图表样式配置
;(function (exports) {

    exports.ChartThemeConfig = exports.ChartThemeConfig || {};
    
    // 非移动端
    +function () {
        var DEFAULT_CHART_OPTIONS = {
            title: {
                textStyle: {
                    fontWeight: 'normal',
                    color: '#000'
                },
                left: 'center'
            },
            toolbox: {
                showTitle:false
            },
            grid: {
                borderWidth: 0,
                left:80,
                bottom:40,
                right:80,
                top:80
            },
            series: [],
            color: ['#E2583A','#FD9F08','#1D74A9','#04A0D6','#689C0F','#109d83','#FEC500'],
            animation:false
        };

        // 饼图默认图表配置
        this.PIE_CHART_OPTIONS = $.extend(false, {}, DEFAULT_CHART_OPTIONS, {
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'horizontal',
                left:50,
                data: []
            }
        });

        // 直角系（带轴）默认图表配置
        this.AXIS_CHART_OPTIONS = $.extend(false, {}, DEFAULT_CHART_OPTIONS, {
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(0,0,0,0.6)',
                axisPointer : {
                    type : 'line',
                    lineStyle : {
                        color: '#aaa'
                    },
                    crossStyle: {
                        color: '#aaa'
                    },
                    shadowStyle : {
                        color: 'rgba(200,200,200,0.2)'
                    }
                },
                textStyle: {
                    color: '#ffffff'
                }
            },
            legend: {
                textStyle: {
                    color: '#999999'
                },
                top:30,
                data: []
            },
            valueAxis:{
                axisLine: {
                    show:false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    textStyle: {
                        color: '#8c97aa'
                    },
                    margin:10
                },
                splitLine: {
                    lineStyle: {
                        color: ['#999999'],
                        type:"solid",
                        opacity:0.4
                    }
                },
                nameTextStyle:{
                    color:'#000000'
                }
            },
            categoryAxis: {
                axisLine: {
                    lineStyle:{
                        color:'#333333',
                        opacity:0.6
                    }
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    textStyle: {
                        color: '#8c97aa'
                    },
                    margin:10
                },
                splitLine: {
                    show: false,
                },
                nameTextStyle:{
                    color:'#000000'
                }
            },
            xAxis:[{
                axisLine: {
                    lineStyle:{
                        color:'#333333',
                        opacity:0.6
                    }
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    textStyle: {
                        color: '#8c97aa'
                    },
                    margin:10
                },
                splitLine: {
                    show: false,
                },
                nameTextStyle:{
                    color:'#000000'
                }
            }],
            yAxis:[{
                axisLine: {
                        show:false
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#8c97aa'
                        },
                        margin:10
                    },
                    splitLine: {
                        lineStyle: {
                            color: ['#999999'],
                            type:"solid",
                            opacity:0.4
                        }
                    },
                    nameTextStyle:{
                        color:'#000000'
                    }
                }]

        });

    }.call(exports.ChartThemeConfig);

    // 移动端
    if (AppConfig && AppConfig.isMobile) {
        +function () {
            //移动端饼图默认配置
            this.PIE_CHART_OPTIONS = $.extend(false, {}, this.PIE_CHART_OPTIONS, {
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    orient: 'horizontal',
                    left:50,
                    data: []
                }
            });

            //移动端直角系（带轴）默认图表配置
            this.AXIS_CHART_OPTIONS = $.extend(false, {}, this.AXIS_CHART_OPTIONS, {
                grid:{
                    left:60,
                    bottom:40,
                    right:20,
                    top:130
                },
                yAxis: [{
                    type: 'value',
                    axisTick: {
                        show: false
                      },
                    axisLine: {
                        show:false
                    },
                    nameGap:45
                }]
            });

        }.call(exports.ChartThemeConfig);
    }

} (
    namespace('factory.report.config')
));
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
                    var $div = $('<div class="lyrow"><span class="lyRowName">' + new Function('return '+row.name)() + '</span><span draggable="true" class="badge">拖拽</span></div>').attr('data-type', row.type);
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
                        $modals.append(getModuleList.call(this, name, groupMap[name]));
                    }
                }

                $(this.container).append($modals);
                $('.lyrow').find('.badge').text(I18n.resource.report.optionModal.DRAG);
                $('.nav-header').text(I18n.resource.report.optionModal.TITLE);
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
        this.treeCtn = null;
    }

    +function () {
        
        this.show = function () {
            var _this = this;
            
            this.treeCtn = document.createElement('ul');
            this.treeCtn.id = 'reportTplTree';
            this.treeCtn.className = 'ztree';
            this.container.appendChild(this.treeCtn);

            $.fn.zTree.init($(this.treeCtn), {
                async: {
                    enable: true,
                    type: 'get',
                    url: function (treeId, treeNode) {
                        var url = "/factory/material/group/report";
                        // 首次加载
                        if (!treeNode) {
                            return url;
                        } else {
                            return url + '/' + treeNode.id;
                        }
                    },
                    // 将 PO 转换成 VO
                    dataFilter: function (treeId, parentNode, rs) {
                        if (rs.status !== 'OK') {
                            return [];
                        }
                        // 因为用不到数据，所以这里就不对数据进行缓存
                        
                        return rs.data.map(function (row) {
                            return {
                                id: row._id,
                                name: row.name,
                                isParent: row.isFolder === 1
                            }
                        });
                    }
                },
                view: {
                    showIcon:false,
                    showLine: false,
                    // 不允许用户同时选中多个进行拖拽
                    selectedMulti: false
                },
                callback: {
                    onNodeCreated: function (e, treeId, treeNode) {
                        var domA;
                        $('#'+ treeNode.tId + '_switch').prependTo($('#'+ treeNode.tId + '_a'));
                        if (!treeNode.isParent) {
                            domA = _this.treeCtn.querySelector('#'+treeNode.tId + '_a');
                            domA.setAttribute('draggable', 'true');
                            domA.classList.add('.report-tpl-item');
                            domA.dataset.id = treeNode.id;
                            domA.ondragstart = function (e) {
                                var dataTransfer = e.dataTransfer;
                                dataTransfer.setData('id', this.dataset.id);
                                dataTransfer.setData('type', 'template');
                            };
                        }
                    }
                }
            });

        };

        this.attachEvents = function () {
            var _this = this;

        };

        this.close = function () {
            this.screen = null;

            $.fn.zTree.destroy("reportTplTree");

            this.container = '';
        };

    }.call(ReportTplPanel.prototype);

    exports.ReportTplPanel = ReportTplPanel;

} ( namespace('factory.panels') ));
;(function (exports) {

    var paramType = {
        TEXT: {
            value: 0,
            name: 'Text'
        }
    };

    function ReportTplParamsPanel(screen, container) {
        this.screen = screen;
        this.container = container;
        this.$container = $(this.container);

        this.map = {};
        this.valMap = {};
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
                        <th class="pramName">参数名称</th>\
                        <th class="pramType">类型</th>\
                        <th class="pramValue">值</th>\
                    </tr>\
                </thead>\
                <tbody><tr><td colspan="3" class="pramNo">无参数</td></tr></tbody>\
                </table>';

            // 初始化按钮
            var btnsTpl = '<div class="tpl-params-btn-wrap">\
                <a href="javascript:;" id="lkRefreshTplParams"><span class="badge">刷新</span></a>\
                <a href="javascript:;" id="lkApplyTplParams"><span class="badge">应用</span></a>\
            </div>';

            this.container.innerHTML = btnsTpl + tableTpl;
            $('.pramName').text(I18n.resource.report.templateConfig.PRAM_NAME);
            $('.pramType').text(I18n.resource.report.templateConfig.PRAM_TYPE);
            $('.pramValue').text(I18n.resource.report.templateConfig.PRAM_VALUE);
            $('.pramNo').text(I18n.resource.report.templateConfig.NO_PRAM);
            $('#lkRefreshTplParams').find('.badge').text(I18n.resource.report.templateConfig.REFRESH);
            $('#lkApplyTplParams').find('.badge').text(I18n.resource.report.templateConfig.APPLY);

            this.$table = this.$container.children('.table');

            this.attachEvents();
        };

        this.render = (function () {

            function getSelectTpl(type) {
                return '<select>' +
                    Object.keys(paramType).map(function (key) {
                        if (type === paramType[key].value) {
                            return '<option value="{value}" selected>{name}</option><option value="1">Json</option>'.formatEL(paramType[key]);
                        } else {
                            return '<option value="{value}">{name}</option><option value="1">Json</option>'.formatEL(paramType[key]);
                        }
                    }) + '</select>';
            }

            function getRowTpl(type) {
                return '<tr>\
                        <td>{name}</td>\
                        <td>' + getSelectTpl(type) + '</td>\
                        <td>{value}</td>\
                    </tr>';
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
                    $('.iptPram').attr('placeholder', I18n.resource.report.templateConfig.WRITE_VALUE);
                } else {
                    $('tbody', this.$table).html('<tr><td colspan="3" class="pramNo">无参数</td></tr>');
                    $('.pramNo').text(I18n.resource.report.templateConfig.NO_PRAM);
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
                p[data.name] = _this.layoutName(data);
                _this.__setMap(p);
                e.stopPropagation();
            });
        };

        this.__setMap = function (params) {
            var _this = this;
            Object.keys(params).forEach(function (key) {
                _this.map[key].value = params[key];
            });
        };

        this.layoutName = function (data){
            var str = data.value.trim();
            str = str.replace((/([\w]+)(:)/g), "\"$1\"$2");//add "" before : if doesnt exist
            str = str.replace((/'/g), "\"");  //replace '' with ""
            if(str.split('[').length === 1 && str.split('{').length === 1){
                return str;
            }else{
                var arr = JSON.parse(str);
                if(Object.prototype.toString.call(arr) === "[object Array]"){
                    return arr;
                }else if(Object.prototype.toString.call(arr) === "[object Object]"){
                    var newArr = [];
                    var min = parseInt(arr["min"]);
                    var max = parseInt(arr["max"]);
                    var step = parseInt(arr["step"]) || 1;
                    for(var k = min; k <= max; k = k+step){
                        newArr.push(k);
                    }
                    return newArr;
                }
            }
        };

        this.__getValueTpl = function (name, type, value) {
            return '<input type="text" class="iptPram"  name="'+name+'" value="'+(value || '')+'" />';
        };

        this.refresh = function () {
            var _this = this;
            var params = this.screen.getTplParams();
            var map = {};

            params.forEach(function (row) {
                var name = row['name'];
                if ( _this.map.hasOwnProperty(name) ) {
                    map[name] = _this.map[name];
                } else {
                    map[name] = {
                        type: paramType.TEXT.value,
                        value: typeof row['value'] === 'undefined' ? '' : row['value']
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
		this.wrapContainer = screen.reportConfigPanelCtn;

		//数据  再次打开 获取到之前设置好的数据
		//this.getHavedData = this.screen.store.reportWrap;

		//包裹的form
		this.wrapForm = $('<ul class="reportList gray-scrollbar"></ul>');
	}

	ReportConfigPanel.prototype = {
		//周期
	    period: [{ val: 'day', text: 'day'}, {val: 'week', text: 'week'}, { val: 'month', text: 'month'}, { val: 'year', text: 'year'}],
		show: function () {
			this.wrapForm.appendTo( $(this.wrapContainer) );
			$(this.wrapContainer).append('<div class="btnGroup"><span class="glyphicon glyphicon-plus" id="addReport" title="新建报表"></span><span class="glyphicon glyphicon-edit" id="editReport" aria-hidden="true"></span>' +
				'<span class="glyphicon glyphicon-export" id="exportReport"></span><span class="glyphicon glyphicon-import" id="importReport"></span><span class="glyphicon glyphicon-trash" id="delReport" aria-hidden="true"></span></div>');

			$(this.getAllReport()).appendTo(this.wrapForm);

			this.attachEvents();
			$(this.screen.reportConfigPanelCtn).find('.liReport>span').eq(0).parent().addClass('liCheck');
			$(this.screen.reportConfigPanelCtn).find('.liReport>span').eq(0).trigger('click');
		},

		//周期
		getPeriodKinds : function (data) {
			var periodOptions = "";

			data = data || {};
			for(var i=0,len=this.period.length;i<len;i++) {
				if (data === this.period[i].val) {
        			periodOptions+='<option value="'+this.period[i].val+'" selected>'+this.period[i].text+'</option>'
        		} else {
        			periodOptions+='<option value="'+this.period[i].val+'">'+this.period[i].text+'</option>'
        		}
			}
			return periodOptions;
		},
		//开始时间
		getPeriodStartTime:function (period,startTime){
			var periodOptions = '';
			if(!startTime){
				startTime = 0;
			}
			switch (period){
				case 'day':
					for(var j=0;j<24;j++){
						if(startTime === j){
							periodOptions+='<option value="'+ j +'" selected>'+ j +':00</option>'
						}else{
							periodOptions+='<option value="'+ j +'">'+ j +':00</option>'
						}
					}
					break;
				case 'week':
					for(var j=0;j<7;j++){
						if(startTime === j){
							periodOptions+='<option value="'+ j +'" selected>周 '+ this.changeNumber(j+1) +'</option>'
						}else{
							periodOptions+='<option value="'+ j +'">周 '+ this.changeNumber(j+1) +'</option>'
						}
					}
					break;
				case 'month':
					for(var j=0;j<28;j++){
						if(startTime === j){
							periodOptions+='<option value="'+ j +'" selected>'+ (j+1) +' 日</option>'
						}else{
							periodOptions+='<option value="'+ j +'">'+ (j+1) +' 日</option>'
						}
					}
					break;
				case 'year':
					for(var j=0;j<12;j++){
						if(startTime === j){
							periodOptions+='<option value="'+ j +'" selected>'+ (j+1) +' 月</option>'
						}else{
							periodOptions+='<option value="'+ j +'">'+ (j+1) +' 月</option>'
						}
					}
					break;
			}
			return periodOptions;
		},
		changeNumber: function(data){
			var upNub;
			switch (data){
				case 1:
					upNub = '一';
					break;
				case 2:
					upNub = '二';
					break;
				case 3:
					upNub = '三';
					break;
				case 4:
					upNub = '四';
					break;
				case 5:
					upNub = '伍';
					break;
				case 6:
					upNub = '六';
					break;
				case 7:
					upNub = '日';
					break;
			}
			return upNub;
		},
		//拿到所有的report
		getAllReport: function(){
			var reportList = this.screen.store.list;
			//兼容老数据
			reportList.forEach(function(row){
				if(!row.periodStartTime){
					row.periodStartTime = 0;
				}
			});
			var _this = this;
			return (function(data){
						var tpl = '';
						for(var i = 0,len = data.length;i<len;i++){
							tpl += '<li id="'+ data[i].reportId +'" class="liReport" draggable="true"><span class="reportName">'+ data[i].reportName +'</span><input class="editName" type="text" style="display:none;"><select class="startTimeSelect">'+_this.getPeriodStartTime(data[i].period,data[i].periodStartTime)+'</select><select class="periodSelect">'+_this.getPeriodKinds(data[i].period)+'</select></li>';
						}
						return tpl;
					})(reportList)
		},
		attachEvents: function () {
			var _this=this;
			//点击加号
			$(this.wrapContainer).on('click','#addReport',function(){
				var newReportId = ObjectId();
				var tpl = '<li id="'+ newReportId +'" class="liReport" draggable="true"><span class="reportName" style="display:none;"></span><input class="editName" type="text" value="untitled"><select class="startTimeSelect">'+_this.getPeriodStartTime('day')+'</select><select class="periodSelect">'+_this.getPeriodKinds()+'</select></li>';
				$(_this.wrapForm).append(tpl);
				_this.screen.store.list.push({
					reportId: newReportId,
					reportName: 'untitled',
					period: 'day',
					periodStartTime:0
				});
				var saveData = {
					pageId: _this.screen.page.id,
                	list: _this.screen.store.list,
                	data: {
						id:newReportId,
						creatorId: AppConfig.userId,
						menuItemId:newReportId,
						isFactory: AppConfig.isFactory,
						layout: [[]]
					}
				};
				_this.screen.autoSave(true,_this.getReport.bind(_this,newReportId),saveData);
				var lastLi = $(_this.wrapForm).children('li').last();
				lastLi.siblings().removeClass('liCheck');
				lastLi.addClass('liCheck').children('.editName').focus();
			});
			//点击删除
			$(this.wrapContainer).on('click','#delReport',function(){
				var $currentLi = $(_this.wrapForm).find('.liCheck');
				if($currentLi.length < 1){
					alert('请选择一个报表进行删除！');
				}
				confirm('Confirm to delete this report?',function(){
					$currentLi.remove();
					$(_this.screen.windowRightPanelCtn).find('#reportWrap').empty();
					var reportList = _this.screen.store.list;
					var index;
					for(var i = 0,len = reportList.length;i<len;i++){
						if(reportList[i].reportId === _this.openReport.reportId){
							index = i;
							break;
						}
					}
					reportList.splice(index,1);
					var saveData = {
						pageId: _this.screen.page.id,
						list: reportList,
						removeData: {menuItemId:_this.openReport.reportId}
					};
					_this.screen.autoSave(true,function(){
						_this.screen.store.list = reportList;
						_this.openReport = null;
						_this.reportEntity = _this.screen.reportEntity = null;
					}.bind(_this),saveData);
				},function(){
					return;
				});
			});
			//点击编辑
			$(this.wrapContainer).on('click','#editReport',function(){
				var $currentLi = $(_this.wrapForm).find('.liCheck');
				//$currentLi.prop('draggable',false);
				var reportName = $currentLi.children('.reportName').text();
				$currentLi.children('.reportName').hide();
				$currentLi.children('.editName').val(reportName).show();
				$currentLi.children('.editName').focus();
			});
			$(this.wrapContainer).on('change','.editName',function(){
				var newReportName = $(this).val();
				$(this).hide();
				$(this).prev('.reportName').text(newReportName).show();
				var reportList = _this.screen.store.list;
				reportList.some(function(row){
					if(row.reportId === _this.openReport.reportId){
						row.reportName = newReportName;
						return true;
					}
				});
				var saveData = {
					pageId: _this.screen.page.id,
                    list: reportList
				};
				_this.screen.autoSave(true,null,saveData);
				$(this).parent('.liReport').prop('draggable',true);
			});
			$(this.wrapContainer).on('focus','.editName',function(){
				$(this).parent().prop('draggable',false);
			});
			$(this.wrapContainer).on('blur','.editName',function(){
				$(this).hide();
				$(this).prev('.reportName').text($(this).val()).show();
				$(this).parent().prop('draggable',true);
			});
			$(this.wrapContainer).on('keyup','.editName',function (e) {
				if (e.which === 13) {
					$(this).blur();
					$(this).trigger('blur');
				}
			});
			//单个报表点击事件
			$(this.wrapContainer).off('click','.liReport>span').on('click','.liReport>span',function(){
				_this.reportEntity && _this.reportEntity.destroy();
				var reportId = $(this).parent().attr('id');
				//$(_this.screen.windowRightPanelCtn).find('#reportWrap').empty();
				Spinner.spin(document.body);
				if(_this.openReport){
					_this.screen.autoSave(true,_this.getReport.bind(_this,reportId));
				}else{
					_this.getReport(reportId);
				}
				if(!$(this).parent().hasClass('liCheck')){
					$(this).parent().addClass('liCheck');
				}
				$(this).parent().siblings().removeClass('liCheck');
			});
			//报表类型选择
			$(this.wrapContainer).off('change','select').on('change','select',function(e){
				var modalIns = _this.reportEntity;
                var modal = modalIns.entity.modal;
                var form = {};

				var curVal = $(this).val();
				var reportList = _this.screen.store.list;
				var curReportId = $(this).parent().attr('id');

				if($(this).hasClass('periodSelect')){
					$(this).siblings('.startTimeSelect').empty().html(_this.getPeriodStartTime(curVal));
					form.period = curVal;
					form.periodStartTime = 0;
					reportList.some(function(row){
						if(row.reportId === curReportId){
							row.period = curVal;
							row.periodStartTime = 0;
							return true;
						}
					});
				}else{
					form.period = $(this).siblings('select.periodSelect').val();
					form.periodStartTime = parseInt(curVal);
					reportList.some(function(row){
						if(row.reportId === curReportId){
							row.period = form.period;
							row.periodStartTime = form.periodStartTime;
							return true;
						}
					});
				}
				if(_this.openReport.reportId === $(this).closest('li').attr('id')){
					modal.option = $.extend(false, modal.option, form);
                	modalIns.render(true);
				}

				var saveData = {
					pageId: _this.screen.page.id,
                    list: reportList
				};
				_this.screen.autoSave(true, null, saveData);

                e.preventDefault();
			});

			//报表拖拽
			$(this.wrapContainer).off('dragstart','.liReport').on('dragstart','.liReport',function(e){
				var ev = e || window.event;
				$(this).removeClass('.liReport:hover');
                var dataTransfer = ev.originalEvent.dataTransfer;
				var data = {
					name:$(this).find('.reportName').text(),
					id: $(this).attr('id'),
					period:$(this).find('select.periodSelect').val(),
					periodStartTime:parseInt($(this).find('select.startTimeSelect').val())
				};
				dataTransfer.setData('report',JSON.stringify(data));
			});
			$(this.wrapContainer).off('dragenter','.liReport').on('dragenter','.liReport',function(e){
				e.preventDefault();
			});
			$(this.wrapContainer).off('dragover','.liReport').on('dragover','.liReport',function(e){
				e.preventDefault();
			});
			$(this.wrapContainer).off('dragleave','.liReport').on('dragleave','.liReport',function(e){
				e.preventDefault();
			});
			$(this.wrapContainer).off('drop','.liReport').on('drop','.liReport',function(e){
				e.preventDefault();
				var $this = $(this);
				$this.addClass('.liReport:hover');
                var ev = e || window.event;
                var dataTransfer = ev.originalEvent.dataTransfer;
				var data = JSON.parse(dataTransfer.getData('report'));
				if(data.id === $this.attr('id')){return;}
				var tpl = '<li id="'+ data.id +'" class="liReport" draggable="true">' +
					'<span class="reportName">'+ data.name +'</span><input class="editName" type="text" style="display:none;">' +
					'<select class="startTimeSelect">'+_this.getPeriodStartTime(data.period,data.periodStartTime)+'</select><select class="periodSelect">'+_this.getPeriodKinds(data.period)+'</select>' +
					'</li>';
				$('#'+data.id).remove();
				$this.after(tpl);
				var $reportListWrap=$('.liReport');
                var reportList = [];
				$reportListWrap.each(function(){
                    var $this = $(this);
                    var reportName = $this.find('span').text()===''?'untitled':$this.find('span').text();
                    var reportId = $this.attr('id');
                    var period = $this.find('select.periodSelect').find('option:selected').val();
					var periodStartTime = parseInt($this.find('select.startTimeSelect').find('option:selected').val());
                    if (reportId) {
                        reportList.push({
                            reportId: reportId,
                            reportName: reportName,
                            period: period,
							periodStartTime:periodStartTime
                        });
                    }
                });
				var saveData = {
					pageId: _this.screen.page.id,
                    list: reportList
				};
				_this.screen.autoSave(true,function(){
					_this.screen.store.list = reportList;
				}.bind(_this),saveData);
				if($(_this.wrapContainer).find('.liCheck').length <1){
					$this.next().addClass('liCheck');
				}
			});
			//报表导出
			$(this.wrapContainer).on('click','#exportReport',function() {
				var selectNodes = $(_this.wrapForm).find('.liCheck');
				var templateName, data;
				var report;
				if (selectNodes.length !== 1) {
					alert(I18n.resource.mainPanel.layerPanel.EXPORT_PAGE_TEMPLET_INFO);
					return;
				}
				templateName = prompt(I18n.resource.mainPanel.layerPanel.WRITE_TEMPLET_NAME);
				if (!templateName) return;
				data = {
					_id: ObjectId(),
					pageId: _this.screen.page.id,
					name: templateName,
					creator: AppConfig.userProfile.fullname,
					time: new Date().format('yyyy-MM-dd HH:mm:ss'),
					'public': 1,
					isFolder: 0,
					group: '',
					content: {},
					type: 'page.ReportScreen'
				};
				report = _this.reportEntity;
				if(report){
					var template = {
						layout:report.entity,
						period:$(_this.wrapContainer).find('.liCheck').find('select.periodSelect').find('option:selected').val()
					};
					data.content.template = JSON.stringify(template);
				}else{
					data.content.template = "";
				}
				WebAPI.post('/factory/material/save', data).done(function (result) {
					if (result && result._id) {
						data._id = result._id;
					}
				})
			});
			//报表导入
			$(this.wrapContainer).on('click','#importReport',function(){
				MaterialModal.show([{'title':'Template',data:['Page.ReportScreen']}], function (result) {
					var chosedReport = _this.screen.store.list;
					var params = {
						reportId: ObjectId(),
						reportName: result.name,
						period: 'day',
						periodStartTime:0
					};
					if(JSON.parse(result.content.template).period){
						params.period = JSON.parse(result.content.template).period;
					}
					chosedReport.push(params);
					var data = {
						id:params.reportId,
						creatorId: AppConfig.userId,
						menuItemId:params.reportId,
						isFactory: AppConfig.isFactory,
						layout: [[JSON.parse(result.content.template).layout]]
					};
					var saveData = {
						pageId: _this.screen.page.id,
						list: chosedReport,
						data: data
					};
					_this.screen.autoSave(true,function(){
						_this.importReport(params);
					}.bind(_this),saveData);
				});
			});
		},
		importReport:function(params){
			var _this = this;
			var tpl = '<li id="'+ params.reportId +'" class="liReport"><span class="reportName">'+ params.reportName +'</span><input class="editName" type="text" style="display:none;"><select class="startTimeSelect">'+_this.getPeriodStartTime(params.period,params.periodStartTime)+'</select><select class="periodSelect">'+_this.getPeriodKinds(params.period)+'</select></li>';
			$(_this.wrapForm).append(tpl);
			var lastLi = $(_this.wrapForm).children('li').last();
			lastLi.addClass('liCheck').siblings().removeClass('liCheck');
			//$(_this.screen.windowRightPanelCtn).find('#reportWrap').empty();
			_this.getReport(params.reportId);
		},
		getReport : function (reportId) {
			var _this = this;
			//this.dataSign = this.getDataSign();
			WebAPI.get("/spring/get/" + reportId  + '/' + AppConfig.isFactory).done(function(rs){
				$(_this.screen.windowRightPanelCtn).find('#reportWrap').empty();
				var layouts = rs.layout[0] || [];
				var Clazz;
				var modal;

				var	type = 'ReportContainer';

				Clazz = namespace('factory.report.components')[type];

				if (layouts.length === 1 &&
					['Container', 'ReportContainer', 'ChapterContainer'].indexOf(layouts[0].modal.type) > -1 ) {
					//if(!layouts[0].modal.option.periodStartTime){
						var _id = rs.menuItemId || reportId;
						_this.screen.store.list.some(function(row){
							if(row.reportId === _id){
								layouts[0].modal.option.period = row.period;
								layouts[0].modal.option.periodStartTime = row.periodStartTime;
								return true;
							}
						});
					//}
					modal = $.extend(false, layouts[0].modal, {type: type});
				}
				// 对旧数据和模板做个兼容
				else {
					modal = {
						option: {
							layouts: layouts,
							period: 'day',
							periodStartTime: 0
						},
						type: type
					};
				}

				_this.screen.reportEntity = _this.reportEntity = new Clazz(_this.screen, {
					spanC: 12,
					spanR: 6,
					modal: modal
				});

				_this.openReport = {
					creatorId: rs.creatorId,
					reportId: rs.menuItemId || reportId,
					dataId:rs.id
				};

				_this.reportEntity.render(true);
			}).always(function (e) {
				window.setTimeout(function () {
					Spinner.stop();
				}, 500);
			});
		},
		close : function () {
			$(this.wrapContainer).remove();
		}
	};

	exports.ReportConfigPanel = ReportConfigPanel;

} ( namespace('factory.panels') ));
;(function (exports) {

    var MODE_HTML = 'html';
    var MODE_CSS = 'css';
    var MODE_JS = 'js';


    function DeclareVariablesModal() {
        this.$modalWrap = null;

        this.modes = [];
        this.callback = null;
    }

    +function () {
        // 显示组件
        this.show = function (data, callback, modes) {
            var _this = this;
            var promise = $.Deferred();

            data = data || {};
            this.modes = modes || [MODE_HTML, MODE_CSS, MODE_JS];
            this.callback = callback;
            this.map = {};

            // 如果之前实例化过，直接 append 到页面上
            if (this.$modalWrap) {
                this.$modalWrap.appendTo(document.body);
                $('#declareVariables').modal('show');
                promise.resolve();
            } else {
                 // 如果没有实例化过，则进行实例化操作
                WebAPI.get('/static/app/WebFactory/scripts/screens/report/modals/declareVariablesModal/declareVariablesModal.html').done(function (html) {
                    _this.init(html);
                    $('#declareVariables').modal('show');
                    promise.resolve();
                });
            }

            promise.done(function () {
                var $panels = $('#panels');
                _this.$declareVariables.width($panels.width() - $panels.find('.splitter-container-horizontal').eq($panels.find('.splitter-container-horizontal').length-1).width());
                _this.$declareVariables.find('.modal-backdrop').width(_this.$declareVariables.width());
                // 初始化编辑器
                _this.initEditor(data);
            });
        };

        // 组件初始化
        this.init = function (html) {
            var element = HTMLParser(html);

            this.$modalWrap = $(element);
            this.$declareVariables = $('#declareVariables', this.$modalWrap);
            //数据源的表格
            this.$modalContent = $('.modal-body', this.$modalWrap);
            //jsCode
            this.$jsCode = $('.jsCode', this.$modalWrap);
            // 保存并退出按钮
            this.$btnSaveAndExit = $('.btn-submit', this.$modalWrap);
            this.$modalWrap.appendTo('body');
            I18n.fillArea(this.$modalWrap);

            // 绑定 modal 事件
            this.attachEvents();
        };

        this.initEditor = function (data) {
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
            };
            // 初始化布局
            this.initLayout(data);
        };

        // 初始化布局
        this.initLayout = function (data){
            var _this = this;
            this.$modalContent.html("");
            var dataObj;
            try {
                var i = 0;
                if(typeof data.js === "string"){
                    dataObj = JSON.parse(data.js);
                    reader(dataObj,true);
                }else{
                    dataObj = data.js;
                    reader(dataObj);
                }
                function reader(arr,CodeEditor) {
                    if(arr instanceof Array){
                        $(_this.$modalWrap).find('.jsCode').hide();
                        arr.forEach(function (row) {
                            if (row instanceof Array) {
                                reader(row);
                                return;
                            }
                            // 渲染一个表格
                            _this.renderTable(row,i);
                            if(!CodeEditor){
                               _this.map[i] = row;
                            }
                            i += 1;
                        });
                    }else{
                        $(_this.$modalWrap).find('.jsCode').show();
                        _this.renderTable(arr);
                        if(!CodeEditor){
                            _this.map[0] = arr;
                        }
                    }
                }
            }catch(e) {
                alert(I18n.resource.report.VAR_DECLARATION_INFO);
            }
        };
        this.renderTable = function (data,i) {
            var table;
            var _this = this;
            var tpl;
            if(typeof i === "number"){
                tpl = '<table class="dataSourceTable" data-no = "'+ i +'"><caption>'+ data.title +'</caption>'+
                        '<thead><tr><th style="width:20%;">变量名</th><th>对应值</th><th>描述</th></tr></thead><tbody></tbody></table>';
            }else{
                tpl = '<table class="dataSourceTable"><thead><tr><th style="width:20%;">变量名</th><th>对应值</th><th>描述</th></tr></thead><tbody></tbody></table>';
            }
            table = HTMLParser(tpl.slice());
            this.$modalContent.append($(table));
            if(data.val && !$.isEmptyObject(data.val)){
                $.each(data.val,function(key,value){
                    _this.add($(table),key,value);
                });
                var $tbody = $(table).find('tbody');
                $(table).find("tr").each(function(){
                    var index = $tbody.find("tr").index($(this));
                    if(index !== $tbody.find("tr").length-1){
                        $(this).find(".addMinusBtn").removeClass("add").addClass("minus");
                        $(this).find("span").removeClass().addClass("glyphicon glyphicon-minus");
                    }
                });
            }else{
                this.add($(table));
            }
        };
        this.add = function($table,key,values){
            var key = key === undefined?"":key;
            var value;
            if(typeof values === "string" || typeof values === "number"){
                value = {
                    val: values.toString(),
                    descr: ''
                }
            }else if(typeof values === 'undefined'){
                value = {
                    val:'',
                    descr:''
                };
            }else{
                value = values;
            }
            var str = '<tr>\
                            <td>\
                                <input type="text" class="form-control name" value="'+key+'">\
                            </td>\
                            <td>\
                                <input type="text" class="form-control value" value="'+value.val+'">\
                            </td>\
                            <td>\
                                <input type="text" class="form-control descr" value="'+value.descr+'" placeholder="'+i18n_resource.report.VAR_DECLARATION_DESC_DETAIL+'">\
                            </td>\
                            <td class="addMinusBtn add">\
                                <span class="glyphicon glyphicon-plus"></span>\
                            </td>\
                        </tr>';
            $table.find('tbody').append($(str));
        };
        // 绑定事件
        this.attachEvents = function () {
            var _this = this;
            //名字 去重
            this.$modalContent.off("blur",".name").on("blur",".name",function(){
                var $table = $(this).closest('.dataSourceTable');
                var $names = $table.find(".name");
                var name = $(this).val();
                var index = $names.index($(this));
                if(index === $names.length-1){
                    $names.each(function(i,$name) {
                        if(i !== $names.length-1){
                            if($name.value === name){
                                alert("名字重复");
                                $name.value = '';
                            }
                        }
                    })
                }
            });
            //js代码编辑
            this.$jsCode.off('click').on('click', function () {
                var jsString;
                if(Object.keys(_this.getData()).length>1){
                    jsString= JSON.stringify([_this.getData()],null,2);
                }else{
                    jsString= JSON.stringify(_this.getData()[0],null,2);
                }
                CodeEditorModal.show({
                    js: jsString
                }, function (code) {
                    _this.initLayout(code);
                }, ['js']);
            });
            //加号 点击事件
            this.$modalContent.off('click.add').on('click.add', '.add', function () {
                var $table = $(this).closest('.dataSourceTable');
                var $curTr = $(this).closest('tr');
                var name = $curTr.find(".name").val();
                var value = $curTr.find(".value").val();
                if(name !== "" || value !== ""){
                    $(this).find("span").removeClass().addClass("glyphicon glyphicon-minus");
                    $(this).removeClass("add").addClass("minus");
                    _this.add($table);
                }
            });
            //减号
            this.$modalContent.off('click.minus').on('click.minus', '.minus', function () {
                var $curTr = $(this).closest('tr');
                $curTr.detach();
            });
            //保存确认
            this.$btnSaveAndExit.off('click').on('click', function () {
                typeof _this.callback === 'function' && _this.callback(_this.getData());
                $('#declareVariables').modal('hide');
            });
            //数据源拖拽
            this.$modalContent.off('drop','.value').on('drop','.value',function(e){
                var dragId = EventAdapter.getData().dsItemId;
                if (AppConfig.datasource.currentObj === 'cloud') {
                    var dragName = $('#tableDsCloud').find('tr[ptid="' + dragId + '"]').find('.tabColName').attr('data-value');
                    var currentId = $('#selectPrjName').find('option:selected').val();
                    if (currentId) {
                        dragName = '@' + currentId + '|' + dragName;
                    } else {
                        dragName = dragId;
                    }
                }else{
                    dragName = dragId;
                }
                $(this).val('<%'+dragName+'%>');
                e.preventDefault();
            });
            this.$modalContent.off('dragenter','.value').on('dragenter','.value',function(e){
                e.preventDefault();
            });
            this.$modalContent.off('dragover','.value').on('dragover','.value',function(e){
                e.preventDefault();
            });
        };

        this.getData = function () {
            var _this = this;
            var $table = $('.dataSourceTable');
            var name,value,descr;
            $table.each(function(){
                var row = $(this);
                var $trs = row.find('tbody').children('tr');
                var i = row.attr('data-no') || 0;
                if(_this.map[i].val){
                    Object.keys(_this.map[i].val).forEach(function(row){
                        delete _this.map[i].val[row];
                    });
                }
                $trs.each(function(){
                    var tr = $(this);
                    name = tr.find(".name").val();
                    value = tr.find(".value").val();
                    descr = tr.find(".descr").val();
                    if(value !== ''){
                        _this.map[i].val[name] = {};
                        _this.map[i].val[name]['val'] = value;
                        _this.map[i].val[name]['descr'] = descr;
                    }
                });
            });
            return this.map;
        };

        // 组件状态还原
        this.reset = function () {
            // 重置回调函数
            this.callback = null;
        };

        // 隐藏组件
        this.hide = function () {
            if (this.$modalWrap) {
                this.reset();
                this.$modalWrap.detach();
            }
        };

    }.call(DeclareVariablesModal.prototype);

    exports.DeclareVariablesModal = new DeclareVariablesModal();
} (window));
// 变量处理特性
(function (exports) {

    function VariableProcessMixin() {
        this.variableProcessTasks = [];
    }

    +function () {

        /**
         * 
         * 对新的 variables 数据格式做兼容
         * @param {any} variables 变量数据
         * @returns 返回旧的数据格式，从而兼容后续逻辑
         */
        this._formatVariables = function (variables) {
            if (typeof variables === 'object') {
                variables = $.extend(false, {}, variables);
                Object.keys(variables).forEach(function (key) {
                    var row = variables[key];

                    if (typeof row === 'object' && typeof row['val'] !== 'undefined') {
                        variables[key] = row['val'];
                    }
                });
            }
            // 异常格式处理
            else {
                return;
            }
            return variables;
        };

        // 注册一个任务
        this.registTask = function (variables, ins) {
            var promise = $.Deferred();

            // 兼容老的数据格式
            variables = this._formatVariables(variables);
            // 对象深拷贝
            variables = $.extend(true, {}, variables);

            this.variableProcessTasks.push({
                variables: variables,
                promise: promise,
                ins: ins
            });

            return promise;
        };

        // 处理任务
        this.processTask = (function () {
            var loadQueue;
            var api = {
                // 一个或多个点的数据总和，返回一个数值
                SUM: function () {
                    var points = Array.prototype.slice.apply(arguments);
                    var total = 0;

                    points.forEach(function (p) {
                        var sum = 0
                        p.data.forEach(function (num) {
                            sum += num;
                        });
                        total += sum;
                    });

                    // 保留两位小数
                    return Math.round(total*100) / 100;
                },
                // 把多个点的值进行合并，返回一个合并点
                SUM_POINT: function() {
                    var points = Array.prototype.slice.apply(arguments);
                    var rs = {
                        data: [],
                        timeShaft: points[0].timeShaft
                    };

                    points[0].data.forEach(function (row, i) {
                        var rowSum = 0;
                        points.forEach(function (p) {
                            rowSum += p.data[i];
                        });
                        rs.data.push(rowSum);
                    });

                    return rs;
                },
                // 非0值的数据平均值
                NONZERO_AVERAGE: function () {
                    var points = Array.prototype.slice.apply(arguments);
                    var total = 0, count = 0;

                    points.forEach(function (p) {
                        p.data.forEach(function (num) {
                            if (num === 0) {
                                return;
                            }
                            total += num;
                            count ++;
                        });
                    });

                    if (count === 0) {
                        return 0;
                    }

                    // 保留两位小数
                    return Math.round(total/count*100) / 100;
                },
                // 一个或多个点的数据平均值，返回一个数值
                AVERAGE: function () {
                    var points = Array.prototype.slice.apply(arguments);
                    var total = 0, count = 0;

                    points.forEach(function (p) {
                        p.data.forEach(function (num) {
                            total += num;
                            count ++;
                        });
                    });

                    if (count === 0) {
                        return 0;
                    }

                    // 保留两位小数
                    return Math.round(total/count*100) / 100;
                },
                // 一个或多个点中的数据的最大值，返回一个数值
                MAX: function () {
                    var points = Array.prototype.slice.apply(arguments);
                    var data = [], timeShaft = [];
                    var max, idx, indices = [];

                    points.forEach(function (p) {
                        data = data.concat(p.data);
                        timeShaft = timeShaft.concat(p.timeShaft);
                    });

                    max = Math.max.apply(null, data);
                    // 获取 max 所在数组的位置的 index 值
                    idx = data.indexOf(max);
                    while(idx !== -1) {
                        indices.push(idx);
                        idx = data.indexOf(max, idx+1);
                    }

                    return {
                        value: max,
                        time: indices.map(function (row) {
                            return timeShaft[row];
                        })
                    }
                },
                // 一个或多个点中的数据的最小值，返回一个数值
                MIN: function () {
                    var points = Array.prototype.slice.apply(arguments);
                    var data = [], timeShaft = [];
                    var min, idx, indices = [];

                    points.forEach(function (p) {
                        data = data.concat(p.data);
                        timeShaft = timeShaft.concat(p.timeShaft);
                    });

                    min = Math.min.apply(null, data);
                    // 获取 min 所在数组的位置的 index 值
                    idx = data.indexOf(min);
                    while(idx !== -1) {
                        indices.push(idx);
                        idx = data.indexOf(min, idx+1);
                    }

                    return {
                        value: min,
                        time: indices.map(function (row) {
                            return timeShaft[row];
                        })
                    };
                },
                // 将一个或多个点历史值数据的转换成累积量数据
                // 若只传入一个点，则直接对该点进行前后差值计算，返回这个点对应的累积量的数据点
                // 若传入多个点，则先执行 SUM_POINT 操作得到合并点，再返回该合并点对应的累积量的数据点
                ACCUM_POINT: function () {
                    var points = Array.prototype.slice.apply(arguments);
                    var rs = {
                        data: [],
                        timeShaft: points[0].timeShaft
                    };

                    // 求和
                    if (points.length) {
                        points[0].data.forEach(function (row, i) {
                            var rowSum = 0;
                            points.forEach(function (p) {
                                rowSum += p.data[i];
                            });
                            rs.data.push(rowSum);
                        });
                    } else {
                        rs = points[0];
                    }
                    
                    // 求累积量
                    rs.data = rs.data.slice(0, rs.data.length-1).map(function (row, i) {
                        return rs.data[i+1] - row;
                    });
                    // 去除最后多的一组数据
                    rs.timeShaft.length = rs.timeShaft.length - 1;

                    return rs;
                }
            };

            function getCalcQueue(dpMap, name, deep) {
                var queue = [];
                var dp = dpMap[name];

                if (!dp) return [];

                deep = deep || 0;
                if (deep > 20) {
                    console.error('递归过深，可能出现了循环依赖，请进行检查！');
                    return [];
                }
                deep += 1;

                dp.forEach(function (row) {
                    queue = queue.concat(getCalcQueue(dpMap, row, deep));
                });
                queue.push(name);

                return queue;
            }

            // 开始进行变量计算
            function calc(info, dsMap, scope) {
                var dpMap = info.dependencies;
                // 以第一个元素为入口开始进行计算
                var start = Object.keys(dpMap)[0];
                var rs = {};

                loadQueue = {};
                Object.keys(dpMap).forEach(function (key) {
                    var calcQueue = getCalcQueue(dpMap, key);

                    calcQueue.forEach(function (name) {
                        if (loadQueue[name] === 'loaded') {
                            return;
                        }

                        // 这里需要注意 extend 操作时覆盖的顺序
                        rs[name] = parse(name, info.variables[name] + '', $.extend(false, scope, rs, dsMap) );
                        loadQueue[name] = 'loaded';
                    });
                });

                return rs;
            }

            function parse(name, codeStr, map) {
                var str = codeStr.replace(/<[%#](.+?)[%#]>/mg, function ($0, $1) {
                    return '_map["' + $1 + '"]';
                });

                // 如果不包含引用，则直接返回
                if (str === codeStr) {
                    return codeStr;
                }

                try {
                    return new Function('SUM', 'SUM_POINT', 'NONZERO_AVERAGE', 'AVERAGE', 'MAX', 'MIN', 'ACCUM_POINT', '_map', 'return ' + str)(
                        api['SUM'],
                        api['SUM_POINT'],
                        api['NONZERO_AVERAGE'],
                        api['AVERAGE'],
                        api['MAX'],
                        api['MIN'],
                        api['ACCUM_POINT'],
                        map
                    );
                } catch(e) {
                    Log.error(e);
                    return codeStr;
                }
            }

            function formatVariables(data) {
                var dsMap = {};
                var dependencies = {};

                if (data) {
                    Object.keys(data).forEach(function (key) {
                        var row = data[key];
                        var patternDs = /<%(.+?)%>/mg;
                        var patternTpl = /<#(.+?)#>/mg;
                        var match;
                        var str, idx, optionStr;

                        while ( match = patternDs.exec(row) ) {
                            str = match[1];
                            idx = str.indexOf(',');

                            if (idx === -1) {
                                // 默认
                                dsMap[str] = {};
                            } else {
                                optionStr = str.substring(idx);
                                dsMap[str] = (function (optionStr) {
                                    var arr = optionStr.split(',');
                                    var opt = {};

                                    arr.forEach(function (kv) {
                                        var kvArr = kv.split('=');
                                        if( kvArr.length === 1 ) {
                                            opt[kv] = 'true';
                                        } else {
                                            opt[kvArr[0]] = kvArr[1];
                                        }
                                    });

                                    return opt;
                                } (optionStr))
                            }
                        }

                        dependencies[key] = [];
                        while ( match = patternTpl.exec(row) ) {
                            dependencies[key].push(match[1]);
                        }
                    });
                }

                return {
                    dsMap: dsMap,
                    dependencies: dependencies
                };
            }

            function format(data) {
                var rs = [];

                data.forEach(function (row) {
                    var info = formatVariables(row.variables);
                    info.variables = row.variables;
                    info.promise = row.promise;
                    info.ins = row.ins;
                    rs.push(info);
                });

                return rs;
            }

            function getPeriodTime(row, timeS, timeE, map) {
                var timeStart = timeS;
                var timeEnd = timeE;
                var p = map[row];
                var dayMs = 24 * 60 * 60 * 1000;

                function add0(v) {
                    return (v < 10 ? '0' + v : v);
                }

                //设置默认timeEnd
                function defaultTimeEnd(y, m, d) {
                    var oldTime = (new Date(y,m-1,d)).getTime() - dayMs,
                        newTime = new Date(oldTime),
                        year = newTime.getFullYear(),
                        month = newTime.getMonth() + 1,
                        dat = newTime.getDate();
                    return (year + '-' + add0(month) + '-' + add0(dat) + ' 23:59:59');
                }

                if (p.period) {
                    var date = new Date(),
                        year = date.getFullYear(),
                        month = date.getMonth() + 1,
                        dat = date.getDate(),
                        hour, min, sec,
                        other = add0(dat)+' 00:00:00',
                        other2 = add0(dat)+' 23:59:59';
                    var reg = /^last(\d+)(days|months|years)$/gm;
                    var arr = reg.exec(p.period);
                    var count, type, oldTime, newTime;
                    var monthCount;
                    if (arr) {
                        count = Number.parseInt(arr[1]);
                        type = arr[2];
                        //"2016-08-01 00:00:00"格式
                        if (type === "days") {
                            timeStart = year + '-' + add0(month) + '-' + other;

                            if (count === 0) {
                                timeEnd = year + '-' + add0(month) + '-' + other2;
                            } else {
                                timeEnd = defaultTimeEnd(year, month, dat);
                            }

                            oldTime = (new Date(timeStart.replace(/-/g, "/"))).getTime() - dayMs * count;
                            newTime = new Date(oldTime);
                            year = newTime.getFullYear();
                            month = newTime.getMonth() + 1;
                            dat = newTime.getDate();
                            hour = newTime.getHours();
                            min = newTime.getMinutes();
                            sec = newTime.getSeconds();
                            other = add0(dat) + ' ' + add0(hour) + ':' + add0(min) + ':' + add0(sec);
                        }

                        if (type === "months") {

                            if (count === 0) {
                                timeEnd = year + '-' + add0(month) + '-' + add0(new Date(year, month-1, 0).getDate()) + ' 23:59:59';
                            } else {
                                timeEnd = defaultTimeEnd(year, month, 1);
                            }

                            other = "01 00:00:00";
                            monthCount = year * 12 + month - count;
                            month = monthCount % 12;
                            year = (monthCount - month) / 12;
                        }

                        if (type === "years") {

                            if (count === 0) {
                                timeEnd = defaultTimeEnd(year+1, 1, 1);
                            } else {
                                timeEnd = defaultTimeEnd(year, 1, 1);
                            }

                            month = 1;
                            other = "01 00:00:00";
                            year -= count; 
                        }
                        
                        timeStart = year + '-' + add0(month) + '-' + other;
                    }
                }
                return {
                    timeStart: timeStart,
                    timeEnd: timeEnd
                };
            }

            function getDelayTime(row, time, map) {
                var timeStart = time.timeStart;
                var timeEnd = time.timeEnd;
                var p = map[row];
                var milliSecond = 0;
                if (!p.delay) {
                    p['delay'] = 0;
                } else {
                    p.delay = Number(p.delay);
                    if (isNaN(p.delay)) {
                        Log.warn('there has one point gave an unsupported delay: ' + p.delay);
                        return;
                    }
                }
                switch (p.tf) {
                    case 'm5':
                        milliSecond = 300000;
                        break;
                    case 'h1':
                        milliSecond = 3600000;
                        break;
                    case 'd1':
                        milliSecond = 86400000;
                        break;
                }
                timeEnd = timeFormat(Date.parse(timeEnd.replace(/-/g, '/')) + milliSecond*p.delay);
                return {
                    timeStart: timeStart,
                    timeEnd: timeEnd
                }
            }

            function formatParamsMap(map, reportOptions) {
                var listMap = {
                    'm5': [],
                    'h1': [],
                    'd1': []
                };
                var defaultTF = reportOptions['timeFormat'];
                var timeStart = reportOptions['startTime'];
                var timeEnd = reportOptions['endTime'];
                //数据顺序
                var listOrder = [];

                Object.keys(map).forEach(function (row) {
                    var p = map[row];
                    if (!p.tf) {
                        p['tf'] = defaultTF;
                    }
                    if (listMap[p.tf]) {
                        var id = row;
                        if (id.indexOf(',') > -1) {
                            id = id.substring(0, id.indexOf(','));
                        }
                        var time = getPeriodTime(row, timeStart, timeEnd, map);
                        time = getDelayTime(row, time, map);
                        listMap[p.tf].push({
                            id: id,
                            timeStart: time.timeStart,
                            timeEnd: time.timeEnd,
                            row: row
                        });
                    }
                    // 不存在的类型直接过滤掉，并给予提示
                    else {
                        Log.warn('there has one point gave an unsupported time format: ' + p.tf);
                    }
                });

                return {
                    listMap: listMap,
                    list: (function () {
                        var list = [];
                        Object.keys(listMap).forEach(function (tf) {
                            var ids = listMap[tf];
                            if (ids.length) {
                                var order = {};
                                var result = (function (arr) {
                                    var n = {};
                                    for (var i = 0; i < arr.length; i++) {
                                        if (!n[arr[i].timeStart + '+' + arr[i].timeEnd]) {
                                            n[arr[i].timeStart + '+' + arr[i].timeEnd] = [arr[i].id];
                                            order[arr[i].timeStart + '+' + arr[i].timeEnd] = [arr[i].row];
                                        } else {
                                            n[arr[i].timeStart + '+' + arr[i].timeEnd].push(arr[i].id);
                                            order[arr[i].timeStart + '+' + arr[i].timeEnd].push(arr[i].row);
                                        }
                                    }
                                    return n;
                                }(ids));
                                for (var k in result) {
                                    var timeArr = k.split('+');
                                    list.push({
                                        dsItemIds: result[k],
                                        timeStart: timeArr[0],
                                        timeEnd: timeArr[1],
                                        timeFormat: tf
                                    });
                                    listOrder.push(order[k]);
                                }
                            }
                        });

                        return list;
                    }()),
                    listOrder:listOrder
                };
            }

            return function (options) {
                var _this = this;
                var infoList = format(this.variableProcessTasks);
                var dsDefineMap = {}, variableList = [];
                var params = [];
                var promise = $.Deferred();

                options = options || {};

                infoList.forEach(function (row) {
                    dsDefineMap = $.extend(false, {}, dsDefineMap, row.dsMap);
                });

                if (!Object.keys(dsDefineMap).length) {
                    // 转换成变量值
                    variableList = infoList.map(function (info) {
                        return calc(info, {}, info.ins.screen.variables || {});
                    });
                    // 执行无需处理变量的逻辑
                    promise.resolve(-1);
                } else {
                    params = formatParamsMap(dsDefineMap, options.reportOptions || this.getReportOptions());
                    $.ajax({
                        type:'post',
                        url: ((AppConfig.isMobile && AppConfig.host && (typeof cordova != 'undefined'))?AppConfig.host:'') + '/analysis/startWorkspaceDataGenHistogramMulti',
                        data: JSON.stringify(params.list),
                        contentType: 'application/json'
                    }).then(function (rs) {
                        
                        if (!rs.length) {
                            Log.warn('get no data for the report.');
                            promise.resolve(-1);
                            return;
                        } else {
                            var dsMap = {};
                            var order = params.list.map(function (row) {
                                return row.timeFormat;
                            });

                            var listOrder = [], data = [];
                            //发送的数据=>有序数组
                            params.listOrder.forEach(function (it) {
                                listOrder = listOrder.concat(it);
                            });
                            //接收的数据=>有序数组
                            rs.forEach(function (it) {
                                var time = it.timeShaft;
                                it.list.forEach(function (item) {
                                    data.push({data:item.data,timeShaft:time});
                                });
                            });
                            //按顺序对接
                            listOrder.forEach(function (it,i) {
                                dsMap[it] = data[i] ? data[i] : {data:[],timeShaft:[]};
                            });

                            // 转换成变量值
                            infoList.map(function (info) {
                                var map = {}, calcRs;
                                Object.keys(dsMap).forEach(function (ds) {
                                    map[ds] = dsMap[ds];
                                });
                                calcRs = calc(info, map, info.ins.screen.variables || {});
                                info.promise.resolve(calcRs);
                            });
                            // 执行完成变量处理的逻辑
                            promise.resolve();
                        }
                    }, function () {
                        promise.resolve(-1);
                    }).always(function () {
                        _this.variableProcessTasks.length = 0;
                        params.list = [];
                    });
                }

                return promise.done(function (status) {
                    var item, i;
                    // 未执行查询操作
                    if (status === -1) {
                        i = 0;
                        while( item = _this.variableProcessTasks.shift() ) {
                            item.promise.resolve(variableList[i]);
                            i++;
                        }
                    }
                });
            };

        } ());

    }.call(VariableProcessMixin.prototype);

    exports.VariableProcessMixin = VariableProcessMixin;
} (
    namespace('factory.report.mixins')
));
;(function (exports) {

    function Component() {

    }

    +function () {

        this.onRenderComplete = function () {
            throw new Error('onRenderComplete 方法需要实现才能使用');
        };

        /**
         * 控件的渲染方法
         */
        this.render = function () {
            throw new Error('render 方法需要实现才能使用');
        };

        /**
         * 控件的销毁方法
         */
        this.destroy = function () {
            throw new Error('destroy 方法需要实现才能使用');
        };

    }.call(Component.prototype);

    exports.Component = Component;

} ( namespace('factory.report.components') ));

;(function (exports, SuperClass, DateUtil) {

    function Base(parent, entity, root, idx) {
        SuperClass.apply(this, arguments);

        this.screen = parent;
        this.entity = entity;
        this.entity.id = this.entity.id || ObjectId();

        this.wrap = null;
        this.container = null;
        this.spinner = null;

        this.variables = null;

        this.root = root || this;

        this.initEntity();

        this.init(idx);
    }

    Base.prototype = Object.create(SuperClass.prototype);
    Base.prototype.constructor = Base;

    +function () {

        this.UNIT_WIDTH = 100/12;

        this.UNIT_HEIGHT = 60;

        this.TPL_PARAMS_PATTERN = /<#\s*(\w*?)\s*#>/mg;

        this.TPL_PARAMS_IN_VARIABLES_PATTERN = /<@\s*(\w*?)\s*@>/mg;
        
        /** 
         * 用于指示模态框的类型，设置此属性的意义是可以让控件使用其他控件的配置框，而不需要重新定义一个类
         * 查找控件的模态框，优先会去查找有没有 this.entity.modal.type + 'ConfigModal' 的类
         * 如果没有，再会去查找有没有 this.configModalType + 'ConfigModal' 的类
         */
        this.configModalType = undefined;

        // 初始化 entity 数据结构
        this.initEntity = function () {};

        /**
         * @override
         */
        this.render = function () {};

        /**
         * 初始化控件容器
         * @param  {number} insertIdx 容器待插入的位置下标
         */
        this.init = function (insertIdx) {
            var _this = this;
            var divWrap, divParent;

            this.wrap = divWrap = document.createElement('div');
            divWrap.id = 'reportContainer_' + this.entity.id;
            divWrap.className = 'report-container-wrap';
            if (this.optionTemplate.className) {
                divWrap.classList.add.apply(divWrap.classList, this.optionTemplate.className.split(' '));
            }

            divParent = document.createElement('div');
            divParent.classList.add('report-container');
            
            divWrap.appendChild(divParent);

            if (typeof insertIdx === 'undefined') {
                this.screen.container.appendChild(divWrap);
            }
            // 插入到指定的位置下标
            else{
                this.screen.container.insertBefore(divWrap, this.screen.container.childNodes[insertIdx]);
            }

            // 如果是在动态报表块中，则不添加任何配置按钮
            if (AppConfig.isReportConifgMode) {
                // 初始化头部
                this.initHeader();
                if ( !this.isReadonly() ) {
                    // 初始化工具
                    this.initTools();
                    // 初始化大小调节器
                    this.initResizer();
                }
            }

            this.container = document.createElement('div');
            this.container.className = 'report-content clearfix';
            divParent.appendChild(this.container);

            this.resize();

            return this;
        };

        /** 初始化控件头部 */
        this.initHeader = function () {
            var divWrap = this.wrap;
            var divParent = divWrap.querySelector('.report-container');
            // 添加头部
            var divTop, divHeader;

            divTop = document.createElement('div');
            divTop.classList.add('report-top-box');
            divTop.classList.add('clearfix');
            divParent.appendChild(divTop);

            divHeader = document.createElement('div');
            divHeader.className = 'report-header';
            divHeader.innerHTML = eval(this.optionTemplate.name);
            divTop.appendChild(divHeader);


            this.initTitle();
        };

        this.initTools = function (tools) {
            var _this = this;
            // 控件最外层包裹层
            var divWrap;
            // 控件最外层
            var divTop;
            //按钮容器
            var divToolWrap;
            // 配置按钮
            var btn, tool, len;

            divWrap = this.wrap;
            divTop = divWrap.querySelector('.report-top-box');
            divToolWrap = document.createElement('div');
            divToolWrap.className = 'report-tool-wrap';

            // 控件默认的按钮
            tools = tools || ['variable', 'configure', 'remove'];

            // 复制数组
            tools = tools.concat();
            len = tools.length;

            while ( tool = tools.shift() ) {
                switch (tool) {
                    // 变量声明
                    case 'variable':
                        btn = document.createElement('a');
                        btn.className = 'report-tool-btn';
                        btn.title = I18n.resource.report.VAR_DECLARATION;
                        btn.href = 'javascript:;';
                        btn.innerHTML = '<span class="glyphicon glyphicon-th-large"></span>';
                        divToolWrap.appendChild(btn);
                        btn.onclick = function(e) {
                            DeclareVariablesModal.show({
                                js: _this.getDeclareVariables()
                            }, function (code) {
                                //var rs = '';
                                //try {
                                //    rs = new Function('return ' + code.js)();
                                //} catch(e) {
                                //    alert(I18n.resource.report.VAR_DECLARATION_INFO);
                                //    rs = code.js;
                                //}
                                //if(Object.prototype.toString.call(rs).slice() === "[object Object]"){
                                //    _this.entity.modal.variables = rs;
                                //}else{
                                //    _this.setDeclareVariables(rs,0);
                                //}
                                _this.render(true);
                            }, ['js']);
                        };
                        break;
                    // 配置按钮
                    case 'configure':
                        btn = document.createElement('a');
                        btn.className = 'report-tool-btn ';
                        btn.title = I18n.resource.report.chapterConfig.CONFIG;
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
                        btn.title = I18n.resource.report.REMOVE_BTN;
                        btn.innerHTML = '<span class="glyphicon glyphicon-remove"></span>';
                        divToolWrap.appendChild(btn);
                        btn.onclick = function(e){
                            confirm(I18n.resource.report.CONFIRM_DELETE, function(){
                                if (_this.chart) _this.chart.clear();
                                _this.screen.remove(_this.entity.id);
                                $(_this.wrap).remove();
                            });
                        };
                        break;
                    case 'export':
                        btn = document.createElement('a');
                        btn.className = 'report-tool-btn ';
                        btn.title = I18n.resource.report.EXPORT_BTN;
                        btn.innerHTML = '<span class="glyphicon glyphicon-export"></span>';
                        divToolWrap.appendChild(btn);
                        btn.onclick = function() {
                            var name;
                            if (name = prompt(I18n.resource.report.ENTER_TEMPLATE_NAME)) {
                                typeof _this.export === 'function' && _this.export(name).done(function () {
                                    alert(I18n.resource.report.EXPORT_SUCCESS);
                                }).fail(function () {
                                    alert(I18n.resource.report.EXPORT_ERROR);
                                });
                            } else {
                                alert(I18n.resource.report.ERROR_TEMPLATE_NAME);
                            }
                        };
                        break;
                }
            }
            if (len > 0) {
                //divParent.appendChild(divToolWrap);
                divTop.appendChild(divToolWrap);
            }
        };

        this.getDeclareVariables = function () {
            this.entity.modal.variables = this.entity.modal.variables || {};
            return {
                title: this.entity.modal.type,
                val: this.entity.modal.variables
            };
        };

        this.initResizer = function () {
            var _this = this;
            var divWrap = this.wrap;
            var $divTop = $(divWrap.querySelector('.report-top-box'));
            var iptResizerCol, iptResizerRow;
            var options = this.optionTemplate;
            this.entity.spanC = this.entity.spanC || options.minWidth;
            this.entity.spanR = this.entity.spanR || options.minHeight;

            // 新增宽高的编辑
            var $resizers = $( ('<div class="btn-group number-resizer-wrap">\
                <label class="control-label">'+ I18n.resource.report.LABEL_WIDTH +':</label><input type="number" class="btn btn-default number-resizer-col" value="{width}" min="{minWidth}" max="{maxWidth}">\
                <label class="control-label">'+ I18n.resource.report.LABEL_HEIGHT +':</label><input type="number" class="btn btn-default number-resizer-row" value="{height}" min="{minHeight}" max="{maxHeight}">\
            </div>').formatEL({
                width: this.entity.spanC,
                height: this.entity.spanR,
                minWidth: options.minWidth,
                minHeight: options.minHeight,
                maxWidth: options.maxWidth,
                maxHeight: options.maxHeight
            })).appendTo($divTop);

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
             _this.divResizeByMouseInit();
        };
        this.divResizeByMouseInit = function (){
            var _this = this;
            var divContainer = $(this.wrap).get(0);
            var resizeOnRight = document.createElement('div');
            resizeOnRight.className = 'resizeOnRight';
            divContainer.appendChild(resizeOnRight);
            var resizeOnBottom = document.createElement('div');
            resizeOnBottom.className = 'resizeOnBottom';
            divContainer.appendChild(resizeOnBottom);
            var resizeOnCorner = document.createElement('div');
            resizeOnCorner.className = 'resizeOnCorner';
            divContainer.appendChild(resizeOnCorner);
            var mouseStart = {};
            var containerStart = {};
            var w, h,tempSpanR,tempSpanC;
            resizeOnBottom.onmousedown = function(e){
                e.stopPropagation();
                var $reportWrap = $('#reportWrap');
                var oEvent = e || event;
                mouseStart.y = oEvent.clientY;
                containerStart.h = $(divContainer).height();
                doResizeOnType(e,'bottom');
                $reportWrap.off('mousemove').on('mousemove',function(e){
                    doResizeOnType(e,'bottom');
                });
                $reportWrap.off('mouseup').on('mouseup',function(e){
                    stopResizeOnType(e,'bottom');
                    $reportWrap.off('mousemove mouseup');
                    $(resizeOnBottom).off('mousedown');
                });
            };
            resizeOnRight.onmousedown = function(e){
                e.stopPropagation();
                var $panels = $('#panels');
                var oEvent = e || event;
                mouseStart.x = oEvent.clientX;
                containerStart.w = $(divContainer).width();
                var minSpanC;
                if(_this.entity.modal.type === "Table"){
                    minSpanC = 6;
                }else{
                    minSpanC = 3;
                }
                containerStart.minW = $(divContainer).parent().width()*(minSpanC*_this.UNIT_WIDTH/100)-parseInt($(divContainer).css('padding-left'))-parseInt($(divContainer).css('padding-right'));
                doResizeOnType(e,'right');
                $panels.off('mousemove').on('mousemove',function(e){
                    doResizeOnType(e,'right');
                });
                $panels.off('mouseup').on('mouseup',function(e){
                    stopResizeOnType(e,'right');
                    $panels.off('mousemove mouseup');
                    $(resizeOnRight).off('mousedown');
                });
            };
            resizeOnCorner.onmousedown = function(e){
                e.stopPropagation();
                var $panels = $('#panels');
                var oEvent = e || event;
                mouseStart.x = oEvent.clientX;
                mouseStart.y = oEvent.clientY;
                containerStart.w = $(divContainer).width();
                containerStart.h = $(divContainer).height();
                doResizeOnType(e,'corner');
                $panels.off('mousemove').on('mousemove',function(e){
                    doResizeOnType(e,'corner');
                });
                $panels.off('mouseup').on('mouseup',function(e){
                    stopResizeOnType(e,'corner');
                    $panels.off('mousemove mouseup');
                    $(resizeOnCorner).off('mousedown');
                });
            };
            function doResizeOnType(e,type){
                var oEvent = e || event;
                var differenceX,differenceY;
                switch (type){
                    case 'bottom':
                        //if(oEvent.clientY - containerStart.h < $(divContainer).offset().top){
                        //    return;
                        //}
                        differenceY = oEvent.clientY - mouseStart.y;
                        h = differenceY + containerStart.h;
                        divContainer.style.height = h + "px";
                        break;
                    case 'right':
                        if((oEvent.clientX - containerStart.minW) < ($(divContainer).offset().left+parseInt($(divContainer).css('padding-left')))){
                            return;
                        }
                        differenceX = oEvent.clientX - mouseStart.x;
                        w = differenceX + containerStart.w;
                        $(divContainer).width(w);
                        break;
                    case 'corner':
                        differenceX = oEvent.clientX - mouseStart.x;
                        w = differenceX + containerStart.w;
                        $(divContainer).width(w);
                        differenceY = oEvent.clientY - mouseStart.y;
                        h = differenceY + containerStart.h;
                        divContainer.style.height = h + "px";
                        break;
                }
            }
            function stopResizeOnType (e,type){
                var oEvent = e || event;
                var differenceX,differenceY;
                switch (type) {
                    case 'bottom':
                        differenceY = oEvent.clientY - mouseStart.y;
                        h = differenceY + containerStart.h;
                        tempSpanR = Math.round(h/_this.UNIT_HEIGHT);
                        $(divContainer).find('.number-resizer-row').val(tempSpanR).trigger('change');
                        break;
                    case 'right':
                        differenceX = oEvent.clientX - mouseStart.x;
                        w = differenceX + containerStart.w;
                        tempSpanC = Math.round(w*100/($(divContainer).parent().width()*_this.UNIT_WIDTH));
                        $(divContainer).find('.number-resizer-col').val(tempSpanC).trigger('change');
                        break;
                    case 'corner':
                        differenceX = oEvent.clientX - mouseStart.x;
                        w = differenceX + containerStart.w;
                        tempSpanC = Math.round(w*100/($(divContainer).parent().width()*_this.UNIT_WIDTH));
                        differenceY = oEvent.clientY - mouseStart.y;
                        h = differenceY + containerStart.h;
                        tempSpanR = Math.round(h/_this.UNIT_HEIGHT);
                        $(divContainer).find('.number-resizer-row').val(tempSpanR).trigger('change');
                        $(divContainer).find('.number-resizer-col').val(tempSpanC).trigger('change');
                        break;
                }
            }
        };

        this.initTitle = function () {};

        this.showConfigModal = function (modal) {
            var domWindows = document.querySelector('#windowRightPanel');

            if (!modal) {
                modal = exports[this.entity.modal.type + 'ConfigModal'];
                if (!modal && this.configModalType) {
                    modal = exports[this.configModalType + 'ConfigModal'];
                }
            }

            if (!modal) {
                alert('no config modal found!');
                return;
            }

            modal.setOptions({
                modalIns: this,
                container: 'reportWrap'
            });

            modal.show().done(function () {
                // 设置位置
                modal.$modal.css({
                    top: domWindows.scrollTop + 'px',
                    bottom: -domWindows.scrollTop + 'px'
                });
            });
        };

        this.resize = function () {
            $(this.wrap).css({
                width: this.entity.spanC * this.UNIT_WIDTH + '%',
                height: this.entity.spanR * this.UNIT_HEIGHT + 'px'
            });
        };

        // 获取模板参数
        this.getTplParams = function () {
            var str = (function () {
                var variables = this.entity.modal.variables;
                var str = '';
                if (!variables) {
                    return '';
                }
                Object.keys(variables).forEach(function (k) {
                    str += variables[k];
                });

                return str;
            }.call(this));
            var pattern = this.TPL_PARAMS_IN_VARIABLES_PATTERN;
            var match = null;
            var params = [];

            while( match = pattern.exec(str) ) {
                params.push(match[1]);
            }

            return params;
        };

        // 从本身开始，逐级向上级匹配，返回匹配到的某个控件
        this.closest = function (cond) {
            var parent = this;
            var tmp;

            while(parent && parent !== this.root) {
                // 判断类型
                if (cond['type']) {
                    tmp = Object.prototype.toString.call(cond['type']) === '[object Array]' ? 
                        cond['type'] : [cond['type']];
                    if ( tmp.indexOf(parent.entity.modal.type) > -1 ) {
                        return parent;
                    }
                }
                parent = parent.screen;
            }

            return null;
        };

        // 获取指定容器的模板参数值
        this.getTplParamsValue = function () {
            var tplParams = (this.closest({type: 'ChapterContainer'}) || this).entity.modal.option.tplParams;
            var variables = this.variables;

            return $.extend(true, {}, tplParams, variables);
        };

        // 应用模板参数
        this.applyTplParams = function (params) {
            this.entity.modal.option.tplParams = params;
        };

        /**
         * 获取报表全局配置的时间
         * 
         * @returns 不同的时间周期所代表的日期字符串;如果是在编辑模式且是不支持的时间周期的话，返回null
         */
        this.getReportDate = function () {
            var options = this.root.entity.modal.option;
            var date = this.root.screen.reportDate;
            var now, weekDay, year, month;
            var tmp;

            if (!date) {
                now = new Date();
                switch(options.period || 'day') {
                    case 'day':
                        date = new Date( (Math.floor(now.valueOf()/86400000) - 1) * 86400000 ).format('yyyy-MM-dd');
                        break;
                    case 'week':
                        weekDay = now.getDay() === 0 ? 13 : 7 + (now.getDay()-1);
                        date =  new Date( (Math.floor(now.valueOf()/86400000) - weekDay) * 86400000 ).format('yyyy-MM-dd');
                        break;
                    case 'month':
                        year = now.getFullYear();
                        month = now.getMonth();
                        tmp = year * 12 + month - 1;
                        year = parseInt( tmp / 12 );
                        month = tmp % 12 + 1;
                        month = month < 10 ? ('0' + month) : month;
                        date = [year, month].join('-');
                        break;
                    case 'year':
                        year = now.getFullYear();
                        date =  year - 1 + '';
                        break;
                    default:
                        break;
                }
            }
            return date;
        };
        
        /**
         * 获取报表的周期间隔，缺省值为 'day'
         * 'day' - 日报
         * 'week' - 周报
         * 'month' - 月报
         * 'year' - 年报
         * 
         * @returns 'day'、'week'、'month'、'year'
         */
        this.getReportPeriod = function () {
            return this.root.entity.modal.option.period || 'day';
        };

        // 获取报表全局配置
        this.getReportOptions = function () {
            var options = this.root.entity.modal.option;
            var periodStartTime = typeof options.periodStartTime !== 'undefined' ? options.periodStartTime : 0;
            var params = {};
            var dStart, dEnd, month, year;

            dStart = new Date(this.getReportDate());
            // 处理时间周期的偏移量
            switch(options.period || 'day') {
                // 天
                case 'day':
                    // 偏移单位为：小时
                    dStart = new Date(dStart.valueOf() + (periodStartTime === 0 ? periodStartTime : periodStartTime- 24) * 3600000 );
                    dEnd = new Date(dStart.valueOf() + 86400000);
                    params['timeFormat'] = 'm5';
                    break;
                // 周
                case 'week':
                    dStart = new Date(dStart.valueOf() + (periodStartTime === 0 ? periodStartTime : periodStartTime - 7) * 86400000);
                    dEnd = new Date(dStart.valueOf() + 86400000 * 7 );
                    params['timeFormat'] = 'd1';
                    break;
                // 月
                case 'month':
                    // 偏移单位为：天
                    if (periodStartTime !== 0) {
                        year = dStart.getFullYear();
                        month = DateUtil.getLastMonth(dStart.getMonth() + 1);
                        if (month === 12) {
                            year -= 1;
                        }
                        dStart = [year, month, '01'].join('-').toDate();
                    }
                    dStart = new Date(dStart.valueOf() + periodStartTime * 86400000);
                    dEnd = new Date(dStart.valueOf() + DateUtil.daysInMonth(dStart) * 86400000);
                    params['timeFormat'] = 'd1';
                    break;
                // 年
                case 'year':
                    // 偏移单位为：月
                    year = dStart.getFullYear();
                    if (periodStartTime !== 0) {
                        year -= 1;
                    }
                    month = dStart.getMonth() + periodStartTime + 1;
                    month = month < 10 ? ('0' + month) : month;

                    dStart = new Date([year, month].join('-'));
                    dEnd = new Date(dStart.valueOf() + (DateUtil.isLeapYear(year) ? 366 : 365) * 86400000);
                    params['timeFormat'] = 'd1';
                    break;
            }
            // 处理时区
            dStart = new Date(dStart.valueOf() + dStart.getTimezoneOffset()*60000);
            // 最后减去 1s 是为了回到上一天，否则查询结果会多一天
            dEnd = new Date(dEnd.valueOf() + dEnd.getTimezoneOffset()*60000 - 1000);
            params['startTime'] = dStart.format('yyyy-MM-dd HH:mm:ss');
            params['endTime'] = dEnd.format('yyyy-MM-dd HH:mm:ss');

            return params;
        };

        // 注册一个处理变量的任务
        this.registVariableProcessTask = function (variables) {
            return this.root.registTask(variables, this).then(function (rs) {
                this.variables = this.createObjectWithChain(rs);
            }.bind(this));
        };

        // 将变量定义字符串中的模板参数用真实的参数替换掉
        this._getTplParamsAttachedVariables = function (variables) {
            var params = this.getTplParamsValue();
            var pattern = this.TPL_PARAMS_IN_VARIABLES_PATTERN;
            var obj = {};

            if (!params || !variables) {
                return variables;
            }

            Object.keys(variables).forEach(function (k) {
                var row = variables[k];
                obj[k] = row.replace(pattern, function ($0, $1) {
                    // 如果不是云点
                    return params[$1] || '';
                });
            });
            return obj;
        };

        this.createObjectWithChain = (function () {
            function PropFunction(props) {
                var _this = this;
                for (var p in props) {
                    // 这里需要去访问继承链上的属性，所以不用 hasOwnProperty
                     _this[p] = props[p];
                }
            }

            return function (props) {
                PropFunction.prototype = this.screen.variables || {};
                return new PropFunction(props);
            }
        } ());

        // 判断某个控件是否在某种类型的容器内
        // 示例：判断某个控件是否在章节容器中 - isIn('ChapterContainer')
        this.isIn = function (type) {
            var parent, find;

            if (typeof type !== 'string') {
                return false;
            }

            if (this === this.root) {
                return false;
            }

            find = false;
            parent = this.screen;

            while (parent !== null) {
                if (parent.optionTemplate.type === type) {
                    find = true;
                    break;
                }
                if (parent === this.root) {
                    return false;
                }
                parent = parent.screen;
            }

            return find;
        };

        /**
         * 将当前控件导出成模板
         * @param {name} 导出模板的名称
         * @return
         */
        this.export = function (name) {
            alert(I18n.resource.report.NOT_SUPPORT_EXPORT);
        };

        /**
         * 指示当前是否有章节号，默认为有
         * @return {Boolean} true 为有，false为无
         */
        this.hasChapterNo = function () {
            return true;
        };

        /**
         * 指示当前控件是否只读
         */
        this.isReadonly = function () {
            // 根据父容器的 isChildrenReadonly 方法进行判断
            if (this === this.root) {
                return false;
            }
            return this.screen.isChildrenReadonly();
        }

        this.destroy = function () {};

    }.call(Base.prototype);

    exports.Base = Base;

} ( namespace('factory.report.components'),
    namespace('factory.report.components.Component'),
    DateUtil ));
;(function (exports, SuperClass, VariableProcessMixin) {

    function Container() {
        this.children = [];

        SuperClass.apply(this, arguments);

        this.entity.modal.option = this.entity.modal.option || {};
        this.entity.modal.option.layouts = this.entity.modal.option.layouts || [];
    }

    Container.prototype = Object.create(SuperClass.prototype);
    Container.prototype.constructor = Container;

    +function () {

        this.optionTemplate = {
            group: '基本',
            name: 'I18n.resource.report.REPORT_RIGHT_NAME',//I18n.resource.report.REPORT_RIGHT_NAME
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
        this.init = function () {
            SuperClass.prototype.init.apply(this, arguments);
            // 初始化 IOC
            this.initIoc();
            
            this.initDropEvents();            
        };

        /** 初始化拖拽事件 */
        this.initDropEvents = function () {
            var _this = this;
            var container = this.wrap;
            // 初始化拖拽添加 modal 的代码
            container.ondragenter = function (e) {
                e.preventDefault();
                e.stopPropagation();
                var tooltip = document.createElement('div');
                tooltip.id = 'divTooltip';
                document.body.appendChild(tooltip);
            };

            container.ondragover = function (e) {
                e.preventDefault();
                e.stopPropagation();
                var $divTooltip = $('#divTooltip');
                if(_this.root.wrap === this){
                    $divTooltip.html('报表');
                }else{
                    $divTooltip.html('章节' + _this.chapterNo);
                }
                if(!$(_this.wrap).children().hasClass('borderHover')){
                    $(_this.wrap).children().addClass('borderHover');
                }
                $divTooltip.css('left', e.clientX - 1.5*$('.badge').width());
                $divTooltip.css('top', e.clientY - $('#header').height());
            };

            container.ondragleave = function (e) {
                e.preventDefault();
                e.stopPropagation();
                $('#divTooltip').remove();
                if($(_this.wrap).children().hasClass('borderHover')){
                    $(_this.wrap).children().removeClass('borderHover');
                }
            };

            container.ondrop = function (e) {
                $('#divTooltip').remove();
                if($(_this.wrap).children().hasClass('borderHover')){
                    $(_this.wrap).children().removeClass('borderHover');
                }
                var type = e.dataTransfer.getData('type');
                e.stopPropagation();

                var screen = $(_this.root.wrap);//$('#reportWrap').children('.report-container-wrap');
                var currentY = e.clientY;
                var currentX = e.clientX;
                // 判断是否 drop 在了某个控件上
                // 如果是，则在该控件里面插入新控件
                // 如果不是，则保持插入到鼠标的位置
                var insertIndex = _this.targetDom(screen,currentX,currentY);

                // 非模板
                if (type !== 'template') {
                    _this.add({
                        modal: {
                            type: type,
                            option: {}
                        }
                    },insertIndex);
                }
                // 模板
                else {
                    Spinner.spin($(_this.root.wrap)[0]);
                    WebAPI.post('/factory/material/getByIds', {
                        ids: [e.dataTransfer.getData('id')]
                    }).done(function (rs) {
                        var data = _this.updateTemplateId(rs[0]);
                        _this.addFromTemplate(data, insertIndex);
                        Spinner.stop();
                    });
                }
            };
        };
        this.targetDom = function($dom,currentX,currentY) {
            if(!$dom || $dom.length === 0) return;//drop 在了某个控件上
            var $domPaddingTop = parseInt($dom.css('padding-top'));
            var $domPaddingBottom = parseInt($dom.css('padding-bottom'));
            var $domPaddingLeft = parseInt($dom.css('padding-left'));
            var $domPaddingRight = parseInt($dom.css('padding-right'));
            var $domY = $dom.offset().top;
            var $domX = $dom.offset().left + $domPaddingLeft;
            var $domPaddingY = $domPaddingTop + $domPaddingBottom;
            var $domPaddingX = $domPaddingLeft + $domPaddingRight;
            if($domY < currentY){//竖向递归
                if(($domY + $dom.height() - $domPaddingY) > currentY){
                    if($domX < currentX){//横向递归
                        if(($domX + $dom.width() - $domPaddingX) > currentX){
                            return this.targetDom($dom.find('.report-content').eq(0).children().eq(0),currentX,currentY);
                        }else{
                            return this.targetDom($dom.next().eq(0),currentX,currentY);
                        }
                    }else{
                        return $dom.index();
                    }
                }else{
                    return this.targetDom($dom.next().eq(0),currentX,currentY);
                }
            }else{
                return $dom.index();
            }
        };
        this.updateTemplateId = (function () {
            function replaceId (templateContent){
                if(templateContent.id){
                    templateContent.id =  ObjectId();
                }
                var childrenLayout = templateContent.modal.option.layouts;
                if(childrenLayout && childrenLayout.length > 0){
                    childrenLayout.forEach(function(row){
                        replaceId(row);
                    })
                }
            }
            return function  (data) {
                var templateContent = data.content.layout;
                replaceId(templateContent);
                return templateContent;
            }
        }());
        this.initIoc = function() {
            this.factoryIoC = new FactoryIoC('report');
        };

        /* override */
        this.initResizer = function () {};

        this.initTools = function (tools) {
            tools = tools || ['variable'];
            SuperClass.prototype.initTools.call(this, tools);
        };

        this.add = function (params,idx) {
            var modalClass = this.factoryIoC.getModel(params.modal.type);
            var options = modalClass.prototype.optionTemplate;
            var ins;
            var insertIndex = idx;
            idx = typeof idx === 'undefined' ? this.children.length : idx;

            params.spanC = params.spanC || options.spanC || options.minWidth;
            params.spanR = params.spanR || options.spanR || options.minHeight;
            ins = new modalClass(this, params, this.root,insertIndex);

            this.children.splice(idx, 0, ins);
            this.entity.modal.option.layouts.splice(idx, 0, ins.entity);

            ins.render(true);

            // 如果新增的元素是章节，则更新章节编号和汇总
            if (params.modal.type === 'ChapterContainer') {
                this.refreshTitle(this.chapterNo);
                this.root.refreshSummary();
            }

            return ins;
        };

        // 从模板添加控件
        this.addFromTemplate = function (params, idx) {
            var ins = this.add(params, idx);
            var tplParams = ins.getTplParams();

            if (tplParams.length) {
                ins.showConfigModal(exports.ReportTplParamsConfigModal);
            }
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
                this.root.refreshSummary();
                this.entity.modal.option.layouts.splice(idx, 1);
            }

        };

        this.initLayout = function (layouts) {
            layouts = layouts || this.entity.modal.option.layouts;

            if (!layouts || !layouts.length) return;

            try {
                layouts.forEach(function (layout) {
                    var modelClass, ins;
                    var chapterDisplay;
                    var _api;

                    if (!layout.modal.type) { return; }

                    modelClass = this.factoryIoC.getModel(layout.modal.type);
                    if(!modelClass) return;
                    ins = new modelClass(this, layout, this.root);
                    this.children.push(ins);
                    ins.render();

                }.bind(this));
            } catch (e) {
                Log.error(e);
            }
        };

        /** @override */
        this.resize = function () {
            this.container.parentNode.style.height = 'auto';
            this.children.forEach(function (row) {
                row.resize();
            });
        };

        this.refreshTitle = function (chapterNo, isHideNo) {
            // 更新 title
            var containerChildren = [], i = 0;

            this.chapterNo = chapterNo = chapterNo || '';

            containerChildren = this.children.filter(function (row) {
                return row instanceof exports.Container;
            });

            chapterNo = chapterNo ? (chapterNo + '.') : chapterNo;
            containerChildren.forEach(function (row) {
                var num;
                if (row.hasChapterNo()) {
                    num = row.refreshTitle(chapterNo + (i+1), isHideNo);
                } else {
                    num = row.refreshTitle(chapterNo, isHideNo);
                }
                if (num) {
                    i = i+num;
                } else {
                    i = i+1;
                }
            });
        };

        this.refreshSummary = function () {
            var summary = this.getSummary();
            // 复制一遍数组，不对原数据进行操作
            var list = this.children.concat();
            var row;

            while( row = list.shift() ) {
                list = list.concat(row.children || []);
                if (row instanceof exports.Summary) {
                    row.refreshSummary(summary);
                }
            }
        };

        this.getSummary = function () {
            var summary = [];

            this.children.forEach(function (row) {
                if (row instanceof exports.ChapterContainer || 
                    row instanceof exports.Block) {
                    summary = summary.concat( row.getSummary() );
                }
            });
            return summary;
        };
        
        /** @override */
        // 返回值格式： [param1, param2, param3, ...]
        this.getTplParams = function () {
            var params = SuperClass.prototype.getTplParams.call(this);
            var tplParams = this.entity.modal.option.tplParams || {};

            this.children.forEach(function (row) {
                params = params.concat( row.getTplParams() );
            });

            // 参数去重
            params = params.sort().filter(function (row, pos, arr) {
                return !pos || row != arr[pos - 1];
            });

            // 参数值的还原
            // 目前只有容器类控件可以进行参数设置，接口的调用最终都会在这里汇合
            // 所以在这里进行一次参数值还原即可
            params = params.map(function (row) {
                return {
                    name: row,
                    value: tplParams[row] || undefined
                };
            });
            return params;
        };
        this.getDeclareVariables = function () {
            this.entity.modal.variables = this.entity.modal.variables || {};
            var v;
            if(this.entity.modal.type.indexOf('Block')>-1){
                v = [{
                    title: '模块',
                    val: this.entity.modal.variables
                }];
            }else{
                v = [{
                    title: ('章节'+this.chapterNo||'') || '' + (this.entity.modal.option.chapterTitle || '报表'),
                    val: this.entity.modal.variables
                }];
            }
            this.children.forEach(function (row) {
                v.push(row.getDeclareVariables() || {title: '', val: {}});
            });
            return v;
        };

        // 用于指示当前容器的孩子节点是否是只读的
        this.isChildrenReadonly = function () {
            if (this === this.root) {
                return false;
            }
            return this.screen.isChildrenReadonly();
        };

        this.destroy = function () {
            this.children.forEach(function (row) {
                row.destroy();
            });
            this.wrap.parentNode.removeChild(this.wrap);
        };

    }.call(Container.prototype);

    // 附加特性
    // 给容器类型的控件附加上 “变量处理” 的功能特性
    Container.prototype = Mixin( Container.prototype, new VariableProcessMixin() );

    exports.Container = Container;

} ( namespace('factory.report.components'), 
    namespace('factory.report.components.Base'),
    namespace('factory.report.mixins.VariableProcessMixin') ));

;(function (exports, SuperClass) {
    // 单独使用一个 spinner，用于数据加载时的 laoding
    var Spinner = new LoadingSpinner({ color: '#00FFFF' });

    function ReportContainer() {
        SuperClass.apply(this, arguments);
    }

    ReportContainer.prototype = Object.create(SuperClass.prototype);
    ReportContainer.prototype.constructor = ReportContainer;

    +function () {
        /** @override */
        this.optionTemplate = Mixin(this.optionTemplate, {
            group: '基本',
            name: 'I18n.resource.report.REPORT_RIGHT_NAME',
            minWidth: 12,
            minHeight: 6,
            maxWidth: 12,
            maxHeight: 6,
            spanC: 12,
            spanR: 12,
            type: 'ReportContainer',
            className: 'root-container'
        });

        /** @override */
        this.render = function (isProcessTask) {
            this.registVariableProcessTask(this.entity.modal.variables).done(function (variables) {
                // 保存 variables
                this.variables = variables;
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
                this.processTask().always(function () {
                    // 汇总信息需要等到页面数据加载完毕才进行渲染
                    this.refreshSummary();

                    Spinner.stop();
                    // phantom
                    console.info('phantom - render summary complete');
                }.bind(this));
            }

            // 刷新标题
            this.refreshTitle();
        };

    }.call(ReportContainer.prototype);

    exports.ReportContainer = ReportContainer;

} ( namespace('factory.report.components'), 
    namespace('factory.report.components.Container') ));
;(function (exports, SuperClass) {

    function Modal() {
        SuperClass.apply(this, arguments);
    }

    Modal.prototype = Object.create(SuperClass.prototype);

    +function () {
        this.DEFAULTS = {
            htmlUrl: '/static/app/WebFactory/scripts/screens/report/components/reportContainer/reportContainerConfigModal.html'
        };

        this.init = function () {
            this.$modal           = $('.modal', this.$wrap);
            this.$form            = $('#formModal', this.$wrap);
            this.$btnReportPeriod = $('#btnReportPeriod', this.$wrap);
            // drop area
            this.$btnSubmit       = $('#btnSubmit', this.$wrap);
            I18n.fillArea(this.$modal);
            this.attachEvents();
        };

        // @override
        this.recoverForm = function(options) {
            var _this = this;
            var form = options.option;
            if (!form) return;

            this._setField('dropdown', this.$btnReportPeriod, form.period);
        };

        // @override
        this.reset = function () {
            var _this = this;
            this._setField('dropdown', this.$btnReportPeriod);
        };

        this.attachEvents = function () {
            var _this = this;

            this.$btnSubmit.off().click(function (e) {
                var modalIns = _this.options.modalIns;
                var modal = modalIns.entity.modal;
                var form = {};

                form.period = this.$btnReportPeriod.attr('data-value');

                modal.option = $.extend(false, modal.option, form);

                _this.$modal.modal('hide');
                modalIns.render(true);

                e.preventDefault();
            }.bind(this));
        };

    }.call(Modal.prototype);

    exports.ReportContainerConfigModal = new Modal();

} ( namespace('factory.report.components'), ModalConfig ));
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
            tools = tools || ['export', 'variable', 'configure', 'remove'];
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
                creator: AppConfig.userProfile.fullname,
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
            this.$btnChapterSummary = $('#btnChapterSummary', this.$wrap);
            this.$btnChapterDisplay = $('#btnChapterDisplay', this.$wrap);
            // drop area
            this.$btnSubmit       = $('#btnSubmit', this.$wrap);
            I18n.fillArea(this.$modal);
            this.attachEvents();
        };

        // @override
        this.recoverForm = function(options) {
            var _this = this;
            var form = options.option;
            if (!form) return;

            this._setField('input', this.$iptChapterTitle, form.chapterTitle);
        };

        // @override
        this.reset = function () {
            var _this = this;
            this._setField('input', this.$iptChapterTitle);
        };

        this.attachEvents = function () {
            var _this = this;

            // 确认按钮点击事件
            this.$btnSubmit.off().click(function (e) {
                var modalIns = _this.options.modalIns;
                var modal = modalIns.entity.modal;
                var form = {};

                form.chapterTitle = this.$iptChapterTitle.val();
                modal.option = $.extend(false, modal.option, form);

                _this.$modal.modal('hide');
                modalIns.refreshTitle();

                e.preventDefault();
            }.bind(this));

            // 汇总按钮点击事件
            this.$btnChapterSummary.off().click(function (e) {
                var modal = _this.options.modalIns.entity.modal;

                CodeEditorModal.show(modal.option.chapterSummary, function (code) {
                    modal.option.chapterSummary = code;
                });
                e.preventDefault();
            });

            // 显示/隐藏按钮点击事件
            this.$btnChapterDisplay.off().click(function (e) {
                var modal = _this.options.modalIns.entity.modal;

                CodeEditorModal.show({
                    'js': modal.option.chapterDisplay
                }, function (code) {
                    modal.option.chapterDisplay = code.js;
                }, ['js']);
                e.preventDefault();
            });
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
        htmlUrl: '/static/app/WebFactory/scripts/screens/report/components/chapterContainer/reportTplParamsConfigModal.html'
    };

    // @override
    ReportTplParamsConfigModal.prototype.init = function() {
        this.$modal     = $('.modal', this.$wrap);
        this.$modalBody = $('.modal-body', this.$wrap);
        this.$btnSubmit = $('.btn-submit', this.$wrap);
        I18n.fillArea(this.$modal);
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
            _this.options.modalIns.render(true);
            e.preventDefault();
        } );
    };

    exports.ReportTplParamsConfigModal = new ReportTplParamsConfigModal();
} ( namespace('factory.report.components'), 
    namespace('factory.panels.ReportTplParamsPanel') ));
;(function (exports, SuperClass, ChartThemeConfig) {

    function Chart() {
        SuperClass.apply(this, arguments);

        this.store = null;
        this.chart = null;
    }

    Chart.prototype = Object.create(SuperClass.prototype);

    +function () {
        /** @override */
        this.optionTemplate = Mixin(this.optionTemplate, {
            group: '基本',
            name: 'I18n.resource.report.optionModal.ECHARTS',
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
                this.__renderChart({
                    animation: false
                });
            }
        };

        this.__renderChart = function (extendOptions) {
            var rs = this.store;
            var chartOptions = $.extend(false, this.__getChartOptions(), extendOptions);

            if (this.chart) {
                this.chart.dispose();
            }

            if (chartOptions.series.length === 0) {
                return;
            }

            this.chart = echarts.init(this.container);
            this.chart.setOption( chartOptions );
        };

        this.__getChartOptions = function () {
            var _this = this;
            var options;
            var moduleOptions = this.entity.modal.option;
            var data = this.store;
            var legend, series;

            if (moduleOptions.chartType === 'pie') {
                options = $.extend(true, {}, ChartThemeConfig.PIE_CHART_OPTIONS, new Function('return ' + this.entity.modal.option.chartOptions)());
                
                if (AppConfig.isMobile) {//手机APP上的饼图取消图例 并改变高度
                    $(this.container).closest('.report-container-wrap').css('height','240px');
                    options.legend.data = [];
                    options.title.textStyle.color = '#d8d6df';
                }
            } else {
                options = $.extend(true, {}, ChartThemeConfig.AXIS_CHART_OPTIONS, new Function('return ' + this.entity.modal.option.chartOptions)());
                
                if (AppConfig.isMobile&&_this.variables.a) {//手机APP上的对横坐标的修改
                    options.xAxis.forEach(function (row) {
                        row.data = _this.variables.a.timeShaft;
                        row.axisLabel = row.axisLabel || {};
                        row.axisLabel.rotate = 270;
                        delete row.name;
                        row.axisLabel.textStyle = row.axisLabel.textStyle || {};
                        row.axisLabel.textStyle.color = '#d8d6df';
                        row.data.textStyle = row.data.textStyle || {};
                        row.data.textStyle.color = '#d8d6df';
                    });
                    options.yAxis.forEach(function (row) {
                        row.nameTextStyle = row.nameTextStyle || {};
                        row.nameTextStyle.color = '#d8d6df';
                        row.axisLabel = row.axisLabel || {};
                        row.axisLabel.textStyle = row.axisLabel.textStyle || {};
                        row.nameLocation = 'middle';
                        row.axisLabel.textStyle.color = '#d8d6df';
                    });
                    options.legend.textStyle = options.legend.textStyle || {};
                    options.title.textStyle.color = '#d8d6df';
                }
                options.xAxis.forEach(function (row) {
                    if (typeof row.data === 'function') {
                        try {
                            row.data = row.data.call(null, data, _this.variables);
                        } catch(e) {
                            row.data = [];
                        }
                    }
                });
                // 处理纵坐标
                options.yAxis.forEach(function (row) {
                    if (typeof row.data === 'function') {
                        try {
                            row.data = row.data.call(null, data, _this.variables);
                        } catch(e) {
                            row.data = [];
                        }
                    }
                });  
            }

            // 处理图例
            if (typeof options.legend.data === 'function') {
                try {
                    options.legend.data = options.legend.data.call(null, data, _this.variables);
                } catch(e) {
                    options.legend.data = [];
                }
            }
            // 处理 series
            options.series.forEach(function (row) {
                if (typeof row.data === 'function') {
                    try {
                        row.data = row.data.call(null, data, _this.variables);
                    } catch(e) {
                        row.data = [];                        
                    }
                }
            });

            // 直角系的数据填充
            if (moduleOptions.chartType !== 'pie') {
                // 部分重要配置没有时，进行默认的数据填充
                if (options.series.length === 0) {
                    series = [];
                    Object.keys(data.list).forEach(function (id) {
                        var row = data.list[id];
                        series.push({
                            type: moduleOptions.chartType,
                            data: row.data
                        });
                    });
                    // 数据填充
                    options['xAxis'][0].data = data.timeShaft;
                    options['series'] = series;
                }
                if (options.legend.data.length === 0) {
                    var dsInfo, legend = [];
                    if (moduleOptions.legend && moduleOptions.legend.length) {
                        legend = moduleOptions.legend;
                        // 处理 series 中的 name
                        moduleOptions.legend.forEach(function (row, i) {
                            options['series'][i].name = row;
                        });
                    } else {
                        dsInfo = AppConfig.datasource.getDSItemById( Object.keys(data.list) );
                        // 为防止返回数组 dsInfoArr 的顺序和请求时发送的数据源 id 数组不一致，做以下处理
                        dsInfo = Array.toMap(dsInfo, 'id');
                        Object.keys(data.list).forEach(function (dsId, i) {
                            var alias = dsInfo[dsId] ? (dsInfo[dsId].alias || dsId) : dsId;
                            options['series'][i].name = alias;
                            legend.push(alias);
                        });
                    }
                    options['legend'].data = legend;
                }
            }

            return options;
        };

        /** @override */
        this.getTplParams = function () {
            var str = (this.entity.modal.points || []).join(',');
            var pattern = this.TPL_PARAMS_PATTERN;
            var match = null;
            var params = SuperClass.prototype.getTplParams.call(this);

            while( match = pattern.exec(str) ) {
                params.push(match[1]);
            }
            return params;
        };

        /** @override */
        this.render = function (isProcessTask) {
            var promise = $.Deferred();

            this.registVariableProcessTask(this.getVariables()).done(function () {
                promise.resolve();
            }.bind(this));

            promise.done(function () {
                var points = this.entity.modal.points;

                if (!this.entity.modal.points || !this.entity.modal.points.length) {
                    this.store = {
                        list: {},
                        timeStart: []
                    };
                    this.__renderChart();
                }else{
                    var variables = this.variables;
                    var rs = {
                        list:{}
                    };
                    for(var key in variables){
                        var row = variables[key];
                        if(key.indexOf('__p') === 0){
                            var index = key.slice(3,-2);
                            rs.list[points[index]] = {
                                data:row.data,
                                dsItemId:points[index]
                            };
                            if(!rs.timeShaft){
                                rs.timeShaft = row.timeShaft;
                            }
                        }
                    }
                    if (!rs.list) {
                        Log.warn('chart has no data.');
                        return;
                    }
                    this.store = rs;
                    this.__renderChart();
                }
            }.bind(this));

            if (isProcessTask === true) {
                this.root.processTask();
            }
        };

        //数据源和变量统一处理
        this.getVariables = function(){
            var modal = $.extend(true,{},this.entity.modal);
            var option = modal.option;
            var variables = modal.variables;
            var points = modal.points;
            if(points){
                points.forEach(function(row,i){
                    variables['__p'+i+'__'] = {
                        'descr':option.legend[i],
                        'val':'<%'+ row + ',tf=' + option.timeFormat + '%>'
                    };
                });
            }
            return variables;
        };
        // 获取替换模板参数后的 points
        this.__getTplParamsAttachedPoints = function () {
            var _this = this;
            var points = this.entity.modal.points;
            var pattern = this.TPL_PARAMS_PATTERN;
            var params = this.getTplParamsValue();

            if (!params || points.length <= 0) {
                return points;
            } else {
                return points.join(',').replace(pattern, function ($0, $1) {
                    // 如果不是云点
                    // if (params[0] !== '@')
                    return params[$1] || '';
                }).split(',');
            }
        };
        /** @override */
        this.destroy = function () {
            SuperClass.prototype.destroy.apply(this, arguments);

            if (this.chart) {
                this.chart.dispose();
            }
            this.wrap.parentNode.removeChild(this.wrap);
        };

    }.call(Chart.prototype);

    exports.Chart = Chart;

} ( namespace('factory.report.components'), 
    namespace('factory.report.components.Base'),
    namespace('factory.report.config.ChartThemeConfig') ));
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
            I18n.fillArea(this.$modal);
            this.attachEvents();
        };

        this.droparea = function (type, $ele, value) {
            var name;
            switch(type) {
                // 数据源拖拽区域
                case 'droparea':
                    // reset
                    if(!value || value.trim() === '') {
                        $ele.attr('data-value', '').html('<span class="glyphicon glyphicon-plus"></span><input value="" type="text" style="display:none;">');
                    }
                    // recover
                    else {
                        // 获取数据源的名称
						name = AppConfig.datasource.getDSItemById(value).alias;
						if(/^[a-z0-9]{24}$/.test(value)){
	                      	$ele.attr({'data-value': value,
	                          	'title': name}).html('<input value="' + (name || value) + '" type="text">');
						}else{
							var projId = AppConfig.datasource.getDSItemById(value).projId;
	                        var str = (name?("@"+projId+"|"+name):value);
	                        console.log(AppConfig.datasource.getDSItemById(value));
	                        $ele.attr({'data-value': value,
	                            'title': name}).html('<input value="' + str + '" type="text">');
						}
                        $ele.parent('.drop-area-wrap').removeClass('noData');
                    }
                    break;
                // some more...
                default:
                    break;
            }
        }

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
                options.points.forEach(function(point, i) {
                    _this.droparea('droparea', $($('.drop-area')[i]), point);
                    if($('.drop-area', this.$wrap).closest('.col-md-9').children('.noData').length === 0) {
                        $('.drop-area', this.$wrap).closest('.col-md-9').append('<div class="col-md-12 drop-area-wrap noData" style="position: relative;padding:0 15px 10px 0;"><div class="drop-area">' +
                        '<span class="glyphicon glyphicon-plus"></span><input value="" type="text" style="display:none;"></div>'+
                        '<div class="drop-text" style="display: none;"><input type="text" i18n="placeholder=report.chartConfig.INTER_WORD"></div><span class="glyphicon glyphicon-remove spanDataDel"></span></div>'
                        )
                    }
                    I18n.fillArea($('.drop-area'));
                    _this.dataDeal();
                });
            }
            var $haveData = $('.drop-area-wrap:not(".noData")');
            if(form.legend){
                form.legend.forEach(function(lengend,i){
                    $($('.drop-text')[i]).show();
                    $($('.drop-text')[i]).children('input').val(lengend);
                })
            }else if($haveData.length>0){
                $haveData.find('.drop-text').show();
            }
        };

        // @override
        this.reset = function () {
            var _this = this;
            this._setField('input', this.$iptChartOptions);
            this._setField('dropdown', this.$btnChartType);
            this._setField('dropdown', this.$btnTimeFormat);
            this._setField('dropdown', this.$btnTimePeriod);
            $('.divDataSource',this.$wrap).empty().append('<div class="col-md-12 drop-area-wrap noData" style="position: relative;padding:0 15px 10px 0;"><div class="drop-area">' +
                '<span class="glyphicon glyphicon-plus"></span><input value="" type="text" style="display:none;"></div>' +
                '<div class="drop-text" style="display: none;"><input type="text" i18n="placeholder=report.chartConfig.INTER_WORD"></div><span class="glyphicon glyphicon-remove spanDataDel"></span></div>'
            )
            I18n.fillArea($('.divDataSource'));
            _this.dataDeal();
        };

        this.dataDeal = function(){
            var _this = this;
            var $divDataSource = $('.divDataSource');
             // 加号的拖拽区域的事件处理
            $divDataSource.children('.noData').on('click', '.drop-area',function(){
                var $this = $(this);
                $this.find('.glyphicon-plus').hide();
                $this.find('input').show();
                $this.find('input').focus();
            }).on('blur', '.drop-area input',function(){
                var $this = $(this);
                if($this.val() === '' && $this.closest('.drop-area-wrap').hasClass('noData')){
                    $this.hide();
                    $this.prev('.glyphicon-plus').show();
                }else if($this.val() === '' && !$this.closest('.drop-area-wrap').hasClass('noData')){
                    $this.closest('.drop-area-wrap').remove();
                }else{
					if(/^[a-z0-9]{24}$/.test($this.closest('.drop-area').attr('data-value'))){
						return;
					}
					$this.closest('.drop-area').siblings('.drop-text').show();
                	if($this.val().indexOf('@') === 0){
	                    var currentPoint = $this.val().split('@')[1];
	                    if($this.val().indexOf('|') < 0){
	                        alert(I18n.resource.mainPanel.exportModal.POINT_FORMAT_ERROR);
//	                        $this.closest('.drop-area-wrap').remove();
	                        $this.closest('.drop-area').attr('data-state', '0');
	                        $this.closest('.drop-area').siblings('.drop-text').hide();
	                        _this.dataDeal();
	                        return;
	                    }
	                    var currentId = currentPoint.split('|')[0];
	                    var currentVal = currentPoint.split('|')[1];
	                    if(currentVal === ''){
	                        alert(I18n.resource.mainPanel.exportModal.POINT_FORMAT_ERROR);
	                        $this.closest('.drop-area').attr('data-state', '0');
	                        $this.closest('.drop-area').siblings('.drop-text').hide();
	                        _this.dataDeal();
	                        return;
	                    }else{
	                        currentVal = '^'+currentPoint.split('|')[1]+'$';
	                    }
	                    WebAPI.get('/point_tool/searchCloudPoint/'+ currentId +'/'+ currentVal).done(function(result){
	                        var data = result.data;
	                        if (data.total === 1) {

	                        }else{
	                            alert(I18n.resource.mainPanel.exportModal.NO_POINT);
	                            $this.closest('.drop-area').attr('data-state', '0');
	                            $this.closest('.drop-area').siblings('.drop-text').hide();
	                        }
	                        _this.dataDeal();
	                    }).always(function(){
	
	                    });
                	} else {
	                    var project = AppConfig.project;
	                    var currentVal = '^'+$this.val()+'$';
	                    if(project.bindId){
	                        var currentId = project.bindId;
	                        WebAPI.get('/point_tool/searchCloudPoint/'+ currentId +'/'+ currentVal).done(function(result){
	                            var data = result.data;
	                            if(data.total === 1){
									
	                            }else{
	                                alert(I18n.resource.mainPanel.exportModal.NO_POINT);
	                                $this.closest('.drop-area').attr('data-state', '0');
	                                $this.closest('.drop-area').siblings('.drop-text').hide();
	                            }
	                            
	                            _this.dataDeal();
	                        }).always(function(){
								
	                        });
	                    }else{
	                        alert(I18n.resource.mainPanel.exportModal.PROJECT_ID_ERROR);
	                        $this.closest('.drop-area').attr('data-state', '0');
	                        $this.closest('.drop-area').siblings('.drop-text').hide();
	                        _this.dataDeal();
	                        return;
	                    }
	                }
	                
                }
            }).on('keydown', '.drop-area input', function (e) {
                var ev = e || window.event;
                if (ev.keyCode === 13) {
                    this.blur();
                }
            }).on('change', '.drop-area input', function () {
                var $this = $(this);
                if ($this.val() && $this.closest('.drop-area-wrap').hasClass('noData')) {
                    $this.closest('.noData').removeClass('noData');
                    $this.parent().attr({'data-value':$this.val(),'title':$this.val()});
                    $this.closest('.divDataSource').append('<div class="col-md-12 noData drop-area-wrap" style="position: relative;padding:0 15px 10px 0;"><div class="drop-area">' +
                        '<span class="glyphicon glyphicon-plus"></span><input value="" type="text" style="display:none;"></div>' +
                        '<div class="drop-text" style="display: none;"><input type="text" i18n="placeholder=report.chartConfig.INTER_WORD"></div><span class="glyphicon glyphicon-remove spanDataDel"></span></div>'
                    );
                    I18n.fillArea($this.closest('.divDataSource'));
                } else if (!$this.closest('.drop-area-wrap').hasClass('noData')){
                	$this.closest('.drop-area').attr('data-state','1');
                    $this.parent().attr({'data-value':$this.val(),'title':$this.val()});
                } else {
                    $this.hide();
                    $this.prev('.glyphicon-plus').show();
                }
            }).on('click', '.spanDataDel',function(){
                $(this).closest('.drop-area-wrap').remove();
            });
            // 数据源拖拽的事件处理
            $divDataSource.children().off('dragover', '.drop-area').on('dragover', '.drop-area', function (e) {
                e.preventDefault();
            });
            $divDataSource.children().off('dragenter', '.drop-area').on('dragenter', '.drop-area', function (e) {
                $(e.target).addClass('on');
                e.preventDefault();
                e.stopPropagation();
            });
            $divDataSource.children().off('dragleave', '.drop-area').on('dragleave', '.drop-area', function (e) {
                $(e.target).removeClass('on');
                $(e.target).parent('.drop-area-wrap').removeClass('noData');
                e.stopPropagation();
            });
            $divDataSource.children().off('drop', '.drop-area').on('drop', '.drop-area', function (e) {
                var itemId = EventAdapter.getData().dsItemId;
                var $target = $(e.target);
                var name;
                if(!itemId) return;
                $target.removeClass('on');
                $target.parent('.drop-area-wrap').removeClass('noData');
                if ($target.closest('.divDataSource').children('.noData').length === 0) {
                    $target.closest('.divDataSource').append('<div class="col-md-12 drop-area-wrap noData" style="position: relative;padding:0 15px 10px 0;"><div class="drop-area">' +
                        '<span class="glyphicon glyphicon-plus"></span><input value="" type="text" style="display:none;"></div>' +
                        '<div class="drop-text" style="display: none;"><input type="text" i18n="placeholder=report.chartConfig.INTER_WORD"></div><span class="glyphicon glyphicon-remove spanDataDel"></span></div>'
                    )
                };
                I18n.fillArea($target.closest('.divDataSource'));
                _this.droparea('droparea', $target, itemId);
                $target.siblings('.drop-text').show();
                e.stopPropagation();
                _this.dataDeal();
            });
        }

        this.attachEvents = function () {
            var _this = this;
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
                        alert('I18n.resource.report.chartConfig.WRONG_INFO');
                    }

                    _this.$iptChartOptions.val(options);
                }, ['js']);
            });

            _this.dataDeal();

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
                modal.points = [];
                modal.option.legend = [];
                $('.drop-area-wrap:not(".noData")', this.$wrap).each(function () {
                	var target = $(this).find('.drop-area').not("[data-state='0']")[0];
                	if(target){
                		var value = target.dataset.value;
	                    var text = $(this).find('.drop-text').children('input').val();
	                    value && modal.points.push(value);
	                    if(text){
	                        modal.option.legend.push(text);
	                    }else{
	                        modal.option.legend.push('');
	                    }
                	}
                    
                });
                modal.option = $.extend(false, modal.option, form);
                _this.$modal.modal('hide');
                modalIns.render(true);

                e.preventDefault();

            }.bind(this));
        };

    }.call(Modal.prototype);

    exports.ChartConfigModal = new Modal();

} ( namespace('factory.report.components'), ModalConfig ));
;(function (exports, SuperClass, ChartThemeConfig) {

    function Html() {
        SuperClass.apply(this, arguments);

        this.guids = [];
    }

    Html.prototype = Object.create(SuperClass.prototype);

    // html container api
    function HCAPI() {}

    +function () {

        this.getHistoryData = function (params) {
            return WebAPI.post('/analysis/startWorkspaceDataGenHistogram', params);
        };

        this.getChartThemes = function () {
            // 复制一份，防止用户覆盖
            return $.extend(true, {}, ChartThemeConfig);
        };

    }.call(HCAPI.prototype);

    +function () {

        this.optionTemplate =  {
            group: '基本',
            name: 'I18n.resource.report.optionModal.HTML',
            minWidth: 3,
            minHeight: 1,
            maxWidth: 12,
            maxHeight: 100,
            type:'Html',
            className: 'report-module-text'
        };

        /** @override */
        this.initEntity = function () {
            var options = this.entity.modal.option;

            options.html = options.html || '';
            options.css = options.css || '';
            options.js = options.js || '';
        };

        this.getTemplateAPI = function () {
            return new HCAPI();
        };

        /* override */
        this.initResizer = function () {};

        /** @override */
        this.render = function (isProcessTask) {
            this.registVariableProcessTask(this.entity.modal.variables).done(function () {
                var options = this.entity.modal.option;
                var formattedCode, html, guid;
                
                if(!options) {
                    $(this.container).html('');
                    return;
                }
                guid = ObjectId();
                this.guids.push( guid );
                code = this.__getTplParamsAttachedHtml(options);
                formattedCode = this._getFormattedHtml(code, guid);
                namespace('__f_hc')[guid] = {
                    api: this.getTemplateAPI(),
                    reportOptions: this.getReportOptions(),
                    variables: this.variables
                };

                this._runCode(formattedCode);
            }.bind(this));

            if (isProcessTask === true) {
                this.root.processTask();
            }
        };

        this._runCode = function (code) {
            // 渲染 html
            this.container.innerHTML = [code.html, code.css].join('\n');
            // 执行 js
            (function (code) {
                var done = false;
                var script = document.createElement("script");
                var head = document.getElementsByTagName("head")[0];
                script.type = "text\/javascript";
                script.text = code;
                head.appendChild(script);
                head.removeChild(script);
            } (code.js));
        };

        this._getFormattedHtml = function (code, guid) {
            var _this = this;
            var patternScript = /(<script\b[^>]*>)([\s\S]*?)(<\/script>)/img;

            var htmlWrapTpl = '<div id="hc_'+guid+'">|code|</div>';

            var jsWrapTpl = (function () {
                return '(function(_data) {'+
                'var _api = _data.api, _reportOptions = _data.reportOptions, _variables = _data.variables, _container = document.querySelector("#hc_'+guid+'"); if(!_container) {return;}' +
                '|code|}).call(null, window.__f_hc["'+guid+'"]);';
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
            };
        };

        // 获取替换模板参数后的 code
        this.__getTplParamsAttachedHtml = function (code) {
            var _this = this;
            var pattern = this.TPL_PARAMS_PATTERN;
            var params = this.getTplParamsValue();

            if (!params || Object.keys(params).length === 0) {
                return code;
            } else {
                return {
                    html: (code.html || '').replace(pattern, function ($0, $1) {
                        return params[$1];
                    }),
                    js: (code.js || '').replace(pattern, function ($0, $1) {
                        return params[$1];
                    }),
                    css: (code.css || '').replace(pattern, function ($0, $1) {
                        return params[$1];
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
        this.resize = function () {
            var ele = this.container.parentNode;
            ele.style.height = 'auto';
        };

        /** @override */
        this.showConfigModal = function () {
            var _this = this;
            var option = this.entity.modal.option;

            CodeEditorModal.show(option, function (code) {
                _this.entity.modal.option.html = code.html;
                _this.entity.modal.option.js = code.js;
                _this.entity.modal.option.css = code.css;
                _this.render(true);
            });
        };

        /** @override */
        this.destroy = function () {
            SuperClass.prototype.destroy.apply(this, arguments);

            this.guids.forEach(function (guid) {
                namespace('__f_hc')[guid] = null;
            });

            this.wrap.parentNode.removeChild(this.wrap);
        };

    }.call(Html.prototype);

    exports.Html = Html;

} ( namespace('factory.report.components'), 
    namespace('factory.report.components.Base'),
    namespace('factory.report.config.ChartThemeConfig') ));
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
        htmlUrl: '/static/app/WebFactory/scripts/screens/report/components/html/htmlConfigModal.html'
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
            modalIns.render(true);
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
        options = null;
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

/**
 * 自定义汇总控件
 */
;(function (exports, SuperClass, VariableProcessMixin) {

    function CustomSummary() {
        SuperClass.apply(this, arguments);

        this.chapterNo = null;
        options = null;
    }

    CustomSummary.prototype = Object.create(SuperClass.prototype);
    CustomSummary.prototype.constructor = CustomSummary;

    +function () {
        this.getSummaryFromData = (function () {
            function getSummaryList(data, parent) {
                var _this = this;
                var layouts = data.modal.option.layouts || [];
                var summary = [];

                parent = parent || {};

                layouts.forEach(function (row) {
                    summary = summary.concat(getSummary.call(_this, row, parent));
                });
                return summary;
            };

            function getSummary(data, parent) {
                var _this = this;
                var summary = [];
                var o = {
                    variables: {},
                    chapterNo: '',
                    chapterSummary: data.modal.option.chapterSummary || '',
                    screen: parent
                };

                this.registTask(data.modal.variables, o).done(function (rs) {
                    o.variables = _this.createObjectWithChain(rs, o.screen.variables);
                });

                summary.push(o);
                summary.push(getSummaryList.call(this, data, o));
                return [summary];
            };

            return function (data) {
                return getSummaryList.call(this, data);
            };
        } ());

    }.call(CustomSummary.prototype);

    // 附加特性
    // 给自定义汇总控件附加上 “变量处理” 的功能特性
    CustomSummary.prototype = Mixin( CustomSummary.prototype, new VariableProcessMixin() );

    exports.CustomSummary = CustomSummary;

} ( namespace('factory.report.components'),
    namespace('factory.report.components.Summary'),
    namespace('factory.report.mixins.VariableProcessMixin') ));

;(function (exports, SuperClass) {

    function Block() {
        SuperClass.apply(this, arguments);

        this.store = null;
    }

    Block.prototype = Object.create(SuperClass.prototype);
    Block.prototype.constructor = Block;

    +function () {

        /** @override */
        this.optionTemplate = Mixin(this.optionTemplate, {
            name: 'I18n.resource.report.optionModal.BLOCK',
            type: 'Block',
            spanC: 12,
            spanR: 4,
            className: 'block-container'
        });

        /** @override */
        this.initEntity = function () {
            var options = this.entity.modal.option;
            if ( typeof options.dataId === 'undefined') {
                options.dataId = '';
            }
        };

        /** @override */
        this.initTools = function (tools) {
            tools = tools || ['variable', 'configure', 'remove'];
            SuperClass.prototype.initTools.call(this, tools); 
        };

        /** @override */
        this.initDropEvents = function () { /** 不需要 drop */ };

        /** @override */
        this.render = function (isProcessTask) {
            var _this = this;
            var promise = $.Deferred();
            var dataId = this.entity.modal.option.dataId;

            while (row = _this.children.pop()) {
                row.destroy();
            }

            if (!dataId || dataId === '-1') {
                return;
            }
            var url;
            if(this.entity.modal.option.findType === 'name'){
                url = '/factory/reportDataByName?name='+encodeURI(dataId)+'&date='+this.transformToSupportingDateFormat( this.getReportDate() );
            }else{
                url = '/factory/reportData/' + dataId + '/' + this.transformToSupportingDateFormat( this.getReportDate() );
            }

            // 同步拉数据
            $.ajax({
                type:'get',
                url: url,
                contentType: 'application/json',
                async: false
            }).done(function (rs) {
                var row;
                if (rs.status !== 'OK') {
                    if(AppConfig.isReportConifgMode){
                        alert(rs.msg);
                        return;
                    }else{  
                        _this.showNoData();
                        return;
                    }
                }
                $(_this.container).html("");
                _this.store = _this.formatBlockData(rs.data);

                _this.initLayout(_this.store || []);

                if (isProcessTask === true) {
                    _this.root.processTask();
                }

                _this.root.refreshTitle();
                _this.root.refreshSummary();
            });
        };

        // 将日期格式转换成
        this.transformToSupportingDateFormat = function (dateStr) {
            return dateStr.toDate().format('yyyy-MM-dd');
        };

        this.showNoData = function () {
            var str = '<div style="margin: 0 auto;width: 500px;height: 160px;margin-top:200px;">\
                            <img src="/static/images/project_img/report.png" alt="report">\
                            <div style="display:inline-block;margin-left:50px;"><p><strong i18n="observer.reportScreen.REPORT_FAIL_INFO">当前报表尚未生成</strong></p></div>\
                        </div>'
            $(this.container).html(str);  
        };
        /**
         * 格式化动态块数据
         */
        this.formatBlockData = function (data) {
            return JSON.parse(data.content);
        };

        /** @override */
        this.refreshTitle = function (chapterNo, isHideNo) {
            // 更新 title
            var containerChildren = [], i = 0;

            containerChildren = this.children.filter(function (row) {
                return row instanceof exports.Container;
            });

            chapterNo = chapterNo ? (chapterNo + '.') : chapterNo;
            containerChildren.forEach(function (row) {
                var num = row.refreshTitle(chapterNo + (i+1), isHideNo);
                if (num) {
                    i = i+num;
                } else {
                    i = i+1;
                }
            });

            return i;
        };

        /**
         * @override
         */
        this.hasChapterNo = function () {
            return false;
        };

        /**
         * @override
         */
        this.isChildrenReadonly = function () {
            return true;
        };

    }.call(Block.prototype);

    exports.Block = Block;

} ( namespace('factory.report.components'),
    namespace('factory.report.components.Container') ));
;(function (exports, SuperClass) {

    function Modal() {
        SuperClass.apply(this, arguments);

        this.dataList = [];
    }

    Modal.prototype = Object.create(SuperClass.prototype);

    +function () {
        this.DEFAULTS = {
            htmlUrl: '/static/app/WebFactory/scripts/screens/report/components/block/blockConfigModal.html'
        };

        this.init = function () {
            this.$modal      = $('.modal', this.$wrap);
            this.$form       = $('#formModal', this.$wrap);
            
            this.$iptDataId  = $('#iptDataId', this.$wrap);
            this.$ulDataList = $('#ulDataList', this.$wrap);
            
            this.$selReportData = $('#selReportData', this.$wrap);
            this.$btnSubmit  = $('#btnSubmit', this.$wrap);
            this.store = null;
            I18n.fillArea(this.$modal);
            this.attachEvents();
        };

        // @override
        this.recoverForm = function(options) {
            var target = this.$modal.find('.modal-content')[0];
            Spinner.spin(target);
            var _this = this;
            var form = options.option;
            if (!form) return;
            WebAPI.get('/factory/getReportData').done(function(result){
                var data = result.data;
                _this.store = result.data;
                var tpl = '';
                var notSelected = true;
                data.forEach(function(row){
                    if(form.dataId === row.dataId){
                        tpl += '<option class="optData" value="'+ row.dataId +'" selected>'+ row.name +'</option>';
                        _this.$iptDataId.hide();
                        notSelected = false;
                    }else if(form.dataId === row.name){
                        tpl += '<option class="optData" value="'+ row.dataId +'" selected>'+ row.name +'</option>';
                        _this.$iptDataId.hide();
                        notSelected = false;
                    }else{
                        tpl += '<option class="optData" value="'+ row.dataId +'">'+ row.name +'</option>';
                    }
                });
                _this.$selReportData.append(tpl);
                if(notSelected){
                    if(form.findType && form.findType === 'name'){
                        _this.$selReportData.val('name');
                        _this.$iptDataId.attr('placeholder','请填写数据Name').show();
                        _this._setField('input', _this.$iptDataId, form.dataId);
                    }else{
                        _this.$selReportData.val('id');
                        _this.$iptDataId.attr('placeholder','请填写数据Id').show();
                        _this._setField('input', _this.$iptDataId, form.dataId);
                    }
                }
                Spinner.stop();
            });
        };

        // @override
        this.reset = function () {
            var _this = this;
            this.store = null;
            this.$selReportData.find('.optData').remove();
            this._setField('input', this.$iptDataId);
        };

        this.attachEvents = function () {
            var _this = this;
            this.$selReportData.off('change').on('change',function(){
                if($(this).val() === 'id'){
                    _this.$iptDataId.attr('placeholder','请填写数据ID').show();
                }else if($(this).val() === 'name'){
                    _this.$iptDataId.attr('placeholder','请填写数据Name').show();
                }else{
                    _this.$iptDataId.hide();
                }
                _this._setField('input', _this.$iptDataId);
            });
            // 确实按钮点击事件
            this.$btnSubmit.off().click(function (e) {
                var modalIns = _this.options.modalIns;
                var modal = modalIns.entity.modal;
                var form = {};

                if(_this.$selReportData.val() === 'id'){
                    form.dataId = _this.$iptDataId.val();
                    form.findType = '';
                }else if(_this.$selReportData.val() === 'name'){
                    _this.store.some(function(row){
                        if(row.name === _this.$iptDataId.val()){
                            form.findType = '';
                            form.dataId = row.dataId;
                            return true;
                        }
                    });
                    if(!form.dataId){
                        form.dataId = _this.$iptDataId.val();
                        form.findType = 'name';
                    }
                }else{
                    form.dataId = _this.$selReportData.val();
                    form.findType = '';
                }
                modal.option = $.extend(false, modal.option, form);

                _this.$modal.modal('hide');
                modalIns.render(true);

                e.preventDefault();
            }.bind(this));
        };

    }.call(Modal.prototype);

    exports.BlockConfigModal = new Modal();

} ( namespace('factory.report.components'), ModalConfig ));
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', 'wf.report.components.Block']);
    } else if (typeof module === 'object' && module.exports) {
        factory(exports, require('wf.report.components.Block'));
    } else {
        factory(
            root,
            namespace('factory.report.components.Block')
        );
    }
} (namespace('factory.report.components'), function (exports, Super) {

    function DiagnosisBlock() {
        Super.apply(this, arguments);
    }

    DiagnosisBlock.prototype = Object.create(Super.prototype);
    DiagnosisBlock.prototype.constructor = DiagnosisBlock;

    +function () {
        /**
         * @override
         */
        this.optionTemplate = Mixin(this.optionTemplate, {
            name: 'I18n.resource.report.optionModal.DIAGNOSIS_BLOCK',
            type: 'DiagnosisBlock',
            spanC: 12,
            spanR: 4,
            className: 'block-container'
        });

        /**
         * @override
         */
        this.configModalType = 'Block';

        /** @override */
        this.refreshTitle = function (chapterNo) {
            Super.prototype.refreshTitle.apply(this, [chapterNo, true]);
        };

        // 支持的小节类型
        this.SUPPORT_SUBUNIT_TYPE = {
            PIE: 'pie',
            LINE: 'line',
            SCATTER: 'scatter',
            BAR: 'bar',
            AREA: 'area',
            TABLE: 'table',
            TEXT: ''
        };

        // 公共图表配置
        this.baseChartOptions = {
            title: {
                x: 'center',
                textStyle: {
                    fontSize: 15
                }
            },
            tooltip: {
                trigger: 'axis'
            },
            toolbox: {
                show: true,
                feature: {},
                showTitle: true,
                right: 40
            },
            animation: false
        };

        // 直角系系图表配置
        this.axisChartOptions = $.extend(false, {
            yAxis:{
                splitLine: {
                    lineStyle: {
                        color: '#ddd'
                    }
                }
            }
        }, this.baseChartOptions);

        this.chartYOffsetSetting = {
            grid: {
                y: 100
            },
            legend: {
                y: 40
            }
        };

        this.initI18n = function () {
            var i18nEcharts = I18n.resource.echarts;
            if (i18nEcharts) {
                this.baseChartOptions.toolbox.feature = {
                    mark: {
                        show: true,
                        title: {
                            mark: i18nEcharts.MARK,
                            markUndo: i18nEcharts.MARKUNDO,
                            markClear: i18nEcharts.MARKCLEAR
                        }
                    },
                    dataZoom: {
                        title: {
                            zoom: i18nEcharts.DATAZOOM,
                            back: i18nEcharts.DATAZOOMRESET
                        }
                    },
                    dataView: {
                        title: i18nEcharts.DATAVIEW,
                        lang: [i18nEcharts.DATAVIEW, i18nEcharts.CLOSE, i18nEcharts.REFRESH],
                        show: true,
                        readOnly: true
                    },
                    magicType: {
                        title: {
                            line: i18nEcharts.LINE,
                            bar: i18nEcharts.BAR,
                            stack: i18nEcharts.STACK,
                            tiled: i18nEcharts.TILED,
                            force: i18nEcharts.FORCE,
                            chord: i18nEcharts.CHORD,
                            pie: i18nEcharts.PIE,
                            funnel: i18nEcharts.FUNNEL
                        }
                    },
                    restore: {
                        show: true,
                        title: i18nEcharts.REDUCTION
                    },
                    saveAsImage: {
                        show: true,
                        title: i18nEcharts.SAVE_AS_PICTURE,
                        lang: [i18nEcharts.SAVE]
                    }
                };
            }
        };
        
        this.showNoData = function () {
            var str = '<div style="margin: 0 auto;width: 500px;height: 160px;margin-top:200px;">\
                            <img src="/static/images/project_img/report.png" alt="report">\
                            <div style="display:inline-block;margin-left:50px;"><p><strong i18n="observer.reportScreen.REPORT_FAIL_INFO">当前报表尚未生成</strong></p></div>\
                        </div>'
            $(this.container).html(str);  
        };
        /**
         * @override
         */
        this.formatBlockData = function (data) {
            if (data.type && data.type === 'DiagnosisReport') {
                return this.transformData(data.content);
            } else {
                return Super.formatBlockData.apply(this, arguments);
            }
        };
        
        this.transformData = function (content) {
            var layouts = [];
            try {
                content = JSON.parse(content);
            } catch (e) {
                Log.error('诊断数据解析时发生错误!');
                return;
            }

            this.initI18n();

            content.forEach(function (chapter) {
                layouts = layouts.concat(this.transformChapterToChapterContainer(chapter));
            }, this);

            return layouts;
        };

        this.transformChapterToChapterContainer = function (chapter) {
            var data = chapter.name ? this.getChapterContainerTpl({
                chapterTitle: chapter.name
            }) : [];
            var chapterLayouts = Array.isArray(data) ? data : data.modal.option.layouts;
            var layouts;

            chapter.units.forEach(function (unit) {
                var container;
                if (unit.unitName) {
                    container = this.getChapterContainerTpl({
                        chapterTitle: unit.unitName
                    });
                    chapterLayouts.push(container);
                    layouts = container.modal.option.layouts;
                } else {
                    layouts = chapterLayouts;
                }
                unit.subUnits.forEach(function (subUnit) {
                    layouts.push( this.transformToHtml(subUnit) );
                }, this);
            }, this);

            return data;
        };

        this.transformToHtml = function (subUnit) {
            var data = this.getHtmlTpl({
                html: '<div class="summary">'+subUnit.summary+'</div>',
                css: '.summary{font-size: 15px; padding: 0 25px 30px 25px; color: #555;}',
                js: "var _v=_variables;if (!_v.type || _v.type==='table'){_container.insertAdjacentHTML('beforeend', JSON.parse(_v.options));}else{var domChart=document.createElement('div'); domChart.className='canvas-container'; domChart.style.height='550px';_container.appendChild(domChart); echarts.init(domChart).setOption( JSON.parse(_v.options) );}",
                variables: {
                    type: subUnit.type
                }
            }), option;

            switch(subUnit.type) {
                case this.SUPPORT_SUBUNIT_TYPE.LINE:
                    option = this.getLineChartOptions(subUnit);
                    break;
                case this.SUPPORT_SUBUNIT_TYPE.PIE:
                    option = this.getPieChartOptions(subUnit);
                    break;
                case this.SUPPORT_SUBUNIT_TYPE.BAR:
                    option = this.getBarChartOptions(subUnit);
                    break;
                case this.SUPPORT_SUBUNIT_TYPE.SCATTER:
                    option = this.getScatterChartOptions(subUnit);
                    break;
                case this.SUPPORT_SUBUNIT_TYPE.AREA:
                    option = this.getAreaChartOptions(subUnit);
                    break;
                case this.SUPPORT_SUBUNIT_TYPE.TABLE:
                    option = this.getTableOptions(subUnit);
                    break;
                // 为空则不做任何事
                case this.SUPPORT_SUBUNIT_TYPE.TEXT:
                    data.modal.option.js = '';
                    data.modal.variables = {};
                    break;
                default:
                    Log.error('不支持的小节类型：' + subUnit.type);
                    break;
            }
            option && (data.modal.variables.options = JSON.stringify(option));

            return data;
        };

        this.getChapterContainerTpl = function (params) {
            return {
                id: ObjectId(),
                modal: {
                    option: {
                        chapterTitle: params.chapterTitle,
                        layouts: []
                    },
                    type: 'ChapterContainer'
                },
                spanC: 12,
                spanR: 3
            };
        };

        this.getHtmlTpl = function (params) {
            return {
                id: ObjectId(),
                modal: {
                    option: {
                        html: params.html || '',
                        css: params.css || '',
                        js: params.js || ''
                    },
                    variables: params.variables || {},
                    type: 'Html'
                },
                spanC: 12,
                spanR: 6
            }
        };

        /**
         * 获取图表 - 折线图的配置信息
         * 
         * @param {object} subUnit 小节的 json 数据
         * @returns 折线图的配置信息
         */
        this.getLineChartOptions = function (subUnit) {
            var _this = this;
            var x = subUnit.chartItems, y = subUnit.chartItems.y;
            var defaultOption = {
                toolbox: {
                    feature: {
                        magicType: {
                            show: true,
                            type: ['line', 'bar', 'stack', 'tiled']
                        }, dataView: {
                            show: true,
                            readOnly: true,
                            optionToContent: _this.optionToContent
                        }
                    }
                }
            };

            if ((subUnit.yMin && subUnit.yMin.length) || (subUnit.yMax && subUnit.yMax.length)) {
                defaultOption.tooltip = {
                    formatter: function (params) {
                        var tooltipReturnData = '';
                        tooltipReturnData += x.x[params[0].dataIndex] + '<br/>';
                        for (var i = 0; i < params.length; i++) {
                            for (var j = 0; j < y.length; j++) {
                                if (y[j].name == params[i].seriesName) {
                                    tooltipReturnData += '<div style="display:inline-block;width:10px;width:10px;margin-right:4px;height:10px;border-radius:5px;background-color:' + params[i].color + '"></div>' + params[i].seriesName + ' :' + y[j].value[params[i].dataIndex] + '<br />';
                                    break;
                                }
                            }
                        }
                        return tooltipReturnData;
                    }
                }
            }

            return $.extend(true, defaultOption, this.axisChartOptions, this.chartYOffsetSetting, this.getChartOptsFromParam(subUnit, this.SUPPORT_SUBUNIT_TYPE.LINE));
        };

        
        this.getPieChartOptions = function (subUnit) {
            var _this = this;
            var defaultOption = {
                toolbox: {
                    feature: {
                        dataView: {
                            show: true,
                            readOnly: true,
                            optionToContent: _this.pieOptionToContent
                        }
                    }
                },
                legend: {
                    orient: 'vertical',
                    x: 'left',
                    y: 40
                }
            };
            var option = $.extend(true, defaultOption, this.baseChartOptions, this.getChartOptsFromParam(subUnit, this.SUPPORT_SUBUNIT_TYPE.PIE));

            if (!option.tooltip.formatter || $.isEmptyObject(option.tooltip.formatter)) {
                $.extend(true, option, {
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/> {b} : {c} ({d}%)"
                    }
                })
            }
            return option;
        };

        this.getBarChartOptions = function (subUnit) {
            var _this = this;
            var defaultOption = {
                toolbox: {
                    feature: {
                        magicType: {
                            show: true,
                            type: ['line', 'bar', 'stack', 'tiled']
                        },
                        dataView: {
                            show: true,
                            readOnly: true,
                            optionToContent: _this.optionToContent
                        }
                    }
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                }
            };
            var option = $.extend(true, defaultOption, this.baseChartOptions, this.chartYOffsetSetting, this.getChartOptsFromParam(subUnit, this.SUPPORT_SUBUNIT_TYPE.BAR));
            
            if (option.yAxis && option.yAxis.length == 1) {
                delete option.yAxis.scale;
            }
            return option;
        };

        this.getScatterChartOptions = function () {};

        this.getAreaChartOptions = function () {};

        this.getTableOptions = function (subUnit) {
            var arrHtml = ['<table class="table table-bordered table-striped report-table">'];
            var items = subUnit.chartItems;

            // 拼接 thead
            arrHtml.push('<thead><tr>');
            // 第一行第一列
            if (subUnit.Options && subUnit.Options.x && subUnit.Options.x.length) {
                arrHtml.push('<th>'+subUnit.Options.x.toString()+'</th>');
            } else {
                arrHtml.push('<th></th>');
            }
            items.x.forEach(function (row) {
                arrHtml.push('<th>'+row+'</th>');
            });
            arrHtml.push('</tr></thead>');

            // 拼接 tbody
            arrHtml.push('<tbody>');
            if (items.yOrder && items.yOrder.length) {
                items.y.sort(function (x, y) {
                    return items.yOrder.indexOf(x.name) - items.yOrder.indexOf(y.name);
                });
            }
            items.y.forEach(function (row) {
                arrHtml.push('<tr><td>'+row.name+'</td>');
                row.value.forEach(function (col) {
                    arrHtml.push('<td>'+col+'</td>');
                });
                arrHtml.push('</tr>');
            });
            arrHtml.push('</tbody></table>');

            return arrHtml.join('');
        };

        this.getChartSeriesData = function (type, x, yData, y) {
            var result = [];

            switch (type) {
                case this.SUPPORT_SUBUNIT_TYPE.BAR:
                case this.SUPPORT_SUBUNIT_TYPE.LINE:
                case this.SUPPORT_SUBUNIT_TYPE.SCATTER:
                case this.SUPPORT_SUBUNIT_TYPE.AREA:
                    result = yData;
                    break;
                case this.SUPPORT_SUBUNIT_TYPE.PIE:
                    for (var i = 0; i < y.length; i++) {
                        result.push({name: y[i].name, value: y[i].value})
                    }
                    break;
                default :
                    result = yData;
            }
            return result;
        };

        /**
         * 饼图的数据视图处理
         * 
         * @param {object} opt dataView 配置传过来的参数
         * @returns
         */
        this.pieOptionToContent = function (opt) {
            var html = '';
            var series = $.extend(true, [], opt.series);

            for (var m = 0, ml = series.length; m < ml; m++) {
                series[m].data.sort(function (a, b) {
                    return a.name.localeCompare(b.name);
                });
                var title = '<p style=" text-align: center; font-size: 15px;font-weight: bold;">' + series[m].name + '</p>';
                html = title + '<table  class="table table-bordered table-hover table-striped" style="-webkit-user-select: initial;  width: 80%;margin: 0 auto;"><tbody>';
                for (var n = 0, nl = series[m].data.length; n < nl; n++) {
                    html += '<tr>' + '<td>' + series[m].data[n].name + '</td>';
                    for (var j = 0, jl = series[m].data[n].value.length; j < jl; j++) {
                        html += '<td>' + series[m].data[n].value[j] + '</td>'
                    }
                    html += '</tr>'
                }
                html += '</tbody></table>';
            }
            return html;
        };

        
        /**
         * 通用图表的数据视图处理（不包括饼图）
         * 
         * @param {object} opt dataView 配置传过来的参数
         * @returns
         */
        this.optionToContent = function (opt) {
            //报表 图例切换为数据视图
            var axisData = opt.xAxis && opt.xAxis[0].data,
                series = opt.series;
            var title = '<p style=" text-align: center; font-size: 15px;font-weight: bold;">' + opt.title.text + '</p>';
            var html = title + '<table  class="table table-bordered table-hover table-striped" style="-webkit-user-select: initial;  width: 80%;margin: 0 auto;"><tbody>';

            if (BEOPUtil.isUndefined(axisData)) {
                //table header
                html += '<tr>';
                for (var i = 0, l = series.length; i < l; i++) {
                    html += '<td colspan="2">' + series[i].name + '</td>';
                }
                html += '</tr>';
                var longestSeriesData = [], longestLength = 0;
                for (var j = 0, sl = series.length; j < sl; j++) {
                    if (series[j].data.length > longestLength) {
                        longestSeriesData = series[j].data;
                        longestLength = longestSeriesData.length;
                    }
                }

                for (var i = 0, il = longestSeriesData.length; i < il; i++) {
                    html += '<tr>';
                    for (var m = 0, ml = series.length; m < ml; m++) {
                        if (!BEOPUtil.isUndefined(series[m].data[i])) {
                            for (var n = 0, nl = series[m].data[i].length; n < nl; n++) {
                                html += '<td>' + series[m].data[i][n] + '</td>';
                            }
                        }
                    }

                    html += '</tr>';
                }
            } else {
                //table header
                html += '<tr><td>' + opt.xAxis[0].name + '</td>';
                for (var i = 0, l = series.length; i < l; i++) {
                    html += '<td>' + series[i].name + '</td>';
                }
                html += '</tr>';
                //table content
                for (var i = 0, l = axisData.length; i < l; i++) {
                    html += '<tr>' + '<td>' + axisData[i] + '</td>';

                    for (var j = 0, sl = series.length; j < sl; j++) {
                        html += '<td>' + series[j].data[i] + '</td>';
                    }

                    html += '</tr>';
                }
            }

            html += '</tbody></table>';
            return html;
        };

        this._sortFunction = function (a, b) {
            var ax = [], bx = [];

            a.replace(/(\d+)|(\D+)/g, function (_, $1, $2) {
                ax.push([$1 || Infinity, $2 || ""])
            });
            b.replace(/(\d+)|(\D+)/g, function (_, $1, $2) {
                bx.push([$1 || Infinity, $2 || ""])
            });

            while (ax.length && bx.length) {
                var an = ax.shift();
                var bn = bx.shift();
                var nn = (an[0] - bn[0]) || an[1].localeCompare(bn[1]);
                if (nn) return nn;
            }

            return ax.length - bx.length;
        };

        this._sortLegend = function (legend) {
            var ret = [], splitNum;

            if (!legend) {
                return [];
            }
            legend.sort(this._sortFunction);
            if (legend.length > 15) {
                splitNum = Math.ceil(legend.length / 3);
            } else {
                splitNum = 5;
            }
            for (var i = 0, j = legend.length; i < j; i++) {
                ret.push(legend[i]);
                if ((i + 1) % splitNum === 0) {
                    ret.push('');
                }
            }
            return ret;
        };

        this.getChartOptsFromParam = function (chartParam, type) {
            var y = chartParam.chartItems.y,
                x = chartParam.chartItems.x,
                series = [], legend = [],
                chartSeriesData = [], yItem,
                seriesItem, result, yAxis = [],
                _this = this;
            var sortedLegend;

            if (type === this.SUPPORT_SUBUNIT_TYPE.PIE) {
                legend = x;
                seriesItem = {};
                seriesItem.name = chartParam.title;
                seriesItem.data = this.getChartSeriesData(type, x, null, y);
                seriesItem.type = type;
                seriesItem.selectedMode = 'single';
                series.push(seriesItem);
            } else {
                if (!$.isArray(y)) {//兼容之前的数据结构
                    var temp = [];
                    for (var key in y) {
                        var obj = {name: key, value: y[key], yAxisIndex: 0};
                        temp.push(obj);
                    }
                    y = temp;
                }
                for (var m = 0, noMaxNoMinchartSeriesData = [], length = y.length; m < length; m++) {
                    yItem = y[m];
                    seriesItem = {};
                    seriesItem.yAxisIndex = Number(yItem.yAxisIndex) || 0;
                    seriesItem.name = yItem.name;
                    chartSeriesData = this.getChartSeriesData(type, x, yItem.value, yItem);
                    if ((chartParam.yMax && chartParam.yMax.length) || (chartParam.yMin && chartParam.yMin.length)) {
                        noMaxNoMinchartSeriesData = [];
                        for (var i = 0, chartDataPush, iLen = chartSeriesData.length; i < iLen; i++) {
                            chartParam.yMax.length ? chartDataPush = Math.min(chartParam.yMax, chartSeriesData[i]) : '';
                            chartParam.yMin.length ? (chartDataPush = chartParam.yMax.length ? Math.max(chartParam.yMin, chartDataPush) : Math.max(chartParam.yMin, chartSeriesData[i])) : '';
                            noMaxNoMinchartSeriesData.push(chartDataPush);
                        }
                        seriesItem.data = noMaxNoMinchartSeriesData;
                    } else {
                        seriesItem.data = chartSeriesData;
                    }
                    if (yItem.stack) {
                        seriesItem.stack = yItem.yAxisIndex + yItem.stack;
                    }

                    if (type === this.SUPPORT_SUBUNIT_TYPE.AREA) {
                        seriesItem.type = this.SUPPORT_SUBUNIT_TYPE.LINE;
                        seriesItem.stack = I18n.resource.observer.widgets.TOTAL_AMOUNT;
                        seriesItem.itemStyle = {normal: {areaStyle: {type: 'default'}}};
                    } else {
                        if (yItem.type) {
                            seriesItem.type = yItem.type;
                        } else {
                            seriesItem.type = type;
                        }
                    }
                    if (yItem.otherOptions) {
                        $.extend(seriesItem, yItem.otherOptions);
                    }
                    seriesItem._name = yItem.name;
                    series.push(seriesItem);
                    legend.push(yItem.name);
                }
                if (!$.isArray(chartParam.Options.y)) {//兼容之前数据,后面会去掉
                    yAxis.push({
                        name: chartParam.Options.y,
                        type: 'value',
                        scale: true
                    })
                } else {
                    for (var i = 0; i < chartParam.Options.y.length; i++) {
                        var yAxisItem = {
                            name: chartParam.Options.y[i],
                            type: 'value',
                            scale: true
                        };
                        if (!BEOPUtil.isUndefined(chartParam.yMax) && chartParam.yMax.length) {
                            yAxisItem.max = +chartParam.yMax[i];
                            yAxisItem.scale = false;
                        }
                        if (!BEOPUtil.isUndefined(chartParam.yMin) && chartParam.yMin.length) {
                            yAxisItem.min = +chartParam.yMin[i];
                            yAxisItem.scale = false;
                        }
                        yAxis.push(yAxisItem);
                    }
                }

                // 处理图表（饼图除外，饼图目前是不需要根据 yOrder 进行排序的）
                if (chartParam.chartItems && chartParam.chartItems.yOrder && chartParam.chartItems.yOrder.length) {
                    sortedLegend = chartParam.chartItems.yOrder;
                } else {
                    sortedLegend = this._sortLegend(legend);
                }
            }

            if (yAxis && yAxis.length === 1) {
                yAxis = yAxis[0];
            }

            result = {
                title: {
                    text: chartParam.title
                },
                noDataLoadingOption: {
                    text: I18n.resource.report.diagnosisBlockConfig.TITLE_NO_DATA,
                    effect: 'whirling'
                },
                legend: {data: sortedLegend, padding: [-10, 5, 0, 10], itemHeight: 10},
                series: series.sort(function (a, b) {
                    return _this._sortFunction(a._name, b._name);
                }),
                xAxis: [{
                    scale: true,
                    name: chartParam.Options.x
                }],
                yAxis: yAxis
            };
            if (x && x.length > 0) {
                result.xAxis[0].data = x;
                result.xAxis[0].type = 'category';
            } else {
                result.xAxis[0].type = 'value';
            }


            if (result.xAxis && result.xAxis.length == 1) {
                result.xAxis = result.xAxis[0];
            }

            if (type === this.SUPPORT_SUBUNIT_TYPE.PIE) {
                delete result.xAxis;
                delete result.yAxis;
            }
            if (chartParam.commonChartOptions) {
                var convertTheFunction = function (obj) {
                    for (var prop in obj) {
                        if (obj.hasOwnProperty(prop)) {
                            if (typeof obj[prop] === 'string' && obj[prop].indexOf('function(') != -1) {
                                obj[prop] = eval(obj[prop]);
                            } else if ($.isPlainObject(obj[prop])) {
                                convertTheFunction(obj[prop]);
                            }
                        }
                    }
                };
                try {
                    convertTheFunction(chartParam.commonChartOptions);
                    $.extend(result, chartParam.commonChartOptions);
                } catch (e) {
                }
            }
            return result;
        };

    }.call(DiagnosisBlock.prototype);

    exports.DiagnosisBlock = DiagnosisBlock;
}));
;(function (exports, SuperClass) {

    function Table() {
        SuperClass.apply(this, arguments);

        this.store = null;
    }

    Table.prototype = Object.create(SuperClass.prototype);

    +function () {
        this.constructor = Table;

        this.optionTemplate =  Mixin(this.optionTemplate, {
            group: '基本',
            name: 'I18n.resource.report.optionModal.TABLE',
            minWidth: 6,
            minHeight: 5,
            maxWidth: 12,
            maxHeight: 15,
            type: 'Table'
        });

        /** @override */
        this.render = function () {
            var $table = $('<table></table>');
            var $thead = $('<thead></thead>');
            var $tbody = $('<tbody></tbody>');
            //var $header = $('<h3 style="width: 80%;margin-left: auto;margin-right: auto;"></h3>');
            var option = this.entity.modal.option;
            var strTbody = '', strThead = '';
            $(this.container).empty();
            if($.isEmptyObject(option)) return;

            //$header.append('<div><span style="font-size: 14px;color: #888;">Start time :  </span>' + option.start + '</div><div><span style="font-size: 14px;color: #888;">End &nbsp;time :  </span>' + option.end + '</div>');
            //如果行:数据源 列:日期
            if(option.isSwap){
                //thead
                strThead = '<th>Time</th>';
                for(var i = 0; i < option.dataSrc.length; i++){
                    strThead += ('<th>'+ option.dataSrc[i].title +'</th>');
                }
                $thead.append('<tr>'+ strThead +'</tr>');
                //tbody, 需要根据返回的数据绘制
                this.getData(option, function (result) {
                    if(result.timeShaft && result.timeShaft.length > 0){
                        var listLen = result.list.length;
                        var list = result.list;
                        result.timeShaft.forEach(function(time, index){
                            var strTd = '';
                            for(var m = 0; m < listLen; m++){
                                strTd += ('<td>'+ list[m].data[index] +'</td>');
                            }
                            strTbody += ('<tr><td>'+ getFormatTime(time, option.interval) +'</td>'+ strTd +'</tr>');
                        });
                    }
                    $tbody.append(strTbody);
                });
            }else{
                this.getData(option, function (result) {
                    //thead
                    strThead = '<th>Time</th>';
                    for(var i = 0; i < result.timeShaft.length; i++){
                        strThead += ('<th>'+ getFormatTime(result.timeShaft[i], option.interval) +'</th>');
                    }
                    $thead.append('<tr>'+ strThead +'</tr>');
                    //tbody
                    for(var i = 0, list; i < option.dataSrc.length; i++){
                        var strTd = '';
                        list = (function(list, id){
                            for(var k = 0; k < list.length; k++){
                                if(list[k].dsItemId == id){
                                    return list[k]
                                }
                            }
                        }(result.list, option.dataSrc[i].dsId));

                        for(var j = 0; j < list.data.length; j++){
                            strTd += ('<td>'+ list.data[j] +'</td>');
                        }
                        strTbody += ('<tr><td>'+ option.dataSrc[i].title +'</td>'+ strTd +'</tr>');
                    }
                    $tbody.append(strTbody);
                });
            }

            $table.append($thead).append($tbody);
            $(this.container).css({overflow: 'auto'}).append($table);

            function getFormatTime(time, interval){
                var formatTime = '';
                switch (interval){
                    case 'm5'://时间间隔为5分钟/1小时, 显示月-日 时:分
                    case 'h1':
                        formatTime = time.replace(/^\d{4}-/,'').replace(/:\d{2}$/,'');
                        break;
                    case 'd1'://时间间隔为1天,显示月-日
                    case 'd7':
                        formatTime = time.replace(/^\d{4}-/,'').replace(/\d{2}:\d{2}:\d{2}/,'');
                        break;
                }
                return formatTime;
            }
        };

        /** @override */
        this.initTools = function (tools) {
            tools = tools || ['configure', 'remove'];
            SuperClass.prototype.initTools.call(this, tools);
        };

        /** @override */
        this.destroy = function () {
            
        };

        this.getData = function(params, callback){
            Spinner.spin(this.container);
            var postData = {dsItemIds: (function(arrdataSrc){
                    var arr = [];
                    arrdataSrc.forEach(function(i){
                        i.dsId && arr.push(i.dsId);
                    });
                    return arr;
                }(params.dataSrc)) };
            if(params.y == 'default'){//时间随日历变化
                var options = this.getReportOptions();
                postData.timeStart = options.startTime;//params.startTime,
                postData.timeEnd = options.endTime;//params.endTime,
                postData.timeFormat = params.interval ? params.interval : options.timeFormat;//以选择的时间间隔为主
            }else{//时间由配置页面配置
                postData.timeStart = new Date(params.start).format('yyyy-MM-dd HH:mm:ss');//params.startTime,
                postData.timeEnd = new Date(params.end).format('yyyy-MM-dd HH:mm:ss');//params.endTime,
                postData.timeFormat = params.interval;
            }

            WebAPI.post('/analysis/startWorkspaceDataGenHistogram', postData).done(function(result){
                if(result && result.timeShaft){
                    callback(result);
                }
            }).always(function(){
                Spinner.stop();
            });
        }

    }.call(Table.prototype);

    exports.Table = Table;

} ( namespace('factory.report.components'),
    namespace('factory.report.components.Base') ));
;(function (exports, SuperClass) {

    function Modal() {
        SuperClass.apply(this, arguments);

        this.dataList = [];
    }

    Modal.prototype = Object.create(SuperClass.prototype);

    +function () {
        this.DEFAULTS = {
            htmlUrl: '/static/app/WebFactory/scripts/screens/report/components/table/tableConfigModal.html'
        };

        this.init = function () {
            this.$modal      = $('.modal', this.$wrap);
            this.$form       = $('#formModal', this.$wrap);
            this.$btnSubmit  = $('#btnSubmit', this.$wrap);

            this.$selRow  = $('#selRow', this.$wrap);
            this.$selColumn  = $('#selColumn', this.$wrap);
            this.$selInterval  = $('#selInterval', this.$wrap);
            this.$dateStart  = $('#dateStart', this.$wrap);
            this.$dateEnd  = $('#dateEnd', this.$wrap);
            this.$chbxSwapRC  = $('#chbxSwapRC', this.$wrap);

            this.$droparea  = $('.droparea', this.$wrap);
            this.$btnAddDs  = $('#btnAddDs', this.$wrap);

            this.$divOptDs  = $('#divOptDs', this.$wrap);
            this.$divOptHist  = $('#divOptHist', this.$wrap);
            this.$divOptRT  = $('#divOptRT', this.$wrap);
            this.$dsTemplate  = $('.dsTemplate', this.$wrap);

            I18n.fillArea(this.$modal);
            this.attachEvents();
        };

        // @override
        this.recoverForm = function(options) {
            var _this = this;
            var form = options.option;
            if (!form) {
                _this.reset();
            } else {
                if($.isEmptyObject(form)){
                    _this.reset();
                }else{
                    this._setField('select', this.$selRow, form.y);
                    this._setField('select', this.$selColumn, form.x);

                    this.showCorrespond(this.$selRow, form.y, form);
                    this.showCorrespond(this.$selColumn, form.x, form);
                }
            }
        };

        this.showCorrespond = function($sel,val,form){
            var _this = this;
            var now;
            switch (val){
                case 'dataSource':
                    $sel.after(this.$divOptDs.removeClass('hidden'));
                    this.$divOptDs.find('.dsWrap').remove();
                    if(form.dataSrc && form.dataSrc.length > 0){
                        form.dataSrc.forEach(function(data){
                            var $clone = _this.$dsTemplate.clone().removeClass('hidden dsTemplate');
                            var dsName = AppConfig.datasource.getDSItemById(data.dsId).alias;
                            _this.$divOptDs.append($clone);

                            $clone.find('.droparea').removeClass('glyphicon glyphicon-plus').attr('dsId', data.dsId).attr('title',dsName).text(dsName);
                            $clone.find('.dsTitle').val(data.title);
                            _this.attachDsItem($clone.find('.droparea')[0]);
                        });
                    }
                    break;
                case 'history':
                    now = new Date();
                    this.$divOptHist.children('.timeRange').removeClass('hidden');
                    $sel.after(this.$divOptHist.removeClass('hidden'));
                    this._setField('select', this.$selInterval, form.interval);
                    this._setField('input', this.$dateStart, form.start ? form.start : new Date(now.getTime() - 604800000).format('yyyy-MM-dd 00:00'));
                    this._setField('input', this.$dateEnd, form.end ? form.end : now.format('yyyy-MM-dd 00:00'));
                    break;
                case 'realtime':
                    //todo
                    $sel.after(this.$divOptRT.removeClass('hidden'));
                    break;
                case 'default':
                    this.$divOptHist.children('.timeRange').addClass('hidden');
                    $sel.after(this.$divOptHist.removeClass('hidden'));
            }
        }

        // @override
        this.reset = function () {
            var now = new Date();
            this.$dateStart.val('');
            this.$dateEnd.val('');
            var $clone = this.$dsTemplate.clone().removeClass('hidden dsTemplate');
            this.$divOptDs.children('.dsWrap').remove().end().append($clone);
            this.attachDsItem($clone.find('.droparea')[0]);

            this.$selRow.after(this.$divOptHist.removeClass('hidden'));
            this.$dateStart.val(new Date(now.getTime() - 604800000).format('yyyy-MM-dd 00:00'));//7*24*60*60*1000=604800000
            this.$dateEnd.val(now.format('yyyy-MM-dd 00:00'));
        };

        this.attachEvents = function () {
            var _this = this;

            // 确实按钮点击事件
            this.$btnSubmit.off().click(function (e) {
                var modalIns = _this.options.modalIns;
                var modal = modalIns.entity.modal;
                var optConfig = {}, isSubmit = true;
                getDataByType(optConfig, _this.$selRow, 'y');//type
                getDataSource(optConfig, 'x');

                //check form
                //type
                if(optConfig.y == '' && isSubmit){
                    alert(I18n.resource.report.tableConfig.TYPE + 'is not yet selected');
                    isSubmit = false;
                }
                //dateStart
                if(optConfig.start == '' && isSubmit){
                    alert('Start time is required');
                    isSubmit = false;
                }
                //dateEnd
                if(optConfig.end == '' && isSubmit){
                    alert('End time is required');
                    isSubmit = false;
                }
                //droparea 数据源
                if(optConfig.dataSrc && optConfig.dataSrc.length == 0 && isSubmit){
                    alert('Data sources need at least one');
                    isSubmit = false;
                }else if(optConfig.dataSrc.length > 0){
                    for(var i = 0; i < optConfig.dataSrc.length; i++){
                        if(optConfig.dataSrc[i].dsId && !optConfig.dataSrc[i].title && isSubmit){
                            alert('No input header');
                            isSubmit = false;
                        }
                    }
                }

                if(!isSubmit){ return; }

                modal.option.isSwap = _this.$chbxSwapRC.prop('checked');
                modal.option = $.extend(false, modal.option, optConfig);

                _this.$modal.modal('hide');
                modalIns.render(true);

                e.preventDefault();
            }.bind(this));

            //行列选择
            this.$selRow.off().change(function(){
                var selVal = this.value;
                var $formGroup = $(this).closest('.form-group');
                $formGroup.next('.divAppend').addClass('hidden');
                /*if(selVal == 'dataSource'){
                    if($formGroup.next('.dsWrap').length == 0){
                        $formGroup.after(this.$divOptDs.removeClass('hidden').append(this.$dsTemplate.clone().removeClass('hidden dsTemplate')));
                    }
                }else */
                if(selVal == 'history'){
                    _this.$divOptHist.children('.timeRange').removeClass('hidden');
                    $(this).after(_this.$divOptHist.removeClass('hidden'));
                }else if(selVal == 'realtime'){
                    $(this).after(_this.$divOptRT.removeClass('hidden'));
                }else if(selVal == 'default'){
                    _this.$divOptHist.children('.timeRange').addClass('hidden');
                    $(this).after(_this.$divOptHist.removeClass('hidden'));
                }
            });

            //数据源
            this.$droparea.each(function(){
                _this.attachDsItem(this);
            });


            this.$btnAddDs.off().click(function(){
                var $cloneDom = _this.$dsTemplate.clone().removeClass('hidden dsTemplate');
                var $droparea = $cloneDom.find('.droparea');

                $droparea.text('').attr('dsId', '');
                $cloneDom.find('.dsTitle').val('');

                _this.$divOptDs.append($cloneDom);

                _this.attachDsItem($droparea[0]);
            });

            $('input.dpInlineBlock').datetimepicker({
                autoclose: true
            });

            function getDataByType(optConfig, $sel, type){
                var selVal = $sel.val();
                switch (selVal){
                    case 'history':
                        optConfig.start = _this.$divOptHist.find('#dateStart').val();
                        optConfig.end = _this.$divOptHist.find('#dateEnd').val();
                        optConfig[type] = selVal;
                        optConfig.interval = _this.$divOptHist.find('#selInterval').val();
                        break;
                    case 'realtime':
                        break;
                    case 'default':
                        optConfig[type] = selVal;
                        optConfig.interval = _this.$divOptHist.find('#selInterval').val();
                }
            }

            function getDataSource(optConfig, type){

                optConfig[type] = 'dataSource';
                optConfig.dataSrc = [];

                _this.$divOptDs.children('.dsWrap').each(function(){
                    var dsId = $(this).find('.droparea').attr('dsId');
                    if(dsId){
                        optConfig.dataSrc.push({
                            dsId: dsId,
                            title: $(this).find('.dsTitle').val()
                        });
                    }
                });

            }
        };

        this.attachDsItem = function(droparea){
            droparea.ondragover = function(e){
                e.preventDefault();
            };

            droparea.ondrop = function(e){
                e.preventDefault();
                try{
                    var dsItemId = EventAdapter.getData().dsItemId, alias;
                    if(dsItemId){
                        alias = AppConfig.datasource.getDSItemById(dsItemId).alias;
                        $(this).removeClass('glyphicon glyphicon-plus').attr('dsId', dsItemId).attr('title',alias).text(alias);
                    }
                }catch (e){
                    console.log('data source id is not found');
                }
            };

            $(droparea).closest('.dsWrap').find('.btnRemove').off().click(function(){
                $(this).closest('.dsWrap').remove();
            });
        }

    }.call(Modal.prototype);

    exports.TableConfigModal = new Modal();

} ( namespace('factory.report.components'), ModalConfig ));
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
;(function (exports, SuperClass, ReportModulePanel, ReportTplPanel) {
    var _this;

    function FacReportScreen() {
        SuperClass.apply(this, arguments);
        _this = this;
        this.layout.reportTplPanel = null;
        this.reportTplPanel = null;

        this.reportDate = null;
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

        this.initNav = function () {
            SuperClass.prototype.initNav.apply(this, arguments);

            // 重置预览链接
            $('#lkPreview', this.$pageTopTools)
                .attr('href', '/factory/preview/report/' + this.page.id);
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
            this.reportTplPanelCtn.className = 'gray-scrollbar';
            this.reportTplPanelCtn.setAttribute('caption', I18n.resource.report.REPORT_NAME);//I18n.resource.report.REPORT_NAME
            this.reportTplPanelCtn.dataset.type = 'ReportTplPanelCtn';
            $(this.reportTplPanelCtn).css({ "overflow-y": "auto", "overflow-x": "hidden" });

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
            var dockManager = this.facScreen.layout.dockManager;
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
        this.initModuleLayout = function (type) {
            var layouts = this.store.layout[0] || [];
            var options, Clazz;
            var modal;
            
            if (!type || type === 'Container') {
                type = 'ReportContainer';
            }
            Clazz = namespace('factory.report.components')[type];

            if (layouts.length === 1 && 
                ['Container', 'ReportContainer', 'ChapterContainer'].indexOf(layouts[0].modal.type) > -1 ) {
                modal = $.extend(false, layouts[0].modal, {type: type});
            }
            // 对旧数据和模板做个兼容
            else {
                modal = {
                    option: {
                        layouts: layouts,
                        period: 'day'
                    },
                    type: type
                };
            }

            this.reportEntity = new Clazz(this, {
                spanC: 12,
                spanR: 6,
                modal: modal
            });

            this.reportEntity.render(true);
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
        this.saveLayout = function (callback) {
            var _this = this;

            var data = {
                creatorId: AppConfig.userId,
                menuItemId: this.page.id,
                isFactory: AppConfig.isFactory,
                layout: [[this.reportEntity.entity]]
            };

            if (!this.store.id) {
                Log.warn('do not give an id when save data to spring layout table, will create a new id. If you see this frequently, there must be some thing wrong.');
                this.store.id = ObjectId();
            }
            data.id = this.store.id;

            WebAPI.post('/spring/saveLayout', data).done(function (result) {
                // 更新 storeSerializedStr, 标识存储的数据被更改
                _this.dataSign = _this.getDataSign();
                // 执行成功回调
                typeof callback === 'function' && callback(1);
            }).fail(function () {
                // 执行失败回调
                typeof callback === 'function' && callback(0);
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
;(function (exports) {

    function ReportAPI() {}

    +function () {
        // 在指定的dom容器中，渲染出指定报表的指定章节或者其汇总信息
        // 参数重载：
        //   container,reportId[,chapterId][,options]
        this.renderReport = function(container, reportId, chapterId, options) {
            var _this = this;
            // 参数重载处理
            if (arguments.length === 3) {
                if (typeof chapterId === 'object') {
                    options = chapterId;
                    chapterId = null;
                }
            }

            options = options || {};

            return WebAPI.get("/spring/get/" + reportId + '/' + AppConfig.isFactory).then(function (rs) {
                var layouts = rs.layout[0];
                var layout, modal, match;
                var ins;
                var period;

                // 获取报表的周期类型
                if (layouts[0]) {
                    period = layouts[0].modal.option.period;
                } else {
                    Log.error('报表数据为空！');
                    return;
                }

                // 如果没有 chapterId，则直接显示整张报表
                if (!chapterId) {
                    match = layouts[0];
                } else {
                    // 在报表中查找出指定的章节 id
                    while (layout = layouts.shift()) {
                        modal = layout.modal;

                        // 忽略非容器类控件
                        if (!modal.option.layouts) {
                            continue;
                        }

                        if (layout.id === chapterId) {
                            match = layout;
                            break;
                        }
                        // 将子元素进行追加
                        layouts = layouts.concat(modal.option.layouts);
                    }
                }

                if (!match) {
                    Log.error('没有找到指定报表/章节');
                    return;
                }

                // 清空容器
                container.innerHTML = '';
                // 给容器加上类型
                container.classList.add('report-ob', 'report-wrap', 'report-ref-external');

                // 根据找到的数据进行报表显示
                return (function (container, data, period, options) {
                    var Clazz;
                    var report;
                    var promise = $.Deferred();
                    var entity;

                    // 判断是否只显示摘要
                    if (options.onlySummary) {
                        Clazz = namespace('factory.report.components')['CustomSummary'];
                        entity = {
                            spanC: 12,
                            spanR: 6,
                            modal: {
                                option: {},
                                type: 'CustomSummary'
                            }
                        };

                        // 渲染摘要
                        promise.resolve();
                    } else {
                        Clazz = namespace('factory.report.components')[data.modal.type];
                        entity = data;
                        promise.reject();
                    }

                    entity.modal.option.period = period || 'day';
                    report = new Clazz({
                        container: container,
                        reportDate: options.date
                    }, entity);

                    // 如果设置了只显示摘要，则在这里进行渲染摘要的操作
                    return promise.then(function () {
                        var summary = [];
                        var o = null;
                        // 获取一个章节的摘要
                        if (data.modal.type === 'ChapterContainer') {
                            o = {
                                variables: {},
                                chapterNo: '',
                                chapterSummary: data.modal.option.chapterSummary,
                                screen: {}
                            };
                            summary = [[o,[]]];

                            // 添加变量处理
                            report.registTask(data.modal.variables, o).done(function (rs) {
                                o.variables = report._createObjectWithChain(rs, o.screen.variables);
                            });
                        }
                        // 获取所有的摘要信息
                        else {
                            summary = report.getSummaryFromData(data);
                        }
                        // 处理参数
                        return report.processTask().then(function () {
                            // 显示摘要
                            report.refreshSummary(summary, {
                                showTitle: false
                            });

                            return report;
                        });
                    }, function () {
                        // 显示报表
                        report.render(true);

                        return report;
                    });
                } (container, match, period, options));
            });
        };

    }.call(ReportAPI.prototype);

    exports.report = new ReportAPI();
} (
    namespace('api')
));

;(function (exports, SuperClass, ReportTplParamsPanel) {
    var timer = null;
    var saveTimer;
    function FacReportTplScreen() {
        SuperClass.apply(this, arguments);
    }

    FacReportTplScreen.prototype = Object.create(SuperClass.prototype);

    +function () {

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
                if (rs.content && rs.content.layout) {
                    p.layout = [[rs.content.layout]];
                } else {
                    p.layout = [[]];
                }
                return p;
            });
        };
		this.spinner = function(flag){
		    saveTimer && clearTimeout(saveTimer), saveTimer = null;
		    var $spinner = $('#mainframe .spinner');
		    if (flag === "start") {
		        $spinner.css('display', 'block')
                    .siblings('span')
                    .css('display', 'none');
		    } else if (flag === 1) {
		        $spinner.css('display', 'none')
                    .siblings('span:eq(0)')
                    .attr('class', 'glyphicon glyphicon-ok')
                    .css('display', 'inline-block')
                    .next()
                    .css('display', 'inline-block');
		        saveTimer = setTimeout(function () {
		            $spinner.siblings('span:eq(0)')
                        .attr('class', 'glyphicon glyphicon-floppy-disk');
		        }, 2000)
		    } else if (flag === 0) {
		        $spinner.css('display', 'none')
                    .siblings('span:eq(0)')
                    .attr('class', 'glyphicon glyphicon-remove')
                    .css('display', 'inline-block')
                    .next()
                    .css('display', 'inline-block');
		        saveTimer = setTimeout(function () {
		            $spinner.siblings('span:eq(0)')
                        .attr('class', 'glyphicon glyphicon-floppy-disk');
		        }, 2000)
		    }
		};
        /** @override */
        this.initNav = function () {
            var _this = this;

            this.$pageNav = $('#pageNav');
            this.$pageTopTools = $('#pageTopTools');
            this.$userNav = $('#userNav');

            $('a', this.$pageTopTools).hide();
            // 显示页面名称
            $('#lkName', this.$pageNav)
                .text(I18n.resource.report.TEMPLATE_EDIT + ' - ' + this.page.name.split(' - ')[0])
                .attr("title",I18n.resource.report.TEMPLATE_EDIT + ' - ' + this.page.name.split(' - ')[0]).show();
            // 重置预览链接
            $('#lkPreview', this.$pageTopTools)
                .attr('href', '/factory/previewMaterial/report/' + this.page.id);
            // '保存'按钮
            $('#lkSync').off().on('click', function () {
                // TODO 动画开始
                _this.spinner('start');
                _this.saveLayout(function (state) {
                    // TODO 动画结束
	                _this.spinner(state);
                });
            }).show();
            // '预览'按钮
             $('#lkPreview').off().on('click', function () {
                Spinner.spin(document.body);
                _this.saveLayout(function () {
                    // TODO 动画结束
	                Spinner.stop();
                });
             }).show();
            // '退出编辑'按钮
            $('#lkQuit').off().on('click', function () {
                _this.close();
            }).show();

            //左上角的  Webfactory  显示
            $('#divLogoWrap a').attr('id','templateEdit').text('WebFactory '+I18n.resource.report.TEMPLATE_EDIT);
            $('#divLogoWrap #templateEdit').off().on('click', function () {
                _this.close();
            })
            $('#divLogoWrap').show();
            
            this.$pageTopTools.show();
            this.$pageNav.show();
            this.$userNav.hide();
        };

        /** @override */
        this.initLayout = function () {
            var dockManager = this.facScreen.layout.dockManager;
            var documentNode = this.facScreen.layout.documentNode;

            var windowPanel, dataSourcePanel, modulePanel;
            var windowNode, dataSourceNode, moduleNode;

            this.initLayoutDOM.apply(this, arguments);

            this.layout.windowPanel = windowPanel = new dockspawn.PanelContainer(this.windowCtn, dockManager);
            this.layout.dataSourcePanel = dataSourcePanel = new dockspawn.PanelContainer(this.dataSourcePanelCtn, dockManager);
            this.layout.modulePanel = modulePanel = new dockspawn.PanelContainer(this.modulePanelCtn, dockManager);
            this.layout.reportTplPanel = new dockspawn.PanelContainer(this.reportTplPanelCtn, dockManager);

            dataSourceNode = dockManager.dockRight(documentNode, dataSourcePanel, .2);
            moduleNode = dockManager.dockFill(dataSourceNode, modulePanel);
            windowNode = dockManager.dockFill(documentNode, windowPanel);
            dockManager.dockFill(moduleNode, this.layout.reportTplPanel);
        };

        /** @override */
        this.initModuleLayout = function () {
            SuperClass.prototype.initModuleLayout.apply(this, ['ChapterContainer']);

            this.reportEntity.refreshTitle('1');
        };

        /** @override */
        this.saveLayout = function (callback) {
            var _this = this;
            var data = {
                _id: this.page.id,
                content: {
                    layout: this.reportEntity.entity
                }
            };

            WebAPI.post('/factory/material/edit', data).done(function () {
                // 更新 storeSerializedStr, 标识存储的数据被更改
                _this.dataSign = _this.getDataSign();
                // 执行成功回调
                typeof callback === 'function' && callback(1);
            }).fail(function () {
                // 执行失败回调
                typeof callback === 'function' && callback(0);
            });
        };

        // 应用模板参数
        this.applyTplParams = function (params) {
            this.reportEntity.applyTplParams(params);
            this.reportEntity.render(true);
        };

        // 获取模板参数列表
        this.getTplParams = function () {
            return this.reportEntity.getTplParams();
        };

        this.close = function () {
            $('#divLogoWrap #templateEdit').attr('id','lkProjectLogo').text('WebFactory');

            SuperClass.prototype.close.apply(this, arguments);

            // 同时销毁 factory screen
            this.facScreen.close();
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
    var timer;
    var saveTimer;
    function FacReportWrapScreen(page, screen) {
        _this = this;

        this.page = page;
        this.screen = screen;
        // 中间内容区域容器
        this.windowCtn = null;
        // 数据源面板容器
        this.dataSourcePanelCtn = null;
        // 可选模块面板容器
        this.modulePanelCtn = null;

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
            windowLeftPanel: null,
            windowRightPanel: null,
            reportTplPanel:null
        };

        this.store = {};

        this.reportTplPanel = null;
        this.reportDate = null;

        // 可选模块面板
        this.modulePanel = null;
        // 数据源面板
        this.dataSourcePanel = null;
        // dashboard 配置框
        this.modalConfigPane = null;
    }

    FacReportWrapScreen.prototype = {
        show: function () {
            Spinner.spin(document.body);

            // 初始化 页面导航条 
            this.initNav();

            // 获取数据
            WebAPI.get( '/factory/reportWrap/'+[AppConfig.isFactory, this.page.id].join('/') ).done(function (rs) {
                var _this = this;
                this.store = rs;
                WebAPI.get('/static/app/WebFactory/views/reportScreen.html').done(function(html){
                    // 初始化操作
                    _this.init(html);
                    // 初始化 可选模块 工厂类
                    _this.initIoc();
                    //初始化面板
                    _this.initDataSourcePanel();
                    _this.initModulePanel();
                    _this.initReportTplPanel();
                    // 初始化 worker
                    _this.initSync();
                    // 设置一个记录点
                    //_this.dataSign = _this.getDataSign();
                })
            }.bind(this)).always(function () {
                Spinner.stop();
            });
        },
        spinner:function(flag){
            saveTimer && clearTimeout(saveTimer), saveTimer = null;
            var $spinner = $('#mainframe .spinner');
            if (flag === "start") {
                $spinner.css('display', 'block')
                    .siblings('span')
                    .css('display', 'none');
            } else if (flag === 1) {
                $spinner.css('display', 'none')
                    .siblings('span:eq(0)')
                    .attr('class', 'glyphicon glyphicon-ok')
                    .css('display', 'inline-block')
                    .next()
                    .css('display', 'inline-block');
                saveTimer = setTimeout(function () {
                    $spinner.siblings('span:eq(0)')
                        .attr('class', 'glyphicon glyphicon-floppy-disk');
                }, 2000)
            } else if (flag === 0) {
                $spinner.css('display', 'none')
                    .siblings('span:eq(0)')
                    .attr('class', 'glyphicon glyphicon-remove')
                    .css('display', 'inline-block')
                    .next()
                    .css('display', 'inline-block');
                saveTimer = setTimeout(function () {
                    $spinner.siblings('span:eq(0)')
                        .attr('class', 'glyphicon glyphicon-floppy-disk');
                }, 2000)
            }
		},
        initNav: function () {
            var _this = this;
            // 页面导航条  显示页面名称   保存  预览   管理员 
            this.$pageNav = $('#pageNav');
            this.$pageTopTools = $('#pageTopTools');
            this.$userNav = $('#userNav');

            $('a', this.$pageTopTools).hide();
            // 显示页面名称
            $('#lkName', this.$pageNav).text(this.screen.project.cnName + " > " + this.page.name.split(' - ')[0])
            .attr("title",this.screen.project.cnName + ">" + this.page.name.split(' - ')[0]).show();

            //锁定时修改显示样式
            var $pageNameBox = $('#lkName');
            if (this.page.isLock === 1) {
                $pageNameBox.addClass('locked');
                $pageNameBox.prepend('<span class="glyphicon glyphicon-lock lockedImage"></span>');
                $pageNameBox.append('<span class="lockedText">(已锁定)</span>');
            } else {
                $pageNameBox.removeClass('locked');
            }

            // 保存
            $('#lkSync', this.$pageTopTools).off('click').click(function () {
                if (_this.page.isLock === 1) {
                    alert('页面已经锁定，保存失败！');
                    return;
                }
                _this.spinner('start');
                _this.autoSave(true, function (state) {
		            _this.spinner(state);
                });
            }).show();
            // 预览链接
            $('#lkPreview', this.$pageTopTools).off('click').click(function () {
                if (_this.page.isLock === 1) {
                    return;
                }
                Spinner.spin(document.body);
                _this.autoSave(true, function () {
                    Spinner.stop();
                });
            })
            .show()
            .attr('href', '/factory/preview/reportWrap/' + _this.page.id);
            //发布页面
            $('#lkReleasePage', this.$pageTopTools).off('click').click(function () {
                ReleaseModal.show(_this.screen, _this.page.id);
            }).show();

            // 显示 Nav
            this.$pageNav.show();
            this.$pageTopTools.show();
            this.$userNav.show();

            $('[data-toggle="tooltip"]').tooltip({trigger:'hover'});

        },
        init: function (html) {
            // 初始化布局  面板
            this.initLayout(html);

            // 初始化 ReportConfigPanel
            this.initReportConfigPanel();
        },
        initSync: function () {
            if (this.page.isLock === 1) return;
            // 注册 ctrl+s 保存事件
            window.addEventListener('keydown', this.onKeyDownActionPerformed, false);
            // 注册 beforeunload 事件
            window.addEventListener('beforeunload', this.onBeforeUnloadActionPerformed, false);
            //自动保存事件
            this.autoSave(false);
        },
        /* @override */
        //getDataSign : function () {
        //    // 序列化字符串，用于记录当前数据的状态
        //    return JSON.stringify(this.reportEntity.entity.modal.option.layouts);
        //},
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
        initLayoutDOM: function (html) {
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
            this.reportTplPanelCtn.className = 'gray-scrollbar';
            this.reportTplPanelCtn.setAttribute('caption', I18n.resource.report.REPORT_NAME);//I18n.resource.report.REPORT_NAME
            this.reportTplPanelCtn.dataset.type = 'ReportTplPanelCtn';
            $(this.reportTplPanelCtn).css({ "overflow-y": "auto", "overflow-x": "hidden" });

            //创建中间区域左边内容区域
            this.windowLeftPanelCtn = document.createElement('div');
            this.windowLeftPanelCtn.id = 'windowLeftPanel';
            //this.windowLeftPanelCtn.className = 'gray-scrollbar';
            this.windowLeftPanelCtn.setAttribute('caption', '报表列表');
            // 创建中间区域左边主面板容器
            this.reportConfigPanelCtn = document.createElement('div');
            this.reportConfigPanelCtn.id = 'reportConfigPanel';
            this.windowLeftPanelCtn.appendChild(this.reportConfigPanelCtn);
            // 中间内容右边区域面板容器
            this.windowRightPanelCtn = document.createElement('div');
            this.windowRightPanelCtn.id = 'windowRightPanel';
            this.windowRightPanelCtn.className = 'gray-scrollbar report-wrap';
            // 初始化中间右边区域的内部 DOM
            this.windowRightPanelCtn.innerHTML = html;
            this.container = this.windowRightPanelCtn.querySelector('#reportWrap');
            this.$container = $(this.container);
        },
        initLayout: function (html) {
            var dockManager = this.screen.layout.dockManager;
            var documentNode = this.screen.layout.documentNode;
            var dataSourcePanel, modulePanel, reportTplPanel;
            var dataSourceNode, moduleNode;
            var pagePanel = this.screen.layout.pagePanel;
            var pageNode;

            this.initLayoutDOM(html);

            this.layout.windowLeftPanel = new dockspawn.PanelContainer(this.windowLeftPanelCtn, dockManager);
            this.layout.windowRightPanel = new dockspawn.PanelContainer(this.windowRightPanelCtn, dockManager);
            this.layout.dataSourcePanel = dataSourcePanel = new dockspawn.PanelContainer(this.dataSourcePanelCtn, dockManager);
            this.layout.modulePanel = modulePanel = new dockspawn.PanelContainer(this.modulePanelCtn, dockManager);
            this.layout.reportTplPanel = reportTplPanel = new dockspawn.PanelContainer(this.reportTplPanelCtn, dockManager);

            // 判断 pagePanel 是否在浮动窗口中
            if (pagePanel.floatingDialog) {
                dataSourceNode = dockManager.dockRight(documentNode, dataSourcePanel, .2);
            } else {
                pageNode = dockManager._findNodeFromContainer(pagePanel);
                dataSourceNode = dockManager.dockFill(pageNode, dataSourcePanel);
            }

            moduleNode = dockManager.dockFill(dataSourceNode, modulePanel);
            dockManager.dockFill(moduleNode, reportTplPanel);
            dockManager.dockLeft(documentNode, this.layout.windowLeftPanel,.16);
            dockManager.dockFill(documentNode, this.layout.windowRightPanel);
        },
        initIoc : function() {
            this.factoryIoC = new FactoryIoC('report');
        },
        initModulePanel : function () {
            if(this.modulePanel) {
                this.modulePanel.close();
                this.modulePanel = null;
            }
            if( $(this.modulePanelCtn).is(':visible') ) {
                var ReportModulePanel = namespace('factory.panels').ReportModulePanel;
                this.modulePanel = new ReportModulePanel(this);
                this.modulePanel.show();
            }
            this.modulePanelCtn.removeEventListener('dock.tabPage.changed', this.onTabPageChanged);
            this.modulePanelCtn.addEventListener('dock.tabPage.changed', this.onTabPageChanged, false);
        },
        initDataSourcePanel: function () {
            if(this.dataSourcePanel) {
                this.dataSourcePanel.close();
                this.dataSourcePanel = null;
            }
            if( $(this.dataSourcePanelCtn).is(':visible') ) {
                this.dataSourcePanel = new DataSourcePanel(this);
                this.dataSourcePanel.show();
            }
            this.dataSourcePanelCtn.removeEventListener('dock.tabPage.changed', this.onTabPageChanged);
            this.dataSourcePanelCtn.addEventListener('dock.tabPage.changed', this.onTabPageChanged, false);
        },
        initReportTplPanel : function () {
            if(this.reportTplPanel) {
                this.reportTplPanel.close();
                this.reportTplPanel = null;
            }
            if( $(this.reportTplPanelCtn).is(':visible') ) {
                var ReportTplPanel = namespace('factory.panels').ReportTplPanel;
                this.reportTplPanel = new ReportTplPanel(this);
                this.reportTplPanel.show();
            }
            this.reportTplPanelCtn.removeEventListener('dock.tabPage.changed', this.onTabPageChanged);
            this.reportTplPanelCtn.addEventListener('dock.tabPage.changed', this.onTabPageChanged, false)
        },
        /* @override */
        onTabPageChanged : function (e) {
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
                            var ReportModulePanel = namespace('factory.panels').ReportModulePanel;
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
                            var ReportTplPanel = namespace('factory.panels').ReportTplPanel;
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
                            var ReportTplPanel = namespace('factory.panels').ReportTplPanel;
                            _this.reporTplParamsPanel = new ReportTplPanel(_this);
                        }
                        _this.reporTplParamsPanel.show();
                    } else {
                        _this.reporTplParamsPanel.hide();
                    }
                    break;
            }
        },
        save: function (callback,saveData) {
            if(!saveData){
                if(!_this.reportConfigPanel.openReport){
                    typeof callback === 'function' && callback(0);
                    return;
                }
                var data = {
                    id:_this.reportConfigPanel.openReport.dataId || _this.reportConfigPanel.openReport.reportId,
                    creatorId: _this.reportConfigPanel.openReport.creatorId || AppConfig.userId,
                    menuItemId:_this.reportConfigPanel.openReport.reportId,
                    isFactory: AppConfig.isFactory,
                    layout: [[this.reportEntity.entity]]
                };
                saveData = {
                    pageId: this.page.id,
                    list: _this.store.list,
                    data: data
                }
            }
            WebAPI.post('/factory/reportWrap/' + AppConfig.isFactory, saveData).done(function () {
                typeof callback === 'function' && callback(1);
            }).fail(function () {
                typeof callback === 'function' && callback(0);
            });
        },
        autoSave: function(isImmediatelyRun, callback,saveData){
            if(timer){
                clearTimeout(timer);
            }
            if(isImmediatelyRun) {
                _this.save(callback,saveData);
            }
            timer = window.setTimeout(function() {
                _this.autoSave(true);
            }, AppConfig.syncInterval);
        },

        close: function() {
            var _this = this;
            //隐藏导航条
            $('#lkName', this.$pageNav).text(this.screen.pagePanel.project.cnName);
            //this.$pageNav.hide();
            this.$pageTopTools.hide();

            // 关闭 reportConfigPanel
            if(this.reportConfigPanel){
                this.reportConfigPanel.close();
                this.reportConfigPanel = null;
            }

            // 销毁 ReprotWrapScreen 的所有面板
            Object.keys(this.layout).forEach(function (k) {
                var panel = _this.layout[k];
                // 判断是否为浮动窗口
                if (panel.floatingDialog) {
                    // 存在，则使用浮动窗口的销毁方式
                    panel.floatingDialog.destroy();
                } else {
                    // 不存在，则使用固定停靠窗口的销毁方式
                    panel.performUndock();
                }
                _this.layout[k] = null;
            });
            this.layout = null;

            // 删除内容
            this.windowLeftPanelCtn = null;
            this.windowRightPanelCtn = null;
            //清除timer
            if(timer){
                clearTimeout(timer);
                timer = null;
            }
        }
    };

    exports.FacReportWrapScreen = FacReportWrapScreen;
} ( namespace('factory.screens'),
    namespace('factory.panels.ReportConfigPanel') ));