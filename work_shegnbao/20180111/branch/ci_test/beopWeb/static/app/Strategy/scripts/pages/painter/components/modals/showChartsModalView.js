;
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([
            'exports',
            'React'
        ], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(
            exports,
            require('React')
        );
    } else {
        factory(
            root,
            namespace('React'),
            namespace('antd'),
            namespace('beop.strategy.common'),
            namespace('ReactEcharts')
        );
    }
}(namespace('beop.strategy.components.modals'), function(
    exports,
    React,
    antd,
    commonUtil,
    ReactEcharts
) {
    var h = React.h;
    var linkEvent = React.linkEvent;
    const { Input, Button, Modal } = antd;

    class ShowChartsModal extends React.Component{
        constructor(props, context) {
            super(props, context);
            const {isShow, title, chartsModalData} = this.props;
            this.state = {
                isShow,
                title,
                chartsModalData,
            }
            this.createCharts = this.createCharts.bind(this);
        }
        componentWillReceiveProps(props) {
            const {isShow, title, chartsModalData} = props;
            this.setState({
                isShow,
                title,
                chartsModalData,
            });
        }
        shouldComponentUpdate(nextprops, nextstate) {
            return true;
        }
        render() {
            const {isShow, title, chartsModalData} = this.state;
            const {doCancel, doOk} = this.props;
            return (
                h(Modal, {
                    maskClosable: false,
                    visible: isShow,
                    title: I18n.resource.modal.HISTORICAL_CURVE,
                    width: '90%',
                    onCancel: doCancel,
                    footer: null,
                    wrapClassName: 'vertical-center-modal'
                }, [this.createCharts(chartsModalData)])
            )
        }
        createCharts(chartsModalData) {
            let _this = this;
            let preventFn = function(e) { e.preventDefault(); };
            let data = {},list = [],timeShaft = [];
            if(chartsModalData){
                try{
                    data = JSON.parse(chartsModalData);
                    list = data.list;
                    timeShaft = data.timeShaft;
                    list.forEach(l=>{
                        l.data = l.data.map(v=>v.toFixed(2));
                    });
                }catch(e){
                    console.log(e);
                }
            }
            let defaultOpt = {// 默认色板
                color: [
                    '#2ec7c9','#b6a2de','#5ab1ef','#ffb980','#d87a80',
                    '#8d98b3','#e5cf0d','#97b552','#95706d','#dc69aa',
                    '#07a2a4','#9a7fd1','#588dd5','#f5994e','#c05050',
                    '#59678c','#c9ab00','#7eb00a','#6f5553','#c14089'
                ],

            // 图表标题
                title: {
                    textStyle: {
                        fontWeight: 'normal',
                        color: '#008acd'          // 主标题文字颜色
                    }
                },
                legend: {
                    textStyle: {
                        fontFamily: "Microsoft YaHei"
                    }
                },

                // 工具箱
                // toolbox: {
                //     x: 'right',
                //     y: 'center',
                //     feature: {
                //         mark: { show: true },
                //         magicType: { show: true, type: ['line', 'bar'] },
                //         restore: { show: true },
                //         saveAsImage: { show: true }
                //     },
                //     color : ['#1e90ff', '#1e90ff', '#1e90ff', '#1e90ff'],
                //     effectiveColor : '#ff4500'
                // },

                // 提示框
                tooltip: {
                    trigger: 'axis',
                    //backgroundColor: 'rgba(50,50,50,0.5)',     // 提示背景颜色，默认为透明度为0.7的黑色
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'line',         // 默认为直线，可选为：'line' | 'shadow'
                        lineStyle : {          // 直线指示器样式设置
                            color: '#008acd'
                        },
                        crossStyle: {
                            color: '#008acd'
                        },
                        shadowStyle : {                     // 阴影指示器样式设置
                            color: 'rgba(200,200,200,0.2)'
                        }
                    }
                },

                // // 区域缩放控制器
                // dataZoom: {
                //     dataBackgroundColor: '#efefff',            // 数据背景颜色
                //     fillerColor: 'rgba(182,162,222,0.2)',   // 填充颜色
                //     handleColor: '#008acd'    // 手柄颜色
                // },

                // 网格
                grid: (function(isMobile){//统一配置grid
                    var grid = {
                            borderWidth: 0,
                            borderColor: '#eee',
                            x: 70, y: 38, x2: 30, y2: 24
                        }
                    if(isMobile){
                        grid.x = 40;
                    }
                    return grid;
                }(AppConfig.isMobile)),

                // 类目轴
                categoryAxis: {
                    axisLine: {            // 坐标轴线
                        lineStyle: {       // 属性lineStyle控制线条样式
                            color: '#008acd'
                        }
                    },
                    splitLine: {           // 分隔线
                        lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                            color: ['#eee']
                        }
                    }
                },

                // 数值型坐标轴默认参数
                valueAxis: {
                    axisLine: {            // 坐标轴线
                        lineStyle: {       // 属性lineStyle控制线条样式
                            color: '#008acd'
                        }
                    },
                    splitArea : {
                        show : true,
                        areaStyle : {
                            color: ['rgba(250,250,250,0.1)','rgba(200,200,200,0.1)']
                        }
                    },
                    splitLine: {           // 分隔线
                        lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                            color: ['#eee']
                        }
                    }
                },

                // 柱形图默认参数
                bar: {
                    itemStyle: {
                        normal: {
                            barBorderRadius: 5
                        },
                        emphasis: {
                            barBorderRadius: 5
                        }
                    },
                    barMaxWidth: 80
                },

                // 折线图默认参数
                line: {
                    smooth : true,
                    symbol: 'none',  // 拐点图形类型
                    symbolSize: 0           // 拐点图形大小
                },

                textStyle: {
                    fontFamily: '微软雅黑, Arial, Verdana, sans-serif'
                }
            };
            return (
                h('div',{
                    style:{
                        width:'100%',
                        height:'auto',
                    },
                },[
                    h(ReactEcharts,{
                        style:{
                            width:'100%',
                            height:'400px'
                        },                       
                        option:$.extend(defaultOpt, {
                            grid: {
                                x: '10%',
                                x2:'5%',
                                y:'46',
                                y2:'30%',
                            },                            
                            legend: {
                                show:true,
                                data: (function(){
                                    var data = [];
                                    list.forEach(function(row,i){
                                        if(i === 0){
                                            data.push(row.dsItemId);
                                       }                                        
                                    });
                                    return data;
                                }()),
                                // y: '83%',
                                textStyle: {color:'#fff'}
                            },
                            xAxis : [
                                {
                                    type : 'category',
                                    boundaryGap: false,
                                    splitLine: false,
                                    axisLabel: {
                                        textStyle: {color:'#fff'}
                                    },
                                    data : timeShaft
                                }
                            ],
                            yAxis: [
                                {
                                    type: 'value',
                                    axisLabel: {
                                        textStyle: { color: '#fff' }
                                    },
                                    splitLine: {
                                        lineStyle: { 
                                            color: ['#85bbf7'],
                                            opacity: .2
                                        }
                                    },
                                    scale: true
                                }
                            ],
                            // series: list.map(item=>({name:item.dsItemId,type:'line',data:item.data,smooth: true}))
                            series: (function(){
                                var data = []
                                list.some((item,i)=> {
                                    if(i === 0){
                                        data.push({name:item.dsItemId,type:'line',data:item.data,smooth: true,showSymbol: false,})
                                        return true;
                                    }
                                })
                                return data;    
                            }()),
                        }),        
                        onEvents:{}
                    })
                ])
            )
        }
    };
    exports.ShowChartsModal = ShowChartsModal;
}));