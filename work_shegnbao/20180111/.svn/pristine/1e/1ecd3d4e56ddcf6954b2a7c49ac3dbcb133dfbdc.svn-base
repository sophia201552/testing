/**
 * Created by win7 on 2016/8/15.
 */

//factory pagescreen start//
/*实时数据点监视*/
        //entity.w = 400;
        //entity.h = 400;
        //if(entity.widgetTpl){
        //    entity.widgetTpl.config.area[0].widget[0].opt.data = opt.title.val;
        //    entity.widgetTpl.config.area[1].data = opt.dataInfoList;
        //}
        //entity.option = {
        //    html: createHTML(),
        //    css: createCss(),
        //    js: createJs()
        //};
        //function createHTML(){
        //    var strTtl = '';
        //    if(opt.title){
        //        strTtl = `<div class="divDataInfoTtl clearfix">${opt.title.val}</div>`
        //    }
        //    var strPointUnit = '';
        //    for (let i = 0; i < opt.dataInfoList.length ;i++){
        //        strPointUnit +=`
        //        <div class="divDataInfo">
        //            <span class="spDataName">${opt.dataInfoList[i].name}</span>
        //            <span class="spDataSource"><%${opt.dataInfoList[i].data}%></span>
        //            <span class="spDataUnit">${opt.dataInfoList[i].unit}</span>
        //        </div>
        //        `
        //    }
        //    var strPointCtn = `<div class="divDataInfoList clearfix">${strPointUnit}</div>`;
        //    return strTtl + strPointCtn;
        //}
        //
        //function createCss(){
        //    return `
        //    __container__{
        //        border: 1px solid #969696;
        //        border-radius: 4px;
        //    }
        //    __container__  .divDataInfoTtl{
        //        text-align: center;
        //        margin-bottom: 10px;
        //        font-size: 14px;
        //        font-weight: bold;
        //        background: linear-gradient(#eee,grey);
        //        background: -webkit-linear-gradient(#eee,grey);
        //        border-bottom: 1px solid #969696;
        //    }
        //    __container__  .divDataInfo{
        //        display: inline-flex;
        //        align-items: center;
        //        width: 46%;
        //        padding: 2px 10px;
        //        margin: 0 2% 5px 2%;
        //        float: left;
        //    }
        //    __container__  .divDataInfo>span {
        //        display: inline-block;
        //    }
        //    __container__  .spDataName {
        //        width:45%;
        //    }
        //    __container__  .spDataUnit {
        //        text-align: center;
        //        width: 20%;
        //    }
        //    __container__  .spDataSource {
        //        border: solid 1px #E5E5E5;
        //        outline: 0;
        //        background: #FFFFFF url('bg_form.png') left top repeat-x;
        //        background: -webkit-gradient(linear, left top, left 25, from(#FFFFFF), color-stop(4%, #EEEEEE), to(#FFFFFF));
        //        background: -moz-linear-gradient(top, #FFFFFF, #EEEEEE 1px, #FFFFFF 25px);
        //        box-shadow: rgba(0,0,0, 0.1) 0px 0px 8px;
        //        -moz-box-shadow: rgba(0,0,0, 0.1) 0px 0px 8px;
        //        -webkit-box-shadow: rgba(0,0,0, 0.1) 0px 0px 8px;
        //        width: 35%;
        //        display: inline-block;
        //        border-radius: 7px;
        //        color: #52a5e2;
        //        text-align: center;
        //    }
        //    `;
        //}
        //
        //function createJs(){
        //    return `var ctn = document.getElementById('${entity._id}');
        //    var divDataInfo = ctn.querySelectorAll('.divDataInfo');
        //    function setUnitWidth() {
        //        if (ctn.offsetWidth < 300) {
        //            divDataInfo.forEach(dom=> {
        //                dom.style.width = '96%'
        //            })
        //        } else if (ctn.offsetWidth > 600) {
        //            divDataInfo.forEach(dom=> {
        //                dom.style.width = '29.3%'
        //            })
        //        }
        //    }
        //    setUnitWidth();
        //    ctn.onresize = setUnitWidth;`
        //}


