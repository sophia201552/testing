var DiagnosisNav = (function() {
    var _this;

    function DiagnosisNav(container, projectId) {
        this.container = container;
        this.proId = projectId ? projectId : AppConfig.projectId;
        this.details = [];
        this.faultName = undefined;
        this.hasEnergy = false;
        this.equipmentName = undefined;
        this.type = undefined;
        this.firstSevelData = undefined;
        _this = this;
        _this.equipmentSecondData = undefined;
    }
    DiagnosisNav.prototype = {
        show: function() {
            var style = '<style>\
                            .diagnosisNav{\
                                width: calc(100% - 5px);\
                                height: calc(100% - 10px);\
                                background: rgb(27,35,54);\
                                color: #ffffff;\
                                border-radius: 8px;\
                                margin: 2px 0px 5px 5px;\
                                position:relative;\
                            },\
                            .diagnosisNav .titleCtn{\
                                padding: 0;\
                                margin: 0;\
                                overflow: hidden;\
                                background: rgb(27,35,54);\
                            }\
                            .diagnosisNav .titleCtn li{\
                                float: left;\
                                padding: 10px 15px;\
                                list-style: none;\
                                cursor: pointer;\
                                margin-bottom: -1px;\
                                color: #e7f1ff;\
                            }\
                            .diagnosisNav .titleCtn:after{\
                                content:".";\
                                display:block;\
                                height:0;\
                                clear:both;\
                                visibility:hidden;\
                            }\
                            .diagnosisNav .titleCtn li.active{\
                                border-radius: 2px;\
                                padding: 0;\
                                color: #fcb813;\
                            }\
                            .diagnosisNav .titleCtn li.active span{\
                                border: 1px solid #384a67;\
                                border-bottom-color: transparent;\
                                display: block;\
                                padding: 10px 15px;\
                                background: rgb(27,35,57);\
                                border-top-right-radius: 6px;\
                                border-top-left-radius: 6px;\
                            }\
                            .diagnosisNav .detailsCtn{\
                                height: calc(100% - 40px);\
                                border: 1px solid #384a67;\
                                border-top: none;\
                                padding-top: 5px;\
                            }\
                            .diagnosisNav .detailsCtn>div{\
                                height: 100%;\
                            }\
                            .diagnosisNav .faultTitle{\
                                overflow: hidden;\
                                cursor: pointer;\
                                border-bottom: 1px solid #384a67;\
                            }\
                            .detailsBox{\
                                overflow: auto;\
                                height: calc(100% - 40px);\
                                border-radius: 4px;\
                            }\
                            .diagnosisNav .paddingSame{\
                                padding: 10px 15px;\
                                float: left;\
                            }\
                            .diagnosisNav .paddingSame.active .glyphicon{\
                                color: #fcb813;\
                            }\
                            .diagnosisNav .projectDetails,.diagnosisNav .level{\
                                overflow: hidden;\
                                border-bottom: 1px solid rgba(56, 74, 103, 0.72);\
                                cursor:pointer;\
                            }\
                            .diagnosisNav .projectDetails.active,.diagnosisNav .level.active{\
                                color: #fcb813;\
                            }\
                            .diagnosisNav .level-2{\
                                overflow: hidden;\
                                background: #28324b;\
                                color: #c8d2e6;\
                            }\
                            .diagnosisNav .level-3{\
                                overflow: hidden;\
                                background: rgba(56, 73, 106,0.6);\
                                color: #c8d2e6;\
                            }\
                            .diagnosisNav #equipmentBox{\
                                color:#c4d1e5;\
                                background:#182334;\
                                width: calc(100% - 10px);\
                                height: calc(100% - 10px);\
                                margin: 5px;\
                                border-radius: 8px;\
                            }\
                            .diagnosisNav #equipmentBox .proTreeList{\
                                height:100%;\
                                margin-right:10px;\
                                overflow-y: auto;\
                                overflow-x: hidden;\
                            }\
                            .diagnosisNav #equipmentBox .proTreeTitle{\
                                padding:0 15px;\
                                height:3rem;\
                                line-height:3rem;\
                                font-size:16px;\
                                color:#adbbd1;\
                                border-bottom:0;\
                                position: relative;\
                            }\
                            .diagnosisNav #equipmentBox .proTreeContent{\
                                overflow-y: auto;\
                            }\
                            .diagnosisNav #equipmentBox .groupTitle,.diagnosisNav #equipmentBox .groupList,.diagnosisNav #equipmentBox .titleSecond{\
                                height:3rem;\
                                line-height: 3rem;\
                                border-bottom:1px solid #2c3b58;\
                            }\
                            .diagnosisNav #equipmentBox .groupTitle{\
                                padding:0 15px;\
                                cursor:pointer;\
                                background: rgba(43, 54, 85, 0.51);\
                                color:#a3b1c4;\
                                font-size:14px;\
                            }\
                            .diagnosisNav #equipmentBox .groupTitle.selected{\
                                color: #fcb813;\
                            }\
                            .diagnosisNav #equipmentBox .titleSecond{\
                                padding:0 25px;\
                                cursor:pointer;\
                                background: rgb(40,50,74);\
                            }\
                            .diagnosisNav #equipmentBox .titleSecond.selected{\
                                color: #fcb813;\
                            }\
                            .diagnosisNav #equipmentBox .groupList{\
                                padding:0 32px;\
                                color:#9ca9c4;\
                                font-size:12px;\
                                cursor:pointer;\
                            }\
                            .diagnosisNav #equipmentBox .groupList:hover{\
                                background:#26324a;\
                                color:#b7c1d5;\
                            }\
                            .diagnosisNav #equipmentBox .groupTitleText{\
                                float: left;\
                                text-overflow: ellipsis;\
                                overflow: hidden;\
                                white-space: nowrap;\
                                width: 86%;\
                            }\
                            .diagnosisNav #equipmentBox .groupTitleText.selected{\
                                color: #fcb813;\
                            }\
                            .diagnosisNav #equipmentBox .groupTitlePercent{\
                                float: right;\
                            }\
                            .diagnosisNav #equipmentBox .currentGroup .groupSecond{\
                                display:none;\
                            }\
                            .diagnosisNav #equipmentBox .currentGroupBox{\
                                display: none;\
                            }\
                            .diagnosisNav #equipmentBox .colorGreen{\
                                color:#4e9258;\
                            }\
                            .diagnosisNav #equipmentBox .colorRed{\
                                color:#aa1b28;\
                            }\
                            .diagnosisNav #equipmentBox .currentGroup{\
                                display:none;\
                            }\
                            .diagnosisNav .titleThird{\
                                padding: 0 35px;\
                                cursor: pointer;\
                                background: rgba(56, 73, 106,0.6);\
                                height: 3rem;\
                                line-height: 3rem;\
                                border-bottom: 1px solid #3b4355;\
                            }\
                            .diagnosisNav .titleThird.selected{\
                                color: #fcb813;\
                            }\
                            .diagnosisNav #equipmentBox .groupThird .groupList{\
                                padding: 0 45px;\
                            } \
                            .diagnosisNav .groupThird{\
                                display:none;\
                                background: rgba(56, 73, 106,0.8);\
                            }\
                            .diagnosisNav .groupTitleNomal{\
                                color:#ec2b2b;\
                            }\
                            .diagnosisNav span[type=noteData]{\
                                color: #428bca;\
                            }\
                            .diagnosisNav span[type=warningData]{\
                                color: rgb(240, 173, 78);\
                            }\
                            .diagnosisNav span[type=faultData]{\
                                color: rgb(217, 83, 79);\
                            }\
                            .diagnosisNav #btnShowHist,\
                            .diagnosisNav #btnConfig{\
                                padding: 0px 12px;\
                                border-radius: 4px;\
                                font-size: 12px;\
                                position: absolute;\
                                right: 15px;\
                                top: 6px;\
                                cursor: pointer;\
                                background-color: #428bca;\
                                color: #fff;\
                                height: 30px;\
                                line-height: 30px;\
                            }\
                            .diagnosisNav #btnConfig{\
                                right: 100px;\
                            }\
                            .diagnosisNav .paddingSame.countSum, .diagnosisNav .paddingSame.energySum{\
                                width:30%;\
                                text-align:center;\
                                display: flex;\
                                justify-content: center;\
                                align-items: center;\
                            }\
                            .faultsDetail{\
                                color: #ddd;\
                            }\
                            #faultBox .tooltip .tooltip-inner {\
                                padding: 8px;\
                            }\
                        </style>';
            var layout = '<div class="diagnosisNav">\
                            <ul class="titleCtn" style="padding:0;margin:0;overflow:hidden;border-bottom: 1px solid #384a67;overflow:visible;">\
                                <li data-index="0"><span i18n="diagnosis.diagnosisROI.FAULT">Fault</span></li>\
                                <li data-index="1"><span i18n="diagnosis.diagnosisROI.EQUIPMENT">Equipment</span></li>\
                            </ul>\
                            <span id="btnConfig" i18n="equipmentHealth.CONFIG">配置</span>\
                            <span id="btnShowHist" i18n="equipmentHealth.SHOW_HISTORY">查看历史</span>\
                            <div class="detailsCtn"></div>\
                        </div>';
            $(this.container).html(style);
            $(this.container).append($(layout));
            this.init();
            var hash = location.hash;
            if (AppConfig.isMobile || ScreenCurrent.isForMobile || (ScreenCurrent.options && ScreenCurrent.options.isForMobile)) {
                this.isMobile = true;
                this.type = 'equipment';
                this.equipmentName = undefined;
            } else {
                this.isMobile = false;
                var jsonObj = JSON.parse(unescape(decodeURI(location.hash)).split('&')[1].split('=')[1]);
                this.type = jsonObj.type;
                this.equipmentName = jsonObj.name;
            }
            if (this.type === 'fault') {
                $(this.container).find('.titleCtn li').eq(0).addClass('active').trigger('click');
            } else if (this.type === 'equipment') {
                $(this.container).find('.titleCtn li').eq(1).addClass('active').trigger('click');
            } else {
                $(this.container).find('.titleCtn li').eq(0).addClass('active').trigger('click');
            }
        },
        init: function() {
            this.initFault();
            this.initEquiment();
            I18n.fillArea($(this.container));
            this.attachEvents();
        },
        initFault: function() {
            var faultLayout = '<div id="faultBox" data-backdrop="static">\
                                    <div class="faultTitle">\
                                        <div class="paddingSame" style="width:70%;"><span class="iconfont icon-roi-2" style="margin-right: 6px;font-size: 14px;"></span><span class="timeContent"></span></div>\
                                        <div class="paddingSame countSum sort" data-placement="bottom" data-toggle="tooltip" title="' + I18n.resource.diagnosis.diagnosisROI.COUNT + '">\
                                            <span class="iconfont icon-roi-1" style="padding-left:4px;"></span>\
                                            <span class="glyphicon glyphicon-arrow-down" style="padding-left:4px;transform: scaleX(0.7);"></span>\
                                        </div>\
                                    </div>\
                                    <div class="gray-scrollbar detailsBox">\
                                        <div class="projectDetails">\
                                            <div class="proName paddingSame" style="width:70%;"></div>\
                                            <div class="proFaults paddingSame" style="width:30%;text-align:center;"></div>\
                                        </div>\
                                        <div class="conCtn faultsDetail"></div>\
                                    </div>\
                                </div>';
            $(this.container).find('.detailsCtn').append($(faultLayout));
            var $timeContent = $(this.container).find('.timeContent');
            var timeZh = new Date().format('yyyy年MM月');
            var timeEn = timeFormat(new Date(), timeFormatChange('yyyy-mm'));
            AppConfig.language == 'zh' ? $timeContent.text(timeZh + '汇总') : $timeContent.text('Summary for ' + timeEn);
        },
        renderFault: function() {
            var _this = this;
            if (I18n.type === 'zh') {
                $(_this.container).find('.projectDetails .proName').html('全部');
            } else {
                $(_this.container).find('.projectDetails .proName').html('Total');
            }
            var options = {
                "dsItemIds": ["@" + _this.proId + "|DiagStaticsAll"]
            };
            var domSpinnerBox = $('#pageContainer').length > 0 ? $('#pageContainer')[0] : $('#indexMain')[0]
            Spinner.spin(domSpinnerBox);
            WebAPI.post('/analysis/startWorkspaceDataGenPieChart', options).done(function(result) {
                try {
                    var rankList = JSON.parse(result.dsItemList[0].data).MonthRankList;
                    var allCounts = 0,
                        allEnergy = 0;
                    for (var i = 0, length = rankList.length; i < length; i++) {
                        allCounts += Number(rankList[i].count);
                        if (rankList[i].energy !== undefined) {
                            allEnergy += Number(rankList[i].energy);
                            var singleRank = '<div class="levelCtn level-1-ctn">\
                                            <div class="level level-1">\
                                                <div class="paddingSame rankName" style="width:60%;padding-left:25px;">' + rankList[i].name + '</div>\
                                                <div class="paddingSame rankCount" style="width:20%;text-align:center;">' + rankList[i].count + '</div>\
                                                <div class="paddingSame rankEnergy" style="width:20%;text-align:center;">' + ((rankList[i].energy != 0) ? rankList[i].energy : '') + '</div>\
                                            </div>\
                                            </div>';
                            $(_this.container).find('.faultsDetail').append($(singleRank));
                        } else {
                            var singleRank = '<div class="levelCtn level-1-ctn">\
                                            <div class="level level-1">\
                                                <div class="paddingSame rankName" style="width:70%;padding-left:25px;">' + rankList[i].name + '</div>\
                                                <div class="paddingSame rankCount" style="width:30%;text-align:center;">' + rankList[i].count + '</div>\
                                            </div>\
                                            </div>';
                            $(_this.container).find('.faultsDetail').append($(singleRank));
                        }
                    }

                    if (rankList[0].energy !== undefined) {
                        _this.hasEnergy = true;

                        var $title = $(_this.container).find('#faultBox .faultTitle');
                        if ($title.find('div').length !== 3) {
                            $title.find('.paddingSame:nth-child(1)').css('width', '60%');
                            $title.find('.paddingSame:nth-child(2)').css({ 'width': '20%', 'text-align': 'center' });
                            var titles = '<div class="paddingSame energySum sort" style="width:20%;text-align:center;" data-placement="bottom" data-toggle="tooltip" title="' + I18n.resource.diagnosis.diagnosisROI.TITLE_SAVING + '"><span class="iconfont icon-roi-"></span><span class="glyphicon glyphicon-arrow-down" style="padding-left:4px;transform: scaleX(0.7);"></span></div>';
                            $title.append($(titles));
                        }
                        var $proj = $(_this.container).find('#faultBox .projectDetails');
                        if ($proj.find('div').length !== 3) {
                            $proj.find('.paddingSame:nth-child(1)').css('width', '60%');
                            $proj.find('.paddingSame:nth-child(2)').css({ 'width': '20%', 'text-align': 'center' });
                            var projInfo = '<div class="paddingSame proEnergy" style="width:20%;text-align:center;"</div>';
                            $proj.append($(projInfo));
                        }
                        $(_this.container).find('.proEnergy').html(allEnergy);
                    }
                    $(_this.container).find('.proFaults').html(allCounts);
                    $(_this.container).find('.level').eq(0).trigger('click');
                    $(_this.container).find('.countSum').attr('title', 'Numbers of faults detected / ' + allCounts);
                    $(_this.container).find('.energySum').attr('title', 'Energy saving potential / ' + allEnergy + '(kWh/yr)')
                    $('[data-toggle="tooltip"]').tooltip();
                } catch (e) {
                    Spinner.stop();
                    alert('No valid data returned');
                }

            }).always(function(){
                Spinner.stop();
            })
        },
        initEquiment: function() {
            var equipmentLayout = '<div id="equipmentBox" data-backdrop="static" style="display:none;">\
                                    <div class="proTreeList gray-scrollbar">\
                                        <div class="conCtn proTreeContent gray-scrollbar"></div>\
                                    </div>\
                                </div>';
            $(this.container).find('.detailsCtn').append($(equipmentLayout));
        },
        renderEquipment: function() {
            var _this = this;
            I18n.fillArea($(this.container));
            var equipmentName = I18n.resource.equipmentHealth;
            var $equipmentBox = $(this.container).find('#equipmentBox');
            var domSpinnerBox = $('#pageContainer').length > 0 ? $('#pageContainer')[0] : $('#indexMain')[0]
            var spinner = new LoadingSpinner({ color: '#00FFFF' });
            spinner.spin(domSpinnerBox);
            WebAPI.get('/appDashboard/EquipmentIntactRate/' + this.proId + '/' + I18n.type).done(function(result) { //Dashboard/EquipmentIntactRate/
                var treeList = result.data;
                var coldOrHotDom = '',
                    zoneInfo = '';
                var language = localStorage.getItem('language') == 'zh';
                for (var i = 0; i < treeList.length; i++) {
                    var item = treeList[i];
                    var IntactRateNum = item.IntactRate ? parseInt(item.IntactRate.split('%')[0]) : '';
                    coldOrHotDom += '<div class="groupTitle clearfix" data-TotalNum="' + item.TotalNum + '" data-GoodNum="' + item.GoodNum + '"><span class="groupTitleText">' + item.SubSystemName + '</span>' +
                        '<span class="groupTitlePercent">' + IntactRateNum + '%</span></div>';
                    if (item.Subitem && item.Subitem.length > 0) { //拥有二级菜单情况即三级菜单
                        coldOrHotDom += '<div class="currentGroupBox">';
                        var gropList = item.Subitem;
                        for (var j = 0; j < gropList.length; j++) {
                            var detailFirstList = gropList[j].Detail;
                            var interatNum = !gropList[j].IntactRate ? '' : gropList[j].IntactRate.split('.')[0] + '%';
                            zoneInfo = gropList[j].LocationInfo;
                            coldOrHotDom += '<div class="currentGroup">' +
                                '<div class="titleSecond clearfix" data-TotalNum="' + gropList[j].TotalNum + '" data-GoodNum="' + gropList[j].GoodNum + '"><span  class="groupTitleText">' + gropList[j].LocationInfo + '</span><span class="groupTitlePercent">' + interatNum + '</span></div>' +
                                '<div class="groupSecond">';
                            for (var k = 0; k < detailFirstList.length; k++) { //拥有四季菜单
                                var detailFirstListDetai = detailFirstList[k].Detail;
                                coldOrHotDom += '<div class="currentGroupSecond">' +
                                    '<div class="titleThird faultNameInfo clearfix" data-FaultDefaultGrade="' + detailFirstList[k].FaultDefaultGrade + '"  data-FaultDescription="' + detailFirstList[k].FaultDescription + '" data-FaultName="' + detailFirstList[k].FaultName + '"><span  class="groupTitleText" title="'+detailFirstList.FaultName +'">' + detailFirstList[k].FaultName + '</span><span class="groupTitleNomal groupTitlePercent">fault</span></div>' +
                                    '<div class="groupThird">';
                                for (var q = 0; q < detailFirstListDetai.length; q++) {
                                    coldOrHotDom += '<div class="groupList clearfix" data-toggle="tooltip" data-placement="bottom" data-FaultPoints="' + detailFirstListDetai[q].FaultPoints + '" data-EquipmentId="' + detailFirstListDetai[q].EquipmentId + '" data-EquipmentName="' + detailFirstListDetai[q].EquipmentName + '" data-NoticeId="' + detailFirstListDetai[q].NoticeId + '" data-NoticeTime="' + detailFirstListDetai[q].NoticeTime + '" data-Zone = "' + zoneInfo + '" data-NoticeTime="'+detailFirstListDetai[q].NoticeTime+'"><span class="groupTitleText">' + detailFirstListDetai[q].EquipmentName + '</span>' +
                                        '</div>';
                                }
                                //var states =  '异常';
                                coldOrHotDom += '</div></div>'
                            }
                            coldOrHotDom += '</div></div>'
                        }
                    } else {
                        coldOrHotDom += '<div class="currentGroupBox">';
                        var gropList = item.Detail;
                        for (var j = 0; j < gropList.length; j++) {
                            var detailFirstList = gropList[j];
                            var detailFirstListDetail = gropList[j].Detail;
                            var faultStatus = '';
                            var colorTypeFault = '';
                            switch (detailFirstList.FaultDefaultGrade) {
                                case 0:
                                    faultStatus = language ? '提示' : 'Note';
                                    colorTypeFault = 'noteData';
                                    break;
                                case 1:
                                    faultStatus = language ? '异常' : 'Warning';
                                    colorTypeFault = 'warningData';
                                    break;
                                case 2:
                                    faultStatus = language ? '故障' : 'Fault';
                                    colorTypeFault = 'faultData';
                                    break;
                            }

                            coldOrHotDom += '<div class="currentGroup">' +
                                '<div class="titleSecond faultNameInfo clearfix"  data-FaultName="' + detailFirstList.FaultName + '" data-FaultDefaultGrade="' + detailFirstList.FaultDefaultGrade + '" data-FaultDescription="' + detailFirstList.FaultDescription + '"><span  class="groupTitleText" title="' + detailFirstList.FaultName + '">' + detailFirstList.FaultName + '</span><span class="groupTitleNomal groupTitlePercent" type="'+ colorTypeFault +'">' + faultStatus + '</span></div>' +
                                '<div class="groupSecond">';
                            for (var k = 0; k < detailFirstListDetail.length; k++) {
                                var states = '异常';
                                coldOrHotDom += '<div class="groupList clearfix" data-toggle="tooltip" data-FaultPoints="' + detailFirstListDetail[k].FaultPoints + '" data-placement="bottom" title="' + detailFirstListDetail[k].EquipmentName + '" data-EquipmentId="' + detailFirstListDetail[k].EquipmentId + '"  data-NoticeId="' + detailFirstListDetail[k].NoticeId + '" data-NoticeTime="' + detailFirstListDetail[k].NoticeTime + '"  ><span class="groupTitleText">' + detailFirstListDetail[k].EquipmentName + '</span></div>'
                            }
                            coldOrHotDom += '</div></div>'
                        }
                    }
                    coldOrHotDom += '</div>';
                }
                $equipmentBox.find('.proTreeContent').html('');
                $equipmentBox.find('.proTreeContent').append(coldOrHotDom);
                //设备完好率的事件
                //每条记录的点击事件
                $equipmentBox.find('.groupList').off('click').on('click', function(e) {
                    var $this = $(this);
                    var currentEquip = $this.find('.groupTitleText').text();
                    var $parentPrev = $this.parent().prev('.faultNameInfo');
                    var noticeId = $this.attr('data-NoticeId');
                    var fault = $parentPrev.attr('data-FaultName') + '(' + currentEquip + ')';
                    var desc = currentEquip + ': ' + $parentPrev.attr('data-FaultDescription');
                    var points = $this.attr('data-FaultPoints');
                    var zone = $this.attr('data-Zone');
                    var momentTime = $this.attr('data-NoticeTime');
                    var back = function() {
                        wiInstance = null;
                    };
                    var currentData = [] ;
                    for(var i = 0;i<_this.equipmentSecondData.length;i++){
                        var item = _this.equipmentSecondData[i];
                        if(item.EquipmentName==currentEquip){
                            currentData.push(item);
                        }
                    }
                    var faultInfos = {};
                    var faultName = $parentPrev.attr('data-FaultName');
                    faultInfos['faultName'] = faultName;
                    faultInfos['faultDetailData'] = currentData;
                    faultInfos['containerScreen'] = $('#faultInfoBox');
                    faultInfos['diagType'] = 'fault';
                    faultInfos['projectId'] = _this.proId;
                    faultInfos['isMobile'] = _this.isMobile;
                    new DiagnosisInfo({ isShowROI: true }).show(faultInfos, [{ type: 'fault', value: faultName }]);

                    var arrData = {
                        equipmentId: $this[0].dataset.equipmentid,
                        EquipmentName: currentEquip,
                        arrNoticeTime: []
                    };
/*                    for (var i = 0; i < treeList.length; i++) {
                        var secDetail = treeList[i].Detail;
                        for (var j = 0; j < secDetail.length; j++) {
                            var threeDetail = secDetail[j].Detail;
                            for (var k = 0; k < threeDetail.length; k++) {
                                if (arrData.equipmentId == threeDetail[k].EquipmentId) {
                                    arrData.arrNoticeTime.push({'Time': threeDetail[k].NoticeTime});
                                }
                            }
                        }
                    }*/
                    (arrData.arrNoticeTime.length <= 0) && arrData.arrNoticeTime.push({'Time':momentTime});
                    wiInstance = new WorkflowInsert({
                        zone: zone,
                        equipmentName: currentEquip,
                        noticeId: noticeId,
                        title: fault,
                        detail: desc,
                        dueDate: new Date(+new Date() + 172800000).format('yyyy-MM-dd'), //结束时间为两天后
                        critical: 2,
                        projectId: _this.proId,
                        chartPointList: points,
                        chartQueryCircle: 'm5',
                        description: desc,
                        name: fault,
                        arrayEquipment: [arrData],
                        time: new Date(momentTime.replace(/-/g,'/')).format('yyyy-MM-dd HH:mm:ss'),
                        chartStartTime: new Date(new Date(momentTime.replace(/-/g,'/')).getTime() - 3 * 60 * 60 * 1000).format('yyyy-MM-dd HH:mm:ss'), //报警发生前半天
                        chartEndTime: new Date(new Date(momentTime.replace(/-/g,'/')).getTime() + 3 * 60 * 60 * 1000).format('yyyy-MM-dd HH:mm:ss') //报警发生后半天
                    });
                    wiInstance.show().submitSuccess(function(taskModelInfo, uploadFiles) {
                        this.close();
                        back();
                    }).cancel(function() {
                        back();
                    }).fail(function() {
                        Alert.danger($("#workflow-insert-container"), I18n.resource.workflow.main.CREATE_WORKFLOW_FAILED).showAtTop(2000);
                    });
                    return
                });
                //展开一级目录
                $equipmentBox.find('.groupTitle').off('click').click(function() {
                    $('.groupTitle.selected').removeClass('selected');
                    var $this = $(this).addClass('selected');
                    if ($this.next('.currentGroupBox').length > 0) {
                        if ($this.hasClass('active')) {
                            $this.removeClass('active');
                            $this.next('.currentGroupBox').hide();
                        } else {
                            $('.groupTitle').removeClass('active');
                            $('.currentGroup').hide();
                            $('.currentGroupBox').hide();
                            $this.addClass('active');
                            $this.next('.currentGroupBox').find('.currentGroup').show();
                            $this.next('.currentGroupBox').show();
                            // $this.next('.currentGroupBox').find( '.currentGroup:first .groupSecond').show();
                        }
                    } else {
                        if ($this.hasClass('active')) {
                            $this.removeClass('active');
                            $this.next('.currentGroup').hide();
                        } else {
                            $('.groupTitle').removeClass('active');
                            $('.currentGroup').hide();
                            $('.currentGroupBox').hide();
                            $this.addClass('active');
                            $this.next('.currentGroup').show();
                        }
                    }
                });
                //展开二级
                $equipmentBox.find('.titleSecond').off('click').click(function() {
                    $('.groupTitle.selected').removeClass('selected');
                    $('.titleSecond.selected').removeClass('selected');
                    var $this = $(this).addClass('selected');
                    if ($this.hasClass('active')) {
                        $this.removeClass('active');
                        $this.next('.groupSecond').hide();
                    } else {
                        $('.titleSecond').removeClass('active');
                        $('.groupSecond').hide();
                        $this.addClass('active');
                        $this.next('.groupSecond').show();
                        $this.next('.groupSecond').find('.faultNameInfo:first').trigger('click');
                    }
                });
                //三级
                $equipmentBox.find('.faultNameInfo').off('click').click(function(e) {
                    $('.groupTitle.selected').removeClass('selected');
                    $('.titleSecond.selected').removeClass('selected');
                    $('.faultNameInfo.selected').removeClass('selected');
                    $(this).addClass('selected');
                    var faultInfos = {};
                    var faultName = $(this).find('.groupTitleText').text();
                    var dataPoints = $(this).attr('data-faultpoints');

                    //开始时间为当月的第一天,结束时间为当前时间,精确到5分钟
                    var startTime = new Date();
                    var endTime = new Date();
                    startTime.setDate(1);
                    endTime.setMinutes(endTime.getMinutes() - endTime.getMinutes() % 5);
                    var postData = {
                        value: faultName,
                        type: 'fault',
                        startTime: startTime.format('yyyy-MM-dd 00:00:00'),
                        endTime: endTime.format('yyyy-MM-dd HH:mm:00'),
                        projId: _this.proId
                    }
                    var $faultList;
                    if ($('#pageContainer').length != 0) {
                        $faultList = $('#pageContainer')
                    } else {
                        $faultList = $('#indexMain')
                    }
                    if (_this.isMobile) {
                        _this.toggleDiagnosisInfoForMobile($(e.currentTarget).next())
                    }
                    var containerScreen = $('#faultInfoBox');
                    var $thisNextDom;

                    WebAPI.post('/diagnosis/getFaultDetails', postData).done(function(faultDetail) {
                        var faultDetailDataFina = [];
                        var faultDetailData = faultDetail.data;
                        for(var i = 0;i<$thisNextDom.length;i++){
                            var domName = $thisNextDom.eq(i).text();
                            for(var j = 0;j<faultDetailData.length;j++){
                                if(domName==faultDetailData[j].EquipmentName){
                                    faultDetailDataFina.push(faultDetailData[j]);
                                    continue;
                                }
                            }
                        }
                        _this.equipmentSecondData = faultDetailData;
                        faultInfos['faultName'] = faultName;
                        faultInfos['faultPoints'] = dataPoints;
                        faultInfos['faultDetailData'] = faultDetailDataFina;
                        faultInfos['containerScreen'] = containerScreen;
                        faultInfos['diagType'] = 'fault';
                        faultInfos['projectId'] = _this.proId;
                        faultInfos['isMobile'] = _this.isMobile;
                        new DiagnosisInfo({ isShowROI: true }).show(faultInfos, [{ type: 'fault', value: faultName }]);
                        $('#disgnosisDetailInfoModal').find('.modal-backdrop').empty().remove();
                        $('#sendOrder').off('click').click(function() {
                            var resultData = _this.diagnosisDetailInfo.faultDetailData;
                            var nowZeroValue = new Date(new Date().format('yyyy-MM-dd 00:00:00')).valueOf();
                            var desc = '',
                                zone = '',
                                equipmentName = '';
                            var wiInstance;
                            for (var i = 0; i < resultData.length; i++) {
                                var item = resultData[i].arrNoticeTime;
                                zone = data[i].SubBuildingName;
                                equipmentName = data[i].EquipmentName;
                                if (item && item.length > 0) {
                                    for (var j = 0; j < item.length; j++) {
                                        var itemValueOf = new Date(item[j].Time).valueOf();
                                        if (itemValueOf >= nowZeroValue) {
                                            desc += item[j].EquipmentName + ', ';
                                        }
                                    }
                                }
                            }
                            var back = function() {
                                wiInstance = null;
                            };
                            desc = desc.substring(0, desc.length - 2);
                            wiInstance = new WorkflowInsert({
                                zone: zone,
                                equipmentName: equipmentName,
                                noticeId: '',
                                title: _this.diagnosisDetailInfo.faultName,
                                detail: desc,
                                dueDate: new Date(+new Date() + 172800000).format('yyyy-MM-dd'), //结束时间为两天后
                                critical: 2,
                                projectId: _this.proId,
                                chartPointList: '',
                                chartQueryCircle: 'm5',
                                description: desc,
                                arrayEquipment:resultData,
                                name: _this.diagnosisDetailInfo.faultName,
                                time: new Date().format('yyyy-MM-dd HH:mm:ss'),
                                chartStartTime: new Date(new Date().getTime() - 43200000).format('yyyy-MM-dd HH:mm:ss'), //报警发生前半天12 * 60 * 60 * 1000
                                chartEndTime: new Date(new Date().getTime() + 43200000).format('yyyy-MM-dd HH:mm:ss') //报警发生后半天12 * 60 * 60 * 1000
                            });
                            wiInstance.show().submitSuccess(function(taskModelInfo, uploadFiles) {
                                //insertCallback(taskModelInfo);
                                this.close();
                                back();
                            }).cancel(function() {
                                back();
                            }).fail(function() {
                                Alert.danger($("#workflow-insert-container"), I18n.resource.workflow.main.CREATE_WORKFLOW_FAILED).showAtTop(2000);
                            });
                            return
                        });
                    })
                    var $this = $(this);
                    if ($this.hasClass('titleSecond')) {
                        $thisNextDom = $this.next('.groupSecond').find('.groupList .groupTitleText');
                        if ($this.hasClass('active')) {
                            $this.removeClass('active');
                            $this.next('.groupSecond').hide();
                        } else {
                            $('.titleSecond').removeClass('active');
                            $('.groupSecond').hide();
                            $this.addClass('active');
                            $this.next('.groupSecond').show();
                        }
                    } else {
                        $thisNextDom = $this.next('.groupThird').find('.groupList .groupTitleText');
                        if ($this.hasClass('active')) {
                            $this.removeClass('active');
                            $this.next('.groupThird').hide();
                        } else {
                            $('.titleThird').removeClass('active');
                            $('.groupThird').hide();
                            $this.addClass('active');
                            $this.next('.groupThird').show();
                        }
                    }
                });
                //添加默认展开
                if (_this.equipmentName !== undefined) {
                    //遍历所有的 groupTitle
                    $('.groupTitle').each(function() {
                        var name = $(this).find('.groupTitleText').html();
                        if (name === _this.equipmentName) {
                            $(this).addClass('selected');
                            if ($(this).next('.currentGroupBox').length > 0) {
                                $(this).next('.currentGroupBox').find('.titleSecond:first').addClass('selected');
                                $(this).next('.currentGroupBox').show();
                                $(this).next('.currentGroupBox').find('.currentGroup').show();
                                $(this).next('.currentGroupBox').find('.currentGroup:first .groupSecond:first').show();

                                if ($(this).next('.currentGroupBox').find('.currentGroup:first .groupSecond:first .faultNameInfo').length !== 0) {
                                    $(this).next('.currentGroupBox').find('.currentGroup:first .groupSecond:first .faultNameInfo').eq(0).trigger('click');
                                } else {
                                    $(this).next('.currentGroupBox').find('.titleSecond').eq(0).trigger('click');
                                    spinner.stop();
                                    spinner = null;
                                }
                            }
                        }
                    })
                } else {
                    $equipmentBox.find('.groupTitle:first').addClass('active selected');
                    if ($equipmentBox.find('.groupTitle:first').next('.currentGroupBox').length > 0) {
                        $equipmentBox.find('.currentGroupBox:first').find('.titleSecond:first').addClass('active selected');
                        $equipmentBox.find('.currentGroupBox:first').show();
                        $equipmentBox.find('.currentGroupBox:first .currentGroup').show();
                        $equipmentBox.find('.currentGroupBox:first .currentGroup:first .groupSecond:first').show();
                    } else {
                        $equipmentBox.find('.currentGroup:first').show();
                    }
                    if ($equipmentBox.find('.currentGroupBox:first').find('.currentGroup:first .groupSecond:first .faultNameInfo').length !== 0) {
                        $equipmentBox.find('.currentGroupBox:first').find('.currentGroup:first .groupSecond:first .faultNameInfo').eq(0).trigger('click');
                    } else {
                        $('#faultInfoBox #disgnosisDetailInfoModal').remove();
                        $equipmentBox.find('.currentGroupBox:first').find('.titleSecond').eq(0).trigger('click');
                        spinner.stop();
                        spinner = null;
                    }
                }


            }).always(function(){
                spinner && spinner.stop();
                spinner = null;
            })
        },
        attachEvents: function() {
            var _this = this;
            //切换导航 故障 和 设备完好率
            var count = 0;
            $(this.container).off('click.li').on('click.li', '.titleCtn>li', function() {
                    count++;
                    $(_this.container).find('.titleCtn>li').removeClass();
                    $(this).addClass('active');
                    var index = $(this).data('index');
                    $(_this.container).find('.detailsCtn>div').hide();
                    $(_this.container).find('.detailsCtn>div').eq(index).show();
                    // $('#faultInfoBox #disgnosisDetailInfoModal').remove();
                    if (_this.type === undefined) {
                        _this.equipmentName = undefined;
                    } else {
                        if (count > 1) {
                            _this.equipmentName = undefined;
                        }
                    }
                    $(_this.container).find('.conCtn').html('');
                    if (index === 0) {
                        _this.renderFault();
                    } else if (index === 1) {
                        _this.renderEquipment();
                    }
                })
                //点击单行
            $(this.container).off('click.single').on('click.single', '.faultsDetail .level', function() {
                    $('.level.active').removeClass('active');
                    var $parent = $(this).addClass('active').closest('.levelCtn');
                    var $this = $(this);
                    var a = $parent.attr('class').substr(15);
                    var level = Number(a.substring(0, a.length - 4)) + 1;
                    if ($parent.find('.levelBox').length !== 0 && $parent.find('.levelBox').html() !== '') {
                        $parent.find('.levelBox').remove();
                    } else {
                        $(_this.container).find('.level-' + level + '-ctn').html('');

                        if ($parent.find('.levelCtn').length === 0) {
                            if($parent.find('.levelBox').length!=0){
                                $parent.find('.levelBox').empty().remove();
                            }
                            $parent.append($('<div class="levelBox" style="width:100%;"></div>'));
                        } else {
                            $parent.find('.levelCtn').remove();
                        }
                        var val = $this.find('div').eq(0).html();
                        var type, zone, faultName = $(this).closest('.level-1-ctn').find('.rankName').text();
                        var faultInfos = {},
                            arrOpt = [];
                        if ($this.hasClass('level-3')) {
                            zone = $parent.closest('.level-2-ctn').children('.level-2').find('div:eq(0)').text();
                            arrOpt = [{ type: 'fault', value: faultName }, { type: 'zone', value: zone }, { type: 'equipment', value: val }];
                            _this.showInfo(val, 3, arrOpt);
                        } else {
                            if ($this.hasClass('level-1')) {
                                type = 'fault';
                                arrOpt = [{ type: 'fault', value: faultName }];
                            } else if ($this.hasClass('level-2')) {
                                type = 'zone';
                                arrOpt = [{ type: 'fault', value: faultName }, { type: 'zone', value: val }];
                            }

                            //开始时间为当月的第一天,结束时间为当前时间,精确到5分钟
                            var startTime = new Date();
                            var endTime = new Date();
                            startTime.setDate(1);
                            endTime.setMinutes(endTime.getMinutes() - endTime.getMinutes() % 5);
                            var options = {
                                "value": val,
                                "type": type,
                                "startTime": startTime.format('yyyy-MM-dd 00:00:00'),
                                "endTime": endTime.format('yyyy-MM-dd HH:mm:00'),
                                "projId": _this.proId
                            }
                            WebAPI.post('/diagnosis/getFaultDetails', options).done(function(result) {
                                var nameArr = [];
                                var dataCount = [];
                                var flag, nameFlag, allFlag;
                                if ($this.hasClass('level-1')) {
                                    var dataArr = result.data;
                                    _this.firstSevelData = dataArr;
                                    var padLeft = 35;
                                    _this.faultName = val;
                                    _this.details = dataArr;
                                    _this.showInfo(val, 1, arrOpt);
                                } else if ($this.hasClass('level-2')) {
                                    if (result.data.length !== 0) {
                                        var dataArr = result.data[0].arrNoticeTime;
                                        var padLeft = 45;
                                    }
                                    _this.showInfo(val, 2, arrOpt);
                                }
                                for (var i = 0, length = dataArr.length; i < length; i++) {
                                    if ($this.hasClass('level-1')) {
                                        var name = dataArr[i].SubBuildingName;
                                        var sumEnergyAll = 0;
                                        for(var j = 0;j<dataArr.length;j++){
                                            var items = dataArr[j];
                                            if(items.SubBuildingName == name){
                                                sumEnergyAll += parseFloat(items.sumEnergy);
                                            }
                                        }
                                        var count = dataArr[i].arrNoticeTime.length;
                                        var sumEnergy = sumEnergyAll?sumEnergyAll.toFixed(2):'';
                                        nameFlag = nameArr.indexOf(name) === -1;
                                        flag = nameFlag;
                                        allFlag = nameFlag;
                                    } else if ($this.hasClass('level-2')) {
                                        var name = dataArr[i].EquipmentName;
                                        var count = 1;
                                        var sumEnergy = '';
                                        for(var j = 0;j<_this.firstSevelData.length;j++){
                                            var item = _this.firstSevelData[j];
                                            if(name==item.EquipmentName){
                                                sumEnergy = item.sumEnergy?item.sumEnergy.toFixed(2):'';
                                                break;
                                            }
                                        }
                                        nameFlag = nameArr.indexOf(name) === -1;
                                        flag = dataArr[i].FaultName === _this.faultName;
                                        allFlag = nameFlag && flag;
                                    }
                                    if (allFlag) {
                                        var point = dataArr[i].Points ? dataArr[i].Points : "";
                                        var obj = {
                                            name: name,
                                            count: 1,
                                            point: point,
                                            sumEnergy:sumEnergy
                                        }
                                        dataCount.push(obj);
                                        nameArr.push(name);
                                    } else {
                                        for (var j = 0, jLength = dataCount.length; j < jLength; j++) {
                                            if (dataCount[j].name === name) {
                                                dataCount[j].count += 1;
                                                break;
                                            }
                                        }
                                    }
                                }
                                $parent.find('.levelBox').html('');
                                for (var h = 0, hLength = dataCount.length; h < hLength; h++) {
                                    var count = dataCount[h].count;
                                    if (level === 3) {
                                        count = 1;
                                    }
                                    if (_this.hasEnergy) {
                                        var singleName = '<div class="levelCtn level-' + level + '-ctn">\
                                                    <div class="level level-' + level + '">\
                                                        <div style="width:60%;padding-left:' + padLeft + 'px;" class="paddingSame name" data-points="' + dataCount[h].point + '">' + dataCount[h].name + '</div>\
                                                        <div style="width:20%;text-align:center;" class="paddingSame">' + count + '</div>\
                                                        <div style="width:20%;text-align:center;" class="paddingSame">'+dataCount[h].sumEnergy+'</div>\
                                                    </div>\
                                                </div>';
                                    } else {
                                        var singleName = '<div class="levelCtn level-' + level + '-ctn">\
                                                    <div class="level level-' + level + '">\
                                                        <div style="width:70%;padding-left:' + padLeft + 'px;" class="paddingSame name" data-points="' + dataCount[h].point + '">' + dataCount[h].name + '</div>\
                                                        <div style="width:30%;text-align:center;" class="paddingSame">' + count + '</div>\
                                                    </div>\
                                                </div>';
                                    }
                                    $parent.find('.levelBox').append($(singleName));
                                }
                            })
                        }
                    }
                })
            //查看历史
            $(this.container).off('click.showHistory').on('click.showHistory', '#btnShowHist', function () {
                Spinner.spin($(_this.container).find('.detailsCtn')[0]);
                WebAPI.get('/diagnosis/getStruct/' + _this.proId).done(function (data) {
                    var item, arr;
                    _this.dictZone = new Object();
                    _this.dictEquipment = new Object();
                    _this.buildings = [];

                    arr = data.equipments;
                    for (var i = 0, len = arr.length; i < len; i++) {
                        item = arr[i];
                        item.faultIds = new Array();
                        _this.dictEquipment[item.id] = item;
                    }

                    arr = data.zones;
                    _this.floorCount = arr.length;
                    var index = -1,
                        tempBuildingId = undefined;


                    for (var i = 0, len = arr.length; i < len; i++) {
                        item = arr[i];
                        //item.equipmentIds = new Array();
                        var equipments = [];

                        for (var j = 0; j < data.equipments.length; j++) {
                            if (data.equipments[j].zoneId == item.id) {
                                //item.equipmentIds.push(data.equipments[j].id);
                                equipments.push({
                                    equipmentId: data.equipments[j].id,
                                    equipmentName: data.equipments[j].name
                                })
                            }
                        }
                        _this.dictZone[item.id] = item;

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
                            _this.buildings.push(building)
                        } else {
                            var subBuilding = {
                                subBuildId: item.subBuildingId,
                                subBuildName: item.subBuildingName,
                                equipments: equipments
                            };
                            _this.buildings[index].subBuilds.push(subBuilding);
                        }
                    }
                    _this.optionCss = {
                        color: '#333'
                    };
                    new DiagnosisLogHistory(_this).show();
                });
            });
            //配置
            $(this.container).off('click.showConfig').on('click.showConfig', '#btnConfig', function () {
                WebAPI.get('/diagnosis/getStruct/' + AppConfig.projectId).done(function (result) {
                    var data = {
                        buildings: []
                    };
                    var arr = result.zones;
                    var index = -1,
                        tempBuildingId = undefined;
                    for (var i = 0, len = arr.length; i < len; i++) {
                        item = arr[i];
                        var equipments = [];

                        for (var j = 0; j < result.equipments.length; j++) {
                            if (result.equipments[j].zoneId == item.id) {
                                equipments.push({equipmentId: result.equipments[j].id, equipmentName: result.equipments[j].name})
                            }
                        }
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
                            data.buildings.push(building)
                        } else {
                            var subBuilding = {
                                subBuildId: item.subBuildingId,
                                subBuildName: item.subBuildingName,
                                equipments: equipments
                            };
                            data.buildings[index].subBuilds.push(subBuilding);
                        }
                    }
                    var diagnosisConfig = new DiagnosisConfig(data);
                    diagnosisConfig.show();
                });
                
            });
            //排序
            $(this.container).off('click.sort').on('click.sort', '.faultTitle .sort', function () {
                if ($(this).hasClass('active')) {
                    return;
                }
                $('.paddingSame.active').removeClass('active');
                $(this).addClass('active');
                var className, arr = [];
                if ($(this).hasClass('countSum')) {
                    className = '.rankCount';
                } else if ($(this).hasClass('energySum')) {
                    className = '.rankEnergy';
                }
                $(className).each(function() {
                        var $parent = $(this).closest('.level');
                        if ($parent.find('div').length === 3) {
                            var obj = {
                                name: $parent.find('div').eq(0).html(),
                                count: $parent.find('div').eq(1).html(),
                                energy: $parent.find('div').eq(2).html()
                            }
                        } else {
                            var obj = {
                                name: $parent.find('div').eq(0).html(),
                                count: $parent.find('div').eq(1).html()
                            }
                        }
                        arr.push(obj);
                    })
                    //排序
                arr.sort(maxToMin);

                function maxToMin(a, b) {
                    if (className === '.rankCount') {
                        return b.count - a.count;
                    } else {
                        return b.energy - a.energy;
                    }
                }
                //重新布局
                $(_this.container).find('.faultsDetail').html('');
                for (var i = 0, length = arr.length; i < length; i++) {
                    if (arr[i].energy !== undefined) {
                        var singleRank = '<div class="levelCtn level-1-ctn">\
                                        <div class="level level-1">\
                                            <div class="paddingSame rankName" style="width:60%;padding-left:25px;">' + arr[i].name + '</div>\
                                            <div class="paddingSame rankCount" style="width:20%;text-align:center;">' + arr[i].count + '</div>\
                                            <div class="paddingSame rankEnergy" style="width:20%;text-align:center;">' + arr[i].energy + '</div>\
                                        </div>\
                                     </div>';
                        $(_this.container).find('.faultsDetail').append($(singleRank));
                    } else {
                        var singleRank = '<div class="levelCtn level-1-ctn">\
                                        <div class="level level-1">\
                                            <div class="paddingSame rankName" style="width:70%;padding-left:25px;">' + arr[i].name + '</div>\
                                            <div class="paddingSame rankCount" style="width:30%;text-align:center;">' + arr[i].count + '</div>\
                                        </div>\
                                     </div>';
                        $(_this.container).find('.faultsDetail').append($(singleRank));
                    }
                }
            })
        },
        showInfo: function(val, grade, opt) {
            var faultInfos = {};
            if (grade === 1) {
                var data = _this.details;
            } else {
                var data = [];
                for (var i = 0, length = _this.details.length; i < length; i++) {
                    var name;
                    if (grade === 2) {
                        name = _this.details[i].SubBuildingName;
                    } else if (grade === 3) {
                        name = _this.details[i].EquipmentName;
                    }
                    if (val === name && _this.faultName === _this.details[i].FaultName) {
                        data.push(_this.details[i]);
                    }
                }
            }
            //故障末级点击也可以直接显示送工单
            if (grade == 3) {
                var nowZeroValue = new Date(new Date().format('yyyy-MM-dd 00:00:00')).valueOf();
                var desc = '',
                    zone = '',
                    equipmentName = '',
                    description = '',
                    startTime = '',
                    lastTime = '',
                    monent = '';
                var descArr = [], errorTime = [];
                var wiInstance;

                function unique(arr) {
                    var result = [],
                        hash = {};
                    for (var i = 0, elem;
                        (elem = arr[i]) != null; i++) {
                        if (!hash[elem]) {
                            result.push(elem);
                            hash[elem] = true;
                        }
                    }
                    return result;
                }
                for (var i = 0; i < data.length; i++) {
                    var item = data[i].arrNoticeTime;
                    zone = data[i].SubBuildingName;
                    equipmentName = data[i].EquipmentName;
                    description = data[i].Description;
                    errorTime = [];
                    if (item && item.length > 0) {
                        for (var j = 0; j < item.length; j++) {
                            var itemValueOf = new Date(item[j].Time).valueOf();
                            descArr.push(data[i].EquipmentName);
/*                            startTime = item[j].Time ? item[j].Time : '-';
                            endTime = item[j].EndTime ? item[j].EndTime : '-';
                            errorTime.push(startTime + ' ~ ' + endTime);*/
                        }
                    }
                }
                var back = function() {
                    wiInstance = null;
                };
                var pointList = $('.active > .name').attr('data-points');
                descArr = unique(descArr);
                desc = descArr.join();
                monent = data[0].arrNoticeTime[0].Time;
                //desc = desc.substring(0, desc.length - 2);
                wiInstance = new WorkflowInsert({
                    zone: zone,
                    equipmentName: equipmentName,
                    noticeId: '',
                    title: _this.faultName,
                    detail: desc,
                    dueDate: new Date(+new Date() + 172800000).format('yyyy-MM-dd'), //结束时间为两天后
                    critical: 2,
                    projectId: AppConfig.projectId,
                    chartPointList: pointList,
                    chartQueryCircle: 'm5',
                    description: equipmentName + ' ' + zone + ':' + description,
                    name: _this.faultName + '(' + desc + ')',
                    arrayEquipment: data,
                    time: new Date().format('yyyy-MM-dd HH:mm:ss'),
                    chartStartTime:new Date(new Date(monent).getTime() - 3 * 60 * 60 * 1000).format('yyyy-MM-dd HH:mm:ss'), //报警发生前三个小时3 * 60 * 60 * 1000
                    chartEndTime: new Date(new Date(monent).getTime() + 3 * 60 * 60 * 1000).format('yyyy-MM-dd HH:mm:ss') //报警发生后三个小时3 * 60 * 60 * 1000
                });
                wiInstance.show().submitSuccess(function(taskModelInfo, uploadFiles) {
                    //insertCallback(taskModelInfo);
                    this.close();
                    back();
                }).cancel(function() {
                    back();
                }).fail(function() {
                    Alert.danger($("#workflow-insert-container"), I18n.resource.workflow.main.CREATE_WORKFLOW_FAILED).showAtTop(2000);
                });
            }
            faultInfos['faultName'] = _this.faultName;
            faultInfos['faultDetailData'] = data;
            faultInfos['containerScreen'] = $('#faultInfoBox');
            faultInfos['diagType'] = 'fault';
            faultInfos['projectId'] = _this.proId;
            faultInfos['isMobile'] = _this.isMobile;
            new DiagnosisInfo({ isShowROI: true }).show(faultInfos, opt);
        },

        toggleDiagnosisInfoForMobile: function($dom) {
            var $container = $('#faultInfoBox')
            if ($container.length == 0) {
                $container = $('<div id="faultInfoBox"><div class="emptyContent" i18n="equipmentHealth.CURRENTLY_NO_FAULT_DETECTED">本项目目前没有诊断出任何问题，请继续保持</div></div>')
            }
            $container.hide()
            $('#disgnosisDetailInfoModal').find('.diagnosisTable tbody').html('');
            $container.appendTo($dom);
        }
    }
    return DiagnosisNav;
})()