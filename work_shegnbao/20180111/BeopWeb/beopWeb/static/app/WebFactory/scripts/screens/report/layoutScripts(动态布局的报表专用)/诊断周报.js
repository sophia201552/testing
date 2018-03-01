//外部接收的配置
var endTime = '{outEndTime}',
    startTime = '{outStartTime}',
    lan = "{lan}"||'zh',
    projectId = {projectId}?{projectId}:293;
//自定义配置
var CONFIG = {
    CHARTHEIGHT: 7,
    TEXTHEIGHT: 2,
    USE_NEW_DIAGNOSIS: 0,
    FORMAT_TIME: false,
    CUSTOM_FORMAT: timeFormatChange('mm-dd hh:ii:ss'),
    GOTO_OLD_REPORT_TEXT: lan=='zh'?'跳转到老版报表':'Old Report',
    GOTO_OLD_REPORT_TIME: '2017-07-01 00:00:00',
    GOTO_OLD_REPORT_LINK: 'http://beop.rnbtech.com.hk/observer#page=ReportScreen&reportId=%2214888550770445084e444568%22&reportType=%222%22&reportFolder=%22DiagWeekReport%22&reportDate=%22'+startTime.substring(0,10)+'%22&reportText=%22%E8%AF%8A%E6%96%AD%E5%91%A8%E6%8A%A5%22&projectId=72',
    START_WITH_SPACE: true
}

var promise0 = $.Deferred();
//跳转到老报表
if(+new Date(startTime)<=+new Date(CONFIG.GOTO_OLD_REPORT_TIME)){
    var layouts = [{
        id: ObjectId(),
        modal: {
            type: "ReportContainer",
            option:{
                layouts: [{
                    id: ObjectId(),
                    modal: {
                        type: "Html",
                        option:{
                            css: '',
                            html: '<a style="width:100%;text-align:center;font-size:16px;display:block;color:#ffbf00;margin-top:16px;" href="'+CONFIG.GOTO_OLD_REPORT_LINK+'" target="_blank">'+CONFIG.GOTO_OLD_REPORT_TEXT+'</a>',
                            js: ''
                        }
                    },
                    spanC:12,
                    spanR:1
                }],
            }
        },
        spanC:12,
        spanR:6
    }];
    promise0.resolve(layouts);
    return promise0;
}

var params = {
    projectId: projectId,
    startTime: startTime,
    endTime: endTime,
    lan: lan,
    useNewDiagnosis: CONFIG.USE_NEW_DIAGNOSIS
}

var promise1 = WebAPI.post('/diagnosis_v2/getReportTemplateContent', params),
    promise2 = WebAPI.post('/diagnosis_v2/getReportTemplateSummary', params),
    promise3 = WebAPI.post('/diagnosis_v2/getReportTemplateAppendix', params);
