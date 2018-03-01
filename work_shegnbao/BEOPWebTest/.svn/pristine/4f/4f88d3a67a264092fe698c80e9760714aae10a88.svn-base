/**
 * Created by win7 on 2016/3/2.
 */
var UpdateScreen = (function(){
    var _this;
    function UpdateScreen(){
        _this = this
    }
    UpdateScreen.navOptions = {
        top:
        '<span class="topNavTitle">数据上传</span>',
        bottom: false,
        backDisable: true,
        module: 'project'
    };
    UpdateScreen.prototype = {
        show:function(){
            $.ajax({url:'static/app/PatrolApp/views/screen/updateScreen.html'}).done(function(resultHtml){
                ElScreenContainer.innerHTML = resultHtml;
                _this.init();
            })
        },
        init:function(){
            _this.initUpdate();
            _this.initStart();
        },
        initUpdate:function(){
            $('#btnUpdate').on('tap',function(){
                SpinnerControl.show();
                if(curSet.patrolIndex == -1){
                    $.when(
                        WebAPI.get('/patrol/executor/getList/' + AppConfig.projectId),
                        WebAPI.get('/patrol/path/getAll/' + AppConfig.projectId),
                        WebAPI.get('/patrol/mission/get/' + AppConfig.projectId),
                        WebAPI.get('/patrol/point/getList/' + AppConfig.projectId)
                    ).done(function (userAjax, pathAjax, missionAjax, pointAjax) {
                            userAll = userAjax[0].data;
                            pathAll = pathAjax[0].data;
                            missionAll = missionAjax[0].data;
                            pointAll = pointAjax[0].data;
                        }).always(function () {
                            SpinnerControl.hide();
                        })
                }else if(curSet.patrolIndex > -1) {
                    $.when(
                        WebAPI.get('/patrol/executor/getList/' + AppConfig.projectId),
                        WebAPI.get('/patrol/path/getAll/' + AppConfig.projectId),
                        WebAPI.get('/patrol/mission/get/' + AppConfig.projectId),
                        WebAPI.get('/patrol/point/getList/' + AppConfig.projectId),
                        WebAPI.post('/patrol/log/saveMulti', patrolLog)
                    ).done(function (userAjax, pathAjax, missionAjax, pointAjax, patrolLogAjax) {
                            userAll = userAjax[0].data;
                            pathAll = pathAjax[0].data;
                            missionAll = missionAjax[0].data;
                            pointAll = pointAjax[0].data;
                            if (patrolLogAjax[1] == 'success') {
                                if (window.plugins) {
                                    window.plugins.toast.show('上传数据成功', 'short', 'center');
                                }
                                curSet.patrolIndex = -1;
                                patrolLog = [];
                            } else {
                                if (window.plugins) {
                                    window.plugins.toast.show('上传数据失败', 'short', 'center');
                                }
                            }
                        }).always(function () {
                            SpinnerControl.hide();
                        })
                }
            })
        },
        initStart:function(){
            $('#btnStart').on('tap',function(){
                router.to({
                    typeClass:UserSelScreen,
                    data:{}
                })
            })
        },
        close:function(){

        }
    };
    return UpdateScreen;
})();