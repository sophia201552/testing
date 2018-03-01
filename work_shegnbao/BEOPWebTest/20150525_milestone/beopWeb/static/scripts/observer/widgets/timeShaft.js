/// <reference path="../../lib/jquery-1.11.1.js" />
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
    }

    TimeShaft.prototype = {
        show: function () {
            var _this = this;
            $.get("/static/views/observer/widgets/timeShaft.html").done(function (resultHtml) {
                _this.parent.toolContainer.html(resultHtml);
                _this.parent.toolContainer.animate({ height: _this.containerHeight + 'px' }, 200);
                _this.init();
                I18n.fillArea(_this.parent.toolContainer);
                _this.resultHtml = resultHtml;
            });
        },

        close: function () {
            this.parent = null;
            this.containerHeight = null;
            this.pointList = null;
            this.timeShaftLabel = null;
            this.dictData = null;
            this.tbCurrentTime = null;
            if (this.playHandle) clearInterval(this.playHandle);
            this.playHandle = null;
        },

        init: function () {
            var _this = this;

            this.tbCurrentTime = document.getElementById('txtCurrentTime');

            this.$inputInterval = $('#inputInterval');

            Spinner.spin(ElScreenContainer);
            WebAPI.get("/get_history_data/getMinPeriod/" + AppConfig.projectId).done(function (result) {
                var dataSrc = JSON.parse(result);
                if (undefined == dataSrc)
                    return;

                if (dataSrc['minPeriod'] != 'm1')
                    _this.$inputInterval.children(':first').css('display', 'none');
                else
                    _this.$inputInterval.children(':first').css('display', 'block');

                Spinner.stop();
            });





            var now = new Date();
            this.startTime = new Date(now - 86400000);
            this.endTime = now;
            $("#txtTimeStart").val(this.startTime.format("yyyy-MM-dd HH:mm"));
            $("#txtTimeEnd").val(this.endTime.format("yyyy-MM-dd HH:mm"));

            $('#divFramesConfig a[elapse]').off('click').click(function (e) {
                _this.parent.toolContainer.html(_this.resultHtml);
                _this.init();
                I18n.fillArea(_this.parent.toolContainer);

                var timeBaseline, timeFlags;
                timeFlags = e.currentTarget.attributes['elapse'].value.split(',');
                timeBaseline = +new Date();
                timeBaseline = timeBaseline + (new Date()).getTimezoneOffset() * 60000 - timeBaseline % 86400000;

                var end = new Date(timeBaseline + parseInt(timeFlags[1]) - 1000);
                var now = new Date();
                _this.endTime =  end > now ? now : end;
                _this.startTime = new Date(timeBaseline + parseInt(timeFlags[0]));
                _this.requestData(_this.startTime, _this.endTime);
            });

            $('#btnRquestHistory').off('click').click(function (e) {
                _this.startTime = DateUtil.parseStringToDate($("#txtTimeStart").val());
                _this.endTime = DateUtil.parseStringToDate($("#txtTimeEnd").val());
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

            $("#btnConfig").off('click').click(function (e) {
                $('#divFramesConfig').show();
                $('#divPaneFrames').hide();
            });
        },

        requestData: function (startTime, endTime, screen) {
            var _this = this;
            if (this.startTime > this.endTime) {
                alert('Time range error.')
                return;
            }
            _this.refreshCalendar();
            var timeStepSelectedValue = _this.$inputInterval.val();
            var data = {
                projectId: AppConfig.projectId,
                timeStart: startTime.format("yyyy-MM-dd HH:mm:ss"),
                timeEnd: endTime.format("yyyy-MM-dd HH:mm:ss"),
                timeFormat: timeStepSelectedValue,
                pointList: Object.keys(screen ? screen.dictRefreshMap : this.parent.dictRefreshMap)
            };

            Spinner.spin(ElScreenContainer);
            WebAPI.post("/get_history_data_padded_reduce", data).done(function (result) {
                var dataSrc = JSON.parse(result);
                if (undefined == dataSrc) return;
                
                if (screen) {
                    _this.renderCurrentMoment(screen, dataSrc);
                } else {
                    _this.initData(dataSrc);
                    _this.initTimeShaft();
                    $('#divFramesConfig').hide();
                    $('#divPaneFrames').show();
                }
                
                Spinner.stop();
            });
        },

        requestDataForCurrentMoment: function (screen) {
            var time = DateUtil.parseStringToDate(this.tbCurrentTime.value);
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
                    var time = new Date(dataSrc.timeStamp[i]).format("yyyy-MM-dd HH:mm");
                    this.timeShaftLabel.push(time);
                    this.dictData[time] = new Array();
                }
            }

            //init data
            var name, val, time;
            for (var key in dataSrc.data) {
                name = key;

                for (var i = 0, len = dataSrc.timeStamp.length; i < len; i++) {
                    var time = new Date(dataSrc.timeStamp[i]).format("yyyy-MM-dd HH:mm");
                    this.dictData[time].push({ name: name, value: dataSrc.data[key][i] });
                }
            }
        },

        initTimeShaft: function () {
            var _this = this;
            var trs = document.getElementById('tabFrames').getElementsByTagName('tr');
            var trTop = trs[0], trData = trs[1], trBottom = trs[2], td;
            trTop.innerHTML = ''; trData.innerHTML = ''; trBottom.innerHTML = '';

            for (var i = 0, count = 1, len = this.timeShaftLabel.length; i < len; i++) {
                var label = this.timeShaftLabel[i];
                if (this.timeShaftLabel[i+1] && this.timeShaftLabel[i+1].indexOf(':00') >= 0) {
                    td = document.createElement('td');
                    td.colSpan = count;
                    td.className = 'td-border-split';
                    if (count > 10) td.textContent = label.split(':')[0] + ":00";
                    trTop.appendChild(td);

                    count = 0;
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
                td.textContent = label.split(':')[1];
                trBottom.appendChild(td);
                count++;
            }
            this.setBtnStatus();
        },

        renderParentScreen: function (time) {
            this.tbCurrentTime.value = time;
            this.parent.renderData(this.dictData[time]);
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
                    _this.stop();
                } else {
                    var element = $('#tabFrames .td-frame-selected').removeClass('td-frame-selected').next();
                    //element.scrollParent().scrollLeft(element.offset().left);
                    element.addClass('td-frame-selected');
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

        refreshCalendar: function(){
            $('.datetimepicker').remove();
            $(".form_datetime").datetimepicker({
                format: "yyyy-mm-dd hh:ii",
                minView: "hour",
                autoclose: true,
                todayBtn: false,
                pickerPosition: "top-right",
                initialDate: new Date(),
                startDate: this.startTime.format("yyyy-MM-dd HH:mm:ss"),
                endDate: this.endTime.format("yyyy-MM-dd HH:mm:ss")
            }).off('changeDate').on('changeDate',function(ev){
                var selectTime = new Date(new Date(ev.date.valueOf()).toUTCString().replace(' GMT','')).getTime();
                var time = new Date(selectTime- selectTime%(5*60*1000)).format('yyyy-MM-dd HH:mm');
                $('#tabFrames .td-frame[title="'+ time +'"]').click();
            });
        }
    }

    return TimeShaft;
})();