/// <reference path="../lib/jquery-1.11.1.min.js" />
/// <reference path="../core/common.js" />
var DiagnosisScreen = (function () {
    var _this = undefined;
    function DiagnosisScreen() {
        this.dictZone = undefined;
        this.dictEquipment = undefined;
        this.dictFault = undefined;
        this.arrLastNotice = undefined;

        this.workerUpdate = undefined;
        this.floorCount = 0;
        this.dialog = undefined;
        this.lang = I18n.resource.diagnosis;
        this.langCfg = this.lang.config;
        this.faId = 0;
        this.faUserId = 0;

        this.obScreen = undefined;
        this.$obContainer = undefined;
        this.urgentCount = 0;
        this.criticalCount = 0;
        _this = this;
    }

    DiagnosisScreen.prototype = {
        show: function () {
            var _this = this;
            Spinner.spin(ElScreenContainer);

            $.get("/static/views/observer/diagnosisScreen.html").done(function (resultHtml) {
                $(ElScreenContainer).html(resultHtml);
                _this.logCtWidth = parseInt($('#diagnosisLogCt')[0].classList[0].split('-')[2]);
                I18n.fillArea($(ElScreenContainer));
                Spinner.spin(ElScreenContainer);
                _this.init();
            });
        },

        close: function () {
            this.dictZone = null;
            this.dictEquipment = null;
            this.dictFault = null;
            this.arrLastNotice = null;
            this.floorCount = null;
            if (this.workerUpdate) this.workerUpdate.terminate();
            this.workerUpdate = null;
            if (this.dialog) this.dialog.close();
            if (this.obScreen) this.obScreen.close();

            if (ToolCurrent) ToolCurrent.close();
        },

        init: function () {
            var side = new SidebarMenuEffect();
            side.init('#divCanvas');
            this.$obContainer = $('#obContainer');

            var _this = this;
            WebAPI.get('/diagnosis/getAll/' + AppConfig.projectId).done(function (result) {
                _this.initData(JSON.parse(result));
                // _this.initPaneBuilding();
                _this.initPaneNav();
                _this.initWorkerForUpdating();
                // 加载默认楼层
                $('.div-nav-row', '#paneIcon').eq(0).children('span:first').trigger('click');
            });

            $("#btnNoticeHistory").click(function (e) {
                ScreenModal = new DiagnosisHistory(_this);
                ScreenModal.show();
            });
            $("#btnNoticeConfig").click(function (e) {
                ScreenModal = new DiagnosisConfig(_this);
                ScreenModal.show();
            });

            $('#btnWarningLog').click(function(){
                viewLog(this);
                $('#groupCritical .rows').slideDown();
                $('#groupUrgent .rows').slideUp();
                _this.urgentCount = 0;

            });
            $('#btnAlertLog').click(function(){
                viewLog(this);
                $('#groupUrgent .rows').slideDown();
                $('#groupCritical .rows').slideUp();
                _this.criticalCount = 0;
            });

            $('#btnStickyPost').click(function(){
                var $divCanvas = $('#divCanvas');
                var $divPaneNotice = $('#divPaneNotice');
                var $diagnosisLogCt = $('#diagnosisLogCt');
                var colCount = parseInt($divCanvas[0].classList[0].split('-')[2]);
                var $observerCanvas = $('#divObserverCanvas');

                if($(this).hasClass('top')){
                    $divCanvas.removeClass().addClass( 'col-sm-' + (colCount - _this.logCtWidth) + ' st-content');
                    $diagnosisLogCt.removeClass('minLog');
                }else{// top
                    $divCanvas.removeClass().addClass( 'col-sm-' + (colCount + _this.logCtWidth) + ' st-content');
                    $('#logTitle').hide();
                    $('#btnNoticeConfig').hide();
                    $('#btnNoticeHistory').hide();
                    $('#btnStickyPost').hide();
                    $('#btnAlertLog').addClass('bigGap');
                    $('#btnWarningLog').addClass('bigGap');
                    $diagnosisLogCt.css({minWidth: '150px'});

                    $('#divPaneNotice .panel-body').slideUp(500,function(){
                        $diagnosisLogCt.addClass('minLog');
                    });
                    $observerCanvas.animate({height: '100%',width: '100%', marginTop: 0});
                }

                // 新增动画完成事件
                $divCanvas.one('transitionend', function (e) {
                    e = e.originalEvent;
                    if( e.propertyName === 'width' ) { 
                        _this.obScreen.resize();
                    }
                    e.stopPropagation();
                });

                $(this).toggleClass('top notTop');
                $divPaneNotice.toggleClass('top notTop');
            });

            function viewLog(obj){
                var $diagnosisLogCt = $('#diagnosisLogCt');
                var $paneBody = $diagnosisLogCt.find('.panel-body');
                if($paneBody.is(':hidden')){
                    $diagnosisLogCt.removeClass('minLog');
                    $paneBody.show();
                    $('#logTitle').show();
                    $('#btnNoticeConfig').show();
                    $('#btnNoticeHistory').show();
                    $('#btnStickyPost').show();
                    $('#btnAlertLog').removeClass('bigGap');
                    $('#btnWarningLog').removeClass('bigGap');

                    $diagnosisLogCt.css({minWidth: '260px'});
                }
                $(obj).find('.badge').html('');
            }
            $('#btnChangeAlarm').click(function (e) {
                var level = $('#selectAlarmLevel').find('option:selected').attr('setval');
                var delayVal = $('#selectAlarmTime').find('option:selected').attr('setval');
                var now = (new Date()).getTime();
                var time;
                if (0 == delayVal) {
                    time = new Date(now);
                }
                else if (1 == delayVal) {
                    time = new Date(now + 3600000);
                }
                else if (2 == delayVal) {
                    time = new Date(now + 43200000);
                }
                else if (3 == delayVal) {
                    time = new Date(now + 86400000);
                }
                else if (4 == delayVal) {
                    time = new Date(now + 604800000);
                }
                else if (5 == delayVal) {
                    time = new Date(now);
                    time.setMonth(now.getMonth() + 1);
                }
                else if (6 == delayVal) {
                    time = new Date(now + 999999999);
                }
                var postData = {
                    'id': _this.faId,
                    'userId': _this.faUserId,
                    'isUserDefined': true,
                    'userFaultGrade': level,
                    'userFaultDelay': time.format("yyyy-MM-dd HH:mm:ss")
                };
                WebAPI.post('/diagnosis/fault/customUpdate/' + AppConfig.projectId, postData).done(function (result) {
                    var data = JSON.parse(result);
                    if (data) {
                        _this.dictFault[_this.faId].isUserDefined = true;
                        _this.dictFault[_this.faId].userFaultGrade = level;
                        _this.dictFault[_this.faId].userFaultDelay = time;

                        // change title color
                        var row = $('div[faultid=' + _this.faId + ']');
                        var spanBadge = row.find('.badge').eq(0);
                        if (0 == level) {
                            spanBadge.css('background-color', '#5bc0de');
                        }
                        else if (1 == level) {
                            spanBadge.css('background-color', '#f0ad4e');
                        }
                        else if (2 == level) {
                            spanBadge.css('background-color', '#d9534f');
                        }
                        else {
                            spanBadge.css('background-color', '#d9534f');
                        }
                        row.hide();
                    }
                }).error(function (result) {
                }).always(function (e) {
                    $('#dlgChangeRule').modal('hide');
                });
            });
        },
        topFloors: function(){
            var $floorCt = $('#floorCt');
            var $divCanvas = $('#divCanvas');
            var $stContainer = $('#st-container');
            var divCanvasWidth = parseInt($divCanvas[0].classList[0].split('-')[2]);

            if($stContainer.find('#floorCt')[0]){
                $floorCt.insertBefore($('#st-container'));
                $floorCt.removeClass('st-effect-7').removeClass('st-menu').addClass('floorTop');
                $stContainer.removeClass('st-menu-open');
                $divCanvas[0].className = 'col-sm-' + (divCanvasWidth + 2);
                $divCanvas[0].style.positions = 'absolute';
            }else{
                $floorCt.insertBefore($divCanvas);
                $divCanvas[0].className = 'col-sm-' + (divCanvasWidth - 2);
                $floorCt.addClass('st-effect-7').addClass('st-menu').removeClass('floorTop');
                $stContainer.addClass('st-menu-open');
            }
            $(this).toggleClass('top notTop');
            _this.obScreen.resize();
        },

        initData: function (data) {
            var item, arr;
            this.dictZone = new Object();
            this.dictEquipment = new Object();
            this.dictFault = new Object();
            this.buildings = [];


            arr = data.equipments;
            for (var i = 0, len = arr.length; i < len; i++) {
                item = arr[i];
                item.faultIds = new Array();
                this.dictEquipment[item.id] = item;
            }

            arr = data.zones;
            this.floorCount = arr.length;
            var index = -1, tempBuildingId = undefined;


            for (var i = 0, len = arr.length; i < len; i++) {
                item = arr[i];
                item.equipmentIds = new Array();
                var equipments = [];

                for (var j = 0; j < data.equipments.length; j++) {
                    if (data.equipments[j].zoneId == item.id) {
                        item.equipmentIds.push(data.equipments[j].id);
                        equipments.push({equipmentId: data.equipments[j].id, equipmentName: data.equipments[j].name})
                    }
                }
                this.dictZone[item.id] = item;

                if(tempBuildingId != item.buildingId){
                    tempBuildingId = item.buildingId;
                    index++;
                    var building = {
                        buildId: item.buildingId,
                        buildName: item.buildingName,
                        subBuilds: [{
                            subBuildId: item.subBuildingId,
                            subBuildName: item.subBuildingName,
                            equipments: equipments
                        }]
                    }
                    this.buildings.push(building)
                }else{
                    var subBuilding = {
                        subBuildId: item.subBuildingId,
                        subBuildName: item.subBuildingName,
                        equipments: equipments
                    }
                    this.buildings[index].subBuilds.push(subBuilding);
                }
            }

            var zoneOffset = -(new Date()).getTimezoneOffset() / 60;
            if (zoneOffset > 0) {
                    zoneOffset = '+' + zoneOffset;
            }
            zoneOffset += '00';

            arr = data.faults;
            for (var i = 0, elapse, len = arr.length; i < len; i++) {
                item = arr[i];
                item.display = true;
                item.grade = undefined;
                item.userFaultDelay += zoneOffset;
                if(item.isUserDefined && item.userFaultDelay){
                    if (item.userFaultDelay == -1) {
                        item.display = false;
                    }
                    else if (item.userFaultDelay > 0) {
                        elapse = new Date() - new Date(item.userModifyTime);
                        if (elapse < 0) item.display = false;
                    }
                }

                if (item.isUserDefined) {
                    item.grade = item.userFaultGrade;
                }
                else {
                    item.grade = item.defaultGrade;
                }

                this.dictFault[item.id] = item;
            }

            this.arrLastNotice = data.notices;
        },

        initWorkerForUpdating: function () {
            this.workerUpdate = new Worker("/static/views/js/worker/workerUpdate.js");
            this.workerUpdate.self = this;
            this.workerUpdate.addEventListener("message", this.refreshData, true);
            this.workerUpdate.addEventListener("error", function (e) { console.log(e) }, true);
            this.workerUpdate.postMessage({ projectId: AppConfig.projectId, type: "diagnosisScreen" });
        },

        initObScreen: function () {
            this.obScreen.container = this.$obContainer[0];
            this.obScreen.isInDiagnosis = true;
            this.obScreen.diagScreen = this;
        },

        refreshData: function (e) {
            if (e.data && !e.data.error) {
                this.self.arrLastNotice = e.data;
                for (var key in this.self.dictEquipment) {
                    this.self.dictEquipment[key].faultIds = new Array();
                }

                for (var i = 0; i < e.data.length; i++) {
                    var faultId = e.data[i].faultId;
                    this.self.dictEquipment[this.self.dictFault[faultId].equipmentId].faultIds.push(faultId);
                }

                this.self.renderPaneNoticeGroup();
                Spinner.stop();
            } else {
                new Alert(ElScreenContainer, Alert.type.danger, I18n.resource.code[e.data.error]).showAtTop(5000);
            }
        },

        initPaneBuilding: function () {
            var count = 15;

            var body = document.getElementById('divCanvas');

            var divMain = document.createElement('div');
            divMain.className = 'box';
            divMain.style.position = 'relative';

            var div, divContainer, divElement, span, item, sb;
            var unitTop = body.scrollHeight * 0.5 / this.floorCount;
            var top = body.scrollHeight * 0.1;
            var unitDeg = 60 / this.floorCount;

            var arrZone = new Array();
            for (var zoneId in this.dictZone) {
                arrZone.push(this.dictZone[zoneId]);
            }

            for (var i = 0, len = arrZone.length; i < len; i++) {
                index = this.floorCount - 1 - i;
                item = arrZone[i];
                div = document.createElement('div');
                div.id = 'div-floor-' + item.id.toString();
                div.className = 'floor';
                if(arrZone.length == 1) div.className += ' hover';    //TODO: to be removed, for Changi
                div.style.top = (unitTop * index + top) + "px";
                div.style.transform = 'rotateX(' + (120 - unitDeg * index) + 'deg) rotateZ(60deg)';
                div.style.backgroundImage = "url('/static/images/diagnosis/" + AppConfig.projectName + "/" + item.image + "')";

                span = document.createElement('span');
                span.className = 'span-floor-number';

                //sb = new StringBuilder();
                //if (item.campusName && item.campusName != '') sb.append('Campus: ').append(item.campusName).append(', ');
                //if (item.buildingName && item.buildingName != '') sb.append('Building: ').append(item.buildingName).append(', ');
                //sb.append('SubBuilding: ').append(item.subBuildingName).append('.');
                //span.textContent = sb.toString();
                //div.appendChild(span);

                divContainer = document.createElement('div');
                divContainer.className = 'floor-equipment-pane';

                for (var j = 0; j < item.equipmentIds.length; j++) {
                    var equipmentId = item.equipmentIds[j];
                    var equipment = this.dictEquipment[equipmentId];
                    divElement = document.createElement('div');
                    divElement.className = 'floor-equipment';
                    divElement.id = 'div-floor-icon-' + item.id + '-' + equipmentId;
                    divElement.textContent = equipment.name;
                    divContainer.appendChild(divElement);
                }

                div.appendChild(divContainer);
                divMain.appendChild(div);
            }

            body.appendChild(divMain);
            arrZone = null;
        },

        initPaneNav: function () {
            var _this = this;
            var pane = document.createElement('div');
            var spanFloor, spanIcon, div, item;

            for (var zoneId in this.dictZone) {
                item = this.dictZone[zoneId];
                if (item.equipmentIds && item.equipmentIds.length == 0) continue;

                div = document.createElement('div');
                div.id = 'div-icon-' + zoneId;
                div.className = 'div-nav-row';

                spanFloor = document.createElement('span');
                spanFloor.id = 'navFloor-' + zoneId;
                spanFloor.setAttribute('pageId', item.pageId)
                spanFloor.className = 'badge div-row-icon-badge grow';
                spanFloor.textContent = item.subBuildingName;
                spanFloor.onclick = function (e) {
                    var id = e.target.getAttribute('pageId');
                    if (id && id != '' && id != 0) {
                        if( _this.obScreen === undefined ) {
                            _this.obScreen = new ObserverScreen(id);
                            _this.initObScreen();
                            _this.obScreen.show();
                        } else if(_this.obScreen.id === id) {
                            return;
                        } else {
                            _this.obScreen.close();
                            _this.obScreen = new ObserverScreen(id);
                            _this.initObScreen();
                            _this.obScreen.show();
                        }
                        $(ElScreenContainer).off('click').on('click','#btnFloorsSP',_this.topFloors);
                        $('#btnFloorsSP').removeClass('btn').removeClass('disabled');
                    }
                    else {
                        alert('This floor has no details');
                    }
                };
                div.appendChild(spanFloor);

                if (item.equipmentIds.length == 0) {
                    div.innerHTML += "none";
                } else {
                    for (var j = 0, len = item.equipmentIds.length; j < len; j++) {
                        var equipmentId = item.equipmentIds[j];
                        spanIcon = document.createElement('span');
                        spanIcon.id = 'spanNav-icon-' + zoneId + '-' + equipmentId;
                        spanIcon.title = this.dictEquipment[equipmentId].name;

                        spanIcon.onclick = function (e) {
                            _this.showEquipmentDetail(e.currentTarget.id.split('-')[3]);
                        };
                        spanIcon.onmouseenter = function (e) {
                            var $this = $(e.currentTarget);
                            var modalTextId = $this.attr('data-modaltextid');
                            var pageId = $this.siblings('[pageid]').attr('pageid');
                            if(modalTextId === undefined || _this.obScreen === undefined) return;
                            if( _this.obScreen.id !== pageId ) return;
                            _this.obScreen.showErrTip(modalTextId);
                        };
                        spanIcon.onmouseleave = function (e) {
                            var $this = $(e.currentTarget);
                            var modalTextId = $(e.currentTarget).attr('data-modaltextid');
                            var pageId = $this.closest('div').children('span:first').attr('pageid');
                            if(modalTextId === undefined || _this.obScreen === undefined) return;
                            if( _this.obScreen.id !== pageId ) return;
                            _this.obScreen.hideErrTip(modalTextId);
                        };
                        spanIcon = this.updatePaneNavWarning(spanIcon, null);
                        div.appendChild(spanIcon);
                    }
                }

                pane.appendChild(div);
            }

            var paneIcon = document.getElementById('paneIcon');
            paneIcon.innerHTML = "";
            paneIcon.appendChild(pane);
        },

        createWorkflowOrder: function (notice, fault) {
            var momentTime = new Date(notice.time);

            ScreenManager.show(WorkflowInsert, {
                noticeId: notice.id,
                title: fault.name,
                detail: fault.description,
                dueDate: new Date(+new Date() + 172800000).format('yyyy-MM-dd'),  //结束时间为两天后
                critical: fault.grade,
                projectId: AppConfig.projectId,
                chartPointList: fault.points,
                chartQueryCircle: 'm5',
                chartStartTime: new Date(momentTime - 43200000).format('yyyy-MM-dd HH:mm:ss'), //报警发生前半天
                chartEndTime: new Date(momentTime + 43200000).format('yyyy-MM-dd HH:mm:ss'),   //报警发生后半天
                userId: AppConfig.userId
            });
        },

        renderPaneBuilding: function (notice, fault, equipment, zone) { 
            var element = document.getElementById('div-floor-' + equipment.zoneId);
            if (!element) return;
            var divIcon = $('#div-floor-icon-' + zone.id + '-' + equipment.id);

            var color;
            switch (fault.grade) {
                case 0: color = 'window'; break;
                case 1: color = 'rgb(238, 170, 100)'; break;
                case 2: color = 'rgb(200, 100, 100)'; break;
                default: break;
            }

            if (color) {
                element.style.backgroundColor = color;
                divIcon.css('background-color', color);
            }

            var sb = new StringBuilder();
            sb.append('<div class="tooltip" role="tooltip">');
            sb.append('    <div class="tooltipTitle tooltip-inner">Equipment</div>');
            sb.append('    <div class="tooltipContent">');
            sb.append('        <p style="white-space:nowrap;">Name: <span style="font-weight: bold;">').append(equipment.name).append('</span></p> ');
            sb.append('        <p style="white-space:nowrap;">System: <span style="font-weight: bold;">').append(equipment.systemName).append('</span></p> ');
            sb.append('        <p style="white-space:nowrap;">Subsystem: <span style="font-weight: bold;">').append(equipment.subSystemName).append('</span></p> ');
            sb.append('        <p style="white-space:nowrap;">Faults:</p> ');
            for (var i = 0; i < equipment.faultIds.length; i++) {
                sb.append('<p style="margin-left: 20px; white-space:nowrap;"><span style="font-weight: bold;">').append(this.dictFault[equipment.faultIds[i]].name);
                for (var j = 0; j < this.arrLastNotice.length; j++) {
                    var noticeTemp = this.arrLastNotice[j];
                    if (noticeTemp.faultId == equipment.faultIds[i]) {
                        if (noticeTemp.status && noticeTemp.status != '' && noticeTemp.status != 0) {
                            sb.append(' (').append(noticeTemp.status).append(')');
                        }
                    }
                }
                sb.append('</span></p> ');
            }
            sb.append('    </div>');
            sb.append('    <div class="tooltip-arrow"></div>');
            sb.append('</div>');

            var options = {
                //placement: 'bottom',
                title: 'Equipment',
                template: sb.toString()
            };

            divIcon.tooltip(options);
        },

        renderPaneNav: function (notice, fault, equipment) {
            var element = document.getElementById('spanNav-icon-' + equipment.zoneId + '-' + equipment.id);
            this.updatePaneNavWarning(element, fault.grade);
            $(element).attr('data-modaltextid', equipment.modalTextId);
        },

        updatePaneNavWarning: function (element, level) {
            var spanIcon = element;
            var strClass;

            if (level == 0) {
                strClass = "glyphicon glyphicon-ok-sign"
                spanIcon.style.color = '#009999';
                spanIcon.style.opacity = 0.7;
            }
            else if (level == 1) {
                strClass = "glyphicon glyphicon-info-sign"
                spanIcon.style.color = '#EEAA00';
            }
            else if (level == 2) {
                strClass = "glyphicon glyphicon-remove-sign animation-warning"
                spanIcon.style.color = '#CC3333';
            }
            else {
                strClass = "glyphicon glyphicon-minus-sign";
                spanIcon.style.color = '#009999';
                spanIcon.style.opacity = 0.7;
            }

            spanIcon.className = strClass + ' div-row-icon grow';

            return spanIcon;
        },

        showEquipmentDetail: function (equipmentId) {
            this.dialog = new ObserverScreen(this.dictEquipment[equipmentId].pageId);
            this.dialog.isDetailPage = true;
            this.dialog.show();
        },

        showZoneDetail: function (zoneId) {

        },

        renderPaneNoticeGroup: function () {
            var _this = this;
            var urgentCount = 0, criticalCount = 0;
            $('#divPaneNotice .panel-body').remove();

            var divBody = $('<div class="panel-body" style="height:calc(100% - 41px);overflow-y:auto;display:none;"></div>');
            $('#divPaneNotice').append(divBody);

            var gCritical = _this.insertLogGroup('groupCritical', _this.langCfg.LEVEL_SET.CRITICAL, 'rgba(240, 173, 78, 0.7)');
            var gUrgent = _this.insertLogGroup('groupUrgent', _this.langCfg.LEVEL_SET.URGENT, 'rgba(217, 83, 79, 0.7)');
            var item, parent;
            for (var i = 0, len = _this.arrLastNotice.length; i < len; i++) {
                item = _this.arrLastNotice[i];
                var grade = _this.dictFault[item.faultId].grade;
                if (1 == grade) {
                    parent = gCritical.find('.rows');
                    criticalCount ++;
                }
                else if (2 == grade) {
                    parent = gUrgent.find('.rows');
                    urgentCount ++;
                }
                else {
                    continue;
                }
                _this.insertLogItem(parent, item, i);
            }

            _this.urgentCount += urgentCount;
            _this.criticalCount += criticalCount;

            if(_this.urgentCount > 0){
                $('#btnWarningLog').find('.badge').html(_this.urgentCount);
            }
            if(_this.urgentCount > 0){
                $('#btnAlertLog').find('.badge').html(_this.criticalCount);
            }
        },

        insertLogGroup: function (groupId, groupName, bkgColor) {
            var group = $('<ul class="nav nav-list tree-group" id="' + groupId + '" draggable="true">');
            var head = $('<li><span class="badge" style="background-color:#5bc0de;width:100%;height:22px;">' + groupName + '</span></li>');
            head.find('span').css('background-color', bkgColor);
            head.click(function (e) {
                $(e.currentTarget).next('.rows').slideToggle();
            });
            group.append(head);

            var rowTitle = $('<li class="rows" style="display:none;"></li>');
            group.append(rowTitle);

            $('#divPaneNotice .panel-body').append(group);
            return group;
        },

        insertLogItem: function (divParent, item, itemNum) {
            var _this = this;
            var divNotice, fault, equipment, zone, sb, span, textId;

            fault = this.dictFault[item.faultId];
            if (!fault.display) {
                return;
            };

            equipment = this.dictEquipment[fault.equipmentId];
            textId = equipment.modalTextId;
            zone = this.dictZone[equipment.zoneId];

            divNotice = document.createElement('div');
            divNotice.id = 'divLog-' + itemNum;
            divNotice.setAttribute('path', zone.id + '-' + equipment.id);
            divNotice.setAttribute('faultid', item.faultId);
            if(textId !== null) divNotice.setAttribute('data-modaltextid', textId);
            divNotice.className = 'div-pane-log';
            divNotice.onmouseenter = function (e) {
                var $this = $(e.currentTarget);
                var modalTextId = $this.attr('data-modaltextid');
                var pageId = $this.children('[pageid]').attr('pageid');
                if(modalTextId === undefined || _this.obScreen === undefined) return;
                if( _this.obScreen.id !== pageId ) return;
                _this.obScreen.showErrTip(modalTextId);
            };
            divNotice.onmouseleave = function (e) {
                var $this = $(e.currentTarget);
                var modalTextId = $this.attr('data-modaltextid');
                var pageId = $this.children('[pageid]').attr('pageid');
                if(modalTextId === undefined || _this.obScreen === undefined) return;
                if( _this.obScreen.id !== pageId ) return;
                _this.obScreen.hideErrTip(modalTextId);
            };

            var parent = $(divNotice);

            sb = new StringBuilder();
            sb.append(fault.name);
            if (item.status && item.status != '' && item.status != 0) {
                sb.append(' (').append(item.status).append(')');
            }
            //span = $('<span>').addClass('badge').attr('title', 'Fault name').css('display', 'block').css('color', '#555').text(sb.toString());
            //switch (fault.grade) {
            //    case 0: span.css('background-color', 'rgba(91, 192, 222, 0.7)'); break;
            //    case 1: span.css('background-color', 'rgba(240, 173, 78, 0.7)'); break;
            //    case 2: span.css('background-color', 'rgba(217, 83, 79, 0.7)'); break;
            //    default: break;
            //}
            //parent.append(span);


            //btn show equipment detail
            span = $('<span>').addClass('badge grow span-hover-pointer').attr('title', 'Equipment name')
                .attr('equipment', equipment.pageId).text(equipment.name);
            span.click(function (e) {
                this.dialog = new ObserverScreen(e.currentTarget.getAttribute('equipment'));
                this.dialog.isDetailPage = true;
                this.dialog.show();
            });
            parent.append(span);


            $('<span>').addClass('badge grow span-hover-pointer')
                .attr({
                    'pageId': zone.pageId,
                    'title': 'Zone ID',
                    'data-zoneId': zone.id
                }).text(zone.subBuildingName)
                .click(function (e) {
                    var pageId = e.currentTarget.getAttribute('pageId');
                    var zoneId = e.currentTarget.getAttribute('data-zoneId');
                    if (pageId && pageId != '' && pageId != 0) {
                        $('#navFloor-'+zoneId).click();
                    }
                    else {
                        alert('This floor has no details');
                    }
                }).appendTo(parent);


            $('<span>').attr({
                'title': 'Triggering time',
                'data-time': item.time
            }).text(new Date(item.time).format("MM-dd HH:mm"))
                .css('text-decoration', 'underline').css('font-weight', 'bold').appendTo(parent);

            $('<span>').addClass('glyphicon glyphicon-ok-sign grow span-hover-pointer span-btn')
                .attr('title', 'Check')
                .click(function (e) {
                    var faultId = $(e.currentTarget).closest('.div-pane-log').attr('faultid');
                    var item = _this.dictFault[faultId];
                    if (undefined != item) {
                        _this.faId = item.id;
                        _this.faUserId = item.userId;

                        var level;
                        if (item.isUserDefined) {
                            level = item.userFaultGrade;
                        }
                        else {
                            level = item.defaultGrade;
                        }
                        var selectLevel = $('#selectAlarmLevel');
                        if (0 == level) {
                            selectLevel.val(_this.langCfg.LEVEL_SET.NORMAL);
                        }
                        else if (1 == level) {
                            selectLevel.val(_this.langCfg.LEVEL_SET.CRITICAL);
                        }
                        else if (2 == level) {
                            selectLevel.val(_this.langCfg.LEVEL_SET.URGENT);
                        }
                        else {
                            selectLevel.val(_this.langCfg.LEVEL_SET.NORMAL);
                        }

                        var selectTm = $('#selectAlarmTime');
                        var userFaDelay = item.userFaultDelay;
                        if (undefined != userFaDelay
                            && null != userFaDelay) {
                            var timeDelay = new Date(userFaDelay);
                            var timeNow = new Date();
                            var interval = timeDelay.getTime() - timeNow.getTime();
                            if (interval < 0) {
                                selectTm.val(_this.langCfg.defaultPeriod.REAL_TIME);
                            }
                            else if (interval <= 3600000) {
                                selectTm.val(_this.langCfg.defaultPeriod.DELAY_1H);
                            }
                            else if (interval <= 43200000) {
                                selectTm.val(_this.langCfg.defaultPeriod.DELAY_12H);
                            }
                            else if (interval <= 86400000) {
                                selectTm.val(_this.langCfg.defaultPeriod.DELAY_24H);
                            }
                            else if (interval <= 604800000) {
                                selectTm.val(_this.langCfg.defaultPeriod.DELAY_7D);
                            }
                            else if (interval <= 18144000000) {
                                selectTm.val(_this.langCfg.defaultPeriod.DELAY_1M);
                            }
                            else {
                                selectTm.val(_this.langCfg.defaultPeriod.DELAY_FOREVER);
                            }
                        }
                        else {
                            selectTm.val(_this.langCfg.defaultPeriod.DELAY_FOREVER);
                        }
                    }

                    $('#dlgChangeRule').modal('show');
                }).appendTo(parent);

            if (item.orderId && item.orderId != 0 && item.orderId != '') {
                $('<span>').addClass('glyphicon glyphicon-tags grow span-hover-pointer span-btn')
                    .attr('title', 'Show workflow order')
                    .attr('workflow', item.orderId)
                    .click(function (e) {
                        if (ScreenCurrent) ScreenCurrent.close();
                        ScreenCurrent = new workflowNoticeDetail(e.currentTarget.getAttribute('workflow'), null, null);
                        ScreenCurrent.show();
                    }).appendTo(parent);
            } else {
                $('<span>').addClass('glyphicon glyphicon-share grow span-hover-pointer span-btn')
                    .attr('title', 'Create workflow order')
                .click(function (e) {
                    _this.createWorkflowOrder(item, fault);
                }).appendTo(parent);
            }

            var strDesc = fault.description;
            var arr = item.detail.toString().split(',');
            for (var j = 0; j < arr.length; j++) {
                strDesc = strDesc.replace('{' + j.toString() + '}', '<span class="variable">' + arr[j] + '</span>');
            }
            $('<p>').text(strDesc).appendTo(parent);


            divParent.append(parent);

            _this.renderPaneBuilding(item, fault, equipment, zone);
            _this.renderPaneNav(item, fault, equipment);
        }
    }

    return DiagnosisScreen;
})();



