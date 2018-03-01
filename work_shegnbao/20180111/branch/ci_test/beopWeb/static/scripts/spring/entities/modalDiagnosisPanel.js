var ModalDiagnosisPanel = (function () {
    var _this = undefined;
    
    function ModalDiagnosisPanel(dom) {
        this.ElScreenContainer = window.ElScreenContainer || $('body')[0];
        this.parent = dom||this.ElScreenContainer;
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
        this.result = undefined;
        _this = this;
    }
    ModalDiagnosisPanel.prototype = {
        show: function () {
            Spinner.spin(this.ElScreenContainer);
            WebAPI.get("/static/views/observer/widgets/modalDiagnosisPanel.html").done(function (resultHtml) {
                $(_this.parent).html(resultHtml);
                I18n.fillArea($(_this.parent));
                _this.init();
            }).always(function () {
                    Spinner.stop();
                }
            );
        },
        optionTemplate: {
            name: 'toolBox.modal.DIAGNOSIS_PANEL',
            parent: 0,
            mode: [''],
            maxNum: 1,
            title: '',
            //defaultHeight: 4.5,
            //defaultWidth: 3,
            minHeight: 2,
            minWidth: 4,
            maxHeight: 6,
            maxWidth: 12,
            type: 'ModalDiagnosisPanel'
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
                var equipments = [];

                for (var j = 0; j < data.equipments.length; j++) {
                    if (data.equipments[j].zoneId == item.id) {
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
            this.$obContainer = $('#obContainer');
            this.dictObserverText = {};

            WebAPI.get('/diagnosis/getStruct/' + AppConfig.projectId).done(function (result) {
                _this.initStructData(result);
                _this.initPaneNav();
                _this.result = result;
                // 加载默认楼层
                $('.subBuildingBtn', '#paneIcon').eq(0).trigger('click');
                $('.div-nav-row', '#paneIcon').eq(0).children('span:first').trigger('click');

                //切换到故障历史页面
                /*$('#btnShowFaultHist').on('click', function(e){
                    e.stopPropagation();
                    WebAPI.get('/static/scripts/observer/faultHistoryModal.html').done(function(resultHTML){
                        $('body').append(resultHTML);
                        $('#modalFaultHist').modal('show');
                        $('#modalFaultHist').on('hide.bs.modal', function(){
                            $(this).remove();
                        });
                    })
                });*/
            });


            //关闭tableModal页面并关闭线程
            function tabelModelClose() {
                $('#panelIconNew').hide();
                if (_this.tableModelUpdate) _this.tableModelUpdate.terminate();
                _this.tableModelUpdate = null;
            }

            $("#btnNoticeHistory").off().click(function (e) {
                ScreenModal = new DiagnosisLogHistory(_this);
                ScreenModal.setIsModal(true);
                ScreenModal.show();
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
        initWorkerForUpdating: function () {
            if (this.workerUpdate) {
                this.workerUpdate.terminate();
            }
            Spinner.spin(this.parent);
            this.workerUpdate = new Worker("/static/views/js/worker/workerUpdate.js");
            this.workerUpdate.self = this;
            this.workerUpdate.addEventListener("message", this.refreshData, true);
            this.workerUpdate.addEventListener("error", function (e) {
                console.log(e)
            }, true);
            //获取全部数据
            //this.workerUpdate.postMessage({
            //    projectId: AppConfig.projectId,
            //    type: "allDiagnosisScreen"
            //});
            //获取层级数据
            this.workerUpdate.postMessage({
                projectId: AppConfig.projectId,
                type: "diagnosisScreen",
                zoneId: AppConfig.zoneId
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

            } else {
                $('#spinnerLoadingNotice').remove();
                //new Alert(ElScreenContainer, Alert.type.danger, I18n.resource.code[e.data.error]).showAtTop(5000);
            }
            $('#spinnerLoadingNotice').remove();
            $('#btnWarningLog').fadeIn();
            $('#navigation').fadeIn();
            $('#diagnosisLogCt').slideDown();
            Spinner.stop();

            if (isOnlyRenderDictFault) return; //如果是resetFloor调用refreshData, 只需渲染页面的缺陷高亮, 诊断缺陷个数及诊断信息面板无需渲染,故return

            //渲染诊断缺陷个数
            $('.badge.warningCount', '#paneIcon').empty();//渲染之前清空个数
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
                        if(alertCount > 0){
                            $targetAlert.html(alertCount);
                        }else{
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
        //默认目录
        initPaneNav: function () {
            var pane = document.createElement('div');
            var div, zoneItem, itemI, itemJ;
            var zoneItemList = [];
            var $buildingBox, $subBuilding = $('.subBuilding'), $subBuildingList, countHtml;
            var $dropdownBtn = $('#dropdownBtn');
            for (var zoneId in this.dictZone) {
                zoneItem = this.dictZone[zoneId];
                zoneItemList.push(zoneItem);
            }
            var paneIcon = document.getElementById('paneIcon');
            paneIcon.innerHTML = "";
            paneIcon.appendChild(pane);
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
                        $buildingBox = $('<div class="div-nav-box' + itemI.buildingId + '"><span id="building_' + itemI.buildingId + '" class="grow subBuildingBtn"></span><span class="badge warningCount"></span><span class="badge alertCount"></span></div>');
                        $buildingBox.find('#building_' + itemI.buildingId).html(itemI.buildingName);
                        $subBuildingList = $('<div class="subBuildingList" id="subList_' + itemI.buildingId + '"></div>');
                        $buildingBox.append($subBuildingList);
                        $(pane).append($buildingBox);
                    }
                    // 显示诊断缺陷个数
                    if (itemI.count && itemI.count > 0) {
                        countHtml = '<span class="badge warningCount">' + itemI.count + '</span><span class="badge alertCount"></span>';
                    } else {
                        countHtml = '<span class="badge warningCount"></span><span class="badge alertCount"></span>';
                    }
                    var $subBuildings = $('#subList_' + itemI.buildingId).children('.subBuilding');
                    var countArry = [];
                    for(var k= 0;k<$subBuildings.length;k++){
                        countArry.push(parseInt($subBuildings.eq(k).attr('count')));
                    }
                    if((countArry.length === 0) || (itemI.count>countArry[countArry.length-1])){
                        $subBuilding = $('<div class="div-nav-row subBuilding" count="' + itemI.count + '"><span class="div-row-icon-badge grow subBuildingItem" pageId="' + itemI.pageId + '" id="navFloor-' + itemI.id + '"></span>' + countHtml + '</div>');
                        $subBuilding.find('.subBuildingItem').html(itemI.subBuildingName);
                        $('#subList_' + itemI.buildingId).append($subBuilding);
                    }else{
                        for(var q = 0;q<countArry.length;q++){
                            if(itemI.count<countArry[q]){
                                $subBuilding = $('<div class="div-nav-row subBuilding" count="' + itemI.count + '"><span class="div-row-icon-badge grow subBuildingItem" pageId="' + itemI.pageId + '" id="navFloor-' + itemI.id + '"></span>' + countHtml + '</div>');
                                $subBuilding.find('.subBuildingItem').html(itemI.subBuildingName);
                                $($subBuildings[q]).before($subBuilding);
                                break;
                            }else if(itemI.count===countArry[q]){
                                if(countArry[q] === countArry[countArry.length-1]){
                                    $subBuilding = $('<div class="div-nav-row subBuilding" count="' + itemI.count + '"><span class="div-row-icon-badge grow subBuildingItem" pageId="' + itemI.pageId + '" id="navFloor-' + itemI.id + '"></span>' + countHtml + '</div>');
                                    $subBuilding.find('.subBuildingItem').html(itemI.subBuildingName);
                                    $('#subList_' + itemI.buildingId).append($subBuilding);
                                    break;
                                }else{
                                    for(var p = q;p<countArry.length;p++){
                                        if(itemI.count<countArry[p]){
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
                    $dropdownBtn.off('click').on('click', function () {
                        $(this).siblings('.dropdownList').toggleClass('hidden');
                    });
                    $subBuilding.find('.subBuildingItem').off('click').click(function () {
                        var $this = $(this);
                        var id = $this.attr('pageId');

                        AppConfig.zoneId = this.id.split('-')[1];
                        //增加选中样式
                        $('.subBuildingItem.selected').removeClass('selected');
                        $this.addClass('selected');
                        $dropdownBtn.html($this.text()+'<span class="caret"></span>');

                        ////加载当前楼层的诊断信息
                        _this.arrLastNotice.length = 0;
                        _this.initWorkerForUpdating();
                        //导航隐藏
                        $this.closest('.dropdownList').addClass('hidden');
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
            var allCount = 0;
            $('[class ^="div-nav-box"]').each(function () {
                var warningCount = 0,alertCount = 0;
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
                allCount += (warningCount + alertCount);
            });
            $('#logWrap #toolBar #btnWarningLog .badge').html(allCount);
        },

        createWorkflowOrder: function (notice) {
            var wiInstance;
            var momentTime = notice.time.toDate();
            var back = function () {
                wiInstance = null;
            };
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
            var str = notice.description;
            var arr = notice.detail ? notice.detail.split(',') : [];
            var matchRt = str.match(/\{\d\}/g);
            if (matchRt && matchRt instanceof Array) {
                matchRt.forEach(function (val, index) {
                    str = str.replace(val, arr[index] ? arr[index] : '')
                });
            }

            wiInstance = new WorkflowInsert({
                noticeId: notice.id,
                title: notice.name,
                detail: notice.description,
                dueDate: new Date(+new Date() + 172800000).format('yyyy-MM-dd'),  //结束时间为两天后
                critical: notice.grade,
                projectId: Number(notice.project),
                chartPointList: notice.points,
                chartQueryCircle: 'm5',
                description: str,
                name: notice.name,
                time: new Date(momentTime).format('yyyy-MM-dd HH:mm:ss'),
                chartStartTime: new Date(new Date(momentTime).getTime() - 12 * 60 * 60 * 1000).format('yyyy-MM-dd HH:mm:ss'), //报警发生前半天
                chartEndTime: new Date(new Date(momentTime).getTime() + 12 * 60 * 60 * 1000).format('yyyy-MM-dd HH:mm:ss')   //报警发生后半天
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
               $('#diagnosisLogCt').find('.badge.count').html(_this.criticalCount);
            } else {
               $('#diagnosisLogCt').find('.badge.count').html('0');
            }

            var $btnErr =  $('#abNomalP');
            if ($btnErr && $btnErr.length > 0) {
                $btnErr.change();
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

            var parent = $(divNotice);
            var $spWrap = $('<div style="white-space: nowrap;">');

            spanFirst = $('<span>');//.html(' _this.langCfg.LEVEL_SET.CRITICAL');
            switch (item.grade) {
                case 0:
                    break;
                case 1:
                    spanFirst.addClass('badge wrongTag').html(_this.langCfg.LEVEL_SET.CRITICAL);
                    break;
                case 2:
                    spanFirst.addClass('badge dangerTag').html(_this.langCfg.LEVEL_SET.URGENT);
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
                
            });
            $spWrap.append(span);


            $('<span>').addClass('badge grow span-hover-pointer')
                .attr({
                    'pageId': zone.pageId,
                    'title': 'Zone ID',
                    'data-zoneId': zone.id
                }).text(zone.subBuildingName)
                .click(function (e) {
                    
                }).appendTo($spWrap);


            $('<span>').attr({
                'title': 'Triggering time',
                'data-time': item.time
            }).text(timeFormat(item.time,timeFormatChange('mm-dd hh:ii')))
                .addClass('dateTime').appendTo($spWrap);

            if (item.orderId && item.orderId != 0 && item.orderId != '') {
                //$('<span>').addClass('glyphicon glyphicon-tags grow span-hover-pointer span-btn')
                //    .attr('title', 'Show workflow order')
                //    .attr('workflow', item.orderId)
                //    .click(function (e) {
                //        if (ScreenCurrent) ScreenCurrent.close();
                //        ScreenManager.show(beop.main, e.currentTarget.getAttribute('workflow'));
                //    }).appendTo($spWrap);
            } else {
                //发布工单按钮
                $('<span>').addClass('createWorkflowSpan glyphicon glyphicon-share grow span-hover-pointer span-btn')
                    .attr('title', 'Create workflow order')
                    .click(function (e) {
                        _this.createWorkflowOrder(item);
                    }).appendTo($spWrap);
            }
            //添加反馈;
            $('<span class="feedbackSpan glyphicon glyphicon-comment grow span-hover-pointer span-btn" title="feedback">')
                .eventOn('click', function (e) {
                    var itemEquipmentId = item.equipmentId;
                    var diagnosisLength = _this.result.equipments.length;
                    for (var i = 0; i < diagnosisLength; i++) {
                        if (itemEquipmentId == _this.result.equipments[i].id) {
                            var currentEquipmentName = _this.result.equipments[i].name;
                            break;
                        }
                    }
                    var detailPrefix = I18n.resource.workflow.main.ORDER_EQUIPMENT_NAME + currentEquipmentName + "\n" +
                        I18n.resource.workflow.main.ORDER_FAULT_INFO + item.description + "\n" +
                        I18n.resource.workflow.main.ORDER_FEEDBACK_MSG;

                    new WorkflowFeedBack({
                        faultId: item.faultId,
                        title: I18n.resource.workflow.main.FEEDBACK_TITLE + item.name,
                        description: item.description,
                        detailPrefix: detailPrefix,
                        dueDate: new Date((new Date().getTime() + 2592000000 /*1000*60*60*24*30*/)).format('yyyy-MM-dd HH:mm:ss'),
                        critical: item.grade,
                        projectId: Number(item.project),
                        chartPointList: item.points,
                        chartQueryCircle: 'm5',
                        chartStartTime: new Date(new Date(item.time.toDate()).getTime() - 43200000 /*12 * 60 * 60 * 1000*/).format('yyyy-MM-dd HH:mm:ss'),
                        chartEndTime: new Date(new Date(item.time.toDate()).getTime() + 43200000 /*12 * 60 * 60 * 1000*/).format('yyyy-MM-dd HH:mm:ss')
                    }).show();
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
            $('<p>').html(strDesc).appendTo(parent);

            divParent.append(parent);

        },

        
    };

    return ModalDiagnosisPanel;
})();

//诊断面板模块
var ModalDiagnosisPanelHtml = (function () {
    function ModalDiagnosisPanelHtml(screen,entityParams) {
        ModalBase.call(this, screen, entityParams, this.renderModal, this.updateModal, this.showConfigMode);
        this.screen = screen;
        this.entity = entityParams;
    }

    ModalDiagnosisPanelHtml.prototype = Object.create(ModalHtml.prototype);
    ModalDiagnosisPanelHtml.prototype.constructor = ModalDiagnosisPanelHtml;
    ModalDiagnosisPanelHtml.prototype.optionTemplate = {
        name: 'toolBox.modal.DIAGNOSIS_PANEL',
        parent: 0,
        mode: [''],
        maxNum: 1,
        title: '',
        minHeight: 4,
        minWidth: 3,
        maxHeight: 6,
        maxWidth: 12,
        type: 'ModalDiagnosisPanelHtml',
        tooltip: {
            'imgPC': true,
            'imgMobile': false,
            'isSpecData':false,
            'desc': ''
        }
    };
    return ModalDiagnosisPanelHtml;
})();
