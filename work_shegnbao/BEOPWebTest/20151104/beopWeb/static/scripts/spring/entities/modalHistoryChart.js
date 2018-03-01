var ModalHistoryChart = (function () {
    function ModalHistoryChart(screen, entityParams, _renderModal, _updateModal, _showConfigMode) {
        if (!screen) return;
        var renderModal = _renderModal ? _renderModal : this.renderModal;
        var updateModal = _updateModal ? _updateModal : this.updateModal;
        var showConfigMode = _showConfigMode ? _showConfigMode : this.showConfigMode;
        this.m_bIsGoBackTrace = false;
        this.m_traceData = undefined;
        ModalChart.call(this, screen, entityParams, renderModal, updateModal, showConfigMode);
    };

    ModalHistoryChart.prototype = new ModalChart();
    ModalHistoryChart.prototype.optionTemplate = {
        name:'toolBox.modal.HIS_CHART',//'ModalHistoryChart',        parent:1,
        parent:1,
        mode:['easyHistory'],
        maxNum: 5,
        title:'',
        minHeight:2,
        minWidth:3,
        maxHeight:6,
        maxWidth:12,
        type:'ModalHistoryChart'
    };

    ModalHistoryChart.prototype.optionDefault = {
        tooltip: {
            trigger: 'axis'
        },
        toolbox: {
            show: false,
            feature: {
                dataView : {show: false, readOnly: true},
                magicType : {show: true, type: ['line', 'bar']},
                restore : {show: true},
                saveAsImage : {show: true}
            }
        },
        calculable: false,
        dataZoom: {
            show: true
        },
        grid: {
            x: 70, y: 38, x2: 10, y2: 24
        },
        xAxis: [
            {
                type: 'time',
                splitLine: {show : false}
            }
        ],
        yAxis: [
            {
                type: 'value',
                splitArea: {show : false}
            }
        ],
        animation: true
    };

    ModalHistoryChart.prototype.renderModal = function () {
        var _this = this;

        var hourMilSec = 3600000;
        var dayMilSec = 86400000;
        var weekMilSec = 604800000 + dayMilSec;

        var startDate = new Date();
        var endDate = new Date();
        var timeType;
        if ('hour' == _this.entity.modal.option.timeType) {
            timeType = 'm5';
            startDate.setTime(endDate.getTime() - hourMilSec);
        }
        if ('day' == _this.entity.modal.option.timeType) {
            timeType = 'h1';
            startDate.setTime(endDate.getTime() - dayMilSec);
        }
        else if ('week' == _this.entity.modal.option.timeType) {
            timeType = 'd1';
            startDate.setTime(endDate.getTime() - weekMilSec);
        }
        else if ('month' == _this.entity.modal.option.timeType) {
            timeType = 'd1';
            var year = endDate.getFullYear();
            var month = endDate.getMonth();
            if (0 == month) {
                startDate.setFullYear(year - 1);
                startDate.setMonth(11);
            }
            else {
                startDate.setMonth(month - 1);
            }
        }
        else if ('year' == _this.entity.modal.option.timeType) {
            timeType = 'M1';
            startDate.setFullYear(endDate.getFullYear() - 1);
        }
        else {
            return;
        }

        var curDate, startTime, endTime;
        if (!_this.m_bIsGoBackTrace) {  // normal show history data
            startTime = startDate.format('yyyy-MM-dd HH:mm:ss');
            endTime = endDate.format('yyyy-MM-dd HH:mm:ss');
            _this.optionDefault.animation = true;
        }
        else {  // for history data trace
            curDate = _this.m_traceData.currentTime;
            _this.optionDefault.animation = false;
            if ('hour' == _this.entity.modal.option.timeType) {
                startDate.setTime(curDate.getTime() - hourMilSec);
            }
            else if ('day' == _this.entity.modal.option.timeType) {
                startDate.setTime(curDate.getTime() - dayMilSec);
            }
            else if ('week' == _this.entity.modal.option.timeType) {
                startDate.setTime(curDate.getTime() - weekMilSec);
            }
            else if ('month' == _this.entity.modal.option.timeType) {
                var year = curDate.getFullYear();
                var month = curDate.getMonth();
                if (0 == month) {
                    startDate.setFullYear(year - 1);
                    startDate.setMonth(11);
                }
                else {
                    startDate.setMonth(month - 1);
                }
            }
            else if ('year' == _this.entity.modal.option.timeType) {
                startDate.setFullYear(curDate.getFullYear() - 1);
            }
            else {
                return;
            }
            startTime = startDate.format('yyyy-MM-dd HH:mm:ss');
            endTime = curDate.format('yyyy-MM-dd HH:mm:ss');
        }
        var optPtName = _this.entity.modal.points;
        WebAPI.post('/analysis/startWorkspaceDataGenHistogram', {
            //dataSourceId: '',  //_this.screen.store.datasources[0].id,
            dsItemIds: optPtName,
            timeStart: startTime,
            timeEnd: endTime,
            timeFormat: timeType
        }).done(function (result) {
            var dataSrc = JSON.parse(result);
            if (!dataSrc || !dataSrc.list[0].data || !dataSrc.timeShaft || dataSrc.timeShaft.length <= 0) {
                return;
            }
            var option = _this.initOption(dataSrc);
            if (undefined == option || undefined == option.series[0].data || 0 == option.series[0].data.length) {
                return;
            }
            var optionTemp = {};
            $.extend(true,optionTemp,_this.optionDefault);
            if (_this.entity.modal.dsChartCog){
                if(_this.entity.modal.dsChartCog[0].upper != ''){
                    optionTemp.yAxis[0].max = Number(_this.entity.modal.dsChartCog[0].upper);
                }
                if(_this.entity.modal.dsChartCog[0].lower != ''){
                    optionTemp.yAxis[0].min = Number(_this.entity.modal.dsChartCog[0].lower);
                }
                if(_this.entity.modal.dsChartCog[0].unit != ''){
                    optionTemp.yAxis[0].name = _this.entity.modal.dsChartCog[0].unit;
                }
                if(_this.entity.modal.dsChartCog[0].accuracy != ''){
                    var n = Number(_this.entity.modal.dsChartCog[0].accuracy);
                    for (var i = 0; i < option.series.length; i++){
                        for (var j = 0; j < option.series[i].data.length; j++){
                            //option.series[i].data[j] = Math.round( option.series[i].data[j] * Math.pow(10, n) ) / Math.pow(10, n)
                            option.series[i].data[j] = Number(option.series[i].data[j].toFixed(n));
                        }
                    }
                }
                var tempMarkLine;
                for(var k = 0;k < 4; k++){
                    if (_this.entity.modal.dsChartCog[0].markLine[k].value != ''){
                        if(!option.series[0].markLine){
                            option.series[0].markLine = {
                                data:[],
                                symbol:'none',
                                itemStyle:{
                                    normal:{
                                        label: {
                                            show: false
                                        }
                                    }
                                }
                            }
                        }
                        tempMarkLine =[
                                        {
                                            name:_this.entity.modal.dsChartCog[0].markLine[k].name,
                                            value:_this.entity.modal.dsChartCog[0].markLine[k].value,
                                            xAxis: -1,
                                            yAxis:Number(_this.entity.modal.dsChartCog[0].markLine[k].value)
                                        },
                                        {
                                            //xAxis:option.series[0].data.length,
                                            xAxis:dataSrc.timeShaft.length,
                                            yAxis:Number(_this.entity.modal.dsChartCog[0].markLine[k].value)
                                        }
                                    ];
                        option.series[0].markLine.data.push(tempMarkLine);
                    }
                }
            }
            _this.chart.clear();
            _this.chart.setOption($.extend(true, {}, optionTemp, option));
        }).error(function (e) {
        }).always(function (e) {
            _this.spinner.stop();
        });
    },

    ModalHistoryChart.prototype.updateModal = function (options) {
    },

    ModalHistoryChart.prototype.showConfigMode = function () {
    },

    ModalHistoryChart.prototype.goBackTrace = function (data) {
        this.m_bIsGoBackTrace = true;
        this.m_traceData = data;
        this.renderModal();
        this.m_bIsGoBackTrace = false;
    }

    return ModalHistoryChart;
})();


