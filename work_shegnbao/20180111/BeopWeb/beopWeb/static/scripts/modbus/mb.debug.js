/**
 * Created by win7 on 2017/3/10.
 */

(function (exports) {
    class Debug extends exports.BaseView {
        constructor($container) {
            super($container);
            this.html = '/static/scripts/modbus/views/mb.debug.html';
            this.i18n = I18n.resource.modBus.info;
        }

        init() {
            let _this = this;
            super.init().done(function () {
                $("#mbNameInDebug").text(_this.getTreeDode('node').originalName);
                var $mbTable = $("#mbTable");
                if ($mbTable && $mbTable.simpleDataTable('getSelectedData').length) {
                    let data = $mbTable.simpleDataTable('getSelectedData')[0];
                    $("#equipmentSubAddress").val(data.slaveId);
                    $("#equipmentAddress").val(data.address);
                    $("#equipmentLength").val(data.dataLength);
                }
            });
            this._attachEvent();
        }

        getTreeDode(attr) {
            var nodes = $.fn.zTree.getZTreeObj("mb_dtu_list_ul").getSelectedNodes();
            if (attr == 'id') {
                return nodes[0].id;
            } else if (attr == 'node') {
                return nodes[0];
            } else if (attr == 'nodes') {
                return nodes || [];
            }
        }

        transLateMsgCode(msg) {
            if (I18n.resource.dataTerminal.msg_params[msg]) {
                return I18n.resource.dataTerminal.msg_params[msg]
            } else {
                return msg;
            }
        }

        hexCheckObj(type) {
            let $hexCommand = $("#hexCommandInput");
            let hexCommandVal = $hexCommand.val().trim();
            hexCommandVal = hexCommandVal.replace(/\s+/g, "");
            if (hexCommandVal.length % 2 !== 0 || hexCommandVal.length < 12) {
                alert.danger(this.i18n.INCORRECT_FORMAT);
                return false;
            }

            let numXs = [];
            for (var i = 0; i < hexCommandVal.length; i++) {
                if (i % 2 === 0) {
                    var hex = hexCommandVal.substr(i, 2);
                    numXs.push(hex);
                }
            }

            let flagFormat = false;
            for (var k = 0; k < numXs.length; k++) {
                if (!(/^[0-9a-fA-F]{2}$/.test(numXs[k]))) {
                    flagFormat = true;
                }
            }

            if (flagFormat) {
                alert.danger(this.i18n.PLEASE_ENTER_HEXADECIMAL);
                return false;
            }

            return {
                'dtuId': $.fn.zTree.getZTreeObj("mb_dtu_list_ul").getSelectedNodes()[0].id,
                'dataShowType': $("#commandShowType").val(),
                'type': type,
                'command': $hexCommand.val()
            };
        }

        requestCommand(postData) {
            var _this = this;
            WebAPI.post('/modbus/dtu/debug/command', postData).done(function (res) {
                if (res.success) {
                    var logHtml = '', dataShowHtml = '', data = res.data;
                    for (var i = 0; i < data.log.length; i++) {
                        logHtml += '<li>' + data.log[i].log + '</li>';
                    }
                    $("#commandDebugLog").html(logHtml);
                    for (var key in data.datalist) {
                        var value = data.datalist[key] ? data.datalist[key] : "''";
                        dataShowHtml += '<li>' + key + ': ' + value + '</li>';
                    }
                    $("#commandDebugShowData").html(dataShowHtml);
                } else {
                    alert(_this.transLateMsgCode(res.code));
                }
            }).fail(function (e) {
                alert.danger(I18n.resource.common.SERVER_REQUEST_FAILED);
            }).always(function () {
                Spinner.stop();
            });
        }

        _attachEvent() {
            let _this = this;
            $("#modbusContainer").off('click.equipDebugSend').on('click.equipDebugSend', '#equipDebugSend', function () {
                if (!$("#equipmentSubAddress").val().trim()) {
                    alert(_this.i18n.SUBSTATION_ADDRESS_NOT_EMPTY);
                    return;
                }
                if (!$("#equipmentAddress").val().trim()) {
                    alert(_this.i18n.ADDRESS_NOT_EMPTY);
                    return;
                }
                if (!$("#equipmentLength").val().trim()) {
                    alert(_this.i18n.LENGTH_NOT_EMPTY);
                    return;
                }
                let postMap = $("#equipDebugForm").serializeObject();
                postMap.dataShowType = $("#equipShowType").val();
                postMap.dtuId = _this.getTreeDode('id');
                WebAPI.post('modbus/dtu/debug/equipment', postMap).done(function (res) {
                    if (res.success) {
                        var logHtml = '', dataShowHtml = '', data = res.data;
                        for (var i = 0; i < data.log.length; i++) {
                            logHtml += '<li>' + data.log[i].log + '</li>';
                        }
                        $("#equipmentDebugLog").html(logHtml);
                        for (var key in data.datalist) {
                            var value = data.datalist[key] ? data.datalist[key] : "''";
                            dataShowHtml += '<li>' + key + ': ' + value + '</li>';
                        }
                        $("#equipmentDebugShowData").html(dataShowHtml);
                    } else {
                        alert(_this.transLateMsgCode(res.code));
                    }
                }).fail(function (e) {
                    alert.danger(I18n.resource.common.SERVER_REQUEST_FAILED);
                }).always(function () {
                    Spinner.stop();
                });
            }).off('click.directSend').on('click.directSend', '#directSend', function () {
                if (!$("#hexCommandInput").val().trim()) {
                    alert(_this.i18n.HEXADECIMAL_NOT_EMPTY);
                    return;
                }
                var postData = _this.hexCheckObj('direct');
                if (!postData) {
                    return;
                }
                _this.requestCommand(postData);
            }).off('click.checkSend').on('click.checkSend', '#checkSend', function () {
                if (!$("#hexCommandInput").val().trim()) {
                    alert(_this.i18n.HEXADECIMAL_NOT_EMPTY);
                    return;
                }
                var postData = _this.hexCheckObj('check');
                if (!postData) {
                    return;
                }
                _this.requestCommand(postData);
            });
        }

    }

    exports.Debug = Debug;

})(namespace('beop.mb'));
