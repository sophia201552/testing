var DiagnosisConfig = (function () {
    var _this;
    function DiagnosisConfig(parent) {
        this.parent = parent;
        _this = this;
        _this.orderList = [];
        _this.enableList =[];
        _this.limitList = [];
        _this.template = undefined;
    }

    DiagnosisConfig.prototype = {
        show: function () {
            var _this = this;

            WebAPI.get("/static/views/observer/diagnosis/diagnosisConfig.html").done(function (resultHtml) {
                var $dialog = $('#dialogModal');
                $dialog.find('#dialogContent').html(resultHtml);
                Spinner.spin($dialog.find('.modal-body')[0]);
                _this.template = $('#createCase')[0].outerHTML.replace(' active in','').replace('confirmCreateCase','confirmEditCase');

                $dialog.off('hidden.bs.modal').on('hidden.bs.modal', function (e) {
                    _this.close();
                    Spinner.stop();
                }).modal({});
                $dialog.on('click','.caseTab',function(){
                    _this.caseId = $(this).children('a')[0].id;
                });

                I18n.fillArea($('#dialogContent'));
                _this.bindEvent();
                _this.init();
            });
        },

        close: function () {

        },

        init:function(){
            _this.isInit = true;
            WebAPI.get('/diagnosis/config/get/'+ AppConfig.projectId).done(function(result){
                var rs = JSON.parse(result);
                if(rs.limit){
                    renderLimit(rs.limit)
                }
                if(rs.order){
                    renderOrder(rs.order)
                }
                if(rs.enable){
                    renderEnable(rs.enable)
                }
            }).always(function(){
                Spinner.stop();
            });
            _this.getGroupsMembers();
            function renderLimit(result){
                _this.limitList = result;
                if(!_this.limitList || _this.limitList.length < 1) return;

                for(var i = 0; i < _this.limitList.length; i++){
                    var item = _this.limitList[i];
                    var buildings = _this.createBuildingsFromDB(item.equipList)
                    var curtCase = {
                        id: item.id,
                        name: item.name,
                        notice: item.notice,
                        alert: item.alert,
                        fault: item.fault,
                        buildings: buildings
                    }
                    _this.createCaseDom(curtCase, 'limit')
                }
            }

            function renderOrder(result){
                _this.orderList = result;
                if(!_this.orderList || _this.orderList.length < 1) return;
                for(var i = 0; i < _this.orderList.length; i++){
                    var item = _this.orderList[i];
                    var buildings = _this.createBuildingsFromDB(item.equipList)
                    var curtCase = {
                        id: item.id,
                        name: item.name,
                        groupId: item.groupId,
                        operatorId: item.operatorId,
                        faultGrade: item.faultGrade,
                        buildings: buildings
                    }
                    _this.createCaseDom(curtCase, 'order')
                }
            }

            function renderEnable(result){
                _this.enableList = result;
                if(!_this.enableList || _this.enableList.length < 1) return;
                for(var i = 0; i < _this.enableList.length; i++){
                    var item = _this.enableList[i];
                    var buildings = _this.createBuildingsFromDB(item.equipList)
                    var curtCase = {
                        id: item.id,
                        name: item.name,
                        endTime: item.endTime,
                        buildings: buildings
                    }
                    _this.createCaseDom(curtCase, 'enable');
                }
            }
        },

        getGroupsMembers: function(){
            WebAPI.get('/diagnosis/getGroupsMembers/'+ AppConfig.userId).done(function(result){
                var data = JSON.parse(result);
                if(!data) return;
                var $group = $('#group');
                var $operatorId = $('#operatorId');
                _this.group = new Object();

                for(var i = 0; i < data.groups.length; i++){
                    var group = data.groups[i];
                    var $option = $('<option value="'+ group.id +'">'+ group.name +'</option>');
                    $group.append($option);
                    _this.group[group.id] = {id: group.id, name: group.name, member: []};
                    for(var j = 0; j < data.groupMembers[i].length; j++){
                        var member = data.groupMembers[i][j];
                        _this.group[group.id].member.push({id: member.userid, name: member.userfullname});
                    }
                }
                _this.groupHTML = $group[0].innerHTML;
                _this.operatorHTML = $operatorId[0].innerHTML;

                $group.change(function(){
                    var selectId = this.value;
                    _this.showSelectOption($operatorId,selectId);
                });

                var selectId = $group.children('option:first-child').attr('selected',true).val();
                _this.showSelectOption($operatorId,selectId);

            }).fail(function(result){
                alert(result.error);
            });
        },

        bindEvent:function(){
            $('#btnDiagnosisShow').click(_this.showDiagnosisShow);
            $('#btnAutoPushWO').click(_this.showAutoPushWO);
            $('#btnDiagnosisPause').click(_this.showDiagnosisPauseConfig);
            $('#btnAlarmRule').click(function (e) {
                new DiagnosisFaultConfig(_this.parent).show();
            });

            $('#limitCheckbox').change(function(){
                var enable = $(this).is(':checked') ? 1:0;
                WebAPI.get('/diagnosis/limit/enable/'+ AppConfig.projectId + '/' + enable).done(function(){

                }).fail(function(){

                });
            });
            $('#orderCheckbox').change(function(){
                var enable = $(this).is(':checked') ? 1:0;
                WebAPI.get('/diagnosis/order/enable/'+ AppConfig.projectId + '/' + enable).done(function(){

                }).fail(function(){

                });
            });
            $('#enableCheckbox').change(function(){
                var enable = $(this).is(':checked') ? 1:0;
                WebAPI.get('/diagnosis/enable/enable/'+ AppConfig.projectId + '/' + enable).done(function(){

                }).fail(function(){

                });
            });
        },

        showSelectOption: function($operator, selectId){
            $operator[0].options.length =0;
            for(var i in _this.group[selectId].member) {
                var member = _this.group[selectId].member[i];
                $operator[0].options.add(new Option(member.name,member.id));
            }
        },

        createBuildingsFromDB:function(equipList){
            var arr = equipList.toString().split(',');
            var buildingDict = {};
            var subBuildingDict = {};
            var equipmentDict = {};

            if(arr.length < 1) return;
            var dict = _this.parent;
            for(var i = 0; i < arr.length; i++){
                var zone = dict.dictZone[dict.dictEquipment[arr[i]].zoneId];
                var building = {buildingId: zone.buildingId, buildingName: zone.buildingName};
                var subBuilding = {subBuildingId: zone.subBuildingId, subBuildingName: zone.subBuildingName};
                var equipment = {equipmentId: arr[i], equipmentName: dict.dictEquipment[arr[i]].name};

                if(!buildingDict[zone.buildingId]){
                    buildingDict[zone.buildingId] = building;
                }

                if(!subBuildingDict[zone.subBuildingId]){
                    subBuildingDict[zone.subBuildingId] = subBuilding;
                }

                if(!equipmentDict[equipment.equipmentId]){
                    equipmentDict[arr[i]] = equipment;
                }
            }
            return {buildingDict: buildingDict, subBuildingDict: subBuildingDict, equipmentDict: equipmentDict};
        },

        showSetPane: function(){
            var $tabPane = $('#createCase');
            var $diagnosisConfig = $('#diagnosisConfig');
            var $commonPane = $('.commonPane');
            if(_this.isInit){
                var $caseList = $tabPane.find('#caseList');
                _this.initBuildingConfig($tabPane,_this.parent.buildings);
                _this.isInit = false;
                $caseList.on('click','.close',function(){
                    _this.removeFromCaseList();
                });

                $tabPane.off('click').on('click','.btnItem',function(){
                    _this.chooseValue($tabPane,this);
                });

                $tabPane.children('.title').click(function(){
                    $(this).next('.row').slideToggle();
                    $(this).children('.glyphicon').toggleClass('glyphicon-plus-sign glyphicon-minus-sign')
                });

                $commonPane.on('click','#confirmCreateCase',function(){
                    _this.createCase($tabPane);
                });

                $commonPane.on('click','.cancelCreateCase',function(){
                    $diagnosisConfig.show();
                    $commonPane.hide();
                });

                $commonPane.on('click','#btnCreateCase',function(){
                    var $createCase = $('#createCase');
                    $createCase.find('.chosen').addClass('notChosen').removeClass('chosen');
                    $createCase.find('#caseName').val('');
                    $('#createCase input').val('');

                });
            }else{
                $tabPane.find('.chosen').addClass('notChosen').removeClass('chosen');
            }
            $diagnosisConfig.hide();
            $commonPane.show();
        },

        removeFromCaseList: function(){

            var $a = $(this).prev('a');
            var targetName = $a.attr('href').replace('#','');
            var id = $a.attr('id');

            var $dialog = $('#dialogModal');
            Spinner.spin($dialog.find('.commonPane')[0]);

            var curtPaneId = $('.commonPane').attr('id');
            if(curtPaneId == 'diagShow'){
                WebAPI.get('/diagnosis/limit/delete/'+ AppConfig.projectId +'/'+ id).done(function(){
                    removeDom('limit');
                }).fail(function(){

                }).always(function(){
                    Spinner.stop();
                });
            }else if(curtPaneId == 'WOPush'){
                WebAPI.get('/diagnosis/order/delete/'+ AppConfig.projectId +'/'+ id).done(function(){
                    removeDom('order');
                }).fail(function(){

                }).always(function(){
                    Spinner.stop();
                });
            } else if(curtPaneId == 'diagPause'){
                WebAPI.get('/diagnosis/enable/delete/'+ AppConfig.projectId +'/'+ id).done(function(){
                    removeDom('enable');
                }).fail(function(){

                }).always(function(){
                    Spinner.stop();
                });
            }
            function removeDom(str){
                $a.parent('li').remove();
                $('.tab-content').find('#'+targetName).remove();
                $('#'+ str +'Nav').find('#btnCreateCase').click();
            }
        },


        initBuildingConfig: function($tab,data){
            var $buildList = $tab.find('#buildList'), $areaList = $tab.find('#areaList'), $equipmentList = $tab.find('#equipmentList');
            for(var i = 0; i < data.length; i++){
                var build = data[i];
                var $liBuild = $('<li class="grow notChosen"><span class="btnItem enabled" id="'+ build.buildId +'">'+ build.buildName +'</span></li>');
                $buildList.append($liBuild)
                for(var j = 0; j < build.subBuilds.length; j++){
                    var area = build.subBuilds[j];
                    var $liArea = $('<li class="grow notChosen" parentId="'+ build.buildId +'" title="'+ build.buildName +'"><span class="btnItem disabled" id="'+ area.subBuildId +'" style="background:'+ echarts.config.color[j] +'">'+ area.subBuildName +'</span></li>');
                    $areaList.append($liArea);
                    for(var k = 0; k < area.equipments.length; k++){
                        var equipment = area.equipments[k];
                        var $liEquipment = $('<li class="grow notChosen" parentId="'+ area.subBuildId +'" title="'+ area.subBuildName +'"><span class="btnItem disabled" id="'+ equipment.equipmentId +'" style="background:'+ echarts.config.color[j] +'">'+ equipment.equipmentName +'</span></li>');
                        $equipmentList.append($liEquipment);
                    }
                }
            }
        },

        chooseValue: function($tabPane,target){
            var $li = $(target).parent('li');
            var $ul = $li.parent('ul');
            var urId = $ul.attr('id');

            var $buildList = $tabPane.find('#buildList');
            var $areaList = $tabPane.find('#areaList');

            if($li.hasClass('notChosen')){
                if(urId == 'buildList'){
                    $li.removeClass('notChosen').addClass('chosen');
                    dealWithSameLevel();
                    dealWithChildLevelAbleStatus('build','area');
                }
                if(urId == 'areaList'){
                    var parentIds = getChosenParentIds($buildList);

                    if($li.hasClass('all')){
                        //if($buildList.children('.all').hasClass('chosen')){
                            $li.removeClass('notChosen').addClass('chosen');
                            dealWithSameLevel();
                            dealWithChildLevelAbleStatus('area','equipment');
                        //}
                    }else if($.inArray($li.attr('parentId'),parentIds) > -1){
                        $li.removeClass('notChosen').addClass('chosen');
                        dealWithSameLevel();
                        dealWithChildLevelAbleStatus('area','equipment');
                    }
                }
                if(urId == 'equipmentList'){
                    var parentIds = getChosenParentIds($areaList);

                    if($li.hasClass('all')){
                        if($areaList.children('.all').hasClass('chosen')){
                            $li.removeClass('notChosen').addClass('chosen');
                            dealWithSameLevel();
                        }
                    }else if($.inArray($li.attr('parentId'),parentIds) > -1){
                        $li.removeClass('notChosen').addClass('chosen');
                        dealWithSameLevel();
                    }
                }
            }else{
                if(urId == 'buildList'){
                    $li.removeClass('chosen').addClass('notChosen');
                    dealWithSameLevel();
                    dealWithChildLevelToNotChosen('build','area');
                    dealWithChildLevelAbleStatus('build','area');
                }
                if(urId == 'areaList'){
                    $li.removeClass('chosen').addClass('notChosen');
                    dealWithSameLevel();
                    dealWithChildLevelToNotChosen('area','equipment');
                    dealWithChildLevelAbleStatus('area','equipment');
                }
                if(urId == 'equipmentList'){
                    $li.removeClass('chosen').addClass('notChosen');
                    dealWithSameLevel();
                }
            }

            function dealWithSameLevel(){
                var classList = $li[0].classList;
                if($li.hasClass('all')){
                    if(classList.contains('chosen')){
                        $li.siblings('li').removeClass('notChosen').addClass('chosen');
                    }else{
                        $li.siblings('li').removeClass('chosen').addClass('notChosen');
                    }
                }else{
                    if($ul.find('.chosen').not('.all').length < $ul.find('li').length -1){
                        $li.siblings('.all').removeClass('chosen').addClass('notChosen');
                    }else{
                        $li.siblings('li').removeClass('notChosen').addClass('chosen');
                    }
                }
            }
            function dealWithChildLevelToNotChosen(parent,children){
                var parentIds = [];
                $tabPane.find('#'+ parent +'List .chosen').not('.all').children('.btnItem').each(function(){
                    parentIds.push(this.id);
                });
                $tabPane.find('#'+ children +'List .chosen').each(function(){
                    var eqpId = $(this).attr('parentId');
                    if(eqpId){
                        if($.inArray(eqpId,parentIds) < 0){
                            $(this).children('.btnItem').click();
                            $(this).siblings('.all').removeClass('chosen').addClass('notChosen');
                        }
                    }
                });
            }
            function dealWithChildLevelAbleStatus(parent,children){
                var parentIds = [];
                var $children = $tabPane.find('#'+ children +'List').children().not('.all');
                $tabPane.find('#'+ parent +'List .chosen').not('.all').children('.btnItem').each(function(){
                    parentIds.push(this.id);
                });
                $children.each(function(){
                    var eqpId = $(this).attr('parentId');
                    if(eqpId){
                        if($.inArray(eqpId,parentIds) < 0){
                            $(this).children('.btnItem').addClass('disabled').removeClass('enabled');

                        }else{
                            $(this).children('.btnItem').addClass('enabled').removeClass('disabled');
                        }
                        $(this).click();
                    }
                });

                var childrenCount = $children.length;
                var enabledCount = $children.children('.enabled').length;
                var $all = $tabPane.find('#'+ children +'List').children('.all');
                if(childrenCount == enabledCount){
                    $all.children('.btnItem').addClass('enabled').removeClass('disabled');
                }else{
                    $all.children('.btnItem').addClass('disabled').removeClass('enabled');
                }
            }
            function getChosenParentIds($obj){
                var idList = [];
                $obj.children('.chosen').not('.all').children('.btnItem').each(function(){
                    idList.push($(this).attr('id'));
                });
                return idList;
            }
        },

        createCase: function($tabPane){
            var caseName = $tabPane.find('#caseName').val();
            _this.operateCaseList($tabPane);

            $tabPane.find('#confirmCreateSave').click(function(){
                var $tabPane = $(this).closest('.tab-pane');
                var curtPaneId = $('.commonPane').attr('id');
                if(curtPaneId == 'btnDiagnosisShow'){

                }else if(curtPaneId == 'btnAutoPushWO'){
                    var id = $('.caseTab.active a').attr('id');
                    var caseName = $tabPane.find('#caseName');
                    var buildings = _this.createBuildingData($tabPane);
                    var $projectId = $tabPane.find('#projectId');
                    var $userId = $tabPane.find('#userId');

                    var curtCase = {
                        id: id,
                        name: caseName,
                        buildings: buildings,
                        projectId: $projectId.val(),
                        projectName: $projectId.find("option:selected").text(),
                        userId:$userId.val(),
                        userName: $userId.find("option:selected").text(),
                        alarmLevel: $('#alarm').val()
                    }
                    for(var i = 0; i < _this.orderList.length; i++){
                        if(curtCase.id == id){
                            _this.orderList[i] = curtCase;
                        }
                    }
                } else if(curtPaneId == 'btnDiagnosisPause'){

                }


            });

        },

        operateCaseList: function($tabPane){
            var equipList = _this.getChosenEquipList($tabPane);
            if(equipList.length < 1){
                alert(I18n.resource.diagnosis.config.subConfig.MUST_CHOOSE_EQUIP);
                return;
            }
            if(!_this.checkRequire()) return;

            var curtPaneId = $('.commonPane').attr('id');
            var caseName = $tabPane.find('#caseName').val();
            var curtCase = new Object();

            var $dialog = $('#dialogModal');

            if(curtPaneId == 'diagShow'){
                curtCase = {
                    name: caseName,
                    equipList: equipList,
                    fault: $tabPane.find('#warning').val(),
                    alert: $tabPane.find('#alert').val(),
                    notice: $tabPane.find('#normal').val(),
                    project: AppConfig.projectId,
                    enabled: 1
                };
                Spinner.spin($dialog.find('.commonPane')[0]);
                WebAPI.post('/diagnosis/limit/add/' + AppConfig.projectId, curtCase).done(function (result) {
                    curtCase.buildings = _this.createBuildingsFromDB(equipList);
                    curtCase.id = result;
                    _this.createCaseDom(curtCase, 'limit')
                }).error(function (result) {
                    alert(result.error);
                }).always(function(){
                    Spinner.stop()
                });

            }else if(curtPaneId == 'WOPush'){
                curtCase = {
                    name: caseName,
                    operatorId: $tabPane.find('#operatorId').val(),
                    group: $tabPane.find('#group').val(),
                    equipList: equipList,
                    faultGrade: $tabPane.find('#alarm').val(),
                    project: AppConfig.projectId,
                    enable: 1
                };
                Spinner.spin($dialog.find('.commonPane')[0]);
                WebAPI.post('/diagnosis/order/add/' + AppConfig.projectId, curtCase).done(function (result) {
                    curtCase.buildings = _this.createBuildingsFromDB(equipList);
                    curtCase.id = result;
                    _this.createCaseDom(curtCase, 'order')
                }).error(function (result) {
                    alert(result.error);
                }).always(function(){
                    Spinner.stop()
                });

            } else if(curtPaneId == 'diagPause'){
                curtCase = {
                    name: caseName,
                    endTime: $tabPane.find('.form-datetime').val(),
                    equipList: equipList,
                    project: AppConfig.projectId,
                    enable: 1
                };
                _this.enableList.push(curtCase);
                Spinner.spin($dialog.find('.commonPane')[0]);
                WebAPI.post('/diagnosis/enable/add/' + AppConfig.projectId,curtCase).done(function(result){
                    curtCase.buildings = _this.createBuildingsFromDB(equipList);
                    curtCase.id = result;
                    _this.createCaseDom(curtCase, 'enable')
                }).fail(function(result){
                    alert(result.error);
                }).always(function(){
                    Spinner.stop()
                });
            }
            return curtCase;
        },

        checkRequire:function(){
            var flag = true;
            $('.tab-pane.fade.active.in :input').not(':hidden').each(function(){
                if(this.type != 'button'){
                    var val = $(this).val();
                    if(val == undefined || $.trim(val) == ''){
                        alert(I18n.resource.diagnosis.config.subConfig.MUST_FILL_IN);
                        flag = false;
                        return flag;
                    }
                }
            });
            return flag;
        },

        createBuildingData: function($tabPane){
            var buildings = [];
            var index = 0;
            var $buildList = $tabPane.find('#buildList');
            var $areaList = $tabPane.find('#areaList');
            var $equipmentList = $tabPane.find('#equipmentList');

            $buildList.children('.chosen').not('.all').each(function(){
                var $btnItem = $(this).children('.btnItem');
                var building = {
                    buildId: $btnItem[0].id,
                    buildName: $btnItem[0].innerHTML,
                    subBuilds: []
                }
                $areaList.children('.chosen').not('.all').each(function(){
                    var parentId = $(this).attr('parentId');
                    if($btnItem[0].id == parentId){

                        var $btnItemSub = $(this).children('.btnItem');
                        var subBuilding = {
                            subBuildId: $btnItemSub[0].id,
                            subBuildName: $btnItemSub[0].innerHTML,
                            equipments: []
                        }
                        building.subBuilds.push(subBuilding);

                        $equipmentList.children('.chosen').not('.all').each(function(){
                            var parentId = $(this).attr('parentId');
                            if($btnItemSub[0].id == parentId) {
                                var $btnItemEqpmt = $(this).children('.btnItem');
                                var equipment = {
                                    equipmentId: $btnItemEqpmt[0].id,
                                    equipmentName: $btnItemEqpmt[0].innerHTML
                                }
                                building.subBuilds[index].equipments.push(equipment);
                            }
                        });
                        index++;
                    }

                });
                buildings.push(building);
            });
            return buildings;
        },

        getChosenEquipList: function($tabPane){
            var equipList = '';
            $tabPane.find('#equipmentList').children('.chosen').not('.all').children('.btnItem').each(function(){
                equipList += (this.id + ',');
            });
            return equipList.substring(0, equipList.length-1);
        },

        createCaseDom: function(data,type){
            $('.tab-content').append(_this.template);
            var $tabPane = $('.tab-pane:last-child');
            $tabPane.attr('id',data.name+data.id);
            $tabPane.find('#confirmEditCase').click(function(){
                _this.updateCase($tabPane);
            });
            I18n.fillArea($tabPane);

            _this.initBuildingConfig($tabPane ,_this.parent.buildings);
            _this.signChosenItem($tabPane ,data.buildings);
            _this.createTabNavItem(data,type);

            $tabPane.off('click').on('click','.btnItem',function(){
                _this.chooseValue($tabPane,this);
            });
            $tabPane.children('.title').click(function(){
                $(this).next('.row').slideToggle();
                $(this).children('.glyphicon').toggleClass('glyphicon-plus-sign glyphicon-minus-sign')
            });

            if(type == 'limit'){
                $tabPane.find('#normal').val(data.notice);
                $tabPane.find('#alert').val(data.alert);
                $tabPane.find('#warning').val(data.fault);
            }else if(type == 'order'){
                var $operator = $tabPane.find('#operatorId');

                $tabPane.find('#group').html(_this.groupHTML)
                    .change(function(){
                        var selectId = this.value;
                        _this.showSelectOption($operator,selectId);
                    });

                $operator.html(_this.operatorHTML);

                $tabPane.find('#group option').each(function(){
                    if(this.value == data.groupId){
                        $(this).siblings().attr('selected',false);
                        $(this).attr('selected',true);
                        _this.showSelectOption($operator,this.value);
                    }
                });
                $operator.children('option').each(function(){
                    if(this.value == data.operatorId){
                        $(this).siblings().attr('selected',false);
                        $(this).attr('selected',true);
                    }
                });
                $tabPane.find('#alarm option').each(function(){
                    if(this.value == data.faultGrade){
                        $(this).siblings().attr('selected',false);
                        $(this).attr('selected',true);
                    }
                });
            }else if(type == 'enable'){
                $tabPane.find('.form-datetime').val(data.endTime);
            }
        },

        updateCase: function($tab){
            var curtPaneId = $('.commonPane').attr('id');
            var curtCase = new Object();
            var caseName = $tab.find('#caseName').val();
            var equipList = _this.getChosenEquipList($tab);

            var $dialog = $('#dialogModal');
            Spinner.spin($dialog.find('.commonPane')[0]);

            $tab.find('#caseName').val(caseName);
            $('.caseTab.active a').text(caseName)
            if(curtPaneId == 'WOPush'){
                curtCase = {
                    name: caseName,
                    operatorId: $tab.find('#operatorId').val(),
                    group: $tab.find('#group').val(),
                    equipList: equipList,
                    faultGrade: $tab.find('#alarm').val(),
                    project: AppConfig.projectId,
                    enable: 1
                };
                WebAPI.post('/diagnosis/order/update/'+ AppConfig.projectId +'/' + _this.caseId,curtCase).done(function(result){

                }).fail(function(){
                    alert(I18n.diagnosis.config.subConfig.UPDATE_FAIL);
                }).always(function(){
                    Spinner.stop();
                });
            }else if(curtPaneId == 'diagPause'){
                curtCase = {
                    name: caseName,
                    endTime: $tab.find('.form-datetime').val(),
                    equipList: equipList,
                    project: AppConfig.projectId,
                    enable: 1
                };
                WebAPI.post('/diagnosis/enable/update/'+ AppConfig.projectId +'/' + _this.caseId,curtCase).done(function(result){

                }).fail(function(){
                    alert(I18n.diagnosis.config.subConfig.UPDATE_FAIL);
                }).always(function(){
                    Spinner.stop();
                });
            } else if(curtPaneId == 'diagShow'){
                curtCase = {
                    name: caseName,
                    equipList: equipList,
                    fault: $tab.find('#warning').val(),
                    alert: $tab.find('#alert').val(),
                    notice: $tab.find('#normal').val(),
                    project: AppConfig.projectId,
                    enable: 1
                };
                WebAPI.post('/diagnosis/limit/update/'+ AppConfig.projectId +'/' + _this.caseId,curtCase).done(function(result){

                }).fail(function(){
                    alert(I18n.diagnosis.config.subConfig.UPDATE_FAIL);
                }).always(function(){
                    Spinner.stop();
                });
            }
        },

        createTabNavItem: function(data,type){

            var $caseNav = $('#'+ type +'Nav');

            var $close = $('<button type="button" class="close"><span>×</span> </button>').click(_this.removeFromCaseList);
            var $caseTab = $('<li class="caseTab"><a id="' + data.id +'" data-toggle="tab" href="#'+ data.name+data.id +'">'+ data.name +'</a></li>').append($close);
            $caseNav.append($caseTab);

            $caseTab.children('a').click(function(){
                $('#'+ data.name + data.id).find('#caseName').val(data.name);
                _this.showRelative();
            });
        },

        signChosenItem: function($tab,buildings){
            var $buildList = $tab.find('#buildList');
            var $areaList = $tab.find('#areaList');
            var $equipmentList = $tab.find('#equipmentList');

            var chosenBuildingIds = [];
            var chosenAreaIds = [];

            for(var i in buildings.buildingDict){
                var building = buildings.buildingDict[i];
                $buildList.children('.notChosen').not('.all').children('.btnItem').each(function(){
                    if(this.id == building.buildingId){
                        $(this).parent().removeClass('notChosen').addClass('chosen');
                        chosenBuildingIds.push(this.id)
                    }
                });
            }
            _this.setBtnAllStatus($buildList);

            for(var j in buildings.subBuildingDict){
                var subBuilding = buildings.subBuildingDict[j];
                $areaList.children('.notChosen').not('.all').children('.btnItem').each(function(){
                    var $li = $(this).parent('li');
                    var parentId = $li.attr('parentId');
                    if(this.id == subBuilding.subBuildingId){
                        $(this).parent().removeClass('notChosen').addClass('chosen');
                        chosenAreaIds.push(this.id)
                    }
                    if($.inArray(parentId,chosenBuildingIds) > -1){
                        $(this).addClass('enable').removeClass('disabled');
                    }
                });
            }
            _this.setBtnAllStatus($areaList);

            for(var k in buildings.equipmentDict){
                var equipment = buildings.equipmentDict[k];
                $equipmentList.children('.notChosen').not('.all').children('.btnItem').each(function(){
                    var $li = $(this).parent('li');
                    var parentId = $li.attr('parentId');
                    if(this.id == equipment.equipmentId){
                        $(this).parent().removeClass('notChosen').addClass('chosen');
                    }
                    if($.inArray(parentId,chosenAreaIds) > -1){
                        $(this).addClass('enabled').removeClass('disabled');
                    }
                });
            }
            _this.setBtnAllStatus($equipmentList);
        },

        setBtnAllStatus:function($buildList){
            var $lis = $buildList.children('li').not('.all');
            var $all = $buildList.children('.all');
            var liCount = $lis.length;
            var enableCount = $lis.children('.btnItem').length;
            //enable
            if(liCount == enableCount){
                $all.children('.btnItem').addClass('enabled').removeClass('disabled');
            }else{
                $all.children('.btnItem').addClass('disabled').removeClass('enable');
            }
            //chosen
            var chosenCount = $buildList.children('.chosen').length;
            if(chosenCount == $lis.length){
                $all.addClass('chosen').removeClass('notChosen');
            }else{
                $all.addClass('notChosen').removeClass('chosen');
            }
        },

        showAutoPushWO: function(){
            $('.caseNav').hide();
            $('#orderNav').show();
            var $commonPane = $('.commonPane').attr('id','WOPush');//.find('.modal-title').attr('i18n','diagnosis.config.push.TITLE');
            I18n.fillArea($commonPane);
            _this.showSetPane();
            _this.showRelative();
        },

        showDiagnosisPauseConfig: function(){
            $('.caseNav').hide();
            $('#enableNav').show();

            var $commonPane = $('.commonPane').attr('id','diagPause');//.find('.modal-title').attr('i18n','diagnosis.config.diagPause.TITLE');
            I18n.fillArea($commonPane);
            _this.showSetPane();

            $('.form-datetime').datetimepicker({
                autoclose: true,
                todayBtn: true,
                initialDate: new Date(),
                startDate: new Date()
            });
            _this.showRelative()
        },

        showDiagnosisShow: function(){
            $('.caseNav').hide();
            $('#limitNav').show();
            var $commonPane = $('.commonPane').attr('id','diagShow');//.find('.modal-title').attr('i18n','diagnosis.config.diagShow.TITLE');
            I18n.fillArea($commonPane);
            _this.showSetPane();
            _this.showRelative();
        },

        showRelative: function(id){
            $('.row.option').hide().next('.list').hide();
            var curtPaneId = $('.commonPane').attr('id');
            if(curtPaneId == 'WOPush'){
                $('.order').show().next('.list').show();
            }else if(curtPaneId == 'diagPause'){
                $('.enable').show().next('.list').show();
            } else if(curtPaneId == 'diagShow'){
                $('.limit').show().next('.list').show();
            }
        }
    }
    return DiagnosisConfig;
})();

