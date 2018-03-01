/**
 * Created by win7 on 2016/3/16.
 */
var DataManager = (function(){
    var _this;
    function DataManager (){
        _this = this;
        _this.file = new FileStorage('BeopPatrol');
        _this.patrolLog = [];
        _this.callback = undefined;
    }
    DataManager.prototype = {
        update:function(callback,isForceFile){
            //debugger;
            SpinnerControl.show();
            if(navigator.connection) {
                //if (isForceFile){
                //    _this.updateFromFile();
                //    return;
                //}
                if (navigator.connection.type == 'none') {
                    _this.updateFromFile(callback);
                } else {
                    _this.updateFromNet(callback);
                }
            }else{
                //_this.updateFromFile();
                _this.updateFromNet(callback);
            }
        },
        getPatrolLogFromFile:function(callback){
            if(_this.file.enable) {
                _this.file.read(['patrolLog'], function (store) {
                    if (store.patrolLog.status == 'success')_this.patrolLog = store.patrolLog.result;
                    callback();
                });
            }else{
                callback();
            }
        },
        clearPage:function(){
            _this.callback = undefined;
            _this.page = undefined;
        },
        attachNetworkEvent:function(func){
            if(typeof  func == 'function'){
                _this.callback = func;
            }
            document.addEventListener("online", _this.updateWrap, false);
        },
        updateWrap:function(){
            console.log('online success');
            window.plugins.toast.show('网络已连接', 'short', 'bottom');
            _this.update(_this.callback);
        },
        removeNetworkEvent:function(){
            _this.callback = undefined;
            document.removeEventListener("online", _this.updateWrap, false);
        },
        updateFromFile:function(callback){

            if (curSet && curSet.path && curSet.path.path && curSet.ptCompleteIndex >= curSet.path.path.length){
                _this.file.read(['userAll','missionAll','pointAll','pathAll'],function(store){
                    (store.userAll.status == 'success') && (userAll = store.userAll.result);
                    (store.pathAll.status == 'success') && (pathAll = store.pathAll.result);
                    (store.missionAll.status == 'success') && (missionAll = store.missionAll.result);
                    (store.pointAll.status == 'success') && (pointAll = store.pointAll.result);
                    _this.patrolLog.push(curSet.log);
                    _this.file.write([{type:'patrolLog',data:_this.patrolLog}],function(store){
                        if(store.patrolLog && store.patrolLog.status == 'success'){
                            //_this.saveUpdateLog(true, {
                            //    patrol: [$.extend(true, {}, curSet.log)],
                            //    type:'cache',
                            //    info:'日志离线缓存成功'
                            //});
                            curSet = {};
                            localStorage.removeItem('curSet');
                            console.log('记录缓存成功');
                            window.plugins && window.plugins.toast.show('记录缓存成功', 'short', 'bottom');
                        }else{
                            //_this.saveUpdateLog(true, {
                            //    patrol: [$.extend(true, {}, curSet.log)],
                            //    type:'cache',
                            //    info:'日志离线缓存失败'
                            //});
                            console.log('记录缓存失败');
                            window.plugins && window.plugins.toast.show('记录缓存失败，请于联网状态下及时上传。', 'short', 'bottom');
                        }
                        SpinnerControl.hide();
                        callback();
                    })
                });
            }else{
                _this.file.read(['userAll','missionAll','pointAll','pathAll'],function(store){
                    (store.userAll.status == 'success') && (userAll = store.userAll.result);
                    (store.pathAll.status == 'success') && (pathAll = store.pathAll.result);
                    (store.missionAll.status == 'success') && (missionAll = store.missionAll.result);
                    (store.pointAll.status == 'success') && (pointAll = store.pointAll.result);
                    SpinnerControl.hide();
                    callback();
                });
            }
        },
        saveUpdateLog:function(success,log,callback){
            var _this = this;
            if(!_this.file.enable)return;
            _this.file.read([{type:'updateLog'}],function(store){
                var newLog,updateLog;
                if(store && store.updateLog.status == 'success') {
                    updateLog = store.updateLog.result;
                }
                if (updateLog instanceof Array) {
                    newLog = updateLog.filter(function (val) {
                        return (val.time && (new Date() - new Date(val.time)) < 259200000)
                    });
                }else{
                    newLog = [];
                }
                newLog.push({
                    time: new Date(),
                    type:log.type,
                    patrol: log.patrol,
                    isSuccess: success,
                    info:log.info
                });
                _this.file.write([{data:newLog,type:'updateLog'}],callback);
            })
        },
        updateFromNet:function(callback){
            if(curSet && curSet.log && curSet.ptCompleteIndex >= curSet.path.path.length){
                if(!(_this.patrolLog instanceof Array)){
                    _this.patrolLog = [];
                }
                _this.patrolLog.push(curSet.log)
            }
            if(!curSet)curSet = {};
            if(!(_this.patrolLog && _this.patrolLog.length > 0)){
                $.when(
                    WebAPI.get('/patrol/executor/getList/' + AppConfig.projectId),
                    WebAPI.get('/patrol/path/getAll/' + AppConfig.projectId),
                    WebAPI.get('/patrol/mission/get/' + AppConfig.projectId +'/' + PatrolSchedule.getMonday(new Date()) + '/' + PatrolSchedule.getSunday(new Date())),
                    WebAPI.get('/patrol/point/getList/' + AppConfig.projectId)
                ).done(function (userAjax, pathAjax, missionAjax, pointAjax) {
                        userAll = userAjax[0].data;
                        pathAll = pathAjax[0].data;
                        missionAll = missionAjax[0].data;
                        pointAll = pointAjax[0].data;
                        if (_this.file.enable) {
                            _this.file.write([
                                {type: 'userAll', data: userAll},
                                {type: 'pathAll', data: pathAll},
                                {type: 'missionAll', data: missionAll},
                                {type: 'pointAll', data: pointAll}
                            ], function (store) {
                                (store.userAll.status == 'success') && console.log('人员信息缓存成功');
                                (store.pathAll.status == 'success') && console.log('路径信息缓存成功');
                                (store.missionAll.status == 'success') && console.log('排班信息缓存成功');
                                (store.pointAll.status == 'success') && console.log('点位信息缓存成功');
                                callback();
                            });
                        }else{
                            callback();
                        }
                        if(window.plugins) {
                            window.plugins.toast.show('数据同步成功', 'short', 'bottom');
                        }
                    }).fail(function(userAjax, pathAjax, missionAjax, pointAjax){
                        _this.updateFromFile(callback);
                        window.plugins.toast.show('数据同步失败', 'short', 'bottom');
                    }).always(function () {
                        SpinnerControl.hide();
                    })
            }else{
                $.when(
                    WebAPI.get('/patrol/executor/getList/' + AppConfig.projectId),
                    WebAPI.get('/patrol/path/getAll/' + AppConfig.projectId),
                    WebAPI.get('/patrol/mission/get/' + AppConfig.projectId +'/' + PatrolSchedule.getMonday(new Date()) + '/' + PatrolSchedule.getSunday(new Date())),
                    WebAPI.get('/patrol/point/getList/' + AppConfig.projectId),
                    WebAPI.post('/patrol/log/saveMulti', _this.patrolLog)
                ).done(function (userAjax, pathAjax, missionAjax, pointAjax, patrolLogAjax) {
                        userAll = userAjax[0].data;
                        pathAll = pathAjax[0].data;
                        missionAll = missionAjax[0].data;
                        pointAll = pointAjax[0].data;
                        if(_this.file.enable) {
                            _this.file.write([
                                {type: 'userAll', data: userAll},
                                {type: 'pathAll', data: pathAll},
                                {type: 'missionAll', data: missionAll},
                                {type: 'pointAll', data: pointAll}
                            ], function (store) {
                                (store.userAll.status == 'success') && console.log('人员信息缓存成功');
                                (store.pathAll.status == 'success') && console.log('路径信息缓存成功');
                                (store.missionAll.status == 'success') && console.log('排班信息缓存成功');
                                (store.pointAll.status == 'success') && console.log('点位信息缓存成功');
                                if (patrolLogAjax[1] == 'success' && _this.checkLog(patrolLogAjax[0].data)) {
                                    _this.saveUpdateLog(true, {
                                        patrol: [].concat(_this.patrolLog),
                                        type:'net',
                                        info:'上传数据成功'
                                    });
                                    if (window.plugins) {
                                        window.plugins.toast.show('上传数据成功', 'short', 'bottom');
                                    }
                                    curSet = {};
                                    localStorage.removeItem('curSet');
                                    _this.patrolLog = [];
                                    _this.file.write([{type:'patrolLog',data:[]}]);
                                    callback();
                                } else {
                                    _this.saveUpdateLog(false, {
                                        patrol: [].concat(_this.patrolLog),
                                        type:'net',
                                        info:'上传数据失败'
                                    });
                                    _this.file.write([{type:'patrolLog',data:_this.patrolLog}],function(store){
                                        if(store.patrolLog && store.patrolLog.status == 'success'){
                                            //_this.saveUpdateLog(true, {
                                            //    patrol: [$.extend(true, {}, curSet.log)],
                                            //    type:'cache',
                                            //    info:'日志离线缓存成功'
                                            //});
                                            curSet = {};
                                            localStorage.removeItem('curSet');
                                            console.log('记录缓存成功');
                                            window.plugins && window.plugins.toast.show('记录缓存成功', 'short', 'bottom');
                                        }else{
                                            //_this.saveUpdateLog(true, {
                                            //    patrol: [$.extend(true, {}, curSet.log)],
                                            //    type:'cache',
                                            //    info:'日志离线缓存失败'
                                            //});
                                            console.log('记录缓存失败');
                                            window.plugins && window.plugins.toast.show('记录缓存失败，请于联网状态下及时上传。', 'short', 'bottom');
                                        }
                                        SpinnerControl.hide();
                                        callback();
                                    });
                                    if (window.plugins) {
                                        window.plugins.toast.show('上传数据失败', 'short', 'bottom');
                                    }
                                }
                            });
                        }else {
                            if (patrolLogAjax[1] == 'success' && _this.checkLog(patrolLogAjax[0].data)) {
                                _this.saveUpdateLog(true, {
                                    patrol: [].concat(_this.patrolLog),
                                    curSet: $.extend(true, {}, curSet)
                                });
                                if (window.plugins) {
                                    window.plugins.toast.show('上传数据成功', 'short', 'bottom');
                                }
                                curSet = {};
                                localStorage.removeItem('curSet');
                                _this.file.write([{type:'patrolLog',data:[]}]);
                            } else {
                                _this.saveUpdateLog(false);
                                if (window.plugins) {
                                    window.plugins.toast.show('上传数据失败', 'short', 'bottom');
                                }
                            }
                            callback();
                        }
                    }).fail(function(){
                        window.plugins.toast.show('上传数据失败', 'short', 'bottom');
                        _this.updateFromFile(callback)
                    }).always(function () {
                        SpinnerControl.hide();
                    })
            }
        },
        checkLog:function(arrLog){
            if (arrLog instanceof Array && arrLog.length > 0){
                for (var i= 0; i < arrLog.length; i++){
                    if (!arrLog[i])return false;
                }
                return true;
            }else{
                return false;
            }
        }
    };
    return DataManager
})();
var PatrolSchedule = (function(){
    function getMonday(date){
        var monday = date;
        if(monday.getDay() === 0){
            monday = monday.setDate(monday.getDate()-6);
        }else{
            monday = monday.setDate(monday.getDate()+1-monday.getDay());
        }
        return new Date(monday).format('yyyy-MM-dd');
    }

    function getSunday(date){
        var sunday = date;
        if(sunday.getDay() === 0){
            sunday = date;
        }else{
            sunday = sunday.setDate(sunday.getDate()+7-sunday.getDay());
        }

        return new Date(sunday).format('yyyy-MM-dd');
    }
    return {
        getMonday: getMonday,
        getSunday: getSunday
    };
})();