// 历史柱状图-周/月/年
var ModalHistoryChartNormal = (function () {
    var defaultParams = {
        title: '',
        option:{
            showType: 'bar',
            ptName: 'E_Sum',
            timeType: 'week'
        }
    }
    var m_color = ['#e74a37','#ff8050','#1abd9b','#3499da','#3e72ac'];
    var m_colorLen = m_color.length;

    function ModalHistoryChartNormal(screen, entityParams, _renderModal, _updateModal, _showConfigMode) {
        if(!screen) return;
        var renderModal = _renderModal ? _renderModal : this.renderModal;
        var updateModal = _updateModal ? _updateModal : this.updateModal;
        var showConfigMode = _showConfigMode ? _showConfigMode : this.showConfigMode;
        ModalHistoryChart.call(this, screen, entityParams, renderModal, updateModal, showConfigMode);

        this.chart = echarts.init(this.container, AppConfig.chartTheme);
        this.spinner.spin(this.container);
    };

    ModalHistoryChartNormal.prototype = new ModalHistoryChart();

    ModalHistoryChartNormal.prototype.optionTemplate = {
        name: 'toolBox.modal.HIS_CHART_ENERGY_LINE',
        parent:1,
        mode:['easyHistorySelect'],
        maxNum: 5,
        title:'',
        minHeight:2,
        minWidth:3,
        maxHeight:6,
        maxWidth:12,
        type:'ModalHistoryChartNormal'
    }

    ModalHistoryChartNormal.prototype.initOption = function(dataSrc){
        if (undefined == dataSrc || undefined == dataSrc.list[0].data) {
            return;
        }

        var xLen = dataSrc.timeShaft.length;
        var xAxis;
        var arrXAxis = [];
        if ('month' == this.entity.modal.option.timeType) {
            for (var i=0; i<xLen; i++) {
                arrXAxis.push(dataSrc.timeShaft[i].toDate().format("MM-dd"));
            }
        }
        else if ('week' == this.entity.modal.option.timeType) {
            for (var i=0; i<xLen; i++) {
                arrXAxis.push(dataSrc.timeShaft[i].toDate().format("yyyy-MM-dd"));
            }
        }
        else if ('day' == this.entity.modal.option.timeType) {
            for (var i=0; i<xLen; i++) {
                arrXAxis.push(dataSrc.timeShaft[i].toDate().format("MM-dd HH:00"));
            }
        }
        xAxis = [
            {
                type : 'category',
                data : arrXAxis
            }
        ]

        var dataName = this.initPointAlias(dataSrc.list);
        var arrSeries = [];
        var pointAlias,index,strArrLegend,pointNameReg;
        var i = 0;
        var showColor = '#1abd9b';
        for (var i = 0; i < dataSrc.list.length; i++) {
            var key = dataSrc.list[i].dsItemId;
            if (dataSrc.list.length > 1) {  // compatible design picture
                showColor = m_color[i % m_colorLen];
            }

            //var arrData = [];
            //var hisLen = dataSrc.list[0].data[key].length;
            //var fixNum = 0;
            //for (var j=0; j<hisLen; j++) {
            //    var setVal1 = parseFloat(dataSrc.list[0].data[key][j]);
            //    if (setVal1 < 100) {
            //        fixNum = 2;
            //    }
            //    var setVal2 = setVal1.toFixed(fixNum);
            //    arrData.push(parseFloat(setVal2));
            //}

            arrSeries.push(
                {
                    name: dataName[i],
                    type: this.entity.modal.option.showType,
                    data: dataSrc.list[i].data,
                    markPoint : {
                        data : [
                            {type : 'max', name: I18n.resource.dashboard.modalHistoryChart.MAXIMUM},
                            {type : 'min', name: I18n.resource.dashboard.modalHistoryChart.MINIMUM}
                        ]
                    },
                    itemStyle: {
                        normal: {
                            //color: showColor,
                            barBorderRadius: [5, 5, 0, 0]
                        },
                        emphasis: {
                            //color: showColor,
                            barBorderRadius: [5, 5, 0, 0]
                        }
                    }
                }
            );
        }

        var dataOption = {
            title : {
                text: '',
                subtext: ''
            },
            legend: {
                data: dataName
            },
            dataZoom: {
                show: false
            },
            grid: {
                x: 70, y: 38, x2: 10, y2: 24
            },
            xAxis : xAxis,
            series : arrSeries
        };

        return dataOption;
    };

    ModalHistoryChartNormal.prototype.setModalOption = function (option) {
        this.entity.modal.option = {};
        this.entity.modal.option.showType = option.showType;
        this.entity.modal.option.timeType = option.timeType;
    };

    return ModalHistoryChartNormal;
})();


