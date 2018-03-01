/**
 * Created by vicky on 2016/3/1.
 */
var PatrolSchedule = (function(){
    var _this;
    function PatrolSchedule(){
        _this = this;
        this.container = $('#paneRightCtn');
        this.$table = undefined;
        this.dayCount = 1;
        this.$listExecutor = undefined;
        this.dictExecutor = {}
    }

    PatrolSchedule.prototype.init = function(){
        this.getPath();
        this.getExecutor();
    }

    PatrolSchedule.prototype.show = function(){
        WebAPI.get('/static/app/Patrol/views/patrolSchedule.html').done(function(resultHtml){
            _this.container.html(resultHtml);
            _this.$table = $('#tableSchedule');
            _this.$iptStartDate = $('#iptStartDate');
            _this.init();
        })
    }

    PatrolSchedule.prototype.close = function(){
        this.container.empty();
    }

    PatrolSchedule.prototype.attachEvent = function(){
        //选择周期
        this.container.find('#selCycle')[0].onchange = function(){
            _this.drawTable(this.value);
        }

        //保存排班
        this.container.find('#btnSave')[0].onclick = function(){
            //验证开始日期
            if(_this.$iptStartDate.val() == ''){
                _this.$iptStartDate.addClass('danger');
                return
            }else{
                _this.$iptStartDate.removeClass('danger');
            }

            //验证时间
            /*_this.$table.find('.iptTime').each(function(){
                if($(this).val() == ''){
                    $(this).addClass('danger');
                }else{
                    $(this).removeClass('danger');
                }
            });*/
            if(_this.$table.find('.iptTime.danger').length > 0) return;

            //验证人员
            /*_this.$table.find('.executor').each(function(){
                if($(this).text() == ''){
                    $(this).addClass('danger');
                }else{
                    $(this).removeClass('danger');
                }
            });
            if(_this.$table.find('.executor.danger').length > 0) return;*/

            _this.saveMission();
        }

        //增加行
        this.$table.on('click', '.btnAddRow', function(e){
            var strTd = '<td class="time"><input type="text" class="form-control iptTime" placeholder="00:00"/><span class="btnRemove glyphicon glyphicon-remove-sign"></span></td><td class="executor"></td>';
            var rowspan = $(this).parent().attr('rowspan') ? $(this).parent().attr('rowspan') : 1;
            var $tr = $(this).closest('tr');
            rowspan = parseInt(rowspan);
            $(this).parent().attr('rowspan', ++rowspan);

            for(var i = 1; i < _this.dayCount; i++){
                strTd += ('<td class="executor"></td>');
            }
            $('tr[data-id="'+ $tr.attr('data-id') +'"]:last').after('<tr data-id="'+ $tr[0].dataset.id +'" class="subRow">'+ strTd +'</tr>');

        });

        //删除行
        this.$table.on('click', '.btnRemove', function(){
            var $tr = $(this).closest('tr');

            infoBox.confirm('确认删除该行', okCallback) ;

            function okCallback(){
                if($tr.hasClass('parentRow')){
                    if($('[data-id="'+ $tr[0].dataset.id +'"]').length <= 1){//如果删除第一行,且是最后一行
                        $tr.find('.time input').val('');
                        $tr.children('.executor').text('');
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
            $('.executor.hover').removeClass('hover');
            $this.addClass('hover');
            personCopy($this);
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
            var $itemActive = _this.$listExecutor.find('.active');
            if ($itemActive.length > 0) {
                _this.dragExecutorId = $itemActive.attr('data-id');
                personCopy($(this));
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
            $(this).parent().attr('data-executorId','').html('');
        });

        //输入框验证
        this.$table.on('blur', 'input', function(e){
            //this.value = this.value.replace(/\D/g,'')
            var result = this.value.match(/^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/);
            if(this.value != '' && result == null) {
                $(this).val('');
                $(this).addClass('danger');
            }else{
                $(this).removeClass('danger');
            }
        });

        var $datetimepicker = $('.datetimepicker');
        $datetimepicker.datetimepicker('remove');
        $datetimepicker.datetimepicker({
            format: "yyyy-mm-dd",
            autoclose: true,
            todayBtn: true,
            initialDate: new Date(),
            startView: 2,
            minView: 2,
            startDate: new Date()
        });
    }

    PatrolSchedule.prototype.getMission = function(){
        WebAPI.get('/patrol/mission/get/' + AppConfig.projectId).done(function(result){
            if(!result.data || $.isEmptyObject(result.data)) return;
            _this.renderData(result.data[0]);
        });
    }

    PatrolSchedule.prototype.getPath = function(){
        WebAPI.get('/patrol/path/getAll/' + AppConfig.projectId).done(function(result){
            if(!result.data || result.data.length == 0) return;
            var strHtml = '';
            for(var i = 0; i < result.data.length; i++){
                strHtml += ('<tr data-id="' + result.data[i]._id + '" class="parentRow"><td><span>' + result.data[i].name + '</span><span class="btnAddRow glyphicon glyphicon-plus-sign"></span></td><td class="time"><input type="text" class="form-control iptTime" placeholder="00:00"/><span class="btnRemove glyphicon glyphicon-remove-sign"></span></td><td class="executor"></td></tr>');
            }
            _this.$table.find('tbody').html(strHtml);
        });
    }

    PatrolSchedule.prototype.getExecutor = function(){
        this.$listExecutor = $('#listPerson');
        WebAPI.get('/patrol/executor/getList/' + AppConfig.projectId).done(function(result){
            if(!result.data || result.data.length == 0) return;
            var strHtml = '';
            for(var i = 0, id, name; i < result.data.length; i++){
                id = result.data[i]._id;
                name = result.data[i].name;
                _this.dictExecutor[id] = name;
                strHtml += ('<li class="itemExecutor" data-id="' + id + '"  draggable="true">' + name + '</li>');
            }
            _this.$listExecutor.html(strHtml);

            _this.getMission();
            _this.attachEvent();
        });
    }

    PatrolSchedule.prototype.saveMission = function(){
        var data = {
            startTime: _this.$iptStartDate.val().format('yyyy-mm-dd').split(' ')[0],
            interval: $('#selCycle').val(),
            option: {}
        };
        var $trs = this.$table.find('tbody tr');
        if(this.$table[0].dataset.id){
            data._id = this.$table[0].dataset.id
        }
        for(var i = 0, $tr, time, $tds, arrExecutor; i < $trs.length; i++){
            $tr = $($trs[i]);
            time = $tr.find('.iptTime').val();
            if(!time) continue;
            $tds = $tr.children('.executor');
            arrExecutor = [];
            !data.option[$tr[0].dataset.id] && (data.option[$tr[0].dataset.id] = {})
            for(var j = 0, $td; j < $tds.length; j++){
                $td = $tds[j];
                arrExecutor.push($td.dataset.executorid);
            }
            data.option[$tr[0].dataset.id][time] = arrExecutor;
        }
        Spinner.spin($('#paneRightCtn')[0])
        WebAPI.post('/patrol/mission/save/' + AppConfig.projectId, data).done(function(result){
            if(result){
                infoBox.alert('保存成功',{type: 'success', delay: 1000});
            }
        }).always(function(){
            Spinner.stop();
        });
    };

    PatrolSchedule.prototype.renderData = function(data){
        this.$table.attr('data-id', data._id);
        _this.$iptStartDate.val(data.startTime.split(' ')[0]);
        $('#selCycle').val(data.interval);
        if(data.interval != this.dayCount) this.drawTable(data.interval);

        //render table
        for(var i in data.option){
            var $tr = $('[data-id="'+ i +'"]');
            var $trParent = $tr;
            var timeCount = 1;//一条线路上时间个数
            for(var j in data.option[i]){
                var index = 2; //tr 的td 下标, 从2开始是人员
                //如果timeCount大于1, 增加一行
                if(timeCount > 1){
                    index = 1;
                    $trParent.children('td:eq(0)').attr('rowspan', timeCount);
                    var strTd = '<td class="time"><input type="text" class="form-control iptTime" placeholder="00:00"/><span class="btnRemove glyphicon glyphicon-remove-sign"></span></td><td class="executor"></td>';
                    for(var k = 1; k < _this.dayCount; k++){
                        strTd += ('<td class="executor"></td>');
                    }
                    $tr.after('<tr data-id="'+ $tr[0].dataset.id +'" class="subRow">'+ strTd +'</tr>');

                    $tr = $tr.next('tr');
                }
                var arrExecutor = data.option[i][j];

                $tr.find('.time .iptTime').val(j);
                if(arrExecutor && arrExecutor instanceof Array && arrExecutor.length > 0){
                    arrExecutor.forEach(function(executor){
                        if(executor){
                            $tr.children('td:eq(' + index + ')').attr('data-executorid', executor).html('<div class="executorDiv" draggable="true">' + _this.dictExecutor[executor] + '<span class="removeExecutor glyphicon glyphicon-remove-sign"></span></div>');
                        }
                        index++;
                    });
                }
                timeCount ++;
            }
        }

    }

    PatrolSchedule.prototype.drawTable = function(value){
        var cyclyNum = isNaN(value) ? this.dayCount : parseInt(value);
        var strTHead = '<th>巡更路线</th><th>时间</th>';
        var diff = cyclyNum - _this.dayCount;

        //thead
        for(var i = 1; i < cyclyNum + 1; i++){
            strTHead += ('<th>'+ i +'</th>');
        }
        //strTHead += '<th>操作</th>'
        _this.$table.find('thead tr').html(strTHead);

        //tbody
        _this.$table.find('tbody tr').each(function(){
            //$(this).children('.tdOperation').remove();
            var trCount = $(this).children('td').length;
            if(diff > 0){
                var strTd = '';
                for(var i = 0; i < diff; i++){
                    strTd += ('<td class="executor"></td>');
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


        _this.dayCount = cyclyNum;
    }

    return PatrolSchedule;
}());