// var Router = (function () {

//     function Router() {
//     }

//     Router.screenFlag = 'page';

//     Router.root = '#page=IndexScreen';
//     Router.paneRoot = "#page=PlatformOverview";

//     Router.isListening = false;

//     Router.pageHash = '';

//     Router.resize = new (namespace('cmpt.resize'))()

//     Router.show = function () {
//         if (arguments.length === 0) {
//             return;
//         }
//         var screenClass = arguments[0];
//         if (typeof screenClass !== 'function') {
//             return;
//         }

//         if (Router.isListening) {
//             Router.applyGoTo.apply(null, arguments);
//         } else {
//             Router.applyScreen.apply(null, arguments);
//         }
//     };

//     Router.applyGoTo = function () {

//         var screenClass = arguments[0];
//         var className = screenClass.toString().match(/function\s*(\w+)/)[1]
//         if (!className) {
//             alert(I18n.resource.common.NOT_FOUND_PAGE);
//             return false;
//         }

//         var paramObj = {
//             page: className
//         }, paramList = Router._getFunctionParams(screenClass);
//         for (var m = 0, n = paramList.length; m < n; m++) {
//             if (typeof arguments[m + 1] != typeof undefined) {
//                 paramObj[paramList[m]] = arguments[m + 1];
//             }
//         }
//         Router.goTo(paramObj);
//     };

//     Router.applyScreen = function () {
//         var screenClass = arguments[0];
//         if (!screenClass) {
//             alert('Can\'t find the page.');
//             return;
//         }
//         if (ScreenCurrent) {
//             window.onresize = null;
//             Router.resize.empty();
//             try {
//                 // 如果 close 方法返回 false，则直接返回，不进行新页面的渲染
//                 if (ScreenCurrent.close && ScreenCurrent.close() === false) {
//                     return;
//                 }
//             } catch (e) {
//                 console.warn(ScreenCurrent.constructor.name + ' close 方法报错:' + e);
//             }
//         }
//         var screenObj = Object.create(screenClass.prototype);
//         // ScreenCurrent = (screenClass.apply(screenObj, Array.prototype.slice.call(arguments, 1)) || screenObj);
//         // ScreenCurrent = new (Function.prototype.bind.apply(screenClass, Array.prototype.slice.call(arguments, 1)))() || screenObj
//         var args = ([{}]).concat(Array.prototype.slice.call(arguments, 1) || []);
//         ScreenCurrent = new (Function.prototype.bind.apply(screenClass, args))() || screenObj
//         if (ScreenCurrent.onresize) {
//             Router.resize.add({ins:ScreenCurrent,ev:ScreenCurrent.onresize});
//         }else if (ScreenCurrent.resize){
//             Router.resize.add({ins:ScreenCurrent,ev:ScreenCurrent.resize});
//         }
//         Router.resize.init();
//         ModuleIOC.curModule = ScreenCurrent;
//         ScreenCurrent.show();
//     };

//     //获取函数的参数
//     Router._getFunctionParams = function (func) {
//         var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg,
//             ARGUMENT_NAMES = /([^\s,]+)/g, fnStr, result;

//         fnStr = func.toString().replace(STRIP_COMMENTS, '');
//         result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
//         if (result === null) {
//             result = [];
//         }
//         return result;
//     };
//     /***
//      * 获取URL中参数,返回参数的map类型
//      * @returns {{}}
//      * @private
//      */
//     Router._getHashParamsMap = function () {
//         var hash = Router.pageHash;
//         var list, map = {};
//         list = hash.substr(1).split('&');
//         for (var m = 0; m < list.length; m++) {
//             var item = list[m].split('=');
//             map[item[0]] = _unserializeParams(item[1]);
//         }
//         return map;
//     };

//     /**
//      * 在URL中获取page id
//      * @returns {*}
//      */
//     Router.getPageId = function () {
//         var hashMap = Router._getHashParamsMap();
//         var params;
//         if (typeof hashMap.id !== typeof undefined) {
//             return hashMap.id;
//         }
//         if (hashMap.reportId) {
//             return hashMap.reportId;
//         }

