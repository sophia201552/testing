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
        grid: (function(){//统一配置grid
            var grid = {
                    borderWidth: 0,
                    borderColor: '#eee',
                    left:50,
                    bottom:40,
                    right:40,
                    top:40
                }
            if(AppConfig.isMobile){
                grid.x = 40;
            }
            return grid;
        }()),
        xAxis: [
            {
                type: 'time',
                splitLine: {show : false},
                axisLine:{
                    show:true,
                    lineStyle:{
                        color:'#72647a'
                    }
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                splitArea: {show : false},
                splitLine: {
                    show:true,
                    lineStyle:{
                        color:'#72647a'
                    }
                },
                axisLine:{
                    show:true,
                    lineStyle:{
                        color:'#72647a'
                    }
                },
                axisLabel : {
                    formatter: function (value){
                        if(AppConfig.isMobile && value/1000 >= 1){
                            return value/1000 + 'k';
                        }else{
                            return value;
                        }
                    }
                }
            }
        ],
        animation: true
    };

    ModalHistoryChart.prototype.renderModal = function () {
        !this.chart && (this.chart = echarts.init(this.container, AppConfig.chartTheme));
        var _this = this;
        if (!_this.m_bIsGoBackTrace) {
            _this.optionDefault.animation = true;
        }
        this.getData().done(function (dataSrc) {
            if(_this.screen.store){
                if(_this.screen.store.model){//在page頁面作為htmlDashboard控件才有
                    if(_this.screen.store.model.option().bg === "whiteBg"){
                        _this.optionDefault.tooltip = {
                                trigger: 'axis',
                                backgroundColor: 'rgba(0,0,0,0.7)',
                                textStyle:{
                                    color:"#ffffff"
                                }
                            }
                    }else{
                        _this.optionDefault.tooltip = {
                            trigger: 'axis',
                            backgroundColor: 'rgba(255,255,255,0.9)',
                            textStyle:{
                                color:"#000000"
                            }
                        }
                    }
                }
            }
            
            if (!dataSrc || !dataSrc.list[0].data || !dataSrc.timeShaft || dataSrc.timeShaft.length <= 0) {
                return;
            }
            var option = _this.initOption(dataSrc);
            if (undefined == option || undefined == option.series[0].data || 0 == option.series[0].data.length) {
                return;
            }
            if(AppConfig.isMobile){
                if(option.xAxis){
                    option.xAxis[0].axisLabel={
                        textStyle:{
                            color:'#e2dfe4'
                        }
                    };
                }else{
                    option.xAxis = [{
                        axisLabel:{
                            textStyle:{
                                color:'#e2dfe4'
                            }
                        }
                    }]
                }
                option.axisLabel = {
                    textStyle:{
                        color:'#e2dfe4'
                    }
                };
                var yAxisList = option.yAxis;
                if(yAxisList) {
                    for (var i = 0; i < yAxisList.length; i++) {
                        yAxisList[i].axisLabel = {
                            textStyle: {
                                color: '#e2dfe4'
                            }
                        };
                    }
                }else{
                    option.yAxis = [{
                        axisLabel:{
                            textStyle:{
                                color:'#e2dfe4'
                            }
                        }
                    }]
                }
            }
            var optionTemp = {};
            $.extend(true,optionTemp,_this.optionDefault);
            _this.chart.clear();
            _this.chart.setOption($.extend(true, {}, optionTemp, option));
        }).error(function (e) {
        }).always(function (e) {
            _this.spinner && _this.spinner.stop();
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

    ModalHistoryChart.prototype.resize = function(){
        this.chart && this.chart.resize();
    }

    return ModalHistoryChart;
})();


// 历史柱状图-周/月/年
var ModalHistoryChartNormal = (function () {
    var m_color = ['#e74a37','#ff8050','#1abd9b','#3499da','#3e72ac'];
    var m_colorLen = m_color.length;

    function ModalHistoryChartNormal(screen, entityParams, _renderModal, _updateModal, _showConfigMode) {
        if(!screen) return;
        var renderModal = _renderModal ? _renderModal : this.renderModal;
        var updateModal = _updateModal ? _updateModal : this.updateModal;
        var showConfigMode = _showConfigMode ? _showConfigMode : this.showConfigMode;
        ModalHistoryChart.call(this, screen, entityParams, renderModal, updateModal, showConfigMode);
        this.spinner && this.spinner.spin(this.container);
        //兼容老数据
        !this.entity.modal.option && (this.entity.modal.option = {});
        !this.entity.modal.option.mode && (this.entity.modal.option.mode = 0);
        !this.entity.modal.option.recentTime && (this.entity.modal.option.recentTime = 'today');
        !this.entity.modal.option.format && (this.entity.modal.option.format = 'h1');
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
        type:'ModalHistoryChartNormal',
        tooltip: {
            'imgPC': true,
            'imgMobile': false,
            'isSpecData':false,
            'desc': ''
        }
    }

    ModalHistoryChartNormal.prototype.initOption = function(dataSrc){
        if (!dataSrc || !dataSrc.list[0].data) {
            return;
        }

        var xLen = dataSrc.timeShaft.length;
        var xAxis, format;
        var arrXAxis = [];
        if ('month' == this.entity.modal.option.timeType || this.entity.modal.option.format === 'd1') {
            format = "MM-dd"
        }
        else if ('week' == this.entity.modal.option.timeType) {
            format = "yyyy-MM-dd";
        }
        else if ('day' == this.entity.modal.option.timeType  || this.entity.modal.option.format === 'h1') {
            format = "MM-dd HH:00";
        }else if(this.entity.modal.option.format === 'm5'){
            format = "MM-dd HH:mm";
        }else if(this.entity.modal.option.format === 'M1'){
            format = "yyyy-MM";
        }

        for (var i=0; i<xLen; i++) {
            arrXAxis.push(dataSrc.timeShaft[i].toDate().format(format));
        }

        xAxis = [
            {
                type : 'category',
                axisLine:{
                show:true,
                lineStyle:{
                    color:'#4E5D77'
                }
            },
                data : arrXAxis
            }
        ]

        var dataName = this.initPointAlias(dataSrc.list);
        var arrSeries = [];

        var showColor = '#1abd9b';
        for (var i = 0; i < dataSrc.list.length; i++) {
            if (dataSrc.list.length > 1) {  // compatible design picture
                showColor = m_color[i % m_colorLen];
            }

            arrSeries.push(
                {
                    name: dataName[i],
                    type: this.entity.modal.option.showType,
                    data: dataSrc.list[i].data,
                    itemStyle: {
                        normal: {
                            //color: showColor,
                            //barBorderRadius: [5, 5, 0, 0]
                        },
                        emphasis: {
                            //color: showColor,
                            //barBorderRadius: [5, 5, 0, 0]
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
                data: dataName,
                icon: 'circle',
                itemWidth:20,
                itemHeight:10,
                left: 'center',
                top: '10'//单位px
            },
            dataZoom: {
                show: false
            },
            xAxis : xAxis,
            yAxis:{
                axisLine:{
                    show:false
                }
            },
            series : arrSeries
        };
        if(AppConfig.isMobile){
            dataOption.itemStyle = {
               normal:{
                   color:new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                      offset: 0, color: 'rgba(248,187,146,0.8)' // 0% 处的颜色
                    }, {
                      offset: 1, color: 'rgba(190,101,201,0.8)' // 100% 处的颜色10
                    }], false),
                   barBorderRadius: 0
               }
           };
        }
        return dataOption;
    };

    ModalHistoryChartNormal.prototype.setModalOption = function (option) {
        this.entity.modal.option = {};
        this.entity.modal.option.showType = option.showType;
        this.entity.modal.option.timeType = option.timeType;
    };

    ModalHistoryChartNormal.prototype.modalInit = function(){
        !this.entity.modal.option && (this.entity.modal.option = {});
        var _this = this;
        var configModalOpt = {
                "header" : {
                "needBtnClose" : true,
                "title" : "配置"
            },
            "area" : [
                {
                    module:'timeConfig',
                    data:{
                        mode: this.entity.modal.option.mode,
                        format: this.entity.modal.option.format,
                        recentTime: this.entity.modal.option.recentTime,
                        val: this.entity.modal.option.val,
                        unit: this.entity.modal.option.unit,
                        startTime: this.entity.modal.option.startTime,
                        endTime: this.entity.modal.option.endTime
                    }
                },
                {
                    "type": 'option',
                    "widget":[{id:'selChartType',type:'select',name:'图表类型',
                        opt:{
                            option:[
                                {val: 'bar', name: '柱图'},
                                {val: 'line', name: '折线图'}
                            ]
                        },
                        data:{val: this.entity.modal.option.showType}
                    }]
                },
                {
                    "module" : "dsDrag",
                    "data":[{
                        type:'point',name:'数据点位',data: this.entity.modal.points ? (this.entity.modal.points[0] instanceof Array ? this.entity.modal.points[0] : this.entity.modal.points) : [],forChart:false//为了兼容data数据
                    }]
                },{
                    'type':'footer',
                    "widget":[{type:'confirm',opt:{needClose:true}},{type:'cancel'}]
                },
            ],
            result:{func: function(data){
                !_this.entity.modal.option && (_this.entity.modal.option = {});
                _this.entity.modal.option.mode = data.mode;
                _this.entity.modal.option.format = data.format;
                if(data.mode === '1'){
                    _this.entity.modal.option.startTime = data.startTime;
                    _this.entity.modal.option.endTime = data.endTime;
                }else if(data.mode === '2'){
                    _this.entity.modal.option.unit = data.unit;
                    _this.entity.modal.option.val = data.val;
                }
                _this.entity.modal.option.showType = data.selChartType.val;
                _this.entity.modal.option.recentTime = data.recentTime;

                _this.entity.modal.points = data.points[0];
                _this.renderModal();
            }}
        };
        this.configModal = new ConfigModal(configModalOpt, this.screen.container ? this.screen.container : this.screen.page.painterCtn);
        this.configModal.init();
        this.configModal.show();
    };

    return ModalHistoryChartNormal;
})();


// 历史能耗图-周/月/年
var ModalHistoryChartEnergyConsume = (function () {
    function ModalHistoryChartEnergyConsume(screen, entityParams, _renderModal, _updateModal, _showConfigMode) {
        if(!screen) return;
        var renderModal = _renderModal ? _renderModal : this.renderModal;
        var updateModal = _updateModal ? _updateModal : this.updateModal;
        var showConfigMode = _showConfigMode ? _showConfigMode : this.showConfigMode;
        ModalHistoryChart.call(this, screen, entityParams, renderModal, updateModal, showConfigMode);
        this.spinner && this.spinner.spin(this.container);
        //兼容老数据
        !this.entity.modal.option && (this.entity.modal.option = {});
        !this.entity.modal.option.mode && (this.entity.modal.option.mode = 0);
        !this.entity.modal.option.recentTime && (this.entity.modal.option.recentTime = 'today');
        !this.entity.modal.option.format && (this.entity.modal.option.format = 'h1');
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
        type:'ModalHistoryChartEnergyConsume',
        tooltip: {
            'imgPC': true,
            'imgMobile': false,
            'isSpecData':false,
            'desc': ''
        }
    }

    ModalHistoryChartEnergyConsume.prototype.initOption = function(dataSrc){
        if (!dataSrc || !dataSrc.list || !dataSrc.list[0]) {
            return;
        }

        var xLen = dataSrc.timeShaft.length;
        /*var xAxis;
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
        else if ('day' == this.entity.modal.option.timeType || 'today' === this.entity.modal.option.timeType) {
            for (var i=0; i<xLen - 1; i++) {
                arrXAxis.push(dataSrc.timeShaft[i].toDate().format('MM-dd HH:00'));
            }
            showColor = '#3e72ac';
        }*/

        var xAxis, format;
        var arrXAxis = [];
        if ('month' == this.entity.modal.option.timeType || this.entity.modal.option.format === 'd1') {
            format = "MM-dd"
        }
        else if ('week' == this.entity.modal.option.timeType) {
            format = "yyyy-MM-dd";
        }
        else if ('day' == this.entity.modal.option.timeType  || this.entity.modal.option.format === 'h1') {
            format = "MM-dd HH:00";
        }else if(this.entity.modal.option.format === 'm5'){
            format = "MM-dd HH:mm";
        }else if(this.entity.modal.option.format === 'M1'){
            format = "yyyy-MM";
        }
        for (var i=0; i<xLen; i++) {
            arrXAxis.push(dataSrc.timeShaft[i].toDate().format(format));
        }

        xAxis = [
            {
                type : 'category',
                data : arrXAxis
            }
        ]

        var dataName = this.initPointAlias(dataSrc.list);
        var arrSeries = [];
        for (var i = 0; i < dataSrc.list.length; i++) {
            if (dataSrc.list.length > 1) {  // compatible design picture
                //showColor = m_color[i % m_colorLen];
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
                    itemStyle: {
                        normal: {
                            //color: showColor,
                            barBorderRadius: [5, 5, 5, 5]
                        },
                        emphasis: {
                            //color: showColor,
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
                show: true,
                data: dataName,
                icon: 'circle',
                itemWidth:20,
                itemHeight:10,
                left: 'center',
                top: '10'
            },
            dataZoom: {
                show: false
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

    ModalHistoryChartEnergyConsume.prototype.modalInit = function(){
        !this.entity.modal.option && (this.entity.modal.option = {})
        var _this = this;
        var configModalOpt = {
                "header" : {
                "needBtnClose" : true,
                "title" : "配置"
            },
            "area" : [
                {
                    module:'timeConfig',
                    data:{
                        mode: this.entity.modal.option.mode,
                        format: this.entity.modal.option.format,
                        recentTime: this.entity.modal.option.recentTime,
                        val: this.entity.modal.option.val,
                        unit: this.entity.modal.option.unit,
                        startTime: this.entity.modal.option.startTime,
                        endTime: this.entity.modal.option.endTime
                    }
                },
                {
                    "module" : "dsDrag",
                    "data":[{
                        type:'point',name:'数据点位',data: this.entity.modal.points ? (this.entity.modal.points[0] instanceof Array ? this.entity.modal.points[0] : this.entity.modal.points) : [],forChart:false
                    }]
                },{
                    'type':'footer',
                    "widget":[{type:'confirm',opt:{needClose:true}},{type:'cancel'}]
                },
            ],
            result:{func: function(data){
                !_this.entity.modal.option && (_this.entity.modal.option = {});
                _this.entity.modal.option.mode = data.mode;
                _this.entity.modal.option.format = data.format;
                if(data.mode === '1'){
                    _this.entity.modal.option.startTime = data.startTime;
                    _this.entity.modal.option.endTime = data.endTime;
                }else if(data.mode === '2'){
                    _this.entity.modal.option.unit = data.unit;
                    _this.entity.modal.option.val = data.val;
                }
                _this.entity.modal.option.recentTime = data.recentTime;
                _this.entity.modal.option.showType = 'bar';
                _this.entity.modal.points = data.points[0];
                _this.renderModal();
            }}
        };
        this.configModal = new ConfigModal(configModalOpt, this.screen.container ? this.screen.container : this.screen.page.painterCtn);
        this.configModal.init();
        this.configModal.show();
    };

    return ModalHistoryChartEnergyConsume;
})();


// 历史同比折线图
var ModalHistoryChartYearOnYearLine = (function () {
    var _this;
    function ModalHistoryChartYearOnYearLine(screen, entityParams, _renderModal, _updateModal, _showConfigMode) {
        if (!screen) return;
        var renderModal = _renderModal ? _renderModal : this.renderModal;
        var updateModal = _updateModal ? _updateModal : this.updateModal;
        var showConfigModal = _showConfigMode ? _showConfigMode : this.showConfigMode;
        ModalHistoryChart.call(this, screen, entityParams, renderModal, updateModal, showConfigModal);

        this.option = entityParams.option;
        this.spinner && this.spinner.spin(this.container);
        this.store = {};
        this.pointAlias = this.entity.modal.points?AppConfig.datasource.getDSItemById(this.entity.modal.points[0]).alias:'';
        this.m_bIsGoBackTrace = false;
        this.m_traceData = undefined;
        _this = this;

        //兼容老数据
        !this.entity.modal.option && (this.entity.modal.option = {});
        !this.entity.modal.option.mode && (this.entity.modal.option.mode = 0);
        !this.entity.modal.option.recentTime && (this.entity.modal.option.recentTime = 'today');
        !this.entity.modal.option.format && (this.entity.modal.option.format = 'h1');
    };

    ModalHistoryChartYearOnYearLine.prototype = new ModalHistoryChart();

    ModalHistoryChartYearOnYearLine.prototype.optionTemplate = {
        name:'toolBox.modal.HIS_CHART_YEAR_LINE',
        parent:1,
        mode:['easyCompareToggle'],
        maxNum: 1,
        title:'',
        minHeight:2,
        minWidth:3,
        maxHeight:6,
        maxWidth:12,
        type:'ModalHistoryChartYearOnYearLine',
        tooltip: {
            'imgPC': true,
            'imgMobile': false,
            'isSpecData':false,
            'desc': ''
        }

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
        color:['#E2583A','#FD9F08','#FEC500','#1D74A9','#04A0D6','#689C0F','#109d83'],
        /*grid: {
            x: 70, y: 38, x2: 30, y2: 24
        },*/
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
        !this.chart && (this.chart = echarts.init(this.container, AppConfig.chartTheme));
        var hourMilSec = 3600000;
        var dayMilSec = 86400000;

        var startDate = new Date();
        var endDate = new Date();
        var tmFlag = new Date();
        var timeType = _this.entity.modal.option.format ? _this.entity.modal.option.format : 'h1';

        if ('hour' == _this.entity.modal.option.timeType || 'm5' === timeType) {
            //timeType = 'm5';
            startDate.setTime(endDate.getTime() - hourMilSec);
            startDate.setMinutes(0);
            startDate.setSeconds(0);

            tmFlag.setTime(endDate.getTime());
            tmFlag.setMinutes(0);
            tmFlag.setSeconds(0);
            tmFlag.setMilliseconds(0);
        }else if ('day' == _this.entity.modal.option.timeType || 'h1' == timeType) {
            //timeType = 'h1';
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
            startTime = startDate.format('yyyy-MM-dd 00:00:00');
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
        if(_this.screen.store){
            if(_this.screen.store.model){//在page頁面作為htmlDashboard控件才有
                if(_this.screen.store.model.option().bg === "whiteBg"){
                    _this.optionDefault.tooltip = {
                            trigger: 'axis',
                            backgroundColor: 'rgba(0,0,0,0.7)',
                            textStyle:{
                                color:"#ffffff"
                            }
                        }
                }else{
                    _this.optionDefault.tooltip = {
                        trigger: 'axis',
                        backgroundColor: 'rgba(255,255,255,0.9)',
                        textStyle:{
                            color:"#000000"
                        }
                    }
                }
            }
        }
        this.getData({startTime: startTime, endTime: endTime, timeFormat: timeType}).done(function (dataSrc) {
            if (!dataSrc || !dataSrc.list || !dataSrc.list[0] || !dataSrc.list[0].data || !dataSrc.timeShaft || dataSrc.timeShaft.length <= 0) {
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
            var chartType = _this.entity.modal.option.showType?_this.entity.modal.option.showType:'line';

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
                            type: chartType,
                            data: showData,
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
                    if (i === 1) {
                        arrSeries[1].symbol = 'rect';
                        var blingDot = $.extend(true, {}, arrSeries[1]);
                        var seriesOne = arrSeries[1];
                        seriesOne.type = 'effectScatter';
                        seriesOne.symbolSize = 10;
                        seriesOne.symbol = 'circle'
                        seriesOne.rippleEffect = {
                            brushType: 'stroke'
                        };
                        seriesOne.itemStyle.normal.shadowBlur = 10;
                        var blingDotData = $.extend(true, {}, showData);
                        for (var p = 0, lens = showData.length; p < lens; p++) {
                            if (p < lens - 1) {
                                showData[p] = '-';
                            }
                        }
                        //seriesOne.markLine = {
                        //    data: blingDotData
                        //}
                        var blingDotDataArr = [];
                        for (var item in blingDotData) {
                            blingDotDataArr.push(blingDotData[item]);
                        }
                        blingDot.data = showData;
                        arrSeries[1] = blingDot;
                        arrSeries[1].data = blingDotDataArr;
                        arrSeries.push(seriesOne);
                    }
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
                    data: dataName,
                    icon: 'circle',
                    itemWidth:20,
                    itemHeight:10,
                    left: 'center',
                    top: '10'
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
            _this.spinner && _this.spinner.stop();
        });
    },

    ModalHistoryChartYearOnYearLine.prototype.updateModal = function (options) {
        var _this = this;
        var modalOptions = this.entity.modal.option;
        var lastIndex, lastTick, nowTick;
        if (undefined === options || options.length < 1 || undefined === options[0]) {
            return;
        }
        //lastIndex = this.chart.getSeries()[1].data.length - 1;
        lastIndex = this.chart.getOption().series[1].data.length - 1;
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

        var opt = _this.chart.getOption();
        for (var i = 0, len = options.length; i < len; i++) {
            if (options[i].data !== null) {
                /*addParam.push([
                    1,
                    options[i].data,
                    false,
                    true
                ]);*/
                opt.series[1].data.push(options[i].data);//series[1]是今天
            }
        }
        //_this.chart.addData(addParam);
        //新版本的chart没有addData方法,只好setOption
        _this.chart.setOption(opt);

        // markPoint
        //_this.chart.delMarkPoint(1, '');

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
        this.entity.modal.option.showType = option.showType?option.showType:'line';
        this.entity.modal.option.timeType = option.timeType;
    };

    ModalHistoryChartYearOnYearLine.prototype.modalInit = function(){
        !this.entity.modal.option && (this.entity.modal.option = {});
        var _this = this;
        var configModalOpt = {
                "header" : {
                "needBtnClose" : true,
                "title" : "配置"
            },
            "area" : [
                {
                    module:'timeConfig',
                    data:{
                        mode: '0',
                        format: 'h1',
                        recentTime: 'yesterday'
                    }
                },
                {
                    "type": 'option',
                    "widget":[{id:'selChartType',type:'select',name:'图表类型',
                        opt:{
                            option:[
                                {val: 'bar', name: '柱图'},
                                {val: 'line', name: '折线图'}
                            ]
                        },
                        data:{val: this.entity.modal.option.showType}
                    }]
                },
                {
                    "module" : "dsDrag",
                    "data":[{
                        type:'point',name:'数据点位',data: this.entity.modal.points ? (this.entity.modal.points[0] instanceof Array ? this.entity.modal.points[0] : this.entity.modal.points) : [],forChart:false
                    }]
                },{
                    'type':'footer',
                    "widget":[{type:'confirm',opt:{needClose:true}},{type:'cancel'}]
                },
            ],
            result:{func: function(data){
                !_this.entity.modal.option && (_this.entity.modal.option = {});
                _this.entity.modal.option.mode = 0;
                _this.entity.modal.option.format = 'h1';

                _this.entity.modal.option.showType = data.selChartType.val;
                _this.entity.modal.option.recentTime = 'yesterday';

                _this.entity.modal.points = data.points[0];
                _this.renderModal();
            }}
        };
        this.configModal = new ConfigModal(configModalOpt, this.screen.container ? this.screen.container : this.screen.page.painterCtn);
        this.configModal.init();
        //模态框特殊处理
        this.configModal.modalBody.querySelector('.divMode select').disabled = true;
        this.configModal.modalBody.querySelector('.divRecentTime select').disabled = true;
        this.configModal.show();
    };

    return ModalHistoryChartYearOnYearLine;
})();


// 历史同比柱状图
var ModalHistoryChartYearOnYearBar = (function () {
    var m_color = ['#e74a37','#ff8050','#1abd9b','#3499da','#3e72ac'];

    function ModalHistoryChartYearOnYearBar(screen, entityParams, _renderModal, _updateModal, _showConfigMode) {
        if (!screen) return;
        var renderModal = _renderModal ? _renderModal : this.renderModal;
        var updateModal = _updateModal ? _updateModal : this.updateModal;
        var showConfigModal = _showConfigMode ? _showConfigMode : this.showConfigMode;
        ModalHistoryChart.call(this, screen, entityParams, renderModal, updateModal, showConfigModal);

        this.m_bIsGoBackTrace = false;
        this.m_traceData = undefined;
        this.option = entityParams.option;
        this.spinner && this.spinner.spin(this.container);

        //兼容老数据
        !this.entity.modal.option && (this.entity.modal.option = {});
        !this.entity.modal.option.mode && (this.entity.modal.option.mode = 0);
        !this.entity.modal.option.recentTime && (this.entity.modal.option.recentTime = 'today');
        !this.entity.modal.option.format && (this.entity.modal.option.format = 'h1');
    };

    ModalHistoryChartYearOnYearBar.prototype = new ModalHistoryChart();

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
        type:'ModalHistoryChartYearOnYearBar',
        tooltip: {
            'imgPC': true,
            'imgMobile': false,
            'isSpecData':false,
            'desc': ''
        }

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
        /*grid: {
            x: 70, y: 38, x2: 30, y2: 24
        },*/
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
        !this.chart && (this.chart = echarts.init(this.container, AppConfig.chartTheme));

        var dayMilSec = 86400000;
        var startDate = new Date();
        var endDate = new Date();
        var startDateZero = new Date();
        var endDateZero = new Date();
        var timeType = _this.entity.modal.option.format ? _this.entity.modal.option.format : 'h1';
        if ('day' == _this.entity.modal.option.timeType || 'h1' == timeType) {
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

        var curDate;
        if (!_this.m_bIsGoBackTrace) {  // normal show history data
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
        }
        if(_this.screen.store){
            if(_this.screen.store.model){//在page頁面作為htmlDashboard控件才有
                if(_this.screen.store.model.option().bg === "whiteBg"){
                    _this.optionDefault.tooltip = {
                            trigger: 'axis',
                            backgroundColor: 'rgba(0,0,0,0.7)',
                            textStyle:{
                                color:"#ffffff"
                            }
                        }
                }else{
                    _this.optionDefault.tooltip = {
                        trigger: 'axis',
                        backgroundColor: 'rgba(255,255,255,0.9)',
                        textStyle:{
                            color:"#000000"
                        }
                    }
                }
            }
        }
        this.getData({startTime: startDateZero.format('yyyy-MM-dd HH:mm:ss'), endTime: endDate.format('yyyy-MM-dd HH:mm:ss'), timeFormat: timeType}).done(function (dataSrc) {
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
            for (var flagCount = 0; flagCount < len; flagCount++) {
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

            var chartType = _this.entity.modal.option.showType?_this.entity.modal.option.showType:'bar';
            var dataName = [];
            dataName.push(I18n.resource.dataSource.TIME_YESTERDAY);
            dataName.push(I18n.resource.dataSource.TIME_TODAY);

            var arrSeries = [
                {
                    name: dataName[0],
                    type: chartType,
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
                    type: chartType,
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
                    data: dataName,
                    icon: 'circle',
                    itemWidth:20,
                    itemHeight:10,
                    left: 'center',
                    top: '10'
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
            _this.spinner && _this.spinner.stop();
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

    ModalHistoryChartYearOnYearBar.prototype.modalInit = function(){
        !this.entity.modal.option && (this.entity.modal.option = {});
        var _this = this;
        var configModalOpt = {
                "header" : {
                "needBtnClose" : true,
                "title" : "配置"
            },
            "area" : [
                {
                    module:'timeConfig',
                    data:{
                        mode: '0',
                        format: 'h1',
                        recentTime: 'yesterday'
                    }
                },
                {
                    "module" : "dsDrag",
                    "data":[{
                        type:'point',name:'数据点位',data: this.entity.modal.points ? (this.entity.modal.points[0] instanceof Array ? this.entity.modal.points[0] : this.entity.modal.points) : [],forChart:false
                    }]
                },{
                    'type':'footer',
                    "widget":[{type:'confirm',opt:{needClose:true}},{type:'cancel'}]
                },
            ],
            result:{func: function(data){
                !_this.entity.modal.option && (_this.entity.modal.option = {});
                _this.entity.modal.option.mode = 0;
                _this.entity.modal.option.format = 'h1';
                _this.entity.modal.option.recentTime = 'yesterday';

                _this.entity.modal.points = data.points[0];
                _this.renderModal();
            }}
        };
        this.configModal = new ConfigModal(configModalOpt, this.screen.container ? this.screen.container : this.screen.page.painterCtn);
        this.configModal.init();
        //模态框特殊处理
        this.configModal.modalBody.querySelector('.divMode select').disabled = true;
        this.configModal.modalBody.querySelector('.divRecentTime select').disabled = true;
        this.configModal.show();
    };

    return ModalHistoryChartYearOnYearBar;
})();

/*拖拽分析历史数据*/
var ModalHistoryDataAnalyze = (function(){
    function ModalHistoryDataAnalyze(screen, entityParams, _renderModal, _updateModal, _showConfigMode) {
        if (!screen) return;
        var renderModal = _renderModal ? _renderModal : this.renderModal;
        var updateModal = _updateModal ? _updateModal : this.updateModal;
        var showConfigMode = _showConfigMode ? _showConfigMode : this.showConfigMode;
        this.m_bIsGoBackTrace = false;
        this.m_traceData = undefined;
        ModalHistoryChart.call(this, screen, entityParams, renderModal, updateModal, showConfigMode);
        this.store = [];
        !AppConfig.datasource && (AppConfig.datasource = {
            getDSItemById: DataSource.prototype.getDSItemById.bind({
                m_parent: {
                    store: {
                        dsInfoList: []
                    }
                },
                m_arrCloudTableInfo: []
            })
        })

    }
    ModalHistoryDataAnalyze.prototype = new ModalHistoryChart();
    ModalHistoryDataAnalyze.prototype.optionTemplate = {
        name:'toolBox.modal.HIS_CHART_ANALYSE',//'ModalHistoryChart',        parent:1,
        parent:1,
        mode:['easyHistory'],
        maxNum: 5,
        title:'',
        minHeight:2,
        minWidth:3,
        maxHeight:6,
        maxWidth:12,
        type:'ModalHistoryDataAnalyze',
        tooltip: {
            'imgPC': true,
            'imgMobile': false,
            'isSpecData':false,
            'desc': ''
        }
    };
    ModalHistoryDataAnalyze.prototype.renderModal = function(){
        this.container.innerHTML = '\
        <div class="ctnTimeConfig"><div class="divTimeConfig clearfix"></div>\
            <!--<div class="divDataConfig"></div>-->\
            <div class="btnTimeConfigGrp">\
            <div class="divConfigConfirm btn btn-primary" i18n="dashboard.modalHistoryDataAnalyze.DATE_CONFIRM">' + I18n.resource.dashboard.modalHistoryDataAnalyze.DATE_CONFIRM + '</div>\
            <div class="divConfigCancel btn btn-default" i18n="dashboard.modalHistoryDataAnalyze.DATE_CANCEL">'+I18n.resource.dashboard.modalHistoryDataAnalyze.DATE_CANCEL+'</div>\
            </div>\
        </div>\
        <div class="btnShowTimeConfig glyphicon glyphicon-cog"></div>\
        <div class="dragTip" i18n="dashboard.modalHistoryDataAnalyze.DRAG_TIP_FOR_CHART">'+I18n.resource.dashboard.modalHistoryDataAnalyze.DRAG_TIP_FOR_CHART+'</div>\
        <div class="divHistoryChart"></div>\
        ';
        this.container.parentNode.className += ' widgetHistoryAnalyze forDashboard';
        this.ctnTimeConfig = this.container.querySelector('.ctnTimeConfig');
        this.divTimeConfig = this.container.querySelector('.divTimeConfig');
        this.ctnChart = this.container.querySelector('.divHistoryChart');
        this.createTimeConfig();
        this.attachEvent();
        I18n.fillArea($(this.container));
    };
    ModalHistoryDataAnalyze.prototype.createTimeConfig = function(){
        var mode = document.createElement('div');
        //mode.className = 'divTimeMode col-sm-3 col-lg-2';
        mode.className = 'divTimeMode';
        mode.innerHTML = '\
        <label i18n="modalConfig.option.LABEL_MODE">'+I18n.resource.modalConfig.option.LABEL_MODE+'</label>\
        <select class="form-control iptTimeMode">\
            <option value="0" i18n="modalConfig.option.MODE_CURRENT">'+I18n.resource.modalConfig.option.MODE_CURRENT+'</option>\
            <option value="1" i18n="modalConfig.option.MODE_RECENT">'+I18n.resource.modalConfig.option.MODE_RECENT+'</option>\
            <option value="2" i18n="modalConfig.option.MODE_FIXED">'+I18n.resource.modalConfig.option.MODE_FIXED+'</option>\
        </select>';
        this.divTimeConfig.appendChild(mode);
        this.createTimeRange(0);
        I18n.fillArea($(this.ctnTimeConfig));
    };
    ModalHistoryDataAnalyze.prototype.createTimeRange = function(mode){
        $(this.divTimeConfig).find('.divTimeInterval').remove();
        $(this.divTimeConfig).find('.divTimeRange').remove();
        var divTimeRange = document.createElement('div');
        divTimeRange.className = 'divTimeRange form-group';
        switch (mode){
            case 0:
                //divTimeRange.className += 'col-xs-3 col-lg-4';
                this.divTimeConfig.appendChild(divTimeRange);
                divTimeRange.innerHTML ='\
                <label i18n="modalConfig.option.LABEL_TIME_RANGE">'+I18n.resource.modalConfig.option.LABEL_TIME_RANGE+'</label>\
                <select class="form-control selRecentTimeRange">\
                    <option value="today" i18n="modalConfig.option.PERIOD_DROP_DOWN_TODAY">'+I18n.resource.modalConfig.option.PERIOD_DROP_DOWN_TODAY+'</option>\
                    <option value="threeDay"  i18n="modalConfig.option.PERIOD_DROP_DOWN_THREE_DAY">'+I18n.resource.modalConfig.option.PERIOD_DROP_DOWN_THREE_DAY+'</option>\
                    <option value="yesterday" selected=""  i18n="modalConfig.option.PERIOD_DROP_DOWN_YESTERDAY">'+I18n.resource.modalConfig.option.PERIOD_DROP_DOWN_YESTERDAY+'</option>\
                    <option value="thisWeek" i18n="modalConfig.option.PERIOD_DROP_DOWN_THIS_WEEK">'+I18n.resource.modalConfig.option.PERIOD_DROP_DOWN_THIS_WEEK+'</option>\
                    <option value="lastWeek" i18n="modalConfig.option.PERIOD_DROP_DOWN_LAST_WEEK">'+I18n.resource.modalConfig.option.PERIOD_DROP_DOWN_LAST_WEEK+'</option>\
                    <option value="thisYear" i18n="modalConfig.option.PERIOD_DROP_DOWN_THIS_YEAR">'+I18n.resource.modalConfig.option.PERIOD_DROP_DOWN_THIS_YEAR+'</option>\
                </select>\
                ';
                break;
            case 1:
                //divTimeRange.className += 'col-sm-6 col-lg-8';
                this.divTimeConfig.appendChild(divTimeRange);
                divTimeRange.innerHTML ='\
                <label i18n="modalConfig.option.LABEL_TIME_RANGE">'+I18n.resource.modalConfig.option.LABEL_TIME_RANGE+'</label>\
                <div class="input-group" style="width:100%">\
                    <input class="iptRecentTimeVal form-control" style="width:60%">\
                    <select class="selRecentTimeUnit form-control" style="width:40%">\
                        <option value="minute" i18n="modalConfig.option.PERIOD_UNIT_MIN">'+I18n.resource.modalConfig.option.PERIOD_UNIT_MIN+'</option>\
                        <option value="hour" i18n="modalConfig.option.PERIOD_UNIT_HOUR">'+I18n.resource.modalConfig.option.PERIOD_UNIT_HOUR+'</option>\
                        <option value="day" i18n="modalConfig.option.PERIOD_UNIT_DAY">'+I18n.resource.modalConfig.option.PERIOD_UNIT_DAY+'</option>\
                        <option value="month" i18n="modalConfig.option.PERIOD_UNIT_MON">'+I18n.resource.modalConfig.option.PERIOD_UNIT_MON+'</option>\
                    </select>\
                </div>\
                ';
                this.divTimeConfig.insertBefore(this.createTimeInterval('minute'),divTimeRange);
                var _this = this;
                $(divTimeRange).find('.selRecentTimeUnit').off('change').on('change',function(e){
                    $(_this.divTimeConfig).find('.divTimeInterval').remove();
                    _this.divTimeConfig.insertBefore(_this.createTimeInterval(e.currentTarget.value),e.currentTarget.parentNode.parentNode);
                    I18n.fillArea($(_this.ctnTimeConfig));
                });
                break;
            case 2:
                //divTimeRange.className += 'col-sm-6 col-lg-8';
                this.divTimeConfig.appendChild(divTimeRange);
                divTimeRange.innerHTML ='\
                <label i18n="modalConfig.option.LABEL_TIME_RANGE">'+I18n.resource.modalConfig.option.LABEL_TIME_RANGE+'</label>\
                <div class="input-group">\
                    <input class="form-control form_datetime iptStartTime" size="16" type="text" data-format="yyyy-mm-dd hh:ii" datetimepicker>\
                    <span class="input-group-addon" i18n="modalConfig.option.TIP_RANGE_TO">${I18n.resource.modalConfig.option.TIP_RANGE_TO}</span>\
                    <input class="form-control form_datetime iptEndTime" size="16" type="text" data-format="yyyy-mm-dd hh:ii" datetimepicker>\
                </div>\
                ';
                this.divTimeConfig.insertBefore(this.createTimeInterval(),divTimeRange);
                break;
            default :break;
            I18n.fillArea($(this.ctnTimeConfig));
        }
    };
    ModalHistoryDataAnalyze.prototype.setFixedRangeInterval = function(interval){
        var iptStartTime = this.divTimeConfig.querySelector('.iptStartTime');
        var iptEndTime = this.divTimeConfig.querySelector('.iptEndTime');
        var format  = 'yyyy-MM-dd HH:mm';
        var datePikerFormat = 'yyyy-mm-dd hh:ii';
        $(iptStartTime).attr('value',new Date().format(format)).datetimepicker({
            todayBtn:'linked',
            endTime:new Date(),
            format:datePikerFormat,
            autoclose:true,
            initialDate:new Date().format(format)
        });
        $(iptEndTime).attr('value',new Date().format(format)).datetimepicker({
            todayBtn:'linked',
            endTime:new Date(),
            format:datePikerFormat,
            autoclose:true,
            initialDate:new Date().format(format)
        });
    };
    ModalHistoryDataAnalyze.prototype.getTimeConfig = function(){
        var mode = this.divTimeConfig.querySelector('.iptTimeMode').value;
        var dateTimeRange = this.divTimeConfig.querySelector('.divTimeRange');
        var dateInterval = $(this.divTimeConfig).find('.divTimeInterval>select')[0];
        var startTime,endTime,interval,range;
        var now = new Date();
        if (mode == 0 ){
            var timeRangeVal = dateTimeRange.querySelector('.selRecentTimeRange').value;
            switch (timeRangeVal){
                case 'today':
                    startTime = new Date(now.getTime() - 86400000).format('yyyy-MM-dd HH:mm:ss');
                    endTime = now.format('yyyy-MM-dd HH:mm:ss');
                    interval = 'h1';
                    break;
                case 'threeDay':
                    startTime = new Date(now.getTime() - 259200000).format('yyyy-MM-dd HH:mm:ss');
                    endTime = now.format('yyyy-MM-dd HH:mm:ss');
                    interval = 'h1';
                    break;
                case 'yesterday':
                    startTime = new Date(now.getTime() - 86400000).format('yyyy-MM-dd 00:00:00');
                    endTime = new Date(now.getTime() - 86400000).format('yyyy-MM-dd 23:59:59');
                    interval = 'h1';
                    break;
                case 'thisWeek':
                    startTime = new Date(now.getTime() - 604800000).format('yyyy-MM-dd HH:mm:ss');
                    endTime = now.format('yyyy-MM-dd HH:mm:ss');
                    interval = 'd1';
                    break;
                case 'lastWeek':
                    var weekVal = DateUtil.getWeekNumber(now);
                    var dateRange = DateUtil.getDateRangeOnWeekNumber(weekVal[0],weekVal[1]-1);
                    startTime = new Date(dateRange[0].getTime() - 604800000).format('yyyy-MM-dd 00:00:00');
                    endTime = new Date(dateRange[1].getTime() - 604800000).format('yyyy-MM-dd 23:59:59');
                    interval = 'd1';
                    break;
                case 'thisYear':
                    startTime = new Date(now.getTime() - 31536000000).format('yyyy-MM-dd HH:mm:ss');
                    endTime = now.format('yyyy-MM-dd HH:mm:ss');
                    interval = 'M1';
                    break;
            }
        }else if (mode == 1){
            var dateTimeUnit = dateTimeRange.querySelector('.selRecentTimeUnit').value;
            var unitTime = 0 ;
            var dataTimeVal = parseInt(dateTimeRange.querySelector('.iptRecentTimeVal').value);
            if (isNaN(dataTimeVal))return;
            switch (dateTimeUnit){
                case 'minute':
                    unitTime = 60000;
                    break;
                case 'hour':
                    unitTime = 3600000;
                    break;
                case 'day':
                    unitTime = 86400000;
                    break;
                case 'month':
                    unitTime = 2592000000;
                    break;
            }
            interval = dateInterval.value;
            startTime = new Date(now.getTime() - unitTime * dataTimeVal).format('yyyy-MM-dd HH:mm:ss');
            endTime = now.format('yyyy-MM-dd HH:mm:ss');
        }else if (mode == 2){
            interval = dateInterval.value;
            startTime = new Date(dateTimeRange.querySelector('.iptStartTime').value).format('yyyy-MM-dd HH:mm:ss');
            endTime = new Date(dateTimeRange.querySelector('.iptEndTime').value).format('yyyy-MM-dd HH:mm:ss');
        }
        return {
            startTime:startTime,
            endTime:endTime,
            interval:interval
        }
    };
    ModalHistoryDataAnalyze.prototype.createTimeInterval = function(unit){
        var interval = document.createElement('div');
        interval.className ='divTimeInterval';
        switch (unit){
            case 'minute':
                interval.innerHTML = '\
                <label i18n="modalConfig.option.LABEL_INTERVAL">'+I18n.resource.modalConfig.option.LABEL_INTERVAL+'</label>\
                <select class="form-control">\
                    <option value="m1" i18n="modalConfig.option.INTERVAL_MIN1">'+I18n.resource.modalConfig.option.INTERVAL_MIN1+'</option>\
                    <option value="m5" i18n="modalConfig.option.INTERVAL_MIN5">'+I18n.resource.modalConfig.option.INTERVAL_MIN5+'</option>\
                </select>\
                ';
                break;
            case 'hour':
                interval.innerHTML = '\
                <label i18n="modalConfig.option.LABEL_INTERVAL">'+I18n.resource.modalConfig.option.LABEL_INTERVAL+'</label>\
                <select class="form-control">\
                    <option value="m5" i18n="modalConfig.option.INTERVAL_MIN5">'+I18n.resource.modalConfig.option.INTERVAL_MIN5+'</option>\
                    <option value="h1" i18n="modalConfig.option.INTERVAL_HOUR1">'+I18n.resource.modalConfig.option.INTERVAL_HOUR1+'</option>\
                </select>\
                ';
                break;
            case 'day':
                interval.innerHTML = '\
                <label i18n="modalConfig.option.LABEL_INTERVAL">'+I18n.resource.modalConfig.option.LABEL_INTERVAL+'</label>\
                <select class="form-control">\
                    <option value="h1" i18n="modalConfig.option.INTERVAL_HOUR1">'+I18n.resource.modalConfig.option.INTERVAL_HOUR1+'</option>\
                    <option value="d1" i18n="modalConfig.option.INTERVAL_DAY1">'+I18n.resource.modalConfig.option.INTERVAL_DAY1+'</option>\
                </select>\
                ';
                break;
            case 'month':
                interval.innerHTML = '\
                <label i18n="modalConfig.option.LABEL_INTERVAL">'+I18n.resource.modalConfig.option.LABEL_INTERVAL+'</label>\
                <select class="form-control">\
                    <option value="d1" i18n="modalConfig.option.INTERVAL_DAY1">'+I18n.resource.modalConfig.option.INTERVAL_DAY1+'</option>\
                    <option value="M1" i18n="modalConfig.option.INTERVAL_MON1">'+I18n.resource.modalConfig.option.INTERVAL_MON1+'</option>\
                </select>\
                ';
                break;
            default :
                interval.innerHTML = '\
                <label i18n="modalConfig.option.LABEL_INTERVAL">${I18n.resource.modalConfig.option.LABEL_INTERVAL}</label>\
                <select class="form-control">\
                    <option value="m1" i18n="modalConfig.option.INTERVAL_MIN1">'+I18n.resource.modalConfig.option.INTERVAL_MIN1+'</option>\
                    <option value="m5" i18n="modalConfig.option.INTERVAL_MIN5">'+I18n.resource.modalConfig.option.INTERVAL_MIN5+'</option>\
                    <option value="h1" i18n="modalConfig.option.INTERVAL_HOUR1">'+I18n.resource.modalConfig.option.INTERVAL_HOUR1+'</option>\
                    <option value="d1" i18n="modalConfig.option.INTERVAL_DAY1">'+I18n.resource.modalConfig.option.INTERVAL_DAY1+'</option>\
                    <option value="M1" i18n="modalConfig.option.INTERVAL_MON1">'+I18n.resource.modalConfig.option.INTERVAL_MON1+'</option>\
                </select>\
                ';
                this.setFixedRangeInterval('m1');
                var _this = this;
                interval.getElementsByTagName('select')[0].onchange = function(e){
                    _this.setFixedRangeInterval(e.currentTarget.value)
                };
            break;
        }
        I18n.fillArea($(this.ctnTimeConfig));
        return interval;
    };
    ModalHistoryDataAnalyze.prototype.chartPreSet = function() {
        var _this = this;
        $(this.container).find('.dragTip').hide();
        var timeConfig = this.getTimeConfig();
        this.getData({startTime: timeConfig.startTime, endTime: timeConfig.endTime, timeFormat: timeConfig.interval, dsItemIds: _this.store.map(function(pt){return pt.id})}).done(function (dataSrc) {
            _this.renderChart(dataSrc,timeConfig.interval);
        });
    };
    ModalHistoryDataAnalyze.prototype.renderChart = function(data,interval){
        var formatDate = '';
        var formatTime = '';
        switch (interval){
            case 'm1':
                formatTime = 'HH:mm';
                break;
            case 'm5':
                formatTime = 'HH:mm';
                break;
            case 'h1':
                formatTime = 'HH:mm';
                break;
            case 'd1':
                formatDate = 'MM-dd';
                break;
            case 'M1':
                formatDate = 'yyyy-MM-dd';
                formatTime = '';
                break;
        }
        var timeInit = data.timeShaft;
        var timeShaft = [].concat(data.timeShaft);
        for(var i = 0; i < timeShaft.length ;i++) {
            if (formatDate && formatTime) {
                timeShaft[i] = new Date(timeShaft[i]).format(formatDate) + '\n\r' + new Date(timeShaft[i]).format(formatTime);
            }else if(formatDate){
                timeShaft[i] = new Date(timeShaft[i]).format(formatDate) ;
            }else{
                timeShaft[i] = new Date(timeShaft[i]).format(formatTime) ;
            }
        }
        var dsName = '';
        var legend = [];
        var series = [];
        for (var i = 0; i < data.list.length ; i++){
            if (data.list[i].data.length == 0)continue;
            dsName = AppConfig.datasource.getDSItemById(data.list[i].dsItemId).alias;
            this.store[i].name = dsName;
            legend.push(dsName);
            series.push({
                name:dsName,
                data:data.list[i].data,
                type:'line',
                itemStyle: {
                    normal: {
                        color: AppConfig.chartTheme.color[i%7]
                    }
                }
            })
        }
        var option = {
            title: {
                show:false,
                left: 'center',
                text: I18n.resource.dashboard.modalHistoryDataAnalyze.HISTORY_DATA,
                textStyle:{
                    color:'#fff'
                }
            },
            legend: {
                data:legend,
                padding:2,
                textStyle:{
                    color:'#fff',
                    fontSize:8,
                    fontWeight:'lighter'
                },
                formatter:function(opt){
                    var str = '';
                    if (opt.length > 10){
                        str = opt.slice(0,5) + '...' + opt.slice(opt.length -5)
                    }else{
                        str = opt;
                    }
                    return str;
                },
                orient:'horizontal',
                left: 'center',
                top: '10'
            },
            grid:{
                x:45,
                y:25,
                x2:25,
                y2:25
            },
            toolbox: {
            },
            tooltip:{
                trigger: 'axis',
                formatter:function(data){
                    var strTip = '';
                    strTip += new Date(timeInit[data[0].dataIndex]).format('yyyy-MM-dd HH:mm') + '</br>';
                    for (var i = 0 ; i< data.length ;i++){
                        strTip+=data[i].seriesName + ' : ' + data[i].data;
                        if(i != (data.length -1)) {
                            strTip += '</br>';
                        }
                    }
                    return strTip;
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: timeShaft,
                axisLine:{
                    lineStyle:{
                        color:'#fff'
                    }
                }
            },
            yAxis: {
                type: 'value',
                scale: true,
                axisLabel: {
                    formatter: function (value) {
                        var ret;
                        if (value < 1000) {
                            ret = value;
                        }
                        else if (value < 1000000) {
                            ret = value / 1000 + 'k';
                        }
                        else {
                            ret = value / 1000000 + 'M';
                        }
                        return ret;
                    }
                },
                splitLine:{
                    lineStyle:{
                        opacity:0.8
                    }
                },
                axisLine:{
                    lineStyle:{
                        color:'#fff'
                    }
                }
            },
            series: series
        };
        var _this = this;
        var hisChart = echarts.init(this.ctnChart,AppConfig.chartTheme);
        hisChart.setOption(option);
        hisChart.on('legendselectchanged', function (params) {
            for (var i =0 ;i < _this.store.length;i++){
                if(_this.store[i].name == params.name){
                    _this.store.splice(i,1);
                    series.splice(i,1);
                    legend.splice(i,1);
                    hisChart.setOption(option);
                    break;
                }
            }
        });
    };
    ModalHistoryDataAnalyze.prototype.attachEvent = function(){
        var _this = this;
        $(this.divTimeConfig).find('.divTimeMode>select').off('change').on('change',function(e){
            _this.createTimeRange(parseInt(e.currentTarget.value))
        });

        var $btnShowTimeConfig = $(this.container.querySelector('.btnShowTimeConfig'));
        $(_this.ctnTimeConfig).hide();
        $(this.container).find('.divConfigCancel').off('click').on('click',function(e){
            $(_this.ctnTimeConfig).hide();
            $btnShowTimeConfig.show();
        });
        $(this.container).find('.divConfigConfirm').off('click').on('click',function(e){
            $(_this.ctnTimeConfig).hide();
            $btnShowTimeConfig.show();
            _this.chartPreSet();
        });
        $(this.divTimeConfig).find('.divTimeMode>select').off('change').on('change',function(e){
            _this.createTimeRange(parseInt(e.currentTarget.value))
        });
        $('#paneCenter').off('dragstart').on('dragstart','[data-h5-draggable-node]',function(e){
            EventAdapter.setData({dsItemId:e.currentTarget.dataset.dsId})
        });
        var $ctnChart = $(this.ctnChart);
        $ctnChart.off('dragover').on('dragover',function(e){
            e.preventDefault();
        });
        $ctnChart.off('dragleave').on('dragleave',function(e){
            e.preventDefault();
        });
        $ctnChart.off('drop').on('drop',function(e){
            e.preventDefault();
            var id = EventAdapter.getData().dsItemId;
            for (var i = 0; i < this.store.length ;i++){
                if(this.store[i].id == id){
                    (typeof infoBox != 'undefined') && infoBox.alert(I18n.resource.dashboard.modalHistoryDataAnalyze.POINT_EXIST_TIP);
                    return;
                }
            }
            this.store.push({id:id});
            this.chartPreSet();
        });
        $btnShowTimeConfig.off('click').on('click',function(){
            $(_this.ctnTimeConfig).show();
            $btnShowTimeConfig.hide();
        });
    };
    ModalHistoryDataAnalyze.prototype.showConfigMode = function(){
    };
    return ModalHistoryDataAnalyze
})();
/*拖拽分析历史数据*/