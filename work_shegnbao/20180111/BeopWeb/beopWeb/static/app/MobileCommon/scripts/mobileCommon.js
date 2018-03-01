/**
 * Created by win7 on 2015/10/28.
 */
//禁止弹出警告
(function() {
    window.alert = function(str) {
        return;
    }
})();
//根元素font-size大小调整
//(function(){
//    var device = 'iPhone6';
//    var rootSize;
//    switch (device) {
//        case 'iPhone6s':
//            rootSize = '20px';
//            break;
//        default:
//            rootSize = '20px';
//            break;
//    }
//    document.getElementsByTagName('html')[0].style.fontSize = rootSize;
//})();

//状态栏高度修改
var CssAdapter = (function() {
    var device;
    var css;
    var navTop, navBottom;
    var option = { top: false, bottom: false };

    device = 'iphone6';
    switch (device) {
        case 'iPhone6s':
            css = {
                'navTop': 44,
                'navStatus': 20,
                'navBottom': 49
            };
            break;
        case 'iPhone6':
        case 'iPhone5':
        case 'iPhone5s':
        case 'iPhone5c':
        case 'iPhone4':
        case 'iPhone4s':
            css = {
                'navTop': 44,
                'navStatus': 0,
                'navBottom': 49
            };
            break;
        default:
            css = {
                'navTop': 44,
                'navBottom': 49,
                'navStatus': 0
            };
            break;
    }
    BomConfig = {};
    BomConfig.height = window.innerHeight;
    BomConfig.width = window.innerWidth;
    BomConfig.statusHeight = css.navStatus;
    BomConfig.topHeight = css.navTop;
    BomConfig.bottomHeight = css.navBottom;
    BomConfig.mainHeight = BomConfig.height - BomConfig.topHeight - BomConfig.bottomHeight;

    function adapter(opt) {
        navTop = navTop || document.getElementById('navTop');
        navBottom = navBottom || document.getElementById('navBottom');
        if (opt) {
            Object.keys(opt).forEach(function(key) {
                if (opt[key] != false && opt[key] != null) {
                    option[key] = true;
                } else if (opt[key] == false) {
                    option[key] = false;
                }
            });
        }
        if (!opt) {
            navTop && (navTop.style.height = BomConfig.topHeight + 'px');
            navBottom && (navBottom.style.height = BomConfig.bottomHeight + 'px');

            BomConfig.height = window.innerHeight;
            BomConfig.width = window.innerWidth;
            BomConfig.mainHeight = BomConfig.height - BomConfig.topHeight - BomConfig.bottomHeight;
        } else if (option.top == true && option.bottom == true) {
            $(ElScreenContainer).height(BomConfig.mainHeight).css('top', BomConfig.topHeight);
            $(navTop).addClass('active');
            $(navBottom).addClass('active');
            $(SpinnerContainer).css({
                'top': BomConfig.topHeight + 'px',
                'height': BomConfig.mainHeight + 'px'
            });
        } else if (option.top == true && option.bottom == false) {
            $(ElScreenContainer).height(BomConfig.mainHeight + BomConfig.bottomHeight).css('top', BomConfig.topHeight);
            $(navTop).addClass('active');
            $(navBottom).removeClass('active');
            $(SpinnerContainer).css({
                'top': BomConfig.topHeight + 'px',
                'height': BomConfig.mainHeight + BomConfig.bottomHeight + 'px'
            });
        } else if (option.bottom == true && option.top == false) {
            $(ElScreenContainer).height(BomConfig.mainHeight + BomConfig.topHeight).css('top', 0);
            $(navTop).removeClass('active');
            $(navBottom).addClass('active');
            $(SpinnerContainer).css({
                'top': 0,
                'height': BomConfig.mainHeight + BomConfig.topHeight + 'px'
            });
        } else if (option.bottom == false && option.top == false) {
            $(ElScreenContainer).height(BomConfig.mainHeight + BomConfig.topHeight + BomConfig.bottomHeight).css('top', 0);
            $(navTop).removeClass('active');
            $(navBottom).removeClass('active');
            $(SpinnerContainer).css({
                'top': 0,
                'height': BomConfig.mainHeight + BomConfig.topHeight + BomConfig.bottomHeight + 'px'
            });
        }
    };

    return {
        adapter: adapter
    }
})();
//加载动画适应
var SpinnerControl = (function() {
    var _this;

    function SpinnerControl() {
        _this = this;
    }
    SpinnerControl.show = function() {
        $(SpinnerContainer).show();
        Spinner.spin(SpinnerContainer);
    };
    SpinnerControl.hide = function() {
        $(SpinnerContainer).hide();
        Spinner.stop();
    };
    return SpinnerControl;
})();
//字符串处理
var StringUtil = (function() {
    var HTML_ENTITIES = {
            '&': '&amp;',
            '>': '&gt;',
            '<': '&lt;',
            '"': '&quot;',
            "'": '&#39;',
            '`': '&#x60;'
        },
        HTML_ENTITIES_INVERT = invert(HTML_ENTITIES);

    function invert(obj) {
        var result = {},
            keys = Object.keys(obj);
        for (var i = 0, length = keys.length; i < length; i++) {
            result[obj[keys[i]]] = keys[i];
        }
        return result;
    };

    function padLeft(oldStr, padNum, padStr) {
        if (!padStr) {
            return oldStr;
        }
        return Array(padNum - String(oldStr).length + 1).join(padStr) + oldStr;
    }

    function htmlEscape(text) {
        if (!text) {
            return text
        }
        var source = '(?:' + Object.keys(HTML_ENTITIES).join('|') + ')',
            replaceRegexp = RegExp(source, 'g');
        return text.replace(replaceRegexp, function(character) {
            return HTML_ENTITIES[character];
        });
    }

    function htmlUnEscape(text) {
        if (!text) {
            return text
        }
        var source = '(?:' + Object.keys(HTML_ENTITIES_INVERT).join('|') + ')',
            replaceRegexp = RegExp(source, 'g');
        return text.replace(replaceRegexp, function(character) {
            return HTML_ENTITIES_INVERT[character];
        });
    }

    var getI18nProjectName = function(project) {
        if (!I18n || !project) {
            return '';
        }
        var result = '';
        switch (I18n.type) {
            case 'en':
                {
                    result = project.name_english;
                    break;
                }
            case 'zh':
                {
                    result = project.name_cn;
                    break;
                }
            default:
                {
                    result = project.name_english;
                }
        }
        return result || '';
    };

    return {
        padLeft: padLeft,
        htmlEscape: htmlEscape,
        htmlUnEscape: htmlUnEscape,
        getI18nProjectName: getI18nProjectName
    }
})();
//textarea高度自适应
// * 文本框根据输入内容自适应高度
// * @param                {HTMLElement}        输入框元素
// * @param                {Number}                设置光标与输入框保持的距离(默认0)
// * @param                {Number}                设置最大高度(可选)
// */
var autoTextarea = function(elem, extra, maxHeight) {
    extra = extra || 0;
    var isFirefox = !!document.getBoxObjectFor || 'mozInnerScreenX' in window,
        isOpera = !!window.opera && !!window.opera.toString().indexOf('Opera');
    var addEvent = function(type, callback) {
        elem.addEventListener ?
            elem.addEventListener(type, callback, false) :
            elem.attachEvent('on' + type, callback);
    };
    var getStyle = elem.currentStyle ? function(name) {
        var val = elem.currentStyle[name];

        if (name === 'height' && val.search(/px/i) !== 1) {
            var rect = elem.getBoundingClientRect();
            return rect.bottom - rect.top -
                parseFloat(getStyle('paddingTop')) -
                parseFloat(getStyle('paddingBottom')) + 'px';
        };

        return val;
    } : function(name) {
        return getComputedStyle(elem, null)[name];
    };
    var minHeight = parseFloat(getStyle('height'));
    //var minHeight = 22;
    elem.style.resize = 'none';

    var change = function() {
        var scrollTop, height,
            padding = 0,
            style = elem.style;

        if (elem._length === elem.value.length) return;
        elem._length = elem.value.length;

        if (!isFirefox && !isOpera) {
            padding = parseInt(getStyle('paddingTop')) + parseInt(getStyle('paddingBottom'));
        };
        scrollTop = document.body.scrollTop || document.documentElement.scrollTop;

        elem.style.height = minHeight + 'px';
        if (elem.scrollHeight > minHeight) {
            if (maxHeight && elem.scrollHeight > maxHeight) {
                height = maxHeight - padding;
                style.overflowY = 'auto';
            } else {
                height = elem.scrollHeight;
                style.overflowY = 'hidden';
            };
            style.height = height + extra + 'px';
            scrollTop += parseInt(style.height) - elem.currHeight;
            document.body.scrollTop = scrollTop;
            document.documentElement.scrollTop = scrollTop;
            elem.currHeight = parseInt(style.height);
        };
    };

    addEvent('propertychange', change);
    addEvent('input', change);
    addEvent('focus', change);
    change();
};


