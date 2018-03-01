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
﻿/// <reference path="../../lib/jquery-1.8.3.js" />

var beop = beop || {};
beop.constant = {
    project_img_path: '/static/images/project_img/',
    project_default_img: 'default.jpg'
};

// 生成 object id - 24 位
var ObjectId = function () {
    // 前 8 位，随机十六进制数
    var hex8 = ('00000000' + Math.floor(Math.random() * 0xFFFFFFFF).toString(16)).slice(-8);
    // 中间 3 位，用户id，不足补 0，超过从前面截断
    var userId = ( '000' + (AppConfig.userId || '000') ).slice(-3);
    // 最后 13 位，unix 时间戳
    var timestamp = new Date().valueOf();

    return timestamp+ userId + hex8 ;
};

(function (exports) {
    exports.namespace = function (path) {
        var obj = window;
        path = path.split('.');

        path.forEach(function (p, i) {
            p = p.trim();
            if(i === 0 && p === 'window') return;
            obj = obj[p] = obj[p] || {};
        });

        return obj;
    };
}(window));

var FullScreenManager = (function () {
    var manager = Object.create({
        init: function () {
            var _this = this;

            $(document).off('webkitfullscreenchange');
            $(document).on('webkitfullscreenchange', function () {
                var isFullScreen = !!document.webkitFullscreenElement;
                if (isFullScreen) {
                    _this.onFullScreenEnter();
                } else {
                    _this.onFullScreenOut();
                }
            });
            $(document).off('mozfullscreenchange');
            $(document).on('mozfullscreenchange', function () {
                var isFullScreen = !!document.webkitFullscreenElement;
                if (isFullScreen) {
                    _this.onFullScreenEnter();
                } else {
                    _this.onFullScreenOut();
                }
            });
            $(document).off('msfullscreenchange');
            $(document).on('msfullscreenchange', function () {
                var isFullScreen = !!document.webkitFullscreenElement;
                if (isFullScreen) {
                    _this.onFullScreenEnter();
                } else {
                    _this.onFullScreenOut();
                }
            });

            if (typeof onError === 'function') {
                $(document).off('webkitfullscreenerror');
                $(document).on('webkitfullscreenerror', this.onFullScreenError);
                $(document).off('mozfullscreenerror');
                $(document).on('mozfullscreenerror', this.onFullScreenError);
                $(document).off('msfullscreenerror');
                $(document).on('msfullscreenerror', this.onFullScreenError);
            }
        },
        onFullScreenEnter: function () {
        },
        onFullScreenOut: function () {
        },
        onFullScreenError: function () {
        },
        // open/close full screen mode
        // note: for security concerns, this api an only works in user actions
        toggle: function () {
            if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {  // current working methods
                if (document.documentElement.requestFullscreen) {
                    document.documentElement.requestFullscreen();
                } else if (document.documentElement.msRequestFullscreen) {
                    document.documentElement.msRequestFullscreen();
                } else if (document.documentElement.mozRequestFullScreen) {
                    document.documentElement.mozRequestFullScreen();
                } else if (document.documentElement.webkitRequestFullscreen) {
                    document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
                }
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                }
            }
        }
    });

    manager.init();

    return manager;
}());


function StringBuilder() {
    this.data = Array("");
}
StringBuilder.prototype.append = function () {
    this.data.push(arguments[0]);
    return this;
};
StringBuilder.prototype.toString = function () {
    return this.data.join("");
};
StringBuilder.prototype.getLength = function () {
    return this.data.length;
};


//string 的format方法
//usage 1: '{0} {1} {2} {3}'.format('this', 'is', 'a', 'test') -> this is a test
//usage 2: '{0} {1} {2} {3}'.format(['this', 'is', 'a', 'test']) -> this is a test
if (!String.prototype.format) {
    String.prototype.format = function () {
        if (arguments[0] === undefined) {
            return '';
        }
        if (arguments[0].constructor === Array) {
            var args = arguments[0];
        } else {
            var args = arguments;
        }

        // var i = 0;
        // var str = this.toString();
        // while (args[i]) str = str.replace('{'+i+'}', args[i++]);
        // return str;

        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined' ? args[number] : match;
        });
    };
}

// input: '<td>{name}</td><td>{gender}</td>'.formatEL({name: 'zhangsan', gender: 'male'});
// output: '<td>zhangsan</td><td>male</td>'
// input: '{name},{age},{address}'.formatEL({name: 'zhangsan', age: 20, address: 'shanghai', other: 'other'});
// output: 'zhangsan,20,shanghai'
// input: '{}'.formatEL({foo: 1});
// output: '{}'
// input: '{{name}}'.formatEL({name: 'zhangsan'});
// output: '{zhangsan}'
if (!String.prototype.formatEL) {
    String.prototype.formatEL = function (o) {
        var str = this.toString();
        if (!str || !o) return '';

        for (var p in o) {
            if (o.hasOwnProperty(p)) {
                str = str.replace(new RegExp('{' + p + '}', 'g'), o[p]);
            }
        }
        return str;
    };
}

//parse String to Date
//ex:parse '2015-02-02 08:00:00' / '2015/02/02 08:00:00' to Date type
String.prototype.toDate = function () {
    var str = this;
    if (str.indexOf('-') > -1)
    //this = this.replace(/-/g, '/')
        str = str.replace('-', '/').replace('-', '/');
    return new Date(str);
};
//parse timestamp to Date
Number.prototype.toDate = function () {
    return new Date(this);
};

function Alert(targetElement, type, msg) {
    this.element = targetElement;
    this.str = new StringBuilder();
    this.str.append('<div style="display:none;" class="alert beop-alert alert-')
        .append(type)
        .append(' alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>')
        .append('<div class="alert-msg">' + msg + '</div>')
        .append('</div>');
    this.$alert = $(this.str.toString());
}

Alert.danger = function (targetElement, msg) {
    return new Alert(targetElement, Alert.type.danger, msg).show();
};

Alert.warning = function (targetElement, msg) {
    return new Alert(targetElement, Alert.type.warning, msg).show();
};

Alert.success = function (targetElement, msg) {
    return new Alert(targetElement, Alert.type.success, msg).show();
};

Alert.info = function (targetElement, msg) {
    return new Alert(targetElement, Alert.type.info, msg).show();
};

Alert.closeAll = function () {
    $('.beop-alert').remove();
};

Alert.type = {
    danger: 'danger',
    warning: 'warning',
    success: 'success',
    info: 'info'
};

Alert.prototype.show = function (duration) {
    Alert.closeAll();
    if (duration) {
        var _this = this;
        setTimeout(function () {
            _this.close();
        }, duration);
    }
    $(this.element).append(this.$alert);
    this.$alert.slideDown(500);
    return this;
};
Alert.prototype.close = function () {
    var _this = this;
    this.$alert.slideUp(500, function () {
        _this.$alert.remove();
        _this = null;
    });
};

Alert.prototype.setMessage = function (msg) {
    if (!msg) {
        return false
    }
    this.$alert.find('.alert-msg').text(msg);

};

Alert.prototype.setStyle = function (style) {
    if (style && typeof style !== 'string') {
        this.$alert.css(style);
    }
    return this;
};

Alert.prototype.showAtTop = function (duration) {
    this.setStyle({
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        margin: 'auto',
        width: '30%',
        textAlign: 'center',
        zIndex: 10000
    });
    this.show(duration);
};

function showDialog(url) {
    return WebAPI.get(url).done(function (resultHtml) {
        $("#dialogContent").html(resultHtml);
        $('#dialogModal').modal({});
    });
}


function clone(obj) {
    if (obj == null || typeof (obj) != 'object')
        return obj;

    var temp = obj.constructor(); // changed

    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            temp[key] = clone(obj[key]);
        }
    }
    return temp;
}

