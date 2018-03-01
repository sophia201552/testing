;(function (exports, WorkOrderModal, diagnosisEnum) {
    class TaskModal {
        constructor(parentDomName, diagnosis) {
            this.parentDomName = parentDomName;
            this.diagnosis = diagnosis;
            this.container = null;
            this.$actionModal = null;
            this.WorkOrderModal = null;
            this.data = null;
            this.chartData = null;
            this.async = [];
            this.saveData = {
                "operatorId": AppConfig.userId,
                "comment": '',
                "data": {}
            }
            //需要被导出的点名
            this.exportsPoint = [];            
            this.init();
        }
        init() {
            const infoHtml = `
                <div class="row">
                    <div class="col-sm-6">
                        
                        <div class="form-group">
                            <label for="taskInfoName">${I18n.resource.taskModal.INFO_TITLE}</label>
                            <select id="taskInfoName" class="form-control">
                                
                            </select>
                        </div>
                        
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm-6">
                        <div class="form-group">
                            <label for="taskInfoArea">${I18n.resource.taskModal.INFO_AREA}</label>
                            <input type="text" class="form-control" id="taskInfoArea" placeholder="" disabled />
                        </div>
                    </div>
                    <div class="col-sm-6">
                        <div class="form-group">
                            <label for="taskInfoEquip">${I18n.resource.taskModal.INFO_EQUIPMENT}</label>
                            <input type="text" class="form-control" id="taskInfoEquip" placeholder="" disabled />
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm-12">
                        <div class="form-group">
                            <label for="taskInfoDetail">${I18n.resource.taskModal.INFO_REMARKS}</label>
                            <textarea style="height:60px;resize:none;" class="form-control" id="taskInfoDetail" placeholder="" style="max-width:100%;max-height:54px;"></textarea >
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm-12">
                        <form class="form-inline">
                            <div class="form-group">
                                <label for="taskInfoCurve">${I18n.resource.taskModal.INFO_CURVE}</label>
                                <label  id="taskInfoCurve"></label>
                                <span id="btnExportPoint" class="glyphicon glyphicon-export"></span>
                            </div>
                        </form>
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm-12">
                        <div id="taskInfoCurveChartWrap" style="width:100%;height:190px;"></div>
                    </div>
                </div>
            `;
                                
            const rightHtml = `
                <div class="row">
                    <div class="col-sm-6">
                        <div class="form-group">
                            <label for="taskInfoLevel">${I18n.resource.taskModal.INFO_LEVEL}</label>
                            <select id="taskInfoLevel" class="form-control">
                            ${Object.keys(diagnosisEnum.faultLevel).map(v=>{if(!(v=='low'||v=='immediately')){return `<option value="${diagnosisEnum.faultLevel[v]}">${diagnosisEnum.faultLevelName[diagnosisEnum.faultLevel[v]]}</option>`}})}
                            </select>
                        </div>
                    </div>
                    <div class="col-sm-6">
                        <div class="form-group">
                            <label for="taskInfoStatus">${I18n.resource.taskModal.INFO_STATUS}</label>
                            <select id="taskInfoStatus" class="form-control">
                            ${Object.keys(diagnosisEnum.taskStatus).map(v => {
                                if (diagnosisEnum.taskStatus[v] != 20 && diagnosisEnum.taskStatus[v] != null) {
                                    return `<option value="${diagnosisEnum.taskStatus[v]}">${diagnosisEnum.taskStatusName[diagnosisEnum.taskStatus[v]]}</option>`
                                }
                            })}
                            </select>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm-12">
                        <div class="form-group">
                            <label for="taskInfoRemarks">${I18n.resource.taskModal.INFO_COMMENT}</label>
                            <textarea style="height:200px;max-height:300px;" class="form-control" id="taskInfoRemarks" placeholder="" style="max-width:100%;max-height:54px;"></textarea >
                        </div>
                    </div>
                </div>
                <button id="taskInfoSendWO" type="button" class="btn btn-primary" data-state="create" permission="WorkOrder">${I18n.resource.taskModal.INFO_CREATE}</button>
            `;
            const mainHtml = `
                <div id="taskModalWrap">
                    <div class="taskHead">
                        <div class="title">${I18n.resource.taskModal.TITLE}</div>
                        <div class="tabWrap">
                            
                            <ul id="taskTab" class="nav nav-tabs" role="tablist">
                                <li role="presentation" class="active"><a href="#taskInfo" aria-controls="taskInfo" role="tab" data-toggle="tab">${I18n.resource.taskModal.INFOBTN}</a></li>
                                <li role="presentation"><a href="#taskHistory" aria-controls="taskHistory" role="tab" data-toggle="tab">${I18n.resource.taskModal.HISTORYBTN}</a></li>
                            </ul>
                        </div>
                        <div class="btnWrap">
                            <button type="button" class="btn btn-default actionModalClose" data-dismiss="modal">${I18n.resource.taskModal.CLOSE}</button>
                            <button type="button" class="btn btn-primary actionModalSubmit">${I18n.resource.taskModal.SUBMIT}</button>
                        </div>
                    </div>
                    <div class="taskContent">
                        <div class="leftContent">
                            <div class="tab-content" style="height:100%;">
                                <div role="tabpanel" class="tab-pane active" id="taskInfo">
                                    ${infoHtml}
                                </div>
                                <div role="tabpanel" class="tab-pane" id="taskHistory">
                                    <div class="commentWrap"></div>
                                </div>
                            </div>
                        </div>
                        <div class="rightContent">
                            ${rightHtml}
                        </div>
                    </div>
                </div>
            `;
            $('#taskModalWrap').remove();
            $('#'+this.parentDomName).append(mainHtml);
            I18n.fillArea($($('#'+this.parentDomName)));
            this.container = document.querySelector('#taskModalWrap');
            this.$actionModal = $(this.container);
            this.attachEvent();
        }
        show(data = []) {
            if($('#taskModalWrap').length==0){
                this.init();
            }
            this.$actionModal.children().hide();
            this.$actionModal.animate({'bottom':'0px'},500,()=>{
                this.$actionModal.children().fadeIn();
                Spinner.spin(this.container);
                this.async[0] = WebAPI.get(`/diagnosis_v2/getTaskDetail/${data[0].id}`).done((result)=>{
                    if(result.status === "OK"){
                        this.data = result.data;
                        Spinner.stop();
                        Spinner.spin(this.container);
                        this.async[1] = WebAPI.post("/diagnosis_v2/getWorkOrderInfo", {
                            ids: [this.data.noticeId],
                            projectId: AppConfig.projectId,
                            lang: I18n.type
                        }).done((result)=>{
                            if(result.status === "OK"){
                                this.data.noticeInfo = result.data[0]||{
                                    "points":[]
                                };
                                this.data.noticeInfo.noticeId = this.data.noticeId;
                                this.renderInfo(this.data);
                                this.renderComment(this.data.operations);
                            } else {
                                alert("The failure information is incorrect!");
                            }                    
                        }).always(()=>{
                            Spinner.stop();
                            this.async[1] = undefined;
                        });
                    } else {
                        alert("The failure information is incorrect!");
                    }                    
                }).always(()=>{
                    Spinner.stop();
                    this.async[0] = undefined;
                }) 
            });
            
        }
        close(ms=500) {
            this.async.forEach(v=>{
                if(v){
                    v.abort();
                    v = undefined;
                }
            });
            
            this.data = null;
            this.chartData = null;
            this.$actionModal.animate({'bottom':'-500px'},ms);
            window.CAPTURE_INSTANCES.forEach(ins=>{
                ins.captureDoms = [];
            });
            window.CAPTURE_INSTANCES = [];
            $('.feedBackModalBtn').removeClass('highLight');            
        }
        attachEvent() {
            const _this = this;
            $('#taskTab a').click(function (e) {
                e.preventDefault();
                $(this).tab('show');
            });
            $('#taskInfoName', this.container).off('change').on('change',function(e){
                
            });
            $('#taskInfoSendWO', this.container).off('click').on('click',function(e){
                if(this.dataset.state == 'create'){
                    _this.WorkOrderModal = new WorkOrderModal([_this.data.noticeInfo]);
                    _this.WorkOrderModal.show();
                    _this.WorkOrderModal.addHandleFn((taskId)=>{
                        _this.saveData.data.workTaskId = taskId;
                        $('#taskInfoSendWO', this.container).html(I18n.resource.taskModal.INFO_CHECK).attr('data-state','view');
                    });
                }else{
                    window.open('/observer#page=workflow&type=transaction&transactionId=' + (_this.data.workTaskId||_this.saveData.data.workTaskId));
                    //摸态框查看
                    // _this.WorkOrderModal = new WorkOrderModal([{
                    //     readOnly: true,
                    //     workTaskId: _this.data.workTaskId||_this.saveData.data.workTaskId
                    // }]);
                    // _this.WorkOrderModal.show();
                }
            });
            $('.actionModalClose', this.container).off('click.actionModalClose').on('click.actionModalClose',function(){
                _this.close();
                _this.WorkOrderModal && _this.WorkOrderModal.close();
            });
            $('.actionModalSubmit', this.container).off('click.actionModalSubmit').on('click.actionModalSubmit',function(){
                if(!_this.data){
                    return;
                }
                let {note, priority, status} = _this.data;
                _this.saveData.comment = $('#taskInfoRemarks', _this.container).val();
                let newPriority = $('#taskInfoLevel', _this.container).val(),
                    newStatus = $('#taskInfoStatus', _this.container).val(),
                    newNote = $('#taskInfoDetail', _this.container).val()||null;
                if(priority!=newPriority){
                    _this.saveData.data.priority = Number(newPriority);
                }
                if(note!=newNote){
                    _this.saveData.data.note = newNote;
                }
                if(status!=newStatus){
                    _this.saveData.data.status  = Number(newStatus);
                }
                Spinner.spin(_this.container);
                _this.async[3] = WebAPI.post(`/diagnosis_v2/updateTask/${_this.data.id}`, _this.saveData).done((result)=>{
                    if (result.status === "OK") {
                        _this.close();
                        $('[data-class=Task]').trigger('click');
                    } else {
                        
                    }                    
                }).always(()=>{
                    Spinner.stop();
                    _this.async[3] = undefined;
                }) 
            })
            //导出曲线点
            $('#btnExportPoint').off("click").on("click", function () {
                if (_this.exportsPoint.length > 0) {
                    new PointToAnalysis(false, null, _this.exportsPoint).show();
                }else{
                    alert('no data!')
                }
            });            
        }
        renderInfo(data) {
            let {time,  note, priority, workTaskId, status, operations, noticeInfo} = data;
            let startTime = moment(time).subtract(3, 'h').format("YYYY-MM-DD HH:mm:ss"),
                endTime = moment(time).add(3, 'h').format("YYYY-MM-DD HH:mm:ss"); 
            $('#taskInfoName', this.container).html(`<option>${noticeInfo.faultName}</option>`);
            $('#taskInfoDetail', this.container).val(note||'');
            $('#taskInfoArea', this.container).val(noticeInfo.entityParentName+'');
            $('#taskInfoEquip', this.container).val(noticeInfo.entityName+'');
            $('#taskInfoCurve', this.container).html(startTime + ' - ' + endTime);
            $('#taskInfoLevel', this.container).val(priority);
            $('#taskInfoStatus', this.container).val(status);
            $('#taskInfoRemarks', this.container).val('');
            if(workTaskId){
                $('#taskInfoSendWO', this.container).html(I18n.resource.taskModal.INFO_CHECK).attr('data-state','view');
            }else{
                $('#taskInfoSendWO', this.container).html(I18n.resource.taskModal.INFO_CREATE).attr('data-state','create');
            }
            this.renderChart($("#taskInfoCurveChartWrap")[0], noticeInfo['points'], startTime, endTime);
            
        }
        renderComment(data) {
            let oldLocale = moment.locale();
            if(I18n.type == 'zh'){
                moment.locale('zh-cn', {  
                    relativeTime : {  
                        future : '%s内',  
                        past : '%s前',  
                        s : '几秒',  
                        m : '1 分钟',  
                        mm : '%d 分钟',  
                        h : '1 小时',  
                        hh : '%d 小时',  
                        d : '1 天',  
                        dd : '%d 天',  
                        M : '1 个月',  
                        MM : '%d 个月',  
                        y : '1 年',  
                        yy : '%d 年'  
                    }
                });
            }

            let list = '';
            data.forEach(info=>{
                let detail = JSON.parse(info.detail.replace(/'/g,'"').replace(/None/,'"None"')).map(v=>{
                    if(v.type == diagnosisEnum.taskHandleType.CHANGE_STATUS){
                        v.from = diagnosisEnum.taskStatusName[v.from];
                        v.to = diagnosisEnum.taskStatusName[v.to];
                    }
                    if(v.type == diagnosisEnum.taskHandleType.CHANGE_PRIORITY){
                        v.from = diagnosisEnum.faultLevelName[v.from];
                        v.to = diagnosisEnum.faultLevelName[v.to];
                    }
                    return diagnosisEnum.taskHandleTypeName[v.type].formatEL({
                        operator: v.operator,
                        operator2: info.operator,
                        from: v.from,
                        to: v.to
                    });
                });
                list += `
                    <li class="media">
                        <div class="media">
                            <div class="media-left media-top">
                                <img class="media-object img-circle" src="${info.avator}" alt="not find">
                            </div>
                            <div class="media-body">
                                <div class="nameWrap">
                                    <span class="name">${info.operator}&nbsp;&nbsp;</span>
                                    <span class="createTime">${moment(info.time).fromNow()}</span>
                                </div>
                                ${detail.map(v=>`<span><span class="glyphicon glyphicon-pencil"></span> ${v}</span>`).join('')}
                                <span style="margin-top:8px;display:${info.comment?'block':'none'}" class="commentContent" title="${info.comment}">${info.comment}</span>
                            </div>
                        </div>
                    </li>
                `;
            });
            let html = `<ul class="media-list">${list}</ul>`;
            $('.commentWrap').html(html);
            moment.locale(oldLocale);
        }
        renderChart(dom, points=[], startTime, endTime) {
            let dsItemIds = [];
            points.forEach(function(point){
                let dsItemId;
                if(point.name.indexOf("|") < 0){
                    dsItemId = "@"+AppConfig.projectId+"|"+point.name;
                }else{
                    dsItemId = point.name;
                }
                dsItemIds.push(dsItemId);
            }.bind(this))
            this.exportsPoint = points.concat()
            let postData = {
                dsItemIds: dsItemIds,
                timeStart:startTime,
                timeEnd:endTime,
                timeFormat:"m5"
            };
            Spinner.spin($("#taskInfoCurveChartWrap")[0]);
            this.async[2] = WebAPI.post('/analysis/startWorkspaceDataGenHistogram',postData).done((rs)=>{
                if(rs.list){
                    this.chartData = rs;
                }else{
                    this.chartData = {
                        list: [],
                        timeShaft: []
                    };
                }
                this.initChart({
                    points: points
                });
            }).always(()=>{
                Spinner.stop();
                this.async[2] = undefined;
            });
        }
        initChart(selectData) {
            let _this = this;
            let option = {
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
                    }
                },
                legend: {
                    align: "left",
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
            let faultChart = echarts.init(document.getElementById('taskInfoCurveChartWrap'));
            faultChart.setOption(option);
            window.onresize = faultChart.resize;
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
                ];
                var statusPoint = {
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
                // statusPoint.data = statusData[0].data;
                statusPoint.markArea.data = markAreaData;
                data.push(statusPoint);
                // this.onArr = onArr;
                // this.index = index;
            }
            return data;
        }
    }
    exports.TaskModal = TaskModal;
} ( namespace('diagnosis.components'),namespace('diagnosis.components.WorkOrderModal'),namespace('diagnosis.enum')
));