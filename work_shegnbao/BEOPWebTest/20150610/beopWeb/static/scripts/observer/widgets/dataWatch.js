/// <reference path="../lib/jquery-1.11.1.js" />
/// <reference path="../core/common.js" />
/// <reference path="analysis/analysisTendency.js" />
/// <reference path="analysis/analysisSpectrum.js" />
/// <reference path="analysis/analysisGroup.js" />
/// <reference path="analysis/analysisData.js" />
/// <reference path="widgets/historyChart.js" />
/// <reference path="../core/common.js" />
/// <reference path="../lib/jquery-1.8.3.js" />


var DataWatch = (function () {
    function DataWatch() {
        this.currentMode = undefined;
        this.listAllPointValues = undefined;
        this.listPoints = undefined;
        this.listPointsTemp = undefined;

        this.startTime = undefined;
        this.endTime = undefined;
        this.interval = undefined;

        this.allData = undefined;
    }

    DataWatch.prototype = {
        show: function () {
            var _this = this;
            Spinner.spin(ElScreenContainer);
            $("#ulPages li").removeClass("active");
            $("#page-DataWatch").parent().addClass("active");

            $.get("/static/views/observer/widgets/dataWatch.html").done(function (resultHtml) {
                Spinner.spin(ElScreenContainer);
                $(ElScreenContainer).html(resultHtml);
                _this.init();
            });
        },

        close: function () {
            this.listAllPoints = null;
            this.listPoints = null;
            this.listPointsTemp = null;
            this.startTime = null;
            this.endTime = null;
            this.currentMode = null;
        },

        init: function () {
            this.initPoints();
            this.initElement();

            I18n.fillArea($("#divAllPointsPane .panel-heading"));
        },

        initPoints: function () {
            var _this = this;
            this.listAllPointValues = {};
            Spinner.spin($("#divDataWatchPage")[0]);
            WebAPI.post("/get_realtimedata_with_description_by_projname", { projid: AppConfig.projectId }).done(function (result) {
                var data = JSON.parse(result);
                 _this.renderPoints(data);
            Spinner.stop();
            });
        },

        renderPoints: function (data) {
            var _this = this;
            for (var i = 0; i < data.length; i++) {
                this.listAllPointValues[data[i].name] =[data[i].value, data[i].desc] ;
            }
            var divPane = document.createElement("div");
            var sb, divPoint;
            var i = 0;
            var tr, td;
            var table = $("#tableWatch");

            for (var key in this.listAllPointValues) {

                var rownum = $("#tableWatch tr").length-1;

                tr = document.createElement('tr');

                td = document.createElement('td');
                td.innerHTML = "<input type='checkbox' id='chk_" + i + "'/>";
                tr.appendChild(td);

                td = document.createElement('td');
                td.innerHTML = i;
                tr.appendChild(td);

                td = document.createElement('td');
                td.id = 'point_name_' + i;
                td.className = 'ptName';
                td.textContent =  key;
                tr.appendChild(td);

                td = document.createElement('td');
                td.id = 'point_value_' + i;
                td.innerHTML = this.listAllPointValues[key][0];
                td.onclick = function(e){
                    var target = e.currentTarget;
                    var temp = target.innerText;
                    if ("" == temp){
                        return;
                    }
                    target.innerText = "";

                    // input
                    var textBox = document.createElement('input');
                    textBox.value = temp;
                    textBox.onblur = function(e){
                        var arr = target.id.split("_");
                        WebAPI.post("/set_realtimedata", {
                            db:AppConfig.projectId,
                            point:$("#point_name_" + arr[2]).text(),
                            value:textBox.value
                        }).done(function(result){
                        });

                        target.removeChild(textBox);
                        target.textContent = textBox.value;
                    };
                    target.appendChild(textBox);
                    textBox.select();
                };
                tr.appendChild(td);

                td = document.createElement('td');
                td.innerHTML = this.listAllPointValues[key][1];
                tr.appendChild(td);

                td = document.createElement('td');
                td.innerHTML = '--';
                tr.appendChild(td);

                table.append(tr);

                //var row="<tr><td><input type='checkbox' id='chk_" + i + "'/></td><td>"+ rownum + "</td><td id='point_name_" + i + "' class='ptName'>" +  key + "</td><td id='point_value_" + i + "'>"+  this.listAllPointValues[key][0] + "</td><td>"+ this.listAllPointValues[key][1] +"</td><td>"+ "--"+"</td></tr>";
                //$(row).insertAfter($("#tableWatch tr:eq("+rownum+")"));

                i++;
            }
            //$("#divAllPointsPane").append(divPane);
        },

        initElement: function () {
            var _this = this;

            //TODO: restore
            //var now = new Date();
            //this.startTime = new Date(now - 86400000);
            //this.endTime = now;

            var now = new Date();
            this.startTime = "2014-11-24 06:10";
            this.endTime = "2014-11-28 12:50";

            $(".form_datetime").datetimepicker({
                format: "yyyy-mm-dd hh:ii",
                minView: "hour",
                autoclose: true,
                todayBtn: true,
                initialDate: new Date()
            });
            //$("#txtStartTime").val(this.startTime.format("yyyy-MM-dd HH:mm"));
            //$("#txtEndTime").val(this.endTime.format("yyyy-MM-dd HH:mm"));
            $("#txtStartTime").val(this.startTime);
            $("#txtEndTime").val(this.endTime);


            $("#btnReset").click(function (e) {
                $("#divDisplayOptions").hide();
                $("#divSettingOptions").show();

                _this.close();
                _this.show();
            });

            $('#btn_hist_curve').click(function(e){
                //_this.setDisplayModeActive(e);
                //alert($('[type=checkbox]:checked').size());

                var idRow = 0;
                var point_name;

                var point_value_list = [];
                $('[type=checkbox]:checked').each(function(){
                    point_value_list.push($(this).closest('tr').find('.ptName').text());
                })
                if (0 == point_value_list.length){
                    alert(I18n.resource.observer.widgets.PLEASE_SELECT_POINT+"！");
                    return;
                }

                var tmStart = $("#txtLogDateStart").val();
                if ("" == tmStart){
                    alert(I18n.resource.observer.widgets.SELECT_START_TIME+"！");
                    return;
                }
                tmStart += ":00";

                var tmEnd = $("#txtLogDateEnd").val();
                if ("" == tmEnd){
                    alert(I18n.resource.observer.widgets.SELECT_CLOSING_TIME+"！");
                    return;
                }
                tmEnd += ":00";

                WebAPI.post("/get_history_data_ex", {
                        project:AppConfig.projectName,
                        listPtName:point_value_list,
                        timeStart:tmStart,
                        timeEnd:tmEnd,
                        timeFormat:"m5"
                    }).done(function(result){
                        var data = JSON.parse(result);

                        new HistoryChart(data).show();
                    })
                    .error(function (e){
                        alert(I18n.resource.observer.widgets.HISTORY_CURVE_FAILED+"！");
                        Spinner.stop();
                    });

                //var point_value;
                /*$('[type=checkbox]:checked').each(function(index, event){
                    var idRow = event.id.split('_')[1];

                    point_name = $("#point_name_" + idRow).text();
                    //point_value = $('#point_value_' + idRow).text();

                    WebAPI.post("/get_history_data", {
                        project:AppConfig.projectName,
                        pointName:point_name,
                        timeStart:"2014-11-28 08:00:00",
                        timeEnd:"2014-11-28 12:00:00",
                        timeFormat:"m5"
                    }).done(function(result){
                        var data = JSON.parse(result);

                        new HistoryChart(data).show();
                    });

                });*/
            });
        }
    }

    return DataWatch;
})();

function uploadFile(){
    var fileObj = document.getElementById("input_load_csv").files[0];// 获取文件对象

    var form = new FormData();
    form.append("cvsFile", fileObj);// 文件对象

    var xhr = new XMLHttpRequest();
    xhr.onload = function (){
            if (xhr.readyState==4 && xhr.status==200) {
                //alert(xhr.responseText);
                new UploadFile(xhr.responseText).show();
            }
            else {
                alert(I18n.resource.observer.widgets.READ_DATA_FAILED+"！");
            }
        };
    xhr.open("post", "/get_csv_data", true);
    xhr.send(form);
}
