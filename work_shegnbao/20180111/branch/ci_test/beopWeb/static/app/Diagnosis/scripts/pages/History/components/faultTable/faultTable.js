// faultTable.js 2017/05/27 carol
;(function (exports, FaultDetailPanel, diagnosisEnum, PagingTable, Capture) {
    class FaultTable extends Capture(Object) {
        constructor(container, conditionModel) {
            super();
            this.container = container;
            this.conditionModel = conditionModel;
            this.store = {};
        }
        show() {
            let $thisContainer = $(this.container);
            let searchVal = this.conditionModel.searchKey();
            $thisContainer.html(`<div class="tableCtn historyTable">
                                    <div class="conditionSearchCtn">
                                        <div class="conditionCtn clearfix"></div>
                                        <div class="searchBox">
                                            <input class="form-control" type="text" placeholder="search" value="${searchVal}" id="searchInput">
                                            <span class="iconfont icon-sousuo_sousuo"></span>
                                        </div>
                                    </div>
                                    <div class="faultTable"></div>
                                </div>
                                <div id="diagnosisFaultDetailPanel"></div>`);
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
            let conditionArr = this.conditionModel.serialize();
            this.initCondition(conditionArr);
            if(forbiddenArr2.indexOf(propName)>-1){
                return;
            }
            this.getElecPrice(entitiesIdArr, faultsIdArr, this.conditionModel.time(), categoriesArr, this.conditionModel.searchKey());
            // this.initTable(entitiesIdArr, faultsIdArr, this.conditionModel.time(), categoriesArr, this.conditionModel.searchKey());
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
                "classNames": categoriesArr,
                "pageNum": 1,
                "pageSize": 50,                
            }
            var opt = {
                dataFilter: function (result) {
                    this.store.faults = result.data.data;
                    return result.data.data;
                }.bind(this),
                url: '/diagnosis_v2/getEntityFaults',
                tableClass: 'table-striped',
                postData: postData,
                headerAdjustFix: true,
                theadCol: [
                    {name: I18n.resource.history.CHOOSE,width:"6.5%"},
                    {name: I18n.resource.history.OCCUE_TIME,sort: true},
                    {name: I18n.resource.history.FAULT_GRADE,width:"8.5%",sort: true},
                    {name: I18n.resource.history.FAULT_NAME,width:"30%"},
                    {name: I18n.resource.history.CONSEQUENCE,sort: true},
                    {name: I18n.resource.history.AREA},
                    {name: I18n.resource.history.EQUIPMENT},
                    {name: I18n.resource.history.STATUS,sort: true},
                ],
                trSet:{
                    data:{
                        id: "id"
                    }                    
                },
                tbodyCol:[
                    {index: 'choose',html:'<div class="isSelected"></div>'},
                    {index: 'time',title:true},
                    {index: 'grade', converter: function (value) {
                        return ('<a data-grade="'+value["grade"]+'" style="color:'+ (value["grade"] === 1?'#facc04':'#ea595c') +'";>'+ diagnosisEnum.faultGradeName[value["grade"]] + '</a>')
                    }},
                    {index: 'name',title:true},
                    {index: 'consequence', converter: function(value){return diagnosisEnum.faultConsequenceName[value["consequence"]]}},
                    {index: 'entityParentName',title:true},
                    {index: 'entityName',title:true},
                    {index: 'status',converter: function(value){return ('<span data-status="'+value["status"]+'" class="status">'+diagnosisEnum.faultStatusName[value["status"]]+'</span>')},title:true}
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
                        if(value === "grade" || value === "status"){
                            value = 'n.'+ value;
                        }else if(value === "consequence"){
                            value = 'f.'+ value;
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
                    _this.initTable(structuresIdArr, faultsIdArr, time, categoriesArr, searchKey);
                });
            });
        }
        attachEvents() {
            var _this = this;
            let $thisContainer = $(_this.container).find('.historyTable');
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
    namespace('diagnosis.History'),
    namespace('diagnosis.components.FaultDetailPanel'),
    namespace('diagnosis.enum'),
    namespace('PagingTable'),
    namespace('diagnosis.mixins.Capture')
));
