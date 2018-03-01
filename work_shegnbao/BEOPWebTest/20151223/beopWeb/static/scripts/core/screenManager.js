var ScreenManager = (function () {
    var slice = Array.prototype.slice;
    var m_dictScreen = {};
    var panPrjSel;
    var preScreenName, nowScreenName;   // control call initProject()
    var isMobile = false;
    if (navigator.userAgent.match(/iP(ad|hone|od)|Android|Version/i)) isMobile = true;
    if (!isMobile && window.history && history.replaceState) {
        $(window).on("popstate", function (event) {
            var curId = location.hash;
            if (curId) {
                curId = curId.substring(1, curId.length);
                if (m_dictScreen[curId]) {
                    preScreenName = nowScreenName;
                    nowScreenName = m_dictScreen[curId].name;
                    if ('PaneProjectSelector' == preScreenName && 'PaneProjectSelector' != nowScreenName) {
                        if (panPrjSel && AppConfig.projectId) {   // init nav
                            panPrjSel.initProject(AppConfig.projectId, AppConfig.projectName, AppConfig.projectShowName, m_dictScreen[curId].navSelPageId);
                        }
                    }
                    else {
                        var navLi = $('#ulPages').children('li');
                        if (navLi && navLi.length) {
                            navLi.filter('.active').attr('class', '');

                            var navBtnA = navLi.children('a');
                            for (var i = 0, len = navBtnA.length; i < len; i++) {
                                var item = navBtnA.eq(i);
                                if (item.attr('pageid') == m_dictScreen[curId].navSelPageId) {
                                    item.closest('li').attr('class', 'active');// set one active
                                    break;
                                }
                            }
                        }
                    }
                    m_dictScreen[curId].screen.show();
                }
            }
            else {
                m_dictScreen = {};
                location.href = location.origin;
            }
        });
    }

    function ScreenManager() {
    };
    ScreenManager.show = function () {
        if (arguments.length === 0) {
            return;
        }
        var screenClass = arguments[0];
        if (typeof screenClass !== 'function') {
            return;
        }
        var screenObj = Object.create(screenClass.prototype);
        if (ScreenCurrent) {
            window.onresize = null;
            // 如果 close 方法返回 false，则直接返回，不进行新页面的渲染
            if (ScreenCurrent.close() === false) {
                return;
            }
        }
        ScreenCurrent = (screenClass.apply(screenObj, slice.call(arguments, 1)) || screenObj);
        if (ScreenCurrent.onresize) window.onresize = ScreenCurrent.onresize;
        ScreenCurrent.show();

        if (!isMobile && 'IndexScreen' != screenClass.name) {
            nowScreenName = screenClass.name;
            var navSelPageId = Boolean(arguments[1]) ? arguments[1] : null;
            var id = +new Date();
            location.hash = id;
            m_dictScreen[id] = { 'screen': ScreenCurrent, 'name': screenClass.name, 'navSelPageId': navSelPageId };
            history.replaceState(null, '', window.location.href);
        }
        if ('PaneProjectSelector' == screenClass.name && ScreenCurrent) {
            panPrjSel = ScreenCurrent;
        }
    };
    ScreenManager.clearHistory = function () {
        if (isMobile) return;
        m_dictScreen = {};
        location.hash = '';
    };
    return ScreenManager;
})();