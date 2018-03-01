/**
 * Created by RNBtech on 2015/5/20.
 */
var DiagnosisConfig = (function () {
    var _this;
    function DiagnosisConfig(parent) {
        this.parent = parent;
        _this = this;
        _this.case = [];
        /*this.data =
            [{buildId:'0',
            buildName:'build1',
                areaList:[{
                    areaId:'1',
                    areaName:'area1',
                    equipmentList:[{equipmentId:'0',equipmentName:'VAV1'},{equipmentId:'1',equipmentName:'VAV2'}]
                },
                {
                    areaId:'2',
                    areaName:'area2',
                    equipmentList:[{equipmentId:'2',equipmentName:'VAV2'},{equipmentId:'3',equipmentName:'VAV3'}]
                }]
            },
            {buildId:'2',
            buildName:'build1',
                areaList:[{
                    areaId:'3',
                    areaName:'area3',
                    equipmentList:[{equipmentId:'4',equipmentName:'VAV4'},{equipmentId:'5',equipmentName:'VAV5'}]
                },
                {
                    areaId:'4',
                    areaName:'area4',
                    equipmentList:[{equipmentId:'6',equipmentName:'VAV6'},{equipmentId:'7',equipmentName:'VAV7'}]
                }]
            }]*/
    };

    DiagnosisConfig.prototype = {
        show: function () {
            var _this = this;
            Spinner.spin(ElScreenContainer);

            $.get("/static/views/observer/diagnosis/diagnosisConfig.html").done(function (resultHtml) {
                var $dialog = $('#dialogModal');
                $dialog.find('#dialogContent').removeClass('modal-lg').html(resultHtml);

                $dialog.off('hidden.bs.modal').on('hidden.bs.modal', function (e) {
                    _this.close();
                    Spinner.stop();
                }).modal({});
                Spinner.spin($dialog.find('.modal-body')[0]);
                I18n.fillArea($('#dialogContent'));

                $('#autoPushWO').click(_this.showAutoPushWO);
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
                    _this.renderEditPane(e.currentTarget);
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
                sb.append('<td><input class="maskUserDefined" type="checkbox" disabled ').append(item.isUserDefined ? 'checked' : '').append('/></td>');
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
        },

        showAutoPushWO: function(){
            var $diagnosisConfig = $('#diagnosisConfig');
            var $diagnosisConfigPush = $('#diagnosisConfigPush');
            var $createCase = $('#createCase');
            var $caseList = $('#caseList');

            _this.initAutoPushWO($createCase,_this.parent.buildings);

            $caseList.on('click','.close',function(){
                $(this).parent().remove();
            });

            $createCase.on('click','.btnItem',_this.chooseValue);

            $createCase.children('.title').click(function(){
                $(this).next('.row').slideToggle();
                $(this).children('.glyphicon').toggleClass('glyphicon-plus-sign glyphicon-minus-sign')
            });

            $diagnosisConfig.hide();
            $diagnosisConfigPush.show();

            $('#confirmCreateCase').click(_this.createCase);
            $('#cancelCreateCase').click(function(){
                $diagnosisConfig.show();
                $diagnosisConfigPush.hide();
            });
        },

        initAutoPushWO: function($tab,data){
            var $buildList = $tab.find('#buildList'), $areaList = $tab.find('#areaList'), $equipmentList = $tab.find('#equipmentList');
            for(var i = 0; i < data.length; i++){
                var build = data[i];
                var $liBuild = $('<li class="grow notChosen"><span class="btnItem" id="'+ build.buildId +'">'+ build.buildName +'</span></li>');
                $buildList.append($liBuild)
                for(var j = 0; j < build.subBuilds.length; j++){
                    var area = build.subBuilds[j];
                    var $liArea = $('<li class="grow notChosen" parentId="'+ build.buildId +'" title="'+ build.buildName +'"><span class="btnItem" id="'+ area.subBuildId +'">'+ area.subBuildName +'</span></li>');
                    $areaList.append($liArea);
                    for(var k = 0; k < area.equipments.length; k++){
                        var equipment = area.equipments[k];
                        var $liEquipment = $('<li class="grow notChosen" parentId="'+ area.subBuildId +'" title="'+ area.subBuildName +'"><span class="btnItem" id="'+ equipment.equipmentId +'">'+ equipment.equipmentName +'</span></li>');
                        $equipmentList.append($liEquipment);
                    }
                }
            }
        },

        chooseValue: function(){
            var $li = $(this).parent('li');
            var $ul = $li.parent('ul');
            var urId = $ul.attr('id');
            var $buildList = $('#buildList');
            var $areaList = $('#areaList');

            if($li.hasClass('notChosen')){
                if(urId == 'buildList'){
                    $li.toggleClass('notChosen chosen');
                    dealWithSameLevel();
                }
                if(urId == 'areaList'){
                    var parentIds = getChosenParentIds($buildList);

                    if($li.hasClass('all')){
                        if($buildList.children('.all').hasClass('chosen')){
                            $li.toggleClass('notChosen chosen');
                            dealWithSameLevel();
                        }
                    }else if($.inArray($li.attr('parentId'),parentIds) > -1){
                        $li.toggleClass('notChosen chosen');
                        dealWithSameLevel();
                    }
                }
                if(urId == 'equipmentList'){
                    var parentIds = getChosenParentIds($areaList);

                    if($li.hasClass('all')){
                        if($areaList.children('.all').hasClass('chosen')){
                            $li.toggleClass('notChosen chosen');
                            dealWithSameLevel();
                        }
                    }else if($.inArray($li.attr('parentId'),parentIds) > -1){
                        $li.toggleClass('notChosen chosen');
                        dealWithSameLevel();
                    }
                }
            }else{
                if(urId == 'buildList'){
                    $li.toggleClass('notChosen chosen');
                    dealWithSameLevel();
                    dealWithChildLevel('build','area');
                }
                if(urId == 'areaList'){
                    $li.toggleClass('notChosen chosen');
                    dealWithSameLevel();
                    dealWithChildLevel('area','equipment');
                }
                if(urId == 'equipmentList'){
                    $li.toggleClass('notChosen chosen');
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
            function dealWithChildLevel(parent,children){
                var parentIds = [];
                $('#'+ parent +'List .chosen').not('.all').children('.btnItem').each(function(){
                    parentIds.push(this.id);
                });
                $('#'+ children +'List .chosen').each(function(){
                    var eqpId = $(this).attr('parentId');
                    if(eqpId){
                        if($.inArray(eqpId,parentIds) < 0){
                            $(this).children('.btnItem').click();
                            $(this).siblings('.all').removeClass('chosen').addClass('notChosen');
                        }
                    }
                });
            }
            function getChosenParentIds($obj){
                var idList = [];
                $obj.children('.chosen').not('.all').children('.btnItem').each(function(){
                    idList.push($(this).attr('id'));
                });
                return idList;
            }
        },

        createCase: function(){
            var $caseList = $('#caseList');
            var caseName = $('#caseName').val();
            var $projectId = $('#projectId');
            var $userId = $('#userId');


            var $close = $('<button type="button" class="close"><span>×</span> </button>');
            var $caseTab = $('<li class="caseTab"><a id="" data-toggle="tab" href="#'+ caseName +'">'+ caseName +'</a></li>').append($close);
            $caseList.append($caseTab);

            var curtCase = {
                id:'',
                name: $('#caseName').val(),
                buildings: _this.createBuildingData(),
                projectId: $projectId.val(),
                projectName: $projectId.find("option:selected").text(),
                userId:$userId.val(),
                userName: $userId.find("option:selected").text(),
                alarmLevel: $('#alarm').val()
            };
            _this.case.push(curtCase);
            _this.createCaseDom(curtCase);

        },

        createBuildingData: function(){
            var buildings = [];
            var index = 0;
            var $buildList = $('#buildList');
            var $areaList = $('#areaList');
            var $equipmentList = $('#equipmentList');

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

        createCaseDom: function(data){
            $.get("/static/views/observer/diagnosis/diagnosisConfigSet.html").done(function (resultHtml) {
                $('.tab-content').append(resultHtml);
                var $tab = $('.tab-pane:last-child');
                $tab.attr('id',data.name);
                I18n.fillArea($tab);
                _this.initAutoPushWO($tab ,data.buildings)
            });
        }
    }
    return DiagnosisConfig;
})();