(function () {
    // 将 html 代码转换成 dom 对象（html 代码必须包含一个根节点）
    function HTMLParser(htmlString){
        var div = document.createElement('div');
        div.innerHTML = htmlString;
        return div.firstChild;
    }

    if (window.$) {
        $.extend({
            deepClone: function (obj) {
                var type = $.type(obj);
                // object
                if (type === 'object') {
                    // 深度拷贝
                    return $.extend(true, {}, obj);
                }
                // array
                else if (type === 'array') {
                    // 数组深度拷贝
                    return $.extend(true, [], obj);
                }
                // number, string, boolean, error, regexp, date, function
                else {
                    // 不做处理
                    return obj;
                }
            }
        });
    }

    if (!String.prototype.toHexString) {
        String.prototype.toHexString = function () {
            return this.split('').map(function (row) {
                return '\\' + row.charCodeAt(0).toString(16);
            }).join('');
        };
    }

    if (!Array.toMap) {
        Array.toMap = function (arr, key) {
            var map = {};
            arr.forEach(function (row, i) {
                map[row[key]] = row;
            });
            return map;
        };
    }

    if (echarts) {                  
        //TODO: to be removed
        echarts.config = echarts.config || { color: ['#E2583A','#FD9F08','#1D74A9','#04A0D6','#689C0F','#109d83','#FEC500'] };
    }

    window.HTMLParser = HTMLParser;
    //数据源面板-点信息的获取
    function getPointInfoByIdAndType(type,id){
        var name,projectId;
        if(type === "cloud"){
            name = $('#tableDsCloud').find('tr[ptid="' + id + '"]').find('.tabColName').attr('data-value');
            projectId = $('#selectPrjName').find('option:selected').val();
        }else if(type === "tag"){
            name = $('#externalTagTree').find('a[nodeid="' + id + '"]').find('.spanName').attr('data-value');
            projectId = $('#tagSelectPrjName').find('option:selected').val();
        }
        if(!name || !projectId){
            var pointInfo = AppConfig.datasource.getDSItemById(id);
            name = pointInfo.alias;
            projectId = pointInfo.projId;
        }
        return {
            name: name,
            projectId: projectId
        };
    }
    window.getPointInfoByIdAndType = getPointInfoByIdAndType;
} ());