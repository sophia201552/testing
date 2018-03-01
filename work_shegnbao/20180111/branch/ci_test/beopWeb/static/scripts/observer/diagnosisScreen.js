/// <reference path="../lib/jquery-2.1.4.min.js" />
/// <reference path="../core/common.js" />
var DiagnosisScreen = (function () {
    var _this = undefined;

    function DiagnosisScreen(options) {
        this.options = $.extend(false, {}, options);

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
        this.judgeProjectId = (AppConfig.projectId == 80);
        _this = this;
    }

    DiagnosisScreen.prototype = {
        show: function () {
            var _this = this;
            Spinner.spin(ElScreenContainer);

            WebAPI.get("/static/views/observer/diagnosisScreen.html").done(function (resultHtml) {
                // trackEvent('诊断页面打开', 'Diagnosis.Open')
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
            $("#dialogContent").empty();
            //trackEvent('诊断页面关闭', 'Diagnosis.Close')
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
                _this.result = result;
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
                                } else {
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
                // 加载指定默认楼层
                var $spMenu, buildingId;
                if (_this.options.defaultMenuId) {
                    $spMenu = $('.subBuildingItem[pageid="' + _this.options.defaultMenuId + '"]', '#paneIcon');
                    if ($spMenu.length) {
                        try {
                            buildingId = $spMenu.closest('.subBuildingList')[0].id.split('_')[1];
                        } catch (e) {
                            Log.error('获取 build id 时发生错误： ' + e.toString());
                        }
                        if (buildingId) {
                            $('.subBuildingBtn', '#paneIcon').filter('[id="building_' + buildingId + '"]').trigger('click');
                            $spMenu.trigger('click');
                            return;
                        }
                    }
                }

                // 没有指定默认楼层，或没有找到指定的默认楼层，则默认打开第一个
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
            $("#btnNoticeHistory").eventOff().eventOn('click', function (e) {
                ScreenModal = new DiagnosisLogHistory(_this);
                ScreenModal.show();
            }, '点击诊断历史记录');

            $("#btnNoticeConfig").off().click(function (e) {
                ScreenModal = new DiagnosisConfig(_this);
                ScreenModal.show();
            });

            $('#btnWarningLog').eventOff().eventOn('click', function () {
                var $diagnosisLogCt = $('#diagnosisLogCt');
                var $btnPin = $('#btnStickyPost');
                if ($diagnosisLogCt.is(':hidden')) {
                    viewLog(this);
                    if (_this.judgeProjectId) {
                        $('#reuseDemand').hide();
                        $('#divPaneNotice .noticeAll').show();
                    }
                    trackEvent('诊断日志展开', 'Diagnosis.Log.Expand')
                    $btnPin.show();
                    $diagnosisLogCt.slideDown();
                } else {
                    trackEvent('诊断日志收起', 'Diagnosis.Log.Collapse')
                    $btnPin.hide();
                    $diagnosisLogCt.hide();
                    $('#divCanvas').attr('class', 'col-sm-12');
                }
            }, function (e) {
                var $diagnosisLogCt = $('#diagnosisLogCt');
                if ($diagnosisLogCt.is(':hidden')) {
                    return '展开诊断日志'
                } else {
                    return '隐藏诊断日志'
                }
            });

            $('#btnStickyPost').off().click(function () {
                var $divCanvas = $('#divCanvas');
                $divCanvas.attr('class', $divCanvas.hasClass('col-sm-12') ? 'col-sm-9' : 'col-sm-12');
                //为了避免第一次resize会不正常,所以增加了setTimeout
                if ($divCanvas.hasClass('col-sm-12')) {
                    trackEvent('诊断日志浮动取消', 'Diagnosis.Log.Stick.Cancel')
                } else {
                    trackEvent('诊断日志浮动激活', 'Diagnosis.Log.Stick.Active')
                }
                window.setTimeout(function () {
                    _this.obScreen.resize();
                }, 500);

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
                } else if (1 == delayVal) {
                    time = new Date(now + 3600000);
                } else if (2 == delayVal) {
                    time = new Date(now + 43200000);
                } else if (3 == delayVal) {
                    time = new Date(now + 86400000);
                } else if (4 == delayVal) {
                    time = new Date(now + 604800000);
                } else if (5 == delayVal) {
                    time = new Date(now);
                    time.setMonth(now.getMonth() + 1);
                } else if (6 == delayVal) {
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
                $this.prop('disabled', true);
                WebAPI.post('/diagnosis/fault/customUpdate/' + AppConfig.projectId, postData).done(function (result) {
                    var data = result;
                    if (data) {
                        var $divFault = $('#divPaneNoticeItem div[faultid="' + _this.faId + '"]');

                        for (var i = 0; i < _this.arrLastNotice.length; i++) {
                            if (_this.arrLastNotice[i].id == _this.noticeId) {
                                _this.arrLastNotice[i].grade = level;
                            }
                        }

                        if (_this.obScreen.dictTexts) {
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
            var $floorPH = $flootCt.find('.panel-default'); //$('#floorCt .panel-default');
            $flootCt.find('.panel-heading').off('click').click(function () {
                trackEvent('诊断导航收起', 'Diagnosis.Nav.Collapse')
                $floorPH.hide();
                $floorPB.show();
            });
            $floorPB.off('click').click(function () {
                trackEvent('诊断导航展开', 'Diagnosis.Nav.Expand')
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
            var index = -1,
                tempBuildingId = undefined;


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
                    };
                    this.buildings.push(building)
                } else {
                    var subBuilding = {
                        subBuildId: item.subBuildingId,
                        subBuildName: item.subBuildingName,
                        equipments: equipments
                    };
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
                if (arr[i] == "" || typeof(arr[i]) == "undefined") {
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
            var valueMark = (max - min) / (colorArr.length - 1); //获得取色范围间隔
            //var valueCurrent = (max + min) / 2;//获取当前值
            var regexp = /[0-9]{0,3}/g; //为提取rgb数字
            for (var i = 0; i < colorArr.length - 1; i++) {
                var colorMaxValue = min + (i + 1) * valueMark; //每个间隔的最大值
                if (valueCurrent > colorMaxValue) continue;
                var colorSelPre = colorArr[i]; //获得当前渐变范围开始颜色
                var colorSelTo = colorArr[i + 1]; //获得当前渐变范围结束颜色
                var colorValPreArr = [];
                colorValPreArr = colorSelPre.match(regexp); //获得当前渐变范围开始颜色rgb色值组
                _this.clearNullArr(colorValPreArr);
                var colorValToArr = [];
                colorValToArr = colorSelTo.match(regexp); //获得当前渐变范围结束颜色rgb色值组
                _this.clearNullArr(colorValToArr);
                var colorMinValue = min + i * valueMark; //每个间隔的最小值
                if (i == colorArr.length - 2) {
                    colorMaxValue = max; //防止除不尽时，最后个间隔不全的情况
                }
                if (valueCurrent <= colorMaxValue) {
                    $gradientDom.css('background', 'rgb(' + (parseInt((parseInt(colorValToArr[0] - colorValPreArr[0]) * (valueCurrent - colorMinValue) / (colorMaxValue - colorMinValue)).toFixed(0)) + parseInt(colorValPreArr[0])) + ',' + (parseInt((parseInt(colorValToArr[1] - colorValPreArr[1]) * (valueCurrent - colorMinValue) / (colorMaxValue - colorMinValue)).toFixed(0)) + parseInt(colorValPreArr[1])) + ',' + (parseInt((parseInt(colorValToArr[2] - colorValPreArr[2]) * (valueCurrent - colorMinValue) / (colorMaxValue - colorMinValue)).toFixed(0)) + parseInt(colorValPreArr[2])) + ')');
                    i = colorArr.length - 1;
                }
            }
        },
        refreshTableModelData: function (e) {
            var dataNumber = e.data,
                resultName = undefined;
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
                            $('.rc' + buildNum + '_' + zoneNum).html(valueCurrent); //((beforeValue + afterValue) / 2).toFixed(0)
                            //.css({ 'background': 'rgba(' + parseInt((245 - 237) * (((beforeValue + dataNumber[resultN].value) / 2).toFixed(1) - 20) / 10 + 237) + ',' + parseInt((63 - 226) * (((beforeValue + dataNumber[resultN].value) / 2).toFixed(1) - 20) / 10 + 226) + ',' + parseInt((82 - 76) * (((beforeValue + dataNumber[resultN].value) / 2).toFixed(1) - 20) / 10 + 76) + ',0.9)' });//此处
                            //冬季中间值20范围16~24    夏季中间值26范围22-30   值为0时灰色显示     16色值为蓝   24色值为红
                            //valueCurrent = parseInt((Math.random() * 10 + 14).toFixed(0));
                            if (valueCurrent === 0) {
                                $('.rc' + buildNum + '_' + zoneNum).css('background', '#d0d0d0');
                            } else {
                                _this.gradientColors(['rgb(0,0,255)', 'rgb(255,255,255)', 'rgb(255,0,0)'], $('.rc' + buildNum + '_' + zoneNum), valueCurrent, 24, 16); //rgb(61,100,255)rgb(255,190,0)
                            }
                        }
                    }
                }
            }
            Spinner.stop();
        },
        refreshData: function (e, isOnlyRenderDictFault) {
            if (!e.data || $.isEmptyObject(e.data) || e.data.error) {
                Spinner.stop();
            }
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
                        var faultId = e.data.notice[i].faultId,
                            equipmentId = e.data.notice[i].equipmentId;
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

                    // 更新 PageScreen 状态
                    typeof _this.obScreen.onUpdateFaultsCallback === 'function' &&
                    _this.obScreen.onUpdateFaultsCallback(e.data.notice);
                } catch (e) {
                    console.log(e)
                }

                $('#spinnerLoadingNotice').remove();
                $('#btnWarningLog').fadeIn();
            } else {
                $('#spinnerLoadingNotice').remove();
                //new Alert(ElScreenContainer, Alert.type.danger, I18n.resource.code[e.data.error]).showAtTop(5000);
            }
            Spinner.stop();

            if (isOnlyRenderDictFault) return; //如果是resetFloor调用refreshData, 只需渲染页面的缺陷高亮, 诊断缺陷个数及诊断信息面板无需渲染,故return

            //渲染诊断缺陷个数
            $('.badge.warningCount', '#paneIcon').empty(); //渲染之前清空个数
            $('.badge.alertCount', '#paneIcon').empty();
            if (e.data.count && e.data.count instanceof Array) {
                e.data.count.forEach(function (obj) {
                    for (var i in obj) {
                        var warningCount = parseInt(obj[i].warning);
                        var alertCount = parseInt(obj[i].alert);
                        var $targetWarning = $('#navFloor-' + i).next('.warningCount');
                        var $targetAlert = $('#navFloor-' + i).siblings('.alertCount');
                        if (warningCount > 0) {
                            $targetWarning.html(warningCount);
                        } else {
                            $targetWarning.html('');
                        }
                        if (alertCount > 0) {
                            $targetAlert.html(alertCount);
                        } else {
                            $targetAlert.html('');
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
            var $buildingBox, $subBuilding = $('.subBuilding'),
                $subBuildingList, countHtml;

            //for (var zoneId in this.dictZone) {
            //    zoneItem = this.dictZone[zoneId];
            //    zoneItemList.push(zoneItem);
            //}
            zoneItemList = this.result.zones;
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
                        $buildingBox = $('<div class="div-nav-box' + itemI.buildingId + '"><span id="building_' + itemI.buildingId + '" data-id="' + itemI.buildingId + '" class="grow subBuildingBtn"></span><span class="badge warningCount"></span><span class="badge alertCount"></span></div>');
                        $buildingBox.find('#building_' + itemI.buildingId).html(itemI.buildingName);
                        $subBuildingList = $('<div class="subBuildingList" id="subList_' + itemI.buildingId + '"></div>');
                        $buildingBox.append($subBuildingList);
                        $(pane).append($buildingBox);
                    }
                    // 显示诊断缺陷个数
                    //if (itemI.count && itemI.count > 0) {
                    //    countHtml = '<span class="badge warningCount">' + itemI.count + '</span><span class="badge alertCount"></span>';
                    //} else {
                    countHtml = '<span class="badge warningCount"></span><span class="badge alertCount"></span>';
                    //}
                    var $subBuildings = $('#subList_' + itemI.buildingId).children('.subBuilding');
                    var countArry = [];
                    for (var k = 0; k < $subBuildings.length; k++) {
                        countArry.push(parseInt($($subBuildings[k]).attr('count')));
                    }
                    if ((countArry.length === 0) || (itemI.count > countArry[countArry.length - 1])) {
                        $subBuilding = $('<div class="div-nav-row subBuilding" count="' + itemI.count + '"><span class="div-row-icon-badge grow subBuildingItem" pageId="' + itemI.pageId + '" id="navFloor-' + itemI.id + '"></span>' + countHtml + '</div>');
                        $subBuilding.find('.subBuildingItem').html(itemI.subBuildingName);
                        $('#subList_' + itemI.buildingId).append($subBuilding);
                    } else {
                        for (var q = 0; q < countArry.length; q++) {
                            if (itemI.count < countArry[q]) {
                                $subBuilding = $('<div class="div-nav-row subBuilding" count="' + itemI.count + '"><span class="div-row-icon-badge grow subBuildingItem" pageId="' + itemI.pageId + '" id="navFloor-' + itemI.id + '"></span>' + countHtml + '</div>');
                                $subBuilding.find('.subBuildingItem').html(itemI.subBuildingName);
                                $($subBuildings[q]).before($subBuilding);
                                break;
                            } else if (itemI.count === countArry[q]) {
                                if (countArry[q] === countArry[countArry.length - 1]) {
                                    $subBuilding = $('<div class="div-nav-row subBuilding" count="' + itemI.count + '"><span class="div-row-icon-badge grow subBuildingItem" pageId="' + itemI.pageId + '" id="navFloor-' + itemI.id + '"></span>' + countHtml + '</div>');
                                    $subBuilding.find('.subBuildingItem').html(itemI.subBuildingName);
                                    $('#subList_' + itemI.buildingId).append($subBuilding);
                                    break;
                                } else {
                                    for (var p = q; p < countArry.length; p++) {
                                        if (itemI.count < countArry[p]) {
                                            $subBuilding = $('<div class="div-nav-row subBuilding" count="' + itemI.count + '"><span class="div-row-icon-badge grow subBuildingItem" pageId="' + itemI.pageId + '" id="navFloor-' + itemI.id + '"></span>' + countHtml + '</div>');
                                            $subBuilding.find('.subBuildingItem').html(itemI.subBuildingName);
                                            $($subBuildings[p]).before($subBuilding);
                                            break;
                                        }
                                    }
                                    break;
                                }
                            }
                        }
                    }
                    $subBuilding.find('.subBuildingItem').off('click').click(function (e) {
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
                        } else {
                            alert('This floor has no details');
                        }
                        trackEvent('诊断导航区域点击-' + e.currentTarget.innerHTML + '(' + id + ')', 'Diagnosis.Nav.Zone.Click')
                        //加载当前楼层的诊断信息
                        _this.arrLastNotice.length = 0;
                        _this.initWorkerForUpdating();
                    });
                }
            }

            // 缺陷个数统计
            //this.statisticFaultCount();

            $('.subBuildingBtn').off('click').click(function (e) {
                if (!$(this).hasClass('selected')) {
                    trackEvent('诊断导航建筑点击-' + e.currentTarget.innerHTML + '(' + e.currentTarget.dataset.id + ')', 'Diagnosis.Nav.Building.Click')
                }
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
                var warningCount = 0,
                    alertCount = 0;
                $(this).children('.subBuildingList').find('.warningCount').not(':empty').each(function () {
                    var text = $(this).text();
                    if (Number(text).toString() != 'NaN') {
                        warningCount += parseInt(text);
                    }
                });
                if (warningCount > 0) {
                    $(this).children('.warningCount').html(warningCount);
                } else {
                    $(this).children('.warningCount').html('');
                }
                $(this).children('.subBuildingList').find('.alertCount').not(':empty').each(function () {
                    var text = $(this).text();
                    if (Number(text).toString() != 'NaN') {
                        alertCount += parseInt(text);
                    }
                });
                if (alertCount > 0) {
                    $(this).children('.alertCount').html(alertCount);
                } else {
                    $(this).children('.alertCount').html('');
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
                for (var j = 19; j > 0; j--) { //item.equipmentIds.length
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
                    } else {
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
                    }
                    $spanRow.append($spanCeil);
                }
                $tabelModelPanel.find('table').append($spanRow);
            }

            this.tabelModelData = requestData;

            $tabelModelPanel.insertBefore($('#divCanvas'));
        },
        createWorkflowOrder: function (notice) {
            var wiInstance;
            var momentTime = notice.time.toDate();
            var back = function () {
                wiInstance = null;
            };
            trackEvent('诊断日志工单点击', 'Diagnosis.Log.Workflow.Click')
            var insertCallback = function (taskModelInfo) {
                var taskTitle = (taskModelInfo && taskModelInfo.fields) ? taskModelInfo.fields.title : '';
                Alert.success(ElScreenContainer, I18n.resource.workflow.main.THE_WORK_ORDER + ' ' + taskTitle + ' ' + I18n.resource.workflow.main.IS_CREATED_SUCCESSFULLY).showAtTop(2000);
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
                    if (notice.grade === 1) {
                        var $warningCount = $('#navFloor-' + AppConfig.zoneId).next('.warningCount');
                        $warningCount.text($warningCount.text() - 1);
                    } else if (notice.grade === 2) {
                        var $alertCount = $('#navFloor-' + AppConfig.zoneId).siblings('.alertCount');
                        $alertCount.text($alertCount.text() - 1);
                    }
                }
            };

            //description的{i}替换为detail[i]
            var equipmentName, zone, zoneID,
                equipmentId = notice.equipmentId;

            var diagnosisLength = _this.result.equipments.length;
            var diagnosisZones = _this.result.zones;

            for (var i = 0; i < diagnosisLength; i++) {
                if (equipmentId === _this.result.equipments[i].id) {
                    equipmentName = _this.result.equipments[i].name;
                    zoneID = _this.result.equipments[i].zoneId;
                    break;
                }
            }

            for (var k = 0; k < diagnosisZones.length; k++) {
                if (diagnosisZones[k].id === zoneID) {
                    zone = diagnosisZones[k].subBuildingName;
                    break;
                }
            }


            var str = notice.description;
            var arr = notice.detail ? notice.detail.split(',') : [];
            var matchRt = str.match(/\{\d\}/g);
            if (matchRt && matchRt instanceof Array) {
                matchRt.forEach(function (val, index) {
                    str = str.replace(val, arr[index] ? arr[index] : '')
                });
            }

            var chartEndTime;
            //报警后6小时的时间;
            var sixChartTime = new Date(new Date(momentTime).getTime() + 6 * 60 * 60 * 1000);

            if (sixChartTime.getTime() > new Date().getTime()) {
                chartEndTime = new Date().format('yyyy-MM-dd HH:mm:ss');
            } else {
                chartEndTime = new Date(sixChartTime).format('yyyy-MM-dd HH:mm:ss');
            }

            wiInstance = new WorkflowInsert({
                zone: zone,
                equipmentName: equipmentName,
                noticeId: notice.id,
                faultId: notice.faultId,
                title: notice.name,
                detail: notice.description,
                dueDate: new Date(+new Date() + 172800000).format('yyyy-MM-dd'), //结束时间为两天后
                critical: notice.grade,
                projectId: Number(notice.project),
                chartPointList: notice.points,
                chartQueryCircle: 'm5',
                description: str,
                name: notice.name,
                time: new Date(momentTime).format('yyyy-MM-dd HH:mm:ss'),
                chartStartTime: new Date(new Date(momentTime).getTime() - 6 * 60 * 60 * 1000).format('yyyy-MM-dd HH:mm:ss'), //报警发生前六小时
                chartEndTime: chartEndTime
            });
            wiInstance.show().submitSuccess(function (taskModelInfo) {
                insertCallback(taskModelInfo);
                this.close();
                back();
            }).cancel(function () {
                back();
            }).fail(function () {
                Alert.danger($("#workflow-insert-container"), I18n.resource.workflow.main.CREATE_WORKFLOW_FAILED).showAtTop(2000);
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
            var urgentCount = 0,
                criticalCount = 0,
                className;
            this.insertLogGroup();

            var item, parent;
            for (var i = 0, len = _this.arrLastNotice.length; i < len; i++) {
                item = _this.arrLastNotice[i];
                item.index = i;
                var grade = item.grade;
                if (1 == grade) {
                    className = 'adNormal';
                    criticalCount++;
                } else if (2 == grade) {
                    className = 'faultPro';
                    urgentCount++;
                } else {
                    continue;
                }
                _this.insertLogItem(item, i, className);
            }

            _this.criticalCount = _this.arrLastNotice.length;

            if (_this.criticalCount > 0) {
                $('#btnWarningLog').find('.badge').show().html(_this.criticalCount);
            } else {
                $('#btnWarningLog').find('.badge').hide();
            }

            var $btnErr = $('#abNomalP');
            if ($btnErr && $btnErr.length > 0) {
                $btnErr.change();
            }
        },

        insertLogGroup: function () { //,groupName
            var $abNomalP = $('#abNomalP');
            var $faultP = $('#faultP');
            var $divPaneNoticeItem = $('#divPaneNoticeItem');
            $divPaneNoticeItem.children().remove();

            $abNomalP.eventOn('change', function () {
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
                trackEvent('诊断日志筛选-异常', 'Diagnosis.Log.Filter.Abnormal.Click')
            }, '诊断日志异常筛选');
            $faultP.eventOn('change', function () {
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
                trackEvent('诊断日志筛选-故障', 'Diagnosis.Log.Filter.Fault.Click')
            }, '诊断日志故障筛选');
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
                _this.obScreen.showErrTip && _this.obScreen.showErrTip(modalTextId);
            };
            divNotice.onmouseleave = function (e) {
                var $this = $(e.currentTarget);
                var modalTextId = $this.attr('data-modaltextid');
                var pageId = $this.children('[pageid]').attr('pageid');
                if (modalTextId === undefined || _this.obScreen === undefined) return;
                if (_this.obScreen.id !== pageId) return;
                _this.obScreen.hideErrTip && _this.obScreen.hideErrTip(modalTextId);
            };

            var parent = $(divNotice);
            var $spWrap = $('<div>');

            sb = new StringBuilder();
            sb.append(item.name);
            if (item.status && item.status != '' && item.status != 0) {
                sb.append(' (').append(item.status).append(')');
            }
            spanFirst = $('<span>').addClass('badge').css('color', '#fff'); //.html(' _this.langCfg.LEVEL_SET.CRITICAL');
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
                trackEvent('诊断日志设备点击-' + e.currentTarget.innerHTML + '(' + equipment + ')', 'Diagnosis.Log.Equipment.Click')
                var equipment = e.currentTarget.getAttribute('equipment');
                equipment = parseInt(equipment);
                if (isNaN(equipment) || equipment < 1) return;
                this.dialog = new ObserverScreen(equipment);
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
                    trackEvent('诊断日志区域点击-' + e.currentTarget.innerHTML + '(' + zoneId + ')', 'Diagnosis.Log.Zone.Click')
                    if (pageId && pageId != '' && pageId != 0) {
                        $('#navFloor-' + zoneId).click();
                    } else {
                        alert('This floor has no details');
                    }
                }).appendTo($spWrap);


            $('<span>').attr({
                'title': 'Triggering time',
                'data-time': item.time
            }).text(timeFormat(item.time, timeFormatChange('mm-dd hh:ii')))
                .css({
                    'text-decoration': 'underline',
                    'font-weight': 'bold',
                    'color': '#F0AD4E',
                    'text-shadow': '2px 2px 1px rgba(50,50,50,0.2)'
                }).appendTo($spWrap);

            $('<span>').addClass('glyphicon glyphicon-ok-sign grow span-hover-pointer span-btn')
                .attr('title', 'Check')
                .eventOn('click', function (e) {
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
                        } else if (1 == level) {
                            selectLevel.val(_this.langCfg.LEVEL_SET.CRITICAL);
                        } else if (2 == level) {
                            selectLevel.val(_this.langCfg.LEVEL_SET.URGENT);
                        } else {
                            selectLevel.val(_this.langCfg.LEVEL_SET.NORMAL);
                        }

                        var selectTm = $('#selectAlarmTime');
                        selectTm.val(_this.langCfg.defaultPeriod.DELAY_FOREVER);
                    }

                    $('#dlgChangeRule').modal('show');
                    trackEvent('诊断日志检查点击', 'Diagnosis.Log.Check.Click')
                }, '诊断日志check').appendTo($spWrap);

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
                    .eventOn('click', function (e) {
                        var postItem = $.deepClone(item);
                        postItem.name = postItem.name + ' ' + i18n_resource.diagnosis.LEFT_PARENTHESIS + equipment.name + i18n_resource.diagnosis.RIGHT_PARENTHESIS;
                        _this.createWorkflowOrder(postItem);
                    }, '诊断日志发工单').appendTo($spWrap);

            }

            //添加反馈;
            var feedbackComment;
            switch (item.FeedBack) {
                case 0:
                    feedbackComment = '<span class="glyphicon glyphicon-comment unhandled grow span-hover-pointer span-btn" data-id="' + item.id + '"></span>';
                    break;
                case 1:
                case 2:
                    feedbackComment = '<span class="glyphicon glyphicon-comment grow span-hover-pointer span-btn" data-id="' + item.id + '"style="color: #0078DC !important"></span>';
                    break;
                case 3:
                    feedbackComment = '<span class="glyphicon glyphicon-comment grow span-hover-pointer span-btn" data-id="' + item.id + '"style="color: #29BB4F !important"></span>';
                    break;
                default:
                    break;
            }
            $(feedbackComment)
                .eventOn('click', function (e) {
                    var itemEquipmentId = item.equipmentId;
                    var diagnosisLength = _this.result.equipments.length;
                    for (var i = 0; i < diagnosisLength; i++) {
                        if (itemEquipmentId == _this.result.equipments[i].id) {
                            var currentEquipmentName = _this.result.equipments[i].name;
                            break;
                        }
                    }
                    var detailPrefix = I18n.resource.workflow.main.PROJECT_NAME + AppConfig.projectShowName + "\n" +
                        I18n.resource.workflow.main.ORDER_EQUIPMENT_NAME + currentEquipmentName + "\n" +
                        I18n.resource.workflow.main.ORDER_FAULT_INFO + item.description + "\n" +
                        I18n.resource.workflow.main.ORDER_FEEDBACK_MSG;

                    var chartEndTime;
                    //报警后6小时的时间;
                    var sixChartTime = new Date(new Date(item.time).getTime() + 6 * 60 * 60 * 1000);

                    if (sixChartTime.getTime() > new Date().getTime()) {
                        chartEndTime = new Date().format('yyyy-MM-dd HH:mm:ss');
                    } else {
                        chartEndTime = new Date(sixChartTime).format('yyyy-MM-dd HH:mm:ss');
                    }

                    var obj = {
                        id: divNotice.id,
                        FeedBackId: item.FeedBackId,
                        feedback: item.FeedBack,
                        commentRecord: true,
                        faultId: item.faultId,
                        title: I18n.resource.workflow.main.FEEDBACK_TITLE + item.name,
                        description: item.description,
                        detailPrefix: detailPrefix,
                        dueDate: new Date((new Date().getTime() + 2592000000 /*1000*60*60*24*30*/ )).format('yyyy-MM-dd HH:mm:ss'),
                        critical: item.grade,
                        projectId: Number(item.project),
                        chartPointList: item.points,
                        chartQueryCircle: 'm5',
                        chartStartTime: new Date(new Date(item.time.toDate()).getTime() - 6 * 60 * 60 * 1000).format('yyyy-MM-dd HH:mm:ss'),
                        chartEndTime: chartEndTime
                    }
                    if ($(this).hasClass('unhandled')) {
                        obj.feedbackUnhandled = true;
                    }
                    new WorkflowFeedBack(obj).show();
                    trackEvent('诊断日志反馈点击', 'Diagnosis.Log.Callback.Click')
                }, '诊断日志反馈').appendTo($spWrap);

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
            /*            if (item.energy && parseFloat(item.energy) > 0) {
             strDesc += '<span style="margin-left:10px;">(' + I18n.resource.diagnosis.diagnosticLog.ENERGY_CONSSERVATION + item.energy + 'kWh)</span>';
             }*/
            $('<p>').html(strDesc).appendTo(parent);

            divParent.append(parent);

            _this.renderPaneBuilding(item, item, equipment, zone);
            _this.renderPaneNav(item, item, equipment);
        },

        showObserver: function (_this, id) {
            //trackEvent('诊断监控渲染', 'Diagnosis.Observer.Render', { zone: id })
            var $container;
            if (id.length && id.length == 24) {
                // 显示 spinner
                _this.$obContainer.children('#divMain').hide();
                $container = _this.$obContainer.children('#pageContainer').show();
                Spinner.spin($container[0]);
                _this.obScreen = new observer.screens.PageScreen({'id': id}, $container[0]);
                _this.obScreen.show();
            } else {
                _this.$obContainer.children('#divMain').show();
                _this.$obContainer.children('#pageContainer').hide();
                _this.obScreen = new ObserverScreen(id);
                _this.initObScreen();
                _this.obScreen.show(_this.$obContainer[0]);
            }
        }
    };

    return DiagnosisScreen;
})();