//文件读写插件
//主要函数
//FileStorage(root)--初始化函数
//setRoot(url)--设置根目录
//read(opt,screen,callback)--读出文件
//write(opt,screen,callback)--写入文件
var FileStorage = (function() {
    var _this;
    //初始化函数
    // FileStorage(root)，root为根目录，默认根目录处于手机SD卡第一级目录中
    function FileStorage(doc) {
        _this = this;
        _this.enable = (window.plugins && window.requestFileSystem) ? true : false;
        _this.doc = doc;
        _this.transfer = typeof FileTransfer == 'function' ? new FileTransfer() : false;

        _this.root = _this.getRootLocation();
        //_this.Deferred = undefined;
        //_this.store = undefined;
        //_this.fileNum = 0;
    }
    FileStorage.prototype = {
        getRootLocation: function() {
            if (!this.enable) return '';
            var root = cordova.file.externalRootDirectory;
            if (device && device.platform)
                switch (device.platform) {
                    case 'Android':
                        root = cordova.file.externalRootDirectory;
                        break;
                    case 'iOS':
                        root = cordova.file.dataDirectory;
                        break;
                }
            return root;
        },
        init: function(opt) {
            var setting = {};
            setting.Deferred = $.Deferred();
            setting.store = {};
            if (opt instanceof Array) {
                setting.fileNum = opt.length;
            } else if (typeof opt == 'string') {
                setting.fileNum = 1;
            } else if (opt) {
                setting.fileNum = 1;
            }
            return setting;
        },
        //设置根目录
        //setRoot(url)
        //参数：
        // url=str
        //返回值：空
        setRootDoc: function(url) {
            _this.doc = url;
        },
        //读出文件
        //read(opt,callback)
        //参数：
        // opt：{
        //   fileType:{        数据变量名
        //       name:str     带后缀文件名，如fileName.txt，不设置则默认为文件类型.json
        //       url：str     路径，如不设置则默认为根目录
        //       reRoot：bool 是否将url设为绝对路径（即处于顶级SD目录下而不是root目录下），默认为否
        //       isJSON:bool  是否转为json 默认转换
        //   }
        // }
        // screen：obj         需要传递的对象环境，不传递则函数执行环境为FileStorage环境
        // callback：function  回调函数
        //                     回调函数参数：{
        //                                      fileType:{      数据变量名
        //                                                  status：'success'/'fail'   //读取状态
        //                                                  result：str                //读取结果
        //                                               }
        //                                  }
        //返回值：空
        read: function(opt, callback) {
            var promise = $.Deferred()
            if (!this.enable) {
                return promise.reject().promise();
            }
            _this.readFile(opt, promise)
            return promise.promise();
        },
        readFile: function(opt, promise) {
            var storeNotification = "on"; //data read
            if (typeof opt == 'string') opt = { type: opt };
            var type = opt.type;
            var fileName = (opt && opt.name) ? opt.name : type + '.json';
            var direct = '';
            if (opt.url) {
                if (opt.reRoot) {
                    direct = opt.url;
                } else {
                    direct = _this.doc + '/' + opt.url;
                }
            } else {
                direct = _this.doc;
            }
            var path = direct.split('/');
            var isJSON = true;
            if (opt.isJSON === false) isJSON = false;
            // setting.store[type] = {};
            //window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
            window.resolveLocalFileSystemURL(_this.root, onFileSystemSuccess, fail);

            function onFileSystemSuccess(fileSystem) {
                if (path.length == 1) {
                    fileSystem.getDirectory(path[0], {
                        create: false,
                        exclusive: false
                    }, onDirectSuccess, fail);
                } else {
                    path.shift();
                    fileSystem.getDirectory(path[0], {
                        create: false,
                        exclusive: false
                    }, onFileSystemSuccess, fail);
                }
            }

            function onDirectSuccess(directEntry) {
                directEntry.getFile(fileName, {
                    create: false,
                    exclusive: false
                }, onFileSuccess, fail);
            }

            function onFileSuccess(fileEntry) {
                fileEntry.file(onFileReadSuccess, fail);
            }

            function onFileReadSuccess(file) {
                //readDataUrl(file);
                readAsText(file);
            }

            function readAsText(file) {
                var reader = new FileReader();
                reader.onloadend = function(evt) {
                    storeNotification = evt.target.result; //将读取到的数据赋值给变量
                    if (storeNotification == null || storeNotification.length == 0) {
                        storeNotification = "on";
                    }
                    var content = ''
                    if (isJSON) {
                        try {
                            content = JSON.parse(evt.target.result);
                        } catch (e) {
                            fail('JSON transfer error:' + e.message)
                        }
                    } else {
                        content = evt.target.result;
                    }
                    console.log('Success to read file ' + direct + '/' + fileName + '.');
                    promise.resolveWith(this,[content])
                };
                reader.readAsText(file);
            }


            function fail(error) {
                if (!error) error = {};
                var err = '';
                if (typeof error == 'string'){
                    err = error
                }else{
                    err = error.code || (error.target && error.target.error.code)
                }
                msg = 'Failed to read file ' + direct + '/' + fileName + ' , error code:' + err;
                window.plugins && window.plugins.toast.show('读取文件失败'+ direct +'/'+ fileName + '错误代码：' + err, 'short', 'center');
                console.log(msg);
                promise.rejectWith(this,[msg])
            }
        },
        //写入文件
        //write(opt,callback,screen)
        //参数：
        // opt：{
        //   fileType:{        数据变量名
        //       name:str     带后缀文件名，如fileName.txt，不设置则默认为文件类型.json
        //       url：str     路径，如不设置则默认为根目录
        //       reRoot：bool 是否将url设为绝对路径（即处于顶级SD目录下而不是root目录下），默认为否
        //       isJSON:bool  是否转为json 默认转换
        //       data：''
        //   }
        // }
        // screen：obj         需要传递的对象环境，不传递则函数执行环境为FileStorage环境
        // callback：function  回调函数，在screen或者FileStorage环境下执行
        //                     回调函数参数：{
        //                                      fileType:{      数据变量名
        //                                                  status：'success'/'fail'   //写入状态
        //                                               }
        //                                  }
        //返回值：空
        write: function(opt, callback) {
            var promise  = $.Deferred();
            if (!this.enable) {
                return promise.reject().promise();
            }
            _this.writeFile(opt, promise)

            return promise.promise();
        },
        writeFile: function(opt, promise) {
            if (typeof opt == 'string') opt = { type: opt };
            var type = opt.type;
            var fileName = (opt && opt.name) ? opt.name : type + '.json';
            var direct = '';
            if (opt.url) {
                if (opt.reRoot) {
                    direct = opt.url;
                } else {
                    direct = _this.doc + '/' + opt.url;
                }
            } else {
                direct = _this.doc;
            }
            var path = direct.split('/');

            var isJSON = true;
            if (opt.isJSON === false) isJSON = false;
            window.resolveLocalFileSystemURL(_this.root, onFileSystemSuccess, fail);
            //获取目录，如果不存在则创建该目录
            function onFileSystemSuccess(fileSystem) {
                if (path.length == 1) {
                    fileSystem.getDirectory(path[0], {
                        create: true,
                        exclusive: false
                    }, onDirectSuccess, fail);
                } else {
                    fileSystem.getDirectory(path[0], {
                        create: true,
                        exclusive: false
                    }, function(fs) {
                        path.shift();
                        onFileSystemSuccess(fs)
                    }, fail);
                }
            }
            //获取mobovip目录下面的stores.json文件，如果不存在则创建此文件
            function onDirectSuccess(directEntry) {
                directEntry.getFile(fileName, {
                    create: true,
                    exclusive: false
                }, onFileSuccess, fail);
            }
            /**
             * 获取FileWriter对象，用于写入数据
             * @param fileEntry
             */
            function onFileSuccess(fileEntry) {
                fileEntry.createWriter(onFileWriterSuccess, fail);
            }

            /**
             * write datas
             * @param writer
             */
            function onFileWriterSuccess(writer) {
                //  log("fileName="+writer.fileName+";fileLength="+writer.length+";position="+writer.position);
                writer.onwrite = function(evt) { //当写入成功完成后调用的回调函数
                    console.log('Success to write file ' + direct + '/' + fileName + '.');
                    promise.resolve()
                };
                writer.onerror = function(error) { //写入失败后调用的回调函数
                    fail(error);
                };
                writer.onabort = function(evt) { //写入被中止后调用的回调函数，例如通过调用abort()
                    console.log('Abort to write file ' + direct + '/' + fileName + '.');
                };
                // 快速将文件指针指向文件的尾部 ,可以append
                if (opt.isAppend) {
                    writer.seek(writer.length);
                }
                if (isJSON) {
                    try {
                        var data = JSON.stringify(opt.data)
                    } catch (e) {
                        fail('JSON transfer error:' + e.message);
                    }
                    writer.write(data); //向文件中写入数据
                } else {
                    writer.write(opt.data)
                }
                //  writer.truncate(11);//按照指定长度截断文件
                //  writer.abort();//中止写入文件
            }

            function fail(error) {
                if (!error) error = {};
                var err = '';
                if (typeof error == 'string'){
                    err = error
                }else{
                    err = error.code || (error.target && error.target.error.code)
                }
                msg = 'Failed to write file ' + direct + '/' + fileName + ' ,error code:' + err;
                window.plugins && window.plugins.toast.show('写入文件失败' + direct + '/' + fileName + '错误代码：' + err, 'short', 'center');
                console.log(msg);
                promise.rejectWith(this,[msg])
            }
        },
        getSize:function(opt){
            var promise = $.Deferred()
            if (!this.enable) {
                return promise.reject().promise();
            }
            _this.getFileSize(opt, promise)
            return promise.promise();
        },
        getFileSize: function(opt, promise) {
            var storeNotification = "on"; //data read
            if (typeof opt == 'string') opt = { type: opt };
            var type = opt.type;
            var fileName = (opt && opt.name) ? opt.name : type + '.json';
            var direct = '';
            if (opt.url) {
                if (opt.reRoot) {
                    direct = opt.url;
                } else {
                    direct = _this.doc + '/' + opt.url;
                }
            } else {
                direct = _this.doc;
            }
            var path = direct.split('/');
            var isJSON = true;
            if (opt.isJSON === false) isJSON = false;
            // setting.store[type] = {};
            //window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
            window.resolveLocalFileSystemURL(_this.root, onFileSystemSuccess, fail);

            function onFileSystemSuccess(fileSystem) {
                if (path.length == 1) {
                    fileSystem.getDirectory(path[0], {
                        create: false,
                        exclusive: false
                    }, onDirectSuccess, fail);
                } else {
                    path.shift();
                    fileSystem.getDirectory(path[0], {
                        create: false,
                        exclusive: false
                    }, onFileSystemSuccess, fail);
                }
            }

            function onDirectSuccess(directEntry) {
                directEntry.getFile(fileName, {
                    create: false,
                    exclusive: false
                }, onFileSuccess, fail);
            }

            function onFileSuccess(fileEntry) {
                fileEntry.file(onFileReadSuccess, fail);
            }

            function onFileReadSuccess(file) {
                //readDataUrl(file);
                promise.resolveWith(this,[file.size])
            }

            function fail(error) {
                if (!error) error = {};
                var err = '';
                if (typeof error == 'string'){
                    err = error
                }else{
                    err = error.code || (error.target && error.target.error.code)
                }
                msg = 'Failed to read file ' + direct + '/' + fileName + ' , error code:' + err;
                window.plugins && window.plugins.toast.show('读取文件失败'+ direct +'/'+ fileName + '错误代码：' + err, 'short', 'center');
                console.log(msg);
                promise.rejectWith(this,[msg])
            }
        },
        download: function(option, callback) {
            if (!this.transfer) {
                this.transfer = typeof FileTransfer == 'function' ? new FileTransfer() : false;
                if (!this.transfer) return $.Deferred().reject().promise();
            }
            var setting = this.init(option);
            if (!(option instanceof Array)) {
                this.downloadFile(option, setting)
            } else if (option.length > 0) {
                for (var i = 0; i < option.length; i++) {
                    this.downloadFile(option[i], setting)
                }
            } else {
                return $.Deferred().reject().promise();
            }
            return setting.Deferred.promise();
        },
        downloadFile: function(opt, setting) {
            var url = opt.url;
            var name = opt.name;
            var fileName = opt.name + '.' + url.split('.').slice(-1).pop();

            var direct = '';
            if (opt.path) {
                if (opt.reRoot) {
                    direct = opt.path;
                } else {
                    direct = _this.doc + '/' + opt.path;
                }
            } else {
                direct = _this.doc;
            }
            var path = direct.split('/');

            setting.store[name] = {};
            window.resolveLocalFileSystemURL(_this.root, onFileSystemSuccess, fail);

            function onFileSystemSuccess(fileSystem) {
                if (path.length == 1) {
                    fileSystem.getDirectory(path[0], {
                        create: true,
                        exclusive: false
                    }, onDirectSuccess, fail);
                } else {
                    fileSystem.getDirectory(path[0], {
                        create: true,
                        exclusive: false
                    }, function(fs) {
                        path.shift();
                        onFileSystemSuccess(fs)
                    }, fail);
                }
            }

            function onDirectSuccess(directEntry) {
                // Parameters passed to getFile create a new file or return the file if it already exists.
                directEntry.getFile(fileName, { create: true, exclusive: false },
                    function(fileEntry) {
                        download(fileEntry, url, true);
                    },
                    fail);
            }

            function download(fileEntry) {
                _this.transfer.download(
                    url,
                    fileEntry.toURL(),
                    function(entry) {
                        console.log('Success to download file ' + direct + '/' + fileName + ' from ' + url);
                        setting.store[name].status = 'success';
                        setting.fileNum--;
                        if (setting.fileNum == 0) {
                            setting.Deferred.resolveWith(this, [setting.store])
                        }
                    },
                    fail,
                    null, // or, pass false
                    {
                        //headers: {
                        //    "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
                        //}
                    }
                );
            }

            function fail(e) {
                if (!error) error = {};
                setting.store[name].status = 'fail';
                window.plugins && window.plugins.toast.show('下载文件失败' + direct + '/' + fileName + '错误代码：' + error.code || error.target && error.target.error.code, 'short', 'center');
                console.log('Failed to download file ' + direct + '/' + fileName + ' :' + error.code || error.target && error.target.error.code);
                setting.fileNum--;
                if (setting.fileNum == 0) {
                    setting.Deferred.rejectWith(this, [setting.store])
                }
            }
        },
        upload: function() {

        },
        uploadFile: function() {

        }
    };
    return FileStorage;
})();

