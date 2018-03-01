// faultTable.js 2017/05/27 carol
;(function (exports, FaultDetailPanel, diagnosisEnum, PagingTable, Capture) {
    class FaultTable extends Capture() {
        constructor(container, conditionModel, diagnosis) {
            super();
            this.container = container;
            this.conditionModel = conditionModel;
            this.store = {};
            this.selectData = [];
            this.isHistory=true;
            this.diagnosis = diagnosis;
            this.groupEntityFaults = [];
        }
        show() {
            let $fault = $('#fault');
            $fault.hide();
            let $thisContainer = $(this.container);
            let searchVal = this.conditionModel.searchKey();
            $thisContainer.html(`<div class="tableCtn historyTable newHistoryPlane">
                                    <div class="conditionSearchCtn">
                                        <div class="conditionCtn clearfix"></div>
                                        <div class="exportButtonCtn">
                                            <div class="exportButton">${I18n.resource.history.EXPORT}</div>
                                        </div>
                                        <div class="searchBox">
                                            <input class="form-control" type="text" placeholder="search" value="${searchVal}" id="searchInput">
                                            <span class="iconfont icon-sousuo_sousuo"></span>
                                        </div>
                                    </div>
                                    <div class="hisFaultTable"><div class="widget-sdt-container fixed-header-table">
                                        <div class="his-table-header" style="padding-right: 13px;">
                                            <div class="hisHeadTd filterModule" style="width:20%;" filter-module="consequence">${I18n.resource.history.CONSEQUENCE}<div class="caret"></div></div>
                                            <div class="hisHeadTd filterModule" style="width:40%;">${I18n.resource.history.FAULT_NAME}</div>
                                            <div class="hisHeadTd filterModule" filter-module="grade">${I18n.resource.history.FAULT_GRADE}<div class="caret"></div></div>
                                            <div class="hisHeadTd filterModule" filter-module="faultTag">${I18n.resource.history.SOURCE_FAULT}<div class="caret"></div></div>
                                            <div class="hisHeadTd">${I18n.resource.history.NUMBER_FAULT}</div>
                                            <div class="hisHeadTd">${I18n.resource.history.FREQUENCY}</div>
                                        </div>
                                        <div class="his-table-body gray-scrollbar">  
                                        </div>
                                        </div>
                                    </div>
                                </div>
                                <div id="diagnosisFaultDetailPanel"></div>`);
            this.$conditionCtn = $thisContainer.find('.conditionCtn');
            this.$faultTable = this.$conditionCtn.find('.faultTable');
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
            let conditionArr = this.conditionModel.serialize();
            this.initCondition(conditionArr);
            let entitiesIdArr = [];
            this.conditionModel.activeAllEntities().forEach(v => {
                entitiesIdArr.push(v.id);
            });
            let faultsIdArr = [];
            this.conditionModel.activeFaults().forEach(v => {
                faultsIdArr.push(v.faultId);
            });
            let categoriesArr = this.conditionModel.activeCategories().map(v=>v.className);
            if(forbiddenArr2.indexOf(propName)>-1){
                return;
            }
            this.initNewHisTable(entitiesIdArr, faultsIdArr, this.conditionModel.time(), categoriesArr, this.conditionModel.searchKey());
            //this.getElecPrice(entitiesIdArr, faultsIdArr, this.conditionModel.time(), categoriesArr, this.conditionModel.searchKey());
            // this.initTable(entitiesIdArr, faultsIdArr, this.conditionModel.time(), categoriesArr, this.conditionModel.searchKey());
        }
        initNewHisTable(structuresIdArr, faultsIdArr, time, categoriesArr, searchKey){            
            if(this.faultDetailPanel){
                this.faultDetailPanel.close();
            }
            var $hisFaultTable = $(this.container).find('.hisFaultTable');
            $hisFaultTable.find('.his-table-body').empty();
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
            var psData = {
                "projectId": AppConfig.projectId,
                "startTime": startTime,
                "endTime":  endTime,
                "entityIds": entityIds,
                "keywords": searchKey,
                "faultIds": faultIds,
                "classNames": categoriesArr,
                "pageNum": 1,
                "pageSize": 25,
                "lan": I18n.type,
                "group": ['faultId'],
                "sort": []
            };

            WebAPI.post('/diagnosis_v2/getEntityFaults/group/v2',psData).done(function(rs){
                var $hisTableBody = $hisFaultTable.find('.his-table-body');
                var rsData = rs.data.data;
                this.groupEntityFaults = rsData;
                $hisTableBody.empty();
                if(rsData.length == 0){
                    let noFaultHtml = ` <div class="noDataMask">
                        <div class="noDataBox">
                            <div calss="noDataImg" style="text-align: center;"><img src="/static/images/error/noData.png" alt="无数据"></div>
                            <div class="noDataText">
                                <p style="font-size:26px;">${I18n.resource.task.FAULT}</p>
                            </div>
                        </div>
                    </div>`;    
                    $hisTableBody.append(noFaultHtml);
                    return ;
                }
                this.initFaultList(rsData,entityIds);
                this.initFilterFault(rsData);
            }.bind(this))
        }
        initFilterFault(rsData) {
            var filterModule = {
                "consequence": {},
                "faultName": {},
                "grade": {},
                "faultTag": {}
            }

            rsData.forEach(element => {
                if (filterModule["consequence"][element["consequence"]]) {
                    filterModule["consequence"][element["consequence"]] += 1;
                } else {
                    filterModule["consequence"][element["consequence"]] = 1;
                }
                if (filterModule["faultName"][element["faultName"]]) {
                    filterModule["faultName"][element["faultName"]] += 1;
                } else {
                    filterModule["faultName"][element["faultName"]] = 1;
                }
                var faultGradeName = diagnosisEnum.faultGradeName[element.grade];
                if (filterModule["grade"][faultGradeName]) {
                    filterModule["grade"][faultGradeName] += 1;
                } else {
                    filterModule["grade"][faultGradeName] = 1;
                }
                var faultTag = element.faultTag == 1 ? 'LOCAL' : 'CLOUD';
                if (filterModule["faultTag"][faultTag]) {
                    filterModule["faultTag"][faultTag] += 1;
                } else {
                    filterModule["faultTag"][faultTag] = 1;
                }
            });
            for (var key in filterModule) {
                var $filterModuleCon = $(`[filter-module=${key}]`);
                var rowList = filterModule[key];
                $filterModuleCon.find('.filterFault').remove();
                var filterDom = `<div class="filterFault"><div class="filterFaultRow">
                        <label class="radio-inline">
                            <input type="radio" name="sort" value="asc" module-radio=${key}> 升序
                        </label>
                        <label class="radio-inline">
                            <input type="radio" name="sort" value="desc" module-radio=${key}> 降序
                        </label>
                    </div>
                </div>`;
                $filterModuleCon.append(filterDom);

                // if (key == "consequence") {
                //     $filterModuleCon.find('.filterFault').empty();
                // }
                Object.keys(rowList).forEach(ele => {
                    var rowListDom = `<div class="filterFaultRow">
                        <label class="checkboxLabel"><input class="filterProp" type="checkbox" module=${key} value="${ele}"><span>${ele}</span></label>
                    </div>`;
                    $filterModuleCon.find('.filterFault').append(rowListDom);
                });
                var btnDom = `<div class="filterFaultRow">
                <button type="submit" class="btn btn-default btnFilterQuery">查询</button>
                </div>`;
                $filterModuleCon.find('.filterFault').append(btnDom);
            }
        }
        initFaultList(rsData,entityIds) {
            var $hisTableBody = $(this.container).find('.his-table-body');
            var consequenceType = {
                "other": "icon-qita1",
                "equipment health":"icon-cwp1",
                "comfort issue":"icon-gongshuaiyinshu",
                "energy waste":"icon-jitan"
            }
            $hisTableBody.empty();
            rsData.forEach(function (element) {
                var dom = `<div class="faultConBox">
                <div class="faultListRow" data-fault-id="${element.faultId}" data-entity-id="${entityIds ? entityIds : ''}">
                    <div class="faultListTd" style="width:20%;">
                        <div style="display:flex">
                        <span class="iconBg bg-${consequenceType[element.consequence.toLowerCase()]}">
                            <span class="consequenceIcon iconfont ${consequenceType[element.consequence.toLowerCase()]}"></span>
                        </span>
                            <span class="ellipsis">${diagnosisEnum.faultConsequenceName[element.consequence]}</span>
                        </div>
                    </div>
                    <div class="faultListTd" style="width:40%;">
                        <div style="display:flex"><span class="ellipsis">${element.faultName}</span></div>
                    </div>
                    <div class="faultListTd">
                        <div><span class="ellipsis faultGrade${element.grade}">${diagnosisEnum.faultGradeName[element.grade]}</span></div>
                    </div>
                    <div class="faultListTd">
                        <div><span class="ellipsis">${element.faultTag == 1 ? 'LOCAL' : 'CLOUD'}</span></div>
                    </div>
                    <div class="faultListTd">
                        <div><span class="ellipsis">${element.entityNum}</span></div>
                    </div>
                    <div class="faultListTd">
                        <div><span class="ellipsis">${element.time}</span></div>
                    </div>
                </div>
            </div>`;
                $hisTableBody.append(dom);
            });
        }
        initCondition(conditionArr) {
            if (sessionStorage.getItem('diagnosisCondition') && sessionStorage.getItem('diagnosisCondition') !== ''){
                var jsonData = JSON.parse(sessionStorage.getItem('diagnosisCondition'));
                if (jsonData.type) {
                    var categories = jsonData.type;
                    conditionArr.activeCategories = [{
                        className: categories,
                        name: categories
                    }]
                } else if (jsonData.searchId) {
                    var faults = jsonData
                    conditionArr.activeFaults = [{
                        faultId: Number(jsonData.searchId),
                        name: jsonData.searchName || ''
                    }]
                } else if (jsonData.entityIds && jsonData.entityIds.length) {
                    conditionArr.activeEntities = [{
                        id: jsonData.entityIds[0],
                        name: jsonData.entityName
                    }];
                    conditionArr.activeAllEntities = jsonData.entityIds.map(row => ({id: row}));
                }
                sessionStorage.removeItem("diagnosisCondition");
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
                'lan': I18n.type,
                'group':['faultId','entityId'],
                'sort': [{"key":"time","order":"desc"}]
            }            
            var opt = {
                dataFilter: function (result) {
                    var store = [];
                    if (result.data.data){
                        store = result.data.data.map((item)=>{
                            var temp =  item.list[0] || {}
                            temp.num = item.list.length;
                            return temp;
                        })
                    }
                    this.store.faults = store;
                    return store;
                }.bind(this),
                url: '/diagnosis_v2/getEntityFaults/group',
                tableClass: 'table-striped',
                postData: postData,
                headerAdjustFix: true,
                theadCol: [
                    {name: I18n.resource.history.CHOOSE,width:"3.5%"},
                    {name: I18n.resource.history.OCCUE_TIME, width: '10%',sort: true},
                    //{name: I18n.resource.history.FAULT_GRADE,width:"8.5%",sort: true},
                    //{name: I18n.resource.history.FAULT_NAME,width:"30%"},
                    //{name: I18n.resource.history.SOURCE_FAULT,width:"120px",sort: true},
                    //{name: I18n.resource.history.CONSEQUENCE, width: '10%',sort: true},
                    {name: I18n.resource.history.AREA, width: '8%'},
                    {name: I18n.resource.history.EQUIPMENT, width: '8%'},
                    //{ name: I18n.resource.history.STATUS},
                    {name: I18n.resource.history.TASK_STATUS, width: '10%'},
                    {name: I18n.resource.history.MAINTAINABLE, width: '10%'},
                    {name: I18n.resource.history.FREQUENCY, width: '6.5%'},
                ],
                trSet:{
                    data:{
                        id: "id",
                        grade:"grade",
                        consequence:'consequence',
                        maintainable:'maintainable',
                        entityParentName :"entityParentName",
                        entityName:"entityName",
                        name:"name"
                    },

                },
                tbodyCol:[
                    {index: 'choose',width:"3.5%",html:'<div class="isSelected"></div>'},
                    {index: 'time', width: '10%',title:true},
                    // {index: 'grade', converter: function (value) {
                    //     return ('<a data-grade="'+value["grade"]+'" style="color:'+ (value["grade"] === 2?'#ea595c':(value['grade'] === 0? '#00bae8':'#facc04')) +'";>'+ diagnosisEnum.faultGradeName[value["grade"]] + '</a>')
                    // }},
                    // {index: 'name',title:true,converter: function (value) { return value['name'] }},
                    // {index: 'faultTag',title:false,converter: function (value) { return `<span class="label label-info">${value['faultTag']==1?'LOCAL':'CLOUD'}</span>`}},
                    // {index: 'consequence', converter: function(value){return diagnosisEnum.faultConsequenceName[value["consequence"]]}},
                    {index: 'entityParentName',title:true},
                    { index: 'entityName', title: true },
                    //{ index: 'status', converter: function (value) { return ('<span data-status="' + value["status"] + '" class="status">' + diagnosisEnum.faultStatusName[value["status"]] + '</span>') }},
                    { index: 'taskStatus', converter: function (value) {
                         return ('<span data-taskstatus="'+(value["taskStatus"] ? value["taskStatus"]:'')+'" class="taskStatus">' + (value["taskStatus"] ? diagnosisEnum.taskStatusName[value["taskStatus"]]:'-') + '</span>')
                     }},
                    {index: 'maintainable',converter: function(value){return ('<span data-maintainable="'+value["maintainable"]+'" class="maintainable">'+diagnosisEnum.faultMaintainableName[value["maintainable"]]+'</span>')},title:true},
                    {index: 'name',title:true,converter: function (value) { return value['num']?`<span class="num">${value['num']}</span>`:'' }},
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
            var asyn = this.PagingTable.show();
            asyn.done(() => {
                if (AppConfig.fromPriorityFault){
                    $(_this.container).find('.historyTable tbody tr').eq(0).trigger('click');
                    AppConfig.fromPriorityFault = false;
                }
            })
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
                let titleTime=$(this).find('td').eq(1).attr('title')
                sessionStorage.setItem('titleTime',titleTime);
                if (!_this.faultDetailPanel) {
                    _this.faultDetailPanel = new FaultDetailPanel(_this.$diagnosisFaultDetailPanel[0],_this);
                }
                _this.faultDetailPanel.show(selectData(status,dataId));
            });
            $thisContainer.off('click.filterModule').on('click.filterModule','.filterModule',function(e){
                var $faultConBox = $('.faultConBox ');
                $faultConBox.removeClass('active');
                $thisContainer.find('.faultTable').remove();
                $(e.currentTarget).siblings().find('.filterFault').slideUp();
                $(e.currentTarget).toggleClass('isFold');
                if ($(e.currentTarget).hasClass('isFold')) {
                    $(e.currentTarget).find('.filterFault').slideDown(150);
                } else {
                    $(e.currentTarget).find('.filterFault').slideUp(150);
                }
                e.stopPropagation();
            })
            $thisContainer.off('click.btnFilterQuery').on('click.btnFilterQuery','.btnFilterQuery',function (e) {
                var filterData = [],
                    secondFilterData = [],
                    lastFilterData = [];
                var consequenceType = getFilterData("consequence"),
                    gradeType = getFilterData("grade"),
                    tagType = getFilterData("faultTag");
                var $radioSelected = $("input[type='radio']:checked");
                var dataOrderModule = $radioSelected.attr('module-radio');
                var radioValue = $radioSelected.val();
                if (consequenceType.length > 0) {
                    _this.groupEntityFaults.forEach(element => {
                        if (consequenceType.indexOf(element.consequence) > -1) {
                            filterData.push(element);
                        }
                    })
                } else {
                    filterData = _this.groupEntityFaults;
                }
                if (gradeType.length > 0) {
                    filterData.forEach(element => {
                        var grade = diagnosisEnum.faultGradeName[element.grade];
                        if (gradeType.indexOf(grade) > -1) {
                            secondFilterData.push(element);
                        }
                    })
                } else {
                    secondFilterData = filterData;
                }
                if (tagType.length > 0) {
                    secondFilterData.forEach(element => {
                        var faultTag = element.faultTag == 1 ? 'LOCAL' : 'CLOUD';
                        if (tagType.indexOf(faultTag) > -1) {
                            lastFilterData.push(element);
                        }
                    })
                } else {
                    lastFilterData = secondFilterData;
                }
                if (radioValue == "asc") {
                    lastFilterData.sort(function (a, b) {
                        if (typeof a[dataOrderModule] === "string" && typeof b[dataOrderModule] === "string") {
                            if (a[dataOrderModule].toLowerCase() < b[dataOrderModule].toLowerCase()) {
                                return -1;
                            } else if (a[dataOrderModule].toLowerCase() > b[dataOrderModule].toLowerCase()) {
                                return 1;
                            }
                        } else {
                            return a[dataOrderModule] - b[dataOrderModule];
                        }
                    })
                }
                if (radioValue == "desc") {
                    lastFilterData.sort(function (a, b) {
                        if (typeof a[dataOrderModule] === "string" && typeof b[dataOrderModule] === "string") {
                            if (a[dataOrderModule].toLowerCase() < b[dataOrderModule].toLowerCase()) {
                                return 1;
                            } else if (a[dataOrderModule].toLowerCase() > b[dataOrderModule].toLowerCase()) {
                                return -1;
                            }
                        } else {
                            return b[dataOrderModule] - a[dataOrderModule];
                        }
                    })
                }
                this.initFaultList(lastFilterData);
                $(e.currentTarget).parent().parent().slideUp(150);
                $(".filterModule").removeClass('isFold');
                e.stopPropagation();
            }.bind(this));
            $thisContainer.off('click.filterFaultRow').on('click.filterFaultRow','.filterFaultRow',function(e){
                e.stopPropagation();
            })
            function getFilterData(type){ 
                var consequenceType = [];               
                var $consequence = $(`[filter-module="${type}"]`);
                var $conCheckBox = $('.filterProp',$consequence);
                for (var i = 0; i < $conCheckBox.length; i++) {
                    if ($conCheckBox[i].checked) {
                        consequenceType.push($($conCheckBox[i]).val());
                    }
                }
                return consequenceType;
            }
            $thisContainer.off('click.faultListRow').on('click.faultListRow', '.faultListRow', function (e) {
                let faultId = e.currentTarget.dataset.faultId;
                let entityId = e.currentTarget.dataset.entityId;
                let entityIdArr;
                let targetParent = $(e.currentTarget).parent();
                targetParent.siblings().removeClass('active');
                if(!entityId){
                    entityIdArr = [];
                }else{
                    entityIdArr = entityId.indexOf(',') > -1 ? entityId.split(',') : [entityId];
                }
                
                $thisContainer.find('.faultTable').remove();
                _this.faultDetailPanel && _this.faultDetailPanel.close();

                if (targetParent.hasClass('active')) {
                    targetParent.removeClass('active');
                    targetParent.find('.faultTable').remove();
                } else {
                    targetParent.addClass('active');
                    targetParent.append('<div class="faultTable"></div> ');
                    // var historyDomHeight = $('.hisFaultTable').height() - ($('.faultConBox').length + 1) * 48 + 'px';
                    // $('.faultTable').css("max-height",historyDomHeight);
                    this.getElecPrice(entityIdArr, [faultId], this.conditionModel.time(), [], this.conditionModel.searchKey())
                }
            }.bind(this));

            function selectData(selectStatus,trId) {
                // 获取当前选中的行
                _this.$faultTable = $('.faultTable');
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
                let titleTime=$(this).closest('tr').find('td').eq(1).attr('title')
                sessionStorage.setItem('titleTime',titleTime);
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
                let newArr = _this.conditionModel[type]().filter((v, index) => {
                    let hasId = '';
                    if (type === 'activeCategories') {
                        return v.name !== name;
                    } else {
                        if (type === 'activeEntities') {
                            return id !== v.id;
                        } else if (type === 'activeFaults') {
                            return id !== v.faultId;
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
            //添加任务
            $('#divAddWork').off('click').on('click', () => {
                if (_this.selectData.length === 0) {
                    return;
                }
                let postData = _this.selectData.map(row => ({
                    noticeId: row.id,
                    faultId: row.faultId,
                    entityId: row.entityId
                }));
                if(confirm(i18n_resource.history.SURE_TO_ADD)){
                    WebAPI.post('/diagnosis_v2/addTasks/' + AppConfig.projectId, {
                        lang: I18n.type,
                        data: postData,
                        operatorId: AppConfig.userId
                    }).done((rs) => {
                        if (rs.data && rs.data.duplicated_id.length !== 0) {
                            let noticeId = rs.data.duplicated_id.join(",");
                            if (rs.msg === "add success") {
                                alert(i18n_resource.history.SUCCESS + '(' + i18n_resource.history.REPEAT + ' notice Id ' + noticeId + ')');
                                _this.PagingTable.show();
                            } else if (rs.msg.indexOf("duplicated") !== -1) {
                                alert(i18n_resource.history.FAIL + ',' + i18n_resource.history.REPEAT + ' notice Id ' + noticeId);
                            }
                        } else {
                            if (rs.msg === "add success") {
                                alert(i18n_resource.history.SUCCESS);
                                _this.PagingTable.show();
                            } else if (rs.msg === "add error") {
                                alert(i18n_resource.history.FAIL);
                            } else if (rs.msg.indexOf("duplicated") !== -1) {
                                let noticeId = rs.data.duplicated_id.join(",");
                                alert(i18n_resource.history.FAIL + ',' + i18n_resource.history.REPEAT + ' notice Id ' + noticeId);
                            }
                        }
                    });
                }
           
            })
            //导出为excel
            $thisContainer.off('click.export').on('click.export', '.exportButton', function (e) { 
                let entitiesIdArr = [];
                _this.conditionModel.activeAllEntities().forEach(v => {
                    entitiesIdArr.push(v.id);
                });
                let faultsIdArr = [];
                _this.conditionModel.activeFaults().forEach(v => {
                    faultsIdArr.push(v.faultId);
                });
                let categoriesArr = _this.conditionModel.activeCategories().map(v=>v.className);
                let conditionArr = _this.conditionModel.serialize();
                let time = _this.conditionModel.time();
                let key = _this.conditionModel.searchKey();
                let orderTime = $('.faultTable').find('th').eq(1).data('sort');
                let orderGrade = $('.faultTable').find('th').eq(2).data('sort');
                let postData = {         
                    "startTime": time.startTime,
                    "endTime": time.endTime,
                    "entityIds": entitiesIdArr,
                    "keywords": key,
                    "faultIds": faultsIdArr,
                    "classNames": categoriesArr,
                    'lang': I18n.type,
                    'group':['faultId','entityId'],
                    'sort': [{
                        "key": "time",
                        "order": orderTime
                    }, {
                        "key": "n.grade",
                        "order": orderTime
                    }]
                }
                // postData = {
                //     "startTime": "2018-01-31 00:00:00",
                //     "endTime": "2018-02-06 23:59:59",
                //     "entityIds": [],
                //     "keywords": "",
                //     "faultIds": [],
                //     "classNames": [],
                //     "lang": "zh",
                //     "group": ["faultId", "entityId"],
                //     "sort": [{
                //         "key": "time",
                //         "order": "desc"
                //     }, {
                //         "key": "n.grade",
                //         "order": "desc"
                //     }]
                // };
                var xhr = new XMLHttpRequest();
                xhr.open('POST', 'diagnosis_v2/diagnosisExcel/' + AppConfig.projectId);
                xhr.onload = function() {
                    var blob;
                    if (this.status === 200 && this.response) {
                        blob = new Blob([xhr.response], { type: "application/vnd.ms-excel" });
                        jQuery.getScript("/static/scripts/lib/html-docx/FileSaver.js").done(function () {
                            saveAs(blob, AppConfig.project['name_'+(I18n.type==='zh'?'cn':'en')] + '_' + AppConfig.projectId + '.xlsx');
                        })
                    } else {
                        alert('Generate excel failed, please try it again soon!');
                    }
                };
                xhr.setRequestHeader("Content-Type", "application/json");
                xhr.responseType = 'arraybuffer';
                xhr.send(JSON.stringify(postData));
            })
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
                let faultId = Number(dom.dataset['id']);
                let trInfo = this.store.faults.find(row => row.id === faultId);
                let tds = dom.querySelectorAll('td');
                let time = tds[1].querySelector('span').innerHTML,
                    grade = diagnosisEnum.faultGradeName[dom.dataset.grade],
                    name = dom.dataset.name,
                    consequence = dom.dataset.consequence,
                    area = dom.dataset.entityparentname,
                    entity = dom.dataset.entityname,
                    status = '';
                let info = {
                    time,
                    grade,
                    name,
                    consequence,
                    area,
                    entity,
                    status,
                    faultInfo: trInfo
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
