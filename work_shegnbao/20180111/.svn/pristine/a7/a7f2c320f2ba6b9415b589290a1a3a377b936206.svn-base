/**在线监测-历史曲线 */
var OnlineHistory = (function() {
    function OnlineHistory(arrId) {
        this.points = arrId ? arrId : [];
        this.container = undefined;
        this.chart = undefined;
        var _this = this;
        this.type = undefined;

        this.dictOnline = {
            0: '未联机',
            1: '联机'
        };
        this.dictAlarm = {
            0: '无报警',
            1: '硬件报警',
            2: '上限报警'
        };
        this.dictRun = {
            0: '停车',
            1: '行驶'
        };
        this.option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    lineStyle: {
                        color: '#57617B'
                    }
                },
                formatter: function() {
                    let argsLen = arguments[0].length;
                    let index = 0,
                        grounNm = '',
                        group = '0',
                        strHTMl = '';

                    if (_this.points.length > 0 && argsLen) {
                        if (argsLen > _this.rs.length) { //处理莫名其妙的情况
                            argsLen = arguments[0].length = _this.rs.length;
                        }

                        for (let i = 0, item; i < argsLen; i++) {
                            item = arguments[0][i];
                            if (i == 0) {
                                strHTMl += '<span></span>' + item.name + '</br>';
                            }
                            if (item.seriesName.indexOf("报警状态") > -1) {
                                strHTMl += ('<span class="chartDot" style="background-color:' + item.color + '"></span>' + item.seriesName + ':\t' + ((item.value || item.value == 0) ? _this.dictAlarm[item.value] : '--') + '</br>');
                            } else if (item.seriesName.indexOf("联机状态") > -1) {
                                strHTMl += ('<span class="chartDot" style="background-color:' + item.color + '"></span>' + item.seriesName + ':\t' + ((item.value || item.value == 0) ? _this.dictOnline[item.value] : '--') + '</br>');
                            } else if (item.seriesName.indexOf("合格率") > -1) {
                                strHTMl += ('<span class="chartDot" style="background-color:' + item.color + '"></span>' + item.seriesName + ':\t' + (item.value ? item.value + '%' : '--') + '</br>');
                            } else if (item.seriesName.indexOf("行驶状态") > -1) {
                                strHTMl += ('<span class="chartDot" style="background-color:' + item.color + '"></span>' + item.seriesName + ':\t' + ((item.value || item.value == 0) ? _this.dictRun[item.value] : '--') + '</br>');
                            } else {
                                strHTMl += ('<span class="chartDot" style="background-color:' + item.color + '"></span>' + item.seriesName + ':\t' + (item.value ? item.value : '--') + '</br>');
                            }

                        }
                        return strHTMl;
                    }

                }
            },
            legend: {
                textStyle: {
                    color: '#ccc'
                }
            },
            grid: {
                left: '1%',
                right: '3%',
                top: '15%',
                bottom: '10%',
                containLabel: true
            },
            xAxis: [{
                type: 'category',
                boundaryGap: false,
                axisLine: {
                    lineStyle: {
                        color: '#57617B'
                    }
                }
            }],
            yAxis: [{
                type: 'value',
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false,
                    lineStyle: {
                        color: '#57617B'
                    }
                },
                axisLabel: {
                    margin: 10,
                    textStyle: {
                        fontSize: 14
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: '#57617B'
                    }
                }
            }],
            series: []
        };
        this.rs = {};
    }

    OnlineHistory.prototype = {
        show: function(arrPoint) {
            arrPoint && (this.points = arrPoint);
            this.points[0] && (this.type = this.points[0].type);
            if ($('div.FMdetailCnt').length == 0) {
                WebAPI.get('/static/app/LogisticsPlantform/views/onlineHistory.html').done((result) => {
                    $(ElScreenContainer.querySelector('#divMap')).hide();
                    $(ElScreenContainer.querySelector('.MFrghDetail')).append(result);
                    this.container = document.querySelector('div.FMdetailCnt');
                    this.init();
                });
            } else {
                this.getData();
            }
        },

        close: function() {
            $(ElScreenContainer.querySelector('#divMap')).show();
            $(ElScreenContainer.querySelector('.MFrghDetail')).empty();
            this.container = null;
            this.chart = null;
            this.option = null;
        },

        init: function() {
            //初始化时间
            var $iptTimeStart = $('#iptTimeStart', this.container);
            var $iptTimeEnd = $('#iptTimeEnd', this.container);
            var startTime = new Date();
            startTime.setDate(startTime.getDate() - 1);
            $iptTimeStart.val(timeFormat(startTime, timeFormatChange('yyyy-mm-dd hh:ii')))
            $iptTimeEnd.val(timeFormat(new Date(), timeFormatChange('yyyy-mm-dd hh:ii')))
            this.getData();
            this.attachEvent();
        },

        getData: function() {
            var dictHead = {
                'fixed': ['T', 'A', 'S', 'DS','H','CS'],
                'move': ['T', 'LAT', 'LNG', 'SP', 'ST', 'MIL', 'AREA', 'DIR']
            }
            var _this = this;
            var arrIds = (function(arr) {
                var arrRs = [];
                arr.forEach(function(e) {
                    let id = e instanceof Object ? e._id : e;;
                    let type = e instanceof Object ? e.type : _this.type;;
                    arrRs = arrRs.concat(dictHead[e.type].map(function(attr) { return id + '_' + attr }));
                });
                return arrRs;
            })(this.points);

            var startTime = new Date($('#iptTimeStart', this.container).val());
            var endTime = new Date($('#iptTimeEnd', this.container).val());

            // var postData = {
            //     dsItemIds: arrIds,
            //     timeStart: startTime.format("yyyy-MM-dd HH:mm:00"),
            //     timeEnd: endTime.format("yyyy-MM-dd HH:mm:00"),
            //     timeFormat: 'm5'
            // };

            // 时间验证
            if (startTime.getTime() > endTime.getTime()) {
                alert('结束时间不能早于开始时间');
                return;
            }
            var postData = {
                projectId: AppConfig.projectId,
                pointList: arrIds,
                timeStart: startTime.format("yyyy-MM-dd HH:mm:00"),
                timeEnd: endTime.format("yyyy-MM-dd HH:mm:00"),
                timeFormat: 'm5'
            };
            //if (arrIds.length == 0) {
            //    alert('数组长度为0');
            //    return;
            //}
            Spinner.spin(this.container);
            WebAPI.post('/get_history_data_padded', postData).done(rs => { // /analysis/startWorkspaceDataGenHistogram
                this.rs = rs;
                if (!this.rs || !this.rs.length) {
                    $('.FMContent', this.container).hide();
                    return;
                }
                this.renderChart();
            }).always(() => {
                Spinner.stop();
            });

        },

        renderChart: function() {
            var _this = this;
            var arrLegend = [],
                arrTime = [],
                arrSeries = [],
                option = { legend: { data: [] }, xAxis: [{ data: [] }], series: [] };
            var colorR = 137,
                colorG = 189,
                colorB = 27;
            var item = undefined;
            //var strHTMl = '',
            //    tpl = '<tr><td class="name">{name}</td><td class="time">{time}</td><td class="temp">{temp}</td><td class="alarm">{alarm}</td><td class="online">{online}</td><td class="door">{door}</td><td class="rate">{rate}%</td></tr>';
            var $tbHistory = $('.tableDetail tbody');
            $tbHistory.html('');
            var dataPoints = {}; // 存放选择点返回的数据

            var dictAttr = {
                'NAME': '名字',
                'TIME': '时间',
                'T': '温度',
                'A': '报警状态',
                'S': '联机状态',
                'DS': '库门状态',
                'RATE': '合格率',
                'LAT': '纬度',
                'LNG': '经度',
                'SP': '速度',
                'ST': '行驶状态',
                'MIL': '里程',
                'AREA': '所在位置',
                'DIR': '车头方向',
                'H': '湿度',
                'CS': '压缩机状态'
            }
            var dictHead = {
                'fixed': ["NAME", "TIME", "T", "H", "CS", "A", "S", "DS"],
                'move': ["NAME", "TIME", "T", "LAT", "LNG", "SP", "ST", "MIL", "AREA", "DIR"]
            }
            $('.FMContent', this.container).show();
            //list转换成dict
            this.rs.forEach(function(item, index) {
                let seriesData = [];

                //dataPoints的key
                let key = item.name.split('_')[0];
                let attr = item.name.split('_')[1];
                if (!dataPoints[key]) {
                    dataPoints[key] = {};
                }
                let ptName = (function(k) {
                    for (let j = 0; j < _this.points.length; j++) {
                        if (_this.points[j]._id == key) {
                            return _this.points[j].name;
                        }
                    }
                    return '';
                })(key);
                let name = (function(attr) {
                    let n = '';
                    n = ptName + ' - ' + dictAttr[attr];
                    switch (attr) {
                        case 'T':
                        case 'A':
                        case 'DS':
                        case 'SP':
                        case 'MIL':
                        case 'H':
                            seriesData = dataPoints[key][attr] = (function(data) {
                                if (!data || !data.length) return [];
                                return item.history.map((d) => {
                                    if(d.error == false){
                                        return d.value;
                                    }
                                });
                            })(item.history);
                            break;
                        case 'ST':
                            seriesData = dataPoints[key][attr] = (function(data) {
                                if (!data || !data.length) return [];
                                return item.history.map((d) => {
                                    if(d.error == false){
                                        if (d.value && d.value === '行驶') {
                                            return 1;
                                        }
                                        return 0;
                                    }
                                });
                            })(item.history);
                            break;
                        case 'S':
                            seriesData = dataPoints[key][attr] = (function(data) {
                                if (!data || !data.length) return [];
                                return item.history.map((d) => {
                                    if(d.error == false){
                                        if (d.value && d.value === '联机') {
                                            return 1;
                                        }
                                        return 0;
                                    }
                                });
                            })(item.history);
                            break;
                         case 'CS':
                            seriesData = dataPoints[key][attr] = (function(data) {
                                if (!data || !data.length) return [];
                                return item.history.map((d) => {
                                        // todo
                                        if(d.error == false){
                                            if (d.value) {
                                                return d.value;
                                            }
                                            return d.value;
                                        }
                                    });
                            })(item.history);
                            break;   
                        default:
                            n = '';
                            seriesData = dataPoints[key][attr] = (function(data) {
                                if (!data || !data.length) return [];
                                return item.history.map((d) => {
                                    if(d.error == false){
                                        return d.value;
                                    }
                                    
                                });
                            })(item.history);
                            break;
                    }
                    return n;
                })(attr);
                if (!name) return;
                arrLegend.push(name)
                arrSeries.push({
                    point: key + '_' + attr,
                    name: name,
                    type: 'line',
                    smooth: true,
                    symbol: 'circle',
                    symbolSize: 5,
                    showSymbol: false,
                    lineStyle: {
                        normal: {
                            width: 1
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: 'rgba(' + colorR + ', ' + colorG + ', ' + colorB + ', 1)'
                        }
                    },
                    data: seriesData
                });
                colorR = (colorR + 40) % 255;
                colorG = (colorG - 40) % 255;
                colorB = (colorB + 40) % 255;
            });

            //拼接表格 同一个点的数据放一组

            var $thead = $('.tableDetail .tableHeadRow')
            $thead.html('')
            var headDom;
            dictHead[this.type].forEach(function(item) {
                headDom = document.createElement('th');
                headDom.innerHTML = dictAttr[item]
                $thead.append(headDom)
            })
            var dataRowDom, dataDom;
            for (let i = 0, l = _this.points.length; i < l; i++) {
                let dictData = dataPoints[_this.points[i]._id];
                let pointName = _this.points[i].name;
                if (!dictData) continue;
                this.rs[0].history.forEach(function(item, index) {
                    let fmatTime = timeFormat(new Date(item.time), timeFormatChange('mm-dd hh:ii'));
                    //x轴 时间
                    if (i === 0) {
                        arrTime.push(fmatTime);
                    }
                    dataRowDom = document.createElement('tr')
                    dictHead[_this.type].forEach(function(attrName) {
                            dataDom = document.createElement('td');
                            dataDom.dataset.attr = attrName;
                            switch (attrName) {
                                case 'TIME':
                                    dataDom.innerHTML = fmatTime;
                                    break;
                                case 'NAME':
                                    dataDom.innerHTML = pointName;
                                    break;
                                // todo CS
                                // case 'RATE':
                                //     dataDom.innerHTML = (dictData[attrName] && dictData[attrName][index] || dictData.alarm[index] == 0) ? dictData.rate[index] : '-';
                                //     break;
                                case 'A':
                                    dataDom.innerHTML = (dictData[attrName] && (dictData[attrName][index] || dictData[attrName][index] == 0)) ? _this.dictAlarm[dictData[attrName][index]] : '-';
                                    break;
                                case 'S':
                                    dataDom.innerHTML = (dictData[attrName] && (dictData[attrName][index] || dictData[attrName][index] == 0)) ? _this.dictOnline[dictData[attrName][index]] : '-';
                                    break;
                                case 'ST':
                                    dataDom.innerHTML = (dictData[attrName] && (dictData[attrName][index] || dictData[attrName][index] == 0)) ? _this.dictRun[dictData[attrName][index]] : '-';
                                    break;
                                case 'SP':
                                    dataDom.innerHTML = (dictData[attrName] && (dictData[attrName][index])) ? dictData[attrName][index] : '-';
                                    break;
                                case 'CS':
                                    dataDom.innerHTML = (dictData[attrName] && (dictData[attrName][index])) ? dictData[attrName][index] : '-';
                                    break;                                    
                                default:
                                    dataDom.innerHTML = (dictData[attrName] && (dictData[attrName][index] || dictData[attrName][index] == 0)) ? dictData[attrName][index] : '-';
                                    break;
                            }
                            dataRowDom.appendChild(dataDom);
                        })
                        // strHTMl += (tpl.formatEL({
                        //     name: pointName,
                        //     time: fmatTime,
                        //     temp: (dictData.temp && dictData.temp[index]) ? dictData.temp[index] : '-',
                        //     //humidity: dictData.humidity[index] ? dictData.humidity[index] : '-' ,
                        //     alarm: (dictData.alarm && (dictData.alarm[index] || dictData.alarm[index] == 0)) ? _this.dictAlarm[dictData.alarm[index]] : '-',
                        //     online: (dictData.online && (dictData.online[index] || dictData.online[index] == 0)) ? _this.dictOnline[dictData.online[index]] : '-',
                        //     door: (dictData.door && dictData.door[index]) ? dictData.door[index] : '-',
                        //     rate: (dictData.rate && dictData.rate[index]) ? dictData.rate[index] : '-',
                        // }));
                    $tbHistory.append(dataRowDom)
                });
            }
            

            // 设置开始时间/结束时间区间
            this.points.forEach((item, index) => {
                let start = item.startTime;
                let end = item.endTime;
                let markAreaStart = '', markAreaEnd = '';
                let markArea = {
                    silent: true,
                    data: [],
                    itemStyle:{
                        normal:{
                            color: 'rgba(255,255,255,0.1)'
                        }
                    }
                };
                if(!start || !end) return;
                for(let i = 0, l = arrTime.length; i < l; i++){
                    if(arrTime[i].split(' ')[1] === start){
                        markAreaStart = arrTime[i];
                    }
                    if(arrTime[i].split(' ')[1] === end){
                        markAreaEnd = arrTime[i];
                    }
                    if(markAreaStart && markAreaEnd){
                        markArea.data.push([{
                            xAxis: markAreaStart
                        }, {
                            xAxis: markAreaEnd
                        }]);
                        if(start > end){
                            markAreaEnd = '';
                        }else{
                            markAreaStart = '';
                            markAreaEnd = '';                            
                        }

                    }
                }
                //只需mark最后一个考核时间范围内的曲线
                markArea.data.length > 1 && (markArea.data = [markArea.data.pop()]);
                arrSeries.forEach((sr, id) => {
                    if(sr.point === (item._id + '_T')){
                        sr.markArea = markArea;
                    }
                });
            });
            
            // $tbHistory.html(strHTMl);
            option.legend.data = arrLegend;
            option.xAxis[0].data = arrTime;
            option.series = arrSeries;
            if (!this.chart) {
                this.chart = echarts.init(this.container.querySelector('.FMechart'));
            }else{
                this.chart.clear();
            }
            
            this.chart.setOption($.extend(true, {}, this.option, option));
        },

        exportData: function() {
            var startTime = new Date($('.divTimeTool .iptContent').eq(0).val().replace(/-/g, '/'));
            var endTime = new Date($('.divTimeTool .iptContent').eq(1).val().replace(/-/g, '/'));
            // if (+startTime > +endTime) {
            //     infoBox.alert('开始时间晚于结束时间，请检查！');
            //     return;
            // }
            var dictHead = {
                'fixed': ["名称", "时间", "温度", "湿度", "压缩机状态", "报警状态", "联机状态", "库门状态"],
                'move': ["名称", "时间", "温度", "纬度", "经度", "速度", "行驶状态", "里程", "所在位置", "车头方向"]
            };
            var postData = {
                "head": dictHead[this.type],
                "data": [],
                'projId': AppConfig.projectId,
                'begTime': startTime.format('yyyy-MM-dd HH:mm:ss'),
                'endTime': endTime.format('yyyy-MM-dd HH:mm:ss'),
                'type': (NavTree.focusGroup == 'fixed' ? 0 : 1)
            };
            $('.tableDetail tbody tr', this.container).each(function(index, elem) {
                var arr = [];
                $('td', elem).each(function(i, e) {
                    arr.push($(e).text());
                });
                postData.data.push(arr);
            });
            if (postData.data.length == 0) {
                alert('没有数据可下载');
                return;
            }
            WebAPI.post('/logistics/export/excel/0', postData).done(function(result) { //0: 不需要详细信息
                var aTag = document.createElement('a');
                aTag.download = '历史记录-' + postData.begTime.split(' ')[0].replace(/-/g, '/') + '--' + postData.endTime.split(' ')[0].replace(/-/g, '/') + '.xls'
                aTag.href = result;
                document.body.appendChild(aTag);
                aTag.onclick = function() {
                    document.body.removeChild(aTag)
                }
                aTag.click();
            })
        },

        attachEvent: function() {
            //时间选择框
            var $datePicker = $('.divTimeTool .iptContent')
            $datePicker.datetimepicker({
                format: 'yyyy-mm-dd hh:ii',
                todayBtn: 'linked',
                endDate: new Date(),
                autoclose: true,
                pickerPosition: 'bottom-right',
                language: 'zh'
            });

            //返回地图
            $('.btnBackMap', this.container).off('click').on('click', e => {
                // Router.to(MapScreen);
                this.close();
                Router.to(MapScreen, this.points ? this.points[0] : null);
            });
            //查询
            $('.btnQuery', this.container).off('click').on('click', e => {
                this.getData();
            });
            //导出
            $('.btnExport', this.container).off('click').on('click', e => {
                this.exportData();
            });
            var tableHead = document.querySelector('.tableDetail thead');
            $('.FMtable')[0].onscroll = function(e){
                tableHead.style.top = e.currentTarget.scrollTop + 'px'
            }
        },

        onNavPointClick: function(args) {
            this.show(args);
        },

        setFixedTableHead:function(){
            var $table = $('.tableFixedHead thead');
            var $tableTh = $table.find('th');
            var $tableContent = $('.tableDetail tr').eq(1).find('td');
            if ($tableContent.length == 0)
                $table.find('th').each(function(index,dom){
                    $tableContent[0] && (dom.style.width = $tableContent[0].offsetWidth + 'px')
                })
        }
    };

    return OnlineHistory;
})();