// spectrum.js
;(function (exports) {
    class FaultDetailPanel {
        constructor(container,diagnosis) {
            this.container = container;
            this.diagnosis = diagnosis;

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
                </div>`;
        }
        getxAxisData(selectData){
            var _this = this;
            var data = [];
            var statusData = [];
            var maxValArr = [];
            var minValArr = [];
            var index;
            if(selectData){
                selectData.points.forEach(function(row,i){
                    var testStr = row.name + row.description;
                    if(testStr.toLowerCase().indexOf("onoff")>-1 || testStr.toLowerCase().indexOf("sta")>-1 || testStr.toLowerCase().indexOf("status")>-1 || testStr.indexOf("开关")>-1 || testStr.indexOf("状态")>-1){
                        index = i;
                    }
                })
            }
            if(this.chartData.list){
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
                    if(LineArr.length === 1){
                        item.lineStyle = {
                            normal:{
                                opacity: 0.3,
                                shadowColor: '#6C6C72',
                                shadowBlur: 5
                            }
                        };
                    }
                    if(index === i){
                        statusData.push($.extend(true, {}, row));
                        item.step = 'start';
                        item.smooth = false;
                    }
                    data.push(item);
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
                    type:'bar',
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
                                    offset: 1, color: '#0c829f'
                                }, {
                                    offset: 0, color: '#243740'
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
                statusPoint.data = statusData[0].data;
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
                    align: "right",
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
                        selectData.points.forEach(function(row){
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
        show(selectedData) {
            var _this = this;
            if(!selectedData){return;}
            $(_this.container).empty().append(_this.tpl);
            _this.detailArr = null;
            _this.msgArr = null;
            this.faultIds = [];
            this.faultAndEntityIds = [];  
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
            })
            this.initFaultDetailPabel(this.getSameFaultId(this.faultIds[0]));
            this.attachEvents();
        }
        getSameFaultId(faultId){
            var data = [];
            this.faultAndEntityIds.forEach(function(row){
                if(row.faultId === faultId){
                    data.push(row.entityId);
                }
            })
            return {
                id:faultId,
                entityIds:data
            };
        }
        initFaultDetailPabel(data){
            var _this = this;
            this.leftSlider = `\
                <div class="divFault">\
                    <p class="pTitle">${I18n.resource.faultDetailPanel.FAULT_NAME}</p>\
                    <select id="faultSelect">\
                        {selectOption}\
                    </select>\
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
                }),WebAPI.post('/diagnosis_v2/getFaultsInfoAndPoints',data)).done(function(detailArr,msgArr){
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
                    return saveCost.toFixed(2) + " $";
                }()),
                time: (function(){
                    var duration = 0;
                    msgArr.forEach(function(row){
                        duration += row.duration;
                    })
                    return (duration/60).toFixed(2) + " h";
                }()),
                detail: (function(){
                    var description;
                    detailArr.some(function(row){
                        if(row.id === data.id){
                            description =  row.description;
                            return true;
                        }                         
                    })
                    return description;
                }())
            };
            return opt;
        }
        initRightSlider(data){
            var _this = this;
            var middleTime = Date.parse(data.times[0]);
            var startTime = new Date(middleTime - 10800000).format("yyyy-MM-dd HH:mm:ss");
            var endTime = new Date(middleTime + 10800000).format("yyyy-MM-dd HH:mm:ss");      
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
                Spinner.stop();
            });
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