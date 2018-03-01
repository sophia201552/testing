/**
 * Created by win7 on 2016/3/2.
 */
var MissionResultScreen = (function(){
    var _this;
    function MissionResultScreen(data){
        _this = this;
        _this.opt = data?data:{};
    }
    MissionResultScreen.navOptions = {
        top:
        '<span class="topNavTitle">巡跟结果</span>\
        <span id="btnSure" class="topNavRight zepto-ev">确认</span>',
        bottom: false,
        backDisable: true,
        module: 'project'
    };
    MissionResultScreen.prototype = {
        show:function(){
            $.ajax({url:'static/app/PatrolApp/views/screen/missionResultScreen.html'}).done(function(resultHtml){
                ElScreenContainer.innerHTML = resultHtml;
                _this.init();
            })
        },
        init:function(){
            _this.initResult();
            _this.initSure();
        },
        initResult:function(){
            var ctn = document.getElementById('ctnMissionResult');
            var point,status,info;
            var guideLine;
            for (var i = 0;i < patrolLog[curSet.patrolIndex].path.length ;i++){
                point = document.createElement('div');
                point.id = curSet.path.path[i]['_id'];
                point.className = 'divPoint';

                info = document.createElement('span');
                info.className = 'spPtName';
                info.textContent = curSet.path.path[i].name;

                status = document.createElement('span');
                status.className = 'spPtStatus';
                switch (patrolLog[curSet.patrolIndex].path[i].error){
                    case 0:
                        status.textContent = '设备正常';
                        status.className += ' statusOk';
                        break;
                    case 1:
                        status.textContent = '设备异常';
                        status.className += ' statusErr';
                        break;
                    case 2:
                        status.textContent = '未检查';
                        status.className += ' statusSkip';
                        break;
                }
                if (i != 0){
                    guideLine = document.createElement('span');
                    guideLine.className = 'spGuideLine';
                    ctn.appendChild(guideLine);
                }
                point.appendChild(info);
                point.appendChild(status);
                ctn.appendChild(point);
            }
        },
        initSure:function(){
            $('#btnSure').on('tap',function(){
                router.to({
                    typeClass:UserSelScreen
                })
            });
        },
        close:function(){

        }
    };
    return MissionResultScreen
})();