var PushWidget = (function() {
    var _this;

    function PushWidget(opt) {
        _this = this;
        _this.opt = opt ? opt : {};
        _this.obj = window.plugins && window.plugins.jPushPlugin ? window.plugins && window.plugins.jPushPlugin : null;
        _this.eventFunc = {};
        _this.plugin = window.plugins && window.plugins.jPushPlugin ? window.plugins.jPushPlugin : undefined;

        _this.aliasQueue = [];
    }
    PushWidget.prototype = {
        init: function(opt) {
            _this.opt = opt ? opt : {};
            _this.opt.alias = null;
            if (_this.plugin) {
                _this.plugin.init();
                _this.onSetAliasAndTags();
            }
        },
        resetServiceBadge: function() {
            _this.plugin && _this.plugin.resetBadge();
        },
        resetLocalBadge: function() {
            _this.plugin && _this.plugin.setApplicationIconBadgeNumber(0);
        },
        stop: function() {
            _this.plugin && _this.plugin.stopPush();
        },
        restart: function() {
            _this.plugin && _this.plugin.resumePush();
        },
        isStop: function(callback) {
            _this.plugin && _this.plugin.isPushStopped(callback);
        },
        getId: function(callback) {
            _this.plugin && _this.plugin.getRegistrationID(callback)
        },
        setAlias: function(alias) {
            var strAlias;
            if (alias == null) {
                strAlias = '';
            } else {
                try {
                    strAlias = alias.toString()
                } catch (e) {
                    strAlias = alias;
                }
            }
            _this.aliasQueue.push(strAlias);
            if (_this.aliasQueue.length > 1) {
                return;
            }
            _this.plugin && _this.plugin.setAlias(strAlias)
        },
        setTag: function(tags) {
            _this.opt.tag = tags;
            _this.plugin && _this.plugin.setTags(tags);
        },
        onSetAliasAndTags: function(func) {
            if (!this.plugin) return;
            var _this = this;
            _this.eventFunc.setAliasAndTags = function(result) {
                if (result) {
                    _this.opt.alias = result.alias;
                    console.log('set alias:' + result.alias)
                }
                _this.aliasQueue.shift();
                if (_this.aliasQueue.length > 0) {
                    _this.plugin.setAlias(_this.aliasQueue[0])
                } else {
                    func && func();
                }
            };
            document.addEventListener("jpush.setTagsWithAlias", _this.eventFunc.setAliasAndTags, false)
        },
        offSetAliasAndTags: function() {
            if (!this.plugin) return;
            document.removeEventListener("jpush.setTagsWithAlias", _this.eventFunc.setAliasAndTags, false)
        },

        onOpenNotification: function(func) {
            if (!this.plugin) return;
            _this.eventFunc.openNotification = func;
            document.addEventListener("jpush.openNotification", _this.eventFunc.openNotification, false)
        },
        offOpenNotification: function() {
            if (!this.plugin) return;
            document.removeEventListener("jpush.openNotification", _this.eventFunc.openNotification, false)
        },

        onReceiveNotification: function(func) {
            if (!this.plugin) return;
            _this.eventFunc.receiveNotification = func;
            document.addEventListener("jpush.receiveNotification", _this.eventFunc.receiveNotification, false)
        },
        offReceiveNotification: function() {
            if (!this.plugin) return;
            document.removeEventListener("jpush.receiveNotification", _this.eventFunc.receiveNotification, false)
        },

        onReceiveMessage: function(func) {
            if (!this.plugin) return;
            _this.eventFunc.receiveMessage = func;
            document.addEventListener("jpush.receiveMessage", _this.eventFunc.receiveMessage, false)
        },
        offReceiveMessage: function() {
            if (!this.plugin) return;
            document.removeEventListener("jpush.receiveMessage", _this.eventFunc.receiveMessage, false)
        },

        getPushInfo: function() {
            return {
                openNote: this.plugin ? _this.plugin.openNotification : {},
                receiveNote: this.plugin ? _this.plugin.receiveNotification : {},
                receiveMsg: this.plugin ? _this.plugin.receiveMessage : {}
            }
        }
    };

    return PushWidget
})();

