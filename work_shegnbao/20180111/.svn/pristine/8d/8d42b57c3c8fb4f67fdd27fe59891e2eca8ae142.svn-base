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
        getUpdateStatus:function(){

        },
        update:function(callback,isForceFile){
            //debugger;
            // SpinnerControl.show();
            AppConfig.updateRecord = [];
            AppConfig.updateRecord.push({
                type:0,
                text:'信息更新开始',
                time:+new Date()
            })
            if(navigator.connection) {
                //if (isForceFile){
                //    _this.updateFromFile();
                //    return;
                //}
                if (navigator.connection.type == 'none') {
                    AppConfig.updateRecord.push({
                        type:1,
                        text:'从本地缓存更新',
                        time:+new Date()
                    })
                    _this.updateFromFile(callback);
                } else {
                    AppConfig.updateRecord.push({
                        type:1,
                        text:'从网络缓存更新',
                        time:+new Date()
                    })
                    _this.updateFromNet(callback);
                }
            }else{
                //_this.updateFromFile();
                _this.updateFromNet(callback);
            }
        },
        getPatrolLogFromFile:function(callback){
            if(_this.file.enable) {
                _this.file.read('patrolLog').done(function (store) {    
                    _this.patrolLog = store;
                }).always(function(){
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
            var now = new Date();
            function execLoadingAnimate(){
                LoadingAnimate.start(document.getElementById('indexMain'),(function(){
                    return arrRequest.map(function(item){
                        switch(item.status){
                            case 0:
                                return item.name +'中';
                            case 1:
                                return item.name + '成功';
                            case 2:
                                return item.name + '失败'
                        }
                    }).join('</br>')
                })())
            }
            var arrRequest = [
                {
                    name:'人员信息缓存读取',
                    status:0,
                    request:_this.file.read('userAll').done(function(content){
                        AppConfig.updateRecord.push({
                            type:0,
                            text:'人员信息缓存读取成功，耗时' + ((+new Date() - now)/1000).toFixed(1),
                            time:+new Date()
                        })
                        arrRequest[0].status = 1;
                        userAll = content
                    }).fail(function(msg){
                        AppConfig.updateRecord.push({
                            type:0,
                            text:'人员信息缓存读取失败，耗时' + ((+new Date() - now)/1000).toFixed(1),
                            time:+new Date()
                        })
                        AppConfig.updateRecord.push({
                            type:1,
                            text:'失败原因：' + msg,
                            time:+new Date()
                        })
                        arrRequest[0].status = 2;
                    }).always(function(){
                        execLoadingAnimate()
                    })
                },
                {
                    name:'路线信息缓存读取',
                    status:0,
                    request:_this.file.read('pathAll').done(function(content){
                        AppConfig.updateRecord.push({
                            type:0,
                            text:'路线信息缓存读取成功，耗时' + ((+new Date() - now)/1000).toFixed(1),
                            time:+new Date()
                        })
                        pathAll = content
                        arrRequest[1].status = 1;
                    }).fail(function(msg){
                        AppConfig.updateRecord.push({
                            type:0,
                            text:'路线信息缓存读取失败，耗时' + ((+new Date() - now)/1000).toFixed(1),
                            time:+new Date()
                        })
                        AppConfig.updateRecord.push({
                            type:1,
                            text:'失败原因：' + msg,
                            time:+new Date()
                        })
                        arrRequest[1].status = 2;
                    }).always(function(){
                        execLoadingAnimate()
                    })
                },
                {
                    name:'巡更点信息缓存读取',
                    status:0,
                    request:_this.file.read('pointAll').done(function(content){
                        AppConfig.updateRecord.push({
                            type:0,
                            text:'巡更点信息缓存读取成功，耗时' + ((+new Date() - now)/1000).toFixed(1),
                            time:+new Date()
                        })
                        arrRequest[2].status = 1;
                        pointAll  = content
                    }).fail(function(msg){
                        AppConfig.updateRecord.push({
                            type:0,
                            text:'巡更点信息缓存读取失败，耗时' + ((+new Date() - now)/1000).toFixed(1),
                            time:+new Date()
                        })
                        AppConfig.updateRecord.push({
                            type:1,
                            text:'失败原因：' + msg,
                            time:+new Date()
                        })
                        arrRequest[2].status = 2;
                    }).always(function(){
                        execLoadingAnimate()
                    })
                },
                {
                    name:'排班信息缓存读取',
                    status:0,
                    request:_this.file.read('missionAll').done(function(content){
                        AppConfig.updateRecord.push({
                            type:0,
                            text:'排班信息缓存读取成功，耗时' + ((+new Date() - now)/1000).toFixed(1),
                            time:+new Date()
                        })
                        arrRequest[3].status = 1;
                        missionAll = content;
                    }).fail(function(msg){
                        AppConfig.updateRecord.push({
                            type:0,
                            text:'排班信息缓存读取失败，耗时' + ((+new Date() - now)/1000).toFixed(1),
                            time:+new Date()
                        })
                        AppConfig.updateRecord.push({
                            type:1,
                            text:'失败原因：' + msg,
                            time:+new Date()
                        })
                        arrRequest[3].status = 2;
                    }).always(function(){
                        execLoadingAnimate()
                    })
                }
            ]
            execLoadingAnimate()
            if (curSet && curSet.path && curSet.path.path && curSet.ptCompleteIndex >= curSet.path.path.length){
                AppConfig.updateRecord.push({
                    type:1,
                    text:'需缓存巡更日志',
                    time:+new Date()
                })
                AppConfig.updateRecord.push({
                    type:0,
                    text:'缓存信息读取开始',
                    time:+new Date()
                })
                $.when.apply(this,arrRequest.map(function(item){return item.request})).done(function(){
                    AppConfig.updateRecord.push({
                        type:0,
                        text:'缓存信息读取成功，耗时' + ((+new Date() - now)/1000).toFixed(1),
                        time:+new Date()
                    })
                }).fail(function(){
                    AppConfig.updateRecord.push({
                        type:0,
                        text:'缓存信息读取失败，耗时' + ((+new Date() - now)/1000).toFixed(1),
                        time:+new Date()
                    })
                }).always(function(){
                    var _now = +new Date();
                    AppConfig.updateRecord.push({
                        type:0,
                        text:'缓存巡更日志开始',
                        time:+new Date()
                    })
                    _this.patrolLog.push(curSet.log)
                    LoadingAnimate.start(document.getElementById('indexMain'),'缓存巡更日志中')
                    _this.file.write({type:'patrolLog',data:_this.patrolLog}).done(function(){
                            //_this.saveUpdateLog(true, {
                            //    patrol: [$.extend(true, {}, curSet.log)],
                            //    type:'cache',
                            //    info:'日志离线缓存成功'
                            //});
                            curSet = {};
                            localStorage.removeItem('curSet');
                            console.log('记录缓存成功');
                            window.plugins && window.plugins.toast.show('记录缓存成功', 'short', 'bottom');
                            AppConfig.updateRecord.push({
                                type:0,
                                text:'缓存巡更日志成功，耗时' + ((+new Date() - _now)/1000).toFixed(1),
                                time:+new Date()
                            })
                    }).fail(function(msg){
                        //_this.saveUpdateLog(true, {
                        //    patrol: [$.extend(true, {}, curSet.log)],
                        //    type:'cache',
                        //    info:'日志离线缓存失败'
                        //});
                        console.log('记录缓存失败');
                        AppConfig.updateRecord.push({
                            type:0,
                            text:'缓存巡更日志失败，耗时' + ((+new Date() - _now)/1000).toFixed(1),
                            time:+new Date()
                        })
                        AppConfig.updateRecord.push({
                            type:1,
                            text:'失败原因：' + msg,
                            time:+new Date()
                        })
                        window.plugins && window.plugins.toast.show('记录缓存失败，请于联网状态下及时上传。', 'short', 'bottom');
                    }).always(function(){
                        LoadingAnimate.stop(document.getElementById('indexMain'))
                        callback();
                    })
                })
            }else{
                AppConfig.updateRecord.push({
                    type:1,
                    text:'无需缓存巡更日志',
                    time:+new Date()
                })
                AppConfig.updateRecord.push({
                    type:0,
                    text:'缓存信息读取开始',
                    time:+new Date()
                })
                $.when.apply(this,arrRequest.map(function(item){return item.request})).done(function(){
                    AppConfig.updateRecord.push({
                        type:0,
                        text:'缓存信息读取成功，耗时' + ((+new Date() - now)/1000).toFixed(1),
                        time:+new Date()
                    })
                }).fail(function(){
                    AppConfig.updateRecord.push({
                        type:0,
                        text:'缓存信息读取失败，耗时' + ((+new Date() - now)/1000).toFixed(1),
                        time:+new Date()
                    })
                }).always(function(){
                    LoadingAnimate.stop(document.getElementById('indexMain'))
                    callback();
                })
            }
        },
        saveUpdateLog:function(success,log,callback){
            var _this = this;
            var now = new Date();
            if(!_this.file.enable)return;
            AppConfig.updateRecord.push({
                type:0,
                text:'上传记录缓存读取开始',
                time:+new Date()
            })
            var newLog,updateLog;
            _this.file.read('updateLog').done(function(store){
                    updateLog = store;
                    AppConfig.updateRecord.push({
                        type:0,
                        text:'上传记录缓存读取成功，耗时' + ((+new Date() - now)/1000).toFixed(1),
                        time:+new Date()
                    })
            }).always(function(){
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
                AppConfig.updateRecord.push({
                    type:0,
                    text:'上传记录缓存记录开始',
                    time:+new Date()
                })
                var _now = +new Date();
                _this.file.write({data:newLog,type:'updateLog'}).done(function(){
                    AppConfig.updateRecord.push({
                        type:0,
                        text:'上传记录缓存读取成功，耗时' + ((+new Date() - _now)/1000).toFixed(1),
                        time:+new Date()
                    })
                }).fail(function(msg){
                    AppConfig.updateRecord.push({
                        type:0,
                        text:'失败原因：' + msg,
                        time:+new Date()
                    })
                }).always(function(){
                    callback && callback();
                });
            })
        },
        updateFromNet:function(callback){
            var arrCacheRequest = [];
            function execLoadingAnimate(request){
                LoadingAnimate.start(document.getElementById('indexMain'),(function(){
                    return request.map(function(item){
                        switch(item.status){
                            case 0:
                                return item.name +'中';
                            case 1:
                                return item.name + '成功';
                            case 2:
                                return item.name + '失败'
                        }
                    }).join('</br>')
                })())
            }
            
            if(curSet && curSet.log && curSet.ptCompleteIndex >= curSet.path.path.length){
                if(!(_this.patrolLog instanceof Array)){
                    _this.patrolLog = [];
                }
                _this.patrolLog.push(curSet.log)
            }
            if(!curSet)curSet = {};
            var now = +new Date();
            var arrRequest = [     
                {
                    name:'人员信息下载',
                    status:0,
                    request:WebAPI.get('/patrol/executor/getList/' + AppConfig.projectId).done(function(){                
                        AppConfig.updateRecord.push({
                            type:0,
                            text:'人员信息下载成功，耗时' + ((+new Date() - now)/1000).toFixed(1),
                            time:+new Date()
                        })
                        arrRequest[0].status = 1;
                    }).fail(function(){
                        AppConfig.updateRecord.push({
                            type:0,
                            text:'人员信息下载失败，耗时' + ((+new Date() - now)/1000).toFixed(1),
                            time:+new Date()
                        })
                        arrRequest[0].status = 2;
                    }).always(function(){
                        execLoadingAnimate(arrRequest)
                    })
                },{
                    name:'路线信息下载',
                    status:0,
                    request:WebAPI.get('/patrol/path/getAll/' + AppConfig.projectId).done(function(){                
                        AppConfig.updateRecord.push({
                            type:0,
                            text:'路线信息下载成功，耗时' + ((+new Date() - now)/1000).toFixed(1),
                            time:+new Date()
                        })
                        arrRequest[1].status = 1;
                    }).fail(function(){
                        AppConfig.updateRecord.push({
                            type:0,
                            text:'路线信息下载失败，耗时' + ((+new Date() - now)/1000).toFixed(1),
                            time:+new Date()
                        })
                        arrRequest[1].status = 2;
                    }).always(function(){
                        execLoadingAnimate(arrRequest)
                    })
                },
                {
                    name:'排班信息下载',
                    status:0,
                    request:
                    WebAPI.get('/patrol/mission/get/' + AppConfig.projectId +'/' + PatrolSchedule.getMonday(new Date()) + '/' + PatrolSchedule.getSunday(new Date())).done(function(){                
                        AppConfig.updateRecord.push({
                            type:0,
                            text:'排班信息下载成功，耗时' + ((+new Date() - now)/1000).toFixed(1),
                            time:+new Date()
                        })
                        arrRequest[2].status = 1;
                    }).fail(function(){
                        AppConfig.updateRecord.push({
                            type:0,
                            text:'排班信息下载失败，耗时' + ((+new Date() - now)/1000).toFixed(1),
                            time:+new Date()
                        })
                        arrRequest[2].status = 2;
                    }).always(function(){
                        execLoadingAnimate(arrRequest)
                    })
                },
                {
                    name:'巡更点信息下载',
                    status:0,
                    request:WebAPI.get('/patrol/point/getList/' + AppConfig.projectId).done(function(){
                        AppConfig.updateRecord.push({
                            type:0,
                            text:'巡更点信息下载成功，耗时' + ((+new Date() - now)/1000).toFixed(1),
                            time:+new Date()
                        })
                        arrRequest[3].status = 1;
                    }).fail(function(){
                        AppConfig.updateRecord.push({
                            type:0,
                            text:'巡更点信息下载失败，耗时' + ((+new Date() - now)/1000).toFixed(1),
                            time:+new Date()
                        })
                        arrRequest[3].status = 2;
                    }).always(function(){
                        execLoadingAnimate(arrRequest)
                    })
                }
            ]
            AppConfig.updateRecord.push({
                type:0,
                text:'云端信息下载开始',
                time:+new Date()
            })
            execLoadingAnimate(arrRequest)
            if(!(_this.patrolLog && _this.patrolLog.length > 0)){
                AppConfig.updateRecord.push({
                    type:1,
                    text:'无日志提交',
                    time:+new Date()
                })
                $.when.apply(this,arrRequest.map(function(request){return request.request})).done(function (userAjax, pathAjax, missionAjax, pointAjax) {
                        AppConfig.updateRecord.push({
                            type:0,
                            text:'云端信息下载成功，无日志提交成功，耗时' + ((+new Date() - now)/1000).toFixed(1),
                            time:+new Date()
                        })
                        userAll = userAjax[0].data;
                        pathAll = pathAjax[0].data;
                        missionAll = missionAjax[0].data;
                        pointAll = pointAjax[0].data;
                        if (_this.file.enable) {
                            var _now = +new Date()
                            AppConfig.updateRecord.push({
                                type:0,
                                text:'云端信息缓存开始',
                                time:+new Date()
                            })
                            arrCacheRequest = [
                                {
                                    name:'人员信息缓存',
                                    status:0,
                                    request:_this.file.write({type: 'userAll', data: userAll}).done(function(content){
                                        AppConfig.updateRecord.push({
                                            type:0,
                                            text:'人员信息缓存成功，耗时' + ((+new Date() - _now)/1000).toFixed(1),
                                            time:+new Date()
                                        })
                                        arrCacheRequest[0].status = 1;
                                    }).fail(function(msg){
                                        AppConfig.updateRecord.push({
                                            type:0,
                                            text:'人员信息缓存失败，耗时' + ((+new Date() - _now)/1000).toFixed(1),
                                            time:+new Date()
                                        })
                                        AppConfig.updateRecord.push({
                                            type:1,
                                            text:'失败原因：' + msg,
                                            time:+new Date()
                                        })
                                        arrCacheRequest[0].status = 2;
                                    }).always(function(){
                                        execLoadingAnimate(arrCacheRequest)
                                    })
                                },
                                {
                                    name:'路线信息缓存',
                                    status:0,
                                    request:_this.file.write({type: 'pathAll', data: pathAll}).done(function(content){
                                        AppConfig.updateRecord.push({
                                            type:0,
                                            text:'路线信息缓存成功，耗时' + ((+new Date() - _now)/1000).toFixed(1),
                                            time:+new Date()
                                        })
                                        arrCacheRequest[1].status = 1;
                                    }).fail(function(msg){
                                        AppConfig.updateRecord.push({
                                            type:0,
                                            text:'路线信息缓存失败，耗时' + ((+new Date() - _now)/1000).toFixed(1),
                                            time:+new Date()
                                        })
                                        AppConfig.updateRecord.push({
                                            type:1,
                                            text:'失败原因：' + msg,
                                            time:+new Date()
                                        })
                                        arrCacheRequest[1].status = 2;
                                    }).always(function(){
                                        execLoadingAnimate(arrCacheRequest)
                                    })
                                },
                                {
                                    name:'巡更点信息缓存',
                                    status:0,
                                    request:_this.file.write({type: 'pointAll', data: pointAll}).done(function(content){
                                        AppConfig.updateRecord.push({
                                            type:0,
                                            text:'巡更点信息缓存成功，耗时' + ((+new Date() - _now)/1000).toFixed(1),
                                            time:+new Date()
                                        })
                                        arrCacheRequest[2].status = 1;
                                    }).fail(function(msg){
                                        AppConfig.updateRecord.push({
                                            type:0,
                                            text:'巡更点信息缓存失败，耗时' + ((+new Date() - _now)/1000).toFixed(1),
                                            time:+new Date()
                                        })
                                        AppConfig.updateRecord.push({
                                            type:1,
                                            text:'失败原因：' + msg,
                                            time:+new Date()
                                        })
                                        arrCacheRequest[2].status = 2;
                                    }).always(function(){
                                        execLoadingAnimate(arrCacheRequest)
                                    })
                                },
                                {
                                    name:'排班信息缓存',
                                    status:0,
                                    request:_this.file.write({type: 'missionAll', data: missionAll}).done(function(content){
                                        AppConfig.updateRecord.push({
                                            type:0,
                                            text:'排班信息缓存成功，耗时' + ((+new Date() - _now)/1000).toFixed(1),
                                            time:+new Date()
                                        })
                                        arrCacheRequest[3].status = 1;
                                    }).fail(function(msg){
                                        AppConfig.updateRecord.push({
                                            type:0,
                                            text:'排班信息缓存失败，耗时' + ((+new Date() - _now)/1000).toFixed(1),
                                            time:+new Date()
                                        })
                                        AppConfig.updateRecord.push({
                                            type:1,
                                            text:'失败原因：' + msg,
                                            time:+new Date()
                                        })
                                        arrCacheRequest[3].status = 2;
                                    }).always(function(){
                                        execLoadingAnimate(arrCacheRequest)
                                    })
                                }
                            ]
                            $.when.apply(this,arrCacheRequest.map(function(item){return item.request})).done(function(){
                                AppConfig.updateRecord.push({
                                    type:0,
                                    text:'云端信息缓存成功，耗时' + ((+new Date() - _now)/1000).toFixed(1),
                                    time:+new Date()
                                })
                            }).fail(function(){
                                AppConfig.updateRecord.push({
                                    type:0,
                                    text:'云端信息缓存失败，耗时' + ((+new Date() - _now)/1000).toFixed(1),
                                    time:+new Date()
                                })
                            }).always(function(){
                                callback();
                            })
                        }else{
                            callback();
                        }
                        if(window.plugins) {
                            window.plugins.toast.show('数据同步成功', 'short', 'bottom');
                        }
                        LoadingAnimate.stop(document.getElementById('indexMain'))
                    }).fail(function(userAjax, pathAjax, missionAjax, pointAjax){
                        AppConfig.updateRecord.push({
                            type:0,
                            text:'云端信息下载失败，无日志提交，耗时' + ((+new Date() - now)/1000).toFixed(1),
                            time:+new Date()
                        })
                        LoadingAnimate.stop(document.getElementById('indexMain'))
                        _this.updateFromFile(callback);
                        window.plugins.toast.show('数据同步失败', 'short', 'bottom');
                    })
            }else{
                AppConfig.updateRecord.push({
                    type:1,
                    text:'有日志提交',
                    time:+new Date()
                })
                arrRequest.push({
                    name:'巡更日志提交',
                    status:0,
                    request:WebAPI.post('/patrol/log/saveMulti', _this.patrolLog).done(function(){                
                        AppConfig.updateRecord.push({
                            type:0,
                            text:'巡更日志提交成功，耗时' + ((+new Date() - now)/1000).toFixed(1),
                            time:+new Date()
                        })
                        arrRequest[4].status = 1;
                    }).fail(function(){
                        AppConfig.updateRecord.push({
                            type:0,
                            text:'巡更日志提交失败，耗时' + ((+new Date() - now)/1000).toFixed(1),
                            time:+new Date()
                        })
                        arrRequest[4].status = 2;
                    }).always(function(){
                        execLoadingAnimate(arrRequest)
                    })
                }
                )
                $.when.apply(this,arrRequest.map(function(item){return item.request})).done(function (userAjax, pathAjax, missionAjax, pointAjax, patrolLogAjax) {
                    AppConfig.updateRecord.push({
                        type:0,
                        text:'云端信息下载并成功提交日志，耗时' + ((+new Date() - now)/1000).toFixed(1),
                        time:+new Date()
                    })
                    userAll = userAjax[0].data;
                    pathAll = pathAjax[0].data;
                    missionAll = missionAjax[0].data;
                    pointAll = pointAjax[0].data;
                    if(_this.file.enable) {
                        var _now = +new Date();
                        AppConfig.updateRecord.push({
                            type:0,
                            text:'云端信息缓存开始',
                            time:+new Date()
                        })
                        arrCacheRequest = [
                            {
                                name:'人员信息缓存',
                                status:0,
                                request:_this.file.write({type: 'userAll', data: userAll}).done(function(content){
                                    AppConfig.updateRecord.push({
                                        type:0,
                                        text:'人员信息缓存成功，耗时' + ((+new Date() - _now)/1000).toFixed(1),
                                        time:+new Date()
                                    })
                                    arrCacheRequest[0].status = 1;
                                }).fail(function(msg){
                                    AppConfig.updateRecord.push({
                                        type:0,
                                        text:'人员信息缓存失败，耗时' + ((+new Date() - _now)/1000).toFixed(1),
                                        time:+new Date()
                                    })
                                    AppConfig.updateRecord.push({
                                        type:1,
                                        text:'失败原因：' + msg,
                                        time:+new Date()
                                    })
                                    arrCacheRequest[0].status = 2;
                                }).always(function(){
                                    execLoadingAnimate(arrCacheRequest)
                                })
                            },
                            {
                                name:'路线信息缓存',
                                status:0,
                                request:_this.file.write({type: 'pathAll', data: pathAll}).done(function(content){
                                    AppConfig.updateRecord.push({
                                        type:0,
                                        text:'路线信息缓存成功，耗时' + ((+new Date() - _now)/1000).toFixed(1),
                                        time:+new Date()
                                    })
                                    arrCacheRequest[1].status = 1;
                                }).fail(function(msg){
                                    AppConfig.updateRecord.push({
                                        type:0,
                                        text:'路线信息缓存失败，耗时' + ((+new Date() - _now)/1000).toFixed(1),
                                        time:+new Date()
                                    })
                                    AppConfig.updateRecord.push({
                                        type:1,
                                        text:'失败原因：' + msg,
                                        time:+new Date()
                                    })
                                    arrCacheRequest[1].status = 2;
                                }).always(function(){
                                    execLoadingAnimate(arrCacheRequest)
                                })
                            },
                            {
                                name:'巡更点信息缓存',
                                status:0,
                                request:_this.file.write({type: 'pointAll', data: pointAll}).done(function(content){
                                    AppConfig.updateRecord.push({
                                        type:0,
                                        text:'巡更点信息缓存成功，耗时' + ((+new Date() - _now)/1000).toFixed(1),
                                        time:+new Date()
                                    })
                                    arrCacheRequest[2].status = 1;
                                }).fail(function(msg){
                                    AppConfig.updateRecord.push({
                                        type:0,
                                        text:'巡更点信息缓存失败，耗时' + ((+new Date() - _now)/1000).toFixed(1),
                                        time:+new Date()
                                    })
                                    AppConfig.updateRecord.push({
                                        type:1,
                                        text:'失败原因：' + msg,
                                        time:+new Date()
                                    })
                                    arrCacheRequest[2].status = 2;
                                }).always(function(){
                                    execLoadingAnimate(arrCacheRequest)
                                })
                            },
                            {
                                name:'排班信息缓存',
                                status:0,
                                request:_this.file.write({type: 'missionAll', data: missionAll}).done(function(content){
                                    AppConfig.updateRecord.push({
                                        type:0,
                                        text:'排班信息缓存成功，耗时' + ((+new Date() - _now)/1000).toFixed(1),
                                        time:+new Date()
                                    })
                                    arrCacheRequest[3].status = 1;
                                }).fail(function(msg){
                                    AppConfig.updateRecord.push({
                                        type:0,
                                        text:'排班信息缓存失败，耗时' + ((+new Date() - _now)/1000).toFixed(1),
                                        time:+new Date()
                                    })
                                    AppConfig.updateRecord.push({
                                        type:1,
                                        text:'失败原因：' + msg,
                                        time:+new Date()
                                    })
                                    arrCacheRequest[3].status = 2;
                                }).always(function(){
                                    execLoadingAnimate(arrCacheRequest)
                                })
                            }
                        ]
                        $.when.apply(this,arrCacheRequest.map(function(item){return item.request})).done(function(){
                            AppConfig.updateRecord.push({
                                type:0,
                                text:'云端信息缓存成功，耗时' + ((+new Date() - _now)/1000).toFixed(1),
                                time:+new Date()
                            })
                            if (_this.checkLog(patrolLogAjax[0].data)) {
                                _this.saveUpdateLog(true, {
                                    patrol: [].concat(_this.patrolLog),
                                    type:'net',
                                    info:'上传数据成功'
                                });
                                AppConfig.updateRecord.push({
                                    type:1,
                                    text:'上传数据成功',
                                    time:+new Date()
                                })
                                if (window.plugins) {
                                    window.plugins.toast.show('上传数据成功', 'short', 'bottom');
                                }
                                curSet = {};
                                localStorage.removeItem('curSet');
                                _this.patrolLog = [];
                                AppConfig.updateRecord.push({
                                    type:0,
                                    text:'本地缓存日志清空开始',
                                    time:+new Date()
                                })
                                var __tempnow = new Date()
                                _this.file.write({type:'patrolLog',data:[]}).done(function(store){
                                    AppConfig.updateRecord.push({
                                        type:0,
                                        text:'本地日志缓存清空成功，耗时' + ((+new Date() - __tempnow)/1000).toFixed(1),
                                        time:+new Date()
                                    })
                                }).fail(function(msg){
                                    AppConfig.updateRecord.push({
                                        type:0,
                                        text:'本地日志缓存清空失败，耗时' + ((+new Date() - __tempnow)/1000).toFixed(1),
                                        time:+new Date()
                                    })         
                                    AppConfig.updateRecord.push({
                                        type:0,
                                        text:'失败原因：'+msg,
                                        time:+new Date()
                                    })                               
                                });
                                callback();
                            } else {
                                _this.saveUpdateLog(false, {
                                    patrol: [].concat(_this.patrolLog),
                                    type:'net',
                                    info:'上传数据失败'
                                });
                                AppConfig.updateRecord.push({
                                    type:1,
                                    text:'上传数据失败',
                                    time:+new Date()
                                })
                                _this.file.write({type:'patrolLog',data:_this.patrolLog}).done(function(){
                                    //_this.saveUpdateLog(true, {
                                    //    patrol: [$.extend(true, {}, curSet.log)],
                                    //    type:'cache',
                                    //    info:'日志离线缓存成功'
                                    //});
                                    curSet = {};
                                    localStorage.removeItem('curSet');
                                    console.log('记录缓存成功');
                                    window.plugins && window.plugins.toast.show('记录缓存成功', 'short', 'bottom');
                                    AppConfig.updateRecord.push({
                                        type:0,
                                        text:'本地日志缓存成功，耗时' + ((+new Date() - _now)/1000).toFixed(1),
                                        time:+new Date()
                                    })
                                }).fail(function(msg){
                                    //_this.saveUpdateLog(true, {
                                    //    patrol: [$.extend(true, {}, curSet.log)],
                                    //    type:'cache',
                                    //    info:'日志离线缓存失败'
                                    //});
                                    console.log('记录缓存失败');
                                    window.plugins && window.plugins.toast.show('记录缓存失败，请于联网状态下及时上传。', 'short', 'bottom');
                                    AppConfig.updateRecord.push({
                                        type:0,
                                        text:'本地日志缓存失败，耗时' + ((+new Date() - _now)/1000).toFixed(1),
                                        time:+new Date()
                                    })
                                    AppConfig.updateRecord.push({
                                        type:1,
                                        text:'失败原因：' + msg,
                                        time:+new Date()
                                    })
                                })
                                LoadingAnimate.stop(document.getElementById('indexMain'))
                                callback();
                                if (window.plugins) {
                                    window.plugins.toast.show('上传数据失败', 'short', 'bottom');
                                }
                            }
                            }).fail(function(){
                                AppConfig.updateRecord.push({
                                    type:0,
                                    text:'云端信息缓存失败，耗时' + ((+new Date() - _now)/1000).toFixed(1),
                                    time:+new Date()
                                })
                                LoadingAnimate.stop(document.getElementById('indexMain'))
                                callback();
                            })
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
                        AppConfig.updateRecord.push({
                            type:1,
                            text:'云端信息下载并提交日志失败，耗时' + ((+new Date() - now)/1000).toFixed(1),
                            time:+new Date()
                        })
                        LoadingAnimate.stop(document.getElementById('indexMain'))
                        _this.updateFromFile(callback)
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