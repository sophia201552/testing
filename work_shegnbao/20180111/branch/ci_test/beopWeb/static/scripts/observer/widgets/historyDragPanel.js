/**
 * Created by vicky on 2016/9/12.
 */

var DragPanel = (function(){
    function DragPanel(){
        this.isShow = false;
        this.arrInstance = [];
    }

    DragPanel.prototype.show = function(){
        trackEvent('顶部导航历史面板点击','TopNav.DragPanel.Click');
        var _this = this;
        var localPanel, arrPanel = [];
        var localKey = 'historyPanel' + '_' + AppConfig.userId;
        localPanel = localStorage.getItem(localKey);
        if(localPanel) {
             arrPanel = JSON.parse(localPanel);
        }
        if(!this.isShow || !arrPanel || arrPanel.length < 1){//显示历史面板
            //从localStorage取数据,渲染
            if(arrPanel && (arrPanel instanceof Array) && arrPanel.length > 0){
                var _hmt = _hmt || [];
                _hmt.push(['_trackEvent','历史面板', 'click','user-' + AppConfig.userId +'/project-'+(AppConfig.projectId?AppConfig.projectId:0)]);
                arrPanel.forEach(function(data){
                    //判断是否存在
                    var isAdd = true;
                    for(var i = 0; i < _this.arrInstance.length; i++){
                        if(_this.arrInstance[i].timeVal === data.time){
                            isAdd = false;
                        }
                    }
                    if(isAdd){
                        new HistoryDragPanel(data).show();
                    }
                });
            }else{
                new HistoryDragPanel().show();
            }
            this.isShow = true;
        }else{//隐藏历史面板
            this.hide();
            this.isShow = false;
        }
    }

    DragPanel.prototype.hide = function(){
        for(let i = 0, l = this.arrInstance.length; i < l;){
            if(this.arrInstance[i].localKey && this.arrInstance[i].localKey.split('_')[0] == 'historyPanel'){
                this.arrInstance[i].close();
                this.arrInstance.splice(i,1);
                l--;
            }else{
                i++;
            }
        }
    }
    return new DragPanel()
})();


