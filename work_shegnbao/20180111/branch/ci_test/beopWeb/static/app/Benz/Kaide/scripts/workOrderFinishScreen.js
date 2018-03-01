class WorkOrderFinish {
    constructor(opt) {
        var _this = this;
        this.screen = opt;
        this.container = null;
        this.selectedNode = null;
    }

    show(ids) {
        this.container = document.querySelector('.panelBmModule');
        this.init();
        this.selectedNode = ids;
    }

    init() {
        var _this = this;
        WebAPI.get('static/app/Benz/Kaide/views/WorkOrderFinishScreen.html').done(function (result) {
            $('.panelBmModule').html(result);
            _this.initTimeQuery();
            _this.initModule();
            _this.attachEvent();
        });
    }
    initModule() {
        var data = this.sortData();
        var echart = echarts.init(document.querySelector('.crosswiseChart'));
        var option = {
            tooltip: {
                trigger: 'axis',
                formatter: function (params) {
                    var str = '';
                    var total = 0;
                    var l = $('li .active').length;
                    for (var i = 0; i < l; i++) {
                        str += params[i].name + '<br/>';
                        str += params[i].seriesName + ' : ' + params[i].value[1] + '<br/>';
                        if (l > 1) {
                            total += parseFloat(params[i].value);
                        }
                    }
                    if (l > 1) {
                        str += 'total' + ' : ' + total.toFixed(2);
                    }
                    return str;
                },
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                x: 80,
                top: 30,
                bottom: 170,
            },
            calculable: true,
            dataRange: {
                show: false,
                min: 0,
                max: 12,
                calculable: true,
                color: ['#d94e5d', '#eac736', '#50a3ba'],
                y: 'center',
            },
            xAxis: [{
                type: 'category',
                show: true,
                axisLine: {
                    lineStyle: {
                        color: '#414B5E'
                    }

                },
                offset: 0,
                data: getDataType('name'),
                scale: false,
                axisLabel: {
                    show: true,
                    margin:10,
                    textStyle: {
                        color: '#FFFFFF'
                    },
                    formatter: function (value, index) {
                        return value ? value.split("").join('\n') : ""; //竖排文字
                    }
                },
                splitLine: {
                    show: false
                },
                axisTick: {
                    show: false
                }
            }],
            yAxis: [{
                type: 'value',
                show: true,
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#414B5E'
                    }
                },
                axisLabel: {
                    show: true,
                    "rotate": 0,
                    textStyle: {
                        color: '#FFFFFF'
                    }
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: '#414B5E'
                    }
                },
                axisTick: {
                    show: false
                }

            }],
            series: setSeries()

        };
        echart.setOption(option);
        $(window).resize(function () {
            $(echart).resize();
        });

        function getDataType(type) {
            var arr = [];
            data.forEach(function (element) {
                if (['workOrder', 'water', 'elec'].indexOf(type) != -1) {
                    arr.push(element[type]);
                } else {
                    arr.push(element[type]);
                }
            });
            return arr;
        };

        function setSeries() {
            var dataType = {
                'workOrder': ['完成率', '#1790CF']
            };
            var arr = [];
            var typeSeries = {};
            $('li .active').each(function () {
                var type = $(this).attr('type');
                var temp = dataType[type][0];
                typeSeries = {
                    name: temp,
                    type: 'bar',
                    stack: '总量',
                    barGap: 0.1,
                    barCategoryGap: 0.01,
                    itemStyle: {
                        normal: {
                            label: {
                                show: true,
                                position: 'top',
                                formatter:function(params){
                                    return params.value[1];
                                }
                            },
                            shadowBlur: 80,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    },
                    data: getDataType(type).map(function(a,idx){
                        return [idx, a, idx];
                    })
                }
                arr.push(typeSeries);
            });
            return arr;
        }
    }

    initTimeQuery() {
        var now = new Date();
        var month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        $('#iptTime').val(month[now.getMonth()] + ' ' + now.getFullYear());
        $('#choiceTime').datetimepicker({
            Format: 'yyyy-mm',
            autoclose: true,
            startView: 3,
            minView: 3,
            todayHighlight: true
        });
        $('#choiceTime').datetimepicker().on('changeMonth', function (ev) {
            $('#iptTime').val(month[ev.date.getMonth()] + ' ' + ev.date.getFullYear());
        });

    }
    attachEvent() {
        var _this = this;
        $('.btnLegend').off('click').on('click', 'li', function (e) {
            $(this).find('span:first-child').toggleClass('active');
            _this.initModule();
        });
    }

    sortData() {
        var data = [];
        var dataBranch = this.screen.dataBranch;
        var selectedId = this.selectedNode;
        for (var key in dataBranch) {
            dataBranch[key].total = 0;
        }
        $('li .active').each(function () {
            var type = $(this).attr('type');
            for (var i = 0, len = selectedId.length; i < len; i++) {
                var selectedData = dataBranch[selectedId[i]];
                if (dataBranch[selectedId[i]].total == undefined) {
                    dataBranch[selectedId[i]].total = 0;
                }
                dataBranch[selectedId[i]].total += parseFloat(selectedData[type]);
            }
        });
        for (var i = 0, len = selectedId.length; i < len; i++) {
            data.push(dataBranch[selectedId[i]]);
        }
        data.sort(function (a, b) {
            return a.total - b.total;
        });
        return data;
    }
    close() {
        this.screen = null;
    }
}