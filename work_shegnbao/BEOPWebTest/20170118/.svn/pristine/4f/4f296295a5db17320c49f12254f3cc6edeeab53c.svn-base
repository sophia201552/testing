class TempComfort {
    constructor(opt) {
        var _this = this;
        this.screen = opt;
        this.container = null;
        this.selectedNode = null;
        this.echart = undefined;
    }

    show(ids) {
        this.container = document.querySelector('.panelBmModule');
        this.init();
        this.selectedNode = ids;
    }

    init() {
        var _this = this;
        WebAPI.get('static/app/Benz/Kaide/views/tempComfortScreen.html').done(function (result) {
            $('.panelBmModule').html(result);
            _this.initTimeQuery();
            _this.initModule();
            _this.attachEvent();
        });
    }
    initModule(sort) {
        var data = this.sortData(sort);
        if(this.echart){
            this.echart.dispose();
        }
        this.echart = echarts.init(document.querySelector('.crosswiseChart'));
        
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
                        str += '总计' + ' : ' + total.toFixed(2);
                    }
                    str += '<br/><span style="color:#E0BC2B;">单击柱图查看详情</span>'
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
            xAxis: [{
                type: 'value',
                show: false,
            }],
            yAxis: [{
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
            }],
            series: setSeries()

        };
        this.echart.setOption(option);

        this.echart.on('click', function (params) {
            var render=new coldHotAnalysis();
            render.show();
        });
        $(window).resize(() => {
            $(this.echart).resize();
        });

        function getDataType(type) {
            var arr = [];
            data.forEach(function (element) {
                if (['tooHot', 'tooCold'].indexOf(type) != -1) {
                    arr.push(element[type].toFixed(2));
                } else {
                    arr.push(element[type]);
                }
            });
            return arr;
        };

        function setSeries() {
            var dataType = {
                'tooHot': ['过热', 'rgb(157,130,62)'],
                'tooCold': ['过冷', 'rgb(49,88,160)']
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
                    itemStyle: {
                        normal: {
                            color: dataType[type][1],
                            label: {
                                show: true,
                                position: 'insideRight'
                            }
                        }
                    },
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
        $('.btnLegend').off('click').on('click', 'li', function (e) {
            $(this).find('span:first-child').toggleClass('active');
            _this.initModule();
        });

        //排序
        $('#btnSort').off('click').on('click', e => {
            if($(e.target).hasClass('up')){
                this.initModule(1);
            }else{
                this.initModule(0);
            }
            $(e.target).toggleClass('up');
        });
    }

    sortData(sort) {//sort==1 升序:asc sort==0 降序des
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
            if(sort && sort == 1){
                return b.total - a.total;
            }else{
                return a.total - b.total;
            }
        });
        return data;
    }
    close() {
        this.screen = null;
    }
}