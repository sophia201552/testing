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
        '<span id="btnToggleBack" class="topNavLeft topTool zepto-ev">\
        <span>\
                    <svg style="width:24px;height:24px;" version="1.1" id="图形" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="1024px" height="1024px" viewBox="0 0 1024 1024" enable-background="new 0 0 1024 1024" xml:space="preserve">\
                        <path class="svgpath" data-index="path_0" fill="#ecf0f1" d="M137.728 509.12 598.656 48.128 564.032 13.44 65.472 512 564.032 1010.56 601.6 972.992Z"></path>\
                    </svg>\
                </span>\
        </span>\
        <span class="topNavTitle"></span>\
        <span class="topNavInput spSearch"><input class="iptSearch" id="iptPtSearch"></span>\
        <div id="btnHomePage" class="topNavRight zepto-ev"><span class="glyphicon glyphicon-home"></span></div>\
        <span id="btnSure" class="topNavRight zepto-ev"></span>',
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
            if (_this.opt.isToggle){
                $('#bntSure').hide();
                $('#btnToggleBack').css('display','-webkit-inline-flex');
                $('#btnHomePage').css('display','-webkit-inline-flex');
                _this.initResult();
                _this.initToggle();
                _this.initNav();
            }else {
                //$('#btnPtList').css({'display':'-webkit-inline-flex'});
                $('#btnSure').text('确认');

                _this.initResult();
                _this.initToggle();
                _this.initSure();
                localStorage.setItem('curSet',JSON.stringify(curSet));
            }
        },
        initResult:function(){
            var ctn = document.getElementById('ctnMissionResult');
            var point,status,info;
            var guideLine;
            for (var i = 0;i < curSet.path.path.length ;i++){
                point = document.createElement('div');
                point.id = curSet.path.path[i]['_id'];
                point.className = 'divPoint zepto-ev';
                info = document.createElement('span');
                info.className = 'spPtName';
                if(!curSet.path.path[i].name || curSet.path.path[i].name == '已删除'){
                    info.textContent = '该节点已删除';

                    if (i != 0) {
                        guideLine = document.createElement('span');
                        guideLine.className = 'spGuideLine';
                        ctn.appendChild(guideLine);
                    }

                    point.appendChild(info);
                }else {
                    info.textContent = (i + 1) + '.' + curSet.path.path[i].name;

                    status = document.createElement('span');
                    status.className = 'spPtStatus';
                    if (curSet.path && curSet.path.path[i] && curSet.log.path[i]) {
                        switch (curSet.log.path[i].error) {
                            case 0:
                                status.textContent = '设备正常';
                                status.className += ' statusOk';
                                break;
                            case 1:
                                status.textContent = '设备异常';
                                status.className += ' statusErr';
                                break;
                            case 2:
                            default:
                                status.textContent = '未检查';
                                status.className += ' statusSkip';
                                break;
                        }
                    } else {
                        status.textContent = '未检查';
                        status.className += ' statusSkip';
                    }
                    if (i != 0) {
                        guideLine = document.createElement('span');
                        guideLine.className = 'spGuideLine';
                        ctn.appendChild(guideLine);
                    }
                    point.appendChild(info);
                    point.appendChild(status);
                }
                ctn.appendChild(point);
            }
        },
        initToggle:function(){
            var $divPoint = $('.divPoint');
            $('#ctnMissionResult').off('tap').on('tap','.divPoint',function(e){
                var index = $divPoint.index($(e.currentTarget));
                //if (index > curSet.ptCompleteIndex)return;
                router.to({
                    typeClass:PointScreen,
                    data:{
                        ptIndex:index
                    }
                })
            })
        },
        initSure:function(){
            $('#btnSure').on('tap',function(){
                curSet.log.endTime = new Date().format('yyyy-MM-dd HH:mm:ss');
                if (navigator.geolocation) {
                    SpinnerControl.show();
                    if(dataManager.file.enable) {
                        dataManager.saveUpdateLog(true, {
                            patrol: [$.extend(true, {}, curSet.log)],
                            type: 'confirm',
                            info: '巡更日志保存确认'
                        }, function () {
                            navigator.geolocation.getCurrentPosition(onGpsSuccess, onGpsFail, {timeout: AppConfig.gpsTime});
                        });
                    }else{
                        navigator.geolocation.getCurrentPosition(onGpsSuccess, onGpsFail, {timeout: AppConfig.gpsTime});
                    }
                }else {
                    onGpsSuccess();
                }
            });
            function onGpsSuccess(pos){
                //dailyLog[curSet.missionId][curSet.path['_id']][curSet.planTime][curSet.user['_id']] = 'end';
                for (var i = 0; i < curSet.log.path.length ;i++){
                    if (curSet.log.path[i].error == 2){
                        curSet.log.state = 0;
                        break;
                    }
                }
                if (pos){
                    curSet.log.gps = [pos.coords.longitude,pos.coords.latitude];
                }else{
                    curSet.log.gps = [];
                }
                if(navigator.connection) {
                    if (navigator.connection.type == 'none') {
                        curSet.log.isOnline = 0;
                    } else {
                        curSet.log.isOnline = 1;
                    }
                }else{
                    curSet.log.isOnline = 1;
                }
                curSet.ptCompleteIndex = curSet.path.path.length;
                localStorage.setItem('curSet',JSON.stringify(curSet));
                _this.setCompleteLog();
                router.to({
                    typeClass:UserSelScreen
                });
                SpinnerControl.hide();
            }
            function onGpsFail(){
                //window.plugins && window.plugins.toast.show('GPS信息获取失败', 'short', 'center');
                onGpsSuccess();
            }
        },
        setCompleteLog:function(){
            var completeLog = JSON.parse(localStorage.getItem('completeLog'));
            if (!completeLog)completeLog = {};
            if (!$.isEmptyObject(completeLog)) {
                var now = new Date();
                var arrPath = Object.keys(completeLog);
                arrPath.forEach(function (pathId) {
                var arrPlan = completeLog[pathId];
                    for (var i = arrPlan.length - 1; i >=0 ;i--){
                        if ((now - new Date(arrPlan[i])) > 604800000){
                            completeLog[pathId] = completeLog[pathId].slice(i + 1);
                            break;
                        }
                    }
                    if (completeLog[pathId].length == 0)delete completeLog[pathId];
                });
            }
            var completePath = completeLog[curSet.path['_id']];
            if (completePath instanceof Array) {
                completePath.push(curSet.planTime)
            } else {
                completePath = [curSet.planTime]
            }
            completeLog[curSet.path['_id']] = completePath;
            localStorage.setItem('completeLog',JSON.stringify(completeLog))
        },
        initNav:function(){
            $('#btnToggleBack').off('tap').on('tap',function(){
                router.to({
                    typeClass:PointScreen,
                    data:{
                        ptIndex:curSet.ptIndex
                    }
                })
            });
            $('#btnHomePage').off('touchstart').on('touchstart',function(){
                $('#ctnJump').show();
                $('#btnJump').off('touchstart').on('touchstart',function() {
                    localStorage.removeItem('curSet');
                    curSet = {};
                    router.to({
                        typeClass:UserSelScreen
                    })
                });
                $('#btnCancel').off('touchstart').on('touchstart',function() {
                    $('#ctnJump').hide();
                });
            });
            $('.iptSearch').off('input propertychange').on('input propertychange',function(e){
                $('#ulProjectList').html('');
                var target = $(e.currentTarget).val();
                var $divPt = $('.divPoint');
                var $guideLine = $('.spGuideLine');
                if (target) {
                    $divPt.hide();
                    $guideLine.hide();
                    for (var i = 0; i < $divPt.length; i++) {
                        if ($divPt[i].innerText.toLowerCase().indexOf(target.toLowerCase()) > -1) {
                            $divPt.eq(i).show();
                        }
                    }
                }else{
                    $divPt.show();
                    $guideLine.show();
                }
            });
        },
        close:function(){

        }
    };
    return MissionResultScreen
})();