class EnergyManage {
    constructor(opt) {
        var _this = this;
        this.screen = opt;
        this.container = null;
        this.selectedNode = null;
        this.zTreeObj = undefined;
        this.arrLegend = [];

        this.dataEnergyMDetail =
        {
            'xxx12312': {
                id: 'xxx12312',
                name: '长宁来福士广场',
                CPRoomCOP: 3.4,
                hostCOP: 4.6,
                hostAvrgLoad: 81,
                chillSupplyTemp: 10.9,
                chillReturnTemp: 14.2,
                chillDiffTemp: 3.3,
                coolingSupplyTemp: 27.8
            },
            'xxx12313': {
                id: 'xxx12313',
                name: '上海来福士广场',
                CPRoomCOP: 3.9,
                hostCOP: 5.7,
                hostAvrgLoad: 73,
                chillSupplyTemp: 8.4,
                chillReturnTemp: 12.0,
                chillDiffTemp: 3.6,
                coolingSupplyTemp: 28.5
            },
            'xxx12314': {
                id: 'xxx12314',
                name: '杭州来福士中心',
                CPRoomCOP: 3.4,
                hostCOP: 4.8,
                hostAvrgLoad: 76,
                chillSupplyTemp: 9.3,
                chillReturnTemp: 11.9,
                chillDiffTemp: 2.6,
                coolingSupplyTemp: 26.1
            },
            'xxx12315': {
                id: 'xxx12315',
                name: '宁波来福士广场',
                CPRoomCOP: 3.4,
                hostCOP: 5.1,
                hostAvrgLoad: 65,
                chillSupplyTemp: 8.0,
                chillReturnTemp: 11.6,
                chillDiffTemp: 3.6,
                coolingSupplyTemp: 28.5
            },
            'xxx12316': {
                id: 'xxx12316',
                name: '北京来福士中心',
                CPRoomCOP: 3.9,
                hostCOP: 5.8,
                hostAvrgLoad: 79,
                chillSupplyTemp: 10.0,
                chillReturnTemp: 13.6,
                chillDiffTemp: 3.6,
                coolingSupplyTemp: 29.5
            },
            'xxx12317': {
                id: 'xxx12317',
                name: '成都来福士广场',
                CPRoomCOP: 3.5,
                hostCOP: 5.3,
                hostAvrgLoad: 73,
                chillSupplyTemp: 10.7,
                chillReturnTemp: 13.6,
                chillDiffTemp: 2.9,
                coolingSupplyTemp: 25.1
            },
            'xxx12318': {
                id: 'xxx12318',
                name: '重庆来福士广场',
                tooCold:32,
                CPRoomCOP: 3.8,
                hostCOP: 5.0,
                hostAvrgLoad: 76,
                chillSupplyTemp: 8.5,
                chillReturnTemp: 11.8,
                chillDiffTemp: 3.3,
                coolingSupplyTemp: 28.4
            },
            'xxx12319': {
                id: 'xxx12319',
                name: '深圳来福士广场',
                CPRoomCOP: 3.4,
                hostCOP: 4.6,
                hostAvrgLoad: 85,
                chillSupplyTemp: 10.8,
                chillReturnTemp: 14.1,
                chillDiffTemp: 3.4,
                coolingSupplyTemp: 28.0
            },
            'xxx12320': {
                id: 'xxx12320',
                name: '天津国际贸易中心',
                CPRoomCOP: 3.3,
                hostCOP: 4.9,
                hostAvrgLoad: 69,
                chillSupplyTemp: 10.2,
                chillReturnTemp: 13.5,
                chillDiffTemp: 3.3,
                coolingSupplyTemp: 28.0
            },
            'xxx12321': {
                id: 'xxx12321',
                name: '凯德公园1号',
                CPRoomCOP: 3.2,
                hostCOP: 4.4,
                hostAvrgLoad: 67,
                chillSupplyTemp: 8.6,
                chillReturnTemp: 11.3,
                chillDiffTemp: 2.7,
                coolingSupplyTemp: 27.7
            },
            'xxx12322': {
                id: 'xxx12322',
                name: '大坦沙岛地区更新改造项目',
                CPRoomCOP: 3.4,
                hostCOP: 5.1,
                hostAvrgLoad: 80,
                chillSupplyTemp: 10.6,
                chillReturnTemp: 13.9,
                chillDiffTemp: 3.3,
                coolingSupplyTemp: 27.9
            },
            'xxx12323': {
                id: 'xxx12323',
                name: '凯德龙之梦虹口',
                CPRoomCOP: 3.4,
                hostCOP: 4.9,
                hostAvrgLoad: 77,
                chillSupplyTemp: 10.4,
                chillReturnTemp: 13.2,
                chillDiffTemp: 2.7,
                coolingSupplyTemp: 29.9
            },
            'xxx12324': {
                id: 'xxx12324',
                name: '凯德龙之梦闵行',
                CPRoomCOP: 3.6,
                hostCOP: 5.5,
                hostAvrgLoad: 79,
                chillSupplyTemp: 9.8,
                chillReturnTemp: 13.5,
                chillDiffTemp: 3.7,
                coolingSupplyTemp: 26.3
            },
            'xxx12325': {
                id: 'xxx12325',
                name: '凯德晶萃广场',
                CPRoomCOP: 3.2,
                hostCOP: 4.5,
                hostAvrgLoad: 76,
                chillSupplyTemp: 9.0,
                chillReturnTemp: 11.7,
                chillDiffTemp: 2.8,
                coolingSupplyTemp: 28.5
            },
            'xxx12326': {
                id: 'xxx12326',
                name: '凯德天府',
                CPRoomCOP: 3.6,
                hostCOP: 5.1,
                hostAvrgLoad: 87,
                chillSupplyTemp: 8.4,
                chillReturnTemp: 12.0,
                chillDiffTemp: 3.6,
                coolingSupplyTemp: 28.5
            },
            'xxx12327': {
                id: 'xxx12327',
                name: '苏州中心',
                CPRoomCOP: 3.8,
                hostCOP: 5.2,
                hostAvrgLoad: 86,
                chillSupplyTemp: 10.9,
                chillReturnTemp: 14.0,
                chillDiffTemp: 3.1,
                coolingSupplyTemp: 27.3
            },
            'xxx12328': {
                id: 'xxx12328',
                name: '凯德广场新地城',
                CPRoomCOP: 3.3,
                hostCOP: 4.4,
                hostAvrgLoad: 62,
                chillSupplyTemp: 9.8,
                chillReturnTemp: 12.4,
                chillDiffTemp: 2.6,
                coolingSupplyTemp: 29.6
            },
            'xxx12329': {
                id: 'xxx12329',
                name: '凯德西城',
                CPRoomCOP: 3.9,
                hostCOP: 5.6,
                hostAvrgLoad: 67,
                chillSupplyTemp: 9.1,
                chillReturnTemp: 12.3,
                chillDiffTemp: 3.2,
                coolingSupplyTemp: 26.0
            },
            'xxx12330': {
                id: 'xxx12330',
                name: '凯德星贸中心',
                CPRoomCOP: 3.3,
                hostCOP: 4.5,
                hostAvrgLoad: 88,
                chillSupplyTemp: 10.3,
                chillReturnTemp: 13.4,
                chillDiffTemp: 3.1,
                coolingSupplyTemp: 27.4
            }
        };

        this.dataTree = [
            {"name":"全楼", open:true, children: [
                { "name":"冷站", "target":"", open: true, children: [
                    {name: '机房COP', type: 'CPRoomCOP'},
                    {name: '主机COP', type: 'hostCOP'},
                    {name: '运行主机平均负载率', type: 'hostAvrgLoad'},
                    {name: '冷冻水供水温度', type: 'chillSupplyTemp'},
                    {name: '冷冻水回水温度', type: 'chillReturnTemp'},
                    {name: '冷冻水供回水温差', type: 'chillDiffTemp'},
                    {name: '冷却水供水温度', type: 'coolingSupplyTemp'},
                ]},
                { "name":"锅炉房", "target":""},
                { "name":"空调末端", "target":""},
                { "name":"照明", "target":""}
                ]
            }
        ];

    }