//         if (typeof hashMap.options === 'string') {
//             params = {};
//             try {
//                 params = JSON.parse(window.decodeURIComponent(hashMap.options));
//             } catch (e) {
//             }

//             return params.id;
//         }
//         if (typeof hashMap.options === 'object' && hashMap.options) {
//             return hashMap.options.id;
//         }
//     };


//     Router.screenChange = function (e) {
//         // if (!location.hash) return
//         if (!Router.pageHash) return

//         var paramsMap = Router._getHashParamsMap(), project;

//         //判断是否有项目权限
//         if (typeof paramsMap.projectId !== typeof undefined) {
//             AppConfig.projectId = parseInt(paramsMap.projectId);
//             project = BEOPUtil.getProjectFromAppConfig(AppConfig.projectId);
//             if (!project) {
//                 if (I18n && I18n.resource) {
//                     alert.danger(I18n.resource.error.noPermission);
//                 } else {
//                     if (localStorage.getItem('language') == 'zh') {
//                         alert.danger('您没有权限访问。');
//                     } else {
//                         alert.danger('You don\'t have permission to access');
//                     }

//                 }

//                 return false;
//             }
//             AppConfig.projectTimeFormat = project.time_format || 0;
//         }


//         var promise = $.Deferred();

//         if (I18n && I18n.resource) {
//             promise.resolve();
//         } else {
//             InitMultiI18nResource().always(function (rs) {
//                 // I18n 初始化工作
//                 I18n = new Internationalization(null, rs);
//                 promise.resolve();
//             });
//         }

//         window.getHmtJavascript && window.getHmtJavascript();
//         promise.always(function () {
//             var screen, currentPage, screenParamsNameList = [], screenParamsValueList = [];

//             var menuPromise = $.Deferred().resolve();
//             if (project) {
//                 AppConfig.projectEnName = project['name_en'];
//                 AppConfig.projectName = project['name_en'];
//                 //!AppConfig.navItems防止从地图进入项目请求两次菜单
//             }

//             currentPage = paramsMap[Router.screenFlag];
//             if (currentPage) {
//                 if (currentPage.indexOf('.') > 0) {
//                     screen = namespace(currentPage)
//                 } else {
//                     if (currentPage === 'EnergyScreen_M') {// 手机页面特殊处理
//                         currentPage = 'EnergyScreen';
//                     }
//                     screen = window[currentPage] || namespace('observer.screens')[currentPage];
//                 }
//                 //百度统计
//                 switch (currentPage) {
//                     case 'AnalysisScreen':
//                         trackEvent('头部导航数据分析', 'Topnav.Analysis');
//                         break;
//                     case 'ShareLogging':
//                         trackEvent('头部导航我的分析', 'Topnav.ShareLogging');
//                         break;
//                     case 'UserManagerController':
//                         trackEvent('头部导航后台管理', 'Topnav.UserManager');
//                         break;
//                     case 'TerminalDebugging':
//                         trackEvent('头部导航终端调试', 'Topnav.TerminalDebug');
//                         break;
//                     case 'ModBusInterface':
//                         trackEvent('头部导航Modbus', 'Topnav.Modbus');
//                         break;
//                 }
//             } else {
//                 console.error('无法识别的location hash! hash is ' + Router.pageHash);
//                 //location.href = '/';
//                 return true;
//             }

//             if (screen && typeof screen === 'function') {
//                 screenParamsNameList = Router._getFunctionParams(screen);
//                 for (var m = 0; m < screenParamsNameList.length; m++) {
//                     var paramName = screenParamsNameList[m];
//                     if (typeof paramsMap[paramName] !== 'undefined') {
//                         screenParamsValueList[m] = paramsMap[paramName];
//                     } else {
//                         screenParamsValueList[m] = undefined;
//                     }
//                 }
//                 menuPromise ? menuPromise.done(function () {
//                     Router.applyScreen.apply(null, [screen].concat(screenParamsValueList));
//                 }) : Router.applyScreen.apply(null, [screen].concat(screenParamsValueList));
//                 //临时处理
//                 I18n.fillArea($('#navPane'));
//                 return false;
//             } else {
//                 return true;
//             }
//         });
//     };

