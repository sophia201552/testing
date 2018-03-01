;(function (exports, SuperClass) {

    function Table() {
        SuperClass.apply(this, arguments);

        this.store = null;
    }

    Table.prototype = Object.create(SuperClass.prototype);

    +function () {
        this.constructor = Table;

        this.optionTemplate =  Mixin(this.optionTemplate, {
            group: '基本',
            name: 'I18n.resource.report.optionModal.TABLE',
            minWidth: 6,
            minHeight: 5,
            maxWidth: 12,
            maxHeight: 15,
            type: 'Table'
        });

        /** @override */
        this.render = function () {
            var $table = $('<table></table>');
            var $thead = $('<thead></thead>');
            var $tbody = $('<tbody></tbody>');
            //var $header = $('<h3 style="width: 80%;margin-left: auto;margin-right: auto;"></h3>');
            var option = this.entity.modal.option;
            var strTbody = '', strThead = '';
            $(this.container).empty();
            if($.isEmptyObject(option)) return;

            //$header.append('<div><span style="font-size: 14px;color: #888;">Start time :  </span>' + option.start + '</div><div><span style="font-size: 14px;color: #888;">End &nbsp;time :  </span>' + option.end + '</div>');
            //如果行:数据源 列:日期
            if(option.isSwap){
                //thead
                strThead = '<th>Time</th>';
                for(var i = 0; i < option.dataSrc.length; i++){
                    strThead += ('<th>'+ option.dataSrc[i].title +'</th>');
                }
                $thead.append('<tr>'+ strThead +'</tr>');
                //tbody, 需要根据返回的数据绘制
                this.getData(option, function (result) {
                    if(result.timeShaft && result.timeShaft.length > 0){
                        var listLen = result.list.length;
                        var list = result.list;
                        result.timeShaft.forEach(function(time, index){
                            var strTd = '';
                            for(var m = 0; m < listLen; m++){
                                strTd += ('<td>'+ list[m].data[index] +'</td>');
                            }
                            strTbody += ('<tr><td>'+ getFormatTime(time, option.interval) +'</td>'+ strTd +'</tr>');
                        });
                    }
                    $tbody.append(strTbody);
                });
            }else{
                this.getData(option, function (result) {
                    //thead
                    strThead = '<th>Time</th>';
                    for(var i = 0; i < result.timeShaft.length; i++){
                        strThead += ('<th>'+ getFormatTime(result.timeShaft[i], option.interval) +'</th>');
                    }
                    $thead.append('<tr>'+ strThead +'</tr>');
                    //tbody
                    for(var i = 0, list; i < option.dataSrc.length; i++){
                        var strTd = '';
                        list = (function(list, id){
                            for(var k = 0; k < list.length; k++){
                                if(list[k].dsItemId == id){
                                    return list[k]
                                }
                            }
                        }(result.list, option.dataSrc[i].dsId));

                        for(var j = 0; j < list.data.length; j++){
                            strTd += ('<td>'+ list.data[j] +'</td>');
                        }
                        strTbody += ('<tr><td>'+ option.dataSrc[i].title +'</td>'+ strTd +'</tr>');
                    }
                    $tbody.append(strTbody);
                });
            }

            $table.append($thead).append($tbody);
            $(this.container).css({overflow: 'auto'}).append($table);

            function getFormatTime(time, interval){
                var formatTime = '';
                switch (interval){
                    case 'm5'://时间间隔为5分钟/1小时, 显示月-日 时:分
                    case 'h1':
                        formatTime = time.replace(/^\d{4}-/,'').replace(/:\d{2}$/,'');
                        break;
                    case 'd1'://时间间隔为1天,显示月-日
                    case 'd7':
                        formatTime = time.replace(/^\d{4}-/,'').replace(/\d{2}:\d{2}:\d{2}/,'');
                        break;
                }
                return formatTime;
            }
        };

        /** @override */
        this.initTools = function (tools) {
            tools = tools || ['configure', 'remove'];
            SuperClass.prototype.initTools.call(this, tools);
        };

        /** @override */
        this.destroy = function () {
            
        };

        this.getData = function(params, callback){
            Spinner.spin(this.container);
            var postData = {dsItemIds: (function(arrdataSrc){
                    var arr = [];
                    arrdataSrc.forEach(function(i){
                        i.dsId && arr.push(i.dsId);
                    });
                    return arr;
                }(params.dataSrc)) };
            if(params.y == 'default'){//时间随日历变化
                var options = this.getReportOptions();
                postData.timeStart = options.startTime;//params.startTime,
                postData.timeEnd = options.endTime;//params.endTime,
                postData.timeFormat = params.interval ? params.interval : options.timeFormat;//以选择的时间间隔为主
            }else{//时间由配置页面配置
                postData.timeStart = new Date(params.start).format('yyyy-MM-dd HH:mm:ss');//params.startTime,
                postData.timeEnd = new Date(params.end).format('yyyy-MM-dd HH:mm:ss');//params.endTime,
                postData.timeFormat = params.interval;
            }

            WebAPI.post('/analysis/startWorkspaceDataGenHistogram', postData).done(function(result){
                if(result && result.timeShaft){
                    callback(result);
                }
            }).always(function(){
                Spinner.stop();
            });
        }

    }.call(Table.prototype);

    exports.Table = Table;

} ( namespace('factory.report.components'),
    namespace('factory.report.components.Base') ));