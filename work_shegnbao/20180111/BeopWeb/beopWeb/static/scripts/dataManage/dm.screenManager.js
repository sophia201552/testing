var ScreenManager = (function () {

    function ScreenManager() {
    }

    ScreenManager.screenFlag = 'page';

    ScreenManager.root = '#page=IndexScreen';
    ScreenManager.paneRoot = "#page=PaneProjectSelector";
    ScreenManager.platRoot ="/platform#fromOb=1"
    ScreenManager.isListening = false;

    ScreenManager.setProjectSelector = function (ProjectSelector) {
        if (typeof ProjectSelector === 'function') {
            ScreenManager.projectSelector = new ProjectSelector();
        }
    };

    ScreenManager.Init = function () {
        //ScreenManager.show(IndexScreen);
        I18n.fillArea($(".navbar"));
    };

    ScreenManager.show = function () {
        if (arguments.length === 0) {
            return;
        }
        var screenClass = arguments[0];
        if (typeof screenClass !== 'function') {
            return;
        }

        if (ScreenManager.isListening) {
            ScreenManager.applyGoTo.apply(null, arguments);
        } else {
            ScreenManager.applyScreen.apply(null, arguments);
        }
    };

    ScreenManager.applyGoTo = function () {
       
        var screenClass = arguments[0];
        var className = screenClass.toString().match(/function\s*(\w+)/)[1]
        if (!className) {
            alert(I18n.resource.common.NOT_FOUND_PAGE);
            return false;
        }

        var paramObj = {
            page: className
        }, paramList = ScreenManager._getFunctionParams(screenClass);
        for (var m = 0, n = paramList.length; m < n; m++) {
            if (typeof arguments[m + 1] != typeof undefined) {
                paramObj[paramList[m]] = arguments[m + 1];
            }
        }
        ScreenManager.goTo(paramObj);
    };

    ScreenManager.applyScreen = function () {
        var screenClass = arguments[0];
        var ScreenCurrent = '';
        if (!screenClass) {
            alert('Can\'t find the page.');
            return;
        }
        if (ScreenCurrent) {
            window.onresize = null;
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
        ScreenCurrent = (screenClass.apply(screenObj, Array.prototype.slice.call(arguments, 1)) || screenObj);
        if (ScreenCurrent.onresize) window.onresize = ScreenCurrent.onresize;
        ScreenCurrent.show();
    };

    //获取函数的参数
    ScreenManager._getFunctionParams = function (func) {
        var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg,
            ARGUMENT_NAMES = /([^\s,]+)/g, fnStr, result;

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
    ScreenManager._getHashParamsMap = function () {
        var list, map = {};
        list = location.hash.substr(1).split('&');
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
    ScreenManager.getPageId = function () {
        var hashMap = ScreenManager._getHashParamsMap();
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
            } catch (e) {
            }

            return params.id;
        }
        if (typeof hashMap.options === 'object' && hashMap.options) {
            return hashMap.options.id;
        }
    };

    ScreenManager.loadProjectMenu = function (project, page_id) {
        //return ScreenManager.projectSelector.initProject(project['id'], page_id);
        return ;
    };
    ScreenManager.screenChange = function (e) {
        var paramsMap = ScreenManager._getHashParamsMap(), project;

        //判断是否有项目权限
        if (typeof paramsMap.projectId !== typeof undefined) {
            AppConfig.projectId = parseInt(paramsMap.projectId);
            project = BEOPUtil.getProjectFromAppConfig(AppConfig.projectId);
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
            AppConfig.projectTimeFormat = project.time_format || 0;
        }


        var promise = $.Deferred();

        if (I18n && I18n.resource) {
            ScreenManager.getProjectI18n(promise,project);
        } else {
            InitI18nResource().always(function (rs) {
                // I18n 初始化工作
                I18n = new Internationalization(null, rs);
                ScreenManager.getProjectI18n(promise,project);
            });
        }

        promise.always(function () {
            var screen, currentPage, screenParamsNameList = [], screenParamsValueList = [];
            //var menuPromise = $.Deferred().resolve();
            var menuPromise = undefined;
            if (project) {
                AppConfig.projectEnName = project['name_en'];
                AppConfig.projectName = project['name_en'];
                //!AppConfig.navItems防止从地图进入项目请求两次菜单
                if (location.hash != ScreenManager.paneRoot && !AppConfig.navItems) {
                    menuPromise = ScreenManager.loadProjectMenu(project, paramsMap.id);
                } else {
                    //ScreenManager.projectSelector.setMenuActive();
                }
            }
            currentPage = paramsMap[ScreenManager.screenFlag];
            if (currentPage) {
                if (currentPage.indexOf('.') > 0) {
                    screen = namespace(currentPage)
                } else {
                    if (currentPage === 'EnergyScreen_M') {// 手机页面特殊处理
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
                screenParamsNameList = ScreenManager._getFunctionParams(screen);
                for (var m = 0; m < screenParamsNameList.length; m++) {
                    var paramName = screenParamsNameList[m];
                    if (typeof paramsMap[paramName] !== 'undefined') {
                        screenParamsValueList[m] = paramsMap[paramName];
                    } else {
                        screenParamsValueList[m] = undefined;
                    }
                }
                menuPromise ? menuPromise.done(function () {
                    var urlPageText = sessionStorage.getItem("nav_i18n_name");
                    if(AppConfig.projectCurrent.i18n == 1 && urlPageText){
                        var pageParam = ScreenManager._getHashParamsMap();
                        for (var i = 0; i < AppConfig.navItems.length; i++) {                            
                            if (AppConfig.navItems[i].originText.replace(' ','') == urlPageText.replace(' ','')) {
                                var paramList = ScreenManager._getFunctionParams(screen);
                                if(paramsMap.page == "EnergyScreen"){
                                    if(screenParamsValueList[0] != AppConfig.navItems[i].id){
                                        screenParamsValueList[0] = AppConfig.navItems[i].id;
                                        paramsMap.id = AppConfig.navItems[i].id;
                                        ScreenManager.goTo(paramsMap);                            
                                        break;
                                    }
                                }else if(paramsMap.page == "PageScreen"){
                                    if(screenParamsValueList[0].id != AppConfig.navItems[i].id){
                                        screenParamsValueList[0].id = AppConfig.navItems[i].id;
                                        paramsMap.options.id = AppConfig.navItems[i].id;
                                        ScreenManager.goTo(paramsMap);                            
                                        break;
                                    }
                                }
                            }
                        }   
                    }
                 
                    ScreenManager.applyScreen.apply(null, [screen].concat(screenParamsValueList));
                }) : ScreenManager.applyScreen.apply(null, [screen].concat(screenParamsValueList));
                //临时处理
                I18n.fillArea($('#navPane'));
                return false;
            } else {
                return true;
            }
        });
    };
    ScreenManager.getProjectI18n = function (promise,project) {
        if (AppConfig.projectId  && project && project.i18n == true && Object.keys(I18n.exResource).length == 0) {
            I18n.getProjectI18n(AppConfig.projectId).always(() => {
                promise.resolve();
            })
        } else {
            promise.resolve()
        }
    };

    ScreenManager.goTo = function (pageInfo) {
        var hashFlag = '#', hashList = [];
        if (!pageInfo) {
            return false;
        }
        if (AppConfig.projectId) {
            pageInfo['projectId'] = AppConfig.projectId;
        }

        if (pageInfo[ScreenManager.screenFlag]) {
            hashList.push(ScreenManager.screenFlag + '=' + pageInfo[ScreenManager.screenFlag]);
        }
        for (var param in pageInfo) {
            if (pageInfo.hasOwnProperty(param)) {
                if (param !== ScreenManager.screenFlag) {
                    hashList.push(param + '=' + _serializeParams(pageInfo[param]));
                }
            }
        }
        if (location.hash === hashFlag + hashList.join('&')) {
            Spinner && Spinner.stop();
        } else {
            location.hash = hashFlag + hashList.join('&');
        }

    };

    ScreenManager.listen = function () {
        if ("onhashchange" in window && (!document.documentMode || document.documentMode >= 8)) {
            ScreenManager.isListening = true;
            window.onhashchange = ScreenManager.screenChange;
            ScreenManager.detectAnchorHash();

            if (location.hash === '') {
                if (AppConfig.afterLogin) {
                    window.addEventListener('load', function () {
                        location.hash = ScreenManager.paneRoot;
                        window.getHmtJavascript && window.getHmtJavascript();
                    }, false);
                } else {
                    location.hash = ScreenManager.root;
                    window.getHmtJavascript && window.getHmtJavascript();
                }
            } else {
                if (location.hash == ScreenManager.root) {
                    if (AppConfig.afterLogin) {
                        location.hash = ScreenManager.paneRoot;
                    } else {
                        ScreenManager.screenChange();
                    }
                } else if (location.hash == '#page=Register') {
                    ScreenManager.screenChange();
                    window.getHmtJavascript && window.getHmtJavascript();
                    return;
                }

                if (AppConfig.afterLogin) {
                    window.addEventListener('load', function () {
                        ScreenManager.screenChange();
                        window.getHmtJavascript && window.getHmtJavascript();
                    }, false)
                } else {
                    location.hash = ScreenManager.root;
                    window.getHmtJavascript && window.getHmtJavascript();
                }
            }


        } else {
            console.error('This browser can\'t support onhashchange event.')
        }
    };


    ScreenManager.detectAnchorHash = function () {
        //处理不是页面定位中也用到了#问题
        var isValidHash = function (hash) {
            if (typeof  hash === typeof undefined ||
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

        $(document).on('click.anchorHash', 'a', function (ev) {
            var $this = $(this), hash = $this.attr('href'), isManagedHash = $this.attr('nothash');

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
    if (typeof AppConfig != typeof undefined) {
        ScreenManager.listen();
    }

    function _serializeParams(params) {
        return window.encodeURIComponent(JSON.stringify(params));
    }

    function _unserializeParams(params) {
        try {
            params = JSON.parse(window.decodeURIComponent(params));
        } catch (e) {
        }
        return params;
    }

    return ScreenManager;
})();