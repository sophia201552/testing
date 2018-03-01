var PaneProjectConfigure;
PaneProjectConfigure = (function () {
	function PaneProjectConfigure() {
		//导航脚本
		this.proName = undefined;
		this.stepCur = undefined;
		this.stepNext = undefined;
		this.stepPre = undefined;
		this.stepPreShow = undefined;
		this.stepAll = undefined;
		this.curPic = undefined;
		this.nextPic = undefined;
		this.prePic = undefined;
		this.preShowPic = undefined;
		this.allPic = undefined;
		this.initData = undefined;
		this.chartData = undefined;
		this.dataFlag = undefined;
		this.nameFlag = undefined;
		this.btnNext = undefined;
		this.scrollRange = undefined;
		this.i18 = I18n.resource.admin.projectConfigure;
	}

	PaneProjectConfigure.prototype = {
		show: function () {
			var _this = this;
			WebAPI.get('/static/views/admin/paneProjectConfigure.html').done(function (resultHtml) {
				$('#indexMain').html(resultHtml);
				_this.init();
			});
		},
		init: function () {
			this.stepCur = 0; //当前步骤序号
			this.stepNext = -1; //下一个步骤序号
			this.stepPre = -1; //上一个步骤序号
			this.stepPreShow = -1; //上一步执行的步骤
			this.stepAll = 4; //步骤数量
			this.curPic = 0; //当前模板序号
			this.nextPic = -1; //下一张模板序号
			this.prePic = -1; //上一张模板序号
			this.preShowPic = -1; //上一张显示的模板
			this.allPic = $('.step3LiLg').length; //模板数量
			this.dataFlag = 0; //判断数据是否输入正确
			this.nameFlag = 0; //判断项目名称是否输入正确
			this.btnNext = this.i18.NEXT;
			this.btnFinish = this.i18.FINISH;
			var _this = this;
			var windowWidth = $(window).width();
			if (windowWidth > 1200) {
				this.scrollRange = 6;
			} else if (windowWidth > 992) {
				this.scrollRange = 5;
			} else {
				this.scrollRange = 3;
				this.scrollRange = 3
			}
			//初始化
			_this.stepInit();
			$('#returnMain').click(function () {
			    ScreenManager.show(ProjectManager);
			});
			$('.configNavA').click(function () {
				if (!$(this).hasClass('configNavEdit')) {
					var i = $('.configNavA').index(this);
					if (i > -1) {
						_this.stepJump(i);
						_this.wholeJudge();
					} else {
						alert("No configNavA exist.");
					}
				}
			});

			//上一步
			$('#stepPre').click(function () {
				_this.stepMinus();
			});
			//下一步
			$('#stepNext').click(function () {
				_this.stepPlus();
			});
			$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
				var activeTab = $(e.target)[0].id;
				if (_this.stepCur == 3)
					_this.chartDraw();
			});
			//step1脚本
			$('#newProName').change(function (e) {
				var $newProName = $('#newProName');
				if (($newProName.val() == null) || ($newProName.val() == undefined) || ($newProName.val() == '')) {
					_this.dataFlag = 0;
				} else {
					_this.dataFlag = 1;
				}
				if (_this.dataFlag && _this.nameFlag) {
					$('#configNavA4').removeClass('disabled');
				} else {
					$('#configNavA4').addClass('disabled');
				}
			});
			//step2脚本
			$('#newProData').change(function(e){
				document.getElementById('newProPath').value=this.value;
				_this.uploadConfigData();
			});
			//$('#newProDataSubmit').click(function () {
			//	_this.uploadConfigData();
			//});
			$('#step2-data-delete').click(function () {
				_this.tableInit();
			});
			$('#step2DataDllSel').click(function (e) {
				var arr = document.getElementsByClassName('chk-flag');
				for (var i = 0; i < arr.length; i++) {
					arr[i].checked = true;
				}
			});
			$('#step2DataReverseSel').click(function (e) {
				var arr = document.getElementsByClassName('chk-flag');
				for (var i = 0; i < arr.length; i++) {
					arr[i].checked = !(arr[i].checked);
				}
			});
			//step3脚本
			_this.modelSelInit();
			_this.btnlgInit();
			_this.btnsmInit();
			_this.smallPicSelected();
			//大图标按键功能
			$('#step3BtnLgLeft').click(function () {
				_this.modelSelMinus();
			});

			$('#step3BtnLgRight').click(function () {
				_this.modelSelPlus();
			});
			//小图标按键功能
			$('.step3LiSm').click(function () {
				if ($(this).attr('class') != 'step3ModelSelSm') {
					var i = $(".step3LiSm").index(this);
					_this.modelSelJump(i);
					_this.btnlgInit();
					_this.smallPicSelected();
				}
				//alert('cur'+stepCur);
			});

			$('#step3BtnSmLeft').click(function () {
				var $step3ModelNavUl = $('#step3ModelNavUl');
				var $step3BtnSmRight = $('#step3BtnSmRight');
				var leftPosition = $step3ModelNavUl.css('left');
				var leftPositionNum = Number(leftPosition.substring(0, (leftPosition.length - 2)));
				leftPosition = leftPositionNum + 147 + 'px';
				var bestLeftNum = -($('.step3LiSm').length - _this.scrollRange) * 147;
				if (leftPosition == '0px') {
					if (!$(this).hasClass('disabled')) {
						$(this).addClass('disabled');
					}
				}
				if ((leftPositionNum + 147) > bestLeftNum && $step3BtnSmRight.hasClass('disabled')) {
					$step3BtnSmRight.removeClass('disabled');
				}
				if ($step3ModelNavUl.attr('rel') == 'stop') {
					$step3ModelNavUl.attr('rel', 'moving');
					$step3ModelNavUl.stop();
					$step3ModelNavUl.animate({left: leftPosition}, 200, function () {
						$step3ModelNavUl.attr('rel', 'stop');
					});
				}
			});
			$('#step3BtnSmRight').click(function () {
				var $step3ModelNavUl = $('#step3ModelNavUl');
				var $step3BtnSmLeft = $('#step3BtnSmLeft');
				var leftPosition = $step3ModelNavUl.css('left');
				var leftPositionNum = Number(leftPosition.substring(0, (leftPosition.length - 2)));
				leftPosition = leftPositionNum - 147 + 'px';
				var bestLeftNum = -($('.step3LiSm').length - _this.scrollRange) * 147;
				if ((leftPositionNum - 147) == bestLeftNum) {
					$(this).addClass('disabled');
				}
				if (leftPositionNum == 0 && $step3BtnSmLeft.hasClass('disabled')) {
					$step3BtnSmLeft.removeClass('disabled');
				}
				if ($step3ModelNavUl.attr('rel') == 'stop') {
					//alert(leftPosition);
					$step3ModelNavUl.attr('rel', 'moving');
					$step3ModelNavUl.stop();
					$step3ModelNavUl.animate({left: leftPosition}, 200, function () {
							$step3ModelNavUl.attr('rel', 'stop');
						}
					);
				}
			});

		},
		//导航步骤处理过程
		stepInit: function () {
			this.stepNext = this.stepCur + 1;
			this.stepPre = this.stepAll - 1;
		},
		stepPlus: function () {
			var $stepPre = $('#stepPre');
			var $stepNext = $('#stepNext');
			if (this.stepCur < (this.stepAll - 1)) {
				this.stepPre = this.stepCur;
				this.stepCur = this.stepNext;
				this.stepNext = this.stepCur + 1;
				this.stepPreShow = this.stepPre;
				$('#configNavA' + (this.stepCur + 1)).tab('show');
			}
			$('#configNavSpan' + (this.stepPre + 1)).removeClass('glyphicon-edit configNavEdit').addClass('glyphicon-check configNavComplete');
			$('#configNavSpan' + (this.stepCur + 1)).removeClass('glyphicon-check glyphicon-exclamation-sign configNavErr configNavPend configNavComplete').addClass('glyphicon-edit configNavEdit');
			this.wholeJudge();
			if (this.stepCur > 0 && ($stepPre.hasClass('disabled'))) {
				$stepPre.removeClass('disabled');
			}
			if (this.stepCur == (this.stepAll - 1)) {
				if ($stepNext.text() != this.btnFinish) {
					$stepNext.text(this.btnFinish);
				} else {
					this.finalDataUpload();
				}
			}
		},
		stepMinus: function () {
			var $stepPre = $('#stepPre');
			var $stepNext = $('#stepNext');
			this.stepNext = this.stepCur;
			this.stepCur = this.stepPre;
			this.stepPre = this.stepCur - 1;
			this.stepPreShow = this.stepNext;
			$('#configNavA' + (this.stepCur + 1)).tab('show');
			$('#configNavSpan' + (this.stepNext + 1)).removeClass('glyphicon-edit configNavEdit').addClass('glyphicon-check configNavComplete');
			$('#configNavSpan' + (this.stepCur + 1)).removeClass('glyphicon-check glyphicon-exclamation-sign configNavErr configNavPend configNavComplete').addClass('glyphicon-edit configNavEdit');
			this.wholeJudge();
			if (this.stepCur == 0 && (!$stepPre.hasClass('disabled'))) {
				$stepPre.addClass('disabled');
			}
			if (this.stepCur < this.stepAll && ($stepNext.text() != this.btnNext)) {
				$stepNext.text(this.btnNext);
			}
		},
		stepJump: function (num) {
			var $stepPre = $('#stepPre');
			var $stepNext = $('#stepNext');
			this.stepPreShow = this.stepCur;
			this.stepCur = num;
			this.stepPre = num - 1;
			this.stepNext = num + 1;
			$('#configNavSpan' + (this.stepPreShow + 1)).removeClass('glyphicon-edit configNavEdit').addClass('glyphicon-check configNavComplete');
			$('#configNavSpan' + (this.stepCur + 1)).removeClass('glyphicon-check glyphicon-exclamation-sign configNavErr configNavPend configNavComplete').addClass('glyphicon-edit configNavEdit');
			//alert(stepCur);
			if (this.stepCur == 0) {
				$stepPre.addClass('disabled');
				$stepNext.text(this.btnNext);
			} else if (this.stepCur == (this.stepAll - 1)) {
				$stepNext.text(this.btnFinish);
				$stepPre.removeClass('disabled');
			} else {
				$stepPre.removeClass('disabled');
				$stepNext.text(this.btnNext);
			}
		},
		//判断所需数据是否输入
		dataJudge: function () {
			var dataFlag = 0;
			if ((this.chartData == undefined) || (this.chartData[0].value.length == 0)) {
				$('#configNavSpan2').removeClass('glyphicon-check glyphicon-edit configNavPend configNavComplete configNavEdit').addClass('glyphicon-exclamation-sign configNavErr');
				dataFlag = 0;
			} else {
				$('#configNavSpan2').removeClass('glyphicon-exclamation-sign configNavErr').addClass('glyphicon-check configNavComplete');
				dataFlag = 1;
			}
			return dataFlag;
		},
		//判断名字是否输入
		proNameJudge: function () {
			var $newProName = $('#newProName');
			var nameFlag = 0;
			if (($newProName.val() == null) || ($newProName.val() == undefined) || ($newProName.val() == '')) {
				$('#configNavSpan1').removeClass('glyphicon-check glyphicon-edit configNavPend configNavComplete configNavEdit').addClass('glyphicon-exclamation-sign configNavErr');
				nameFlag = 0;
			} else {
				$('#configNavSpan1').removeClass('glyphicon-exclamation-sign configNavErr').addClass('glyphicon-check configNavComplete');
				nameFlag = 1;
			}
			return nameFlag;
		},
		//判断表格所需数据是否输入
		wholeJudge: function () {
			var $stepNext = $('#stepNext');
			if (this.stepPreShow == 0) {
				this.nameFlag = this.proNameJudge();
			}
			if (this.stepPreShow == 1) {
				this.dataGet();
				this.dataFlag = this.dataJudge();
			}
			if (this.dataFlag && this.nameFlag) {
				$stepNext.removeClass('disabled');
				$('#configNavA4').removeClass('disabled');
			} else {
				$('#configNavA4').addClass('disabled');
				if (this.stepCur == 2) {
					$stepNext.addClass('disabled');
				} else {
					$stepNext.removeClass('disabled');
				}
			}
		},
		//step2脚本
		tableInit: function () {
			var $initData = $('#initData');
			$initData.find('thead').remove();
			$initData.find('tr').remove();
			this.initData = undefined;
			this.chartData = undefined;
		},

		//step3脚本
		////模板选择
		modelSelInit: function () {
			if (this.allPic > 1) {
				this.nextPic = this.curPic + 1;
				this.prePic = this.allPic - 1;
			} else if (this.allPic == 1) {
				this.nextPic = 0;
				this.prePic = 0;
			}
			$('.step3LiLg:eq(' + this.curPic + ')').fadeIn().css('display', 'inline');
		},
		modelSelPlus: function () {
			var $step3LiLg = $('.step3LiLg');
			var $step3BtnLgLeft = $('#step3BtnLgLeft');
			this.preShowPic = this.curPic;
			this.prePic = this.curPic;
			this.curPic = this.nextPic;
			if (this.curPic < (this.allPic - 1)) {
				this.nextPic = this.curPic + 1;
			} else if (this.curPic == (this.allPic - 1)) {
				this.nextPic = 0;
			}
			$step3LiLg.eq(this.curPic).fadeIn().css('display', 'inline');
			if (this.preShowPic != this.curPic) {
				$step3LiLg.eq(this.preShowPic).css('display', 'none');
			}
			this.btnsmInit();
			this.smallPicSelected();
			this.smallPicScroll();
			//alert($('.btn-lg:eq(0)').hasClass('disabled'));
			if (this.curPic == (this.allPic - 1)) {
				$('#step3BtnLgRight').addClass('disabled');
			}
			if (this.curPic > 0 && $step3BtnLgLeft.hasClass('disabled')) {
				$step3BtnLgLeft.removeClass('disabled');
			}
		},
		modelSelMinus: function () {
			var $step3LiLg = $('.step3LiLg');
			var $step3BtnLgRight = $('#step3BtnLgRight');
			this.preShowPic = this.curPic;
			this.nextPic = this.curPic;
			this.curPic = this.prePic;
			if (this.curPic > 0) {
				this.prePic = this.curPic - 1;
			} else if (this.curPic == 0 && this.allPic > 1) {
				this.prePic = this.allPic - 1;
			}
			$step3LiLg.eq(this.curPic).fadeIn().css('display', 'inline');
			if (this.preShowPic != this.curPic) {
				$step3LiLg.eq(this.preShowPic).css('display', 'none');
			}
			this.btnsmInit();
			this.smallPicSelected();
			this.smallPicScroll();
			if (this.curPic == 0) {
				$('#step3BtnLgLeft').addClass('disabled');
			}
			if (this.curPic < (this.allPic - 1) && $step3BtnLgRight.hasClass('disabled')) {
				$step3BtnLgRight.removeClass('disabled');
			}
		},
		modelSelJump: function (num) {
			var $step3LiLg = $('.step3LiLg');
			this.preShowPic = this.curPic;
			this.curPic = num;
			if (this.curPic == (this.allPic - 1)) {
				this.nextPic = 0;
				if (this.allPic > 1) {
					this.prePic = this.curPic - 1;
				} else if (this.allPic == 1) {
					this.prePic = 0;
				}
			} else if (this.curPic == 0) {
				this.prePic = this.allPic - 1;
				if (this.allPic > 1) {
					this.nextPic = 1;
				} else if (this.allPic == 1) {
					this.nextPic = 0;
				}
			} else {
				this.nextPic = this.curPic + 1;
				this.prePic = this.curPic - 1;
			}
			$step3LiLg.eq(this.curPic).fadeIn().css('display', 'inline');
			if (this.preShowPic != this.curPic) {
				$step3LiLg.eq(this.preShowPic).css('display', 'none');
			}
		},
		//大图标初始化
		btnlgInit: function () {
			//alert('init');
			var $step3BtnLgLeft = $('#step3BtnLgLeft');
			var $step3BtnLgRight = $('#step3BtnLgRight');
			if (this.allPic < 2) {
				$step3BtnLgLeft.addClass('disabled');
				$step3BtnLgRight.addClass('disabled');
			} else {
				if (this.curPic == 0) {
					$step3BtnLgLeft.addClass('disabled');
					$step3BtnLgRight.removeClass('disabled');
				} else if (this.curPic == (this.allPic - 1)) {
					$step3BtnLgRight.addClass('disabled');
					$step3BtnLgLeft.removeClass('disabled');
				} else {
					$step3BtnLgRight.removeClass('disabled');
					//alert('right show');
					$step3BtnLgLeft.removeClass('disabled');
					//alert('left show');
				}
			}
		},
		//小图标初始化
		btnsmInit: function () {
			var $step3BtnSmLeft = $('#step3BtnSmLeft');
			var $step3BtnSmRight = $('#step3BtnSmRight');
			if (this.curPic > 2 && (this.allPic - this.curPic) > 4) {
				if ($step3BtnSmLeft.hasClass('disabled')) {
					$step3BtnSmLeft.removeClass('disabled');
				}
				if ($step3BtnSmRight.hasClass('disabled')) {
					$step3BtnSmRight.removeClass('disabled');
				}
			} else if (this.curPic < 3) {
				if (!$step3BtnSmLeft.hasClass('disabled')) {
					$step3BtnSmLeft.addClass('disabled');
				}
				if (this.allPic > 6) {
					if ($step3BtnSmRight.hasClass('disabled')) {
						$step3BtnSmRight.removeClass('disabled');
					}
				} else {
					if (!$step3BtnSmRight.hasClass('disabled')) {
						$step3BtnSmRight.addClass('disabled');
					}
				}
			} else if (this.curPic > (this.allPic - 4)) {
				if (!$step3BtnSmRight.hasClass('disabled')) {
					$step3BtnSmRight.addClass('disabled');
				}
				if (this.allPic > 6) {
					if ($step3BtnSmLeft.hasClass('disabled')) {
						$step3BtnSmLeft.removeClass('disabled');
					}
				} else {
					if (!$step3BtnSmLeft.hasClass('disabled')) {
						$step3BtnSmLeft.addClass('disabled');
					}
				}
			}
		},
		//小图标签selected函数
		smallPicSelected: function () {
			var $step3LiSm = $('.step3LiSm');
			if (!$step3LiSm.eq(this.curPic).hasClass('step3ModelSelSm')) {
				$step3LiSm.eq(this.curPic).addClass('step3ModelSelSm');
			}
			if (this.preShowPic != (-1)) {
				if ($step3LiSm.eq(this.preShowPic).hasClass('step3ModelSelSm')) {
					$step3LiSm.eq(this.preShowPic).removeClass('step3ModelSelSm');
				}
			}
		},

		//小图滚动函数
		smallPicScroll: function () {
			var $step3ModelNavUl = $('#step3ModelNavUl');
			var $step3LiSm = $('.step3LiSm');
			if (this.curPic != this.preShowPic) {
				var leftPosition = 0;
				if (this.curPic > 2 && this.curPic < ($step3LiSm.length - 3)) {
					leftPosition = -(this.curPic - 2) * 147;
				} else if (this.curPic > ($step3LiSm.length - 4) && $step3LiSm.length > 6) {
					leftPosition = -($step3LiSm.length - this.scrollRange) * 147;
				}
				leftPosition += 'px';
				$step3ModelNavUl.attr('rel', 'moving');
				$step3ModelNavUl.animate({left: leftPosition}, 200, function () {
					$step3ModelNavUl.attr('rel', 'stop');
				});
			}
		},
		//文件数据上传
		uploadConfigData: function () {
			var _this = this;
			var fileObj = document.getElementById("newProData").files[0];// 获取文件对象
			var form = new FormData();
			if (this.initData != undefined) {
				this.tableInit();
			}
			form.append("config-file", fileObj);// 文件对象
			var xhr = new XMLHttpRequest();
			xhr.onload = function () {
				if (xhr.readyState == 4 && xhr.status == 200) {
					//alert(xhr.responseText);
					_this.initData = JSON.parse(xhr.responseText);
					new UploadConfigData(_this.initData).show();
				}
				else {
					alert(this.i18.READ_DATA_FAILED);
				}
			};
			xhr.open('post', '/get_config_data', true);
			xhr.send(form);
		},
		dataGet: function () {
			if (this.initData != undefined) {
				var selDateNum = $(".chkPtSel input:checked").length;
				var ptSelData = new Array();
				for (var i = 0; i < this.initData.length; ++i) {
					ptSelData[i] = new Object();
					ptSelData[i].pointName = this.initData[i].pointName;
					ptSelData[i].value = new Array();
				}
				this.proName = $('#newProName').val();
				var selIndex;
				for (var i = 0; i < selDateNum; ++i) {
					selIndex = $(".chkPtSel input:checked").eq(i).closest('tr').index();
					for (var j = 0; j < this.initData.length; ++j) {
						ptSelData[j].value.push(this.initData[j].value[selIndex]);
					}
				}
				this.chartData = ptSelData;
			}
		},
		//根据图片制表
		chartDraw: function () {
			var myChart1 = echarts.init(document.getElementById('step4Chart1'), AppConfig.chartTheme);
			var myChart2 = echarts.init(document.getElementById('step4Chart2'), AppConfig.chartTheme);
			var myChart3 = echarts.init(document.getElementById('step4Chart3'), AppConfig.chartTheme);
			var myChart4 = echarts.init(document.getElementById('step4Chart4'), AppConfig.chartTheme);
			var legendData = new Array();
			var seriesData1 = new Array();
			var seriesData2 = new Array();
			var xAxisData = new Array();
			legendData.push('2013' + this.chartData[0].pointName);
			legendData.push('2014' + this.chartData[0].pointName);
			for (var i = 0; i < this.chartData[0].value.length / 2; ++i) {
				xAxisData[i] = this.chartData[0].value[i].time.substr(5);
			}
			for (var i = 0; i < this.chartData[0].value.length / 2; ++i) {
				seriesData1.push(this.chartData[0].value[i].value);
			}
			for (var i = this.chartData[0].value.length / 2; i < this.chartData[0].value.length; ++i) {
				seriesData2.push(this.chartData[0].value[i].value);
			}
			var option1 = {
				backgroundColor: 'rgba(0,0,0,0)',
				grid: {
					x: 70,
					y: 25,
					x2: 15,
					y2: 25
				},
				tooltip: {
					trigger: 'axis'
				},
				legend: {
					data: legendData
				},
				toolbox: {
					show: false
				},
				calculable: true,
				xAxis: [
					{
						type: 'category',
						data: xAxisData
					}
				],
				yAxis: [
					{
						type: 'value'
					}
				],
				series: [
					{
						name: '2013低温冰机',
						type: 'line',
						data: seriesData1
						//markPoint : {
						//	data : [
						//		{type : 'max', name: '最大值'},
						//		{type : 'min', name: '最小值'}
						//	]
						//},
						//markLine : {
						//	data : [
						//		{type : 'average', name: '平均值'}
						//	]
						//}
					},
					{
						name: '2014低温冰机',
						type: 'line',
						data: seriesData2
						//markPoint : {
						//	data : [
						//		{type : 'max', name: '最大值'},
						//		{type : 'min', name: '最小值'}
						//	]
						//},
						//markLine : {
						//	data : [
						//		{type : 'average', name : '平均值'}
						//	]
						//}
					}
				]
			};
			legendData = new Array();
			seriesData1 = new Array();
			seriesData2 = new Array();
			xAxisData = new Array();
			legendData.push('2013' + this.chartData[1].pointName);
			legendData.push('2014' + this.chartData[1].pointName);
			for (var i = 0; i < this.chartData[1].value.length / 2; ++i) {
				xAxisData[i] = this.chartData[1].value[i].time.substr(5);
			}
			for (var i = 0; i < this.chartData[1].value.length / 2; ++i) {
				seriesData1.push(this.chartData[1].value[i].value);
			}
			for (var i = this.chartData[1].value.length / 2; i < this.chartData[1].value.length; ++i) {
				seriesData2.push(this.chartData[1].value[i].value);
			}
			var option2 = {
				backgroundColor: 'rgba(0,0,0,0)',
				grid: {
					x: 70,
					y: 25,
					x2: 15,
					y2: 25
				},
				tooltip: {
					trigger: 'axis'
				},
				legend: {
					data: legendData
				},
				toolbox: {
					show: false
				},
				calculable: true,
				xAxis: [
					{
						type: 'category',
						data: xAxisData
					}
				],
				yAxis: [
					{
						type: 'value'
					}
				],
				series: [
					{
						name: '2013低温冷冻泵',
						type: 'line',
						data: seriesData1
						//markPoint : {
						//	data : [
						//		{type : 'max', name: '最大值'},
						//		{type : 'min', name: '最小值'}
						//	]
						//},
						//markLine : {
						//	data : [
						//		{type : 'average', name: '平均值'}
						//	]
						//}
					},
					{
						name: '2014低温冷冻泵',
						type: 'line',
						data: seriesData2
						//markPoint : {
						//	data : [
						//		{type : 'max', name: '最大值'},
						//		{type : 'min', name: '最小值'}
						//	]
						//},
						//markLine : {
						//	data : [
						//		{type : 'average', name : '平均值'}
						//	]
						//}
					}
				]
			};

			legendData = new Array();
			seriesData1 = new Array();
			seriesData2 = new Array();
			xAxisData = new Array();
			legendData.push('2013' + this.chartData[2].pointName);
			legendData.push('2014' + this.chartData[2].pointName);
			for (var i = 0; i < this.chartData[2].value.length / 2; ++i) {
				xAxisData[i] = this.chartData[2].value[i].time.substr(5);
			}
			for (var i = 0; i < this.chartData[2].value.length / 2; ++i) {
				seriesData1.push(this.chartData[2].value[i].value);
			}
			for (var i = this.chartData[2].value.length / 2; i < this.chartData[2].value.length; ++i) {
				seriesData2.push(this.chartData[2].value[i].value);
			}
			var option3 = {
				backgroundColor: 'rgba(0,0,0,0)',
				grid: {
					x: 70,
					y: 25,
					x2: 15,
					y2: 25
				},
				tooltip: {
					trigger: 'axis'
				},
				legend: {
					data: legendData
				},
				toolbox: {
					show: false
				},
				calculable: true,
				xAxis: [
					{
						type: 'category',
						data: xAxisData
					}
				],
				yAxis: [
					{
						type: 'value'
					}
				],
				series: [
					{
						name: '2013低冷却泵',
						type: 'line',
						data: seriesData1
						//markPoint : {
						//	data : [
						//		{type : 'max', name: '最大值'},
						//		{type : 'min', name: '最小值'}
						//	]
						//},
						//markLine : {
						//	data : [
						//		{type : 'average', name: '平均值'}
						//	]
						//}
					},
					{
						name: '2014低温冷却泵',
						type: 'line',
						data: seriesData2
						//markPoint : {
						//	data : [
						//		{type : 'max', name: '最大值'},
						//		{type : 'min', name: '最小值'}
						//	]
						//},
						//markLine : {
						//	data : [
						//		{type : 'average', name : '平均值'}
						//	]
						//}
					}
				]
			};

			legendData = new Array();
			seriesData1 = new Array();
			seriesData2 = new Array();
			xAxisData = new Array();
			legendData.push('2013');
			legendData.push('2014');
			var dataSum = 0;
			for (var i = 0; i < 10; ++i) {
				xAxisData[i] = this.chartData[i].pointName;
			}
			for (var i = 0; i < 10; ++i) {
				dataSum = 0;
				for (var j = 0; j < this.chartData[i].value.length / 2; ++j) {
					if (!isNaN(parseInt(this.chartData[i].value[j].value))) {
						dataSum = dataSum + parseInt(this.chartData[i].value[j].value);
					}
				}
				seriesData1.push(dataSum);
			}
			for (var i = 0; i < 10; ++i) {
				dataSum = 0;
				for (var j = this.chartData[i].value.length / 2; j < this.chartData[i].value.length; ++j) {
					if (!isNaN(parseInt(this.chartData[i].value[j].value))) {
						dataSum = dataSum + parseInt(this.chartData[i].value[j].value);
					}
				}
				seriesData2.push(dataSum);
			}
			var option4 = {
				backgroundColor: 'rgba(0,0,0,0)',
				grid: {
					x: 70,
					y: 25,
					x2: 15,
					y2: 25
				},
				tooltip: {
					trigger: 'axis'
				},
				legend: {
					data: legendData
				},
				toolbox: {
					show: false
				},
				calculable: true,
				xAxis: [
					{
						type: 'category',
						data: xAxisData
					}
				],
				yAxis: [
					{
						type: 'value'
					}
				],
				series: [
					{
						name: '2013能效',
						type: 'bar',
						data: seriesData1
						//markPoint : {
						//	data : [
						//		{type : 'max', name: '最大值'},
						//		{type : 'min', name: '最小值'}
						//	]
						//},
						//markLine : {
						//	data : [
						//		{type : 'average', name: '平均值'}
						//	]
						//}
					},
					{
						name: '2014能效',
						type: 'bar',
						data: seriesData2
						//markPoint : {
						//	data : [
						//		{type : 'max', name: '最大值'},
						//		{type : 'min', name: '最小值'}
						//	]
						//}
					}
				]
			};

			// 为echarts对象加载数据
			myChart1.setOption(option1);
			myChart2.setOption(option2);
			myChart3.setOption(option3);
			myChart4.setOption(option4);
		},
		finalDataUpload: function () {
			var _this = this;
			WebAPI.post('/project/create', {
				projName: this.proName,
				pointData: this.chartData,
				userName: AppConfig.account,
				userId: AppConfig.userId
			}).done(function (data) {
				if (data.error) alert(I18n.resource.admin.projectConfigure.UPLOAD_PROJECT_FAILED);
				else {
				    WebAPI.post('/project/update', { userId: AppConfig.userId }).done(function (proList) {
						if (proList.error) alert(I18n.resource.admin.projectConfigure.UPDATE_FAILED);
						else AppConfig.projectList = proList;
					});
					new PaneProjectSelector().initProject(data, _this.proName).done(function(){
						ScreenManager.show(EnergyScreen);
					});
				}
			})
		}
	}
	return PaneProjectConfigure;
})();
//上传文件进行处理