//对Date的扩展，将 Date 转化为指定格式的String       
//月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q) 可以用 1-2 个占位符       
//年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)       
//eg:       
//(new Date()).pattern("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423       
//(new Date()).pattern("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04       
//(new Date()).pattern("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04       
//(new Date()).pattern("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04       
//(new Date()).pattern("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18       
Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份           
        "d+": this.getDate(), //日           
        "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时           
        "H+": this.getHours(), //小时           
        "m+": this.getMinutes(), //分           
        "s+": this.getSeconds(), //秒           
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度           
        "S": this.getMilliseconds() //毫秒           
    };
    var week = {
        "0": "/u65e5",
        "1": "/u4e00",
        "2": "/u4e8c",
        "3": "/u4e09",
        "4": "/u56db",
        "5": "/u4e94",
        "6": "/u516d"
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    if (/(E+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[this.getDay() + ""]);
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}

var DateUtil = (function () {
    var dateLocale = {
        month: {
            en: {
                month_names: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                month_names_short: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            },
            zh: {
                month_names: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
                month_names_short: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
            }
        }
    };

    function getWeekNumber(d) {
        d = new Date(+d);
        d.setHours(0, 0, 0);
        d.setDate(d.getDate() + 4 - (d.getDay() || 7));
        var yearStart = new Date(d.getFullYear(), 0, 1);
        var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1) / 7)
        return [d.getFullYear(), weekNo];
    }

    function getLastWeekNumberOf(y, w) {
        w -= 1;
        if (w === 0) {
            y = y - 1;
            w = 52;
        }
        return [y, w];
    }

    function getNextWeekNumberOf(y, w) {
        w += 1;
        if (w === 53) {
            y += 1;
            w = 1;
        }
        return [y, w];
    }

    function isLeapYear(y) {
        if (Object.prototype.toString.call(y) === '[object Date]') {
            y = y.getUTCFullYear();
        }
        return (( y % 4 === 0 ) && ( y % 100 !== 0 )) || ( y % 400 === 0 );
    }

    function daysInMonth(dt) {
        var m = dt.getUTCMonth();
        if (m === 1) {
            return isLeapYear(dt) ? 29 : 28;
        }
        return [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m];
    }

    function getFirstDayOfWeek(year, week) {
        var d = new Date(year, 0, 1),
            offset = d.getTimezoneOffset();
        d.setDate(d.getDate() + 4 - (d.getDay() || 7));

        d.setTime(d.getTime() + 7 * 24 * 60 * 60 * 1000
            * (week + (year == d.getFullYear() ? -1 : 0 )));

        d.setTime(d.getTime()
            + (d.getTimezoneOffset() - offset) * 60 * 1000);

        d.setDate(d.getDate() - 3);

        return d;
    }

    function getDateRangeOnWeekNumber(year, week) {
        if (!year || !week) {
            return;
        }
        var firstDay = getFirstDayOfWeek(year, week), lastDay = new Date(firstDay);
        lastDay.setDate(firstDay.getDate() + 6);
        return [firstDay, lastDay];
    }

    function getMonthName(index, language) {
        var monthList = language && language in dateLocale.month ? dateLocale.month[language].month_names : dateLocale.month['en'].month_names;
        return monthList[index];
    }

    function getMonthNameShort(index, language) {
        var monthList = language && language in dateLocale.month ? dateLocale.month[language].month_names_short : dateLocale.month['en'].month_names_short;
        return monthList[index];
    }

    function getLastMonth(currentMonth) {
        if (!currentMonth) {
            currentMonth = new Date().getMonth() + 1;
        }
        if (currentMonth === 1) {
            return 12;
        } else {
            return currentMonth - 1;
        }
    }

    function getNextMonth(currentMonth) {
        if (!currentMonth) {
            currentMonth = new Date().getMonth() + 1;
        }
        if (currentMonth === 12) {
            return 1;
        } else {
            return currentMonth + 1;
        }
    }

    /**
     * get the relative date info from date2 according to date1
     * TESTS:
     * TEST_1
     * DateUtil.getRelativeDateInfo(new Date('2015-05-08 16:03:25'), new Date('2015-05-04 14:41:57'))
     * output: "4 days ago"
     * TEST_2
     * DateUtil.getRelativeDateInfo(new Date('2015-05-08 16:03:25'), new Date('2015-05-08 15:41:57'))
     * output: "21 minutes ago"
     * TEST_3
     * DateUtil.getRelativeDateInfo(new Date('2015-05-08 16:03:25'), new Date('2015-04-04 14:41:57'))
     * output: "34 days ago"
     * TEST_4
     * DateUtil.getRelativeDateInfo(new Date('2015-05-08 16:03:25'), new Date('2014-05-04 14:41:57'))
     * output: "1 year ago"
     */
    function getRelativeDateInfo(date1, date2) {
        var now = new Date();
        var lang = I18n.type;
        var value1, value2, ts, info;

        // deal with all empty
        if (!date1 && !date2) return '';

        value1 = (date1 || now).valueOf();
        value2 = (date2 || now).valueOf();

        // do Math.abs, and turn millisecond to second
        ts = Math.floor(Math.abs(value1 - value2) / 1000);

        switch (true) {
            // seconds level
            // will show "n second(s) ago/later"
            case ts < 60:
                info = ts + (ts === 1 ? ' second' : ' seconds');
                break;
            // minutes level
            // will show "n minute(s) ago/later"
            case ts < 3600/*60 * 60*/
            :
                ts = Math.floor(ts / 60);
                info = ts + (ts === 1 ? ' minute' : ' minutes');
                break;
            // hours level
            // will show "n hour(s) ago/later"
            case ts < 86400/*60 * 60 * 24*/
            :
                ts = Math.floor(ts / (3600/*60 * 60*/));
                info = ts + (ts === 1 ? ' hour' : ' hours');
                break;
            // days level
            // will show "n day(s) ago/later"
            case ts < 31536000/*60 * 60 * 24 * 365*/
            :
                ts = Math.floor(ts / (86400/*60 * 60 * 24*/));
                info = ts + (ts === 1 ? ' day' : ' days');
                break;
            // years level
            // will show "n year(s) ago/later"
            default:
                ts = Math.floor(ts / (31536000/*60 * 60 * 24 * 365*/));
                info = ts + (ts === 1 ? ' year' : ' years');
                break;
        }
        info += value1 > value2 ? ' ago' : ' later';
        if (lang === 'zh') {
            info = info.replace(/\s(seconds?|minutes?|hours?|days?|years?)\s(ago|later)$/, function ($0, $1, $2) {
                var rs = '';
                if ($1.indexOf('second') > -1) rs += '秒钟';
                if ($1.indexOf('minute') > -1) rs += '分钟';
                if ($1.indexOf('hour') > -1) rs += '小时';
                if ($1.indexOf('day') > -1) rs += '天';
                if ($1.indexOf('year') > -1) rs += '年';
                if ($2 === 'ago') rs += '前';
                if ($2 === 'later') rs += '后';
                return rs;
            });
        }
        return info;
    }

    return {
        getWeekNumber: getWeekNumber,
        isLeapYear: isLeapYear,
        daysInMonth: daysInMonth,
        getLastWeekNumberOf: getLastWeekNumberOf,
        getNextWeekNumberOf: getNextWeekNumberOf,
        getDateRangeOnWeekNumber: getDateRangeOnWeekNumber,
        getFirstDayOfWeek: getFirstDayOfWeek,
        getMonthName: getMonthName,
        getMonthNameShort: getMonthNameShort,
        getLastMonth: getLastMonth,
        getNextMonth: getNextMonth,
        getRelativeDateInfo: getRelativeDateInfo
    }
})();
var StringUtil = (function () {
    var HTML_ENTITIES = {
        '&': '&amp;',
        '>': '&gt;',
        '<': '&lt;',
        '"': '&quot;',
        "'": '&#39;',
        '`': '&#x60;'
    }, HTML_ENTITIES_INVERT = invert(HTML_ENTITIES);

    function invert(obj) {
        var result = {}, keys = Object.keys(obj);
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
        return text.replace(replaceRegexp, function (character) {
            return HTML_ENTITIES[character];
        });
    }

    function htmlUnEscape(text) {
        if (!text) {
            return text
        }
        var source = '(?:' + Object.keys(HTML_ENTITIES_INVERT).join('|') + ')',
            replaceRegexp = RegExp(source, 'g');
        return text.replace(replaceRegexp, function (character) {
            return HTML_ENTITIES_INVERT[character];
        });
    }

    var getI18nProjectName = function (project) {
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
            default :
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
var BEOPUtil = (function () {

    var jsType = {
        function: typeof $.noop,
        number: typeof 0,
        string: typeof '',
        undefined: typeof undefined
    };

    var projectImgPath = beop.constant.project_img_path;
    var setRelativePosition = function ($obj, $target, topOffset, leftOffset) {//$obj为比较对象，$target为浮动窗口对象
        var offset = $obj.offset();
        var topOffset = topOffset || 10;
        var leftOffset = leftOffset || 5;
        var top = offset.top + topOffset;
        var left = offset.left + $obj.width() + leftOffset;
        $target.css({
            "left": left,
            "top": top
        });
    };

    var projectDefaultImgPath = projectImgPath + beop.constant.project_default_img;
    var getProjectImgPath = function (project) {
        if (!project) {
            return;
        } else {
            return project.pic ? projectImgPath + project.pic : projectDefaultImgPath;
        }
    };
    var getProjectFromAppConfig = function (projectId) {
        for (var m = 0, len = AppConfig.projectList.length; m < len; m++) {
            if (AppConfig.projectList[m].id == projectId) {
                return AppConfig.projectList[m];
            }
        }
    };

    function getFunctionName(func) {
        if (!func || typeof func != jsType.function) {
            return '';
        }
        var ret = func.toString();
        ret = ret.substr('function '.length);
        ret = ret.substr(0, ret.indexOf('('));
        return ret;
    }

    function isUndefined(obj) {
        return typeof obj === jsType.undefined;
    }

    function getCookie(name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length == 2) return parts.pop().split(";").shift();
    }

    return {
        setRelativePosition: setRelativePosition,
        getProjectImgPath: getProjectImgPath,
        getFunctionName: getFunctionName,
        isUndefined: isUndefined,
        getCookie: getCookie,
        getProjectFromAppConfig: getProjectFromAppConfig
    }
})();


(function () {
    var beop_tmpl_cache = {};

    this.beopTmpl = function tmpl(str, data) {
        var fn = !/\W/.test(str) ?
            beop_tmpl_cache[str] = beop_tmpl_cache[str] ||
                tmpl(document.getElementById(str).innerHTML) :

            new Function("obj",
                "var p=[],print=function(){p.push.apply(p,arguments);};" +

                "with(obj){p.push('" +

                str
                    .replace(/[\r\t\n]/g, " ")
                    .split(/<!/).join("\t")
                    .replace(/((^|!>)[^\t]*)'/g, "$1\r")
                    .replace(/\t=(.*?)!>/g, "',$1,'")
                    .split("\t").join("');")
                    .split(/!>/).join("p.push('")
                    .split("\r").join("\\'")
                + "');}return p.join('');");

        return data ? fn(data) : fn;
    };
})();


/* 页面折叠效果 start */
var SidebarMenuEffect = (function () {
    function SidebarMenuEffect() {
    }

    SidebarMenuEffect.prototype.init = function (center, left, right) {
        var _this = this;
        this.$paneCt = $(center);
        this.$leftBtn = $(center).find('#leftCt');
        this.$rightBtn = $(center).find('#rightCt');

        var container = document.getElementById('st-container'),
            buttons = Array.prototype.slice.call(document.querySelectorAll('.sideTrans')),
            refresh = function () {
                var leftCol = 0, rightCol = 0, centerCol = 0;
                var leftArrow = '<span class="glyphicon glyphicon-chevron-left"></span>';
                var rightArrow = '<span class="glyphicon glyphicon-chevron-right"></span>';
                if (_this.$leftBtn.length > 0) {
                    if (container.className.indexOf('st-effect-7') > 0) {
                        var prev = _this.$paneCt.prev('div')[0];
                        if (prev && prev.className.indexOf('col-') > -1) {
                            leftCol = parseInt(prev.classList[0].split('-')[2]);
                        } else {
                            leftCol = 0;
                        }
                        _this.$leftBtn.removeClass('leftCtClose').addClass('leftCtOpen').html(leftArrow);
                    } else {
                        leftCol = 0;
                        _this.$leftBtn.removeClass('leftCtOpen').addClass('leftCtClose').html(rightArrow);
                    }
                }
                if (_this.$rightBtn.length > 0) {
                    if (container.className.indexOf('st-effect-1') > 0) {
                        var next = _this.$paneCt.next('div')[0];
                        if (next && next.className.indexOf('col-') > -1) {
                            rightCol = parseInt(next.classList[0].split('-')[2]);
                        } else {
                            rightCol = 0;
                        }
                        _this.$rightBtn.removeClass('rightCtClose').addClass('rightCtOpen').html(rightArrow);
                    } else {
                        rightCol = 0;
                        _this.$rightBtn.removeClass('rightCtOpen').addClass('rightCtClose').html(leftArrow);
                    }
                }

                centerCol = 12 - leftCol - rightCol;
                _this.$paneCt.removeClass().addClass('col-sm-' + centerCol + ' st-content');
            };

        buttons.forEach(function (el, i) {
            var effect = el.getAttribute('data-effect');

            el.addEventListener('click', function (ev) {
                var target = ev.target.getAttribute('data-effect') != null ? ev.target.getAttribute('data-effect') : ev.target.parentNode.getAttribute('data-effect');
                var stCtClass = document.getElementById('st-container').className;
                if (stCtClass.indexOf(target) < 0) {
                    ev.stopPropagation();
                    ev.preventDefault();
                    container.classList.add(effect);
                    setTimeout(function () {
                        if ($(container.children[0]).children('div').length == 3) {
                            container.classList.add('st-menu-open');
                        }
                        refresh();
                    }, 250);
                } else {
                    container.classList.remove(target);
                    refresh();
                }
            });
        });
    };
    return SidebarMenuEffect;
})();
/* 页面折叠效果 end */

/* 检测浏览器及系统信息 start*/
(function (window) {
    {
        var unknown = '-';

        // screen
        var screenSize = '';
        if (screen.width) {
            var width = (screen.width) ? screen.width : '';
            var height = (screen.height) ? screen.height : '';
            screenSize += '' + width + " x " + height;
        }

        //browser
        var nVer = navigator.appVersion;
        var nAgt = navigator.userAgent;
        var browser = navigator.appName;
        var version = '' + parseFloat(navigator.appVersion);
        var majorVersion = parseInt(navigator.appVersion, 10);
        var nameOffset, verOffset, ix;

        // Opera
        if ((verOffset = nAgt.indexOf('Opera')) != -1) {
            browser = 'Opera';
            version = nAgt.substring(verOffset + 6);
            if ((verOffset = nAgt.indexOf('Version')) != -1) {
                version = nAgt.substring(verOffset + 8);
            }
        }
        // MSIE
        else if ((verOffset = nAgt.indexOf('MSIE')) != -1) {
            browser = 'Microsoft Internet Explorer';
            version = nAgt.substring(verOffset + 5);
        }
        // Chrome
        else if ((verOffset = nAgt.indexOf('Chrome')) != -1) {
            browser = 'Chrome';
            version = nAgt.substring(verOffset + 7);
        }
        // Safari
        else if ((verOffset = nAgt.indexOf('Safari')) != -1) {
            browser = 'Safari';
            version = nAgt.substring(verOffset + 7);
            if ((verOffset = nAgt.indexOf('Version')) != -1) {
                version = nAgt.substring(verOffset + 8);
            }
        }
        // Firefox
        else if ((verOffset = nAgt.indexOf('Firefox')) != -1) {
            browser = 'Firefox';
            version = nAgt.substring(verOffset + 8);
        }
        // MSIE 11+
        else if (nAgt.indexOf('Trident/') != -1) {
            browser = 'Microsoft Internet Explorer';
            version = nAgt.substring(nAgt.indexOf('rv:') + 3);
        }
        // Other browsers
        else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) < (verOffset = nAgt.lastIndexOf('/'))) {
            browser = nAgt.substring(nameOffset, verOffset);
            version = nAgt.substring(verOffset + 1);
            if (browser.toLowerCase() == browser.toUpperCase()) {
                browser = navigator.appName;
            }
        }
        // trim the version string
        if ((ix = version.indexOf(';')) != -1) version = version.substring(0, ix);
        if ((ix = version.indexOf(' ')) != -1) version = version.substring(0, ix);
        if ((ix = version.indexOf(')')) != -1) version = version.substring(0, ix);

        majorVersion = parseInt('' + version, 10);
        if (isNaN(majorVersion)) {
            version = '' + parseFloat(navigator.appVersion);
            majorVersion = parseInt(navigator.appVersion, 10);
        }

        // mobile version
        var mobile = /Mobile|mini|Fennec|Android|iP(ad|od|hone)/.test(nVer);

        // cookie
        var cookieEnabled = (navigator.cookieEnabled) ? true : false;

        if (typeof navigator.cookieEnabled == 'undefined' && !cookieEnabled) {
            document.cookie = 'testcookie';
            cookieEnabled = (document.cookie.indexOf('testcookie') != -1) ? true : false;
        }

        // system
        var os = unknown;
        var clientStrings = [
            {s: 'Windows 3.11', r: /Win16/},
            {s: 'Windows 95', r: /(Windows 95|Win95|Windows_95)/},
            {s: 'Windows ME', r: /(Win 9x 4.90|Windows ME)/},
            {s: 'Windows 98', r: /(Windows 98|Win98)/},
            {s: 'Windows CE', r: /Windows CE/},
            {s: 'Windows 2000', r: /(Windows NT 5.0|Windows 2000)/},
            {s: 'Windows XP', r: /(Windows NT 5.1|Windows XP)/},
            {s: 'Windows Server 2003', r: /Windows NT 5.2/},
            {s: 'Windows Vista', r: /Windows NT 6.0/},
            {s: 'Windows 7', r: /(Windows 7|Windows NT 6.1)/},
            {s: 'Windows 8.1', r: /(Windows 8.1|Windows NT 6.3)/},
            {s: 'Windows 8', r: /(Windows 8|Windows NT 6.2)/},
            {s: 'Windows NT 4.0', r: /(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/},
            {s: 'Windows ME', r: /Windows ME/},
            {s: 'Android', r: /Android/},
            {s: 'Open BSD', r: /OpenBSD/},
            {s: 'Sun OS', r: /SunOS/},
            {s: 'Linux', r: /(Linux|X11)/},
            {s: 'iOS', r: /(iPhone|iPad|iPod)/},
            {s: 'Mac OS X', r: /Mac OS X/},
            {s: 'Mac OS', r: /(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/},
            {s: 'QNX', r: /QNX/},
            {s: 'UNIX', r: /UNIX/},
            {s: 'BeOS', r: /BeOS/},
            {s: 'OS/2', r: /OS\/2/},
            {s: 'Search Bot', r: /(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/}
        ];
        for (var id in clientStrings) {
            var cs = clientStrings[id];
            if (cs.r.test(nAgt)) {
                os = cs.s;
                break;
            }
        }

        var osVersion = unknown;

        if (/Windows/.test(os)) {
            osVersion = /Windows (.*)/.exec(os)[1];
            os = 'Windows';
        }

        switch (os) {
            case 'Mac OS X':
                osVersion = /Mac OS X (10[\.\_\d]+)/.exec(nAgt)[1];
                break;

            case 'Android':
                osVersion = /Android ([\.\_\d]+)/.exec(nAgt)[1];
                break;

            case 'iOS':
                osVersion = /OS (\d+)_(\d+)_?(\d+)?/.exec(nVer);
                osVersion = osVersion[1] + '.' + osVersion[2] + '.' + (osVersion[3] | 0);
                break;
        }
    }

    window.jscd = {
        screen: screenSize,
        browser: browser,
        browserVersion: version,
        mobile: mobile,
        os: os,
        osVersion: osVersion,
        cookies: cookieEnabled
    };
}(this));

/* 检测浏览器及系统信息 end*/


/* 富文本编辑器 wysiwyg start */
var getWysiwyg = function (hasEditor) {
    hasEditor = hasEditor === undefined ? true : hasEditor;
    var wysiwyg = '\
        <div class="btn-toolbar" data-role="editor-toolbar" data-target="#editor">\
          <div class="btn-group">\
            <a class="btn dropdown-toggle" data-toggle="dropdown" title="Font" data-original-title="Font"><i class="icon-font"></i><b class="caret"></b></a>\
              <ul class="dropdown-menu">\
              <li><a data-edit="fontName Serif" style="font-family:\'Serif\'">Serif</a></li><li><a data-edit="fontName Sans" style="font-family:\'Sans\'">Sans</a></li><li><a data-edit="fontName Arial" style="font-family:\'Arial\'">Arial</a></li><li><a data-edit="fontName Arial Black" style="font-family:\'Arial Black\'">Arial Black</a></li><li><a data-edit="fontName Courier" style="font-family:\'Courier\'">Courier</a></li><li><a data-edit="fontName Courier New" style="font-family:\'Courier New\'">Courier New</a></li><li><a data-edit="fontName Comic Sans MS" style="font-family:\'Comic Sans MS\'">Comic Sans MS</a></li><li><a data-edit="fontName Helvetica" style="font-family:\'Helvetica\'">Helvetica</a></li><li><a data-edit="fontName Impact" style="font-family:\'Impact\'">Impact</a></li><li><a data-edit="fontName Lucida Grande" style="font-family:\'Lucida Grande\'">Lucida Grande</a></li><li><a data-edit="fontName Lucida Sans" style="font-family:\'Lucida Sans\'">Lucida Sans</a></li><li><a data-edit="fontName Tahoma" style="font-family:\'Tahoma\'">Tahoma</a></li><li><a data-edit="fontName Times" style="font-family:\'Times\'">Times</a></li><li><a data-edit="fontName Times New Roman" style="font-family:\'Times New Roman\'">Times New Roman</a></li><li><a data-edit="fontName Verdana" style="font-family:\'Verdana\'">Verdana</a></li></ul>\
            </div>\
          <div class="btn-group">\
            <a class="btn dropdown-toggle" data-toggle="dropdown" title="Font Size" data-original-title="Font Size"><i class="icon-text-height"></i>&nbsp;<b class="caret"></b></a>\
              <ul class="dropdown-menu">\
              <li><a data-edit="fontSize 5"><font size="5">Huge</font></a></li>\
              <li><a data-edit="fontSize 3"><font size="3">Normal</font></a></li>\
              <li><a data-edit="fontSize 1"><font size="1">Small</font></a></li>\
              </ul>\
          </div>\
          <div class="btn-group">\
            <a class="btn" data-edit="bold" title="Bold (Ctrl/Cmd+B)" data-original-title="Bold (Ctrl/Cmd+B)"><i class="icon-bold"></i></a>\
            <a class="btn" data-edit="italic" title="Italic (Ctrl/Cmd+I)" data-original-title="Italic (Ctrl/Cmd+I)"><i class="icon-italic"></i></a>\
            <a class="btn" data-edit="strikethrough" title="Strikethrough" data-original-title="Strikethrough"><i class="icon-strikethrough"></i></a>\
            <a class="btn" data-edit="underline" title="Underline (Ctrl/Cmd+U)" data-original-title="Underline (Ctrl/Cmd+U)"><i class="icon-underline"></i></a>\
          </div>\
          <div class="btn-group">\
            <a class="btn" data-edit="insertunorderedlist" title="Bullet list" data-original-title="Bullet list"><i class="icon-list-ul"></i></a>\
            <a class="btn" data-edit="insertorderedlist" title="Number list" data-original-title="Number list"><i class="icon-list-ol"></i></a>\
            <a class="btn" data-edit="outdent" title="Reduce indent" data-original-title="Reduce indent (Shift+Tab)"><i class="icon-indent-left"></i></a>\
            <a class="btn" data-edit="indent" title="Indent" data-original-title="Indent (Tab)"><i class="icon-indent-right"></i></a>\
          </div>\
          <div class="btn-group">\
            <a class="btn" data-edit="justifyleft" title="Align Left" data-original-title="Align Left (Ctrl/Cmd+L)"><i class="icon-align-left"></i></a>\
            <a class="btn" data-edit="justifycenter" title="Center" data-original-title="Center (Ctrl/Cmd+E)"><i class="icon-align-center"></i></a>\
            <a class="btn" data-edit="justifyright" title="Align Right" data-original-title="Align Right (Ctrl/Cmd+R)"><i class="icon-align-right"></i></a>\
            <a class="btn btn-info" data-edit="justifyfull" title="Justify" data-original-title="Justify (Ctrl/Cmd+J)"><i class="icon-align-justify"></i></a>\
          </div>\
          <div class="btn-group" style="display:none;">\
              <a class="btn dropdown-toggle" data-toggle="dropdown" title="Hyperlink" data-original-title="Hyperlink"><i class="icon-link"></i></a>\
                <div class="dropdown-menu input-append">\
                    <input class="span2" placeholder="URL" type="text" data-edit="createLink">\
                    <button class="btn" type="button">Add</button>\
            </div>\
            <a class="btn" data-edit="unlink" title="Remove Hyperlink" data-original-title="Remove Hyperlink"><i class="icon-cut"></i></a>\
          </div>\
          <div class="btn-group">\
            <a class="btn" title="Insert picture" id="pictureBtn" data-original-title="Insert picture (or just drag &amp; drop)"><i class="icon-picture"></i></a>\
            <input type="file" data-role="magic-overlay" data-target="#pictureBtn" data-edit="insertImage" style="opacity: 0; position: absolute; top: 0px; left: 0px; width: 41px; height: 30px;">\
          </div>\
          <div class="btn-group">\
            <a class="btn" data-edit="undo" title="Undo (Ctrl/Cmd+Z)" data-original-title="Undo (Ctrl/Cmd+Z)"><i class="icon-undo"></i></a>\
            <a class="btn" data-edit="redo" title="Redo (Ctrl/Cmd+Y)" data-original-title="Redo (Ctrl/Cmd+Y)"><i class="icon-repeat"></i></a>\
          </div>\
          <input type="text" data-edit="inserttext" id="voiceBtn" x-webkit-speech="" style="display: none;">\
        </div>';
    wysiwyg += hasEditor ? '<div id="editor" contenteditable="true" class="form-control gray-scrollbar">' : '';
    wysiwyg += '</div>';

    return wysiwyg;
};
/* 富文本编辑器 wysiwyg end */

/* 获取 URL 参数 */
var getUrlParams = function () {
    var search = window.location.search.substring(1);
    var kvArr = search.split('&');
    var rs = {};

    kvArr.forEach(function (kv) {
        var arr = kv.split('=');
        if (typeof arr[1] !== 'undefined') {
            rs[arr[0]] = arr[1];
        }
    });

    return rs;
};
﻿var WebAPI = (function () {
    //百度统计 置入代码
    var siteId;
    switch (window.location.hostname) {
        case 'beop.rnbtech.com.hk':
            siteId = 'b79c068f77198848e22fe79758836e53';
            break;
        case 'beop6.rnbtech.com.hk':
            siteId = 'f1f6b2b9e6b64592c0b4cb5e9b8bd79e';
            break;
        case 'beopdemo.rnbtech.com.hk':
            siteId = 'ac0df98f274d9a5980a571297248d80b';
            break;
        default:
            break;
    }

    (function () {
        if (siteId) {
            var hm = document.createElement("script");
            hm.src = "//hm.baidu.com/hm.js?" + siteId;
            var s = document.getElementsByTagName("script")[0];
            s.parentNode.insertBefore(hm, s);
        }
    })();


    var mockList = {
        // /analysis/workspace/saveLayout/<userId>/<isTemplate>
        '/static/mock/analysis_workspace_saveLayout.json': /\/analysis\/workspace\/saveLayout\/\d+\/[01]/i,
        // /analysis/template/get/<userId>
        '/static/mock/analysis_template_get.json': /\/analysis\/template\/get\/\d+/i
    };

    function mock(url) {
        var match = null;
        for (var i in mockList) {
            match = url.match(mockList[i]);
            if (match !== null) return i;
        }
        return url;
    }

    function requestFailHandle(result) {
        if (result && result.status == 401) {
            alert(i18n_resource.error.noPermission);
        }
    }

    function WebAPI() {
    }

    WebAPI.isMock = false;

    $.ajaxSetup({
        converters: {"text json": true}, //防止JQuery自动转换JSON格式
        dataFilter: function (result, type) {
            var data = result;

            if (type === 'script') {
                return data;
            } else if (typeof data === 'string') {
                if (/^\s*</.test(data)) {
                    //请求为HTML，直接返回
                    return data;
                }

                try {
                    data = JSON.parse(result);
                } catch (e) {
                    console.log('request error: ' + e + ', the data is :' + data);
                    return data;
                }
            }

            if (data) {
                if (data.error) {
                    switch (data.error) {
                        case 'token_invalid':
                        {
                            console.log(this.url + ' (' + data.error + ': code"' + data.msg + '")');
                            //TODO 测试confirm
                            confirm(i18n_resource.error.token[data.msg] + '. ' + i18n_resource.error.relogin + '.', function () {
                                location.href = '/';
                            });
                            throw data.error;
                        }
                        case 'historyData':
                        {
                            console.log(this.url + ' (' + data.error + ': code"' + data.msg + '")');
                            alert(data.msg);
                            return {};
                        }
                        default:
                            break;
                    }
                }
                if (data.code == 403) {
                    console.log(this.url + ' (' + data.msg + '")');
                    alert(I18n.resource.error.noPermission);
                    return {};
                }
            }
            return data;
        }
    });

    WebAPI.post = function (url, data, isMock) {
        var mockUrl;
        isMock = isMock === undefined ? WebAPI.isMock : isMock;
        if (isMock) {
            mockUrl = mock(url);
            if (url !== mockUrl) return this.get(mockUrl, false);
        }
        return $.ajax({
            url: url,
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json'
        }).fail(requestFailHandle);
    };

    WebAPI.get = function (url, isMock) {
        isMock = isMock === undefined ? WebAPI.isMock : isMock;
        url = isMock ? mock(url) : url;

        if (window._hmt && url.indexOf('.html') > 0) window._hmt.push(['_trackPageview', url]);    //百度PV信息收集

        return $.ajax({url: url, type: 'Get', contentType: 'application/json'}).fail(requestFailHandle);
    };

    WebAPI.getHistoryDS = function (callback) {

    };

    WebAPI.getHistory = function (callback) {

    };

    //用于调试工具跨域并且server端异步响应情形
    WebAPI.ajaxForDebugTool = function (ajaxObj, host, dtuName, endpoint) {
        var defaultUrl = 'http://' + host + '/' + endpoint + '/' + dtuName,
            defaultAjaxObj = {
                url: defaultUrl,
                crossDomain: true,
                dataType: 'json'
            },
            dfd, timer = 10, intervalFlags, url, requestFlag = 'requestFlag=' + new Date().getTime() + Math.ceil(Math.random() * 100);
        $.extend(defaultAjaxObj, ajaxObj);
        url = defaultAjaxObj.url;
        if (url.indexOf('?') < 0) {
            requestFlag = '?' + requestFlag
        } else {
            requestFlag = '&' + requestFlag
        }
        var userId = BEOPUtil.getCookie('userId');
        //跨域cookie无法发送问题
        defaultAjaxObj.url += requestFlag + '&userId=' + userId;

        return $.ajax(defaultAjaxObj).then(function (result) {
            dfd = $.Deferred();
            if (result.success) {
                intervalFlags = setInterval(function () {
                    if (timer < 0) {
                        clearInterval(intervalFlags);
                        return dfd.reject({success: false, msg: 'no response from server'});
                    }
                    $.ajax({
                        type: 'GET',
                        url: 'http://' + host + '/getCMDResponse/' + dtuName + requestFlag,
                        crossDomain: true,
                        dataType: 'json'
                    }).done(function (result) {
                        if (result.success) {
                            clearInterval(intervalFlags);
                            return dfd.resolve(result);
                        }
                    }).always(function () {
                        timer--;
                    })
                }, 2000);
            } else {
                return dfd.reject(result);
            }
            return dfd;
        });
    };

    return WebAPI;
})();
// dependencies: ['jQuery']
(function () {
    'use strict';

    var indexedDB = indexedDB || this.indexedDB || this.webkitIndexedDB ||
                    this.mozIndexedDB || this.OIndexedDB ||
                    this.msIndexedDB;

    // 如果当前浏览器不支持 indexDB，则不继续执行
    if (!indexedDB) {
        return;
    }

    function _initStorage(options) {
        var _this = this;
        this._dbInfo = $.extend({db: null}, options);

        var promise = $.Deferred();
        (function () {
            var _this = this;
            var dbInfo = this._dbInfo;
            var openreq = indexedDB.open(dbInfo.name, dbInfo.version);
            // 失败
            openreq.onerror = function () {
                promise.reject(openreq.error);
            };
            // 成功
            openreq.onsuccess = function () {
                dbInfo.db = openreq.result;
                promise.resolve();
            };
            // 版本变化，需要更新数据库
            openreq.onupgradeneeded = function () {
                var names = openreq.result.objectStoreNames;
                var length, key;
                var indexOf = ([]).indexOf;

                if( indexOf.call(names, 'cache') > -1 ) {
                    openreq.result.deleteObjectStore('cache');
                }
                if( indexOf.call(names, 'datasource') > -1 ) {
                    openreq.result.deleteObjectStore('datasource');
                }
                if( indexOf.call(names, 'thumbnail') > -1 ) {
                    openreq.result.deleteObjectStore('thumbnail');
                }
                if( indexOf.call(names, 'buffer') === -1 ) {
                    openreq.result.createObjectStore('buffer');
                }

                openreq.result.createObjectStore('datasource');
                openreq.result.createObjectStore('thumbnail');

                // 让数据分析的缩略图重新从数据库获取
                for (var i = 0, len = localStorage.length; i < len; i++) {
                    key = localStorage.key(i);
                    if( key.indexOf('workSpacePicStorageEnable') === 0 ) {
                        localStorage.removeItem(key);
                    }
                }

            };
        }).call(this);
    }

    function length(callback) {
        var _this = this;

        var promise = $.Deferred();

        try {
            (function () {
                var dbInfo = _this._dbInfo;
                var store = dbInfo.db.transaction(dbInfo.storeName, 'readonly')
                    .objectStore(dbInfo.storeName);
                var req = store.count();

                req.onsuccess = function () {
                    promise.resolve(req.result);
                };
                req.onerror = function () {
                    promise.reject(req.error);
                };
            }).call(this);
        } catch(e) {
            promise.reject(e);
        }

        excuteCallback(promise, callback);
        return promise;
    }

    function getItem(key, callback) {
        var _this = this;

        if( typeof key !== 'string' ) {
            console.warn('The key is not a string!');
            key = String(key);
        }

        var promise = $.Deferred();
        try {
            (function () {
                var dbInfo = this._dbInfo;
                var store = dbInfo.db.transaction(dbInfo.storeName, 'readonly')
                    .objectStore(dbInfo.storeName);
                var req = store.get(key);

                req.onsuccess = function () {
                    var value = req.result;
                    value = value === undefined ? null : value;
                    promise.resolve(value);
                };
                
                req.onerror = function () {
                    promise.reject(req.error);
                };
            }).call(this);
        } catch(e) {
            promise.reject(e);
        }
        
        excuteCallback(promise, callback);

        return promise;
    }

    function getItemList(keyList, callback) {
        var result = {};
        var promise = this.iterate(function (key, value, i) {
            if( keyList.indexOf(key) > -1 ) {
                result[key] = value;
            }
        }).then(function () {
            return result;
        }, function () {
            console.warn('getItemList error!');
        });

        excuteCallback(promise, callback);

        return promise;
    }

    function setItem(key, value, callback) {
        var _this = this;

        if( typeof key !== 'string' ) {
            console.warn('The key is not a string!');
            key = String(key);
        }

        var promise = $.Deferred();

        try {
            (function () {
                var dbInfo = _this._dbInfo;
                var transaction = dbInfo.db.transaction(dbInfo.storeName, 'readwrite');
                var store = transaction.objectStore(dbInfo.storeName);

                var req = store.put(value, key);
                transaction.oncomplete = function () {
                    promise.resolve();
                };
                transaction.onabort = transaction.onerror = function () {
                    var err = req.error ? req.error : req.transaction.error;
                    promise.reject(err);
                };

            }).call(this);
        } catch(e) {
            promise.reject(e);
        }

        excuteCallback(promise, callback);

        return promise;
    }

    function setItemList(kvList, callback) {
        var promise = $.Deferred();
        try {
            (function () {
                var _this = this;
                var dbInfo = this._dbInfo;
                var transaction = dbInfo.db.transaction(dbInfo.storeName, 'readwrite');
                var store = transaction.objectStore(dbInfo.storeName);
                var result = {};
                
                kvList.forEach(function (kv, i) {
                    var key = kv.key, value = kv.value;
                    if( typeof key !== 'string' ) {
                        console.warn('The key is not a string!');
                        key = String(key);
                    }
                    store.put(value, key);
                });

                transaction.oncomplete = function () {
                    promise.resolve();
                };
                transaction.onabort = transaction.onerror = function () {
                    var err = transaction.error;
                    promise.reject(err);
                };
            }).call(this);
        } catch(e) {
            console.warn('setItemList error!');
            promise.reject(e);
        }

        excuteCallback(promise, callback);

        return promise;
    }

    function removeItem(key, callback) {
        var _this = this;

        if( typeof key !== 'string' ) {
            console.warn('The key is not a string!');
            key = String(key);
        }

        var promise = $.Deferred();

        try {
            (function () {
                var dbInfo = this._dbInfo;
                var transaction = dbInfo.db.transaction(dbInfo.storeName, 'readwrite');
                var store = transaction.objectStore(dbInfo.storeName);
                var req = store.delete(key);

                transaction.oncomplete = function () {
                    promise.resolve();
                };
                transaction.onabort = transaction.onerror = function () {
                    var err = req.error ? req.error : req.transaction.error;
                    promise.reject(err);
                };
            }).call(this);
        } catch(e) {
            promise.reject(e);
        }

        excuteCallback(promise, callback);

        return promise;
    }

    function removeItemList(keyList, callback) {
        var promise = $.Deferred();

        try {
            (function () {
                var dbInfo = this._dbInfo;
                var transaction = dbInfo.db.transaction(dbInfo.storeName, 'readwrite');
                var store = transaction.objectStore(dbInfo.storeName);
                var req = store.openCursor();

                req.onsuccess = function () {
                    var cursor = req.result;
                    var request;

                    if(!cursor) {
                        promise.resolve();
                        return;
                    }
                    if(keyList.indexOf(cursor.key) > -1) {
                        cursor.delete();
                    }
                    cursor.continue();
                };

                req.onerror = function (err) {
                    promise.reject(err);
                };

            }).call(this);
        } catch(e) {
            promise.reject();
        }

        excuteCallback(promise, callback);

        return promise;
    }

    function clear(callback) {
        var _this = this;

        var promise = $.Deferred();

        try {
            (function () {
                var dbInfo = this._dbInfo;
                var transaction = dbInfo.db.transaction(dbInfo.storeName, 'readwrite');
                var store = transaction.objectStore(dbInfo.storeName);
                var req = store.clear();

                transaction.oncomplete = function () {
                    promise.resolve();
                };
                transaction.onabort = transaction.onerror = function () {
                    var err = req.error ? req.error : req.transaction.error;
                    promise.reject(err);
                };

            }).call(this);
        } catch(e) {
            promise.reject(e);
        }

        excuteCallback(promise, callback);

        return promise;
    }

    function key(n, callback) {
        var _this = this;

        var promise = $.Deferred();

        try {
            (function () {
                var dbInfo = this._dbInfo;
                var store = dbInfo.db.transaction(dbInfo.storeName, 'readonly')
                    .objectStore(dbInfo.storeName);
                
                var req = store.openCursor();
                var advanced = false;

                req.onsuccess = function () {
                    var cursor = req.result;

                    if(!cursor) {
                        // 如果没有找到，则返回 null
                        promise.resolve(null);
                        return;
                    }

                    if(n === 0) {
                        promise.resolve(cursor.key);
                    } else {
                        if(!advanced) {
                            advanced = true;
                            cursor.advance(n);
                        } else {
                            promise.resolve(cursor.key);
                        }
                    }
                };

                req.onerror = function () {
                    promise.reject(req.error);
                };

            }).call(this);
        } catch(e) {
            promise.reject(e);
        }

        excuteCallback(promise, callback);

        return promise;
    }

    function keys(callback) {
        var _this = this;

        var promise = $.Deferred();

        try {
            (function () {
                var dbInfo = this._dbInfo;
                var store = dbInfo.db.transaction(dbInfo.storeName, 'readonly')
                    .objectStore(dbInfo.storeName);
                var keys = [];
                var req = store.openCursor();

                req.onsuccess = function () {
                    var cursor = req.result;

                    if(!cursor) {
                        promise.resolve(keys);
                        return;
                    }

                    keys.push(cursor.key);
                    cursor.continue();
                };
                req.onerror = function () {
                    promise.reject(req.error);
                };

            }).call(this);
        } catch(e) {
            promise.reject(e);
        }

        excuteCallback(promise, callback);

        return promise;
    }

    function iterate(iterator, callback) {
        var _this = this;

        var promise = $.Deferred();

        try {
            (function () {
                var dbInfo = this._dbInfo;
                var store = dbInfo.db.transaction(dbInfo.storeName, 'readonly')
                    .objectStore(dbInfo.storeName);
                var req = store.openCursor();
                var index = 0;

                req.onsuccess = function () {
                    var cursor = req.result;
                    var result;

                    if(!cursor) {
                        promise.resolve();
                        return;
                    }

                    result = iterator(cursor.key, cursor.value, index++);

                    if(result === false) {
                        promise.resolve();
                        return;
                    }

                    cursor.continue();

                };
                req.onerror = function () {
                    promise.reject(req.error);
                };

            }).call(this);
        } catch(e) {
            promise.reject(e);
        }

        excuteCallback(promise, callback);

        return promise;
    }

    function excuteCallback(promise, callback) {
        if( typeof callback === 'function' ) {
            promise.then( function (result) {
                callback(null, result);
            }, function (error) {
                callback(erro);
            } );
        }
    }

    var indexDBWrapper = {
        _driver: 'indexedDBWrapper',
        _initStorage: _initStorage,
        length: length,
        getItem: getItem,
        getItemList: getItemList,
        setItem: setItem,
        setItemList: setItemList,
        removeItem: removeItem,
        removeItemList: removeItemList,
        clear: clear,
        key: key,
        keys: keys,
        iterate: iterate
    };

    this.Beop = this.Beop || {};
    this.Beop.cache = this.Beop.cache || {};
    this.Beop.cache.drivers = this.Beop.cache.drivers || {};

    this.Beop.cache.drivers.indexedDB = indexDBWrapper;

}).call(this);
// dependencies: ['jQuery']
(function ($) {
    'use strict';

    var localStorage;

    try {
        // 若浏览器不支持则不继续执行
        if ( !this.localStorage || !('setItem' in this.localStorage) ) {
            return;
        }
        localStorage = this.localStorage;
    } catch (e) {
        return;
    }

    function _initStorage(options) {
        this._dbInfo = $.extend({}, options);
        this._dbInfo.keyPrefix = this._dbInfo.name + '/';
    }

    function length(callback) {
        var _this = this;

        var promise = this.keys().then(function (keys) {
            return keys.length;
        });

        excuteCallback(promise, callback);

        return promise;
    }

    function getItem(key, callback) {
        var _this = this;

        if( typeof key !== 'string' ) {
            console.warn('The key is not a string!');
            key = String(key);
        }

        var promise = $.Deferred();
        ( function () {
            var result;
            result = localStorage.getItem( this._dbInfo.keyPrefix+key );
            // json 反序列化
            try { result = JSON.parse(result); } catch(e) {}
            promise.resolve(result);
            
        } ).call(this);

        excuteCallback(promise, callback);

        return promise;
    }

    function getItemList(keyList, callback) {
        var _this = this;

        var promise = $.Deferred();
        (function () {
            var result = {};

            keyList.forEach(function (key, i) {
                if( typeof key !== 'string' ) {
                    console.warn('The key is not a string!');
                    key = String(key);
                }
                result[key] = localStorage.getItem( _this._dbInfo.keyPrefix+key );
                // json 反序列化
                try { result[key] = JSON.parse(result[key]); } catch(e) {}
            });
            promise.resolve(result);

        }).call(this);

        excuteCallback(promise, callback);

        return promise;
    }

    function setItem(key, value, callback) {
        if( typeof key !== 'string' ) {
            console.warn('The key is not a string!');
            key = String(key);
        }

        var promise = $.Deferred();
        (function () {
            var _this = this;
            var result;
            try {
                // json 序列化
                try { value = JSON.stringify(value); } catch(e) {}
                result = localStorage.setItem( _this._dbInfo.keyPrefix+key, value );
                promise.resolve(result);
            } catch(e) {
                result = null;
                if(e.name === 'QuotaExceededError' ||
                    e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
                    promise.reject(e);
                    return;
                }
                promise.reject(e);
            }
        }).call(this);

        excuteCallback(promise, callback);

        return promise;
    }

    // example: [{key: '1', value: 'apple'}, {key: '2', value: 'banana'}]
    function setItemList(kvList, callback) {
        var promise = $.Deferred();
        (function () {
            var _this = this;
            var result = {};

            kvList.forEach(function (kv, i) {
                var value;
                if( typeof kv.key !== 'string' ) {
                    console.warn('The key is not a string!');
                    kv.key = String(kv.key);
                }
                try {
                    // json 序列化
                    try { value = JSON.stringify(kv.value); } catch(e) { value = kv.value; }
                    result[kv.key] = localStorage.setItem( _this._dbInfo.keyPrefix+kv.key, value );
                } catch(e) {
                    console.warn('occur error when set data into storage [key: "'+kv.key+'", value: "'+kv.value+'"]');              
                    result[kv.key] = null;
                    // 缓存溢出
                    if(e.name === 'QuotaExceededError' ||
                        e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
                        promise.reject(e);
                        return;
                    }
                }
            });
            promise.resolve();

        }).call(this);

        excuteCallback(promise, callback);

        return promise;
    }

    function removeItem(key, callback) {

        if( typeof key !== 'string' ) {
            console.warn('The key is not a string!');
            key = String(key);
        }

        var promise = $.Deferred();
        try {
            (function () {
                localStorage.removeItem(this._dbInfo.keyPrefix + key);
                promise.resolve();
            }).call(this);
        } catch(e) {
            promise.reject(e);
        }

        excuteCallback(promise, callback);
        return promise;
    }

    function removeItemList(keyList, callback) {
        var promise = $.Deferred();

        try {
            (function () {
                var _this = this;
                keyList.forEach(function (key, i) {
                    if( typeof key !== 'string' ) {
                        console.warn('The key is not a string!');
                        key = String(key);
                    }
                    localStorage.removeItem(_this._dbInfo.keyPrefix + key);
                });
                promise.resolve();
            }).call(this);
        } catch(e) {
            promise.reject(e);
        }

        excuteCallback(promise, callback);
        return promise;
    }

    function clear(callback) {
        var _this = this;
        var promise = $.Deferred();

        try {
            (function () {
            var keyPrefix = this._dbInfo.keyPrefix;
                var key;
                
                for (var i = localStorage.length-1; i >= 0; i--) {
                    key = localStorage.key(i);
                    if( key.indexOf(keyPrefix) === 0 ) {
                        localStorage.removeItem(key);
                    }
                }
                promise.resolve();
                
            }).call(this);
        } catch(e) {
            proimse.reject(e);
        }

        excuteCallback(promise, callback);

        return promise;
    }

    function key(n, callback) {
        var _this = this;

        var promise = $.Deferred();
        ( function () {
            var result;

            result = localStorage.key(n);
            if(result) {
                result = result.substring(_this._dbInfo.keyPrefix.length);
            }

            promise.resolve(result);
        } ).call(this);

        excuteCallback(promise, callback);

        return promise;
    }

    function keys(callback) {
        var _this = this;

        var promise = $.Deferred();
        ( function () {
            var keyPrefix = this._dbInfo.keyPrefix;
            var length = localStorage.length;
            var keys = [], key;

            for (var i = 0; i < length; i++) {
                key = localStorage.key(i);
                if( key.indexOf(keyPrefix) === 0 ) {
                    keys.push( key.substring(keyPrefix.length) );
                }
            }
            promise.resolve(keys);
        } ).call(this);

        excuteCallback(promise, callback);

        return promise;
    }

    function iterate(iterator, callback) {
        var _this = this;

        var promise = $.Deferred();
        try {
            (function () {
                var keyPrefix = this._dbInfo.keyPrefix;
                var key, value;
                var result;

               for (var i = localStorage.length-1; i >= 0; i--) {
                    key = localStorage.key(i);
                    if( key.indexOf(keyPrefix) === 0 ) {
                        value = localStorage.getItem(key);
                        // JSON 反序列化
                        try { value = JSON.parse(value); } catch(e) {}
                        result = iterator(key.substring(keyPrefix.length), value, i);
                    }
                    if(result === false) {
                        break;
                    }
                }
                promise.resolve();
            }).call(this);
        } catch(e) {
            promise.reject(e);
        }

        excuteCallback(promise, callback);
        return promise;
    }

    function excuteCallback(promise, callback) {
        if( typeof callback === 'function' ) {
            promise.then( function (result) {
                callback(null, result);
            }, function (error) {
                callback(erro);
            } );
        }
    }

    var localStorageWrapper = {
        _driver: 'localStorageWrapper',
        _initStorage: _initStorage,
        length: length,
        getItem: getItem,
        getItemList: getItemList,
        setItem: setItem,
        setItemList: setItemList,
        removeItem: removeItem,
        removeItemList: removeItemList,
        clear: clear,
        key: key,
        keys: keys,
        iterate: iterate
    };

    this.Beop = this.Beop || {};
    this.Beop.cache = this.Beop.cache || {};
    this.Beop.cache.drivers = this.Beop.cache.drivers || {};

    this.Beop.cache.drivers.localStorage = localStorageWrapper;

}).call(this, jQuery);
(function ($) {

    function BaseCache(options) {
        this.options = $.extend({}, DEFAULTS, options);
        
        this.storage = Object.create(Beop.cache.drivers[this.options.driver]);

        this.init();
    }

    BaseCache.prototype.init = function () {
        // TODO 浏览器兼容性检测和处理代码
        
        this.storage._initStorage(this.options);
    };

    BaseCache.prototype.length = function () {
        return this.storage.length();
    };

    BaseCache.prototype.key = function (n, callback) {
        return this.storage.key(n, callback);
    };

    BaseCache.prototype.keys = function (callback) {
        return this.storage.keys(callback);
    };

    BaseCache.prototype.getItem = function (key, callback) {
        return this.storage.getItem(key, callback);
    };

    BaseCache.prototype.getItemList = function (keyList, callback) {
        return this.storage.getItemList(keyList, callback);
    };

    BaseCache.prototype.setItem = function (key, value, callback) {
        return this.storage.setItem(key, value, callback);
    };

    BaseCache.prototype.setItemList = function (kvList, callback) {
        return this.storage.setItemList(kvList, callback);
    };

    BaseCache.prototype.removeItem = function (key, callback) {
        return this.storage.removeItem(key, callback);
    };

    BaseCache.prototype.removeItemList = function (keyList, callback) {
        return this.storage.removeItemList(keyList, callback);
    };

    BaseCache.prototype.clear = function (callback) {
        return this.storage.clear(callback);
    };

    BaseCache.prototype.iterate = function (iterator, callback) {
        return this.storage.iterate(iterator, callback);
    };

    var DEFAULTS = {
        // 默认使用 localStorage
        dbType: 'localStorage',
        name: 'beopcache',
        version: 3
    };

    /////////////
    // exports //
    /////////////
    this.Beop = this.Beop || {};
    this.Beop.cache = this.Beop.cache || {};

    this.Beop.cache.BaseCache = BaseCache;
}).call(this, jQuery);
/**
 * Created by win7 on 2015/7/21.
 */
    //绑定事件函数封装有2种形式
    //1.EventAdapter.on()/EventAdapter.off()
    //2.$(dom).eventOn()/$(dom).eventOff();
    //具体参数设置见以下内容

var EventAdapter = (function() {
    var eventData, eventStatus;

    function EventAdapter($) {
    }

    //兼容性事件绑定
    EventAdapter.on = function () {
        var eventTarget, eventType, eventFunction, eventSelector, eventHmt, finalFunction;
        if (arguments.length < 3 || arguments.length > 5) {
            console.log('EventAdapter.on arguments.length error');
            return;
        }
        //判断参数类型，有两个类型
        //1.（事件对象，   事件种类，事件执行函数，站长统计推送消息（可选））/
        //   (Dom Object, str,     Function，   array/str)
        //2.（事件对象，   事件种类，事件委托选择器，事件执行函数，站长统计推送消息（可选））/
        //   (Dom Object, str,     str,          Function，    array/str)
        /////////////////////////////////////////////////////////////////
        //站长统计推送消息（可选）参数设置
        //1.false/undefined/null
        //默认状态不推送统计消息
        //2.true
        //推送默认统计消息，默认推送消息信息优先级如下：
        //(1).id
        //(2).i18n
        //(3).title
        //3.string
        //可输入任意字符串或者输入，如果字符串为‘id’，‘title’等值，会尝试获取对象的这些属性值，如果获取不到，则返回这个字符串
        //如果输入字符串为‘text’，则会尝试获取对象的innerText
        //4.function
        //可输入任意函数，如
        // function(e){
        //    return $(e.currentTarget).attr(value)可以推送对象的value信息
        //}
        //5.数组
        //数组至少包含一个元素，数组第一个元素将作为粗略分类依据推送。
        //如果有的话，后面的几个元素将用‘-’相连，作为精确分裂依据推送。
        //数组元素种类和以上非数组参数种类相似
        //如['navBar']将把触发的事件标记为navBar推送
        //对于一个元素<div id='test',value="12345">南京熊猫<span>KPI统计</span></div>
        //如果绑定方式如下的话：
        //EventAdapter.on($('#test'),'click',['projSel','btnProjSel',‘南京熊猫’,'value','function(e){return $(e.currentTarget).find('span').text()}'])
        //每次点击事件后将推送信息为
        //粗分类标签：projSel
        //细分类标签：btnProjSel-南京熊猫-12345-KPI统计
        //如输出参数非以上任何一种，则和true的情况一致
        //为了一个好的分类效果，请将粗分类设置为对象所属种类，比如说ds表示数据源数据点，或者是navBar表示导航条
        //而细分类需要包裹对象进行时的project信息以及对象id等等。
        if (typeof arguments[0] != 'object') {
            console.log('EventAdapter.on arguments[0] type error');
            return;
        } else {
            //原生对象和JQ对象兼容
            if (!(arguments[0] instanceof jQuery)) {
                eventTarget = jQuery(arguments[0]);
            } else {
                eventTarget = arguments[0];
            }

        }
        if (typeof arguments[1] != 'string') {
            console.log('EventAdapter.on arguments[1] type error');
            return;
        } else {
            eventType = arguments[1];
        }
        if (typeof arguments[2] == 'function') {
            eventFunction = arguments[2];
            eventSelector = null;
            eventHmt = arguments[3]
        } else if (typeof arguments[2] == 'string') {
            if (arguments[3] && typeof arguments[3] == 'function') {
                eventSelector = arguments[2];
                eventFunction = arguments[3];
                eventHmt = arguments[4]
            } else {
                console.log('EventAdapter.on arguments[2 or 3] type error');
                return;
            }
        }
        //站长统计绑定
        finalFunction = function(e){
            if (!(eventHmt === false)) {
                EventAdapter.analyse(e,eventType, eventHmt);
            }
            eventFunction.call(this,e);
        };
        //兼容性绑定事件
        if (!AppConfig.isMobile) {
            eventTarget.on(eventType, eventSelector, finalFunction)
        } else {
            switch (eventType) {
                case 'click':
                    eventTarget.on('touchstart', eventSelector, finalFunction);
                    break;
                case 'dragstart':
                    eventTarget.on('touchstart',eventSelector,function(e){mobileDragStart.call(this,e,eventTarget,finalFunction)});
                    break;
                case 'dragover' :
                    $(document).on('touchmove.drag',eventSelector,function(e){mobileDragOver.call(this,e,eventTarget,finalFunction)});
                    break;
                case 'dragleave' :
                    $(document).on('touchmove.drag',eventSelector,function(e){mobileDragLeave.call(this,e,eventTarget,finalFunction)});
                    break;
                //case 'dragend' :
                //    mobileDragEnd(eventTarget,eventFunction);
                //    break;
                case 'drop' :
                    $(document).on('touchend.drop',eventSelector,function(e){mobileDrop.call(this,e,eventTarget,finalFunction)});
                    break;
                default :
                    eventTarget.on(eventType, eventSelector, finalFunction);
                    break;
            }
        }
        return eventTarget;
    };
    //兼容性事件解绑
    EventAdapter.off = function () {
        //参数类型
        //1.(事件对象，事件种类)/(Dom object,str)
        //2.(事件对象，事件种类，事件委托选择器)/(Dom object,str,str)
        //3.(事件对象)/(Dom Object)
        if ((arguments.length > 3 || arguments.length < 1) || (arguments[0] && typeof arguments[1] != 'string')) {
            console.log('EventAdapter.off arguments error');
            return;
        }
        var eventTarget, eventType, eventSelector;
        //原生对象和JQ对象兼容
        if (!(arguments[0] instanceof jQuery)) {
            eventTarget = jQuery(arguments[0]);
        } else {
            eventTarget = arguments[0];
        }
        if (arguments.length == 1) {
            eventTarget.off();
            return eventTarget;
        }
        if (typeof arguments[1] == 'string') {
            eventType = arguments[1]
        } else {
            console.log('EventAdapter.off eventType Error');
            return
        }
        if (typeof arguments[2] == 'string') {
            eventSelector = arguments[2];
        } else {
            eventSelector = null;
        }
        if (!AppConfig.isMobile) {
            eventTarget.off(eventType, eventSelector)
        } else {
            switch (eventType) {
                case 'click' :
                    eventTarget.off('touchstart', eventSelector);
                    break;
                case 'dragstart':
                    eventTarget.draggable('destroy');
                    break;
                case 'dragover':
                    eventTarget.droppable('destroy');
                    break;
                case 'dragleave':
                    eventTarget.droppable('destroy');
                    break;
                case 'drop':
                    eventTarget.droppable('destroy');
                    break;
                default:
                    eventTarget.off(eventType, eventSelector);
                    break;
            }
        }
        return eventTarget;
    };
    //jQuery 拓展方式事件绑定
    $.fn.extend({
        //兼容性绑定事件
        'eventOn': function () {
            var eventTarget, eventType, eventFunction, eventSelector,eventHmt,finalFunction;
            if (arguments.length < 2 || arguments.length > 4) {
                console.log('EventAdapter.on arguments.length error');
                return;
            }
            //判断参数类型，有两个类型
            //1.（事件种类，事件执行函数，站长统计推送消息（可选））/
            //   (str,     Function，   array/str)
            //2.（事件种类，事件委托选择器，事件执行函数，站长统计推送消息（可选））/
            //   (str,     str,           Function，  array/str)
            /////////////////////////////////////////////////////////////////
            //站长统计推送消息（可选）参数设置
            //1.false/undefined/null
            //默认状态不推送统计消息
            //2.true
            //推送默认统计消息，默认推送消息信息优先级如下：
            //(1).id
            //(2).i18n
            //(3).title
            //3.string
            //可输入任意字符串或者输入，如果字符串为‘id’，‘title’等值，会尝试获取对象的这些属性值，如果获取不到，则返回这个字符串
            //如果输入字符串为‘text’，则会尝试获取对象的innerText
            //4.function
            //可输入任意函数，如
            // function(e){
            //    return $(e.currentTarget).attr(value)可以推送对象的value信息
            //}
            //5.数组
            //数组至少包含一个元素，数组第一个元素将作为粗略分类依据推送。
            //如果有的话，后面的几个元素将用‘-’相连，作为精确分裂依据推送。
            //数组元素种类和以上非数组参数种类相似
            //如['navBar']将把触发的事件标记为navBar推送
            //对于一个元素<div id='test',value="12345">南京熊猫<span>KPI统计</span></div>
            //如果绑定方式如下的话：
            //$('#test').on('click',['projSel','btnProjSel',‘南京熊猫’,'value','function(e){return $(e.currentTarget).find('span').text()}'])
            //每次点击事件后将推送信息为
            //粗分类标签：projSel
            //细分类标签：btnProjSel-南京熊猫-12345-KPI统计
            //如输出参数非以上任何一种，则和true的情况一致
            //为了一个好的分类效果，请将粗分类设置为对象所属种类，比如说ds表示数据源数据点，或者是navBar表示导航条
            //而细分类需要包裹对象进行时的project信息以及对象id等等。
            if (typeof this != 'object') {
                console.log('EventAdapter.on arguments[0] type error');
                return;
            } else {
                //原生对象和JQ对象兼容
                if (!(this instanceof jQuery)) {
                    eventTarget = jQuery(arguments[0]);
                } else {
                    eventTarget = this;
                }

            }
            if (typeof arguments[0] != 'string') {
                console.log('EventAdapter.on arguments[1] type error');
                return;
            } else {
                eventType = arguments[0];
            }
            if (typeof arguments[1] == 'function') {
                eventFunction = arguments[1];
                eventSelector = null;
                eventHmt = arguments[2]
            } else if (typeof arguments[1] == 'string') {
                if (arguments[2] && typeof arguments[2] == 'function') {
                    eventSelector = arguments[1];
                    eventFunction = arguments[2];
                    eventHmt = arguments[3]
                } else {
                    console.log('EventAdapter.on arguments[2 or 3] type error');
                    return;
                }
            }
            finalFunction = function(e){
                if (!(eventHmt === false)) {
                    EventAdapter.analyse(e, eventType,eventHmt);
                }
                eventFunction.call(this,e);
            };
            //兼容性绑定事件
            if (!AppConfig.isMobile) {
                eventTarget.on(eventType, eventSelector, finalFunction)
            } else {
                switch (eventType) {
                    case 'click':
                        eventTarget.on('touchstart', eventSelector, finalFunction);
                        break;
                    case 'dragstart':
                        mobileDragStart(eventTarget, eventSelector, finalFunction);
                        break;
                    case 'dragover' :
                        mobileDragOver(eventTarget, eventSelector, finalFunction);
                        break;
                    case 'dragleave' :
                        mobileDragLeave(eventTarget, eventSelector, finalFunction);
                        break;
                    //case 'dragend' :
                    //    mobileDragEnd(eventTarget,eventFunction);
                    //    break;
                    case 'drop' :
                        mobileDrop(eventTarget, eventSelector, finalFunction);
                        break;
                    default :
                        eventTarget.on(eventType, eventSelector, finalFunction);
                        break;
                }
            }
            return eventTarget;
        },
        //兼容性解绑事件
        'eventOff': function () {
            //参数类型
            //1.(事件对象，事件种类)/(Dom object,str)
            //2.(事件对象，事件种类，事件委托选择器)/(Dom object,str,str)
            //3.无参数
            if ((arguments.length > 2) || (arguments[0] && typeof arguments[0] != 'string')) {
                console.log('EventAdapter.off arguments error');
                return;
            }
            var eventTarget, eventType, eventSelector;
            //原生对象和JQ对象兼容
            if (!(this instanceof jQuery)) {
                eventTarget = jQuery(this);
            } else {
                eventTarget = this;
            }
            if (arguments.length == 0) {
                eventTarget.off();
                return eventTarget;
            }
            if (typeof arguments[0] == 'string') {
                eventType = arguments[0];
            } else {
                console.log('EventAdapter.off eventType Error');
                return
            }
            if (typeof arguments[1] == 'string') {
                eventSelector = arguments[1];
            } else {
                eventSelector = null;
            }
            if (!AppConfig.isMobile) {
                eventTarget.off(eventType, eventSelector)
            } else {
                switch (eventType) {
                    case 'click' :
                        eventTarget.off('touchstart', eventSelector,mobileDragStart);
                        break;
                    case 'dragstart':
                        eventTarget.draggable('destroy');
                        break;
                    case 'dragover':
                        eventTarget.droppable('destroy');
                        break;
                    case 'dragleave':
                        eventTarget.droppable('destroy');
                        break;
                    case 'drop':
                        eventTarget.droppable('destroy');
                        break;
                    default:
                        eventTarget.off(eventType, eventSelector);
                        break;
                }
            }
            return eventTarget;
        }

    });

    //drag事件参数保存
    EventAdapter.setData = function (date) {
        if (date == undefined)return;
        eventData = date;
    };
    //drag事件参数获取
    EventAdapter.getData = function () {
        return eventData;
    };
    //drop事件发生后自动清空传递数据
    document.addEventListener('drop', function () {
        eventData = null;
    }, false);

    document.addEventListener('touchend', function () {
        eventData = null;
    }, false);
    //清除drag事件以免内存溢出
    EventAdapter.clearEvent = function(){
        $(document).off('touchmove.copy');
        $(document).off('touchmove.drag');
        $(document).off('touchend.drop');
    };
    //各事件触发次数站长统计
    EventAdapter.analyse = function (e,eventType, hmtInfo) {
        var mainInfo = '', initArrTag , finalArrTag, tag, unitTag;
        var target = $(e.currentTarget);

        if (hmtInfo instanceof Array && hmtInfo[0]){
            mainInfo = judgeWay(hmtInfo[0]);
            initArrTag = hmtInfo.filter(function(ele,index){
                return index > 0 && ele != '';
            });
            finalArrTag = [];
            for (var i = 0 ; i < initArrTag.length;i++){
                unitTag = judgeWay(initArrTag[i]);
                if (unitTag == '' )continue;
                finalArrTag.push(unitTag)
            }
            tag = finalArrTag.join('-');
        }else {
            if(typeof hmtInfo == 'string') {
                mainInfo = hmtInfo;
            }else{
                mainInfo = getInfo(target);
            }
            mainInfo = mainInfo ? mainInfo : '';
            tag = mainInfo;
        }
        _hmt.push(['_trackEvent', mainInfo.substr(0,30), eventType, tag.substr(0,100)]);
        //console.log('mainInfo:'+mainInfo);
        //console.log('tag:'+tag);
        function getInfo(tar){
            if (tar.length == 0)return;
            var tarInfo;
            if (tar.attr('id')){
                tarInfo = tar.attr('id');
            }else if (tar.attr('i18n')){
                tarInfo = tar.attr('i18n');
            }else if(tar.attr('title')){
                tarInfo = tar.attr('title');
            }else{
                tarInfo = tar[0].innerText.replace(/^\s\s*/, '').replace(/\s\s*$/, '').substr(0,30);
            }
            return tarInfo;
        }
        function judgeWay(arg){
            if (typeof arg == 'undefined'){
                return '';
            }
            if (arg instanceof Function){
                return arg.call(this,e)
            }else if(typeof arg == 'string'){
                if(arg == 'text'){
                    return e.currentTarget.innerText.replace(/^\s\s*/, '').replace(/\s\s*$/, '').substr(0,30)
                }else{
                    return $(e.currentTarget).attr(arg)?$(e.currentTarget).attr(arg):arg;
                }
            }else if(typeof arg == 'number'){
                return arg;
            }
        }
    };

    ////移动端事件绑定
    //var mobileDragStart = function(source,eventSelector,eventFunction){
    //    //事件委托判断
    //    var handle = eventSelector?$(eventSelector):false;
    //    var mouseLeft = source[0].offsetWidth / 2;
    //    var mouseTop = source[0].offsetHeight / 2;
    //    source.draggable({
    //        start:eventFunction,
    //        addClasses:false,
    //        helper:'clone',
    //        appendTo:'body',
    //        zIndex:210000,
    //        revert:true,
    //        opacity:0.5,
    //        cursorAt: {
    //            left: mouseLeft,
    //            top: mouseTop
    //        },
    //        handle:handle
    //    })
    //};
    //
    //var mobileDragOver = function(target,eventSelector,eventFunction){
    //    target.droppable({
    //        over:eventFunction
    //    })
    //};
    //
    //var mobileDragLeave = function(target,eventSelector,eventFunction){
    //    target.droppable({
    //        out:eventFunction
    //    })
    //};
    //
    //var mobileDrop = function(target,eventSelector,eventFunction){
    //    target.droppable({
    //        greedy:true,
    //        drop:eventFunction
    //    });
    //    eventData = null;
    //};
    var mobileDragStart = function(e,target,eventFunction){
        //e.preventDefault();
        var originalTarget = $(e.target).closest('[draggable="true"]')[0];
        var ev = e.type == 'touchstart' ? e.originalEvent.touches[0] : e,
        startPos = {
            left: $(originalTarget).css('left'),
            top: $(originalTarget).css('top'),
            zIndex: $(originalTarget).css('z-index')
        },
        disX = originalTarget.offsetWidth / 2,
        disY = originalTarget.offsetHeight / 2;
        var $copyTarget = $(originalTarget).clone();
        $copyTarget.data('startPos', startPos);
        $copyTarget.css('z-index',10000);
        $copyTarget.css('position','absolute');
        $copyTarget.css('opacity','0.5');
        $copyTarget.css('pointer-events','none');
        var $container = $('body');
        $container.append($copyTarget);
        var sPos = $(originalTarget)[0].getBoundingClientRect();
        $copyTarget.css('left',sPos.left - $container[0].offsetLeft + 'px');
        $copyTarget.css('top',sPos.top - $container[0].offsetTop + 'px');
        $copyTarget[0].cssText = originalTarget.cssText;
        $copyTarget.css('width',originalTarget.offsetWidth);
        $copyTarget.css('height',originalTarget.offsetHeight);
        //originalTarget.parentNode.appendChild($copyTarget[0]);
        eventStatus = 'dragStart';
        eventFunction.call(this, ev);
        $(document).off('touchend.copy').on('touchend.copy',function(e){
            $copyTarget.remove();
            eventStatus = 'dragEnd';
        });
        $(document).on('touchmove.copy',function(e) {
            //e.preventDefault();
            eventStatus = 'dragMove';
            var ev = e.type == 'touchmove' ? e.originalEvent.touches[0] : e;
            var $parent = $copyTarget.offsetParent();
            $parent = $parent.is(':root') ? $(window) : $parent;
            //var pPos = $parent.offset();
            //pPos = pPos ? pPos:{left:0,top:0};
            var targetLeft = ev.pageX - disX;
            var targetTop = ev.pageY - disY;
            //r = $parent.width() - $this.outerWidth(true);
            //d = $parent.height() - $this.outerHeight(true);

            //targetLeft = targetLeft < 0 ? 0 : targetLeft > r ? r : targetLeft;
            //targetTop = targetTop < 0 ? 0 : targetTop > d ? d : targetTop;

            $copyTarget.css({
                left: targetLeft + 'px',
                top: targetTop + 'px',
                'z-index': 10000
            });
        })

    };

    var mobileDragOver = function(e,target,eventFunction){
        if (eventStatus !='dragMove' && eventStatus !='dragMoveIn' && eventStatus !='dragMoveOut') return;
        var ev = e.type == 'touchmove' ? e.originalEvent.touches[0] : e;
        var targetWidth,targetHeight;
        for (var i = 0; i < target.length; i++) {
            targetWidth = target[i].offsetWidth;
            targetHeight = target[i].offsetHeight;
            if ((target.eq(i).offset().left < ev.pageX && target.eq(i).offset().left + targetWidth > ev.pageX) && (target.eq(i).offset().top < ev.pageY && target.eq(i).offset().top + targetHeight > ev.pageY)) {
                e.target = target[i];
                e.currentTarget = target[i];
                eventStatus ='dragMoveIn';
                eventFunction.call(this, e);
                break;
            }
        }
    };

    var mobileDragLeave = function(e,target,eventFunction){
        if (eventStatus !='dragMoveIn') return;
        var ev = e.type == 'touchmove' ? e.originalEvent.touches[0] : e;
        var targetWidth,targetHeight;
        for (var i = 0; i < target.length; i++) {
            targetWidth = target[i].offsetWidth;
            targetHeight = target[i].offsetHeight;
            if (!((target.eq(i).offset().left < ev.pageX && target.eq(i).offset().left + targetWidth > ev.pageX) && (target.eq(i).offset().top < ev.pageY && target.eq(i).offset().top + targetHeight > ev.pageY))) {
                e.target = target[i];
                e.currentTarget = target[i];
                eventStatus ='dragMoveOut';
                eventFunction.call(this, e);
            }
        }
    };

    var mobileDragEnd = function(e,target,eventFunction){
        eventFunction.call(this, e);
    };

    var mobileDrop = function(e,target,eventFunction){
        if (eventStatus !='dragMove' && eventStatus !='dragMoveIn')return;
        //e.stopImmediatePropagation();
        //var ev = e.originalEvent.changedTouches[0];
        var ev = e.type == 'touchend' ? e.originalEvent.changedTouches[0] : e;
        var eventTarget = target;
        var targetWidth,targetHeight;
        for (var i = 0; i < target.length; i++) {
            targetWidth = target[i].offsetWidth;
            targetHeight = target[i].offsetHeight;
            if ((target.eq(i).offset().left < ev.pageX && target.eq(i).offset().left + targetWidth > ev.pageX) && (target.eq(i).offset().top < ev.pageY && target.eq(i).offset().top + targetHeight > ev.pageY)) {
                e.target = target[i];
                e.currentTarget = target[i];
                eventFunction.call(this, e);
                break;
            }
        }
    };
    //var mobileDropLocate = function(e,target,eventFunction){
    //    dropTarget = e.originalEvent.relatedTarget;
    //};

    return EventAdapter;
})(jQuery);
﻿/// <reference path="../lib/jquery-2.1.4.js" />

var Internationalization = (function () {
    function Internationalization(lang, resource) {
        this.type = lang || localStorage["language"];
        this.resource = resource || {};
    }

    Internationalization.prototype = {
        getResource: function () {
            return this.resource;
        },

        //Internationalizate whole page
        fillPage: function () {
            this.fill2($('[i18n]'));
        },

        //Internationalizate the children of this special 'JQuery element'
        fillArea: function (element) {
            //this.fill(element.find('[i18n]'));原来i18n方法
            this.fill2(element.find('[i18n]'));
            try {
                Permission.check(element);
            } catch (e) {
                console.log('check permission failed:' + e);
            }
        },

        fillAreaAttribute: function (element, attributeName) {
            this.fill(element.find('[i18n][' + attributeName + ']'), attributeName);
        },

        fill: function (arrElement, attributeName) {
            for (var i = 0, arrPath, text, len = arrElement.length; i < len; i++) {
                arrPath = arrElement[i].attributes["i18n"].value.split('.');

                text = this.resource;
                for (var j = 0; j < arrPath.length; j++) {
                    text = text && text[arrPath[j]];
                }

                if (!attributeName) {
                    arrElement[i].innerHTML = text;
                }
                else {
                    arrElement[i].setAttribute(attributeName, text);
                }
            }
        },
        getI18nValue: function (i18nKey) {
            if (!i18nKey) {
                return '';
            }
            var arrPath = i18nKey.split('.');

            var text = this.resource;
            for (var j = 0; j < arrPath.length; j++) {
                text = text && text[arrPath[j]];
            }
            return text;
        },

        fill2: function (arrElement) {
            for (var i = 0, len = arrElement.length; i < len; i++) {
                var i18nValue = arrElement[i].attributes["i18n"];
                var items = i18nValue.value.split(';'), item, attrMap;
                for (var j = 0; j < items.length; j++) {
                    item = items[j];
                    if (!item) {
                        continue;
                    }
                    if (item.indexOf('=') === -1) {
                        i18nValue = this.getI18nValue(item);
                        arrElement[i].innerHTML = i18nValue;
                    } else {
                        attrMap = item.split('=');
                        if (!attrMap[0]) {
                            continue;
                        }
                        arrElement[i].setAttribute(attrMap[0], this.getI18nValue(attrMap[1]));
                    }
                }
            }
        },

        //params: strPath: ex, observerScreen.menu.NAV_OBSERVER_TITLE. return: value
        findContent: function (strPath) {
            var arrPath = strPath.split('.');
            var text = this.resource;
            for (var i = 0, len = arrPath.length; i < len; i++) {
                text = text && text[arrPath[i]];
            }
            return text;
        }
    };

    return Internationalization;
})();

//load language
function InitI18nResource(strLanguage, isForce, filePath) {
    if (!strLanguage) {
        strLanguage = localStorage["isUserSelectedLanguage"] || navigator.language.split('-')[0];
    }
    if (isForce) {
        localStorage["isUserSelectedLanguage"] = strLanguage;
    } else if (localStorage["isUserSelectedLanguage"]) {
        strLanguage = localStorage["isUserSelectedLanguage"];
    }
    // 默认为主网页的 i18n 路径
    filePath = filePath || '/static/views/js/i18n/';
    return $.ajax({
        async: false,
        url: filePath + strLanguage + ".js",
        dataType: "script"
    }).then(function () {
        // 加载成功，将数据递出
        localStorage["language"] = strLanguage;
        return i18n_resource;
    }, function () {
        // 加载失败，则再去请求一次 en.js
        return $.ajax({
            async: false,
            url: filePath + "en.js",
            dataType: 'script'
        }).then(function () {
            localStorage["language"] = "en";
            return i18n_resource;
        }, function () {
            // 再失败，直接返回 {}
            console.warn('i18n files loading failed!');
            return {};
        });
    });
}

/// <reference path="../lib/jquery-2.1.4.min.js" />

var ElScreenContainer = document.getElementById('indexMain');  //所有子模块的共用容器
var SpinnerContainer = document.getElementById('divSpinner');  //Spinner容器
var AlertContainer = document.getElementById('divAlert');      //Alert容器
var ScreenCurrent = undefined;                                 //当前页面对象的引用
var ScreenPrevious = undefined;                                //前一页面对象的引用
var Spinner = new LoadingSpinner({ color: '#00FFFF' });        //等待加载时的转圈圈
//var navigation = responsiveNav("#navbar-collapse");          //响应式导航条
var AppConfig = {
    userId: undefined,
    account: undefined,
    isMobile: true,
    projectId:72
}; //基础配置文件
var userAll = undefined;
var pathAll = undefined;
var missionAll = undefined;
var pointAll = undefined;
var curSet = {
    patrolIndex:-1
};
var patrolLog = [];
var I18n = undefined;                                          //国际化对象的引用
var BomConfig = {
};
var router;
var dataManager = undefined;
// 项目配置信息持久化存储管理
var appConfigManager = (function () {

    var DEFAULT_CONFIG = {
        // 默认 gps 为关闭状态
        gps: 0
        // ...
    };

    function get() {
        var options = window.localStorage.getItem('appConfig');

        if(options === null) {
            set(DEFAULT_CONFIG);
            return DEFAULT_CONFIG;
        }

        try { options = JSON.parse(options); } catch(e) {}

        return options;
    }

    function set(options) {
        window.localStorage.setItem( 'appConfig', JSON.stringify(options) );
    }

    return {
        get: get,
        set: set
    }

} ());

$(document).ready(function () {
    if (navigator.userAgent.match(/iP(ad|hone|od)|Android/i)) AppConfig.isMobile = true;

    InitI18nResource(navigator.language.split('-')[0]).always(function (rs) {
        I18n = new Internationalization(null, rs);
        dataManager = new DataManager();
        Init();
    });
});
document.addEventListener('deviceready',onDeviceReady,false);
function onDeviceReady() {
    AppConfig.device = device;
    document.addEventListener("backbutton", router.back, false);
    dataManager = new DataManager();
}

var IndexScreen = (function () {
    function IndexScreen() {}

    IndexScreen.prototype = {
        show: function () {
            var _this = this;
            if(localStorage.getItem('beopHost')){
                AppConfig.host = localStorage.getItem('beopHost')
            }else {
                AppConfig.host = 'http://beop.rnbtech.com.hk'
            }
            if(!BomConfig.height) {
                BomConfig.height = $(window).height();
            }
            _this.init();
        },

        close: function () {
            //remove key down event in login page
            document.onkeydown = false;
        },

        init: function () {
            var _this = this;
            $(ElScreenContainer).css({
                'height':'100%',
                'top':0
            });
            CssAdapter.adapter();
            _this.initNav();
            _this.initLanguage();
            router.empty().to({
                typeClass:UserSelScreen,
                data:{}
            })
        },


        initLanguage: function () {
            I18n.fillArea($('#divAppDashboardLanguage'));
            I18n.fillArea($('#divLoginInfo'));
            $("#selectLanguage a").off('click').click(function (e) {
                InitI18nResource(e.currentTarget.attributes.value.value, true);
                e.preventDefault();
            });
        },

        //登录功能
        initHost:function(){
            $('#ImgLogin img').on('doubleTap',function(){
                var divSetHost = $('#divHostSet');
                var $divHostShow = $('.divHostShow');
                $divHostShow.text(AppConfig.host);
                divSetHost.show();
                divSetHost.find('li').not(':last').on('tap',function(e){
                    localStorage.setItem('beopHost',$(e.target).attr('value'));
                    AppConfig.host = $(e.target).attr('value');
                    $divHostShow.text($(e.target).attr('value'));
                });
                divSetHost.find('input').on('change',function(e){
                    localStorage.setItem('beopHost','http://' + $(e.target).val());
                    AppConfig.host = 'http://' + $(e.target).val();
                    $divHostShow.text('http://' + $(e.target).val());
                })
            })
        },
        initNav: function () {
            // 后退按钮
            $('#btnBack').off('tap').on('tap', function (e) {
                router.back();
            });
            // 工单系统
            $('#btnWorkFlow').off('tap').on('tap', function(e) {
                e.preventDefault();
                router.to({
                    typeClass:UpdateScreen
                });
            });
            //配置页面
            $('#btnAdminConfig').off('tap').on('tap', function(e) {
                e.preventDefault();
                router.to({
                    typeClass:AdminConfigure
                });
            });
        }
    };

    return IndexScreen;
})();

function Init(){
    //router.to({
    //    typeClass: IndexScreen,
    //    data: {}
    //});
    //I18n = new Internationalization();

    ScreenManager.show(IndexScreen);
    I18n.fillArea($("#navBottom"));
}

/**
 * Created by win7 on 2015/10/23.
 */
var toggle = (function(){
    var _this = this;
    function toggle(){
        _this = this;
    }

    //$(document).hammer().off('swipeleft','.carousel').on('swipeleft','.carousel',function(e){
    //    $(e.currentTarget).carousel('next');
    //});
    //$(document).hammer().off('swiperight','.carousel').on('swiperight','.carousel',function(e){
    //    $(e.currentTarget).carousel('prev');
    //});

    toggle.pageLeft = function(target,data){
        $(ElScreenContainer).off('swipeleft').on('swipeleft',function(e){
            router.to({
                typeClass:target,
                data:data
            })
        })
    };
    toggle.pageRight=function(target,data){
        $(ElScreenContainer).off('swiperight').on('swiperight',function(e){
            router.to({
                typeClass:target,
                data:data
            })
        })
    };
    toggle.configLeft = function(target,func,data){
        $(ElScreenContainer).off('swipeleft.left').on('swipeleft.left',function(e){
            target.hide();
            if (func && typeof(func) == 'function'){
                func.call(this,data);
            }
        });
        $(ElScreenContainer).off('swiperight.left').on('swiperight.left',function(e){
            target.show();
            if (func && typeof(func) == 'function'){
                func.call(this,data);
            }
        })
    };
    toggle.configRight = function(target,func,data){
        $(ElScreenContainer).off('swiperight.right').on('swiperight.right',function(e){
            target.hide();
            if (func && typeof(func) == 'function'){
                func.call(this,data);
            }
        });
        $(ElScreenContainer).off('swipeleft.right').on('swipeleft.right',function(e){
            target.show();
            if (func && typeof(func) == 'function'){
                func.call(this,data);
            }
        })
    };
    toggle.configBottom = function(target,func,data){
        $(ElScreenContainer).off('swipedown.bottom').on('swipedown.bottom',function(e){
            target.hide();
            if (func && typeof(func) == 'function'){
                func.call(this,data);
            }
        });
        $(ElScreenContainer).off('swipeup.bottom').on('swipeup.bottom',function(e){
            target.show();
            if (func && typeof(func) == 'function'){
                func.call(this,data);
            }
        })
    };
    //var carouselHammer;
    toggle.carousel = function(container){
        //carouselHammer =  new Hammer(container[0]);
        //carouselHammer.get('swipe').set({ threshold:0,velocity:0});
        container.off('swipeLeft').on('swipeLeft',function(e){
            $(e.currentTarget).carousel('next');
        });
        container.off('swipeRight').on('swipeRight',function(e){
            $(e.currentTarget).carousel('prev');
        });
    };
    return toggle;
})();
/**
 * Created by win7 on 2015/10/28.
 */
//禁止弹出警告
(function(){
    window.alert = function(str){
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
var CssAdapter = (function(){
    var _this;
    var device;
    var css;
    function CssAdapter(){
        _this = this;
    }
    CssAdapter.adapter = function(){
        device='Nexus 5';
        switch (device) {
            case 'iPhone6s':
                css = {
                    'indexMainTop': 'calc(3.6% + 60px)',
                    'navTop':'44px',
                    'navStatus':'30px',
                    'navBottom': '49px'
                };
                break;
            case 'iPhone6':
            case 'iPhone5':
            case 'iPhone5s':
            case 'iPhone5c':
            case 'iPhone4':
            case 'iPhone4s':
                css = {
                    'indexMainTop': 'calc(3.6% + 40px)',
                    'navTop':'44px',
                    'navStatus':'20px',
                    'navBottom': '0'
                };
                break;
            default :
                css = {
                    'indexMainTop': '3.6rem',
                    'navTop':'44px',
                    'navBottom': '0',
                    'navStatus':'0px'
                };
                break;
        }
        //$(ElScreenContainer).css({
        //    'height':'calc(' + BomConfig.height +'px - ' + css.navStatus + ' - ' + css.navTop + ' - ' + css.navBottom + ')',
        //});
        $(ElScreenContainer).css({
            'height':'-webkit-calc(' + BomConfig.height +'px - ' + css.navStatus + ' - ' + css.navTop + ' - ' + css.navBottom + ')'
        });
        $('#navStatus').css({
            'height':css.navStatus
        });
        $('#navTop').css({
            'height':css.navTop
        });
        $('#topBlank').css({
            'height':css.navTop
        });
        $('#navBottom').css({
            'bottom':0,
            'height':css.navBottom
        });
        $('#bottomBlank').css({
            'height':css.navBottom
        });
        //$('#outerContainer').css({
        //    'height':'calc(' + BomConfig.height +'px - ' + css.navStatus +')'
        //});
        $('#outerContainer').css({
            'height':'-webkit-calc(' + BomConfig.height +'px - ' + css.navStatus +')'
        });
        //$('#indexContainer').css({
        //   'height':'auto'
        //});
        //$(ElScreenContainer).removeClass('homePage');
        //$(ElScreenContainer).css({
        //    'height':'calc('+ $(window).height() +'px - ' + css.navStatus + ' - ' + css.navTop + ' - '+ css.navBottom + ')'
        //});
        //$(ElScreenContainer).css({
        //    'padding-top': 'calc(' + css.navStatus + ' + ' + css.navTop+')',
        //    'padding-bottom':css.navBottom
        //});
        //$('#outerContainer').css({
        //    'height':'calc(' + $(window).height() +'px - ' + css.navStatus + ' - ' + css.navTop +')',
        //    'top':css.navStatus
        //});
        //$(SpinnerContainer).css({
        //    'top':'calc(' + css.navStatus +' + ' + css.navTop + ')',
        //    'height':'calc('+ BomConfig.height +'px - ' + css.navStatus + ' - ' + css.navTop + ' - '+ css.navBottom + ')'
        //});
        $(SpinnerContainer).css({
            'top':'-webkit-calc(' + css.navStatus +' + ' + css.navTop + ')',
            'height':'-webkit-calc('+ BomConfig.height +'px - ' + css.navStatus + ' - ' + css.navTop + ' - '+ css.navBottom + ')'
        });
        //$('#bottomBlank').css({
        //    'height':css.navBottom
        //});
        //$('#navTop').css({
        //    'top':css.navStatus
        //});
    };
    CssAdapter.addBlank = function(){
        $(ElScreenContainer).children().first().before('<div id="statusBlank"></div><div id="topBlank"></div>');
        $(ElScreenContainer).children().last().after('<div id="bottomBlank"></div>');
        $('#statusBlank').css({
            'height':css.navStatus
        });
        $('#topBlank').css({
            'height':css.navTop
        });
        $('#bottomBlank').css({
            'height':css.navBottom
        });
    };
    CssAdapter.setIndexMain = function(){
            //$(ElScreenContainer).css({
            //    'height':'calc(100% - ' + css.navBottom + ')'
            //});
            $(ElScreenContainer).css({
                'height':'-webkit-calc(100% - ' + css.navBottom + ')'
            })
        };
    CssAdapter.clearIndexMain = function() {
        $(ElScreenContainer).css({
            'height': 'inherit'
        })
    };
    CssAdapter.setOuterContainer = function(){
            //$('#outerContainer').css({
            //    'height':'calc('+ BomConfig.height +'px - ' + css.navStatus +')'
            //});
            $('#outerContainer').css({
                'height':'-webkit-calc('+ BomConfig.height +'px - ' + css.navStatus +')'
            })
        };
    CssAdapter.clearOuterContainer = function(){
        //$('#outerContainer').css({
        //    'height':'calc('+ BomConfig.height +'px - ' + css.navStatus + ' - ' + css.navTop  + ')'
        //});
        $('#outerContainer').css({
            'height':'-webkit-calc('+ BomConfig.height +'px - ' + css.navStatus + ' - ' + css.navTop  + ')'
        })
    };
    return CssAdapter;
})();
//加载动画适应
var SpinnerControl = (function(){
    var _this;
    function SpinnerControl(){
        _this = this;
    }
    SpinnerControl.show= function(){
        $(SpinnerContainer).show();
        Spinner.spin(SpinnerContainer);
    };
    SpinnerControl.hide = function(){
        $(SpinnerContainer).hide();
        Spinner.stop();
    };
    return SpinnerControl;
})();
//字符串处理
var StringUtil = (function () {
    var HTML_ENTITIES = {
        '&': '&amp;',
        '>': '&gt;',
        '<': '&lt;',
        '"': '&quot;',
        "'": '&#39;',
        '`': '&#x60;'
    }, HTML_ENTITIES_INVERT = invert(HTML_ENTITIES);

    function invert(obj) {
        var result = {}, keys = Object.keys(obj);
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
        return text.replace(replaceRegexp, function (character) {
            return HTML_ENTITIES[character];
        });
    }

    function htmlUnEscape(text) {
        if (!text) {
            return text
        }
        var source = '(?:' + Object.keys(HTML_ENTITIES_INVERT).join('|') + ')',
            replaceRegexp = RegExp(source, 'g');
        return text.replace(replaceRegexp, function (character) {
            return HTML_ENTITIES_INVERT[character];
        });
    }

    var getI18nProjectName = function (project) {
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
            default :
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
//缩放目录条
var IndexBar = function(){
    var _this;
    function IndexBar(arrIndex,option){
        _this = this;
        _this.dom = undefined;
        _this.arrIndex = arrIndex;
        _this.option = option;
    }
    IndexBar.prototype = {
        create:function(){
            var indexUl = document.createElement('div');
            indexUl.classList = ['index-ul'];
            indexUl.id = _this.option.id?_this.option.id:null;
            var serIndexLi;
            if (_this.arrIndex == 0){

            }else{
                indexUl.appendChild('<div class="index-control glyphicon glyphicon-menu-right"></div>')
            }
            for (var i = 0; i < _this.arrIndex.length; i++){
                serIndexLi = new StringBuilder();
                serIndexLi = '\
                <div class="index-li" id="link-' + _this.arrIndex[i].id + '">\
                    <a href="#' + _this.arrIndex[i].id + '"> ' + _this.arrIndex[i].name +'</a>\
                </div>';
                indexUl.innerHTML += serIndexLi.toString();
            }
            _this.option.container.appendChild(indexUl);
            _this.dom = indexUl;
            _this.initEvent();
        },
        initEvent:function(){
            $(_this.dom).find(' .index-control').off('tap').on('tap',function(e){
                if ($(e.target).hasClass('glyphicon-menu-right')){
                    $(e.target).removeClass('glyphicon-menu-right').addClass('glyphicon-menu-left');
                    _this.show();
                }else{
                    $(e.target).removeClass('glyphicon-menu-left').addClass('glyphicon-menu-right');
                    _this.hide();
                }
            })
        },
        show:function(){
            $(_this.dom).addClass('index-ev-show');
        },
        hide:function(){
            $(_this.dom).addClass('index-ev-hide');
        },
        destroy:function(){
            $(_this.dom).remove();
        }
    };
    return IndexBar;
};
//textarea高度自适应
// * 文本框根据输入内容自适应高度
// * @param                {HTMLElement}        输入框元素
// * @param                {Number}                设置光标与输入框保持的距离(默认0)
// * @param                {Number}                设置最大高度(可选)
// */
var autoTextarea = function (elem, extra, maxHeight) {
        extra = extra || 0;
        var isFirefox = !!document.getBoxObjectFor || 'mozInnerScreenX' in window,
        isOpera = !!window.opera && !!window.opera.toString().indexOf('Opera');
        var addEvent = function (type, callback) {
                        elem.addEventListener ?
                                elem.addEventListener(type, callback, false) :
                                elem.attachEvent('on' + type, callback);
                };
        var getStyle = elem.currentStyle ? function (name) {
                        var val = elem.currentStyle[name];

                        if (name === 'height' && val.search(/px/i) !== 1) {
                                var rect = elem.getBoundingClientRect();
                                return rect.bottom - rect.top -
                                        parseFloat(getStyle('paddingTop')) -
                                        parseFloat(getStyle('paddingBottom')) + 'px';
                        };

                        return val;
                } : function (name) {
                                return getComputedStyle(elem, null)[name];
                };
        var minHeight = parseFloat(getStyle('height'));
        //var minHeight = 22;
        elem.style.resize = 'none';

        var change = function () {
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
/**
 * Created by win7 on 2015/10/28.
 */
var Router = (function () {
    var _this;
    function Router(arrModule) {
        this.path = [];
        _this = this;
        _this.arrModule = arrModule
    }

    Router.prototype = {
        //android回退键绑定
        // 回退一个页面
        back:function () {
            if(_this.path.length <= 1 || _this.path[_this.path.length-1].typeClass.navOptions.backDisable){
                if(window.plugins) {
                    window.plugins.toast.show('再按一次退出程序', 'short', 'center');
                    document.removeEventListener("backbutton", _this.back, false);
                    var backInterval = window.setInterval(
                        function () {
                            window.clearInterval(backInterval);
                            document.addEventListener("backbutton", _this.back, false)
                        },
                        3000
                    );
                }
            }else {
                _this.path.pop();
                _this._display();
            }
            return _this;
        },
        // 前进一个页面
        to:function (pathNode) {
            _this.path.push(pathNode);
            _this._display();
            return _this;
        },
        empty:function () {
            _this.path.length = 0;
            return _this;
        },
        _display : function () {
            var node = _this.path[this.path.length-1];
            var typeClass = node.typeClass;
            var data = node.data;
            var $body = $('body');
            var $navTop = $('#navTop');
            var $navBottom = $('#navBottom');
            // 初始化 nav
            $body.removeClass('top-nav bottom-nav');
            $navTop.hide();
            $navBottom.hide();
            //$('.btn-back', '#navTop').hide();
            $navTop.children().not('#btnBack').remove();
            //放置导航条
            if(typeClass.navOptions) {
                if(typeClass.navOptions.bottom) {
                    // 显示底部 nav
                    $body.addClass('bottom-nav');
                    $navBottom.show();
                }
                if(typeClass.navOptions.top) {
                    // 显示顶部 nav
                    $body.addClass('top-nav');
                    //导航条工具按钮初始化
                    $navTop.append(typeClass.navOptions.top).show();
                }
            }

            // 如果当前路径不是第一级目录，显示"后退"按钮
            if(_this.path.length > 1 && !typeClass.navOptions.backDisable) {
                $body.addClass('top-nav');
                $navTop.removeClass('noBtnBack');
            }else{
                $navTop.addClass('noBtnBack');
            }
            //判断所属模块
            $('.bottomTool.selected').removeClass('selected');
            if(typeClass.navOptions && typeClass.navOptions.module) {
                $('.bottomTool path').attr('fill','#272636');
                if (_this.arrModule instanceof Array) {
                    for (var i = 0; i < _this.arrModule.length; i++) {
                        if (_this.arrModule[i].name == typeClass.navOptions.module) {
                            $('#' + _this.arrModule[i].btn).addClass('selected');
                            break;
                        }
                    }
                }
                $('.bottomTool.selected path').attr('fill','#272636')
            }
            // 解绑切换功能
            //$(ElScreenContainer).hammer().off('swipeleft swiperight');
            //载入控件隐藏
            $(SpinnerContainer).hide();
            //模态框内容清除
            $('#divModal').find('.modal-header').html('');
            $('#divModal').find('.modal-body').html('');
            // 显示页面内容
            ScreenManager.show(node.typeClass,data);
            
        }

    };
    return Router;
})();
router = new Router();
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
/**
 * Created by win7 on 2016/3/2.
 */
var UpdateScreen = (function(){
    var _this;
    function UpdateScreen(){
        _this = this
    }
    UpdateScreen.navOptions = {
        top:
        '<span class="topNavTitle">数据上传</span>',
        bottom: false,
        backDisable: true,
        module: 'project'
    };
    UpdateScreen.prototype = {
        show:function(){
            $.ajax({url:'static/app/PatrolApp/views/screen/updateScreen.html'}).done(function(resultHtml){
                ElScreenContainer.innerHTML = resultHtml;
                _this.init();
            })
        },
        init:function(){
            _this.initUpdate();
            _this.initStart();
        },
        initUpdate:function(){
            $('#btnUpdate').on('tap',function(){
                SpinnerControl.show();
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
                        }).always(function () {
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
                            if (patrolLogAjax[1] == 'success') {
                                if (window.plugins) {
                                    window.plugins.toast.show('上传数据成功', 'short', 'center');
                                }
                                curSet.patrolIndex = -1;
                                patrolLog = [];
                            } else {
                                if (window.plugins) {
                                    window.plugins.toast.show('上传数据失败', 'short', 'center');
                                }
                            }
                        }).always(function () {
                            SpinnerControl.hide();
                        })
                }
            })
        },
        initStart:function(){
            $('#btnStart').on('tap',function(){
                router.to({
                    typeClass:UserSelScreen,
                    data:{}
                })
            })
        },
        close:function(){

        }
    };
    return UpdateScreen;
})();
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
        '<span class="topNavTitle">选择账号</span>\
        <span id="btnUpdate" class="topNavRight zepto-ev glyphicon glyphicon-refresh"></span>',
        bottom: false,
        backDisable: false,
        module: 'project'
    };
    UserSelScreen.prototype = {
        show:function(){
            $.ajax({url:'static/app/PatrolApp/views/screen/userSelScreen.html'}).done(function(resultHtml){
                ElScreenContainer.innerHTML = resultHtml;
                dataManager.initPage(_this,_this.init);
                dataManager.update();
                dataManager.attachNetworkEvent(_this,_this.init);
                //dataManager.Deferred.done(function(){
                //    _this.init();
                //});
            })
        },
        init:function(){
            _this.initNav();
            curSet.patrolIndex = patrolLog.length - 1;
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
                dataManager.update(true);
                //dataManager.Deferred.done(function(){
                //    _this.init();
                //});
            })
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
            })
        },
        close:function(){
            dataManager.removeNetworkEvent();
            dataManager.clearPage();
        }
    };
    return UserSelScreen;
})();
/**
 * Created by win7 on 2016/3/2.
 */
var PathSelScreen = (function(){
    var _this;
    function PathSelScreen(data){
        _this = this;
    }
    PathSelScreen.navOptions = {
        top:
        '<span class="topNavTitle">选择路径</span>',
        bottom: false,
        backDisable: false,
        module: 'project'
    };
    PathSelScreen.prototype = {
        show:function(){
            $.ajax({url:'static/app/PatrolApp/views/screen/pathSelScreen.html'}).done(function(resultHtml){
                ElScreenContainer.innerHTML = resultHtml;
                _this.init();
            })
        },
        init:function(){
            if (typeof pathAll == 'undefined' || $.isEmptyObject(pathAll)){
                WebAPI.get('/patrol/path/getAll/' + AppConfig.projectId).done(function(result){
                    pathAll = result.data;
                    _this.getPoint();
                });
            }else{
                _this.getPoint();
            }
        },

        getMission:function(){
            if (typeof missionAll == 'undefined' || $.isEmptyObject(missionAll)) {
                WebAPI.get('/patrol/mission/get/' + AppConfig.projectId).done(function (result) {
                    missionAll = result.data;
                    _this.initPathList();
                    _this.initMission();
                    _this.initPointList();
                });
            }else{
                _this.initPathList();
                _this.initMission();
                _this.initPointList();
            }
        },
        getPoint:function(){
            if (typeof pointAll == 'undefined' || $.isEmptyObject(pointAll)){
                WebAPI.get('/patrol/point/getList/' + AppConfig.projectId).done(function(result){
                    pointAll = result.data;
                    _this.getMission();
                });
            }else{
                _this.getMission();
            }
        },
        initPathList:function(){
            var $pathList = $('#ctnPathList')  ;
            var path,status,name;
            for (var i = 0 ; i < pathAll.length ;i++){
                path = document.createElement('div');
                path.className = 'divPath zepto-ev';
                path.id = pathAll[i]['_id'];
                path.setAttribute('status',pathAll[i].status);

                name = document.createElement('span');
                name.className = 'spName';
                name.textContent = pathAll[i].name;
                path.appendChild(name);

                //point = document.createElement('<span>');
                //point.className = 'spPoint';
                //path.appendChild(point);

                //status = document.createElement('span');
                //status.className = 'spStatus';
                //status.textContent = _this.generateStatus(pathAll[i].status);
                //path.appendChild(status);

                $pathList.append(path);
            }
            $pathList.on('tap','.divMission',function(e){
                if($(e.currentTarget).hasClass('disabled'))return;
                var pathId = e.currentTarget.getAttribute('pathId');
                for (var i = 0; i < pathAll.length ;i++){
                    if (pathAll[i]['_id'] == pathId){
                        curSet.path = pathAll[i];
                    }
                }
                curSet.ptIndex = 0;
                curSet.patrolIndex++;
                patrolLog.push({});
                patrolLog[curSet.patrolIndex].startTime = new Date().format('yyyy-MM-dd HH:mm:ss');
                patrolLog[curSet.patrolIndex].planTime = e.currentTarget.getAttribute('time');
                patrolLog[curSet.patrolIndex].executorId = curSet.user['_id'];
                patrolLog[curSet.patrolIndex].pathId = curSet.path['_id'];
                patrolLog[curSet.patrolIndex].path = [];
                patrolLog[curSet.patrolIndex].projId = AppConfig.projectId;
                router.to({
                    typeClass:PointScreen
                })
            })
        },
        initPointList:function(){

        },
        initMission:function(){
            var mission,time,executor;
            var pathDom;
            var planLog,planNum;
            var pathLog;
            var now = new Date('2016/3/7 09:15');
            //var now = new Date();
            curSet.mission = {};
            for (var i = 0; i < missionAll.length;i++) {
                for (var pathObj in missionAll[i]['option']) {
                    pathLog = missionAll[i]['option'][pathObj];
                    pathDom = document.getElementById(pathObj);
                    planNum = 0;
                    curSet.mission[pathObj] = [];
                    for (var plan in pathLog) {
                        planLog = pathLog[plan];
                        var isExecutor = true;
                        //var executorIndex = new Date().getDate() - missionAll[i].interval * Math.floor(new Date().getDate() / missionAll[i].interval);
                        var executorIndex = Math.floor((new Date() - new Date(missionAll[i].startTime))/86400000)%(missionAll[i].interval);
                        if (planLog instanceof Array){
                            if (typeof planLog[executorIndex] == 'undefined' || planLog[executorIndex] != curSet.user['_id']){
                                isExecutor = false;
                            }
                        }
                        if(!isExecutor) continue;
                        curSet.mission[pathObj].push(plan);
                        planNum++;
                        mission = document.createElement('div');
                        mission.className = 'divMission zepto-ev';
                        mission.setAttribute('missionId', missionAll[i]['_id']);
                        mission.setAttribute('pathId', pathObj);
                        mission.setAttribute('time', plan);
                        if (Math.abs(new Date(now.format('yyyy/MM/dd') + ' ' + plan) - now) > 1800000) {
                            mission.className += ' disabled'
                        } else {
                            mission.className += ' active'
                        }
                        time = document.createElement('span');
                        time.className = 'spTime';
                        time.textContent = '任务' + planNum + ':预定' + plan + '开始';
                        mission.appendChild(time);

                        //executor = document.createElement('span');
                        //executor.className = 'spExecutor';
                        //executor.textContent = '执行人：';
                        //for (var i = 0; i < planLog.length; i++) {
                        //    executor.textContent += ' ' + _this.searchUserById(planLog[i]) + ' ';
                        //}
                        //mission.appendChild(executor);
                        pathDom.appendChild(mission);
                    }
                }
            }
        },
        searchUserById:function(userId){
            for (var i = 0; i < userAll.length; i++){
                if(userAll[i]['_id'] == userId)return userAll[i].name;
            }
        },
        generateStatus:function(statusId){
            var strStatus;
            switch (statusId){
                case 0:
                    strStatus = '未开始';
                    break;
                case 1:
                    strStatus = '巡跟中';
                    break;
                case 2:
                    strStatus = '已完成';
                    break;
                default :
                    strStatus = '';
                    break;
            }
            return strStatus;
        },
        close:function(){

        }
    };
    return PathSelScreen;
})();
/**
 * Created by win7 on 2016/3/2.
 */
var MissionSelScreen = (function(){
    var _this;
    function MissionSelScreen(data){
        _this = this;
        _this.opt = data?data:{};
        _this.mission = undefined;
    }
    MissionSelScreen.navOptions = {
        top:
        '<span class="topNavTitle">选择任务</span>',
        bottom: false,
        backDisable: false,
        module: 'project'
    };
    MissionSelScreen.prototype = {
        show:function(){
            $.ajax({url:'static/app/PatrolApp/views/screen/missionSelScreen.html'}).done(function(resultHtml){
                ElScreenContainer.innerHTML = resultHtml;
                _this.init();
            })
        },
        init:function(){
            WebAPI.post('/patrol/mission/get/' + AppConfig.projectId).done(function(result){
                _this.mission = result.data;
                _this.initMissionList();
            });
        },
        initMissionList:function(){
            var $missionList = $('#ctnMissionList');
            var pathMission = _this.mission.data[_this.opt.path['_id']];
            var mission,time,executor;
            var now = new Date();
            if (pathMission) {
                for (var plan in  pathMission) {
                    mission = document.createElement('div');
                    mission.className = 'divMission zepto-ev' ;
                    mission.id = pathMission[plan];

                    time = document.createElement('span');
                    time.className = 'spTime';
                    time.textContent = '该任务每' + _this.mission.interval +'天执行一次，每次预定从'+ plan + '开始';
                    mission.appendChild(time);

                    executor = document.createElement('span');
                    executor.className = 'spExecutor';
                    executor.textContent = '该任务由';
                    for (var i = 0 ; i < pathMission[plan].length ;i++){
                        executor.textContent += ' '+ _this.searchUserById(pathMission[plan][i]) + ' ';
                    }
                    executor.textContent += '执行';
                    mission.appendChild(executor);

                    $missionList.append(mission);
                }
            }else{
                mission = document.createElement('div');
                mission.textContent = '当前线路上没有您需要完成的任务，请重新选择';
                $missionList.append(mission)
            }
            $missionList.on('tap','.divMission',function(e){
                _this.opt.ptIndex = 0;
                router.to({
                    typeClass:PointScreen,
                    data:_this.opt
                })
            })
        },
        searchUserById:function(userId){
            for (var i = 0; i < _this.opt.user.length; i++){
                if(_this.opt.user[i]['_id'] == userId)return _this.opt.user[i].name;
            }
        },
        close:function(){

        }
    };
    return MissionSelScreen;
})();
/**
 * Created by win7 on 2016/3/2.
 */
var PointScreen = (function(){
    var _this;
    function PointScreen(data){
        _this = this;
    }
    PointScreen.navOptions = {
        top:
        '<span class="topNavTitle">检查节点中</span>\
        <span id="btnPhoto" class="topNavRight zepto-ev glyphicon glyphicon-earphone"></span>',
        bottom: false,
        backDisable: true,
        module: 'project'
    };
    PointScreen.prototype = {
        show:function(){
            $.ajax({url:'static/app/PatrolApp/views/screen/pointScreen.html'}).done(function(resultHtml){
                ElScreenContainer.innerHTML = resultHtml;
                _this.init();
            })
        },
        init:function(){
            _this.initContent();
            _this.initPoint();
            _this.initScan();
            _this.initSkip();
            _this.initJudge();
        },
        initContent:function(){
            for(var i = 0 ;i < pointAll.length ;i++){
                if (pointAll[i]['_id'] == curSet.path.path[curSet.ptIndex]['_id']){
                    curSet.point = pointAll[i];
                    break;
                }
            }

        },
        initPoint:function(){
            var $ctnPoint = $('#boxPoint');
            var guideLine,statusTip,point,content;
            if (curSet.path.path[curSet.ptIndex - 1]){
                guideLine = document.createElement('span');
                guideLine.className = 'spGuideLine';
                var prePoint = document.createElement('div');
                prePoint.className = 'divPtTip divPrePt';
                prePoint.textContent = '上一节点：' + curSet.path.path[curSet.ptIndex - 1].name;
                statusTip = document.createElement('span');
                switch (curSet.path.path[curSet.ptIndex - 1].error){
                    case 0:
                        statusTip.className = 'glyphicon glyphicon-ok spStatusTip';
                        prePoint.className += ' statusOk';
                        break;
                    case 1:
                        statusTip.className = 'glyphicon glyphicon-remove spStatusTip';
                        prePoint.className += ' statusErr';
                        break;
                    case 2:
                        statusTip.className = 'glyphicon glyphicon-forward spStatusTip';
                        prePoint.className += ' statusSkip';
                        break;
                }
                prePoint.appendChild(statusTip);
                $ctnPoint.append(prePoint);
                $ctnPoint.append(guideLine);
            }
            point = document.createElement('div');
            point.textContent = '请到' + curSet.path.path[curSet.ptIndex].name ;
            $ctnPoint.append(point);
            content = document.createElement('div');
            content.className = 'divContent';
            content.textContent = '要求：' + curSet.point.content;
            $ctnPoint.append(content);
            if (curSet.path.path[curSet.ptIndex + 1]){
                guideLine = document.createElement('span');
                guideLine.className = 'spGuideLine';
                $ctnPoint.append(guideLine);
                var nextPoint = document.createElement('div');
                nextPoint.className = 'divPtTip divNextPt';
                nextPoint.textContent = '下一节点：' + curSet.path.path[curSet.ptIndex + 1].name;
                $ctnPoint.append(nextPoint);
            }
        },
        initScan:function(){
            $('#btnBarCode').on('tap',function(){
                if (typeof cordova != 'undefined') {
                    cordova.plugins.barcodeScanner.scan(
                        function (result) {
                            console.log("We got a barcode\n" +
                                "Result: " + result.text + "\n" +
                                "Format: " + result.format + "\n" +
                                "Cancelled: " + result.cancelled);
                            if(curSet.point.codeQR == result.text) {
                                window.plugins.toast.show('二维码校对成功', 'short', 'center');
                            }else{
                                window.plugins.toast.show('二维码校对失败，请重现扫描', 'short', 'center');
                                return;
                            }
                            $('#ctnScan').hide();
                            $('#ctnJudge').show();
                        },
                        function (error) {
                            console.log("Scanning failed: " + error);
                        }
                    );
                }else {
                    $('#ctnScan').hide();
                    $('#ctnJudge').show();
                }
            })
        },
        initSkip:function(){
            $('#btnSkip').on('tap',function(){
                patrolLog[curSet.patrolIndex].path.push({
                    '_id':curSet.point['_id'],
                    'time':new Date().format('yyyy-MM-dd HH:mm:ss'),
                    'name':curSet.point['name'],
                    'msg':'',
                    'error':2,
                    'arrPic':[]
                });
                if (curSet.ptIndex == curSet.path.path.length - 1){
                    patrolLog[curSet.patrolIndex].endTime = new Date().format('yyyy-MM-dd HH:mm:ss');
                    patrolLog[curSet.patrolIndex].state = _this.getState();
                    router.to({
                        typeClass:MissionResultScreen
                    })
                }else {
                    curSet.ptIndex++;
                    router.to({
                        typeClass: PointScreen
                    })
                }
            })
        },
        initJudge:function(){
            $('#btnPtRight').on('tap',function(){
                patrolLog[curSet.patrolIndex].path.push({
                    '_id':curSet.point['_id'],
                    'time':new Date().format('yyyy-MM-dd HH:mm:ss'),
                    'name':curSet.point['name'],
                    'msg':'',
                    'error':0,
                    'arrPic':[]
                });
                if (curSet.ptIndex == curSet.path.path.length - 1){
                    patrolLog[curSet.patrolIndex].endTime = new Date().format('yyyy-MM-dd HH:mm:ss');
                    patrolLog[curSet.patrolIndex].state = _this.getState();
                    router.to({
                        typeClass:MissionResultScreen
                    })
                }else {
                    curSet.ptIndex++;
                    router.to({
                        typeClass: PointScreen
                    })
                }
            });
            $('#btnPtError').on('tap',function(){
                router.to({
                    typeClass:PointErrScreen
                })
            })
        },
        getState:function(){
            var state = 1;
            for (var i = 0 ; i < curSet.mission[curSet.path['_id']].length; i++){
                if(curSet.mission[curSet.path['_id']][i] == patrolLog[curSet.patrolIndex].planTime){
                    if (curSet.mission[curSet.path['_id']][i + 1]){
                        if (curSet.mission[curSet.path['_id']][i + 1]){
                            if (new Date(new Date().format('yyyy/MM/dd ') + curSet.mission[curSet.path['_id']][i + 1]) > new Date()){
                                state = 1
                            }else{
                                state = 2
                            }
                        }
                    }
                    if (new Date() - new Date(new Date().format('yyyy/MM/dd ') + curSet.mission[curSet.path['_id']][i]) > 10800000){
                        state = 2
                    }
                }

            }
            return state;
        },
        close:function(){

        }
    };
    return PointScreen
})();
/**
 * Created by win7 on 2016/3/2.
 */
var PointErrScreen = (function(){
    var _this;
    function PointErrScreen(data){
        _this = this;
        _this.opt = data?data:{};
    }
    PointErrScreen.navOptions = {
        top:
        '<span class="topNavTitle">上传错误信息</span>\
        <span id="btnSure" class="topNavRight zepto-ev">确认</span>',
        bottom: false,
        backDisable: false,
        module: 'project'
    };
    PointErrScreen.prototype = {
        show:function(){
            $.ajax({url:'static/app/PatrolApp/views/screen/pointErrScreen.html'}).done(function(resultHtml){
                ElScreenContainer.innerHTML = resultHtml;
                _this.init();
            })
        },
        init:function(){
            _this.initPhoto();
            _this.initPhotoEdit();
            _this.initComment();
            _this.initSure();
        },
        initPhoto:function(){
            $('#btnPhoto').on('tap',function(e){
                if(navigator && navigator.camera) {
                    var cameraOpt = {
                        destinationType:Camera.DestinationType.DATA_URL
                    };
                    navigator.camera.getPicture(
                        function (imgData){
                            console.log('camera Success');
                            var divPhoto = document.createElement('div');
                            var imgPhoto = document.createElement('img');
                            imgPhoto.src = 'data:image/jpeg;base64,' + imgData;
                            imgPhoto.className = "imgPhoto zepto-ev";
                            divPhoto.className = "divPhoto col-xs-4";
                            divPhoto.appendChild(imgPhoto);
                            $(e.currentTarget).before(divPhoto)
                        },
                        function () {
                            console.log('camera Error')
                        },
                        cameraOpt
                    )
                }else {
                    var divPhoto = document.createElement('div');
                    var imgPhoto = document.createElement('img');
                    imgPhoto.className = "imgPhoto zepto-ev";
                    divPhoto.className = "divPhoto col-xs-4";
                    divPhoto.appendChild(imgPhoto);
                    $(e.currentTarget).before(divPhoto)
                }
            })
        },
        initPhotoEdit:function(){
            $('#ctnPhoto').on('tap','img',function(e){
                $(e.currentTarget).parent().remove();
            })
        },
        getPhoto:function(){
            var $img = $('.divPhoto img');
            var arrImg = [];
            for (var i = 0 ; i < $img.length; i++) {
                arrImg.push($img[i].src)
            }
            return arrImg;
        },
        initComment:function(){

        },
        initSure:function(){
            $('#btnSure').on('tap',function(){
                patrolLog[curSet.patrolIndex].path.push({
                    '_id':curSet.point['_id'],
                    'time':new Date().format('yyyy-MM-dd HH:mm:ss'),
                    'name':curSet.point['name'],
                    'msg':$('#iptComment').val(),
                    'error':1,
                    'arrPic':_this.getPhoto()
                });
                if (curSet.ptIndex == curSet.path.path.length - 1){
                    patrolLog[curSet.patrolIndex].endTime = new Date().format('yyyy-MM-dd HH:mm:ss');
                    patrolLog[curSet.patrolIndex].state = _this.getState();
                    patrolLog[curSet.patrolIndex].state = 0;
                    router.to({
                        typeClass:MissionResultScreen
                    })
                }else {
                    curSet.ptIndex++;
                    router.to({
                        typeClass: PointScreen
                    })
                }
            });
        },
        getState:function(){
            var state = 1;
            for (var i = 0 ; i < curSet.mission[curSet.path['_id']].length; i++){
                if(curSet.mission[curSet.path['_id']][i] == patrolLog[curSet.patrolIndex].planTime){
                    if (curSet.mission[curSet.path['_id']][i + 1]){
                        if (curSet.mission[curSet.path['_id']][i + 1]){
                            if (new Date(new Date().format('yyyy/MM/dd ') + curSet.mission[curSet.path['_id']][i + 1]) > new Date()){
                                state = 1
                            }else{
                                state = 2
                            }
                        }
                    }
                    if (new Date() - new Date(new Date().format('yyyy/MM/dd ') + curSet.mission[curSet.path['_id']][i]) > 10800000){
                        state = 2
                    }
                }

            }
            return state;
        },
        close:function(){

        }
    };
    return PointErrScreen
})();
/**
 * Created by win7 on 2016/3/2.
 */
var MissionResultScreen = (function(){
    var _this;
    function MissionResultScreen(data){
        _this = this;
        _this.opt = data?data:{};
    }
    MissionResultScreen.navOptions = {
        top:
        '<span class="topNavTitle">巡跟结果</span>\
        <span id="btnSure" class="topNavRight zepto-ev">确认</span>',
        bottom: false,
        backDisable: true,
        module: 'project'
    };
    MissionResultScreen.prototype = {
        show:function(){
            $.ajax({url:'static/app/PatrolApp/views/screen/missionResultScreen.html'}).done(function(resultHtml){
                ElScreenContainer.innerHTML = resultHtml;
                _this.init();
            })
        },
        init:function(){
            _this.initResult();
            _this.initSure();
        },
        initResult:function(){
            var ctn = document.getElementById('ctnMissionResult');
            var point,status,info;
            var guideLine;
            for (var i = 0;i < patrolLog[curSet.patrolIndex].path.length ;i++){
                point = document.createElement('div');
                point.id = curSet.path.path[i]['_id'];
                point.className = 'divPoint';

                info = document.createElement('span');
                info.className = 'spPtName';
                info.textContent = curSet.path.path[i].name;

                status = document.createElement('span');
                status.className = 'spPtStatus';
                switch (patrolLog[curSet.patrolIndex].path[i].error){
                    case 0:
                        status.textContent = '设备正常';
                        status.className += ' statusOk';
                        break;
                    case 1:
                        status.textContent = '设备异常';
                        status.className += ' statusErr';
                        break;
                    case 2:
                        status.textContent = '未检查';
                        status.className += ' statusSkip';
                        break;
                }
                if (i != 0){
                    guideLine = document.createElement('span');
                    guideLine.className = 'spGuideLine';
                    ctn.appendChild(guideLine);
                }
                point.appendChild(info);
                point.appendChild(status);
                ctn.appendChild(point);
            }
        },
        initSure:function(){
            $('#btnSure').on('tap',function(){
                router.to({
                    typeClass:UserSelScreen
                })
            });
        },
        close:function(){

        }
    };
    return MissionResultScreen
})();
/**
 * Created by win7 on 2016/3/3.
 */
var AdminConfigure = (function(){
    var _this;
    function AdminConfigure(){
        _this = this;
    }
    AdminConfigure.navOptions = {
        top:
        '<span class="topNavTitle">配置</span>',
        bottom: true,
        backDisable: true,
        module: 'project'
    };
    AdminConfigure.prototype = {
        show:function(){
            $.ajax({url:'static/app/PatrolApp/views/screen/adminConfigure.html'}).done(function(resultHtml){
                ElScreenContainer.innerHTML = resultHtml;
                _this.init();
            })
        },
        init:function(){
            _this.initBtnToggle();
        },
        initBtnToggle:function(){
            $('.btnToggle').on('tap',function(e){
                if ($(e.currentTarget).hasClass('off')){
                    $(e.currentTarget).removeClass('off').addClass('on')
                }else{
                    $(e.currentTarget).removeClass('on').addClass('off')
                }
            })
        }
    };
    return AdminConfigure;
})();