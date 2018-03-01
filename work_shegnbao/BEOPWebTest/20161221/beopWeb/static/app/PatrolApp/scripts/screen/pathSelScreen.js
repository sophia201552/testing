/**
 * Created by win7 on 2016/3/2.
 */
var PathSelScreen = (function(){
    var _this;
    function PathSelScreen(data){
        _this = this;
        this.completeLog = {};
    }
    PathSelScreen.navOptions = {
        top:
        '<span class="topNavTitle">选择路径</span>',
        bottom: false,
        backDisable: false,
        module: 'project'
    };
    PathSelScreen.prototype = {
        show:function(){
            $.ajax({url:'static/app/PatrolApp/views/screen/pathSelScreen.html'}).done(function(resultHtml){
                ElScreenContainer.innerHTML = resultHtml;
                _this.initCompleteLog();
                _this.init();
                _this.attachEvent();
            })
        },
        init:function(){
            if (typeof pathAll == 'undefined' || $.isEmptyObject(pathAll)){
                WebAPI.get('/patrol/path/getAll/' + AppConfig.projectId).done(function(result){
                    pathAll = result.data;
                    _this.getPoint();
                });
            }else{
                _this.getPoint();
            }
        },

        attachEvent:function(){
            var _this = this;
            var $pathList = $('#ctnPathList') ;
            var $pathRecList = $('#ctnPathRecList');
            var $recommend,$target,$planInDivRec;
            var pathId,recommendText = '';
            $pathList.off('click').on('click','.divPlan',function(e){
                $target = $(e.currentTarget);
                if ($target.hasClass('disabled')){
                    window.plugins && window.plugins.toast.show('该任务已过期', 'short', 'center');
                    return;
                }
                pathId = $target.parentsUntil('#ctnPathList','.divPath')[0].dataset.id;
                if($target.hasClass('complete')){
                    window.plugins && window.plugins.toast.show('该任务已完成', 'short', 'center');
                    return;
                }
                if ($target.hasClass('recommend')) {
                    _this.startPlan(pathId,$target[0].dataset.status,$target[0].dataset.mission,$target[0].dataset.time);
                }else {
                    $planInDivRec = $pathRecList.find('#rec_' + pathId);
                    if ($planInDivRec.length > 0) {
                        $recommend = $planInDivRec.find('.recommend');
                        recommendText = '推荐';
                    } else {
                        $recommend = $target.siblings('.recommend');
                    }
                    if ($recommend.length > 0) {
                        if($recommend[0].dataset.status == 2){
                            recommendText = '延误';
                        }
                        window.plugins && window.plugins.toast.show('请优先完成该路线' + $recommend.find('.spPlanTime').text() + recommendText + '的任务', 'short', 'center');
                            return;
                        }
                    _this.startPlan(pathId,$target[0].dataset.status,$target[0].dataset.mission,$target[0].dataset.time);
                }
            });
            $pathRecList.off('click').on('click','.divPlan',function(e){
                $target = $(e.currentTarget);
                pathId = $target.parentsUntil('#ctnPathList','.divPath')[0].dataset.id;
                if ($target.hasClass('recommend')){
                    _this.startPlan(pathId,$target[0].dataset.status,$target[0].dataset.mission,$target[0].dataset.time);
                }else {
                    $recommend = $target.siblings('.recommend');
                    if ($recommend.length > 0) {
                        window.plugins && window.plugins.toast.show('请优先完成该路线' + $recommend.find('.spPlanTime').text() + '的推荐任务', 'short', 'center');
                        return;
                    }
                    _this.startPlan(pathId,$target[0].dataset.status,$target[0].dataset.mission,$target[0].dataset.time);
                }
            })
        },
        startPlan:function(pathId,status,missionId,planTime){
            for (var i = 0; i < pathAll.length ;i++){
                if (pathAll[i]['_id'] == pathId){
                    curSet.path = pathAll[i];
                }
            }
            curSet.ptCompleteIndex = -1;
            curSet.ptIndex = 0;
            if (status){
                curSet.missionState = status;
            }
            curSet.missionId = missionId;
            curSet.planTime = planTime;
            curSet.log = {};
            curSet.log.startTime = new Date().format('yyyy-MM-dd HH:mm:ss');
            curSet.log.planDate = new Date(planTime).format('yyyy-MM-dd HH:mm:ss');
            curSet.log.planTime = new Date(planTime).format('HH:mm');
            curSet.log.missionId = curSet.missionId;
            curSet.log.executorId = curSet.user['_id'];
            curSet.log.pathId = curSet.path['_id'];
            curSet.log.path = [];
            curSet.log.projId = AppConfig.projectId;
            curSet.log.pathName = curSet.path.name;
            curSet.log.userName = curSet.user.name;
            curSet.log.version = AppConfig.version;

            for (var i =0 ; i < curSet.path.path.length;i++) {
                curSet.log.path[i] = {
                    '_id': curSet.path.path[i]['_id'],
                    'time': '',
                    'name': curSet.path.path[i]['name'],
                    'msg': '',
                    'error': 2,
                    'arrPic': [],
                    'gps':[]
                };
            }
            router.to({
                typeClass:PointScreen
            })
        },
        getMission:function(){
            if (typeof missionAll == 'undefined' || $.isEmptyObject(missionAll)) {
                WebAPI.get('/patrol/mission/get/' + AppConfig.projectId).done(function (result) {
                    missionAll = result.data;
                    _this.initMission();
                });
            }else{
                _this.initMission();
            }
        },
        getPoint:function(){
            if (typeof pointAll == 'undefined' || $.isEmptyObject(pointAll)){
                WebAPI.get('/patrol/point/getList/' + AppConfig.projectId).done(function(result){
                    pointAll = result.data;
                    _this.getMission();
                });
            }else{
                _this.getMission();
            }
        },
        initCompleteLog:function(){
            this.completeLog = JSON.parse(localStorage.getItem('completeLog'));
            if (!this.completeLog)this.completeLog = {};
            if ($.isEmptyObject(this.completeLog))return;
            var now = new Date();
            var arrPath = Object.keys(this.completeLog);
            arrPath.forEach(function(pathId){
                var arrPlan = _this.completeLog[pathId];
                for (var i = arrPlan.length - 1; i >=0 ;i--){
                    if ((now - new Date(arrPlan[i])) > 604800000){
                        _this.completeLog[pathId] = _this.completeLog[pathId].slice(i + 1);
                        break;
                    }
                }
                if (_this.completeLog[pathId].length == 0)delete _this.completeLog[pathId];
            })
        },
        initMission:function(){
            var arrPathId;
            for (var i = 0; i < missionAll.length ;i++){
                arrPathId = Object.keys(missionAll[i]['option']);
                for (var j = 0; j < arrPathId.length;j++){
                    this.initPath(arrPathId[j],missionAll[i]['option'][arrPathId[j]],missionAll[i])
                }
            }
        },
        initPath:function(pathId,planInfo,missionInfo){
            var pathListDom = document.getElementById('ctnPathList');
            var pathDom,pathInfo,planDom;
            pathDom = document.getElementById(pathId);
            if (!pathDom){
                pathDom = document.createElement('div');
                pathDom.className = 'divPath';
                pathDom.id = pathId;
                pathDom.dataset.id = pathId;
                pathInfo = this.getPathInfoById(pathId);
                if(!pathInfo)return false;
                var label = document.createElement('label');
                label.textContent = pathInfo.name;

                pathDom.appendChild(label);

                planDom = this.initPlan(planInfo,pathInfo,missionInfo);
                if (!planDom)return false;

                pathDom.appendChild(planDom);
                pathListDom.appendChild(pathDom)
            }else{
                pathInfo = this.getPathInfoById(pathId);
                if(!pathInfo)return false;
                planDom = this.initPlan(planInfo,pathInfo,missionInfo);
                if (!planDom)return false;

                pathDom.appendChild(planDom);
            }
        },
        getPathInfoById:function(id){
            for (var i= 0;i < pathAll.length ;i++){
                if(pathAll[i]['_id'] == id){
                    return pathAll[i]
                }
            }
            return false;
        },
        initPlan:function(planInfo,pathInfo,missionInfo){
            var ctnPlan = document.createElement('div');
            ctnPlan.className = 'ctnPlan';

            var divPlan,planStatus;
            var arrPlanTime = Object.keys(planInfo);
            var arrPlanStatus = [];
            //for(var i = 0; i < arrPlanTime.length ;i++){
            //    if (!planInfo[arrPlanTime[i]])continue;
            //    for (var j = 0; j < planInfo[arrPlanTime[i]].length ;j++){
            //        if (!planInfo[arrPlanTime[i]][j] || planInfo[arrPlanTime[i]][j] != curSet.user['_id'])continue;
            //        planStatus = this.getPlanStatus(arrPlanTime[i],j,pathInfo,missionInfo,ctnPlan);
            //        if (planStatus.status < 0)continue;
            //        arrPlanStatus.push(planStatus.status);
            //        divPlan = this.createPlanDom(arrPlanTime[i],planStatus,arrPlanStatus);
            //        divPlan.dataset.mission = missionInfo['_id'];
            //        divPlan.dataset.time = planStatus.planTime;
            //        if (planStatus.status == 0){
            //            this.insertRecPlan(pathInfo,divPlan);
            //        }else {
            //            ctnPlan.appendChild(divPlan);
            //        }
            //    }
            //}
            for(var i = 0; i < missionInfo.interval ;i++){
                for (var j = 0; j < arrPlanTime.length ;j++){
                    if (!planInfo[arrPlanTime[j]])continue;
                    if (!planInfo[arrPlanTime[j]][i] || planInfo[arrPlanTime[j]][i] != curSet.user['_id'])continue;
                    planStatus = this.getPlanStatus(arrPlanTime[j],i,pathInfo,missionInfo,ctnPlan);
                    if (planStatus.status < 0)continue;
                    arrPlanStatus.push(planStatus.status);
                    divPlan = this.createPlanDom(arrPlanTime[j],planStatus,arrPlanStatus);
                    divPlan.dataset.mission = missionInfo['_id'];
                    divPlan.dataset.time = planStatus.planTime;
                    if (planStatus.status == 0){
                        this.insertRecPlan(pathInfo,divPlan);
                    }else {
                        ctnPlan.appendChild(divPlan);
                    }
                }
            }
            if (arrPlanStatus.indexOf(0) >= 0){
                $('#rec_' + pathInfo['_id']).find('.divPlan').first().addClass('recommend')
            }else{
                if (arrPlanStatus.indexOf(1) < 0){
                    var lastIndexOfDelay = arrPlanStatus.lastIndexOf(2);
                    if (lastIndexOfDelay >= 0){
                        $(ctnPlan.children[lastIndexOfDelay]).removeClass('disabled').addClass('recommend').find('.spStatusText').text('（延误）')
                    }
                }else {
                    var firstIndexAhead = arrPlanStatus.indexOf(3);
                    if (firstIndexAhead >= 0) {
                        $(ctnPlan.children[firstIndexAhead]).addClass('recommend');
                    }
                }
            }
            if (!ctnPlan.hasChildNodes())return false;
            return ctnPlan;
        },
        createPlanDom:function(time,status){
            var divPlan = document.createElement('div');
            divPlan.className = 'divPlan';
            divPlan.dataset.status = status.status;

            var spTime = document.createElement('span');
            spTime.className = 'spPlanTime';
            if (status.interval == '1d') {
                spTime.textContent = time;
            }else if(status.interval == '1w') {
                spTime.textContent = status.startTime + ' ~ ' + status.endTime;
            }else if (status.interval == 'nextD'){
                spTime.textContent = status.startTime + ' ~ ' + status.endTime;
            }
            divPlan.appendChild(spTime);
            if (status.status == 1){
                divPlan.className += ' complete';
                var spComplete = document.createElement('span');
                spComplete.className = 'spStatusIcon glyphicon glyphicon-ok';
                divPlan.appendChild(spComplete);
            }else if(status.status == 2){
                var spStatusText = document.createElement('span');
                spStatusText.className = 'spStatusText';
                spStatusText.textContent = '（未完成）';
                divPlan.className += ' disabled';
                divPlan.appendChild(spStatusText);
            }
            return divPlan;
        },
        insertRecPlan:function(pathInfo,planDom){
            var pathRecList = document.getElementById('ctnPathRecList');
            $(pathRecList).addClass('active');
            var pathRecDom = document.getElementById('rec_' + pathInfo['_id']);
            var ctnPlan;
            if (!pathRecDom){
                pathRecDom = document.createElement('div');
                pathRecDom.className = 'divPath divRecPath';
                pathRecDom.id = 'rec_' + pathInfo['_id'];
                pathRecDom.dataset.id = pathInfo['_id'];

                var label = document.createElement('label');
                label.textContent = pathInfo.name;

                ctnPlan = document.createElement('div');
                ctnPlan.className = 'ctnPlan';

                pathRecDom.appendChild(label);
                pathRecDom.appendChild(ctnPlan);
                pathRecList.appendChild(pathRecDom);
                ctnPlan.appendChild(planDom);
            }else{
                var earlyPlan;
                ctnPlan = pathRecDom.querySelector('.ctnPlan');
                for (var i = 0 ; i < ctnPlan.children.length;i++){
                    if (new Date(planDom.dataset.time) < new Date(ctnPlan.children[i].dataset.time)){
                        earlyPlan = ctnPlan.children[i];
                        break;
                    }
                }
                ctnPlan.insertBefore(planDom,earlyPlan)
            }
        },
        getPlanStatus:function(time,index,pathInfo,missionInfo){
            var planTime = new Date(new Date(missionInfo.startTime).getTime() + index * 86400000).format('yyyy-MM-dd ' + time);
            var planTimeInDate =  new Date(planTime);
            var timeRange = pathInfo.timeRange.split(' ');
            var beforeTime = parseFloat(timeRange[0]);
            var afterTime = parseFloat(timeRange[1]);
            isNaN(beforeTime) && (beforeTime = -60);
            isNaN(afterTime) && (afterTime = 60);
            var status = {};
            var startTime = new Date(planTimeInDate.getTime() + beforeTime * 60000);
            var endTime = new Date(planTimeInDate.getTime() + afterTime * 60000);
            var interval = (planTimeInDate - new Date()) / 60000;
            if (afterTime - beforeTime < 1440 && (
                    startTime.format('yyyy-MM-dd') != new Date().format('yyyy-MM-dd') &&
                    endTime.format('yyyy-MM-dd') != new Date().format('yyyy-MM-dd')
                )){
                    status = {interval: '1d', status: -1, planTime: planTimeInDate};
                    return status;
                }
            if (this.completeLog[pathInfo['_id']] && this.completeLog[pathInfo['_id']].indexOf(planTime) >= 0){
                status.status = 1;
            }else {
                if (interval < beforeTime) {
                    status.status = 2
                } else if (interval > afterTime) {
                    status.status = 3;
                } else {
                    status.status = 0;
                }
            }
            if (afterTime - beforeTime >= 1440){
                status.interval = '1w';
                status.startTime = startTime.format('yyyy-MM-dd HH:mm');
                status.endTime = endTime.format('yyyy-MM-dd HH:mm');
            }else{
                if(startTime.format('yyyy-MM-dd') != new Date().format('yyyy-MM-dd') && endTime.format('yyyy-MM-dd') == new Date().format('yyyy-MM-dd')){
                    status.startTime = startTime.format('yyyy-MM-dd HH:mm');
                    status.endTime = endTime.format('yyyy-MM-dd HH:mm');
                    status.interval = 'nextD';
                }else{
                    status.interval = '1d';
                }
            }

            status.planTime = planTime;
            return status;
        },
        searchUserById:function(userId){
            for (var i = 0; i < userAll.length; i++){
                if(userAll[i]['_id'] == userId)return userAll[i].name;
            }
        },
        close:function(){

        }
    };
    return PathSelScreen;
})();