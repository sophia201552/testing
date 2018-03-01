var modalConfigurePane = (function(){
    var _this;
    function modalConfigurePane(container,screen,modalType){
        _this = this;
        this.container = container;
        this.screen = screen;
        this.modalType = modalType;
        //data analysis or dashboard
        this.templateObj = undefined;
        this.optionType = undefined;
        //optionType--True:New chart/False:load exist option;
        this.option = undefined;
        this.dataLose = undefined;
        this.editorData = undefined;
        this.ue = undefined;
        //option = {
        //    modeUsable: []
        //    allDataNeed; bool
        //    rowDataType: []
        //    dataTypeMaxNum: []
        //    templateType; str
        //    optionPara:{
        //                dataItem:
        //                option;
        //                } for new
        //    optionPara:{
        //                mode:''
        //                startTime:
        //                endTime:
        //                interval:
        //                dataItem:{dsId,dsName,dsType
        //                          }
        //                } for exist
        //}
        this.UILoadPromise = undefined;
    }
    modalConfigurePane.prototype = {
        show: function(){
            this.UILoadPromise = WebAPI.get("/static/views/observer/widgets/modalConfigurePane.html").done(function (resultHtml) {
                _this.container.innerHTML += resultHtml;
                if (_this.modalType == "dataAnalysis"){
                    document.getElementById('startConfig').setAttribute('i18n','modalConfig.btnStartConfig.TYPE1');
                }else if(_this.modalType == "dashboard"){
                    document.getElementById('startConfig').setAttribute('i18n','modalConfig.btnStartConfig.TYPE2');
                }
                I18n.fillArea($('#modalConfig'));
            });
        },
        showModalInit: function(optionType,option,templateObj){
            this.optionType = optionType;
            this.option = option;
            this.templateObj = templateObj;
            //if(!_this.option.dataTypeMaxNum){
            //    _this.option.dataTypeMaxNum = [];
            //    for (var i = 0;i<this.option.rowDataType.length;i++){
            //        _this.option.dataTypeMaxNum[i] = 5
            //    }
            //}else{
            //    if (_this.option.dataTypeMaxNum.length != _this.option.rowDataType.length){
            //        for (var i = _this.option.dataTypeMaxNum.length;i<this.option.rowDataType.length;i++){
            //            _this.option.dataTypeMaxNum[i] = _this.option.dataTypeMaxNum[_this.option.dataTypeMaxNum.length - 1]
            //        }
            //    }
            //}
            
            if (this.UILoadPromise && this.UILoadPromise.state() === 'pending') {

            } else {
                this.UILoadPromise = $.Deferred().resolve();
            }

            this.UILoadPromise.done(function () {
                this.init();
                if (_this.option.templateType == "ModalNote") {
                    _this.initEditor();
                }
                $('#modalConfig').modal('show');
            }.bind(this));
            
        },
        init: function () {
            var $modalConfig = $('#modalConfig');
            var $inputRealTimeInterval = $('#inputRealTimeInterval')
            var $labelText = $('#divRealTimeInterval label');
            var $option30s = $('#inputRealTimeInterval option[value = "30s"]');
            var $option10m = $('#inputRealTimeInterval option[value = "10m"]');
            var $option30m = $('#inputRealTimeInterval option[value = "30m"]');
            var $optionh1 = $('#inputRealTimeInterval option[value = "h1"]');
            var $optiond1 = $('#inputRealTimeInterval option[value = "d1"]');
            var $optionM1 = $('#inputRealTimeInterval option[value = "M1"]');
            $modalConfig.off('show.bs.modal').on('show.bs.modal', function (e) {
                if(e.namespace !== 'bs.modal' ) return true;
                _this.initOption();
                _this.initConfigData();
                $('#inputAddGroup').click(function(e){
                    $(e.target).focus();
                });
                if(_this.modalType =="dashboard"){
                    _this.toggleDataSource(true);
                }
                if (_this.templateObj instanceof ModalRealtimeLineOutdoor || _this.templateObj instanceof ModalRealtimeBarSub){//当配置框添加的为实时折线图/柱图，改变一些样式
                    if(!_this.templateObj.entity.modal.option){
                        $inputRealTimeInterval.find('option[value= "m5"]').attr('selected' ,true);//默认选中m5
                    }else if (_this.templateObj.entity.modal.option.timeFormat){
                        $inputRealTimeInterval.find('option[value=' +_this.templateObj.entity.modal.option.timeFormat + ']').attr('selected' ,true);
                    }
                    $labelText.text(I18n.resource.modalConfig.option.LABEL_INTERVAL_ONE);
                    $optionh1.show();
                    $optiond1.show();
                    $optionM1.show();
                    $option30s.hide();
                    $option10m.hide();
                    $option30m.hide();
                }else {//不是实时折线图清空改变的样式
                    $labelText.text(I18n.resource.modalConfig.option.LABEL_REAL_TIME_INTERVAL_ONE);
                    $optionh1.hide();
                    $optiond1.hide();
                    $optionM1.hide();
                    $option30s.show();
                    $option10m.show();
                    $option30m.show();
                }
                if (_this.option.modeUsable && _this.option.modeUsable[0] && _this.option.templateType === 'ModalAppGauge') {
                    $('#modalConfig .modal-body>.row>div').css('display', 'none');
                    if(!_this.templateObj.entity.modal.option||(_this.templateObj.entity.modal.option&&!_this.templateObj.entity.modal.option.guageBgColor)){
                        $('.guageBgColor').html('<input type="color" value="#2F91E8" data-key="guageBgColor"/>');
                    }
                    $('#divAppGauge').css('display', 'block');
                }
                if (_this.option.modeUsable && _this.option.modeUsable[0] && _this.option.templateType === 'ModalAppHistory') {
                    $('#modalConfig .modal-body>.row>div').css('display', 'none');
                    $('#divAppHistory').css('display', 'block');
                }
                if (_this.option.modeUsable && _this.option.modeUsable[0] && _this.option.templateType === 'ModalAppDiagRanking') {
                    $('#modalConfig .modal-body>.row>div').css('display', 'none');
                    $('.chartPointCog').css("pointer-events","none");
                    $('#appDiagRank').css('display', 'block');
                }
                if (_this.option.modeUsable && _this.option.modeUsable[0] &&( _this.option.templateType === 'ModalAPPMonthHistory'||_this.option.templateType ==='ModalAppPie')) {
                     $('#modalConfig .modal-body>.row>div').css('display', 'none');
                }
                if (_this.option.modeUsable && _this.option.modeUsable[0] && _this.option.templateType === 'ModalKpiOverview') {
                    $('#modalConfig .modal-body>.row>div').css('display', 'none');
                    $('.chartPointCog').css("pointer-events","none");
                }
                if (_this.option.modeUsable && _this.option.modeUsable[0] && _this.option.templateType === 'ModalDataMonitorList') {
                    $('#modalConfig .modal-body>.row>div').css('display', 'none');
                    $('.chartPointCog').css("pointer-events","none");
                }
            });
            $modalConfig.off('shown.bs.modal').on('shown.bs.modal', function () {
                _this.initTime();
                //$('.rowDataType').each(function(){
                //    _this.initDataTypeWidth($(this));
                //});
                _this.initDrag();
                _this.initConfigStart();
            });
            $modalConfig.off('hidden.bs.modal').on('hidden.bs.modal', function () {
                $modalConfig.find('#dataConfig').html('<div><span I18n="modalConfig.data.DATA_CONFIG_TITLE"></span></div>');
                I18n.fillArea($modalConfig.find('#dataConfig'));
                if(_this.modalType =="dashboard"){
                    _this.toggleDataSource(false);
                }
                $('#divChartPointCog').css('display','none');
                _this.dataLose = undefined;
            });
        },
        toggleDataSource: function(bool){
            var ele = $('#paneContent')[0];
            var colCount;

            if (!ele) {
                return;
            }
            colCount = ele.classList.contains('col-sm-10');

            if(bool && colCount){
                ele = document.getElementById('rightCt');
                ele && ele.click();
            }
            if(!bool && !colCount){
                ele = document.getElementById('rightCt');
                ele && ele.click();
            }
        },
        initDataTypeWidth: function(ele){
            if (window.innerWidth > 1200 ){
                if( ele.outerWidth() < ele.parent().outerWidth() / 4){
                    ele.addClass('col-lg-3');
                }else if(ele.outerWidth() < ele.parent().outerWidth() / 2){
                    ele.addClass('col-lg-6');
                }else if (ele.outerWidth() < ele.parent().outerWidth() * 3 / 4){
                    ele.addClass('col-lg-9');
                }else{
                    ele.addClass('col-lg-12');
                }
            }else{
                if(ele.outerWidth() < ele.parent().outerWidth() / 3){
                    ele.addClass('col-xs-4');
                }else if(ele.outerWidth() < ele.parent().outerWidth() * 2 / 3){
                    ele.addClass('col-xs-8');
                }else{
                    ele.addClass('col-xs-12');
                }
            }
        },
        initOption: function(){
            var $inputMode = $('#inputMode');
            var $divMode = $inputMode.parent();

            var $inputInterval = $('#inputInterval');
            var $divInterval = $inputInterval.parent();

            var $divInputGroupPeriod = $('#divInputGroupPeriod');
            var $divPeriod = $divInputGroupPeriod.parent();
            var $inputPeriodUnit = $('#inputPeriodUnit');
            var $inputPeriodValue = $('#inputPeriodValue');
            var $inputPeriodDropDown = $('#inputPeriodDropDown');
            var $divPeriodDropDown = $inputPeriodDropDown.parent();

            var $divInputGroupTimeRange = $('#divInputGroupTimeRange');
            var $divTimeRange = $divInputGroupTimeRange.parent();
            var $inputTimeStart = $('#inputTimeStart');
            var $inputTimeEnd = $('#inputTimeEnd');

            var $gaugeMode = $('#gaugeMode');
            var $divGaugeMode = $gaugeMode.parent();
            var $divGauge = $('#divGauge');
            var $gaugeLowerLimit = $('#gaugeLowerLimit');
            var $gaugeUpperLimit = $('#gaugeUpperLimit');
            var $normalLowerLimit = $('#normalLowerLimit');
            var $normalUpperLimit = $('#normalUpperLimit');

            var $inputComparePeriod = $('#inputComparePeriod');
            var $divComparePeriod = $inputComparePeriod.parent();
            var $inputCompareDate1 = $('#inputCompareDate1');
            var $inputCompareDate2 = $('#inputCompareDate2');
            var $divCompareDate = $('#divCompareDate');

            var $inputRealTimeInterval = $('#inputRealTimeInterval');
            var $divRealTimeInterval = $inputRealTimeInterval.parent();

            var $divHistoryRange = $('#divHistoryRange');
            var $inputHistoryRange = $('#inputHistoryRange');
            //var $divModeSelect = $('#divModeSelect');
            //var $divDefaultMode = $('#divDefaultMode');

            var $divChartSelect = $('#divChartSelect');


            var $divAppHistory = $("#divAppHistory");
            var i;
            var totalModeType = {
                    easy: [$divPeriodDropDown],
                    fixed: [$divInterval, $divTimeRange],
                    recent: [$divInterval, $divPeriod],
                    realTime: [],
                    easyEnergy: [$divPeriodDropDown],
                    realTimeDashboard: [$divRealTimeInterval],
                    easyCompareAnalyz: [$divCompareDate],
                    easyCompare: [$divComparePeriod],
                    easyCompareToggle: [$divComparePeriod,$divChartSelect],
                    compareSensor: [$divInterval, $divComparePeriod, $divCompareDate],
                    compareMeter: [$divInterval, $divComparePeriod, $divCompareDate],
                    gauge: [$divGauge, $divGaugeMode],
                    weather: [],
                    easyHistory: [$divHistoryRange],
                    easyHistorySelect: [$divHistoryRange,$divChartSelect],
                    multiple: [$divRealTimeInterval],
                    modalRankNormal: [$divPeriodDropDown]
                }
            ;

            var isInit = true;
            //模式选择初始化
            var $dataConfig = $('#dataConfig');
            var $startConfig = $('#startConfig');

            $dataConfig.css('display','block');
            $startConfig.removeClass('alwaysEnable');
            $inputMode.children().css('display','none');
            var modeSelectInit = false;
            if (_this.option.modeUsable && _this.option.modeUsable[0] &&( _this.option.templateType === 'ModalAppGauge'|| _this.option.templateType==='ModalAppPie' || _this.option.templateType === 'ModalAppDiagRanking' || _this.option.templateType === 'ModalAPPMonthHistory' || _this.option.templateType === 'ModalKpiOverview' || _this.option.templateType === 'ModalDataMonitorList')) {
                return;
            }
            if (_this.option.modeUsable && _this.option.modeUsable[0] && _this.option.templateType === 'ModalAppHistory') {
                $divAppHistory.css('display', 'block');
                var startTime = new Date().format("yyyy-MM-dd 00:00:00");
                var endTime = new Date().format("yyyy-MM-dd HH:mm:ss");
                $divAppHistory.find("#startTime").val(startTime);
                $divAppHistory.find("#endTime").val(endTime);
                var modalOption = _this.templateObj.entity.modal.option;
                // $('#divAppHistoryTitle').val(gaugeTitleVal); return;
                return;
            }
            for (i = 0; i < _this.option.modeUsable.length; i++) {
                $inputMode.children('option[value=' + _this.option.modeUsable[i] + ']').css('display', 'block');
                if (_this.optionType) {
                    if (sessionStorage.getItem('mode') == _this.option.modeUsable[i] && !modeSelectInit) {
                        $inputMode.val(_this.option.modeUsable[i]);
                        modeSelectInit = true;
                    }
                }else{
                    if (_this.option.modeUsable[i] == _this.option.optionPara.mode && !modeSelectInit) {
                        $inputMode.val(_this.option.optionPara.mode);
                        modeSelectInit = true;
                    }
                }
            }
            if (!modeSelectInit){
                $inputMode.val(_this.option.modeUsable[0]);
            }
            function initMode(mode){
                sessionStorage.setItem('mode', $inputMode.val());
                $divMode.siblings().css('display','none');
                $inputInterval.children().removeClass('forbid');
                for (var i = 0;i < totalModeType[mode].length;i++){
                    totalModeType[mode][i].css('display','block');
                }
                switch (mode) {
                    case 'easy':
                        initPeriodDropDown(mode);
                        initInterval(mode);
                        break;
                    case 'recent':
                        initInterval(mode);
                        break;
                    case 'easyEnergy':
                        initPeriodDropDown(mode);
                        initInterval(mode);
                        break;
                    case 'weather':
                        $dataConfig.css('display','none');
                        $startConfig.addClass('alwaysEnable');
                        break;
                    case 'easyCompareAnalyz':
                        $inputComparePeriod.val('month');
                        //initCompareDate();
                        break;
                    case 'easyCompare' :
                    case 'easyCompareToggle' :
                        $inputComparePeriod.val('day');
                        break;
                    default :
                        break;
                }
            }
            //间隔单位选择初始化
            if(this.optionType){
                if(sessionStorage.getItem('interval') != null ){
                    if ($inputInterval.children('option[value="'+ sessionStorage.getItem('interval') + '"]').hasClass('forbid')){
                        $inputInterval.val($inputInterval.children(':not(.forbid)').first());
                    }else{
                        $inputInterval.val(sessionStorage.getItem('interval'));
                    }
                }else{
                    sessionStorage.setItem('interval',$inputInterval.val());
                }
            }else{
                if(_this.option.optionPara.interval){
                    $inputInterval.val(_this.option.optionPara.interval);
                }else{
                    $inputInterval.val($inputInterval.children(':not(.forbid)').first());
                }
                //设置时间输入框精确度
                this.setTimePrecision($inputInterval.val(), $inputTimeStart, $inputTimeEnd);
            }
            $inputInterval.off('change').change(function(e){
                sessionStorage.setItem('interval', $(e.target).val());
                //设置时间输入框时间精度
                _this.setTimePrecision(this.value, $inputTimeStart, $inputTimeEnd)
            });
            function initInterval(mode) {
                $inputInterval.children().addClass('forbid').attr('selected',false);
                if (mode == 'recent') {
                    switch ($inputPeriodUnit.children(':selected').val()) {
                        case 'second' :
                            firstSelect = 'm5';
                            secondSelect = 'm1';
                            break;
                        case 'minute' :
                            firstSelect = 'm5';
                            secondSelect = 'm1';
                            break;
                        case 'hour':
                            firstSelect = 'h1';
                            secondSelect = 'm5';
                            break;
                        case 'day' :
                            firstSelect = 'd1';
                            secondSelect = 'h1';
                            break;
                        case 'month' :
                            firstSelect = 'M1';
                            secondSelect = 'd1';
                            break;
                    }
                    $inputInterval.find('option[value="' + secondSelect + '"]').removeClass('forbid');
                }
                if (mode == 'easy') {
                    //sessionStorage.setItem('periodDropDown', $inputPeriodDropDown.val());
                    switch ($inputPeriodDropDown.val()) {
                        case 'today' :
                            firstSelect = 'h1';
                            break;
                        case 'yesterday' :
                            firstSelect = 'h1';
                            break;
                        case 'thisWeek':
                            firstSelect = 'd1';
                            break;
                        case 'lastWeek' :
                            firstSelect = 'd1';
                            break;
                        case 'thisYear' :
                            firstSelect = 'M1';
                            break;
                    }
                }
                $inputInterval.find('option[value="' + firstSelect + '"]').removeClass('forbid').attr('selected',true);
                if(isInit && _this.option.optionPara.format){
                    $inputInterval.find('option[value="' + _this.option.optionPara.format + '"]').removeClass('forbid');
                }
                sessionStorage.setItem('interval',$inputInterval.val());
            }
            //周期初始化
            var firstSelect,secondSelect;
            if(this.optionType) {
                if (sessionStorage.getItem('periodValue')){
                    $inputPeriodValue.val(sessionStorage.getItem('periodValue'));
                }
                if (sessionStorage.getItem('periodUnit')){
                    $inputPeriodUnit.val(sessionStorage.getItem('periodUnit'));
                }
                if (sessionStorage.getItem('periodDropDown')){
                    if ($inputPeriodDropDown.children('option[value="'+ sessionStorage.getItem('periodDropDown') + '"]').hasClass('forbid')){
                        $inputPeriodDropDown.val($inputPeriodDropDown.children(':not(.forbid)').first());
                    }
                    $inputPeriodDropDown.val(sessionStorage.getItem('periodDropDown'));
                }
            }else{
                if(this.option.optionPara.timeRecent && this.option.optionPara.timeRecent.val && this.option.optionPara.timeRecent.unit){
                    $inputPeriodValue.val(this.option.optionPara.timeRecent.val);
                    $inputPeriodUnit.val(this.option.optionPara.timeRecent.unit);
                    $inputPeriodDropDown.val(this.option.optionPara.timeRecent.unit);
                }
            }
            $inputPeriodValue.off('change').change(function(e){
                sessionStorage.setItem('periodValue', e.target.value)
            });
            $inputPeriodUnit.off('change').change(function(e){
                sessionStorage.setItem('periodUnit',e.target.value);
               initInterval($inputMode.val());
            });
            $divPeriodDropDown.off('change').change(function(e){
                sessionStorage.setItem('periodDropDown',e.target.value);
                initInterval($inputMode.val());
            });

            //快速配置周期初始化
            function initPeriodDropDown(mode){
                $inputPeriodDropDown.children('').removeClass('forbid');
                if(mode == 'easy'){
                    $inputPeriodDropDown.children().eq(1).addClass('forbid');
                }else if(mode == 'easyEnergy') {
                    $inputPeriodDropDown.children().eq(2).addClass('forbid');
                    $inputPeriodDropDown.children().eq(4).addClass('forbid');
                    $inputPeriodDropDown.children().eq(5).addClass('forbid');
                }
                if(isInit && typeof _this.option.optionPara.timeRecent == 'string'){
                    $inputPeriodDropDown.children('[value="'+ _this.option.optionPara.timeRecent +'"]')[0].selected = true;
                }
            }
            //时间范围和对比时间范围初始化
            if(_this.optionType && sessionStorage.getItem('anlzTimeStart') != null){
                $inputTimeStart.val(sessionStorage.getItem('anlzTimeStart'));
                $inputCompareDate1.val(sessionStorage.getItem('anlzTimeStart'));
            }else{
                $inputTimeStart.val(new Date(_this.option.optionPara.startTime).format(_this.getDateFmtByInputFmt($inputTimeStart[0].dataset.format)));
                $inputCompareDate1.val(new Date(_this.option.optionPara.startTime).format(_this.getDateFmtByInputFmt($inputCompareDate1[0].dataset.format)));
            }
            $inputTimeStart.off('change').change(function(e){
                if (e.target.value !=''){
                    sessionStorage.setItem('anlzTimeStart', e.target.value)
                }
            });
            $inputCompareDate1.off('change').change(function(e){
                if (e.target.value !=''){
                    sessionStorage.setItem('anlzTimeStart', e.target.value)
                }
            });
            if(_this.optionType && sessionStorage.getItem('anlzTimeEnd') != null) {
                $inputTimeEnd.val(sessionStorage.getItem('anlzTimeEnd'));
                $inputCompareDate2.val(sessionStorage.getItem('anlzTimeEnd'));
            }else {
                $inputTimeEnd.val(new Date(_this.option.optionPara.endTime).format(_this.getDateFmtByInputFmt($inputTimeEnd[0].dataset.format)));
                $inputCompareDate2.val(new Date(_this.option.optionPara.endTime).format(_this.getDateFmtByInputFmt($inputCompareDate2[0].dataset.format)));//_this.option.optionPara.endTime
            }
            $inputTimeEnd.off('change').change(function(e){
                if (e.target.value !=''){
                    sessionStorage.setItem('anlzTimeEnd', e.target.value)
                }
            });
            $inputCompareDate2.off('change').change(function(e){
                if (e.target.value !=''){
                    sessionStorage.setItem('anlzTimeEnd', e.target.value)
                }
            });
            //历史同比时间初始化
            if (_this.option.optionPara.timeType && $inputMode.val() == 'easyCompareAnalyz'){
                $inputComparePeriod.val(_this.option.optionPara.timeType);
            }else if (sessionStorage.getItem('comparePeriodAnalyz') != null){
                $inputComparePeriod.val(sessionStorage.getItem('comparePeriodAnalyz'));
            }

            if (_this.option.optionPara.timeType && ($inputMode.val() == 'easyCompare' || $inputMode.val() == 'easyCompareToggle')){
                $inputComparePeriod.val(_this.option.optionPara.timeType);
            }else if (sessionStorage.getItem('comparePeriod') != null){
                $inputComparePeriod.val(sessionStorage.getItem('comparePeriod'));
            }
            $inputComparePeriod.change(function(e){
                sessionStorage.setItem('comparePeriod',$inputComparePeriod.val());
            });

            //gaugeMode初始化
            if(sessionStorage.getItem('gaugeMode') != null) {
                $gaugeMode.val(sessionStorage.getItem('gaugeMode'))
            }
            $gaugeMode.change(function(){
                sessionStorage.setItem('gaugeMode',$gaugeMode.val())
            });
            initGaugeMode();
            $gaugeMode.change(function(){
                initGaugeMode();
            });
            function initGaugeMode(){
                var green = '<span class="input-group-addon gaugeGreen" i18n="modalConfig.option.GAUGE_GREEN"></span>';
                var red = '<span class="input-group-addon gaugeRed" i18n="modalConfig.option.GAUGE_RED"></span>';
                if($gaugeMode.val() == 'high'){
                    $gaugeLowerLimit.next().remove();
                    $gaugeLowerLimit.after(green);
                    $normalUpperLimit.next().remove();
                    $normalUpperLimit.after(red);
                }else if($gaugeMode.val() == 'low'){
                    $gaugeLowerLimit.next().remove();
                    $gaugeLowerLimit.after(red);
                    $normalUpperLimit.next().remove();
                    $normalUpperLimit.after(green);

                }
                I18n.fillArea($('#divGauge'));
            }
            if(_this.option.optionPara.scaleList){
                _this.option.optionPara.scaleList.sort(function(a,b){
                        return a > b ? 1: -1
                    });
            }
            if(_this.optionType && sessionStorage.getItem('gaugeLowerLimit') != null){
                $gaugeLowerLimit.val(sessionStorage.getItem('gaugeLowerLimit'))
            }else if(!_this.optionType && _this.option.optionPara.scaleList){
                $gaugeLowerLimit.val(_this.option.optionPara.scaleList[0])
            }
            $gaugeLowerLimit.change(function(){
                sessionStorage.setItem('gaugeLowerLimit',$gaugeLowerLimit.val())
            });
            if(_this.optionType && sessionStorage.getItem('gaugeUpperLimit') != null){
                $gaugeUpperLimit.val(sessionStorage.getItem('gaugeUpperLimit'))
            }else if(!_this.optionType && _this.option.optionPara.scaleList){
                $gaugeUpperLimit.val(_this.option.optionPara.scaleList[3])
            }
            $gaugeUpperLimit.change(function(){
                sessionStorage.setItem('gaugeUpperLimit',$gaugeUpperLimit.val())
            });
            if(_this.optionType && sessionStorage.getItem('normalLowerLimit') != null){
                $normalLowerLimit.val(sessionStorage.getItem('normalLowerLimit'))
            }else if(!_this.optionType && _this.option.optionPara.scaleList){
                $normalLowerLimit.val(_this.option.optionPara.scaleList[1])
            }
            $normalLowerLimit.change(function(){
                sessionStorage.setItem('normalLowerLimit',$normalLowerLimit.val())
            });
            if(_this.optionType && sessionStorage.getItem('normalUpperLimit') != null){
                $normalUpperLimit.val(sessionStorage.getItem('normalUpperLimit'))
            }else if(!_this.optionType && _this.option.optionPara.scaleList){
                $normalUpperLimit.val(_this.option.optionPara.scaleList[2])
            }
            $normalUpperLimit.change(function(){
                sessionStorage.setItem('normalUpperLimit',$normalUpperLimit.val())
            });
            //dashboard实时图刷新周期初始化
            if (_this.option.optionPara.timeType && ($inputMode.val() == 'realTimeDashboard'|| $inputMode.val() == 'multiple')){
                $inputHistoryRange.val(_this.option.optionPara.timeType);
            }else if (sessionStorage.getItem('historyRange') != null){
                $inputHistoryRange.val(sessionStorage.getItem('historyRange'));
            }
            $inputHistoryRange.change(function(){
                sessionStorage.setItem('historyRange',$inputHistoryRange.val());
            });

            //快速配置历史范围初始化
            if (_this.option.optionPara.timeType && ($inputMode.val() == 'easyHistory' || $inputMode.val() == 'easyHistorySelect')){
                $inputHistoryRange.val(_this.option.optionPara.timeType);
            }else if (sessionStorage.getItem('historyRange') != null){
                $inputHistoryRange.val(sessionStorage.getItem('historyRange'));
            }
            $inputHistoryRange.change(function(){
                sessionStorage.setItem('historyRange',$inputHistoryRange.val());
            });
            initMode($inputMode.val());
            $inputMode.off('change').change(function(e){
                isInit = false;
                initMode($inputMode.val())
            });


            if ('AnlzTendency' == this.option.templateType) {
                $('#dataConfig').css('height', '100%');
                $('#modifyChart').show();
                if (this.optionType) {  // new
                    $('#modifyChartTitle').val('');
                    $('#modifyChartYMax').val('');
                    $('#modifyChartYMin').val('');
                    $('#modifyChartYMark').val('');
                    $('#modifyChartYUnitName').val('');
                    //$('#modifyChartYUnitEx').val('');
                    $('#modifyChartYUnitEx')[0].selectedIndex =0;
                }
                else {  // open
                    var opt = _this.screen.curModal.chartOption;
                    if (opt) {
                        $('#modifyChartTitle').val(opt.chartName);
                        $('#modifyChartYMax').val(opt.yMax);
                        $('#modifyChartYMin').val(opt.yMin);
                        $('#modifyChartYMark').val(opt.yMark);

                        var yUnit = opt.yUnit;
                        var flag = ' ';
                        var index = yUnit.indexOf(flag);
                        $('#modifyChartYUnitName').val(yUnit.substr(0, index));
                        if (yUnit.substr(index + 1)) {
                            $('#modifyChartYUnitEx').val(yUnit.substr(index + 1));
                        } else {
                            $('#modifyChartYUnitEx')[0].selectedIndex = 0;
                        }
                        
                    }
                }
            }
            else {
                $('#dataConfig').css('height', '350px');
                $('#modifyChart').hide();
            }
            $('#modifyChart .anlsModifyCobfig').off('click').click(function () {
                if ($('#modifyChart .row').is(':visible')) {
                    $('#modifyChart .row').hide();
                } else {
                    $('#modifyChart .row').show();
                }
            });
        },
        initConfigData: function(){
            var $dataConfig = $('#dataConfig');
            var $divAppGauge = $('#divAppGauge');
            var $appDiagRank = $('#appDiagRank');
            $dataConfig.html('<div><span I18n="modalConfig.data.DATA_CONFIG_TITLE"></span></div>');
            //var strDataTitle = '<span>'+ I18n.resource.modalConfig.data.DATA_CONFIG_TITLE_TYPE1 + '</span>';
            //var strTempDataMaxNum = '<span>'+ I18n.resource.modalConfig.data.DATA_TYPE_MAX_NUM + '</span>';
            //var arrTempDataMaxNum = [];

            //for (var i = 0;i < _this.option.dataTypeMaxNum.length; ++i){
            //    arrTempDataMaxNum.push(strTempDataMaxNum.replace('<%maxNum%>',_this.option.dataTypeMaxNum[i]));
            //}
            var strConfigModalBody = $dataConfig.html();
            var strDataTypeShowName = [];
            if(_this.option.rowDataTypeShowName){
                for (var i = 0;i < _this.option.rowDataType.length;++i) {
                    strDataTypeShowName.push(_this.option.rowDataTypeShowName[_this.option.rowDataType[i]])
                }
            }else{
                strDataTypeShowName = _this.option.rowDataType;
            }
            for (var i = 0; i < _this.option.rowDataType.length; ++i) {
                strConfigModalBody += '<div class="divConfigData" dataType="' + _this.option.rowDataType[i] + '">\
                                                <div class="dataTypeName">' +
                                                strDataTypeShowName[i]  +
                                                '</div>\
                                                <span class="chartPointCog glyphicon glyphicon-cog grow"></span>\
                                                <div class="row rowDataValue"><div class="dataDragTip col-lg-3 col-xs-4"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span></div></div>\
                                    </div>';
            }
            $dataConfig.html(strConfigModalBody);
            if(_this.option.modeUsable && _this.option.modeUsable[0] && _this.option.templateType ==='ModalAppDiagRanking'){
                $appDiagRank.css('display', 'block');
                var rankType;
                if(_this.templateObj.entity.modal.option){
                    rankType = _this.templateObj.entity.modal.option.diagType?_this.templateObj.entity.modal.option.diagType:'fault';
                }else{
                    rankType = 'fault';
                }
                $('#appDiagRank').find('select').val(rankType);
            }
            if(_this.option.modeUsable && _this.option.modeUsable[0] && _this.option.templateType ==='ModalAppGauge'){
                $divAppGauge.css('display', 'block');
                var modalOption = _this.templateObj.entity.modal.option;
                var gaugeTitleVal = modalOption ? modalOption.guageTitle: '';
                $('#appGuageTitle').val(gaugeTitleVal);
                //$('#appGuageFulTitle').val(modalOption ? modalOption.guageFulTitle: '');
                $('#appGuageDot').val(modalOption ? modalOption.guageFixed: '');
                $('#appGuageUnit').val(modalOption ? modalOption.guageUnit: '');
                var guageText = modalOption ? modalOption.timeLocal: '';
                $('.timeDirectSelect').find('option[value="'+guageText+'"]').attr("selected", true);
                var guageDSelect = modalOption ? modalOption.guageDirect: '';
                $('.GuageDirectSelect').find('option[value="'+guageDSelect+'"]').attr("selected", true);
                var bgColor = modalOption ? modalOption.guageBgColor: '';
                if(bgColor){
                    $('.guageBgColor').html('<input type="color" value="'+bgColor+'" data-key="guageBgColor"/>');
                }
                $('#guageBgColor').val()
               // $('#appDataDot').val(modalOption ? modalOption.transDataDot: '')
            }
            var btnStartConfigEnable;
            for(i = 0;i < _this.option.optionPara.dataItem.length;++i){
                var $dataDragTip = $dataConfig.find('[dataType="'+_this.option.optionPara.dataItem[i].dsType +'"]').find('.dataDragTip');
                if ($dataDragTip.length ==0){
                    $dataDragTip = $('.dataDragTip').eq(i);
                }
                var strDSConfig;
                var loseJudge;
                for(var j= 0;j < _this.option.optionPara.dataItem[i].dsId.length;++j) {
                    loseJudge = "ptExist";
                    if (_this.option.optionPara.dataItem[i].dsName[j] == undefined){
                        _this.option.optionPara.dataItem[i].dsName[j] = I18n.resource.modalConfig.data.DATA_LOSE;
                        _this.dataLose = true;
                        loseJudge = "ptLose";
                    }
                    strDSConfig= '<div class="col-lg-3 col-xs-4 divDSConfigure grow '+ loseJudge + '" dsid="' + _this.option.optionPara.dataItem[i].dsId[j] + '"><span class="contentDS" title="'+ _this.option.optionPara.dataItem[i].dsName[j] +'">' +
                    _this.option.optionPara.dataItem[i].dsName[j] +
                    '</span><span class="glyphicon glyphicon-remove btnRemoveDS" aria-hidden="true" ></span></div>';
                    $dataDragTip.before(strDSConfig);
                    $('.divDSConfigure').tooltip({
                        placement: 'bottom',
                        title: _this.option.optionPara.dataItem[i].dsName[j]
                    });
                    btnStartConfigEnable = true;
                }
            }
            if (_this.modalType == "dataAnalysis"||_this.option.templateType ==='ModalAppGauge'||_this.option.templateType==='ModalAppPie' || _this.option.templateType ==='ModalAppHistory'||_this.option.templateType ==='ModalAppDiagRanking'||_this.option.templateType ==='ModalAPPMonthHistory'||_this.option.templateType ==='ModalKpiOverview'||_this.option.templateType ==='ModalDataMonitorList'){
                $('.chartPointCog').css('display','none');
            }else if(_this.modalType == "dashboard"){
                $('.chartPointCog').css('display','');
            }
            $dataConfig.off('click').on('click','.chartPointCog',function(e){
                $('#divChartPointCog').css('display','block');
                _this.initChartPtCog($('.chartPointCog').index($(e.target)))
            });
            if (_this.dataLose){
                new Alert($("#configAlert"), "danger", "<strong>" + I18n.resource.modalConfig.err.TYPE11 + "</strong>").show().close();
            }
            initDataTipAndButton();
            $('.alwaysEnable').removeClass('disabled');
            $('.divDSConfigure span').on('click', function (e) {
                var $thisPar = $(e.target).parent();
                $thisPar.next('.tooltip').remove();
                $thisPar.remove();
                if($('.ptLose').length == 0){
                    _this.dataLose = false;
                }
                initDataTipAndButton();

                $('#dataConfig').css('height','100%');
            });
            //initDataTipAndButton
            function initDataTipAndButton() {
                var NumOfDataTypeWithValue = 0;
                var $rowDataValue = $('.rowDataValue');
                for (var i =0;i< $rowDataValue.length;++i){
                    if($rowDataValue.eq(i).children().length > 1){
                        NumOfDataTypeWithValue += 1;
                    }
                    //if($rowDataValue.eq(i).children().length > _this.option.dataTypeMaxNum[i]){
                    //    $('.dataDragTip').get(i).style.display = 'none';
                    //}else{
                    //    $('.dataDragTip').get(i).style.display = 'block';
                    //}
                }
                if (_this.option.allDataNeed == true){
                    if(NumOfDataTypeWithValue == $rowDataValue.length){
                        $('#startConfig').removeClass('disabled');
                    }else{
                        $('#startConfig').addClass('disabled');
                    }
                }else{
                    if (NumOfDataTypeWithValue){
                        $('#startConfig').removeClass('disabled');
                    }else{
                        $('#startConfig').addClass('disabled');
                    }
                }

                if (_this.dataLose){
                     $('#startConfig').addClass('disabled');
                }
                //如果是便签,无论是否拖点,都是enable
                if(_this.templateObj && _this.templateObj.entity.modal.type == 'ModalNote'){
                    $('#startConfig').removeClass('disabled');
                }
            }

            _this.renderEditor();
        },
        initChartPtCog: function(index){
            var $inputUpper = $('#inputPtValUpper');
            var $inputLower = $('#inputPtValLower');
            var $inputUnit = $('#inputPtUnit');
            var $inputAccuracy = $('#inputPtAccuracy');
            var $inputLineVal1 = $('#inputLineVal1');
            var $inputLineName1 = $('#inputLineName1');
            var $inputLineVal2 = $('#inputLineVal2');
            var $inputLineName2 = $('#inputLineName2');
            var $inputLineVal3 = $('#inputLineVal3');
            var $inputLineName3 = $('#inputLineName3');
            var $inputLineVal4 = $('#inputLineVal4');
            var $inputLineName4 = $('#inputLineName4');
            var $inputLineNameTotal = $('.inputLineName');
            var $inputLineValTotal = $('.inputLineVal');
            if (_this.option.dsChartCog && _this.option.dsChartCog[index]){
                $inputUpper.val(_this.option.dsChartCog[index].upper);
                $inputLower.val(_this.option.dsChartCog[index].lower);
                $inputUnit.val(_this.option.dsChartCog[index].unit);
                $inputAccuracy.val(_this.option.dsChartCog[index].accuracy);
                for (var i = 0;i < 4 ;i ++) {
                    $inputLineNameTotal.eq(i).val(_this.option.dsChartCog[index].markLine[i].name);
                    $inputLineValTotal.eq(i).val(_this.option.dsChartCog[index].markLine[i].value);
                    //$inputLineVal2.val(_this.option.dsChartCog[index].lineVal2);
                    //$inputLineName2.val(_this.option.dsChartCog[index].lineName2);
                    //$inputLineVal3.val(_this.option.dsChartCog[index].lineVal3);
                    //$inputLineName3.val(_this.option.dsChartCog[index].lineName3);
                    //$inputLineVal4.val(_this.option.dsChartCog[index].lineVal4);
                    //$inputLineName4.val(_this.option.dsChartCog[index].lineName4);
                }

            }else{
                $('#divChartPointCog').find('input').val('');
            }
            $('#btnPtCogSure').off('click').click(function(){
                if(!_this.option.dsChartCog){
                    _this.option.dsChartCog = [];
                    for (var i=0;i<_this.option.rowDataType.length;++i){
                        _this.option.dsChartCog[i] = {};
                        _this.option.dsChartCog[i].markLine = [{},{},{},{}];
                    }
                }
                if (isNaN(Number($inputUpper.val())) || isNaN(Number($inputLower.val())) || isNaN(Number($inputAccuracy.val())) || isNaN(Number($inputLineVal1.
                        val())) || isNaN(Number($inputLineVal2.val())) || isNaN(Number($inputLineVal3.val())) || isNaN(Number($inputLineVal4.val()))){
                    new Alert($("#configAlert"), "danger", "<strong>" + I18n.resource.modalConfig.err.TYPE10 + "</strong>").show().close();
                    return;
                }
                if ($inputUpper.val() != '' && $inputLower.val() != '' && Number($inputUpper.val()) < Number($inputLower.val())){
                    new Alert($("#configAlert"), "danger", "<strong>" + I18n.resource.modalConfig.err.TYPE12 + "</strong>").show().close();
                    return;
                }
                _this.option.dsChartCog[index].upper = $inputUpper.val();
                _this.option.dsChartCog[index].lower = $inputLower.val();
                _this.option.dsChartCog[index].unit = $inputUnit.val();
                _this.option.dsChartCog[index].accuracy = $inputAccuracy.val();
                for(var i =0 ; i < 4;++i){
                    if (!_this.option.dsChartCog[index].markLine[i]){
                        _this.option.dsChartCog[index].markLine[i] = {}
                    }
                    _this.option.dsChartCog[index].markLine[i].value = $inputLineValTotal.eq(i).val();
                    _this.option.dsChartCog[index].markLine[i].name = $inputLineNameTotal.eq(i).val();
                }
                //_this.option.dsChartCog[index].lineVal1 = $inputLineVal1.val();
                //_this.option.dsChartCog[index].lineName1 = $inputLineName1.val();
                //_this.option.dsChartCog[index].lineVal2 = $inputLineVal2.val();
                //_this.option.dsChartCog[index].lineName2 = $inputLineName2.val();
                //_this.option.dsChartCog[index].lineVal3 = $inputLineVal3.val();
                //_this.option.dsChartCog[index].lineName3 = $inputLineName3.val();
                //_this.option.dsChartCog[index].lineVal4 = $inputLineVal4.val();
                //_this.option.dsChartCog[index].lineName4 = $inputLineName4.val();
                $('#divChartPointCog').css('display','none');
            });
            $('#btnPtCogCancel').off('click').click(function(){
                $inputUpper.val('');
                $inputLower.val('');
                $inputUnit.val('');
                $inputAccuracy.val('');
                $('#divChartPointCog').css('display','none');
            });
            $('#btnPtCogRemove').off('click').click(function(){
                $inputUpper.val('');
                $inputLower.val('');
                $inputUnit.val('');
                $inputAccuracy.val('');
                $('#divChartPointCog').css('display','none');
            });
        },
        initTime: function(){
            var $inputTimeStart = $('#inputTimeStart');
            var $inputTimeEnd = $('#inputTimeEnd');
            /*$inputTimeStart.datetimepicker({
                format: "yyyy-mm-dd hh:ii",
                minView: "hour",
                autoclose: true,
                todayBtn: true,
                initialDate: new Date()
            });*/
            $inputTimeStart.datetimepicker('remove');
            $inputTimeStart.datetime();
            /*$inputTimeEnd.datetimepicker({
                format: "yyyy-mm-dd hh:ii",
                minView: "hour",
                autoclose: true,
                todayBtn: true,
                initialDate: new Date()
            });*/
            $inputTimeEnd.datetimepicker('remove');
            $inputTimeEnd.datetime();

            var $inputCompareDate1 = $('#inputCompareDate1');
            var $inputCompareDate2 = $('#inputCompareDate2');
            /*$inputCompareDate1.datetimepicker({
                format: "yyyy-mm-dd hh:ii",
                minView: "hour",
                autoclose: true,
                todayBtn: true,
                initialDate: new Date()
            });
            $inputCompareDate2.datetimepicker({
                format: "yyyy-mm-dd hh:ii",
                minView: "hour",
                autoclose: true,
                todayBtn: true,
                initialDate: new Date()
            });*/
            $inputCompareDate1.datetimepicker('remove');
            $inputCompareDate2.datetimepicker('remove');
            $inputCompareDate1.datetime();
            $inputCompareDate2.datetime();

            if(_this.optionType) {
                var now = new Date();
                var time = new Date(now - 259200000).format('yyyy-MM-dd HH:mm');
                var initCompareDate1 = new Date(now.getFullYear(),now.getMonth() - 2).format('yyyy-MM-dd HH:mm');//上上个月第一天00:00:00
                var initCompareDate2 = new Date(now.getFullYear(),now.getMonth() - 1).format('yyyy-MM-dd HH:mm');//上个月第一天00:00:00
                if (!sessionStorage.getItem('anlzTimeStart')){
                    $inputTimeStart.val(time);
                    $inputCompareDate1.val(initCompareDate1)
                }
                now = now.format('yyyy-MM-dd HH:mm');
                if(!sessionStorage.getItem('anlzTimeEnd')){
                    $inputTimeEnd.val(now);
                    $inputCompareDate2.val(initCompareDate2)
                }
            }

        },
        initDrag: function(){
            var $divConfigData = $('.divConfigData');
            var $btnConfigStart = $('#startConfig');
            var _this = this;
            $divConfigData.on('dragover', function (e) {
                e.preventDefault();
                $(e.currentTarget).find('.dataDragTip').addClass('addData');
            });
            $divConfigData.on('dragleave', function (e) {
                e.preventDefault();
                $(e.currentTarget).find('.dataDragTip').removeClass('addData');
            });
            var targetId, targetContent;
            var initBtnStartEnable;
            var initDragTipShow = [];
            var index;
            $divConfigData.on('drop',function(e, arg){
                $('.addData').removeClass('addData');
                var $note = $('#noteEditor');
                if(!$note.is(':hidden') && !arg){
                    return;
                }
                if(_this.option.templateType === "ModalAPPMonthHistory" || _this.option.templateType === "ModalAppDiagRanking" || _this.option.templateType ==="ModalDataMonitorList"){
                    var dsItemLength = $(e.currentTarget).find(".rowDataValue>div").length;
                    if(dsItemLength === 2){
                        new Alert($("#configAlert"), "danger", "<strong>" + I18n.resource.modalConfig.err.TYPE13 + "</strong>").show().close();
                        return;
                    }
                }
                //for (var j = 0; j < $divConfigData.length; ++j) {
                //    if ($divConfigData.find('.rowDataValue').eq(j).children().length < _this.option.dataTypeMaxNum[j] + 1) {
                //        initDragTipShow[j] = true;
                //    } else {
                //        initDragTipShow[j] = false
                //    }
                //}
                index = $(e.currentTarget).index() - 1;
                //if(!initDragTipShow[index]){
                //    new Alert($("#configAlert"), "danger", "<strong>" + I18n.resource.modalConfig.err.TYPE1 + "</strong>").show().close();
                //    return;
                //}
                var $rowTempData = $(e.currentTarget).find('.rowDataValue');
                var $dataDragTip = $rowTempData.find('.dataDragTip');
                targetId = EventAdapter.getData().dsItemId;
                //if(e.originalEvent){
                //    targetId = EventAdapter.getData().dsItemId;
                //}else if(arg){
                //    targetId = arg.dataTransfer.getData("dsItemId");
                //}
                if(!targetId)return;
                if (Object.prototype.toString.call(targetId) === '[object Array]') {
                    var len = targetId.length;
                    var isContainue = false;
                    for (var i = 0; i < len; i++) {
                        if ($rowTempData.find('.divDSConfigure[dsid="' + targetId[i] + '"]').length > 0) {
                            //new Alert($("#configAlert"), "danger", "<strong>" + I18n.resource.modalConfig.err.TYPE2 + "</strong>").show().close();
                            //return;
                            targetId.splice(i, i + 1);
                            len = len - 1;
                            i = i - 1;
                        } else {
                            targetContent = AppConfig.datasource.getDSItemById(targetId[i]).alias;
                            var strDSConfig = '<div class="col-lg-3 col-xs-4 divDSConfigure grow" dsid="' + targetId[i] + '"><span class="contentDS" title="' + targetContent + '">' +
                            targetContent +
                            '</span><span class="glyphicon glyphicon-remove btnRemoveDS" aria-hidden="true" ></span></div>';
                            $dataDragTip.before(strDSConfig);
                            $(strDSConfig).tooltip({
                                placement: 'bottom',
                                title: targetContent
                            });
                        }
                    }
                    if (targetId.length < 1) {
                        new Alert($("#configAlert"), "danger", "<strong>" + I18n.resource.modalConfig.err.TYPE2 + "</strong>").show().close();
                    } else {
                        $('#startConfig').removeClass('disabled');
                    }
                } else {
                    var info = AppConfig.datasource.getDSItemById(targetId);
                    targetContent = info.alias===""?info.value:info.alias;
                    if ($rowTempData.find('.divDSConfigure[dsid="' + targetId + '"]').length > 0) {
                        new Alert($("#configAlert"), "danger", "<strong>" + I18n.resource.modalConfig.err.TYPE2 + "</strong>").show().close();
                        return;
                    }
                    var strDSConfig = '<div class="col-lg-3 col-xs-4 divDSConfigure grow" dsid="' + targetId + '"><span class="contentDS" title="' + targetContent + '">' +
                    targetContent +
                    '</span><span class="glyphicon glyphicon-remove btnRemoveDS" aria-hidden="true" ></span></div>';
                    $dataDragTip.before(strDSConfig);
                    $(strDSConfig).tooltip({
                                placement: 'bottom',
                                title: targetContent
                            });
                    $('#startConfig').removeClass('disabled');
                }
                initBtnStartAndDragTip(index);

                $(e.currentTarget).find('.divDSConfigure span').off('click').on('click', function (e) {
                    var $thisPar = $(e.target).parent();
                    var dsid = $thisPar.attr('dsid');
                    $thisPar.remove();
                    if($('.ptLose').length == 0){
                        _this.dataLose = false;
                    }
                    initBtnStartAndDragTip(index);
                    var $dataConfig = $('#dataConfig');
                    $dataConfig.css('height','100%');
                    //$dataConfig.height('');
                    //if($dataConfig.height() > window.innerHeight - 80){
                    //    $dataConfig.css('height','100%');
                    //}
                });
                var $dataConfig = $('#dataConfig');
                if ('AnlzTendency' != _this.option.templateType) {
                    $dataConfig.height('');
                }
                if($dataConfig.height() > window.innerHeight - 80){
                    $dataConfig.css('height','100%');
                }

                if(!$note.is(':hidden') && arg){
                    if (Object.prototype.toString.call(targetId) === '[object Array]') {
                        var len = targetId.length;
                        for (var i = 0; i < len; i++) {
                            targetContent = AppConfig.datasource.getDSItemById(targetId[i]).alias;
                            var format = '&nbsp;<span id = "' + targetId[i] +  '" contenteditable="false" class="pointValue" title="' + targetContent + '"><%' + targetContent + '%></span>&nbsp;';
                            insertHtmlAtCaret(format, targetId[i]);
                        }
                    } else {
                        var format = '&nbsp;<span id = "' + targetId + '" contenteditable="false" class="pointValue" title="' + targetContent + '"><%' + targetContent + '%></span>&nbsp;';
                        insertHtmlAtCaret(format, targetId);
                    }
                    //var format = '&nbsp;<span id = "'+ targetId +'" contenteditable="false" class="pointValue" title="'+ targetContent +'"><%'+ targetContent + '%></span>&nbsp;';
                    //insertHtmlAtCaret(format,targetId);

                    function insertHtmlAtCaret(html,targetId) {
                        var sel, range;
                        //var iframeWin = document.querySelector('iframe').contentWindow;
                        var iframeWin = _this.ue.window;
                        if (iframeWin.getSelection) {
                            sel = iframeWin.getSelection();
                            if (sel.getRangeAt && sel.rangeCount) {
                                range = sel.getRangeAt(0);
                                range.deleteContents();
                                var el = document.createElement("div");
                                el.innerHTML = html;
                                var frag = document.createDocumentFragment(), node, lastNode;

                                while ( (node = el.firstChild) ) {
                                    lastNode = frag.appendChild(node);
                                }
                                range.insertNode(frag);
                                if (lastNode) {
                                    range = range.cloneRange();
                                    range.setStartAfter(lastNode);
                                    range.collapse(true);
                                    sel.removeAllRanges();
                                    sel.addRange(range);
                                }
                                $(iframeWin.document).find('#'+targetId)[0].addEventListener('DOMNodeRemoved', _this.domNodeRemoved, false);
                                //_this.$editor.find('#'+targetId).off('click').on('click',function(e){
                                //    _this.initNotePtCfg(_this.$editor.find('.pointValue').index($(e.target)));
                                //});
                                $(iframeWin.document).find('#' + targetId).off('click').on('click', function (e) {
                                    _this.initNotePtCfg($(iframeWin.document).find('.pointValue').index($(e.target)));
                                });
                            }
                        }
                    }
                }
            });

            function initBtnStartAndDragTip(indexOfDataType){
                var tempDivDS = $divConfigData.find('.rowDataValue').eq(indexOfDataType).children();
                if(_this.option.allDataNeed == true){
                    initBtnStartEnable = true;
                    for (var i = 0;i < $divConfigData.length;++i){
                        if($divConfigData.find('.rowDataValue').eq(i).children().length <= 1){
                            initBtnStartEnable = false;
                            break;
                        }
                    }
                    if(tempDivDS.length > 1){
                        //if (tempDivDS.length > _this.option.dataTypeMaxNum[indexOfDataType]){
                        //    initDragTipShow[indexOfDataType] = false;
                        //}else{
                        //    initDragTipShow[indexOfDataType] = true;
                        //}
                    }else{
                        initBtnStartEnable -= 1;
                        initDragTipShow[indexOfDataType] = true;
                    }
                }else{
                    if($divConfigData.find('.divDSConfigure').length > 0){
                        initBtnStartEnable = true;
                    }else{
                        initBtnStartEnable = false;
                    }
                    //if (tempDivDS.length > _this.option.dataTypeMaxNum[indexOfDataType]){
                    //    initDragTipShow[indexOfDataType] = false;
                    //}else{
                    //    initDragTipShow[indexOfDataType] = true;
                    //}
                }
                if(initBtnStartEnable > 0){
                    $btnConfigStart.removeClass('disabled');
                }else{
                    $btnConfigStart.addClass('disabled');
                }
                //if (initDragTipShow[indexOfDataType]){
                //    tempDivDS.last().css('display','block');
                //}else{
                //    tempDivDS.last().css('display','none');
                //}
                if (_this.dataLose){
                    $btnConfigStart.addClass('disabled');
                }
            }
        },
        initConfigStart: function(){
            var $modalConfig = $('#modalConfig');
            var $inputModal = $('#inputMode');
            document.getElementById('startConfig').onclick = function () {
                if ($(this).hasClass('disabled')) return;
                var tempStartTime, tempEndTime, tempPeriodTime;
                var timeRecent;
                var tempInterval = 0;
                var $inputPeriodValue = $('#inputPeriodValue');
                var periodValue = $inputPeriodValue.val();
                var tempDSId, tempDS, arrItemDS = [];
                var $rowDataValue = $('.rowDataValue');
                var $inputInterval = $('#inputInterval');
                var $inputTimeStart = $('#inputTimeStart');
                var $inputTimeEnd = $('#inputTimeEnd');
                var $inputPeriodUnit = $('#inputPeriodUnit');
                var $inputPeriodDropDown = $('#inputPeriodDropDown');
                var $inputCompareDate1 = $('#inputCompareDate1');
                var $inputCompareDate2 = $('#inputCompareDate2');
                var $inputComparePeriod = $('#inputComparePeriod');
                var $gaugeMode = $('#gaugeMode');
                var $gaugeLowerLimit = $('#gaugeLowerLimit');
                var $gaugeUpperLimit = $('#gaugeUpperLimit');
                var $normalLowerLimit = $('#normalLowerLimit');
                var $normalUpperLimit = $('#normalUpperLimit');
                var $inputRealTimeInterval = $('#inputRealTimeInterval');
                var $optionSelescted = $('#inputRealTimeInterval option:selected').val();//获取选中的采样间隔值
                var $inputHistoryRange = $('#inputHistoryRange');
                var timeType,scaleList;
                var now;
                for (var i = 0; i < $rowDataValue.length; ++i) {
                    tempDS = {};
                    tempDS.type = $rowDataValue[i].parentNode.getAttribute('dataType');
                    tempDSId = [];
                    for (var j = 0; j < $rowDataValue[i].children.length - 1; ++j) {
                        tempDSId.push($rowDataValue[i].children[j].getAttribute('dsid'));
                    }
                    tempDS.arrId = tempDSId;
                    arrItemDS.push(tempDS);
                }
                var totalModeType ={
                    easy:'easy',
                    fixed:'fixed',
                    recent:'recent',
                    realTime:'realTime',
                    //easyEnergy:'easyEnergy',
                    easyCompareAnalyz:'easyCompareAnalyz',
                    easyCompare:'easyCompare',
                    easyCompareToggle:'easyCompareToggle',
                    compareSensor:'compareSensor',
                    compareMeter:'compareMeter',
                    realTimeDashboard:"realTimeDashboard",
                    gauge:'gauge',
                    weather: 'weather',
                    easyHistory:"easyHistory",
                    easyHistorySelect:"easyHistorySelect",
                    multiple:'multiple'
                };

                switch ($inputModal.val()) {
                    case totalModeType['fixed']:
                        tempStartTime = $inputTimeStart.val().toDate().format('yyyy-MM-dd HH:mm');
                        tempEndTime = $inputTimeEnd.val().toDate().format('yyyy-MM-dd HH:mm');
                        if (tempStartTime.toDate() >= tempEndTime.toDate()) {
                            new Alert($("#configAlert"), "danger", "<strong>" + I18n.resource.modalConfig.err.TYPE3 + "</strong>").show().close();
                            return;
                        }
                        if (tempEndTime.toDate() >= new Date()) {
                            new Alert($("#configAlert"), "danger", "<strong>" + I18n.resource.modalConfig.err.TYPE4 + "</strong>").show().close();
                            return;
                        }
                        break;
                    case totalModeType['recent']:
                        tempEndTime = new Date().format('yyyy-MM-dd HH:mm:ss');
                        timeRecent = {
                            val:periodValue,
                            unit:$inputPeriodUnit.val()
                        };
                        switch ($inputPeriodUnit.val()) {
                            case 'hour':
                                tempPeriodTime = periodValue * 3600000;
                                break;
                            case 'day' :
                                tempPeriodTime = periodValue * 86400000;
                                break;
                            case 'month' :
                                tempPeriodTime = periodValue * 2592000000;
                                break;
                            case 'year' :
                                tempPeriodTime = periodValue * 31536000000;
                                break;
                        }
                        now = new Date();
                        tempStartTime = new Date(now - tempPeriodTime).format('yyyy-MM-dd HH:mm:ss');
                        break;
                    case totalModeType['realTime']:
                        tempStartTime = '';
                        tempEndTime = '';
                        break;
                    case totalModeType['easy']:
                        now = new Date();
                        timeRecent = $inputPeriodDropDown.val();
                        switch ($inputPeriodDropDown.val()) {
                            case 'today' :
                                tempPeriodTime = 86400000;
                                tempEndTime = now.format('yyyy-MM-dd HH:mm:ss');
                                tempStartTime = new Date(now - tempPeriodTime).format('yyyy-MM-dd HH:mm:ss');
                                break;
                            case 'yesterday' :
                                var yesterday = new Date();
                                yesterday = new Date(yesterday.setDate(yesterday.getDate() - 1));
                                tempEndTime = new Date(getTimeOfMidnightZero(now).getTime() - 1000).format('yyyy-MM-dd HH:mm:ss');
                                tempStartTime = getTimeOfMidnightZero(yesterday).format('yyyy-MM-dd HH:mm:ss');
                                break;
                            case 'thisWeek':
                                tempPeriodTime = 604800000;
                                tempEndTime = now.format('yyyy-MM-dd HH:mm:ss');
                                tempStartTime = new Date(now - tempPeriodTime).format('yyyy-MM-dd HH:mm:ss');
                                break;
                            case 'lastWeek' :
                                tempPeriodTime = 604800000;
                                tempEndTime = getTimeOfMidnightZero(new Date(now-(now.getDay() + 1) * 86400000)).format('yyyy-MM-dd HH:mm:ss');
                                tempStartTime = getTimeOfMidnightZero(new Date(now-(now.getDay() + 7) * 86400000)).format('yyyy-MM-dd HH:mm:ss');
                                break;
                            case 'thisYear' :
                                tempPeriodTime = 31536000000;
                                tempEndTime = now.format('yyyy-MM-dd HH:mm:ss');
                                tempStartTime = new Date(now - tempPeriodTime).format('yyyy-MM-dd HH:mm:ss');
                                break;
                        }
                        break;
                    case totalModeType['realTimeDashboard']:
                        tempStartTime = '';
                        tempEndTime = '';
                        //tempInterval = $inputInterval.val();
                        tempInterval = $inputRealTimeInterval.val();
                        timeType = $inputRealTimeInterval.val();
                        break;
                    case totalModeType['multiple']:
                        tempStartTime = '';
                        tempEndTime = '';
                        tempInterval = $inputInterval.val();
                        timeType = $inputRealTimeInterval.val();
                        var paraType = arrItemDS;
                        break;
                    case totalModeType['easyCompareAnalyz']:
                        tempPeriodTime = 'month';
                        $inputInterval.val('d1');
                        timeType = $inputComparePeriod.val();
                        tempStartTime = initCompareTime(tempPeriodTime,$inputCompareDate1.val());
                        tempEndTime = initCompareTime(tempPeriodTime,$inputCompareDate2.val());
                        break;
                    case totalModeType['easyCompare']:
                        tempPeriodTime = 'month';
                        $inputInterval.val('d1');
                        timeType = $inputComparePeriod.val();
                        break;
                    case totalModeType['easyCompareToggle']:
                        tempPeriodTime = 'month';
                        $inputInterval.val('d1');
                        timeType = $inputComparePeriod.val();
                        var chartType = $('#inputChartSelect').val();
                        break;
                    case totalModeType['compareSensor']:
                        tempPeriodTime = $inputComparePeriod.val();
                        timeType = $inputComparePeriod.val();
                        tempStartTime = initCompareTime(tempPeriodTime,$inputCompareDate1.val());
                        tempEndTime = initCompareTime(tempPeriodTime,$inputCompareDate2.val());
                        break;
                    case totalModeType['compareMeter']:
                        tempPeriodTime = $inputComparePeriod.val();
                        timeType = $inputComparePeriod.val();
                        tempStartTime = initCompareTime(tempPeriodTime,$inputCompareDate1.val());
                        tempEndTime = initCompareTime(tempPeriodTime,$inputCompareDate2.val());
                        break;
                    case totalModeType['gauge']:
                        if ($gaugeMode.val() == 'high'){
                            scaleList = [$gaugeLowerLimit.val(),$normalLowerLimit.val(),$normalUpperLimit.val(),$gaugeUpperLimit.val()];
                        }else{
                            scaleList = [$gaugeUpperLimit.val(),$normalUpperLimit.val(),$normalLowerLimit.val(),$gaugeLowerLimit.val()];
                        }
                        for (i = 0;i < scaleList.length;i++){
                            if (isNaN(Number(scaleList[i]))){
                                new Alert($("#configAlert"), "danger", "<strong>" + I18n.resource.modalConfig.err.TYPE10 + "</strong>").show().close();
                                return;
                            }
                            scaleList[i] = parseFloat(scaleList[i]);
                        }
                        var tempArr = scaleList.concat();
                        if($gaugeMode.val() =='high'){
                            tempArr.sort(function(a,b){
                                return a > b ? 1: -1
                            });
                        }else{
                            tempArr.sort(function(a,b){
                                return a < b ? 1: -1
                            });
                        }
                        if (tempArr.toString() != scaleList.toString()) {
                            new Alert($("#configAlert"), "danger", "<strong>" + I18n.resource.modalConfig.err.TYPE5 + "</strong>").show().close();
                            return;
                        }
                        break;
                    case totalModeType['weather']:
                        tempStartTime = '';
                        tempEndTime = '';
                        break;
                    case totalModeType['easyHistory']:
                        timeType = $inputHistoryRange.val();
                        break;
                    case totalModeType['easyHistorySelect']:
                        timeType = $inputHistoryRange.val();
                        var chartType = $('#inputChartSelect').val();
                        break;
                    default :
                        break;
                }
                //根据对比周期获取对比开始时间
                function initCompareTime(period,time){
                    var startTime;
                    switch (period){
                        case 'hour':
                            startTime = time.toDate().format('yyyy-MM-dd HH') + ':00:00';
                            break;
                        case 'day' :
                            startTime = time.toDate().format('yyyy-MM-dd') + ' 00:00:00';
                            break;
                        case 'week' :
                            var weekDay = time.toDate().getDay();
                            var date = time.toDate().getDate();
                            startTime = new Date(time.toDate().setDate(date-weekDay + 1)).format('yyyy-MM-dd') + ' 00:00:00';
                            break;
                        case 'month' :
                            startTime = time.toDate().format('yyyy-MM') + '-01 00:00:00';
                            break;
                        default :
                            break;
                    }

                    return startTime;
                }
                //获取指定日期的午夜零点
                function getTimeOfMidnightZero(date){
                    var tempDate;
                    if(date){
                        tempDate = date
                    }else{
                        tempDate = new Date();
                    }
                    return (date.format('yyyy-MM-dd') + ' 00:00:00').toDate();
                }
                if(_this.modalType == "dataAnalysis"){
                    if(_this.optionType){//新建的Slider
                        _this.screen.curModal = {
                            startTime: tempStartTime,
                            endTime: tempEndTime,
                            format: $inputInterval.val(),
                            mode: $inputModal.val(),
                            type: _this.option.templateType,
                            itemDS: arrItemDS,
                            comparePeriod: tempPeriodTime,
                            dsChartCog: _this.option.dsChartCog,
                            noteList: [],
                            graphList: [],
                            timeRecent:timeRecent
                        };
                    }else{
                        _this.screen.curModal = {
                            startTime: tempStartTime,
                            endTime: tempEndTime,
                            format: $inputInterval.val(),
                            mode: $inputModal.val(),
                            type: _this.option.templateType,
                            itemDS: arrItemDS,
                            comparePeriod: tempPeriodTime,
                            dsChartCog: _this.option.dsChartCog,
                            noteList: _this.screen.curModal.noteList,
                            graphList: _this.screen.curModal.graphList,
                            timeRecent:timeRecent
                        };
                    }
                }else if(_this.modalType == "dashboard"){
                    _this.templateObj.entity.modal.option = {timeFormat: $optionSelescted};//把采样间隔值放进option中
                    _this.templateObj.configParams = {};
                    var $divDSConfigure = $('.divDSConfigure');
                    _this.templateObj.entity.modal.title = $('.springSel .chartTitle input').val();
                    _this.templateObj.entity.modal.points = [];
                    _this.templateObj.entity.modal.StartTime = tempStartTime;
                    _this.templateObj.entity.modal.EndTime = tempEndTime;
                    _this.templateObj.entity.modal.dsChartCog = _this.option.dsChartCog;
                    if (_this.option.modeUsable && _this.option.modeUsable[0] && _this.option.templateType === 'ModalAppGauge') {
                        var appGuageList = {};
                        var guageTitle = $('#appGuageTitle').val().trim();
                        //var guageFulTitle = $('#appGuageFulTitle').val().trim();
                        var guageFixed = $('#appGuageDot').val().trim();
                        var guageUnit = $('#appGuageUnit').val().trim();
                        var timeLocal = $('.timeDirectSelect').val();
                        var guageDirect = $('.GuageDirectSelect').val();
                        var guageBgColor = $('.guageBgColor').find('input').val();
                        //var transDataDot =$('#appDataDot').val().trim();
                        if(guageFixed!=='' && !(/^(0|[1-9]\d*)$/.test(guageFixed))){
                            alert('请输入非负整数！');
                            return;
                        }
/*                        if(parseInt(transDataDot)<0||parseInt(transDataDot)>1){
                            alert('请输入0-1之间的小数！');
                            return;
                        }*/
                    }
                    if( _this.option.templateType === 'ModalAppDiagRanking'){
                        var diagType =$('#appDiagRank').find('select.selecTDiagType').val()
                    }
                    if (_this.option.modeUsable && _this.option.modeUsable[0] && _this.option.templateType === 'ModalAppHistory') {
                        var historyTitle = $('#appHistoryTitle').val();
                        //_this.templateObj.entity.modal.desc = appGuageTitle;
                        //_this.templateObj.entity.modal.option.gaugeTitle = appGuageTitle;
                    }
                    if(_this.templateObj.entity.modal.type == 'ModalNote'){
                        //var bodyEditor = document.querySelector('iframe').contentWindow.document.querySelector('body');
                        var $divModalTextSpan = $(_this.ue.body).find('.pointValue');

                        _this.templateObj.entity.modal.modalText = _this.ue.getContent();

                        for(var i = 0;i< $divModalTextSpan.length;++i){
                            _this.templateObj.entity.modal.points.push($divModalTextSpan.get(i).attributes['id'].value);
                        }
                        _this.templateObj.entity.modal.modalTextUrl =_this.editorData;
                    }else{
                        //for(var i = 0;i< $divDSConfigure.length;++i){
                        //    _this.templateObj.entity.modal.points.push($divDSConfigure.get(i).attributes['dsid'].value);
                        //}
                        if(_this.templateObj.entity.modal.type === 'ModalAppPie'){
                            _this.templateObj.entity.modal.points.push($divDSConfigure.get(0).attributes['dsid'].value);
                            WebAPI.post('/analysis/startWorkspaceDataGenPieChart', { dsItemIds: $divDSConfigure.get(0).attributes['dsid'].value }).done(function (result) {
                                var data = JSON.parse(result.dsItemList[0].data);
                                var projectId = data.EnergyList[0].projectId;
                                if(!projectId){
                                    if(AppConfig.project && AppConfig.project.bindId){
                                        projectId = AppConfig.project.bindId;
                                    }else{
                                        projectId = AppConfig.projectId;
                                    }
                                }
                                _this.templateObj.entity.modal.points.push('@'+projectId+'|'+data.EnergyList[0].accumCostPoint);
                                _this.templateObj.entity.modal.points.push('@'+projectId+'|'+data.EnergyList[0].accumEnergyPoint);
                            })
                        }else{
                            for(var i = 0;i< $divDSConfigure.length;++i){
                                _this.templateObj.entity.modal.points.push($divDSConfigure.get(i).attributes['dsid'].value);
                            }
                        }
                    }
                    //_this.templateObj.entity.modal.points = arrItemDS;
                    var option={};
                    timeType && (option.timeType = timeType);
                    scaleList && (option.scaleList = scaleList);
                    paraType && (option.paraType = paraType);
                    chartType && (option.showType = chartType);
                    //appGuageList && (option.appGuageList = appGuageList);
                    if(_this.option.templateType === 'ModalAppGauge'){
                        option['guageTitle'] = guageTitle!==''?guageTitle:null;
                        //option['guageFulTitle'] = guageFulTitle!==''?guageFulTitle:null;
                        option['guageFixed'] = guageFixed!==''?parseInt(guageFixed):null;
                        option['guageUnit'] = guageUnit!==''?guageUnit:null;
                        option['timeLocal'] = timeLocal!==''?timeLocal:null;
                        option['guageDirect'] = guageDirect!==''?guageDirect:null;
                        option['guageBgColor'] = guageBgColor!==''?guageBgColor:null;
                        //option['transDataDot'] = transDataDot!==''?parseFloat(transDataDot):null;
                    }
                    historyTitle && (option.historyTitle = historyTitle);
                    if(_this.option.templateType === 'ModalAppDiagRanking'){
                        option['diagType'] = diagType;
                    }
                }

                $modalConfig.modal('hide');
                _this.newPageFlag = true;
                //Spinner.spin(ElScreenContainer);
                //alert('预计' + + '秒后生成图表')
                if(_this.modalType == 'dataAnalysis') {
                    var yMax = $('#modifyChartYMax').val();
                    var yMin = $('#modifyChartYMin').val();
                    var yUintSpare = $('#modifyChartYUnitEx').find("option:selected").text();
                    yUintSpare = (yUintSpare==='--') ? '' : yUintSpare;
                    if (yMax) {
                        yMax = parseInt(yMax, 10);
                    }
                    if (yMin) {
                        yMin = parseInt(yMin, 10);
                    }
                    var chartOpt = {
                        'chartName' : $('#modifyChartTitle').val(),
                        'yUnit' : $('#modifyChartYUnitName').val() + ' ' + yUintSpare,//$('#modifyChartYUnitEx').find("option:selected").text(),
                        'yMax' : yMax,
                        'yMin' : yMin,
                        'yMark' : $('#modifyChartYMark').val()
                    };
                    _this.screen.curModal.chartOption = chartOpt;
                    _this.screen.renderModal();
                }else if(_this.modalType == 'dashboard'){
                    _this.templateObj.setModalOption(option);
                    _this.templateObj.render();
                }
            }
        },
        close: function(){
            this.screen = null;
            this.container.parentNode.removeChild(this.container);
            this.container = null;
            this.modalType = null;
            this.ue = null;
        },
        initEditor: function(){
            //_this.$editor.find('#'+targetId).off('click').on('click',function(e){
            //    _this.initNotePtCfg(_this.$editor.find('span').index($(e.target)));
            //})
            var _this = this;
            //var bodyEditor, iframe;
            this.editorData = _this.templateObj.entity.modal.modalTextUrl?_this.templateObj.entity.modal.modalTextUrl:[];
            //$('#dataConfig').hide();
            if(!this.ue){
                UE.delEditor('noteEditor');
                this.ue = UE.getEditor('noteEditor',{lang: (I18n.type == 'zh' ? 'zh-cn': 'en')});
                this.ue.ready(function(){
                    $('#noteEditor').slideDown('fast');
                    $('#dataConfig').hide();
                    this.setContent(_this.templateObj.entity.modal.modalText ? _this.templateObj.entity.modal.modalText : '');
                    //iframe = document.querySelector('iframe');
                    //bodyEditor = iframe.contentWindow.document.querySelector('body');
                    $(this.iframe).addClass('gray-scrollbar');
                    this.body.ondrop = dropBody;
                    this.body.ondragover = ondragoverBody;
                    this.body.ondragleave = dragleaveBody;
                    this.body.onmouseup = onmouseupBody;
                    this.body.onkeydown = onkeydownBody;

                    $(this.body).find('.pointValue').each(function(){
                        this.addEventListener('DOMNodeRemoved',_this.domNodeRemoved,false);
                    });
                });
            }else{
                this.ue.setContent(this.templateObj.entity.modal.modalText ? this.templateObj.entity.modal.modalText : '');
            }
            // events
            function dropBody(e){
                e.preventDefault();
                this.focus();
                var $divConfigData = $('#modalConfig').find('.divConfigData');
                $divConfigData.trigger('drop',[e]);
                var $editorPoint = $(_this.ue.body).find('.pointValue');
                var modalTextUrl = _this.editorData?_this.editorData:[];
                var tempModalTexUrl = [];
                var flag;
                for (var i = 0; i < $editorPoint.length; i++){
                    flag = false;
                    for (var  j = 0; j < modalTextUrl.length; j++){
                        if ($editorPoint[i].id == modalTextUrl[j].ptId){
                            tempModalTexUrl[i] = modalTextUrl[j];
                            flag = true;
                            break;
                        }
                    }
                    if (!flag){
                        tempModalTexUrl[i] =
                        {
                            ptId:$editorPoint[i].id,
                            ptName:$editorPoint[i].innerText.match(/\b\w+\b/g),
                            ptTextUrl:[]
                        }
                    }
                }
                _this.editorData = tempModalTexUrl;

            }
            function ondragoverBody (e) {
                e.preventDefault();
                $(e.currentTarget).find('.dataDragTip').addClass('addData');
            }
            function dragleaveBody (e) {
                e.preventDefault();
                $(e.currentTarget).find('.dataDragTip').removeClass('addData');
            }

            function onmouseupBody(e){
                var selection = window.getSelection();
                if(selection.type == "Range"){
                    var content = selection.getRangeAt(0).cloneContents();
                    for(var i in content.childNodes){
                        if(content.childNodes[i].className == 'pointValue'){
                            $('.pointValue').attr("contenteditable",true);
                            _this.isSelection = true;
                            return;
                        }
                    }
                }else{
                    $('.pointValue').attr("contenteditable",false);
                }
                _this.isSelection = false;
            }
            function onkeydownBody(e){
                if(_this.isSelection) window.event.returnValue=false;
            };
        },
        renderEditor: function(){
            var $note = $('#noteEditor');
            var $dataConfig = $('#dataConfig');

            if(this.templateObj && this.templateObj.entity.modal.type == 'ModalNote'){
                $dataConfig.hide();
                $note.show();
                /*if(!_this.$editor) return;
                _this.$editor.html(_this.templateObj.entity.modal.modalText);
                $('.pointValue').each(function(){
                    this.addEventListener('DOMNodeRemoved',_this.domNodeRemoved,false);
                });*/
                if (this.editorData){
                    var $editor = $('#editor');
                    $editor.find('.pointValue').off('click').on('click',function(e){
                        _this.initNotePtCfg($editor.find('.pointValue').index($(e.target)));
                    })
                }
            }else{
                $dataConfig.show();
                $note.hide();
            }
        },
        domNodeRemoved: function(){
            var id = $(this).attr('id');
            //var bodyEditor = document.querySelector('iframe').contentWindow.document.querySelector('body');
            var $target = $('.divDSConfigure[dsid="'+ id +'"]');
            var index = $target.parent().children('.divDSConfigure').index($target);
            setTimeout(function(){
                var newDom = $(_this.ue.body).find('#'+id);
                if(newDom.length < 1){
                    $target.find('.btnRemoveDS').trigger('click');
                    var tempArray = [];
                    for (var i =0; i < _this.editorData.length; i++) {
                        if (i == index)continue;
                        tempArray.push(_this.editorData[i]);
                    }
                    _this.editorData = tempArray;
                }else{
                    newDom[0].addEventListener('DOMNodeRemoved',_this.domNodeRemoved,false);
                }
            },1000);
        },
        initNotePtCfg: function(index){
            var modalTextUrl;
            //var bodyEditor = document.querySelector('iframe').contentWindow.document.querySelector('body');
            var $editorPoint = $(_this.ue.body).find('.pointValue');
            if(_this.editorData && $editorPoint.length == _this.editorData.length){
                modalTextUrl = _this.editorData;
            }else{
                modalTextUrl = [];
                for (var i = 0;i < $editorPoint.length; ++i){
                    modalTextUrl.push(
                        {
                            ptId:$editorPoint[i].id,
                            ptName:$editorPoint[i].innerText.match(/\b\w+\b/g),
                            ptTextUrl:[]
                        }
                    )
                }
            }
            var temp;
            var $tempDivUrl = $('<div class="col-xs-4 "><select type="text" class="form-control inputNotePtCfgUrl"></select></div>');
            var $tempSelUrl = $tempDivUrl.children();
            $tempSelUrl[0].options.add(new Option(I18n.resource.dashboard.show.SELECT_LINK,'',true));
            for(var i in AppConfig.menu){
                var option = new Option(AppConfig.menu[i],i);
                $tempSelUrl[0].options.add(option);
            }
            $tempSelUrl[0].onchange = function(){
                _this.templateObj.entity.modal.link = $tempSelUrl[0].value;
            };
            var strNotePtCfg = new StringBuilder();
            strNotePtCfg.append('<div id="containerNotePtCfg">');
            strNotePtCfg.append('   <span class="glyphicon glyphicon-plus" id="btnNotePtCfgAdd" aria-hidden="true"></span>');
            strNotePtCfg.append('   <span class="glyphicon glyphicon-remove" id="btnNotePtCfgExit" aria-hidden="true"></span>');
            strNotePtCfg.append('   <div class="rowNotePtCfgTitle row">');
            strNotePtCfg.append('       <div class="col-xs-3">Value</div>');
            strNotePtCfg.append('       <div class="col-xs-5">Name</div>');
            strNotePtCfg.append('       <div class="col-xs-4">Url</div>');
            strNotePtCfg.append('   </div>');
            strNotePtCfg.append('   <div id="divNotePtCfg">');
            strNotePtCfg.append('   </div>');
            strNotePtCfg.append('   <div id="divBtnNotePtCfg">');
            strNotePtCfg.append('       <button type="button" class="btn btn-primary" id="btnNotePtCogSure" i18n="modalConfig.data.PT_COG_SURE"></button>');
            strNotePtCfg.append('       <button type="button" class="btn btn-primary" id="btnNotePtCogCancel" i18n="modalConfig.data.PT_COG_CANCEL"></button>');
            strNotePtCfg.append('   </div>');
            strNotePtCfg.append('</div>');
            $('#noteEditor').append(strNotePtCfg.toString());
            strNotePtCfg = new StringBuilder();
            if (modalTextUrl[index] && modalTextUrl[index].ptTextUrl.length > 0){
                for(var i = 0;i < modalTextUrl[index].ptTextUrl.length;i++){
                    temp = modalTextUrl[index].ptTextUrl[i];
                    strNotePtCfg.append('   <div class="row rowNotePtCfg form-group">');
                    strNotePtCfg.append('      <span class="glyphicon glyphicon-remove btnRowNoteCfgRemove" aria-hidden="true"></span> ');
                    strNotePtCfg.append('       <div class="col-xs-3 "><input type="text" class="form-control inputNotePtCfgVal" value="' + temp.value +'"></div>');
                    strNotePtCfg.append('       <div class="col-xs-5 "><input type="text" class="form-control inputNotePtCfgName" value="' + temp.name +'"></div>');
                    //strNotePtCfg.append('       <div class="col-xs-8 "><input type="text" class="form-control inputNotePtCfgUrl" value="' + temp.url +'"></div>');
                    strNotePtCfg.append('   </div>');
                }
            }
            else
            {
                strNotePtCfg.append('   <div class="row rowNotePtCfg form-group">');
                strNotePtCfg.append('      <span class="glyphicon glyphicon-remove btnRowNoteCfgRemove" aria-hidden="true"></span> ');
                strNotePtCfg.append('       <div class="col-xs-3 "><input type="text" class="form-control inputNotePtCfgVal"></div>');
                strNotePtCfg.append('       <div class="col-xs-5 "><input type="text" class="form-control inputNotePtCfgName"></div>');
                //strNotePtCfg.append('       <div class="col-xs-8 "><input type="text" class="form-control inputNotePtCfgUrl"></div>');
                strNotePtCfg.append('   </div>');
            }
            $('#divNotePtCfg').append(strNotePtCfg.toString());
            var $rowNotePtCfg = $('.rowNotePtCfg');
            var tempVal;
            for(var i = 0; i < $rowNotePtCfg.length;i++){
                $rowNotePtCfg.eq(i).append($tempDivUrl.clone());
                tempVal = modalTextUrl[index].ptTextUrl[i] ? modalTextUrl[index].ptTextUrl[i].url:'';
                $rowNotePtCfg.eq(i).find('.inputNotePtCfgUrl').val(tempVal)
            }
            I18n.fillArea($('#divBtnNotePtCfg'));
            var $self = $('#containerNotePtCfg');
            $('#btnNotePtCfgAdd').off('click').on('click',function(e){
                var strRowNotePtCfg = new StringBuilder();
                strRowNotePtCfg.append('   <div class="row rowNotePtCfg form-group">');
                strRowNotePtCfg.append('      <span class="glyphicon glyphicon-remove btnRowNoteCfgRemove" aria-hidden="true"></span> ');
                strRowNotePtCfg.append('       <div class="col-xs-3 "><input type="text" class="form-control inputNotePtCfgVal"></div>');
                strRowNotePtCfg.append('       <div class="col-xs-5 "><input type="text" class="form-control inputNotePtCfgName"></div>');
                //strRowNotePtCfg.append('       <div class="col-xs-8 "><input type="text" class="form-control inputNotePtCfgUrl"></div>');
                strRowNotePtCfg.append('   </div>');
                $('#divNotePtCfg').append(strRowNotePtCfg.toString());
                $('.rowNotePtCfg').last().append($tempDivUrl.clone());
                $('.btnRowNoteCfgRemove').last().off('click').on('click',function(e){
                    var tempPtTextUrl = [];
                    var tempIndex = $('.btnRowNoteCfgRemove').index($(e.target));
                    tempPtTextUrl = [_this.editorData[index].ptTextUrl.slice(0,tempIndex),_this.editorData[index].ptTextUrl.slice(tempIndex + 1)];
                    tempPtTextUrl = tempPtTextUrl[0].concat(tempPtTextUrl[1]);
                    _this.editorData[index].ptTextUrl = tempPtTextUrl.concat();
                    $(e.target).parent().remove();
                });
            });
            $('#btnNotePtCfgExit').off('click').on('click',function(e){
                $self.remove();
            });
            $('#btnNotePtCogSure').off('click').on('click',function(e){
                //var modalTextUrl = _this.templateObj.entity.modal.modalTextUrl?_this.templateObj.entity.modal.modalTextUrl[index]:{};
                $rowNotePtCfg = $('.rowNotePtCfg');
                modalTextUrl[index].ptTextUrl = [];
                for (var j = 0;j < $rowNotePtCfg.length; j++){
                    modalTextUrl[index].ptTextUrl.push({
                        value:$rowNotePtCfg.eq(j).find('.inputNotePtCfgVal').val(),
                        name:$rowNotePtCfg.eq(j).find('.inputNotePtCfgName').val(),
                        url:$rowNotePtCfg.eq(j).find('.inputNotePtCfgUrl').val()
                    })
                }
                _this.editorData = modalTextUrl;
                $self.remove();
            });
            $('#btnNotePtCogCancel').off('click').on('click',function(e){
                $self.remove();
            });
            $('.btnRowNoteCfgRemove').off('click').on('click',function(e){
                var tempPtTextUrl = [];
                var tempIndex = $('.btnRowNoteCfgRemove').index($(e.target));
                tempPtTextUrl = [_this.editorData[index].ptTextUrl.slice(0,tempIndex),_this.editorData[index].ptTextUrl.slice(tempIndex + 1)];
                tempPtTextUrl = tempPtTextUrl[0].concat(tempPtTextUrl[1]);
                _this.editorData[index].ptTextUrl = tempPtTextUrl.concat();
                $(e.target).parent().remove();
            });

        },
        /**
         cycle, $iptTime1 is required
         $iptTime2 is optional
        **/
        setTimePrecision: function(cycle, $iptTime1, $iptTime2){

            var option = {
                format: "yyyy-mm-dd hh:ii",
                autoclose: true,
                todayBtn: true,
                initialDate: new Date(),
                startView: 2
            }
            $iptTime1.datetimepicker('remove');
            $iptTime2 && $iptTime2.datetimepicker('remove');
            /*
            0 or 'hour' for the hour view
            1 or 'day' for the day view
            2 or 'month' for month view (the default)
            3 or 'year' for the 12-month overview
            4 or 'decade' for the 10-year overview. Useful for date-of-birth datetimepickers.*/
            switch (cycle){
                case 'm1':
                    option.minView = 0;
                    break;
                case 'm5':
                    option.minView = 0;
                    break;
                case 'h1':
                    option.minView = 1;
                    option.format = "yyyy-mm-dd hh:00";
                    break;
                case 'd1':
                    option.minView = 2;
                    option.format = "yyyy-mm-dd 00:00";
                    break;
                case 'M1':
                    option.minView = 3;
                    option.startView = 3;
                    option.format = "yyyy-mm-01 00:00";
                    break;
                default :
                    option.minView = 2;
                    option.format = "yyyy-mm-dd 00:00";
                    break;
            }
            /*$iptTime1.datetimepicker(option);
            $iptTime2 && $iptTime2.datetimepicker(option);*/
            $iptTime1.datetime();
            $iptTime2 && $iptTime2.datetime();
        },
        /**
         * input的data-format 转换为 Date数据格式的format
         */
        getDateFmtByInputFmt: function(inputFmt){
            var arrFmt = inputFmt.split(' ');
            var dtFmt = '';
            for(var i = 0; i < arrFmt.length; i++){
                if(/yyyy(.)mm(.)dd/.test(arrFmt[i])){//
                    dtFmt += arrFmt[i].replace(/mm/, 'MM');
                }
                if(/hh:ii/.test(arrFmt[i])){
                    dtFmt += ' HH:mm';
                }
            }
            return dtFmt;
        }
    };
    return modalConfigurePane;
})();