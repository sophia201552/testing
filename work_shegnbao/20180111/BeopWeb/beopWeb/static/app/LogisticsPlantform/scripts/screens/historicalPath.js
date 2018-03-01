var HistoricalPath = (function() {
    function HistoricalPath(id) {
        this.id = id;

        this.$container = $('#divMap');
        this.endTime = new Date().format('yyyy-MM-dd 23:59');
        this.startTime = new Date().format('yyyy-MM-dd 00:00');
        this.getTimes = new Date(this.endTime).getTime() - new Date(this.startTime).getTime();

        this.map = undefined;
        this.stopPonit = undefined;
        this.myIcon = undefined;
        this.carMk = undefined;
        this.label = undefined;
        this.carArr = [];
        this.animationArr = [];

        this.startPonit = undefined;
        this.endPoint = undefined;
        this.pathPoints = undefined;
        this.timeArr = undefined;

        this.isRunning = true;
        this.isStop = false;

        this.isMouseUp = false;

    }
    HistoricalPath.prototype = {
        show: function() {
            this.layout();
            this.getData(this.startTime, this.endTime);
        },
        layout: function() {
            var _this = this;
            WebAPI.get('/static/app/LogisticsPlantform/views/historicalPath.html').done(function(result) {
                var dom = `<div class="timeInput">
                                <div>
                                    <div class="startTime">
                                        <label>开始时间</label>
                                        <input size="20" type="text" class="form_datetime" value="${_this.startTime}">
                                    </div>
                                    <div class="endTime">
                                        <label>结束时间</label>
                                        <input size="20" type="text" class="form_datetime" value="${_this.endTime}">
                                    </div>
                                    <button class="selectBtn btn btn-success">查询</button>
                                </div>
                                <button class="backMap btn btn-primary">回到地图</button>
                            </div>
                            <div id="historyPathMap"></div>
                            <div class="timeSlider">
                                <button class="status stop btn btn-primary">暂停</button>
                                <div>
                                    <span class="currentStartDate">${_this.startTime}</span>
                                    <input type="range" value="0" max="2017-03-03 12:00:00" min="2016-12-12 12:00:00">
                                    <span class="currentEndDate" style="padding-left:10px;">${_this.endTime}</span>
                                </div>
                            </div>
                            <div class="gpsInfo">
                                <div class="head">
                                    <span>时间</span>
                                    <span>LNG</span>
                                    <span>LAT</span>
                                </div>
                                <div class="gpsCon"></div>   
                            </div>`;
                _this.$container.html(result);
                _this.$container.find('.historicalPath').append($(dom));
                _this.$container.find('.form_datetime').datetimepicker({
                    startView: '0',
                    minView: '0',
                    format: "yyyy-mm-dd hh:ii",
                    autoclose: true
                });

                _this.attatchEvents();
            })
        },
        //重写导航事件
        onNavPointClick: function(point) {
            if (point.length === 0) {
                return;
            } else {
                this.id = point[0]._id;
                $(this.$container).find('[type=range]').val(0);
                this.isRunning = true; //加入小车
                this.isStop = false; //运行动画
                this.isMouseUp = false;
                var startTime = $('.startTime input').val();
                var endTime = $('.endTime input').val();
                this.getData(startTime, endTime);
            }
        },
        renderHistoricalPath: function(obj) {
            var _this = this;
            $('#historyPathMap').html('');
            var pathPoints, startPonit, endPoint;

            pathPoints = obj.pathPoints;
            this.pathPoints = pathPoints;
            startPonit = pathPoints[0];
            endPoint = pathPoints[pathPoints.length - 1];

            this.map = new BMap.Map("historyPathMap");
            this.map.centerAndZoom(new BMap.Point(startPonit.lng, startPonit.lat), 15);
            this.map.setMapStyle(mapStyle);
            var opts = { type: BMAP_NAVIGATION_CONTROL_SMALL }
            this.map.addControl(new BMap.NavigationControl(opts));
            this.map.enableScrollWheelZoom(true);
            this.startPonit = new BMap.Point(startPonit.lng, startPonit.lat);
            this.endPoint = new BMap.Point(endPoint.lng, endPoint.lat);

            var driving = new BMap.DrivingRoute(this.map, {
                renderOptions: { map: this.map, autoViewport: true },
                onMarkersSet: function(routes) {
                    _this.map.removeOverlay(routes[0].marker); //删除API自带起点  
                    _this.map.removeOverlay(routes[1].marker); //删除API自带终点  
                }
            });
            //画一条路线
            var arr = [];
            for (var i = 0, length = pathPoints.length; i < length; i++) {
                var point = new BMap.Point(pathPoints[i].lng, pathPoints[i].lat);
                arr.push(point);
            }
            var poly = new BMap.Polyline(arr, {
                strokeWeight: '6',
                strokeColor: '#fdb106',
            });
            _this.map.addOverlay(poly);
            var start = new BMap.Label('起点', {
                position: this.startPonit,
                offset: new BMap.Size(-30, -20)
            });
            start.setStyle({
                color: "#ffffff",
                border: '1px solid #4da5ff',
                background: 'rgba(0,150,255,.8)',
                fontSize: "12px",
                width: '70px',
                maxWidth: 'inherit',
                height: "20px",
                fontFamily: "微软雅黑",
                borderTopRightRadius: '10px',
                borderBottomLeftRadius: '10px',
                textAlign: 'center'
            })
            _this.map.addOverlay(start);
            var end = new BMap.Label('终点', {
                position: this.endPoint,
                offset: new BMap.Size(-15, -15)
            });
            end.setStyle({
                color: "#ffffff",
                border: '1px solid #ff573a',
                background: 'rgba(205,57,31,.8)',
                fontSize: "12px",
                width: '70px',
                maxWidth: 'inherit',
                height: "20px",
                fontFamily: "微软雅黑",
                borderTopRightRadius: '10px',
                borderBottomLeftRadius: '10px',
                textAlign: 'center'
            })
            _this.map.addOverlay(end);

            _this.run(_this.startPonit, 0);
        },
        run: function(startPonit, index) {
            var _this = this;
            var driving = new BMap.DrivingRoute(_this.map); //驾车实例
            driving.search(startPonit, _this.endPoint);
            var promise = $.Deferred();
            driving.setSearchCompleteCallback(function() {
                var startPosition, labelInfo;
                if (_this.isRunning) {
                    if (_this.isMouseUp) { //鼠标抬起
                        startPosition = _this.pathPoints[index];
                        if (index === _this.pathPoints.length - 1 || index === 0) {
                            labelInfo = '停止';
                        } else {
                            var lastPoint = _this.pathPoints[index - 1];
                            var nextPoint = _this.pathPoints[index + 1];
                            if (lastPoint.lng === startPosition.lng && lastPoint.lat === startPosition.lat && nextPoint.lng === startPosition.lng && nextPoint.lat === startPosition.lat) {
                                labelInfo = '停止';
                            } else {
                                labelInfo = '行驶中...';
                            }
                        }
                    } else {
                        startPosition = _this.pathPoints[0];
                        labelInfo = '停止';
                    }
                    var opts = {
                        position: new BMap.Point(startPosition.lng, startPosition.lat),
                        offset: new BMap.Size(-30, -60)
                    }
                    _this.label = new BMap.Label(labelInfo, opts);
                    _this.label.setStyle({
                        color: "#ffffff",
                        background: 'rgba(67, 155, 41, 0.6)',
                        border: '1px solid #439b29',
                        fontSize: "12px",
                        width: '70px',
                        maxWidth: 'inherit',
                        height: "20px",
                        fontFamily: "微软雅黑",
                        borderTopRightRadius: '10px',
                        borderBottomLeftRadius: '10px',
                        textAlign: 'center'
                    });
                    //小车图片
                    _this.myIcon = new BMap.Icon("../static/images/guangming/milkTruck.png", new BMap.Size(60, 60), {
                        imageOffset: new BMap.Size(0, 0),
                        imageSize: new BMap.Size(60, 60)
                    });
                    _this.carMk = new BMap.Marker(new BMap.Point(startPosition.lng, startPosition.lat), { icon: _this.myIcon });
                    //清除之前的小车
                    for (var j = 0, jLength = _this.carArr.length; j < jLength; j++) {
                        _this.map.removeOverlay(_this.carArr[j]);
                    }
                    _this.carArr = [];
                    _this.map.addOverlay(_this.label);
                    _this.map.addOverlay(_this.carMk);
                    _this.carArr = [_this.label, _this.carMk];
                }
                promise.resolve();
            })
            promise.done(function() {
                if (!_this.isStop) {
                    paths = _this.pathPoints.length;
                    i = 0;
                    startTime = undefined;
                    lastGps = undefined;
                    nextGps = undefined;
                    var runningAnimation = requestAnimationFrame(_this.resetMkPoint.bind(_this));
                    _this.animationArr.push(runningAnimation);
                }
            })
        },
        resetMkPoint: function(time) {
            if (time === undefined) time = Date.now();
            if (startTime === undefined) startTime = time;
            if (i === 0) {
                lastGps = this.pathPoints[0];
                nextGps = this.pathPoints[i + 1];
            } else if (i === paths - 1) {
                lastGps = this.pathPoints[i - 1];
                nextGps = this.pathPoints[i];
            } else {
                lastGps = this.pathPoints[i - 1];
                nextGps = this.pathPoints[i + 1];
            }
            var currentGps = new BMap.Point(this.pathPoints[i].lng, this.pathPoints[i].lat);
            if (i < paths - 1) { //有几个gps的点  就循环几次时间
                if (lastGps.lng === this.pathPoints[i].lng && lastGps.lat === this.pathPoints[i].lat && nextGps.lng === this.pathPoints[i].lng && nextGps.lat === this.pathPoints[i].lat) { //当前的值 gps位置等于 上一次和下一次的位置 为停止状态
                    this.label.setContent('停止');
                } else {
                    this.label.setContent('行使中...');
                }
                i++;
                this.stopPonit = currentGps;
                this.carMk.setPosition(currentGps);
                this.label.setPosition(currentGps);
                var runningAnimation = requestAnimationFrame(this.resetMkPoint.bind(this));
                this.animationArr.push(runningAnimation);
            } else if (i === paths - 1) {
                this.label.setContent('停止');
            }
        },
        getData: function(startTime, endTime) {
            var _this = this;
            var pointsArr = [_this.id + '_LAT', _this.id + '_LNG']
            var postData = {
                projectId: AppConfig.projectId,
                pointList: pointsArr,
                timeStart: startTime + ':00',
                timeEnd: endTime + ':00',
                timeFormat: 'm5'
            };
            WebAPI.post('/get_history_data_padded', postData).done(function(rs) {
                if (rs.length === undefined) {
                    return;
                }
                _this.timeArr = [];
                var gpsArr = [];
                for (var i = 0, length = rs.length; i < length; i++) {
                    if (rs[i].name.indexOf('LAT') !== -1) {
                        var lngArr = rs[i].history;
                    } else if (rs[i].name.indexOf('LNG') !== -1) {
                        var latArr = rs[i].history;
                    }
                }
                for (var j = 0, jLength = lngArr.length; j < jLength; j++) {
                    if(latArr[j].value !== null && lngArr[j].value !== null){
                         _this.timeArr.push(lngArr[j].time);
                        var obj = {
                            lng: latArr[j].value,
                            lat: lngArr[j].value,
                            time: lngArr[j].time
                        }
                        gpsArr.push(obj);
                    }
                }
                _this.pathPoints = gpsArr;
                var obj = {
                    pathPoints: gpsArr
                }
                _this.renderTableData(gpsArr);
                _this.renderHistoricalPath(obj);
            })
        },
        renderTableData: function(gpsArr) {
            var gpsDom = '';
            for (var i = 0, length = gpsArr.length; i < length; i++) {
                var time = gpsArr[i].time.split(' ')[1];
                gpsDom += `<div>
                            <span>${time}</span>
                            <span>${gpsArr[i].lng}</span>
                            <span>${gpsArr[i].lat}</span>
                        </div>`
            }
            this.$container.find('.gpsInfo .gpsCon').html(gpsDom);
        },
        attatchEvents: function() {
            var _this = this;
            //查询
            this.$container.off('click.select').on('click.select', '.selectBtn', function() {
                var startTime = $('.startTime input').val();
                var endTime = $('.endTime input').val();
                _this.getTimes = new Date(endTime).getTime() - new Date(startTime).getTime();
                _this.flag = true;
                //下面时间抽轴的变化
                $(_this.$container).find('.currentStartDate').text(startTime);
                $(_this.$container).find('.currentEndDate').text(endTime);
                $(_this.$container).find('.status').removeClass().addClass('status stop btn btn-primary').html('暂停');
                $(_this.$container).find('[type=range]').val(0);

                _this.isRunning = true; //加入小车
                _this.isStop = false; //运行动画
                _this.isMouseUp = false;
                //清掉所有的动画
                for (var a = 0, aLength = _this.animationArr.length; a < aLength; a++) {
                    cancelAnimationFrame(_this.animationArr[a]);
                }
                _this.animationArr = [];
                _this.getData(startTime, endTime);
            });
            this.$container.off('mousedown.select').on('mousedown.select', '.timeSlider input', function() {
                var $parent = $(this).closest('div');
                $(this).off('mousemove').on('mousemove', function(e) {
                    $('.tooltipTime').remove();
                    var val = $(this).val();
                    var times = val / 100 * _this.getTimes;
                    var currentTime = new Date(new Date(_this.startTime).getTime() + times).format('yyyy-MM-dd HH:mm');
                    var left = val / 100 * $(this).width() + 70;
                    var dom = `<span class="tooltipTime" style="left:${left}px;">${currentTime}</span>`;
                    $parent.append($(dom));
                })
            });
            this.$container.off('mouseup.select').on('mouseup.select', '.timeSlider input', function() {
                var val = $(this).val();
                var times = val / 100 * _this.getTimes;
                var currentTime = new Date(new Date(_this.startTime).getTime() + times).format('yyyy-MM-dd HH:mm');
                _this.isRunning = true; //加入小车
                _this.isStop = true; //不运行动画
                _this.isMouseUp = true;
                //清掉所有的动画
                for (var a = 0, aLength = _this.animationArr.length; a < aLength; a++) {
                    cancelAnimationFrame(_this.animationArr[a]);
                }
                _this.animationArr = [];
                for (var j = 0, jLength = _this.timeArr.length; j < jLength; j++) {
                    if (currentTime + ':00' === _this.timeArr[j]) {
                        var index = j;
                        break;
                    }
                }
                _this.run(_this.startPonit, index);
            });
            //暂停
            this.$container.off('click.status').on('click.status', '.status', function() {
                if ($(this).hasClass('stop')) {
                    $(this).removeClass('stop').addClass('start').html('开始');
                    _this.isRunning = false; //不加入小车
                    _this.isStop = true; //不运行动画
                    //清掉所有的动画
                    for (var a = 0, aLength = _this.animationArr.length; a < aLength; a++) {
                        cancelAnimationFrame(_this.animationArr[a]);
                    }
                    _this.animationArr = [];
                    _this.run(_this.stopPonit);
                } else {
                    $(this).removeClass('start').addClass('stop').html('暂停');
                    _this.isStop = false;
                    _this.isRunning = false;
                    _this.resetMkPoint();
                }
            });
            this.$container.off('click.backMap').on('click.backMap', '.backMap', function() {
                Router.empty().to(MapScreen);
            });
        }
    };
    return HistoricalPath;
})();