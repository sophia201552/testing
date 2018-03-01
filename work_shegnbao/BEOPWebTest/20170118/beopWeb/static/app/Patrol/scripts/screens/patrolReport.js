/**
 * Created by vicky on 2016/3/1.
 */
var PatrolReport = (function(){
    var _this;
    function PatrolReport(screen){
        _this = this;
        this.container = $('#paneRightCtn');
        if(screen){
            screen.close();
            this.screen = screen;
        }
    }

    //任务报表显示
    PatrolReport.prototype.init = function(){
        var _this = this;
        var $tableReport = $('#tableReport');
        var $inputPatrolTime = $('#inputPatrolTime');
        var $btnTaskReport = $('#btnTaskReport');
        var $btnPeopleReport = $('#btnPeopleReport');
        var tpl = '',allTpl = '',nowPatrolTime;
        if(this.screen.startDate){
            nowPatrolTime = this.screen.startDate;
        }else{
            nowPatrolTime = new Date().format('yyyy-MM-dd');
        }
        if($inputPatrolTime.val() == ''){
                $inputPatrolTime.val(nowPatrolTime);
        }
        var inputTime = new Date($inputPatrolTime.val());
        var startPatrolTime = this.screen.getMonday(inputTime);
        var endPatrolTime = this.screen.getSunday(inputTime);

        var mondayTime = new Date(startPatrolTime).getTime();
        for(var i = 0; i < 7; i++){
            var tempTime = mondayTime + i*86400000;
            $('#tableReport th[data-date]')[i].innerHTML = new Date(tempTime).format('MM-dd');
        }
        //var startPatrolTime = $inputPatrolTime.val() + '-01';
        //var endPatrolYear = parseInt($inputPatrolTime.val().split('-')[0]);
        //var endPatrolMonth = parseInt($inputPatrolTime.val().split('-')[1]);
        //var endPatrolTime;
        //if(endPatrolMonth < 9){
        //    endPatrolMonth += 1;
        //    endPatrolTime = endPatrolYear +'-0'+ endPatrolMonth + '-01';
        //}else if(endPatrolMonth === 12){
        //    endPatrolMonth = 1;
        //    endPatrolYear += 1;
        //    endPatrolTime = endPatrolYear +'-0'+ endPatrolMonth + '-01';
        //}else{
        //    endPatrolMonth += 1;
        //    endPatrolTime = endPatrolYear +'-'+ endPatrolMonth + '-01';
        //}
        if(!$btnTaskReport.hasClass('active')){
            $btnTaskReport.addClass('active');
        }
        $btnPeopleReport.removeClass('active');
        var target = $tableReport.find('tbody')[0];
        Spinner.spin(target);
        WebAPI.get('/patrol/report/getBaseOnMission/' + AppConfig.projectId + '/'+ startPatrolTime + '/' + endPatrolTime).done(function(result){
            var reportData = result.data;
            var time = result.time;
            //if(parseInt($inputPatrolTime.val().split('-')[1]) === parseInt(new Date().format('yyyy-MM').split('-')[1])){
                for(var i=0;i< reportData.length;i++){
                    if(reportData[i].status === 1){
                        var len = reportData[i].data.length;
                        if(len === 0){
                            for(var k = 0;k < 7;k++){
                                tpl +='<td>-</td>';
                            }
                        }else{
                            if(time.length === 7){
                                for(var j = 0;j < len;j++){
                                    if(reportData[i].data[j] == 0){
                                        tpl +='<td data-day="'+ time[j] +'"><span class="xugengbad glyphicon glyphicon-remove" aria-hidden="true"></span></td>';
                                    }else if(reportData[i].data[j] == 1){
                                        tpl +='<td data-day="'+ time[j] +'"><span class="xugengbad glyphicon glyphicon-ok" aria-hidden="true"></span></td>';
                                    }else if(reportData[i].data[j] == 2){
                                        tpl +='<td data-day="'+ time[j] +'"><span class="glyphicon" style="cursor: pointer;color: #31b0d5;">▲</span></td>';
                                    }else{
                                        tpl +='<td data-day="'+ time[j] +'"><span class="xugengbad" aria-hidden="true">-</span></td>';
                                    }
                                }
                            }else{
                                for(var j = 0;j < len-1;j++){
                                    if(reportData[i].data[j] == 0){
                                        tpl +='<td data-day="'+ time[j] +'"><span class="xugengbad glyphicon glyphicon-remove" aria-hidden="true"></span></td>';
                                    }else if(reportData[i].data[j] == 1){
                                        tpl +='<td data-day="'+ time[j] +'"><span class="xugengbad glyphicon glyphicon-ok" aria-hidden="true"></span></td>';
                                    }else if(reportData[i].data[j] == 2){
                                        tpl +='<td data-day="'+ time[j] +'"><span class="glyphicon" style="cursor: pointer;color: #31b0d5;">▲</span></td>';
                                    }else{
                                        tpl +='<td data-day="'+ time[j] +'"><span class="xugengbad" aria-hidden="true">-</span></td>';
                                    }
                                }
                                if(reportData[i].data[len-1] === 1){
                                    tpl +='<td data-day="'+ time[len-1] +'"><span class="xugengbad glyphicon glyphicon-ok" aria-hidden="true"></span></td>';
                                }else{
                                    tpl += '<td data-day="'+ time[len-1] +'"><span class="xugengbad glyphicon glyphicon-minus" aria-hidden="true"></span></td>';
                                }
                                for(var k = len;k < 7;k++){
                                    tpl +='<td>-</td>';
                                }
                            }
                        }
                        allTpl += '<tr id="'+reportData[i].pathId +'"><td>'+ reportData[i].name +'</td>'+ tpl +'</tr>';
                        tpl = '';
                    }
                }
            //}else{
            //    for(var i=0;i< reportData.length;i++){
            //        var len = reportData[i].data.length;
            //        for(var j = 0;j < len -1;j++){
            //            if(reportData[i].data[j] == 0){
            //                tpl +='<td data-day="'+ (j+1) +'"><span class="xugengbad glyphicon glyphicon-remove" aria-hidden="true"></span></td>';
            //            }else if(reportData[i].data[j] == 1){
            //                tpl +='<td data-day="'+ (j+1) +'"><span class="xugengbad glyphicon glyphicon-ok" aria-hidden="true"></span></td>';
            //            }else{
            //                tpl +='<td data-day="'+ (j+1) +'"><span class="xugengbad" aria-hidden="true">-</span></td>';
            //            }
            //        }
            //        for(var k = len -1;k < 31;k++){
            //            tpl +='<td>-</td>';
            //        }
            //        allTpl += '<tr id="'+reportData[i].pathId +'"><td>'+ reportData[i].name +'</td>'+ tpl +'</tr>';
            //        tpl = '';
            //    }
            //}
            $tableReport.find('tbody').html(allTpl);
            $('#patrolPercent').hide();
            $('#patrolDepartment').hide();
            $('#tableReport thead th:first').text('巡更任务');
            $('#tableReport tbody tr td span.glyphicon').on('click',function(){
                var pathId = $(this).closest('tr').attr('id');
                var startPatrolDayTime = $(this).parent('td').data('day');
                //var patrolMonthTime = $inputPatrolTime.val();
                //var startPatrolDayTime,endPatrolDayTime;
                //if(patrolDayTime < 9){
                //    startPatrolDayTime = patrolMonthTime + '-0'+ patrolDayTime;
                //    endPatrolDayTime = patrolMonthTime + '-0'+ (patrolDayTime + 1);
                //}else if(patrolDayTime == 9){
                //    startPatrolDayTime = patrolMonthTime + '-0'+ patrolDayTime;
                //    endPatrolDayTime = patrolMonthTime + '-' + (patrolDayTime + 1);
                //}else{
                //    startPatrolDayTime = patrolMonthTime + '-' + patrolDayTime;
                //    endPatrolDayTime = patrolMonthTime + '-' + (patrolDayTime + 1);
                //}
                _this.checkPatrolMessage(pathId,startPatrolDayTime);
            })
        }).always(function(){
            Spinner.stop();
            _this.screen.startDate = null;
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
            //日期控件前进按钮
            $('#prev-month').on('click',function(){
                var nowTime = new Date(new Date($inputPatrolTime.val()).getTime() - 7*86400000).format('yyyy-MM-dd');
                $inputPatrolTime.val(nowTime);
                if($btnTaskReport.hasClass('active')){
                    _this.init();
                }
                if($btnPeopleReport.hasClass('active')){
                    _this.peopleInit();
                }
            });
            //日期控件后退按钮
            $('#next-month').on('click',function(){
                var nowTime = new Date(new Date($inputPatrolTime.val()).getTime() + 7*86400000).format('yyyy-MM-dd');
                $inputPatrolTime.val(nowTime);
                if($btnTaskReport.hasClass('active')){
                    _this.init();
                }
                if($btnPeopleReport.hasClass('active')){
                    _this.peopleInit();
                }
            });
            //$('#prev-month').on('click',function(){
            //    var $inputYear = parseInt($inputPatrolTime.val().split('-')[0]);
            //    var $inputMonth = parseInt($inputPatrolTime.val().split('-')[1]);
            //    if($inputMonth < 11 && $inputMonth > 1){
            //        $inputMonth -= 1;
            //        $inputMonth = '0' + $inputMonth;
            //    }else if($inputMonth === 1){
            //        $inputYear -= 1;
            //        $inputMonth = '12';
            //    }else{
            //        $inputMonth -=1;
            //    }
            //    var nowTime = $inputYear + '-' + $inputMonth;
            //    $inputPatrolTime.val(nowTime);
            //    if($btnTaskReport.hasClass('active')){
            //        _this.init();
            //    }
            //    if($btnPeopleReport.hasClass('active')){
            //        _this.peopleInit();
            //    }
            //});
            //$('#next-month').on('click',function(){
            //    var $inputYear = parseInt($inputPatrolTime.val().split('-')[0]);
            //    var $inputMonth = parseInt($inputPatrolTime.val().split('-')[1]);
            //    if($inputMonth < 9){
            //        $inputMonth += 1;
            //        $inputMonth = '0' + $inputMonth;
            //    }else if($inputMonth === 12){
            //        $inputYear += 1;
            //        $inputMonth = '01';
            //    }else{
            //        $inputMonth += 1;
            //    }
            //    var nowTime = $inputYear + '-' + $inputMonth;
            //    $inputPatrolTime.val(nowTime);
            //    if($btnTaskReport.hasClass('active')){
            //        _this.init();
            //    }
            //    if($btnPeopleReport.hasClass('active')){
            //        _this.peopleInit();
            //    }
            //})
            //日期控件点击事件
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
    //人员报表显示
    PatrolReport.prototype.peopleInit = function(){
        var $tableReport = $('#tableReport');
        var $inputPatrolTime = $('#inputPatrolTime');
        var $btnTaskReport = $('#btnTaskReport');
        var $btnPeopleReport = $('#btnPeopleReport');
        $btnTaskReport.removeClass('active');
        $btnPeopleReport.addClass('active');
        var tpl = '',allTpl = '';
        var nowPatrolTime = new Date().format('yyyy-MM-dd');
        if($inputPatrolTime.val() == ''){
            $inputPatrolTime.val(nowPatrolTime);
        }
        var inputTime = new Date($inputPatrolTime.val());
        var startPatrolTime = this.screen.getMonday(inputTime);
        var endPatrolTime = this.screen.getSunday(inputTime);
        var mondayTime = new Date(startPatrolTime).getTime();
        for(var i = 0; i < 7; i++){
            var tempTime = mondayTime + i*86400000;
            $('#tableReport th[data-date]')[i].innerHTML = new Date(tempTime).format('MM-dd');
        }
        //var startPatrolTime = $inputPatrolTime.val() + '-01';
        //var endPatrolYear = parseInt($inputPatrolTime.val().split('-')[0]);
        //var endPatrolMonth = parseInt($inputPatrolTime.val().split('-')[1]);
        //var endPatrolTime;
        //if(endPatrolMonth < 9){
        //    endPatrolMonth += 1;
        //    endPatrolTime = endPatrolYear +'-0'+ endPatrolMonth + '-01';
        //}else if(endPatrolMonth === 12){
        //    endPatrolMonth = 1;
        //    endPatrolYear += 1;
        //    endPatrolTime = endPatrolYear +'-0'+ endPatrolMonth + '-01';
        //}else{
        //    endPatrolMonth += 1;
        //    endPatrolTime = endPatrolYear +'-'+ endPatrolMonth + '-01';
        //}
        var target = $tableReport.find('tbody')[0];
        Spinner.spin(target);
        WebAPI.get('/patrol/report/getBaseOnMan/' + AppConfig.projectId + '/'+ startPatrolTime + '/' + endPatrolTime).done(function(result) {
            var reportData = result.data.data;
            var time = result.data.time;
            //if(parseInt($inputPatrolTime.val().split('-')[1]) === parseInt(new Date().format('yyyy-MM').split('-')[1])){
                for(var i=0;i< reportData.length;i++){
                    if(reportData[i].status === 1){
                        var len = reportData[i].data.length;
                        if(reportData[i].partment){
                            tpl += '<tr id='+reportData[i].exectorId +'><td>'+ reportData[i].name +'</td><td>'+ String(reportData[i].partment) +'</td>';
                        }else{
                            tpl += '<tr id='+reportData[i].exectorId +'><td>'+ reportData[i].name +'</td><td>'+ '-' +'</td>';
                        }
                        if(reportData[i].percent === ''){
                            tpl += '<td>'+ '-' +'</td>';
                        }else{
                            tpl += '<td>'+ String(reportData[i].percent) +'</td>';
                        }

                        if(len === 0){
                            for(var k = 0;k < 7;k++){
                                tpl +='<td>-</td>';
                            }
                        }else{
                            if(time.length === 7){
                                for(var j = 0;j < len;j++){
                                    if(reportData[i].data[j] == 0){
                                        tpl +='<td data-day="'+ time[j] +'"><span class="xugengbad glyphicon glyphicon-remove" aria-hidden="true"></span></td>';
                                    }else if(reportData[i].data[j] == 1){
                                        tpl +='<td data-day="'+ time[j] +'"><span class="xugengbad glyphicon glyphicon-ok" aria-hidden="true"></span></td>';
                                    }else if(reportData[i].data[j] == 2){
                                        tpl +='<td data-day="'+ time[j] +'"><span class="glyphicon" style="cursor: pointer;color: #31b0d5;">▲</span></td>';
                                    }else{
                                        tpl +='<td data-day="'+ time[j] +'"><span class="xugengbad" aria-hidden="true">-</span></td>';
                                    }
                                }
                            }else{
                                for(var j = 0;j < len-1;j++){
                                    if(reportData[i].data[j] == 0){
                                        tpl +='<td data-day="'+ time[j] +'"><span class="xugengbad glyphicon glyphicon-remove" aria-hidden="true"></span></td>';
                                    }else if(reportData[i].data[j] == 1){
                                        tpl +='<td data-day="'+ time[j] +'"><span class="xugengbad glyphicon glyphicon-ok" aria-hidden="true"></span></td>';
                                    }else if(reportData[i].data[j] == 2){
                                        tpl +='<td data-day="'+ time[j] +'"><span class="glyphicon" style="cursor: pointer;color: #31b0d5;">▲</span></td>';
                                    }else{
                                        tpl +='<td data-day="'+ time[j] +'"><span class="xugengbad" aria-hidden="true">-</span></td>';
                                    }
                                }
                                if(reportData[i].data[len-1] == 1){
                                    tpl +='<td data-day="'+ time[len-1] +'"><span class="xugengbad glyphicon glyphicon-ok" aria-hidden="true"></span></td>';
                                }else{
                                    tpl += '<td data-day="'+ time[len-1] +'"><span class="xugengbad glyphicon glyphicon-minus" aria-hidden="true"></span></td>';
                                }
                                for(var k = len;k < 7;k++){
                                    tpl +='<td>-</td>';
                                }
                            }
                        }
                        tpl += '</tr>';
                        allTpl += tpl;
                        tpl = '';
                    }
                }
            //}else{
            //    for(var i=0;i< reportData.length;i++){
            //        var len = reportData[i].data.length;
            //        tpl += '<tr id='+reportData[i].userId +'><td>'+ reportData[i].name +'</td><td>'+ String(reportData[i].percent) +'</td>';
            //        for(var j = 0;j < len-1;j++){
            //            if(reportData[i].data[j] == 0){
            //                tpl +='<td data-day="'+ (j+1) +'"><span class="xugengbad glyphicon glyphicon-remove" aria-hidden="true"></span></td>';
            //            }else if(reportData[i].data[j] == 1){
            //                tpl +='<td data-day="'+ (j+1) +'"><span class="xugengbad glyphicon glyphicon-ok" aria-hidden="true"></span></td>';
            //            }else{
            //                tpl +='<td data-day="'+ (j+1) +'"><span class="xugengbad" aria-hidden="true">-</span></td>';
            //            }
            //        }
            //        for(var k = len-1;k < 31;k++){
            //            tpl +='<td>-</td>';
            //        }
            //        tpl += '</tr>';
            //        allTpl += tpl;
            //        tpl = '';
            //    }
            //}
            $tableReport.find('tbody').html(allTpl);
            $('#patrolPercent').show();
            $('#patrolDepartment').show();
            $('#tableReport thead th:first').text('巡更人员');
            $('#tableReport tbody tr td span.glyphicon').on('click',function(){
                var executorId = $(this).closest('tr').attr('id');
                var startPatrolDayTime = $(this).parent('td').data('day');
                //var patrolMonthTime = $inputPatrolTime.val();
                //var startPatrolDayTime,endPatrolDayTime;
                //if(patrolDayTime < 9){
                //    startPatrolDayTime = patrolMonthTime + '-0'+ patrolDayTime;
                //    endPatrolDayTime = patrolMonthTime + '-0'+ (patrolDayTime + 1);
                //}else if(patrolDayTime == 9){
                //    startPatrolDayTime = patrolMonthTime + '-0'+ patrolDayTime;
                //    endPatrolDayTime = patrolMonthTime + '-' + (patrolDayTime + 1);
                //}else{
                //    startPatrolDayTime = patrolMonthTime + '-' + patrolDayTime;
                //    endPatrolDayTime = patrolMonthTime + '-' + (patrolDayTime + 1);
                //}
                _this.checkPeoplePatrolMessage(executorId,startPatrolDayTime);
            })
        }).always(function(){
            Spinner.stop();
        })
    };
    //任务报表信息查看
    PatrolReport.prototype.checkPatrolMessage = function(pathId,startPatrolDayTime){
        var _this = this;
        var $pathModal = $('#pathReportModal');
        $pathModal.find('h3.modal-title').text('巡更任务查看');
        $pathModal.find('.panel-body').empty();
        $pathModal.modal('show');
        var target = $pathModal.find('.panel-body')[0];
        Spinner.spin(target);
        WebAPI.get('/patrol/log/getByPathId/' +  AppConfig.projectId + '/'+ pathId +'/'+ startPatrolDayTime).done(function(result){
            if(result.data.length === 0){tpl = '该路线未去巡更！'}
            for(var i = 0;i < result.data.length;i++){
                var tpl = '',atpl='';
                if(result.data[i].startTime) {
                    tpl += '<div><div class="pathName"><p>路线：';
                    for (var pathId in result.data[i].path) {
                        tpl += result.data[i].path[pathId];
                    }
                    tpl += '</p><p>('+ result.data[i].planTime +')</p>';
                    if(result.data[i].state === 2){
                        tpl += '<p style="color:red;">-延迟完成巡更</p>'
                    }
                    //else if(result.data[i].state === 1){
                    //    tpl += '<p style="color:red;">-未完成巡更</p>';
                    //}else{
                    //    tpl += '<p style="color:red;">-延迟完成巡更</p>';
                    //}
                    var startTime = result.data[i].startTime;
                    startTime = (startTime.split('-')[1] + '-' + startTime.split('-')[2]).split(':')[0] + ':' + (startTime.split('-')[1] + startTime.split('-')[2]).split(':')[1];
                    var endTime = result.data[i].endTime;
                    if (endTime) {
                        endTime = (endTime.split('-')[1] + '-' + endTime.split('-')[2]).split(':')[0] + ':' + (endTime.split('-')[1] + endTime.split('-')[2]).split(':')[1];
                    } else {
                        endTime = '未去巡查';
                    }
                    tpl += '</div><div class="divPathTitle" style="clear:both;"><a style="color:#646464;">开始：' + startTime + '</a><span>巡更人员：';
                    for (var id in result.data[i].executor) {
                        if(result.data[i].executor[id]){
                            tpl += result.data[i].executor[id];
                        }else{
                            tpl += '该人员已被删除!';
                        }
                    }
                    tpl += '</span><a style="color:#646464;">结束：' + endTime + '</a></div>';
                    tpl += '<ul class="list-group"><li style="clear:both;"><ol>';
                    for (var j = 0; j < result.data[i].data.length - 1; j++) {
                        if (result.data[i].data[j].error === 2) {
                            tpl += '<li><a>' + result.data[i].data[j].point + '(未去巡查) -> </a></li>';
                        } else if(result.data[i].data[j].error === -1) {
                            tpl += '<li><a>该点已删除 -> </a></li>';
                        }else  if(result.data[i].data[j].error === 0 || result.data[i].data[j].error === 1){
                            tpl += '<li><a>' + result.data[i].data[j].point + '(' + result.data[i].data[j].time + ') -> </a></li>';
                        }else{
                            var Na = i;
                            break;
                        }
                    }
                    if (result.data[i].data[result.data[i].data.length - 1].error === 2) {
                        tpl += '<li><a>' + result.data[i].data[result.data[i].data.length - 1].point + '(未去巡查)</a></li>';
                    } else if(result.data[i].data[result.data[i].data.length - 1].error === -1){
                        tpl += '<li><a>该点已删除</a></li>';
                    }else if(result.data[i].data[result.data[i].data.length - 1].error === 0 || result.data[i].data[result.data[i].data.length - 1].error === 1){
                        tpl += '<li><a>' + result.data[i].data[result.data[i].data.length - 1].point + '(' + result.data[i].data[result.data[i].data.length - 1].time + ')</a></li>';
                    }else{
                        var Na = i;
                    }
                    tpl += '</ol></li></ul><button class="btn btn-success btn-xs btnCheck" type="button" style="" data-index="' + i + '">查看详情</button></div>';
                }else{
                    for (var id in result.data[i].path) {
                        tpl += '<div><p>路线：'+ result.data[i].path[id] +'</p><p>('+ result.data[i].planTime+')->未去巡更！</p></div>';
                    }
                }
                if(Na === i){
                    for (var id in result.data[i].path) {
                        atpl += '<div><p>路线：'+ result.data[i].path[id] +'</p><p>('+ result.data[i].planTime+')->在完成巡更后有不恰当操作(删除点或者编辑路线的点)！</p></div>';
                    }
                }
                $pathModal.find('.panel-body').append(atpl||tpl);
            }
            $('.btnCheck').on('click',function(){
                var index = $(this).attr('data-index');
                _this.checkDetails(pathId,startPatrolDayTime,index);
            })
        }).always(function(){
            Spinner.stop();
        })
    };
    //任务报表信息每个路线详情查看
    PatrolReport.prototype.checkDetails = function(pathId,startPatrolDayTime,index){
        var $pathDetailsModal = $('#pathDetailsModal');
        $pathDetailsModal.find('.panel-body').empty();
        $pathDetailsModal.modal('show');
        var target = $pathDetailsModal.find('.panel-body')[0];
        Spinner.spin(target);
        WebAPI.get('/patrol/log/getByPathId/' +  AppConfig.projectId + '/'+ pathId +'/'+ startPatrolDayTime).done(function(result) {
            var dpl = '<ul>';
            var details = result.data[index].data;
            for(var j = 0;j < details.length;j++){
                if(!details[j].time){
                    dpl += '<li><div><a>'+ details[j].point +'</a></div><div><a style="color:#E8E822;">(未去巡查)</a>';
                }else{
                    dpl += '<li><div><a>'+ details[j].point +'</a>';
                    if(details[j].step){
                        dpl += '<a>步数：'+ details[j].step +'</a></div>';
                    }else{
                        dpl += '<a>步数：0</a></div>';
                    }
                    dpl += '<div><a>'+ details[j].time +'</a>';
                }
                if(details[j].error === 0){
                    dpl += '<a style="color:#1AD41A;">设备正常</a></div>';
                }else if(details[j].error === 1){
                    dpl += '<a style="color:red;">设备异常</a></div>';
                }else if(details[j].error === 2){
                    dpl += '<a style="color:#E8E822;">未去巡查</a></div>';
                }
                if(details[j].msg){
                    dpl += '<span>异常信息：'+ details[j].msg +'</span>';
                }
                if(details[j].arrPic){
                    for(var k=0;k< details[j].arrPic.length;k++){
                        dpl+= '<img class="img-responsive" src="'+ details[j].arrPic[k] +'">'
                    }
                }
                dpl +='</li>';
            }
            dpl += '</ul>';
            $pathDetailsModal.find('.panel-body').html(dpl);
            $pathDetailsModal.find('ul').children('li').children('img').on('click',function(){
                var width = $(this).width();
                if(width === 130) {
                    $(this).width(560);
                } else {
                    $(this).width(130);
                }
            })
        }).always(function(){
            Spinner.stop();
        })
    }
    //人员报表信息查看
    PatrolReport.prototype.checkPeoplePatrolMessage = function(executorId,startPatrolDayTime){
        var $pathModal = $('#pathReportModal');
        $pathModal.find('h3.modal-title').text('巡更人任务查看');
        $pathModal.find('.panel-body').empty();
        $pathModal.modal('show');
        var target = $pathModal.find('.panel-body')[0];
        Spinner.spin(target);
        WebAPI.get('/patrol/log/getByExecutorId/' +  AppConfig.projectId + '/'+ executorId +'/'+ startPatrolDayTime).done(function(result){
            if(result.data.length === 0) {tpl="该人员未去巡更！"};
            for(var i = 0;i < result.data.length;i++){
                var tpl = '',atpl='';
                if(result.data[i].startTime) {
                    tpl += '<div><div class="pathName"><p>路线：';
                    for (var pathId in result.data[i].path) {
                        tpl += result.data[i].path[pathId];
                    }
                    tpl += '</p><p>('+ result.data[i].planTime +')</p>';
                    if(result.data[i].state === 2){
                        tpl += '<p style="color:red;">-延迟完成巡更</p>';
                    }
                    //else if(result.data[i].state === 1){
                    //    tpl += '<p style="color:red;">-未完成巡更</p>';
                    //}else{
                    //    tpl += '<p style="color:red;">-完成巡更</p>';
                    //}
                    var startTime = result.data[i].startTime;
                    startTime = (startTime.split('-')[1] + '-' + startTime.split('-')[2]).split(':')[0] + ':' + (startTime.split('-')[1] + startTime.split('-')[2]).split(':')[1];
                    var endTime = result.data[i].endTime;
                    if (endTime) {
                        endTime = (endTime.split('-')[1] + '-' + endTime.split('-')[2]).split(':')[0] + ':' + (endTime.split('-')[1] + endTime.split('-')[2]).split(':')[1];
                    } else {
                        endTime = '未去巡查';
                    }
                    tpl += '</div><div class="divPathTitle" style="clear:both;"><a style="color:#646464;">开始：' + startTime + '</a><span>巡更人员：';
                    for (var id in result.data[i].executor) {
                        if(result.data[i].executor[id]){
                            tpl += result.data[i].executor[id];
                        }else{
                            tpl += '该人员已被删除!';
                        }
                    }
                    tpl += '</span><a style="color:#646464;">结束：' + endTime + '</a></div>';
                    tpl += '<ul class="list-group"><li style="clear:both;"><ol>';
                    for (var j = 0; j < result.data[i].data.length - 1; j++) {
                        if (result.data[i].data[j].error === 2) {
                            tpl += '<li><a>' + result.data[i].data[j].point + '(未去巡查) -> </a></li>';
                        } else if(result.data[i].data[j].error === -1){
                             tpl += '<li><a>该点已删除 -> </a></li>';
                        }else if(result.data[i].data[j].error === 0 || result.data[i].data[j].error === 1){
                            tpl += '<li><a>' + result.data[i].data[j].point + '(' + result.data[i].data[j].time + ') -> </a></li>';
                        }else {
                            var Na = i;
                            break;
                        }
                    }
                    if (result.data[i].data[result.data[i].data.length - 1].error === 2) {
                        tpl += '<li><a>' + result.data[i].data[result.data[i].data.length - 1].point + '(未去巡查)</a></li>';
                    } else if(result.data[i].data[result.data[i].data.length - 1].error === -1){
                        tpl += '<li><a>该点已删除</a></li>';
                    }else if(result.data[i].data[result.data[i].data.length - 1].error === 0 || result.data[i].data[result.data[i].data.length - 1].error === 1){
                        tpl += '<li><a>' + result.data[i].data[result.data[i].data.length - 1].point + '(' + result.data[i].data[result.data[i].data.length - 1].time + ')</a></li>';
                    }else {
                        var Na = i;
                    }
                    tpl += '</ol></li></ul><button class="btn btn-success btn-xs btnCheckPeople" type="button" data-index="' + i + '">查看详情</button></li></div>';
                }else{
                    for (var id in result.data[i].path) {
                        tpl += '<div><p>路线：'+ result.data[i].path[id]+ '</p><p>(' + result.data[i].planTime +')->未去巡更！</p></div>';
                    }
                }
                if(Na === i){
                    for (var id in result.data[i].path) {
                        atpl += '<div><p>路线：' + result.data[i].path[id] + '</p><p>(' + result.data[i].planTime + ')->在完成巡更后有不恰当操作(删除点或者编辑路线的点)！</p></div>';
                    }
                }
                $pathModal.find('.panel-body').append(atpl||tpl);
            }
            $('.btnCheckPeople').on('click',function(){
                var index = $(this).attr('data-index');
                _this.checkPeopleDetails(executorId,startPatrolDayTime,index);
            })
        }).always(function(){
            Spinner.stop();
        });
    };
    //人员报表信息每个人员详情查看
    PatrolReport.prototype.checkPeopleDetails = function(executorId,startPatrolDayTime,index){
        var $pathDetailsModal = $('#pathDetailsModal');
        $pathDetailsModal.find('.panel-body').empty();
        $pathDetailsModal.modal('show');
        var target = $pathDetailsModal.find('.panel-body')[0];
        Spinner.spin(target);
        WebAPI.get('/patrol/log/getByExecutorId/' +  AppConfig.projectId + '/'+ executorId +'/'+ startPatrolDayTime).done(function(result) {
            var dpl = '<ul>';
            var details = result.data[index].data;
            for(var j = 0;j < details.length;j++){
                if(!details[j].time){
                    dpl += '<li><div><a>'+ details[j].point +'</a></div><div><a style="color:#E8E822;">(未去巡查)</a>';
                }else{
                    dpl += '<li><div><a>'+ details[j].point +'</a>';
                    if(details[j].step){
                        dpl += '<a>步数：'+ details[j].step +'</a></div>';
                    }else{
                        dpl += '<a>步数：0</a></div>';
                    }
                    dpl += '<div><a>'+ details[j].time +'</a>';
                }
                if(details[j].error === 0){
                    dpl += '<a style="color:#1AD41A;">设备正常</a></div>';
                }else if(details[j].error === 1){
                    dpl += '<a style="color:red;">设备异常</a></div>';
                }else if(details[j].error === 2){
                    dpl += '<a style="color:#E8E822;">未去巡查</a></div>';
                }
                if(details[j].msg){
                    dpl += '<span>异常信息：'+ details[j].msg +'</span>';
                }
                if(details[j].arrPic){
                    for(var k=0;k< details[j].arrPic.length;k++){
                        dpl+= '<img class="img-responsive" src="'+ details[j].arrPic[k] +'">'
                    }
                }
                dpl +='</li>';
            }
            dpl += '</ul>';
            $pathDetailsModal.find('.panel-body').html(dpl);
            $pathDetailsModal.find('ul').children('li').children('img').on('click',function(){
                var width = $(this).width();
                if(width === 130) {
                    $(this).width(560);
                } else {
                    $(this).width(130);
                }
            })
        }).always(function(){
            Spinner.stop();
        })
    }
    PatrolReport.prototype.close = function(){
        this.container.empty();
        this.screen = null;
    };
    
    return PatrolReport;
}());