/*实时仪表盘监视*/
// 数据格式化，使之吸附到网格上去
//        entity.w = 400;
//        entity.h = 400;
//        if(entity.widgetTpl){
//            entity.widgetTpl.config.area[0].widget[0].opt.data = opt.title.val;
//            entity.widgetTpl.config.area[1].data = {};
//            entity.widgetTpl.config.area[1].data.range = opt.range.map(function(val){return val.val});
//            entity.widgetTpl.config.area[1].data.mode = opt.select.val;
//            entity.widgetTpl.config.area[2].data = [{"type" : "x","name" : "数据点位","data" : opt.points[0],cog:opt.chartCog[0]}];
//        }
//        entity.option = {
//            html: createHTML(opt),
//            css: createCss(),
//            js: createChartJs(opt,data,entity._id)
//        };
//        function createHTML(opt){
//            if(opt.points.length < 1) return;
//            var arrPoint = [];
//            opt.points.forEach(arrPt=>{
//                arrPoint = arrPoint.concat(arrPt);
//            });
//            if (!arrPoint[0])return;
//            return `<div class="divChartTtl">${opt.title.val}</div><div style="display:none;"><%${arrPoint[0]}%></div><div style="height:calc(100% - 32px);width:100%" class="divGaugeTpl" data-id="${entity._id}"></div>`
//        }
//
//        function createCss(){
//            return `
//            __container__{
//                border: 1px solid #969696;
//                border-radius: 4px;
//            }
//            __container__  .divChartTtl{
//                text-align: center;
//                margin-bottom: 10px;
//                font-size: 14px;
//                font-weight: bold;
//                background: linear-gradient(#eee,grey);
//                background: -webkit-linear-gradient(#eee,grey);
//                border-bottom: 1px solid #969696;
//            }
//            `;
//        }
//
//        function createChartJs(opt,data,entityId){
//            if(opt.points.length < 1) return;
//            var arrPoint = [];
//            opt.points.forEach(arrPt=>{
//                arrPoint = arrPoint.concat(arrPt);
//            });
//            if (!arrPoint[0])return;
//           var chartOpt = {
//            tooltip: {
//                formatter: "{c}"
//            },
//            animation: true,
//            animationDuration: 1000,
//            animationDurationUpdate: 1000,
//            series: [
//                {
//                    name: 'PUE',
//                    type: 'gauge',
//                    splitNumber: 10,
//                    startAngle:225,
//                    endAngle:-45,
//                    radius:'75%',
//                    axisLine: {
//                        show: true,
//                        lineStyle: {
//                            width: 8
//                        }
//                    },
//                    axisTick: {
//                        show: true,
//                        splitNumber: 5,
//                        length: 15,
//                        lineStyle: {
//                            width: 1,
//                            type: 'solid',
//                            color:'auto'
//                        }
//                    },
//                    axisLabel: {
//                        textStyle: {
//                            color: 'auto'
//                        },
//                        formatter: function (v){
//                          return v.toFixed(2);
//                        }
//                    },
//                    splitLine: {
//                        show: true,
//                        length :20,
//                        lineStyle: {
//                            color: 'auto'
//                        }
//                    },
//                    pointer : {
//                        width : 5
//                    },
//                    detail: {
//                        formatter: '{value}',
//                        textStyle:{
//                            fontSize:12
//                        }
//                    }
//                }
//            ]
//        };
//
//            var scaleList = [];
//            for (var i = 0 ; i < opt.range.length; i++){
//                scaleList.push(opt.range[i].val);
//            }
//            scaleList.sort((a,b)=>{
//                return a > b
//            });
//
//            var colorList = ['#1abc9c','#3598db','#e84c3d'];
//
//            if(opt.select.val == 'low'){
//                colorList = ['#e84c3d','#3598db','#1abc9c'];
//            }
//
//            chartOpt.series[0].max = scaleList[scaleList.length-1];
//            chartOpt.series[0].min = scaleList[0];
//
//            chartOpt.series[0].axisLine.lineStyle.color = function(option){
//                var arr = [], colorIndex =0;
//                for(var i = 0; i < option.length; i++){
//                    if(i == 0){
//                        continue;
//                    }
//                    arr.push([((option[i] - option[0])/(chartOpt.series[0].max - chartOpt.series[0].min)).toFixed(3),colorList[colorIndex]]);
//                    colorIndex ++;
//                }
//                return arr;
//            }(scaleList);
//
//            var js = `\
//                _api.onUpdated = function(result){\
//                var chartOpt = ${JSON.stringify(chartOpt)};\
//                chartOpt.series[0].data = [{value: parseFloat(result['${arrPoint[0]}']).toFixed(2)}];\
//                var chart = echarts.init($(\'.divGaugeTpl[data-id=\"${entityId}"]\')[0]);\
//                chart.setOption(chartOpt); \
//                }\
//            `;
//            return js;
//        }



