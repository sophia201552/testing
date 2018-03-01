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
    }
    modalConfigurePane.prototype = {
        show: function(){
            $.get("/static/views/observer/widgets/modalConfigurePane.html").done(function (resultHtml) {
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
            if(!_this.option.dataTypeMaxNum){
                _this.option.dataTypeMaxNum = [];
                for (var i = 0;i<this.option.rowDataType.length;i++){
                    _this.option.dataTypeMaxNum[i] = 5
                }
            }
            this.init();
            $('#modalConfig').modal('show');
        },
        init: function () {
            var $modalConfig = $('#modalConfig');
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
            })
        },
        toggleDataSource: function(bool){
            var colCount = $('#paneContent')[0].classList.contains('col-sm-10');
            if(bool && colCount){
                document.getElementById('rightCt').click();
            }
            if(!bool && !colCount){
                document.getElementById('rightCt').click();
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
            var i;
            var totalModeType ={
                easy:[$divPeriodDropDown],
                fixed:[$divInterval,$divTimeRange],
                recent:[$divInterval,$divPeriod],
                realTime:[],
                easyEnergy:[$divPeriodDropDown],
                realTimeDashboard:[$divRealTimeInterval],
                easyCompareAnalyz:[$divCompareDate],
                easyCompare:[$divComparePeriod],
                compareSensor:[$divInterval,$divComparePeriod,$divCompareDate],
                compareMeter:[$divInterval,$divComparePeriod,$divCompareDate],
                gauge:[$divGauge,$divGaugeMode],
                weather:[],
                easyHistory:[$divHistoryRange]
            };
            //var templateAllowMode = {
            //    AnlzPieRealtime:['realTime'],
            //    AnlzCluster:['easy','fixed','recent'],//十个点
            //    AnlzCluster_AHU:['easy','fixed','recent'],
            //    AnlzCluster_Chiller:['easy','fixed','recent'],
            //    AnlzEnergy:['easyEnergy','fixed','recent'],
            //    AnlzHistory:['easyCompare','compareSensor','compareMeter'],
            //    AnlzScatter:['easy','fixed','recent'],//Y多个，X一个
            //    AnlzSpectrum:['easy','fixed','recent'],//只能一个点
            //    AnlzStack:['easy','fixed','recent'],
            //    AnlzTendency:['easy','fixed','recent'],
            //};
            //}
            //模式选择初始化
            var $dataConfig = $('#dataConfig');
            var $startConfig = $('#startConfig');
            $dataConfig.css('display','block');
            $startConfig.removeClass('alwaysEnable');
            $inputMode.children().css('display','none');
            var modeSelectInit = false;
            for (i = 0; i < _this.option.modeUsable.length; i++) {
                $inputMode.children('option[value=' + _this.option.modeUsable[i] + ']').css('display', 'block');
                if (_this.optionType) {
                    if (sessionStorage.getItem('mode') == _this.option.modeUsable[i] && !modeSelectInit) {
                        $inputMode.val(_this.option.modeUsable[i]);
                        modeSelectInit = true;
                    }
                }else{
                    if (_this.option.modeUsable[i] == 'fixed' && !modeSelectInit) {
                        $inputMode.val('fixed');
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
                    case 'compareSensor' :
                        initCompareDate();
                        break;
                    case 'compareMeter' :
                        initCompareDate();
                        break;
                    case 'weather':
                        $dataConfig.css('display','none');
                        $startConfig.addClass('alwaysEnable');
                        break;
                    case 'easyCompareAnalyz':
                        $inputComparePeriod.val('month');
                        initCompareDate();
                        break;
                    case 'easyCompare' :
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
            }
            $inputInterval.change(function(e){
                sessionStorage.setItem('interval', $(e.target).val());
            });
            function initInterval(mode) {
                $inputInterval.children().addClass('forbid');
                if (mode == 'recent') {
                    //sessionStorage.setItem('periodUnit', $inputPeriodUnit.children(':selected').val());
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
                //if (mode == 'easy') {
                //    sessionStorage.setItem('periodDropDown', $inputPeriodDropDown.val());
                //    switch ($inputPeriodDropDown.val()) {
                //        case 'today' :
                //            firstSelect = 'm5';
                //            secondSelect = 'h1';
                //            break;
                //        case 'threeDay' :
                //            firstSelect = 'h1';
                //            secondSelect = 'd1';
                //            break;
                //        case 'thisWeek':
                //            firstSelect = 'h1';
                //            secondSelect = 'd1';
                //            break;
                //    }
                //}
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
            }
            //时间范围初始化
            if(_this.optionType && sessionStorage.getItem('timeStart') != null){
                $inputTimeStart.val(sessionStorage.getItem('timeStart'));
            }else{
                $inputTimeStart.val(_this.option.optionPara.startTime);
            }
            $inputTimeStart.change(function(e){
                if (e.target.value !=''){
                    sessionStorage.setItem('timeStart', e.target.value)
                }
            });
            if(_this.optionType && sessionStorage.getItem('timeEnd') != null) {
                $inputTimeEnd.val(sessionStorage.getItem('timeEnd'));
            }else {
                $inputTimeEnd.val(_this.option.optionPara.endTime);
            }
            $inputTimeEnd.change(function(e){
                if (e.target.value !=''){
                    sessionStorage.setItem('timeEnd', e.target.value)
                }
            });
            //历史同比时间初始化
            //TODO 历史同比缓存
            if (_this.option.optionPara.timeType && $inputMode.val() == 'easyCompare'){
                $inputComparePeriod.val(_this.option.optionPara.timeType);
            }else if (sessionStorage.getItem('comparePeriod') != null){
                $inputComparePeriod.val(sessionStorage.getItem('comparePeriod'));
            }
            $inputComparePeriod.change(function(){
                sessionStorage.setItem('comparePeriod',$inputComparePeriod.val());
                initCompareDate();
            });
            function initCompareDate(){
                var $compareDate = $('.form_datetime.compare');
                var periodType = $inputComparePeriod.val();
                switch(periodType){
                    case 'hour':
                        $compareDate.datetimepicker('remove');
                        $compareDate.datetimepicker({
                            format: "yyyy-mm-dd hh:ii:ss",
                            minView: "day",
                            startView: 'day',
                            autoclose: true,
                            todayBtn: true,
                            initialDate: new Date()
                        });
                        break;
                    case 'day':
                        $compareDate.datetimepicker('remove');
                        $compareDate.datetimepicker({
                            format: "yyyy-mm-dd",
                            minView: "month",
                            startView: 'month',
                            autoclose: true,
                            todayBtn: true,
                            initialDate: new Date()
                        });
                        break;
                    case 'week':
                        $compareDate.datetimepicker('remove');
                        $compareDate.datetimepicker({
                            format: "yyyy-mm-dd",
                            minView: "month",
                            startView: 'month',
                            autoclose: true,
                            todayBtn: true,
                            initialDate: new Date()
                        });
                        break;
                    case 'month':
                        $compareDate.datetimepicker('remove');
                        $compareDate.datetimepicker({
                            format: "yyyy-mm-dd",
                            minView: "year",
                            startView: 'year',
                            autoclose: true,
                            todayBtn: true,
                            initialDate: new Date()
                        });
                        break;
                };
                //$inputComparePeriod.change(function(){
                //    sessionStorage.setItem('comparePeriod',$inputComparePeriod.val())
                //});
                //$inputCompareDate1.change(function(){
                //    sessionStorage.setItem('compareDate1',$inputCompareDate1.val())
                //});
                //$inputCompareDate2.change(function(){
                //    sessionStorage.setItem('compareDate2',$inputCompareDate2.val())
                //});

                /*$compareDate.on('changeDate', function(ev){
                    if (!ev.timeStamp) return;
                    var dateVal = new Date(ev.timeStamp);
                    var inputShowTxt;
                    if(periodType == 'hour'){
                         inputShowTxt = new Date(ev.timeStamp).format('yyyy-MM-dd HH:mm:ss').substring(0,14) + '00:00';
                    }else{
                        inputShowTxt = new Date(ev.timeStamp).format('yyyy-MM-dd HH:mm:ss').substring(0,11) + '00:00:00';
                    }
                    $(this).val(inputShowTxt);
                });*/
            }

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
            if (_this.option.optionPara.timeType && $inputMode.val() == 'realTimeDashboard'){
                $inputHistoryRange.val(_this.option.optionPara.timeType);
            }else if (sessionStorage.getItem('historyRange') != null){
                $inputHistoryRange.val(sessionStorage.getItem('historyRange'));
            }
            $inputHistoryRange.change(function(){
                sessionStorage.setItem('historyRange',$inputHistoryRange.val());
            });

            //快速配置历史范围初始化
            if (_this.option.optionPara.timeType && $inputMode.val() == 'easyHistory'){
                $inputHistoryRange.val(_this.option.optionPara.timeType);
            }else if (sessionStorage.getItem('historyRange') != null){
                $inputHistoryRange.val(sessionStorage.getItem('historyRange'));
            }
            $inputHistoryRange.change(function(){
                sessionStorage.setItem('historyRange',$inputHistoryRange.val());
            })
            initMode($inputMode.val());
            $inputMode.change(function(e){
                initMode($inputMode.val())
            });
        },
        initConfigData: function(){
            var $dataConfig = $('#dataConfig');
            //var strDataTitle = '<span>'+ I18n.resource.modalConfig.data.DATA_CONFIG_TITLE_TYPE1 + '</span>';
            var strTempDataMaxNum = '<span>'+ I18n.resource.modalConfig.data.DATA_TYPE_MAX_NUM + '</span>';
            var arrTempDataMaxNum = [];
            //$dataConfig.find('span').get(1).outerHTML = strDataTitle;
            //var resetFlag = false;
            //if (_this.option.dataTypeMaxNum.length != 1){
            //    for (var i = 0;i < _this.option.dataTypeMaxNum.length; ++i){
            //        if (_this.option.dataTypeMaxNum[i] !=  _this.option.dataTypeMaxNum[i + 1] && !resetFlag){
            //            $dataConfig.find('span').get(1).outerHTML = '';
            //            i = 0;
            //            resetFlag = true;
            //            break;
            //        }
            //    }
            //}
            //if(resetFlag){
            for (var i = 0;i < _this.option.dataTypeMaxNum.length; ++i){
                arrTempDataMaxNum.push(strTempDataMaxNum.replace('<%maxNum%>',_this.option.dataTypeMaxNum[i]));
                //strDataTitle = strTempDataTitle.replace('<%type%>',_this.option.rowDataType[i]);
                //    strDataTitle = strDataTitle.replace('<%maxNum%>',_this.option.dataTypeMaxNum[i]);
                //    $dataConfig.children().get(0).innerHTML += strDataTitle;
            }
            //}
            var strConfigModalBody = $dataConfig.html();
            for (var i = 0; i < _this.option.rowDataType.length; ++i) {
                strConfigModalBody += '<div class="divConfigData" dataType="' + _this.option.rowDataType[i] + '">\
                                                <div class="dataTypeName">' +
                                                _this.option.rowDataType[i] + arrTempDataMaxNum[i] +
                                                '</div>\
                                                <div class="row rowDataValue"><div class="dataDragTip col-lg-3 col-xs-4"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span></div></div>\
                                    </div>';
            }
            $dataConfig.html(strConfigModalBody);
            var btnStartConfigEnable;
            for(i = 0;i < _this.option.optionPara.dataItem.length;++i){
                var $dataDragTip = $dataConfig.find('[dataType="'+_this.option.optionPara.dataItem[i].dsType +'"]').find('.dataDragTip');
                if ($dataDragTip.length ==0){
                    $dataDragTip = $('.dataDragTip').eq(i);
                }
                var strDSConfig;
                for(var j= 0;j < _this.option.optionPara.dataItem[i].dsId.length;++j) {
                    strDSConfig= '<div class="col-lg-3 col-xs-4 divDSConfigure grow" dsid="' + _this.option.optionPara.dataItem[i].dsId[j] + '"><span class="contentDS">' +
                    _this.option.optionPara.dataItem[i].dsName[j] +
                    '</span><span class="glyphicon glyphicon-remove btnRemoveDS" aria-hidden="true" ></span></div>';
                    $dataDragTip.before(strDSConfig);
                    btnStartConfigEnable = true;
                }
            }
            initDataTipAndButton();
            $('.alwaysEnable').removeClass('disabled');
            $('.divDSConfigure span').on('click', function (e) {
                var $thisPar = $(e.target).parent();
                $thisPar.remove();
                initDataTipAndButton();
            });
            //initDataTipAndButton
            function initDataTipAndButton() {
                var NumOfDataTypeWithValue = 0;
                var $rowDataValue = $('.rowDataValue');
                for (var i =0;i< $rowDataValue.length;++i){
                    if($rowDataValue.eq(i).children().length > 1){
                        NumOfDataTypeWithValue += 1;
                    }
                    if($rowDataValue.eq(i).children().length > _this.option.dataTypeMaxNum[i]){
                        $('.dataDragTip').get(i).style.display = 'none';
                    }else{
                        $('.dataDragTip').get(i).style.display = 'block';
                    }
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
            }
        },
        initTime: function(){
            var $inputTimeStart = $('#inputTimeStart');
            var $inputTimeEnd = $('#inputTimeEnd');
            $inputTimeStart.datetimepicker({
                format: "yyyy-mm-dd hh:ii",
                minView: "hour",
                autoclose: true,
                todayBtn: true,
                initialDate: new Date()
            });
            $inputTimeEnd.datetimepicker({
                format: "yyyy-mm-dd hh:ii",
                minView: "hour",
                autoclose: true,
                todayBtn: true,
                initialDate: new Date()
            });
            if(_this.optionType) {
                var now = new Date();
                var time = new Date(now - 259200000).format('yyyy-MM-dd HH:mm');
                if (!sessionStorage.getItem('timeStart')){
                    $inputTimeStart.val(time);
                }
                now = now.format('yyyy-MM-dd HH:mm');
                if(!sessionStorage.getItem('timeEnd')){
                    $inputTimeEnd.val(now);
                }
            }

            var mode = $('#inputMode').val();
            if(mode == 'easyCompareAnalyz'){
                /*$('.form_datetime.compare').datetimepicker('remove');
                $(".form_datetime.compare").datetimepicker({
                    format: "yyyy-mm-dd",
                    minView: "year",
                    autoclose: true,
                    todayBtn: true,
                    initialDate: new Date()
                });*/
                $('#inputCompareDate1').val(new Date(new Date(new Date().setMonth(new Date().getMonth()-2)).setDate(1)).format('yyyy-MM-dd') + ' 00:00:00');//上上个月第一天00:00:00
                $('#inputCompareDate2').val(new Date(new Date(new Date().setMonth(new Date().getMonth()-1)).setDate(1)).format('yyyy-MM-dd') + ' 00:00:00')//上个月第一天00:00:00
                //minView year
            }
            if(mode == 'compareMeter' || mode == 'compareSensor'){
                $('#inputComparePeriod').change(function(){
                    var thisVal = $(this).val();
                    /*if(thisVal == 'hour'){
                        $('.form_datetime.compare').datetimepicker('remove');
                        $(".form_datetime.compare").datetimepicker({
                            format: "yyyy-mm-dd hh:ii",
                            minView: "day",
                            autoclose: true,
                            todayBtn: true,
                            initialDate: new Date()
                        });
                    }else if(thisVal == 'day' || thisVal == 'week'){
                        $('.form_datetime.compare').datetimepicker('remove');
                        $(".form_datetime.compare").datetimepicker({
                            format: "yyyy-mm-dd",
                            minView: "month",
                            autoclose: true,
                            todayBtn: true,
                            initialDate: new Date()
                        });
                    }else if(thisVal == 'month'){
                        $('.form_datetime.compare').datetimepicker('remove');
                        $(".form_datetime.compare").datetimepicker({
                            format: "yyyy-mm-dd",
                            minView: "year",
                            autoclose: true,
                            todayBtn: true,
                            initialDate: new Date()
                        });
                    }*/
                });
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
            $divConfigData.on('drop',function(e){
                for (var j = 0; j < $divConfigData.length; ++j) {
                    if ($divConfigData.find('.rowDataValue').eq(j).children().length < _this.option.dataTypeMaxNum[j] + 1) {
                        initDragTipShow[j] = true;
                    } else {
                        initDragTipShow[j] = false
                    }
                }
                index = $(e.currentTarget).index() - 1;
                if(!initDragTipShow[index]){
                    new Alert($("#configAlert"), "danger", "<strong>" + I18n.resource.modalConfig.err.TYPE1 + "</strong>").show().close();
                    return;
                }
                var $rowTempData = $(e.currentTarget).find('.rowDataValue');
                var $dataDragTip = $rowTempData.find('.dataDragTip');
                targetId = e.originalEvent.dataTransfer.getData("dsItemId");
                if(targetId == '')return;
                targetContent = AppConfig.datasource.getDSItemById(targetId).alias;
                if ($rowTempData.find('.divDSConfigure[dsid="'+targetId+'"]').length > 0){
                    new Alert($("#configAlert"), "danger", "<strong>" + I18n.resource.modalConfig.err.TYPE2 + "</strong>").show().close();
                    return;
                }
                var strDSConfig =  '<div class="col-lg-3 col-xs-4 divDSConfigure grow" dsid="' + targetId + '"><span class="contentDS">' +
                targetContent +
                '</span><span class="glyphicon glyphicon-remove btnRemoveDS" aria-hidden="true" ></span></div>';
                $dataDragTip.before(strDSConfig);
                initBtnStartAndDragTip(index);

                $(e.currentTarget).find('.divDSConfigure span').last().on('click', function (e) {
                    var $thisPar = $(e.target).parent();
                    var dsid = $thisPar.attr('dsid');
                    $thisPar.remove();
                    initBtnStartAndDragTip(index);
                    var $dataConfig = $('#dataConfig');
                    $dataConfig.height('');
                    if($dataConfig.height() > window.innerHeight - 80){
                        $dataConfig.css('height','100%');
                    }
                });
                var $dataConfig = $('#dataConfig');
                $dataConfig.height('');
                if($dataConfig.height() > window.innerHeight - 80){
                    $dataConfig.css('height','100%');
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
                        if (tempDivDS.length > _this.option.dataTypeMaxNum[indexOfDataType]){
                            initDragTipShow[indexOfDataType] = false;
                        }else{
                            initDragTipShow[indexOfDataType] = true;
                        }
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
                    if (tempDivDS.length > _this.option.dataTypeMaxNum[indexOfDataType]){
                        initDragTipShow[indexOfDataType] = false;
                    }else{
                        initDragTipShow[indexOfDataType] = true;
                    }
                }
                if(initBtnStartEnable > 0){
                    $btnConfigStart.removeClass('disabled');
                }else{
                    $btnConfigStart.addClass('disabled');
                }
                if (initDragTipShow[indexOfDataType]){
                    tempDivDS.last().css('display','block');
                }else{
                    tempDivDS.last().css('display','none');
                }
            }
        },
        initConfigStart: function(){
            var $modalConfig = $('#modalConfig');
            var $inputModal = $('#inputMode');
            document.getElementById('startConfig').onclick = function () {
                var tempStartTime, tempEndTime, tempPeriodTime;
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
                    compareSensor:'compareSensor',
                    compareMeter:'compareMeter',
                    realTimeDashboard:"realTimeDashboard",
                    gauge:'gauge',
                    weather:'weather',
                    easyHistory:"easyHistory"
                };

                switch ($inputModal.val()) {
                    //case totalModeType['easy']:
                    //    now = new Date();
                    //    switch($inputPeriodDropDown.val()){
                    //        case 'today':
                    //            $inputInterval.val('h1');
                    //            tempEndTime = now.format('yyyy-MM-dd HH:mm:ss');
                    //            tempStartTime = getTimeOfMidnightZero(new Date()).format('yyyy-MM-dd HH:mm:ss');
                    //            break;
                    //        case 'yesterday':
                    //            $inputInterval.val('h1');
                    //            var yesterday = new Date();
                    //            yesterday = new Date(yesterday.setDate(yesterday.getDate() - 1));
                    //            tempEndTime = new Date(getTimeOfMidnightZero(now).getTime() - 1000).format('yyyy-MM-dd HH:mm:ss');
                    //            tempStartTime = getTimeOfMidnightZero(yesterday).format('yyyy-MM-dd HH:mm:ss');
                    //            break;
                    //        /*case 'threeDay' :
                    //            $inputInterval.val('h1');
                    //            tempPeriodTime = getDayTime(3);
                    //            break;*/
                    //        case 'thisWeek':
                    //            $inputInterval.val('d1');
                    //            tempEndTime = now.format('yyyy-MM-dd HH:mm:ss');
                    //            tempStartTime = getTimeOfMidnightZero(new Date(now-(now.getDay()) * 86400000)).format('yyyy-MM-dd HH:mm:ss');
                    //            break;
                    //        case 'lastWeek':
                    //            $inputInterval.val('d1');
                    //            tempEndTime = getTimeOfMidnightZero(new Date(now-(now.getDay()+1) * 86400000)).format('yyyy-MM-dd HH:mm:ss');
                    //            tempStartTime = getTimeOfMidnightZero(new Date(now-(now.getDay()+7) * 86400000)).format('yyyy-MM-dd HH:mm:ss');
                    //            break;
                    //        case 'thisYear':
                    //            $inputInterval.val('M1');
                    //            tempEndTime = now.format('yyyy-MM-dd HH:mm:ss');
                    //            tempStartTime = new Date(now.getFullYear(),0,1).format('yyyy-MM-dd HH:mm:ss');
                    //            break;
                    //    }
                    //
                    //    break;
                    case totalModeType['fixed']:
                        tempStartTime = new Date($inputTimeStart.val()).format('yyyy-MM-dd HH:mm:ss');
                        tempEndTime = new Date($inputTimeEnd.val()).format('yyyy-MM-dd HH:mm:ss');
                        if (new Date(tempStartTime) >= new Date(tempEndTime)) {
                            new Alert($("#configAlert"), "danger", "<strong>" + I18n.resource.modalConfig.err.TYPE3 + "</strong>").show().close();
                            return;
                        }
                        if (new Date(tempEndTime) >= new Date()) {
                            new Alert($("#configAlert"), "danger", "<strong>" + I18n.resource.modalConfig.err.TYPE4 + "</strong>").show().close();
                            return;
                        }
                        break;
                    case totalModeType['recent']:
                        tempEndTime = new Date().format('yyyy-MM-dd HH:mm:ss');
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
                        tempInterval = $inputInterval.val();
                        timeType = $('#inputRealTimeInterval').val();
                        break;
                    case totalModeType['easyCompareAnalyz']:
                        tempStartTime = $inputCompareDate1.val();
                        tempEndTime = $inputCompareDate2.val();
                        tempPeriodTime = 'month';
                        $inputInterval.val('h1');
                        timeType = $inputComparePeriod.val();
                        break;
                    case totalModeType['easyCompare']:
                        tempPeriodTime = 'month';
                        $inputInterval.val('h1');
                        timeType = $inputComparePeriod.val();
                        break;
                    case totalModeType['compareSensor']:
                        tempStartTime = $inputCompareDate1.val();
                        tempEndTime = $inputCompareDate2.val();
                        tempPeriodTime = $inputComparePeriod.val();
                        timeType = $inputComparePeriod.val();
                        break;
                    case totalModeType['compareMeter']:
                        tempStartTime = $inputCompareDate1.val();
                        tempEndTime = $inputCompareDate2.val();
                        tempPeriodTime = $inputComparePeriod.val();
                        timeType = $inputComparePeriod.val();
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
                        timeType = $('#inputHistoryRange').val();
                        break;
                    default :
                        break;
                }
                //获取指定日期的午夜零点
                function getTimeOfMidnightZero(date){
                    var tempDate;
                    if(date){
                        tempDate = date
                    }else{
                        tempDate = new Date();
                    }
                    return new Date(date.format('yyyy-MM-dd') + ' 00:00:00');
                }
                if(_this.modalType == "dataAnalysis"){
                    _this.screen.curModal = {
                        startTime: tempStartTime,
                        endTime: tempEndTime,
                        format: $inputInterval.val(),
                        mode: $inputModal.val(),
                        type: _this.option.templateType,
                        itemDS: arrItemDS,
                        comparePeriod: tempPeriodTime
                    };
                }else if(_this.modalType == "dashboard"){
                    _this.templateObj.configParams = {};
                    var $divDSConfigure = $('.divDSConfigure');
                    _this.templateObj.entity.modal.title = $('.springSel .chartTitle').val();
                    _this.templateObj.entity.modal.points = [];
                    _this.templateObj.entity.modal.StartTime = tempStartTime;
                    _this.templateObj.entity.modal.EndTime = tempEndTime;
                    for(var i = 0;i< $divDSConfigure.length;++i){
                        _this.templateObj.entity.modal.points.push($divDSConfigure.get(i).attributes['dsid'].value);
                    }
                    var option={};
                    timeType && (option.timeType = timeType);
                    scaleList && (option.scaleList = scaleList);
                }

                $modalConfig.modal('hide');
                _this.newPageFlag = true;
                //Spinner.spin(ElScreenContainer);
                //alert('预计' + + '秒后生成图表')
                if(_this.modalType == 'dataAnalysis') {
                    _this.screen.renderModal();
                }else if(_this.modalType == 'dashboard'){
                    _this.templateObj.setModalOption(option);
                    _this.templateObj.render();
                }
            }
        },
        close: function(){
            this.screen = null;
            this.container = null;
            this.modalType = null;
        }
    };
    return modalConfigurePane;
})();
