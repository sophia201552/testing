/// <reference path="../../lib/jquery-1.8.3.js" />

var beop = beop || {};
beop.constant = {
    project_img_path: '/static/images/project_img/',
    project_default_img: 'default.jpg'
};

// 生成 object id - 24 位
var ObjectId = function () {
    // 前 8 位，随机十六进制数
    var hex8 = ('00000000' + Math.floor(Math.random()*0xFFFFFFFF).toString(16)).slice(-8);
    // 中间 3 位，用户id，不足补 0，超过从前面截断
    var userId = ( '000'+(AppConfig.userId || '000') ).slice(-3);
    // 最后 13 位，unix 时间戳
    var timestamp = new Date().valueOf();

    return hex8 + userId + timestamp;
};

var FullScreenManager = (function () {
    var manager = Object.create({
        init: function () {
            var _this = this;

            $(document).off('webkitfullscreenchange');
            $(document).on('webkitfullscreenchange', function () {
                var isFullScreen = !!document.webkitFullscreenElement;
                if(isFullScreen) {
                    _this.onFullScreenEnter();
                } else {
                    _this.onFullScreenOut();
                }
            });
            $(document).off('mozfullscreenchange');
            $(document).on('mozfullscreenchange', function () {
                var isFullScreen = !!document.webkitFullscreenElement;
                if(isFullScreen) {
                    _this.onFullScreenEnter();
                } else {
                    _this.onFullScreenOut();
                }
            });
            $(document).off('msfullscreenchange');
            $(document).on('msfullscreenchange', function () {
                var isFullScreen = !!document.webkitFullscreenElement;
                if(isFullScreen) {
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
        onFullScreenEnter: function () {},
        onFullScreenOut: function () {},
        onFullScreenError: function () {},
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
}
//parse timestamp to Date
Number.prototype.toDate = function () {
    return new Date(this);
};

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
                    container.classList.remove(target)
                    refresh();
                }
            });
        });
    }
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
var getWysiwyg = function(hasEditor){
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