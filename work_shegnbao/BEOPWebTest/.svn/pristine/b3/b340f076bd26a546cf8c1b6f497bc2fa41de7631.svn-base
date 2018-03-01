/**
 * Created by win7 on 2016/3/16.
 */
var DataManager = (function(){
    var _this;
    function DataManager (){
        _this = this;
        _this.direct = 'data';
        _this.Deferred = undefined;
        _this.callback = undefined;
        _this.page = undefined;
        _this.readFinish = 0;
        //_this.androidFirst = false;
    }
    DataManager.prototype = {
        update:function(isForceFile){
            //debugger;
            _this.Deferred = $.Deferred();
            SpinnerControl.show();
            if(navigator.connection) {
                //if (isForceFile){
                //    _this.updateFromFile();
                //    return;
                //}
                if (navigator.connection.type == 'none') {
                    _this.updateFromFile();
                } else {
                    _this.updateFromNet();
                }
            }else{
                _this.updateFromNet();
            }
        },
        initPage:function (page,func){
            if(typeof  func == 'function'){
                _this.callback = func;
            }
            if (typeof  page != 'undefined'){
                _this.page = page;
            }
        },
        clearPage:function(){
            _this.callback = undefined;
            _this.page = undefined;
        },
        attachNetworkEvent:function(page,func){
            //if(navigator.connection && navigator.connection.type != 'none') {
            //    _this.androidFirst = false;
            //}else{
            //    _this.androidFirst = true;
            //}
            if(typeof  func == 'function'){
                _this.callback = func;
            }
            if (typeof  page != 'undefined'){
                _this.page = page;
            }
            document.addEventListener("online", _this.updateWrap, false);
        },
        updateWrap:function(){
            console.log('online success');
            //if (!_this.androidFirst) {
            //    _this.androidFirst = true;
            //    return;
            //}
            window.plugins.toast.show('网络已连接', 'short', 'bottom');
            _this.update();
        },
        removeNetworkEvent:function(){
            _this.callback = undefined;
            _this.page = undefined;
            document.removeEventListener("online", _this.updateWrap, false);
        },
        updateFromFile:function(){
            if (curSet.patrolIndex > -1) {
                _this.writeFile(patrolLog,'patrolLog.txt');
            }else{
                _this.readFile(patrolLog,'patrolLog.txt');
            }
            _this.readFinish = 0;
            _this.readFile(userAll,'userAll.txt');
            _this.readFile(pathAll,'pathAll.txt');
            _this.readFile(missionAll,'missionAll.txt');
            _this.readFile(pointAll,'pointAll.txt');
        },
        writeFile:function(data,name,isAppend){
            if (typeof window.requestFileSystem == 'undefined')return;
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFileSystemSuccess, onFileSystemFail);
            //获取目录，如果不存在则创建该目录
            //function onFileSystemSuccess(fileSystem) {
            //    var newFile = fileSystem.root.getDirectory(_this.direct, {
            //        create : true,
            //        exclusive : false
            //    }, onDirectorySuccess, onFileSystemFail);
            //}
            //获取mobovip目录下面的stores.txt文件，如果不存在则创建此文件
            function onFileSystemSuccess(fileSystem) {
                fileSystem.root.getFile(name, {
                    create : true,
                    exclusive : false
                }, onFileSuccess, onFileSystemFail);
            }
            /**
             * 获取FileWriter对象，用于写入数据
             * @param fileEntry
             */
            function onFileSuccess(fileEntry) {
                fileEntry.createWriter(onFileWriterSuccess, onFileSystemFail);
            }

            /**
             * write datas
             * @param writer
             */
            function onFileWriterSuccess(writer) {
            //  log("fileName="+writer.fileName+";fileLength="+writer.length+";position="+writer.position);
                writer.onwrite = function(evt) {//当写入成功完成后调用的回调函数
                    //_this.Deferred.resolve();
                    //SpinnerControl.hide();
                    console.log("write success");
                    //window.plugins.toast.show('存储文件成功'+ name, 'short', 'center');
                };
                writer.onerror = function(evt) {//写入失败后调用的回调函数
                    //_this.Deferred.reject();
                    //SpinnerControl.hide();
                    console.log("write error");
                };
                writer.onabort = function(evt) {//写入被中止后调用的回调函数，例如通过调用abort()
                    console.log("write abort");
                };
                // 快速将文件指针指向文件的尾部 ,可以append
                if (isAppend) {
                    writer.seek(writer.length);
                }
                writer.write(JSON.stringify(data));//向文件中写入数据
            //  writer.truncate(11);//按照指定长度截断文件
            //  writer.abort();//中止写入文件
            }

            function onFileSystemFail(error) {
                //_this.Deferred.reject();
                console.log("Failed to retrieve file:" + error.code);
            }
        },
        readFile:function(tar,filePath){
            if (typeof window.requestFileSystem == 'undefined')return;
            var storeNotification="on";//data read
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);

            function gotFS(fileSystem) {
                fileSystem.root.getFile(filePath, {
                    create : true,
                    exclusive : false
                }, gotFileEntry, fail);
            }

            function gotFileEntry(fileEntry) {
                fileEntry.file(gotFile, fail);
            }

            function gotFile(file) {
                //readDataUrl(file);
                readAsText(file);
            }

            function readAsText(file) {
                var reader = new FileReader();
                reader.onloadend = function(evt) {
                    //console.log("Read as text");
            //		console.log("result=" + evt.target.result);
                    storeNotification=evt.target.result;//将读取到的数据赋值给变量
                    if(storeNotification==null||storeNotification.length==0){
                        storeNotification="on";
                    }
                    var jsonResult = JSON.parse(evt.target.result);
                    if (typeof jsonResult == 'string') {
                        tar = JSON.parse(jsonResult);
                    }else{
                        tar = jsonResult;
                    }
                    _this.readFinish++;
                    if(_this.readFinish == 5) {
                        _this.callback.call(_this.page);
                        SpinnerControl.hide();
                    }
                    //_this.Deferred.resolve();
                };
                reader.readAsText(file);
            }

            function readDataUrl(file) {
                var reader = new FileReader();
                reader.onloadend = function(evt) {
                    console.log("Read as data URL");
                    console.log(evt.target.result);
                };
                reader.readAsDataURL(file);
            }

            function fail(evt) {
                //_this.Deferred.reject();
                //_this.callback.call(_this.page);
                SpinnerControl.hide();
                window.plugins.toast.show('从后台读取文件失败'+ filePath + '错误代码：' + evt.target.error.code, 'short', 'center');
                console.log("code=======" + evt.target.error.code);
            }
        },
        updateFromNet:function(){
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
                        _this.writeFile(userAll,'userAll.txt');
                        _this.writeFile(pathAll,'pathAll.txt');
                        _this.writeFile(missionAll,'missionAll.txt');
                        _this.writeFile(pointAll,'pointAll.txt');
                        _this.readFile(pointAll,'pointAll.txt');
                        if(window.plugins) {
                            window.plugins.toast.show('数据同步成功', 'short', 'center');
                        }
                    }).always(function () {
                        _this.Deferred.resolve();
                        _this.callback.call(_this.page);
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
                        _this.writeFile(userAll,'userAll.txt');
                        _this.writeFile(pathAll,'pathAll.txt');
                        _this.writeFile(missionAll,'missionAll.txt');
                        _this.writeFile(pointAll,'pointAll.txt');
                        if (patrolLogAjax[1] == 'success') {
                            if (window.plugins) {
                                window.plugins.toast.show('上传数据成功', 'short', 'center');
                            }
                            curSet.patrolIndex = -1;
                            patrolLog = [];
                            _this.writeFile(patrolLog,'patrolLog.txt');
                        } else {
                            if (window.plugins) {
                                window.plugins.toast.show('上传数据失败', 'short', 'center');
                            }
                        }
                    }).always(function () {
                        _this.Deferred.resolve();
                        _this.callback.call(_this.page);
                        SpinnerControl.hide();
                    })
            }
        }
    };
    return DataManager
})();