// spectrum.js
;(function (exports) {
    class FaultDetailPanel {
        constructor(container,diagnosis) {
            this.container = container;
            this.diagnosis = diagnosis;
            //需要被导出的点名
            this.exportsPoint = [];

            this.init();
        }
        init() {
            this.initLayout();
        }
        initLayout(){
            this.tpl = `\
                <div id="diagnosisFaultDetailPanelContent">\
                    <div id="leftFaultDetailPanel" class="col-md-3">\                       
                    </div>\
                    <div id="rightFaultDetailPanel" class="col-md-9"></div>\
                    <span id="btnClose">×</span>\
                    <span id="btnExportPoint" class="glyphicon glyphicon-export"></span>\
                </div>`;
        }
        getxAxisData(selectData){
            var _this = this;
            var data = [];
            var statusData = [];
            var maxValArr = [];
            var minValArr = [];
            var index;
            if(this.chartData.list){
                var weakenArr = [];
                this.chartData.list.forEach(function(row,i){
                    var item = {
                        name:selectData.points[i].description,
                        type:'line',
                        showSymbol: false,
                        smooth: true,
                        data: row.data
                    };
                    maxValArr.push(Math.max.apply(null,row.data));
                    minValArr.push(Math.min.apply(null,row.data));
                    var LineArr = [];
                    row.data.forEach(function(point){
                        if(typeof point === "number"){
                            if(LineArr.length > 0){
                                if(LineArr[0] !== point){
                                    LineArr.push(point);
                                }
                            }else{
                                LineArr.push(point);
                            }                                
                        }
                    })
                    weakenArr.push(LineArr);
                    // if(LineArr.length === 1){
                    //     item.lineStyle = {
                    //         normal:{
                    //             opacity: 0.3,
                    //             shadowColor: '#6C6C72',
                    //             shadowBlur: 5
                    //         }
                    //     };
                    // }
                    if(index === i){
                        statusData.push($.extend(true, {}, row));
                        item.step = 'start';
                        item.smooth = false;
                    }
                    data.push(item);
                })
            }

            /*--- 故障区域start --- */
            var faultStartTime, faultEndTime, after3hTime, endFalutTime, startScaleTime, endScaleTime,compareAfterTime;
            startScaleTime = selectData.times[0].split(":")[1].substring(1);
            if (startScaleTime < 5) {
                selectData.times[0] = moment(selectData.times[0]).add(5-Number(startScaleTime), 'm').format("YYYY-MM-DD HH:mm:ss");
            } else { 
                selectData.times[0] = moment(selectData.times[0]).add(10-Number(startScaleTime), 'm').format("YYYY-MM-DD HH:mm:ss");
            }
            faultStartTime = selectData.times[0].substring(5).slice(0, -3);
            after3hTime = moment(selectData.times[0]).add(3, 'h').format("YYYY-MM-DD HH:mm:ss");
            endFalutTime = selectData.endTimes[0];
            if (endFalutTime) {
                endScaleTime = endFalutTime.split(":")[1].substring(1);
                if (endScaleTime < 5) {
                    endFalutTime = moment(endFalutTime).add(5 - Number(endScaleTime), 'm').format("YYYY-MM-DD HH:mm:ss");
                } else {
                    endFalutTime = moment(endFalutTime).add(10 - Number(endScaleTime), 'm').format("YYYY-MM-DD HH:mm:ss");
                }
                compareAfterTime = endFalutTime < after3hTime ? endFalutTime.substring(5).slice(0, -3) : after3hTime.substring(5).slice(0, -3);
            } else { 
                compareAfterTime = after3hTime.substring(5).slice(0, -3);
            }

            // 与历史曲线图 end time 比较;
            var ilen = _this.chartData.timeShaft.length;
            var historicalEndTime = _this.chartData.timeShaft[ilen - 1].substring(5).slice(0, -3);
            faultEndTime = compareAfterTime < historicalEndTime ? compareAfterTime : historicalEndTime;
            
            var faultArea = {
                name: localStorage.language  == 'zh' ? '故障区域': 'Fault area',
                type: 'line',
                barGap: 0,
                barCategoryGap: 0,
                silent: true,
                itemStyle: {
                    normal: {
                        color: "#e54035",
                        borderWidth: 0,
                        borderColor: "#e54035",
                        opacity: 0.05
                    },
                    emphasis: {
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                offset: 1, color: 'transparent'
                            }, {
                                offset: 0, color: 'transparent'
                            }],
                            globalCoord: false
                        },
                        opacity: 0.5
                    }
                },
                markArea: {
                    silent: true,
                    itemStyle:{
                        normal:{
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [{
                                    offset: 1, color: '#e54035'
                                }, {
                                    offset: 0, color: '#e54035'
                                }],
                                globalCoord: false
                            },
                            opacity: 0.3
                        },  
                    },
                    data: [[{
                        xAxis: faultStartTime
                    },
                    {
                        xAxis: faultEndTime
                    }]]
                }
            }
            data.push(faultArea);
            /* --- end --- */

            var allWeaken = true;
            weakenArr.some(function(row){
                if(row.length > 1){
                    allWeaken = false;
                    return true;
                }
            })
            if(allWeaken){
                data.forEach(function(row){
                    row.lineStyle = {
                        normal:{
                            opacity: 0.3,
                            shadowColor: '#6C6C72',
                            shadowBlur: 5
                        }
                    }
                })
            }
            var maxY = Math.max.apply(null,maxValArr);
            var minY = Math.min.apply(null,minValArr);
            if(minY > 0){
                minY = 0;
            }
            if(typeof index === "number"){
                var onArr = [];
                var markAreaData = [
                    //[
                    //    {xAxis: '06-02 04:50:00'},
                    //    {xAxis: '06-03 10:50:00'}
                    //],
                    //[
                    //    {xAxis: '06-02 04:50:00'},
                    //    {xAxis: '06-03 10:50:00'}
                    //]
                ];
                var statusPoint = {
                    // name:row.dsItemId.indexOf("|") > -1 ? row.dsItemId.split("|")[1] : row.dsItemId,
                    type:'line',
                    barGap: 0,
                    barCategoryGap: 0,
                    silent: true,
                    itemStyle:{
                        normal:{
                            color: "#1C1E22",
                            borderWidth:0,
                            borderColor:"#1C1E22",
                            opacity: 0.05
                        },
                        emphasis : {
                            color:{
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [{
                                    offset: 1, color: 'transparent'
                                }, {
                                    offset: 0, color: 'transparent'
                                }],
                                globalCoord: false
                            },
                            opacity: 0.5
                        }
                    },
                    markArea:{
                        silent: true,
                        itemStyle:{
                            normal:{
                                color: {
                                    type: 'linear',
                                    x: 0,
                                    y: 0,
                                    x2: 0,
                                    y2: 1,
                                    colorStops: [{
                                        offset: 1, color: '#2f3136'
                                    }, {
                                        offset: 0, color: '#282a30'
                                    }],
                                    globalCoord: false
                                },
                                opacity: 0.4
                            },
                            //emphasis: {
                            //    color:{
                            //        type: 'linear',
                            //        x: 0,
                            //        y: 0,
                            //        x2: 0,
                            //        y2: 1,
                            //        colorStops: [{
                            //            offset: 1, color: '#0c829f'
                            //        }, {
                            //            offset: 0, color: '#243740'
                            //        }],
                            //        globalCoord: false
                            //    },
                            //    opacity: "0.5"
                            //}
                        }
                    }
                };
                var curItem = statusData[0].data;
                curItem.forEach(function(row,i){
                    if(row === 1){
                        curItem[i] = maxY;
                        onArr.push(_this.chartData.timeShaft[i].substring(5).slice(0,-3));
                        if(i-1 < 0){
                            markAreaData.push([{xAxis: _this.chartData.timeShaft[i].substring(5).slice(0,-3)}])
                        }else{
                            if(curItem[i-1] === minY){
                                markAreaData.push([{xAxis: _this.chartData.timeShaft[i].substring(5).slice(0,-3)}])
                            }
                        }
                        if(i+1 > curItem.length - 1){
                            markAreaData[markAreaData.length-1].push({xAxis: _this.chartData.timeShaft[i].substring(5).slice(0,-3)})
                        }else{
                            if(curItem[i+1] === minY){
                                markAreaData[markAreaData.length-1].push({xAxis: _this.chartData.timeShaft[i+1].substring(5).slice(0,-3)})
                            }
                        }
                    }else{
                        curItem[i] = minY;
                    }
                });
                // data[index].data = statusData[0].data;
                // data[index].markArea.data = markAreaData;
                //statusPoint.data = statusData[0].data;
                statusPoint.markArea.data = markAreaData;
                data.push(statusPoint);
                this.onArr = onArr;
                this.index = index;
            }
            return data;
        }
        initEcharts (selectData){
            var _this = this;
            var option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'line',
                        lineStyle:{
                            width: 2,
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [{
                                    offset: 1, color: '#0c829f'
                                }, {
                                    offset: 0, color: '#243740'
                                }],
                                globalCoord: false
                            }, 
                            opacity: "0.5"
                        }
                    },
                    formatter:function (params, ticket, callback){
                        let dom = '<div>'+ params[0].name;
                        params.forEach(function(row){
                            if(row.seriesType === "line"){
                                let name = row.seriesName;
                                let val = row.value;
                                let color= row.color;
                                dom += "<p style = 'margin:0;'><a style='width:10px;height:10px;border-radius:50%;display:inline-block;margin-right:6px;background-color:"+ color +"'></a>"+name + " : "+ val +"</p>"
                            }                            
                        })
                        dom +="</div>"
                        return dom;
                        // callback(ticket, dom);
                    }
                },
                legend: {
                    right: "7%",
                    top: '10px',
                    icon: 'circle',
                    itemWidth: 8,
                    itemHeight: 8,
                    textStyle: {
                        fontSize: 12,
                        color: "#C4C5C8"
                    },
                    data:(function(){
                        var data = [];
                        var name = localStorage.language == 'zh' ? '故障区域' : 'Fault area';
                        selectData.points.push({ description: name, name: name});
                        selectData.points.forEach(function (row) {
                            data.push(row.description);
                        });
                        return data;
                    }())
                },
                grid: {
                    left: '5%',
                    right: '4%',
                    bottom: '10px',
                    top: '40px',
                    containLabel: true
                },
                xAxis:  {
                    type: 'category',
                    boundaryGap: false,
                    axisLine:{
                        lineStyle: {
                            color: "#20242F"
                        }
                    },
                    axisTick:{
                        show: false
                    },
                    axisLabel:{
                        textStyle: {
                            color: "#6C6C72"
                        }
                    },
                    splitLine:{
                        show: false
                    },
                    data: (function(){
                        var data = [];
                        _this.chartData.timeShaft.forEach(function(row){
                            data.push(row.substring(5).slice(0,-3))
                        });
                        return data;
                    }())
                },
                yAxis: {
                    type: 'value',
                    position: "right",
                    max:"dataMax",
                    min:'dataMin',
                    axisLine:{
                        show: false
                    },
                    axisTick:{
                        show: false
                    },
                    axisLabel:{
                        textStyle: {
                            color: "#6C6C72"
                        }
                    },
                    splitLine:{
                        show: true,
                        lineStyle:{
                            color: "#20242E"
                        }
                    }
                },
                series: this.getxAxisData(selectData)
            };
            var faultChart = echarts.init(document.getElementById('rightFaultDetailPanel'));
            this.faultChart = faultChart;
            this.option = option;
            faultChart.setOption(option);
            window.onresize = faultChart.resize;
            // faultChart.on("mouseenter",function (params) {
            //     if(_this.onArr.indexOf(params.name) > -1){
            //         var cloneData = $.extend(true,{},_this.option);
            //         cloneData.series[_this.index].itemStyle.emphasis  = {
            //             color:{
            //                 type: 'linear',
            //                 x: 0,
            //                 y: 0,
            //                 x2: 0,
            //                 y2: 1,
            //                 colorStops: [{
            //                     offset: 1, color: '#0c829f'
            //                 }, {
            //                     offset: 0, color: '#243740'
            //                 }],
            //                 globalCoord: false
            //             },
            //             opacity: 0.5
            //         };
            //         _this.faultChart.setOption({
            //             series: cloneData.series
            //         });
            //     }
            // })
        }
        show(selectedData, searchTime) {
            var _this = this;
            if (!selectedData) { return; }
            $(_this.container).empty().append(_this.tpl);
            _this.detailArr = null;
            _this.msgArr = null;
            this.faultIds = [];
            this.faultAndEntityIds = [];
            var getNoticeDetailData = {
                projectId: AppConfig.projectId,
                faults:[],
            };
            selectedData.forEach(function(row){
                var isAddFaultId = true;
                var isAddFaultIdAndEntityId = true;
                _this.faultAndEntityIds.some(function(item){
                    if(item.faultId === row.faultId){
                        isAddFaultId = false;                            
                    }
                    if(item.faultId === row.faultId && item.entityId === row.entityId){
                        isAddFaultIdAndEntityId = false;
                    } 
                    if(!isAddFaultId && !isAddFaultIdAndEntityId){
                        return true;
                    }
                })
                var obj = {
                    faultId: row.faultId,
                    entityId: row.entityId
                }
                if(isAddFaultId){
                    _this.faultIds.push(row.faultId);
                }
                if(isAddFaultIdAndEntityId){
                    _this.faultAndEntityIds.push(obj);
                }
                getNoticeDetailData.faults.push({
                    id: row.faultId,
                    entityId: row.entityId,
                    startTime: row.time,
                    endTime: row.endTime
                });
            })
            this.initFaultDetailPabel(this.getSameFaultId(this.faultIds[0], searchTime),getNoticeDetailData);
            this.attachEvents();
        }
        getSameFaultId(faultId, searchTime){
            var data = [];
            this.faultAndEntityIds.forEach(function(row){
                if(row.faultId === faultId){
                    data.push(row.entityId);
                }
            })
            return {
                id:faultId,
                entityIds: data,
                searchTime: searchTime
            };
        }
        initFaultDetailPabel(data,getNoticeDetailData){
            var _this = this;
            this.leftSlider = `\
                <div class="divFault">\
                    <p class="pTitle">${I18n.resource.faultDetailPanel.FAULT_NAME}</p>\
                    <select id="faultSelect">\
                        {selectOption}\
                    </select>\
                </div>\
                <div class="divEquipment">
                    <p class="pTitle">${I18n.resource.faultDetailPanel.EQUIPMENT_INFO}</p>
                    <div class="equipmentInfo">{entityName}</div>
                </div>\
                <div class="divFaultInfo">\
                    <div class="divFaultNumbers"><p class="pTitle">${I18n.resource.faultDetailPanel.OCCUE_TIMES}</p><div class="faultNumbers">{faultNumbers}</div></div>\
                    <div class="divSavingMoney"><p class="pTitle">${I18n.resource.faultDetailPanel.COST_SAVING}</p><div class="savingMoney">{savingMoney}</div></div>\
                    <div class="divTime"><p class="pTitle">${I18n.resource.faultDetailPanel.DURATION}</p><div class="time">{time}</div></div>\
                </div>\
                <div class="divDetail">\
                    <p class="pTitle">${I18n.resource.faultDetailPanel.DETAIL}</p><div class="faultDetail">{detail}</div>\
                </div>`;
            var time = this.diagnosis.conditionModel.time();
            data.projectId = AppConfig.projectId;
            data.startTime = time.startTime;
            data.endTime = time.endTime;
            data.lang = I18n.type;
            //数据缓存
            if(this.detailArr){
                var cacheData = [];
                this.msgArr.some(function(row){
                    if(data.id === row.faultId){
                        cacheData.push(row);
                        return true;
                    }
                })
                if(cacheData.length > 0){
                    $("#leftFaultDetailPanel",this.container).empty().append(this.leftSlider.formatEL(this.getDataOpt(this.detailArr,cacheData,data)));
                    this.initRightSlider(cacheData[0]);
                }else{
                    Spinner.spin($("#leftFaultDetailPanel")[0]);
                    WebAPI.post('/diagnosis_v2/getFaultsInfoAndPoints',data).done(function(msgArr){
                        
                        _this.msgArr = _this.msgArr.concat(msgArr.data);
                        $("#leftFaultDetailPanel",_this.container).empty().append(_this.leftSlider.formatEL(_this.getDataOpt(_this.detailArr,msgArr.data,data)));
                        Spinner.stop();
                        _this.initRightSlider(msgArr.data[0]);
                    })
                }                
            }else{
                Spinner.spin($("#leftFaultDetailPanel")[0]);
                $.when(WebAPI.post('/diagnosis_v2/getFaultsByIds',{
                    ids:this.faultIds,
                    lang:I18n.type
                }),WebAPI.post('/diagnosis_v2/getFaultsInfoAndPoints',data),WebAPI.post('/diagnosis_v2/getNoticeDetails',getNoticeDetailData)).done(function(detailArr,msgArr,noticeDetails){
                    detailArr[0]["data"].forEach(function(v){
                        var arr = noticeDetails[0]["data"];
                        arr = arr.filter(function(it){return it.faultId == v.id});
                        var detail = {};
                        try {
                            detail = JSON.parse(arr[arr.length-1].detail);
                        } catch (error) {
                            
                        }
                        v.description = v.description.formatEL(detail);
                        v.suggestion = v.suggestion.formatEL(detail);
                    });
                    _this.detailArr = detailArr[0]["data"];
                    _this.msgArr = msgArr[0]["data"];
                    $("#leftFaultDetailPanel",_this.container).empty().append(_this.leftSlider.formatEL(_this.getDataOpt(detailArr[0]["data"],msgArr[0]["data"],data)));
                    Spinner.stop();
                    _this.initRightSlider(msgArr[0].data[0]);
                })
            }            
        }
        getDataOpt(detailArr,msgArr,data){
            var _this = this;
            var opt = {
                selectOption: (function(){
                    var tpl = "";
                    detailArr.forEach(function(row,i){
                        if(row.id === data.id){
                            tpl += '<option selected="selected" value="'+ row.id +'">'+ row.name +'</option>';
                        }else{
                            tpl += '<option value= "'+ row.id +'">'+ row.name +'</option>';
                        }
                    });
                    return tpl;
                }()),
                faultNumbers: (function(){
                    var occueTimes = 0;
                    msgArr.forEach(function(row){
                        occueTimes += row.occueTimes;
                    })
                    return occueTimes;
                }()),
                savingMoney: (function(){
                    var saveCost = 0;
                    msgArr.forEach(function(row){
                        saveCost += (row.energy * (row.elecPrice || _this.diagnosis.powerPrice));
                    })
                    var unit=AppConfig.project?Unit.prototype.getCurrencyUnit(AppConfig.project.unit_currency):AppConfig.projectCurrent?Unit.prototype.getCurrencyUnit(AppConfig.projectCurrent.unit_currency): Unit.prototype.getCurrencyUnit()

                    return unit+saveCost.toFixed(2) ;
                }()),
                time: (function(){
                    var duration = 0;
                    msgArr.forEach(function(row){
                        duration += row.duration;
                    })
                    return (duration/60).toFixed(2) + " h";
                }()),
                detail: (function(){
                    var content;
                    detailArr.some(function(row){
                        if(row.id === data.id){
                            content =  row.description + row.suggestion;
                            return true;
                        }                         
                    })
                    return content;
                }()),
                entityName: msgArr[0].entityName
            };
            return opt;
        }
        initRightSlider(data){
            var _this = this;
            if (!data){
                return;
            }
            // var middleTime = Date.parse(data.times[0]);
            // var startTime = new Date(middleTime - 10800000).format("yyyy-MM-dd HH:mm:ss");
            // var endTime = new Date(middleTime + 10800000).format("yyyy-MM-dd HH:mm:ss");     
            var startTime = moment(data.times[0]).subtract(3, 'h').format("YYYY-MM-DD HH:mm:ss");
            var endTime = moment(data.times[0]).add(3, 'h').format("YYYY-MM-DD HH:mm:ss");
                if(_this.diagnosis.isHistory==true){//历史模块
                    if(sessionStorage.getItem('titleTime')&&sessionStorage.getItem('titleTime')!='undefined'){
                        data.clickTime=sessionStorage.getItem('titleTime');
                        startTime=moment(sessionStorage.getItem('titleTime')).subtract(3, 'h').format("YYYY-MM-DD HH:mm:ss");
                        endTime = moment(sessionStorage.getItem('titleTime')).add(3, 'h').format("YYYY-MM-DD HH:mm:ss");
                    }
                    if(!sessionStorage.getItem('titleTime')&&data.clickTime){
                        startTime=moment(data.clickTime).subtract(3, 'h').format("YYYY-MM-DD HH:mm:ss");
                        endTime = moment(data.clickTime).add(3, 'h').format("YYYY-MM-DD HH:mm:ss");
                    }
                }//历史模块修复点击某个故障只显示其发生故障时间。  
            var points = [];
            data['points'].forEach(function(point){
                var dsItemId;
                if(point.name.indexOf("|") < 0){
                    dsItemId = "@"+AppConfig.projectId+"|"+point.name;
                }else{
                    dsItemId = point.name;
                }
                points.push(dsItemId);
            })
            _this.exportsPoint = data['points'].concat();
            var postData = {
                // "projectId": AppConfig.projectId,
                // "faultId": this.filterSelectedData[0].faultId,
                dsItemIds: points,
                timeStart:startTime,
                timeEnd:endTime,
                timeFormat:"m5"
            };
            Spinner.spin($("#rightFaultDetailPanel")[0]);
            WebAPI.post('/analysis/startWorkspaceDataGenHistogram',postData).done(function(rs){
                if(rs.list){
                    _this.chartData = rs;
                }else{
                    _this.chartData = {
                        list: [],
                        timeShaft: []
                    };
                }
                
                _this.initEcharts(data);
            }).always(function(){
                sessionStorage.removeItem('titleTime');
                Spinner.stop();
            });
            sessionStorage.removeItem('titleTime');
        }
        attachEvents(){
            var _this = this;
            var $container = $(this.container);
            $container.off("click","#btnClose").on("click","#btnClose",function(){
                $container.empty().prev(".tableCtn").css({ height: '100%' });
                $(_this.diagnosis.container).find(".table-body").find("tr.selected").removeClass("selected");
                _this.faultChart.clear();
            })
            $container.off("change","#faultSelect").on("change","#faultSelect",function(){
                var $curVal = parseInt($(this).val());
                _this.initFaultDetailPabel(_this.getSameFaultId($curVal))
            })
            $container.off("click","#btnExportPoint").on("click","#btnExportPoint",function(){
                new PointToAnalysis(false, null, this.exportsPoint).show();
            }.bind(this));
        }
        close() {
            this.detailArr = null;
            this.msgArr = null;
            $(this.container).empty().prev(".tableCtn").css({ height: '100%' });
            // $(this.diagnosis.container).find(".table-body").css({ height: '80vh' });
            this.faultChart && this.faultChart.clear();
        }
    }

    exports.FaultDetailPanel = FaultDetailPanel;
} ( namespace('diagnosis.components')));