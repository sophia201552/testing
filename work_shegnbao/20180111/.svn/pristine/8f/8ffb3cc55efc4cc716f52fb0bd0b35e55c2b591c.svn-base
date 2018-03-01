;(function (exports, FaultDetailPanel) {
    class AssociatedFault {
        constructor(container, conditionModel) {
            this.container = container;
            this.conditionModel = conditionModel;
            this.faultDetailPanel = null;
            this.store = {};
            this.projectId = 293;
        }
        init() {
            let dom = `<div class="associatedFaultsCtn">
                            <div class="tableCtn thermalComfort_scroll"></div>
                            <div class="faultDetailPanel"></div>
                        </div>`;
            this.container.innerHTML = dom;
            this.ctn = this.container.querySelector('.associatedFaultsCtn .tableCtn');
            this.faultDetailPanelCtn = this.container.querySelector('.faultDetailPanel');
            var timea = new Date().format('yyyy-MM-dd 09:00:00');
            var timeb = new Date().format('yyyy-MM-dd 09:00:00');
            var timec = new Date().format('yyyy-MM-dd 10:00:00');
            var timed = new Date().format('yyyy-MM-dd 12:00:00');
            var timee = new Date().format('yyyy-MM-dd 18:00:00');
            this.temporaryData = [{
                "consequence": "Comfort issue",
                "description": "Zone temperature keeps below its setpoint under cooling mode. Please check whether the terminal control works well.",
                "entityId": 27,
                "entityName": "L17_S1_Room",
                "entityParentName": "L17",
                "faultId": 2214,
                "grade": 2,
                "id": 57172,
                "name": "Zone temperature too cold under cooling mode",
                "points": [{ "description": "DAY.NGT(DAY-0 NGT-1)", "name": "L19S1_IU09_DAY.NGT" }, { "description": "ZoneAirTempSetpoint", "name": "L19S1_IU09_zoneSP" }, { "description": "ZoneAirT", "name": "L19S1_IU09_zoneTemp" }, { "description": "ZoneHeatingCoilValveRatio", "name": "L19S1_IU09_HHWValve" }, { "description": "ZoneCoolingCoilValveRatio", "name": "L19S1_IU09_CHWValve" }],
                "status": 1,
                "time": timea
            }, {
                "consequence": "Comfort issue",
                "description": "Zone temperature keeps below its setpoint under cooling mode. Please check whether the terminal control works well.",
                "entityId": 27,
                "entityName": "L17_S2_Room",
                "entityParentName": "L17",
                "faultId": 2214,
                "grade": 2,
                "id": 57172,
                "name": "Zone temperature too cold under cooling mode",
                "points": [{ "description": "DAY.NGT(DAY-0 NGT-1)", "name": "L21S1_IU06_DAY.NGT" }, { "description": "ZoneAirTempSetpoint", "name": "L21S1_IU06_zoneSP" }, { "description": "ZoneAirT", "name": "L21S1_IU06_zoneTemp" }, { "description": "ZoneHeatingCoilValveRatio", "name": "L21S1_IU06_HHWValve" }, { "description": "ZoneCoolingCoilValveRatio", "name": "L21S1_IU06_CHWValve" }],
                "status": 1,
                "time": timeb
            }, {
                "consequence": "Comfort issue",
                "description": "The terminal has achieved its maximum cooling capacity, but zone temperature stays higher than its setpoint, which may lead to an uncomfortable thermal environment. Please check the terminal as well as its setpoint.",
                "entityId": 27,
                "entityName": "L23_S1_Room",
                "entityParentName": "L23",
                "faultId": 2214,
                "grade": 2,
                "id": 57172,
                "name": "Cooling capacity fault",
                "points": [{ "name": "L21S1_IU02_DAY.NGT", "description": "DAY.NGT(DAY-0 NGT-1)" }, { "name": "L21S1_IU02_zoneSP", "description": "ZoneAirTempSetpoint" }, { "name": "L21S1_IU02_zoneTemp", "description": "ZoneAirT" }, { "name": "L21S1_IU02_HHWValve", "description": "ZoneHeatingCoilValveRatio" }, { "name": "L21S1_IU02_CHWValve", "description": "ZoneCoolingCoilValveRatio" }],
                "status": 1,
                "time": timec
            },{
                "consequence": "Comfort issue",
                "description": "The terminal has achieved its maximum cooling capacity, but zone temperature stays higher than its setpoint, which may lead to an uncomfortable thermal environment. Please check the terminal as well as its setpoint.",
                "entityId": 27,
                "entityName": "L28_S1_Room",
                "entityParentName": "L28",
                "faultId": 2214,
                "grade": 2,
                "id": 57172,
                "name": "Cooling capacity fault",
                "points": [{ "name": "L21S1_IU02_DAY.NGT", "description": "DAY.NGT(DAY-0 NGT-1)" }, { "name": "L21S1_IU02_zoneSP", "description": "ZoneAirTempSetpoint" }, { "name": "L21S1_IU02_zoneTemp", "description": "ZoneAirT" }, { "name": "L21S1_IU02_HHWValve", "description": "ZoneHeatingCoilValveRatio" }, { "name": "L21S1_IU02_CHWValve", "description": "ZoneCoolingCoilValveRatio" }],
                "status": 1,
                "time": timed
            }, {
                "consequence": "Comfort issue",
                "description": "The terminal has achieved its maximum cooling capacity, but zone temperature stays higher than its setpoint, which may lead to an uncomfortable thermal environment. Please check the terminal as well as its setpoint.",
                "entityId": 27,
                "entityName": "L28_S2_Room",
                "entityParentName": "L28",
                "faultId": 2214,
                "grade": 2,
                "id": 57172,
                "name": "Cooling capacity fault",
                "points": [{ "description": "DAY.NGT(DAY-0 NGT-1)", "name": "L23S1_IU03_DAY.NGT" }, { "description": "ZoneAirTempSetpoint", "name": "L23S1_IU03_zoneSP" }, { "description": "ZoneAirT", "name": "L23S1_IU03_zoneTemp" }, { "description": "ZoneHeatingCoilValveRatio", "name": "L23S1_IU03_HHWValve" }, { "description": "ZoneCoolingCoilValveRatio", "name": "L23S1_IU03_CHWValve" }],
                "status": 1,
                "time": timee
            }];
            this.unbindStateOb();
            this.bindStateOb();
            this.update();
            this.attachEvents();
        }
        bindStateOb() {
            this.conditionModel.addEventListener('update',this.update,this);
        }
        unbindStateOb() {
            this.conditionModel.removeEventListener('update',this.update,this);
        }
        update(e, propName) {
            let forbiddenArr = ['update.activeEntities'];
            let forbiddenArr2 = ['update.activePoints'];
            if(forbiddenArr.indexOf(propName)>-1 || forbiddenArr2.indexOf(propName)>-1){
                return;
            }
            let entitiesIdArr = [];
            // 先使用293的数据 不和575的树交互
            this.conditionModel.activeAllEntities().forEach(v => {
                if (!v.isParent){
                    entitiesIdArr.push(v.name);
                }
            });
            this.getElecPrice(this.conditionModel.time(), entitiesIdArr);
        }
        getElecPrice(timeArr, entityIds) {
            var _this = this;
            var promise = $.Deferred();
            promise = WebAPI.post('/iot/search', { "parent": [], "projId": [this.projectId] }).done(function(result) { //AppConfig.projectId
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
                    _this.getData(timeArr, entityIds);
                });
            });
        }
        getData(timeArr, entityIds) {
            let _this = this;
            // let postData = {
            //     "projectId": this.projectId,
            //     "startTime": timeArr.startTime,
            //     "endTime": timeArr.endTime,
            //     "entityIds": entityIds,
            //     "keywords": "",
            //     "faultIds": [],
            //     "classNames": []
            // };
            // Spinner.spin(this.ctn);
            // WebAPI.post('/diagnosis_v2/getEntityFaults', postData).done(function (rs) {
            //     if (rs.status !== 'OK') {
            //         console.error('getEntityFaults faild!')
            //         return;
            //     }
            let dataList = [];
            let startTime = timeArr.startTime;
            let endTime = timeArr.endTime;
            for (let j = 0, jlength = this.temporaryData.length; j < jlength; j++){
                if (this.temporaryData[j].time > startTime && this.temporaryData[j].time < endTime && entityIds.indexOf(this.temporaryData[j].entityName) !== -1){
                    dataList.push(this.temporaryData[j]);
                }   
            }
            _this.store.faults = dataList;           
            var trDom = '';
            for (let i = 0, ilen = dataList.length; i < ilen; i++){
                let data = dataList[i];
                if (data.consequence === 'Comfort issue'){
                    let colorArr = ['#facc04', '#ea595c'];
                    let color,grade;
                    if (data.grade === 1){
                        color = colorArr[0];
                        grade = i18n_resource.faults.ALERT;
                    } else {
                        color = colorArr[1];
                        grade = i18n_resource.faults.FAULT;
                    }
                    trDom += `<tr data-id="${data.id}">
                                <td>${data.name}</td>
                                <td>${data.entityParentName}</td>
                                <td>${data.entityName}</td>
                                <td style="color:${color}">${grade}</td>
                                <td>${data.consequence}</td>
                            </tr>`;
                }
            }
            let headDom = `<tr>
                            <td>${I18n.resource.faults.FAULT_NAME}</td>
                            <td>${I18n.resource.faults.AREA}</td>
                            <td>${I18n.resource.faults.EQUIPMENT}</td>
                            <td>${I18n.resource.faults.FAULT_GRADE}</td>
                            <td>${I18n.resource.faults.CONSEQUENCE}</td>
                        </tr>`;
            let tableDom = `<table>
                            <thead>${headDom}</thead>
                            <tbody>${trDom}</tbody>
                        </table>`;
            _this.ctn.innerHTML = tableDom;
            // }).always(function(){
            //     Spinner.stop();
            // })
        }
        attachEvents() {
            let _this = this;
            let $ctn = $(_this.ctn);
            //点击单行
            $ctn.off('click.tr').on('click.tr', 'tbody tr', function () {
                $ctn.css({ height: 'calc(100% - 280px)' });
                $(_this.faultDetailPanelCtn).show();
                if ($(this).hasClass('selected')){
                    $(this).removeClass('selected');
                } else {
                    $(this).addClass('selected');
                }

                if (!_this.faultDetailPanel) {
                    _this.faultDetailPanel = new FaultDetailPanel(_this.faultDetailPanelCtn,_this);
                }
                // 获取当前选中的行
                let selectedIds = [];
                let $selectedRadio = $(_this.ctn).find('.selected').each(function (i, dom) {
                    selectedIds.push(parseInt(dom.dataset.id));
                });
                if (selectedIds.length === 0) {
                    return _this.faultDetailPanel && _this.faultDetailPanel.close();
                }
                _this.faultDetailPanel.show(_this.store.faults.filter(function (row) {
                    return selectedIds.indexOf(row.id) > -1;
                }));
            });
        }
        close() {
            if (this.faultDetailPanel) {
                this.faultDetailPanel.close();
                this.faultDetailPanel = null;
            }
            this.unbindStateOb();
        }
    }

    exports.AssociatedFault = AssociatedFault;
} ( namespace('thermalComfort.Pages'),namespace('thermalComfort.Other.FaultDetailPanel') ));
