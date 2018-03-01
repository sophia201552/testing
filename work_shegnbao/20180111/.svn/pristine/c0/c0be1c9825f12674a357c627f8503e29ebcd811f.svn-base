class PlatformStandardModule {
    constructor(screen) {
        var _this = this;
        this.screen = screen;
        this.container = null;
        this.selectedNode = null;
        this.zTreeObj = undefined;
        this.arrLegend = [];
        this.dataType = {};
        this.colorArray = ['#45ABFF', '#71D360', '#FFD428'];
        this.typeList = [];
        this.dataEnergyMDetail = screen.dataBranch
        this.dataTree = [{
            "name": "全楼",
            open: true,
            children: [{
                    "name": "冷站",
                    "target": "",
                    open: true,
                    children: [{
                            name: '机房COP',
                            type: 'CPRoomCOP'
                        },
                        {
                            name: '主机COP',
                            type: 'hostCOP'
                        },
                        {
                            name: '运行主机平均负载率',
                            type: 'hostAvrgLoad'
                        },
                        {
                            name: '冷冻水供水温度',
                            type: 'chillSupplyTemp'
                        },
                        {
                            name: '冷冻水回水温度',
                            type: 'chillReturnTemp'
                        },
                        {
                            name: '冷冻水供回水温差',
                            type: 'chillDiffTemp'
                        },
                        {
                            name: '冷却水供水温度',
                            type: 'coolingSupplyTemp'
                        },
                    ]
                },
                {
                    "name": "锅炉房",
                    "target": ""
                },
                {
                    "name": "空调末端",
                    "target": ""
                },
                {
                    "name": "照明",
                    "target": ""
                }
            ]
        }];

    }

    show(ids) {
        this.container = document.querySelector('.echartModule');
        this.init();
        this.selectedNode = ids;
    }

    init() {
        var _this = this;
        WebAPI.get('/static/app/Platform/views/module/platformStandardModule.html').done(function (result) {
            $('.echartModule').html(result);
            _this.initLegend();
            _this.initModule();
            _this.attachEvent();
        }).always(function () {
            I18n.fillArea($('#containerDisplayboard'));
        });
    }
    initLegend() {
        var colorArray = ['#45ABFF', '#71D360', '#FFD428'];
        var typeList = this.screen.opt.option.point;
        var dom = '',unit ='';
        var noUnitArray = ['Electricity (kWh/m²)','Water (m³/m²)','Gas (m³/m²)'];
        unit = this.getFirstAttr(this.dataEnergyMDetail);
        for (var i = 0; i < typeList.length; i++) {
            var index = i;
            var rowList = typeList[index];
            var legendUnit = unit.info?'(' + unit.info.unit +')':'';
            var legendText = noUnitArray.indexOf(rowList['name']) > -1 ?  rowList['name']:rowList['name'] + legendUnit;
            this.dataType[rowList['name']] = [rowList['name'], colorArray[index]];
            this.typeList.push(rowList['name']);
            dom += '<li><span class="gas active" style="background:' + colorArray[index] + '" type="' + rowList['name'] + '">\
            </span><span style="max-width:110px;"> ' + legendText +'</span></li>';
        }
        $('#ulLegend').empty().append(dom);
    }
    getFirstAttr(obj) {
        for (var k in obj) return obj[k];
    }
    initModule() {
        var _this = this;
        var data = this.sortData();
        var height = this.selectedNode.length * 40 + 10;
        $('.crosswiseChart').css({
            'height': height
        })
        var echart = echarts.init(document.querySelector('.crosswiseChart'));
        var isDetail = $('#ulLegend').hasClass('hidden');
        var option = {
            tooltip: {
                trigger: 'axis',
                formatter: function (params) {
                    var str = '';
                    var total = 0;

                    var l = isDetail ? $('li .active', '#ulDetailLegend').length : $('li .active', '#ulLegend').length;
                    for (var i = 0; i < l; i++) {
                        str += params[i].seriesName + ' : ' + params[i].value + '<br/>';
                        if (l > 1) {
                            total += parseFloat(params[i].value);
                        }
                    }
                    if (l > 1) {
                        str += 'Total' + ' : ' + total.toFixed(2);
                    }

                    if (!isDetail) {
                        /*str += '<br/><span style="color:#E0BC2B;">单击柱图查看详情</span>';*/
                    }
                    return str;
                },
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                x: 200,
                right: 100,
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
                data: AppConfig.language == 'en' ?getDataType('name_en'):getDataType('name_cn'),
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#DFE2E5'
                    }
                },
                offset: 0,
                scale: false,
                axisLabel: {
                    show: true,
                    margin: 10,
                    textStyle: {
                        color: '#354052'
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
        echart.setOption(option);
        $(window).resize(function () {
            $(echart).resize();
        });

        /*        !isDetail && echart.on('click', (params) => {
                    var $echartPlane = $('.echartPlane').addClass('part');
                    var $treePane = $('.treePane').removeClass('hidden');
                    var $btnBack = $('#btnBack').removeClass('hidden').off('click').on('click', function(){
                        $('[data-type="energyManage"]').click();
                    });

                    var $ulDetailLegend = $('#ulDetailLegend').removeClass('hidden');
                    var $ulLegend = $('#ulLegend').addClass('hidden');

                    !this.zTreeObj && this.initTree();
                    
                    //todo 缓兵之计
                    $('#tree_3 a').click();
                });*/

        function getDataType(type) {
            var arr = [];
            data.forEach(function (element, index) {
                if (_this.typeList.indexOf(type) != -1) {
                    Object.keys(element.data).forEach(function (ele) {
                        if (ele == type) {
                            var val = parseFloat(element.data[ele]);
                            val = (!(isNaN(val)) && val > 0) ? val.toFixed(2) : '--';                      
                            arr.push(val);
                        }else{
                            arr.push(0);
                        }
                    })
                } else {
                    arr.push(element[type]);
                }
            });
            return arr;
        };

        function setSeries() {
            var series = [];
            if (!_this.arrLegend || _this.arrLegend.length === 0) {
                series = getNormalSeries();
            } else if (_this.arrLegend.length > 0) {
                series = getTreeSeries();
            }
            return series;
        }

        function getNormalSeries() {
            var arr = [];
            var typeSeries = {};
            var dataType = _this.dataType;
            $('li .active', '#ulLegend').each(function () {
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
                        }
                    },
                    label: {
                        normal: {
                            show: true,
                            position: "right",
                            textStyle: {
                                color: '#000000'
                            },
                        }
                    },
                    data: getDataType(type)
                }
                arr.push(typeSeries);
            });
            return arr;
        }

        function getTreeSeries() {
            var dataType = {
                CPRoomCOP: ['机房COP', '#1790CF'],
                hostCOP: ['主机COP', '#1C7099'],
                hostAvrgLoad: ['运行主机平均负载率', '#88B0BB'],
                chillSupplyTemp: ['冷冻水供水温度', '#AD61A4'],
                chillReturnTemp: ['冷冻水回水温度', 'lightseagreen'],
                chillDiffTemp: ['冷冻水供回水温差', '#65B1CA '],
                coolingSupplyTemp: ['冷却水供水温度', '#CA9A49'],
            };
            var arr = [];
            var typeSeries = {};
            $('li .active', '#ulDetailLegend').each(function () {
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


    attachEvent() {
        var _this = this;
        $('.btnLegend').off('click').on('click', 'li', function (e) {
            var spanColor = $(this).find('span:first-child');
            var index = $(e.currentTarget).index();
            spanColor.toggleClass('active');
            if (spanColor.hasClass('active')) {
                spanColor.css({
                    'background': _this.colorArray[index]
                });
            } else {
                spanColor.css({
                    'background': '#ccc'
                });
            }

            _this.initModule();
        });
    }

    sortData() {
        if (!this.arrLegend || this.arrLegend.length == 0) {
            var data = [];
            var dataBranch = this.screen.dataBranch;
            var selectedId = this.selectedNode;
            for (var key in dataBranch) {
                dataBranch[key].total = 0;
            }
            $('li .active', '#ulLegend').each(function () {
                var type = $(this).attr('type');
                var dataTypeNum = [];
                for (var i = 0, len = selectedId.length; i < len; i++) {
                    var selectedData = dataBranch[selectedId[i]];
                    dataBranch[selectedId[i]].total = parseFloat(dataBranch[selectedId[i]].data[type])
                    if (!dataBranch[selectedId[i]].total) {
                        dataBranch[selectedId[i]].total = 0;
                    }                    
/*                    dataTypeNum.push(dataBranch[selectedId[i]].data);
                    dataTypeNum.forEach(function (element) {
                        dataBranch[selectedId[i]].total += parseFloat(element[type]);
                    })*/
                }
            });
            for (var i = 0, len = selectedId.length; i < len; i++) {
                data.push(dataBranch[selectedId[i]]);
            }
            data.sort(function (a, b) {
                return a.total - b.total;
            });
            return data;
        } else {
            var data = [];
            var dataBranch = this.dataEnergyMDetail
            var selectedId = this.selectedNode;
            for (var key in dataBranch) {
                dataBranch[key].total = 0;
            }

            $('li .active', '#ulDetailLegend').each(function () {
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

    }

    close() {
        this.screen = null;
    }

    initTree() {
        var _this = this;
        var setting = {
            view: {
                selectedMulti: false
            },
            callback: {
                onClick: zTreeOnClick
            }
        };



        this.zTreeObj = $.fn.zTree.init($("#tree"), setting, this.dataTree);

        function zTreeOnClick(event, treeId, treeNode) {
            $('#ulDetailLegend li .active').removeClass('active');
            $('#ulDetailLegend .' + treeNode.type).addClass('active').parent().show().siblings().hide();
            //todo
            _this.arrLegend = [treeNode.type];

            _this.initModule();
        }

    }
}