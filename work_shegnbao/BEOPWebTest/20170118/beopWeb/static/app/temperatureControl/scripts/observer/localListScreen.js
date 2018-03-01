var localListScreen = (function () {
    var _this;

    function localListScreen() {
        _this = this;
        this.mqttClient = undefined;
        this.dictionary = {
            sensor: [],
            controller: []
        };
    }

    localListScreen.prototype = {
        init: function () {
            this.initWorkerUpdate();
            this.renderDeviceList();
        },
        attachEvent: function () {
            $('.deviceTab').off('click').on('click', 'span', function (e) {
                $(e.currentTarget).addClass('active').siblings().removeClass('active');
                var tableType = $(e.currentTarget).attr('_id');
                $('.' + tableType).addClass('cur').siblings().removeClass('cur');
            });
            $('.opt-btn').off('click').on('click', function () {
                $(this).toggleClass('on');
                var cNum = $(this).parent().parent().find('.listNum').html();
                var arrController = _this.dictionary.controller;
                for (var i = 0; i < arrController.length; i++) {
                    if (cNum == arrController[i].num) {
                        arrController[i].f = $(this).hasClass('.on') ? 1 : 0;
                        delete arrController[i].num;
                        //var postData='/control/'+cNum+' '+JSON.stringify(arrController[i]);
                        var topicUrl = '/control/' + cNum;
                        var message = JSON.stringify(arrController[i]);
                        console.log(topicUrl+' '+message);
                    }
                }
                _this.mqttClient.mqttClient.publish(topicUrl, message);
            });
            $('.btnBack').off('click').on('click', function () {
                $('#deviceTable').remove();
            });
        },

        renderDeviceList: function () {
            var deviceTable = document.createElement('div');
            $(deviceTable).attr('id', 'deviceTable');
            /*退出*/
            var tpl = '<div class="deviceTab"><span class="active" _id="controllerTable">Controllers</span><span _id="sensorTable">Sensors</span></div>';
            $(deviceTable).append(tpl);
            $(deviceTable).append('<button class="btnBack"><span class="glyphicon glyphicon-remove"></span></button>')
                /*           this.mqttClient.setOption({
                                //arrTopic: ['/state/sensor/#', '/state/controller/#', 'controller/#'],
                                arrTopic: ['/state/#'],
                                arrBehavior: [this.refreshTableData]
                            }); */

            var timer = setInterval(function () {
                if (_this.dictionary.controller.length > 0) {
                    clearInterval(timer);

                    /*控制器表格*/
                    var controllerTable = document.createElement('div');
                    $(controllerTable).addClass("controllerTable cur");
                    var thead = document.createElement('div');
                    thead.className = 'controllerHead';
                    controllerTable.appendChild(thead);
                    $(thead).append('<div class="listNum">Point Number</div><div class="macAddress">MAC address</div><div class="deviceStatus">Turn Fan On/Off</div>');

                    var controllerData = _this.arrayDeduplication(_this.dictionary.controller);
                    controllerData.sort(function (a, b) {
                        return a.num - b.num;
                    });
                    var sensorData=_this.arrayDeduplication(_this.dictionary.sensor);
                    sensorData.sort(function (a, b) {
                        return a.num - b.num;
                    })
                    for (var i = 0; i < controllerData.length; i++) {
                        var cdata = controllerData[i];
                        var tr = document.createElement('div');
                        tr.className = 'controllerCow';
                        controllerTable.appendChild(tr);
                        $(tr).append($('<div class="listNum"></div>').html(cdata.num));
                        $(tr).append($('<div class="macAddress"></div>').html(cdata.m));

                        var toggleTpl;
                        switch (cdata.f) {
                            case 0:
                                toggleTpl = '<div class="opt-btn btn-switch"><div class="btn-switch-slider"></div></div>';
                                break;
                            case 1:
                                toggleTpl = '<div class="opt-btn btn-switch on"><div class="btn-switch-slider"></div></div>';
                                break;
                            default:
                                break;
                        }
                        $(tr).append($('<div class="deviceStatus"></div>').html(toggleTpl));

                    }
                    $(deviceTable).append(controllerTable);

                    /* 传感器表格*/
                    var sensorTable = document.createElement('div');
                    $(sensorTable).addClass("sensorTable");
                    var shead = document.createElement('div');
                    shead.className = 'sensorHead';
                    sensorTable.appendChild(shead);
                    $(shead).append('<div class="listNum">Point Number</div><div class="macAddress">MAC address</div><div class="deviceStatus">Temperature Value</div>');
                    for (var i = 0; i < sensorData.length; i++) {
                        var sdata = sensorData[i];
                        var tr = document.createElement('div');
                        tr.className = 'sensorCow';
                        sensorTable.appendChild(tr);
                        $(tr).append($('<div class="listNum"></div>').html(sdata.num));
                        $(tr).append($('<div class="macAddress"></div>').html(sdata.m));
                        $(tr).append($('<div class="deviceStatus"></div>').html(sdata.t));
                    }
                    $(deviceTable).append(sensorTable);

                    $('#divObserverMap').append($(deviceTable));
                    _this.attachEvent();
                }
            }, 1500);
        },
        initWorkerUpdate: function () {
            this.mqttClient = new MqttTempClient({
                arrTopic: ['/state/sensor/#', '/state/controller/#'],
                arrBehavior: [this.refreshTableData]
            });
        },
        refreshTableData: function (topic, data) {
            var val = '';
            var listNum;
            console.log()
            if (topic.includes('/state/sensor/')) {
                listNum = parseInt(topic.substring(topic.lastIndexOf('/') + 1, topic.length));
                val = data.t;
                _this.dictionary.sensor.push({
                    num: listNum,
                    m: data.m,
                    t: val
                });
            } else
            if (topic.includes('/state/controller/')) {
                listNum = parseInt(topic.substring(topic.lastIndexOf('/') + 1, topic.length));
                val = data.f;
                _this.dictionary.controller.push({
                    num: listNum,
                    m: data.m,
                    f: val
                });
            } else {
                console.log("Unknow type!");
                return;
            }
        },
        arrayDeduplication: function (array) {
            if (!Array.prototype.unique) {
                var hash = {}, result = [], type = '', item;
                for (var i = 0; i < array.length; i++) {
                    item = array[i].num;
                    type = Object.prototype.toString.call(item);
                    if (!hash[item + type]) {
                        hash[item + type] = true;
                        result.push(array[i]);
                    }
                }
                return result;
            }
        }
    }

    return localListScreen;
})();