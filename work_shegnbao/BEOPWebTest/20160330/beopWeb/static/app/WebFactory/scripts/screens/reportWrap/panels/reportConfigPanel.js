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