var Steps = (function() {
    function Steps(config) {
        this.config = config;
        this.watchId = undefined;
        this.reckonSteps = undefined;
        this.acceleration = undefined;
        this.steps = undefined;
    }

    Steps.prototype.start = function() {
        var _this = this;
        _this.watchId && _this.close();
        _this.acceleration = _this.getAcceleration(_this.config.frequency);
        _this.reckonSteps = new ReckonSteps(_this.config);
        setTimeout(function() {
            _this.watchId = navigator.accelerometer.watchAcceleration(_this.acceleration.successFn, _this.acceleration.errorFn, _this.acceleration.option);
        }, 1000)
    }

    Steps.prototype.show = function() {
        this.steps = this.reckonSteps.steps;
        return this.steps;
    }

    Steps.prototype.close = function() {
        navigator.accelerometer.clearWatch(this.aWatchID);
        this.steps = undefined;
    }

    Steps.prototype.getAcceleration = function(frequency) {
        var _this = this;
        var _successFn = function(acceleration) {
            var x = acceleration.x,
                y = acceleration.y,
                z = acceleration.z;
            var gravityNew = Math.sqrt(x * x + y * y + z * z);
            _this.reckonSteps.detectorNewStep(gravityNew);
        };
        var _errorFn = function() {
            //TODO:获取重力感应器失败时的动作
        };
        var _option = {
            frequency: frequency || 100
        };
        return {
            successFn: _successFn,
            errorFn: _errorFn,
            option: _option
        };
    }
    return Steps;
})()

