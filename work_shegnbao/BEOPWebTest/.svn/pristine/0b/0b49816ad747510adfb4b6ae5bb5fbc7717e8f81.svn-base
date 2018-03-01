(function (beop) {
    var i18n_point = I18n.resource.debugTools.sitePoint, i18n_info = I18n.resource.debugTools.info;
    var configMap = {
            htmlURL: '/static/app/CxTool/views/standardPointNameSet.html',
            settable_map: {}
        },
        stateMap = {
            sheetSystemName: [
                {
                    "id": "xxxx01",
                    "en": "Ch",
                    "zh": "冷机"
                },
                {
                    "id": "xxxx02",
                    "en": "PCHWP",
                    "zh": "一次冷冻水泵"
                },
                {
                    "id": "xxxx03",
                    "en": "SCHWP",
                    "zh": "二次冷冻水泵"
                },
                {
                    "id": "xxxx04",
                    "en": "CWP",
                    "zh": "冷却泵"
                },
                {
                    "id": "xxxx05",
                    "en": "CT",
                    "zh": "冷却塔"
                },
                {
                    "id": "xxxx06",
                    "en": "GWP",
                    "zh": "溶液泵"
                },
                {
                    "id": "xxxx07",
                    "en": "MKP",
                    "zh": "补水泵"
                },
                {
                    "id": "xxxx08",
                    "en": "HX",
                    "zh": "板换"
                },
                {
                    "id": "xxxx09",
                    "en": "ChCHWV",
                    "zh": "冷机冷冻阀门"
                },
                {
                    "id": "xxxx10",
                    "en": "ChCWV",
                    "zh": "冷机冷却阀门"
                },
                {
                    "id": "xxxx11",
                    "en": "ICE",
                    "zh": "冰槽系统"
                },
                {
                    "id": "xxxx12",
                    "en": "IceTank",
                    "zh": "冰槽"
                },
                {
                    "id": "xxxx13",
                    "en": "SCHW",
                    "zh": "二次冷冻水"
                },
                {
                    "id": "xxxx14",
                    "en": "PCHW",
                    "zh": "一次冷冻水"
                },
                {
                    "id": "xxxx15",
                    "en": "CHW",
                    "zh": "冷冻水"
                },
                {
                    "id": "xxxx16",
                    "en": "CW",
                    "zh": "冷却水"
                },
                {
                    "id": "xxxx17",
                    "en": "HW",
                    "zh": "热水"
                }/*,
                 {
                 "id": "xxxx18",
                 "en": "CHWVlve",
                 "zh": "冷冻水阀门"
                 },
                 {
                 "id": "xxxx19",
                 "en": "CWVlve",
                 "zh": "冷却水阀门"
                 },
                 {
                 "id": "xxxx20",
                 "en": "GylVlve",
                 "zh": "溶液系统阀门"
                 },
                 {
                 "id": "xxxx21",
                 "en": "AHU",
                 "zh": "空调箱"
                 },
                 {
                 "id": "xxxx22",
                 "en": "PAU",
                 "zh": "新风箱"
                 },
                 {
                 "id": "xxxx23",
                 "en": "SAFan",
                 "zh": "送风机"
                 },
                 {
                 "id": "xxxx24",
                 "en": "EAFan",
                 "zh": "排风机"
                 },
                 {
                 "id": "xxxx25",
                 "en": "RAFan",
                 "zh": "回风机"
                 },
                 {
                 "id": "xxxx26",
                 "en": "Boiler",
                 "zh": "锅炉"
                 },
                 {
                 "id": "xxxx27",
                 "en": "Filter",
                 "zh": "过滤器"
                 },
                 {
                 "id": "xxxx28",
                 "en": "ChemTreatTk",
                 "zh": "化学处理缸"
                 },
                 {
                 "id": "xxxx29",
                 "en": "FCS",
                 "zh": "消防系统"
                 },
                 {
                 "id": "xxxx30",
                 "en": "DailyOILTk",
                 "zh": "锅炉日用油箱"
                 },
                 {
                 "id": "xxxx31",
                 "en": "HWP",
                 "zh": "热水泵"
                 },
                 {
                 "id": "xxxx32",
                 "en": "DemWaterTk",
                 "zh": "软化水箱"
                 },
                 {
                 "id": "xxxx33",
                 "en": "ACS",
                 "zh": "安防门禁"
                 },
                 {
                 "id": "xxxx34",
                 "en": "CtrlPanel",
                 "zh": "控制面板"
                 }*/
            ],
            sheetPointName: [
                {
                    id: "cccc001",
                    name: '模式',
                    child: [
                        {
                            id: "yyyy001",
                            zh: '季节模式',
                            en: 'SeasonMode'
                        },
                        {
                            id: "yyyy002",
                            zh: '制冷制热模式',
                            en: 'CoolingorHeatingMode'
                        }
                    ]
                }, {
                    id: "cccc002",
                    name: '冷机',
                    child: [
                        {
                            id: "yyyy003",
                            zh: '冷机电流百分比限定值反馈',
                            en: 'ChAmpLmtSetPointFeedback'
                        },
                        {
                            id: "yyyy004",
                            zh: '冷机电流百分比',
                            en: 'ChAMPS'
                        },
                        {
                            id: "yyyy005",
                            zh: '冷机冷水温度设定',
                            en: 'ChChWTempSupplySetPoint'
                        },
                        {
                            id: "yyyy033",
                            zh: '冷机冷水温度实际设定反馈',
                            en: 'ChChWTempSupplyActiveSetPoint'
                        },
                        {
                            id: "yyyy034",
                            zh: '冷机蒸发器出水温度',
                            en: 'ChLeaveEvapTemp'
                        },
                        {
                            id: "yyyy035",
                            zh: '冷机蒸发器进水温度',
                            en: 'ChEnterEvapTemp'
                        }
                    ]
                }, {
                    id: "cccc003",
                    name: '水泵',
                    child: [
                        {
                            id: "yyyy006",
                            zh: '冷机电流百分比限定值反馈',
                            en: 'PumpRemoteMode'
                        },
                        {
                            id: "yyyy007",
                            zh: '水泵手自动模式',
                            en: 'PumpAutoMode'
                        },
                        {
                            id: "yyyy008",
                            zh: '水泵运行时间',
                            en: 'PumpRunHour'
                        },

                        {
                            id: "yyyy009",
                            zh: '水泵运行',
                            en: 'PumpOnOff'
                        },
                        {
                            id: "yyyy010",
                            zh: '水泵使能',
                            en: 'PumpEnable'
                        },
                        {
                            id: "yyyy011",
                            zh: '水泵报警',
                            en: 'PumpErr'
                        },
                        {
                            id: "yyyy012",
                            zh: '水泵启停',
                            en: 'PumpOnOffSet'
                        },
                        {
                            id: "yyyy013",
                            zh: '水泵频率',
                            en: 'PumpVSDFreq'
                        }
                    ]
                }
            ],
            sheetPointNameSystemList: []
        },
        jqueryMap = {},
        setJqueryMap,
        configModel,
        init,
        refreshSettingSystemName, refreshSettingPointName, refreshSystemNameSelect,
        isHasChecked, getNameId, delSystemId, delPointId, getSheetPointNameParentList, getZhAndEnlist, getRandom,
        onEditSystemName, onSaveSystemName,
        onAddSystemNameWin, onDeleteSystemNameWin, onDeleteSystemNameItems, onAddSystemNameItems,
        onAddPointNameWin, onDeletePointNameWin, onSavePointName, onEditPointName, onChangeSystemName, onChangeTabName,
        onAddPointParamConfirm, onAddPointSystemConfirm, onAddNameInput, onDeletePointNameItems;
    setJqueryMap = function () {
        var $container = stateMap.$container;
        jqueryMap = {
            $container: $container,
            $system_name_tbody: $("#systemNameSheetTbody"),
            $point_name_tbody: $("#pointNameSheetTbody"),
            $system_name_add: $("#system_name_add"),
            $system_name_edit: $("#system_name_edit"),
            $system_name_delete: $("#system_name_delete"),
            $system_name_save: $("#system_name_save"),
            $isDelSystemNameWin: $("#isDelSystemNameWin"),
            $addSystemNameWin: $("#addSystemNameWin"),
            $deleteSystemConfirm: $("#deleteSystemConfirm"),
            $addSystemConfirm: $("#addSystemConfirm"),
            $systemNameInput: $("#systemNameInput"),
            $systemStandardNameInput: $("#systemStandardNameInput"),
            $standard_name_add: $("#standard_name_add"),
            $standard_name_edit: $("#standard_name_edit"),
            $standard_name_delete: $("#standard_name_delete"),
            $standard_name_save: $("#standard_name_save"),
            $addPointNameWin: $("#addPointNameWin"),
            $systemNameSelect: $("#systemNameSelect"),
            $paramNameInputWrapper: $("#paramNameInputWrapper"),
            $paramSystemNameInputWrapper: $("#paramSystemNameInputWrapper"),
            $addStandardNameTab: $("#addStandardNameTab"),
            $addPointNameWrapper: $("#addPointNameWrapper"),
            $addSystemNameWrapper: $("#addSystemNameWrapper"),
            $pointNameContentWrapper: $("#pointNameContentWrapper"),
            $addPointParamConfirmBtn: $("#addPointParamConfirmBtn"),
            $addPointSystemConfirmBtn: $("#addPointSystemConfirmBtn"),
            $addSystemParamNameInput: $("#addSystemParamNameInput"),
            $paramAddInput: $("#paramAddInput"),
            $systemAddInput: $("#systemAddInput"),
            $isDelStandardNameWin: $("#isDelStandardNameWin"),
            $pointNameSheetTbody: $("#pointNameSheetTbody"),
            $deleteStandardConfirm: $("#deleteStandardConfirm")
        };
    };

    configModel = function (input_map) {
        beop.util.setConfigMap({
            input_map: input_map,
            settable_map: configMap.settable_map,
            config_map: configMap
        });
        return true;
    };

    init = function ($container) {
        stateMap.$container = $container;
        $.when($.get(configMap.htmlURL)).done(function (resultHtml) {
            stateMap.$container.html(resultHtml);
            I18n.fillArea(stateMap.$container);
            setJqueryMap();
            jqueryMap.$system_name_add.off().on('click', onAddSystemNameWin);
            jqueryMap.$system_name_delete.off().on('click', onDeleteSystemNameWin);
            jqueryMap.$system_name_save.off().on('click', onSaveSystemName);
            jqueryMap.$system_name_edit.off().on('click', onEditSystemName);
            jqueryMap.$deleteSystemConfirm.off().on('click', onDeleteSystemNameItems);
            jqueryMap.$addSystemConfirm.off().on('click', onAddSystemNameItems);
            jqueryMap.$standard_name_add.off().on('click', onAddPointNameWin);
            jqueryMap.$standard_name_delete.off().on('click', onDeletePointNameWin);
            jqueryMap.$standard_name_save.off().on('click', onSavePointName);
            jqueryMap.$standard_name_edit.off().on('click', onEditPointName);
            jqueryMap.$systemNameSelect.off().on('change', onChangeSystemName);
            jqueryMap.$addStandardNameTab.off().on('click', 'li', onChangeTabName);
            jqueryMap.$addPointParamConfirmBtn.off().on('click', onAddPointParamConfirm);
            jqueryMap.$addPointSystemConfirmBtn.off().on('click', onAddPointSystemConfirm);
            jqueryMap.$paramAddInput.off().on('click', onAddNameInput);
            jqueryMap.$systemAddInput.off().on('click', onAddNameInput);
            jqueryMap.$deleteStandardConfirm.off().on('click', onDeletePointNameItems);

            $('#standardNameTab a[href="#systemNameWrapper"]').tab('show');
            refreshSettingSystemName();
            refreshSettingPointName();
            getSheetPointNameParentList();

        });
    };


    //---------方法---------
    isHasChecked = function ($box) { // 判断是否有选中的复选框 有选中返回true,无选中返回false
        var flag = 0;
        $box.find("input[type=checkbox]").each(function (index, item) {
            if ($(item).is(':checked')) {
                flag = 1;
                return false;
            }
        });
        if (flag) {
            return true;
        } else {
            return false;
        }
    };

    getNameId = function ($box) { // 得到选中的复选框对象的id
        var idList = [];
        $box.find("input[type=checkbox]").each(function (index, item) {
            var $item = $(item);
            if ($item.is(':checked')) {
                idList.push($item.attr("itemId"));
            }
        });
        return idList;
    };

    getRandom = function () { // 得到一个随机字符串
        return "xyz" + Math.random() * 900000
    };

    delSystemId = function (targetList, delList) { // 从第一个对象中删除包含在第二个数组对象中id , 并返回删除后的对象  ---标准系统名删除
        for (var i = 0; i < targetList.length; i++) {
            var target = targetList[i];
            for (var j = 0; j < delList.length; j++) {
                if (target.id == delList[j]) {
                    targetList.splice(i, 1);
                    i--;
                }
            }
        }
    };

    delPointId = function (targetList, delList) { // 从第一个对象中删除包含在第二个数组对象中id , 并返回删除后的对象  ---标准点名删除
        for (var i = 0; i < targetList.length; i++) {
            var target = targetList[i];
            for (var k = 0; k < target.child.length; k++) {
                var child = target.child[k];
                for (var j = 0; j < delList.length; j++) {
                    if (child.id == delList[j]) {
                        target.child.splice(k, 1);
                        k--;
                    }
                }
            }
            if (!target.child.length) { // 如果没有子元素，则将父元素删除
                targetList.splice(i, 1);
                i--;
            }
        }
    };

    getSheetPointNameParentList = function () {// 得到标准点名-系统名的数组
        stateMap.sheetPointNameSystemList = [];
        for (var i = 0; i < stateMap.sheetPointName.length; i++) {
            var item = stateMap.sheetPointName[i];
            var obj = {};
            obj.name = item.name;
            obj.id = item.id;
            stateMap.sheetPointNameSystemList.push(obj);
        }
    };

    getZhAndEnlist = function ($Wrapper) {// 得到参数名和标准点名列表
        var nameZhList = [];
        var nameEnList = [];
        var $input_params = $Wrapper.find(".addParamName");
        var $input_standards = $Wrapper.find(".addStandardName");
        for (var i = 0; i < $input_params.length; i++) {
            var $input_paramVal = $.trim($input_params.eq(i).val());
            var $input_standardVal = $.trim($input_standards.eq(i).val());
            if ($input_paramVal != "" && $input_standardVal != "") {
                nameZhList.push($input_paramVal);
                nameEnList.push($input_standardVal);
            } else if ($input_paramVal != "" && $input_standardVal == "") {
                i18n_point
                alert(i18n_point.ADD_NAME_INFO1);
                return false;
            } else if ($input_paramVal == "" && $input_standardVal != "") {
                alert(i18n_point.ADD_NAME_INFO1);
                return false;
            }
        }
        return {
            'nameZhList': nameZhList,
            'nameEnList': nameEnList
        }
    };

    refreshSystemNameSelect = function () {// 刷新标准选择系统名下拉框
        var list = stateMap.sheetPointNameSystemList;
        var optionHtml = "";
        for (var i = 0; i < list.length; i++) {
            var item = list[i];
            optionHtml += '<option value="' + item.id + '">' + item.name + '</option>';
        }
        jqueryMap.$systemNameSelect.empty().html(optionHtml);
    };

    refreshSettingSystemName = function () {// 用标准系统名数据刷新标准系统名表
        jqueryMap.$system_name_tbody.empty().append(beopTmpl('tpl_system_name_list', {systemNameList: stateMap.sheetSystemName}));
    };

    refreshSettingPointName = function () {// 用标准点名数据刷新标准系统名表
        jqueryMap.$point_name_tbody.empty().append(beopTmpl('tpl_point_name_list', {pointNameList: stateMap.sheetPointName}));
    };

    //---------事件---------
    onEditSystemName = function () {// 修改标准系统名表内容
        var $nameEdit = jqueryMap.$system_name_tbody.find(".nameEdit");
        $nameEdit.addClass("editOk").attr("contenteditable", true);
        $nameEdit.eq(0).focus();
    };

    onSaveSystemName = function () {// 保存修改的标准系统名表内容
        // 重新生成stateMap.sheetSystemName 数据
        stateMap.sheetSystemName = [];
        var $trs = jqueryMap.$system_name_tbody.find("tr");
        for (var i = 0; i < $trs.length; i++) {
            var $tr = $trs.eq(i);
            var item = {};
            item.id = $tr.attr("pointId");
            item.en = $tr.find(".systemNameEn").text();
            item.zh = $tr.find(".systemNameZh").text();
            stateMap.sheetSystemName.push(item);
        }
        jqueryMap.$system_name_tbody.find(".nameEdit").removeClass("editOk").attr("contenteditable", false);
        alert(I18n.resource.common.SAVE_SUCCESS);
    };

    onAddSystemNameWin = function () {
        jqueryMap.$addSystemNameWin.modal();
        jqueryMap.$systemNameInput.val("");
        jqueryMap.$systemStandardNameInput.val("");
    };

    onDeleteSystemNameWin = function () {
        if (isHasChecked(jqueryMap.$system_name_tbody)) {
            jqueryMap.$isDelSystemNameWin.modal();
        } else {
            alert(i18n_info.CHOOSE_DELETE_POINTS);
            return false;
        }
    };

    onAddSystemNameItems = function () {// 添加系统名
        if (jqueryMap.$systemNameInput.val() == "") {
            alert(i18n_point.ENTER_EQUIPMENT_NAME);
            return false;
        }
        if (jqueryMap.$systemStandardNameInput.val() == "") {
            alert(i18n_point.ENTER_STANDARD_NAME);
            return false;
        }
        //生成一个随机id对象
        var createObj = {};
        createObj.id = getRandom();
        createObj.en = jqueryMap.$systemNameInput.val();
        createObj.zh = jqueryMap.$systemStandardNameInput.val();

        stateMap.sheetSystemName.push(createObj);
        refreshSettingSystemName();
    };

    onDeleteSystemNameItems = function () {// 删除选中的系统名
        var idList = getNameId(jqueryMap.$system_name_tbody);
        delSystemId(stateMap.sheetSystemName, idList);
        refreshSettingSystemName();
        jqueryMap.$isDelSystemNameWin.modal("hide");
    };

    onEditPointName = function () {// 编辑标准点名中的文字
        var $nameEdit = jqueryMap.$point_name_tbody.find(".nameEdit");
        $nameEdit.addClass("editOk").attr("contenteditable", true);
        $nameEdit.eq(0).focus();
    };

    onSavePointName = function () {// 保存标准点名中修改的数据
        // 重新生成stateMap.sheetPointName 数据
        stateMap.sheetPointName = [];
        var $trs = jqueryMap.$point_name_tbody.find("tr");
        var trNo = 0;
        var $systemTds = jqueryMap.$point_name_tbody.find("td[rowspan]"); // 系统个数
        for (var i = 0; i < $systemTds.length; i++) {
            var $systemTd = $systemTds.eq(i);
            var parent = {};
            var rowpanLen = parseInt($systemTd.attr("rowspan"));
            parent.id = stateMap.sheetPointNameSystemList[i].id;
            parent.name = $systemTd.text();
            parent.child = [];
            for (var j = 0; j < rowpanLen; j++) {
                var child = {};
                var index = j + trNo;
                child.id = $trs.find("input[type='checkbox']").eq(index).attr("itemid");
                child.zh = $trs.find(".systemNameZh").eq(index).text();
                child.en = $trs.find(".systemNameEn").eq(index).text();
                parent.child.push(child);
            }
            trNo += rowpanLen;
            stateMap.sheetPointName.push(parent);
        }
        jqueryMap.$point_name_tbody.find(".nameEdit").removeClass("editOk").attr("contenteditable", false);
        alert(I18n.resource.common.SAVE_SUCCESS);
    };

    onAddPointNameWin = function () {// 点击添加，弹出添加系统或参数弹出窗口
        $('#addPointNameWin a[href="#addPointNameWrapper"]').tab('show');
        jqueryMap.$addPointNameWrapper.show();
        jqueryMap.$addSystemNameWrapper.hide();
        jqueryMap.$pointNameContentWrapper.find("input[type='text']").val("");
        jqueryMap.$addPointNameWin.modal();
        jqueryMap.$paramNameInputWrapper.html(beopTmpl('tpl_add_name_inputs'));
        jqueryMap.$paramSystemNameInputWrapper.html(beopTmpl('tpl_add_name_inputs'));
        getSheetPointNameParentList();
        refreshSystemNameSelect();
    };

    onDeletePointNameWin = function () {// 删除标准点名选中的标准点名
        if (isHasChecked(jqueryMap.$pointNameSheetTbody)) {
            jqueryMap.$isDelStandardNameWin.modal();
        } else {
            alert(i18n_info.CHOOSE_DELETE_POINTS);
            return false;
        }
    };

    onDeletePointNameItems = function () {// 删除选中的参数名
        var idList = getNameId(jqueryMap.$point_name_tbody);
        delPointId(stateMap.sheetPointName, idList);
        refreshSettingPointName();
        jqueryMap.$isDelStandardNameWin.modal("hide");
    };

    onChangeSystemName = function () {// 切换系统名下拉框，请空下面的参数值
        jqueryMap.$paramNameInputWrapper.find("input[type='text']").val("");
    };

    onChangeTabName = function () {// 切换标准点名添加弹出窗口tab
        if ($(this).attr("targetObj") == "addPointNameWrapper") {
            jqueryMap.$addPointNameWrapper.show();
            jqueryMap.$addSystemNameWrapper.hide();
        } else {
            jqueryMap.$addPointNameWrapper.hide();
            jqueryMap.$addSystemNameWrapper.show();
        }
    };

    onAddPointParamConfirm = function () {// 标准点名添加参数名
        var $wrapper = jqueryMap.$paramNameInputWrapper;
        var list = getZhAndEnlist($wrapper);
        if (list) {
            if (list.nameZhList.length) {
                var $input_params = $wrapper.find(".addParamName");
                var $input_standards = $wrapper.find(".addStandardName");
                var systemId = jqueryMap.$systemNameSelect.find("option:selected").val();
                for (var i = 0; i < stateMap.sheetPointName.length; i++) {
                    var item = stateMap.sheetPointName[i];
                    if (systemId == item.id) {
                        for (var j = 0; j < list.nameZhList.length; j++) {
                            var obj = {};
                            obj.id = getRandom();
                            obj.zh = list.nameZhList[j];
                            obj.en = list.nameEnList[j];
                            item.child.push(obj);
                        }
                        break;
                    }
                }
                $input_params.val("");
                $input_standards.val("");
                refreshSettingPointName();
            } else {
                alert(i18n_point.ADD_NAME_INFO2);
                return;
            }
        }
    };

    onAddPointSystemConfirm = function () {// 标准点名添加系统名
        var systemNameVal = $.trim(jqueryMap.$addSystemParamNameInput.val());
        if (systemNameVal != "") {
            var $wrapper = jqueryMap.$paramSystemNameInputWrapper;
            var list = getZhAndEnlist($wrapper);
            if (list) {
                if (list.nameZhList.length) {
                    var $input_params = $wrapper.find(".addParamName");
                    var $input_standards = $wrapper.find(".addStandardName");
                    var item = {};
                    item.id = getRandom();
                    item.name = systemNameVal;
                    item.child = [];
                    for (var j = 0; j < list.nameZhList.length; j++) {
                        var obj = {};
                        obj.id = getRandom();
                        obj.zh = list.nameZhList[j];
                        obj.en = list.nameEnList[j];
                        item.child.push(obj);
                    }
                    stateMap.sheetPointName.push(item);
                    getSheetPointNameParentList();
                    jqueryMap.$addSystemParamNameInput.val("");
                    $input_params.val("");
                    $input_standards.val("");
                    refreshSettingPointName();
                    refreshSystemNameSelect();
                } else {
                    alert(i18n_point.ADD_NAME_INFO2);
                    return;
                }
            }
        } else {
            alert(i18n_point.ADD_SYSTEM_NAME);
        }
    };

    onAddNameInput = function () {// 添加参数名和标准点名文本框
        if ($(this).attr("id") == "paramAddInput") {
            jqueryMap.$paramNameInputWrapper.append(beopTmpl('tpl_add_name_input'));
        } else {
            jqueryMap.$paramSystemNameInputWrapper.append(beopTmpl('tpl_add_name_input'));
        }
    };

//---------Exports---------
    beop.view = beop.view || {};

    beop.view.standardName = {
        configModel: configModel,
        init: init
    };
}(beop || (beop = {})));

