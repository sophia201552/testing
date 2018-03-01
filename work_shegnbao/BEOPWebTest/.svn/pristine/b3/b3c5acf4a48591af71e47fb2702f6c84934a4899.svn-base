var ModalMultiple = (function () {
    function ModalMultiple(screen, entityParams, _renderModal, _updateModal, _showConfigMode) {
        if (!screen) return;
        var renderModal = _renderModal ? _renderModal : this.renderModal;
        var updateModal = _updateModal ? _updateModal : this.updateModal;
        var showConfigMode = _showConfigMode ? _showConfigMode : this.showConfigMode;
        ModalRealtimeLine.call(this, screen, entityParams, renderModal, updateModal, null);
        this.m_bIsGoBackTrace = false;
        this.m_traceData = undefined;
    };

    ModalMultiple.prototype = new ModalRealtimeLine();

    ModalMultiple.prototype.optionTemplate = {
        name: 'toolBox.modal.MULTIPLE',
        parent: 0,
        mode: ['multiple'],
        maxNum: 10,
        title: '',
        minHeight: 2,
        minWidth: 3,
        maxHeight: 6,
        maxWidth: 12,
        type: 'ModalMultiple',
        modelParams: {
            paraName:['line','bar','area','cumulativeBar'],
            paraShowName: {'line': 'Line Chart Parameters',/*I18n.resource.modalConfig.data.DASHBOARD_MULTI_LINE,*/
                'bar': "Bar Chart Parameters",/*I18n.resource.modalConfig.data.DASHBOARD_MULTI_BAR,*/
                'area': "Area Chart Parameters",/*I18n.resource.modalConfig.data.DASHBOARD_MULTI_AREA,*/
                'cumulativeBar': "Cumulative Bar Chart Parameters"/*I18n.resource.modalConfig.data.DASHBOARD_MULTI_CUMULATIVE_BAR*/
            },
            paraAnlysMode:'part'
        }
    };
    ModalMultiple.prototype.renderModal = function () {
        this.isFirstRender = true;
    };
    ModalMultiple.prototype.updateModal = function (points) {
        if(points.length < 1) return;
        var _this = this;
        if(this.isFirstRender){
            var pointNameList = (function(points){
                var arr = [];
                for(var i = 0; i < points.length; i++){
                    arr.push(points[i].dsItemId)
                }
                return arr;
            })(points);
            var endTime;
            if (!_this.m_bIsGoBackTrace) {
                endTime = new Date().format('yyyy-MM-dd HH:mm:ss');
                _this.optionDefault.animation = true;
            }
            else {
                this.m_bIsGoBackTrace = false;
                endTime = new Date(_this.m_traceData.currentTime).format('yyyy-MM-dd HH:mm:ss');
                _this.optionDefault.animation = false;
            }
            var startTime = endTime.split(' ')[0] + ' 01:00:00';
            WebAPI.post('/analysis/startWorkspaceDataGenHistogram', {
                //dataSourceId: '',  //_this.screen.store.datasources[0].id,
                dsItemIds: pointNameList,
                timeStart: startTime,
                timeEnd: endTime,
                timeFormat: 'h1'
            }).done(function (dataSrc) {
                if (dataSrc == undefined || dataSrc.length <= 0) {
                    return;
                }
                var entityItem = _this.dealWithData(dataSrc,2);
                var option = {
                    legend: {
                        data: entityItem.arrLegend
                    },
                    grid: {x: 70, y: 34, x2: 50, y2: 24},
                    xAxis: [
                        {
                            data: ['01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '24:00'],
                            boundaryGap: true
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            scale: false,
                            splitArea:{show:false}
                        },
                        {
                            type: 'value',
                            scale: false,
                            splitArea:{show:false}
                        }
                    ],
                    series: entityItem.arrSeries
                };
                var optionTemp = {};
                $.extend(true,optionTemp,_this.optionDefault);
                if (_this.entity.modal.dsChartCog){
                    var ptIndex = 0;
                    if(_this.entity.modal.dsChartCog[0].upper != ''){
                        option.yAxis[1].max = Number(_this.entity.modal.dsChartCog[0].upper);
                    }
                    if(_this.entity.modal.dsChartCog[0].lower != ''){
                        option.yAxis[1].min = Number(_this.entity.modal.dsChartCog[0].lower);
                    }
                    if(_this.entity.modal.dsChartCog[0].unit != ''){
                        option.yAxis[1].name = _this.entity.modal.dsChartCog[0].unit;
                    }
                    if(_this.entity.modal.dsChartCog[0].accuracy != ''){
                        var n = Number(_this.entity.modal.dsChartCog[0].accuracy);
                        for (var i = 0;i < _this.entity.modal.option.paraType[0].arrId.length;i++) {
                            for (var j = 0; j < option.series[ptIndex].data.length; j++) {
                                //option.series[i].data[j] = Math.round( option.series[i].data[j] * Math.pow(10, n) ) / Math.pow(10, n)
                                option.series[ptIndex].data[j] = Number(option.series[ptIndex].data[j]).toFixed(n);
                            }
                            ptIndex += 1;
                        }
                    }
                    var tempChartMax,tempChartMin;
                    for (var m = 1; m < 4; ++m ) {
                        tempChartMax = null;
                        tempChartMin = null;
                        if (_this.entity.modal.dsChartCog[m].upper != '') {
                            if (tempChartMax == null || tempChartMax < Number(_this.entity.modal.dsChartCog[m].upper)) {
                                tempChartMax = Number(_this.entity.modal.dsChartCog[m].upper);
                            }
                        }
                        if (_this.entity.modal.dsChartCog[m].lower != '') {
                            if (tempChartMin == null || tempChartMin > Number(_this.entity.modal.dsChartCog[m].lower)) {
                                tempChartMin = Number(_this.entity.modal.dsChartCog[m].lower);
                            }
                        }
                        if (_this.entity.modal.dsChartCog[m].unit != '') {
                            option.yAxis[0].name = _this.entity.modal.dsChartCog[m].unit;
                        }
                        if (_this.entity.modal.dsChartCog[m].accuracy != '') {
                            var n = Number(_this.entity.modal.dsChartCog[m].accuracy);
                            for (var i = 0;i < _this.entity.modal.option.paraType[m].arrId.length;i++) {
                                for (var j = 0; j < option.series[ptIndex].data.length; j++) {
                                    //option.series[i].data[j] = Math.round( option.series[i].data[j] * Math.pow(10, n) ) / Math.pow(10, n)
                                    option.series[ptIndex].data[j] = Number(option.series[ptIndex].data[j]).toFixed(n);
                                }
                                ptIndex += 1;
                            }
                        }
                    }
                    if(tempChartMax != null){
                        option.yAxis[0].max = Number(tempChartMax);
                    }
                    if(tempChartMin != null){
                        option.yAxis[0].min = Number(tempChartMin);
                    }
                    var tempMarkLine;
                    for (var l = 0; l < 4; l++){
                        for (var k = 0; k < 4; k++) {
                            if (_this.entity.modal.dsChartCog[l].markLine[k].value != '') {
                                for(var index = 0;index < _this.entity.modal.option.paraType[l].arrId.length;++index) {
                                    if (!option.series[l + index].markLine) {
                                        option.series[l + index].markLine = {
                                            data: [],
                                            symbol: 'none',
                                            itemStyle:{
                                                normal:{
                                                    label: {
                                                        show: false
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    tempMarkLine = [
                                        {
                                            name: _this.entity.modal.dsChartCog[l].markLine[k].name,
                                            value: _this.entity.modal.dsChartCog[l].markLine[k].value,
                                            xAxis: -1,
                                            yAxis: Number(_this.entity.modal.dsChartCog[l].markLine[k].value)
                                        },
                                        {
                                            //xAxis: option.series[l + index].data.length,
                                            xAxis:dataSrc.timeShaft.length,
                                            yAxis: Number(_this.entity.modal.dsChartCog[l].markLine[k].value)
                                        }
                                    ];
                                    option.series[l + index].markLine.data.push(tempMarkLine);
                                }
                            }
                        }
                    }
                }
                var cha = echarts.init(_this.container, AppConfig.chartTheme);
                cha.clear();
                _this.chart = cha.setOption($.extend(true, {}, optionTemp, option));
                _this.isFirstRender = false;
            }).error(function (e) {

            }).always(function (e) {

            });
        } else{
            var crtHour = new Date().getHours();
            if (points && points.length > 0 && this.chart.getSeries()[0].data.length < crtHour) {//seriesData[i].dsItemId
                this.chart.addData(this.dealWithAddData(points,2));
            }
            if(this.chart.getSeries()[0].data.length > 23){
                this.isFirstRender = true;
            }
        }
    };
    ModalMultiple.prototype.dealWithData = function (points) {
        if(points.error) {
            this.container.innerHTML = '<div id="dataAlert" ></div>';
            new Alert($("#dataAlert"), "danger", "<strong>" + points.error + "</strong>").show();
            return;
        }

        var arr = {
            arrLegend:{},
            arrSeries:{}
        };
        arr.arrLegend = [];
        arr.arrSeries = [];
        var arrTempPoints = [];
        var dataType = this.entity.modal.option.paraType;
        for (var i = 0 ; i < dataType.length; ++i){
            for (var j = 0 ;j < dataType[i].arrId.length;++j)
            arrTempPoints.push({dsItemId:dataType[i].arrId[j]})
        }
        var arrPointAlias = this.initPointAlias(arrTempPoints);
        var tempNum = 0;
        for (var i = 0;i < dataType.length;i++){
            switch (dataType[i].type) {
                case 'bar':
                    for (var j = 0; j < dataType[i].arrId.length; j++) {
                        for (var k = 0; k < points.list.length; ++k) {
                            if (dataType[i].arrId[j] == points.list[k].dsItemId) {
                                var series = {
                                    name: arrPointAlias[tempNum],
                                    type: 'bar',
                                    symbol: 'none',
                                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                                    smooth: true,
                                    data: points.list[k].data,
                                    yAxisIndex: 0
                                };
                                arr.arrLegend.push(arrPointAlias[tempNum]);
                                arr.arrSeries.push(series);
                                tempNum +=1;
                                break;
                            }
                        }
                    }
                    break;
                case 'line':
                    for (var j = 0; j < dataType[i].arrId.length; j++) {
                        for (var k = 0; k < points.list.length; ++k) {
                            if (dataType[i].arrId[j] == points.list[k].dsItemId) {
                                var series = {
                                    name: arrPointAlias[tempNum],
                                    type: 'line',
                                    symbol: 'none',
                                    //itemStyle: {normal: {areaStyle: {type: 'default'}}},
                                    smooth: true,
                                    data: points.list[k].data,
                                    yAxisIndex: 1,
                                    z:3
                                }
                                arr.arrLegend.push(arrPointAlias[tempNum]);
                                arr.arrSeries.push(series);
                                tempNum +=1;
                                break;
                            }
                        }
                    }
                    break;
                case 'area':
                    for (var j = 0; j < dataType[i].arrId.length; j++) {
                        for (var k = 0; k < points.list.length; ++k) {
                            if (dataType[i].arrId[j] == points.list[k].dsItemId) {
                                var series = {
                                    name: arrPointAlias[tempNum],
                                    type: 'line',
                                    symbol: 'none',
                                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                                    smooth: true,
                                    data: points.list[k].data,
                                    yAxisIndex: 0,
                                    z:3
                                };
                                arr.arrLegend.push(arrPointAlias[tempNum]);
                                arr.arrSeries.push(series);
                                tempNum +=1 ;
                                break;
                            }
                        }
                    }
                    break;
                case 'cumulativeBar':
                    for (var j = 0; j < dataType[i].arrId.length; j++) {
                        for (var k = 0; k < points.list.length; ++k) {
                            if (dataType[i].arrId[j] == points.list[k].dsItemId) {
                                var series = {
                                    name: arrPointAlias[tempNum],
                                    type: 'bar',
                                    stack:'实时累计图',
                                    symbol: 'none',
                                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                                    smooth: true,
                                    data: points.list[k].data,
                                    yAxisIndex: 0
                                };
                                arr.arrLegend.push(arrPointAlias[tempNum]);
                                arr.arrSeries.push(series);
                                tempNum +=1;
                                break;
                            }
                        }
                    }
                    break;
            }
        }
        return arr;
    },
    //ModalMultiple.prototype.dealWithAddData = function (points,len) {
    //    var arr = [];
    //    var dataType = this.option;
    //    for(var i = 0; i < points.length; i++){
    //        var temp = [i, tofixed(points[i].data), false, true];
    //        arr.push(temp);
    //    }
    //    return arr;
    //},
    ModalMultiple.prototype.setModalOption = function(option){
        this.entity.modal.option = {};
        this.entity.modal.interval = 5;
        this.entity.modal.option.paraType = option.paraType
    };
    ModalMultiple.prototype.goBackTrace = function (data) {
        this.m_bIsGoBackTrace = true;
        this.m_traceData = data;
        this.renderModal();
    };
    return ModalMultiple;
})();
