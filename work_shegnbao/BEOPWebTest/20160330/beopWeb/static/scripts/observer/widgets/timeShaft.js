/// <reference path="../../lib/jquery-2.1.4.js" />
var TimeShaft = (function () {
    function TimeShaft(_parent) {
        this.parent = _parent;
        this.containerHeight = 100;
        this.pointList = undefined;

        this.timeShaftLabel = undefined;
        this.dictData = undefined;

        this.startTime = undefined;
        this.endTime = undefined;
        this.tbCurrentTime = undefined;
        this.playHandle = undefined;
        this.isPlaying = false;
        this.playInterval = 1000;

        this.$inputInterval = undefined;

        var _this = this;
        this.defer = $.Deferred();
    }

    TimeShaft.prototype = {
        show: function () {
            var _this = this;
            WebAPI.get("/static/views/observer/widgets/timeShaft.html").done(function (resultHtml) {
                _this.resultHtml = resultHtml;
                _this.defer.resolve();
            });

            $.when(this.defer).done(function () {
                _this.parent.toolContainer.html(_this.resultHtml);
                _this.parent.toolContainer.animate({ height: _this.containerHeight + 'px' }, 200);
                _this.init();
                I18n.fillArea(_this.parent.toolContainer);
            });
        },

        close: function () {
            if (this.parent.toolContainer) this.parent.toolContainer.html('');
            this.parent = null;
            this.containerHeight = null;
            this.pointList = null;
            this.timeShaftLabel = null;
            this.dictData = null;
            this.tbCurrentTime = null;
            if (this.playHandle) clearInterval(this.playHandle);
            this.playHandle = null;
            this.resultHtml = null;
        },

        init: function () {
            var _this = this;

            this.tbCurrentTime = document.getElementById('txtCurrentTime');//帧后时间

            this.$inputInterval = $('#inputInterval');//时间选择5分钟...

            WebAPI.get("/get_history_data/getMinPeriod/" + AppConfig.projectId).done(function (dataSrc) {
                if (undefined == dataSrc)
                    return;

                if (dataSrc['minPeriod'] != 'm1')
                    _this.$inputInterval.children(':first').css('display', 'none');
                else
                    _this.$inputInterval.children(':first').css('display', 'block');
            });

            var now = new Date();
            this.startTime = new Date(now - 86400000);
            this.endTime = now;
            $("#txtTimeStart").val(this.startTime.format("yyyy-MM-dd HH:mm"));
            $("#txtTimeEnd").val(this.endTime.format("yyyy-MM-dd HH:mm"));
            _this.refreshCalendar();//改变选择后table对应时间
            // 修改当select值为月时日历控件显示年
            $("#select_id option[index='0']").prop("selected", 'selected');
            _this.$inputInterval.off('change').change(function () {
                _this.refreshCalendar();
            });
            $('#divFramesConfig a[elapse]').off('click').click(function (e) {//今天、明天..点击事件
                var timeBaseline, timeFlags;
                timeFlags = e.currentTarget.attributes['elapse'].value.split(',');
                if(timeFlags.length == 2){
                    timeBaseline = +new Date();
                    timeBaseline = timeBaseline + (new Date()).getTimezoneOffset() * 60000 - timeBaseline % 86400000;
                    var end = new Date(timeBaseline + parseInt(timeFlags[1]) - 1000);
                    var now = new Date();
                    _this.endTime =  end > now ? now : end;
                    _this.startTime = new Date(timeBaseline + parseInt(timeFlags[0]));
                }else{
                    var time = new Date();
                    if(timeFlags[0] == 'thisWeek'){
                        time.setDate(time.getDate() - time.getDay());
                        time.setHours(0);
                        time.setMinutes(0);
                        time.setSeconds(0);
                        _this.endTime =  new Date();
                        _this.startTime = time;
                    }else if(timeFlags[0] == 'lastWeek'){
                        time.setDate(time.getDate() - time.getDay() -7);
                        time.setHours(0);
                        time.setMinutes(0);
                        time.setSeconds(0);
                        _this.startTime = time;
                        _this.endTime =  new Date(time.getTime() + 86400000*7);
                    }
                }
                _this.requestData(_this.startTime, _this.endTime);
            });

            $('#btnRquestHistory').off('click').click(function (e) {
                _this.startTime = $("#txtTimeStart").val().toDate();
                _this.endTime = $("#txtTimeEnd").val().toDate();
                _this.requestData(_this.startTime, _this.endTime);
            });

            $("#btnPlay").off('click').click(function (e) {
                if (_this.isPlaying) {
                    _this.stop();
                } else {
                    _this.play();
                }
            });

            $("#btnPrevious").off('click').click(function (e) {
                var element = $('#tabFrames .td-frame-selected');
                var label = $('#tabFrames .td-frame-selected').attr('title');
                if (label && label != '') {
                    var index = _this.timeShaftLabel.indexOf(label);
                    if (index > 0) {
                        _this.setActive(element.prev());
                        _this.renderParentScreen(_this.timeShaftLabel[index - 1]);
                        if(index <2){
                            this.classList.add('disabled');
                        }
                        if (index <= (_this.timeShaftLabel.length - 1)) {//修改点击上个按钮时,下个按钮不可用的情况
                            $("#btnNext").removeClass('disabled');
                        }
                    }
                }
            });

            $("#btnNext").off('click').click(function (e) {
                var element = $('#tabFrames .td-frame-selected');
                var label = $('#tabFrames .td-frame-selected').attr('title');
                if (label && label != '') {
                    var index = _this.timeShaftLabel.indexOf(label);
                    if (index > -1 && index < (_this.timeShaftLabel.length - 1)) {
                        _this.setActive(element.next());
                        _this.renderParentScreen(_this.timeShaftLabel[index + 1]);
                        if(index > (_this.timeShaftLabel.length - 3)){
                            this.classList.add('disabled');
                        }
                        if (index >= 0) {//修改点击下个按钮时,上个按钮不可用的情况
                            $('#btnPrevious').removeClass('disabled');
                        }
                    }
                }
            });

            var $intervalTimes = $('#intervalTimes');
            $("#btnTime").off('click').click(function (e) {
                $intervalTimes.prev('div').hide();
                $intervalTimes.show();
            });
            $intervalTimes.children('span').off('click').click(function(){
                $intervalTimes.prev('div').show();
                $intervalTimes.hide();
                _this.playInterval = parseInt($(this).attr('time'))*1000;
                if(_this.isPlaying){
                    _this.stop();
                    _this.play();
                }
            });

            $("#btnConfig").click(function (e) {
                $('#divFramesConfig').show();
                $('#divPaneFrames').hide();
            });
        },

        showFramePane: function () {
            $('#divFramesConfig').hide();
            $('#divPaneFrames').show();
        },

        requestData: function (startTime, endTime, screen, isPlayTheCenterFrame) {
            var _this = this;

            if (startTime > endTime) {
                alert('Time range error.')
                return;
            }
            this.startTime = startTime;
            this.endTime = endTime;

            _this.refreshCalendar();
            var timeStepSelectedValue = _this.$inputInterval ? _this.$inputInterval.val() : 'm5';
            var data = {
                projectId: AppConfig.projectId,
                timeStart: startTime.format("yyyy-MM-dd HH:mm:ss"),
                timeEnd: endTime.format("yyyy-MM-dd HH:mm:ss"),
                timeFormat: timeStepSelectedValue,//通过提交timeFormat得知是5分钟，...
                pointList: Object.keys(screen ? screen.dictRefreshMap : this.parent.dictRefreshMap)
            };

            Spinner.spin(ElScreenContainer);
            WebAPI.post("/get_history_data_padded_reduce", data).done(function (dataSrc) {
                if (dataSrc == undefined || !dataSrc.timeStamp) {
                    alert('no history data');
                    return;
                }
                
                if (screen) {
                    _this.renderCurrentMoment(screen, dataSrc);
                } else {
                    _this.initData(dataSrc);
                    _this.initTimeShaft();
                    $('#divFramesConfig').hide();
                    $('#divPaneFrames').show();

                    isPlayTheCenterFrame && ToolCurrent.playTheCenterMoment();
                }
                
            }).always(function () {
                Spinner.stop();
            });
        },

        returnToMoment: function (time, screen) {
            var screen = screen ? screen : this.parent;
            this.requestData(time, time, screen);
        },

        requestDataForCurrentMoment: function (screen) {
            var time = this.tbCurrentTime.value.toDate();
            this.requestData(time, time, screen);
        },

        renderCurrentMoment: function (screen, dataSrc) {
            var arrData = [];
            for (var key in dataSrc.data) {
                arrData.push({ name: key, value: dataSrc.data[key][0] });
            }
            screen.renderData(arrData);
        },

        initData: function (dataSrc) {
            if (undefined == dataSrc.data) return;
            this.timeShaftLabel = new Array();
            this.dictData = new Object();

            if (this.timeShaftLabel.length == 0) {
                //init data struct
                for (var i = 0, len = dataSrc.timeStamp.length; i < len; i++) {
                    var time = dataSrc.timeStamp[i].toDate().format("yyyy-MM-dd HH:mm");
                    this.timeShaftLabel.push(time);
                    this.dictData[time] = new Array();
                }
            }

            //init data
            var name, val, time;
            for (var key in dataSrc.data) {
                name = key;

                for (var i = 0, len = dataSrc.timeStamp.length; i < len; i++) {
                    var time = dataSrc.timeStamp[i].toDate().format("yyyy-MM-dd HH:mm");
                    this.dictData[time].push({ name: name, value: dataSrc.data[key][i] });
                }
            }
        },
        planTdColSpan: function () {//计算数据回放第一行不同时段的个数,用于合并单元格
            var _this = this;
            var labels = this.timeShaftLabel;
            var iptIntlVal = _this.$inputInterval.val();
            if (iptIntlVal == 'm5') {
                var tempMinute = '';
                this.dictMinute = {};
                for (var i = 0; i < labels.length; i++) {
                    var labelMinute = labels[i];
                    if (tempMinute != labelMinute.split(':')[0]) {//.substring(0, 13)
                        tempMinute = labelMinute.split(':')[0];
                        this.dictMinute[tempMinute] = 1;
                    } else {
                        this.dictMinute[tempMinute]++;
                    }
                }
            } else if (iptIntlVal == 'h1') {
                var tempHour = '';
                this.dictHour = {};
                for (var i = 0; i < labels.length; i++){
                    var labelHour = labels[i];
                    if (tempHour != labelHour.split(' ')[0]) {//.substring(0, 10)
                        tempHour = labelHour.split(' ')[0];
                        this.dictHour[tempHour] = 1;
                    } else {
                        this.dictHour[tempHour]++;
                    }
                }
            } else if (iptIntlVal == 'd1') {
                var tempDay = '';
                this.dictDay = {};
                for (var i = 0; i < labels.length; i++) {
                    var labelDay = labels[i];
                    var secondHrPost = labelDay.indexOf('-', labelDay.indexOf('-')+1);//或者直接截取0到indexOf()
                    if (tempDay != labelDay.substring(0, secondHrPost)) {//.substring(0, 7)
                        tempDay = labelDay.substring(0, secondHrPost);
                        this.dictDay[tempDay] = 1;
                    } else {
                        this.dictDay[tempDay]++;
                    }
                }
            } else if (iptIntlVal == 'M1') {
                var tempMouth = '';
                this.dictMouth = {};
                for (var i = 0; i < labels.length; i++) {
                    var labelMouth = labels[i];
                    //var firstHrPost = labelMouth.indexOf();
                    if (tempMouth != labelMouth.split('-')[0]) {//.substring(0, 4)
                        tempMouth = labelMouth.split('-')[0];
                        this.dictMouth[tempMouth] = 1;
                    } else {
                        this.dictMouth[tempMouth]++;
                    }
                }
            }
            
        },
        addFirstTd: function (dict, label, trtop, iptIntvlVal) {
            var _this = this;
            var tdContTotal = label.split(':')[0];
            td = document.createElement('td');
            td.className = 'td-border-split';
            $(td).css({ 'white-space': 'nowrap' });
            if (iptIntvlVal == 'm5') {
                td.textContent = tdContTotal + ':00';
            } else if (iptIntvlVal == 'h1') {
                td.textContent = tdContTotal.split(' ')[0];
            } else if (iptIntvlVal == 'd1') {
                td.textContent = tdContTotal.split('-')[0] + '-' + tdContTotal.split('-')[1];
            } else {
                td.textContent = tdContTotal.split('-')[0];
            }
            for(var temp in dict){
                var countTotal = dict[temp];
                if (td.textContent.split(':')[0] == temp) {
                    td.colSpan = countTotal;
                }
            }
            trtop.appendChild(td);
        },
        initTimeShaft: function () {
            var _this = this;
            var trs = document.getElementById('tabFrames').getElementsByTagName('tr');
            var trTop = trs[0], trData = trs[1], trBottom = trs[2], td;
            var iptIntvlVal = _this.$inputInterval.val();
            trTop.innerHTML = ''; trData.innerHTML = ''; trBottom.innerHTML = '';


            this.planTdColSpan();
            for (var i = 0, count = 1, len = this.timeShaftLabel.length; i < len; i++) {
                var label = this.timeShaftLabel[i];
                if (iptIntvlVal == 'm5') {
                    if (this.timeShaftLabel[i] && this.timeShaftLabel[i].split(':')[1] != '00' && i == 0) {
                        this.addFirstTd(this.dictMinute, label, trTop,'m5');
                    }else if ((this.timeShaftLabel[i] && this.timeShaftLabel[i].indexOf(':00') >= 0)) {
                        this.addFirstTd(this.dictMinute, label, trTop, 'm5');
                        count = 0;
                    }
                } else if (iptIntvlVal == 'h1') {
                    if (this.timeShaftLabel[i] && this.timeShaftLabel[i].split(' ')[1] != '00:00' && i == 0) {
                        this.addFirstTd(this.dictHour, label, trTop, 'h1');
                    } else if (this.timeShaftLabel[i] && this.timeShaftLabel[i].indexOf('00:00') >= 0) {
                        this.addFirstTd(this.dictHour, label, trTop, 'h1');
                        count = 0;
                    }
                } else if (iptIntvlVal == 'd1') {
                    if (this.timeShaftLabel[i] && this.timeShaftLabel[i].split('-')[2] != '01 00:00' && i == 0) {
                        this.addFirstTd(this.dictDay, label, trTop, 'd1');
                    }else if (this.timeShaftLabel[i] && this.timeShaftLabel[i].indexOf('01 00:00') >= 0) {
                        this.addFirstTd(this.dictDay, label, trTop, 'd1');
                        count = 0;
                    }
                } else {
                    if (this.timeShaftLabel[i] && (this.timeShaftLabel[i].split('-')[1] + '-' + this.timeShaftLabel[i].split('-')[2]) != '01-01 00:00' && i == 0) {
                        this.addFirstTd(this.dictMouth, label, trTop);
                    } else if (this.timeShaftLabel[i] && this.timeShaftLabel[i].indexOf('01-01 00:00') >= 0) {
                        this.addFirstTd(this.dictMouth, label, trTop);
                        count = 0;
                    }
                    //td = document.createElement('td');
                    //td.colSpan = count;
                    //td.className = 'td-border-split';
                    ///*if (count > 10) */
                    //td.textContent = label.split(':')[0] + ":00";
                    //trTop.appendChild(td);

                    //count = 0;
                }
                td = document.createElement('td');
                td.title = label;
                td.className = 'td-frame';
                if (i == 0) {
                    td.classList.add('td-frame-selected');
                    this.renderParentScreen(label);
                }
                td.onclick = function (e) {
                    var target = e.currentTarget || e.target;
                    _this.setActive($(target));
                    _this.renderParentScreen(target.attributes['title'].value);
                    _this.setBtnStatus();
                };
                trData.appendChild(td);

                td = document.createElement('td');
                td.className = 'td-border-split';
                if (iptIntvlVal == 'm5') {//当是五分钟是第三行显示的内容
                    td.textContent = label.split(':')[1];
                } else if (iptIntvlVal == 'h1') {//是小时的内容
                    var hourThirdTd = label.split(':')[0];
                    td.textContent = hourThirdTd.split(' ')[1].split(':')[0];//.substring(hourThirdTd.length - 2, hourThirdTd.length)
                } else if (iptIntvlVal == 'd1') {//是天的内容
                    var dayThirdTd = label.split(':')[0];
                    td.textContent = dayThirdTd.split('-')[2].split(' ')[0];//substring(8,10)
                    //td.style.textAlign = 'center';
                }else {
                    var dayThirdTd = label.split(':')[0];
                    td.textContent = dayThirdTd.split('-')[1];//.substring(5, 7)
                }
                trBottom.appendChild(td);
                count++;
            }
                this.setBtnStatus();
        },

        renderParentScreen: function (time) {//把点击的当前时间作为参数
            if (undefined == time) {
                return;
            }
            this.tbCurrentTime.value = time;//显示当前点击的时间
            this.parent.renderData(this.dictData[time]);//把所有的时间节点做参数
        },

        play: function () {
            var _this = this;
            this.isPlaying = true;
            var startTimeLabel;
            var selectedFrames = $('#tabFrames .td-frame-selected');
            if (selectedFrames.length > 0) {
                startTimeLabel = selectedFrames.first().attr('title')
            } else {
                startTimeLabel = this.timeShaftLabel[0];
            }

            var index = this.timeShaftLabel.indexOf(startTimeLabel);
            this.playHandle = setInterval(function (e) {
                if (index > _this.timeShaftLabel.length) {
                   //$('#tabFrames td.td-frame:last').addClass('td-frame-selected');
                    _this.stop();
                    
                } else {
                    if (index < _this.timeShaftLabel.length-1){
                    var element = $('#tabFrames .td-frame-selected').removeClass('td-frame-selected').next();
                    //element.scrollParent().scrollLeft(element.offset().left);
                    element.addClass('td-frame-selected');}
                    _this.renderParentScreen(_this.timeShaftLabel[index]);
                    index++;
                }
            }, _this.playInterval);

            //set button status
            $('#btnPlay span').removeClass('glyphicon-play').addClass('glyphicon-pause');
        },

        stop: function () {
            this.isPlaying = false;
            if (this.playHandle) clearInterval(this.playHandle);
            $('#btnPlay span').removeClass('glyphicon-pause').addClass('glyphicon-play');
        },

        setActive: function (jqueryElement) {
            $('#tabFrames .td-frame-selected').removeClass('td-frame-selected').next();
            jqueryElement.addClass('td-frame-selected');
            this.stop();
        },

        //TODO: not stable
        playTheCenterMoment: function () {
            var indexCenter = parseInt(this.timeShaftLabel.length / 2);
            this.setActive($($('#tabFrames .td-frame')[indexCenter]));
            this.renderParentScreen(this.timeShaftLabel[indexCenter]);
        }, 

        setBtnStatus: function(){
            var $btnPre = $('#btnPrevious');
            var $btnNext = $('#btnNext');
            if($('#tabFrames tbody tr:nth-child(2) td:nth-child(1)')[0].className.indexOf('td-frame-selected') > -1){
                $btnPre.addClass('disabled');
            }else{
                $btnPre.removeClass('disabled');
            }

            if($('#tabFrames tbody tr:nth-child(2) td:nth-last-child(1)')[0].className.indexOf('td-frame-selected') > -1){
                $btnNext.addClass('disabled');
            }else{
                $btnNext.removeClass('disabled');
            }
        },

        refreshCalendar: function () {
            var _this = this;
            //$('.form_datetime').datetimepicker('remove');//移除日期时间选择器。同时移除已经绑定的event、内部绑定的对象和HTML元素。
            //$(".form_datetime").datetimepicker({
            //    format: "yyyy-mm-dd hh:ii",
            //    minView: "hour",
            //    autoclose: true,
            //    todayBtn: false,
            //    pickerPosition: "top-right",
            //    initialDate: new Date()
            //    //startDate: this.startTime.format("yyyy-MM-dd HH:mm:ss"),
            //    //endDate: this.endTime.format("yyyy-MM-dd HH:mm:ss")
            //}).off('changeDate').on('changeDate', function (ev) {
            //    var selectTime = (ev.date.valueOf().toDate().toUTCString().replace(' GMT', '')).toDate().getTime();
            //    var time = selectTime - selectTime % (5 * 60 * 1000).toDate().format('yyyy-MM-dd HH:mm');
            //    $('#tabFrames .td-frame[title="' + time + '"]').click();
            //});

            if (_this.$inputInterval && _this.$inputInterval.val() == 'M1') {
                //$(".navbar-left .form_datetime").datetimepicker("update", year + '-01');
                //if ($('#txtTimeStart').off('click').click() || $('#txtTimeEnd').off('click').click()) {
                $('.navbar-left .form_datetime').datetimepicker('remove');
                $(".navbar-left .form_datetime").datetimepicker({
                    format: "yyyy-mm-dd 00:00",
                    minView: "year",
                    autoclose: true,
                    todayBtn: true,
                    pickerPosition: "top-right",
                    startView: 4,
                    initialDate: new Date()
                    // startDate: this.startTime.format("yyyy-MM-dd HH:mm:ss"),
                    // endDate: this.endTime.format("yyyy-MM-dd HH:mm:ss")
                }).off('changeDate').on('changeDate', function (ev) {
                    var selectTime = (ev.date.valueOf().toDate().toUTCString().replace(' GMT', '')).toDate().getTime();
                    var time = selectTime - selectTime % (5 * 60 * 1000).toDate().format('yyyy-MM-dd HH:mm');
                    $('#tabFrames .td-frame[title="' + time + '"]').click();
                });
                //}
            } else {
                $('.form_datetime').datetimepicker('remove');
                $(".form_datetime").datetimepicker({
                    format: "yyyy-mm-dd hh:ii",
                    minView: "hour",
                    autoclose: true,
                    todayBtn: false,
                    pickerPosition: "top-right",
                    initialDate: new Date()
                    //startDate: this.startTime.format("yyyy-MM-dd HH:mm:ss"),
                    //endDate: this.endTime.format("yyyy-MM-dd HH:mm:ss")
                }).off('changeDate').on('changeDate', function (ev) {
                    var selectTime = (ev.date.valueOf().toDate().toUTCString().replace(' GMT', '')).toDate().getTime();
                    var time = selectTime - selectTime % (5 * 60 * 1000).toDate().format('yyyy-MM-dd HH:mm');
                    $('#tabFrames .td-frame[title="' + time + '"]').click();
                });
            }
        }
    };
    return TimeShaft;
})();

