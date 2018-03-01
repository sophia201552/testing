var ModalCumulantChart = (function(){
    function ModalCumulantChart(screen, entityParams, _renderModal, _updateModal, _showConfigMode) {
        if(!screen) return;
        var renderModal = _renderModal ? _renderModal : this.renderModal;
        var updateModal = _updateModal ? _updateModal : this.updateModal;
        var showConfigMode = _showConfigMode ? _showConfigMode : this.showConfigMode;
        ModalBase.call(this, screen, entityParams, renderModal, updateModal, showConfigMode);
        this.m_bIsGoBackTrace = false;
        this.m_traceData = undefined;
    };
    ModalCumulantChart.prototype = new ModalBase();
    ModalCumulantChart.prototype.optionTemplate ={
        name:'toolBox.modal.CUMULANT_CHART',
        parent:0,
        mode:'custom',
        maxNum: 5,
        title:'',
        minHeight:2,
        minWidth:3,
        maxHeight:6,
        maxWidth:12,
        type:'ModalCumulantChart',
        scroll:false,
        needRefresh:false
    };
    ModalCumulantChart.prototype.configModalOptDefault={
        "header" : {
            "needBtnClose" : true,
            "title" : "配置"
        },
        "area" : [
            {
                "module": 'timeConfig',

            },
            {
                'type': 'option',
                widget:[{
                    type: 'select',
                    name: '图表类型',
                    id:'chartType',
                    opt: {
                        attr:{
                            class:'form-inline'
                        },
                        option: [
                            {val: 'bar', name: '柱图'},
                            {val: 'line', name: '折线图'}
                        ]
                    }
                },
                {
                    type: 'checkbox',
                    name: '启用堆叠',
                    id:'isStack',
                    opt: {
                    }
                }
                ]
            },
            {
                "module" : "dsDrag",
                "data":[{
                    type:'point',name:'数据点位',data:[],forChart:false
                }]
            },{
                'type':'footer',
                "widget":[{type:'confirm',opt:{needClose:false}},{type:'cancel'}]
            }
        ],
        "result":{}
    };
    ModalCumulantChart.prototype.initConfigModalOpt = function(){
        var _this = this;
        if(this.entity.modal.option) {
            (this.entity.modal.option.dsItemIds instanceof Array) && (this.configModalOpt.area[2].data[0].data = this.entity.modal.option.dsItemIds);
            (this.entity.modal.option.chartType) && (this.configModalOpt.area[1].widget[0].data = {val: this.entity.modal.option.chartType});
            (this.entity.modal.option.isStack) && (this.configModalOpt.area[1].widget[1].data = this.entity.modal.option.isStack);
            (this.entity.modal.option.timeStart && this.entity.modal.option.timeEnd) && (this.configModalOpt.area[0].data = {
                mode: '1',
                date: {
                    startTime: this.entity.modal.option.timeStart,
                    endTime: this.entity.modal.option.timeEnd
                },
                format: this.entity.modal.option.timeFormat
            });
        }
        this.configModalOpt.result.func = function(option){
            _this.setModalOption(option);
            _this.configModal.hide();
        }
    };
    ModalCumulantChart.prototype.optionDefault = {
        
    };
    
    ModalCumulantChart.prototype.renderModal = function(){
        var postData =
            {
                timeStart:this.entity.modal.option.timeStart,
                timeEnd:this.entity.modal.option.timeEnd,
                timeFormat:this.entity.modal.option.timeFormat,
                dsItemIds:this.entity.modal.option.dsItemIds
            };
        var _this = this;
        WebAPI.post('/analysis/startWorkspaceDataGenHistogram/increment',postData).done(function(result){
            var arrLegend = _this.entity.modal.option.dsItemIds.map(function(point){
                var point = AppConfig.datasource.getDSItemById(point);
                return (point.alias?point.alias:point.value);
            });
            var arrSeries = [];
            for (var i =0 ;i < result.list.length ;i++){
                arrSeries.push(
                    {
                        name:arrLegend[i],
                        type:_this.entity.modal.option.chartType,
                        areaStyle: {normal: {}},
                        stack:_this.entity.modal.option.isStack,
                        data:result.list[i].data.map(function(data){
                            var val = parseFloat(data);
                            if(!(isNaN(val)) ){
                                return val.toFixed(2);
                            }else{
                                return 0
                            }
                        })
                    }
                );
            }
            var opt = {
                text:'历史累积量折线图',
                legend:{
                    data:arrLegend,
                    top:10
                },
                grid:{
                    left:40,
                    right:20,
                    top:35
                },
                tooltip:{
                    trigger:'axis'
                },
                //toolbox:{
                //    show:true,
                //    feature:{
                //        magicType:['line', 'bar', 'stack']
                //    }
                //},
                toolbox: {
                    showTitle:true,
                    feature: {
                        magicType:{
                            type:['line', 'bar', 'stack','tiled']
                        }
                    }
                },
                xAxis:{
                    data:result.timeShaft.slice(1),
                    type: 'category',
                    axisLabel:{
                        formatter: function (value, index) {
                            // 格式化成月/日，只在第一个刻度显示年份
                            var date = new Date(value);
                            var texts;
                            if (index === 0) {
                                texts = date.format('yyyy-MM-dd') + '\n' + date.format('HH:mm:ss');
                            }else{
                                var preDate = new Date(result.timeShaft[index - 1]);
                                if(preDate.format('yyyy-MM-dd') == date.format('yyyy-MM-dd')) {
                                    texts = date.format('HH:mm:ss')
                                }else{
                                    texts = date.format('yyyy-MM-dd') + '\n' + date.format('HH:mm:ss');
                                }
                            }
                            return texts;
                        }

                    }
                },
                yAxis : [
                    {
                        type : 'value'

                    }
                ],
                series:arrSeries
            };
            var chart = echarts.init(_this.container,AppConfig.chartTheme);
            chart.setOption(opt);
            _this.spinner.stop();
        })
    };
    ModalCumulantChart.prototype.updateModal = function(points){
        
    };
    ModalCumulantChart.prototype.showConfigMode = function(){
        
    };
    
    ModalCumulantChart.prototype.setModalOption = function(option){
        this.entity.modal.interval = 5;
        this.entity.modal.points = [];
        this.entity.modal.option = {
            timeStart:option.startTime,
            timeEnd:option.endTime,
            timeFormat:option.format,
            dsItemIds:option.points[0],
            isStack:option.isStack?1:0,
            chartType:option.chartType.val
        };
    };
    ModalCumulantChart.prototype.goBackTrace = function (data) {
        
    };

    return ModalCumulantChart;
})();