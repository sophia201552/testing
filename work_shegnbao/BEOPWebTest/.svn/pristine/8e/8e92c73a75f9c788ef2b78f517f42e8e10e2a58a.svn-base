var ScreenManager = (function () {


    function ScreenManager() {
    }

    ScreenManager.screenFlag = 'page';

    ScreenManager.root = '#page=IndexScreen';
    ScreenManager.paneRoot = "#page=PaneProjectSelector";

    ScreenManager.isListening = false;

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

        if (!ScreenManager.isListening) {
            ScreenManager.applyScreen.apply(null, arguments);
        } else {
            ScreenManager.applyGoTo.apply(null, arguments);
        }
    };

    ScreenManager.applyGoTo = function () {

        var screenClass = arguments[0];

        if (!screenClass.name) {
            alert(I18n.resource.common.NOT_FOUND_PAGE);
            return false;
        }

        var paramObj = {
            page: screenClass.name
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
        if (!screenClass) {
            alert('Can\'t find the page.');
            return;
        }
        if (ScreenCurrent) {
            window.onresize = null;
            // 如果 close 方法返回 false，则直接返回，不进行新页面的渲染
            if (ScreenCurrent.close && ScreenCurrent.close() === false) {
                return;
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

    ScreenManager._getHashParamsMap = function () {
        var hashParamsList, hashParamsMap = {};
        hashParamsList = location.hash.substr(1).split('&');
        for (var m = 0; m < hashParamsList.length; m++) {
            var paramsItem = hashParamsList[m].split('=');
            hashParamsMap[paramsItem[0]] = paramsItem[1];
        }
        return hashParamsMap;
    };

    ScreenManager.loadProjectMenu = function (project, page_id) {
        new PaneProjectSelector().init().initProject(project['id'], project['name_en'], StringUtil.getI18nProjectName(project), page_id);
    };

    ScreenManager.loadUserPanel = function () {
        $("#right-nav").show();
    };

    ScreenManager.screenChange = function (e) {
        var promise = $.Deferred();

        if (I18n && I18n.resource) {
            promise.resolve();
        } else {
            InitI18nResource().always(function (rs) {
                // I18n 初始化工作
                I18n = new Internationalization(null, rs);
                promise.resolve();
            });
        }

        promise.always(function () {
            var hashParamsMap, screen, currentPage, screenParamsNameList = [], screenParamsValueList = [];

            if (AppConfig.afterLogin) {
                $('#navHeader').fadeIn();
                $('#indexMain').animate({top: '55px'});
            }

            hashParamsMap = ScreenManager._getHashParamsMap();
            if (typeof hashParamsMap.projectId !== 'undefined') {
                AppConfig.projectId = hashParamsMap.projectId;
                var project = BEOPUtil.getProjectFromAppConfig(hashParamsMap.projectId);
                if (project) {
                    AppConfig.projectEnName = project['name_en'];
                    AppConfig.projectName = project['name_en'];
                    if (location.hash != ScreenManager.paneRoot) {
                        ScreenManager.loadProjectMenu(project, hashParamsMap.id);
                    }
                }
            }
            ScreenManager.loadUserPanel();

            currentPage = hashParamsMap[ScreenManager.screenFlag];
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
                    if (typeof hashParamsMap[paramName] !== 'undefined') {
                        screenParamsValueList[m] = _unserializeParams(hashParamsMap[paramName]);
                    } else {
                        screenParamsValueList[m] = undefined;
                    }
                }

                ScreenManager.applyScreen.apply(null, [screen].concat(screenParamsValueList));
                //临时处理
                I18n.fillArea($('#navPane'));
                return false;
            } else {
                return true;
            }
        });
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
                        new PaneProjectSelector().init().show();
                    }, false);
                } else {
                    location.hash = ScreenManager.root;
                }
            } else {
                if (location.hash == ScreenManager.root) {
                    if (AppConfig.afterLogin) {
                        location.hash = ScreenManager.paneRoot;
                    } else {
                        ScreenManager.screenChange();
                    }
                }
                if (AppConfig.afterLogin) {
                    window.addEventListener('load', function () {
                        ScreenManager.screenChange();
                        new PaneProjectSelector().init();
                    }, false)
                } else {
                    location.hash = ScreenManager.root;
                }
            }


        } else {
            console.error('This browser can\'t support onhashchange event.')
        }
    };


    ScreenManager.detectAnchorHash = function () {
        //处理不是页面定位中也用到了#问题
        var isValidHash = function (hash) {
            if (typeof  hash === typeof undefined || hash.startsWith('http') || hash.startsWith('https')) {
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
        if (typeof params !== 'string') {
            return window.encodeURIComponent(JSON.stringify(params));
        }
        return params;
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