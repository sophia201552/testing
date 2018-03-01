var DotState = (function(){
    var _this;
    function DotState() {
        _this = this;
        _this.requestData = undefined;
        _this.timeData = undefined;
    }
    DotState.prototype.show = function () {
        WebAPI.get('/static/app/Benz/dotInput/views/dotDetail.html').done(function (resultHtml) {
            var currentHref = location.href;
            var id = currentHref.split('?')[1].split('=')[1]
            _this.container = $('#dotDetail');
            $('#datetimepicker').datetimepicker({ format: 'yyyy-mm-dd', minView: 'month', autoclose: true, startView: 'month' });
            $('#datetimepicker input').val(new Date().format('yyyy-MM-dd'));
            WebAPI.get('/static/app/Benz/dotInput/data/data.json').done(function (result) {
                var reslutData = eval(result);
                var $dotLeft = $('.dotLeft');
                var temp = '';
                for (var i = 0, len = reslutData.length; i < len; i++) {
                    var item = reslutData[i];
                    var className = '';
                    if (item.attr[0].isSticked && item.attr.length === 1) {
                        //className = item.attr[0].point;
                        continue;
                    } else {
                        className = item.attr[0].point.split('_')[0];
                    }
                    temp += '<div class="dotDetailS ' + className + '">\
                        ' + reslutData[i].name + '\
                    </div>';
                }
                $dotLeft.append(temp);
                _this.attEvent(reslutData);
                $('.' + id).trigger('click');
            });
        });
    };
    DotState.prototype.attEvent = function (reslutData) {
        $('.dotDetailS').off('click').click(function () {
            var $this = $(this);
            if (!$this.hasClass('active')) {
                $this.addClass('active');
                $this.siblings().removeClass('active');
            }
            _this.dotAttrData(reslutData);
        });
        $('#getDataBtn').off('click').click(function () {
            if ($('.dotLeft').find('.active').length < 1) {
                alert('请选择设备！');
                return;
            }
            _this.dotAttrData(reslutData);
        });
        $('.dotBannerR').off('click').click(function () {
            if (_this.requestData && _this.requestData.saveList.length > 0) {
                WebAPI.post('/save/saveDataToMongodb', _this.requestData).done(function (data) {
                    data;
                });
            };
            if (_this.timeData && _this.timeData.point.length !== 0) {
                WebAPI.post('/set_mutile_realtimedata_by_projid', _this.timeData).done(function (data) {
                    if (data === 'success') {
                        alert('保存成功！');
                    };
                });
            }
        });
        //$('#datetimepicker').find('input').keyup(function (e) {
        //    if (e.keycode === 9) { return}
        //})
        //$('#datetimepicker').keyup(function (e) {
        //    if (e.keycode === 9) { return }
        //})
    };
    DotState.prototype.dotAttrData = function (reslutData) {
        var name = $('.dotDetailS.active').text().replace(/(^\s*)|(\s*$)/g, "");
        var pointArr = [];
        //var temp = '<div class="dotTitleList">时间</div>';//title
        var temp = '<td class="dotTitleList">时间</td>';
        //var temp1 = '<div class="dotTitleList timeSp"></div>';//每行数据
        var temp1 = '<td class="dotDataList timeSp"></td>'
        var temp2 = '';
        for (var i = 0, len = reslutData.length; i < len; i++) {
            var item = reslutData[i];
            if (name === item.name.replace(/(^\s*)|(\s*$)/g, "")) {
                var curentPointP = item.attr;
                for (var j = 0, lens = curentPointP.length; j < lens; j++) {
                    var unit = curentPointP[j].unit ? ('(' + curentPointP[j].unit + ')') : '';
                    pointArr.push(curentPointP[j].point);
                    //temp += '<div class="dotTitleList">' + curentPointP[j].name + unit + '</div>';
                    temp += '<td class="dotTitleList">' + curentPointP[j].name + unit + '</td>';
                    //temp1 += '<div class="dotTitleList"></div>';
                    if (j === 0) {
                        if (curentPointP[j].point === 'GSHP401_SeasonMode') {
                            continue;
                           // temp1 += '<td class="dotDataListOpen" data-point="' + curentPointP[j].point + '">-</td>';//<select class="runState" disabled><option class="runStateOption">冬季</option><option class="runStateOption">夏季</option><select>
                        } else if (curentPointP[j].enum) {
                            temp1 += '<td class="dotDataListOpen dotDataList" data-point="' + curentPointP[j].point + '"><lable class="dataLBox">-</lable></td>';//<select class="runState" disabled><option class="runStateOption">关</option><option class="runStateOption">开</option><select>
                        } else {
                            temp1 += '<td class="dotDataList" data-point="' + curentPointP[j].point + '" ><lable class="dataLBox"></lable><input type="text" class="changeData" autofocus/></td>';
                        }
                    } else { 
                        temp1 += '<td class="dotDataList" data-point="' + curentPointP[j].point + '" ><lable class="dataLBox"></lable><input type="text" class="changeData" autofocus/></td>';
                    }
                }
            }
        }
        $('.dotDataTa').html('').append('<tr>' + temp + '</tr>');
        for (var k = 0; k < 12; k++) {
            temp2 += '<tr class="timeRow' + k + ' timeRow">';
            temp2 += temp1;
            temp2 += '</tr>';
        }
        $('.dotDataTa').append(temp2);
        var q = 0
        for (var k = 0; k < 12; k++) {
            var $timeSp = $('.timeSp').eq(k);
            if (q < 10) {
                $timeSp.html('0' + q + ':00');
                $timeSp.parent('.timeRow').attr('data-time', '0' + q + ':00');
            } else {
                $timeSp.html(q + ':00').attr('data-time', q + ':00');
                $timeSp.parent('.timeRow').attr('data-time', q + ':00');
            }
            q += 2;
        }
        var selectTime = $('#datetimepicker input').val();
        var currentTime = new Date().format('yyyy-MM-dd');
        var data = (selectTime ? selectTime : currentTime) + ' 00:00:00';
        var endTime = (selectTime === currentTime) ? new Date().format('yyyy-MM-dd HH:mm:ss') : (selectTime + ' 23:00:00');
        WebAPI.post('/get_history_data_padded_reduce', {
            projectId: 200,
            pointList: pointArr,
            timeStart: data,
            timeEnd: endTime,
            timeFormat: "h1"
        }).done(function (result) {
            if (result.error) { return;}
            var data = result.data;
            var timeList = result.timeStamp;
            for (var item in data) {
                var dataList = data[item];
                for (var i = 0, len = dataList.length; i < len; i++) {
                    var timeLog = timeList[i].split(' ')[1].substring(0, 5);
                    var dataShow = '';
                    if (item.substring(item.length - 1, item.length - 5) === 'OnOf') {
                        dataShow = (dataList[i] === 1) ? '开' : '关';
                    } else {
                        dataShow = dataList[i];
                    }
                    $('.timeRow[data-time="' + timeLog + '"]').find('.dotDataList[data-point="' + item + '"] .dataLBox').text(dataShow);
                }
            }
        });
        //td点击时显示输入框
        $('.dotDataList').off('click').click(function () {
            var $this = $(this);
            if (!$this.hasClass('inputActive')) {
                var $sibDataList = $('.dotDataList.inputActive');
                var $sibInputData = $sibDataList.find('.changeData');
                //$sibInputData.attr('autofocus', false);
                $sibDataList.find('.dataLBox').show().text($sibInputData.val());
                $sibInputData.hide();
                $sibDataList.removeClass('inputActive');
                $this.addClass('inputActive');
            }
            var $lableData = $this.find('.dataLBox');
            var $inputData = $this.find('.changeData');
            $inputData.show().val($lableData.text());//.attr('autofocus', true);
            $inputData.focus();
            $lableData.hide();
        });
        //tab键事件
        $('.changeData').keydown(function (e) {
            if (e.keyCode === 9) {
                var $this = $(this);
                var $currentDotList = $this.parent('.dotDataList');
                var $currentInput = $currentDotList.find('.changeData');
                if ($this.parent('.dotDataList').next('.dotDataList').length > 0) {
                    var $nextDotList = $this.parent('.dotDataList').next('.dotDataList');
                    var $nextLable = $nextDotList.find('.dataLBox');
                    $currentDotList.removeClass('inputActive');
                    $nextDotList.addClass('inputActive');
                    $currentDotList.find('.dataLBox').show().text($currentInput.val());
                    $currentInput.hide();
                    $nextDotList.find('.changeData').show().val($nextLable.text());
                    $nextLable.hide();
                } else {
                    $currentDotList.find('.dataLBox').show().text($currentInput.val());
                    $currentInput.hide();
                    $currentDotList.removeClass('inputActive');
                }
            }

        });
        //当输入框失去焦点事件
        $('.changeData').blur(function () {
            var $inputData = $(this);
            var $lableData = $inputData.parent().find('.dataLBox');
            var data = $inputData.val();
            if (isNaN(data)) {
                alert('请输入数字类型！');
                $lableData.show().text('');
            } else { 
                $lableData.show().text(data);
            }
            $inputData.hide();
            if (data) {
                var IntTimeStr = $inputData.parents('.timeRow').find('.timeSp').text();
                var IntTime = parseInt(IntTimeStr.split(':')[0]);
                var nowIntTimeStr = new Date().format('HH:mm:ss');
                var nowIntTime = parseInt(nowIntTimeStr.split(':')[0]);
                var pointName = $inputData.parent('.dotDataList').attr('data-point');
                var pointArr = [];
                var valueArr = [];
                var isTimeRe = false;
                if ((IntTime === nowIntTime) || ((nowIntTime%2!==0)&&IntTime < nowIntTime && (IntTime === (nowIntTime - 1)))) {
                    if (_this.timeData&&_this.timeData.point.length>0) {
                        for (var i = 0, len = _this.timeData.point.length; i < len; i++) {
                            if (_this.timeData.point[i] === pointName) {
                                isTimeRe = true;
                                _this.timeData.value[i] = data;
                            }
                        }
                        if (!isTimeRe) {
                            _this.timeData.point.push(pointName);
                            _this.timeData.value.push(data);
                        }
                    } else {
                        pointArr.push(pointName);
                        valueArr.push(data);
                        _this.timeData = {
                            projId: 200,
                            point: pointArr,
                            value: valueArr
                        }
                    }
                }
                var pointData = {
                    projId: 200,
                    pointName: pointName,
                    pointValue:data,
                    timeAt: selectTime + ' ' + IntTimeStr + ':00'
                };
                if (_this.requestData &&_this.requestData.saveList&& _this.requestData.saveList.length !== 0) {
                    var saveList = _this.requestData['saveList'];
                    var isExit = 0;
                    for (var i = 0, len = saveList.length; i < len;i++){
                        if (saveList[i].pointName === pointData.pointName && saveList[i].timeAt === pointData.timeAt && saveList[i].projId === pointData.projId) {
                            isExit = 1;
                            saveList[i].pointValue = data;
                        }
                    }
                    if (!isExit){
                        saveList.push(pointData);
                    }
                } else { 
                    _this.requestData = { saveList: [] };
                    _this.requestData.saveList.push(pointData);
                }
            }
        });
        //当select选取改变时
        $('.dotDataListOpen').change(function () {

        });
    };
    DotState.prototype.close = function () {
        _this.container = null;
        _this.requestData = null;
        _this.timeData = null;
    };
    return new DotState().show();
}());