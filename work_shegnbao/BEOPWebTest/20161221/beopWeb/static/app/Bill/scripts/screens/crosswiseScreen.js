/**
 * Created by vivian on 2016/11/7.
 */
class crosswiseScreen {
    constructor(screen) {
        this.screen = screen;
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
        WebAPI.get('static/app/Bill/views/screens/crosswiseScreen.html').done(function (result) {
            $('.panelBmModule').html(result);
            _this.initTimeQuery();
            _this.initModule();
            _this.attachEvent();
        });
    }

    initModule() {
        var _this = this;
        var data = _this.sortData();
        var echart = echarts.init(document.querySelector('.crosswiseChart'));
        var option = {
            tooltip: {
                trigger: 'axis',
                formatter: function (params) {
                    var str = '';
                    var total = 0;
                    var l = $('li .active').length;
                    for (var i = 0; i < l; i++) {
                        str += params[i].seriesName + ' : ' + params[i].value + '<br/>';
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
                x: 240,
                top: 0,
                height: this.selectedNode.length * 40
            },
            calculable: true,
            xAxis: [
                {
                    type: 'value',
                    show: false,
                }
            ],
            yAxis: [
                {
                    type: 'category',
                    data: getDataType('name'),
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: '#414B5E'
                        }
                    },
                    offset: 0,
                    scale: false,
                    axisLabel: {
                        show: true,
                        margin: 10,
                        textStyle: {
                            color: '#FFFFFF'
                        }
                    },
                    splitLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    }
                }
            ],
            series: setSeries()

        };
        echart.setOption(option);
        $(window).resize(function () {
            $(echart).resize();
        });

        function getDataType(type) {
            var arr = [];
            data.forEach(function (element) {
                if (['gas', 'water', 'elec'].indexOf(type) != -1) {
                    arr.push(element[type].toFixed(2));
                }
                else {
                    arr.push(element[type]);
                }
            });
            return arr;
        };
        function setSeries() {
            var dataType = {
                'elec': ['Electricity', '#1790CF'],
                'gas': ['Natural Gas', '#1C7099'],
                'water': ['Water', '#88B0BB']
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
                    barWidth: '20px',
                    barGap: '20px',
                    itemStyle: {normal: {color: dataType[type][1], label: {show: true, position: 'insideRight'}}},
                    label: {
                        normal: {
                            show: true,
                            textStyle: {
                                color: '#fff'
                            },
                        }
                    },
                    data: getDataType(type)
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
         $('.btnLegend').off('click').on('click', 'li',function(e){
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

    destroy() {
        this.screen = null;
    }
}