(function (exports) {
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

    // 将 html 代码转换成 dom 对象（html 代码必须包含一个根节点）
    exports.HTMLParser = function (htmlString){
        var div = document.createElement('div');
        div.innerHTML = htmlString;
        return div.firstChild;
    };

    //数据源面板-点信息的获取
    exports.getPointInfoByIdAndType = function (type,id) {
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
    };

    // 根据 value 获取 object 中对应的一项
    exports.getByValue = function (object, value) {
        return Object.keys(object).find(function (row) {
            return object[row] === value;
        });
    }
    // 根据 projectId 转换时区
    exports.getProjectTimeZone = function(projectId){
        var timeZone;
       switch( projectId ) {
           case 293 : 
           timeZone = 'Australia/Sydney';
           break;
           default :
           timeZone = 'Asia/Shanghai';
           break;
       };
       return timeZone;
    };
} (window));