var ReckonSteps = (function() {
    var ReckonSteps = function(config) {
        //是否是静态阈值
        this.isStatic = config.isStatic || true;
        //步数
        this.steps = 0;
        //用于存放计算动态阈值的波峰波谷差值
        this.tempValue = [];
        this.valueNum = 4;
        this.tempCount = 0;
        //是否上升的标志位
        this.isDirectionUp = false;
        //持续上升次数
        this.continueUpCount = 0;
        //上一点的持续上升的次数，为了记录波峰的上升次数
        this.continueUpFormerCount = 0;
        //上一点的状态，上升还是下降
        this.lastStatus = false;
        //波峰值
        this.peakOfWave = 0;
        //波谷值
        this.valleyOfWave = 0;
        //此次波峰的时间
        this.timeOfThisPeak = 0;
        //上次波峰的时间
        this.timeOfLastPeak = 0;
        //当前的时间
        this.timeOfNow = 0;
        //当前传感器的值
        this.gravityNew = 0;
        //上次传感器的值
        this.gravityOld = 0;
        //动态阈值需要动态的数据，这个值用于这些动态数据的阈值
        this.initialValue = config.initialValue || 2;
        //初始阈值
        this.ThreadValue = config.ThreadValue || 2;
    }

    ReckonSteps.prototype.detectorNewStep = function(values) {
        var _this = this;
        if (_this.gravityOld !== 0) {
            if (_this.isDetectorPeak(values, _this.gravityOld)) { //波峰
                _this.timeOfLastPeak = _this.timeOfThisPeak;
                _this.timeOfNow = +new Date();
                if (_this.isStatic && _this.timeOfNow - _this.timeOfLastPeak >= 250 && (_this.peakOfWave - _this.valleyOfWave >= _this.ThreadValue)) {
                    _this.timeOfThisPeak = _this.timeOfNow;
                    //更新步数
                    _this.steps++;
                }
                if (!_this.isStatic && _this.timeOfNow - _this.timeOfLastPeak >= 250 && (_this.peakOfWave - _this.valleyOfWave >= _this.initialValue)) {
                    _this.timeOfThisPeak = _this.timeOfNow;
                    _this.steps++;
                    _this.ThreadValue = _this.Peak_Valley_Thread(_this.peakOfWave - _this.valleyOfWave);
                }
            }
        }
        _this.gravityOld = values;
        return _this.steps;
    };

    //判断是否波峰
    ReckonSteps.prototype.isDetectorPeak = function(newValue, oldValue) {
        var _this = this;
        _this.lastStatus = _this.isDirectionUp;
        if (newValue >= oldValue) {
            _this.isDirectionUp = true;
            _this.continueUpCount++;
        } else {
            _this.continueUpFormerCount = _this.continueUpCount;
            _this.continueUpCount = 0;
            _this.isDirectionUp = false;
        }
        if (!_this.isDirectionUp && _this.lastStatus && (_this.continueUpFormerCount >= 4 || oldValue >= 20)) {
            _this.peakOfWave = oldValue;
            return true;
        } else if (!_this.lastStatus && _this.isDirectionUp) {
            _this.valleyOfWave = oldValue;
            return false;
        } else {
            return false;
        }
    };

    //计算动态阈值
    ReckonSteps.prototype.Peak_Valley_Thread = function(value) {
        var _this = this;
        var tempThread = _this.ThreadValue;
        if (_this.tempCount < _this.valueNum) {
            _this.tempValue[_this.tempCount] = value;
            _this.tempCount++;
        } else {
            tempThread = _this.averageValue(_this.tempValue, _this.valueNum);
            for (var i = 1; i < _this.valueNum; i++) {
                _this.tempValue[i - 1] = _this.tempValue[i];
            }
            _this.tempValue[_this.valueNum - 1] = value;
        }
        return tempThread;
    };

    ReckonSteps.prototype.averageValue = function(arr, n) {
        var ave = 0;
        for (var i = 0; i < n; i++) {
            ave += arr[i];
        }
        ave = ave / n;
        if (ave >= 8)
            ave = 4.3;
        else if (ave >= 7 && ave < 8)
            ave = 3.3;
        else if (ave >= 4 && ave < 7)
            ave = 2.3;
        else if (ave >= 3 && ave < 4)
            ave = 2.0;
        else {
            ave = 1.3;
        }
        return ave;
    };
    return ReckonSteps;
})();

var SplashScreen = (function() {
    function SplashScreen() {

    }
    SplashScreen.prototype = {

    };
    return SplashScreen
})();

var LoadingAnimate = function(){
    function start(container,option){
        stop(container);
        var spinner = document.createElement('div');
        var text = '';
        if (typeof option == 'string')text = option;
        if (option && option.text)text = option.text;
        spinner.className = 'wrapLoadingSpinner';
        spinner.innerHTML = '\
        <div class="cover"></div>\
        <div class="content">\
            <div class="animate">\
                <div></div><div></div>\
            </div>\
            <div class="text">'+ text +'</div>\
        </div>\
        '
        container.appendChild(spinner);
    };
    function stop(container){
        var spinner = container.querySelector('.wrapLoadingSpinner');
        if (!spinner) return
        container.removeChild(spinner)
    }
    return {
        start:start,
        stop:stop
    }
}()