var DiagnosisHistory = (function () {
    var _this = undefined;

    function DiagnosisHistory(parent) {
        _this = this;
        this.parent = parent;
        this.m_tableInfo = [];
        this.m_bSortTimeAscend = false;
        this.m_bSortGradeAscend = false;
        this.m_bSortEquipAscend = false;
        this.m_bSortZoneAscend = false;
        this.m_bSortFaultAscend = false;
        this.m_bSortStatusAscend = false;
    };

    DiagnosisHistory.prototype = {
        show: function () {
            var _this = this;
            Spinner.spin(ElScreenContainer);

            $.get("/static/views/observer/diagnosis/paneHistory.html").done(function (resultHtml) {
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

                //init event
                $("#datePickerLog").datetimepicker({
                    minView: "month",
                    autoclose: true,
                    todayBtn: true,
                    initialDate: new Date()
                });

                $("#txtLogDate").val(new Date().toLocaleDateString().replace('/', '-').replace('/', '-'));

                $('#thTime').click(function (e) {
                    _this.sortTable(0);
                });

                $('#thGrade').click(function (e) {
                    _this.sortTable(1);
                });

                $('#thEquip').click(function (e) {
                    _this.sortTable(2);
                });

                $('#thZone').click(function (e) {
                    _this.sortTable(3);
                });

                $('#thFault').click(function (e) {
                    _this.sortTable(4);
                });

                $('#thStatus').click(function (e) {
                    _this.sortTable(5);
                });

                $('#btnSearchFault').click(function (e) {
                    _this.searchFaultInfo();
                });

                $('#inputSearchFault').keyup(function (e) {
                    if (13 === e.keyCode) {
                        _this.searchFaultInfo();
                    }
                });
            });
        },

        close: function () {

        },

        init: function () {
            var _this = this;
            var now = new Date();
            var startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            this.refreshData(startTime, now);

            $("#txtLogDate").change(function (e) {
                var startTime = new Date($("#txtLogDate").val() + ' 00:00:00');
                var endTime = new Date(+startTime + 86400000);
                _this.refreshData(startTime, endTime);
            });

            $("#btnLogPre").off('click').click(function (e) {
                var endTime = new Date($("#txtLogDate").val() + ' 00:00:00');
                var preDay = new Date(+endTime - 86400000);
                $("#txtLogDate").val(preDay.toLocaleDateString().replace('/', '-').replace('/', '-'));
                _this.refreshData(preDay, endTime);
            });

            $("#btnLogNext").off('click').click(function (e) {
                var startTime = new Date($("#txtLogDate").val() + ' 00:00:00');
                startTime = new Date(+startTime + 86400000);
                var nextDay = new Date(+startTime + 86400000);
                $("#txtLogDate").val(nextDay.toLocaleDateString().replace('/', '-').replace('/', '-'));
                _this.refreshData(startTime, nextDay);
            });
        },

        refreshData: function (startTime, endTime) {
            var _this = this;

            startTime = startTime.format("yyyy-MM-dd HH:mm:ss");
            endTime = endTime.format("yyyy-MM-dd HH:mm:ss");

            Spinner.spin(document.getElementById('tableNoticeHistory'));
            WebAPI.get('/diagnosis/notice/get/' + AppConfig.projectId + '/' + startTime + '/' + endTime).done(function (result) {
                _this.m_tableInfo = JSON.parse(result);
                _this.initTable(_this.m_tableInfo);
            }).error(function (result) {
                dialog.find('#dialogContent').html('Error query.');
            }).always(function () {
                Spinner.stop();
            });
        },

        initTable: function (data) {
            $('#tableNoticeHistory tbody').remove();
            var tbody = document.createElement('tbody');

            if (data.length == 0) tbody.innerHTML = 'no history data';            

            var tr, td, item, sb, fault, equipment, zone;
            for (var i = 0, len = data.length; i < len; i++) {
                item = data[i];
                fault = this.parent.dictFault[item.faultId];
                equipment = this.parent.dictEquipment[fault.equipmentId];
                zone = this.parent.dictZone[equipment.zoneId];

                tr = document.createElement('tr');
                tr.id = 'diagHistory_' + item.id;

                sb = new StringBuilder();
                sb.append('<td>').append(new Date(item.time).format("yyyy-MM-dd HH:mm:ss")).append('</td>');
                switch (this.parent.dictFault[item.faultId].grade) {
                    case 0: sb.append('<td><span class="badge" style="background-color: #5bc0de;" title="Grade">Normal</span></td>'); break;
                    case 1: sb.append('<td><span class="badge" style="background-color: #f0ad4e;" title="Grade">Alert</span></td>'); break;
                    case 2: sb.append('<td><span class="badge" style="background-color: #d9534f;" title="Grade">Fault</span></td>'); break;
                    default: sb.append('<td><span class="badge" style="background-color: #d9534f;" title="Grade">Unknown</span></td>'); break;
                }
                sb.append('<td>').append(equipment.name).append('</td>');
                sb.append('<td>').append(zone.subBuildingName).append('</td>');
                sb.append('<td>').append(fault.name).append('</td>');
                switch (item.status) {
                    case 0: sb.append('<td>Disable</td>'); break;
                    case 1: sb.append('<td>Delayed</td>'); break;
                    case 2: sb.append('<td>Realtime</td>'); break;
                    default: break;
                }

                //init tooltip(notice detail).
                var strDesc = fault.description;
                var arr = item.detail.toString().split(',');
                for (var j = 0; j < arr.length; j++) {
                    strDesc = strDesc.replace('{' + j.toString() + '}', '<span class="variable">' + arr[j] + '</span>');
                }
                tr.title = strDesc;

                tr.innerHTML = sb.toString();
                tbody.appendChild(tr);
            }
            $('#tableNoticeHistory').append(tbody);
        },

        sortTable: function (type) {
            $('#tableNoticeHistory tbody').html('');
            if (0 === type) {
                if (!_this.m_bSortTimeAscend) {
                    _this.m_tableInfo.sort(_this.sortTimeAscending);
                }
                else {
                    _this.m_tableInfo.sort(_this.sortTimeDescending);
                }
                _this.m_bSortTimeAscend = !_this.m_bSortTimeAscend;
            }
            else if (1 === type) {
                if (!_this.m_bSortGradeAscend) {
                    _this.m_tableInfo.sort(_this.sortGradeAscending);
                }
                else {
                    _this.m_tableInfo.sort(_this.sortGradeDescending);
                }
                _this.m_bSortGradeAscend = !_this.m_bSortGradeAscend;
            }
            else if (2 === type) {
                if (!_this.m_bSortEquipAscend) {
                    _this.m_tableInfo.sort(_this.sortEquipAscending);
                }
                else {
                    _this.m_tableInfo.sort(_this.sortEquipDescending);
                }
                _this.m_bSortEquipAscend = !_this.m_bSortEquipAscend;
            }
            else if (3 === type) {
                if (!_this.m_bSortZoneAscend) {
                    _this.m_tableInfo.sort(_this.sortZoneAscending);
                }
                else {
                    _this.m_tableInfo.sort(_this.sortZoneDescending);
                }
                _this.m_bSortZoneAscend = !_this.m_bSortZoneAscend;
            }
            else if (4 === type) {
                if (!_this.m_bSortFaultAscend) {
                    _this.m_tableInfo.sort(_this.sortFaultAscending);
                }
                else {
                    _this.m_tableInfo.sort(_this.sortFaultDescending);
                }
                _this.m_bSortFaultAscend = !_this.m_bSortFaultAscend;
            }
            else if (5 === type) {
                if (!_this.m_bSortStatusAscend) {
                    _this.m_tableInfo.sort(_this.sortStatusAscending);
                }
                else {
                    _this.m_tableInfo.sort(_this.sortStatusDescending);
                }
                _this.m_bSortStatusAscend = !_this.m_bSortStatusAscend;
            }
            _this.initTable(_this.m_tableInfo);
        },

        sortTimeAscending: function (a, b) {
            return a.time - b.time;
        },

        sortTimeDescending: function (a, b) {
            return b.time - a.time;
        },

        sortGradeAscending: function (a, b) {
            return a.grade - b.grade;
        },

        sortGradeDescending: function (a, b) {
            return b.grade - a.grade;
        },

        sortEquipAscending: function (a, b) {
            var fault = _this.parent.dictFault[a.faultId];
            var equipA = _this.parent.dictEquipment[fault.equipmentId];

            fault = _this.parent.dictFault[b.faultId];
            var equipB = _this.parent.dictEquipment[fault.equipmentId];

            return (equipA.name).localeCompare(equipB.name);
        },

        sortEquipDescending: function (a, b) {
            var fault = _this.parent.dictFault[a.faultId];
            var equipA = _this.parent.dictEquipment[fault.equipmentId];

            fault = _this.parent.dictFault[b.faultId];
            var equipB = _this.parent.dictEquipment[fault.equipmentId];

            return (equipB.name).localeCompare(equipA.name);
        },

        sortZoneAscending: function (a, b) {
            var fault = _this.parent.dictFault[a.faultId];
            var equip = _this.parent.dictEquipment[fault.equipmentId];
            var zoneA = _this.parent.dictZone[equip.zoneId];

            fault = _this.parent.dictFault[b.faultId];
            equip = _this.parent.dictEquipment[fault.equipmentId];
            var zoneB = _this.parent.dictZone[equip.zoneId];

            return (zoneA.subBuildingName).localeCompare(zoneB.subBuildingName);
        },

        sortZoneDescending: function (a, b) {
            var fault = _this.parent.dictFault[a.faultId];
            var equip = _this.parent.dictEquipment[fault.equipmentId];
            var zoneA = _this.parent.dictZone[equip.zoneId];

            fault = _this.parent.dictFault[b.faultId];
            equip = _this.parent.dictEquipment[fault.equipmentId];
            var zoneB = _this.parent.dictZone[equip.zoneId];

            return (zoneB.subBuildingName).localeCompare(zoneA.subBuildingName);
        },

        sortFaultAscending: function (a, b) {
            var faultA = _this.parent.dictFault[a.faultId];
            var faultB = _this.parent.dictFault[b.faultId];
            return (faultA.name).localeCompare(faultB.name);
        },

        sortFaultDescending: function (a, b) {
            var faultA = _this.parent.dictFault[a.faultId];
            var faultB = _this.parent.dictFault[b.faultId];
            return (faultB.name).localeCompare(faultA.name);
        },

        sortStatusAscending: function (a, b) {
            return a.status - b.status;
        },

        sortStatusDescending: function (a, b) {
            return b.status - a.status;
        },

        searchFaultInfo: function () {
            var searchVal = $('#inputSearchFault').val();
            if (null == searchVal || undefined == searchVal) {
                return;
            }

            $('#tableNoticeHistory tbody').html('');
            if ('' == searchVal) {
                _this.initTable(_this.m_tableInfo);
                return;
            }

            var faultName, item;
            var arrSuit = [];
            searchVal = searchVal.toLowerCase();
            for (var i = 0, len = _this.m_tableInfo.length; i < len; i++) {
                item = _this.m_tableInfo[i];
                faultName = (_this.parent.dictFault[item.faultId]).name;
                faultName = faultName.toLowerCase();
                if (-1 != faultName.indexOf(searchVal)) {
                    arrSuit.push(item);
                }
            }
            _this.initTable(arrSuit);
        }
    }
    return DiagnosisHistory;
})();

