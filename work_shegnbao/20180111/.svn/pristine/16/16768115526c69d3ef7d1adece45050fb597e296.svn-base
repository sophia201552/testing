var ModalEquipmentRateAndHistoryData = (function() {
    function ModalEquipmentRateAndHistoryData(screen, entityParams, _renderModal) {
        if (!screen) return;
        var renderModal = _renderModal ? _renderModal : this.renderModal;
        ModalBase.call(this, screen, entityParams, renderModal);

        this.pointsArr = [];
    }
    ModalEquipmentRateAndHistoryData.prototype = new ModalBase();
    ModalEquipmentRateAndHistoryData.prototype.optionTemplate = {
        name: 'toolBox.modal.EQUIPMENT_RATE_AND_HISTORY_DATA',
        parent: 0,
        mode: 'noConfigModal',
        maxNum: 1,
        title: '',
        minHeight: 2,
        minWidth: 4,
        maxHeight: 3,
        maxWidth: 6,
        type: 'ModalEquipmentRateAndHistoryData',
        scroll: false,
        tooltip: {
            'imgPC': true,
            'imgMobile': false,
            'isSpecData': false,
            'desc': ''
        }
    };
    ModalEquipmentRateAndHistoryData.prototype.resize = function() {
        this.chart && this.chart.resize();
    };
    ModalEquipmentRateAndHistoryData.prototype.renderModal = function() {
        var _this = this;
        var periodSwitch = '<ul class="periodSwitch rightCornerCtn">\
        						<li class="selected" data-periord="week" i18n="toolBox.EQUIPMENT_RATE_AND_HISTORY_DATA.WEEK"></li>\
        						<li data-periord="month" i18n="toolBox.EQUIPMENT_RATE_AND_HISTORY_DATA.MONTH"></li>\
        						<li data-periord="year" i18n="toolBox.EQUIPMENT_RATE_AND_HISTORY_DATA.YEAR"></li>\
        					</ul>';
        var equipDataCtn = '<div class="equipmentRatetHistoryData gray-scrollbar">\
        						<div class="ctn gray-scrollbar"></div>\
        						<div class="echartsBox"></div>\
        					</div>';
        var $container = $(this.container);
        if ($container.find('.dashboardCtn').length !== 0) {
            if ($container.find('.dashboardCtn').html() === '') {
                $container.append($(periodSwitch));
                $container.find('.dashboardCtn').html($(equipDataCtn));
                $container.find('.equipmentRatetHistoryData').css({ 'margin-top': 0, height: '100%' });
            }
        } else {
            $container.html('');
            $container.append($(periodSwitch));
            $container.append($(equipDataCtn));
        }
        var projectId = AppConfig.projectId;
        if (projectId === undefined) {
            return;
        }
        WebAPI.post('/analysis/startWorkspaceDataGenPieChart', { dsItemIds: '@' + projectId + '|Equip_IntactRate' }).done(function(result) {
            var dataList = result.dsItemList[0].data;
            var $equipDataCtn = $(_this.container).find('.equipmentRatetHistoryData');
            if (dataList.length === 0 || dataList === 'Null') {
                $equipDataCtn.html("<div class='noData' i18n='toolBox.modal_public.NO_DATA'></div>");
            } else {
                dataList = JSON.parse(dataList).data;
                var colorArr = ['#0078dc', '#00bbc3', '#29bb4f', '#fcb813', '#55acf4', '#e36229'];
                var j, title;
                for (var i = 0, len = dataList.length; i < len; i++) {
                    if (i > 5) {
                        j = i % 6;
                    } else {
                        j = i;
                    }
                    var num = Number(dataList[i].IntactRate.split("%")[0]).toFixed(1);
                    var goodNum = dataList[i].GoodNum;
                    var totalNum = dataList[i].TotalNum;
                    var faultNum = totalNum - goodNum;
                    _this.pointsArr.push('@' + projectId + '|' + dataList[i].IntactRatePoint);
                    if (I18n.type === 'zh') {
                        title = '本项目共有' + dataList[i].SubSystemName + ' ' + totalNum + ' 个&#10;BeOP本月为本项目累计检测出 ' + faultNum + ' 个故障';
                    } else {
                        title = totalNum + ' ' + dataList[i].SubSystemName + ' total.&#10; BeOP detected ' + faultNum + ' faults in this month.';
                    }
                    var str = '<div class="col-xs-4" title="' + title + '">\
                    				<div class="rate col-xs-6" style="background:' + colorArr[j] + '">' + num + '%</div>\
                    				<div class="col-xs-6">' + dataList[i].SubSystemName + '</dv>\
                    			</div>';
                    $(str).appendTo($equipDataCtn.find('.ctn'));
                }
            }
            I18n.fillArea($(_this.container));

            var startTime = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).format('yyyy-MM-dd 00:00:00');
            var endTime = new Date().format('yyyy-MM-dd 00:00:00');
            var period = 'd1';
            _this.getData(_this.pointsArr, startTime, endTime, period);

            _this.attatchEvents();
        })
    };

    ModalEquipmentRateAndHistoryData.prototype.getData = function(pointsArr, startTime, endTime, format) {
        var _this = this;
        //请求历史接口 拿到数据
        var postData = {
            dsItemIds: pointsArr,
            timeStart: startTime,
            timeEnd: endTime,
            timeFormat: format
        }
        WebAPI.post("/analysis/startWorkspaceDataGenHistogram", postData).done(function(rs) {
            console.log(rs)
            if (jQuery.isEmptyObject(rs)) {
                return;
            } else {
                var data = rs.list,
                    time = [];
                for (var i = 0, length = rs.timeShaft.length; i < length; i++) {
                    var currentTime;
                    if (format === 'd1') {
                        currentTime = rs.timeShaft[i].substr(5, 5);
                    } else {
                        currentTime = rs.timeShaft[i].substr(0, 7);
                        time.push(currentTime);
                    }
                    if (i !== length - 1) {
                        time.push(currentTime);
                    }
                }
                _this.renderChart(data, time);
            }
        })
    };

    ModalEquipmentRateAndHistoryData.prototype.renderChart = function(data, time) {
        var series = [];
        for (var i = 0; i < data.length; i++) {
            data[i].data.splice(0, 1);
            series.push({
                name: data[i].dsItemId.split('|')[1].split('_')[0],
                type: 'line',
                data: data[i].data,
                showSymbol: false
            });
        }
        var option = {
            color: ['#0078dc', '#00bbc3', '#29bb4f', '#fcb813', '#55acf4', '#e36229'],
            grid: {
                top: 10,
                right: 10,
                left: 50
            },
            tooltip: {
                trigger: 'axis',
                backgroundColor: "rgba(50,50,50,0)"
            },
            xAxis: {
                type: 'category',
                data: time
            },
            yAxis: {
                type: 'value',
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: 'rgba(20,20,20,0.4)'
                    }
                },
                axisLabel: {
                    formatter: function(value) {
                        if (value >= 1000000 || value <= -1000000) {
                            return value / 1000000 + 'm';
                        } else if (value >= 1000 || value <= -1000) {
                            return value / 1000 + 'k';
                        } else {
                            return value;
                        }
                    }
                }
            },
            series: series
        };
        this.chart = echarts.init($(this.container).find('.echartsBox')[0], AppConfig.chartTheme);
        this.chart.setOption(option);
    };

    ModalEquipmentRateAndHistoryData.prototype.attatchEvents = function(points) {
        var _this = this;
        $(this.container).off('click.jump').on('click.jump', function() {
            if (AppConfig.isFactory === 0) {
                ScreenManager.goTo({
                    page: 'observer.screens.PageScreen',
                    options: {
                        id: _this.screen.store.model.option().router_id ? _this.screen.store.model.option().router_id : '1486950498276101fee0fcab',
                        type: 'equipment'
                    },
                    container: 'indexMain'
                });

            }
        });
        //切换 周期的
        $(this.container).off('click.periord').on('click.periord', '.periodSwitch li', function() {
            $(_this.container).find('.periodSwitch li').removeClass();
            $(this).addClass('selected');
            var periord = $(this).data('periord');
            var startTime, endTime, format;
            var endTime = new Date().format('yyyy-MM-dd 00:00:00');
            switch (periord) {
                case 'week':
                    startTime = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).format('yyyy-MM-dd 00:00:00');
                    format = 'd1';
                    break;
                case 'month':
                    startTime = new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000).format('yyyy-MM-dd 00:00:00');
                    format = 'd1';
                    break;
                case 'year':
                    startTime = new Date(new Date().getTime() - 12 * 30 * 24 * 60 * 60 * 1000).format('yyyy-MM-01 00:00:00');
                    endTime = new Date().format('yyyy-MM-01 00:00:00');
                    format = 'M1';
                    break;
            }
            _this.getData(_this.pointsArr, startTime, endTime, format);
        })
    };
    return ModalEquipmentRateAndHistoryData;
})()