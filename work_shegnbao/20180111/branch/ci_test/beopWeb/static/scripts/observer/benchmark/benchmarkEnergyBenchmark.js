class BenchmarkEnergyBenchmark{
    constructor(ctn,screen,opt){
        this.ctn = ctn;
        this.screen = screen;
        this.opt = opt;
        this.chart = undefined;
        this.chartOption = {
            tooltip: {
                trigger: 'item',
                formatter: function(e){
                    if(e.name === "invisible"){
                        return '';
                    }else{
                        return e.name + ': ' + kIntSeparate(e.value);
                    }
                }
            },
            legend: {
                orient: 'vertical',
                x: 'left',
                data:[I18n.resource.benchmark.energyBenchmark.FIDUCIAL_VALUE,I18n.resource.benchmark.energyBenchmark.ACTUAL_VALUE]
            },
            grid: {
                top: 100,
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            color:["rgb(254,197,0)","rgb(104,156,15)"]

        };
        this.variables = [];
    }

    init(){
        var now = new Date();
        // 时间输入框默认结束时间: 上上个月; 开始时间:上个月
        var startTime = new Date(now.getFullYear() + '-' + (now.getMonth()-1) + '-01').format('yyyy-MM');
        var endTime = new Date(now.getFullYear() + '-' + now.getMonth() + '-01').format('yyyy-MM');
        $('.iptStartTime', this.ctn).val(startTime);
        $('.iptEndTime', this.ctn).val(endTime);
        this.$activeTabCtn = $("#divPane").find(".form-inline").eq(0);
        this.attachEvents();
    }

    show(){
        var _this = this;
        $(this.ctn).empty();
        WebAPI.get('/static/views/observer/benchmark/energyBenchmark.html').done(html =>{
            $(this.ctn).append(html);
            I18n.fillArea($('.panelBmModule'));
            this.init();
            _this.resetDateTime(null, 'M1');
            this.onNodeClick();
        });
    }

    destroy(){
        this.ctn = null;
        this.screen = null;
        this.opt = null;
        this.chart = null;
        this.chartOption = null;
        this.variables = null;
        this.$activeTabCtn = null;
        this.models = null;
        this.isYear = null;
    }

    attachEvents(){
        var _this = this;
        $('.btnCalculate', this.ctn).off('click').on('click', e => this.onNodeClick(e));

        $('#selCycle .btn', this.ctn).off('click').on('click', function(e){
            $(this).removeClass('btn-default').addClass('btn-primary selected').parent().siblings().children('.btn').removeClass('btn-primary selected').addClass('btn-default');
            _this.resetDateTime(e);
            _this.clearInfo();
        });

        $('input.form-control', this.ctn).datetime();

        //右边导航切换
        var $lis = $(".navType").find("li");
        $lis.click(function(){
            var index = $lis.index($(this));
            var $input, now = new Date(), time, month, interval;
            $("#divPane").find(".form-inline").hide();
            $lis.removeClass("selected");
            $(this).addClass("selected");

            _this.$activeTabCtn = $("#divPane").find(".form-inline").eq(index).show();
            if(index === 1){
                interval = $('#chooseModel option:selected').data('interval');
                _this.resetDateTime(null, interval === 'y' ? 'M12': interval+'1');
            }else if(index === 2){
                //相似日比较,时间输入框
                $input = $('.iptStartTime', _this.$activeTabCtn).val(now.getFullYear()+ '-' + (now.getMonth() < 10 ? '0'+now.getMonth() : now.getMonth()));
                $input.attr('data-format','yyyy-mm');
                $input.datetime('remove');
                $input.datetime({
                    minView: 3,
                    startView: 4
                });
                $input.off('change').on('change', function(){
                    time = new Date(this.value);
                    month = time.getMonth() + 1;
                    $(this).val(time.getFullYear() + '-' + (month <10 ? '0'+month: month));
                    $('#iptBaseTime', _this.$activeTabCtn).val(time.getFullYear() + '-' + (month <10 ? '0'+month: month) + '-01');
                });
                //基准日,默认本月第一天
                $('#iptBaseTime', _this.$activeTabCtn).val(now.getFullYear()+ '-' + (now.getMonth() < 10 ? '0'+now.getMonth() : now.getMonth()) + '-01');
            }
        });
        //选择模型
        $('#chooseModel', this.ctn).off('change').on('change', function(){
            _this.resetDateTime(null, $(this.selectedOptions[0]).data('interval') + '1');
        });
        //计算基准值
        $('#btnGetBaseByModel', this.ctn).off('click').on('click', function(){
            var interval = $('#chooseModel option:selected').data('interval');
            _this.getActualVal(interval === 'y' ? 'M12': interval+'1');
        });

        $('#btnShowModal', this.ctn).off('click').on('click', e => this.eventBtnConfigOnClick(e));

        $('#btnSearch', this.ctn).off('click').on('click', e => this.calcSimilarDays(e));
    }

    resetDateTime(e, interval){
        var _this = this;
        var interval = e ? e.target.dataset.value : interval;
        var $iptTime = $('input.form-control', this.$activeTabCtn);
        var time, month;
        var now = new Date();
        if(interval === 'M1'){//月
            $('.iptStartTime', _this.$activeTabCtn).val(now.getFullYear()+ '-' + (now.getMonth() < 11 ? '0'+(now.getMonth()-1): now.getMonth()-1));
            $('.iptEndTime', _this.$activeTabCtn).val(now.getFullYear()+ '-' + (now.getMonth() < 10 ? '0'+now.getMonth(): now.getMonth()));
            $iptTime.attr('data-format','yyyy-mm');
            $iptTime.datetime('remove');
            $iptTime.datetime({
                minView: 3,
                startView: 4
            });
            $iptTime.off('changeDate').on('changeDate', function(){
                _this.getActualVal(interval);
            });
        }else if(interval === 'M12'){//年
            $('.iptStartTime', this.$activeTabCtn).val(now.getFullYear()-2);
            $('.iptEndTime', this.$activeTabCtn).val(now.getFullYear()-1);
            $iptTime.attr('data-format','yyyy');
            $iptTime.datetime('remove');
            $iptTime.datetime({
                minView: 4,
                startView: 4
            });
            $iptTime.off('changeDate').on('changeDate', function(){
                _this.getActualVal(interval);
            });
        }else if(interval === 'h1'){//时
            $iptTime.attr('data-format','yyyy-mm-dd hh');
            $iptTime.datetime('remove');
            $iptTime.datetime();
            $iptTime.off('changeDate').on('changeDate', function(){
                _this.getActualVal(interval);
            });
            $('.iptEndTime', this.$activeTabCtn).val(new Date(now.getTime() - 86400000).format('yyyy-MM-dd HH:00'));//昨天
        }else{//天
            //$('.iptStartTime', this.$activeTabCtn).val();
            $('.iptEndTime', this.$activeTabCtn).val(new Date(now.getTime() - 86400000).format('yyyy-MM-dd'));//昨天
            $iptTime.attr('data-format','yyyy-mm-dd');
            $iptTime.datetime('remove');
            $iptTime.datetime()
            $iptTime.off('changeDate').on('changeDate', function(){
                _this.getActualVal(interval);
            });
        }
    }

    getActualVal(interval){
        //查询实际值
        var timeStart, timeEnd, timeFormat, arrParamId = [], now = new Date(), $iptEndTime = $('.iptEndTime', this.$activeTabCtn);
        if(this.$activeTabCtn[0].classList.contains('divPaneTwo')){
            var timeActual = new Date($iptEndTime.val());
            //todo timeActual.toString()
            if(timeActual.toString() === "Invalid Date"){
                alert(I18n.resource.benchmark.energyBenchmark.INPUT_BASE_DAY);
                return false;
            }
            if(interval === 'M12'){
                //todo 暂时不支持年
                timeFormat = 'M1';
                alert(I18n.resource.benchmark.energyBenchmark.TEM_NOSUPPORT_YEARCYCLE);
                return;
            }else if(interval === 'M1'){
                timeStart = timeActual.format('yyyy-MM-dd 00:00:00');//选择月份的第一天
                timeEnd = new Date(timeActual.getFullYear(), timeActual.getMonth() + 1, 1).format('yyyy-MM-dd 00:00:00');//下个月的第一天
                timeFormat = 'M1';
                $iptEndTime.val(timeActual.format('yyyy-MM-dd'));
                if(timeEnd > now || (timeEnd <= now && timeEnd.getMonth() > now.getMonth())){
                    alert(I18n.resource.benchmark.energyQuery.BEFORE_MONTH);
                    return;
                }
            }else if(interval === 'd1'){
                timeStart = timeActual.format('yyyy-MM-dd 00:00:00');//选择的日期
                timeEnd = new Date(timeActual.getTime() + 86400000).format('yyyy-MM-dd 00:00:00');//选择日期的第二天
                timeFormat = 'd1';
                $iptEndTime.val(timeActual.format('yyyy-MM-dd'));
                if(timeEnd > now || (timeEnd <= now && timeEnd.getDate() > now.getDate())){
                    alert(I18n.resource.benchmark.energyQuery.BEFORE_DAY);
                    return;
                }
            }else if(interval === 'h1'){
                timeStart = timeActual.format('yyyy-MM-dd HH:00:00');//选择的小时
                timeEnd = new Date(timeActual.getTime() + 3600000).format('yyyy-MM-dd HH:00:00');//选择小时的下一个小时
                timeFormat = 'h1';
                $iptEndTime.val(timeActual.format('yyyy-MM-dd HH:00'));
                if(timeEnd > now || (timeEnd <= now && timeEnd.getHours() > now.getHours())){
                    alert(I18n.resource.benchmark.energyQuery.BEFORE_HOUR);
                    return;
                }
            }

            var model = this.models[this.getModelById($('#chooseModel').val())];
            if(!model || !model.params || model.params.length == 0){
                alert(I18n.resource.benchmark.energyBenchmark.BUILD_MODEL);
                return false;
            }
            this.clearInfo();

            for(var i = 0; i < model.params.length; i++){
                arrParamId.push(model.params[i].point);
            }
            arrParamId.push(this.ptConfig.energy);
            var postData = {
                dsItemIds: arrParamId,
                timeStart: timeStart,
                timeEnd: timeEnd,
                timeFormat: timeFormat
            }

            WebAPI.post('/analysis/startWorkspaceDataGenHistogram', postData).done(rs => {
                var dictX = {}, diff;
                if(!rs ||$.isEmptyObject(rs) || rs.list.length === 0){ return;}
                rs.list.forEach((item, index) => {
                    for(var i = 0; i < model.params.length; i++){
                        if(model.params[i].point == item.dsItemId){
                            if(item.data.length>0){
                                dictX[model.params[i].pName] = [item.data[0]];
                            }else{
                                dictX[model.params[i].pName] = [0]
                            }
                        }
                    }
                    if(index === (rs.list.length - 1)){
                        diff = rs.list[index].data[rs.list[index].data.length-1] - rs.list[index].data[0];
                        this.actual = diff > 0 ? diff : 0;//做减法
                    }
                });

                if(isNaN(this.actual)){
                    alert(I18n.resource.benchmark.energyBenchmark.NOT_GET_ACTUAL_VAL);
                    return false;
                }else{
                    $('.spanActual', this.$activeTabCtn).html(kIntSeparate(this.actual));
                    this.getExecVal(dictX);
                }
            });
        }else if(this.$activeTabCtn[0].classList.contains('divPaneOne')){
            this.clearInfo();
        }
    }

    clearInfo(){
        $('.spanActual', this.$activeTabCtn).text('');
        $('.spanBenchmark', this.$activeTabCtn).text('');
        $('.saveEnergy', this.$activeTabCtn).text('');
        $('.saveRate', this.$activeTabCtn).text('');
        $('.saveCost', this.$activeTabCtn).text('');
    }

    queryData(){
        if(!this.ptConfig || !this.ptConfig.energy){
            alert(I18n.resource.benchmark.energyBenchmark.SELECT_EFFECTIVE_EQUIPMENT);
            return;
        }

        var $selCycle = $('#selCycle .selected');
        var timeFormat, postData = [];
        var timeBenchmark = new Date($('.iptStartTime', this.$activeTabCtn).val());
        var timeActual = new Date($('.iptEndTime', this.$activeTabCtn).val());
        var timeBenchmark_1, timeActual_1,timeBenchmark_0, timeActual_0;

        if(this.$activeTabCtn.hasClass('divPaneThree')){
            timeFormat = 'd1';
        }else{
            timeFormat = $selCycle ? $selCycle[0].dataset.value : 'M1';
        }
        //直接比较的时间周期有: 月/年, 相似日比较的周期只有:天
        if(timeFormat === 'M1'){
            this.isYear = false;
            timeBenchmark_1 = new Date(timeBenchmark.getFullYear(), timeBenchmark.getMonth() + 1, 1);//下个月第一天
            timeActual_1 = new Date(timeActual.getFullYear(), timeActual.getMonth() + 1, 1);

            timeBenchmark_0 = new Date(timeBenchmark.getFullYear(), timeBenchmark.getMonth(), 1);//上个月第一天
            timeActual_0 = new Date(timeActual.getFullYear(), timeActual.getMonth(), 1);

            postData = [{
                timeStart: timeBenchmark_0.format('yyyy-MM-dd 00:00:00'),
                timeEnd: timeBenchmark_1.format('yyyy-MM-dd 00:00:00'),
                timeFormat: timeFormat,
                dsItemIds: [this.ptConfig.energy] //["57660fb9833c97250a3d1ff9"] //todo
            },{
                timeStart: timeActual_0.format('yyyy-MM-dd 00:00:00'),
                timeEnd: timeActual_1.format('yyyy-MM-dd 00:00:00'),
                timeFormat: timeFormat,
                dsItemIds: [this.ptConfig.energy] //["57660fb9833c97250a3d1ff9"] //todo
            }]
        }else if(timeFormat === 'M12'){
            this.isYear = true;
            timeFormat = 'M1';
            var iptStartTimeVal = $('.iptStartTime', this.$activeTabCtn).val();
            var iptEndTimeVal = $('.iptEndTime', this.$activeTabCtn).val();
            iptStartTimeVal = parseInt(iptStartTimeVal);
            iptEndTimeVal = parseInt(iptEndTimeVal);

            postData = [{
                timeFormat: timeFormat,
                timeStart: new Date(iptStartTimeVal, 0, 1).format('yyyy-MM-dd 00:00:00'),//开始年份的1月
                timeEnd: new Date(iptStartTimeVal+1,0, 1).format('yyyy-MM-dd 00:00:00'),//开始年份的下一年的第一天
                dsItemIds: [this.ptConfig.energy]
            }, {
                timeFormat: timeFormat,
                timeStart: new Date(iptEndTimeVal, 0, 1).format('yyyy-MM-dd 00:00:00'),//开始年份的1月
                timeEnd: new Date(iptEndTimeVal+1,0, 1).format('yyyy-MM-dd 00:00:00'),//开始年份的下一年的第一天
                dsItemIds: [this.ptConfig.energy]
            }]
        }else {//日
            this.isYear = false;
            timeBenchmark_0 = new Date($('#iptBaseTime', this.$activeTabCtn).val());//基准日
            timeActual_0 = new Date($('#iptCompareTime', this.$activeTabCtn).val());//对比日

            timeBenchmark_1 = new Date(timeBenchmark_0.getTime() + 86400000);//基准日 + 一天
            timeActual_1 = new Date(timeActual_0.getTime() + 86400000);//对比日 + 一天

            postData = [{
                timeStart: timeBenchmark_0.format('yyyy-MM-dd 00:00:00'),
                timeEnd: timeBenchmark_1.format('yyyy-MM-dd 00:00:00'),
                timeFormat: 'd1',
                dsItemIds: [this.ptConfig.energy] //["57660fb9833c97250a3d1ff9"] //todo
            },{
                timeStart: timeActual_0.format('yyyy-MM-dd 00:00:00'),
                timeEnd: timeActual_1.format('yyyy-MM-dd 00:00:00'),
                timeFormat: 'd1',
                dsItemIds: [this.ptConfig.energy] //["57660fb9833c97250a3d1ff9"] //todo
            }]
        }

        //todo 验证postData
        Spinner.spin(this.ctn);
        WebAPI.post('/analysis/startWorkspaceDataGenHistogramMulti', postData)
            .done(rs =>{
                if(!rs) return;
                this.renderChart(rs);
                this.calculate();
            }).fail(function(){

            }).always(function(){
                Spinner.stop();
            });

    }

    getExecVal(dictX){
        var option = $('#chooseModel')[0].selectedOptions[0];
        if(!this.actual) return;
        if(!option) alert(I18n.resource.benchmark.energyBenchmark.BUILD_MODEL);

        var postData = {
           'modeltype': $(option).data('type'),
           'model': $(option).data('model'),
           'x': dictX
        }

        //验证postData
        if(!postData.model || !postData.modeltype || !dictX || $.isEmptyObject(dictX)){
            alert(I18n.resource.benchmark.energyBenchmark.MODEL_INFO_IS_REQUIRED);
            return false;
        }

        Spinner.spin(this.$activeTabCtn[0])
        WebAPI.post('/analysis/model/exec', postData).done(rs => {
            try{
                rs = JSON.parse(rs);
                if(rs && rs.length === 1){
                    this.benchmark = parseFloat((rs[0]).toFixed(2));
                    //todo renderChart
                    var option = this.chart.getOption();

                    if(this.benchmark < this.actual){//实际值 满的
                        option.series[0].data[0].value = this.actual;
                        option.series[0].data[1].value = 0;
                        option.series[0].data[1].itemStyle.normal.borderType = 'dashed';
                        option.series[0].data[1].itemStyle.normal.borderColor = '#fff';
                        option.series[1].data[1].itemStyle.normal.borderType = 'dashed';
                        option.series[1].data[1].itemStyle.normal.borderColor = 'transparent';
                        option.series[1].data[0].value = this.benchmark;
                        option.series[1].data[1].value = this.actual-this.benchmark;
                    }else{//基准值 满的
                        option.series[0].data[0].value = this.actual;
                        option.series[0].data[1].value = this.benchmark-this.actual;
                        option.series[0].data[1].itemStyle.normal.borderType = 'dashed';
                        option.series[0].data[1].itemStyle.normal.borderColor = 'transparent';
                        option.series[1].data[1].itemStyle.normal.borderType = 'dashed';
                        option.series[1].data[1].itemStyle.normal.borderColor = '#fff';
                        option.series[1].data[0].value = this.benchmark;
                        option.series[1].data[1].value = 0;
                    }

                    this.chart.setOption(option);
                    this.calculate();
                }else{
                    alert(I18n.resource.benchmark.energyBenchmark.FIND_FIDUCIAL_VALUE_ERROR);
                }
            }catch (e){
                alert(I18n.resource.benchmark.energyBenchmark.FIND_FIDUCIAL_VALUE_ERROR);
            }
        }).always(rs => {
            Spinner.stop();
        }).fail(rs => {
            alert(I18n.resource.benchmark.energyBenchmark.FIND_FIDUCIAL_VALUE_ERROR);
        });
    }

    calculate(){
        if(isNaN(this.actual)){
            alert(I18n.resource.benchmark.energyBenchmark.NO_ACTUAL_VALUE);
            return;
        }
        if(isNaN(this.benchmark)){
            alert(I18n.resource.benchmark.energyBenchmark.NO_FIDUCIAL_VALUE);
            return;
        }
        var saveEnergy = this.benchmark - this.actual;
        var saveEnergy = parseFloat(saveEnergy.toFixed(2));
        var saveRate = this.actual !== 0 ? (saveEnergy/this.actual).toFixed(4) : '--';
        var price = 1;

        //基准值
        $('.spanBenchmark', this.$activeTabCtn).text(kIntSeparate(this.benchmark));
        //节能量 = 基准值 - 实际值
        $('.saveEnergy', this.$activeTabCtn).text(kIntSeparate(saveEnergy));
        //节能率 = 节能量/实际值
        $('.saveRate', this.$activeTabCtn).text(isNaN(saveRate) ? '--': kIntSeparate(saveRate*100, 2));
        //节能费用
        $('.saveCost', this.$activeTabCtn).text(kIntSeparate(saveEnergy * price));
    }

    renderChart(data){
        this.chart = echarts.init(document.getElementById('divChartCtn'), AppConfig.chartTheme);
        var option = $.extend(this.chartOption, this.getChartOption(data));
        this.chart.setOption(option);
    }

    getChartOption(data){
        var option = {series: []};
        this.benchmark = undefined;
        this.actual = undefined;
        if(data && data.length > 0){
            option.series.push({
                type: 'pie',
                radius: ['40%', '55%'],
                data: [{
                    name:I18n.resource.benchmark.energyBenchmark.ACTUAL_VALUE,
                    value:0,
                    labelLine:{
                        normal:{
                            show:'true',
                            length:80
                        }
                    }
                },{
                    value:0,
                    name:'invisible',
                    itemStyle : {
                        normal:{
                            color:"transparent"
                        }
                    }
                }]
            },{
                type: 'pie',
                radius: ['56%', '70%'],
                data: [{
                    name:I18n.resource.benchmark.energyBenchmark.FIDUCIAL_VALUE,
                    value:0
                },{
                    value:0,
                    name:'invisible',
                    itemStyle : {
                        normal:{
                            color:"transparent"
                        }
                    }
                }]
            });
            var optionData = [];
            $('.spanBenchmark', this.$activeTabCtn).text(0);
            $('.spanActual', this.$activeTabCtn).text(0);
            for(var i = 0, len = data.length, diff; i < len; i++){
                var d = data[i].list[0].data;
                if(d.length > 1){
                    diff = data[i].list[0].data[data[i].list[0].data.length - 1] - data[i].list[0].data[0];
                    optionData.push(diff > 0 ? diff : 0);//做减法
                }else{
                    optionData.push(0);
                }
            }
            this.benchmark = optionData[0];
            this.actual = optionData[1];
            // 基准值<实际值  基准值一直在外圈
            if(this.benchmark < this.actual){//实际值 满的
                option.series[0].data[0].value = this.actual;
                option.series[0].data[1].value = 0;
                option.series[0].data[1].itemStyle.normal.borderType = 'dashed';
                option.series[0].data[1].itemStyle.normal.borderColor = '#fff';
                option.series[1].data[1].itemStyle.normal.borderType = 'dashed';
                option.series[1].data[1].itemStyle.normal.borderColor = 'transparent';
                option.series[1].data[0].value = this.benchmark;
                //option.series[1].data[1].value = this.benchmark/0.9-this.benchmark;
                option.series[1].data[1].value = this.actual-this.benchmark;
            }else{//基准值 满的
                option.series[0].data[0].value = this.actual;
                //option.series[0].data[1].value = this.actual/0.9-this.actual;
                option.series[0].data[1].value =this.benchmark-this.actual;
                option.series[0].data[1].itemStyle.normal.borderType = 'dashed';
                option.series[0].data[1].itemStyle.normal.borderColor = 'transparent';
                option.series[1].data[1].itemStyle.normal.borderType = 'dashed';
                option.series[1].data[1].itemStyle.normal.borderColor = '#fff';
                option.series[1].data[0].value = this.benchmark;
                option.series[1].data[1].value = 0;
            }

            if(optionData[0] === 0 && optionData[1] === 0){
                alert(I18n.resource.benchmark.energyBenchmark.NOT_GET_HISDATA);
                return;
            }

            $('.spanBenchmark', this.$activeTabCtn).text(kIntSeparate(this.benchmark));
            $('.spanActual', this.$activeTabCtn).text(kIntSeparate(this.actual));
        }
        return option;
    }

    onNodeClick(e, node){
        node = node ? node : this.screen.iotFilter.tree.getSelectedNodes()[0];
        if(!node) return;
        if (this.screen.opt.point && this.screen.opt.point[node['_id']]){
            this.ptConfig = this.screen.opt.point[node['_id']];
            Spinner.spin(this.ctn);
            this.screen.getModel(node._id).done((rs)=>{
                this.models = rs;
                this.renderModelInfo();
            }).always(rs => {
                Spinner.stop();
            });
        }else {
            this.ptConfig = {};//power功率, energy用电量
        }
        if(this.$activeTabCtn[0].classList.contains('divPaneTwo')){
            $('#btnGetBaseByModel', this.ctn).trigger('click');
        }else{
            this.queryData();
        }
    }

    renderModelInfo(){
        var $chooseModel = $('#chooseModel');
        var $strSel, interval;
        $chooseModel.empty();
        if(this.models && this.models.length > 0){
            this.models.forEach(function(model){
                if(model.interval === 'h'){
                    interval = I18n.resource.benchmark.energyAnalysis.BHOUR;
                }else if(model.interval === 'd'){
                    interval = I18n.resource.benchmark.energyAnalysis.BDAY;
                }else if(model.interval === 'M'){
                    interval = I18n.resource.benchmark.energyAnalysis.BMONTH;
                }else if(model.interval === 'y'){
                    interval = I18n.resource.benchmark.energyAnalysis.BYEAR;
                }else{
                    interval = '';
                }
                $strSel = $('<option value="'+ model._id +'">'+ model.name + interval +'</option>').data('type', model.type).data('model', model.model).data('interval', model.interval);
                $chooseModel.removeAttr('disabled').append($strSel);
            });
        }else{
            $strSel = $('<option value="">' + I18n.resource.benchmark.energyBenchmark.NO_MODEL + '</option>');
            $chooseModel.attr('disabled', 'disabled').append($strSel);
        }
    }

    eventBtnConfigOnClick(e){
        var _this = this;
        var $modelConfigModal = $('#modelConfigModal');
        var $divRelate = $('#divRelate').empty();
        var tpl = '<div class="row">\
                <div class="col-sm-8"><span class="form-control point" dsId="{point}">{pName}</span></div>\
                <div class="col-sm-2"><span class="glyphicon glyphicon-remove-circle btnDelRelate"></span></div>\
            </div>';
        var strHtml = '';


        if(_this.variables && _this.variables.length > 0){
            for(var j = 0, len = _this.variables.length; j < len; j++){
                strHtml += (tpl.formatEL({
                    pName: this.screen.dataSource.getDSItemById(_this.variables[j]).alias,
                    point: _this.variables[j]
                }));
            }
        }else{
            strHtml += (tpl.formatEL({ point: '', pName: ''}));
        }
        $divRelate.append(strHtml);

        $modelConfigModal.off('click').on('click', '.btnSaveRelate', function(){
            var $divVariable = $('#divVariable').empty();
            var strHtml = '';
            _this.variables.length = 0;
            $divRelate.children('.row').each(function(){
                var point = $(this).find('span.point').attr('dsId');
                var dsName = $(this).find('span.point').text();
                if(point && point !== 'undefined'){
                    //防止出现重复
                    if($.inArray(point, _this.variables) < 0){
                        _this.variables.push(point);
                        strHtml += ('<div class="dsNmame col-xs-offset-2" data-point="'+ point +'">'+ dsName +'</div>');
                    }
                }
            });
            $divVariable.html(strHtml);
        });
        $modelConfigModal.modal('show');
        $modelConfigModal.on('hidden.bs.modal',() =>{
            this.screen.hideDataSource();
        })

        this.screen.showDataSource();

        $('#btnAddRelate').off('click').on('click', function(){
            $divRelate.append(tpl.formatEL({name: '', point: '', pName: ''}));
        });
        $divRelate.off('click').on('click', '.btnDelRelate', function(){
            $(this).closest('.row').remove();
        });
        $divRelate.on('click','.btnEditRelate', function(){

        });

        $divRelate.off('dragover').on('dragover','.point',e=>{
            e.preventDefault();
        });
        $divRelate.off('dragleave').on('dragleave','.point',e=>{
            e.preventDefault();
        });
        $divRelate.off('drop').on('drop','.point',e=>{
            e.stopPropagation();
            e.preventDefault();
            var id = EventAdapter.getData().dsItemId
            $(e.currentTarget).attr('dsId', id).text(this.screen.dataSource.getDSItemById(id).alias);
        });
    }

    calcSimilarDays(e){
        this.clearInfo();
        var baseData = new Date($('#iptBaseTime', this.$activeTabCtn).val());
        var startTime = new Date($('.iptStartTime', this.$activeTabCtn).val());
        startTime = new Date(startTime.getFullYear(), startTime.getMonth(),1);
        var endTime = new Date(startTime.getFullYear(), startTime.getMonth() + 1,0);
        var postData = {
            'basedate':	 baseData.format('yyyy-MM-dd 00:00:00'),
            'startTime': startTime.format('yyyy-MM-dd 00:00:00'),
            'endTime': endTime.format('yyyy-MM-dd 00:00:00'),
            'type': 'd1',
            'x': this.variables
        }

        //基准日必须在开始时间与结束时间之内
        if(baseData < startTime || baseData > endTime){
            alert(I18n.resource.benchmark.energyBenchmark.FIDUCIALDAY_SELECT);
            return false;
        }
        Spinner.spin(this.ctn);
        WebAPI.post('/analysis/calcSimilarDays', postData).done(rs => {
            var strHtml = '', time, strHead = '<tr class="dataItem"><td class="time" i18n="benchmark.energyBenchmark.TIME">时间</td><td class="totalerror" i18n="benchmark.energyBenchmark.ALL_ERROR">总误差</td>';
            var $modelSimilarday = $('#modelSimilarday');

            try{
                rs = JSON.parse(rs);
                rs.forEach((item) => {
                    strHtml += ('<tr class="dataItem">\
                          <td class="time">'+ item.time.split(' ')[0] +'</td>\
                          <td class="totalerror">'+ kIntSeparate(item.totalerror*100) +'%</td>');

                    for(var j = 0; j < item.value.length; j ++){
                        strHtml += ('<td class="value">'+ kIntSeparate(item.value[j]) +'</td>');
                    }
                    strHtml += ('</tr>');
                });

                for(var i = 0; i < this.variables.length; i++){
                    strHead += ('<td class="value">'+ this.screen.dataSource.getDSItemById(this.variables[i]).alias +'</td>');
                }
                strHead += ('</tr>');

                $modelSimilarday.find('.similarList').html(strHead + strHtml);
                //基准日高亮
                $modelSimilarday.find('.similarList tbody tr:eq(1)').addClass('baseDate');
                //与基准日最接近的三个
                $modelSimilarday.find('.similarList tbody tr:eq(2)').addClass('similarDate');
                $modelSimilarday.find('.similarList tbody tr:eq(3)').addClass('similarDate');
                $modelSimilarday.find('.similarList tbody tr:eq(4)').addClass('similarDate');

                //按日期排序
                var oTab=$modelSimilarday.find('.similarList')[0];
                var arr=[];
                for(i=1;i<oTab.tBodies[0].rows.length;i++){
                  arr[i-1]=oTab.tBodies[0].rows[i];
                }
                arr.sort(function(tr1,tr2){
                   var n1=Date.parse(tr1.cells[0].innerHTML);
                   var n2=Date.parse(tr2.cells[0].innerHTML);
                   if (n1 < n2) {
                     return -1;
                   } else if (n1 > n2) {
                     return 1;
                   } else {
                     return 0;
                   }
                });
                for(i=0;i<arr.length;i++){
                  oTab.tBodies[0].appendChild(arr[i])
                }

                $modelSimilarday.modal('show');
                //给表格的行绑定事件
                $('.dataItem', $modelSimilarday).off('click').on('click', e => {
                    $modelSimilarday.modal('hide');
                    var time = $(e.currentTarget).children('.time').text();
                    $('#iptCompareTime', this.$activeTabCtn).val(time.split(' ')[0]);
                });

                I18n.fillArea($modelSimilarday);
            }catch (e){
                console.log('查找相似日失败!');
            }
        }).always(rs => {
            Spinner.stop();
        }).fail(rs => {
            alert(I18n.resource.benchmark.energyBenchmark.SELECT_EFFECTIVE_EQUIPMENT);
        });
    }

    getModelById(modelId){
        if(this.models && this.models.length > 0){
            for(var i = 0, len = this.models.length; i < len; i++){
                if(this.models[i]._id === modelId){
                    return i;
                }
            }
        }
    }
}
    