// 历史能耗图-周/月/年
var ModalHistoryChartEnergyConsume = (function () {
    var defaultParams = {
        title: '',
        option:{
            showType: 'bar',
            ptName: 'E_Sum',
            timeType: 'week'
        }
    }
    var m_color = ['#e74a37','#ff8050','#1abd9b','#3499da','#3e72ac'];
    var m_colorLen = m_color.length;

    function ModalHistoryChartEnergyConsume(screen, entityParams, _renderModal, _updateModal, _showConfigMode) {
        if(!screen) return;
        var renderModal = _renderModal ? _renderModal : this.renderModal;
        var updateModal = _updateModal ? _updateModal : this.updateModal;
        var showConfigMode = _showConfigMode ? _showConfigMode : this.showConfigMode;
        ModalHistoryChart.call(this, screen, entityParams, renderModal, updateModal, showConfigMode);


        this.chart = echarts.init(this.container, AppConfig.chartTheme);
        this.spinner.spin(this.container);
    };

    ModalHistoryChartEnergyConsume.prototype = new ModalHistoryChart();

    ModalHistoryChartEnergyConsume.prototype.optionTemplate = {
        name:'toolBox.modal.HIS_CHART_ENERGY_BAR',
        parent:1,
        mode:['easyHistory'],
        maxNum: 5,
        title:'',
        minHeight:2,
        minWidth:3,
        maxHeight:6,
        maxWidth:12,
        type:'ModalHistoryChartEnergyConsume'
    }

    ModalHistoryChartEnergyConsume.prototype.initOption = function(dataSrc){
        if (undefined == dataSrc || undefined == dataSrc.list || undefined == dataSrc.list[0]) {
            return;
        }

        var xLen = dataSrc.timeShaft.length;
        var xAxis;
        var arrXAxis = [];
        var showColor;
        if ('week' == this.entity.modal.option.timeType) {
            for (var i=0; i<xLen -1; i++) {
                var dayNum = dataSrc.timeShaft[i].toDate().getDay();
                arrXAxis.push(i18n_resource.dataSource.WEEK[dayNum]);
            }
            showColor = '#3499da';
        }
        else if ('month' == this.entity.modal.option.timeType) {
            for (var i=0; i<xLen - 1; i++) {
                arrXAxis.push(dataSrc.timeShaft[i].toDate().format('MM-dd'));
            }
            showColor = m_color[0];
        }
        else if ('year' == this.entity.modal.option.timeType) {
            for (var i=0; i<xLen - 1; i++) {
                var monthNum = dataSrc.timeShaft[i].toDate().getMonth();
                arrXAxis.push(i18n_resource.dataSource.MONTH[monthNum]);
            }
            showColor = '#3e72ac';
        }
        else if ('day' == this.entity.modal.option.timeType) {
            for (var i=0; i<xLen - 1; i++) {
                arrXAxis.push(dataSrc.timeShaft[i].toDate().format('MM-dd HH:00'));
            }
            showColor = '#3e72ac';
        }

        xAxis = [
            {
                type : 'category',
                data : arrXAxis
            }
        ]

        var dataName = this.initPointAlias(dataSrc.list);
        var arrSeries = [];
        var i = 0;
        for (var i = 0; i < dataSrc.list.length; i++) {
            var key = dataSrc.list[i].dsItemId;
            if (dataSrc.list.length > 1) {  // compatible design picture
                showColor = m_color[i % m_colorLen];
            }

            var arrData = [];
            var hisLen = dataSrc.list[0].data.length;
            var defVal;
            var fixNum = 0;
            for (var j=1; j<hisLen; j++) {
                var preVal = dataSrc.list[0].data[j-1];
                if (0 == preVal) {
                    arrData.push(0);
                    continue;
                }
                defVal = dataSrc.list[0].data[j] - preVal;
                if (defVal < 100) {
                    fixNum = 2;
                }
                else {
                    fixNum = 0;
                }
                arrData.push(parseFloat(defVal.toFixed(fixNum)));
            }

            arrSeries.push(
                {
                    name: dataName[i],
                    type: this.entity.modal.option.showType,
                    data: arrData,
                    markPoint : {
                        data : [
                            {type : 'max', name: I18n.resource.dashboard.modalHistoryChart.MAXIMUM},
                            {type : 'min', name: I18n.resource.dashboard.modalHistoryChart.MINIMUM}
                        ]
                    },
                    itemStyle: {
                        normal: {
                            color: showColor,
                            barBorderRadius: [5, 5, 5, 5]
                        },
                        emphasis: {
                            color: showColor,
                            barBorderRadius: [5, 5, 5, 5]
                        }
                    }
                }
            );

            i++;
        }

        var dataOption = {
            title : {
                text: '',
                subtext: ''
            },
            legend: {
                show: false,
                data: dataName
            },
            dataZoom: {
                show: false
            },
            grid: {
                x: 70, y: 38, x2: 10, y2: 24
            },
            xAxis : xAxis,
            series : arrSeries
        };

        return dataOption;
    };

    ModalHistoryChartEnergyConsume.prototype.setModalOption = function (option) {
        this.entity.modal.option = {};
        this.entity.modal.option.showType = 'bar';
        this.entity.modal.option.timeType = option.timeType;
    };

    return ModalHistoryChartEnergyConsume;
})();


