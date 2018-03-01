/// <reference path="../../lib/jquery-2.1.4.min.js" />
/// <reference path="../../core/common.js" />

var OperatingRecord = (function () {
    function OperatingRecord() {
        this.init();
    };

    OperatingRecord.prototype = {
        show: function () {
            $('#dialogModal').modal({});
        },

        init: function () {
            var _this = this;
            WebAPI.get("/static/views/observer/widgets/operatingRecord.html").done(function (resultHtml) {
                var $dialogContent = $("#dialogContent");
                $dialogContent.html(resultHtml);

                $("#datePickerLog").datetimepicker({
                    minView: "month",
                    autoclose: true,
                    todayBtn: true,
                    initialDate: new Date()
                }).on('hide', function () {
                    var $txtLogDate = $(this).find("#txtLogDate");
                    $txtLogDate.val(timeFormat($txtLogDate.val(),timeFormatChange('yyyy-mm-dd')));
                });

                $("#txtLogDate").val(timeFormat(new Date(),timeFormatChange('yyyy-mm-dd')));
                $("#txtLogDate").change(function (e) {
                    _this.refreshData();
                });

                $("#btnLogPre").click(function (e) {
                    var $txtLogDate = $("#txtLogDate");
                    var preDay = new Date($txtLogDate.val().toDate() - 86400000);
                    $txtLogDate.val(timeFormat(preDay,timeFormatChange('yyyy-mm-dd')));
                    _this.refreshData();
                });

                $("#btnLogNext").click(function (e) {
                    var $txtLogDate = $("#txtLogDate");
                    var nextDay = new Date($txtLogDate.val().toDate().getTime() + 86400000);
                    $txtLogDate.val(timeFormat(nextDay,timeFormatChange('yyyy-mm-dd')));
                    _this.refreshData();
                });

                _this.refreshData();
                I18n.fillArea($dialogContent);
            });
        },

        refreshData: function () {
            Spinner.spin($("#dialogContent .modal-body")[0]);
            var _this = this;
            WebAPI.post("/get_operation_log", { proj: AppConfig.projectId, date: new Date($("#txtLogDate").val()).toLocaleDateString().replace(/\//g,'-') })
                .done(function (data) {
                    _this.renderData(data);
                })
                .always(function () {
                    Spinner.stop();
                });
        },

        renderData: function (data) {
            var sb = new StringBuilder();
            var $txtLogDate = $("#txtLogDate");
            $txtLogDate.val(timeFormat($txtLogDate.val(),timeFormatChange('yyyy-mm-dd')));
            if (data.length && data.length > 0) {
                for (var i = 0, item,opObj,opType,opDesc; i < data.length; i++) {
                    item = data[i];

                    //为了兼容老的数据, 只好弄两个分支
                    if(item.content && item.content.hasOwnProperty('name')){//老数据 content:{modify:Array, name:"1号地源热泵"}
                        opType = '', opDesc = '';
                        /*sb.append("<tr><td>").append(new Date(data[i].RecordTime * 1000).format("yyyy-MM-dd HH:mm:ss")).append("</td>");
                        sb.append("<td>").append(data[i].user).append("</td>");
                        sb.append("<td>").append(data[i].OptRemart).append("</td></tr>");*/
                        sb.append("<tr><td>").append(item.time).append("</td>");
                        sb.append("<td>").append(item.username).append("</td>");
                        sb.append("<td>");
                        for(var key in item.content){
                            if(key == 'name'){
                               opObj = item.content[key];
                            }else if(key == 'modify'){
                                item.content[key].forEach(function(val){
                                    opType += (val.timeAt + val.pointDesc + I18n.resource.observer.widgets.MODIFIED_AS + val.pointValue + '; ');
                                });
                            }else{//开关
                                if(item.content[key] == 1){
                                    opType = I18n.resource.observer.widgets.SWITCH_ON;
                                }else{
                                    opType = I18n.resource.observer.widgets.SWITCH_OFF;
                                }
                            }
                            if(opType.length > 50){
                                opDesc = ('<span title="'+ opType +'">' + opType.substr(0,50) + ' ...' + '</span>');
                            }else{
                                opDesc = ('<span title="'+ opType +'">' + opType + '</span>');
                            }
                        }
                        sb.append(opObj).append('\t').append(opDesc).append("</td></tr>");
                    }else if(item.content && item.content.hasOwnProperty('desc')){//新数据 content:{desc: '1号地源热泵 2016-06-30 14:00:00实际电流(A)修改为1;}    插入数据时,desc就已经拼接好
                        sb.append("<tr><td>").append(item.time).append("</td>");
                        sb.append("<td>").append(item.username).append("</td>");
                        sb.append("<td>").append(item.content.desc).append("</td></tr>");
                    }
                }
            }
            else {
                sb.append("<tr><td colspan=3 i18n='observer.widgets.NO_OPERATIONS_TODAY'></td></tr>");
            }
            $("#tableOperatingRecord tbody").html(sb.toString());

            function getChildrenIndex(ele){
                if(!ele) return;
                var i=0;
                while(ele = ele.previousElementSibling){
                    i++;
                }
                return i;
            }
        }
    }

    return OperatingRecord;
})();