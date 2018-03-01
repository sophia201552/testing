/// <reference path="../../lib/jquery-2.1.4.min.js" />
/// <reference path="../../core/common.js" />

var UploadFile = (function () {
    function UploadFile(data) {
        this.init();
        this.m_data = data;
    };

    UploadFile.prototype = {
        show: function () {
            $('#dialogModal').modal({});
        },

        init: function () {
            var _this = this;
            WebAPI.get("/static/views/observer/widgets/uploadFile.html").done(function (resultHtml) {
                $("#dialogContent").html(resultHtml);

                _this.refreshData();

                $("#btn_write_pt").click(function(e){
                    var ptList = [];
                    var name;
                    var value;
                    var row;
                    $(".chkPtSel").each(function(){
                        name = $(this).closest('tr').find('.ptName').text();
                        value = $(this).closest('tr').find('.ptValue').text();
                        row = {pointName:name,pointValue:value};
                        ptList.push(row);
                    })
                    if (0 == ptList.length){
                        alert(I18n.resource.observer.widgets.PLEASE_SELECT_POINT+"！");
                        return;
                    }

                    WebAPI.post("/update_realtimedata_input_value", {
                        project:AppConfig.projectName,
                        listInfo:ptList
                    }).done(function(result){
                    })
                    .error(function (e){
                        alert(I18n.resource.observer.widgets.UPDATE_TABLE+"realtimedata_input"+I18n.resource.observer.widgets.FAILED+"！");
                        Spinner.stop();
                    });
                });

                $("#chk_all_sel").click(function(e){
                    var state = $("#chk_all_sel").is(":checked");
                    var arr = document.getElementsByClassName('chkFlag');
                    for(var i=0; i<arr.length; i++){
                        arr[i].checked = state;
                    }
                });
            });
        },

        refreshData: function () {
            //Spinner.spin($("#dialogContent .modal-body")[0]);
            this.initData(this.m_data);
        },

        initData: function(data) {
            var table = $("#tableOperatingRecord tbody");
            var tr;
            var td;
            var jsonData = JSON.parse(data);
            if (jsonData.length && jsonData.length > 0) {
                for (var i = 0; i < jsonData.length; i++) {
                    tr = document.createElement('tr');

                    td = document.createElement('td');
                    td.className = 'chkPtSel';
                    td.innerHTML = "<input type='checkbox' class='chkFlag' />";
                    tr.appendChild(td);

                    td = document.createElement('td');
                    td.className = 'ptName';
                    td.innerHTML = jsonData[i][0].name;
                    tr.appendChild(td);

                    td = document.createElement('td');
                    td.className = 'ptValue';
                    td.innerHTML = jsonData[i][1].value;
                    tr.appendChild(td);

                    table.append(tr);
                }
            }
            else {
                table.append("<tr><td colspan=3 i18n='observer.widgets.NO_DATA_READ'></td></tr>");
            }
        }
    }

    return UploadFile;
})();