//     Router.goTo = function (pageInfo) {
//         var hashFlag = '#', hashList = [];
//         if (!pageInfo) {
//             return false;
//         }
//         if (AppConfig.projectId) {
//             pageInfo['projectId'] = AppConfig.projectId;
//         }

//         if (pageInfo[Router.screenFlag]) {
//             hashList.push(Router.screenFlag + '=' + pageInfo[Router.screenFlag]);
//         }
//         for (var param in pageInfo) {
//             if (pageInfo.hasOwnProperty(param)) {
//                 if (param !== Router.screenFlag) {
//                     hashList.push(param + '=' + _serializeParams(pageInfo[param]));
//                 }
//             }
//         }
//         // if (location.hash === hashFlag + hashList.join('&')) {
//         //     Spinner && Spinner.stop();
//         // } else {
//         //     location.hash = hashFlag + hashList.join('&');
//         // }
//         Router.pageHash = hashFlag + hashList.join('&');
//         Router.screenChange();
//     };

//     Router.listen = function () {
//         return;
//         if ("onhashchange" in window && (!document.documentMode || document.documentMode >= 8)) {
//             Router.isListening = true;
//             location.hash= "";
//             window.onhashchange = Router.screenChange;
//             Router.detectAnchorHash();
//         } else {
//             console.error('This browser can\'t support onhashchange event.')
//         }
//     };

//     Router.showInitPage = function(){
//         if(AppConfig && AppConfig.userId){
//             new PlatformScreen()
//         }else{
//             new PageLogin();
//         }
//     }

//     Router.detectAnchorHash = function () {
//         //处理不是页面定位中也用到了#问题
//         var isValidHash = function (hash) {
//             if (typeof  hash === typeof undefined ||
//                 hash.startsWith('http') ||
//                 hash.startsWith('https') ||
//                 // 兼容 blob 协议
//                 hash.startsWith('blob')) {
//                 return true;
//             } else if (hash === '/factory' || hash === '/point_tool/editor') {
//                 return true;
//             } else {
//                 return hash.indexOf('=') != -1;
//             }
//         };

//         $(document).on('click.anchorHash', 'a', function (ev) {
//             var $this = $(this), hash = $this.attr('href'), isManagedHash = $this.attr('nothash');

//             //存在notHash标识
//             if (typeof isManagedHash !== typeof undefined && isManagedHash !== false) {
//                 return true;
//             }

//             if (!isValidHash(hash)) {
//                 ev.preventDefault();
//                 var dom = document.getElementById(hash.substr(1));
//                 if (dom) {
//                     dom.scrollIntoView();
//                 }
//             }
//             return true;
//         })
//     };

//     window.addEventListener('load', function () {
//         if(!(AppConfig && AppConfig.userId)){
//             location.hash = '';
//         }
//         Router.listen();
//         Router.showInitPage()
//     }, false)

//     function _serializeParams(params) {
//         return window.encodeURIComponent(JSON.stringify(params));
//     }

//     function _unserializeParams(params) {
//         try {
//             params = JSON.parse(window.decodeURIComponent(params));
//         } catch (e) {
//         }
//         return params;
//     }

//     return Router;
// })();







//temp_edit


