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