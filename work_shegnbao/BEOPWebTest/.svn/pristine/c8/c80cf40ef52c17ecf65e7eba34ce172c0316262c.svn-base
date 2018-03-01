/**
 * Created by win7 on 2016/3/2.
 */
var UserSelScreen = (function(){
    var _this;
    function UserSelScreen(data){
        _this = this;
        _this.userDiv = {};
    }
    UserSelScreen.navOptions = {
        top:
        '<span id="spClearCache" class = "zepto-ev topNavLeft topTool">\
        <span id="btnClearCache" class = "glyphicon glyphicon-file" style="margin-right: 5px;top:0"></span>\
        <span class = "version">'+ AppConfig.version + '</span>\
        </span>\
        <span class="topNavInput spSearch"><input class="iptSearch" id="iptUserSearch"></span>\
        <span id="btnUpdate" class="topNavRight zepto-ev glyphicon glyphicon-refresh"></span>',
        bottom: false,
        backDisable: true,
        module: 'project'
    };
    UserSelScreen.prototype = {
        show:function(){
            $.ajax({url:'static/app/PatrolApp/views/screen/userSelScreen.html'}).done(function(resultHtml){
                ElScreenContainer.innerHTML = resultHtml;
                //dataManager.initPage(_this.init);
                dataManager.update(_this.init);
                dataManager.attachNetworkEvent(_this.init);
            })
        },
        init:function(){
            _this.initNav();
            if(!curSet)curSet = {};
            if(typeof userAll != 'undefined'){
                _this.initUserData(userAll);
                _this.initTopTool();
                _this.initUserList();
            }else {
                WebAPI.get('/patrol/executor/getList/' + AppConfig.projectId).done(function (result) {
                    userAll = result.data;
                    _this.initUserData(result.data);
                    _this.initTopTool();
                    _this.initUserList();
                })
            }
        },
        initNav:function(){
            $('#btnUpdate').off('tap').on('tap',function(){
                dataManager.update(_this.init);
                //dataManager.Deferred.done(function(){
                //    _this.init();
                //});
            });
            $('#spClearCache').off('tap').on('tap',function(){
                //infoBox.confirm('清除缓存将会清除一切巡更日志以及缓存文件，如确定，之后请重进App。',
                //function(){_this.clearCache(Init);});
                router.to({
                    typeClass:LogScreen
                })
            });
            $('#iptUserSearch').off('input propertychange').on('input propertychange',function(e){
                var target = $(e.currentTarget).val();
                var $divUser = $('.divUser ');
                if (target) {
                    $divUser.hide();
                    for (var i = 0; i < $divUser.length; i++) {
                        if ($divUser[i].innerText.toLowerCase().indexOf(target.toLowerCase()) > -1) {
                            $divUser.eq(i).show();
                        }
                    }
                }else{
                    $divUser.show();
                }
            });
        },
        initUserData:function(arrUser){
            _this.userDiv = {};
            for (var i = 0 ; i < arrUser.length ;i++){
                if (typeof _this.userDiv[arrUser[i].department] == 'undefined'){
                    _this.userDiv[arrUser[i].department] = [];
                }
                _this.userDiv[arrUser[i].department].push(arrUser[i])
            }
        },
        initTopTool:function(){
            var $btnToolGrp = $('#ulBtnDepart').html('');
            var $userList = $('#ctnUserList').html('');
            var btn;
            btn = document.createElement('li');
            btn.className = 'liBtnDepart zepto-ev selected';
            btn.setAttribute('depart','all');
            btn.textContent = '全部';
            $btnToolGrp.prepend(btn);
            for (var depart in _this.userDiv){
                btn = document.createElement('li');
                btn.className = 'liBtnDepart zepto-ev';
                btn.setAttribute('depart',depart);
                btn.textContent = depart;
                $btnToolGrp.append(btn);
            }
            //$btnToolGrp.children().addClass('col-xs-' + Math.floor(12/(departNum + 1)));
            $btnToolGrp.off('tap').on('tap','.liBtnDepart',function(e){
                $btnToolGrp.find('>div').removeClass('selected');
                $(e.currentTarget).addClass('selected');
                var depart = e.currentTarget.getAttribute('depart');
                if (depart == 'all'){
                    $userList.find('>div').show();
                }else{
                    $userList.find('>div').hide();
                    $userList.find('[depart="'+ depart +'"]').show();
                }
            })
        },
        initUserList:function(){
            var $userList = $('#ctnUserList').html('');
            var strUser;
            var $user;
            for (var depart in _this.userDiv){
                for (var i= 0 ; i < _this.userDiv[depart].length; i++){
                    strUser = '\
                    <div class="divUser zepto-ev row" id="' + _this.userDiv[depart][i]['_id'] + '" depart="'+_this.userDiv[depart][i].department +'">\
                        <div class="divUserName col-xs-6">' + _this.userDiv[depart][i].name +'\
                        </div>\
                        <div class="divUserDepart col-xs-6">' + _this.userDiv[depart][i].department +'\
                        </div>\
                    ';
                    $userList.append(strUser);
                }
            }
            $userList.off('tap').on('tap','.divUser',function(e){
                for (var i = 0; i < _this.userDiv[e.currentTarget.getAttribute('depart')].length; i++){
                    if (e.currentTarget.id == _this.userDiv[e.currentTarget.getAttribute('depart')][i]['_id']){
                        curSet.user = _this.userDiv[e.currentTarget.getAttribute('depart')][i];
                        break;
                    }
                }
                router.to({
                    typeClass:PathSelScreen
                })
            });
            _this.initJump()
        },
        initJump:function(){
            if (curSet.log){
                $('#ctnJump').show();
            }
            $('#btnJump').off('touchstart').on('touchstart',function(){
                if (curSet.ptCompleteIndex + 1 >= curSet.path.path.length){
                    //patrolLog[curSet.patrolIndex].endTime = new Date().format('yyyy-MM-dd HH:mm:ss');
                    router.to({
                        typeClass:MissionResultScreen
                    })
                }else {
                    router.to({
                        typeClass: PointScreen
                    })
                }
            });
            $('#btnCancel').off('touchstart').on('touchstart',function(){
                localStorage.removeItem('curSet');
                curSet = {};
                $('#ctnJump').hide();
            })
        },
        clearCache:function(callback){
            localStorage.clear();
            if(dataManager.file.enable) {
                dataManager.file.write([
                    {type: 'userAll', data: []},
                    {type: 'pathAll', data: []},
                    {type: 'pointAll', data: []},
                    {type: 'missionAll', data: []},
                    {type: 'patrolLog', data: []}
                ], function (store) {
                    dataManager.patrolLog = [];
                    callback();
                });
            }else{
                dataManager.patrolLog = [];
                callback();
            }
        },
        close:function(){
            dataManager.removeNetworkEvent();
            dataManager.clearPage();
        }
    };
    return UserSelScreen;
})();