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
    data = data[0].data;
    data2 = data2[0].data;
    data3 = data3[0].data;
    var chapterContainer = data.map(function(v){
        var layouts = v.units.map(function(v){
            var entitys = '';
            if(v.entity.length>1){
                var tempArr = v.entity.map(function(v){return v.name});
                tempArr.shift();
                var afterStr = '';
                if(tempArr.length>5){
                    tempArr.splice(5, tempArr.length-5);
                    afterStr = '等';
                }
                if(lan === 'zh'){
                  var str = tempArr.join(',')+afterStr;
                  entitys = '，其余如'+str+'也有类似问题';
                }else{
                  var str = tempArr.join(',')+'etc.';
                  entitys = '，The rest, such as'+str+'have similar problems';
                }
            }
            if(lan === 'zh'){
              var text = '<p>'+v.faultName+'。例如在从'+v.time+'到'+v.endTime+'的时间段内，'+v.entity[0].name+'有该问题'+entitys+'。'+v.entity[0].advince+'。</p>';
            }else{
              var text = '<p>'+v.faultName+'. For example, in the period from '+v.time+' to '+v.endTime+'，'+v.entity[0].name+'has this problem'+entitys+'.'+v.entity[0].advince+'。</p>';
            }
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
    var summaryTemptale = (function(){
        var summary = [];
        var MAXNUM = 5;
        var data = data2;
        var faultTableTh = '<th>故障名称</th>',
            faultTableTd1 = '<td>故障发生个数</td>',
            faultTableTd2 = '<td>平均持续时长</td>',
            buildingTableTh = '<th>故障区域</th><th>发生个数</th>',
            buildingTableTr = '';
        if(lan === 'en'){
           var faultTableTh = '<th>Fault name</th>',
               faultTableTd1 = '<td>Number of failures</td>',
               faultTableTd2 = '<td>Average duration</td>',
               buildingTableTh = '<th>Fault area</th><th>Number of occurrence</th>';
        }
        var faultNum = data.fault.length,
            buildingNum = data.building.length,
            faultNameArr = data.fault.map(function(v, index){
                var after = ';';
                if(index == faultNum-1){
                    after = '。';
                    if(lan === 'en'){
                      after = '.';
                    }
                }
                if(index == MAXNUM-1 && faultNum>MAXNUM){
                    after = '等。';
                    if(lan === 'en'){
                      after = 'etc.';
                    }
                }
                return '  '+v.name+after;
            });
        if(faultNum>MAXNUM){
            faultNameArr.splice(MAXNUM, faultNum-MAXNUM);
        }
        var faultNames = faultNameArr.join(''),
            moreFaultsBuild = data.building[0]||{};
        data.fault.forEach(function(v, index){
            faultTableTh+=('<th>'+v.name+'</th>');
            faultTableTd1+=('<td>'+v.count+'</td>');
            faultTableTd2+=('<td>'+v.averageTime+'</td>');
        });
        data.building.forEach(function(v, index){
            buildingTableTr+=('<tr><td>'+v.name+'</td><td>'+v.count+'</td></tr>');
            if(v.count > moreFaultsBuild.count){
                moreFaultsBuild = v;
            }
        });
        if(lan === 'zh'){
          var html = '<p>按故障分类时，共计发生'+faultNum+'类故障:</p>\
                <p>'+faultNames+'</p>\
                <p>按区域分类时，本周有'+buildingNum+'个区域发生故障。其中'+moreFaultsBuild.name+'发生故障最多，为'+moreFaultsBuild.count+'个故障。</p>\
                <table><thead><tr>'+faultTableTh+'</tr></thead><tbody><tr>'+faultTableTd1+'</tr><tr>'+faultTableTd2+'</tr></tbody></table>\
                <p> </p>\
                <table><thead><tr>'+buildingTableTh+'</tr></thead><tbody>'+buildingTableTr+'</tbody></table>';
          if(faultNum == 0){
              html = '<p>本项目该周期运行良好</p>';
          }
        }else{
          var html = '<p>When faults are classified, '+faultNum+' types of faults occur:</p>\
                <p>'+faultNames+'</p>\
                <p>By region，There are '+buildingNum+' regional failures this week.Among them, '+moreFaultsBuild.name+' has the most faults and '+moreFaultsBuild.count+' faults.</p>\
                <table><thead><tr>'+faultTableTh+'</tr></thead><tbody><tr>'+faultTableTd1+'</tr><tr>'+faultTableTd2+'</tr></tbody></table>\
                <p> </p>\
                <table><thead><tr>'+buildingTableTh+'</tr></thead><tbody>'+buildingTableTr+'</tbody></table>';
          if(faultNum == 0){
              html = '<p>This project runs well in this cycle</p>';
          }
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

        // summary.push(SuperClass.prototype.getSummary.apply(this, arguments));
        return [summary];
    })()

    var summary = {
        id: ObjectId(),
        modal: {
            type: "Summary",
            option:{
                css: '',
                js: '',
                html: '',
                templateData: summaryTemptale
            }
        },
        spanC:12,
        spanR:6
    };
    var zhEnName = null;
    if(lan === 'zh'){
        zhEnName = {
            area:'区域',
            equipment:'设备',
            chapterTitle:'附录: 故障设备详情'
        }
    }else{
        zhEnName = {
            area:'Area',
            equipment:'Equipment',
            chapterTitle:'Appendix: faults of equipment details'
        }
    }
    var appendixLayouts = data3.map(function(v){
        var trs = '';
        v.buildings.forEach(function(building){
            trs+='<tr><td>'+building.subbuilding+'</td><td style="text-align:left;word-break: break-all;">'+building.equiplist.join(',')+'</td></tr>';
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
    chapterContainer.unshift(summary);
    if(appendixLayouts.length>0){
        chapterContainer.push(appendix);
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