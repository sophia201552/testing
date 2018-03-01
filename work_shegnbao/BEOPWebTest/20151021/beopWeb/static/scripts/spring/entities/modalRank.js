var ModalRankConfig = (function ($, window, undefined) {

    function ModalRankConfig(options) {
        ModalConfig.call(this, options);
    }

    ModalRankConfig.prototype = Object.create(ModalConfig.prototype);
    ModalRankConfig.prototype.constructor = ModalRankConfig;


    ModalRankConfig.prototype.DEFAULTS = {
        htmlUrl: '/static/views/observer/widgets/modalRank.html'
    };

    ModalRankConfig.prototype.init = function () {
        this.$dropArea = $('.drop-area', this.$wrap);
        this.$btnSubmit = $('.btn-submit', this.$wrap);
        this.$rankPointList = $('#rankPointList', this.$wrap);
        this.$radioRankAsc = $('#radioRankAsc', this.$wrap);
        this.$radioRankDesc = $('#radioRankDesc', this.$wrap);
        //this.$btnChoosePt = $('#btnRankChoPt', this.$wrap);

        this.attachEvents();
    };

    ModalRankConfig.prototype.recoverForm = function (modal) {
    	this._setField('input', this.$rankPointList, modal.points);
        if (0 == modal.desc || null == modal.desc) {
            this.$radioRankAsc.prop('checked', true);
            this.$radioRankDesc.prop('checked', false);
        }
        else {
            this.$radioRankAsc.prop('checked', false);
            this.$radioRankDesc.prop('checked', true);
        }
    };

    ModalRankConfig.prototype.reset = function () {
		this._setField('input', this.$rankPointList);
    };

    ModalRankConfig.prototype.attachEvents = function () {
        var _this = this;

        // submit EVENTS
        _this.$btnSubmit.off().click( function (e) {
            var modalIns = _this.options.modalIns;
            var modal = modalIns.entity.modal;

            // save to modal
            var ptList = _this.$rankPointList.val();
            modal.points = ptList.split(',');

            var radioVal = 0;
            if ($('#radioRankAsc')[0].checked) {
                radioVal = 0;
            }
            else {
                radioVal = 1;
            }
            modal.desc = radioVal;

            // close modal
            _this.$modal.modal('hide');
            e.preventDefault();
        } );
/*
        _this.$btnChoosePt.click(function(){
            WebAPI.get('/static/views/observer/dataSourceAdd.html').done(function (result) {
                _this.m_cfgPanel = new DataSourceConfigure(_this, 0, true, '', '', '', -1);
                _this.m_cfgPanel.show();
            }).error(function (result) {
            }).always(function (e) {
            });
        });*/
    };

    return ModalRankConfig;
} (jQuery, window));


