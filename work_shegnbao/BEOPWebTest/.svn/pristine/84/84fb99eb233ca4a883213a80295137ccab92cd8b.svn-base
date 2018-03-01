/**
 * Created by win7 on 2016/3/2.
 */
var PathSelScreen = (function(){
    var _this;
    function PathSelScreen(data){
        _this = this;
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
                _this.init();
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

        getMission:function(){
            if (typeof missionAll == 'undefined' || $.isEmptyObject(missionAll)) {
                WebAPI.get('/patrol/mission/get/' + AppConfig.projectId).done(function (result) {
                    missionAll = result.data;
                    _this.initPathList();
                    _this.initMission();
                    _this.initPointList();
                });
            }else{
                _this.initPathList();
                _this.initMission();
                _this.initPointList();
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
        initPathList:function(){
            var $pathList = $('#ctnPathList')  ;
            var path,status,name;
            for (var i = 0 ; i < pathAll.length ;i++){
                path = document.createElement('div');
                path.className = 'divPath zepto-ev';
                path.id = pathAll[i]['_id'];
                path.setAttribute('status',pathAll[i].status);

                name = document.createElement('span');
                name.className = 'spName';
                name.textContent = pathAll[i].name;
                path.appendChild(name);

                //point = document.createElement('<span>');
                //point.className = 'spPoint';
                //path.appendChild(point);

                //status = document.createElement('span');
                //status.className = 'spStatus';
                //status.textContent = _this.generateStatus(pathAll[i].status);
                //path.appendChild(status);

                $pathList.append(path);
            }
            $pathList.on('tap','.divMission',function(e){
                if($(e.currentTarget).hasClass('disabled'))return;
                var pathId = e.currentTarget.getAttribute('pathId');
                for (var i = 0; i < pathAll.length ;i++){
                    if (pathAll[i]['_id'] == pathId){
                        curSet.path = pathAll[i];
                    }
                }
                curSet.ptIndex = 0;
                curSet.patrolIndex++;
                patrolLog.push({});
                patrolLog[curSet.patrolIndex].startTime = new Date().format('yyyy-MM-dd HH:mm:ss');
                patrolLog[curSet.patrolIndex].planTime = e.currentTarget.getAttribute('time');
                patrolLog[curSet.patrolIndex].executorId = curSet.user['_id'];
                patrolLog[curSet.patrolIndex].pathId = curSet.path['_id'];
                patrolLog[curSet.patrolIndex].path = [];
                patrolLog[curSet.patrolIndex].projId = AppConfig.projectId;
                router.to({
                    typeClass:PointScreen
                })
            })
        },
        initPointList:function(){

        },
        initMission:function(){
            var mission,time,executor;
            var pathDom;
            var planLog,planNum;
            var pathLog;
            var now = new Date('2016/3/7 09:15');
            //var now = new Date();
            curSet.mission = {};
            for (var i = 0; i < missionAll.length;i++) {
                for (var pathObj in missionAll[i]['option']) {
                    pathLog = missionAll[i]['option'][pathObj];
                    pathDom = document.getElementById(pathObj);
                    planNum = 0;
                    curSet.mission[pathObj] = [];
                    for (var plan in pathLog) {
                        planLog = pathLog[plan];
                        var isExecutor = true;
                        //var executorIndex = new Date().getDate() - missionAll[i].interval * Math.floor(new Date().getDate() / missionAll[i].interval);
                        var executorIndex = Math.floor((new Date() - new Date(missionAll[i].startTime))/86400000)%(missionAll[i].interval);
                        if (planLog instanceof Array){
                            if (typeof planLog[executorIndex] == 'undefined' || planLog[executorIndex] != curSet.user['_id']){
                                isExecutor = false;
                            }
                        }
                        if(!isExecutor) continue;
                        curSet.mission[pathObj].push(plan);
                        planNum++;
                        mission = document.createElement('div');
                        mission.className = 'divMission zepto-ev';
                        mission.setAttribute('missionId', missionAll[i]['_id']);
                        mission.setAttribute('pathId', pathObj);
                        mission.setAttribute('time', plan);
                        if (Math.abs(new Date(now.format('yyyy/MM/dd') + ' ' + plan) - now) > 1800000) {
                            mission.className += ' disabled'
                        } else {
                            mission.className += ' active'
                        }
                        time = document.createElement('span');
                        time.className = 'spTime';
                        time.textContent = '任务' + planNum + ':预定' + plan + '开始';
                        mission.appendChild(time);

                        //executor = document.createElement('span');
                        //executor.className = 'spExecutor';
                        //executor.textContent = '执行人：';
                        //for (var i = 0; i < planLog.length; i++) {
                        //    executor.textContent += ' ' + _this.searchUserById(planLog[i]) + ' ';
                        //}
                        //mission.appendChild(executor);
                        pathDom.appendChild(mission);
                    }
                }
            }
        },
        searchUserById:function(userId){
            for (var i = 0; i < userAll.length; i++){
                if(userAll[i]['_id'] == userId)return userAll[i].name;
            }
        },
        generateStatus:function(statusId){
            var strStatus;
            switch (statusId){
                case 0:
                    strStatus = '未开始';
                    break;
                case 1:
                    strStatus = '巡跟中';
                    break;
                case 2:
                    strStatus = '已完成';
                    break;
                default :
                    strStatus = '';
                    break;
            }
            return strStatus;
        },
        close:function(){

        }
    };
    return PathSelScreen;
})();