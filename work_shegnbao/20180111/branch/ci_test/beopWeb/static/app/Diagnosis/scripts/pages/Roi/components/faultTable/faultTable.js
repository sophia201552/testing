// roi faultTable.js 2017/06/21 carol
;(function (exports, FaultDetailPanel, diagnosisEnum) {
    class FaultTable {
        constructor(container, conditionModel) {
            this.container = container;
            this.conditionModel = conditionModel;
            this.store = {};
            this.powerPriceModify = [];
        }
        show() {
            let $thisContainer = $(this.container);
            $thisContainer.html(`<div class="tableCtn roiTable">
                                    <div class="conditionSearchCtn">
                                        <div class="conditionCtn clearfix"></div>
                                        <div class="roiToolBox">
                                            <div class="buttonBox">
                                                <span class="iconfont icon-baocun saveRoiBtnCtn"></span>
                                            </div>
                                            <div class="searchBox">
                                                <input class="form-control" type="text" placeholder="search" style="display: none;">
                                                <span class="iconfont icon-sousuo_sousuo"></span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="faultTable">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>${I18n.resource.roi.TIME}</th> 
                                                    <th>${I18n.resource.roi.GROUP}</th> 
                                                    <th>${I18n.resource.roi.FAULT}</th> 
                                                    <th>${I18n.resource.roi.EQUIPMENT}</th>
                                                    <th>
                                                        <span>${I18n.resource.roi.ROI}</span>
                                                    </th>
                                                    <th>
                                                        <span>${I18n.resource.roi.PER_YEAR}</span>
                                                        <select id="selCycle">
                                                            <option value="day">${I18n.resource.roi.DAY}</option>
                                                            <option value="week">${I18n.resource.roi.WEEK}</option>
                                                            <option value="month">${I18n.resource.roi.MONTH}</option>
                                                            <option value="year" selected>${I18n.resource.roi.YEAR}</option>
                                                        </select>
                                                        (<span class="unit"></span>)
                                                    </th>
                                                    <th>${I18n.resource.roi.POWER_PRICE}</th> 
                                                    <th>${I18n.resource.roi.SAVE_MONEY}</th>
                                                    <th>${I18n.resource.roi.HR_PRICE}</th> 
                                                    <th>${I18n.resource.roi.HR}</th> 
                                                    <th>${I18n.resource.roi.LABORCOST}</th>
                                                </tr>
                                            </thead>
                                            <tbody></tbody>
                                        </table>
                                    </div>
                                </div>
                                <div id="diagnosisFaultDetailPanel"></div>`);
            // <span class="glyphicon glyphicon-sort sortBtn"></span>
            
            // <span class="iconfont icon-weibiaoti--16"></span>
            // <span class="iconfont icon-xiazai2"></span> 
            this.$conditionCtn = $thisContainer.find('.conditionCtn');
            this.$faultTable = $thisContainer.find('.faultTable');
            this.$diagnosisFaultDetailPanel = $thisContainer.find('#diagnosisFaultDetailPanel');

            this.initCondition(this.conditionModel.serialize());
            this.attachEvents();
            this.unbindOb();
            this.bindOb();
            this.update();
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
            this.getElecPrice(entitiesIdArr, faultsIdArr, this.conditionModel.time(), categoriesArr, this.conditionModel.searchKey());
        }
        getTableData(structuresIdArr, faultsIdArr, time, categoriesArr, searchKey) {
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
            let postData = {
                "projectId": AppConfig.projectId,
                "startTime": startTime,
                "endTime": endTime,
                "entityIds": entityIds,
                "keywords": keywords,
                "faultIds": faultIds,
                "classNames": categoriesArr
            }
            var opt = {
                dataFilter: function (result) {
                    this.store.faults = result.data.data;
                    let unit = 'kWh';
                    this.store.faults.length > 0 && (unit = this.store.faults[0].unit);
                    this.$faultTable.find('.unit').text(unit);
                    return result.data.data;
                }.bind(this),
                url: '/diagnosis_v2/getRoiInfo',
                tableClass: 'table-striped',
                postData: postData,
                headerAdjustFix: true,
                theadCol: [
                    {name: I18n.resource.roi.TIME,width:"7.07%",sort:true},
                    {name: I18n.resource.roi.GROUP,width:"6.24%",sort:true},
                    {name: I18n.resource.roi.FAULT,width:"23.77%"},
                    {name: I18n.resource.roi.EQUIPMENT,width:"9.04%"},
                    {name: I18n.resource.roi.ROI,width:"4.78%"},
                    {name: `<span>${I18n.resource.roi.PER_YEAR}</span>
                    <select id="selCycle">
                        <option value="day">${I18n.resource.roi.DAY}</option>
                        <option value="week">${I18n.resource.roi.WEEK}</option>
                        <option value="month">${I18n.resource.roi.MONTH}</option>
                        <option value="year" selected>${I18n.resource.roi.YEAR}</option>
                    </select>
                    (<span class="unit"></span>)`,width:"13.06%"},
                    {name: I18n.resource.roi.POWER_PRICE,width:"8.03%"},
                    {name: I18n.resource.roi.SAVE_MONEY,width:"5.9%"},
                     {name: I18n.resource.roi.HR_PRICE,width:"8.22%"},
                    {name: I18n.resource.roi.HR,width:"7.2%"},
                    {name: I18n.resource.roi.LABORCOST},
                ],
                trSet:{
                    id: function(value){
                        return "fault_"+ value.faultId
                    },
                    className: "trROI",
                    data:{
                        faultId:"faultId",
                        equipmentId:"equipmentId",
                        runday:"runday",
                        runweek:"runweek",
                        runmonth:"runmonth",
                        runyear:"runyear",
                        factor:"factor",
                        energy:"energy"
                    }
                },
                tbodyCol:[
                    {index: 'time', converter: function(value){return value.time ? timeFormat(new Date(value.time), timeFormatChange('mm-dd hh:ii')) : '--'},title:true},
                    {index: 'group',title:true},
                    {index: 'faultName', title:true,className: "tdFaultName"},
                    {index: 'equipmentName',title:true},
                    {index: 'roi', converter: function(value){
                        let currentPowerPrice = value.elecPrice ? value.elecPrice : _this.powerPrice;
                        let saving = (Number(value.runYear) * Number(value.factor) * Number(value.energy)).toFixed(2);
                        saving = (saving && saving != 0) ? saving : '--';
                        let saveMoney = saving == '--' ? '--' : (saving * currentPowerPrice).toFixed(2);
                        let roi = saveMoney == '--' ? '--' : _this.calculateROI(saveMoney, value.laborCost, value.hrPrice, value.hr);
                        return roi
                    },className: "tdRoi"},
                    {index: 'saving',converter:function(value){
                        let currentPowerPrice = value.elecPrice ? value.elecPrice : _this.powerPrice;
                        let saving = (Number(value.runYear) * Number(value.factor) * Number(value.energy)).toFixed(2);
                        saving = (saving && saving != 0) ? saving : '--';
                        saving == '--' ? '--' : (saving * currentPowerPrice).toFixed(2);
                        return saving;
                    },className:"saving"},
                    {index: 'powerPrice',converter:function(value){return '<div class="mdEdit powerPrice" contentEditable="true">'+ (value.elecPrice ? value.elecPrice : _this.powerPrice) +'</div>'}},
                    {index: 'saveMoney',converter: function(value){
                        let currentPowerPrice = value.elecPrice ? value.elecPrice : _this.powerPrice;
                        let saving = (Number(value.runYear) * Number(value.factor) * Number(value.energy)).toFixed(2);
                        saving = (saving && saving != 0) ? saving : '--';
                        let saveMoney = saving == '--' ? '--' : (saving * currentPowerPrice).toFixed(2);
                        saveMoney == '--' ? '--' : _this.calculateROI(saveMoney, value.laborCost, value.hrPrice, value.hr);
                        return saveMoney
                    },className:"tdSavingMoney"},
                    {index: 'hrPrice', converter: function(value){return '<div class="mdEdit hrPrice" contentEditable="true">'+ (value.hrPrice !== null ? value.hrPrice : '--') +'</div>'}},
                    {index: 'hr', converter: function(value){return '<div class="mdEdit hr" contentEditable="true">'+ (value.hr !== null  ? value.hr : '--') +'</div>'}},  
                    {index: 'laborCost', converter: function(value){
                        return '<div class="mdEdit laborCost" contentEditable="true">'+
                        ((value.laborCost !== null) ? value.laborCost : ((value.hr == 0 || value.hr) && (value.hrPrice == 0 || value.hrPrice) ? value.hr * value.hrPrice : '--'))
                        +'</div>'
                    }},                                                                                                                                      
                ],
                onBeforeRender: function () {
                    Spinner.spin($("#diagnosisV2PageContainer")[0]);
                },
                onAfterRender: function () {
                    Spinner.stop();
                },
                more:true,
                paging:{
                    enable: true,
                    config:{
                        pageSizes: [25, 50, 100, 200],
                        // pageNum: 5,
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
                        if(value === "group"){
                            value = 'f.faultGroup';
                        }
                        return [{
                            'key':value,
                            'order':order
                        }]
                    }
                }
            }
            this.PagingTable = new PagingTable($('.faultTable',this.container),opt);
            this.PagingTable.show();
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
                    _this.getTableData(structuresIdArr, faultsIdArr, time, categoriesArr, searchKey);
                });
            });
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
        initTable(dataList) {
            let tpl = `<tr class="trROI" id="fault_{faultId}" data-faultId="{faultId}" data-equipmentId="{equipmentId}" data-runday="{runDay}" data-runweek="{runWeek}" data-runmonth="{runMonth}" data-runyear="{runYear}" data-factor="{factor}" data-energy="{energy}">
                            <td>{time}</td>
                            <td>{group}</td>
                            <td class="tdFaultName">{faultName}</td>
                            <td>{equipmentName}</td>
                            <td class="tdRoi">{roi}</td>
                            <td class="saving">{saving}</td>
                            <td>
                                <div class="mdEdit powerPrice" contentEditable="true">{powerPrice}</div>
                            </td>
                            <td class="tdSavingMoney">{saveMoney}</td>
                            <td>
                                <div class="mdEdit hrPrice" contentEditable="true">{hrPrice}</div>
                            </td>
                            <td>
                                <div class="mdEdit hr" contentEditable="true">{hr}</div>
                            </td>
                            <td>   
                                <div class="mdEdit laborCost" contentEditable="true">{laborCost}</div>
                            </td>
                        </tr>`;
            let trDom = '';
            for (let i = 0, ilen = dataList.length; i < ilen; i++){
                let item = dataList[i];
                let currentPowerPrice = item.elecPrice ? item.elecPrice : this.powerPrice;
                let saving = (Number(item.runYear) * Number(item.factor) * Number(item.energy)).toFixed(2);
                saving = (saving && saving != 0) ? saving : '--';
                let saveMoney = saving == '--' ? '--' : (saving * currentPowerPrice).toFixed(2);
                let roi = saveMoney == '--' ? '--' : this.calculateROI(saveMoney, item.laborCost, item.hrPrice, item.hr);
                trDom += (tpl.formatEL({
                    faultId: item.faultId,
                    equipmentId: item.equipmentId,
                    runDay: item.runDay,
                    runWeek: item.runWeek,
                    runMonth: item.runMonth,
                    runYear: item.runYear,
                    factor: item.factor,
                    energy: item.energy,
                    time: item.time ? timeFormat(new Date(item.time), timeFormatChange('mm-dd hh:ii')) : '--',
                    group: item.group,
                    faultName: item.faultName,
                    equipmentName: item.equipmentName,
                    roi: roi,
                    saving: saving,
                    powerPrice: currentPowerPrice,
                    saveMoney: saveMoney,
                    hrPrice: item.hrPrice !== null ? item.hrPrice : '--',
                    hr: item.hr !== null  ? item.hr : '--',
                    laborCost: (item.laborCost !== null) ? item.laborCost : ((item.hr == 0 || item.hr) && (item.hrPrice == 0 || item.hrPrice) ? item.hr * item.hrPrice : '--')
                }));
            }
            let unit = 'kWh';
            dataList.length > 0 && (unit = dataList[0].unit);
            this.$faultTable.find('.unit').text(unit);

            this.$faultTable.find('tbody').html(trDom);
        }
        calculateROI(saveMoney, laborCost, hrPrice, hr) {
            var ROI = '--';
            saveMoney = Number(saveMoney);
            laborCost = Number(laborCost);
            hrPrice = Number(hrPrice);
            hr = Number(hr);
            if (!laborCost || isNaN(laborCost)) {
                laborCost = hrPrice * hr;
            }
            if (laborCost && laborCost > 0) {
                //ROI
                if (saveMoney == 0) {
                    ROI = '--'
                } else if (laborCost === 0) {
                    ROI = 0;
                } else if (!laborCost) {
                    ROI = '--';
                } else {
                    ROI = (laborCost / saveMoney).toFixed(2);
                }
            }
            return ROI;
        }
        attachEvents() {
            var _this = this;
            let $thisContainer = $(_this.container).find('.roiTable');
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
            //编辑单元输入事件
            $thisContainer.on('focus', '[contenteditable]', function () {
                if ($(this).text() === '--') {
                    $(this).text('');
                }
            }).on('blur keyup paste input', '[contenteditable]', (e) => {
                var $this = $(e.target);
                if ($this.text() === '') $this.text('--');
                _this.updateEditData($this);
            });
            //保存
            $thisContainer.off('click.save').on('click.save', '.saveRoiBtnCtn', function () {
                if (_this.powerPriceModify.length == 0) return;
                var postData = {
                    projectId: AppConfig.projectId,
                    arrData: _this.powerPriceModify
                }
                WebAPI.post('/diagnosis_v2/saveRoiInfo', postData).done(result => {
                    if (result.data) {
                        alert('保存成功');
                    }
                });
            });
            //划上搜索框的时候 显示搜索
            $thisContainer.find('.searchBox').hover(function () {
                $thisContainer.find('.searchBox input').show();
            }, function () {
                $thisContainer.find('.searchBox input').val('').hide();

            });
            //切换导航上的年 月 周 更改估算节能量的周期
            $thisContainer.off('change.selCycle').on('change.selCycle', '#selCycle', function () {
                let val = $(this).val();
                let $prev = $(this).prev('span');
                switch (val){
                    case 'year':
                        $prev.text(I18n.resource.roi.PER_YEAR);
                        break;
                    case 'month':
                        $prev.text(I18n.resource.roi.PER_MONTH);
                        break; 
                    case 'week':
                        $prev.text(I18n.resource.roi.PER_WEEK);
                        break; 
                    case 'day':
                        $prev.text(I18n.resource.roi.PER_DAY);
                        break; 
                }
                $thisContainer.find('tbody tr').each(function () {
                    let runCycle = $(this).attr('data-run' + val);
                    let factor = $(this).attr('data-factor');
                    let energy = $(this).attr('data-energy');
                    let elecPrice = $(this).find('.powerPrice').text();
                    let laborCost = $(this).find('.laborCost').text();
                    let hrPrice = $(this).find('.hrPrice').text();
                    let hr = $(this).find('.hr').text();
                    let saving;
                    if (energy === 'null'){
                        saving = '--';
                    } else {
                        saving = (Number(runCycle) * Number(factor) * Number(energy)).toFixed(2);
                    }
                    let saveMoney = saving == '--' ? '--' : (saving * elecPrice).toFixed(2);
                    let roi = saveMoney == '--' ? '--' : _this.calculateROI(saveMoney, laborCost, hrPrice, hr);
                    $(this).find('.saving').text(saving);
                    $(this).find('.tdRoi').text(roi);
                    $(this).find('.tdSavingMoney').text(saveMoney);
                })
            });
        }
        updateEditData($this) {
            let $parent = $this.closest('tr');
            let powerPrice, hrPrice, hr, laborCost, runCycle, factor, energy;

            powerPrice = $('.powerPrice', $parent).text() === '--' ? '--' : Number(Number($('.powerPrice', $parent).text()).toFixed(2));
            hrPrice = $('.hrPrice', $parent).text() === '--' ? '--' : Number(Number($('.hrPrice', $parent).text()).toFixed(2));
            hr = $('.hr', $parent).text() === '--' ? '--' : Number(Number($('.hr', $parent).text()).toFixed(2));
            laborCost = $('.laborCost', $parent).text() === '--' ? '--' : Number(Number($('.laborCost', $parent).text()).toFixed(2));
            runCycle = $parent.attr('data-run' + $('#selCycle').val());
            factor = $parent.attr('data-factor');
            energy = $parent.attr('data-energy') === 'null' ? 0 : $parent.attr('data-energy');
            
            let saving = (Number(runCycle) * Number(factor) * Number(energy)).toFixed(2);
            saving = (saving && saving != 0) ? saving : '--';
            let saveMoney = saving == '--' ? '--' : Number((saving * powerPrice).toFixed(2));
            let roi = saveMoney == '--' ? '--' : this.calculateROI(saveMoney, laborCost, hrPrice, hr);
            let laborCostText = (hr == '--' || hrPrice == '--') ?'--'  : Number((hr * hrPrice).toFixed(2));

            $('.tdRoi', $parent).text(roi);
            $('.tdSavingMoney', $parent).text(saveMoney);
            $('.laborCost', $parent).text(laborCostText);

            let powerPriceObj = {};
            let id = $parent.attr('id').split('_')[1];
            let equipmentId = $parent.attr('data-equipmentId');
            powerPriceObj['faultId'] = id;
            powerPriceObj['equipmentId'] = equipmentId;
            powerPriceObj['powerPrice'] = powerPrice === '--' ? '--' : powerPrice;
            powerPriceObj['hrPrice'] = hrPrice === '--' ? '--' : hrPrice;
            powerPriceObj['hr'] = hr === '--' ? '--' : hr;
            powerPriceObj['laborCost'] = laborCost === '--' ? '--' : laborCost;
            if (this.powerPriceModify.length == 0) {
                this.powerPriceModify.push(powerPriceObj);
            } else {
                var isExist = false
                for (var i = 0, len = this.powerPriceModify.length; i < len; i++) {
                    if (this.powerPriceModify[i].faultId == id) {
                        isExist = true;
                        this.powerPriceModify[i] = powerPriceObj;
                    }
                }
                if (!isExist) {
                    this.powerPriceModify.push(powerPriceObj);
                }
            }
        }
        close() {
            if (this.faultDetailPanel) {
                this.faultDetailPanel.close();
                this.faultDetailPanel = null;
            }
            this.unbindOb();
        }
    }
    exports.FaultTable = FaultTable;
} (
    namespace('diagnosis.Roi'),
    namespace('diagnosis.components.FaultDetailPanel'),
    namespace('diagnosis.enum')
));
