var DiagnosisInfo = (function () {
    var _this;
    function DiagnosisInfo() {
        this.diagnosisDetailInfo =undefined;
        this.$disgnosisDetailInfoModal = undefined;
        _this = this;
    }

    DiagnosisInfo.prototype = {
        show: function (diagnosisDetailInfo) {
            var _this = this;
            this.diagnosisDetailInfo =diagnosisDetailInfo;
            WebAPI.get("/static/views/observer/diagnosis/diagnosisInfo.html").done(function (resultHtml) {
                _this.$disgnosisDetailInfoModal = $('#disgnosisDetailInfoModal');
                if(_this.$disgnosisDetailInfoModal.length===0) {
                    _this.diagnosisDetailInfo.containerScreen.append(resultHtml);
                    _this.$disgnosisDetailInfoModal = $('#disgnosisDetailInfoModal');
                }else{
                    _this.$disgnosisDetailInfoModal.find('.diagnosisTable tbody').html('');
                }
                I18n.fillArea(_this.$disgnosisDetailInfoModal);
                _this.$disgnosisDetailInfoModal.modal('show');
                _this.$disgnosisDetailInfoModal.find('h4.modal-title').text(_this.diagnosisDetailInfo.faultName);
                var timeFormatStr = timeFormatChange('yyyy-mm-dd hh');
                $('#startTimeCog').datetimepicker({
                    format: timeFormatStr+":00:00",
                    autoclose: true,
                    minView:1,
                    startView: 2,
                    forceParse: false
                }).val(new Date(new Date().valueOf()-86400000*7).timeFormat(timeFormatChange('yyyy-mm-dd'))+' 00:00:00');
                $('#endTimeCog').datetimepicker({
                    format: timeFormatStr+":00:00",
                    autoclose: true,
                    minView: 1,
                    forceParse: false,
                    startView:2
                }).val(new Date().timeFormat(timeFormatStr)+':00:00');
                //Spinner.spin($dialog.find('.modal-body')[0]);

                //_this.bindEvent();
                _this.init();
                _this.addEvents();
                Spinner.stop();
            });
        },

        close: function () {
            this.diagnosisDetailInfo = null;
            this.$disgnosisDetailInfoModal.empty().remove();
            this.$disgnosisDetailInfoModal = null;
        },
        addEvents:function(){
            var _this = this;
            $('#checkDiagnosis').off('click').click(function(){
                _this.$disgnosisDetailInfoModal.find('.diagnosisTable tbody').html('');
                var diagType = $(_this.diagnosisDetailInfo.containerScreen.context).find('.diagRanking').attr('data-type');
                var startTime = timeFormat($('#startTimeCog').val(),'yyyy-mm-dd hh:ii:ss');
                var endTime = timeFormat($('#endTimeCog').val(),'yyyy-mm-dd hh:ii:ss');
                if(new Date(startTime).valueOf()>new Date(endTime).valueOf()){
                    alert(I18n.resource.modalConfig.modalApp.TIME_ERROR);
                    return;
                }
                Spinner.spin($('#disgnosisDetailInfoModal')[0]);
                var postData = {
                    //faultName:_this.diagnosisDetailInfo.faultName,
                    value:_this.diagnosisDetailInfo.faultName,
                    type:diagType,
                    startTime:startTime,
                    endTime:endTime,
                    projId: AppConfig.projectId
                }
                WebAPI.post('/diagnosis/getFaultDetails',postData).done(function(faultDetailCl){
                    _this.diagnosisDetailInfo.faultDetailData = faultDetailCl.data;
                    _this.init();
                    Spinner.stop();
                })
                //    .always(function(){
                //    Spinner.stop();
                //});
            });
        },
        init:function(){
            var _this = this;
            var detailInfoData = _this.diagnosisDetailInfo.faultDetailData;
            var timeIntervalObj = _this.timeInterval();
            function unique(arr) {//去重复
                var result = [], hash = {};
                for (var i = 0, elem; (elem = arr[i]) != null; i++) {
                    if (!hash[elem]) {
                        result.push(elem);
                        hash[elem] = true;
                    }
                }
                return result;
            }
            function spectrumCreate(detailInfoData){
                var spectrumDiv='';
                function spectrumDivChild(faultTimeArr){
                    //var rgbArrColor = _this.hslOrRgb(count);
                    var faultTimeArrTime =  unique(faultTimeArr.time);
                    var faultTimeArrCount = faultTimeArr.counts;
                    var spectrumDivCh = '';
                    for(var p = 0;p<faultTimeArrTime.length;p++){
                        var cuerH = parseInt(faultTimeArrTime[p].split(' ')[1]);
                        spectrumDivCh += '<div class="spectrumDivCh" title="'+timeFormat(faultTimeArrTime[p]+':00:00',timeFormatChange('yyyy-mm-dd hh:ii:ss'))+'('+faultTimeArrCount[p]+')'+'" style="width:'+100/24+'%;height:26px;display:inline-block;background:rgba(193, 33, 33, 0.8);position:absolute;top:0;left:'+100*(cuerH-1)/24+'%"></div>'
                    }
                    return spectrumDivCh
                }
                for(var m = 0;m<timeIntervalObj.length;m++){
                    var detailInfoI = timeIntervalObj[m];
                    var faultTimeArr = {};
                    faultTimeArr['time'] = [];
                    faultTimeArr['counts'] = [];
                    for(var n = 0;n<detailInfoI.length;n++){
                        var count = 0;
                        var hourPrimTime =detailInfoI[n].split(' ')[0]+' '+detailInfoI[n].split(' ')[1].split(':')[0];
                        for(var k = 0;k<detailInfoData.arrNoticeTime.length;k++){
                            var noticeTime =detailInfoData.arrNoticeTime[k].Time;
                            var hourCompaTime =noticeTime.split(' ')[0]+' '+noticeTime.split(' ')[1].split(':')[0];
                            if(hourPrimTime==hourCompaTime){
                                count = count+1;
                                faultTimeArr.time.push(hourPrimTime);
                            }
                        }
                        if(count!==0) {
                            faultTimeArr.counts.push(count);
                        }
                    }
                    if(m%2===0){
                        spectrumDiv += '<div class="spectrumDiv" title="'+timeFormat(detailInfoI[0].split(' ')[0],timeFormatChange('yyyy-mm-dd'))+'" style="width:'+100/timeIntervalObj.length+'%;background:-webkit-linear-gradient(top,#f0f4fb,#e4ecf9);position:relative">'+spectrumDivChild(faultTimeArr)+'</div>';
                    }else{
                        var evenColor = '-webkit-linear-gradient(top,#ffffff,#f0f4fb)';
                        spectrumDiv += '<div class="spectrumDiv" title="'+timeFormat(detailInfoI[0].split(' ')[0],timeFormatChange('yyyy-mm-dd'))+'" style="width:'+100/timeIntervalObj.length+'%;background:-webkit-linear-gradient(top,#ffffff,#f0f4fb);position:relative">'+spectrumDivChild(faultTimeArr)+'</div>';
                    }
                }


                //for(var j = 0;j<timeIntervalObj.length;j++){
                //    var count = 0;
                //    var hourPrimTime =timeIntervalObj[j].split(' ')[0]+' '+timeIntervalObj[j].split(' ')[1].split(':')[0];
                //    for(var m = 0;m<detailInfoData.arrNoticeTime.length;m++){
                //        var noticeTime =detailInfoData.arrNoticeTime[m].Time;
                //        var hourCompaTime =noticeTime.split(' ')[0]+' '+noticeTime.split(' ')[1].split(':')[0];
                //        if(hourPrimTime==hourCompaTime){
                //            count = count+1;
                //        }
                //    }
                //    var rgbArrColor = _this.hslOrRgb(count);
                //    if(count===0){
                //        if(parseInt(timeIntervalObj[j].split(' ')[0].split('-')[2])%2===0){
                //            spectrumDiv += '<div class="spectrumDiv" title="'+timeIntervalObj[j]+'" style="width:'+100/timeIntervalObj.length+'%;background:'+rgbArrColor+'"></div>';
                //        }else{
                //            var evenColor = '-webkit-linear-gradient(top,#ffffff,#f0f4fb)';
                //            spectrumDiv += '<div class="spectrumDiv" title="'+timeIntervalObj[j]+'" style="width:'+100/timeIntervalObj.length+'%;background:'+evenColor+'"></div>';
                //        }
                //        //spectrumDiv += '<div class="spectrumDiv" title="'+timeIntervalObj[j]+'" style="width:'+100/timeIntervalObj.length+'%;background:'+rgbArrColor+'"></div>';
                //    }else{
                //        spectrumDiv += '<div class="spectrumDiv spectrumCount" title="'+timeIntervalObj[j]+'('+count+')" style="width:'+100/timeIntervalObj.length+'%;background:'+rgbArrColor+'"></div>';
                //    }
                //}
                return spectrumDiv
            }
            var rankType = $(_this.diagnosisDetailInfo.containerScreen.context).find('.diagRanking').attr('data-type');
            var diagnosisHead = '';
            if(rankType==='equipment'){
                    diagnosisHead = '<tr">\
                        <th  width="20%">'+I18n.resource.modalConfig.modalApp.ZONE+'</th>\
                        <th width="20%">'+I18n.resource.modalConfig.modalApp.TIMES+'</th>\
                        <th>'+I18n.resource.modalConfig.modalApp.FREQUENCY+'</th>\
                        </tr>';
            }else if(rankType==='zone'){
                diagnosisHead = '<tr">\
                        <th  width="30%">'+I18n.resource.modalConfig.modalApp.ZONE+'</th>\
                        <th>'+I18n.resource.modalConfig.modalApp.FREQUENCY+'</th>\
                        </tr>';
            }else{
                diagnosisHead = '<tr">\
                        <th  width="15%">'+I18n.resource.modalConfig.modalApp.ZONE+'</th>\
                        <th  width="15%">'+I18n.resource.modalConfig.modalApp.EQUIPMENT+'</th>\
                        <th width="15%">'+I18n.resource.modalConfig.modalApp.TIMES+'</th>\
                        <th>'+I18n.resource.modalConfig.modalApp.FREQUENCY+'</th>\
                        </tr>';
            }
            _this.$disgnosisDetailInfoModal.find('.diagnosisTable thead').html('');
            _this.$disgnosisDetailInfoModal.find('.diagnosisTable thead').append(diagnosisHead);
            for(var i = 0;i<detailInfoData.length;i++){
                var diagnosisDetailTr = '';
                if(rankType==='equipment'){
                    diagnosisDetailTr = '<tr class="diagnosisDetailTr" data-faultId="'+detailInfoData[i].FaultId+'">\
                        <td>'+detailInfoData[i].SubBuildingName+'</td>\
                        <td>'+detailInfoData[i].arrNoticeTime.length+'</td>\
                        <td class="spectrumCommen">'+
                            spectrumCreate(detailInfoData[i])
                        +'</td>\
                        </tr>';
                }else if(rankType==='zone'){
                    diagnosisDetailTr = '<tr class="diagnosisDetailTr" data-faultId="'+detailInfoData[i].FaultId+'">\
                        <td>'+detailInfoData[i].SubBuildingName+'</td>\
                        <td class="spectrumCommen">'+
                            spectrumCreate(detailInfoData[i])
                        +'</td>\
                        </tr>';
                }else{
                    diagnosisDetailTr = '<tr class="diagnosisDetailTr" data-faultId="'+detailInfoData[i].FaultId+'">\
                        <td>'+detailInfoData[i].SubBuildingName+'</td>\
                        <td>'+detailInfoData[i].EquipmentName+'</td>\
                        <td>'+detailInfoData[i].arrNoticeTime.length+'</td>\
                        <td class="spectrumCommen">'+
                            spectrumCreate(detailInfoData[i])
                        +'</td>\
                        </tr>';
                }
                 _this.$disgnosisDetailInfoModal.find('.diagnosisTable tbody').append(diagnosisDetailTr);
            }
        },
        hslOrRgb:function(n){
            //十六进制颜色值的正则表达式
            var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
            String.prototype.colorRgb = function () {
                var sColor = this.toLowerCase();
                if (sColor && reg.test(sColor)) {
                    if (sColor.length === 4) {
                        var sColorNew = "#";
                        for (var i = 1; i < 4; i += 1) {
                            sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
                        }
                        sColor = sColorNew;
                    }
                    //处理六位的颜色值
                    var sColorChange = [];
                    for (var i = 1; i < 7; i += 2) {
                        sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
                    }
                    return "RGB(" + sColorChange.join(",") + ")";
                } else {
                    return sColor;
                }
            };
            function rgbToHsl(r, g, b) {
                r /= 255, g /= 255, b /= 255;
                var max = Math.max(r, g, b), min = Math.min(r, g, b);
                var h, s, l = (max + min) / 2;

                if (max == min) {
                    h = s = 0; // achromatic
                } else {
                    var d = max - min;
                    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                    switch (max) {
                        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                        case g: h = (b - r) / d + 2; break;
                        case b: h = (r - g) / d + 4; break;
                    }
                    h /= 6;
                }

                return [h, s, l];
            }
            function hslToRgb(h, s, l) {
                var r, g, b;

                if (s == 0) {
                    r = g = b = l; // achromatic
                } else {
                    var hue2rgb = function hue2rgb(p, q, t) {
                        if (t < 0) t += 1;
                        if (t > 1) t -= 1;
                        if (t < 1 / 6) return p + (q - p) * 6 * t;
                        if (t < 1 / 2) return q;
                        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                        return p;
                    }

                    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                    var p = 2 * l - q;
                    r = hue2rgb(p, q, h + 1 / 3);
                    g = hue2rgb(p, q, h);
                    b = hue2rgb(p, q, h - 1 / 3);
                }

                return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
            }

            var colorBasic = '#055197';//'#2e6da4';
            var rgb = colorBasic.colorRgb().split("(")[1].split(")")[0];

            var r = rgb.split(",")[0];
            var g = rgb.split(",")[1];
            var b = rgb.split(",")[2];
            var hsl = rgbToHsl(r, g, b);
            var hslCo;
            if(n===0){
                hsl[2] = 1;
            }else if(n===1){
                hsl[2] = 0.92;
                hslCo = 0.88;
            }else{
                hsl[2] = 96-n*3<10?10:(96-n*3);
                hsl[2] = hsl[2]/100;
                
                hslCo = 96-n*5<10?10:(96-n*5);
                hslCo = hslCo/100
            }
            var rgbStartColor = hslToRgb(hsl[0], hsl[1], hsl[2]);
            var rgbStartColor1 =hslToRgb(hsl[0], hsl[1], hslCo);
            if(n===0) {
                //return 'rgb(' + rgbStartColor[0] + ',' + rgbStartColor[1] + ',' + rgbStartColor[2] + ')';
                return '-webkit-linear-gradient(top,#f0f4fb,#e4ecf9)';//#eff3fc,#dce7f7
            }else {
                return 'rgba(193, 33, 33, 0.8)';
                //return '-webkit-linear-gradient(top,rgb('+ rgbStartColor[0] + ',' + rgbStartColor[1] + ',' + rgbStartColor[2] + '),rgb(' + rgbStartColor1[0] + ',' + rgbStartColor1[1] + ',' + rgbStartColor1[2] + '))';
                //return '-webkit-gradient(linear,center top,center bottom,from(rgb('+ rgbStartColor[0] + ',' + rgbStartColor[1] + ',' + rgbStartColor[2] + ')), to(rgb(' + rgbStartColor1[0] + ',' + rgbStartColor1[1] + ',' + rgbStartColor1[2] + ')))';
            }
        },
        timeInterval:function(){
            var timeIntervalObj = {};
            var startTimeCogVal = timeFormat($('#startTimeCog').val(), 'yyyy-mm-dd hh:ii:ss');
            var endTimeCogVal = timeFormat($('#endTimeCog').val(),'yyyy-mm-dd hh:ii:ss');
            var startYear = parseInt(startTimeCogVal.split('-')[0]);
            var startMonth = parseInt(startTimeCogVal.split('-')[1]);
            var startDay = parseInt(startTimeCogVal.split(' ')[0].split('-')[2]);
            var endYear = parseInt(endTimeCogVal.split('-')[0]);
            var endMonth = parseInt(endTimeCogVal.split('-')[1]);
            var endDay = parseInt(endTimeCogVal.split(' ')[0].split('-')[2]);
            var startHour = parseInt(startTimeCogVal.split(' ')[1].split(':')[0]);
            startHour = startHour===0?24:startHour;

            var endHour = parseInt(endTimeCogVal.split(' ')[1].split(':')[0]);
            endHour = endHour===0?24:endHour;
            var monthLength = 0;//开始时间与结束时间的间隔小时数
            var monthArrCount = [];//开始时间与结束时间的间隔小时数组
            var monthDayArr = [];//以一天做间隔的二维数组如[[2016-09-09 00:00:00...2016-09-09 23:00:00],[2016-09-10 00:00:00...2016-09-10 23:00:00]]
            if(new Date(startTimeCogVal).valueOf()>new Date(endTimeCogVal).valueOf()){
                alert(I18n.resource.modalConfig.modalApp.TIME_ERROR);
                return;
            }
            if(endYear-startYear>1){
                alert(I18n.resource.modalConfig.modalApp.TIME_INTERVAL);
                return;
            }else{
                if(startMonth===endMonth){
                    if(startDay===endDay){
                        var monthDay = [];//一天的小时间隔数组；
                        startHour = startHour===24?0:startHour;
                        var intervalHour = endHour-startHour;
                        monthLength+=intervalHour+1;
                        for(var i = 0;i<=intervalHour;i++){
                            var currentTimes
                            var startHourF = startHour+i>9?(startHour+i):('0'+(startHour+i).toString());
                            if(startHourF===24){
                                startHourF='00';
                                currentTimes = startYear+'-'+(startMonth>9?startMonth:('0'+startMonth.toString()))+'-'+(startDay+1>9?(startDay+1):('0'+(startDay+1).toString()))+' '+startHourF+':00:00';
                                monthArrCount.push(currentTimes);
                                monthDay.push(currentTimes);
                            }else{
                                currentTimes = startYear+'-'+(startMonth>9?startMonth:('0'+startMonth.toString()))+'-'+(startDay>9?startDay:('0'+startDay.toString()))+' '+startHourF+':00:00';
                                monthArrCount.push(currentTimes);
                                monthDay.push(currentTimes);
                            }
                        }
                        monthDayArr.push(monthDay);
                    }else{
                        startHour = startHour===24?0:startHour;
                        var startDayHour =24 - startHour+1;
                        //开始时刻的时间间隔
                        monthLength += startDayHour;
                        var monthDay = [];
                        for(var i = 0;i<startDayHour;i++){
                            var currentTimes;
                            var startDayHourF = startHour+i>9?(startHour+i):('0'+(startHour+i).toString());
                            //startDayHourF = startDayHourF===24?'00':startDayHourF;
                            if(startDayHourF===24){
                                startDayHourF='00';
                                currentTimes = startYear+'-'+(startMonth>9?startMonth:('0'+startMonth.toString()))+'-'+(startDay+1>9?(startDay+1):('0'+(startDay+1).toString()))+' '+startDayHourF+':00:00';
                                monthArrCount.push(currentTimes);
                                monthDay.push(currentTimes);
                            }else{
                                currentTimes = startYear+'-'+(startMonth>9?startMonth:('0'+startMonth.toString()))+'-'+(startDay>9?startDay:('0'+startDay.toString()))+' '+startDayHourF+':00:00'
                                monthArrCount.push(currentTimes);
                                monthDay.push(currentTimes);
                            }
                            //monthArrCount.push(startYear+'-'+(startMonth>9?startMonth:('0'+startMonth.toString()))+'-'+(startDay>9?startDay:('0'+startDay.toString()))+' '+startDayHourF+':00:00');
                        }
                        monthDayArr.push(monthDay);
                        //中间时刻的间隔
                        if(endDay-startDay>1){
                            var intervalDays = endDay-startDay;
                            for(var i = 1;i<intervalDays;i++){
                                var monthDays = [];
                                monthLength+=24;
                                for(var j =1;j<=24;j++ ){
                                    var currentTimes;
                                    var endHourCur = (j>9?j:'0'+j.toString());
                                    //endHourCur = endHourCur===24?'00':endHourCur;
                                    if(endHourCur===24){
                                        endHourCur='00';
                                        currentTimes =startYear+'-'+(startMonth>9?(startMonth):('0'+(startMonth).toString()))+'-'+(startDay+i+1>9?(startDay+i+1):('0'+(startDay+i+1).toString()))+' '+endHourCur+':00:00' ;
                                        monthArrCount.push(currentTimes);
                                        monthDays.push(currentTimes);
                                    }else{
                                        currentTimes = startYear+'-'+(startMonth>9?(startMonth):('0'+(startMonth).toString()))+'-'+(startDay+i>9?(startDay+i):('0'+(startDay+i).toString()))+' '+endHourCur+':00:00';
                                        monthArrCount.push(currentTimes);
                                        monthDays.push(currentTimes);
                                    }
                                    //monthArrCount.push(startYear+'-'+(startMonth>9?(startMonth):('0'+(startMonth).toString()))+'-'+(startDay+1>9?(startDay+1):('0'+(startDay+1).toString()))+' '+endHourCur+':00:00');
                                }
                               monthDayArr.push(monthDays);
                            }
                        }
                        //最后时刻的时间间隔
                        var monthDayss = [];
                        monthLength+=endHour;
                        if(endHour===1){
                            monthArrCount.push(startYear+'-'+(endMonth>9?endMonth:('0'+endMonth.toString()))+'-'+(endDay>9?endDay:('0'+endDay.toString()))+' '+'01:00:00');
                            monthDayss.push(startYear+'-'+(endMonth>9?endMonth:('0'+endMonth.toString()))+'-'+(endDay>9?endDay:('0'+endDay.toString()))+' '+'01:00:00');
                        }else{
                            for(var i = 1;i<=endHour;i++){
                                var currentTimes;
                                var endHourCue = i>9?i:'0'+i.toString();
                                //endHourCue = endHourCue===24?'00':endHourCue;
                                if(endHourCue===24){
                                    endHourCue='00';
                                    currentTimes = startYear+'-'+(endMonth>9?endMonth:('0'+endMonth.toString()))+'-'+(endDay+1>9?(endDay+1):('0'+(endDay+1).toString()))+' '+endHourCue+':00:00'
                                    monthArrCount.push(currentTimes);
                                    monthDayss.push(currentTimes);
                                }else{
                                    currentTimes = startYear+'-'+(endMonth>9?endMonth:('0'+endMonth.toString()))+'-'+(endDay>9?endDay:('0'+endDay.toString()))+' '+endHourCue+':00:00'
                                   monthArrCount.push(currentTimes);
                                   monthDayss.push(currentTimes);
                                }
                                //monthArrCount.push(startYear+'-'+(endMonth>9?endMonth:('0'+endMonth.toString()))+'-'+(endDay>9?endDay:('0'+endDay.toString()))+' '+endHourCue+':00:00');
                            }
                        }
                        monthDayArr.push(monthDayss);
                    }
                }else{
                    //if(endMonth-startMonth>1)
                    startHour = startHour===24?0:startHour;
                    var startDayHour =24 - startHour+1;
                    //开始时刻的时间间隔
                    monthLength += startDayHour;
                    var monthDays = [];
                    for(var i = 0;i<startDayHour;i++){
                        var startDayHourF = startHour+i>9?(startHour+i):('0'+(startHour+i).toString());
                        //startDayHourF = startDayHourF===24?'00':startDayHourF;
                        var currentTimes;
                        if(startDayHourF===24){
                            startDayHourF='00';
                            currentTimes = startYear+'-'+(startMonth>9?startMonth:('0'+startMonth.toString()))+'-'+(startDay+1>9?(startDay+1):('0'+(startDay+1).toString()))+' '+startDayHourF+':00:00'
                            monthArrCount.push(currentTimes);
                            monthDays.push(currentTimes);
                        }else{
                            currentTimes = startYear+'-'+(startMonth>9?startMonth:('0'+startMonth.toString()))+'-'+(startDay>9?startDay:('0'+startDay.toString()))+' '+startDayHourF+':00:00'
                            monthArrCount.push(currentTimes);
                            monthDays.push(currentTimes);
                        }
                        //monthArrCount.push(startYear+'-'+(startMonth>9?startMonth:('0'+startMonth.toString()))+'-'+(startDay>9?startDay:('0'+startDay.toString()))+' '+startDayHourF+':00:00');
                    }
                    monthDayArr.push(monthDays);
                    var startMonthDCount = new Date(startYear,startMonth,0).getDate();
                    var intervalDay = startMonthDCount-startDay;
                    for(var i = 1;i<=intervalDay;i++){
                        var monthDay = [];
                        var pushStartDay = (startDay+i)>9?(startDay+i):('0'+(startDay+i).toString());
                        var pushStartDay1 = (startDay+i+1)>9?(startDay+i+1):('0'+(startDay+i+1).toString());
                        monthLength+=24;
                        for(var j = 1;j<=24;j++){
                            var currentTimes;
                            var pushDayHourCound =  j>9?j:('0'+j.toString());
                            //pushDayHourCound = pushDayHourCound===24?'00':pushDayHourCound;
                            if(pushDayHourCound===24){
                                pushDayHourCound='00';
                                if(pushStartDay1>startMonthDCount){
                                    startMonth = startMonth+1;
                                    pushStartDay1 = '01';
                                }
                                currentTimes = startYear+'-'+(startMonth>9?startMonth:('0'+startMonth.toString()))+'-'+pushStartDay1+' '+pushDayHourCound+':00:00';
                               monthArrCount.push(currentTimes);
                                monthDay.push(currentTimes);
                            }else{
                               currentTimes = startYear+'-'+(startMonth>9?startMonth:('0'+startMonth.toString()))+'-'+pushStartDay+' '+pushDayHourCound+':00:00'
                               monthArrCount.push(currentTimes);
                                monthDay.push(currentTimes);
                            }
                            //monthArrCount.push(startYear+'-'+(startMonth>9?startMonth:('0'+startMonth.toString()))+'-'+pushStartDay+' '+pushDayHourCound+':00:00');
                        }
                        monthDayArr.push(monthDay);
                    }
                    //中间时刻的计算
                    var startMonthArr = endMonth-startMonth;
                    if(endMonth-startMonth>1){
                        var monthHourArr = endMonth-startMonth;
                        for(var i = 1;i<monthHourArr;i++){
                            var currentMonths = startMonth+i>9?(startMonth+i):('0'+(startMonth+i).toString());
                            var currentMonthDays = new Date(startYear,currentMonths,0).getDate();
                            for(var j = 1;j<=currentMonthDays;j++){
                                var monthDay = [];
                                var currentMonthDay = j>9?j:('0'+j.toString());
                                var currentMonthDay1 = j+1>9?j+1:('0'+(j+1).toString());
                                monthLength+=24;
                                for(var k = 1;k<=24;k++){
                                    var currentTimes;
                                    var currentMonthDayHour =  k>9?k:('0'+k.toString());
                                    //currentMonthDayHour = currentMonthDayHour===24?'00':currentMonthDayHour;
                                    if(currentMonthDayHour===24){
                                        currentMonthDayHour='00';
                                        currentTimes = startYear+'-'+currentMonths+'-'+currentMonthDay1+' '+currentMonthDayHour+':00:00';
                                       monthArrCount.push(currentTimes);
                                        monthDay.push(currentTimes);
                                    }else{
                                        currentTimes = startYear+'-'+currentMonths+'-'+currentMonthDay+' '+currentMonthDayHour+':00:00'
                                       monthArrCount.push(currentTimes);
                                        monthDay.push(currentTimes);
                                    }
                                    //monthArrCount.push(startYear+'-'+currentMonths+'-'+currentMonthDay+' '+currentMonthDayHour+':00:00');
                                }
                               monthDayArr.push(monthDay);
                            }
                        }
                    }
                    //最后时刻的时间间隔
                    var endMonthGe = endMonth>9?endMonth:('0'+endMonth.toString());
                    for(var i = 1;i<endDay;i++){
                        var monthDay = [];
                        var currendEndDay = i>9?i:('0'+i.toString());
                        var currendEndDay1 = i+1>9?i+1:('0'+(i+1).toString());
                         monthLength+=24;
                        for(var j = 1;j<=24;j++){
                            var currentTimes;
                            var currentEndDayHours =  j>9?j:('0'+j.toString());
                            //currentEndDayHours = currentEndDayHours===24?'00':currentEndDayHours;
                            if(currentEndDayHours===24){
                                currentEndDayHours='00';
                                currentTimes = startYear+'-'+endMonthGe+'-'+currendEndDay1+' '+currentEndDayHours+':00:00'
                               monthArrCount.push(currentTimes);
                                monthDay.push(currentTimes);
                            }else{
                                currentTimes = startYear+'-'+endMonthGe+'-'+currendEndDay+' '+currentEndDayHours+':00:00'
                               monthArrCount.push(currentTimes);
                                monthDay.push(currentTimes);
                            }
                            //monthArrCount.push(startYear+'-'+endMonthGe+'-'+currendEndDay+' '+currentEndDayHours+':00:00');
                        }
                        monthDayArr.push(monthDay);
                    }
                    monthLength+=endHour;
                    var monthDayF = [];
                    if(endHour===1){
                        monthArrCount.push(startYear+'-'+endMonthGe+'-'+(endDay>9?endDay:('0'+endDay.toString()))+' '+'01:00:00');
                        monthDayF.push(startYear+'-'+endMonthGe+'-'+(endDay>9?endDay:('0'+endDay.toString()))+' '+'01:00:00');
                    }else{
                        for(var i = 1;i<=endHour;i++){
                            var currentTimes = startYear+'-'+endMonthGe+'-'+(endDay>9?endDay:('0'+endDay.toString()))+' '+(i>9?i:('0'+i.toString()))+':00:00';
                            monthArrCount.push(currentTimes);
                            monthDayF.push(currentTimes);
                        }
                    }
                     monthDayArr.push(monthDayF);
                }
            }
            timeIntervalObj['timeIntervalCount'] = monthLength;
            timeIntervalObj['timeIntervalArr'] = monthArrCount;
            for(var k = 0;k<monthDayArr.length-1;k++){
                var arrFirst = monthDayArr[k].pop();
                monthDayArr[k+1].splice(0, 0, arrFirst);
            }
            return monthDayArr;//monthArrCount;
        }
    }
    return DiagnosisInfo;
})();