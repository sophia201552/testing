class BenchmarkEnergyQuery{
    constructor(ctn,screen,opt){
        this.ctn = ctn;
        this.screen = screen;
        this.opt = opt;
        this.arrEnergy = [];
        this.dictPoint = {};
        this.hisData = undefined;
        this.chart = undefined;
        this.chartOption = {
            toolbox: {
                show: true,
                feature:{
                    magicType: {type: ['line', 'bar']}
                },
                right: '4%'
            },
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            title: {
                text: I18n.resource.benchmark.energyQuery.MEASURE_ENERGY_TEND,//计量能耗趋势图;
            },
            legend: {
            },
            grid: {
                top: 100,
                left: '5%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis : [
                {
                    type : 'category'
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    scale: true,
                    axisLabel:{
                        formatter: function(value){
                            if(value >= 1000 || value <= -1000){
                                return value/1000 + 'k';
                            }else{
                                return value;
                            }
                        }
                    }
                }
            ]
        };
        var _this = this;
        this.screen.iotFilter.tree.setting.callback.onCheck = function(){_this.onCheck()};
    }

    init(){
        var now = new Date();
        //查询上个月月初到月底的数据
        this.startTime = new Date(now.getFullYear(),now.getMonth()-1,1);//上上个月底
        this.endTime = new Date(now.getFullYear(),now.getMonth(),0);//上个月月末

        $('#iptEndTime', this.ctn).val(this.endTime.format('yyyy-MM-dd'));
        $('#iptStartTime', this.ctn).val(this.startTime.format('yyyy-MM-dd'));
        this.attachEvents();
    }

    show(){
        $(this.ctn).empty();
        WebAPI.get('/static/views/observer/benchmark/energyQuery.html').done(html =>{
            $(this.ctn).append(html);
            I18n.fillArea($('.panelBmModule'));
            this.init();
            this.onNodeClick()
        });
    }

    destroy(){
        this.screen.iotFilter.tree.setting.callback.onCheck = null;
        this.ctn = null;
        this.screen = null;
        this.opt = null;
        this.arrEnergy = null;
        this.dictPoint = null;
        this.hisData = null;
        this.chart = null;
        this.chartOption = null;
        this.chart = null;
    }

    attachEvents(){
        var _this = this;
        var $iptTime = $('.divTop input.form-control', this.ctn);
        $('#btnSave', this.ctn).off('click').on('click', e => this.queryData());

        $('#selCycle', this.ctn).off('change').on('change', e => resetDateTime(e));

        $iptTime.datetime();

        $('#ckShowPower', this.ctn).off('change').on('change', function(){
            _this.renderChart()
        });

        function resetDateTime(e){
            var val = e.target.value;
            var startView = '';
            $iptTime.datetime('remove');
            if(val === 'M1'){//月
                startView = 3;
                $iptTime.attr('data-format','yyyy-mm');
            }else if(val === 'M12'){//年
                startView = 4;
                $iptTime.attr('data-format','yyyy');
            }else if(val === 'h1'){//时
                startView = 2;
                $iptTime.attr('data-format','yyyy-mm-dd hh');
            }else{//天
                startView = 2;
                $iptTime.attr('data-format','yyyy-mm-dd');
            }
            $iptTime.datetime({startView: startView});
        }
    }

    queryData(){
        if(!this.arrEnergy || this.arrEnergy.length === 0){
            alert(I18n.resource.benchmark.energyOverView.NO_CURRENT_NODE);//当前节点数据不存在
            return;
        }
        var cycle = $('#selCycle').val();
        var iptStartTimeVal = $('#iptStartTime').val();
        var iptEndTimeVal = $('#iptEndTime').val();
        var postData = [], now = new Date();

        var timeStart, timeEnd;

        if(cycle === 'M1'){
            timeStart = new Date(iptStartTimeVal);
            timeEnd = new Date(iptEndTimeVal);

            timeStart = new Date(timeStart.getFullYear(), timeStart.getMonth(), 1);
            timeEnd = new Date(timeEnd.getFullYear(), timeEnd.getMonth()+1, 1);

            postData = [{
                timeFormat: cycle,
                timeStart: timeStart.format('yyyy-MM-dd 00:00:00'),//输入框时间
                timeEnd: timeEnd.format('yyyy-MM-dd 00:00:00'),//输入框时间的下一个月的第一天
                dsItemIds: this.arrEnergy
            }];

            //timeEnd只能说上个月或者更早的数据
            if(timeEnd > now){
                alert(I18n.resource.benchmark.energyQuery.BEFORE_MONTH);
                return;
            }
        }else if(cycle === 'd1'){
            timeStart = new Date(iptStartTimeVal);//输入框时间
            timeEnd = new Date(new Date(iptEndTimeVal).getTime() +  86400000);

            postData = [{
                timeFormat: cycle,
                timeStart: timeStart.format('yyyy-MM-dd 00:00:00'),//输入框时间
                timeEnd: timeEnd.format('yyyy-MM-dd 00:00:00'),//输入框时间的下一天
                dsItemIds: this.arrEnergy
            }];
            if(timeEnd > now){
                alert(I18n.resource.benchmark.energyQuery.BEFORE_DAY);
                return;
            }
        }else if(cycle === 'h1'){
            timeStart = new Date(iptStartTimeVal);
            timeEnd = new Date(new Date(iptEndTimeVal).getTime() + 3600000);

            postData = [{
                timeFormat: cycle,
                timeStart: timeStart.format('yyyy-MM-dd HH:mm:00'),
                timeEnd: timeEnd.format('yyyy-MM-dd HH:mm:00'),//输入框时间的下一个小时
                dsItemIds: this.arrEnergy
            }];
            if(timeEnd > now){
                alert(I18n.resource.benchmark.energyQuery.BEFORE_HOUR);
                return;
            }
        }else if(cycle === 'M12'){//查询年的数据
            iptStartTimeVal = parseInt(iptStartTimeVal);
            iptEndTimeVal = parseInt(iptEndTimeVal);
            if(iptEndTimeVal < iptStartTimeVal){
                alert(I18n.resource.benchmark.energyQuery.START_TIME_END);
                return;
            }
            for(; iptStartTimeVal <= iptEndTimeVal; iptStartTimeVal++){
                postData.push({
                    timeFormat: 'M1',
                    timeStart: new Date(iptStartTimeVal, 0, 1).format('yyyy-MM-dd 00:00:00'),//开始年份的1月
                    timeEnd: new Date(iptStartTimeVal+1,0, 1).format('yyyy-MM-dd 00:00:00'),//开始年份的下一年的第一天
                    dsItemIds: this.arrEnergy
                })
            }

        }

        Spinner.spin(this.ctn);
        WebAPI.post('/analysis/startWorkspaceDataGenHistogramMulti', postData)
            .done(rs =>{
                if(!rs) return;
                this.hisData = rs
                this.renderChart();
            }).fail(function(){

            }).always(function(){
                Spinner.stop();
            });

    }

    renderChart(rs){
        if(!this.chart){
            this.chart = echarts.init(document.getElementById('divChartCtn'), AppConfig.chartTheme);
        }else{
            this.chart.clear();
        }
        this.chart.setOption($.extend(this.chartOption, this.getChartOption()));
    }

    getChartOption(){
        var _this = this;
        var rs = this.hisData;
        var option = {xAxis: [{data: []}], series: [], legend: {data: []}};
        var period = $('#selCycle').val(), format;
        if(period == 'd1'){
            format = "yyyy-MM-dd";
        }else if(period == 'h1'){
            format = "yyyy-MM-dd HH:00";
        }else{
            format = "yyyy-MM";
        }
        if(rs && rs.length === 1){
            rs.forEach(function(data){
                if(data.timeShaft && data.timeShaft.length > 0){
                    option.xAxis[0].data = (function(arrTime){
                        var arrFormat = [];
                        for(var i = 0, l = arrTime.length - 1; i < l; i++){
                            arrFormat.push(new Date(arrTime[i]).format(format));
                        }
                        return arrFormat;
                    }(data.timeShaft));
                }
                if(data.list && data.list.length > 0){
                    data.list.forEach(function(item){
                        var name = _this.dictPoint[item.dsItemId].name;
                        if(_this.dictPoint[item.dsItemId].type == 'energy'){
                            option.series.push({
                                name: name,
                                type: 'bar',
                                data: (function(d){// 做减法
                                    var arr = [];
                                    for(var i = 1, p, l = d.length; i < l; i++){
                                        p = d[i] - d[i-1];
                                        if(p > 0 && (d[i-1] == d[i-2])){
                                            if(d[i+1] && (Number(d[i+1]-d[i])/Number(p) < 0.5)){
                                                p = 0;
                                            }
                                        }
                                        arr.push(p > 0 ? Number(p).toFixed(0) : 0);
                                    }
                                    return arr;
                                }(item.data)),
                                itemStyle: {
                                    normal: {
                                        barBorderRadius: [5,5,0,0]
                                    }
                                }
                            });
                            option.legend.data.push(name);
                        }

                    });
                }
            });
        }else if(rs && rs.length > 1){
            var iptStartTimeVal = $('#iptStartTime').val();
            var iptEndTimeVal = $('#iptEndTime').val();
            iptStartTimeVal = parseInt(iptStartTimeVal);
            iptEndTimeVal = parseInt(iptEndTimeVal);
            for(; iptStartTimeVal <= iptEndTimeVal; iptStartTimeVal++){
                option.xAxis[0].data.push(iptStartTimeVal);
            }
            option.series[0] = {
                name: name,
                type: 'bar',
                data: [],
                itemStyle: {
                    normal: {
                        barBorderRadius: [5,5,0,0]
                    }
                }
            }
            rs.forEach(function(data){
                if(data.list && data.list.length > 0){
                    data.list.forEach(function(item){
                        var name = item.dsItemId ? _this.screen.dataSource.getDSItemById(item.dsItemId).alias : '';
                        option.series[0].data.push(item.data[item.data.length - 1] - item.data[0]);
                        option.legend.data.push(name);
                    });
                }
            });
        }
        return option;
    }

    onNodeClick(e, node){
        var checkedNodes = this.screen.iotFilter.tree.getSelectedNodes();
        this.arrEnergy.length = 0;
        checkedNodes.forEach(node => {
            var energy;
            if (this.screen.opt.point && this.screen.opt.point[node['_id']]){
                energy = this.screen.opt.point[node['_id']].energy;
                if(energy){
                    this.arrEnergy.push(energy);
                    this.dictPoint[energy] = {name:  node.name + '_' + I18n.resource.benchmark.energyQuery.ENERGY_CONSUMP, type: 'energy'};
                }
                //power = this.screen.opt.point[node['_id']].power;
                //this.arrEnergy.push(power);
                //this.dictPoint[power] = {name: node.name + '_' + I18n.resource.benchmark.energyQuery.POWER, type: 'power'};
            }
        });
        this.queryData();
    }
}
