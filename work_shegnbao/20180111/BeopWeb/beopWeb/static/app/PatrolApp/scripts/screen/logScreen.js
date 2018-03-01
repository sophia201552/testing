/**
 * Created by win7 on 2016/3/2.
 */
var LogScreen = (function(){
    function LogScreen(){
        this.store = [];
    }
    LogScreen.navOptions = {
        top:
        '<span id="spClearCache" class = "zepto-ev topNavLeft topTool">\
            <span id="btnClearCache" class = "glyphicon glyphicon-trash" style="margin-right: 5px;top:0"></span>\
            <span>清除缓存</span>\
        </span>\
        <span id="btnFile" class="topNavRight zepto-ev glyphicon glyphicon-file"></span>\
        <span id="btnUpdate" class="topNavRight zepto-ev glyphicon glyphicon-refresh"></span>',
        bottom: false,
        backDisable: false
    };
    LogScreen.prototype = {
        show:function(){
            var _this = this;
            WebAPI.get('/static/app/PatrolApp/views/screen/logScreen.html').done(function(html){
                ElScreenContainer.innerHTML = html;
                _this.initNav();
                dataManager.file.read({type:'updateLog'}).done(function(store){
                    _this.store = store.reverse();
                    _this.init();
                });
            });
        },
        init:function(){
            this.initFilter();
            this.initLog();
        },
        initFilter:function(){

        },
        initLog:function(){
            this.logCtn = document.getElementById('ctnLog');
            this.logCtn.innerHTML = '';
            var itemDom;
            for(var i = 0; i < this.store.length ;i++){
                itemDom = this.createLogItem(this.store[i]);
                if(!itemDom)continue;
                this.logCtn.appendChild(itemDom);
            }
        },
        createLogItem:function(log){
            if(!log)log = {};
            var item = document.createElement('div');
            item.className = 'divLogItem';

            var spTime = document.createElement('span');
            spTime.className = 'spTime';
            if(log.time)spTime.textContent = new Date(log.time).format('yyyy-MM-dd HH:mm:ss');
            item.appendChild(spTime);

            var spInfo = document.createElement('span');
            spInfo.className = 'spInfo';
            if(log.info)spInfo.textContent = log.info;
            item.appendChild(spInfo);


            if(!(log.patrol && log.patrol instanceof Array && log.patrol.length > 0 ))return;
            var patrol;
            for(var i = 0; i<log.patrol.length;i++){
                patrol = this.createLogItemDetail(log.patrol[i]);
                if(patrol)item.appendChild(patrol);
            }
            if(log.success === true)item.className += ' success';
            if(log.success === false)item.className += ' fail';
            return item;
        },
        createLogItemDetail:function(detail){
            var dom = document.createElement('div');
            dom.className = 'divPatrol';
            var spUser = document.createElement('span');
            spUser.className = 'spUser';
            if(detail.userName)spUser.textContent = '执行者：' + detail.userName;
            dom.appendChild(spUser);

            var spPath = document.createElement('span');
            spPath.className = 'spPath';
            if(detail.pathName)spPath.textContent = '路线：' + detail.pathName;
            dom.appendChild(spPath);

            var spRelateTime = document.createElement('span');
            spRelateTime.className = 'spRelateTime';
            dom.appendChild(spRelateTime);

            var spPlanTime = document.createElement('span');
            spPlanTime.className = 'spPlanTime';
            if(detail.planDate)spPlanTime.textContent = '计划时间：' + detail.planDate;
            spRelateTime.appendChild(spPlanTime);

            var spStartTime = document.createElement('span');
            spStartTime.className = 'spStartTime';
            if(detail.startTime)spStartTime.textContent = '执行时间：' + new Date(detail.startTime).format('yyyy-MM-dd HH:mm:ss');
            spRelateTime.appendChild(spStartTime);

            var spEndTime = document.createElement('span');
            spEndTime.className = 'spEndTime';
            if(detail.endTime)spEndTime.textContent = '~' + new Date(detail.endTime).format('yyyy-MM-dd HH:mm:ss');
            spRelateTime.appendChild(spEndTime);


            var spStatus = document.createElement('span');
            spStatus.className = 'spStatus';
            if(detail.path)spStatus.textContent = '节点完成情况：' + this.getMissionStatus(detail.path);
            dom.appendChild(spStatus);

            var spVersion = document.createElement('span');
            spVersion.className = 'spVersion';
            if(detail.version)spVersion.textContent = '版本：' + detail.version;
            dom.appendChild(spVersion);

            return dom;
        },
        getMissionStatus:function(point){
            if(!(point instanceof Array))return '路径结构错误';
            for(var i = 0; i < point.length ;i++){
                if(point[i].error == 2){
                    return '部分完成'
                }
            }
            return '全部完成'
        },
        initNav:function(){
            var _this = this;
            $('#spClearCache').off('tap').on('tap',function(){
                infoBox.confirm('清除缓存将会清除一切巡更日志以及缓存文件，如确定，之后请重进App。',
                function(){_this.clearCache(Init);});
            });
            $('#btnUpdate').off('tap').on('tap',function(){
                if(!_this.store)return;
                WebAPI.post('/patrol/log/saveOperateLog',_this.store).done(function(){
                    window.plugins.toast.show('操作日志上传成功', 'short', 'bottom');
                })
            })
            $('#btnFile').off('tap').on('tap',function(){
                if (!dataManager.file.enable)return;
                var arr = [
                    'userAll','missionAll','pathAll','patrolLog','pointAll','updateLog'
                ]
                var arrRequest = arr.map(function(item){
                    return dataManager.file.getSize(item)
                })
                $.when.apply(this,arrRequest).done(function(){
                    var arrStr = [];
                    var arg = arguments
                    arr.forEach(function(item,index){
                        arrStr.push(arr[index]+ ':' + arg[index] + 'B')
                    })
                    infoBox.alert(arrStr.join('</br>'))
                })
            })
        },
        clearCache:function(callback){
            localStorage.clear();
            if(dataManager.file.enable) {
                $.when(dataManager.file.write({type: 'userAll', data: []}),
                dataManager.file.write({type: 'pathAll', data: []}),
                dataManager.file.write({type: 'pointAll', data: []}),
                dataManager.file.write({type: 'missionAll', data: []}),
                dataManager.file.write({type: 'patrolLog', data: []}),
                dataManager.file.write({type: 'updateLog', data: []})).done( function (store) {
                    dataManager.patrolLog = [];
                    callback();
                }).fail(function(){
                    window.plugins.toast.show('清除缓存失败', 'short', 'bottom');
                });
            }else{
                dataManager.patrolLog = [];
                callback();
            }
        },
    };
    return LogScreen;
})();