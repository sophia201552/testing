var ModalRankNormal = (function(){
    function ModalRankNormal(screen, entityParams) {
        if (!entityParams) return;
        ModalBase.call(this, screen, entityParams, this.renderModal, this.updateModal, this._showConfig);
        this.modal = entityParams.modal;
        this.chart = echarts.init(this.container, AppConfig.chartTheme);
        this.m_langFlag = ('zh' == localStorage['language']) ? 0 : 1;   // 0：zh，1：en
        this.spinner.spin(this.container);
    };
    ModalRankNormal.prototype = new ModalBase();
    ModalRankNormal.prototype.optionTemplate = {
        name:'toolBox.modal.RANK_CHART',
        parent:0,
        mode:['modalRankNormal'],
        maxNum:10,
        title:'',
        minHeight:2,
        minWidth:3,
        maxHeight:6,
        maxWidth:12,
        type:'ModalRankNormal'
    };

    ModalRankNormal.prototype.show = function() {
        this.init();
    }

    ModalRankNormal.prototype.init = function() {
    }

    ModalRankNormal.prototype.renderModal = function (e) {
        var _this = this;

        var arrPoint = _this.modal.points;
        var postData = {'dataSourceId':0,'dsItemIds':arrPoint};
        WebAPI.post('/analysis/startWorkspaceDataGenPieChart', postData).done(function (result) {
            var data = JSON.parse(result);
            _this.drawRankChart(data);
        }).always(function (e) {
            _this.spinner.stop();
        });
    }

    ModalRankNormal.prototype.updateModal = function () {
    }
    ModalRankNormal.prototype.showConfigModal = function () {
    }
    ModalRankNormal.prototype._showConfig = function () {
    }
    ModalRankNormal.prototype.setModalOption = function (option) {
    }

    ModalRankNormal.prototype.drawRankChart = function (dataSrc) {
        var _this = this;
        var yAxis = [];
        var showValue = [];

        for (var i= dataSrc.length-1; i>=0; i--) {
            var itemName = AppConfig.datasource.getDSItemById(dataSrc[i].dsItemId).alias;
            yAxis.push(itemName);
            showValue.push(parseInt(dataSrc[i].data));
        }

        var chartOption = {
			title : {
					subtext: ''
				},
			tooltip : {
				trigger : 'axis',
				axisPointer : {
					type : 'shadow'
				}
			},
			legend: {
				data : [],
                show : false
			},
			calculable : false,
            grid: {
                x: 100,
                y: 10,
                x2: 20,
                y2: 40
            },
			xAxis : [
				{
					type : 'value'
				}
			],
			yAxis : [
				{
					type : 'category',
					axisTick : {show: false},
                    axisLabel : {
                        show: true,
                        rotate: 45
                    },
                    data : yAxis
				}
			],
			series : [
				{
					name : 'value',
					type : 'bar',
					data : showValue,
					itemStyle: {
						normal: {
							label : {show: true, position: 'inside'},
							barBorderRadius: [0, 5, 5, 0]
						},
						emphasis: {
							barBorderRadius: [0, 5, 5, 0]
						}
					}
				}
			]
        };
        _this.chart.setOption(chartOption);
    }

    return ModalRankNormal;
})();