var DiagnosisFaultConfig = (function () {
    function DiagnosisFaultConfig(parent) {
        this.parent = parent;
    };

    DiagnosisFaultConfig.prototype = {
        show: function () {
            var _this = this;
            Spinner.spin(ElScreenContainer);

            WebAPI.get("/static/views/observer/diagnosis/paneFaultConfiguration.html").done(function (resultHtml) {
                var dialog = $('#dialogModal');
                dialog.find('#dialogContent').html(resultHtml);
                $('#dialogContent .modal-content').css('height', document.body.scrollHeight - 100);

                dialog.off('hidden.bs.modal').on('hidden.bs.modal', function (e) {
                    _this.close();
                    ScreenModal = null;
                    Spinner.stop();
                }).modal({});
                Spinner.spin(dialog.find('.modal-body')[0]);

                _this.init();
            });
        },

        close: function () {

        },

        init: function () {
            var _this = this;
            var tbody = document.createElement('tbody');

            var tr, td, item, sb;

            for (var id in this.parent.dictFault) {
                item = this.parent.dictFault[id];

                tr = document.createElement('tr');
                tr.id = 'config-fault-' + id;
                tr.onclick = function (e) {
                    //_this.renderEditPane(e.currentTarget);
                };


                sb = new StringBuilder();
                switch (item.defaultGrade) {
                    case 0: sb.append('<td><span class="badge" style="background-color: #5bc0de;" title="Grade">Normal</span></td>'); break;
                    case 1: sb.append('<td><span class="badge" style="background-color: #f0ad4e;" title="Grade">Alert</span></td>'); break;
                    case 2: sb.append('<td><span class="badge" style="background-color: #d9534f;" title="Grade">Fault</span></td>'); break;
                    default: break;
                }
                sb.append('<td>').append(item.name).append('</td>');
                sb.append('<td>').append(this.parent.dictEquipment[item.equipmentId].name).append('</td>');
                sb.append('<td>').append(item.description).append('</td>');
                //sb.append('<td><input class="maskUserDefined" type="checkbox" disabled ').append(item.isUserDefined ? 'checked' : '').append('/></td>');
                sb.append('<td>').append(item.userName).append('</td>');
                sb.append(this.getFaultStatus(item));

                tr.innerHTML = sb.toString();
                tbody.appendChild(tr);
            }
            $('#tableListFaults').find('tbody').remove();
            $('#tableListFaults').append(tbody);
            Spinner.stop();
        },

        //TODO
        renderEditPane: function (element) {
            var _this = this;
            var id = element.id.replace('config-fault-', '');
            var fault = this.parent.dictFault[id];
            var rowIndex = element.sectionRowIndex;

            if (document.getElementById('paneFaultEdit-' + id)) return;
            element.style.backgroundColor = 'rgb(180, 221, 221)';

            //active checkbox
            $(element).find('input').removeAttr("disabled");

            var tr = document.getElementById('tableListFaults').getElementsByTagName('tbody')[0].insertRow(rowIndex + 1);
            tr.id = 'paneFaultEdit-' + id;

            var td = document.createElement('td');
            td.colSpan = 7;
            td.style.backgroundColor = 'rgb(180, 221, 221)';

            var sb = new StringBuilder();
            sb.append('<span style="float: left; padding: 7px; margin-left: 5px; margin-right: 5px;">UserGrade:</span>');
            var optionContent = 'value="' + fault.userFaultGrade + '"';
            sb.append('<select class="form-control markGrade" style="width: 120px; float: left;"><option value="0">Normal</option><option value="1">Alert</option><option value="2">Fault</option></select>'.replace(optionContent, optionContent + " selected"));
            sb.append('<span style="float: left; padding: 7px; margin-left: 10px; margin-right: 5px;">Advaced:</span>');
            optionContent = 'value="' + fault.userFaultDelay + '"'
            sb.append('<select class="form-control markAdvanced" style="width: 160px; float: left;">\
                        <option value="0">Real-time</option>\
                        <option value="3600">Delay 1 hour</option>\
                        <option value="43200">Delay 12 hours</option>\
                        <option value="86400">Delay 24 hours</option>\
                        <option value="604800">Delay 7 days</option>\
                        <option value="2419200">Delay 1 month</option>\
                        <option value="-1">Disable this fault</option>\
                        </select>'.replace(optionContent, optionContent + ' selected'));
            td.innerHTML = sb.toString();


            var btnAccept = document.createElement('button');
            btnAccept.className = "btn btn-primary";
            btnAccept.textContent = 'Accept';
            btnAccept.style.cssFloat = 'right';
            btnAccept.style.marginRight = '5px';
            btnAccept.onclick = function (e) {
                var faultId = e.currentTarget.parentElement.parentElement.id.replace('paneFaultEdit-', '');

                var data = {
                    id: faultId,
                    userId: AppConfig.userId,
                    isUserDefined: document.getElementById('config-fault-' + faultId).getElementsByClassName('maskUserDefined')[0].checked,
                    userFaultGrade: e.currentTarget.parentElement.getElementsByClassName('markGrade')[0].value,
                    userFaultDelay: e.currentTarget.parentElement.getElementsByClassName('markAdvanced')[0].value
                };

                WebAPI.post('/diagnosis/fault/customUpdate/' + AppConfig.projectId, data).done(function (result) {
                    if (result != 'true') new Alert(e.currentTarget.parentElement, 'warning', 'Refused modify')

                    var fault = _this.parent.dictFault[faultId];
                    fault.userFaultGrade = data.userFaultGrade;
                    fault.userFaultDelay = data.userFaultDelay;
                    fault.isUserDefined = data.isUserDefined;
                    fault.userId = data.userId;
                    fault.userName = AppConfig.account;
                    _this.init();
                });
            };

            var btnCancel = document.createElement('button');
            btnCancel.className = "btn btn-default";
            btnCancel.textContent = 'Cancel';
            btnCancel.style.cssFloat = 'right';
            btnCancel.style.marginRight = '5px';
            btnCancel.onclick = function (e) {
                _this.init();
            };

            td.appendChild(btnCancel);
            td.appendChild(btnAccept);
            tr.appendChild(td);
        },

        getFaultStatus: function (fault) {
            if (fault.isUserDefined) {
                if (fault.userFaultDelay == -1) return 'Disable';
                if (fault.userFaultDelay == 0) return 'Real-time';

                var remain = fault.userFaultDelay * 1000 - (new Date() - new Date(fault.userModifyTime * 1000));
                if (remain > 0) {
                    var remain = new Date(remain);
                    var sb = new StringBuilder();
                    sb.append('<td title="Remaining ')
                        .append(remain.getDay() ? remain.getDay() + 'Day ' : '')
                        .append(remain.getHours() ? remain.getHours() + 'Hour ' : '')
                        .append(remain.getMinutes() ? remain.getMinutes() + 'Min ' : '')
                        .append('">')

                        .append(remain.getDay() ? remain.getDay() + 'D_' : '')
                        .append(remain.getHours() ? remain.getHours() + ':' : '')
                        .append(remain.getMinutes() ? remain.getMinutes() : '')
                        .append('</td>');

                    return sb.toString();
                }
                else {
                    return 'Real-time';
                }
            }
            else {
                return 'Real-time';
            }
        }
    }
    return DiagnosisFaultConfig;
})();