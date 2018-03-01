// spectrum.js
;(function (exports,diagnosisEnum) {
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
                    <div id="leftFaultDetailPanel" class="col-md-6">\                       
                    </div>\
                    <div id="rightFaultDetailPanel" class="col-md-6"><div class="panelTab"><span class="divTab active">${I18n.resource.archives.HISTORY_CURVE}</span><span class="divTab">${I18n.resource.archives.MAINTAIN_RECORDS}</span></div>
                    <div class="panelChart">
                        <div class="divChart" data-type="spectrum"><div class="spectrumTime"  style="display:flex;position:absolute;right:0;top:0"> <input type="text" id="queryAnlysisTimIpt1" class="form-control" /></div><div class="chartLabel">${I18n.resource.archives.SPECTRUM}</div><div class="chartBody"></div></div>
                        <div class="divChart" data-type="history"><span id="btnExportPoint" class="glyphicon glyphicon-export"></span><div class="chartLabel">${I18n.resource.archives.HISTORY_CURVE}</div><div class="chartBody"></div></div>
                    </div>
                    </div>\
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
                    boundaryGap: true,
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
            var faultChart = echarts.init(document.getElementById('rightFaultDetailPanel').querySelector('.divChart[data-type="history"] .chartBody'));
            this.faultChart = faultChart;
            this.option = option;
            let isAllEmpty = true;
            for(let i=0, len=option.series.length; i < len; i++){
                if(option.series[i].data.length !== 0){
                    isAllEmpty = false;
                }
            }
            if(isAllEmpty){
                option.xAxis = Object.assign({},option.xAxis,{
                    axisLine:{
                        lineStyle: {
                            color: "#ffffff"
                        }
                    },
                })
                option.yAxis = Object.assign({},option.yAxis,{
                    axisLine:{
                        show: true,
                        lineStyle: {
                            color: "#ffffff"
                        }
                    },
                })
            }
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
            $('#queryAnlysisTimIpt1').val(toDate(selectedData[0].time).format('yyyy-MM')).datetimepicker({
                format: 'yyyy-mm',
                autoclose: true,
                minView: 3,
                startView: 3,
                pickerPosition:"bottom-left",
                weekStart: 1, 
                endDate:new Date()
              
            });
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
                    entityId: row.entityId,
                    num:row.num
                }
                if(isAddFaultId){
                    _this.faultIds.push(row.faultId);
                }
                if(isAddFaultIdAndEntityId){
                    _this.faultAndEntityIds.push(obj);
                }
            })
            this.initFaultDetailPabel(this.getSameFaultId(this.faultIds[0], searchTime));
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
                num:this.faultAndEntityIds[0].num,
                searchTime: searchTime
            };
        }
        initFaultDetailPabel(data,searchTime){
            var _this = this;
            this.leftSlider = `\
                <div class="panelLeftBody">
                <div class="divPanelLabel">${I18n.resource.archives.ARCHIVES}</div>
                <div class="divFault">\
                <p class="pTitleLeft">${I18n.type == 'zh'?'时间:':'Time:'}</p>\
                    <div class="selectBigBox">\
                        <select id="faultSelect" data-ids="{id}">\
                            {selectOption2}\
                        </select>\
                        <div class="selectBtnBox"><span class="topBtnSelect"></span><span class="bottomBtnSelect"></span></div>
                    </div>\
                </div>\
                <div class="divFaultNew divFaultNew1" style=" margin-bottom: 0px;padding: 0;height:40px;">\
                    <p class="pTitleLeft">${I18n.resource.faultDetailPanel.FAULT_NAME1}</p>\
                    <div class="pTitleRight">\
                        {selectOption}\
                    </div>\
                </div>\
                <div class="divFaultNew" style=" margin-bottom: 0px;">\
                <p class="pTitleLeft">${I18n.type == 'zh'?'处理状态:':'Status:'}</p>\
                <div class="pTitleRight">\
                    {selcetStatus}\
                    </div>\
                </div>\
                <div class="divFaultNew" style=" margin-bottom: 0px;">\
                <p class="pTitleLeft">${I18n.type == 'zh'?'等级:':'Grade:'}</p>\
                <div class="pTitleRight" style="color:{gradeColor};">\
                    {grade}\
                    </div>\
                </div>\
                <div class="divFaultNew" style=" margin-bottom: 0px;">\
                <p class="pTitleLeft">${I18n.type == 'zh'?'后果:':'Consequence:'}</p>\
                <div class="pTitleRight">\
                    {consequence}\
                    </div>\
                </div>\
                <div class="divFaultInfo divFaultInfos" style=" margin-bottom: 0px;padding: 0;">\
                    <div class="divFaultNumbers" style="width: 60%;"><p class="pTitle"  style="width: 100px;display: inline-block;"title="">${I18n.type == 'zh'?'处理建议:':'Serviceability:'}</p><div class="pTitle" style="color:#354052;width: calc(100% - 100px);line-height: 24px;display: inline-block;">{maintainable}</div></div>\
                    <div class="divFaultFreq" style="width: 40%;"><p class="pTitle"   style="width: 50%;display: inline-block;" title="">${I18n.type == 'zh'?'故障来源:':'Source:'}</p><div class="pTitle" style="color:#354052;width: 50%;display: inline-block;line-height: 24px;">{faultTag}</div></div>\
                </div>\
                <div class="divFaultInfo divFaultInfoOne">\
                    <div class="divFaultNumbers"><p class="pTitle" title="${I18n.resource.faultDetailPanel.OCCUE_TIMES1}">${I18n.resource.faultDetailPanel.OCCUE_TIMES1}</p><div class="faultNumbers">{faultNumbers}</div></div>\
                    <div class="divFaultFreq"><p class="pTitle" title="${I18n.resource.archives.FREQUENC1Y}">${I18n.resource.archives.FREQUENCY1}</p><div class="faultFreq">{faultFreq}</div></div>\
                    <div class="divSavingMoney"><p class="pTitle" title="${I18n.resource.faultDetailPanel.COST_SAVING1}">${I18n.resource.faultDetailPanel.COST_SAVING1}</p><div class="savingMoney">{savingMoney}</div></div>\
                </div>\
                <div class="divDetail">\
                    <p class="pTitle" style="vertical-align: top;width: 100px;display: inline-block;">${I18n.resource.faultDetailPanel.DETAIL}</p><div class="faultDetail" >{detail}</div>\
                </div></div>
                <div class="rightClick"></div>
                `;
            var time = this.diagnosis.conditionModel.time();
            data.projectId = AppConfig.projectId;
            // data.startTime = time.startTime;
            // data.endTime = time.endTime;
            var pointTime=_this.diagnosis.store.timeNow[0];
            if(sessionStorage.getItem("curValTime")){
                pointTime=sessionStorage.getItem("curValTime");
                sessionStorage.removeItem("curValTime")
            }
            data.startTime = new Date(+new Date(pointTime) - 2592000000).format('yyyy-MM-dd HH:mm:ss');
            data.endTime = new Date(+new Date(pointTime)+500000).format('yyyy-MM-dd HH:mm:ss');
            data.lang = I18n.type;
            data.time = this.diagnosis.store.timeNow;
            var key=0;
            if(data.searchTime){
                this.diagnosis.store.faultAll.forEach((row,index)=>{
                    if(row.time==data.searchTime){
                        key=index
                    }
                })
            }
            data.taskStatus = this.diagnosis.store.faultAll[key].taskStatus;
            data.grade=this.diagnosis.store.faultAll[key].grade;
            data.consequence=this.diagnosis.store.faultAll[key].consequence;
            data.maintainable=this.diagnosis.store.faultAll[key].maintainable;
            data.faultTag=this.diagnosis.store.faultAll[key].faultTag
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
                    // $('.rightClick').off('click').on('click',function(){
                        
                    //                     if($('.cardTrRow.selectedTr').next().hasClass('cardTrRow')){
                    //                         $('.cardTrRow.selectedTr').next().trigger('click')
                    //                     }else if($('.cardTrRow.selectedTr').next().next().hasClass('cardTrRow')){
                    //                         $('.cardTrRow.selectedTr').next().next().trigger('click')
                    //                     }
                    //                 })
                }else{
                    Spinner.spin($("#leftFaultDetailPanel")[0]);
                    WebAPI.post('/diagnosis_v2/getFaultsInfoAndPoints',data).done(function(msgArr){
                        _this.msgArr = _this.msgArr.concat(msgArr.data);
                        $("#leftFaultDetailPanel",_this.container).empty().append(_this.leftSlider.formatEL(_this.getDataOpt(_this.detailArr,msgArr.data,data)));
                        Spinner.stop();
                        _this.initRightSlider(msgArr.data[0]);
                        // $('.rightClick').off('click').on('click',function(){
                            
                        //                     if($('.cardTrRow.selectedTr').next().hasClass('cardTrRow')){
                        //                         $('.cardTrRow.selectedTr').next().trigger('click')
                        //                     }else if($('.cardTrRow.selectedTr').next().next().hasClass('cardTrRow')){
                        //                         $('.cardTrRow.selectedTr').next().next().trigger('click')
                        //                     }
                        //                 })
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
                    $('.rightClick').off('click').on('click',function(){
                        
                                        if($('.cardTrRow.selectedTr').next().hasClass('cardTrRow')){
                                            $('.cardTrRow.selectedTr').next().trigger('click')
                                        }else if($('.cardTrRow.selectedTr').next().next().hasClass('cardTrRow')){
                                            $('.cardTrRow.selectedTr').next().next().trigger('click')
                                        }
                                    })
                })
            }   
            this.dataSpectrum=data
            this.initSpectrum(data);
                   
        }
        getDataOpt(detailArr,msgArr,data){
            var _this = this;
            var opt = {
                selectOption: (function(){
                    var tpl = "";
                    detailArr.forEach(function(row,i){
                        // if(row.id === data.id){
                        //     tpl += '<textarea   rows="2"  value="'+ row.name +'">'+ row.name  +'</textarea>';
                        // }else{
                        //     tpl += '<textarea   rows="2 "value= "'+ row.name +'">'+ row.name  +'</textarea>';
                        // }
                        if(row.id === data.id){
                            tpl += '<div class="rightDiv"  rows="2"  value="'+ row.name +'">'+ row.name  +'</div>';
                        }else{
                            tpl += '<div  class="rightDiv" rows="2 "value= "'+ row.name +'">'+ row.name  +'</div>';
                        }
                    });
                    return tpl;
                }()),
                selectOption2: (function(){
                    var tpl = "";
                    // detailArr.forEach(function(row,i){
                    //     if(row.id === data.id){
                    //         tpl += '<option selected="selected" value="'+ row.id +'">'+ data.time +'</option>';
                    //     }else{
                    //         tpl += '<option value= "'+ row.id +'">'+ data.time +'</option>';
                    //     }
                    // });
                    _this.diagnosis.store.timeNow.forEach((row,i)=>{
                        if(!_this.curValTime){
                            if(i==0){
                                tpl += '<option  data-ids="'+data.id + '"selected="selected" value="'+ row +'">'+ row +'</option>';
                            }else{
                                tpl += '<option  data-ids="'+data.id + '"value= "'+ row +'">'+ row +'</option>';
                            }
                        }else{  
                            if(_this.curValTime==row){
                                tpl += '<option  data-ids="'+data.id + '"selected="selected" value="'+ row +'">'+ row +'</option>';
                            }else{
                                tpl += '<option  data-ids="'+data.id + '"value= "'+ row +'">'+ row +'</option>';
                            }
                        }
                        
                    })
                    return tpl;
                }()),
                id:(function(){
                    return data.id
                }),
                selcetStatus:(function(){
                    var word;
                    word=diagnosisEnum.taskStatusName[data.taskStatus];
                    return word
                }),
                grade:(function(){
                    var word;
                    //  if(!data.grade){
                    //     word=AppConfig.language=='zh'? '提示' : 'Note';
                    //  }else if(data.grade==1){
                    //      word=AppConfig.language=='zh'? '异常' : 'Alert';
                    //  }else if(data.grade==2){
                    //     word=AppConfig.language=='zh'? '故障' : 'Fault';
                    //  }
                    word=diagnosisEnum.faultGradeName[data.grade];
                    
                    return word
                }),
                faultTag:(function(){
                    var word;
                     if(!data.faultTag){
                        word=AppConfig.language=='zh'? 'BeOP' : 'BeOP';
                     }else if(data.faultTag==1){
                         word=AppConfig.language=='zh'?'BA' : 'BA';
                     }
                    return word
                }),
                maintainable:(function(){
                    var word;
                    //  if(!data.maintainable){
                    //     word=AppConfig.language=='zh'? '建议处理' : 'Action';
                    //  }else if(data.maintainable==1){
                    //      word=AppConfig.language=='zh'?'建议记录' : 'Notes';
                    //  }
                     word=diagnosisEnum.faultMaintainableName[data.maintainable];
                    return word
                }),
                gradeColor:(function(){
                    var word;
                     if(!data.grade){
                        word="#FFD428"
                     }else if(data.grade==1){
                         word="#FFA028"
                     }else if(data.grade==2){
                        word="#E06D06"
                     }
                    return word
                }),
                faultNumbers: (function(){
                    return data.num;
                }()),
                consequence: (function(){
                    return diagnosisEnum.faultConsequenceName?diagnosisEnum.faultConsequenceName[data.consequence]:'';
                }()),
                savingMoney: (function(){
                    var saveCost = 0;
                    msgArr.forEach(function(row){
                        saveCost += (row.energy * (row.elecPrice || _this.diagnosis.powerPrice));
                    })
                    var unit=AppConfig.project?Unit.prototype.getCurrencyUnit(AppConfig.project.unit_currency):AppConfig.projectCurrent?Unit.prototype.getCurrencyUnit(AppConfig.projectCurrent.unit_currency): Unit.prototype.getCurrencyUnit()
                    return unit + saveCost.toFixed(2);
                }()),
                faultFreq: (function(){
                    var occueTimes = 0;
                    msgArr.forEach(function(row){
                        occueTimes += row.occueTimes;
                    })
                    return occueTimes;
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
                }())
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
            let timeNow=_this.curValTime?_this.curValTime:_this.diagnosis.store.timeNow[0];
            var startTime = moment(timeNow).subtract(3, 'h').format("YYYY-MM-DD HH:mm:ss");
            var endTime = moment(timeNow).add(3, 'h').format("YYYY-MM-DD HH:mm:ss");  
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
            _this.curValTime=null;
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
        initSpectrum(data,isFromSerachMonth){
            var _this = this;
            let time = this.diagnosis.conditionModel.time();
            var $queryAnlysisTimIptVal= $('#queryAnlysisTimIpt1').val()
            if(isFromSerachMonth==1){
                Spinner.spin($("#rightFaultDetailPanel")[0]);
            }
            time ={
                startTime:moment( toDate($queryAnlysisTimIptVal)).format('YYYY-MM-01 00:00:00'),
                endTime:moment( toDate($queryAnlysisTimIptVal)).format('YYYY-MM-'+DateUtil.daysInMonth( toDate($queryAnlysisTimIptVal))+' 00:00:00')
            }
            // this.getElecPrice(entitiesIdArr, faultsIdArr, time, categoriesArr, this.conditionModel.searchKey());
            this.getTimeArr(time);
            var postData = {
                "projectId":AppConfig.projectId,
                "startTime":time.startTime,
                "endTime":time.endTime,
                "entityIds":data.entityIds ?data.entityIds:[],
                "keywords":"",
                "faultIds":data.id?[data.id]:[],
                "classNames":[],
                "entityNames":[],
                "lang":"zh",
                "pageSize":25,
                "pageNum":1
            }
            // var postData = {
            //     "projectId":647,
            //     "startTime":"2017-10-19 00:00:00",
            //     "endTime":"2017-10-25 23:59:59",
            //     "entityIds":[],
            //     "keywords":"",
            //     "faultIds":[],
            //     "classNames":[],
            //     "entityNames":[],
            //     "lang":"zh",
            //     "pageSize":25,
            //     "pageNum":1
            // }
            WebAPI.post('/diagnosis_v2/getGroupByEquipment',postData).done((result)=>{
                var echartsData = [];
                let arrNoticeData = !result.data.data.length?{arrNoticeTime:[]}:result.data.data[0];
                // let arrNoticeData = result.data.data[0].arrNoticeTime;
                //处理echarts的数据    
                // echartsData.push(this.getEchartsData(arrNoticeData));
                // this.echartsInit(this.container.querySelector('.divChart[data-type="spectrum"] .chartBody'),echartsData[0]);
                
                
                $('.divChart[data-type="spectrum"] .chartBody').html(_this.newSpectrumRun(arrNoticeData,time))
            }).always(()=>{
                if(isFromSerachMonth==1){
                    Spinner.stop();
                }
            })
        }
        timeInterval(start,end){
                var timeIntervalObj = {};
                var startTimeCogVal = timeFormat(start + ':00', 'yyyy-mm-dd hh:ii:ss');
                var endTimeCogVal = timeFormat(end + ':00', 'yyyy-mm-dd hh:ii:ss');
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
        }
        newSpectrumRun(detailInfoData,time){
            var timeIntervalObj = this.timeInterval(time.startTime,time.endTime);
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
                        var noticeTime = detailInfoData.arrNoticeTime[k].time;
                        var hourCompaTime = noticeTime.split(' ')[0] + ' ' + noticeTime.split(' ')[1].split(':')[0];
                        if (hourPrimTime == hourCompaTime) {
                            count = count + 1;
                                var nowCheckT = detailInfoData.arrNoticeTime[k].EndTime ? detailInfoData.arrNoticeTime[k].EndTime : null;
                                faultTimeArr.endTime.push(nowCheckT);
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
                var currentnowType='fault';
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
                        var timeStartF, timeEndF, timeStartA = new Date(time.startTime),
                            timeEndA = new Date(time.endTime);
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
                        var startTimeNum = (new Date(timeStartF).valueOf() - new Date(time.startTime.replace(/-/g,'/')).valueOf()) / 3600000;
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
                    spectrumDiv += '<div class="spectrumDiv" title="' + timeFormat(detailInfoI[0].split(' ')[0], timeFormatChange('yyyy-mm-dd')) + '" style="width:' + 100 / timeIntervalObj.length + '%;background:-webkit-linear-gradient(top,#f0f4fb,#e4ecf9);position:relative">' + this.spectrumDivChild(faultTimeArr) + '</div>';
                } else {
                    var evenColor = '-webkit-linear-gradient(top,#ffffff,#f0f4fb)';
                    spectrumDiv += '<div class="spectrumDiv" title="' + timeFormat(detailInfoI[0].split(' ')[0], timeFormatChange('yyyy-mm-dd')) + '" style="width:' + 100 / timeIntervalObj.length + '%;background:-webkit-linear-gradient(top,#ffffff,#f0f4fb);position:relative">' + this.spectrumDivChild(faultTimeArr) + '</div>';
                }
            }

            return spectrumDiv
        }
        unique(arr) { //去重复
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
        spectrumDivChild(faultTimeArr) {
            //var rgbArrColor = _this.hslOrRgb(count);
            var faultTimeArrTime = this.unique(faultTimeArr.time);
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
        getEchartsData(arrNoticeData) {
            let faultData = [],
                abnormalData = [];
            for (var i = 0; i < this.timeArr.length; i++){
                faultData.push(0);
                abnormalData.push(0);
            }
            for (let j = 0; j < arrNoticeData.length; j++){
                let time = moment(arrNoticeData[j].time).format('YYYY-MM-DD HH:mm:00');
                let endTime = arrNoticeData[j].endTime;
                let startIndex = this.timeArr.indexOf(time);
                let endIndex;
                if (endTime !== null) {
                    endTime = moment(arrNoticeData[j].endTime).format('YYYY-MM-DD HH:mm:00');
                    endIndex = this.timeArr.indexOf(endTime);
                } else {
                    endIndex = this.timeArr.length - 1;
                }
                if (arrNoticeData[j].grade === 1){//异常
                   for (let d = startIndex; d < endIndex; d++){
                        abnormalData[d] += 1;
                    }
                } else {//故障
                    for (let d = startIndex; d < endIndex; d++){
                        faultData[d] += 1;
                    }
               }
            }
            return {
                faultData: faultData,
                abnormalData: abnormalData
            };
        }
        echartsInit(doms, datas) {
            doms = doms ;
            datas = datas ;
            // this.echartsClose();
            // Array.from(doms).forEach((dom, index)=>{
            this.renderEcharts(doms, datas)
                // this.echartsPool.push(this.renderEcharts(dom, datas));
            // });            
        }
        renderEcharts(echartsCtn,data) {
            let option = {
                color:['rgb(207,59,96)','rgb(0,184,230)'],
                tooltip: {
                    trigger: 'axis',
                    position: function (pt, params, dom, rect, size) {
                        let width = Number($(dom).css('width').split('px')[0]);
                        return [pt[0]-width, '6%'];
                    }
                },
                grid: {
                    left: 0,
                    right: 0,
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: this.timeArr,
                    show:false
                },
                yAxis: {
                    type: 'value',
                    boundaryGap: [0, '100%'],
                    show:false
                },
                series: [
                    {
                        name: diagnosisEnum.faultGradeName[diagnosisEnum.faultGrade['FAULT']],
                        type:'line',
                        symbol: 'none',
                        // sampling: 'average',
                        step:"start",
                        // areaStyle: {
                        //     normal: {
                        //         color: 'rgba(207,59,96,.9)',
                        //         opacity: 1
                        //     }
                        // },
                        lineStyle: {
                            normal: {
                                color: 'rgba(207,59,96,.9)',
                                width: 2,
                                shadowColor: 'rgba(103, 100, 100, 0.5)',
                                shadowBlur: 5
                            }
                        },
                        data:data.faultData
                    },
                    {
                        name: diagnosisEnum.faultGradeName[diagnosisEnum.faultGrade['EXCEPTION']],
                        type:'line',
                        symbol: 'none',
                        // sampling: 'average',
                        step:"start",
                        // areaStyle: {
                        //     normal: {
                        //         color:'rgba(0,184,230,.9)',
                        //         opacity: 1
                        //     }
                        // },
                        lineStyle: {
                            normal: {
                                color:'rgba(0,184,230,.9)',
                                width: 2,
                                shadowColor: 'rgba(103, 100, 100, 0.5)',
                                shadowBlur: 5
                            }
                        },
                        data: data.abnormalData
                    }
                ]
            };
            let echartsInstance = echarts.init(echartsCtn);
            echartsInstance.setOption(option);
            return echartsInstance;
        }
        getTimeArr(timeArr) {
            let min = 60000,
                day = 86400000;
            let startTime = +moment(timeArr.startTime).format('x'),
                endTime = +moment(timeArr.endTime).format('x') + day;
            this.timeArr = [];
            for (;startTime < endTime; startTime+=min){
                this.timeArr.push(moment(startTime).format('YYYY-MM-DD HH:mm:ss'));
            }
        }
        attachEvents(){
            var _this = this;
            var $container = $(this.container);
            $container.off("click","#btnClose").on("click","#btnClose",function(){
                $container.empty().prev(".tableCtn").css({ height: '100%' });
                $(_this.diagnosis.container).find(".table-body").find("tr.selected").removeClass("selected");
                _this.faultChart && _this.faultChart.clear();
            })
            $container.off("change","#faultSelect").on("change","#faultSelect",function(){
                var $curVal = parseInt($(this).attr('data-ids'));
                var $curValTime=$(this).val();
                _this.curValTime=$(this).val();
                sessionStorage.setItem("curValTime",_this.curValTime);
                $('#queryAnlysisTimIpt1').val(toDate(_this.curValTime).format('yyyy-MM'));
                _this.initFaultDetailPabel(_this.getSameFaultId($curVal,$curValTime));
            });
            $container.off('click','.topBtnSelect').on("click",".topBtnSelect",function(){
                var curValTime=$container.find('#faultSelect').val();
                if($container.find('option[value="'+curValTime+'"]').prev().length){
                    var value=$container.find('option[value="'+curValTime+'"]').prev().attr("value");
                    $container.find('#faultSelect').val(value);
                    $container.find("#faultSelect").trigger("change");
                }else{
                    alert(AppConfig.language=='zh'?"当前是第一个。":"Now it's the first one")
                }
            })
            $container.off('click','.bottomBtnSelect').on("click",".bottomBtnSelect",function(){
                var curValTime=$container.find('#faultSelect').val();
                if($container.find('option[value="'+curValTime+'"]').next().length){
                    var value=$container.find('option[value="'+curValTime+'"]').next().attr("value");
                    $container.find('#faultSelect').val(value);
                    $container.find("#faultSelect").trigger("change");
                }else{
                    alert(AppConfig.language=='zh'?"当前是最后一个。":"Now it's the last one")
                }
            })
            $container.off("click", "#btnExportPoint").on("click", "#btnExportPoint", function () {
                if (_this.exportsPoint.length > 0) {
                    new PointToAnalysis(false, null, _this.exportsPoint).show();
                }else{
                    alert('no data!')
                }
            });

            $container.off("change","#queryAnlysisTimIpt1").on("change","#queryAnlysisTimIpt1",function(){
               _this.initSpectrum(_this.dataSpectrum,1)
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
} ( namespace('diagnosis.CaseRecord'),namespace('diagnosis.enum')));