// 历史同比折线图
var ModalHistoryChartYearOnYearLine = (function () {
    var defaultParams = {
        title: '',
        option:{
            ptName: 'E_Sum',
            timeType: 'week'
        }
    }
    var _this;

    function ModalHistoryChartYearOnYearLine(screen, entityParams, _renderModal, _updateModal, _showConfigMode) {
        if (!screen) return;
        var renderModal = _renderModal ? _renderModal : this.renderModal;
        var updateModal = _updateModal ? _updateModal : this.updateModal;
        var showConfigModal = _showConfigMode ? _showConfigMode : this.showConfigMode;
        ModalBase.call(this, screen, entityParams, renderModal, updateModal, showConfigModal);

        this.option = entityParams.option;
        this.chart = echarts.init(this.container, AppConfig.chartTheme);
        this.spinner.spin(this.container);
        this.store = {};
        this.pointAlias = this.entity.modal.point?AppConfig.datasource.getDSItemById(this.entity.modal.points[0]).alias:'';
        this.m_bIsGoBackTrace = false;
        this.m_traceData = undefined;
        _this = this;
    };

    ModalHistoryChartYearOnYearLine.prototype = new ModalBase();

    ModalHistoryChartYearOnYearLine.prototype.optionTemplate = {
        name:'toolBox.modal.HIS_CHART_YEAR_LINE',
        parent:1,
        mode:['easyCompare'],
        maxNum: 1,
        title:'',
        minHeight:2,
        minWidth:3,
        maxHeight:6,
        maxWidth:12,
        type:'ModalHistoryChartYearOnYearLine'
    };

    ModalHistoryChartYearOnYearLine.prototype.optionDefault = {
        tooltip: {
            trigger: 'axis',
            formatter: function (params) {
                var tar0 = params[0];
                var tar1 = params[1];
                var pointAlias = _this.pointAlias;
                return pointAlias + ' : ' + tar0.name + '<br/>' + tar0.seriesName + ' : ' + tar0.value + '<br/>'
                     + tar1.seriesName + ' : ' + tar1.value;
            }
        },
        toolbox: {
            show: false,
            feature: {
                dataView : {show: false, readOnly: true},
                magicType : {show: true, type: ['line', 'bar']},
                restore : {show: true},
                saveAsImage : {show: true}
            }
        },
        calculable: false,
        dataZoom: {
            show: false
        },
        grid: {
            x: 70, y: 38, x2: 10, y2: 24
        },
        xAxis: [
            {
                type: 'time',
                splitLine: {show : false}
            }
        ],
        yAxis: [
            {
                type: 'value',
                splitArea: {show : false}
            }
        ],
        animation: true //TODO: the time is too short between rendering and updating.
    };

    ModalHistoryChartYearOnYearLine.prototype.renderModal = function () {
        var _this = this;

        var hourMilSec = 3600000;
        var dayMilSec = 86400000;
        var weekMilSec = 604800000;

        var startDate = new Date();
        var endDate = new Date();
        var tmFlag = new Date();
        var timeType;
        if ('hour' == _this.entity.modal.option.timeType) {
            timeType = 'm5';
            startDate.setTime(endDate.getTime() - hourMilSec);
            startDate.setMinutes(0);
            startDate.setSeconds(0);

            tmFlag.setTime(endDate.getTime());
            tmFlag.setMinutes(0);
            tmFlag.setSeconds(0);
            tmFlag.setMilliseconds(0);
        }
        if ('day' == _this.entity.modal.option.timeType) {
            timeType = 'h1';
            startDate.setTime(endDate.getTime() - dayMilSec);
            startDate.setHours(0);
            startDate.setMinutes(0);
            startDate.setSeconds(0);

            tmFlag.setTime(endDate.getTime());
            tmFlag.setHours(0);
            tmFlag.setMinutes(0);
            tmFlag.setSeconds(0);
            tmFlag.setMilliseconds(0);
        }
        else {
            return;
        }

        var curDate, startTime, endTime;
        if (!_this.m_bIsGoBackTrace) {  // normal show history data
            startTime = startDate.format('yyyy-MM-dd HH:mm:ss');
            endTime = endDate.format('yyyy-MM-dd HH:mm:ss');
            _this.optionDefault.animation = true;
        }
        else {  // for history data trace
            curDate = _this.m_traceData.currentTime;
            _this.optionDefault.animation = false;
            if ('hour' == _this.entity.modal.option.timeType) {
                timeType = 'm5';
                startDate.setTime(curDate.getTime() - hourMilSec);
                startDate.setMinutes(0);
                startDate.setSeconds(0);

                tmFlag.setTime(curDate.getTime());
                tmFlag.setMinutes(0);
                tmFlag.setSeconds(0);
                tmFlag.setMilliseconds(0);
            }
            else if ('day' == _this.entity.modal.option.timeType) {
                timeType = 'h1';
                startDate.setTime(curDate.getTime() - dayMilSec);
                startDate.setHours(0);
                startDate.setMinutes(0);
                startDate.setSeconds(0);

                tmFlag.setTime(curDate.getTime());
                tmFlag.setHours(0);
                tmFlag.setMinutes(0);
                tmFlag.setSeconds(0);
                tmFlag.setMilliseconds(0);
            }
            else {
                return;
            }
            startTime = startDate.format('yyyy-MM-dd HH:mm:ss');
            endTime = curDate.format('yyyy-MM-dd HH:mm:ss');
        }

        var optPtName = _this.entity.modal.points;
        WebAPI.post('/analysis/startWorkspaceDataGenHistogram', {
            //dataSourceId: '',  //_this.screen.store.datasources[0].id,
            dsItemIds: optPtName,
            timeStart: startTime,
            timeEnd: endTime,
            timeFormat: timeType
        }).done(function (result) {
            var dataSrc = JSON.parse(result);
            if (!dataSrc || !dataSrc.list[0].data || !dataSrc.timeShaft || dataSrc.timeShaft.length <= 0) {
                return;
            }
            var arrXAxis = [];
            var flagCount = 0;
            var len = dataSrc.timeShaft.length;
            tmFlag = tmFlag.format('yyyy-MM-dd HH:mm:ss');
            for (flagCount = 0; flagCount < len; flagCount++) {
                if (dataSrc.timeShaft[flagCount] >= tmFlag) {
                    break;
                }
            }
            _this.store.timeShaft = dataSrc.timeShaft.slice(0, flagCount);
            _this.store.deadline = dataSrc.timeShaft[flagCount - 1].toDate().valueOf();

            var fixNum = 0;
            var setVal;
            var dataName = [];
            var arrSeries = [];

            for (var k = 0, lenK = Math.min(flagCount, dataSrc.timeShaft.length); k < lenK; k++) {
                arrXAxis.push(dataSrc.timeShaft[k].toDate().format("HH:mm"));
            }

            var currentCount = 0;
            for (var n = 0; n < dataSrc.list.length; n++) {
                var key = dataSrc.list[n].dsItemId;
                var dataSrc1 = [];
                var dataSrc2 = [];
                var eachName = [];

                if (1 == dataSrc.list.length) {
                    dataName.push(I18n.resource.dataSource.TIME_YESTERDAY);
                    dataName.push(I18n.resource.dataSource.TIME_TODAY);
                    eachName.push(I18n.resource.dataSource.TIME_YESTERDAY);
                    eachName.push(I18n.resource.dataSource.TIME_TODAY);
                }
                else {
                    dataName.push(key + '_' + I18n.resource.dataSource.TIME_YESTERDAY);
                    dataName.push(key + '_' + I18n.resource.dataSource.TIME_TODAY);
                    eachName.push(key + '_' + I18n.resource.dataSource.TIME_YESTERDAY);
                    eachName.push(key + '_' + I18n.resource.dataSource.TIME_TODAY);
                }

                for (var j = 0, len = dataSrc.list[n].data.length; j < len; j++) {
                    setVal = dataSrc.list[n].data[j];
                    if (setVal < 100) {
                        fixNum = 2;
                    }
                    else {
                        fixNum = 0;
                    }
                    setVal = parseFloat(setVal.toFixed(fixNum));

                    if (j < flagCount) {
                        dataSrc1.push(setVal);
                    }
                    else {
                        dataSrc2.push(setVal);
                    }
                }

                var showColor;
                var showData;
                var showMark;
                for (var i = 0; i < 2; i++) {
                    if (0 == i) {
                        if (0 == currentCount) {
                            showColor = '#1abd9b';
                        }
                        else {
                            showColor = echarts.config.color[currentCount * 2];
                        }
                        showData = dataSrc1;
                        showMark = {
                            data : [
                                {type : 'max', name: I18n.resource.dashboard.modalHistoryChart.MAXIMUM},
                                {type : 'min', name: I18n.resource.dashboard.modalHistoryChart.MINIMUM}
                            ]
                        }
                    }
                    else if (1 == i) {
                        if (0 == currentCount) {
                            showColor = '#e74a37';
                        }
                        else {
                            showColor = echarts.config.color[currentCount * 2 + 1];
                        }
                        showData = dataSrc2;
                        var lastCntX = dataSrc2.length - 1;
                        var lastCntY = Number(dataSrc2[lastCntX]);
                        showMark = {
                            symbol : 'emptyCircle',
                            symbolSize : 10,
                            effect : {
                                show : true,
                                shadowBlur : 0
                            },
                            itemStyle : {
                                normal : {
                                    label : {
                                        show:false
                                    }
                                },
                                emphasis : {
                                    label : {
                                        position : 'top'
                                    }
                                }
                            },
                            data : [
                                {name : '', value : lastCntY, xAxis: lastCntX, yAxis: lastCntY}
                            ]
                        }
                    }

                    arrSeries.push(
                        {
                            name: eachName[i],
                            type: 'line',
                            data: showData,
                            markPoint : showMark,
                            itemStyle: {
                                normal: {
                                    color: showColor,
                                    barBorderRadius: [5, 5, 0, 0]
                                },
                                emphasis: {
                                    color: showColor,
                                    barBorderRadius: [5, 5, 0, 0]
                                }
                            },
                            symbolSize: 3
                        }
                    );
                    showColor = '';
                }
                currentCount++;
            }

            var xAxis = [
                {
                    type : 'category',
                    boundaryGap : false,
                    data : arrXAxis
                }
            ]

            var option = {
                title : {
                    text: '',
                    subtext: ''
                },
                dataZoom: {
                    show: false
                },
                legend: {
                    data: dataName
                },
                xAxis : xAxis,
                series : arrSeries
            };
            var optionTemp = {};
            //_this.pointAlias = AppConfig.datasource.getDSItemById(_this.entity.modal.points[0]).alias;
            $.extend(true,optionTemp,_this.optionDefault);
            if (_this.entity.modal.dsChartCog){
                if(_this.entity.modal.dsChartCog[0].upper != ''){
                    optionTemp.yAxis[0].max = Number(_this.entity.modal.dsChartCog[0].upper);
                }
                if(_this.entity.modal.dsChartCog[0].lower != ''){
                    optionTemp.yAxis[0].min = Number(_this.entity.modal.dsChartCog[0].lower);
                }
                if(_this.entity.modal.dsChartCog[0].unit != ''){
                    optionTemp.yAxis[0].name = _this.entity.modal.dsChartCog[0].unit;
                }
                if(_this.entity.modal.dsChartCog[0].accuracy != ''){
                    var n = Number(_this.entity.modal.dsChartCog[0].accuracy);
                    for (var i = 0; i < option.series.length; i++){
                        for (var j = 0; j < option.series[i].data.length; j++){
                            //option.series[i].data[j] = Math.round( option.series[i].data[j] * Math.pow(10, n) ) / Math.pow(10, n)
                            option.series[i].data[j] = option.series[i].data[j].toFixed(n);
                        }
                    }
                }
                var tempMarkLine;
                for(var k = 0;k < 4; k++){
                    if (_this.entity.modal.dsChartCog[0].markLine[k].value != ''){
                        if(!option.series[0].markLine){
                            option.series[0].markLine = {
                                data:[],
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
                        tempMarkLine =[
                                        {
                                            name:_this.entity.modal.dsChartCog[0].markLine[k].name,
                                            value:_this.entity.modal.dsChartCog[0].markLine[k].value,
                                            xAxis: -1,
                                            yAxis:Number(_this.entity.modal.dsChartCog[0].markLine[k].value)
                                        },
                                        {
                                            //xAxis:option.series[0].data.length,
                                            xAxis:dataSrc.timeShaft.length,
                                            yAxis:Number(_this.entity.modal.dsChartCog[0].markLine[k].value)
                                        }
                                    ];
                        option.series[0].markLine.data.push(tempMarkLine);
                    }
                }
            }
            _this.chart.clear();
            _this.chart.setOption($.extend(true, {}, optionTemp, option));
        }).error(function (e) {

        }).always(function (e) {
            _this.spinner.stop();
        });
    },

    ModalHistoryChartYearOnYearLine.prototype.updateModal = function (options) {
        var _this = this;
        var modalOptions = this.entity.modal.option;
        var lastIndex, lastTick, nowTick;
        if (undefined === options || options.length < 1 || undefined === options[0]) {
            return;
        }
        lastIndex = this.chart.getSeries()[1].data.length - 1;
        lastTick = this.store.timeShaft[lastIndex].toDate().valueOf();
        nowTick = new Date().valueOf();

        // 达到时间上限时不再更新
        if (lastTick === undefined) return;
        // 新增刷新间隔需求
        if ('hour' === modalOptions.timeType) {
            // 因为当前的lastTick是上一时间段的，需要转变成现有时间段
            lastTick += 3600000; //60*60*1000
            refreshInterval = 300000; // 5*60*1000
        }
        if ('day' === modalOptions.timeType) {
            lastTick += 86400000; // 24*60*60*1000
            refreshInterval = 3600000; // 60*60*1000
        }
        else {
            return;
        }

        // 未到刷新时间，则不做任何处理
        if( nowTick < lastTick + refreshInterval) return;

        var addParam = [];
        for (var i = 0, len = options.length; i < len; i++) {
            if (options[i].data !== null) {
                addParam.push([
                    1,
                    options[i].data,
                    false,
                    true
                ]);
            }
        }
        _this.chart.addData(addParam);
        // markPoint
        _this.chart.delMarkPoint(1, '');

        var dataSeries = _this.chart.getOption().series;
        if (dataSeries.length < 2) {
            return;
        }

        var temp = dataSeries[1].data;
        var lastCntX = temp.length - 1;
        var lastCntY = Number(temp[lastCntX]);

        var showMark = {
            symbol : 'emptyCircle',
            symbolSize : 10,
            effect : {
                show : true,
                shadowBlur : 0
            },
            itemStyle : {
                normal : {
                    label : {
                        show:false
                    }
                },
                emphasis : {
                    label : {
                        position : 'top'
                    }
                }
            },
            data : [
                {name : '', value : lastCntY, xAxis: lastCntX, yAxis: lastCntY}
            ]
        }
        _this.chart.addMarkPoint(1, showMark);
    },

    ModalHistoryChartYearOnYearLine.prototype.showConfigMode = function () {

    },

    ModalHistoryChartYearOnYearLine.prototype.setModalOption = function (option) {
        this.entity.modal.option = {};
        this.entity.modal.option.showType = 'line';
        this.entity.modal.option.timeType = option.timeType;
    };

    ModalHistoryChartYearOnYearLine.prototype.goBackTrace = function (data) {
        this.m_bIsGoBackTrace = true;
        this.m_traceData = data;
        this.renderModal();
        this.m_bIsGoBackTrace = false;
    };

    return ModalHistoryChartYearOnYearLine;
})();


// 历史同比柱状图
var ModalHistoryChartYearOnYearBar = (function () {
    var defaultParams = {
        title: '',
        option:{
            ptName: 'E_Sum',
            timeType: 'day'
        }
    }
    var m_color = ['#e74a37','#ff8050','#1abd9b','#3499da','#3e72ac'];

    function ModalHistoryChartYearOnYearBar(screen, entityParams, _renderModal, _updateModal, _showConfigMode) {
        if (!screen) return;
        var renderModal = _renderModal ? _renderModal : this.renderModal;
        var updateModal = _updateModal ? _updateModal : this.updateModal;
        var showConfigModal = _showConfigMode ? _showConfigMode : this.showConfigMode;
        ModalBase.call(this, screen, entityParams, renderModal, updateModal, showConfigModal);

        this.m_bIsGoBackTrace = false;
        this.m_traceData = undefined;
        this.option = entityParams.option;
        this.chart = echarts.init(this.container, AppConfig.chartTheme);
        this.spinner.spin(this.container);
    };

    ModalHistoryChartYearOnYearBar.prototype = new ModalBase();

    ModalHistoryChartYearOnYearBar.prototype.optionTemplate = {
        name: 'toolBox.modal.HIS_CHART_YEAR_BAR',
        parent:1,
        mode:['easyCompare'],
        maxNum: 1,
        title:'',
        minHeight:2,
        minWidth:3,
        maxHeight:6,
        maxWidth:12,
        type:'ModalHistoryChartYearOnYearBar'
    };

    ModalHistoryChartYearOnYearBar.prototype.optionDefault = {
        tooltip: {
            trigger: 'axis'
        },
        toolbox: {
            show: false,
            feature: {
                dataView : {show: false, readOnly: true},
                magicType : {show: true, type: ['line', 'bar']},
                restore : {show: true},
                saveAsImage : {show: true}
            }
        },
        calculable: false,
        dataZoom: {
            show: false
        },
        grid: {
            x: 70, y: 38, x2: 10, y2: 24
        },
        xAxis: [
            {
                type: 'category',
                splitLine: {show : false}
            }
        ],
        yAxis: [
            {
                type: 'value',
                splitArea: {show : false}
            }
        ],
        animation: true
    };

    ModalHistoryChartYearOnYearBar.prototype.renderModal = function () {
        var _this = this;

        var hourMilSec = 3600000;
        var dayMilSec = 86400000;
        var weekMilSec = 604800000;

        var startDate = new Date();
        var endDate = new Date();
        var startDateZero = new Date();
        var endDateZero = new Date();
        var timeType;
        if ('day' == _this.entity.modal.option.timeType) {
            timeType = 'h1';
            startDate.setTime(endDate.getTime() - dayMilSec);

            startDateZero.setTime(startDate.getTime());
            startDateZero.setHours(0);
            startDateZero.setMinutes(0);
            startDateZero.setSeconds(0);

            endDateZero.setTime(endDate.getTime());
            endDateZero.setHours(0);
            endDateZero.setMinutes(0);
            endDateZero.setSeconds(0);
        }
        else {
            return;
        }

        var optPtName = _this.entity.modal.points;
        if (optPtName.length > 1) {
            return;
        }

        var curDate, startTime, endTime;
        if (!_this.m_bIsGoBackTrace) {  // normal show history data
            startTime = startDate.format('yyyy-MM-dd HH:mm:ss');
            endTime = endDate.format('yyyy-MM-dd HH:mm:ss');
            _this.optionDefault.animation = true;
        }
        else {  // for history data trace
            curDate = _this.m_traceData.currentTime;
            _this.optionDefault.animation = false;
            if ('day' == _this.entity.modal.option.timeType) {
                timeType = 'h1';
                startDate.setTime(curDate.getTime() - dayMilSec);

                startDateZero.setTime(startDate.getTime());
                startDateZero.setHours(0);
                startDateZero.setMinutes(0);
                startDateZero.setSeconds(0);

                endDateZero.setTime(curDate.getTime());
                endDateZero.setHours(0);
                endDateZero.setMinutes(0);
                endDateZero.setSeconds(0);
            }
            else {
                return;
            }
            startTime = startDate.format('yyyy-MM-dd HH:mm:ss');
            endTime = curDate.format('yyyy-MM-dd HH:mm:ss');
        }

        WebAPI.post('/analysis/startWorkspaceDataGenHistogram', {
            //dataSourceId: '',  //_this.screen.store.datasources[0].id,
            dsItemIds: optPtName,
            timeStart: startDateZero.format('yyyy-MM-dd HH:mm:ss'),
            timeEnd: endDate.format('yyyy-MM-dd HH:mm:ss'),
            timeFormat: timeType
        }).done(function (result) {
            var dataSrc = JSON.parse(result);
            if (!dataSrc || !dataSrc.list[0].data || !dataSrc.timeShaft || dataSrc.timeShaft.length <= 0) {
                return;
            }

            var flag1, flag2;
            var len = dataSrc.timeShaft.length;
            for (var i = 0; i < len; i++) {
                if (dataSrc.timeShaft[i].toDate() >= startDate) {
                    flag1 = i;
                    break;
                }
            }
            for (var i = 0; i < len; i++) {
                if (dataSrc.timeShaft[i].toDate() >= endDateZero) {
                    flag2 = i;
                    break;
                }
            }
            var arrVal1 = [];
            var arrVal2 = [];
            var val1 = 0;
            var val2 = 0;
            var fixNum1 = 0;
            var fixNum2 = 0;
            var preVal = 0;
            for (var i = 0; i < dataSrc.list.length; i++) {
                var key = dataSrc.list[i].dsItemId;
                for (var j = 0, len = dataSrc.list[i].data.length; j < len; j++) {
                    if (j == flag1) {
                        preVal = dataSrc.list[i].data[0];
                        if (0 == preVal) {
                            val1 = 0;
                        }
                        else {
                            val1 = dataSrc.list[i].data[j] - preVal;
                        }
                    }
                    else if (j == flag2) {
                        preVal = dataSrc.list[i].data[j];
                        if (0 == preVal) {
                            val2 = 0;
                        }
                        else {
                            val2 = dataSrc.list[i].data[len-1] - preVal;
                        }
                    }
                }
                if (val1 < 100) {
                    fixNum1 = 2;
                }
                else {
                    fixNum1 = 0;
                }
                if (val2 < 100) {
                    fixNum2 = 2;
                }
                else {
                    fixNum2 = 0;
                }
                arrVal1.push(parseFloat(val1.toFixed(fixNum1)));
                arrVal2.push(parseFloat(val2.toFixed(fixNum2)));
                break;
            }
            var tmFlag = new Date();
            var arrXAxis = [];
            tmFlag = tmFlag.format('yyyy-MM-dd HH:mm:ss');
            for (flagCount = 0; flagCount < len; flagCount++) {
                if (dataSrc.timeShaft[flagCount] >= tmFlag) {
                    break;
                }
            }


            for (var k = 0, lenK = Math.min(flagCount, dataSrc.timeShaft.length); k < lenK; k++) {
                arrXAxis.push(dataSrc.timeShaft[k].toDate().format("HH:mm"));
            }
            var xAxis = [
                {
                    type : 'category',
                    boundaryGap : true,
                    data : arrXAxis
                }
            ];

            var dataName = [];
            dataName.push(I18n.resource.dataSource.TIME_YESTERDAY);
            dataName.push(I18n.resource.dataSource.TIME_TODAY);

            var arrSeries = [
                {
                    name: dataName[0],
                    type: 'bar',
                    data: arrVal1,
                    itemStyle: {
                        normal: {
                            color: m_color[2],
                            barBorderRadius: [5, 5, 0, 0]
                        },
                        emphasis: {
                            color: m_color[2],
                            barBorderRadius: [5, 5, 0, 0]
                        }
                    },
                    markPoint : {
                        data : [
                            {type : 'max', name: I18n.resource.dashboard.modalHistoryChart.EnergyConsumption}
                        ]
                    }
                },
                {
                    name: dataName[1],
                    type: 'bar',
                    data: arrVal2,
                    itemStyle: {
                        normal: {
                            color: m_color[1],
                            barBorderRadius: [5, 5, 0, 0]
                        },
                        emphasis: {
                            color: m_color[1],
                            barBorderRadius: [5, 5, 0, 0]
                        }
                    },
                    markPoint : {
                        data : [
                            {type : 'max', name: I18n.resource.dashboard.modalHistoryChart.EnergyConsumption}
                        ]
                    }
                },
            ];

            var option = {
                title : {
                    text: '',
                    subtext: ''
                },
                dataZoom: {
                    show: false
                },
                legend: {
                    data: dataName
                },
                xAxis : xAxis,
                series : arrSeries
            };
            var optionTemp = {};
            $.extend(true,optionTemp,_this.optionDefault);
            if (_this.entity.modal.dsChartCog){
                if(_this.entity.modal.dsChartCog[0].upper != ''){
                    optionTemp.yAxis[0].max = Number(_this.entity.modal.dsChartCog[0].upper);
                }
                if(_this.entity.modal.dsChartCog[0].lower != ''){
                    optionTemp.yAxis[0].min = Number(_this.entity.modal.dsChartCog[0].lower);
                }
                if(_this.entity.modal.dsChartCog[0].unit != ''){
                    optionTemp.yAxis[0].name = _this.entity.modal.dsChartCog[0].unit;
                }
                if(_this.entity.modal.dsChartCog[0].accuracy != ''){
                    var n = Number(_this.entity.modal.dsChartCog[0].accuracy);
                    for (var i = 0; i < option.series.length; i++){
                        for (var j = 0; j < option.series[i].data.length; j++){
                            //option.series[i].data[j] = Math.round( option.series[i].data[j] * Math.pow(10, n) ) / Math.pow(10, n)
                            option.series[i].data[j] = option.series[i].data[j].toFixed(n);
                        }
                    }
                }
                var tempMarkLine;
                for(var k = 0;k < 4; k++){
                    if (_this.entity.modal.dsChartCog[0].markLine[k].value != ''){
                        if(!option.series[0].markLine){
                            option.series[0].markLine = {
                                data:[],
                                symbol:'none',
                                itemStyle:{
                                    normal:{
                                        label: {
                                            show: false
                                        }
                                    }
                                }
                            }
                        }
                        tempMarkLine =[
                                        {
                                            name:_this.entity.modal.dsChartCog[0].markLine[k].name,
                                            value:_this.entity.modal.dsChartCog[0].markLine[k].value,
                                            xAxis: -1,
                                            yAxis:Number(_this.entity.modal.dsChartCog[0].markLine[k].value)
                                        },
                                        {
                                            //xAxis:option.series[0].data.length,
                                            xAxis:dataSrc.timeShaft.length,
                                            yAxis:Number(_this.entity.modal.dsChartCog[0].markLine[k].value)
                                        }
                                    ];
                        option.series[0].markLine.data.push(tempMarkLine);
                    }
                }
            }
            _this.chart.clear();
            _this.chart.setOption($.extend(true, {}, optionTemp, option));
        }).error(function (e) {
        }).always(function (e) {
            _this.spinner.stop();
        });
    },

    ModalHistoryChartYearOnYearBar.prototype.updateModal = function (options) {

    },

    ModalHistoryChartYearOnYearBar.prototype.showConfigMode = function () {

    },

    ModalHistoryChartYearOnYearBar.prototype.setModalOption = function (option) {
        this.entity.modal.option = {};
        this.entity.modal.option.showType = 'bar';
        this.entity.modal.option.timeType = option.timeType;
    };

    ModalHistoryChart.prototype.goBackTrace = function (data) {
        this.m_bIsGoBackTrace = true;
        this.m_traceData = data;
        this.renderModal();
        this.m_bIsGoBackTrace = false;
    };

    return ModalHistoryChartYearOnYearBar;
})();