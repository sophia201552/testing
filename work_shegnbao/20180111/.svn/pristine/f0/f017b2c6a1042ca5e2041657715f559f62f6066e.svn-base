// faultTable.js 2017/05/27 carol
;(function (exports, FaultDetailPanel, diagnosisEnum, Capture) {
    class FaultTable extends Capture() {
        constructor(container, conditionModel, diagnosis) {
            super();
            this.container = this.pageContainer = document.querySelector('#diagnosisV2PageContainer');
            this.conditionModel = conditionModel;
            this.echartsPool = [];
            this.store = {};
            this.diagnosis = diagnosis;
        }
        show() {
            let $thisContainer = $(this.container);
            $thisContainer.html(
                `<div class="tableCtn spectrumTable">
                    <div class="conditionSearchCtn">
                        <div class="conditionCtn"></div>
                        <div class="searchBox">
                            <input class="form-control" type="text" placeholder="search">
                            <span class="iconfont icon-sousuo_sousuo"></span>
                        </div>
                    </div>
                    <div class="faultTable"></div>
                </div>
                <div id="diagnosisFaultDetailPanel"></div>`
            );
            this.$conditionCtn = $thisContainer.find('.conditionCtn');
            this.$faultTable = $thisContainer.find('.faultTable');
            this.$diagnosisFaultDetailPanel = $thisContainer.find('#diagnosisFaultDetailPanel');
            this.initCondition(this.conditionModel.serialize());
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
            let forbiddenArr  = ['update.time'];
            let forbiddenArr2  = ['update.activeEntities'];
            if(forbiddenArr.indexOf(propName)>-1){
                return;
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
            let conditionArr = this.conditionModel._values;
            this.initCondition(conditionArr);
            if(forbiddenArr2.indexOf(propName)>-1){
                return;
            }
            let time = this.conditionModel.time();
            this.getElecPrice(entitiesIdArr, faultsIdArr, time, categoriesArr, this.conditionModel.searchKey());
            this.getTimeArr(time);
        }
        initCondition(conditionArr) {
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
                        dom += `<div class="singleCondition" data-type="${key}" data-id="${id}">
                                    <span class="name">${conditionArr[key][i].name}</span>
                                    <span class="glyphicon glyphicon-remove"></span>
                                </div>`;
                    }
                }
            }
            this.$conditionCtn.html(dom);
        }
        initTable(structuresIdArr, faultsIdArr, time, categoriesArr, searchKey) {
            if(this.faultDetailPanel){
                this.faultDetailPanel.close();
            }
            let faultIds, entityIds, startTime, endTime, keywords;
            var _this = this;
            _this.$faultTable.find('tbody').html('');
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
            var entityNames = [];
            if (sessionStorage.getItem('diagnosisCondition') && sessionStorage.getItem('diagnosisCondition') !== ''){
                var jsonData = JSON.parse(sessionStorage.getItem('diagnosisCondition'));
                var realData = jsonData.entityNames.split(',');
                for (var i = 0, length = realData.length; i < length; i++){
                    var entityName = realData[i];
                    if (realData[i].indexOf(' / ') !== -1 ){
                        entityName = entityName.split(' / ')[1];
                    }
                    entityNames.push(entityName);
                }
                sessionStorage.removeItem("diagnosisCondition");//删除名称为“key”的信息。
            }
            let postData = {
                "projectId": AppConfig.projectId,
                "startTime": startTime,
                "endTime": endTime,
                "entityIds": entityIds,
                "keywords": keywords,
                "faultIds": faultIds,
                "classNames": categoriesArr,
                "entityNames": entityNames,
                "lang": I18n.type
            }
            var opt = {
                dataFilter: function (result) {
                    this.store.faults = result.data.data;
                    // this.echartsData = [];
                    // for (let i = 0, ilen = this.store.faults.length; i < ilen; i++) { 
                    //     let arrNoticeData = this.store.faults[i].arrNoticeTime;
                    //     //处理echarts的数据
                    //     this.echartsData.push(this.getEchartsData(arrNoticeData));
                    // }
                    return result.data.data;
                }.bind(this),
                url: '/diagnosis_v2/getGroupByEquipment',
                tableClass: 'table-striped',
                postData: postData,
                headerAdjustFix: true,
                theadCol: [
                    {name: I18n.resource.history.CHOOSE, width: "6.5%" },
                    {name: I18n.resource.spectrum.EQUIPMENT},
                    {name: I18n.resource.spectrum.AREA},
                    {name: I18n.resource.spectrum.ENERGY_COST,sort: true},
                    {name: I18n.resource.spectrum.COST_SAVING,sort: true},
                    {name: I18n.resource.spectrum.FREQUENCY,width:"50%"}
                ],
                trSet:{
                    data:{
                        entityid: "id",
                        faultid: function(value){
                            let arrNoticeData = value.arrNoticeTime;
                            let faultIds = [];
                            let faultIdStr = '';
                            for (let j = 0, jlen = arrNoticeData.length; j < jlen; j++) {
                                let faultId = arrNoticeData[j].faultId;
                                if (faultIds.indexOf(faultId) === -1) {
                                    faultIds.push(faultId);
                                    faultIdStr += faultId + ',';
                                }
                            }
                            faultIdStr = faultIdStr.substr(0, faultIdStr.length - 1);
                            return faultIdStr;
                        }
                    }                    
                },
                tbodyCol:[
                    { index: 'choose', html: '<div class="isSelected"></div>' },
                    {index: 'name',title:true},
                    {index: 'parentName',title:true},
                    {index: 'energy', converter: function (value) {return _this.getAllEnergy(value);}},
                    {index: 'elecPrice', converter: function(value){return _this.getAllSaving(value);}},
                    {index: 'consequenceChart',html:'<div class="echartscCtn" style="width: 100%;height: 40px;"></div>',className:"consequenceChart"}
                ],
                onBeforeRender: function () {
                    Spinner.spin($("#diagnosisV2PageContainer")[0]);
                },
                onAdjustTable: function(value){
                    this.echartsData = [];
                    for (let i = 0, ilen = value.length; i < ilen; i++) { 
                        let arrNoticeData = value[i].arrNoticeTime;
                        //处理echarts的数据
                        this.echartsData.push(this.getEchartsData(arrNoticeData));
                    }
                    this.echartsInit(document.querySelectorAll('.echartscCtn'),this.echartsData);
                }.bind(this),
                onAfterRender: function () {
                    Spinner.stop();
                },
                more:true,
                paging:{
                    enable: true,
                    config:{
                        pageSizes: [25, 50, 100, 200],
                        totalNum: function (result) {                            
                            return result.data.total;
                        },
                        tbodyHeight: "84vh"//分页 74vh 不分页84vh
                    },
                    pagingKey:{
                        pageSize: 'pageSize',//每页的数目
                        pageNum: 'pageNum',//当前页数
                    }
                },
                sort:{
                    sortKey:'sort',
                    sortData:function(value,order){                       
                        value = 'n.energy';                                               
                        return [{
                            'key':value,
                            'order':order
                        }]
                    }
                },
                sortRule:{
                    'energy':{
                        'asc':function(value){
                            value.sort(function(a,b){
                                return parseFloat(_this.getAllEnergy(a)) - parseFloat(_this.getAllEnergy(b));                            
                            })
                            return value;
                        },
                        'desc':function(value){
                            value.sort(function(a,b){
                                return parseFloat(_this.getAllEnergy(b)) - parseFloat(_this.getAllEnergy(a));                            
                            })
                            return value;
                        }
                    },                        
                    'elecPrice':{
                        'asc':function(value){
                            value.sort(function(a,b){
                                return parseFloat(_this.getAllSaving(a)) - parseFloat(_this.getAllSaving(b));                            
                            })
                            return value;
                        },
                        'desc':function(value){
                            value.sort(function(a,b){
                                return parseFloat(_this.getAllSaving(b)) - parseFloat(_this.getAllSaving(a));                            
                            })
                            return value;
                        }
                    }
                }
            }
            this.PagingTable = new PagingTable($('.faultTable',this.container),opt);
            this.PagingTable.show();
        }
        getAllEnergy(data){
            let allEnergy = 0;
            let arrNoticeData = data.arrNoticeTime;
            for (let j = 0, jlen = arrNoticeData.length; j < jlen; j++) {
                let energy = arrNoticeData[j].energy;
                let endTime = arrNoticeData[j].endTime ? +moment(arrNoticeData[j].endTime).format('x') : +moment().format('x');
                let startTime = +moment(arrNoticeData[j].time).format('x');
                let duration = Number((endTime - startTime) / 1000 / 60 / 60).toFixed(2);
                let finalEnergy = energy * duration;
                allEnergy += finalEnergy;
            }
            return allEnergy.toFixed(2);
        }
        getAllSaving(data){
            let allSaving = 0;
            let arrNoticeData = data.arrNoticeTime;
            for (let j = 0, jlen = arrNoticeData.length; j < jlen; j++) {
                let currentPowerPrice = arrNoticeData[j].elecPrice ? arrNoticeData[j].elecPrice : this.powerPrice;
                let energy = arrNoticeData[j].energy;
                let endTime = arrNoticeData[j].endTime ? +moment(arrNoticeData[j].endTime).format('x') : +moment().format('x');
                let startTime = +moment(arrNoticeData[j].time).format('x');
                let duration = Number((endTime - startTime) / 1000 / 60 / 60).toFixed(2);
                let finalEnergy = energy * duration;
                let saving = finalEnergy * currentPowerPrice;
                allSaving += saving;
            }
            return allSaving.toFixed(2);
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
                    _this.initTable(structuresIdArr, faultsIdArr, time, categoriesArr, searchKey);
                });
            });
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
        echartsInit(doms, datas) {
            doms = doms || document.querySelectorAll('.echartscCtn');
            datas = datas || this.echartsData;
            this.echartsClose();
            Array.from(doms).forEach((dom, index)=>{
                this.echartsPool.push(this.renderEcharts(dom, datas[index]));
            });            
        }
        echartsClose() {
            this.echartsPool.forEach(e=>{
                e.clear();
                e.dispose();
            });
            this.echartsPool = [];
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
        attachEvents() {
            var _this = this;
            let $thisContainer = $(_this.container).find('.spectrumTable');
            //点击单行
            $thisContainer.off('click.tr').on('click.tr', 'tbody tr', function (e) {
                $('.tableCtn').css({ height: 'calc(100% - 280px)' });
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
                var $tooltipBox = $(this).find('.echartscCtn>div').eq(1);
                var searchTime;
                if ($tooltipBox.css('display') === 'block'){
                    searchTime = $(this).find('.echartscCtn>div').eq(1).html().substr(0, 19);
                }
                if (!_this.faultDetailPanel) {
                    _this.faultDetailPanel = new FaultDetailPanel(_this.$diagnosisFaultDetailPanel[0],_this);
                }
                _this.faultDetailPanel.show(selectData($(this)), searchTime);
            });
            function selectData($thisTr) {
                let selectedIds = [];
                let data = [];
                if ($(this).hasClass('selected')){
                    let thisFaultId = $thisTr.attr("data-faultid").split(",");
                    let thisEntityId = $thisTr.attr("data-entityid");
                    thisFaultId.forEach(function(row){
                        var item = {
                            faultId: parseInt(row),
                            entityId: parseInt(thisEntityId)
                        }
                        data.push(item);
                    })
                }
                
                let $selectedRadio = _this.$faultTable.find('.selected').each(function (i, dom) {
                    selectedIds.push(parseInt(dom.dataset.id));
                    if (!data.find(v=>v.entityId == $(dom).attr("data-entityid"))){
                        var entityId = $(dom).attr("data-entityid");
                        var faultId = $(dom).attr("data-faultid").split(",");
                        faultId.forEach(function(row){
                            var item = {
                                faultId: parseInt(row),
                                entityId: parseInt(entityId)
                            }
                            data.push(item);
                        })
                    }
                });
                if (selectedIds.length === 0) {
                    return _this.faultDetailPanel && _this.faultDetailPanel.close();
                }
                return data;
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
                if (!_this.faultDetailPanel) {
                    _this.faultDetailPanel = new FaultDetailPanel(_this.$diagnosisFaultDetailPanel[0],_this);
                }
                _this.faultDetailPanel.show(selectData($parent));
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
                let entityIdArr = [];
                _this.conditionModel.activeAllEntities().forEach(v => {
                    entityIdArr.push(v.id);
                });
                entityIdArr.length>0?_this.diagnosis.nav.fault.getData(entityIdArr):_this.diagnosis.nav.fault.getData();
            });
            //搜索
            $thisContainer.off('click.input').on('click.input', '.searchBox span', function () {
                let searchKey = $(this).prev('input').val();
                _this.conditionModel['searchKey'](searchKey);
            });
            $thisContainer.off('keyup.input').on('keyup.input', '.searchBox input', function (e) {
                if (e.keyCode === 13 || $(this).val()==='') {
                    let searchKey = $(this).val();
                    _this.conditionModel['searchKey'](searchKey);
                }
            });
            $thisContainer.off("mouseleave",".consequenceChart").on("mouseleave",".consequenceChart",function(e){
                // tooltip消失
                var $currentDom = $(e.currentTarget);
                var $curChart = echarts.getInstanceByDom($currentDom.find(".echartscCtn")[0]);
                $curChart.dispatchAction({
                    type: 'hideTip'
                })
            });
            $thisContainer.off("mouseenter",".consequenceChart").on("mouseenter",".consequenceChart",function(params){
                //todo
            })
        }
        getSelectedRows() {
            let selectedIds = [];
            let $selectedRadio = this.$faultTable.find('.selected').each(function (i, dom) {
                selectedIds.push(parseInt(dom.dataset.entityid));
            });
            if (selectedIds.length === 0) {
                return [];
            }
            var selectedItems = this.store.faults.filter(function (row) {
                return selectedIds.indexOf(row.id) > -1;
            });
            var ids = [];
            selectedItems.forEach(function(row){
                row.arrNoticeTime.forEach(function(fault){
                    if(ids.indexOf(fault.id) < 0){
                        ids.push(fault.id)
                    }
                })                
            })
            var data = {
                "projectId": AppConfig.projectId,
                "ids": ids
            }
            return data;
        }
        close() {
            if (this.faultDetailPanel) {
                this.faultDetailPanel.close();
                this.faultDetailPanel = null;
            }
            this.echartsClose();
            this.unbindOb();
        }
        //重写
        capture() {
            let promise = $.Deferred();
            let infos = [];
            this.captureDoms.forEach((dom, index) => {
                let entityId = Number(dom.dataset['entityid']);
                let trInfo = this.store.faults.find(row => row.id === entityId);
                let tds = dom.querySelectorAll('td');
                let name = tds[1].querySelector('span').innerHTML,
                    costEnergy = tds[2].querySelector('span').innerHTML,
                    costSaving = tds[3].querySelector('span').innerHTML;
                let info = {
                    name,
                    costEnergy,
                    costSaving,
                    trInfo
                };
                infos.push(info);
            });
            promise.resolve(infos);
            return promise;
        }
        //重写
        _attachEvents() {
            this.captureType = 'spectrum';
            let _this = this;
            let $thisContainer = $(_this.container).find('.spectrumTable');
            let selectFn = function(e){
                window.CAPTURE_INSTANCES.forEach(ins=>{
                    ins.captureDoms = [];
                });
                window.CAPTURE_INSTANCES = [];
                _this.$faultTable.find('.selected').each((i, dom)=>{
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
            let $thisContainer = $(_this.container).find('.spectrumTable');
            //点击单行
            $thisContainer.off('click.captureDom');
            //点击单行前面的 图标
            $thisContainer.off('click.captureDom2');
        }
    }
    exports.FaultTable = FaultTable;
} ( 
    namespace('diagnosis.Spectrum'),
    namespace('diagnosis.components.FaultDetailPanel'),
    namespace('diagnosis.enum'),
    namespace('diagnosis.mixins.Capture')
));