var HistoryDragPanel = (function(){

    function HistoryDragPanel(data) {
        var _this = this;
        this.$panel = undefined;
        this.store = [];
        this.panelDefaultW = 500;//面板默认宽度
        this.panelDefaultY = 300;//面板默认高度
        this.hisChart = undefined;
        //dark,light,transparent三种主题
        this.themeOpt = {
            dark: {
                legend:{
                    textStyle:{
                        color: '#ccc'
                    }
                },
                xAxis:{
                    axisLine: {
                        lineStyle: {
                            color: '#ccc'
                        }
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#ccc'
                        }
                    }
                },yAxis:{
                    axisLine: {
                        lineStyle: {
                            color: '#ccc'
                        }
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#ccc'
                        }
                    }
                }
            },
            light: {
                legend:{
                    textStyle:{
                        color: '#333'
                    }
                },
                xAxis:{
                    axisLine: {
                        lineStyle: {
                            color: '#333'
                        }
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#333'
                        }
                    }
                },yAxis:{
                    axisLine: {
                        lineStyle: {
                            color: '#333'
                        }
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#333'
                        }
                    }
                }
            },
            transparent: {
                legend:{
                    textStyle:{
                        color: '#aaa'
                    }
                },
                xAxis:{
                    axisLine: {
                        lineStyle: {
                            color: '#aaa'
                        }
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#aaa'
                        }
                    }
                },yAxis:{
                    axisLine: {
                        lineStyle: {
                            color: '#aaa'
                        }
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#aaa'
                        }
                    }
                }
            }
        };
        this.theme = undefined;
        this.timeVal = new Date().getTime();

        if(data && data.time){
            this.data = data;
            this.timeVal = data.time;
            data.dsItemIds && data.dsItemIds.forEach(function(id){
                _this.store.push({id: id});
            });
        }else{
            this.timeVal = new Date().getTime();
        }

        this.localKey = 'historyPanel' + '_' + AppConfig.userId;

        !AppConfig.datasource && (AppConfig.datasource = {
            getDSItemById: DataSource.prototype.getDSItemById.bind({
                m_parent: {
                    store: {
                        dsInfoList: []
                    }
                },
                m_arrCloudTableInfo: []
            })
        });
        DragPanel.arrInstance.push(this);
    }

    HistoryDragPanel.prototype.show = function(){
        var _this = this;
        this.$indexMain = $('body');
        WebAPI.get('/static/views/observer/widgets/historyDragPanel.html').done(function(rsHtml){
            _this.$indexMain.append(rsHtml);
            _this.init();
            _this.saveToLocal({},_this.data ? 1: 2);//编辑还是新增
        });
    };

    HistoryDragPanel.prototype.init = function(){
        this.theme = localStorage.getItem('historyDragPanelBg');
        this.$panel = $('#divHistoryDrag', this.$indexMain);
        this.$panel.attr('id', 'divHistoryDrag'+ this.timeVal);
        this.ctnTimeConfig = $('.ctnTimeConfig', this.$panel);
        this.$ctnChart = $('.divHistoryChart', this.$panel);
        this.divTimeConfig = $('.divTimeConfig', this.$panel)[0];
        this.ctnChart = $('.divHistoryChart', this.$panel)[0];
        this.$btnClosePanel = $('.btnClosePanel', this.$panel);
        if(!this.theme){//默认深色
            this.theme = 'dark';
            localStorage.setItem('historyDragPanelBg', this.theme);
        }
        this.$panel.addClass(this.theme);
        $('.'+ this.theme, this.$panel).addClass('selected');

        var $title = $('.divChartTtl',this.$panel);
        this.attachEvent();
        I18n.fillArea(this.$panel);
        $title.text($title.text());
        if(this.data){
            this.renderChartByData();
        }
    };

    HistoryDragPanel.prototype.renderChartByData = function(){
        var _this = this;
        var postData, top = this.data.top*screen.height;
        this.$panel.css({top: (top < 60 ? 60 : top), left: this.data.left*screen.width, width: this.data.width, height: this.data.height});
        var timeConfig = this.getTimeConfig();
        if(!this.data.dsItemIds || this.data.dsItemIds.length === 0){
            return;
        }else{
            this.$panel.find('.dragTip').hide();
        }
        postData = {
            dsItemIds: this.data.dsItemIds,
            timeStart: this.data.timeStart,
            timeEnd: this.data.timeEnd,
            timeFormat: this.data.timeFormat
        };
        WebAPI.post('/analysis/startWorkspaceDataGenHistogram', postData).done(function (dataSrc) {
            _this.renderChart(dataSrc,timeConfig.interval);
        });
    }

    HistoryDragPanel.prototype.close = function(){
        this.$panel && this.$panel.remove();
        this.$panel = null;
        this.store = null;
        this.panelDefaultW = null;
        this.panelDefaultY = null;
        this.ctnTimeConfig = null;
        this.$ctnChart = null;
        this.divTimeConfig = null;
        this.ctnChart = null;
        this.$btnClosePanel = null;
        this.themeOpt = null;
        this.theme = null;
        this.hisChart = null;
        this.timeVal = null;
        this.localKey = null;
        this.data = null;
    },

    HistoryDragPanel.prototype.attachEvent = function(){
        var _this = this;
        var $btnShowTimeConfig = $('.btnShowTimeConfig', this.$panel);
        var $btnShowAddPanel = $('.btnShowAddPanel', this.$panel);
        var $divBackground = $('.divBackground', this.$panel);
        //调整大小
        this.$panel
            .mousedown(function(e){_this.doDown(e)})
            .mouseup(function(e){_this.doUp(e)});
        this.$indexMain.on('mousemove', function(e){_this.doMove(e)});
        //拖拽
        this.setDrag($('.divChartTtl',this.$panel)[0]);

        $(this.ctnTimeConfig).hide();
        this.$panel.find('.divConfigCancel').off('click').on('click',e=>{
            $(_this.ctnTimeConfig).slideUp();
        });
        this.$panel.find('.divConfigConfirm').off('click').on('click',e=>{
            $(_this.ctnTimeConfig).slideUp();
            this.chartPreSet();
        });
        $(this.divTimeConfig).find('.divTimeMode>select').off('change').on('change',e=>{
            this.createTimeRange(parseInt(e.currentTarget.value))
        });

        $(document).off('dragstart').on('dragstart','[data-h5-draggable-node]',e=>{
            EventAdapter.setData({dsItemId:e.currentTarget.dataset.dsId})
        });

        this.$ctnChart.off('dragover').on('dragover',e=>{
            e.preventDefault();
        });
        this.$ctnChart.off('dragleave').on('dragleave',e=>{
            e.preventDefault();
        });
        this.$ctnChart.off('drop').on('drop',e=>{
            e.preventDefault();
            e.stopPropagation();
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
        $btnShowAddPanel.off('click').on('click',function(e){
            e.stopPropagation();
            new HistoryDragPanel().show();
        });
        $btnShowTimeConfig.off('click').on('click',function(e){
            e.stopPropagation();
            if($(_this.ctnTimeConfig).is(':hidden')){
                $(_this.ctnTimeConfig).slideDown();
            }else{
                $(_this.ctnTimeConfig).slideUp();
            }
        });

        this.$btnClosePanel.off('click').on('click',function(e){
            e.stopPropagation();
            _this.saveToLocal(null,0);
            _this.close();
        });

        //背景颜色信息保存到localStorage,更新样式
        $divBackground.off('click').on('click', '.bg', function(){
            $(this).addClass('selected').siblings('span').removeClass('selected');
            _this.$panel.removeClass(_this.theme)
            if(this.classList.contains('dark')){
                _this.theme = 'dark';
            }else if(this.classList.contains('light')){
                _this.theme = 'light';
            }else if(this.classList.contains('transparent')){
                _this.theme = 'transparent';
            }
            localStorage.setItem('historyDragPanelBg', _this.theme);
            _this.$panel.addClass(_this.theme);
            _this.hisChart && _this.hisChart.setOption($.extend(true,_this.hisChart.getOption(), _this.themeOpt[_this.theme]));
        });
    };

    HistoryDragPanel.prototype.chartPreSet = function() {
        var _this = this;
        var postData;
        $(this.$panel).find('.dragTip').hide();
        var timeConfig = this.getTimeConfig();
        if(_this.store.length === 0){
            alert(I18n.resource.dashboard.modalHistoryDataAnalyze.NEED_DATA_SOURCE);
        }
        postData = {
            dsItemIds: _this.store.map(function(pt){return pt.id}),
            timeStart: timeConfig.startTime,
            timeEnd: timeConfig.endTime,
            timeFormat: timeConfig.interval
        };

        this.saveToLocal(postData,1);

        WebAPI.post('/analysis/startWorkspaceDataGenHistogram', postData).done(function (dataSrc) {
            _this.renderChart(dataSrc,timeConfig.interval);
        });
    };
    HistoryDragPanel.prototype.renderChart = function(data,interval){
        if($.isEmptyObject(data)){
            return;
        }
        var colorList = ["#E2583A", "#FD9F08", "#1D74A9", "#04A0D6", "#689C0F", "#109d83", "#FEC500"];
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
        for(let i = 0; i < timeShaft.length ;i++) {
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
        for (let i = 0; i < data.list.length ; i++){
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
                        color: colorList[i]
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
        this.hisChart = echarts.init(this.ctnChart,AppConfig.chartTheme);
        this.hisChart.setOption($.extend(true,option,this.themeOpt[this.theme]));
        this.hisChart.on('legendselectchanged', function (params) {
            var arr = [];
            for (var i =0 ;i < _this.store.length;i++){
                if(_this.store[i].name == params.name){
                    _this.store.splice(i,1);
                    series.splice(i,1);
                    legend.splice(i,1);
                    _this.hisChart.setOption($.extend(true,option,_this.themeOpt[_this.theme]));
                }else{
                    arr.push(_this.store[i].id);
                }
            }
            _this.saveToLocal({dsItemIds: arr}, 1);
        });
    };

    HistoryDragPanel.prototype.getTimeConfig = function(){
        var mode = this.divTimeConfig.querySelector('.iptTimeMode').value;
        var dateTimeRange = this.divTimeConfig.querySelector('.divTimeRange');
        var dateInterval = $(this.divTimeConfig).find('.divTimeInterval>select')[0];
        var startTime,endTime,interval;
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

    HistoryDragPanel.prototype.createTimeRange = function(mode){
        $(this.divTimeConfig).find('.divTimeInterval').remove();
        $(this.divTimeConfig).find('.divTimeRange').remove();
        var divTimeRange = document.createElement('div');
        divTimeRange.className = 'divTimeRange form-group';
        switch (mode){
            case 0:
                //divTimeRange.className += 'col-xs-3 col-lg-4';
                this.divTimeConfig.appendChild(divTimeRange);
                divTimeRange.innerHTML =`
                <label i18n="modalConfig.option.LABEL_TIME_RANGE">${I18n.resource.modalConfig.option.LABEL_TIME_RANGE}</label>
                <select class="form-control selRecentTimeRange">
                    <option value="today" i18n="modalConfig.option.PERIOD_DROP_DOWN_TODAY">${I18n.resource.modalConfig.option.PERIOD_DROP_DOWN_TODAY}</option>
                    <option value="threeDay"  i18n="modalConfig.option.PERIOD_DROP_DOWN_THREE_DAY">${I18n.resource.modalConfig.option.PERIOD_DROP_DOWN_THREE_DAY}</option>
                    <option value="yesterday" selected=""  i18n="modalConfig.option.PERIOD_DROP_DOWN_YESTERDAY">${I18n.resource.modalConfig.option.PERIOD_DROP_DOWN_YESTERDAY}</option>
                    <option value="thisWeek" i18n="modalConfig.option.PERIOD_DROP_DOWN_THIS_WEEK">${I18n.resource.modalConfig.option.PERIOD_DROP_DOWN_THIS_WEEK}</option>
                    <option value="lastWeek" i18n="modalConfig.option.PERIOD_DROP_DOWN_LAST_WEEK">${I18n.resource.modalConfig.option.PERIOD_DROP_DOWN_LAST_WEEK}</option>
                    <option value="thisYear" i18n="modalConfig.option.PERIOD_DROP_DOWN_THIS_YEAR">${I18n.resource.modalConfig.option.PERIOD_DROP_DOWN_THIS_YEAR}</option>
                </select>
                `;
                break;
            case 1:
                //divTimeRange.className += 'col-sm-6 col-lg-8';
                this.divTimeConfig.appendChild(divTimeRange);
                divTimeRange.innerHTML =`
                <label i18n="modalConfig.option.LABEL_TIME_RANGE">${I18n.resource.modalConfig.option.LABEL_TIME_RANGE}</label>
                <div class="input-group" style="width:100%">
                    <input class="iptRecentTimeVal form-control" style="width:60%">
                    <select class="selRecentTimeUnit form-control" style="width:40%">
                        <option value="minute" i18n="modalConfig.option.PERIOD_UNIT_MIN">${I18n.resource.modalConfig.option.PERIOD_UNIT_MIN}</option>
                        <option value="hour" i18n="modalConfig.option.PERIOD_UNIT_HOUR">${I18n.resource.modalConfig.option.PERIOD_UNIT_HOUR}</option>
                        <option value="day" i18n="modalConfig.option.PERIOD_UNIT_DAY">${I18n.resource.modalConfig.option.PERIOD_UNIT_DAY}</option>
                        <option value="month" i18n="modalConfig.option.PERIOD_UNIT_MON">${I18n.resource.modalConfig.option.PERIOD_UNIT_MON}</option>
                    </select>
                </div>
                `;
                this.divTimeConfig.insertBefore(this.createTimeInterval('minute'),divTimeRange);
                $(divTimeRange).find('.selRecentTimeUnit').off('change').on('change',e=>{
                    $(this.divTimeConfig).find('.divTimeInterval').remove();
                    this.divTimeConfig.insertBefore(this.createTimeInterval(e.currentTarget.value),e.currentTarget.parentNode.parentNode);
                    I18n.fillArea($(this.ctnTimeConfig));
                });
                break;
            case 2:
                this.divTimeConfig.appendChild(divTimeRange);
                divTimeRange.innerHTML =`
                <label i18n="modalConfig.option.LABEL_TIME_RANGE">${I18n.resource.modalConfig.option.LABEL_TIME_RANGE}</label>
                <div class="input-group">
                    <input class="form-control form_datetime iptStartTime" size="16" type="text" data-format="yyyy-mm-dd hh:ii" datetimepicker>
                    <span class="input-group-addon" i18n="modalConfig.option.TIP_RANGE_TO">${I18n.resource.modalConfig.option.TIP_RANGE_TO}</span>
                    <input class="form-control form_datetime iptEndTime" size="16" type="text" data-format="yyyy-mm-dd hh:ii" datetimepicker>
                </div>
                `;
                this.divTimeConfig.insertBefore(this.createTimeInterval(),divTimeRange);
                break;
            default :break;
            I18n.fillArea($(this.ctnTimeConfig));
        }
    };

    HistoryDragPanel.prototype.createTimeInterval = function(unit){
        var interval = document.createElement('div');
        interval.className ='divTimeInterval';
        switch (unit){
            case 'minute':
                interval.innerHTML = `
                <label i18n="modalConfig.option.LABEL_INTERVAL">${I18n.resource.modalConfig.option.LABEL_INTERVAL}</label>
                <select class="form-control">
                    <option value="m1" i18n="modalConfig.option.INTERVAL_MIN1">${I18n.resource.modalConfig.option.INTERVAL_MIN1}</option>
                    <option value="m5" i18n="modalConfig.option.INTERVAL_MIN5">${I18n.resource.modalConfig.option.INTERVAL_MIN5}</option>
                </select>
                `;
                break;
            case 'hour':
                interval.innerHTML = `
                <label i18n="modalConfig.option.LABEL_INTERVAL">${I18n.resource.modalConfig.option.LABEL_INTERVAL}</label>
                <select class="form-control">
                    <option value="m5" i18n="modalConfig.option.INTERVAL_MIN5">${I18n.resource.modalConfig.option.INTERVAL_MIN5}</option>
                    <option value="h1" i18n="modalConfig.option.INTERVAL_HOUR1">${I18n.resource.modalConfig.option.INTERVAL_HOUR1}</option>
                </select>
                `;
                break;
            case 'day':
                interval.innerHTML = `
                <label i18n="modalConfig.option.LABEL_INTERVAL">${I18n.resource.modalConfig.option.LABEL_INTERVAL}</label>
                <select class="form-control">
                    <option value="h1" i18n="modalConfig.option.INTERVAL_HOUR1">${I18n.resource.modalConfig.option.INTERVAL_HOUR1}</option>
                    <option value="d1" i18n="modalConfig.option.INTERVAL_DAY1">${I18n.resource.modalConfig.option.INTERVAL_DAY1}</option>
                </select>
                `;
                break;
            case 'month':
                interval.innerHTML = `
                <label i18n="modalConfig.option.LABEL_INTERVAL">${I18n.resource.modalConfig.option.LABEL_INTERVAL}</label>
                <select class="form-control">
                    <option value="d1" i18n="modalConfig.option.INTERVAL_DAY1">${I18n.resource.modalConfig.option.INTERVAL_DAY1}</option>
                    <option value="M1" i18n="modalConfig.option.INTERVAL_MON1">${I18n.resource.modalConfig.option.INTERVAL_MON1}</option>
                </select>
                `;
                break;
            default :
                interval.innerHTML = `
                <label i18n="modalConfig.option.LABEL_INTERVAL">${I18n.resource.modalConfig.option.LABEL_INTERVAL}</label>
                <select class="form-control">
                    <option value="m1" i18n="modalConfig.option.INTERVAL_MIN1">${I18n.resource.modalConfig.option.INTERVAL_MIN1}</option>
                    <option value="m5" i18n="modalConfig.option.INTERVAL_MIN5">${I18n.resource.modalConfig.option.INTERVAL_MIN5}</option>
                    <option value="h1" i18n="modalConfig.option.INTERVAL_HOUR1">${I18n.resource.modalConfig.option.INTERVAL_HOUR1}</option>
                    <option value="d1" i18n="modalConfig.option.INTERVAL_DAY1">${I18n.resource.modalConfig.option.INTERVAL_DAY1}</option>
                    <option value="M1" i18n="modalConfig.option.INTERVAL_MON1">${I18n.resource.modalConfig.option.INTERVAL_MON1}</option>
                </select>
                `;
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

    HistoryDragPanel.prototype.setFixedRangeInterval = function(interval){
        var iptStartTime = this.divTimeConfig.querySelector('.iptStartTime');
        var iptEndTime = this.divTimeConfig.querySelector('.iptEndTime');
        var format = '';
        var datePikerFormat = '';
        switch(interval){
            //case 'm1':
            //    format = 'yyyy-MM-dd HH:mm';
            //    datePikerFormat = 'yyyy-mm-dd hh:ii';
            //    break;
            //case 'm5':
            //    format = 'yyyy-MM-dd HH:mm';
            //    datePikerFormat = 'yyyy-mm-dd hh:ii';
            //    break;
            //case 'h1':
            //    format = 'yyyy-MM-dd HH:mm';
            //    datePikerFormat = 'yyyy-mm-dd hh:ii';
            //    break;
            //case 'd1':
            //    format = 'yyyy-MM-dd';
            //    datePikerFormat = 'yyyy-mm-dd';
            //    break;
            //case 'M1':
            //    format = 'yyyy-MM';
            //    datePikerFormat = 'yyyy-mm';
            //    break;
            default :
                format = 'yyyy-MM-dd HH:mm';
                datePikerFormat = 'yyyy-mm-dd hh:ii';
                break;
        }
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

    HistoryDragPanel.prototype.resizeObject = function() {
        this.el = null;
        this.dir = "";      //type of current resize (n, s, e, w, ne, nw, se, sw)
        this.grabx = null;
        this.graby = null;
        this.width = null;
        this.height = null;
        this.left = null;
        this.top = null;
    },

    HistoryDragPanel.prototype.getDirection = function(el) {
         var xPos, yPos, offset, dir;
         dir = "";

         xPos = window.event.offsetX;
         yPos = window.event.offsetY;

         offset = 8;
         if (yPos<offset) dir += "n";
         else if (yPos > el.offsetHeight-offset) dir += "s";
         if (xPos<offset) dir += "w";
         else if (xPos > el.offsetWidth-offset) dir += "e";

         return dir;
    },

    HistoryDragPanel.prototype.doDown = function(e) {
        if(e.target.style.cursor.indexOf('-resize') > -1){
            var el = getReal(e.target, "className", "historyDrag");
             if (el == null) {
                 this.el = null;
                 return;
             }

            if(el.className && el.className.indexOf('historyDrag') < 0) return;

            this.dir = this.getDirection(el);
             if (this.dir == "") return;

             this.leftObject = new this.resizeObject();

             this.leftObject.el = el;
             this.leftObject.dir = this.dir;

             this.leftObject.grabx = window.event.clientX;
             this.leftObject.graby = window.event.clientY;
             this.leftObject.width = el.offsetWidth;
             this.leftObject.height = el.offsetHeight;
             this.leftObject.left = el.offsetLeft;
             this.leftObject.top = el.offsetTop;

             window.event.returnValue = false;
             window.event.cancelBubble = true;
        }

        function getReal(el, type, value) {
            var temp = el;
            while ((temp != null) && (temp.tagName != "BODY")) {
                 if (eval("temp." + type) == value) {
                      el = temp;
                      return el;
                 }
                 temp = temp.parentElement;
             }
             return el;
        }
    },

    HistoryDragPanel.prototype.doUp = function(e) {
        this.saveToLocal({width: this.$panel.width(), height: this.$panel.height(),top: this.$panel.position().top/screen.height, left: this.$panel.position().left/screen.width},1);
        if (this.leftObject != null) {
            this.leftObject = null;
        }
    },

    HistoryDragPanel.prototype.doMove = function(e) {
        var el, str, xMin, yMin;
        xMin = this.panelDefaultW/4; //The smallest width possible
        yMin = this.panelDefaultY/5; //             height

        el = event.srcElement;
        if(!el) return;
        if (el.className && typeof(el.className) == 'string' && el.className.indexOf("historyDrag" ) > -1 ) {
            str = this.getDirection(el);
            //Fix the cursor
            if (str == "") str = "default";
            else str += "-resize";
            el.style.cursor = str;
        }

        //Dragging starts here
         if(this.leftObject != null) {
              if (this.dir.indexOf("e") != -1)
               this.leftObject.el.style.width = Math.max(xMin, this.leftObject.width + window.event.clientX - this.leftObject.grabx) + "px";

              if (this.dir.indexOf("s") != -1)
               this.leftObject.el.style.height = Math.max(yMin, this.leftObject.height + window.event.clientY - this.leftObject.graby) + "px";

              if (this.dir.indexOf("w") != -1) {
               this.leftObject.el.style.left = Math.min(this.leftObject.left + window.event.clientX - this.leftObject.grabx, this.leftObject.left + this.leftObject.width - xMin) + "px";
               this.leftObject.el.style.width = Math.max(xMin, this.leftObject.width - window.event.clientX + this.leftObject.grabx) + "px";
              }
              if (this.dir.indexOf("n") != -1) {
               this.leftObject.el.style.top = Math.min(this.leftObject.top + window.event.clientY - this.leftObject.graby, this.leftObject.top + this.leftObject.height - yMin) + "px";
               this.leftObject.el.style.height = Math.max(yMin, this.leftObject.height - window.event.clientY + this.leftObject.graby) + "px";
              }

              window.event.returnValue = false;
              window.event.cancelBubble = true;
              this.hisChart && this.hisChart.resize();
         }
    }

    HistoryDragPanel.prototype.setDrag = function(obj){
        var _this = this;
        var disX = 0;
        var disY = 0;
        obj.onmouseover = function(){
            obj.style.cursor = "move";
        }
        obj.onmousedown = function(event){
            var realDragObj = obj.parentNode;
            var scrollTop = document.documentElement.scrollTop||document.body.scrollTop;
            var scrollLeft = document.documentElement.scrollLeft||document.body.scrollLeft;
            //当鼠标按下时计算鼠标与拖拽对象的距离
            disX = event.clientX +scrollLeft-realDragObj.offsetLeft;
            disY = event.clientY +scrollTop-realDragObj.offsetTop;

            document.onmousemove=function(event){
                var ol = event.clientX + scrollLeft;
                var ot = event.clientY + scrollTop;
                //当鼠标拖动时计算div的位置
                var l = ol - disX;
                var t = ot - disY;
                realDragObj.style.left = l + "px";
                realDragObj.style.top = t + "px";
                //禁止超出pane
                var isTop = realDragObj.offsetTop < 60
                var isLeft = realDragObj.offsetLeft < 0;
                var isRight = realDragObj.offsetParent.offsetWidth - realDragObj.offsetLeft < realDragObj.offsetWidth;
                var isBottom = realDragObj.offsetParent.offsetHeight - realDragObj.offsetTop < realDragObj.offsetHeight;

                if(isTop){
                    realDragObj.style.top = '60px';
                }
                if(isLeft){
                    realDragObj.style.left = '0px';
                }
                if(isRight){
                    realDragObj.style.left = realDragObj.parentNode.offsetWidth - realDragObj.offsetWidth + 'px';
                }
                if(isBottom){
                    realDragObj.style.top = realDragObj.parentNode.offsetHeight - realDragObj.offsetHeight + 'px';
                }
            }
            document.onmouseup = function(e){
                _this.saveToLocal({top: _this.$panel.position().top/screen.height, left: _this.$panel.position().left/screen.width}, 1);
                document.onmousemove = null;
                document.onmouseup = null;
            }
            return false;
        }
    }

    /**
     * 保存信息到localStorage
     * @param params
     * @param type: 0->删除 1->编辑 2->新增
     */
    HistoryDragPanel.prototype.saveToLocal = function(params, type){
        var _this = this;
        //从localStorage取数
        var arrPanel = [], localPanel, isNew = true;
        localPanel = localStorage.getItem(this.localKey);
        if(localPanel){
            arrPanel = JSON.parse(localPanel);
        }
        if(type == 0){//删除
            for(var i = 0, l = arrPanel.length; i < l; i++){
                if(arrPanel[i].time == this.timeVal){
                    arrPanel.splice(i, 1);
                    break;
                }
            }
        }else if(type == 1) {
            if(arrPanel && arrPanel instanceof Array){
                arrPanel.map(function(data){
                    if(data.time == _this.timeVal){
                        data = $.extend(true, data, params);
                        if(params.hasOwnProperty('dsItemIds')){//删除操作不能用extend合并
                            data.dsItemIds = params.dsItemIds;
                        }
                        return data;
                    }
                });
            }
        }else if(type == 2) {
            arrPanel.push({
                time: this.timeVal,
                top: this.$panel.position().top/screen.height,
                left: this.$panel.position().left/screen.width,
                width: this.$panel.width(),
                height: this.$panel.height()
            });
        }
        //保存数据到localStorage,key: userId+projectId+pageId+timeStamp
        localStorage.setItem(this.localKey, JSON.stringify(arrPanel));
    }

    return HistoryDragPanel
})();