var ModalRank = (function(){
    function ModalRank(screen, entityParams) {
        if (!entityParams) return;
        ModalBase.call(this, screen, entityParams, this.renderModal, this.updateModal, this._showConfig);
        this.modal = entityParams.modal;
        this.chart = echarts.init(this.container, AppConfig.chartTheme);
        this.m_langFlag = ('zh' == localStorage['language']) ? 0 : 1;   // 0：zh，1：en
        this.spinner.spin(this.container);
    };
    ModalRank.prototype = new ModalBase();
    ModalRank.prototype.optionTemplate = {
        name:'toolBox.modal.WHIRLWIND_CHART',
        parent:0,
        mode:'custom',
        maxNum: 10,
        title:'',
        minHeight:2,
        minWidth:3,
        maxHeight:6,
        maxWidth:12,
        type:'ModalRank'
    };

    ModalRank.prototype.show = function() {
        this.init();
    }

    ModalRank.prototype.init = function() {
    }

    ModalRank.prototype.renderModal = function (e) {
        var _this = this;
        var arrPrjId = [];
        for (var i= 0,len=AppConfig.projectList.length; i< len; i++) {
            arrPrjId.push(AppConfig.projectList[i].id);
        }
        var arrRankPt = _this.modal.points;
        var rankDesc = _this.modal.desc;
        var postData = {'projectIds':arrPrjId, 'points':arrRankPt, 'desc':rankDesc};

        var showlist = {list: []};
        var descFlag = 0;
        if (AppConfig.benchMark != undefined) {
            for (var i= 0,len=arrRankPt.length; i<len; i++) {
                for (var j= 0,len2=AppConfig.benchMark.length; j<len2; j++) {
                    for (var k= 0, len3=AppConfig.benchMark[j].points.length; k<len3; k++) {
                        if (arrRankPt[i] == AppConfig.benchMark[j].points[k]) {
                            showlist.list = AppConfig.benchMark[j].list;
                            descFlag = AppConfig.benchMark[j].desc;
                            break;
                        }
                    }
                }
            }
        }
        if (showlist.list.length > 0) {
            var flag = true;
            if (rankDesc != descFlag) {
                flag = false;
            }
            _this.drawRankChart(showlist, arrRankPt.length, flag);
        }
        else {
            WebAPI.post('/benchmark/getListByPointsAndProjectIds', postData).done(function (result) {
                _this.drawRankChart(result, arrRankPt.length, true);
            }).always(function (e) {
            });
        }
        _this.spinner.stop();
    }

    ModalRank.prototype.updateModal = function () {
    }

    ModalRank.prototype.showConfigModal = function () {
        this.configModal.setOptions({modalIns: this});
        this.configModal.show();
    }
    ModalRank.prototype._showConfig = function () {};

    ModalRank.prototype.setModalOption = function (option) {
    }

    ModalRank.prototype.drawRankChart = function (dataSrc, ptLen, sortFlag) {
        // dataSrc:画图数据
        // ptLen:点数量
        // sortFlag:排序标签，true：默认，false：反序
        var _this = this;
        var showValue = [];
        var yAxis = [];
        var prjId, prjName, ptVal;
        var curPrjId = AppConfig.projectId;
        if (sortFlag) {
            for (var i= dataSrc.list.length-1; i>=0; i--) {
                ptVal = dataSrc.list[i].value;
                if (-1 == ptVal) {
                    continue;
                }

                prjId = dataSrc.list[i].projectId;
                if (prjId == curPrjId) {
                    showValue.push({value:ptVal, itemStyle:{normal:{color:'#ff6347'}}});
                }
                else {
                    showValue.push(ptVal);
                }

                var findName = false;
                for (var j= 0,len2=AppConfig.projectList.length; j<len2; j++) {
                    if (prjId == AppConfig.projectList[j].id) {
                        findName = true;
                        break;
                    }
                }

                if (1 == ptLen) {
                    if (0 == _this.m_langFlag) {
                        yAxis.push(AppConfig.projectList[j].name_cn);
                    }
                    else {
                        yAxis.push(AppConfig.projectList[j].name_en);
                    }
                }
                else {
                    if (findName) {
                        if (0 == _this.m_langFlag) {
                            prjName = AppConfig.projectList[j].name_cn;
                        }
                        else {
                            prjName = AppConfig.projectList[j].name_en;
                        }
                        yAxis.push(prjName + '-' + dataSrc.list[i].name);
                    }
                    else {
                        yAxis.push(dataSrc.list[i].name);
                    }
                }
            }
        }
        else {
            for (var i= 0,len=dataSrc.list.length; i<len; i++) {
                ptVal = dataSrc.list[i].value;
                if (-1 == ptVal) {
                    continue;
                }

                prjId = dataSrc.list[i].projectId;
                if (prjId == curPrjId) {
                    showValue.push({value:ptVal, itemStyle:{normal:{color:'#ff6347'}}});
                }
                else {
                    showValue.push(ptVal);
                }

                var findName = false;
                for (var j= 0,len2=AppConfig.projectList.length; j<len2; j++) {
                    if (prjId == AppConfig.projectList[j].id) {
                        findName = true;
                        break;
                    }
                }

                if (1 == ptLen) {
                    if (0 == _this.m_langFlag) {
                        yAxis.push(AppConfig.projectList[j].name_cn);
                    }
                    else {
                        yAxis.push(AppConfig.projectList[j].name_en);
                    }
                }
                else {
                    if (findName) {
                        if (0 == _this.m_langFlag) {
                            prjName = AppConfig.projectList[j].name_cn;
                        }
                        else {
                            prjName = AppConfig.projectList[j].name_en;
                        }
                        yAxis.push(prjName + '-' + dataSrc.list[i].name);
                    }
                    else {
                        yAxis.push(dataSrc.list[i].name);
                    }
                }
            }
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
				data : ['value'],
                show : false
			},
			calculable : false,
            grid: {
                x: 100,
                y: 10,
                x2: 20,
                y2: 60
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

    ModalRank.prototype.configModal = new ModalRankConfig();

    return ModalRank;
})();