var UploadConfigData = (function () {
	function UploadConfigData(data) {
		this.m_data = data;
		this.i18 = I18n.admin.projectConfigure;
		//alert(this.m_data);
	}

	UploadConfigData.prototype = {
		show: function() {
			var _this = this;
			var $tbody = $('#initDataTbody');
			var tr;
			var thead;
			var th;
			var td;
			//alert(_this.m_data);
			var jsonData = _this.m_data;
			if (jsonData.length && jsonData.length > 0) {
				thead = document.getElementById('initData').createTHead();
				th = document.createElement('th');
				th.innerHTML = this.i18.SELECT;
				thead.appendChild(th);
				th = document.createElement('th');
				th.innerHTML = this.i18.DATE;
				thead.appendChild(th);
				for (var i = 0; i < jsonData.length ; ++i){
					th = document.createElement('th');
					th.className = 'ptName';
					th.innerHTML = jsonData[i].pointName;
					thead.appendChild(th);
				}
				for (var i = 0; i < jsonData[0].value.length; i++) {

					tr = document.createElement('tr');
					td = document.createElement('td');
					td.className = 'chkPtSel';
					td.innerHTML = "<input type='checkbox' class='chk-flag' />";
					tr.appendChild(td);

					td = document.createElement('td');
					td.className = 'ptTime';
					td.innerHTML = jsonData[0].value[i].time;
					tr.appendChild(td);

					for (var j = 0; j < jsonData.length; j++){
						td = document.createElement('td');
						td.className = 'ptValue';
						td.innerHTML = jsonData[j].value[i].value;
						tr.appendChild(td);
					}
					tbody = document.createElement('tbody');
					$tbody.append(tr);
				}
			} else {
				$tbody.append("<tr><td colspan=3>"+i18.NO_DATA_READ+"</td></tr>");
			}
		}
	}

	return UploadConfigData;
})();