//两个自执行语句


var TimeShaftDashboard = (function () {
    function TimeShaftDashboard(_parent) {
        TimeShaft.call(_parent);

        this.parent = _parent;
        this.containerHeight = 100;

        this.timeShaftLabel = undefined;
        this.dictData = undefined;

        this.startTime = undefined;
        this.endTime = undefined;
        this.tbCurrentTime = undefined;

        this.$inputInterval = undefined;

        var _this = this;
        this.defer = $.Deferred();
        WebAPI.get("/static/views/observer/widgets/timeShaft.html").done(function (resultHtml) {
            _this.resultHtml = resultHtml;
            _this.defer.resolve();
        });
    }
    TimeShaftDashboard.prototype = new TimeShaft();

    TimeShaftDashboard.prototype.show = function () {
        var _this = this;
        $.when(this.defer).done(function () {
            _this.parent.toolContainer.html(_this.resultHtml);
            _this.parent.toolContainer.css({ height: _this.containerHeight + 'px' });
            for (var key in _this.parent.listEntity) {
                var echart = _this.parent.listEntity[key].chart;
                if (undefined != echart) {
                    echart.resize();
                }
            }
            _this.init();
            I18n.fillArea(_this.parent.toolContainer);
        });
    };

    TimeShaftDashboard.prototype.requestData = function (startTime, endTime, screen, isPlayTheCenterFrame) {
        var _this = this;

        if (startTime > endTime) {
            alert('Time range error.')
            return;
        }
        this.startTime = startTime;
        this.endTime = endTime;

        _this.refreshCalendar();

        if (undefined == _this.parent.store.dsInfoList) {
            return;
        }
        var dsIdList = [];
        for (var i= 0, len=_this.parent.store.dsInfoList.length; i < len; i++) {
            dsIdList.push(_this.parent.store.dsInfoList[i].id);
        }
        var timeStepSelectedValue = _this.$inputInterval.val();
        var postData = {
            dsItemIds: dsIdList,
            timeStart: startTime.format("yyyy-MM-dd HH:mm:ss"),
            timeEnd: endTime.format("yyyy-MM-dd HH:mm:ss"),
            timeFormat: timeStepSelectedValue
        }

        Spinner.spin(ElScreenContainer);
        WebAPI.post("/analysis/startWorkspaceDataGenHistogram", postData).done(function (dataSrc) {
            if (dataSrc == undefined || !dataSrc.timeShaft) {
                alert('no history data');
                return;
            }

            if (screen) {
                _this.renderCurrentMoment(screen, dataSrc);
            } else {
                _this.initData(dataSrc);
                _this.initTimeShaft();
                $('#divFramesConfig').hide();
                $('#divPaneFrames').show();

                isPlayTheCenterFrame && ToolCurrent.playTheCenterMoment();
            }

        }).always(function () {
            Spinner.stop();
        });
    };

    TimeShaftDashboard.prototype.initData = function (dataSrc) {
        if (undefined == dataSrc.list) return;
        this.timeShaftLabel = new Array();
        this.dictData = new Object();

        if (this.timeShaftLabel.length == 0) {
            //init data struct
            for (var i = 0, len = dataSrc.timeShaft.length; i < len; i++) {
                var time = dataSrc.timeShaft[i].toDate().format("yyyy-MM-dd HH:mm");
                this.timeShaftLabel.push(time);
                this.dictData[time] = new Array();
            }
        }

        //init data
        var name, time;
        for (var j = 0, len2 = dataSrc.list.length; j < len2; j++) {
            name = dataSrc.list[j].dsItemId;

            for (var k = 0, len3 = dataSrc.timeShaft.length; k < len3; k++) {
                time = dataSrc.timeShaft[k].toDate().format("yyyy-MM-dd HH:mm");
                this.dictData[time].push({ dsItemId: name, data: dataSrc.list[j].data[k], time:time });
            }
        }
    };

    TimeShaftDashboard.prototype.renderParentScreen = function (time) {
        if (undefined == time) {
            return;
        }
        this.tbCurrentTime.value = time;
        this.parent.renderData(this.dictData[time], new Date(time), this.startTime, this.endTime);
    };

    TimeShaftDashboard.prototype.setBtnStatus = function () {
        var $btnPre = $('#btnPrevious');
        var $btnNext = $('#btnNext');
        var child1 = $('#tabFrames tbody tr:nth-child(2) td:nth-child(1)')[0];
        if (undefined != child1) {
            if(child1.className.indexOf('td-frame-selected') > -1){
                $btnPre.addClass('disabled');
            }else{
                $btnPre.removeClass('disabled');
            }
        }

        var child2 = $('#tabFrames tbody tr:nth-child(2) td:nth-last-child(1)')[0];
        if (undefined != child2) {
            if(child2.className.indexOf('td-frame-selected') > -1){
                $btnNext.addClass('disabled');
            }else{
                $btnNext.removeClass('disabled');
            }
        }
    };

    return TimeShaftDashboard;
})();