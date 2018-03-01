/**
 * Created by vicky on 2016/3/1.
 */
var PatrolSchedule = (function(){
    var _this;
    function PatrolSchedule(screen){
        _this = this;
        this.container = $('#paneRightCtn');
        this.$table = undefined;
        this.dayCount = 1;
        this.$listExecutor = undefined;
        this.dictExecutor = {};
        this.missionData = null;
        this.startTime = null;
        if(screen){
            screen.close();
            this.screen = screen;
        }
        var period = localStorage.getItem('period');
        if(period){
            this.period = parseInt(period);
        }else{
           this.period = 7;
        }
    }

    PatrolSchedule.prototype.init = function(){
        this.calendar();
        //this.getDate();
    };

    PatrolSchedule.prototype.calendar = function(){
        var _this = this;
        _this.getPatrolPeople();
        var $calendar = $('#calendar');
        $("#calendar .fc-toolbar").find('.fc-today-button').removeClass('fc-today-button').addClass('btnToday').prop('disabled',false);
        $("#calendar .fc-toolbar").on('click','.fc-prev-button',function(){
            $("#calendar .fc-toolbar").find('.btnToday').removeClass('fc-state-disabled');
            _this.getPatrolPeople();
        });
        $("#calendar .fc-toolbar").on('click','.btnToday',function(){
            $("#calendar .fc-toolbar").find('.btnToday').addClass('fc-state-disabled');
            $('#calendar').fullCalendar('today');
            _this.getPatrolPeople();
        });
        $("#calendar .fc-toolbar").on('click','.fc-next-button',function(){
            $("#calendar .fc-toolbar").find('.btnToday').removeClass('fc-state-disabled');
            _this.getPatrolPeople();
        });
        $calendar.on('mouseover','td.fc-day',function(){
            _this.hover($(this));
        });
        $calendar.on('mouseout','td.fc-day',function(){
            var clear = 'mouseout';
            _this.hover($(this),clear);
        });
        $calendar.on('mouseover','td.fc-day-number',function(){
            _this.hover($(this));
        });
        $calendar.on('mouseout','td.fc-day-number',function(){
            var clear = 'mouseout';
            _this.hover($(this),clear);
        });
    };
    PatrolSchedule.prototype.getPatrolPeople = function(){
        var _this = this;
        _this.getExecutor();
        $("#calendar .fc-toolbar").find('.fc-today-button').show();
        $('#calendar .fc-right').html('<button class="btn btn-primary" id="btnSavePeriod" style="display:none;">保存</button><button class="btn btn-primary" id="editPeriod" style="display:none;">编辑</button>' +
            '<select class="periodSelected" style="margin-top: 10px;background-color: transparent;margin-right: 15px;"><option value="1">周期1天</option><option value="2">周期2天</option><option value="3">周期3天</option><option value="4">周期4天</option>' +
            '<option value="5">周期5天</option><option value="6">周期6天</option><option value="7">周期7天</option></select>');
        var $calendar = $('#calendar');
        $calendar.find('.fc-day-number .label').remove();
        var target = $calendar[0];
        //period选择
        var $periodSelected = $calendar.find('.periodSelected');
        $periodSelected.val(_this.period);
        $periodSelected.off().on('change',function(){
            _this.period = parseInt(this.value);
            localStorage.setItem('period',this.value);
        });
        Spinner.spin(target);
        var $days = $calendar.find('.fc-day');
        var startTime = $days.eq(0).attr('data-date');
        var endTime = $days.eq($days.length - 1).attr('data-date');
        var max ={
            time:null,
            period:null
        };
        WebAPI.get('/patrol/mission/get/' + AppConfig.projectId + '/' + startTime + '/' + endTime).done(function(result){
            if(result.data.length < 1 ){
                $calendar.find('.fc-day').addClass('clickItem');
                $calendar.find('.fc-day-number').prepend('<span class="label label-success">可排班</span>');
                return;
            }else{
                result.data.forEach(function(row){
                    if(!max.time){
                        max.time = row.startTime.split(' ')[0];
                        max.period = row.interval;
                    }else{
                        if(Date.parse(row.startTime.split(' ')[0]) > Date.parse(max.time)){
                            max.time = row.startTime.split(' ')[0];
                            max.period = row.interval;
                        }
                    }
                    var $current = $calendar.find(".fc-day[data-date = "+ row.startTime.split(' ')[0] +"]");
                    $current.addClass('clickItem');
                    $calendar.find(".fc-day-number[data-date = "+ row.startTime.split(' ')[0] +"]").prepend('<span class="label label-success">查看</span><span class="label label-info">周期'+ row.interval +'</span>');
                    var curTime = new Date().format("yyyy-MM-dd");
                    if(Date.parse(curTime) >=  Date.parse(row.startTime) && Date.parse(curTime) <= Date.parse(_this.addDays(row.startTime,_this.period))){
                        $current.addClass('curPeriod');
                    }
                    var taskArr = [],peopleArr = [[],[],[],[],[],[],[]];
                    for(var j in row.option){
                        taskArr.push(j);
                        for(var k in row.option[j]){
                            var len = row.option[j][k].length;
                            for(var p = 0;p<len;p++){
                                if(row.option[j][k][p]){
                                    peopleArr[p].push(row.option[j][k][p]);
                                }
                            }
                        }
                    }
                    var newPeopleArr = [[],[],[],[],[],[],[]];
                    for(var q = 0;q<peopleArr.length;q++){
                        for(var w = 0; w < peopleArr[q].length; w++){
                            if (newPeopleArr[q].indexOf(peopleArr[q][w]) == -1) newPeopleArr[q].push(peopleArr[q][w]);
                        }
                    }
                    var index = $days.index($current);
                    for(var s = index;s<index+row.interval;s++){
                        $($days[s]).html('<div style="padding-left: 18px;"><p style="margin-top: 10px;">巡更任务数：'+ taskArr.length +'</p><p>巡更人数：'+ newPeopleArr[s-index].length +'</p></div>');
                    }
                })
            }
        }).always(function(){
            if(max.time){
                $calendar.find(".fc-day[data-date = "+ max.time +"]").addClass('clickItem canSchedule');
                addClass(max.time,max.period);
            }
            Spinner.stop();
        });
        function addClass(time,period){
            var item = $calendar.find(".fc-day[data-date = "+ _this.addDays(time,period) +"]");
            if(item.length > 0){
                item.addClass('clickItem canSchedule');
                item.closest('.fc-bg').next('.fc-content-skeleton').find(".fc-day-number[data-date = "+ _this.addDays(time,period) +"]").prepend('<span class="label label-success">可排班</span>');
                //addClass(_this.addDays(time,period),period)
            }else{
                return;
            }
        }
    };
    PatrolSchedule.prototype.hover = function (e,clear){
        //var index = e.index();
        var hoverDate = e.attr('data-date');
        if(e.closest('.fc-bg').length === 0){
            e = e.closest('.fc-content-skeleton').prev('.fc-bg').find("td[data-date = "+hoverDate+"]");
        }
        var days = $('#calendar').find('.fc-day');
        var index = days.index(e);
        for(var i = index,len = index + this.period;i<len;i++){
            var j;
            if(i >= days.length){
                j = i - days.length;
            }else {
                j = i;
            }
            if(clear){
                $(days[j]).removeClass('fc-hover');
            }else{
                $(days[j]).addClass('fc-hover');
            }
        }
    };
    PatrolSchedule.prototype.show = function(){
        var _this = this;
        WebAPI.get('/static/app/Patrol/views/patrolSchedule.html').done(function(resultHtml){
            _this.container.html(resultHtml);
            _this.$table = $('#tableSchedule');
            _this.$iptStartDate = $('#iptStartDate');
            $('#calendar').fullCalendar({
                header: {left: 'prev,today,next', center: 'title', right: ''},
                titleFormat: "YYYY年MM月",
                monthNamesShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
                dayNamesShort: ["周日","周一", "周二", "周三", "周四", "周五", "周六"],
                firstDay:1,
                height: _this.container.height() + 20,
                dayClick: function(date, jsEvent, view) {
                    var $current = $(jsEvent.target);
                    if($current.hasClass('label')){
                        $current = $current.closest('.fc-day-number');
                    }
                    if($current.closest('.fc-bg').length === 0){
                        $current = $current.closest('.fc-content-skeleton').prev('.fc-bg').find("td[data-date = "+$current.attr('data-date')+"]");
                    }
                    //if($current.closest('.curPeriod').length >0){
                    //    _this.showScheduleDetail(date.format());
                    //    return;
                    //}
                    if($current.closest('.clickItem').length<1){
                        //_this.showScheduleDetail(date.format());
                        return;
                    }else{
                        if($current.closest('.canSchedule').length<1){
                            _this.showScheduleDetail(date.format());
                        }else{
                            _this.showScheduleDetail(date.format(),true);
                        }
                    }
                }
            });
            _this.init();
        })
    };

    PatrolSchedule.prototype.close = function(){
        this.container.empty();
        this.$table.empty();
        this.$listExecutor && this.$listExecutor.empty();

        this.container = null;
        this.screen = null;
        this.$iptStartDate = null;
        this.$table = null;
        this.$listExecutor = null;
        this.$ajaxMission = null;
        this.$ajaxPath = null;
        this.$ajaxExecutor = null;
        this.dayCount = null;
        this.dictExecutor = null;
        this.missionData = null;
        this.period = null;
        this.startTime = null;
    };

    PatrolSchedule.prototype.attachEvent = function(){
        //选择周期
        /*this.container.find('#selCycle')[0].onchange = function(){
            _this.drawTable(this.value);
        }*/
        //查看报表
        this.container.find('#btnCheckReport').off().on('click',function(){
            _this.screen.startDate = $('#iptStartDate').val();
            new PatrolReport(_this.screen).show();
            $('#listNav').find("a[data-target = 'patrolSchedule']").removeClass('active');
            $('#listNav').find("a[data-target = 'patrolReport']").addClass('active');
        });
        //返回
        this.container.find('#btnReturn').off().on('click',function(){
            _this.missionData = null;
            _this.startTime = null;
            $('#paneScheduleNav').hide();
            $('#listNav').find("[data-target='patrolSchedule']").trigger('click');
            //$('#calendar').show();
        });
        //保存排班
        this.container.find('#btnSave').off().on('click', function(){
            var $btn = $(this);
            //var timeout = undefined;
            //验证开始日期
            if(_this.$iptStartDate.val() == ''){
                _this.$iptStartDate.addClass('danger');
                return;
            }else{
                _this.$iptStartDate.removeClass('danger');
            }
            if(_this.$table.find('.iptTime.danger').length > 0) return;

            $btn.attr('disabled', true);
            //5s之内保存按钮不可再点击
            //timeout = setTimeout(function(){
            //    $btn.attr('disabled', false);
            //    clearTimeout(timeout);
            //    timeout = null;
            //}, 5000);
            _this.saveMission();
        });

        //增加行
        this.$table.off('click', '.btnAddRow').on('click', '.btnAddRow', function(e){
            var strTd = '<td class="time"><input type="text" class="form-control iptTime" placeholder="00:00"/><span class="btnRemove glyphicon glyphicon-remove-sign"></span></td><td class="executor"></td>';
            var rowspan = $(this).parent().attr('rowspan') ? $(this).parent().attr('rowspan') : 1;
            var $tr = $(this).closest('tr');
            rowspan = parseInt(rowspan);
            $(this).parent().attr('rowspan', ++rowspan);

            for(var i = 1; i < _this.period; i++){
                strTd += ('<td class="executor"></td>');
            }
            $('tr[data-id="'+ $tr.attr('data-id') +'"]:last').after('<tr data-id="'+ $tr[0].dataset.id +'" class="subRow">'+ strTd +'</tr>');

        });

        //批量增加行
        this.$table.on('click', '.btnAddMoreRow', function (e) {
            var $this = $(this);
            var $addRowModel = $('#addRowModel');
            $addRowModel.modal('show');
            //输入框验证
            $addRowModel.on('blur', 'input.veriTime', function (e) {
                //this.value = this.value.replace(/\D/g,'')
                var result = this.value.match(/^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/);
                if (this.value != '' && result == null) {
                    $(this).val('');
                    $(this).addClass('danger');
                } else {
                    $(this).removeClass('danger');
                    var hour = this.value.split(':')[0];
                    if (hour && parseInt(hour) < 10 && hour.length === 1) {
                        $(this).val('0' + this.value);
                    }
                }
            });
            function judgeTime(startH,endH,startS,endS){
                var finalTime = undefined;
                if (startH > endH) {
                    return;
                } else if ((startH === endH) && (startS > endS)) {
                    return;
                } else {//仍需要判断
                    if (startH < 10) {
                        startH = '0' + startH;
                    }
                    if (startS < 10) {
                        startS = '0' + startS;
                    }
                    finalTime = startH + ':' + startS;
                }
                return finalTime;
            }
            $('#addMoreRow').off('click').click(function () {
                var $addRowModel = $('#addRowModel');
                var schStartTime = $addRowModel.find('.schStartTime').val();
                var timeInterval = $addRowModel.find('.timeInterval').val();
                var schEndTime = $addRowModel.find('.schEndTime').val();
                var $wrongInfo = $addRowModel.find('.wrongInfo');
                var re = /^[0-9]+.?[0-9]*$/;
                if (schStartTime.replace(/(^\s*)|(\s*$)/g, "") === '' || schEndTime.replace(/(^\s*)|(\s*$)/g, "") === '' || timeInterval.replace(/(^\s*)|(\s*$)/g, "") === '') {
                    new Alert($wrongInfo, 'danger', '请填写完整！').show(1000).close();
                    return;
                }
                if ((schStartTime !== '' && schStartTime.match(/^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/) == null) || (schEndTime !== '' && schEndTime.match(/^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/) == null)) {
                    new Alert($wrongInfo, 'danger', '请填写正确的时间格式！').show(1000).close();
                    return;
                }
                if (!re.test(timeInterval)) {
                    new Alert($wrongInfo, 'danger', '请填写正确的数字格式！').show(1000).close();
                    return;
                }
                var starTimeH = parseInt(schStartTime.split(':')[0]);
                var endTimeH = parseInt(schEndTime.split(':')[0]);
                var starTimeS = parseInt(schStartTime.split(':')[1]);
                var endTimeS = parseInt(schEndTime.split(':')[1]);
                var timeIntervalInt = parseFloat(timeInterval);
                if (timeIntervalInt === 0) {
                    new Alert($wrongInfo, 'danger', '请填写具有有效间隔的时间！').show(1000).close();
                    return;
                }
                if (endTimeH === 0) {
                    endTimeH = 24;
                }
                if (starTimeH === 0) {
                    starTimeH = 24;
                }
                if (starTimeH > endTimeH) {
                    new Alert($wrongInfo, 'danger', '开始时间不能大于结束时间！').show(1000).close();
                    return;
                } else if ((starTimeH === endTimeH) && (starTimeS > endTimeS)) {
                    new Alert($wrongInfo, 'danger', '开始时间不能大于结束时间！').show(1000).close();
                    return;
                }
                var len = (endTimeH + endTimeS / 60 - starTimeH - starTimeS/60) / timeIntervalInt;
                if (len < 1 && (endTimeS - starTimeS) < timeIntervalInt*60) {
                    new Alert($wrongInfo, 'danger', '请填写具有有效间隔的时间！').show(1000).close();
                    return;
                }
                for (var i = 0; i <= len; i++) {
                    var rest = parseFloat('0.'+timeInterval.split('.')[1]);
                    var finalTime = schStartTime;
                    if(i>0){
                        if (!rest) {
                            //间隔是整数时
                             starTimeH += timeIntervalInt;
                             //if (starTimeH > endTimeH) {
                             //   return;
                             //} else if ((starTimeH === endTimeH) && (starTimeS > endTimeS)) {
                             //   return;
                             //} else {//仍需要判断
                             //       finalTime = starTimeH + ':' + starTimeS;
                             //}
                             finalTime = judgeTime(starTimeH, endTimeH, starTimeS, endTimeS);
                        } else {
                            //间隔是小数
                            var secondTime = starTimeS + rest * 60;
                            if (secondTime >= 60) {
                                starTimeH += 1;
                                starTimeS = parseInt((secondTime - 60).toFixed(0));
                            } else {
                                starTimeS = parseInt(secondTime.toFixed(0));
                            }
                            starTimeH += (timeIntervalInt - rest);
                            //if (starTimeH > endTimeH) {
                            //    return;
                            //} else if ((starTimeH === endTimeH) && (starTimeS > endTimeS)) {
                            //    return;
                            //} else {//仍需要判断
                            //    finalTime = starTimeH + ':' + starTimeS;
                            //}
                            finalTime =  judgeTime(starTimeH, endTimeH, starTimeS, endTimeS)
                        }
                        if (finalTime.split(':')[0] === '24') {
                            finalTime = '00:' + finalTime.split(':')[1];
                        }
                    }
                    var strTd = '<td class="time"><input type="text" class="form-control iptTime" placeholder="00:00" value="' + finalTime + '"/><span class="btnRemove glyphicon glyphicon-remove-sign"></span></td><td class="executor"></td>';
                    var rowspan = $this.parent().attr('rowspan') ? $this.parent().attr('rowspan') : 1;
                    var $tr = $this.closest('tr');
                    rowspan = parseInt(rowspan);
                    $this.parent().attr('rowspan', ++rowspan);

                    for (var j = 1; j < _this.period; j++) {
                        strTd += ('<td class="executor"></td>');
                    }
                    $('tr[data-id="' + $tr.attr('data-id') + '"]:last').after('<tr data-id="' + $tr[0].dataset.id + '" class="subRow" data-time="'+ finalTime +'">' + strTd + '</tr>');
                    var arr = [];
                    for(var k= 0;k<_this.period;k++){
                        arr.push(null);
                    }
                    _this.missionData.forEach(function(row){
                        if($.isEmptyObject(row.option)){
                            row.option[$tr[0].dataset.id] = {};
                            row.option[$tr[0].dataset.id][finalTime] = arr;
                        }else{
                            if(row.option[$tr[0].dataset.id]){
                                for(var path in row.option){
                                    if(path === $tr[0].dataset.id){
                                        row.option[path][finalTime] = arr;
                                        break;
                                    }
                                }
                            }else{
                                row.option[$tr[0].dataset.id] = {};
                                row.option[$tr[0].dataset.id][finalTime] = arr;
                            }
                        }

                    });
                }
                $addRowModel.modal('hide');
            })
        });

        //删除行
        this.$table.on('click', '.btnRemove', function(){
            var $tr = $(this).closest('tr');
            infoBox.confirm('确认删除该行', okCallback);
            function okCallback(){
                var val = $tr.find('.time input').val();
                if(val!=''){
                    _this.missionData.forEach(function(row){
                        for(var path in row.option){
                            if(path === $tr[0].dataset.id){
                                if(Object.keys(row.option[path]).length === 1){
                                    delete row.option[path];
                                }else{
                                    for(var time in row.option[path]){
                                        if(time === val){
                                            delete row.option[path][time]
                                        }
                                    }
                                }
                                break;
                            }
                        }
                    });
                }
                if($tr.hasClass('parentRow')){
                    if($('[data-id="'+ $tr[0].dataset.id +'"]').length <= 1){//如果删除第一行,且是最后一行
                        $tr.find('.time input').val('');
                        $tr.children('.executor').css('background-color','').text('');
                    }else{//复制下一行的值给第一行, 删除下一行
                        var time = $tr.next().find('.iptTime').val();
                        var $tdFirst = $tr.children('td:eq(0)');
                        $tdFirst.attr('rowspan', parseInt($tdFirst.attr('rowspan')) - 1);
                        $tr.html($tdFirst[0].outerHTML + $tr.next().html());
                        $tr.find('.iptTime').val(time);
                        $tr.next().remove();
                    }
                }else{
                    var $parentRow = $('.parentRow[data-id="' + $tr[0].dataset.id +'"]');
                    if(!$parentRow[0]) return;
                    var rowspanVal = parseInt($parentRow.children('td:eq(0)').attr('rowspan'));
                    $parentRow.children('td:eq(0)').attr('rowspan', rowspanVal - 1);
                    $tr.remove();
                }
            }
        });
        //在表格单元格填入选中人员
        function personCopy($dom) {
            $dom.attr('data-executorid', _this.dragExecutorId);
            $dom.html('<div class="executorDiv" draggable="true">' + _this.dictExecutor[_this.dragExecutorId] + '<span class="removeExecutor glyphicon glyphicon-remove-sign"></span></div>');
            $dom.removeClass('danger');
        }
        //拖放人员
        //this.$table.off('drop').on('drop', '.executor', function(e){
        //    e.preventDefault();
        //    personCopy($(this));
            
        //});
        this.$table.off('dragover').on('dragover', '.executor', function(e){
            e.preventDefault();
            var $this = $(this);
            var $itemActive = _this.$listExecutor.find('.active');
            //如果是过去的日期
            if($this.hasClass('disabled')) return;
            var $tr = $this.closest('tr');
            var $td = $tr.children('.executor');
            $('.executor.hover').removeClass('hover');
            $this.addClass('hover');
            $this.css({ backgroundColor: $itemActive.attr('dict-color') });
            personCopy($this);
            _this.missionData.forEach(function(row){
                for(var path in row.option){
                    if(path === $tr[0].dataset.id){
                        for(var time in row.option[path]){
                             if($tr[0].dataset.time && time === $tr[0].dataset.time){
                                 var index = $td.index($this);
                                 row.option[path][time][index] = _this.dragExecutorId;
                                 break;
                             }
                        }
                        break;
                    }
                }
            })
        });
        //点击右侧人员选中事件
        this.$listExecutor.find('.itemExecutor').off('click').click(function () {
            var $this = $(this);
            if ($this.hasClass('active')) {
                $this.removeClass('active');
            } else {
                $this.addClass('active');
                $this.siblings().removeClass('active');
            }
        });
        //点击table中executor会添加右侧选中人员
        this.$table.on('click', '.executor', function () {
            //如果是过去的日期
            if($(this).hasClass('disabled')) return;
            var $tr = $(this).closest('tr');
            var $this = $(this);
            var $td = $tr.children('.executor');
            var $itemActive = _this.$listExecutor.find('.active');
            $(this).css({backgroundColor: $itemActive.attr('dict-color')});
            if ($itemActive.length > 0) {
                _this.dragExecutorId = $itemActive.attr('data-id');
                personCopy($(this));
                _this.missionData.forEach(function(row){
                    for(var path in row.option){
                        if(path === $tr[0].dataset.id){
                            for(var time in row.option[path]){
                                 if($tr[0].dataset.time && time === $tr[0].dataset.time){
                                     var index = $td.index($this);
                                     if(row.option[path][time].length != _this.period){
                                         for(var i = row.option[path][time].length;i<index;i++){
                                             row.option[path][time].push(null);
                                         }
                                     }
                                     row.option[path][time][index] = _this.dragExecutorId;
                                     break;
                                 }
                            }
                            break;
                        }
                    }
                })
            }
        });
        this.$listExecutor.off('dragstart').on('dragstart', '.itemExecutor', function (e) {
            //e.dataTransfer.setData('id', this.dataset.id);
            e.stopPropagation();
            _this.dragExecutorId = this.dataset.id;
            $(this).addClass('active').siblings().removeClass('active');
        });
        //拖拽人员
        this.$table.off('dragstart').on('dragstart', '.executorDiv', function (e) {
            //e.dataTransfer.setData('id', this.dataset.id);
            e.stopPropagation();
            _this.dragExecutorId = $(this).parent('.executor').attr('data-executorid');
        });
        this.$table.off('dragend').on('dragend', '.executorDiv', function (e) {
            e.preventDefault();
            e.stopPropagation();
            $('.hover').removeClass('hover');
        });

        //删除人员
        this.$table.on('click', '.removeExecutor', function (e) {
            e.stopPropagation();
            var $this = $(this);
            var $tr = $this.closest('tr');
            var $td = $tr.children('.executor');
            var $curTd = $this.closest('td');
            if($curTd.hasClass('disabled')){
                infoBox.confirm("删除已排班的人员会对排班造成影响",callback)
            }else{
                callback();
            }
            function callback(){
                _this.missionData.forEach(function(row){
                    if($.isEmptyObject(row.option)){
                        if($tr[0].dataset.time){

                        }
                    }else{
                        for(var path in row.option){
                            if(path === $tr[0].dataset.id){
                                for(var time in row.option[path]){
                                     if($tr[0].dataset.time && time === $tr[0].dataset.time){
                                         var index = $td.index($curTd);
                                         row.option[path][time][index] = null;
                                         break;
                                     }
                                }
                                break;
                            }
                        }
                    }
                });
                $this.closest('.executor').attr('data-executorId','').css('background-color','').html('');
            }
        });

        //输入框验证
        this.$table.on('change', 'input', function(e){
            //this.value = this.value.replace(/\D/g,'')
            var $tr = $(this).closest('tr');
            var result = this.value.match(/^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/);
            if(this.value != '' && result == null) {
                //$(this).val('');
                $(this).addClass('danger');
            }else{
                $(this).removeClass('danger');
                var hour = this.value.split(':')[0];
                if (hour && parseInt(hour) < 10 && hour.length===1) {
                    $(this).val('0'+ this.value);
                }
                var val = $(this).val();
                var arr = [];
                for(var i= 0;i<_this.period;i++){
                    arr.push(null);
                }
                _this.missionData.forEach(function(row){
                    if($.isEmptyObject(row.option)){
                        row.option[$tr[0].dataset.id] = {};
                        row.option[$tr[0].dataset.id][val] = arr;
                        $tr.attr('data-time',val);
                    }else{
                        if(row.option[$tr[0].dataset.id]){
                            for(var path in row.option){
                                if(path === $tr[0].dataset.id){
                                    if($tr[0].dataset.time){
                                        row.option[path][val] = row.option[path][$tr[0].dataset.time];
                                        delete row.option[path][$tr[0].dataset.time];
                                    }else{
                                        row.option[path][val] = arr;
                                    }
                                    $tr.attr('data-time',val);
                                    break;
                                }
                            }
                        }else{
                            row.option[$tr[0].dataset.id] = {};
                            row.option[$tr[0].dataset.id][val] = arr;
                            $tr.attr('data-time',val);
                        }
                    }

                });
            }
        });
    };

    PatrolSchedule.prototype.getMission = function(date){
        var startTime = new Date(date);
        var endTime = startTime.setDate(startTime.getDate() + _this.period-1);
        this.$ajaxMission = WebAPI.get('/patrol/mission/get/' + AppConfig.projectId + '/' + date + '/' + new Date(endTime).format("yyyy-MM-dd")).done(function(result){
            if(!result.data || $.isEmptyObject(result.data)) {
                _this.startTime = date;
                _this.missionData = [{
                    startTime: _this.startTime.split(' ')[0],
                    interval: _this.period,
                    option: {}
                }];
                $('#btnSave').show();
                return;
            }
            _this.missionData = result.data;
            result.data.forEach(function(row){
                if(row.interval === _this.period){
                    if(Date.parse(date) > Date.parse(row.startTime)){
                        _this.startTime = row.startTime.split(' ')[0];
                        $('#btnSave').show();
                    }
                }else{
                    //$('#btnSave').hide();
                }
            });
            if(!_this.startTime){
                _this.startTime = date;
            }
        });
    };

    PatrolSchedule.prototype.getPath = function(){
        this.$ajaxPath = WebAPI.get('/patrol/path/getAll/' + AppConfig.projectId).done(function(result){
            if(!result.data || result.data.length == 0) return;
            var strHtml = '';
            for(var i = 0; i < result.data.length; i++){
                strHtml += ('<tr data-id="' + result.data[i]._id + '" class="parentRow"><td><span>' + result.data[i].name + '</span><span class="btnAddRow glyphicon glyphicon-plus-sign" title="添加"></span><span class="btnAddMoreRow glyphicon glyphicon-plus" title="批量添加"></span></td><td class="time"><input type="text" class="form-control iptTime" placeholder="00:00"/><span class="btnRemove glyphicon glyphicon-remove-sign"></span></td></tr>');
            }
            _this.$table.find('tbody').html(strHtml);
        });
    };

    PatrolSchedule.prototype.getExecutor = function(){
        this.$listExecutor = $('#listPerson');
        this.$ajaxExecutor = WebAPI.get('/patrol/executor/getList/' + AppConfig.projectId).done(function(result){
            if(!result.data || result.data.length == 0) return;
            var strHtml = '';
            var j = 0;
            var colorArr = ['#ff7f50', '#87cefa', '#da70d6', '#32cd32', '#6495ed','#ff69b4', '#ba55d3', '#cd5c5c', '#ffa500', '#40e0d0','#1e90ff', '#ff6347', '#7b68ee', '#00fa9a', '#ffd700','#6b8e23', '#ff00ff', '#3cb371', '#b8860b', '#30e0e0'];
            var colorLength = colorArr.length - 1;
            for(var i = 0, id, name; i < result.data.length; i++){
                id = result.data[i]._id;
                name = result.data[i].name;
                _this.dictExecutor[id] = name;
                if (i <= colorLength+1) {
                    j = i;
                }
                if (j > colorLength) {
                    j = 0;
                }
                strHtml += ('<li class="itemExecutor" data-id="' + id + '"  draggable="true" style="background:' + colorArr[j] + '" dict-color="' + colorArr[j] + '">' + name + '</li>');
                if (i > colorLength) { 
                    j++;
                }
            }
            _this.$listExecutor.html(strHtml);
        });
    };

    PatrolSchedule.prototype.saveMission = function(){
        var data;
        if(this.missionData[0].interval === this.period){
            data = this.missionData[0];
            data.startTime = data.startTime.format('yyyy-mm-dd').split(' ')[0];
        }else{
            if(this.missionData[0].interval>this.period){
                for(var path in this.missionData[0].option){
                    for(var time in this.missionData[0].option[path]){
                        if(this.missionData[0].option[path][time].length != this.period){
                            var len = this.missionData[0].option[path][time].length;
                            for(var i = this.period;i< len;i++){
                                this.missionData[0].option[path][time].pop();
                            }
                        }
                    }
                }
            }else{
                for(var path in this.missionData[0].option){
                    for(var time in this.missionData[0].option[path]){
                        if(this.missionData[0].option[path][time].length != this.period){
                            for(var i = this.missionData[0].option[path][time].length;i< this.period;i++){
                                this.missionData[0].option[path][time].push(null);
                            }
                        }
                    }
                }
            }
            data = {
                startTime: _this.$iptStartDate.val().format('yyyy-mm-dd').split(' ')[0],
                interval: $('#selCycle').val(),
                option: this.missionData[0].option
            };
            //data = {
            //    startTime: _this.$iptStartDate.val().format('yyyy-mm-dd').split(' ')[0],
            //    interval: $('#selCycle').val(),
            //    option: {}
            //};
            //var $trs = this.$table.find('tbody tr');
            //if(this.$table[0].dataset.id){
            //    data._id = this.$table[0].dataset.id;
            //}
            //for(var i = 0, $tr, time, $tds, arrExecutor; i < $trs.length; i++){
            //    $tr = $($trs[i]);
            //    time = $tr.find('.iptTime').val();
            //    if(!time) continue;
            //    $tds = $tr.children('.executor');
            //    arrExecutor = [];
            //    !data.option[$tr[0].dataset.id] && (data.option[$tr[0].dataset.id] = {});
            //    for(var j = 0, $td; j < $tds.length; j++){
            //        $td = $tds[j];
            //        arrExecutor.push($td.dataset.executorid || null);
            //    }
            //    data.option[$tr[0].dataset.id][time] = arrExecutor;
            //}
        }
        Spinner.spin(this.container[0]);
        WebAPI.post('/patrol/mission/save/' + AppConfig.projectId, data).done(function(result){
            if(result.data.length>0){
                infoBox.alert('保存成功',{type: 'success', delay: 1000});
            }else{
                infoBox.alert('保存失败',{type: 'success', delay: 1000});
            }
        }).fail(function(){
            infoBox.alert('保存失败',{type: 'success', delay: 1000});
        }).always(function(){
            Spinner.stop();
            $('#btnSave').attr('disabled', false);
        });
    };

    PatrolSchedule.prototype.renderData = function(date){
        var data = _this.missionData;
        _this.$iptStartDate.val(date);
        this.drawTable(this.period, date);
        $('#selCycle').val(this.period);
        //小于今天的不可更改
        this.$table.find('th.disabled').each(function(i){
            _this.$table.find('tbody tr.parentRow').find('td:nth-of-type('+ (i+3) +')').addClass('disabled');
            _this.$table.find('tbody tr.subRow').find('td:nth-of-type('+ (i+2) +')').addClass('disabled');
        });
        if($.isEmptyObject(data[0].option)) {
            return;
        }
        this.$table.attr('data-id', data[data.length-1]._id);
        data.forEach(function(row,g){
            for(var i in row.option){
                var $tr = $('[data-id="'+ i +'"]');
                if(!$tr[0]) continue;
                var $trParent = $tr;
                var timeCount = 1;//一条线路上时间个数
                for(var j in row.option[i]) {
                    var index = 2; //tr 的td 下标, 从2开始是人员
                    var arrExecutor;
                    //如果timeCount大于1, 增加一行
                    if ($tr.filter('[data-time ="'+ j +'"]').length >0){
                        arrExecutor = row.option[i][j];
                        var parent = $tr.filter('[data-time ="'+ j +'"]').closest('tr');
                        if (arrExecutor && arrExecutor instanceof Array && arrExecutor.length > 0) {
                            arrExecutor.forEach(function (executor, i) {
                                var executorName = _this.dictExecutor[executor] ? _this.dictExecutor[executor] : '已删除';
                                if (executor && executorName) {
                                    var color = $('#listPerson').find('.itemExecutor[data-id="' + executor + '"]').css('background');
                                    //$tr.children('td:eq(' + index + ')').attr('data-executorid', executor).css('background', color).html('<div class="executorDiv" draggable="true">' + executorName + '<span class="removeExecutor glyphicon glyphicon-remove-sign"></span></div>');
                                    parent.children('td[data-time=' + _this.addDays(row.startTime, i) + ']').length >0 && parent.children('td[data-time=' + _this.addDays(row.startTime, i) + ']').attr('data-executorid', executor).css('background', color).html('<div class="executorDiv" draggable="true">' + executorName + '<span class="removeExecutor glyphicon glyphicon-remove-sign"></span></div>');
                                }
                                index++;
                            });
                        }
                    }
                    else {
                        if(g>0){
                            if($tr.eq(0).children('td:eq(0)').attr('rowspan')){
                    			timeCount = parseInt($tr.eq(0).children('td:eq(0)').attr('rowspan'));
                    			timeCount++;
                    		}else{
                    			timeCount = 1;
                    			$trParent.children('td:eq(0)').attr('rowspan', timeCount);
                    		}
                        }
                        $trParent.eq(0).children('td:eq(0)').attr('rowspan', timeCount);
                        if (timeCount > 1) {
                            index = 1;
                            var strTd = '<td class="time"><input type="text" class="form-control iptTime" placeholder="00:00"/><span class="btnRemove glyphicon glyphicon-remove-sign"></span></td>';
                            for (var k = 0; k < _this.period; k++) {
                                var time = new Date(date).getFullYear() + '-' + _this.$table.find('thead th').eq(2 + k).text();
                                strTd += ('<td class="executor" data-time="' + time + '"></td>');
                            }
                            var $nTr = $('[data-id="'+ i +'"]').eq($('[data-id="'+ i +'"]').length - 1);
                            $nTr.after('<tr data-id="' + $tr[0].dataset.id + '" class="subRow">' + strTd + '</tr>');

                            $nTr = $tr.next('tr');
                        }
                        arrExecutor = row.option[i][j];
                        var $curTr = $('[data-id="'+ i +'"]').eq($('[data-id="'+ i +'"]').length - 1);
                        $curTr.attr('data-time', j).find('.time .iptTime').val(j);
                        if (arrExecutor && arrExecutor instanceof Array && arrExecutor.length > 0) {
                            arrExecutor.forEach(function (executor, i) {
                                var executorName = _this.dictExecutor[executor] ? _this.dictExecutor[executor] : '已删除';
                                if (executor && executorName) {
                                    var color = $('#listPerson').find('.itemExecutor[data-id="' + executor + '"]').css('background');
                                    $curTr.children('td[data-time=' + _this.addDays(row.startTime, i) + ']').length>0 && $curTr.children('td[data-time=' + _this.addDays(row.startTime, i) + ']').attr('data-executorid', executor).css('background', color).html('<div class="executorDiv" draggable="true">' + executorName + '<span class="removeExecutor glyphicon glyphicon-remove-sign"></span></div>');
                                }
                                index++;
                            });
                        }
                        timeCount++;
                    }
                }
            }
        });
        //小于今天的不可更改
        this.$table.find('th.disabled').each(function(i){
            _this.$table.find('tbody tr.parentRow').find('td:nth-of-type('+ (i+3) +')').addClass('disabled');
            _this.$table.find('tbody tr.subRow').find('td:nth-of-type('+ (i+2) +')').addClass('disabled');
        });
    };

    PatrolSchedule.prototype.drawTable = function(value, mondayDate){
        var cyclyNum = isNaN(value) ? this.dayCount : parseInt(value);
        var strTHead = '<th>巡更路线</th><th>时间</th>';
        var diff = cyclyNum - _this.dayCount;
        var mondayTime = new Date(mondayDate).getTime();
        var dateTime = new Date(new Date().format('yyyy-MM-dd 00:00:00')).getTime();

        //thead
        for(var i = 0, className=''; i < cyclyNum; i++){
            var tempTime = mondayTime + i*86400000;
            if(tempTime < dateTime){
                className = 'disabled'
            }else{
                className = '';
            }
            strTHead += ('<th class="'+ className +'">'+ new Date(tempTime).format('MM-dd') +'</th>');
        }
        //strTHead += '<th>操作</th>'
        _this.$table.find('thead tr').html(strTHead);

        //tbody
        _this.$table.find('tbody tr').each(function(){
            //$(this).children('.tdOperation').remove();
            var trCount = $(this).children('td').length;
            if(cyclyNum > 0){
                var strTd = '';
                for(var i = 0; i < cyclyNum; i++){
                    //var time = new Date().getFullYear() + '-'+_this.$table.find('thead th').eq(2+i).text();
                    var time = new Date(_this.startTime).getFullYear() + '-'+_this.$table.find('thead th').eq(2+i).text();
                    strTd += ('<td class="executor" data-time="'+ time +'"></td>');
                }
                $(this).append(strTd);
            }else if(diff < 0){
                var abs = Math.abs(diff);
                var tempTrCount = trCount;
                for(var i = 0; i < abs; i++){
                    $(this).children('td:eq('+ (tempTrCount-1) +')').remove();
                    tempTrCount --;
                }
            }
        });
        _this.dayCount = 1;
    };
    PatrolSchedule.prototype.getPeriodStartTime = function(date){
        var diff = this.screen.daysBetween(date,this.startTime);
        var periodStartTime =  new Date(date).setDate(new Date(date).getDate() - diff%this.period);
        return new Date(periodStartTime).format('yyyy-MM-dd');
    };
    PatrolSchedule.prototype.addDays = function(date,index){
        var time =  new Date(date).setDate(new Date(date).getDate() + index);
        return new Date(time).format('yyyy-MM-dd');
    };

    PatrolSchedule.prototype.showScheduleDetail = function(date,save){
        $('#calendar').hide();
        !save && $('#btnSave').hide();
        this.getMission(date);
        this.getPath();
        this.getExecutor();
        //this.getMission(this.getPeriodStartTime(date));
        Spinner.spin(this.container[0]);
        $.when(this.$ajaxMission, this.$ajaxPath, this.$ajaxExecutor).done(function(){
            //_this.renderData(_this.getPeriodStartTime(date));
            _this.renderData(_this.startTime);
            _this.attachEvent();
            $('#paneScheduleNav').show();
        }).always(function(){
            Spinner.stop();
        });
    };

    return PatrolSchedule;
}());