// faultTable.js 2017/05/27 carol
;(function (exports, FaultDetailPanel, diagnosisEnum, PagingTable, Capture) {
    class FaultTable extends Capture() {
        constructor(container, conditionModel,page) {
            super();
            this.container = container;
            this.conditionModel = conditionModel;
            this.store = {};
            this.selectData = [];
            this.page = page;
        }
        show() {
            let $thisContainer = $(this.container);
            $('#fault').find('.itemList').css({"pointer-events":"none"})
            let searchVal = this.conditionModel.searchKey();
            $thisContainer.html(`<div class="tableCtn caseRecordTable">
                                    <div class="conditionCtn clearfix"></div>
                                    <div class="statisticChartCtn clearfix">
                                    </div>
                                    <div class="faultTable">
                                      <div class="faultTableLeft">
                                        
                                      </div> 
                                      <div id="diagnosisFaultDetailPanel" class="caseRecordDetail ${I18n.type}" ></div>
                                    </div>
                                </div>
                                `);
            this.$conditionCtn = $thisContainer.find('.conditionCtn');
            this.$chartCtn = $thisContainer.find('.statisticChartCtn')
            this.$faultTable = $thisContainer.find('.faultTable');
            this.$diagnosisFaultDetailPanel = $thisContainer.find('#diagnosisFaultDetailPanel');

            this.initCondition(this.conditionModel.serialize());
            // this.initStatisticChart();
            this.attachEvents();
            this.unbindOb();
            this.bindOb();
            this.update();
            this.enableCapture(this.container);
        } 
        bindOb() {
            this.conditionModel.addEventListener('update', this.update, this);
        }
        unbindOb() {
            this.conditionModel.removeEventListener('update', this.update, this);
        }
        update(e, propName) {
            let _this=this;
            this.storeTree=[];
            let forbiddenArr  = ['update.time'];
            let forbiddenArr2  = ['update.activeEntities'];
            if(forbiddenArr.indexOf(propName)>-1){
                return;
            }
            if(this.conditionModel.activeAllEntities().length !== 0){
                if(this.conditionModel.activeAllEntities()[0].children){
                    return;//限制没有子节点才显示档案
                }
            }else if(this.conditionModel.activeFaults().length !== 0){
                return
            }
            let entitiesIdArrNew = [];
            let categoriesArrNew=[];
            let conditionArr2=[];
            if(this.conditionModel.activeAllEntities().length === 0){
                var nodes = (this.page.diagnosis.nav.structure.zTreeObj.getNodes())
                var parent = nodes[0]
                this.page.diagnosis.nav.structure.zTreeObj.selectNode(parent);
                this.page.diagnosis.nav.structure.zTreeObj.expandNode(parent);
                this.storeTree=[parent];
                while(this.storeTree[0].children){
                    this.storeTreeParent=this.storeTree[0].children
                    this.storeTree=[this.storeTree[0].children[0]];
                }
                
                this.storeTree.forEach(v=>{
                    entitiesIdArrNew.push(v.id);
                    categoriesArrNew.push(v.className);
                    conditionArr2.activeEntities=[{id:v.id,name:v.name,pName:_this.storeTreeParent[0].name}]
                })
            } else if(this.conditionModel.activeFaults().length === 0){
                this.conditionModel.activeAllEntities().forEach(v => {
                    entitiesIdArrNew.push(v.id);
                    categoriesArrNew.push(v.className);
                    var nodess=(this.page.diagnosis.nav.structure.zTreeObj.getNodeByTId(v.parentTId));
                    conditionArr2.activeEntities=[{id:v.id,name:v.name,pName:nodess.name}];
                });
            }
           
            if(this.storeTree.length){
                $('#'+this.storeTree[0].tId+'_a').click();
            }
            let entitiesIdArr = [];
            this.conditionModel.activeAllEntities().forEach(v => {
                entitiesIdArr.push(v.id);
            });
            let faultsIdArr = [];
            this.conditionModel.activeFaults().forEach(v => {
                faultsIdArr.push(v.faultId);
            });
            let categoriesArr = this.conditionModel.activeCategories().map(v=>v.className);
            let conditionArr = this.conditionModel.serialize();
            if(forbiddenArr2.indexOf(propName)>-1){
                return;
            }
            if(faultsIdArr.length===0){
                this.initCondition(conditionArr2);
                this.getElecPrice(entitiesIdArrNew, faultsIdArr, this.conditionModel.time(), categoriesArrNew, this.conditionModel.searchKey());
                this.initStatisticChart(entitiesIdArrNew, faultsIdArr, this.conditionModel.time(), categoriesArrNew, this.conditionModel.searchKey());
                this.bigDataArr={
                    entitiesIdArr:entitiesIdArrNew,
                    faultsIdArr,
                    time:this.conditionModel.time(),
                    categoriesArr:categoriesArrNew,
                    searchKey:this.conditionModel.searchKey()
                }
                this.initTable(entitiesIdArrNew, faultsIdArr, this.conditionModel.time(), categoriesArrNew, this.conditionModel.searchKey());
            }else{
                this.initCondition(conditionArr);
                this.getElecPrice(entitiesIdArr, faultsIdArr, this.conditionModel.time(), categoriesArr, this.conditionModel.searchKey());
                this.initStatisticChart(entitiesIdArr, faultsIdArr, this.conditionModel.time(), categoriesArr, this.conditionModel.searchKey());
                this.bigDataArr={
                    entitiesIdArr,
                    faultsIdArr,
                    time:this.conditionModel.time(),
                    categoriesArr,
                    searchKey:this.conditionModel.searchKey()
                }
                this.initTable(entitiesIdArr, faultsIdArr, this.conditionModel.time(), categoriesArr, this.conditionModel.searchKey());
            }
            
            
            
        }
        initCondition(conditionArr) {
            if (sessionStorage.getItem('diagnosisCondition') && sessionStorage.getItem('diagnosisCondition') !== ''){
                var jsonData = JSON.parse(sessionStorage.getItem('diagnosisCondition'));
                var entity = jsonData.entity;
                if (entity){
                    conditionArr.activeEntities = [{
                        id: entity.id,
                        name: entity.name,
                    }]
                }
            }
            var dom = '';
            for (var key in conditionArr){
                if (key !== 'time' && key !== 'activeAllEntities' && key !== 'searchKey'){
                    for (let i = 0, ilen = conditionArr[key].length; i < ilen; i++){
                        let id = '';
                        if (key === 'activeEntities'){
                            id = conditionArr[key][i].id;
                        } else if(key === 'activeFaults'){
                            id = conditionArr[key][i].faultId;
                        }
                        dom += `<div class="singleCondition" title="${conditionArr[key][i].name}" data-type="${key}" data-id="${id}">
                                    <span class="name">${conditionArr[key][i].name}</span>
                                    <span class="glyphicon glyphicon-remove"></span>
                                </div>`;
                        dom += `<div class="singleConditionRight" title="${conditionArr[key][i].pName}" data-type="${key}" data-id="${id}">
                                <span class="">${i18n_resource.history.CATEGORY}</span>
                                <span class="">${conditionArr[key][i].pName}</span>
                            </div>`;
                    }
                }
            }
            
            dom += `<div class="statusCondition"></div>`
            this.$conditionCtn.html(dom);
        }
        initStatusInCondition(data){
            if(!data)return;
            var container = this.container.querySelector('.statusCondition')
            var status1 = getContentByValue(1,data) || {num:0}
            var status10 = getContentByValue(10,data) || {num:0}
            var status101 = getContentByValue(null,data) || {num:0}
            var status2 = getContentByValue(2,data) || {num:0}
            var dom=``;
            var sum=status1.num+status101.num+status2.num;
            var warnTip=AppConfig.language=='zh'?'无故障':'Good';
            var warnTip1=AppConfig.language=='zh'?'故障':'Fault';
            
            if(sum==0){
                dom+=`  <span class="statusTag" data-value="100" style="">
                            <span class="text">${I18n.type == 'zh'?'处理状态:':'Status:'}</span><span class="num" style="color:${sum!=0?'#C02712':'#57B048'};font-size:18px;">${sum==0?warnTip:warnTip1}</span>
                        </span>`
                container.innerHTML=dom;
                $('.statisticChartCtn').hide();
                $('.faultTable').hide();
                $('.noDataMask').remove();
                var html = `<div class="noDataMask">
                                <div class="noDataBox">
                                    <div calss="noDataImg" style="text-align: center;display: inline-block;"><img src="/static/images/error/noData.png" alt="无数据"></div>
                                    <div class="noDataText">
                                        <p style="font-size:26px;">${I18n.resource.task.FAULT1}</p>
                                    </div>
                                </div>
                            </div>`;
                $('.caseRecordTable').append(html)
            }else{
                $('.noDataMask').remove();
                $('.statisticChartCtn').show();
                $('.faultTable').show();
                
                         
            }
            function getContentByValue(value,arr){
                for (var i = 0 ; i < arr.length ;i++){
                    if (arr[i].content == value){
                        return arr[i];
                    }
                }
            }
        }
        initStatisticChart(structuresIdArr, faultsIdArr, time, categoriesArr, searchKey){
            let faultIds, entityIds, startTime, endTime, keywords;
            if (structuresIdArr === undefined){
                faultIds = [];
                entityIds = [];
                startTime = '2017-01-01 00:00:00';
                endTime = '2017-01-05 00:00:00';
                keywords = '';
            } else {
                faultIds = faultsIdArr?faultsIdArr:null;
                entityIds = structuresIdArr?structuresIdArr:null;
                startTime = time.startTime;
                endTime = time.endTime;
                keywords = searchKey?searchKey:null;
            }
            var itemFields = [
                {enum:diagnosisEnum.taskStatusName,'name':I18n.type == 'zh'?'处理状态':'Status',field:'taskStatus'},
                {enum:diagnosisEnum.faultGradeName,'name':I18n.type == 'zh'?'等级':'Grade',field:'grade'},
                {enum:diagnosisEnum.faultConsequenceName,'name':I18n.type == 'zh'?'后果':'Consequence',field:'consequence'},
                {enum:diagnosisEnum.faultMaintainableName,'name':I18n.type == 'zh'?'处理建议':'Serviceability',field:'maintainable'},
                {enum:{1:'BA',0:'BeOP'},'name':I18n.type == 'zh'?'故障来源':'Source',field:'faultTag'},
                            ];

            var itemFieldsDict = {};
            itemFields.forEach((item)=>{itemFieldsDict[item.field] = {};})
            let postData = {
                "projectId": AppConfig.projectId,
                "startTime": "",
                "endTime": "",
                "entityIds": entityIds,
                "keywords": keywords,
                "faultIds": faultIds,
                "classNames": categoriesArr,
                "pageNum": 1,
                "pageSize": 50,
                'lan': I18n.type,
                'sort': [],
                'item':itemFieldsDict
            }
            WebAPI.post('/diagnosis_v2/getEntityFaults/statistics',postData).done((result)=>{
                if (result.data){
                    this.$chartCtn.empty()
                    itemFields.forEach((item)=>{
                        var container = this.$chartCtn.find('.divChart[data-field="' + item.field +'"]')
                        if (container.length == 0){
                            container = $('<div class="divChart" data-field="' + item.field +'"></div>');
                            this.$chartCtn.append(container)
                        }
                        var option = {
                            type:item.field == 'energy'?'gauge':'',
                            title:item.name,
                            enum:item.enum,
                            field:item.field
                        }
                        if (item.field == 'taskStatus'){
                            this.initStatusInCondition(result.data[item.field])
                        }
                        this.setStatisticItemChart(result.data[item.field],container[0],option)
                    })
                }
            })
        }
        setStatisticItemChart(data,container,option){
            if (!data)return;
            var series = [        
                {
                    name:'访问来源',
                    type:'pie',
                    radius: ['43%', '51%'],
                    center:['33%','60%'],
                    avoidLabelOverlap: false,
                    hoverAnimation:false,
                    label: {
                        normal: {
                            show: false,
                            position: 'center'
                        },
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    itemStyle: {
                        normal: {
                            // borderColor: '#ffffff',
                        },
                    },                    
                    data: data.map((item) => {
                        var sName = option.enum ? option.enum[item.content]:item.content;
                        return {
                            value: item.num,
                            name: sName
                        }
                    })
                }];
                var colorArr=['#57c9ff', '#fdc401', '#e9728f', '#688bf0'];
                if(option.field=='taskStatus'){
                    colorArr=[];
                    data.forEach((item) => {
                    var sName = option.enum ? option.enum[item.content]:item.content;
                    colorArr.push(selectColortaskStatus(sName))})
                }else if(option.field=='grade'){
                    colorArr=[];
                    data.forEach((item) => {
                    var sName = option.enum ? option.enum[item.content]:item.content;
                    colorArr.push(selectColorgrade(sName))})
                }else if(option.field=='consequence'){
                    colorArr=[];
                    data.forEach((item) => {
                    var sName = option.enum ? option.enum[item.content]:item.content;
                    colorArr.push(selectColorConsequence(sName))})
                }else if(option.field=='maintainable'){
                    colorArr=[];
                    data.forEach((item) => {
                    var sName = option.enum ? option.enum[item.content]:item.content;
                    colorArr.push(selectColorMaintainable(sName))})
                }else if(option.field=='faultTag'){
                    colorArr=[];
                    data.forEach((item) => {
                    var sName = option.enum ? option.enum[item.content]:item.content;
                    colorArr.push(selectColorSource(sName))})
                }
                
            function selectColortaskStatus(name){
                switch (name){
                    case '未加入任务':
                    case 'New':
                         return "#E06D06"; 
                    case '待处理':
                    case 'To-do':
                         return "#C02712"; 
                    case '处理中':
                    case 'WIP':
                         return "#FFD428"; 
                    case '已处理':
                    case 'Solved':
                         return "#58B2FD";
                    case '已撤销':
                    case 'Rescinded':
                         return "#f4b653"
                    default: return "#555"
                 }
            }
            function selectColorgrade(name){
                switch (name){
                   case '提示':
                   case 'Note':
                        return "#FFD428"; 
                   case '异常':
                   case 'Alert':
                        return "#FFA028"; 
                   case '故障':
                   case 'Fault':
                        return "#E06D06"; 
                   default: return
                }
           }
            function selectColorConsequence(name){
                switch (name){
                case '能耗浪费':
                case 'Energy Waste':
                        return "#008D40"; 
                case '舒适度':
                case 'Comfort':
                        return "#57B048"; 
                case '设备健康':
                case 'Equipment Health':
                        return "#71D360"; 
                case '其他':
                case 'Other':
                        return "#A1EA94"; 
                default: return "#555"
                }
            }
            function selectColorMaintainable(name){
                switch (name){
                   case '建议处理':
                   case 'Action':
                        return "#58B2FD"; 
                   case '建议记录':
                   case 'Notes':
                        return "#E06D06"; 
                   default: return
                }
           }
            function selectColorSource(name){
                switch (name){
                case 'BeOP':
                        return "#00AFC3"; 
                case 'BA':
                        return "#4BD1E5"; 
                default: return
                }
            }
            var legend = data.map((item)=>{return option.enum ? option.enum[item.content]:item.content})
            var pieOption = {
                legend: {
                    orient: '',
                    icon: 'circle',
                    left: '55%',
                    top: '40%',
                    itemHeight: '6',
                    itemWidth: 6,
                    itemGap: 3,
                    textStyle: {
                        padding: 0,
                        color: '#75839A',
                        fontSize: 12
                    },
                    data: legend
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{b}: {c} ({d}%)",

                },
                color: colorArr,
                title: {
                    text: option.title,
                    left: '15%',
                    top: '20px',
                    textStyle: {
                        color: '#354052',
                        fontWeight: 'normal',
                        fontSize: 14
                    }
                },
                series: series
            };
            
            if (option.type == 'gauge') {
                pieOption.legend.show = false;
                pieOption.title = {
                    text: option.title,
                    x: 'left',
                    textStyle: {
                        color: '#69779f',
                        fontWeight: 'normal',
                        fontSize: 12
                    }
                };
                series[0].center = ['50%', '70%'];
                series[0].radius = ['50px', '50px'];
                series[0].itemStyle.normal.borderWidth = 4;
                series[0].itemStyle.normal.borderColor = new echarts.graphic.LinearGradient(0, 0, 0, 1, [{offset: 0,color: '#688bf0'}, {offset: 1,color: '#57c9ff'}], false);
                if (series[0].data.length > 0) {
                    series[0].data[0].label = {
                        normal: {
                            formatter: '{d}%',
                            position: 'center',
                            show: true,
                            textStyle: {
                                fontSize: '14',
                                fontWeight: 'normal',
                                color: '#333333'
                            }
                        }
                    }
                }
            }
            var chart = echarts.init(container);
            chart.setOption(pieOption)
            // window.onresize = function () {
            //     $('[_echarts_instance_]').each(function (i, dom) {
            //         echarts.getInstanceById(dom.getAttribute('_echarts_instance_')).resize();
            //     });
            // }
        }
        initTable(structuresIdArr, faultsIdArr, time, categoriesArr, searchKey,selectValue,selectSort) {
            var _this=this;
            if(this.faultDetailPanel){
                this.faultDetailPanel.close();
            }
            let faultIds, entityIds, startTime, endTime, keywords;
            var _this = this;
            if (structuresIdArr === undefined && faultsIdArr === undefined && time === undefined){
                faultIds = [];
                entityIds = [];
                startTime = '2017-01-01 00:00:00';
                endTime = '2017-01-05 00:00:00';
                keywords = '';
            } else {
                faultIds = faultsIdArr;
                entityIds = structuresIdArr;
                startTime = time.startTime;
                endTime = time.endTime;
                keywords = searchKey;
            }
            if (sessionStorage.getItem('diagnosisCondition') && sessionStorage.getItem('diagnosisCondition') !== ''){
                var jsonData = JSON.parse(sessionStorage.getItem('diagnosisCondition'));
                if (jsonData.entity){
                    entityIds = [jsonData.entity.id];
                }
                sessionStorage.removeItem("diagnosisCondition");//删除名称为“key”的信息。
            }
          
            var key1=!selectValue?'count':selectValue==1?'taskStatus':selectValue==2?'n.grade':selectValue==3?'f.consequence':selectValue==4?'faultMaintainable':selectValue==5?'time':'count'
            var sort1=!selectSort?'desc':selectSort==1?'asc':'desc'
            let postData = {
                "projectId": AppConfig.projectId,
                "startTime": '',
                "endTime": '',
                "entityIds": entityIds,
                "keywords": keywords,
                "faultIds": faultIds,
                "classNames": categoriesArr,
                "pageNum": 1,
                "pageSize": 50,
                'lan': I18n.type,
                'group':['faultId'],
                'sort': [{"key":key1,"order":sort1}]
            }
            WebAPI.post('/diagnosis_v2/getEntityFaults/group',postData).done(rs=>{
                //是否后果排序开始
                if(!selectSort&&key1!="f.consequence"){
                    rs.data.data.sort((a,b)=>{
                        return b.list[0].consequence<a.list[0].consequence?1:b.list[0].consequence>a.list[0].consequence?-1:0
                    })
                }else if(selectSort&&key1!="f.consequence"){
                    rs.data.data.sort((a,b)=>{
                        return b.list[0].consequence<a.list[0].consequence?1:b.list[0].consequence>a.list[0].consequence?-1:0
                    })
                }else if(selectSort&&key1=="f.consequence"){
                    rs.data.data.sort((a,b)=>{
                        return b.list[0].consequence<a.list[0].consequence?-1:b.list[0].consequence>a.list[0].consequence?1:0
                    })
                }else{
                    rs.data.data.sort((a,b)=>{
                        return b.list[0].consequence<a.list[0].consequence?1:b.list[0].consequence>a.list[0].consequence?-1:0
                    })
                }
                //是否后果排序结束
                if(rs.data.data){
                    var arrs=[[],[],[],[]];
                    rs.data.data[0]? arrs[0].push(rs.data.data[0]):'';
                    var qq=0;
                    for(var q=1;q<=rs.data.data.length-1;q++){
                        if(rs.data.data[q-1].list[0].consequence!=rs.data.data[q].list[0].consequence){
                            qq+=1;
                            arrs[qq].push(rs.data.data[q])
                        }else{
                            arrs[qq].push(rs.data.data[q])
                        }
                    }
                    //是否频次进行排序Begin
                    if(key1=='num'){
                        if(sort1=='asc'){
                            for(var o=0;o<qq+1;o++){
                                arrs[o].sort((a,b)=>{
                                    return a.list.length>b.list.length?1:a.list.length<b.list.length?-1:0
                                })
                            }
                        }else{
                            for(var o=0;o<qq+1;o++){
                                arrs[o].sort((a,b)=>{
                                    return a.list.length>b.list.length?-1:a.list.length<b.list.length?1:0
                                })
                            }
                        }
                    }else{
                        for(var o=0;o<qq+1;o++){
                            arrs[o].sort((a,b)=>{
                                return a.list.length>b.list.length?-1:a.list.length<b.list.length?1:0
                            })
                        }
                    }
                    //如果是频次进行排序End
                    var arrsNews=[];
                    for(var i=0;i<=arrs.length-1;i++){
                        for(var j=0;j<=arrs[i].length-1;j++){
                            if(arrs[i][j].length!=0){
                                arrsNews.push(arrs[i][j]);
                            }
                        }
                    }
                }
                var store = [];
                var storeTime = [];
                rs.data.data=arrsNews
                if (rs.data.data){
                    store = rs.data.data.map((item)=>{
                    var temp =  item.list[0] || {}
                    temp.num = item.list.length;
                    return temp;
                            })
                    storeTime = rs.data.data.map((item)=>{
                    var temp =  item.list || {}
                    temp.num = item.list.length;
                    return temp;
                            })    
                        }
                _this.store.faults = store;
                _this.store.times = storeTime;
                var dom=``;
                if(rs.data.data.length!==0){
                    var sum=Number(rs.data.data[0].list.length);
                    for(var k=0;k<=rs.data.data.length-2;k++){
                        if(rs.data.data[k].list[0].consequence==rs.data.data[k+1].list[0].consequence){
                            sum+=Number(rs.data.data[k+1].list.length)
                        }else{
                            break;
                        }
                    }
                    
                    var html=``
                    var iconArr=['icon-paimingqian-','icon-paimingqian-1'];
                    var optionArr=[
                        {name:I18n.type == 'zh'?'频次':'Frequency',value:0},
                        {name:I18n.type == 'zh'?'处理状态':'Status',value:0},
                        {name:I18n.type == 'zh'?'等级':'Grade',value:0},
                        {name:I18n.type == 'zh'?'后果':'Consequence',value:0},
                        {name:I18n.type == 'zh'?'处理建议':'Serviceability',value:0},
                        {name:I18n.type == 'zh'?'时间':'Time',value:0},
                        ]
                    var j=0;
                    
                    !selectValue?optionArr[0].value=1:optionArr[selectValue].value=1;
                    !selectSort?j=0:j=1;
                    var classIcon=iconArr[j];
                    optionArr.forEach((row,index)=>{
                        if(row.value==1){
                            html+=`<option selected="selected" value="${index}" class="optionTableCard">${row.name}</option>`
                        }else{
                            html+=`<option class="optionTableCard"  value="${index}">${row.name}</option>`
                        }
                    })
                    // var html=`<option class="optionTableCard ">时间</option> <option selected="selected" class="optionTableCard">级别 </option>`
                    dom+=`<div class="cardTr cardTrType"> <span class="cardTrSpan">${diagnosisEnum.faultConsequenceName ? diagnosisEnum.faultConsequenceName[rs.data.data[0].list[0].consequence]:''}</span> <span class="selectCardBox"><span class="iconfontTable iconfont ${classIcon}" data-key="${j}"></span> <select id="selectTableCard">${html}</select></span> <span class="cardNum"></span>  </div>`
                }else{
                     
                }
                var NewNum=0;
                var WIPNum=0;
                var ToDONum=0;
                for(var i=0;i<=rs.data.data.length-1;i++){
                    if(i!==0){
                        if(rs.data.data[i].list[0].consequence!=rs.data.data[i-1].list[0].consequence){
                            var sums=Number(rs.data.data[i].list.length);
                            for(var j=i;j<=rs.data.data.length-2;j++){
                                if(rs.data.data[j].list[0].consequence==rs.data.data[j+1].list[0].consequence){
                                    sums+=Number(rs.data.data[j+1].list.length)
                                }else{
                                    break
                                }
                            }
                            dom+=`<div class="cardTr cardTrColor cardTrType"> <span class="cardTrSpan">${diagnosisEnum.faultConsequenceName ? diagnosisEnum.faultConsequenceName[rs.data.data[i].list[0].consequence]:''}</span> <span class="cardNum"></span> </div>`
                        }
                    }
                    var color=!rs.data.data[i].list[0].taskStatus?'#E06D06;':rs.data.data[i].list[0].taskStatus==1?"#C02712;":rs.data.data[i].list[0].taskStatus==2?"#FFD428;":rs.data.data[i].list[0].taskStatus==10?"#58B2FD;":rs.data.data[i].list[0].taskStatus==3?" #f4b653;":" #E06D06;"
                    !rs.data.data[i].list[0].taskStatus?NewNum+=1:rs.data.data[i].list[0].taskStatus==1?ToDONum+=1:rs.data.data[i].list[0].taskStatus==2?ToDONum+1:rs.data.data[i].list[0].taskStatus==10?"":" "
                    dom+=`<div class="cardTr cardTrColor cardTrRow" data-id="${rs.data.data[i].list[0].id}" data-faultId="${rs.data.data[i].list[0].faultId}" data-entityId="${rs.data.data[i].list[0].entityId}"> <span class="cardLine"><span class="cardLineBox" style="background:${color}"></span></span> <span class="cardTrselect"><span class="cardTrselectBox"></span></span><span class="cardTrSpan" title="${rs.data.data[i].list[0].name}">${rs.data.data[i].list[0].name}</span> <span class="cardNum">${rs.data.data[i].list.length}</span> </div>`
                }
                $('.faultTableLeft').html('<div class="faultTableInner"></div>')
                $('.faultTableInner').html(dom);
                var sum=NewNum+WIPNum+ToDONum;
                var warnTip=AppConfig.language=='zh'?'无故障':'Good';
                var warnTip1=AppConfig.language=='zh'?'故障':'Fault';
                var dom1=``;
                dom1 += `
                <span class="statusTag" data-value="100" style="">
                    <span class="text">${I18n.type == 'zh'?'处理状态:':'Status:'}</span><span class="num" style="color:${sum!=0?'#C02712':'#57B048'};font-size:18px;">${sum==0?warnTip:warnTip1}</span>
                </span>
                <span  class="statusTagLine" style="${sum==0?'display:none;':''}"></span>
                <span class="statusTag" data-value="2" style="${WIPNum==0?'display:none;':''}">
                    <span class="icon iconfont icon-weixiu"></span><span class="text">${diagnosisEnum.taskStatusName?diagnosisEnum.taskStatusName['2']:''}</span><span class="num">${WIPNum}</span>
                </span>
                <span class="statusTag" data-value="0" style="${NewNum==0?'display:none;':''}">
                    <span class="icon iconfont icon-icon-life-alarm"></span><span class="text">${diagnosisEnum.taskStatusName?diagnosisEnum.taskStatusName['null']:''}</span><span class="num">${NewNum}</span>
                </span>
                <span class="statusTag" data-value="1" style="${ToDONum==0?'display:none;':''}">
                    <span class="icon iconfont  icon-tishi"></span><span class="text">${diagnosisEnum.taskStatusName?diagnosisEnum.taskStatusName['1']:''}</span><span class="num">${ToDONum}</span>
                </span>
                `;
                var container = this.container.querySelector('.statusCondition')
                container.innerHTML=dom1
                $('.cardTrRow').off('click.cardTrRow').on('click.cardTrRow',function(){
                    if($(this).hasClass('selectedTr')){
                        $(this).removeClass('selectedTr')
                        $(this).find('.cardTrselectBox').removeClass('iconfont icon-xuanzegou');
                        _this.selectData=[]
                        $('#divAddWork').removeClass('highLight');
                    }else{
                        $(this).addClass('selectedTr')
                        $(this).find('.cardTrselectBox').addClass('iconfont icon-xuanzegou');
                        $(this).siblings().find('.cardTrselectBox').removeClass('iconfont icon-xuanzegou');
                        $(this).siblings().removeClass('selectedTr');
                        var status=$(this).hasClass('selectedTr')
                        var dataId=parseInt($(this).attr('data-id'));
                        var dataFaultid=parseInt($(this).attr('data-faultid'));
                        var dataEntityid=parseInt($(this).attr('data-entityid'));
                        _this.store.timeNow=[];
                        _this.store.faultAll=[];
                        _this.selectData=[{
                            id:dataId,
                            faultId:dataFaultid,
                            entityId:dataEntityid
                        }]
                        $('#divAddWork').addClass('highLight');
                        for(var o=0;o<=_this.store.times.length-1;o++){
                            for(var j=0;j<=_this.store.times[o].length-1;j++){
                                if(_this.store.times[o][j].id==dataId){
                                    _this.store.times[o].forEach(items=>{
                                        _this.store.timeNow.push(items.time)
                                        _this.store.faultAll.push(items)
                                    })
                                    break;
                                }
                            }
                        }
                        if(_this.store.timeNow.length>20){
                            _this.store.timeNow=_this.store.timeNow.slice(0,20);
                        }
                        _this.$diagnosisFaultDetailPanel.show();
                        if (!_this.faultDetailPanel) {
                            _this.faultDetailPanel = new FaultDetailPanel(_this.$diagnosisFaultDetailPanel[0], _this);
                        }
                        _this.faultDetailPanel.show(selectData(status,dataId));
                    }
                    
                })
                $('.faultTableInner').find('.cardTrRow').eq(0).trigger('click');
                function selectData(selectStatus,trId) {
                    // 获取当前选中的行
                    let selectedIds = [];
                    let $selectedRadio = _this.$faultTable.find('.selectedTr').each(function (i, dom) {
                        selectedIds.push(parseInt(dom.dataset.id));
                    });
                    if (selectedIds.length === 0) {
                        $('#divAddWork').removeClass('highLight');
                        return _this.faultDetailPanel && _this.faultDetailPanel.close();
                    }
                    let selectData = _this.store.faults.filter(function (row) {
                        return selectedIds.indexOf(row.id) > -1;
                    })
                    if (selectStatus) {
                        let index = selectData.findIndex(v => v.id == trId);
                        if (selectData.length > 1) {
                            let indexData = selectData.splice(index, 1)[0];
                            selectData.unshift(indexData);
                        }
                    }
                    _this.selectData = selectData;
                    if (selectData.length !== 0){
                        $('#divAddWork').addClass('highLight');
                    }
                    return selectData;
                }
            })

            
            // var opt = {
            //     dataFilter: function (result) {
            //         var store = [];
            //         if (result.data.data){
            //             store = result.data.data.map((item)=>{
            //                 var temp =  item.list[0] || {}
            //                 temp.num = item.list.length;
            //                 return temp;
            //             })
            //         }
            //         this.store.faults = store;
            //         return store;
            //     }.bind(this),
            //     url: '/diagnosis_v2/getEntityFaults/group',
            //     tableClass: 'table-striped',
            //     postData: postData,
            //     headerAdjustFix: true,
            //     theadCol: [
            //         {name: I18n.resource.history.CHOOSE,width:"6.5%"},
            //         {name: I18n.resource.history.OCCUE_TIME,sort: true},
            //         {name: I18n.resource.history.FAULT_GRADE,width:"8.5%",sort: true},
            //         {name: I18n.resource.history.FAULT_NAME,width:"30%"},
            //         {name: I18n.resource.history.CONSEQUENCE,sort: true},
            //         // {name: I18n.resource.history.AREA},
            //         // {name: I18n.resource.history.EQUIPMENT},
            //         { name: I18n.resource.history.STATUS},
            //         // { name: I18n.resource.history.TASK_STATUS, width: '10%'},
            //         {name: I18n.resource.history.MAINTAINABLE},
            //     ],
            //     trSet:{
            //         data:{
            //             id: "id"
            //         }                    
            //     },
            //     tbodyCol:[
            //         {index: 'choose',html:'<div class="isSelected"></div>'},
            //         {index: 'time',title:true},
            //         {index: 'grade', converter: function (value) {
            //             return ('<a data-grade="'+value["grade"]+'" style="color:'+ (value["grade"] === 2?'#ea595c':(value['grade'] === 0? '#00bae8':'#facc04')) +'";>'+ diagnosisEnum.faultGradeName[value["grade"]] + '</a>')
            //         }},
            //         {index: 'name',title:true,converter: function (value) { return `${value['name']}${value['faultTag']==1?'<span class="label label-info">BA</span>':''}<span class="num">${value['num']}</span>` }},
            //         {index: 'consequence', converter: function(value){return diagnosisEnum.faultConsequenceName[value["consequence"]]}},
            //         // {index: 'entityParentName',title:true},
            //         // { index: 'entityName', title: true },
            //         { index: 'status', converter: function (value) { return ('<span data-status="' + value["status"] + '" class="status">' + diagnosisEnum.faultStatusName[value["status"]] + '</span>') }},
            //         // { index: 'taskStatus', converter: function (value) {
            //         //     return ('<span data-taskstatus="'+(value["taskStatus"] ? value["taskStatus"]:'')+'" class="taskStatus">' + (value["taskStatus"] ? diagnosisEnum.taskStatusName[value["taskStatus"]]:'-') + '</span>')
            //         // }},
            //         {index: 'maintainable',converter: function(value){return ('<span data-maintainable="'+value["maintainable"]+'" class="maintainable">'+diagnosisEnum.faultMaintainableName[value["maintainable"]]+'</span>')},title:true}
            //     ],
            //     onBeforeRender: function () {
            //         Spinner.spin($("#diagnosisV2PageContainer")[0]);
            //     },
            //     onAfterRender: function () {
            //         Spinner.stop();
            //     },
            //     more:true,
            //     paging:{
            //         enable: true,
            //         config:{
            //             pageSizes: [25, 50, 100, 200],
            //             // pageNum: 5,
            //             totalNum: function (result) {                            
            //                 return result.data.total;
            //             },
            //             tbodyHeight: "84vh"//分页 74vh 不分页84vh
            //         },
            //         pagingKey:{
            //             pageSize: 'pageSize',//每页的数目
            //             pageNum: 'pageNum',//当前页数
            //         }
            //     },
            //     sort:{
            //         sortKey:'sort',
            //         sortData:function(value,order){
            //             if(value === "grade" || value === "status"){
            //                 value = 'n.'+ value;
            //             }else if(value === "consequence"){
            //                 value = 'f.'+ value;
            //             }
            //             return [{
            //                 'key':value,
            //                 'order':order
            //             }]
            //         }
            //     }
            // }
            // this.PagingTable = new PagingTable($('.faultTable',this.container),opt);
            // this.PagingTable.setting.sort = {
            //     'key':'time',
            //     'order':'desc'
            // }
            // var asyn = this.PagingTable.show();
            // asyn.done(() => {
            //     if (AppConfig.fromPriorityFault){
            //         $(_this.container).find('.historyTable tbody tr').eq(0).trigger('click');
            //         AppConfig.fromPriorityFault = false;
            //     }
            // })
        }
        getElecPrice(structuresIdArr, faultsIdArr, time, categoriesArr, searchKey) {
            var _this = this;
            var promise = $.Deferred();
            promise = WebAPI.post('/iot/search', { "parent": [], "projId": [AppConfig.projectId] }).done(function(result) { //AppConfig.projectId
                _this._id = result.projects[0]._id;
            });
            promise.then(function() {
                WebAPI.get('/benchmark/config/get/' + _this._id).done(function(result) {
                    // 计算平均电价
                    _this.powerPrice = 0;
                    if (!result || !result.cost || result.cost.length === 0) {
                        alert('Please config electricity price first!');
                        return;
                    }
                    for (var i = 0, l = result.cost.length, cost, weight; i < l; i++) {
                        cost = Number(result.cost[i].cost);
                        weight = result.cost[i].weight ? Number(result.cost[i].weight) : 1;
                        if (!isNaN(cost) && !isNaN(weight)) {
                            _this.powerPrice += (cost * weight);
                        }
                    }
                    _this.powerPrice = Number((_this.powerPrice/result.cost.length).toFixed(2));
                    // _this.initTable(structuresIdArr, faultsIdArr, time, categoriesArr, searchKey);
                });
            });
        }
        attachEvents() {
            var _this = this;
            let $thisContainer = $(_this.container).find('.caseRecordTable');
            //点击单行
            $thisContainer.off('change').on('change', '#selectTableCard', function () {
                var selectVal=$(this).val();
                var selectSort=Number($(this).parent().find('.iconfontTable').attr('data-key'));
                _this.initTable(_this.bigDataArr.entitiesIdArr, _this.bigDataArr.faultsIdArr, _this.bigDataArr.time, _this.bigDataArr.categoriesArr, _this.bigDataArr.searchKey,selectVal,selectSort);
            });
            $thisContainer.off('click').on('click', '.iconfontTable', function () {
                var selectSort=Number($(this).attr("data-key"));
                !selectSort?selectSort=1:selectSort=0;
                var selectVal=$(this).parent().find('#selectTableCard').val();
                _this.initTable(_this.bigDataArr.entitiesIdArr, _this.bigDataArr.faultsIdArr, _this.bigDataArr.time, _this.bigDataArr.categoriesArr, _this.bigDataArr.searchKey,selectVal,selectSort);
                
            })
            $(window).off('resize').on('resize', function () {
                //echarts重绘
                $('[_echarts_instance_]').each(function (i, dom) {
                    var img = echarts.getInstanceById(dom.getAttribute('_echarts_instance_')).resize()
                });

            })
            
            $thisContainer.off('click.tr').on('click.tr', 'tbody tr', function (e) {
                // $('.tableCtn').css({ height: 'calc(100% - 360px)' });
                $('.tableCtn').css({ height: '50%' });
                _this.$diagnosisFaultDetailPanel.show();
                if (e.ctrlKey){
                    if ($(this).hasClass('selected')){
                        $(this).removeClass('selected');
                        $(this).removeClass('selectedHover');
                    } else {
                        $(this).addClass('selected');
                        //跳到选中的视野
                        $(this)[0].scrollIntoView(false);
                    }
                } else {
                    if ($(this).hasClass('selected')) { 
                        $(this).removeClass('selected');
                        $(this).removeClass('selectedHover');
                    } else {
                        $('tbody tr').removeClass('selected');
                        $('tbody tr').removeClass('selectedHover');
                        $(this).addClass('selected');
                        $(this)[0].scrollIntoView(false);
                    }
                }
                let status = $(this).hasClass('selected');
                let dataId = parseInt($(this).attr('data-id'));
                if (!_this.faultDetailPanel) {
                    _this.faultDetailPanel = new FaultDetailPanel(_this.$diagnosisFaultDetailPanel[0],_this);
                }
                _this.faultDetailPanel.show(selectData(status,dataId));
            });
            function selectData(selectStatus,trId) {
                // 获取当前选中的行
                let selectedIds = [];
                let $selectedRadio = _this.$faultTable.find('.selected').each(function (i, dom) {
                    selectedIds.push(parseInt(dom.dataset.id));
                });
                if (selectedIds.length === 0) {
                    $('#divAddWork').removeClass('highLight');
                    return _this.faultDetailPanel && _this.faultDetailPanel.close();
                }
                let selectData = _this.store.faults.filter(function (row) {
                    return selectedIds.indexOf(row.id) > -1;
                })
                if (selectStatus) {
                    let index = selectData.findIndex(v => v.id == trId);
                    if (selectData.length > 1) {
                        let indexData = selectData.splice(index, 1)[0];
                        selectData.unshift(indexData);
                    }
                }
                _this.selectData = selectData;
                if (selectData.length !== 0){
                    $('#divAddWork').addClass('highLight');
                }
                return selectData;
            }
            //点击单行前面的 图标
            $thisContainer.off('click.isSelected').on('click.isSelected', 'tbody tr .isSelected', function (e) {
                let $parent = $(this).closest('tr');
                 $('.tableCtn').css({ height: 'calc(100% - 280px)' });
                _this.$diagnosisFaultDetailPanel.show();
                if ($parent.hasClass('selected')){
                    $parent.removeClass('selected');
                    $parent.removeClass('selectedHover');
                } else {
                    $parent.addClass('selected');
                    //跳到选中的视野
                    $parent[0].scrollIntoView(false);
                }
                e.stopPropagation();
                let status = $parent.hasClass('selected');
                let dataId = parseInt($parent.attr('data-id'));
                if (!_this.faultDetailPanel) {
                    _this.faultDetailPanel = new FaultDetailPanel(_this.$diagnosisFaultDetailPanel[0],_this);
                }
                _this.faultDetailPanel.show(selectData(status,dataId));
            });
            $thisContainer.off('mouseover.tr').on('mouseover.tr', 'tbody tr.selected', function () {
                $(this).addClass('selectedHover');
            });
            $thisContainer.off('mouseout.tr').on('mouseout.tr', 'tbody tr.selected', function () {
                $(this).removeClass('selectedHover');
            });
            //移除条件
            $thisContainer.off('click.remove').on('click.remove', '.singleCondition .glyphicon-remove', function () {
                let $parent = $(this).closest('.singleCondition');
                let name = $parent.find('span.name').text();
                $parent.remove();
                let type = $parent.attr('data-type');
                let id = Number($parent.attr('data-id'));
                let newArr = [];
                _this.conditionModel[type]().filter((v, index) => {
                    let hasId = '';
                    if(type === 'activeCategories'){
                        if (v.name !== name){
                            newArr.push(v);
                        }
                    } else {
                        if (type === 'activeEntities') {
                            hasId = v.id;
                        } else if (type === 'activeFaults') {
                            hasId = v.faultId;
                        }
                        if (hasId !== id){
                            newArr.push(v);
                        }
                    }
                })
                _this.conditionModel[type](newArr);
            });
            //搜索
            $thisContainer.off('click.input').on('click.input', '.searchBox span', function () {
                let searchKey = $(this).prev('input').val();
                _this.conditionModel['searchKey'](searchKey);
            });
            $thisContainer.off('keyup.input').on('keyup.input', '.searchBox input', function (e) {
                if (e.keyCode === 13) {
                    let searchKey = $(this).val();
                    _this.conditionModel['searchKey'](searchKey);
                }
            });
            //添加任务
            $('#divAddWork').off('click').on('click', () => {
                if (_this.selectData.length === 0) {
                    return;
                }
                if(confirm(i18n_resource.history.SURE_TO_ADD)){
                let isHaveOpen = _this.selectData.find((item) => { return  item.taskStatus === 10; })//是否有已经处理成功的
                if (!isHaveOpen){
                    let postData = _this.selectData.map((row) => {
                        if (row.taskStatus !== 10){
                            let singleJson = {
                                noticeId: row.id,
                                faultId: row.faultId,
                                entityId: row.entityId
                            };
                            return singleJson;
                        }
                    });
                    
                    WebAPI.post('/diagnosis_v2/addTasks/' + AppConfig.projectId, {
                        lang: I18n.type,
                        data: postData,
                        operatorId: AppConfig.userId
                    }).done((rs) => {
                        if (rs.data && rs.data.duplicated_id.length !== 0) {
                            let noticeId = rs.data.duplicated_id.join(",");
                            if (rs.msg === "add success") {
                                alert(i18n_resource.history.SUCCESS+'('+i18n_resource.history.REPEAT+' notice Id '+ noticeId+')');
                                _this.page.show();
                            }else if (rs.msg.indexOf("duplicated") !== -1) {
                                alert(i18n_resource.history.FAIL + ',' + i18n_resource.history.REPEAT+' notice Id '+ noticeId);
                            }
                        } else {
                            if (rs.msg === "add success") {
                                alert(i18n_resource.history.SUCCESS);
                                _this.page.show();
                            } else if (rs.msg === "add error"){
                                alert(i18n_resource.history.FAIL);
                            } else if (rs.msg.indexOf("duplicated") !== -1) {
                                let noticeId = rs.data.duplicated_id.join(",");
                                alert(i18n_resource.history.FAIL + ',' + i18n_resource.history.REPEAT+' notice Id '+ noticeId);
                            }
                        }
                    });
                } else {
                    alert(i18n_resource.history.ALREADY_TASK);
                }}
            });
        }
        getSelectedRows() {
            let selectedIds = [];
            let $selectedRadio = this.$faultTable.find('.selected').each(function (i, dom) {
                selectedIds.push(parseInt(dom.dataset.id));
            });
            if (selectedIds.length === 0) {
                return [];
            }
            var selectedItems = this.store.faults.filter(function (row) {
                return selectedIds.indexOf(row.id) > -1;
            });
            var ids = [];
            selectedItems.forEach(function(row){
                if(ids.indexOf(row.id) < 0){
                    ids.push(row.id)
                }
            })
            var data = {
                "projectId": AppConfig.projectId,
                "ids": ids
            }
            return data;
        }
        close() {
            $('#fault').find('.itemList').css({"pointer-events":"all"})
            if (this.faultDetailPanel) {
                this.faultDetailPanel.close();
                this.faultDetailPanel = null;
            }
            this.unbindOb();
        }
        //重写
        capture() {
            let promise = $.Deferred();
            let infos = [];
            this.captureDoms.forEach((dom,index)=>{
                let tds = dom.querySelectorAll('td');
                let time = tds[1].querySelector('span').innerHTML,
                    grade = tds[2].querySelector('a').dataset.grade,
                    name = tds[3].querySelector('span').innerHTML,
                    consequence = tds[4].querySelector('span').innerHTML,
                    area = tds[5].querySelector('span').innerHTML,
                    entity = tds[6].querySelector('span').innerHTML,
                    status = tds[7].querySelector('span.status').dataset.status;
                let info = {
                    time,
                    grade,
                    name,
                    consequence,
                    area,
                    entity,
                    status
                };
                infos.push(info);
            });
            promise.resolve(infos);
            return promise;
        }
        //重写
        _attachEvents() {
            this.captureType = 'history';
            let _this = this;
            let $captureDom = $(this._captureDom);
            let $thisContainer = $captureDom.find('.historyTable');
            let selectFn = function(e){
                window.CAPTURE_INSTANCES.forEach(ins=>{
                    ins.captureDoms = [];
                });
                window.CAPTURE_INSTANCES = [];
                let $selectedRadio = _this.$faultTable.find('.selected').each((i, dom)=>{
                    _this.captureDoms.push(dom);
                });
                if(_this.captureDoms.length){
                    window.CAPTURE_INSTANCES = [_this];
                }
                if(window.CAPTURE_INSTANCES.length>0){
                    $('.feedBackModalBtn').addClass('highLight');
                }else{
                    $('.feedBackModalBtn').removeClass('highLight');
                }
            }
            //点击单行
            $thisContainer.off('click.captureDom').on('click.captureDom', 'tbody tr', selectFn);
            //点击单行前面的 图标
            $thisContainer.off('click.captureDom2').on('click.captureDom2', 'tbody tr .isSelected', selectFn);
        }
        //重写
        _detachEvents() {
            let $captureDom = $(this._captureDom);
            let $thisContainer = $captureDom.find('.historyTable');
            //点击单行
            $thisContainer.off('click.captureDom');
            //点击单行前面的 图标
            $thisContainer.off('click.captureDom2');
        }
    }
    exports.FaultTable = FaultTable;
} (
    namespace('diagnosis.CaseRecord'),
    namespace('diagnosis.CaseRecord.FaultDetailPanel'),
    namespace('diagnosis.enum'),
    namespace('PagingTable'),
    namespace('diagnosis.mixins.Capture')
));