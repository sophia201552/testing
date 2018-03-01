var DotState = (function(){
    var _this;
    function DotState() {
        _this = this;
        _this.timeData = undefined;
    }
    DotState.prototype.show = function () {
        WebAPI.get('/static/app/Benz/dotInput/views/dotState.html').done(function (resultHtml) {
            _this.container = $('#dotState');
            WebAPI.get('/static/app/Benz/dotInput/data/data.json').done(function (result) {
                var reslutData = eval(result);
                var $dotStateListBox = $('#dotStateListBox');
                var temp = '';
                var pointArr = [];
                for (var i = 0, len = reslutData.length; i < len; i++) {
                    var item = reslutData[i];
                    if (item.attr[0].isSticked) {
                        var dataName = (item.attr.length === 1) ? (item.attr[0].point) : (item.attr[0].point.split('_')[0]);
                        pointArr.push(item.attr[0].point);
                        var springM = '';
                        if (item.attr[0].point === 'GSHP401_SeasonMode') {
                            springM = '(冬:0,夏:1)';
                        }
                        temp += '<div class="dotSingle clearfix">\
                            <div class="col-sm-4 dotName">\
                                <div class="dot-name" data-name="' + dataName + '">' + item.name + springM + '</div>\
                            </div>\
                            <div class="col-sm-4 text-center curState ' + item.attr[0].point + '" data-point="' + item.attr[0].point + '"></div>\
                            <div class="col-sm-4 dotBtnListBox">\
                                <div class="dot-open-close"><span class="dotBtnBox"><div  class="dotBtn dot-close btn-danger btn" data-type="1" data-point="' + item.attr[0].point + '" >' + item.attr[0].enum[1] + '</div><div class="dotBtn dot-open btn btn-success" data-type="0" data-point="' + item.attr[0].point + '" >' + item.attr[0].enum[0] + '</div></span></div>\
                            </div>\
                        </div>';
                    }
                }
                $dotStateListBox.append(temp);
                var postData = {
                    proj: 200,
                    pointList: pointArr
                }
                WebAPI.post('/get_realtimedata', postData).done(function (resultData) {
                    var stateStr = '';;
                    for (var i = 0, len = resultData.length; i < len; i++) {
                        if (resultData[i].value === '1') {
                            if (resultData[i].name === 'GSHP401_SeasonMode') {
                                stateStr = '夏季';
                            } else {
                                stateStr = '开';
                            }
                        } else if (resultData[i].value === '0') {
                            if (resultData[i].name === 'GSHP401_SeasonMode') {
                                stateStr = '冬季';
                            } else {
                                stateStr = '关';
                            }
                        } else {
                            stateStr = '-'
                        }
                        $('.curState.' +resultData[i].name).text(stateStr);
                    }
                });
                _this.attEvent();
            });
        });
    };
    DotState.prototype.attEvent = function () {
        $('.dotSingle .dotName').off('click').click(function () {
            var id = $(this).find('.dot-name').attr('data-name');
            location.href = '/static/app/Benz/dotInput/views/dotDetail.html?id='+id;
        });
        $('.dotBtn').off('click').click(function (e) {
            e.stopPropagation();
            var dataType = $(this).attr('data-type');
            var pointName = $(this).attr('data-point');
            var isTimeRe = false;
            var pointArr = [];
            var valueArr = [];
            var stateStr = '';
            var runS = '';
            var $currentState = $(this).parents('.dotBtnListBox').siblings('.curState');
            if (_this.timeData && _this.timeData.point.length > 0) {
                for (var i = 0, len = _this.timeData.point.length; i < len; i++) {
                    if (_this.timeData.point[i] === pointName) {
                        isTimeRe = true;
                        _this.timeData.value[i] = dataType;
                    }
                }
                if (!isTimeRe) {
                    _this.timeData.point.push(pointName);
                    _this.timeData.value.push(dataType);
                }
            } else {
                pointArr.push(pointName);
                valueArr.push(dataType);
                _this.timeData = {
                    projId: 200,
                    point: pointArr,
                    value: valueArr
                }
            }
            if (pointName !== 'GSHP401_SeasonMode') {
                runS = (dataType === '1') ? '开启' : '关闭';
                stateStr = (dataType === '1') ? '开' : '关';
            } else {
                runS = (dataType === '1') ? '夏季' : '冬季';
                stateStr = (dataType === '1') ? '夏季' : '冬季';
            }
            var equipment = $(this).parents('.dotSingle').find('.dot-name').text();
            infoBox.confirm('请确认' + equipment + '设备是否需要' + runS, function () {
                WebAPI.post('/set_mutile_realtimedata_by_projid', _this.timeData).done(function (data) {
                    if (data === 'success') {
                        alert('设备已经' + runS);
                        $currentState.text(stateStr);
                    }
                });
            })

        });
    };
    DotState.prototype.close = function () {
        _this.container = null;
        _this.timeData = null;
    };
    return new DotState().show();
}());