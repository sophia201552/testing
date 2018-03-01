(function (beop) {
    var configMap = {
            htmlURL: '/static/app/CxTool/views/operationRecord.html',
            settable_map: {
                sheetModel: true
            },
            sheetModel: null
        },
        stateMap = {
            op_record_project_list: [{
                "id": "project001",
                "name": "项目一"
            }, {
                "id": "project002",
                "name": "项目二"
            }, {
                "id": "project003",
                "name": "项目三"
            }],
            op_record_list: [
                {
                    "time": "2015-11-20 11:24:56",
                    "username": "owen",
                    "project": "project1",
                    "equipment": "mac",
                    "ip": "192.168.1.98",
                    "attribution": "上海",
                    "operation": "登录"
                },
                {
                    "time": "2015-11-20 11:24:56",
                    "username": "owen",
                    "project": "project2",
                    "equipment": "mac",
                    "ip": "192.168.1.98",
                    "attribution": "上海",
                    "operation": "登录"
                },
                {
                    "time": "2015-11-20 11:24:56",
                    "username": "owen",
                    "project": "project3",
                    "equipment": "mac",
                    "ip": "192.168.1.98",
                    "attribution": "上海",
                    "operation": "登录"
                },
                {
                    "time": "2015-11-20 11:24:56",
                    "username": "owen",
                    "project": "project4",
                    "equipment": "mac",
                    "ip": "192.168.1.98",
                    "attribution": "上海",
                    "operation": "登录"
                },
                {
                    "time": "2015-11-20 11:24:56",
                    "username": "owen",
                    "project": "project5",
                    "equipment": "mac",
                    "ip": "192.168.1.98",
                    "attribution": "上海",
                    "operation": "登录"
                },
                {
                    "time": "2015-11-20 11:24:56",
                    "username": "owen",
                    "project": "project6",
                    "equipment": "mac",
                    "ip": "192.168.1.98",
                    "attribution": "上海",
                    "operation": "登录"
                },
                {
                    "time": "2015-11-20 11:24:56",
                    "username": "owen",
                    "project": "project7",
                    "equipment": "mac",
                    "ip": "192.168.1.98",
                    "attribution": "上海",
                    "operation": "登录"
                }
            ]
        },
        jqueryMap = {},
        setJqueryMap, configModel,
        init,
        refreshOpRecordList, validateTime,
        onSearchRecord;

    setJqueryMap = function () {
        var $container = stateMap.$container;
        jqueryMap = {
            $container: $container,
            $op_record_project_type: $("#op_record_project_type"),
            $op_record_tbody: $("#op_record_tbody"),
            $op_record_submit_btn: $("#op_record_submit_btn"),
            $op_record_begin_time: $("#op_record_begin_time"),
            $op_record_end_time: $("#op_record_end_time"),
            $op_record_error_info: $("#op_record_error_info")
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
            setJqueryMap();
            jqueryMap.$op_record_submit_btn.off().on('click', onSearchRecord);
            jqueryMap.$op_record_project_type.empty().html(beopTmpl('tpl_op_record_project_list', {list: stateMap.op_record_project_list}));
            refreshOpRecordList();
            jqueryMap.$op_record_begin_time.datetimepicker({
                minView: 2,
                format: "yyyy-mm-dd",
                autoclose: true,
                endDate: new Date()
            });
            jqueryMap.$op_record_end_time.datetimepicker({
                minView: 2,
                format: "yyyy-mm-dd",
                autoclose: true
            });
        })
    };

    //---------DOM操作------


    //---------方法---------
    refreshOpRecordList = function () {
        jqueryMap.$op_record_tbody.empty().html(beopTmpl('tpl_op_record_list', {list: stateMap.op_record_list}));
    };

    validateTime = function ($startTime, $endTime, $msg) {//开始时间，结束时间格式校验
        var flag = false;
        var startTimeVal = $startTime.val();
        var endTimeVal = $endTime.val();
        if (startTimeVal == "") {
            $msg.text("开始时间不能为空").show();
            flag = false;
        } else if (endTimeVal == "") {
            $msg.text("结束时间不能为空").show();
            flag = false;
        } else if (startTimeVal > endTimeVal) {
            $msg.text("开始时间不能晚于结束时间").show();
            flag = false;
        } else {
            flag = true;
        }
        if (flag) {
            $msg.hide();
        } else {
            $msg.show();
        }
        return flag;
    };


//---------事件---------
    onSearchRecord = function () {
        var flag = validateTime(jqueryMap.$op_record_begin_time, jqueryMap.$op_record_end_time, jqueryMap.$op_record_error_info);
        //flag为对日期的非空及开始日期是否小于结束日期的校验
        if (flag) {
            refreshOpRecordList();
        }
    };

//---------Exports---------
    beop.view = beop.view || {};

    beop.view.operation_record = {
        configModel: configModel,
        init: init
    };
}(beop || (beop = {})));
