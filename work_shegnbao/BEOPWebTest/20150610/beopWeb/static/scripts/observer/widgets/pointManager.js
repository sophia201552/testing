/// <reference path="../lib/jquery-1.11.1.js" />
/// <reference path="../core/common.js" />
/// <reference path="analysis/analysisTendency.js" />
/// <reference path="analysis/analysisSpectrum.js" />
/// <reference path="analysis/analysisGroup.js" />
/// <reference path="analysis/analysisData.js" />
/// <reference path="widgets/historyChart.js" />
/// <reference path="../core/common.js" />
/// <reference path="../lib/jquery-1.8.3.js" />


var PointManager = (function () {

    var util = {
        tooltip: {
            show: function($ele, cnt) {
                $ele.attr('data-original-title', cnt);
                $ele.tooltip('show');
                if($ele[0].timer) { window.clearTimeout($ele[0].timer); $ele[0].timer = null; }
                $ele[0].timer = window.setTimeout(function() {
                    $ele.tooltip('hide');
                }, 3000);
            },
            hide: function($ele) {
                $ele.tooltip('hide');
            }
        }
    }

    function PointManager() {
        var m_strUserName;
        var m_arrayPrjPt = {nProjectId:null, pointList:null};
        this.i18=I18n.resource.observer.widgets;
    }

    PointManager.prototype = {
        show: function () {
            var _this = this;
            $("#ulPages li").removeClass("active");
            $("#page-DataWatch").parent().addClass("active");

            $.get("/static/views/observer/pointManager.html").done(function (resultHtml) {
                $(ElScreenContainer).html(resultHtml);

                if(AppConfig.projectName == null) {
                    $('#myTab li:last-child').hide();
                } else {
                    $('#stPjName').html(AppConfig.projectName);
                }

                I18n.fillArea($('#divUploadWrap'));

                _this.InitMemberValues();
                _this.initProjectPointList();
                _this.initElement();
                _this.attachEvents();
            });
        },
        close: function () {
            this.detachEvents();
        },
        attachEvents: function () {
            var _this = this;
            // form elements
            var $pjData = $('#iptPjData');
            var $btnConfirm = $('#btnConfirmUpload');

            // upload *.csv elements
            var $spUploadInfo = $('#spUploadInfo');
            var $btnUploadCSV = $('#btnUploadCSV');

            // upload drag and drop elements
            var $divPjDataDropHandler = $('#divPjDataDropHandler');
            var $tip = $divPjDataDropHandler.children('p');
            var $uploadMask = $('#uploadMask');
            var $body = $('body');

            // -1: error
            // 0: success
            var uploadStatus = -1;
            var fileSelected;
            var dragFix = false;

            $spUploadInfo.tooltip( {title: '', trigger: 'manual', placement: 'right'});

            var uploadHandler = function (file) {
                var formData = new FormData();
                var match = file.name.match(/\.[A-Za-z0-9]+$/);
                var supportFiles = ['.csv', '.xls', '.xlsx'];
                if(!file || !match || supportFiles.indexOf(match[0].toLowerCase()) < 0) {
                    util.tooltip.show($spUploadInfo, '文件格式有误，请上传正确的 .csv/.xls/.xlsx 格式文件！');
                    isDataUploadReady = false;
                    return;
                }
                fileSelected = file;
                formData.append('config-file', file);
                $.ajax({
                    url: '/get_config_data/'+AppConfig.userId,
                    type: 'post',
                    data: formData,
                    dataType: 'json',
                    xhr: function () {
                        var xhr = $.ajaxSettings.xhr();
                        if(xhr.upload) {
                            xhr.upload.addEventListener('progress', function (e) {
                                var progress = Math.round(e.loaded / e.total);
                                if(e.lengthComputable) {
                                    $('#spUploadInfo').html('正在上传...'+progress*100+'%');
                                }
                            }, false);
                            xhr.upload.addEventListener('load', function (e) {
                                $('#spUploadInfo').html('正在处理数据...');
                            }, false);
                        }
                        return xhr;
                    },
                    cache: false,
                    contentType: false,
                    processData: false
                }).done(function (rs) {
                    $('#spUploadInfo').removeClass()
                        .addClass('text-success')
                        .html('上传成功 - '+file.name);
                    uploadStatus = 0;
                }).fail(function (err) {
                    $('#spUploadInfo').removeClass()
                        .addClass('text-danger')
                        .html('上传失败，文件中有错误！');
                    uploadStatus = -1;
                });
            };

            // bind *.csv upload event
            $btnUploadCSV.click(function (e) {
                $pjData.click();
            });
            $pjData.change(function () {
                uploadHandler($(this)[0].files[0]);
            });

            // drag and drop upload events
            // drag enter
            $divPjDataDropHandler.on('dragenter', function (e) {
                dragFix = true;
                $tip.html('松开鼠标开始上传');
                e.stopPropagation();
                e.preventDefault();
            });
            // drag leave
            $divPjDataDropHandler.on('dragleave', function (e) {
                dragFix = false;
                $tip.html('请将文件拖拽到此处进行上传');
                e.stopPropagation();
                e.preventDefault();
            });
            // drop
            $divPjDataDropHandler.on('drop', function (e) {
                var files, file;
                $divPjDataDropHandler.hide();
                $uploadMask.hide();
                $tip.html('请将文件拖拽到此处进行上传');
                // upload now
                files = e.originalEvent.dataTransfer.files;
                if(files.length > 1) alert('请注意：\n目前系统不支持同时上传多个文件，将会使用您选择的第一个文件进行上传！');
                file = files[0];
                uploadHandler(file);
                e.stopPropagation();
                e.preventDefault();
            });
            $uploadMask.on('dragleave', function (e) {
                e.stopPropagation();
                if(dragFix) return;
                $uploadMask.hide();
                $divPjDataDropHandler.hide();
            });
            $body.on('dragenter', function (e) {
                $divPjDataDropHandler.show();
                $uploadMask.show();
                e.preventDefault();
            });
            //  prevent 'drop' event on elements
            $body.add($uploadMask).add($divPjDataDropHandler).on('dragover', function (e) {
                e.preventDefault();
            });
            // mock escape event
            $body.on('keydown', function (e) {
                // console.log('body key up');
                if(e.keyCode === 27) {
                    $uploadMask.hide();
                    $divPjDataDropHandler.hide();
                    e.preventDefault();
                }
            });
            $body.on('drop', function (e) {
                $uploadMask.hide();
                $divPjDataDropHandler.hide();
                e.preventDefault();
            });

            $btnConfirm.click(function () {
                if(AppConfig.projectId == null) {
                    alert('请您先选择一个项目，再进行上传！');
                    return;
                }
                if(uploadStatus !== 0) {
                    alert('请您先上传数据，并保证数据的正确性！');
                    return;
                }
                Spinner.spin($body[0]);
                // submit
                WebAPI.post('/project/import_user_data/'+AppConfig.userId, {
                    dataFileName: fileSelected.name,
                    projId: AppConfig.projectId
                }).done(function (rs) {
                    rs = JSON.parse(rs);
                    if(typeof rs === 'object' && rs.error === 'successful') {
                        alert('数据导入成功！');
                        ScreenManager.show(PointManager);
                    } else {
                        alert('服务器忙碌中，请稍后重试！');
                    }
                }).fail(function () {
                    alert('服务器忙碌中，请稍后重试！');
                }).always(function () {
                    Spinner.stop();
                });
            });
        },
        detachEvents: function () {
            // detachEvents drag and drop upload events
            $('#divPjDataDropHandler').off();
            $('#uploadMask').off
            $('body').off();
        },   
        initProjectPointList: function () {
            var _this = this;
            var projSelector = $("#divProjectList .panel-body");
            projSelector.html('');

            var divProj = document.createElement("div");

            var ul = document.createElement("ul");
            ul.className = "list-group";

            var nSize = AppConfig.projectList.length;
            for (var i=0; i<nSize; i++) {
                var project = AppConfig.projectList[i];

                var li = document.createElement("li");
                li.className = "list-group-item list-group-item-success";
                li.id = "project_" + project.name_en;
                li.title = project.name_en;
                li.textContent = project.name_cn;
                li.value = project.id;
                li.onclick = function(e) {
                    var tarProj = e.currentTarget;
                    _this.SelectProjectName(tarProj, true);
                    var nPrjId = tarProj.value;

                    var ptListSelector = $("#tableWatch tbody");
                    ptListSelector.html('');

                    Spinner.spin($("#divPointManagerPage")[0]);
                    WebAPI.post("/get_realtimedata", {proj: tarProj.value}).done(function (result) {
                    //WebAPI.post("/get_realtimedata_with_description_by_projname", {projid: tarProj.value}).done(function (result) {
                    //WebAPI.get("/analysis/get_pointList_from_s3db/"+ tarProj.value).done(function (result) {
                        var ptList = JSON.parse(result);
                        if (0 == ptList.length) {
                            alert("'" + tarProj.textContent + "' "+this.i18.FAIL_FIND_POINT+"！");
                            _this.SelectProjectName(tarProj, false);
                            Spinner.stop();
                            return;
                        }

                        var tr;
                        var td;
                        var nListSize = ptList.length;
                        for (var i=0; i<nListSize; i++) {
                            tr = document.createElement("tr");
                            tr.className = "";

                            td = document.createElement('td');
                            td.innerHTML = "<input type='checkbox' class='checkBtn' id='chk_" + i + "' value='" + ptList[i].name + "'/>";
                            td.onclick = function (e) {
                                var tarChk = e.currentTarget;
                                var ptName = (tarChk.children)[0].value;
                                if ((tarChk.children)[0].checked) {
                                    _this.OperateMemberValues(nPrjId, ptName, "add");
                                }
                                else {
                                    _this.OperateMemberValues(nPrjId, ptName, "del");
                                }
                            }
                            tr.appendChild(td);

                            td = document.createElement("td");
                            td.textContent = i + 1;
                            tr.appendChild(td);

                            td = document.createElement("td");
                            td.id = "point_" + ptList[i].name;
                            td.textContent = ptList[i].name;
                            tr.appendChild(td);

                            td = document.createElement("td");
                            td.id = "value_" + ptList[i].name;
                            td.textContent = ptList[i].value;
                            td.onclick = function(e) {
                                var tarVal = e.currentTarget;
                                var temp = tarVal.innerText;
                                if ("" == temp) {
                                    return;
                                }
                                tarVal.innerText = "";

                                // input
                                var textBox = document.createElement('input');
                                textBox.value = temp;
                                textBox.onblur = function(e) {
                                    var arr = tarVal.id.split("_");
                                    Spinner.spin($("#divPointManagerPage")[0]);
                                    WebAPI.post("/set_realtimedata", {
                                        db:tarProj.value,
                                        point:arr[1],
                                        value:textBox.value
                                    }).done(function(result) {
                                        Spinner.stop();
                                    }).error(function(result){
                                        alert(I18n.resource.analysis.paneConfig.ERR1);
                                        Spinner.stop();
                                    });

                                    tarVal.removeChild(textBox);
                                    tarVal.textContent = textBox.value;
                                };
                                tarVal.appendChild(textBox);
                                textBox.select();
                            };
                            tr.appendChild(td);

                            ptListSelector.append(tr);
                        }

                        _this.SetCheckboxStatus(nPrjId);

                        Spinner.stop();
                    }).error(function (result) {
                        alert(I18n.resource.analysis.paneConfig.ERR1);
                        Spinner.stop();
                    });
                };
                ul.appendChild(li);
            }
            divProj.appendChild(ul);
            projSelector.append(divProj);
        },

        initElement: function () {
            var _this = this;

            $(".form_datetime").datetimepicker({
                format: "yyyy-mm-dd hh:ii",
                minView: "hour",
                autoclose: true,
                todayBtn: true,
                initialDate: new Date()
            });

            $('#btn_hist_curve').click(function(e) {
                var tmStart = $("#selStartTime").val();
                if ("" == tmStart){
                    alert(I18n.resource.observer.widgets.SELECT_START_TIME+"！")
                    return;
                }
                tmStart += ":00";

                var tmEnd = $("#selEndTime").val();
                if ("" == tmEnd){
                    alert(I18n.resource.observer.widgets.SELECT_CLOSING_TIME+"！")
                    return;
                }
                tmEnd += ":00";

                var project_name;
                $("div#divProjectList .list-group-item").each(function() {
                    var nIndex = (this.className).indexOf("active");
                    if (-1 != nIndex) {
                        project_name = this.title;
                        return false;
                    }
                });

                var point_name_list = [];
                $("div#divPointsList [type=checkbox]:checked").each(function() {
                    point_name_list.push($(this).parent().parent().find("td:eq(2)").text());
                });
                if (0 == point_name_list.length) {
                    alert(I18n.resource.observer.widgets.PLEASE_SELECT_POINT+"！");
                    return;
                }

                Spinner.spin($("#divPointManagerPage")[0]);
                WebAPI.post("/get_history_data_ex", {
                        project:project_name,
                        listPtName:point_name_list,
                        timeStart:tmStart,
                        timeEnd:tmEnd,
                        timeFormat:"m5"
                    }).done(function(result){
                        var data = JSON.parse(result);
                        new HistoryChart(data).show();
                        Spinner.stop();
                    })
                    .error(function (e){

                        alert(I18n.resource.observer.widgets.HISTORY_CURVE_FAILED+"！");
                        Spinner.stop();
                    });
            });

            $("#btn_sel_all").click(function(e) {
                var arr = document.getElementsByClassName("checkBtn");
                for (var i=0; i<arr.length; i++) {
                    arr[i].checked = true;
                }
            });

            $("#btn_sel_none").click(function(e) {
                var arr = document.getElementsByClassName("checkBtn");
                for (var i=0; i<arr.length; i++) {
                    arr[i].checked = false;
                }
            });

            $("#btn_sel_save").click(function(e) {
                var tmStart = $("#selStartTime").val();
                if ("" == tmStart) {
                    alert(I18n.resource.observer.widgets.ENTER_STAT_TIME+"！");
                    Spinner.stop();
                    return;
                }
                tmStart += ":00";

                var tmEnd = $("#selEndTime").val();
                if ("" == tmEnd) {
                    alert(I18n.resource.observer.widgets.ENTER_CLOSING_TIME+"！");
                    Spinner.stop();
                    return;
                }
                tmEnd += ":00";

                Spinner.spin($("#divPointManagerPage")[0]);

                var prjList = JSON.stringify(_this.m_arrayPrjPt);
                WebAPI.post("/save_history_config_value", {
                    userName:_this.m_strUserName,
                    configName:'myConfig',
                    startTime:tmStart,
                    endTime:tmEnd,
                    projectList:prjList
                }).done(function(result) {

                    Spinner.stop();
                }).error(function(e) {
                    alert(I18n.resource.observer.widgets.FAIL_SAVE_CONFIGURATION+"！");
                    Spinner.stop();
                });
            });

            $("#btn_sel_load").click(function(e) {
                Spinner.spin($("#divPointManagerPage")[0]);

                WebAPI.get("/load_history_config_value/" + _this.m_strUserName
                ).done(function(result) {

                    Spinner.stop();
                }).error(function(e) {
                    alert(I18n.resource.observer.widgets.FAIL_SAVE_CONFIGURATION+"！");
                    Spinner.stop();
                });
            });

            $("#btn_sel_clear").click(function(e) {
                new PointManager().show();
            });
        },

        SelectProjectName: function(clickTarget, bActive) {
            $("div#divProjectList .list-group-item").each(function() {
                $(this).attr("class", "list-group-item list-group-item-success");
            });

            if (true == bActive) {
                $(clickTarget).attr("class", "list-group-item list-group-item-success active");
            }
        },

        SelectPointName: function(clickTarget) {
            var nIndex = clickTarget.className.indexOf("info");
            if (-1 != nIndex) {
                $(clickTarget).attr("class", "");
            }
            else {
                $(clickTarget).attr("class", "info");
            }
        },

        InitMemberValues: function() {
            var _this = this;

            _this.m_strUserName = AppConfig.account;
            _this.m_arrayPrjPt = new Array;
            _this.m_arrayPrjPt.splice(0, _this.m_arrayPrjPt.length);
        },

        OperateMemberValues: function(nPrjId, ptName, flag) {
            var _this = this;

            var nFindIdx = -1;
            var nLen = _this.m_arrayPrjPt.length;
            for (var i=0; i<nLen; i++) {
                if (_this.m_arrayPrjPt[i].nProjectId == nPrjId) {
                    nFindIdx = i;
                    break;
                }
            }

            if ("add" == flag) {
                if (nFindIdx == -1) {
                    // not find
                    var ptList = new Array;
                    ptList.push(ptName);
                    _this.m_arrayPrjPt.push({nProjectId:nPrjId, pointList:ptList});
                }
                else {
                    // find
                    _this.m_arrayPrjPt[nFindIdx].pointList.push(ptName);
                }
            }
            else if ("del" == flag) {
                if (nFindIdx == -1) {
                    // not find
                }
                else {
                    // find
                    var ptIdx = -1;
                    var ptLen = _this.m_arrayPrjPt[nFindIdx].pointList.length;
                    for (var i=0; i<ptLen; i++) {
                        if (_this.m_arrayPrjPt[nFindIdx].pointList[i] == ptName) {
                            ptIdx = i;
                            break;
                        }
                    }
                    _this.m_arrayPrjPt[nFindIdx].pointList.splice(ptIdx, 1);
                }
            }
        },

        SetCheckboxStatus: function(nPrjId) {
            var _this = this;

            var nLen = _this.m_arrayPrjPt.length;
            if (0 == nLen) {
                return;
            }
            var nIndex = -1;
            for (var i=0; i<nLen; i++) {
                if (_this.m_arrayPrjPt[i].nProjectId == nPrjId) {
                    nIndex = i;
                    break;
                }
            }
            if (-1 == nIndex) {
                return;
            }

            var ptList = _this.m_arrayPrjPt[nIndex].pointList;
            var nLen = ptList.length;

            $('[type=checkbox]').each(function() {
                for (var i=0; i<nLen; i++) {
                    if (this.value == ptList[i]) {
                        this.checked = true;
                    }
                }
            })
        }
    }

    return PointManager;
})();