/*历史数据分析*/
        //entity.w = 700;
        //entity.h = 350;
        //entity.widgetTpl && (entity.widgetTpl.config.area[0].widget[0].opt.data = opt.title.val);
        //entity.option = {
        //    html: createHTML(),
        //    css:'',
        //    js: createJs()
        //};
        //function createHTML(){
        //    return `
        //        <div class="divChartTtl">${opt.title.val}</div>
        //        <div class="ctnTimeConfig gray-scrollbar"><div class="divTimeConfig clearfix"></div>
        //            <!--<div class="divDataConfig"></div>-->
        //            <div class="btnTimeConfigGrp">
        //            <div class="divConfigConfirm btn btn-primary" i18n="dashboard.modalHistoryDataAnalyze.DATE_CONFIRM">${I18n.resource.dashboard.modalHistoryDataAnalyze.DATE_CONFIRM}</div>
        //            <div style="background-color:transparent" class="divConfigCancel btn btn-default" i18n="dashboard.modalHistoryDataAnalyze.DATE_CANCEL">${I18n.resource.dashboard.modalHistoryDataAnalyze.DATE_CANCEL}</div>
        //            </div>
        //        </div>
        //        <div class="btnShowTimeConfig glyphicon glyphicon-cog"></div>
        //        <div class="dragTip" i18n="dashboard.modalHistoryDataAnalyze.DRAG_TIP_FOR_CHART">${I18n.resource.dashboard.modalHistoryDataAnalyze.DRAG_TIP_FOR_CHART}</div>
        //        <div class="divHistoryChart"></div>
        //    `;
        //}
        //function createJs(){
        //    return `
        //    var store = [];
        //    _container.parentNode.className +=' widgetHistoryAnalyze';
        //    var ctnTimeConfig = _container.querySelector('.ctnTimeConfig');
        //    var divTimeConfig = _container.querySelector('.divTimeConfig');
        //    var ctnChart = _container.querySelector('.divHistoryChart');
        //
        //
        //
        //if(!(AppConfig && AppConfig.datasource && AppConfig.datasource.getDSItemById)){
        //    AppConfig.datasource = {
        //        getDSItemById: DataSource.prototype.getDSItemById.bind({
        //            m_parent: {
        //                store: {
        //                    dsInfoList: []
        //                }
        //            },
        //            m_arrCloudTableInfo: []
        //        })
        //    };
        //}
        //    (function createTimeConfig(){
        //        var mode = document.createElement('div');
        //        mode.className = 'divTimeMode';
        //        mode.innerHTML = \`
        //        <label i18n="modalConfig.option.LABEL_MODE">${I18n.resource.modalConfig.option.LABEL_MODE}</label>
        //        <select class="form-control iptTimeMode">
        //            <option value="0" i18n="modalConfig.option.MODE_CURRENT">${I18n.resource.modalConfig.option.MODE_CURRENT}</option>
        //            <option value="1" i18n="modalConfig.option.MODE_RECENT">${I18n.resource.modalConfig.option.MODE_RECENT}</option>
        //            <option value="2" i18n="modalConfig.option.MODE_FIXED">${I18n.resource.modalConfig.option.MODE_FIXED}</option>
        //        </select>\`;
        //        divTimeConfig.appendChild(mode);
        //        createTimeRange(0);
        //        I18n.fillArea($(ctnTimeConfig));
        //    })();
        //    (function attachEvent(){
        //        var $btnShowTimeConfig = $(_container.querySelector('.btnShowTimeConfig'));
        //        $(ctnTimeConfig).hide();
        //        $(_container).find('.divConfigCancel').off('click').on('click',e=>{
        //            $(ctnTimeConfig).hide();
        //            $btnShowTimeConfig.show();
        //        });
        //        $(_container).find('.divConfigConfirm').off('click').on('click',e=>{
        //            $(ctnTimeConfig).hide();
        //            $btnShowTimeConfig.show();
        //            chartPreSet();
        //        });
        //        $(divTimeConfig).find('.divTimeMode>select').off('change').on('change',e=>{
        //            createTimeRange(parseInt(e.currentTarget.value))
        //        });
        //        $('.web-factory-container').off('dragstart').on('dragstart','[data-h5-draggable-node]',e=>{
        //            EventAdapter.setData({dsItemId:e.currentTarget.dataset.dsId})
        //        });
        //        var $ctnChart = $(ctnChart);
        //        $ctnChart.off('dragover').on('dragover',e=>{
        //            e.preventDefault();
        //        });
        //        $ctnChart.off('dragleave').on('dragleave',e=>{
        //            e.preventDefault();
        //        });
        //        $ctnChart.off('drop').on('drop',e=>{
        //            e.preventDefault();
        //            var id = EventAdapter.getData().dsItemId;
        //            for (var i = 0; i < store.length ;i++){
        //                if(store[i].id == id){
        //                    (typeof infoBox != 'undefined') && infoBox.alert(I18n.resource.dashboard.modalHistoryDataAnalyze.POINT_EXIST_TIP);
        //                    return;
        //                }
        //            }
        //            store.push({id:EventAdapter.getData().dsItemId});
        //            chartPreSet();
        //        });
        //        $btnShowTimeConfig.off('click').on('click',function(){
        //            $(ctnTimeConfig).show();
        //            $btnShowTimeConfig.hide();
        //        });
        //    })();
        //    I18n.fillArea($(_container));
        //    function createTimeRange(mode){
        //        $(divTimeConfig).find('.divTimeInterval').remove();
        //        $(divTimeConfig).find('.divTimeRange').remove();
        //        var divTimeRange = document.createElement('div');
        //        divTimeRange.className = 'divTimeRange input-group';
        //        switch (mode){
        //            case 0:
        //                divTimeRange.innerHTML =\`
        //                <label i18n="modalConfig.option.LABEL_TIME_RANGE">${I18n.resource.modalConfig.option.LABEL_TIME_RANGE}</label>
        //                <select class="form-control selRecentTimeRange">
        //                    <option value="today" i18n="modalConfig.option.PERIOD_DROP_DOWN_TODAY">${I18n.resource.modalConfig.option.PERIOD_DROP_DOWN_TODAY}</option>
        //                    <option value="threeDay"  i18n="modalConfig.option.PERIOD_DROP_DOWN_THREE_DAY">${I18n.resource.modalConfig.option.PERIOD_DROP_DOWN_THREE_DAY}</option>
        //                    <option value="yesterday" selected=""  i18n="modalConfig.option.PERIOD_DROP_DOWN_YESTERDAY">${I18n.resource.modalConfig.option.PERIOD_DROP_DOWN_YESTERDAY}</option>
        //                    <option value="thisWeek" i18n="modalConfig.option.PERIOD_DROP_DOWN_THIS_WEEK">${I18n.resource.modalConfig.option.PERIOD_DROP_DOWN_THIS_WEEK}</option>
        //                    <option value="lastWeek" i18n="modalConfig.option.PERIOD_DROP_DOWN_LAST_WEEK">${I18n.resource.modalConfig.option.PERIOD_DROP_DOWN_LAST_WEEK}</option>
        //                    <option value="thisYear" i18n="modalConfig.option.PERIOD_DROP_DOWN_THIS_YEAR">${I18n.resource.modalConfig.option.PERIOD_DROP_DOWN_THIS_YEAR}</option>
        //                </select>
        //                \`;
        //                divTimeConfig.appendChild(divTimeRange);
        //                break;
        //            case 1:
        //                divTimeRange.innerHTML =\`
        //                <label i18n="modalConfig.option.LABEL_TIME_RANGE">${I18n.resource.modalConfig.option.LABEL_TIME_RANGE}</label>
        //                <div class="input-group" style="width:100%">
        //                    <input class="iptRecentTimeVal form-control" style="width:60%">
        //                    <select class="selRecentTimeUnit form-control" style="width:40%">
        //                        <option value="minute" i18n="modalConfig.option.PERIOD_UNIT_MIN">${I18n.resource.modalConfig.option.PERIOD_UNIT_MIN}</option>
        //                        <option value="hour" i18n="modalConfig.option.PERIOD_UNIT_HOUR">${I18n.resource.modalConfig.option.PERIOD_UNIT_HOUR}</option>
        //                        <option value="day" i18n="modalConfig.option.PERIOD_UNIT_DAY">${I18n.resource.modalConfig.option.PERIOD_UNIT_DAY}</option>
        //                        <option value="month" i18n="modalConfig.option.PERIOD_UNIT_MON">${I18n.resource.modalConfig.option.PERIOD_UNIT_MON}</option>
        //                    </select>
        //                </div>
        //                \`;
        //                $(divTimeRange).find('.selRecentTimeUnit').off('change').on('change',e=>{
        //                    $(divTimeConfig).find('.divTimeInterval').remove();
        //                    divTimeConfig.insertBefore(createTimeInterval(e.currentTarget.value),e.currentTarget.parentNode.parentNode);
        //                    I18n.fillArea($(ctnTimeConfig));
        //                });
        //                divTimeConfig.appendChild(divTimeRange);
        //                divTimeConfig.insertBefore(createTimeInterval('minute'),divTimeRange);
        //                break;
        //            case 2:
        //                divTimeRange.innerHTML =\`
        //                <label i18n="modalConfig.option.LABEL_TIME_RANGE">${I18n.resource.modalConfig.option.LABEL_TIME_RANGE}</label>
        //                <div class="input-group">
        //                    <input class="form-control form_datetime iptStartTime" size="16" type="text" data-format="yyyy-mm-dd hh:ii" datetimepicker>
        //                    <span class="input-group-addon" i18n="modalConfig.option.TIP_RANGE_TO">${I18n.resource.modalConfig.option.TIP_RANGE_TO}</span>
        //                    <input class="form-control form_datetime iptEndTime" size="16" type="text" data-format="yyyy-mm-dd hh:ii" datetimepicker>
        //                </div>
        //                \`;
        //                divTimeConfig.appendChild(divTimeRange);
        //                divTimeConfig.insertBefore(createTimeInterval(),divTimeRange);
        //                break;
        //            default :break;
        //        }
        //        I18n.fillArea($(ctnTimeConfig));
        //    }
        //    function setFixedRangeInterval(interval){
        //        var iptStartTime = divTimeConfig.querySelector('.iptStartTime');
        //        var iptEndTime = divTimeConfig.querySelector('.iptEndTime');
        //        var format = '';
        //        switch(interval){
        //            //case 'm1':
        //            //    format = 'yyyy-MM-dd HH:mm';
        //            //    datePikerFormat = 'yyyy-mm-dd hh:ii';
        //            //    break;
        //            //case 'm5':
        //            //    format = 'yyyy-MM-dd HH:mm';
        //            //    datePikerFormat = 'yyyy-mm-dd hh:ii';
        //            //    break;
        //            //case 'h1':
        //            //    format = 'yyyy-MM-dd HH:mm';
        //            //    datePikerFormat = 'yyyy-mm-dd hh:ii';
        //            //    break;
        //            //case 'd1':
        //            //    format = 'yyyy-MM-dd';
        //            //    datePikerFormat = 'yyyy-mm-dd';
        //            //    break;
        //            //case 'M1':
        //            //    format = 'yyyy-MM';
        //            //    datePikerFormat = 'yyyy-mm';
        //            //    break;
        //            default :
        //                format = 'yyyy-MM-dd HH:mm';
        //                datePikerFormat = 'yyyy-mm-dd hh:ii';
        //                break;
        //        }
        //        $(iptStartTime).datetimepicker({
        //            todayBtn:'linked',
        //            endTime:new Date(),
        //            format:datePikerFormat,
        //            autoclose:true,
        //            initialDate:new Date().format(format)
        //        });
        //        $(iptEndTime).datetimepicker({
        //            todayBtn:'linked',
        //            endTime:new Date(),
        //            format:datePikerFormat,
        //            autoclose:true,
        //            initialDate:new Date().format(format)
        //        })
        //    }
        //    function getTimeConfig(){
        //        var mode = divTimeConfig.querySelector('.iptTimeMode').value;
        //        var dateTimeRange = divTimeConfig.querySelector('.divTimeRange');
        //        var dateInterval = $(divTimeConfig).find('.divTimeInterval>select')[0];
        //        var startTime,endTime,interval,range;
        //        var now = new Date();
        //        if (mode == 0 ){
        //            var timeRangeVal = dateTimeRange.querySelector('.selRecentTimeRange').value;
        //            switch (timeRangeVal){
        //                case 'today':
        //                    startTime = new Date(now.getTime() - 86400000).format('yyyy-MM-dd HH:mm:ss');
        //                    endTime = now.format('yyyy-MM-dd HH:mm:ss');
        //                    interval = 'h1';
        //                    break;
        //                case 'threeDay':
        //                    startTime = new Date(now.getTime() - 259200000).format('yyyy-MM-dd HH:mm:ss');
        //                    endTime = now.format('yyyy-MM-dd HH:mm:ss');
        //                    interval = 'h1';
        //                    break;
        //                case 'yesterday':
        //                    startTime = new Date(now.getTime() - 86400000).format('yyyy-MM-dd 00:00:00');
        //                    endTime = new Date(now.getTime() - 86400000).format('yyyy-MM-dd 23:59:59');
        //                    interval = 'h1';
        //                    break;
        //                case 'thisWeek':
        //                    startTime = new Date(now.getTime() - 604800000).format('yyyy-MM-dd HH:mm:ss');
        //                    endTime = now.format('yyyy-MM-dd HH:mm:ss');
        //                    interval = 'd1';
        //                    break;
        //                case 'lastWeek':
        //                    var weekVal = DateUtil.getWeekNumber(now);
        //                    var dateRange = DateUtil.getDateRangeOnWeekNumber(weekVal[0],weekVal[1]-1);
        //                    startTime = new Date(dateRange[0].getTime() - 604800000).format('yyyy-MM-dd 00:00:00');
        //                    endTime = new Date(dateRange[1].getTime() - 604800000).format('yyyy-MM-dd 23:59:59');
        //                    interval = 'd1';
        //                    break;
        //                case 'thisYear':
        //                    startTime = new Date(now.getTime() - 31536000000).format('yyyy-MM-dd HH:mm:ss');
        //                    endTime = now.format('yyyy-MM-dd HH:mm:ss');
        //                    interval = 'M1';
        //                    break;
        //            }
        //        }else if (mode == 1){
        //            var dateTimeUnit = dateTimeRange.querySelector('.selRecentTimeUnit').value;
        //            var unitTime = 0 ;
        //            var dataTimeVal = parseInt(dateTimeRange.querySelector('.iptRecentTimeVal').value);
        //            if (isNaN(dataTimeVal))return;
        //            switch (dateTimeUnit){
        //                case 'minute':
        //                    unitTime = 60000;
        //                    break;
        //                case 'hour':
        //                    unitTime = 3600000;
        //                    break;
        //                case 'day':
        //                    unitTime = 86400000;
        //                    break;
        //                case 'month':
        //                    unitTime = 2592000000;
        //                    break;
        //            }
        //            interval = dateInterval.value;
        //            startTime = new Date(now.getTime() - unitTime * dataTimeVal).format('yyyy-MM-dd HH:mm:ss');
        //            endTime = now.format('yyyy-MM-dd HH:mm:ss');
        //        }else if (mode == 2){
        //            interval = dateInterval.value;
        //            startTime = new Date(dateTimeRange.querySelector('.iptStartTime').value).format('yyyy-MM-dd HH:mm:ss');
        //            endTime = new Date(dateTimeRange.querySelector('.iptEndTime').value).format('yyyy-MM-dd HH:mm:ss');
        //        }
        //        return {
        //            startTime:startTime,
        //            endTime:endTime,
        //            interval:interval
        //        }
        //    }
        //    function createTimeInterval(unit){
        //        var interval = document.createElement('div');
        //        interval.className ='divTimeInterval';
        //        switch (unit){
        //            case 'minute':
        //                interval.innerHTML = \`
        //                <label i18n="modalConfig.option.LABEL_INTERVAL">${I18n.resource.modalConfig.option.LABEL_INTERVAL}</label>
        //                <select class="form-control">
        //                    <option value="m1" i18n="modalConfig.option.INTERVAL_MIN1">${I18n.resource.modalConfig.option.INTERVAL_MIN1}</option>
        //                    <option value="m5" i18n="modalConfig.option.INTERVAL_MIN5">${I18n.resource.modalConfig.option.INTERVAL_MIN5}</option>
        //                </select>
        //                \`;
        //                break;
        //            case 'hour':
        //                interval.innerHTML = \`
        //                <label i18n="modalConfig.option.LABEL_INTERVAL">${I18n.resource.modalConfig.option.LABEL_INTERVAL}</label>
        //                <select class="form-control">
        //                    <option value="m5" i18n="modalConfig.option.INTERVAL_MIN5">${I18n.resource.modalConfig.option.INTERVAL_MIN5}</option>
        //                    <option value="h1" i18n="modalConfig.option.INTERVAL_HOUR1">${I18n.resource.modalConfig.option.INTERVAL_HOUR1}</option>
        //                </select>
        //                \`;
        //                break;
        //            case 'day':
        //                interval.innerHTML = \`
        //                <label i18n="modalConfig.option.LABEL_INTERVAL">${I18n.resource.modalConfig.option.LABEL_INTERVAL}</label>
        //                <select class="form-control">
        //                    <option value="h1" i18n="modalConfig.option.INTERVAL_HOUR1">${I18n.resource.modalConfig.option.INTERVAL_HOUR1}</option>
        //                    <option value="d1" i18n="modalConfig.option.INTERVAL_DAY1">${I18n.resource.modalConfig.option.INTERVAL_DAY1}</option>
        //                </select>
        //                \`;
        //                break;
        //            case 'month':
        //                interval.innerHTML = \`
        //                <label i18n="modalConfig.option.LABEL_INTERVAL">${I18n.resource.modalConfig.option.LABEL_INTERVAL}</label>
        //                <select class="form-control">
        //                    <option value="d1" i18n="modalConfig.option.INTERVAL_DAY1">${I18n.resource.modalConfig.option.INTERVAL_DAY1}</option>
        //                    <option value="M1" i18n="modalConfig.option.INTERVAL_MON1">${I18n.resource.modalConfig.option.INTERVAL_MON1}</option>
        //                </select>
        //                \`;
        //                break;
        //            default :
        //                interval.innerHTML = \`
        //                <label i18n="modalConfig.option.LABEL_INTERVAL">${I18n.resource.modalConfig.option.LABEL_INTERVAL}</label>
        //                <select class="form-control">
        //                    <option value="m1" i18n="modalConfig.option.INTERVAL_MIN1">${I18n.resource.modalConfig.option.INTERVAL_MIN1}</option>
        //                    <option value="m5" i18n="modalConfig.option.INTERVAL_MIN5">${I18n.resource.modalConfig.option.INTERVAL_MIN5}</option>
        //                    <option value="h1" i18n="modalConfig.option.INTERVAL_HOUR1">${I18n.resource.modalConfig.option.INTERVAL_HOUR1}</option>
        //                    <option value="d1" i18n="modalConfig.option.INTERVAL_DAY1">${I18n.resource.modalConfig.option.INTERVAL_DAY1}</option>
        //                    <option value="M1" i18n="modalConfig.option.INTERVAL_MON1">${I18n.resource.modalConfig.option.INTERVAL_MON1}</option>
        //                </select>
        //                \`;
        //                setFixedRangeInterval('m1');
        //                interval.getElementsByTagName('select')[0].onchange = function(e){
        //                    setFixedRangeInterval(e.currentTarget.value)
        //                };
        //                break;
        //        }
        //        I18n.fillArea($(ctnTimeConfig));
        //        return interval;
        //    }
        //    function chartPreSet(){
        //        var _this;
        //        var timeConfig = getTimeConfig();
        //        $(_container).find('.dragTip').hide();
        //        WebAPI.post('/analysis/startWorkspaceDataGenHistogram', {
        //            //dataSourceId: '',  //_this.screen.store.datasources[0].id,
        //            dsItemIds: store.map(function(pt){return pt.id}),
        //            timeStart: timeConfig.startTime,
        //            timeEnd: timeConfig.endTime,
        //            timeFormat: timeConfig.interval
        //        }).done(function (dataSrc) {
        //            renderChart(dataSrc,timeConfig.interval);
        //        })
        //    }
        //    function renderChart(data,interval){
        //        var formatDate = '';
        //        var formatTime = '';
        //        switch (interval){
        //            case 'm1':
        //                //formatDate = 'MM-dd';
        //                formatTime = 'HH:mm';
        //                break;
        //            case 'm5':
        //                //formatDate = 'MM-dd';
        //                formatTime = 'HH:mm';
        //                break;
        //            case 'h1':
        //                //formatDate = 'MM-dd';
        //                formatTime = 'HH:mm';
        //                break;
        //            case 'd1':
        //                formatDate = 'MM-dd';
        //                //formatTime = 'HH:mm';
        //                break;
        //            case 'M1':
        //                formatDate = 'yyyy-MM-dd';
        //                formatTime = '';
        //                break;
        //        }
        //        var timeInit = data.timeShaft;
        //        var timeShaft = [].concat(data.timeShaft);
        //        for(let i = 0; i < timeShaft.length ;i++) {
        //            if (formatDate && formatTime) {
        //                timeShaft[i] = new Date(timeShaft[i]).format(formatDate) + '\\n\\r' + new Date(timeShaft[i]).format(formatTime);
        //            }else if(formatDate){
        //                timeShaft[i] = new Date(timeShaft[i]).format(formatDate) ;
        //            }else{
        //                timeShaft[i] = new Date(timeShaft[i]).format(formatTime) ;
        //            }
        //        }
        //        var dsName = '';
        //        var legend = [];
        //        var series = [];
        //        for (let i = 0; i < data.list.length ; i++){
        //            if (data.list[i].data.length == 0)continue;
        //            dsName = AppConfig.datasource.getDSItemById(data.list[i].dsItemId).alias;
        //            store[i].name = dsName;
        //            legend.push(dsName);
        //            series.push({
        //                name:dsName,
        //                data:data.list[i].data,
        //                type:'line',
        //                itemStyle: {
        //                    normal: {
        //                        color: AppConfig.chartTheme.color[i%7]
        //                    }
        //                }
        //            })
        //        }
        //        var option = {
        //            title: {
        //                show:false,
        //                left: 'center',
        //                text: I18n.resource.dashboard.modalHistoryDataAnalyze.HISTORY_DATA,
        //                textStyle:{
        //                    color:'#fff'
        //                }
        //            },
        //            legend: {
        //                data:legend,
        //                padding:2,
        //                textStyle:{
        //                    color:'#fff',
        //                    fontSize:8,
        //                    fontWeight:'lighter'
        //                },
        //                formatter:function(opt){
        //                    var str = '';
        //                    if (opt.length > 10){
        //                        str = opt.slice(0,5) + '...' + opt.slice(opt.length -5)
        //                    }else{
        //                        str = opt;
        //                    }
        //                    return str;
        //                },
        //                orient:'horizontal',
        //                top:5,
        //            },
        //            grid:{
        //                x:45,
        //                y:25,
        //                x2:25,
        //                y2:25
        //            },
        //            toolbox: {
        //            },
        //            tooltip:{
        //                trigger: 'axis',
        //                formatter:function(data){
        //                    var strTip = '';
        //                    strTip += new Date(timeInit[data[0].dataIndex]).format('yyyy-MM-dd HH:mm') + '</br>';
        //                    for (var i = 0 ; i< data.length ;i++){
        //                        strTip+=data[i].seriesName + ' : ' + data[i].data;
        //                        if(i != (data.length -1)) {
        //                            strTip += '</br>';
        //                        }
        //                    }
        //                    return strTip;
        //                }
        //            },
        //            xAxis: {
        //                type: 'category',
        //                boundaryGap: false,
        //                data: timeShaft,
        //                axisLine:{
        //                    lineStyle:{
        //                        color:'#fff'
        //                    }
        //                }
        //            },
        //            yAxis: {
        //                type: 'value',
        //                scale: true,
        //                axisLabel: {
        //                    formatter: function (value) {
        //                        var ret;
        //                        if (value < 1000) {
        //                            ret = value;
        //                        }
        //                        else if (value < 1000000) {
        //                            ret = value / 1000 + 'k';
        //                        }
        //                        else {
        //                            ret = value / 1000000 + 'M';
        //                        }
        //                        return ret;
        //                    }
        //                },
        //                splitLine:{
        //                    lineStyle:{
        //                        opacity:0.8
        //                    }
        //                },
        //                axisLine:{
        //                    lineStyle:{
        //                        color:'#fff'
        //                    }
        //                }
        //            },
        //            series: series
        //        };
        //        var hisChart = echarts.init(ctnChart,AppConfig.chartTheme);
        //        hisChart.setOption(option);
        //        hisChart.on('legendselectchanged', function (params) {
        //            for (var i =0 ;i < store.length;i++){
        //                if(store[i].name == params.name){
        //                    store.splice(i,1);
        //                    series.splice(i,1);
        //                    legend.splice(i,1);
        //                    hisChart.setOption(option);
        //                    break;
        //                }
        //            }
        //        });
        //    }`;
        //}
//factory pagescreen end//

