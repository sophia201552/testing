// faultTable.js 2017/05/27 carol
;(function (exports, FaultDetailPanel, diagnosisEnum, PagingTable, Capture, TaskModal) {
    class FaultTable extends Capture() {
        constructor(container, conditionModel, diagnosis) {
            super();
            this.container = container;
            this.conditionModel = conditionModel;
            this.store = {};
            this.taskModal = new TaskModal('diagnosisV2Detail', diagnosis);
            this.selectData = [];
            this.diagnosis = diagnosis;
        }
        show() {
            let $thisContainer = $(this.container);
            let searchVal = this.conditionModel.searchKey();
            $thisContainer.html(`<div class="tableCtn taskTable">
                                    <div class="conditionSearchCtn">
                                        <div class="conditionCtn clearfix"></div>
                                        <div class="exportButtonCtn">
                                            <div class="exportButton">导出</div>
                                        </div>
                                        <div class="statusBtns"></div>
                                        <div class="searchBox">
                                            <input class="form-control" type="text" placeholder="search" value="${searchVal}" id="searchInput">
                                            <span class="iconfont icon-sousuo_sousuo"></span>
                                        </div>
                                    </div>
                                    <div class="faultTable"></div>
                                </div>
                                <div id="workOrderInfo"></div>`);
            this.$conditionCtn = $thisContainer.find('.conditionCtn');
            this.$faultTable = $thisContainer.find('.faultTable');
            this.$workOrderInfo = $thisContainer.find('#workOrderInfo');

            this.initCondition(this.conditionModel.serialize());
            this.attachEvents();
            this.unbindOb();
            this.bindOb();
            this.update('defaultTime');
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
            if (e === 'defaultTime') { 
                this.initTable(entitiesIdArr, faultsIdArr, this.conditionModel.time(), categoriesArr, this.conditionModel.searchKey(), 'defaultTime');
            } else {
                this.initTable(entitiesIdArr, faultsIdArr, this.conditionModel.time(), categoriesArr, this.conditionModel.searchKey());
            }
            
        }
        initCondition(conditionArr) {
            if (sessionStorage.getItem('diagnosisCondition') && sessionStorage.getItem('diagnosisCondition') !== ''){
                var jsonData = JSON.parse(sessionStorage.getItem('diagnosisCondition'));
                var categories = jsonData.type;
                conditionArr.activeCategories = [{
                    className: categories,
                    name: categories,
                }]
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
        initTable(structuresIdArr, faultsIdArr, time, categoriesArr, searchKey, defaultType) {
            if (!searchKey) {
                searchKey = '';
            }
            let faultIds, entityIds, startTime, endTime, keywords;
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
                categoriesArr = jsonData.type?[jsonData.type]:[];
                faultIds=jsonData.searchId?[jsonData.searchId]:faultIds;
                sessionStorage.removeItem("diagnosisCondition");//删除名称为“key”的信息。
            }
            let postData = {
                pageNum: 1,
                pageSize: 50,
                searchText: searchKey,
                sort: [{
                    key: 'time',
                    order: 'desc'
                }],
                filter: [{
                    key: 'status',
                    value:[1,2,3,10,20]
                },{
                    key: 'entityId',
                    value:entityIds
                },{
                    key: 'faultIds',
                    value:faultIds
                }],
                lang: I18n.type,
                "startTime": startTime,
                "endTime": endTime
            };
            if(!startTime)delete postData.startTime;
            if(!endTime)delete postData.endTime;
            var opt = {
                pageType: 'task',
                dataFilter: function (result) {
                    this.store.tasks = result.data.items;
                    return result.data.items;
                }.bind(this),
                url: '/diagnosis_v2/getTasks/' + AppConfig.projectId,
                tableClass: 'table-striped',
                postData: postData,
                headerAdjustFix: true,
                theadCol: [
                    {name: I18n.resource.history.CHOOSE,width:"5%"},
                    { name: I18n.resource.history.OCCUE_TIME, sort: true,width:'9%'},
                    {name: I18n.resource.task.ADD_TIME,sort: true,width:'9%'},
                    { name: I18n.resource.history.FAULT_GRADE, width: "8%" },
                    { name: I18n.resource.task.PRIORITY },
                    { name: I18n.resource.history.CONSEQUENCE},
                    {name: I18n.resource.history.AREA},
                    { name: I18n.resource.history.EQUIPMENT },
                    { name: I18n.resource.history.FAULT_NAME, width: "30%" },
                    { name: I18n.resource.task.STATUS, sort: true ,width:'9%'},
                ],
                trSet:{
                    data:{
                        id: 'id',
                        entityId: 'entityId',
                        faultId: 'faultId',
                        workTaskId: 'workTaskId'
                    }                    
                },
                tbodyCol:[
                    {index: 'choose',html:'<div class="isSelected"></div>'},
                    { index: 'faultTime', converter: function(value){return value["faultTime"].substr(5,11)}},
                    { index: 'time', converter: function(value){return value["time"].substr(5,11)}},
                    {index: 'grade', converter: function (value) {
                        return ('<a data-grade="'+value["grade"]+'" style="color:'+ (value["grade"] === 2?'#ea595c':(value['grade'] === 0? '#00bae8':'#facc04')) +'";>'+ diagnosisEnum.faultGradeName[value["grade"]] + '</a>')
                    }
                    },
                    {index: 'priority', converter: function(value){return diagnosisEnum.faultLevelName[value["priority"]]}},
                    {index: 'consequence', converter: function(value){return diagnosisEnum.faultConsequenceName[value["consequence"]]}},
                    {index: 'parentEntityName',title:true},
                    {index: 'entityName',title:true},
                    {index: 'faultName',title:true},
                    { index: 'status', converter: function (value) { return ('<span data-status="' + value["status"] + '" class="status">' + diagnosisEnum.taskStatusName[value["status"]] + '</span>') }, title: true }
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
                    sortData: function (value, order) {
                        return [{
                            'key':value,
                            'order':order
                        }]
                    }
                },
                selectedStatus: (value) => { 
                    let arr = [];
                    if (value) {
                        arr =  [{
                            key: 'status',
                            value: value
                        }]
                    }
                    entityIds.length > 0  && arr.push({key: 'entityId', value:entityIds})
                    faultIds.length > 0 && arr.push({ key: 'faultIds', value: faultIds })
                    if (!defaultType) {
                        startTime && endTime && arr.push({key: 'time',type: 'range',value: startTime + '|' + endTime})
                    }
                    return arr;
                }
            }
            this.PagingTable = new PagingTable($('.faultTable',this.container),opt);
            var asyn = this.PagingTable.show();
            asyn.done((rs) => {
                let statusLength = [{
                    status: 1,
                    isHighLight: true
                }, {
                    status: 2,
                    isHighLight: true
                }, {
                    status: 3
                },{
                    status: 10
                }/* , {
                    status: 20,
                    length: 0
                } */];
                rs.data.items.forEach((row) =>{
                    statusLength.forEach((v) => {
                        if (v.status === row.status) {
                            v.length += 1;
                        }
                    })
                })
                let dom = statusLength.map((row) => 
                    (
                    `<div class="${(row.isHighLight ? 'highLight' : '')}" data-status="${row.status}">
                        <span class="circle"></span>
                        <span>${diagnosisEnum.taskStatusName[row.status]}</span>
                    </div>`
                    )
                );
                $('.taskTable .statusBtns').html(dom);
            })
        }
        attachEvents() {
            var _this = this;
            let $thisContainer = $(_this.container).find('.taskTable');
            //点击单行
            $thisContainer.off('click.tr').on('click.tr', 'tbody tr', function (e) {
                if ($(this).hasClass('selected')) { 
                    $(this).removeClass('selected');
                    $(this).removeClass('selectedHover');
                } else {
                    $('tbody tr').removeClass('selected');
                    $('tbody tr').removeClass('selectedHover');
                    $(this).addClass('selected');
                    $(this)[0].scrollIntoView(false);
                }
                let status = $(this).hasClass('selected');
                let dataId = parseInt($(this).attr('data-id'));
                selectData(status,dataId);
                $('#divAction').click();
            });
            function selectData(selectStatus,trId) {
                // 获取当前选中的行
                let selectedIds = [];
                let $selectedRadio = _this.$faultTable.find('.selected').each(function (i, dom) {
                    selectedIds.push(parseInt(dom.dataset.id));
                });
                let selectData = _this.store.tasks.filter(function (row) {
                    return selectedIds.indexOf(row.id) > -1;
                });
                if (selectStatus) {
                    let index = selectData.findIndex(v => v.id == trId);
                    if (selectData.length > 1) {
                        let indexData = selectData.splice(index, 1)[0];
                        selectData.unshift(indexData);
                    }
                }
                _this.selectData = selectData;
                if (_this.selectData.length === 0) {
                    $('#divAction').removeClass('highLight');
                    $('.tableCtn').css({ height: '100%' });
                    _this.$workOrderInfo.hide();
                }else{
                    $('#divAction').addClass('highLight');
                }
            }
            //点击单行前面的 图标
            $thisContainer.off('click.isSelected').on('click.isSelected', 'tbody tr .isSelected', function (e) {
                let $parent = $(this).closest('tr');
                if ($parent.hasClass('selected')){
                    $parent.removeClass('selected');
                    $parent.removeClass('selectedHover');
                } else {
                    $thisContainer.find('tr').removeClass('selected');
                    $parent.addClass('selected');
                    //跳到选中的视野
                    $parent[0].scrollIntoView(false);
                }
                e.stopPropagation();
                let status = $parent.hasClass('selected');
                let dataId = parseInt($parent.attr('data-id'));
                selectData(status, dataId);
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
            //处理按钮
            $('#divAction').off('click').on('click', () => {
                if (_this.selectData.length !== 0) {
                    // $('.tableCtn').css({ height: '50%' });
                    // _this.$workOrderInfo.show();
                    let selectedData = _this.selectData.map((row) => {
                        let data = {
                            id: row.id
                        }
                        return data;
                    });
                    _this.taskModal.show(selectedData);
                }
            });
            //删除任务按钮
            // $('#divDelete').off('click').on('click', () => {
            //     if (_this.selectData.length !== 0) {
            //         let postData = {
            //             ids: _this.selectData.map((row) => {
            //                 return row.id;
            //             })
            //         };
            //         WebAPI.post('/diagnosis_v2/removeTasks/' + AppConfig.projectId, postData).done((rs) => {
            //             alert(rs.msg);
            //             if (rs.status === 'OK'){
            //                 _this.PagingTable.show();
            //             }
            //         });
            //     }
            // });

            //删除任务按钮
            $('#divDelete').off('click').on('click', () => {
                let deleteNum = 20;
                let saveData = {
                    "operatorId": AppConfig.userId,
                    "comment": '',
                    "data": {}
                }
                if (_this.selectData.length !== 0) {
                    let postData = {
                        id: _this.selectData.map((row) => {
                            return row.id;
                        })
                    };
                    saveData.data.status  = Number(deleteNum);
                    WebAPI.post(`/diagnosis_v2/updateTask/${postData.id}`, saveData).done((result)=>{
                        alert(result.msg);
                        if (result.status === "OK") {
                            $('[data-class=Task]').trigger('click');
                        }                 
                    }).always(()=>{
                        Spinner.stop();
                    }) 
                }
            });
            
            //导出为excel
            $thisContainer.off('click.export').on('click.export', '.exportButton', function (e) {
                let time = _this.conditionModel.time();
                let key = _this.conditionModel.searchKey();
                let orderTime = $thisContainer.find('th').eq(2).data('sort');
                let statusArr = [];
                let statusCtn = $thisContainer.find('.statusBtns')[0].children;
                for (let i = 0; i < statusCtn.length;i++){
                    if ($(statusCtn[i]).hasClass('highLight')) {
                        let val = Number($(statusCtn[i]).data('status'));
                        statusArr.push(val);
                    }
                }
                let postData = {         
                    "startTime": time.startTime,
                    "endTime": time.endTime,
                    'lang': I18n.type,
                    "filter": [{
                        "key": "status",
                        "value": statusArr
                    }],
                    "searchText": key,
                    'sort': [{
                        "key": "time",
                        "order": orderTime
                    }]
                }
                var xhr = new XMLHttpRequest();
                xhr.open('POST', 'diagnosis_v2/diagnosisTaskExcel/' + AppConfig.projectId);
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
        close() {
            if (this.faultDetailPanel) {
                this.faultDetailPanel.close();
                this.faultDetailPanel = null;
            }
            this.taskModal && this.taskModal.close(0);
            this.unbindOb();
        }
        //重写
        capture() {
            let promise = $.Deferred();
            let infos = [];
            this.captureDoms.forEach((dom, index) => {
                let taskId = Number(dom.dataset['id']);
                let trInfo = this.store.faults.find(row => row.id === taskId);
                let tds = dom.querySelectorAll('td');
                let time = tds[1].querySelector('span').innerHTML,
                    grade = tds[3].querySelector('a').dataset.grade,
                    consequence = tds[5].querySelector('span').innerHTML,
                    area = tds[6].querySelector('span').innerHTML,
                    entity = tds[7].querySelector('span').innerHTML,
                    status = tds[9].querySelector('span.status').dataset.status,
                    name = tds[8].querySelector('span').textContent;
                let info = {
                    time,
                    grade,
                    name,
                    consequence,
                    area,
                    entity,
                    status,
                    taskInfo: trInfo
                };
                infos.push(info);
            });
            promise.resolve(infos);
            return promise;
        }
        //重写
        _attachEvents() {
            this.captureType = 'task';
            let _this = this;
            let $captureDom = $(this._captureDom);
            let $thisContainer = $captureDom.find('.taskTable');
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
    namespace('diagnosis.Task'),
    namespace('diagnosis.components.FaultDetailPanel'),
    namespace('diagnosis.enum'),
    namespace('PagingTable'),
    namespace('diagnosis.mixins.Capture'),
    namespace('diagnosis.components.TaskModal')
));
