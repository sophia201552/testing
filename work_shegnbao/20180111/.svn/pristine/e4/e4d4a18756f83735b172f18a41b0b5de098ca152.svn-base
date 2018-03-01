class coldHotAnalysis {
    constructor(opt) {
        var _this = this;
        this.screen = opt;
        this.floorMap = null;
        this.container = null;
        this.selectedNode = null;
        this.str = {
            tooColdNum: '过冷区域数',
            tooHotNum: '过热区域数',
            standard: '标准',
            tooColdDegree: 20,
            conColdNum: '控制偏冷数',
            conHotNum: '控制偏热数',
            deviation: '允许偏差',
            deviationDegree: 1,
            setColdNum: '设置偏冷数',
            setHotNum: '设置偏热数',
            reference: '参考',
            referenceColdDegree: 18,
            referenceHotDegree: 28
        };
        this.tooColdTooHotPoint = ['AllRoom_CoolHeatDiag_TableInfo', 'UnderCoolLimit_svr', 'OverHeatLimit_svr', 'AllRoom_UnderCool_svr',
            'AllRoom_OverHeat_svr'];
        this.conEffectPoint = ['AllRoom_BelowTInterval_svr', 'AllRoom_AboveTInterval_svr', 'AllRoom_TIntervalDiag_TableInfo'];
        this.setDegreePoint = ['AllRoom_TSetTooCold_svr', 'AllRoom_TSetTooHot_svr', 'AllRoom_TSetDiag_TableInfo'];
    }

    show(ids) {
        this.container = document.querySelector('.panelBmModule');
        this.init();
        this.selectedNode = ids;
    }

    init() {
        var _this = this;
        WebAPI.get('static/app/Benz/Kaide/views/coldHotAnalysis.html').done(function (result) {
            $('.panelBmModule').append('<div id="kdColdHotAnalysis"></div>');
            $('#kdColdHotAnalysis').html(result);
            _this.initModule(_this.tooColdTooHotPoint);
            _this.attachEvent();
        });
    }
    initModule(postdata) {
        var $coolHotBox = $('#coolHotBox');
        var coolingNum = 0; //过冷房间总数
        var heatingNum = 0; //过热房间总数
        var coolingFlagNum = 0; //过冷标准
        var hotFlagNum = 1; //过冷标准
        var underCool = this.setPostData(['AllRoom_UnderCool_svr', 'AllRoom_BelowTInterval_svr', 'AllRoom_TSetTooHot_svr']);
        var overHot = this.setPostData(['|AllRoom_OverHeat_svr', 'AllRoom_AboveTInterval_svr', 'AllRoom_TSetTooHot_svr']);
        postdata = this.setPostData(postdata);
        WebAPI.post('/analysis/startWorkspaceDataGenPieChart', {
            dsItemIds: postdata
        }).done(function (result) {
            //console.log(result);
            var $coldOrHotTable = $('.coldOrHotTable');
/*            var tdArr = $coldOrHotTable.find('td[data-zone]');
            tdArr.html('');*/
            for (var i = 0; i < result.dsItemList.length; i++) {
                var itemPoint = result.dsItemList[i];
                var itemData = parseInt(itemPoint.data);
                if (itemPoint.dsItemId.indexOf('UnderCoolLimit_svr') != -1) {
                    coolingFlagNum = itemData;
                    $coolHotBox.find('.coolingFlag').html(coolingFlagNum);
                } else if (itemPoint.dsItemId.indexOf('OverHeatLimit_svr') != -1) {
                    hotFlagNum = itemData;
                    $coolHotBox.find('.sethotFlag').html(hotFlagNum);
                } else if (underCool.indexOf(itemPoint.dsItemId) != -1) {
                    coolingNum = itemData;
                } else if (overHot.indexOf(itemPoint.dsItemId) != -1) {
                    heatingNum = itemData;
                } else if (itemPoint.dsItemId.indexOf('TableInfo') != -1) {
                    var dsItemIdData = JSON.parse(itemPoint.data);
                }
            }
            $coolHotBox.find('.tooColdTextNum').html(coolingNum);
            $coolHotBox.find('.tooHotTextNum').html(heatingNum);

            $('.coldOrHotTable').find('tbody').empty();
            //console.log(dsItemIdData);

            var $tbody = $('.coldOrHotTable').find('tbody');
            $($tbody).empty();
            var $thead = document.createElement('tr');
            $($tbody).append($thead);
            $($thead).append('<td></td>');
            for (var i = 0; i < dsItemIdData.thead.length; i++) {
                $($thead).append($('<td></td>').html(dsItemIdData.thead[i]));
            }
            for (var i = 0; i < dsItemIdData.body.length; i++) {
                var arrTr = dsItemIdData.body[i];
                var tr = document.createElement('tr');
                $(tr).append($('<td class="listNum"></td>').html(arrTr.name));
                for (var j = 0; j < arrTr.parameter.length; j++) {
                    var parameter = arrTr.parameter[j];
                    if (parameter.length > 0) {
                        $(tr).append($('<td></td>').html('<span class="coolingNumS">' + parameter[0] + '</span>' + '|<span class="hotNumS">' + parameter[1] + '</span>'));
                    } else {
                        $(tr).append($('<td></td>').html('<span class="coolingNumS">-</span>' + '|<span class="hotNumS">-</span>'));

                    }
                }

                $('.coldOrHotTable').find('tbody').append($(tr));
            }
            /*                for(var j = 0;j<dsItemIdData.length;j++) {
                                var dataZone = tdArr.eq(j).attr('data-zone');
                                var isExist = false;
                                for (var i = 0; i < dsItemIdData.length; i++) {
                                    var itemPoint = dsItemIdData[i].dsItemId;
                                    var itemData = dsItemIdData[i].data;
                                    if (itemPoint.indexOf(dataZone) >= 0) {
                                        isExist = true;
                                        var currentTdHtml = tdArr.eq(j).html();
                                        if (itemPoint.indexOf('UndercoolingRoomCount') >= 0) {
                                            if(currentTdHtml.trim()!==''){
                                                tdArr.eq(j).html('<span class="coolingNumS">'+itemData+'</span>' + '|'+currentTdHtml);
                                            }else{
                                                tdArr.eq(j).html('<span class="coolingNumS">'+itemData+'</span>' + '|');
                                            }
                                        } else {
                                            if(currentTdHtml.trim()!==''){
                                                tdArr.eq(j).html(currentTdHtml+'<span class="hotNumS">'+itemData+'</span>');
                                            }else{
                                                tdArr.eq(j).html('<span class="hotNumS">'+itemData+'</span>');
                                            }
                                        }
                                    }
                                }
                                if(!isExist){
                                    tdArr.eq(j).html('-');
                                }
                            }*/


        });
        var now = new Date();
        var startTime = new Date(now.getFullYear(), now.getMonth());
        var endTime = new Date(now.getFullYear(), now.getMonth()+1);
        $('.divTimeRange').find('.timeStyle').datetimepicker({
            Format: 'yyyy-mm',
            autoclose: true,
            startView: 3,
            minView: 3,
            todayHighlight: true
        });
        $('#iptTimeStart').val(startTime.format('yyyy-MM'));
        var type = $('.statistics.active').attr('data-type');
        this.refreshData(startTime, endTime, type);
        this.renderFloorMap();
    }
    setPostData(postData) {
        var dataPoint = [];
        for (var i = 0; i < postData.length; i++) {
            if(AppConfig.projectId){
                dataPoint.push('@' + AppConfig.projectId + '|' + postData[i]);
            }else{
                dataPoint.push('@448|' + postData[i]);
            }
        }
        return dataPoint;
    }
    attachEvent() {
        var _this = this;
        var now = new Date();
        var startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        $("#iptTimeStart").on('change', function (e) {
            var startTime = ($(this).val()).toDate();
            var endTime = new Date(+startTime);
            endTime.setMonth(startTime.getMonth() + 1);
            $(this).val(startTime.format('yyyy-MM'));
            var type = $('.statistics.active').attr('data-type');
            _this.refreshData(startTime, endTime, type);
        });

        $("#btnPreMonth").off('click').on('click', function (e) {
            var endTime = ($("#iptTimeStart").val()).toDate();
            var preMonth = new Date(+endTime);
            preMonth.setMonth(endTime.getMonth() - 1);
            $("#iptTimeStart").val(preMonth.format('yyyy-MM'));
            var type = $('.statistics.active').attr('data-type');
            _this.refreshData(preMonth, endTime, type);
        });
        $("#btnNextMonth").off('click').on('click', function (e) {
            var startTime = ($("#iptTimeStart").val()).toDate();
            var endTime = new Date(+startTime);
            endTime.setMonth(startTime.getMonth() + 1);
            $("#iptTimeStart").val(endTime.format('yyyy-MM'));
            startTime = ($("#iptTimeStart").val()).toDate();
            var nextMonth = new Date(+startTime);
            nextMonth.setMonth(startTime.getMonth() + 1);
            var type = $('.statistics.active').attr('data-type');
            _this.refreshData(startTime, nextMonth, type);
        });
        $('#backHome').off('click').on('click', function () {
            _this.renderFloorMap();
        });
        $('.btnBack').off('click').on('click', function () {
            $('#kdColdHotAnalysis').remove();
        });
        $('.temperatureNav').off('click').on('click', '.statistics', function (e) {
            $(e.currentTarget).addClass('active').siblings().removeClass('active');
            var type = $(e.currentTarget).attr('data-type');
            if (type == 'controlEffect') {
                _this.initModule(_this.conEffectPoint);
                $('.sethotFlag').html(_this.str.deviationDegree);
                $('.coolingFlag').html(_this.str.deviationDegree);
                $('.degreeLabel').html(_this.str.deviation);
                $('.degreeLabel1').html(_this.str.deviation);
                $('.tooHotText').html(_this.str.conHotNum);
                $('.tooColdText').html(_this.str.conColdNum);
            } else if (type == 'temperatureSet') {
                _this.initModule(_this.setDegreePoint);
                $('.coolingFlag').html(_this.str.referenceColdDegree);
                $('.sethotFlag').html(_this.str.referenceHotDegree);
                $('.degreeLabel').html(_this.str.reference);
                $('.degreeLabel1').html(_this.str.reference);
                $('.tooHotText').html(_this.str.setHotNum);
                $('.tooColdText').html(_this.str.setColdNum);
            } else if (type == 'tooColdTooHot') {
                _this.initModule(_this.tooColdTooHotPoint);
                $('.coolingFlag').html(_this.str.tooColdDegree);
                $('.sethotFlag').html(_this.str.tooColdDegree);
                $('.degreeLabel').html(_this.str.standard);
                $('.degreeLabel1').html(_this.str.standard);
                $('.tooHotText').html(_this.str.tooHotNum);
                $('.tooColdText').html(_this.str.tooColdNum);
                
            }
        });
    }
    refreshData(startTime, endTime, type) {
            startTime = startTime.format("yyyy-MM-dd HH:mm:ss");
            endTime = new Date(endTime.getTime() - 86400000).format("yyyy-MM-dd HH:mm:ss");
            var postdata;
            switch (type) {
                case 'tooColdTooHot':
                    postdata = ['@72|AllRoom_UnderCool_svr', '@72|AllRoom_OverHeat_svr'];
                    break;
                case 'controlEffect':
                    postdata = ['@72|AllRoom_AboveTInterval_svr', '@72|AllRoom_BelowTInterval_svr'];
                    break;
                case 'temperatureSet':
                    postdata = ['@72|AllRoom_TSetTooCold_svr', '@72|AllRoom_TSetTooCold_svr'];
                    break;
                default:
                    break;
            }
            postdata = [ '@72|AllRoom_OverHeat_svr','@72|AllRoom_UnderCool_svr'];
            var postData = {
                dsItemIds: postdata,
                timeStart: startTime,
                timeEnd: endTime,
                timeFormat: 'd1'
            }
            WebAPI.post('/analysis/startWorkspaceDataGenHistogram', postData).done(function (result) {
                //console.log(result);
                var echart = echarts.init(document.querySelector('.kdechartPlane'));
                var dsItemIdData = result.list;
                var option = {
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        top: '15px',
                        textStyle: {
                            color: '#a7b4cd'
                        },
                        data: [ '过热区域','过冷区域'],
                    },
                    color: ['#fcbd19','#3f90e6'],
                    grid: {
                        top: '20%',
                        left: '5%',
                        right: '3%',
                        bottom: '10%',

                    },
                    xAxis: {
                        type: 'category',
                        nameTextStyle: {
                            color: '#a7b5ca',
                            fontSize: '25'
                        },
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: '#a7b5ca'
                            }
                        },
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: '#a7b5ca'
                            }
                        },
                        axisTick: {
                            show: false
                        },
                        data: (function () {
                            var arrTime = [];
                            var now = new Date();
                            var timeShaft;
                            for (var i = 0; i < result.timeShaft.length; i++) {
                                timeShaft = new Date(result.timeShaft[i])
                                if ((now - timeShaft) > 0) {
                                    arrTime.push(timeShaft.format('yyyy-MM-dd'));
                                }
                            }
                            return arrTime;
                        }())
                    },
                    yAxis: {
                        type: 'value',
                        nameTextStyle: {
                            color: '#a7b5ca',
                            fontSize: '25'
                        },
                        axisLine: {
                            show: false
                        },
                        splitLine: {
                            lineStyle: {
                                color: '#a7b5ca'
                            }
                        },
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: '#a7b5ca'
                            }
                        }
                    },
                    series: getSeries()
                };

                function getSeries() {
                    var data = [];
                    var dataFormat = {};
                    var dataName = {
                        0: '过热区域',
                        1: '过冷区域'
                    };
                    var now = new Date();
                    var timeShaft;
                    var arrData = [];
                    for (var i = 0; i < dsItemIdData.length; i++) {
                        dataFormat = {
                            name: dataName[i],
                            type: 'line',
                            stack: '总量',
                            smooth: true,
                            showSymbol: false,
                        };
                        if (i) {
                            arrData = [];
                        }
                        for (var j = 0; j < dsItemIdData[i].data.length; j++) {
                            timeShaft = new Date(result.timeShaft[j])
                            if ((now - timeShaft) > 0) {
                                arrData.push(dsItemIdData[i].data[j]);
                            }
                        }
                        dataFormat.data = arrData;
                        data.push(dataFormat);
                    }
                    return data;
                }

                echart.setOption(option);
                $(window).resize(function () {
                    $(echart).resize();
                });
            });
        }
        /*  右下角的pageScreen*/
    renderFloorMap() {
        var PageScreen = namespace('observer.screens.PageScreen');
        var container = document.getElementById('floorMap');
        if (this.floorMap) {
            this.floorMap.close();
        }
        this.floorMap = new PageScreen({
            id: '1470819364630456f538dd4e'
        }, container);
        this.floorMap.show();
    }

    close() {
        this.screen = null;
    }
}