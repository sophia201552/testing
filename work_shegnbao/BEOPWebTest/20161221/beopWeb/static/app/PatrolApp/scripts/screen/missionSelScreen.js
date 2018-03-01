/**
 * Created by win7 on 2016/3/2.
 */
var MissionSelScreen = (function(){
    var _this;
    function MissionSelScreen(data){
        _this = this;
        _this.opt = data?data:{};
        _this.mission = undefined;
    }
    MissionSelScreen.navOptions = {
        top:
        '<span class="topNavTitle">选择任务</span>',
        bottom: false,
        backDisable: false,
        module: 'project'
    };
    MissionSelScreen.prototype = {
        show:function(){
            $.ajax({url:'static/app/PatrolApp/views/screen/missionSelScreen.html'}).done(function(resultHtml){
                ElScreenContainer.innerHTML = resultHtml;
                _this.init();
            })
        },
        init:function(){
            WebAPI.post('/patrol/mission/get/' + AppConfig.projectId).done(function(result){
                _this.mission = result.data;
                _this.initMissionList();
            });
        },
        initMissionList:function(){
            var $missionList = $('#ctnMissionList');
            var pathMission = _this.mission.data[_this.opt.path['_id']];
            var mission,time,executor;
            var now = new Date();
            if (pathMission) {
                for (var plan in  pathMission) {
                    mission = document.createElement('div');
                    mission.className = 'divMission zepto-ev' ;
                    mission.id = pathMission[plan];

                    time = document.createElement('span');
                    time.className = 'spTime';
                    time.textContent = '该任务每' + _this.mission.interval +'天执行一次，每次预定从'+ plan + '开始';
                    mission.appendChild(time);

                    executor = document.createElement('span');
                    executor.className = 'spExecutor';
                    executor.textContent = '该任务由';
                    for (var i = 0 ; i < pathMission[plan].length ;i++){
                        executor.textContent += ' '+ _this.searchUserById(pathMission[plan][i]) + ' ';
                    }
                    executor.textContent += '执行';
                    mission.appendChild(executor);

                    $missionList.append(mission);
                }
            }else{
                mission = document.createElement('div');
                mission.textContent = '当前线路上没有您需要完成的任务，请重新选择';
                $missionList.append(mission)
            }
            $missionList.on('tap','.divMission',function(e){
                _this.opt.ptIndex = 0;
                router.to({
                    typeClass:PointScreen,
                    data:_this.opt
                })
            })
        },
        searchUserById:function(userId){
            for (var i = 0; i < _this.opt.user.length; i++){
                if(_this.opt.user[i]['_id'] == userId)return _this.opt.user[i].name;
            }
        },
        close:function(){

        }
    };
    return MissionSelScreen;
})();