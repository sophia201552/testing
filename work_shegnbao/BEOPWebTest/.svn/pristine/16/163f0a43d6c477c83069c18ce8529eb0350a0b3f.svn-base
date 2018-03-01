/// <reference path="../lib/jquery-1.11.1.min.js" />
/// <reference path="../core/common.js" />
var DiagnosisScreen = (function () {
    var _this = undefined;
    function DiagnosisScreen() {
        this.dictZone = undefined;
        this.dictEquipment = undefined;
        this.dictFault = undefined;
        this.dictObserverText = undefined;
        this.arrLastNotice = undefined;

        this.workerUpdate = undefined;
        this.tabelModelData=undefined;
        this.tableModelUpdate = undefined;
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
        this.judgeProjectId =(AppConfig.projectId == 80) ? true: false;
        _this = this;
    }

    DiagnosisScreen.prototype = {
        show: function () {
            var _this = this;
            Spinner.spin(ElScreenContainer);

            WebAPI.get("/static/views/observer/diagnosisScreen.html").done(function (resultHtml) {
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
            this.dictObserverText = null;
            this.tabelModelData = null;

            this.arrLastNotice = null;
            this.floorCount = null;
            if (this.workerUpdate) this.workerUpdate.terminate();
            this.workerUpdate = null;
            if (this.tableModelUpdate) this.tableModelUpdate.terminate();
            this.tableModelUpdate = null;
            if (this.dialog) this.dialog.close();
            if (this.obScreen) this.obScreen.close();

            if (ToolCurrent) ToolCurrent.close();
        },

        onresize: function () {
            ScreenCurrent.obScreen.resize();
        },

        init: function () {
            var side = new SidebarMenuEffect();
            side.init('#divCanvas');
            this.$obContainer = $('#obContainer');
            this.dictObserverText = {};

            var _this = this;
            WebAPI.get('/diagnosis/getAll/' + AppConfig.projectId).done(function (result) {
                _this.initData(JSON.parse(result));
                // _this.initPaneBuilding();
                _this.initPaneNav();
                if (_this.judgeProjectId) {
                    _this.changeModal();
                    }
                _this.initWorkerForUpdating();
                //切换概览图模板
                if (_this.judgeProjectId) {
                    $('#btnChangeModal').show().off('click').click(function () {
                        var $tabelModelPanel = $('#panelIconNew');
                        if ($tabelModelPanel[0].style.display == 'none' || $tabelModelPanel[0].style.display == '') {
                            Spinner.spin(ElScreenContainer);
                            _this.tableModelDataUpdating();
                            $tabelModelPanel.show();
                            $('#errTipNew').hide();
                            $('.tdFirst').off('click').click(function (e) {
                                    var id = e.target.getAttribute('pageId');
                                    if (id) {
                                        if (_this.obScreen === undefined) {
                                            $tabelModelPanel.hide();
                                            _this.obScreen = new ObserverScreen(id);
                                            _this.initObScreen();
                                            _this.obScreen.show(_this.$obContainer[0]);
                                        } else if (_this.obScreen.id === id) {
                                            $tabelModelPanel.hide();
                                            return;
                                        } else {
                                            $tabelModelPanel.hide();
                                            _this.obScreen.close();
                                            _this.obScreen = new ObserverScreen(id);
                                            _this.initObScreen();
                                            _this.obScreen.show(_this.$obContainer[0]);
                                        }
                                        $(ElScreenContainer).off('click').on('click', '#btnFloorsSP', _this.topFloors);
                                    }
                                    else {
                                        $tabelModelPanel.hide();
                                        alert('This floor has no details');
                                    }
                            });
                            $('.tdFirst').hover(function () {
                                $(this).parent('tr').children('td:not(:first)').addClass('tdShadow');
                                $(this).addClass('tdFirstHover');
                            }, function () {
                                $(this).removeClass('tdFirstHover');
                                $(this).parent('tr').children('td:not(:first)').removeClass('tdShadow');
                            });
                        } else {// if ($('#panelIconNew')[0].style.display == 'block') 
                            $tabelModelPanel.hide();
                            if (_this.tableModelUpdate) _this.tableModelUpdate.terminate();
                            _this.tableModelUpdate = null;

                        }
                    });
                }
                    // 加载默认楼层
                    $('.div-nav-row', '#paneIcon').eq(0).children('span:first').trigger('click');
            });
            //_this.changeModal();

            if (_this.judgeProjectId) {
                $('#divPaneNotice').find('div.panel-body:eq(0)').addClass('noticeAll');
                var $reuseDemand = $('<div id="reuseDemand" class="panel-body gray-scrollbar"></div>');
                $('#divPaneNotice').append($reuseDemand);
            }
            $("#btnNoticeHistory").off().click(function (e) {
                ScreenModal = new DiagnosisHistory(_this);
                ScreenModal.show();
            });
            $("#btnNoticeConfig").off().click(function (e) {
                ScreenModal = new DiagnosisConfig(_this);
                ScreenModal.show();
            });
            
            $('#btnWarningLog').off().click(function(){
                viewLog(this);
                if (_this.judgeProjectId) {
                    $('#reuseDemand').hide();
                    $('#divPaneNotice .noticeAll').show();
                }
                $('#groupUrgent .rows').slideUp();
                $('#groupCritical .rows').slideDown();
                //_this.urgentCount = 0;

            });
            $('#btnAlertLog').off().click(function(){
                viewLog(this);
                if (_this.judgeProjectId) {
                    $('#reuseDemand').hide();
                    $('#divPaneNotice .noticeAll').show();
                }
                $('#groupCritical .rows').slideUp();
                $('#groupUrgent .rows').slideDown();
                //_this.criticalCount = 0;
            });
            if (_this.judgeProjectId) {
                $('#changeDemandPool').show().off().click(function () {
                    viewLog(this);
                    //显示需求池数据
                    var taskPool = new TaskPool();
                    taskPool.show($('#reuseDemand'),80);
                    $('#reuseDemand').show();
                    $('#divPaneNotice .noticeAll').hide();
                });
            }

            $('#btnStickyPost').off().click(function(){
                var $diagnosisLogCt = $('#diagnosisLogCt');
                var $divPaneNotice = $('#divPaneNotice');
                var $divCanvas = $('#divCanvas');
                var $stContainer = $('#st-container');
                var divCanvasWidth = parseInt($divCanvas[0].classList[0].split('-')[2]);

                if($stContainer.find('#diagnosisLogCt')[0]){
                    $diagnosisLogCt.insertAfter($('#st-container'));
                    $diagnosisLogCt.removeClass('st-effect-1');
                    $divPaneNotice.addClass('top');
                    $divCanvas[0].className = 'col-sm-' + (divCanvasWidth + 3);
                    $divCanvas[0].style.positions = 'absolute';
                    $diagnosisLogCt.css({position: 'fixed', top: '54px', zIndex: 2});
                    if(_this.isMin){
                        $diagnosisLogCt.addClass('minLog');
                        $diagnosisLogCt.find('.panel-body').hide();
                        $('#logTitle').hide();
                        $('#btnStickyPost').hide();
                        $('#btnMinimize').hide();
                        $diagnosisLogCt[0].style.minWidth = '';
                    }
                }else{
                    $diagnosisLogCt.insertAfter($divCanvas);
                    $divCanvas[0].className = 'col-sm-' + (divCanvasWidth - 3) + ' st-content';
                    $diagnosisLogCt.addClass('st-effect-1');
                    $divPaneNotice.removeClass('top');
                    $diagnosisLogCt.css({position: 'relative', top: 0});
                    // 修复，“回放”状态下，右侧 panel 固定后，canvas 宽度不正确的问题
                    _this.obScreen.$obCanvasContainer.css('width', '100%');
                }
                $(this).toggleClass('top notTop');
                _this.obScreen.resize();
            });

            $('#btnMinimize').off().click(function(){
                var $diagnosisLogCt = $('#diagnosisLogCt');
                var $paneBody = $diagnosisLogCt.find('.panel-body');
                var $noticeAll, $reuseDemand;
                if (_this.judgeProjectId) {
                    $noticeAll = $diagnosisLogCt.find('.noticeAll');
                    $reuseDemand = $('#reuseDemand');
                }
                if($diagnosisLogCt.parent().prop('className').indexOf("indexContent") > -1){
                    _this.isMin = true;
                    $('#btnStickyPost').click();
                } else {
                    if (_this.judgeProjectId) {
                        if (!$noticeAll.is(':hidden') || !$reuseDemand.is(':hidden')) {
                            $diagnosisLogCt.addClass('minLog');
                            $paneBody.hide();
                            $('#logTitle').hide();
                            $('#btnStickyPost').hide();
                            $('#btnMinimize').hide();
                            $diagnosisLogCt[0].style.minWidth = '';
                        }
                    } else { 
                        if(!$paneBody.is(':hidden')){
                            $diagnosisLogCt.addClass('minLog');
                            $paneBody.hide();
                            $('#logTitle').hide();
                            $('#btnStickyPost').hide();
                            $('#btnMinimize').hide();
                            $diagnosisLogCt[0].style.minWidth = '';
                        }
                    }
                }
            });

            function viewLog(obj){
                var $diagnosisLogCt = $('#diagnosisLogCt');
                var $paneBody = $diagnosisLogCt.find('.panel-body');
                if($paneBody.is(':hidden')){
                    $diagnosisLogCt.removeClass('minLog');
                    $paneBody.show();
                    $('#logTitle').show();
                    //$('#btnNoticeConfig').show();
                    //$('#btnNoticeHistory').show();
                    $('#btnStickyPost').show();
                    $('#btnMinimize').show();
                    //$('#btnAlertLog').removeClass('bigGap');
                    //$('#btnWarningLog').removeClass('bigGap');
                    $diagnosisLogCt.css({minWidth: '260px'});
                }
            }
            $('#btnChangeAlarm').click(function (e) {
                var $this = $(this);
                var level = parseInt($('#selectAlarmLevel').find('option:selected').attr('setval'));
                var delayVal = $('#selectAlarmTime').find('option:selected').attr('setval');
                var now = (new Date()).getTime();
                var time, status = 0;
                if (0 == delayVal) {
                    time = new Date(now);
                    status = 1;
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
                time = time.format("yyyy-MM-dd HH:mm:ss");
                var postData = {
                    'id': _this.faId,
                    'userId': _this.faUserId,
                    'isUserDefined': true,
                    'userFaultGrade': level,
                    'userFaultDelay': time,
                    status: status
                };

                // 禁用按钮，防止多点
                var text = $this.text();
                $this.text('Waiting').prop('disabled', true);
                WebAPI.post('/diagnosis/fault/customUpdate/' + AppConfig.projectId, postData).done(function (result) {
                    var data = JSON.parse(result);
                    if (data) {
                        var oldLevel = _this.dictFault[_this.faId].userFaultGrade;
                        var $divFault = $('.rows div[faultid="'+ _this.faId +'"]');
                        var groupId = $divFault.closest('ul').attr('id');

                        if(delayVal != 0) {
                            if(groupId == 'groupCritical'){
                                _this.criticalCount --;
                            } else {
                                _this.urgentCount --;
                            }
                            $divFault.remove();
                        } else if(oldLevel != level) {
                            var $newRows = undefined;
                            if(groupId == 'groupCritical'){
                                $newRows = $('#groupUrgent .rows');
                                _this.criticalCount --;
                                _this.urgentCount ++;
                            }else{
                                $newRows = $('#groupCritical .rows');
                                _this.urgentCount --;
                                _this.criticalCount ++;
                            }
                            $divFault.detach().prependTo($newRows);
                        }
                        
                        $('#btnAlertLog .badge').html(_this.urgentCount);
                        $('#btnWarningLog .badge').html(_this.criticalCount);

                        _this.dictFault[_this.faId].isUserDefined = true;
                        _this.dictFault[_this.faId].userFaultGrade = level;
                        _this.dictFault[_this.faId].userFaultDelay = time;
                        _this.dictFault[_this.faId].grade = level;

                        var highestGrade = level;
                        var modelTextId = $divFault[0].dataset.modaltextid;
                        if(delayVal != 0) {
                            highestGrade = 0;
                        } else {
                            var faultIdList = [];
                            for ( var t in _this.dictEquipment ) {
                                if( _this.dictEquipment[t].modalTextId == modelTextId ) {
                                    faultIdList = faultIdList.concat( _this.dictEquipment[t].faultIds.concat() );
                                }
                            }
                            faultIdList.forEach(function (id) {
                                if(highestGrade > _this.dictFault[id].grade) {
                                    highestGrade = _this.dictFault[id].grade;
                                }
                            });
                        }
                        
                        _this.obScreen.dictTexts[modelTextId].updateDiagnosisGrade(highestGrade);

                        // 更新左侧小地图
                        var $ele = $('#paneIcon').find('[data-modaltextid="'+modelTextId+'"]');
                        _this.updatePaneNavWarning($ele[0], highestGrade);
                    }
                }).error(function (result) {
                }).always(function (e) {
                    $('#dlgChangeRule').modal('hide');
                    $('#dlgChangeRule').one('hidden.bs.modal', function () {
                        $this.text(text).prop('disabled', false);
                    });
                });
            });
        },
        topFloors: function(){
            var $floorCt = $('#floorCt');
            var $divCanvas = $('#divCanvas');
            if (AppConfig.projectId == 80) { 
                var $panelIconNew = $('#panelIconNew');
                }
            var $stContainer = $('#st-container');
            var divCanvasWidth = parseInt($divCanvas[0].classList[0].split('-')[2]);
            var $paneIcon = $('#paneIcon');

            if($stContainer.find('#floorCt')[0]){
                $floorCt.insertBefore($('#st-container'));
                $floorCt.removeClass('st-effect-7').removeClass('st-menu').addClass('floorTop');
                $stContainer.removeClass('st-menu-open');
                //if ($('#showSurveyChart').hasClass('glyphicon-eye-close')) {
                   // $divCanvas[0].className = 'col-sm-' + (divCanvasWidth + 1);
                //} else {
                $divCanvas[0].className = 'col-sm-' + (divCanvasWidth + 2);
                if (AppConfig.projectId == 80) { 
                    $panelIconNew[0].className = 'col-sm-' + (divCanvasWidth + 2);
                    $panelIconNew.find('table').css('margin-left', '20%');
                }
                //}
                $divCanvas[0].style.positions = 'absolute';
                $paneIcon[0].style.height = ($('#floorCt').height() - 34) + 'px';
            }else{
                $floorCt.insertBefore($divCanvas);
                //if ($('#showSurveyChart').hasClass('glyphicon-eye-close')) {
                    //$divCanvas[0].className = 'col-sm-' + (divCanvasWidth - 1);
                //} else {
                $divCanvas[0].className = 'col-sm-' + (divCanvasWidth - 2);
                if (AppConfig.projectId == 80) {
                    $panelIconNew[0].className = 'col-sm-' + (divCanvasWidth - 2);
                    $panelIconNew.find('table').css('margin-left', '10%');
                }
                    //}
                $floorCt.addClass('st-effect-7').addClass('st-menu').removeClass('floorTop');
                $stContainer.addClass('st-menu-open');
                $paneIcon.removeAttr('style');
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
                        elapse = new Date() - (item.userModifyTime).toDate();
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
        tableModelDataUpdating: function () {
            this.tableModelUpdate = new Worker("/static/views/js/worker/workerUpdate.js");
            this.tableModelUpdate.self = this;
            this.tableModelUpdate.addEventListener("message", this.refreshTableModelData, true);
            this.tableModelUpdate.addEventListener("error", function (e) {
                console.log(e);
                Spinner.stop();
            }, true);
            this.tableModelUpdate.postMessage({ pointList: this.tabelModelData, projectId: AppConfig.projectId, type: "dataRealtime" });
        },
        initObScreen: function () {
            this.obScreen.isInDiagnosis = true;
            this.obScreen.diagScreen = this;
        },

        resetFloor: function () {
            this.refreshData({ data: this.arrLastNotice });
        },
        clearNullArr: function (arr) {
            for (var i = 0, len = arr.length; i < len; i++)
            {
                if (arr[i] == "" || typeof (arr[i]) == "undefined")
                {
                    arr.splice(i, 1);
                    len--;
                    i--;
                }
            }
            return arr;
        },
        gradientColors: function (colorArr, $gradientDom, valueCurrent, max, min) {
            //根据传入数据值和想要几种渐变色进行颜色渐变
            //说明：colorArr为颜色数组，模式固定rgb()可扩展，max和min是整体数的渐变范围
            var valueMark = (max - min) / (colorArr.length - 1);//获得取色范围间隔
            //var valueCurrent = (max + min) / 2;//获取当前值
            var regexp = /[0-9]{0,3}/g;//为提取rgb数字
            for (var i = 0; i < colorArr.length - 1; i++) {
                var colorMaxValue = min +(i +1) * valueMark;//每个间隔的最大值
                if (valueCurrent > colorMaxValue) continue;
                var colorSelPre = colorArr[i];//获得当前渐变范围开始颜色
                var colorSelTo = colorArr[i + 1];//获得当前渐变范围结束颜色
                var colorValPreArr =[];
                colorValPreArr = colorSelPre.match(regexp);//获得当前渐变范围开始颜色rgb色值组
                _this.clearNullArr(colorValPreArr);
                var colorValToArr = [];
                colorValToArr = colorSelTo.match(regexp);//获得当前渐变范围结束颜色rgb色值组
                _this.clearNullArr(colorValToArr);
                var colorMinValue = min + i * valueMark;//每个间隔的最小值
                if (i == colorArr.length - 2) {
                    colorMaxValue = max;//防止除不尽时，最后个间隔不全的情况
                }
                if (valueCurrent <= colorMaxValue) {
                    $gradientDom.css('background', 'rgb(' + (parseInt((parseInt(colorValToArr[0] - colorValPreArr[0]) * (valueCurrent - colorMinValue) / (colorMaxValue - colorMinValue)).toFixed(0)) + parseInt(colorValPreArr[0])) + ',' + (parseInt((parseInt(colorValToArr[1] - colorValPreArr[1]) * (valueCurrent - colorMinValue) / (colorMaxValue - colorMinValue)).toFixed(0)) + parseInt(colorValPreArr[1])) + ',' + (parseInt((parseInt(colorValToArr[2] - colorValPreArr[2]) * (valueCurrent - colorMinValue) / (colorMaxValue - colorMinValue)).toFixed(0)) + parseInt(colorValPreArr[2])) + ')');
                        i = colorArr.length - 1;
                    }
            }
        },
        refreshTableModelData: function (e) {
            var dataNumber = e.data;
            for (var beforeN in dataNumber) {
                if ((dataNumber[beforeN].name).split('_')[1] == 'InFiAvT') {
                    var beforeNumber = (dataNumber[beforeN].name).split('_')[0];
                    //var beforeValue = dataNumber[beforeN].value;
                    var beforeValue = Math.random() * 10 + 20;
                    var valueCurrent;
                    for (var resultN in dataNumber) {
                        resultName = dataNumber[resultN].name;
                        if (resultName.split('_')[1] == 'OutFiAvT' && resultName.split('_')[0].split('FZ')[0] == beforeNumber.split('FZ')[0] && resultName.split('_')[0].split('FZ')[1] == beforeNumber.split('FZ')[1]) {
                            dataNumber[resultN].value = Math.random() * 10 + 20;
                            $('.rc' + beforeNumber.split('FZ')[0] + '_' + beforeNumber.split('FZ')[1]).html(((beforeValue + dataNumber[resultN].value) / 2).toFixed(0));
                            //.css({ 'background': 'rgba(' + parseInt((245 - 237) * (((beforeValue + dataNumber[resultN].value) / 2).toFixed(1) - 20) / 10 + 237) + ',' + parseInt((63 - 226) * (((beforeValue + dataNumber[resultN].value) / 2).toFixed(1) - 20) / 10 + 226) + ',' + parseInt((82 - 76) * (((beforeValue + dataNumber[resultN].value) / 2).toFixed(1) - 20) / 10 + 76) + ',0.9)' });//此处
                            valueCurrent = ((dataNumber[resultN].value)+beforeValue)/2;
                            _this.gradientColors(['rgb(61,100,255)', 'rgb(70,215,31)','rgb(255,190,0)'], $('.rc' + beforeNumber.split('FZ')[0] + '_' + beforeNumber.split('FZ')[1]), valueCurrent,30,20);//
                        }
                    }
                }
            }
            Spinner.stop();
        },
        refreshData: function (e) {
            _this = this.self ? this.self : this;
            if (e.data && !e.data.error && e.data[0]) {
                var existedIds = [];
                for(var i in _this.arrLastNotice){
                    existedIds.push(_this.arrLastNotice[i].id);
                }
                if($.inArray(e.data[0].id, existedIds) < 0){
                    Array.prototype.push.apply(e.data, _this.arrLastNotice);
                    _this.arrLastNotice = e.data;
                }

                for (var key in _this.dictEquipment) {
                    _this.dictEquipment[key].faultIds = new Array();
                }

                var dictFaultHighestGrade = {};
                for (var i = 0; i < e.data.length; i++) {
                    var faultId = e.data[i].faultId, equipmentId = _this.dictFault[faultId].equipmentId;
                    var grade;
                    _this.dictEquipment[equipmentId].faultIds.push(faultId);

                    grade = dictFaultHighestGrade[equipmentId];
                    if (!grade || _this.dictFault[faultId].grade > grade)
                        dictFaultHighestGrade[equipmentId] = _this.dictFault[faultId].grade;
                }

                for (var key in dictFaultHighestGrade) {
                    if (_this.dictObserverText[key])
                        _this.dictObserverText[key].updateDiagnosisGrade(dictFaultHighestGrade[key]);
                }

                if (this.self) _this.renderPaneNoticeGroup();
                Spinner.stop();
            } else {
                //new Alert(ElScreenContainer, Alert.type.danger, I18n.resource.code[e.data.error]).showAtTop(5000);
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
                    if (AppConfig.projectId==80) { 
                        $('#panelIconNew').hide();
                        }
                    var id = e.target.getAttribute('pageId');
                    if (id) {
                        if( _this.obScreen === undefined ) {
                            _this.obScreen = new ObserverScreen(id);
                            _this.initObScreen();
                            _this.obScreen.show(_this.$obContainer[0]);
                        } else if(_this.obScreen.id === id) {
                            return;
                        } else {
                            _this.obScreen.close();
                            _this.obScreen = new ObserverScreen(id);
                            _this.initObScreen();
                            _this.obScreen.show(_this.$obContainer[0]);
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
            paneIcon.style.height = ($('#floorCt').height() - 34) + 'px';
            //隐藏/显示概览小图
            if (_this.judgeProjectId) {
                $('#showSurveyChart').show().off('click').click(function () {
                    var $spanIconTotal;
                    if ($(this).hasClass('glyphicon-eye-open')) {
                        for (var i = 0; i < $('.div-nav-row').length; i++) {
                            $($('.div-nav-row')[i]).addClass('div-nav-row-hide');
                            $spanIconTotal = $($('.div-nav-row')[i]).find('span:not(:first)');
                            if ($spanIconTotal) {
                                $spanIconTotal.css('display', 'none');
                            }
                        }
                        $(this).removeClass('glyphicon-eye-open').addClass('glyphicon glyphicon-eye-close');
                        $('#floorCt').find('.panel-default').addClass('panelViewHide');
                    } else if ($(this).hasClass('glyphicon-eye-close')) {
                        for (var i = 0; i < $('.div-nav-row').length; i++) {
                            $($('.div-nav-row')[i]).removeClass('div-nav-row-hide');
                            $spanIconTotal = $($('.div-nav-row')[i]).find('span:not(:first)');
                            if ($spanIconTotal) {
                                $spanIconTotal.css('display', 'inline-block');
                            }
                        }
                        $(this).removeClass('glyphicon-eye-close').addClass('glyphicon glyphicon-eye-open');
                        $('#floorCt').find('.panel-default').removeClass('panelViewHide');
                    }
                });
            }
        },
        //切换模板
        changeModal: function () {
            var _this = this;
            var $spanRow, $spanCeil, item, $spanRowOne;
            var $tabelModelPanel = $('#panelIconNew');
            var inFiAvTDt, outFiAvTDt;
            var requestData = [];
            //var equipIdsArr = [];
            //var equipIdsMax;
            //获得最多点的值
            //for (var i in this.dictZone){
            //    equipIdsArr[i] = this.dictZone[i].equipmentIds.length;
            //}
            //equipIdsMax = equipIdsArr[0];
            //for(var equipId in equipIdsArr){
            //    equipIdsMax = equipIdsMax >= equipIdsArr[equipId] ? equipIdsMax : equipIdsArr[equipId];
            //}
            //添加第一行
            //$panelIconNew = $('<table id="panelIconNew" style="width:100%;display:none; border:1px solid #fff;border-collapse:collapse"><tr class="tabelHead" style="border-bottom:1px solid #fff"></tr></table>');
            //for (var k = 0; k <= equipIdsMax; k++) {
            //    $spanRowOne = $('<td></td>');
            //    if (k == 0) {
            //        $spanRowOne.html('');
            //    } else {
            //        $spanRowOne.html(k);
            //    }
            //    $panelIconNew.find('tr.tabelHead').append($spanRowOne);
            //}
            //for (var zoneId in this.dictZone) {
            //    item = this.dictZone[zoneId];
            //    if(item){
            //        if (item.equipmentIds && item.equipmentIds.length == 0) continue;
            //        $spanRow = $('<tr></tr>');
            //        if (item.equipmentIds.length == 0) {
            //            $spanRow.innerHTML += "<td></td>";
            //        } else {
            //            for (var j = 0; j <= equipIdsMax; j++) {//item.equipmentIds.length
            //                $spanCeil = $('<td></td>');
            //                if (j == 0) {
            //                    $spanCeil.html(item.subBuildingName);
            //                    $spanCeil.css({ 'width': '2.2%', 'border-right': '1px solid #fff', 'border-bottom': '1px solid #fff' });
            //                }
            //                else {
            //                    $spanCeil.css({ 'width': '1.3%','border':'1px solid #333' });
            //                    if (j > item.equipmentIds.length) {
            //                        $spanCeil.html('');
            //                    }
            //                }
            //                $spanRow.append($spanCeil);
            //            }
            //        }
            //    }
            //    $panelIconNew.append($spanRow);
            //}
            $tabelModelPanel = $('<div id="panelIconNew" class="col-sm-12"><table></table></div>');
            var $tabelHead = $('<tr class="tabelHead"></tr>')
            for (var k = 19; k > 0;k--){
                $spanRowOne = $('<td></td>');
                if (k == 19) {
                    $spanRowOne.html('');
                } else {
                    $spanRowOne.html(k);
                }
                $tabelHead.append($spanRowOne);
            }
            $tabelModelPanel.find('table').append($tabelHead);
            for (var i = 44; i > 0;i--){
                $spanRow = $('<tr></tr>');
                if (i < 10) {
                    i = '0' + i;
                }
                for (var j = 19; j >0; j--) {//item.equipmentIds.length
                    $spanCeil = $('<td></td>');
                    if (j == 19) {
                        $spanCeil.html(i+'F');
                        $spanCeil.addClass('tdFirst');
                        if (i == 44) {
                            $spanCeil.attr('pageId','1');
                        } else if (i == 43) {
                            $spanCeil.attr('pageId', '2');
                        }else if(i==42){
                            $spanCeil.attr('pageId', '120000221');
                        } else if (i == 41) {
                            $spanCeil.attr('pageId', '100000173');
                        }
                    }
                    else {
                       // $spanCeil.css({ 'width': '0.5%', 'border': '1px solid #d0d0d0', 'color': '#839198' });
                        //数据为i+‘FZ’+J+'_InFiAvT'和i+‘FZ’+J+'OutFiAvT'
                        if (j < 10) {
                            j = '0' + j;
                        }
                        inFiAvTDt = i + 'FZ' + j + '_InFiAvT';
                        outFiAvTDt = i + 'FZ' + j + '_OutFiAvT';
                        requestData.push(inFiAvTDt);
                        requestData.push(outFiAvTDt);
                        $spanCeil.addClass('rc' + i + '_' + j);
                        $spanCeil.addClass('tdData');
                        //$spanCeil.html();
                    }
                    $spanRow.append($spanCeil);
                }
                $tabelModelPanel.find('table').append($spanRow);
            }
            //WebAPI.post('/get_realtimedata', { pointList: requestData, proj: AppConfig.projectId }).done(function (result) {
            //    var dataNumber = JSON.parse(result);
            //    for (var beforeN in dataNumber) {
            //        if ((dataNumber[beforeN].name).split('_')[1] == 'InFiAvT') {
            //            var beforeNumber = (dataNumber[beforeN].name).split('_')[0];
            //            //var beforeValue = dataNumber[beforeN].value;
            //            var beforeValue=Math.random()*10+20;
            //            for (var resultN in dataNumber) {
            //                resultName = dataNumber[resultN].name;
            //                if (resultName.split('_')[1] == 'OutFiAvT' && resultName.split('_')[0].split('FZ')[0] == beforeNumber.split('FZ')[0] && resultName.split('_')[0].split('FZ')[1] == beforeNumber.split('FZ')[1]) {
            //                    dataNumber[resultN].value = Math.random() * 10 + 20;
            //                    $('.rc' + beforeNumber.split('FZ')[0] + '_' + beforeNumber.split('FZ')[1]).html(((beforeValue + dataNumber[resultN].value) / 2).toFixed(1))
            //                                                                                              .css({ 'background': 'rgba(' + parseInt((40 - 214) * (((beforeValue + dataNumber[resultN].value) / 2).toFixed(1) - 20) / 10 + 214) + ',' + parseInt((14 - 238) * (((beforeValue + dataNumber[resultN].value) / 2).toFixed(1) - 20) / 10 + 238) + ',' + parseInt((238 - 14) * (((beforeValue + dataNumber[resultN].value) / 2).toFixed(1) - 20) / 10 + 14) + ',0.9)' });//此处
            //                }
            //            }
            //        }
            //    }

            //});
            //Spinner.spin(ElScreenContainer);
            this.tabelModelData = requestData;
            //this.tableModelDataUpdating();

            $tabelModelPanel.insertBefore($('#divCanvas'));
        },
        createWorkflowOrder: function (notice, fault) {
            var momentTime = notice.time.toDate();

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

            var divBody = $('<div class="panel-body gray-scrollbar" style="height:calc(100% - 41px);overflow-y:auto;display:none;"></div>');
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

            if(_this.criticalCount > 0){
                $('#btnWarningLog').find('.badge').html(_this.criticalCount);
            }
            if(_this.urgentCount > 0){
                $('#btnAlertLog').find('.badge').html(_this.urgentCount);
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
            var $spWrap = $('<div style="white-space: nowrap;">');

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
            $spWrap.append(span);


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
                }).appendTo($spWrap);


            $('<span>').attr({
                'title': 'Triggering time',
                'data-time': item.time
            }).text(item.time.toDate().format("MM-dd HH:mm"))
                .css('text-decoration', 'underline').css('font-weight', 'bold').appendTo($spWrap);

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
                            var timeDelay = userFaDelay.toDate();
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
                }).appendTo($spWrap);

            if (item.orderId && item.orderId != 0 && item.orderId != '') {
                $('<span>').addClass('glyphicon glyphicon-tags grow span-hover-pointer span-btn')
                    .attr('title', 'Show workflow order')
                    .attr('workflow', item.orderId)
                    .click(function (e) {
                        if (ScreenCurrent) ScreenCurrent.close();
                        ScreenCurrent = new workflowNoticeDetail(e.currentTarget.getAttribute('workflow'), null, null);
                        ScreenCurrent.show();
                    }).appendTo($spWrap);
            } else {
                $('<span>').addClass('glyphicon glyphicon-share grow span-hover-pointer span-btn')
                    .attr('title', 'Create workflow order')
                .click(function (e) {
                    _this.createWorkflowOrder(item, fault);
                }).appendTo($spWrap);
            }

            parent.append($spWrap);
            $('<p>').addClass('pFaultName').css({'font-weight': 'bold', 'padding': '0 8px 0 0'}).text(fault.name).appendTo(parent);

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

            WebAPI.get("/static/views/observer/diagnosis/paneHistory.html").done(function (resultHtml) {
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
                var startTime = ($("#txtLogDate").val() + ' 00:00:00').toDate();
                var endTime = new Date(+startTime + 86400000);
                _this.refreshData(startTime, endTime);
            });

            $("#btnLogPre").off('click').click(function (e) {
                var endTime = ($("#txtLogDate").val() + ' 00:00:00').toDate();
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
                sb.append('<td>').append(item.time.toDate().format("yyyy-MM-dd HH:mm:ss")).append('</td>');
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

