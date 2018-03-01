/**
 * Created by vicky on 2016/3/1.
 */
var PatrolReport = (function(){
    var _this;
    function PatrolReport(){
        _this = this;
        this.container = $('#paneRightCtn');
    }

    PatrolReport.prototype.init = function(){
        var $tableReport = $('#tableReport');
        var $inputPatrolTime = $('#inputPatrolTime');
        var $btnTaskReport = $('#btnTaskReport');
        var $btnPeopleReport = $('#btnPeopleReport');
        var tpl = '',allTpl = '';
        var nowPatrolTime = new Date().format('yyyy-MM');
        if($inputPatrolTime.val() == ''){
            $inputPatrolTime.val(nowPatrolTime);
        }
        var startPatrolTime = $inputPatrolTime.val() + '-01';
        var endPatrolYear = parseInt($inputPatrolTime.val().split('-')[0]);
        var endPatrolMonth = parseInt($inputPatrolTime.val().split('-')[1]);
        var endPatrolTime;
        if(endPatrolMonth < 9){
            endPatrolMonth += 1;
            endPatrolTime = endPatrolYear +'-0'+ endPatrolMonth + '-01';
        }else if(endPatrolMonth === 12){
            endPatrolMonth = 1;
            endPatrolYear += 1;
            endPatrolTime = endPatrolYear +'-0'+ endPatrolMonth + '-01';
        }else{
            endPatrolMonth += 1;
            endPatrolTime = endPatrolYear +'-'+ endPatrolMonth + '-01';
        }
        if(!$btnTaskReport.hasClass('active')){
            $btnTaskReport.addClass('active');
        }
        $btnPeopleReport.removeClass('active');
        var target = $tableReport.find('tbody')[0];
        Spinner.spin(target);
        WebAPI.get('/patrol/report/getBaseOnMission/' + AppConfig.projectId + '/'+ startPatrolTime + '/' + endPatrolTime).done(function(result){
            var reportData = result.data;
            if(parseInt($inputPatrolTime.val().split('-')[1]) === parseInt(new Date().format('yyyy-MM').split('-')[1])){
                for(var i=0;i< reportData.length;i++){
                    var len = reportData[i].data.length - 1;
                    for(var j = 0;j < len;j++){
                        if(reportData[i].data[j] == 0){
                            tpl +='<td data-day="'+ (j+1) +'"><span class="xugengbad glyphicon glyphicon-remove" aria-hidden="true"></span></td>';
                        }else if(reportData[i].data[j] == 1){
                            tpl +='<td data-day="'+ (j+1) +'"><span class="xugengbad glyphicon glyphicon-ok" aria-hidden="true"></span></td>';
                        }else{
                            tpl +='<td data-day="'+ (j+1) +'"><span class="xugengbad" aria-hidden="true">-</span></td>';
                        }
                    }
                    tpl += '<td data-day="'+ (len+1) +'"><span class="xugengbad glyphicon glyphicon-minus" aria-hidden="true"></span></td>';
                    for(var k = len +1;k < 31;k++){
                        tpl +='<td>-</td>';
                    }
                    allTpl += '<tr id="'+reportData[i].pathId +'"><td>'+ reportData[i].name +'</td>'+ tpl +'</tr>';
                    tpl = '';
                }
            }else{
                for(var i=0;i< reportData.length;i++){
                    var len = reportData[i].data.length;
                    for(var j = 0;j < len;j++){
                        if(reportData[i].data[j] == 0){
                            tpl +='<td data-day="'+ (j+1) +'"><span class="xugengbad glyphicon glyphicon-remove" aria-hidden="true"></span></td>';
                        }else if(reportData[i].data[j] == 1){
                            tpl +='<td data-day="'+ (j+1) +'"><span class="xugengbad glyphicon glyphicon-ok" aria-hidden="true"></span></td>';
                        }else{
                            tpl +='<td data-day="'+ (j+1) +'"><span class="xugengbad" aria-hidden="true">-</span></td>';
                        }
                    }
                    for(var k = len +1;k < 31;k++){
                        tpl +='<td>-</td>';
                    }
                    allTpl += '<tr id="'+reportData[i].pathId +'"><td>'+ reportData[i].name +'</td>'+ tpl +'</tr>';
                    tpl = '';
                }
            }
            $tableReport.find('tbody').html(allTpl);
            $('#patrolPercent').hide();
            $('#tableReport thead th:first').text('巡更任务');
            $('#tableReport tbody tr td span.glyphicon').on('click',function(){
                var pathId = $(this).closest('tr').attr('id');
                var patrolDayTime = $(this).parent('td').data('day');
                var patrolMonthTime = $inputPatrolTime.val();
                var startPatrolDayTime,endPatrolDayTime;
                if(patrolDayTime < 9){
                    startPatrolDayTime = patrolMonthTime + '-0'+ patrolDayTime;
                    endPatrolDayTime = patrolMonthTime + '-0'+ (patrolDayTime + 1);
                }else if(patrolDayTime == 9){
                    startPatrolDayTime = patrolMonthTime + '-0'+ patrolDayTime;
                    endPatrolDayTime = patrolMonthTime + '-' + (patrolDayTime + 1);
                }else{
                    startPatrolDayTime = patrolMonthTime + '-' + patrolDayTime;
                    endPatrolDayTime = patrolMonthTime + '-' + (patrolDayTime + 1);
                }
                _this.checkPatrolMessage(pathId,startPatrolDayTime,endPatrolDayTime);
            })
        }).always(function(){
            Spinner.stop();
        })
    };

    PatrolReport.prototype.show = function(){
        var _this = this;
        WebAPI.get('/static/app/Patrol/views/patrolReport.html').done(function(resultHtml) {
            _this.container.html(resultHtml);
            var $btnTaskReport = $('#btnTaskReport');
            var $btnPeopleReport = $('#btnPeopleReport');
            var $inputPatrolTime = $('#inputPatrolTime');
            _this.init();
            $btnTaskReport.on('click',function(){
                _this.init();
            });
            $btnPeopleReport.on('click',function(){
                _this.peopleInit();
            });
            $('#prev-month').on('click',function(){
                var $inputYear = parseInt($inputPatrolTime.val().split('-')[0]);
                var $inputMonth = parseInt($inputPatrolTime.val().split('-')[1]);
                if($inputMonth < 11 && $inputMonth > 1){
                    $inputMonth -= 1;
                    $inputMonth = '0' + $inputMonth;
                }else if($inputMonth === 1){
                    $inputYear -= 1;
                    $inputMonth = '12';
                }else{
                    $inputMonth -=1;
                }
                var nowTime = $inputYear + '-' + $inputMonth;
                $inputPatrolTime.val(nowTime);
                if($btnTaskReport.hasClass('active')){
                    _this.init();
                }
                if($btnPeopleReport.hasClass('active')){
                    _this.peopleInit();
                }
            });
            $('#next-month').on('click',function(){
                var $inputYear = parseInt($inputPatrolTime.val().split('-')[0]);
                var $inputMonth = parseInt($inputPatrolTime.val().split('-')[1]);
                if($inputMonth < 9){
                    $inputMonth += 1;
                    $inputMonth = '0' + $inputMonth;
                }else if($inputMonth === 12){
                    $inputYear += 1;
                    $inputMonth = '01';
                }else{
                    $inputMonth += 1;
                }
                var nowTime = $inputYear + '-' + $inputMonth;
                $inputPatrolTime.val(nowTime);
                if($btnTaskReport.hasClass('active')){
                    _this.init();
                }
                if($btnPeopleReport.hasClass('active')){
                    _this.peopleInit();
                }
            })
            $inputPatrolTime.on('change',function(){
                if($btnTaskReport.hasClass('active')){
                    _this.init();
                }
                if($btnPeopleReport.hasClass('active')){
                    _this.peopleInit();
                }
            })
        })
    };
    PatrolReport.prototype.peopleInit = function(){
        var $tableReport = $('#tableReport');
        var $inputPatrolTime = $('#inputPatrolTime');
        var $btnTaskReport = $('#btnTaskReport');
        var $btnPeopleReport = $('#btnPeopleReport');
        $btnTaskReport.removeClass('active');
        $btnPeopleReport.addClass('active');
        var tpl = '',allTpl = '';
        var nowPatrolTime = new Date().format('yyyy-MM');
        if($inputPatrolTime.val() == ''){
            $inputPatrolTime.val(nowPatrolTime);
        }
        var startPatrolTime = $inputPatrolTime.val() + '-01';
        var endPatrolYear = parseInt($inputPatrolTime.val().split('-')[0]);
        var endPatrolMonth = parseInt($inputPatrolTime.val().split('-')[1]);
        var endPatrolTime;
        if(endPatrolMonth < 9){
            endPatrolMonth += 1;
            endPatrolTime = endPatrolYear +'-0'+ endPatrolMonth + '-01';
        }else if(endPatrolMonth === 12){
            endPatrolMonth = 1;
            endPatrolYear += 1;
            endPatrolTime = endPatrolYear +'-0'+ endPatrolMonth + '-01';
        }else{
            endPatrolMonth += 1;
            endPatrolTime = endPatrolYear +'-'+ endPatrolMonth + '-01';
        }
        var target = $tableReport.find('tbody')[0];
        Spinner.spin(target);
        WebAPI.get('/patrol/report/getBaseOnMan/' + AppConfig.projectId + '/'+ startPatrolTime + '/' + endPatrolTime).done(function(result) {
            var reportData = result.data.data;
            if(parseInt($inputPatrolTime.val().split('-')[1]) === parseInt(new Date().format('yyyy-MM').split('-')[1])){
                for(var i=0;i< reportData.length;i++){
                    var len = reportData[i].data.length - 1;
                    tpl += '<tr id='+reportData[i].userId +'><td>'+ reportData[i].name +'</td><td>'+ String(reportData[i].percent) +'</td>';
                    for(var j = 0;j < len;j++){
                        if(reportData[i].data[j] == 0){
                            tpl +='<td data-day="'+ (j+1) +'"><span class="xugengbad glyphicon glyphicon-remove" aria-hidden="true"></span></td>';
                        }else if(reportData[i].data[j] == 1){
                            tpl +='<td data-day="'+ (j+1) +'"><span class="xugengbad glyphicon glyphicon-ok" aria-hidden="true"></span></td>';
                        }else{
                            tpl +='<td data-day="'+ (j+1) +'"><span class="xugengbad" aria-hidden="true">-</span></td>';
                        }
                    }
                    tpl += '<td data-day="'+ (j+1) +'"><span class="xugengbad glyphicon glyphicon-minus" aria-hidden="true"></span></td>';
                    for(var k = len+1;k < 31;k++){
                        tpl +='<td>-</td>';
                    }
                    tpl += '</tr>';
                    allTpl += tpl;
                    tpl = '';
                }
            }else{
                for(var i=0;i< reportData.length;i++){
                    var len = reportData[i].data.length;
                    tpl += '<tr id='+reportData[i].userId +'><td>'+ reportData[i].name +'</td><td>'+ String(reportData[i].percent) +'</td>';
                    for(var j = 0;j < len;j++){
                        if(reportData[i].data[j] == 0){
                            tpl +='<td data-day="'+ (j+1) +'"><span class="xugengbad glyphicon glyphicon-remove" aria-hidden="true"></span></td>';
                        }else if(reportData[i].data[j] == 1){
                            tpl +='<td data-day="'+ (j+1) +'"><span class="xugengbad glyphicon glyphicon-ok" aria-hidden="true"></span></td>';
                        }else{
                            tpl +='<td data-day="'+ (j+1) +'"><span class="xugengbad" aria-hidden="true">-</span></td>';
                        }
                    }
                    for(var k = len+1;k < 31;k++){
                        tpl +='<td>-</td>';
                    }
                    tpl += '</tr>';
                    allTpl += tpl;
                    tpl = '';
                }
            }
            $tableReport.find('tbody').html(allTpl);
            $('#patrolPercent').show();
            $('#tableReport thead th:first').text('巡更人员');
            $('#tableReport tbody tr td span.glyphicon').on('click',function(){
                var executorId = $(this).closest('tr').attr('id');
                var patrolDayTime = $(this).parent('td').data('day');
                var patrolMonthTime = $inputPatrolTime.val();
                var startPatrolDayTime,endPatrolDayTime;
                if(patrolDayTime < 9){
                    startPatrolDayTime = patrolMonthTime + '-0'+ patrolDayTime;
                    endPatrolDayTime = patrolMonthTime + '-0'+ (patrolDayTime + 1);
                }else if(patrolDayTime == 9){
                    startPatrolDayTime = patrolMonthTime + '-0'+ patrolDayTime;
                    endPatrolDayTime = patrolMonthTime + '-' + (patrolDayTime + 1);
                }else{
                    startPatrolDayTime = patrolMonthTime + '-' + patrolDayTime;
                    endPatrolDayTime = patrolMonthTime + '-' + (patrolDayTime + 1);
                }
                _this.checkPeoplePatrolMessage(executorId,startPatrolDayTime,endPatrolDayTime);
            })
        }).always(function(){
            Spinner.stop();
        })
    };
    PatrolReport.prototype.checkPatrolMessage = function(pathId,startPatrolDayTime,endPatrolDayTime){
        var _this = this;
        var $pathModal = $('#pathReportModal');
        $pathModal.find('h3.modal-title').text('巡更任务查看');
        $pathModal.find('.panel-body').empty();
        $pathModal.modal('show');
        var target = $pathModal.find('.panel-body')[0];
        Spinner.spin(target);
        WebAPI.get('/patrol/log/getByPathId/' +  AppConfig.projectId + '/'+ pathId +'/'+ startPatrolDayTime + '/' + endPatrolDayTime).done(function(result){
            var tpl = '';
            if(result.data.length === 0){tpl = '该路线未去巡更！'}
            for(var i = 0;i < result.data.length;i++){
                var startTime = result.data[i].startTime;
                startTime = (startTime.split('-')[1]+'-'+startTime.split('-')[2]).split(':')[0]+':'+(startTime.split('-')[1]+startTime.split('-')[2]).split(':')[1];
                var endTime = result.data[i].endTime;
                if(endTime){
                    endTime = (endTime.split('-')[1]+'-'+endTime.split('-')[2]).split(':')[0]+':'+(endTime.split('-')[1]+endTime.split('-')[2]).split(':')[1];
                }else{
                    endTime = '未去巡查';
                }
                tpl += '<div><div class="divPathTitle" style="margin-bottom: 10px;"><a>开始：'+ startTime +'</a><span>';
                for(var id in result.data[i].executor){
                    tpl += result.data[i].executor[id];
                }
                tpl += '</span><a>结束：'+ endTime +'</a></div><ul class="list-group"><li>';
                for(var pathId in result.data[i].path){
                    tpl += result.data[i].path[pathId];
                }
                tpl += '<button class="btn btn-success btn-xs btnCheck" type="button" style="float: right;" data-index="'+ i +'">查看详情</button><li><ol>';
                for(var j = 0;j < result.data[i].data.length - 1;j++){
                    if(!result.data[i].data[j].time){
                        tpl += '<li><a>'+ result.data[i].data[j].point +'(未去巡查) -> </a></li>';
                    }else{
                        tpl += '<li><a>'+ result.data[i].data[j].point +'('+ result.data[i].data[j].time +') -> </a></li>';
                    }
                }
                if(!result.data[i].data[result.data[i].data.length-1].time){
                    tpl += '<li><a>'+ result.data[i].data[result.data[i].data.length-1].point +'(未去巡查)</a></li>';
                }else{
                    tpl += '<li><a>'+ result.data[i].data[result.data[i].data.length-1].point +'('+ result.data[i].data[result.data[i].data.length-1].time +')</a></li>';
                }
                tpl += '</ol></li></ul></div>';
            }
            $pathModal.find('.panel-body').html(tpl);
            $('.btnCheck').on('click',function(){
                var index = $(this).attr('data-index');
                _this.checkDetails(pathId,startPatrolDayTime,endPatrolDayTime,index);
            })
        }).always(function(){
            Spinner.stop();
        })
    };
    PatrolReport.prototype.checkDetails = function(pathId,startPatrolDayTime,endPatrolDayTime,index){
        var $pathDetailsModal = $('#pathDetailsModal');
        $pathDetailsModal.find('.panel-body').empty();
        $pathDetailsModal.modal('show');
        var target = $pathDetailsModal.find('.panel-body')[0];
        Spinner.spin(target);
        WebAPI.get('/patrol/log/getByPathId/' +  AppConfig.projectId + '/'+ pathId +'/'+ startPatrolDayTime + '/' + endPatrolDayTime).done(function(result) {
            var dpl = '<ul>';
            var details = result.data[index].data;
            for(var j = 0;j < details.length;j++){
                if(!details[j].time){
                    dpl += '<li><span>'+ details[j].point +'</span><div><a style="color:#E8E822;">(未去巡查)</a>';
                }else{
                    dpl += '<li><span>'+ details[j].point +'</span><div><a>'+ details[j].time +'</a>';
                }
                if(details[j].error === 0){
                    dpl += '<a style="color:#1AD41A;">设备正常</a></div>';
                }else if(details[j].error === 1){
                    dpl += '<a style="color:red;">设备异常</a></div>';
                    if(details[j].msg){
                        dpl += '<span>异常信息：'+ details[j].msg +'</span>';
                    }
                    if(details[j].arrPic){
                        for(var k=0;k< details[j].arrPic.length;k++){
                            dpl+= '<img class="img-responsive" src="'+ details[j].arrPic[k] +'">'
                        }
                    }
                }else{
                    dpl += '';
                }
                dpl +='</li>';
            }
            dpl += '</ul>';
            $pathDetailsModal.find('.panel-body').html(dpl);
        }).always(function(){
            Spinner.stop();
        })
    }
    PatrolReport.prototype.checkPeoplePatrolMessage = function(executorId,startPatrolDayTime,endPatrolDayTime){
        var $pathModal = $('#pathReportModal');
        $pathModal.find('h3.modal-title').text('巡更人任务查看');
        $pathModal.find('.panel-body').empty();
        $pathModal.modal('show');
        var target = $pathModal.find('.panel-body')[0];
        Spinner.spin(target);
        WebAPI.get('/patrol/log/getByExecutorId/' +  AppConfig.projectId + '/'+ executorId +'/'+ startPatrolDayTime + '/' + endPatrolDayTime).done(function(result){
            var tpl = '';
            if(result.data.length === 0) {tpl="该人员未去巡更！"};
            for(var i = 0;i < result.data.length;i++){
                var startTime = result.data[i].startTime;
                startTime = (startTime.split('-')[1]+'-'+startTime.split('-')[2]).split(':')[0]+':'+(startTime.split('-')[1]+startTime.split('-')[2]).split(':')[1];
                var endTime = result.data[i].endTime;
                if(endTime){
                    endTime = (endTime.split('-')[1]+'-'+endTime.split('-')[2]).split(':')[0]+':'+(endTime.split('-')[1]+endTime.split('-')[2]).split(':')[1];
                }else{
                    endTime = '未去巡查';
                }
                tpl += '<div><div class="divPathTitle" style="margin-bottom: 10px;"><a>开始：'+ startTime +'</a><span>';
                for(var id in result.data[i].executor){
                    tpl += result.data[i].executor[id];
                }
                tpl += '</span><a>结束：'+ endTime +'</a></div><ul class="list-group"><li>';
                for(var pathId in result.data[i].path){
                    tpl += result.data[i].path[pathId];
                }
                tpl += '<button class="btn btn-success btn-xs btnCheckPeople" type="button" style="float: right;" data-index="'+ i +'">查看详情</button></li><li><ol>';
                for(var j = 0;j < result.data[i].data.length - 1;j++){
                    if(!result.data[i].data[j].time){
                        tpl += '<li><a>'+ result.data[i].data[j].point +'(未去巡查) -> </a></li>';
                    }else{
                        tpl += '<li><a>'+ result.data[i].data[j].point +'('+ result.data[i].data[j].time +') -> </a></li>';
                    }
                }
                if(!result.data[i].data[result.data[i].data.length-1].time){
                    tpl += '<li><a>'+ result.data[i].data[result.data[i].data.length-1].point +'(未去巡查)</a></li>';
                }else{
                    tpl += '<li><a>'+ result.data[i].data[result.data[i].data.length-1].point +'('+ result.data[i].data[result.data[i].data.length-1].time +')</a></li>';
                }
                tpl += '</ol></li></ul></div>';
            }
            $pathModal.find('.panel-body').html(tpl);
            $('.btnCheckPeople').on('click',function(){
                var index = $(this).attr('data-index');
                _this.checkPeopleDetails(executorId,startPatrolDayTime,endPatrolDayTime,index);
            })
        }).always(function(){
            Spinner.stop();
        });
    };
    PatrolReport.prototype.checkPeopleDetails = function(executorId,startPatrolDayTime,endPatrolDayTime,index){
        var $pathDetailsModal = $('#pathDetailsModal');
        $pathDetailsModal.find('.panel-body').empty();
        $pathDetailsModal.modal('show');
        var target = $pathDetailsModal.find('.panel-body')[0];
        Spinner.spin(target);
        WebAPI.get('/patrol/log/getByExecutorId/' +  AppConfig.projectId + '/'+ executorId +'/'+ startPatrolDayTime + '/' + endPatrolDayTime).done(function(result) {
            var dpl = '<ul>';
            var details = result.data[index].data;
            for(var j = 0;j < details.length;j++){
                if(!details[j].time){
                    dpl += '<li><span>'+ details[j].point +'</span><div><a style="color:#E8E822;">(未去巡查)</a>';
                }else{
                    dpl += '<li><span>'+ details[j].point +'</span><div><a>'+ details[j].time +'</a>';
                }
                if(details[j].error === 0){
                    dpl += '<a style="color:#1AD41A;">设备正常</a></div>';
                }else if(details[j].error === 1){
                    dpl += '<a style="color:red;">设备异常</a></div>';
                    if(details[j].msg){
                        dpl += '<span>异常信息：'+ details[j].msg +'</span>';
                    }
                    if(details[j].arrPic){
                        for(var k=0;k< details[j].arrPic.length;k++){
                            dpl+= '<img class="img-responsive" src="'+ details[j].arrPic[k] +'">'
                        }
                    }
                }else{
                    dpl += '';
                }
                dpl +='</li>';
            }
            dpl += '</ul>';
            $pathDetailsModal.find('.panel-body').html(dpl);
        }).always(function(){
            Spinner.stop();
        })
    }
    PatrolReport.prototype.close = function(){
        this.container.empty();
    };
    
    return PatrolReport;
}());