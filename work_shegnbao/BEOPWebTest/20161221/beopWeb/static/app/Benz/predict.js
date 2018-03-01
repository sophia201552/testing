/**
 * Created by win7 on 2016/4/22.
 */
var PredictModule = (function(){
    var _this;
    function PredictModule(){
        _this = this;
        _this.store = {
            date:{},
            data:{},
            opt:{
                y:{
                    type:'energy',
                    name:'能耗',
                    source:0, //source：0-手动；1-数据源；2：文件
                    dsId:'5719c8bc6455142134d35c04'
                },
                x1:{
                    type:'yield',
                    name:'产能',
                    source:0,
                    dsId:'5719c8bc6455142134d3609a'
                }
            }
        };
        _this.hasInit = {
            initChart:false
        };
        _this.period = undefined;
        _this.chart = undefined;
        _this.dataMap = undefined;
        _this.hasData = false;
    }
    PredictModule.prototype = {
        show:function(){
            _this.init();
        },
        initData:function(date,upToNow){
            var startDate = new Date(date);
            var postData = {
                dsItemIds:[],
                timeStart:new Date(date).format('yyyy-MM-dd HH:mm:ss')
            };
            for (var ele in _this.store.opt){
                postData.dsItemIds.push(_this.store.opt[ele].dsId);
            }
            switch (_this.period){
                case 'day':
                    postData.timeFormat = 'd1';
                    if (upToNow) {
                        postData.timeEnd = new Date().format('yyyy-MM-dd HH:mm:ss');
                    }else{
                        postData.timeEnd = new Date(startDate.setMonth(startDate.getMonth()+ 1)).format('yyyy-MM-dd HH:mm:ss');
                    }
                    break;
                case 'month':
                    postData.timeFormat = 'd1';
                    if (upToNow) {
                        postData.timeEnd = new Date().format('yyyy-MM-dd HH:mm:ss');
                    }else{
                        postData.timeEnd = new Date(startDate.setFullYear(startDate.getFullYear() + 1)).format('yyyy-MM-dd HH:mm:ss');
                    }
                    break;
            }
            return WebAPI.post('/analysis/startWorkspaceDataGenHistogram',postData);
        },
        init:function(){
            _this.initDataSure();
            _this.initPeriodSel();
            _this.initDataSet();
            _this.initDataBtn();
            _this.initDataReturn();
            _this.initDataRangeDel();
        },
        initDataRangeDel:function(){
            $('#ctnPredictCfg').off('click').on('click','.btnDataRangeDel',function(e){
                var target = e.currentTarget;
                var divRange = $(target).parentsUntil('#divDataCfg','.divRow')[0];
                //var index = $('#divDataCfg>.divUnit').index(divRange);
                delete _this.store.data[_this.period][divRange.dataset.dateRange];
                $(divRange).remove();
                //localStorage.setItem('predictData',JSON.stringify(_this.store));
            })
        },
        initPeriodSel:function(){
            var $btnPeriod = $('.btnPeriod');
            $btnPeriod.off('click').on('click',function(e){
                document.getElementById('divDataCfg').innerHTML = '';
                _this.period = e.currentTarget.dataset.period;
                //if (!_this.store[e.currentTarget.dataset.period]) {
                //    _this.store[e.currentTarget.dataset.period] = {};
                //}
                if(!_this.hasInit[_this.period]){
                    _this.hasInit[_this.period] = true;
                    _this.initDataStore();
                }else {
                    _this.initTableSet();
                }
            });
            $btnPeriod.eq(1).trigger('click');
        },
        initTableSet:function(){
            for (var ele in  _this.store.data[_this.period]) {
                _this.setDataRangeStore(ele);
            }
            switch (_this.period){
                case 'day':
                    _this.initTableData(31);
                    break;
                case 'month':
                    _this.initTableData(12);
                    break;
                default :
                    break;
            }
        },
        initDataStore:function(){
            var initDataNum = 3;
            var now = new Date(),date;
            _this.initDateSeries();
            var $btnSure = $('#btnDataSure');
            var predictData = localStorage.getItem('predictData');
            if (predictData)_this.store = JSON.parse(predictData);
            switch (_this.period){
                case 'day':
                    if (_this.store.data[_this.period] && !$.isEmptyObject(_this.store.data[_this.period])){
                        _this.initTableData(31);
                        if(_this.hasInit.initChart)return;
                        $btnSure.trigger('click')
                    }else {
                        _this.store.data[_this.period] = {};
                        for (var i = 0; i < initDataNum;i++) {
                            date = new Date(new Date().setMonth(now.getMonth() - i + 1)).format('yyyy-MM');
                            _this.setDataRangeStore(date);
                        }
                        _this.initData(new Date(date).setHours(0), true).done(function (result) {
                            _this.insertDataFromDs(result);
                            _this.initTableData(31);
                            if(_this.hasInit.initChart)return;
                            $btnSure.trigger('click')
                        });
                    }
                    break;
                case 'month':
                    if (_this.store.data[_this.period] && !$.isEmptyObject(_this.store.data[_this.period])){
                        _this.initTableData(12);
                        if(_this.hasInit.initChart)return;
                        $btnSure.trigger('click')
                    }else {
                        _this.store.data[_this.period] = {};
                        for (var i = 0; i < initDataNum;i++) {
                            date = new Date(new Date().setFullYear(now.getFullYear() - i + 1)).format('yyyy');
                            _this.setDataRangeStore(date);
                        }
                        _this.initData(new Date(date).setHours(0), true).done(function (result) {
                            _this.insertDataFromDs(result);
                            _this.initTableData(12);
                            if(_this.hasInit.initChart)return;
                            $btnSure.trigger('click')
                        });
                    }
                    break;
                default :
                    break;
            }
        },
        initDateSeries:function(){
            _this.store.date.day = [];
            for (var i = 0; i < 31; i++){
                _this.store.date.day.push((i+1) + '日')
            }
            _this.store.date.month = [];
            for (var i = 0; i < 12; i++){
                _this.store.date.month.push((i+1) + '月')
            }
        },
        setDataRangeStore:function(date){
            if(!(_this.store.data[_this.period][date])){
                _this.store.data[_this.period][date] = {
                };
                for (var ele in _this.store.opt){
                    _this.store.data[_this.period][date][ele] = [];
                }
            }
        },
        insertDataFromDs:function(data){
            var format;
            var dsDate ;
            switch (_this.period){
                case 'day':
                    format = 'yyyy-MM';
                    break;
                case 'month':
                    format = 'yyyy'
            }
            for (var i = 0;i < data.list.length ;i++){
                for (var ele in _this.store.opt) {
                    if (_this.store.opt[ele].dsId == data.list[i].dsItemId) {
                        for (var j = 0; j < data.timeShaft.length; j++) {
                            dsDate = new Date(data.timeShaft[j]);
                            if(_this.period=='day' || dsDate.getDate() == 1){
                                _this.store.data[_this.period][dsDate.format(format)][ele].push(data.list[i].data[j])
                            }
                        }
                        break;
                    }
                }
            }
            //localStorage.setItem('predictData',JSON.stringify(_this.store));
        },
        initTableData:function(col){
            var ctn = document.getElementById('divDataCfg');
            ctn.dataset.period = _this.period;
            _this.initDataTitle();
            var arrRow = [];
            var format;
            var rowFormat;
            switch (_this.period){
                case 'day':
                    format = new Date().format('dd');
                    rowFormat = 'yyyy-MM';
                    break;
                case 'month':
                    format = new Date().format('MM/dd');
                    rowFormat = 'yyyy';
                    break;
                default:
                    break;
            }
            //for (var row in _this.store.data[_this.period]){
            //    if (arrRow.length == 0 ){
            //        arrRow.push({
            //            data:_this.store.data[_this.period][row],
            //            date:new Date(row + '/' + format)
            //        });
            //    }else {
            //        for (var i = 0; i < arrRow.length; i++) {
            //            if (new Date(row + '/' + format) < new Date(arrRow[i].date)) {
            //                arrRow.splice(i,0,{
            //                    data:_this.store.data[_this.period][row],
            //                    date:new Date(row + '/' + format)
            //                });
            //                break;
            //            }
            //            if (i == (arrRow.length - 1)){
            //                arrRow.unshift({
            //                    data:_this.store.data[_this.period][row],
            //                    date:new Date(row + '/' + format)
            //                });
            //                break;
            //            }
            //        }
            //    }
            //}
            for (var row in _this.store.data[_this.period]){
                arrRow.push({
                    data:_this.store.data[_this.period][row],
                    date:new Date((row + '/' + format).replace(/-/g,'/'))
                });
            }
            arrRow.sort(function(a,b){
                return b.date - a.date;
            });
            for (var i= 0 ; i < arrRow.length; i++){
                _this.initDataAdd(ctn,arrRow[i].date.format(rowFormat),col)
            }
        },
        initDataAdd:function(ctn,row,col){
            var divRow,unit,rowTitle,spData,ipt,divVar,divVarTtl,spTitle,spTtl,btnRowDel;
            divRow = document.createElement('div');
            divRow.className = 'divRow';
            divRow.dataset.dateRange = row;

            rowTitle = document.createElement('div');
            rowTitle.className = 'divUnit inlineCenter';
            spTitle = document.createElement('span');
            spTitle.textContent = row;
            spTitle.className = 'spTitle inlineCenter';
            rowTitle.appendChild(spTitle);

            btnRowDel = document.createElement('span');
            btnRowDel.className = 'btnDataRangeDel glyphicon glyphicon-remove';
            rowTitle.appendChild(btnRowDel);

            divVarTtl = document.createElement('div');
            divVarTtl.className = 'divVarTtl';
            for (var ele in _this.store.opt){
                spTtl = document.createElement('span');
                spTtl.className = 'spVarTtl inlineCenter';
                spTtl.textContent = _this.store.opt[ele].name;
                divVarTtl.appendChild(spTtl);
            }
            rowTitle.appendChild(divVarTtl);
            divRow.appendChild(rowTitle);
            for (var i = 0 ; i < col; i++) {
                unit = document.createElement('div');
                unit.className = 'divData divUnit';
                unit.dataset.dateRange = row;
                unit.dataset.dateDetail = i + 1;
                for (var ele in _this.store.opt) {
                    divVar = document.createElement('div');
                    divVar.className = 'divVar flexCenter div' + _this.store.opt[ele].type[0].toUpperCase() + (_this.store.opt[ele].type[1]?_this.store.opt[ele].type.slice(1):'') ;
                    divVar.dataset.var = ele;
                    divVar.dataset.type = _this.store.opt[ele].type;

                    spData = document.createElement('span');
                    spData.className = 'spData';
                    if (_this.store.data[_this.period][row][ele][i]) {
                        spData.textContent = _this.store.data[_this.period][row][ele][i];
                    }
                    ipt = document.createElement('input');
                    ipt.className = 'iptData';
                    ipt.setAttribute('type', 'text');
                    if (_this.store.data[_this.period][row][ele][i]) {
                        ipt.value = _this.store.data[_this.period][row][ele][i];
                    }

                    divVar.appendChild(spData);
                    divVar.appendChild(ipt);
                    unit.appendChild(divVar);
                }
                divRow.appendChild(unit)
            }
            ctn.appendChild(divRow);
        },
        initDataBtn:function(){
            var ctn = document.getElementById('divDataCfg');
            var col,date;
            $('#divDataNumBtn').off('click').on('click',function(){
                col = _this.store.date[_this.period].length;
                date = new Date($(ctn).children('.divRow').last()[0].dataset.dateRange);
                switch (_this.period){
                    case 'day':
                        date = new Date(date.setMonth(date.getMonth() - 1)).format('yyyy-MM');
                        break;
                    case 'month':
                        date = new Date(date.setFullYear(date.getFullYear() - 1)).format('yyyy');
                        break;
                    default:
                        break;
                }
                _this.setDataRangeStore(date);
                _this.initData(new Date(date).setHours(0)).done(function(result){
                    _this.insertDataFromDs(result);
                    _this.initDataAdd(ctn,date,col)
                });
            });
            //var $modal = $('#modalVarSet');
            //var $divContent = $('#divModalVarSet');
            //$('#divVarBtn').off('click').on('click',function(){
            //    $divContent.html('');
            //    _this.initVarSet();
            //    $modal.modal('show');
            //    //$('#rightCt').trigger('click');
            //})
        },
        initVarSet:function(){
            var ctn = document.getElementById('divModalVarSet');
            var divVarSet,divVarSetTtl,divFromFile,divFromDs,divBlank,divVarName;
            divVarSetTtl = document.createElement('div');
            divVarSetTtl.className = 'row divVarSetRow divVarSetTtl';

            divBlank = document.createElement('div');
            divBlank.className = 'col-xs-4 divVarSetUnit divBlank';

            divFromDs = document.createElement('div');
            divFromDs.className = 'col-xs-4 divVarSetUnit divVarFromDs';
            divFromDs.textContent = '数据源';

            divFromFile = document.createElement('div');
            divFromFile.className = 'col-xs-4 divVarSetUnit divVarFromFile';
            divFromFile.textContent = '从文件读取';

            divVarSetTtl.appendChild(divBlank);
            divVarSetTtl.appendChild(divFromDs);
            //divVarSetTtl.appendChild(divFromFile);

            ctn.appendChild(divVarSetTtl);

            for (var ele in _this.store.opt){
                divVarSet = document.createElement('div');
                divVarSet.className = 'row divVarSetRow divVarSet';

                divVarName = document.createElement('div');
                divVarName.className = 'col-xs-4 divVarSetUnit divVarName';
                divVarName.textContent = _this.store.opt[ele].name;

                divFromDs = document.createElement('div');
                divFromDs.className = 'col-xs-4 divVarSetUnit divVarFromDs';
                divFromDs.textContent = _this.store.opt[ele].dsId?AppConfig.datasource.getDSItemById(_this.store.opt[ele].dsId).alias:'';
                if (_this.store.opt[ele].source = 1)divFromDs.classname += ' active';

                divFromFile = document.createElement('div');
                divFromFile.className = 'col-xs-4 divVarSetUnit divVarFromFile';
                divFromFile.textContent = _this.store.opt[ele].file?_this.store.opt[ele].file:'';
                if (_this.store.opt[ele].source = 2)divFromFile.classname += ' active';

                divVarSet.appendChild(divVarName);
                divVarSet.appendChild(divFromDs);
                //divVarSet.appendChild(divFromFile);
                ctn.appendChild(divVarSet);
            }
        },

        initDataTitle:function(tar){
            var ctn = document.getElementById('divDataCfg');
            var divRow,title,blank,divVar,spTtlName;
            divRow = document.createElement('div');
            divRow.className = 'divRow divRowTtl';

            blank = document.createElement('div');
            blank.className = 'divUnit';
            divRow.appendChild(blank);
            for (var i = 0; i < _this.store.date[_this.period].length; i++){
                title = document.createElement('div');
                title.className = 'divTitle inlineCenter divUnit';
                title.textContent = _this.store.date[_this.period][i];
                divRow.appendChild(title)
            }
            if (tar){
                $(tar).before(divRow);
            }else{
                ctn.appendChild(divRow);
            }
        },
        initDataSet:function(){
            var $ctn = $('#divDataCfg');
            var target,$ipt,$spData;
            var index;
            $ctn.off('click').on('click','.divVar',function(e){
                target = e.currentTarget;
                $ipt = $(target).find('input');
                if ($ipt.length == 0)return;
                $('.iptData').hide();
                $spData = $(target).find('.spData').hide();
                index = $(target).parentsUntil('.divRow').children('.divData').index($(target).parent());
                $ipt.show().focus();
            });
            $ctn.off('blur').on('blur','.iptData',function(e){
                target = e.currentTarget;
                index = $(target).parentsUntil('.divRow','.divData')[0].dataset.dateDetail - 1;
                _this.store.data[_this.period][$(target).parentsUntil('.divRow','.divData').parent()[0].dataset.dateRange][target.parentNode.dataset.var][index] = target.value;
                $spData = $(target).prev().text(target.value).show();
                //localStorage.setItem('predictData',JSON.stringify(_this.store));
                $(target).hide();
            });
            var $arrIpt = $('.iptData');
            //$ctn.off('keydown').on('keydown','.iptData',function(e){
            //    e.preventDefault();
            //    target = e.currentTarget;
            //    if (e.keyCode == 9) {
            //        index = $arrIpt.index($(target));
            //        $(target).hide();
            //        if(index != $arrIpt.length - 1) {
            //            $arrIpt.eq(index + 1).show().focus();
            //        }else{
            //            $arrIpt.eq(0).show().focus();
            //        }
            //    }
            //});
        },
        initDataSure:function(){
            $('#btnDataSure').off('click').on('click',function(){
                if(!_this.getLastDate())return;
                localStorage.setItem('predictData',JSON.stringify(_this.store));
                $('#modalPredictCfg').modal('hide');
                //$('#ctnPredictCfg').hide();
                //$('#ctnPredictChart').show();
                _this.initChart();
            })
        },
        initDataReturn:function(){
            $('#btnReturn').off('click').on('click',function(){
                $('#modalPredictCfg').modal('show');
                //$('#ctnPredictChart').hide();
                //$('#ctnPredictCfg').show();
                //_this.chart && _this.chart.clear();
                //_this.chart && _this.chart.dispose();
            })
        },
        initChart:function(){
            var ctn = document.getElementById('divPredictChart');
            var xAxis = _this.getXAxis();
            var curData = _this.getCurData();
            var predictData = _this.getPredictData();
            var minData = _this.getMinData(predictData,curData);
            var diffData = _this.getDiff(predictData,curData);
            var diff = _this.getDiffOpt(diffData,{ normal:{color:'green'}},{ normal:{color:'red'}});
            var option = {
                title :{
                    text : '预测趋势',
                    textStyle:{
                        color:'white'
                    }
                },
                tooltip : {
                    trigger: 'axis',
                    formatter: function (params){
                        var date = new Date(params[2].name.replace(/-/g,'/'));
                        switch (params[2].name.split('-').length){
                            case 2:
                                date = new Date(date.setFullYear(date.getFullYear() - 1)).format('yyyy-MM');
                                break;
                            case 3:
                                date = new Date(date.setMonth(date.getMonth() - 1)).format('yyyy-MM-dd');
                                break;
                            default :
                                break;
                        }
                        return '预计相差 : '
                               + (params[2].value - params[1].value > 0 ? '-' : '+')
                               + parseFloat(params[0].value).toFixed(2) + '<br/>'
                               + date + ' : ' + parseFloat(params[2].value).toFixed(2) + '<br/>'
                               + params[3].name + ' : ' + parseFloat(params[3].value).toFixed(2) + '<br/>'
                    }
                },
                toolbox: {
                    show : false
                },
                legend: {
                    data:['当前周期','预测周期'],
                    selectedMode:false,
                    textStyle:{
                        color:'white'
                    }
                },
                xAxis : [
                    {
                        type : 'category',
                        data : xAxis,
                        splitLine:{
                            show:false
                        },
                        axisLabel: {
                            textStyle: {
                                color: 'white'
                            }
                        }
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        axisLabel: {
                            textStyle: {
                                color: 'white'
                            }
                        }
                    }
                ],
                series : [
                    {
                        name:'当前周期',
                        type:'line',
                        symbol:'emptyRectangle',
                        smooth:'true',
                        data:curData,
                        itemStyle:{
                            normal:{
                              lineStyle: {
                                width:5
                              }
                            }
                        }
                    },
                    {
                        name:'预测周期',
                        type:'line',
                        symbol:'emptyCircle',
                        smooth:'true',
                        itemStyle:{
                            normal:{
                              lineStyle: {
                                width:5,
                                type:'dashed'
                              }
                            }
                        },
                        data:predictData
                    },
                    {
                        name:'预测周期2',
                        type:'bar',
                        stack: '1',
                        barWidth: 6,
                        itemStyle:{
                            normal:{
                                color:'rgba(0,0,0,0)'
                            },
                            emphasis:{
                                color:'rgba(0,0,0,0)'
                            }
                        },
                        data:minData
                    },
                    {
                        name:'变化',
                        type:'bar',
                        stack: '1',
                        data:diff
                    }
                ]
            };
            var chart = echarts.init(ctn);
            _this.chart = chart;
            chart.setOption(option);
            _this.hasInit.initChart = true;
        },
        getLastDate:function(){
            var date = _this.store.date[_this.period];
            var periodLength = date.length;
            //var data = _this.store.data[_this.period];
            var data = _this.getDateDetail();
            var lastData = [];
            var arrDataSeries = [];
            for (var i = 0; i < data.length ;i++){
                if (_this.isDataValid(data[i].data)) {
                    if (data[i].date > new Date())continue;
                    lastData.push(data[i]);
                    if (i == data.length -1 && lastData.length >= periodLength){
                        arrDataSeries.push(lastData);
                    }
                }else{
                    if (lastData.length >= periodLength){
                        arrDataSeries.push(lastData);
                    }
                }
            }
            if (arrDataSeries.length == 0){
                alert('请至少填充连续一周期的数据以使预测准确！');
                _this.store.lastData = undefined;
            }else {
                lastData = arrDataSeries[arrDataSeries.length - 1];
                if (lastData.length < periodLength) {
                    alert('请至少填充连续一周期的数据以使预测准确！');
                    _this.store.lastData = undefined;
                } else {
                    _this.store.lastData = lastData.slice(lastData.length - periodLength);
                }
            }
            return _this.store.lastData;
        },
        isDataValid:function(obj){
            if (typeof obj != 'undefined'){
                for (var ele in obj){
                    if (isNaN(obj[ele])){
                        return false
                    }
                }
                return true;
            }
            return false;
        },
        getDateDetail:function(){
            var data = _this.store.data[_this.period];
            var date = _this.store.date[_this.period];
            var arrData = [];
            var dataUnit;
            switch (_this.period){
                case 'day':
                    for (var range in data){
                        for (var i = 0; i < date.length; i++){
                            dataUnit = {
                                date:new Date((range +'/' +  parseInt(date[i])).replace(/-/g,'/')),
                                data:{
                                }
                            };
                            for(var ele in _this.store.opt){
                               dataUnit.data[ele] = data[range][ele][i]
                            }
                            arrData.push(dataUnit);
                        }
                    }
                    break;
                case 'month':
                    for (var range in data){
                        for (var i = 0; i < date.length; i++){
                            dataUnit = {
                                date:new Date((range + '/'+ parseInt(date[i])).replace(/-/g,'/')),
                                data:{
                                }
                            };
                            for(var ele in _this.store.opt){
                               dataUnit.data[ele] = data[range][ele][i]
                            }
                            arrData.push(dataUnit);
                        }
                    }
                    break;
                default :
                    break;
            }
            arrData.sort(function(a,b){
                return a.date - b.date
            });
            _this.store.seriesData = arrData;
            return arrData;
        },
        getXAxis:function(){
            var xAxis = [];
            var rdate;
            var format;
            switch (_this.period){
                case 'day':
                    format = 'MM-dd';
                    for (var i= 0 ; i < _this.store.lastData.length; i++){
                        rdate = new Date(_this.store.lastData[i].date.valueOf());
                        xAxis.push(new Date(rdate.setMonth(rdate.getMonth() + 1)).format(format));
                    }
                    break;
                case 'month' :
                    format = 'yyyy-MM';
                    for (var i= 0 ; i < _this.store.lastData.length; i++){
                        rdate = new Date(_this.store.lastData[i].date.valueOf());
                        xAxis.push(new Date(rdate.setFullYear(rdate.getFullYear() + 1)).format(format));
                    }
                    break;
                default :
                    break;
            }
            return xAxis;
        },
        getCurData:function(){
            var curData = [];
            for (var i= 0 ; i < _this.store.lastData.length; i++){
                curData.push(parseFloat(parseFloat(_this.store.lastData[i].data.y).toFixed(2)));
            }
            return curData;
        },
        getPredictData:function(){
            var predictData = [];
            var para = _this.calcPredictPara(_this.store.data);
            var initIndex = 0;
            var initData;
            var format;
            switch (_this.period){
                case 'day':
                    format = 'dd';
                    break;
                case 'month':
                    format ='MM';
                    break;
                default:
                    break;
            }
            for (var i = _this.store.seriesData.length - 1; i >= 0 ;i--){
                if (_this.store.seriesData[i].date == _this.store.lastData[_this.store.lastData.length - 1].date){
                    initIndex = i + 1;
                    break;
                }
            }
            for (var i= 0 ; i < _this.store.lastData.length; i++){
                initData = _this.store.seriesData[i + initIndex];
                if (initData.data.x1) {
                    predictData.push(para.a + initData.data.x1 * para.b1 + initData.date.format(format) * para.b2)
                }else{
                    predictData.push(para.a + _this.store.lastData[i].data.x1 * para.b1 + initData.date.format(format) * para.b2)
                }
            }
            return predictData;
        },
        calcPredictPara:function(){
            //公式：y = a + b1x1 +b2x2
            //x1：energy ，x2：detail
            var data = _this.store.seriesData;
            var date = _this.store.date[_this.period];
            var totalData = [];
            var format;
            switch (_this.period){
                case 'day':
                    format = 'dd';
                    break;
                case 'month':
                    format ='MM';
                    break;
                default:
                    break;
            }
            for (var i = 0; i < data.length; i++){
                if(_this.isDataValid(data[i].data)){
                    if (data[i].date > new Date())continue;
                    totalData.push({
                       y:parseFloat(data[i].data.y),
                       x1:parseInt(data[i].data.x1),
                       x2:parseInt(data[i].date.format(format))
                    })
                }
            }
            var ySum = 0,x1Sum = 0,x2Sum = 0,x1x2Sum = 0,x1SqrSum = 0,x2SqrSum = 0,x1ySum = 0,x2ySum = 0;
            var n = totalData.length;
            for (var i = 0; i < totalData.length;i++){
                ySum += totalData[i].y;
                x1Sum += totalData[i].x1;
                x2Sum += totalData[i].x2;
                x1x2Sum += totalData[i].x1 * totalData[i].x2;
                x1SqrSum += totalData[i].x1 * totalData[i].x1;
                x2SqrSum += totalData[i].x2 * totalData[i].x2;
                x1ySum += totalData[i].y * totalData[i].x1;
                x2ySum += totalData[i].y * totalData[i].x2;
            }
            var D,Da,Db1,Db2;
            D = [
                [n,x1Sum,x2Sum],
                [x1Sum,x1SqrSum,x1x2Sum],
                [x2Sum,x1x2Sum,x2SqrSum]
            ];
            Da = [
                [ySum,x1Sum,x2Sum],
                [x1ySum,x1SqrSum,x1x2Sum],
                [x2ySum,x1x2Sum,x2SqrSum]
            ];
            Db1 = [
                [n,ySum,x2Sum],
                [x1Sum,x1ySum,x1x2Sum],
                [x2Sum,x2ySum,x2SqrSum]
            ];
            Db2 = [
                [n,x1Sum,ySum],
                [x1Sum,x1SqrSum,x1ySum],
                [x2Sum,x1x2Sum,x2ySum]
            ];
            if(calcDetVal(D) == 0){
                return {
                    a:totalData[0].y,
                    b1:0,
                    b2:0
                }
            }else {
                return {
                    a: calcDetVal(Da) / calcDetVal(D),
                    b1: calcDetVal(Db1) / calcDetVal(D),
                    b2: calcDetVal(Db2) / calcDetVal(D)
                };
            }
            function calcDetVal(Det){
                var val = 0;
                val = Det[0][0]*Det[1][1]*Det[2][2] + Det[0][1]*Det[1][2]*Det[2][0] + Det[0][2]*Det[1][0]*Det[2][1]
                - Det[0][2]*Det[1][1]*Det[2][0] - Det[0][1]*Det[1][0]*Det[2][2] - Det[0][0]*Det[1][2]*Det[2][1];
                return val;
            }
        },
        getMinData:function(arrData1,arrData2){
            var MinData = [];
            for(var i = 0 ; i< arrData1.length; i++) {
                if (arrData1[i] > arrData2[i]){
                    MinData.push(arrData2[i])
                }else{
                    MinData.push(arrData1[i])
                }
            }
            return MinData;
        },
        getDiff:function(arrData1,arrData2){
            var arrDiff = [];
            var arrOpt = [];
            for(var i = 0 ; i< arrData1.length; i++) {
                arrDiff.push(Math.abs(arrData1[i] - arrData2[i]));
                if (arrData1[i] > arrData2[i]){
                    arrOpt.push(0)
                }else{
                    arrOpt.push(1)
                }
            }
            return {data:arrDiff,opt:arrOpt};
        },
        getDiffOpt:function(data,style0,style1){
            var arrDiffOpt = [];
            for (var i = 0; i < data.data.length ;i++){
                if (data.opt[i]){
                    arrDiffOpt.push({value : data.data[i], itemStyle:style1})
                }else{
                    arrDiffOpt.push({value : data.data[i], itemStyle:style0})
                }
            }
            return arrDiffOpt;
        }
    };
    return PredictModule;
})();
new PredictModule().show();