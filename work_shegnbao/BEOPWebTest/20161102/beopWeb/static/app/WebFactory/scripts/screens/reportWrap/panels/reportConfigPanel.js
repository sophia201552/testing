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
					for(var j=0;j<31;j++){
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
					if(!layouts[0].modal.option.periodStartTime){
						var _id = rs.menuItemId || reportId;
						_this.screen.store.list.some(function(row){
							if(row.reportId === _id){
								layouts[0].modal.option.period = row.period;
								layouts[0].modal.option.periodStartTime = row.periodStartTime;
								return true;
							}
						});
					}
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