$.when(promise1,promise2,promise3).done(function(data, data2, data3){
    data = data[0].data;//图表数据
    data2 = data2[0].data;//汇总和故障排名数据
    data3 = data3[0].data;//附录数据
    var indextStyle = '';
    if(!CONFIG.START_WITH_SPACE){
        indextStyle = ' style="text-indent:0"';
    }
    //图表layouts Start
    var chapterContainer = function(){
        var chapterContainerI18n = {
            0:'{name1}。例如在从{time1}到{time2}的时间段内，{name2}存在此问题。{other}{advise}。',
            1:'等',
            2:'其余如{name3}也有类似问题。',
            3:'，'
        }
        if(lan === 'en'){
            chapterContainerI18n = {
                0:'For {name2}, {name1}. {other} {advise}.',
                1:'',
                2:'Other equipments like {name3} have the similar fault.',
                3:','
            }
        }
        return data.map(function(v){
            var layouts = v.units.map(function(v){
                var entitys = '';
                if(v.entity.length>1){
                    var tempArr = v.entity.map(function(v){return v.name});
                    tempArr.shift();
                    //去重
                    var tempArr2 = [];
                    tempArr.forEach(function(v){
                        if(tempArr2.indexOf(v)<0){
                            tempArr2.push(v);
                        }
                    });
                    tempArr = tempArr2;
                    var afterStr = '';
                    if(tempArr.length>5){
                        tempArr.splice(5, tempArr.length-5);
                        afterStr = chapterContainerI18n[1];
                    }
                    entitys = tempArr.join(chapterContainerI18n[3])+afterStr;
                }
                var other = chapterContainerI18n[2].formatEL({
                    name3: entitys+afterStr
                });
                if(v.entity.length == 1){
                    other = '';
                }
                var text = '<p'+indextStyle+'>'+chapterContainerI18n[0].formatEL({
                    name1: v.faultName,
                    time1: v.time,
                    time2: v.endTime,
                    name2: v.entity[0].name,
                    other: other,
                    advise: v.entity[0].advince
                })+'</p>';
                var yAxis = v.axis.map(function(v){
                    return {
                        name: v.name,
                        type: 'value'
                    }
                });
                var min30 = 30*60*1000;
                var pointstartTime = new Date(v.time);
                var pointendTime = new Date(v.endTime);
                var chartStartTime = new Date(+pointstartTime - min30).timeFormat(),
                    chartEndTime = pointendTime.timeFormat();

                return {
                    id: ObjectId(),
                    modal: {
                        type: "ChapterContainer",
                        option:{
                            chapterTitle: v.faultName,
                            layouts: [{
                                id: ObjectId(),
                                modal: {
                                    type: "Text",
                                    option:{
                                        text: text
                                    }
                                },
                                spanC:12,
                                spanR:CONFIG.TEXTHEIGHT
                            },{
                                id: ObjectId(),
                                modal: {
                                    type: "Chart",
                                    option:{
                                        chartType:"line",
                                        chartOptions:'{\
                                            "yAxis": '+JSON.stringify(yAxis)+',\
                                            "title": {text:"'+v.title+'"},\
                                            "formatTime": '+CONFIG.FORMAT_TIME+',\
                                            "customFormat": "'+CONFIG.CUSTOM_FORMAT+'"\
                                        }',
                                        legend: v.points.map(v=>v.description),
                                        timeFormat: 'm5',
                                        timeStart: chartStartTime,
                                        timeEnd: chartEndTime
                                    },
                                    points: v.points.map(v=>v.name),
                                    pointsSet: v.points.map(v=>v.set),
                                },
                                spanC:12,
                                spanR:CONFIG.CHARTHEIGHT
                            }],
                            isPageBreak: false,
                        }
                    },
                    spanC:12,
                    spanR:6
                };
            });
            return {
                id: ObjectId(),
                modal: {
                    type: "ChapterContainer",
                    option:{
                        chapterTitle: v.entityType,
                        layouts: layouts,
                        isPageBreak: true,
                    }
                },
                spanC:12,
                spanR:6
            };
        });
    }()
    //图表layouts End
    //汇总layouts Start
    var summary = (function(){
        var summaryI18n = {
            0:'故障名称',
            1:'故障发生个数',
            2:'平均持续时长',
            3:'故障区域',
            4:'发生个数',
            5:'按故障分类时，共计发生{num}类故障:',
            6:'按区域分类时，本周有{num1}个区域发生故障。其中{name}发生故障最多，为{num2}个故障。',
            7:'本项目该周期运行良好'
        }
        if(lan == 'en'){
            summaryI18n = {
                0:'Fault name',
                1:'Fault Number',
                2:'Fault Duration Time',
                3:'Fault area',
                4:'Number of occurrence',
                5:'There are {num} kinds of faults occuring this week according to the fault history, 5 most frequent faults are as below:',
                6:'According to the location of each fault, they are mainly distributed in {num1} zones.There are {num2} faults occurring at {name}, its fault count is the most.',
                7:'The project is good'
            }
        }
        var summary = [];
        var MAXNUM = 5;
        var data = data2;
        var faultTableTh = '<th>'+summaryI18n[0]+'</th>',
            faultTableTd1 = '<td>'+summaryI18n[1]+'</td>',
            faultTableTd2 = '<td>'+summaryI18n[2]+'</td>',
            buildingTableTh = '<th>'+summaryI18n[3]+'</th>',
            buildingTableTd = '<td>'+summaryI18n[4]+'</td>';
        var faultNum = data.fault.length,
            buildingNum = data.building.length,
            faultNameArr = data.fault.map(function(v, index){
                var after = ';';
                if(index == faultNum-1){
                    after = summaryI18n[5];
                }
                if(index == MAXNUM-1 && faultNum>MAXNUM){
                    after = summaryI18n[6]+after;
                }
                return '<li>'+v.name+'</li>';
            });
        if(faultNum>MAXNUM){
            faultNameArr.splice(MAXNUM, faultNum-MAXNUM);
        }
        var faultNames = faultNameArr.join(''),
            moreFaultsBuild = data.building[0]||{};
        data.fault.forEach(function(v, index){
            if(index < MAXNUM){
                faultTableTh+=('<th>'+v.name+'</th>');
                faultTableTd1+=('<td>'+v.count+'</td>');
                faultTableTd2+=('<td>'+v.averageTime+'</td>');
            }
        });
        data.building.forEach(function(v, index){
            buildingTableTh += ('<th>'+v.name+'</th>');
            buildingTableTd += ('<td>'+v.count+'</td>');
            if(v.count > moreFaultsBuild.count){
                moreFaultsBuild = v;
            }
        });
        var html = '<p'+indextStyle+'>'+summaryI18n[5].formatEL({num:faultNum})+'</p>\
            <ul>'+faultNames+'</ul>\
            <p'+indextStyle+'>'+summaryI18n[6].formatEL({num1:buildingNum,name:moreFaultsBuild.name,num2:moreFaultsBuild.count})+'</p>\
            <table><thead><tr>'+faultTableTh+'</tr></thead><tbody><tr>'+faultTableTd1+'</tr><tr>'+faultTableTd2+'</tr></tbody></table>\
            <p> </p>\
            <table><thead><tr>'+buildingTableTh+'</tr></thead><tbody><tr>'+buildingTableTd+'</tr></tbody></table>';
        if(faultNum == 0){
            html = '<p'+indextStyle+'>'+summaryI18n[7]+'</p>';
        }
        var chapterSummary = {
            js: '',
            css: '',
            html: html
        }
        summary.push({
            variables: {},
            chapterNo: "0",
            chapterSummary: chapterSummary
        });
        return {
            id: ObjectId(),
            modal: {
                type: "Summary",
                option:{
                    css: '',
                    js: '',
                    html: '',
                    templateData: [summary]
                }
            },
            spanC:12,
            spanR:6
        }
    })()
    //汇总layouts End
    //附录layouts Start
    var zhEnName = null;
    if(lan === 'zh'){
        zhEnName = {
            area:'区域',
            equipment:'设备',
            chapterTitle:'附录: 故障设备详情',
            0:'，'
        }
    }else{
        zhEnName = {
            area:'Area',
            equipment:'Equipment',
            chapterTitle:'Appendix: faults of equipment details',
            0:','
        }
    }
    var appendixLayouts = data3.map(function(v){
        var trs = '';
        v.buildings.forEach(function(building){
            trs+='<tr><td>'+building.subbuilding+'</td><td style="text-align:left;word-break: break-all;">'+building.equiplist.join(zhEnName[0])+'</td></tr>';
        });
        var html = '<table><thead><tr><th>'+zhEnName.area+'</th><th>'+zhEnName.equipment+'</th></tr><thead><tbody>'+trs+'</tbody></table>';
        return {
            id: ObjectId(),
            modal: {
                type: "ChapterContainer",
                option:{
                    chapterTitle: v.faultName,
                    layouts: [{
                        id: ObjectId(),
                        modal: {
                            type: "Html",
                            option:{
                                css: '',
                                html: html,
                                js: ''
                            }
                        },
                        spanC:12,
                        spanR:1
                    }],
                    isPageBreak: false,
                }
            },
            spanC:12,
            spanR:6
        }
    });
    var appendix = {
        id: ObjectId(),
        modal: {
            type: "ChapterContainer",
            option:{
                chapterTitle: zhEnName.chapterTitle,
                layouts: appendixLayouts,
                isPageBreak: true,
            }
        },
        spanC:12,
        spanR:6
    };
    //附录layouts End
    //故障排名layouts Start
    var faultsRanking = function(){
        var faultsRankingI18n = {
            0:'故障名称',
            1:'故障发生个数',
            2:'平均持续时长',
            3:'故障区域',
            4:'发生个数',
            5:'相关故障举例',
            6:'。',
            7:'其中{name}发生故障最多，共计{num}次故障，平均每次发生时长为{hour}小时',
            8:'其次是{name}，共计{num}次故障，平均每次发生时长为{hour}小时',
            9:'第三是{name}，共计{num}次故障，平均每次发生时长为{hour}小时',
            10:'第四是{name}，共计{num}次故障，平均每次发生时长为{hour}小时',
            11:'第五是{name}，共计{num}次故障，平均每次发生时长为{hour}小时',
            12:'本周共计发生{num}类故障。',
            13:'本周有{num}个区域发生故障。其中{mostName}发生故障最多，为{mostNum}个故障。',
            14:'各区域发生故障个数分别为: {buildingNames}',
            15:'本项目该周期运行良好',
            16:'故障排名',
            17:'按故障名称',
            18:'按区域'
        };
        if(lan === 'en'){
            faultsRankingI18n = {
                0:'Fault name',
                1:'Fault Number',
                2:'Fault Duration Time',
                3:'Fault area',
                4:'Number of occurrence',
                5:'Zone Relative Fault',
                6:'.',
                7:'1. The most one is {name}, which happened {num} times, each time lasts about {hour} hours on average. ',
                8:'2. The second one is {name}, which happened {num} times, each time lasts about {hour} hours on average. ',
                9:'3. The next is {name}, which happened {num} times, each time lasts about {hour} hours on average. ',
                10:'4. The fourth is {name}, which happened {num} times, each time lasts about {hour} hours on average. ',
                11:'5. The last one is {name}, which happened {num} times, each time lasts about {hour} hours on average.',
                12:'There are {num} kinds of faults occuring this week, the top five faults are as follows ranking by fault counts:',
                13:'All faults are mainly distributed in {num} zones. The faults at {mostName} count up to {mostNum} reaching the most. ',
                14:'The fault counts of each zone is as follows: {buildingNames}',
                15:'The project is good',
                16:'Fault Ranking',
                17:'According to name',
                18:'According to zone'
            }
        }
        var summary = [];
        var MAXNUM = 5;
        var data = data2;
        var faultTableTh = '<th>'+faultsRankingI18n[0]+'</th><th>'+faultsRankingI18n[1]+'</th><th>'+faultsRankingI18n[2]+'</th>',
            faultTableTr = '',
            buildingTableTh = '<th>'+faultsRankingI18n[3]+'</th><th>'+faultsRankingI18n[4]+'</th><th>'+faultsRankingI18n[5]+'</th>',
            buildingTableTr = '';
        var faultNum = data.fault.length,
            buildingNum = data.building.length,
            faultNameArr = data.fault.sort(function(v1,v2){return v2.count-v1.count}).map(function(v, index){
                var after = ';';
                if(index == faultNum-1 || index == MAXNUM-1){
                    after = faultsRankingI18n[6];
                }
                faultsRankingI18n[index+7] = faultsRankingI18n[index+7]||'';
                var str = faultsRankingI18n[index+7].formatEL({
                    name: v.name,
                    num:v.count,
                    hour:v.averageTime
                });
                return '<p'+indextStyle+'>'+str+after+'</p>';
            }),
            mostCountOne = {},
            buildingArr = data.building.sort(function(v1,v2){return v2.count-v1.count}).map(function(v, index){
                if(index == 0){
                    mostCountOne = v;
                }
                var after = ';';
                if(index == buildingNum-1 || index == MAXNUM-1){
                    after = faultsRankingI18n[6];
                }
                return ' '+v.name+'('+v.count+')'+after;
            });
        if(faultNum>MAXNUM){
            faultNameArr.splice(MAXNUM, faultNum-MAXNUM);
        }
        var faultNames = faultNameArr.join(''),
            buildingNames = buildingArr.join('');
        data.fault.forEach(function(v, index){
            faultTableTr+=('<tr><td>'+v.name+'</td><td>'+v.count+'</td><td>'+v.averageTime+'</td></tr>');
        });
        data.building.forEach(function(v, index){
            var faultsStr = v.faults;
            if(faultsStr){
                var tempArr = [];
                faultsStr.split(',').forEach(function(v){
                    if(tempArr.indexOf(v)<0){
                        tempArr.push(v);
                    }
                });
                faultsStr = tempArr.join(',');
            }
            buildingTableTr+=('<tr><td>'+v.name+'</td><td>'+v.count+'</td><td>'+(faultsStr||'')+'</td></tr>');
        });
        var html1 = '<p'+indextStyle+'>'+faultsRankingI18n[12].formatEL({num:faultNum})+'</p>\
            '+faultNames+'\
            <table><thead><tr>'+faultTableTh+'</tr></thead><tbody>'+faultTableTr+'</tbody></table>',
            html2 = '<p'+indextStyle+'>'+faultsRankingI18n[13].formatEL({num:buildingNum,mostName:mostCountOne.name,mostNum:mostCountOne.count})+'</p>\
            <p'+indextStyle+'>'+faultsRankingI18n[14].formatEL({buildingNames:buildingNames})+'</p>\
            <table><thead><tr>'+buildingTableTh+'</tr></thead><tbody>'+buildingTableTr+'</tbody></table>';

        if(faultNum == 0){
            html1 = '<p'+indextStyle+'>'+faultsRankingI18n[15]+'</p>';
        }
        if(buildingNum == 0){
            html2 = '<p'+indextStyle+'>'+faultsRankingI18n[15]+'</p>';
        }
        return {
            id: ObjectId(),
            modal: {
                type: "ChapterContainer",
                option:{
                    chapterTitle: faultsRankingI18n[16],
                    layouts: [{
                        id: ObjectId(),
                        modal: {
                            type: "ChapterContainer",
                            option:{
                                chapterTitle: faultsRankingI18n[16]+'--'+faultsRankingI18n[17],
                                layouts: [{
                                    id: ObjectId(),
                                    modal: {
                                        type: "Html",
                                        option:{
                                            css: '',
                                            html: html1,
                                            js: ''
                                        }
                                    },
                                    spanC:12,
                                    spanR:1
                                }],
                                isPageBreak: false,
                            }
                        },
                        spanC:12,
                        spanR:6
                    },{
                        id: ObjectId(),
                        modal: {
                            type: "ChapterContainer",
                            option:{
                                chapterTitle: faultsRankingI18n[16]+'--'+faultsRankingI18n[18],
                                layouts: [{
                                    id: ObjectId(),
                                    modal: {
                                        type: "Html",
                                        option:{
                                            css: '',
                                            html: html2,
                                            js: ''
                                        }
                                    },
                                    spanC:12,
                                    spanR:1
                                }],
                                isPageBreak: false,
                            }
                        },
                        spanC:12,
                        spanR:6
                    }],
                    isPageBreak: true,
                }
            },
            spanC:12,
            spanR:6
        }
    }()
    //故障排名layouts End
    chapterContainer.unshift(summary);
    if(appendixLayouts.length>0){
        chapterContainer.push(faultsRanking,appendix);
    }
    var layouts = [{
        id: ObjectId(),
        modal: {
            type: "ReportContainer",
            option:{
                layouts: chapterContainer,
            }
        },
        spanC:12,
        spanR:6
    }];
    promise0.resolve(layouts);
});

return promise0;