var Router = (function() {

    function Router() {}

    Router.pageFlag = 'page';

    // Router.login = '#page=PageLogin';
    // Router.root = "#page=PlatformOverview";

    Router.isListening = false;

    Router.pageHash = '';

    Router.resize = new(namespace('cmpt.resize'))()

    Router.show = function() {
        if (arguments.length === 0) {
            return;
        }
        var screenClass = arguments[0];
        if (typeof screenClass !== 'function') {
            return;
        }

        if (Router.isListening) {
            Router.applyGoTo.apply(null, arguments);
        } else {
            Router.applyScreen.apply(null, arguments);
        }
    };

    Router.applyGoTo = function() {

        var screenClass = arguments[0];
        var className = screenClass.name || screenClass.toString().match(/function\s*(\w+)/)[1]
        var regRs;
        if (!className && regRs) {
            regRs = screenClass.toString().match(/function\s*(\w+)/)
            if (regRs) {
                className == regRs[1]
            }
        }
        if (!className) {
            regRs = screenClass.toString().match(/class\s*(\w+)/)
            if (regRs) {
                className == regRs[1]
            }
        }

        if (!className) {
            alert(I18n.resource.common.NOT_FOUND_PAGE);
            return false;
        }

        var paramObj = {
                page: className
            },
            paramList = Router._getFunctionParams(screenClass);
        for (var m = 0, n = paramList.length; m < n; m++) {
            if (typeof arguments[m + 1] != typeof undefined) {
                paramObj[paramList[m]] = arguments[m + 1];
            }
        }
        paramObj.__timestamp__ = ObjectId();
        Router.goTo(paramObj);
    };

    Router.applyScreen = function() {
        var screenClass = arguments[0];
        if (!screenClass) {
            alert('Can\'t find the page.');
            return;
        }
        if (ScreenCurrent) {
            window.onresize = null;
            Router.resize.empty();
            try {
                // 如果 close 方法返回 false，则直接返回，不进行新页面的渲染
                if (ScreenCurrent.close && ScreenCurrent.close() === false) {
                    return;
                }
            } catch (e) {
                console.warn(ScreenCurrent.constructor.name + ' close 方法报错:' + e);
            }
        }
        var screenObj = Object.create(screenClass.prototype);
        // ScreenCurrent = (screenClass.apply(screenObj, Array.prototype.slice.call(arguments, 1)) || screenObj);
        // ScreenCurrent = new (Function.prototype.bind.apply(screenClass, Array.prototype.slice.call(arguments, 1)))() || screenObj
        var args = ([{}]).concat(Array.prototype.slice.call(arguments, 1) || []);
        ScreenCurrent = new(Function.prototype.bind.apply(screenClass, args))() || screenObj
        if (ScreenCurrent.onresize) {
            Router.resize.add({ ins: ScreenCurrent, ev: ScreenCurrent.onresize });
        } else if (ScreenCurrent.resize) {
            Router.resize.add({ ins: ScreenCurrent, ev: ScreenCurrent.resize });
        }
        Router.resize.init();
        ModuleIOC.curModule = ScreenCurrent;
        ScreenCurrent.show();
    };

    //获取函数的参数
    Router._getFunctionParams = function(func) {
        var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg,
            ARGUMENT_NAMES = /([^\s,]+)/g,
            fnStr, result;

        fnStr = func.toString().replace(STRIP_COMMENTS, '');
        result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
        if (result === null) {
            result = [];
        }
        return result;
    };
    /***
     * 获取URL中参数,返回参数的map类型
     * @returns {{}}
     * @private
     */
    Router._getHashParamsMap = function() {
        // var hash = Router.pageHash;
        var hash = location.hash;
        var list, map = {};
        list = hash.substr(1).split('&');
        for (var m = 0; m < list.length; m++) {
            var item = list[m].split('=');
            map[item[0]] = _unserializeParams(item[1]);
        }
        return map;
    };

    /**
     * 在URL中获取page id
     * @returns {*}
     */
    Router.getPageId = function() {
        var hashMap = Router._getHashParamsMap();
        var params;
        if (typeof hashMap.id !== typeof undefined) {
            return hashMap.id;
        }
        if (hashMap.reportId) {
            return hashMap.reportId;
        }

        if (typeof hashMap.options === 'string') {
            params = {};
            try {
                params = JSON.parse(window.decodeURIComponent(hashMap.options));
            } catch (e) {}

            return params.id;
        }
        if (typeof hashMap.options === 'object' && hashMap.options) {
            return hashMap.options.id;
        }
    };


    Router.screenChange = function(e) {
        if (!location.hash) return
            // if (!Router.pageHash) return

        var paramsMap = Router._getHashParamsMap(),
            project;

        //判断是否有项目权限
        var $projectPromise = $.Deferred();
        if (typeof paramsMap.projectId !== typeof undefined) {
            var projectId = parseInt(paramsMap.projectId);
            project = BEOPUtil.getProjectFromAppConfig(projectId);
            if (!project) {
                if (I18n && I18n.resource) {
                    alert.danger(I18n.resource.error.noPermission);
                } else {
                    if (localStorage.getItem('language') == 'zh') {
                        alert.danger('您没有权限访问。');
                    } else {
                        alert.danger('You don\'t have permission to access');
                    }

                }

                return false;
            }
            if (AppConfig.projectId == projectId) {
                // AppDriver.nav.setActiveNavStyle(paramsMap.id,'menu');
                $projectPromise.resolve();
            } else {
                AppConfig.projectId = projectId;
                AppDriver.toggleProject(AppConfig.projectId).always(() => {
                    // AppDriver.nav.setActiveNavStyle(paramsMap.id,'menu');
                    $projectPromise.resolve()
                })
            }
            AppConfig.projectTimeFormat = project.time_format || 0;
        } else {
            // AppDriver.nav.setActiveNavStyle(paramsMap.id,'base');
            AppDriver.backToProjectNav();
            $projectPromise.resolve()
        }

        var promise = $.Deferred();

        if (I18n && I18n.resource) {
            promise.resolve();
        } else {
            InitMultiI18nResource().always(function(rs) {
                // I18n 初始化工作
                I18n = new Internationalization(null, rs);
                promise.resolve();
            });
        }

        return $.when(promise, $projectPromise).always(function() {
            var screen, currentPage, screenParamsNameList = [],
                screenParamsValueList = [];

            AppDriver.setActiveNavStyleByOption(paramsMap);
            // var menuPromise = $.Deferred().resolve();
            if (project) {
                AppConfig.projectEnName = project['name_en'];
                AppConfig.projectName = project['name_en'];
                //!AppConfig.navItems防止从地图进入项目请求两次菜单
            }

            currentPage = paramsMap[Router.pageFlag];


            if (currentPage) {
                if (currentPage.indexOf('.') > 0) {
                    screen = namespace(currentPage)
                } else {
                    if (currentPage === 'EnergyScreen_M') { // 手机页面特殊处理
                        currentPage = 'EnergyScreen';
                    }
                    screen = window[currentPage] || namespace('observer.screens')[currentPage];
                }
            } else {
                console.error('无法识别的location hash! hash is ' + location.hash);
                //location.href = '/';
                return true;
            }

            if (screen && typeof screen === 'function') {
                screenParamsNameList = Router._getFunctionParams(screen);
                for (var m = 0; m < screenParamsNameList.length; m++) {
                    var paramName = screenParamsNameList[m];
                    if (typeof paramsMap[paramName] !== 'undefined') {
                        screenParamsValueList[m] = paramsMap[paramName];
                    } else {
                        screenParamsValueList[m] = undefined;
                    }
                }

                var urlPageText = sessionStorage.getItem("nav_i18n_name");
                if (AppConfig.projectCurrent && AppConfig.projectCurrent.i18n == 1 && urlPageText) {
                    var urlPageText = sessionStorage.getItem("nav_i18n_name");
                    var pageParam = Router._getHashParamsMap();
                    for (var i = 0; i < AppConfig.navItems.length; i++) {
                        if (AppConfig.navItems[i].text.replace(' ', '') == urlPageText.replace(' ', '')) {
                            var paramList = Router._getFunctionParams(screen);
                            if (paramsMap.page == "EnergyScreen") {
                                if (screenParamsValueList[0] != AppConfig.navItems[i].id) {
                                    screenParamsValueList[0] = AppConfig.navItems[i].id;
                                    paramsMap.id = AppConfig.navItems[i].id;
                                    Router.goTo(paramsMap);
                                    break;
                                }
                            } else if (paramsMap.page == "PageScreen") {
                                if (screenParamsValueList[0].id != AppConfig.navItems[i].id) {
                                    screenParamsValueList[0].id = AppConfig.navItems[i].id;
                                    paramsMap.options.id = AppConfig.navItems[i].id;
                                    Router.goTo(paramsMap);
                                    break;
                                }
                            }

                        }
                    }
                }
                // menuPromise ? menuPromise.done(function () {
                //     Router.applyScreen.apply(null, [screen].concat(screenParamsValueList));
                // }) : 
                Router.applyScreen.apply(null, [screen].concat(screenParamsValueList));
                return false;
            } else {
                return true;
            }
        });
    };

    Router.goTo = function(pageInfo) {
        var hashFlag = '#',
            hashList = [];
        if (!pageInfo) {
            return false;
        }
        if (AppConfig.projectId) {
            pageInfo['projectId'] = AppConfig.projectId;
        }

        if (pageInfo[Router.pageFlag]) {
            hashList.push(Router.pageFlag + '=' + pageInfo[Router.pageFlag]);
        }
        for (var param in pageInfo) {
            if (pageInfo.hasOwnProperty(param)) {
                if (param !== Router.pageFlag) {
                    hashList.push(param + '=' + _serializeParams(pageInfo[param]));
                }
            }
        }
        if (location.hash === hashFlag + hashList.join('&')) {
            Spinner && Spinner.stop();
        } else {
            location.hash = hashFlag + hashList.join('&');
        }
        // Router.pageHash = hashFlag + hashList.join('&');
        // Router.screenChange();
    };

    Router.listen = function() {
        // return;
        if ("onhashchange" in window && (!document.documentMode || document.documentMode >= 8)) {
            Router.isListening = true;
            // location.hash= "";
            window.onhashchange = Router.screenChange;
            Router.detectAnchorHash();
        } else {
            console.error('This browser can\'t support onhashchange event.')
        }
    };

    Router.showInitPage = function() {
        if (AppConfig && AppConfig.userId) {
            (new PlatformScreen()).done(() => {
                // if(location.hash == ''){
                //     AppDriver.setFirstModule();
                // }else{
                //     Router.screenChange();
                // }
            });
        } else {
            new PageLogin();
        }
    }
    Router.detectAnchorHash = function() {
        //处理不是页面定位中也用到了#问题
        var isValidHash = function(hash) {
            if (typeof hash === typeof undefined ||
                hash.startsWith('http') ||
                hash.startsWith('https') ||
                // 兼容 blob 协议
                hash.startsWith('blob')) {
                return true;
            } else if (hash === '/factory' || hash === '/point_tool/editor') {
                return true;
            } else {
                return hash.indexOf('=') != -1;
            }
        };

        $(document).on('click.anchorHash', 'a', function(ev) {
            var $this = $(this),
                hash = $this.attr('href'),
                isManagedHash = $this.attr('nothash');

            //存在notHash标识
            if (typeof isManagedHash !== typeof undefined && isManagedHash !== false) {
                return true;
            }

            if (!isValidHash(hash)) {
                ev.preventDefault();
                var dom = document.getElementById(hash.substr(1));
                if (dom) {
                    dom.scrollIntoView();
                }
            }
            return true;
        })
    };
    window.addEventListener('load', function() {
        if (!(AppConfig && AppConfig.userId)) {
            location.hash = '';
        }
        Router.listen();
        Router.showInitPage()
    }, false)

    function _serializeParams(params) {
        return window.encodeURIComponent(JSON.stringify(params));
    }

    function _unserializeParams(params) {
        try {
            params = JSON.parse(window.decodeURIComponent(params));
        } catch (e) {}
        return params;
    }

    return Router;
})();