/// <reference path="../lib/jquery-2.1.4.min.js" />
/// <reference path="../core/common.js" />
var DiagnosisScreen = (function () {
    var _this = undefined;

    function DiagnosisScreen() {
        this.dictZone = undefined;
        this.dictEquipment = undefined;
        this.dictObserverText = undefined;
        this.arrLastNotice = [];

        this.workerUpdate = undefined;
        this.tabelModelData = undefined;
        this.tableModelUpdate = undefined;
        this.floorCount = 0;
        this.dialog = undefined;
        this.langCfg = I18n.resource.diagnosis.config;
        this.noticeId = 0;
        this.faId = 0;
        this.faUserId = 0;

        this.obScreen = undefined;
        this.$obContainer = undefined;
        this.urgentCount = 0;
        this.criticalCount = 0;
        this.judgeProjectId = (AppConfig.projectId == 80) ? true : false;
        _this = this;
    }

    DiagnosisScreen.prototype = {
        show: function () {
            var _this = this;
            Spinner.spin(ElScreenContainer);

            WebAPI.get("/static/views/observer/diagnosisScreen.html").done(function (resultHtml) {
                $(ElScreenContainer).html(resultHtml);
                I18n.fillArea($(ElScreenContainer));
                Spinner.spin(ElScreenContainer);
                _this.init();
            });
        },

        close: function () {
            this.dictZone = null;
            this.dictEquipment = null;
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
            WebAPI.get('/diagnosis/getStruct/' + AppConfig.projectId).done(function (result) {
                _this.initStructData(result);
                _this.initPaneNav();
                if (_this.judgeProjectId) {
                    _this.changeModal();
                }
                //_this.initWorkerForUpdating();
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
                                        tabelModelClose();
                                        _this.showObserver(_this, id);
                                    } else if (_this.obScreen.id === id) {
                                        tabelModelClose();
                                        return;
                                    } else {
                                        tabelModelClose();
                                        _this.obScreen.close();
                                        _this.showObserver(_this, id);
                                    }
                                    // $(ElScreenContainer).off('click').on('click', '#btnFloorsSP', _this.topFloors);
                                }
                                else {
                                    tabelModelClose();
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
                        } else {
                            tabelModelClose();

                        }
                    });
                }
                // 加载默认楼层
                $('.subBuildingBtn', '#paneIcon').eq(0).trigger('click');
                $('.div-nav-row', '#paneIcon').eq(0).children('span:first').trigger('click');
            });


            //关闭tableModal页面并关闭线程
            function tabelModelClose() {
                $('#panelIconNew').hide();
                if (_this.tableModelUpdate) _this.tableModelUpdate.terminate();
                _this.tableModelUpdate = null;
            }

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

            $('#btnWarningLog').off().click(function () {
                var $diagnosisLogCt = $('#diagnosisLogCt');
                var $btnPin = $('#btnStickyPost');
                if ($diagnosisLogCt.is(':hidden')) {
                    viewLog(this);
                    if (_this.judgeProjectId) {
                        $('#reuseDemand').hide();
                        $('#divPaneNotice .noticeAll').show();
                    }
                    $btnPin.show();
                    $diagnosisLogCt.slideDown();
                } else {
                    $btnPin.hide();
                    $diagnosisLogCt.hide();
                    $('#divCanvas').attr('class', 'col-sm-12');
                }
            });

            $('#btnStickyPost').off().click(function () {
                var $divCanvas = $('#divCanvas');
                $divCanvas.attr('class', $divCanvas.hasClass('col-sm-12') ? 'col-sm-9' : 'col-sm-12');
                _this.obScreen.resize();
            });

            function viewLog(obj) {
                var $diagnosisLogCt = $('#diagnosisLogCt');
                if ($diagnosisLogCt.is(':hidden')) {
                    $diagnosisLogCt.slideDown();
                }
            }

            $('#btnChangeAlarm').click(function (e) {
                var $this = $(this);
                var level = parseInt($('#selectAlarmLevel').find('option:selected').attr('setval'));
                var delayVal = $('#selectAlarmTime').find('option:selected').attr('setval');
                var changeVal = $('#dlgChangeRule').find('#selectAlarmLevel option:selected').html();
                var $changeEle, $changeSpan;
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
                    var data = result;
                    if (data) {
                        var $divFault = $('#divPaneNoticeItem div[faultid="' + _this.faId + '"]');

                        for (var i = 0; i < _this.arrLastNotice.length; i++) {
                            if (_this.arrLastNotice[i].id == _this.noticeId) {
                                _this.arrLastNotice[i].grade = level;
                            }
                        }

                        var modelTextId = $divFault.attr('data-modaltextid');
                        if (_this.obScreen.dictTexts[modelTextId]) {
                            _this.obScreen.dictTexts[modelTextId].updateDiagnosisGrade(level);
                        }
                        if (status == 0) {
                            _this.criticalCount--;
                            $('#btnWarningLog .badge').html(_this.criticalCount);
                            $divFault.remove();
                        }
                    }
                }).error(function (result) {
                }).always(function (e) {
                    $('#dlgChangeRule').modal('hide');
                    $('#dlgChangeRule').one('hidden.bs.modal', function () {
                        $this.text(text).prop('disabled', false);
                    });
                });
                $changeEle = $('.div-pane-log[faultid=' + _this.noticeId + ']');
                $changeSpan = $changeEle.find('div:first-child').find('span:first-child')
                $changeSpan.html(changeVal);
                if ($changeEle.hasClass('adNormal')) {
                    if (changeVal !== _this.langCfg.LEVEL_SET.CRITICAL) {
                        $changeEle.removeClass('adNormal').addClass('faultPro');
                        $changeSpan.css('background-color', 'rgba(217, 83, 79, 0.9)');
                    }
                } else {
                    if (changeVal !== _this.langCfg.LEVEL_SET.URGENT) {
                        $changeEle.removeClass('faultPro').addClass('adNormal');
                        $changeSpan.css('background-color', 'rgba(240, 173, 78, 0.9)');
                    }
                }
            });
            //左侧导航显示隐藏事件
            var $flootCt = $('#floorCt');
            var $floorPB = $flootCt.find('.showCont'); //$('#floorCt .showCont');
            var $floorPH = $flootCt.find('.panel-default');//$('#floorCt .panel-default');
            $flootCt.find('.panel-heading').off('click').click(function () {
                $floorPH.hide();
                $floorPB.show();
            });
            $floorPB.off('click').click(function () {
                $(this).hide();
                $floorPH.show();
            });
        },
        initStructData: function (data) {
            var item, arr;
            this.dictZone = new Object();
            this.dictEquipment = new Object();
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
                //item.equipmentIds = new Array();
                var equipments = [];

                for (var j = 0; j < data.equipments.length; j++) {
                    if (data.equipments[j].zoneId == item.id) {
                        //item.equipmentIds.push(data.equipments[j].id);
                        equipments.push({equipmentId: data.equipments[j].id, equipmentName: data.equipments[j].name})
                    }
                }
                this.dictZone[item.id] = item;

                if (tempBuildingId != item.buildingId) {
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
                } else {
                    var subBuilding = {
                        subBuildId: item.subBuildingId,
                        subBuildName: item.subBuildingName,
                        equipments: equipments
                    }
                    this.buildings[index].subBuilds.push(subBuilding);
                }
            }
        },

        initWorkerForUpdating: function () {
            if (this.workerUpdate) {
                this.workerUpdate.terminate();
            }
            this.workerUpdate = new Worker("/static/views/js/worker/workerUpdate.js");
            this.workerUpdate.self = this;
            this.workerUpdate.addEventListener("message", this.refreshData, true);
            this.workerUpdate.addEventListener("error", function (e) {
                console.log(e)
            }, true);
            this.workerUpdate.postMessage({
                projectId: AppConfig.projectId,
                type: "diagnosisScreen",
                zoneId: AppConfig.zoneId
            });
        },
        tableModelDataUpdating: function () {
            this.tableModelUpdate = new Worker("/static/views/js/worker/workerUpdate.js");
            this.tableModelUpdate.self = this;
            this.tableModelUpdate.addEventListener("message", this.refreshTableModelData, true);
            this.tableModelUpdate.addEventListener("error", function (e) {
                console.log(e);
                Spinner.stop();
            }, true);
            this.tableModelUpdate.postMessage({
                pointList: this.tabelModelData,
                projectId: AppConfig.projectId,
                type: "dataRealtime"
            });
        },
        initObScreen: function () {
            this.obScreen.isInDiagnosis = true;
            this.obScreen.diagScreen = this;
        },

        //切换左侧导航条选择zone后执行
        resetFloor: function () {
            this.refreshData({data: {notice: this.arrLastNotice}}, true);
        },
        clearNullArr: function (arr) {
            for (var i = 0, len = arr.length; i < len; i++) {
                if (arr[i] == "" || typeof (arr[i]) == "undefined") {
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
                var colorMaxValue = min + (i + 1) * valueMark;//每个间隔的最大值
                if (valueCurrent > colorMaxValue) continue;
                var colorSelPre = colorArr[i];//获得当前渐变范围开始颜色
                var colorSelTo = colorArr[i + 1];//获得当前渐变范围结束颜色
                var colorValPreArr = [];
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
            var dataNumber = e.data, resultName = undefined;
            for (var beforeN in dataNumber) {
                if ((dataNumber[beforeN].name).split('_')[2] == 'InFiAvT') {
                    var buildNum = (dataNumber[beforeN].name).split('_')[0].substring(0, 2);
                    var zoneNum = (dataNumber[beforeN].name).split('_')[1].substring(6, 8);
                    var beforeValue = dataNumber[beforeN].value ? parseFloat(dataNumber[beforeN].value) : 0;
                    var valueCurrent;
                    for (var resultN in dataNumber) {
                        resultName = dataNumber[resultN].name;
                        var afterValue = dataNumber[resultN].value ? parseFloat(dataNumber[resultN].value) : 0;
                        if (resultName.split('_')[2] == 'OutFiAvT' && resultName.split('_')[0].substring(0, 2) == buildNum && resultName.split('_')[1].substring(6, 8) == zoneNum) {
                            valueCurrent = parseInt(((afterValue + beforeValue) / 2).toFixed(0));
                            $('.rc' + buildNum + '_' + zoneNum).html(valueCurrent);//((beforeValue + afterValue) / 2).toFixed(0)
                            //.css({ 'background': 'rgba(' + parseInt((245 - 237) * (((beforeValue + dataNumber[resultN].value) / 2).toFixed(1) - 20) / 10 + 237) + ',' + parseInt((63 - 226) * (((beforeValue + dataNumber[resultN].value) / 2).toFixed(1) - 20) / 10 + 226) + ',' + parseInt((82 - 76) * (((beforeValue + dataNumber[resultN].value) / 2).toFixed(1) - 20) / 10 + 76) + ',0.9)' });//此处
                            //冬季中间值20范围16~24    夏季中间值26范围22-30   值为0时灰色显示     16色值为蓝   24色值为红
                            //valueCurrent = parseInt((Math.random() * 10 + 14).toFixed(0));
                            if (valueCurrent === 0) {
                                $('.rc' + buildNum + '_' + zoneNum).css('background', '#d0d0d0');
                            } else {
                                _this.gradientColors(['rgb(0,0,255)', 'rgb(255,255,255)', 'rgb(255,0,0)'], $('.rc' + buildNum + '_' + zoneNum), valueCurrent, 24, 16);//rgb(61,100,255)rgb(255,190,0)
                            }
                        }
                    }
                }
            }
            Spinner.stop();
        },
        refreshData: function (e, isOnlyRenderDictFault) {
            if (!e.data || $.isEmptyObject(e.data) || e.data.error) return;
            _this = this.self ? this.self : this;
            if (e.data.notice && e.data.notice[0]) {
                _this.arrLastNotice = e.data.notice;

                var existedIds = [];
                for (var i in _this.arrLastNotice) {
                    existedIds.push(_this.arrLastNotice[i].id);
                }
                if ($.inArray(e.data.notice[0].id, existedIds) < 0) {
                    Array.prototype.push.apply(e.data.notice, _this.arrLastNotice);
                    _this.arrLastNotice = e.data.notice;
                }

                for (var key in _this.dictEquipment) {
                    _this.dictEquipment[key].faultIds = new Array();
                }

                try {
                    var dictFaultHighestGrade = {};
                    for (var i = 0; i < e.data.notice.length; i++) {
                        var faultId = e.data.notice[i].faultId, equipmentId = e.data.notice[i].equipmentId;
                        var grade;
                        var eq = _this.dictEquipment[equipmentId];
                        eq.faultIds.push(faultId);

                        grade = dictFaultHighestGrade[eq.modalTextId];
                        if (!grade || e.data.notice[i].grade > grade)
                            dictFaultHighestGrade[eq.modalTextId] = e.data.notice[i].grade;
                    }

                    for (var key in dictFaultHighestGrade) {
                        if (_this.dictObserverText[key])
                            _this.dictObserverText[key].updateDiagnosisGrade(dictFaultHighestGrade[key]);
                    }
                } catch (e) {
                    console.log(e)
                }
                ;

                Spinner.stop();
                $('#spinnerLoadingNotice').remove();
                $('#btnWarningLog').fadeIn();
            } else {
                $('#spinnerLoadingNotice').remove();
                //new Alert(ElScreenContainer, Alert.type.danger, I18n.resource.code[e.data.error]).showAtTop(5000);
            }

            if (isOnlyRenderDictFault) return; //如果是resetFloor调用refreshData, 只需渲染页面的缺陷高亮, 诊断缺陷个数及诊断信息面板无需渲染,故return

            //渲染诊断缺陷个数
            $('.badge.faultCount', '#paneIcon').empty();//渲染之前清空个数
            if (e.data.count && e.data.count instanceof Array) {
                e.data.count.forEach(function (obj) {
                    for (var i in obj) {
                        var faultCount = parseInt(obj[i]);
                        var $target = $('#navFloor-' + i).next('.faultCount');
                        if (faultCount > 0) {
                            $target.html(faultCount)
                        } else {
                            $target.html('');
                        }
                    }
                });
            }


            // 缺陷个数统计
            _this.statisticFaultCount();

            // 更新诊断信息显示
            _this.renderPaneNoticeGroup();
        },

        initPaneNav: function () {
            var _this = this;
            var pane = document.createElement('div');
            var div, zoneItem, itemI, itemJ;
            var zoneItemList = [];
            var $buildingBox, $subBuilding = $('.subBuilding'), $subBuildingList, countHtml;

            for (var zoneId in this.dictZone) {
                zoneItem = this.dictZone[zoneId];
                zoneItemList.push(zoneItem);
            }
            var paneIcon = document.getElementById('paneIcon');
            paneIcon.innerHTML = "";
            paneIcon.appendChild(pane);
            //pane.style.width = '113px';
            for (var i = 0; i < zoneItemList.length; i++) {
                countHtml = '';
                var isSameBuild = false;
                itemI = zoneItemList[i];
                for (var j = 0; j < zoneItemList.length; j++) {
                    itemJ = zoneItemList[j];
                    if (itemI.buildingId == itemJ.buildingId) {
                        isSameBuild = true;
                        break;
                    }
                }
                if (isSameBuild) {
                    $buildingBox = $('.div-nav-box' + itemI.buildingId);
                    if ($buildingBox.length === 0) {
                        $buildingBox = $('<div class="div-nav-box' + itemI.buildingId + '"><span id="building_' + itemI.buildingId + '" class="grow subBuildingBtn"></span><span class="badge faultCount"></span></div>');
                        $buildingBox.find('#building_' + itemI.buildingId).html(itemI.buildingName);
                        $subBuildingList = $('<div class="subBuildingList" id="subList_' + itemI.buildingId + '"></div>');
                        $buildingBox.append($subBuildingList);
                        $(pane).append($buildingBox);
                    }
                    // 显示诊断缺陷个数
                    if (itemI.count && itemI.count > 0) {
                        countHtml = '<span class="badge faultCount">' + itemI.count + '</span>';
                    } else {
                        countHtml = '<span class="badge faultCount"></span>';
                    }
                    $subBuilding = $('<div class="div-nav-row subBuilding"><span class="div-row-icon-badge grow subBuildingItem" pageId="' + itemI.pageId + '" id="navFloor-' + itemI.id + '"></span>' + countHtml + '</div>');
                    $subBuilding.find('.subBuildingItem').html(itemI.subBuildingName);
                    $('#subList_' + itemI.buildingId).append($subBuilding);
                    $subBuilding.find('.subBuildingItem').off('click').click(function () {
                        var id = $(this).attr('pageId');
                        if (AppConfig.projectId == 80) {
                            $('#panelIconNew').hide();
                        }
                        AppConfig.zoneId = this.id.split('-')[1];
                        //增加选中样式
                        $('.subBuildingItem.selected').removeClass('selected');
                        $(this).addClass('selected');

                        if (id) {
                            if (_this.obScreen === undefined) {
                                _this.showObserver(_this, id);
                            } else if (_this.obScreen.id === id) {
                                return;
                            } else {
                                _this.obScreen.close();
                                _this.showObserver(_this, id);
                            }
                        }
                        else {
                            alert('This floor has no details');
                        }

                        //加载当前楼层的诊断信息
                        _this.arrLastNotice.length = 0;
                        _this.initWorkerForUpdating();
                    });
                }
            }

            // 缺陷个数统计
            this.statisticFaultCount();

            $('.subBuildingBtn').off('click').click(function () {
                $(this).toggleClass('selected');
                var $subBuildListCur = $(this).siblings('.subBuildingList');
                if ($subBuildListCur.is(':visible')) {
                    $subBuildListCur.hide();
                } else {
                    $subBuildListCur.show();
                }
            });

        },

        // 缺陷个数统计
        statisticFaultCount: function () {
            $('[class ^="div-nav-box"]').each(function () {
                var count = 0;
                $(this).children('.subBuildingList').find('.faultCount').not(':empty').each(function () {
                    var text = $(this).text();
                    if (Number(text).toString() != 'NaN') {
                        count += parseInt(text);
                    }
                })
                if (count > 0) {
                    $(this).children('.faultCount').html(count);
                } else {
                    $(this).children('.faultCount').html('');
                }
            });
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
            for (var k = 19; k > 0; k--) {
                $spanRowOne = $('<td></td>');
                if (k == 19) {
                    $spanRowOne.html('');
                } else {
                    $spanRowOne.html(k);
                }
                $tabelHead.append($spanRowOne);
            }
            $tabelModelPanel.find('table').append($tabelHead);
            for (var i = 44; i > 0; i--) {
                $spanRow = $('<tr></tr>');
                if (i < 10) {
                    i = '0' + i;
                }
                for (var j = 19; j > 0; j--) {//item.equipmentIds.length
                    $spanCeil = $('<td></td>');
                    if (j == 19) {
                        $spanCeil.html(i + 'F');
                        $spanCeil.addClass('tdFirst');
                        if (i == 44) {
                            $spanCeil.attr('pageId', '1');
                        } else if (i == 43) {
                            $spanCeil.attr('pageId', '2');
                        } else if (i == 42) {
                            $spanCeil.attr('pageId', '120000221');
                        } else if (i == 41) {
                            $spanCeil.attr('pageId', '100000173');
                        } else if (i == 15) {
                            $spanCeil.attr('pageId', '20000027');
                        } else if (i == 16) {
                            $spanCeil.attr('pageId', '20000028');
                        }
                    }
                    else {
                        // $spanCeil.css({ 'width': '0.5%', 'border': '1px solid #d0d0d0', 'color': '#839198' });
                        //数据为i+‘FZ’+J+'_InFiAvT'和i+‘FZ’+J+'OutFiAvT'
                        if (j < 10) {
                            j = '0' + j;
                        }
                        inFiAvTDt = i + 'F_Zone00' + j + '_InFiAvT';
                        outFiAvTDt = i + 'F_Zone00' + j + '_OutFiAvT';
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
        createWorkflowOrder: function (notice) {
            var wiInstance;
            var momentTime = notice.time.toDate();
            var back = function () {
                wiInstance = null;
            };
            var insertCallback = function (taskModelInfo) {
                Alert.success(ElScreenContainer, I18n.resource.workflow.main.THE_WORK_ORDER + ' ' + ( taskModelInfo ? taskModelInfo.title : '' ) + ' ' + I18n.resource.workflow.main.IS_CREATED_SUCCESSFULLY).showAtTop(2000);
                //TODO 这个需要确认一下
                var $faultCount = $('#btnWarningLog .badge');
                var faultCount = (function (txt) {
                    if (parseInt(txt).toString() != "NaN") {
                        return parseInt(txt);
                    }
                    return 0;
                }($faultCount.text()));
                //诊断故障信息个数减一, 同时楼层导航的故障个数减一
                if (faultCount > 0) {
                    var count = faultCount - 1;
                    count = count > 0 ? count : '';
                    $faultCount.text(count);
                    //诊断故障信息remove
                    $('[noticeid="' + notice.id + '"]').remove();
                    //楼层故障个数更新
                    $('#navFloor-' + AppConfig.zoneId).next('.faultCount').text(count);
                }
            };
            wiInstance = new WorkflowInsert({
                noticeId: notice.id,
                title: notice.name,
                detail: notice.description,
                dueDate: new Date(+new Date() + 172800000).format('yyyy-MM-dd'),  //结束时间为两天后
                critical: notice.grade,
                projectId: Number(notice.project),
                chartPointList: notice.points,
                chartQueryCircle: 'm5',
                description: notice.description,
                name: notice.name,
                time: new Date(momentTime).format('yyyy-MM-dd HH:mm:ss'),
                chartStartTime: new Date(momentTime - 43200000).format('yyyy-MM-dd HH:mm:ss'), //报警发生前半天
                chartEndTime: new Date(momentTime + 43200000).format('yyyy-MM-dd HH:mm:ss')   //报警发生后半天
            });
            wiInstance.show().submitSuccess(function (taskModelInfo, uploadFiles) {
                insertCallback(taskModelInfo);
                this.close();
                back();
            }).cancel(function () {
                back();
            }).fail(function () {
                Alert.danger(ElScreenContainer, I18n.resource.workflow.main.CREATE_WORKFLOW_FAILED).showAtTop(2000);
            });
            return true;
        },

        renderPaneBuilding: function (notice, equipment, zone) {
            var element = document.getElementById('div-floor-' + equipment.zoneId);
            if (!element) return;
            var divIcon = $('#div-floor-icon-' + zone.id + '-' + equipment.id);

            var color;
            switch (notice.grade) {
                case 0:
                    color = 'window';
                    break;
                case 1:
                    color = 'rgb(238, 170, 100)';
                    break;
                case 2:
                    color = 'rgb(200, 100, 100)';
                    break;
                default:
                    break;
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

        renderPaneNav: function (notice, equipment) {
            var element = document.getElementById('spanNav-icon-' + equipment.zoneId + '-' + equipment.id);
            $(element).attr('data-modaltextid', equipment.modalTextId);
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
            var urgentCount = 0, criticalCount = 0, className;
            this.insertLogGroup();

            var item, parent;
            for (var i = 0, len = _this.arrLastNotice.length; i < len; i++) {
                item = _this.arrLastNotice[i];
                var grade = item.grade;
                if (1 == grade) {
                    className = 'adNormal';
                    criticalCount++;
                }
                else if (2 == grade) {
                    className = 'faultPro';
                    urgentCount++;
                }
                else {
                    continue;
                }
                _this.insertLogItem(item, i, className);
            }

            _this.criticalCount = _this.arrLastNotice.length;

            if (_this.criticalCount > 0) {
                $('#btnWarningLog').find('.badge').html(_this.criticalCount);
            } else {
                $('#btnWarningLog').find('.badge').html('');
            }
        },

        insertLogGroup: function () {//,groupName
            var $abNomalP = $('#abNomalP');
            var $faultP = $('#faultP');
            var $divPaneNoticeItem = $('#divPaneNoticeItem');
            $divPaneNoticeItem.children().remove();

            $abNomalP.on('change', function () {
                var $adNormalOne = $divPaneNoticeItem.find('.adNormal');
                var $faultProOne = $divPaneNoticeItem.find('.faultPro');
                if (($abNomalP.is(':checked') && $faultP.is(':checked')) || ((!$abNomalP.is(':checked')) && (!$faultP.is(':checked')))) {
                    $adNormalOne.show();
                    $faultProOne.show();
                } else if ($abNomalP.is(':checked') && (!$faultP.is(':checked'))) {
                    $adNormalOne.show();
                    $faultProOne.hide();
                } else if ((!$abNomalP.is(':checked')) && $faultP.is(':checked')) {
                    $adNormalOne.hide();
                    $faultProOne.show();
                }
            });
            $faultP.on('change', function () {
                var $adNormalTwo = $divPaneNoticeItem.find('.adNormal');
                var $faultProTwo = $divPaneNoticeItem.find('.faultPro');
                if (($abNomalP.is(':checked') && $faultP.is(':checked')) || ((!$abNomalP.is(':checked')) && (!$faultP.is(':checked')))) {
                    $adNormalTwo.show();
                    $faultProTwo.show();
                } else if ($abNomalP.is(':checked') && (!$faultP.is(':checked'))) {
                    $adNormalTwo.show();
                    $faultProTwo.hide();
                } else if ((!$abNomalP.is(':checked')) && $faultP.is(':checked')) {
                    $adNormalTwo.hide();
                    $faultProTwo.show();
                }
            });
        },

        insertLogItem: function (item, itemNum, className) {
            var divParent = $('#divPaneNoticeItem');
            var _this = this;
            var divNotice, equipment, zone, sb, span, textId, spanFirst;

            equipment = this.dictEquipment[item.equipmentId];
            textId = equipment.modalTextId;
            zone = this.dictZone[equipment.zoneId];

            divNotice = document.createElement('div');
            divNotice.id = 'divLog-' + itemNum;
            divNotice.setAttribute('path', zone.id + '-' + equipment.id);
            divNotice.setAttribute('faultid', item.faultId);
            divNotice.setAttribute('noticeId', item.id);
            if (textId !== null) divNotice.setAttribute('data-modaltextid', textId);
            divNotice.className = 'div-pane-log';
            $(divNotice).addClass(className);
            divNotice.onmouseenter = function (e) {
                var $this = $(e.currentTarget);
                var modalTextId = $this.attr('data-modaltextid');
                var pageId = $this.children('[pageid]').attr('pageid');
                if (modalTextId === undefined || _this.obScreen === undefined) return;
                if (_this.obScreen.id !== pageId) return;
                _this.obScreen.showErrTip(modalTextId);
            };
            divNotice.onmouseleave = function (e) {
                var $this = $(e.currentTarget);
                var modalTextId = $this.attr('data-modaltextid');
                var pageId = $this.children('[pageid]').attr('pageid');
                if (modalTextId === undefined || _this.obScreen === undefined) return;
                if (_this.obScreen.id !== pageId) return;
                _this.obScreen.hideErrTip(modalTextId);
            };

            var parent = $(divNotice);
            var $spWrap = $('<div style="white-space: nowrap;">');

            sb = new StringBuilder();
            sb.append(item.name);
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
            spanFirst = $('<span>').addClass('badge').css('color', '#fff');//.html(' _this.langCfg.LEVEL_SET.CRITICAL');
            switch (item.grade) {
                case 0:
                    break;
                case 1:
                    spanFirst.css('background-color', 'rgba(240, 173, 78, 0.9)').html(_this.langCfg.LEVEL_SET.CRITICAL);
                    break;
                case 2:
                    spanFirst.css('background-color', 'rgba(217, 83, 79, 0.9)').html(_this.langCfg.LEVEL_SET.URGENT);
                    break;
                default:
                    break;
            }
            $spWrap.append(spanFirst);

            //btn show equipment detail
            //$('<span>')
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
                        $('#navFloor-' + zoneId).click();
                    }
                    else {
                        alert('This floor has no details');
                    }
                }).appendTo($spWrap);


            $('<span>').attr({
                'title': 'Triggering time',
                'data-time': item.time
            }).text(item.time.toDate().format("MM-dd HH:mm"))
                .css({
                    'text-decoration': 'underline',
                    'font-weight': 'bold',
                    'color': '#F0AD4E',
                    'text-shadow': '2px 2px 1px rgba(50,50,50,0.2)'
                }).appendTo($spWrap);

            $('<span>').addClass('glyphicon glyphicon-ok-sign grow span-hover-pointer span-btn')
                .attr('title', 'Check')
                .click(function (e) {
                    var $pane = $(e.currentTarget).closest('.div-pane-log');
                    var noticeId = $pane.attr('noticeId');
                    var faultId = $pane.attr('faultId');
                    var item;
                    for (var i = 0; i < _this.arrLastNotice.length; i++) {
                        if (_this.arrLastNotice[i].id == noticeId) item = _this.arrLastNotice[i];
                    }
                    if (item) {
                        _this.noticeId = noticeId;
                        _this.faId = faultId;
                        _this.faUserId = AppConfig.userId;

                        var level = item.grade;
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
                        //var userFaDelay = item.userFaultDelay;
                        //if (undefined != userFaDelay && null != userFaDelay) {
                        //    var timeDelay = userFaDelay.toDate();
                        //    var timeNow = new Date();
                        //    var interval = timeDelay.getTime() - timeNow.getTime();
                        //    if (interval < 0) {
                        //        selectTm.val(_this.langCfg.defaultPeriod.REAL_TIME);
                        //        $(this).addClass('realTime');
                        //    }
                        //    else if (interval <= 3600000) {
                        //        selectTm.val(_this.langCfg.defaultPeriod.DELAY_1H);
                        //    }
                        //    else if (interval <= 43200000) {
                        //        selectTm.val(_this.langCfg.defaultPeriod.DELAY_12H);
                        //    }
                        //    else if (interval <= 86400000) {
                        //        selectTm.val(_this.langCfg.defaultPeriod.DELAY_24H);
                        //    }
                        //    else if (interval <= 604800000) {
                        //        selectTm.val(_this.langCfg.defaultPeriod.DELAY_7D);
                        //    }
                        //    else if (interval <= 18144000000) {
                        //        selectTm.val(_this.langCfg.defaultPeriod.DELAY_1M);
                        //    }
                        //    else {
                        //        selectTm.val(_this.langCfg.defaultPeriod.DELAY_FOREVER);
                        //    }
                        //}
                        //else {
                        //    selectTm.val(_this.langCfg.defaultPeriod.DELAY_FOREVER);
                        //}
                        selectTm.val(_this.langCfg.defaultPeriod.DELAY_FOREVER);
                    }

                    $('#dlgChangeRule').modal('show');
                }).appendTo($spWrap);

            if (item.orderId && item.orderId != 0 && item.orderId != '') {
                $('<span>').addClass('glyphicon glyphicon-tags grow span-hover-pointer span-btn')
                    .attr('title', 'Show workflow order')
                    .attr('workflow', item.orderId)
                    .click(function (e) {
                        if (ScreenCurrent) ScreenCurrent.close();
                        ScreenManager.show(beop.main, e.currentTarget.getAttribute('workflow'));
                    }).appendTo($spWrap);
            } else {
                $('<span>').addClass('glyphicon glyphicon-share grow span-hover-pointer span-btn')
                    .attr('title', 'Create workflow order')
                    .click(function (e) {
                        _this.createWorkflowOrder(item);
                    }).appendTo($spWrap);
            }

            parent.append($spWrap);
            $('<p>').addClass('pFaultName').css({
                'font-weight': 'bold',
                'padding': '0 8px 0 0'
            }).text(item.name).appendTo(parent);

            var strDesc = item.description;
            if (item.detail) {
                var arr = item.detail.toString().split(',');
                for (var j = 0; j < arr.length; j++) {
                    strDesc = strDesc.replace('{' + j.toString() + '}', '<span class="variable"> ' + arr[j] + ' </span>');
                }
            }
            $('<p>').html(strDesc).appendTo(parent);

            divParent.append(parent);

            _this.renderPaneBuilding(item, item, equipment, zone);
            _this.renderPaneNav(item, item, equipment);
        },
        renderChart: function (record) {
            Spinner.spin($("#wf-add-person")[0]);
            var list_description = record.list_description,
                list_value = record.list_value,
                arrXAxis;
            if (list_description.length == list_value.length) {
                if (record.list_time.length > 0)
                    arrXAxis = record.list_time[0].split(',');
                var arrSeriesTemp = [];
                for (var i = 0; i < list_value.length; i++) {
                    var arrDatas = [];
                    if (i < 8) {
                        var item = list_value[i];
                        if (item) {
                            var strDatas = item.split(",");
                            for (var j = 0; j < strDatas.length; ++j) {
                                arrDatas.push(parseFloat(strDatas[j]).toFixed(1));
                            }
                        }

                        arrSeriesTemp.push(
                            {
                                name: list_description[i],
                                type: 'line',
                                itemStyle: {normal: {lineStyle: {type: 'solid'}}},
                                data: arrDatas
                            });
                    }
                }
                var option =
                {
                    tooltip: {
                        trigger: 'axis',
                        formatter: function (params) {
                            var strResult;
                            if (params[0].name.length > 0) {
                                strResult = params[0].name + '<br/>';
                                for (var i = 0; i < params.length; ++i) {
                                    strResult += params[i].seriesName + ' : ' + params[i].value;
                                    if (i != params.length - 1) {
                                        strResult += '<br/>';
                                    }
                                }
                            }
                            return strResult;
                        }
                    },
                    legend: {
                        data: list_description,
                        x: 'center'
                    },
                    toolbox: {
                        show: true
                    },
                    dataZoom: {
                        show: true,
                        realtime: true,
                        start: 0,
                        end: 100
                    },
                    xAxis: [
                        {
                            name: "",
                            type: 'category',
                            boundaryGap: false,
                            axisLine: {onZero: false},
                            data: arrXAxis
                        }
                    ],
                    yAxis: [
                        {
                            name: "",
                            type: 'value',
                            scale: true
                        }
                    ],
                    series: arrSeriesTemp,
                    showLoading: {
                        text: 'loading',
                        effect: 'spin'
                    }
                };
                var myChart = echarts.init($('#wf-fault-curve').get(0));
                myChart.setOption(option);
                window.onresize = myChart.resize;
                Spinner.stop();
            }
        },

        showObserver: function (_this, id) {
            if (id.length && id.length == 24) {
                _this.obScreen = new observer.screens.PageScreen({ 'id': id }, _this.$obContainer[0])
                _this.obScreen.show();
            } else {
                _this.obScreen = new ObserverScreen(id);
                _this.initObScreen();
                _this.obScreen.show(_this.$obContainer[0]);
            }
        }
    };

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
                $('#dialogContent .modal-content').css({'height': document.body.scrollHeight - 100, 'width': '1000px'});

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
        createWorkflowOrder: function (notice) {
            var wiInstance;
            var momentTime = notice.time.toDate();
            var back = function () {
                wiInstance = null;
                var $dialogModal = $('#dialogModal');
                Spinner.spin(ElScreenContainer);
                $dialogModal.modal("show");
                $dialogModal.off('shown.bs.modal.showDialogModal').on('shown.bs.modal.showDialogModal', function () {
                    Spinner.stop();
                });
            };
            var insertCallback = function (taskModelInfo) {
                Alert.success(ElScreenContainer, I18n.resource.workflow.main.THE_WORK_ORDER + ' ' + ( taskModelInfo ? taskModelInfo.title : '' ) + ' ' + I18n.resource.workflow.main.IS_CREATED_SUCCESSFULLY).showAtTop(2000);
                var $faultCount = $('#btnWarningLog .badge');
                var faultCount = (function (txt) {
                    if (parseInt(txt).toString() != "NaN") {
                        return parseInt(txt);
                    }
                    return 0;
                }($faultCount.text()));
                //诊断故障信息个数减一, 同时楼层导航的故障个数减一
                if (faultCount > 0) {
                    var count = faultCount - 1;
                    count = count > 0 ? count : '';
                    $faultCount.text(count);
                    //诊断故障信息remove
                    $('[noticeid="' + notice.id + '"]').remove();
                    //楼层故障个数更新
                    $('#navFloor-' + AppConfig.zoneId).next('.faultCount').text(count);

                }
            };
            wiInstance = new WorkflowInsert({
                noticeId: notice.id,
                title: notice.name,
                detail: notice.description,
                dueDate: new Date(+new Date() + 172800000).format('yyyy-MM-dd'),  //结束时间为两天后
                critical: notice.grade,
                projectId: Number(notice.project),
                chartPointList: notice.points,
                chartQueryCircle: 'm5',
                description: notice.description,
                name: notice.name,
                time: new Date(momentTime).format('yyyy-MM-dd HH:mm:ss'),
                chartStartTime: new Date(momentTime - 43200000).format('yyyy-MM-dd HH:mm:ss'), //报警发生前半天
                chartEndTime: new Date(momentTime + 43200000).format('yyyy-MM-dd HH:mm:ss')   //报警发生后半天
            });
            wiInstance.show().submitSuccess(function (taskModelInfo, uploadFiles) {
                insertCallback(taskModelInfo);
                this.close();
                back();
            }).cancel(function () {
                back();
            }).fail(function () {
                Alert.danger(ElScreenContainer, I18n.resource.workflow.main.CREATE_WORKFLOW_FAILED).showAtTop(2000);
            });
            return true;
        },
        refreshData: function (startTime, endTime) {
            var _this = this;
            var item;

            startTime = startTime.format("yyyy-MM-dd HH:mm:ss");
            endTime = endTime.format("yyyy-MM-dd HH:mm:ss");

            Spinner.spin(document.getElementById('tableNoticeHistory'));
            WebAPI.get('/diagnosis/getHistoryFault/' + AppConfig.projectId + '/' + startTime + '/' + endTime).done(function (result) {
                _this.initTable(result);
            }).error(function (result) {
                var dialog = $('#dialogModal');
                dialog.find('.modal-body').html('Error query.'); //#dialogContent
            }).always(function () {
                Spinner.stop();
            });
        },

        initTable: function (data) {
            $('#tableNoticeHistory tbody').remove();
            var tbody = document.createElement('tbody');
            var $spanPoint;

            $('#tableNoticeHistory').append(tbody);
            if (data.length == 0) tbody.innerHTML = 'no history data';

            var tr, td, item, sb, equipment, zone, timeDif, strDesc;
            for (var i = 0, len = data.length; i < len; i++) {
                item = data[i];
                strDesc = item.description;
                equipment = this.parent.dictEquipment[item.equipmentId];
                zone = this.parent.dictZone[equipment.zoneId];

                tr = document.createElement('tr');
                tr.id = 'diagHistory_' + item.id;
                tr.title = strDesc;

                //tr.innerHTML = sb.toString();
                tbody.appendChild(tr);

                //sb = new StringBuilder();
                //sb.append('<td>').append(item.time.toDate().format("yyyy-MM-dd HH:mm:ss")).append('</td>');
                $(tr).append($('<td></td>').html(item.time.toDate().format("yyyy-MM-dd HH:mm:ss")));
                switch (item.grade) {
                    case 0:
                        $(tr).append('<td><span class="badge" style="background-color: #5bc0de;" title="Grade">Normal</span></td>');
                        break;//sb.append
                    case 1:
                        $(tr).append('<td><span class="badge" style="background-color: #f0ad4e;" title="Grade">Alert</span></td>');
                        break;//sb.append
                    case 2:
                        $(tr).append('<td><span class="badge" style="background-color: #d9534f;" title="Grade">Fault</span></td>');
                        break;//sb.append
                    default:
                        $(tr).append('<td><span class="badge" style="background-color: #d9534f;" title="Grade">Unknown</span></td>');
                        break;//sb.append
                }
                $(tr).append($('<td></td>').html(equipment.name));
                $(tr).append($('<td></td>').html(zone.subBuildingName));
                $(tr).append($('<td></td>').html(item.name));
                switch (item.status) {
                    case '0':
                        $(tr).append('<td>Disable</td>');
                        break;//sb.append
                    case '1':
                        $(tr).append('<td>Delayed</td>');
                        break;//sb.append
                    case '2':
                        $(tr).append('<td>Realtime</td>');
                        break;//sb.append
                    default:
                        break;
                }
                if (!item.resTime || item.resTime == null) {
                    $(tr).append($('<td colspan="2" style="text-align:center;" i18n="diagnosis.historyLog.RESPONSE_CONTENT"></td>'));
                    $spanPoint = pointerClick(item);
                    $(tr).append($('<td></td>').append($spanPoint));
                } else {
                    timeDif = Math.floor(((new Date(item.resTime)).getTime() - (new Date(item.time)).getTime()) / (3600 * 1000));//小時为单位 如果以天就*24
                    $(tr).append($('<td></td>').html(item.executor));
                    $(tr).append($('<td></td>').html(timeDif));
                    $(tr).append($('<td></td>').html(''));
                }

                //init tooltip(notice detail).
                //var strDesc = item.description;
                var arr = item.detail.toString().split(',');
                for (var j = 0; j < arr.length; j++) {
                    strDesc = strDesc.replace('{' + j.toString() + '}', '<span class="variable">' + arr[j] + '</span>');
                }
                function pointerClick(item) {
                    var $pointeer;
                    $pointeer = $('<span class="glyphicon glyphicon-share grow span-hover-pointer"></span>').off('click').on('click', function () {
                        _this.createWorkflowOrder(item);
                        $('#dialogModal').modal('hide');
                    });
                    return $pointeer
                }
            }
            //$('#tableNoticeHistory').append(tbody);
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
            var equipA = _this.parent.dictEquipment[a.equipmentId];
            var equipB = _this.parent.dictEquipment[b.equipmentId];
            return (equipA.name).localeCompare(equipB.name);
        },

        sortEquipDescending: function (a, b) {
            var equipA = _this.parent.dictEquipment[a.equipmentId];
            var equipB = _this.parent.dictEquipment[b.equipmentId];
            return (equipB.name).localeCompare(equipA.name);
        },

        sortZoneAscending: function (a, b) {
            var equip = _this.parent.dictEquipment[a.equipmentId];
            var zoneA = _this.parent.dictZone[equip.zoneId];

            equip = _this.parent.dictEquipment[b.equipmentId];
            var zoneB = _this.parent.dictZone[equip.zoneId];

            return (zoneA.subBuildingName).localeCompare(zoneB.subBuildingName);
        },

        sortZoneDescending: function (a, b) {
            var equip = _this.parent.dictEquipment[a.equipmentId];
            var zoneA = _this.parent.dictZone[equip.zoneId];

            equip = _this.parent.dictEquipment[b.equipmentId];
            var zoneB = _this.parent.dictZone[equip.zoneId];

            return (zoneB.subBuildingName).localeCompare(zoneA.subBuildingName);
        },

        sortFaultAscending: function (a, b) {
            return (a.name).localeCompare(b.name);
        },

        sortFaultDescending: function (a, b) {
            return (a.name).localeCompare(b.name);
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

            var item;
            var arrSuit = [];
            searchVal = searchVal.toLowerCase();
            for (var i = 0, len = _this.m_tableInfo.length; i < len; i++) {
                item = _this.m_tableInfo[i];
                if (-1 != item.name.toLowerCase().indexOf(searchVal)) {
                    arrSuit.push(item);
                }
            }
            _this.initTable(arrSuit);
        },

        renderChart: function (record) {
            Spinner.spin($("#wf-add-person")[0]);
            var list_description = record.list_description,
                list_value = record.list_value,
                arrXAxis;
            if (list_description.length == list_value.length) {
                if (record.list_time.length > 0)
                    arrXAxis = record.list_time[0].split(',');
                var arrSeriesTemp = [];
                for (var i = 0; i < list_value.length; i++) {
                    var arrDatas = [];
                    if (i < 8) {
                        var item = list_value[i];
                        if (item) {
                            var strDatas = item.split(",");
                            for (var j = 0; j < strDatas.length; ++j) {
                                arrDatas.push(parseFloat(strDatas[j]).toFixed(1));
                            }
                        }

                        arrSeriesTemp.push(
                            {
                                name: list_description[i],
                                type: 'line',
                                itemStyle: {normal: {lineStyle: {type: 'solid'}}},
                                data: arrDatas
                            });
                    }
                }
                var option =
                {
                    tooltip: {
                        trigger: 'axis',
                        formatter: function (params) {
                            var strResult;
                            if (params[0].name.length > 0) {
                                strResult = params[0].name + '<br/>';
                                for (var i = 0; i < params.length; ++i) {
                                    strResult += params[i].seriesName + ' : ' + params[i].value;
                                    if (i != params.length - 1) {
                                        strResult += '<br/>';
                                    }
                                }
                            }
                            return strResult;
                        }
                    },
                    legend: {
                        data: list_description,
                        x: 'center'
                    },
                    toolbox: {
                        show: true
                    },
                    dataZoom: {
                        show: true,
                        realtime: true,
                        start: 0,
                        end: 100
                    },
                    xAxis: [
                        {
                            name: "",
                            type: 'category',
                            boundaryGap: false,
                            axisLine: {onZero: false},
                            data: arrXAxis
                        }
                    ],
                    yAxis: [
                        {
                            name: "",
                            type: 'value',
                            scale: true
                        }
                    ],
                    series: arrSeriesTemp,
                    showLoading: {
                        text: 'loading',
                        effect: 'spin'
                    }
                };
                var myChart = echarts.init($('#wf-fault-curve').get(0));
                myChart.setOption(option);
                window.onresize = myChart.resize;
                Spinner.stop();
            }
        }
    }
    return DiagnosisHistory;
})();

