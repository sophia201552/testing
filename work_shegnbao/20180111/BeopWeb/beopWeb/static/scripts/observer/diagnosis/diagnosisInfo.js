var DiagnosisInfo = (function() {
    var _this;

    function DiagnosisInfo(opt) {
        $('.diagnosisInfo').remove();
        this.diagnosisDetailInfo = undefined;
        this.$disgnosisDetailInfoModal = undefined;
        this.optFilter = undefined; //筛选fault的条件, 方便跳转到ROI等页面时使用
        this.isMobile = false;
        _this = this;
        if (opt) { //是否显示ROI按钮,默认隐藏
            this.isShowROI = !!opt.isShowROI;
        }
    }

    DiagnosisInfo.prototype = {
        show: function(diagnosisDetailInfo, opt) {
            var _this = this;
            this.diagnosisDetailInfo = diagnosisDetailInfo;
            if (opt && !$.isEmptyObject(opt)) {
                this.optFilter = opt;
            } else {
                this.optFilter = [{ type: 'fault', value: diagnosisDetailInfo.faultName }];
            }
            this.isMobile = this.diagnosisDetailInfo.isMobile ? true : false;
            var url = this.diagnosisDetailInfo.isMobile ? '/static/views/observer/diagnosis/diagnosisInfoForMobile.html' : '/static/views/observer/diagnosis/diagnosisInfo.html';
            var $htmlPromise = $.Deferred();
            _this.$disgnosisDetailInfoModal = $('#disgnosisDetailInfoModal');
            if (_this.$disgnosisDetailInfoModal.length === 0) {
                if (this.diagnosisDetailInfo.isMobile) {
                    SpinnerControl && SpinnerControl.show()
                }
                WebAPI.get(url).done(function(resultHtml) {
                    _this.diagnosisDetailInfo.containerScreen.append(resultHtml);
                    _this.diagnosisDetailInfo.containerScreen.show();
                    _this.$disgnosisDetailInfoModal = $('#disgnosisDetailInfoModal');
                    $htmlPromise.resolve();
                }).always(function() {
                    if (_this.diagnosisDetailInfo.isMobile) {
                        SpinnerControl && SpinnerControl.hide()
                    }
                })
            } else {
                _this.$disgnosisDetailInfoModal.find('.diagnosisTable tbody').html('');
                $htmlPromise.resolve();
            }
            //隐藏ROI按钮
            $htmlPromise.done(function() {
                if (!_this.isShowROI) {
                    $('.btnROI', _this.$disgnosisDetailInfoModal).hide();
                }
                I18n.fillArea(_this.$disgnosisDetailInfoModal);
                _this.$disgnosisDetailInfoModal.modal('show');
                var currentType = _this.diagnosisDetailInfo.diagType;
                _this.$disgnosisDetailInfoModal.find('h4.modal-title').text(_this.diagnosisDetailInfo.faultName);
                var timeFormatStr = timeFormatChange('yyyy-mm-dd hh:ii');

                var startTime = new Date();
                var endTime = new Date();
                startTime.setDate(1);
                //结束时间精确到5分钟 比如16:28 --> 16:25
                endTime.setMinutes(endTime.getMinutes() - endTime.getMinutes() % 5);

                $('#startTimeCog').datetimepicker({
                    format: timeFormatStr,
                    autoclose: true,
                    minView: 0,
                    startView: 2,
                    forceParse: false
                }).val(startTime.timeFormat(timeFormatChange('yyyy-mm-dd')) + ' 00:00');
                $('#endTimeCog').datetimepicker({
                    format: timeFormatStr,
                    autoclose: true,
                    minView: 0,
                    forceParse: false,
                    startView: 2
                }).val(endTime.timeFormat(timeFormatStr));
                //Spinner.spin($dialog.find('.modal-body')[0]);

                //_this.bindEvent();
                _this.init();
                _this.addEvents();
                Spinner.stop();
            });
        },

        close: function() {
            this.diagnosisDetailInfo = null;
            this.$disgnosisDetailInfoModal.empty().remove();
            this.$disgnosisDetailInfoModal = null;
            this.$wrapSpectrum.empty().remove();
            this.$wrapSpectrum = null;
        },
        addEvents: function() {
            var _this = this;
            //频谱图查询
            $('#checkDiagnosis').off('click').click(function() {
                _this.$disgnosisDetailInfoModal.find('.diagnosisTable tbody').html('');
                var currentType = $(_this.diagnosisDetailInfo.containerScreen.context).find('.diagRanking').attr('data-type');
                var diagType = currentType ? currentType : _this.diagnosisDetailInfo.diagType;
                var startTime = timeFormat($('#startTimeCog').val() + ':00', 'yyyy-mm-dd hh:ii:ss');
                var endTime = timeFormat($('#endTimeCog').val() + ':00', 'yyyy-mm-dd hh:ii:ss');
                if (new Date(startTime).valueOf() > new Date(endTime).valueOf()) {
                    alert(I18n.resource.diagnosis.diagnosisROI.MSG_CHECK_TIME);
                    return;
                }
                Spinner.spin($('#disgnosisDetailInfoModal')[0]);
                var postData = {
                    //faultName:_this.diagnosisDetailInfo.faultName,
                    value: _this.diagnosisDetailInfo.faultName,
                    type: diagType,
                    startTime: startTime,
                    endTime: endTime,
                    projId: AppConfig.projectId
                }
                WebAPI.post('/diagnosis/getFaultDetails', postData).done(function(faultDetailCl) {
                        _this.diagnosisDetailInfo.faultDetailData = faultDetailCl.data;
                        _this.init();
                        Spinner.stop();
                    })
                    //    .always(function(){
                    //    Spinner.stop();
                    //});
            });
            //发送工单按钮
            $('#sendOrder').off('click').click(function() {
                var resultData = _this.diagnosisDetailInfo.faultDetailData;
                var nowZeroValue = new Date(new Date().format('yyyy-MM-dd 00:00:00')).valueOf();
                var desc = '', zone = '',  startTime = '', endTime = '', monent = '';
                var descArr = [], description = [], errorTime = [];
                var wiInstance;
                var pointList = resultData[0].arrNoticeTime[0].Points, 
                    equipmentName = [];

                function unique(arr) {
                    var result = [],
                        hash = {};
                    for (var i = 0, elem;
                        (elem = arr[i]) != null; i++) {
                        if (!hash[elem]) {
                            result.push(elem);
                            hash[elem] = true;
                        }
                    }
                    return result;
                }
                for (var i = 0; i < resultData.length; i++) {
                    var item = resultData[i].arrNoticeTime;
                    zone = resultData[i].SubBuildingName;
                    errorTime = [];
                   
                    if (item && item.length > 0) {
                        for (var j = 0; j < item.length; j++) {
                            var itemValueOf = new Date(item[j].Time).valueOf();
                            //if(itemValueOf>=nowZeroValue){
                            descArr.push('' + item[j].EquipmentName + ':' + item[j].FaultName + ''+item[j].Time);
/*                            startTime = item[j].Time ? item[j].Time : '-';
                            endTime = item[j].EndTime ? item[j].EndTime : '-';
                            errorTime.push(startTime + ' ~ ' + endTime);*/
                            // }                          
                        }
                        equipmentName.push(item[0].EquipmentName)
                    }
                description.push('' + resultData[i].EquipmentName + ' ' + zone + ':' + resultData[i].Description);    
                }

                var back = function() {
                    wiInstance = null;
                };
                descArr = unique(descArr);
                desc = descArr.join('\n');
                monent = resultData[0].arrNoticeTime[0].Time;
                //desc = desc.substring(0,desc.length-2);
                if (_this.diagnosisDetailInfo.diagType === 'fault'){
                    description = description.join('\n');
                } else {
                    description = ''
                }
                wiInstance = new WorkflowInsert({
                    zone: zone,
                    equipmentName: equipmentName.join(','),
                    noticeId: '',
                    title: _this.diagnosisDetailInfo.faultName,
                    detail: desc,
                    dueDate: new Date(+new Date() + 172800000).format('yyyy-MM-dd'), //结束时间为两天后
                    critical: 2,
                    projectId: AppConfig.projectId,
                    chartPointList: pointList,
                    chartQueryCircle: 'm5',
                    description: description,
                    name: _this.diagnosisDetailInfo.faultName + '(' + equipmentName + ')',
                    arrayEquipment: resultData,
                    time: new Date().format('yyyy-MM-dd HH:mm:ss'),
                    chartStartTime: new Date(new Date(monent).getTime() - 3 * 60 * 60 * 1000).format('yyyy-MM-dd HH:mm:ss'), //报警发生前三个小时3 * 60 * 60 * 1000
                    chartEndTime: new Date(new Date(monent).getTime() + 3 * 60 * 60 * 1000).format('yyyy-MM-dd HH:mm:ss') //报警发生后三个小时 3* 60 * 60 * 1000
                });
                wiInstance.show().submitSuccess(function(taskModelInfo, uploadFiles) {
                    //insertCallback(taskModelInfo);
                    this.close();
                    back();
                }).cancel(function() {
                    back();
                }).fail(function() {
                    Alert.danger($("#workflow-insert-container"), I18n.resource.workflow.main.CREATE_WORKFLOW_FAILED).showAtTop(2000);
                });
                return
            });
            if (this.isShowROI) {
                //跳转到ROI
                $('#btnROI').off('click').on('click', function(e) {
                    var initData = {
                        parent: _this.$disgnosisDetailInfoModal[0], //('#faultInfoBox'),
                        filter: _this.optFilter
                    }
                    _this.$wrapSpectrum && _this.$wrapSpectrum.hide();
                    _this.$disgnosisDetailInfoModal && _this.$disgnosisDetailInfoModal.find('.modal-dialog').css({ height: '100%' });
                    new DiagnosisROI(initData).show();
                });
                //显示频谱图详情
                $('.diagnosisTable tbody').off('click').on('click', 'tr', function(e) {
                    $(e.currentTarget).addClass('selected').siblings().removeClass('selected');
                    _this.showDetailModal(e);
                });
            }
        },
        init: function() {
            var _this = this;
            var detailInfoData = _this.diagnosisDetailInfo.faultDetailData;

            var pageCount = 20;
            var tatalPage = Math.ceil(detailInfoData.length / pageCount);
            var pageIndex = 0;


            var rankType = $(_this.diagnosisDetailInfo.containerScreen.context).find('.diagRanking').attr('data-type');
            var diagnosisHead = '';
            if (rankType === 'equipment') {
                diagnosisHead = '<tr">\
                        <th  width="20%">' + I18n.resource.modalConfig.modalApp.ZONE + '</th>\
                        <th>' + I18n.resource.modalConfig.modalApp.FREQUENCY + '</th>\
                        </tr>';
            } else if (rankType === 'zone') {
                diagnosisHead = '<tr">\
                        <th  width="30%">' + I18n.resource.modalConfig.modalApp.ZONE + '</th>\
                        <th>' + I18n.resource.modalConfig.modalApp.FREQUENCY + '</th>\
                        </tr>';
            } else {
                diagnosisHead = '<tr">\
                        <th  width="15%">' + I18n.resource.modalConfig.modalApp.ZONE + '</th>\
                        <th  width="15%">' + I18n.resource.modalConfig.modalApp.EQUIPMENT + '</th>\
                        <th>' + I18n.resource.modalConfig.modalApp.FREQUENCY + '</th>\
                        </tr>';
            }
            _this.$disgnosisDetailInfoModal.find('.diagnosisTable thead').html('');
            _this.$disgnosisDetailInfoModal.find('.diagnosisTable thead').append(diagnosisHead);

            $('#btnLoadMore').off('click').remove();
            if (tatalPage > 1) { //大于1页
                var arrRender = _this.diagnosisDetailInfo.faultDetailData.slice(pageIndex * pageCount, (++pageIndex) * pageCount);
                var $btnMore = $('<div id="btnLoadMore" style="text-align:center;padding: 15px;cursor:pointer;">' + I18n.resource.workflow.pageInfo.LOAD_MORE + '</div>');
                $btnMore.off('click').on('click', function(e) {
                    arrRender = _this.diagnosisDetailInfo.faultDetailData.slice(pageIndex * pageCount, (++pageIndex) * pageCount);
                    arrRender.length > 0 && _this.renderData(arrRender);

                    if (pageIndex * pageCount >= _this.diagnosisDetailInfo.faultDetailData.length) {
                        $btnMore.off('click').text(I18n.resource.workflow.pageInfo.LOAD_COMPLETE).css({ cursor: 'initial' });
                    }
                });
                this.renderData(arrRender);
                $('.diagnosisAllBox').append($btnMore);
            } else {
                this.renderData(_this.diagnosisDetailInfo.faultDetailData);
            }

        },

        renderData: function(detailInfoData) {
            var rankType = $(_this.diagnosisDetailInfo.containerScreen.context).find('.diagRanking').attr('data-type');
            var currentnowType = _this.diagnosisDetailInfo.diagType ? _this.diagnosisDetailInfo.diagType : 'fault';
            var timeIntervalObj = _this.timeInterval();
            for (var i = 0; i < detailInfoData.length; i++) {
                var diagnosisDetailTr = '';
                if (rankType === 'equipment') {
                    diagnosisDetailTr = '<tr class="diagnosisDetailTr" data-faultId="' + detailInfoData[i].FaultId + '">\
                        <td>' + detailInfoData[i].SubBuildingName + '</td>\
                        <td class="spectrumCommen">' +
                        spectrumCreate(detailInfoData[i]) +
                        '</td>\
                        </tr>';
                } else if (rankType === 'zone') {
                    diagnosisDetailTr = '<tr class="diagnosisDetailTr" data-faultId="' + detailInfoData[i].FaultId + '">\
                        <td>' + detailInfoData[i].SubBuildingName + '</td>\
                        <td class="spectrumCommen">' +
                        spectrumCreate(detailInfoData[i]) +
                        '</td>\
                        </tr>';
                } else {
                    diagnosisDetailTr = '<tr class="diagnosisDetailTr" data-faultId="' + detailInfoData[i].FaultId + '">\
                        <td>' + detailInfoData[i].SubBuildingName + '</td>\
                        <td>' + detailInfoData[i].EquipmentName + '</td>\
                        <td class="spectrumCommen">' +
                        spectrumCreate(detailInfoData[i]) +
                        '</td>\
                        </tr>';
                }
                _this.$disgnosisDetailInfoModal.find('.diagnosisTable tbody').append(diagnosisDetailTr);
                if (currentnowType == 'fault' || currentnowType == 'workhours') {
                    $('.spectrumDivCh').hide();
                    $('.zoneApart').show();
                } else {
                    $('.spectrumDivCh').show();
                    $('.zoneApart').hide();
                }
                var tooltipTemplate = '<div class="tooltip tplItemTooltip diagnosisTableTool gray-scrollbar" role="tooltip" style="border-radius:5px">' +
                    '<div class="tooltip-arrow"></div>' +
                    // '<div class="tooltip-inner tooltipTitle">预览</div>' +
                    '<div class="tooltipContent diagnosisDetailTrContent clearfix">' +
                    '</div>' +
                    '</div>';
                var options = {
                    placement: 'auto bottom',
                    title: '预览',
                    delay: { show: 200, hide: 200 },
                    template: tooltipTemplate
                };
                var $spectrumDivCh = _this.$disgnosisDetailInfoModal.find('.spectrumDivCh');
                $spectrumDivCh.tooltip(options);
                $spectrumDivCh.off('shown.bs.tooltip').on('shown.bs.tooltip', function() {
                    var $this = $(this);
                    Array.prototype.notempty = function() {
                        return this.filter(function(t) { t != undefined && t !== null && t !== '' });
                    }

                    function timecount() {
                        var dataTimeArrList = $this.attr('data-timeList').split(',');
                        var dataFaultCurrent = $this.attr('data-faultName').split('*').notempty();
                        var timeDayCountDom = '';
                        for (var i = 0; i < dataTimeArrList.length; i++) {
                            currentFault = JSON.parse(dataFaultCurrent[i].replace(/'/g, '"'));
                            timeDayCountDom += '<div class="timeDayCount" style="border-top:1px solid #333">' + I18n.resource.modalConfig.modalApp.FAULT_NAME + '</div>' +
                                '<div class="timeDayCount">' + currentFault.FaultName + '</div>' +
                                '<div class="timeDayCount">' + I18n.resource.modalConfig.modalApp.EQUIPMENT_NAME + '</div>' +
                                '<div class="timeDayCount">' + currentFault.EquipmentName + '</div>' +
                                '<div class="timeDayCount">' + I18n.resource.modalConfig.modalApp.TIME_TITLE + '</div>' +
                                '<div class="timeDayCount">' + dataTimeArrList[i] + '</div>';
                        }
                        return timeDayCountDom;
                    }
                    var tooltipContent = '<div class="timeDayCount">' + $this.attr('data-title') + '</div>' +
                        //'<div class="timeDayCount">'+I18n.resource.modalConfig.modalApp.FAULT_NAME+'</div>'+
                        //'<div class="timeDayCount">'+$this.attr('data-faultName')+'</div>'+
                        //'<div class="timeDayCount">'+I18n.resource.modalConfig.modalApp.EQUIPMENT_NAME+'</div>'+
                        //'<div class="timeDayCount">'+$this.attr('data-equipmentName')+'</div>'+
                        '<div class="timeDayCount">' + I18n.resource.modalConfig.modalApp.TIME_DOT + '</div>' + timecount();
                    var $diagnosisDetailTrContent = $('.diagnosisDetailTrContent');
                    $diagnosisDetailTrContent.html('');
                    $diagnosisDetailTrContent.html(tooltipContent);
                })
            }

            function unique(arr) { //去重复
                var result = [],
                    hash = {};
                for (var i = 0, elem;
                    (elem = arr[i]) != null; i++) {
                    if (!hash[elem]) {
                        result.push(elem);
                        hash[elem] = true;
                    }
                }
                return result;
            }

            function spectrumCreate(detailInfoData) {
                var spectrumDiv = '';
                var faultZoneArr = {};

                for (var m = 0; m < timeIntervalObj.length; m++) {
                    var detailInfoI = timeIntervalObj[m];
                    var faultTimeArr = {};
                    faultTimeArr['time'] = [];
                    faultTimeArr['counts'] = [];
                    faultTimeArr['timeArr'] = [];
                    faultTimeArr['timeDetails'] = [];
                    faultTimeArr['endTime'] = [];

                    for (var n = 0; n < detailInfoI.length; n++) {
                        var timeArr = [];
                        var count = 0;
                        var timeDetailsArr = [];
                        var hourPrimTime = detailInfoI[n].split(' ')[0] + ' ' + detailInfoI[n].split(' ')[1].split(':')[0];
                        for (var k = 0; k < detailInfoData.arrNoticeTime.length; k++) {
                            var noticeTime = detailInfoData.arrNoticeTime[k].Time;
                            var hourCompaTime = noticeTime.split(' ')[0] + ' ' + noticeTime.split(' ')[1].split(':')[0];
                            if (hourPrimTime == hourCompaTime) {
                                count = count + 1;
                                if (currentnowType == 'fault' || currentnowType == 'workhours') {
                                    var nowCheckT = detailInfoData.arrNoticeTime[k].EndTime ? detailInfoData.arrNoticeTime[k].EndTime : null;
                                    faultTimeArr.endTime.push(nowCheckT);
                                }
                                faultTimeArr.time.push(hourPrimTime);
                                timeArr.push(noticeTime);
                                timeDetailsArr.push(detailInfoData.arrNoticeTime[k]);
                            }
                        }
                        if (count !== 0) {
                            faultTimeArr.timeArr.push(timeArr);
                            faultTimeArr.counts.push(count);
                            faultTimeArr['timeDetails'].push(timeDetailsArr);
                            faultZoneArr = faultTimeArr;
                        }
                    }
                    //区间模式
                    if ((currentnowType == 'fault' || currentnowType == 'workhours') && faultTimeArr.timeArr.length !== 0) {
                        for (var f = 0, flength = faultTimeArr.timeArr.length; f < flength;f++){
                            var timeOne = Object.prototype.toString.call(faultTimeArr.timeArr[f])=='[object Array]'?faultTimeArr.timeArr[f][0]:faultTimeArr.timeArr[f];
                            var nowFor = new Date().format('yyyy-MM-dd HH:mm:ss');
                            var timeHMS;
                            if(timeOne.split(' ')[0] == nowFor.split(' ')[0]){
                                timeHMS = nowFor.split(' ')[1];
                            }else{
                                timeHMS = '23:59:59';
                            }
                            var timeTwo = faultTimeArr.endTime[f] ? faultTimeArr.endTime[f] : timeOne.split(' ')[0]+' '+timeHMS;//new Date().format('yyyy-MM-dd HH:mm:ss');
                            var timeStartF, timeEndF, timeStartA = new Date(timeFormat($('#startTimeCog').val())),
                                timeEndA = new Date(timeFormat($('#endTimeCog').val()));
                            if (new Date(timeOne).valueOf() > new Date(timeTwo).valueOf()) {
                                timeStartF = timeTwo;
                                timeEndF = timeOne;
                            } else {
                                timeStartF = timeOne;
                                timeEndF = timeTwo;
                            }

                            //开始时间结束时间格式化为 yyyy-MM-dd 00:00:00
                            timeStartA.setHours(0);
                            timeStartA.setMinutes(0);
                            timeStartA.setSeconds(0);

                            timeEndA.setHours(0);
                            timeEndA.setMinutes(0);
                            timeEndA.setSeconds(0);

                            //求相隔天数
                            var daysApart = (timeEndA.valueOf() - timeStartA.valueOf()) / 86400000 + 1;
                            //开始时间与最左边时间相隔小时数（可求left值）
                            var startTimeNum = (new Date(timeStartF).valueOf() - new Date(timeFormat($('#startTimeCog').val()).replace(/-/g,'/')).valueOf()) / 3600000;
                            //结束时间与开始时间相隔小时数（可求width值）
                            var endStartNum = (new Date(timeEndF).valueOf() - new Date(timeStartF).valueOf()) / 3600000;
                            var leftValue = startTimeNum * 100 / (daysApart * 24);
                            var widthValue = endStartNum * 100 / (daysApart * 24);
                            if (AppConfig.projectTimeFormat == 1) {
                                timeStartF = timeFormat(timeStartF, timeFormatChange('yyyy-mm-dd hh:ii:ss'));
                                timeEndF = timeFormat(timeEndF, timeFormatChange('yyyy-mm-dd hh:ii:ss'));
                            } else if (AppConfig.projectTimeFormat == 2) {
                                timeStartF = timeFormat(timeStartF, timeFormatChange('dd/mm/yyyy hh:ii:ss'));
                                timeEndF = timeFormat(timeEndF, timeFormatChange('dd/mm/yyyy hh:ii:ss'));
                            } else {
                                timeStartF = timeFormat(timeStartF, 'yyyy-mm-dd hh:ii:ss');
                                timeEndF = timeFormat(timeEndF, 'yyyy-mm-dd hh:ii:ss');
                            }
                            //zoneApart前置
                            spectrumDiv = '<div class="zoneApart" style="position:absolute;top:5px;height:26px;z-index:33;width:' + (widthValue < 0.5 ? 0.5 : widthValue) + '%;left:' + leftValue + '%;" title="' + timeStartF + ' - ' + timeEndF + '"></div>' + spectrumDiv
                        }
                    }
                    if (m % 2 === 0) {
                        spectrumDiv += '<div class="spectrumDiv" title="' + timeFormat(detailInfoI[0].split(' ')[0], timeFormatChange('yyyy-mm-dd')) + '" style="width:' + 100 / timeIntervalObj.length + '%;background:-webkit-linear-gradient(top,#f0f4fb,#e4ecf9);position:relative">' + spectrumDivChild(faultTimeArr) + '</div>';
                    } else {
                        var evenColor = '-webkit-linear-gradient(top,#ffffff,#f0f4fb)';
                        spectrumDiv += '<div class="spectrumDiv" title="' + timeFormat(detailInfoI[0].split(' ')[0], timeFormatChange('yyyy-mm-dd')) + '" style="width:' + 100 / timeIntervalObj.length + '%;background:-webkit-linear-gradient(top,#ffffff,#f0f4fb);position:relative">' + spectrumDivChild(faultTimeArr) + '</div>';
                    }
                }

                return spectrumDiv
            }

            function spectrumDivChild(faultTimeArr) {
                //var rgbArrColor = _this.hslOrRgb(count);
                var faultTimeArrTime = unique(faultTimeArr.time);
                var faultTimeArrCount = faultTimeArr.counts;
                var faultTimeArrTimeList = faultTimeArr.timeArr;
                var faultContenList = faultTimeArr.timeDetails;
                var spectrumDivCh = '';
                for (var p = 0; p < faultTimeArrTime.length; p++) {
                    var cuerH = parseInt(faultTimeArrTime[p].split(' ')[1]);
                    var currentTimeList = faultTimeArrTimeList[p];
                    var faultCurent = faultContenList[p];
                    var dataFaultJsonStr = '';
                    for (var i = 0; i < faultCurent.length; i++) {
                        dataFaultJsonStr += JSON.stringify(faultCurent[i]).replace(/\"/g, "'") + '*';
                    }
                    spectrumDivCh += '<div class="spectrumDivCh" data-faultName="' + dataFaultJsonStr + '" data-timeList="' + currentTimeList + '" data-title="' + timeFormat(faultTimeArrTime[p] + ':00:00', timeFormatChange('yyyy-mm-dd hh:ii:ss')) + '(' + faultTimeArrCount[p] + ')' + '" style="width:' + 100 / 24 + '%;height:26px;display:inline-block;background:rgba(193, 33, 33, 0.8);position:absolute;top:0;left:' + 100 * ((cuerH < 1 ? 1 : cuerH) - 1) / 24 + '%"></div>'
                }
                return spectrumDivCh
            }
        },

        hslOrRgb: function(n) {
            //十六进制颜色值的正则表达式
            var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
            String.prototype.colorRgb = function() {
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
                var max = Math.max(r, g, b),
                    min = Math.min(r, g, b);
                var h, s, l = (max + min) / 2;

                if (max == min) {
                    h = s = 0; // achromatic
                } else {
                    var d = max - min;
                    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                    switch (max) {
                        case r:
                            h = (g - b) / d + (g < b ? 6 : 0);
                            break;
                        case g:
                            h = (b - r) / d + 2;
                            break;
                        case b:
                            h = (r - g) / d + 4;
                            break;
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

            var colorBasic = '#055197'; //'#2e6da4';
            var rgb = colorBasic.colorRgb().split("(")[1].split(")")[0];

            var r = rgb.split(",")[0];
            var g = rgb.split(",")[1];
            var b = rgb.split(",")[2];
            var hsl = rgbToHsl(r, g, b);
            var hslCo;
            if (n === 0) {
                hsl[2] = 1;
            } else if (n === 1) {
                hsl[2] = 0.92;
                hslCo = 0.88;
            } else {
                hsl[2] = 96 - n * 3 < 10 ? 10 : (96 - n * 3);
                hsl[2] = hsl[2] / 100;

                hslCo = 96 - n * 5 < 10 ? 10 : (96 - n * 5);
                hslCo = hslCo / 100
            }
            var rgbStartColor = hslToRgb(hsl[0], hsl[1], hsl[2]);
            var rgbStartColor1 = hslToRgb(hsl[0], hsl[1], hslCo);
            if (n === 0) {
                //return 'rgb(' + rgbStartColor[0] + ',' + rgbStartColor[1] + ',' + rgbStartColor[2] + ')';
                return '-webkit-linear-gradient(top,#f0f4fb,#e4ecf9)'; //#eff3fc,#dce7f7
            } else {
                return 'rgba(193, 33, 33, 0.8)';
                //return '-webkit-linear-gradient(top,rgb('+ rgbStartColor[0] + ',' + rgbStartColor[1] + ',' + rgbStartColor[2] + '),rgb(' + rgbStartColor1[0] + ',' + rgbStartColor1[1] + ',' + rgbStartColor1[2] + '))';
                //return '-webkit-gradient(linear,center top,center bottom,from(rgb('+ rgbStartColor[0] + ',' + rgbStartColor[1] + ',' + rgbStartColor[2] + ')), to(rgb(' + rgbStartColor1[0] + ',' + rgbStartColor1[1] + ',' + rgbStartColor1[2] + ')))';
            }
        },
        timeInterval: function() {
            var timeIntervalObj = {};
            var startTimeCogVal = timeFormat($('#startTimeCog').val() + ':00', 'yyyy-mm-dd hh:ii:ss');
            var endTimeCogVal = timeFormat($('#endTimeCog').val() + ':00', 'yyyy-mm-dd hh:ii:ss');
            var startYear = parseInt(startTimeCogVal.split('-')[0]);
            var startMonth = parseInt(startTimeCogVal.split('-')[1]);
            var startDay = parseInt(startTimeCogVal.split(' ')[0].split('-')[2]);
            var endYear = parseInt(endTimeCogVal.split('-')[0]);
            var endMonth = parseInt(endTimeCogVal.split('-')[1]);
            var endDay = parseInt(endTimeCogVal.split(' ')[0].split('-')[2]);
            var startHour = parseInt(startTimeCogVal.split(' ')[1].split(':')[0]);
            startHour = startHour === 0 ? 24 : startHour;

            var endHour = parseInt(endTimeCogVal.split(' ')[1].split(':')[0]);
            endHour = endHour === 0 ? 24 : endHour;
            var monthLength = 0; //开始时间与结束时间的间隔小时数
            var monthArrCount = []; //开始时间与结束时间的间隔小时数组
            var monthDayArr = []; //以一天做间隔的二维数组如[[2016-09-09 00:00:00...2016-09-09 23:00:00],[2016-09-10 00:00:00...2016-09-10 23:00:00]]
            if (new Date(startTimeCogVal).valueOf() > new Date(endTimeCogVal).valueOf()) {
                alert(I18n.resource.diagnosis.diagnosisROI.MSG_CHECK_TIME);
                return;
            }
            if (endYear - startYear > 1) {
                alert(I18n.resource.modalConfig.modalApp.TIME_INTERVAL);
                return;
            } else {
                if (startMonth === endMonth) {
                    if (startDay === endDay) {
                        var monthDay = []; //一天的小时间隔数组；
                        startHour = startHour === 24 ? 0 : startHour;
                        var intervalHour = endHour - startHour;
                        monthLength += intervalHour + 1;
                        for (var i = 0; i <= intervalHour; i++) {
                            var currentTimes
                            var startHourF = startHour + i > 9 ? (startHour + i) : ('0' + (startHour + i).toString());
                            if (startHourF === 24) {
                                startHourF = '00';
                                currentTimes = startYear + '-' + (startMonth > 9 ? startMonth : ('0' + startMonth.toString())) + '-' + (startDay + 1 > 9 ? (startDay + 1) : ('0' + (startDay + 1).toString())) + ' ' + startHourF + ':00:00';
                                monthArrCount.push(currentTimes);
                                monthDay.push(currentTimes);
                            } else {
                                currentTimes = startYear + '-' + (startMonth > 9 ? startMonth : ('0' + startMonth.toString())) + '-' + (startDay > 9 ? startDay : ('0' + startDay.toString())) + ' ' + startHourF + ':00:00';
                                monthArrCount.push(currentTimes);
                                monthDay.push(currentTimes);
                            }
                        }
                        monthDayArr.push(monthDay);
                    } else {
                        startHour = startHour === 24 ? 0 : startHour;
                        var startDayHour = 24 - startHour + 1;
                        //开始时刻的时间间隔
                        monthLength += startDayHour;
                        var monthDay = [];
                        for (var i = 0; i < startDayHour; i++) {
                            var currentTimes;
                            var startDayHourF = startHour + i > 9 ? (startHour + i) : ('0' + (startHour + i).toString());
                            //startDayHourF = startDayHourF===24?'00':startDayHourF;
                            if (startDayHourF === 24) {
                                startDayHourF = '00';
                                currentTimes = startYear + '-' + (startMonth > 9 ? startMonth : ('0' + startMonth.toString())) + '-' + (startDay + 1 > 9 ? (startDay + 1) : ('0' + (startDay + 1).toString())) + ' ' + startDayHourF + ':00:00';
                                monthArrCount.push(currentTimes);
                                monthDay.push(currentTimes);
                            } else {
                                currentTimes = startYear + '-' + (startMonth > 9 ? startMonth : ('0' + startMonth.toString())) + '-' + (startDay > 9 ? startDay : ('0' + startDay.toString())) + ' ' + startDayHourF + ':00:00'
                                monthArrCount.push(currentTimes);
                                monthDay.push(currentTimes);
                            }
                            //monthArrCount.push(startYear+'-'+(startMonth>9?startMonth:('0'+startMonth.toString()))+'-'+(startDay>9?startDay:('0'+startDay.toString()))+' '+startDayHourF+':00:00');
                        }
                        monthDayArr.push(monthDay);
                        //中间时刻的间隔
                        if (endDay - startDay > 1) {
                            var intervalDays = endDay - startDay;
                            for (var i = 1; i < intervalDays; i++) {
                                var monthDays = [];
                                monthLength += 24;
                                for (var j = 1; j <= 24; j++) {
                                    var currentTimes;
                                    var endHourCur = (j > 9 ? j : '0' + j.toString());
                                    //endHourCur = endHourCur===24?'00':endHourCur;
                                    if (endHourCur === 24) {
                                        endHourCur = '00';
                                        currentTimes = startYear + '-' + (startMonth > 9 ? (startMonth) : ('0' + (startMonth).toString())) + '-' + (startDay + i + 1 > 9 ? (startDay + i + 1) : ('0' + (startDay + i + 1).toString())) + ' ' + endHourCur + ':00:00';
                                        monthArrCount.push(currentTimes);
                                        monthDays.push(currentTimes);
                                    } else {
                                        currentTimes = startYear + '-' + (startMonth > 9 ? (startMonth) : ('0' + (startMonth).toString())) + '-' + (startDay + i > 9 ? (startDay + i) : ('0' + (startDay + i).toString())) + ' ' + endHourCur + ':00:00';
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
                        monthLength += endHour;
                        if (endHour === 1) {
                            monthArrCount.push(startYear + '-' + (endMonth > 9 ? endMonth : ('0' + endMonth.toString())) + '-' + (endDay > 9 ? endDay : ('0' + endDay.toString())) + ' ' + '01:00:00');
                            monthDayss.push(startYear + '-' + (endMonth > 9 ? endMonth : ('0' + endMonth.toString())) + '-' + (endDay > 9 ? endDay : ('0' + endDay.toString())) + ' ' + '01:00:00');
                        } else {
                            for (var i = 1; i <= endHour; i++) {
                                var currentTimes;
                                var endHourCue = i > 9 ? i : '0' + i.toString();
                                //endHourCue = endHourCue===24?'00':endHourCue;
                                if (endHourCue === 24) {
                                    endHourCue = '00';
                                    currentTimes = startYear + '-' + (endMonth > 9 ? endMonth : ('0' + endMonth.toString())) + '-' + (endDay + 1 > 9 ? (endDay + 1) : ('0' + (endDay + 1).toString())) + ' ' + endHourCue + ':00:00'
                                    monthArrCount.push(currentTimes);
                                    monthDayss.push(currentTimes);
                                } else {
                                    currentTimes = startYear + '-' + (endMonth > 9 ? endMonth : ('0' + endMonth.toString())) + '-' + (endDay > 9 ? endDay : ('0' + endDay.toString())) + ' ' + endHourCue + ':00:00'
                                    monthArrCount.push(currentTimes);
                                    monthDayss.push(currentTimes);
                                }
                                //monthArrCount.push(startYear+'-'+(endMonth>9?endMonth:('0'+endMonth.toString()))+'-'+(endDay>9?endDay:('0'+endDay.toString()))+' '+endHourCue+':00:00');
                            }
                        }
                        monthDayArr.push(monthDayss);
                    }
                } else {
                    //if(endMonth-startMonth>1)
                    startHour = startHour === 24 ? 0 : startHour;
                    var startDayHour = 24 - startHour + 1;
                    //开始时刻的时间间隔
                    monthLength += startDayHour;
                    var monthDays = [];
                    for (var i = 0; i < startDayHour; i++) {
                        var startDayHourF = startHour + i > 9 ? (startHour + i) : ('0' + (startHour + i).toString());
                        //startDayHourF = startDayHourF===24?'00':startDayHourF;
                        var currentTimes;
                        if (startDayHourF === 24) {
                            startDayHourF = '00';
                            currentTimes = startYear + '-' + (startMonth > 9 ? startMonth : ('0' + startMonth.toString())) + '-' + (startDay + 1 > 9 ? (startDay + 1) : ('0' + (startDay + 1).toString())) + ' ' + startDayHourF + ':00:00'
                            monthArrCount.push(currentTimes);
                            monthDays.push(currentTimes);
                        } else {
                            currentTimes = startYear + '-' + (startMonth > 9 ? startMonth : ('0' + startMonth.toString())) + '-' + (startDay > 9 ? startDay : ('0' + startDay.toString())) + ' ' + startDayHourF + ':00:00'
                            monthArrCount.push(currentTimes);
                            monthDays.push(currentTimes);
                        }
                        //monthArrCount.push(startYear+'-'+(startMonth>9?startMonth:('0'+startMonth.toString()))+'-'+(startDay>9?startDay:('0'+startDay.toString()))+' '+startDayHourF+':00:00');
                    }
                    monthDayArr.push(monthDays);
                    var startMonthDCount = new Date(startYear, startMonth, 0).getDate();
                    var intervalDay = startMonthDCount - startDay;
                    for (var i = 1; i <= intervalDay; i++) {
                        var monthDay = [];
                        var pushStartDay = (startDay + i) > 9 ? (startDay + i) : ('0' + (startDay + i).toString());
                        var pushStartDay1 = (startDay + i + 1) > 9 ? (startDay + i + 1) : ('0' + (startDay + i + 1).toString());
                        monthLength += 24;
                        for (var j = 1; j <= 24; j++) {
                            var currentTimes;
                            var pushDayHourCound = j > 9 ? j : ('0' + j.toString());
                            //pushDayHourCound = pushDayHourCound===24?'00':pushDayHourCound;
                            if (pushDayHourCound === 24) {
                                pushDayHourCound = '00';
                                var isNextYear = false;
                                if (pushStartDay1 > startMonthDCount) {
                                    startMonth = startMonth + 1;
                                    if (startMonth > 12) {
                                        startMonth = (startMonth - 12);
                                        isNextYear = true;
                                    }
                                    pushStartDay1 = '01';
                                }
                                if (isNextYear) {
                                    currentTimes = endYear + '-' + (startMonth > 9 ? startMonth : ('0' + startMonth.toString())) + '-' + pushStartDay1 + ' ' + pushDayHourCound + ':00:00';
                                } else {
                                    currentTimes = startYear + '-' + (startMonth > 9 ? startMonth : ('0' + startMonth.toString())) + '-' + pushStartDay1 + ' ' + pushDayHourCound + ':00:00';
                                }
                                monthArrCount.push(currentTimes);
                                monthDay.push(currentTimes);
                            } else {
                                currentTimes = startYear + '-' + (startMonth > 9 ? startMonth : ('0' + startMonth.toString())) + '-' + pushStartDay + ' ' + pushDayHourCound + ':00:00'
                                monthArrCount.push(currentTimes);
                                monthDay.push(currentTimes);
                            }
                            //monthArrCount.push(startYear+'-'+(startMonth>9?startMonth:('0'+startMonth.toString()))+'-'+pushStartDay+' '+pushDayHourCound+':00:00');
                        }
                        monthDayArr.push(monthDay);
                    }
                    //中间时刻的计算
                    var startMonthArr = endMonth - startMonth;
                    if (endMonth - startMonth > 1) {
                        var monthHourArr = endMonth - startMonth;
                        for (var i = 1; i < monthHourArr; i++) {
                            var currentMonths = startMonth + i > 9 ? (startMonth + i) : ('0' + (startMonth + i).toString());
                            var currentMonthDays = new Date(startYear, currentMonths, 0).getDate();
                            for (var j = 1; j <= currentMonthDays; j++) {
                                var monthDay = [];
                                var currentMonthDay = j > 9 ? j : ('0' + j.toString());
                                var currentMonthDay1 = j + 1 > 9 ? j + 1 : ('0' + (j + 1).toString());
                                monthLength += 24;
                                for (var k = 1; k <= 24; k++) {
                                    var currentTimes;
                                    var currentMonthDayHour = k > 9 ? k : ('0' + k.toString());
                                    //currentMonthDayHour = currentMonthDayHour===24?'00':currentMonthDayHour;
                                    if (currentMonthDayHour === 24) {
                                        currentMonthDayHour = '00';
                                        currentTimes = startYear + '-' + currentMonths + '-' + currentMonthDay1 + ' ' + currentMonthDayHour + ':00:00';
                                        monthArrCount.push(currentTimes);
                                        monthDay.push(currentTimes);
                                    } else {
                                        currentTimes = startYear + '-' + currentMonths + '-' + currentMonthDay + ' ' + currentMonthDayHour + ':00:00'
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
                    var endMonthGe = endMonth > 9 ? endMonth : ('0' + endMonth.toString());
                    for (var i = 1; i < endDay; i++) {
                        var monthDay = [];
                        var currendEndDay = i > 9 ? i : ('0' + i.toString());
                        var currendEndDay1 = i + 1 > 9 ? i + 1 : ('0' + (i + 1).toString());
                        monthLength += 24;
                        for (var j = 1; j <= 24; j++) {
                            var currentTimes;
                            var currentEndDayHours = j > 9 ? j : ('0' + j.toString());
                            //currentEndDayHours = currentEndDayHours===24?'00':currentEndDayHours;
                            if (currentEndDayHours === 24) {
                                currentEndDayHours = '00';
                                currentTimes = endYear + '-' + endMonthGe + '-' + currendEndDay1 + ' ' + currentEndDayHours + ':00:00'
                                monthArrCount.push(currentTimes);
                                monthDay.push(currentTimes);
                            } else {
                                currentTimes = endYear + '-' + endMonthGe + '-' + currendEndDay + ' ' + currentEndDayHours + ':00:00'
                                monthArrCount.push(currentTimes);
                                monthDay.push(currentTimes);
                            }
                            //monthArrCount.push(startYear+'-'+endMonthGe+'-'+currendEndDay+' '+currentEndDayHours+':00:00');
                        }
                        monthDayArr.push(monthDay);
                    }
                    monthLength += endHour;
                    var monthDayF = [];
                    if (endHour === 1) {
                        monthArrCount.push(endYear + '-' + endMonthGe + '-' + (endDay > 9 ? endDay : ('0' + endDay.toString())) + ' ' + '01:00:00');
                        monthDayF.push(endYear + '-' + endMonthGe + '-' + (endDay > 9 ? endDay : ('0' + endDay.toString())) + ' ' + '01:00:00');
                    } else {
                        for (var i = 1; i <= endHour; i++) {
                            var currentTimes = endYear + '-' + endMonthGe + '-' + (endDay > 9 ? endDay : ('0' + endDay.toString())) + ' ' + (i > 9 ? i : ('0' + i.toString())) + ':00:00';
                            monthArrCount.push(currentTimes);
                            monthDayF.push(currentTimes);
                        }
                    }
                    monthDayArr.push(monthDayF);
                }
            }
            timeIntervalObj['timeIntervalCount'] = monthLength;
            timeIntervalObj['timeIntervalArr'] = monthArrCount;
            for (var k = 0; k < monthDayArr.length - 1; k++) {
                var arrFirst = monthDayArr[k].pop();
                monthDayArr[k + 1].splice(0, 0, arrFirst);
            }
            return monthDayArr; //monthArrCount;
        },

        showDetailModal: function(e) {
            var _this = this;
            var $zoneApart = e.target.classList.contains('zoneApart') ? $(e.target) : $(e.currentTarget).find('.zoneApart');
            var time, timeStart, timeEnd, title = $zoneApart.attr('title') || $zoneApart.attr('data-original-title');
            var now = new Date();
            if (title) {
                title = title.split(' - ')[0];
                if (title) {
                    time = new Date(title.replace(/-/g,'/'));
                    timeStart = new Date(time.valueOf() - 3 * 3600000);
                    timeEnd = new Date(time.valueOf() + 3 * 3600000);
                } else {
                    return;
                }
            } else {
                return;
            }
            if (timeEnd.valueOf() > now.valueOf()) { //如果结束时间大于当前时间, 结束时间修改为当前时间
                timeEnd = now;
            }
            //初始化dom
            $('.faultName .desc', this.$wrapSpectrum).text('');
            $('.faulDetail .desc', this.$wrapSpectrum).text('');
            if (this.chart) {
                this.chart.clear();
            } else {
                document.getElementById('chart').innerHTML = '';
            }

            this.$wrapSpectrum = $('#wrapSpectrum');
            I18n.fillArea(this.$wrapSpectrum); //国际化
            this.$disgnosisDetailInfoModal.find('.modal-dialog').css({ height: 'calc(100% - 300px)' });
            this.$wrapSpectrum.slideDown();
            e.currentTarget.scrollIntoView(false);
            var faultId = e.currentTarget.dataset.faultid;
            var postData = {
                faultId: faultId,
                projId: _this.diagnosisDetailInfo.projectId ? _this.diagnosisDetailInfo.projectId : AppConfig.projectId,
                timeStart: timeStart.format('yyyy-MM-dd HH:mm:ss'),
                timeEnd: timeEnd.format('yyyy-MM-dd HH:mm:ss'),
                timeFormat: 'm5'
            }
            Spinner.spin(this.$wrapSpectrum[0]);
            WebAPI.post('/diagnosis/getFaultHisDataById', postData).done(function(result) {
                if (result.msg) {
                    alert(result.msg)
                    return;
                }
                if (!result.data) {
                    return;
                }
                var arrPoint, dictPoint = {},
                    data, option, arrSeries = [],
                    arrLegend = [];
                option = {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: { // 坐标轴指示器，坐标轴触发有效
                            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    legend: {
                        top: '10px',
                        data: [],
                        show: _this.isMobile ? false : true
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '0px',
                        top: '40px',
                        containLabel: true
                    },
                    xAxis: [{
                        type: 'category',
                        data: []
                    }],
                    yAxis: [{
                        type: 'value'
                    }],
                    series: []
                };
                try {
                    arrPoint = result.data.fault.arrPoint;
                    //arrPoint 转换成dict
                    for (var i of arrPoint) {
                        point = i.split(',');
                        dictPoint[point[0]] = point[1];
                    }
                    //判断有没有状态
                    var testStr,indexArr = [];
                    for (var j = 0, jlength = arrPoint.length; j < jlength;j++){
                        testStr = arrPoint[j];
                        if(testStr.toLowerCase().indexOf("onoff")>-1 || testStr.toLowerCase().indexOf("sta")>-1 || testStr.toLowerCase().indexOf("status")>-1 || testStr.indexOf("开关")>-1 || testStr.indexOf("状态")>-1){
                            indexArr.push(j);
                        }
                    }
                    //faultName 及 faultDetail填充
                    $('.faultName .desc', _this.$wrapSpectrum).html(result.data.fault.name);
                    $('.faulDetail .desc', _this.$wrapSpectrum).html(result.data.fault.description);
                    // data = JSON.parse(result.data.data);
                    data = result.data.data;
                    for (var i = 0,length= data.list.length; i < length;i++){
                        var legend = data.list[i].dsItemId.split('|')[1];
                        //图例
                        arrLegend.push(legend);
                        var isHaved = indexArr.find(function (v) { return v === i;})
                        if (isHaved !== undefined){
                            arrSeries.push({
                                name: legend,
                                type: 'line',
                                symbol: 'none',
                                data: data.list[i].data,
                                step: 'start',
                                smooth: false
                            });
                        } else {
                            arrSeries.push({
                                name: legend,
                                type: 'line',
                                symbol: 'none',
                                data: data.list[i].data
                            });
                        }
                    }
                    option.legend.data = arrLegend;
                    option.series = arrSeries;
                    option.xAxis[0].data = (function(timeShaft) {
                        var arr = [];
                        for (var i = 0, l = timeShaft.length; i < l; i++) {
                            arr.push(timeFormat(timeShaft[i], 'mm-dd hh:ii'))
                        }
                        return arr;
                    })(data.timeShaft);
                    _this.chart = echarts.init(document.getElementById('chart'), AppConfig.chartTheme);
                    _this.chart.setOption(option);
                } catch (e) {

                }

            }).always(function(rs) {
                Spinner.stop();
            });

            $('#btnClose', this.$wrapSpectrum).off('click').on('click', function(e) {
                _this.$wrapSpectrum.slideUp();
                _this.$disgnosisDetailInfoModal.find('.modal-dialog').css({ height: '100%' });
            });
        }
    }
    return DiagnosisInfo;
})();