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
};

Date.prototype.timeFormat = function(format, type, language) {
    var date = this;
    if (format&&(typeof format == 'string'||typeof format == 'object')) {
        if (typeof format == 'object' && (!format.separators || !format.parts)) {
            format = 'yyyy-mm-dd hh:ii:ss';
        }
    } else {
        format = 'yyyy-mm-dd hh:ii:ss';
    }
    if (arguments.length > 2) {
        type = arguments[1];
        language = arguments[2];
    }else if(arguments.length == 2){
        if (typeof arguments[1] == 'number') {
            type = arguments[1];
        }
        if (typeof arguments[1] == 'string') {
            language = arguments[1];
        }
    }
    var DATES = {
        en: {
            "days": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            "daysShort": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            "daysMin": ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
            "months": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            "monthsShort": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            "meridiem": ["am", "pm"]
        }
    };
    language = language ? (DATES[language]?language:'en') : 'en';
    var formatObj = (function (formatStr) {
        if (typeof formatStr == 'object') {
            return formatStr;
        }
        if (type) {
            formatStr = timeFormatChange(formatStr,type);
        }
        var reg = /hh?|HH?|p|P|ii?|ss?|dd?|DD?|mm?|MM?|yy(?:yy)?/g;
        var separators = formatStr.replace(reg, '\0').split('\0');
        var parts = formatStr.match(reg);
        if (!separators || !separators.length || !parts || parts.length == 0) {
            throw new Error("Invalid date format.");
        }
        return { separators: separators, parts: parts };
    })(format);

    var val = {
        // year
        yy: date.getFullYear().toString().substring(2),
        yyyy: date.getFullYear(),
        // month
        m: date.getMonth() + 1,
        M: DATES[language].monthsShort[date.getMonth()],
        MM: DATES[language].months[date.getMonth()],
        // day
        d: date.getDate(),
        D: DATES[language].daysShort[date.getDay()],
        DD: DATES[language].days[date.getDay()],
        p: (DATES[language].meridiem.length == 2 ? DATES[language].meridiem[date.getHours() < 12 ? 0 : 1] : ''),
        // hour
        h: date.getHours(),
        // minute
        i: date.getMinutes(),
        // second
        s: date.getSeconds()
    };

    if (DATES[language].meridiem.length == 2) {
        val.H = (val.h % 12 == 0 ? 12 : val.h % 12);
    }
    else {
        val.H = val.h;
    }
    val.HH = (val.H < 10 ? '0' : '') + val.H;
    val.P = val.p.toUpperCase();
    val.hh = (val.h < 10 ? '0' : '') + val.h;
    val.ii = (val.i < 10 ? '0' : '') + val.i;
    val.ss = (val.s < 10 ? '0' : '') + val.s;
    val.dd = (val.d < 10 ? '0' : '') + val.d;
    val.mm = (val.m < 10 ? '0' : '') + val.m;

    var finTime = '';
    for (var i = 0, len = formatObj.parts.length; i < len; i++){
        finTime += val[formatObj.parts[i]] + (formatObj.separators[i + 1] ? formatObj.separators[i + 1] : '');
    }
    return finTime;
}

$.fn.serializeObject = function () {
    var obj = {};
    this.serializeArray().map(function (item) {
        if (/\[\]$/.test(item.name)) {
            if (obj[item.name]) {
                obj[item.name].push(item.value);
            } else {
                obj[item.name] = [item.value];
            }
        } else {
            obj[item.name] = item.value;
        }

    });
    return obj;
};

(function ($) {
    $.fn.drags = function (opt) {

        opt = $.extend({handle: "", cursor: "move"}, opt);
        var $el;
        if (opt.handle === "") {
            $el = this;
        } else {
            $el = this.find(opt.handle);
        }

        return $el.on("mousedown", function (e) {
            var $this = $(this), $drag;
            if ($(e.target).closest('.notDraggable').length > 0) {
                $this.css('cursor', 'default');
                return true;
            }

            $this.css('cursor', opt.cursor);
            if (opt.handle === "") {
                $drag = $this.addClass('draggable');
            } else {
                $drag = $this.addClass('active-handle').closest('.draggable-panel').addClass('draggable');
            }
            var z_idx = $drag.css('z-index'),
                drg_h = $drag.outerHeight(),
                drg_w = $drag.outerWidth(),
                pos_y = $drag.offset().top + drg_h - e.pageY,
                pos_x = $drag.offset().left + drg_w - e.pageX;
            $drag.css('z-index', 1000).parents().on("mousemove", function (e) {
                $('.draggable').offset({
                    top: e.pageY + pos_y - drg_h,
                    left: e.pageX + pos_x - drg_w
                }).on("mouseup", function () {
                    $(this).removeClass('draggable').css('z-index', z_idx);
                });
            });
            e.preventDefault(); // disable selection
        }).on("mouseup", function () {
            var $this = $(this);
            if (opt.handle === "") {
                $this.removeClass('draggable');
            } else {
                $this.removeClass('active-handle').closest('.draggable-panel').removeClass('draggable');
            }
        });

    };
})(jQuery);


function UpdateQueryString(key, value, url) {
    if (!url) url = '';
    var re = new RegExp("([?&])" + key + "=.*?(&|#|$)(.*)", "gi"),
        hash;

    if (re.test(url)) {
        if (typeof value !== 'undefined' && value !== null)
            return url.replace(re, '$1' + key + "=" + value + '$2$3');
        else {
            hash = url.split('#');
            url = hash[0].replace(re, '$1$3').replace(/(&|\?)$/, '');
            if (typeof hash[1] !== 'undefined' && hash[1] !== null)
                url += '#' + hash[1];
            return url;
        }
    }
    else {
        if (typeof value !== 'undefined' && value !== null) {
            var separator = url.indexOf('?') !== -1 ? '&' : '?';
            hash = url.split('#');
            url = hash[0] + separator + key + '=' + value;
            if (typeof hash[1] !== 'undefined' && hash[1] !== null)
                url += '#' + hash[1];
            return url;
        }
        else
            return url;
    }
}

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

function naturalCompare(a, b) {
    var ax = [], bx = [];

    a.replace(/(\d+)|(\D+)/g, function (_, $1, $2) {
        ax.push([$1 || Infinity, $2 || ""])
    });
    b.replace(/(\d+)|(\D+)/g, function (_, $1, $2) {
        bx.push([$1 || Infinity, $2 || ""])
    });

    while (ax.length && bx.length) {
        var an = ax.shift();
        var bn = bx.shift();
        var nn = (an[0] - bn[0]) || an[1].localeCompare(bn[1]);
        if (nn) return nn;
    }

    return ax.length - bx.length;
}

InitI18nResource().always(function (rs) {
    I18n = new Internationalization(null, rs);
});