    show(ids) {
        this.container = document.querySelector('.panelBmModule');
        this.init();
        this.selectedNode = ids;
    }

    init() {
        var _this = this;
        WebAPI.get('static/app/Benz/Kaide/views/energyManageScreen.html').done(function (result) {
            $('.panelBmModule').html(result);
            _this.initTimeQuery();
            _this.initModule();
            _this.attachEvent();
        });
    }
    initModule() {
        var _this = this;
        var data = this.sortData();
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
                        str += '总计' + ' : ' + total.toFixed(2);
                    }

                    if(!isDetail){
                        str += '<br/><span style="color:#E0BC2B;">单击柱图查看详情</span>';
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
        echart.setOption(option);
        $(window).resize(function () {
            $(echart).resize();
        });

        !isDetail && echart.on('click', (params) => {
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
        });

        function getDataType(type) {
            var arr = [];
            data.forEach(function (element) {
                if (['gas', 'water', 'elec', 'CPRoomCOP', 'hostCOP','hostAvrgLoad','chillSupplyTemp','chillReturnTemp','chillDiffTemp','coolingSupplyTemp'].indexOf(type) != -1) {
                    arr.push(element[type].toFixed(2));
                } else {
                    arr.push(element[type]);
                }
            });
            return arr;
        };

        function setSeries() {
            var series = [];
            if(!_this.arrLegend || _this.arrLegend.length === 0){
                series = getNormalSeries();
            }else if(_this.arrLegend.length > 0){
                series = getTreeSeries();
            }
            return series;
        }

        function getNormalSeries(){
            var dataType = {
                'water': ['水', '#1790CF'],
                'elec': ['电', '#1C7099'],
                'gas': ['气', '#88B0BB']
            };
            var arr = [];
            var typeSeries = {};
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

        function getTreeSeries(){
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
        if(!this.arrLegend || this.arrLegend.length == 0){
            var data = [];
            var dataBranch = this.screen.dataBranch;
            var selectedId = this.selectedNode;
            for (var key in dataBranch) {
                dataBranch[key].total = 0;
            }
            $('li .active', '#ulLegend').each(function () {
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
        }else{
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

    initTree(){
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

        function zTreeOnClick(event, treeId, treeNode){
            $('#ulDetailLegend li .active').removeClass('active');
            $('#ulDetailLegend .'+ treeNode.type).addClass('active').parent().show().siblings().hide();
            //todo
            _this.arrLegend = [treeNode.type];

            _this.initModule();
        }

    }
}
