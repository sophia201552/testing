
 /*Created by vicky on 2015/10/13.
 */

/* dark theme for echart start */
var theme = window.theme || {};
theme.Mobile = {
    backgroundColor: 'transport',
    color: [
        '#E2583A','#FD9F08','#1D74A9','#04A0D6','#689C0F','#109d83','#FEC500'
    ],   
    title: {
        textStyle: {
            fontWeight: 'normal',
            color: '#d8d6df',
            fontSize:15,
        },
        left:'center'
    },
    legend: {
        textStyle: {
            "color": '#a2adbc',
            "fontSize": ((typeof device == "object" && device.platform =="iOS")?10:2),
            "line-hegiht":10        
        },
        orient: 'horizontal',
        left:'center',
        "itemGap": 10,
        "itemWidth": 20,
        "itemHeight": 10,
        padding:2,
        top:30,
        data:[]
    },
    visualMap:{
        itemWidth: 15,
        color: ['#FFF808','#21BCF9'],
        textStyle: {
            color: '#ccc'
        }
    },
    toolbox: {
        show:false,
        showTitle:false
    },
    tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(0,0,0,0.6)',
        axisPointer : {
            type : 'line',
            lineStyle : {
                color: '#aaa'
            },
            crossStyle: {
                color: '#aaa'
            },
            shadowStyle : {
                color: 'rgba(200,200,200,0.2)'
            }
        },
        textStyle: {
            color: '#ffffff'
        }
    },
    dataZoom: {
        dataBackgroundColor: '#555',
        fillerColor: 'rgba(200,200,200,0.2)',
        handleColor: '#eee'
    },
    grid: {
        borderWidth: 0,
        left:40,
        bottom:80,
        right:40,
        top:80,
        containLabel :true
    },
    valueAxis:{
        axisLine: {
            show:false
        },
        axisTick: {
            show: false
        },
        axisLabel: {
            textStyle: {
                color: '#a2adbc',
                fontSize:((typeof device == "object" && device.platform =="iOS")?10:2),
            },
            formatter : function (value, index) {
                var arrLevel = ['','K','M','G']
                var num = parseFloat(value);
                var texts = '';
                if(isNaN(num)){
                    texts = value;
                }else{
                    texts = parseFloat(num.toFixed(2));
                    for (var i = 0 ; i <arrLevel.length ;i++){
                        if(Math.abs(value/Math.pow(1000,i)) >= 1 ){
                            num = value/Math.pow(1000,i);
                            texts = parseFloat(num.toFixed(2)) + arrLevel[i]
                        }else{
                            break;
                        }
                    }
                }
                return texts;
            },
        },
        splitLine: {
            lineStyle: {
                color: ['#4e5d77'],
                type:"solid",
                opacity:'0.6'
            }
        },
        nameTextStyle:{
            color:'#d8d6df',
            fontSize:((typeof device == "object" && device.platform =="iOS")?12:2),
        },
        nameLocation:"middle",
        nameGap:45
    },
    categoryAxis: {
        interval:0,
        axisLine: {
            lineStyle: {
                color: '#4e5d77'
            }
        },
        axisTick: {
            show: false
        },
        axisLabel: {
            textStyle: {
                color: '#d8d6df',
                fontSize:((typeof device == "object" && device.platform =="iOS")?10:2),
            },
            margin:10,
            rotate : 270,
            interval:2,
            formatter : function (value, index) {
                // 格式化成月/日，只在第一个刻度显示年份
                var date = moment?new Date(+moment(value)):new Date(value);
                // if(date == 'Invalid Date'){
                //     date = moment?new Date(+moment(new Date().getFullYear() + '-' + value)):new Date(new Date().getFullYear() + '-' + value);
                // }
                if(date == 'Invalid Date')return value;
                var texts =date.format('MM-dd HH:mm');
                // if (index === 0) {
                //     texts = date.format('MM-dd');
                // }
                return texts;
            }
        },
        splitLine: {
            show: false
        },
        nameTextStyle:{
            color:'#d8d6df',
            fontSize:((typeof device == "object" && device.platform =="iOS")?10:2),
        }
    },

    // yAxis: [{},{splitLine:{show:false}}],
    textStyle: {
        fontFamily: 'Microsoft YaHei, Arial, Verdana, sans-serif'
    },
    polar : {
        name : {
            textStyle: {
                color: '#ccc'
            }
        },
        axisLine: {
            lineStyle: {
                color: '#ddd'
            }
        },
        splitArea : {
            show : true,
            areaStyle : {
                color: ['rgba(250,250,250,0.2)','rgba(200,200,200,0.2)']
            }
        },
        splitLine : {
            lineStyle : {
                color : '#ddd'
            }
        }
    },
    timeline : {
        label: {
            textStyle:{
                color: '#ccc'
            }
        },
        lineStyle : {
            color : '#aaa'
        },
        controlStyle : {
            normal : { color : '#fff'},
            emphasis : { color : '#FE8463'}
        },
        symbolSize : 3
    },
    /*各种图*/
    line:{ //带阴影的曲线
        smooth : true,
        showSymbol :false
    },
    pie:{
        type:'pie',
        radius: ['50%', '70%'],
        labelLine: {
            normal: {
                show: true,
                lineStyle:{
                    width:[2]
                }
            }
        },
        hoverAnimation:false
    },
    gauge:{
        center:['50%','70%'],
        itemStyle:{
            normal:{
                color:['#d7603f']
            }
        },
        detail : {
            offsetCenter:['0','20%'],
            textStyle: {
                color: '#ccc'
            }
        },
        radius:'105%',
        data: [{value: 50, name: '完成率'}],
        startAngle: 180,
        endAngle:0,
        axisLine:{ // 坐标轴线
            show: true,
            lineStyle: {
                color: [[0.25, '#04A0D6'],[0.5, '#689C0F'],[0.75, '#FEC500'],[1, '#109d83']],
                width:5
            }
        },
        axisTick: {// 坐标轴小标记
            length :35,
            lineStyle: {
                color: 'auto',
                width:3
            }
        },
        axisLabel: {//刻度标签
            textStyle: {
                color: '#a2adbc'
            }
        },
        splitLine: {// 分隔线
            length :45,
            lineStyle: {
                width:4,
                color:'auto'
            }
        }
    }
/*力导向布局图    在3里面没找见*/
    // force : {
    //     itemStyle: {
    //         normal: {
    //             linkStyle : {
    //                 color : '#fff'
    //             }
    //         }
    //     }
    // },
};