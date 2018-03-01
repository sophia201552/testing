/// <reference path="../../lib/jquery-1.8.3.js" />

var beop = beop || {};
beop.constant = {
    project_img_path: '/static/images/project_img/',
    project_default_img: 'default.jpg'
};

var FullScreenManager = (function () {
    return {
        init: function (onChange, onError) {
            if(typeof onChange === 'function') {
                $(document).off('webkitfullscreenchange');
                $(document).on('webkitfullscreenchange', function () {
                    onChange({isFullScreen: !!document.webkitFullscreenElement});
                });
                $(document).off('mozfullscreenchange');
                $(document).on('mozfullscreenchange', function () {
                    onChange({isFullScreen: !!document.mozFullScreenElement});
                });
                $(document).off('msfullscreenchange');
                $(document).on('msfullscreenchange', function () {
                    onChange({isFullScreen: !!document.msFullscreenElement});
                });
            }
            if(typeof onError === 'function') {
                $(document).off('webkitfullscreenerror');
                $(document).on('webkitfullscreenerror', onError);
                $(document).off('mozfullscreenerror');
                $(document).on('mozfullscreenerror',  onError);
                $(document).off('msfullscreenerror');
                $(document).on('msfullscreenerror',  onError);
            }
        },
        // open/close full screen mode
        // note: for security concerns, this api an only works in user actions
        toggle: function () {
            if (!document.fullscreenElement &&
                !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {  // current working methods
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
    }
} ());

var ScreenManager = (function () {
    var slice = Array.prototype.slice;

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
            ScreenCurrent.close();
        }
        ScreenCurrent = (screenClass.apply(screenObj, slice.call(arguments, 1)) || screenObj);
        ScreenCurrent.show();
    }
    return ScreenManager;
})();

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

function Alert(targetElement, type, msg) {
    this.element = targetElement;
    this.str = new StringBuilder();
    this.str.append('<div class="alert alert-')
        .append(type)
        .append(' alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>')
        .append('<div class="alert-msg">' + msg + '</div>')
        .append('</div>');
    this.$alert = $(this.str.toString());
}

Alert.type = {
    danger: 'danger',
    warning: 'warning',
    success: 'success',
    info: 'info'
};

Alert.prototype.show = function (duration) {
    if (duration) {
        var _this = this;
        setTimeout(function () {
            _this.close();
        }, duration);
    }
    $(this.element).append(this.$alert);
    return this;
};
Alert.prototype.close = function () {
    var _this = this;
    this.$alert.fadeOut(3000, function () {
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
    this.setStyle({position: 'absolute', top: 0, left: 0, right: 0, margin: 'auto', width: '50%', textAlign: 'center'})
    this.show(duration);
};

function showDialog(url) {
    return $.get(url).done(function (resultHtml) {
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

    function parseStringToDate(str) {
        var tempStrs = str.split(" ");
        var dateStrs = tempStrs[0].split("-");
        var year = parseInt(dateStrs[0], 10);
        var month = parseInt(dateStrs[1], 10) - 1;
        var day = parseInt(dateStrs[2], 10);
        var timeStrs = tempStrs[1].split(":");
        var hour = timeStrs[0] ? parseInt(timeStrs[0], 10) : 0;
        var minute = timeStrs[1] ? parseInt(timeStrs[1], 10) - 1 : 0;
        var second = timeStrs[2] ? parseInt(timeStrs[2], 10) : 0;
        var date = new Date(year, month, day, hour, minute, second);
        return date;
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
            case ts < 60 * 60:
                ts = Math.floor(ts / 60);
                info = ts + (ts === 1 ? ' minute' : ' minutes');
                break;
            // hours level
            // will show "n hour(s) ago/later"
            case ts < 60 * 60 * 24:
                ts = Math.floor(ts / (60 * 60));
                info = ts + (ts === 1 ? ' hour' : ' hours');
                break;
            // days level
            // will show "n day(s) ago/later"
            case ts < 60 * 60 * 24 * 365:
                ts = Math.floor(ts / (60 * 60 * 24));
                info = ts + (ts === 1 ? ' day' : ' days');
                break;
            // years level
            // will show "n year(s) ago/later"
            default:
                ts = Math.floor(ts / (60 * 60 * 24 * 365));
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
        parseStringToDate: parseStringToDate,
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

    return {
        setRelativePosition: setRelativePosition,
        getProjectImgPath: getProjectImgPath,
        getFunctionName: getFunctionName,
        isUndefined: isUndefined
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
var SidebarMenuEffect = (function (center, left, right) {
    function SidebarMenuEffect() {
    }

    function init() {
        this.$paneCt = $(center);
        this.$leftCt = $(left);
        this.$rightCt = $(right);
        var container = document.getElementById('st-container'),
            buttons = Array.prototype.slice.call(document.querySelectorAll('.sideTrans')),
            refresh = function () {
                var leftCol, rightCol, centerCol;
                var leftArrow = '<span class="glyphicon glyphicon-chevron-left"></span>';
                var rightArrow = '<span class="glyphicon glyphicon-chevron-right"></span>';

                if (container.className.indexOf('st-effect-7') > 0) {
                    leftCol = 2;
                    this.$leftCt.removeClass('leftCtClose').addClass('leftCtOpen').html(leftArrow);
                } else {
                    leftCol = 0;
                    this.$leftCt.removeClass('leftCtOpen').addClass('leftCtClose').html(rightArrow);
                }
                if (container.className.indexOf('st-effect-1') > 0) {
                    rightCol = 3;
                    this.$rightCt.removeClass('rightCtClose').addClass('rightCtOpen').html(rightArrow);
                } else {
                    rightCol = 0;
                    this.$rightCt.removeClass('rightCtOpen').addClass('rightCtClose').html(leftArrow);
                }
                centerCol = 12 - leftCol - rightCol;
                this.$paneCt.removeClass().addClass('col-sm-' + centerCol + ' st-content');
            };

        buttons.forEach(function (el, i) {
            var effect = el.getAttribute('data-effect');

            var isOpen = document.getElementById('st-container').className.indexOf('st-menu-open');
            el.addEventListener('click', function (ev) {
                var target = ev.target.getAttribute('data-effect') != null ? ev.target.getAttribute('data-effect') : ev.target.parentNode.getAttribute('data-effect');
                var stCtClass = document.getElementById('st-container').className;
                if (stCtClass.indexOf(target) < 0) {
                    ev.stopPropagation();
                    ev.preventDefault();
                    container.classList.add(effect);
                    setTimeout(function () {
                        container.classList.add('st-menu-open');
                        refresh();
                    }, 250);
                } else {
                    container.classList.remove(target)
                    refresh();
                }
            });
        });
    }

    init();
    return SidebarMenuEffect;
});
/* 页面折叠效果 end */