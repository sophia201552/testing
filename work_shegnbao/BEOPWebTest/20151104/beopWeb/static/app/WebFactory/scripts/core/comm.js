(function () {
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

    // 将 html 代码转换成 dom 对象（html 代码必须包含一个根节点）
    function HTMLParser(htmlString){
        var div = document.createElement('div');
        div.innerHTML = htmlString;
        return div.firstChild;
    }

    window.HTMLParser = HTMLParser;
} ());